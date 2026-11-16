'use client';
// A Figur of Lernsachen-Heft 1.47.3 (e.g. on the Gefühle-Karten): drawn by
// the reference itself (reference/tools-runtime.ts); tapped, it waves and says
// its text (the mouth moves with it) or “Hallo, ich bin …”.
import type { PageElement } from '@/lib/notebook-model';
import { FIGURE_CSS, figureConfig, renderFigure } from '@/lib/reference/tools-runtime';
import ReferenceWidget from './ReferenceWidget';

export const figureLook = (raw: unknown) => figureConfig(raw) as Record<string, unknown>;
export type Say = { text: string; pitch: string };
export const sayOf = (raw: unknown): Say => {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<Say>;
  return { text: typeof v.text === 'string' ? v.text.slice(0, 300) : '', pitch: typeof v.pitch === 'string' ? v.pitch : 'normal' };
};

export default function FigureWidget({ element }: { element: PageElement }) {
  const av = figureLook(element.settings?.av), say = sayOf(element.settings?.say);
  return (
    <ReferenceWidget element={element} kind="avatar" field="av" value={{ ...av, _say: say }} css={FIGURE_CSS}
      render={(el, item, live, options) => { const { _say, ...look } = item.av as Record<string, unknown>; renderFigure(el, { ...item, av: look, say: _say }, live, options); }} />
  );
}
