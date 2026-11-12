// The catalogue of “Lernwerkzeuge”: every interactive building block for a page,
// grouped by subject. Presets (instrument, drum kit, communication board …) come
// from the former interactive templates, so nothing changes for existing books.
// Design-only templates stay in the template chooser (page-templates.ts).
import { newPage, uuid, type Page, type PageElement } from '../notebook-model';
import { activityCatalog, widgetCatalog, type ActivityKind, type LearningSettings, type WidgetKind } from './catalog';
import { blueprintPages, blueprints, type Blueprint } from './templates';
import { defaultSettings } from './catalog';
import type { MathToolKind } from './mathtool';
import { geoConfig } from './geodraw';

export const SUBJECTS = [
  'Deutsch',
  'Mathematik',
  'Sachunterricht',
  'Musik',
  'Medien & Präsentation',
  'Klassenführung',
  'Unterstützte Kommunikation',
  'Für alle Fächer',
] as const;
export type Subject = (typeof SUBJECTS)[number];

const subjectOf: Record<WidgetKind | ActivityKind, Subject> = {
  // Deutsch
  alphabet: 'Deutsch', clapping: 'Deutsch', synthesis: 'Deutsch', syllables: 'Deutsch', monster: 'Deutsch',
  letterguess: 'Deutsch', cloze: 'Deutsch', typing: 'Deutsch', reading: 'Deutsch', crossword: 'Deutsch',
  wordsearch: 'Deutsch', wordle: 'Deutsch',
  // Mathematik
  calculator: 'Mathematik', mathtool: 'Mathematik', receipt: 'Mathematik', geodraw: 'Mathematik', checkout: 'Mathematik', monsternames: 'Deutsch', syllablejoin: 'Deutsch', mathboard: 'Mathematik', shop: 'Mathematik', geometry: 'Mathematik', battleship: 'Mathematik',
  // Sachunterricht
  map: 'Sachunterricht', clock: 'Sachunterricht', calendar: 'Sachunterricht',
  // Musik
  piano: 'Musik', drums: 'Musik', sequencer: 'Musik', metronome: 'Musik', tuner: 'Musik', echo: 'Musik',
  notequiz: 'Musik', falling: 'Musik', playlist: 'Musik', soundstudio: 'Musik', karaoke: 'Musik',
  // Medien & Präsentation
  slideshow: 'Medien & Präsentation', pitch: 'Medien & Präsentation', animation: 'Medien & Präsentation',
  recorder: 'Medien & Präsentation',
  // Klassenführung
  timer: 'Klassenführung', multitimer: 'Klassenführung', noise: 'Klassenführung', applause: 'Klassenführung',
  timetable: 'Klassenführung',
  // Unterstützte Kommunikation
  communication: 'Unterstützte Kommunikation',
  // Für alle Fächer
  quiz: 'Für alle Fächer', matching: 'Für alle Fächer', memory: 'Für alle Fächer', maze: 'Für alle Fächer',
  connect4: 'Für alle Fächer',
};

export type LearningBlock = {
  id: string;
  title: string;
  subject: Subject;
  type: 'widget' | 'activity';
  kind: WidgetKind | ActivityKind;
  /** Settings the block starts with (instrument, fields …). */
  preset?: LearningSettings;
  /** Several pages at once (the communication book); inserted without settings. */
  pages?: (orientation: Page['orientation']) => Page[];
  /** Search words. */
  words: string;
  /** Fully set up by its preset: inserted right away, without the settings step. */
  direct?: boolean;
};

/** Duplicates of a variant with the same default (e.g. “Klavier” = “Klavier & Klanginstrumente”). */
const SKIP = new Set([
  'instrument-piano',
  'widget-mathboard',
  // Replaced by the reference tools below (existing elements keep working).
  'math-beads',
  'widget-mathtool',
  'widget-calculator',
  'widget-geometry',
  'widget-geodraw',
  'widget-shop',
  'widget-checkout',
  'widget-monster',
  'widget-monsternames',
  'widget-synthesis',
  'widget-syllablejoin',
]);

