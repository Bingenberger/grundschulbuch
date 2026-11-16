// Takes the interactive tools of Lernsachen-Heft 1.47.3 (Lernsachen-Heft-komplett.html)
// that are drawn by its new tool host (Uo of the reference: an SVG drawn into
// the element, taps on parts marked with data-a), unchanged, together with the
// page presets of their catalogue entries.
// Individual top-level declarations are resolved like in
// extract-class-reference.mjs, so no editor or application code comes along.
//
//   node scripts/extract-tools-reference.mjs
//
// The minified names differ from the older file; each tool is found by its
// widget class (cls: `lh-ct-…`), its view function and the place where the
// reference saves what was tapped – so a new build of the reference fails
// loudly instead of taking the wrong code.
//
// One change on purpose: tools that work together on a page (Glücksrad counts
// into the Strichliste) look for their page as `.lh-page`; ours is the
// interaction surface or the paper.
import fs from 'node:fs/promises';
import ts from 'typescript';
import { transformSync } from 'esbuild';

/** Tool (widget class) → catalogue widget kind of the reference. */
const TOOLS = {
  listen: 'listen',
  tally: 'tally',
  spin: 'spinner',
  seek: 'seek',
  pattern: 'pattern',
};

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
const escape = (name) => name.replace(/\$/g, '\\$');

