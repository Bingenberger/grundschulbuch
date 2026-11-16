'use client';
// Settings of the Linksammlung with the choices of the reference's dialog:
// heading, layout, colour, Lernpfad, links with title, address, description and
// picture – and the collection itself as a preview. (The reference also fetches
// title and picture of a page by itself; that would reach outside services, so
// here they are typed in or chosen.)
import { useLayoutEffect, useRef } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { toolAssets } from '@/lib/learning/werkzeuge';
import { BOOKMARK_COLORS, BOOKMARK_LAYOUTS, BOOKMARKS_CSS, renderBookmarks } from '@/lib/reference/tools-runtime';
import { linksConfig } from './BookmarksWidget';
import ToolForm, { type Field } from './ToolForm';

const FIELDS: Field[] = [
  { t: 'text', key: 'title', label: 'Überschrift', placeholder: 'Meine Links (leer: keine Überschrift)', max: 120 },
  { t: 'list', key: 'links', label: 'Links', what: 'Link', max: 12, text: 'title', placeholder: 'Titel', textMax: 200, picture: true,
    extras: [{ key: 'url', label: 'Webadresse', placeholder: 'https://…', max: 400, wide: true }, { key: 'desc', label: 'Beschreibung', placeholder: 'Kurze Beschreibung (kann leer bleiben)', max: 400, wide: true }],
    fresh: () => ({ title: '', url: '', desc: '' }) },
  { t: 'choice', key: 'layout', label: 'Anordnung', options: BOOKMARK_LAYOUTS as unknown as { value: string; label: string }[] },
  { t: 'colors', key: 'color', label: 'Farbe', colors: BOOKMARK_COLORS as unknown as string[] },
  { t: 'toggle', key: 'path', label: 'Lernpfad: der Reihe nach öffnen', hint: 'Die Links bekommen Nummern. Der nächste lässt sich erst öffnen, wenn der vorige geöffnet wurde; geöffnete bekommen einen grünen Haken. Der Stand bleibt in diesem Browser, „Von vorn“ setzt ihn zurück.' },
  { t: 'note', text: 'Kinder öffnen die Links nur, wenn für sie „Internet“ eingeschaltet ist.' },
];

function Preview({ bm }: { bm: Record<string, unknown> }) {
  const box = useRef<HTMLDivElement>(null);
  const key = JSON.stringify(bm);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    delete el.dataset.k;
    renderBookmarks(el, { id: 'links-preview', w: el.clientWidth || 560, h: el.clientHeight || 396, bm }, false, { assets: toolAssets(bm) });
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="tool-preview" style={{ aspectRatio: '1400 / 990' }}>
      <style>{BOOKMARKS_CSS}</style>
      <div ref={box} className="reference-widget lh-wg-bookmarks" role="group" aria-label="Vorschau" style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}

export default function LinksOptions({ value, onChange, upload, busy }: { value: unknown; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean }) {
  const bm = linksConfig(value);
  return (
    <div className="receipt-options tool-options">
      <Preview bm={bm} />
      <p className="option-hint">Ein Tipp auf einen Link öffnet ihn in einem neuen Fenster.</p>
      <ToolForm fields={FIELDS} value={bm} onChange={(d) => onChange(linksConfig(d) as unknown as JsonValue)} upload={upload} busy={busy} />
    </div>
  );
}
