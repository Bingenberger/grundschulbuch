// Capture actual maths tools with example states in an isolated fixture book.
// Requires a production build. Optional: PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
const compiled = await build({ entryPoints: ['src/lib/learning/blocks.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { learningBlocks, fullPageWidget, receiptPage } = mod.exports;
const blocks = learningBlocks.filter(block => block.subject === 'Mathematik');
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
  await page.goto(origin + '/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await page.waitForURL(origin + '/');
  const pages = blocks.map(block => {
    const result = block.pages ? block.pages('landscape')[0] : block.id === 'receipt-page' ? receiptPage('landscape')[0] : fullPageWidget(block.kind, structuredClone(block.preset))[0];
    const element = result.elements.find(el => el.type === 'widget' || el.type === 'activity');
    if (block.kind === 'mathtool') {
      const tool = block.preset.mathTool, n = block.preset.mathSize;
      if (tool === 'boat') element.response = { cells: Array.from({ length: n }, (_, i) => i < Math.ceil(n * .4) ? 1 : i < Math.ceil(n * .7) ? 2 : 0) };
      if (tool === 'abacus') element.response = { rows: Array.from({ length: n }, (_, i) => i < 2 ? 7 - i * 3 : 0) };
    }
    if (block.kind === 'placevalue') element.response = { place: { counts: [2, 3, 4] } };
    if (block.kind === 'dienes') element.response = { dienes: { counts: [1, 2, 3] } };
    if (block.kind === 'numberline') element.response = { numberline: { points: [4, 9, 14], jumps: [{ from: 4, to: 9 }, { from: 9, to: 14 }] } };
    if (block.kind === 'hundredfield') element.response = { field: { dots: Array.from({ length: 100 }, (_, i) => i < 20 ? 1 : i < 35 ? 2 : 0) } };
    return result;
  });
  const response = await page.request.post(origin + '/api/werkstatt', { headers: { Origin: origin }, data: { action: 'create', title: 'Mathematik-Vorschaubilder', pages } });
  if (!response.ok()) throw Error(await response.text());
  const { book } = await response.json();
  await page.goto(origin + '/heft/' + book.id);
  await fs.mkdir('public/previews/math', { recursive: true });
  for (const [index, block] of blocks.entries()) {
    if (index) await page.getByRole('button', { name: `Seite ${index + 1} öffnen`, exact: true }).click();
    await page.locator('.interaction-surface .page-element').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    // A composed worksheet needs its entire paper; individual tools use the SVG bounds.
    const target = block.id === 'receipt-page' ? page.locator('.paper:has(.interaction-surface)') : page.locator('.interaction-surface .page-element').first();
    const png = await target.screenshot({ animations: 'disabled' });
    await sharp(png).trim({ background: '#ffffff', threshold: 8 }).resize(448, 308, { fit: 'contain', background: '#ffffff' }).extend({ top: 16, bottom: 16, left: 16, right: 16, background: '#ffffff' }).webp({ quality: 88 }).toFile(`public/previews/math/${block.id}.webp`);
    console.log(block.id);
  }
  // Verify every card displays its own successfully loaded preview.
  // The server copied public assets at startup; load the newly generated files here.
  await page.route('**/previews/math/*.webp', async route => route.fulfill({ contentType: 'image/webp', body: await fs.readFile('public' + new URL(route.request().url()).pathname) }));
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Mathematik · / }).click();
  await dialog.locator('img[src^="/previews/math/"]').evaluateAll(imgs => imgs.forEach(img => { img.loading = 'eager'; img.src = img.getAttribute('src'); }));
  await page.waitForFunction(n => {
    const imgs = [...document.querySelectorAll('.learning-dialog img[src^="/previews/math/"]')];
    return imgs.length === n && imgs.every(img => img.complete && img.naturalWidth === 480);
  }, blocks.length);
  await page.screenshot({ path: '/tmp/grundschulbuch-math-previews.png', fullPage: true });
  console.log(`${blocks.length} Mathematik-Vorschaubilder erzeugt und in der Auswahl geprüft.`);
} finally {
  await browser?.close(); server.kill('SIGTERM');
  await new Promise(resolve => { if (server.exitCode !== null) resolve(); else server.once('exit', resolve); });
}
