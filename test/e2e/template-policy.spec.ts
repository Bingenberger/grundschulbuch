import {test,expect,type Page as BrowserPage} from '@playwright/test';
import {blueprints} from '../../src/lib/learning/templates';
import {designPage} from '../../src/lib/learning/page-designs';
import {newPage} from '../../src/lib/notebook-model';
import {referencePaper} from '../../src/lib/learning/reference-paper';
const headers={Origin:'http://localhost:3100'};
const key='bp-'+blueprints.find(e=>e.referenceId==='certificate')!.id;
async function login(page:BrowserPage,name='Frau Beispiel') {
  await page.goto('/anmelden');await page.getByLabel('Name',{exact:true}).fill(name);await page.getByLabel('PIN',{exact:true}).fill('483920');
  await page.getByRole('button',{name:'Anmelden',exact:true}).click();await expect(page).toHaveURL('/');
}
async function admin(page:BrowserPage,action:string,body:object={}) {
  const r=await page.request.post('/api/verwaltung',{headers,data:{...body,action}});expect(r.ok(),await r.text()).toBeTruthy();return r.json();
}
async function book(page:BrowserPage,title:string) {
  const r=await page.request.post('/api/werkstatt',{headers,data:{action:'create',title}});expect(r.ok()).toBeTruthy();return r.json();
}
async function open(page:BrowserPage,id:string) {
  return(await page.request.post('/api/werkstatt',{headers,data:{action:'open',id}})).json();
}
test('Schulweite und klassenspezifische Vorlagenregeln werden verwaltet, angewendet und dauerhaft gespeichert',async({page})=>{
  await login(page);const overview=await admin(page,'overview');const me=overview.accounts.find((a:{name:string})=>a.name==='Frau Beispiel');
  const a=await admin(page,'createClass',{title:'Vorlagenklasse A',teacherIds:[me.id]}),b=await admin(page,'createClass',{title:'Vorlagenklasse B',teacherIds:[me.id]});
  try {
    await page.goto('/verwaltung');await page.getByRole('button',{name:'Vorlagen für alle',exact:true}).click();
    await page.getByLabel('Vorlagen durchsuchen').fill('Urkunde');
    const card=page.locator('.admin-template',{hasText:'Urkunde'});await expect(card).toHaveCount(1);
    await card.getByLabel('Einfügeart: Urkunde',{exact:true}).selectOption('fixed');
    await expect(card.getByLabel('Einfügeart: Urkunde',{exact:true})).toBeEnabled();
    await card.getByLabel('Freigabe: Urkunde',{exact:true}).selectOption('false');
    await expect(card).toContainText('ausgeblendet');
    await page.getByLabel('Vorlagen verwalten für').selectOption(a.id);
    await card.getByLabel('Freigabe: Urkunde',{exact:true}).selectOption('true');
    await expect(card).not.toContainText('ausgeblendet');
    await expect(card.getByLabel('Einfügeart: Urkunde',{exact:true})).toHaveValue('inherit');
    await page.reload();await page.getByRole('button',{name:'Vorlagen für alle',exact:true}).click();
    await page.getByLabel('Vorlagen durchsuchen').fill('Urkunde');await page.getByLabel('Vorlagen verwalten für').selectOption(a.id);
    await expect(card.getByLabel('Freigabe: Urkunde',{exact:true})).toHaveValue('true');
    // No class: the school default hides the template. A restores it; B inherits the block.
    const first=await book(page,'Vorlagenregel fest');await page.goto(`/heft/${first.book.id}`);
    await page.getByRole('complementary',{name:'Seitenübersicht'}).getByRole('button',{name:'Neue Seite',exact:true}).click();
    const chooser=page.getByRole('dialog',{name:'Neue Seite'});
    await chooser.getByRole('searchbox',{name:'Vorlage suchen'}).fill('Urkunde');
    await expect(chooser.getByRole('button',{name:'Vorlage Urkunde',exact:true})).toHaveCount(0);
    await chooser.getByLabel('Vorlagen für Klasse').selectOption(b.id);
    await expect(chooser.getByRole('button',{name:'Vorlage Urkunde',exact:true})).toHaveCount(0);
    await chooser.getByLabel('Vorlagen für Klasse').selectOption(a.id);
    await chooser.getByRole('button',{name:'Vorlage Urkunde',exact:true}).click();
    await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
    let saved=await open(page,first.book.id);expect(saved.pages[0].templateClassId).toBe(a.id);expect(saved.pages[0].elements.every((e:{locked:boolean})=>e.locked)).toBe(true);
    // Independent class mode overrides the fixed school setting.
    await admin(page,'templatePolicy',{key,classId:a.id,patch:{insertion:'editable'}});
    const second=await book(page,'Vorlagenregel bearbeitbar');await page.goto(`/heft/${second.book.id}`);
    await page.getByRole('complementary',{name:'Seitenübersicht'}).getByRole('button',{name:'Neue Seite',exact:true}).click();
    await chooser.getByRole('searchbox',{name:'Vorlage suchen'}).fill('Urkunde');await chooser.getByLabel('Vorlagen für Klasse').selectOption(a.id);
    await chooser.getByRole('button',{name:'Vorlage Urkunde',exact:true}).click();await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
    saved=await open(page,second.book.id);expect(saved.pages[0].elements.every((e:{locked:boolean})=>!e.locked)).toBe(true);
    // Earlier pages retain their insertion mode after the policy changes.
    expect((await open(page,first.book.id)).pages[0].elements.every((e:{locked:boolean})=>e.locked)).toBe(true);
    await admin(page,'templatePolicy',{key,classId:a.id,patch:{enabled:null,insertion:null}});
    const blocked=await page.request.post('/api/werkstatt',{headers,data:{action:'addPage',id:second.book.id,page:{...designPage('certificate')[0],template:key,templateClassId:a.id}}});
    expect(blocked.status()).toBe(403);
  } finally {
    await admin(page,'templatePolicy',{key,classId:null,patch:{enabled:true,insertion:null}});
    await admin(page,'deleteClass',{id:a.id});await admin(page,'deleteClass',{id:b.id});
  }
});

