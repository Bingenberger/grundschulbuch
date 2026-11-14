// Video, Webseite and QR-Plakat of Lernsachen-Heft (Video & Web, and the slide
// “Video mit Titel”): pages with a heading, the embedded video or web page
// (our embeds) or a QR code with a picture and the address – in the layout of
// the reference (units of 1400 × 990). The reference leaves the address as a
// placeholder; here it is asked for when inserting.
import { uuid, type Page, type PageElement } from '../notebook-model';
import { toPages, UNIT, type RefItem } from '../sheets/convert';

export type MediaArt = 'video' | 'webpage' | 'qr';
export type MediaConfig = { art: MediaArt; url: string; title: string; caption: string };

export function mediaConfig(raw: unknown): MediaConfig {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<MediaConfig>;
  return {
    art: v.art === 'webpage' || v.art === 'qr' ? v.art : 'video',
    url: typeof v.url === 'string' ? v.url.trim().slice(0, 2000) : '',
    title: typeof v.title === 'string' ? v.title.slice(0, 120) : '',
    caption: typeof v.caption === 'string' ? v.caption.slice(0, 200) : '',
  };
}

/** The address, if it is a web address (http/https, no user name). */
export function webAddress(url: string): string | null {
  try {
    const a = new URL(url.includes('://') ? url : `https://${url}`);
    return ['http:', 'https:'].includes(a.protocol) && !a.username && !a.password && a.hostname.includes('.') ? a.href : null;
  } catch {
    return null;
  }
}

const r2 = (v: number) => Math.round(v * 100) / 100;
function embed(kind: NonNullable<PageElement['embedKind']>, url: string, x: number, y: number, w: number, h: number, alt: string): PageElement {
  return { id: uuid(), type: 'embed', x: r2(x * UNIT), y: r2(y * UNIT), width: r2(w * UNIT), height: r2(h * UNIT), rotation: 0, locked: false, color: '#253c42', url, embedKind: kind, alt };
}

export function mediaPages(c: MediaConfig): Page[] {
  const url = webAddress(c.url);
  if (!url) throw Error('Bitte eine Internetadresse eingeben (http oder https).');
  const text = (item: Omit<RefItem, 'type'>): RefItem => ({ type: 'text', ...item });
  let items: RefItem[] = [];
  let embeds: PageElement[] = [];
  if (c.art === 'video' && c.title.trim()) {
    // Folie „Video mit Titel“.
    items = [text({ x: 70, y: 46, w: 1260, h: 90, size: 56, bold: true, font: 'nunito', html: c.title }), text({ x: 160, y: 775, w: 1080, h: 64, size: 32, align: 'center', font: 'nunito', color: '#475569', html: c.caption, placeholder: 'Darum geht es im Video' })];
    embeds = [embed('video', url, 260, 250, 880, 495, c.title)];
  } else if (c.art === 'video') {
    embeds = [embed('video', url, 60, 135, 1280, 720, 'Video')];
  } else if (c.art === 'webpage') {
    embeds = [embed('webpage', url, 50, 50, 1300, 890, c.title || 'Webseite')];
  } else {
    const host = new URL(url).hostname.replace(/^www\./, '');
    items = [
      text({ x: 70, y: 50, w: 1260, h: 130, size: 84, bold: true, font: 'nunito', align: 'center', html: c.title, placeholder: 'Überschrift' }),
      { type: 'image', x: 765, y: 250, w: 510, h: 510, placeholder: 'Bild' },
      text({ x: 110, y: 848, w: 1180, h: 74, size: 48, bold: true, align: 'center', color: '#0369a1', html: c.caption || host }),
    ];
    embeds = [embed('qr', url, 125, 250, 510, 510, c.title || host)];
  }
  const [page] = toPages([{ items }]);
  page.elements = [...page.elements, ...embeds];
  return [page];
}
