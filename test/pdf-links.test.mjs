import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {PDFDocument,PDFName,PDFString,PDFDict,PDFArray} from 'pdf-lib';
const compiled=await build({entryPoints:['src/lib/pdf-links.ts'],bundle:true,write:false,platform:'node',format:'cjs',external:['pdf-lib']});
const mod={exports:{}};new Function('require','module','exports',compiled.outputFiles[0].text)(createRequire(import.meta.url),mod,mod.exports);
const {pdfLinks,addPdfLinks}=mod.exports;
const el=(o)=>({id:o.id||'e',type:'text',x:10,y:20,width:40,height:10,rotation:0,locked:false,color:'#000',...o});
const page=(id,elements,orientation='portrait')=>({id,revision:0,orientation,template:'blanko',elements});
test('Links von Elementen und eingebetteten Seiten werden zu PDF-Flächen',()=>{
 const p=page('a',[
  el({link:{kind:'url',url:'https://example.org/'}}),
  el({link:{kind:'page',pageId:'b'},x:100}),
  el({type:'embed',url:'https://video.example/1',embedKind:'video',y:100}),
  el({link:{kind:'url',url:'javascript:alert(1)'}}),
  el({}),
  el({link:{kind:'url',url:'https://drehen.example/'},rotation:90,x:50,y:50,width:40,height:10}),
  el({link:{kind:'url',url:'https://rand.example/'},x:-20,y:-5,width:40,height:20}),
 ]);
 const links=pdfLinks(p);
 assert.equal(links.length,5);
 assert.deepEqual(links[0],{x:10,y:20,width:40,height:10,uri:'https://example.org/'});
 assert.deepEqual(links[1],{x:100,y:20,width:40,height:10,pageId:'b'});
 assert.equal(links[2].uri,'https://video.example/1');
 // Gedreht: umschließendes Rechteck um die Mitte (70|55)
 assert.ok(Math.abs(links[3].x-65)<1e-9&&Math.abs(links[3].y-35)<1e-9&&Math.abs(links[3].width-10)<1e-9&&Math.abs(links[3].height-40)<1e-9);
 // Am Blattrand abgeschnitten
 assert.deepEqual({x:links[4].x,y:links[4].y,width:links[4].width,height:links[4].height},{x:0,y:0,width:20,height:15});
});
test('Link-Anmerkungen im PDF: Internetadresse und Sprung zu einer Seite im PDF',async()=>{
 const pages=[page('a',[el({link:{kind:'url',url:'https://example.org/'}}),el({link:{kind:'page',pageId:'b'}}),el({link:{kind:'page',pageId:'fehlt'}})]),page('b',[],'landscape')];
 const pdf=await PDFDocument.create();
 const added=pages.map((p)=>pdf.addPage(p.orientation==='landscape'?[841.89,595.28]:[595.28,841.89]));
 addPdfLinks(pdf,pages,added,{PDFName,PDFString});
 const loaded=await PDFDocument.load(await pdf.save());
 const [first,second]=loaded.getPages();
 const annots=first.node.lookup(PDFName.of('Annots'),PDFArray);
 assert.equal(annots.size(),2);
 const uri=annots.lookup(0,PDFDict),jump=annots.lookup(1,PDFDict);
 assert.equal(uri.lookup(PDFName.of('A'),PDFDict).lookup(PDFName.of('URI')).decodeText(),'https://example.org/');
 const rect=uri.lookup(PDFName.of('Rect'),PDFArray).asArray().map((n)=>n.asNumber());
 const k=72/25.4;
 assert.ok(Math.abs(rect[0]-10*k)<0.01&&Math.abs(rect[3]-(841.89-20*k))<0.01);
 assert.equal(jump.lookup(PDFName.of('Dest'),PDFArray).get(0),second.ref);
 assert.equal(second.node.lookup(PDFName.of('Annots')),undefined);
});
