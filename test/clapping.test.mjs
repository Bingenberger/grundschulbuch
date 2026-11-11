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
const c = await bundle('src/lib/learning/clapping.ts');
const { defaultSettings } = await bundle('src/lib/learning/catalog.ts');
const { ClapDetector } = await bundle('src/lib/learning/clap-detector.ts');
const { ClapMicrophone } = await bundle('src/lib/learning/clap-microphone.ts');
const { ClapPlayback } = await bundle('src/lib/learning/clap-playback.ts');
const { default: Widget } = await bundle('src/components/learning/ClappingWidget.tsx');
const { wavBlob } = await bundle('src/lib/learning/audio.ts');
const portable = await bundle('src/lib/portable.ts');
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-clapping-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'clapping-test-only'.padEnd(48, 'x');
after(() => fs.rm(directory, { recursive: true, force: true }));
const books = await import('../src/lib/notebooks.mjs');
const classes = await import('../src/lib/classes.mjs');
const validation = await import('../src/lib/learning/validation.mjs');
const settings = patch => ({ ...defaultSettings('clapping'), ...patch });
const initial = config => c.readClapping({}, config);
const element = (config, state) => ({ id: crypto.randomUUID(), type: 'widget', widgetKind: 'clapping', x: 15, y: 35, width: 180, height: 180, rotation: 0, locked: false, color: '#253c42', settings: config, ...(state ? { response: { clapping: state } } : {}) });
const page = elements => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements });

test('Explizite Silbentrennung und vorhandene Wortlisten haben Vorrang vor Vorschlägen', () => {
  assert.deepEqual(c.clapSyllables('Re-gen-bo-gen'), { word: 'Regenbogen', parts: ['Re', 'gen', 'bo', 'gen'], confirmed: true });
  assert.deepEqual(c.clapSyllables('Banane').parts, ['Ba', 'na', 'ne']);
  assert.equal(c.clapSyllables('Banane').confirmed, true);
  const unknown = c.clapSyllables('Lomare');
  assert.equal(unknown.confirmed, false); assert.equal(unknown.parts.join(''), 'Lomare');
  const config = settings({ words: ['Lomare'] });
  assert.equal(c.clappingStep(initial(config), config, { type: 'check' }).checked, false);
  const accepted = settings({ words: ['Lomare'], clappingConfirmed: [unknown.parts.join('-')] });
  assert.equal(c.clappingWords(accepted)[0].confirmed, true);
});

test('Wortlistenfilter berücksichtigt Lautverbindungen statt einzelner Zeichen', () => {
  assert.equal(c.spellableClapWord('Schu-le', ['sch', 'u', 'l', 'e']), true);
  assert.equal(c.spellableClapWord('Schu-le', ['s', 'u', 'l', 'e']), false);
  assert.equal(c.spellableClapWord('Mäu-se', ['m', 'äu', 's', 'e']), true);
  assert.equal(c.spellableClapWord('Mäu-se', ['m', 'ä', 's', 'e']), false);
  assert.equal(c.spellableClapWord('Son-ne', []), true);
});

test('Korrektur, Wiederholen und Weiter ergeben eine endliche Serie mit gespeichertem Ergebnis', () => {
  const config = settings({ words: ['Son-ne', 'Blu-me'] });
  let state = initial(config);
  state = c.clappingStep(state, config, { type: 'clap' }); state = c.clappingStep(state, config, { type: 'check' });
  assert.equal(state.correct, false);
  state = c.clappingStep(state, config, { type: 'reset' });
  state = c.clappingStep(state, config, { type: 'count', count: 2 }); state = c.clappingStep(state, config, { type: 'check' });
  assert.equal(state.correct, true); assert.equal(state.completed, false); assert.equal(c.clappingScore(state, config), 50);
  assert.equal(c.clappingStep(state, config, { type: 'clap' }), state);
  state = c.clappingStep(state, config, { type: 'next' }); assert.equal(state.index, 1); assert.deepEqual(state.results, [true]);
  state = c.clappingStep(state, config, { type: 'next' }); assert.equal(state.completed, true); assert.deepEqual(state.results, [true, false]);
  assert.equal(c.clappingScore(state, config), 50); assert.deepEqual(c.clappingStep(state, config, { type: 'restart' }), initial(config));
});

