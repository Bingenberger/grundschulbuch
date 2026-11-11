import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
async function bundle(file) {
  const code = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external' });
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', code.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports);
  return compiled.exports;
}
const g = await bundle('src/lib/learning/geometry.ts');
const { defaultSettings } = await bundle('src/lib/learning/catalog.ts');
const { default: Widget } = await bundle('src/components/learning/Widget.tsx');
const portable = await bundle('src/lib/portable.ts');
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-geometry-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'geometry-test-only'.padEnd(48, 'x');
after(() => fs.rm(directory, { recursive: true, force: true }));
const books = await import('../src/lib/notebooks.mjs');
const classes = await import('../src/lib/classes.mjs');
const validation = await import('../src/lib/learning/validation.mjs');
const config = patch => ({ ...defaultSettings('geometry'), ...patch });
const element = (c, state) => ({ id: crypto.randomUUID(), type: 'widget', widgetKind: 'geometry', x: 15, y: 35, width: 180, height: 180, rotation: 0, locked: false, color: '#253c42', settings: c, ...(state ? { response: state } : {}) });
const page = elements => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements });

const { parseGeometryPath } = await bundle('src/components/learning/GeometryOptions.tsx');
const guide = await bundle('src/lib/drawing-guide.ts');
const initial = c => g.readGeometry({}, c);
const add = (state, c, segment) => g.geometryStep(state, c, { type: 'add', segment });
const solve = (state, c) => g.geometryStep(g.geometryEdges(g.geometryTasks(c)[state.index]).reduce((value, segment) => add(value, c, segment), state), c, { type: 'check' });

