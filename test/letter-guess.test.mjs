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
const g = await bundle('src/lib/learning/letter-guess.ts');
const { defaultSettings, activityCatalog } = await bundle('src/lib/learning/catalog.ts');
const { default: Activity } = await bundle('src/components/learning/Activity.tsx');
const { GuessMouse } = await bundle('src/components/learning/LetterGuessActivity.tsx');
const { wavBlob } = await bundle('src/lib/learning/audio.ts');
const portable = await bundle('src/lib/portable.ts');
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-letter-guess-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'letter-guess-test-only'.padEnd(48, 'x');
after(() => fs.rm(directory, { recursive: true, force: true }));
const books = await import('../src/lib/notebooks.mjs');
const classes = await import('../src/lib/classes.mjs');
const validation = await import('../src/lib/learning/validation.mjs');
const config = patch => ({ ...defaultSettings('letterguess'), ...patch });
const initial = c => g.readLetterGuess({}, c);
const guess = (state, c, letters) => Array.from(letters).reduce((value, letter) => g.letterGuessStep(value, c, { type: 'guess', letter }), state);
const element = (c, state) => ({ id: crypto.randomUUID(), type: 'activity', activityKind: 'letterguess', x: 15, y: 35, width: 180, height: 180, rotation: 0, locked: false, color: '#253c42', settings: c, ...(state ? { response: { letterGuess: state } } : {}) });
const page = elements => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements });

test('Buchstabenraten ist ein eigenes gültiges Format und das bestehende Labyrinth bleibt erhalten', () => {
  assert.equal(activityCatalog.letterguess, 'Buchstaben raten'); assert.ok(activityCatalog.maze.includes('Labyrinth'));
  assert.equal(books.validatePage(page([element(config({}))])).elements[0].activityKind, 'letterguess');
});

test('Beide Tastaturen enthalten jeden deutschen Buchstaben genau einmal, einschließlich Umlauten und ß', () => {
  for (const layout of ['abc', 'qwertz']) {
    const keys = g.guessRows(config({ letterGuessLayout: layout })).flat();
    assert.equal(keys.length, 30); assert.equal(new Set(keys).size, 30);
    assert.deepEqual([...keys].sort(), [...g.guessAlphabet].sort());
  }
  assert.equal(g.guessDisplay('straße', config({})), 'STRAẞE');
});

test('Ein Treffer deckt alle Vorkommen auf; erneute Eingaben kosten keinen zusätzlichen Versuch', () => {
  const c = config({ words: ['Mama'] });
  const state = guess(initial(c), c, 'm');
  assert.deepEqual(g.guessSlots(state, c).map(slot => slot.visible), [true, false, true, false]);
  assert.equal(g.letterGuessStep(state, c, { type: 'guess', letter: 'M' }), state);
  const wrong = guess(state, c, 'z'); assert.equal(g.wrongGuesses(wrong, c).length, 1);
  assert.equal(g.letterGuessStep(wrong, c, { type: 'guess', letter: 'Z' }), wrong);
});

test('Umlaute, Unicode-Komposition, Großschreibung von ß und feste Wortabstände werden korrekt behandelt', () => {
  const c = config({ words: ['Bäu-me', 'Straße', "Oma's Haus"] });
  const state = g.letterGuessStep(initial(c), c, { type: 'guess', letter: 'A\u0308' });
  assert.deepEqual(state.guessed, ['ä']); assert.equal(g.wrongGuesses(state, c).length, 0);
  assert.equal(g.guessSlots(state, c)[1].text, 'Ä');
  const street = config({ words: ['Straße'] });
  assert.equal(g.guessPhase(guess(initial(street), street, 'STRAẞE'), street), 'won');
  const phrase = config({ words: ["Oma's Haus"] });
  assert.ok(g.guessSlots(initial(phrase), phrase).filter(slot => !slot.letter).every(slot => slot.visible));
  assert.equal(g.validGuessWord('ẞ'), true);
});

