// The catalogue of “Lernwerkzeuge”: every interactive building block for a page,
// grouped by subject. Presets (instrument, drum kit, communication board …) come
// from the former interactive templates, so nothing changes for existing books.
// Design-only templates stay in the template chooser (page-templates.ts).
import { newPage, uuid, type Page, type PageElement } from '../notebook-model';
import { activityCatalog, widgetCatalog, type ActivityKind, type LearningSettings, type WidgetKind } from './catalog';
import { blueprintPages, blueprints, type Blueprint } from './templates';
import { defaultSettings, type JsonValue } from './catalog';
import { defaultTs } from './textsachen';
import { defaultDnd } from './zuordnung';
import { defaultQuiz } from './quiz';
import { defaultZeit } from './zeit';
import { BOARDS, bookPages, boardPages, GRIDS, picto } from './uk';
import { TALK_BACK } from '../reference/class-runtime';
import type { MathToolKind } from './mathtool';
import { geoConfig } from './geodraw';
import { musicPresets, musicKind, musicSettings, musicPage } from './music';

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
  calculator: 'Mathematik', mathtool: 'Mathematik', receipt: 'Mathematik', geodraw: 'Mathematik', checkout: 'Mathematik', monsternames: 'Deutsch', textsachen: 'Deutsch', zuordnung: 'Für alle Fächer', quizsachen: 'Für alle Fächer', zeit: 'Sachunterricht', phasen: 'Klassenführung', ampel: 'Klassenführung', stundenplan: 'Klassenführung', kalenderblatt: 'Sachunterricht', karte: 'Sachunterricht', elevator: 'Medien & Präsentation', medienseite: 'Medien & Präsentation', sprechtaste: 'Unterstützte Kommunikation', satzleiste: 'Unterstützte Kommunikation', syllablejoin: 'Deutsch', anlaut: 'Deutsch', clapsyllables: 'Deutsch', placevalue: 'Mathematik', dienes: 'Mathematik', numberline: 'Mathematik', hundredfield: 'Mathematik', mathboard: 'Mathematik', shop: 'Mathematik', geometry: 'Mathematik', battleship: 'Mathematik',
  // Sachunterricht
  map: 'Sachunterricht', clock: 'Sachunterricht', calendar: 'Sachunterricht',
  // Musik
  piano: 'Musik', drums: 'Musik', sequencer: 'Musik', metronome: 'Musik', tuner: 'Musik', echo: 'Musik',
  notequiz: 'Musik', falling: 'Musik', playlist: 'Musik', soundstudio: 'Musik', karaoke: 'Musik',
  // Medien & Präsentation
  slideshow: 'Medien & Präsentation', pitch: 'Medien & Präsentation', animation: 'Medien & Präsentation',
  recorder: 'Musik',
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
  generator?: 'notes';
  /** Static preview of the actual tool; no interactive controls in the chooser. */
  preview?: string;
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
  'widget-alphabet',
  'widget-anlaut',
  'widget-clapping',
  'widget-clapsyllables',
  'widget-receipt',
  // Replaced by the new maths materials below; the Koordinaten-Spiel is gone.
  'math-place',
  'math-numberline',
  'activity-battleship',
  'widget-placevalue',
  'widget-dienes',
  'widget-numberline',
  'widget-hundredfield',
  // Replaced by the exercises of Textsachen (Lesen & Schreiben, games).
  'widget-textsachen',
  'activity-cloze',
  'activity-typing',
  'activity-reading',
  'activity-letterguess',
  'activity-crossword',
  'activity-wordsearch',
  'activity-wordle',
  // Replaced by the Zuordnungen of Schiebesachen (Silbenlesen is one of them).
  'widget-zuordnung',
  'activity-matching',
  'activity-syllables',
  // Replaced by the quiz of Quizsachen; Memory and Maus & Käse are the ones of
  // Textsachen now (as in Lernsachen-Heft).
  'widget-quizsachen',
  'activity-quiz',
  'activity-memory',
  'activity-maze',
  // Replaced by Uhr, Timer, Datum and Multi-Timer of the reference (Regal › Zeit).
  'widget-clock',
  'widget-timer',
  'widget-multitimer',
  'widget-zeit',
  'widget-phasen',
  // Replaced by Lärmampel and Applausometer of the reference.
  'widget-noise',
  'widget-applause',
  'widget-ampel',
  // Replaced by the Bilder-Stundenplan of the reference.
  'widget-timetable',
  'widget-stundenplan',
  // Replaced by the calendar sheet of the reference.
  'widget-calendar',
  'widget-kalenderblatt',
  // Replaced by the map of the reference.
  'widget-map',
  'widget-karte',
  // Offered as Sprechtaste, Satzleiste and Zurück-Taste below.
  'widget-sprechtaste',
  'widget-satzleiste',
  // Replaced by the Elevator Pitch of the reference.
  'widget-pitch',
  'widget-elevator',
  'widget-medienseite',
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
/** Settings of the receipt in “Rechnen mit dem Taschenrechner” as in the reference. */
export const RECEIPT_START = { count: 5, level: 'complex', format: 'eurocent', change: true, rounds: 3 } as const;
/** Reference template “Rechnen mit dem Taschenrechner”: receipt and calculator on one page. */
export function receiptPage(orientation: Page['orientation'], receipt: LearningSettings['receipt'] = RECEIPT_START): Page[] {
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
      settings: { ...defaultSettings('receipt'), title: 'Kassenzettel', receipt: { ...RECEIPT_START, ...receipt } },
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
  // Replaced by the keys, boards and book of the reference (see below); existing pages keep working.
  if (meta.widget === 'communication' || meta.layout === 'communication-book') return null;
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
  if (kind && ['piano', 'drums', 'sequencer', 'metronome', 'tuner', 'echo', 'notequiz', 'falling', 'recorder', 'playlist', 'soundstudio', 'karaoke'].includes(kind)) return null;
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
  id: 'anlaut',
  title: 'Anlaut-Tastatur',
  subject: 'Deutsch',
  type: 'widget',
  kind: 'anlaut',
  preset: { ...defaultSettings('anlaut'), title: 'Anlaut-Tastatur' },
  words: 'Anlaut-Tastatur Anlauttabelle Anlautbilder Laute schreiben Wörter üben Buchstaben Fibel',
});
toolBlocks.push({
  id: 'clapsyllables',
  title: 'Silben klatschen',
  subject: 'Deutsch',
  type: 'widget',
  kind: 'clapsyllables',
  preset: { ...defaultSettings('clapsyllables'), title: 'Silben klatschen' },
  words: 'Silben klatschen Silbenbögen Silben schwingen Mikrofon Bilder Wörter',
});
for (const [kind, title, words] of [
  ['placevalue', 'Stellenwerttafel', 'Stellenwerttafel Stellenwerte Einer Zehner Hunderter Tausender Montessori Plättchen bündeln entbündeln'],
  ['dienes', 'Dienes-Material', 'Dienes-Material Mehrsystemblöcke Einerwürfel Zehnerstange Hunderterplatte Tausenderwürfel bündeln tauschen'],
  ['numberline', 'Zahlenstrahl', 'Zahlenstrahl Zahlengerade Rechenstrich Sprünge Zahlen finden'],
  ['hundredfield', 'Hunderterfeld', 'Hunderterfeld Zwanzigerfeld Punktefeld Abdeckwinkel färben Zahlen zeigen'],
] as const)
  toolBlocks.push({ id: kind, title, subject: 'Mathematik', type: 'widget', kind, preset: { ...defaultSettings(kind), title }, words });
