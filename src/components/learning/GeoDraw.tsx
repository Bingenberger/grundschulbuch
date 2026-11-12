'use client';
import { useEffect, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import type { JsonValue } from '@/lib/learning/catalog';
import {
  AREA,
  PAGE_H,
  PAGE_W,
  afterCheck,
  checkDrawing,
  freshGeo,
  geoConfig,
  geoLabel,
  makeTasks,
  needsSetSquare,
  nextTask,
  previewed,
  showSolution,
  spoken,
  startPoint,
  targetSegments,
  taskName,
  taskText,
  withStats,
  wrap,
  type GeoState,
  type Point,
} from '@/lib/learning/geodraw';
import { randomFor } from '@/lib/learning/receipt';
import { feedback } from '@/lib/learning/feedback';
import { speakGerman } from '@/lib/speech';
import { useLearning } from './Runtime';

const FONT = 'Verdana, Arial, sans-serif', INK = '#1f2937';
const r1 = (n: number) => Math.round(n * 10) / 10;
const ICONS = {
  say: <><path d="M3 9h5l6-5v18l-6-5H3z" fill="currentColor" stroke="none" /><path d="M18 8.5a6 6 0 0 1 0 9M21.5 5a10.5 10.5 0 0 1 0 16" /></>,
  flash: <><path d="M1 13s4.5-8 12-8 12 8 12 8-4.5 8-12 8-12-8-12-8z" /><circle cx="13" cy="13" r="3.6" /></>,
  check: <path d="M4 13.5l6 6 12-13" />,
};

function hash(text: string) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}
const line = (p: Point, q: Point, colour: string, width: number, extra: React.SVGProps<SVGPathElement> = {}) => (
  <path d={`M${r1(p[0])} ${r1(p[1])}L${r1(q[0])} ${r1(q[1])}`} stroke={colour} strokeWidth={width} strokeLinecap="round" fill="none" {...extra} />
);

/** A round button like in the reference; it also works while the pen is in use. */
function Pill(props: { live: boolean; action: string; x: number; y: number; w: number; h: number; label: string; fill: string; ink: string; icon?: React.ReactNode; press: (a: string) => void }) {
  const { live, action, x, y, w, h, label, fill, ink, icon, press } = props;
  const body = (
    <>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} stroke={fill === '#ffffff' ? '#ced4da' : fill} strokeWidth="2" />
      {icon && (
        <g transform={`translate(${x + 22} ${y + h / 2 - 13})`} fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" color={ink}>
          {icon}
        </g>
      )}
      <text x={icon ? x + w / 2 + 18 : x + w / 2} y={y + h / 2 + 8} textAnchor="middle" fontFamily={FONT} fontSize="22" fontWeight="700" fill={ink}>
        {label}
      </text>
    </>
  );
  if (!live) return <g>{body}</g>;
  return (
    <g
      className="gd-key"
      role="button"
      tabIndex={0}
      aria-label={label}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        press(action);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          press(action);
        }
      }}
    >
      <title>{label}</title>
      {body}
    </g>
  );
}

