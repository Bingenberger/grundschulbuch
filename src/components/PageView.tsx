import { useId } from 'react';
import { fountainOutline, pathBounds, smoothPath, strokeFillPolygon } from '@/lib/drawing';
import { inkPaintOrder } from '@/lib/brushes';
import InkBrush from './InkBrush';
import { LinkLayer } from './LinkContext';
import { eraserShapePath } from '@/lib/eraser-shapes';
import Activity from './learning/Activity';
import Widget from './learning/Widget';
import {
  Shape,
  ImageContent,
  PageDecoration,
  EmbedContent,
} from './learning/Appearance';
import { dimensions, type Page, type PageElement } from '@/lib/notebook-model';
export function RulingView({ page }: { page: Page }) {
  const uid = useId().replace(/:/g, '');
  const { width, height } = dimensions(page);
  const r = page.ruling;
  const blue = page.lineColor || '#a0bcd3';
  const red = '#d99b9b';
  let pattern: React.ReactNode;
  let period = 10;
  let patternWidth = width;
  if (r.startsWith('karo') || r === 'rechnen') {
    period = r === 'karo10' || r === 'rechnen' ? 10 : 5;
    patternWidth = period;
    pattern =
      r === 'rechnen' ? (
        <rect
          x="1"
          y="1"
          width="8"
          height="8"
          rx="0.4"
          fill="none"
          stroke={blue}
          strokeWidth="0.2"
        />
      ) : (
        <path
          d={`M ${period} 0 H 0 V ${period}`}
          fill="none"
          stroke={blue}
          strokeWidth="0.25"
        />
      );
  } else if (r === 'punkte') {
    period = patternWidth = 5;
    pattern = <circle cx="2.5" cy="2.5" r="0.3" fill={blue} />;
  } else if (r === 'noten') {
    period = 22;
    pattern = [4, 6, 8, 10, 12].map((y) => (
      <line
        key={y}
        x1="0"
        x2={width}
        y1={y}
        y2={y}
        stroke="#8d969b"
        strokeWidth="0.22"
      />
    ));
  } else {
    const gap =
      r === 'linie1' ? 5 : r === 'linie2' ? 4 : r === 'linie3' ? 3 : 3;
    period = r === 'linie4' || r === 'bildzeilen' ? 10 : gap * 4;
    pattern =
      r === 'linie4' || r === 'bildzeilen' ? (
        <line
          x1="0"
          x2={width}
          y1="9"
          y2="9"
          stroke={blue}
          strokeWidth="0.25"
        />
      ) : (
        <>
          <rect x="0" y={gap} width={width} height={gap} fill="#eaf1f8" />
          {[0, gap, gap * 2, gap * 3].map((y, i) => (
            <line
              key={i}
              x1="0"
              x2={width}
              y1={y + 0.15}
              y2={y + 0.15}
              stroke={i === 2 ? red : blue}
              strokeWidth={i === 2 ? 0.35 : 0.22}
            />
          ))}
        </>
      );
  }
  return (
    <svg
      className="lineatur"
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      {r !== 'blanko' && (
        <>
          <defs>
            <pattern
              id={uid}
              width={patternWidth}
              height={period}
              patternUnits="userSpaceOnUse"
            >
              {pattern}
            </pattern>
          </defs>
          <rect
            x="15"
            y={r === 'bildzeilen' ? height * 0.53 : 15}
            width={width - 30}
            height={r === 'bildzeilen' ? height * 0.47 - 30 : height - 30}
            fill={`url(#${uid})`}
          />
          {r === 'bildzeilen' && (
            <rect
              x="15"
              y="15"
              width={width - 30}
              height={height * 0.48 - 15}
              rx="1"
              fill="none"
              stroke={blue}
              strokeWidth="0.25"
            />
          )}
        </>
      )}
    </svg>
  );
}
export function Stroke({ element: el }: { element: PageElement }) {
  const points = el.points || [];
  const id = `ink-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const pad = (el.penWidth || 0.7) * 2 + 2;
  return (
    <svg
      viewBox={`0 0 ${el.width} ${el.height}`}
      width="100%"
      height="100%"
      style={{ overflow: 'visible', display: 'block', pointerEvents: 'none' }}
      aria-label="Zeichnung"
    >
      {!!el.erasures?.length && <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-pad} y={-pad} width={el.width + pad * 2} height={el.height + pad * 2} style={{ maskType: 'luminance' }}>
          <rect x={-pad} y={-pad} width={el.width + pad * 2} height={el.height + pad * 2} fill="white" />
          {el.erasures.map((erasure, i) => {
            const bounds = pathBounds(erasure.points, erasure.size * 1.2);
            return <g key={erasure.id} transform={`scale(${el.width / erasure.width} ${el.height / erasure.height})`} opacity={erasure.opacity}>
            {erasure.soft && <filter id={`${id}-soft-${i}`} filterUnits="userSpaceOnUse" {...bounds} colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation={erasure.size * 0.12} />
            </filter>}
            <g filter={erasure.soft ? `url(#${id}-soft-${i})` : undefined}>
              {erasure.tip && erasure.tip !== 'round' ? <path d={eraserShapePath(erasure.points, erasure.size, erasure.tip)} fill="black" /> : erasure.points.length === 1 ? <circle cx={erasure.points[0].x} cy={erasure.points[0].y} r={erasure.size / 2} fill="black" /> :
                <polyline points={erasure.points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="black" strokeWidth={erasure.size} strokeLinecap="round" strokeLinejoin="round" />}
            </g>
          </g>;
          })}
        </mask>
      </defs>}
      <g mask={el.erasures?.length ? `url(#${id})` : undefined} opacity={!el.fillOnly && el.brushVersion === 2 && (el.penStyle === 'water' || el.penStyle === 'crayon') ? 1 : el.opacity ?? 1}>
      {el.fill && (
        <polygon
          points={strokeFillPolygon(el).map((p) => `${p.x},${p.y}`).join(' ')}
          fill={el.fill}
          fillRule={el.fillOnly ? 'evenodd' : 'nonzero'}
        />
      )}
      {!el.fillOnly && (el.brushVersion === 2 ? <InkBrush element={el} id={id} /> : <>
      {el.penStyle === 'fountain' &&
        points.length > 1 && <path d={fountainOutline(points, el.penWidth || 0.7)} fill={el.color} />}
      {el.penStyle === 'crayon' &&
        [-0.2, 0.2].map((offset) => (
          <path
            key={offset}
            d={smoothPath(points.map(p => ({ x: p.x + offset, y: p.y - offset })))}
            fill="none"
            stroke={el.color}
            strokeWidth={(el.penWidth || 0.7) * 0.4}
            opacity=".35"
          />
        ))}
      {points.length === 1 ? (
        <circle
          style={{ pointerEvents: 'painted' }}
          cx={points[0].x}
          cy={points[0].y}
          r={(el.penWidth || 0.6) / 2}
          fill={el.color}
        />
      ) : (
        <path
          style={{ pointerEvents: 'stroke' }}
          d={el.penStyle ? smoothPath(points) : `M${points.map(p => `${p.x} ${p.y}`).join(' L')}`}
          fill="none"
          stroke={el.color}
          strokeWidth={el.penWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={el.penStyle === 'fountain' ? 0 : 1}
        />
      )}
      </>)}
      </g>
    </svg>
  );
}
export function ElementContent({ element: el }: { element: PageElement }) {
  if (el.type === 'widget') return <Widget element={el} />;
  if (el.type === 'activity') return <Activity element={el} />;
  if (el.type === 'shape') return <Shape element={el} />;
  if (el.type === 'sticker')
    return (
      <div
        style={{
          fontSize: `${Math.min(el.width, el.height) * 0.8}mm`,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {el.symbol}
      </div>
    );
  if (el.type === 'embed') return <EmbedContent element={el} />;
  if (el.type === 'image') return <ImageContent element={el} />;
  if (el.type === 'audio')
    return (
      <div className="audio-content">
        <span>♫ {el.alt || 'Tonaufnahme'}</span>
        <audio
          onPointerDown={(e) => e.stopPropagation()}
          controls
          preload="metadata"
          src={el.src}
          style={{ width: '100%' }}
        />
      </div>
    );
  if (el.type === 'stroke') return <Stroke element={el} />;
  return (
    <div
      style={{
        fontFamily: `"${el.font}", sans-serif`,
        fontSize: `${((el.fontSize || 18) * 25.4) / 72}mm`,
        fontWeight: el.bold ? 700 : 400,
        fontStyle: el.italic ? 'italic' : undefined,
        textDecoration: el.underline ? 'underline' : undefined,
        textAlign: el.align || 'left',
        background: el.background,
        border:
          el.textFrame && el.textFrame !== 'none'
            ? `.3mm solid ${el.color}`
            : undefined,
        borderRadius:
          el.textFrame === 'speech' || el.textFrame === 'thought'
            ? '5mm'
            : undefined,
        padding: el.textFrame && el.textFrame !== 'none' ? '2mm' : undefined,
        color: el.color,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        lineHeight: el.lineHeight || 1.6,
      }}
    >
      {el.runs?.length
        ? el.runs.map((run, i) => (
            <span
              key={i}
              style={{
                fontWeight: run.bold ? 700 : 400,
                fontStyle: run.italic ? 'italic' : undefined,
                textDecoration: run.underline ? 'underline' : undefined,
                color: run.color,
              }}
            >
              {run.text}
            </span>
          ))
        : el.text}
    </div>
  );
}
export function ElementView({
  element,
  children,
  ...props
}: {
  element: PageElement;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      data-element-id={element.id}
      className={`page-element ${props.className || ''}`}
      style={{
        left: `${element.x}mm`,
        top: `${element.y}mm`,
        width: `${element.width}mm`,
        height: `${element.height}mm`,
        transform: `rotate(${element.rotation}deg)`,
        opacity: element.type === 'stroke' ? 1 : element.opacity,
        ...props.style,
      }}
    >
      {children || <ElementContent element={element} />}
    </div>
  );
}
export default function PageView({
  page,
  children,
}: {
  page: Page;
  children?: React.ReactNode;
}) {
  const { width, height } = dimensions(page);
  return (
    <div
      className="paper"
      style={{ width: `${width}mm`, height: `${height}mm` }}
    >
      <PageDecoration page={page} />
      <RulingView page={page} />
      {children || (
        <>
          {inkPaintOrder(page.elements).map((el) => <ElementView key={el.id} element={el} />)}
          <LinkLayer elements={page.elements} />
        </>
      )}
    </div>
  );
}