// Lesen & Schreiben and the word games of Textsachen, as in Lernsachen-Heft.
for (const [id, mode, title, words] of [
  ['ts-lesen-schreiben', 'picture', 'Lesen & Schreiben', 'Lesen Schreiben Textsachen Bilddiktat Hördiktat Wortdiktat Diktat Blitzlesen Lückentext Abtippen Abschreiben Text vorlesen Lernwörter'],
  ['ts-memory', 'memory', 'Memory mit Wörtern', 'Memory Paare Bild Wort Ton Wörter Textsachen'],
  ['ts-mouse', 'mouse', 'Maus & Käse', 'Maus Käse Buchstaben raten Galgenmännchen Wörter Textsachen'],
  ['ts-crossword', 'crossword', 'Kreuzworträtsel', 'Kreuzworträtsel Rätsel Bilder Wörter Textsachen'],
  ['ts-search', 'search', 'Suchsel', 'Suchsel Wortsuche Buchstabengitter Wörter finden Textsachen'],
  ['ts-wordle', 'wordle', 'Wordle', 'Wordle Worträtsel Wort erraten Buchstaben Textsachen'],
] as const)
  toolBlocks.push({ id, title, subject: 'Deutsch', type: 'widget', kind: 'textsachen', preset: { ...defaultSettings('textsachen'), ts: defaultTs(mode) as unknown as JsonValue, title }, words });
