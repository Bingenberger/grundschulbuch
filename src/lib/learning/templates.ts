import {
  compactStroke,
  newPage,
  uuid,
  type Page,
  type Ruling,
} from '../notebook-model';
import {
  activityCatalog,
  defaultSettings,
  widgetCatalog,
  type ActivityKind,
  type WidgetKind,
} from './catalog';
export type Blueprint = {
  id: string;
  title: string;
  category: string;
  layout: string;
  columns?: number;
  rows?: number;
  ruling?: Ruling;
  widget?: WidgetKind;
  activity?: ActivityKind;
  mode?: string;
  instrument?: string;
  words?: string[];
};
const layouts: Blueprint[] = [];
function add(
  category: string,
  layout: string,
  titles: string[],
  columns?: number,
  rows?: number,
) {
  titles.forEach((title, i) =>
    layouts.push({
      id: `${layout}-${layouts.length}-${i}`,
      title,
      category,
      layout,
      columns,
      rows,
    }),
  );
}
add(
  'Schreiben',
  'writing',
  [
    'Vier Bilder und Schreibzeilen',
    'Wörter mit Bildern üben',
    'Mein Bilderbuch',
    'Buchstabenzeilen',
  ],
  2,
  2,
);
add('Gestalten', 'cover', ['Titelseite']);
add('Gestalten', 'diary', ['Tagebuch', 'Lerntagebuch']);
add('Gestalten', 'newspaper', ['Zeitung']);
add('Gestalten', 'gallery', ['Fotoseite', 'Bildersammlung'], 3, 2);
add('Gestalten', 'profile', ['Steckbrief']);
add('Gestalten', 'mindmap', ['Mindmap']);
add('Comic & Film', 'comic', ['Comic: sechs Bilder'], 2, 3);
add('Comic & Film', 'comic', ['Comic: vier Bilder'], 2, 2);
add('Comic & Film', 'comic', ['Comic: drei Bilder'], 1, 3);
add('Comic & Film', 'comic', ['Comic: neun Bilder'], 3, 3);
add('Comic & Film', 'comic', ['Comic: zwei Bilder'], 1, 2);
add('Comic & Film', 'storyboard', ['Storyboard'], 2, 3);
add('Comic & Film', 'screenplay', ['Drehbuch']);
add('Alltag', 'letter', ['Brief', 'Postkarte', 'Einladung']);
add('Alltag', 'certificate', ['Urkunde']);
add('Alltag', 'sections', [
  'Lebenslauf',
  'Experiment',
  'Speisekarte',
  'Veranstaltungsprogramm',
  'Rezept',
  'Tagesplan',
]);
add('Wohnen', 'room', [
  'Zimmer einrichten',
  'Kinderzimmer',
  'Küche einrichten',
]);
add('Präsentation', 'slide-title', ['Titelfolie', 'Kapitelanfang']);
add('Präsentation', 'slide-text', [
  'Titel und Text',
  'Zitat',
  'Zusammenfassung',
]);
add('Präsentation', 'slide-columns', ['Zwei Spalten', 'Vergleich'], 2, 1);
add('Präsentation', 'slide-columns', ['Drei Spalten'], 3, 1);
add('Präsentation', 'slide-picture', [
  'Großes Bild',
  'Bild und Text',
  'Teamvorstellung',
]);
add('Präsentation', 'slide-table', ['Tabelle', 'Zeitstrahl']);
add('Musik', 'music-lines', [
  'Notenpapier',
  'Rhythmusblatt',
  'Liederheft',
  'Klanggeschichte',
]);
const themeWords: Record<string, string[]> = {
  'Erste Wörter': [
    'ich',
    'du',
    'ja',
    'nein',
    'bitte',
    'danke',
    'mehr',
    'fertig',
  ],
  'Ich brauche': [
    'trinken',
    'essen',
    'Pause',
    'helfen',
    'Toilette',
    'Ruhe',
    'Bewegung',
    'Wasser',
  ],
  Gefühle: [
    'fröhlich',
    'traurig',
    'müde',
    'wütend',
    'ängstlich',
    'ruhig',
    'stolz',
    'überrascht',
  ],
  Schule: [
    'lesen',
    'schreiben',
    'rechnen',
    'malen',
    'Musik',
    'Sport',
    'Pause',
    'fertig',
  ],
  Familie: [
    'Mama',
    'Papa',
    'Kind',
    'Oma',
    'Opa',
    'Bruder',
    'Schwester',
    'Familie',
  ],
  Freizeit: [
    'spielen',
    'bauen',
    'schwimmen',
    'tanzen',
    'singen',
    'Buch',
    'Ball',
    'Freunde',
  ],
  'Essen und Trinken': [
    'Brot',
    'Apfel',
    'Milch',
    'Wasser',
    'Suppe',
    'Banane',
    'Käse',
    'Tee',
  ],
  Kernwörter: [
    'ich',
    'du',
    'wir',
    'möchte',
    'kann',
    'nicht',
    'hier',
    'dort',
    'mehr',
    'gut',
    'noch',
    'fertig',
  ],
  Gespräch: ['wer', 'was', 'wo', 'wann', 'warum', 'wie', 'ja', 'nein'],
  Orte: [
    'Schule',
    'Haus',
    'Park',
    'Spielplatz',
    'Geschäft',
    'Bahnhof',
    'Wald',
    'See',
  ],
};
for (const [title, words] of Object.entries(themeWords))
  layouts.push({
    id: `talk-${layouts.length}`,
    title: `Kommunikation · ${title}`,
    category: 'Kommunikation',
    layout: 'widget',
    widget: 'communication',
    words,
  });
