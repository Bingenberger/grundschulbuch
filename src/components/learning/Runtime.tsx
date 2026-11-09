'use client';
import { createContext, useContext, useCallback } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import type { LearningResponse } from '@/lib/learning/catalog';
type Runtime = {
  interactive: boolean;
  allowExternal?: boolean;
  onResponse?: (id: string, response: LearningResponse) => void;
  onRecord?: (id: string) => void;
  reportScore?: (score: number) => void;
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