function Summary({ s, live, press }: { s: GeoState; live: boolean; press: (a: string) => void }) {
  const stats = s.stats.filter(Boolean);
  const total = s.tasks.length;
  const right = stats.filter((x) => x.result === 'right').length;
  const first = stats.filter((x) => x.result === 'right' && x.checks === 1).length;
  const previews = stats.reduce((a, x) => a + x.previews, 0);
  const time = stats.reduce((a, x) => a + Math.max(0, (x.end || x.start) - x.start), 0);
  const rowHeight = stats.length > 8 ? 76 : 88;
  return (
    <>
      <rect x="70" y={AREA.y0} width="1260" height={PAGE_H - AREA.y0 - 20} rx="26" fill="#ffffff" stroke="#dee2e6" strokeWidth="2" />
      <text x={PAGE_W / 2} y={AREA.y0 + 58} textAnchor="middle" fontFamily={FONT} fontSize="36" fontWeight="700" fill={INK}>Auswertung</text>
      {([
        ['#2f9e44', 'Richtig gezeichnet', `${right} von ${total}`],
        ['#1c7ed6', 'Gleich beim ersten Prüfen', `${first} von ${total}`],
        ['#f08c00', 'Vorschau angesehen', previews === 1 ? '1 Mal' : `${previews} Mal`],
        ['#7048e8', 'Zeit', time < 60000 ? `${Math.round(time / 1000)} Sek.` : `${Math.floor(time / 60000)}:${String(Math.round((time % 60000) / 1000)).padStart(2, '0')} Min.`],
      ] as const).map(([colour, label, value], i) => {
        const x = 120 + i * 290, y = AREA.y0 + 90;
        return (
          <g key={label}>
            <rect x={x} y={y} width="276" height="78" rx="14" fill={colour} opacity=".1" />
            <circle cx={x + 24} cy={y + 26} r="8" fill={colour} />
            <text x={x + 40} y={y + 32} fontFamily={FONT} fontSize="17" fill="#495057">{label}</text>
            <text x={x + 24} y={y + 64} fontFamily={FONT} fontSize="24" fontWeight="700" fill={INK}>{value}</text>
          </g>
        );
      })}
      {stats.map((x, i) => {
        const left = 120 + (i % 2) * 580, top = AREA.y0 + 190 + Math.floor(i / 2) * (rowHeight + 8), ok = x.result === 'right';
        const targets = targetSegments(x.task);
        const all = [...targets.flat(), ...x.drawn.flatMap((d) => [d.a, d.b])];
        const minX = Math.min(...all.map((p) => p[0])), minY = Math.min(...all.map((p) => p[1]));
        const scale = Math.min(96 / Math.max(1, Math.max(...all.map((p) => p[0])) - minX), (rowHeight - 20) / Math.max(1, Math.max(...all.map((p) => p[1])) - minY));
        const at = (p: Point): Point => [left + 12 + (p[0] - minX) * scale, top + 10 + (p[1] - minY) * scale];
        const result = ok ? (x.checks === 1 ? 'gleich richtig' : `richtig nach ${x.checks}× Prüfen`) : x.result === 'solution' ? 'Lösung angesehen' : 'nicht fertig';
        return (
          <g key={i}>
            <rect x={left} y={top} width="566" height={rowHeight} rx="12" fill={ok ? '#ebfbee' : '#fff4e6'} />
            {targets.map(([p, q], j) => <g key={`t${j}`}>{line(at(p), at(q), '#adb5bd', 2, { strokeDasharray: '4 4' })}</g>)}
            {x.drawn.map((d, j) => <g key={`d${j}`}>{line(at(d.a), at(d.b), INK, 2.4)}</g>)}
            <text x={left + 130} y={top + rowHeight / 2 - 6} fontFamily={FONT} fontSize="18" fontWeight="700" fill={INK}>{i + 1}. {taskName(x.task)}</text>
            <text x={left + 130} y={top + rowHeight / 2 + 22} fontFamily={FONT} fontSize="16" fill={ok ? '#2b8a3e' : '#d9480f'}>
              {result}{x.previews ? ` · ${x.previews}× Vorschau` : ''}
            </text>
          </g>
        );
      })}
      <Pill live={live} action="again" x={PAGE_W / 2 - 150} y={874} w={300} h={66} label="Nochmal" fill="#1c7ed6" ink="#ffffff" press={press} />
    </>
  );
}

