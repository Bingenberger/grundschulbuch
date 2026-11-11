'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import ScaledPage from '../ScaledPage';
import Icon from '../Icon';
import { ChoiceButton, Choices } from '../ui/Choice';
import { PAPER, categoryIcon, recentTemplates, rememberTemplate, type Orientation, type TemplateEntry } from './page-templates';

const RECENT = 'Zuletzt benutzt';

/** Real preview of a template, drawn only once it scrolls into view. */
function Preview({ entry, orientation }: { entry: TemplateEntry; orientation: Orientation }) {
  const box = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (items) => {
        if (items.some((i) => i.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const format = entry.orientation || orientation;
  const page = useMemo(() => (visible ? entry.build(format)[0] : null), [visible, entry, format]);
  return (
    <span ref={box} className={`template-preview ${format}`}>
      {page && <ScaledPage page={page} decorative />}
    </span>
  );
}

/**
 * Choosing a template, for a new page or to change the current one: categories
 * on the left, search, format, recently used and real previews.
 */
export default function TemplateChooser({
  title,
  hint,
  entries,
  current,
  orientation: initial = 'landscape',
  lockOrientation,
  busy,
  onPick,
  onImport,
  onRemove,
  onClose,
}: {
  title: string;
  hint?: string;
  entries: TemplateEntry[];
  current?: string;
  orientation?: Orientation;
  /** The current page keeps its format (it already has content). */
  lockOrientation?: boolean;
  busy?: boolean;
  onPick: (entry: TemplateEntry, orientation: Orientation) => void;
  onImport?: () => void;
  onRemove?: (entry: TemplateEntry) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Alle');
  const [orientation, setOrientation] = useState<Orientation>(initial);
  const [recent] = useState(recentTemplates);
  const main = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [onClose]);

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const found = entries.filter((e) => words.every((w) => e.words.toLowerCase().includes(w)));
  const categories = [...new Set(entries.map((e) => e.category))];
  const count = (c: string) => found.filter((e) => e.category === c).length;
  const recentEntries = recent.map((k) => entries.find((e) => e.key === k)).filter((e): e is TemplateEntry => !!e);
  const shown = category === 'Alle' ? categories.filter((c) => count(c) > 0) : [category];
  const pick = (entry: TemplateEntry) => {
    rememberTemplate(entry.key);
    onPick(entry, orientation);
  };
  const card = (entry: TemplateEntry) => (
    <div key={entry.key} className={`template-card ${entry.key === current ? 'current' : ''}`}>
      <button type="button" className="template-pick" disabled={busy} onClick={() => pick(entry)} aria-label={`Vorlage ${entry.title}`}>
        <Preview entry={entry} orientation={orientation} />
        <span className="template-title">{entry.title}</span>
        {entry.key === current && <span className="template-badge">Aktuell</span>}
      </button>
      {entry.savedId && onRemove && (
        <button type="button" className="template-remove" aria-label={`Vorlage ${entry.title} entfernen`} disabled={busy} onClick={() => onRemove(entry)}>
          <Icon name="empty_trash" size={16} />
        </button>
      )}
    </div>
  );
  const choose = (c: string) => {
    setCategory(c);
    if (main.current) main.current.scrollTop = 0;
  };
  return (
    <div className="modal-backdrop">
      <section className="modal template-chooser" role="dialog" aria-modal="true" aria-labelledby="template-chooser-title">
        <div className="dialog-heading">
          <div>
            <h2 id="template-chooser-title">{title}</h2>
            {hint && <p className="template-hint">{hint}</p>}
          </div>
          <button type="button" className="knopf" onClick={onClose}>
            Schließen
          </button>
        </div>
        <div className="template-layout">
          <nav className="template-categories" aria-label="Kategorien">
            <ChoiceButton icon="grid" label={`Alle · ${found.length}`} pressed={category === 'Alle'} onClick={() => choose('Alle')} />
            {categories.map((c) => (
              <ChoiceButton
                key={c}
                icon={categoryIcon(c)}
                label={`${c} · ${count(c)}`}
                pressed={category === c}
                disabled={!count(c)}
                onClick={() => choose(category === c ? 'Alle' : c)}
              />
            ))}
          </nav>
          <div className="template-main" ref={main}>
            <div className="template-tools">
              <label className="template-search">
                <Icon name="search" size={20} />
                <input
                  type="search"
                  aria-label="Vorlage suchen"
                  placeholder="Vorlage suchen, z. B. Linien, Comic, Rechnen …"
                  value={query}
                  autoFocus
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && found.length === 1) pick(found[0]);
                  }}
                />
              </label>
              <Choices
                label="Format"
                value={orientation}
                disabled={lockOrientation}
                onChange={setOrientation}
                options={[
                  { value: 'landscape', label: 'Querformat', icon: <span className="format-glyph landscape" /> },
                  { value: 'portrait', label: 'Hochformat', icon: <span className="format-glyph portrait" /> },
                ]}
              />
              {onImport && <ChoiceButton icon="import" label="Seiten aus einer Datei" onClick={onImport} />}
            </div>
            {lockOrientation && (
              <p className="template-note">Die Seite behält ihr Format, weil schon etwas darauf ist.</p>
            )}
            {!found.length && <p className="template-note">Keine Vorlage gefunden.</p>}
            {category === 'Alle' && !query && recentEntries.length > 0 && (
              <section className="template-group">
                <h3>
                  <Icon name="clock" size={20} /> {RECENT}
                </h3>
                <div className="template-grid-new">{recentEntries.map(card)}</div>
              </section>
            )}
            {shown.map((c) => (
              <section key={c} className="template-group">
                <h3>
                  <Icon name={categoryIcon(c)} size={20} /> {c}
                  {c === PAPER && <small> – leere Seiten mit Lineatur</small>}
                </h3>
                <div className="template-grid-new">{found.filter((e) => e.category === c).map(card)}</div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
