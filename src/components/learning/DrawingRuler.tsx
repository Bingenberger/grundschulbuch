'use client';
import { useRef, useState } from 'react';
export default function DrawingRuler({
  angle,
  onAngle,
  triangle = false,
}: {
  angle: number;
  onAngle: (angle: number) => void;
  triangle?: boolean;
}) {
  const [position, setPosition] = useState({ x: 15, y: 65 }),
    drag = useRef<{
      x: number;
      y: number;
      px: number;
      py: number;
      scale: number;
    } | null>(null);
  return (
    <div
      className="drawing-ruler"
      style={{
        position: 'absolute',
        left: `${position.x}mm`,
        top: `${position.y}mm`,
        width: '180mm',
        height: triangle ? '90mm' : '22mm',
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'left top',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <svg
        viewBox={`0 0 180 ${triangle ? 90 : 22}`}
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <path
          d={triangle ? 'M0 0H180L90 90Z' : 'M0 0H180V22H0Z'}
          fill="#edd77866"
          stroke="#a48c3a"
          strokeWidth=".3"
        />
        {Array.from({ length: 181 }, (_, i) => (
          <g key={i}>
            <line
              x1={i}
              x2={i}
              y1="0"
              y2={i % 10 === 0 ? 7 : i % 5 === 0 ? 5 : 3}
              stroke="#75632f"
              strokeWidth=".2"
            />
            {i % 10 === 0 && (
              <text x={i + 0.5} y="10" fontSize="3" fill="#75632f">
                {i / 10}
              </text>
            )}
          </g>
        ))}
      </svg>
      <button
        aria-label="Lineal verschieben"
        className="ruler-grip"
        style={{
          pointerEvents: 'auto',
          position: 'absolute',
          top: '12mm',
          left: '70mm',
          fontSize: '3mm',
          touchAction: 'none',
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          const paper = e.currentTarget.closest('.paper')!;
          drag.current = {
            x: e.clientX,
            y: e.clientY,
            px: position.x,
            py: position.y,
            scale:
              paper.getBoundingClientRect().width /
              parseFloat((paper as HTMLElement).style.width),
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (drag.current)
            setPosition({
              x:
                drag.current.px +
                (e.clientX - drag.current.x) / drag.current.scale,
              y:
                drag.current.py +
                (e.clientY - drag.current.y) / drag.current.scale,
            });
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          drag.current = null;
        }}
      >
        ↔ Lineal
      </button>
      <button
        className="ruler-angle"
        aria-label="Lineal um 15 Grad drehen"
        style={{
          pointerEvents: 'auto',
          position: 'absolute',
          top: '12mm',
          left: '95mm',
          fontSize: '3mm',
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onAngle((angle + 15) % 180)}
      >
        ↻ {angle}°
      </button>
    </div>
  );
}