for (const fields of [2, 4, 6, 9, 12, 20])
  layouts.push({
    id: `talk-fields-${fields}`,
    title: `Kommunikation · ${fields} Felder`,
    category: 'Kommunikation',
    layout: 'widget',
    widget: 'communication',
    columns: fields <= 4 ? 2 : fields <= 12 ? 3 : 5,
    rows: Math.ceil(fields / (fields <= 4 ? 2 : fields <= 12 ? 3 : 5)),
  });
layouts.push({
  id: 'talk-strip',
  title: 'Kommunikation · Satzleiste und 15 Felder',
  category: 'Kommunikation',
  layout: 'widget',
  widget: 'communication',
  columns: 5,
  rows: 3,
});
layouts.push({
  id: 'communication-book',
  title: 'Kommunikationsbuch mit allen Tafeln',
  category: 'Kommunikation',
  layout: 'communication-book',
});
for (const [kind, [title, category]] of Object.entries(widgetCatalog))
  layouts.push({
    id: `widget-${kind}`,
    title,
    category,
    layout: 'widget',
    widget: kind as WidgetKind,
  });
for (const [kind, title] of Object.entries(activityCatalog))
  layouts.push({
    id: `activity-${kind}`,
    title,
    category: 'Interaktive Übungen',
    layout: 'activity',
    activity: kind as ActivityKind,
  });
for (const [instrument, title] of [
  ['piano', 'Klavier'],
  ['xylophone', 'Xylophon'],
  ['marimba', 'Marimba'],
  ['glockenspiel', 'Glockenspiel'],
  ['musicbox', 'Spieluhr'],
  ['organ', 'Orgel'],
  ['synth', 'Synthesizer'],
  ['flute', 'Flöte'],
  ['tube', 'Klangrohre'],
])
  layouts.push({
    id: `instrument-${instrument}`,
    title,
    category: 'Musik',
    layout: 'widget',
    widget: 'piano',
    instrument,
  });
for (const [mode, title] of [
  ['cajon', 'Cajón'],
  ['hand', 'Bongos und Congas'],
  ['orff', 'Orff-Percussion'],
  ['pads', 'Klang-Pads'],
])
  layouts.push({
    id: `drum-${mode}`,
    title,
    category: 'Musik',
    layout: 'widget',
    widget: 'drums',
    mode,
  });
