'use client';
// A tappable part of an SVG learning tool; works with Enter and Space too.
// The editor does not move the element when a key is pressed.
import type { ReactNode } from 'react';

export default function SvgKey({ label, active, onPress, children, className = '' }: { label: string; active: boolean; onPress: () => void; children: ReactNode; className?: string }) {
  if (!active) return <g className={className}>{children}</g>;
  return (
    <g
      className={`svg-key ${className}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onPress();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onPress();
        }
      }}
    >
      <title>{label}</title>
      {children}
    </g>
  );
}

/** A rounded button with a text, as used by the maths tools. */
export function SvgButton({ x, y, w, h, label, text, active, onPress, fill = '#1c7ed6', color = '#fff', size = 26, disabled = false }: { x: number; y: number; w: number; h: number; label: string; text: string; active: boolean; onPress: () => void; fill?: string; color?: string; size?: number; disabled?: boolean }) {
  return (
    <SvgKey label={label} active={active && !disabled} onPress={onPress}>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} opacity={disabled ? 0.35 : 1} />
      <text x={x + w / 2} y={y + h / 2 + size * 0.36} textAnchor="middle" fontSize={size} fontWeight="700" fill={color} fontFamily="Verdana, Arial, sans-serif" opacity={disabled ? 0.6 : 1}>
        {text}
      </text>
    </SvgKey>
  );
}
