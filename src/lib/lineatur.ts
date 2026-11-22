// Lineatur as a building block: a ruled area on part of the page. Measures follow
// the original papers of Lernsachen-Heft (1400 units = 297 mm). All in mm.
import type { PageElement } from './notebook-model';
import type { RulingRows } from './text-fit';

export const LINEATUR_KINDS = ['linie1', 'linie2', 'linie3', 'linie4', 'linieneng', 'karo5', 'karo10', 'rechnen', 'punkte', 'noten'] as const;
export type LineaturKind = (typeof LINEATUR_KINDS)[number];
export const lineaturLabels: Record<LineaturKind, string> = {
  linie1: 'Lineatur 1',
  linie2: 'Lineatur 2',
  linie3: 'Lineatur 3',
  linie4: 'Linien',
  linieneng: 'Linien eng',
  karo5: 'Kariert · 5 mm',
  karo10: 'Kariert · 1 cm',
  rechnen: 'Rechenkästchen',
  punkte: 'Punktraster',
  noten: 'Notenlinien',
};
export type LineaturSettings = { ruling: LineaturKind; house?: boolean; color?: string };

const U = 297 / 1400;
const FOUR: Partial<Record<LineaturKind, { band: number; pitch: number }>> = {
  linie1: { band: 34 * U, pitch: 152 * U },
  linie2: { band: 26 * U, pitch: 116 * U },
  linie3: { band: 20 * U, pitch: 90 * U },
};
const SINGLE: Partial<Record<LineaturKind, number>> = { linie4: 52 * U, linieneng: 40 * U };
export const LINE_COLORS: Record<string, string> = {
  four: '#5b8fd6', single: '#7da2d6', grid: '#9db8e6', dots: '#8aa2c8', music: '#475569',
};
/** Room above the first line, so its stroke is not cut off. */
const INSET = 0.4;

export const isFourLine = (kind: LineaturKind) => !!FOUR[kind];
/** Writing lines (not grids or staves): text can sit on them. */
export const isWritingLines = (kind: LineaturKind) => !!FOUR[kind] || !!SINGLE[kind];

export function lineaturSettings(el: Pick<PageElement, 'settings'>): LineaturSettings {
  const raw = (el.settings as { lineatur?: Partial<LineaturSettings> } | undefined)?.lineatur;
  const ruling = raw?.ruling && (LINEATUR_KINDS as readonly string[]).includes(raw.ruling) ? raw.ruling : 'linie1';
  return { ruling, house: !!raw?.house && isFourLine(ruling), color: raw?.color };
}

export const isLineatur = (el: PageElement) => el.type === 'widget' && el.widgetKind === 'lineatur';

/** Width of the little Zeilenhaus at the start of each row. */
export const houseWidth = (band: number) => band * 1.7;

export type FourLineLayout = { kind: 'four'; band: number; pitch: number; tops: number[]; left: number };
export type SingleLayout = { kind: 'single'; pitch: number; lines: number[] };
export type GridLayout = { kind: 'grid' | 'boxes' | 'dots'; step: number; xs: number[]; ys: number[] };
export type MusicLayout = { kind: 'music'; gap: number; tops: number[] };
export type LineaturLayout = FourLineLayout | SingleLayout | GridLayout | MusicLayout;

/** Where the lines of a Lineatur of this size lie, relative to its top left corner. */
export function lineaturLayout(s: LineaturSettings, width: number, height: number): LineaturLayout {
  const four = FOUR[s.ruling];
  if (four) {
    const count = Math.max(0, Math.floor((height - 2 * INSET - 3 * four.band) / four.pitch + 1e-6) + 1);
    return { kind: 'four', ...four, tops: Array.from({ length: count }, (_, i) => INSET + i * four.pitch), left: s.house ? houseWidth(four.band) + 1 : 0 };
  }
  const single = SINGLE[s.ruling];
  if (single) {
    const first = single * 0.85;
    const count = Math.max(0, Math.floor((height - first - INSET) / single + 1e-6) + 1);
    return { kind: 'single', pitch: single, lines: Array.from({ length: count }, (_, i) => first + i * single) };
  }
  if (s.ruling === 'noten') {
    const gap = 16 * U, pitch = 128 * U;
    const count = Math.max(0, Math.floor((height - 2 * INSET - 4 * gap) / pitch + 1e-6) + 1);
    return { kind: 'music', gap, tops: Array.from({ length: count }, (_, i) => INSET + i * pitch) };
  }
  const step = s.ruling === 'karo5' || s.ruling === 'punkte' ? 5 : 10;
  // The grid sits in the middle of the box, so both sides look the same.
  const along = (size: number) => {
    const n = Math.floor(size / step + 1e-6);
    const start = (size - n * step) / 2;
    return Array.from({ length: n + 1 }, (_, i) => start + i * step);
  };
  return { kind: s.ruling === 'rechnen' ? 'boxes' : s.ruling === 'punkte' ? 'dots' : 'grid', step, xs: along(width), ys: along(height) };
}

