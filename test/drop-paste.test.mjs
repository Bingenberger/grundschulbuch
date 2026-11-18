import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
const compiled=await build({entryPoints:['src/lib/drop-paste.ts'],bundle:true,write:false,platform:'node',format:'cjs'});
const mod={exports:{}};new Function('require','module','exports',compiled.outputFiles[0].text)(createRequire(import.meta.url),mod,mod.exports);
const {fileKind,pastedUrl,embedKindFor}=mod.exports;
test('Hineingezogene Dateien werden nach Art erkannt',()=>{
 assert.equal(fileKind({name:'Foto.JPG',type:''}),'image');
 assert.equal(fileKind({name:'x',type:'image/webp'}),'image');
 assert.equal(fileKind({name:'Gong.m4a',type:''}),'audio');
 assert.equal(fileKind({name:'Blatt.pdf',type:''}),'pdf');
 assert.equal(fileKind({name:'Heft.grundschulbuch',type:'application/zip'}),'book');
 assert.equal(fileKind({name:'Buch.epub',type:''}),'book');
 assert.equal(fileKind({name:'Mein Heft (Heft).html',type:'text/html'}),'book');
 assert.equal(fileKind({name:'Tabelle.xlsx',type:'application/vnd.ms-excel'}),null);
});
test('Eingefügter Text: nur eine einzelne http(s)-Adresse wird ein Internet-Element',()=>{
 assert.equal(pastedUrl('  https://example.org/a b '),null);
 assert.equal(pastedUrl('https://example.org/seite'),'https://example.org/seite');
 assert.equal(pastedUrl('javascript:alert(1)'),null);
 assert.equal(pastedUrl('https://user:pw@example.org/'),null);
 assert.equal(pastedUrl('Hallo Welt'),null);
 assert.equal(embedKindFor('https://www.youtube.com/watch?v=x'),'video');
 assert.equal(embedKindFor('https://youtu.be/x'),'video');
 assert.equal(embedKindFor('https://www.zdf.de/kinder/logo'),'video');
 assert.equal(embedKindFor('https://example.org/film.mp4'),'video');
 assert.equal(embedKindFor('https://example.org/'),'link');
});
