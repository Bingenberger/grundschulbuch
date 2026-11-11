import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
async function bundled(file) {
  const code = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', code.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports);
  return compiled.exports;
}
const a = await bundled('src/lib/learning/alphabet.ts');
const { defaultSettings } = await bundled('src/lib/learning/catalog.ts');
const { default: AlphabetWidget } = await bundled('src/components/learning/AlphabetWidget.tsx');
// Bundle both together so context provider and widget share the same Context.
const renderBundle = await build({ stdin: { contents: "export { default as Widget } from './src/components/learning/AlphabetWidget'; export { LearningRuntime as Runtime } from './src/components/learning/Runtime';", resolveDir: process.cwd() }, bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
const ui = { exports: {} };
new Function('require', 'module', 'exports', renderBundle.outputFiles[0].text)(createRequire(import.meta.url), ui, ui.exports);
const portable = await bundled('src/lib/portable.ts');
const { wavBlob } = await bundled('src/lib/learning/audio.ts');
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-alphabet-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'alphabet-only-test'.padEnd(48, 'x');
after(() => fs.rm(directory, { recursive: true, force: true }));
const books = await import('../src/lib/notebooks.mjs');
const classes = await import('../src/lib/classes.mjs');
const validation = await import('../src/lib/learning/validation.mjs');
const settings = patch => ({ ...defaultSettings('alphabet'), ...patch });
const initial = c => a.readAlphabet({}, c);
const write = (state, c, text) => Array.from(text).reduce((s, letter) => a.alphabetStep(s, c, { type: 'insert', text: letter, physical: true }), state);
const el = (c, response) => ({ id: crypto.randomUUID(), type: 'widget', widgetKind: 'alphabet', x: 15, y: 35, width: 180, height: 210, rotation: 0, locked: false, color: '#253c42', settings: c, ...(response ? { response } : {}) });
const page = elements => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements });

test('Beide Tabellen und Anordnungen enthalten jede Taste genau einmal, einschließlich ß und zusätzlicher Lautverbindungen', () => {
  for (const table of ['basic', 'full']) for (const layout of ['abc', 'qwertz']) {
    const rows = a.alphabetRows(settings({ alphabetTable: table, alphabetLayout: layout })), keys = rows.flat();
    assert.equal(keys.length, table === 'full' ? 44 : 35);
    assert.equal(new Set(keys.map(key => key.id)).size, keys.length);
    assert.ok(keys.some(key => key.id === 'ß'));
    if (layout === 'qwertz') assert.equal(rows[0].map(key => key.id).join(''), 'qwertzuiopü');
    if (table === 'full') for (const id of ['äu', 'ie', 'sp', 'st', 'pf', 'ng', 'ck', 'tz', 'ai']) assert.ok(keys.some(key => key.id === id));
  }
});

test('Groß/klein, mehrteilige Tasten und angeschlossene Tastaturen schreiben konsistent; Zurück löscht eine ganze Taste', () => {
  const c = settings({});
  let state = a.alphabetStep(initial(c), c, { type: 'insert', text: 'sch' });
  assert.equal(state.tokens.join(''), 'Sch');
  state = a.alphabetStep(state, c, { type: 'backspace' });
  assert.deepEqual(state.tokens, []);
  assert.equal(write(initial(c), c, 'm').tokens.join(''), 'm');
  assert.equal(a.letterText('sch', settings({ alphabetLetters: 'upper' })), 'SCH');
  assert.equal(a.letterText('ß', settings({ alphabetLetters: 'upper' })), 'ẞ');
  assert.equal(a.letterText('Sch', settings({ alphabetLetters: 'lower' }), true), 'sch');
  const umlaut = a.alphabetStep(initial(c), c, { type: 'insert', physical: true, text: 'o\u0308' });
  assert.equal(umlaut.tokens[0], 'ö');
});

