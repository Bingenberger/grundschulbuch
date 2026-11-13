// Exercises of Textsachen (Lernsachen.blog): Bild-, Hör- und Wortdiktat,
// Blitzlesen, Lesen, Lückentext, Abtippen and the games Memory, Maus & Käse,
// Kreuzworträtsel, Suchsel and Wordle. Our settings keep the words, the text
// and the pictures as media addresses; `playerTask` turns them into the task
// format the original player (reference/textsachen-player.ts) understands.

export type TsMode =
  | 'picture' | 'listen' | 'copy' | 'flash'
  | 'memory' | 'mouse' | 'crossword' | 'search' | 'wordle'
  | 'read' | 'gaps' | 'type';
export type TsKind = 'words' | 'text';

/** Groups and texts as in the editor of Textsachen. */
export const TS_MODES: Record<TsMode, { label: string; desc: string; icon: string }> = {
  picture: { label: 'Bilddiktat', desc: 'Zum Bild das Wort schreiben.', icon: 'picture' },
  listen: { label: 'Hördiktat', desc: 'Das Wort hören und schreiben.', icon: 'speaker' },
  copy: { label: 'Wortdiktat', desc: 'Das Wort ansehen und abschreiben.', icon: 'reading' },
  flash: { label: 'Blitzlesen', desc: 'Ein Wort blitzt auf, dann wird das passende Bild angetippt.', icon: 'flash_on' },
  memory: { label: 'Memory', desc: 'Paare aus Bild und Wort finden.', icon: 'gallery' },
  mouse: { label: 'Maus & Käse', desc: 'Buchstaben raten, bevor die Maus am Käse ist.', icon: 'faq' },
  crossword: { label: 'Kreuzworträtsel', desc: 'Die Bilder sind die Fragen.', icon: 'grid' },
  search: { label: 'Suchsel', desc: 'Die Wörter im Buchstabengitter finden.', icon: 'search' },
  wordle: { label: 'Wordle', desc: 'Ein Wort mit 4, 5 oder 6 Buchstaben erraten.', icon: 'list' },
  read: { label: 'Lesen', desc: 'Vorlesen mit mitleuchtenden Wörtern, danach ein Bilder-Quiz.', icon: 'reading_ebook' },
  gaps: { label: 'Lückentext', desc: 'Die Lernwörter fehlen und werden eingetippt.', icon: 'rules' },
  type: { label: 'Abtippen', desc: 'Der Text wird Wort für Wort abgetippt.', icon: 'signature' },
};
export const TS_GROUPS: { title: string; kind: TsKind; modes: TsMode[] }[] = [
  { title: 'Diktate und Blitzlesen', kind: 'words', modes: ['picture', 'listen', 'copy', 'flash'] },
  { title: 'Spiele und Rätsel', kind: 'words', modes: ['memory', 'mouse', 'crossword', 'search', 'wordle'] },
  { title: 'Übungen mit dem Text', kind: 'text', modes: ['read', 'gaps', 'type', 'flash'] },
];
export const modesOf = (kind: TsKind) => TS_GROUPS.filter((g) => g.kind === kind).flatMap((g) => g.modes);

/** Fonts of the player; Druckschrift (Gruschudru) is not shipped with us. */
export const TS_FONTS = [
  { id: 'lexend', label: 'Lexend', hint: 'besonders leicht lesbar', family: 'Lexend' },
  { id: 'nunito', label: 'Nunito', hint: 'serifenlos, freundlich', family: 'Nunito' },
  { id: 'atkinson', label: 'Atkinson Hyperlegible', hint: 'gut unterscheidbare Buchstaben', family: 'Atkinson Hyperlegible' },
  { id: 'andika', label: 'Andika', hint: 'für Leseanfänger, einstöckiges a', family: 'Andika' },
  { id: 'merriweather', label: 'Merriweather', hint: 'mit Serifen', family: 'Merriweather' },
  { id: 'caveat', label: 'Caveat', hint: 'Handschrift', family: 'Caveat' },
  { id: 'grund', label: 'Grundschrift', hint: 'Playwrite DE Grund', family: 'Playwrite DE Grund' },
  { id: 'schreib', label: 'Schreibschrift VA', hint: 'Vereinfachte Ausgangsschrift', family: 'Playwrite DE VA' },
  { id: 'sas', label: 'Schreibschrift SAS', hint: 'Schulausgangsschrift', family: 'Playwrite DE SAS' },
] as const;
/** Player font families (“TS …”) and the family of the same font in our page. */
export const TS_FAMILIES: Record<string, string> = {
  'TS Lexend': 'Lexend', 'TS Nunito': 'Nunito', 'TS Atkinson Hyperlegible': 'Atkinson Hyperlegible', 'TS Andika': 'Andika',
  'TS Merriweather': 'Merriweather', 'TS Caveat': 'Caveat', 'TS Grundschrift': 'Playwrite DE Grund',
  'TS Schreibschrift': 'Playwrite DE VA', 'TS Schreibschrift SAS': 'Playwrite DE SAS', 'TS Druckschrift': 'Andika',
};

