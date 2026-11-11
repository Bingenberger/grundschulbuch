export type EffectId = 'bright' | 'contrast' | 'vivid' | 'pale' | 'scan' | 'gray' | 'sepia' | 'warm' | 'cold' | 'invert';
export type Effects = Partial<Record<EffectId, number>>;
export type Rect = { x: number; y: number; w: number; h: number };
export type EditStep =
  | { type: 'rotate'; dir: 1 | -1 }
  | { type: 'flip' }
  | ({ type: 'crop' } & Rect)
  | ({ type: 'bar' } & Rect)
  | { type: 'pixel'; r: number; pts: [number, number][] };
export type Pixels = { width: number; height: number; data: Uint8ClampedArray };
export const EFFECTS: readonly EffectId[];
export const EFFECT_DEFAULTS: Record<EffectId, number>;
export const EXCLUSIVE: readonly EffectId[][];
export const MAX_SIDE: number;
export function toggleEffect(effects: Effects, id: EffectId): Effects;
export function applyEffects(img: Pixels, effects: Effects): Pixels;
export function rotate(img: Pixels, dir: 1 | -1): Pixels;
export function flip(img: Pixels): Pixels;
export function crop(img: Pixels, rect: Rect): Pixels;
export function bar(img: Pixels, rect: Rect): Pixels;
export function pixelate(img: Pixels, stroke: { r: number; pts: [number, number][] }): Pixels;
export function applyStep(img: Pixels, step: EditStep): Pixels;
export function render(img: Pixels, steps: EditStep[], effects: Effects): Pixels;
export function resultSize(width: number, height: number, steps: EditStep[]): { width: number; height: number };
export function cleanEdit(input: unknown): { steps: EditStep[]; effects: Effects };
