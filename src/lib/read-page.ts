// „Seite vorlesen“: was in welcher Reihenfolge gelesen oder abgespielt wird.
// Von oben nach unten, in einer Zeile von links nach rechts; Texte werden
// gesprochen, Bilder, Sticker, Formen und Zeichnungen mit ihrer Beschreibung,
// Töne an ihrer Stelle abgespielt.
import type { Page, PageElement } from './notebook-model';

export type ReadStep =
  | { kind: 'text'; id: string; text: string }
  | { kind: 'say'; id: string; text: string }
  | { kind: 'audio'; id: string; src: string };

/** Der Text eines Textelements, so wie er auf der Seite steht. */
export function elementText(el: PageElement) {
  return el.runs?.length ? el.runs.map((r) => r.text).join('') : el.text || '';
}

// Automatisch vergebene Beschreibungen, die niemand hören will.
const NOISE = /^(PDF-Seite \d+|Bildschirmfoto|Foto|Bild)$/i;
/** Elemente gelten als eine Zeile, wenn ihre Oberkanten so nah beieinander liegen (mm). */
const ROW = 8;

export function readingSteps(page: Pick<Page, 'elements'>): ReadStep[] {
  const ordered = [...page.elements]
    .filter((el) => (el.opacity ?? 1) > 0.05)
    .sort((a, b) => (Math.abs(a.y - b.y) < ROW ? a.x - b.x : a.y - b.y));
  const steps: ReadStep[] = [];
  for (const el of ordered) {
    if (el.type === 'text') {
      const text = elementText(el);
      if (text.trim()) steps.push({ kind: 'text', id: el.id, text });
    } else if (el.type === 'audio') {
      if (el.src) steps.push({ kind: 'audio', id: el.id, src: el.src });
      else if (el.speechText?.trim()) steps.push({ kind: 'say', id: el.id, text: el.speechText.trim() });
    } else if (['image', 'sticker', 'shape', 'stroke'].includes(el.type)) {
      const alt = el.alt?.trim();
      if (alt && !NOISE.test(alt)) steps.push({ kind: 'say', id: el.id, text: alt });
    }
  }
  return steps;
}

/** Sätze eines Texts als Bereiche [start, end), ohne den Leerraum dazwischen. */
export function sentenceRanges(text: string): { start: number; end: number }[] {
  const out: { start: number; end: number }[] = [];
  const re = /[^.!?…\n]+(?:[.!?…]+["“”»«']?)?/g;
  for (const m of text.matchAll(re)) {
    const raw = m[0], lead = raw.length - raw.trimStart().length, body = raw.trim();
    if (!/[\p{L}\p{N}]/u.test(body)) continue;
    const start = m.index! + lead;
    out.push({ start, end: start + body.length });
  }
  return out;
}
