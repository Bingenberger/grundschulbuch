/** Bounded four-neighbour flood fill. Pixels are compared to the seed, so gradual
 * colour ramps cannot make the fill wander into unrelated colours. */
export function floodRegion(data: Uint8ClampedArray, width: number, height: number,
  seed: { x: number; y: number }, tolerance = 28, blocked?: Uint8Array): Uint8Array {
  const size = width * height;
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || size > 2_000_000 || data.length !== size * 4)
    throw new Error('Die Fläche ist zu groß oder ungültig.');
  const selected = new Uint8Array(size);
  const x = Math.floor(seed.x), y = Math.floor(seed.y);
  if (x < 0 || y < 0 || x >= width || y >= height || !Number.isFinite(x + y)) return selected;
  const start = y * width + x;
  if (blocked?.[start]) return selected;
  const channel = (i: number, c: number) => 255 + (data[i * 4 + c] - 255) * data[i * 4 + 3] / 255;
  const colour = [channel(start, 0), channel(start, 1), channel(start, 2)];
  const visited = new Uint8Array(size), queue = new Uint32Array(size);
  let read = 0, written = 1;
  queue[0] = start; visited[start] = 1; selected[start] = 1;
  const visit = (i: number) => {
    if (visited[i]) return;
    visited[i] = 1;
    if (blocked?.[i] || colour.some((c, n) => Math.abs(channel(i, n) - c) > tolerance)) return;
    selected[i] = 1; queue[written++] = i;
  };
  while (read < written) {
    const at = queue[read++], x = at % width;
    if (x > 0) visit(at - 1);
    if (x + 1 < width) visit(at + 1);
    if (at >= width) visit(at - width);
    if (at + width < size) visit(at + width);
  }
  return selected;
}

type XY = { x: number; y: number };
/** Trace exact pixel boundaries, including holes. Reverse bridge pairs combine
 * contours into one even-odd polygon, without painting connecting lines. */
export function regionPolygon(mask: Uint8Array, width: number, height: number, maxPoints = 19000): XY[] {
  if (mask.length !== width * height || width < 1 || height < 1) throw new Error('Ungültige Füllfläche.');
  const edges = new Map<number, number[]>(), stride = width + 1;
  let edgeCount = 0;
  const edge = (x: number, y: number, u: number, v: number) => {
    if (++edgeCount > 150000) throw new Error('Die Fläche ist zu detailreich. Bitte einen kleineren Bereich wählen.');
    const start = y * stride + x, end = v * stride + u;
    const next = edges.get(start);
    if (next) next.push(end); else edges.set(start, [end]);
  };
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = y * width + x;
    if (!mask[i]) continue;
    if (!y || !mask[i - width]) edge(x, y, x + 1, y);
    if (x + 1 === width || !mask[i + 1]) edge(x + 1, y, x + 1, y + 1);
    if (y + 1 === height || !mask[i + width]) edge(x + 1, y + 1, x, y + 1);
    if (!x || !mask[i - 1]) edge(x, y + 1, x, y);
  }
  const decode = (i: number) => ({ x: i % stride, y: Math.floor(i / stride) });
  const polygon: XY[] = [];
  while (edges.size) {
    const start = edges.keys().next().value!;
    let at = start, previous: XY | null = null;
    const contour: XY[] = [];
    do {
      const p = decode(at), choices = edges.get(at);
      if (!choices?.length) throw new Error('Die Füllkontur konnte nicht geschlossen werden.');
      // At a diagonal contact, turn right to keep the selected pixels on the
      // right. This prevents holes from being joined across a corner.
      let index = 0;
      if (choices.length > 1 && previous) {
        const dx = p.x - previous.x, dy = p.y - previous.y;
        const right = choices.findIndex(next => { const q = decode(next); return q.x - p.x === -dy && q.y - p.y === dx; });
        if (right >= 0) index = right;
      }
      const next = choices.splice(index, 1)[0];
      if (!choices.length) edges.delete(at);
      const a = contour[contour.length - 2], b = contour[contour.length - 1];
      if (a && b && (b.x - a.x) * (p.y - b.y) === (b.y - a.y) * (p.x - b.x)) contour[contour.length - 1] = p;
      else contour.push(p);
      if (contour.length > maxPoints) throw new Error('Die Fläche ist zu detailreich. Bitte einen kleineren Bereich wählen.');
      previous = p; at = next;
    } while (at !== start);
    const first = contour[0];
    const separate = polygon.length > 0;
    for (const p of contour) polygon.push(p);
    polygon.push(first);
    if (separate) polygon.push(polygon[0]);
    if (polygon.length > maxPoints) throw new Error('Die Fläche ist zu detailreich. Bitte einen kleineren Bereich wählen.');
  }
  return polygon;
}
