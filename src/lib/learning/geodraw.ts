// “Geometrie: Formen zeichnen” like the reference: tasks on squared paper, drawn
// with the pen along the ruler or set square right on the page, then checked
// segment by segment with a tolerance. All geometry is in the reference's units:
// the page (landscape A4) is 1400 × 990, so 1 mm = 1400 / 297 units.

export const PAGE_W = 1400, PAGE_H = 990;
export const MM = PAGE_W / 297;
/** Grid of 5 mm, starting at the page corner (our “Karo 5 mm”). */
export const GRID = 5 * MM;
/** Where the shapes are drawn and checked (below the task box). */
export const AREA = { x0: 40, x1: 1360, y0: 204, y1: 868 };

export type Level = 'easy' | 'medium' | 'hard' | 'rising';
export type Group = 'lines' | 'quads' | 'tris' | 'more';
export type Tolerance = 'loose' | 'normal' | 'strict';
export type ShapeKind = 'line' | 'square' | 'rect' | 'rtri' | 'stairs' | 'aline' | 'equi' | 'iso' | 'para' | 'house';
/** a, b: lengths in mm; d: angle or direction in degrees; n: number of steps. */
export type Task = { k: ShapeKind; a: number; b?: number; d?: number; n?: number };
export type GeoConfig = { level: Level; count: number; groups: Group[]; tol: Tolerance; flash: number; tasks: Task[] };
export type Point = [number, number];
export type Segment = { a: Point; b: Point };

export const LEVELS: { value: Level; label: string; hint: string }[] = [
  { value: 'easy', label: 'Leicht', hint: 'Strecken nach rechts, oben, unten oder links, Quadrate und Rechtecke – ganze Zentimeter, an den Karolinien entlang.' },
  { value: 'medium', label: 'Mittel', hint: 'Längen mit Millimetern (4,5 cm), Rechtecke, rechtwinklige Dreiecke und Treppen.' },
  { value: 'hard', label: 'Schwer', hint: 'Mit Winkeln (Geodreieck): schräge Strecken, gleichseitige und gleichschenklige Dreiecke, Parallelogramme, ein Haus mit Dach.' },
  { value: 'rising', label: 'Ansteigend', hint: 'Erst leicht, dann mittel, am Ende schwer.' },
];
export const GROUPS: { value: Group; label: string }[] = [
  { value: 'lines', label: 'Strecken' },
  { value: 'quads', label: 'Vierecke' },
  { value: 'tris', label: 'Dreiecke' },
  { value: 'more', label: 'Weitere Formen' },
];
export const TOLERANCES: { value: Tolerance; label: string; hint: string }[] = [
  { value: 'loose', label: 'Großzügig', hint: 'Bis 3,5 mm und 5° daneben zählt noch als richtig.' },
  { value: 'normal', label: 'Normal', hint: 'Bis 2 mm und 3° daneben zählt noch als richtig.' },
  { value: 'strict', label: 'Genau', hint: 'Höchstens 1 mm und 2° daneben.' },
];
const LIMITS: Record<Tolerance, { mm: number; deg: number }> = { loose: { mm: 3.5, deg: 5 }, normal: { mm: 2, deg: 3 }, strict: { mm: 1, deg: 2 } };
const KINDS: ShapeKind[] = ['line', 'square', 'rect', 'rtri', 'stairs', 'aline', 'equi', 'iso', 'para', 'house'];
const DIRECTIONS = [0, 90, 0, 270, 90, 180];

type Random = () => number;
const between = (r: Random, a: number, b: number) => a + Math.floor(r() * (b - a + 1));
const one = <T,>(r: Random, list: T[]) => list[Math.floor(r() * list.length)];

