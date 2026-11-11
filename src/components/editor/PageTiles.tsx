'use client';
import { useEffect, useRef, useState } from 'react';
import type { Page } from '@/lib/notebook-model';
import ScaledPage from '../ScaledPage';
import Icon from '../Icon';
import { ChoiceButton } from '../ui/Choice';
import { moveTo } from '@/lib/page-order';

/**
 * All pages as tiles in an overlay: tap to select (several at once), drag to
 * move, buttons to move, duplicate, delete or open.
 */
export default function PageTiles({
  pages,
  pageIds,
  activeId,
  busy,
  onOpen,
  onArrange,
  onDuplicate,
  onDelete,
  onClose,
}: {
  pages: Page[];
  pageIds: string[];
  activeId: string;
  busy?: boolean;
  onOpen: (id: string) => void;
  onArrange: (ids: string[]) => void;
  onDuplicate: (ids: string[]) => void;
  onDelete: (ids: string[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([activeId]);
  const [drag, setDrag] = useState<{ ids: string[]; target: number; x: number; y: number } | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const press = useRef<{ id: string; x: number; y: number; pointer: number } | null>(null);
  const chosen = selected.filter((id) => pageIds.includes(id));
  const indexes = chosen.map((id) => pageIds.indexOf(id)).sort((a, b) => a - b);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [onClose]);

  /** Index the dragged pages would go before, from the pointer position. */
  function dropIndex(x: number, y: number) {
    const tiles = Array.from(grid.current?.querySelectorAll<HTMLElement>('[data-tile]') || []);
    let best = pageIds.length, distance = Infinity;
    tiles.forEach((tile, i) => {
      const r = tile.getBoundingClientRect();
      const cy = r.top + r.height / 2;
      for (const [edge, index] of [[r.left, i], [r.right, i + 1]] as const) {
        const d = Math.hypot(x - edge, (y - cy) * 1.5);
        if (d < distance) {
          distance = d;
          best = index;
        }
      }
    });
    return best;
  }

  const toggle = (id: string, add: boolean) =>
    setSelected((s) => (add ? (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]) : [id]));

  const move = (delta: number) => {
    if (!indexes.length) return;
    const target = delta < 0 ? Math.max(0, indexes[0] - 1) : Math.min(pageIds.length, indexes[indexes.length - 1] + 2);
    onArrange(moveTo(pageIds, chosen, target));
  };

  return (
    <div className="modal-backdrop">
      <section className="modal page-tiles" role="dialog" aria-modal="true" aria-labelledby="page-tiles-title">
        <div className="dialog-heading">
          <div>
            <h2 id="page-tiles-title">Alle Seiten</h2>
            <p className="template-hint">
              Antippen wählt eine Seite, „Mehrere“ oder Strg/Umschalt wählt mehrere. Ziehen verschiebt.
            </p>
          </div>
          <button type="button" className="knopf" onClick={onClose}>
            Schließen
          </button>
        </div>
        <div className="page-tiles-tools" role="toolbar" aria-label="Seiten bearbeiten">
          <span className="page-tiles-count" role="status">
            {chosen.length === 1 ? `Seite ${indexes[0] + 1} gewählt` : `${chosen.length} Seiten gewählt`}
          </span>
          <ChoiceButton
            icon="checkmark"
            label={chosen.length === pageIds.length ? 'Keine' : 'Alle wählen'}
            onClick={() => setSelected(chosen.length === pageIds.length ? [] : [...pageIds])}
          />
          <ChoiceButton icon="document" label="Öffnen" disabled={chosen.length !== 1} onClick={() => onOpen(chosen[0])} />
          <ChoiceButton icon="left" label="Nach vorn" disabled={busy || !indexes.length || indexes[0] === 0} onClick={() => move(-1)} />
          <ChoiceButton
            icon="right"
            label="Nach hinten"
            disabled={busy || !indexes.length || indexes[indexes.length - 1] === pageIds.length - 1}
            onClick={() => move(1)}
          />
          <ChoiceButton icon="file" label="Duplizieren" disabled={busy || !chosen.length} onClick={() => onDuplicate(chosen)} />
          <ChoiceButton
            icon="empty_trash"
            label="Löschen"
            danger
            disabled={busy || !chosen.length || chosen.length >= pageIds.length}
            onClick={() => {
              onDelete(chosen);
              setSelected([]);
            }}
          />
        </div>
        <div
          className={`page-tiles-grid ${drag ? 'dragging' : ''}`}
          ref={grid}
          onPointerMove={(e) => {
            const p = press.current;
            if (!p || p.pointer !== e.pointerId) return;
            if (!drag && Math.hypot(e.clientX - p.x, e.clientY - p.y) < 8) return;
            const ids = chosen.includes(p.id) ? chosen : [p.id];
            if (!drag) {
              setSelected(ids);
              grid.current?.setPointerCapture(e.pointerId);
            }
            setDrag({ ids, target: dropIndex(e.clientX, e.clientY), x: e.clientX, y: e.clientY });
          }}
          onPointerUp={(e) => {
            const p = press.current;
            press.current = null;
            if (!p || p.pointer !== e.pointerId) return;
            if (drag) {
              const next = moveTo(pageIds, drag.ids, drag.target);
              setDrag(null);
              if (next.join() !== pageIds.join()) onArrange(next);
            } else toggle(p.id, e.ctrlKey || e.metaKey || e.shiftKey);
          }}
          onPointerCancel={() => {
            press.current = null;
            setDrag(null);
          }}
        >
          {pageIds.map((id, i) => {
            const page = pages.find((p) => p.id === id);
            if (!page) return null;
            const isSelected = chosen.includes(id);
            return (
              <div key={id} className="page-tile-slot">
                {drag?.target === i && <span className="page-tile-drop" aria-hidden="true" />}
                <div
                  data-tile
                  className={`page-tile ${isSelected ? 'selected' : ''} ${id === activeId ? 'active' : ''} ${drag?.ids.includes(id) ? 'lifted' : ''}`}
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={`Seite ${i + 1}${id === activeId ? ' (geöffnet)' : ''}`}
                  tabIndex={0}
                  onPointerDown={(e) => {
                    if (busy || e.button !== 0) return;
                    press.current = { id, x: e.clientX, y: e.clientY, pointer: e.pointerId };
                  }}
                  onDoubleClick={() => onOpen(id)}
                  onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.preventDefault();
                      toggle(id, true);
                    } else if (e.key === 'Enter') onOpen(id);
                  }}
                >
                  <span className={`page-tile-page ${page.orientation}`}>
                    <ScaledPage page={page} decorative />
                  </span>
                  <span className="page-tile-number">{i + 1}</span>
                  <span className="page-tile-check" aria-hidden="true">
                    {isSelected && <Icon name="ok" size={22} />}
                  </span>
                </div>
                <button
                  type="button"
                  className="page-tile-multi"
                  aria-label={`Seite ${i + 1} ${isSelected ? 'abwählen' : 'dazuwählen'}`}
                  onClick={() => toggle(id, true)}
                >
                  {isSelected ? 'Abwählen' : 'Mehrere'}
                </button>
              </div>
            );
          })}
          {drag?.target === pageIds.length && <span className="page-tile-drop end" aria-hidden="true" />}
        </div>
        {drag && (
          <div className="page-tile-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
            {drag.ids.length === 1 ? `Seite ${pageIds.indexOf(drag.ids[0]) + 1}` : `${drag.ids.length} Seiten`}
          </div>
        )}
      </section>
    </div>
  );
}