/** Geometrie: Formen zeichnen – drawn with the pen on the squared page. */
export default function GeoDraw({ element: el }: { element: PageElement }) {
  const { state, interactive, onResponse, drawing } = useLearning(el);
  const settings = (el.settings || {}) as Record<string, unknown>;
  const config = geoConfig(settings.geo, randomFor(hash(el.id)));
  const key = JSON.stringify(config.tasks);
  const stored = state.geo as unknown as (GeoState & { key?: string }) | undefined;
  const s: GeoState = stored && stored.key === key ? stored : freshGeo(config.tasks);
  const [flashing, setFlashing] = useState(false);
  const [note, setNote] = useState('');
  useEffect(() => {
    if (!flashing) return;
    const timer = setTimeout(() => setFlashing(false), config.flash * 1000 + 80);
    return () => clearTimeout(timer);
  }, [flashing, config.flash]);

  // Buttons work in the editors (also with the pen) and in the reading mode.
  const live = interactive || !!drawing;
  const save = (next: GeoState) => onResponse?.(el.id, { ...state, geo: { ...next, key } as unknown as JsonValue });
  const current = s.tasks[Math.min(s.i, s.tasks.length - 1)];
  const say = (text: string) => speakGerman(spoken(text));
  /** Page millimetres → units of the drawing. */
  const toUnits = (p: { x: number; y: number }): Point => [((p.x - el.x) * PAGE_W) / el.width, ((p.y - el.y) * PAGE_H) / el.height];
  const area = {
    x: el.x + (AREA.x0 * el.width) / PAGE_W,
    y: el.y + (AREA.y0 * el.height) / PAGE_H,
    width: ((AREA.x1 - AREA.x0) * el.width) / PAGE_W,
    height: ((AREA.y1 - AREA.y0) * el.height) / PAGE_H,
  };
  const inArea = (stroke: Point[]) => stroke.some(([x, y]) => x >= AREA.x0 && x <= AREA.x1 && y >= AREA.y0 && y <= AREA.y1);

  const press = (action: string) => {
    const now = Date.now();
    if (!drawing && (action === 'start' || action === 'check')) {
      setNote('Hier kann nicht gezeichnet werden. Öffne das Heft im Editor und zeichne mit dem Stift und dem Lineal.');
      return;
    }
    setNote('');
    if (action === 'start') {
      save(withStats({ ...s, started: true }, now));
      drawing?.begin(!!current && needsSetSquare(current));
      if (current) say(taskText(current));
    } else if (action === 'say') {
      if (current) say(taskText(current));
    } else if (action === 'flash' && config.flash > 0) {
      save(previewed(s, now));
      setFlashing(true);
    } else if (action === 'check' && current) {
      const strokes = drawing!.strokes().map((stroke) => stroke.map(toUnits)).filter(inArea);
      const result = checkDrawing(current, strokes, config.tol);
      save(afterCheck(s, result, now));
      feedback(result.ok);
      say(result.ok ? 'Richtig!' : spoken(result.msgs[0] ?? 'Das stimmt noch nicht.'));
    } else if (action === 'solution') save(showSolution(s, now));
    else if (action === 'next') {
      drawing?.clear(area);
      const next = nextTask(s, now);
      save(next);
      if (next.phase === 'summary') feedback(true);
      else {
        drawing?.begin(needsSetSquare(next.tasks[next.i]));
        say(taskText(next.tasks[next.i]));
      }
    } else if (action === 'again') {
      drawing?.clear(area);
      const tasks = makeTasks(config);
      save(withStats({ ...freshGeo(tasks), started: true }, now));
      drawing?.begin(needsSetSquare(tasks[0]));
      say(taskText(tasks[0]));
    }
  };

  const content: React.ReactNode[] = [];
  content.push(<rect key="box" x="24" y="16" width="1352" height="172" rx="22" fill="#ffffff" stroke="#dee2e6" strokeWidth="2" />);
  if (s.phase === 'summary') {
    content.push(
      <text key="t1" x="56" y="84" fontFamily={FONT} fontSize="34" fontWeight="700" fill={INK}>Geschafft!</text>,
      <text key="t2" x="56" y="128" fontFamily={FONT} fontSize="22" fill="#495057">
        {s.tasks.length === 1 ? 'Eine Aufgabe' : `${s.tasks.length} Aufgaben`} gezeichnet – hier ist deine Auswertung.
      </text>,
      <Summary key="summary" s={s} live={live} press={press} />,
    );
  } else {
    content.push(
      <text key="head" x="56" y="54" fontFamily={FONT} fontSize="18" fontWeight="700" fill="#1c7ed6">
        GEOMETRIE · AUFGABE {Math.min(s.i, s.tasks.length - 1) + 1} VON {s.tasks.length}
      </text>,
    );
    if (current) {
      const lines = wrap(taskText(current), 66), size = lines.length > 3 ? 22 : 25;
      lines.slice(0, 4).forEach((text, i) =>
        content.push(<text key={`l${i}`} x="56" y={92 + i * (size + 9)} fontFamily={FONT} fontSize={size} fill={INK}>{text}</text>),
      );
    }
    content.push(<Pill key="say" live={live} action="say" x={960} y={34} w={194} h={58} label="Vorlesen" fill="#ffffff" ink="#1c7ed6" icon={ICONS.say} press={press} />);
    if (config.flash > 0) content.push(<Pill key="flash" live={live} action="flash" x={1166} y={34} w={194} h={58} label="Vorschau" fill="#ffffff" ink="#1c7ed6" icon={ICONS.flash} press={press} />);
    content.push(<Pill key="check" live={live} action="check" x={960} y={108} w={400} h={64} label="Überprüfen" fill="#2f9e44" ink="#ffffff" icon={ICONS.check} press={press} />);
    if (current) {
      const targets = targetSegments(current);
      if (live && flashing)
        content.push(
          <g key="flash-shape" className="gd-fade" style={{ animationDuration: `${config.flash}s` }}>
            {targets.map(([p, q], i) => <g key={i}>{line(p, q, '#1c7ed6', 6, { opacity: 0.55, strokeDasharray: '14 9' })}</g>)}
          </g>,
        );
      if (s.phase === 'solution') content.push(<g key="solution">{targets.map(([p, q], i) => <g key={i}>{line(p, q, '#2f9e44', 6, { opacity: 0.6, strokeDasharray: '14 9' })}</g>)}</g>);
      if (live && s.marks.length && s.phase !== 'draw')
        content.push(<g key="marks" className="gd-marks">{s.marks.map((m, i) => <g key={i}>{line(m.a, m.b, m.ok ? '#40c057' : '#fa5252', 14, { opacity: 0.42 })}</g>)}</g>);
      const [x, y] = startPoint(current);
      content.push(<circle key="dot1" cx={r1(x)} cy={r1(y)} r="11" fill="#ffffff" opacity=".9" />, <circle key="dot2" cx={r1(x)} cy={r1(y)} r="7" fill="#e03131" />);
      if (live && !s.started)
        content.push(
          <g key="start">
            <rect x="370" y="410" width="660" height="300" rx="28" fill="#ffffff" stroke="#dee2e6" strokeWidth="2" opacity=".97" />
            <text x={PAGE_W / 2} y="478" textAnchor="middle" fontFamily={FONT} fontSize="34" fontWeight="700" fill={INK}>Formen zeichnen</text>
            <text x={PAGE_W / 2} y="524" textAnchor="middle" fontFamily={FONT} fontSize="21" fill="#495057">
              {s.tasks.length === 1 ? 'Eine Aufgabe' : `${s.tasks.length} Aufgaben`} · Zeichne mit dem Lineal oder dem Geodreieck.
            </text>
            <text x={PAGE_W / 2} y="556" textAnchor="middle" fontFamily={FONT} fontSize="21" fill="#495057">Dann tippe auf „Überprüfen“.</text>
            <Pill live={live} action="start" x={570} y={600} w={260} h={72} label="Start" fill="#1c7ed6" ink="#ffffff" press={press} />
          </g>,
        );
    }
    const footer = (fill: string, stroke: string, icon: React.ReactNode, texts: string[], button?: React.ReactNode) => (
      <g key="footer" role="status">
        <rect x="24" y="882" width="1352" height="94" rx="20" fill={fill} stroke={stroke} strokeWidth="2" />
        {icon}
        {texts.slice(0, 3).map((text, i) => (
          <text key={i} x="112" y={PAGE_H - (texts.length > 1 ? 74 : 54) + i * 27} fontFamily={FONT} fontSize={texts.length > 2 ? 19 : 22} fontWeight={i ? 400 : 700} fill={INK}>{text}</text>
        ))}
        {button}
      </g>
    );
    const last = s.i + 1 >= s.tasks.length;
    const next = <Pill live={live} action="next" x={1120} y={896} w={230} h={66} label={last ? 'Auswertung' : 'Weiter'} fill="#1c7ed6" ink="#ffffff" press={press} />;
    if (note) content.push(footer('#fff9db', '#fcc419', <text x="68" y="940" textAnchor="middle" fontSize="30">ℹ️</text>, wrap(note, 80)));
    else if (s.phase === 'right')
      content.push(footer('#ebfbee', '#8ce99a', <><circle cx="68" cy="929" r="24" fill="#2f9e44" /><path d="M56 929l8 8 16-17" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></>, ['Richtig! Gut gezeichnet.'], next));
    else if (s.phase === 'wrong') {
      const checks = s.stats[s.i]?.checks ?? 0;
      const texts = ['Noch nicht ganz:', s.msgs[0] ?? '', s.msgs.length > 2 ? `${s.msgs[1]} Und noch ${s.msgs.length - 2 === 1 ? 'eine Stelle' : `${s.msgs.length - 2} Stellen`}.` : s.msgs[1] ?? ''].filter(Boolean);
      content.push(
        footer('#fff4e6', '#ffc078', <><circle cx="68" cy="929" r="24" fill="#f08c00" /><text x="68" y="940" textAnchor="middle" fontFamily={FONT} fontSize="30" fontWeight="700" fill="#fff">!</text></>, texts,
          checks >= 2 ? <Pill live={live} action="solution" x={1100} y={896} w={250} h={66} label="Lösung zeigen" fill="#ffffff" ink="#d9480f" press={press} /> : undefined),
      );
    } else if (s.phase === 'solution')
      content.push(footer('#e7f5ff', '#74c0fc', <><circle cx="68" cy="929" r="24" fill="#1c7ed6" /><text x="68" y="939" textAnchor="middle" fontFamily={FONT} fontSize="28" fontWeight="700" fill="#fff">i</text></>, ['So sieht die Lösung aus (grün gestrichelt).'], next));
  }
  return (
    <svg className="geodraw" viewBox={`0 0 ${PAGE_W} ${PAGE_H}`} width="100%" height="100%" preserveAspectRatio="none" role="group" aria-label={geoLabel(config)}>
      {content}
    </svg>
  );
}
