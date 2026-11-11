import { compactStroke, uuid, type Page, type PageElement, type Point } from './notebook-model';
import { insidePolygon, localPoint, strokeFillPolygon } from './drawing';
import { inkPaintOrder } from './brushes';
import { regionPolygon } from './flood-fill';
type XY = { x: number; y: number };

export function withinElement(point: XY, el: PageElement) {
  const p = localPoint(point, el);
  return p.x >= 0 && p.y >= 0 && p.x <= el.width && p.y <= el.height;
}

export function closedStroke(el: PageElement) {
  if (el.type !== 'stroke' || !el.points || el.points.length < 4 || el.erasures?.length || el.geometry === 'line' || el.geometry === 'arrow') return false;
  if (el.fillOnly) return true;
  const first = el.points[0], last = el.points[el.points.length - 1];
  return Math.hypot(last.x - first.x, last.y - first.y) <= Math.max(0.8, (el.penWidth || 0.7) * 1.5);
}

/** Shape hit-testing is supplied by the browser's actual SVG geometry, including
 * curved speech bubbles, rather than guessing from their bounding rectangles. */
export function fillObject(elements: PageElement[], point: XY, color: string,
  shapeHit: (el: PageElement) => boolean): PageElement[] {
  for (const el of [...inkPaintOrder(elements)].reverse()) {
    if (el.locked && withinElement(point, el)) return elements;
    if ((el.type === 'shape' && el.shape !== 'line' && shapeHit(el)) ||
      (closedStroke(el) && insidePolygon(localPoint(point, el), strokeFillPolygon(el), el.fillOnly ? 'evenodd' : 'nonzero'))) {
      if (el.fill === color) return elements;
      return elements.map(old => old.id === el.id ? { ...old, fill: color } : old);
    }
    if (!['stroke', 'shape'].includes(el.type) && withinElement(point, el)) return elements;
  }
  return elements;
}

/** Reserve the full rotated bounds of protected elements. A fill cannot paint
 * over an exercise's locked contents or leak through them to the other side. */
export function protectedPixels(elements: PageElement[], width: number, height: number, pageWidth: number, pageHeight: number) {
  const mask = new Uint8Array(width * height);
  for (const el of elements) {
    if (!el.locked) continue;
    const radius = Math.hypot(el.width, el.height) / 2;
    const cx = el.x + el.width / 2, cy = el.y + el.height / 2;
    const left = Math.max(0, Math.floor((cx - radius) / pageWidth * width));
    const right = Math.min(width, Math.ceil((cx + radius) / pageWidth * width));
    const top = Math.max(0, Math.floor((cy - radius) / pageHeight * height));
    const bottom = Math.min(height, Math.ceil((cy + radius) / pageHeight * height));
    for (let y = top; y < bottom; y++) for (let x = left; x < right; x++)
      if (withinElement({ x: (x + 0.5) / width * pageWidth, y: (y + 0.5) / height * pageHeight }, el)) mask[y * width + x] = 1;
  }
  return mask;
}

export function filledRegion(mask: Uint8Array, width: number, height: number,
  pageWidth: number, pageHeight: number, color: string, opacity: number): PageElement | null {
  const polygon = regionPolygon(mask, width, height);
  if (!polygon.length) return null;
  const points: Point[] = polygon.map(p => ({ x: p.x / width * pageWidth, y: p.y / height * pageHeight, pressure: 0.5 }));
  return compactStroke({ id: uuid(), type: 'stroke', x: 0, y: 0, width: pageWidth, height: pageHeight,
    rotation: 0, locked: false, color, fill: color, fillOnly: true, brushVersion: 2,
    penStyle: 'pen', penWidth: 0.1, opacity, points });
}


/** Autosave can advance a revision while a page image is being captured. Keep
 * that revision, but discard results if the actual page contents changed. */
export function applyRegionFill(snapshot: Page, current: Page, element: PageElement): Page {
  if (snapshot.id !== current.id || JSON.stringify({ ...snapshot, revision: 0 }) !== JSON.stringify({ ...current, revision: 0 })) return current;
  return { ...current, elements: [...current.elements, element] };
}
