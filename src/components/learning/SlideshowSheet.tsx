'use client';
// Diaschau of Lernsachen-Heft as a page: background and title of the design,
// and the show drawn by the reference itself; “Start” plays it full screen.
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { designOfShow, show, showAssets } from '@/lib/learning/diaschau';
import { CLASS_CSS, renderSlideshow } from '@/lib/reference/class-runtime';
import { useLearning } from './Runtime';

export default function SlideshowSheet({ element }: { element: PageElement }) {
  const { interactive } = useLearning(element);
  // The title of the show is the title of the element (one title field in the settings).
  const raw = element.settings?.show, named = element.settings?.title?.trim();
  const s = useMemo(() => ({ ...show(raw), ...(named ? { title: named } : {}) }), [raw, named]);
  const design = designOfShow(s.design);
  const root = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    const measure = () => setScale(node.clientWidth / 1400);
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(node);
    return () => observer?.disconnect();
  }, []);
  const key = JSON.stringify(s);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.classList.add('lh-widget', 'lh-wg-slideshow');
    el.classList.toggle('is-live', interactive);
    delete el.dataset.k;
    renderSlideshow(el, { id: element.id, type: 'widget', kind: 'slideshow', show: s, w: 1300, h: 780, locked: interactive }, interactive, { assets: showAssets(s) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, interactive, element.id]);
  const background = useMemo(() => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 990">${design.page()}</svg>`)}`, [design]);
  return (
    <div ref={root} className="map-sheet" onPointerDown={(e) => { if (interactive && (e.target as Element).closest?.('.lh-wg-slideshow')) e.stopPropagation(); }}>
      <style>{CLASS_CSS}</style>
      <div className="map-stage" style={{ transform: `scale(${scale})`, background: design.paper }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Drawn background of the design. */}
        <img className="map-backdrop" src={background} alt="" draggable={false} />
        <div className="map-title" style={{ left: 70, top: 46, width: 1260, height: 90, fontSize: 56, color: design.title }}>{s.title}</div>
        <div ref={box} className="map-box" style={{ left: 50, top: 170, width: 1300, height: 780 }} />
      </div>
    </div>
  );
}
