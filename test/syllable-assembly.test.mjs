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
const g = await bundle('src/lib/learning/syllable-assembly.ts');
const { defaultSettings } = await bundle('src/lib/learning/catalog.ts');
const { default: Activity } = await bundle('src/components/learning/Activity.tsx');
const { wavBlob } = await bundle('src/lib/learning/audio.ts');
const portable = await bundle('src/lib/portable.ts');
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-syllable-assembly-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'syllable-assembly-test-only'.padEnd(48, 'x');
after(() => fs.rm(directory, { recursive: true, force: true }));
const books = await import('../src/lib/notebooks.mjs');
const classes = await import('../src/lib/classes.mjs');
const validation = await import('../src/lib/learning/validation.mjs');
const config = patch => ({ ...defaultSettings('syllables'), ...patch });
const initial = c => g.readAssembly({}, c);
const element = (c, state) => ({ id: crypto.randomUUID(), type: 'activity', activityKind: 'syllables', x: 15, y: 35, width: 180, height: 180, rotation: 0, locked: false, color: '#253c42', settings: c, ...(state ? { response: { syllableAssembly: state } } : {}) });
const page = elements => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements });

const place = (state, c, ids) => ids.reduce((value, tile, slot) => g.assemblyStep(value, c, { type: 'place', slot, tile }), state);
const check = (state, c) => g.assemblyStep(state, c, { type: 'check' });

