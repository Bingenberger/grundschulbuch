import { uuid, type PageElement, type Point, type Erasure } from './notebook-model';
import { brushBoundary, brushCentreline } from './brushes';

export type EraserOptions = {
  mode: 'area' | 'stroke';
  size: number;
  opacity: number;
  soft: boolean;
  tip?: 'round' | 'square' | 'slant';
};
export type EraserProgress = { checked: number; hits: Set<string> };
export type BrushOptions = {
  color: string;
  penWidth: number;
  brush: NonNullable<PageElement['penStyle']> | 'fill';
  tool: string;
  penOpacity: number;
  nibHand?: 'left' | 'right';
};

export function newStroke(point: Point, width: number, height: number, options: BrushOptions, input = 'pen'): PageElement {
  const brush = options.tool === 'marker' ? 'marker' : options.brush === 'fill' ? 'pen' : options.brush;
  return {
    id: uuid(), type: 'stroke', x: 0, y: 0, width, height,
    rotation: 0, locked: false, color: options.color, points: [point],
    penStyle: brush,
    brushVersion: 2,
    nibHand: options.nibHand || 'right',
    simulatePressure: input !== 'pen',
    penWidth: options.penWidth,
    opacity: options.penOpacity,
  };
}

/** Midpoint quadratic interpolation; the stored samples remain editable. */
export function smoothPath(points: { x: number; y: number }[]) {
  if (!points.length) return '';
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i], next = points[i + 1];
    d += ` Q${p.x} ${p.y} ${(p.x + next.x) / 2} ${(p.y + next.y) / 2}`;
  }
  const last = points[points.length - 1];
  return `${d} L${last.x} ${last.y}`;
}

export function fountainOutline(points: Point[], width: number) {
  let pressure = points[0]?.pressure ?? 0.5;
  const left: XY[] = [], right: XY[] = [];
  points.forEach((p, i) => {
    pressure = pressure * 0.6 + p.pressure * 0.4;
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const radius = width * (0.3 + pressure * 1.4) / 2;
    const x = -(b.y - a.y) / length * radius, y = (b.x - a.x) / length * radius;
    left.push({ x: p.x + x, y: p.y + y });
    right.push({ x: p.x - x, y: p.y - y });
  });
  return `${smoothPath(left)} ${smoothPath(right.reverse()).replace(/^M/, 'L')} Z`;
}

type XY = { x: number; y: number };
export function pathBounds(points: XY[], padding = 0) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
  }
  return { x: minX - padding, y: minY - padding,
    width: maxX - minX + padding * 2, height: maxY - minY + padding * 2 };
}
function distance(p: XY, a: XY, b: XY) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
}
function segmentDistance(a: XY, b: XY, c: XY, d: XY) {
  const cross = (p: XY, q: XY, r: XY) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  if (cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0) return 0;
  return Math.min(distance(a, c, d), distance(b, c, d), distance(c, a, b), distance(d, a, b));
}
export function localPoint(p: XY, el: PageElement): XY {
  const angle = -el.rotation * Math.PI / 180;
  const dx = p.x - el.x - el.width / 2, dy = p.y - el.y - el.height / 2;
  return { x: dx * Math.cos(angle) - dy * Math.sin(angle) + el.width / 2,
    y: dx * Math.sin(angle) + dy * Math.cos(angle) + el.height / 2 };
}

const fillEdges = new WeakMap<PageElement, [XY, XY][]>();
const geometry = new WeakMap<PageElement, { points: XY[]; bounds: ReturnType<typeof pathBounds> }>();
function strokeGeometry(el: PageElement) {
  const cached = geometry.get(el);
  if (cached) return cached;
  const original = el.points || [];
  if (el.fillOnly) {
    const result = { points: original, bounds: pathBounds(original) };
    geometry.set(el, result); return result;
  }
  if (el.brushVersion === 2) {
    const points = brushBoundary(el, el.penStyle === 'water' ? 1.2 : 1);
    const result = { points, bounds: pathBounds(points) };
    geometry.set(el, result);
    return result;
  }
  const points: XY[] = original.length ? [original[0]] : [];
  if (el.penStyle && original.length > 2) {
    for (let i = 1; i < original.length - 1; i++) {
      const a = points[points.length - 1], control = original[i], next = original[i + 1];
      const end = { x: (control.x + next.x) / 2, y: (control.y + next.y) / 2 };
      const steps = Math.max(2, Math.min(32, Math.ceil((Math.hypot(control.x - a.x, control.y - a.y) + Math.hypot(end.x - control.x, end.y - control.y)) / 2)));
      for (let j = 1; j <= steps; j++) {
        const t = j / steps, u = 1 - t;
        points.push({ x: u * u * a.x + 2 * u * t * control.x + t * t * end.x,
          y: u * u * a.y + 2 * u * t * control.y + t * t * end.y });
      }
    }
    points.push(original[original.length - 1]);
  } else points.splice(0, points.length, ...original);
  const result = { points, bounds: pathBounds(points) };
  geometry.set(el, result);
  return result;
}

/** Always derive the preview from the gesture's original elements: one undo step,
 * no repeated opacity accumulation while a pointer event is being delivered. */
