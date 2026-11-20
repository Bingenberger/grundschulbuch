import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/learning/mathtool.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { mathTool, mathToolSettings, pageSize, viewSize, tapBoat, boatButton, boatOf, boatSum, tapAbacus, abacusStart, rowsOf, beadRed, beadX, pressKey, freshCalc, showNumber, mathToolLabel } = mod.exports;

test('Einstellungen werden bereinigt wie in der Vorlage', () => {
  assert.deepEqual(mathTool({}), { tool: 'boat', n: 10 });
  assert.deepEqual(mathTool({ mathTool: 'boat', mathSize: 7 }), { tool: 'boat', n: 10 });
  assert.deepEqual(mathTool({ mathTool: 'abacus', mathSize: 5 }), { tool: 'abacus', n: 10 });
  assert.deepEqual(mathTool({ mathTool: 'ruler', mathSize: 99 }), { tool: 'ruler', n: 30 });
  assert.deepEqual(mathTool({ mathTool: 'calc', mathSize: 4 }), { tool: 'calc', n: 0 });
  // Settings page of the reference: layout, tokens/number at the start, sum below.
  assert.deepEqual(mathTool({ mathTool: 'boat', mathSize: 20, mathWide: true, mathBlue: 4, mathRed: 30, mathShow: 'tap' }), { tool: 'boat', n: 20, show: 'tap', wide: true, blue: 4, red: 16 });
  assert.deepEqual(mathTool({ mathTool: 'boat', mathSize: 5, mathWide: true }), { tool: 'boat', n: 5 }, 'one boat is never wide');
  assert.deepEqual(mathTool({ mathTool: 'abacus', mathSize: 2, mathStart: 43, mathShow: 'on' }), { tool: 'abacus', n: 2, show: 'on', start: 20 });
  assert.deepEqual(mathTool({ mathTool: 'abacus', mathSize: 10, mathStart: 43, mathShow: 'off' }), { tool: 'abacus', n: 10, start: 43 });
  const t = { tool: 'boat', n: 10, wide: true, blue: 3 };
  assert.deepEqual(mathTool(mathToolSettings(t)), t, 'settings round trip');
});

test('Das Lineal hat beim Druck seine echte Länge (mm), die anderen ihre Vorlagengröße', () => {
  assert.deepEqual(pageSize({ tool: 'ruler', n: 15 }), { width: 166, height: 32 });
  assert.equal(pageSize({ tool: 'boat', n: 10 }).width, 93.6);
  assert.deepEqual(viewSize({ tool: 'boat', n: 20 }), { w: 580, h: 14 + 4 * 128 + 3 * 12 + 22 + 84 });
  assert.deepEqual(viewSize({ tool: 'boat', n: 20, wide: true }), { w: 1136, h: 14 + 2 * 128 + 12 + 84 });
  assert.deepEqual(viewSize({ tool: 'abacus', n: 2 }), { w: 1020, h: 282 });
  assert.equal(pageSize({ tool: 'calc', n: 0 }).height, 91.9);
});

test('Rechenschiffchen wie in der Vorlage: erst blau, dann rot, ohne Lücke', () => {
  let s = { blue: 0, red: 0 };
  s = tapBoat(s, 3); // a free place fills up to there
  assert.deepEqual(s, { blue: 4, red: 0 });
  s = tapBoat(s, 1); // a blue token turns red with all after it
  assert.deepEqual(s, { blue: 1, red: 3 });
  s = tapBoat(s, 6); // filling up goes on in red
  assert.deepEqual(s, { blue: 1, red: 6 });
  s = tapBoat(s, 4); // a red token turns blue with all before it
  assert.deepEqual(s, { blue: 5, red: 2 });
  assert.equal(boatSum(s), '5 + 2 = 7');
  assert.equal(boatSum({ blue: 0, red: 3 }), '3');
  // The round buttons below.
  assert.deepEqual(boatButton({ blue: 2, red: 1 }, 'blue', 5), { blue: 3, red: 1 });
  assert.deepEqual(boatButton({ blue: 2, red: 1 }, 'red', 5), { blue: 2, red: 2 });
  assert.deepEqual(boatButton({ blue: 4, red: 1 }, 'blue', 5), { blue: 4, red: 1 }, 'full');
  assert.deepEqual(boatButton({ blue: 2, red: 1 }, 'less', 5), { blue: 2, red: 0 });
  assert.deepEqual(boatButton({ blue: 2, red: 0 }, 'less', 5), { blue: 1, red: 0 });
  // Saved answer, older list of places, else the start of the settings.
  const t = { tool: 'boat', n: 10, blue: 4, red: 3 };
  assert.deepEqual(boatOf(t, {}), { blue: 4, red: 3 });
  assert.deepEqual(boatOf(t, { blue: 2, red: 0 }), { blue: 2, red: 0 });
  assert.deepEqual(boatOf({ tool: 'boat', n: 5 }, { cells: [1, 2, 2, 0, 0] }), { blue: 1, red: 2 });
  assert.equal(mathToolLabel({ tool: 'boat', n: 5 }, { boat: { blue: 1, red: 1 } }), 'Rechenschiffchen 5: 1 blaue und 1 rote Plättchen.');
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
  // Number at the start: full rows are tens.
  assert.deepEqual(abacusStart({ tool: 'abacus', n: 10, start: 43 }), [10, 10, 10, 10, 3, 0, 0, 0, 0, 0]);
  assert.deepEqual(rowsOf({ tool: 'abacus', n: 2, start: 12 }, {}), [10, 2]);
  assert.deepEqual(rowsOf({ tool: 'abacus', n: 2, start: 12 }, { rows: [3, 0] }), [3, 0]);
  assert.equal(mathToolLabel({ tool: 'abacus', n: 2 }, { rows: [1, 0] }), 'Rechenrahmen 20: 1 Kugel links.');
});

test('Rechenrahmen: alle Kugeln sind gefärbt, nach fünf wechselt die Farbe', () => {
  const twenty = { tool: 'abacus', n: 2 }, hundred = { tool: 'abacus', n: 10 };
  assert.deepEqual(Array.from({ length: 10 }, (_, b) => beadRed(twenty, 1, b)), [true, true, true, true, true, false, false, false, false, false]);
  // On the frame to 100 the lower five rows start blue.
  assert.equal(beadRed(hundred, 4, 0), true);
  assert.equal(beadRed(hundred, 5, 0), false);
  assert.equal(beadRed(hundred, 5, 9), true);
});

test('Taschenrechner rechnet wie in der Vorlage', () => {
  const keys = (list) => list.reduce((c, k) => pressKey(c, k), freshCalc());
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
  // Kassenzettel: each finished sum goes onto the strip.
  const tape = [];
  ['1', '2', '+', '3', '0', '=', '÷', '4', '=', '+', '='].reduce((c, k) => pressKey(c, k, (line) => tape.push(line)), freshCalc());
  assert.deepEqual(tape, ['12 + 30 = 42', '42 ÷ 4 = 10,5']);
  assert.deepEqual(mathTool({ mathTool: 'calc', mathTape: true }), { tool: 'calc', n: 0, tape: true });
  assert.deepEqual(viewSize({ tool: 'calc', n: 0, tape: true }), { w: 650, h: 520 });
  assert.equal(pageSize({ tool: 'calc', n: 0, tape: true }).height, 91.9, 'same height as without the strip');
});
