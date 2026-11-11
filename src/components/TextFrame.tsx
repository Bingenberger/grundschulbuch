// Frames around text boxes: drawn as SVG in the real size of the box (mm), so
// tails, bubbles and spikes keep their shape and look the same in the editor,
// in print and in the HTML export.
import type { PageElement } from '@/lib/notebook-model';

export type TextFrameKind = 'none' | 'box' | 'note' | 'speech' | 'thought' | 'shout' | 'banner';

const defaultFill: Record<TextFrameKind, string> = {
  none: 'none',
  box: 'none',
  note: '#fff59d',
  speech: '#ffffff',
  thought: '#ffffff',
  shout: '#ffffff',
  banner: '#ffe082',
};

export function frameKind(el: PageElement): TextFrameKind {
  return (el.textFrame as TextFrameKind) || 'none';
}

/** Fill of the frame (or of the plain text box). */
export function frameFill(el: PageElement) {
  return el.background || defaultFill[frameKind(el)];
}

/** Line colour; follows the text colour unless chosen separately. */
export function frameLine(el: PageElement) {
  return el.borderColor || (frameKind(el) === 'note' ? '#c9a800' : el.color);
}

export function frameWidth(el: PageElement) {
  return el.borderWidth ?? (frameKind(el) === 'none' ? 0 : 0.4);
}

/** Inner spacing so the text stays inside the shape. */
export function framePadding(el: PageElement): string | undefined {
  const w = el.width, h = el.height, line = frameWidth(el);
  switch (frameKind(el)) {
    case 'none':
      return line > 0 || (el.background && el.background !== 'none') ? `${1.5 + line}mm` : undefined;
    case 'box':
      return `${2 + line}mm`;
    case 'note':
      return `${3 + line}mm`;
    case 'speech':
      return `${2.5 + line}mm ${3 + line}mm`;
    case 'thought':
      return `${(h * 0.15).toFixed(2)}mm ${(w * 0.15).toFixed(2)}mm`;
    case 'shout':
      return `${(h * 0.2).toFixed(2)}mm ${(w * 0.2).toFixed(2)}mm`;
    case 'banner':
      return `${2 + line}mm ${Math.min(10, w * 0.12) + 1}mm`;
  }
}

const f = (n: number) => Math.round(n * 100) / 100;

