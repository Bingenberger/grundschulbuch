'use client';
// Sprechtaste of Lernsachen-Heft (Unterstützte Kommunikation), drawn and run by
// the reference itself (reference/class-runtime.ts): tapped, it plays its own
// recording or says its word; a key with a link (or the Zurück-Taste) then
// turns to that board; any other key puts its word into the Satzleiste on the
// same page.
import { useContext, useLayoutEffect, useMemo, useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { talkAssets, talkConfig, talkItem } from '@/lib/learning/uk';
import { addToStrip, CLASS_CSS, renderTalk, tapTalk } from '@/lib/reference/class-runtime';
import { LinkContext } from '../LinkContext';
import { useLearning } from './Runtime';

export default function TalkKey({ element }: { element: PageElement }) {
  const { interactive } = useLearning(element);
  const links = useContext(LinkContext);
  // A link set with “Link” in the toolbar leads to that page, like a linked key of the reference.
  const c = useMemo(() => { const t = talkConfig(element.settings?.talk); return !t.link && element.link?.kind === 'page' ? { ...t, link: element.link.pageId } : t; }, [element.settings?.talk, element.link]);
  const assets = useMemo(() => talkAssets(c), [c]);
  const box = useRef<HTMLDivElement>(null);
  const item = useRef<Record<string, unknown>>({});
  const key = JSON.stringify(c);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const draw = () => {
      item.current = talkItem(c, element.id, el.clientWidth || 100, el.clientHeight || 100);
      el.replaceChildren();
      el.className = 'talk-key';
      renderTalk(item.current, el, { interactive, assets, placeholders: !interactive });
    };
    draw();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(draw);
    observer?.observe(el);
    return () => observer?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, interactive, element.id]);
  // Turning pages as the reference expects it (go, current, previous).
  const pager = { go: (id: string) => links.openPage?.(id), current: () => links.currentPage?.(), previous: () => {} };
  return (
    <div className="time-widget">
      <style>{CLASS_CSS}</style>
      <div
        ref={box}
        className="talk-key"
        onPointerDown={(e) => { if (interactive) e.stopPropagation(); }}
        onClick={(e) => {
          if (!interactive) return;
          e.preventDefault();
          const el = box.current!;
          tapTalk(item.current, el, assets, pager);
          // The word goes into a Satzleiste on the same page.
          const word = (c.label || c.say || '').trim();
          const page = el.closest('.paper, .interaction-surface');
          if (!c.back && !c.link && word && page?.querySelector('.lh-wg-strip[data-strip-id]'))
            addToStrip({ word, pic: (el.querySelector('img.lh-talk-pic') as HTMLImageElement | null)?.src });
        }}
      />
    </div>
  );
}