// What the reference does when a tool saves its state (counts, ticks, …):
// Setter((id, a, b) => { …; item.<field> = { ...item.<field>, key: a, key2: b } })
const savers = new Map();
for (const m of code.matchAll(/(?:^|\), )([\w$]+)\(\(e17, t10(?:, n10)?\) => \{\n\s+\w+\(\((\w+)\) => \{\n\s+let (\w+) = \w+\(\2, e17\);\n\s+\3\?\.type === `widget` && \3\.(\w+) && \(\3\.\4 = \{ \.\.\.\3\.\4, ([^}]+) \}\);/gm)) {
  const keys = m[5].split(', ').map(part => /^(\w+): (t10|n10)$/.exec(part));
  if (keys.some(k => !k)) throw Error('Unexpected saver for ' + m[4]);
  savers.set(m[4], { setter: m[1], keys: keys.sort((a, b) => a[2].localeCompare(b[2]) * -1).map(k => k[1]) });
}

const registry = [];
const aliases = {};
for (const [cls, kind] of Object.entries(TOOLS)) {
  const host = find(`${cls} host`, t => t.startsWith(`Uo({ cls: \`lh-ct-${cls}\``));
  const draw = find(`${cls} draw`, t => t === `${host}.draw`);
  const spec = inits.get(host);
  const view = /view: ([\w$]+)/.exec(spec)?.[1], label = /label: ([\w$]+)/.exec(spec)?.[1];
  const viewText = fns.get(view);
  if (!viewText || !label) throw Error(`${cls}: view or label not found.`);
  const call = /([\w$]+)\(e17\.(\w+)\b/.exec(viewText);
  if (!call) throw Error(`${cls}: settings of the view not found.`);
  const [, config, field] = call;
  const saver = savers.get(field);
  // What the reference calls after new settings, to start the tool afresh.
  const resets = [...fns.values()].filter(t => t.startsWith('async function') && (t.includes(`{ ${field}: t10 }`) || t.includes(`.${field} = n10`))).map(t => /[(\s]([\w$]+)\(e17\.id\)[,;]/.exec(t)?.[1]).filter(Boolean);
  const reset = [...new Set(resets)];
  if (reset.length > 1) throw Error(`${cls}: several resets (${reset.join(', ')}).`);
  registry.push(`${JSON.stringify(cls)}: { kind: ${JSON.stringify(kind)}, field: ${JSON.stringify(field)}, draw: ${draw}, label: ${label}, config: (raw, media) => ${config}(raw, media, media), redraw: ${host}.redraw${reset.length ? `, reset: ${reset[0]}` : ''}${saver ? `, register: ${saver.setter}, state: ${JSON.stringify(saver.keys)}` : ''} }`);
  if (cls === 'listen') Object.assign(aliases, { [draw]: 'renderListen', [label]: 'listenLabel', [config]: 'listenConfig' });
}

// Hör-Memory / Was hörst du? also needs its sounds and their pictures in the settings.
const listenHost = find('listen host', t => t.startsWith('Uo({ cls: `lh-ct-listen`'));
const listenReset = find('listen reset', t => /^function [\w$]+\(e17\) \{\s*[\w$]+\.delete\(e17\), [\w$]+\.redraw\(e17\);\s*\}$/.test(t) && t.includes(`${listenHost}.redraw`));
const listenStop = find('listen stop', t => /^function [\w$]+\(\) \{\s*([\w$]+)\?\.\(\), \1 = null;\s*\}$/.test(t));
const fxList = find('listen sounds', t => t.startsWith('[{ id: `rain`, label: `Regen`'));
const instrumentList = find('listen instruments', t => t.startsWith('[{ id: `piano`') && t.includes('id: `drum`, label: `Trommel`'));
const listenDialog = find('listen dialog', t => t.startsWith('function') && t.includes('H\\xF6r-Memory und Was h\\xF6rst du?'));
const fxPlay = /\? ([\w$]+)\(e18, 2\.5\) :/.exec(fns.get(listenDialog))?.[1];
const fxPicture = new RegExp(`${escape(fxList)}\\.map\\(\\(e18\\) => \\(\\{ id: e18\\.id, label: e18\\.label, src: ([\\w$]+)\\(e18\\.id\\)`).exec(fns.get(listenDialog))?.[1];
if (!fxPlay || !fxPicture) throw Error('Sound player or pictures of the listen dialog not found.');
Object.assign(aliases, { [listenReset]: 'resetListen', [listenStop]: 'stopListen', [fxList]: 'LISTEN_SOUNDS', [instrumentList]: 'LISTEN_INSTRUMENTS', [fxPlay]: 'playListenSound', [fxPicture]: 'listenSoundPicture' });

// The choices of the settings dialogs of the Mathe tools (taken from the dialogs themselves).
const dialog = (title) => fns.get(find(`${title} dialog`, t => t.startsWith('function') && t.includes(`title: \`${title}\`, `) && t.includes('close: () => e17.close(null)')));
const pick = (what, text, re) => { const m = re.exec(text); if (!m) throw Error(what + ' not found.'); return m[1]; };
const seekText = dialog('Suchbild'), patternText = dialog('Muster fortsetzen'), spinText = dialog('Gl\\xFCcksrad und W\\xFCrfel');
Object.assign(aliases, {
  [pick('seek shapes', seekText, /\.\.\.([\w$]+)\.map\(\(e18\) => \(\{ id: e18\.id, label: e18\.plural \}\)\)/)]: 'SEEK_SHAPES',
  [pick('seek colours', seekText, /([\w$]+)\.find\(\(e18\) => e18\.id === t10\.color\)\?\.hex/)]: 'SEEK_COLORS',
  [pick('seek pictures', seekText, /src: ([\w$]+)\(e18\.id, e18\.id === `any`/)]: 'seekPicture',
  [pick('pattern rules', patternText, /children: ([\w$]+)\.map\(\(e18\) => z\(`button`, \{ type: `button`, class: `math-chip math-level/)]: 'PATTERN_RULES',
  [pick('spinner presets', spinText, /children: ([\w$]+)\.map\(\(\[e18, t11\]\) => z\(`button`/)]: 'SPIN_PRESETS',
  [pick('tally colours', fns.get(/^\(raw, media\) => ([\w$]+)\(/.exec(registry.find(r => r.startsWith('"tally"')).match(/config: (.*?), redraw/)[1])[1]), /: ([\w$]+)\[n11 % \1\.length\]/)]: 'TALLY_COLORS',
  [pick('spinner colours', fns.get(/^\(raw, media\) => ([\w$]+)\(/.exec(registry.find(r => r.startsWith('"spin"')).match(/config: (.*?), redraw/)[1])[1]), /: ([\w$]+)\[t11 % \1\.length\]/)]: 'SPIN_COLORS',
});

const toolCss = find('tool styles', t => t.startsWith('`\n.lh-ls{position:absolute;inset:0;overflow:hidden}'));

// The catalogue entries of these tools: their pages are the presets.
const kinds = new Set(Object.values(TOOLS));
const entries = [];
(function walk(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const prop = (name) => node.properties.find(p => ts.isPropertyAssignment(p) && p.name.getText(file) === name);
    const items = prop('items')?.initializer.getText(file) ?? '';
    if (prop('id') && prop('group') && [...kinds].some(k => items.includes(`kind: \`${k}\``))) entries.push(node.getText(file));
  }
  ts.forEachChild(node, walk);
})(file);

code += `
var TOOLS_CSS = ${toolCss};
var TOOL_REGISTRY = { ${registry.join(',\n  ')} };
var TOOL_CATALOG = [${entries.join(',\n')}];
`;
Object.assign(aliases, { TOOLS_CSS: 'TOOLS_CSS', TOOL_REGISTRY: 'TOOL_REGISTRY' });

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

let runtime = extract(Object.keys(aliases));
if (/https?:\/\//.test(runtime.replace(/http:\/\/www\.w3\.org\/[\w/]+/g, ''))) throw Error('The tools would reach an outside address.');
const pages = runtime.match(/\.closest\(`\.lh-page`\)/g)?.length ?? 0;
runtime = runtime.replaceAll('.closest(`.lh-page`)', '.closest(`.lh-page, .interaction-surface, .paper`)');
for (const [from, to] of Object.entries({ 'LH Andika': 'Andika', 'LH Nunito': 'Nunito', 'LH Grundschrift': 'Playwrite DE Grund', 'LH Schreibschrift SAS': 'Playwrite DE SAS', 'LH Schreibschrift': 'Playwrite DE VA', 'LH Druckschrift': 'Andika', 'LH Lexend': 'Lexend', 'LH Atkinson Hyperlegible': 'Atkinson Hyperlegible', 'LH Merriweather': 'Merriweather', 'LH Caveat': 'Caveat', 'LH Comic': 'Bangers' })) runtime = runtime.replaceAll(from, to);
await fs.writeFile('src/lib/reference/tools-runtime.ts', `/* eslint-disable */
// @ts-nocheck
// Generated from Lernsachen-Heft-komplett.html (1.47.3) by scripts/extract-tools-reference.mjs:
// the tools drawn by the reference's tool host, unchanged (page lookup: see the script).
${runtime}
export { ${Object.entries(aliases).map(([a, b]) => a === b ? a : a + ' as ' + b).join(', ')} };
`);

// Presets: the catalogue entries with their items (as the reference creates them).
const catalogCode = extract(['TOOL_CATALOG']);
const { TOOL_CATALOG } = await import('data:text/javascript;base64,' + Buffer.from(catalogCode + '\nexport { TOOL_CATALOG };').toString('base64'));
const presets = TOOL_CATALOG.map(meta => ({ id: meta.id, title: meta.label, group: meta.group, items: meta.items().map(item => { const copy = { ...item }; delete copy.id; return copy; }) }));
await fs.writeFile('src/lib/learning/werkzeug-presets.json', JSON.stringify(presets, null, 1) + '\n');
console.log('Tools reference:', runtime.length, 'bytes;', Object.keys(TOOLS).length, 'tools;', presets.length, 'presets;', pages, 'page lookups;', [...savers.keys()].length, 'savers found');
