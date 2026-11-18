import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
const c=await build({entryPoints:['src/lib/help.ts'],bundle:true,write:false,platform:'node',format:'cjs'});
const m={exports:{}};new Function('require','module','exports',c.outputFiles[0].text)(createRequire(import.meta.url),m,m.exports);
const {helpChapters,helpTopics,helpQuestions,searchHelp}=m.exports;
test('Hilfe: jedes Thema hat ein Kapitel, jede Frage ein Thema, jedes Kapitel Themen',()=>{
 const chapters=new Set(helpChapters.map(c=>c.id)),topics=new Set(helpTopics.map(t=>t.id));
 assert.equal(topics.size,helpTopics.length,'doppelte Themen');
 for(const t of helpTopics)assert.ok(chapters.has(t.chapter),t.id);
 for(const q of helpQuestions)assert.ok(topics.has(q.topic),q.q);
 for(const c of helpChapters)assert.ok(helpTopics.some(t=>t.chapter===c.id),c.id);
});
test('Hilfe-Suche: Titel vor Text, alle Wörter nötig, Umlaute egal',()=>{
 assert.equal(searchHelp('silben')[0].id,'silben');
 assert.equal(searchHelp('drucken')[0].id,'drucken');
 assert.ok(searchHelp('ausdrucken').some(t=>t.id==='drucken'));
 assert.ok(searchHelp('fuller').length===0);
 assert.ok(searchHelp('fueller').some(t=>t.id==='stifte'));
 assert.ok(searchHelp('Füller').some(t=>t.id==='stifte'));
 assert.deepEqual(searchHelp('pdf zzzz'),[]);
 assert.deepEqual(searchHelp(' '),[]);
});
