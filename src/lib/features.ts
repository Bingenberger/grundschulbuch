// One list of editor functions decides what each person sees. Teachers see
// everything; children see a fixed default set for now. Later, per-class or
// per-child switches only need to produce a different Set<Feature>.
import type { Notebook } from './notebook-model';
import { CHILD_DEFAULTS } from './child-features.mjs';

export const featureLabels = {
  // Left toolbar
  select: 'Auswahl',
  pen: 'Stift',
  eraser: 'Radierer',
  text: 'Text',
  image: 'Bild',
  audio: 'Ton',
  learning: 'Lernwerkzeuge',
  insert: 'Einfügen',
  page: 'Seite',
  // Items of “Einfügen”
  shapes: 'Formen & Symbole',
  stamp: 'Stempel',
  templates: 'Vorlagen',
  worksheet: 'Arbeitsblatt',
  collection: 'Sammlung',
  internet: 'Internet',
  // Drawing
  brushFountain: 'Füller',
  brushWater: 'Aquarell',
  fill: 'Farbeimer',
  eyedropper: 'Pipette',
  guides: 'Lineal & Geodreieck',
  shapeRecognition: 'Formen erkennen',
  eraserOptions: 'Radierer einstellen',
  // Elements
  elementStyle: 'Element gestalten',
  elementArrange: 'Ebenen & Gruppen',
  elementLock: 'Sperren',
  elementClipboard: 'Kopieren & Einfügen',
  elementGeometry: 'Maße & Position',
  // Pages and book
  pages: 'Seitenübersicht',
  addPage: 'Seite hinzufügen',
  pageDesign: 'Seite gestalten',
  pageManage: 'Seiten verwalten',
  rename: 'Heft umbenennen',
  redo: 'Wiederholen',
  files: 'Dateien',
  board: 'Tafelmodus',
  share: 'Weitergeben',
  print: 'Drucken',
  help: 'Hilfe',
  readAloud: 'Vorlesen',
} as const;
export type Feature = keyof typeof featureLabels;

const allFeatures = Object.keys(featureLabels) as Feature[];

export function featuresFor(
  mode: 'teacher' | 'child',
  book?: Pick<Notebook, 'allowChildAudio' | 'allowChildPages'> | null,
  /** Functions the teacher allows this child (per class or per child). */
  childFeatures?: readonly string[],
): Set<Feature> {
  if (mode === 'teacher') return new Set(allFeatures.filter((f) => f !== 'readAloud'));
  const features = new Set<Feature>([
    'select',
    ...((childFeatures ?? CHILD_DEFAULTS) as Feature[]).filter((f) => f in featureLabels),
  ]);
  if (book?.allowChildAudio) features.add('audio');
  if (book?.allowChildPages) features.add('addPage');
  return features;
}
