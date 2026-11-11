import { fitDecorativeShape } from './shape-templates';
import { fitArrowPath, fitArrowHead } from './shape-arrows';
import type { PageElement, Point } from './notebook-model';
export type RecognizedGeometry = 'line' | 'ellipse' | 'triangle' | 'rectangle' | 'arrow' | 'star' | 'heart';
export type Recognition = { kind: RecognizedGeometry; points: Point[]; replaceId?: string };
type XY = { x: number; y: number };
const distance = (a: XY, b: XY) => Math.hypot(a.x - b.x, a.y - b.y);
function segmentDistance(p: XY, a: XY, b: XY) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
  return distance(p, { x: a.x + t * dx, y: a.y + t * dy });
}
function simplify(points: XY[], tolerance: number): XY[] {
  if (points.length <= 2) return points;
  let maximum = tolerance, index = -1;
  for (let i = 1; i < points.length - 1; i++) {
    const d = segmentDistance(points[i], points[0], points[points.length - 1]);
    if (d > maximum) { maximum = d; index = i; }
  }
  if (index < 0) return [points[0], points[points.length - 1]];
  return [...simplify(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplify(points.slice(index), tolerance)];
}
function resample(points: XY[], count: number): XY[] {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1] + distance(points[i], points[i - 1]));
  const total = lengths[lengths.length - 1];
  let segment = 1;
  return Array.from({ length: count }, (_, i) => {
    const at = total * i / (count - 1);
    while (segment < lengths.length - 1 && lengths[segment] < at) segment++;
    const t = (at - lengths[segment - 1]) / (lengths[segment] - lengths[segment - 1] || 1);
    const a = points[segment - 1], b = points[segment];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  });
}
function result(kind: RecognizedGeometry, vertices: XY[], original: Point[]): Recognition {
  const length = vertices.slice(1).reduce((sum, p, i) => sum + distance(p, vertices[i]), 0);
  const spacing = Math.max(0.4, length / 1800);
  const points = [vertices[0]];
  for (let i = 1; i < vertices.length; i++) {
    const a = vertices[i - 1], b = vertices[i], steps = Math.max(1, Math.ceil(distance(a, b) / spacing));
    for (let j = 1; j <= steps; j++) points.push({ x: a.x + (b.x - a.x) * j / steps, y: a.y + (b.y - a.y) * j / steps });
  }
  return { kind, points: points.map((p, i) => {
    const at = i / (points.length - 1) * (original.length - 1), a = original[Math.floor(at)], b = original[Math.ceil(at)], t = at % 1;
    const sample: Point = { ...p, pressure: a.pressure + (b.pressure - a.pressure) * t };
    for (const key of ['time', 'tiltX', 'tiltY'] as const) if (a[key] !== undefined && b[key] !== undefined) sample[key] = a[key]! + (b[key]! - a[key]!) * t;
    return sample;
  }) };
}

/** Conservative, bounded recognition of common classroom geometry. Handwriting
 * and scribbles remain freehand; the caller explicitly controls the hold gesture. */