test('Worttraining zählt Sterne, wechselt Wörter und schließt die Serie erst nach dem letzten Wort ab', () => {
  const c = settings({ alphabetPractice: true, words: ['Maus', 'Schu-le'] });
  assert.deepEqual(a.practiceWords(c), ['Maus', 'Schule']);
  let state = write(initial(c), c, 'Maus');
  state = a.alphabetStep(state, c, { type: 'check' });
  assert.equal(state.correct, true); assert.equal(state.completed, false); assert.equal(a.alphabetScore(state, c), 50);
  assert.equal(a.alphabetStep(state, c, { type: 'insert', text: 'x' }), state);
  state = a.alphabetStep(state, c, { type: 'next' });
  assert.equal(state.index, 1); assert.deepEqual(state.results, [true]); assert.deepEqual(state.tokens, []);
  state = a.alphabetStep(write(state, c, 'Schule'), c, { type: 'check' });
  state = a.alphabetStep(state, c, { type: 'next' });
  assert.equal(state.completed, true); assert.deepEqual(state.results, [true, true]); assert.equal(a.alphabetScore(state, c), 100);
  assert.deepEqual(a.alphabetStep(state, c, { type: 'restart' }), initial(c));
});

test('Zwei Fehlversuche bleiben beim Korrigieren erhalten; Überspringen vergibt keinen Stern', () => {
  const c = settings({ alphabetPractice: true, words: ['Maus', 'Haus'] });
  let state = write(initial(c), c, 'Mais');
  assert.equal(a.alphabetStep(state, c, { type: 'next' }), state);
  state = a.alphabetStep(state, c, { type: 'check' });
  assert.equal(state.correct, false); assert.equal(state.attempts, 1);
  state = a.alphabetStep(state, c, { type: 'clear' });
  assert.equal(state.attempts, 1);
  state = a.alphabetStep(write(state, c, 'Mus'), c, { type: 'check' });
  assert.equal(state.attempts, 2);
  state = a.alphabetStep(state, c, { type: 'next' });
  assert.deepEqual(state.results, [false]); assert.equal(a.alphabetScore(state, c), 0);
});

test('Schreibprüfung beachtet die gewählte Buchstabenart und akzeptiert SS als große Schreibung von ß', () => {
  for (const [letters, word] of [['lower', 'maus'], ['upper', 'MAUS'], ['both', 'Maus']]) {
    const c = settings({ alphabetPractice: true, alphabetLetters: letters, words: ['Maus'] });
    assert.equal(a.practiceWords(c)[0], word);
    assert.equal(a.alphabetStep(write(initial(c), c, word), c, { type: 'check' }).correct, true);
  }
  const mixed = settings({ alphabetPractice: true, words: ['Maus'] });
  assert.equal(a.alphabetStep(write(initial(mixed), mixed, 'maus'), mixed, { type: 'check' }).correct, false);
  const upper = settings({ alphabetPractice: true, alphabetLetters: 'upper', words: ['Straße'] });
  assert.equal(a.alphabetStep(write(initial(upper), upper, 'STRASSE'), upper, { type: 'check' }).correct, true);
});

test('Buchstabenvergleich richtet fehlende und zusätzliche Buchstaben aus, ohne die Lösung zu verraten', () => {
  assert.deepEqual(a.alphabetFeedback('Bume', 'Blume'), [{ text: 'B', status: 'right' }, { text: '□', status: 'missing' }, { text: 'u', status: 'right' }, { text: 'm', status: 'right' }, { text: 'e', status: 'right' }]);
  const extra = a.alphabetFeedback('Mauus', 'Maus');
  assert.equal(extra.filter(p => p.status === 'wrong').length, 1);
  assert.equal(a.alphabetFeedback('Sonne', 'Sonne').every(p => p.status === 'right'), true);
});

test('Bestehende freie Texte bleiben erhalten; Medien/Layout ändern keinen Fortschritt, neue Wörter starten neu', () => {
  const c = settings({}), old = a.readAlphabet({ text: 'Hallo' }, c);
  assert.equal(old.tokens.join(''), 'Hallo');
  const trained = settings({ alphabetPractice: true, words: ['Maus'] });
  const saved = a.alphabetStep(write(initial(trained), trained, 'Maus'), trained, { type: 'check' });
  assert.deepEqual(a.readAlphabet({ alphabet: saved }, { ...trained, alphabetLayout: 'qwertz' }), saved);
  assert.deepEqual(a.readAlphabet({ alphabet: saved }, { ...trained, alphabetKeys: [{ id: 'm', variants: [{ word: 'Mond' }] }] }), saved);
  assert.equal(a.readAlphabet({ alphabet: saved }, { ...trained, words: ['Haus'] }).correct, false);
  assert.deepEqual(a.readAlphabet({ alphabet: saved }, { ...trained, words: ['Haus'] }).tokens, []);
});

