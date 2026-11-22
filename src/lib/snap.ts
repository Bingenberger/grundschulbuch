// Snapping with guide lines while moving and resizing (like Lernsachen-Heft):
// elements catch the page edges, the page margin and centre, the edges and
// centres of other elements and equal gaps between neighbours. All in mm.

export type Box = { x: number; y: number; width: number; height: number };
type Axis = 'x' | 'y';
/** A red line at `at` on `axis` (x: vertical line), drawn from `from` to `to`. */
export type Guide =
  | { kind: 'line'; axis: Axis; at: number; from: number; to: number; page?: boolean }
  /** An equal gap: a bar across the gap from `from` to `to` at height `at`. */
  | { kind: 'gap'; axis: Axis; from: number; to: number; at: number };
export type Sheet = { width: number; height: number };

/** Margin line of the page (the reference uses 70 of 1400 units ≈ 15 mm). */
export const PAGE_MARGIN = 15;
const EPS = 0.05;
const other = (a: Axis): Axis => (a === 'x' ? 'y' : 'x');
const lo = (b: Box, a: Axis) => (a === 'x' ? b.x : b.y);
const len = (b: Box, a: Axis) => (a === 'x' ? b.width : b.height);
const hi = (b: Box, a: Axis) => lo(b, a) + len(b, a);
const mid = (b: Box, a: Axis) => lo(b, a) + len(b, a) / 2;
const shift = (b: Box, a: Axis, d: number): Box => (a === 'x' ? { ...b, x: b.x + d } : { ...b, y: b.y + d });
const extent = (s: Sheet, a: Axis) => (a === 'x' ? s.width : s.height);
const pageStops = (s: Sheet, a: Axis) => [0, PAGE_MARGIN, extent(s, a) - PAGE_MARGIN, extent(s, a)];

/** Axis-aligned box around a (possibly rotated) element. */
export function outline(el: Box & { rotation?: number }): Box {
  if (!el.rotation) return { x: el.x, y: el.y, width: el.width, height: el.height };
  const r = (el.rotation * Math.PI) / 180;
  const c = Math.abs(Math.cos(r)), s = Math.abs(Math.sin(r));
  const w = el.width * c + el.height * s, h = el.width * s + el.height * c;
  return { x: el.x + el.width / 2 - w / 2, y: el.y + el.height / 2 - h / 2, width: w, height: h };
}
/** Box around several boxes. */
export function union(boxes: Box[]): Box {
  const x = Math.min(...boxes.map((b) => b.x)), y = Math.min(...boxes.map((b) => b.y));
  const r = Math.max(...boxes.map((b) => b.x + b.width)), d = Math.max(...boxes.map((b) => b.y + b.height));
  return { x, y, width: r - x, height: d - y };
}

function pageLine(s: Sheet, a: Axis, at: number): Guide {
  return { kind: 'line', axis: a, at, from: 0, to: extent(s, other(a)), page: true };
}
function pairLine(a: Axis, at: number, b: Box, c: Box): Guide {
  const o = other(a);
  return { kind: 'line', axis: a, at, from: Math.min(lo(b, o), lo(c, o)), to: Math.max(hi(b, o), hi(c, o)) };
}
function gap(a: Axis, first: Box, second: Box): Guide {
  const o = other(a);
  const top = Math.max(lo(first, o), lo(second, o)), bottom = Math.min(hi(first, o), hi(second, o));
  return { kind: 'gap', axis: a, from: hi(first, a), to: lo(second, a), at: bottom > top ? (top + bottom) / 2 : (mid(first, o) + mid(second, o)) / 2 };
}

/** Lines for every edge or centre of `box` that now sits on a stop. */
function linesAt(a: Axis, box: Box, others: Box[], s: Sheet, edges: number[], centre: number | null): Guide[] {
  const out: Guide[] = [];
  const near = (p: number, q: number) => Math.abs(p - q) < EPS;
  for (const e of edges) if (pageStops(s, a).some((p) => near(p, e))) out.push(pageLine(s, a, e));
  if (centre !== null && near(centre, extent(s, a) / 2)) out.push(pageLine(s, a, centre));
  for (const o of others) {
    const hits = edges.filter((e) => near(lo(o, a), e) || near(hi(o, a), e));
    for (const e of hits) out.push(pairLine(a, e, box, o));
    if (centre !== null && near(mid(o, a), centre)) out.push(pairLine(a, centre, box, o));
  }
  return out;
}

