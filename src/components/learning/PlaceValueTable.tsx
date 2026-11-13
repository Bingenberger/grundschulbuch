'use client';
// Stellenwerttafel in Montessori colours: lay counters, bundle ten into one of
// the next place, unbundle, read the number; optionally “Lege die Zahl …”.
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
  placeSettings,
  placeTasks,
  placeText,
  shownPlaces,
  takeOne,
  unbundle,
  type Counts,
  type TaskState,
} from '@/lib/learning/placevalue';
import { feedback } from '@/lib/learning/feedback';
import { useLearning } from './Runtime';
import SvgKey, { SvgButton } from './SvgKey';

const FONT = 'Verdana, Arial, sans-serif';
const W = 1000;

/** Counters like the Montessori board: pairs in rows, five rows per ten. */
function counterSpots(n: number, x: number, y: number, w: number, h: number) {
  const cols = n > 10 ? 4 : 2, rows = 5;
  const r = Math.min((w - 20) / cols, (h - 10) / rows) * 0.38;
  const gx = (w - 20) / cols, gy = (h - 10) / rows;
  return Array.from({ length: n }, (_, k) => {
    const block = n > 10 ? Math.floor(k / 10) : 0, inBlock = k % 10;
    const col = block * 2 + (inBlock % 2), row = Math.floor(inBlock / 2);
    return { cx: x + 10 + gx * (col + 0.5), cy: y + 5 + gy * (row + 0.5), r };
  });
}