function task(level: Exclude<Level, 'rising'>, group: Group, r: Random): Task {
  if (level === 'easy') {
    if (group === 'lines') return { k: 'line', a: 10 * between(r, 3, 10), d: one(r, DIRECTIONS) };
    if (group === 'quads') {
      if (r() < 0.4) return { k: 'square', a: 10 * between(r, 2, 5) };
      const a = 10 * between(r, 3, 8);
      let b = 10 * between(r, 2, 5);
      if (b === a) b -= 10;
      return { k: 'rect', a, b };
    }
    return group === 'tris' ? { k: 'rtri', a: 10 * between(r, 3, 6), b: 10 * between(r, 2, 5) } : { k: 'stairs', a: 10, b: 10, n: between(r, 3, 4) };
  }
  if (level === 'medium') {
    if (group === 'lines') {
      let a = between(r, 25, 95);
      if (a % 10 === 0) a += 5;
      return { k: 'line', a, d: one(r, DIRECTIONS) };
    }
    if (group === 'quads') {
      if (r() < 0.3) return { k: 'square', a: 5 * between(r, 5, 11) };
      const a = 5 * between(r, 8, 16);
      let b = 5 * between(r, 4, 10);
      if (b === a) b -= 5;
      return { k: 'rect', a, b };
    }
    return group === 'tris' ? { k: 'rtri', a: 5 * between(r, 6, 14), b: 5 * between(r, 4, 10) } : { k: 'stairs', a: 5 * between(r, 3, 5), b: 5 * between(r, 2, 3), n: between(r, 3, 4) };
  }
  if (group === 'lines') return { k: 'aline', a: 10 * between(r, 4, 8), d: 5 * between(r, 4, 15) };
  if (group === 'quads') {
    const a = 10 * between(r, 4, 6), b = 10 * between(r, 2, 4);
    return { k: 'para', a, b: b === a ? b - 10 : b, d: one(r, [45, 50, 55, 60, 65, 70]) };
  }
  if (group === 'tris') return r() < 0.45 ? { k: 'equi', a: 10 * between(r, 3, 6) } : { k: 'iso', a: 10 * between(r, 4, 7), d: one(r, [35, 40, 45, 50, 55, 60]) };
  return { k: 'house', a: 10 * between(r, 3, 5) };
}

/** A series of tasks; never the same kind twice in a row if it can be avoided. */
export function makeTasks(c: Pick<GeoConfig, 'level' | 'count' | 'groups'>, r: Random = Math.random): Task[] {
  const count = Math.max(1, Math.min(10, Math.round(c.count)));
  const groups = c.groups.length ? c.groups : GROUPS.map((g) => g.value);
  const list: Task[] = [];
  for (let i = 0; i < count; i++) {
    const level = c.level === 'rising' ? (i < count / 3 ? 'easy' : i < (2 * count) / 3 ? 'medium' : 'hard') : c.level;
    let next = task(level, one(r, groups), r);
    for (let tries = 0; tries < 6 && list.length && list[list.length - 1].k === next.k; tries++) next = task(level, one(r, groups), r);
    list.push(next);
  }
  return list;
}

const clampInt = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;

/** Clean settings (`settings.geo`); creates tasks when none are stored. */
export function geoConfig(value: unknown, r: Random = Math.random): GeoConfig {
  const t = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const level = LEVELS.some((l) => l.value === t.level) ? (t.level as Level) : 'easy';
  const groups = Array.isArray(t.groups) ? (t.groups.filter((g) => GROUPS.some((x) => x.value === g)) as Group[]) : [];
  const tol: Tolerance = t.tol === 'loose' || t.tol === 'strict' ? t.tol : 'normal';
  const tasks = (Array.isArray(t.tasks) ? t.tasks : [])
    .filter((x): x is Task => !!x && typeof x === 'object' && KINDS.includes((x as Task).k))
    .slice(0, 10)
    .map((x) => ({
      k: x.k,
      a: clampInt(x.a, 5, 150, 50),
      ...(x.b === undefined ? {} : { b: clampInt(x.b, 5, 150, 30) }),
      ...(x.d === undefined ? {} : { d: clampInt(x.d, 0, 359, 0) }),
      ...(x.n === undefined ? {} : { n: clampInt(x.n, 2, 6, 3) }),
    }));
  const config: GeoConfig = { level, count: clampInt(t.count, 1, 10, 5), groups, tol, flash: clampInt(t.flash, 0, 3, 2), tasks };
  if (!config.tasks.length) config.tasks = makeTasks(config, r);
  return config;
}

const rad = (deg: number) => (deg * Math.PI) / 180;

