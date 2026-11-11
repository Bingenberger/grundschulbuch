import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
async function bundle(file) {
  const result = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports);
  return compiled.exports;
}
const m = await bundle('src/lib/learning/media-activity.ts');
const { defaultSettings } = await bundle('src/lib/learning/catalog.ts');
const { default: Activity } = await bundle('src/components/learning/Activity.tsx');
const { TaskContent } = await bundle('src/components/learning/MediaActivity.tsx');
const { wavBlob } = await bundle('src/lib/learning/audio.ts');
const portable = await bundle('src/lib/portable.ts');
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-media-activity-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'media-task-test-only'.padEnd(48, 'x');
after(() => fs.rm(directory, { recursive: true, force: true }));
const books = await import('../src/lib/notebooks.mjs');
const classes = await import('../src/lib/classes.mjs');
const validation = await import('../src/lib/learning/validation.mjs');
const image = `/api/medien/${'a'.repeat(64)}.png`, otherImage = `/api/medien/${'b'.repeat(64)}.png`, audio = `/api/medien/${'c'.repeat(64)}.wav`;
const config = (kind, patch = {}) => ({ ...defaultSettings(kind), ...patch });
const initial = (kind, c) => m.readMediaActivity({}, kind, c);
const step = m.mediaActivityStep;
const el = (kind, c, state) => ({ id: crypto.randomUUID(), type: 'activity', activityKind: kind, x: 15, y: 35, width: 180, height: 180, rotation: 0, locked: false, color: '#253c42', settings: c, ...(state ? { response: { mediaActivity: state } } : {}) });
const page = elements => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements });

test('Quiz bewertet nur geprüfte Fragen; eine Änderung verwirft nur die Prüfung dieser Frage', () => {
  const c = config('quiz', { questions: [{ text: 'A?', answers: ['A', 'B'], correct: 0 }, { text: 'B?', answers: ['A', 'B'], correct: 1 }] });
  let state = step(initial('quiz', c), 'quiz', c, { type: 'answer', choice: 0 });
  assert.equal(m.mediaActivityScore(state, 'quiz', c), 0);
  state = step(state, 'quiz', c, { type: 'check' }); assert.equal(m.mediaActivityScore(state, 'quiz', c), 50); assert.equal(state.completed, false);
  state = step(state, 'quiz', c, { type: 'question', index: 1 }); state = step(state, 'quiz', c, { type: 'answer', choice: 1 }); state = step(state, 'quiz', c, { type: 'check' });
  assert.equal(state.completed, true); assert.equal(m.mediaActivityScore(state, 'quiz', c), 100);
  state = step(state, 'quiz', c, { type: 'answer', choice: 0 }); assert.equal(state.completed, false); assert.equal(m.mediaActivityScore(state, 'quiz', c), 50);
  assert.equal(state.evaluated[0], true); assert.equal(state.evaluated[1], false);
});

test('Zuordnungskarten werden eindeutig verschoben; belegte Plätze geben ihre vorige Karte wieder frei', () => {
  const c = config('matching', { pairs: [{ left: '1', right: 'A' }, { left: '2', right: 'B' }] });
  let state = step(initial('matching', c), 'matching', c, { type: 'place', row: 0, source: 1 });
  state = step(state, 'matching', c, { type: 'place', row: 1, source: 0 });
  assert.deepEqual(state.placements, [1, 0]);
  state = step(state, 'matching', c, { type: 'place', row: 0, source: 0 });
  assert.deepEqual(state.placements, [0, -1]);
  state = step(state, 'matching', c, { type: 'check' }); assert.equal(m.mediaActivityScore(state, 'matching', c), 50);
  state = step(state, 'matching', c, { type: 'place', row: 1, source: 1 }); assert.equal(state.checked, false);
  state = step(state, 'matching', c, { type: 'check' }); assert.equal(state.completed, true);
  assert.equal(m.mediaActivityScore(state, 'matching', c), 100);
  state = step(state, 'matching', c, { type: 'place', row: 1, source: -1 }); assert.deepEqual(state.placements, [0, -1]);
});

