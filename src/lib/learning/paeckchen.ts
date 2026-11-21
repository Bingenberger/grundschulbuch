// “Aufgabenpäckchen”: a block of tasks on a page, written in a small task
// language. A script draws numbers, keeps only those that fit the conditions
// and writes tasks with gaps:
//
//   # Zu den Nachbarzehnern
//   a = 11..99
//   wenn einer(a) ≠ 0
//   u = abrunden(a, 10)
//   o = aufrunden(a, 10)
//   a − [a − u] = u
//   a + [o − a] = o
//
// Each run of the script gives one “Durchgang” – here two tasks with the same
// number. What is in [ ] becomes a box with that result; the rest is written as
// it stands, with the numbers of the variables.
import { sameAnswer } from '../sheets/answers';

export type Value = number | string;
export type Part = { s: string } | { a: string };
export type Task = { parts: Part[] };
export type PaeckchenCheck = 'none' | 'each' | 'button';
export type PaeckchenSettings = {
  script: string;
  /** Number of runs of the script. */
  count: number;
  columns: number;
  check: PaeckchenCheck;
  /** Tasks in the order of the script (Päckchen) or mixed. */
  order: 'script' | 'mixed';
  seed: number;
  /** The tasks drawn from the script (what is on the page and printed). */
  tasks: Task[];
};
export type ScriptError = { line: number; message: string };

// ---------------------------------------------------------------- tokens

type Tok = { t: 'num'; v: number } | { t: 'id'; v: string } | { t: 'op'; v: string } | { t: 'end' };
const IDENT = /^[A-Za-zÄÖÜäöüß_][A-Za-z0-9ÄÖÜäöüß_]*/;
const OPS = ['..', '<=', '>=', '!=', '==', '&&', '||', '≤', '≥', '≠', '+', '-', '−', '–', '*', '·', '×', ':', '/', '%', '(', ')', ',', '<', '>', '=', '!'];

class ScriptFault extends Error {}
/** A condition that cannot be met with these numbers (division by zero, empty range): draw again. */
class Redraw extends Error {}

/** Names are compared without umlauts and case: “Übergang_Plus” = “uebergang_plus”. */
export const plainName = (name: string) =>
  name.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');

function tokens(text: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    const space = rest.match(/^\s+/);
    if (space) { i += space[0].length; continue; }
    const num = rest.match(/^\d+(?:\.\d+)?/);
    if (num) { out.push({ t: 'num', v: Number(num[0]) }); i += num[0].length; continue; }
    const id = rest.match(IDENT);
    if (id) { out.push({ t: 'id', v: id[0] }); i += id[0].length; continue; }
    const op = OPS.find((o) => rest.startsWith(o));
    if (!op) throw new ScriptFault(`Das Zeichen „${rest[0]}“ verstehe ich nicht.`);
    out.push({ t: 'op', v: op === '−' || op === '–' ? '-' : op === '·' || op === '×' ? '*' : op === '≤' ? '<=' : op === '≥' ? '>=' : op === '≠' ? '!=' : op === '==' ? '=' : op === '&&' ? 'und' : op === '||' ? 'oder' : op === '!' ? 'nicht' : op });
    i += op.length;
  }
  out.push({ t: 'end' });
  return out;
}

// ---------------------------------------------------------------- expressions

export type Expr =
  | { k: 'num'; v: number }
  | { k: 'var'; name: string }
  | { k: 'call'; name: string; args: Expr[] }
  | { k: 'un'; op: string; e: Expr }
  | { k: 'bin'; op: string; l: Expr; r: Expr };

const WORD_OPS: Record<string, string> = { und: 'und', oder: 'oder', nicht: 'nicht', mod: '%' };
const BINDING: Record<string, number> = { oder: 1, und: 2, '=': 4, '!=': 4, '<': 4, '>': 4, '<=': 4, '>=': 4, '+': 5, '-': 5, '*': 6, '/': 6, ':': 6, '%': 6 };

