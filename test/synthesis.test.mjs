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
  const code = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', code.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports);
  return compiled.exports;
}
const s = await bundle('src/lib/learning/synthesis.ts');
const { defaultSettings } = await bundle('src/lib/learning/catalog.ts');
const { default: Widget } = await bundle('src/components/learning/SynthesisWidget.tsx');
const { wavBlob } = await bundle('src/lib/learning/audio.ts');
const speech = await bundle('src/lib/speech.ts');
const portable = await bundle('src/lib/portable.ts');
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-synthesis-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'synthesis-test-only'.padEnd(48, 'x');
after(() => fs.rm(directory, { recursive: true, force: true }));
const books = await import('../src/lib/notebooks.mjs');
const classes = await import('../src/lib/classes.mjs');
const validation = await import('../src/lib/learning/validation.mjs');
const config = patch => ({ ...defaultSettings('synthesis'), ...patch });
const initial = c => s.readSynthesis({}, c);
const element = (settings, state) => ({ id: crypto.randomUUID(), type: 'widget', widgetKind: 'synthesis', x: 15, y: 35, width: 180, height: 160, rotation: 0, locked: false, color: '#253c42', settings, ...(state ? { response: { synthesis: state, score: s.synthesisScore(state, settings), completed: state.phase === 'complete' } } : {}) });
const page = elements => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements });

test('Serien enthalten nur gelernte Mitlaute und Selbstlaute; dieselbe Variante bleibt reproduzierbar', () => {
  const c = config({ synthesisLetters: ['m', 'sch', 'a', 'ei'], synthesisCount: 4 });
  const pairs = s.synthesisPairs(c);
  assert.equal(pairs.length, 4);
  assert.equal(new Set(pairs.map(pair => pair.left + '+' + pair.right)).size, 4);
  assert.ok(pairs.every(pair => ['m', 'sch'].includes(pair.left) && ['a', 'ei'].includes(pair.right)));
  assert.deepEqual(s.synthesisPairs(c), pairs);
  assert.notDeepEqual(s.synthesisPairs(c, 1), pairs);
  assert.deepEqual(s.synthesisPairs(c, 1), s.synthesisPairs(c, 1));
});

test('Wenige gelernte Laute dürfen wiederholt werden; ungültige Auswahlen erzeugen keine falsche Übung', () => {
  assert.equal(s.synthesisPairs(config({ synthesisLetters: ['m', 'a'], synthesisCount: 12 })).length, 12);
  assert.equal(s.synthesisPairs(config({ synthesisLetters: ['m', 'a'], synthesisCount: 12 })).every(pair => pair.left + pair.right === 'ma'), true);
  for (const letters of [[], ['a'], ['m'], ['xyz']]) {
    const c = config({ synthesisLetters: letters }), state = initial(c);
    assert.deepEqual(s.synthesisPairs(c), []);
    assert.equal(s.synthesisStep(state, c, 'join'), state);
    assert.equal(s.synthesisStep(state, c, 'advance'), state);
    assert.equal(s.synthesisScore(state, c), 0);
  }
});

test('Eigene und bisherige Wortlisten bleiben als zwei zusammenhängende Teile verfügbar', () => {
  const legacy = { words: ['Schu-le', 'Maus', 'Blume', ''] };
  assert.equal(s.synthesisMode(legacy), 'pairs');
  const pairs = s.synthesisPairs(legacy);
  assert.deepEqual(pairs, [{ left: 'Schu', right: 'le' }, { left: 'M', right: 'aus' }, { left: 'B', right: 'lume' }]);
  assert.deepEqual(s.synthesisLabel(pairs[0], legacy), pairs[0]);
  const own = config({ synthesisMode: 'pairs', synthesisPairs: [{ left: 'la', right: 'ma' }, { left: 'sch', right: 'u' }] });
  assert.equal(s.synthesisPairs(own)[0].left + s.synthesisPairs(own)[0].right, 'lama');
  assert.deepEqual(s.synthesisPairs(own, 2).map(p => p.left + p.right).sort(), ['lama', 'schu']);
});

test('Schreibung und dehnbare Laute werden unabhängig voneinander behandelt', () => {
  const pair = { left: 'sch', right: 'a' };
  assert.deepEqual(s.synthesisLabel(pair, config({ synthesisCase: 'mixed' })), { left: 'Sch', right: 'a' });
  assert.deepEqual(s.synthesisLabel(pair, config({ synthesisCase: 'upper' })), { left: 'SCH', right: 'A' });
  for (const sound of ['m', 'l', 'sch', 'f']) assert.equal(s.stretchableSound(sound), true);
  for (const sound of ['b', 'p', 't', 'ma']) assert.equal(s.stretchableSound(sound), false);
});