/** Regal › Mathe of the reference. */
const mathTools: [string, MathToolKind, number, string][] = [
  ['Rechenschiffchen 5', 'boat', 5, 'fünf Plätze, blau und rot'],
  ['Rechenschiffchen 10', 'boat', 10, 'Plättchen blau und rot, immer der Reihe nach'],
  ['Rechenschiffchen 20', 'boat', 20, 'zwei Schiffchen bis 20'],
  ['Rechenrahmen 20', 'abacus', 2, 'zwei Reihen mit je 10 Kugeln'],
  ['Rechenrahmen 100', 'abacus', 10, 'zehn Reihen mit je 10 Kugeln'],
  ['Lineal 15 cm', 'ruler', 15, 'in echter Größe beim Ausdrucken'],
  ['Lineal 30 cm', 'ruler', 30, 'in echter Größe beim Ausdrucken'],
  ['Taschenrechner', 'calc', 0, 'plus, minus, mal, geteilt'],
];
/** Reference template “Rechnen mit dem Taschenrechner”: receipt and calculator on one page. */
function receiptPage(orientation: Page['orientation']): Page[] {
  const page = newPage('blanko', orientation);
  const wide = orientation === 'landscape';
  const element = (values: Partial<PageElement>): PageElement => ({ id: uuid(), x: 0, y: 0, width: 10, height: 10, rotation: 0, locked: false, color: '#253c42', ...values } as PageElement);
  page.paperColor = '#eef1f4';
  page.elements.push(
    element({ type: 'text', text: 'Rechnen mit dem Taschenrechner', font: 'Andika', fontSize: 26, x: 12, y: 8, width: wide ? 200 : 186, height: 12 }),
    element({ type: 'text', text: 'Rechne aus, was der Einkauf kostet, und trage die Summe auf dem Kassenzettel ein.', font: 'Andika', fontSize: 13, x: 12, y: 19, width: wide ? 260 : 186, height: 8, color: '#495057' }),
    element({
      type: 'widget',
      widgetKind: 'receipt',
      settings: { ...defaultSettings('receipt'), title: 'Kassenzettel', receipt: { count: 5, level: 'complex', format: 'eurocent', change: true, rounds: 3 } },
      ...(wide ? { x: 8.5, y: 30, width: 168, height: 176 } : { x: 10, y: 30, width: 150, height: 157 }),
    }),
    element({
      type: 'widget',
      widgetKind: 'mathtool',
      settings: { ...defaultSettings('mathtool'), title: 'Taschenrechner', mathTool: 'calc', mathSize: 0 },
      ...(wide ? { x: 195, y: 45, width: 85, height: 122.6 } : { x: 120, y: 195, width: 63.6, height: 91.9 }),
    }),
  );
  return [page];
}

const toolBlocks: LearningBlock[] = mathTools.map(([title, tool, n, hint]) => ({
  id: `mathtool-${tool}-${n}`,
  title,
  subject: 'Mathematik',
  type: 'widget',
  kind: 'mathtool',
  preset: { ...defaultSettings('mathtool'), title, mathTool: tool, mathSize: n },
  direct: true,
  words: `${title} ${hint} mathematik zwanzigerfeld hunderterfeld`,
}));

function title(meta: Blueprint) {
  return meta.title.replace(/^Kommunikation · /, '');
}

function fromBlueprint(meta: Blueprint): LearningBlock | null {
  if (SKIP.has(meta.id)) return null;
  if (meta.layout === 'communication-book')
    return {
      id: meta.id,
      title: meta.title,
      subject: 'Unterstützte Kommunikation',
      type: 'widget',
      kind: 'communication',
      pages: (o) => blueprintPages(meta, o),
      words: `${meta.title} kommunikation tafel uk`,
    };
  const kind = meta.widget || meta.activity;
  if (!kind) return null;
  const element = blueprintPages(meta, 'landscape')[0].elements[0];
  const label = meta.widget ? widgetCatalog[meta.widget][0] : activityCatalog[meta.activity!];
  return {
    id: meta.id,
    title: title(meta),
    subject: subjectOf[kind],
    type: meta.widget ? 'widget' : 'activity',
    kind,
    preset: element.settings,
    words: `${meta.title} ${label} ${subjectOf[kind]} ${meta.category}`,
  };
}