/** The shape in mm, y upwards, starting at the red point (0, 0). */
export function shapeSegments(t: Task): [Point, Point][] {
  const a = t.a, b = t.b ?? a, d = t.d ?? 0;
  const closed = (points: Point[]) => points.map((p, i) => [p, points[(i + 1) % points.length]] as [Point, Point]);
  switch (t.k) {
    case 'line':
    case 'aline':
      return [[[0, 0], [a * Math.cos(rad(d)), a * Math.sin(rad(d))]]];
    case 'square':
      return closed([[0, 0], [a, 0], [a, a], [0, a]]);
    case 'rect':
      return closed([[0, 0], [a, 0], [a, b], [0, b]]);
    case 'rtri':
      return closed([[0, 0], [a, 0], [a, b]]);
    case 'stairs': {
      const list: [Point, Point][] = [];
      for (let i = 0; i < (t.n ?? 3); i++) {
        list.push([[i * a, i * b], [i * a, (i + 1) * b]]);
        list.push([[i * a, (i + 1) * b], [(i + 1) * a, (i + 1) * b]]);
      }
      return list;
    }
    case 'equi':
      return closed([[0, 0], [a, 0], [a / 2, (a * Math.sqrt(3)) / 2]]);
    case 'iso':
      return closed([[0, 0], [a, 0], [a / 2, (a / 2) * Math.tan(rad(d))]]);
    case 'para': {
      const dx = b * Math.cos(rad(d)), dy = b * Math.sin(rad(d));
      return closed([[0, 0], [a, 0], [a + dx, dy], [dx, dy]]);
    }
    case 'house':
      return [...closed([[0, 0], [a, 0], [a, a], [0, a]]), [[0, a], [a / 2, a * 1.5]], [[a / 2, a * 1.5], [a, a]]];
  }
}

/** The red point (page units): the shape centred in the area, snapped to the grid. */
export function startPoint(t: Task): Point {
  const points = shapeSegments(t).flat();
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const x = (AREA.x0 + AREA.x1) / 2 - ((Math.min(...xs) + Math.max(...xs)) / 2) * MM;
  const y = (AREA.y0 + AREA.y1) / 2 + ((Math.min(...ys) + Math.max(...ys)) / 2) * MM;
  return [Math.round(x / GRID) * GRID, Math.round(y / GRID) * GRID];
}

/** The shape on the page (units, y downwards). */
export function targetSegments(t: Task): [Point, Point][] {
  const [x, y] = startPoint(t);
  return shapeSegments(t).map(([p, q]) => [[x + p[0] * MM, y - p[1] * MM], [x + q[0] * MM, y - q[1] * MM]]);
}

const cm = (mm: number) => `${(mm / 10).toLocaleString('de-DE', { maximumFractionDigits: 1 })} cm`;
const DIRECTION: Record<number, string> = { 0: 'nach rechts', 90: 'nach oben', 180: 'nach links', 270: 'nach unten' };
const CORNER = 'Der rote Punkt ist die Ecke unten links.';

export function taskText(t: Task): string {
  const a = t.a, b = t.b ?? a, d = t.d ?? 0;
  switch (t.k) {
    case 'line':
      return `Zeichne eine Strecke: ${cm(a)} lang${a % 10 ? ` (${a} mm)` : ''}, vom roten Punkt ${DIRECTION[d] ?? 'nach rechts'}.`;
    case 'aline':
      return `Zeichne vom roten Punkt eine ${cm(a)} lange Strecke schräg nach rechts oben. Der Winkel zur waagrechten Linie ist ${d}°.`;
    case 'square':
      return `Zeichne ein Quadrat mit ${cm(a)} langen Seiten. ${CORNER}`;
    case 'rect':
      return `Zeichne ein Rechteck: ${cm(a)} lang und ${cm(b)} hoch. ${CORNER}`;
    case 'rtri':
      return `Zeichne ein rechtwinkliges Dreieck: vom roten Punkt ${cm(a)} nach rechts, von dort ${cm(b)} nach oben, dann zurück zum roten Punkt.`;
    case 'stairs':
      return `Zeichne eine Treppe mit ${t.n ?? 3} Stufen: Jede Stufe ist ${cm(b)} hoch und ${cm(a)} breit. Fang am roten Punkt an und zeichne zuerst nach oben.`;
    case 'equi':
      return `Zeichne ein gleichseitiges Dreieck: Jede Seite ist ${cm(a)} lang, alle Winkel sind 60°. ${CORNER}`;
    case 'iso':
      return `Zeichne ein Dreieck: Die Grundseite ist ${cm(a)} lang, vom roten Punkt nach rechts. Die beiden Winkel an der Grundseite sind je ${d}°.`;
    case 'para':
      return `Zeichne ein Parallelogramm: unten ${cm(a)} lang, die schrägen Seiten ${cm(b)} lang, der Winkel unten links ist ${d}°. ${CORNER}`;
    case 'house':
      return `Zeichne ein Haus: ein Quadrat mit ${cm(a)} langen Seiten und darauf ein Dach. Die Dachseiten steigen mit 45° an und treffen sich über der Mitte. ${CORNER}`;
  }
}

