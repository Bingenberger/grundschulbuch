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
export function blueprintPages(meta: Blueprint): Page[] {
  if (meta.layout === 'communication-book')
    return Object.entries(themeWords).flatMap(([name, words]) =>
      blueprintPages({
        id: 'part',
        title: name,
        category: 'Kommunikation',
        layout: 'widget',
        widget: 'communication',
        words,
      }),
    );
  const page = newPage(
    meta.ruling || 'blanko',
    meta.layout.startsWith('slide') || meta.widget === 'timetable'
      ? 'landscape'
      : 'portrait',
  );
  const width = page.orientation === 'landscape' ? 297 : 210;
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
      height: page.orientation === 'landscape' ? 180 : 265,
      rotation: 0,
      locked: false,
      color: '#253c42',
    });
    return [page];
  }
  title(page, meta.title);
  if (
    ['comic', 'gallery', 'storyboard', 'slide-columns'].includes(meta.layout)
  ) {
    const columns = meta.columns || 2,
      rows = meta.rows || 2,
      w = (width - 35) / columns,
      h = (page.orientation === 'landscape' ? 140 : 235) / rows;
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < columns; col++) {
        const x = 15 + col * (w + 5),
          y = 42 + row * (h + 5);
        placeholder(
          page,
          x,
          y,
          w,
          h - (meta.layout === 'storyboard' ? 20 : 0),
          meta.layout === 'comic' ? '' : `Bild ${row * columns + col + 1}`,
        );
        if (meta.layout === 'storyboard')
          text(page, 'Bild / Handlung / Ton', x, y + h - 17, w, 16, 10);
      }
  } else if (meta.layout === 'writing') {
    for (let i = 0; i < 4; i++) {
      const x = 15 + (i % 2) * 95,
        y = 45 + Math.floor(i / 2) * 110;
      placeholder(page, x, y, 85, 55);
      for (let j = 0; j < 4; j++)
        shape(page, x, y + 65 + j * 9, 85, 0.1, '#a0b299');
    }
  } else if (meta.layout === 'profile') {
    placeholder(page, 135, 42, 60, 70, 'Mein Bild');
    text(
      page,
      'Mein Name: __________________\n\nDas mag ich: __________________\n\nMeine Lieblingsfarbe: __________\n\nDas kann ich gut: ______________',
      15,
      45,
      115,
      110,
      14,
    );
    placeholder(page, 15, 165, 180, 110, 'Hier ist Platz für meine Welt.');
  } else if (meta.layout === 'mindmap') {
    shape(page, 75, 120, 60, 30, '#e5eedb', 'ellipse');
    text(page, 'Mein Thema', 80, 127, 50, 20, 14);
    [
      [15, 50],
      [130, 50],
      [15, 205],
      [130, 205],
    ].forEach(([x, y], i) => {
      page.elements.push(
        compactStroke({
          id: uuid(),
          type: 'stroke',
          x: 0,
          y: 0,
          width: 210,
          height: 297,
          rotation: 0,
          locked: false,
          color: '#89a17b',
          points: [
            { x: 105, y: 135, pressure: 0.5 },
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
    text(page, 'Die Nachrichten unserer Klasse', 15, 40, 180, 25, 19);
    placeholder(page, 15, 75, 110, 70, 'Unser Titelbild');
    text(
      page,
      'Die wichtigste Nachricht\n\nHier beginnt unser Bericht.',
      15,
      155,
      110,
      110,
      14,
    );
    text(
      page,
      'Weitere Nachrichten\n\nWas gibt es Neues?',
      135,
      75,
      60,
      185,
      13,
    );
  } else if (meta.layout === 'room') {
    shape(page, 15, 45, 180, 220, '#f5f2e9');
    shape(page, 15, 45, 180, 220, '#f5f2e9');
    shape(page, 25, 60, 50, 85, '#c8d7e7', 'rounded');
    text(page, 'Bett', 32, 90, 35, 15, 12);
    shape(page, 115, 60, 65, 35, '#dfc8ac');
    text(page, 'Tisch', 128, 69, 42, 15, 12);
    shape(page, 120, 110, 25, 25, '#c8d8b2', 'ellipse');
    shape(page, 150, 110, 25, 25, '#c8d8b2', 'ellipse');
    shape(page, 25, 185, 55, 65, '#dfc8ac');
    text(page, 'Schrank', 30, 210, 45, 15, 12);
    text(
      page,
      'Verschiebe die Möbel und gestalte deinen Raum.',
      15,
      275,
      180,
      15,
      10,
    );
  } else if (meta.layout === 'cover' || meta.layout === 'slide-title') {
    page.paperColor = '#edf2e3';
    text(page, 'Hier steht dein Titel', 25, 65, width - 50, 50, 32);
    text(
      page,
      'Name / Klasse / Thema',
      25,
      page.orientation === 'landscape' ? 155 : 235,
      width - 50,
      25,
      16,
    );
  } else if (meta.layout === 'certificate') {
    page.pageFrame = 'certificate';
    text(page, 'für __________________________', 30, 65, 150, 25, 20);
    text(page, 'Du hast etwas Besonderes geschafft!', 25, 110, 160, 35, 20);
    shape(page, 85, 170, 40, 40, '#e8c66b', 'star');
    text(
      page,
      'Datum: __________  Unterschrift: __________',
      25,
      250,
      160,
      25,
      12,
    );
  } else if (meta.layout === 'letter') {
    text(
      page,
      'Liebe / Lieber __________________,\n\n\n\n\n\n\n\nViele Grüße\n__________________',
      20,
      55,
      170,
      210,
      17,
    );
  } else if (meta.layout === 'diary') {
    text(
      page,
      'Datum: __________________\n\nDas habe ich erlebt / gelernt:\n\n\n\nDas war schwierig:\n\n\n\nDarauf freue ich mich:',
      20,
      45,
      170,
      225,
      15,
    );
  } else if (meta.layout === 'slide-picture') {
    placeholder(page, 15, 45, 165, 140);
    text(page, 'Bildunterschrift und Gedanken', 190, 50, 90, 125, 17);
  } else if (meta.layout === 'slide-table') {
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 3; col++) {
        shape(
          page,
          15 + col * 89,
          45 + row * 28,
          89,
          28,
          row === 0 ? '#e0ebd3' : '#ffffff',
        );
        text(
          page,
          row === 0 ? `Spalte ${col + 1}` : '',
          18 + col * 89,
          50 + row * 28,
          83,
          20,
          13,
        );
      }
  } else if (meta.layout === 'music-lines') {
    page.ruling = 'noten';
    text(
      page,
      'Name: __________________   Datum: __________',
      15,
      35,
      180,
      15,
      11,
    );
  } else if (meta.layout === 'slide-text') {
    text(
      page,
      'Deine wichtigste Aussage\n\n• Erster Gedanke\n• Zweiter Gedanke\n• Dritter Gedanke',
      20,
      50,
      width - 40,
      130,
      21,
    );
  } else {
    const sections =
      meta.layout === 'screenplay'
        ? ['Szene', 'Handlung', 'Dialog / Ton']
        : meta.title === 'Rezept'
          ? ['Zutaten', 'Zubereitung', 'Mein Tipp']
          : meta.title === 'Experiment'
            ? [
                'Meine Frage',
                'Material',
                'So gehe ich vor',
                'Das beobachte ich',
              ]
            : meta.title === 'Tagesplan'
              ? ['Am Morgen', 'Am Vormittag', 'Am Nachmittag']
              : ['Erster Abschnitt', 'Zweiter Abschnitt', 'Dritter Abschnitt'];
    sections.forEach((name, i) => {
      const y = 45 + i * (220 / sections.length);
      text(page, name, 18, y, 174, 16, 17);
      shape(page, 18, y + 20, 174, 220 / sections.length - 28, '#f8faf3');
    });
  }
  return [page];
}
