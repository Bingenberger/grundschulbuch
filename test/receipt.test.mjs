import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/learning/receipt.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { receiptConfig, receiptLines, money, parseMoney, paidFor, newReceipt, toggleField, receiptKey, nextReceipt, total, randomFor } = mod.exports;

const type = (c, s, keys) => keys.split('').reduce((st, k) => receiptKey(c, st, k).state, s);

test('Einstellungen werden begrenzt und haben die Werte der Vorlage', () => {
  assert.deepEqual(receiptConfig({}), { count: 5, level: 'simple', format: 'eurocent', change: false, rounds: 1 });
  assert.deepEqual(receiptConfig({ receipt: { count: 40, level: 'complex', format: 'cent', change: true, rounds: 0 } }), { count: 10, level: 'complex', format: 'cent', change: true, rounds: 1 });
});

test('Einkaufslisten passen zum Geldformat', () => {
  const random = randomFor(3);
  for (const format of ['eurocent', 'euro', 'cent'])
    for (const level of ['simple', 'complex']) {
      const lines = receiptLines({ count: 6, level, format }, random);
      assert.equal(lines.length, 6);
      assert.equal(new Set(lines.map((l) => l.name)).size, 6, 'no item twice');
      for (const { price } of lines) {
        if (format === 'cent') assert.ok(price >= 10 && price <= 99);
        if (format === 'euro') assert.equal(price % 100, 0);
        if (format !== 'cent' && level === 'simple') assert.equal(price % 10, 0);
      }
    }
});

test('Geldbeträge anzeigen und eingeben', () => {
  assert.equal(money(249, 'eurocent'), '2,49 €');
  assert.equal(money(700, 'euro'), '7 €');
  assert.equal(money(45, 'cent'), '45 ct');
  assert.equal(parseMoney('12,5', 'eurocent'), 1250);
  assert.equal(parseMoney('3', 'eurocent'), 300);
  assert.equal(parseMoney('45', 'cent'), 45);
  assert.equal(parseMoney('4,5', 'cent'), null);
  assert.equal(parseMoney(',', 'eurocent'), null);
  const paid = paidFor(1234, 'eurocent', () => 0);
  assert.ok(paid > 1234 && paid % 100 === 0);
});

test('Summe eintragen, prüfen, Rückgeld, Stempel und Auswertung', () => {
  const c = { count: 3, level: 'simple', format: 'eurocent', change: true, rounds: 2 };
  let s = newReceipt(c, 9);
  const sum = total(s.lines);
  s = toggleField(s, 'sum', 1000);
  assert.equal(s.active, 'sum');
  // A wrong sum counts as an error; deleting counts as a correction.
  s = type(c, s, '1');
  let r = receiptKey(c, s, 'ok', 2000);
  assert.equal(r.result, 'wrong');
  s = receiptKey(c, r.state, 'del', 2100).state;
  const text = money(sum, 'eurocent').replace(' €', '');
  s = type(c, s, text);
  r = receiptKey(c, s, 'ok', 3000, () => 0);
  assert.equal(r.result, 'right');
  s = r.state;
  assert.equal(s.active, 'change', 'with change the change field opens next');
  assert.ok(s.paid > sum);
  const change = money(s.paid - sum, 'eurocent').replace(' €', '');
  s = receiptKey(c, type(c, s, change), 'ok', 9000).state;
  assert.equal(s.changeOk, true);
  assert.deepEqual(s.stats[0], { start: 1000, end: 9000, errors: 1, fixes: 1 });
  s = nextReceipt(c, s, 10);
  assert.equal(s.round, 1);
  assert.equal(s.sum, '');
  s = nextReceipt(c, s, 11);
  assert.equal(s.summary, true, 'after the last receipt the summary follows');
});

test('Nur zwei Nachkommastellen, höchstens sieben Ziffern, Komma nur bei Euro und Cent', () => {
  const c = { count: 3, level: 'simple', format: 'eurocent', change: false, rounds: 1 };
  let s = toggleField(newReceipt(c, 1), 'sum');
  s = type(c, s, '12,345');
  assert.equal(s.sum, '12,34');
  const cent = { ...c, format: 'cent' };
  let k = toggleField(newReceipt(cent, 1), 'sum');
  k = type(cent, k, '4,5');
  assert.equal(k.sum, '45');
});
