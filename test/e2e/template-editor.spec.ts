import {test,expect,type Page} from '@playwright/test';
import {blueprints} from '../../src/lib/learning/templates';
const headers={Origin:'http://localhost:3100'};
const key='bp-'+blueprints.find(e=>e.referenceId==='certificate')!.id;
async function login(page:Page){await page.goto('/anmelden');await page.getByLabel('Name',{exact:true}).fill('Frau Beispiel');await page.getByLabel('PIN',{exact:true}).fill('483920');await page.getByRole('button',{name:'Anmelden',exact:true}).click();await expect(page).toHaveURL('/');}
async function admin(page:Page,action:string,body:object={}){const r=await page.request.post('/api/verwaltung',{headers,data:{action,...body}});expect(r.ok(),await r.text()).toBeTruthy();return r.json();}
async function shelfIds(page:Page){return(await(await page.request.post('/api/werkstatt',{headers,data:{action:'list'}})).json()).map((b:{id:string})=>b.id).sort();}

test('Vorlage direkt ändern, erneut öffnen und aktualisieren: derselbe Vorlagenplatz, kein neues Heft und Schutz vor veralteten Fassungen',async({page,context})=>{
  await login(page);const before=await shelfIds(page),writes:string[]=[];
  page.on('request',r=>{if(r.url().endsWith('/api/werkstatt')&&r.method()==='POST'){const action=r.postDataJSON()?.action;if(['create','page','addPage','update'].includes(action))writes.push(action);}});
  await page.goto(`/verwaltung/vorlagen/${key}`);
  const text=page.locator('.interaction-surface').getByText('Name',{exact:true});await text.dblclick();
  await page.getByRole('textbox',{name:'Text',exact:true}).fill('Unsere Klasse 2a');await page.keyboard.press('Escape');
  await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
  const first=(await admin(page,'overview')).templates.find((t:{replaces?:string})=>t.replaces===key);
  try {
    expect(first.page.elements.some((e:{text?:string})=>e.text==='Unsere Klasse 2a')).toBe(true);
    await page.reload();await expect(page.locator('.interaction-surface').getByText('Unsere Klasse 2a',{exact:true})).toBeVisible();
    const secondTab=await context.newPage();await secondTab.goto(`/verwaltung/vorlagen/${key}`);
    await page.locator('.interaction-surface').getByText('Unsere Klasse 2a',{exact:true}).dblclick();
    await page.getByRole('textbox',{name:'Text',exact:true}).fill('Neueste Fassung');await page.keyboard.press('Escape');await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
    await secondTab.locator('.interaction-surface').getByText('Unsere Klasse 2a',{exact:true}).dblclick();
    await secondTab.getByRole('textbox',{name:'Text',exact:true}).fill('Veraltete Fassung');await secondTab.keyboard.press('Escape');
    await expect(secondTab.locator('.error-banner[role="alert"]')).toContainText('Vorlage wurde inzwischen geändert');
    await expect(secondTab.locator('.interaction-surface').getByText('Veraltete Fassung',{exact:true})).toBeVisible();
    await secondTab.close();
    const matches=(await admin(page,'overview')).templates.filter((t:{replaces?:string})=>t.replaces===key);
    expect(matches).toHaveLength(1);expect(matches[0].id).toBe(first.id);
    expect(matches[0].page.elements.some((e:{text?:string})=>e.text==='Neueste Fassung')).toBe(true);
    expect(writes).toEqual([]);expect(await shelfIds(page)).toEqual(before);
    await page.getByRole('button',{name:'Vorlagenverwaltung',exact:true}).click();await expect(page).toHaveURL('/verwaltung?bereich=vorlagen');
    await expect(page.getByRole('heading',{name:'Vorlagen verwalten',exact:true})).toBeVisible();
  } finally {await admin(page,'removeTemplate',{templateId:first.id});}
});

test('Neue Schulvorlage wird direkt angelegt und unter derselben Kennung gespeichert, ohne Heft im Regal',async({page})=>{
  await login(page);const before=await shelfIds(page);
  await page.goto('/verwaltung?bereich=vorlagen');await page.getByRole('button',{name:'Neue Schulvorlage gestalten',exact:true}).click();
  await expect(page).toHaveURL('/verwaltung/vorlagen/neu');
  await page.getByLabel('Vorlagenname',{exact:true}).fill('Unsere neue Vorlage');await page.getByRole('button',{name:'Vorlage speichern',exact:true}).click();
  await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();await expect(page).toHaveURL(/\/verwaltung\/vorlagen\/tpl-[0-9a-f-]+$/);
  const id=page.url().split('/').pop()!.slice(4);
  try {
    await page.getByLabel('Vorlagenname',{exact:true}).fill('Unsere aktualisierte Vorlage');await page.getByRole('button',{name:'Vorlage speichern',exact:true}).click();
    await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
    await page.reload();await expect(page.getByLabel('Vorlagenname',{exact:true})).toHaveValue('Unsere aktualisierte Vorlage');
    const all=(await admin(page,'overview')).templates.filter((t:{id:string})=>t.id===id);expect(all).toHaveLength(1);
    expect(await shelfIds(page)).toEqual(before);
  } finally {await admin(page,'removeTemplate',{templateId:id});}
});
