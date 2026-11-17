// Small pictures of the Erklärbär backgrounds for the settings dialog, drawn
// by the player of Textsachen itself (reference/textsachen-player.ts) – like the
// editor of Textsachen, which draws them with the same code at 256 × 144 px.
// The player paints a background on a canvas of its own before the film starts;
// that canvas is taken.
//
//   PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=… node scripts/build-explain-backgrounds.mjs
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const source = fs.readFileSync('src/lib/reference/textsachen-player.ts', 'utf8');
const js = JSON.parse(source.match(/export const TSPLAYER = (".*");/s)[1]);
const designs = [...fs.readFileSync('src/lib/learning/textsachen.ts', 'utf8').match(/EXPLAIN_DESIGNS = \[([\s\S]*?)\] as const/)[1].matchAll(/id: '([a-z]+)'/g)].map((m) => m[1]);
const out = 'public/previews/erklaerbaer';
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
for (const design of designs) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
  const task = { format: 'textsachen-aufgabe', version: 1, id: 'vorschau', title: '', kind: 'text', mode: 'explain', words: [], text: 'Vorschau.', learn: [], textImages: {}, settings: { explain: { design } }, assets: {} };
  await page.setContent(`<div id="r"></div>
<script>window.__canvases=[];const make=document.createElement.bind(document);document.createElement=(tag,...rest)=>{const el=make(tag,...rest);if(String(tag).toLowerCase()==='canvas')__canvases.push(el);return el};</script>
<script>${js.replace(/<\/script/gi, '<\\/script')}</script>
<script>TSPlayer.mount(document.getElementById('r'), ${JSON.stringify(task)}, { noFullscreen: true });</script>`);
  // First the canvas of the film (then put into the page), then the one of the background.
  await page.waitForFunction(() => window.__canvases.length >= 2 && window.__canvases[0].isConnected);
  await page.waitForTimeout(200);
  const url = await page.evaluate(() => {
    const back = window.__canvases.filter((c) => !c.isConnected && c.width === 1280).pop();
    const small = document.createElement('canvas');
    small.width = 256; small.height = 144;
    small.getContext('2d').drawImage(back, 0, 0, 256, 144);
    return small.toDataURL('image/jpeg', 0.85);
  });
  fs.writeFileSync(`${out}/${design}.jpg`, Buffer.from(url.split(',')[1], 'base64'));
  await page.close();
  console.log(design);
}
await browser.close();
