'use client';
// Linksammlung of Lernsachen-Heft 1.47.3 (also “Nachrichten in leichter
// Sprache”), drawn by the reference itself (reference/tools-runtime.ts). A tap
// on a link opens it in a new window – only where links to the internet are
// allowed (the Internet switch for children). In a Lernpfad the links open in
// order; the progress stays in this browser, as in the reference.
import { useLayoutEffect, useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { speakGerman } from '@/lib/speech';
import { BOOKMARKS_CSS, bookmarksConfig, renderBookmarks, tapBookmarks } from '@/lib/reference/tools-runtime';
import { toolAssets } from '@/lib/learning/werkzeuge';
import { useLearning } from './Runtime';

const media = (v: unknown) => (typeof v === 'string' && /^\/api\/medien\/[\w./-]+$/.test(v) ? v : undefined);
export const linksConfig = (raw: unknown) => bookmarksConfig(raw, media) as Record<string, unknown>;

export default function BookmarksWidget({ element }: { element: PageElement }) {
  const { interactive, allowExternal } = useLearning(element);
  const box = useRef<HTMLDivElement>(null);
  const bm = linksConfig(element.settings?.bm);
  const key = JSON.stringify(bm);
  const item = () => ({ id: element.id, w: box.current?.clientWidth || 1400, h: box.current?.clientHeight || 990, bm });
  const draw = () => { const el = box.current; if (el) renderBookmarks(el, item(), interactive, { assets: toolAssets(bm) }); };
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    delete el.dataset.k;
    draw();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => draw());
    observer?.observe(el);
    return () => observer?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, interactive, element.id]);
  return (
    <>
      <style>{BOOKMARKS_CSS}</style>
      <div
        ref={box}
        className="reference-widget lh-wg-bookmarks"
        role="group"
        onPointerDown={(e) => { if (interactive && (e.target as Element).closest('[data-i], [data-a]')) e.stopPropagation(); }}
        onClick={(e) => {
          if (!interactive) return;
          const target = e.target as Element;
          if (target.closest('[data-i]') && !allowExternal) { speakGerman('Links ins Internet sind hier ausgeschaltet.'); return; }
          const note = tapBookmarks(item(), target, () => { delete box.current!.dataset.k; draw(); });
          if (typeof note === 'string') speakGerman(note);
        }}
      />
    </>
  );
}
