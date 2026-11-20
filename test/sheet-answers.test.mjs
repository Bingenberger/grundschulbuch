import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const bundle = async (entry) => {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent', alias: { '@': './src' } });
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
  return mod.exports;
};
const { sameAnswer, answerMark, shownMark, checkPage, readyGuide } = await bundle('src/lib/sheets/answers.ts');

test('Lösungskontrolle wie in der Vorlage: Längen, Uhrzeiten, Geld, Zahlen', () => {
  for (const typed of ['7', '7 cm', '7cm', '70 mm']) assert.ok(sameAnswer(typed, '7'), typed);
  assert.ok(!sameAnswer('8', '7'));
  assert.ok(!sameAnswer('7 mm', '7'));
  for (const typed of ['7,5', '7.5 cm', '75 mm']) assert.ok(sameAnswer(typed, '7,5'), typed);
  assert.ok(sameAnswer('9.05', '9:05'));
  assert.ok(sameAnswer('9 Uhr 5', '9:05') === false, 'minutes need two digits as in the reference');
  assert.ok(sameAnswer('9 Uhr', '9:00'));
  assert.ok(sameAnswer('1,49', '1,49 €'));
  assert.ok(sameAnswer('149 ct', '1,49 €'));
  assert.ok(sameAnswer('6', '6 €'));
  assert.ok(sameAnswer('1.000', '1000'));
  assert.ok(sameAnswer(' Apfel ', 'apfel'));
  assert.ok(!sameAnswer('', '7'));
});

test('✓/✗ sofort oder nach „Prüfen“', () => {
  assert.equal(answerMark({ answer: '7', text: '' }), null);
  assert.equal(answerMark({ answer: '7', text: '70 mm' }), 'ok');
  assert.equal(shownMark({ answer: '7', text: '6', check: 'each' }), 'bad');
  assert.equal(shownMark({ answer: '7', text: '6', check: 'button' }), null);
  assert.equal(shownMark({ answer: '7', text: '6', check: 'button', marked: true }), 'bad');
  const box = (id, answer, text) => ({ id, type: 'text', answer, text, placeholder: ' ', check: 'button' });
  const page = { id: 'p', elements: [box('a', '7', '7 cm'), box('b', '3', '4'), box('c', '5', '')] };
  const result = checkPage(page);
  assert.equal(result.message, '1 von 3 richtig · 1 mit ✗: schau es dir noch einmal an · 1 noch leer');
  assert.deepEqual(result.page.elements.map((e) => !!e.marked), [true, true, false]);
  assert.equal(checkPage({ id: 'p', elements: [box('a', '7', '7')] }).message, 'Alles richtig – das Ergebnis stimmt!');
  assert.equal(checkPage({ id: 'p', elements: [] }).message, 'Auf dieser Seite gibt es nichts zu prüfen.');
});

test('Lineal liegt unten links bereit', () => {
  assert.deepEqual(readyGuide('ruler', { width: 297, height: 210 }), { kind: 'ruler', x: 102, y: 187, angle: 0 });
  assert.equal(readyGuide('square', { width: 297, height: 210 }).kind, 'triangle');
});

test('Karopapier: Kästchen mit Lösung, „Prüfen“-Knopf und Lineal auf Messseiten', async () => {
  const { gridPages, gridClean, GRID_DEFAULTS } = await bundle('src/lib/sheets/sheets-1473.ts');
  const { toPages } = await bundle('src/lib/sheets/convert.ts');
  const make = (check, formats) => toPages(gridPages(gridClean({ ...GRID_DEFAULTS, formats, layout: 'single', pages: 1, solutions: false, check }), { placed: new Set() }));
  const [measure] = make('button', ['measure']);
  assert.equal(measure.tool, 'ruler');
  const boxes = measure.elements.filter((e) => e.answer !== undefined);
  assert.ok(boxes.length >= 3);
  assert.ok(boxes.every((e) => e.check === 'button' && e.placeholder !== undefined && /^\d+(,5)?$/.test(e.answer)));
  const button = measure.elements.find((e) => e.action === 'check');
  assert.equal(button.text, 'Prüfen');
  assert.equal(button.locked, true);
  const [sym] = make('each', ['sym']);
  assert.equal(sym.tool, undefined, 'mirroring needs no ruler');
  const [plain] = make('none', ['measure']);
  assert.ok(plain.elements.every((e) => e.answer === undefined && e.action === undefined));
});

test('Mathe-Aufgaben, Uhrzeiten, Geld, Noten: Lösungskontrolle wie in der Vorlage 1.49.0', async () => {
  const ref = await bundle('src/lib/sheets/reference-sheets.ts');
  const { toPages } = await bundle('src/lib/sheets/convert.ts');
  const sheets = [
    ['Mathe', (check) => ref.makeMathPages({ ...ref.MATH_DEFAULTS, range: 100, formats: ['plus', 'minus', 'wall'], layout: 'mixed', pages: 1, solutions: true, check }, undefined)],
    ['Uhr', (check) => ref.makeClockPages({ ...ref.CLOCK_DEFAULTS, formats: ['read', 'words'], layout: 'mixed', pages: 1, solutions: true, check }, undefined)],
    ['Noten', (check) => ref.makeNotePages({ ...ref.NOTE_DEFAULTS, layout: 'mixed', pages: 1, solutions: true, check }, undefined)],
    ['Geld', (check) => ref.makeMoneyPages({ ...ref.MONEY_DEFAULTS, layout: 'mixed', pages: 1, solutions: true, check }, undefined, undefined)],
  ];
  assert.ok(sameAnswer('13', '13,00 €') && sameAnswer('97 ct', '0,97 €') && sameAnswer('0', '00'), 'money and minutes as typed by children');
  for (const [name, make] of sheets) {
    const [page, solution] = toPages(make('button'));
    const boxes = page.elements.filter((e) => e.placeholder !== undefined && e.type === 'text');
    assert.ok(boxes.length > 0, `${name}: answer boxes`);
    assert.ok(boxes.every((e) => typeof e.answer === 'string' && e.answer && e.check === 'button'), `${name}: every box knows its result`);
    assert.ok(boxes.every((e) => e.locked), `${name}: boxes are fixed`);
    assert.ok(boxes.every((e) => sameAnswer(e.answer, e.answer)), `${name}: results are checkable`);
    assert.equal(page.elements.filter((e) => e.action === 'check').length, 1, `${name}: one Prüfen`);
    // Typing the results makes everything right.
    const filled = { ...page, elements: page.elements.map((e) => (e.answer !== undefined ? { ...e, text: e.answer } : e)) };
    assert.match(checkPage(filled).message, /^Alles richtig/, name);
    // The solution page shows the results and checks nothing.
    assert.ok(solution.elements.every((e) => e.answer === undefined && e.action === undefined), `${name}: solution page`);
    const [plain] = toPages(make('none'));
    assert.ok(plain.elements.every((e) => e.answer === undefined && e.action === undefined), `${name}: without Lösungskontrolle`);
    const [each] = toPages(make('each'));
    assert.ok(each.elements.some((e) => e.check === 'each') && !each.elements.some((e) => e.action), `${name}: Sofort without button`);
  }
});
