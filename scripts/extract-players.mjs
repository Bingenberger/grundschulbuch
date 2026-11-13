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
import fs from 'node:fs';
import * as acorn from 'acorn';

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
