import { defaultWords, type LearningSettings, type LearningResponse } from './catalog';
import { wordBanks } from './words';
import { alphabetKeys } from './alphabet';
export const clapWord = (word: string) => word.normalize('NFC').replace(/-/g, '').trim();
const normal = (word: string) => clapWord(word).toLocaleLowerCase('de');
const dictionary = new Map(Object.values(wordBanks).flat().map(word => [normal(word), word.split('-')]));
for (const word of ['Son-ne', 'Blu-me', 'Re-gen-bo-gen', 'Scho-ko-la-de', 'Haus', 'Fa-mi-li-e', 'Feu-er', 'Bau-er', 'Fe-ri-en']) dictionary.set(normal(word), word.split('-'));
export type ClapWord = { word: string; parts: string[]; confirmed: boolean };
/** A suggestion for unfamiliar words, not an authoritative German syllabifier.
 * Existing teaching lists and explicitly marked syllables take priority. */
export function clapSyllables(input: string): ClapWord {
  const text = input.normalize('NFC').trim(), word = clapWord(text);
  if (text.includes('-')) return { word, parts: text.split('-').filter(Boolean), confirmed: true };
  const known = dictionary.get(normal(text));
  if (known) {
    let offset = 0;
    return { word, parts: known.map(part => { const value = word.slice(offset, offset + part.length); offset += part.length; return value; }), confirmed: true };
  }
  const nuclei: { start: number; end: number }[] = [];
  const lower = word.toLocaleLowerCase('de');
  for (let i = 0; i < lower.length; i++) if (/[aeiouäöüy]/.test(lower[i])) {
    if (lower[i] === 'u' && lower[i - 1] === 'q') continue;
    const pair = lower.slice(i, i + 2), end = ['au', 'ei', 'eu', 'äu', 'ie', 'ai', 'oi'].includes(pair) ? i + 2 : i + 1;
    nuclei.push({ start: i, end }); i = end - 1;
  }
  const cuts: number[] = [];
  for (let i = 1; i < nuclei.length; i++) {
    const previous = nuclei[i - 1], next = nuclei[i], between = lower.slice(previous.end, next.start);
    let cut = previous.end;
    if (between.length) {
      const cluster = ['sch', 'ch', 'ck', 'ph', 'th', 'qu'].find(part => between.endsWith(part));
      cut = next.start - (cluster?.length || 1);
    }
    if (cut > (cuts[cuts.length - 1] || 0)) cuts.push(cut);
  }
  const boundaries = [0, ...cuts, word.length];
  return { word, parts: boundaries.slice(1).map((end, i) => word.slice(boundaries[i], end)).filter(Boolean), confirmed: false };
}
export function clappingWords(c: LearningSettings): ClapWord[] {
  return (c.words?.length ? c.words : defaultWords).slice(0, 16).map(clapSyllables).filter(item => item.word.length > 0).map(item => ({ ...item, confirmed: item.confirmed || !!c.clappingConfirmed?.includes(item.parts.join('-')) }));
}
export function spellableClapWord(word: string, known: string[]) {
  if (!known.length) return true;
  const text = normal(word), sounds = known.map(normal).filter(Boolean), reachable = new Set([0]);
  for (let i = 0; i < text.length; i++) if (reachable.has(i)) for (const sound of sounds) if (text.startsWith(sound, i)) reachable.add(i + sound.length);
  return reachable.has(text.length);
}
const pictures: Record<string, string> = { sonne: '☀', blume: '🌼', regenbogen: '🌈', schokolade: '🍫', regen: '🌧', banane: '🍌', hunde: '🐕', hase: '🐇', biene: '🐝', tiger: '🐯', löwe: '🦁', bücher: '📚', birne: '🍐', tomate: '🍅', karotte: '🥕', kartoffel: '🥔', erde: '🌍', rose: '🌹', wasser: '💧' };
for (const key of alphabetKeys) for (const variant of key.variants) if (!pictures[normal(variant.word)]) pictures[normal(variant.word)] = variant.symbol;
export function clapPicture(word: string) { return pictures[normal(word)]; }
export function clapMedia(c: LearningSettings, word: string) { return c.clappingItems?.find(item => normal(item.word) === normal(word)); }
export type ClappingState = { exercise: string; index: number; claps: number; checked: boolean; correct: boolean; helped: boolean; results: boolean[]; completed: boolean };
function initial(c: LearningSettings): ClappingState {
  return { exercise: JSON.stringify(clappingWords(c).map(w => [w.word, w.parts, w.confirmed])), index: 0, claps: 0, checked: false, correct: false, helped: false, results: [], completed: false };
}
export function readClapping(response: LearningResponse, c: LearningSettings): ClappingState {
  const base = initial(c), saved = response.clapping;
  if (!saved || typeof saved !== 'object' || Array.isArray(saved) || saved.exercise !== base.exercise) return base;
  const words = clappingWords(c);
  return { ...base, index: Math.max(0, Math.min(words.length - 1, Math.floor(Number(saved.index) || 0))),
    claps: Math.max(0, Math.min(32, Math.floor(Number(saved.claps) || 0))), checked: saved.checked === true, correct: saved.correct === true,
    helped: saved.helped === true, results: Array.isArray(saved.results) ? saved.results.filter((r): r is boolean => typeof r === 'boolean').slice(0, words.length) : [],
    completed: saved.completed === true && Array.isArray(saved.results) && saved.results.length === words.length && words.length > 0 };
}
export type ClappingAction = { type: 'count'; count: number } | { type: 'clap' | 'check' | 'reset' | 'next' | 'restart' | 'help' };
export function clappingStep(state: ClappingState, c: LearningSettings, action: ClappingAction): ClappingState {
  if (action.type === 'restart') return initial(c);
  if (state.completed) return state;
  const words = clappingWords(c), word = words[state.index];
  if (!word) return state;
  if (action.type === 'help') return word.confirmed ? { ...state, helped: true } : state;
  if (action.type === 'reset') return { ...state, claps: 0, checked: false, correct: false };
  if (action.type === 'next') {
    const results = [...state.results.slice(0, state.index), state.checked && state.correct];
    return state.index + 1 >= words.length ? { ...state, results, completed: true } : { ...initial(c), index: state.index + 1, results };
  }
  if (action.type === 'check') return word.confirmed ? { ...state, checked: true, correct: state.claps === word.parts.length } : state;
  if (state.correct) return state;
  const claps = action.type === 'count' ? action.count : state.claps + 1;
  return Number.isFinite(claps) ? { ...state, claps: Math.min(32, Math.max(0, Math.floor(claps))), checked: false, correct: false } : state;
}
export function clappingScore(state: ClappingState, c: LearningSettings) {
  const right = state.results.filter(Boolean).length + (!state.completed && state.checked && state.correct ? 1 : 0);
  return Math.round(right / Math.max(1, clappingWords(c).length) * 100);
}
