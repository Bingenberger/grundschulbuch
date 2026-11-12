'use client';
import type { PageElement } from '@/lib/notebook-model';
import {
  CALC_KEYS,
  beadX,
  freshCalc,
  isOperator,
  mathTool,
  mathToolLabel,
  pressKey,
  showNumber,
  tapAbacus,
  tapBoat,
  viewSize,
  type Calc,
  type MathTool as Tool,
  type Token,
} from '@/lib/learning/mathtool';
import { speakGerman } from '@/lib/speech';
import { useLearning } from './Runtime';

const FONT = 'Verdana, Arial, sans-serif';
const BLUE = '#1c7ed6', RED = '#e03131';
const r1 = (n: number) => Math.round(n * 10) / 10;

/** A tappable part of the drawing; keys work with Enter and Space too. */
function Key({ label, active, onPress, children }: { label: string; active: boolean; onPress: () => void; children: React.ReactNode }) {
  if (!active) return <g>{children}</g>;
  return (
    <g
      className="mt-key"
      role="button"
      tabIndex={0}
      aria-label={label}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onPress();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onPress();
        }
      }}
    >
      <title>{label}</title>
      {children}
    </g>
  );
}

function Reset({ x, y, active, onPress }: { x: number; y: number; active: boolean; onPress: () => void }) {
  if (!active) return null;
  return (
    <Key label="Alles weg" active onPress={onPress}>
      <circle cx={x} cy={y} r="28" fill="#fff" stroke="#94a3b8" strokeWidth="3" />
      <path
        d={`M${x - 10} ${y - 2}a11 11 0 1 0 3.2-7.8M${x - 10} ${y - 13}v8.6h8.6`}
        fill="none"
        stroke="#475569"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Key>
  );
}

function Boats({ t, cells, active, tap, reset }: { t: Tool; cells: Token[]; active: boolean; tap: (i: number) => void; reset: () => void }) {
  const v = viewSize(t), boats = t.n === 20 ? 2 : 1, rows = t.n === 5 ? 1 : 2;
  const parts: React.ReactNode[] = [];
  for (let b = 0; b < boats; b++) {
    const y = 20 + b * 300, h = rows === 1 ? 150 : 260;
    parts.push(
      <g key={`hull-${b}`}>
        <path d={`M70 ${y}H520Q600 ${y} 600 ${y + h / 2}Q600 ${y + h} 520 ${y + h}H70Q20 ${y + h} 20 ${y + h / 2}Q20 ${y} 70 ${y}Z`} fill="#c2410c" stroke="#7c2d12" strokeWidth="6" />
        <path d={`M70 ${y + 14}H515Q584 ${y + 14} 584 ${y + h / 2}Q584 ${y + h - 14} 515 ${y + h - 14}H70Q36 ${y + h - 14} 36 ${y + h / 2}Q36 ${y + 14} 70 ${y + 14}Z`} fill="#fde68a" stroke="#d97706" strokeWidth="3" />
      </g>,
    );
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < 5; col++) {
        const i = b * 10 + row * 5 + col, cx = 110 + col * 100, cy = y + (rows === 1 ? h / 2 : 75 + row * 110), token = cells[i] ?? 0;
        parts.push(
          <Key key={`c${i}`} label={`Platz ${i + 1}${token ? (token === 1 ? ', blau' : ', rot') : ''}`} active={active} onPress={() => tap(i)}>
            <circle cx={cx} cy={cy} r="44" fill="#fff" stroke="#b45309" strokeWidth="3" />
            <circle cx={cx} cy={cy + 3} r="40" fill="#fef3c7" />
            {token !== 0 && (
              <g className="mt-token">
                <circle cx={cx} cy={cy} r="37" fill={token === 1 ? BLUE : RED} stroke={token === 1 ? '#1864ab' : '#a51111'} strokeWidth="3" />
                <circle cx={cx - 12} cy={cy - 13} r="10" fill="#fff" opacity=".35" />
              </g>
            )}
          </Key>,
        );
      }
  }
  return (
    <>
      {parts}
      <Reset x={640} y={v.h / 2} active={active} onPress={reset} />
    </>
  );
}

function Abacus({ t, rows, active, tap, reset }: { t: Tool; rows: number[]; active: boolean; tap: (row: number, bead: number) => void; reset: () => void }) {
  const height = t.n * 74 + 30;
  return (
    <>
      <rect x="40" y="15" width="940" height={height} rx="18" fill="#d6a46a" stroke="#8a5a2b" strokeWidth="6" />
      <rect x="70" y="40" width="880" height={height - 50} rx="8" fill="#fbf3e4" />
      {Array.from({ length: t.n }, (_, row) => {
        const cy = 50 + row * 74 + 27, colour = (t.n === 2 ? row === 0 : row < 5) ? RED : BLUE, left = rows[row] ?? 0;
        return (
          <g key={row}>
            <line x1="70" y1={cy} x2="950" y2={cy} stroke="#8a8f98" strokeWidth="5" />
            {Array.from({ length: 10 }, (_, bead) => (
              <Key key={bead} label={`Reihe ${row + 1}, Kugel ${bead + 1}${bead < left ? ' (links)' : ''}`} active={active} onPress={() => tap(row, bead)}>
                <g className="mt-bead" style={{ transform: `translateX(${beadX(bead, left)}px)` }}>
                  <ellipse cx="0" cy={cy} rx="29" ry="30" fill={bead < 5 ? colour : '#f8fafc'} stroke={bead < 5 ? '#0b1220' : '#64748b'} strokeOpacity=".45" strokeWidth="2.5" />
                  <ellipse cx="-9" cy={cy - 11} rx="9" ry="6" fill="#fff" opacity=".45" />
                </g>
              </Key>
            ))}
          </g>
        );
      })}
      <Reset x={1025} y={48} active={active} onPress={reset} />
    </>
  );
}