test('Silbenvorführung vergibt keine Punkte; gespeicherter Stand bleibt bei Medienwechsel erhalten', () => {
  const config = settings({ words: ['Son-ne'] });
  let state = c.clappingStep(initial(config), config, { type: 'help' });
  assert.equal(state.helped, true); assert.equal(c.clappingScore(state, config), 0);
  state = c.clappingStep(state, config, { type: 'count', count: 2 });
  assert.deepEqual(c.readClapping({ clapping: state }, { ...config, clappingHelp: 'none', font: 'Lexend' }), state);
  assert.equal(c.readClapping({ clapping: state }, { ...config, words: ['Blu-me'] }).helped, false);
});

test('Rendering zeigt Wortbild, Bögen und Punkte; Bildverzicht und Abschluss sind ebenfalls darstellbar', () => {
  const config = settings({ words: ['Son-ne'], clappingHelp: 'both' });
  const markup = renderToStaticMarkup(React.createElement(Widget, { element: element(config) }));
  assert.ok(markup.includes('aria-label="Sonne"')); assert.ok(markup.includes('clapping-syllable')); assert.ok(markup.includes('clapping-hint-dots'));
  assert.ok(markup.includes('disabled=""')); assert.ok(!markup.includes('Mikrofonpegel'));
  const without = { ...config, clappingItems: [{ word: 'Sonne', hideImage: true }] };
  const plain = renderToStaticMarkup(React.createElement(Widget, { element: element(without) }));
  assert.ok(plain.includes('<strong>Sonne</strong>'));
  let state = c.clappingStep(initial(config), config, { type: 'count', count: 2 });
  state = c.clappingStep(c.clappingStep(state, config, { type: 'check' }), config, { type: 'next' });
  assert.ok(renderToStaticMarkup(React.createElement(Widget, { element: element(config, state) })).includes('Geschafft!'));
});

test('Klatschdetektor zählt Bursts statt lauter Frames und beendet die Folge erst nach kurzer Stille', () => {
  const detector = new ClapDetector();
  assert.equal(detector.sample(0.2, 0.4, 0).clap, true);
  for (let time = 20; time <= 300; time += 20) assert.equal(detector.sample(0.2, 0.4, time).clap, false);
  detector.sample(0.003, 0.01, 320);
  assert.equal(detector.sample(0.2, 0.4, 600).clap, true); assert.equal(detector.count, 2);
  detector.sample(0.003, 0.01, 650);
  assert.equal(detector.sample(0.003, 0.01, 1400).finished, false);
  assert.equal(detector.sample(0.003, 0.01, 1650).finished, true);
  assert.equal(new ClapDetector().sample(0.001, 0.002, 2000).finished, false);
});

test('Kurze Nachschwinger werden gesperrt und laufender Lärm gilt nicht als Stille', () => {
  const detector = new ClapDetector(); detector.sample(0.2, 0.4, 0); detector.sample(0.001, 0.002, 40);
  assert.equal(detector.sample(0.2, 0.4, 180).clap, false);
  assert.equal(detector.sample(0.2, 0.4, 260).clap, false);
  assert.equal(detector.sample(0.2, 0.4, 2000).finished, false);
  assert.equal(detector.count, 1); assert.equal(detector.sample(NaN, 0, 2100).clap, false);
});

function timer() {
  let now = 0, id = 0; const jobs = new Map();
  return { later(fn, ms) { const key = ++id; jobs.set(key, { at: now + ms, fn }); return key; }, clear(key) { jobs.delete(key); },
    advance(ms) { const end = now + ms; while (true) { const next = [...jobs].filter(([, item]) => item.at <= end).sort((a, b) => a[1].at - b[1].at)[0]; if (!next) break; jobs.delete(next[0]); now = next[1].at; next[1].fn(); } now = end; }, get size() { return jobs.size; } };
}
test('Vorführung folgt den tatsächlichen Tonenden; Abbruch unterdrückt alte Rückrufe', () => {
  const clock = timer(), done = [], active = []; let beats = 0, stopped = 0, finished = 0;
  const playback = new ClapPlayback({ ...clock, read: (_text, finish) => { done.push(finish); return () => stopped++; }, audio: (_src, finish) => { done.push(finish); return () => stopped++; }, beat: () => { beats++; return () => {}; } }, index => active.push(index), () => finished++, () => {});
  playback.start([{ text: 'Son' }, { text: 'ne' }]); assert.deepEqual(active, [0]);
  clock.advance(1000); assert.deepEqual(active, [0]); done[0](); clock.advance(300); assert.deepEqual(active, [0, 1]);
  playback.stop(); done[1](); clock.advance(10000); assert.equal(finished, 0); assert.ok(stopped >= 2);
  playback.start([{ text: 'Haus' }]); done[2](); clock.advance(300); assert.equal(finished, 1); assert.equal(beats, 3);
});
test('Vorführung ohne Stimme bleibt visuell zeitlich begrenzt und vergibt keine Mikrofonimpulse', () => {
  const clock = timer(), active = []; let finished = 0, notices = 0;
  const playback = new ClapPlayback({ ...clock, read: () => null, audio: () => () => {}, beat: () => () => {} }, index => active.push(index), () => finished++, () => notices++);
  playback.start([{ text: 'Son' }, { text: 'ne' }]); clock.advance(2000);
  assert.deepEqual(active, [0, 1]); assert.equal(finished, 1); assert.equal(notices, 2); assert.equal(clock.size, 0);
});

