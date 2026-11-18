import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
const load=async(entry)=>{const c=await build({entryPoints:[entry],bundle:true,write:false,platform:'node',format:'cjs'});const m={exports:{}};new Function('require','module','exports',c.outputFiles[0].text)(createRequire(import.meta.url),m,m.exports);return m.exports;};
const {readingSteps,sentenceRanges,elementText}=await load('src/lib/read-page.ts');
const {syllableSegments,syllabify}=await load('src/lib/syllables.ts');
const el=(o)=>({id:o.id,type:'text',x:20,y:20,width:50,height:10,rotation:0,locked:false,color:'#000',...o});
test('Seite vorlesen: von oben nach unten, in einer Zeile von links nach rechts',()=>{
 const steps=readingSteps({elements:[
  el({id:'unten',y:120,text:'Zum Schluss.'}),
  el({id:'rechts',x:120,y:22,text:'Rechts oben.'}),
  el({id:'links',x:10,y:20,runs:[{text:'Links '},{text:'oben.',bold:true}]}),
  el({id:'bild',type:'image',y:60,src:'/api/medien/a.png',alt:'Ein roter Apfel'}),
  el({id:'pdf',type:'image',y:0,src:'/api/medien/b.png',alt:'PDF-Seite 1'}),
  el({id:'ohne',type:'sticker',y:70,symbol:'⭐',alt:''}),
  el({id:'stern',type:'sticker',y:80,symbol:'⭐',alt:'Ein Stern'}),
  el({id:'ton',type:'audio',y:90,src:'/api/ton/x.wav',alt:'Gong'}),
  el({id:'taste',type:'audio',y:100,speechText:'Hallo!'}),
  el({id:'leer',y:110,text:'   '}),
  el({id:'unsichtbar',y:115,text:'Weg',opacity:0}),
  el({id:'uebung',type:'activity',y:30}),
 ]});
 assert.deepEqual(steps.map(s=>s.id),['links','rechts','bild','stern','ton','taste','unten']);
 assert.equal(steps[0].text,'Links oben.');
 assert.deepEqual(steps.map(s=>s.kind),['text','text','say','say','audio','say','text']);
 assert.equal(elementText(el({id:'r',runs:[{text:'a'},{text:'b'}],text:'alt'})),'ab');
});
test('Sätze werden ohne Leerraum zwischen ihnen gefunden',()=>{
 const t='Hallo Kinder! Wir lesen heute…\nNeue Zeile ohne Punkt';
 assert.deepEqual(sentenceRanges(t).map(r=>t.slice(r.start,r.end)),['Hallo Kinder!','Wir lesen heute…','Neue Zeile ohne Punkt']);
 assert.deepEqual(sentenceRanges('  …  '),[]);
});
test('Silben rot und blau: Text bleibt erhalten, jedes Wort beginnt blau',()=>{
 const text='Die Sonne scheint, 3 Kinder spielen Regenbogen.';
 const parts=syllableSegments(text);
 assert.equal(parts.map(p=>p.text).join(''),text);
 assert.deepEqual(syllabify('Sonne').parts,['Son','ne']);
 assert.deepEqual(syllabify('Re-gen-bo-gen').parts,['Re','gen','bo','gen']);
 const sonne=parts.filter(p=>p.text==='Son'||p.text==='ne');
 assert.deepEqual(sonne.map(p=>p.tone),[0,1]);
 assert.ok(parts.filter(p=>/^\W+$|^\d+$/.test(p.text)).every(p=>p.tone===null));
 assert.deepEqual(parts.filter(p=>['Re','gen','bo'].includes(p.text)).map(p=>p.tone),[0,1,0,1]);
});
