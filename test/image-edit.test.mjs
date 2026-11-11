import { test } from 'node:test';
import assert from 'node:assert/strict';
import { render, rotate, crop, pixelate, toggleEffect, cleanEdit, resultSize, applyEffects } from '../src/lib/image-edit.mjs';

// 4×2 picture: each pixel's red value is its index, so moves are easy to follow.
const picture = () => {
  const data = new Uint8ClampedArray(4 * 2 * 4);
  for (let i = 0; i < 8; i++) data.set([i * 10, 0, 0, 255], i * 4);
  return { width: 4, height: 2, data };
};
const reds = (img) => Array.from({ length: img.width * img.height }, (_, i) => img.data[i * 4]);

test('Drehen, Spiegeln und Zuschneiden verschieben die Pixel richtig', () => {
  const right = rotate(picture(), 1);
  assert.deepEqual([right.width, right.height], [2, 4]);
  assert.deepEqual(reds(right), [40, 0, 50, 10, 60, 20, 70, 30]);
  assert.deepEqual(reds(rotate(right, -1)), reds(picture()));
  assert.deepEqual(reds(render(picture(), [{ type: 'flip' }], {})), [30, 20, 10, 0, 70, 60, 50, 40]);
  const part = crop(picture(), { x: 0.25, y: 0.5, w: 0.5, h: 0.5 });
  assert.deepEqual([part.width, part.height, ...reds(part)], [2, 1, 50, 60]);
  assert.deepEqual(resultSize(400, 200, [{ type: 'rotate', dir: 1 }, { type: 'crop', x: 0, y: 0, w: 0.5, h: 1 }]), { width: 100, height: 400 });
  // The original stays untouched.
  const original = picture();
  render(original, [{ type: 'bar', x: 0, y: 0, w: 1, h: 1 }], { invert: 100 });
  assert.deepEqual(reds(original), reds(picture()));
});

test('Verpixeln mittelt Blöcke, Balken schwärzen vollständig', () => {
  const size = 24, data = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < size * size; i++) data.set([i % 2 ? 255 : 0, 0, 0, 255], i * 4);
  const img = pixelate({ width: size, height: size, data }, { r: 0.5, pts: [[0.5, 0.5]] });
  const centre = (12 * size + 12) * 4;
  assert.ok(Math.abs(img.data[centre] - 128) <= 1, `Mittelwert statt Schachbrett: ${img.data[centre]}`);
  assert.equal(img.data[centre + 4], img.data[centre]);
  const black = render(picture(), [{ type: 'bar', x: 0, y: 0, w: 0.5, h: 1 }], {});
  assert.deepEqual(reds(black), [17, 17, 20, 30, 17, 17, 60, 70]);
});

test('Effekte: Gruppen schließen sich aus, Stärke wirkt, Arbeitsblatt macht Schwarzweiß', () => {
  let effects = toggleEffect({}, 'gray');
  effects = toggleEffect(effects, 'bright');
  effects = toggleEffect(effects, 'sepia');
  assert.deepEqual(effects, { bright: 50, sepia: 100 });
  assert.deepEqual(toggleEffect(effects, 'bright'), { sepia: 100 });
  const px = (r, g, b) => ({ width: 1, height: 1, data: new Uint8ClampedArray([r, g, b, 255]) });
  assert.deepEqual(Array.from(applyEffects(px(200, 100, 50), { gray: 100 }).data.slice(0, 3)), [124, 124, 124]);
  assert.deepEqual(Array.from(applyEffects(px(200, 100, 50), { gray: 0 }).data.slice(0, 3)), [200, 100, 50]);
  assert.deepEqual(Array.from(applyEffects(px(240, 240, 240), { scan: 50 }).data.slice(0, 3)), [255, 255, 255]);
  assert.deepEqual(Array.from(applyEffects(px(40, 40, 40), { scan: 50 }).data.slice(0, 3)), [0, 0, 0]);
});

test('Bearbeitungen vom Gerät werden streng geprüft', () => {
  const ok = cleanEdit({ steps: [{ type: 'crop', x: 0.1, y: 0.1, w: 0.5, h: 0.5, extra: 1 }, { type: 'pixel', r: 0.05, pts: [[0.2, 0.3]] }], effects: { bright: 30 } });
  assert.deepEqual(ok.steps[0], { type: 'crop', x: 0.1, y: 0.1, w: 0.5, h: 0.5 });
  for (const bad of [
    { steps: [{ type: 'crop', x: 0.8, y: 0, w: 0.5, h: 1 }] },
    { steps: [{ type: 'rotate', dir: 2 }] },
    { steps: [{ type: 'pixel', r: 3, pts: [[0, 0]] }] },
    { steps: [{ type: 'eval' }] },
    { steps: [], effects: { gray: 100, sepia: 100 } },
    { steps: [], effects: { blur: 10 } },
    { steps: Array(201).fill({ type: 'flip' }) },
  ])
    assert.throws(() => cleanEdit(bad));
});