test('Gleiche Beschriftung reicht bei unterschiedlichen Bildern oder Tondateien nicht für eine Zuordnung', () => {
  const c = config('matching', { pairs: [{ left: 'A', right: 'gleich', rightMedia: { image } }, { left: 'B', right: 'gleich', rightMedia: { image: otherImage } }] });
  assert.equal(m.matchingRight(c, 0, 1), false); assert.equal(m.matchingRight(c, 0, 0), true);
  const textOnly = config('matching', { pairs: [{ left: 'A', right: 'gleich' }, { left: 'B', right: 'gleich' }] });
  assert.equal(m.matchingRight(textOnly, 0, 1), true);
  const noMedia = { ...textOnly, pairs: textOnly.pairs.map((pair, i) => i === 0 ? { ...pair, rightMedia: { hideText: true } } : pair) };
  assert.equal(m.matchingRight(noMedia, 0, 1), true);
  assert.equal(m.matchingRight(c, 0, 99), false);
});

test('Memory mischt reproduzierbar genau zwei Karten pro Paar und sperrt dritte oder doppelte Aufdeckversuche', () => {
  const c = config('memory', { pairs: [{ left: 'gleich', right: 'gleich', leftMedia: { image } }, { left: 'gleich', right: 'gleich', leftMedia: { image: otherImage } }] });
  const deck = m.memoryDeck(c); assert.deepEqual(deck, m.memoryDeck(c)); assert.equal(deck.length, 4);
  for (let pair = 0; pair < 2; pair++) assert.deepEqual(deck.filter(card => card.pair === pair).map(card => card.side).sort(), ['left', 'right']);
  let state = step(initial('memory', c), 'memory', c, { type: 'flip', card: 0 });
  assert.equal(step(state, 'memory', c, { type: 'flip', card: 0 }), state);
  state = step(state, 'memory', c, { type: 'flip', card: 1 }); assert.equal(state.moves, 1);
  assert.equal(step(state, 'memory', c, { type: 'flip', card: 2 }), state);
});

test('Memory vergleicht Paarzugehörigkeit statt Beschriftung und erhält Spielzüge sowie gefundene Paare', () => {
  const c = config('memory', { pairs: [{ left: 'gleich', right: 'gleich' }, { left: 'gleich', right: 'gleich' }] });
  const deck = m.memoryDeck(c), a = deck.findIndex(card => card.pair === 0), b = deck.findIndex(card => card.pair === 1);
  let state = step(step(initial('memory', c), 'memory', c, { type: 'flip', card: a }), 'memory', c, { type: 'flip', card: b });
  state = step(state, 'memory', c, { type: 'resolve' }); assert.deepEqual(state.matched, []); assert.equal(state.completed, false);
  for (let pair = 0; pair < 2; pair++) {
    const cards = deck.map((card, i) => card.pair === pair ? i : -1).filter(i => i >= 0);
    for (const card of cards) state = step(state, 'memory', c, { type: 'flip', card });
    state = step(state, 'memory', c, { type: 'resolve' });
  }
  assert.equal(state.completed, true); assert.equal(state.moves, 3); assert.equal(m.mediaActivityScore(state, 'memory', c), 100);
  assert.deepEqual(step(state, 'memory', c, { type: 'restart' }), initial('memory', c));
});

test('Gespeicherte Zustände bleiben beim Vorlesewechsel erhalten; geänderte Medien setzen die Aufgabe zurück', () => {
  for (const kind of ['quiz', 'matching', 'memory']) {
    const c = config(kind), state = initial(kind, c);
    assert.deepEqual(m.readMediaActivity({ mediaActivity: state }, kind, c), state);
    assert.equal(m.readMediaActivity({ mediaActivity: state }, kind, { ...c, mediaReadText: true }).exercise, state.exercise);
  }
  const c = config('memory'), state = step(initial('memory', c), 'memory', c, { type: 'flip', card: 0 });
  const changed = { ...c, pairs: c.pairs.map((pair, i) => i === 0 ? { ...pair, leftMedia: { image } } : pair) };
  assert.deepEqual(m.readMediaActivity({ mediaActivity: state }, 'memory', changed).open, []);
});