export const MEMORY_BACKS = [
  { id: 'dots', label: 'Punkte' }, { id: 'stripes', label: 'Streifen' }, { id: 'checks', label: 'Karo' },
  { id: 'waves', label: 'Wellen' }, { id: 'stars', label: 'Sterne' }, { id: 'plain', label: 'Einfarbig' },
] as const;
export const MEMORY_COLORS = [
  { id: 'sky', label: 'Himmelblau', bg: '#d6e2ee', ink: '#a9bfd6' }, { id: 'sage', label: 'Salbei', bg: '#d8e3d3', ink: '#adc2a5' },
  { id: 'sand', label: 'Sand', bg: '#e8dfcd', ink: '#cdbb98' }, { id: 'lavender', label: 'Lavendel', bg: '#e0dbed', ink: '#bbb0d6' },
  { id: 'rose', label: 'Rosé', bg: '#eedada', ink: '#d4b0b0' }, { id: 'slate', label: 'Schiefer', bg: '#dadfe6', ink: '#adb6c4' },
] as const;

/** Defaults of Textsachen. */
export const TS_SETTINGS = {
  font: 'lexend', scale: 1, shuffle: true, helpSpeak: true, helpFlash: true, rate: 0.9, readQuiz: true, showSource: true,
  flashDuration: 1.5, flashDynamic: true, speakTask: true, syllables: false,
  memoryPairs: 'word' as 'picture' | 'word' | 'sound', memoryPlayers: 1 as 1 | 2, memoryMax: 8, memoryBack: 'dots', memoryColor: 'sky',
  mouseSteps: 8, mouseHint: false, solveWith: 'tap' as 'tap' | 'pen', searchDirections: 'easy' as 'easy' | 'diagonal' | 'all',
  wordleLength: 5 as 4 | 5 | 6, wordleRounds: 5,
};
export type TsSettings = typeof TS_SETTINGS;
export type TsWord = { text: string; image?: string };
export type TsPicture = { word: string; image: string };
export type TsConfig = {
  mode: TsMode; kind: TsKind; words: TsWord[]; text: string;
  /** Indices of the learning words in the text (see `textWords`). */
  learn: number[];
  /** Pictures of words in the text, by the word in lower case. */
  pictures: TsPicture[];
  settings: TsSettings;
};

const SAMPLE_WORDS = ['die Sonne', 'das Haus', 'der Apfel', 'die Blume', 'die Katze', 'der Baum'];
export const SAMPLE_TEXT = 'Im Herbst sucht der Igel viel Futter. Er frisst Käfer und Würmer. Dann schläft er unter den Blättern.';

export function defaultTs(mode: TsMode = 'picture'): TsConfig {
  const kind: TsKind = (['read', 'gaps', 'type'] as TsMode[]).includes(mode) ? 'text' : 'words';
  const words = textWords(SAMPLE_TEXT);
  return {
    mode, kind, words: SAMPLE_WORDS.map((text) => ({ text })), text: SAMPLE_TEXT,
    learn: ['Igel', 'Futter', 'Käfer', 'Blättern'].map((w) => words.indexOf(w)).filter((i) => i >= 0),
    pictures: [], settings: { ...TS_SETTINGS },
  };
}

const clamp = (v: unknown, fallback: number, min: number, max: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback);
const flag = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback);
const pick = <T extends string | number>(v: unknown, values: readonly T[], fallback: T) => (values.includes(v as T) ? (v as T) : fallback);
const media = (v: unknown) => (typeof v === 'string' && v ? v : undefined);

export function tsConfig(raw: unknown): TsConfig {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<TsConfig> & { settings?: Partial<TsSettings> };
  const kind: TsKind = v.kind === 'text' ? 'text' : 'words';
  const mode = pick(v.mode, modesOf(kind), modesOf(kind)[0]);
  const s: Partial<TsSettings> = v.settings || {};
  return {
    mode, kind,
    words: (Array.isArray(v.words) ? v.words : []).filter((w) => w && typeof w.text === 'string').slice(0, 60).map((w) => ({ text: w.text.slice(0, 80), ...(media(w.image) ? { image: w.image } : {}) })),
    text: typeof v.text === 'string' ? v.text.slice(0, 6000) : '',
    learn: (Array.isArray(v.learn) ? v.learn : []).filter((n) => Number.isInteger(n) && n >= 0).slice(0, 200),
    pictures: (Array.isArray(v.pictures) ? v.pictures : []).filter((p) => p && typeof p.word === 'string' && media(p.image)).slice(0, 200),
    settings: {
      font: pick(s.font, TS_FONTS.map((f) => f.id), 'lexend'),
      scale: pick(s.scale, [1, 1.25, 1.5] as const, 1),
      shuffle: flag(s.shuffle, true), helpSpeak: flag(s.helpSpeak, true), helpFlash: flag(s.helpFlash, true),
      rate: clamp(s.rate, 0.9, 0.6, 1.2), readQuiz: flag(s.readQuiz, true), showSource: flag(s.showSource, true),
      flashDuration: clamp(s.flashDuration, 1.5, 0.5, 5), flashDynamic: flag(s.flashDynamic, true),
      speakTask: flag(s.speakTask, true), syllables: flag(s.syllables, false),
      memoryPairs: pick(s.memoryPairs, ['picture', 'word', 'sound'] as const, 'word'),
      memoryPlayers: s.memoryPlayers === 2 ? 2 : 1, memoryMax: Math.round(clamp(s.memoryMax, 8, 3, 15)),
      memoryBack: pick(s.memoryBack, MEMORY_BACKS.map((b) => b.id), 'dots'),
      memoryColor: pick(s.memoryColor, MEMORY_COLORS.map((c) => c.id), 'sky'),
      mouseSteps: Math.round(clamp(s.mouseSteps, 8, 5, 12)), mouseHint: flag(s.mouseHint, false),
      solveWith: s.solveWith === 'pen' ? 'pen' : 'tap',
      searchDirections: pick(s.searchDirections, ['easy', 'diagonal', 'all'] as const, 'easy'),
      wordleLength: s.wordleLength === 4 || s.wordleLength === 6 ? s.wordleLength : 5,
      wordleRounds: Math.round(clamp(s.wordleRounds, 5, 1, 20)),
    },
  };
}

