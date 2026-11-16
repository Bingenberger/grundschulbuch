import { test } from 'node:test';
import assert from 'node:assert/strict';
// Bundle the pure generator and its original-layout dependencies.
import {build} from 'esbuild';
import {createRequire} from 'node:module';
const compiled=await build({entryPoints:['src/lib/generators.ts'],bundle:true,write:false,platform:'node',format:'cjs',packages:'external'});
const mod={exports:{}};
new Function('require','module','exports',compiled.outputFiles[0].text)(createRequire(import.meta.url),mod,mod.exports);
const {generateWorksheet,starterTemplates,generators}=mod.exports;
const { validatePage } = await import('../src/lib/notebooks.mjs');

test('Alle Generatoren erzeugen gültige, bearbeitbare A4-Seiten; Lösungen werden getrennt angefügt', () => {
  for (const kind of Object.keys(generators)) {
    const result = generateWorksheet({
      kind,
      title: 'Test',
      words: 'SONNE,BLUME,HEFT',
      maximum: 20,
      seed: 42,
    });
    assert.equal(
      result.length,
      ['nachspuren', 'silben'].includes(kind) ? 1 : 2,
    );
    for (const page of result) {
      assert.ok(validatePage(page).elements.length);
      assert.ok(page.elements.every((e) => !e.locked));
    }
  }
});
test('Rechenaufgaben bleiben im Zahlenraum und ihre Lösungen stimmen', () => {
  const [exercise, solution] = generateWorksheet({
    kind: 'rechnen',
    title: '',
    words: '',
    maximum: 20,
    seed: 123,
  });
  const questions = exercise.elements.filter((e) => e.type === 'text').slice(2);
  const answers = solution.elements.filter((e) => e.type === 'text').slice(2);
  assert.equal(questions.length, 24);
  answers.forEach((el, i) => {
    const [, a, op, b, c] = el.text.match(/(\d+) ([+−]) (\d+) = (\d+)/);
    assert.equal(
      Number(c),
      op === '+' ? Number(a) + Number(b) : Number(a) - Number(b),
    );
    assert.ok([a, b, c].every((n) => Number(n) <= 20));
    assert.match(questions[i].text, /_____/);
  });
});
test('Eigene Startvorlagen enthalten Steckbrief, Bildergeschichte und Stundenplan', () => {
  const templates = starterTemplates();
  assert.equal(templates.length, 3);
  for (const t of templates) assert.ok(validatePage(t.page));
  assert.equal(
    templates.find((t) => t.title === 'Stundenplan').page.orientation,
    'landscape',
  );
});