test('Silbenlesen bleibt ein vorhandenes Format, mit echten Silbenkarten statt Weiterblättern', () => {
  const c = config({ words: ['Ba-na-ne'] });
  assert.equal(books.validatePage(page([element(c)])).elements[0].activityKind, 'syllables');
  const html = renderToStaticMarkup(React.createElement(Activity, { element: element(c) }));
  assert.match(html, /Silbenkarten/); assert.match(html, /Wort prüfen/); assert.match(html, /data-syllable-slot="2"/);
  assert.doesNotMatch(html, /flash-word/);
});
test('Die Karten sind stabil gemischt und enthalten jede Quelle genau einmal', () => {
  const c = config({ words: ['Scho-ko-la-de'] });
  const tiles = g.assemblyTiles(c, 0);
  assert.deepEqual(tiles, g.assemblyTiles(c, 0));
  assert.deepEqual(tiles.map(tile => tile.id).sort(), [0, 1, 2, 3]);
  assert.notDeepEqual(tiles.map(tile => tile.id), [0, 1, 2, 3]);
});
test('Eine Karte kann nur einmal liegen und lässt sich zwischen Feldern verschieben oder zurücklegen', () => {
  const c = config({ words: ['Ba-na-ne'] }); let state = initial(c);
  state = g.assemblyStep(state, c, { type: 'place', slot: 0, tile: 1 });
  state = g.assemblyStep(state, c, { type: 'place', slot: 2, tile: 1 });
  assert.deepEqual(state.placed, [-1, -1, 1]);
  state = g.assemblyStep(state, c, { type: 'place', slot: 2, tile: -1 });
  assert.deepEqual(state.placed, [-1, -1, -1]);
  for (const [slot, tile] of [[3, 1], [-1, 1], [1, 3], [1, -2], [1.2, 1]]) assert.equal(g.assemblyStep(state, c, { type: 'place', slot, tile }), state);
});
test('Unvollständige Wörter werden nicht geprüft, falsche Reihenfolgen lassen sich korrigieren', () => {
  const c = config({ words: ['Ba-na-ne'] }), state = initial(c);
  assert.equal(check(state, c), state);
  const wrong = check(place(state, c, [2, 1, 0]), c);
  assert.equal(wrong.checked, true); assert.equal(wrong.correct, false);
  const changed = g.assemblyStep(wrong, c, { type: 'place', slot: 0, tile: 0 });
  assert.equal(changed.checked, false); assert.deepEqual(changed.placed, [0, 1, -1]);
  const right = check(g.assemblyStep(changed, c, { type: 'place', slot: 2, tile: 2 }), c);
  assert.equal(right.correct, true); assert.equal(g.assemblyScore(right, c), 100);
  assert.equal(g.assemblyStep(right, c, { type: 'place', slot: 0, tile: 2 }), right);
});
test('Gleich geschriebene Silbenkarten sind bei der Bewertung austauschbar', () => {
  const c = config({ words: ['ma-ma'] });
  assert.equal(check(place(initial(c), c, [1, 0]), c).correct, true);
});
test('Unbekannte automatische Trennungen erfordern die Bestätigung einer Lehrkraft', () => {
  const c = config({ words: ['Marmeladenbrot'] }), word = g.assemblyWords(c)[0];
  assert.equal(word.confirmed, false);
  const filled = place(initial(c), c, word.parts.map((_, i) => i)); assert.equal(check(filled, c), filled);
  const accepted = { ...c, syllableConfirmed: [word.parts.join('-')] };
  assert.equal(check(place(initial(accepted), accepted, word.parts.map((_, i) => i)), accepted).correct, true);
});
test('Die Serie endet einmalig, übersprungene Wörter zählen nicht als richtig und Neustart leert alles', () => {
  const c = config({ words: ['Son-ne', 'Blu-me'] }); let state = initial(c);
  assert.equal(g.assemblyStep(state, c, { type: 'next' }), state);
  state = g.assemblyStep(check(place(state, c, [0, 1]), c), c, { type: 'next' });
  assert.equal(state.index, 1); assert.deepEqual(state.results, [true]); assert.equal(g.assemblyScore(state, c), 50);
  state = g.assemblyStep(state, c, { type: 'skip' });
  assert.equal(state.completed, true); assert.deepEqual(state.results, [true, false]); assert.equal(g.assemblyScore(state, c), 50);
  assert.equal(g.assemblyStep(state, c, { type: 'next' }), state);
  assert.deepEqual(g.assemblyStep(state, c, { type: 'restart' }), initial(c));
});
test('Speichern und Wiederherstellen erhalten Platzierungen und prüfen das Ergebnis erneut', () => {
  const c = config({ words: ['Son-ne'] }), state = check(place(initial(c), c, [0, 1]), c);
  assert.deepEqual(g.readAssembly({ syllableAssembly: JSON.parse(JSON.stringify(state)) }, c), state);
  const wrong = g.readAssembly({ syllableAssembly: { ...state, placed: [1, 0], correct: true } }, c);
  assert.equal(wrong.correct, false);
  assert.deepEqual(g.readAssembly({ syllableAssembly: { ...state, placed: [0, 0] } }, c).placed, [0, -1]);
});
test('Hinweis- und Schriftänderungen erhalten den Stand; neue Wörter oder Trennungen starten neu', () => {
  const c = config({ words: ['Son-ne'] }), state = place(initial(c), c, [1, 0]), response = { syllableAssembly: state };
  assert.deepEqual(g.readAssembly(response, { ...c, syllablePrompt: 'word', font: 'Andika', syllableColours: false }), state);
  const next = { ...c, words: ['Blu-me'] }; assert.deepEqual(g.readAssembly(response, next), initial(next));
  assert.deepEqual(g.readAssembly({ index: 1, completed: true }, c), initial(c));
});
test('Zurücksetzen löscht die aktuelle Bewertung, aber keine vorherigen Wörter', () => {
  const c = config({ words: ['Son-ne', 'Blu-me'] });
  const next = g.assemblyStep(check(place(initial(c), c, [0, 1]), c), c, { type: 'next' });
  const reset = g.assemblyStep(check(place(next, c, [0, 1]), c), c, { type: 'reset' });
  assert.deepEqual(reset.results, [true]); assert.deepEqual(reset.placed, [-1, -1]); assert.equal(reset.checked, false); assert.equal(g.assemblyScore(reset, c), 50);
});
test('Nur der ausdrücklich gewählte schriftliche Hinweis zeigt die richtige Reihenfolge', () => {
  const c = config({ words: ['Scho-ko-la-de'], syllablePrompt: 'audio' });
  const html = renderToStaticMarkup(React.createElement(Activity, { element: element(c) }));
  assert.doesNotMatch(html, /Schokolade/); assert.doesNotMatch(html, /syllable-prompt/);
  assert.match(html, /disabled=""/);
  const written = renderToStaticMarkup(React.createElement(Activity, { element: element({ ...c, syllablePrompt: 'word' }) }));
  assert.match(written, /syllable-prompt/);
});
test('Ungültige Zustände, doppelte Karten und fremde Medien werden abgelehnt', () => {
  const c = config({}), state = initial(c);
  assert.deepEqual(validation.learningResponse({ syllableAssembly: state }).syllableAssembly, state);
  for (const patch of [{ index: 30 }, { placed: [0, 0] }, { placed: [12] }, { results: [1] }, { checked: 'ja' }]) assert.throws(() => validation.learningResponse({ syllableAssembly: { ...state, ...patch } }));
  for (const patch of [{ syllablePrompt: 'none' }, { syllableColours: 'ja' }, { words: ['x'.repeat(81)] }, { syllableItems: [{ word: 'Sonne', image: 'https://extern.invalid/bild.png' }] }]) assert.throws(() => validation.widgetSettings({ ...c, ...patch }));
});
test('Wortbilder, Ton und Spielstände werden gespeichert, für Kinder freigegeben und exportiert', async () => {
  const owner = crypto.randomUUID(), png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=', 'base64');
  const picture = await books.storeImage(owner, png), wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) }).arrayBuffer()), sound = await books.storeAudio(owner, wav);
  const c = config({ words: ['Son-ne'], syllablePrompt: 'both', syllableItems: [{ word: 'Sonne', image: picture.src, audio: sound.src }] }), state = place(initial(c), c, [1, 0]);
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Rateprobe', pages: [page([element(c, state)])] });
  let klass = await classes.createClass(owner, 'Rateklasse'); klass = await classes.changeClass(owner, klass.id, { addChild: 'Ada' });
  const [copy] = await classes.distribute(owner, klass.id, created.book.id), child = klass.children[0].id, own = await books.getBook(child, copy.id);
  assert.equal(own.pages[0].elements[0].locked, true); assert.equal(own.pages[0].elements[0].response, undefined);
  assert.ok(await books.readImage(child, picture.src.split('/').pop())); assert.ok(await books.readImage(child, sound.src.split('/').pop()));
  assert.ok(await books.savePage(child, copy.id, { ...own.pages[0], elements: own.pages[0].elements.map(el => ({ ...el, response: { syllableAssembly: state } })) }, true));
  const previous = globalThis.fetch;
  globalThis.fetch = async (url, request) => {
    if (url === picture.src || url === sound.src) return new Response(await books.readImage(owner, url.split('/').pop()), { headers: { 'content-type': url.endsWith('.wav') ? 'audio/wav' : 'image/png' } });
    if (url === '/api/medien' || url === '/api/ton') { const bytes = Buffer.from(await new Response(request.body).arrayBuffer()); return Response.json(await (url === '/api/ton' ? books.storeAudio(owner, bytes) : books.storeImage(owner, bytes))); }
    assert.equal(url, '/api/werkstatt'); return Response.json(await books.createBook(owner, 'lehrkraft', JSON.parse(request.body)));
  };
  try { const archive = await portable.exportArchive(created), imported = await portable.importPortable(new File([archive], 'raten.grundschulbuch')); assert.deepEqual(imported.pages[0].elements[0].settings, c); assert.deepEqual(imported.pages[0].elements[0].response.syllableAssembly, state); }
  finally { globalThis.fetch = previous; }
});
