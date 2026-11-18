import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const lists=JSON.parse(await fs.readFile('src/lib/learning/reference-word-lists.json','utf8'));
test('Wortlisten aus Lernsachen-Heft: vier Listen mit Abschnitten und Wörtern',()=>{
 assert.deepEqual(lists.map(l=>l.id),['erste','gws','daz','beruf']);
 for(const l of lists){
  assert.ok(l.name&&l.hint&&l.sections.length,l.id);
  for(const s of l.sections){
   assert.ok(s.name&&s.words.length,`${l.id}/${s.name}`);
   for(const w of s.words){assert.match(w.w,/^[\p{L}][\p{L}\s.'-]*$/u,`${l.id}: ${w.w}`);if('arasaac' in w)assert.ok(Number.isInteger(w.arasaac)&&w.arasaac>0);}
  }
 }
 const gws=lists.find(l=>l.id==='gws');
 assert.ok(gws.sections.find(s=>s.name==='Wörter mit Ei/ei').words.some(w=>w.w==='Seife'));
});
