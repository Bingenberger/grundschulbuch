'use client';
// Dienes-Material: Einerwürfel, Zehnerstangen, Hunderterplatten and
// Tausenderwürfel on a place value mat. Take pieces from the box, tap a piece
// to put it back, swap ten for one (and back), read the number; optional tasks.
import type { PageElement } from '@/lib/notebook-model';
import type { JsonValue } from '@/lib/learning/catalog';
import {
  addOne,
  bundle,
  canBundle,
  canUnbundle,
  countsValue,
  emptyCounts,
  freshTasks,
  numberText,
  placeTasks,
  placeText,
  shownPlaces,
  takeOne,
  unbundle,
  type Counts,
  type Place,
  type TaskState,
} from '@/lib/learning/placevalue';
import { dienesSettings } from '@/lib/learning/dienes';
import { feedback } from '@/lib/learning/feedback';
import { useLearning } from './Runtime';
import SvgKey, { SvgButton } from './SvgKey';

const FONT = 'Verdana, Arial, sans-serif';
const W = 1000;
const WOOD = { color: '#c98f4f', light: '#fdf3e6', edge: '#8a5a2b' };
const shade = (hex: string, f: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
};

/** A block made of small cubes: front with grid, top and right side. */
function Block({ x, y, cols, rows, depth, unit, color, edge }: { x: number; y: number; cols: number; rows: number; depth: number; unit: number; color: string; edge: string }) {
  const w = cols * unit, h = rows * unit, d = depth * unit * 0.45;
  const lines: string[] = [];
  for (let c = 1; c < cols; c++) lines.push(`M${x + c * unit} ${y}v${h}`);
  for (let r = 1; r < rows; r++) lines.push(`M${x} ${y + r * unit}h${w}`);
  const top: string[] = [], side: string[] = [];
  if (depth > 1) {
    for (let k = 1; k < depth; k++) {
      const f = (k / depth) * d;
      top.push(`M${x + f} ${y - f}h${w}`);
      side.push(`M${x + w + f} ${y - f}v${h}`);
    }
  }
  for (let c = 1; c < cols; c++) top.push(`M${x + c * unit} ${y}l${d} ${-d}`);
  for (let r = 1; r < rows; r++) side.push(`M${x + w} ${y + r * unit}l${d} ${-d}`);
  return (
    <g>
      <path d={`M${x} ${y}l${d} ${-d}h${w}l${-d} ${d}z`} fill={shade(color, 1.18)} stroke={edge} strokeWidth="1.5" strokeLinejoin="round" />
      <path d={`M${x + w} ${y}l${d} ${-d}v${h}l${-d} ${d}z`} fill={shade(color, 0.8)} stroke={edge} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x={x} y={y} width={w} height={h} fill={color} stroke={edge} strokeWidth="1.5" />
      <path d={[...lines, ...top, ...side].join('')} stroke={edge} strokeWidth="1" opacity=".55" fill="none" />
    </g>
  );
}

/** Shape of a piece in small cubes: Einer 1×1×1, Zehner 1×10, Hunderter 10×10 (flat), Tausender 10×10×10. */
const SHAPE: Record<string, { cols: number; rows: number; depth: number }> = {
  E: { cols: 1, rows: 1, depth: 1 },
  Z: { cols: 1, rows: 10, depth: 1 },
  H: { cols: 10, rows: 10, depth: 1 },
  T: { cols: 10, rows: 10, depth: 10 },
};
const unitFor = (id: string, cw: number) => (id === 'E' ? Math.min(26, cw / 7) : id === 'Z' ? Math.min(24, cw / 8) : Math.min(id === 'T' ? 11 : 13, (cw - 60) / 11));

function pieceSize(id: string, cw: number) {
  const s = SHAPE[id], u = unitFor(id, cw), d = s.depth * u * 0.45;
  return { w: s.cols * u + d, h: s.rows * u + d, u };
}

/** Where the pieces of one column go: ones in a grid, rods side by side, flats and cubes as a pile. */
function layout(id: string, n: number, x: number, y: number, cw: number, h: number) {
  const { w, h: ph } = pieceSize(id, cw);
  if (id === 'E') {
    const per = Math.max(1, Math.floor((cw - 20) / (w + 6)));
    return Array.from({ length: n }, (_, k) => ({ x: x + 10 + (k % per) * (w + 6), y: y + 12 + Math.floor(k / per) * (ph + 6) + ph * 0.3 }));
  }
  if (id === 'Z') {
    const step = n > 1 ? Math.min(w + 6, (cw - 20 - w) / (n - 1)) : 0;
    return Array.from({ length: n }, (_, k) => ({ x: x + 10 + k * step, y: y + 12 }));
  }
  const step = n > 1 ? Math.min(16, (h - ph - 20) / (n - 1)) : 0;
  return Array.from({ length: n }, (_, k) => ({ x: x + 10 + k * step * 0.6, y: y + 14 + ph * 0.08 + k * step }));
}

