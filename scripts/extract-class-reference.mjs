// Takes the tools for time and the classroom out of Lernsachen-Heft.html,
// unchanged: Uhr, Timer and Datum (Regal › Zeit), the Multi-Timer, and
// Lärmampel, Applausometer and the Bilder-Stundenplan (with the ARASAAC
// pictures of its subjects, CC BY-NC-SA 4.0, saved to public/stundenplan/), and
// Das sprechende Kalenderblatt (with its drawings, saved to public/kalender/),
// and the Karte (tiles and address search through /api/karte).
// Individual top-level declarations are resolved like in
// extract-music-reference.mjs, so no editor or application code comes along.
//
//   node scripts/extract-class-reference.mjs
//
// Two things are changed on purpose: the weather (Open-Meteo) is asked through
// the school server (/api/wetter), so the devices of the children do not talk
// to an outside service; and the three Regal widgets are drawn by the part of
// the reference's widget switch that handles them (the other cases belong to
// tools taken over elsewhere).
import fs from 'node:fs/promises';
import ts from 'typescript';
import { transformSync } from 'esbuild';

const html = await fs.readFile('Lernsachen-Heft.html', 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).sort((a, b) => b.length - a.length);
let code = transformSync(scripts[0], { loader: 'js', minify: false }).code;

/** The text of a top-level function or variable in the (formatted) reference. */
function declaration(name) {
  const file = ts.createSourceFile('reference.js', code, ts.ScriptTarget.Latest, true);
  for (const statement of file.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name?.text === name) return statement.getText(file);
    if (ts.isVariableStatement(statement)) for (const d of statement.declarationList.declarations) if (ts.isIdentifier(d.name) && d.name.text === name) return d.getText(file);
  }
  throw Error('Missing reference symbol: ' + name);
}

