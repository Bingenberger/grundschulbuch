// Capture real music tools using the isolated acceptance server, never school data.
// Requires a current production build. Optional: PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
const compiled = await build({ entryPoints: ['src/lib/learning/music.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { musicPresets, musicSettings, musicPage } = mod.exports;
const origin = 'http://localhost:3100';
if (await fetch(origin + '/health/ready').then(r => r.ok).catch(() => false)) throw Error('Port 3100 ist bereits belegt.');
const server = spawn(process.execPath, ['scripts/acceptance-server.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] });
let log = '';
server.stdout.on('data', data => { log = (log + data).slice(-4000); });
server.stderr.on('data', data => { log = (log + data).slice(-4000); });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw Error(log);
    if (await fetch(origin + '/health/ready').then(r => r.ok).catch(() => false)) { ready = true; break; }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!ready) throw Error('Vorschauserver startet nicht: ' + log);
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(origin + '/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await page.waitForURL(origin + '/');
  const pages = musicPresets.map(preset => {
    const settings = musicSettings(preset), config = settings.musicConfig;
    if (config.kind === 'hoerspiel') config.hs.clips = [
      { track: 0, start: 0, dur: 30, label: 'Musik', vol: 0.5, mood: 'calm' },
      { track: 1, start: 5, dur: 14, label: 'Erzählen', vol: 1, ph: true },
      { track: 2, start: 2, dur: 8, label: 'Vögel', vol: 1, fx: 'birds' },
      { track: 2, start: 23, dur: 3, label: 'Glocke', vol: 1, fx: 'bell' },
    ];
    if (config.echo) config.echo.voice = false;
    if (preset.id === 'playlist') settings.tracks = ['Unser Lieblingslied', 'Zum Mitsingen', 'Ein Lied für den Morgen', 'Tanzen und Bewegen', 'Ruhige Musik', 'Unser Klassenlied', 'Ein Lied zum Abschied', 'Meine Entdeckung'].map(title => ({ title }));
    return musicPage(settings)[0];
  });
  const response = await page.request.post(origin + '/api/werkstatt', { headers: { Origin: origin }, data: { action: 'create', title: 'Musik-Vorschaubilder', pages } });
  if (!response.ok()) throw Error(await response.text());
  const { book } = await response.json();
  await page.goto(origin + '/heft/' + book.id);
  await fs.mkdir('public/previews/music', { recursive: true });
  for (let index = 0; index < musicPresets.length; index++) {
    const preset = musicPresets[index];
    if (index) await page.getByRole('button', { name: `Seite ${index + 1} öffnen`, exact: true }).click();
    const tool = page.locator('.interaction-surface .music-template');
    await tool.waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (preset.id.startsWith('nq-')) await tool.locator('[data-a="start"]').click();
    if (preset.id.startsWith('fall-')) { await tool.locator('[data-a="start"]').click(); await page.waitForTimeout(700); }
    if (preset.id === 'karaoke') await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Stift', exact: true }).click();
    const png = await tool.screenshot({ animations: 'disabled' });
    await sharp(png).resize(480, 340, { fit: 'contain', background: preset.paper }).webp({ quality: 85 }).toFile(`public/previews/music/${preset.id}.webp`);
    if (preset.id === 'karaoke') await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Auswahl', exact: true }).click();
    console.log(preset.id);
  }
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Musik · / }).click();
  await dialog.getByRole('button', { name: 'Noten lernen', exact: true }).click();
  const sheet = page.getByRole('dialog', { name: 'Noten lernen' }).locator('.sheet-thumb');
  await sheet.waitFor();
  await page.evaluate(() => document.fonts.ready);
  await sharp(await sheet.screenshot()).resize(480, 340, { fit: 'contain', background: '#f4f6f1' }).webp({ quality: 85 }).toFile('public/previews/music/notes.webp');
  console.log('36 Musik-Vorschaubilder erzeugt.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
  await new Promise(resolve => { if (server.exitCode !== null) resolve(); else server.once('exit', resolve); });
}
