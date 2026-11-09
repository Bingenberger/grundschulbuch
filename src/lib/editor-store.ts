'use client';
import { clone } from './notebook-model';
import { create } from 'zustand';
import { childApi } from './child-api';
import { api } from './client-api';
import type { BookData, Notebook, Page, PageElement } from './notebook-model';
type State = {
  mode: 'teacher' | 'child';
  book: Notebook | null;
  pages: Page[];
  activeId: string;
  selected: string[];
  tool: 'select' | 'pen' | 'marker' | 'eraser';
  color: string;
  penWidth: number; brush: 'pen'|'fountain'|'crayon'|'marker'|'water'|'fill';
  pencilOnly: boolean;
  dirty: Record<string, number>;
  saving: boolean;
  error: string;
  conflict: boolean;
  conflictPageId: string;
  past: Page[];
  future: Page[];
  load: (data: BookData, mode?: 'teacher' | 'child') => void;
  edit: (update: (page: Page) => Page, history?: boolean) => void;
  checkpoint: () => void;
  undo: () => void;
  redo: () => void;
  select: (ids: string[]) => void;
  patchElements: (patch: Partial<PageElement>) => void;
};
export const useEditor = create<State>((set, get) => ({
  mode: 'teacher',
  book: null,
  pages: [],
  activeId: '',
  selected: [],
  tool: 'select',
  color: '#253c42',
  penWidth: 0.7, brush: 'pen',
  pencilOnly: false,
  dirty: {},
  saving: false,
  error: '',
  conflict: false,
  conflictPageId: '',
  past: [],
  future: [],
  load: ({ book, pages }, mode = 'teacher') =>
    set({
      mode,
      book,
      pages,
      activeId: pages[0].id,
      dirty: {},
      selected: [],
      past: [],
      future: [],
      error: '',
      conflict: false,
      conflictPageId: '',
    }),
  edit: (update, history = true) => {
    const s = get();
    const current = s.pages.find((p) => p.id === s.activeId);
    if (!current) return;
    const next = update(current);
    if (JSON.stringify(current) === JSON.stringify(next)) return;
    set({
      pages: s.pages.map((p) => (p.id === current.id ? next : p)),
      dirty: { ...s.dirty, [current.id]: (s.dirty[current.id] || 0) + 1 },
      past: history ? [...s.past.slice(-49), clone(current)] : s.past,
      future: history ? [] : s.future,
    });
  },
  checkpoint: () => {
    const s = get();
    const p = s.pages.find((p) => p.id === s.activeId);
    if (p) set({ past: [...s.past.slice(-49), clone(p)], future: [] });
  },
  undo: () => {
    const s = get();
    const previous = s.past[s.past.length - 1];
    const current = s.pages.find((p) => p.id === s.activeId);
    if (!previous || !current) return;
    s.edit(() => ({ ...previous, revision: current.revision }), false);
    set({
      past: s.past.slice(0, -1),
      future: [...s.future, current],
      selected: [],
    });
  },
  redo: () => {
    const s = get();
    const next = s.future[s.future.length - 1];
    const current = s.pages.find((p) => p.id === s.activeId);
    if (!next || !current) return;
    s.edit(() => ({ ...next, revision: current.revision }), false);
    set({
      past: [...s.past, current],
      future: s.future.slice(0, -1),
      selected: [],
    });
  },
  select: (selected) => set({ selected }),
  patchElements: (patch) => {
    const s = get();
    s.edit((p) => ({
      ...p,
      elements: p.elements.map((el) =>
        s.selected.includes(el.id) && !el.locked ? { ...el, ...patch } : el,
      ),
    }));
  },
}));
let saving: Promise<boolean> | null = null;
export function flushEditor(): Promise<boolean> {
  if (saving) return saving.then((ok) => (ok ? flushEditor() : false));
  if (useEditor.getState().conflict) return Promise.resolve(false);
  if (!Object.keys(useEditor.getState().dirty).length)
    return Promise.resolve(true);
  saving = (async () => {
    // Yield once so the shared promise is assigned before finally clears it.
    await Promise.resolve();
    useEditor.setState({ saving: true });
    let savingPageId = '';
    try {
      while (Object.keys(useEditor.getState().dirty).length) {
        const s = useEditor.getState();
        const pageId = Object.keys(s.dirty)[0];
        const count = s.dirty[pageId];
        savingPageId = pageId;
        const page = s.pages.find((p) => p.id === pageId);
        if (!page || !s.book) break;
        const result = await (s.mode === 'child' ? childApi : api)<Page>(
          'page',
          { id: s.book.id, page },
        );
        const latest = useEditor.getState();
        const dirty = { ...latest.dirty };
        if (dirty[pageId] === count) delete dirty[pageId];
        useEditor.setState({
          pages: latest.pages.map((p) =>
            p.id === pageId ? { ...p, revision: result.revision } : p,
          ),
          dirty,
          error: '',
        });
      }
      return true;
    } catch (e) {
      useEditor.setState({
        conflictPageId: savingPageId,
        error: e instanceof Error ? e.message : 'Speichern fehlgeschlagen.',
        conflict: !!(
          e &&
          typeof e === 'object' &&
          'status' in e &&
          e.status === 409
        ),
      });
      return false;
    } finally {
      useEditor.setState({ saving: false });
      saving = null;
    }
  })();
  return saving;
}