test('Lehrkräfte dürfen keine Vorgaben ändern und keine gesperrte Vorlage als Verwaltungsentwurf einfügen',async({page,browser})=>{
  await login(page);await admin(page,'templatePolicy',{key,classId:null,patch:{enabled:false}});
  const other=await browser.newPage();
  try {
    await login(other,'Herr Muster');
    const forbidden=await other.request.post('/api/verwaltung',{headers,data:{action:'templatePolicy',key,patch:{enabled:true}}});expect(forbidden.status()).toBe(403);
    const draft=await other.request.post('/api/werkstatt',{headers,data:{action:'create',title:'Kein Verwaltungsentwurf',templateDraft:true,pages:designPage('certificate').map(p=>({...p,template:key}))}});
    expect(draft.status()).toBe(403);
  } finally {await other.close();await admin(page,'templatePolicy',{key,classId:null,patch:{enabled:true}});}
});

test('Ein bereits offener Editor übernimmt neue serverseitige Sperren auch in die sichtbare Seite',async({page})=>{
  await login(page);await admin(page,'templatePolicy',{key,classId:null,patch:{enabled:true,insertion:'template'}});
  try {
    const created=await book(page,'Geänderte Vorgabe');await page.goto(`/heft/${created.book.id}`);
    // The chooser's client snapshot still has the former insertion mode.
    await admin(page,'templatePolicy',{key,classId:null,patch:{insertion:'fixed'}});
    await page.getByRole('complementary',{name:'Seitenübersicht'}).getByRole('button',{name:'Neue Seite',exact:true}).click();
    const chooser=page.getByRole('dialog',{name:'Neue Seite'});
    await chooser.getByRole('searchbox',{name:'Vorlage suchen'}).fill('Urkunde');await chooser.getByRole('button',{name:'Vorlage Urkunde',exact:true}).click();
    await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
    expect((await open(page,created.book.id)).pages[0].elements.every((e:{locked:boolean})=>e.locked)).toBe(true);
    await expect(page.locator('.interaction-surface .page-element:not(.locked)')).toHaveCount(0);
  } finally {await admin(page,'templatePolicy',{key,classId:null,patch:{insertion:null}});}
});

