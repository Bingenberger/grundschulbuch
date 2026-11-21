import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/learning/paeckchen.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { generate, parseExpr, evaluate, RECIPES, paeckchenConfig, redraw, score, columnsOf, groupOf, paeckchenSize, formatValue, tasksKey } = mod.exports;

const text = (t) => t.parts.map((p) => ('a' in p ? `[${p.a}]` : p.s)).join('');
const calc = (e, scope = {}) => evaluate(parseExpr(e), scope);

test('Rechnen in der Aufgabensprache: Punkt vor Strich, Klammern, deutsche Zeichen', () => {
  assert.equal(calc('2 + 3 · 4'), 14);
  assert.equal(calc('(2 + 3) * 4'), 20);
  assert.equal(calc('17 : 5'), 3.4);
  assert.equal(calc('10 − 2 − 3'), 5);
  assert.equal(calc('−a + 1', { a: 4 }), -3);
  assert.equal(calc('einer(47) + zehner(47) · 10'), 47);
  assert.equal(calc('abrunden(47, 10)'), 40);
  assert.equal(calc('aufrunden(47, 10)'), 50);
  assert.equal(calc('aufrunden(347, 100)'), 400);
  assert.equal(calc('rest(17, 5)'), 2);
  assert.equal(calc('ganz(17 / 5)'), 3);
  assert.equal(calc('Übergang_Plus(8, 5)'), 1);
  assert.equal(calc('uebergang_minus(43, 5)'), 1);
  assert.equal(calc('vergleich(3, 7)'), '<');
  assert.equal(calc('3 < 4 und nicht 2 = 3'), 1);
  assert.equal(calc('4 ≠ 4 oder 5 ≥ 5'), 1);
  assert.equal(calc('17 mod 5'), 2);
});

test('Die gewünschte Aufgabe: von einer gemischten Zahl bis 100 zu den Nachbarzehnern', () => {
  const script = RECIPES.find((r) => r.id === 'nachbarzehner').script;
  const { tasks, errors, perRun } = generate(script, 30, 5);
  assert.deepEqual(errors, []);
  assert.equal(perRun, 2);
  assert.equal(tasks.length, 60);
  for (let i = 0; i < tasks.length; i += 2) {
    const minus = text(tasks[i]).match(/^(\d+) − \[(\d+)\] = (\d+)$/);
    const plus = text(tasks[i + 1]).match(/^(\d+) \+ \[(\d+)\] = (\d+)$/);
    assert.ok(minus && plus, `${text(tasks[i])} | ${text(tasks[i + 1])}`);
    const a = +minus[1];
    assert.ok(a > 10 && a < 100 && a % 10 !== 0, `gemischte Zahl: ${a}`);
    assert.equal(+plus[1], a);
    assert.equal(+minus[3], Math.floor(a / 10) * 10);
    assert.equal(+plus[3], Math.ceil(a / 10) * 10);
    assert.equal(+minus[1] - +minus[2], +minus[3]);
    assert.equal(+plus[1] + +plus[2], +plus[3]);
  }
  // Each number only once.
  assert.equal(new Set(tasks.filter((_, i) => i % 2 === 0).map(text)).size, 30);
});

test('Alle Vorlagen ergeben richtige Aufgaben', () => {
  for (const r of RECIPES) {
    const { tasks, errors } = generate(r.script, 12, 3);
    assert.deepEqual(errors, [], r.id);
    assert.ok(tasks.length >= 12, r.id);
    for (const t of tasks) {
      const s = text(t);
      if (/^(\d+) \+ (\d+) = \[(\d+)\]$/.test(s)) { const [, a, b, c] = s.match(/^(\d+) \+ (\d+) = \[(\d+)\]$/); assert.equal(+a + +b, +c, s); }
      if (/^(\d+) − (\d+) = \[(\d+)\]$/.test(s)) { const [, a, b, c] = s.match(/^(\d+) − (\d+) = \[(\d+)\]$/); assert.equal(+a - +b, +c, s); assert.ok(+c >= 0, s); }
      if (/^(\d+) · (\d+) = \[(\d+)\]$/.test(s)) { const [, a, b, c] = s.match(/^(\d+) · (\d+) = \[(\d+)\]$/); assert.equal(+a * +b, +c, s); }
    }
  }
  const plus = generate(RECIPES.find((r) => r.id === 'plus20-ohne').script, 40, 9).tasks.map(text);
  for (const s of plus) { const [, a, b, c] = s.match(/^(\d+) \+ (\d+) = \[(\d+)\]$/); assert.ok(+c <= 20 && (+a % 10) + (+b % 10) < 10, s); }
  const rest = generate(RECIPES.find((r) => r.id === 'rest').script, 20, 9).tasks.map(text);
  for (const s of rest) { const [, a, b, q, r] = s.match(/^(\d+) : (\d+) = \[(\d+)\] R \[(\d+)\]$/); assert.equal(+b * +q + +r, +a, s); assert.ok(+r > 0 && +r < +b, s); }
});

