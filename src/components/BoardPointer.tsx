'use client';
import { useEffect, useId, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';

export type BoardPointerMode = 'none' | 'laser' | 'light';
type XY = { x: number; y: number };
type TrailPoint = XY & { time: number };
const trailDuration = 750;

/** Presentation-only SVG: never inserted into page elements or export output. */
export function BoardPointerVisual({ mode, width, height, point, trail = [], radius }: {
  mode: Exclude<BoardPointerMode, 'none'>; width: number; height: number;
  point: XY | null; trail?: (XY & { opacity: number })[]; radius: number;
}) {
  const id = `board-light-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return <svg className="board-pointer-visual" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">
    {mode === 'light' && point && <>
      <defs>
        <radialGradient id={`${id}-edge`}>
          <stop offset="82%" stopColor="black" /><stop offset="100%" stopColor="white" />
        </radialGradient>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height} style={{ maskType: 'luminance' }}>
          <rect width={width} height={height} fill="white" />
          <circle cx={point.x} cy={point.y} r={radius} fill={`url(#${id}-edge)`} />
        </mask>
      </defs>
      <rect width={width} height={height} fill="black" opacity=".78" mask={`url(#${id})`} />
    </>}
    {mode === 'laser' && <>
      <g className="board-laser-trail" fill="none" stroke="#ef2020" strokeWidth="1.1" strokeLinecap="round">
        {trail.slice(1).map((p, i) => <line key={`${p.x}-${p.y}-${i}`} x1={trail[i].x} y1={trail[i].y} x2={p.x} y2={p.y} opacity={p.opacity * 0.7} />)}
      </g>
      {point && <g data-laser-dot="true">
        <circle cx={point.x} cy={point.y} r="2.6" fill="#ff2020" opacity=".2" />
        <circle cx={point.x} cy={point.y} r="1.4" fill="#f02020" stroke="white" strokeWidth=".35" />
        <circle cx={point.x} cy={point.y} r=".45" fill="white" />
      </g>}
    </>}
  </svg>;
}

export default function BoardPointer({ mode, width, height, size, onClose }: {
  mode: Exclude<BoardPointerMode, 'none'>; width: number; height: number; size: number; onClose: () => void;
}) {
  const centre = { x: width / 2, y: height / 2 };
  const point = useRef<XY | null>(mode === 'light' ? centre : null);
  const samples = useRef<TrailPoint[]>([]), frame = useRef<number | null>(null);
  const owner = useRef<number | null>(null), layer = useRef<HTMLDivElement>(null);
  const [visual, setVisual] = useState<{ point: XY | null; trail: (XY & { opacity: number })[] }>({ point: point.current, trail: [] });
  const helpId = useId();
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault(); event.stopImmediatePropagation(); close.current();
    };
    const clear = () => {
      const pointer = owner.current; owner.current = null;
      if (pointer !== null && layer.current?.hasPointerCapture(pointer)) layer.current.releasePointerCapture(pointer);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null; samples.current = []; point.current = mode === 'light' ? { x: width / 2, y: height / 2 } : null;
      setVisual({ point: point.current, trail: [] });
    };
    const visibility = () => { if (document.visibilityState === 'hidden') clear(); };
    window.addEventListener('keydown', key, true);
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      window.removeEventListener('keydown', key, true);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [mode, width, height]);

  function publish(now = performance.now()) {
    samples.current = samples.current.filter(p => now - p.time < trailDuration);
    setVisual({ point: point.current, trail: samples.current.map(p => ({ ...p, opacity: Math.max(0, 1 - (now - p.time) / trailDuration) })) });
    if (samples.current.length && frame.current === null) frame.current = requestAnimationFrame(time => { frame.current = null; publish(time); });
  }
  function locate(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(width, (event.clientX - rect.left) / rect.width * width)),
      y: Math.max(0, Math.min(height, (event.clientY - rect.top) / rect.height * height)) };
  }
  function move(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault(); event.stopPropagation();
    if (owner.current !== null && owner.current !== event.pointerId || event.pointerType === 'touch' && owner.current === null) return;
    const next = locate(event), now = performance.now();
    point.current = next;
    if (mode === 'laser') samples.current = [...samples.current.slice(-159), { ...next, time: now }];
    publish(now);
  }
  function release(event: ReactPointerEvent<HTMLDivElement>, cancelled = false) {
    event.stopPropagation();
    if (owner.current !== event.pointerId) return;
    owner.current = null;
    if (cancelled || event.pointerType === 'touch') {
      if (mode === 'laser') point.current = null;
      if (cancelled) samples.current = [];
    }
    publish();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function key(event: ReactKeyboardEvent<HTMLDivElement>) {
    const directions: Record<string, XY> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault(); event.stopPropagation();
    const p = point.current || centre, step = Math.min(width, height) * (event.shiftKey ? 0.08 : 0.02);
    point.current = { x: Math.max(0, Math.min(width, p.x + direction.x * step)), y: Math.max(0, Math.min(height, p.y + direction.y * step)) };
    publish();
  }
  return <div className={`board-pointer board-pointer-${mode}`} ref={layer} tabIndex={0} role="region"
    aria-label={mode === 'laser' ? 'Laserpointer auf der Seite' : 'Taschenlampe auf der Seite'}
    aria-describedby={helpId}
    onKeyDown={key}
    onFocus={() => { if (!point.current) { point.current = centre; publish(); } }}
    onPointerDown={event => {
      event.preventDefault(); event.stopPropagation();
      if (event.button !== 0 || owner.current !== null) return;
      owner.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.focus({ preventScroll: true }); move(event);
    }}
    onPointerMove={move}
    onPointerUp={event => release(event)}
    onPointerCancel={event => release(event, true)}
    onLostPointerCapture={event => release(event, true)}
    onPointerLeave={() => { if (owner.current === null && mode === 'laser') { point.current = null; samples.current = []; publish(); } }}
    onClick={event => { event.preventDefault(); event.stopPropagation(); }}>
    <span id={helpId} className="visually-hidden">Mit Maus, Finger oder Stift bewegen. Mit den Pfeiltasten verschieben. Escape beendet die Zeigehilfe.</span>
    <BoardPointerVisual mode={mode} width={width} height={height} point={visual.point} trail={visual.trail} radius={Math.min(width, height) * size} />
  </div>;
}
