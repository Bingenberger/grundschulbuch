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
  body: 'body',
  budget: 'budget',
  check: 'check',
  circles: 'circles',
  machine: 'machine',
  mood: 'mood',
  phone: 'phone',
  pieces: 'pieces',
  practice: 'practice',
  rating: 'rating',
  sort: 'sort',
  steps: 'steps',
  stress: 'stress',
  timeline: 'timeline',
  traffic: 'traffic',
  vote: 'vote',
  week: 'week',
  kipartner: 'kipartner',
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

// Nähe und Distanz keeps the ring of each person: people[i].ring = t10[i].
for (const m of code.matchAll(/(?:^|\), )([\w$]+)\(\(e17, t10\) => \{\n\s+\w+\(\((\w+)\) => \{\n\s+let (\w+) = \w+\(\2, e17\);\n\s+\3\?\.type === `widget` && \3\.(\w+) && \(\3\.\4 = \{ \.\.\.\3\.\4, people: \3\.\4\.people\.map\(/gm))
  savers.set(m[4], { setter: m[1], keys: ['rings'] });

// KI-Partner keeps the parts the child chose: hook?.(id, { ...state.parts }),
// set by a register function of its own.
{
  const hook = /([\w$]+)\?\.\(e17, \{ \.\.\.t10\.parts \}\)/.exec(code)?.[1];
  if (!hook) throw Error('KI-Partner: save hook not found.');
  savers.set('kp', { setter: find('kipartner register', t => new RegExp(`^function [\\w$]+\\(e17\\) \\{\\s*${escape(hook)} = e17;\\s*\\}$`).test(t)), keys: ['parts'] });
}

const registry = [];
const aliases = {};
for (const [cls, kind] of Object.entries(TOOLS)) {
  const host = find(`${cls} host`, t => t.startsWith(`Uo({ cls: \`lh-ct-${cls}\``));
  const draw = find(`${cls} draw`, t => t === `${host}.draw`);
  const spec = inits.get(host);
  const view = /view: ([\w$]+)/.exec(spec)?.[1], label = /label: ([\w$]+)/.exec(spec)?.[1];
  // The view is a function of its own or written into the tool (Fußgängerampel).
  const viewText = view ? fns.get(view) : /view\(e17, t10\) \{/.test(spec) ? spec : undefined;
  if (!viewText || !label) throw Error(`${cls}: view or label not found.`);
  // The settings: what the view cleans first – or, if the view leaves that to
  // helpers (Fußgängerampel), what its settings dialog opens with.
  const call = /([\w$]+)\(e17\.(?!id\b|w\b|h\b)(\w+)\b/.exec(viewText) ?? new RegExp(`old: ([\\w$]+)\\(e17\\.(${cls})\\)`).exec(code);
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

// The choices of the other dialogs (presets, feelings, partners, colours).
const chips = /class: `ins-chips`, children: ([\w$]+)\.map\(/;
const moodText = dialog('Wie geht es dir heute?'), checkText = dialog('Checkliste'), stepsText = dialog('Ablaufplan'), practiceText = dialog('Gespr\\xE4che \\xFCben'), stressText = dialog('Stressbarometer'), ratingText = dialog('Selbst- und Fremdeinsch\\xE4tzung');
Object.assign(aliases, {
  [pick('feelings', moodText, /children: ([\w$]+)\.map\(\(e18\) => z\(`button`, \{ type: `button`, "aria-pressed": t10\.feels/)]: 'MOOD_FEELS',
  [pick('feeling pictures', moodText, /z\(`img`, \{ src: ([\w$]+)\(e18\.id\)/)]: 'moodPicture',
  [pick('check lists', checkText, chips)]: 'CHECK_PRESETS',
  [pick('step plans', stepsText, chips)]: 'STEPS_PRESETS',
  [pick('step colours', stepsText, /label: `Farbe`, value: \w+, colors: ([\w$]+),/)]: 'STEPS_COLORS',
  [pick('conversations', practiceText, chips)]: 'PRACTICE_PRESETS',
  [pick('partners', practiceText, /options: ([\w$]+), onChange: \(e18\) => \w+\(\{ partner: e18 \}\)/)]: 'PRACTICE_PARTNERS',
  [pick('stress ideas', stressText, /\(([\w$]+)\.map\(\(\[e18, , t11\]\) =>/)]: 'STRESS_IDEAS',
  [pick('rating lists', ratingText, /children: ([\w$]+)\.map\(\(e18\) => z\(`button`, \{ type: `button`, class: `math-chip`, onClick: \(\) => \w+\(e18\.items/)]: 'RATING_PRESETS',
});

// Nähe und Distanz and Wochenplan: ring sets and colours, weekdays, the plan of each mode.
const configOf = (cls) => fns.get(/config: \(raw, media\) => ([\w$]+)\(/.exec(registry.find(r => r.startsWith(`"${cls}"`)))[1]);
const circlesConfig = configOf('circles'), weekConfig = configOf('week');
Object.assign(aliases, {
  [pick('ring sets', circlesConfig, /r10\.length >= 2 \? r10 : ([\w$]+)\[0\]/)]: 'CIRCLE_RINGS',
  [pick('ring colours', circlesConfig, /: ([\w$]+)\[t11 % \1\.length\]/)]: 'CIRCLE_COLORS',
  [pick('weekdays', weekConfig, /i10 = ([\w$]+)\.map\(\(e18, t11\) =>/)]: 'WEEK_DAYS',
  [pick('week plans', fns.get(find('week dialog', t => t.startsWith('function') && t.includes('`Dienstplan` : `Wochenplan`') && t.includes('close: () => e17.close(null)'))), /title: t10\.title === ([\w$]+)\(t10\.mode\)\.title/)]: 'weekStart',
});

// Geld-Planer and Automat: the start of each kind, the machines, and how the
// Geld-Planer saves what is filled in on the page (with pictures).
const budgetText = dialog('Geld-Planer'), machineText = dialog('Automat');
const budgetHook = pick('budget hook', code, /([\w$]+) && \1\.save\(e17, t10, n10\)/);
Object.assign(aliases, {
  [pick('budget start', budgetText, /t10 === ([\w$]+)\(r10\)\.title/)]: 'budgetStart',
  [find('budget register', t => new RegExp(`^function [\\w$]+\\(e17\\) \\{\\s*${escape(budgetHook)} = e17;\\s*\\}$`).test(t))]: 'registerBudget',
  [pick('machines', machineText, /options: ([\w$]+)\.map\(\(e18\) => \(\{ value: e18\.id, label: e18\.label \}\)\)/)]: 'MACHINE_KINDS',
  [pick('machine start', machineText, /let a11 = ([\w$]+)\(e18\);/)]: 'machineStart',
});

// Linksammlung (also “Nachrichten in leichter Sprache”): a widget of its own,
// drawn as HTML; a tap on a link opens it in a new window (the host checks
// first whether links to the internet are allowed).
const bmDraw = pick('bookmarks render', code, /case `bookmarks`:\s*([\w$]+)\(e17, t10, n10, r10\);/);
const bmDialog = fns.get(find('bookmarks dialog', t => t.startsWith('function') && t.includes('Lernpfad: der Reihe nach')));
Object.assign(aliases, {
  [bmDraw]: 'renderBookmarks',
  [pick('bookmarks label', code, /case `bookmarks`:\s*return ([\w$]+)\(e17\);/)]: 'bookmarksLabel',
  [pick('bookmarks config', fns.get(bmDraw), /t10\.bm \? ([\w$]+)\(t10\.bm/)]: 'bookmarksConfig',
  [find('bookmarks tap', t => t.startsWith('function') && t.includes('[data-a="reset"]') && t.includes('.links[a10]') && t.includes('window.open('))]: 'tapBookmarks',
  [find('bookmarks styles', t => t.startsWith('`\n.lh-bm{'))]: 'BOOKMARKS_CSS',
  [pick('bookmark layouts', bmDialog, /options: ([\w$]+), onChange: \w+ \}\), z\(`h3`, \{ children: `Farbe` \}\)/)]: 'BOOKMARK_LAYOUTS',
  [pick('bookmark colours', bmDialog, /children: ([\w$]+)\.map\(\(e18\) => z\(`button`, \{ type: `button`, role: `radio`, "aria-checked": \w+ === e18, "aria-label": e18, class: `bmd-color/)]: 'BOOKMARK_COLORS',
});

// Programmieren: the coding widget (its own host, drawn into the element), its
// settings and the choices of its dialog.
const codeDraw = pick('coding render', code, /case `code`:\s*([\w$]+)\(e17, t10, n10, r10\);/);
const codeDialog = fns.get(find('coding dialog', t => t.startsWith('function') && t.includes('label: `Lektion`') && t.includes('Aufgaben nacheinander')));
const codeChoices = [...codeDialog.matchAll(/value: t10\.(\w+), options: ([\w$]+), onChange/g)].map(([, key, list]) => `${key}: ${list}`);
codeChoices.push(`pad: ${pick('pad choices', codeDialog, /options: t10\.lesson === `music` \? ([\w$]+)\.slice\(0, 1\)/)}`);
code += `\nvar CODE_CHOICES = { ${codeChoices.join(', ')} };\n`;
Object.assign(aliases, {
  [codeDraw]: 'renderCode',
  [pick('coding label', code, /case `code`:\s*return ([\w$]+)\(e17\);/)]: 'codeLabel',
  [pick('coding config', fns.get(codeDraw), /let i10 = ([\w$]+)\(t10\.pg\)/)]: 'codeConfig',
  CODE_CHOICES: 'CODE_CHOICES',
  [pick('carpet sizes', codeDialog, /options: ([\w$]+)\.map\(\(e18\) => \(\{ value: e18, label: `\$\{e18\} \\xD7 \$\{e18\}` \}\)\)/)]: 'CODE_SIZES',
  [pick('number ranges', codeDialog, /options: ([\w$]+)\.map\(\(e18\) => \(\{ value: e18, label: `bis \$\{e18\}` \}\)\)/)]: 'CODE_RANGES',
  [pick('costumes', codeDialog, /options: ([\w$]+)\.map\(\(e18\) => \(\{ value: e18\.id, label: e18\.nom/)]: 'CODE_COSTUMES',
  [pick('costume pictures', codeDialog, /svg: ([\w$]+)\(e18\.id\) \}\)\), onChange: \(e18\) => \w+\(\{ costume/)]: 'costumePicture',
  [pick('carpets', codeDialog, /options: ([\w$]+)\.map\(\(e18\) => \(\{ value: e18\.id, label: e18\.label, svg/)]: 'CODE_CARPETS',
  [pick('carpet pictures', codeDialog, /svg: ([\w$]+)\(e18\.id\) \}\)\), onChange: \(e18\) => \w+\(\{ mat/)]: 'carpetPicture',
  [pick('level hint', codeDialog, /label: `Schwierigkeit`, hint: ([\w$]+)\(t10\)/)]: 'codeLevelHint',
  [pick('free lessons', codeDialog, /!([\w$]+)\(t10\.lesson\)/)]: 'codeWithoutPad',
  [find('coding styles', t => t.startsWith('`') && t.includes('.lh-wg-code .lh-pg-card.is-run'))]: 'CODE_CSS',
});

// Figuren (Gefühle-Karten): the figure widget, its drawing for the editor
// (a picture per choice) and the choices of the figure editor.
const avatarDraw = pick('figure render', code, /case `avatar`:\s*([\w$]+)\(e17, t10, n10, r10\);/);
const figureDialog = fns.get(find('figure dialog', t => t.startsWith('function') && t.includes('label: `Kopfbedeckung`') && t.includes('label: `Hautfarbe`')));
const figureChoices = [...figureDialog.matchAll(/value: t10\.(\w+), options: ([\w$]+), look/g)].map(([, key, list]) => `${key}: ${list}`);
const figureColors = [...new Set([...figureDialog.matchAll(/colors: ([\w$]+), value: t10\.(\w+)/g)].map(([, list, key]) => `${key}: ${list}`))];
const figureFeelings = pick('figure feelings', figureDialog, /\.\.\.([\w$]+)\.map\(\(e18\) => \(\{ id: e18\.id, label: e18\.label \}\)\)\], look/);
const figureChoice = fns.get(find('figure choice', t => t.startsWith('function') && t.includes('avd-pics') && t.includes('e17.part')));
const sayEditor = fns.get(find('say editor', t => t.startsWith('function') && t.includes('pitch, options:') && t.includes('say-row')));
code += `\nvar FIGURE_CHOICES = { ${figureChoices.join(', ')}, feel: ${figureFeelings} };\nvar FIGURE_COLORS = { ${figureColors.join(', ')} };\n`;
Object.assign(aliases, {
  [avatarDraw]: 'renderFigure',
  [pick('figure config', fns.get(find('figure editor start', t => t.startsWith('async function') && t.includes('(e17.av)') && t.includes('say: ') && t.includes('move: e17.move'))), /old: ([\w$]+)\(e17\.av\)/)]: 'figureConfig',
  [pick('figure picture', figureChoice, /__html: ([\w$]+)\(n10, \{\}, \{ view: [\w$]+\(n10, e17\.part\) \}\)/)]: 'figureSvg',
  [pick('figure part view', figureChoice, /view: ([\w$]+)\(n10, e17\.part\)/)]: 'figureView',
  [pick('voice pitches', sayEditor, /pitch, options: ([\w$]+)\.map/)]: 'FIGURE_PITCHES',
  FIGURE_CHOICES: 'FIGURE_CHOICES', FIGURE_COLORS: 'FIGURE_COLORS',
  [find('figure styles', t => t.startsWith('`\n.lh-av{position:absolute;inset:0}'))]: 'FIGURE_CSS',
});

// Sprechendes Foto: a photo whose chin (or a drawn mouth) moves while it
// speaks; drawn and spoken by the reference, the host gives the photo.
Object.assign(aliases, {
  [pick('photo render', code, /case `phototalk`:\s*([\w$]+)\(e17, t10, n10, r10\);/)]: 'renderPhotoTalk',
  [pick('photo tap', code, /e17\.kind === `phototalk`\) \{\s*([\w$]+)\(e17, t10\);/)]: 'speakPhotoTalk',
  [find('photo styles', t => t.startsWith('[{ id: `normal`, label: `Normal`, hint: `das Kinn'))]: 'PHOTO_STYLES',
  [find('photo styles css', t => t.startsWith('`\n.lh-pt{position:absolute;inset:0}'))]: 'PHOTO_CSS',
});

// KI-Partner: the topics and AI chats of its dialog, and the instruction put
// before the child's text (learning partner or free helper).
Object.assign(aliases, {
  [find('kipartner topics', t => t.startsWith('[{ id: `math`, label: `Mathe`, icon:'))]: 'KP_TOPICS',
  [find('kipartner sites', t => t.startsWith('[{ id: `duck`, label: `Duck.ai`'))]: 'KP_SITES',
  [find('kipartner instruction', t => /^\(e17\) => e17\.system\.trim\(\) \|\| \(e17\.mode === `free`/.test(t))]: 'kipartnerInstruction',
});

// Puppentheater: the stage with figures, recording (sound and movements),
// playing and the video export; the host provides the pages, saves the
// recording (uploaded to the school server) and the positions.
const theaterDraw = pick('theatre render', code, /case `theater`:\s*([\w$]+)\(e17, t10, n10, r10\);/);
const theaterDialog = fns.get(find('theatre dialog', t => t.startsWith('function') && t.includes('Titel des St\\xFCcks') && t.includes('Automatischer Seitenwechsel')));
const theaterSetters = {
  host: pick('theatre host hook', code, /(?:^|\), )([\w$]+)\(\{ pages: \(\) => /m),
  save: pick('theatre save hook', code, /(?:^|\), )([\w$]+)\(\(e17, t10, n10, r10\) => \{\s*\(async \(\) => \{\s*let i10 = t10\.blob/m),
  move: pick('theatre positions hook', code, /(?:^|\), )([\w$]+)\(\(e17, t10\) => \{\s*\w+\(\((\w+)\) => \{\s*let (\w+) = \w+\(\2, e17\);\s*\3\?\.type === `widget` && \3\.th && \3\.th\.cast\.forEach/m),
};
Object.assign(aliases, {
  [theaterDraw]: 'renderTheater',
  [pick('theatre label', code, /case `theater`:\s*return ([\w$]+)\(e17\);/)]: 'theaterLabel',
  [pick('theatre config', fns.get(find('theatre editor start', t => t.startsWith('async function') && t.includes('(e17.th, ') && t.includes('kind === n11'))), /= ([\w$]+)\(e17\.th, /)]: 'theaterConfig',
  [theaterSetters.host]: 'registerTheaterHost', [theaterSetters.save]: 'registerTheaterSave', [theaterSetters.move]: 'registerTheaterPositions',
  [pick('stage pictures', theaterDialog, /children: \[([\w$]+)\.map\(\(e18\) => z\(`button`, \{ type: `button`, role: `radio`, "aria-checked": !\w+ && t10\.back === e18\.id/)]: 'THEATER_BACKS',
  [pick('stage picture', theaterDialog, /z\(`img`, \{ src: ([\w$]+)\(e18\.id\), alt: `` \}\), z\(`span`, \{ children: e18\.label \}\)/)]: 'theaterBackPicture',
  [find('theatre styles', t => t.startsWith('`\n.lh-th{position:absolute'))]: 'THEATER_CSS',
});

const toolCss = find('tool styles', t => t.startsWith('`\n.lh-ls{position:absolute;inset:0;overflow:hidden}'));

// The catalogue of the reference (all entries); those with a page of these tools are the presets.
const catalogName = [...inits.entries()].find(([, t]) => t.startsWith('[') && t.includes('id: `labels`') && t.includes('id: `math`'))?.[0];
if (!catalogName) throw Error('Catalogue of the reference not found.');
const kinds = new Set(Object.values(TOOLS));

code += `
var TOOLS_CSS = ${toolCss};
var TOOL_REGISTRY = { ${registry.join(',\n  ')} };
var TOOL_CATALOG = ${catalogName};
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
{ const outside = runtime.replace(/http:\/\/www\.w3\.org\/[\w/]+/g, '').replaceAll('`https://${t10}`', '') /* completing a typed address, no request */
  // KI-Partner: the AI chats a child opens with „Ausprobieren“ (new tab or, for AIS-Chat, a frame) – only after that tap, never by itself.
  .replace(/https:\/\/(duck\.ai|chatgpt\.com|claude\.ai|chat\.mistral\.ai|gemini\.google\.com|app\.ais-chat\.schule)\/?[\w/?=]*/g, '').match(/.{0,60}https?:\/\/.{0,60}/g); if (outside) { console.error(outside.join('\n')); throw Error('The tools would reach an outside address.'); } }
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
const presets = TOOL_CATALOG.flatMap(meta => {
  if (typeof meta.items !== 'function') return [];
  let items;
  try { items = meta.items(); } catch { return []; }
  if (!items.some(item => item.type === 'widget' && (kinds.has(item.kind) || item.kind === 'bookmarks' || item.kind === 'code' || item.kind === 'avatar' || item.kind === 'theater'))) return [];
  return [{ id: meta.id, title: meta.label, group: meta.group, items: items.map(item => { const copy = { ...item }; delete copy.id; return copy; }) }];
});
await fs.writeFile('src/lib/learning/werkzeug-presets.json', JSON.stringify(presets, null, 1) + '\n');
console.log('Tools reference:', runtime.length, 'bytes;', Object.keys(TOOLS).length, 'tools;', presets.length, 'presets;', pages, 'page lookups;', [...savers.keys()].length, 'savers found');

// Sortieren and Bild-Quiz: the ready-made sets with their pictures. ARASAAC
// pictures come from the pack “sort-pictos” (CC BY-NC-SA 4.0), signs and care
// symbols are drawn by the reference as SVG; all are saved in public/sortieren/.
const sortStart = find('sort start', t => t.startsWith('async function') && t.includes('`signs-quiz` : `food`'));
const sortStartText = fns.get(sortStart);
const setsName = pick('sort sets', sortStartText, /r10 = ([\w$]+)\.find\(\(e18\) => e18\.id === n10\)/);
const pictureName = pick('sort pictures', sortStartText, /let r11 = ([\w$]+)\(n11, e18\)/);
const signName = pick('sign pictures', fns.get(pictureName), /let n11 = ([\w$]+)\(e17\);\s*return n11 \? [\w$]+\(`sign-/);
const sortColors = pick('box colours', fns.get(/config: \(raw, media\) => ([\w$]+)\(/.exec(registry.find(r => r.startsWith('"sort"')))[1]), /: ([\w$]+)\[t11 % \1\.length\]/);
const sortCode = extract([setsName, signName, sortColors]);
const sortRef = await import('data:text/javascript;base64,' + Buffer.from(sortCode + `\nexport { ${setsName} as sets, ${signName} as sign, ${sortColors} as colors };`).toString('base64'));
const pack = JSON.parse(html.match(/<script type="text\/plain" id="lh-pack-sort-pictos">([^<]*)<\/script>/)?.[1] ?? 'null');
if (!pack) throw Error('Picture pack sort-pictos not found.');
await fs.mkdir('public/sortieren', { recursive: true });
for (const [id, url] of Object.entries(pack)) {
  const m = /^data:image\/webp;base64,([A-Za-z0-9+/=]+)$/.exec(url);
  if (!/^\d+$/.test(id) || !m) throw Error('Unexpected picture ' + id);
  await fs.writeFile(`public/sortieren/${id}.webp`, Buffer.from(m[1], 'base64'));
}
const hash = (s) => { let n = 0; for (const c of s) n = n * 31 + c.charCodeAt(0) | 0; return (n >>> 0).toString(36); };
const svgFile = async (name, svg) => {
  if (!/^<svg[\s>]/.test(svg) || /<script|on\w+=|href="(?!#)/i.test(svg)) throw Error('Unexpected picture ' + name);
  await fs.writeFile(`public/sortieren/${name}.svg`, svg.includes('xmlns=') ? svg : svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'));
  return `/sortieren/${name}.svg`;
};
const sortSets = [];
for (const set of sortRef.sets) {
  const items = [];
  for (const [text, box, pic] of set.items) {
    let img;
    if (typeof pic === 'number') { if (!pack[pic]) throw Error('Missing picture ' + pic); img = `/sortieren/${pic}.webp`; }
    else if (typeof pic === 'string' && pic.startsWith('sg-')) img = await svgFile(`sign-${pic.slice(3)}`, sortRef.sign(pic));
    else if (typeof pic === 'string') img = await svgFile(`sortpic-${hash(pic)}`, pic);
    items.push({ text, box, ...(img ? { img } : {}) });
  }
  sortSets.push({ id: set.id, label: set.label, title: set.title, mode: set.mode, ...(set.ask ? { ask: set.ask } : {}), boxes: set.boxes.map(([label, color]) => ({ label, color })), items });
}
await fs.writeFile('src/lib/learning/sort-sets.json', JSON.stringify({ colors: sortRef.colors, sets: sortSets }, null, 1) + '\n');
console.log('Sort sets:', sortSets.length, 'with', Object.keys(pack).length, 'pictures');

// The four worksheet generators of 1.47.3 (Vorlagen › Einstellbar): Rechnen
// im Alltag, Karopapier, Programmieren: Arbeitsblatt, Laute hören. Each is
// found by the key under which its dialog keeps the last settings.
const sheetDialog = (key) => {
  const keyVar = [...inits.entries()].find(([, t]) => t === `\`${key}\``)?.[0];
  const text = keyVar && [...fns.values()].find(t => t.includes(`F(() => Z3(${keyVar},`));
  if (!text) throw Error('Worksheet dialog not found: ' + key);
  const [, defaults, clean] = new RegExp(`Z3\\(${escape(keyVar)}, ([\\w$]+), ([\\w$]+)\\)`).exec(text);
  return { text, defaults, clean };
};
const life = sheetDialog('lernheft-life-v1'), grid = sheetDialog('lernheft-grid-v1'), coding = sheetDialog('lernheft-coding-sheet-v1'), phon = sheetDialog('lernheft-phon-v1');
const formatsOf = (d) => pick('sheet formats', d.text, /children: ([\w$]+)\.map\(\(e18\) => z\(e6/);
const phonPictures = fns.get(find('phon pictures', t => t.startsWith('function') && t.includes('`anlaut-pictos`') && t.includes('pack === `picto`')));
const sheetAliases = {
  [life.defaults]: 'LIFE_DEFAULTS', [life.clean]: 'lifeClean', [pick('life sheet', life.text, /\? ([\w$]+)\(t10, e18\) : \[\]/)]: 'lifePages', [formatsOf(life)]: 'LIFE_FORMATS',
  [grid.defaults]: 'GRID_DEFAULTS', [grid.clean]: 'gridClean', [pick('grid sheet', grid.text, /\? ([\w$]+)\(t10, e18\) : \[\]/)]: 'gridPages', [formatsOf(grid)]: 'GRID_FORMATS',
  [coding.defaults]: 'CODING_DEFAULTS', [coding.clean]: 'codingClean', [pick('coding sheet', coding.text, /\(\(\) => ([\w$]+)\(t10\), \[t10, r10\]\)/)]: 'codingPages',
  [pick('coding kinds', coding.text, /label: `Arbeitsblatt`, value: t10\.kind, options: ([\w$]+)/)]: 'CODING_KINDS',
  [pick('coding levels', coding.text, /label: `Schwierigkeit`, value: t10\.level, options: ([\w$]+)/)]: 'CODING_LEVELS',
  [pick('coding walls', coding.text, /label: `Hindernisse`, value: t10\.walls, options: ([\w$]+)/)]: 'CODING_WALLS',
  [phon.defaults]: 'PHON_DEFAULTS', [phon.clean]: 'phonClean', [pick('phon sheet', phon.text, /\? ([\w$]+)\(t10, a10, e18\) : \[\]/)]: 'phonPages', [formatsOf(phon)]: 'PHON_FORMATS',
  [pick('phon sounds', phon.text, /children: ([\w$]+)\.map\(\(e18\) => z\(`button`, \{ type: `button`, role: `radio`, "aria-checked": t10\.sound/)]: 'PHON_SOUNDS',
  [pick('phon words', phonPictures, /for \(let r10 of ([\w$]+)\) r10\.no &&/)]: 'PHON_WORDS',
};
// Etiketten: cards with picture and word (or Sprechtasten), from a list of words.
const labelsKey = [...inits.entries()].find(([, t]) => t === '`lernheft-labels`')?.[0];
const labelsDialog = [...fns.values()].find(t => t.startsWith('function') && t.includes('Farbe des Rahmens') && t.includes('Vorlesen beim Antippen'));
if (!labelsKey || !labelsDialog) throw Error('Etiketten not found.');
const labelsFonts = /options: ([\w$]+)\.filter\(([\w$]+)\)\.map\(\(e18\) => \(\{ value: e18, label: ([\w$]+)\(e18\)\.label \}\)\)/.exec(labelsDialog);
if (!labelsFonts) throw Error('Etiketten fonts not found.');
Object.assign(sheetAliases, {
  [pick('labels pages', labelsDialog, /MR\(\(\) => ([\w$]+)\(\w+, t10\), \[/)]: 'labelPages',
  [pick('labels sizes', labelsDialog, /children: ([\w$]+)\.map\(\(e18\) => z\(`button`, \{ type: `button`, role: `radio`, "aria-checked": t10\.grid/)]: 'LABEL_SIZES',
  [pick('labels colours', labelsDialog, /Farbe des Rahmens`, children: ([\w$]+)\.map/)]: 'LABEL_COLORS',
  [labelsFonts[1]]: 'LABEL_FONTS', [labelsFonts[2]]: 'labelFontAvailable', [labelsFonts[3]]: 'labelFont',
  [pick('labels case', labelsDialog, /label: ([\w$]+)\(`GROSS`, `upper`\)/)]: 'labelCase',
  [pick('labels defaults', fns.get(find('labels load', t => t.startsWith('function') && t.includes(`localStorage.getItem(${labelsKey})`))), /return ([\w$]+);/)]: 'LABEL_DEFAULTS',
});
const sheets = extract(Object.keys(sheetAliases));
{ const outside = sheets.replace(/http:\/\/www\.w3\.org\/[\w/]+/g, '').replaceAll('https://www.latex-project.org/lppl/', '').replaceAll('https://github.com/hyphenation/tex-hyphen', '') /* licence texts of the hyphenation patterns, no requests */.match(/.{0,60}https?:\/\/.{0,60}/g); if (outside) { console.error(outside.join('\n')); throw Error('The worksheets would reach an outside address.'); } }
let sheetCode = sheets;
for (const [from, to] of Object.entries({ 'LH Andika': 'Andika', 'LH Nunito': 'Nunito', 'LH Grundschrift': 'Playwrite DE Grund', 'LH Schreibschrift SAS': 'Playwrite DE SAS', 'LH Schreibschrift': 'Playwrite DE VA', 'LH Druckschrift': 'Andika' })) sheetCode = sheetCode.replaceAll(from, to);
await fs.writeFile('src/lib/sheets/sheets-1473.ts', `/* eslint-disable */
// @ts-nocheck
// Generated from Lernsachen-Heft-komplett.html (1.47.3) by scripts/extract-tools-reference.mjs:
// the worksheet generators Rechnen im Alltag, Karopapier, Programmieren: Arbeitsblatt and
// Laute hören, unchanged. They build pages of text and sticker items (units 1400 × 990).
${sheetCode}
export { ${Object.entries(sheetAliases).map(([a, b]) => a + ' as ' + b).join(', ')} };
`);
console.log('Worksheets:', sheetCode.length, 'bytes');
