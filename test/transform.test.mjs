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
const t = await bundled('src/lib/transform.ts');
const el = (patch = {}) => ({ id: 'a', type: 'image', x: 50, y: 50, width: 40, height: 20, rotation: 0, locked: false, color: '#000000', ...patch });
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} ≠ ${b}`);
const corner = (e, sx, sy) => {
  const a = (e.rotation * Math.PI) / 180, cx = e.x + e.width / 2, cy = e.y + e.height / 2;
  const dx = (sx * e.width) / 2, dy = (sy * e.height) / 2;
  return { x: cx + dx * Math.cos(a) - dy * Math.sin(a), y: cy + dx * Math.sin(a) + dy * Math.cos(a) };
};

test('Jede Ecke vergrößert, während die gegenüberliegende Ecke stehen bleibt – auch gedreht', () => {
  for (const rotation of [0, 30, -120]) {
    for (const [name, sx, sy] of [['nw', -1, -1], ['ne', 1, -1], ['sw', -1, 1], ['se', 1, 1]]) {
      const before = el({ rotation });
      const start = corner(before, sx, sy);
      const after = t.resizeAtCorner(before, name, start, { x: start.x + 7, y: start.y - 4 });
      const fixedBefore = corner(before, -sx, -sy), fixedAfter = corner(after, -sx, -sy);
      close(fixedBefore.x, fixedAfter.x); close(fixedBefore.y, fixedAfter.y);
      // The dragged corner follows the pointer when nothing is clamped.
      const moved = corner(after, sx, sy);
      close(moved.x, start.x + 7); close(moved.y, start.y - 4);
    }
  }
});

test('Mindestgröße, Seitenverhältnis und mitskalierte Strichpunkte', () => {
  const tiny = t.resizeAtCorner(el(), 'se', { x: 90, y: 70 }, { x: 0, y: 0 });
  assert.equal(tiny.width, 3); assert.equal(tiny.height, 3);
  const ratio = t.resizeAtCorner(el(), 'se', { x: 90, y: 70 }, { x: 130, y: 72 }, true);
  close(ratio.width / ratio.height, 2);
  const stroke = el({ type: 'stroke', points: [{ x: 40, y: 20, pressure: 0.5 }] });
  const wider = t.resizeAtCorner(stroke, 'se', { x: 90, y: 70 }, { x: 130, y: 70 });
  close(wider.points[0].x, 80); close(wider.points[0].y, 20);
});

test('Drehen folgt dem Zeiger um die Mitte und rastet nahe an 15°-Schritten ein', () => {
  const e = el();
  const center = t.elementCenter(e);
  const top = { x: center.x, y: center.y - 30 };
  assert.equal(t.rotateTo(e, center, top, { x: center.x + 30, y: center.y }).rotation, 90);
  assert.equal(t.rotateTo(e, center, top, { x: center.x - 30, y: center.y }).rotation, -90);
  const slight = { x: center.x + 30 * Math.sin(Math.PI / 18), y: center.y - 30 * Math.cos(Math.PI / 18) };
  assert.equal(t.rotateTo(e, center, top, slight).rotation, 10);
  const almost = { x: center.x + 30 * Math.sin((13 * Math.PI) / 180), y: center.y - 30 * Math.cos((13 * Math.PI) / 180) };
  assert.equal(t.rotateTo(e, center, top, almost).rotation, 15);
  assert.equal(t.rotateTo(e, center, top, slight, true).rotation, 15);
  assert.equal(t.snapAngle(350), -10);
  assert.equal(t.snapAngle(-180), 180);
});
