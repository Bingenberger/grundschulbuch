'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { dimensions, type Page } from '@/lib/notebook-model';
import type { LearningResponse } from '@/lib/learning/catalog';
import PageView from './PageView';
import ScaledPage from './ScaledPage';
import Icon from './Icon';
import { LinkContext } from './LinkContext';
import { LearningRuntime } from './learning/Runtime';
import { usePinchZoom } from './editor/use-pinch-zoom';

const PX = 96 / 25.4;
/** Swipes and drags that start here belong to the element, not to page turning. */
const OWN_GESTURES = 'button, input, textarea, select, a, audio, video, iframe, [contenteditable], .learning-widget, .link-badge';

/**
 * Reading the notebook like an e-book: one page as large as the screen, no
 * editing. Exercises, sounds and videos work; arrows, keys and swipes turn
 * pages; two fingers zoom. The editor keeps the current page (pageId/onPage),
 * so answers are saved like everywhere else.
 */
export default function ReaderMode({
  title,
  pages,
  pageId,
  onPage,
  onResponse,
  onRecord,
  uploadAudio,
  allowExternal,
  onSpeak,
  onClose,
}: {
  title: string;
  pages: Page[];
  pageId: string;
  onPage: (id: string) => void;
  onResponse: (elementId: string, response: LearningResponse) => void;
  onRecord?: (elementId: string) => void;
  uploadAudio?: (elementId: string, file: Blob) => Promise<string>;
  allowExternal?: boolean;
  /** Reads the texts of the page aloud. */
  onSpeak?: (page: Page) => void;
  onClose: () => void;
}) {
  const index = Math.max(0, pages.findIndex((p) => p.id === pageId));
  const page = pages[index];
  const [zoom, setZoom] = useState(1);
  const [room, setRoom] = useState({ width: 0, height: 0 });
  const [strip, setStrip] = useState(false);
  const [full, setFull] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ id: number; x: number; y: number; left: number; top: number; time: number } | null>(null);

  const go = useCallback(
    (i: number) => {
      if (i < 0 || i >= pages.length || i === index) return;
      setZoom(1);
      onPage(pages[i].id);
    },
    [pages, index, onPage],
  );

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => setRoom({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const changed = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', changed);
    return () => {
      document.removeEventListener('fullscreenchange', changed);
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]') || document.querySelector('.modal-backdrop')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !target?.closest('button'))) go(index + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(index - 1);
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(pages.length - 1);
      else if (e.key === 'Escape' && !document.fullscreenElement) onClose();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [go, index, pages.length, onClose]);

  usePinchZoom(scroller, zoom, setZoom, { onFit: () => setZoom(1) });

  if (!page) return null;
  const size = dimensions(page);
  const gutter = room.width > 860 ? 84 : 10;
  const fit = room.width
    ? Math.max(0.05, Math.min((room.width - 2 * gutter) / (size.width * PX), (room.height - 20) / (size.height * PX)))
    : 0;
  const scale = fit * zoom;
  const zoomed = zoom > 1.02;

  return (
    <div className="reader" role="dialog" aria-modal="true" aria-label="Lesemodus">
      <header className="reader-bar">
        <button type="button" className="reader-button reader-close" onClick={onClose}>
          <Icon name="cancel" size={24} />
          <span>Lesemodus beenden</span>
        </button>
        <h1 className="reader-title">{title}</h1>
        <span className="reader-count" role="status">
          Seite {index + 1} von {pages.length}
        </span>
        <div className="reader-actions">
          {onSpeak && (
            <button type="button" className="reader-button" onClick={() => onSpeak(page)}>
              <Icon name="speaker" size={24} />
              <span>Vorlesen</span>
            </button>
          )}
          {zoomed && (
            <button type="button" className="reader-button" onClick={() => setZoom(1)}>
              <Icon name="expand" size={24} />
              <span>Ganze Seite</span>
            </button>
          )}
          <button type="button" className="reader-button" aria-pressed={strip} onClick={() => setStrip(!strip)}>
            <Icon name="grid" size={24} />
            <span>Alle Seiten</span>
          </button>
          {typeof document !== 'undefined' && document.documentElement.requestFullscreen && (
            <button
              type="button"
              className="reader-button"
              aria-pressed={full}
              onClick={() =>
                void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => undefined)
              }
            >
              <Icon name="video_projector" size={24} />
              <span>{full ? 'Vollbild beenden' : 'Vollbild'}</span>
            </button>
          )}
        </div>
      </header>
      <div className="reader-stage" ref={stage}>
        <div
          className="reader-scroll"
          ref={scroller}
          style={{ touchAction: 'none' }}
          onPointerDown={(e) => {
            if (e.button !== 0 || (e.target as HTMLElement).closest(OWN_GESTURES)) return;
            const el = scroller.current!;
            swipe.current = { id: e.pointerId, x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop, time: performance.now() };
          }}
          onPointerMove={(e) => {
            const s = swipe.current;
            if (!s || s.id !== e.pointerId || !zoomed) return;
            // Zoomed in: one finger (or the mouse) moves the page.
            scroller.current!.scrollLeft = s.left - (e.clientX - s.x);
            scroller.current!.scrollTop = s.top - (e.clientY - s.y);
          }}
          onPointerUp={(e) => {
            const s = swipe.current;
            swipe.current = null;
            if (!s || s.id !== e.pointerId || zoomed) return;
            const dx = e.clientX - s.x, dy = e.clientY - s.y;
            if (Math.abs(dx) > 60 && Math.abs(dy) < Math.abs(dx) * 0.6 && performance.now() - s.time < 800) go(dx < 0 ? index + 1 : index - 1);
          }}
          onPointerCancel={() => (swipe.current = null)}
        >
          {fit > 0 && (
            <div className="scaled-page reader-page">
              <div style={{ width: size.width * PX * scale, height: size.height * PX * scale, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                  <LearningRuntime interactive allowExternal={allowExternal} onResponse={onResponse} onRecord={onRecord} uploadAudio={uploadAudio}>
                    <LinkContext.Provider
                      value={{
                        openPage: (id) => go(pages.findIndex((p) => p.id === id)),
                        pageNumber: (id) => {
                          const i = pages.findIndex((p) => p.id === id);
                          return i < 0 ? undefined : i + 1;
                        },
                      }}
                    >
                      <PageView key={page.id} page={page} />
                    </LinkContext.Provider>
                  </LearningRuntime>
                </div>
              </div>
            </div>
          )}
        </div>
        <button type="button" className="reader-turn previous" aria-label="Vorherige Seite" disabled={index === 0} onClick={() => go(index - 1)}>
          <Icon name="previous" size={34} />
        </button>
        <button type="button" className="reader-turn next" aria-label="Nächste Seite" disabled={index === pages.length - 1} onClick={() => go(index + 1)}>
          <Icon name="next" size={34} />
        </button>
      </div>
      {strip && (
        <nav className="reader-strip" aria-label="Alle Seiten">
          {pages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`reader-thumb ${p.orientation} ${i === index ? 'active' : ''}`}
              aria-label={`Seite ${i + 1}`}
              aria-current={i === index ? 'page' : undefined}
              onClick={() => go(i)}
            >
              <ScaledPage page={p} decorative />
              <span>{i + 1}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
