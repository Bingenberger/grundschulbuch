// Lineatur on part of the page: writing lines (optionally with the Zeilenhaus),
// squares, single boxes, dots or staves. Drawn in mm, so nothing is stretched.
import type { PageElement } from '@/lib/notebook-model';
import { LINE_COLORS, lineaturLabels, lineaturLayout, lineaturSettings, houseWidth, type LineaturSettings } from '@/lib/lineatur';

const U = 297 / 1400;
/** Zeilenhaus: sky above, the house in the middle, the cellar below. */
export const HOUSE_COLORS = { roof: '#e8f2fd', floor: '#fff4c7', cellar: '#f3e6d6' };

function House({ x, y, band }: { x: number; y: number; band: number }) {
  const w = houseWidth(band), mid = x + w / 2;
  return (
    <g className="zeilenhaus">
      <path d={`M${x} ${y + band} L${mid} ${y + band * 0.08} L${x + w} ${y + band} Z`} fill="#f07167" stroke="#c44536" strokeWidth={band * 0.04} strokeLinejoin="round" />
      <rect x={x + w * 0.1} y={y + band} width={w * 0.8} height={band} fill="#ffd43b" stroke="#d9a400" strokeWidth={band * 0.04} />
      <rect x={x + w * 0.42} y={y + band * 1.4} width={w * 0.18} height={band * 0.6} fill="#a0522d" />
      <rect x={x + w * 0.16} y={y + band * 1.2} width={w * 0.18} height={band * 0.3} fill="#9ad0f5" />
      <rect x={x + w * 0.1} y={y + band * 2} width={w * 0.8} height={band} fill="#b08968" stroke="#7f5539" strokeWidth={band * 0.04} />
      <rect x={x + w * 0.62} y={y + band * 2.3} width={w * 0.16} height={band * 0.3} fill="#5c4033" />
    </g>
  );
}

export function LineaturSvg({ settings, width, height, label }: { settings: LineaturSettings; width: number; height: number; label?: string }) {
  const layout = lineaturLayout(settings, width, height);
  const line = (key: string) => settings.color || LINE_COLORS[key];
  let content: React.ReactNode = null;
  if (layout.kind === 'four') {
    const c = line('four'), n = layout.band, x0 = layout.left;
    content = layout.tops.map((a, i) => (
      <g key={i}>
        {settings.house ? (
          <>
            <rect x={x0} y={a} width={width - x0} height={n} fill={HOUSE_COLORS.roof} />
            <rect x={x0} y={a + n} width={width - x0} height={n} fill={HOUSE_COLORS.floor} />
            <rect x={x0} y={a + 2 * n} width={width - x0} height={n} fill={HOUSE_COLORS.cellar} />
            <House x={0} y={a} band={n} />
          </>
        ) : (
          <rect x={x0} y={a + n} width={width - x0} height={n} fill={c} fillOpacity="0.13" />
        )}
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={x0} x2={width} y1={a + k * n} y2={a + k * n} stroke={c} strokeWidth={(k === 2 ? 3 : 1.5) * U} />
        ))}
      </g>
    ));
  } else if (layout.kind === 'single') {
    content = layout.lines.map((y, i) => <line key={i} x1={0} x2={width} y1={y} y2={y} stroke={line('single')} strokeWidth={2 * U} />);
  } else if (layout.kind === 'music') {
    const c = line('music'), g = layout.gap;
    content = layout.tops.map((a, i) => (
      <g key={i}>
        {[0, 1, 2, 3, 4].map((k) => <line key={k} x1={0} x2={width} y1={a + k * g} y2={a + k * g} stroke={c} strokeWidth={1.6 * U} />)}
        <line x1={0.2} x2={0.2} y1={a} y2={a + 4 * g} stroke={c} strokeWidth={2 * U} />
        <line x1={width - 0.2} x2={width - 0.2} y1={a} y2={a + 4 * g} stroke={c} strokeWidth={2 * U} />
      </g>
    ));
  } else if (layout.kind === 'dots') {
    const c = line('dots');
    content = layout.ys.flatMap((y) => layout.xs.map((x) => <circle key={`${x} ${y}`} cx={x} cy={y} r={2.6 * U} fill={c} />));
  } else if (layout.kind === 'boxes') {
    const c = line('grid'), s = layout.step;
    content = layout.ys.slice(0, -1).flatMap((y) => layout.xs.slice(0, -1).map((x) => <rect key={`${x} ${y}`} x={x + s * 0.1} y={y + s * 0.1} width={s * 0.8} height={s * 0.8} rx={0.4} fill="none" stroke={c} strokeWidth={0.25} />));
  } else {
    const c = line('grid'), xs = layout.xs, ys = layout.ys;
    if (xs.length > 1 && ys.length > 1) {
      const d = xs.map((x) => `M${x} ${ys[0]}V${ys[ys.length - 1]}`).join('') + ys.map((y) => `M${xs[0]} ${y}H${xs[xs.length - 1]}`).join('');
      content = <path d={d} fill="none" stroke={c} strokeWidth={1.2 * U} />;
    }
  }
  return (
    <svg className="lineatur-block" width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={label ?? lineaturLabels[settings.ruling] + (settings.house ? ' mit Zeilenhaus' : '')}>
      {content}
    </svg>
  );
}

export default function LineaturWidget({ element }: { element: PageElement }) {
  return <LineaturSvg settings={lineaturSettings(element)} width={element.width} height={element.height} />;
}

/** Small picture of a Lineatur for menus and the building block chooser. */
const GLYPH_MM: Record<LineaturSettings['ruling'], number> = {
  linie1: 22.6, linie2: 17.4, linie3: 13.6, linie4: 30, linieneng: 24, karo5: 21, karo10: 31, rechnen: 31, punkte: 21, noten: 14.8,
};
export function LineaturGlyph({ settings, size = 26, wide = 1 }: { settings: LineaturSettings; size?: number; wide?: number }) {
  const h = GLYPH_MM[settings.ruling];
  return (
    <span className="lineatur-glyph" style={{ width: size * wide, height: size }} aria-hidden="true">
      <LineaturSvg settings={settings} width={h * wide} height={h} label="" />
    </span>
  );
}