test('Rendering zeigt zwei Aussprachen, eigene Tastenbilder und deaktiviert die Tastatur außerhalb des Lernmodus', () => {
  const image = `/api/medien/${'a'.repeat(64)}.png`;
  const c = settings({ alphabetKeys: [{ id: 'a', variants: [{ word: 'Eigene Ameise', image }, { word: 'Apfel' }] }] });
  const markup = renderToStaticMarkup(React.createElement(AlphabetWidget, { element: el(c) }));
  assert.ok(markup.includes('Eigene Ameise')); assert.ok(markup.includes(image));
  assert.ok(markup.includes('Igel')); assert.ok(markup.includes('Insel'));
  assert.equal((markup.match(/class="alphabet-key /g) || []).length, 35);
  assert.ok(markup.includes('disabled=""'));
  const interactive = renderToStaticMarkup(React.createElement(ui.exports.Runtime, { interactive: true, onResponse: () => {} }, React.createElement(ui.exports.Widget, { element: el(c) })));
  const button = interactive.match(/<button[^>]*aria-label="A schreiben – Eigene Ameise \(lang\)"[^>]*>/)?.[0];
  assert.ok(button); assert.ok(!button.includes('disabled'));
});

test('Diktatvorgabe bleibt verborgen und wird erst nach zwei Fehlern als Hilfe angezeigt', () => {
  const c = settings({ alphabetPractice: true, alphabetPrompt: 'audio', words: ['Elefantenhaus'] });
  let state = initial(c);
  const markup = () => renderToStaticMarkup(React.createElement(AlphabetWidget, { element: el(c, { alphabet: state }) }));
  assert.ok(!markup().includes('Elefantenhaus'));
  state = a.alphabetStep(state, c, { type: 'check' }); assert.ok(!markup().includes('Elefantenhaus'));
  state = a.alphabetStep(state, c, { type: 'check' }); assert.ok(markup().includes('Elefantenhaus'));
});

test('Einstellungen und Übungsstand werden begrenzt; fremde Medien und ungültige Zustände werden abgelehnt', () => {
  const c = settings({ alphabetPractice: true }), state = initial(c);
  assert.deepEqual(validation.learningResponse({ alphabet: state }).alphabet, state);
  for (const patch of [{ index: -1 }, { attempts: 0.5 }, { tokens: [null] }, { results: ['ja'] }, { completed: 'ja' }])
    assert.throws(() => validation.learningResponse({ alphabet: { ...state, ...patch } }));
  for (const patch of [{ alphabetLayout: 'azerty' }, { alphabetKeys: [{ id: 'xxx', variants: [{ word: 'Test' }] }] }, { alphabetKeys: [{ id: 'm', variants: [{ word: 'Maus', audio: 'https://extern.invalid/m.mp3' }] }] }, { alphabetPrompts: [{ word: 'Maus', image: 'data:image/png;base64,ABC' }] }])
    assert.throws(() => validation.widgetSettings({ ...c, ...patch }));
  let text = initial(settings({}));
  for (let i = 0; i < 250; i++) text = a.alphabetStep(text, settings({}), { type: 'insert', text: 'sch' });
  assert.equal(text.tokens.length, 200);
});

test('Eigene Bilder und Laute werden gespeichert, an Kinder freigegeben und über Heftdateien weitergegeben', async () => {
  const owner = crypto.randomUUID();
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=', 'base64');
  const image = await books.storeImage(owner, png);
  const wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) }).arrayBuffer());
  const audio = await books.storeAudio(owner, wav);
  const c = settings({ alphabetPractice: true, words: ['Maus'], font: 'Lexend', alphabetKeys: [{ id: 'm', variants: [{ word: 'Maus', image: image.src, audio: audio.src }] }], alphabetPrompts: [{ word: 'Maus', image: image.src, audio: audio.src }] });
  const state = a.alphabetStep(write(initial(c), c, 'Maus'), c, { type: 'check' });
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Anlautprobe', pages: [page([el(c, { alphabet: state })])] });
  const saved = await books.getBook(owner, created.book.id);
  assert.deepEqual(saved.pages[0].elements[0].response.alphabet, state);
  let klass = await classes.createClass(owner, 'Anlautklasse');
  klass = await classes.changeClass(owner, klass.id, { addChild: 'Ada' });
  const [copy] = await classes.distribute(owner, klass.id, created.book.id);
  const child = klass.children[0].id;
  const childBook = await books.getBook(child, copy.id);
  assert.deepEqual(childBook.pages[0].elements[0].settings, c);
  assert.equal(childBook.pages[0].elements[0].response, undefined);
  assert.ok(await books.readImage(child, image.src.split('/').pop()));
  assert.ok(await books.readImage(child, audio.src.split('/').pop()));
  const previous = globalThis.fetch;
  globalThis.fetch = async (url, request) => {
    if (url === image.src || url === audio.src) return new Response(await books.readImage(owner, url.split('/').pop()), { headers: { 'content-type': url.endsWith('.wav') ? 'audio/wav' : 'image/png' } });
    if (url === '/api/ton' || url === '/api/medien') {
      const data = Buffer.from(await new Response(request.body).arrayBuffer());
      return Response.json(await (url === '/api/ton' ? books.storeAudio(owner, data) : books.storeImage(owner, data)));
    }
    assert.equal(url, '/api/werkstatt');
    return Response.json(await books.createBook(owner, 'lehrkraft', JSON.parse(request.body)));
  };
  try {
    const archive = await portable.exportArchive(saved);
    const imported = await portable.importPortable(new File([archive], 'anlaut.grundschulbuch'));
    assert.deepEqual(imported.pages[0].elements[0].settings, c);
    assert.deepEqual(imported.pages[0].elements[0].response.alphabet, state);
    const changed = { ...childBook.pages[0], elements: childBook.pages[0].elements.map(e => ({ ...e, response: { alphabet: state } })) };
    assert.ok(await books.savePage(child, copy.id, changed, true));
  } finally { globalThis.fetch = previous; }
});

