// Kassenzettel like the reference (“Rechnen mit dem Taschenrechner”): add up a
// receipt, type the sum, then the change for the given amount. Several receipts
// per round, a stamp for each right one and a summary at the end. Pure logic;
// Receipt.tsx draws it.
import { seeded } from './algorithms';

/** Repeatable random numbers in [0, 1) for a seed. */
export function randomFor(seed: number) {
  const next = seeded(seed);
  return () => next(1_000_000) / 1_000_000;
}

export type ReceiptFormat = 'eurocent' | 'euro' | 'cent';
export type ReceiptLevel = 'simple' | 'complex';
export type ReceiptConfig = { count: number; level: ReceiptLevel; format: ReceiptFormat; change: boolean; rounds: number };
export type ReceiptLine = { name: string; price: number };
export type RoundStats = { start: number; end: number; errors: number; fixes: number };
export type ReceiptState = {
  lines: ReceiptLine[];
  active: 'sum' | 'change' | null;
  sum: string;
  change: string;
  sumOk: boolean | null;
  changeOk: boolean | null;
  paid: number;
  round: number;
  stats: RoundStats[];
  summary: boolean;
};

// Name, lowest and highest price (cents; for “euro” whole euros).
const MARKET: [string, number, number][] = [
  ['Milch 1 l', 99, 149], ['Butter', 179, 249], ['Brot', 189, 349], ['Semmeln 6 Stück', 149, 259], ['Äpfel 1 kg', 199, 299],
  ['Bananen 1 kg', 139, 199], ['Tomaten', 149, 249], ['Gurke', 49, 89], ['Karotten 1 kg', 79, 129], ['Kartoffeln 2,5 kg', 249, 399],
  ['Nudeln', 79, 169], ['Reis', 119, 229], ['Joghurt', 39, 89], ['Käse', 199, 399], ['Eier 10 Stück', 199, 329],
  ['Orangensaft', 129, 249], ['Mineralwasser', 39, 89], ['Müsli', 199, 399], ['Haferflocken', 59, 119], ['Honig', 299, 549],
  ['Kaffee', 499, 899], ['Tee', 129, 249], ['Schokolade', 79, 189], ['Kekse', 99, 199], ['Mehl', 59, 99], ['Zucker', 79, 129],
  ['Zahnpasta', 89, 199], ['Seife', 69, 149], ['Spülmittel', 79, 149], ['Taschentücher', 99, 199], ['Paprika', 99, 179],
  ['Erdbeeren', 199, 349], ['Quark', 49, 99], ['Ketchup', 99, 199],
];
const STORE: [string, number, number][] = [
  ['Kaffee', 5, 8], ['Käse', 3, 5], ['Honig', 4, 6], ['Blumenstrauß', 6, 12], ['Waschmittel', 6, 11], ['Wassermelone', 3, 5],
  ['Pfanne', 18, 34], ['Handtuch', 8, 16], ['Regenschirm', 9, 19], ['Brettspiel', 19, 35], ['Fußball', 12, 25], ['T-Shirt', 9, 19],
  ['Bettwäsche', 25, 45], ['Toaster', 19, 39], ['Kopfhörer', 15, 49], ['Rucksack', 19, 39], ['Puzzle', 7, 15], ['Malkasten', 6, 12],
  ['Tasse', 3, 7], ['Kerzen', 4, 9], ['Gießkanne', 5, 11], ['Taschenlampe', 7, 16], ['Federmappe', 8, 18], ['Wecker', 9, 21],
];
const KIOSK: [string, number, number][] = [
  ['Semmel', 25, 45], ['Kaugummi', 40, 90], ['Apfel', 35, 60], ['Banane', 25, 45], ['Lolli', 15, 35], ['Breze', 55, 85],
  ['Joghurt', 39, 69], ['Mandarine', 20, 35], ['Gummibärchen', 69, 99], ['Wasser 0,5 l', 49, 79], ['Radiergummi', 45, 85],
  ['Bleistift', 35, 75], ['Notizblock', 69, 99], ['Postkarte', 50, 90], ['Müsliriegel', 45, 79], ['Milch klein', 49, 79],
  ['Keks', 15, 40], ['Zeitung', 80, 99], ['Spitzer', 39, 79], ['Briefmarke', 85, 95],
];