class Parser {
  i = 0;
  constructor(private toks: Tok[]) {}
  peek(): Tok { return this.toks[this.i]; }
  /** Operator at the current place, with words (und, oder, nicht, mod) read as operators. */
  op(): string | null {
    const t = this.peek();
    if (t.t === 'op') return t.v;
    if (t.t === 'id' && WORD_OPS[plainName(t.v)]) return WORD_OPS[plainName(t.v)];
    return null;
  }
  word(): string | null { const t = this.peek(); return t.t === 'id' ? plainName(t.v) : null; }
  take(op: string) {
    if (this.op() !== op) throw new ScriptFault(op === ')' ? 'Hier fehlt eine schließende Klammer „)“.' : `Hier fehlt „${op}“.`);
    this.i++;
  }
  expr(min = 0): Expr {
    let left = this.unary();
    for (;;) {
      const op = this.op();
      if (!op || !(op in BINDING) || BINDING[op] <= min) return left;
      this.i++;
      left = { k: 'bin', op, l: left, r: this.expr(BINDING[op]) };
    }
  }
  unary(): Expr {
    const op = this.op();
    if (op === '-') { this.i++; return { k: 'un', op: '-', e: this.expr(5.5) }; }
    if (op === '+') { this.i++; return this.expr(5.5); }
    if (op === 'nicht') { this.i++; return { k: 'un', op: 'nicht', e: this.expr(3) }; }
    return this.primary();
  }
  primary(): Expr {
    const t = this.peek();
    if (t.t === 'num') { this.i++; return { k: 'num', v: t.v }; }
    if (t.t === 'op' && t.v === '(') { this.i++; const e = this.expr(); this.take(')'); return e; }
    if (t.t === 'id' && !WORD_OPS[plainName(t.v)]) {
      this.i++;
      const name = plainName(t.v);
      if (this.op() !== '(') return { k: 'var', name };
      this.i++;
      const args: Expr[] = [];
      if (this.op() !== ')') {
        args.push(this.expr());
        while (this.op() === ',') { this.i++; args.push(this.expr()); }
      }
      this.take(')');
      return { k: 'call', name, args };
    }
    if (t.t === 'end') throw new ScriptFault('Hier fehlt noch etwas.');
    throw new ScriptFault(`„${t.v}“ steht an einer Stelle, an der ich eine Zahl erwarte.`);
  }
  end() {
    const t = this.peek();
    if (t.t !== 'end') throw new ScriptFault(`„${t.t === 'num' ? t.v : t.v}“ verstehe ich hier nicht – fehlt ein Rechenzeichen?`);
  }
}

export function parseExpr(text: string): Expr {
  const p = new Parser(tokens(text));
  const e = p.expr();
  p.end();
  return e;
}

const num = (v: Value): number => {
  if (typeof v !== 'number') throw new ScriptFault(`Mit „${v}“ kann ich nicht rechnen.`);
  return v;
};
const int = (v: Value) => Math.round(num(v));
const floorTo = (x: number, n: number) => { if (!n) throw new Redraw(); return Math.floor(x / n) * n; };
const ceilTo = (x: number, n: number) => { if (!n) throw new Redraw(); return Math.ceil(x / n) * n; };
const digit = (x: number, place: number) => Math.floor(Math.abs(x) / place) % 10;
const mod = (a: number, b: number) => { if (!b) throw new Redraw(); return ((a % b) + b) % b; };

