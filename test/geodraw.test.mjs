import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/learning/geodraw.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { MM, GRID, geoConfig, makeTasks, startPoint, targetSegments, checkDrawing, drawnSegments, taskText, spoken, afterCheck, freshGeo, nextTask } = mod.exports;

/** A hand-drawn line: many points with a little wobble. */
const stroke = (p, q, wobble = 0.2 * MM) =>
  Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    return [p[0] + (q[0] - p[0]) * t + (i % 2 ? wobble : -wobble) * 0.3, p[1] + (q[1] - p[1]) * t];
  });

test('Aufgaben und Einstellungen wie in der Vorlage', () => {
  const c = geoConfig({ level: 'rising', count: 6, groups: ['quads'] }, () => 0.3);
  assert.equal(c.tasks.length, 6);
  assert.equal(c.tol, 'normal');
  assert.equal(c.flash, 2);
  for (const t of makeTasks({ level: 'easy', count: 10, groups: ['lines'] }, Math.random)) assert.equal(t.a % 10, 0, 'easy lengths are whole cm');
  assert.equal(taskText({ k: 'line', a: 45, d: 90 }), 'Zeichne eine Strecke: 4,5 cm lang (45 mm), vom roten Punkt nach oben.');
  assert.equal(spoken('4,5 cm und 60°'), '4 Komma 5 Zentimeter und 60 Grad');
});

test('Der rote Punkt liegt auf dem 5-mm-Karo', () => {
  for (const t of [{ k: 'rect', a: 60, b: 30 }, { k: 'equi', a: 50 }, { k: 'line', a: 45, d: 180 }]) {
    const [x, y] = startPoint(t);
    assert.ok(Math.abs(x / GRID - Math.round(x / GRID)) < 1e-9);
    assert.ok(Math.abs(y / GRID - Math.round(y / GRID)) < 1e-9);
  }
});

test('Richtig gezeichnete Formen werden erkannt – auch aus mehreren Strichen', () => {
  const rect = { k: 'rect', a: 60, b: 30 };
  const strokes = targetSegments(rect).map(([p, q]) => stroke(p, q));
  assert.deepEqual(checkDrawing(rect, strokes, 'normal').msgs, []);
  assert.equal(checkDrawing(rect, strokes, 'normal').ok, true);
  // One side in two pieces still counts as one side.
  const [p, q] = targetSegments(rect)[0];
  const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const split = [stroke(p, mid), stroke(mid, q), ...strokes.slice(1)];
  assert.equal(drawnSegments(split).length, 4);
  assert.equal(checkDrawing(rect, split, 'normal').ok, true);
});

test('Fehler werden genau benannt', () => {
  const line = { k: 'line', a: 50, d: 0 };
  const [[p, q]] = targetSegments(line);
  const short = checkDrawing(line, [stroke(p, [q[0] - 4 * MM, q[1]])], 'normal');
  assert.equal(short.ok, false);
  assert.deepEqual(short.msgs, ['Die Strecke ist 4 mm zu kurz.']);
  assert.equal(checkDrawing(line, [stroke(p, [q[0] - 1.5 * MM, q[1]])], 'normal').ok, true, '1,5 mm is within “Normal”');
  assert.equal(checkDrawing(line, [stroke(p, [q[0] - 1.5 * MM, q[1]])], 'strict').ok, false, 'but not within “Genau”');
  assert.deepEqual(checkDrawing(line, [], 'normal').msgs, ['Es ist noch nichts gezeichnet. Zeichne mit dem Stift am Lineal entlang.']);
  const square = { k: 'square', a: 40 };
  const sides = targetSegments(square).map(([a, b]) => stroke(a, b));
  const missing = checkDrawing(square, sides.slice(0, 3), 'normal');
  assert.equal(missing.ok, false);
  assert.match(missing.msgs.join(' '), /fehlt/);
  const extra = checkDrawing(square, [...sides, stroke([200, 300], [200, 600])], 'normal');
  assert.match(extra.msgs.join(' '), /Eine Linie ist zu viel/);
});

test('Ablauf: prüfen, weiter, Auswertung', () => {
  const t = { k: 'line', a: 30, d: 0 };
  let s = freshGeo([t, t]);
  const [[p, q]] = targetSegments(t);
  s = afterCheck(s, checkDrawing(t, [stroke(p, q)], 'normal'), 1000);
  assert.equal(s.phase, 'right');
  assert.equal(s.stats[0].checks, 1);
  s = nextTask(s, 2000);
  assert.equal(s.i, 1);
  s = nextTask(s, 3000);
  assert.equal(s.phase, 'summary');
});
