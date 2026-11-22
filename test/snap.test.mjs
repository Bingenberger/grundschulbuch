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
const { snapMove, snapResize, outline } = await bundled('src/lib/snap.ts');
const sheet = { width: 297, height: 210 };
const box = (x, y, width, height) => ({ x, y, width, height });

test('Elemente rasten an der Seitenmitte ein und zeigen eine Hilfslinie', () => {
  const r = snapMove(box(128, 50, 40, 20), [], sheet, 2);
  assert.equal(r.dx, 148.5 - 148);
  assert.equal(r.dy, 0);
  assert.deepEqual(r.guides, [{ kind: 'line', axis: 'x', at: 148.5, from: 0, to: 210, page: true }]);
});

test('Kanten anderer Elemente und der Seitenrand fangen das Element', () => {
  const other = box(20, 100, 50, 30);
  const r = snapMove(box(21.2, 60, 30, 10), [other], sheet, 2);
  assert.ok(Math.abs(r.dx + 1.2) < 1e-9);
  const line = r.guides.find((g) => g.axis === 'x' && g.at === 20);
  assert.ok(line && !line.page && line.from === 60 && line.to === 130);
  const margin = snapMove(box(16, 80, 30, 10), [], sheet, 2);
  assert.equal(margin.dx, -1);
  assert.ok(margin.guides.some((g) => g.page && g.at === 15));
});

test('Gleiche Abstände zwischen Nachbarn werden angeboten', () => {
  const left = box(10, 50, 20, 20), right = box(100, 50, 20, 20);
  // Zwischen beiden mittig: freier Raum 70 − 20 = 50, also bei 55.
  const r = snapMove(box(54, 50, 20, 20), [left, right], sheet, 2);
  assert.equal(r.dx, 1);
  assert.equal(r.guides.filter((g) => g.kind === 'gap').length, 2);
});

test('Außerhalb der Toleranz bleibt alles, wie es ist', () => {
  const r = snapMove(box(40, 40, 33, 17), [], sheet, 1);
  assert.deepEqual(r, { dx: 0, dy: 0, guides: [] });
});

test('Beim Größe-Ändern rastet die gezogene Kante ein, mit festem Seitenverhältnis beide', () => {
  const free = snapResize(box(10, 10, 188.8, 40), 1, 1, [box(200, 60, 20, 20)], sheet, 2);
  assert.equal(free.box.width, 190);
  assert.equal(free.box.height, 40);
  assert.ok(free.guides.some((g) => g.axis === 'x' && g.at === 200 && !g.page));
  const ratio = snapResize(box(10, 10, 100, 50), 1, 1, [], sheet, 2, true);
  assert.equal(ratio.box.height, 50);
  const ratio2 = snapResize(box(10, 10, 270, 135), 1, 1, [], sheet, 3, true);
  assert.equal(ratio2.box.width, 272);
  assert.equal(ratio2.box.height, 136);
  const left = snapResize(box(16, 10, 50, 20), -1, 1, [], sheet, 2);
  assert.equal(left.box.x, 15);
  assert.equal(left.box.width, 51);
});

test('Gedrehte Elemente werden mit ihrem umschließenden Kasten verglichen', () => {
  const o = outline({ x: 0, y: 0, width: 20, height: 10, rotation: 90 });
  assert.ok(Math.abs(o.x - 5) < 1e-9 && Math.abs(o.width - 10) < 1e-9 && Math.abs(o.height - 20) < 1e-9);
});