/** Writing rows of a Lineatur in page coordinates, or null for grids and staves. */
export function lineaturRows(el: PageElement): RulingRows | null {
  if (!isLineatur(el) || el.rotation % 360 !== 0) return null;
  const layout = lineaturLayout(lineaturSettings(el), el.width, el.height);
  if (layout.kind === 'four') {
    if (!layout.tops.length) return null;
    const first = el.y + layout.tops[0] + 2 * layout.band;
    return { period: layout.pitch, first, last: first + (layout.tops.length - 1) * layout.pitch, xHeight: layout.band, ascender: layout.band * 2 * 0.92 };
  }
  if (layout.kind === 'single') {
    if (!layout.lines.length) return null;
    const first = el.y + layout.lines[0];
    return { period: layout.pitch, first, last: first + (layout.lines.length - 1) * layout.pitch, xHeight: layout.pitch * 0.33, ascender: layout.pitch * 0.65 };
  }
  return null;
}

/** The Lineatur a text box sits on (the topmost one it overlaps), with its rows. */
export function lineaturUnder(elements: PageElement[], text: Pick<PageElement, 'id' | 'x' | 'y' | 'width' | 'height'>) {
  for (let i = elements.length - 1; i >= 0; i--) {
    const l = elements[i];
    if (l.id === text.id || !isLineatur(l)) continue;
    const rows = lineaturRows(l);
    if (!rows) continue;
    const overlapX = Math.min(text.x + text.width, l.x + l.width) - Math.max(text.x, l.x);
    if (overlapX < Math.min(text.width, l.width) / 2) continue;
    if (text.y + text.height < l.y - rows.period / 2 || text.y > l.y + l.height) continue;
    return { element: l, rows };
  }
  return null;
}

/** Start size of a new Lineatur: a few rows across a portrait page. */
export function lineaturStartSize(s: LineaturSettings) {
  const width = 180;
  const up = (mm: number) => Math.ceil(mm * 10) / 10;
  const four = FOUR[s.ruling];
  if (four) {
    const rows = s.ruling === 'linie1' ? 3 : s.ruling === 'linie2' ? 4 : 5;
    return { width, height: up(2 * INSET + 3 * four.band + (rows - 1) * four.pitch) };
  }
  const single = SINGLE[s.ruling];
  if (single) return { width, height: up(single * 0.85 + 7 * single + INSET * 2) };
  if (s.ruling === 'noten') return { width, height: up(2 * INSET + 4 * 16 * U + 2 * 128 * U) };
  return { width, height: 60 };
}

/**
 * Elements that lie on a Lineatur being moved and go along with it: text and
 * writing on top of it (later in the list), not locked, inside its box.
 */
export function ridersOf(elements: PageElement[], moving: PageElement[]) {
  const ids = new Set(moving.map((el) => el.id));
  const riders: PageElement[] = [];
  for (const l of moving) {
    if (!isLineatur(l)) continue;
    const at = elements.findIndex((el) => el.id === l.id);
    elements.forEach((el, i) => {
      if (i <= at || ids.has(el.id) || el.locked || isLineatur(el)) return;
      const inside = el.x >= l.x - 1 && el.y >= l.y - 3 && el.x + el.width <= l.x + l.width + 1 && el.y + el.height <= l.y + l.height + 3;
      if (!inside) return;
      ids.add(el.id);
      riders.push(el);
    });
  }
  return riders;
}
