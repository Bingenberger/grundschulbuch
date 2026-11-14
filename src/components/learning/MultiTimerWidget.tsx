'use client';
// The Multi-Timer of Lernsachen-Heft (Vorlage „Multi-Timer“, Regal › Zeit),
// drawn and run by the reference itself (reference/class-runtime.ts): a clock
// with the real time and the phases as coloured rings, start, pause, skip,
// full screen and its own “Timer Konfiguration”. What is changed there is
// kept as the answer of the element (for the Tafel and each child).
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { CLASS_CSS, multiTimerConfig, onMultiTimerChange, renderMultiTimer, stopMultiTimer } from '@/lib/reference/class-runtime';
import { useLearning } from './Runtime';

const saves = new Map<string, (cfg: unknown) => void>();
onMultiTimerChange((id: string, cfg: unknown) => saves.get(id)?.(cfg));

export default function MultiTimerWidget({ element }: { element: PageElement }) {
  const { interactive, state, update } = useLearning(element);
  const multi = useMemo(() => multiTimerConfig(state.multi ?? element.settings?.multi), [state.multi, element.settings?.multi]);
  const box = useRef<HTMLDivElement>(null);
  const save = useRef(update);
  useLayoutEffect(() => { save.current = update; });
  useEffect(() => {
    saves.set(element.id, (cfg) => save.current({ multi: cfg as never }));
    return () => { saves.delete(element.id); stopMultiTimer(element.id); };
  }, [element.id]);
  const key = JSON.stringify(multi);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.classList.add('lh-widget', 'lh-wg-multitimer');
    el.classList.toggle('is-live', interactive);
    const draw = () => renderMultiTimer(el, { id: element.id, type: 'widget', kind: 'multitimer', multi, w: el.clientWidth || 520, h: el.clientHeight || 520, locked: interactive }, interactive, {});
    draw();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(draw);
    observer?.observe(el);
    return () => observer?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, interactive, element.id]);
  return (
    <div className="time-widget">
      <style>{CLASS_CSS}</style>
      <div ref={box} className="time-widget-face" onPointerDown={(e) => { if (interactive) e.stopPropagation(); }} />
    </div>
  );
}