// Regal › Zeit of the reference: Uhr and Datum (Sachunterricht), Timer and
// Multi-Timer (Klassenführung).
for (const [id, subject, kind, title, words] of [
  ['zeit-clock', 'Sachunterricht', 'clock', 'Uhr', 'Uhr Uhrzeit analog digital Zeit ansagen'],
  ['zeit-date', 'Sachunterricht', 'date', 'Datum', 'Datum heute Wochentag Monat Wetter Kalender'],
  ['zeit-timer', 'Klassenführung', 'timer', 'Timer', 'Timer Zeit Minuten Countdown Gong Eieruhr'],
] as const)
  toolBlocks.push({ id, title, subject, type: 'widget', kind: 'zeit', preset: { ...defaultSettings('zeit'), zeit: defaultZeit(kind) as unknown as JsonValue, title }, words });
for (const [id, mode, title, words] of [
  ['ampel-noise', 'noise', 'Lärmampel', 'Lärmampel Ampel laut leise Lautstärke Mikrofon Klasse ruhig'],
  ['ampel-applause', 'applause', 'Applausometer', 'Applausometer Applaus klatschen jubeln messen Mikrofon laut'],
] as const)
  toolBlocks.push({ id, title, subject: 'Klassenführung', type: 'widget', kind: 'ampel', preset: { ...defaultSettings('ampel'), applause: (mode === 'noise' ? { mode, secs: 5, sens: 3, limit: 3, chime: false } : { mode }) as JsonValue, title }, words });
