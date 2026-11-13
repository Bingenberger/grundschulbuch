// Hunderterfeld (and Zwanzigerfeld): paint dots, the covering angle, show a number.
import { clamp, seeded } from './placevalue';

export type FieldSettings = { size: 20 | 100; mode: 'paint' | 'cover' | 'show'; count: boolean; tasks: number };
export const FIELD_DEFAULTS: FieldSettings = { size: 100, mode: 'paint', count: true, tasks: 5 };
export function fieldSettings(raw: unknown): FieldSettings {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<FieldSettings>;
  return {
    size: v.size === 20 ? 20 : 100,
    mode: v.mode === 'cover' || v.mode === 'show' ? v.mode : 'paint',
    count: v.count !== false,
    tasks: clamp(v.tasks ?? FIELD_DEFAULTS.tasks, 1, 10),
  };
}

/** Dot colours: 0 empty, 1 red, 2 blue. */
export type Dot = 0 | 1 | 2;
export const DOT_COLORS = ['#ffffff', '#e03131', '#1c7ed6'];
export const painted = (dots: Dot[]) => dots.filter((d) => d > 0).length;
export const paint = (dots: Dot[], i: number, color: Dot): Dot[] => (dots[i] === color ? dots : dots.map((d, k) => (k === i ? color : d)));

/** Grid position of dot i: ten in a row, a gap after five (both ways). */
export function dotXY(i: number) {
  const row = Math.floor(i / 10), col = i % 10;
  return { x: 70 + col * 62 + (col >= 5 ? 22 : 0), y: 70 + row * 62 + (row >= 5 ? 22 : 0) };
}

/** Numbers to show: one to the size of the field, no number twice. */
export function fieldTasks(s: FieldSettings, seed: number): number[] {
  const rnd = seeded(seed), out: number[] = [];
  for (let tries = 0; out.length < s.tasks && tries < 500; tries++) {
    const n = 1 + Math.floor(rnd() * s.size);
    if (!out.includes(n)) out.push(n);
  }
  return out;
}