for (const [mode, title] of [
  ['beads', 'Zwanzigerfeld'],
  ['place', 'Stellenwerttafel'],
  ['numberline', 'Zahlenstrahl'],
])
  layouts.push({
    id: `math-${mode}`,
    title,
    category: 'Mathe',
    layout: 'widget',
    widget: 'mathboard',
    mode,
  });
export const blueprints = layouts;
function text(
  page: Page,
  value: string,
  x: number,
  y: number,
  width: number,
  height = 20,
  fontSize = 16,
  color = '#2e4a3b',
) {
  page.elements.push({
    id: uuid(),
    type: 'text',
    text: value,
    font: 'Andika',
    fontSize,
    color,
    x,
    y,
    width,
    height,
    rotation: 0,
    locked: false,
  });
}
function shape(
  page: Page,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = '#ffffff',
  kind = 'rect',
) {
  page.elements.push({
    id: uuid(),
    type: 'shape',
    shape: kind,
    x,
    y,
    width,
    height,
    rotation: 0,
    locked: false,
    color: '#a0b299',
    fill,
    strokeWidth: 0.3,
  });
}
function placeholder(
  page: Page,
  x: number,
  y: number,
  width: number,
  height: number,
  label = 'Bild oder Zeichnung',
) {
  shape(page, x, y, width, height, '#f5f7ef');
  text(page, label, x + 3, y + height / 2 - 4, width - 6, 15, 10, '#819177');
}
function title(page: Page, value: string) {
  text(
    page,
    value,
    15,
    12,
    page.orientation === 'landscape' ? 267 : 180,
    22,
    24,
  );
}
/**
 * Pages of a template, laid out for the chosen format (landscape by default):
 * all positions follow the page size, so every template fits both formats.
 */
