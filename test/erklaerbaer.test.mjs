// Erklärbär (Textsachen): sentences and keys must match the player exactly,
// otherwise own recordings would not be played; scenes like in the player.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';

async function module(file) {
  const result = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'esm', logLevel: 'silent' });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].contents).toString('base64'));
}
const ex = await module('src/lib/learning/erklaerbaer.ts');
const ts = await module('src/lib/learning/textsachen.ts');

// The tokenizer of the committed player (TSPlayer of Lernsachen-Heft 1.47.3), taken out of its source.
const player = JSON.parse(fs.readFileSync('src/lib/reference/textsachen-player.ts', 'utf8').match(/export const TSPLAYER = (".*");/s)[1]);
const from = player.indexOf('var Oe=/'), end = player.indexOf('return{tokens:n,sentences:l.filter(Boolean),words:r}}', from);
assert.ok(from > 0 && end > from, 'Tokenizer im Spieler nicht gefunden – Namen geändert?');
const tokenize = new Function(player.slice(from, end) + 'return{tokens:n,sentences:l.filter(Boolean),words:r}}; return Ae;')();
// What the editor of Textsachen records (pD) and how the player keys a sentence (x).
const key = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const playerSentences = (text) => tokenize(text).sentences
  .map((s) => s.tokens.map((t) => (t.kind === 'break' ? ' ' : t.text)).join('').replace(/\s+/g, ' ').trim())
  .filter(Boolean).map((t) => ({ text: t, key: key(t) }));

const TEXTS = [
  ts.SAMPLE_EXPLAIN,
  'Hallo! Wie geht es dir?  Mir geht es gut…\nUnd dir?\n\n\n„Prima“, sagt der Bär. Dann... ging er heim.',
  'Ohne Satzzeichen\nzweite Zeile\n\nneuer Absatz',
  'Das Auto-Rennen beginnt um 3.15 Uhr. Wer gewinnt? Die rote Nr. 7!',
  '  Leer  \r\n\r\n  ',
];

test('Sätze und Schlüssel wie im Spieler', () => {
  for (const text of TEXTS)
    assert.deepEqual(ex.explainSentences(text).map(({ text, key }) => ({ text, key })), playerSentences(text), text);
});

test('Szenen: Leerzeile, automatisch nach 3 Bildern, höchstens 6 Bilder', () => {
  const base = ts.defaultTs('explain');
  const pic = (...words) => words.map((word) => ({ word: word.toLocaleLowerCase('de-DE'), image: `/bild/${word}.png` }));
  // The example: a blank line divides it into two scenes.
  assert.deepEqual(ex.explainScenes(base).map((s) => s.sentences.length), [2, 2]);
  // Without pictures, „automatisch“ turns the page after three sentences.
  const plain = { ...base, text: 'Eins. Zwei. Drei. Vier. Fünf.', pictures: [] };
  assert.deepEqual(ex.explainScenes(plain).map((s) => s.sentences.length), [3, 2]);
  const manual = { ...plain, settings: { ...plain.settings, explain: { ...plain.settings.explain, autoScenes: false } } };
  assert.deepEqual(ex.explainScenes(manual).map((s) => s.sentences.length), [5]);
  // With pictures: after three pictures; a word that appears again needs no new picture.
  const pictured = { ...base, text: 'Der Igel frisst Käfer. Der Igel mag Würmer. Er schläft im Laub. Am Morgen ist es kalt.', pictures: pic('Igel', 'Käfer', 'Würmer', 'Laub') };
  assert.deepEqual(ex.explainScenes(pictured).map((s) => s.pictures.map((p) => p.word)), [['Igel', 'Käfer', 'Würmer'], ['Laub']]);
  // Never more than six pictures on a sheet, even without automatic scenes.
  const many = { ...manual, text: 'Apfel Birne Kiwi Pflaume. Banane Melone Traube.', pictures: pic('Apfel', 'Birne', 'Kiwi', 'Pflaume', 'Banane', 'Melone', 'Traube') };
  assert.deepEqual(ex.explainScenes(many).map((s) => s.pictures.length), [4, 3]);
});

test('Einstellungen bestehen die Prüfung des Servers', async () => {
  const { widgetSettings } = await import('../src/lib/learning/validation.mjs');
  const c = ts.tsConfig({ ...ts.defaultTs('explain'), voice: [{ sentence: 'der igel sucht im herbst viel futter', audio: '/api/medien/' + 'a'.repeat(64) + '.webm' }] });
  c.settings.explain = { ...c.settings.explain, music: 'own', audio: '/api/medien/' + 'b'.repeat(64) + '.mp3', musicName: 'Lied.mp3' };
  assert.doesNotThrow(() => widgetSettings({ title: 'Der Igel', ts: c }));
  // Recordings and music must lie on the school server.
  assert.throws(() => widgetSettings({ ts: { ...c, voice: [{ sentence: 'x', audio: 'https://example.org/a.mp3' }] } }), /Schulserver/);
});

test('Aufgabe für den Spieler: Aufnahmen und eigene Musik als Ton', () => {
  const c = ts.tsConfig({ ...ts.defaultTs('explain'), voice: [{ sentence: 'der igel sucht im herbst viel futter', audio: '/api/medien/a.webm' }, { sentence: '', audio: '/x' }, { sentence: 'ohne' }] });
  assert.equal(c.mode, 'explain');
  assert.equal(c.kind, 'text');
  assert.deepEqual(c.voice.map((r) => r.sentence), ['der igel sucht im herbst viel futter']);
  c.settings.explain = { ...c.settings.explain, voice: 'rec', music: 'own', audio: '/api/medien/m.mp3', musicName: 'Lied.mp3' };
  assert.deepEqual(ts.soundSources(c), ['/api/medien/a.webm', '/api/medien/m.mp3']);
  const task = ts.playerTask(c, 'Der Igel', new Map([['/api/medien/a.webm', 'data:audio/webm;base64,AA'], ['/api/medien/m.mp3', 'data:audio/mpeg;base64,AA']]));
  assert.equal(task.mode, 'explain');
  const voiceId = task.voice['der igel sucht im herbst viel futter'];
  assert.equal(task.assets[voiceId].mime, 'audio/webm');
  assert.equal(task.assets[task.settings.explain.musicId].name, 'Lied.mp3');
  assert.equal(task.settings.explain.audio, undefined);
  // Own music without a file is no music; unknown backgrounds fall back.
  const odd = ts.tsConfig({ kind: 'text', mode: 'explain', settings: { explain: { music: 'own', design: 'mars', pause: 9 } } });
  assert.equal(odd.settings.explain.music, 'none');
  assert.equal(odd.settings.explain.design, 'whiteboard');
  assert.equal(odd.settings.explain.pause, 3);
  // Computer voice: recordings stay saved but are not sent.
  c.settings.explain.voice = 'tts';
  assert.equal(ts.playerTask(c, '', new Map()).voice, undefined);
});