function Ruler({ t }: { t: Tool }) {
  const v = viewSize(t);
  return (
    <>
      <rect x="0.5" y="0.5" width={v.w - 1} height={v.h - 1} rx="2" fill="#fff7c2" fillOpacity=".9" stroke="#a16207" strokeWidth=".6" />
      {Array.from({ length: t.n * 10 + 1 }, (_, mm) => {
        const x = 8 + mm, length = mm % 10 === 0 ? 9 : mm % 5 === 0 ? 6 : 4;
        return (
          <g key={mm}>
            <line x1={x} y1="0.5" x2={x} y2={0.5 + length} stroke="#1f2937" strokeWidth={mm % 10 === 0 ? 0.35 : 0.22} />
            {mm % 10 === 0 && (
              <text x={x} y="15.5" textAnchor="middle" fontFamily={FONT} fontSize="4.2" fill="#1f2937">
                {mm / 10}
              </text>
            )}
          </g>
        );
      })}
      <text x={v.w - 4} y={v.h - 4} textAnchor="end" fontFamily={FONT} fontSize="3.2" fill="#a16207">
        cm
      </text>
    </>
  );
}

function Calculator({ calc, active, press }: { calc: Calc; active: boolean; press: (key: string) => void }) {
  return (
    <>
      <rect x="4" y="4" width="352" height="512" rx="34" fill="#334155" stroke="#0f172a" strokeWidth="5" />
      <rect x="26" y="26" width="308" height="104" rx="14" fill="#dcfce7" stroke="#14532d" strokeWidth="3" />
      <text x="318" y="56" textAnchor="end" fontFamily={FONT} fontSize="22" fill="#3f6212">
        {calc.op && calc.acc !== null ? `${showNumber(calc.acc)} ${calc.op}` : ''}
      </text>
      <text x="318" y="112" textAnchor="end" fontFamily={FONT} fontWeight="700" fontSize={calc.shown.length > 10 ? 30 : 44} fill="#14532d" aria-live="polite">
        {calc.shown}
      </text>
      {CALC_KEYS.map(([label, action, col, row, w, h]) => {
        const x = 26 + col * 79, y = 150 + row * 72, width = w * 79 - 9, height = h * 72 - 10, op = isOperator(action);
        const fill = action === 'C' ? '#f59f00' : action === '=' ? '#2f9e44' : op ? '#1c7ed6' : action === 'del' ? '#868e96' : '#f8fafc';
        const ink = action === 'C' || op || action === 'del' ? '#fff' : '#1f2937';
        const name = action === 'del' ? 'Löschen' : action === 'C' ? 'Alles löschen' : label;
        return (
          <Key key={action} label={name} active={active} onPress={() => press(action)}>
            <rect x={x} y={y} width={width} height={height} rx="14" fill={fill} stroke="#0f172a" strokeOpacity=".35" strokeWidth="2" />
            <text x={r1(x + width / 2)} y={r1(y + height / 2 + 12)} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="32" fill={ink}>
              {label}
            </text>
          </Key>
        );
      })}
    </>
  );
}

/** Rechenschiffchen, Rechenrahmen, Lineal or Taschenrechner on the page. */
export default function MathTool({ element: el }: { element: PageElement }) {
  const { state, update, interactive } = useLearning(el);
  const t = mathTool(el.settings);
  const v = viewSize(t);
  const cells = (Array.isArray(state.cells) && state.cells.length === t.n ? state.cells : Array(t.tool === 'boat' ? t.n : 0).fill(0)) as Token[];
  const rows = (Array.isArray(state.rows) && state.rows.length === t.n ? state.rows : Array(t.tool === 'abacus' ? t.n : 0).fill(0)) as number[];
  const calc = (state.calc && typeof state.calc === 'object' ? state.calc : freshCalc()) as Calc;
  const active = interactive && t.tool !== 'ruler';
  const reset = () => update({ cells: [], rows: [], calc: null });
  return (
    <svg
      className={`math-tool math-tool-${t.tool}`}
      viewBox={`0 0 ${v.w} ${v.h}`}
      width="100%"
      height="100%"
      role={t.tool === 'ruler' ? 'img' : 'group'}
      aria-label={mathToolLabel(t, { cells, rows, calc })}
    >
      {t.tool === 'boat' && <Boats t={t} cells={cells} active={active} tap={(i) => update({ cells: tapBoat(cells, i) })} reset={reset} />}
      {t.tool === 'abacus' && <Abacus t={t} rows={rows} active={active} tap={(row, bead) => update({ rows: tapAbacus(rows, row, bead) })} reset={reset} />}
      {t.tool === 'ruler' && <Ruler t={t} />}
      {t.tool === 'calc' && (
        <Calculator
          calc={calc}
          active={active}
          press={(key) => {
            const next = pressKey(calc, key);
            update({ calc: next });
            if (key === '=' && next.shown !== 'Fehler') speakGerman(next.shown.replace('-', 'minus '));
          }}
        />
      )}
    </svg>
  );
}