export function taskName(t: Task): string {
  const a = t.a, b = t.b ?? a;
  switch (t.k) {
    case 'line': return `Strecke ${cm(a)}`;
    case 'aline': return `Schräge Strecke ${t.d}°`;
    case 'square': return `Quadrat ${cm(a)}`;
    case 'rect': return `Rechteck ${cm(a)} × ${cm(b)}`;
    case 'rtri': return 'Rechtwinkliges Dreieck';
    case 'stairs': return 'Treppe';
    case 'equi': return 'Gleichseitiges Dreieck';
    case 'iso': return `Dreieck mit ${t.d}°`;
    case 'para': return 'Parallelogramm';
    case 'house': return 'Haus';
  }
}

/** Tasks with angles need the set square (and angles are checked). */
export const needsSetSquare = (t: Task) => ['aline', 'equi', 'iso', 'para', 'house'].includes(t.k);

/** Text for the speech synthesis: “4,5 cm” → “4 Komma 5 Zentimeter”. */
export function spoken(text: string) {
  return text
    .replace(/(\d+),(\d+)/g, '$1 Komma $2')
    .replace(/(\d)\s*cm\b/g, '$1 Zentimeter')
    .replace(/(\d)\s*mm\b/g, '$1 Millimeter')
    .replace(/(\d)\s*°/g, '$1 Grad')
    .replace(/[()]/g, ',');
}

const dist = (p: Point, q: Point) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const direction = (p: Point, q: Point) => Math.atan2(-(q[1] - p[1]), q[0] - p[0]);
/** Angle between two directions, 0–90°. */
function between2(a: number, b: number) {
  let d = Math.abs(((a - b) * 180) / Math.PI) % 180;
  if (d > 90) d = 180 - d;
  return d;
}

