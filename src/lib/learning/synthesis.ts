import type { LearningSettings, LearningResponse } from './catalog';
import { shuffled } from './algorithms';
import { upperGerman } from './alphabet';

export const synthesisConsonants = ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'z', 'sch', 'ch', 'sp', 'st', 'pf', 'qu'];
export const synthesisVowels = ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü', 'au', 'ei', 'eu', 'äu', 'ie'];
export const defaultSynthesisLetters = ['m', 'l', 's', 'f', 'n', 'a', 'e', 'i', 'o', 'u'];
export const stretchableSound = (sound: string) => ['f', 'l', 'm', 'n', 'r', 's', 'sch', 'ch', 'v', 'w'].includes(sound.toLocaleLowerCase('de'));
export type SynthesisPair = { left: string; right: string };
export const normalSound = (text: string) => text.normalize('NFC').trim().toLocaleLowerCase('de');
export function synthesisMode(c: LearningSettings) { return c.synthesisMode || (c.words?.length ? 'pairs' : 'sounds'); }
export function knownSynthesisLetters(c: LearningSettings) {
  return Array.from(new Set((c.synthesisLetters || defaultSynthesisLetters).map(normalSound)))
    .filter(sound => synthesisConsonants.includes(sound) || synthesisVowels.includes(sound));
}
/** Preserve existing teacher-authored content without treating whole words as
 * a list of learned phonemes. Explicit legacy syllable separators take priority. */
export function customSynthesisPairs(c: LearningSettings): SynthesisPair[] {
  if (c.synthesisPairs) return c.synthesisPairs.slice(0, 12).map(p => ({ left: p.left.normalize('NFC').trim(), right: p.right.normalize('NFC').trim() })).filter(p => p.left && p.right);
  return (c.words || []).slice(0, 12).map(word => {
    const parts = word.normalize('NFC').trim().split('-').filter(Boolean);
    if (parts.length > 1) return { left: parts[0], right: parts.slice(1).join('') };
    const text = parts[0] || '', onset = [...synthesisConsonants].sort((a, b) => b.length - a.length).find(sound => normalSound(text).startsWith(sound));
    const count = onset?.length || Array.from(text)[0]?.length || 0;
    return { left: text.slice(0, count), right: text.slice(count) };
  }).filter(p => p.left && p.right);
}
export function synthesisPairs(c: LearningSettings, round = 0): SynthesisPair[] {
  if (synthesisMode(c) === 'pairs') return round ? shuffled(customSynthesisPairs(c), ((c.seed || 42) + round * 104729) >>> 0) : customSynthesisPairs(c);
  const known = knownSynthesisLetters(c), left = synthesisConsonants.filter(s => known.includes(s)), right = synthesisVowels.filter(s => known.includes(s));
  const pool = left.flatMap(l => right.map(r => ({ left: l, right: r })));
  if (!pool.length) return [];
  const count = Math.max(1, Math.min(12, Math.round(c.synthesisCount || 6))), result: SynthesisPair[] = [];
  for (let cycle = 0; result.length < count; cycle++) result.push(...shuffled(pool, ((c.seed || 42) + round * 104729 + cycle * 7919) >>> 0).slice(0, count - result.length));
  return result;
}
export function synthesisLabel(pair: SynthesisPair, c: LearningSettings): SynthesisPair {
  if (!c.synthesisCase && synthesisMode(c) === 'pairs') return pair;
  if (c.synthesisCase === 'upper') return { left: upperGerman(pair.left), right: upperGerman(pair.right) };
  const left = normalSound(pair.left), right = normalSound(pair.right);
  return { left: c.synthesisCase === 'mixed' ? upperGerman(left[0] || '') + left.slice(1) : left, right };
}
function exercise(c: LearningSettings) {
  return JSON.stringify(synthesisMode(c) === 'pairs' ? ['pairs', customSynthesisPairs(c), c.synthesisCase || 'original', c.seed || 42]
    : ['sounds', knownSynthesisLetters(c).sort(), c.synthesisCount || 6, c.seed || 42, c.synthesisCase || 'lower']);
}
export type SynthesisState = { exercise: string; round: number; index: number; phase: 'ready' | 'joined' | 'complete' };
export function readSynthesis(response: LearningResponse, c: LearningSettings): SynthesisState {
  const base: SynthesisState = { exercise: exercise(c), round: 0, index: 0, phase: 'ready' }, value = response.synthesis;
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.exercise !== base.exercise) return base;
  const round = Number.isInteger(value.round) ? Math.max(0, Math.min(1000000, Number(value.round))) : 0;
  const count = synthesisPairs(c, round).length;
  if (!count) return base;
  const phase = ['ready', 'joined', 'complete'].includes(String(value.phase)) ? value.phase as SynthesisState['phase'] : 'ready';
  return { ...base, round, phase, index: phase === 'complete' ? count : Math.max(0, Math.min(count - 1, Math.floor(Number(value.index) || 0))) };
}
export function synthesisStep(state: SynthesisState, c: LearningSettings, action: 'join' | 'advance' | 'restart' | 'new'): SynthesisState {
  if (action === 'restart' || action === 'new') return { ...state, index: 0, phase: 'ready', round: action === 'new' ? (state.round + 1) % 1000001 : state.round };
  const count = synthesisPairs(c, state.round).length;
  if (!count) return state;
  if (action === 'join') return state.phase === 'ready' ? { ...state, phase: 'joined' } : state;
  if (state.phase !== 'joined') return state;
  return state.index + 1 >= count ? { ...state, index: count, phase: 'complete' } : { ...state, index: state.index + 1, phase: 'ready' };
}
export const synthesisScore = (state: SynthesisState, c: LearningSettings) => Math.round(state.index / Math.max(1, synthesisPairs(c, state.round).length) * 100);

/** SVG coordinates already account for page zoom and object rotation. Cards
 * touch after travelling 40 of the 100 logical units of the activity. */
export function synthesisDrag(start: { x: number; y: number }, current: { x: number; y: number }, initial = 0) {
  return Math.max(0, Math.min(1, initial + (current.x - start.x) / 40));
}
export const synthesisVehicles = ['🚗', '🚂', '🚲', '🚀', '⛵', '🚌', '✈'];
export function synthesisVehicle(state: SynthesisState) {
  return shuffled(synthesisVehicles, (state.round * 104729 + state.index * 7919 + 42) >>> 0)[0];
}
