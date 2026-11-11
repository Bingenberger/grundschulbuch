// Selecting with the “Auswahl” tool: tap a single element (strokes are hit along
// their actual line) or drag a frame to select several elements.
import type { PageElement } from './notebook-model';
import { eraseElements } from './drawing';

type XY = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };

/** Normalised rectangle between two corner points. */
export function rectFrom(a: XY, b: XY): Rect {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(b.x - a.x),
    height: Math.abs(b.y - a.y),
  };
}

/** Axis-aligned bounds of an element, taking its rotation into account. */
export function elementBounds(el: PageElement): Rect {
  const angle = (el.rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(angle)),
    sin = Math.abs(Math.sin(angle));
  const width = el.width * cos + el.height * sin,
    height = el.width * sin + el.height * cos;
  return {
    x: el.x + el.width / 2 - width / 2,
    y: el.y + el.height / 2 - height / 2,
    width,
    height,
  };
}

const intersects = (a: Rect, b: Rect) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
const contains = (outer: Rect, inner: Rect) =>
  outer.x <= inner.x &&
  outer.y <= inner.y &&
  outer.x + outer.width >= inner.x + inner.width &&
  outer.y + outer.height >= inner.y + inner.height;

/**
 * Elements touched by a selection frame. Locked elements are skipped, as are
 * elements that completely surround the frame (e.g. a large background picture
 * the frame was drawn on).
 */
export function elementsInFrame(elements: PageElement[], frame: Rect): string[] {
  return elements
    .filter((el) => !el.locked)
    .filter((el) => {
      const bounds = elementBounds(el);
      return intersects(frame, bounds) && !contains(bounds, frame);
    })
    .map((el) => el.id);
}

/** Topmost unlocked stroke whose line passes within `radius` mm of the point. */
export function strokeAt(elements: PageElement[], point: XY, radius = 2.5): PageElement | undefined {
  const progress = { checked: 0, hits: new Set<string>() };
  eraseElements(elements, [point], 'auswahl', { mode: 'stroke', size: radius * 2, opacity: 1, soft: false }, progress);
  for (let i = elements.length - 1; i >= 0; i--)
    if (progress.hits.has(elements[i].id)) return elements[i];
  return undefined;
}

/** A drag shorter than this (mm) counts as a tap. */
export const tapDistance = 1.5;