test('Alte Quiz- und Zuordnungsantworten werden erhalten, aber erst nach neuer Prüfung bewertet', () => {
  const c = config('quiz', { questions: [{ text: 'A', answers: ['a', 'b'], correct: 0 }, { text: 'B', answers: ['a', 'b'], correct: 1 }] });
  const state = m.readMediaActivity({ values: [null, '1'], index: 1, checked: true }, 'quiz', c);
  assert.deepEqual(state.answers, [-1, 1]); assert.equal(m.mediaActivityScore(state, 'quiz', c), 0);
  const pairs = config('matching', { pairs: [{ left: '1', right: 'A' }, { left: '2', right: 'A' }] });
  assert.deepEqual(m.readMediaActivity({ values: ['A', 'A'] }, 'matching', pairs).placements, [0, 1]);
});

test('Bereits gefundene Memory-Paare aus alten Heften bleiben gefunden', () => {
  const c = config('memory'), deck = m.memoryDeck(c), matched = deck.map((card, i) => card.pair === 0 ? i : -1).filter(i => i >= 0);
  const restored = m.readMediaActivity({ matched, attempts: 4 }, 'memory', c);
  assert.deepEqual(restored.matched, matched); assert.equal(restored.moves, 2);
});

test('Verdeckte Memory-Karten geben weder Vorderseitentexte noch Bild- oder Tonadressen im Markup preis', () => {
  const c = config('memory', { pairs: [{ left: 'Geheimwort', right: 'AnderesGeheimwort', leftMedia: { image, audio } }] });
  const markup = renderToStaticMarkup(React.createElement(Activity, { element: el('memory', c) }));
  assert.ok(!markup.includes('Geheimwort')); assert.ok(!markup.includes(image)); assert.ok(!markup.includes(audio));
  assert.ok(markup.includes('Karte 1 aufdecken')); assert.ok(markup.includes('disabled=""'));
  const state = step(initial('memory', c), 'memory', c, { type: 'flip', card: 0 });
  const face = renderToStaticMarkup(React.createElement(Activity, { element: el('memory', c, state) }));
  assert.ok(face.includes('Aufgedeckte Karte 1'));
});

test('Medienkarten können Beschriftungen visuell ausblenden und bleiben mit Alternativtext zugänglich', () => {
  const markup = renderToStaticMarkup(React.createElement(TaskContent, { card: { text: 'Sonne', media: { image, hideText: true, audio } } }));
  assert.ok(markup.includes('alt="Sonne"')); assert.ok(markup.includes(image)); assert.ok(!markup.includes('<span>Sonne</span>'));
  assert.ok(renderToStaticMarkup(React.createElement(TaskContent, { card: { text: 'Sonne', media: { hideText: true } } })).includes('Sonne'));
});

test('Quiz zeigt Bilder und getrennte Tonknöpfe; Zuordnungen verwenden Ziele statt Dropdowns', () => {
  const quiz = config('quiz', { questions: [{ text: 'Was hörst du?', media: { audio }, answers: ['Sonne', 'Blume'], answerMedia: [{ image }, { image: otherImage }], correct: 0 }] });
  const markup = renderToStaticMarkup(React.createElement(Activity, { element: el('quiz', quiz) }));
  assert.ok(markup.includes('Frage anhören')); assert.ok(markup.includes(image)); assert.ok(markup.includes(otherImage));
  const matching = renderToStaticMarkup(React.createElement(Activity, { element: el('matching', config('matching')) }));
  assert.ok(matching.includes('data-match-target="0"')); assert.ok(!matching.includes('<select'));
});

