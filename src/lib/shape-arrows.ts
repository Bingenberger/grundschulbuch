type XY = { x: number; y: number };
const distance = (a: XY, b: XY) => Math.hypot(a.x - b.x, a.y - b.y);
function segmentDistance(p: XY, a: XY, b: XY) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
  return distance(p, { x: a.x + dx * t, y: a.y + dy * t });
}
function head(tail: XY, tip: XY, points: XY[]): XY[] | null {
  const length = distance(tail, tip);
  if (length < 10 || points.length < 3) return null;
  const ux = (tip.x - tail.x) / length, uy = (tip.y - tail.y) / length;
  const projected = points.map(p => ({ x: (p.x - tip.x) * ux + (p.y - tip.y) * uy,
    y: -(p.x - tip.x) * uy + (p.y - tip.y) * ux, point: p }));
  const left = projected.reduce((a, b) => a.y < b.y ? a : b), right = projected.reduce((a, b) => a.y > b.y ? a : b);
  const tolerance = Math.max(0.8, length * 0.04);
  if (Math.min(...points.map(p => distance(p, tip))) > tolerance) return null;
  if (left.y > -Math.max(1.5, length * 0.06) || right.y < Math.max(1.5, length * 0.06)) return null;
  if ([left, right].some(p => p.x > -length * 0.08 || p.x < -length * 0.65 || Math.abs(p.y) > length * 0.6)) return null;
  if (Math.abs(left.y / right.y) < 0.45 || Math.abs(left.y / right.y) > 2.2) return null;
  if (points.some(p => Math.min(segmentDistance(p, tip, left.point), segmentDistance(p, tip, right.point)) > tolerance)) return null;
  const back = -(left.x + right.x) / 2, wing = (right.y - left.y) / 2;
  const first = { x: tip.x - ux * back - uy * wing, y: tip.y - uy * back + ux * wing };
  const second = { x: tip.x - ux * back + uy * wing, y: tip.y - uy * back - ux * wing };
  return [tail, tip, first, tip, second];
}

function straight(points: XY[], tail: XY, tip: XY) {
  const length = distance(tail, tip);
  return length >= 10 && points.every(p => segmentDistance(p, tail, tip) <= Math.max(0.7, length * 0.035));
}

/** Supports shaft-first and head-first gestures, including retraced arrow wings. */
export function fitArrowPath(points: XY[]): XY[] | null {
  if (points.length < 5) return null;
  for (const route of [points, [...points].reverse()]) {
    for (let i = 1; i < route.length - 2; i++) {
      if (!straight(route.slice(0, i + 1), route[0], route[i])) continue;
      const arrow = head(route[0], route[i], route.slice(i));
      if (arrow) return arrow;
    }
  }
  return null;
}

export function fitArrowHead(points: XY[], shaft: XY[]): XY[] | null {
  if (shaft.length < 2) return null;
  const first = shaft[0], last = shaft[shaft.length - 1];
  if (!straight(shaft, first, last)) return null;
  return head(first, last, points) || head(last, first, points);
}
