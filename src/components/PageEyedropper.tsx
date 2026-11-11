'use client';
import { useEffect, useState, type RefObject } from 'react';
import { useEditor } from '@/lib/editor-store';
import { rgbaHex, canvasPoint } from '@/lib/color-sampling';

export default function PageEyedropper({ surface }: { surface: RefObject<HTMLDivElement | null> }) {
  const [active, setActive] = useState(false), [busy, setBusy] = useState(false);
  useEffect(() => {
    const paper = surface.current?.closest('.paper') as HTMLElement | null;
    if (!active || !paper) return;
    let stopped = false, sampling = false;
    paper.classList.add('picking-color');
    const cancel = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault(); event.stopPropagation(); setBusy(false); setActive(false);
    };
    const sample = async (event: PointerEvent) => {
      event.preventDefault(); event.stopImmediatePropagation();
      if (sampling || event.button !== 0) return;
      sampling = true; setBusy(true);
      const rect = paper.getBoundingClientRect(), position = { x: event.clientX, y: event.clientY };
      try {
        const { toCanvas } = await import('html-to-image');
        const canvas = await toCanvas(paper, {
          pixelRatio: 1,
          filter: node => !(node instanceof Element && node.classList.contains('drawing-ruler')),
        });
        const at = canvasPoint(position, rect, canvas.width, canvas.height);
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Die Seitenfarbe konnte nicht gelesen werden.');
        const color = rgbaHex(context.getImageData(at.x, at.y, 1, 1).data);
        if (!stopped) useEditor.setState({ color });
      } catch {
        if (!stopped) useEditor.setState({ error: 'Die Farbe konnte nicht aufgenommen werden. Bitte erneut versuchen.' });
      } finally {
        if (!stopped) { setBusy(false); setActive(false); }
      }
    };
    paper.addEventListener('pointerdown', sample, true);
    window.addEventListener('keydown', cancel, true);
    return () => {
      stopped = true; paper.classList.remove('picking-color');
      paper.removeEventListener('pointerdown', sample, true);
      window.removeEventListener('keydown', cancel, true);
    };
  }, [active, surface]);
  return <div className="page-eyedropper">
    <button className="tool" disabled={busy} aria-pressed={active} onClick={() => setActive(!active)}>
      <span>◉</span>{active ? 'Pipette abbrechen' : 'Pipette'}
    </button>
    {active && <span role="status">{busy ? 'Farbe wird aufgenommen …' : 'Farbe auf der Seite antippen · Esc bricht ab'}</span>}
  </div>;
}
