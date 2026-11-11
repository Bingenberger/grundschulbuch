import { defaultWords, type LearningSettings, type LearningResponse } from './catalog';
export type AlphabetVariant = { word: string; symbol: string; hint?: string; image?: string; audio?: string };
export type AlphabetKey = { id: string; variants: AlphabetVariant[] };
const key = (id: string, word: string, symbol: string): AlphabetKey => ({ id, variants: [{ word, symbol }] });
export const alphabetKeys: AlphabetKey[] = [
  { id: 'a', variants: [{ word: 'Ameise', symbol: '🐜', hint: 'lang' }, { word: 'Apfel', symbol: '🍎', hint: 'kurz' }] },
  key('b', 'Ball', '⚽'), key('c', 'Clown', '🤡'), key('d', 'Dose', '🥫'),
  { id: 'e', variants: [{ word: 'Esel', symbol: '🫏', hint: 'lang' }, { word: 'Ente', symbol: '🦆', hint: 'kurz' }] },
  key('f', 'Fisch', '🐟'), key('g', 'Gabel', '🍴'), key('h', 'Haus', '🏠'),
  { id: 'i', variants: [{ word: 'Igel', symbol: '🦔', hint: 'lang' }, { word: 'Insel', symbol: '🏝', hint: 'kurz' }] },
  key('j', 'Jacke', '🧥'), key('k', 'Katze', '🐈'), key('l', 'Lampe', '💡'), key('m', 'Maus', '🐭'), key('n', 'Nase', '👃'),
  { id: 'o', variants: [{ word: 'Ofen', symbol: '♨', hint: 'lang' }, { word: 'Otter', symbol: '🦦', hint: 'kurz' }] },
  key('p', 'Pilz', '🍄'), key('q', 'Qualle', '🪼'), key('r', 'Rose', '🌹'), key('s', 'Sonne', '☀'), key('t', 'Tasse', '☕'),
  { id: 'u', variants: [{ word: 'U-Boot', symbol: '🚤', hint: 'lang' }, { word: 'Unterhose', symbol: '🩲', hint: 'kurz' }] },
  { id: 'v', variants: [{ word: 'Vogel', symbol: '🐦' }, { word: 'Vase', symbol: '🏺' }] },
  key('w', 'Wolke', '☁'), key('x', 'Xylophon', '🎵'), key('y', 'Yoga', '🧘'), key('z', 'Zebra', '🦓'),
  { id: 'ä', variants: [{ word: 'Bär', symbol: '🐻', hint: 'lang' }, { word: 'Äpfel', symbol: '🍏', hint: 'kurz' }] },
  { id: 'ö', variants: [{ word: 'Öl', symbol: '🫗', hint: 'lang' }, { word: 'Löffel', symbol: '🥄', hint: 'kurz' }] },
  { id: 'ü', variants: [{ word: 'Tür', symbol: '🚪', hint: 'lang' }, { word: 'Mütze', symbol: '🧢', hint: 'kurz' }] },
  key('ß', 'Fuß', '🦶'), key('sch', 'Schule', '🏫'),
  { id: 'ch', variants: [{ word: 'Buch', symbol: '📕' }, { word: 'Milch', symbol: '🥛' }] },
  key('ei', 'Eis', '🍦'), key('au', 'Auto', '🚗'), key('eu', 'Eule', '🦉'),
  key('äu', 'Mäuse', '🐭'), key('ie', 'Biene', '🐝'), key('sp', 'Spinne', '🕷'), key('st', 'Stern', '⭐'),
  key('pf', 'Pferd', '🐎'), key('ng', 'Ring', '💍'), key('ck', 'Jacke', '🧥'), key('tz', 'Katze', '🐈'), key('ai', 'Hai', '🦈'),
];
export const isVowelKey = (id: string) => ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü', 'ei', 'au', 'eu', 'äu', 'ie', 'ai'].includes(id);
export const upperGerman = (text: string) => text.replace(/ß/g, 'ẞ').toLocaleUpperCase('de');
export function letterText(text: string, settings: LearningSettings, shift = false) {
  if (!text) return '';
  if (settings.alphabetLetters === 'upper') return upperGerman(text);
  const lower = text.toLocaleLowerCase('de');
  return settings.alphabetLetters !== 'lower' && shift ? upperGerman(lower[0]) + lower.slice(1) : lower;
}
export function practiceWords(settings: LearningSettings) {
  return (settings.words?.length ? settings.words : defaultWords).slice(0, 40)
    .map(word => word.normalize('NFC').replace(/-/g, '').trim().replace(/\s+/g, ' ')).filter(Boolean).map(word =>
      settings.alphabetLetters === 'upper' ? upperGerman(word) : settings.alphabetLetters === 'lower' ? word.toLocaleLowerCase('de') : word);
}
export function resolvedAlphabet(settings: LearningSettings): AlphabetKey[] {
  return alphabetKeys.slice(0, settings.alphabetTable === 'full' ? 44 : 35).map(base => {
    const custom = settings.alphabetKeys?.find(k => k.id === base.id);
    return { id: base.id, variants: base.variants.map((variant, i) => ({ ...variant, ...custom?.variants[i] })) };
  });
}
export function alphabetRows(settings: LearningSettings): AlphabetKey[][] {
  const keys = resolvedAlphabet(settings), byId = new Map(keys.map(k => [k.id, k]));
  const rows = settings.alphabetLayout === 'qwertz'
    ? ['qwertzuiopü', 'asdfghjklöä', 'yxcvbnmß']
    : ['aäbcdef', 'ghijklm', 'noöpqrs', 'ßtuüvwxyz'];
  const extras = keys.filter(k => k.id.length > 1);
  return [...rows.map(row => Array.from(row).map(id => byId.get(id)!)), ...Array.from({ length: Math.ceil(extras.length / 7) }, (_, i) => extras.slice(i * 7, i * 7 + 7))];
}
export type AlphabetState = { exercise: string; tokens: string[]; prefix: string; variants: number[]; index: number; attempts: number; checked: boolean; correct: boolean; results: boolean[]; completed: boolean; shift: boolean };
function exercise(settings: LearningSettings) {
  return JSON.stringify(settings.alphabetPractice ? [true, settings.alphabetLetters || 'both', practiceWords(settings)] : [false]);
}
function initial(settings: LearningSettings): AlphabetState {
  const first = practiceWords(settings)[0] || '';
  return { exercise: exercise(settings), tokens: [], prefix: '', variants: [], index: 0, attempts: 0, checked: false, correct: false, results: [], completed: false,
    shift: settings.alphabetLetters !== 'lower' && settings.alphabetLetters !== 'upper' && (!settings.alphabetPractice || first[0] !== first[0]?.toLocaleLowerCase('de')) };
}
export function readAlphabet(response: LearningResponse, settings: LearningSettings): AlphabetState {
  const base = initial(settings), saved = response.alphabet;
  if (!saved || typeof saved !== 'object' || Array.isArray(saved) || saved.exercise !== base.exercise) {
    if (!saved && !settings.alphabetPractice && typeof response.text === 'string') {
      const text = response.text.normalize('NFC'), chars = Array.from(text);
      return chars.length > 200 ? { ...base, prefix: text, shift: false } : { ...base, tokens: chars, variants: chars.map(() => 0), shift: !text };
    }
    return base;
  }
  const words = practiceWords(settings);
  const index = Number.isInteger(saved.index) ? Math.max(0, Math.min(words.length - 1, Number(saved.index))) : 0;
  return { ...base, prefix: typeof saved.prefix === 'string' ? saved.prefix : '', tokens: Array.isArray(saved.tokens) ? saved.tokens.filter((t): t is string => typeof t === 'string').slice(0, 200) : [],
    variants: Array.isArray(saved.tokens) ? saved.tokens.slice(0, 200).map((_, i) => Array.isArray(saved.variants) && saved.variants[i] === 1 ? 1 : 0) : [],
    index: Math.max(0, index), attempts: Math.min(99, Math.max(0, Number(saved.attempts) || 0)), checked: saved.checked === true,
    correct: saved.correct === true, results: Array.isArray(saved.results) ? saved.results.filter((v): v is boolean => typeof v === 'boolean').slice(0, words.length) : [],
    completed: saved.completed === true && Array.isArray(saved.results) && saved.results.length === words.length, shift: saved.shift === true };
}
export type AlphabetAction = { type: 'insert'; text: string; physical?: boolean; variant?: number } | { type: 'backspace' | 'clear' | 'shift' | 'check' | 'next' | 'restart' };
export function alphabetStep(state: AlphabetState, settings: LearningSettings, action: AlphabetAction): AlphabetState {
  if (action.type === 'restart') return initial(settings);
  if (settings.alphabetPractice && state.completed) return state;
  if (action.type === 'shift') return settings.alphabetLetters && settings.alphabetLetters !== 'both' ? state : { ...state, shift: !state.shift };
  if (action.type === 'next') {
    if (!practiceWords(settings).length) return state;
    if (!settings.alphabetPractice || !state.correct && state.attempts < 2) return state;
    const words = practiceWords(settings), results = [...state.results.slice(0, state.index), state.correct];
    if (state.index + 1 >= words.length) return { ...state, results, completed: true };
    const next = words[state.index + 1];
    return { ...initial(settings), index: state.index + 1, results,
      shift: settings.alphabetLetters !== 'lower' && settings.alphabetLetters !== 'upper' && next[0] !== next[0]?.toLocaleLowerCase('de') };
  }
  if (state.correct && settings.alphabetPractice) return state;
  if (action.type === 'check') {
    if (!settings.alphabetPractice || !practiceWords(settings).length) return state;
    const expected = practiceWords(settings)[state.index] || '', actual = alphabetText(state).normalize('NFC');
    const correct = !!expected && (settings.alphabetLetters === 'upper' ? upperGerman(actual).replace(/ẞ/g, 'SS') === expected.replace(/ẞ/g, 'SS') : actual === expected);
    return { ...state, checked: true, correct, attempts: Math.min(99, state.attempts + 1) };
  }
  if (action.type === 'backspace') return { ...state, tokens: state.tokens.slice(0, -1), variants: state.variants.slice(0, -1), prefix: state.tokens.length ? state.prefix : Array.from(state.prefix).slice(0, -1).join(''), checked: false };
  if (action.type === 'clear') return { ...state, tokens: [], variants: [], prefix: '', checked: false };
  if (action.type !== 'insert') return state;
  const token = action.physical && (!settings.alphabetLetters || settings.alphabetLetters === 'both') ? action.text.normalize('NFC') : letterText(action.text.normalize('NFC'), settings, state.shift);
  if (state.tokens.length >= 200 || alphabetText(state).length + token.length > 20000 || !/^[\p{L} '’!?.,]+$/u.test(token) || token.length > 8) return state;
  return { ...state, tokens: [...state.tokens, token], variants: [...state.variants, action.variant === 1 ? 1 : 0], checked: false, shift: false };
}
export function alphabetText(state: AlphabetState) { return state.prefix + state.tokens.join(''); }
export function alphabetScore(state: AlphabetState, settings: LearningSettings) {
  const count = state.results.filter(Boolean).length + (!state.completed && state.correct ? 1 : 0);
  return Math.round(count / Math.max(1, practiceWords(settings).length) * 100);
}
/** Align corrections after missing/extra letters instead of marking every later
 * letter wrong. Missing positions show a box, without revealing the answer. */
export function alphabetFeedback(actual: string, expected: string): { text: string; status: 'right' | 'wrong' | 'missing' }[] {
  const a = Array.from(actual.normalize('NFC')).slice(0, 400), b = Array.from(expected.normalize('NFC')).slice(0, 400);
  const costs = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
  for (let i = 0; i <= a.length; i++) costs[i][0] = i;
  for (let j = 0; j <= b.length; j++) costs[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) costs[i][j] = Math.min(costs[i - 1][j] + 1, costs[i][j - 1] + 1, costs[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  const result: ReturnType<typeof alphabetFeedback> = [];
  let i = a.length, j = b.length;
  while (i || j) {
    if (i && j && costs[i][j] === costs[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
      result.push({ text: a[i - 1], status: a[i - 1] === b[j - 1] ? 'right' : 'wrong' }); i--; j--;
    } else if (i && costs[i][j] === costs[i - 1][j] + 1) { result.push({ text: a[--i], status: 'wrong' }); }
    else { result.push({ text: '□', status: 'missing' }); j--; }
  }
  return result.reverse();
}
