import {
  generateWorksheet,
  generators,
  type GeneratorOptions,
} from '../generators';
import { newPage, uuid, compactStroke, type Page } from '../notebook-model';
import { seeded, sudoku4 } from './algorithms';
export const extraGenerators = {
  addition: 'Plusaufgaben',
  subtraction: 'Minusaufgaben',
  multiplication: 'Malaufgaben',
  division: 'Geteiltaufgaben',
  tenstep: 'Zehnerübergang in Schritten',
  numberline: 'Rechenstrich & Zahlenstrahl',
  tables: 'Rechentabellen',
  numberwords: 'Zahlen und Zahlwörter',
  counting: 'Mengen zählen',
  circling: 'Mengen einkreisen',
  patterns: 'Muster nachzeichnen',
  doubling: 'Verdoppeln & Halbieren',
  neighbors: 'Nachbarzahlen',
  comparison: 'Zahlen vergleichen',
  sequences: 'Zahlenfolgen',
  placevalue: 'Stellenwerte',
  boats: 'Rechenschiffchen',
  hundred: 'Hunderterfeld',
  writtenplus: 'Schriftlich addieren',
  writtenminus: 'Schriftlich subtrahieren',
  walls: 'Rechenmauern',
  triangles: 'Rechendreiecke',
  magic: 'Magische Quadrate',
  sudoku: 'Sudoku 4 × 4',
  moneycount: 'Geldbeträge bestimmen',
  moneypay: 'Geld legen',
  moneychange: 'Wechselgeld',
  shoppinglist: 'Einkaufszettel',
  moneyconvert: 'Euro und Cent',
  moneycompare: 'Geld vergleichen',
  moneycalc: 'Mit Geld rechnen',
  clockdraw: 'Uhrzeiger einzeichnen',
  clockwords: 'Uhrzeit in Worten',
  clock24: 'Tageszeiten (24 Stunden)',
  timespan: 'Zeitspannen',
  earlierlater: 'Früher und später',
  notenames: 'Notennamen',
  notedraw: 'Noten einzeichnen',
  notewords: 'Notenrätsel',
  notevalues: 'Notenwerte',
  tracing: 'Schwungübungen',
  mazes: 'Labyrinthe',
} as const;
export const allGenerators = { ...generators, ...extraGenerators };
export type WorksheetKind = keyof typeof allGenerators;
export type WorksheetOptions = Omit<GeneratorOptions, 'kind'> & {
  kind: WorksheetKind;
  count?: number;
  showSolutions?: boolean;
};
const names = [
  'null',
  'eins',
  'zwei',
  'drei',
  'vier',
  'fünf',
  'sechs',
  'sieben',
  'acht',
  'neun',
  'zehn',
  'elf',
  'zwölf',
  'dreizehn',
  'vierzehn',
  'fünfzehn',
  'sechzehn',
  'siebzehn',
  'achtzehn',
  'neunzehn',
];
export function numberWord(n: number): string {
  if (n < 20) return names[n];
  if (n < 100) {
    const tens = [
      '',
      '',
      'zwanzig',
      'dreißig',
      'vierzig',
      'fünfzig',
      'sechzig',
      'siebzig',
      'achtzig',
      'neunzig',
    ];
    return (
      (n % 10 ? (n % 10 === 1 ? 'ein' : names[n % 10]) + 'und' : '') +
      tens[Math.floor(n / 10)]
    );
  }
  if (n < 1000)
    return (
      (Math.floor(n / 100) === 1 ? 'ein' : names[Math.floor(n / 100)]) +
      'hundert' +
      (n % 100 ? numberWord(n % 100) : '')
    );
  if (n < 10000)
    return (
      (Math.floor(n / 1000) === 1 ? 'ein' : numberWord(Math.floor(n / 1000))) +
      'tausend' +
      (n % 1000 ? numberWord(n % 1000) : '')
    );
  return 'zehntausend';
}
function text(
  p: Page,
  value: string,
  x: number,
  y: number,
  w = 175,
  size = 16,
  color = '#2c4436',
  height = 15,
) {
  p.elements.push({
    id: uuid(),
    type: 'text',
    text: value,
    font: 'Andika',
    fontSize: size,
    x,
    y,
    width: w,
    height,
    rotation: 0,
    locked: false,
    color,
  });
}
function line(p: Page, points: number[][], width = 0.3, color = '#9bad91') {
  p.elements.push(
    compactStroke({
      id: uuid(),
      type: 'stroke',
      x: 0,
      y: 0,
      width: 210,
      height: 297,
      rotation: 0,
      locked: false,
      color,
      penWidth: width,
      opacity: 1,
      points: points.map(([x, y]) => ({ x, y, pressure: 0.5 })),
    }),
  );
}
function box(p: Page, x: number, y: number, w: number, h: number) {
  line(p, [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
    [x, y],
  ]);
}
function circle(p: Page, x: number, y: number, r: number, label: string) {
  p.elements.push({
    id: uuid(),
    type: 'shape',
    shape: 'ellipse',
    x: x - r,
    y: y - r,
    width: r * 2,
    height: r * 2,
    rotation: 0,
    locked: false,
    color: '#b19b63',
    fill: '#fcf5dd',
    strokeWidth: 0.3,
  });
  text(p, label, x - r, y - 3, r * 2, 10, '#66552e');
}
function heading(p: Page, title: string) {
  text(p, title, 16, 11, 178, 22);
  text(p, 'Name: ______________________  Datum: __________', 16, 29, 180, 10);
}
const euro = (n: number) =>
  (n / 100).toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' €';