export default function PlaceValueTable({ element }: { element: PageElement }) {
  const { interactive, state, update } = useLearning(element);
  const s = placeSettings(element.settings?.place);
  const places = shownPlaces(s.from, s.to);
  const saved = (state.place && typeof state.place === 'object' ? state.place : {}) as { counts?: Counts; task?: TaskState };
  const counts = Array.isArray(saved.counts) && saved.counts.length === places.length ? saved.counts : emptyCounts(places);
  const task = saved.task ?? freshTasks(Number(element.id.replace(/\D/g, '').slice(0, 8)) || 7);
  const tasks = s.tasks ? placeTasks(places, s.tasks, task.seed) : [];
  const target = tasks[task.at];
  const done = s.tasks > 0 && task.at >= tasks.length;
  const save = (next: { counts?: Counts; task?: TaskState }) => update({ place: { counts, task, ...next } as unknown as JsonValue });
  const value = countsValue(places, counts);

  const top = s.tasks ? 90 : 0;
  const k = places.length, cw = (W - 40) / k, bodyTop = top + 110, bodyH = 300;
  const H = top + 110 + bodyH + (s.digits ? 90 : 0) + (s.exchange ? 70 : 0) + (s.total ? 80 : 0) + 20;

  const check = () => {
    if (target === undefined) return;
    const right = value === target && counts.every((c) => c <= 9);
    feedback(right);
    save({ task: { ...task, checked: right ? 'right' : 'wrong', right: task.right + (right && task.checked !== 'right' ? 1 : 0) } });
  };
  const next = () => save({ counts: emptyCounts(places), task: { ...task, at: task.at + 1, checked: null } });
  const label = `Stellenwerttafel: ${placeText(places, counts)} = ${value}`;

  return (
    <svg className="math-tool place-table" viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="group" aria-label={label}>
      {s.tasks > 0 && (
        <g>
          <rect x="20" y="10" width={W - 40} height="70" rx="16" fill="#fff9db" stroke="#fab005" strokeWidth="3" />
          <text x="44" y="56" fontSize="30" fontWeight="700" fill="#1f2937" fontFamily={FONT}>
            {done ? `Geschafft! ${task.right} von ${tasks.length} richtig.` : `Lege die Zahl ${numberText(target)}.`}
          </text>
          {!done && (
            <text x={W - 360} y="56" fontSize="20" fill="#868e96" fontFamily={FONT} textAnchor="end">
              Aufgabe {task.at + 1} von {tasks.length}
            </text>
          )}
          {done ? (
            <SvgButton x={W - 220} y={20} w={180} h={50} label="Nochmal" text="Nochmal" active={interactive} onPress={() => save({ counts: emptyCounts(places), task: freshTasks(task.seed + 1) })} />
          ) : task.checked === 'right' ? (
            <SvgButton x={W - 220} y={20} w={180} h={50} label="Weiter" text="Weiter ▸" fill="#2f9e44" active={interactive} onPress={next} />
          ) : (
            <SvgButton x={W - 220} y={20} w={180} h={50} label="Prüfen" text="Prüfen" active={interactive} onPress={check} />
          )}
        </g>
      )}
      {places.map((p, i) => {
        const x = 20 + i * cw, c = counts[i] || 0, over = c >= 10;
        return (
          <g key={p.id}>
            {/* Header: short name big, full name small */}
            <rect x={x + 4} y={top + 20} width={cw - 8} height="80" rx="12" fill={p.color} />
            <text x={x + cw / 2} y={top + 62} textAnchor="middle" fontSize={cw > 140 ? 40 : 30} fontWeight="700" fill="#fff" fontFamily={FONT}>{p.short}</text>
            <text x={x + cw / 2} y={top + 88} textAnchor="middle" fontSize={cw > 160 ? 18 : 13} fill="#fff" fontFamily={FONT}>{p.name}</text>
            {/* Body: tap to lay a counter */}
            <SvgKey label={`${p.name}: ein Plättchen dazu (jetzt ${c})`} active={interactive && s.counters} onPress={() => save({ counts: addOne(counts, i), task: { ...task, checked: null } })}>
              <rect x={x + 4} y={bodyTop} width={cw - 8} height={bodyH} rx="12" fill={p.light} stroke={over ? '#e03131' : p.color} strokeWidth={over ? 5 : 2} strokeDasharray={over ? '14 8' : undefined} />
            </SvgKey>
            {s.counters &&
              counterSpots(c, x + 4, bodyTop, cw - 8, bodyH).map((spot, n) => (
                <SvgKey key={n} label={`${p.name}: ein Plättchen weg`} active={interactive} onPress={() => save({ counts: takeOne(counts, i), task: { ...task, checked: null } })}>
                  <circle cx={spot.cx} cy={spot.cy} r={spot.r} fill={p.color} stroke="#fff" strokeWidth="3" />
                  <text x={spot.cx} y={spot.cy + spot.r * 0.35} textAnchor="middle" fontSize={spot.r * (String(p.value >= 1000 ? p.short : p.value).length > 2 ? 0.62 : 0.95)} fontWeight="700" fill="#fff" fontFamily={FONT}>{p.value >= 1000 ? p.short : p.value}</text>
                </SvgKey>
              ))}
            {s.digits && (
              <g>
                <SvgButton x={x + 8} y={bodyTop + bodyH + 20} w={Math.min(60, cw / 4)} h={56} label={`${p.name}: eins weniger`} text="−" size={32} fill="#f1f3f5" color="#495057" active={interactive} disabled={c === 0} onPress={() => save({ counts: takeOne(counts, i), task: { ...task, checked: null } })} />
                <text x={x + cw / 2} y={bodyTop + bodyH + 64} textAnchor="middle" fontSize="48" fontWeight="700" fill={over ? '#e03131' : p.color} fontFamily={FONT}>{c}</text>
                <SvgButton x={x + cw - 8 - Math.min(60, cw / 4)} y={bodyTop + bodyH + 20} w={Math.min(60, cw / 4)} h={56} label={`${p.name}: eins mehr`} text="+" size={32} fill="#f1f3f5" color="#495057" active={interactive} disabled={c >= 19} onPress={() => save({ counts: addOne(counts, i), task: { ...task, checked: null } })} />
              </g>
            )}
            {s.exchange && (
              <g>
                {canBundle(counts, i) && (
                  <SvgButton x={x + 8} y={bodyTop + bodyH + (s.digits ? 100 : 20)} w={cw - 16} h={50} label={`10 ${p.name} bündeln zu 1 ${places[i - 1].name.replace(/er$/, 'er')}`} text="◂ 10 bündeln" size={cw > 160 ? 22 : 16} fill={places[i - 1].color} active={interactive} onPress={() => save({ counts: bundle(counts, i), task: { ...task, checked: null } })} />
                )}
                {!canBundle(counts, i) && canUnbundle(counts, i) && (
                  <SvgButton x={x + 8} y={bodyTop + bodyH + (s.digits ? 100 : 20)} w={cw - 16} h={50} label={`1 ${p.name} entbündeln zu 10 ${places[i + 1].name}`} text="entbündeln ▸" size={cw > 160 ? 22 : 16} fill="#fff" color={p.color} active={interactive} onPress={() => save({ counts: unbundle(counts, i), task: { ...task, checked: null } })} />
                )}
              </g>
            )}
          </g>
        );
      })}
      {s.total && (
        <text x={W / 2} y={H - 30} textAnchor="middle" fontSize="40" fontWeight="700" fill="#1f2937" fontFamily={FONT}>
          {places.map((p, i) => (
            <tspan key={p.id} fill={p.color}>{`${counts[i] || 0} ${p.short}  `}</tspan>
          ))}
          <tspan fill="#1f2937">= {numberText(value)}</tspan>
        </text>
      )}
      {s.tasks > 0 && task.checked && !done && (
        <text x={W / 2} y={H - (s.total ? 80 : 10)} textAnchor="middle" fontSize="24" fontWeight="700" fill={task.checked === 'right' ? '#2f9e44' : '#e03131'} fontFamily={FONT}>
          {task.checked === 'right' ? '✓ Richtig!' : counts.some((c) => c > 9) && value === target ? 'Die Zahl stimmt – jetzt noch bündeln!' : 'Noch nicht. Zähle noch einmal nach.'}
        </text>
      )}
      {interactive && (
        <SvgKey label="Alles weg" active onPress={() => save({ counts: emptyCounts(places), task: { ...task, checked: null } })}>
          <circle cx={W - 34} cy={H - 34} r="24" fill="#fff" stroke="#94a3b8" strokeWidth="3" />
          <path d={`M${W - 43} ${H - 36}a10 10 0 1 0 3-7M${W - 43} ${H - 46}v8h8`} fill="none" stroke="#495057" strokeWidth="3" strokeLinecap="round" />
        </SvgKey>
      )}
    </svg>
  );
}
