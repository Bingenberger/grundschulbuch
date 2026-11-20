// Building own Programmieren tasks on the carpet, as in the dialog of
// Lernsachen-Heft 1.49.0: tools (figure, goal, obstacle, star, move), the
// check whether a task can be solved, and which settings make new tasks while
// own tasks stay. Pure logic; CodeOptions.tsx shows it.

export type Cell = [number, number];
export type Stop = { x: number; y: number; t: string };
export type CodeTask = {
  n: number;
  start: [number, number, number];
  goal: Cell | null;
  walls: Cell[];
  stars: Cell[];
  stops: Stop[];
  extra: Stop[];
  own?: boolean;
  best?: number;
  [key: string]: unknown;
};
export type CodeTool = 'start' | 'goal' | 'wall' | 'star' | 'move';
type Pg = { lesson?: unknown; penMode?: unknown; numMat?: unknown; size?: unknown; tasks?: unknown; [key: string]: unknown };

export const TOOL_LABELS: Record<CodeTool, string> = { start: 'Figur', goal: 'Ziel', wall: 'Hindernis', star: 'Stern', move: 'Verschieben' };
export const TOOL_HINTS: Record<CodeTool, string> = {
  start: 'Tippe auf ein Feld: Die Figur geht dorthin. Tippe auf die Figur: Sie dreht sich.',
  goal: 'Tippe auf ein Feld: Dort ist das Ziel.',
  wall: 'Tippe auf ein Feld: Hindernis an oder aus.',
  star: 'Tippe auf ein Feld: Stern an oder aus.',
  move: 'Tippe auf einen Buchstaben, eine Zahl, einen Stern oder ein Hindernis – dann auf ein freies Feld.',
};

/** The tools for a lesson (the reference's “Linie” for drawn shapes is not offered yet). */
export function codeTools(pg: Pg): CodeTool[] {
  switch (pg.lesson) {
    case 'goal': return ['start', 'goal', 'wall'];
    case 'collect': case 'events': return ['start', 'goal', 'star', 'wall'];
    case 'word': case 'music': return ['move', 'start', 'wall'];
    case 'numbers': case 'math': return pg.numMat ? ['start', 'wall'] : ['move', 'start', 'wall'];
    default: return [];
  }
}

/** The carpet in the picture of codeCarpet (viewBox x-10 … x+s+10). */
export const BOARD = { x: 44, y: 140, s: 810 };
/** The field under a tap, from its position in the picture (0…1). */
export function cellAt(n: number, rx: number, ry: number): Cell | null {
  const size = BOARD.s / n, px = BOARD.x - 10 + rx * (BOARD.s + 20), py = BOARD.y - 10 + ry * (BOARD.s + 20);
  const x = Math.floor((px - BOARD.x) / size), y = Math.floor((py - BOARD.y) / size);
  return x >= 0 && y >= 0 && x < n && y < n ? [x, y] : null;
}
/** Where a field is in the picture (shares 0…1), for marking the picked one. */
export function cellBox(n: number, x: number, y: number) {
  const size = BOARD.s / n, all = BOARD.s + 20;
  return { left: (10 + x * size) / all, top: (10 + y * size) / all, w: size / all, h: size / all };
}

// ── Ways on the carpet: the figure goes forward/back and turns (direction 0 = up) ──
const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
type Pos = { x: number; y: number; d: number };
function steps(n: number, walls: Set<number>, from: Pos) {
  const dist = new Int16Array(n * n * 4).fill(-1), queue: number[] = [];
  const first = (from.y * n + from.x) * 4 + from.d;
  dist[first] = 0;
  queue.push(first);
  for (let i = 0; i < queue.length; i++) {
    const s = queue[i], d = s % 4, cell = (s - d) / 4, x = cell % n, y = (cell - x) / n;
    const next = [cell * 4 + ((d + 3) % 4), cell * 4 + ((d + 1) % 4)];
    for (const k of [1, -1]) {
      const nx = x + k * DX[d], ny = y + k * DY[d];
      if (nx >= 0 && ny >= 0 && nx < n && ny < n && !walls.has(ny * n + nx)) next.push((ny * n + nx) * 4 + d);
    }
    for (const t of next) if (dist[t] < 0) { dist[t] = dist[s] + 1; queue.push(t); }
  }
  return dist;
}
function wayTo(dist: Int16Array, n: number, x: number, y: number): { len: number; end: Pos } | null {
  let best: { len: number; end: Pos } | null = null;
  for (let d = 0; d < 4; d++) {
    const len = dist[(y * n + x) * 4 + d];
    if (len >= 0 && (!best || len < best.len)) best = { len, end: { x, y, d } };
  }
  return best;
}
const startOf = (t: CodeTask): Pos => ({ x: t.start[0], y: t.start[1], d: t.start[2] });
const wallSet = (t: CodeTask) => new Set(t.walls.map(([x, y]) => y * t.n + x));
const same = (c: Cell | null | undefined, x: number, y: number) => !!c && c[0] === x && c[1] === y;