// Unterstützte Kommunikation as in the reference: single keys, the sentence
// strip, the back key, boards with 2 to 20 fields, theme boards and the book.
const back = TALK_BACK as [string, number, string];
toolBlocks.push(
  { id: 'uk-key', title: 'Sprechtaste', subject: 'Unterstützte Kommunikation', type: 'widget', kind: 'sprechtaste', preset: { ...defaultSettings('sprechtaste'), title: 'Sprechtaste', talk: { label: '', color: '#ffffff' } }, words: 'Sprechtaste Taste Bild Wort sprechen UK Talker' },
  { id: 'uk-strip', title: 'Satzleiste', subject: 'Unterstützte Kommunikation', type: 'widget', kind: 'satzleiste', preset: { ...defaultSettings('satzleiste'), title: 'Satzleiste' }, direct: true, words: 'Satzleiste Satz Wörter sammeln vorlesen UK' },
  { id: 'uk-back', title: 'Zurück-Taste', subject: 'Unterstützte Kommunikation', type: 'widget', kind: 'sprechtaste', preset: { ...defaultSettings('sprechtaste'), title: 'Zurück-Taste', talk: { label: back[0], color: '#f1f3f5', img: picto(back[1]), back: true } }, direct: true, words: 'Zurück Taste Tafel zurück UK' },
  ...GRIDS.map((g): LearningBlock => ({ id: `uk-${g.id}`, title: g.label, subject: 'Unterstützte Kommunikation', type: 'widget', kind: 'sprechtaste', pages: () => boardPages(g.id), words: `${g.label} Kommunikationstafel Tafel Felder UK` })),
  ...BOARDS.map((b): LearningBlock => ({ id: `uk-${b.id}`, title: b.label, subject: 'Unterstützte Kommunikation', type: 'widget', kind: 'sprechtaste', pages: () => boardPages(b.id), words: `${b.label} ${b.keywords ?? ''} Kommunikationstafel Tafel UK` })),
  { id: 'uk-book', title: 'Kommunikationsbuch mit allen Tafeln', subject: 'Unterstützte Kommunikation', type: 'widget', kind: 'sprechtaste', pages: () => bookPages(), words: 'Kommunikationsbuch alle Tafeln UK Buch' },
);
for (const [art, title, words] of [
  ['video', 'Video', 'Video YouTube Film Video mit Titel einbetten'],
  ['webpage', 'Webseite', 'Webseite Internet Seite einbetten Adresse'],
  ['qr', 'QR-Plakat', 'QR-Code QR-Plakat Plakat scannen Link Adresse'],
] as const)
  toolBlocks.push({ id: `medien-${art}`, title, subject: 'Medien & Präsentation', type: 'widget', kind: 'medienseite', preset: { ...defaultSettings('medienseite'), title, medien: { art, url: '', title: '', caption: '' } }, words });
