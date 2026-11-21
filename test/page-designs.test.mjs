import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
const directory=await fs.mkdtemp(path.join(os.tmpdir(),'grundschulbuch-page-designs-'));
process.env.GRUNDSCHULBUCH_DATA_DIR=directory;
after(()=>fs.rm(directory,{recursive:true,force:true}));
const books=await import('../src/lib/notebooks.mjs');
const compiled=await build({stdin:{contents:"export * from './src/lib/learning/page-designs'; export {templateCatalog} from './src/components/editor/page-templates';",resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs',packages:'external'});
const mod={exports:{}};new Function('require','module','exports',compiled.outputFiles[0].text)(createRequire(import.meta.url),mod,mod.exports);
const {pageDesigns,portraitDesigns,designFor,designPage}=mod.exports;
test('Alle festen Katalogvorlagen und eigene Hochformatseiten starten im Querformat',()=>{
  const saved={id:crypto.randomUUID(),title:'Eigene Seite',page:{...designPage('profile','portrait')[0]}};
  for(const entry of mod.exports.templateCatalog([saved]).filter(e=>!e.configure))assert.equal(entry.build()[0].orientation,'landscape',entry.title);
});
test('Originalhinweise, Schriftmetadaten und Zeilenraster überstehen die Speicherung',()=>{
  for(const design of pageDesigns){
    const p=books.validatePage(designPage(design.id)[0]);
    for(const [i,item] of design.items.entries())if(item.type==='text'){
      const el=p.elements[i];
      if(item.placeholder)assert.equal(el.textHint,item.placeholder,design.id);
      if(item.onLines&&design.grid){assert.equal(el.textLinePitch,p.templateRuling.pitch,design.id);assert.ok(el.referenceFont);}
    }
  }
});
test('Fest eingefügte Vorlagen erlauben Kindern mehrzeiligen Inhalt, aber keine Positionsänderung',async()=>{
  const owner=crypto.randomUUID(),p=designPage('diary')[0];p.elements=p.elements.map(el=>({...el,locked:true}));
  const created=await books.createBook(owner,'kind',{title:'Tagebuch',pages:[p]}),stored=created.pages[0],hint=stored.elements.find(e=>e.textHint);
  const edited={...stored,elements:stored.elements.map(e=>e.id===hint.id?{...e,text:'Heute habe ich gelernt.\nMorgen übe ich weiter.'}:e)};
  const saved=await books.savePage(owner,created.book.id,edited,{features:['text']});
  assert.equal(saved.elements.find(e=>e.id===hint.id).text,edited.elements.find(e=>e.id===hint.id).text);
  await assert.rejects(books.savePage(owner,created.book.id,{...saved,elements:saved.elements.map(e=>e.id===hint.id?{...e,x:e.x+1}:e)},{features:['text']}),e=>e.status===403);
});
test('Veröffentlichte Schulvorlagen bleiben beim Ersetzen früherer Katalogentwürfe erreichbar',()=>{
  const saved={id:crypto.randomUUID(),title:'Unsere Fotoseite',category:'Schulvorlagen',school:true,replaces:'bp-gallery-retired',page:designPage('gallery')[0]};
  const entry=mod.exports.templateCatalog([saved]).find(e=>e.schoolId===saved.id);
  assert.equal(entry.key,saved.replaces);assert.equal(entry.title,saved.title);assert.ok(entry.build('landscape')[0].elements.length);
});
test('Alle Originalvorlagen bestehen aus unabhängigen bearbeitbaren Elementen und gültigen Seiten',()=>{
  assert.equal(pageDesigns.length,84);
  for(const design of pageDesigns) for(const orientation of ['landscape','portrait']) {
    const layout=designFor(design.id,orientation);
    const [page]=designPage(design.id,orientation),[second]=designPage(design.id,orientation);
    const saved=books.validatePage(page);
    assert.equal(saved.backgroundImage,undefined);
    assert.ok(saved.elements.every(el=>!el.locked));
    assert.ok(!saved.elements.some(el=>el.type==='image'&&el.src));
    assert.equal(saved.elements.length,layout.items.length);
    assert.ok(saved.elements.every((el,i)=>el.id!==second.elements[i].id));
    for(const [i,el] of saved.elements.entries()) if(el.vectorId) {
      assert.equal(el.type,'shape');assert.equal(el.vectorId,layout.items[i].vectorId);
    }
  }
});
test('Jede Vorlage hat eine eigene Hochformat-Anordnung mit allen Inhalten auf dem Blatt',()=>{
  assert.equal(portraitDesigns.length,pageDesigns.length);
  const content=item=>item.type+':'+(item.placeholder||item.html||item.label||item.kind||'');
  for(const design of pageDesigns){
    const portrait=designFor(design.id,'portrait');
    assert.ok(portrait,design.id);
    assert.equal(portrait.paper,design.paper);assert.equal(portrait.line,design.line);
    // Every text, picture slot, video and read-aloud button of the original is there (rows may continue).
    const have=new Map();for(const item of portrait.items)if(item.type!=='vector')have.set(content(item),(have.get(content(item))||0)+1);
    for(const item of design.items)if(item.type!=='vector'){const key=content(item);assert.ok(have.get(key)>0,design.id+' fehlt '+key);have.set(key,have.get(key)-1);}
    const [page]=designPage(design.id,'portrait');
    assert.equal(page.orientation,'portrait');
    for(const el of page.elements){
      assert.ok(el.x>=-.5&&el.y>=-.5&&el.x+el.width<=210.5&&el.y+el.height<=297.5,`${design.id}: ${el.type} außerhalb des Blatts`);
    }
    if(design.grid){assert.ok(page.templateRuling,design.id);assert.ok(page.templateRuling.top+page.templateRuling.pitch*(page.templateRuling.count-1)<297,design.id);}
  }
});
test('Neue Seiten sind im Katalog erreichbar; das neue Lerntagebuch ersetzt die bisherige sichtbare Vorlage',()=>{
  const entries=mod.exports.templateCatalog([]);
  assert.equal(new Set(entries.map(e=>e.key)).size,entries.length);
  assert.equal(entries.filter(e=>e.title==='Lerntagebuch').length,1);
  const diary=entries.find(e=>e.title==='Lerntagebuch');
  assert.equal(diary.key,'bp-diary-6-1');
  assert.equal(diary.category,'Schule');
  assert.equal(diary.build('landscape')[0].elements.filter(e=>e.speechText).length,3);
  assert.equal(entries.filter(e=>e.title.startsWith('Schülerzeitung:')).length,9);
  assert.equal(entries.filter(e=>e.category==='Beruf & Praktikum').length,6);
  assert.ok(entries.some(e=>e.title==='Stundenplan'));
  assert.ok(entries.some(e=>e.title==='Ein Kunstwerk betrachten'));
  // Old pages and published school overrides still use the previous key.
  assert.ok(designPage('learning')[0].elements.length);
});
test('Vorlesetexte bleiben bearbeitbar und werden ohne Medienquelle gespeichert; fehlerhafte Texte werden abgewiesen',async()=>{
  const [page]=designPage('learning-diary'),button=page.elements.find(e=>e.speechText);
  assert.equal(button.type,'audio');assert.equal(button.src,undefined);
  assert.equal(button.locked,false);
  button.speechText='Was möchte ich morgen lernen?';button.color='#123456';
  const saved=await books.publishSchoolTemplate(crypto.randomUUID(),{title:'Unser Lerntagebuch',category:'Schule',page});
  const stored=saved.page.elements.find(e=>e.id===button.id);
  assert.equal(stored.speechText,button.speechText);assert.equal(stored.color,button.color);
  for(const invalid of ['', '  ', 42, 'x'.repeat(2001)]){button.speechText=invalid;assert.throws(()=>books.validatePage(page),/Vorlesetext/);}
});
test('Der Stern der Zeitungstitelseite bleibt eine färbbare Form aus dem mitgelieferten Vektorregister',()=>{
  const [page]=designPage('mag-cover'),star=page.elements.find(e=>e.vectorId?.includes('sticker'));
  assert.equal(star.type,'shape');assert.equal(star.fill,'#facc15');assert.equal(star.locked,false);
  star.fill='#123456';star.color='#abcdef';
  const saved=books.validatePage(page).elements.find(e=>e.id===star.id);
  assert.equal(saved.fill,star.fill);assert.equal(saved.color,star.color);assert.equal(saved.vectorId,star.vectorId);
});
test('Leere Texthinweise bleiben mehrzeilig bearbeitbare Texte, ursprüngliche Schriften und Zeilenabstände bleiben erhalten',()=>{
  const [page]=designPage('diary'),hint=page.elements.find(e=>e.textHint?.includes('Tagebuch'));
  assert.equal(hint.text,'');assert.equal(hint.placeholder,undefined);assert.equal(hint.font,'Playwrite DE VA');assert.ok(hint.lineHeight>1.3);
  assert.equal(books.validatePage(page).elements.find(e=>e.id===hint.id).textHint,hint.textHint);
});
test('Bearbeitete Vektoren und Texte werden als Schulvorlage gespeichert und unabhängig kopiert',async()=>{
  const owner=crypto.randomUUID(),[page]=designPage('cover');
  const vector=page.elements.find(e=>e.vectorId),text=page.elements.find(e=>e.textHint);
  Object.assign(vector,{x:vector.x+1,fill:'#ff0000',color:'#123456',strokeWidth:1.2});
  text.text='Unser neues Schulbuch\nKlasse 2a';
  const saved=await books.publishSchoolTemplate(owner,{title:'Unser Titel',category:'Gestalten',page,key:'bp-cover-4-0'});
  assert.equal(saved.page.elements.find(e=>e.id===vector.id).fill,'#ff0000');
  const templates=await books.listTemplates(crypto.randomUUID()),copy=templates.find(t=>t.id===saved.id);
  assert.equal(copy.page.elements.find(e=>e.id===text.id).text,text.text);
  assert.equal(copy.page.elements.find(e=>e.id===vector.id).vectorId,vector.vectorId);
});
test('Nur mitgelieferte Vektoren sind erlaubt; fremdes SVG und unbekannte Kennungen werden nicht übernommen',()=>{
  const [page]=designPage('cover');
  const el=page.elements.find(e=>e.vectorId);
  el.vectorId='<svg onload="alert(1)">';
  assert.throws(()=>books.validatePage(page),/Vorlagenform/);
  el.vectorId='__proto__';assert.throws(()=>books.validatePage(page),/Vorlagenform/);
});
