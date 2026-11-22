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
const { twoUpSheets } = await bundled('src/lib/two-up.ts');
const p = (id, orientation = 'landscape') => ({ id, orientation });

test('2 Seiten auf ein Blatt: je zwei Querformat-Seiten teilen sich ein A4-Blatt', () => {
  const ids = (sheets) => sheets.map((s) => s.map((x) => x.id).join('+'));
  assert.deepEqual(ids(twoUpSheets([p('a'), p('b'), p('c'), p('d'), p('e')])), ['a+b', 'c+d', 'e']);
  // A page of the other orientation starts a new sheet.
  assert.deepEqual(ids(twoUpSheets([p('a'), p('b', 'portrait'), p('c'), p('d')])), ['a', 'b', 'c+d']);
  assert.deepEqual(twoUpSheets([]), []);
});
