'use client';
import type { PageElement } from '@/lib/notebook-model';
import {
  CALC_KEYS,
  TAPE_MAX,
  TAPE_W,
  beadRed,
  beadX,
  boatAt,
  boatButton,
  boatOf,
  boatSum,
  buttonRow,
  freshCalc,
  isOperator,
  mathTool,
  mathToolLabel,
  pressKey,
  rowsOf,
  showNumber,
  tapAbacus,
  tapBoat,
  viewSize,
  BOAT_H,
  BUTTON_ROOM,
  type Boat,
  type Calc,
  type MathTool as Tool,
} from '@/lib/learning/mathtool';
import { speakGerman } from '@/lib/speech';
import { useLearning } from './Runtime';

const FONT = 'Verdana, Arial, sans-serif';
const BLUE = '#1c7ed6', BLUE_EDGE = '#1864ab', RED = '#e03131', RED_EDGE = '#a51111', GREY = '#475569';
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

/** A round button below boats and frame. */
function RoundKey({ label, x, y, fill = '#fff', edge = '#94a3b8', onPress, children }: { label: string; x: number; y: number; fill?: string; edge?: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <Key label={label} active onPress={onPress}>
      <circle cx={x} cy={y} r="31" fill={fill} stroke={edge} strokeWidth="3.5" />
      {children}
    </Key>
  );
}

function Reset({ x, y, label, onPress }: { x: number; y: number; label: string; onPress: () => void }) {
  return (
    <RoundKey label={label} x={x} y={y} onPress={onPress}>
      <path d={`M${x - 11} ${y - 2}a12 12 0 1 0 3.5-8.5M${x - 11} ${y - 14}v9.4h9.4`} fill="none" stroke={GREY} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </RoundKey>
  );
}

/** Sum or number below: always shown, or a “?” to tap open (printed as a task). */
function Shown({ t, open, active, x, y, w, text, toggle, children }: { t: Tool; open: boolean; active: boolean; x: number; y: number; w: number; text: string; toggle: () => void; children: React.ReactNode }) {
  const hidden = t.show === 'tap' && !open;
  const box = hidden ? (
    <>
      <rect x={x} y={y} width={w} height="62" rx="16" fill="#e7f5ff" stroke="#74c0fc" strokeWidth="3" strokeDasharray="9 7" />
      <text x={x + w / 2} y={y + 47} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="44" fill="#1971c2">
        ?
      </text>
    </>
  ) : (
    <>
      <rect x={x} y={y} width={w} height="62" rx="16" fill="#fff" stroke="#cbd5e1" strokeWidth="3" />
      {children}
    </>
  );
  if (t.show !== 'tap' || !active) return <g>{box}</g>;
  return (
    <Key label={hidden ? 'Zahl zeigen' : `${text} – antippen zum Verdecken`} active onPress={toggle}>
      {box}
    </Key>
  );
}

const plus = (x: number, y: number) => <path d={`M${x - 12} ${y}h24M${x} ${y - 12}v24`} stroke="#fff" strokeWidth="5.5" strokeLinecap="round" />;

