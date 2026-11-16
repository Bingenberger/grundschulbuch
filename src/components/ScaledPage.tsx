'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { dimensions, sheetSize, type Page } from '@/lib/notebook-model';
import PageView from './PageView';
import { Decorative } from './Decorative';
export default function ScaledPage({
  page,
  maxScale = 1,
  zoom = 1,
  decorative = false,
  canvas = false,
  children,
}: {
  page: Page;
  maxScale?: number;
  zoom?: number;
  decorative?: boolean;
  /** Editing view in a scroll area: endless paper is shown at the size of one
   *  sheet and can be scrolled in every direction. */
  canvas?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Fit to the width; the zoom applies right away (gestures anchor on the new size).
  const [fit, setFit] = useState(0.5);
  const scale = fit * zoom;
  const size = dimensions(page);
  const px = 96 / 25.4;
  const open = canvas && page.paperMode === 'endless';
  const fitWidth = open ? sheetSize(page).width : size.width;
  useEndlessScroll(ref, open, page.id, size.left, size.top, fit, scale);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Ignore tiny changes, so a scrollbar coming and going cannot make it jitter.
    const update = () => {
      // Endless paper fills the scroll area; one sheet is shown as wide as an A4 page would be
      // (on the board as wide as the board).
      const room = open && maxScale <= 1 ? Math.min(el.clientWidth, SHEET_VIEW) : el.clientWidth;
      const next = Math.min(maxScale, room / (fitWidth * px));
      setFit((old) => (Math.abs(old - next) < 0.004 * next ? old : next));
    };
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fitWidth, maxScale, px, open]);
  return (
    <div
      ref={ref}
      aria-hidden={decorative || undefined}
      inert={decorative || undefined}
      className="scaled-page"
      style={{ width: '100%' }}
    >
      <div
        style={{
          width: size.width * px * scale,
          height: size.height * px * scale,
          position: 'relative',
          margin: 'auto',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <Decorative.Provider value={decorative}><PageView page={page}>{children}</PageView></Decorative.Provider>
        </div>
      </div>
    </div>
  );
}

/** Width of an A4 page in the editor (max-width of .canvas-sheet). */
const SHEET_VIEW = 815;
const scrollArea = (el: HTMLElement | null) => el?.closest<HTMLElement>('.canvas-scroll') || null;

/**
 * Keeps endless paper calm while it grows: opening a page shows the first
 * sheet, and when the surface extends to the left or top the view moves along,
 * so the content stays where it is on screen. The middle mouse button or the
 * space bar plus dragging moves the view (two fingers and the wheel scroll anyway).
 */
function useEndlessScroll(ref: React.RefObject<HTMLDivElement | null>, open: boolean, pageId: string, left: number, top: number, fit: number, scale: number) {
  const last = useRef<{ open: boolean; pageId: string; left: number; top: number; fit: number; scale: number } | null>(null);
  // A new fit (first layout, window size) shows the first sheet again until the user moves the view.
  const moved = useRef(false);
  useLayoutEffect(() => {
    const area = scrollArea(ref.current), box = ref.current?.firstElementChild as HTMLElement | null;
    const before = last.current;
    last.current = { open, pageId, left, top, fit, scale };
    if (!open || !area || !box) return;
    const mm = (96 / 25.4) * scale;
    if (!before || !before.open || before.pageId !== pageId || (before.fit !== fit && !moved.current)) {
      // Show the first sheet with a little room above and to the left.
      const a = area.getBoundingClientRect(), b = box.getBoundingClientRect();
      area.scrollLeft += b.left - a.left + (0 - left) * mm - 24;
      area.scrollTop += b.top - a.top + (0 - top) * mm - 24;
      if (before?.pageId !== pageId || !before?.open) moved.current = false;
      return;
    }
    if (before.fit !== fit) return;
    // Zoom is anchored by the pinch gesture itself; only growth needs help here.
    if (before.scale !== scale) return;
    if (before.left !== left) area.scrollLeft += (before.left - left) * mm;
    if (before.top !== top) area.scrollTop += (before.top - top) * mm;
  }, [ref, open, pageId, left, top, fit, scale]);

  useEffect(() => {
    const area = scrollArea(ref.current);
    if (!open || !area) return;
    const touched = () => { moved.current = true; };
    let space = false, drag: { x: number; y: number; left: number; top: number; id: number } | null = null;
    const typing = (target: EventTarget | null) => target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    const key = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || typing(e.target)) return;
      space = e.type === 'keydown';
      area.classList.toggle('panning-ready', space);
      if (space) e.preventDefault();
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !(e.button === 1 || (e.button === 0 && space))) return;
      e.preventDefault(); e.stopPropagation();
      drag = { x: e.clientX, y: e.clientY, left: area.scrollLeft, top: area.scrollTop, id: e.pointerId };
      area.setPointerCapture(e.pointerId);
      area.classList.add('panning');
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      e.preventDefault(); e.stopPropagation();
      area.scrollLeft = drag.left - (e.clientX - drag.x);
      area.scrollTop = drag.top - (e.clientY - drag.y);
    };
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      area.classList.remove('panning');
    };
    window.addEventListener('keydown', key);
    window.addEventListener('keyup', key);
    for (const type of ['wheel', 'pointerdown', 'keydown'] as const) area.addEventListener(type, touched, { passive: true });
    area.addEventListener('pointerdown', down, true);
    area.addEventListener('pointermove', move, true);
    area.addEventListener('pointerup', up, true);
    area.addEventListener('pointercancel', up, true);
    return () => {
      window.removeEventListener('keydown', key);
      window.removeEventListener('keyup', key);
      area.removeEventListener('pointerdown', down, true);
      area.removeEventListener('pointermove', move, true);
      area.removeEventListener('pointerup', up, true);
      area.removeEventListener('pointercancel', up, true);
      for (const type of ['wheel', 'pointerdown', 'keydown'] as const) area.removeEventListener(type, touched);
      area.classList.remove('panning', 'panning-ready');
    };
  }, [ref, open]);
}
