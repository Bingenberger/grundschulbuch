// Mathe-Werkzeuge like the reference (Regal › Mathe): Rechenschiffchen 5/10/20,
// Rechenrahmen 20/100, Lineal in echter Größe and Taschenrechner. Pure logic;
// MathTool.tsx draws them as SVG.

export type MathToolKind = 'boat' | 'abacus' | 'ruler' | 'calc';
/** Under boats and frame: nothing, a “?” to tap open, or always shown. */
export type MathShow = 'tap' | 'on';
export type MathTool = {
  tool: MathToolKind;
  n: number;
  /** Boats side by side (rows of ten) instead of one below the other. */
  wide?: boolean;
  /** Tokens already in the boats at the start. */
  blue?: number;
  red?: number;
  /** Number already set on the frame at the start. */
  start?: number;
  show?: MathShow;
  /** Taschenrechner with the paper strip (Kassenzettel) listing every sum. */
  tape?: boolean;
};
export type MathToolSettings = {
  mathTool?: unknown;
  mathSize?: unknown;
  mathWide?: unknown;
  mathBlue?: unknown;
  mathRed?: unknown;
  mathStart?: unknown;
  mathShow?: unknown;
  mathTape?: unknown;
};

const whole = (v: unknown, min: number, max: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : 0);

/** Clean settings as the reference does: boats 5/10/20, frames 2 or 10 rows, rulers 10–30 cm. */
export function mathTool(settings: MathToolSettings | undefined): MathTool {
  const tool: MathToolKind = ['abacus', 'ruler', 'calc'].includes(settings?.mathTool as string)
    ? (settings!.mathTool as MathToolKind)
    : 'boat';
  const raw = typeof settings?.mathSize === 'number' && Number.isFinite(settings.mathSize) ? Math.round(settings.mathSize) : 0;
  const show = settings?.mathShow === 'tap' || settings?.mathShow === 'on' ? { show: settings.mathShow as MathShow } : {};
  if (tool === 'boat') {
    const n = [5, 10, 20].includes(raw) ? raw : 10, blue = whole(settings?.mathBlue, 0, n), red = whole(settings?.mathRed, 0, n - blue);
    return { tool, n, ...show, ...(settings?.mathWide === true && n > 5 ? { wide: true } : {}), ...(blue ? { blue } : {}), ...(red ? { red } : {}) };
  }
  if (tool === 'abacus') {
    const n = raw === 2 ? 2 : 10, start = whole(settings?.mathStart, 0, n * 10);
    return { tool, n, ...show, ...(start ? { start } : {}) };
  }
  if (tool === 'ruler') return { tool, n: Math.min(30, Math.max(10, raw || 20)) };
  return { tool, n: 0, ...(settings?.mathTape === true ? { tape: true } : {}) };
}

/** Back into the settings of the element (all fields, so old values disappear). */
export function mathToolSettings(t: MathTool) {
  return {
    mathTool: t.tool,
    mathSize: t.n,
    mathWide: t.wide ?? false,
    mathBlue: t.blue ?? 0,
    mathRed: t.red ?? 0,
    mathStart: t.start ?? 0,
    mathShow: (t.show ?? 'off') as MathShow | 'off',
    mathTape: t.tape ?? false,
  };
}

/** Room below boats and frame for the buttons and the number. */
export const BUTTON_ROOM = 84;
export const BOAT_H = 128, BOAT_GAP = 12, BOAT_BREAK = 22;
const boatsHeight = (t: MathTool) => {
  const rows = t.wide && t.n > 5 ? t.n / 10 : t.n / 5;
  return rows * BOAT_H + (rows - 1) * BOAT_GAP + (!t.wide && t.n === 20 ? BOAT_BREAK : 0);
};

/** Drawing size (SVG units; for the ruler these are millimetres). */
export function viewSize(t: MathTool) {
  if (t.tool === 'boat') return { w: t.wide && t.n > 5 ? 1136 : 580, h: 14 + boatsHeight(t) + BUTTON_ROOM };
  if (t.tool === 'abacus') return { w: 1020, h: t.n * 74 + 50 + BUTTON_ROOM };
  if (t.tool === 'ruler') return { w: t.n * 10 + 16, h: 32 };
  return { w: 360 + (t.tape ? TAPE_W : 0), h: 520 };
}

/** Width of the paper strip left of the calculator. */
export const TAPE_W = 290;
/** At most this many sums stay on the strip. */
export const TAPE_MAX = 60;

