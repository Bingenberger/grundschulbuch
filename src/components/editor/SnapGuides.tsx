import type { Guide } from '@/lib/snap';

/**
 * Red guide lines while moving or resizing (page coordinates in mm). Lines on
 * page stops are dashed; equal gaps get a bar with end ticks.
 */
export default function SnapGuides({ guides }: { guides: Guide[] }) {
  const tick = 1.6;
  return (
    <svg className="snap-guides" aria-hidden="true" width="1mm" height="1mm" viewBox="0 0 1 1" overflow="visible">
      {guides.map((g, i) => {
        if (g.kind === 'line') {
          const pad = g.page ? 0 : 2;
          return g.axis === 'x' ? (
            <line key={i} className={g.page ? 'page' : ''} x1={g.at} x2={g.at} y1={g.from - pad} y2={g.to + pad} />
          ) : (
            <line key={i} className={g.page ? 'page' : ''} y1={g.at} y2={g.at} x1={g.from - pad} x2={g.to + pad} />
          );
        }
        const d = `M${g.from} ${g.at}H${g.to}M${g.from} ${g.at - tick}V${g.at + tick}M${g.to} ${g.at - tick}V${g.at + tick}`;
        return <path key={i} className="gap" d={d} transform={g.axis === 'y' ? 'matrix(0 1 1 0 0 0)' : undefined} />;
      })}
    </svg>
  );
}
