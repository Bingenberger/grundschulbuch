// Capture remaining learning tools with illustrative fixture data, never school records.
// Requires a production build. Optional: PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.
// Pass catalogue IDs as arguments to refresh only those images.
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
const compiled = await build({ stdin: { contents: `export * from './src/lib/learning/blocks'; export {mediaPages} from './src/lib/learning/medien'; export {defaultTimetable} from './src/lib/learning/stundenplan'; export {animationExample} from './src/lib/reference/class-runtime';`, resolveDir: process.cwd() }, bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { learningBlocks, fullPageWidget, mediaPages, defaultTimetable, animationExample } = mod.exports;
const requested = new Set(process.argv.slice(2));
const blocks = learningBlocks.filter(b => b.preview?.startsWith('/previews/tools/') && (!requested.size || requested.has(b.id)));
if(!blocks.length) throw Error('Keine passenden Lernwerkzeuge gefunden.');
const builders = await build({ stdin: { contents: `export {buildExercise,parseText,designOf} from './src/lib/reference/schiebesachen-builder'; export {buildQuiz} from './src/lib/learning/quiz';`, resolveDir: process.cwd() }, bundle: true, write: false, platform: 'browser', format: 'iife', globalName: 'previewBuilders' });
const origin = 'http://localhost:3100';
if (await fetch(origin + '/health/ready').then(r => r.ok).catch(() => false)) throw Error('Port 3100 ist bereits belegt.');
const server = spawn(process.execPath, ['scripts/acceptance-server.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] });
let log = '', browser;
server.stdout.on('data', data => { log = (log + data).slice(-4000); });
server.stderr.on('data', data => { log = (log + data).slice(-4000); });
try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw Error(log);
    if (await fetch(origin + '/health/ready').then(r => r.ok).catch(() => false)) { ready = true; break; }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!ready) throw Error('Vorschauserver startet nicht: ' + log);
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin + '/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await page.waitForURL(origin + '/');
  await page.addScriptTag({ content: builders.outputFiles[0].text });
  async function upload(bytes) {
    const r = await page.request.post(origin + '/api/medien', { headers: { Origin: origin, 'Content-Type': 'image/png' }, data: bytes });
    if (!r.ok()) throw Error(await r.text());
    return (await r.json()).src;
  }
  const words = ['der Apfel', 'die Banane', 'das Brot', 'die Katze', 'der Hund', 'das Haus'];
  const images = await Promise.all(['2462', '2530', '2494', '7114', '7202', '6964'].map(async id => upload(await sharp(await fs.readFile(`public/uk/${id}.webp`)).png().toBuffer())));
  const autumn = await upload(await sharp(await fs.readFile('public/kalender/baum-herbst.webp')).png().toBuffer());
  const poster = 'data:image/webp;base64,'+(await fs.readFile('public/kalender/baum-herbst.webp')).toString('base64');
  // These illustrative embedded contents require no external website or video service.
  await page.route('https://lernen.example.org/**', async route => {
    const film = new URL(route.request().url()).pathname === '/film';
    const contents = film
      ? `<div class="film"><img src="${poster}"/><span class="play">▶</span><footer>▶ ━━━━━━━━━━━━━━━ 0:00 / 2:30 ▣</footer></div>`
      : `<header>Unsere Lernseite <small>Start · Entdecken · Mitmachen</small></header><main><h1>Gemeinsam Neues entdecken</h1><p>Was möchtest du heute lernen?</p><section><article>📖<h2>Lesen</h2>Geschichten und Wörter</article><article>🧮<h2>Rechnen</h2>Zahlen und Formen</article><article>🌳<h2>Entdecken</h2>Natur und Jahreszeiten</article></section></main>`;
    await route.fulfill({ contentType:'text/html',body:`<!doctype html><html lang="de"><style>*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#213c42;background:#eff7ed}header{padding:30px 45px;background:#236861;color:white;font-size:32px;font-weight:bold}small{float:right;font-size:20px;padding-top:8px}main{padding:30px 45px}h1{font-size:42px}p{font-size:24px}section{display:flex;gap:24px;margin-top:40px}article{flex:1;background:white;border-radius:20px;padding:32px 20px;font-size:24px;text-align:center;box-shadow:0 4px 20px #ccdacc}.film{position:relative;height:100vh;background:#162735;display:flex;justify-content:center;align-items:center}.film img{height:85%;max-width:90%;object-fit:contain}.play{position:absolute;color:white;background:#e03131;border-radius:50%;padding:22px 24px 22px 30px;font-size:48px}footer{position:absolute;bottom:0;width:100%;background:#101d29;color:white;padding:16px 24px;font-size:20px}</style>${contents}</html>`});
  });
  // A schematic town is sufficient to demonstrate the map's markers and paths.
  const town = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760"><rect width="1200" height="760" fill="#edf2df"/><path d="M0 560Q500 250 1200 390" stroke="#9bd2ee" stroke-width="100" fill="none"/><g fill="#d8d3c9" stroke="#b9b4aa" stroke-width="3">${Array.from({length:30},(_,i)=>`<rect x="${40+i%10*120}" y="${50+Math.floor(i/10)*240}" width="66" height="90" rx="5"/>`).join('')}</g><g stroke="#fff" fill="none" stroke-width="35"><path d="M0 200H1200M0 460H1200M200 0V760M610 0V760M1010 0V760"/></g><g font-family="sans-serif" font-size="25" fill="#64748b"><text x="250" y="190">Schulstraße</text><text x="650" y="450">Parkweg</text><text x="820" y="660">Stadtpark</text></g><rect x="620" y="510" width="300" height="200" rx="35" fill="#bad8a0"/><circle cx="750" cy="590" r="32" fill="#80b468"/></svg>`;
  const mapImage = await upload(await sharp(Buffer.from(town)).png().toBuffer());
  const pages = [], captures = [];
  for (const block of blocks) {
    const s = structuredClone(block.preset || {});
    if (s.ts) { s.ts.words = words.map((text, i) => ({ text, image: images[i] })); s.ts.settings.speakTask = false; s.ts.settings.shuffle = false; }
    if (s.dnd) {
      Object.assign(s.dnd, { text: words.slice(0,3).join('\n'), autoPictures: false, pictures: words.slice(0,3).map((term,i)=>({term,image:images[i]})) });
      if(['silben','buchstabieren'].includes(s.dnd.format)) {
        s.dnd.text = words.slice(0,3).map(w=>w.replace(/^(der|die|das) /,'')).join('\n');
        s.dnd.pictures = s.dnd.pictures.map(p=>({...p,term:p.term.replace(/^(der|die|das) /,'')}));
      }
      s.dnd.exercise = await page.evaluate(c => {
        const b = window.previewBuilders, pictures = new Map(c.pictures.map(p=>[p.term,{dataUrl:p.image,mime:'image/png',width:300,height:300,name:p.term}]));
        return b.buildExercise(c.format,b.parseText(c.format,c.text),{design:b.designOf(c.design),pictures,dragPictures:c.dragPictures,syllableHelp:c.syllableHelp,syllableColors:c.syllableColors}).exercise;
      }, s.dnd);
    }
    if (s.qz) {
      s.qz.text = '? Welche Jahreszeit kommt nach dem Sommer? [Bild: Herbst]\n(x) Herbst\n( ) Frühling\n( ) Winter\n( ) Sommer';
      s.qz.pictures = [{term:'Herbst',image:autumn,source:'upload'}];
      Object.assign(s.qz.settings, { startCard: false, sounds: false, autoRead: false });
      s.qz.quiz = await page.evaluate(c => window.previewBuilders.buildQuiz(c,'Unser Jahreszeiten-Quiz',new Map()),s.qz);
      if(!s.qz.quiz.questions.length) throw Error('Das Quiz-Beispiel enthält keine Frage.');
    }
    if (block.kind === 'sprechtaste' && !block.pages && block.id !== 'uk-back') s.talk = { label:'Ich',color:'#e7f5ff',img:'/uk/6632.webp' };
    if (block.kind === 'diaschau') { s.title = 'Unsere Jahreszeiten'; s.show = { ...s.show, slides: [{ img: autumn, caption: 'Der Herbst ist da' }, { img: images[0], caption: 'Zeit für die Apfelernte' }] }; }
    if (block.kind === 'trickfilm') s.anim = animationExample();
    if (block.kind === 'karte') { s.title = 'Unser Schulweg'; s.map = { ...s.map, lat:52.52,lon:13.405,zoom:15,design:'klar',img:mapImage,markers:[{lat:52.521,lon:13.405,sym:'school',label:'Schule'},{lat:52.517,lon:13.399,sym:'home',label:'Zuhause'}],paths:[{pts:[[52.517,13.399],[52.517,13.405],[52.521,13.405]],label:'Schulweg',color:'#e03131',width:5,dash:false,dist:true}] }; }
    if (block.kind === 'stundenplan') s.tt = defaultTimetable();
    if (s.tt) for (let d=0;d<5;d++) for(let h=0;h<Math.min(s.tt.lessons,5);h++) s.tt.plan[d][h]=[s.tt.subjects[(d+h)%Math.min(7,s.tt.subjects.length)].id];
    let added;
    if (block.kind === 'medienseite') {
      added = mediaPages({ ...s.medien,url:`https://lernen.example.org/${block.id==='medien-video'?'film':'entdecken'}`,title:block.id==='medien-video'?'Unser Lernvideo':block.id==='medien-qr'?'Unser Klassenprojekt':'Unsere Lernseite',caption:'Entdecken · Lernen · Mitmachen' });
      if (block.id === 'medien-qr') { const img = added[0].elements.find(e=>e.type==='image'); img.src=autumn; delete img.placeholder; }
    } else added = block.pages ? block.pages('landscape') : fullPageWidget(block.kind,s);
    if (block.type === 'activity') {
      const e=added[0].elements[0]; e.type='activity'; delete e.widgetKind; e.activityKind=block.kind;
      if(block.kind==='connect4') {
        Object.assign(e,{x:48,y:10,width:200,height:190});
        e.response={turn:2,board:[...Array(21).fill(0),0,0,1,0,0,0,0,0,1,2,2,0,0,0,1,2,1,1,2,0,0]};
      }
    }
    if (block.kind === 'satzleiste') {
      const e=added[0].elements[0]; e.y=35;e.height=35;
      for(const [i,label,img] of [[0,'ich',6632],[1,'möchte',5441],[2,'essen',6456]]) added[0].elements.push({...e,id:randomUUID(),widgetKind:'sprechtaste',x:35+i*85,y:110,width:60,height:65,settings:{title:label,talk:{label,color:'#e7f5ff',img:`/uk/${img}.webp`}}});
    }
    captures.push({block,index:pages.length,whole:!!block.pages||['medienseite','satzleiste'].includes(block.kind)});
    pages.push(...added);
  }
  const r = await page.request.post(origin+'/api/werkstatt',{headers:{Origin:origin},data:{action:'create',title:'Lernwerkzeug-Vorschaubilder',pages}});
  if (!r.ok()) throw Error(await r.text());
  const {book} = await r.json();
  await page.goto(origin+'/heft/'+book.id);
  await fs.mkdir('public/previews/tools',{recursive:true});
  for (const {block,index,whole} of captures) {
    if(index) await page.getByRole('button',{name:`Seite ${index+1} öffnen`,exact:true}).click();
    const target = whole ? page.locator('.paper:has(.interaction-surface)') : page.locator('.interaction-surface .page-element').first();
    await target.waitFor();
    if(block.kind==='kalenderblatt') {
      await target.locator('[data-cal="start"]').first().click({force:true});
      await target.locator('[data-cal="pick"]').first().waitFor();
    }
    if(block.kind==='medienseite'&&block.id!=='medien-qr') {
      await target.getByRole('button',{name:'Externen Inhalt laden'}).click();
      await target.frameLocator('iframe').locator('body').waitFor();
    }
    if(block.kind==='satzleiste') for(const label of ['ich','möchte','essen']) await target.locator('.talk-key').filter({hasText:label}).click();
    if (['textsachen','zuordnung','quizsachen'].includes(block.kind)) {
      const frame = page.frameLocator('.interaction-surface .textsachen-frame iframe');
      await frame.locator('#lh-root > *').first().waitFor();
      if(await frame.locator('.lh-error').count()) throw Error(block.id+': '+await frame.locator('.lh-error').textContent());
      await frame.locator('body').evaluate(async()=>{await document.fonts.ready;});
    }
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('.interaction-surface img')].map(img=>img.decode().catch(()=>{})));});
    await page.mouse.move(0,0);
    const png = await target.screenshot({animations:'disabled'});
    await sharp(png).resize(448,308,{fit:'contain',background:'#ffffff'}).extend({top:16,bottom:16,left:16,right:16,background:'#ffffff'}).webp({quality:88}).toFile(`public${block.preview}`);
    console.log(block.id);
  }
  if(errors.length) throw Error('Browserfehler: '+errors.join('\n'));
  // Check every catalogue card, including existing music and maths previews.
  await page.route('**/previews/tools/*.webp',async route=>route.fulfill({contentType:'image/webp',body:await fs.readFile('public'+new URL(route.request().url()).pathname)}));
  await page.getByRole('navigation',{name:'Werkzeuge'}).getByRole('button',{name:'Lernwerkzeuge',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Lernwerkzeuge & Übungen'});
  for (const subject of [...new Set(learningBlocks.map(b=>b.subject))]) {
    await dialog.getByRole('navigation',{name:'Fächer'}).getByRole('button',{name:new RegExp('^'+subject.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+' · ')}).click();
    await dialog.locator('img[src^="/previews/"]').evaluateAll(imgs=>imgs.forEach(img=>img.loading='eager'));
    await page.waitForFunction(n=>{const imgs=[...document.querySelectorAll('.learning-dialog img[src^="/previews/"]')];return imgs.length===n&&imgs.every(img=>img.complete&&img.naturalWidth>0);},learningBlocks.filter(b=>b.subject===subject).length);
    await page.screenshot({path:`/tmp/grundschulbuch-previews-${learningBlocks.findIndex(b=>b.subject===subject)}.png`,fullPage:true});
  }
  console.log(`${blocks.length} neue Vorschaubilder erzeugt; alle ${learningBlocks.length} Auswahlkarten geprüft.`);
} finally {
  await browser?.close();server.kill('SIGTERM');
  await new Promise(resolve=>{if(server.exitCode!==null)resolve();else server.once('exit',resolve);});
}
