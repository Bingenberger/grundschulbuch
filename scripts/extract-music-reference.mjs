// Rebuild the music controls and page presets from the supplied reference.
// Resolve individual top-level declarations so no editor/application boot code is included.
import fs from 'node:fs/promises';
import ts from 'typescript';
import { transformSync } from 'esbuild';
const html = await fs.readFile('Lernsachen-Heft.html', 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).sort((a, b) => b.length - a.length);
let code = transformSync(scripts[0], { loader: 'js', minify: false }).code;
let parsed = ts.createSourceFile('reference.js', code, ts.ScriptTarget.Latest, true);
const extras = [];
function objects(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const id = node.properties.find(p => ts.isPropertyAssignment(p) && p.name.getText(parsed) === 'id');
    if (id && ['`playlist`', '`tuner`', '`karaoke`'].includes(id.initializer.getText(parsed))) extras.push(node.getText(parsed));
  }
  ts.forEachChild(node, objects);
}
objects(parsed);
code += '\nvar musicExtraTemplates = [' + extras.join(',') + '];\n';
code += `
async function musicCaptureStream(includeMicrophone = false) {
  const engine = Ko();
  if (!engine) throw Error('Audio wird von diesem Browser nicht unterstützt.');
  const microphone = includeMicrophone ? await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }) : null;
  let destination, source, connected = false;
  try {
    if (engine.ctx.state === 'suspended') await engine.ctx.resume();
    destination = engine.ctx.createMediaStreamDestination();
    engine.comp.connect(destination); connected = true;
    if (microphone) { source = engine.ctx.createMediaStreamSource(microphone); source.connect(destination); }
    let released = false;
    return { stream: destination.stream, release: () => {
      if (released) return;
      released = true;
      engine.comp.disconnect(destination); source?.disconnect();
      microphone?.getTracks().forEach(track => track.stop());
    } };
  } catch (error) {
    if (connected) engine.comp.disconnect(destination);
    source?.disconnect(); destination?.stream.getTracks().forEach(track => track.stop());
    microphone?.getTracks().forEach(track => track.stop());
    throw error;
  }
}
function musicStop(id) {
  BD(id); lO(id); Rd(id); hs(); Tu(id); Vie(id);
  const echo = Ic(id); echo.token++; echo.phase = 'idle';
  if (tp?.id === id) cp(id);
}
function musicRegister(saveSequence, studioChange, studioAdd, studioEdit, sequenceRecord, padRecord, karaokeAudio, karaokeTiming) {
  hle(saveSequence); gle(sequenceRecord); Uee(studioChange, studioAdd, studioEdit); Lce(padRecord); Aie(karaokeAudio, karaokeTiming);
}
var musicOptionsData = { songs: PW, melodies: hc, instruments: ro, voices: io, scales: ao, roots: uo, drumVoices: Fo, padColors: Ro, trackColors: RMe, beats: cl, sequenceMelodies: bl, echoTones: wc, meters: qD, clicks: JD, tempos: SNe, tuners: Hf, designs: Object.values(r_).map(d => ({ id: d.id, label: d.label, svg: a_(d) })), fonts: o_.map(id => ({ id, label: Be(id).label })), fontSize: s_ };
var MUSIC_CSS = [Ri, Zc, mee, kee, Jee, Ote, xle, Ale, Jie].join('\\n');
`;
const virtual = '/music-reference.js';
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
const aliases = { tG: 'cleanKaraokeSettings', pxe: 'karaokePictureCandidates', QW: 'karaokeSongSettings', b_: 'parseLyrics', T_: 'lyricWords', C_: 'wordKey', Kie: 'parseMusicLrc', qie: 'exportMusicLrc', vc: 'parseMusicMidi', yc: 'pickMidiTrack', xc: 'midiMelody', _l: 'sequenceBeat', wl: 'sequenceMelody', Dl: 'sequenceKey', _o: 'instrumentDefaults', YA: 'fallingInstrument', Fue: 'echoInstrument', jo: 'instrumentNotes', yo: 'musicNoteName', gs: 'musicAudioTime', _s: 'playMetronomeClick', ls: 'playMusicDrum', ms: 'playMusicTone', ps: 'playMusicSample', hs: 'stopMusicSound', Bie: 'renderKaraoke', Vs: 'renderInstrument', zce: 'renderDrums', kle: 'renderMetronome', Yc: 'renderEcho', yle: 'renderSequencer', pee: 'renderNoteQuiz', Eu: 'renderFalling', Ud: 'renderStudio', lp: 'renderTuner', musicCaptureStream: 'musicCaptureStream', musicStop: 'musicStop', musicRegister: 'musicRegister', MUSIC_CSS: 'MUSIC_CSS', Pu: 'studioEffects', Fu: 'studioMoods' };
let runtime = extract(Object.keys(aliases));
for (const [from, to] of Object.entries({ 'LH Andika': 'Andika', 'LH Nunito': 'Nunito', 'LH Grundschrift': 'Playwrite DE Grund', 'LH Schreibschrift SAS': 'Playwrite DE SAS', 'LH Schreibschrift': 'Playwrite DE VA', 'LH Druckschrift': 'Andika', 'LH Lexend': 'Lexend', 'LH Atkinson Hyperlegible': 'Atkinson Hyperlegible', 'LH Merriweather': 'Merriweather', 'LH Caveat': 'Caveat', 'LH Comic': 'Bangers' })) runtime = runtime.replaceAll(from, to);
await fs.writeFile('src/lib/reference/music-runtime.ts', '/* eslint-disable */\n// @ts-nocheck\n// Generated from Lernsachen-Heft.html by scripts/extract-music-reference.mjs.\n' + runtime + '\nexport { ' + Object.entries(aliases).map(([a, b]) => a === b ? a : a + ' as ' + b).join(', ') + ' };\n');
const presetsCode = extract(['zue', 'musicExtraTemplates']);
const { zue, musicExtraTemplates } = await import('data:text/javascript;base64,' + Buffer.from(presetsCode + '\nexport { zue, musicExtraTemplates };').toString('base64'));
const presets = [...zue, ...musicExtraTemplates].map(meta => ({ id: meta.id, title: meta.label, hidden: !!meta.hidden, generator: meta.generator, paper: meta.paper, background: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 990">' + meta.svg(meta.line) + '</svg>', items: meta.items().map(item => { const copy = { ...item }; delete copy.id; return copy; }) }));
await fs.writeFile('src/lib/learning/music-presets.json', JSON.stringify(presets, null, 2) + '\n');
console.log('Music reference:', presets.length, 'presets;', runtime.length, 'bytes of controls');

const optionsCode = extract(['musicOptionsData']);
const { musicOptionsData } = await import('data:text/javascript;base64,' + Buffer.from(optionsCode + '\nexport { musicOptionsData };').toString('base64'));
await fs.writeFile('src/lib/learning/music-options-data.json', JSON.stringify(musicOptionsData, null, 2) + '\n');

const pictureRoots = ['nxe', 'pxe', 'VW', 'BW', 'qW', 'LW', 'sxe'];
await fs.writeFile('src/lib/reference/karaoke-pictures.mjs', '/* eslint-disable */\n// Generated from Lernsachen-Heft.html; pure picture-selection rules.\n' + extract(pictureRoots) + '\nexport { nxe as pictureHints, pxe as pictureCandidates, VW as wordVariants, BW as concreteWord, qW as rankPictures, LW as stopWords, sxe as compoundVariants };\n');
