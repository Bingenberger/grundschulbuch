'use client';
// Hosts a widget of the reference: its own code draws into this element and
// handles taps, drags and animations; we only pass the settings and whether
// it is live (Tafel, Kinderheft, protected page).
import { useEffect, useLayoutEffect, useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { dc } from '@/lib/reference/runtime';
import { useLearning } from './Runtime';

type Render = (el: HTMLElement, item: Record<string, unknown>, live: boolean, options: Record<string, unknown>) => void;

export default function ReferenceWidget({ element, kind, field, value, render, options = {}, css, stop }: { element: PageElement; kind: string; field: string; value: unknown; render: Render; options?: Record<string, unknown>; css: string; stop?: () => void }) {
  const { interactive } = useLearning(element);
  const box = useRef<HTMLDivElement>(null);
  const key = JSON.stringify(value ?? null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    // The widget adds its own state classes; ours are set here, not by React.
    el.classList.add('reference-widget', `lh-wg-${kind}`);
    el.classList.toggle('is-live', interactive);
    const draw = () => render(el, { id: element.id, w: el.clientWidth || 1400, h: el.clientHeight || 990, locked: interactive, [field]: value }, interactive, options);
    draw();
    // Some widgets place pictures in pixels: draw again when the size changes.
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(draw);
    observer?.observe(el);
    return () => observer?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, interactive, element.id]);
  useEffect(
    () => () => {
      stop?.();
      dc();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <>
      <style>{css}</style>
      <div
        ref={box}
        role="group"
        onPointerDown={(e) => {
          // Keys and draggable parts belong to the widget, not to the editor.
          if (interactive && (e.target as Element).closest('.lh-key, [data-a], .lh-sy-pull')) e.stopPropagation();
        }}
      />
    </>
  );
}
