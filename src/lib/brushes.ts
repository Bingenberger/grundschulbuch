import type { PageElement, Point } from './notebook-model';

export type Brush = NonNullable<PageElement['penStyle']> | 'fill';
export const brushProfiles: Record<Brush, { label: string; sizes: number[]; size: number; opacity: number }> = {
  pen: { label: 'Stift', sizes: [0.5, 0.8, 1.3, 2.1, 3.2, 4.8, 6.9], size: 0.8, opacity: 1 },
  fountain: { label: 'Füller', sizes: [1.1, 1.6, 2.4, 3.4, 4.8, 6.9, 9.5], size: 1.6, opacity: 1 },
  crayon: { label: 'Buntstift', sizes: [0.8, 1.3, 2.4, 3.7, 5.8, 9, 12.7], size: 2.4, opacity: 0.9 },
  marker: { label: 'Marker', sizes: [2.6, 4.2, 6.4, 9, 12.7, 16.9], size: 6.4, opacity: 0.38 },
  water: { label: 'Aquarell', sizes: [3.2, 4.8, 7.9, 12.2, 18.5, 26.5], size: 7.9, opacity: 0.45 },
  fill: { label: 'Farbeimer', sizes: [1], size: 1, opacity: 1 },
};

type XY = { x: number; y: number };
export type BrushSample = Point & { speed: number; distance: number };
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** Distance-based input stabilization before curve construction. Small movements
 * are damped more than deliberate large movements; hardware event frequency does
 * not set the filter strength. Retain sensor readings and anchor both endpoints. */
export function streamlinePoints(points: Point[], style: Brush = 'pen', width = 0.8): Point[] {
  if (points.length < 3) return points;
  const length = style === 'fountain' ? clamp(0.5 + width * 0.35, 0.75, 1.8)
    : style === 'water' ? clamp(0.55 + width * 0.12, 0.7, 2.2)
    : style === 'marker' ? clamp(0.5 + width * 0.12, 0.7, 1.6)
    : style === 'crayon' ? clamp(0.5 + width * 0.15, 0.65, 1.5)
    : clamp(0.4 + width * 0.4, 0.7, 1.4);
  const result = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const point = points[i], previous = points[i - 1], filtered = result[result.length - 1];
    const distance = Math.hypot(point.x - previous.x, point.y - previous.y);
    const weight = -Math.expm1(-distance / length);
    result.push({ ...point, x: filtered.x + (point.x - filtered.x) * weight,
      y: filtered.y + (point.y - filtered.y) * weight });
  }
  result.push(points[points.length - 1]);
  return result;
}

/** Quadratic centreline with interpolated sensor values. Physical time and
 * distance, rather than event count, determine the behaviour of each brush. */
export function brushSamples(input: Point[], style: Brush = 'pen', width = 0.8, geometric = false): BrushSample[] {
  const points = geometric ? input : streamlinePoints(input, style, width);
  if (!points.length) return [];
  const result: Point[] = geometric ? [...points] : [points[0]];
  for (let i = 1; !geometric && i < points.length - 1; i++) {
    const start = result[result.length - 1], control = points[i], next = points[i + 1];
    const end = interpolate(control, next, 0.5);
    const length = Math.hypot(control.x - start.x, control.y - start.y) + Math.hypot(end.x - control.x, end.y - control.y);
    const steps = Math.max(1, Math.min(32, Math.ceil(length / 0.4)));
    for (let j = 1; j <= steps; j++) {
      const t = j / steps;
      result.push(interpolate(interpolate(start, control, t), interpolate(control, end, t), t));
    }
  }
  if (!geometric && points.length > 1) {
    const start = result[result.length - 1], end = points[points.length - 1];
    const steps = Math.max(1, Math.min(512, Math.ceil(Math.hypot(end.x - start.x, end.y - start.y) / 0.4)));
    for (let i = 1; i <= steps; i++) result.push(interpolate(start, end, i / steps));
  }
  let distance = 0;
  return result.map((p, i) => {
    const previous = result[Math.max(0, i - 1)];
    const step = Math.hypot(p.x - previous.x, p.y - previous.y);
    distance += step;
    const elapsed = p.time !== undefined && previous.time !== undefined ? p.time - previous.time : 0;
    return { ...p, distance, speed: elapsed > 0 ? clamp(step / elapsed, 0, 3) : 0.25 };
  });
}
function interpolate(a: Point, b: Point, t: number): Point {
  const p: Point = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, pressure: a.pressure + (b.pressure - a.pressure) * t };
  for (const key of ['time', 'tiltX', 'tiltY'] as const) {
    if (a[key] !== undefined && b[key] !== undefined) p[key] = a[key]! + (b[key]! - a[key]!) * t;
  }
  return p;
}

/** Offset of the supporting point of a rotated elliptical nib. This makes a
 * fountain pen's width depend on stroke direction, independently of pressure. */
