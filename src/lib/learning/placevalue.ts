// Place values for the Stellenwerttafel and the Dienes material: places,
// Montessori colours, bundling and unbundling, tasks.

export type Place = { id: string; short: string; name: string; value: number; color: string; light: string };

/** Montessori colours: Einer green, Zehner blue, Hunderter red – and again for each class. */
const GREEN = { color: '#2f9e44', light: '#ebfbee' };
const BLUE = { color: '#1c7ed6', light: '#e7f5ff' };
const RED = { color: '#e03131', light: '#fff5f5' };
export const PLACES: Place[] = [
  { id: 'E', short: 'E', name: 'Einer', value: 1, ...GREEN },
  { id: 'Z', short: 'Z', name: 'Zehner', value: 10, ...BLUE },
  { id: 'H', short: 'H', name: 'Hunderter', value: 100, ...RED },
  { id: 'T', short: 'T', name: 'Tausender', value: 1000, ...GREEN },
  { id: 'ZT', short: 'ZT', name: 'Zehntausender', value: 10000, ...BLUE },
  { id: 'HT', short: 'HT', name: 'Hunderttausender', value: 100000, ...RED },
];

/** Shown places, largest first (as written: T H Z E). */
export function shownPlaces(from: number, to: number): Place[] {
  const lo = clamp(Math.min(from, to), 0, PLACES.length - 1);
  const hi = clamp(Math.max(from, to), 0, PLACES.length - 1);
  return PLACES.slice(lo, hi + 1).reverse();
}

export const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(Number(n) || 0)));

/** Counts per shown place (index like `shownPlaces`). */
export type Counts = number[];
export const MAX_PER_PLACE = 19;

export const countsValue = (places: Place[], counts: Counts) => places.reduce((sum, p, i) => sum + p.value * (counts[i] || 0), 0);

/** A fresh table: no counters, or the digits of a starting number. */
export function emptyCounts(places: Place[]): Counts {
  return places.map(() => 0);
}
export function countsOf(places: Place[], n: number): Counts {
  return places.map((p, i) => (i === 0 ? Math.floor(n / p.value) : Math.floor((n % places[i - 1].value) / p.value)));
}

export function addOne(counts: Counts, i: number): Counts {
  return counts.map((c, k) => (k === i ? Math.min(MAX_PER_PLACE, c + 1) : c));
}
export function takeOne(counts: Counts, i: number): Counts {
  return counts.map((c, k) => (k === i ? Math.max(0, c - 1) : c));
}
/** Ten of a place become one of the next bigger place (column to the left). */
export function canBundle(counts: Counts, i: number) {
  return i > 0 && (counts[i] || 0) >= 10 && (counts[i - 1] || 0) < MAX_PER_PLACE;
}
export function bundle(counts: Counts, i: number): Counts {
  if (!canBundle(counts, i)) return counts;
  return counts.map((c, k) => (k === i ? c - 10 : k === i - 1 ? c + 1 : c));
}
/** One of a place becomes ten of the next smaller place (column to the right). */
export function canUnbundle(counts: Counts, i: number) {
  return i < counts.length - 1 && (counts[i] || 0) >= 1 && (counts[i + 1] || 0) + 10 <= MAX_PER_PLACE;
}
export function unbundle(counts: Counts, i: number): Counts {
  if (!canUnbundle(counts, i)) return counts;
  return counts.map((c, k) => (k === i ? c - 1 : k === i + 1 ? c + 10 : c));
}

/** “3 T 4 H 0 Z 7 E” */
export function placeText(places: Place[], counts: Counts) {
  return places.map((p, i) => `${counts[i] || 0} ${p.short}`).join(' ');
}
/** 12345 → “12 345” */
export const numberText = (n: number) => (n >= 10000 ? n.toLocaleString('de-DE').replace(/\./g, ' ') : String(n));

/** Repeatable random numbers for tasks. */
export function seeded(seed: number) {
  let s = (Math.abs(Math.floor(seed)) % 2147483646) + 1;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}
/** Numbers to lay: every shown place used, no number twice. */
export function placeTasks(places: Place[], count: number, seed: number): number[] {
  const rnd = seeded(seed);
  const smallest = places[places.length - 1].value;
  const max = places[0].value * 10 - smallest;
  const out: number[] = [];
  for (let tries = 0; out.length < count && tries < 500; tries++) {
    const n = Math.round((smallest + rnd() * (max - smallest)) / smallest) * smallest;
    if (n >= smallest && !out.includes(n)) out.push(n);
  }
  return out;
}

export type PlaceSettings = { from: number; to: number; counters: boolean; digits: boolean; total: boolean; exchange: boolean; tasks: number };
export const PLACE_DEFAULTS: PlaceSettings = { from: 0, to: 2, counters: true, digits: true, total: true, exchange: true, tasks: 0 };
export function placeSettings(raw: unknown): PlaceSettings {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<PlaceSettings>;
  return {
    from: clamp(v.from ?? PLACE_DEFAULTS.from, 0, 4),
    to: clamp(v.to ?? PLACE_DEFAULTS.to, 1, 5),
    counters: v.counters !== false,
    digits: v.digits !== false,
    total: v.total !== false,
    exchange: v.exchange !== false,
    tasks: clamp(v.tasks ?? 0, 0, 10),
  };
}

/** State of a task series: which task, right ones, the last check. */
export type TaskState = { seed: number; at: number; right: number; checked: 'right' | 'wrong' | null };
export const freshTasks = (seed: number): TaskState => ({ seed, at: 0, right: 0, checked: null });