/** Douglas–Peucker: the corners of a hand-drawn line. */
function simplify(points: Point[], epsilon: number): Point[] {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack: [number, number][] = [[0, points.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop()!;
    const [x1, y1] = points[i], [x2, y2] = points[j];
    const length = Math.hypot(x2 - x1, y2 - y1) || 1;
    let best = -1, far = epsilon;
    for (let k = i + 1; k < j; k++) {
      const d = Math.abs((x2 - x1) * (y1 - points[k][1]) - (x1 - points[k][0]) * (y2 - y1)) / length;
      if (d > far) {
        far = d;
        best = k;
      }
    }
    if (best > 0) {
      keep[best] = 1;
      stack.push([i, best], [best, j]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

/** Strokes (page units) → straight segments; pieces on one line are joined. */
export function drawnSegments(strokes: Point[][]): Segment[] {
  const list: Segment[] = [];
  for (const stroke of strokes) {
    const corners = simplify(stroke, 0.9 * MM);
    for (let i = 0; i + 1 < corners.length; i++) if (dist(corners[i], corners[i + 1]) >= 1.5 * MM) list.push({ a: corners[i], b: corners[i + 1] });
  }
  for (let merged = true; merged; ) {
    merged = false;
    outer: for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const s = list[i], t = list[j];
        if (between2(direction(s.a, s.b), direction(t.a, t.b)) > 2.5) continue;
        const length = dist(s.a, s.b), ux = (s.b[0] - s.a[0]) / length, uy = (s.b[1] - s.a[1]) / length;
        const off = (p: Point) => Math.abs((p[0] - s.a[0]) * uy - (p[1] - s.a[1]) * ux);
        if (off(t.a) > 0.9 * MM || off(t.b) > 0.9 * MM) continue;
        const along = (p: Point) => (p[0] - s.a[0]) * ux + (p[1] - s.a[1]) * uy;
        const lo = Math.min(along(t.a), along(t.b)), hi = Math.max(along(t.a), along(t.b));
        if (lo > length + 1.5 * MM || hi < -1.5 * MM) continue;
        const from = Math.min(0, lo), to = Math.max(length, hi);
        list[i] = { a: [s.a[0] + ux * from, s.a[1] + uy * from], b: [s.a[0] + ux * to, s.a[1] + uy * to] };
        list.splice(j, 1);
        merged = true;
        break outer;
      }
  }
  return list;
}

/** “Die linke Seite”, “2. Stufe: Die senkrechte Linie” … */
function sideName(t: Task, targets: [Point, Point][], i: number) {
  if (targets.length === 1) return 'Die Strecke';
  const [p, q] = targets[i];
  if (t.k === 'stairs') return `${Math.floor(i / 2) + 1}. Stufe: Die ${i % 2 ? 'waagrechte' : 'senkrechte'} Linie`;
  if (t.k === 'house' && i >= 4) return `Die ${i === 4 ? 'linke' : 'rechte'} Dachseite`;
  const all = targets.flat();
  const cx = all.reduce((s, x) => s + x[0], 0) / all.length, cy = all.reduce((s, x) => s + x[1], 0) / all.length;
  const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, slope = between2(direction(p, q), 0);
  if (slope < 8) return my > cy ? 'Die untere Seite' : 'Die obere Seite';
  if (slope > 82) return mx < cx ? 'Die linke Seite' : 'Die rechte Seite';
  return mx < cx ? 'Die linke schräge Seite' : 'Die rechte schräge Seite';
}

export type CheckResult = { ok: boolean; msgs: string[]; marks: (Segment & { ok: boolean })[] };

/** Compares the drawing with the task, like the reference (same tolerances). */
export function checkDrawing(t: Task, strokes: Point[][], tol: Tolerance): CheckResult {
  const { mm, deg } = LIMITS[tol];
  const limit = mm * MM;
  const targets = targetSegments(t);
  const drawn = drawnSegments(strokes);
  if (!drawn.length) return { ok: false, msgs: ['Es ist noch nichts gezeichnet. Zeichne mit dem Stift am Lineal entlang.'], marks: [] };
  const pairs: { e: number; s: number; c: number; flip: boolean }[] = [];
  targets.forEach(([p, q], e) => {
    const length = dist(p, q);
    drawn.forEach((d, s) => {
      const straight = dist(p, d.a) + dist(q, d.b), turned = dist(p, d.b) + dist(q, d.a), c = Math.min(straight, turned);
      if (c <= 0.6 * length + 16 * MM && between2(direction(p, q), direction(d.a, d.b)) <= 30) pairs.push({ e, s, c, flip: turned < straight });
    });
  });
  pairs.sort((x, y) => x.c - y.c);
  const match = new Map<number, { s: number; flip: boolean }>(), used = new Set<number>();
  for (const pair of pairs)
    if (!match.has(pair.e) && !used.has(pair.s)) {
      match.set(pair.e, { s: pair.s, flip: pair.flip });
      used.add(pair.s);
    }
  const msgs: string[] = [];
  const good = new Set<number>();
  const start = targets[0][0];
  if (!drawn.some((d) => dist(d.a, start) <= Math.max(2 * limit, 4 * MM) || dist(d.b, start) <= Math.max(2 * limit, 4 * MM))) msgs.push('Fang am roten Punkt an.');
  let wrong = 0;
  targets.forEach(([p, q], i) => {
    const name = sideName(t, targets, i), m = match.get(i);
    if (!m) {
      wrong++;
      msgs.push(`${name} fehlt.`);
      return;
    }
    const d = drawn[m.s], [a, b] = m.flip ? [d.b, d.a] : [d.a, d.b];
    const want = dist(p, q), have = dist(a, b), angle = between2(direction(p, q), direction(a, b));
    if (dist(p, a) <= limit && dist(q, b) <= limit && (!needsSetSquare(t) || angle <= deg)) {
      good.add(m.s);
      return;
    }
    wrong++;
    const diff = Math.round((have - want) / MM);
    if (Math.abs(have - want) > limit) msgs.push(`${name} ist ${Math.abs(diff)} mm zu ${diff > 0 ? 'lang' : 'kurz'}.`);
    else if (angle > deg) {
      const should = Math.round(between2(direction(p, q), 0)), is = Math.round(between2(direction(a, b), 0));
      msgs.push(should === 0 || should === 90 ? `${name} ist schief (${Math.round(angle)}° gedreht).` : `${name}: Der Winkel ist ${is}° statt ${should}°.`);
    } else msgs.push(`${name} liegt nicht ganz an der richtigen Stelle.`);
  });
  const extra = drawn.filter((d, i) => !used.has(i) && dist(d.a, d.b) >= 6 * MM).length;
  if (extra) msgs.push(extra === 1 ? 'Eine Linie ist zu viel.' : `${extra} Linien sind zu viel.`);
  const ok = !wrong && !extra;
  return {
    ok,
    msgs: ok ? [] : msgs,
    marks: drawn.filter((d) => dist(d.a, d.b) >= 1.5 * MM).map((d) => ({ a: d.a, b: d.b, ok: good.has(drawn.indexOf(d)) })),
  };
}

// ── Progress ────────────────────────────────────────────────────────────────

export type Phase = 'draw' | 'right' | 'wrong' | 'solution' | 'summary';
export type TaskStats = { task: Task; checks: number; previews: number; result: 'right' | 'solution' | null; start: number; end: number; drawn: Segment[] };
export type GeoState = { tasks: Task[]; i: number; started: boolean; phase: Phase; msgs: string[]; marks: (Segment & { ok: boolean })[]; stats: TaskStats[] };

export const freshGeo = (tasks: Task[]): GeoState => ({ tasks, i: 0, started: false, phase: 'draw', msgs: [], marks: [], stats: [] });

export function withStats(s: GeoState, now: number): GeoState {
  if (s.stats[s.i]) return s;
  const stats = s.stats.slice();
  stats[s.i] = { task: s.tasks[s.i], checks: 0, previews: 0, result: null, start: now, end: 0, drawn: [] };
  return { ...s, stats };
}

export function afterCheck(s: GeoState, result: CheckResult, now: number): GeoState {
  const base = withStats({ ...s, started: true }, now);
  const stats = base.stats.slice();
  const current = { ...stats[base.i], checks: stats[base.i].checks + 1, drawn: result.marks.map(({ a, b }) => ({ a, b })) };
  if (result.ok) Object.assign(current, { result: 'right', end: now });
  stats[base.i] = current;
  return { ...base, stats, marks: result.marks, msgs: result.msgs, phase: result.ok ? 'right' : 'wrong' };
}

export function showSolution(s: GeoState, now: number): GeoState {
  const base = withStats(s, now);
  const stats = base.stats.slice();
  stats[base.i] = { ...stats[base.i], result: stats[base.i].result ?? 'solution', end: stats[base.i].end || now };
  return { ...base, stats, phase: 'solution' };
}

export function nextTask(s: GeoState, now: number): GeoState {
  const base = withStats(s, now);
  const stats = base.stats.slice();
  stats[base.i] = { ...stats[base.i], end: stats[base.i].end || now };
  const cleared = { ...base, stats, msgs: [], marks: [] };
  if (base.i + 1 >= base.tasks.length) return { ...cleared, phase: 'summary' };
  return withStats({ ...cleared, i: base.i + 1, phase: 'draw' }, now);
}

export function previewed(s: GeoState, now: number): GeoState {
  const base = withStats(s, now);
  const stats = base.stats.slice();
  stats[base.i] = { ...stats[base.i], previews: stats[base.i].previews + 1 };
  return { ...base, stats };
}

export function geoLabel(c: GeoConfig) {
  const first = c.tasks[0];
  return `Geometrie: ${c.tasks.length === 1 ? 'eine Aufgabe' : `${c.tasks.length} Aufgaben`}. ${first ? spoken(taskText(first)) : ''}`;
}

/** Word wrap for SVG text. */
export function wrap(text: string, width: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > width) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}
