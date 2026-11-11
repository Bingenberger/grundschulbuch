import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
async function bundle(file) {
  const code = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', code.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports);
  return compiled.exports;
}
const g = await bundle('src/lib/learning/karaoke.ts');
const { defaultSettings } = await bundle('src/lib/learning/catalog.ts');
const { default: Widget } = await bundle('src/components/learning/Widget.tsx');
const { wavBlob } = await bundle('src/lib/learning/audio.ts');
const portable = await bundle('src/lib/portable.ts');
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-karaoke-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'karaoke-test-only'.padEnd(48, 'x');
after(() => fs.rm(directory, { recursive: true, force: true }));
const books = await import('../src/lib/notebooks.mjs');
const classes = await import('../src/lib/classes.mjs');
const validation = await import('../src/lib/learning/validation.mjs');
const config = patch => ({ ...defaultSettings('karaoke'), ...patch });
const element = (c, state) => ({ id: crypto.randomUUID(), type: 'widget', widgetKind: 'karaoke', x: 15, y: 35, width: 180, height: 180, rotation: 0, locked: false, color: '#253c42', settings: c, ...(state ? { response: state } : {}) });
const page = elements => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements });

test('Neue Liedblätter haben nutzbare Zeilenabstände, alte Einstellungen bleiben erhalten', () => {
  assert.equal(config({}).seconds, 3);
  assert.deepEqual(g.karaokeTimeline(config({ text: 'eins\nzwei', seconds: 60 })).map(cue => cue.at), [0, 60]);
  assert.equal(books.validatePage(page([element(config({}))])).elements[0].widgetKind, 'karaoke');
});
test('LRC-Zeiten mit Sekunden, Hundertsteln und Millisekunden werden genau eingelesen', () => {
  const parsed = g.parseKaraokeLrc('\uFEFF[ar:Eigene Klasse]\r\n[00:03]Hallo\r\n[01:02.35]Welt\r\n[01:05.125]Ende');
  assert.equal(parsed.text, 'Hallo\nWelt\nEnde'); assert.deepEqual(parsed.karaokeTimes, [3, 62.35, 65.125]);
});
test('Wiederholte Zeitmarken werden zu eigenen Zeilen und zeitlich sortiert', () => {
  const parsed = g.parseKaraokeLrc('[00:12][00:03]Refrain\n[00:07]Strophe');
  assert.equal(parsed.text, 'Refrain\nStrophe\nRefrain'); assert.deepEqual(parsed.karaokeTimes, [3, 7, 12]);
});
test('Instrumentalpausen bleiben erhalten und unterbrechen die vorherige Liedzeile', () => {
  const parsed = g.parseKaraokeLrc('[00:00]Start\n[00:05]\n[00:10]Weiter\n[00:15]');
  const cues = g.karaokeTimeline(config(parsed));
  assert.equal(cues.length, 4); assert.equal(cues[1].text, ''); assert.equal(cues[3].text, '');
  assert.deepEqual(g.karaokeActive(cues, 7), [1]);
  assert.equal(g.parseKaraokeLrc(g.exportKaraokeLrc(config(parsed))).text, parsed.text);
});
test('Gleichzeitige Zeilen sind gemeinsam aktiv; vor dem Vorspiel bleibt alles unmarkiert', () => {
  const cues = g.karaokeTimeline(config({ text: 'eins\nzwei\ndrei', karaokeTimes: [4, 4, 9] }));
  assert.deepEqual(g.karaokeActive(cues, 3.999), []); assert.deepEqual(g.karaokeActive(cues, 4), [0, 1]);
  assert.deepEqual(g.karaokeActive(cues, 8.99), [0, 1]); assert.deepEqual(g.karaokeActive(cues, 9), [2]);
});
test('Die Markierung folgt beliebigen Vorwärts- und Rückwärtssprüngen der Abspielzeit', () => {
  const cues = g.karaokeTimeline(config({ text: 'a\nb\nc', karaokeTimes: [1, 3.25, 6.5] }));
  for (const [time, expected] of [[7, [2]], [3.25, [1]], [0, []], [1.1, [0]], [20, [2]], [NaN, []], [-1, []]]) assert.deepEqual(g.karaokeActive(cues, time), expected);
});
test('LRC-Export ist auch bei Rundung über Minutengrenzen wieder einlesbar', () => {
  assert.equal(g.formatKaraokeTime(59.9999), '01:00.000');
  const c = config({ text: 'Start\n[Refrain]\nEnde', karaokeTimes: [0, 60.125, 123.456] });
  assert.deepEqual(g.parseKaraokeLrc(g.exportKaraokeLrc(c)), { text: c.text, karaokeTimes: c.karaokeTimes });
});
test('Ungültige und nicht unterstützte LRC-Dateien ersetzen keinen vorhandenen Zeitplan', () => {
  for (const source of ['ohne Zeit', '[00:60]Fehler', '[00:02.1234]Fehler', '[00:01]Hallo\n[unbekannt:Wert]', '[offset:100]\n[00:01]Hallo', '[00:01]<00:01.2>Hallo', '[00:01]', '[9999:00]zu spät']) assert.throws(() => g.parseKaraokeLrc(source));
  assert.throws(() => g.parseKaraokeLrc('[00:01]Hallo\n'.repeat(301)));
  assert.throws(() => g.parseKaraokeLrc('x'.repeat(100001)));
  assert.deepEqual(g.parseKaraokeLrc('[offset:0]\n[00:01]Hallo').karaokeTimes, [1]);
});
test('Ohne eigenen Zeitplan entsteht eine endliche Textbegleitung einschließlich letzter Zeile', () => {
  const c = config({ text: 'erste\n\nletzte', seconds: 2 });
  assert.deepEqual(g.karaokeTimeline(c), [{ at: 0, text: 'erste' }, { at: 2, text: '' }, { at: 4, text: 'letzte' }]);
  assert.equal(g.karaokeDuration(c), 6); assert.equal(g.karaokeDuration(config({ text: '' })), 0);
});
test('Fehlerhafte importierte Zeitpläne werden vor dem Speichern abgelehnt', () => {
  const c = config({ text: 'eins\nzwei', karaokeTimes: [1, 3] });
  assert.deepEqual(validation.widgetSettings(c).karaokeTimes, [1, 3]);
  for (const times of [[1], [3, 1], [-1, 3], [1, Infinity], [1, '3'], [0, 86401]]) assert.throws(() => validation.widgetSettings({ ...c, karaokeTimes: times }));
  assert.deepEqual(validation.widgetSettings({ ...c, karaokeTimes: [1, 1] }).karaokeTimes, [1, 1]);
});
test('Schreibgeschützte und druckbare Ansichten enthalten das vollständige Liedblatt ohne Autoplay', () => {
  const c = config({ text: 'Erste Zeile\n\nLetzte Zeile', karaokeTimes: [2, 4, 8] });
  const html = renderToStaticMarkup(React.createElement(Widget, { element: element(c) }));
  assert.match(html, /Erste Zeile/); assert.match(html, /Letzte Zeile/); assert.match(html, /Instrumentalpause/);
  assert.match(html, /disabled=""/); assert.doesNotMatch(html, /aria-current/); assert.doesNotMatch(html, /autoplay/i);
});
test('Musik, eigene Aufnahme und Zeitplan bleiben in Kinderheften und portablen Heften erhalten', async () => {
  const owner = crypto.randomUUID(), wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) }).arrayBuffer()), sound = await books.storeAudio(owner, wav);
  const c = config({ text: 'Erste\nZweite', karaokeTimes: [1.125, 4.5], tracks: [{ title: 'Musik', src: sound.src, volume: 0.7, offset: 0 }] }), state = { recordingSrc: sound.src };
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Liedprobe', pages: [page([element(c, state)])] });
  let klass = await classes.createClass(owner, 'Liedklasse'); klass = await classes.changeClass(owner, klass.id, { addChild: 'Ada' });
  const [copy] = await classes.distribute(owner, klass.id, created.book.id), child = klass.children[0].id, own = await books.getBook(child, copy.id);
  assert.equal(own.pages[0].elements[0].locked, true); assert.equal(own.pages[0].elements[0].response, undefined);
  assert.ok(await books.readImage(child, sound.src.split('/').pop()));
  assert.ok(await books.savePage(child, copy.id, { ...own.pages[0], elements: own.pages[0].elements.map(el => ({ ...el, response: state })) }, true));
  const previous = globalThis.fetch;
  globalThis.fetch = async (url, request) => {
    if (url === sound.src) return new Response(await books.readImage(owner, url.split('/').pop()), { headers: { 'content-type': url.endsWith('.wav') ? 'audio/wav' : 'image/png' } });
    if (url === '/api/medien' || url === '/api/ton') { const bytes = Buffer.from(await new Response(request.body).arrayBuffer()); return Response.json(await (url === '/api/ton' ? books.storeAudio(owner, bytes) : books.storeImage(owner, bytes))); }
    assert.equal(url, '/api/werkstatt'); return Response.json(await books.createBook(owner, 'lehrkraft', JSON.parse(request.body)));
  };
  try { const archive = await portable.exportArchive(created), imported = await portable.importPortable(new File([archive], 'lied.grundschulbuch')); assert.deepEqual(imported.pages[0].elements[0].settings, c); assert.deepEqual(imported.pages[0].elements[0].response, state); }
  finally { globalThis.fetch = previous; }
});
