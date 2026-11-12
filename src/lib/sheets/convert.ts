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
  alt?: string;
  /** Picture shipped with the app (`/kasse/…`, `/bilder/…`). */
  src?: string;
};
export type RefPage = { items: RefItem[]; paper?: string };

/** mm per reference unit (1400 units = 297 mm). */
export const UNIT = 297 / 1400;
const PT = 25.4 / 72;
const FONTS: Record<string, Font> = { andika: 'Andika', nunito: 'Nunito', grund: 'Playwrite DE Grund', schreib: 'Playwrite DE VA', sas: 'Playwrite DE SAS', druck: 'Andika' };
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

/** `Ap<span style="color:#d6336c">f</span>el` → coloured runs. */
function runs(html: string): PageElement['runs'] | undefined {
  if (!/<span style="color:/.test(html)) return undefined;
  const out: NonNullable<PageElement['runs']> = [];
  const re = /<span style="color:(#[0-9a-fA-F]{3,8})">(.*?)<\/span>/g;
  let last = 0;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    if (m.index > last) out.push({ text: decode(html.slice(last, m.index)) });
    out.push({ text: decode(m[2]), color: m[1] });
    last = m.index + m[0].length;
  }
  if (last < html.length) out.push({ text: decode(html.slice(last)) });
  return out.filter((r) => r.text);
}

export const svgData = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

function element(item: RefItem): PageElement {
  const base = { id: uuid(), x: r2(item.x * UNIT), y: r2(item.y * UNIT), width: r2(item.w * UNIT), height: r2(item.h * UNIT), rotation: 0, locked: false };
  if (item.type === 'text') {
    const size = item.size ?? 32;
    // One line fills the box like in the reference (text centred in its line).
    const lineHeight = Math.max(0.8, Math.min(8, item.h / size));
    return {
      ...base,
      type: 'text',
      color: item.color || '#1f2937',
      text: decode(item.html || ''),
      ...(runs(item.html || '') ? { runs: runs(item.html || '') } : {}),
      font: FONTS[item.font || 'andika'] || 'Andika',
      fontSize: r2(Math.max(6, (size * UNIT) / PT)),
      bold: !!item.bold,
      align: item.align || 'left',
      lineHeight: r2(lineHeight),
      ...(item.placeholder !== undefined ? { placeholder: item.placeholder || ' ' } : {}),
    };
  }
  // A picture that is still missing: a placeholder to tap on later.
  if (item.type === 'image' && !item.src && item.placeholder)
    return { ...base, type: 'image', color: '#253c42', placeholder: item.placeholder, alt: item.alt || item.name || '' };
  return {
    ...base,
    type: 'image',
    color: '#253c42',
    src: item.src || svgData(item.svg || '<svg xmlns="http://www.w3.org/2000/svg"/>'),
    alt: item.alt || item.name || '',
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
  // Pictures shipped with the app (coins, notes) are copied to the school server.
  const copy = (src: string) => {
    if (!done.has(src))
      done.set(
        src,
        fetch(src)
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error('Ein Bild konnte nicht geladen werden.'))))
          .then(upload),
      );
    return done.get(src)!;
  };
  return Promise.all(
    pages.map(async (page) => ({
      ...page,
      elements: await Promise.all(
        page.elements.map(async (el) =>
          el.type === 'image' && el.src?.startsWith('data:image/svg+xml')
            ? { ...el, src: await store(el) }
            : el.type === 'image' && el.src && (/^\/(kasse|bilder)\/[a-z0-9-]+\.webp$/.test(el.src) || /^data:image\/(png|webp|jpeg);/.test(el.src))
              ? { ...el, src: await copy(el.src) }
              : el,
        ),
      ),
    })),
  );
}