function nibSupport(nx: number, ny: number, major: number, minor: number, angle: number): XY {
  const c = Math.cos(angle), s = Math.sin(angle);
  const u = nx * c + ny * s, v = -nx * s + ny * c;
  const length = Math.hypot(major * u, minor * v) || 1;
  return { x: (major * major * u * c - minor * minor * v * s) / length,
    y: (major * major * u * s + minor * minor * v * c) / length };
}

function nib(el: PageElement, p: BrushSample, total: number, scale: number) {
  const style = el.penStyle || 'pen', width = (el.penWidth || 0.8) * scale;
  let major = width / 2, minor = major, angle = 0;
  const pressure = el.simulatePressure ? clamp(0.8 / (1 + p.speed * 2), 0.15, 0.8) : p.pressure;
  if (style === 'fountain') {
    major *= 1 + Math.min(0.3, p.speed * 0.15);
    minor = major * 0.22;
    angle = (el.nibHand === 'left' ? 1 : -1) * Math.PI / 4;
  } else if (style !== 'marker') {
    const sensitivity = style === 'crayon' ? 0.5 : style === 'water' ? 0.65 : 0.9;
    major *= 1 + (pressure - 0.5) * sensitivity;
    if (style === 'crayon') {
      const tilt = Math.hypot(p.tiltX || 0, p.tiltY || 0);
      if (tilt > 45) {
        major *= 1 + clamp((tilt - 45) / 35, 0, 1) * 1.8;
        minor = major * 0.3;
        angle = Math.atan2(p.tiltY || 0, p.tiltX || 0);
      } else minor = major;
    } else minor = major;
    const closed = total > width * 4 && el.points && Math.hypot(el.points[0].x - el.points[el.points.length - 1].x, el.points[0].y - el.points[el.points.length - 1].y) < width * 0.6;
    if ((style === 'crayon' || style === 'water') && total > width && !closed) {
      const taper = Math.max(0.08, Math.min(1, p.distance / (width * 0.8), (total - p.distance) / width));
      major *= taper; minor *= taper;
    }
  }
  return { major, minor, angle };
}

const centreCache = new WeakMap<PageElement, BrushSample[]>();
export function brushCentreline(el: PageElement) {
  let samples = centreCache.get(el);
  if (!samples) { samples = brushSamples(el.points || [], el.penStyle, el.penWidth, !!el.geometry); centreCache.set(el, samples); }
  return samples;
}

/** Independent swept-nib construction; no reference code or assets are used. */
export function brushBoundary(el: PageElement, scale = 1): XY[] {
  const samples = brushCentreline(el);
  if (!samples.length) return [];
  const total = samples[samples.length - 1].distance;
  const left: XY[] = [], right: XY[] = [];
  const nibs = samples.map(p => nib(el, p, total, scale));
  const tangents: number[] = [];
  samples.forEach((p, i) => {
    const a = samples[Math.max(0, i - 1)], b = samples[Math.min(samples.length - 1, i + 1)];
    const normal = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2;
    tangents.push(normal);
    const n = nibs[i], offset = nibSupport(Math.cos(normal), Math.sin(normal), n.major, n.minor, n.angle);
    left.push({ x: p.x + offset.x, y: p.y + offset.y });
    right.push({ x: p.x - offset.x, y: p.y - offset.y });
  });
  const cap = (index: number, start: number) => Array.from({ length: 12 }, (_, i) => {
    const angle = start - Math.PI * (i + 1) / 12, n = nibs[index], p = samples[index];
    const offset = nibSupport(Math.cos(angle), Math.sin(angle), n.major, n.minor, n.angle);
    return { x: p.x + offset.x, y: p.y + offset.y };
  });
  return [...left, ...cap(samples.length - 1, tangents[tangents.length - 1]),
    ...right.reverse(), ...cap(0, tangents[0] - Math.PI)];
}

export function brushOutline(el: PageElement, scale = 1): string {
  const outline = brushBoundary(el, scale);
  if (!outline.length) return '';
  return `M${outline.map(p => `${p.x.toFixed(3)} ${p.y.toFixed(3)}`).join(' L')} Z`;
}

export function crayonDensity(el: PageElement) {
  const samples = brushCentreline(el);
  if (!samples.length) return 1;
  return samples.reduce((sum, p) => sum + clamp(1 / (1 + p.speed * 0.9), 0.35, 1) *
    (Math.hypot(p.tiltX || 0, p.tiltY || 0) > 45 ? 0.65 : 1), 0) / samples.length;
}

/** Watercolour remains underneath other ink. Non-ink object slots retain their
 * order, and the same ordering is used for previews, print and portable viewers. */
export function inkPaintOrder(elements: PageElement[], draft?: PageElement | null) {
  const all = draft ? elements.some(el => el.id === draft.id)
    ? elements.map(el => el.id === draft.id ? draft : el) : [...elements, draft] : elements;
  const ink = all.filter(el => el.type === 'stroke');
  const water = (el: PageElement) => el.brushVersion === 2 && el.penStyle === 'water';
  const sorted = [...ink.filter(water), ...ink.filter(el => !water(el))];
  let index = 0;
  return all.map(el => el.type === 'stroke' ? sorted[index++] : el);
}
