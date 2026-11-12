import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/learning/mathtool.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { mathTool, pageSize, tapBoat, tapAbacus, beadX, pressKey, freshCalc, showNumber, mathToolLabel } = mod.exports;

test('Einstellungen werden bereinigt wie in der Vorlage', () => {
  assert.deepEqual(mathTool({}), { tool: 'boat', n: 10 });
  assert.deepEqual(mathTool({ mathTool: 'boat', mathSize: 7 }), { tool: 'boat', n: 10 });
  assert.deepEqual(mathTool({ mathTool: 'abacus', mathSize: 5 }), { tool: 'abacus', n: 10 });
  assert.deepEqual(mathTool({ mathTool: 'ruler', mathSize: 99 }), { tool: 'ruler', n: 30 });
  assert.deepEqual(mathTool({ mathTool: 'calc', mathSize: 4 }), { tool: 'calc', n: 0 });
});

test('Das Lineal hat beim Druck seine echte Länge (mm), die anderen ihre Vorlagengröße', () => {
  assert.deepEqual(pageSize({ tool: 'ruler', n: 15 }), { width: 166, height: 32 });
  assert.equal(pageSize({ tool: 'boat', n: 10 }).width, 93.3);
  assert.equal(pageSize({ tool: 'calc', n: 0 }).height, 91.9);
});

test('Rechenschiffchen: immer der Reihe nach, blau – rot – weg am letzten Plättchen', () => {
  let cells = Array(5).fill(0);
  cells = tapBoat(cells, 3); // tapping anywhere after the end adds the next one
  assert.deepEqual(cells, [1, 0, 0, 0, 0]);
  cells = tapBoat(cells, 1);
  assert.deepEqual(cells, [1, 1, 0, 0, 0]);
  cells = tapBoat(cells, 1); // the last token: blue → red
  assert.deepEqual(cells, [1, 2, 0, 0, 0]);
  cells = tapBoat(cells, 4); // the next one takes the colour before it
  assert.deepEqual(cells, [1, 2, 2, 0, 0]);
  assert.deepEqual(tapBoat(cells, 0), cells, 'earlier tokens do not change');
  cells = tapBoat(cells, 2); // red → gone
  assert.deepEqual(cells, [1, 2, 0, 0, 0]);
  cells = tapBoat(cells, 2); // and in again
  assert.deepEqual(cells, [1, 2, 2, 0, 0]);
  const full = [1, 1, 1, 1, 1];
  assert.deepEqual(tapBoat(full, 4), [1, 1, 1, 1, 2]);
  assert.equal(mathToolLabel({ tool: 'boat', n: 5 }, { cells: [1, 2, 0, 0, 0] }), 'Rechenschiffchen 5: 1 blaue und 1 rote Plättchen.');
});

test('Rechenrahmen: Kugel antippen schiebt sie mit allen davor nach links und zurück', () => {
  let rows = [0, 0];
  rows = tapAbacus(rows, 0, 6);
  assert.deepEqual(rows, [7, 0]);
  rows = tapAbacus(rows, 0, 3);
  assert.deepEqual(rows, [3, 0]);
  assert.equal(beadX(0, 3), 100);
  assert.equal(beadX(9, 0), 920);
  assert.equal(beadX(3, 3), 920 - 6 * 62);
});

test('Taschenrechner rechnet wie in der Vorlage', () => {
  const keys = (list) => list.reduce(pressKey, freshCalc());
  assert.equal(keys(['1', '2', '+', '3', '0', '=']).shown, '42');
  assert.equal(keys(['7', '÷', '2', '=']).shown, '3,5');
  assert.equal(keys(['2', '+', '3', '×', '4', '=']).shown, '20', 'from left to right');
  assert.equal(keys(['5', '÷', '0', '=']).shown, 'Fehler');
  assert.equal(keys(['5', '÷', '0', '=', '3']).shown, '3', 'any key after an error starts again');
  assert.equal(keys(['1', ',', '5', '+', ',', '5', '=']).shown, '2');
  assert.equal(keys(['1', '2', '3', 'del']).shown, '12');
  assert.equal(keys(['9', '+', '−', '4', '=']).shown, '5', 'a second operator replaces the first');
  assert.equal(keys(['9', 'C']).shown, '0');
  assert.equal(showNumber(1 / 3), '0,333333333');
});