/** SVG paths of a frame in mm; the speech tail and thought bubbles reach below the box. */
export function framePaths(kind: TextFrameKind, w: number, h: number): string[] {
  switch (kind) {
    case 'none':
    case 'box': {
      const r = Math.min(1.5, w / 4, h / 4);
      return [`M${r} 0H${f(w - r)}Q${w} 0 ${w} ${r}V${f(h - r)}Q${w} ${h} ${f(w - r)} ${h}H${r}Q0 ${h} 0 ${f(h - r)}V${r}Q0 0 ${r} 0Z`];
    }
    case 'note': {
      const c = Math.min(7, w / 4, h / 3);
      return [
        `M0 0H${w}V${f(h - c)}L${f(w - c)} ${h}H0Z`,
        `M${f(w - c)} ${h}L${f(w - c * 0.85)} ${f(h - c * 0.85)}L${w} ${f(h - c)}`,
      ];
    }
    case 'speech': {
      const r = Math.min(5, w / 4, h / 3);
      const tail = Math.min(7, h * 0.6);
      const a = f(Math.max(r, w * 0.18)), b = f(Math.max(r + 4, w * 0.32));
      return [
        `M${r} 0H${f(w - r)}Q${w} 0 ${w} ${r}V${f(h - r)}Q${w} ${h} ${f(w - r)} ${h}` +
          `H${b}L${f(a - 2)} ${f(h + tail)}L${a} ${h}H${r}Q0 ${h} 0 ${f(h - r)}V${r}Q0 0 ${r} 0Z`,
      ];
    }
    case 'thought': {
      // A cloud: bumps along an ellipse, plus two small bubbles.
      const cx = w / 2, cy = h / 2, rx = w / 2, ry = h / 2;
      const n = Math.max(8, Math.min(16, Math.round((w + h) / 10)));
      const pts = Array.from({ length: n }, (_, i) => {
        const t = (i / n) * Math.PI * 2;
        return [cx + rx * Math.cos(t) * 0.92, cy + ry * Math.sin(t) * 0.88];
      });
      const bump = Math.min(w, h) * 0.18 + 2;
      let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
      for (let i = 1; i <= n; i++) {
        const [x, y] = pts[i % n];
        d += `A${f(bump)} ${f(bump)} 0 0 1 ${f(x)} ${f(y)}`;
      }
      const small = Math.min(2.5, h / 8);
      const circle = (x: number, y: number, r: number) =>
        `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`;
      return [`${d}Z`, circle(w * 0.2, h + small * 1.6, small), circle(w * 0.12, h + small * 3.4, small * 0.6)];
    }
    case 'shout': {
      const n = Math.max(12, Math.min(24, Math.round((w + h) / 6)));
      const pts = Array.from({ length: n * 2 }, (_, i) => {
        const t = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
        const k = i % 2 ? 0.78 : 1;
        return `${f(w / 2 + (w / 2) * k * Math.cos(t))} ${f(h / 2 + (h / 2) * k * Math.sin(t))}`;
      });
      return [`M${pts.join('L')}Z`];
    }
    case 'banner': {
      const e = Math.min(8, w * 0.1);
      return [`M0 0H${w}L${f(w - e)} ${f(h / 2)}L${w} ${h}H0L${e} ${f(h / 2)}Z`];
    }
  }
}

/** The frame behind the text; nothing when there is neither line nor fill. */
export default function TextFrame({ element: el }: { element: PageElement }) {
  const kind = frameKind(el);
  const fill = frameFill(el);
  const line = frameWidth(el);
  if (kind === 'none' && line <= 0 && fill === 'none') return null;
  const paths = framePaths(kind, el.width, el.height);
  return (
    <svg
      className={`text-frame frame-${kind}`}
      viewBox={`0 0 ${el.width} ${el.height}`}
      aria-hidden="true"
      style={{ width: `${el.width}mm`, height: `${el.height}mm` }}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={kind === 'note' && i === 1 ? 'rgba(0,0,0,0.08)' : fill}
          stroke={line > 0 ? frameLine(el) : 'none'}
          strokeWidth={line}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/** Box height (mm) the frame needs around text of the given height. */
export function frameHeightFor(el: PageElement, content: number) {
  const line = frameWidth(el);
  switch (frameKind(el)) {
    case 'none':
      return content + (line > 0 || (el.background && el.background !== 'none') ? 2 * (1.5 + line) : 0);
    case 'box':
      return content + 2 * (2 + line);
    case 'note':
      return content + 2 * (3 + line);
    case 'speech':
      return content + 2 * (2.5 + line);
    case 'thought':
      return content / 0.7;
    case 'shout':
      return content / 0.6;
    case 'banner':
      return content + 2 * (2 + line);
  }
}

/** Small picture of a frame for the buttons. */
export function FrameGlyph({ kind, fill, line = '#37474f' }: { kind: TextFrameKind; fill?: string; line?: string }) {
  const w = 24, h = kind === 'speech' || kind === 'thought' ? 13 : 16;
  return (
    <svg viewBox="-2 -2 28 26" width="28" height="26" aria-hidden="true" className="frame-glyph">
      {framePaths(kind === 'none' ? 'box' : kind, w, h).map((d, i) => (
        <path
          key={i}
          d={d}
          fill={kind === 'none' ? 'none' : fill ?? defaultFill[kind]}
          stroke={line}
          strokeWidth={1.4}
          strokeDasharray={kind === 'none' ? '2 2' : undefined}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
