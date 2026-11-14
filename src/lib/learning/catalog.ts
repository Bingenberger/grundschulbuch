import { defaultShop } from './checkout';
import { makeMonster } from '../reference/monster';
import { makeSynth } from '../reference/synth';
import { withRecordings } from '../reference/recordings';
import { defaultAnlaut } from '../reference/anlaut-defaults';
import { encodeMaps } from '../reference/keys';
import { defaultClap } from '../reference/clap-defaults';
import { PLACE_DEFAULTS } from './placevalue';
import { DIENES_DEFAULTS } from './dienes';
import { NUMBERLINE_DEFAULTS } from './numberline';
import { FIELD_DEFAULTS } from './hundredfield';
import { defaultTs } from './textsachen';
import { defaultDnd } from './zuordnung';
import { defaultQuiz } from './quiz';
import { defaultZeit } from './zeit';
export const widgetCatalog = {
  timer: ['Timer', 'Schule'],
  multitimer: ['Mehrere Timer', 'Schule'],
  clock: ['Lernuhr', 'Schule'],
  calendar: ['Sprechender Kalender', 'Schule'],
  timetable: ['Bilder-Stundenplan', 'Schule'],
  noise: ['Lärmampel', 'Schule'],
  applause: ['Applaus messen', 'Schule'],
  pitch: ['Kurzvortrag', 'Präsentation'],
  piano: ['Klavier & Klanginstrumente', 'Musik'],
  drums: ['Schlagzeug & Klang-Pads', 'Musik'],
  sequencer: ['Rhythmus-Sequencer', 'Musik'],
  metronome: ['Metronom', 'Musik'],
  tuner: ['Stimmgerät', 'Musik'],
  echo: ['Töne nachspielen', 'Musik'],
  notequiz: ['Noten erkennen', 'Musik'],
  falling: ['Notenregen', 'Musik'],
  recorder: ['Aufnahmegerät', 'Musik'],
  playlist: ['Playlist', 'Musik'],
  soundstudio: ['Hörspiel-Studio', 'Musik'],
  karaoke: ['Karaoke & Liedblatt', 'Musik'],
  slideshow: ['Diaschau', 'Präsentation'],
  animation: ['Animation', 'Comic & Film'],
  map: ['Karte & Wege', 'Schule'],
  calculator: ['Taschenrechner & Kassenzettel', 'Mathe'],
  mathtool: ['Mathe-Werkzeug', 'Mathe'],
  receipt: ['Kassenzettel', 'Mathe'],
  geodraw: ['Geometrie: Formen zeichnen', 'Mathe'],
  checkout: ['Einkaufen an der Kasse', 'Mathe'],
  monsternames: ['Monsternamen lesen', 'Lesen & Schreiben'],
  syllablejoin: ['Silben verbinden', 'Lesen & Schreiben'],
  anlaut: ['Anlaut-Tastatur', 'Lesen & Schreiben'],
  clapsyllables: ['Silben klatschen', 'Lesen & Schreiben'],
  placevalue: ['Stellenwerttafel', 'Mathe'],
  dienes: ['Dienes-Material', 'Mathe'],
  numberline: ['Zahlenstrahl', 'Mathe'],
  hundredfield: ['Hunderterfeld', 'Mathe'],
  textsachen: ['Lesen & Schreiben', 'Lesen & Schreiben'],
  zuordnung: ['Zuordnungen', 'Lesen & Schreiben'],
  quizsachen: ['Quiz', 'Interaktive Übungen'],
  zeit: ['Uhr, Timer und Datum', 'Schule'],
  phasen: ['Multi-Timer', 'Schule'],
  mathboard: ['Rechenmaterial', 'Mathe'],
  shop: ['Einkaufen & Rückgeld', 'Mathe'],
  geometry: ['Geometrie mit Prüfen', 'Mathe'],
  monster: ['Fantasienamen lesen', 'Lesen & Schreiben'],
  synthesis: ['Laute verbinden', 'Lesen & Schreiben'],
  clapping: ['Silben klatschen', 'Lesen & Schreiben'],
  alphabet: ['Anlaut-Tastatur', 'Lesen & Schreiben'],
  communication: ['Kommunikationstafel', 'Kommunikation'],
} as const;
export type WidgetKind = keyof typeof widgetCatalog;
export const activityCatalog = {
  quiz: 'Quiz',
  matching: 'Zuordnungen',
  cloze: 'Lückentext',
  typing: 'Abschreiben',
  reading: 'Blitzlesen',
  memory: 'Memory',
  maze: 'Labyrinth · Maus & Käse',
  letterguess: 'Buchstaben raten',
  crossword: 'Kreuzworträtsel',
  wordsearch: 'Suchsel',
  wordle: 'Worträtsel',
  syllables: 'Silbenlesen',
  connect4: 'Vier in einer Reihe',
  battleship: 'Koordinaten-Spiel',
} as const;
export type ActivityKind = keyof typeof activityCatalog;
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };
export type LearningMedia = { image?: string; audio?: string; hideText?: boolean };
export type LearningSettings = {
  /** Music pages rebuilt from the supplied reference; existing widgets keep their settings. */
  musicTemplate?: string;
  /** Several library songs inserted as separate pages (new karaoke tools only). */
  musicSongs?: string[];
  musicConfig?: JsonValue;
  /** Mathe-Werkzeug: boat, abacus, ruler or calc, and its size (5/10/20, 2/10, cm). */
  mathTool?: 'boat' | 'abacus' | 'ruler' | 'calc';
  mathSize?: number;
  /** Geometrie: Formen zeichnen (see learning/geodraw.ts). */
  geo?: { level?: string; count?: number; groups?: string[]; tol?: string; flash?: number; tasks?: { k: string; a: number; b?: number; d?: number; n?: number }[] };
  /** Einkaufen an der Kasse (see learning/checkout.ts). */
  checkout?: JsonValue;
  /** Monsternamen lesen (see reference/monster.ts). */
  monster?: JsonValue;
  /** Silben verbinden (see reference/synth.ts). */
  synth?: JsonValue;
  /** Anlaut-Tastatur (see reference/anlaut.ts). */
  anlaut?: JsonValue;
  /** Silben klatschen (see reference/clap.ts). */
  clap?: JsonValue;
  /** Stellenwerttafel, Dienes-Material, Zahlenstrahl, Hunderterfeld (see learning/placevalue.ts …). */
  place?: JsonValue;
  dienes?: JsonValue;
  numberline?: JsonValue;
  field?: JsonValue;
  /** Übungen von Textsachen (see learning/textsachen.ts). */
  ts?: JsonValue;
  /** Zuordnungen von Schiebesachen (see learning/zuordnung.ts). */
  dnd?: JsonValue;
  /** Quiz von Quizsachen (see learning/quiz.ts). */
  qz?: JsonValue;
  /** Uhr, Timer und Datum der Vorlage (see learning/zeit.ts). */
  zeit?: JsonValue;
  /** Multi-Timer der Vorlage: phases, delay, sound. */
  multi?: JsonValue;
  /** Kassenzettel: number of items, level, money format, with change, receipts per round. */
  receipt?: { count?: number; level?: 'simple' | 'complex'; format?: 'eurocent' | 'euro' | 'cent'; change?: boolean; rounds?: number };
  syllablePrompt?: 'image' | 'word' | 'audio' | 'both';
  syllableColours?: boolean;
  syllableConfirmed?: string[];
  syllableItems?: { word: string; image?: string; audio?: string }[];
  letterGuessLives?: number;
  letterGuessCase?: 'lower' | 'upper';
  letterGuessLayout?: 'abc' | 'qwertz';
  letterGuessClue?: 'none' | 'image' | 'audio' | 'both';
  letterGuessItems?: { word: string; image?: string; audio?: string }[];
  mediaReadText?: boolean;
  clappingConfirmed?: string[];
  clappingHelp?: 'none' | 'dots' | 'word' | 'both';
  clappingItems?: { word: string; image?: string; audio?: string; hideImage?: boolean; syllables?: { text: string; audio?: string }[] }[];
  clappingSensitivity?: number;
  synthesisMode?: 'sounds' | 'pairs';
  synthesisLetters?: string[];
  synthesisCount?: number;
  synthesisCase?: 'lower' | 'upper' | 'mixed';
  synthesisSpeak?: boolean;
  synthesisDragSound?: boolean;
  synthesisPairs?: { left: string; right: string }[];
  synthesisSounds?: { sound: string; audio: string }[];
  synthesisPronunciations?: { text: string; speak: string }[];
  alphabetTable?: 'basic' | 'full';
  alphabetLayout?: 'abc' | 'qwertz';
  alphabetLetters?: 'both' | 'lower' | 'upper';
  alphabetPractice?: boolean;
  alphabetPrompt?: 'word' | 'image' | 'both' | 'audio';
  alphabetSpeech?: boolean;
  alphabetVowels?: boolean;
  alphabetKeys?: { id: string; variants: { word: string; image?: string; audio?: string }[] }[];
  alphabetPrompts?: { word: string; image?: string; audio?: string }[];
  title?: string;
  text?: string;
  karaokeTimes?: number[];
  geometryMode?: 'series' | 'custom';
  geometryHelp?: 'preview' | 'trace';
  geometryCount?: number;
  geometryPreview?: number;
  slideshowSound?: boolean;
  slideshowWaitAudio?: boolean;
  words?: string[];
  pairs?: { left: string; right: string; leftMedia?: LearningMedia; rightMedia?: LearningMedia }[];
  questions?: {
    text: string;
    answers: string[];
    correct: number;
    explanation?: string;
    media?: LearningMedia;
    answerMedia?: LearningMedia[];
  }[];
  seconds?: number;
  bpm?: number;
  volume?: number;
  instrument?: string;
  octaves?: number;
  rows?: number;
  columns?: number;
  maximum?: number;
  difficulty?: number;
  seed?: number;
  cells?: { label: string; image?: string; speak?: string; color?: string }[];
  slides?: {
    title: string;
    text: string;
    image?: string;
    audio?: string;
    seconds?: number;
  }[];
  tracks?: { title: string; src?: string; offset?: number; volume?: number }[];
  frames?: {
    text: string;
    symbol?: string;
    x: number;
    y: number;
    color?: string;
    scale?: number;
    angle?: number;
    opacity?: number;
  }[];
  actors?: {
    symbol: string;
    color: string;
    image?: string;
    frames: {
      text: string;
      x: number;
      y: number;
      scale?: number;
      angle?: number;
      opacity?: number;
    }[];
  }[];
  points?: { label: string; x: number; y: number }[];
  path?: { x: number; y: number }[];
  beats?: boolean[][];
  notes?: number[];
  font?: string;
  voice?: string;
  speechRate?: number;
  speechPitch?: number;
  mode?: string;
  background?: string;
  transition?: string;
  repeat?: boolean;
  showWords?: boolean;
  autoRead?: boolean;
};
export type LearningResponse = Record<string, JsonValue>;
export const defaultWords = [
  'Sonne',
  'Blume',
  'Schule',
  'Apfel',
  'Regen',
  'Haus',
];
export function defaultSettings(
  kind: WidgetKind | ActivityKind,
): LearningSettings {
  const settings: LearningSettings = {
    title:
      kind in widgetCatalog
        ? widgetCatalog[kind as WidgetKind][0]
        : activityCatalog[kind as ActivityKind],
    words: [...defaultWords],
    rows: 3,
    columns: 4,
    seconds: 60,
    bpm: 90,
    volume: 0.35,
    instrument: 'piano',
    maximum: 20,
    difficulty: 1,
    seed: 42,
  };
  if (kind === 'placevalue') Object.assign(settings, { place: { ...PLACE_DEFAULTS } });
  if (kind === 'dienes') Object.assign(settings, { dienes: { ...DIENES_DEFAULTS } });
  if (kind === 'numberline') Object.assign(settings, { numberline: { ...NUMBERLINE_DEFAULTS } });
  if (kind === 'hundredfield') Object.assign(settings, { field: { ...FIELD_DEFAULTS } });
  if (kind === 'textsachen') Object.assign(settings, { ts: defaultTs() as unknown as JsonValue });
  if (kind === 'zuordnung') Object.assign(settings, { dnd: defaultDnd() as unknown as JsonValue });
  if (kind === 'quizsachen') Object.assign(settings, { qz: defaultQuiz() as unknown as JsonValue });
  if (kind === 'zeit') Object.assign(settings, { zeit: defaultZeit() as unknown as JsonValue });
  if (kind === 'clapsyllables') Object.assign(settings, { clap: defaultClap() as unknown as JsonValue });
  if (kind === 'anlaut') Object.assign(settings, { anlaut: encodeMaps(defaultAnlaut(), ['keys', 'sounds']) as unknown as JsonValue });
  if (kind === 'syllablejoin') Object.assign(settings, { synth: encodeMaps(withRecordings(makeSynth()), ['sounds', 'voice']) as unknown as JsonValue });
  if (kind === 'monsternames') Object.assign(settings, { monster: makeMonster() as unknown as JsonValue });
  if (kind === 'checkout') Object.assign(settings, { checkout: defaultShop() as unknown as JsonValue });
  if (kind === 'receipt') Object.assign(settings, { receipt: { count: 5, level: 'simple', format: 'eurocent', change: false, rounds: 3 } });
  if (kind === 'geometry') Object.assign(settings, { geometryMode: 'series', geometryHelp: 'preview', geometryCount: 5, geometryPreview: 3 });
  if (kind === 'syllables') Object.assign(settings, { syllablePrompt: 'image', syllableColours: true, font: 'Andika', speechRate: 0.85, volume: 0.8 });
  if (kind === 'letterguess') Object.assign(settings, { words: ['Sonne', 'Haus', 'Apfel', 'Blume'], letterGuessLives: 8, letterGuessCase: 'upper', letterGuessLayout: 'abc', letterGuessClue: 'image', font: 'Andika', speechRate: 0.85, volume: 0.8 });
  if (kind === 'clapping') Object.assign(settings, { clappingHelp: 'word', clappingSensitivity: 0.06, font: 'Andika', speechRate: 0.85, volume: 0.7 });
  if (kind === 'synthesis') Object.assign(settings, { synthesisMode: 'sounds', synthesisLetters: ['m', 'l', 's', 'f', 'n', 'a', 'e', 'i', 'o', 'u'], synthesisCount: 6, synthesisCase: 'lower', synthesisSpeak: true, synthesisDragSound: false, font: 'Andika', speechRate: 0.85, speechPitch: 1.1, volume: 0.8 });
  if (kind === 'alphabet') Object.assign(settings, { alphabetTable: 'basic', alphabetLayout: 'abc', alphabetLetters: 'both', alphabetPractice: false, alphabetPrompt: 'word', alphabetSpeech: true, alphabetVowels: true, font: 'Andika', speechRate: 0.85, speechPitch: 1.1, volume: 0.8 });
  if (kind === 'quiz')
    settings.questions = [
      {
        text: 'Wie viele Beine hat eine Katze?',
        answers: ['Zwei', 'Vier', 'Sechs'],
        correct: 1,
        explanation: 'Eine Katze hat vier Beine.',
      },
    ];
  if (kind === 'matching' || kind === 'memory')
    settings.pairs = [
      { left: '1 + 1', right: '2' },
      { left: '2 + 2', right: '4' },
      { left: '3 + 3', right: '6' },
      { left: '4 + 4', right: '8' },
    ];
  if (kind === 'cloze')
    settings.text = 'Am Tag scheint die [Sonne]. Nachts sehen wir den [Mond].';
  if (kind === 'typing' || kind === 'reading')
    settings.text =
      'Heute entdecken wir etwas Neues. Gemeinsam macht Lernen Freude.';
  if (kind === 'communication') {
    settings.columns = 4;
    settings.cells = [
      'Ich',
      'möchte',
      'trinken',
      'essen',
      'ja',
      'nein',
      'helfen',
      'Pause',
      'spielen',
      'lernen',
      'gut',
      'fertig',
    ].map((label) => ({ label }));
  }
  if (kind === 'timetable') {
    settings.columns = 5;
    settings.cells = [
      'Montag',
      'Dienstag',
      'Mittwoch',
      'Donnerstag',
      'Freitag',
      ...Array.from(
        { length: 25 },
        (_, i) => ['Deutsch', 'Mathe', 'Kunst', 'Sport', 'Musik'][i % 5],
      ),
    ].map((label) => ({ label }));
  }
  if (kind === 'slideshow')
    settings.slides = [
      {
        title: 'Unsere Entdeckungen',
        text: 'Hier beginnt unsere Geschichte.',
        seconds: 5,
      },
      {
        title: 'Das haben wir gelernt',
        text: 'Beschreibe hier deine Entdeckung.',
        seconds: 5,
      },
    ];
  if (kind === 'animation')
    settings.frames = [
      { text: 'Los geht’s!', symbol: '●', x: 15, y: 65, color: '#42685b' },
      { text: 'In Bewegung', symbol: '●', x: 50, y: 30, color: '#42685b' },
      { text: 'Geschafft!', symbol: '●', x: 85, y: 65, color: '#42685b' },
    ];
  if (kind === 'map')
    settings.points = [
      { label: 'Schule', x: 20, y: 30 },
      { label: 'Park', x: 75, y: 65 },
    ];
  if (kind === 'karaoke') settings.seconds = 3;
  if (kind === 'karaoke')
    settings.text =
      'Hier steht die erste Zeile.\nHier folgt die zweite Zeile.\nGemeinsam singen wir unser Lied.';

  if (kind === 'animation') settings.seconds = 3;
  if (kind === 'playlist')
    settings.tracks = [
      { title: 'Erster Titel', offset: 0, volume: 1 },
      { title: 'Zweiter Titel', offset: 0, volume: 1 },
    ];
  if (kind === 'soundstudio')
    settings.tracks = [
      { title: 'Stimme', offset: 0, volume: 1 },
      { title: 'Geräusche', offset: 0, volume: 0.5 },
      { title: 'Musik', offset: 0, volume: 0.3 },
    ];
  if (kind === 'sequencer')
    settings.beats = Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 16 }, (_, c) => c % (r + 2) === 0),
    );
  if (
    kind === 'monster' ||
    kind === 'synthesis' ||
    kind === 'clapping' ||
    kind === 'syllables'
  )
    settings.words = ['Son-ne', 'Blu-me', 'Re-gen-bo-gen', 'Scho-ko-la-de'];
  if (kind === 'monster')
    settings.words = ['Lu-mo', 'Fa-ni', 'Sa-lo', 'Mi-ra', 'Po-la', 'Nu-fi'];
  if (kind === 'metronome') settings.rows = 4;
  if (kind === 'wordle') settings.words = ['BLUME', 'SONNE', 'WOLKE'];
  return settings;
}