export function eraseElements(elements: PageElement[], path: XY[], id: string, options: EraserOptions, progress?: EraserProgress): PageElement[] {
  if (!path.length) return elements;
  const unchecked = path.slice(Math.max(0, (progress?.checked || 0) - 1));
  const result = elements.flatMap((el) => {
    if (el.type !== 'stroke' || el.locked || !el.points?.length) return [el];
    const samples = unchecked.map(p => localPoint(p, el));
    const radius = options.size * (options.mode === 'area' && options.tip === 'square' ? Math.SQRT1_2 : options.mode === 'area' && options.tip === 'slant' ? 0.55 : 0.5) + (el.brushVersion === 2 ? el.penStyle === 'water' ? (el.penWidth || 0.8) * 0.1 : 0 : (el.penWidth || 0.7) * (el.penStyle === 'fountain' ? 0.9 : 0.5));
    const shape = strokeGeometry(el);
    let edges = fillEdges.get(el);
    if (el.fillOnly && !edges) { edges = polygonEdges(shape.points); fillEdges.set(el, edges); }
    const hit = progress?.hits.has(el.id) || samples.some((p, i) => {
      const previous = samples[Math.max(0, i - 1)];
      const b = shape.bounds;
      if (Math.max(previous.x, p.x) < b.x - radius || Math.min(previous.x, p.x) > b.x + b.width + radius ||
          Math.max(previous.y, p.y) < b.y - radius || Math.min(previous.y, p.y) > b.y + b.height + radius) return false;
      // Filled strokes also have paint inside their outline.
      if (el.fill && insidePolygon(p, strokeFillPolygon(el), el.fillOnly ? 'evenodd' : 'nonzero')) return true;
      if (el.brushVersion === 2 && !el.fillOnly && insidePolygon(p, shape.points)) return true;
      if (el.fillOnly) return edges!.some(([a, b]) => segmentDistance(previous, p, a, b) <= radius + 0.1);
      return shape.points.some((q, j) => segmentDistance(previous, p, shape.points[Math.max(0, j - 1)], q) <= radius + 0.1);
    });
    if (!hit) return [el];
    progress?.hits.add(el.id);
    if (options.mode === 'stroke') return [];
    const points = path.map(p => localPoint(p, el));
    const erasure: Erasure = { id, points, size: options.size, opacity: options.opacity, soft: options.soft, width: el.width, height: el.height, ...(options.tip ? { tip: options.tip } : {}) };
    return [{ ...el, erasures: [...(el.erasures || []), erasure] }];
  });
  if (progress) progress.checked = path.length;
  return result;
}

export function insidePolygon(point: XY, polygon: XY[], rule: 'evenodd' | 'nonzero' = 'evenodd') {
  let inside = false, winding = 0;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j];
    const cross = (b.x - a.x) * (point.y - a.y) - (point.x - a.x) * (b.y - a.y);
    if (a.y <= point.y && b.y > point.y && cross > 0) winding++;
    if (a.y > point.y && b.y <= point.y && cross < 0) winding--;
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return rule === 'nonzero' ? winding !== 0 : inside;
}

export function appendSamples(target: Point[], samples: Point[]) {
  for (const p of samples) {
    if (target.length >= 19000) break;
    const last = target[target.length - 1];
    if (!last || Math.hypot(p.x - last.x, p.y - last.y) >= 0.05) target.push(p);
  }
}

/** Use all hardware samples when available, including actual zero pressure. */
export function pointerSamples(event: PointerEvent, rect: DOMRect, width: number, height: number): Point[] {
  const samples = event.getCoalescedEvents?.() || [];
  return (samples.length ? samples : [event]).map(p => ({
    x: Math.max(0, Math.min(width, (p.clientX - rect.left) / rect.width * width)),
    y: Math.max(0, Math.min(height, (p.clientY - rect.top) / rect.height * height)),
    pressure: p.pointerType === 'pen' ? p.pressure : 0.5,
    time: p.timeStamp,
    ...(p.pointerType === 'pen' ? { tiltX: p.tiltX || 0, tiltY: p.tiltY || 0 } : {}),
  }));
}


export function strokeFillPolygon(el: PageElement): XY[] {
  return el.brushVersion === 2 && !el.fillOnly ? brushCentreline(el) : el.points || [];
}

/** Cancel retraced bridges: they join contours for even-odd filling but contain
 * no paint and must not trigger the whole-stroke eraser inside a hole. */
export function polygonEdges(points: XY[]): [XY, XY][] {
  const edges = new Map<string, [XY, XY][]>();
  const key = (a: XY, b: XY) => `${a.x},${a.y}:${b.x},${b.y}`;
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    if (a.x === b.x && a.y === b.y) continue;
    const reverse = edges.get(key(b, a));
    if (reverse?.length) { reverse.pop(); if (!reverse.length) edges.delete(key(b, a)); }
    else { const id = key(a, b), existing = edges.get(id); if (existing) existing.push([a, b]); else edges.set(id, [[a, b]]); }
  }
  return [...edges.values()].flat();
}