test('Karten berühren sich nach genau einer Lücke; Zurückziehen und Überschreiten werden begrenzt', () => {
  assert.equal(s.synthesisDrag({ x: 18, y: 38 }, { x: 38, y: 60 }), 0.5);
  assert.equal(s.synthesisDrag({ x: 18, y: 38 }, { x: 58, y: 38 }), 1);
  assert.equal(s.synthesisDrag({ x: 18, y: 38 }, { x: 100, y: 38 }), 1);
  assert.equal(s.synthesisDrag({ x: 18, y: 38 }, { x: -100, y: 38 }), 0);
  assert.equal(s.synthesisDrag({ x: 18, y: 38 }, { x: 18, y: 38 }), 0);
});

test('Eine Verbindung zählt genau einmal, wird erst nach dem Transport gesammelt und schließt die Serie ab', () => {
  const c = config({ synthesisLetters: ['m', 'a'], synthesisCount: 2 });
  let state = initial(c);
  assert.equal(s.synthesisStep(state, c, 'advance'), state);
  state = s.synthesisStep(state, c, 'join');
  assert.equal(state.phase, 'joined'); assert.equal(state.index, 0); assert.equal(s.synthesisScore(state, c), 0);
  assert.equal(s.synthesisStep(state, c, 'join'), state);
  state = s.synthesisStep(state, c, 'advance');
  assert.equal(state.index, 1); assert.equal(state.phase, 'ready'); assert.equal(s.synthesisScore(state, c), 50);
  state = s.synthesisStep(s.synthesisStep(state, c, 'join'), c, 'advance');
  assert.equal(state.phase, 'complete'); assert.equal(state.index, 2); assert.equal(s.synthesisScore(state, c), 100);
  assert.equal(s.synthesisStep(state, c, 'join'), state);
  assert.deepEqual(s.synthesisStep(state, c, 'restart'), initial(c));
  const next = s.synthesisStep(state, c, 'new');
  assert.equal(next.round, 1); assert.equal(next.phase, 'ready'); assert.equal(next.index, 0);
});

test('Fortschritt und laufender Transport werden wiederhergestellt; neue Aufgaben setzen den Stand zurück', () => {
  const c = config({}), joined = s.synthesisStep(initial(c), c, 'join');
  assert.deepEqual(s.readSynthesis({ synthesis: joined }, c), joined);
  assert.deepEqual(s.readSynthesis({ synthesis: joined }, { ...c, font: 'Lexend', synthesisSpeak: false }), joined);
  assert.equal(s.readSynthesis({ synthesis: joined }, { ...c, synthesisLetters: ['l', 'i'] }).phase, 'ready');
  assert.equal(s.readSynthesis({ synthesis: joined }, { ...c, synthesisCount: 1 }).phase, 'ready');
});

test('Rendering zeigt Karten und Sammelplätze und bleibt außerhalb des Lernmodus schreibgeschützt', () => {
  const c = config({ synthesisMode: 'pairs', synthesisPairs: [{ left: 'm', right: 'a' }], synthesisCase: 'lower' });
  const markup = renderToStaticMarkup(React.createElement(Widget, { element: element(c) }));
  assert.ok(markup.includes('data-synthesis-drag="true"'));
  assert.ok(markup.includes('aria-disabled="true"'));
  assert.ok(markup.includes('Laut m zu a ziehen'));
  assert.ok(!markup.includes('Zusammenziehen'));
  const joined = s.synthesisStep(initial(c), c, 'join');
  const preview = renderToStaticMarkup(React.createElement(Widget, { element: element(c, joined) }));
  assert.ok(preview.includes('synthesis-delivery-static'));
  const complete = s.synthesisStep(joined, c, 'advance');
  const certificate = renderToStaticMarkup(React.createElement(Widget, { element: element(c, complete) }));
  assert.ok(certificate.includes('Geschafft!')); assert.ok(certificate.includes('>ma</li>')); assert.ok(certificate.includes('Nochmal'));
});

