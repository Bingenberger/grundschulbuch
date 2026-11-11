type XY = { x: number; y: number };

function hull(points: XY[]): XY[] {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (a: XY, b: XY, c: XY) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const half = (input: XY[]) => {
    const result: XY[] = [];
    for (const point of input) {
      while (result.length >= 2 && cross(result[result.length - 2], result[result.length - 1], point) <= 0) result.pop();
      result.push(point);
    }
    return result.slice(0, -1);
  };
  return [...half(sorted), ...half([...sorted].reverse())];
}

/** Swept footprints in one opaque path; partial opacity is applied once per gesture. */
export function eraserShapePath(points: XY[], size: number, tip: 'square' | 'slant') {
  const angle = tip === 'slant' ? -Math.PI / 5 : 0, height = tip === 'slant' ? size * 0.35 : size;
  const stamp = (point: XY) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => ({
    x: point.x + x * size / 2 * Math.cos(angle) - y * height / 2 * Math.sin(angle),
    y: point.y + x * size / 2 * Math.sin(angle) + y * height / 2 * Math.cos(angle),
  }));
  return points.map((point, i) => {
    const polygon = hull([...stamp(points[Math.max(0, i - 1)]), ...stamp(point)]);
    return `M${polygon.map(p => `${p.x},${p.y}`).join(' L')} Z`;
  }).join(' ');
}
