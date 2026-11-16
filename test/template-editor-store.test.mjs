import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import crypto from 'node:crypto';
const compiled=await build({stdin:{contents:"export * from './src/lib/editor-store';",resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs',packages:'external'});
const mod={exports:{}};new Function('require','module','exports',compiled.outputFiles[0].text)(createRequire(import.meta.url),mod,mod.exports);
const {useEditor,flushEditor}=mod.exports;
const initial=()=>{const page={id:crypto.randomUUID(),revision:0,orientation:'landscape',ruling:'blanko',elements:[]};return{book:{id:crypto.randomUUID(),title:'Vorlage',pageIds:[page.id]},pages:[page]};};
test('Der Vorlageneditor speichert über seinen Adapter und setzt diesen beim Öffnen eines Hefts zurück',async()=>{
  const data=initial(),calls=[];
  useEditor.getState().load(data,'teacher',async page=>{calls.push(page);return{...page,revision:page.revision+1};});
  useEditor.getState().edit(p=>({...p,paperColor:'#123456'}));
  assert.equal(await flushEditor(),true);assert.equal(calls.length,1);assert.equal(calls[0].paperColor,'#123456');
  assert.equal(useEditor.getState().pages[0].revision,1);assert.deepEqual(useEditor.getState().dirty,{});
  useEditor.getState().load(initial());assert.equal(useEditor.getState().savePage,undefined);
});
test('Versionskonflikte erhalten die lokale Fassung und verhindern weitere automatische Schreibversuche',async()=>{
  let calls=0;useEditor.getState().load(initial(),'teacher',async()=>{calls++;throw Object.assign(new Error('Vorlage wurde inzwischen geändert'),{status:409});});
  useEditor.getState().edit(p=>({...p,paperColor:'#abcdef'}));
  assert.equal(await flushEditor(),false);assert.equal(useEditor.getState().conflict,true);
  assert.equal(useEditor.getState().pages[0].paperColor,'#abcdef');assert.ok(Object.keys(useEditor.getState().dirty).length);
  assert.equal(await flushEditor(),false);assert.equal(calls,1);
  useEditor.getState().load(initial());
});
