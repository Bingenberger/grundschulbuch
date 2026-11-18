'use client';
// Drucken und PDF – aufgebaut wie „Speichern und teilen“ in Lernsachen-Heft:
// Name des Hefts, Seitenauswahl, Ausgaben als Kacheln mit Fortschritt und auf
// Tablets „Teilen oder sichern“ über das Teilen-Menü des Geräts.
import { useEffect, useRef, useState } from 'react';
import Icon, { type IconName } from './Icon';
import ScaledPage from './ScaledPage';
import type { Notebook, Page } from '@/lib/notebook-model';
import { flushEditor } from '@/lib/editor-store';

type Ready = { blob: Blob; name: string };

export function fileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
}
function fileName(title: string) {
  return (title.trim() || 'Heft').replace(/[\\/:*?"<>|]/g, '-').slice(0, 100);
}
/** Teilen-Menü nur auf Touch-Geräten, die Dateien teilen können (iPad, Tablets). */
function canShareFiles() {
  try {
    const probe = new File(['x'], 'x.txt', { type: 'text/plain' });
    return (
      typeof navigator.share === 'function' &&
      !!navigator.canShare?.({ files: [probe] }) &&
      matchMedia('(pointer: coarse)').matches
    );
  } catch {
    return false;
  }
}
async function shareFile(blob: Blob, name: string) {
  try {
    await navigator.share({ files: [new File([blob], name, { type: blob.type })] });
    return 'shared';
  } catch (e) {
    return e instanceof DOMException && e.name === 'AbortError' ? 'cancelled' : 'failed';
  }
}
function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob),
    a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
const stillActive = () =>
  (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation?.isActive === true;

const pagesLabel = (n: number) => (n === 1 ? '1 Seite' : `${n} Seiten`);

export default function PrintDialog({
  book,
  pages,
  onRename,
  onClose,
}: {
  book: Notebook;
  pages: Page[];
  onRename?: (title: string) => Promise<void>;
  onClose: () => void;
}) {
  const printable = pages.filter((p) => p.paperMode !== 'endless');
  const endless = pages.length - printable.length;
  // null: alle druckbaren Seiten
  const [chosen, setChosen] = useState<string[] | null>(null);
  const [picking, setPicking] = useState(printable.length > 1);
  const [progress, setProgress] = useState<{ kind: string; done: number; total: number } | null>(null);
  const [ready, setReady] = useState<Ready | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState(book.title);
  const busy = !!progress;
  const selected = chosen ? printable.filter((p) => chosen.includes(p.id)) : printable;
  const portrait = selected.filter((p) => p.orientation !== 'landscape');
  const landscape = selected.filter((p) => p.orientation === 'landscape');
  const mixed = portrait.length > 0 && landscape.length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onClose]);

  async function saveName() {
    const next = title.trim().slice(0, 120);
    if (!next) return setTitle(book.title);
    if (next === book.title || !onRename) return;
    try {
      await onRename(next);
    } catch (e) {
      setTitle(book.title);
      setError((e as Error).message);
    }
  }

  async function makePdf() {
    setError('');
    setMessage('');
    setReady(null);
    setProgress({ kind: 'pdf', done: 0, total: selected.length });
    try {
      const { exportPdf } = await import('@/lib/portable');
      const blob = await exportPdf(
        { book: { ...book, title: title.trim() || book.title }, pages: selected },
        () => undefined,
        (done, total) => setProgress({ kind: 'pdf', done, total }),
      );
      const name = `${fileName(title)}${chosen ? ` (${pagesLabel(selected.length)})` : ''}.pdf`;
      setProgress(null);
      if (canShareFiles()) {
        // Noch in der Berührung: gleich das Teilen-Menü, sonst über den Knopf.
        if (stillActive() && (await shareFile(blob, name)) === 'shared') return onClose();
        setReady({ blob, name });
      } else {
        download(blob, name);
        setMessage(`PDF gespeichert (${fileSize(blob.size)}).`);
      }
    } catch (e) {
      console.error('[pdf]', e);
      setProgress(null);
      const detail = (e instanceof Error ? e.message : String(e)).slice(0, 160);
      setError(`Das hat leider nicht geklappt${detail ? ` (${detail})` : ''}. Bitte versuche es noch einmal.`);
    }
  }

  async function shareReady() {
    if (!ready) return;
    const result = await shareFile(ready.blob, ready.name);
    if (result === 'cancelled') return;
    if (result === 'failed') download(ready.blob, ready.name);
    setReady(null);
    onClose();
  }

  async function print(list: Page[]) {
    setError('');
    setProgress({ kind: list === landscape && mixed ? 'landscape' : 'print', done: 0, total: list.length });
    try {
      await saveName();
      if (!(await flushEditor())) throw new Error('Bitte erst die offenen Änderungen speichern.');
      const query = new URLSearchParams({ drucken: '1' });
      if (list.length < printable.length) query.set('seiten', list.map((p) => p.id).join(','));
      window.location.assign(`/drucken/${book.id}?${query}`);
    } catch (e) {
      setProgress(null);
      setError((e as Error).message);
    }
  }

  if (picking)
    return (
      <PagePicker
        pages={printable}
        endless={endless}
        initial={chosen ?? printable.map((p) => p.id)}
        onCancel={() => (chosen === null && !ready && !message ? onClose() : setPicking(false))}
        onDone={(ids) => {
          setChosen(ids.length === printable.length ? null : ids);
          setReady(null);
          setMessage('');
          setPicking(false);
        }}
      />
    );

  const option = (o: {
    kind: string;
    icon: IconName;
    title: string;
    text: string;
    primary?: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      key={o.kind}
      className={`save-opt${o.primary ? ' is-primary' : ''}`}
      disabled={busy || !selected.length}
      onClick={o.onClick}
    >
      <span className="save-ic">
        <Icon name={o.icon} size={30} />
      </span>
      <span className="save-txt">
        <strong>{o.title}</strong>
        <small>{o.text}</small>
      </span>
      {progress?.kind === o.kind && (
        <span className="save-progress" role="status">
          <span className="save-spinner" aria-hidden="true" />
          {o.kind === 'pdf'
            ? `Seite ${Math.min(progress.done + 1, progress.total)} von ${progress.total}`
            : 'Druckansicht wird geöffnet …'}
        </span>
      )}
    </button>
  );

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <section className="modal save-dialog" role="dialog" aria-modal="true" aria-labelledby="print-title">
        <div className="dialog-heading">
          <h2 id="print-title">Drucken und PDF</h2>
          <button type="button" className="knopf" disabled={busy} onClick={onClose}>
            Schließen
          </button>
        </div>
        <div className="save">
          <label className="save-name">
            <span className="save-h">Name des Hefts</span>
            <input
              className="save-input"
              value={title}
              maxLength={120}
              disabled={busy || !onRename}
              enterKeyHint="done"
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => void saveName()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
            />
            <span className="save-name-hint">So heißt auch die PDF-Datei.</span>
          </label>
          {printable.length > 1 && (
            <div className="save-pages">
              <Icon name="file" size={20} />
              <span>
                {chosen
                  ? `${selected.length} von ${printable.length} Seiten`
                  : `Alle ${printable.length} Seiten`}
              </span>
              <button type="button" className="knopf save-small" disabled={busy} onClick={() => setPicking(true)}>
                Andere Seiten …
              </button>
            </div>
          )}
          {endless > 0 && (
            <p className="save-note">
              <Icon name="about" size={16} />{' '}
              {endless === 1
                ? 'Eine Seite mit Endlospapier wird nicht gedruckt'
                : `${endless} Seiten mit Endlospapier werden nicht gedruckt`}{' '}
              – speichere sie als Heftdatei oder HTML.
            </p>
          )}

          <h3 className="save-h">PDF</h3>
          {option({
            kind: 'pdf',
            icon: 'document',
            primary: true,
            title: 'PDF-Datei',
            text: 'Zum Drucken, Verschicken oder Abgeben – jede Seite in ihrer A4-Ausrichtung, so wie sie im Heft aussieht.',
            onClick: () => void makePdf(),
          })}
          {ready && (
            <ReadyBanner ready={ready} onShare={() => void shareReady()} />
          )}

          <h3 className="save-h">Drucker</h3>
          {mixed ? (
            <>
              {option({
                kind: 'print',
                icon: 'rotate_to_portrait',
                title: `Hochformat drucken (${pagesLabel(portrait.length)})`,
                text: 'Hoch- und Querformat druckt der Browser nur getrennt maßhaltig – erst die eine, dann die andere Hälfte.',
                onClick: () => void print(portrait),
              })}
              {option({
                kind: 'landscape',
                icon: 'rotate_to_landscape',
                title: `Querformat drucken (${pagesLabel(landscape.length)})`,
                text: 'Die Seiten im Querformat als eigener Druckauftrag.',
                onClick: () => void print(landscape),
              })}
            </>
          ) : (
            option({
              kind: 'print',
              icon: 'print',
              title: 'Am Drucker drucken',
              text: 'Öffnet die Druckansicht und den Druckdialog des Browsers.',
              onClick: () => void print(selected),
            })
          )}
          <p className="save-note">
            <Icon name="about" size={16} /> Im Druckdialog: A4, Maßstab 100 %, Ränder „Keine“ und Kopf- und
            Fußzeilen ausschalten. Statt eines Druckers kannst du dort auch „Als PDF sichern“ wählen.
          </p>
          {message && (
            <p className="save-done" role="status">
              <Icon name="ok" size={18} /> {message}
            </p>
          )}
          {error && (
            <p className="fehler" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function ReadyBanner({ ready, onShare }: { ready: Ready; onShare: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    el.querySelector('button')?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="save-ready" ref={ref} role="status">
      <span>
        <Icon name="ok" size={20} /> {ready.name} ist fertig ({fileSize(ready.blob.size)}).
      </span>
      <button type="button" className="knopf knopf-haupt" onClick={onShare}>
        <Icon name="share" size={20} /> Teilen oder sichern
      </button>
    </div>
  );
}

/** „Welche Seiten drucken?“ – alle sind ausgewählt, Antippen nimmt eine heraus. */
function PagePicker({
  pages,
  endless,
  initial,
  onCancel,
  onDone,
}: {
  pages: Page[];
  endless: number;
  initial: string[];
  onCancel: () => void;
  onDone: (ids: string[]) => void;
}) {
  const [ids, setIds] = useState(initial);
  const count = ids.length;
  const all = count === pages.length;
  const confirm = all
    ? count === 1
      ? 'Weiter'
      : `Alle ${count} Seiten – weiter`
    : `${pagesLabel(count)} – weiter`;
  const toggle = (id: string) =>
    setIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <section className="modal save-dialog save-picker" role="dialog" aria-modal="true" aria-labelledby="print-pick-title">
        <div className="dialog-heading">
          <h2 id="print-pick-title">Welche Seiten drucken?</h2>
          <button
            type="button"
            className="knopf save-small"
            onClick={() => setIds(all ? [] : pages.map((p) => p.id))}
          >
            {all ? 'Keine' : 'Alle'}
          </button>
        </div>
        <p>
          Alle Seiten sind ausgewählt. Tippe die an, die nicht gedruckt werden sollen.
          {endless > 0 && ' Seiten mit Endlospapier lassen sich nicht drucken und fehlen hier.'}
        </p>
        <div className="save-picker-grid">
          {pages.map((page, i) => {
            const on = ids.includes(page.id);
            return (
              <button
                type="button"
                key={page.id}
                className={`page-tile save-picker-tile ${on ? 'selected' : 'is-off'}`}
                aria-pressed={on}
                aria-label={`Seite ${i + 1}`}
                onClick={() => toggle(page.id)}
              >
                <span className={`page-tile-page ${page.orientation}`}>
                  <ScaledPage page={page} decorative />
                </span>
                <span className="page-tile-number">{i + 1}</span>
                <span className="page-tile-check" aria-hidden="true">
                  {on && <Icon name="ok" size={22} />}
                </span>
              </button>
            );
          })}
        </div>
        <div className="dialog-actions">
          <button type="button" className="knopf" onClick={onCancel}>
            Abbrechen
          </button>
          <button
            type="button"
            className="knopf knopf-haupt"
            disabled={!count}
            onClick={() => onDone(pages.filter((p) => ids.includes(p.id)).map((p) => p.id))}
          >
            {confirm}
          </button>
        </div>
      </section>
    </div>
  );
}