test('Ungültige Medienfelder und Bearbeitungsstände werden vor dem Speichern abgelehnt', () => {
  const c = config('memory'), state = initial('memory', c);
  assert.deepEqual(validation.learningResponse({ mediaActivity: state }).mediaActivity, state);
  for (const patch of [{ open: [0, 0] }, { open: [-1] }, { matched: [0] }, { moves: -1 }, { answers: [3000] }, { evaluated: ['ja'] }]) assert.throws(() => validation.learningResponse({ mediaActivity: { ...state, ...patch } }));
  for (const patch of [{ pairs: [{ left: 'A', right: 'B', leftMedia: { image: 'https://extern.invalid/bild.png' } }] }, { questions: [{ text: 'A', answers: ['A', 'B'], correct: 0, answerMedia: [{ audio: 'data:audio/wav;base64,ABC' }] }] }, { pairs: [{ left: 'A', right: 'B', rightMedia: { hideText: 'ja' } }] }]) assert.throws(() => validation.widgetSettings(patch));
});

test('Bilder und Ton aller drei Aufgabenformate werden gespeichert, ausgeteilt und über Heftdateien weitergegeben', async () => {
  const owner = crypto.randomUUID();
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=', 'base64'), picture = await books.storeImage(owner, png);
  const wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) }).arrayBuffer()), sound = await books.storeAudio(owner, wav);
  const configs = [config('quiz', { questions: [{ text: 'Bild oder Ton?', media: { audio: sound.src }, answers: ['A', 'B'], answerMedia: [{ image: picture.src, hideText: true }, { audio: sound.src, hideText: true }], correct: 0 }] }), ...['matching', 'memory'].map(kind => config(kind, { pairs: [{ left: 'Bild', right: 'Ton', leftMedia: { image: picture.src, hideText: true }, rightMedia: { audio: sound.src, hideText: true } }] }))];
  const kinds = ['quiz', 'matching', 'memory'];
  const pages = configs.map((c, i) => page([el(kinds[i], c, initial(kinds[i], c))]));
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Medienprobe', pages });
  let klass = await classes.createClass(owner, 'Medienklasse'); klass = await classes.changeClass(owner, klass.id, { addChild: 'Ada' });
  const [copy] = await classes.distribute(owner, klass.id, created.book.id), child = klass.children[0].id, own = await books.getBook(child, copy.id);
  assert.ok(await books.readImage(child, picture.src.split('/').pop())); assert.ok(await books.readImage(child, sound.src.split('/').pop()));
  const state = step(initial('quiz', configs[0]), 'quiz', configs[0], { type: 'answer', choice: 0 });
  assert.ok(await books.savePage(child, copy.id, { ...own.pages[0], elements: own.pages[0].elements.map(e => ({ ...e, response: { mediaActivity: state } })) }, true));
  const previous = globalThis.fetch;
  globalThis.fetch = async (url, request) => {
    if (url === picture.src || url === sound.src) return new Response(await books.readImage(owner, url.split('/').pop()), { headers: { 'content-type': url.endsWith('.wav') ? 'audio/wav' : 'image/png' } });
    if (url === '/api/ton' || url === '/api/medien') { const buffer = Buffer.from(await new Response(request.body).arrayBuffer()); return Response.json(await (url === '/api/ton' ? books.storeAudio(owner, buffer) : books.storeImage(owner, buffer))); }
    assert.equal(url, '/api/werkstatt'); return Response.json(await books.createBook(owner, 'lehrkraft', JSON.parse(request.body)));
  };
  try { const archive = await portable.exportArchive(created), imported = await portable.importPortable(new File([archive], 'medien.grundschulbuch')); assert.deepEqual(imported.pages.map(p => p.elements[0].settings), configs); assert.deepEqual(imported.pages.map(p => p.elements[0].response), created.pages.map(p => p.elements[0].response)); }
  finally { globalThis.fetch = previous; }
});


test('Unvollständige Memory-Paare und widersprüchliche Abschlussflags werden beim Lesen korrigiert', () => {
  const c = config('memory', { pairs: [{ left: 'A', right: 'a' }, { left: 'B', right: 'b' }] }), state = initial('memory', c);
  const restored = m.readMediaActivity({ mediaActivity: { ...state, matched: [0, 23], completed: true } }, 'memory', c);
  assert.deepEqual(restored.matched, []); assert.equal(restored.completed, false);
});
