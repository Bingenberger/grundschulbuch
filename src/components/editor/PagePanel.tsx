'use client';
import { useEffect, useState } from 'react';
import Icon from '../Icon';
import ScaledPage from '../ScaledPage';
import type { Page } from '@/lib/notebook-model';

const storageKey = 'grundschulbuch-seiten-offen';

/** Page overview on the left that can be folded away to make room. */
export default function PagePanel({
  pages,
  pageIds,
  activeId,
  busy,
  onChoose,
  onAdd,
  extra,
}: {
  pages: Page[];
  pageIds: string[];
  activeId: string;
  busy?: boolean;
  onChoose: (id: string) => void;
  onAdd?: () => void;
  extra?: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    // Read the remembered state after hydration (server always renders “open”).
    const frame = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved !== null) setOpen(saved === '1');
        else if (window.innerWidth < 900) setOpen(false);
      } catch {}
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  function toggle() {
    setOpen(!open);
    try {
      localStorage.setItem(storageKey, open ? '0' : '1');
    } catch {}
  }
  const index = pageIds.indexOf(activeId);
  return (
    <aside className={`page-panel ${open ? 'open' : 'closed'}`} aria-label="Seitenübersicht">
      <button
        type="button"
        className="page-panel-toggle"
        aria-expanded={open}
        onClick={toggle}
      >
        <Icon name="seiten" size={26} />
        <span>{open ? 'Seiten einklappen' : 'Seiten'}</span>
        <small>
          {index + 1} / {pageIds.length}
        </small>
      </button>
      {open && (
        <>
          <div className="page-thumbnails">
            {pageIds.map((id, i) => {
              const p = pages.find((page) => page.id === id);
              if (!p) return null;
              return (
                <button
                  key={id}
                  type="button"
                  className={`page-thumbnail ${activeId === id ? 'active' : ''}`}
                  aria-label={`Seite ${i + 1} öffnen`}
                  aria-current={activeId === id ? 'page' : undefined}
                  disabled={busy}
                  onClick={() => onChoose(id)}
                >
                  <ScaledPage page={p} decorative />
                  <span>{i + 1}</span>
                </button>
              );
            })}
          </div>
          {onAdd && (
            <button type="button" className="page-add" disabled={busy} onClick={onAdd}>
              <Icon name="plus" size={24} />
              <span>Neue Seite</span>
            </button>
          )}
          {extra}
        </>
      )}
      {!open && (
        <div className="page-panel-steps">
          <button
            type="button"
            aria-label="Vorherige Seite"
            disabled={busy || index <= 0}
            onClick={() => onChoose(pageIds[index - 1])}
          >
            <Icon name="up" size={22} />
          </button>
          <button
            type="button"
            aria-label="Nächste Seite"
            disabled={busy || index >= pageIds.length - 1}
            onClick={() => onChoose(pageIds[index + 1])}
          >
            <Icon name="down" size={22} />
          </button>
          {onAdd && (
            <button type="button" aria-label="Neue Seite" disabled={busy} onClick={onAdd}>
              <Icon name="plus" size={22} />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
