import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import sharp from 'sharp';
async function bundle(file) {
  const code = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', code.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports);
  return compiled.exports;
}
const flood = await bundle('src/lib/flood-fill.ts');
const fill = await bundle('src/lib/fill.ts');
const drawing = await bundle('src/lib/drawing.ts');
const { Stroke } = await bundle('src/components/PageView.tsx');
const { useEditor } = await bundle('src/lib/editor-store.ts');
const portable = await bundle('src/lib/portable.ts');
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-fill-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'fill-test-only'.padEnd(48, 'x');
after(() => fs.rm(directory, { recursive: true, force: true }));
const books = await import('../src/lib/notebooks.mjs');
const point = (x, y) => ({ x, y, pressure: 0.5 });
const stroke = patch => ({ id: crypto.randomUUID(), type: 'stroke', x: 0, y: 0, width: 100, height: 100,
  rotation: 0, locked: false, color: '#000000', penWidth: 2, penStyle: 'pen', brushVersion: 2, opacity: 1,
  points: [point(10, 50), point(90, 50)], ...patch });
const page = elements => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements });
const image = (width, height, pixel = () => [255, 255, 255, 255]) => Uint8ClampedArray.from(Array.from({ length: width * height }, (_, i) => pixel(i % width, Math.floor(i / width))).flat());
async function rendered(elements) {
  const contents = elements.map(el => `<g transform="translate(${el.x} ${el.y}) rotate(${el.rotation} ${el.width / 2} ${el.height / 2})">${renderToStaticMarkup(React.createElement(Stroke, { element: el })).replace('width="100%" height="100%"', `width="${el.width}" height="${el.height}"`)}</g>`).join('');
  return new Uint8ClampedArray(await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/>${contents}</svg>`)).ensureAlpha().raw().toBuffer());
}
const value = (data, x, y, c = 0) => data[(y * 100 + x) * 4 + c];

test('Flächenfüllung bleibt innerhalb einer Kontur, erhält Inseln und springt nicht diagonal', () => {
  const pixels = image(12, 12, (x, y) => (x === 1 || x === 10 || y === 1 || y === 10 || x >= 5 && x <= 6 && y >= 5 && y <= 6) ? [0, 0, 0, 255] : [255, 255, 255, 255]);
  const region = flood.floodRegion(pixels, 12, 12, { x: 3, y: 3 });
  assert.equal(region[3 * 12 + 3], 1);
  assert.equal(region[0], 0);
  assert.equal(region[5 * 12 + 5], 0);
  const diagonal = flood.floodRegion(image(2, 2, (x, y) => x === y ? [255, 255, 255, 255] : [0, 0, 0, 255]), 2, 2, { x: 0, y: 0 });
  assert.deepEqual([...diagonal], [1, 0, 0, 0]);
});

test('Offene Linien lassen Farbe durch; Toleranz bleibt an die Startfarbe gebunden', () => {
  const pixels = image(10, 10, (x, y) => x === 5 && y !== 5 ? [0, 0, 0, 255] : [255, 255, 255, 255]);
  const region = flood.floodRegion(pixels, 10, 10, { x: 2, y: 2 });
  assert.equal(region[8 * 10 + 8], 1);
  const ramp = image(10, 1, x => [x * 10, x * 10, x * 10, 255]);
  assert.deepEqual([...flood.floodRegion(ramp, 10, 1, { x: 0, y: 0 }, 28)], [1, 1, 1, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual([...flood.floodRegion(image(2, 1, x => x ? [0, 0, 0, 0] : [255, 255, 255, 255]), 2, 1, { x: 0, y: 0 })], [1, 1]);
  assert.equal(flood.floodRegion(pixels, 10, 10, { x: -1, y: 0 }).some(Boolean), false);
  assert.throws(() => flood.floodRegion(pixels, 3000, 3000, { x: 0, y: 0 }));
});

test('Konturen geben alle ausgewählten Bildpunkte wieder, einschließlich Löchern und Eckkontakten', () => {
  let seed = 42;
  for (let n = 0; n < 100; n++) {
    const mask = Uint8Array.from({ length: 100 }, () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32 < 0.6 ? 1 : 0; });
    const polygon = flood.regionPolygon(mask, 10, 10);
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++)
      assert.equal(drawing.insidePolygon({ x: x + 0.5, y: y + 0.5 }, polygon), !!mask[y * 10 + x]);
  }
  assert.throws(() => flood.regionPolygon(Uint8Array.from({ length: 100 }, (_, i) => i % 2), 10, 10, 5), /detailreich/);
  assert.equal(flood.regionPolygon(new Uint8Array(100), 10, 10).length, 0);
});

test('Mehrere echte Striche begrenzen eine füllbare Fläche; Füllung erzeugt keine zusätzlichen Konturlinien', async () => {
  const vertices = [point(10, 10), point(90, 10), point(90, 90), point(10, 90), point(10, 10)];
  const borders = vertices.slice(1).map((p, i) => stroke({ points: [vertices[i], p] }));
  const raster = await rendered(borders);
  const region = flood.floodRegion(raster, 100, 100, { x: 50, y: 50 });
  const el = fill.filledRegion(region, 100, 100, 100, 100, '#ff0000', 0.5);
  assert.equal(el.fillOnly, true);
  const result = await rendered([...borders, el]);
  assert.equal(value(result, 50, 50), 255);
  assert.ok(value(result, 50, 50, 1) > 120 && value(result, 50, 50, 1) < 135);
  assert.equal(value(result, 5, 5, 1), 255);
  assert.equal(value(result, 50, 10, 1), 0);
});

test('Innenlöcher bleiben auch gerendert frei; unsichtbare Konturbrücken lösen keinen Ganzstrichradierer aus', async () => {
  const mask = Uint8Array.from({ length: 10000 }, (_, i) => {
    const x = i % 100, y = Math.floor(i / 100);
    return x >= 10 && x < 90 && y >= 10 && y < 90 && !(x >= 30 && x < 70 && y >= 30 && y < 70) ? 1 : 0;
  });
  const el = fill.filledRegion(mask, 100, 100, 100, 100, '#000000', 1);
  const raster = await rendered([el]);
  assert.equal(value(raster, 20, 20), 0);
  assert.equal(value(raster, 50, 50), 255);
  const options = { mode: 'stroke', size: 1, opacity: 1, soft: false };
  assert.deepEqual(drawing.eraseElements([el], [point(50, 50)], 'rub', options), [el]);
  assert.deepEqual(drawing.eraseElements([el], [point(20, 20)], 'rub', options), []);
  const erased = drawing.eraseElements([el], [point(20, 20)], 'area-rub', { ...options, mode: 'area', size: 8 });
  assert.equal(value(await rendered(erased), 20, 20), 255);
  assert.equal(value(await rendered(erased), 80, 80), 0);
});

test('Geschlossene Formen werden in lokalen gedrehten Koordinaten getroffen; offene Linien und leere Stellen ändern nichts', () => {
  const triangle = stroke({ x: 20, y: 30, width: 60, height: 40, rotation: 90,
    points: [point(0, 0), point(60, 0), point(30, 40), point(0, 0)], geometry: 'triangle' });
  const elements = [triangle];
  assert.equal(fill.fillObject(elements, point(5, 5), '#ff0000', () => false), elements);
  assert.equal(fill.fillObject(elements, point(50, 45), '#ff0000', () => false)[0].fill, '#ff0000');
  assert.equal(fill.fillObject(elements, point(35, 75), '#ff0000', () => false), elements);
  const open = [stroke({ points: [point(10, 10), point(90, 10), point(90, 90), point(40, 90)] })];
  assert.equal(fill.fillObject(open, point(50, 50), '#ff0000', () => false), open);
  const erased = [{ ...triangle, erasures: [{ id: 'gap' }] }];
  assert.equal(fill.fillObject(erased, point(50, 45), '#ff0000', () => false), erased);
  const locked = [{ ...triangle, locked: true }];
  assert.equal(fill.fillObject(locked, point(50, 45), '#ff0000', () => true), locked);
  const occluded = [triangle, { ...stroke(), type: 'image' }];
  assert.equal(fill.fillObject(occluded, point(50, 45), '#ff0000', () => false), occluded);
});

test('SVG-Formtreffer werden berücksichtigt; geschützte Bereiche blockieren die Pixel-Füllung', () => {
  const el = { ...stroke(), type: 'shape', shape: 'ellipse' }, elements = [el];
  assert.equal(fill.fillObject(elements, point(5, 5), '#ff0000', () => false), elements);
  assert.equal(fill.fillObject(elements, point(50, 50), '#ff0000', () => true)[0].fill, '#ff0000');
  const blocked = fill.protectedPixels([{ ...el, locked: true, x: 40, y: 10, width: 20, height: 80, rotation: 90 }], 100, 100, 100, 100);
  assert.equal(blocked[50 * 100 + 20], 1);
  assert.equal(blocked[20 * 100 + 50], 0);
  const region = flood.floodRegion(image(100, 100), 100, 100, { x: 20, y: 50 }, 28, blocked);
  assert.equal(region.some(Boolean), false);
  const fromOutside = flood.floodRegion(image(100, 100), 100, 100, { x: 5, y: 5 }, 28, blocked);
  assert.equal(fromOutside[50 * 100 + 20], 0);
});

test('Füllflächen bleiben nach Undo/Redo, Speichern und Heftdatei-Export radierbar erhalten', async () => {
  const mask = Uint8Array.from({ length: 10000 }, (_, i) => i % 100 >= 10 && i % 100 < 90 && i >= 1000 && i < 9000 ? 1 : 0);
  const el = fill.filledRegion(mask, 100, 100, 100, 100, '#000000', 1), original = page([]);
  useEditor.getState().load({ book: { id: crypto.randomUUID(), pageIds: [original.id] }, pages: [original] });
  useEditor.getState().edit(p => ({ ...p, elements: [el] }));
  assert.equal(useEditor.getState().past.length, 1);
  useEditor.getState().undo(); assert.equal(useEditor.getState().pages[0].elements.length, 0);
  useEditor.getState().redo(); assert.deepEqual(useEditor.getState().pages[0].elements, [el]);
  const owner = crypto.randomUUID(), created = await books.createBook(owner, 'lehrkraft', { title: 'Füllprobe', pages: [page([el])] });
  const saved = await books.getBook(owner, created.book.id);
  assert.equal(saved.pages[0].elements[0].fillOnly, true);
  const archive = await portable.exportArchive(saved), previousFetch = globalThis.fetch;
  globalThis.fetch = async (_url, request) => Response.json(await books.createBook(owner, 'lehrkraft', JSON.parse(request.body)));
  try {
    const imported = await portable.importPortable(new File([archive], 'fuellen.grundschulbuch'));
    assert.deepEqual(imported.pages[0].elements[0], saved.pages[0].elements[0]);
    const erased = drawing.eraseElements(imported.pages[0].elements, [point(50, 50)], 'rub', { mode: 'area', size: 10, opacity: 1, soft: false });
    assert.equal(value(await rendered(erased), 50, 50), 255);
    assert.equal(value(await rendered(erased), 30, 30), 0);
  } finally { globalThis.fetch = previousFetch; }
  for (const patch of [{ fillOnly: false }, { fill: undefined }, { points: [point(1, 1)] }])
    assert.throws(() => books.validatePage(page([{ ...el, ...patch }])), books.BookError);
});


test('Verzögerte Füllung übernimmt neue Speicherrevisionen, überschreibt aber keine zwischenzeitlichen Änderungen', () => {
  const snapshot = page([]), element = stroke({ fillOnly: true, fill: '#ff0000' });
  const saved = { ...snapshot, revision: 1 };
  const result = fill.applyRegionFill(snapshot, saved, element);
  assert.equal(result.revision, 1);
  assert.deepEqual(result.elements, [element]);
  const edited = { ...saved, elements: [stroke()] };
  assert.equal(fill.applyRegionFill(snapshot, edited, element), edited);
  const different = { ...snapshot, id: crypto.randomUUID() };
  assert.equal(fill.applyRegionFill(snapshot, different, element), different);
});


test('Durchgezogene Sterne verwenden beim Treffen und Rendern dieselbe Füllregel', async () => {
  const vertices = Array.from({ length: 5 }, (_, i) => point(50 + 30 * Math.cos(-Math.PI / 2 + i * Math.PI * 4 / 5), 50 + 30 * Math.sin(-Math.PI / 2 + i * Math.PI * 4 / 5)));
  const star = stroke({ geometry: 'star', points: [...vertices, vertices[0]] });
  const filled = fill.fillObject([star], point(50, 50), '#ff0000', () => false);
  assert.equal(filled[0].fill, '#ff0000');
  const raster = await rendered(filled);
  assert.equal(value(raster, 50, 50), 255);
  assert.equal(value(raster, 50, 50, 1), 0);
  assert.deepEqual(drawing.eraseElements(filled, [point(50, 50)], 'centre', { mode: 'stroke', size: 1, opacity: 1, soft: false }), []);
});
