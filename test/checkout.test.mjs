import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/learning/checkout.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const k = mod.exports;

/** Repeatable random numbers. */
function seeded(seed = 7) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

test('Einstellungen wie in der Vorlage: Bäckerei, Euro und Cent, 5 Kunden', () => {
  const c = k.defaultShop(seeded());
  assert.equal(c.basket, 'bakery');
  assert.equal(c.sign, 'BÄCKEREI');
  assert.equal(c.level, 'mixed');
  assert.equal(c.items.length, 8);
  assert.equal(c.customers, 5);
  assert.equal(c.kinds, 2);
  assert.deepEqual([c.qty, c.pics, c.give, c.read], [true, true, false, true]);
  assert.equal(c.items[0].picto, '/kasse/39058.webp');
  assert.equal(c.money.m200, '/kasse/geld-200.webp');
  assert.equal(Object.keys(c.money).length, 14);
  assert.equal(k.BASKETS.length, 9);
});

test('Unsichere Bilder und kaputte Werte werden verworfen', () => {
  const c = k.shopConfig({ items: [{ name: 'X', price: 'a', picto: 'https://evil.example/a.png', image: '/api/medien/' + 'a'.repeat(64) + '.png' }, { name: '  ' }], level: 'gold', customers: 99, sign: '' });
  assert.equal(c.items.length, 1);
  assert.equal(c.items[0].picto, undefined);
  assert.equal(k.itemPicture(c.items[0]), '/api/medien/' + 'a'.repeat(64) + '.png');
  assert.equal(c.items[0].price, 100);
  assert.equal(c.level, 'mixed');
  assert.equal(c.customers, 10);
  assert.equal(c.sign, 'LADEN');
  assert.deepEqual(k.shopConfig({}).items, [{ name: 'Apfel', price: 50, g: 'm', pl: 'Äpfel' }]);
});

test('Preise passen zur Stufe und behalten die Reihenfolge', () => {
  const items = k.BASKETS[0].items.map((i) => ({ ...i, base: i.price }));
  for (const level of ['cent', 'euro', 'round', 'bills', 'high', 'mixed']) {
    const prices = k.rollPrices(items, level, seeded(3));
    assert.equal(prices.length, items.length);
    if (level === 'cent') assert.ok(prices.every((p) => p >= 10 && p <= 95 && p % 5 === 0));
    if (level === 'euro') assert.ok(prices.every((p) => p % 100 === 0 && p <= 900));
    if (level === 'bills') assert.ok(prices.every((p) => p % 500 === 0));
    if (level !== 'mixed') {
      // Cheapest original stays cheapest.
      const order = (list) => list.map((p, i) => [p, i]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([, i]) => i);
      const bases = items.map((i) => i.price);
      assert.equal(order(prices)[0], order(bases)[0], level);
    }
  }
});

test('Preise schreiben und sprechen', () => {
  assert.equal(k.priceText(35, 'cent'), '35 ct');
  assert.equal(k.priceText(500, 'euro'), '5 €');
  assert.equal(k.priceText(249, 'mixed'), '2,49 €');
  assert.equal(k.spokenPrice(249), '2 Euro 49');
  assert.equal(k.spokenPrice(300), '3 Euro');
  assert.equal(k.spokenPrice(45), '45 Cent');
  assert.equal(k.parsePrice('2,49', 'mixed'), 249);
  assert.equal(k.parsePrice('2.5', 'mixed'), 250);
  assert.equal(k.parsePrice('35 ct', 'mixed'), 35);
  assert.equal(k.parsePrice('35', 'cent'), 35);
  assert.equal(k.parsePrice('35', 'euro'), 3500);
  assert.equal(k.parsePrice('abc', 'euro'), null);
});

test('Kunde bestellt in ganzen Sätzen – geschrieben und gesprochen', () => {
  const c = k.shopConfig({ items: [{ name: 'Breze', price: 85, g: 'f', pl: 'Brezen' }, { name: 'Kaffee', price: 249, g: 'f', sg: 'Tasse Kaffee', pl: 'Tassen Kaffee' }, { name: 'Brot', price: 349, g: 'n' }] });
  const s = { ...k.freshShop(), order: [{ i: 0, n: 2 }, { i: 1, n: 1 }, { i: 2, n: 1 }] };
  const talk = k.orderTalk(c, s, 'Guten Tag!', false);
  assert.equal(talk.text, 'Guten Tag! Ich möchte hier einkaufen: 2 Brezen, 1 Tasse Kaffee und 1 Brot.');
  assert.equal(talk.said, 'Guten Tag! Ich möchte hier einkaufen: zwei Brezen, eine Tasse Kaffee und ein Brot.');
  assert.equal(k.orderTalk(c, s, '', true).text, 'Das stimmt aber nicht. Ich möchte: 2 Brezen, 1 Tasse Kaffee und 1 Brot.');
  assert.equal(k.total(c, s.order), 2 * 85 + 249 + 349);
});

test('Bestellung, Bezahlung und Wechselgeld', () => {
  const c = k.defaultShop(seeded(11));
  const rnd = seeded(5);
  for (let t = 0; t < 50; t++) {
    const order = k.makeOrder(c, rnd);
    assert.ok(order.length >= 1 && order.length <= 2);
    assert.equal(new Set(order.map((l) => l.i)).size, order.length);
    assert.ok(order.every((l) => l.n >= 1 && l.n <= 3));
    const cost = k.total(c, order), paid = k.payment(cost, c.level, rnd);
    assert.ok(paid >= cost);
  }
  assert.deepEqual(k.changeCoins(388), [200, 100, 50, 20, 10, 5, 2, 1]);
  assert.deepEqual(k.changeCoins(1500), [1000, 500]);
  // Only cents: an order costs at most 1 € where possible.
  const cent = k.shopConfig({ ...c, level: 'cent', items: c.items.map((i) => ({ ...i, price: 20 })) });
  for (let t = 0; t < 20; t++) assert.ok(k.total(cent, k.makeOrder(cent, rnd)) <= 100);
});

test('Ablauf an der Kasse: Waren, Fehler, Korrekturen, Auswertung', () => {
  const c = k.defaultShop(seeded(2));
  let s = { ...k.freshShop(), custs: k.customerOrder(2, 7, seeded(4)) };
  assert.equal(s.custs.length, 2);
  assert.notEqual(s.custs[0], s.custs[1]);
  s = k.nextCustomer(c, s, seeded(9));
  assert.equal(s.phase, 'enter');
  assert.equal(s.inside, true);
  s = { ...s, phase: 'order' };
  for (const line of s.order) for (let n = 0; n < line.n; n++) s = k.addGood(s, line.i);
  assert.equal(k.cartRight(s), true);
  s = k.addGood(s, s.order[0].i);
  assert.equal(k.cartRight(s), false);
  s = k.removeGood(s, 0);
  assert.equal(k.cartRight(s), true);
  assert.equal(s.res[0].fixes, 1);
  s = k.fix(s, 'errPay');
  assert.deepEqual(k.without([200, 100, 200], 200), [200, 100]);
  s.res[0] = { ...s.res[0], start: 1000, end: 31000 };
  const r = k.summary(s);
  assert.deepEqual(r, { served: 1, time: 30000, perfect: 0, errSum: 0, errPay: 1, errChg: 0, fixes: 1 });
  assert.equal(k.duration(30000), '30 Sek.');
  assert.equal(k.duration(95000), '1:35 Min.');
});
