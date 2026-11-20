'use client';
// Pages whose tasks need a ruler or set square (Karopapier “Strecken messen”,
// “Strecken zeichnen”): as in the reference the pen is on and the ruler lies
// ready at the bottom left. On a page without such tasks it goes away again –
// and the pen goes off, if it was only switched on for that.
import { useEffect, useRef } from 'react';
import type { DrawingGuide } from '@/lib/drawing-guide';
import type { Page } from '@/lib/notebook-model';
import { readyGuide } from '@/lib/sheets/answers';
import { useEditor } from '@/lib/editor-store';

export function useReadyGuide(page: Page | undefined, sheet: { width: number; height: number; left?: number; top?: number }, setGuide: (g: DrawingGuide | null) => void, enabled = true) {
  const placed = useRef<{ guide: boolean; pen: boolean }>({ guide: false, pen: false });
  const tool = page?.tool, id = page?.id;
  const { width, height, left, top } = sheet;
  useEffect(() => {
    if (!enabled || !id) return;
    const was = placed.current;
    if (tool) {
      const editor = useEditor.getState();
      const pen = editor.tool !== 'pen';
      if (pen) editor.chooseBrush(editor.brush === 'fill' ? 'pen' : editor.brush);
      setGuide(readyGuide(tool, { width, height, left, top }));
      placed.current = { guide: true, pen: pen || was.pen };
      return;
    }
    if (was.guide) setGuide(null);
    if (was.pen && useEditor.getState().tool === 'pen') useEditor.setState({ tool: 'select' });
    placed.current = { guide: false, pen: false };
    // Only when another page comes up – the ruler may be moved or put away on the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tool, enabled]);
}
