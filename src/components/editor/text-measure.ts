'use client';
// Measures the real fonts in the browser for fitting text into the ruling.
import { fonts, type Page, type PageElement } from '@/lib/notebook-model';
import { fitTextToRuling, type TextMeasure } from '@/lib/text-fit';

const mmToPx = 96 / 25.4;
const ratioCache = new Map<string, { xHeight: number; capHeight: number }>();

/** Starts loading all text fonts so measurements are right from the start. */
export function preloadTextFonts() {
  if (typeof document === 'undefined' || !document.fonts) return;
  for (const font of Object.keys(fonts)) {
    void document.fonts.load(`20px "${font}"`).then(() => ratioCache.delete(font)).catch(() => undefined);
  }
}

export const browserMeasure: TextMeasure = {
  ratios(font) {
    const cached = ratioCache.get(font);
    if (cached) return cached;
    const context = document.createElement('canvas').getContext('2d');
    let result = { xHeight: 0.5, capHeight: 0.72 };
    if (context) {
      context.font = `100px "${font}", sans-serif`;
      const x = context.measureText('xvwz').actualBoundingBoxAscent / 100;
      const cap = Math.max(context.measureText('H').actualBoundingBoxAscent, context.measureText('l').actualBoundingBoxAscent) / 100;
      if (x > 0.2 && cap > x) result = { xHeight: x, capHeight: cap };
    }
    if (document.fonts?.check(`20px "${font}"`)) ratioCache.set(font, result);
    return result;
  },
  baseline(font, fontMm, lineMm) {
    // An empty inline-block sits with its bottom edge on the baseline.
    const box = document.createElement('div');
    box.style.cssText = `position:absolute;visibility:hidden;left:-9999px;top:0;white-space:pre;font-family:"${font}",sans-serif;font-size:${fontMm}mm;line-height:${lineMm / fontMm}`;
    const probe = document.createElement('span');
    probe.style.cssText = 'display:inline-block;width:0;height:0';
    box.append('x', probe);
    document.body.append(box);
    const top = probe.getBoundingClientRect().top - box.getBoundingClientRect().top;
    box.remove();
    return top / mmToPx;
  },
};

/** Fits the text into the page ruling, or leaves it as it is. */
export function fitText(el: PageElement, page: Page, options?: { autoSize?: boolean; lines?: number }) {
  if (typeof document === 'undefined') return el;
  return fitTextToRuling(el, page, browserMeasure, options) || el;
}

/** Whether the text currently sits on the ruling (one line per row). */
export function onRuling(el: PageElement, page: Page) {
  return typeof document !== 'undefined' && !!fitTextToRuling(el, page, browserMeasure);
}

export const pxToMm = (px: number) => px / mmToPx;
