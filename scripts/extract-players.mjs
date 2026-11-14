// Takes the players of Textsachen, Schiebesachen and Quizsachen (Lernsachen.blog,
// CC BY-NC-SA 4.0) out of the published apps, unchanged, so the exercises run
// in the notebook without internet – the same players Lernsachen-Heft embeds.
//
//   curl -o /tmp/Textsachen.html https://majort0m0.github.io/Textsachen/Textsachen.html
//   curl -o /tmp/Schiebesachen.html https://majort0m0.github.io/Schiebesachen/Schiebesachen.html
//   curl -o /tmp/Quizsachen.html https://majort0m0.github.io/Quizsachen/Quizsachen.html
//   node scripts/extract-players.mjs /tmp/Textsachen.html /tmp/Schiebesachen.html /tmp/Quizsachen.html
//
// The apps carry each player as one string literal; it is found with the
// tokenizer only – nothing of the downloaded code is executed here.
// From Schiebesachen also the exercise builder of its “Neue Übung” dialog is
// taken (word list → Bild und Wort, Sortieren, …, Silbenlesen), from Quizsachen
// the reader of “Fragen per Text eingeben” with the built-in templates: the
// top-level declarations they need, found by scope analysis, in their original
// order.
import fs from 'node:fs';
import * as acorn from 'acorn';
import * as scope from 'eslint-scope';

const targets = [
  { name: 'TSPlayer', app: 'Textsachen', out: 'src/lib/reference/textsachen-player.ts' },
  { name: 'DnDPlayer', app: 'Schiebesachen', out: 'src/lib/reference/schiebesachen-player.ts' },
  { name: 'QuizPlayer', app: 'Quizsachen', out: 'src/lib/reference/quizsachen-player.ts' },
];
const files = process.argv.slice(2);
if (files.length !== targets.length) throw Error('Aufruf: node scripts/extract-players.mjs Textsachen.html Schiebesachen.html Quizsachen.html');

const appSource = (file) => {
  const html = fs.readFileSync(file, 'utf8');
  const open = '<script type="module" crossorigin>';
  const start = html.indexOf(open) + open.length;
  return html.slice(start, html.indexOf('</script>', start));
};

targets.forEach(({ name, app, out }, i) => {
  const source = appSource(files[i]);
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
// It runs inside the exercise frame (PlayerFrame.tsx), never in the page.
export const ${name.toUpperCase()} = ${JSON.stringify(player)};
`);
  console.log(out, player.length);
});

/** The top-level declarations `names` need (minified name → our name), in their order. */
function declarations(source, names) {
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
  const need = new Set(), stack = Object.keys(names);
  while (stack.length) { const n = stack.pop(); if (need.has(n) || !decls.has(n)) continue; need.add(n); stack.push(...(deps.get(n) || [])); }
  const code = sorted.filter(([n]) => need.has(n)).map(([, d]) => d.text).join('\n');
  if (/fetch\(|localStorage|XMLHttpRequest|indexedDB/.test(code)) throw Error('Der Baukasten greift auf Netz oder Speicher zu – bitte prüfen.');
  return { code, count: need.size, exports: `export { ${Object.entries(names).map(([a, b]) => `${a} as ${b}`).join(', ')} };` };
}

// The builder of Schiebesachen: names in the minified app → our names.
const BUILDER = { kR: 'buildExercise', PL: 'parseText', IL: 'problemOf', FL: 'countOf', LL: 'pictureTerms', RL: 'pictureFallbacks', CL: 'FORMATS', CR: 'DESIGNS', wR: 'designOf', EL: 'syllablesOf', DL: 'plainWord', uc: 'FONTS' };
{
  // The names change with each build of the app: if they no longer lead to the
  // builder, the file stays as it is (look the new names up by hand).
  const { code, count, exports } = declarations(appSource(files[1]), BUILDER);
  const out = 'src/lib/reference/schiebesachen-builder.ts';
  if (!/function kR\(e,t,n\)\{if\(e===`buchstabieren`/.test(code) || !code.includes('var CL=[{id:`bildwort`'))
    console.warn(`${out} bleibt unverändert: Die Namen in BUILDER passen nicht mehr zu dieser Fassung von Schiebesachen.`);
  else {
    fs.writeFileSync(out, `/* eslint-disable */
// @ts-nocheck
// The exercise builder of Schiebesachen by Lernsachen.blog (https://lernsachen.blog),
// licence CC BY-NC-SA 4.0 – the part of its “Neue Übung” dialog that turns a
// list (words, groups, pairs …) into an exercise for DnDPlayer. Taken unchanged
// from https://majort0m0.github.io/Schiebesachen/Schiebesachen.html by
// scripts/extract-players.mjs (only the declarations it needs). It contains the
// German hyphenation patterns (LPPL, see the licence text inside).
${code}
${exports}
`);
    console.log(out, code.length, count);
  }
}

// The quiz builder of Quizsachen: the built-in templates (“Neues Quiz”), the
// reader of “Fragen per Text eingeben” (Quizsachen format, GIFT, Aiken) and the
// step that turns a read question into a question of the quiz.
const QUIZ = { Nf: 'newQuiz', kf: 'TEMPLATES', yg: 'readQuestions', zg: 'questionFrom', Fg: 'EXAMPLE', Ug: 'TYPES' };
{
  const { code, count, exports } = declarations(appSource(files[2]), QUIZ);
  const out = 'src/lib/reference/quizsachen-builder.ts';
  if (!code.includes('function Nf(e){let t=Af(e)??kf[0]') || !/function zg\(e,t,n,r,i\)/.test(code) || !code.includes('var Fg=`Titel: Tiere im Wald') || !code.includes('var kf=[{id:`leer`'))
    console.warn(`${out} bleibt unverändert: Die Namen in QUIZ passen nicht mehr zu dieser Fassung von Quizsachen.`);
  else {
    fs.writeFileSync(out, `/* eslint-disable */
// @ts-nocheck
// The quiz builder of Quizsachen by Lernsachen.blog (https://lernsachen.blog),
// licence CC BY-NC-SA 4.0 – the built-in templates of “Neues Quiz” and the
// reader of “Fragen per Text eingeben”, which make a quiz for QuizPlayer.
// Taken unchanged from https://majort0m0.github.io/Quizsachen/Quizsachen.html
// by scripts/extract-players.mjs (only the declarations they need).
${code}
${exports}
`);
    console.log(out, code.length, count);
  }
}
