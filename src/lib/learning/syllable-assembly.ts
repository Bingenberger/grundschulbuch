import { defaultWords, type LearningSettings, type LearningResponse } from './catalog';
import { clapSyllables, clapWord } from './clapping';
import { shuffled } from './algorithms';
export function assemblyWords(c: LearningSettings) {
  return (c.words || defaultWords).slice(0, 30).map(clapSyllables).filter(word => word.word && word.word.length <= 80 && word.parts.length <= 12)
    .map(word => ({ ...word, confirmed: word.confirmed || !!c.syllableConfirmed?.includes(word.parts.join('-')) }));
}
export function assemblyMedia(c: LearningSettings, word: string) {
  return c.syllableItems?.find(item => clapWord(item.word).toLocaleLowerCase('de') === clapWord(word).toLocaleLowerCase('de'));
}
export function assemblyTiles(c: LearningSettings, index: number) {
  const parts = assemblyWords(c)[index]?.parts || [], mixed = shuffled(parts.map((text, id) => ({ text, id })), (c.seed ?? 42) + index * 7919);
  if (mixed.length > 1 && mixed.every((tile, i) => tile.id === i)) mixed.push(mixed.shift()!);
  return mixed;
}
export type AssemblyState = { exercise: string; index: number; placed: number[]; checked: boolean; correct: boolean; results: boolean[]; completed: boolean };
function initial(c: LearningSettings): AssemblyState {
  const words = assemblyWords(c);
  return { exercise: JSON.stringify(words.map(word => [word.word, word.parts, word.confirmed])), index: 0, placed: (words[0]?.parts || []).map(() => -1), checked: false, correct: false, results: [], completed: false };
}
export function assemblyCorrect(state: AssemblyState, c: LearningSettings) {
  const word = assemblyWords(c)[state.index];
  return !!word?.confirmed && state.placed.length === word.parts.length && word.parts.every((text, i) => state.placed[i] >= 0 && word.parts[state.placed[i]] === text);
}
export function readAssembly(response: LearningResponse, c: LearningSettings): AssemblyState {
  const base = initial(c), value = response.syllableAssembly, words = assemblyWords(c);
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.exercise !== base.exercise) return base;
  const index = Math.max(0, Math.min(words.length - 1, Math.floor(Number(value.index) || 0))), used = new Set<number>();
  const placed = (words[index]?.parts || []).map((_, i, parts) => {
    const source = Array.isArray(value.placed) ? Number(value.placed[i]) : -1;
    if (!Number.isInteger(source) || source < 0 || source >= parts.length || used.has(source)) return -1;
    used.add(source); return source;
  });
  const result = { ...base, index, placed, checked: value.checked === true, correct: false, results: Array.isArray(value.results) ? value.results.filter((right): right is boolean => typeof right === 'boolean').slice(0, words.length) : [], completed: value.completed === true && Array.isArray(value.results) && value.results.length === words.length && words.length > 0 };
  result.correct = result.checked && assemblyCorrect(result, c); return result;
}
export type AssemblyAction = { type: 'place'; slot: number; tile: number } | { type: 'check' | 'reset' | 'next' | 'skip' | 'restart' };
export function assemblyStep(state: AssemblyState, c: LearningSettings, action: AssemblyAction): AssemblyState {
  if (action.type === 'restart') return initial(c);
  const words = assemblyWords(c), word = words[state.index];
  if (!word || state.completed) return state;
  if (action.type === 'reset') return { ...state, placed: word.parts.map(() => -1), checked: false, correct: false };
  if (action.type === 'next' || action.type === 'skip') {
    if (action.type === 'next' && !state.correct) return state;
    const results = [...state.results.slice(0, state.index), state.checked && state.correct];
    return state.index + 1 >= words.length ? { ...state, results, completed: true } : { ...initial(c), index: state.index + 1, placed: words[state.index + 1].parts.map(() => -1), results };
  }
  if (state.correct) return state;
  if (action.type === 'check') return word.confirmed && state.placed.every(tile => tile >= 0) ? { ...state, checked: true, correct: assemblyCorrect(state, c) } : state;
  if (action.type !== 'place' || !Number.isInteger(action.slot) || action.slot < 0 || action.slot >= word.parts.length || !Number.isInteger(action.tile) || action.tile < -1 || action.tile >= word.parts.length) return state;
  return { ...state, placed: word.parts.map((_, i) => i === action.slot ? action.tile : state.placed[i] === action.tile ? -1 : state.placed[i]), checked: false, correct: false };
}
export function assemblyScore(state: AssemblyState, c: LearningSettings) {
  return Math.round((state.results.filter(Boolean).length + (!state.completed && state.correct ? 1 : 0)) / Math.max(1, assemblyWords(c).length) * 100);
}