/** The words of a text the way the player counts them. */
export const textWords = (text: string): string[] => text.match(/[\p{L}\p{N}]+(?:['’\-‐][\p{L}\p{N}]+)*/gu) ?? [];
export const lower = (word: string) => word.toLocaleLowerCase('de-DE');
/** “die Sonne” → “Sonne”: what the picture shows. */
export const withoutArticle = (word: string) => word.trim().replace(/^(der|die|das|ein|eine|einen|dem|den)\s+/i, '');

/** Words that should get a picture: every word of the list, the learning words of a text. */
export function pictureWords(c: TsConfig): string[] {
  if (c.kind === 'words') return c.words.map((w) => w.text.trim()).filter(Boolean);
  const words = textWords(c.text);
  return [...new Set(c.learn.map((i) => words[i]).filter(Boolean).map(lower))];
}
export const pictureOf = (c: TsConfig, word: string) =>
  c.kind === 'words' ? c.words.find((w) => w.text.trim() === word)?.image : c.pictures.find((p) => p.word === lower(word))?.image;

/** Problems like the checklist of Textsachen (only the ones that stop a game). */
export function tsProblems(c: TsConfig): string[] {
  const out: string[] = [];
  if (c.kind === 'text') {
    if (!textWords(c.text).length) out.push('Es gibt noch keinen Text.');
    if (c.mode === 'gaps' && !c.learn.length) out.push('Für den Lückentext bitte Lernwörter wählen.');
    if (c.mode === 'flash' && c.pictures.length < 3) out.push('Für das Blitzlesen werden mindestens 3 Lernwörter mit Bildern gebraucht.');
    return out;
  }
  const words = c.words.filter((w) => w.text.trim()), pictured = words.filter((w) => w.image).length;
  if (!words.length && c.mode !== 'wordle') out.push('Es gibt noch keine Wörter.');
  else if ((c.mode === 'memory' || c.mode === 'crossword') && pictured < 2) out.push(`Für ${c.mode === 'memory' ? 'das Memory' : 'das Kreuzworträtsel'} werden mindestens 2 Wörter mit Bildern gebraucht (jetzt: ${pictured}).`);
  else if (c.mode === 'flash' && pictured < 3) out.push(`Für das Blitzlesen werden mindestens 3 Wörter mit Bildern gebraucht (jetzt: ${pictured}).`);
  else if (c.mode === 'picture' && !pictured) out.push('Für das Bilddiktat braucht jedes Wort ein Bild.');
  return out;
}

/** The task for the player; pictures come as data addresses (`dataUrls`). */
export function playerTask(c: TsConfig, title: string, dataUrls: Map<string, string>) {
  const assets: Record<string, { dataUrl: string; mime: string }> = {};
  const asset = (src?: string) => {
    const dataUrl = src && dataUrls.get(src);
    if (!dataUrl) return undefined;
    const id = 'img' + Object.keys(assets).length;
    assets[id] = { dataUrl, mime: dataUrl.slice(5, dataUrl.indexOf(';')) };
    return id;
  };
  const textImages: Record<string, string> = {};
  if (c.kind === 'text') for (const p of c.pictures) { const id = asset(p.image); if (id) textImages[lower(p.word)] = id; }
  return {
    format: 'textsachen-aufgabe', version: 1, id: 'gsb', title, kind: c.kind, mode: c.mode,
    words: c.kind === 'words' ? c.words.filter((w) => w.text.trim()).map((w, i) => {
      const imageId = asset(w.image);
      return { id: 'w' + i, text: w.text.trim(), ...(imageId ? { imageId } : {}) };
    }) : [],
    text: c.kind === 'text' ? c.text : '',
    learn: c.kind === 'text' ? c.learn : [],
    textImages, settings: { ...c.settings, passPercent: 80 }, assets,
  };
}