export const SHOP_NAMES: Record<ReceiptFormat, string> = { euro: 'KAUFHAUS SONNENECK', cent: 'KIOSK AM PARK', eurocent: 'FRISCHMARKT' };

export function receiptConfig(settings: Record<string, unknown> | undefined): ReceiptConfig {
  const r = (settings?.receipt && typeof settings.receipt === 'object' ? settings.receipt : {}) as Record<string, unknown>;
  const format: ReceiptFormat = r.format === 'euro' || r.format === 'cent' ? r.format : 'eurocent';
  return {
    count: Math.max(3, Math.min(10, Math.round(Number(r.count) || 5))),
    level: r.level === 'complex' ? 'complex' : 'simple',
    format,
    change: r.change === true,
    rounds: Math.max(1, Math.min(10, Math.round(Number(r.rounds) || 1))),
  };
}

/** A fresh shopping list; `random` returns numbers in [0, 1). */
export function receiptLines(c: Pick<ReceiptConfig, 'count' | 'level' | 'format'>, random: () => number = Math.random): ReceiptLine[] {
  const pick = <T,>(list: T[], n: number) => {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  };
  const between = (a: number, b: number) => a + Math.floor(random() * (b - a + 1));
  const n = Math.max(3, Math.min(10, Math.round(c.count)));
  const simple = c.level === 'simple';
  if (c.format === 'euro')
    return pick(simple ? STORE.filter(([, low]) => low <= 8) : STORE, n).map(([name, low, high]) => {
      let euro = between(low, simple ? Math.min(high, 10) : high);
      if (simple && euro > 5) euro = Math.round(euro / 5) * 5 || 5;
      return { name, price: euro * 100 };
    });
  if (c.format === 'cent')
    return pick(KIOSK, n).map(([name, low, high]) => {
      let cents = between(low, high);
      if (simple) cents = Math.min(90, Math.max(10, Math.round(cents / 10) * 10));
      return { name, price: Math.min(99, cents) };
    });
  return pick(MARKET, n).map(([name, low, high]) => {
    const cents = between(low, high);
    return { name, price: simple ? Math.max(10, Math.round(cents / 10) * 10) : cents };
  });
}

/** “2,49 €”, “7 €” or “45 ct”. */
export function money(cents: number, format: ReceiptFormat) {
  if (format === 'cent') return `${cents} ct`;
  if (format === 'euro') return `${Math.round(cents / 100)} €`;
  return `${Math.floor(cents / 100)},${String(cents % 100).padStart(2, '0')} €`;
}
export const unit = (format: ReceiptFormat) => (format === 'cent' ? 'ct' : '€');

/** What was typed, in cents; null if it is not a valid amount. */
export function parseMoney(text: string, format: ReceiptFormat): number | null {
  const t = text.replace(/\s/g, '').replace('€', '').replace(/ct$/i, '').replace('.', ',');
  if (!/^\d+(,\d{0,2})?$/.test(t)) return null;
  const [whole, part = ''] = t.split(',');
  if (format === 'cent') return part ? null : Number(whole);
  return Number(whole) * 100 + Number(part.padEnd(2, '0') || 0);
}

export const total = (lines: ReceiptLine[]) => lines.reduce((a, l) => a + l.price, 0);

/** The amount handed over: one of the next round notes or coins above the sum. */
export function paidFor(sum: number, format: ReceiptFormat, random: () => number = Math.random) {
  const steps = format === 'cent' ? [50, 100, 200, 500] : format === 'euro' ? [500, 1000, 2000, 5000, 10000, 20000] : [100, 500, 1000, 2000, 5000, 10000];
  const options: number[] = [];
  for (const step of steps) {
    const amount = Math.ceil((sum + 1) / step) * step;
    if (amount > sum && !options.includes(amount)) options.push(amount);
  }
  const first = options.slice(0, 3);
  return first[Math.floor(random() * first.length)] ?? sum;
}

export function newReceipt(c: ReceiptConfig, seed: number): ReceiptState {
  return {
    lines: receiptLines(c, randomFor(seed)),
    active: null,
    sum: '',
    change: '',
    sumOk: null,
    changeOk: null,
    paid: 0,
    round: 0,
    stats: [],
    summary: false,
  };
}

