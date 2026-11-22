// Fits text boxes into the ruling of a page: letter size from the ruling,
// one text line per ruled row and the baseline on the writing line. All in mm.
import { dimensions, type Page, type PageElement } from './notebook-model';
import {fontFamilyFor} from './template-font';
import { lineaturUnder } from './lineatur';

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
export function rulingRows(page: Pick<Page, 'ruling' | 'orientation' | 'templateRuling'> & Partial<Pick<Page,'paperMode'|'elements'>>): RulingRows | null {
  const endless = page.paperMode === 'endless';
  if(page.templateRuling){
    const g=page.templateRuling,first=g.top+g.baseline;
    if(endless){
      // The rows go on above and below the first sheet.
      const area=dimensions(page);
      return{period:g.pitch,first:first+Math.ceil((area.top-first)/g.pitch)*g.pitch,last:first+Math.floor((area.top+area.height-g.pitch-first)/g.pitch)*g.pitch,xHeight:g.xHeight,ascender:g.baseline||g.pitch*.65};
    }
    return{period:g.pitch,first,last:first+(g.count-1)*g.pitch,xHeight:g.xHeight,ascender:g.baseline||g.pitch*.65};
  }
  const r = page.ruling;
  if (!lined.includes(r)) return null;
  const area = dimensions(page);
  const height = area.height;
  const top = endless ? area.top : r === 'bildzeilen' ? height * 0.53 : 15;
  const bottom = endless ? area.top + area.height : height - 15;
  // Must match RulingView: the pattern repeats from y = 0 of the page.
  const single = r === 'linie4' || r === 'bildzeilen';
  const gap = r === 'linie1' ? 5 : r === 'linie2' ? 4 : 3;
  const period = single ? 10 : gap * 4;
  const offset = single ? 9 : gap * 2 + 0.15;
  const above = single ? 0 : gap * 2;
  const below = single ? 0 : gap;
  let first = offset + Math.floor((top - offset) / period) * period;
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
  page: Pick<Page, 'ruling' | 'orientation' | 'templateRuling'> & Partial<Pick<Page,'paperMode'|'elements'>>,
  measure: TextMeasure,
  { autoSize = false, lines }: { autoSize?: boolean; lines?: number } = {},
): PageElement | null {
  if (el.type !== 'text' || el.locked || el.rotation % 360 !== 0) return null;
  if (el.textFrame && el.textFrame !== 'none') return null;
  if ((el.borderWidth ?? 0) > 0 || (el.background && el.background !== 'none')) return null;
  // A Lineatur on the page (building block) comes before the ruling of the page itself.
  const local = page.elements ? lineaturUnder(page.elements, el) : null;
  const rows = local?.rows ?? rulingRows(page);
  if (!rows) return null;
  const font = fontFamilyFor(el);
  const g=local?undefined:page.templateRuling;
  if(g&&page.paperMode!=='endless'&&(el.x+el.width<=g.left||el.x>=g.right||el.y>rows.last||el.y+el.height<g.top-g.pitch))return null;
  if(el.textLinePitch&&g)return {...el,lineHeight:el.textLinePitch/((el.fontSize||18)*ptToMm),...(lines!==undefined?{height:round(Math.max(1,lines)*el.textLinePitch,3)}:{})};
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
    ...(g?{textLinePitch:lineMm}:local?{textLinePitch:undefined}:{}),
    y: round(row - baseline, 3),
    height: round(count * lineMm, 3),
  };
}

/** Line spacing in mm of a text that sits on the ruling. */
export function rowHeight(el: PageElement) {
  return el.textLinePitch || (el.fontSize || 18) * ptToMm * (el.lineHeight || 1.6);
}
