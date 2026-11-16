import { test, expect, type Page as BrowserPage } from '@playwright/test';
import {openReference,referenceScreenshot} from './reference-pages';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import {referencePaper,paperDesignIds} from '../../src/lib/learning/reference-paper';
import {starterTemplates} from '../../src/lib/generators';
import originals from '../fixtures/page-design-originals.json';
import { designPage } from '../../src/lib/learning/page-designs';
import { blueprints } from '../../src/lib/learning/templates';
const headers={Origin:'http://localhost:3100'};
// Separate SVG primitives and CSS millimetres can rasterise on adjacent pixels.
// Keep the average RGB difference below one percent; layout/style changes exceed this.
const MAX_MEAN_ERROR=255*.01;
async function login(page:BrowserPage){await page.goto('/anmelden');await page.getByLabel('Name',{exact:true}).fill('Frau Beispiel');await page.getByLabel('PIN',{exact:true}).fill('483920');await page.getByRole('button',{name:'Anmelden',exact:true}).click();await expect(page).toHaveURL('/');}

test('Alle Seitenvorlagen entsprechen den Originalgrafiken und Originalelementen',async({page,context})=>{
  test.setTimeout(240000);await login(page);
  const reference=await context.newPage();await openReference(reference);
  const cases=[...originals.map(d=>({id:d.id,page:designPage(d.id)[0],items:d.items})),...Object.entries(paperDesignIds).map(([ruling,id])=>({id,page:referencePaper(ruling as keyof typeof paperDesignIds),items:undefined})),...starterTemplates().map((t,i)=>({id:['profile','comic3','timetable'][i],page:t.page,items:undefined}))];
  const response=await page.request.post('/api/werkstatt',{headers,data:{action:'create',title:'Originalvorlagen',pages:cases.map(d=>d.page)}});
  expect(response.ok(),await response.text()).toBeTruthy();const {book}=await response.json();await page.goto(`/heft/${book.id}`);
  const paper=page.locator('.paper:has(.interaction-surface)');
  const metrics=[];
  for(const [index,design] of cases.entries()){
    if(index)await page.getByRole('button',{name:`Seite ${index+1} öffnen`,exact:true}).click();
    await page.evaluate(async()=>{await document.fonts.ready;});await page.mouse.move(0,0);
    const actual=await paper.screenshot({animations:'disabled'}),box=(await paper.boundingBox())!;
    const expected=await referenceScreenshot(reference,design.id,box,design.id.startsWith('sudoku')?design.items:undefined);
    const [a,b]=await Promise.all([sharp(actual).removeAlpha().raw().toBuffer(),sharp(expected).resize(await sharp(actual).metadata().then(m=>({width:m.width!,height:m.height!}))).removeAlpha().raw().toBuffer()]);
    let sum=0;for(let n=0;n<a.length;n++)sum+=Math.abs(a[n]-b[n]);const error=sum/a.length;metrics.push({id:design.id,error});
    if(error>MAX_MEAN_ERROR){await test.info().attach(`${design.id}-app`,{body:actual,contentType:'image/png'});await test.info().attach(`${design.id}-original`,{body:expected,contentType:'image/png'});}
  }
  await test.info().attach('Originalvergleich',{body:JSON.stringify(metrics,null,2),contentType:'application/json'});
  await fs.writeFile('/tmp/grundschulbuch-template-reference-metrics.json',JSON.stringify(metrics,null,2));
  expect(metrics.filter(m=>m.error>MAX_MEAN_ERROR)).toEqual([]);
});

