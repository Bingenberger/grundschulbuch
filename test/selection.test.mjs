import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

async function bundled(file) {
  const result = await build({ entryPoints: [file], bundle: true, write: false,
    platform: 'node', format: 'cjs', packages: 'external', logLevel: 'silent' });
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(
    createRequire(import.meta.url), compiled, compiled.exports,
  );
  return compiled.exports;
}
const sel = await bundled('src/lib/selection.ts');
const base = { rotation: 0, locked: false, color: '#000000' };
const box = (id, x, y, width, height, patch = {}) => ({ id, type: 'text', x, y, width, height, text: id, ...base, ...patch });
const line = (id, y, patch = {}) => ({ id, type: 'stroke', x: 0, y: y - 5, width: 100, height: 10, penWidth: 1, penStyle: 'pen',
  points: [{ x: 10, y: 5, pressure: 0.5 }, { x: 90, y: 5, pressure: 0.5 }], ...base, ...patch });

test('Ein Auswahlrahmen wählt berührte Elemente, aber keine gesperrten und keinen umgebenden Hintergrund', () => {
  const elements = [
    box('hintergrund', 0, 0, 210, 297),
    box('a', 20, 20, 30, 10),
    box('b', 60, 20, 30, 10),
    box('weit', 150, 200, 20, 10),
    box('fest', 30, 25, 10, 5, { locked: true }),
  ];
  const frame = sel.rectFrom({ x: 80, y: 40 }, { x: 15, y: 15 });
  assert.deepEqual(frame, { x: 15, y: 15, width: 65, height: 25 });
  assert.deepEqual(sel.elementsInFrame(elements, frame), ['a', 'b']);
  // A frame around everything still selects the background picture.
  assert.ok(sel.elementsInFrame(elements, { x: -5, y: -5, width: 220, height: 310 }).includes('hintergrund'));
});

test('Gedrehte Elemente werden mit ihrer tatsächlichen Ausdehnung erfasst', () => {
  const tall = box('gedreht', 50, 50, 100, 4, { rotation: 90 });
  const bounds = sel.elementBounds(tall);
  assert.ok(Math.abs(bounds.width - 4) < 1e-9 && Math.abs(bounds.height - 100) < 1e-9);
  assert.deepEqual(sel.elementsInFrame([tall], { x: 95, y: 5, width: 10, height: 10 }), ['gedreht']);
  assert.deepEqual(sel.elementsInFrame([tall], { x: 50, y: 45, width: 10, height: 10 }), []);
});

test('Antippen trifft Striche entlang der Linie, das oberste zuerst, gesperrte nie', () => {
  const lower = line('unten', 50), upper = line('oben', 51), locked = line('fest', 80, { locked: true });
  const elements = [lower, upper, locked];
  assert.equal(sel.strokeAt(elements, { x: 50, y: 51 })?.id, 'oben');
  assert.equal(sel.strokeAt([lower], { x: 50, y: 52 })?.id, 'unten');
  // Inside the bounding box but far from the line: nothing.
  assert.equal(sel.strokeAt([line('dick', 50, { height: 40, y: 30 })], { x: 50, y: 65 }), undefined);
  assert.equal(sel.strokeAt(elements, { x: 50, y: 80 }), undefined);
  assert.equal(sel.strokeAt(elements, { x: 50, y: 58 }, 2.5), undefined);
  assert.equal(sel.strokeAt(elements, { x: 50, y: 54 }, 4)?.id, 'oben');
});
