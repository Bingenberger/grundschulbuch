// Browser oracle: execute the supplied HTML and use its actual page renderer,
// styles and embedded fonts, rather than recreating an expected layout.
import fs from 'node:fs/promises';
import type {Page} from '@playwright/test';
export async function openReference(page:Page){
  let html=await fs.readFile('Lernsachen-Heft-komplett.html','utf8');
  html=html.replace(/(<script\b[^>]*type="module"[^>]*>)([\s\S]*?)(<\/script>)/,(_,start,code,end)=>start+code+'\n;window.__lhReference={catalogue:NL,render:mR};\n'+end);
  await page.route('http://reference.test/**',route=>route.fulfill({contentType:'text/html',body:html}));
  await page.goto('http://reference.test/');
  await page.waitForFunction(()=>!!(window as unknown as {__lhReference?:unknown}).__lhReference);
}
export async function referenceScreenshot(page:Page,id:string,box:{width:number;height:number;x:number;y:number},items?:unknown[]){
  await page.evaluate(({id,box,items})=>{
    const api=(window as unknown as {__lhReference:{catalogue:{id:string;paper:string;line:string;items?:()=>unknown[]}[];render:(page:unknown,options:unknown)=>HTMLElement}}).__lhReference;
    const meta=api.catalogue.find(m=>m.id===id);if(!meta)throw Error('Missing original '+id);
    document.getElementById('reference-host')?.remove();
    const host=document.createElement('div');host.id='reference-host';Object.assign(host.style,{position:'fixed',left:(box.x-Math.floor(box.x))+'px',top:(box.y-Math.floor(box.y))+'px',width:box.width+'px',height:box.height+'px',overflow:'hidden',zIndex:'999999',background:meta.paper});
    const root=api.render({id:'reference',template:id,paper:meta.paper,lineColor:meta.line,items:items||meta.items?.()||[]},{assets:{},placeholders:true,interactive:false});
    root.style.transform=`scale(${box.width/1400})`;root.style.transformOrigin='0 0';host.append(root);document.body.append(host);
  },{id,box,items});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll<HTMLImageElement>('#reference-host img')].map(img=>img.decode().catch(()=>{})));});
  return page.locator('#reference-host').screenshot({animations:'disabled'});
}
