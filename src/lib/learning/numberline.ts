// Zahlenstrahl: range, ticks, labels; free points and jumps or “find the number”.
import { clamp, seeded } from './placevalue';

export type NumberLineSettings = { start: number; end: number; labels: 'all' | 'big' | 'ends'; mode: 'free' | 'find'; values: boolean; tasks: number };
export const RANGES = [10, 20, 100, 1000];
export const NUMBERLINE_DEFAULTS: NumberLineSettings = { start: 0, end: 20, labels: 'all', mode: 'free', values: true, tasks: 5 };

export function numberLineSettings(raw: unknown): NumberLineSettings {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<NumberLineSettings>;
  const start = clamp(v.start ?? NUMBERLINE_DEFAULTS.start, 0, 999);
  const end = clamp(v.end ?? NUMBERLINE_DEFAULTS.end, start + 5, 1000);
  return {
    start,
    end,
    labels: v.labels === 'big' || v.labels === 'ends' ? v.labels : v.labels === 'all' ? 'all' : end - start <= 20 ? 'all' : 'big',
    mode: v.mode === 'find' ? 'find' : 'free',
    values: v.values !== false,
    tasks: clamp(v.tasks ?? NUMBERLINE_DEFAULTS.tasks, 1, 10),
  };
}

/** Small, middle and big tick steps: at most 100 small ticks. */
export function ticks(start: number, end: number) {
  const length = end - start;
  const small = [1, 2, 5, 10, 20, 50, 100].find((s) => length / s <= 100) ?? 100;
  const big = small * (small === 2 || small === 20 ? 5 : 10);
  const middle = small === 1 || small === 10 || small === 100 ? small * 5 : 0;
  return { small, middle, big };
}

/** Position on the line (x) and back; values snap to the small ticks. */
export const LINE = { x0: 70, x1: 930 };
export const xOf = (s: Pick<NumberLineSettings, 'start' | 'end'>, n: number) => LINE.x0 + ((n - s.start) / (s.end - s.start)) * (LINE.x1 - LINE.x0);
export function valueAt(s: Pick<NumberLineSettings, 'start' | 'end'>, x: number) {
  const { small } = ticks(s.start, s.end);
  const raw = s.start + ((x - LINE.x0) / (LINE.x1 - LINE.x0)) * (s.end - s.start);
  return Math.max(s.start, Math.min(s.end, Math.round(raw / small) * small));
}

export type Jump = { from: number; to: number };
/** Tapping a point that is there removes it; otherwise it is added. */
export function togglePoint(points: number[], n: number) {
  return points.includes(n) ? points.filter((p) => p !== n) : [...points, n].sort((a, b) => a - b);
}
export const jumpText = (j: Jump) => (j.to >= j.from ? `+${j.to - j.from}` : `−${j.from - j.to}`);

/** Numbers to find: on the small ticks, not the ends, no number twice. */
export function findTasks(s: NumberLineSettings, seed: number): number[] {
  const { small } = ticks(s.start, s.end);
  const rnd = seeded(seed), out: number[] = [];
  const steps = Math.round((s.end - s.start) / small);
  for (let tries = 0; out.length < s.tasks && tries < 500; tries++) {
    const n = s.start + (1 + Math.floor(rnd() * (steps - 1))) * small;
    if (!out.includes(n)) out.push(n);
  }
  return out;
}
