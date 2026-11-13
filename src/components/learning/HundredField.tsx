'use client';
// Hunderterfeld (or Zwanzigerfeld): colour dots by tapping or swiping, the
// covering angle (Abdeckwinkel), or “Zeige 37” with checking.
import { useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import type { JsonValue } from '@/lib/learning/catalog';
import { DOT_COLORS, dotXY, fieldSettings, fieldTasks, paint, painted, type Dot } from '@/lib/learning/hundredfield';
import { freshTasks, type TaskState } from '@/lib/learning/placevalue';
import { feedback } from '@/lib/learning/feedback';
import { useLearning } from './Runtime';
import SvgKey, { SvgButton } from './SvgKey';

const FONT = 'Verdana, Arial, sans-serif';
const W = 1000, R = 25;
type Saved = { dots?: Dot[]; cover?: number; task?: TaskState };

export default function HundredField({ element }: { element: PageElement }) {
  const { interactive, state, update } = useLearning(element);
  const s = fieldSettings(element.settings?.field);
  const svg = useRef<SVGSVGElement>(null);
  const [color, setColor] = useState<Dot>(1);
  const [drag, setDrag] = useState<Dot[] | null>(null);
  const saved = (state.field && typeof state.field === 'object' ? state.field : {}) as Saved;
  const stored = Array.isArray(saved.dots) && saved.dots.length === s.size ? saved.dots : (Array(s.size).fill(0) as Dot[]);
  const dots = drag ?? stored;
  const cover = Math.max(0, Math.min(s.size, saved.cover ?? s.size));
  const task = saved.task ?? freshTasks(Number(element.id.replace(/\D/g, '').slice(0, 8)) || 3);
  const tasks = s.mode === 'show' ? fieldTasks(s, task.seed) : [];
  const target = tasks[task.at];
  const done = s.mode === 'show' && task.at >= tasks.length;
  const save = (next: Saved) => update({ field: { dots: stored, cover, task, ...next } as unknown as JsonValue });
  const rows = s.size / 10;
  const gridH = 70 + (rows - 1) * 62 + (rows > 5 ? 22 : 0) + 70;
  const H = Math.max(gridH, 430) + (s.mode === 'show' ? 90 : 0);
  const top = s.mode === 'show' ? 90 : 0;
  const red = dots.filter((d) => d === 1).length, blue = dots.filter((d) => d === 2).length;
  const paintColor = s.mode === 'show' ? 1 : color;

  /** The dot under the pointer (in drawing units), if any. */
  const dotAt = (e: React.PointerEvent) => {
    const box = svg.current!.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * W, y = ((e.clientY - box.top) / box.height) * H - top;
    for (let i = 0; i < s.size; i++) {
      const p = dotXY(i);
      if (Math.hypot(p.x - x, p.y - y) <= R + 6) return i;
    }
    return -1;
  };
  const canPaint = interactive && (s.mode === 'paint' || (s.mode === 'show' && !done && task.checked !== 'right'));
  const down = (e: React.PointerEvent) => {
    if (!interactive) return;
    const i = dotAt(e);
    if (i < 0) return;
    e.stopPropagation();
    if (s.mode === 'cover') {
      save({ cover: cover === i + 1 ? s.size : i + 1 });
      return;
    }
    if (!canPaint) return;
    svg.current?.setPointerCapture(e.pointerId);
    // Tapping a dot of the same colour clears it; swiping paints.
    setDrag(paint(stored, i, stored[i] === paintColor ? 0 : paintColor));
  };
  const move = (e: React.PointerEvent) => {
    if (!drag) return;
    const i = dotAt(e);
    if (i >= 0) setDrag(paint(drag, i, paintColor));
  };
  const up = () => {
    if (!drag) return;
    save({ dots: drag, task: { ...task, checked: null } });
    setDrag(null);
  };
  const check = () => {
    if (target === undefined) return;
    const right = painted(stored) === target;
    feedback(right);
    save({ task: { ...task, checked: right ? 'right' : 'wrong', right: task.right + (right && task.checked === null ? 1 : 0) } });
  };

  // The covering angle: everything from dot `cover` on is hidden.
  const coverShape = () => {
    if (s.mode !== 'cover' || cover >= s.size) return null;
    const row = Math.floor(cover / 10), col = cover % 10;
    const left = 30, right = 70 + 9 * 62 + 22 + 40, bottom = gridH - 30;
    const yRow = dotXY(row * 10).y - R - 8, yNext = row + 1 < rows ? dotXY((row + 1) * 10).y - R - 8 : bottom;
    const xCol = col === 0 ? left : dotXY(cover).x - R - 8;
    const d = col === 0 ? `M${left} ${yRow}H${right}V${bottom}H${left}Z` : `M${xCol} ${yRow}H${right}V${bottom}H${left}V${yNext}H${xCol}Z`;
    return <path d={d} fill="#adb5bd" fillOpacity=".92" stroke="#495057" strokeWidth="3" strokeLinejoin="round" pointerEvents="none" />;
  };

  return (
    <svg
      ref={svg}
      className="math-tool hundred-field"
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      role="group"
      aria-label={s.mode === 'cover' ? `Hunderterfeld mit Abdeckwinkel: ${cover} Punkte zu sehen` : `Hunderterfeld: ${red} rote und ${blue} blaue Punkte`}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      {s.mode === 'show' && (
        <g>
          <rect x="20" y="10" width={W - 40} height="70" rx="16" fill="#fff9db" stroke="#fab005" strokeWidth="3" />
          <text x="44" y="56" fontSize="30" fontWeight="700" fill="#1f2937" fontFamily={FONT}>
            {done ? `Geschafft! ${task.right} von ${tasks.length} gleich richtig.` : `Zeige ${target}.`}
          </text>
          {!done && <text x={W - 250} y="56" fontSize="20" fill="#868e96" fontFamily={FONT} textAnchor="end">{task.at + 1} von {tasks.length}</text>}
          {done ? (
            <SvgButton x={W - 220} y={20} w={180} h={50} label="Nochmal" text="Nochmal" active={interactive} onPress={() => save({ dots: Array(s.size).fill(0), task: freshTasks(task.seed + 1) })} />
          ) : task.checked === 'right' ? (
            <SvgButton x={W - 220} y={20} w={180} h={50} label="Weiter" text="Weiter ▸" fill="#2f9e44" active={interactive} onPress={() => save({ dots: Array(s.size).fill(0), task: { ...task, at: task.at + 1, checked: null } })} />
          ) : (
            <SvgButton x={W - 220} y={20} w={180} h={50} label="Prüfen" text="Prüfen" active={interactive} onPress={check} />
          )}
        </g>
      )}
      <g transform={`translate(0 ${top})`} onPointerDown={down} className={interactive ? 'svg-key' : undefined}>
        <rect x="20" y="20" width={70 + 9 * 62 + 22 + 30} height={gridH - 40} rx="22" fill="#f8f9fa" stroke="#ced4da" strokeWidth="2" />
        {dots.map((d, i) => {
          const p = dotXY(i);
          const shown = s.mode === 'cover' ? (i < cover ? 1 : 0) : d;
          return <circle key={i} cx={p.x} cy={p.y} r={R} fill={DOT_COLORS[shown]} stroke={shown ? '#00000033' : '#adb5bd'} strokeWidth="2.5" />;
        })}
        {coverShape()}
      </g>
      {/* Side panel: colours, counts */}
      <g transform={`translate(${W - 270} ${top + 30})`}>
        {s.mode === 'paint' &&
          ([
            [1, 'Rot'],
            [2, 'Blau'],
            [0, 'Radierer'],
          ] as [Dot, string][]).map(([c, name], k) => (
            <SvgKey key={c} label={`Farbe ${name}`} active={interactive} onPress={() => setColor(c)}>
              <rect x="0" y={k * 76} width="240" height="62" rx="31" fill={color === c ? '#e7f5ff' : '#fff'} stroke={color === c ? '#1c7ed6' : '#ced4da'} strokeWidth={color === c ? 4 : 2} />
              <circle cx="36" cy={k * 76 + 31} r="18" fill={DOT_COLORS[c]} stroke="#868e96" strokeWidth="2" strokeDasharray={c === 0 ? '5 4' : undefined} />
              <text x="70" y={k * 76 + 40} fontSize="24" fill="#1f2937" fontFamily={FONT}>{name}</text>
            </SvgKey>
          ))}
        {s.count && s.mode === 'paint' && (
          <text x="0" y="270" fontSize="26" fontWeight="700" fontFamily={FONT}>
            <tspan fill="#e03131">{red}</tspan>
            <tspan fill="#1f2937"> + </tspan>
            <tspan fill="#1c7ed6">{blue}</tspan>
            <tspan fill="#1f2937"> = {red + blue}</tspan>
          </text>
        )}
        {s.mode === 'cover' && (
          <g>
            <text x="0" y="40" fontSize="22" fill="#495057" fontFamily={FONT}>Tippe auf einen Punkt:</text>
            <text x="0" y="70" fontSize="22" fill="#495057" fontFamily={FONT}>der Winkel rutscht dorthin.</text>
            {s.count && <text x="0" y="170" fontSize="72" fontWeight="700" fill="#e03131" fontFamily={FONT}>{cover}</text>}
          </g>
        )}
        {s.mode === 'show' && (
          <g>
            {s.count && <text x="0" y="60" fontSize="48" fontWeight="700" fill="#e03131" fontFamily={FONT}>{painted(dots)}</text>}
            {task.checked && !done && (
              <text x="0" y="120" fontSize="24" fontWeight="700" fill={task.checked === 'right' ? '#2f9e44' : '#e03131'} fontFamily={FONT}>{task.checked === 'right' ? '✓ Richtig!' : 'Noch nicht.'}</text>
            )}
          </g>
        )}
        {interactive && s.mode !== 'cover' && (
          <SvgButton x={0} y={300} w={240} h={56} label="Alles weg" text="Alles weg" size={22} fill="#f1f3f5" color="#495057" active onPress={() => save({ dots: Array(s.size).fill(0), task: { ...task, checked: null } })} />
        )}
      </g>
    </svg>
  );
}