export const solved = (c: ReceiptConfig, s: ReceiptState) => s.sumOk === true && (!c.change || s.changeOk === true);

function stats(s: ReceiptState, now: number): RoundStats[] {
  const list = s.stats.slice();
  list[s.round] = list[s.round] ? { ...list[s.round] } : { start: now, end: 0, errors: 0, fixes: 0 };
  return list;
}

/** Tapping the sum or change field opens the keypad (again tapping closes it). */
export function toggleField(s: ReceiptState, field: 'sum' | 'change', now = Date.now()): ReceiptState {
  return { ...s, active: s.active === field ? null : field, stats: stats(s, now) };
}

/** A key on the pad (digits, “,”, “del”) or “ok” (check). */
export function receiptKey(c: ReceiptConfig, s: ReceiptState, key: string, now = Date.now(), random: () => number = Math.random): { state: ReceiptState; result?: 'right' | 'wrong' } {
  if (!s.active) return { state: s };
  if (key === 'ok') return check(c, s, now, random);
  const field = s.active;
  let text = field === 'sum' ? s.sum : s.change;
  const st = stats(s, now);
  if (key === 'del') {
    if (text) st[s.round].fixes++;
    text = text.slice(0, -1);
  } else if (key === ',') {
    if (c.format === 'eurocent' && !text.includes(',')) text = (text || '0') + ',';
  } else if (/^\d$/.test(key)) {
    const decimals = text.includes(',') ? text.split(',')[1].length : -1;
    if (text.replace(',', '').length < 7 && decimals < 2) text = text === '0' ? key : text + key;
  } else return { state: s };
  const next = field === 'sum' ? { ...s, sum: text, sumOk: null, stats: st } : { ...s, change: text, changeOk: null, stats: st };
  return { state: next };
}

function check(c: ReceiptConfig, s: ReceiptState, now: number, random: () => number): { state: ReceiptState; result?: 'right' | 'wrong' } {
  const sum = total(s.lines);
  const st = stats(s, now);
  let next: ReceiptState;
  let result: 'right' | 'wrong';
  if (s.active === 'sum') {
    const value = parseMoney(s.sum, c.format);
    if (value === null) return { state: s };
    const ok = value === sum;
    next = { ...s, sumOk: ok, stats: st };
    if (ok) {
      if (c.change) next = { ...next, paid: paidFor(sum, c.format, random), active: 'change' };
      else next.active = null;
      result = 'right';
    } else {
      st[s.round].errors++;
      result = 'wrong';
    }
  } else {
    const value = parseMoney(s.change, c.format);
    if (value === null) return { state: s };
    const ok = value === s.paid - sum;
    next = { ...s, changeOk: ok, active: ok ? null : s.active, stats: st };
    if (!ok) st[s.round].errors++;
    result = ok ? 'right' : 'wrong';
  }
  if (solved(c, next) && !st[s.round].end) st[s.round].end = now;
  return { state: next, result };
}

/** “Nächster Zettel” – or the summary after the last one. */
export function nextReceipt(c: ReceiptConfig, s: ReceiptState, seed: number): ReceiptState {
  if (s.round + 1 >= c.rounds) return { ...s, summary: true, active: null };
  return {
    ...s,
    lines: receiptLines(c, randomFor(seed)),
    active: null,
    sum: '',
    change: '',
    sumOk: null,
    changeOk: null,
    paid: 0,
    round: s.round + 1,
  };
}

/** Layout of the receipt (SVG units, 820 × 860). */
export function receiptLayout(lines: number, change: boolean) {
  const step = lines > 7 ? 36 : 42;
  const sumY = 196 + lines * step + 34, paidY = sumY + 70, changeY = paidY + 58;
  const end = Math.min(846, (change ? changeY : sumY) + 90 + 70);
  return { step, first: 196, sumY, paidY, changeY, end };
}

export const duration = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return s < 60 ? `${s} Sek.` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} Min.`;
};

export function receiptLabel(c: ReceiptConfig, lines: number) {
  return `Kassenzettel mit ${lines} Einkäufen: Rechne die Summe mit dem Taschenrechner aus und trage sie ein${c.change ? ', danach das Rückgeld' : ''}.`;
}