type Fn = { args: [number, number]; run: (...a: Value[]) => Value; help?: string };
/** The functions of the task language (names without umlauts). */
export const FUNCTIONS: Record<string, Fn> = {
  einer: { args: [1, 1], run: (x) => digit(num(x), 1), help: 'einer(47) = 7' },
  zehner: { args: [1, 1], run: (x) => digit(num(x), 10), help: 'zehner(47) = 4 (die Ziffer)' },
  hunderter: { args: [1, 1], run: (x) => digit(num(x), 100), help: 'hunderter(347) = 3' },
  tausender: { args: [1, 1], run: (x) => digit(num(x), 1000) },
  abrunden: { args: [1, 2], run: (x, n = 10) => floorTo(num(x), num(n)), help: 'abrunden(47, 10) = 40' },
  aufrunden: { args: [1, 2], run: (x, n = 10) => ceilTo(num(x), num(n)), help: 'aufrunden(47, 10) = 50' },
  runden: { args: [1, 2], run: (x, n = 10) => { const s = num(n); if (!s) throw new Redraw(); return Math.round(num(x) / s) * s; }, help: 'runden(45, 10) = 50' },
  ganz: { args: [1, 1], run: (x) => Math.trunc(num(x)), help: 'ganz(17 / 5) = 3' },
  rest: { args: [2, 2], run: (a, b) => mod(num(a), num(b)), help: 'rest(17, 5) = 2' },
  teilbar: { args: [2, 2], run: (a, b) => (mod(num(a), num(b)) === 0 ? 1 : 0), help: 'teilbar(a, 10): a ist eine Zehnerzahl' },
  gerade: { args: [1, 1], run: (x) => (mod(int(x), 2) === 0 ? 1 : 0) },
  ungerade: { args: [1, 1], run: (x) => (mod(int(x), 2) === 1 ? 1 : 0) },
  min: { args: [1, 9], run: (...a) => Math.min(...a.map(num)) },
  max: { args: [1, 9], run: (...a) => Math.max(...a.map(num)) },
  betrag: { args: [1, 1], run: (x) => Math.abs(num(x)) },
  uebergang_plus: { args: [2, 2], run: (a, b) => (digit(num(a), 1) + digit(num(b), 1) >= 10 ? 1 : 0), help: 'übergang_plus(a, b): a + b geht über den Zehner' },
  uebergang_minus: { args: [2, 2], run: (a, b) => (digit(num(a), 1) < digit(num(b), 1) ? 1 : 0), help: 'übergang_minus(a, b): a − b geht über den Zehner' },
  vergleich: { args: [2, 2], run: (a, b) => (num(a) < num(b) ? '<' : num(a) > num(b) ? '>' : '='), help: 'vergleich(a, b) ergibt <, > oder =' },
};

export type Scope = Record<string, Value>;
export function evaluate(e: Expr, scope: Scope): Value {
  switch (e.k) {
    case 'num': return e.v;
    case 'var':
      if (!(e.name in scope)) throw new ScriptFault(`„${e.name}“ kenne ich nicht – steht weiter oben „${e.name} = …“?`);
      return scope[e.name];
    case 'un': {
      const v = evaluate(e.e, scope);
      return e.op === '-' ? -num(v) : truthy(v) ? 0 : 1;
    }
    case 'call': {
      const fn = FUNCTIONS[e.name];
      if (!fn) throw new ScriptFault(`Die Funktion „${e.name}“ kenne ich nicht.`);
      if (e.args.length < fn.args[0] || e.args.length > fn.args[1]) throw new ScriptFault(`„${e.name}“ braucht ${fn.args[0] === fn.args[1] ? fn.args[0] : `${fn.args[0]} bis ${fn.args[1]}`} Zahl${fn.args[1] > 1 ? 'en' : ''} in der Klammer.`);
      return fn.run(...e.args.map((a) => evaluate(a, scope)));
    }
    case 'bin': {
      if (e.op === 'und') return truthy(evaluate(e.l, scope)) && truthy(evaluate(e.r, scope)) ? 1 : 0;
      if (e.op === 'oder') return truthy(evaluate(e.l, scope)) || truthy(evaluate(e.r, scope)) ? 1 : 0;
      const l = evaluate(e.l, scope), r = evaluate(e.r, scope);
      if (e.op === '=') return l === r ? 1 : 0;
      if (e.op === '!=') return l !== r ? 1 : 0;
      const a = num(l), b = num(r);
      switch (e.op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': case ':': if (!b) throw new Redraw(); return a / b;
        case '%': return mod(a, b);
        case '<': return a < b ? 1 : 0;
        case '>': return a > b ? 1 : 0;
        case '<=': return a <= b ? 1 : 0;
        case '>=': return a >= b ? 1 : 0;
      }
    }
  }
  throw new ScriptFault('Das verstehe ich nicht.');
}
const truthy = (v: Value) => (typeof v === 'number' ? v !== 0 : v !== '');

// ---------------------------------------------------------------- script

/** How a variable gets its value: a range, a list to pick from, or a calculation. */
type Source = { k: 'range'; from: Expr; to: Expr; step?: Expr } | { k: 'list'; items: Expr[] } | { k: 'calc'; e: Expr };
type Line =
  | { k: 'def'; line: number; name: string; src: Source }
  | { k: 'cond'; line: number; e: Expr }
  /** `group`: tasks joined by a line „oder“ – one of them comes per run. */
  | { k: 'task'; line: number; group: number; parts: ({ s: string; refs: { at: number; len: number; e: Expr }[] } | { gap: Expr })[] };
export type Script = { lines: Line[]; errors: ScriptError[] };

