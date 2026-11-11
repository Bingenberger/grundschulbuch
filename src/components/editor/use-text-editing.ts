'use client';
import { useEffect, useRef, useState } from 'react';
import { useEditor } from '@/lib/editor-store';
import type { Page, PageElement } from '@/lib/notebook-model';
import { fitTextToRuling, rowHeight } from '@/lib/text-fit';
import { browserMeasure, fitText, preloadTextFonts } from './text-measure';

/** In-place writing in text boxes, shared by the teacher and the child editor. */
export function useTextEditing(pageId: string | undefined, blocked = false) {
  const [editing, setEditing] = useState<{ id: string; selectAll: boolean; pageId?: string } | null>(null);
  const saved = useRef(false);
  const selected = useEditor((s) => s.selected);
  const tool = useEditor((s) => s.tool);
  const current = editing && editing.pageId === pageId && !blocked && tool === 'select' && selected.includes(editing.id) ? editing : null;

  useEffect(() => preloadTextFonts(), []);
  useEffect(() => {
    if (editing && !current) finish(editing.id);
  });

  /** Leaves writing; an empty text box disappears again. */
  function finish(id: string | undefined) {
    setEditing(null);
    if (!id) return;
    const s = useEditor.getState();
    const page = s.pages.find((p) => p.id === s.activeId);
    const el = page?.elements.find((e) => e.id === id);
    if (el?.type === 'text' && !(el.text || '').trim() && !el.runs?.length) {
      s.edit((p) => ({ ...p, elements: p.elements.filter((e) => e.id !== id) }), saved.current);
      s.select(s.selected.filter((x) => x !== id));
    }
  }

  function update(fn: (el: PageElement, page: Page) => PageElement, history: boolean) {
    const s = useEditor.getState();
    if (history && !saved.current) {
      s.checkpoint();
      saved.current = true;
    }
    s.edit(
      (p) => ({ ...p, elements: p.elements.map((el) => (el.id === current?.id ? fn(el, p) : el)) }),
      false,
    );
  }

  return {
    editingId: current?.id ?? null,
    selectAll: !!current?.selectAll,
    begin(id: string, selectAll = false) {
      saved.current = false;
      setEditing({ id, selectAll, pageId });
    },
    type(text: string) {
      update((el, page) => fitText({ ...el, text, runs: undefined }, page), true);
    },
    /** Grows the box with the text; on lined pages always whole rows. */
    height(mm: number) {
      update((el, page) => {
        const ruled = fitTextToRuling(el, page, browserMeasure);
        if (ruled) {
          const lines = Math.max(1, Math.round(mm / rowHeight(ruled) - 0.05));
          const next = fitTextToRuling(el, page, browserMeasure, { lines })!;
          return Math.abs(next.height - el.height) > 0.05 || Math.abs(next.y - el.y) > 0.05 ? next : el;
        }
        const frame = el.textFrame && el.textFrame !== 'none' ? 4.6 : 0;
        const needed = Math.round((mm + frame) * 100) / 100;
        return needed > el.height + 0.05 ? { ...el, height: needed } : el;
      }, false);
    },
    done() {
      finish(current?.id);
    },
  };
}

/** Places text that was moved or resized back on the ruling. */
export function settleText(elements: PageElement[], page: Page) {
  return elements.map((el) => (el.type === 'text' ? fitText(el, page) : el));
}