/** Where boat number b (five places each) lies. */
export function boatAt(t: MathTool, b: number) {
  return t.wide && t.n > 5 ? { x: 20 + (b % 2) * 556, y: 14 + Math.floor(b / 2) * 140 } : { x: 20, y: 14 + b * 140 + (b >= 2 ? BOAT_BREAK : 0) };
}
/** Middle of the row of buttons below the boats or the frame. */
export const buttonRow = (t: MathTool) => (t.tool === 'boat' ? 14 + boatsHeight(t) + 14 + 31 : 10 + t.n * 74 + 30 + 12 + 31);

/** Size on the page in mm (reference page: 1400 px = 297 mm); the ruler has its real length when printed. */
export function pageSize(t: MathTool) {
  const v = viewSize(t);
  if (t.tool === 'ruler') return { width: v.w, height: v.h };
  const s = Math.min(t.tool === 'boat' ? 0.76 : t.tool === 'abacus' ? 0.62 : 300 / 360, 1320 / v.w);
  const mm = (px: number) => Math.round(Math.round(px * s) * (297 / 1400) * 10) / 10;
  return { width: mm(v.w), height: mm(v.h) };
}

export function mathToolTitle(t: MathTool) {
  if (t.tool === 'boat') return `Rechenschiffchen ${t.n}`;
  if (t.tool === 'abacus') return `Rechenrahmen ${t.n === 2 ? 20 : 100}`;
  if (t.tool === 'ruler') return `Lineal ${t.n} cm`;
  return 'Taschenrechner';
}

// ── Rechenschiffchen: first the blue tokens, then the red ones, no gaps ──

export type Boat = { blue: number; red: number };

/**
 * As in the reference: tapping a free place fills up to there (in the colour
 * of the last token), tapping a blue token turns it and all after it red,
 * tapping a red one turns it and all before it blue.
 */
export function tapBoat(s: Boat, index: number): Boat {
  const filled = s.blue + s.red;
  if (index >= filled) return s.red > 0 ? { blue: s.blue, red: s.red + index + 1 - filled } : { blue: s.blue + index + 1 - filled, red: 0 };
  if (index < s.blue) return { blue: index, red: s.red + s.blue - index };
  return { blue: index + 1, red: filled - index - 1 };
}

/** The round buttons below: one blue or red token more, one less. */
export function boatButton(s: Boat, key: 'blue' | 'red' | 'less', n: number): Boat {
  const filled = s.blue + s.red;
  if (key === 'blue' && filled < n) return { ...s, blue: s.blue + 1 };
  if (key === 'red' && filled < n) return { ...s, red: s.red + 1 };
  if (key === 'less') return s.red > 0 ? { ...s, red: s.red - 1 } : s.blue > 0 ? { ...s, blue: s.blue - 1 } : s;
  return s;
}

/** “4 + 3 = 7” or just “7”. */
export const boatSum = (s: Boat) => (s.blue && s.red ? `${s.blue} + ${s.red} = ${s.blue + s.red}` : String(s.blue + s.red));

/** Tokens from the saved answer; older answers kept a list of places (1 blue, 2 red). */
export function boatOf(t: MathTool, state: { blue?: unknown; red?: unknown; cells?: unknown }): Boat {
  if (typeof state.blue === 'number' || typeof state.red === 'number') {
    const blue = whole(state.blue, 0, t.n);
    return { blue, red: whole(state.red, 0, t.n - blue) };
  }
  if (Array.isArray(state.cells) && state.cells.length === t.n) {
    const blue = state.cells.filter((c) => c === 1).length;
    return { blue, red: Math.min(t.n - blue, state.cells.filter((c) => c === 2).length) };
  }
  return { blue: t.blue ?? 0, red: t.red ?? 0 };
}

// ── Rechenrahmen: per row the number of beads pushed to the left ─────────

/** Rows at the start: full rows are tens, the next row holds the ones. */
export const abacusStart = (t: MathTool) => Array.from({ length: t.tool === 'abacus' ? t.n : 0 }, (_, row) => Math.min(10, Math.max(0, (t.start ?? 0) - row * 10)));

/** Rows from the saved answer, else the number set at the start. */
export function rowsOf(t: MathTool, state: { rows?: unknown }): number[] {
  return Array.isArray(state.rows) && state.rows.length === t.n ? state.rows.map((r) => whole(r, 0, 10)) : abacusStart(t);
}

/** Tapping a bead on the right pushes it (and those before it) left, and back. */
export function tapAbacus(rows: number[], row: number, bead: number): number[] {
  const next = [...rows];
  const left = next[row] ?? 0;
  next[row] = bead >= left ? bead + 1 : bead;
  return next;
}

export const BEAD_STEP = 62;
/** x position of a bead: those counted sit on the left, the others on the right. */
export const beadX = (bead: number, left: number) => (bead < left ? 100 + bead * BEAD_STEP : 920 - (9 - bead) * BEAD_STEP);

