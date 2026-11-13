'use client';
// Zahlenstrahl: set points, draw jumps (+7, −3) – or find where a number lies.
import { useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import type { JsonValue } from '@/lib/learning/catalog';
import { LINE, findTasks, jumpText, numberLineSettings, ticks, togglePoint, valueAt, xOf, type Jump } from '@/lib/learning/numberline';
import { freshTasks, numberText, type TaskState } from '@/lib/learning/placevalue';
import { feedback } from '@/lib/learning/feedback';
import { useLearning } from './Runtime';
import SvgKey, { SvgButton } from './SvgKey';

const FONT = 'Verdana, Arial, sans-serif';
const W = 1000;
type Saved = { points?: number[]; jumps?: Jump[]; guess?: number | null; task?: TaskState };

export default function NumberLine({ element }: { element: PageElement }) {
  const { interactive, state, update } = useLearning(element);
  const s = numberLineSettings(element.settings?.numberline);
  const svg = useRef<SVGSVGElement>(null);
  const [tool, setTool] = useState<'point' | 'jump'>('point');
  const [from, setFrom] = useState<number | null>(null);
  const saved = (state.numberline && typeof state.numberline === 'object' ? state.numberline : {}) as Saved;
  const inRange = (n: number) => n >= s.start && n <= s.end;
  const points = (saved.points ?? []).filter(inRange);
  const jumps = (saved.jumps ?? []).filter((j) => inRange(j.from) && inRange(j.to));
  const task = saved.task ?? freshTasks(Number(element.id.replace(/\D/g, '').slice(0, 8)) || 5);
  const tasks = s.mode === 'find' ? findTasks(s, task.seed) : [];
  const target = tasks[task.at];
  const done = s.mode === 'find' && task.at >= tasks.length;
  const guess = saved.guess ?? null;
  const save = (next: Saved) => update({ numberline: { points, jumps, guess, task, ...next } as unknown as JsonValue });
  const { small, middle, big } = ticks(s.start, s.end);

  const top = s.mode === 'find' ? 90 : 70, lineY = top + 120, H = lineY + 110;

  /** Where on the line the tap was, in drawing units. */
  const tapValue = (e: React.MouseEvent) => {
    const box = svg.current!.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * W;
    return valueAt(s, x);
  };
  const tap = (n: number) => {
    if (s.mode === 'find') {
      if (done || task.checked === 'right' || target === undefined) return;
      const right = n === target;
      feedback(right);
      save({ guess: n, task: { ...task, checked: right ? 'right' : 'wrong', right: task.right + (right && task.checked === null ? 1 : 0) } });
      return;
    }
    if (tool === 'point') save({ points: togglePoint(points, n) });
    else if (from === null) setFrom(n);
    else {
      if (n !== from) save({ jumps: [...jumps, { from, to: n }] });
      setFrom(null);
    }
  };
  const tickMarks: React.ReactNode[] = [];
  for (let n = s.start; n <= s.end + 1e-9; n += small) {
    const kind = n % big === 0 ? 'big' : middle && n % middle === 0 ? 'middle' : 'small';
    const len = kind === 'big' ? 26 : kind === 'middle' ? 18 : 11;
    const x = xOf(s, n);
    tickMarks.push(<line key={`t${n}`} x1={x} y1={lineY - len} x2={x} y2={lineY + len} stroke="#1f2937" strokeWidth={kind === 'small' ? 2 : 3} />);
    const labelled = s.labels === 'all' ? kind !== 'small' || (s.end - s.start) / small <= 20 : s.labels === 'big' ? kind === 'big' : n === s.start || n === s.end;
    if (labelled || n === s.start || n === s.end)
      tickMarks.push(<text key={`l${n}`} x={x} y={lineY + 58} textAnchor="middle" fontSize={(s.end - s.start) / small > 40 && kind !== 'big' ? 18 : 24} fontWeight={kind === 'big' ? 700 : 400} fill="#1f2937" fontFamily={FONT}>{numberText(n)}</text>);
  }

  return (
    <svg ref={svg} className="math-tool number-line" viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="group" aria-label={`Zahlenstrahl von ${s.start} bis ${s.end}`}>
      {s.mode === 'free' ? (
        <g>
          <SvgButton x={20} y={14} w={150} h={46} label="Punkte setzen" text="● Punkt" size={20} fill={tool === 'point' ? '#1c7ed6' : '#f1f3f5'} color={tool === 'point' ? '#fff' : '#495057'} active={interactive} onPress={() => { setTool('point'); setFrom(null); }} />
          <SvgButton x={180} y={14} w={150} h={46} label="Sprünge zeichnen" text="⌒ Sprung" size={20} fill={tool === 'jump' ? '#e8590c' : '#f1f3f5'} color={tool === 'jump' ? '#fff' : '#495057'} active={interactive} onPress={() => { setTool('jump'); setFrom(null); }} />
          <text x={350} y={44} fontSize="19" fill="#868e96" fontFamily={FONT}>
            {tool === 'jump' ? (from === null ? 'Tippe auf den Start des Sprungs.' : `Start bei ${numberText(from)} – tippe auf das Ziel.`) : 'Tippe auf den Zahlenstrahl.'}
          </text>
          <SvgButton x={W - 170} y={14} w={150} h={46} label="Alles weg" text="Alles weg" size={20} fill="#f1f3f5" color="#495057" active={interactive} onPress={() => { save({ points: [], jumps: [] }); setFrom(null); }} />
        </g>
      ) : (
        <g>
          <rect x="20" y="10" width={W - 40} height="70" rx="16" fill="#fff9db" stroke="#fab005" strokeWidth="3" />
          <text x="44" y="56" fontSize="30" fontWeight="700" fill="#1f2937" fontFamily={FONT}>
            {done ? `Geschafft! ${task.right} von ${tasks.length} gleich richtig.` : `Wo liegt die ${numberText(target)}?`}
          </text>
          {!done && <text x={W - 250} y="56" fontSize="20" fill="#868e96" fontFamily={FONT} textAnchor="end">{task.at + 1} von {tasks.length}</text>}
          {done ? (
            <SvgButton x={W - 220} y={20} w={180} h={50} label="Nochmal" text="Nochmal" active={interactive} onPress={() => save({ guess: null, task: freshTasks(task.seed + 1) })} />
          ) : task.checked === 'right' ? (
            <SvgButton x={W - 220} y={20} w={180} h={50} label="Weiter" text="Weiter ▸" fill="#2f9e44" active={interactive} onPress={() => save({ guess: null, task: { ...task, at: task.at + 1, checked: null } })} />
          ) : null}
        </g>
      )}
      {/* The line itself; tapping anywhere near it counts */}
      <g
        className={interactive ? 'svg-key' : undefined}
        role={interactive ? 'button' : undefined}
        aria-label={interactive ? 'Auf den Zahlenstrahl tippen' : undefined}
        onPointerDown={(e) => interactive && e.stopPropagation()}
        onClick={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          tap(tapValue(e));
        }}
      >
        <rect x={LINE.x0 - 30} y={lineY - 70} width={LINE.x1 - LINE.x0 + 60} height={140} fill="transparent" />
        <line x1={LINE.x0 - 20} y1={lineY} x2={LINE.x1 + 30} y2={lineY} stroke="#1f2937" strokeWidth="4" />
        <path d={`M${LINE.x1 + 30} ${lineY - 10}l16 10l-16 10z`} fill="#1f2937" />
        {tickMarks}
      </g>
      {jumps.map((j, i) => {
        const a = xOf(s, j.from), b = xOf(s, j.to), mid = (a + b) / 2, hgt = Math.min(90, 30 + Math.abs(b - a) * 0.35);
        const color = j.to >= j.from ? '#e8590c' : '#7048e8';
        return (
          <SvgKey key={i} label={`Sprung ${jumpText(j)} löschen`} active={interactive} onPress={() => save({ jumps: jumps.filter((_, k) => k !== i) })}>
            <path d={`M${a} ${lineY - 6}Q${mid} ${lineY - 6 - hgt * 2} ${b} ${lineY - 6}`} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
            <path d={`M${b} ${lineY - 6}l${j.to >= j.from ? -14 : 14} -8M${b} ${lineY - 6}l${j.to >= j.from ? -4 : 4} -16`} stroke={color} strokeWidth="5" strokeLinecap="round" />
            <rect x={mid - 36} y={lineY - 26 - hgt - 18} width="72" height="34" rx="17" fill="#fff" stroke={color} strokeWidth="2" />
            <text x={mid} y={lineY - 26 - hgt + 6} textAnchor="middle" fontSize="22" fontWeight="700" fill={color} fontFamily={FONT}>{jumpText(j)}</text>
          </SvgKey>
        );
      })}
      {from !== null && <circle cx={xOf(s, from)} cy={lineY} r="13" fill="#e8590c" opacity=".7" />}
      {points.map((n) => (
        <SvgKey key={n} label={`Punkt ${n} löschen`} active={interactive} onPress={() => save({ points: togglePoint(points, n) })}>
          <circle cx={xOf(s, n)} cy={lineY} r="12" fill="#1c7ed6" stroke="#fff" strokeWidth="3" />
          {s.values && <text x={xOf(s, n)} y={lineY - 34} textAnchor="middle" fontSize="24" fontWeight="700" fill="#1c7ed6" fontFamily={FONT}>{numberText(n)}</text>}
        </SvgKey>
      ))}
      {s.mode === 'find' && guess !== null && !done && (
        <g>
          <circle cx={xOf(s, guess)} cy={lineY} r="14" fill={task.checked === 'right' ? '#2f9e44' : '#e03131'} stroke="#fff" strokeWidth="3" />
          <text x={xOf(s, guess)} y={lineY - 34} textAnchor="middle" fontSize="22" fontWeight="700" fill={task.checked === 'right' ? '#2f9e44' : '#e03131'} fontFamily={FONT}>
            {task.checked === 'right' ? `✓ ${numberText(guess)}` : s.values ? `${numberText(guess)} – noch nicht` : 'Noch nicht'}
          </text>
        </g>
      )}
    </svg>
  );
}