test('Alle Schwierigkeitsstufen erzeugen reproduzierbare, begrenzte Aufgaben auf dem Raster', () => {
  for (const difficulty of [1, 2, 3]) {
    const c = config({ difficulty, geometryCount: 12 }), tasks = g.geometryTasks(c);
    assert.equal(tasks.length, 12); assert.deepEqual(tasks, g.geometryTasks(c)); assert.ok(new Set(tasks.map(t => t.name)).size >= 4);
    for (const task of tasks) for (const point of task.path) { assert.ok(g.validGeometryPoint(point)); assert.equal(point.x % 10, 0); assert.equal(point.y % 10, 0); }
    assert.equal(books.validatePage(page([element(c)])).elements[0].widgetKind, 'geometry');
  }
});
test('Eigene Formen und alte Koordinaten bleiben erhalten; alte Prüfungen werden erneut bewertet', () => {
  const c = { path: [{ x: 20, y: 20 }, { x: 80, y: 20 }] };
  assert.equal(g.geometryCustom(c), true); assert.equal(g.geometryTrace(c), true);
  assert.deepEqual(g.geometryTasks(c)[0].path, [{ x: 40, y: 40 }, { x: 160, y: 40 }]);
  const state = g.readGeometry({ path: c.path, checked: true, completed: true }, c);
  assert.deepEqual(state.segments, [{ a: { x: 40, y: 40 }, b: { x: 160, y: 40 } }]); assert.equal(state.checked, false); assert.equal(state.completed, false);
  assert.equal(g.geometryStep(state, c, { type: 'check' }).correct, true);
});
test('Die Prüfung erlaubt umgekehrte Richtung und beliebige Reihenfolge', () => {
  const c = config({}), task = g.geometryTasks(c)[0], segments = g.geometryEdges(task).reverse().map(s => ({ a: s.b, b: s.a }));
  assert.equal(g.assessGeometry(task, segments).correct, true);
});
test('Doppelte Zielkanten benötigen eigene passende Strecken; eine fremde Strecke zählt nicht mehrfach', () => {
  const a = { x: 10, y: 10 }, b = { x: 30, y: 10 }, task = { name: 'Hin und zurück', path: [a, b, a] };
  const wrong = [{ a, b }, { a: { x: 10, y: 40 }, b: { x: 30, y: 40 } }], result = g.assessGeometry(task, wrong);
  assert.equal(result.correct, false); assert.equal(result.missing, 1); assert.equal(result.extra, 1);
  assert.equal(g.assessGeometry(task, [{ a, b }, { a: b, b: a }]).correct, true);
});
test('Die eindeutige Zuordnung findet auch bei überlappenden Toleranzbereichen die passende Verteilung', () => {
  const task = { name: 'nahe Kanten', path: [{ x: 10, y: 10 }, { x: 30, y: 10 }, { x: 14, y: 10 }] };
  const segments = [12, 8].map(x => ({ a: { x, y: 10 }, b: { x: 30, y: 10 } }));
  assert.equal(g.assessGeometry(task, segments).correct, true);
});
test('Zusätzliche oder zu kurze Strecken bleiben falsch, fehlende Kanten werden gezählt', () => {
  const c = config({}), task = g.geometryTasks(c)[0], edges = g.geometryEdges(task);
  assert.equal(g.assessGeometry(task, edges.slice(1)).missing, 1);
  assert.equal(g.assessGeometry(task, [...edges, edges[0]]).correct, false);
  assert.equal(g.assessGeometry(task, [{ a: edges[0].a, b: { x: edges[0].b.x + 8, y: edges[0].b.y + 8 } }]).matched.length, 0);
});
test('Nullstrecken, ungültige Punkte und überlange Zeichnungen werden nicht übernommen', () => {
  const c = config({}), state = initial(c), p = { x: 20, y: 20 };
  assert.equal(add(state, c, { a: p, b: p }), state); assert.equal(add(state, c, { a: p, b: { x: -1, y: 2 } }), state);
  const s = { a: p, b: { x: 40, y: 20 } }; let filled = state; for (let i = 0; i < 30; i++) filled = add(filled, c, s);
  assert.equal(add(filled, c, s), filled);
});
test('Korrekturen verwerfen die Prüfung; Rückgängig und Neu zeichnen erhalten frühere Ergebnisse', () => {
  const c = config({ geometryCount: 2 }); let state = solve(initial(c), c);
  state = g.geometryStep(state, c, { type: 'next' }); state = solve(state, c);
  const undo = g.geometryStep(state, c, { type: 'undo' }); assert.equal(undo.checked, false); assert.equal(undo.correct, false); assert.equal(undo.results[0].correct, true);
  const reset = g.geometryStep(undo, c, { type: 'reset' }); assert.deepEqual(reset.segments, []); assert.equal(g.geometryScore(reset, c), 50);
});
test('Der Streckenradierer entfernt gezielt eine Linie und verwirft die alte Prüfung', () => {
  const c = config({}), state = solve(initial(c), c), segment = state.segments[1], point = { x: (segment.a.x + segment.b.x) / 2, y: (segment.a.y + segment.b.y) / 2 };
  const index = g.geometrySegmentAt(state.segments, point); assert.equal(index, 1);
  const erased = g.geometryStep(state, c, { type: 'remove', index }); assert.equal(erased.segments.length, state.segments.length - 1); assert.equal(erased.correct, false); assert.equal(erased.checked, false);
  assert.equal(g.geometrySegmentAt(state.segments, { x: 0, y: 0 }), -1); assert.equal(g.geometryStep(erased, c, { type: 'remove', index: -1 }), erased);
});
test('Erste Vorschau, weitere Hilfe und Lösung nach zwei Versuchen sind getrennt', () => {
  const c = config({}), base = initial(c), preview = g.geometryStep(base, c, { type: 'preview' });
  assert.equal(preview.viewed, true); assert.equal(preview.helped, false);
  const helped = g.geometryStep(preview, c, { type: 'help' }); assert.equal(helped.helped, true);
  assert.equal(g.geometryStep(base, c, { type: 'solution' }), base);
  let wrong = add(base, c, { a: { x: 0, y: 0 }, b: { x: 10, y: 0 } });
  wrong = g.geometryStep(g.geometryStep(wrong, c, { type: 'check' }), c, { type: 'check' });
  const shown = g.geometryStep(wrong, c, { type: 'solution' }); assert.equal(shown.solution, true); assert.equal(shown.helped, true); assert.equal(shown.correct, false); assert.deepEqual(shown.segments, wrong.segments);
});
test('Nur gelöste Formen können weitergeschaltet werden; Überspringen und Abschluss werden einmal gezählt', () => {
  const c = config({ geometryCount: 2 }), base = initial(c); assert.equal(g.geometryStep(base, c, { type: 'next' }), base);
  let state = g.geometryStep(solve(base, c), c, { type: 'next' }); assert.equal(g.geometryScore(state, c), 50);
  state = g.geometryStep(state, c, { type: 'skip' }); assert.equal(state.completed, true); assert.deepEqual(state.results.map(r => r.correct), [true, false]);
  assert.equal(g.geometryStep(state, c, { type: 'skip' }), state); assert.deepEqual(g.geometryStep(state, c, { type: 'restart' }), base);
});
test('Speichern erhält den Stand; Darstellungsänderungen behalten ihn, andere Aufgaben setzen ihn zurück', () => {
  const c = config({}), state = solve(initial(c), c), response = { geometry: state };
  assert.deepEqual(g.readGeometry(response, { ...c, title: 'Neuer Titel', geometryPreview: 8 }), state);
  const other = { ...c, difficulty: 3 }; assert.deepEqual(g.readGeometry(response, other), initial(other));
  const corrupted = g.readGeometry({ geometry: { ...state, segments: [], correct: true } }, c); assert.equal(corrupted.correct, false);
});
test('Lineal und Geodreieck führen entlang tatsächlicher gedrehter Kanten', () => {
  for (const kind of ['ruler', 'triangle']) {
    const ruler = { kind, x: 100, y: 100, angle: 35 }, edge = guide.guideEdges(ruler)[0], p = { x: (edge.a.x + edge.b.x) / 2, y: (edge.a.y + edge.b.y) / 2, pressure: 0.5 };
    const captured = guide.captureGuideEdge(p, ruler, 0, 5); assert.ok(captured);
    const projected = guide.projectToGuideEdge({ x: p.x + 5, y: p.y + 4 }, captured);
    assert.ok(Math.abs((projected.x - captured.a.x) * (captured.b.y - captured.a.y) - (projected.y - captured.a.y) * (captured.b.x - captured.a.x)) < 1e-8);
  }
});
test('Eigene Eckpunkte werden nachvollziehbar geprüft statt fehlerhafte Eingaben auf null zu setzen', () => {
  assert.deepEqual(parseGeometryPath('20,20\n80,20\n20,20'), [{ x: 20, y: 20 }, { x: 80, y: 20 }, { x: 20, y: 20 }]);
  for (const text of ['', '20,20', '20,20\n20,20', 'abc\n30,40', '20,20\n101,40', '20,20\n-1,40']) assert.equal(parseGeometryPath(text), null);
});
test('Schreibgeschützte Vorschau zeigt die Vorlage; Kinderantworten mit ungültigen Koordinaten werden abgelehnt', () => {
  const c = config({}), html = renderToStaticMarkup(React.createElement(Widget, { element: element(c) }));
  assert.match(html, /geometry-target/); assert.match(html, /disabled=""/); assert.match(html, /Lineal/); assert.match(html, /Geodreieck/);
  const state = initial(c); assert.deepEqual(validation.learningResponse({ geometry: state }).geometry, state);
  for (const patch of [{ index: 12 }, { attempts: -1 }, { segments: [{ a: { x: 201, y: 0 }, b: { x: 10, y: 0 } }] }, { results: [{ correct: 'ja', helped: false }] }, { viewed: 'ja' }]) assert.throws(() => validation.learningResponse({ geometry: { ...state, ...patch } }));
  assert.throws(() => validation.widgetSettings(config({ geometryHelp: 'always-hidden' })));
});
test('Geometrieantworten sind im gesperrten Kinderheft bearbeitbar und über Heftdateien wiederherstellbar', async () => {
  const owner = crypto.randomUUID(), c = config({ geometryCount: 2 }), state = solve(initial(c), c);
  const created = await books.createBook(owner, 'lehrkraft', { title: 'Geometrieprobe', pages: [page([element(c, { geometry: state })])] });
  let klass = await classes.createClass(owner, 'Geometrieklasse'); klass = await classes.changeClass(owner, klass.id, { addChild: 'Ada' });
  const [copy] = await classes.distribute(owner, klass.id, created.book.id), child = klass.children[0].id, own = await books.getBook(child, copy.id);
  assert.equal(own.pages[0].elements[0].locked, true); assert.equal(own.pages[0].elements[0].response, undefined);
  await books.savePage(child, copy.id, { ...own.pages[0], elements: own.pages[0].elements.map(el => ({ ...el, response: { geometry: state } })) }, true);
  const reopened = await books.getBook(child, copy.id); assert.deepEqual(reopened.pages[0].elements[0].response.geometry, state);
  const previous = globalThis.fetch; globalThis.fetch = async (url, request) => { assert.equal(url, '/api/werkstatt'); return Response.json(await books.createBook(owner, 'lehrkraft', JSON.parse(request.body))); };
  try { const archive = await portable.exportArchive(created), imported = await portable.importPortable(new File([archive], 'geometrie.grundschulbuch')); assert.deepEqual(imported.pages[0].elements[0].settings, c); assert.deepEqual(imported.pages[0].elements[0].response.geometry, state); }
  finally { globalThis.fetch = previous; }
});
