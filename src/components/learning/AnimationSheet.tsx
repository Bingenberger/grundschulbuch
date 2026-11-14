'use client';
// Animation of Lernsachen-Heft as a page (the reference's template: film strip
// below, title above the stage); the stage is drawn and played by the
// reference itself.
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { animation, animationAssets } from '@/lib/learning/animation';
import { CLASS_CSS, renderAnimation } from '@/lib/reference/class-runtime';
import { useLearning } from './Runtime';

const STRIP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 990"><rect width="1400" height="990" fill="#f8fafc"/><rect x="0" y="930" width="1400" height="60" fill="#343a40"/>${Array.from({ length: 28 }, (_, t) => `<rect x="${12 + t * 50}" y="946" width="28" height="28" rx="5" fill="#f8fafc"/>`).join('')}</svg>`;

export default function AnimationSheet({ element }: { element: PageElement }) {
  const { interactive } = useLearning(element);
  const raw = element.settings?.anim, named = element.settings?.title?.trim();
  const a = useMemo(() => ({ ...animation(raw), ...(named ? { title: named } : {}) }), [raw, named]);
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
  const key = JSON.stringify(a);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.classList.add('lh-widget', 'lh-wg-anim');
    el.classList.toggle('is-live', interactive);
    delete el.dataset.k;
    renderAnimation(el, { id: element.id, type: 'widget', kind: 'anim', anim: a, w: 1280, h: 720, locked: interactive }, interactive, { assets: animationAssets(a) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, interactive, element.id]);
  return (
    <div ref={root} className="map-sheet" onPointerDown={(e) => { if (interactive && (e.target as Element).closest?.('.lh-wg-anim')) e.stopPropagation(); }}>
      <style>{CLASS_CSS}</style>
      <div className="map-stage" style={{ transform: `scale(${scale})`, background: '#f8fafc' }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Drawn background of the template. */}
        <img className="map-backdrop" src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(STRIP)}`} alt="" draggable={false} />
        <div className="map-title" style={{ left: 70, top: 46, width: 1260, height: 90, fontSize: 56, color: '#1f2937' }}>{a.title}</div>
        <div ref={box} className="map-box" style={{ left: 60, top: 190, width: 1280, height: 720 }} />
      </div>
    </div>
  );
}
