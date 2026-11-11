import type { LearningResponse, LearningSettings } from './catalog';
import { seeded } from './algorithms';
export type GeometryPoint = { x: number; y: number };
export type GeometrySegment = { a: GeometryPoint; b: GeometryPoint };
export type GeometryTask = { name: string; path: GeometryPoint[] };
export const defaultGeometryPath = [{ x: 20, y: 20 }, { x: 80, y: 20 }, { x: 80, y: 70 }, { x: 20, y: 70 }, { x: 20, y: 20 }];
export function geometryCustom(c: LearningSettings) { return c.geometryMode === 'custom' || !c.geometryMode && !!c.path?.length; }
export function geometryTrace(c: LearningSettings) { return c.geometryHelp === 'trace' || !c.geometryHelp && geometryCustom(c); }
const templates = [
  [
    { name: 'Rechteck', points: [[25, 30], [75, 30], [75, 65], [25, 65], [25, 30]] },
    { name: 'Quadrat', points: [[30, 30], [70, 30], [70, 70], [30, 70], [30, 30]] },
    { name: 'Treppenlinie', points: [[25, 65], [25, 40], [50, 40], [50, 25], [75, 25]] },
    { name: 'offenes Rechteck', points: [[25, 65], [25, 30], [75, 30], [75, 65]] },
  ],
  [
    { name: 'rechtwinkliges Dreieck', points: [[25, 25], [75, 75], [25, 75], [25, 25]] },
    { name: 'Dreieck', points: [[25, 70], [50, 25], [75, 70], [25, 70]] },
    { name: 'Parallelogramm', points: [[20, 70], [40, 30], [80, 30], [60, 70], [20, 70]] },
    { name: 'Trapez', points: [[20, 70], [35, 30], [65, 30], [80, 70], [20, 70]] },
  ],
  [
    { name: 'Haus', points: [[25, 75], [25, 40], [50, 20], [75, 40], [75, 75], [25, 75]] },
    { name: 'Sechseck', points: [[20, 50], [35, 25], [65, 25], [80, 50], [65, 75], [35, 75], [20, 50]] },
    { name: 'Zickzacklinie', points: [[20, 70], [35, 30], [50, 65], [65, 25], [80, 60]] },
    { name: 'Pfeilkontur', points: [[20, 40], [55, 40], [55, 25], [80, 50], [55, 75], [55, 60], [20, 60], [20, 40]] },
  ],
];
export function geometryTasks(c: LearningSettings): GeometryTask[] {
  if (geometryCustom(c)) return [{ name: 'Eigene Form', path: (c.path?.length ? c.path : defaultGeometryPath).map(p => ({ x: p.x * 2, y: p.y * 2 })) }];
  const level = Math.max(0, Math.min(2, Math.round(c.difficulty || 1) - 1)), count = Math.max(1, Math.min(12, Math.round(c.geometryCount || 5))), random = seeded(c.seed ?? 42);
  const offset = random(templates[level].length);
  return Array.from({ length: count }, (_, i) => {
    const template = templates[level][(offset + i) % templates[level].length], dx = (random(3) - 1) * 5, dy = (random(3) - 1) * 5;
    return { name: template.name, path: template.points.map(([x, y]) => ({ x: (x + dx) * 2, y: (y + dy) * 2 })) };
  });
}
export function geometryEdges(task: GeometryTask): GeometrySegment[] { return task.path.slice(1).map((b, i) => ({ a: task.path[i], b })); }
export function validGeometryPoint(p: unknown): p is GeometryPoint {
  return !!p && typeof p === 'object' && 'x' in p && 'y' in p && typeof p.x === 'number' && typeof p.y === 'number' && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 200 && p.y >= 0 && p.y <= 200;
}
const distance = (a: GeometryPoint, b: GeometryPoint) => Math.hypot(a.x - b.x, a.y - b.y);
/** A maximum one-to-one match: duplicate strokes cannot stand in for missing edges. */
export function assessGeometry(task: GeometryTask, drawn: GeometrySegment[], tolerance = 3) {
  const edges = geometryEdges(task), owners = edges.map(() => -1);
  const near = (a: GeometryPoint, b: GeometryPoint) => distance(a, b) <= tolerance;
  function assign(source: number, seen: Set<number>): boolean {
    for (let i = 0; i < edges.length; i++) {
      const { a, b } = edges[i], p = drawn[source];
      if (seen.has(i) || !(near(a, p.a) && near(b, p.b) || near(a, p.b) && near(b, p.a))) continue;
      seen.add(i); if (owners[i] < 0 || assign(owners[i], seen)) { owners[i] = source; return true; }
    }
    return false;
  }
  drawn.forEach((_, i) => assign(i, new Set()));
  const matched = owners.filter(i => i >= 0);
  return { correct: edges.length > 0 && matched.length === edges.length && drawn.length === edges.length, matched, missing: edges.length - matched.length, extra: drawn.length - matched.length };
}
export function geometrySegmentAt(segments: GeometrySegment[], point: GeometryPoint, tolerance = 4) {
  let found = -1, best = tolerance;
  for (let i = segments.length - 1; i >= 0; i--) {
    const { a, b } = segments[i], dx = b.x - a.x, dy = b.y - a.y, length = dx * dx + dy * dy;
    const t = length ? Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / length)) : 0;
    const gap = distance(point, { x: a.x + t * dx, y: a.y + t * dy });
    if (gap <= best) { best = gap; found = i; }
  }
  return found;
}
export type GeometryState = { exercise: string; index: number; segments: GeometrySegment[]; checked: boolean; correct: boolean; helped: boolean; viewed: boolean; solution: boolean; attempts: number; results: { correct: boolean; helped: boolean }[]; completed: boolean };
function initial(c: LearningSettings): GeometryState {
  return { exercise: JSON.stringify([geometryTasks(c), geometryTrace(c)]), index: 0, segments: [], checked: false, correct: false, helped: geometryTrace(c), viewed: false, solution: false, attempts: 0, results: [], completed: false };
}
export function readGeometry(response: LearningResponse, c: LearningSettings): GeometryState {
  const base = initial(c), tasks = geometryTasks(c), raw = response.geometry;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.exercise !== base.exercise) {
    if (!raw && geometryCustom(c) && Array.isArray(response.path)) {
      const points = response.path.filter(validGeometryPoint).map(p => ({ x: p.x * 2, y: p.y * 2 }));
      base.segments = points.slice(0, 60).flatMap((a, i) => i % 2 === 0 && points[i + 1] && validGeometryPoint(a) && validGeometryPoint(points[i + 1]) ? [{ a, b: points[i + 1] }] : []);
    }
    return base;
  }
  const index = Math.max(0, Math.min(tasks.length - 1, Math.floor(Number(raw.index) || 0)));
  const segments = Array.isArray(raw.segments) ? raw.segments.filter((s): s is GeometrySegment => !!s && typeof s === 'object' && 'a' in s && 'b' in s && validGeometryPoint(s.a) && validGeometryPoint(s.b)).slice(0, 30) : [];
  const results = Array.isArray(raw.results) ? raw.results.filter((r): r is GeometryState['results'][number] => !!r && typeof r === 'object' && 'correct' in r && 'helped' in r && typeof r.correct === 'boolean' && typeof r.helped === 'boolean').slice(0, tasks.length) : [];
  const completed = raw.completed === true && results.length === tasks.length;
  return { ...base, index, segments, results: completed ? results : results.slice(0, index), completed, checked: raw.checked === true,
    correct: raw.checked === true && assessGeometry(tasks[index], segments).correct, helped: raw.helped === true || geometryTrace(c), viewed: raw.viewed === true, solution: raw.solution === true,
    attempts: Math.max(0, Math.min(100, Math.floor(Number(raw.attempts) || 0))) };
}
export type GeometryAction = { type: 'add'; segment: GeometrySegment } | { type: 'remove'; index: number } | { type: 'check' | 'undo' | 'reset' | 'next' | 'skip' | 'restart' | 'help' | 'preview' | 'solution' };
export function geometryStep(state: GeometryState, c: LearningSettings, action: GeometryAction): GeometryState {
  if (action.type === 'restart') return initial(c);
  if (state.completed) return state;
  const tasks = geometryTasks(c), task = tasks[state.index]; if (!task) return state;
  if (action.type === 'preview') return { ...state, viewed: true };
  if (action.type === 'help') return { ...state, viewed: true, helped: true };
  if (action.type === 'solution') return state.attempts >= 2 ? { ...state, helped: true, solution: true } : state;
  if (action.type === 'next' || action.type === 'skip') {
    if (action.type === 'next' && !state.correct) return state;
    const results = [...state.results.slice(0, state.index), { correct: state.checked && state.correct, helped: state.helped }];
    return state.index + 1 === tasks.length ? { ...state, results, completed: true } : { ...initial(c), index: state.index + 1, results };
  }
  if (action.type === 'remove') return Number.isInteger(action.index) && action.index >= 0 && action.index < state.segments.length ? { ...state, segments: state.segments.filter((_, i) => i !== action.index), checked: false, correct: false } : state;
  if (action.type === 'reset' || action.type === 'undo') return { ...state, segments: action.type === 'reset' ? [] : state.segments.slice(0, -1), checked: false, correct: false, solution: false };
  if (state.correct) return state;
  if (action.type === 'check') return state.segments.length ? { ...state, checked: true, correct: assessGeometry(task, state.segments).correct, attempts: Math.min(100, state.attempts + 1) } : state;
  if (action.type !== 'add') return state;
  const s = action.segment;
  return state.segments.length >= 30 || !validGeometryPoint(s.a) || !validGeometryPoint(s.b) || distance(s.a, s.b) < 1 ? state : { ...state, segments: [...state.segments, s], checked: false, correct: false };
}
export function geometryScore(state: GeometryState, c: LearningSettings) {
  return Math.round((state.results.filter(r => r.correct).length + (!state.completed && state.correct ? 1 : 0)) / geometryTasks(c).length * 100);
}
