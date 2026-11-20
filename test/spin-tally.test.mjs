import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const bundle = async (entry) => {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent', alias: { '@': './src' }, loader: { '.webp': 'empty', '.css': 'empty' } });
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
  return mod.exports;
};
const w = await bundle('src/lib/learning/werkzeuge.ts');
const { pictureWord } = await bundle('src/lib/learning/picture-search.ts');

const wheel = (labels, count = true) => ({ mode: 'wheel', count, fields: labels.map((label, i) => ({ label, color: ['#e03131', '#1c7ed6', '#2f9e44', '#f08c00'][i % 4] })) });
const spinEl = (spin) => ({ id: 'spin', type: 'widget', widgetKind: 'werkzeug', x: 8.5, y: 23.3, width: 127.3, height: 161.2, rotation: 0, locked: false, color: '#253c42', settings: w.toolSettings('spin', spin, 'Glücksrad') });
const page = { width: 297, height: 210 };
const tallyOf = (els) => els.find((e) => e.settings?.tool === 'tally');

test('Glücksrad mit „Strichliste daneben“: ohne Strichliste kommt eine dazu', () => {
  const els = w.syncSpinTally([spinEl(wheel(['Anna', 'Ben', 'Cem']))], 'spin', undefined, page);
  const tally = tallyOf(els);
  assert.ok(tally, 'a tally is added');
  const config = w.toolConfig('tally', tally.settings.werkzeug);
  assert.deepEqual(config.cats.map((c) => c.label), ['Anna', 'Ben', 'Cem']);
  assert.equal(config.title, 'Was kommt am häufigsten?');
  assert.ok(tally.x > 8.5 + 127.3, 'right of the wheel');
  assert.ok(tally.x + tally.width <= 297);
  // Dice: the sums 2 to 12.
  assert.deepEqual(w.spinCats({ mode: 'dice', dice: 2 }).map((c) => c.label), ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  assert.equal(w.spinTally({ mode: 'dice', dice: 1 }).title, 'Welche Zahl kommt am häufigsten?');
  // Without “Strichliste daneben” nothing changes.
  const off = [spinEl(wheel(['A', 'B'], false))];
  assert.equal(w.syncSpinTally(off, 'spin', undefined, page), off);
});

test('Neue Felder: die Strichliste übernimmt sie, Striche gleicher Felder bleiben', () => {
  const before = wheel(['Anna', 'Ben', 'Cem']);
  let els = w.syncSpinTally([spinEl(before)], 'spin', undefined, page);
  const id = tallyOf(els).id;
  // Strokes made: Anna 3, Ben 1.
  els = els.map((e) => (e.id === id ? { ...e, settings: { ...e.settings, werkzeug: { ...e.settings.werkzeug, counts: [3, 1, 0] } } } : e));
  const after = wheel(['ben', 'Dora', 'Anna']);
  els = els.map((e) => (e.id === 'spin' ? spinEl(after) : e));
  els = w.syncSpinTally(els, 'spin', w.toolSettings('spin', before, '').werkzeug, page);
  assert.equal(els.filter((e) => e.settings?.tool === 'tally').length, 1, 'no second tally');
  const config = w.toolConfig('tally', tallyOf(els).settings.werkzeug);
  assert.deepEqual(config.cats.map((c) => c.label), ['ben', 'Dora', 'Anna']);
  assert.deepEqual(config.counts, [1, 0, 3]);
});

test('Bildersuche für Listenzeilen: das Hauptwort aus einem Satz', () => {
  assert.equal(pictureWord('Es gibt einen Aufzug.'), 'Aufzug');
  assert.equal(pictureWord('Hände waschen'), 'Hände');
  assert.equal(pictureWord('Apfel'), 'Apfel');
  assert.equal(pictureWord('Kann man das Essen? Brot'), 'Essen');
  assert.equal(pictureWord(''), '');
});
