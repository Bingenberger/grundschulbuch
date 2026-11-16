import type {
  ActivityKind,
  WidgetKind,
  LearningSettings,
  LearningResponse,
} from './learning/catalog';
export const rulings = {
  blanko: 'Blanko',
  linie1: 'Lineatur 1',
  linie2: 'Lineatur 2',
  linie3: 'Lineatur 3',
  linie4: 'Lineatur 4',
  linieneng: 'Linien eng',
  karo5: 'Kariert · 5 mm',
  karo10: 'Kariert · 1 cm',
  rechnen: 'Rechenkästchen',
  punkte: 'Punktraster',
  noten: 'Notenlinien',
  bildzeilen: 'Bild mit Schreibzeilen',
} as const;
export type Ruling = keyof typeof rulings;
export const fonts = {
  Arial: 'Arial',
  Andika: 'Leseschrift · Andika',
  'Playwrite DE Grund': 'Grundschrift',
  'Playwrite DE VA': 'Schreibschrift VA',
  'Playwrite DE SAS': 'Schreibschrift SAS',
  Lexend: 'Lexend',
  Nunito: 'Nunito',
  'Atkinson Hyperlegible': 'Atkinson Hyperlegible',
  Merriweather: 'Merriweather',
  Caveat: 'Handschrift · Caveat',
  Bangers: 'Comic · Bangers',
} as const;
export type Font = keyof typeof fonts;
export type Point = {
  x: number;
  y: number;
  pressure: number;
  time?: number;
  tiltX?: number;
  tiltY?: number;
};
export type Erasure = {
  id: string;
  points: { x: number; y: number }[];
  size: number;
  opacity: number;
  soft: boolean;
  tip?: 'round' | 'square' | 'slant';
  width: number;
  height: number;
};
export type PageElement = {
  id: string;
  type:
    | 'text'
    | 'image'
    | 'stroke'
    | 'audio'
    | 'shape'
    | 'sticker'
    | 'widget'
    | 'activity'
    | 'embed';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked: boolean;
  color: string;
  text?: string;
  /** Hint of an empty editable design text (not an answer field). */
  textHint?: string;
  /** A shipped vector primitive of an original page design. */
  vectorId?: string;
  /** Millimetres per unit for native placeholders from an original design. */
  designScale?: number;
  font?: Font;
  /** Exact shipped reference face; cleared when a different font is chosen. */
  referenceFont?: string;
  referencePadding?: string;
  referenceCentered?: boolean;
  referenceFrameId?: string;
  /** Fixed writing-row spacing in millimetres, independent of letter size. */
  textLinePitch?: number;
  fontSize?: number;
  bold?: boolean;
  src?: string;
  alt?: string;
  /** Native read-aloud button, using a German voice installed on the device. */
  speechText?: string;
  /** Photo placeholder: label shown until someone puts a picture in. */
  placeholder?: string;
  /** Image credit (author, licence, source), shown on the page. */
  credit?: string;
  points?: Point[];
  penWidth?: number;
  penStyle?: 'pen' | 'fountain' | 'crayon' | 'marker' | 'water';
  brushVersion?: 2;
  fillOnly?: boolean;
  nibHand?: 'left' | 'right';
  simulatePressure?: boolean;
  geometry?: 'line' | 'ellipse' | 'triangle' | 'rectangle' | 'arrow' | 'star' | 'heart';
  erasures?: Erasure[];
  opacity?: number;
  groupId?: string;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  /** Fill behind the text; 'none' removes the default fill of a frame. */
  background?: string;
  textFrame?: string;
  /** Frame line of a text box (mm); 0 hides it. */
  borderColor?: string;
  borderWidth?: number;
  runs?: {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
  }[];
  shape?: string;
  symbol?: string;
  strokeWidth?: number;
  fill?: string;
  crop?: { x: number; y: number; width: number; height: number };
  imageFilter?: string;
  imageFrame?: string;
  flip?: boolean;
  fit?: 'contain' | 'cover';
  widgetKind?: WidgetKind;
  activityKind?: ActivityKind;
  settings?: LearningSettings;
  response?: LearningResponse;
  url?: string;
  embedKind?: 'video' | 'webpage' | 'link' | 'qr' | 'app';
  /** Tapping the link badge opens a web page or another page of the notebook. */
  link?: ElementLink;
};
export type ElementLink =
  | { kind: 'url'; url: string }
  | { kind: 'page'; pageId: string };
export type Page = {
  id: string;
  revision: number;
  updatedAt?: string;
  lastEditorId?: string;
  orientation: 'portrait' | 'landscape';
  /** A vertically growing canvas; dimensions follow its contents. */
  paperMode?: 'endless';
  ruling: Ruling;
  paperColor?: string;
  lineColor?: string;
  pageFrame?: string;
  frameColor?: string;
  backgroundImage?: string;
  /** Template the page was made from or last changed to (for marking it). */
  template?: string;
  /** Class whose template rules were selected when this page was inserted. */
  templateClassId?: string;
  templateRuling?: {top:number;pitch:number;baseline:number;xHeight:number;count:number;left:number;right:number};
  paperReferenceId?: string;

  elements: PageElement[];
};
export type Notebook = {
  id: string;
  ownerId: string;
  ownerRole: 'admin' | 'lehrkraft' | 'kind';
  title: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  pageIds: string[];
  trashed?: boolean;
  classId: string | null;
  sourceId: string | null;
  allowChildPages: boolean;
  allowChildAudio?: boolean;
  folderId?: string | null;
};
export type BookSummary = Notebook & {
  preview: Page;
  pageProgress?: { index: number; updatedAt?: string; byChild: boolean }[];
};
export type Template = {
  id: string;
  title: string;
  page: Page;
  school?: boolean;
  category?: string;
  /** School template that takes the place of this built-in catalog key. */
  replaces?: string;
};
export type BookData = { book: Notebook; pages: Page[] };
export function dimensions(page: Pick<Page, 'orientation'> & Partial<Pick<Page,'paperMode'|'elements'>>) {
  const width=page.orientation==='landscape'?297:210;
  const base=page.orientation==='landscape'?210:297;
  if(page.paperMode!=='endless')return {width,height:base};
  const bottom=(page.elements||[]).reduce((max,el)=>Math.max(max,el.y+el.height),0);
  return {width,height:Math.max(594,Math.ceil((bottom+150)/100)*100)};
}
export function newPage(
  ruling: Ruling = 'blanko',
  orientation: Page['orientation'] = 'portrait',
): Page {
  return {
    id: uuid(),
    revision: 0,
    orientation,
    ruling,
    elements: [],
  };
}

/** Tight vector bounds keep transparent stroke boxes from covering other content. */
export function compactStroke(element: PageElement): PageElement {
  if (element.type !== 'stroke' || !element.points?.length) return element;
  const pad = Math.max(0.3, (element.penWidth || 0.7) * (element.brushVersion === 2 ? 1.7 : 0.5));
  const minX = Math.min(...element.points.map((p) => p.x)) - pad;
  const minY = Math.min(...element.points.map((p) => p.y)) - pad;
  const maxX = Math.max(...element.points.map((p) => p.x)) + pad;
  const maxY = Math.max(...element.points.map((p) => p.y)) + pad;
  return {
    ...element,
    x: element.x + minX,
    y: element.y + minY,
    width: maxX - minX,
    height: maxY - minY,
    points: element.points.map((p) => ({ ...p, x: p.x - minX, y: p.y - minY })),
  };
}

/** Older panel browsers have Web Crypto, but not randomUUID or structuredClone. */
export function uuid(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (n) => n.toString(16).padStart(2, '0')).join(
    '',
  );
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
