'use client';
import { useEffect, useRef } from 'react';
import { guideShape, manipulateGuide, normaliseGuideAngle, type DrawingGuide, type GuideManipulation } from '@/lib/drawing-guide';

type XY = { x: number; y: number };

export default function DrawingRuler({ guide, onChange, onClose }: {
  guide: DrawingGuide;
  onChange: (guide: DrawingGuide) => void;
  onClose: () => void;
}) {
  const latest = useRef(guide);
  const pointers = useRef(new Map<number, XY>());
  const gesture = useRef<GuideManipulation | null>(null);
  const shape = guideShape(guide.kind);
  const label = guide.kind === 'triangle' ? 'Geodreieck' : 'Lineal';
  useEffect(() => { latest.current = guide; }, [guide]);

  function point(event: React.PointerEvent) {
    const paper = event.currentTarget.closest('.paper') as HTMLElement;
    const rect = paper.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width * parseFloat(paper.style.width),
      y: (event.clientY - rect.top) / rect.height * parseFloat(paper.style.height),
    };
  }
  function rebase(mode: 'move' | 'rotate' = 'move') {
    const values = [...pointers.current.values()];
    if (!values.length) { gesture.current = null; return; }
    const [a, b] = values;
    gesture.current = {
      guide: { ...latest.current },
      point: b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a,
      angle: b ? Math.atan2(b.y - a.y, b.x - a.x) : Math.atan2(a.y - latest.current.y, a.x - latest.current.x),
      mode: b ? 'two' : mode,
    };
  }
  function start(event: React.PointerEvent, mode: 'move' | 'rotate') {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    if (pointers.current.size >= 2) return;
    pointers.current.set(event.pointerId, point(event));
    event.currentTarget.setPointerCapture(event.pointerId);
    rebase(mode);
  }
  function move(event: React.PointerEvent) {
    if (!pointers.current.has(event.pointerId) || !gesture.current) return;
    event.preventDefault();
    event.stopPropagation();
    pointers.current.set(event.pointerId, point(event));
    const paper = event.currentTarget.closest('.paper') as HTMLElement;
    const next = manipulateGuide(gesture.current, [...pointers.current.values()], {
      width: parseFloat(paper.style.width), height: parseFloat(paper.style.height),
    }, event.shiftKey);
    latest.current = next;
    onChange(next);
  }
  function finish(event: React.PointerEvent, cancel = false) {
    if (!pointers.current.has(event.pointerId)) return;
    event.stopPropagation();
    if (cancel && gesture.current) {
      latest.current = gesture.current.guide;
      onChange(latest.current);
      pointers.current.clear();
    } else pointers.current.delete(event.pointerId);
    rebase();
  }
  function keyboard(event: React.KeyboardEvent, rotate = false) {
    const step = event.shiftKey ? rotate ? 15 : 10 : 1;
    const directions: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const delta = directions[event.key];
    if (!delta) return;
    event.preventDefault();
    event.stopPropagation();
    const next = { ...latest.current };
    if (rotate) next.angle = normaliseGuideAngle(next.angle + (delta[0] || delta[1]));
    else {
      const paper = event.currentTarget.closest('.paper') as HTMLElement;
      next.x = Math.max(15, Math.min(parseFloat(paper.style.width) - 15, next.x + delta[0]));
      next.y = Math.max(15, Math.min(parseFloat(paper.style.height) - 15, next.y + delta[1]));
    }
    latest.current = next;
    onChange(next);
  }
  function close(event: React.MouseEvent) {
    event.stopPropagation();
    pointers.current.clear();
    gesture.current = null;
    onClose();
  }
  return <div className="drawing-ruler" role="group" aria-label={`${label} auf der Seite`}
    style={{ position: 'absolute', left: `${guide.x - shape.pivot.x}mm`, top: `${guide.y - shape.pivot.y}mm`,
      width: `${shape.width}mm`, height: `${shape.height}mm`, transform: `rotate(${guide.angle}deg)`,
      transformOrigin: `${shape.pivot.x}mm ${shape.pivot.y}mm`, pointerEvents: 'none', zIndex: 20 }}
    onPointerMove={move} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)}
    onLostPointerCapture={event => finish(event, true)}>
    <svg viewBox={`0 0 ${shape.width} ${shape.height}`} width="100%" height="100%" aria-hidden="true"
      style={{ pointerEvents: 'none', touchAction: 'none', cursor: 'grab', userSelect: 'none' }}
      onPointerDown={event => start(event, 'move')}>
      <polygon points={shape.vertices.map(p => `${p.x},${p.y}`).join(' ')} style={{ pointerEvents: 'all' }} fill="#edd77866" stroke="#a48c3a" strokeWidth=".3" />
      {Array.from({ length: 181 }, (_, i) => <g key={i}>
        <line x1={i} x2={i} y1="0" y2={i % 10 === 0 ? 7 : i % 5 === 0 ? 5 : 3} stroke="#75632f" strokeWidth=".2" />
        {i % 10 === 0 && <text x={i + 0.5} y="10" fontSize="3" fill="#75632f">{guide.kind === 'triangle' ? Math.abs(i - 90) / 10 : i / 10}</text>}
      </g>)}
      {guide.kind === 'triangle' && <g stroke="#75632f" fill="none" strokeWidth=".2">
        <path d="M35 0A55 55 0 0 0 145 0" />
        <line x1="90" y1="0" x2="90" y2="88" strokeDasharray="2 1" />
        <path d="M84 84L90 78L96 84" />
        {Array.from({ length: 35 }, (_, i) => (i + 1) * 5).map(degrees => {
          const angle = degrees * Math.PI / 180;
          return <g key={degrees}>
            <line x1={90 + 55 * Math.cos(angle)} y1={55 * Math.sin(angle)} x2={90 + (degrees % 15 ? 52 : 50) * Math.cos(angle)} y2={(degrees % 15 ? 52 : 50) * Math.sin(angle)} />
            {degrees % 15 === 0 && <text x={90 + 46 * Math.cos(angle)} y={46 * Math.sin(angle)} textAnchor="middle" fontSize="3" stroke="none" fill="#75632f">{degrees}°</text>}
          </g>;
        })}
      </g>}
    </svg>
    <button aria-label={`${label} schließen`} title={`${label} schließen`} className="ruler-close"
      style={{ pointerEvents: 'auto', position: 'absolute', left: `${guide.kind === 'triangle' ? 145 : 160}mm`, top: '5mm',
        width: '11mm', height: '11mm', padding: 0, borderRadius: '50%', fontSize: '5mm', lineHeight: 1, cursor: 'pointer',
        border: '.3mm solid #a48c3a', background: '#fffbea', color: '#55451f', touchAction: 'none' }}
      onPointerDown={event => event.stopPropagation()} onClick={close}>×</button>
    <button aria-label={`${label} verschieben`} className="ruler-grip"
      style={{ pointerEvents: 'auto', position: 'absolute', top: `${guide.kind === 'triangle' ? 20 : 12}mm`, left: '65mm', fontSize: '3mm', touchAction: 'none' }}
      onKeyDown={event => keyboard(event)}
      onPointerDown={event => start(event, 'move')}>↔ {label}</button>
    <button aria-label={`${label} drehen`} className="ruler-angle" title="Zum Drehen ziehen; mit Umschalt in 15°-Schritten"
      style={{ pointerEvents: 'auto', position: 'absolute', top: `${guide.kind === 'triangle' ? 20 : 12}mm`, left: '112mm', fontSize: '3mm', touchAction: 'none' }}
      onKeyDown={event => keyboard(event, true)}
      onClick={event => { if (event.detail === 0) onChange({ ...guide, angle: normaliseGuideAngle(guide.angle + 15) }); }}
      onPointerDown={event => start(event, 'rotate')}>↻ {guide.angle}°</button>
  </div>;
}
