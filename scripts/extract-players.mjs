// Takes the players of Textsachen and Schiebesachen (Lernsachen.blog,
// CC BY-NC-SA 4.0) out of the published apps, unchanged, so the exercises run
// in the notebook without internet – the same players Lernsachen-Heft embeds.
//
//   curl -o /tmp/Textsachen.html https://majort0m0.github.io/Textsachen/Textsachen.html
//   curl -o /tmp/Schiebesachen.html https://majort0m0.github.io/Schiebesachen/Schiebesachen.html
//   node scripts/extract-players.mjs /tmp/Textsachen.html /tmp/Schiebesachen.html
//
// The apps carry each player as one string literal; it is found with the
// tokenizer only – nothing of the downloaded code is executed here.
// From Schiebesachen also the exercise builder of its “Neue Übung” dialog is
// taken (word list → Bild und Wort, Sortieren, …, Silbenlesen): the top-level
// declarations it needs, found by scope analysis, in their original order.
import fs from 'node:fs';
import * as acorn from 'acorn';
import * as scope from 'eslint-scope';

const targets = [
  { name: 'TSPlayer', app: 'Textsachen', out: 'src/lib/reference/textsachen-player.ts' },
  { name: 'DnDPlayer', app: 'Schiebesachen', out: 'src/lib/reference/schiebesachen-player.ts' },
];
const files = process.argv.slice(2);
if (files.length !== targets.length) throw Error('Aufruf: node scripts/extract-players.mjs Textsachen.html Schiebesachen.html');

targets.forEach(({ name, app, out }, i) => {
  const html = fs.readFileSync(files[i], 'utf8');
  const open = '<script type="module" crossorigin>';
  const start = html.indexOf(open) + open.length;
  const source = html.slice(start, html.indexOf('</script>', start));
  let player = null;
  for (const token of acorn.tokenizer(source, { ecmaVersion: 'latest', sourceType: 'module' })) {
    const value = token.type.label === 'string' || token.type.label === 'template' ? token.value : null;
    if (typeof value === 'string' && value.length > 100000 && value.includes(`var ${name}=`)) { player = value; break; }
  }
  if (!player || !player.startsWith(`/*! ${app} - Lizenz: CC BY-NC-SA 4.0`)) throw Error(`${name} nicht gefunden in ${files[i]}.`);
  fs.writeFileSync(out, `/* eslint-disable */
// ${name} – the player of ${app} by Lernsachen.blog (https://lernsachen.blog),
// licence CC BY-NC-SA 4.0, taken unchanged from
// https://majort0m0.github.io/${app}/${app}.html by scripts/extract-players.mjs.
// It runs inside the exercise frame (TextsachenFrame.tsx), never in the page.
export const ${name.toUpperCase()} = ${JSON.stringify(player)};
`);
  console.log(out, player.length);
});

// The builder of Schiebesachen: names in the minified app → our names.
const BUILDER = { kR: 'buildExercise', PL: 'parseText', IL: 'problemOf', FL: 'countOf', LL: 'pictureTerms', RL: 'pictureFallbacks', CL: 'FORMATS', CR: 'DESIGNS', wR: 'designOf', EL: 'syllablesOf', DL: 'plainWord', uc: 'FONTS' };
{
  const html = fs.readFileSync(files[1], 'utf8');
  const open = '<script type="module" crossorigin>';
  const start = html.indexOf(open) + open.length;
  const source = html.slice(start, html.indexOf('</script>', start));
  const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'module', ranges: true });
  const manager = scope.analyze(ast, { ecmaVersion: 2022, sourceType: 'module' });
  const moduleScope = manager.scopes.find((s) => s.type === 'module');
  const decls = new Map();
  for (const st of ast.body) {
    if (st.type === 'FunctionDeclaration') decls.set(st.id.name, { node: st, text: source.slice(st.start, st.end) });
    else if (st.type === 'VariableDeclaration') for (const d of st.declarations) if (d.id.type === 'Identifier') decls.set(d.id.name, { node: d, text: 'var ' + source.slice(d.start, d.end) + ';' });
  }
  const sorted = [...decls].sort((a, b) => a[1].node.start - b[1].node.start);
  const owner = (pos) => { let lo = 0, hi = sorted.length - 1; while (lo <= hi) { const mid = (lo + hi) >> 1, d = sorted[mid][1].node; if (pos < d.start) hi = mid - 1; else if (pos >= d.end) lo = mid + 1; else return sorted[mid][0]; } return null; };
  const deps = new Map();
  for (const v of moduleScope.variables) for (const ref of v.references) {
    const from = owner(ref.identifier.start);
    if (from && from !== v.name) (deps.get(from) || deps.set(from, new Set()).get(from)).add(v.name);
  }
  const need = new Set(), stack = Object.keys(BUILDER);
  while (stack.length) { const n = stack.pop(); if (need.has(n) || !decls.has(n)) continue; need.add(n); stack.push(...(deps.get(n) || [])); }
  const code = sorted.filter(([n]) => need.has(n)).map(([, d]) => d.text).join('\n');
  if (!code.includes('function kR(') || /fetch\(|localStorage|XMLHttpRequest/.test(code)) throw Error('Baukasten von Schiebesachen nicht wie erwartet.');
  const out = 'src/lib/reference/schiebesachen-builder.ts';
  fs.writeFileSync(out, `/* eslint-disable */
// @ts-nocheck
// The exercise builder of Schiebesachen by Lernsachen.blog (https://lernsachen.blog),
// licence CC BY-NC-SA 4.0 – the part of its “Neue Übung” dialog that turns a
// list (words, groups, pairs …) into an exercise for DnDPlayer. Taken unchanged
// from https://majort0m0.github.io/Schiebesachen/Schiebesachen.html by
// scripts/extract-players.mjs (only the declarations it needs). It contains the
// German hyphenation patterns (LPPL, see the licence text inside).
${code}
export { ${Object.entries(BUILDER).map(([a, b]) => `${a} as ${b}`).join(', ')} };
`);
  console.log(out, code.length, need.size);
}
