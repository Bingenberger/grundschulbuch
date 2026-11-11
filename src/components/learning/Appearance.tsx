/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useId, useState } from 'react';
import QRCode from 'qrcode';
import type { PageElement, Page } from '@/lib/notebook-model';
import { dimensions } from '@/lib/notebook-model';
import { useLearning } from './Runtime';
export function Shape({ element: el }: { element: PageElement }) {
  const props = {
    fill: el.fill || '#ffffff',
    stroke: el.color,
    strokeWidth: ((el.strokeWidth || 0.4) * 100) / Math.max(10, el.width),
    strokeLinejoin: 'round' as const,
  };
  let shape: React.ReactNode;
  switch (el.shape) {
    case 'ellipse':
      shape = <ellipse cx="50" cy="50" rx="47" ry="47" {...props} />;
      break;
    case 'triangle':
      shape = <polygon points="50,3 97,97 3,97" {...props} />;
      break;
    case 'line':
      shape = <line x1="2" y1="50" x2="98" y2="50" {...props} />;
      break;
    case 'arrow':
      shape = <path d="M3 39H65V15L97 50L65 85V61H3Z" {...props} />;
      break;
    case 'star':
      shape = (
        <polygon
          points="50,2 62,35 97,35 69,57 80,94 50,72 20,94 31,57 3,35 38,35"
          {...props}
        />
      );
      break;
    case 'heart':
      shape = (
        <path
          d="M50 93C5 63-10 29 15 11C32-1 48 14 50 23C55 4 79 0 91 17C111 43 76 76 50 93Z"
          {...props}
        />
      );
      break;
    case 'speech':
      shape = (
        <path
          d="M7 5H93Q98 5 98 12V70Q98 78 90 78H42L21 98V78H7Q2 78 2 70V12Q2 5 7 5Z"
          {...props}
        />
      );
      break;
    case 'thought':
      shape = (
        <>
          <path
            d="M20 8Q35-3 49 9Q70-5 84 13Q107 24 92 40Q105 64 82 72Q66 88 49 76Q20 90 14 70Q-7 58 7 42Q-2 17 20 8Z"
            {...props}
          />
          <circle cx="25" cy="87" r="6" {...props} />
          <circle cx="15" cy="97" r="2" {...props} />
        </>
      );
      break;
    case 'shout':
      shape = (
        <polygon
          points="50,2 60,22 83,6 78,30 99,35 80,51 98,74 75,73 80,98 55,79 38,98 34,77 7,90 17,62 1,50 22,40 7,15 34,23"
          {...props}
        />
      );
      break;
    case 'banner':
      shape = <path d="M2 10H98L83 50L98 90H2L17 50Z" {...props} />;
      break;
    default:
      shape = (
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx={el.shape === 'rounded' ? 12 : 0}
          {...props}
        />
      );
  }
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      aria-label="Form"
    >
      {shape}
    </svg>
  );
}
export const imageFilters: Record<string, string> = {
  scan: 'grayscale(1) contrast(2) brightness(1.2)',
  gray: 'grayscale(1)',
  sepia: 'sepia(1)',
  bright: 'brightness(1.3)',
  contrast: 'contrast(1.5)',
  vivid: 'saturate(1.8)',
  pale: 'saturate(.5) brightness(1.1)',
  warm: 'sepia(.3) saturate(1.3)',
  cold: 'hue-rotate(18deg) saturate(.8)',
  invert: 'invert(1)',
};
export function ImageContent({ element: el }: { element: PageElement }) {
  const crop = el.crop || { x: 0, y: 0, width: 1, height: 1 },
    frame = el.imageFrame || 'none';
  return (
    <div
      className={`image-content image-frame-${frame}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: frame === 'round' ? '50%' : frame === 'photo' ? '2mm' : 0,
        border:
          frame === 'border'
            ? '1mm solid #293c32'
            : frame === 'photo'
              ? '2mm solid white'
              : undefined,
        boxShadow: ['shadow', 'polaroid'].includes(frame)
          ? '1mm 2mm 3mm #0004'
          : undefined,
        padding: frame === 'polaroid' ? '2mm 2mm 8mm' : undefined,
        background: frame === 'polaroid' ? '#fff' : undefined,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          transform: el.flip ? 'scaleX(-1)' : undefined,
        }}
      >
        <img
          src={el.src}
          alt={el.alt || ''}
          draggable={false}
          style={{
            position: 'absolute',
            width: `${100 / crop.width}%`,
            height: `${100 / crop.height}%`,
            left: `${(-crop.x / crop.width) * 100}%`,
            top: `${(-crop.y / crop.height) * 100}%`,
            objectFit: el.crop ? 'fill' : el.fit || 'contain',
            filter: imageFilters[el.imageFilter || ''] || 'none',
          }}
        />
      </div>
    </div>
  );
}
export function PageDecoration({ page }: { page: Page }) {
  const { width, height } = dimensions(page),
    frame = page.pageFrame || 'none',
    color = page.frameColor || '#52796f',
    id = useId().replace(/:/g, '');
  return (
    <>
      <div
        className="paper-color"
        style={{
          position: 'absolute',
          inset: 0,
          background: page.paperColor || '#fff',
        }}
      />
      {page.backgroundImage && (
        <img
          src={page.backgroundImage}
          alt=""
          className="page-background"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      )}
      {frame !== 'none' && (
        <svg
          className="page-decoration"
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <rect
            x="7"
            y="7"
            width={width - 14}
            height={height - 14}
            rx={frame === 'rounded' ? 5 : 0}
            fill="none"
            stroke={color}
            strokeWidth={frame === 'band' ? 3 : 0.5}
            strokeDasharray={
              frame === 'dashed'
                ? '3 2'
                : frame === 'dots'
                  ? '0.5 2'
                  : undefined
            }
          />
          {['double', 'classic', 'certificate'].includes(frame) && (
            <rect
              x="9"
              y="9"
              width={width - 18}
              height={height - 18}
              fill="none"
              stroke={color}
              strokeWidth=".25"
            />
          )}
          {frame === 'worksheet' && (
            <text x="15" y="12" fontSize="3" fill={color}>
              Name: ________________________ Datum: ______________
            </text>
          )}
          {[
            'stars',
            'hearts',
            'flowers',
            'leaves',
            'confetti',
            'bunting',
            'wave',
            'zigzag',
            'scallop',
            'crayon',
            'corners',
          ].includes(frame) && (
            <>
              <defs>
                <pattern
                  id={id}
                  width="12"
                  height="12"
                  patternUnits="userSpaceOnUse"
                >
                  <text x="1" y="7" fontSize="5" fill={color}>
                    {
                      (
                        {
                          stars: '☆',
                          hearts: '♡',
                          flowers: '✿',
                          leaves: '❧',
                          confetti: '· ˙',
                          bunting: '▽',
                          wave: '∿',
                          zigzag: '⌁',
                          scallop: '⌒',
                          crayon: '╱',
                          corners: '⌜',
                        } as Record<string, string>
                      )[frame]
                    }
                  </text>
                </pattern>
              </defs>
              <path
                d={`M2 2H${width - 2}V${height - 2}H2ZM12 12V${height - 12}H${width - 12}V12Z`}
                fill={`url(#${id})`}
                fillRule="evenodd"
              />
            </>
          )}
        </svg>
      )}
    </>
  );
}
export function EmbedContent({ element: el }: { element: PageElement }) {
  const runtime = useLearning(el);
  const [loaded, setLoaded] = useState(false),
    [qr, setQr] = useState('');
  const [app, setApp] = useState(''),
    [appError, setAppError] = useState('');
  useEffect(() => {
    if (el.embedKind !== 'app' || !loaded || !runtime.allowExternal || !el.src)
      return;
    let active = true;
    fetch(el.src)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((text) => {
        if (active) setApp(text);
      })
      .catch(() => {
        if (active) setAppError('Die HTML-App konnte nicht geladen werden.');
      });
    return () => {
      active = false;
    };
  }, [el.embedKind, el.src, loaded, runtime.allowExternal]);
  const url = el.url || '';
  let videoUrl = url;
  try {
    const parsed = new URL(url);
    if (
      ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(
        parsed.hostname,
      )
    ) {
      const id =
        parsed.hostname === 'youtu.be'
          ? parsed.pathname.slice(1)
          : parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
      if (id && /^[\w-]{6,20}$/.test(id))
        videoUrl = `https://www.youtube-nocookie.com/embed/${id}`;
    } else if (['vimeo.com', 'www.vimeo.com'].includes(parsed.hostname)) {
      const id = parsed.pathname.split('/').pop();
      if (/^\d+$/.test(id || ''))
        videoUrl = `https://player.vimeo.com/video/${id}`;
    }
  } catch {}
  useEffect(() => {
    let active = true;

    if (el.embedKind === 'qr')
      QRCode.toDataURL(url, { width: 512, margin: 2 }).then((value) => {
        if (active) setQr(value);
      });
    return () => {
      active = false;
    };
  }, [url, el.embedKind]);
  if (el.embedKind === 'app')
    return (
      <div className="embed-content" onPointerDown={(e) => e.stopPropagation()}>
        {loaded && runtime.allowExternal ? (
          app ? (
            <iframe
              title={el.alt || 'Eigene HTML-App'}
              sandbox="allow-scripts allow-downloads"
              referrerPolicy="no-referrer"
              srcDoc={`<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' data: blob:; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; font-src data:; connect-src 'none'; frame-src 'none'; worker-src 'none'; form-action 'none'; base-uri 'none'">${app}`}
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          ) : (
            <div className="embed-placeholder">
              {appError || 'HTML-App wird geladen …'}
            </div>
          )
        ) : (
          <div className="embed-placeholder">
            <strong>{el.alt || 'Eigene HTML-App'}</strong>
            <button
              disabled={!runtime.interactive || !runtime.allowExternal}
              onClick={() => setLoaded(true)}
            >
              HTML-App starten
            </button>
          </div>
        )}
      </div>
    );
  if (el.embedKind === 'qr')
    return (
      <div className="qr-element">
        {qr && (
          <img
            src={qr}
            alt={`QR-Code: ${el.alt || url}`}
            style={{ width: '100%', height: '85%', objectFit: 'contain' }}
          />
        )}
        <small>{el.alt || url}</small>
      </div>
    );
  if (el.embedKind === 'link' && !runtime.allowExternal)
    return <span>{el.alt || url}</span>;
  if (el.embedKind === 'link')
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {el.alt || url} ↗
      </a>
    );
  return (
    <div className="embed-content" onPointerDown={(e) => e.stopPropagation()}>
      {loaded && runtime.allowExternal ? (
        el.embedKind === 'video' && /\.(mp4|webm|m4v)(\?|$)/i.test(url) ? (
          <video controls src={url} style={{ width: '100%', height: '100%' }} />
        ) : (
          <iframe
            src={videoUrl}
            title={el.alt || 'Eingebetteter Inhalt'}
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            allow="fullscreen"
            referrerPolicy="no-referrer"
            style={{ width: '100%', height: '100%', border: 0 }}
          />
        )
      ) : (
        <div className="embed-placeholder">
          <strong>
            {el.alt || (el.embedKind === 'video' ? 'Video' : 'Webseite')}
          </strong>
          <small>{url}</small>
          <button
            disabled={!runtime.interactive || !runtime.allowExternal}
            onClick={() => setLoaded(true)}
          >
            Externen Inhalt laden
          </button>
        </div>
      )}
    </div>
  );
}
