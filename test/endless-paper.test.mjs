import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
const directory=await fs.mkdtemp(path.join(os.tmpdir(),'grundschulbuch-endless-'));
process.env.GRUNDSCHULBUCH_DATA_DIR=directory;
after(()=>fs.rm(directory,{recursive:true,force:true}));
const books=await import('../src/lib/notebooks.mjs');
const compiled=await build({entryPoints:['src/lib/notebook-model.ts'],bundle:true,write:false,platform:'node',format:'cjs'});
const mod={exports:{}};new Function('require','module','exports',compiled.outputFiles[0].text)(createRequire(import.meta.url),mod,mod.exports);
const {newPage,dimensions,fitsSheet}=mod.exports;
const field=(y,x=20)=>({id:randomUUID(),type:'text',x,y,width:100,height:25,rotation:0,locked:false,color:'#123456',font:'Andika',fontSize:18,text:'Weit draußen'});
test('Endlospapier ist in alle Richtungen offen; bestehendes A4 behält seine Maße',()=>{
 const page=newPage('blanko','landscape');assert.deepEqual(dimensions(page),{width:297,height:210,left:0,top:0});
 page.paperMode='endless';
 // Leere Fläche: erstes Blatt mit 200 mm Rand ringsum, auf 100 mm gerundet.
 assert.deepEqual(dimensions(page),{left:-200,top:-200,width:700,height:700});
 page.elements=[field(1600)];assert.deepEqual(dimensions(page),{left:-200,top:-200,width:700,height:2100});
 page.elements=[field(-900,-1500)];assert.deepEqual(dimensions(page),{left:-1700,top:-1100,width:2200,height:1600});
 // Nach dem Entfernen schrumpft die Fläche wieder.
 page.elements=[];assert.deepEqual(dimensions(page),{left:-200,top:-200,width:700,height:700});
 assert.deepEqual(dimensions({...page,elements:[field(1600)],paperMode:undefined}),{width:297,height:210,left:0,top:0});
});
test('Zurück zu A4 nur, wenn alles auf ein Blatt passt',()=>{
 assert.equal(fitsSheet({elements:[field(20)]},'landscape'),true);
 assert.equal(fitsSheet({elements:[field(20,-30)]},'landscape'),false);
 assert.equal(fitsSheet({elements:[field(250)]},'landscape'),false);
 assert.equal(fitsSheet({elements:[field(250)]},'portrait'),true);
});
test('Texte und Striche weit links, oben und unten bleiben nach dem Speichern erhalten',async()=>{
 const owner=randomUUID(),page={...newPage('blanko','landscape'),paperMode:'endless',elements:[field(1600),field(-2400,-3100)]};
 page.elements.push({id:randomUUID(),type:'stroke',x:-800,y:-1700,width:90,height:10,rotation:0,locked:false,color:'#123456',penWidth:1,opacity:1,points:[{x:0,y:0,pressure:.5},{x:90,y:10,pressure:.8}]});
 const created=await books.createBook(owner,'kind',{title:'Endlos',pages:[page]});
 const saved=await books.savePage(owner,created.book.id,{...created.pages[0],elements:created.pages[0].elements.map(e=>({...e,y:e.y+100}))},{features:['text','pen']});
 const opened=await books.getBook(owner,created.book.id);assert.equal(opened.pages[0].paperMode,'endless');
 assert.equal(opened.pages[0].elements[0].y,1700);
 assert.deepEqual([opened.pages[0].elements[1].x,opened.pages[0].elements[1].y],[-3100,-2300]);
 assert.deepEqual([opened.pages[0].elements[2].x,opened.pages[0].elements[2].y],[-800,-1600]);
 await assert.rejects(books.savePage(owner,created.book.id,{...saved,paperMode:undefined},{features:['text','pen']}));
 assert.throws(()=>books.validatePage({...page,paperMode:'unbekannt'}),/Papiermodus/);
 assert.throws(()=>books.validatePage({...page,paperMode:undefined}));
 // Grenze bleibt: nicht beliebig weit.
 assert.throws(()=>books.validatePage({...page,elements:[field(60000)]}));
 // A4 bleibt bei den bisherigen Grenzen.
 assert.throws(()=>books.validatePage({...newPage('blanko','landscape'),elements:[field(20,-400)]}));
});
