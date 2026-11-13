'use client';
// Shared parts of the worksheet dialogs taken over from the reference:
// exercise cards, the “Seiten” section, the preview and the footer.
import { useState, type ReactNode } from 'react';
import Icon from '../Icon';
import ScaledPage from '../ScaledPage';
import type { Page } from '@/lib/notebook-model';

export type SheetLayout = { layout: 'mixed' | 'single'; pages: number; solutions: boolean };

/** Settings stay in this browser for the next time (like the reference). */
export function loadSettings<T extends object>(key: string, defaults: T, clean: (v: T) => T): T {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
    return saved && typeof saved === 'object' ? clean({ ...defaults, ...saved }) : { ...defaults };
  } catch {
    return { ...defaults };
  }
}
export function saveSettings(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
export const cleanLayout = <T extends SheetLayout>(v: T): T => ({
  ...v,
  layout: v.layout === 'single' ? 'single' : 'mixed',
  pages: Math.min(20, Math.max(1, Number(v.pages) || 1)),
  solutions: v.solutions === true,
});

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="sheet-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export function Chips<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: ReactNode; title?: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="sheet-chips" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.value)} type="button" role="radio" aria-checked={value === o.value} title={o.title} className={`sheet-chip${value === o.value ? ' is-active' : ''}`} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function FormatCard({ on, ok = true, label, sample, hint, title, onClick }: { on: boolean; ok?: boolean; label: string; sample: string; hint?: string; title?: string; onClick: () => void }) {
  const active = ok && on;
  return (
    <button type="button" className={`sheet-fmt${active ? ' is-active' : ''}`} aria-pressed={active} disabled={!ok} title={ok ? title : hint} onClick={onClick}>
      <span className="sheet-check" aria-hidden="true">{active && <Icon name="checkmark" />}</span>
      <span className="sheet-fmt-text">
        <strong>{label}</strong>
        <small>{ok ? sample : hint}</small>
      </span>
    </button>
  );
}

