'use client';
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { guideShape, manipulateGuide, type DrawingGuide, type GuideManipulation } from '@/lib/drawing-guide';
import type { GeometryPoint } from '@/lib/learning/geometry';
export function geometrySurfacePoint(svg: SVGSVGElement, event: { clientX: number; clientY: number }): GeometryPoint {
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: 0, y: 0 };
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  return { x: Math.max(0, Math.min(200, point.x)), y: Math.max(0, Math.min(200, point.y)) };
}
export default function GeometryGuide({ guide, change, close }: { guide: DrawingGuide; change: (value: DrawingGuide) => void; close: () => void }) {
  const held = useRef<{ pointer: number; gesture: GuideManipulation } | null>(null), shape = guideShape(guide.kind), label = guide.kind === 'ruler' ? 'Lineal' : 'Geodreieck';
  useEffect(() => { const cancel = () => { held.current = null; }; window.addEventListener('blur', cancel); return () => window.removeEventListener('blur', cancel); }, []);
  function start(event: ReactPointerEvent<SVGGElement>, mode: 'move' | 'rotate') {
    event.preventDefault(); event.stopPropagation(); if (event.button !== 0 || held.current) return;
    const point = geometrySurfacePoint(event.currentTarget.ownerSVGElement!, event);
    held.current = { pointer: event.pointerId, gesture: { guide, point, mode, angle: Math.atan2(point.y - guide.y, point.x - guide.x) } };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  return <g className="geometry-guide" role="group" aria-label={`${label} · ziehen zum Verschieben, Pfeiltasten bewegen, Umschalt und Pfeile drehen`} tabIndex={0}
    onContextMenu={event => event.preventDefault()} onPointerDown={event => start(event, 'move')}
    onPointerMove={event => { const active = held.current; if (!active || active.pointer !== event.pointerId) return; event.stopPropagation(); event.preventDefault(); change(manipulateGuide(active.gesture, [geometrySurfacePoint(event.currentTarget.ownerSVGElement!, event)], { width: 200, height: 200 }, event.shiftKey)); }}
    onPointerUp={event => { event.stopPropagation(); held.current = null; }} onPointerCancel={() => { held.current = null; }} onLostPointerCapture={() => { held.current = null; }}
    onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); held.current = null; close(); return; }
      const delta = ({ ArrowLeft: [-5, 0], ArrowRight: [5, 0], ArrowUp: [0, -5], ArrowDown: [0, 5] } as Record<string, number[]>)[event.key];
      if (!delta) return; event.preventDefault(); event.stopPropagation();
      change(event.shiftKey ? { ...guide, angle: (guide.angle + (delta[0] + delta[1] > 0 ? 15 : -15) + 360) % 360 } : { ...guide, x: Math.max(15, Math.min(185, guide.x + delta[0])), y: Math.max(15, Math.min(185, guide.y + delta[1])) });
    }}>
    <g transform={`translate(${guide.x} ${guide.y}) rotate(${guide.angle}) translate(${-shape.pivot.x} ${-shape.pivot.y})`}>
      <polygon points={shape.vertices.map(p => `${p.x},${p.y}`).join(' ')} fill="#d8e8fa" fillOpacity=".65" stroke="#38668a" strokeWidth=".6" />
      {Array.from({ length: 19 }, (_, i) => <g key={i}><path d={`M${i * 10} 0v${i % 5 ? 3 : 6}`} stroke="#38668a" strokeWidth=".4" />{i % 2 === 0 && <text x={i * 10} y="10" textAnchor="middle" fontSize="4" fill="#253c42">{i}</text>}</g>)}
      <text x="60" y={shape.height > 30 ? 25 : 17} fontSize="5" fill="#253c42">{label}</text>
      <g role="button" aria-label={`${label} schließen`} tabIndex={0} onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); close(); }} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); close(); } }}><circle cx="167" cy="12" r="7" fill="white" /><text x="167" y="15" textAnchor="middle" fontSize="9">×</text></g>
      <g role="button" aria-label={`${label} drehen`} tabIndex={0} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); change({ ...guide, angle: (guide.angle + 15) % 360 }); } }} onPointerDown={event => start(event, 'rotate')}><circle cx="145" cy="12" r="7" fill="white" /><text x="145" y="15" textAnchor="middle" fontSize="9">↻</text></g>
    </g>
  </g>;
}
