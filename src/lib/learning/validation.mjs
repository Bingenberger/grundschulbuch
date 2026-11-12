export const WIDGET_KINDS = [
  'timer',
  'multitimer',
  'clock',
  'calendar',
  'timetable',
  'noise',
  'applause',
  'pitch',
  'piano',
  'drums',
  'sequencer',
  'metronome',
  'tuner',
  'echo',
  'notequiz',
  'falling',
  'recorder',
  'playlist',
  'soundstudio',
  'karaoke',
  'slideshow',
  'animation',
  'map',
  'calculator',
  'mathboard',
  'mathtool',
  'receipt',
  'geodraw',
  'checkout',
  'monsternames',
  'syllablejoin',
  'shop',
  'geometry',
  'monster',
  'synthesis',
  'clapping',
  'alphabet',
  'communication',
];
export const ACTIVITY_KINDS = [
  'quiz',
  'matching',
  'cloze',
  'typing',
  'reading',
  'memory',
  'maze',
  'crossword',
  'wordsearch',
  'wordle',
  'letterguess',
  'syllables',
  'connect4',
  'battleship',
];
export const SHAPES = [
  'rect',
  'rounded',
  'ellipse',
  'triangle',
  'line',
  'arrow',
  'star',
  'heart',
  'speech',
  'thought',
  'shout',
  'banner',
];
export const PAGE_FRAMES = [
  'none',
  'line',
  'double',
  'rounded',
  'classic',
  'certificate',
  'corners',
  'worksheet',
  'band',
  'dashed',
  'dots',
  'wave',
  'zigzag',
  'scallop',
  'stars',
  'hearts',
  'flowers',
  'leaves',
  'crayon',
  'bunting',
  'confetti',
];
export function boundedJson(value, depth = 0) {
  if (depth > 9)
    throw new Error('Die Einstellungen sind zu tief verschachtelt.');
  if (value === null || typeof value === 'boolean') return value;
  if (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    Math.abs(value) <= 1e15
  )
    return value;
  if (
    typeof value === 'string' &&
    value.length <= 20000 &&
    !/^data:(image|audio|video)/i.test(value)
  )
    return value;
  if (Array.isArray(value) && value.length <= 2000)
    return value.map((v) => boundedJson(v, depth + 1));
  if (value && typeof value === 'object' && Object.keys(value).length <= 80) {
    const result = {};
    for (const [key, item] of Object.entries(value)) {
      if (
        !/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(key) ||
        ['constructor', 'prototype', '__proto__'].includes(key)
      )
        throw new Error('Ungültige Einstellung.');
      if (
        ['image', 'src', 'audio', 'recordingSrc'].includes(key) &&
        typeof item === 'string' &&
        item &&
        !/^\/api\/medien\/[a-f0-9]{64}\.[a-z0-9]+$/.test(item)
      )
        throw new Error('Medien müssen auf dem Schulserver liegen.');
      result[key] = boundedJson(item, depth + 1);
    }
    return result;
  }
  throw new Error('Ungültige Einstellung.');
}
export function learningSettings(value) {
  const result = boundedJson(value || {});
  if (
    !result ||
    Array.isArray(result) ||
    typeof result !== 'object' ||
    JSON.stringify(result).length > 200000
  )
    throw new Error('Die Einstellungen sind zu groß.');
  return result;
}
export function learningResponse(value) {
  const result = learningSettings(value);
  if (JSON.stringify(result).length > 50000)
    throw new Error('Die Antwort ist zu groß.');
  for (const [key, min, max] of [
    ['index', 0, 1000000],
    ['position', 0, 10000],
    ['start', -1, 10000],
    ['turn', 1, 2],
    ['hour', 0, 23],
    ['minute', 0, 59],
    ['score', 0, 100],
    ['deadline', 0, 1e15],
    ['remaining', 0, 3600000],
  ])
    if (
      result[key] !== undefined &&
      (!Number.isFinite(result[key]) || result[key] < min || result[key] > max)
    )
      throw new Error('Ungültiger Bearbeitungsstand.');
  if (
    result.date !== undefined &&
    (typeof result.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(result.date) ||
      !Number.isFinite(Date.parse(result.date)))
  )
    throw new Error('Ungültiges Kalenderdatum.');
  if (
    result.path !== undefined &&
    (!Array.isArray(result.path) ||
      result.path.some(
        (p) => !p || !Number.isFinite(p.x) || !Number.isFinite(p.y),
      ))
  )
    throw new Error('Ungültiger Weg.');
  if (result.beats !== undefined && !beatRows(result.beats))
    throw new Error('Ungültiger Rhythmus.');
  if (
    result.recordings !== undefined &&
    (!Array.isArray(result.recordings) || !result.recordings.every(track))
  )
    throw new Error('Ungültige Tonspur.');
  if (
    result.events !== undefined &&
    (!Array.isArray(result.events) ||
      result.events.some(
        (e) =>
          !e ||
          !Number.isFinite(e.note) ||
          e.note < 0 ||
          e.note > 127 ||
          !Number.isFinite(e.at) ||
          e.at < 0 ||
          e.at > 180 ||
          !Number.isFinite(e.duration) ||
          e.duration <= 0 ||
          e.duration > 10,
      ))
  )
    throw new Error('Ungültige Melodie.');
  if (result.geometry !== undefined) {
    const v = result.geometry, point = p => p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 200 && p.y >= 0 && p.y <= 200;
    if (!v || typeof v !== 'object' || Array.isArray(v) || typeof v.exercise !== 'string' || v.exercise.length > 20000 ||
      !Number.isInteger(v.index) || v.index < 0 || v.index >= 12 || !Array.isArray(v.segments) || v.segments.length > 30 || v.segments.some(s => !s || !point(s.a) || !point(s.b)) ||
      !Number.isInteger(v.attempts) || v.attempts < 0 || v.attempts > 100 || ['checked', 'correct', 'helped', 'viewed', 'solution', 'completed'].some(key => typeof v[key] !== 'boolean') ||
      !Array.isArray(v.results) || v.results.length > 12 || v.results.some(r => !r || typeof r.correct !== 'boolean' || typeof r.helped !== 'boolean')) throw new Error('Ungültiger Geometriestand.');
  }
  if (result.syllableAssembly !== undefined) {
    const value = result.syllableAssembly;
    if (!value || Array.isArray(value) || typeof value !== 'object' || typeof value.exercise !== 'string' || value.exercise.length > 10000 ||
      !Number.isInteger(value.index) || value.index < 0 || value.index >= 30 || !Array.isArray(value.placed) || value.placed.length > 12 || value.placed.some(n => !Number.isInteger(n) || n < -1 || n >= 12) ||
      value.placed.filter(n => n >= 0).length !== new Set(value.placed.filter(n => n >= 0)).size ||
      !Array.isArray(value.results) || value.results.length > 30 || value.results.some(right => typeof right !== 'boolean') ||
      ['checked', 'correct', 'completed'].some(key => typeof value[key] !== 'boolean')) throw new Error('Ungültiger Stand beim Silbenlesen.');
  }
  if (result.letterGuess !== undefined) {
    const value = result.letterGuess;
    if (!value || Array.isArray(value) || typeof value !== 'object' || typeof value.exercise !== 'string' || value.exercise.length > 4000 ||
      !Number.isInteger(value.index) || value.index < 0 || value.index >= 20 || !Array.isArray(value.guessed) || value.guessed.length > 30 ||
      value.guessed.some(letter => typeof letter !== 'string' || !/^[a-zäöüß]$/.test(letter)) || new Set(value.guessed).size !== value.guessed.length ||
      !Array.isArray(value.results) || value.results.length > 20 || value.results.some(right => typeof right !== 'boolean') ||
      typeof value.revealed !== 'boolean' || typeof value.completed !== 'boolean') throw new Error('Ungültiger Stand beim Buchstabenraten.');
  }
  if (result.mediaActivity !== undefined) {
    const value = result.mediaActivity;
    const indexes = (array, max) => Array.isArray(array) && array.length <= 2000 && array.every(n => Number.isInteger(n) && n >= -1 && n < max);
    if (!value || Array.isArray(value) || typeof value !== 'object' || typeof value.exercise !== 'string' || value.exercise.length > 100 ||
      !Number.isInteger(value.index) || value.index < 0 || value.index >= 2000 || !indexes(value.answers, 2000) || !indexes(value.placements, 12) ||
      !indexes(value.open, 24) || value.open.length > 2 || value.open.some(n => n < 0) || new Set(value.open).size !== value.open.length ||
      !indexes(value.matched, 24) || value.matched.length > 24 || value.matched.length % 2 !== 0 || value.matched.some(n => n < 0) || new Set(value.matched).size !== value.matched.length ||
      !Array.isArray(value.evaluated) || value.evaluated.length > 2000 || value.evaluated.some(v => typeof v !== 'boolean') ||
      !Number.isInteger(value.moves) || value.moves < 0 || value.moves > 1000000 || typeof value.checked !== 'boolean' || typeof value.completed !== 'boolean') throw new Error('Ungültiger Stand der Medienaufgabe.');
  }
  if (result.clapping !== undefined) {
    const value = result.clapping;
    if (!value || Array.isArray(value) || typeof value !== 'object' || typeof value.exercise !== 'string' || value.exercise.length > 10000 ||
      !Number.isInteger(value.index) || value.index < 0 || value.index > 15 || !Number.isInteger(value.claps) || value.claps < 0 || value.claps > 32 ||
      !Array.isArray(value.results) || value.results.length > 16 || value.results.some(v => typeof v !== 'boolean') ||
      ['checked', 'correct', 'helped', 'completed'].some(key => typeof value[key] !== 'boolean')) throw new Error('Ungültiger Stand beim Silbenklatschen.');
  }
  if (result.synthesis !== undefined) {
    const value = result.synthesis;
    if (!value || Array.isArray(value) || typeof value !== 'object' || typeof value.exercise !== 'string' || value.exercise.length > 10000 ||
      !Number.isInteger(value.round) || value.round < 0 || value.round > 1000000 || !Number.isInteger(value.index) || value.index < 0 || value.index > 12 ||
      !['ready', 'joined', 'complete'].includes(value.phase)) throw new Error('Ungültiger Stand beim Lauteverbinden.');
  }
  if (result.alphabet !== undefined) {
    const a = result.alphabet;
    if (!a || Array.isArray(a) || typeof a !== 'object' || typeof a.exercise !== 'string' || a.exercise.length > 10000 || (a.prefix !== undefined && (typeof a.prefix !== 'string' || a.prefix.length > 20000)) ||
      !Array.isArray(a.tokens) || a.tokens.length > 200 || a.tokens.some(t => typeof t !== 'string' || t.length > 8) ||
      !Number.isInteger(a.index) || a.index < 0 || a.index > 40 || !Number.isInteger(a.attempts) || a.attempts < 0 || a.attempts > 99 ||
      (a.variants !== undefined && (!Array.isArray(a.variants) || a.variants.length !== a.tokens.length || a.variants.some(v => v !== 0 && v !== 1))) ||
      !Array.isArray(a.results) || a.results.length > 40 || a.results.some(v => typeof v !== 'boolean') ||
      ['checked', 'correct', 'completed', 'shift'].some(key => typeof a[key] !== 'boolean')) throw new Error('Ungültiger Stand der Anlaut-Tastatur.');
  }
  return result;
}
const finite = (value, min, max) =>
  Number.isFinite(value) && value >= min && value <= max;