export function recognizeStroke(input: Point[]): Recognition | null {
  if (input.length < 2) return null;
  const points = resample(input, Math.min(256, Math.max(16, input.length)));
  const first = points[0], last = points[points.length - 1];
  const minX = Math.min(...points.map(p => p.x)), maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y)), maxY = Math.max(...points.map(p => p.y));
  const diagonal = Math.hypot(maxX - minX, maxY - minY);
  const length = points.slice(1).reduce((sum, p, i) => sum + distance(p, points[i]), 0);
  if (length < 8 || diagonal < 5) return null;
  const chord = distance(first, last);
  if (chord > 6 && length / chord < 1.15 && points.every(p => segmentDistance(p, first, last) <= Math.max(0.6, diagonal * 0.035)))
    return result('line', [first, last], input);
  const arrow = fitArrowPath(points);
  if (arrow) return result('arrow', arrow, input);
  if (chord > Math.max(2, diagonal * 0.12) || maxX - minX < 6 || maxY - minY < 6 || length > diagonal * 4.5) return null;
  // Splitting the loop at its farthest point avoids an arbitrary start point
  // creating or hiding a polygon corner.
  let opposite = 1;
  points.forEach((p, i) => { if (distance(p, first) > distance(points[opposite], first)) opposite = i; });
  const tolerance = Math.max(0.75, diagonal * 0.035);
  const closed = [...points.slice(0, -1), first];
  let vertices = [...simplify(closed.slice(0, opposite + 1), tolerance).slice(0, -1), ...simplify(closed.slice(opposite), tolerance).slice(0, -1)];
  vertices = vertices.filter((p, i) => segmentDistance(p, vertices[(i + vertices.length - 1) % vertices.length], vertices[(i + 1) % vertices.length]) > tolerance);
  if (vertices.length === 3 || vertices.length === 4) {
    const perimeter = vertices.reduce((sum, p, i) => sum + distance(p, vertices[(i + 1) % vertices.length]), 0);
    const goodEdges = vertices.every((p, i) => distance(p, vertices[(i + 1) % vertices.length]) > diagonal * 0.15);
    if (goodEdges && length / perimeter > 0.85 && length / perimeter < 1.18) {
      if (vertices.length === 3) return result('triangle', [...vertices, vertices[0]], input);
      const orthogonal = vertices.every((p, i) => {
        const a = vertices[(i + 3) % 4], b = vertices[(i + 1) % 4];
        return Math.abs(((a.x - p.x) * (b.x - p.x) + (a.y - p.y) * (b.y - p.y)) / (distance(a, p) * distance(b, p))) < 0.28;
      });
      if (orthogonal) {
        const angle = Math.atan2(vertices[1].y - vertices[0].y, vertices[1].x - vertices[0].x);
        const c = Math.cos(angle), s = Math.sin(angle);
        const u = points.map(p => p.x * c + p.y * s), v = points.map(p => -p.x * s + p.y * c);
        const loU = Math.min(...u), hiU = Math.max(...u), loV = Math.min(...v), hiV = Math.max(...v);
        const box = [[loU, loV], [hiU, loV], [hiU, hiV], [loU, hiV], [loU, loV]].map(([x, y]) => ({ x: x * c - y * s, y: x * s + y * c }));
        return result('rectangle', box, input);
      }
    }
  }
  const decorative = fitDecorativeShape(closed);
  if (decorative) return result(decorative.kind, decorative.vertices, input);
  const mean = { x: points.reduce((s, p) => s + p.x, 0) / points.length, y: points.reduce((s, p) => s + p.y, 0) / points.length };
  const xx = points.reduce((s, p) => s + (p.x - mean.x) ** 2, 0), yy = points.reduce((s, p) => s + (p.y - mean.y) ** 2, 0);
  const xy = points.reduce((s, p) => s + (p.x - mean.x) * (p.y - mean.y), 0);
  const angle = Math.atan2(2 * xy, xx - yy) / 2, c = Math.cos(angle), s = Math.sin(angle);
  const projected = points.map(p => ({ x: (p.x - mean.x) * c + (p.y - mean.y) * s, y: -(p.x - mean.x) * s + (p.y - mean.y) * c }));
  const left = Math.min(...projected.map(p => p.x)), right = Math.max(...projected.map(p => p.x));
  const top = Math.min(...projected.map(p => p.y)), bottom = Math.max(...projected.map(p => p.y));
  const a = (right - left) / 2, b = (bottom - top) / 2, cx = (left + right) / 2, cy = (top + bottom) / 2;
  if (a < 3 || b < 3) return null;
  const errors = projected.map(p => Math.abs(Math.hypot((p.x - cx) / a, (p.y - cy) / b) - 1));
  const bins = new Set(projected.map(p => Math.floor((Math.atan2((p.y - cy) / b, (p.x - cx) / a) + Math.PI) / (2 * Math.PI) * 16) % 16));
  if (bins.size < 14 || errors.some(e => e > 0.3) || errors.reduce((s, e) => s + e, 0) / errors.length > 0.11) return null;
  const ellipse = Array.from({ length: 97 }, (_, i) => {
    const t = i / 96 * Math.PI * 2, x = cx + a * Math.cos(t), y = cy + b * Math.sin(t);
    return { x: mean.x + x * c - y * s, y: mean.y + x * s + y * c };
  });
  return result('ellipse', ellipse, input);
}

/** Only the immediately preceding, intact stroke with the same brush can be
 * combined. This prevents a new arrowhead from consuming unrelated old ink. */
export function previousArrowShaft(elements: PageElement[], current: PageElement): PageElement | null {
  const last = elements[elements.length - 1];
  if (!last || last.type !== 'stroke' || last.locked || last.fill || last.erasures?.length || last.groupId ||
    (last.geometry && last.geometry !== 'line')) return null;
  for (const key of ['color', 'penStyle', 'penWidth', 'opacity', 'brushVersion', 'nibHand', 'simulatePressure'] as const)
    if (last[key] !== current[key]) return null;
  return last;
}

export function recognizeArrowHead(input: Point[], shaft: PageElement | null): Recognition | null {
  if (!shaft?.points?.length || input.length < 3) return null;
  const angle = shaft.rotation * Math.PI / 180, c = Math.cos(angle), s = Math.sin(angle);
  const world = shaft.points.map(p => {
    const x = p.x - shaft.width / 2, y = p.y - shaft.height / 2;
    return { x: shaft.x + shaft.width / 2 + x * c - y * s, y: shaft.y + shaft.height / 2 + x * s + y * c };
  });
  const vertices = fitArrowHead(input, world);
  return vertices ? { ...result('arrow', vertices, input), replaceId: shaft.id } : null;
}
