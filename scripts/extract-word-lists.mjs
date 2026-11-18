// Takes the word lists of Lernsachen-Heft 1.47.3 (Lernsachen-Heft-komplett.html):
// Erste Wörter, Grundwortschatz Bayern 1/2, Deutsch als Zweitsprache and
// Beruf und Haushalt – each with its sections and the ARASAAC pictogram of a word.
//
//   node scripts/extract-word-lists.mjs
import fs from 'node:fs/promises';

const html = await fs.readFile('Lernsachen-Heft-komplett.html', 'utf8');
const start = html.indexOf('[{id:`erste`,name:`Erste Wörter`');
if (start < 0) throw Error('Word lists of the reference not found.');
// The list ends where the bracket that opened it closes.
let depth = 0, end = start, inTemplate = false;
for (; end < html.length; end++) {
  const c = html[end];
  if (c === '`') inTemplate = !inTemplate;
  if (inTemplate) continue;
  if (c === '[' || c === '{' || c === '(') depth++;
  if (c === ']' || c === '}' || c === ')') depth--;
  if (depth === 0) break;
}
const source = html.slice(start, end + 1);
// "Wort", "Wort:Piktogramm" or "Mehrzahl:PiktogrammxAnzahl" (the picture shown several times).
const parse = (text) => text.split(',').map((part) => part.trim()).filter(Boolean).map((part) => {
  const m = /^(.+?)(?::(\d+)(?:x(\d))?)?$/.exec(part);
  if (!m) throw Error(`Unexpected word entry: ${part}`);
  return { w: m[1].trim(), ...(m[2] ? { arasaac: Number(m[2]) } : {}), ...(m[3] ? { count: Number(m[3]) } : {}) };
});
const lists = [];
for (const list of source.matchAll(/\{id:`([a-z0-9-]+)`,name:`([^`]+)`,hint:`([^`]*)`,sections:\[([\s\S]*?)\]\}(?=,\{id:`|\]$)/g)) {
  const sections = [...list[4].matchAll(/\{name:`([^`]+)`,words:[\w$]+\(`([^`]*)`\)\}/g)].map((s) => ({ name: s[1], words: parse(s[2]) }));
  if (!sections.length) throw Error(`No sections in ${list[1]}.`);
  lists.push({ id: list[1], name: list[2], hint: list[3], sections });
}
if (lists.length !== 4) throw Error(`Expected four word lists, found ${lists.length}.`);
await fs.writeFile('src/lib/learning/reference-word-lists.json', JSON.stringify(lists, null, 1) + '\n');
console.log(lists.map((l) => `${l.name}: ${l.sections.length} Abschnitte, ${l.sections.reduce((n, s) => n + s.words.length, 0)} Wörter`).join('\n'));
