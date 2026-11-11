// Fits text boxes into the ruling of a page: letter size from the ruling,
// one text line per ruled row and the baseline on the writing line. All in mm.
import { dimensions, type Page, type PageElement } from './notebook-model';

export type RulingRows = {
  /** Distance between two writing rows. */
  period: number;
  /** Baselines of the first and last usable row. */
  first: number;
  last: number;
  /** Height of the lower-case band (four-line ruling) or a sensible share of a single line. */
  xHeight: number;
  /** Room for capitals and ascenders above the baseline. */
  ascender: number;
};

/** Font measurements; in the browser they come from the real font files. */
export type TextMeasure = {
  /** x-height and cap height relative to the font size. */
  ratios: (font: string) => { xHeight: number; capHeight: number };
  /** Distance from the top of a text box to the first baseline. */
  baseline: (font: string, fontMm: number, lineMm: number) => number;
};

const lined = ['linie1', 'linie2', 'linie3', 'linie4', 'bildzeilen'];
const ptToMm = 25.4 / 72;

/** Writing rows of the page, or null for pages without lines. */
export function rulingRows(page: Pick<Page, 'ruling' | 'orientation'>): RulingRows | null {
  const r = page.ruling;
  if (!lined.includes(r)) return null;
  const { height } = dimensions(page);
  const top = r === 'bildzeilen' ? height * 0.53 : 15;
  const bottom = height - 15;
  // Must match RulingView: the pattern repeats from y = 0 of the page.
  const single = r === 'linie4' || r === 'bildzeilen';
  const gap = r === 'linie1' ? 5 : r === 'linie2' ? 4 : 3;
  const period = single ? 10 : gap * 4;
  const offset = single ? 9 : gap * 2 + 0.15;
  const above = single ? 0 : gap * 2;
  const below = single ? 0 : gap;
  let first = offset;
  while (first - above < top - 0.3) first += period;
  let last = first;
  while (last + period + below <= bottom + 0.3) last += period;
  return single
    ? { period, first, last, xHeight: period * 0.36, ascender: period * 0.6 }
    : { period, first, last, xHeight: gap, ascender: gap * 2 * 0.92 };
}

const round = (n: number, digits = 2) => Math.round(n * 10 ** digits) / 10 ** digits;

/**
 * Places a text element on the ruling. `autoSize` picks the letter size from
 * the ruling (new text, other font); otherwise the chosen size is kept and only
 * the line spacing follows the rows. Returns null when the text does not take
 * part: no lines, rotated, locked, framed or placed outside the ruled area.
 */
export function fitTextToRuling(
  el: PageElement,
  page: Pick<Page, 'ruling' | 'orientation'>,
  measure: TextMeasure,
  { autoSize = false, lines }: { autoSize?: boolean; lines?: number } = {},
): PageElement | null {
  const rows = rulingRows(page);
  if (!rows || el.type !== 'text' || el.locked || el.rotation % 360 !== 0) return null;
  if (el.textFrame && el.textFrame !== 'none') return null;
  if ((el.borderWidth ?? 0) > 0 || (el.background && el.background !== 'none')) return null;
  const font = el.font || 'Andika';
  let fontMm = (el.fontSize || 18) * ptToMm;
  if (autoSize) {
    const { xHeight, capHeight } = measure.ratios(font);
    fontMm = Math.min(rows.xHeight / xHeight, rows.ascender / capHeight);
  }
  const fontSize = Math.max(6, Math.min(150, round(fontMm / ptToMm, 1)));
  fontMm = fontSize * ptToMm;
  // Big letters take several rows; the gap between lines is always whole rows.
  const lineMm = Math.max(1, Math.ceil((fontMm * 1.1) / rows.period - 0.05)) * rows.period;
  const lineHeight = round(lineMm / fontMm, 4);
  const baseline = measure.baseline(font, fontMm, lineMm);
  const wanted = el.y + baseline;
  if (wanted < rows.first - rows.period || wanted > rows.last + rows.period) return null;
  const steps = Math.round((wanted - rows.first) / rows.period);
  const row = Math.max(rows.first, Math.min(rows.last, rows.first + steps * rows.period));
  const count = Math.max(1, lines ?? Math.round(el.height / lineMm - 0.1));
  return {
    ...el,
    fontSize,
    lineHeight,
    y: round(row - baseline, 3),
    height: round(count * lineMm, 3),
  };
}

/** Line spacing in mm of a text that sits on the ruling. */
export function rowHeight(el: PageElement) {
  return (el.fontSize || 18) * ptToMm * (el.lineHeight || 1.6);
}
