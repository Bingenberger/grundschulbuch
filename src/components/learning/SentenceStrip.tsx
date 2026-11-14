'use client';
// Satzleiste of Lernsachen-Heft, drawn and run by the reference itself: it
// collects the words of the tapped keys, reads the sentence aloud, takes the
// last word back or clears everything.
import { useLayoutEffect, useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { CLASS_CSS, renderStrip, tapStrip } from '@/lib/reference/class-runtime';
import { Vr } from '@/lib/reference/runtime';
import { useLearning } from './Runtime';

export default function SentenceStrip({ element }: { element: PageElement }) {
  const { interactive } = useLearning(element);
  const box = useRef<HTMLDivElement>(null);
  const item = useRef<Record<string, unknown>>({});
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.classList.add('lh-widget', 'lh-wg-strip');
    el.classList.toggle('is-live', interactive);
    const draw = () => {
      item.current = { id: element.id, type: 'widget', kind: 'strip', w: el.clientWidth || 600, h: el.clientHeight || 70, locked: interactive };
      delete el.dataset.k;
      renderStrip(el, item.current, interactive, {});
    };
    draw();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(draw);
    observer?.observe(el);
    return () => observer?.disconnect();
  }, [interactive, element.id]);
  return (
    <div className="time-widget">
      <style>{CLASS_CSS}</style>
      <div
        ref={box}
        className="time-widget-face"
        onPointerDown={(e) => { if (interactive) e.stopPropagation(); }}
        onClick={(e) => { if (interactive) { Vr(); tapStrip(item.current, box.current, e.target); } }}
      />
    </div>
  );
}
