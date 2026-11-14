'use client';
// Das sprechende Kalenderblatt of Lernsachen-Heft, drawn and run by the
// reference itself (reference/class-runtime.ts): it asks for the day, the
// date, the month and the year, the children tap the answer, help and the
// season follow. Its drawings (by Lernsachen.blog) ship with the app.
import { useLayoutEffect, useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { CLASS_CSS, renderCalendar, tapCalendar } from '@/lib/reference/class-runtime';
import { Vr } from '@/lib/reference/runtime';
import pictures from '@/lib/reference/calendar-pictures.json';
import { useLearning } from './Runtime';

const pics = Object.fromEntries(Object.entries(pictures).map(([name, p]) => [name, p.src]));
const assets = Object.fromEntries(Object.values(pictures).map((p) => [p.src, { dataUrl: p.src, width: p.w, height: p.h }]));

export default function CalendarSheet({ element }: { element: PageElement }) {
  const { interactive } = useLearning(element);
  const box = useRef<HTMLDivElement>(null);
  const item = useRef<Record<string, unknown>>({});
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.classList.add('lh-widget', 'lh-wg-calendar');
    el.classList.toggle('is-live', interactive);
    const draw = () => {
      item.current = { id: element.id, type: 'widget', kind: 'calendar', pics, w: el.clientWidth || 1400, h: el.clientHeight || 990, locked: interactive };
      delete el.dataset.k;
      renderCalendar(el, item.current, interactive, { assets });
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
        onClick={(e) => {
          if (!interactive) return;
          Vr();
          tapCalendar(item.current, box.current, e.target);
        }}
      />
    </div>
  );
}
