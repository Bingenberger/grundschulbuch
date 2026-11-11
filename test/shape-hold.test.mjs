import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const compiled = await build({ entryPoints: ['src/lib/shape-hold.ts'], bundle: true,
  write: false, platform: 'node', format: 'cjs' });
const output = { exports: {} };
new Function('module', 'exports', compiled.outputFiles[0].text)(output, output.exports);
const { ShapeHold } = output.exports;

function clock() {
  let now = 0, id = 0;
  const jobs = new Map();
  return {
    scheduler: { now: () => now, set: (callback, delay) => {
      jobs.set(++id, { callback, at: now + delay }); return id;
    }, clear: key => jobs.delete(key) },
    advance(ms, callbacks = true) {
      const target = now + ms;
      if (callbacks) {
        while (true) {
          const next = [...jobs].filter(([, job]) => job.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
          if (!next) break;
          jobs.delete(next[0]); now = next[1].at; next[1].callback();
        }
      }
      now = target;
    },
    get pending() { return jobs.size; },
  };
}
const circle = (radius = 20, endAngle = Math.PI * 2) => Array.from({ length: 100 }, (_, i) => ({
  x: 50 + radius * Math.cos(i / 99 * endAngle), y: 50 + radius * Math.sin(i / 99 * endAngle), pressure: 0.5,
}));

test('Stillhalten mit laufenden Zitterereignissen zeigt die Vorschau und übernimmt sie beim Absetzen', () => {
  for (const scale of [1.5, 3, 6]) {
    const time = clock(), hold = new ShapeHold(time.scheduler), points = circle();
    let preview = null;
    const show = shape => { preview = shape; };
    hold.update(points, show, scale);
    for (let i = 0; i < 40; i++) {
      time.advance(20);
      points.push({ x: 70 + (i % 2 ? 2 : -2) / scale, y: 50, pressure: 0.5 });
      hold.update(points, show, scale);
    }
    assert.equal(preview?.kind, 'ellipse');
    points.push({ x: 70 + 3 / scale, y: 50, pressure: 0 });
    assert.equal(hold.finish(points)?.kind, 'ellipse');
    assert.equal(time.pending, 0);
  }
});

test('Fortlaufende Zeichenereignisse und ein langer unruhiger Endbereich werden als eine Form verarbeitet', () => {
  const time = clock(), hold = new ShapeHold(time.scheduler), points = [];
  let preview = null;
  const show = shape => { preview = shape; };
  const route = Array.from({ length: 400 }, (_, i) => ({
    x: 50 + 20 * Math.cos(i / 399 * Math.PI * 2), y: 50 + 20 * Math.sin(i / 399 * Math.PI * 2), pressure: 0.5,
  }));
  for (const point of route) {
    points.push(point); hold.update(points, show, 3); time.advance(8);
  }
  for (let i = 0; i < 100; i++) {
    points.push({ x: 70 + Math.sin(i * 1.7) * 0.6, y: 50 + Math.cos(i * 1.3) * 0.5, pressure: 0.5 });
    hold.update(points, show, 3); time.advance(12);
  }
  assert.equal(preview?.kind, 'ellipse');
  assert.equal(hold.finish(points)?.kind, 'ellipse');
});

test('Die Vorschau benötigt die Haltezeit, bleibt bei kleinen Bewegungen erhalten und verschwindet beim Weiterzeichnen', () => {
  const time = clock(), hold = new ShapeHold(time.scheduler), points = circle();
  let preview = null;
  const show = shape => { preview = shape; };
  hold.update(points, show, 3);
  time.advance(549);
  assert.equal(preview, null);
  time.advance(1);
  assert.equal(preview?.kind, 'ellipse');
  points.push({ x: 73, y: 50, pressure: 0.5 }); // 9 screen pixels, still holding
  hold.update(points, show, 3);
  assert.equal(preview?.kind, 'ellipse');
  points.push({ x: 80, y: 50, pressure: 0.5 }); // deliberate continuation
  hold.update(points, show, 3);
  assert.equal(preview, null);
  assert.equal(hold.finish(points), null);
});

test('Eine schnelle Mauslinie mit nur Start- und Endereignis kann erkannt werden', () => {
  const time = clock(), hold = new ShapeHold(time.scheduler);
  const points = [{ x: 20, y: 20, pressure: 0.5 }, { x: 80, y: 40, pressure: 0.5 }];
  let preview = null;
  hold.update(points, shape => { preview = shape; }, 3);
  time.advance(550);
  assert.equal(preview?.kind, 'line');
  assert.equal(hold.finish(points)?.kind, 'line');
});

test('Eine kleine Absetzbewegung verwirft die erkannte Form nicht, ein entfernter Endpunkt schon', () => {
  for (const [pixels, accepted] of [[2, true], [12, true], [18, false]]) {
    const time = clock(), hold = new ShapeHold(time.scheduler), points = circle();
    hold.update(points, () => {}, 3);
    time.advance(550);
    points.push({ x: 70 + pixels / 3, y: 50, pressure: 0 });
    assert.equal(hold.finish(points)?.kind === 'ellipse', accepted);
  }
});

test('Ein ausgelasteter Browser darf die Haltezeit auch beim Loslassen prüfen', () => {
  const time = clock(), hold = new ShapeHold(time.scheduler), points = circle();
  hold.update(points, () => {}, 3);
  time.advance(600, false); // timer callback delayed behind the pointer-up event
  assert.equal(hold.finish(points)?.kind, 'ellipse');
  assert.equal(time.pending, 0);
});

test('Nach einem erfolglosen Versuch kann eine kleine Korrektur die Vorschau vervollständigen', () => {
  const time = clock(), hold = new ShapeHold(time.scheduler);
  const points = circle(5, 335 / 180 * Math.PI);
  let preview = null;
  const show = shape => { preview = shape; };
  hold.update(points, show, 3);
  time.advance(550);
  assert.equal(preview, null);
  points.push({ x: 55, y: 50, pressure: 0.5 });
  hold.update(points, show, 3);
  time.advance(100);
  assert.equal(preview?.kind, 'ellipse');
});

test('Abbruch und Seitenwechsel löschen Timer und Kandidat; die nächste Geste startet neu', () => {
  const time = clock(), hold = new ShapeHold(time.scheduler), points = circle();
  let callbacks = 0;
  hold.update(points, () => { callbacks++; }, 3);
  const before = callbacks;
  hold.cancel();
  time.advance(1000);
  assert.equal(callbacks, before);
  assert.equal(time.pending, 0);
  assert.equal(hold.finish(points), null);
  hold.update(points, () => {}, 3);
  time.advance(550);
  assert.equal(hold.finish(points)?.kind, 'ellipse');
});


test('Eine zweite Geste erkennt die Pfeilspitze erst nach dem Halten und verwirft die Zusammenfügung bei Abbruch', () => {
  const time = clock(), hold = new ShapeHold(time.scheduler);
  const shaft = { id: 'shaft', x: 20, y: 50, width: 60, height: 0, rotation: 0,
    points: [{ x: 0, y: 0, pressure: 0.5 }, { x: 60, y: 0, pressure: 0.5 }] };
  const head = [{ x: 65, y: 38, pressure: 0.5 }, { x: 80, y: 50, pressure: 0.5 }, { x: 65, y: 62, pressure: 0.5 }];
  let preview = null;
  const show = shape => { preview = shape; };
  hold.update(head, show, 3, shaft);
  time.advance(549); assert.equal(preview, null);
  time.advance(1); assert.equal(preview.kind, 'arrow'); assert.equal(preview.replaceId, 'shaft');
  assert.equal(hold.replacementId, 'shaft');
  const release = [...head, { x: 65.8, y: 62, pressure: 0.5 }];
  assert.equal(hold.finish(release).replaceId, 'shaft');
  hold.update(head, show, 3, shaft); hold.cancel(); time.advance(1000);
  assert.equal(hold.replacementId, undefined);
  assert.equal(hold.finish(head), null);
  hold.update(head, show, 3); time.advance(550);
  assert.equal(preview, null); // a standalone V must not consume a previous gesture's shaft
  assert.equal(hold.finish(head), null);
});