/** Pieces in the box stay small enough for the label underneath. */
const boxScale = (size: { w: number; h: number }, cw: number) => Math.min(1, 80 / size.h, (cw - 40) / size.w);

export default function DienesMaterial({ element }: { element: PageElement }) {
  const { interactive, state, update } = useLearning(element);
  const s = dienesSettings(element.settings?.dienes);
  const places = shownPlaces(0, s.to);
  const saved = (state.dienes && typeof state.dienes === 'object' ? state.dienes : {}) as { counts?: Counts; task?: TaskState };
  const counts = Array.isArray(saved.counts) && saved.counts.length === places.length ? saved.counts : emptyCounts(places);
  const task = saved.task ?? freshTasks(Number(element.id.replace(/\D/g, '').slice(0, 8)) || 11);
  const tasks = s.tasks ? placeTasks(places, s.tasks, task.seed) : [];
  const target = tasks[task.at];
  const done = s.tasks > 0 && task.at >= tasks.length;
  const save = (next: { counts?: Counts; task?: TaskState }) => update({ dienes: { counts, task, ...next } as unknown as JsonValue });
  const value = countsValue(places, counts);
  const colors = (p: Place) => (s.colors === 'montessori' ? { color: p.color, light: p.light, edge: shade(p.color, 0.6) } : WOOD);

  const top = s.tasks ? 90 : 0;
  const k = places.length, cw = (W - 40) / k, matTop = top + 80, matH = 400;
  const H = matTop + matH + 150 + (s.exchange ? 66 : 0) + (s.total ? 70 : 0);
  const stockY = matTop + matH + 20;
  const lay = (i: number) => save({ counts: addOne(counts, i), task: { ...task, checked: null } });
  const take = (i: number) => save({ counts: takeOne(counts, i), task: { ...task, checked: null } });
  const check = () => {
    if (target === undefined) return;
    const right = value === target && counts.every((c) => c <= 9);
    feedback(right);
    save({ task: { ...task, checked: right ? 'right' : 'wrong', right: task.right + (right && task.checked !== 'right' ? 1 : 0) } });
  };

  return (
    <svg className="math-tool dienes" viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="group" aria-label={`Dienes-Material: ${placeText(places, counts)} = ${value}`}>
      {s.tasks > 0 && (
        <g>
          <rect x="20" y="10" width={W - 40} height="70" rx="16" fill="#fff9db" stroke="#fab005" strokeWidth="3" />
          <text x="44" y="56" fontSize="30" fontWeight="700" fill="#1f2937" fontFamily={FONT}>
            {done ? `Geschafft! ${task.right} von ${tasks.length} richtig.` : `Lege die Zahl ${numberText(target)}.`}
          </text>
          {!done && <text x={W - 360} y="56" fontSize="20" fill="#868e96" fontFamily={FONT} textAnchor="end">Aufgabe {task.at + 1} von {tasks.length}</text>}
          {done ? (
            <SvgButton x={W - 220} y={20} w={180} h={50} label="Nochmal" text="Nochmal" active={interactive} onPress={() => save({ counts: emptyCounts(places), task: freshTasks(task.seed + 1) })} />
          ) : task.checked === 'right' ? (
            <SvgButton x={W - 220} y={20} w={180} h={50} label="Weiter" text="Weiter ▸" fill="#2f9e44" active={interactive} onPress={() => save({ counts: emptyCounts(places), task: { ...task, at: task.at + 1, checked: null } })} />
          ) : (
            <SvgButton x={W - 220} y={20} w={180} h={50} label="Prüfen" text="Prüfen" active={interactive} onPress={check} />
          )}
        </g>
      )}
      {places.map((p, i) => {
        const x = 20 + i * cw, c = counts[i] || 0, col = colors(p), over = c >= 10;
        const size = pieceSize(p.id, cw);
        return (
          <g key={p.id}>
            <rect x={x + 4} y={top + 16} width={cw - 8} height="54" rx="12" fill={s.colors === 'montessori' ? p.color : '#6b4f2f'} />
            <text x={x + cw / 2} y={top + 52} textAnchor="middle" fontSize={cw > 200 ? 26 : 20} fontWeight="700" fill="#fff" fontFamily={FONT}>{p.name}</text>
            <rect x={x + 4} y={matTop} width={cw - 8} height={matH} rx="12" fill={col.light} stroke={over ? '#e03131' : '#ced4da'} strokeWidth={over ? 5 : 2} strokeDasharray={over ? '14 8' : undefined} />
            {layout(p.id, c, x + 4, matTop, cw - 8, matH).map((at, n) => (
              <SvgKey key={n} label={`${p.name} zurücklegen`} active={interactive} onPress={() => take(i)}>
                <Block x={at.x} y={at.y + SHAPE[p.id].depth * size.u * 0.45} {...SHAPE[p.id]} unit={size.u} color={col.color} edge={col.edge} />
              </SvgKey>
            ))}
            <text x={x + cw - 18} y={matTop + matH - 16} textAnchor="end" fontSize="34" fontWeight="700" fill={over ? '#e03131' : s.colors === 'montessori' ? p.color : '#6b4f2f'} fontFamily={FONT}>{c}</text>
            {/* The box: take a piece */}
            <SvgKey label={`${p.name} dazulegen`} active={interactive} onPress={() => lay(i)}>
              <rect x={x + 4} y={stockY} width={cw - 8} height="130" rx="14" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="2" strokeDasharray="8 6" />
              <g transform={`translate(${x + cw / 2 - (size.w * boxScale(size, cw)) / 2} ${stockY + 10}) scale(${boxScale(size, cw)})`}>
                <Block x={0} y={SHAPE[p.id].depth * size.u * 0.45} {...SHAPE[p.id]} unit={size.u} color={col.color} edge={col.edge} />
              </g>
              <text x={x + cw / 2} y={stockY + 122} textAnchor="middle" fontSize="18" fill="#495057" fontFamily={FONT}>+ {p.name.replace(/er$/, 'er')}</text>
            </SvgKey>
            {s.exchange && canBundle(counts, i) && (
              <SvgButton x={x + 8} y={stockY + 144} w={cw - 16} h={50} label={`10 ${p.name} tauschen gegen 1 ${places[i - 1].name}`} text="◂ 10 tauschen" size={cw > 200 ? 22 : 16} fill={s.colors === 'montessori' ? places[i - 1].color : '#6b4f2f'} active={interactive} onPress={() => save({ counts: bundle(counts, i), task: { ...task, checked: null } })} />
            )}
            {s.exchange && !canBundle(counts, i) && canUnbundle(counts, i) && (
              <SvgButton x={x + 8} y={stockY + 144} w={cw - 16} h={50} label={`1 ${p.name} tauschen gegen 10 ${places[i + 1].name}`} text="in 10 tauschen ▸" size={cw > 200 ? 20 : 15} fill="#fff" color={s.colors === 'montessori' ? p.color : '#6b4f2f'} active={interactive} onPress={() => save({ counts: unbundle(counts, i), task: { ...task, checked: null } })} />
            )}
          </g>
        );
      })}
      {s.total && (
        <text x={W / 2} y={H - 22} textAnchor="middle" fontSize="38" fontWeight="700" fill="#1f2937" fontFamily={FONT}>
          {places.map((p, i) => (
            <tspan key={p.id} fill={s.colors === 'montessori' ? p.color : '#6b4f2f'}>{`${counts[i] || 0} ${p.short}  `}</tspan>
          ))}
          <tspan fill="#1f2937">= {numberText(value)}</tspan>
        </text>
      )}
      {s.tasks > 0 && task.checked && !done && (
        <text x={40} y={top + matTop - 6 - top} fontSize="22" fontWeight="700" fill={task.checked === 'right' ? '#2f9e44' : '#e03131'} fontFamily={FONT}>
          {task.checked === 'right' ? '✓ Richtig!' : counts.some((c) => c > 9) && value === target ? 'Die Zahl stimmt – jetzt noch tauschen!' : 'Noch nicht. Zähle noch einmal nach.'}
        </text>
      )}
      {interactive && (
        <SvgKey label="Alles zurücklegen" active onPress={() => save({ counts: emptyCounts(places), task: { ...task, checked: null } })}>
          <circle cx={W - 34} cy={H - 34} r="24" fill="#fff" stroke="#94a3b8" strokeWidth="3" />
          <path d={`M${W - 43} ${H - 36}a10 10 0 1 0 3-7M${W - 43} ${H - 46}v8h8`} fill="none" stroke="#495057" strokeWidth="3" strokeLinecap="round" />
        </SvgKey>
      )}
    </svg>
  );
}
