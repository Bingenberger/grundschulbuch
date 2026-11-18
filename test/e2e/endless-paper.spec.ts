import {test,expect,type Page} from '@playwright/test';
import fs from 'node:fs/promises';
import {unzipSync,strFromU8} from 'fflate';
const headers={Origin:'http://localhost:3100'};
const MM=96/25.4;
type Saved={pages:{paperMode?:string;elements:{type:string;x:number;y:number;width:number;height:number}[]}[]};

async function strokeAt(page:Page,x:number,y:number){
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+50,y+14,{steps:8});await page.mouse.up();
}

test('Endlospapier: in alle Richtungen zeichnen, Ansicht bleibt ruhig, wieder öffnen und ohne PDF speichern',async({page})=>{
 await page.goto('/anmelden');await page.getByLabel('Name',{exact:true}).fill('Frau Beispiel');await page.getByLabel('PIN',{exact:true}).fill('483920');await page.getByRole('button',{name:'Anmelden',exact:true}).click();await expect(page).toHaveURL('/');
 const r=await page.request.post('/api/werkstatt',{headers,data:{action:'create',title:'Endlospapier prüfen'}});expect(r.ok()).toBeTruthy();const {book}=await r.json();
 await page.goto(`/heft/${book.id}`);await page.getByRole('complementary',{name:'Seitenübersicht'}).getByRole('button',{name:'Neue Seite',exact:true}).click();
 const chooser=page.getByRole('dialog',{name:'Neue Seite'});await chooser.getByRole('button',{name:'Endlospapier',exact:true}).click();await chooser.getByRole('searchbox',{name:'Vorlage suchen'}).fill('Blanko');await chooser.getByRole('button',{name:'Vorlage Blanko',exact:true}).click();
 await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
 const paper=page.locator('.paper:has(.interaction-surface)'),scroller=page.locator('.canvas-scroll');
 // Leere Fläche: erstes Blatt mit 200 mm Rand ringsum.
 expect(await paper.evaluate(el=>parseFloat(getComputedStyle(el).width))).toBeCloseTo(700*96/25.4,0);
 expect(await paper.evaluate(el=>parseFloat(getComputedStyle(el).height))).toBeCloseTo(700*96/25.4,0);
 await expect(page.getByRole('button',{name:'Speichern',exact:true})).toBeVisible();

 // Beim Öffnen ist das erste Blatt zu sehen: der Ursprung liegt oben links im sichtbaren Bereich.
 let box=(await paper.boundingBox())!;const view=(await scroller.boundingBox())!;
 const scale=box.width/(700*MM),origin={x:box.x+200*MM*scale,y:box.y+200*MM*scale};
 expect(origin.x).toBeGreaterThan(view.x);expect(origin.x).toBeLessThan(view.x+80);
 expect(origin.y).toBeGreaterThan(view.y);expect(origin.y).toBeLessThan(view.y+80);
 const scrollable=await scroller.evaluate(el=>({x:el.scrollWidth>el.clientWidth,y:el.scrollHeight>el.clientHeight,left:el.scrollLeft,top:el.scrollTop}));
 expect(scrollable.x&&scrollable.y).toBe(true);expect(scrollable.left).toBeGreaterThan(0);expect(scrollable.top).toBeGreaterThan(0);

 // Mit der mittleren Maustaste verschieben.
 await page.mouse.move(view.x+400,view.y+300);await page.mouse.down({button:'middle'});await page.mouse.move(view.x+500,view.y+380,{steps:4});await page.mouse.up({button:'middle'});
 const panned=await scroller.evaluate(el=>({left:el.scrollLeft,top:el.scrollTop}));
 expect(scrollable.left-panned.left).toBeGreaterThan(60);expect(scrollable.top-panned.top).toBeGreaterThan(40);

 // Links oberhalb des ersten Blatts zeichnen: die Fläche wächst nach links und oben, die Zeichnung bleibt unter dem Stift.
 await page.getByRole('navigation',{name:'Werkzeuge'}).getByRole('button',{name:'Stift',exact:true}).click();
 await scroller.evaluate(el=>{el.scrollLeft=0;el.scrollTop=0;});
 box=(await paper.boundingBox())!;
 const start={x:box.x+30,y:box.y+30};
 await strokeAt(page,start.x,start.y);
 const stroke=page.locator('.interaction-surface .page-element').first();
 await expect.poll(async()=>(await paper.evaluate(el=>parseFloat(getComputedStyle(el).width)))).toBeGreaterThan(700*MM+1);
 const drawn=(await stroke.boundingBox())!;
 expect(Math.abs(drawn.x-start.x)).toBeLessThan(12);expect(Math.abs(drawn.y-start.y)).toBeLessThan(12);
 await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();

 // Rechts unten weit außerhalb des ersten Blatts zeichnen.
 await scroller.evaluate(el=>{el.scrollLeft=el.scrollWidth;el.scrollTop=el.scrollHeight;});
 const end=(await scroller.boundingBox())!;
 await strokeAt(page,end.x+end.width-160,end.y+end.height-120);
 await expect(page.locator('.interaction-surface .page-element')).toHaveCount(2);
 await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();

 const saved:Saved=await(await page.request.post('/api/werkstatt',{headers,data:{action:'open',id:book.id}})).json();
 expect(saved.pages[0].paperMode).toBe('endless');
 const els=saved.pages[0].elements;expect(els).toHaveLength(2);
 expect(els.some(e=>e.x<-100&&e.y<-100)).toBe(true);
 expect(els.some(e=>e.x>297&&e.y>210)).toBe(true);

 await page.reload();await expect(page.locator('.interaction-surface .page-element')).toHaveCount(2);
 await page.getByRole('navigation',{name:'Werkzeuge'}).getByRole('button',{name:'Seite',exact:true}).click();
 const settings=page.getByRole('region',{name:'Seite einstellen'});await settings.getByRole('button',{name:'Papier',exact:true}).click();
 await expect(settings.getByRole('button',{name:'Endlospapier',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(settings.getByRole('button',{name:'Hochformat',exact:true})).toBeDisabled();
 await expect(settings.getByRole('button',{name:'Querformat',exact:true})).toBeDisabled();
 // Lineatur läuft über die ganze Fläche, auch links und oberhalb des ersten Blatts.
 await settings.getByRole('button',{name:'Lineatur 1',exact:true}).click();await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();
 const pattern=paper.locator('svg.lineatur pattern');expect(Number(await pattern.getAttribute('height'))).toBeCloseTo(152*297/1400,2);
 const viewBox=(await paper.locator('svg.lineatur').getAttribute('viewBox'))!.split(' ').map(Number);
 expect(viewBox[0]).toBeLessThan(-100);expect(viewBox[1]).toBeLessThan(-100);
 const rect=paper.locator('svg.lineatur > rect');expect(Number(await rect.getAttribute('x'))).toBe(viewBox[0]);expect(Number(await rect.getAttribute('width'))).toBe(viewBox[2]);

 await page.getByRole('button',{name:'Speichern',exact:true}).click();const files=page.getByRole('dialog',{name:'Speichern und teilen'});await expect(files.getByRole('button',{name:/^PDF/})).toBeDisabled();await expect(files.getByRole('button',{name:/Am Drucker drucken/})).toBeDisabled();await expect(files.getByRole('button',{name:/Bearbeitbare Heftdatei/})).toBeVisible();
 const download=page.waitForEvent('download');await files.getByRole('button',{name:/Bearbeitbare Heftdatei/}).click();
 const file=await download,zip=unzipSync(await fs.readFile((await file.path())!)),portable=JSON.parse(strFromU8(zip['heft.json']));
 expect(portable.pages[0].paperMode).toBe('endless');expect(portable.pages[0].elements.some((e:{x:number;y:number})=>e.x<0&&e.y<0)).toBe(true);
 await page.goto(`/drucken/${book.id}`);await expect(page.getByText(/Endlospapier/)).toBeVisible();await expect(page.getByRole('button',{name:'Drucken / als PDF sichern'})).toHaveCount(0);
});
