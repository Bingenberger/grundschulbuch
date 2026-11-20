// “Meine Sammlung” sorted like the shelf of Lernsachen-Heft 1.49.0: own
// figures and talking photos go to “Selbst gemacht”, everything else to
// “Persönlich”; a name is suggested from what is put there.
import type { PageElement } from './notebook-model';

export type ShelfCategory = 'made' | 'personal';
export const SHELF_LABELS: Record<ShelfCategory, string> = { made: 'Selbst gemacht', personal: 'Persönlich' };

export const isMade = (el: PageElement) => el.type === 'widget' && (el.widgetKind === 'figur' || el.widgetKind === 'sprechfoto');
/** Only figures and talking photos: “Selbst gemacht”. */
export const shelfCategory = (elements: PageElement[]): ShelfCategory => (elements.length > 0 && elements.every(isMade) ? 'made' : 'personal');

const words = (text: unknown, n = 5) => (typeof text === 'string' ? text.trim().split(/\s+/).filter(Boolean).slice(0, n).join(' ') : '');
function nameOf(el: PageElement): string {
  const s = (el.settings ?? {}) as { av?: { name?: unknown }; say?: { text?: unknown }; title?: unknown };
  if (el.type === 'widget' && el.widgetKind === 'figur') return words(s.av?.name, 8) || 'Meine Figur';
  if (el.type === 'widget' && el.widgetKind === 'sprechfoto') return words(s.say?.text) || 'Sprechendes Foto';
  if (el.type === 'image') return el.alt?.trim() || 'Bild';
  if (el.type === 'sticker') return el.alt?.trim() || el.symbol || 'Sticker';
  if (el.type === 'stroke') return el.alt?.trim() || 'Zeichnung';
  if (el.type === 'text') return words(el.text) || 'Text';
  if (el.type === 'widget' || el.type === 'activity') return words(s.title, 8) || 'Lernwerkzeug';
  return 'Element';
}
const kindOf = (el: PageElement) =>
  el.type === 'widget' && el.widgetKind === 'figur' ? 'Figur'
    : el.type === 'widget' && el.widgetKind === 'sprechfoto' ? 'Sprechendes Foto'
      : el.type === 'image' ? 'Bild' : el.type === 'sticker' ? 'Sticker' : el.type === 'stroke' ? 'Zeichnung' : el.type === 'text' ? 'Text' : 'Element';

/** Suggested name: the figure's name, the photo's words … or “Figur (3 Teile)”. */
export function shelfName(elements: PageElement[]): string {
  if (elements.length === 1) return nameOf(elements[0]).slice(0, 60);
  const kinds = [...new Set(elements.map(kindOf))];
  return (kinds.length === 1 ? `${kinds[0]} (${elements.length} Teile)` : kinds.join(' und ')).slice(0, 60);
}
