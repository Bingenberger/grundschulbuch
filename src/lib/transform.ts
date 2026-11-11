// Resizing at any corner and rotating selected elements. All values in mm.
import type { PageElement } from './notebook-model';

type XY = { x: number; y: number };
export type Corner = 'nw' | 'ne' | 'sw' | 'se';
export const corners: Corner[] = ['nw', 'ne', 'sw', 'se'];

const MIN = 3;
const MAX = 400;
const rad = (deg: number) => (deg * Math.PI) / 180;
const turn = (p: XY, deg: number): XY => {
  const a = rad(deg);
  return { x: p.x * Math.cos(a) - p.y * Math.sin(a), y: p.x * Math.sin(a) + p.y * Math.cos(a) };
};

function withSize(el: PageElement, x: number, y: number, width: number, height: number): PageElement {
  return {
    ...el,
    x,
    y,
    width,
    height,
    points: el.points?.map((p) => ({ ...p, x: (p.x * width) / el.width, y: (p.y * height) / el.height })),
  };
}

/**
 * Drag one corner; the opposite corner stays where it is, also for rotated
 * elements. `keepRatio` keeps the proportions (e.g. pictures, Umschalttaste).
 */
export function resizeAtCorner(el: PageElement, corner: Corner, start: XY, point: XY, keepRatio = false): PageElement {
  const sx = corner.endsWith('e') ? 1 : -1;
  const sy = corner.startsWith('s') ? 1 : -1;
  const local = turn({ x: point.x - start.x, y: point.y - start.y }, -el.rotation);
  let width = Math.max(MIN, Math.min(MAX, el.width + sx * local.x));
  let height = Math.max(MIN, Math.min(MAX, el.height + sy * local.y));
  if (keepRatio) {
    const factor = Math.max(width / el.width, height / el.height);
    width = Math.max(MIN, Math.min(MAX, el.width * factor));
    height = Math.max(MIN, Math.min(MAX, el.height * factor));
  }
  const center = { x: el.x + el.width / 2, y: el.y + el.height / 2 };
  const anchorOffset = turn({ x: (-sx * el.width) / 2, y: (-sy * el.height) / 2 }, el.rotation);
  const anchor = { x: center.x + anchorOffset.x, y: center.y + anchorOffset.y };
  const back = turn({ x: (sx * width) / 2, y: (sy * height) / 2 }, el.rotation);
  return withSize(el, anchor.x + back.x - width / 2, anchor.y + back.y - height / 2, width, height);
}

/** Angle (degrees) of the pointer around a centre; 0° points upwards. */
export function pointerAngle(center: XY, point: XY) {
  return (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI + 90;
}

/** Normalises to (-180, 180] and snaps to 15° steps when close (or always). */
export function snapAngle(angle: number, always = false) {
  let a = ((((angle + 180) % 360) + 360) % 360) - 180;
  if (a === -180) a = 180;
  const step = Math.round(a / 15) * 15;
  if (always || Math.abs(a - step) <= 4) a = step === -180 ? 180 : step;
  return Math.round(a * 10) / 10;
}

/** Rotate by the angle the pointer moved around the element's centre. */
export function rotateTo(el: PageElement, center: XY, start: XY, point: XY, always = false): PageElement {
  const delta = pointerAngle(center, point) - pointerAngle(center, start);
  return { ...el, rotation: snapAngle(el.rotation + delta, always) };
}

export function elementCenter(el: PageElement): XY {
  return { x: el.x + el.width / 2, y: el.y + el.height / 2 };
}