function Boats({ t, boat, open, active, set, toggle, reset }: { t: Tool; boat: Boat; open: boolean; active: boolean; set: (b: Boat) => void; toggle: () => void; reset: () => void }) {
  const v = viewSize(t), filled = boat.blue + boat.red, parts: React.ReactNode[] = [];
  for (let b = 0; b < t.n / 5; b++) {
    const { x, y } = boatAt(t, b);
    parts.push(
      <g key={`hull-${b}`}>
        <path d={`M${x + 26} ${y}H${x + 440}Q${x + 520} ${y} ${x + 540} ${y + 64}Q${x + 520} ${y + 128} ${x + 440} ${y + 128}H${x + 26}Q${x} ${y + 128} ${x} ${y + 102}V${y + 26}Q${x} ${y} ${x + 26} ${y}Z`} fill="#c98b4f" stroke="#7c4a1e" strokeWidth="5" strokeLinejoin="round" />
        <path d={`M${x + 30} ${y + 12}H${x + 436}Q${x + 504} ${y + 12} ${x + 521} ${y + 64}Q${x + 504} ${y + 116} ${x + 436} ${y + 116}H${x + 30}Q${x + 12} ${y + 116} ${x + 12} ${y + 98}V${y + 30}Q${x + 12} ${y + 12} ${x + 30} ${y + 12}Z`} fill="#f2d7a6" />
      </g>,
    );
    for (let e = 0; e < 5; e++) {
      const i = b * 5 + e, cx = x + 58 + e * 92, cy = y + BOAT_H / 2, isBlue = i < boat.blue;
      parts.push(
        <Key key={`c${i}`} label={`Platz ${i + 1}${i < filled ? (isBlue ? ', blau' : ', rot') : ''}`} active={active} onPress={() => set(tapBoat(boat, i))}>
          <circle cx={cx} cy={cy} r="38" fill="#d9b27c" stroke="#a9753f" strokeWidth="3" />
          <path d={`M${cx - 30} ${cy - 14}a33 33 0 0 1 60 0`} fill="none" stroke="#a9753f" strokeWidth="3" strokeLinecap="round" opacity=".55" />
          {i < filled && (
            <g className="mt-token">
              <circle cx={cx} cy={cy} r="34" fill={isBlue ? BLUE : RED} stroke={isBlue ? BLUE_EDGE : RED_EDGE} strokeWidth="3.5" />
              <circle cx={cx} cy={cy} r="25" fill="none" stroke="#fff" strokeWidth="2" opacity=".28" />
              <ellipse cx={cx - 11} cy={cy - 13} rx="10" ry="7" fill="#fff" opacity=".35" />
            </g>
          )}
        </Key>,
      );
    }
  }
  const y = buttonRow(t);
  if (active)
    parts.push(
      <g key="keys">
        <RoundKey label="Ein blaues Plättchen dazu" x={52} y={y} fill={BLUE} edge={BLUE_EDGE} onPress={() => set(boatButton(boat, 'blue', t.n))}>
          {plus(52, y)}
        </RoundKey>
        <RoundKey label="Ein rotes Plättchen dazu" x={124} y={y} fill={RED} edge={RED_EDGE} onPress={() => set(boatButton(boat, 'red', t.n))}>
          {plus(124, y)}
        </RoundKey>
        <RoundKey label="Ein Plättchen weg" x={196} y={y} onPress={() => set(boatButton(boat, 'less', t.n))}>
          <path d={`M184 ${y}h24`} stroke={GREY} strokeWidth="5.5" strokeLinecap="round" />
        </RoundKey>
        <Reset x={268} y={y} label="Alle Plättchen weg" onPress={reset} />
      </g>,
    );
  if (t.show) {
    const x = v.w - 20 - 244, text = boatSum(boat), size = text.length > 10 ? 30 : 36;
    parts.push(
      <Shown key="sum" t={t} open={open} active={active} x={x} y={y - 31} w={244} text={text} toggle={toggle}>
        <text x={x + 122} y={r1(y + size * 0.36)} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize={size}>
          {boat.blue && boat.red ? (
            <>
              <tspan fill={BLUE_EDGE}>{boat.blue}</tspan>
              <tspan fill={GREY}> + </tspan>
              <tspan fill={RED_EDGE}>{boat.red}</tspan>
              <tspan fill={GREY}> = </tspan>
              <tspan fill="#1f2937">{filled}</tspan>
            </>
          ) : (
            <tspan fill={boat.red ? RED_EDGE : boat.blue ? BLUE_EDGE : '#1f2937'}>{filled}</tspan>
          )}
        </text>
      </Shown>,
    );
  }
  // Without buttons and number the boats sit in the middle.
  return <g transform={!active && !t.show ? `translate(0 ${BUTTON_ROOM / 2 - 7})` : undefined}>{parts}</g>;
}

