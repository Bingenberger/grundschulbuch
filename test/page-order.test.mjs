import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/page-order.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { moveTo } = mod.exports;

test('Seiten verschieben: einzeln, mehrere zusammen, an den Anfang und ans Ende', () => {
  const ids = ['a', 'b', 'c', 'd', 'e'];
  assert.deepEqual(moveTo(ids, ['d'], 1), ['a', 'd', 'b', 'c', 'e']);
  assert.deepEqual(moveTo(ids, ['b'], 4), ['a', 'c', 'd', 'b', 'e']);
  assert.deepEqual(moveTo(ids, ['e', 'b'], 0), ['b', 'e', 'a', 'c', 'd']);
  assert.deepEqual(moveTo(ids, ['a', 'c'], 5), ['b', 'd', 'e', 'a', 'c']);
  assert.deepEqual(moveTo(ids, ['c'], 2), ids);
  assert.deepEqual(moveTo(ids, ['c'], 3), ids);
});
