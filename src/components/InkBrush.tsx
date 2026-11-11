import { brushOutline, crayonDensity } from '@/lib/brushes';
import { pathBounds } from '@/lib/drawing';
import type { PageElement } from '@/lib/notebook-model';

/** Rendering is shared by the editors, print pages and portable viewers. */
export default function InkBrush({ element: el, id }: { element: PageElement; id: string }) {
  const style = el.penStyle || 'pen';
  const bounds = pathBounds(el.points || [], (el.penWidth || 0.8) * 1.7 + 1);
  if (style === 'crayon') {
    const density = crayonDensity(el);
    const seed = Array.from(el.id).reduce((value, letter) => (value * 31 + letter.charCodeAt(0)) % 1009, 1);
    return <>
      <defs>
        <filter id={`${id}-paper`} filterUnits="userSpaceOnUse" {...bounds} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="2.8 3.6" numOctaves="2" seed={seed} result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 6 -2.4" result="tooth" />
          <feComposite in="SourceGraphic" in2="tooth" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${id}-paper)`}>
        {[[1, 0.18], [0.78, 0.28], [0.52, 0.4], [0.28, 0.5]].map(([scale, alpha]) =>
          <path key={scale} d={brushOutline(el, scale)} fill={el.color} opacity={Math.min(1, alpha * density * (el.opacity ?? 0.9) / 0.9)} />)}
      </g>
    </>;
  }
  if (style === 'water') return <>
    <defs>
      <filter id={`${id}-wash`} filterUnits="userSpaceOnUse" {...bounds} colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation={(el.penWidth || 0.8) * 0.035} />
      </filter>
    </defs>
    <g filter={`url(#${id}-wash)`}>
      {[1.2, 0.88, 0.57].map(scale => <path key={scale} d={brushOutline(el, scale)} fill={el.color} opacity={(el.opacity ?? 0.45) * 0.42} />)}
    </g>
  </>;
  return <path d={brushOutline(el)} fill={el.color} style={{ pointerEvents: 'painted' }} />;
}
