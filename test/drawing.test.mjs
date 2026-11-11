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

async function bundled(file) {
  const result = await build({ entryPoints: [file], bundle: true, write: false,
    platform: 'node', format: 'cjs', packages: 'external', logLevel: 'silent' });
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(
    createRequire(import.meta.url), compiled, compiled.exports,
  );
  return compiled.exports;
}
const drawing = await bundled('src/lib/drawing.ts');
const brushes = await bundled('src/lib/brushes.ts');
const guides = await bundled('src/lib/drawing-guide.ts');
const model = await bundled('src/lib/notebook-model.ts');
const colors = await bundled('src/lib/color-sampling.ts');
const recognition = await bundled('src/lib/shape-recognition.ts');
const { Stroke } = await bundled('src/components/PageView.tsx');
const { useEditor } = await bundled('src/lib/editor-store.ts');
const portable = await bundled('src/lib/portable.ts');
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-drawing-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'drawing-test-only'.padEnd(48, 'x');
after(() => fs.rm(directory, { recursive: true, force: true }));
const books = await import('../src/lib/notebooks.mjs');
const point = (x, y, pressure = 0.5) => ({ x, y, pressure });
const stroke = (patch = {}) => ({ id: crypto.randomUUID(), type: 'stroke',
  x: 0, y: 0, width: 100, height: 100, rotation: 0, locked: false,
  color: '#000000', opacity: 1, penWidth: 4, penStyle: 'pen',
  points: [point(10, 50), point(90, 50)], ...patch });
const options = { mode: 'area', size: 10, opacity: 1, soft: false };
const erase = (elements, points, patch = {}) => drawing.eraseElements(elements, points, crypto.randomUUID(), { ...options, ...patch });
const page = elements => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements });
async function pixels(element) {
  const svg = renderToStaticMarkup(React.createElement(Stroke, { element }))
    .replace('width="100%" height="100%"', 'width="100" height="100"');
  const { data, info } = await sharp(Buffer.from(svg)).flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return (x, y) => data[(y * info.width + x) * info.channels];
}
async function inkStats(element) {
  const pixel = await pixels(element);
  let area = 0, weight = 0;
  const shades = new Set();
  for (let y = 0; y < 100; y++) for (let x = 0; x < 100; x++) {
    const v = pixel(x, y);
    if (v < 250) { area++; weight += 255 - v; shades.add(v); }
  }
  return { area, weight, shades };
}

test('Flächenradierer trifft auch zwischen zwei Ereignissen und erhält Originale und geschützte Objekte', () => {
  const original = stroke(), locked = stroke({ locked: true }), text = { ...stroke(), type: 'text' };
  const result = erase([original, locked, text], [point(50, 0), point(50, 100)]);
  assert.equal(result.length, 3);
  assert.equal(result[0].erasures.length, 1);
  assert.deepEqual(result[0].points, original.points);
  assert.equal(original.erasures, undefined);
  assert.equal(result[1], locked);
  assert.equal(result[2], text);
  assert.equal(erase([original], [point(0, 0)])[0], original);
});

test('Ganzstrichradierer verwendet denselben kontinuierlichen Weg', () => {
  assert.equal(erase([stroke()], [point(50, 0), point(50, 100)], { mode: 'stroke' }).length, 0);
});

test('Gedrehte Striche speichern den Radierweg in ihren eigenen Koordinaten', () => {
  const result = erase([stroke({ rotation: 90 })], [point(45, 30), point(55, 30)]);
  assert.equal(result[0].erasures.length, 1);
  const [a, b] = result[0].erasures[0].points;
  assert.ok(Math.abs(a.x - 30) < 1e-6 && Math.abs(a.y - 55) < 1e-6);
  assert.ok(Math.abs(b.x - 30) < 1e-6 && Math.abs(b.y - 45) < 1e-6);
});

test('Eine Geste erzeugt eine Maske und einen Undo-Schritt, Aufhellen akkumuliert erst bei der nächsten Geste', () => {
  const original = stroke(), p = page([original]), id = crypto.randomUUID();
  const progress = { checked: 0, hits: new Set() }, route = [point(50, 50)];
  drawing.eraseElements([original], route, id, { ...options, opacity: 0.5 }, progress);
  route.push(point(51, 50));
  const preview = drawing.eraseElements([original], route, id, { ...options, opacity: 0.5 }, progress);
  assert.equal(preview[0].erasures.length, 1);
  assert.equal(preview[0].erasures[0].points.length, 2);
  useEditor.getState().load({ book: { id: crypto.randomUUID(), pageIds: [p.id] }, pages: [p] });
  assert.equal(useEditor.getState().past.length, 0); // previews do not mutate the store
  useEditor.getState().edit(p => ({ ...p, elements: preview }));
  assert.equal(useEditor.getState().past.length, 1);
  useEditor.getState().undo();
  assert.deepEqual(useEditor.getState().pages[0].elements, [original]);
  useEditor.getState().redo();
  assert.deepEqual(useEditor.getState().pages[0].elements, preview);
  assert.equal(erase(preview, [point(50, 50)], { opacity: 0.5 })[0].erasures.length, 2);
});