function microphoneRig(request) {
  let now = 0, id = 0, input = 0.003, requests = 0, stops = 0, closes = 0;
  const frames = new Map(), states = [], counts = [], finishes = [], errors = [];
  const stream = { getTracks: () => [{ stop: () => stops++ }] };
  const context = { resume: async () => {}, close: async () => { closes++; }, createMediaStreamSource: () => ({ connect() {}, disconnect() {} }), createAnalyser: () => ({ fftSize: 1024, getFloatTimeDomainData(data) { data.fill(input); } }) };
  const mic = new ClapMicrophone({ state: value => states.push(value), level() {}, count: (scope, count) => counts.push([scope, count]), finish: (scope, count) => finishes.push([scope, count]), error: text => errors.push(text) }, {
    request: async () => { requests++; return request ? await request(stream) : stream; }, context: () => context, now: () => now,
    frame: callback => { frames.set(++id, callback); return id; }, cancel: key => frames.delete(key),
  });
  return { mic, stream, context, states, counts, finishes, errors, frame(time, value = 0.003) { now = time; input = value; const [key, callback] = frames.entries().next().value; frames.delete(key); callback(time); }, get requests() { return requests; }, get stops() { return stops; }, get closes() { return closes; }, get frames() { return frames.size; } };
}
test('Mikrofon bleibt zwischen Wörtern offen und wird bei Stopp einschließlich AudioContext geschlossen', async () => {
  const rig = microphoneRig(); await rig.mic.start('wort-1');
  rig.frame(20, 0.3); rig.frame(80); rig.frame(400, 0.3); rig.frame(450); rig.frame(1500);
  assert.deepEqual(rig.finishes, [['wort-1', 2]]); assert.equal(rig.requests, 1); assert.equal(rig.stops, 0);
  await rig.mic.start('wort-2'); rig.frame(1600, 0.3); assert.deepEqual(rig.counts.at(-1), ['wort-2', 1]);
  rig.mic.stop(); assert.equal(rig.stops, 1); assert.equal(rig.closes, 1); assert.equal(rig.frames, 0);
  rig.mic.stop(); assert.equal(rig.stops, 1); assert.equal(rig.states.at(-1), 'off');
});
test('Ein verspätet erlaubtes Mikrofon nach Seitenwechsel wird sofort freigegeben', async () => {
  let resolve; const rig = microphoneRig(stream => new Promise(done => { resolve = () => done(stream); }));
  const opening = rig.mic.start('alt'); assert.equal(rig.states.at(-1), 'opening');
  rig.mic.stop(); resolve(); await opening;
  assert.equal(rig.stops, 1); assert.equal(rig.closes, 0); assert.equal(rig.frames, 0); assert.equal(rig.states.at(-1), 'off');
});
test('Abgelehnte Mikrofonberechtigung bleibt bedienbar und verändert keine Klatschzahl', async () => {
  const rig = microphoneRig(async () => { throw new Error('denied'); }); await rig.mic.start('wort');
  assert.equal(rig.states.at(-1), 'off'); assert.equal(rig.errors.length, 1); assert.deepEqual(rig.counts, []); assert.equal(rig.frames, 0);
});

