import type { Point } from './notebook-model';

export type DrawingGuide = {
  kind: 'ruler' | 'triangle';
  /** Position of the rotation centre, in page millimetres. */
  x: number;
  y: number;
  angle: number;
};
type XY = { x: number; y: number };
export type GuideEdge = { a: XY; b: XY };
export type GuideManipulation = { guide: DrawingGuide; point: XY; angle: number; mode: 'move' | 'rotate' | 'two' };

export function guideShape(kind: DrawingGuide['kind']) {
  return kind === 'triangle'
    ? { width: 180, height: 90, pivot: { x: 90, y: 30 }, vertices: [{ x: 0, y: 0 }, { x: 180, y: 0 }, { x: 90, y: 90 }] }
    : { width: 180, height: 22, pivot: { x: 90, y: 11 }, vertices: [{ x: 0, y: 0 }, { x: 180, y: 0 }, { x: 180, y: 22 }, { x: 0, y: 22 }] };
}

export function normaliseGuideAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function manipulateGuide(gesture: GuideManipulation, points: XY[], page: { width: number; height: number }, coarse = false): DrawingGuide {
  const [a, b] = points;
  if (!a) return gesture.guide;
  const midpoint = b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a;
  const next = { ...gesture.guide };
  let rotation = 0;
  if (gesture.mode !== 'move') {
    const angle = b ? Math.atan2(b.y - a.y, b.x - a.x) : Math.atan2(a.y - gesture.guide.y, a.x - gesture.guide.x);
    const degrees = gesture.guide.angle + (angle - gesture.angle) * 180 / Math.PI;
    next.angle = normaliseGuideAngle(coarse ? Math.round(degrees / 15) * 15 : Math.round(degrees));
    rotation = (next.angle - gesture.guide.angle) * Math.PI / 180;
  }
  if (gesture.mode !== 'rotate') {
    const x = gesture.guide.x - gesture.point.x, y = gesture.guide.y - gesture.point.y;
    // Rotate about the fingers' midpoint, including an off-centre grip, so that
    // the ruler does not slide underneath the two touching fingers.
    next.x = Math.max(15, Math.min(page.width - 15, midpoint.x + x * Math.cos(rotation) - y * Math.sin(rotation)));
    next.y = Math.max(15, Math.min(page.height - 15, midpoint.y + x * Math.sin(rotation) + y * Math.cos(rotation)));
  }
  return next;
}

export function guideEdges(guide: DrawingGuide, penWidth = 0): GuideEdge[] {
  const shape = guideShape(guide.kind), angle = guide.angle * Math.PI / 180;
  const world = (p: XY) => {
    const x = p.x - shape.pivot.x, y = p.y - shape.pivot.y;
    return { x: guide.x + x * Math.cos(angle) - y * Math.sin(angle),
      y: guide.y + x * Math.sin(angle) + y * Math.cos(angle) };
  };
  const vertices = shape.vertices.map(world);
  return vertices.map((a, i) => {
    const b = vertices[(i + 1) % vertices.length];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    // Keep the paint outside the plastic: offset the centreline by half its width.
    const dx = (b.y - a.y) / length * penWidth / 2;
    const dy = -(b.x - a.x) / length * penWidth / 2;
    return { a: { x: a.x + dx, y: a.y + dy }, b: { x: b.x + dx, y: b.y + dy } };
  });
}

export function projectToGuideEdge<T extends XY>(point: T, edge: GuideEdge): T {
  const dx = edge.b.x - edge.a.x, dy = edge.b.y - edge.a.y;
  const t = Math.max(0, Math.min(1, ((point.x - edge.a.x) * dx + (point.y - edge.a.y) * dy) / (dx * dx + dy * dy)));
  return { ...point, x: edge.a.x + t * dx, y: edge.a.y + t * dy };
}

/** Capture one nearby edge at pointer-down. Far-away strokes remain freehand;
 * the captured world-space edge stays fixed for the entire drawing gesture. */
export function captureGuideEdge(point: Point, guide: DrawingGuide | null, penWidth = 0.8, tolerance = 3): GuideEdge | undefined {
  if (!guide) return;
  let distance = tolerance;
  let selected: GuideEdge | undefined;
  const offsets = guideEdges(guide, penWidth);
  for (const [index, edge] of guideEdges(guide).entries()) {
    const projected = projectToGuideEdge(point, edge);
    const candidate = Math.hypot(point.x - projected.x, point.y - projected.y);
    if (candidate <= distance) { distance = candidate; selected = offsets[index]; }
  }
  return selected;
}