/** One tap with a tool: the changed task (now “eigene”) and the picked field (for “Verschieben”). */
export function applyTool(task: CodeTask, tool: CodeTool, x: number, y: number, pick: Cell | null): { t: CodeTask; pick: Cell | null } {
  const isStart = task.start[0] === x && task.start[1] === y;
  const isWall = task.walls.some(([a, b]) => a === x && b === y);
  const isStar = task.stars.some(([a, b]) => a === x && b === y);
  const isStop = [...task.stops, ...task.extra].some((s) => s.x === x && s.y === y);
  const isGoal = same(task.goal, x, y);
  const taken = isStart || isWall || isStar || isStop || isGoal;
  let next: CodeTask = { ...task, walls: task.walls.slice(), stars: task.stars.slice(), stops: task.stops.map((s) => ({ ...s })), extra: task.extra.map((s) => ({ ...s })), own: true };
  const keep = { t: task, pick };
  switch (tool) {
    case 'start':
      if (isStart) next.start = [x, y, (task.start[2] + 1) % 4];
      else if (!isWall && !isGoal && !isStar) next.start = [x, y, task.start[2]];
      else return keep;
      break;
    case 'goal':
      if (!task.goal || isStart || isWall || isStar || isStop) return keep;
      next.goal = [x, y];
      break;
    case 'wall':
      if (isWall) next.walls = next.walls.filter(([a, b]) => a !== x || b !== y);
      else if (!taken) next.walls.push([x, y]);
      else return keep;
      break;
    case 'star':
      if (isStar) next.stars = next.stars.filter(([a, b]) => a !== x || b !== y);
      else if (!taken) next.stars.push([x, y]);
      else return keep;
      break;
    case 'move': {
      if (!pick) return { t: task, pick: isStop || isStar || isWall ? [x, y] : null };
      if (same(pick, x, y) || taken) return { t: task, pick: null };
      const [px, py] = pick;
      const moved = (s: Stop) => (s.x === px && s.y === py ? { ...s, x, y } : s);
      next.stops = next.stops.map(moved);
      next.extra = next.extra.map(moved);
      next.stars = next.stars.map(([a, b]) => (a === px && b === py ? [x, y] : [a, b]));
      next.walls = next.walls.map(([a, b]) => (a === px && b === py ? [x, y] : [a, b]));
      break;
    }
  }
  if (next.goal) {
    const way = wayTo(steps(next.n, wallSet(next), startOf(next)), next.n, next.goal[0], next.goal[1]);
    next = { ...next, best: way?.len };
    if (next.best === undefined) delete next.best;
  }
  return { t: next, pick: null };
}

/** Can the task be solved? With a short text as in the reference. */
export function checkTask(pg: Pg, task: CodeTask): { ok: boolean; text: string } {
  if (pg.lesson === 'pen') return { ok: true, text: '' };
  const n = task.n, walls = wallSet(task);
  if (task.stops.length) {
    let at = startOf(task);
    for (const stop of task.stops) {
      const way = wayTo(steps(n, walls, at), n, stop.x, stop.y);
      if (!way) return { ok: false, text: `So geht es nicht: ${stop.t} ist nicht zu erreichen.` };
      at = way.end;
    }
    return { ok: true, text: 'Lösbar.' };
  }
  if (!task.goal) return { ok: true, text: '' };
  let at = startOf(task);
  for (const [x, y] of task.stars) {
    const way = wayTo(steps(n, walls, at), n, x, y);
    if (!way) return { ok: false, text: 'So geht es nicht: Ein Stern ist nicht zu erreichen.' };
    at = way.end;
  }
  const way = wayTo(steps(n, walls, startOf(task)), n, task.goal[0], task.goal[1]);
  if (!way) return { ok: false, text: 'So geht es nicht: Das Ziel ist nicht zu erreichen.' };
  if (way.len === 0) return { ok: false, text: 'Die Figur steht schon auf dem Ziel.' };
  return { ok: true, text: task.stars.length ? 'Lösbar.' : `Lösbar – das kürzeste Programm hat ${way.len} ${way.len === 1 ? 'Baustein' : 'Bausteine'}.` };
}
/** The first task that cannot be solved (−1: all fine). */
export const unsolvable = (pg: Pg) => ((Array.isArray(pg.tasks) ? pg.tasks : []) as CodeTask[]).findIndex((t) => !checkTask(pg, t).ok);

/** Settings that make the reference throw new tasks (own ones stay, except for lesson and size). */
const RENEW = ['lesson', 'level', 'walls', 'turn', 'size', 'count', 'words', 'range', 'ops', 'numMat', 'read', 'limit', 'penMode'];

type Clean = (raw: unknown) => Pg;
/** New random tasks for these settings. */
export const freshTasks = (pg: Pg, clean: Clean) => clean({ ...pg, tasks: [] }).tasks as CodeTask[];
/** “Alle anderen neu”: new tasks, own ones stay in their place. */
export function renewKeepingOwn(pg: Pg, clean: Clean) {
  const old = (pg.tasks ?? []) as CodeTask[];
  return freshTasks(pg, clean).map((t, i) => (old[i]?.own && old[i].n === pg.size ? old[i] : t));
}
/** A change in the form: as in the reference, tasks are thrown again where needed. */
export function changeSettings(old: Pg, next: Pg, clean: Clean): Pg {
  const changed = RENEW.filter((k) => JSON.stringify(old[k]) !== JSON.stringify(next[k]));
  if (!changed.length) return clean({ ...next, tasks: old.tasks });
  const merged = clean({ ...next, tasks: [] });
  if (changed.includes('lesson') || changed.includes('size')) return merged;
  return { ...merged, tasks: renewKeepingOwn({ ...merged, tasks: old.tasks }, clean) };
}
