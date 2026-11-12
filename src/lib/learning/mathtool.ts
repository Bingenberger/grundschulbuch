// Mathe-Werkzeuge like the reference (Regal › Mathe): Rechenschiffchen 5/10/20,
// Rechenrahmen 20/100, Lineal in echter Größe and Taschenrechner. Pure logic;
// MathTool.tsx draws them as SVG.

export type MathToolKind = 'boat' | 'abacus' | 'ruler' | 'calc';
export type MathTool = { tool: MathToolKind; n: number };

/** Clean settings: boats 5/10/20, frames 2 or 10 rows, rulers 10–30 cm. */
export function mathTool(settings: { mathTool?: unknown; mathSize?: unknown } | undefined): MathTool {
  const tool: MathToolKind = ['abacus', 'ruler', 'calc'].includes(settings?.mathTool as string)
    ? (settings!.mathTool as MathToolKind)
    : 'boat';
  const raw = typeof settings?.mathSize === 'number' && Number.isFinite(settings.mathSize) ? Math.round(settings.mathSize) : 0;
  if (tool === 'boat') return { tool, n: [5, 10, 20].includes(raw) ? raw : 10 };
  if (tool === 'abacus') return { tool, n: raw === 2 ? 2 : 10 };
  if (tool === 'ruler') return { tool, n: Math.min(30, Math.max(10, raw || 20)) };
  return { tool, n: 0 };
}

/** Drawing size (SVG units; for the ruler these are millimetres). */
export function viewSize(t: MathTool) {
  if (t.tool === 'boat') return { w: 680, h: t.n === 5 ? 190 : t.n === 20 ? 600 : 300 };
  if (t.tool === 'abacus') return { w: 1060, h: t.n * 74 + 60 };
  if (t.tool === 'ruler') return { w: t.n * 10 + 16, h: 32 };
  return { w: 360, h: 520 };
}

/** Size on the page in mm; the ruler has its real length when printed. */
export function pageSize(t: MathTool) {
  const v = viewSize(t);
  if (t.tool === 'ruler') return { width: v.w, height: v.h };
  const width = t.tool === 'boat' ? 93.3 : t.tool === 'abacus' ? 135.8 : 63.6;
  return { width, height: Math.round((width * v.h) / v.w * 10) / 10 };
}

export function mathToolTitle(t: MathTool) {
  if (t.tool === 'boat') return `Rechenschiffchen ${t.n}`;
  if (t.tool === 'abacus') return `Rechenrahmen ${t.n === 2 ? 20 : 100}`;
  if (t.tool === 'ruler') return `Lineal ${t.n} cm`;
  return 'Taschenrechner';
}

// ── Rechenschiffchen: 0 empty, 1 blue, 2 red ─────────────────────────────

export type Token = 0 | 1 | 2;

/**
 * Always in order: tapping at or after the end adds a token in the next free
 * place (the colour of the one before; the first is blue). Tapping the last
 * token turns blue into red and red into nothing.
 */
export function tapBoat(cells: Token[], index: number): Token[] {
  const next = [...cells];
  const free = next.findIndex((c) => c === 0);
  const filled = free < 0 ? next.length : free;
  if (index >= filled) {
    if (filled < next.length) next[filled] = filled > 0 ? next[filled - 1] : 1;
  } else if (index === filled - 1) next[index] = next[index] === 1 ? 2 : 0;
  return next;
}

// ── Rechenrahmen: per row the number of beads pushed to the left ─────────

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

/** One key: digits, “,”, “C” (all), “del” (last digit), + − × ÷ and =. */
export function pressKey(state: Calc, key: string): Calc {
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
    if (c.op && !c.fresh && c.acc !== null) c.shown = showNumber(OPS[c.op](c.acc, parse(c.shown)));
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
export function mathToolLabel(t: MathTool, state: { cells?: Token[]; rows?: number[]; calc?: Calc }) {
  if (t.tool === 'boat') {
    const blue = state.cells?.filter((c) => c === 1).length ?? 0, red = state.cells?.filter((c) => c === 2).length ?? 0;
    return `${mathToolTitle(t)}${blue || red ? `: ${blue} blaue und ${red} rote Plättchen` : ''}.`;
  }
  if (t.tool === 'abacus') {
    const left = state.rows?.reduce((a, b) => a + b, 0) ?? 0;
    return `${mathToolTitle(t)}${left ? `: ${left} Kugeln links` : ''}.`;
  }
  if (t.tool === 'calc') return `Taschenrechner: ${state.calc?.shown ?? '0'}.`;
  return `${mathToolTitle(t)}.`;
}