const optional = (object, key, predicate) =>
  object[key] === undefined || predicate(object[key]);
const string = (value) => typeof value === 'string';
const beatRows = (value) =>
  Array.isArray(value) &&
  value.length <= 8 &&
  value.every(
    (row) =>
      Array.isArray(row) &&
      row.length <= 32 &&
      row.every((v) => typeof v === 'boolean'),
  );
const frame = (value) =>
  value &&
  finite(value.x, -100, 200) &&
  finite(value.y, -100, 200) &&
  optional(value, 'text', string) &&
  optional(value, 'symbol', string) &&
  optional(value, 'color', string) &&
  optional(value, 'scale', (v) => finite(v, 0.05, 10)) &&
  optional(value, 'angle', (v) => finite(v, -3600, 3600)) &&
  optional(value, 'opacity', (v) => finite(v, 0, 1));
const track = (value) =>
  value &&
  string(value.title) &&
  optional(value, 'src', string) &&
  optional(value, 'offset', (v) => finite(v, 0, 180)) &&
  optional(value, 'volume', (v) => finite(v, 0, 1));
export function widgetSettings(value) {
  const result = learningSettings(value);
  const check = (key, predicate) => {
    if (!optional(result, key, predicate))
      throw new Error(`Ungültige Einstellung: ${key}.`);
  };
  for (const key of [
    'title',
    'text',
    'instrument',
    'font',
    'mode',
    'background',
    'transition',
    'voice',
  ])
    check(key, string);
  for (const [key, values] of Object.entries({ geometryMode: ['series', 'custom'], geometryHelp: ['preview', 'trace'], alphabetTable: ['basic', 'full'], alphabetLayout: ['abc', 'qwertz'], alphabetLetters: ['both', 'lower', 'upper'], alphabetPrompt: ['word', 'image', 'both', 'audio'], synthesisMode: ['sounds', 'pairs'], synthesisCase: ['lower', 'upper', 'mixed'], clappingHelp: ['none', 'dots', 'word', 'both'], letterGuessCase: ['lower', 'upper'], letterGuessLayout: ['abc', 'qwertz'], letterGuessClue: ['none', 'image', 'audio', 'both'], syllablePrompt: ['image', 'word', 'audio', 'both'], mathTool: ['boat', 'abacus', 'ruler', 'calc'] })) check(key, value => values.includes(value));
  for (const key of ['repeat', 'showWords', 'autoRead', 'alphabetPractice', 'alphabetSpeech', 'alphabetVowels', 'synthesisSpeak', 'synthesisDragSound', 'mediaReadText', 'syllableColours', 'slideshowSound', 'slideshowWaitAudio'])
    check(key, (v) => typeof v === 'boolean');
  for (const [key, min, max] of [
    ['geometryCount', 1, 12],
    ['mathSize', 0, 30],
    ['geometryPreview', 1, 15],
    ['letterGuessLives', 4, 12],
    ['clappingSensitivity', 0.02, 0.3],
    ['synthesisCount', 1, 12],
    ['seconds', 0.1, 3600],
    ['bpm', 30, 240],
    ['volume', 0, 1],
    ['octaves', 1, 2],
    ['rows', 1, 30],
    ['columns', 1, 30],
    ['maximum', 1, 10000],
    ['seed', 0, 4294967295],
    ['speechRate', 0.3, 2],
    ['speechPitch', 0.5, 2],
  ])
    check(key, (v) => finite(v, min, max));
  const array = (key, predicate, max = 2000) =>
    check(
      key,
      (v) => Array.isArray(v) && v.length <= max && v.every(predicate),
    );
  array('words', string);
  array('karaokeTimes', value => finite(value, 0, 86400), 300);
  if (result.karaokeTimes !== undefined && (typeof result.text !== 'string' || result.text.length > 10000 || result.karaokeTimes.length !== (result.text.trim() ? result.text.replace(/\r\n?/g, '\n').split('\n').length : 0) || result.karaokeTimes.some((at, i, times) => i > 0 && at < times[i - 1]))) throw new Error('Ungültiger Karaoke-Zeitplan.');
  array('syllableConfirmed', value => typeof value === 'string' && value.length <= 80, 30);
  array('syllableItems', value => value && typeof value.word === 'string' && value.word.length <= 80 && optional(value, 'image', string) && optional(value, 'audio', string), 30);
  if (result.syllablePrompt !== undefined) check('words', words => words.length <= 30 && words.every(word => typeof word === 'string' && word.length <= 80 && word.split('-').filter(Boolean).length <= 12));

  check('letterGuessLives', Number.isInteger);
  array('letterGuessItems', value => value && typeof value.word === 'string' && value.word.length <= 80 && optional(value, 'image', string) && optional(value, 'audio', string), 20);
  if (result.letterGuessLives !== undefined) check('words', words => words.length <= 20 && words.every(word => typeof word === 'string' && (!word.trim() || word.normalize('NFC').replace(/-/g, '').trim().length <= 40 && /[a-zäöüßẞ]/i.test(word.normalize('NFC').replace(/-/g, '')) && /^[a-zäöüßẞ '’]+$/i.test(word.normalize('NFC').replace(/-/g, '').trim()))));

  array('clappingConfirmed', value => typeof value === 'string' && value.length <= 80, 16);
  array('clappingItems', value => value && typeof value.word === 'string' && value.word.length <= 80 && optional(value, 'image', string) && optional(value, 'audio', string) && optional(value, 'hideImage', v => typeof v === 'boolean') &&
    optional(value, 'syllables', parts => Array.isArray(parts) && parts.length <= 12 && parts.every(part => part && typeof part.text === 'string' && part.text.length <= 80 && optional(part, 'audio', string))), 16);
  if (result.clappingHelp !== undefined) check('words', words => words.length <= 16 && words.every(word => typeof word === 'string' && word.length <= 80 && word.split('-').filter(Boolean).length <= 12));

  const soundText = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 80;
  const synthesisSounds = new Set('b d f g h j k l m n p r s t v w z sch ch sp st pf qu a e i o u ä ö ü au ei eu äu ie'.split(' '));
  array('synthesisLetters', value => typeof value === 'string' && synthesisSounds.has(value.toLocaleLowerCase('de')), 36);
  array('synthesisPairs', value => value && soundText(value.left) && soundText(value.right), 12);
  array('synthesisSounds', value => value && soundText(value.sound) && typeof value.audio === 'string', 36);
  check('synthesisSounds', values => new Set(values.map(v => v.sound.normalize('NFC').trim().toLocaleLowerCase('de'))).size === values.length);
  array('synthesisPronunciations', value => value && soundText(value.text) && soundText(value.speak), 80);
  check('synthesisCount', Number.isInteger);

  const alphabetVariant = v => v && typeof v === 'object' && typeof v.word === 'string' && v.word.length <= 80 && optional(v, 'image', string) && optional(v, 'audio', string);
  const alphabetIds = new Set('a b c d e f g h i j k l m n o p q r s t u v w x y z ä ö ü ß sch ch ei au eu äu ie sp st pf ng ck tz ai'.split(' '));
  array('alphabetKeys', v => v && alphabetIds.has(v.id) && Array.isArray(v.variants) && v.variants.length >= 1 && v.variants.length <= 2 && v.variants.every(alphabetVariant), 44);
  array('alphabetPrompts', alphabetVariant, 40);
  check('alphabetKeys', values => new Set(values.map(v => v.id)).size === values.length);
  if (result.alphabetPractice !== undefined) check('words', words => words.length <= 40 && words.every(word => typeof word === 'string' && word.length <= 80));
  if (result.alphabetPractice === true) check('words', words => !words.length || words.some(word => word.replace(/-/g, '').trim()));

  const taskMedia = value => value && typeof value === 'object' && !Array.isArray(value) && optional(value, 'image', string) && optional(value, 'audio', string) && optional(value, 'hideText', v => typeof v === 'boolean');
  array('pairs', (v) => v && string(v.left) && string(v.right) && optional(v, 'leftMedia', taskMedia) && optional(v, 'rightMedia', taskMedia));
  array(
    'questions',
    (v) =>
      v &&
      string(v.text) &&
      Array.isArray(v.answers) &&
      v.answers.length >= 2 &&
      v.answers.every(string) &&
      Number.isInteger(v.correct) &&
      v.correct >= 0 &&
      v.correct < v.answers.length &&
      optional(v, 'explanation', string) && optional(v, 'media', taskMedia) && optional(v, 'answerMedia', media => Array.isArray(media) && media.length <= v.answers.length && media.every(taskMedia)),
  );
  array(
    'cells',
    (v) =>
      v &&
      string(v.label) &&
      optional(v, 'image', string) &&
      optional(v, 'speak', string),
  );
  array(
    'slides',
    (v) =>
      v &&
      string(v.title) &&
      string(v.text) &&
      optional(v, 'seconds', (n) => finite(n, 1, 3600)) &&
      optional(v, 'image', string) &&
      optional(v, 'audio', string),
  );
  array('tracks', track, 12);
  array('frames', frame, 100);
  array(
    'actors',
    (v) =>
      v &&
      string(v.symbol) &&
      string(v.color) &&
      optional(v, 'image', string) &&
      Array.isArray(v.frames) &&
      v.frames.length <= 100 &&
      v.frames.every(frame),
    9,
  );
  array(
    'points',
    (v) => v && string(v.label) && finite(v.x, 0, 100) && finite(v.y, 0, 100),
  );
  array('path', (v) => v && finite(v.x, 0, 100) && finite(v.y, 0, 100));
  array('notes', (v) => Number.isInteger(v) && finite(v, 0, 127));
  check('beats', beatRows);
  check(
    'background',
    (value) =>
      typeof value === 'string' &&
      (/^#[0-9a-f]{6}$/i.test(value) ||
        /^\/api\/medien\/[a-f0-9]{64}\.(png|jpg|webp)$/.test(value)),
  );
  return result;
}
export function mediaReferences(value) {
  const result = new Set();
  const visit = (v) => {
    if (
      typeof v === 'string' &&
      /^\/api\/medien\/[a-f0-9]{64}\.[a-z0-9]+$/.test(v)
    )
      result.add(v);
    else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === 'object') Object.values(v).forEach(visit);
  };
  visit(value);
  return [...result];
}
export function safeWebUrl(value) {
  if (typeof value !== 'string' || value.length > 2000)
    throw new Error('Ungültige Internetadresse.');
  const url = new URL(value);
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error('Nur HTTP- und HTTPS-Adressen sind erlaubt.');
  return url.href;
}
export function lockedDesign(element) {
  // Children fill a locked photo placeholder with their own picture.
  if ((element?.type === 'image' || element?.type === 'audio') && typeof element.placeholder === 'string') {
    const design = { ...element };
    for (const key of ['src', 'alt', 'credit', 'crop', 'fit']) delete design[key];
    return design;
  }
  // Children type their answer into a locked answer box.
  if (element?.type === 'text' && typeof element.placeholder === 'string') {
    const design = { ...element };
    for (const key of ['text', 'runs']) delete design[key];
    return design;
  }
  if (!['activity', 'widget'].includes(element.type)) return element;
  const design = { ...element };
  delete design.response;
  return design;
}
