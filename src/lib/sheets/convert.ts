// Turns the pages of the reference worksheet generators (units 1400 × 990,
// A4 landscape) into our pages (mm). Drawn parts arrive as SVG; before they
// are saved, `materialize` stores them as pictures on the school server.
import { newPage, uuid, type Font, type Page, type PageElement } from '../notebook-model';

export type RefItem = {
  type: 'text' | 'sticker' | 'image';
  x: number;
  y: number;
  w: number;
  h: number;
  size?: number;
  html?: string;
  font?: string;
  align?: 'left' | 'center' | 'right';
  color?: string;
  bold?: boolean;
  placeholder?: string;
  svg?: string;
  name?: string;
  /** Picture shipped with the app (`/kasse/…`, `/bilder/…`). */
  src?: string;
};
export type RefPage = { items: RefItem[]; paper?: string };

/** mm per reference unit (1400 units = 297 mm). */
export const UNIT = 297 / 1400;
const PT = 25.4 / 72;
const FONTS: Record<string, Font> = { andika: 'Andika', nunito: 'Nunito', grund: 'Playwrite DE Grund', schreib: 'Playwrite DE VA', sas: 'Playwrite DE SAS' };
const r2 = (v: number) => Math.round(v * 100) / 100;

const decode = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

export const svgData = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

function element(item: RefItem): PageElement {
  const base = { id: uuid(), x: r2(item.x * UNIT), y: r2(item.y * UNIT), width: r2(item.w * UNIT), height: r2(item.h * UNIT), rotation: 0, locked: true };
  if (item.type === 'text') {
    const size = item.size ?? 32;
    // One line fills the box like in the reference (text centred in its line).
    const lineHeight = Math.max(0.8, Math.min(8, item.h / size));
    return {
      ...base,
      type: 'text',
      color: item.color || '#1f2937',
      text: decode(item.html || ''),
      font: FONTS[item.font || 'andika'] || 'Andika',
      fontSize: r2(Math.max(6, (size * UNIT) / PT)),
      bold: !!item.bold,
      align: item.align || 'left',
      lineHeight: r2(lineHeight),
      ...(item.placeholder !== undefined ? { placeholder: item.placeholder || ' ' } : {}),
    };
  }
  return {
    ...base,
    type: 'image',
    color: '#253c42',
    src: item.src || svgData(item.svg || '<svg xmlns="http://www.w3.org/2000/svg"/>'),
    alt: item.name || '',
    fit: 'contain',
  };
}

export function toPages(refPages: RefPage[], template?: string): Page[] {
  return refPages.map((ref) => {
    const page = newPage('blanko', 'landscape');
    if (template) page.template = template;
    if (ref.paper && ref.paper !== '#ffffff') page.paperColor = ref.paper;
    page.elements = ref.items.map(element);
    return page;
  });
}

/** Draws an SVG into a PNG (2 pixels per unit, sharp enough for printing). */
async function svgToPng(src: string, width: number, height: number): Promise<Blob> {
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  await image.decode();
  const scale = 2 / UNIT;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Eine Grafik konnte nicht gezeichnet werden.'))), 'image/png'));
}

/** Stores the drawn parts as pictures, so the pages can be saved and shared. */
export async function materialize(pages: Page[], upload: (png: Blob) => Promise<string>): Promise<Page[]> {
  const done = new Map<string, Promise<string>>();
  const store = (el: PageElement) => {
    const key = `${el.src}|${el.width}x${el.height}`;
    if (!done.has(key)) done.set(key, svgToPng(el.src!, el.width, el.height).then(upload));
    return done.get(key)!;
  };
  return Promise.all(
    pages.map(async (page) => ({
      ...page,
      elements: await Promise.all(
        page.elements.map(async (el) => (el.type === 'image' && el.src?.startsWith('data:image/svg+xml') ? { ...el, src: await store(el) } : el)),
      ),
    })),
  );
}
