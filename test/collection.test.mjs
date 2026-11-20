import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/collection.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent' });
const mod = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
const { shelfCategory, shelfName } = mod.exports;

const figure = (name) => ({ type: 'widget', widgetKind: 'figur', settings: { av: { name } } });
const photo = (text) => ({ type: 'widget', widgetKind: 'sprechfoto', settings: { say: { text } } });

test('Sammlung wie das Regal der Vorlage: Figuren und Fotos unter „Selbst gemacht“', () => {
  assert.equal(shelfCategory([figure('Mia')]), 'made');
  assert.equal(shelfCategory([figure('Mia'), photo('Hallo')]), 'made');
  assert.equal(shelfCategory([figure('Mia'), { type: 'image', alt: 'Hund' }]), 'personal');
  assert.equal(shelfCategory([{ type: 'widget', widgetKind: 'mathtool', settings: {} }]), 'personal');
  assert.equal(shelfCategory([]), 'personal');
});

test('Vorgeschlagener Name wie in der Vorlage', () => {
  assert.equal(shelfName([figure(' Herr Ober ')]), 'Herr Ober');
  assert.equal(shelfName([figure('')]), 'Meine Figur');
  assert.equal(shelfName([photo('Hallo, ich bin der Igel. Ich schlafe im Winter.')]), 'Hallo, ich bin der Igel.');
  assert.equal(shelfName([photo('')]), 'Sprechendes Foto');
  assert.equal(shelfName([figure('A'), figure('B'), figure('C')]), 'Figur (3 Teile)');
  assert.equal(shelfName([figure('A'), { type: 'image' }]), 'Figur und Bild');
  assert.equal(shelfName([{ type: 'image', alt: 'Hund' }]), 'Hund');
});