toolBlocks.push({ id: 'elevator', title: 'Elevator Pitch', subject: 'Medien & Präsentation', type: 'widget', kind: 'elevator', preset: { ...defaultSettings('elevator'), title: 'Elevator Pitch' }, words: 'Elevator Pitch Kurzvortrag Vortrag Zeit Fahrstuhl Präsentation sprechen' });
toolBlocks.push({ id: 'karte', title: 'Karte', subject: 'Sachunterricht', type: 'widget', kind: 'karte', preset: { ...defaultSettings('karte'), title: 'Meine Karte' }, words: 'Karte Stadtplan Ort Schulweg Weg Markierung Entfernung messen OpenStreetMap Heimatort' });
toolBlocks.push({ id: 'kalenderblatt', title: 'Das sprechende Kalenderblatt', subject: 'Sachunterricht', type: 'widget', kind: 'kalenderblatt', preset: { ...defaultSettings('kalenderblatt'), title: 'Das sprechende Kalenderblatt' }, pages: () => fullPageWidget('kalenderblatt', { ...defaultSettings('kalenderblatt'), title: 'Das sprechende Kalenderblatt' }), words: 'Kalender Kalenderblatt Datum Wochentag Monat Jahr Jahreszeit Morgenkreis heute sprechen' });
toolBlocks.push({ id: 'stundenplan', title: 'Bilder-Stundenplan', subject: 'Klassenführung', type: 'widget', kind: 'stundenplan', preset: { ...defaultSettings('stundenplan'), title: 'Bilder-Stundenplan' }, words: 'Stundenplan Bilder Fächer Woche Pausen Nach der Schule Tagesablauf Piktogramme' });
toolBlocks.push({ id: 'zeit-multitimer', title: 'Multi-Timer', subject: 'Klassenführung', type: 'widget', kind: 'phasen', preset: { ...defaultSettings('phasen'), title: 'Multi-Timer' }, words: 'Multi-Timer Phasen Think Pair Share Arbeitszeit Uhr Ringe' });
// Quiz of Quizsachen and Memory of Textsachen, as in Lernsachen-Heft (Interaktive Übungen).
toolBlocks.push(
  { id: 'qz-quiz', title: 'Quiz', subject: 'Für alle Fächer', type: 'widget', kind: 'quizsachen', preset: { ...defaultSettings('quizsachen'), qz: defaultQuiz() as unknown as JsonValue, title: 'Quiz' }, words: 'Quiz Quizsachen Fragen Antworten Einfachauswahl Mehrfachauswahl richtig falsch Reihenfolge Bilderrätsel Hör-Quiz' },
  { id: 'ts-memory-all', title: 'Memory', subject: 'Für alle Fächer', type: 'widget', kind: 'textsachen', preset: { ...defaultSettings('textsachen'), ts: defaultTs('memory') as unknown as JsonValue, title: 'Memory' }, words: 'Memory Paare Bild Wort Ton Textsachen' },
);
// Zuordnungen of Schiebesachen, as in Lernsachen-Heft; the formats for reading
// and writing are also offered under Deutsch.
for (const [id, subject, format, title, words] of [
  ['dnd-silben', 'Deutsch', 'silben', 'Silbenlesen', 'Silbenlesen Silben legen ziehen Wörter Silbenmethode blau rot Schiebesachen'],
  ['dnd-buchstabieren', 'Deutsch', 'buchstabieren', 'Buchstabieren', 'Buchstabieren Buchstaben legen Wort legen Bild Schiebesachen'],
  ['dnd-artikel', 'Deutsch', 'artikel', 'Artikel: der, die, das', 'Artikel der die das Nomen sortieren Begleiter Schiebesachen'],
  ['dnd-bildwort', 'Deutsch', 'bildwort', 'Bild und Wort', 'Bild Wort zuordnen Wörter Bilder Schiebesachen'],
  ['dnd-zuordnungen', 'Für alle Fächer', 'bildwort', 'Zuordnungen', 'Zuordnungen zuordnen Sortieren Oberbegriffe Reihenfolge Paare Schiebesachen ziehen'],
] as const)
  toolBlocks.push({ id, title, subject, type: 'widget', kind: 'zuordnung', preset: { ...defaultSettings('zuordnung'), dnd: defaultDnd(format) as unknown as JsonValue, title }, words });
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
  // Settings first (like the reference), then receipt and calculator on a page.
  preset: { ...defaultSettings('receipt'), title: 'Rechnen mit dem Taschenrechner', receipt: { ...RECEIPT_START } },
  words: 'Rechnen mit dem Taschenrechner Kassenzettel Rückgeld Wechselgeld Summe Seite',
});

const musicBlocks: LearningBlock[] = [{ id: 'music-notes', title: 'Noten lernen', subject: 'Musik', type: 'widget', kind: 'notequiz', generator: 'notes', preview: '/previews/music/notes.webp', words: 'Musik Noten lernen Notennamen Notenwerte Notenrätsel' }, ...musicPresets.map((preset): LearningBlock => ({
  id: `music-${preset.id}`, title: preset.title, preview: `/previews/music/${preset.id}.webp`, subject: 'Musik', type: 'widget', kind: musicKind(preset),
  preset: musicSettings(preset),
  ...(!preset.generator ? { pages: () => musicPage(musicSettings(preset)) } : {}),
  words: `${preset.title} Musik Instrument Noten Rhythmus Klang`,
}))];

export const learningBlocks: LearningBlock[] = [...toolBlocks, ...musicBlocks, ...blueprints.map(fromBlueprint)]
  .filter((b): b is LearningBlock => !!b)
  .map(block => block.subject === 'Mathematik' ? { ...block, preview: `/previews/math/${block.id}.webp` } : block)
  .sort((a, b) => SUBJECTS.indexOf(a.subject) - SUBJECTS.indexOf(b.subject));

/** Interactive templates (widgets, activities, the communication book) are building blocks now. */
export function isInteractiveBlueprint(meta: Blueprint) {
  return !!(meta.widget || meta.activity || meta.layout === 'communication-book');
}
