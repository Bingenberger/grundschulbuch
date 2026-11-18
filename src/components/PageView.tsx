import { useId } from 'react';
import { fountainOutline, pathBounds, smoothPath, strokeFillPolygon } from '@/lib/drawing';
import { inkPaintOrder } from '@/lib/brushes';
import InkBrush from './InkBrush';
import { LinkLayer } from './LinkContext';
import { SYLLABLE_COLORS, syllableSegments } from '@/lib/syllables';
import TextFrame, { framePadding } from './TextFrame';
import { MicGlyph } from './learning/Cassette';
import AudioButton, { TemplateAudioPlaceholder } from './learning/AudioButton';
import {fontFamilyFor} from '@/lib/template-font';
import pageDesigns from '@/lib/reference/page-templates.json';
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
/** How the original papers repeat on endless paper, in units of the 1400 × 990 original:
 *  x/y = start of one tile inside the line area, w/h = tile size. */
const ENDLESS_TILES: Record<string, { x: number; w: number }> = {
  squares: { x: 595, w: 30 },
  'squares-big': { x: 575, w: 50 },
  dots: { x: 556, w: 36 },
};
export function RulingView({ page }: { page: Page }) {
  const uid = useId().replace(/:/g, '');
  const original=page.paperReferenceId?pageDesigns.find(d=>d.id===page.paperReferenceId):undefined;
  if(original&&page.paperMode==='endless'){
    // The surface is open in all directions: one tile of the original paper repeats everywhere.
    const size=dimensions(page),k=297/1400;
    if(!original.svg)return null;
    const top=original.grid?.top||(original.id==='music'?110:0);
    const period=original.grid?.pitch||({'squares':30,'squares-big':50,'dots':36,'music':128}[original.id]||990);
    const tile=ENDLESS_TILES[original.id]||{x:800,w:100};
    return <svg className="lineatur" width="100%" height="100%" viewBox={`${size.left} ${size.top} ${size.width} ${size.height}`} aria-hidden="true"><defs><pattern id={uid} x={tile.x*k} y={top*k} width={tile.w*k} height={period*k} patternUnits="userSpaceOnUse"><g transform={`scale(${k}) translate(${-tile.x},${-top})`} dangerouslySetInnerHTML={{__html:page.lineColor?original.svg.replaceAll(original.line,page.lineColor):original.svg}}/></pattern></defs><rect x={size.left} y={size.top} width={size.width} height={size.height} fill={`url(#${uid})`}/></svg>;
  }
  if(original)return <svg className="lineatur" width="100%" height="100%" viewBox="0 0 1400 990" preserveAspectRatio="xMidYMid meet" aria-hidden="true" dangerouslySetInnerHTML={{__html:page.lineColor?original.svg.replaceAll(original.line,page.lineColor):original.svg}}/>;
  const { width, height, left, top } = dimensions(page);
  const endless = page.paperMode === 'endless';
  const r = page.ruling;
  const blue = page.lineColor || '#a0bcd3';
  const red = '#d99b9b';
  let pattern: React.ReactNode;
  let period = 10;
  // Endless paper: lines repeat sideways too, so a short tile is enough.
  let patternWidth = endless ? 10 : width;
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
        x2={patternWidth}
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
          x2={patternWidth}
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
              x2={patternWidth}
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
      viewBox={`${left} ${top} ${width} ${height}`}
      aria-hidden="true"
    >
      {r !== 'blanko' && endless && (
        <>
          <defs>
            <pattern id={uid} width={patternWidth} height={period} patternUnits="userSpaceOnUse">
              {pattern}
            </pattern>
          </defs>
          <rect x={left} y={top} width={width} height={height} fill={`url(#${uid})`} />
        </>
      )}
      {r !== 'blanko' && !endless && (
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
/** Look of a text element; shared by the page and the inline text editor. */
export function textStyle(el: PageElement): React.CSSProperties {
  return {
    fontFamily: `"${fontFamilyFor(el)}", sans-serif`,
    fontSize: `${((el.fontSize || 18) * 25.4) / 72}mm`,
    fontWeight: el.bold ? 700 : 400,
    fontStyle: el.italic ? 'italic' : undefined,
    textDecoration: el.underline ? 'underline' : undefined,
    textAlign: el.align || 'left',
    padding: el.referencePadding ? el.referencePadding.replace(/([\d.]+)px/g,(_,n)=>`${Number(n)*(el.designScale||297/1400)}mm`) : framePadding(el),
    position: 'relative',
    color: el.color,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    lineHeight: el.textLinePitch ? `${el.textLinePitch}mm` : el.lineHeight || 1.6,
    ...(el.referenceCentered?{top:'50%',transform:'translateY(-50%)'}:{}),
  };
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
  if (el.type === 'audio' && !el.src && !el.speechText && el.designScale)
    return <TemplateAudioPlaceholder element={el}/>;
  if (el.type === 'audio' && !el.src && !el.speechText)
    return (
      <div className="audio-placeholder">
        <MicGlyph />
        <span>{el.placeholder || 'Tippe hier und nimm dich auf.'}</span>
      </div>
    );
  if (el.type === 'audio') return <AudioButton element={el} />;
  if (el.type === 'stroke') return <Stroke element={el} />;
  return (
    <>
    <TextFrame element={el} />
    <div
      style={textStyle(el)}
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
              {el.syllables ? <Syllables text={run.text} /> : run.text}
            </span>
          ))
        : el.text
          ? el.syllables ? <Syllables text={el.text} /> : el.text
          : (el.textHint ? <span style={{color:'#94a3b8'}}>{el.textHint}</span> : '')}
    </div>
    </>
  );
}
/** Silbenmethode: Silben abwechselnd blau und rot. */
function Syllables({ text }: { text: string }) {
  return (
    <>
      {syllableSegments(text).map((part, i) =>
        part.tone === null ? part.text : <span key={i} className="syllable" style={{ color: SYLLABLE_COLORS[part.tone] }}>{part.text}</span>,
      )}
    </>
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
  const { width, height, left, top } = dimensions(page);
  return (
    <div
      className="paper"
      style={{ width: `${width}mm`, height: `${height}mm` }}
      data-left={left || undefined}
      data-top={top || undefined}
    >
      <PageDecoration page={page} />
      <RulingView page={page} />
      {children || (
        <World page={page}>
          {inkPaintOrder(page.elements).map((el) => <ElementView key={el.id} element={el} />)}
          <LinkLayer elements={page.elements} />
        </World>
      )}
    </div>
  );
}
/**
 * Places page coordinates inside the visible area. On endless paper the area
 * starts left of and above the origin, so the content moves by that much;
 * A4 pages start at the origin and need no wrapper.
 */
export function World({ page, children }: { page: Page; children?: React.ReactNode }) {
  const { left, top } = dimensions(page);
  if (!left && !top) return <>{children}</>;
  return <div className="page-world" style={{ position: 'absolute', left: `${-left}mm`, top: `${-top}mm`, width: 0, height: 0 }}>{children}</div>;
}
/** Page coordinates (mm) of the visible area of a rendered `.paper`. */
export function paperFrame(paper: HTMLElement) {
  return {
    left: Number(paper.dataset.left || 0),
    top: Number(paper.dataset.top || 0),
    width: parseFloat(paper.style.width),
    height: parseFloat(paper.style.height),
  };
}