export function Toggle({ checked, label, hint, onChange }: { checked: boolean; label: string; hint?: string; onChange: (v: boolean) => void }) {
  return (
    <label className="sheet-toggle">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="sheet-switch" aria-hidden="true" />
      <span>
        <strong>{label}</strong>
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}

export function Counter({ label, value, min = 1, max = 20, onChange }: { label: string; value: number; min?: number; max?: number; onChange: (v: number) => void }) {
  return (
    <div className="sheet-row">
      <span>{label}</span>
      <div className="sheet-count">
        <button type="button" className="sheet-chip" aria-label="Weniger" disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
        <span aria-live="polite">{value}</span>
        <button type="button" className="sheet-chip" aria-label="Mehr" disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

/** “Seiten”: one or several exercises per page, number of pages, solutions. */
export function PagesSection<T extends SheetLayout>({ n, o, set, chosen, missing, solutionHint }: { n: number; o: T; set: (v: Partial<SheetLayout>) => void; chosen: number; missing: number; solutionHint?: string }) {
  const single = o.layout === 'single' && chosen > 1;
  return (
    <Section title={`${n}. Seiten`}>
      <div className="sheet-stack">
        {chosen > 1 && (
          <Chips
            label="Aufteilung"
            value={o.layout}
            onChange={(layout) => set({ layout })}
            options={[
              { value: 'mixed', label: 'Mehrere Übungen untereinander' },
              { value: 'single', label: 'Eine Übung pro Seite' },
            ]}
          />
        )}
        <Counter label={single ? 'Seiten pro Übung' : 'Anzahl der Seiten'} value={o.pages} onChange={(pages) => set({ pages })} />
        {missing > 0 && (
          <p className="sheet-warn">
            {missing === 1 ? 'Eine Übung passt' : `${missing} Übungen passen`} nicht mehr auf {o.pages === 1 ? 'die Seite' : `die ${o.pages} Seiten`}. Nimm mehr Seiten.
          </p>
        )}
        <Toggle checked={o.solutions} label="Lösungsseiten anhängen" hint={solutionHint ?? 'Am Ende kommen die Seiten noch einmal – mit allen Ergebnissen in Grün.'} onChange={(solutions) => set({ solutions })} />
      </div>
    </Section>
  );
}

export function Preview({ pages, hint, empty = 'Wähle mindestens eine Übung aus.' }: { pages: Page[]; hint: string; empty?: string }) {
  const [shown, setShown] = useState(0);
  const [seen, setSeen] = useState(pages);
  if (seen !== pages) {
    setSeen(pages);
    setShown(0);
  }
  const i = Math.min(shown, pages.length - 1);
  if (!pages.length)
    return (
      <div className="sheet-preview">
        <p className="sheet-empty">{empty}</p>
      </div>
    );
  return (
    <div className="sheet-preview">
      <div className="sheet-thumb" aria-label={`Vorschau Seite ${i + 1}`}>
        <ScaledPage page={pages[i]} decorative />
      </div>
      <div className="sheet-nav">
        <button type="button" className="sheet-chip" aria-label="Vorherige Seite" disabled={i <= 0} onClick={() => setShown(Math.max(0, i - 1))}>‹</button>
        <span>Seite {i + 1} von {pages.length}</span>
        <button type="button" className="sheet-chip" aria-label="Nächste Seite" disabled={i >= pages.length - 1} onClick={() => setShown(Math.min(pages.length - 1, i + 1))}>›</button>
      </div>
      <p className="sheet-hint">{hint}</p>
    </div>
  );
}

export function SheetDialog({ title, icon, children, pages, busy, error, reroll, rerollLabel = 'Andere Aufgaben', onCancel, onInsert }: { title: string; icon: Parameters<typeof Icon>[0]['name']; children: ReactNode; pages: Page[]; busy: boolean; error: string; reroll?: () => void; rerollLabel?: string; onCancel: () => void; onInsert: () => void }) {
  const n = pages.length;
  return (
    <div className="modal-backdrop">
      <section className="modal sheet-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <header className="sheet-head">
          <h2><Icon name={icon} /> {title}</h2>
          <button type="button" className="knopf compact" aria-label="Schließen" onClick={onCancel}>✕</button>
        </header>
        <div className="sheet-body">{children}</div>
        <footer className="sheet-foot">
          {error && <p className="error" role="alert">{error}</p>}
          {reroll && (
            <button type="button" className="knopf" disabled={!n || busy} onClick={reroll}>
              <Icon name="synchronize" /> {rerollLabel}
            </button>
          )}
          <button type="button" className="knopf" onClick={onCancel}>Abbrechen</button>
          <button type="button" className="knopf-haupt" disabled={!n || busy} onClick={onInsert}>
            {busy ? 'Wird eingefügt …' : n === 1 ? '1 Seite einfügen' : `${n} Seiten einfügen`}
          </button>
        </footer>
      </section>
    </div>
  );
}

/** Stores the drawn parts on the server and hands the pages to the notebook. */
export function useSheetInsert(onInsert: (pages: Page[]) => Promise<void>, onClose: () => void) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return {
    busy,
    error,
    async insert(pages: Page[], remember: () => void) {
      setBusy(true);
      setError('');
      try {
        remember();
        const { materialize } = await import('@/lib/sheets/convert');
        const { uploadImage } = await import('@/lib/client-api');
        await onInsert(await materialize(pages, uploadImage));
        onClose();
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setBusy(false);
      }
    },
  };
}

/** Chip with a label and a small example below (“Halbe Stunden · 7:30”). */
export function LevelChips<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string; sample: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="sheet-chips" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={`sheet-chip sheet-level${value === o.id ? ' is-active' : ''}`} onClick={() => onChange(o.id)}>
          <span>{o.label}</span>
          <small>{o.sample}</small>
        </button>
      ))}
    </div>
  );
}

/** A slider with its value shown next to the label. */
export function Slider({ label, value, min, max, step = 1, format = String, hint, onChange }: { label: string; value: number; min: number; max: number; step?: number; format?: (v: number) => string; hint?: string; onChange: (v: number) => void }) {
  return (
    <label className="sheet-slider">
      <span className="sheet-slider-head">
        <strong>{label}</strong>
        <output aria-hidden="true">{format(value)}</output>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} aria-label={label} aria-valuetext={format(value)} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="sheet-slider-scale" aria-hidden="true">
        <small>{format(min)}</small>
        <small>{format(max)}</small>
      </span>
      {hint && <small className="sheet-slider-hint">{hint}</small>}
    </label>
  );
}