test('Gleicher Startwert, gleiche Aufgaben; „Neue Zahlen“ gibt andere', () => {
  const script = 'a = 1..1000\na + 1 = [a + 1]';
  assert.deepEqual(generate(script, 8, 42).tasks, generate(script, 8, 42).tasks);
  assert.notDeepEqual(generate(script, 8, 42).tasks, generate(script, 8, 43).tasks);
  // More tasks keep the first ones.
  assert.deepEqual(generate(script, 12, 42).tasks.slice(0, 8), generate(script, 8, 42).tasks);
  const c = paeckchenConfig({ script, count: 5, seed: 1 });
  const d = redraw(c, 99);
  assert.equal(d.seed, 99);
  assert.equal(d.tasks.length, 5);
  assert.notEqual(tasksKey(c.tasks), tasksKey(d.tasks));
});

test('Text um die Lücken: Variablen, {Rechnungen}, Rechenzeichen, Kommazahlen', () => {
  const { tasks } = generate('a = 3\nb = a * 2\nDas Doppelte von a ist [b], die Hälfte von {b*3} ist [b*3/2]\na * 2 - 1 = [2*a-1]\na : 2 = [a / 2]', 1, 1);
  assert.equal(text(tasks[0]), 'Das Doppelte von 3 ist [6], die Hälfte von 18 ist [9]');
  assert.equal(text(tasks[1]), '3 · 2 − 1 = [5]');
  assert.equal(text(tasks[2]), '3 : 2 = [1,5]');
  assert.equal(formatValue(-4), '−4');
  assert.equal(formatValue(0.1 + 0.2), '0,3');
});

test('Listen, Schritte und Notizen', () => {
  const { tasks } = generate('# Fünferreihe\na = 5, 10, 20 // nur diese\nb = 0..50 schritt 5\na + b = [a + b]', 30, 2);
  for (const t of tasks) { const [, a, b] = text(t).match(/^(\d+) \+ (\d+)/); assert.ok([5, 10, 20].includes(+a)); assert.equal(+b % 5, 0); }
});

test('Verständliche Fehler mit Zeilennummer', () => {
  const err = (s) => generate(s, 3, 1).errors[0];
  assert.match(err('a = 1..5').message, /Lücke in \[ \]/);
  assert.deepEqual([err('a = 1..5\nb + 1 = [b]').line, err('a = 1..5\nb + 1 = [b]').message], [2, '„b“ kenne ich nicht – steht weiter oben „b = …“?']);
  assert.equal(err('a = 1..5\nwenn a > 10\na = [a]').line, 2);
  assert.match(err('a = 1..5\nwenn a > 10\na = [a]').message, /keine passenden Zahlen/);
  assert.equal(err('a = 1 .. \na = [a]').line, 1);
  assert.equal(err('x = 1..3\nx ? 2').line, 2);
  assert.match(err('a = 1..3\nfoo(a) = [wurzel(a)]').message, /Funktion „wurzel“/);
  assert.match(err('a = 1..3\na + [ ] = 3').message, /eckigen Klammern/);
  assert.match(err('einer = 1..3\neiner = [einer]').message, /schon vergeben/);
  assert.match(err('a = (1 + 2\na = [a]').message, /schließende Klammer/);
  assert.match(err('a = 1..3\na + [a = 3').message, /nicht geschlossen/);
});

test('Prüfen: richtig, falsch, leer; Komma und Zeichen', () => {
  const { tasks } = generate('a = 7\na + 3 = [a + 3]\na : 2 = [a / 2]\na [vergleich(a, 9)] 9', 1, 1);
  assert.deepEqual(score(tasks, ['10', '3,5', '<']), { right: 3, total: 3, filled: 3 });
  assert.deepEqual(score(tasks, [' 10 ', '3.5', '>']), { right: 2, total: 3, filled: 3 });
  assert.deepEqual(score(tasks, ['11']), { right: 0, total: 3, filled: 1 });
});

test('Päckchen bleiben in einer Spalte zusammen; Größe auf der Seite', () => {
  const c = paeckchenConfig({ script: RECIPES[0].script, count: 6, columns: 2, seed: 3 });
  assert.equal(c.tasks.length, 12);
  assert.equal(groupOf(c), 2);
  assert.deepEqual(columnsOf(c.tasks, 2, 2), [[[0, 1], [2, 3], [4, 5]], [[6, 7], [8, 9], [10, 11]]]);
  assert.equal(groupOf({ ...c, order: 'mixed' }), 1);
  const small = paeckchenSize(c), big = paeckchenSize(paeckchenConfig({ script: RECIPES[0].script, count: 12, columns: 2, seed: 3 }));
  assert.ok(big.height > small.height);
  assert.ok(small.width <= 277 && small.height <= 260);
});

test('Unbrauchbare Einstellungen werden bereinigt', () => {
  const c = paeckchenConfig({ count: 999, columns: 0, check: 'x', order: 'y', tasks: 'kaputt' });
  assert.equal(c.count, 40);
  assert.equal(c.columns, 1);
  assert.equal(c.check, 'button');
  assert.equal(c.order, 'script');
  assert.equal(c.tasks.length, 80);
});
