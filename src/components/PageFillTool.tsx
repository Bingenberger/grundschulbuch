'use client';
import { useEffect, useState, type RefObject } from 'react';
import { useEditor } from '@/lib/editor-store';
import { dimensions, type PageElement } from '@/lib/notebook-model';
import { canvasPoint, rgbaHex } from '@/lib/color-sampling';
import { floodRegion } from '@/lib/flood-fill';
import { applyRegionFill, filledRegion, fillObject, protectedPixels } from '@/lib/fill';

export default function PageFillTool({ surface, disabled = false }: {
  surface: RefObject<HTMLDivElement | null>; disabled?: boolean;
}) {
  const s = useEditor(), [busy, setBusy] = useState(false);
  const active = s.tool === 'pen' && s.brush === 'fill' && !disabled;
  useEffect(() => {
    const layer = surface.current, paper = layer?.closest('.paper') as HTMLElement | null;
    if (!active || !layer || !paper) return;
    let stopped = false, pending = false, generation = 0;
    const cancel = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      generation++; pending = false; setBusy(false);
    };
    const fill = async (event: PointerEvent) => {
      event.preventDefault(); event.stopImmediatePropagation();
      const state = useEditor.getState();
      if (pending || event.button !== 0 || state.pencilOnly && event.pointerType !== 'pen') return;
      const snapshot = state.pages.find(p => p.id === state.activeId);
      if (!snapshot) return;
      const rect = layer.getBoundingClientRect(), size = dimensions(snapshot);
      const point = { x: (event.clientX - rect.left) / rect.width * size.width, y: (event.clientY - rect.top) / rect.height * size.height };
      if (state.fillMode === 'object') {
        const shapeHit = (el: PageElement) => {
          const view = [...layer.querySelectorAll<HTMLElement>('[data-element-id]')].find(node => node.dataset.elementId === el.id);
          return [...view?.querySelectorAll<SVGGeometryElement>('svg path, svg polygon, svg rect, svg ellipse, svg circle') || []].some(shape => {
            const matrix = shape.getScreenCTM();
            return !!matrix && shape.isPointInFill(new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()));
          });
        };
        const elements = fillObject(snapshot.elements, point, state.color, shapeHit);
        if (elements !== snapshot.elements) state.edit(p => ({ ...p, elements }));
        return;
      }
      pending = true; setBusy(true); const request = ++generation;
      try {
        const { toCanvas } = await import('html-to-image');
        const canvas = await toCanvas(paper, {
          pixelRatio: 1, canvasWidth: Math.round(size.width * 4), canvasHeight: Math.round(size.height * 4),
          filter: node => !(node instanceof Element && (node.classList.contains('drawing-ruler') || node.classList.contains('selection-handles'))),
        });
        if (stopped || request !== generation) return;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Die Seitenfläche konnte nicht gelesen werden.');
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        const seed = canvasPoint({ x: event.clientX, y: event.clientY }, rect, canvas.width, canvas.height);
        const offset = (seed.y * canvas.width + seed.x) * 4;
        if (state.penOpacity === 1 && rgbaHex(image.data.slice(offset, offset + 4)) === state.color.toLowerCase()) return;
        const blocked = protectedPixels(snapshot.elements, canvas.width, canvas.height, size.width, size.height);
        const region = floodRegion(image.data, canvas.width, canvas.height, seed, 28, blocked);
        const element = filledRegion(region, canvas.width, canvas.height, size.width, size.height, state.color, state.penOpacity);
        const current = useEditor.getState();
        if (current.activeId !== snapshot.id) return;
        if (element) current.edit(p => applyRegionFill(snapshot, p, element));
      } catch (error) {
        if (!stopped && request === generation) useEditor.setState({ error: error instanceof Error ? error.message : 'Die Fläche konnte nicht gefüllt werden.' });
      } finally {
        if (!stopped && request === generation) { pending = false; setBusy(false); }
      }
    };
    layer.addEventListener('pointerdown', fill, true);
    window.addEventListener('keydown', cancel, true);
    return () => {
      stopped = true; setBusy(false);
      layer.removeEventListener('pointerdown', fill, true);
      window.removeEventListener('keydown', cancel, true);
    };
  }, [active, surface, s.activeId, s.fillMode]);
  if (!active) return null;
  return <small className="option-hint" role="status">{busy ? 'Fläche wird gefüllt … · Esc bricht ab' : s.fillMode === 'object' ? 'Geschlossene Form antippen.' : 'Zusammenhängende Fläche antippen. Offene Linien lassen Farbe durch.'}</small>;
}