test('HTML-Export bettet auch die im Lernwerkzeug gewählte Schrift ein', async () => {
  const previous = globalThis.fetch, loaded = [];
  globalThis.fetch = async url => {
    loaded.push(url);
    if (url === '/runtime/viewer.js') return new Response('/* viewer */');
    if (url === '/runtime/viewer.css') return new Response('@font-face{font-family:Andika;src:url(/fonts/andika.ttf)} @font-face{font-family:Lexend;src:url(/fonts/lexend.ttf)}');
    if (url === '/runtime/licenses.json') return Response.json({});
    return new Response(new Uint8Array([1, 2, 3]));
  };
  try {
    const html = await portable.exportHtml({ book: { id: crypto.randomUUID(), title: 'Schriftprobe' }, pages: [page([el(settings({ font: 'Lexend' }))])] });
    assert.ok(loaded.includes('/fonts/lexend.ttf')); assert.ok(html.includes('data:font/ttf;base64,'));
  } finally { globalThis.fetch = previous; }
});


test('Die gewählte Lautvariante bleibt am geschriebenen Zeichen erhalten und leere Kompositionen sind harmlos', () => {
  const c = settings({});
  let state = initial(c);
  assert.equal(a.alphabetStep(state, c, { type: 'insert', text: '' }), state);
  state = a.alphabetStep(state, c, { type: 'insert', text: 'a', variant: 1 });
  assert.deepEqual(state.variants, [1]);
  assert.deepEqual(a.readAlphabet({ alphabet: state }, c).variants, [1]);
  state = a.alphabetStep(state, c, { type: 'backspace' });
  assert.deepEqual(state.variants, []);
});


test('Längere Alttexte werden beim ersten Bearbeiten vollständig erhalten; leere Übungen sind nicht abschließbar', () => {
  const c = settings({}), text = 'Hallo '.repeat(200);
  let state = a.readAlphabet({ text }, c);
  assert.equal(a.alphabetText(state), text);
  state = a.alphabetStep(state, c, { type: 'insert', text: 'm', physical: true });
  assert.equal(a.alphabetText(state), text + 'm');
  const saved = validation.learningResponse({ alphabet: state, text: a.alphabetText(state) });
  assert.equal(a.alphabetText(a.readAlphabet(saved, { ...c, alphabetLetters: 'lower', words: ['anderes Wort'] })), text + 'm');
  state = a.alphabetStep(state, c, { type: 'backspace' });
  state = a.alphabetStep(state, c, { type: 'backspace' });
  assert.equal(a.alphabetText(state), text.slice(0, -1));
  const empty = settings({ alphabetPractice: true, words: ['  '] }), start = initial(empty);
  assert.equal(a.alphabetStep(start, empty, { type: 'check' }), start);
  assert.equal(a.alphabetStep(start, empty, { type: 'next' }), start);
});
