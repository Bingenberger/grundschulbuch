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
  for (const key of ['repeat', 'showWords', 'autoRead'])
    check(key, (v) => typeof v === 'boolean');
  for (const [key, min, max] of [
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
  array('pairs', (v) => v && string(v.left) && string(v.right));
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
      v.correct < v.answers.length,
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
  if (!['activity', 'widget'].includes(element.type)) return element;
  const design = { ...element };
  delete design.response;
  return design;
}
