// Takes the interactive tools of Lernsachen-Heft 1.47.3 (Lernsachen-Heft-komplett.html)
// that are drawn by its new tool host (Uo of the reference: an SVG drawn into
// the element, taps on parts marked with data-a), unchanged:
//   – Hör-Memory and Was hörst du? (widget “listen”; built-in sounds are
//     synthesised, own recordings and pictures come from the school server).
// Individual top-level declarations are resolved like in
// extract-class-reference.mjs, so no editor or application code comes along.
//
//   node scripts/extract-tools-reference.mjs
//
// The minified names differ from the older file; each tool is found by its
// widget class (cls: `lh-ct-…`) and its catalogue entry, so a new build of the
// reference fails loudly instead of taking the wrong code.
import fs from 'node:fs/promises';
import ts from 'typescript';
import { transformSync } from 'esbuild';

const html = await fs.readFile('Lernsachen-Heft-komplett.html', 'utf8');
const main = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('lh-ct-listen') && s.includes('talk-book'));
if (!main) throw Error('Main module of Lernsachen-Heft-komplett.html not found.');
let code = transformSync(main, { loader: 'js', minify: false }).code;

const file = ts.createSourceFile('reference.js', code, ts.ScriptTarget.Latest, true);
const inits = new Map(), fns = new Map();
for (const statement of file.statements) {
  if (ts.isVariableStatement(statement)) for (const d of statement.declarationList.declarations) if (ts.isIdentifier(d.name) && d.initializer) inits.set(d.name.text, d.initializer.getText(file));
  if (ts.isFunctionDeclaration(statement) && statement.name) fns.set(statement.name.text, statement.getText(file));
}
const find = (what, test) => {
  const hits = [...inits.entries(), ...fns.entries()].filter(([, text]) => test(text)).map(([name]) => name);
  if (hits.length !== 1) throw Error(`${what}: expected one declaration, found ${hits.length} (${hits.slice(0, 5).join(', ')})`);
  return hits[0];
};

// Hör-Memory / Was hörst du?
const listenHost = find('listen host', t => t.startsWith('Uo({ cls: `lh-ct-listen`'));
const listenDraw = find('listen draw', t => t === `${listenHost}.draw`);
const listenLabel = find('listen label', t => t.includes('H\\xF6r-Memory: Tippe auf die Karten'));
const listenConfig = find('listen config', t => t.startsWith('function') && t.includes('r10.set === `instruments` || r10.set === `own`'));
const listenReset = find('listen reset', t => /^function \w+\(e17\) \{\s*\w+\.delete\(e17\), \w+\.redraw\(e17\);\s*\}$/.test(t) && t.includes(`${listenHost}.redraw`));
const listenStop = find('listen stop', t => /^function \w+\(\) \{\s*(\w+)\?\.\(\), \1 = null;\s*\}$/.test(t));
const fxList = find('listen sounds', t => t.startsWith('[{ id: `rain`, label: `Regen`'));
const instrumentList = find('listen instruments', t => t.startsWith('[{ id: `piano`') && t.includes('id: `drum`, label: `Trommel`'));
// The sound player and the sound pictures, as the settings dialog of the reference uses them.
const listenDialog = find('listen dialog', t => t.startsWith('function') && t.includes('H\\xF6r-Memory und Was h\\xF6rst du?'));
const fxPlay = /\? (\w+)\(e18, 2\.5\) :/.exec(fns.get(listenDialog))?.[1];
const fxPicture = new RegExp(`${fxList}\\.map\\(\\(e18\\) => \\(\\{ id: e18\\.id, label: e18\\.label, src: (\\w+)\\(e18\\.id\\)`).exec(fns.get(listenDialog))?.[1];
if (!fxPlay || !fxPicture) throw Error('Sound player or pictures of the listen dialog not found.');
const toolCss = find('tool styles', t => t.startsWith('`\n.lh-ls{position:absolute;inset:0;overflow:hidden}'));

code += `
var TOOLS_CSS = ${toolCss};
`;

const virtual = '/tools-reference.js';
const host = ts.createCompilerHost({ allowJs: true, noLib: true });
host.getSourceFile = name => name === virtual ? ts.createSourceFile(name, code, ts.ScriptTarget.Latest, true) : undefined;
host.fileExists = name => name === virtual;
host.readFile = name => name === virtual ? code : undefined;
const program = ts.createProgram([virtual], { allowJs: true, noLib: true }, host), checker = program.getTypeChecker(), source = program.getSourceFile(virtual);
const definitions = new Map(), names = new Map();
for (const statement of source.statements) {
  const nodes = ts.isVariableStatement(statement) ? statement.declarationList.declarations : ts.isFunctionDeclaration(statement) ? [statement] : [];
  for (const node of nodes) {
    if (!node.name || !ts.isIdentifier(node.name)) continue;
    const symbol = checker.getSymbolAtLocation(node.name);
    definitions.set(symbol, node); names.set(node.name.text, symbol);
  }
}
function extract(roots) {
  const seen = new Set();
  function visit(symbol) {
    if (seen.has(symbol) || !definitions.has(symbol)) return;
    seen.add(symbol);
    function walk(node) {
      if (ts.isIdentifier(node)) { const dependency = checker.getSymbolAtLocation(node); if (dependency !== symbol) visit(dependency); }
      ts.forEachChild(node, walk);
    }
    walk(definitions.get(symbol));
  }
  for (const name of roots) { if (!names.has(name)) throw Error('Missing reference symbol: ' + name); visit(names.get(name)); }
  return [...seen].map(s => definitions.get(s)).sort((a, b) => a.pos - b.pos).map(n => ts.isVariableDeclaration(n) ? 'var ' + n.getText(source) + ';' : n.getText(source)).join('\n');
}

const aliases = {
  [listenDraw]: 'renderListen', [listenLabel]: 'listenLabel', [listenConfig]: 'listenConfig', [listenReset]: 'resetListen', [listenStop]: 'stopListen',
  [fxList]: 'LISTEN_SOUNDS', [instrumentList]: 'LISTEN_INSTRUMENTS', [fxPlay]: 'playListenSound', [fxPicture]: 'listenSoundPicture',
  TOOLS_CSS: 'TOOLS_CSS',
};
let runtime = extract(Object.keys(aliases));
if (/https?:\/\//.test(runtime.replace(/http:\/\/www\.w3\.org\/[\w/]+/g, ''))) throw Error('The tools would reach an outside address.');
for (const [from, to] of Object.entries({ 'LH Andika': 'Andika', 'LH Nunito': 'Nunito', 'LH Grundschrift': 'Playwrite DE Grund', 'LH Schreibschrift SAS': 'Playwrite DE SAS', 'LH Schreibschrift': 'Playwrite DE VA', 'LH Druckschrift': 'Andika', 'LH Lexend': 'Lexend', 'LH Atkinson Hyperlegible': 'Atkinson Hyperlegible', 'LH Merriweather': 'Merriweather', 'LH Caveat': 'Caveat', 'LH Comic': 'Bangers' })) runtime = runtime.replaceAll(from, to);
await fs.writeFile('src/lib/reference/tools-runtime.ts', `/* eslint-disable */
// @ts-nocheck
// Generated from Lernsachen-Heft-komplett.html (1.47.3) by scripts/extract-tools-reference.mjs:
// the tools drawn by the reference's tool host, unchanged.
${runtime}
export { ${Object.entries(aliases).map(([a, b]) => a === b ? a : a + ' as ' + b).join(', ')} };
`);
console.log('Tools reference:', runtime.length, 'bytes');