function parseSource(text: string): Source {
  const p = new Parser(tokens(text));
  const first = p.expr();
  if (p.op() === '..' || p.word() === 'bis') {
    p.i++;
    const to = p.expr();
    let step: Expr | undefined;
    if (p.word() === 'schritt') { p.i++; step = p.expr(); }
    p.end();
    return { k: 'range', from: first, to, step };
  }
  if (p.op() === ',') {
    const items = [first];
    while (p.op() === ',') { p.i++; items.push(p.expr()); }
    p.end();
    return { k: 'list', items };
  }
  p.end();
  return { k: 'calc', e: first };
}

/** The text of a task between the gaps: variables and {…} are replaced by numbers. */
function parseText(text: string, names: Set<string>) {
  const refs: { at: number; len: number; e: Expr }[] = [];
  const re = /\{([^{}]*)\}|[A-Za-zÄÖÜäöüß_][A-Za-z0-9ÄÖÜäöüß_]*/g;
  for (let m; (m = re.exec(text)); ) {
    if (m[1] !== undefined) refs.push({ at: m.index, len: m[0].length, e: parseExpr(m[1]) });
    else if (names.has(plainName(m[0]))) refs.push({ at: m.index, len: m[0].length, e: { k: 'var', name: plainName(m[0]) } });
  }
  return { s: text, refs };
}