test('Gerenderte Maske entfernt nur die überfahrene Stelle; Aufhellen und weiche Kanten bleiben sichtbar', async () => {
  const original = stroke();
  const hard = await pixels(erase([original], [point(50, 50)])[0]);
  assert.equal(hard(50, 50), 255);
  assert.equal(hard(20, 50), 0);
  const half = await pixels(erase([original], [point(50, 50)], { opacity: 0.5 })[0]);
  assert.ok(half(50, 50) > 110 && half(50, 50) < 145);
  const soft = await pixels(erase([original], [point(50, 50)], { soft: true })[0]);
  assert.ok(soft(55, 50) > 0 && soft(55, 50) < 250);
  const vertical = await pixels(erase([original], [point(50, 20), point(50, 80)], { soft: true })[0]);
  assert.ok(vertical(50, 50) > 230); // vertical paths must not disappear in a zero-width filter box
});

test('Radiermasken folgen Größenänderungen eines Strichs', async () => {
  const erased = erase([stroke()], [point(50, 50)])[0];
  const resized = { ...erased, width: 200, points: erased.points.map(p => ({ ...p, x: p.x * 2 })) };
  const image = await pixels(resized);
  assert.equal(image(50, 50), 255);
  assert.equal(image(20, 50), 0);
});

test('Einzelner Füllerpunkt ist sichtbar; alte kantige Zeichnungen bleiben kantig', async () => {
  const dot = await pixels(stroke({ penStyle: 'fountain', points: [point(50, 50)] }));
  assert.equal(dot(50, 50), 0);
  const old = renderToStaticMarkup(React.createElement(Stroke, { element: stroke({ penStyle: undefined, points: [point(10, 10), point(50, 90), point(90, 10)] }) }));
  assert.ok(old.includes('M10 10 L50 90 L90 10'));
  const fresh = renderToStaticMarkup(React.createElement(Stroke, { element: stroke({ points: [point(10, 10), point(50, 90), point(90, 10)] }) }));
  assert.ok(fresh.includes(' Q'));
});

test('Hardware-Samples, Null-Druck und letzter Punkt werden berücksichtigt, stationäre Taps bleiben einzelne Punkte', () => {
  const rect = { left: 0, top: 0, width: 100, height: 100 };
  const event = { pointerType: 'pen', clientX: 1, clientY: 2, pressure: 0,
    getCoalescedEvents: () => [{ pointerType: 'pen', clientX: 3, clientY: 4, pressure: 0, timeStamp: 125, tiltX: 60, tiltY: -20 }] };
  const samples = drawing.pointerSamples(event, rect, 100, 100);
  assert.deepEqual(samples, [{ ...point(3, 4, 0), time: 125, tiltX: 60, tiltY: -20 }]);
  const route = [point(3, 4)];
  drawing.appendSamples(route, samples);
  assert.equal(route.length, 1);
  drawing.appendSamples(route, [point(5, 6)]);
  assert.equal(route.length, 2);
});

test('Pinsel übernehmen ihre gewählte physische Breite und Deckkraft ohne pauschale Multiplikatoren', () => {
  const options = { color: '#123456', penWidth: 0.7, brush: 'water', tool: 'pen', penOpacity: 0.25 };
  const el = drawing.newStroke(point(10, 10), 210, 297, options);
  assert.equal(el.penStyle, 'water');
  assert.equal(el.penWidth, 0.7);
  assert.equal(books.validatePage(page([el])).elements[0].opacity, 0.25);
});

test('Speichern und erneutes Öffnen erhalten Radiermasken; manipulierte Masken werden abgelehnt', async () => {
  const owner = crypto.randomUUID(), original = stroke();
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Radieren', pages: [page([original])] });
  const changed = { ...created.pages[0], elements: erase([original], [point(50, 50)], { soft: true, opacity: 0.5 }) };
  await books.savePage(owner, created.book.id, changed);
  assert.deepEqual((await books.getBook(owner, created.book.id)).pages[0].elements, changed.elements);
  for (const patch of [{ size: -1 }, { width: 0 }, { opacity: 2 }, { soft: 'yes' }, { points: [] }, { points: [null] }, { points: [{ x: Infinity, y: 0 }] }]) {
    const el = { ...changed.elements[0], erasures: [{ ...changed.elements[0].erasures[0], ...patch }] };
    assert.throws(() => books.validatePage(page([el])), books.BookError);
  }
});

