import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import sharp from 'sharp';
const output = await build({ entryPoints: ['src/components/BoardPointer.tsx'], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
const compiled = { exports: {} };
new Function('require', 'module', 'exports', output.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports);
const { BoardPointerVisual } = compiled.exports;
async function pixels(props) {
  const svg = renderToStaticMarkup(React.createElement(BoardPointerVisual, { width: 100, height: 100, point: { x: 50, y: 50 }, radius: 20, ...props }))
    .replace('width="100%" height="100%"', 'width="100" height="100"');
  const { data, info } = await sharp(Buffer.from(svg)).flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return (x, y, c = 0) => data[(y * info.width + x) * info.channels + c];
}

test('Taschenlampe lässt die Mitte unverändert, dunkelt außen ab und hat eine weiche Kante', async () => {
  const pixel = await pixels({ mode: 'light' });
  assert.equal(pixel(50, 50), 255);
  assert.ok(pixel(5, 5) >= 54 && pixel(5, 5) <= 58);
  assert.ok(pixel(68, 50) > pixel(72, 50));
  assert.ok(pixel(68, 50) < pixel(65, 50));
  const large = await pixels({ mode: 'light', radius: 30 });
  assert.equal(large(72, 50), 255);
  assert.ok(pixel(72, 50) < 60);
});

test('Lichtkreis kann am Seitenrand stehen, ohne die gegenüberliegende Seite aufzuhellen', async () => {
  const pixel = await pixels({ mode: 'light', point: { x: 0, y: 0 } });
  assert.equal(pixel(2, 2), 255);
  assert.ok(pixel(98, 98) < 60);
});

test('Laserpunkt und transparente Spur werden rot gerendert; eine leere Zeigeebene bleibt transparent', async () => {
  const pixel = await pixels({ mode: 'laser', trail: [{ x: 10, y: 50, opacity: 0.2 }, { x: 40, y: 50, opacity: 0.8 }] });
  assert.ok(pixel(50, 49) > pixel(50, 49, 1) + 100);
  assert.ok(pixel(25, 50) > pixel(25, 50, 1) + 40);
  assert.equal(pixel(5, 5), 255);
  const empty = await pixels({ mode: 'laser', point: null });
  assert.equal(empty(50, 50), 255);
  assert.equal(empty(50, 50, 1), 255);
});

test('Gleichzeitig gerenderte Lichtmasken haben getrennte SVG-IDs', () => {
  const props = { mode: 'light', width: 100, height: 100, point: { x: 50, y: 50 }, radius: 20 };
  const markup = renderToStaticMarkup(React.createElement(React.Fragment, null, React.createElement(BoardPointerVisual, props), React.createElement(BoardPointerVisual, props)));
  const ids = [...markup.matchAll(/<mask id="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, 2);
  assert.notEqual(ids[0], ids[1]);
});