export function blueprintPages(meta: Blueprint, orientation: Page['orientation'] = 'landscape'): Page[] {
  if (meta.layout === 'communication-book')
    return Object.entries(themeWords).flatMap(([name, words]) =>
      blueprintPages(
        {
          id: 'part',
          title: name,
          category: 'Kommunikation',
          layout: 'widget',
          widget: 'communication',
          words,
        },
        orientation,
      ),
    );
  const page = newPage(meta.ruling || 'blanko', orientation);
  const width = orientation === 'landscape' ? 297 : 210;
  const height = orientation === 'landscape' ? 210 : 297;
  const wide = orientation === 'landscape';
  // Content area below the title.
  const L = 15, T = 42, R = width - 15, B = height - 12;
  const AW = R - L, AH = B - T;
  if (meta.widget || meta.activity) {
    const kind = meta.widget || meta.activity!,
      settings = defaultSettings(kind);
    settings.title = meta.title;
    if (meta.instrument) settings.instrument = meta.instrument;
    if (meta.mode) settings.mode = meta.mode;
    if (meta.columns) settings.columns = meta.columns;
    if (meta.widget === 'communication') {
      const count = meta.rows && meta.columns ? meta.rows * meta.columns : 12;
      settings.cells = (
        meta.words || Array.from({ length: count }, (_, i) => `Feld ${i + 1}`)
      ).map((label) => ({ label }));
    }
    page.elements.push({
      id: uuid(),
      type: meta.widget ? 'widget' : 'activity',
      widgetKind: meta.widget,
      activityKind: meta.activity,
      settings,
      x: 12,
      y: 15,
      width: width - 24,
      height: height - 30,
      rotation: 0,
      locked: false,
      color: '#253c42',
    });
    return [page];
  }
  title(page, meta.title);
  if (['comic', 'gallery', 'storyboard', 'slide-columns'].includes(meta.layout)) {
    // In landscape, columns and rows swap for portrait-shaped grids (e.g. comics).
    let columns = meta.columns || 2,
      rows = meta.rows || 2;
    if (wide && rows > columns && meta.layout !== 'slide-columns') [columns, rows] = [rows, columns];
    const w = (AW - (columns - 1) * 5) / columns,
      h = (AH - (rows - 1) * 5) / rows;
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < columns; col++) {
        const x = L + col * (w + 5),
          y = T + row * (h + 5);
        placeholder(
          page,
          x,
          y,
          w,
          h - (meta.layout === 'storyboard' ? 20 : 0),
          meta.layout === 'comic' ? '' : `Bild ${row * columns + col + 1}`,
        );
        if (meta.layout === 'storyboard') text(page, 'Bild / Handlung / Ton', x, y + h - 17, w, 16, 10);
      }
  } else if (meta.layout === 'writing') {
    const columns = wide ? 4 : 2, rows = wide ? 1 : 2;
    const w = (AW - (columns - 1) * 8) / columns, h = (AH - (rows - 1) * 8) / rows;
    for (let i = 0; i < columns * rows; i++) {
      const x = L + (i % columns) * (w + 8),
        y = T + Math.floor(i / columns) * (h + 8);
      const picture = h * 0.5;
      placeholder(page, x, y, w, picture);
      const lines = Math.max(2, Math.floor((h - picture - 8) / 10));
      for (let j = 0; j < lines; j++) shape(page, x, y + picture + 10 + j * 10, w, 0.1, '#a0b299');
    }
  } else if (meta.layout === 'profile') {
    const pictureW = Math.min(70, AW * 0.32), top = AH * (wide ? 0.5 : 0.42);
    placeholder(page, R - pictureW, T, pictureW, top - 5, 'Mein Bild');
    text(
      page,
      'Mein Name: __________________\n\nDas mag ich: __________________\n\nMeine Lieblingsfarbe: __________\n\nDas kann ich gut: ______________',
      L,
      T + 3,
      AW - pictureW - 10,
      top - 5,
      14,
    );
    placeholder(page, L, T + top + 5, AW, AH - top - 5, 'Hier ist Platz für meine Welt.');
  } else if (meta.layout === 'mindmap') {
    const cx = width / 2, cy = T + AH / 2;
    shape(page, cx - 30, cy - 15, 60, 30, '#e5eedb', 'ellipse');
    text(page, 'Mein Thema', cx - 25, cy - 8, 50, 20, 14);
    [
      [L, T],
      [R - 60, T],
      [L, B - 30],
      [R - 60, B - 30],
    ].forEach(([x, y], i) => {
      page.elements.push(
        compactStroke({
          id: uuid(),
          type: 'stroke',
          x: 0,
          y: 0,
          width,
          height,
          rotation: 0,
          locked: false,
          color: '#89a17b',
          points: [
            { x: cx, y: cy, pressure: 0.5 },
            { x: x + 30, y: y + 15, pressure: 0.5 },
          ],
          penWidth: 0.5,
          opacity: 1,
        }),
      );
      shape(page, x, y, 60, 30, '#f3f6ec', 'rounded');
      text(page, `Idee ${i + 1}`, x + 5, y + 6, 50, 18, 14);
    });
  } else if (meta.layout === 'newspaper') {
    const main = AW * 0.6;
    text(page, 'Die Nachrichten unserer Klasse', L, T - 2, AW, 25, 19);
    placeholder(page, L, T + 28, main, AH * 0.42, 'Unser Titelbild');
    text(page, 'Die wichtigste Nachricht\n\nHier beginnt unser Bericht.', L, T + 33 + AH * 0.42, main, AH * 0.58 - 35, 14);
    text(page, 'Weitere Nachrichten\n\nWas gibt es Neues?', L + main + 10, T + 28, AW - main - 10, AH - 30, 13);
  } else if (meta.layout === 'room') {
    shape(page, L, T, AW, AH - 18, '#f5f2e9');
    shape(page, L + 10, T + 12, 50, 80, '#c8d7e7', 'rounded');
    text(page, 'Bett', L + 17, T + 42, 35, 15, 12);
    shape(page, R - 85, T + 12, 65, 35, '#dfc8ac');
    text(page, 'Tisch', R - 72, T + 21, 42, 15, 12);
    shape(page, R - 80, T + 55, 25, 25, '#c8d8b2', 'ellipse');
    shape(page, R - 50, T + 55, 25, 25, '#c8d8b2', 'ellipse');
    shape(page, wide ? L + 75 : L + 10, wide ? T + 12 : B - 95, 55, 65, '#dfc8ac');
    text(page, 'Schrank', wide ? L + 80 : L + 15, wide ? T + 37 : B - 70, 45, 15, 12);
    text(page, 'Verschiebe die Möbel und gestalte deinen Raum.', L, B - 14, AW, 15, 10);
  } else if (meta.layout === 'cover' || meta.layout === 'slide-title') {
    page.paperColor = '#edf2e3';
    text(page, 'Hier steht dein Titel', 25, height * 0.3, width - 50, 50, 32);
    text(page, 'Name / Klasse / Thema', 25, height * 0.72, width - 50, 25, 16);
  } else if (meta.layout === 'certificate') {
    page.pageFrame = 'certificate';
    const cx = width / 2;
    text(page, 'für __________________________', cx - 85, T + 15, 170, 25, 20);
    text(page, 'Du hast etwas Besonderes geschafft!', cx - 90, T + AH * 0.28, 180, 35, 20);
    shape(page, cx - 20, T + AH * 0.5, 40, 40, '#e8c66b', 'star');
    text(page, 'Datum: __________  Unterschrift: __________', cx - 85, B - 30, 170, 25, 12);
  } else if (meta.layout === 'letter') {
    text(page, 'Liebe / Lieber __________________,\n\n\n\n\n\n\n\nViele Grüße\n__________________', L + 5, T + 10, AW - 10, AH - 10, 17);
  } else if (meta.layout === 'diary') {
    text(
      page,
      'Datum: __________________\n\nDas habe ich erlebt / gelernt:\n\n\n\nDas war schwierig:\n\n\n\nDarauf freue ich mich:',
      L + 5,
      T + 3,
      AW - 10,
      AH - 3,
      15,
    );
  } else if (meta.layout === 'slide-picture') {
    if (wide) {
      placeholder(page, L, T, AW * 0.6, AH - 10);
      text(page, 'Bildunterschrift und Gedanken', L + AW * 0.6 + 10, T + 5, AW * 0.4 - 10, AH - 20, 17);
    } else {
      placeholder(page, L, T, AW, AH * 0.6);
      text(page, 'Bildunterschrift und Gedanken', L, T + AH * 0.6 + 10, AW, AH * 0.4 - 10, 17);
    }
  } else if (meta.layout === 'slide-table') {
    const rows = 5, cols = 3, w = AW / cols, h = Math.min(28, AH / rows);
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < cols; col++) {
        shape(page, L + col * w, T + row * h, w, h, row === 0 ? '#e0ebd3' : '#ffffff');
        text(page, row === 0 ? `Spalte ${col + 1}` : '', L + 3 + col * w, T + 5 + row * h, w - 6, Math.min(20, h - 4), 13);
      }
  } else if (meta.layout === 'music-lines') {
    page.ruling = 'noten';
    text(page, 'Name: __________________   Datum: __________', L, 35, AW, 15, 11);
  } else if (meta.layout === 'slide-text') {
    text(page, 'Deine wichtigste Aussage\n\n• Erster Gedanke\n• Zweiter Gedanke\n• Dritter Gedanke', 20, T + 8, width - 40, AH - 20, 21);
  } else {
    const sections =
      meta.layout === 'screenplay'
        ? ['Szene', 'Handlung', 'Dialog / Ton']
        : meta.title === 'Rezept'
          ? ['Zutaten', 'Zubereitung', 'Mein Tipp']
          : meta.title === 'Experiment'
            ? ['Meine Frage', 'Material', 'So gehe ich vor', 'Das beobachte ich']
            : meta.title === 'Tagesplan'
              ? ['Am Morgen', 'Am Vormittag', 'Am Nachmittag']
              : ['Erster Abschnitt', 'Zweiter Abschnitt', 'Dritter Abschnitt'];
    const step = AH / sections.length;
    sections.forEach((name, i) => {
      const y = T + i * step;
      text(page, name, L + 3, y, AW - 6, 16, 17);
      shape(page, L + 3, y + 18, AW - 6, step - 24, '#f8faf3');
    });
  }
  return [page];
}
