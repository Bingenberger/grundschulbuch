import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

async function load(file) {
  const result = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent' });
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
  return mod.exports;
}
const pv = await load('src/lib/learning/placevalue.ts');
const nl = await load('src/lib/learning/numberline.ts');
const hf = await load('src/lib/learning/hundredfield.ts');

test('Stellenwerttafel: Montessori-Farben, Wert, Bündeln und Entbündeln', () => {
  const places = pv.shownPlaces(0, 3);
  assert.deepEqual(places.map((p) => p.short), ['T', 'H', 'Z', 'E']);
  assert.deepEqual(places.map((p) => p.color), ['#2f9e44', '#e03131', '#1c7ed6', '#2f9e44']);
  let c = pv.countsOf(places, 3407);
  assert.deepEqual(c, [3, 4, 0, 7]);
  assert.equal(pv.countsValue(places, c), 3407);
  for (let k = 0; k < 3; k++) c = pv.addOne(c, 3);
  assert.equal(c[3], 10);
  assert.ok(pv.canBundle(c, 3));
  c = pv.bundle(c, 3);
  assert.deepEqual(c, [3, 4, 1, 0]);
  assert.equal(pv.countsValue(places, c), 3410);
  c = pv.unbundle(c, 0);
  assert.deepEqual(c, [2, 14, 1, 0]);
  assert.equal(pv.countsValue(places, c), 3410);
  assert.ok(!pv.canBundle(c, 0), 'nothing left of the biggest place');
  assert.equal(pv.placeText(places, c), '2 T 14 H 1 Z 0 E');
});

test('Stellenwerttafel: Aufgaben passen zu den gezeigten Stellen', () => {
  const places = pv.shownPlaces(1, 2); // H Z
  const tasks = pv.placeTasks(places, 5, 3);
  assert.equal(tasks.length, 5);
  assert.ok(tasks.every((n) => n % 10 === 0 && n >= 10 && n <= 990));
  assert.equal(new Set(tasks).size, 5);
  assert.deepEqual(pv.placeSettings({ from: 9, to: -2 }), { from: 4, to: 1, counters: true, digits: true, total: true, exchange: true, tasks: 0 });
});

test('Zahlenstrahl: Striche, Einrasten, Sprünge', () => {
  assert.deepEqual(nl.ticks(0, 20), { small: 1, middle: 5, big: 10 });
  assert.deepEqual(nl.ticks(0, 1000), { small: 10, middle: 50, big: 100 });
  const s = nl.numberLineSettings({ start: 0, end: 100 });
  assert.equal(nl.valueAt(s, nl.xOf(s, 37) + 2), 37);
  assert.equal(nl.valueAt(s, 0), 0, 'clamped to the start');
  assert.deepEqual(nl.togglePoint([3, 9], 5), [3, 5, 9]);
  assert.deepEqual(nl.togglePoint([3, 5, 9], 5), [3, 9]);
  assert.equal(nl.jumpText({ from: 8, to: 15 }), '+7');
  assert.equal(nl.jumpText({ from: 15, to: 12 }), '−3');
  const tasks = nl.findTasks({ ...s, tasks: 6 }, 9);
  assert.equal(tasks.length, 6);
  assert.ok(tasks.every((n) => n > 0 && n < 100));
});

test('Hunderterfeld: Punkte, Lücke nach fünf, Aufgaben', () => {
  assert.equal(hf.dotXY(5).x - hf.dotXY(4).x, 62 + 22);
  assert.equal(hf.dotXY(50).y - hf.dotXY(40).y, 62 + 22);
  let dots = Array(100).fill(0);
  dots = hf.paint(dots, 3, 1);
  dots = hf.paint(dots, 4, 2);
  assert.equal(hf.painted(dots), 2);
  const s = hf.fieldSettings({ size: 20, mode: 'show', tasks: 4 });
  assert.ok(hf.fieldTasks(s, 2).every((n) => n >= 1 && n <= 20));
});
