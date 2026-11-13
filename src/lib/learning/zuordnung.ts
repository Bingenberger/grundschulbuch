// Zuordnungen of Schiebesachen (Lernsachen.blog): from a list of words, groups
// or pairs the builder of Schiebesachen (reference/schiebesachen-builder.ts)
// makes an exercise – Bild und Wort, Sortieren, Artikel, Reihenfolge, Paare,
// Buchstabieren, Silbenlesen – which the original player (DnDPlayer) runs.
// The exercise is built once in the settings and kept, so a child's state
// (which refers to its cards) stays valid; pictures are media addresses.

export const DND_FORMATS = ['bildwort', 'sortieren', 'artikel', 'reihenfolge', 'paare', 'buchstabieren', 'silben'] as const;
export type DndFormat = (typeof DND_FORMATS)[number];
export type DndConfig = {
  format: DndFormat;
  /** The list as in Schiebesachen: one card per line, “# Oberbegriff”, “A = B”, “- Ablenker”, “[Bild: …]”. */
  text: string;
  design: string;
  /** Bild und Wort: the pictures are dragged (instead of the words). */
  dragPictures: boolean;
  /** Silbenlesen: what stands next to the boxes. */
  syllableHelp: 'bild' | 'wort' | 'hoeren';
  syllableColors: boolean;
  autoPictures: boolean;
  /** Pictures by search term (the word, or what stands in “[Bild: …]”). */
  pictures: { term: string; image: string }[];
  /** The exercise made by the builder (assets point to media addresses). */
  exercise?: Record<string, unknown>;
};

/** Player font families (“DnD …”) and the family of the same font in our page. */
export const DND_FAMILIES: Record<string, string> = {
  'DnD Nunito': 'Nunito', 'DnD Lexend': 'Lexend', 'DnD Atkinson Hyperlegible': 'Atkinson Hyperlegible',
  'DnD Andika': 'Andika', 'DnD Merriweather': 'Merriweather', 'DnD Caveat': 'Caveat',
};

export function defaultDnd(format: DndFormat = 'bildwort'): DndConfig {
  return { format, text: '', design: format === 'silben' || format === 'buchstabieren' ? 'fibel' : 'klar', dragPictures: false, syllableHelp: 'bild', syllableColors: true, autoPictures: true, pictures: [] };
}

export function dndConfig(raw: unknown): DndConfig {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<DndConfig>;
  const format = DND_FORMATS.includes(v.format as DndFormat) ? (v.format as DndFormat) : 'bildwort';
  const base = defaultDnd(format);
  return {
    format,
    text: typeof v.text === 'string' ? v.text.slice(0, 4000) : '',
    design: typeof v.design === 'string' ? v.design : base.design,
    dragPictures: v.dragPictures === true,
    syllableHelp: v.syllableHelp === 'wort' || v.syllableHelp === 'hoeren' ? v.syllableHelp : 'bild',
    syllableColors: v.syllableColors !== false,
    autoPictures: v.autoPictures !== false,
    pictures: (Array.isArray(v.pictures) ? v.pictures : []).filter((p) => p && typeof p.term === 'string' && typeof p.image === 'string' && p.image).slice(0, 80),
    ...(v.exercise && typeof v.exercise === 'object' ? { exercise: v.exercise } : {}),
  };
}

/** Media addresses of the pictures in an exercise (to load them as data). */
export function exerciseAssets(exercise: Record<string, unknown> | undefined): string[] {
  const assets = (exercise?.assets ?? {}) as Record<string, { dataUrl?: unknown }>;
  return Object.values(assets).map((a) => a?.dataUrl).filter((s): s is string => typeof s === 'string' && !s.startsWith('data:'));
}

/** The exercise for the player, with the pictures as data addresses. */
export function playerExercise(exercise: Record<string, unknown>, urls: Map<string, string>) {
  const assets = (exercise.assets ?? {}) as Record<string, Record<string, unknown>>;
  const ready: Record<string, Record<string, unknown>> = {};
  for (const [id, a] of Object.entries(assets)) {
    const src = typeof a.dataUrl === 'string' ? a.dataUrl : '';
    const data = src.startsWith('data:') ? src : urls.get(src);
    if (data) ready[id] = { ...a, dataUrl: data, mime: data.slice(5, data.indexOf(';')) };
  }
  return { ...exercise, assets: ready };
}
