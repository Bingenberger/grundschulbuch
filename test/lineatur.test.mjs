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
const l = await bundled('src/lib/lineatur.ts');
const f = await bundled('src/lib/text-fit.ts');
const { widgetSettings, WIDGET_KINDS } = await import('../src/lib/learning/validation.mjs');
const U = 297 / 1400;
const close = (a, b, d = 0.01) => assert.ok(Math.abs(a - b) < d, `${a} ≠ ${b}`);
const block = (lineatur, patch = {}) => ({ id: 'l', type: 'widget', widgetKind: 'lineatur', x: 15, y: 100, width: 180, height: 100, rotation: 0, locked: false, color: '#000000', settings: { lineatur }, ...patch });
const text = (patch = {}) => ({ id: 't', type: 'text', x: 20, y: 110, width: 120, height: 12, rotation: 0, locked: false, color: '#000000', text: 'Hallo', font: 'Andika', fontSize: 18, ...patch });
const measure = {
  ratios: () => ({ xHeight: 0.5, capHeight: 0.7 }),
  baseline: (_font, fontMm, lineMm) => lineMm / 2 + ((0.9 - 0.3) * fontMm) / 2,
};

test('Lineatur 1 hat die Maße der Originalseite und so viele Zeilen, wie hineinpassen', () => {
  const layout = l.lineaturLayout({ ruling: 'linie1' }, 180, 100);
  assert.equal(layout.kind, 'four');
  close(layout.band, 34 * U);
  close(layout.pitch, 152 * U);
  // 3 rows of 21.6 mm with 32.3 mm between their tops fit into 100 mm.
  assert.equal(layout.tops.length, 3);
  assert.equal(layout.left, 0);
  const tiny = l.lineaturLayout({ ruling: 'linie1' }, 180, 10);
  assert.equal(tiny.tops.length, 0);
});

test('Das Zeilenhaus gibt es nur bei den Lineaturen mit vier Linien und rückt die Linien ein', () => {
  assert.deepEqual(l.lineaturSettings(block({ ruling: 'linie1', house: true })), { ruling: 'linie1', house: true, color: undefined });
  assert.equal(l.lineaturSettings(block({ ruling: 'karo5', house: true })).house, false);
  assert.equal(l.lineaturSettings(block({ ruling: 'quatsch' })).ruling, 'linie1');
  const layout = l.lineaturLayout({ ruling: 'linie1', house: true }, 180, 100);
  assert.ok(layout.left > l.houseWidth(34 * U));
});

test('Alle Lineaturen der Seitenvorlagen gibt es als Baustein', () => {
  for (const kind of ['linie1', 'linie2', 'linie3', 'linie4', 'linieneng', 'karo5', 'karo10', 'rechnen', 'punkte', 'noten'])
    assert.ok(l.LINEATUR_KINDS.includes(kind), kind);
  const grid = l.lineaturLayout({ ruling: 'karo5' }, 52, 31);
  assert.equal(grid.kind, 'grid');
  // Squares of 5 mm in the middle of the box.
  close(grid.xs[0], 1);
  close(grid.ys[0], 0.5);
  close(grid.xs[1] - grid.xs[0], 5);
  assert.equal(l.lineaturLayout({ ruling: 'noten' }, 180, 60).kind, 'music');
  assert.equal(l.lineaturRows(block({ ruling: 'karo5' })), null);
});

test('Ein Text auf der Lineatur bekommt ihre Schriftgröße und steht auf ihrer Grundlinie', () => {
  const lin = block({ ruling: 'linie1' });
  const rows = l.lineaturRows(lin);
  const page = { ruling: 'blanko', orientation: 'portrait', elements: [lin] };
  const el = f.fitTextToRuling(text(), page, measure, { autoSize: true });
  assert.ok(el);
  const fontMm = (el.fontSize * 25.4) / 72;
  close(fontMm * 0.5, 34 * U, 0.1);
  const baseline = el.y + measure.baseline('Andika', fontMm, fontMm * el.lineHeight);
  close(baseline, rows.first);
  // Further down it lands on the next row.
  const lower = f.fitTextToRuling(text({ y: 140 }), page, measure, { autoSize: true });
  close(lower.y + measure.baseline('Andika', fontMm, fontMm * lower.lineHeight), rows.first + rows.period);
  // Next to the Lineatur nothing changes (blank page).
  assert.equal(f.fitTextToRuling(text({ y: 250 }), page, measure), null);
  // A rotated Lineatur has no rows to sit on.
  assert.equal(f.fitTextToRuling(text(), { ...page, elements: [{ ...lin, rotation: 10 }] }, measure), null);
});

test('Text und Schrift auf einer Lineatur wandern mit, wenn sie verschoben wird', () => {
  const lin = block({ ruling: 'linie2' });
  const on = text({ id: 'on' });
  const below = text({ id: 'below', y: 250 });
  const fixed = text({ id: 'fixed', locked: true });
  const under = text({ id: 'under' });
  const riders = l.ridersOf([under, lin, on, below, fixed], [lin]);
  assert.deepEqual(riders.map((el) => el.id), ['on']);
});

test('Der Server nimmt nur gültige Lineatur-Einstellungen an', () => {
  assert.ok(WIDGET_KINDS.includes('lineatur'));
  assert.deepEqual(widgetSettings({ lineatur: { ruling: 'linie1', house: true, color: '#8d969b' } }).lineatur, { ruling: 'linie1', house: true, color: '#8d969b' });
  assert.throws(() => widgetSettings({ lineatur: { ruling: 'linie9' } }));
  assert.throws(() => widgetSettings({ lineatur: { ruling: 'linie1', color: 'red' } }));
  assert.throws(() => widgetSettings({ lineatur: { ruling: 'linie1', extra: 1 } }));
});

test('Eine neue Lineatur hat genau die vorgesehenen Zeilen', () => {
  for (const [ruling, rows] of [['linie1', 3], ['linie2', 4], ['linie3', 5]]) {
    const size = l.lineaturStartSize({ ruling });
    assert.equal(l.lineaturLayout({ ruling }, size.width, size.height).tops.length, rows, ruling);
  }
  const lines = l.lineaturStartSize({ ruling: 'linie4' });
  assert.equal(l.lineaturLayout({ ruling: 'linie4' }, lines.width, lines.height).lines.length, 8);
});