test('Mehrere Widgets verwenden getrennte Beschreibungs-IDs', () => {
  const c = config({}), markup = renderToStaticMarkup(React.createElement(React.Fragment, null, React.createElement(Widget, { element: element(c) }), React.createElement(Widget, { element: element(c) })));
  const ids = [...markup.matchAll(/aria-describedby="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, 2); assert.notEqual(ids[0], ids[1]);
});

test('Ungültige Lernstände, Laute, Tonadressen und Verbindungen werden vor dem Speichern abgelehnt', () => {
  const c = config({}), state = initial(c);
  assert.deepEqual(validation.learningResponse({ synthesis: state }).synthesis, state);
  for (const patch of [{ index: -1 }, { round: 1.5 }, { phase: 'dragging' }, { exercise: null }])
    assert.throws(() => validation.learningResponse({ synthesis: { ...state, ...patch } }));
  for (const patch of [{ synthesisLetters: ['xyz'] }, { synthesisCount: 13 }, { synthesisCount: 1.5 }, { synthesisMode: 'words' }, { synthesisPairs: [{ left: '', right: 'a' }] }, { synthesisSounds: [{ sound: 'm', audio: 'https://extern.invalid/m.mp3' }] }])
    assert.throws(() => validation.widgetSettings({ ...c, ...patch }));
});

test('Ein Widget kann nur seine eigene laufende Vorlesestimme abbrechen', () => {
  const previousWindow = globalThis.window, previousUtterance = globalThis.SpeechSynthesisUtterance;
  let cancellations = 0, local = true;
  const engine = { getVoices: () => [{ name: 'Deutsch', lang: 'de-DE', localService: local }], cancel: () => cancellations++, speak: () => {} };
  globalThis.window = { speechSynthesis: engine };
  globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  try {
    const stopFirst = speech.startGermanSpeech('ma'); assert.equal(typeof stopFirst, 'function');
    assert.equal(speech.speakGerman('Haus'), true);
    const before = cancellations; stopFirst(); assert.equal(cancellations, before);
    const stopNext = speech.startGermanSpeech('la'); const next = cancellations;
    stopNext(); assert.equal(cancellations, next + 1); stopNext(); assert.equal(cancellations, next + 1);
    local = false; assert.equal(speech.startGermanSpeech('ma'), null); assert.equal(speech.speakGerman('ma'), false);
  } finally { if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow; if (previousUtterance === undefined) delete globalThis.SpeechSynthesisUtterance; else globalThis.SpeechSynthesisUtterance = previousUtterance; }
});

test('Eigene Lautaufnahmen, gespeicherte Serien und geschützte Kinderantworten bleiben beim Austeilen und Export erhalten', async () => {
  const owner = crypto.randomUUID();
  const wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) }).arrayBuffer());
  const sound = await books.storeAudio(owner, wav);
  const c = config({ synthesisLetters: ['m', 'a'], synthesisCount: 2, synthesisDragSound: true, synthesisSounds: [{ sound: 'm', audio: sound.src }] });
  const state = s.synthesisStep(s.synthesisStep(initial(c), c, 'join'), c, 'advance');
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Lauteprobe', pages: [page([element(c, state)])] });
  const saved = await books.getBook(owner, created.book.id);
  assert.deepEqual(saved.pages[0].elements[0].response.synthesis, state);
  let klass = await classes.createClass(owner, 'Lauteklasse');
  klass = await classes.changeClass(owner, klass.id, { addChild: 'Ada' });
  const [copy] = await classes.distribute(owner, klass.id, created.book.id), child = klass.children[0].id;
  const own = await books.getBook(child, copy.id);
  assert.equal(own.pages[0].elements[0].locked, true); assert.equal(own.pages[0].elements[0].response, undefined);
  assert.ok(await books.readImage(child, sound.src.split('/').pop()));
  const response = { synthesis: state, completed: false, score: 50 };
  const changed = { ...own.pages[0], elements: own.pages[0].elements.map(el => ({ ...el, response })) };
  assert.ok(await books.savePage(child, copy.id, changed, true));
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (url, request) => {
    if (url === sound.src) return new Response(await books.readImage(owner, sound.src.split('/').pop()), { headers: { 'content-type': 'audio/wav' } });
    if (url === '/api/ton') return Response.json(await books.storeAudio(owner, Buffer.from(await new Response(request.body).arrayBuffer())));
    assert.equal(url, '/api/werkstatt'); return Response.json(await books.createBook(owner, 'lehrkraft', JSON.parse(request.body)));
  };
  try {
    const archive = await portable.exportArchive(saved), imported = await portable.importPortable(new File([archive], 'laute.grundschulbuch'));
    assert.deepEqual(imported.pages[0].elements[0].settings, c);
    assert.deepEqual(imported.pages[0].elements[0].response.synthesis, state);
  } finally { globalThis.fetch = previousFetch; }
});