test('Nach dem letzten Fehlversuch wird das Wort aufgedeckt und bleibt bis zum Neustart gesperrt', () => {
  const c = config({ words: ['Maus'], letterGuessLives: 4 });
  const lost = guess(initial(c), c, 'bcde');
  assert.equal(g.guessPhase(lost, c), 'lost'); assert.equal(g.wrongGuesses(lost, c).length, 4);
  assert.ok(g.guessSlots(lost, c).every(slot => slot.visible));
  assert.equal(g.letterGuessStep(lost, c, { type: 'guess', letter: 'm' }), lost);
  const again = g.letterGuessStep(lost, c, { type: 'retry' });
  assert.deepEqual(again.guessed, []); assert.equal(g.guessPhase(again, c), 'playing');
});

test('Aufgedeckte Lösungen zählen nicht als erraten; erst abgeschlossene Wörter können weitergeschaltet werden', () => {
  const c = config({ words: ['Maus', 'Haus'] }), start = initial(c);
  assert.equal(g.letterGuessStep(start, c, { type: 'next' }), start);
  const revealed = g.letterGuessStep(start, c, { type: 'reveal' });
  assert.equal(g.guessPhase(revealed, c), 'revealed'); assert.equal(g.letterGuessScore(revealed, c), 0);
  const next = g.letterGuessStep(revealed, c, { type: 'next' });
  assert.equal(next.index, 1); assert.deepEqual(next.results, [false]);
});

test('Serienfortschritt und Abschluss zählen jedes Wort einmal und lassen sich erneut beginnen', () => {
  const c = config({ words: ['Maus', 'Haus'] });
  let state = guess(initial(c), c, 'maus'); assert.equal(g.letterGuessScore(state, c), 50); assert.equal(state.completed, false);
  state = g.letterGuessStep(state, c, { type: 'next' });
  state = guess(state, c, 'haus'); state = g.letterGuessStep(state, c, { type: 'next' });
  assert.equal(state.completed, true); assert.deepEqual(state.results, [true, true]); assert.equal(g.letterGuessScore(state, c), 100);
  assert.deepEqual(g.letterGuessStep(state, c, { type: 'restart' }), initial(c));
});

test('Leere oder ungeeignete Wortlisten können keine leere Serie als gewonnen abschließen', () => {
  const c = config({ words: [] }), state = initial(c);
  assert.equal(g.letterGuessStep(state, c, { type: 'next' }), state);
  assert.equal(g.guessPhase(state, c), 'playing'); assert.equal(g.letterGuessScore(state, c), 0);
  for (const text of ['123', 'Café', '😀', "'''", 'x'.repeat(41)]) assert.equal(g.validGuessWord(text), false);
  assert.equal(g.letterGuessStep(initial(config({})), config({}), { type: 'guess', letter: 'sch' }).guessed.length, 0);
});

test('Gespeicherte Buchstaben bleiben bei Layout-, Bild- und Schriftänderungen erhalten', () => {
  const c = config({ words: ['Maus'] }), state = guess(initial(c), c, 'mz');
  assert.deepEqual(g.readLetterGuess({ letterGuess: state }, { ...c, letterGuessLayout: 'qwertz', letterGuessCase: 'lower', font: 'Lexend', letterGuessClue: 'none' }), state);
  assert.deepEqual(g.readLetterGuess({ letterGuess: state }, { ...c, words: ['Haus'] }).guessed, []);
  assert.deepEqual(g.readLetterGuess({ letterGuess: state }, { ...c, letterGuessLives: 4 }).guessed, []);
});

test('Ohne Hinweis verraten verdeckte Felder das Zielwort nicht; schreibgeschützte Ansichten bleiben unbedienbar', () => {
  const c = config({ words: ['Geheimwort'], letterGuessClue: 'none' });
  const markup = renderToStaticMarkup(React.createElement(Activity, { element: element(c) }));
  assert.ok(!markup.includes('Geheimwort')); assert.ok(!markup.includes('GEHEIMWORT'));
  assert.equal((markup.match(/data-guess-letter=/g) || []).length, 30); assert.ok(markup.includes('disabled=""'));
  const lost = guess(initial(c), c, 'abcfjklpq'), revealed = g.letterGuessStep(lost, c, { type: 'reveal' });
  const face = renderToStaticMarkup(React.createElement(Activity, { element: element(c, revealed) }));
  assert.ok(face.includes('Buchstabe 1: G'));
});