function Abacus({ t, rows, open, active, tap, toggle, reset }: { t: Tool; rows: number[]; open: boolean; active: boolean; tap: (row: number, bead: number) => void; toggle: () => void; reset: () => void }) {
  const height = t.n * 74 + 30, y = buttonRow(t), sum = rows.reduce((a, b) => a + b, 0);
  return (
    <g transform={!active && !t.show ? `translate(0 ${BUTTON_ROOM / 2 - 5})` : undefined}>
      <rect x="40" y="10" width="940" height={height} rx="18" fill="#d6a46a" stroke="#8a5a2b" strokeWidth="6" />
      <rect x="70" y="35" width="880" height={height - 50} rx="8" fill="#fbf3e4" />
      {Array.from({ length: t.n }, (_, row) => {
        const cy = 45 + row * 74 + 27, left = rows[row] ?? 0;
        return (
          <g key={row}>
            <line x1="70" y1={cy} x2="950" y2={cy} stroke="#8a8f98" strokeWidth="5" />
            {Array.from({ length: 10 }, (_, bead) => {
              const red = beadRed(t, row, bead);
              return (
                <Key key={bead} label={`Reihe ${row + 1}, Kugel ${bead + 1}${bead < left ? ' (links)' : ''}`} active={active} onPress={() => tap(row, bead)}>
                  <g className="mt-bead" style={{ transform: `translateX(${beadX(bead, left)}px)` }}>
                    <ellipse cx="0" cy={cy} rx="29" ry="30" fill={red ? RED : BLUE} stroke={red ? RED_EDGE : BLUE_EDGE} strokeWidth="2.5" />
                    <ellipse cx="-9" cy={cy - 11} rx="9" ry="6" fill="#fff" opacity=".45" />
                  </g>
                </Key>
              );
            })}
          </g>
        );
      })}
      {active && <Reset x={72} y={y} label="Alle Kugeln nach rechts" onPress={reset} />}
      {t.show && (
        <Shown t={t} open={open} active={active} x={800} y={y - 31} w={180} text={String(sum)} toggle={toggle}>
          <text x="890" y={y + 16} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="44" fill="#1f2937">
            {sum}
          </text>
        </Shown>
      )}
    </g>
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

const MONO = 'Menlo, Consolas, Courier New, monospace';

/** The paper strip of the reference: the last ten sums, newest at the bottom; × tears it off. */
function Tape({ lines, active, tear }: { lines: string[]; active: boolean; tear: () => void }) {
  let top = 'M16 32';
  for (let x = 16; x < 300; x += 12) top += 'l6 -9l6 9';
  let bottom = '';
  for (let x = 304; x > 16; x -= 12) bottom += 'l-6 9l-6 -9';
  const shown = lines.slice(-10);
  return (
    <g className="mt-tape">
      <path d="M22 38h290v462h-290z" fill="#0f172a" opacity=".12" />
      <path d={`${top}V494${bottom}Z`} fill="#fffdf5" stroke="#94a3b8" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="30" y="66" fontFamily={MONO} fontSize="18" fontWeight="700" letterSpacing="2" fill={GREY}>
        RECHNUNGEN
      </text>
      <path d="M30 78H272" stroke="#64748b" strokeWidth="2" strokeDasharray="6 5" />
      {!lines.length ? (
        <>
          <text x="150" y="250" textAnchor="middle" fontFamily={FONT} fontSize="18" fill="#64748b">
            Hier stehen gleich
          </text>
          <text x="150" y="277" textAnchor="middle" fontFamily={FONT} fontSize="18" fill="#64748b">
            deine Rechnungen.
          </text>
        </>
      ) : (
        <>
          {lines.length > shown.length && (
            <text x="150" y="104" textAnchor="middle" fontFamily={MONO} fontSize="22" fontWeight="700" fill="#94a3b8">
              · · ·
            </text>
          )}
          {shown.map((line, i) => {
            const y = 478 - (shown.length - 1 - i) * 39, cut = line.lastIndexOf('= ') + 2;
            const size = line.length > 20 ? 15 : line.length > 17 ? 18 : line.length > 14 ? 21 : 25;
            return (
              <g key={`${lines.length - shown.length + i}`}>
                <text x="272" y={y} textAnchor="end" fontFamily={MONO} fontSize={size} fill="#0f172a" xmlSpace="preserve">
                  {line.slice(0, cut)}
                  <tspan fontWeight="700">{line.slice(cut)}</tspan>
                </text>
                {i < shown.length - 1 && <path d={`M30 ${y + 12}H272`} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 5" />}
              </g>
            );
          })}
        </>
      )}
      {active && (
        <Key label="Zettel abreißen (leeren)" active onPress={tear}>
          <circle cx="250" cy="57" r="20" fill="#fff" stroke="#94a3b8" strokeWidth="2.5" />
          <path d="M242 49l16 16M258 49l-16 16" stroke={GREY} strokeWidth="3.2" strokeLinecap="round" />
        </Key>
      )}
    </g>
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
  const boat = boatOf(t, state), rows = rowsOf(t, state), open = state.open === true;
  const calc = (state.calc && typeof state.calc === 'object' ? state.calc : freshCalc()) as Calc;
  const tape = Array.isArray(state.tape) ? state.tape.filter((l): l is string => typeof l === 'string') : [];
  const active = interactive && t.tool !== 'ruler';
  // Back to what the settings put there at the start.
  const reset = () => update({ cells: null, blue: null, red: null, rows: null, open: null, calc: null, tape: null });
  const toggle = () => update({ open: !open });
  return (
    <svg
      className={`math-tool math-tool-${t.tool}`}
      viewBox={`0 0 ${v.w} ${v.h}`}
      width="100%"
      height="100%"
      role={t.tool === 'ruler' ? 'img' : 'group'}
      aria-label={mathToolLabel(t, { boat, rows, calc })}
    >
      {t.tool === 'boat' && <Boats t={t} boat={boat} open={open} active={active} set={(b) => update({ cells: null, ...b })} toggle={toggle} reset={reset} />}
      {t.tool === 'abacus' && <Abacus t={t} rows={rows} open={open} active={active} tap={(row, bead) => update({ rows: tapAbacus(rows, row, bead) })} toggle={toggle} reset={reset} />}
      {t.tool === 'ruler' && <Ruler t={t} />}
      {t.tool === 'calc' && t.tape && <Tape lines={tape} active={active} tear={() => update({ tape: [] })} />}
      {t.tool === 'calc' && (
        <g transform={t.tape ? `translate(${TAPE_W} 0)` : undefined}>
          <Calculator
            calc={calc}
            active={active}
            press={(key) => {
              const lines = [...tape];
              const next = pressKey(calc, key, t.tape ? (line) => lines.push(line) : undefined);
              update(lines.length !== tape.length ? { calc: next, tape: lines.slice(-TAPE_MAX) } : { calc: next });
              if (key === '=' && next.shown !== 'Fehler') speakGerman(next.shown.replace('-', 'minus '));
            }}
          />
        </g>
      )}
    </svg>
  );
}