/** Bead colour: red and blue change after five; on the frame to 100 the lower half starts blue. */
export const beadRed = (t: MathTool, row: number, bead: number) => (bead < 5) !== (t.n === 10 && row >= 5);

// ── Taschenrechner ─────────────────────────────────────────────────────────

export type Calc = { shown: string; acc: number | null; op: string | null; fresh: boolean };
export const freshCalc = (): Calc => ({ shown: '0', acc: null, op: null, fresh: true });

/** German number display: comma, at most 12 digits, “Fehler” for division by zero. */
export function showNumber(value: number) {
  if (!Number.isFinite(value)) return 'Fehler';
  const rounded = Math.round(value * 1e9) / 1e9;
  let text = String(rounded);
  if (/e/i.test(text) || text.replace(/[-.]/g, '').length > 12) text = rounded.toPrecision(10).replace(/\.?0+(e|$)/, '$1');
  return text.replace('.', ',');
}
const parse = (shown: string) => Number(shown.replace(',', '.'));
const OPS: Record<string, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '−': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => (b === 0 ? NaN : a / b),
};

/** One key: digits, “,”, “C” (all), “del” (last digit), + − × ÷ and =. `log` gets each finished sum (“12 + 30 = 42”). */
export function pressKey(state: Calc, key: string, log?: (line: string) => void): Calc {
  let c: Calc = state.shown === 'Fehler' && key !== 'C' ? freshCalc() : { ...state };
  if (/^\d$/.test(key)) {
    if (c.fresh || c.shown === '0') c.shown = key;
    else if (c.shown.replace(/[-,]/g, '').length < 12) c.shown += key;
    c.fresh = false;
  } else if (key === ',') {
    if (c.fresh) c.shown = '0,';
    else if (!c.shown.includes(',')) c.shown += ',';
    c.fresh = false;
  } else if (key === 'C') c = freshCalc();
  else if (key === 'del') {
    if (c.fresh) return c;
    c.shown = c.shown.length > 1 ? c.shown.slice(0, -1) : '0';
    if (c.shown === '-') c.shown = '0';
  } else if (key in OPS || key === '=') {
    if (c.op && !c.fresh && c.acc !== null) {
      const result = showNumber(OPS[c.op](c.acc, parse(c.shown)));
      log?.(`${showNumber(c.acc)} ${c.op} ${showNumber(parse(c.shown))} = ${result}`);
      c.shown = result;
    }
    else if (c.op && c.fresh && key !== '=') return { ...c, op: key };
    if (c.shown === 'Fehler') {
      c.acc = null;
      c.op = null;
    } else {
      c.acc = parse(c.shown);
      c.op = key === '=' ? null : key;
    }
    c.fresh = true;
  }
  return c;
}

/** Keys: label, action, column, row, width, height (in cells). */
export const CALC_KEYS: [string, string, number, number, number, number][] = [
  ['C', 'C', 0, 0, 1, 1], ['⌫', 'del', 1, 0, 1, 1], ['÷', '÷', 2, 0, 1, 1], ['×', '×', 3, 0, 1, 1],
  ['7', '7', 0, 1, 1, 1], ['8', '8', 1, 1, 1, 1], ['9', '9', 2, 1, 1, 1], ['−', '−', 3, 1, 1, 1],
  ['4', '4', 0, 2, 1, 1], ['5', '5', 1, 2, 1, 1], ['6', '6', 2, 2, 1, 1], ['+', '+', 3, 2, 1, 1],
  ['1', '1', 0, 3, 1, 1], ['2', '2', 1, 3, 1, 1], ['3', '3', 2, 3, 1, 1], ['=', '=', 3, 3, 1, 2],
  ['0', '0', 0, 4, 2, 1], [',', ',', 2, 4, 1, 1],
];
export const isOperator = (action: string) => action in OPS || action === '=';

/** What a screen reader hears. */
export function mathToolLabel(t: MathTool, state: { boat?: Boat; rows?: number[]; calc?: Calc }) {
  if (t.tool === 'boat') {
    const blue = state.boat?.blue ?? 0, red = state.boat?.red ?? 0;
    return `${mathToolTitle(t)}${blue || red ? `: ${blue} blaue und ${red} rote Plättchen` : ''}.`;
  }
  if (t.tool === 'abacus') {
    const left = state.rows?.reduce((a, b) => a + b, 0) ?? 0;
    return `${mathToolTitle(t)}${left ? `: ${left} ${left === 1 ? 'Kugel' : 'Kugeln'} links` : ''}.`;
  }
  if (t.tool === 'calc') return `Taschenrechner: ${state.calc?.shown ?? '0'}.`;
  return `${mathToolTitle(t)}.`;
}