test('Originalvorlage: Text und Rahmen bearbeiten, als Schulvorlage veröffentlichen und erneut öffnen',async({page})=>{
  await login(page);const meta=blueprints.find(m=>m.referenceId==='certificate')!;
  const initial={...designPage('certificate')[0],template:`bp-${meta.id}`};
  const r=await page.request.post('/api/werkstatt',{headers,data:{action:'create',title:'Vorlage bearbeiten',pages:[initial]}});expect(r.ok()).toBeTruthy();
  const {book,pages}=await r.json(),text=pages[0].elements.find((e:{textHint?:string})=>e.textHint==='Name'),vector=pages[0].elements.find((e:{vectorId?:string})=>e.vectorId);
  await page.goto(`/heft/${book.id}`);
  await page.locator(`.interaction-surface [data-element-id="${text.id}"]`).dblclick();await page.getByRole('textbox',{name:'Text',exact:true}).fill('Unsere Klasse 2a');await page.keyboard.press('Escape');
  const border=page.locator(`.interaction-surface [data-element-id="${vector.id}"]`),bounds=(await border.boundingBox())!;
  await border.click({position:{x:bounds.width/2,y:2}});
  await page.getByRole('button',{name:'Gestalten',exact:true}).click();await page.getByLabel('Füllfarbe',{exact:true}).fill('#fff59d');
  await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
  await page.getByRole('navigation',{name:'Werkzeuge'}).getByRole('button',{name:'Seite',exact:true}).click();
  const bar=page.getByRole('region',{name:'Seite einstellen'});await bar.getByRole('button',{name:'Vorlage',exact:true}).click();await bar.getByLabel('Name der Schulvorlage').fill('Urkunde der Klasse');await bar.getByRole('button',{name:'Für alle veröffentlichen'}).click();
  await expect(bar).toContainText('Aktualisiert');
  const list=await (await page.request.post('/api/werkstatt',{headers,data:{action:'templates'}})).json();const saved=list.find((t:{title:string})=>t.title==='Urkunde der Klasse');
  expect(saved.page.elements.find((e:{textHint?:string})=>e.textHint==='Name').text).toBe('Unsere Klasse 2a');expect(saved.page.elements.find((e:{vectorId?:string})=>e.vectorId===vector.vectorId).fill).toBe('#fff59d');
  await page.reload();await expect(page.locator('.interaction-surface').getByText('Unsere Klasse 2a')).toBeVisible();
  await page.request.post('/api/verwaltung',{headers,data:{action:'removeTemplate',templateId:saved.id}});
});

test('Bildplatzhalter einer Originalvorlage nimmt ein eigenes Bild auf und behält Rahmen und Position',async({page})=>{
  await login(page);
  const r=await page.request.post('/api/werkstatt',{headers,data:{action:'create',title:'Titelbild',pages:designPage('cover')}});
  expect(r.ok()).toBeTruthy();const {book,pages}=await r.json(),slot=pages[0].elements.find((e:{type:string})=>e.type==='image');
  await page.goto(`/heft/${book.id}`);
  await page.locator(`.interaction-surface [data-element-id="${slot.id}"]`).dblclick();
  const dialog=page.getByRole('dialog',{name:'Bild für den Platzhalter',exact:true});
  await dialog.getByLabel('Bilddatei auswählen',{exact:true}).setInputFiles('public/uk/2462.webp');await expect(dialog).toHaveCount(0);
  await expect(page.locator(`.interaction-surface [data-element-id="${slot.id}"] img`)).toBeVisible();
  await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
  const saved=await (await page.request.post('/api/werkstatt',{headers,data:{action:'open',id:book.id}})).json(),image=saved.pages[0].elements.find((e:{id:string})=>e.id===slot.id);
  expect(image.src).toMatch(/^\/api\/medien\//);
  for(const key of ['x','y','width','height','imageFrame','designScale','fit']) expect(image[key]).toBe(slot[key]);
});

test('Neues Lerntagebuch liest Aufträge vor und speichert bearbeitete Vorlesetexte',async({page})=>{
  await page.addInitScript(()=>{
    class Utterance { text:string;constructor(text:string){this.text=text;} }
    Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:Utterance});
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
      getVoices:()=>[{name:'Teststimme',lang:'de-DE',localService:true}],cancel:()=>{},
      speak:(speech:{text:string;onend?:()=>void})=>{sessionStorage.setItem('gesprochener-text',speech.text);setTimeout(()=>speech.onend?.(),25);},
    }});
  });
  await login(page);
  const r=await page.request.post('/api/werkstatt',{headers,data:{action:'create',title:'Lerntagebuch mit Vorlesetasten',pages:designPage('learning-diary')}});
  expect(r.ok()).toBeTruthy();const {book,pages}=await r.json(),speech=pages[0].elements.find((e:{speechText?:string})=>e.speechText);
  await page.goto(`/heft/${book.id}`);
  const button=page.getByRole('button',{name:`Vorlesen: ${speech.alt}`,exact:true});
  await button.click();
  await expect.poll(()=>page.evaluate(()=>sessionStorage.getItem('gesprochener-text'))).toBe(speech.speechText);
  await page.locator(`.interaction-surface [data-element-id="${speech.id}"]`).click({position:{x:0,y:0}});
  await page.getByRole('button',{name:'Gestalten',exact:true}).click();
  await page.getByLabel('Vorlesetext',{exact:true}).fill('Was möchte ich morgen lernen?');
  await page.getByLabel('Vorlesetext',{exact:true}).press('Tab');
  await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
  await page.reload();await button.click();
  await expect.poll(()=>page.evaluate(()=>sessionStorage.getItem('gesprochener-text'))).toBe('Was möchte ich morgen lernen?');
  const saved=await(await page.request.post('/api/werkstatt',{headers,data:{action:'open',id:book.id}})).json();
  expect(saved.pages[0].elements.find((e:{id:string})=>e.id===speech.id).speechText).toBe('Was möchte ich morgen lernen?');
});