test('Ungültige Übungsstände, Silbenaufnahmen und externe Medien werden abgelehnt', () => {
  const config = settings({}), state = initial(config);
  assert.deepEqual(validation.learningResponse({ clapping: state }).clapping, state);
  for (const patch of [{ index: 16 }, { claps: 33 }, { results: ['richtig'] }, { helped: 1 }]) assert.throws(() => validation.learningResponse({ clapping: { ...state, ...patch } }));
  for (const patch of [{ clappingHelp: 'all' }, { words: Array(17).fill('Son-ne') }, { clappingItems: [{ word: 'Sonne', audio: 'https://extern.invalid/ton.wav' }] }, { clappingItems: [{ word: 'Sonne', syllables: [{ text: 'Son', audio: 'data:audio/wav;base64,ABC' }] }] }]) assert.throws(() => validation.widgetSettings({ ...config, ...patch }));
});

test('Eigene Wortbilder und Tondateien werden an Kinder freigegeben und mit der Heftdatei gespeichert', async () => {
  const owner = crypto.randomUUID();
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=', 'base64'), picture = await books.storeImage(owner, png);
  const wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) }).arrayBuffer()), audio = await books.storeAudio(owner, wav);
  const config = settings({ words: ['Son-ne'], clappingItems: [{ word: 'Sonne', image: picture.src, audio: audio.src, syllables: [{ text: 'Son', audio: audio.src }, { text: 'ne', audio: audio.src }] }] });
  let state = c.clappingStep(initial(config), config, { type: 'count', count: 2 }); state = c.clappingStep(c.clappingStep(state, config, { type: 'check' }), config, { type: 'next' });
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Klatschprobe', pages: [page([element(config, state)])] });
  let klass = await classes.createClass(owner, 'Silbenklasse'); klass = await classes.changeClass(owner, klass.id, { addChild: 'Ada' });
  const [copy] = await classes.distribute(owner, klass.id, created.book.id), child = klass.children[0].id, own = await books.getBook(child, copy.id);
  assert.equal(own.pages[0].elements[0].response, undefined); assert.ok(await books.readImage(child, audio.src.split('/').pop())); assert.ok(await books.readImage(child, picture.src.split('/').pop()));
  assert.ok(await books.savePage(child, copy.id, { ...own.pages[0], elements: own.pages[0].elements.map(el => ({ ...el, response: { clapping: state, score: 100, completed: true } })) }, true));
  const previous = globalThis.fetch;
  globalThis.fetch = async (url, request) => {
    if (url === picture.src || url === audio.src) return new Response(await books.readImage(owner, url.split('/').pop()), { headers: { 'content-type': url.endsWith('.wav') ? 'audio/wav' : 'image/png' } });
    if (url === '/api/medien' || url === '/api/ton') return Response.json(await (url === '/api/ton' ? books.storeAudio(owner, Buffer.from(await new Response(request.body).arrayBuffer())) : books.storeImage(owner, Buffer.from(await new Response(request.body).arrayBuffer()))));
    assert.equal(url, '/api/werkstatt'); return Response.json(await books.createBook(owner, 'lehrkraft', JSON.parse(request.body)));
  };
  try { const archive = await portable.exportArchive(created), imported = await portable.importPortable(new File([archive], 'klatschen.grundschulbuch')); assert.deepEqual(imported.pages[0].elements[0].settings, config); assert.deepEqual(imported.pages[0].elements[0].response.clapping, state); }
  finally { globalThis.fetch = previous; }
});


test('Abbruch während des AudioContext-Starts schließt auch noch nicht zugewiesene Ressourcen', async () => {
  const rig = microphoneRig(); let resume;
  rig.context.resume = () => new Promise(resolve => { resume = resolve; });
  const pending = rig.mic.start('wort'); await Promise.resolve();
  assert.equal(typeof resume, 'function'); rig.mic.stop(); resume(); await pending;
  assert.equal(rig.stops, 1); assert.equal(rig.closes, 1); assert.equal(rig.frames, 0); assert.equal(rig.states.at(-1), 'off');
});

test('Fehlende Ton-Endereignisse können eine Vorführung nicht dauerhaft festhalten', () => {
  const clock = timer(), active = []; let stops = 0;
  const playback = new ClapPlayback({ ...clock, read: () => () => stops++, audio: () => () => stops++, beat: () => () => {} }, index => active.push(index), () => {}, () => {});
  playback.start([{ text: 'Son' }, { text: 'ne' }]); clock.advance(5300);
  assert.deepEqual(active, [0, 1]); assert.equal(stops, 1);
  playback.stop(); assert.equal(clock.size, 0); assert.equal(stops, 2);
});
