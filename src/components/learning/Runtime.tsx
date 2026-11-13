'use client';
import { createContext, useContext, useCallback } from 'react';
import type { Page, PageElement } from '@/lib/notebook-model';
import type { LearningResponse } from '@/lib/learning/catalog';
type Runtime = {
  interactive: boolean;
  allowExternal?: boolean;
  onResponse?: (id: string, response: LearningResponse) => void;
  onRecord?: (id: string) => void;
  /** Present only in the teacher editor. */
  onConfigure?: (id: string) => void;
  /** Saves a recording made right in a learning tool; returns its address. */
  uploadAudio?: (id: string, file: Blob) => Promise<string>;
  reportScore?: (score: number) => void;
  /** Drawing on the page itself (“Geometrie: Formen zeichnen”); only in the editors. */
  drawing?: PageDrawing;
};
export type PageDrawing = {
  /** All pen strokes of the current page as point lists in page millimetres. */
  strokes: () => { x: number; y: number }[][];
  /** Takes the pen and puts the ruler (or the set square) on the page. */
  begin: (setSquare: boolean) => void;
  /** Removes the strokes inside this part of the page (millimetres). */
  clear: (area: { x: number; y: number; width: number; height: number }) => void;
};
const EMPTY: LearningResponse = {};
const Context = createContext<Runtime>({ interactive: false });
export function LearningRuntime({
  children,
  ...value
}: Runtime & { children: React.ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLearning(element: PageElement) {
  const runtime = useContext(Context),
    state = element.response || EMPTY;
  const update = useCallback(
    (patch: LearningResponse) => {
      if (runtime.interactive) {
        runtime.onResponse?.(element.id, { ...state, ...patch });
        if (typeof patch.score === 'number') runtime.reportScore?.(patch.score);
      }
    },
    [runtime, element.id, state],
  );
  return { ...runtime, state, update };
}

/** Lets “Geometrie: Formen zeichnen” read and clear pen strokes and pick up the pen. */
export function pageDrawing(
  edit: (change: (page: Page) => Page) => void,
  current: () => Page | undefined,
  start: (setSquare: boolean) => void,
): PageDrawing {
  return {
    strokes: () =>
      (current()?.elements || [])
        .filter((el) => el.type === 'stroke' && el.points?.length)
        .map((el) => el.points!.map((p) => ({ x: el.x + p.x, y: el.y + p.y }))),
    begin: start,
    clear: (a) =>
      edit((p) => ({
        ...p,
        elements: p.elements.filter((el) => {
          if (el.type !== 'stroke') return true;
          const cx = el.x + el.width / 2, cy = el.y + el.height / 2;
          return !(cx >= a.x && cx <= a.x + a.width && cy >= a.y && cy <= a.y + a.height);
        }),
      })),
  };
}
