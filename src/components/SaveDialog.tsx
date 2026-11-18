'use client';
// Speichern und teilen – aufgebaut wie der gleichnamige Dialog in Lernsachen-Heft:
// Name des Hefts, Seitenauswahl, alle Formate (Heftdatei, HTML, PDF, Drucker,
// SCORM, ePub) als Kacheln mit Fortschritt und auf Tablets „Teilen oder sichern“
// über das Teilen-Menü des Geräts.
import { useEffect, useRef, useState } from 'react';
import Icon, { type IconName } from './Icon';
import ScaledPage from './ScaledPage';
import type { BookData, Notebook, Page } from '@/lib/notebook-model';
import { flushEditor } from '@/lib/editor-store';

type Kind = 'archive' | 'html' | 'pdf' | 'print' | 'landscape' | 'scorm' | 'epub';
type Ready = { blob: Blob; name: string; kind: Kind };

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

export default function SaveDialog({
  book,
  pages,
  allowFiles = true,
  allowPrint = true,
  onRename,
  onClose,
}: {
  book: Notebook;
  pages: Page[];
  /** Heftdatei, HTML, SCORM, ePub */
  allowFiles?: boolean;
  /** PDF und Drucker */
  allowPrint?: boolean;
  onRename?: (title: string) => Promise<void>;
  onClose: () => void;
}) {
  // null: alle Seiten
  const [chosen, setChosen] = useState<string[] | null>(null);
  const [picking, setPicking] = useState(pages.length > 1);
  const [progress, setProgress] = useState<{ kind: Kind; done: number; total: number } | null>(null);
  const [ready, setReady] = useState<Ready | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState(book.title);
  const busy = !!progress;
  const selected = chosen ? pages.filter((p) => chosen.includes(p.id)) : pages;
  const printable = selected.filter((p) => p.paperMode !== 'endless');
  const endless = selected.length - printable.length;
  const portrait = printable.filter((p) => p.orientation !== 'landscape');
  const landscape = printable.filter((p) => p.orientation === 'landscape');
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

  function partOf(list: Page[]): BookData {
    return {
      book: { ...book, title: title.trim() || book.title, pageIds: list.map((p) => p.id) },
      pages: list,
    };
  }
  function nameFor(list: Page[], ext: string) {
    const part = list.length < pages.length ? ` (${pagesLabel(list.length)})` : '';
    return `${fileName(title)}${part}.${ext}`;
  }

  async function save(kind: Exclude<Kind, 'print' | 'landscape'>) {
    setError('');
    setMessage('');
    setReady(null);
    const list = kind === 'pdf' ? printable : selected;
    setProgress({ kind, done: 0, total: list.length });
    try {
      await saveName();
      if (!(await flushEditor())) throw new Error('Bitte erst die offenen Änderungen speichern.');
      const helpers = await import('@/lib/portable');
      const data = partOf(list);
      let blob: Blob, ext: string, label: string;
      if (kind === 'archive') {
        blob = await helpers.exportArchive(data);
        [ext, label] = ['grundschulbuch', 'Die Heftdatei ist gespeichert'];
      } else if (kind === 'html') {
        blob = new Blob([await helpers.exportHtml(data)], { type: 'text/html' });
        [ext, label] = ['html', 'Das Heft zum Ansehen ist gespeichert'];
      } else if (kind === 'pdf') {
        blob = await helpers.exportPdf(data, () => undefined, (done, total) =>
          setProgress({ kind, done, total }),
        );
        [ext, label] = ['pdf', 'PDF gespeichert'];
      } else if (kind === 'scorm') {
        blob = await helpers.exportScorm(data);
        [ext, label] = ['scorm.zip', 'SCORM-Paket gespeichert'];
      } else {
        blob = await helpers.exportEpub(data);
        [ext, label] = ['epub', 'ePub gespeichert'];
      }
      const name = nameFor(list, ext);
      setProgress(null);
      if (canShareFiles()) {
        // Noch in der Berührung: gleich das Teilen-Menü, sonst über den Knopf.
        if (stillActive() && (await shareFile(blob, name)) === 'shared') return onClose();
        setReady({ blob, name, kind });
      } else {
        download(blob, name);
        setMessage(`${label} (${fileSize(blob.size)}).`);
      }
    } catch (e) {
      console.error('[export]', e);
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

  async function print(list: Page[], kind: 'print' | 'landscape') {
    setError('');
    setProgress({ kind, done: 0, total: list.length });
    try {
      await saveName();
      if (!(await flushEditor())) throw new Error('Bitte erst die offenen Änderungen speichern.');
      const query = new URLSearchParams({ drucken: '1' });
      if (list.length < pages.length) query.set('seiten', list.map((p) => p.id).join(','));
      window.location.assign(`/drucken/${book.id}?${query}`);
    } catch (e) {
      setProgress(null);
      setError((e as Error).message);
    }
  }

  if (picking)
    return (
      <PagePicker
        pages={pages}
        initial={chosen ?? pages.map((p) => p.id)}
        onCancel={() => (chosen === null && !ready && !message ? onClose() : setPicking(false))}
        onDone={(ids) => {
          setChosen(ids.length === pages.length ? null : ids);
          setReady(null);
          setMessage('');
          setPicking(false);
        }}
      />
    );

  const progressText = (kind: Kind) =>
    !progress || progress.kind !== kind
      ? null
      : kind === 'pdf'
        ? `Seite ${Math.min(progress.done + 1, progress.total)} von ${progress.total}`
        : kind === 'print' || kind === 'landscape'
          ? 'Druckansicht wird geöffnet …'
          : 'Wird erstellt …';
  const spinner = (kind: Kind) =>
    progressText(kind) && (
      <span className="save-progress" role="status">
        <span className="save-spinner" aria-hidden="true" />
        {progressText(kind)}
      </span>
    );
  type Opt = { kind: Kind; icon: IconName; title: string; text: string; primary?: boolean; disabled?: boolean; onClick?: () => void };
  const run = (o: Opt) => o.onClick ?? (() => void save(o.kind as Exclude<Kind, 'print' | 'landscape'>));
  // Breite Zeile mit Symbol links (wie „save-opt“ im Vorbild)
  const option = (o: Opt) => (
    <button
      type="button"
      key={o.kind}
      className={`save-opt${o.primary ? ' is-primary' : ''}`}
      disabled={busy || o.disabled}
      onClick={run(o)}
    >
      <span className="save-ic">
        <Icon name={o.icon} size={30} />
      </span>
      <span className="save-txt">
        <strong>{o.title}</strong>
        <small>{o.text}</small>
      </span>
      {spinner(o.kind)}
    </button>
  );
  // Kachel nebeneinander (wie „save-tile“ im Vorbild)
  const tile = (o: Opt) => (
    <button
      type="button"
      key={o.kind}
      className={`save-tile${o.primary ? ' is-primary' : ''}`}
      disabled={busy || o.disabled}
      onClick={run(o)}
    >
      <span className="save-ic">
        <Icon name={o.icon} size={28} />
      </span>
      <strong>{o.title}</strong>
      <small>{o.text}</small>
      {spinner(o.kind)}
    </button>
  );
  const readyFor = (kind: Kind) =>
    ready?.kind === kind && <ReadyBanner key={ready.name + ready.blob.size} ready={ready} onShare={() => void shareReady()} />;
  const noPrint = !printable.length;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <section className="modal save-dialog" role="dialog" aria-modal="true" aria-labelledby="save-title">
        <div className="dialog-heading">
          <h2 id="save-title">Speichern und teilen</h2>
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
            <span className="save-name-hint">So heißen auch die Dateien.</span>
          </label>
          {pages.length > 1 && (
            <div className="save-pages">
              <Icon name="file" size={20} />
              <span>
                {chosen ? `${selected.length} von ${pages.length} Seiten` : `Alle ${pages.length} Seiten`}
              </span>
              <button type="button" className="knopf save-small" disabled={busy} onClick={() => setPicking(true)}>
                Andere Seiten …
              </button>
            </div>
          )}

          {allowFiles && (
            <>
              <h3 className="save-h">Heft als Datei</h3>
              <div className="save-tiles">
                {tile({
                  kind: 'archive',
                  icon: 'filing_cabinet',
                  primary: true,
                  title: 'Bearbeitbare Heftdatei',
                  text: 'Zum Weiterarbeiten: auf einem Grundschulbuch-Server im Regal mit „Heft, ePub oder PDF öffnen“ wieder öffnen – alles bleibt bearbeitbar.',
                })}
                {tile({
                  kind: 'html',
                  icon: 'globe',
                  title: 'HTML zum Ansehen',
                  text: 'In jedem Browser ansehen, umblättern und die Lernwerkzeuge benutzen – ohne Server, zum Weitergeben.',
                })}
              </div>
              {readyFor('archive')}
              {readyFor('html')}
            </>
          )}

          {allowPrint && (
            <>
              <h3 className="save-h">Drucken und PDF</h3>
              {option({
                kind: 'pdf',
                icon: 'document',
                primary: !allowFiles,
                disabled: noPrint,
                title: 'PDF',
                text: noPrint
                  ? 'Seiten mit Endlospapier gibt es nicht als PDF – wähle andere Seiten.'
                  : 'Zum Drucken, Verschicken oder Abgeben – jede Seite in ihrer A4-Ausrichtung, so wie sie im Heft aussieht.',
              })}
              {readyFor('pdf')}
              {mixed ? (
                <div className="save-tiles">
                  {tile({
                    kind: 'print',
                    icon: 'rotate_to_portrait',
                    title: `Hochformat drucken (${pagesLabel(portrait.length)})`,
                    text: 'Hoch- und Querformat druckt der Browser nur getrennt maßhaltig.',
                    onClick: () => void print(portrait, 'print'),
                  })}
                  {tile({
                    kind: 'landscape',
                    icon: 'rotate_to_landscape',
                    title: `Querformat drucken (${pagesLabel(landscape.length)})`,
                    text: 'Die Seiten im Querformat als eigener Druckauftrag.',
                    onClick: () => void print(landscape, 'landscape'),
                  })}
                </div>
              ) : (
                option({
                  kind: 'print',
                  icon: 'print',
                  disabled: noPrint,
                  title: 'Am Drucker drucken',
                  text: 'Öffnet die Druckansicht und den Druckdialog des Browsers. Dort: A4, Maßstab 100 %, Ränder „Keine“, ohne Kopf- und Fußzeilen.',
                  onClick: () => void print(printable, 'print'),
                })
              )}
              {endless > 0 && !noPrint && (
                <p className="save-note">
                  <Icon name="about" size={16} />{' '}
                  {endless === 1
                    ? 'Eine Seite mit Endlospapier kommt nicht ins PDF und nicht auf den Drucker.'
                    : `${endless} Seiten mit Endlospapier kommen nicht ins PDF und nicht auf den Drucker.`}
                </p>
              )}
            </>
          )}

          {allowFiles && (
            <>
              <h3 className="save-h">Weitere Formate</h3>
              {option({
                kind: 'scorm',
                icon: 'graduation_cap',
                title: 'SCORM-Paket (Moodle, mebis)',
                text: 'Das Heft als Lernpaket (SCORM 1.2) für Lernplattformen – mit Rückmeldung der Übungsergebnisse.',
              })}
              {readyFor('scorm')}
              {option({
                kind: 'epub',
                icon: 'reading_ebook',
                title: 'ePub-Buch',
                text: 'Festes Seitenlayout für Apple Books und andere Lese-Apps, die das unterstützen.',
              })}
              {readyFor('epub')}
            </>
          )}

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
          <p className="save-note">
            <Icon name="about" size={16} /> Dein Heft wird auf dem Server automatisch gesichert. Als Datei kannst du es
            weitergeben oder auf einem anderen Gerät öffnen.
          </p>
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

/** „Welche Seiten speichern?“ – alle sind ausgewählt, Antippen nimmt eine heraus. */
function PagePicker({
  pages,
  initial,
  onCancel,
  onDone,
}: {
  pages: Page[];
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
      <section className="modal save-dialog save-picker" role="dialog" aria-modal="true" aria-labelledby="save-pick-title">
        <div className="dialog-heading">
          <h2 id="save-pick-title">Welche Seiten speichern?</h2>
          <button
            type="button"
            className="knopf save-small"
            onClick={() => setIds(all ? [] : pages.map((p) => p.id))}
          >
            {all ? 'Keine' : 'Alle'}
          </button>
        </div>
        <p>
          Alle Seiten sind ausgewählt. Tippe die an, die nicht in die Datei sollen.
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
                {page.paperMode === 'endless' && <span className="save-picker-badge">Endlospapier</span>}
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
