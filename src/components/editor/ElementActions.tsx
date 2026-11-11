'use client';
import { useEffect, useRef, useState } from 'react';
import type { ElementLink, Page } from '@/lib/notebook-model';
import type { Feature } from '@/lib/features';
import Icon, { type IconName } from '../Icon';
import ScaledPage from '../ScaledPage';
import { Choices } from '../ui/Choice';
import { linkLabel } from '../LinkContext';

function HeaderAction({
  icon,
  label,
  onClick,
  disabled,
  danger,
  pressed,
  title,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  pressed?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      className={`header-button ${danger ? 'header-danger' : ''}`}
      disabled={disabled}
      aria-pressed={pressed}
      aria-expanded={pressed}
      title={title}
      onClick={onClick}
    >
      <Icon name={icon} size={24} />
      <span>{label}</span>
    </button>
  );
}

/** Pop-up next to “Link” for choosing a web page or a page of the notebook. */
function LinkPopover({
  link,
  pages,
  pageIds,
  onChange,
  onClose,
}: {
  link?: ElementLink;
  pages: Page[];
  pageIds: string[];
  onChange: (link: ElementLink | undefined) => void;
  onClose: () => void;
}) {
  const [kind, setKind] = useState<ElementLink['kind']>(link?.kind || 'url');
  const [url, setUrl] = useState(link?.kind === 'url' ? link.url : '');
  const [error, setError] = useState('');
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const outside = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (box.current && target && !box.current.contains(target) && !target.closest('[data-link-button]')) onClose();
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('keydown', escape, true);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      window.removeEventListener('keydown', escape, true);
    };
  }, [onClose]);
  function saveUrl() {
    let value = url.trim();
    if (value && !/^https?:\/\//i.test(value)) value = `https://${value}`;
    try {
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname.includes('.')) throw new Error();
      onChange({ kind: 'url', url: parsed.href });
      onClose();
    } catch {
      setError('Bitte eine Internetadresse wie www.beispiel.de eingeben.');
    }
  }
  return (
    <div className="link-popover" role="dialog" aria-label="Link setzen" ref={box}>
      <div className="link-popover-head">
        <strong>Link setzen</strong>
        <button type="button" className="link-popover-close" aria-label="Link-Fenster schließen" onClick={onClose}>
          <Icon name="cancel" size={20} />
        </button>
      </div>
      <Choices
        label="Ziel"
        value={kind}
        onChange={setKind}
        options={[
          { value: 'url', label: 'Internetseite', icon: 'globe' },
          { value: 'page', label: 'Seite im Heft', icon: 'seiten' },
        ]}
      />
      {kind === 'url' ? (
        <form
          className="link-url"
          onSubmit={(e) => {
            e.preventDefault();
            saveUrl();
          }}
        >
          <input
            className="option-input"
            type="text"
            inputMode="url"
            aria-label="Internetadresse"
            placeholder="www.beispiel.de"
            value={url}
            autoFocus
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
          />
          <button type="submit" className="knopf knopf-haupt compact" disabled={!url.trim()}>
            Übernehmen
          </button>
          {error && <p className="fehler" role="alert">{error}</p>}
        </form>
      ) : (
        <div className="link-pages" role="group" aria-label="Seite auswählen">
          {pageIds.map((id, i) => {
            const page = pages.find((p) => p.id === id);
            if (!page) return null;
            const chosen = link?.kind === 'page' && link.pageId === id;
            return (
              <button
                key={id}
                type="button"
                className="link-page"
                aria-pressed={chosen}
                onClick={() => {
                  onChange({ kind: 'page', pageId: id });
                  onClose();
                }}
              >
                <ScaledPage page={page} decorative />
                <span>Seite {i + 1}</span>
              </button>
            );
          })}
        </div>
      )}
      {link && (
        <div className="link-current">
          <span>Aktuell: {linkLabel(link, (id) => (pageIds.indexOf(id) + 1) || undefined)}</span>
          <button
            type="button"
            className="knopf compact danger-text"
            onClick={() => {
              onChange(undefined);
              onClose();
            }}
          >
            <Icon name="cancel" size={18} /> Link entfernen
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Actions for the selected element(s), shown in the top bar. Children see
 * fewer of them, depending on their functions.
 */
export default function ElementActions({
  features,
  count,
  locked,
  canPaste,
  link,
  pages,
  pageIds,
  onCut,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
  onLink,
}: {
  features: Set<Feature>;
  /** Number of selected elements (0: only “Einfügen” is offered). */
  count: number;
  locked: boolean;
  canPaste: boolean;
  link?: ElementLink;
  pages: Page[];
  pageIds: string[];
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onLink: (link: ElementLink | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const clipboard = features.has('elementClipboard');
  if (!count && !(clipboard && canPaste)) return null;
  return (
    <div className="header-group element-actions" role="group" aria-label="Aktionen für die Auswahl">
      {count > 0 && clipboard && (
        <>
          <HeaderAction icon="file" label="Kopieren" onClick={onCopy} />
          <HeaderAction icon="schere" label="Ausschneiden" disabled={locked} onClick={onCut} />
        </>
      )}
      {clipboard && <HeaderAction icon="import" label="Einfügen" disabled={!canPaste} onClick={onPaste} />}
      {count > 0 && clipboard && <HeaderAction icon="stack_of_photos" label="Duplizieren" onClick={onDuplicate} />}
      {count > 0 && features.has('elementLink') && (
        <span className="link-anchor" data-link-button>
          <HeaderAction
            icon="link"
            label={link ? 'Link ändern' : 'Link'}
            pressed={open}
            disabled={locked}
            title={locked ? 'Gesperrte Elemente lassen sich nicht verlinken.' : undefined}
            onClick={() => setOpen(!open)}
          />
          {open && (
            <LinkPopover link={link} pages={pages} pageIds={pageIds} onChange={onLink} onClose={() => setOpen(false)} />
          )}
        </span>
      )}
      {count > 0 && <HeaderAction icon="empty_trash" label="Löschen" danger disabled={locked} onClick={onDelete} />}
    </div>
  );
}
