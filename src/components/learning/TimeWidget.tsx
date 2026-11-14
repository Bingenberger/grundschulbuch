'use client';
// Uhr, Timer and Datum of Regal › Zeit in Lernsachen-Heft, drawn by the
// reference itself (reference/class-runtime.ts). Live (Tafel, Kinderheft,
// protected page) they tick every half second like in the reference; a tap
// reads the time, the date and the weather aloud – or, on a flexible timer,
// sets it to the next five minutes.
import { useLayoutEffect, useMemo, useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { zeitConfig, zeitItem } from '@/lib/learning/zeit';
import { CLASS_CSS, renderTime, resetTimer, startTime, tapTime, tickTime } from '@/lib/reference/class-runtime';
import { useLearning } from './Runtime';

export default function TimeWidget({ element }: { element: PageElement }) {
  const { interactive } = useLearning(element);
  const c = useMemo(() => zeitConfig(element.settings?.zeit), [element.settings?.zeit]);
  const box = useRef<HTMLDivElement>(null);
  const item = useRef<Record<string, unknown>>({});
  const key = JSON.stringify(c);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.classList.add('lh-widget', `lh-wg-${c.kind}`);
    el.classList.toggle('is-live', interactive);
    const draw = () => {
      item.current = { ...zeitItem(c, element.id), w: el.clientWidth || 300, h: el.clientHeight || 300 };
      delete el.dataset.k;
      renderTime(el, item.current, interactive, {});
    };
    if (interactive) startTime(zeitItem(c, element.id));
    draw();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(draw);
    observer?.observe(el);
    const tick = interactive ? window.setInterval(() => tickTime(el, item.current), 500) : 0;
    return () => { observer?.disconnect(); window.clearInterval(tick); };
  }, [key, interactive, element.id, c]);

  const redraw = () => { const el = box.current; if (el) { delete el.dataset.k; renderTime(el, item.current, true, {}); } };
  const timer = c.kind === 'timer';
  return (
    <div className="time-widget">
      <style>{CLASS_CSS}</style>
      <div
        ref={box}
        className="time-widget-face"
        role={interactive ? 'button' : 'img'}
        tabIndex={interactive ? 0 : -1}
        onPointerDown={(e) => {
          if (!interactive || e.button > 0) return;
          e.stopPropagation();
          tapTime(item.current, box.current);
          redraw();
        }}
        onKeyDown={(e) => {
          if (!interactive || (e.key !== 'Enter' && e.key !== ' ')) return;
          e.preventDefault();
          tapTime(item.current, box.current);
          redraw();
        }}
      />
      {interactive && timer && (
        <button type="button" className="time-widget-reset" onPointerDown={(e) => e.stopPropagation()} onClick={() => { resetTimer(item.current); redraw(); }}>
          {c.timer === 'fixed' ? 'Neu starten' : 'Ausschalten'}
        </button>
      )}
    </div>
  );
}
