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
  karo5: 'Kariert · 5 mm',
  karo10: 'Kariert · 1 cm',
  rechnen: 'Rechenkästchen',
  punkte: 'Punktraster',
  noten: 'Notenlinien',
  bildzeilen: 'Bild mit Schreibzeilen',
} as const;
export type Ruling = keyof typeof rulings;
export const fonts = {
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
  font?: Font;
  fontSize?: number;
  bold?: boolean;
  src?: string;
  alt?: string;
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
  background?: string;
  textFrame?: string;
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
  ruling: Ruling;
  paperColor?: string;
  lineColor?: string;
  pageFrame?: string;
  frameColor?: string;
  backgroundImage?: string;

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
};
export type BookData = { book: Notebook; pages: Page[] };
export function dimensions(page: Pick<Page, 'orientation'>) {
  return page.orientation === 'landscape'
    ? { width: 297, height: 210 }
    : { width: 210, height: 297 };
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
