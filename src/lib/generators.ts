import { uuid, compactStroke, newPage, type Page } from './notebook-model';
export type GeneratorKind =
  'zahlenhaus' | 'rechnen' | 'uhr' | 'nachspuren' | 'silben' | 'wortsuche';
export const generators: Record<GeneratorKind, string> = {
  zahlenhaus: 'Zahlenhäuser',
  rechnen: 'Rechenaufgaben',
  uhr: 'Uhrzeiten',
  nachspuren: 'Buchstaben & Ziffern nachspuren',
  silben: 'Silben rot / blau',
  wortsuche: 'Wörtersuchrätsel',
};
export type GeneratorOptions = {
  kind: GeneratorKind;
  title: string;
  words: string;
  maximum: number;
  seed: number;
};
function text(
  page: Page,
  value: string,
  x: number,
  y: number,
  width = 175,
  fontSize = 18,
  color = '#253c42',
) {
  page.elements.push({
    id: uuid(),
    type: 'text',
    x,
    y,
    width,
    height: fontSize * 0.7 + value.split('\n').length * 6,
    rotation: 0,
    locked: false,
    color,
    text: value,
    font: 'Andika',
    fontSize,
  });
}
function line(page: Page, points: number[][], width = 0.35, color = '#718779') {
  page.elements.push({
    id: uuid(),
    type: 'stroke',
    x: 0,
    y: 0,
    width: 210,
    height: 297,
    rotation: 0,
    locked: false,
    color,
    points: points.map(([x, y]) => ({ x, y, pressure: 0.5 })),
    penWidth: width,
    opacity: 1,
  });
}
function box(page: Page, x: number, y: number, w: number, h: number) {
  line(page, [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
    [x, y],
  ]);
}
function heading(page: Page, title: string) {
  text(page, title, 17, 12, 176, 23);
  text(
    page,
    'Name: ____________________    Datum: __________',
    17,
    29,
    180,
    11,
  );
}
export function generateWorksheet(options: GeneratorOptions): Page[] {
  const page = newPage();
  const solution = newPage();
  heading(page, options.title || generators[options.kind]);
  heading(solution, `${options.title || generators[options.kind]} · Lösungen`);
  let seed = options.seed >>> 0;
  const random = (max: number) => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed % max;
  };
  const maximum = Math.max(5, Math.min(100, Math.round(options.maximum || 20)));
  const words = options.words
    .split(/[,\n]+/)
    .map((w) => w.trim().slice(0, 24))
    .filter(Boolean)
    .slice(0, 15);
  if (options.kind === 'zahlenhaus') {
    for (let n = 0; n < 6; n++) {
      const x = 18 + (n % 2) * 92,
        y = 60 + Math.floor(n / 2) * 72,
        total = Math.min(maximum, 5 + random(maximum - 4));
      for (const p of [page, solution]) {
        line(p, [
          [x, y],
          [x + 34, y - 15],
          [x + 68, y],
          [x, y],
          [x, y + 44],
          [x + 68, y + 44],
          [x + 68, y],
        ]);
        line(p, [
          [x + 34, y],
          [x + 34, y + 44],
        ]);
        text(p, String(total), x + 27, y - 13, 20, 18);
      }
      for (let row = 0; row < 3; row++) {
        const a = random(total + 1);
        for (const p of [page, solution]) {
          line(p, [
            [x, y + (row + 1) * 14.6],
            [x + 68, y + (row + 1) * 14.6],
          ]);
          text(p, String(a), x + 11, y + row * 14.6 + 1, 25, 19);
        }
        text(solution, String(total - a), x + 44, y + row * 14.6 + 1, 25, 19);
      }
    }
  } else if (options.kind === 'rechnen') {
    for (let n = 0; n < 24; n++) {
      const x = 18 + (n % 2) * 94,
        y = 52 + Math.floor(n / 2) * 18;
      const a = random(maximum + 1),
        b = random(maximum - a + 1);
      const subtract = n % 3 === 0;
      const expression = subtract ? `${a + b} − ${a}` : `${a} + ${b}`;
      text(page, `${expression} = _____`, x, y, 90, 18);
      text(solution, `${expression} = ${subtract ? b : a + b}`, x, y, 90, 18);
    }
  } else if (options.kind === 'uhr') {
    for (let n = 0; n < 6; n++) {
      const cx = 57 + (n % 2) * 94,
        cy = 83 + Math.floor(n / 2) * 73;
      const hour = 1 + random(12),
        minute = random(4) * 15;
      for (const p of [page, solution]) {
        line(
          p,
          Array.from({ length: 65 }, (_, i) => [
            cx + 22 * Math.sin((i / 64) * Math.PI * 2),
            cy - 22 * Math.cos((i / 64) * Math.PI * 2),
          ]),
        );
        for (let h = 1; h <= 12; h++) {
          const a = (h / 12) * Math.PI * 2;
          text(
            p,
            String(h),
            cx + 18 * Math.sin(a) - 2.5,
            cy - 18 * Math.cos(a) - 3.5,
            9,
            10,
          );
        }
        for (const [angle, length, width] of [
          [((hour + minute / 60) / 12) * Math.PI * 2, 11, 0.8],
          [(minute / 60) * Math.PI * 2, 16, 0.5],
        ])
          line(
            p,
            [
              [cx, cy],
              [cx + length * Math.sin(angle), cy - length * Math.cos(angle)],
            ],
            width,
          );
      }
      text(page, '____ : ____', cx - 20, cy + 25, 55, 16);
      text(
        solution,
        `${hour}:${String(minute).padStart(2, '0')} Uhr`,
        cx - 20,
        cy + 25,
        55,
        16,
      );
    }
  } else if (options.kind === 'nachspuren') {
    const content = (words.length ? words : ['Aa', 'Bb', 'Cc', '1 2 3']).slice(
      0,
      9,
    );
    content.forEach((word, i) => {
      const y = 52 + i * 25;
      line(
        page,
        [
          [17, y + 15],
          [193, y + 15],
        ],
        0.2,
        '#a9c0d0',
      );
      text(
        page,
        Array.from(
          { length: Math.max(1, Math.floor(28 / word.length)) },
          () => word,
        ).join('   '),
        17,
        y,
        176,
        26,
        '#bfc6c4',
      );
    });
  } else if (options.kind === 'silben') {
    const content = words.length
      ? words
      : ['Son-ne', 'Blu-me', 'Scho-ko-la-de', 'Re-gen-bo-gen', 'Le-sen'];
    content.slice(0, 12).forEach((word, i) => {
      let x = 20;
      word.split('-').forEach((syllable, index) => {
        text(
          page,
          syllable,
          x,
          51 + i * 18,
          175 - x,
          24,
          index % 2 ? '#356ea3' : '#ba3d4b',
        );
        x += Math.max(7, syllable.length * 5);
      });
    });
  } else {
    const content = (
      words.length ? words : ['SONNE', 'BLUME', 'HEFT', 'SCHULE', 'BUCH']
    )
      .map((w) => w.toLocaleUpperCase('de').replace(/[^A-ZÄÖÜ]/g, ''))
      .filter((w) => w.length > 1 && w.length <= 12)
      .slice(0, 12);
    const grid = Array.from({ length: 12 }, () =>
      Array.from({ length: 12 }, () => String.fromCharCode(65 + random(26))),
    );
    const placed: {
      word: string;
      row: number;
      column: number;
      vertical: boolean;
    }[] = [];
    for (const word of content) {
      for (let attempt = 0; attempt < 100; attempt++) {
        const vertical = !!random(2);
        const row = random(vertical ? 13 - word.length : 12),
          column = random(vertical ? 12 : 13 - word.length);
        if (
          placed.some((p) =>
            Array.from(
              { length: p.word.length },
              (_, i) =>
                `${p.row + (p.vertical ? i : 0)},${p.column + (p.vertical ? 0 : i)}`,
            ).some((cell) =>
              Array.from(
                { length: word.length },
                (_, i) =>
                  `${row + (vertical ? i : 0)},${column + (vertical ? 0 : i)}`,
              ).includes(cell),
            ),
          )
        )
          continue;
        Array.from(word).forEach(
          (char, i) =>
            (grid[row + (vertical ? i : 0)][column + (vertical ? 0 : i)] =
              char),
        );
        placed.push({ word, row, column, vertical });
        break;
      }
    }
    for (const p of [page, solution])
      for (let row = 0; row < 12; row++)
        for (let col = 0; col < 12; col++) {
          const x = 21 + col * 14,
            y = 52 + row * 14;
          box(p, x, y, 14, 14);
          const highlighted =
            p === solution &&
            placed.some((w) =>
              Array.from({ length: w.word.length }, (_, i) => [
                w.row + (w.vertical ? i : 0),
                w.column + (w.vertical ? 0 : i),
              ]).some(([r, c]) => r === row && c === col),
            );
          text(
            p,
            grid[row][col],
            x + 3.5,
            y + 1.5,
            10,
            17,
            highlighted ? '#bd3947' : '#253c42',
          );
        }
    text(
      page,
      `Finde: ${placed.map((p) => p.word).join(' · ')}`,
      21,
      228,
      170,
      13,
    );
    text(
      solution,
      placed
        .map(
          (p) =>
            `${p.word}: Zeile ${p.row + 1}, Spalte ${p.column + 1}, ${p.vertical ? 'senkrecht' : 'waagerecht'}`,
        )
        .join('\n'),
      21,
      228,
      170,
      9,
    );
  }
  page.elements = page.elements.map(compactStroke);
  solution.elements = solution.elements.map(compactStroke);
  return ['zahlenhaus', 'rechnen', 'uhr', 'wortsuche'].includes(options.kind)
    ? [page, solution]
    : [page];
}
export function starterTemplates(): {
  title: string;
  category: string;
  page: Page;
}[] {
  const profile = newPage();
  heading(profile, 'Das bin ich');
  box(profile, 135, 50, 55, 65);
  text(
    profile,
    'Mein Name: ___________________\n\nDas mag ich: __________________\n\nMeine Lieblingsfarbe: __________\n\nDas kann ich gut: ______________',
    18,
    53,
    115,
    14,
  );
  text(profile, 'Hier male ich mich und meine Welt:', 18, 135, 175, 14);
  box(profile, 18, 153, 172, 122);
  const story = newPage('linie4');
  heading(story, 'Meine Bildergeschichte');
  for (let i = 0; i < 3; i++) box(story, 18, 48 + i * 74, 172, 40);
  const timetable = newPage('blanko', 'landscape');
  text(timetable, 'Mein Stundenplan', 17, 12, 250, 24);
  ['Zeit', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'].forEach(
    (day, i) => text(timetable, day, 17 + i * 44, 36, 43, 12),
  );
  for (let row = 0; row < 7; row++)
    for (let col = 0; col < 6; col++) {
      const x = 15 + col * 44,
        y = 48 + row * 20;
      timetable.elements.push({
        id: uuid(),
        type: 'stroke',
        x: 0,
        y: 0,
        width: 297,
        height: 210,
        rotation: 0,
        locked: false,
        color: '#82957f',
        penWidth: 0.25,
        opacity: 1,
        points: [
          [x, y],
          [x + 44, y],
          [x + 44, y + 20],
          [x, y + 20],
          [x, y],
        ].map(([x, y]) => ({ x, y, pressure: 0.5 })),
      });
    }
  for (const p of [profile, story, timetable])
    p.elements = p.elements.map(compactStroke);
  return [
    {
      title: 'Steckbrief · Das bin ich',
      category: 'Kennenlernen',
      page: profile,
    },
    { title: 'Bildergeschichte', category: 'Deutsch', page: story },
    { title: 'Stundenplan', category: 'Organisation', page: timetable },
  ];
}
