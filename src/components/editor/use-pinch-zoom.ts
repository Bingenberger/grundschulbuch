'use client';
import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 3;
export const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

/** Where a point of the page (fx, fy as fractions of the page box) should appear on screen. */
type Anchor = { fx: number; fy: number; x: number; y: number };

const pageBox = (area: HTMLElement) => area.querySelector<HTMLElement>('.scaled-page > div')?.getBoundingClientRect();

/** Zoom at which the whole page fits into the scroll area. */
export function fitZoom(area: HTMLElement | null | undefined, zoom: number) {
  const box = area && pageBox(area);
  if (!area || !box?.width) return zoom;
  return clampZoom(zoom * Math.min((area.clientHeight - 30) / box.height, (area.clientWidth - 40) / box.width));
}

/**
 * Gestures for zooming the page in its scroll area:
 * - two fingers: pinch to zoom around the point between the fingers, drag to pan,
 *   double tap with two fingers shows the whole page;
 * - Ctrl/Cmd + mouse wheel and trackpad pinch (Chrome sends Ctrl + wheel, Safari gesture events).
 * A second finger cancels what the first one started (onStart), so a pinch never draws.
 */
export function usePinchZoom(
  area: RefObject<HTMLElement | null>,
  zoom: number,
  setZoom: (zoom: number) => void,
  options: { enabled?: boolean; onStart?: () => void; onFit?: () => void } = {},
) {
  const latest = useRef({ zoom, setZoom, options });
  const pending = useRef<Anchor | null>(null);
  useLayoutEffect(() => {
    latest.current = { zoom, setZoom, options };
  });
  const enabled = options.enabled !== false;

  // After the new zoom is laid out, scroll so the anchor point is where it belongs.
  useLayoutEffect(() => {
    const a = pending.current, el = area.current;
    pending.current = null;
    if (a && el) settle(el, a);
  }, [zoom, area]);

  useEffect(() => {
    const el = area.current;
    if (!el || !enabled) return;
    const touches = new Map<number, { x: number; y: number }>();
    let pinch: { d0: number; z0: number; fx: number; fy: number; x0: number; y0: number; time: number; moved: boolean } | null = null;
    let lastTap = 0;
    let safariStart = 0;

    function zoomTo(next: number, anchor: Anchor) {
      const z = clampZoom(next);
      if (Math.abs(z - latest.current.zoom) < 0.001) return settle(el!, anchor);
      latest.current.zoom = z;
      pending.current = anchor;
      latest.current.setZoom(z);
    }
    function zoomAt(next: number, x: number, y: number) {
      const box = pageBox(el!);
      if (box?.width) zoomTo(next, { fx: (x - box.left) / box.width, fy: (y - box.top) / box.height, x, y });
    }
    const middle = () => {
      const [a, b] = [...touches.values()];
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)) };
    };
    const stop = (e: Event) => {
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
    };

    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touches.size === 2) {
        if (!pinch) latest.current.options.onStart?.();
        const m = middle(), box = pageBox(el);
        if (box?.width)
          pinch = {
            d0: m.d,
            z0: latest.current.zoom,
            fx: (m.x - box.left) / box.width,
            fy: (m.y - box.top) / box.height,
            x0: m.x,
            y0: m.y,
            time: pinch?.time ?? performance.now(),
            moved: pinch?.moved ?? false,
          };
      }
      if (pinch) stop(e);
    };
    const move = (e: PointerEvent) => {
      if (!touches.has(e.pointerId)) return;
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (!pinch) return;
      stop(e);
      if (touches.size !== 2) return;
      const m = middle();
      if (Math.abs(m.d - pinch.d0) > 12 || Math.hypot(m.x - pinch.x0, m.y - pinch.y0) > 12) pinch.moved = true;
      zoomTo((pinch.z0 * m.d) / pinch.d0, { fx: pinch.fx, fy: pinch.fy, x: m.x, y: m.y });
    };
    const up = (e: PointerEvent) => {
      if (!touches.delete(e.pointerId) || !pinch) return;
      stop(e);
      if (touches.size) return;
      const quick = !pinch.moved && performance.now() - pinch.time < 350;
      pinch = null;
      if (!quick) return;
      const now = performance.now();
      if (now - lastTap < 450) {
        lastTap = 0;
        latest.current.options.onFit?.();
      } else lastTap = now;
    };
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const delta = e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode === 2 ? 1 : 0.01);
      zoomAt(latest.current.zoom * Math.exp(-Math.max(-0.5, Math.min(0.5, delta))), e.clientX, e.clientY);
    };
    // Safari: trackpad pinch on the Mac; on the iPad it would zoom the whole app.
    type GestureEvent = Event & { scale: number; clientX: number; clientY: number };
    const gestureStart = (e: Event) => {
      e.preventDefault();
      safariStart = touches.size ? 0 : latest.current.zoom;
    };
    const gestureChange = (e: Event) => {
      e.preventDefault();
      const g = e as GestureEvent;
      if (safariStart && !touches.size) zoomAt(safariStart * g.scale, g.clientX, g.clientY);
    };
    const gestureEnd = (e: Event) => {
      e.preventDefault();
      safariStart = 0;
    };

    const capture = { capture: true };
    el.addEventListener('pointerdown', down, capture);
    el.addEventListener('pointermove', move, capture);
    el.addEventListener('pointerup', up, capture);
    el.addEventListener('pointercancel', up, capture);
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('gesturestart', gestureStart);
    el.addEventListener('gesturechange', gestureChange);
    el.addEventListener('gestureend', gestureEnd);
    return () => {
      el.removeEventListener('pointerdown', down, capture);
      el.removeEventListener('pointermove', move, capture);
      el.removeEventListener('pointerup', up, capture);
      el.removeEventListener('pointercancel', up, capture);
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('gesturestart', gestureStart);
      el.removeEventListener('gesturechange', gestureChange);
      el.removeEventListener('gestureend', gestureEnd);
    };
  }, [area, enabled]);
}

function settle(area: HTMLElement, a: Anchor) {
  const box = pageBox(area);
  if (!box?.width) return;
  area.scrollLeft += box.left + a.fx * box.width - a.x;
  area.scrollTop += box.top + a.fy * box.height - a.y;
}
