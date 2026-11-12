import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lockedDesign } from '../src/lib/learning/validation.mjs';

test('Eintippkästchen: Kinder dürfen die Antwort ändern, nicht aber Lage oder Aussehen', () => {
  const box = { id: 'a', type: 'text', text: '', placeholder: ' ', locked: true, x: 10, y: 20, width: 12, height: 8, font: 'Andika', fontSize: 20 };
  assert.equal(JSON.stringify(lockedDesign({ ...box, text: '17' })), JSON.stringify(lockedDesign(box)));
  assert.notEqual(JSON.stringify(lockedDesign({ ...box, x: 11 })), JSON.stringify(lockedDesign(box)));
  // Ordinary locked text stays unchangeable.
  const plain = { ...box, placeholder: undefined };
  delete plain.placeholder;
  assert.notEqual(JSON.stringify(lockedDesign({ ...plain, text: '17' })), JSON.stringify(lockedDesign(plain)));
});