test('Einstellbare Vorlagen behalten ihre Freigabe und Einfügeart nach dem Einstellungsdialog',async({page})=>{
  await login(page);const cfg='cfg-Uhrzeiten üben';
  await admin(page,'templatePolicy',{key:cfg,classId:null,patch:{enabled:true,insertion:'fixed'}});
  try {
    const created=await book(page,'Feste Uhrzeitvorlage');await page.goto(`/heft/${created.book.id}`);
    await page.getByRole('complementary',{name:'Seitenübersicht'}).getByRole('button',{name:'Neue Seite',exact:true}).click();
    const chooser=page.getByRole('dialog',{name:'Neue Seite'});await chooser.getByRole('searchbox',{name:'Vorlage suchen'}).fill('Uhrzeiten üben');
    await chooser.getByRole('button',{name:'Vorlage Uhrzeiten üben',exact:true}).click();
    const settings=page.getByRole('dialog',{name:'Uhrzeiten üben',exact:true});await settings.getByRole('button',{name:/^\d+ Seiten? einfügen$/}).click();
    await expect(settings).toHaveCount(0);await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
    const saved=await open(page,created.book.id);
    expect(saved.pages.length).toBeGreaterThan(0);
    for(const p of saved.pages){expect(p.template).toBe(cfg);expect(p.elements.length).toBeGreaterThan(0);expect(p.elements.every((e:{locked:boolean})=>e.locked)).toBe(true);}
  } finally {await admin(page,'templatePolicy',{key:cfg,classId:null,patch:{insertion:null}});}
});

test('Kinder und Lehrkräfte im Kinderheft erhalten die Regeln der tatsächlichen Klasse',async({page,browser})=>{
  await login(page);const overview=await admin(page,'overview'),me=overview.accounts.find((a:{name:string})=>a.name==='Frau Beispiel');
  let klass=await admin(page,'createClass',{title:'Papierregeln',teacherIds:[me.id]});
  klass=await admin(page,'changeClass',{id:klass.id,addChild:'Ida'});
  const r=await page.request.post('/api/klassen',{headers,data:{action:'help',id:klass.id,childId:klass.children[0].id}});expect(r.ok()).toBeTruthy();const {code}=await r.json();
  await admin(page,'templatePolicy',{key:'paper-linie1',classId:klass.id,patch:{enabled:false}});
  const context=await browser.newContext(),child=await context.newPage();
  try {
    expect((await child.request.post('/api/kinder',{headers,data:{action:'login',code}})).ok()).toBeTruthy();
    const created=await(await child.request.post('/api/kinder',{headers,data:{action:'create',title:'Mein Papier'}})).json();
    await child.goto(`/kinder/heft/${created.book.id}`);
    await child.getByRole('complementary',{name:'Seitenübersicht'}).getByRole('button',{name:'Neue Seite',exact:true}).click();
    const chooser=child.getByRole('dialog',{name:'Neue Seite'});
    await expect(chooser.getByRole('button',{name:'Vorlage Lineatur 1',exact:true})).toHaveCount(0);
    await expect(chooser.getByRole('button',{name:'Vorlage Lineatur 2',exact:true})).toBeVisible();
    const blocked=await child.request.post('/api/kinder',{headers,data:{action:'addPage',id:created.book.id,page:{...newPage('linie1'),template:'paper-linie2'}}});expect(blocked.status()).toBe(403);
    const picture=await child.request.post('/api/kinder',{headers,data:{action:'addPage',id:created.book.id,page:referencePaper('bildzeilen')}});
    expect(picture.ok(),await picture.text()).toBeTruthy();
    const paperPage=(await picture.json()).page;
    expect(paperPage.paperReferenceId).toBe('picture-lines');expect(paperPage.elements.some((e:{type:string})=>e.type==='image')).toBe(true);
    const spoof=referencePaper('bildzeilen');spoof.elements[0].x+=10;
    expect((await child.request.post('/api/kinder',{headers,data:{action:'addPage',id:created.book.id,page:spoof}})).status()).toBe(403);
    await page.goto(`/heft/${created.book.id}`);await page.getByRole('complementary',{name:'Seitenübersicht'}).getByRole('button',{name:'Neue Seite',exact:true}).click();
    const teacherChooser=page.getByRole('dialog',{name:'Neue Seite'});await teacherChooser.getByRole('searchbox',{name:'Vorlage suchen'}).fill('Lineatur 1');
    await expect(teacherChooser.getByRole('button',{name:'Vorlage Lineatur 1',exact:true})).toHaveCount(0);
    await expect(teacherChooser.getByLabel('Vorlagen für Klasse')).toHaveCount(0);
  } finally {await context.close();await admin(page,'deleteClass',{id:klass.id});}
});
