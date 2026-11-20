// Lösungskontrolle of the worksheet generators as in the reference: an answer
// box knows its result and says ✓ or ✗ – at once or after “Prüfen”.
import type { Page, PageElement } from '../notebook-model';

const simple = (v: string) =>
  v.toLowerCase().replace(/[\s   ]+/g, '').replace(/[−–—]/g, '-').replace(/½/g, '1/2').replace(/\.$/, '');

/** Money in cent: “1,49 €”, “1 € 49”, “149 ct”, “6 €”, a bare number in the unit given. */
function cents(v: string, unit: 'eur' | 'ct') {
  let m = v.match(/^(\d+)(?:€|euro)(\d{1,2})(?:ct|cent)?$/);
  if (m) return +m[1] * 100 + +m[2];
  m = v.match(/^(\d+)[,.](\d{1,2})(?:€|euro)?$/);
  if (m) return +m[1] * 100 + +(m[2].length === 1 ? `${m[2]}0` : m[2]);
  m = v.match(/^(\d+)(?:€|euro)$/);
  if (m) return +m[1] * 100;
  m = v.match(/^(\d+)(?:ct|cent)$/);
  if (m) return +m[1];
  m = v.match(/^(\d+)$/);
  return m ? (unit === 'ct' ? +m[1] : +m[1] * 100) : null;
}
const whole = (v: string) => (/^-?\d+$/.test(v) ? Number(v) : /^-?\d{1,3}(\.\d{3})+$/.test(v) ? Number(v.replace(/\./g, '')) : null);

/** Whether a typed answer means the result: times, money, lengths (7 = 7 cm = 70 mm), numbers with points. */
export function sameAnswer(typed: string, result: string) {
  const a = simple(typed), r = simple(result);
  if (!a) return false;
  if (a === r) return true;
  const time = (v: string) => v.match(/^(\d{1,2})[:.](\d{2})(?:uhr)?$/);
  const t = time(r);
  if (t) {
    const m = time(a) ?? a.match(/^(\d{1,2})uhr(\d{2})?$/);
    return !!m && Number(m[1]) === Number(t[1]) && Number(m[2] ?? 0) === Number(t[2]);
  }
  if (/€|ct$/.test(r)) {
    const want = cents(r, 'eur'), got = cents(a, /€/.test(r) ? 'eur' : 'ct');
    return want !== null && got !== null && want === got;
  }
  const unit = /\d(cm|mm)$/.test(r) ? r.slice(-2) : 'cm';
  const mm = (v: string, fallback: string) => {
    const m = v.match(/^(\d+(?:[.,]\d+)?)(cm|mm)?$/);
    return m ? Number(m[1].replace(',', '.')) * ((m[2] ?? fallback) === 'mm' ? 1 : 10) : null;
  };
  if (/[.,]\d|\d(cm|mm)$/.test(r) || /\d(cm|mm)$/.test(a)) {
    const want = mm(r, unit), got = mm(a, unit);
    if (want !== null && got !== null) return Math.abs(want - got) < 0.01;
  }
  const x = whole(a), y = whole(r);
  return x !== null && y !== null && x === y;
}

/** ✓ or ✗ for a filled answer box with a result, else nothing. */
export function answerMark(el: Pick<PageElement, 'answer' | 'text'>): 'ok' | 'bad' | null {
  if (el.answer === undefined) return null;
  const typed = (el.text || '').trim();
  return typed ? (sameAnswer(typed, el.answer) ? 'ok' : 'bad') : null;
}

/** Shown next to the box: always with “Sofort”, after “Prüfen” until it changes. */
export const shownMark = (el: PageElement) => (el.check === 'each' || (el.check && el.marked) ? answerMark(el) : null);

/** “Prüfen”: marks the boxes of the page and says how many are right. */
export function checkPage(page: Page): { page: Page; message: string; success: boolean } {
  const boxes = page.elements.filter((el) => el.type === 'text' && el.check === 'button' && el.answer !== undefined);
  if (!boxes.length) return { page, message: 'Auf dieser Seite gibt es nichts zu prüfen.', success: false };
  let ok = 0, bad = 0;
  const marked = new Set<string>();
  for (const el of boxes) {
    const mark = answerMark(el);
    if (!mark) continue;
    marked.add(el.id);
    if (mark === 'ok') ok++;
    else bad++;
  }
  const empty = boxes.length - ok - bad;
  const next = marked.size ? { ...page, elements: page.elements.map((el) => (marked.has(el.id) && !el.marked ? { ...el, marked: true } : el)) } : page;
  if (!bad && !empty) return { page: next, message: `Alles richtig – ${ok === 1 ? 'das Ergebnis stimmt' : `alle ${ok} Ergebnisse stimmen`}!`, success: true };
  const parts = [`${ok} von ${boxes.length} richtig`];
  if (bad) parts.push(`${bad} mit ✗: schau ${bad === 1 ? 'es' : 'sie'} dir noch einmal an`);
  if (empty) parts.push(`${empty} noch leer`);
  return { page: next, message: parts.join(' · '), success: false };
}

/** Where the ruler or set square lies ready: bottom left of the page (guide centre in mm). */
export function readyGuide(tool: 'ruler' | 'square', sheet: { width: number; height: number; left?: number; top?: number }) {
  const kind = tool === 'square' ? ('triangle' as const) : ('ruler' as const);
  const shape = kind === 'triangle' ? { height: 90, pivot: { x: 90, y: 30 } } : { height: 22, pivot: { x: 90, y: 11 } };
  return { kind, x: (sheet.left ?? 0) + 12 + shape.pivot.x, y: (sheet.top ?? 0) + sheet.height - 12 - (shape.height - shape.pivot.y), angle: 0 };
}
