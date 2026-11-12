import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/reference/keys.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { encodeKey, decodeKey, encodeMaps, decodeMaps } = mod.exports;

test('Schlüssel mit Umlauten werden umkehrbar gespeichert', () => {
  for (const k of ['ä', 'ß', 'äu', 'mä', 'a', 'sch', 'a2', 'k-61']) assert.equal(decodeKey(encodeKey(k)), k);
  assert.equal(encodeKey('sch'), 'sch');
  assert.match(encodeKey('ä'), /^[a-zA-Z][a-zA-Z0-9_-]*$/);
  const s = { keys: { ä: { word: 'Käse' }, m: { word: 'Maus' } }, other: { ä: 1 } };
  const e = encodeMaps(s, ['keys']);
  assert.ok(Object.keys(e.keys).every((k) => /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(k)));
  assert.deepEqual(e.other, { ä: 1 });
  assert.deepEqual(decodeMaps(e, ['keys']), s);
});
