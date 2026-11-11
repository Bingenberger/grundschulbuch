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
const f = await bundled('src/lib/text-fit.ts');
// A font like Andika: x-height 0.5, capitals 0.7; baseline from CSS line boxes.
const measure = {
  ratios: () => ({ xHeight: 0.5, capHeight: 0.7 }),
  baseline: (_font, fontMm, lineMm) => lineMm / 2 + ((0.9 - 0.3) * fontMm) / 2,
};
const text = (patch = {}) => ({ id: 't', type: 'text', x: 20, y: 20, width: 120, height: 30, rotation: 0, locked: false, color: '#000000', text: 'Hallo', font: 'Andika', fontSize: 18, ...patch });
const page = (ruling, orientation = 'portrait') => ({ ruling, orientation });
const close = (a, b, d = 0.01) => assert.ok(Math.abs(a - b) < d, `${a} ≠ ${b}`);

test('Lineatur 1 hat Zeilen von 2 cm mit der roten Grundlinie in der Mitte', () => {
  const rows = f.rulingRows(page('linie1'));
  assert.equal(rows.period, 20);
  close(rows.first, 30.15);
  assert.equal(rows.xHeight, 5);
  assert.ok(rows.last + 5 <= 297 - 15 + 0.3);
  assert.equal(f.rulingRows(page('blanko')), null);
  assert.equal(f.rulingRows(page('karo5')), null);
  close(f.rulingRows(page('linie4')).first, 19);
});

test('Neuer Text bekommt die Größe der Lineatur und steht auf der Grundlinie', () => {
  const el = f.fitTextToRuling(text(), page('linie1'), measure, { autoSize: true });
  const fontMm = (el.fontSize * 25.4) / 72;
  // x-height fills the shaded band (5 mm), capitals stay below the top line.
  close(fontMm * 0.5, 5, 0.1);
  assert.ok(fontMm * 0.7 <= 10);
  close(fontMm * el.lineHeight, 20, 0.01);
  const baseline = el.y + measure.baseline('Andika', fontMm, 20);
  close((baseline - 30.15) % 20, 0, 0.01);
  assert.equal(el.height, 20);
});

test('Jede weitere Zeile landet in der nächsten Lineatur-Zeile', () => {
  const el = f.fitTextToRuling(text({ y: 70 }), page('linie2'), measure, { autoSize: true, lines: 3 });
  const fontMm = (el.fontSize * 25.4) / 72;
  close(fontMm * el.lineHeight, 16);
  assert.equal(el.height, 48);
  const baseline = el.y + measure.baseline('Andika', fontMm, 16);
  close(((baseline - 8.15) % 16 + 16) % 16, 0);
});

test('Selbst gewählte Größe bleibt, der Zeilenabstand folgt den Zeilen', () => {
  const el = f.fitTextToRuling(text({ fontSize: 60 }), page('linie4'), measure);
  assert.equal(el.fontSize, 60);
  const fontMm = (60 * 25.4) / 72;
  close(fontMm * el.lineHeight, 30);
});

test('Gedrehte, gesperrte, gerahmte Texte und Überschriften über der Lineatur bleiben unverändert', () => {
  assert.equal(f.fitTextToRuling(text({ rotation: 10 }), page('linie1'), measure), null);
  assert.equal(f.fitTextToRuling(text({ locked: true }), page('linie1'), measure), null);
  assert.equal(f.fitTextToRuling(text({ textFrame: 'speech' }), page('linie1'), measure), null);
  assert.equal(f.fitTextToRuling(text({ y: -30 }), page('linie1'), measure), null);
  assert.equal(f.fitTextToRuling(text({ y: 40 }), page('bildzeilen'), measure), null);
  assert.ok(f.fitTextToRuling(text({ y: 170 }), page('bildzeilen'), measure));
});
