import { test } from 'node:test';
import assert from 'node:assert/strict';
// Exercise the pure generator using the project's TypeScript compiler.
import fs from 'node:fs/promises';
import ts from 'typescript';
const stripTypeScriptTypes = (source) =>
  ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
const model = stripTypeScriptTypes(
  await fs.readFile(
    new URL('../src/lib/notebook-model.ts', import.meta.url),
    'utf8',
  ),
);
const modelUrl = `data:text/javascript;base64,${Buffer.from(model).toString('base64')}`;
const source = stripTypeScriptTypes(
  (
    await fs.readFile(
      new URL('../src/lib/generators.ts', import.meta.url),
      'utf8',
    )
  ).replace("'./notebook-model'", JSON.stringify(modelUrl)),
);
const { generateWorksheet, starterTemplates, generators } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
);
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
