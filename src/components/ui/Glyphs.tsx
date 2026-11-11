// Small generated pictures used as icons where a picture of the value itself
// explains the option best (line width, colour, opacity …).
import type { CSSProperties } from 'react';

const box = { width: 28, height: 28, viewBox: '0 0 28 28', 'aria-hidden': true } as const;

export function StrokeGlyph({ width, color = '#263238' }: { width: number; color?: string }) {
  return (
    <svg {...box}>
      <path d="M3 18c4-8 7-8 10-2s6 6 12-4" fill="none" stroke={color}
        strokeWidth={Math.max(1, Math.min(9, width * 1.6))} strokeLinecap="round" />
    </svg>
  );
}

export function SwatchGlyph({ color }: { color: string }) {
  return <span className="swatch" style={{ background: color }} aria-hidden="true" />;
}

export function OpacityGlyph({ opacity, color = '#263238' }: { opacity: number; color?: string }) {
  return (
    <svg {...box}>
      <rect x="2" y="2" width="24" height="24" rx="5" fill="#fff" stroke="#cfd8dc" />
      <path d="M2 14h24v7a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5z" fill="#eceff1" />
      <circle cx="14" cy="14" r="9" fill={color} fillOpacity={opacity} />
    </svg>
  );
}

export function DotGlyph({ size }: { size: number }) {
  return (
    <svg {...box}>
      <circle cx="14" cy="14" r={Math.max(2, Math.min(12, size))} fill="#f48fb1" stroke="#ad1457" strokeWidth="1" />
    </svg>
  );
}

export function TipGlyph({ tip }: { tip: 'round' | 'square' | 'slant' }) {
  return (
    <svg {...box}>
      {tip === 'round' && <circle cx="14" cy="14" r="9" fill="#90caf9" stroke="#1e88e5" strokeWidth="1.5" />}
      {tip === 'square' && <rect x="5" y="5" width="18" height="18" rx="1" fill="#90caf9" stroke="#1e88e5" strokeWidth="1.5" />}
      {tip === 'slant' && <path d="M5 21 19 5h4L9 21z" fill="#90caf9" stroke="#1e88e5" strokeWidth="1.5" strokeLinejoin="round" />}
    </svg>
  );
}

export function SoftGlyph({ soft }: { soft: boolean }) {
  return (
    <svg {...box}>
      <defs>
        <radialGradient id="soft-edge">
          <stop offset="0.45" stopColor="#64b5f6" />
          <stop offset="1" stopColor="#64b5f6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="11" fill={soft ? 'url(#soft-edge)' : '#64b5f6'} />
    </svg>
  );
}

export function FontGlyph({ font }: { font: string }) {
  return <span className="font-glyph" style={{ fontFamily: `"${font}", sans-serif` }} aria-hidden="true">Aa</span>;
}

export function AlignGlyph({ align }: { align: 'left' | 'center' | 'right' | 'justify' }) {
  const lines = [22, 16, 20, 12];
  return (
    <svg {...box}>
      {lines.map((w, i) => {
        const width = align === 'justify' ? 22 : w;
        const x = align === 'left' || align === 'justify' ? 3 : align === 'right' ? 25 - width : 14 - width / 2;
        return <rect key={i} x={x} y={5 + i * 5} width={width} height="2.6" rx="1.3" fill={i % 2 ? '#64b5f6' : '#1e88e5'} />;
      })}
    </svg>
  );
}

export function ImageFilterGlyph({ src, filter }: { src?: string; filter: string }) {
  const style: CSSProperties = { filter };
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- local preview of the chosen image
    <img className="filter-glyph" src={src} alt="" aria-hidden="true" style={style} />
  ) : (
    <span className="filter-glyph" style={{ ...style, background: 'linear-gradient(135deg,#ffb74d,#4fc3f7)' }} aria-hidden="true" />
  );
}
