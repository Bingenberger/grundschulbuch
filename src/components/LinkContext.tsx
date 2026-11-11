'use client';
import { createContext, useContext } from 'react';
import type { ElementLink, PageElement } from '@/lib/notebook-model';

/**
 * Lets a link badge open another page of the notebook. Each surface that shows
 * pages (editors, board, exported viewer) provides its own way of turning pages.
 */
export const LinkContext = createContext<{
  openPage?: (pageId: string) => void;
  pageNumber?: (pageId: string) => number | undefined;
}>({});

export function linkLabel(link: ElementLink, pageNumber?: (id: string) => number | undefined) {
  if (link.kind === 'page') {
    const n = pageNumber?.(link.pageId);
    return n ? `Seite ${n}` : 'Seite fehlt';
  }
  try {
    return new URL(link.url).hostname.replace(/^www\./, '');
  } catch {
    return 'Internetseite';
  }
}

const linkIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

/** Small badge on linked elements; it follows the link without selecting. */
export function LinkBadge({ element }: { element: PageElement }) {
  const { openPage, pageNumber } = useContext(LinkContext);
  const link = element.link;
  if (!link) return null;
  const label = linkLabel(link, pageNumber);
  const stop = (e: React.PointerEvent | React.MouseEvent) => e.stopPropagation();
  if (link.kind === 'url')
    return (
      <a
        className="link-badge"
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Link öffnen: ${label}`}
        onPointerDown={stop}
        onClick={stop}
      >
        {linkIcon}
        <span>{label}</span>
        <b aria-hidden="true">↗</b>
      </a>
    );
  const missing = !pageNumber?.(link.pageId);
  return (
    <button
      type="button"
      className="link-badge"
      aria-label={`Link öffnen: ${label}`}
      disabled={missing || !openPage}
      onPointerDown={stop}
      onClick={(e) => {
        stop(e);
        openPage?.(link.pageId);
      }}
    >
      {linkIcon}
      <span>{label}</span>
      <b aria-hidden="true">→</b>
    </button>
  );
}

/**
 * Link badges in their own layer above all elements and selection handles, so
 * overlapping elements never cover them.
 */
export function LinkLayer({ elements }: { elements: PageElement[] }) {
  return (
    <>
      {elements
        .filter((el) => el.link)
        .map((el) => (
          <div
            key={`link-${el.id}`}
            className="link-layer"
            style={{
              left: `${el.x}mm`,
              top: `${el.y}mm`,
              width: `${el.width}mm`,
              height: `${el.height}mm`,
              transform: `rotate(${el.rotation}deg)`,
            }}
          >
            <LinkBadge element={el} />
          </div>
        ))}
    </>
  );
}