/** Reference template “Geometrie: Formen zeichnen”: a whole squared page. */
export function geodrawPage(): Page[] {
  const page = newPage('karo5', 'landscape');
  page.lineColor = '#a5c3ec';
  const geo = geoConfig({ level: 'easy', count: 5, groups: [], tol: 'normal', flash: 2 });
  page.elements.push({
    id: uuid(),
    type: 'widget',
    widgetKind: 'geodraw',
    settings: { ...defaultSettings('geodraw'), title: 'Geometrie: Formen zeichnen', geo },
    x: 0,
    y: 0,
    width: 297,
    height: 210,
    rotation: 0,
    locked: true,
    color: '#253c42',
  } as PageElement);
  return [page];
}

toolBlocks.push({
  id: 'geodraw-page',
  title: 'Geometrie: Formen zeichnen',
  subject: 'Mathematik',
  type: 'widget',
  kind: 'geodraw',
  pages: geodrawPage,
  words: 'Geometrie Formen zeichnen Lineal Geodreieck Strecke Quadrat Rechteck Dreieck Seite',
});
/** Reference template “Einkaufen an der Kasse”: the shop fills a whole page. */
export function checkoutPage(settings: LearningSettings): Page[] {
  return fullPageWidget('checkout', settings);
}
/** A reference widget that fills a whole landscape page. */
export function fullPageWidget(kind: WidgetKind, settings: LearningSettings): Page[] {
  const page = newPage('blanko', 'landscape');
  page.elements.push({
    id: uuid(),
    type: 'widget',
    widgetKind: kind,
    settings,
    x: 0,
    y: 0,
    width: 297,
    height: 210,
    rotation: 0,
    locked: true,
    color: '#253c42',
  } as PageElement);
  return [page];
}

toolBlocks.push({
  id: 'monsternames',
  title: 'Monsternamen lesen',
  subject: 'Deutsch',
  type: 'widget',
  kind: 'monsternames',
  preset: { ...defaultSettings('monsternames'), title: 'Monsternamen lesen' },
  words: 'Monsternamen lesen Fantasienamen Silben lesen Pseudowörter Monster Urkunde',
});
toolBlocks.push({
  id: 'syllablejoin',
  title: 'Silben verbinden',
  subject: 'Deutsch',
  type: 'widget',
  kind: 'syllablejoin',
  preset: { ...defaultSettings('syllablejoin'), title: 'Silben verbinden' },
  words: 'Silben verbinden Laute verbinden Synthese ziehen Buchstaben zusammenschleifen lesen',
});
toolBlocks.push({
  id: 'checkout',
  title: 'Einkaufen an der Kasse',
  subject: 'Mathematik',
  type: 'widget',
  kind: 'checkout',
  preset: { ...defaultSettings('checkout'), title: 'Einkaufen an der Kasse' },
  words: 'Einkaufen an der Kasse Laden Kaufladen Geld Münzen Scheine Rückgeld Wechselgeld Kunde Bäckerei Kiosk Supermarkt',
});
toolBlocks.push({
  id: 'receipt-page',
  title: 'Rechnen mit dem Taschenrechner',
  subject: 'Mathematik',
  type: 'widget',
  kind: 'receipt',
  pages: receiptPage,
  words: 'Rechnen mit dem Taschenrechner Kassenzettel Rückgeld Seite',
});

export const learningBlocks: LearningBlock[] = [...toolBlocks, ...blueprints.map(fromBlueprint)]
  .filter((b): b is LearningBlock => !!b)
  .sort((a, b) => SUBJECTS.indexOf(a.subject) - SUBJECTS.indexOf(b.subject));

/** Interactive templates (widgets, activities, the communication book) are building blocks now. */
export function isInteractiveBlueprint(meta: Blueprint) {
  return !!(meta.widget || meta.activity || meta.layout === 'communication-book');
}
