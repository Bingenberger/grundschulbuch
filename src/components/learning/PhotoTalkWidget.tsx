'use client';
// Sprechendes Foto aus Lernsachen-Heft 1.47.3: ein Foto, dessen Kinn (oder ein
// gezeichneter Mund) sich beim Sprechen bewegt. Zeichnen und Sprechen übernimmt
// die Vorlage selbst (reference/tools-runtime.ts); wir geben Foto, Mundlinie,
// Stil und Text.
import { useLayoutEffect, useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { PHOTO_CSS, renderPhotoTalk, speakPhotoTalk } from '@/lib/reference/tools-runtime';
import { assetUrl, sayAssets, sayItem, sayOf, type Say } from './FigureWidget';
import { useTapToPlay } from './Runtime';

export type PhotoTalk = { src: string; width: number; height: number; x1: number; y1: number; x2: number; y2: number; style: string };
export const PHOTO_STYLE_IDS = ['normal', 'animal', 'monster', 'comic'];
const unit = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : fallback);

/** Die Einstellungen des Fotos (fehlt das Foto, ist es undefined). */
export function photoOf(raw: unknown): PhotoTalk | undefined {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<PhotoTalk>;
  if (typeof v.src !== 'string' || !v.src) return undefined;
  const size = (n: unknown) => (typeof n === 'number' && n >= 16 && n <= 20000 ? Math.round(n) : 800);
  return {
    src: v.src, width: size(v.width), height: size(v.height),
    x1: unit(v.x1, 0.4), y1: unit(v.y1, 0.7), x2: unit(v.x2, 0.6), y2: unit(v.y2, 0.7),
    style: PHOTO_STYLE_IDS.includes(String(v.style)) ? String(v.style) : 'normal',
  };
}

/** So erwartet es die Vorlage: das Foto als Asset, die Mundlinie als Anteile des Fotos. */
export function photoItem(id: string, photo: PhotoTalk | undefined, say: Say) {
  const { src, width, height, ...line } = photo ?? ({} as PhotoTalk);
  return {
    item: { id, pt: photo ? { img: 'photo', ...line } : undefined, say: sayItem(say) },
    // An own recording speaks instead of the computer voice (as in Lernsachen-Heft 1.49.0).
    options: { assets: { ...(photo ? { photo: { url: src, width, height } } : {}), ...sayAssets(say) }, assetUrl },
  };
}

export default function PhotoTalkWidget({ element }: { element: PageElement }) {
  const box = useRef<HTMLDivElement>(null);
  const photo = photoOf(element.settings?.photo), say = sayOf(element.settings?.say);
  const { item, options } = photoItem(element.id, photo, say);
  const key = JSON.stringify([item, say.audio]);
  const { interactive, ...tap } = useTapToPlay(element, (el) => speakPhotoTalk(item, el));
  useLayoutEffect(() => {
    if (box.current) renderPhotoTalk(box.current, item, true, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (
    <>
      <style>{PHOTO_CSS}</style>
      <div
        ref={box}
        className={`reference-widget lh-wg-phototalk${interactive ? ' is-live' : ''}`}
        role="button"
        tabIndex={interactive ? 0 : -1}
        {...tap}
      />
    </>
  );
}
