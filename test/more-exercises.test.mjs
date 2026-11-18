import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
const c=await build({entryPoints:['src/lib/learning/textsachen.ts'],bundle:true,write:false,platform:'node',format:'cjs'});
const m={exports:{}};new Function('require','module','exports',c.outputFiles[0].text)(createRequire(import.meta.url),m,m.exports);
const {defaultTs,moreExercises,moreExercise,derivedWords,withoutScenes,textWords}=m.exports;
const reasons=(list)=>Object.fromEntries(list.map(o=>[o.mode,o.reason??'ok']));
test('Wortliste: alle anderen Wort-Übungen, mit Gründen, wo Bilder fehlen',()=>{
 const c={...defaultTs('listen'),words:[{text:'die Sonne',image:'/api/medien/a.png'},{text:'das Haus'}]};
 const o=moreExercises(c);
 assert.deepEqual(o.text,[]);
 const r=reasons(o.words);
 assert.ok(!('listen' in r));
 assert.equal(r.picture,'ok');
 assert.match(r.memory,/2 Wörter mit Bildern/);
 assert.match(r.flash,/3 Wörter mit Bildern/);
 assert.equal(r.wordle,'ok');
 const neu=moreExercise(c,{mode:'memory',kind:'words'});
 assert.equal(neu.mode,'memory');assert.deepEqual(neu.words,c.words);assert.deepEqual(neu.settings,c.settings);
});
test('Text: andere Text-Übungen und Wort-Übungen mit den Bild- bzw. Lernwörtern',()=>{
 const c=defaultTs('read');
 const o=moreExercises(c);
 assert.deepEqual(o.text.map(x=>x.mode),['gaps','type','flash','explain']);
 assert.equal(reasons(o.text).gaps,'ok');
 assert.match(reasons(o.text).flash,/Lernwörter mit Bildern/);
 assert.deepEqual(o.derived.map(w=>w.text),['Igel','Futter','Käfer','Blättern']);
 assert.ok(!o.words.some(x=>x.mode==='flash'),'Blitzlesen mit Wörtern nur für Wortlisten');
 // Mit Bildern zählen nur die Bildwörter.
 const p={...c,pictures:[{word:'igel',image:'/api/medien/i.png'}]};
 assert.deepEqual(derivedWords(p),[{text:'Igel',image:'/api/medien/i.png'}]);
 const w=moreExercise(p,{mode:'picture',kind:'words'});
 assert.equal(w.kind,'words');assert.deepEqual(w.words,[{text:'Igel',image:'/api/medien/i.png'}]);
 assert.equal(moreExercise({...c,learn:[]},{mode:'gaps',kind:'text'}).mode,'gaps');
 assert.match(reasons(moreExercises({...c,learn:[]}).text).gaps,/Lernwörter/);
});
test('Erklärbär: Szenen werden ein durchgehender Text, die Wörter bleiben gleich',()=>{
 const c=defaultTs('explain');
 const t=moreExercise(c,{mode:'gaps',kind:'text'}).text;
 assert.ok(!/\n\s*\n/.test(t));
 assert.deepEqual(textWords(t),textWords(c.text));
 assert.equal(withoutScenes('Ein Satz.\n\nNoch einer'),'Ein Satz. Noch einer');
 assert.equal(withoutScenes('Überschrift\n\nText.'),'Überschrift\nText.');
});