test('Fest eingefügte Texthinweise bleiben für Lehrkraft und Kind mehrzeilig beschreibbar',async({page,browser})=>{
  await login(page);
  const p=designPage('diary')[0];p.elements=p.elements.map(e=>({...e,locked:true}));
  const created=await(await page.request.post('/api/werkstatt',{headers,data:{action:'create',title:'Festes Tagebuch',pages:[p]}})).json();
  const hint=created.pages[0].elements.find((e:{textHint?:string})=>e.textHint),label=`Textfeld: ${hint.textHint}`;
  await page.goto(`/heft/${created.book.id}`);await page.getByRole('textbox',{name:label,exact:true}).fill('Heute lerne ich.\nMorgen übe ich.');
  await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();await page.reload();
  await expect(page.getByRole('textbox',{name:label,exact:true})).toHaveValue('Heute lerne ich.\nMorgen übe ich.');
  const call=async(action:string,data:object={})=>{const r=await page.request.post('/api/klassen',{headers,data:{action,...data}});expect(r.ok(),await r.text()).toBeTruthy();return r.json();};
  // Create a temporary class using the ordinary teacher workflow.
  const klass=await call('create',{title:'Textfelder prüfen'});
  const updated=await call('change',{id:klass.id,addChild:'Mia'});
  const childId=updated.children[0].id,copies=await call('distribute',{id:klass.id,bookId:created.book.id});
  const {code}=await call('help',{id:klass.id,childId});
  const context=await browser.newContext(),child=await context.newPage();
  try{
    expect((await child.request.post('/api/kinder',{headers,data:{action:'login',code}})).ok()).toBeTruthy();
    const copy=copies.find((b:{ownerId:string})=>b.ownerId===childId);
    await child.goto(`/kinder/heft/${copy.id}`);
    await child.getByRole('textbox',{name:label,exact:true}).fill('Mein eigener Text\nZweite Zeile\nDritte Zeile');
    await expect(child.getByText('✓ Gespeichert',{exact:true})).toBeVisible();await child.reload();
    await expect(child.getByRole('textbox',{name:label,exact:true})).toHaveValue('Mein eigener Text\nZweite Zeile\nDritte Zeile');
    const stored=await(await page.request.post('/api/werkstatt',{headers,data:{action:'open',id:copy.id}})).json();
    const field=stored.pages[0].elements.find((e:{textHint?:string})=>e.textHint===hint.textHint);
    for(const key of ['x','y','width','height','locked','textLinePitch'])expect(field[key]).toBe(hint[key]);
  }finally{await context.close();await page.request.post('/api/verwaltung',{headers,data:{action:'deleteClass',id:klass.id}});}
});