// The widget switch HO, only with the cases of Regal › Zeit.
const ho = declaration('HO');
const cut = ho.indexOf('case `calendar`:');
if (cut < 0 || !ho.includes('case `clock`:') || !ho.includes('case `date`:')) throw Error('Widget switch (HO) not as expected.');
const classTime = ho.slice(0, cut).replace(/^function HO\(/, 'function classTime(') + '\n  }\n}';
// The base styles of the widgets (Zle) without the styles of the other tools.
const zle = declaration('Zle');
const head = zle.slice(zle.indexOf('`'), zle.indexOf('${lce}'));
if (!head.includes('.lh-wg-digits') || !head.includes('.lh-wg-timer.is-ringing')) throw Error('Widget styles (Zle) not as expected.');

code += `
${classTime}
var CLASS_CSS = ${head}\` + Ra + Sne + Kne + lce;
/* Tapping a widget (Xle of the reference, the cases of Regal › Zeit). */
function classTap(e, t) {
  if (e.kind === \`timer\`) { Vr(); pi(); }
  if (e.kind === \`timer\` && e.timer !== \`fixed\`) {
    dc();
    let n = SO.get(e.id), i = n && !n.done ? Math.max(0, n.end - Date.now()) / 6e4 : 0, r = Math.ceil(i / 5) * 5;
    r - i < 0.5 && (r += 5), r > 60 ? SO.delete(e.id) : wO(e, r);
    return;
  }
  let r = { onVoice: () => t?.classList.add(\`is-reading\`) };
  lc(xO(e), void 0, r).then(() => t?.classList.remove(\`is-reading\`));
}
/* One tick of a live widget (qle of the reference): the timer rings once at the end. */
function classTick(t, e) {
  if (e.kind === \`timer\`) {
    let n = SO.get(e.id);
    n && !n.done && n.end <= Date.now() && (n.done = !0, e.silent || hi(), t.classList.add(\`is-ringing\`), setTimeout(() => t.classList.remove(\`is-ringing\`), 3200));
  }
  classTime(t, e, !0, {});
}
/* “Neu starten” / “Ausschalten” of a timer (TO of the reference; we redraw ourselves). */
function classReset(e) { e.timer === \`fixed\` ? wO(e) : SO.delete(e.id); }
/* A fixed timer starts when the page is opened (Yle of the reference). */
function classStart(e) { e.kind === \`timer\` && e.timer === \`fixed\` && !SO.has(e.id) && wO(e); }
`;

const virtual = '/class-reference.js';
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
  classTime: 'renderTime', classTap: 'tapTime', classTick: 'tickTime', classStart: 'startTime', classReset: 'resetTimer', xO: 'timeSpeech', yO: 'dateText', CO: 'timerState',
  Ule: 'searchPlace', Hle: 'loadWeather', BO: 'weatherWord',
  Ia: 'renderMultiTimer', Ki: 'multiTimerConfig', La: 'multiTimerLabel', Ea: 'onMultiTimerChange', sa: 'stopMultiTimer', Hi: 'MULTI_TIMER_SOUNDS', Ui: 'MULTI_TIMER_START', Bi: 'MULTI_TIMER_COLORS', zi: 'MULTI_TIMER_NEXT_COLORS', Vi: 'MULTI_TIMER_ICONS',
  xne: 'renderApplause', um: 'applauseConfig', Rm: 'applauseLabel', Sm: 'applausePicture', om: 'APPLAUSE_WORDS', sm: 'APPLAUSE_SECONDS', une: 'NOISE_LIMITS', lNe: 'MIC_SENSITIVITY', bne: 'stopApplause',
  Wne: 'renderTimetable', Nh: 'timetableLabel', Gne: 'timetableSay', jh: 'timetableHtml', wh: 'timetableConfig', Ch: 'timetableStart', Eh: 'timetableTimes', Th: 'clockText', h6: 'TIMETABLE_SUBJECTS', g6: 'TIMETABLE_AFTER', yh: 'TIMETABLE_DESIGNS', gh: 'TIMETABLE_FONTS', Be: 'fontOf',
  YT: 'renderCalendar', sce: 'tapCalendar', cce: 'calendarLabel', eE: 'restartCalendar',
  Aw: 'renderMap', jw: 'mapLabel', gse: 'mapConfig', uw: 'mapStart', QC: 'mapDesign', ZC: 'MAP_DESIGNS', GC: 'MAP_SYMBOLS', JC: 'mapSymbol', zC: 'PATH_KINDS', BC: 'PATH_COLORS',
  rw: 'mapTiles', $C: 'toWorld', ew: 'fromWorld', tw: 'toView', nw: 'fromView', yw: 'mapMarks', vw: 'labelBoxes', ow: 'distanceText', aw: 'pathLength', iw: 'distance', U6: 'mapPicture', lDe: 'searchAddress', WC: 'tileUrl', VC: 'MAP_W', HC: 'MAP_DATA', UC: 'MAP_CREDIT',
  CLASS_CSS: 'CLASS_CSS',
};
let runtime = extract(Object.keys(aliases));
// Weather and place search through the school server (see /api/wetter).
const weather = [
  ['`https://api.open-meteo.com/v1/forecast?latitude=', '`/api/wetter?art=wetter&latitude='],
  ['`https://geocoding-api.open-meteo.com/v1/search?name=', '`/api/wetter?art=ort&name='],
];
for (const [from, to] of weather) {
  if (!runtime.includes(from)) throw Error('Weather address not found: ' + from);
  runtime = runtime.replace(from, to);
}
// Map tiles and the address search through the school server (see /api/karte).
const tilesBefore = runtime.match(/`https:\/\/tile\.openstreetmap\.(?:org|de)\/\$\{/g)?.length ?? 0;
if (tilesBefore !== 2) throw Error('Expected two tile addresses, found ' + tilesBefore);
runtime = runtime.replace(/`https:\/\/tile\.openstreetmap\.(org|de)\/\$\{(\w+)\}\/\$\{(\w+)\}\/\$\{(\w+)\}\.png`/g, '`/api/karte?quelle=$1&z=${$2}&x=${$3}&y=${$4}`');
if (!runtime.includes('`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=de&q=${')) throw Error('Address search not found.');
runtime = runtime.replace('`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=de&q=${', '`/api/karte?suche=${');
if (/https:\/\/(tile|nominatim)\.openstreetmap/.test(runtime)) throw Error('A direct map request is left.');
const omit = runtime.match(/credentials: `omit`/g)?.length ?? 0;
if (omit !== 2) throw Error('Expected two outside requests, found ' + omit);
runtime = runtime.replaceAll('credentials: `omit`', 'credentials: `same-origin`');
if (/https:\/\/[a-z-]*\.?open-meteo\.com\/v1/.test(runtime)) throw Error('A direct weather request is left.');
for (const [from, to] of Object.entries({ 'LH Andika': 'Andika', 'LH Nunito': 'Nunito', 'LH Grundschrift': 'Playwrite DE Grund', 'LH Schreibschrift SAS': 'Playwrite DE SAS', 'LH Schreibschrift': 'Playwrite DE VA', 'LH Druckschrift': 'Andika', 'LH Lexend': 'Lexend', 'LH Atkinson Hyperlegible': 'Atkinson Hyperlegible', 'LH Merriweather': 'Merriweather', 'LH Caveat': 'Caveat', 'LH Comic': 'Bangers' })) runtime = runtime.replaceAll(from, to);
await fs.writeFile('src/lib/reference/class-runtime.ts', `/* eslint-disable */
// @ts-nocheck
// Generated from Lernsachen-Heft.html by scripts/extract-class-reference.mjs:
// Uhr, Timer, Datum (Regal › Zeit) and the Multi-Timer of the reference,
// unchanged except that the weather is asked through /api/wetter.
${runtime}
export { ${Object.entries(aliases).map(([a, b]) => a === b ? a : a + ' as ' + b).join(', ')} };
`);
console.log('Class reference:', runtime.length, 'bytes');

// The pictures of the timetable subjects (pack “timetable-pictos”: ARASAAC id → WebP).
const pack = html.match(/<script type="text\/plain" id="lh-pack-timetable-pictos">([^<]*)<\/script>/);
if (!pack) throw Error('Picture pack timetable-pictos not found.');
await fs.mkdir('public/stundenplan', { recursive: true });
let pictures = 0;
for (const [id, url] of Object.entries(JSON.parse(pack[1]))) {
  const m = /^data:image\/webp;base64,([A-Za-z0-9+/=]+)$/.exec(url);
  if (!/^\d+$/.test(id) || !m) throw Error('Unexpected picture ' + id);
  await fs.writeFile(`public/stundenplan/${id}.webp`, Buffer.from(m[1], 'base64'));
  pictures++;
}
console.log('Timetable pictures:', pictures);

// The drawings of the calendar sheet (pack “calendar-pics”: name → {url, w, h}).
const calendar = html.match(/<script type="text\/plain" id="lh-pack-calendar-pics">([^<]*)<\/script>/);
if (!calendar) throw Error('Picture pack calendar-pics not found.');
await fs.mkdir('public/kalender', { recursive: true });
const slug = (name) => name.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const sizes = {};
for (const [name, pic] of Object.entries(JSON.parse(calendar[1]))) {
  const m = /^data:image\/webp;base64,([A-Za-z0-9+/=]+)$/.exec(pic.url);
  if (!m || !Number.isFinite(pic.w) || !Number.isFinite(pic.h)) throw Error('Unexpected picture ' + name);
  const src = `/kalender/${slug(name)}.webp`;
  await fs.writeFile('public' + src, Buffer.from(m[1], 'base64'));
  sizes[name] = { src, w: pic.w, h: pic.h };
}
await fs.writeFile('src/lib/reference/calendar-pictures.json', JSON.stringify(sizes, null, 1) + '\n');
console.log('Calendar pictures:', Object.keys(sizes).length);
