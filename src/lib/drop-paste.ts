// Hineinziehen und Einfügen aus anderen Apps, dazu die Zwischenablage für
// Elemente und Seiten, die auch in einem anderen Heft gilt (sessionStorage:
// bleibt in diesem Tab beim Wechsel des Hefts, verschwindet mit dem Tab).
import type { Page, PageElement } from './notebook-model';
import { detectVideo } from './video-address.mjs';

export type DroppedKind = 'image' | 'audio' | 'pdf' | 'book' | null;

/** Was mit einer hineingezogenen oder eingefügten Datei passiert. */
export function fileKind(file: { name: string; type: string }): DroppedKind {
  const name = file.name.toLowerCase(),
    type = file.type.toLowerCase();
  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (/\.(grundschulbuch|epub)$/.test(name) || type === 'application/epub+zip') return 'book';
  if (name.endsWith('.html') || name.endsWith('.htm') || type === 'text/html') return 'book';
  if (type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|heic|avif)$/.test(name)) return 'image';
  if (type.startsWith('audio/') || /\.(mp3|m4a|wav|ogg|oga|aac|webm|opus)$/.test(name)) return 'audio';
  return null;
}

/** Eine einzelne Webadresse (http/https), sonst null. */
export function pastedUrl(text: string): string | null {
  const t = text.trim();
  if (!t || /\s/.test(t)) return null;
  try {
    const url = new URL(t);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

/** Video addresses (YouTube, Vimeo, ARD/ZDF Mediathek, video files) become videos, others link cards. */
export function embedKindFor(url: string): 'video' | 'link' {
  return detectVideo(url) ? 'video' : 'link';
}

/** Markierung in der System-Zwischenablage: „Einfügen“ nimmt dann die Elemente aus dem Heft. */
export const CLIPBOARD_MARKER = 'grundschulbuch:elemente';

const ELEMENTS = 'grundschulbuch-zwischenablage-elemente',
  PAGES = 'grundschulbuch-zwischenablage-seiten';
function read<T>(key: string): T[] {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
function write(key: string, value: unknown[]) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Speicher voll oder gesperrt: dann gilt die Zwischenablage nur in diesem Heft.
  }
}
export const loadElementClipboard = () => read<PageElement>(ELEMENTS);
export const saveElementClipboard = (elements: PageElement[]) => write(ELEMENTS, elements);
export const loadPageClipboard = () => read<Page>(PAGES);
export const savePageClipboard = (pages: Page[]) => write(PAGES, pages);
