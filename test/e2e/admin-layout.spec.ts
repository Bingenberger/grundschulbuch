import {test,expect,type Page} from '@playwright/test';
import {newPage} from '../../src/lib/notebook-model';
const headers={Origin:'http://localhost:3100'};
async function login(page:Page){
  await page.goto('/anmelden');await page.getByLabel('Name',{exact:true}).fill('Frau Beispiel');await page.getByLabel('PIN',{exact:true}).fill('483920');
  await page.getByRole('button',{name:'Anmelden',exact:true}).click();await expect(page).toHaveURL('/');
  await page.goto('/verwaltung');await page.getByRole('button',{name:'Vorlagen für alle',exact:true}).click();
}

test('Vorlagen erscheinen wieder in aufklappbaren Gruppen; Gruppen und Gesamtliste sind umschaltbar',async({page})=>{
  await login(page);
  const view=page.getByRole('group',{name:'Vorlagenansicht'});
  await expect(view.getByRole('button',{name:'Gruppen',exact:true})).toHaveAttribute('aria-pressed','true');
  const paper=page.getByRole('region',{name:'Vorlagengruppe: Papier & Lineatur',exact:true});
  const art=page.getByRole('region',{name:'Vorlagengruppe: Gestalten',exact:true});
  await paper.getByRole('button',{name:/Papier & Lineatur/}).click();await expect(paper.locator('.admin-template').first()).toBeVisible();
  await art.getByRole('button',{name:/Gestalten/}).click();await expect(art.locator('.admin-template').first()).toBeVisible();
  await expect(paper.getByRole('button',{name:/Papier & Lineatur/})).toHaveAttribute('aria-expanded','true');
  for(const width of [320,768,1440]){
    await page.setViewportSize({width,height:1000});
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
  await page.getByLabel('Vorlagen durchsuchen').fill('Urkunde');
  await expect(page.locator('.admin-template-group')).toHaveCount(1);await expect(page.locator('.admin-template')).toHaveCount(1);
  await page.getByLabel('Vorlagen durchsuchen').fill('');await page.getByRole('button',{name:'Alle Gruppen öffnen',exact:true}).click();
  expect(await page.locator('.admin-template').count()).toBeGreaterThan(20);
  await page.getByRole('button',{name:'Alle Gruppen schließen',exact:true}).click();await expect(page.locator('.admin-template')).toHaveCount(0);
  await view.getByRole('button',{name:'Liste',exact:true}).click();await expect(page.locator('.admin-template')).toHaveCount(20);
  await view.getByRole('button',{name:'Gruppen',exact:true}).click();
  await page.getByLabel('Vorlagenkategorie',{exact:true}).selectOption('Beruf & Praktikum');await expect(page.locator('.admin-template')).toHaveCount(6);
  await page.getByLabel('Vorlagen durchsuchen').fill('Tagesbericht');await page.getByLabel('Vorlagen durchsuchen').fill('');
  await expect(page.locator('.admin-template')).toHaveCount(6);
});

test('Vorlagenverwaltung begrenzt die Liste und kombiniert Suche, Kategorie, Freigabe und Klassen-Ausnahmen',async({page})=>{
  await login(page);await page.getByRole('group',{name:'Vorlagenansicht'}).getByRole('button',{name:'Liste',exact:true}).click();await expect(page.locator('.admin-template')).toHaveCount(20);
  await page.setViewportSize({width:768,height:1000});
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.screenshot({path:'/tmp/grundschulbuch-admin-list-768.png',fullPage:false});
  await page.setViewportSize({width:1440,height:1000});
  const nav=page.getByRole('navigation',{name:'Vorlagenseiten oben'});
  await nav.getByRole('button',{name:'Nächste Vorlagenseite'}).click();await expect(nav).toContainText('Seite 2 von');
  await page.getByLabel('Vorlagenkategorie',{exact:true}).selectOption('Beruf & Praktikum');
  await expect(page.locator('.admin-template')).toHaveCount(6);await expect(nav).toHaveCount(0);
  await page.getByLabel('Vorlagen durchsuchen').fill('Tagesbericht');await expect(page.locator('.admin-template')).toHaveCount(1);
  await page.getByLabel('Vorlagen nach Freigabe filtern').selectOption('disabled');await expect(page.locator('.admin-template')).toHaveCount(0);
  await page.getByRole('button',{name:'Filter zurücksetzen'}).click();await expect(page.locator('.admin-template')).toHaveCount(20);
  await page.getByLabel('Vorlagen durchsuchen').fill('Urkunde');
  const row=page.getByRole('article',{name:'Vorlage: Urkunde',exact:true});
  await row.getByLabel('Freigabe: Urkunde',{exact:true}).selectOption('false');await expect(row).toContainText('Gesperrt');
  await page.getByLabel('Vorlagen nach Freigabe filtern').selectOption('disabled');await expect(row).toBeVisible();
  await row.getByLabel('Freigabe: Urkunde',{exact:true}).selectOption('true');await expect(row).toHaveCount(0);
});

test('Vorschauen, lange Namen und Auswahlfelder bleiben bei Desktop-, Tablet- und Handybreite innerhalb der Seite',async({page})=>{
  await login(page);
  const call=async(action:string,body:object)=>{const r=await page.request.post('/api/verwaltung',{headers,data:{action,...body}});expect(r.ok(),await r.text()).toBeTruthy();return r.json();};
  const klass=await call('createClass',{title:'Klasse 2a mit gemeinsamem Unterricht und Förderangeboten'});
  const title='Projektvorlage für die gemeinsame Schülerzeitung und den ausführlichen Wochenrückblick im Praktikum';
  const template=await call('publishTemplate',{title,category:'Fächerübergreifende Projektarbeit',page:newPage('blanko','portrait')});
  try {
    await page.reload();await page.getByRole('button',{name:'Vorlagen für alle',exact:true}).click();
    await page.getByLabel('Vorlagen verwalten für').selectOption(klass.id);
    await page.getByLabel('Vorlagen durchsuchen').fill(title);
    const row=page.getByRole('article',{name:`Vorlage: ${title}`,exact:true});await expect(row).toBeVisible();
    for(const width of [1440,1024,768,390,320]){
      await page.setViewportSize({width,height:1000});await row.scrollIntoViewIfNeeded();
      await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
      const overflows=await page.locator('.admin-template, .admin-template select, .admin-template-actions button, .admin-template-toolbar input, .admin-template-toolbar select').evaluateAll(nodes=>nodes.flatMap(node=>{
        const b=node.getBoundingClientRect();return b.left<-.5||b.right>innerWidth+.5?[{tag:node.tagName,width:b.width,right:b.right}]:[];
      }));expect(overflows,`Überlauf bei ${width}px`).toEqual([]);
      const preview=row.locator('.template-preview');
      await expect.poll(()=>preview.evaluate(el=>{const paper=el.querySelector('.paper');return !!paper&&paper.getBoundingClientRect().width<=el.getBoundingClientRect().width+1;})).toBe(true);
      await page.screenshot({path:`/tmp/grundschulbuch-admin-layout-${width}.png`,fullPage:true});
    }
    await row.getByLabel(`Einfügeart: ${title}`,{exact:true}).selectOption('fixed');
    await expect(row).toContainText('Klassen-Ausnahme');await expect(row.getByLabel(`Einfügeart: ${title}`,{exact:true})).toBeEnabled();
    await page.getByLabel('Vorlagen nach Freigabe filtern').selectOption('overrides');await expect(row).toBeVisible();
    await row.getByLabel(`Einfügeart: ${title}`,{exact:true}).selectOption('inherit');await expect(row).toHaveCount(0);
  } finally {await call('removeTemplate',{templateId:template.id});await call('deleteClass',{id:klass.id});}
});