export function parseScript(source: string): Script {
  const lines: Line[] = [];
  const errors: ScriptError[] = [];
  const names = new Set<string>();
  let groups = 0, orLine = 0;
  source.split(/\r?\n/).forEach((raw, index) => {
    const line = index + 1;
    const text = raw.replace(/(^|\s)(#|\/\/).*$/, '').trim();
    if (!text) return;
    try {
      if (/^oder$/i.test(text)) {
        if (!lines.some((l) => l.k === 'task') || orLine) throw new ScriptFault('„oder“ steht allein zwischen zwei Aufgaben – darüber und darunter muss je eine Aufgabe mit [ ] stehen.');
        orLine = line;
        return;
      }
      const cond = text.match(/^(?:nur\s+)?wenn\s+(.+)$/i);
      if (cond) { lines.push({ k: 'cond', line, e: parseExpr(cond[1]) }); return; }
      if (text.includes('[')) {
        const parts: Extract<Line, { k: 'task' }>['parts'] = [];
        const re = /\[([^\[\]]*)\]/g;
        let last = 0;
        for (let m; (m = re.exec(text)); ) {
          if (m.index > last) parts.push(parseText(text.slice(last, m.index), names));
          if (!m[1].trim()) throw new ScriptFault('In den eckigen Klammern [ ] muss stehen, was herauskommt.');
          parts.push({ gap: parseExpr(m[1]) });
          last = m.index + m[0].length;
        }
        if (last < text.length) parts.push(parseText(text.slice(last), names));
        if (/[\[\]]/.test(parts.map((p) => ('s' in p ? p.s : '')).join(''))) throw new ScriptFault('Eine eckige Klammer [ ] ist nicht geschlossen.');
        lines.push({ k: 'task', line, group: orLine ? groups - 1 : groups++, parts });
        orLine = 0;
        return;
      }
      const def = text.match(/^([A-Za-zÄÖÜäöüß_][A-Za-z0-9ÄÖÜäöüß_]*)\s*=(?!=)\s*(.+)$/);
      if (def) {
        const name = plainName(def[1]);
        if (FUNCTIONS[name] || WORD_OPS[name] || name === 'wenn' || name === 'bis' || name === 'schritt') throw new ScriptFault(`„${def[1]}“ ist schon vergeben – nimm einen anderen Namen.`);
        lines.push({ k: 'def', line, name, src: parseSource(def[2]) });
        names.add(name);
        return;
      }
      throw new ScriptFault('Das verstehe ich nicht. Eine Zeile ist „name = …“, „wenn …“ oder eine Aufgabe mit [ ].');
    } catch (e) {
      errors.push({ line, message: e instanceof ScriptFault ? e.message : String(e) });
    }
  });
  if (orLine) errors.push({ line: orLine, message: 'Nach „oder“ fehlt noch eine Aufgabe mit [ ].' });
  if (!errors.length && !lines.some((l) => l.k === 'task')) errors.push({ line: 0, message: 'Es fehlt noch eine Aufgabe mit einer Lücke in [ ], z. B. „a + b = [a + b]“.' });
  return { lines, errors };
}

/** Random numbers from a seed (mulberry32). */
export function randomFor(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A number as children write it: 3,5 – −4 – no rounding noise. */
export function formatValue(v: Value) {
  if (typeof v === 'string') return v;
  const r = Math.round(v * 1000) / 1000;
  return (r < 0 ? '−' : '') + String(Math.abs(r)).replace('.', ',');
}
/** Arithmetic signs as printed: − · and the unicode signs for comparisons. */
const typeset = (text: string) => text.replace(/\s*\*\s*/g, ' · ').replace(/-/g, '−').replace(/<=/g, '≤').replace(/>=/g, '≥').replace(/!=/g, '≠');

function draw(src: Source, scope: Scope, random: () => number): Value {
  if (src.k === 'calc') return evaluate(src.e, scope);
  if (src.k === 'list') return evaluate(src.items[Math.floor(random() * src.items.length)], scope);
  const from = Math.ceil(num(evaluate(src.from, scope))), to = Math.floor(num(evaluate(src.to, scope)));
  const step = src.step ? int(evaluate(src.step, scope)) : 1;
  if (step <= 0) throw new ScriptFault('Der Schritt muss größer als 0 sein.');
  if (to < from) throw new Redraw();
  const n = Math.floor((to - from) / step) + 1;
  return from + Math.floor(random() * n) * step;
}

const TRIES = 2000;
/** One run of the script: numbers that fit all conditions, and the tasks with them. */
function run(script: Script, random: () => number): Task[] {
  const misses = new Map<number, number>();
  for (let attempt = 0; attempt < TRIES; attempt++) {
    const scope: Scope = {};
    let current = 0;
    try {
      for (const l of script.lines) {
        current = l.line;
        if (l.k === 'def') scope[l.name] = draw(l.src, scope, random);
        else if (l.k === 'cond' && !truthy(evaluate(l.e, scope))) throw new Redraw();
      }
      // Of tasks joined by „oder“ one comes, chosen at random.
      const tasks = script.lines.filter((l): l is Extract<Line, { k: 'task' }> => l.k === 'task');
      const chosen = [...new Set(tasks.map((l) => l.group))].map((g) => { const alts = tasks.filter((l) => l.group === g); return alts[Math.floor(random() * alts.length)]; });
      return chosen.map((l) => {
        current = l.line;
        return {
          parts: l.parts.map((p): Part => {
            if ('gap' in p) return { a: formatValue(evaluate(p.gap, scope)) };
            let text = '', at = 0;
            for (const r of p.refs) { text += p.s.slice(at, r.at) + formatValue(evaluate(r.e, scope)); at = r.at + r.len; }
            return { s: typeset(text + p.s.slice(at)) };
          }),
        };
      });
    } catch (e) {
      if (e instanceof Redraw) { misses.set(current, (misses.get(current) ?? 0) + 1); continue; }
      if (e instanceof ScriptFault) throw Object.assign(new ScriptFault(e.message), { line: current });
      throw e;
    }
  }
  const worst = [...misses].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
  throw Object.assign(new ScriptFault('Hierzu finde ich (fast) keine passenden Zahlen – passen die Bedingungen zu den Zahlenbereichen?'), { line: worst });
}

const taskKey = (t: Task) => t.parts.map((p) => ('a' in p ? `[${p.a}]` : p.s)).join('');

/** The tasks of `count` runs; the same numbers twice only when there are too few to choose from. */
export function generate(source: string, count: number, seed: number, order: PaeckchenSettings['order'] = 'script'): { tasks: Task[]; errors: ScriptError[]; perRun: number } {
  const script = parseScript(source);
  const perRun = new Set(script.lines.flatMap((l) => (l.k === 'task' ? [l.group] : []))).size;
  if (script.errors.length) return { tasks: [], errors: script.errors, perRun };
  const random = randomFor(seed);
  const seen = new Set<string>();
  const tasks: Task[] = [];
  try {
    for (let n = 0; n < count; n++) {
      let round = run(script, random);
      for (let again = 0; again < 40 && seen.has(round.map(taskKey).join('|')); again++) round = run(script, random);
      seen.add(round.map(taskKey).join('|'));
      tasks.push(...round);
    }
  } catch (e) {
    if (e instanceof ScriptFault) return { tasks: [], errors: [{ line: (e as ScriptFault & { line?: number }).line ?? 0, message: e.message }], perRun };
    throw e;
  }
  if (order === 'mixed')
    for (let i = tasks.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [tasks[i], tasks[j]] = [tasks[j], tasks[i]]; }
  return { tasks, errors: [], perRun };
}

// ---------------------------------------------------------------- ready-made scripts

export type Recipe = { id: string; title: string; script: string; count?: number };
export const RECIPES: Recipe[] = [
  {
    id: 'nachbarzehner',
    title: 'Zu den Nachbarzehnern',
    count: 8,
    script: `# Von einer Zahl bis 100 zum Zehner davor abziehen
# und zum Zehner danach ergänzen
a = 11..99
wenn einer(a) ≠ 0
u = abrunden(a, 10)
o = aufrunden(a, 10)
a − [a − u] = u
a + [o − a] = o`,
  },
  {
    id: 'nachbarzehner-oder',
    title: 'Nachbarzehner: abziehen oder ergänzen',
    count: 12,
    script: `# Von einer Zahl bis 100 entweder zum Zehner davor
# abziehen oder zum Zehner danach ergänzen
a = 11..99
wenn einer(a) ≠ 0
u = abrunden(a, 10)
o = aufrunden(a, 10)
a − [a − u] = u
oder
a + [o − a] = o`,
  },
  {
    id: 'plus20-ohne',
    title: 'Plus bis 20 ohne Übergang',
    script: `a = 1..19
b = 1..20 − a
wenn nicht übergang_plus(a, b)
a + b = [a + b]`,
  },
  {
    id: 'plus20-mit',
    title: 'Plus bis 20 mit Übergang',
    script: `a = 2..9
b = 2..9
wenn übergang_plus(a, b)
a + b = [a + b]`,
  },
  {
    id: 'minus20',
    title: 'Minus bis 20',
    script: `a = 2..20
b = 1..a
a − b = [a − b]`,
  },
  {
    id: 'ergaenzen100',
    title: 'Ergänzen bis 100',
    script: `a = 1..99
a + [100 − a] = 100`,
  },
  {
    id: 'plus100',
    title: 'Plus bis 100 mit Übergang',
    script: `a = 11..89
b = 2..99 − a
wenn übergang_plus(a, b) und einer(b) ≠ 0
a + b = [a + b]`,
  },
  {
    id: 'einmaleins',
    title: 'Einmaleins',
    script: `a = 1..10
b = 2..10
a · b = [a · b]`,
  },
  {
    id: 'einmaleins-umkehr',
    title: 'Mal und geteilt',
    count: 6,
    script: `a = 2..10
b = 2..10
c = a · b
a · b = [c]
c : a = [b]`,
  },
  {
    id: 'rest',
    title: 'Geteilt mit Rest',
    script: `b = 2..9
a = b..10 · b
wenn rest(a, b) ≠ 0
a : b = [ganz(a / b)] R [rest(a, b)]`,
  },
  {
    id: 'vergleichen',
    title: 'Zahlen vergleichen',
    count: 10,
    script: `a = 1..100
b = a − 10..a + 10
wenn b ≥ 0 und b ≤ 100
a [vergleich(a, b)] b`,
  },
  {
    id: 'verdoppeln',
    title: 'Verdoppeln und halbieren',
    count: 6,
    script: `a = 1..50
das Doppelte von a ist [2 · a]
die Hälfte von {2 · a} ist [a]`,
  },
];

export const PAECKCHEN_DEFAULTS: PaeckchenSettings = { script: RECIPES[0].script, count: 8, columns: 2, check: 'button', order: 'script', seed: 1, tasks: [] };

/** Cleaned settings with tasks drawn (if none are stored). */
export function paeckchenConfig(raw: unknown): PaeckchenSettings {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<PaeckchenSettings>;
  const c: PaeckchenSettings = {
    script: typeof v.script === 'string' ? v.script.slice(0, 4000) : PAECKCHEN_DEFAULTS.script,
    count: Number.isInteger(v.count) ? Math.min(40, Math.max(1, v.count!)) : PAECKCHEN_DEFAULTS.count,
    columns: Number.isInteger(v.columns) ? Math.min(4, Math.max(1, v.columns!)) : PAECKCHEN_DEFAULTS.columns,
    check: v.check === 'none' || v.check === 'each' ? v.check : 'button',
    order: v.order === 'mixed' ? 'mixed' : 'script',
    seed: Number.isInteger(v.seed) ? v.seed! : 1,
    tasks: Array.isArray(v.tasks) ? v.tasks.filter((t) => t && Array.isArray(t.parts)).slice(0, 200).map((t) => ({ parts: t.parts.filter((p) => p && (typeof (p as { s?: unknown }).s === 'string' || typeof (p as { a?: unknown }).a === 'string')) })) : [],
  };
  if (!c.tasks.length) c.tasks = generate(c.script, c.count, c.seed, c.order).tasks;
  return c;
}

/** The tasks with new numbers from the script. */
export function redraw(c: PaeckchenSettings, seed = Math.floor(Math.random() * 1e9)): PaeckchenSettings {
  return { ...c, seed, tasks: generate(c.script, c.count, seed, c.order).tasks };
}

// ---------------------------------------------------------------- answers and layout

/** Number of boxes before each task (answers are kept as one list). */
export function gapIndex(tasks: Task[]) {
  const starts: number[] = [];
  let n = 0;
  for (const t of tasks) { starts.push(n); n += t.parts.filter((p) => 'a' in p).length; }
  return { starts, total: n };
}
export const results = (tasks: Task[]) => tasks.flatMap((t) => t.parts.flatMap((p) => ('a' in p ? [p.a] : [])));
export const isRight = (typed: string | undefined, result: string) => !!typed?.trim() && sameAnswer(typed, result);
/** “7 von 8 richtig”. */
export function score(tasks: Task[], answers: (string | undefined)[]) {
  const all = results(tasks);
  const right = all.filter((r, i) => isRight(answers[i], r)).length;
  return { right, total: all.length, filled: all.filter((_, i) => !!answers[i]?.trim()).length };
}

/** Ties answers to the tasks they belong to (new tasks start empty). */
export function tasksKey(tasks: Task[]) {
  let h = 0x811c9dc5;
  for (const ch of JSON.stringify(tasks)) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193) >>> 0;
  return h.toString(36);
}

/** Tasks per run of the script (they stay together); 1 when mixed. */
export const groupOf = (c: Pick<PaeckchenSettings, 'order' | 'count' | 'tasks'>) => {
  const n = c.order === 'mixed' || !c.count ? 1 : Math.round(c.tasks.length / c.count);
  return n > 1 && n <= 4 ? n : 1;
};

/** Task numbers per column, in groups; the tasks of one run stay together in a column. */
export function columnsOf(tasks: Task[], columns: number, group: number) {
  const groups: number[][] = [];
  tasks.forEach((_, i) => { if (i % group === 0) groups.push([]); groups[groups.length - 1].push(i); });
  const per = Math.ceil(groups.length / columns);
  return Array.from({ length: columns }, (_, c) => groups.slice(c * per, (c + 1) * per)).filter((c) => c.length);
}

/** Width of the boxes (em): all the same, wide enough for the longest result. */
export const boxEm = (tasks: Task[]) => Math.max(2.2, Math.max(0, ...results(tasks).map((a) => a.length)) * 0.62 + 1);

/** Font size (mm) at the natural size; rows are 1.6 em high with 0.5 em between them, 0.9 em between Päckchen. */
export const FONT_MM = 5.4;
/** Size on the page (mm) for these tasks. */
export function paeckchenSize(c: PaeckchenSettings) {
  const em = FONT_MM;
  const group = groupOf(c);
  const cols = columnsOf(c.tasks, c.columns, group);
  const box = boxEm(c.tasks) * em + 0.2 * em;
  const colWidth = Math.max(30, ...c.tasks.map((t) => t.parts.reduce((n, p) => n + ('a' in p ? box : p.s.length * 0.56 * em), 0)));
  const colHeight = Math.max(0, ...cols.map((col) => {
    const rows = col.reduce((n, g) => n + g.length, 0);
    return rows * 1.6 * em + (rows - col.length) * 0.5 * em + (col.length - 1) * 0.9 * em;
  }));
  const foot = c.check === 'button' ? 2.2 * em : 0;
  return {
    width: Math.min(277, Math.round(cols.length * colWidth + (cols.length - 1) * 1.6 * em + 1.2 * em + 2)),
    height: Math.min(260, Math.round(colHeight + foot + 0.8 * em + 3)),
  };
}