function clock(
  p: Page,
  cx: number,
  cy: number,
  hour: number,
  minute: number,
  draw = true,
) {
  p.elements.push({
    id: uuid(),
    type: 'shape',
    shape: 'ellipse',
    x: cx - 19,
    y: cy - 19,
    width: 38,
    height: 38,
    rotation: 0,
    locked: false,
    color: '#78916c',
    fill: '#ffffff',
    strokeWidth: 0.35,
  });
  for (let h = 1; h <= 12; h++) {
    const angle = (h / 12) * Math.PI * 2;
    text(
      p,
      String(h),
      cx + 15 * Math.sin(angle) - 2,
      cy - 15 * Math.cos(angle) - 2.5,
      7,
      8,
    );
  }
  if (draw) {
    const angleH = ((hour + minute / 60) / 12) * Math.PI * 2,
      angleM = (minute / 60) * Math.PI * 2;
    line(
      p,
      [
        [cx, cy],
        [cx + 9 * Math.sin(angleH), cy - 9 * Math.cos(angleH)],
      ],
      0.7,
    );
    line(
      p,
      [
        [cx, cy],
        [cx + 14 * Math.sin(angleM), cy - 14 * Math.cos(angleM)],
      ],
      0.45,
    );
  }
}
export function generatePages(options: WorksheetOptions): Page[] {
  if (options.kind in generators) {
    const pages = generateWorksheet({
      ...options,
      kind: options.kind as GeneratorOptions['kind'],
    });
    return options.showSolutions === false ? pages.slice(0, 1) : pages;
  }
  const p = newPage(),
    solution = newPage(),
    kind = options.kind,
    title = options.title || allGenerators[kind],
    max = Math.max(10, Math.min(10000, Math.round(options.maximum || 20))),
    next = seeded(options.seed),
    count = Math.max(4, Math.min(24, options.count || 12));
  heading(p, title);
  heading(solution, title + ' · Lösungen');
  const both = (fn: (p: Page) => void) => [p, solution].forEach(fn);
  const question = (question: string, answer: string, i: number, cols = 2) => {
    const x = 17 + (i % cols) * (180 / cols),
      y = 49 + Math.floor(i / cols) * (cols === 2 ? 18 : 14);
    text(p, question, x, y, 180 / cols - 4, 15);
    text(solution, answer, x, y, 180 / cols - 4, 15);
  };
  if (
    [
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'tenstep',
      'doubling',
      'neighbors',
      'comparison',
      'sequences',
      'numberwords',
      'placevalue',
      'moneychange',
      'moneyconvert',
      'moneycompare',
      'moneycalc',
      'shoppinglist',
      'clockwords',
      'clock24',
      'timespan',
      'earlierlater',
    ].includes(kind)
  )
    for (let i = 0; i < count; i++) {
      const a = 1 + next(max),
        b = 1 + next(Math.max(1, Math.min(10, max - a))),
        total = Math.min(max, a + b);
      let q = '',
        answer = '';
      if (kind === 'addition') {
        q = `${a} + ${total - a} = ____`;
        answer = `${a} + ${total - a} = ${total}`;
      }
      if (kind === 'subtraction') {
        q = `${total} − ${total - a} = ____`;
        answer = `${total} − ${total - a} = ${a}`;
      }
      if (kind === 'multiplication' || kind === 'division') {
        const f = 1 + next(10),
          g = 1 + next(Math.max(1, Math.min(10, Math.floor(max / f))));
        q =
          kind === 'multiplication'
            ? `${f} × ${g} = ____`
            : `${f * g} : ${f} = ____`;
        answer =
          kind === 'multiplication'
            ? `${f} × ${g} = ${f * g}`
            : `${f * g} : ${f} = ${g}`;
      }
      if (kind === 'tenstep') {
        const ceiling = Math.max(20, max),
          before =
            next(Math.max(1, Math.floor((ceiling - 10) / 10))) * 10 +
            7 +
            next(3),
          add =
            10 -
            (before % 10) +
            1 +
            next(Math.min(6, ceiling - before - (10 - (before % 10))));
        q = `${before} + ${add} = ____\n${before} + ___ + ___`;
        answer = `${before} + ${add} = ${before + add}\n${before} + ${10 - (before % 10)} + ${add - (10 - (before % 10))}`;
      }
      if (kind === 'doubling') {
        const half = Math.max(1, Math.floor(a / 2));
        q = i % 2 ? `${half * 2} : 2 = ____` : `${half} × 2 = ____`;
        answer =
          i % 2 ? `${half * 2} : 2 = ${half}` : `${half} × 2 = ${half * 2}`;
      }
      if (kind === 'neighbors') {
        q = `____  ${a}  ____`;
        answer = `${a - 1}  ${a}  ${a + 1}`;
      }
      if (kind === 'comparison') {
        q = `${a}  ○  ${b}`;
        answer = `${a} ${a === b ? '=' : a > b ? '>' : '<'} ${b}`;
      }
      if (kind === 'sequences') {
        const step = 1 + next(5),
          start = next(Math.max(1, max - step * 4));
        q = `${start}, ${start + step}, __, __, __`;
        answer = Array.from({ length: 5 }, (_, j) => start + j * step).join(
          ', ',
        );
      }
      if (kind === 'numberwords') {
        q = `${a}: ___________________`;
        answer = `${a}: ${numberWord(a)}`;
      }
      if (kind === 'placevalue') {
        q = `${a} = ___T ___H ___Z ___E`;
        answer = `${a} = ${Math.floor(a / 1000)}T ${Math.floor(a / 100) % 10}H ${Math.floor(a / 10) % 10}Z ${a % 10}E`;
      }
      if (kind === 'moneychange') {
        const cents = 10 + next(Math.min(4000, max * 100)),
          pay = Math.ceil(cents / 500) * 500;
        q = `${euro(pay)} − ${euro(cents)} = ____`;
        answer = `Rückgeld: ${euro(pay - cents)}`;
      }
      if (kind === 'moneyconvert') {
        const cents = 1 + next(Math.min(9999, max * 100));
        q = i % 2 ? `${cents} ct = ____ €` : `${euro(cents)} = ____ ct`;
        answer =
          i % 2
            ? `${cents} ct = ${euro(cents)}`
            : `${euro(cents)} = ${cents} ct`;
      }
      if (kind === 'moneycompare') {
        q = `${euro(a * 10)} ○ ${euro(b * 10)}`;
        answer = `${euro(a * 10)} ${a > b ? '>' : a < b ? '<' : '='} ${euro(b * 10)}`;
      }
      if (kind === 'moneycalc') {
        q = `${euro(a * 10)} + ${euro(b * 10)} = ____`;
        answer = `${euro((a + b) * 10)}`;
      }
      if (kind === 'shoppinglist') {
        const qty = 1 + next(5),
          price = 50 + next(350);
        q = `${qty} × ${euro(price)} = ____`;
        answer = `${qty} × ${euro(price)} = ${euro(qty * price)}`;
      }
      if (
        ['clockwords', 'clock24', 'timespan', 'earlierlater'].includes(kind)
      ) {
        const h = next(24),
          m = next(4) * 15,
          span = 15 + next(8) * 15,
          later = (h * 60 + m + span) % 1440,
          display = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        if (kind === 'clockwords') {
          const words =
            m === 0
              ? `${h % 12 || 12} Uhr`
              : m === 30
                ? `halb ${(h + 1) % 12 || 12}`
                : m === 15
                  ? `Viertel nach ${h % 12 || 12}`
                  : `Viertel vor ${(h + 1) % 12 || 12}`;
          q = `${words} = ____`;
          answer = `${words} = ${display}`;
        } else if (kind === 'clock24') {
          q = `${h % 12 || 12}:${String(m).padStart(2, '0')} nachmittags: ____`;
          const hh = (h % 12) + 12;
          answer = `${String(hh === 24 ? 12 : hh).padStart(2, '0')}:${String(m).padStart(2, '0')} Uhr`;
        } else {
          q =
            kind === 'timespan'
              ? `${display} – ${String(Math.floor(later / 60)).padStart(2, '0')}:${String(later % 60).padStart(2, '0')}: ____ Min.`
              : `${display} + ${span} Min. = ____`;
          answer =
            kind === 'timespan'
              ? `${span} Minuten`
              : `${String(Math.floor(later / 60)).padStart(2, '0')}:${String(later % 60).padStart(2, '0')} Uhr`;
        }
      }
      question(
        q,
        answer,
        i,
        kind === 'numberwords' ||
          kind === 'clockwords' ||
          kind === 'timespan' ||
          kind === 'earlierlater'
          ? 1
          : 2,
      );
    }
  else if (kind === 'tables') {
    both((page) => {
      for (let r = 0; r < 7; r++)
        for (let col = 0; col < 7; col++) {
          const x = 18 + col * 24,
            y = 50 + r * 24;
          box(page, x, y, 24, 24);
          if (r === 0 || col === 0)
            text(
              page,
              r === 0 && col === 0 ? '×' : String(r || col),
              x + 7,
              y + 5,
              20,
              17,
            );
          else if (page === solution)
            text(page, String(r * col), x + 6, y + 5, 20, 17);
        }
    });
  } else if (kind === 'writtenplus' || kind === 'writtenminus') {
    for (let i = 0; i < 8; i++) {
      const limit = Math.max(100, max);
      const a =
        kind === 'writtenplus' ? 10 + next(limit - 20) : 20 + next(limit - 19);
      const b =
        kind === 'writtenplus'
          ? 10 + next(Math.max(1, limit - a - 9))
          : 10 + next(Math.max(1, a - 9));
      const x = 20 + (i % 2) * 96,
        y = 50 + Math.floor(i / 2) * 53;
      both((page) => {
        text(
          page,
          `${a}\n${kind === 'writtenplus' ? '+' : '−'} ${b}`,
          x,
          y,
          65,
          21,
          '#2c4436',
          35,
        );
        line(page, [
          [x, y + 33],
          [x + 65, y + 33],
        ]);
        for (let k = 0; k < 5; k++) box(page, x + k * 12, y + 35, 12, 12);
      });
      text(
        solution,
        String(kind === 'writtenplus' ? a + b : a - b),
        x + 4,
        y + 35,
        60,
        21,
      );
    }
  } else if (
    ['counting', 'circling', 'hundred', 'moneycount', 'moneypay'].includes(kind)
  ) {
    for (let i = 0; i < 6; i++) {
      const x = 17 + (i % 2) * 94,
        y = 50 + Math.floor(i / 2) * 73,
        n = 1 + next(kind === 'hundred' ? 100 : 20);
      if (kind === 'hundred') {
        both((page) => {
          for (let k = 0; k < 100; k++)
            box(page, x + (k % 10) * 7, y + Math.floor(k / 10) * 5, 7, 5);
        });
        for (let k = 0; k < n; k++)
          circle(
            solution,
            x + (k % 10) * 7 + 3.5,
            y + Math.floor(k / 10) * 5 + 2.5,
            1,
            '',
          );
        text(p, `Markiere ${n}.`, x, y + 53, 85, 12);
      } else if (kind.startsWith('money')) {
        const amount = 50 + next(1500);
        if (kind === 'moneypay') {
          text(p, `Lege / zeichne ${euro(amount)}.`, x, y, 87, 12);
          text(solution, euro(amount), x, y, 87, 12);
        }
        let rest = amount;
        const coins = [200, 100, 50, 20, 10, 5, 2, 1];
        let k = 0;
        for (const coin of coins)
          while (rest >= coin && k < 18) {
            const cx = x + 8 + (k % 5) * 16,
              cy = y + 12 + Math.floor(k / 5) * 15;
            if (kind === 'moneycount')
              circle(p, cx, cy, 6, coin >= 100 ? `${coin / 100}€` : `${coin}`);
            circle(
              solution,
              cx,
              cy,
              6,
              coin >= 100 ? `${coin / 100}€` : `${coin}`,
            );
            rest -= coin;
            k++;
          }
        text(
          p,
          kind === 'moneycount' ? 'Betrag: ________' : '',
          x,
          y + 61,
          85,
          12,
        );
        text(solution, euro(amount), x, y + 61, 85, 12);
      } else {
        for (let k = 0; k < (kind === 'circling' ? 20 : n); k++)
          both((page) =>
            circle(
              page,
              x + 5 + (k % 5) * 14,
              y + 8 + Math.floor(k / 5) * 12,
              2.5,
              '',
            ),
          );
        text(
          p,
          kind === 'circling' ? `Kreise ${n} Punkte ein.` : 'Wie viele? ______',
          x,
          y + 57,
          86,
          12,
        );
        text(solution, `${n}`, x, y + 57, 86, 14);
        if (kind === 'circling')
          for (let k = 0; k < n; k++)
            solution.elements.push({
              id: uuid(),
              type: 'shape',
              shape: 'ellipse',
              x: x + 1 + (k % 5) * 14,
              y: y + 4 + Math.floor(k / 5) * 12,
              width: 8,
              height: 8,
              rotation: 0,
              locked: false,
              color: '#c25955',
              fill: '#ffffff',
              opacity: 0.45,
              strokeWidth: 0.6,
            });
      }
    }
  } else if (['walls', 'triangles', 'magic', 'sudoku'].includes(kind)) {
    for (let i = 0; i < 6; i++) {
      const x = 20 + (i % 2) * 96,
        y = 50 + Math.floor(i / 2) * 73;
      if (kind === 'walls') {
        const a = 1 + next(8),
          b = 1 + next(8),
          d = 1 + next(8),
          values = [a, b, d, a + b, b + d, a + 2 * b + d];
        [
          [0, 36],
          [23, 36],
          [46, 36],
          [11.5, 18],
          [34.5, 18],
          [23, 0],
        ].forEach(([dx, dy], k) =>
          both((page) => {
            box(page, x + dx, y + dy, 23, 18);
            if (page === solution || k < 3)
              text(page, String(values[k]), x + dx + 6, y + dy + 3, 20, 15);
          }),
        );
      } else if (kind === 'triangles') {
        const values = [1 + next(9), 1 + next(9), 1 + next(9)];
        both((page) =>
          line(page, [
            [x + 35, y],
            [x + 70, y + 55],
            [x, y + 55],
            [x + 35, y],
          ]),
        );
        [
          [35, 6],
          [9, 48],
          [60, 48],
        ].forEach(([dx, dy], k) =>
          both((page) =>
            text(page, String(values[k]), x + dx - 3, y + dy, 20, 16),
          ),
        );
        [
          [15, 22],
          [48, 22],
          [30, 58],
        ].forEach(([dx, dy], k) =>
          both((page) =>
            text(
              page,
              page === solution
                ? String(values[k] + values[(k + 1) % 3])
                : '____',
              x + dx,
              y + dy,
              30,
              14,
            ),
          ),
        );
      } else {
        const size = kind === 'sudoku' ? 4 : 3,
          puzzle = sudoku4(options.seed + i),
          offset = next(Math.max(1, max - 8)),
          source = [8, 1, 6, 3, 5, 7, 4, 9, 2],
          mirror = next(2),
          rotation = next(4),
          base = Array.from({ length: 9 }, (_, n) => {
            let row = Math.floor(n / 3),
              col = n % 3;
            if (mirror) col = 2 - col;
            for (let turn = 0; turn < rotation; turn++)
              [row, col] = [col, 2 - row];
            return source[row * 3 + col] + offset;
          });
        for (let n = 0; n < size * size; n++) {
          const value = kind === 'sudoku' ? puzzle.solution[n] : base[n];
          both((page) => {
            box(
              page,
              x + (n % size) * 15,
              y + Math.floor(n / size) * 15,
              15,
              15,
            );
            if (
              page === solution ||
              (kind === 'sudoku' ? puzzle.puzzle[n] > 0 : n % 3 === i % 3)
            )
              text(
                page,
                String(value),
                x + (n % size) * 15 + 4,
                y + Math.floor(n / size) * 15 + 2,
                14,
                16,
              );
          });
        }
      }
    }
  } else if (kind === 'clockdraw') {
    for (let i = 0; i < 6; i++) {
      const cx = 57 + (i % 2) * 94,
        cy = 79 + Math.floor(i / 2) * 73,
        h = next(12),
        m = next(4) * 15;
      clock(p, cx, cy, h, m, false);
      clock(solution, cx, cy, h, m);
      both((page) =>
        text(
          page,
          `${h || 12}:${String(m).padStart(2, '0')} Uhr`,
          cx - 20,
          cy + 23,
          55,
          14,
        ),
      );
    }
  } else if (kind === 'boats') {
    for (let i = 0; i < 6; i++) {
      const x = 18 + (i % 2) * 95,
        y = 53 + Math.floor(i / 2) * 72,
        n = 1 + next(Math.min(20, max));
      both((page) => {
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 5; col++) {
            const at = row * 5 + col;
            box(page, x + col * 14, y + row * 12, 14, 12);
            if (at < n) circle(page, x + col * 14 + 7, y + row * 12 + 6, 3, '');
          }
        }
        line(page, [
          [x - 4, y + 49],
          [x + 74, y + 49],
          [x + 63, y + 58],
          [x + 7, y + 58],
          [x - 4, y + 49],
        ]);
      });
      text(p, '___ Zehner + ___ Einer = ___', x - 2, y + 61, 90, 10);
      text(
        solution,
        `${Math.floor(n / 10)} Zehner + ${n % 10} Einer = ${n}`,
        x - 2,
        y + 61,
        90,
        10,
      );
    }
  } else if (kind.startsWith('note')) {
    const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'H'];
    const staff = (page: Page, x: number, y: number) => {
      for (let j = 0; j < 5; j++)
        line(
          page,
          [
            [x, y + j * 2],
            [x + 72, y + j * 2],
          ],
          0.2,
        );
      text(page, '𝄞', x, y - 3, 12, 28);
    };
    const note = (page: Page, x: number, y: number, n: number, value = 2) => {
      const cy = y + 10 - n;
      page.elements.push({
        id: uuid(),
        type: 'shape',
        shape: 'ellipse',
        x: x - 2,
        y: cy - 1,
        width: 4,
        height: 2.5,
        rotation: -20,
        locked: false,
        color: '#283f30',
        fill: value < 2 ? '#ffffff' : '#283f30',
        strokeWidth: 0.3,
      });
      if (n === 0)
        line(
          page,
          [
            [x - 4, cy],
            [x + 4, cy],
          ],
          0.25,
        );
      if (value > 0)
        line(
          page,
          [
            [x + 2, cy],
            [x + 2, cy - 12],
          ],
          0.35,
        );
      if (value === 3)
        line(
          page,
          [
            [x + 2, cy - 12],
            [x + 5, cy - 9],
            [x + 5, cy - 6],
          ],
          0.6,
        );
    };
    if (kind === 'notewords') {
      for (let i = 0; i < 6; i++) {
        const word = ['FEE', 'AFFE', 'DACH', 'FACH', 'CHEF', 'CAFE'][i],
          x = 22,
          y = 53 + i * 35;
        both((page) => {
          staff(page, x, y);
          for (let n = 0; n < word.length; n++)
            note(page, x + 17 + n * 12, y, noteNames.indexOf(word[n]));
        });
        text(p, 'Welches Wort? ______________', 110, y + 2, 85, 12);
        text(solution, word, 110, y + 2, 85, 14);
      }
    } else
      for (let i = 0; i < 12; i++) {
        const x = 20 + (i % 2) * 95,
          y = 52 + Math.floor(i / 2) * 36,
          n = next(7),
          value = kind === 'notevalues' ? i % 4 : 2;
        both((page) => staff(page, x, y));
        if (kind === 'notedraw') {
          both((page) => text(page, noteNames[n], x + 50, y + 12, 20, 14));
          note(solution, x + 30, y, n);
        } else both((page) => note(page, x + 30, y, n, value));
        text(
          p,
          kind === 'notedraw'
            ? 'Zeichne die Note.'
            : kind === 'notevalues'
              ? 'Notenwert: _____'
              : 'Name: _____',
          x,
          y + 16,
          75,
          12,
        );
        text(
          solution,
          kind === 'notevalues'
            ? [
                'Ganze · 4 Schläge',
                'Halbe · 2 Schläge',
                'Viertel · 1 Schlag',
                'Achtel · ½ Schlag',
              ][value]
            : noteNames[n],
          x,
          y + 16,
          75,
          11,
        );
      }
  } else if (kind === 'numberline') {
    for (let i = 0; i < 6; i++) {
      const y = 60 + i * 35;
      both((page) => {
        line(page, [
          [20, y],
          [190, y],
        ]);
        for (let n = 0; n <= 10; n++) {
          const x = 20 + n * 17;
          line(page, [
            [x, y - 2],
            [x, y + 2],
          ]);
          text(
            page,
            page === solution || n === 0 || n === 10
              ? String(Math.round((n * max) / 10))
              : '__',
            x - 3,
            y + 5,
            20,
            12,
          );
        }
      });
    }
  } else if (kind === 'patterns' || kind === 'tracing') {
    for (let row = 0; row < 13; row++) {
      const y = 50 + row * 17,
        mode = (row + (options.seed % 13)) % 13;
      both((page) =>
        line(
          page,
          [
            [18, y + 13],
            [192, y + 13],
          ],
          0.15,
          '#c6d5dd',
        ),
      );
      const points: number[][] = [];
      for (let i = 0; i <= 360; i++) {
        const x = 18 + (i / 360) * 174,
          t = (i / 360) * 12 * Math.PI,
          u = (i % 60) / 60;
        let px = x,
          py = y + 7;
        if (mode === 0) py += Math.sin(t) * 5;
        if (mode === 1) py += (2 / Math.PI) * Math.asin(Math.sin(t)) * 5;
        if (mode === 2) py += Math.abs(Math.sin(t)) * 6 - 3;
        if (mode === 3) py += u < 0.5 ? -5 : 5;
        if (mode === 4) {
          px = 18 + Math.floor(i / 60) * 29 + 14 + Math.cos(t) * 10;
          py += Math.sin(t) * 6;
        }
        if (mode === 5) {
          px = x + Math.sin(t) * 4;
          py += Math.cos(t) * 6;
        }
        if (mode === 6) py += Math.floor(u * 4) * 3 - 5;
        if (mode === 7) py += (u * 2 - 1) * 5;
        if (mode === 8)
          py += 5 - Math.sqrt(Math.max(0, 1 - (u * 2 - 1) ** 2)) * 10;
        if (mode === 9) {
          px = x + Math.sin(t) * 6;
          py += Math.sin(t * 2) * 5;
        }
        if (mode === 10) py += Math.sin(t) * Math.cos(t / 2) * 6;
        if (mode === 11) {
          px = x + Math.cos(t) * 4;
          py += Math.sin(t) * 4;
        }
        if (mode === 12)
          py += Math.sin(t) > 0 ? Math.sin(t) * 5 : -Math.sin(t) * 2;
        points.push([px, py]);
      }
      line(p, points, 0.45, '#c6ceca');
      line(solution, points, 0.5, '#617e58');
    }
  } else if (kind === 'mazes') {
    const rows = 12,
      cols = 10,
      stack = [0],
      visited = new Set([0]),
      walls = Array.from({ length: rows * cols }, () => [
        true,
        true,
        true,
        true,
      ]);
    while (stack.length) {
      const at = stack[stack.length - 1],
        r = Math.floor(at / cols),
        col = at % cols,
        candidates = [
          r > 0 ? at - cols : -1,
          col < cols - 1 ? at + 1 : -1,
          r < rows - 1 ? at + cols : -1,
          col > 0 ? at - 1 : -1,
        ]
          .map((cell, d) => ({ cell, d }))
          .filter((o) => o.cell >= 0 && !visited.has(o.cell));
      if (!candidates.length) {
        stack.pop();
        continue;
      }
      const o = candidates[next(candidates.length)];
      walls[at][o.d] = false;
      walls[o.cell][(o.d + 2) % 4] = false;
      visited.add(o.cell);
      stack.push(o.cell);
    }
    both((page) =>
      walls.forEach((cell, i) => {
        const x = 20 + (i % cols) * 17,
          y = 55 + Math.floor(i / cols) * 17;
        cell.forEach((wall, d) => {
          if (wall)
            line(page, [
              [x + [0, 17, 0, 0][d], y + [0, 0, 17, 0][d]],
              [x + [17, 17, 17, 0][d], y + [0, 17, 17, 17][d]],
            ]);
        });
      }),
    );
    both((page) => {
      text(page, 'Start', 20, 45, 50, 13);
      text(page, 'Ziel', 168, 260, 30, 13);
    });
    const parents = new Map([[0, -1]]),
      queue = [0];
    while (queue.length) {
      const at = queue.shift()!;
      walls[at].forEach((wall, d) => {
        if (wall) return;
        const to = at + [-cols, 1, cols, -1][d];
        if (!parents.has(to)) {
          parents.set(to, at);
          queue.push(to);
        }
      });
    }
    const route: number[] = [];
    for (let at = rows * cols - 1; at >= 0; at = parents.get(at) ?? -1)
      route.push(at);
    line(
      solution,
      route
        .reverse()
        .map((at) => [
          28.5 + (at % cols) * 17,
          63.5 + Math.floor(at / cols) * 17,
        ]),
      1,
      '#c6655a',
    );
  }
  return options.showSolutions === false ? [p] : [p, solution];
}