test('Die Mausdarstellung und der sichtbare Fehlversuchsstatus folgen dem tatsächlichen Fehlerstand', () => {
  const start = renderToStaticMarkup(React.createElement(GuessMouse, { errors: 0, limit: 4 }));
  const end = renderToStaticMarkup(React.createElement(GuessMouse, { errors: 4, limit: 4 }));
  assert.ok(start.includes('4 Fehlversuche übrig.')); assert.ok(end.includes('Die Maus hat den Käse erreicht.'));
  assert.ok(!start.includes('translateX(70px)')); assert.ok(end.includes('translateX(70px)'));
});

test('Ungültige Spielstände, Wiederholungen und fremde Medien werden vor dem Speichern abgelehnt', () => {
  const c = config({}), state = initial(c);
  assert.deepEqual(validation.learningResponse({ letterGuess: state }).letterGuess, state);
  for (const patch of [{ index: 20 }, { guessed: ['a', 'a'] }, { guessed: ['sch'] }, { guessed: ['A'] }, { results: [1] }, { revealed: 'ja' }]) assert.throws(() => validation.learningResponse({ letterGuess: { ...state, ...patch } }));
  for (const patch of [{ letterGuessLives: 3 }, { letterGuessLives: 6.5 }, { letterGuessLayout: 'azerty' }, { words: ['Wort123'] }, { letterGuessItems: [{ word: 'Sonne', image: 'https://extern.invalid/bild.png' }] }]) assert.throws(() => validation.widgetSettings({ ...c, ...patch }));
});

test('Wortbilder, Ton und Spielstände werden gespeichert, für Kinder freigegeben und exportiert', async () => {
  const owner = crypto.randomUUID(), png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=', 'base64');
  const picture = await books.storeImage(owner, png), wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) }).arrayBuffer()), sound = await books.storeAudio(owner, wav);
  const c = config({ words: ['Maus'], letterGuessClue: 'both', letterGuessItems: [{ word: 'Maus', image: picture.src, audio: sound.src }] }), state = guess(initial(c), c, 'mz');
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Rateprobe', pages: [page([element(c, state)])] });
  let klass = await classes.createClass(owner, 'Rateklasse'); klass = await classes.changeClass(owner, klass.id, { addChild: 'Ada' });
  const [copy] = await classes.distribute(owner, klass.id, created.book.id), child = klass.children[0].id, own = await books.getBook(child, copy.id);
  assert.equal(own.pages[0].elements[0].locked, true); assert.equal(own.pages[0].elements[0].response, undefined);
  assert.ok(await books.readImage(child, picture.src.split('/').pop())); assert.ok(await books.readImage(child, sound.src.split('/').pop()));
  assert.ok(await books.savePage(child, copy.id, { ...own.pages[0], elements: own.pages[0].elements.map(el => ({ ...el, response: { letterGuess: state } })) }, true));
  const previous = globalThis.fetch;
  globalThis.fetch = async (url, request) => {
    if (url === picture.src || url === sound.src) return new Response(await books.readImage(owner, url.split('/').pop()), { headers: { 'content-type': url.endsWith('.wav') ? 'audio/wav' : 'image/png' } });
    if (url === '/api/medien' || url === '/api/ton') { const bytes = Buffer.from(await new Response(request.body).arrayBuffer()); return Response.json(await (url === '/api/ton' ? books.storeAudio(owner, bytes) : books.storeImage(owner, bytes))); }
    assert.equal(url, '/api/werkstatt'); return Response.json(await books.createBook(owner, 'lehrkraft', JSON.parse(request.body)));
  };
  try { const archive = await portable.exportArchive(created), imported = await portable.importPortable(new File([archive], 'raten.grundschulbuch')); assert.deepEqual(imported.pages[0].elements[0].settings, c); assert.deepEqual(imported.pages[0].elements[0].response.letterGuess, state); }
  finally { globalThis.fetch = previous; }
});
