import { defaultWords, type LearningSettings, type LearningResponse } from './catalog';
import { upperGerman } from './alphabet';
export const guessAlphabet = Array.from('abcdefghijklmnopqrstuvwxyzäöüß');
export function guessWord(text: string) { return text.normalize('NFC').replace(/-/g, '').trim().replace(/\s+/g, ' '); }
export function validGuessWord(text: string) {
  const word = guessWord(text);
  return word.length > 0 && word.length <= 40 && /[a-zäöüßẞ]/i.test(word) && /^[a-zäöüßẞ '’]+$/i.test(word);
}
export function guessWords(c: LearningSettings) { return (c.words || defaultWords).slice(0, 20).map(guessWord).filter(validGuessWord); }
export const canonicalGuess = (letter: string) => letter.normalize('NFC').toLocaleLowerCase('de');
export function guessLimit(c: LearningSettings) { return Math.max(4, Math.min(12, Math.round(c.letterGuessLives || 8))); }
export function guessDisplay(text: string, c: LearningSettings) { return c.letterGuessCase === 'lower' ? text.toLocaleLowerCase('de') : upperGerman(text); }
export function guessRows(c: LearningSettings) {
  return (c.letterGuessLayout === 'qwertz' ? ['qwertzuiopü', 'asdfghjklöä', 'yxcvbnmß'] : ['aäbcdef', 'ghijklm', 'noöpqrs', 'ßtuüvwxyz']).map(row => Array.from(row));
}
export function guessMedia(c: LearningSettings, word: string) { return c.letterGuessItems?.find(item => canonicalGuess(guessWord(item.word)) === canonicalGuess(word)); }
export type LetterGuessState = { exercise: string; index: number; guessed: string[]; revealed: boolean; results: boolean[]; completed: boolean };
function initial(c: LearningSettings): LetterGuessState { return { exercise: JSON.stringify([guessWords(c), guessLimit(c)]), index: 0, guessed: [], revealed: false, results: [], completed: false }; }
export function readLetterGuess(response: LearningResponse, c: LearningSettings): LetterGuessState {
  const base = initial(c), value = response.letterGuess, words = guessWords(c);
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.exercise !== base.exercise) return base;
  return { ...base, index: Math.max(0, Math.min(words.length - 1, Math.floor(Number(value.index) || 0))),
    guessed: Array.isArray(value.guessed) ? Array.from(new Set(value.guessed.filter((item): item is string => typeof item === 'string').map(canonicalGuess))).filter(letter => guessAlphabet.includes(letter)) : [],
    revealed: value.revealed === true, results: Array.isArray(value.results) ? value.results.filter((item): item is boolean => typeof item === 'boolean').slice(0, words.length) : [],
    completed: words.length > 0 && value.completed === true && Array.isArray(value.results) && value.results.length === words.length };
}
export function wrongGuesses(state: LetterGuessState, c: LearningSettings) {
  const letters = new Set(Array.from(canonicalGuess(guessWords(c)[state.index] || '')));
  return state.guessed.filter(letter => !letters.has(letter));
}
export function guessPhase(state: LetterGuessState, c: LearningSettings): 'playing' | 'won' | 'lost' | 'revealed' {
  if (state.revealed) return 'revealed';
  const letters = Array.from(new Set(Array.from(canonicalGuess(guessWords(c)[state.index] || '')).filter(letter => guessAlphabet.includes(letter))));
  if (letters.length && letters.every(letter => state.guessed.includes(letter))) return 'won';
  return wrongGuesses(state, c).length >= guessLimit(c) ? 'lost' : 'playing';
}
export type LetterGuessAction = { type: 'guess'; letter: string } | { type: 'reveal' | 'retry' | 'next' | 'restart' };
export function letterGuessStep(state: LetterGuessState, c: LearningSettings, action: LetterGuessAction): LetterGuessState {
  if (action.type === 'restart') return initial(c);
  if (state.completed || !guessWords(c).length) return state;
  if (action.type === 'retry') return { ...state, guessed: [], revealed: false };
  const phase = guessPhase(state, c);
  if (action.type === 'next') {
    if (phase === 'playing') return state;
    const results = [...state.results.slice(0, state.index), phase === 'won'];
    return state.index + 1 >= guessWords(c).length ? { ...state, results, completed: true } : { ...initial(c), index: state.index + 1, results };
  }
  if (phase !== 'playing') return state;
  if (action.type === 'reveal') return { ...state, revealed: true };
  if (action.type !== 'guess') return state;
  const letter = canonicalGuess(action.letter);
  if (!guessAlphabet.includes(letter) || state.guessed.includes(letter)) return state;
  return { ...state, guessed: [...state.guessed, letter] };
}
export function letterGuessScore(state: LetterGuessState, c: LearningSettings) {
  return Math.round((state.results.filter(Boolean).length + (!state.completed && guessPhase(state, c) === 'won' ? 1 : 0)) / Math.max(1, guessWords(c).length) * 100);
}
export function guessSlots(state: LetterGuessState, c: LearningSettings) {
  const phase = guessPhase(state, c);
  return Array.from(guessWords(c)[state.index] || '').map(letter => ({ text: guessDisplay(letter, c), letter: guessAlphabet.includes(canonicalGuess(letter)), visible: !guessAlphabet.includes(canonicalGuess(letter)) || state.guessed.includes(canonicalGuess(letter)) || phase === 'lost' || phase === 'revealed' }));
}
