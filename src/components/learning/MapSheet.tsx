'use client';
// The Karte of Lernsachen-Heft as a page: the background and title of the map
// design, and the map drawn by the reference itself (reference/class-runtime.ts).
// Live, + and − zoom in (sharper tiles through the school server), the map can
// be moved while zoomed, “reset” goes back to the saved section.
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { designOf, karte, mapLayout } from '@/lib/learning/karte';
import { CLASS_CSS, renderMap } from '@/lib/reference/class-runtime';
import { useLearning } from './Runtime';

export default function MapSheet({ element }: { element: PageElement }) {
  const { interactive } = useLearning(element);
  const map = useMemo(() => karte(element.settings?.map), [element.settings?.map]);
  const design = designOf(map.design);
  const layout = mapLayout(map.design);
  const title = element.settings?.title ?? 'Meine Karte';
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
  const key = JSON.stringify(map);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.classList.add('lh-widget', 'lh-wg-map');
    el.classList.toggle('is-live', interactive);
    delete el.dataset.k;
    const assets = map.img ? { [map.img]: { dataUrl: map.img } } : {};
    renderMap(el, { id: element.id, type: 'widget', kind: 'map', map, w: layout.map.w, h: layout.map.h, locked: interactive }, interactive, { assets });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, interactive, element.id]);
  const background = useMemo(() => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 990">${design.page()}</svg>`)}`, [design]);
  return (
    <div ref={root} className="map-sheet" onPointerDown={(e) => { if (interactive && (e.target as Element).closest?.('.lh-wg-map')) e.stopPropagation(); }}>
      <style>{CLASS_CSS}</style>
      <div className="map-stage" style={{ transform: `scale(${scale})`, background: design.paper }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Drawn background of the design. */}
        <img className="map-backdrop" src={background} alt="" draggable={false} />
        {title.trim() && (
          <div className="map-title" style={{ left: layout.title.x, top: layout.title.y, width: layout.title.w, height: layout.title.h, fontSize: layout.title.size, color: design.title }}>{title}</div>
        )}
        <div ref={box} className="map-box" style={{ left: layout.map.x, top: layout.map.y, width: layout.map.w, height: layout.map.h }} />
      </div>
    </div>
  );
}