test('Bearbeitbare Heftdatei erhält die Radiermasken beim Export und Reimport', async () => {
  const owner = crypto.randomUUID();
  const created = await books.createBook(owner, 'lehrkraft', {
    title: 'Radierexport', pages: [page(erase([stroke({ brushVersion: 2, geometry: 'line' })], [point(50, 50)], { tip: 'square', soft: true, opacity: 0.5 }))],
  });
  const archive = await portable.exportArchive(created);
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (url, request) => {
    assert.equal(url, '/api/werkstatt');
    const body = JSON.parse(request.body);
    assert.equal(body.action, 'create');
    return Response.json(await books.createBook(owner, 'lehrkraft', body));
  };
  try {
    const imported = await portable.importPortable(new File([archive], 'radieren.grundschulbuch'));
    assert.notEqual(imported.book.id, created.book.id);
    assert.deepEqual(imported.pages[0].elements[0].erasures, created.pages[0].elements[0].erasures);
    assert.equal(imported.pages[0].elements[0].geometry, 'line');
    assert.equal((await pixels(imported.pages[0].elements[0]))(20, 50), 0);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test('Füllerfeder erzeugt richtungsabhängige Striche; Schreibhand kehrt die breiten Diagonalen um', async () => {
  const base = stroke({ brushVersion: 2, penStyle: 'fountain', penWidth: 8, nibHand: 'right' });
  const falling = { ...base, points: [point(20, 20), point(80, 80)] };
  const rising = { ...base, points: [point(20, 80), point(80, 20)] };
  const a = await inkStats(falling), b = await inkStats(rising);
  assert.ok(a.weight > b.weight * 2, `${a.weight} vs ${b.weight}`);
  const leftA = await inkStats({ ...falling, nibHand: 'left' });
  const leftB = await inkStats({ ...rising, nibHand: 'left' });
  assert.ok(leftB.weight > leftA.weight * 2);
});

test('Füller reagiert auf Geschwindigkeit statt auf Druck; normale Tinte reagiert auf Druck', () => {
  const base = stroke({ brushVersion: 2, penStyle: 'fountain', penWidth: 5 });
  const low = { ...base, points: [point(10, 50, 0.1), point(90, 50, 0.1)] };
  const high = { ...base, points: [point(10, 50, 0.9), point(90, 50, 0.9)] };
  assert.equal(brushes.brushOutline(low), brushes.brushOutline(high));
  assert.notEqual(brushes.brushOutline({ ...low, penStyle: 'pen' }), brushes.brushOutline({ ...high, penStyle: 'pen' }));
  const timed = duration => ({ ...base, points: [{ ...point(10, 50), time: 0 }, { ...point(90, 50), time: duration }] });
  assert.notEqual(brushes.brushOutline(timed(100)), brushes.brushOutline(timed(2000)));
});

test('Marker bleibt druckunabhängig gleichmäßig und hat keine Aquarell-/Papierfilter', () => {
  const base = stroke({ brushVersion: 2, penStyle: 'marker' });
  const low = { ...base, points: [point(10, 50, 0.1), point(90, 50, 0.1)] };
  const high = { ...base, points: [point(10, 50, 0.9), point(90, 50, 0.9)] };
  assert.equal(brushes.brushOutline(low), brushes.brushOutline(high));
  const svg = renderToStaticMarkup(React.createElement(Stroke, { element: base }));
  assert.ok(!svg.includes('<filter'));
});

test('Buntstift hat reproduzierbare Papierkörnung, wird bei schneller Bewegung leichter und bei Neigung breiter', async () => {
  const original = stroke({ brushVersion: 2, penStyle: 'crayon', penWidth: 8,
    points: [{ ...point(50, 15), time: 0 }, { ...point(50, 85), time: 1500 }] });
  const stats = await inkStats(original);
  assert.ok(stats.shades.size > 30);
  assert.deepEqual(await inkStats(original), stats);
  const fast = { ...original, points: original.points.map((p, i) => ({ ...p, time: i * 80 })) };
  assert.ok((await inkStats(fast)).weight < stats.weight);
  const tilted = { ...original, points: original.points.map(p => ({ ...p, tiltX: 75, tiltY: 0 })) };
  assert.ok((await inkStats(tilted)).area > stats.area * 1.5);
});

test('Aquarell hat mehrere durchscheinende Schichten und bleibt in Vorschau und Seite unter anderer Tinte', async () => {
  const pen = stroke({ brushVersion: 2 }), water = stroke({ brushVersion: 2, penStyle: 'water', penWidth: 18, opacity: 0.45 });
  const text = { ...stroke(), type: 'text' };
  const order = brushes.inkPaintOrder([pen, text, water]);
  assert.deepEqual(order, [water, text, pen]);
  assert.deepEqual(brushes.inkPaintOrder([pen, text], water), order);
  assert.deepEqual([pen, text, water].map(el => el.id), [pen.id, text.id, water.id]);
  const pixel = await pixels(water);
  assert.ok(pixel(50, 50) < pixel(50, 56));
  assert.ok(pixel(50, 50) > 80); // a wash remains translucent
});

test('Werkzeugwechsel merken sich Farbe, Breite und Deckkraft je Stiftart', () => {
  useEditor.setState({ brush: 'pen', color: '#112233', penWidth: 1.3, penOpacity: 0.5 });
  useEditor.getState().chooseBrush('marker');
  assert.equal(useEditor.getState().penOpacity, brushes.brushProfiles.marker.opacity);
  useEditor.setState({ color: '#ff0000', penWidth: 9, penOpacity: 0.75 });
  useEditor.getState().chooseBrush('pen');
  assert.equal(useEditor.getState().color, '#112233');
  assert.equal(useEditor.getState().penWidth, 1.3);
  assert.equal(useEditor.getState().penOpacity, 0.5);
  useEditor.getState().chooseBrush('marker');
  assert.equal(useEditor.getState().color, '#ff0000');
  assert.equal(useEditor.getState().penWidth, 9);
  assert.equal(useEditor.getState().penOpacity, 0.75);
});

test('Sensorwerte und Feder bleiben nach Speichern erhalten; neue Stiftarten bleiben radierbar', async () => {
  const el = stroke({ brushVersion: 2, penStyle: 'fountain', nibHand: 'left', simulatePressure: false,
    points: [{ ...point(10, 50), time: 100, tiltX: 60, tiltY: -20 }, { ...point(90, 50), time: 500, tiltX: 50, tiltY: -10 }] });
  const owner = crypto.randomUUID();
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Federprobe', pages: [page([el])] });
  const opened = (await books.getBook(owner, created.book.id)).pages[0].elements[0];
  assert.deepEqual(opened.points, el.points);
  assert.equal(opened.nibHand, 'left');
  assert.equal(opened.brushVersion, 2);
  assert.equal(opened.simulatePressure, false);
  const erased = erase([opened], [point(50, 50)])[0];
  assert.equal((await pixels(erased))(50, 50), 255);
  for (const patch of [{ nibHand: 'other' }, { brushVersion: 3 }, { simulatePressure: 'true' },
    { points: [{ ...point(10, 50), tiltX: 91 }] }, { points: [{ ...point(10, 50), time: NaN }] }]) {
    assert.throws(() => books.validatePage(page([{ ...el, ...patch }])), books.BookError);
  }
});

test('Eingabeglättung dämpft kleine Zitterbewegungen vor der Kurvenberechnung', () => {
  const raw = Array.from({ length: 201 }, (_, i) => ({ ...point(10 + i * 0.1, i === 0 || i === 200 ? 50 : 50 + (i % 2 ? 0.3 : -0.3)), time: i * 4 }));
  const deviation = samples => samples.slice(20, -20).reduce((sum, p) => sum + (p.y - 50) ** 2, 0) / (samples.length - 40);
  for (const style of ['pen', 'fountain', 'crayon', 'marker', 'water']) {
    const filtered = brushes.streamlinePoints(raw, style, 1.6);
    assert.ok(deviation(filtered) < deviation(raw) * 0.2, style);
    assert.deepEqual(filtered[0], raw[0]);
    assert.deepEqual(filtered[filtered.length - 1], raw[raw.length - 1]);
  }
  assert.equal(raw[1].y, 50.3); // stored input is not modified
});

test('Glättung erhält kurze Striche, Endpunkte, gerade Lineallinien und Sensordaten', () => {
  const dot = [{ ...point(10, 10, 0), time: 1, tiltX: 60, tiltY: 20 }];
  assert.deepEqual(brushes.streamlinePoints(dot), dot);
  const line = Array.from({ length: 50 }, (_, i) => ({ ...point(i * 0.2, i * 0.4, i / 50), time: i * 10, tiltX: 60, tiltY: 20 }));
  const filtered = brushes.streamlinePoints(line, 'fountain', 2.4);
  for (let i = 0; i < filtered.length; i++) {
    assert.ok(Math.abs(filtered[i].y - filtered[i].x * 2) < 1e-9);
    assert.equal(filtered[i].pressure, line[i].pressure);
    assert.equal(filtered[i].time, line[i].time);
    assert.equal(filtered[i].tiltX, 60);
  }
  const curve = brushes.brushSamples(line, 'fountain', 2.4);
  assert.equal(curve[0].x, line[0].x);
  assert.equal(curve[curve.length - 1].x, line[line.length - 1].x);
  assert.equal(curve[curve.length - 1].y, line[line.length - 1].y);
  assert.ok(curve.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)));
});

test('Linealführung folgt der tatsächlichen Position und versetzt die Tinte um die halbe Strichbreite', () => {
  const guide = { kind: 'ruler', x: 105, y: 76, angle: 0 };
  const edge = guides.captureGuideEdge(point(100, 65), guide, 2);
  assert.ok(edge);
  assert.deepEqual(guides.projectToGuideEdge(point(100, 80), edge), point(100, 64));
  const lower = guides.captureGuideEdge(point(100, 87), guide, 2);
  assert.equal(guides.projectToGuideEdge(point(100, 80), lower).y, 88);
  // Wide markers can still start on the physical edge, rather than needing to
  // begin half a marker width away from the visible ruler.
  assert.ok(guides.captureGuideEdge(point(100, 65), guide, 16.9));
  assert.equal(guides.captureGuideEdge(point(100, 40), guide, 2), undefined);
  assert.equal(guides.captureGuideEdge(point(100, 65), null), undefined);
});

test('Gedrehte und verschobene Zeichenhilfen führen an allen Kanten', () => {
  for (const kind of ['ruler', 'triangle']) for (const angle of [0, 30, 45, 90, 135, 270, 359]) {
    const guide = { kind, x: 130, y: 110, angle };
    const physical = guides.guideEdges(guide), offset = guides.guideEdges(guide, 1.2);
    assert.equal(physical.length, kind === 'triangle' ? 3 : 4);
    physical.forEach((edge, i) => {
      const midpoint = point((edge.a.x + edge.b.x) / 2, (edge.a.y + edge.b.y) / 2);
      const captured = guides.captureGuideEdge(midpoint, guide, 1.2);
      assert.deepEqual(captured, offset[i]);
      const projected = guides.projectToGuideEdge(midpoint, captured);
      assert.ok(Math.abs(Math.hypot(midpoint.x - projected.x, midpoint.y - projected.y) - 0.6) < 1e-8);
    });
  }
});

test('Eingerastete Kante bleibt während eines Strichs fest und endet an den Werkzeugenden', () => {
  const guide = { kind: 'ruler', x: 105, y: 76, angle: 0 };
  const edge = guides.captureGuideEdge(point(100, 65), guide, 2);
  guide.x += 30;
  guide.angle = 45;
  assert.deepEqual(guides.projectToGuideEdge(point(-100, 20), edge), point(15, 64));
  assert.deepEqual(guides.projectToGuideEdge(point(1000, 20), edge), point(195, 64));
  const metadata = { ...point(100, 70, 0.8), time: 100, tiltX: 60, tiltY: 20 };
  assert.deepEqual(guides.projectToGuideEdge(metadata, edge), { ...metadata, y: 64 });
});

test('Dreieck hat zwei 45°-Kanten und einen rechten Winkel; Winkel werden normalisiert', () => {
  const edges = guides.guideEdges({ kind: 'triangle', x: 105, y: 95, angle: 0 });
  const slope = edge => (edge.b.y - edge.a.y) / (edge.b.x - edge.a.x);
  assert.ok(Math.abs(slope(edges[1])) === 1 && Math.abs(slope(edges[2])) === 1);
  assert.equal(slope(edges[1]) * slope(edges[2]), -1);
  assert.equal(guides.normaliseGuideAngle(-45), 315);
  assert.equal(guides.normaliseGuideAngle(405), 45);
});

test('Linealstriche bleiben nach Glättung, Speichern und erneutem Öffnen auf ihrer Kante', async () => {
  const guide = { kind: 'triangle', x: 105, y: 95, angle: 30 };
  const physical = guides.guideEdges(guide)[1];
  const initial = point((physical.a.x + physical.b.x) / 2, (physical.a.y + physical.b.y) / 2);
  const edge = guides.captureGuideEdge(initial, guide, 0.8);
  const samples = Array.from({ length: 30 }, (_, i) => guides.projectToGuideEdge({ ...point(initial.x + i, initial.y - i * 0.3), time: i * 10 }, edge));
  const el = model.compactStroke({ ...drawing.newStroke(samples[0], 210, 297, { color: '#123456', penWidth: 0.8, brush: 'pen', tool: 'pen', penOpacity: 1 }), points: samples });
  const owner = crypto.randomUUID();
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Geodreieck', pages: [page([el])] });
  const opened = (await books.getBook(owner, created.book.id)).pages[0].elements[0];
  for (const sample of brushes.brushCentreline(opened)) {
    const world = { x: sample.x + opened.x, y: sample.y + opened.y };
    const projected = guides.projectToGuideEdge(world, edge);
    assert.ok(Math.hypot(projected.x - world.x, projected.y - world.y) < 1e-8);
  }
});

test('Zwei Finger verschieben und drehen dieselbe Zeichenhilfe; Grenzen und Winkelschritte bleiben konsistent', () => {
  const guide = { kind: 'triangle', x: 105, y: 95, angle: 0 };
  const gesture = { guide, point: { x: 105, y: 95 }, angle: 0, mode: 'two' };
  const result = guides.manipulateGuide(gesture, [{ x: 115, y: 80 }, { x: 115, y: 110 }], { width: 210, height: 297 });
  assert.deepEqual(result, { ...guide, x: 115, angle: 90 });
  assert.deepEqual(guide, { kind: 'triangle', x: 105, y: 95, angle: 0 });
  const move = guides.manipulateGuide({ ...gesture, mode: 'move' }, [{ x: -500, y: 900 }], { width: 210, height: 297 });
  assert.equal(move.x, 15);
  assert.equal(move.y, 282);
  const radians = 14 * Math.PI / 180;
  const rotated = guides.manipulateGuide({ ...gesture, mode: 'rotate' }, [{ x: 105 + Math.cos(radians) * 30, y: 95 + Math.sin(radians) * 30 }], { width: 210, height: 297 }, true);
  assert.equal(rotated.angle, 15);
  assert.equal(rotated.x, 105);
  assert.equal(rotated.y, 95);
  const offCentre = guides.manipulateGuide({ ...gesture, point: { x: 115, y: 95 } }, [{ x: 115, y: 80 }, { x: 115, y: 110 }], { width: 210, height: 297 });
  assert.ok(Math.abs(offCentre.x - 115) < 1e-9);
  assert.ok(Math.abs(offCentre.y - 85) < 1e-9);
});

test('Pipette berücksichtigt Seitenzoom, Canvas-Auflösung, Randpunkte und Transparenz', () => {
  const rect = { left: 100, top: 50, width: 400, height: 600 };
  assert.deepEqual(colors.canvasPoint({ x: 300, y: 350 }, rect, 800, 1200), { x: 400, y: 600 });
  assert.deepEqual(colors.canvasPoint({ x: 500, y: 650 }, rect, 800, 1200), { x: 799, y: 1199 });
  assert.deepEqual(colors.canvasPoint({ x: 0, y: 0 }, rect, 800, 1200), { x: 0, y: 0 });
  assert.equal(colors.rgbaHex([18, 52, 86, 255]), '#123456');
  assert.equal(colors.rgbaHex([0, 0, 0, 0]), '#ffffff');
  assert.equal(colors.rgbaHex([255, 0, 0, 128]), '#ff7f7f');
});

test('Eckige und schräge Radierformen entfernen ihre tatsächliche Fläche und hellen eine Geste nur einmal auf', async () => {
  const filled = stroke({ penStyle: undefined, fill: '#000000', points: [point(10, 10), point(90, 10), point(90, 90), point(10, 90), point(10, 10)] });
  const circle = await pixels(erase([filled], [point(50, 50)], { tip: 'round' })[0]);
  const square = await pixels(erase([filled], [point(50, 50)], { tip: 'square' })[0]);
  assert.equal(circle(54, 54), 0);
  assert.equal(square(54, 54), 255);
  const slant = await pixels(erase([filled], [point(50, 50)], { tip: 'slant' })[0]);
  assert.ok(slant(53, 47) > 230);
  assert.equal(slant(54, 50), 0);
  const partial = await pixels(erase([filled], [point(40, 50), point(60, 50), point(40, 50)], { tip: 'square', opacity: 0.5 })[0]);
  assert.ok(partial(50, 50) > 110 && partial(50, 50) < 145);
  const erased = erase([filled], [point(50, 50)], { tip: 'square', soft: true })[0];
  const validated = books.validatePage(page([erased])).elements[0];
  assert.equal(validated.erasures[0].tip, 'square');
  assert.throws(() => books.validatePage(page([{ ...erased, erasures: [{ ...erased.erasures[0], tip: 'invalid' }] }])), books.BookError);
});

function handTrace(vertices, noise = 0.15) {
  const points = [];
  for (let i = 1; i < vertices.length; i++) for (let j = 0; j < 24; j++) {
    const t = j / 24, n = points.length, a = vertices[i - 1], b = vertices[i];
    points.push({ ...point(a.x + (b.x - a.x) * t + Math.sin(n * 1.7) * noise,
      a.y + (b.y - a.y) * t + Math.cos(n * 1.3) * noise), time: n * 12, tiltX: 30, tiltY: 0 });
  }
  return [...points, { ...vertices[vertices.length - 1], pressure: 0.5, time: points.length * 12, tiltX: 30, tiltY: 0 }];
}

test('Formerkennung bereinigt Linien, Dreiecke und auch gedrehte Rechtecke', () => {
  assert.equal(recognition.recognizeStroke(handTrace([point(10, 40), point(90, 41)])).kind, 'line');
  const triangle = recognition.recognizeStroke(handTrace([point(50, 10), point(85, 80), point(15, 80), point(50, 10)]));
  assert.equal(triangle.kind, 'triangle');
  const rectangle = [point(20, 20), point(80, 20), point(80, 70), point(20, 70), point(20, 20)];
  for (const angle of [0, 0.45, 1.1]) {
    const rotated = rectangle.map(p => point(50 + (p.x - 50) * Math.cos(angle) - (p.y - 50) * Math.sin(angle), 50 + (p.x - 50) * Math.sin(angle) + (p.y - 50) * Math.cos(angle)));
    const shape = recognition.recognizeStroke(handTrace(rotated));
    assert.equal(shape.kind, 'rectangle');
    assert.ok(shape.points.length > 20);
  }
});

test('Formerkennung erkennt Kreise und gedrehte Ellipsen, lässt offene Bögen und Gekritzel unverändert', () => {
  for (const radius of [[20, 20], [30, 12]]) {
    const points = Array.from({ length: 100 }, (_, i) => {
      const t = i / 99 * Math.PI * 2, x = radius[0] * Math.cos(t), y = radius[1] * Math.sin(t), angle = 0.6;
      return { ...point(50 + x * Math.cos(angle) - y * Math.sin(angle) + Math.sin(i) * 0.1, 50 + x * Math.sin(angle) + y * Math.cos(angle)), time: i * 10 };
    });
    assert.equal(recognition.recognizeStroke(points).kind, 'ellipse');
    assert.equal(recognition.recognizeStroke(points.slice(0, 65)), null);
  }
  assert.equal(recognition.recognizeStroke([point(1, 1), point(2, 2), point(3, 3)]), null);
  const scribble = Array.from({ length: 200 }, (_, i) => point(50 + Math.sin(i * 1.7) * 20, 50 + Math.cos(i * 2.1) * 20));
  assert.equal(recognition.recognizeStroke(scribble), null);
});

test('Erkannte Formen behalten ihre scharfen Ecken sowie Sensordaten und bleiben speicherbar und radierbar', async () => {
  const shape = recognition.recognizeStroke(handTrace([point(20, 20), point(80, 20), point(80, 70), point(20, 70), point(20, 20)]));
  const el = stroke({ brushVersion: 2, geometry: shape.kind, points: shape.points });
  const validated = books.validatePage(page([el])).elements[0];
  assert.equal(validated.geometry, 'rectangle');
  assert.equal(validated.points[0].tiltX, 30);
  assert.deepEqual(brushes.brushCentreline(el).map(p => ({ x: p.x, y: p.y })), shape.points.map(p => ({ x: p.x, y: p.y })));
  const owner = crypto.randomUUID();
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Formprobe', pages: [page([el])] });
  const opened = (await books.getBook(owner, created.book.id)).pages[0].elements[0];
  assert.equal(opened.geometry, 'rectangle');
  const erased = erase([opened], [point(50, 20)], { tip: 'square' })[0];
  assert.equal((await pixels(erased))(50, 20), 255);
  assert.throws(() => books.validatePage(page([{ ...el, geometry: 'invalid' }])), books.BookError);
});

const transformShape = (vertices, angle = 0.6) => vertices.map(p => point(60 + p.x * Math.cos(angle) - p.y * Math.sin(angle), 60 + p.x * Math.sin(angle) + p.y * Math.cos(angle)));
const starVertices = crossed => Array.from({ length: crossed ? 5 : 10 }, (_, i) => {
  const t = -Math.PI / 2 + i * Math.PI * (crossed ? 4 : 1) / 5, r = crossed || i % 2 === 0 ? 25 : 11;
  return point(Math.cos(t) * r, Math.sin(t) * r);
});
const heartVertices = aspect => Array.from({ length: 90 }, (_, i) => {
  const t = i / 90 * Math.PI * 2;
  return point(25 * aspect * Math.sin(t) ** 3, -25 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16);
});

test('Sternumriss, durchgezogener Stern und Herz werden unabhängig von Startpunkt und Richtung erkannt', () => {
  for (const [kind, vertices] of [['star', starVertices(false)], ['star', starVertices(true)], ['heart', heartVertices(0.8)], ['heart', heartVertices(1.3)]]) {
    for (const reverse of [false, true]) {
      const shifted = [...vertices.slice(3), ...vertices.slice(0, 3)];
      if (reverse) shifted.reverse();
      const route = transformShape([...shifted, shifted[0]]);
      const shape = recognition.recognizeStroke(handTrace(route));
      assert.equal(shape?.kind, kind, `${kind}, reverse=${reverse}`);
      assert.ok(shape.points.length > 50);
      assert.equal(shape.points[0].tiltX, 30);
    }
  }
});

test('Pfeile erkennen Schaft und symmetrische Spitze in beiden Zeichenrichtungen', () => {
  const route = [point(-30, 0), point(30, 0), point(15, -12), point(30, 0), point(15, 12)];
  for (const angle of [0, 0.7, 2.5]) for (const reverse of [false, true]) {
    const input = transformShape(reverse ? [...route].reverse() : route, angle);
    const shape = recognition.recognizeStroke(handTrace(input));
    assert.equal(shape?.kind, 'arrow', `angle=${angle}, reverse=${reverse}`);
  }
  assert.equal(recognition.recognizeStroke(handTrace([point(20, 20), point(50, 50), point(20, 80)])), null);
});

test('Eine separate Pfeilspitze ergänzt nur die unmittelbar vorherige passende Linie, auch nach Drehung', () => {
  const shaft = stroke({ x: 20, y: 30, width: 60, height: 0, points: [point(0, 0), point(60, 0)], rotation: 90, brushVersion: 2 });
  const current = stroke({ brushVersion: 2 });
  assert.equal(recognition.previousArrowShaft([shaft], current), shaft);
  const head = handTrace([point(38, 45), point(50, 60), point(62, 45)]);
  const shape = recognition.recognizeArrowHead(head, shaft);
  assert.equal(shape?.kind, 'arrow');
  assert.equal(shape.replaceId, shaft.id);
  assert.equal(recognition.recognizeArrowHead(head.map(p => ({ ...p, x: p.x + 40 })), shaft), null);
  for (const change of [{ locked: true }, { color: '#ff0000' }, { geometry: 'ellipse' }, { erasures: [{}] }, { type: 'text' }, { groupId: 'group' }])
    assert.equal(recognition.previousArrowShaft([{ ...shaft, ...change }], current), null);
  assert.equal(recognition.previousArrowShaft([shaft, stroke({ color: '#ff0000' })], current), null);
});

test('Neue erkannte Formen behalten ihre Geometrie beim Speichern und Exportieren', async () => {
  const star = starVertices(false), heart = heartVertices(1);
  const routes = [[...star, star[0]], [...heart, heart[0]], [point(-30, 0), point(30, 0), point(15, -12), point(30, 0), point(15, 12)]];
  const elements = routes.map(route => {
    const shape = recognition.recognizeStroke(handTrace(transformShape(route)));
    return model.compactStroke(stroke({ brushVersion: 2, geometry: shape.kind, points: shape.points }));
  });
  assert.deepEqual(books.validatePage(page(elements)).elements.map(el => el.geometry), ['star', 'heart', 'arrow']);
  const owner = crypto.randomUUID();
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Neue Formen', pages: [page(elements)] });
  const saved = await books.getBook(owner, created.book.id);
  assert.deepEqual(saved.pages[0].elements.map(el => el.geometry), ['star', 'heart', 'arrow']);
  for (const el of saved.pages[0].elements) assert.deepEqual(brushes.brushCentreline(el).map(p => ({ x: p.x, y: p.y })), el.points.map(p => ({ x: p.x, y: p.y })));
  const archive = await portable.exportArchive(saved), previousFetch = globalThis.fetch;
  globalThis.fetch = async (_url, request) => Response.json(await books.createBook(owner, 'lehrkraft', JSON.parse(request.body)));
  try {
    const imported = await portable.importPortable(new File([archive], 'formen.grundschulbuch'));
    assert.deepEqual(imported.pages[0].elements.map(el => el.geometry), ['star', 'heart', 'arrow']);
    assert.deepEqual(imported.pages[0].elements.map(el => el.points), saved.pages[0].elements.map(el => el.points));
  } finally { globalThis.fetch = previousFetch; }

});


test('Zusammengefügter Pfeil ersetzt eine Linie in einem Undo-Schritt', () => {
  const shaft = stroke({ x: 20, y: 50, width: 60, height: 0, points: [point(0, 0), point(60, 0)], brushVersion: 2 });
  const shape = recognition.recognizeArrowHead(handTrace([point(65, 38), point(80, 50), point(65, 62)]), shaft);
  const original = page([shaft]);
  useEditor.getState().load({ book: { id: crypto.randomUUID(), pageIds: [original.id] }, pages: [original] });
  const arrow = model.compactStroke(stroke({ brushVersion: 2, points: shape.points, geometry: shape.kind }));
  useEditor.getState().edit(p => ({ ...p, elements: [...p.elements.filter(el => el.id !== shape.replaceId), arrow] }));
  assert.deepEqual(useEditor.getState().pages[0].elements, [arrow]);
  assert.equal(useEditor.getState().past.length, 1);
  useEditor.getState().undo();
  assert.deepEqual(useEditor.getState().pages[0].elements, [shaft]);
  useEditor.getState().redo();
  assert.deepEqual(useEditor.getState().pages[0].elements, [arrow]);
});