type Offer = { d: number; gaps?: (b: Box) => Guide[] };
/** Equal gaps: centred between both neighbours, or as far from one as two others are apart. */
function gapOffers(box: Box, others: Box[], a: Axis): Offer[] {
  const o = other(a);
  const row = others.filter((b) => lo(b, o) < hi(box, o) && hi(b, o) > lo(box, o)).sort((p, q) => lo(p, a) - lo(q, a));
  const centre = mid(box, a);
  let before: Box | undefined, after: Box | undefined;
  for (const b of row) {
    if (hi(b, a) <= centre && (!before || hi(b, a) > hi(before, a))) before = b;
    if (lo(b, a) >= centre && (!after || lo(b, a) < lo(after, a))) after = b;
  }
  const offers: Offer[] = [];
  if (before && after) {
    const room = lo(after, a) - hi(before, a) - len(box, a);
    if (room > 0.5) offers.push({ d: hi(before, a) + room / 2 - lo(box, a), gaps: (b) => [gap(a, before!, b), gap(a, b, after!)] });
  }
  for (let i = 0; i + 1 < row.length; i++) {
    const p = row[i], q = row[i + 1], space = lo(q, a) - hi(p, a);
    if (space <= 0.5 || (p === before && q === after)) continue;
    if (before) offers.push({ d: hi(before, a) + space - lo(box, a), gaps: (b) => [gap(a, p, q), gap(a, before!, b)] });
    if (after) offers.push({ d: lo(after, a) - space - hi(box, a), gaps: (b) => [gap(a, p, q), gap(a, b, after!)] });
  }
  return offers;
}
function closest(offers: Offer[], tol: number) {
  let best: Offer | null = null;
  for (const o of offers) if (Math.abs(o.d) <= tol && (!best || Math.abs(o.d) < Math.abs(best.d))) best = o;
  return best;
}
function unique(guides: Guide[]) {
  const seen = new Set<string>();
  return guides.filter((g) => {
    const key = JSON.stringify(g);
    return !seen.has(key) && (seen.add(key), true);
  });
}

/**
 * Moving: returns how far to push the box so an edge or the centre catches
 * the nearest stop within `tol` (mm), and the guides to draw.
 */
export function snapMove(box: Box, others: Box[], sheet: Sheet, tol: number) {
  const pick = (a: Axis) => {
    const edges = [lo(box, a), hi(box, a)], centre = mid(box, a);
    const offers: Offer[] = [];
    for (const p of pageStops(sheet, a)) for (const e of edges) offers.push({ d: p - e });
    offers.push({ d: extent(sheet, a) / 2 - centre });
    for (const o of others) {
      for (const e of edges) offers.push({ d: lo(o, a) - e }, { d: hi(o, a) - e });
      offers.push({ d: mid(o, a) - centre });
    }
    return closest(offers.concat(gapOffers(box, others, a)), tol);
  };
  const sx = pick('x'), sy = pick('y');
  const moved = { ...box, x: box.x + (sx?.d ?? 0), y: box.y + (sy?.d ?? 0) };
  const guides: Guide[] = [];
  for (const [a, s] of [['x', sx], ['y', sy]] as const) {
    if (!s) continue;
    guides.push(...linesAt(a, moved, others, sheet, [lo(moved, a), hi(moved, a)], mid(moved, a)));
    for (const g of gapOffers(shift(moved, a, -s.d), others, a))
      if (Math.abs(g.d - s.d) < EPS && g.gaps) guides.push(...g.gaps(moved));
  }
  return { dx: sx?.d ?? 0, dy: sy?.d ?? 0, guides: unique(guides) };
}

/**
 * Resizing an unrotated box at a corner: the moving edges catch stops. `sx`/`sy`
 * say which edges move (+1 right/bottom, −1 left/top). With `keepRatio` both
 * sides follow the closer catch.
 */
export function snapResize(box: Box, sx: 1 | -1, sy: 1 | -1, others: Box[], sheet: Sheet, tol: number, keepRatio = false, min = 3) {
  const dir = { x: sx, y: sy };
  const edge = (b: Box, a: Axis) => (dir[a] > 0 ? hi(b, a) : lo(b, a));
  const stops = (a: Axis) => [...pageStops(sheet, a), ...others.flatMap((o) => [lo(o, a), hi(o, a)])];
  const find = (a: Axis) => {
    let best: number | null = null;
    for (const p of stops(a)) {
      const d = p - edge(box, a);
      if (Math.abs(d) <= tol && (best === null || Math.abs(d) < Math.abs(best))) best = d;
    }
    return best;
  };
  const resized = (b: Box, a: Axis, d: number): Box => {
    const size = Math.max(min, len(b, a) + dir[a] * d);
    const start = dir[a] > 0 ? lo(b, a) : hi(b, a) - size;
    return a === 'x' ? { ...b, x: start, width: size } : { ...b, y: start, height: size };
  };
  let out = box;
  const dx = find('x'), dy = find('y');
  if (keepRatio) {
    const ratio = box.width / box.height;
    const useX = dx !== null && (dy === null || Math.abs(dx) <= Math.abs(dy));
    if (useX) {
      out = resized(box, 'x', dx!);
      out = resized(out, 'y', dir.y * (out.width / ratio - box.height));
    } else if (dy !== null) {
      out = resized(box, 'y', dy);
      out = resized(out, 'x', dir.x * (out.height * ratio - box.width));
    }
  } else {
    if (dx !== null) out = resized(out, 'x', dx);
    if (dy !== null) out = resized(out, 'y', dy);
  }
  const guides = (['x', 'y'] as const).flatMap((a) => linesAt(a, out, others, sheet, [edge(out, a)], null));
  return { box: out, guides: unique(guides) };
}
