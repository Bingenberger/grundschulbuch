type XY = { x: number; y: number };
const distance = (a: XY, b: XY) => Math.hypot(a.x - b.x, a.y - b.y);

function sampleLoop(vertices: XY[], count = 80): XY[] {
  const closed = [...vertices, vertices[0]], lengths = [0];
  for (let i = 1; i < closed.length; i++) lengths.push(lengths[i - 1] + distance(closed[i], closed[i - 1]));
  let segment = 1;
  return Array.from({ length: count }, (_, i) => {
    const at = lengths[lengths.length - 1] * i / count;
    while (segment < closed.length - 1 && lengths[segment] < at) segment++;
    const a = closed[segment - 1], b = closed[segment];
    const t = (at - lengths[segment - 1]) / (lengths[segment] - lengths[segment - 1] || 1);
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  });
}
function centre(points: XY[]) {
  return { x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
    y: points.reduce((sum, p) => sum + p.y, 0) / points.length };
}
const outlineStar = Array.from({ length: 10 }, (_, i) => {
  const angle = -Math.PI / 2 + i * Math.PI / 5, radius = i % 2 ? 0.44 : 1;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
});
const crossedStar = Array.from({ length: 5 }, (_, i) => {
  const angle = -Math.PI / 2 + i * Math.PI * 4 / 5;
  return { x: Math.cos(angle), y: Math.sin(angle) };
});
const heart = Array.from({ length: 96 }, (_, i) => {
  const t = i / 96 * Math.PI * 2;
  return { x: Math.sin(t) ** 3, y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16 };
});
const models = [
  { kind: 'star' as const, vertices: outlineStar },
  { kind: 'star' as const, vertices: crossedStar },
  ...[0.7, 0.85, 1, 1.2, 1.45].map(aspect => ({ kind: 'heart' as const, vertices: heart.map(p => ({ x: p.x * aspect, y: p.y })) })),
].map(model => {
  const samples = sampleLoop(model.vertices), origin = centre(samples);
  const points = samples.map(p => ({ x: p.x - origin.x, y: p.y - origin.y }));
  return { ...model, origin, points, energy: points.reduce((sum, p) => sum + p.x ** 2 + p.y ** 2, 0) };
});

/** Closed-loop least-squares matching. Search both traversal directions and
 * starting positions; fit translation, rotation and size independently of where
 * the user began drawing. Models are mathematical shapes created for this app. */
export function fitDecorativeShape(input: XY[]): { kind: 'star' | 'heart'; vertices: XY[] } | null {
  if (input.length < 8) return null;
  const samples = sampleLoop(input.slice(0, -1)), origin = centre(samples);
  const target = samples.map(p => ({ x: p.x - origin.x, y: p.y - origin.y }));
  const diagonal = Math.hypot(Math.max(...target.map(p => p.x)) - Math.min(...target.map(p => p.x)), Math.max(...target.map(p => p.y)) - Math.min(...target.map(p => p.y)));
  let best: { kind: 'star' | 'heart'; vertices: XY[]; error: number } | null = null;
  for (const model of models) for (const direction of [1, -1]) for (let shift = 0; shift < target.length; shift++) {
    let dot = 0, cross = 0;
    for (let i = 0; i < target.length; i++) {
      const q = model.points[((shift + direction * i) % target.length + target.length) % target.length], p = target[i];
      dot += q.x * p.x + q.y * p.y;
      cross += q.x * p.y - q.y * p.x;
    }
    const a = dot / model.energy, b = cross / model.energy;
    let error = 0, maximum = 0;
    for (let i = 0; i < target.length; i++) {
      const q = model.points[((shift + direction * i) % target.length + target.length) % target.length], p = target[i];
      const d = Math.hypot(q.x * a - q.y * b - p.x, q.x * b + q.y * a - p.y);
      error += d * d; maximum = Math.max(maximum, d);
    }
    error = Math.sqrt(error / target.length) / diagonal;
    if (error > 0.065 || maximum / diagonal > 0.15 || (best && best.error <= error)) continue;
    const vertices = model.vertices.map(p => ({ x: origin.x + (p.x - model.origin.x) * a - (p.y - model.origin.y) * b,
      y: origin.y + (p.x - model.origin.x) * b + (p.y - model.origin.y) * a }));
    best = { kind: model.kind, vertices: [...vertices, vertices[0]], error };
  }
  return best;
}
