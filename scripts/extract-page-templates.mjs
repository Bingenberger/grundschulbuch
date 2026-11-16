// Original static page designs, decomposed into individually editable elements.
// No application boot code is evaluated. Chromium measures SVG geometry only.
import fs from 'node:fs/promises';
import ts from 'typescript';
import { transformSync } from 'esbuild';
import { chromium } from '@playwright/test';
const html = await fs.readFile('Lernsachen-Heft-komplett.html','utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter(m=>/\btype=["']module["']/.test(m[1]));
if(scripts.length!==1)throw Error('Main module not uniquely found');
let code = transformSync(scripts[0][2],{loader:'js',minify:false}).code;
let source = ts.createSourceFile('reference.js',code,ts.ScriptTarget.Latest,true);
// Deliberately selected static layouts. Interactive generators are integrated
// separately; never silently discard an unsupported element from a template.
// Find the normalized catalogue by structure, rather than a minifier's name.
const catalogues=[];
for(const st of source.statements) if(ts.isVariableStatement(st)) for(const d of st.declarationList.declarations) {
  const init=d.initializer;
  if(init&&ts.isCallExpression(init)&&ts.isPropertyAccessExpression(init.expression)&&init.expression.name.text==='map'&&['keywords','hidden','group'].every(key=>init.getText(source).includes(key))) catalogues.push(d.name.getText(source));
}
if(catalogues.length!==1)throw Error('Normalized reference catalogue not uniquely found');
code += '\nvar staticPageTemplates = '+catalogues[0]+'.filter(meta => !meta.generator && (!meta.hidden || meta.id === "learning") && (meta.items?.() || []).every(item => ["text","image","embed","audio","sticker"].includes(item.type)));\n';
code += '\nvar textPresentation = item => ({padding:xP(item.shape).padding,centered:["speech","speechRound","thought","shout","whisper","banner"].includes(item.shape),markup:OP(item.shape,"var(--reference-fill)","var(--reference-stroke)",CP(item)),box:awe(item.shape,CP(item))});\n';
const file='/page-reference.js',host=ts.createCompilerHost({allowJs:true,noLib:true});
host.getSourceFile=n=>n===file?ts.createSourceFile(n,code,ts.ScriptTarget.Latest,true):undefined;
host.fileExists=n=>n===file;host.readFile=n=>n===file?code:undefined;
const program=ts.createProgram([file],{allowJs:true,noLib:true},host),checker=program.getTypeChecker();source=program.getSourceFile(file);
const definitions=new Map(),names=new Map();
for(const st of source.statements) for(const node of ts.isVariableStatement(st)?st.declarationList.declarations:ts.isFunctionDeclaration(st)?[st]:[]) {
  if(!node.name||!ts.isIdentifier(node.name))continue;
  const symbol=checker.getSymbolAtLocation(node.name);definitions.set(symbol,node);names.set(node.name.text,symbol);
}
const seen=new Set();
function visit(symbol){if(seen.has(symbol)||!definitions.has(symbol))return;seen.add(symbol);const walk=node=>{if(ts.isIdentifier(node)){const dep=checker.getSymbolAtLocation(node);if(dep!==symbol)visit(dep);}ts.forEachChild(node,walk);};walk(definitions.get(symbol));}
visit(names.get('staticPageTemplates'));
visit(names.get('textPresentation'));
const pure=[...seen].map(s=>definitions.get(s)).sort((a,b)=>a.pos-b.pos).map(n=>ts.isVariableDeclaration(n)?'var '+n.getText(source)+';':n.getText(source)).join('\n');
const {staticPageTemplates,textPresentation}=await import('data:text/javascript;base64,'+Buffer.from(pure+'\nexport {staticPageTemplates,textPresentation};').toString('base64'));
if(staticPageTemplates.some(meta=>!meta))throw Error('Missing selected reference template');
// Preserve the existing exercise examples (Sudoku) while updating metadata.
const previous=new Map(JSON.parse(await fs.readFile('test/fixtures/page-design-originals.json','utf8')).map(meta=>[meta.id,meta]));
const originals=staticPageTemplates.map(meta=>({id:meta.id,title:meta.label,category:meta.group,...(meta.hidden?{hidden:true}:{}),paper:meta.paper,line:meta.line,grid:meta.grid||null,svg:meta.svg(meta.line,meta.paper),items:meta.id.startsWith('sudoku')&&previous.has(meta.id)?previous.get(meta.id).items:(meta.items?.()||[]).map(value=>{const item={...value};delete item.id;return item;})}));
for(const original of originals)for(const item of original.items)if(!['text','image','embed','audio','sticker'].includes(item.type))throw Error('Unsupported original element: '+original.id+' / '+item.type);
console.log(originals.map(t=>`${t.id}: ${t.title}`).join('\n'));
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH});
try {
  const page=await browser.newPage();
  const registry={},templates=[];
  for(const original of originals) {
    const parts=await page.evaluate(original=>{
      document.body.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="990" viewBox="0 0 1400 990" style="position:absolute;left:0;top:0">'+original.svg+'</svg>';
      const svg=document.querySelector('svg'),out=[];
      const hex=c=>{if(c==='none'||c==='transparent')return 'none';const n=c.match(/[\d.]+/g);return n?'#'+n.slice(0,3).map(v=>Math.round(Number(v)).toString(16).padStart(2,'0')).join(''):c;};
      const alpha=c=>c.startsWith('rgba')?Number(c.match(/[\d.]+/g)[3]):1;
      for(const el of svg.querySelectorAll('rect,path,circle,ellipse,line,polyline,polygon,text')) {
        if(el.closest('defs,clipPath,mask'))continue;
        const b=el.getBBox(),m=el.getCTM(),style=getComputedStyle(el);
        if(el.tagName==='text') {
          const anchor=el.getAttribute('text-anchor')||'start',x=Number(el.getAttribute('x')||0),y=Number(el.getAttribute('y')||0),size=parseFloat(style.fontSize),width=el.getComputedTextLength();
          const measure=document.createElement('div'),mark=document.createElement('span');
          Object.assign(measure.style,{position:'absolute',fontFamily:'Arial',fontSize:size+'px',fontWeight:style.fontWeight,lineHeight:'1.2'});
          mark.style.display='inline-block';mark.style.height='0';measure.append(document.createTextNode('X'),mark);document.body.append(measure);
          const baseline=mark.getBoundingClientRect().top-measure.getBoundingClientRect().top;measure.remove();
          out.push({type:'text',x:anchor==='middle'?x-width/2:anchor==='end'?x-width:x,y:y-baseline,w:width+.2,h:size*1.2,size,html:el.textContent,font:'arial',bold:Number(style.fontWeight)>=600,color:hex(style.fill),svgLabel:true});
          continue;
        }
        const points=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f}));
        const xs=points.map(p=>p.x),ys=points.map(p=>p.y),x=Math.min(...xs),y=Math.min(...ys),w=Math.max(.5,Math.max(...xs)-x),h=Math.max(.5,Math.max(...ys)-y);
        let opacity=1;for(let n=el;n&&n!==svg;n=n.parentElement)opacity*=Number(getComputedStyle(n).opacity);
        const copy=el.cloneNode(false);
        for(const name of [...copy.getAttributeNames()]) if(!['d','x','y','width','height','rx','ry','cx','cy','r','x1','x2','y1','y2','points'].includes(name)) copy.removeAttribute(name);
        copy.setAttribute('fill','var(--template-fill)');copy.setAttribute('stroke','var(--template-stroke)');copy.setAttribute('stroke-width','var(--template-width)');
        for(const name of ['fill-opacity','stroke-opacity','stroke-linejoin','stroke-linecap','stroke-dasharray','stroke-dashoffset']) {const val=style.getPropertyValue(name);if(val&&val!=='none')copy.setAttribute(name,val);}
        copy.setAttribute('fill-opacity',Number(style.fillOpacity)*alpha(style.fill));
        copy.setAttribute('stroke-opacity',Number(style.strokeOpacity)*alpha(style.stroke));
        out.push({type:'vector',x,y,w,h,fill:hex(style.fill),color:hex(style.stroke),strokeWidth:parseFloat(style.strokeWidth),opacity,markup:`<g transform="matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})">${copy.outerHTML}</g>`});
      }
      const unsupported=[...svg.querySelectorAll('*')].filter(el=>!['rect','path','circle','ellipse','line','polyline','polygon','text','g','svg'].includes(el.tagName));
      if(unsupported.length) throw Error('Unsupported SVG: '+unsupported.map(e=>e.tagName).join(','));
      return out;
    },original);
    const items=parts.map((part,i)=>{
      if(part.type!=='vector')return part;
      const id=`${original.id}-${i}`,{markup,...rest}=part;
      registry[id]={markup,viewBox:[part.x,part.y,part.w,part.h]};return {...rest,vectorId:id};
    });
    // Ship stickers as whitelisted vectors, retaining their original stacking
    // position. No arbitrary SVG is accepted from a saved notebook.
    const content=original.items.map((item,i)=>{
      if(item.type==='text'){
        const p=textPresentation(item),id=`${original.id}-text-frame-${i}`;
        if(p.markup)registry[id]={markup:p.markup,viewBox:[p.box.x,p.box.y,p.box.w,p.box.h],frame:true};
        return {...item,referencePadding:p.padding,referenceCentered:p.centered,...(p.markup?{referenceFrameId:id}:{})};
      }
      if(item.type!=='sticker')return item;
      if(!item.svg.includes('<polygon ')||!item.svg.includes('viewBox="0 0 200 200"'))throw Error('Unsupported template sticker');
      const id=`${original.id}-sticker-${i}`;
      const polygon=item.svg.match(/<polygon\b[^>]*\/>/)?.[0];
      if(!polygon)throw Error('Missing sticker polygon');
      registry[id]={markup:polygon.replace('fill="$C"','fill="var(--template-fill)"').replace('stroke="#ffffff"','stroke="var(--template-stroke)"').replace('stroke-width="5"','stroke-width="var(--template-width)"'),viewBox:[0,0,200,200]};
      return {type:'vector',x:item.x,y:item.y,w:item.w,h:item.h,rot:item.rot,fill:item.color,color:'#ffffff',strokeWidth:5,opacity:1,vectorId:id};
    });
    templates.push({...original,items:[...items,...content]});
  }
  await fs.writeFile('src/lib/reference/page-templates.json',JSON.stringify(templates,null,2)+'\n');
  await fs.writeFile('src/lib/reference/template-vectors.json',JSON.stringify(registry,null,2)+'\n');
  await fs.mkdir('test/fixtures',{recursive:true});
  await fs.writeFile('test/fixtures/page-design-originals.json',JSON.stringify(originals,null,2)+'\n');
  console.log(`${templates.length} original page templates, ${Object.keys(registry).length} editable vector parts.`);
} finally {await browser.close();}
