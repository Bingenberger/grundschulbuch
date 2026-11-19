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
  /** Silben rot und blau (Silbenmethode); beim Schreiben schwarz. */
  syllables?: boolean;
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
  /** Preview picture of a video, copied into the own media store. */
  poster?: string;
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
  /** Ties the child copies of one distribution together. */
  distributionId?: string;
  distributedAt?: string;
  /** Collected by the teacher: the child may only look at it. */
  collected?: boolean;
  collectedAt?: string | null;
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
/** Free room around the content of endless paper, in mm. */
export const ENDLESS_MARGIN = 200;
/** Endless paper grows and shrinks in steps of this size, so the view stays calm. */
export const ENDLESS_STEP = 100;
/** Furthest an element of endless paper may lie from the origin, in mm. */
export const ENDLESS_LIMIT = 50000;
/**
 * Visible area of a page in mm. A4 pages start at the origin. Endless paper is
 * an open surface: elements may lie anywhere (also at negative coordinates) and
 * the area covers the first sheet and all content with free room on every side,
 * so it grows (and shrinks again) in all four directions.
 */
export function dimensions(page: Pick<Page, 'orientation'> & Partial<Pick<Page,'paperMode'|'elements'>>) {
  const width=page.orientation==='landscape'?297:210;
  const base=page.orientation==='landscape'?210:297;
  if(page.paperMode!=='endless')return {width,height:base,left:0,top:0};
  let x0=0,y0=0,x1=width,y1=base;
  for(const el of page.elements||[]){
    if(!Number.isFinite(el.x)||!Number.isFinite(el.y))continue;
    x0=Math.min(x0,el.x);y0=Math.min(y0,el.y);
    x1=Math.max(x1,el.x+(el.width||0));y1=Math.max(y1,el.y+(el.height||0));
  }
  const low=(v:number)=>Math.floor((v-ENDLESS_MARGIN)/ENDLESS_STEP)*ENDLESS_STEP;
  const high=(v:number)=>Math.ceil((v+ENDLESS_MARGIN)/ENDLESS_STEP)*ENDLESS_STEP;
  const left=low(x0),top=low(y0);
  return {width:high(x1)-left,height:high(y1)-top,left,top};
}
/** Whether all content of a page lies on one A4 sheet (needed to leave endless paper). */
export function fitsSheet(page: Pick<Page, 'elements'>, orientation: Page['orientation']) {
  const { width, height } = sheetSize({ orientation });
  return page.elements.every(e => e.x >= -0.5 && e.y >= -0.5 && e.x + e.width <= width + 0.5 && e.y + e.height <= height + 0.5);
}
/** Size of the first sheet: A4 in the page's orientation. */
export function sheetSize(page: Pick<Page, 'orientation'>) {
  return page.orientation==='landscape'?{width:297,height:210}:{width:210,height:297};
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

/**
 * Tools that stay where they are when a finger drags on them: dragging inside
 * belongs to the tool (figures of the puppet theatre). They move only by the
 * „Verschieben“ handle of the selection.
 */
export const anchoredOnPage = (el: Pick<PageElement, 'type' | 'widgetKind'>) => el.type === 'widget' && el.widgetKind === 'puppentheater';
