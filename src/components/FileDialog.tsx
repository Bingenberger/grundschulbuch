'use client';
import { useState } from 'react';
import type { BookData } from '@/lib/notebook-model';
import { flushEditor, useEditor } from '@/lib/editor-store';
export default function FileDialog({
  data,
  onClose,
}: {
  data?: BookData;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('');
  async function run(task: () => Promise<void>) {
    setBusy(true);
    setError('');
    try {
      if (data && !(await flushEditor()))
        throw new Error('Bitte erst die offenen Änderungen speichern.');
      await task();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      setMessage('');
    }
  }
  async function exportFile(
    kind: 'archive' | 'html' | 'epub' | 'scorm' | 'pdf',
  ) {
    await run(async () => {
      setMessage('Datei wird vorbereitet …');
      const helpers = await import('@/lib/portable');
      const current = data
        ? {
            book: useEditor.getState().book || data.book,
            pages: useEditor.getState().pages.length
              ? useEditor.getState().pages
              : data.pages,
          }
        : null;
      if (!current) return;
      let blob: Blob, ext: string;
      if (kind === 'archive') {
        blob = await helpers.exportArchive(current);
        ext = 'grundschulbuch';
      } else if (kind === 'html') {
        blob = new Blob([await helpers.exportHtml(current)], {
          type: 'text/html',
        });
        ext = 'html';
      } else if (kind === 'epub') {
        blob = await helpers.exportEpub(current);
        ext = 'epub';
      } else if (kind === 'scorm') {
        blob = await helpers.exportScorm(current);
        ext = 'scorm.zip';
      } else {
        blob = await helpers.exportPdf(current, setMessage);
        ext = 'pdf';
      }
      helpers.saveDownload(blob, current.book.title, ext);
    });
  }
  return (
    <div className="modal-backdrop">
      <section
        className="modal file-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-title"
      >
        <div className="dialog-heading">
          <h2 id="file-title">Heftdateien</h2>
          <button className="knopf" disabled={busy} onClick={onClose}>
            Schließen
          </button>
        </div>
        {data && (
          <>
            <h3>Dieses Heft speichern</h3>
            <div className="file-options">
              {(
                [
                  [
                    'archive',
                    'Bearbeitbare Heftdatei',
                    'Auf einem anderen Grundschulbuch-Server wieder öffnen.',
                  ],
                  [
                    'html',
                    'HTML mit Lernwerkzeugen',
                    'Eigenständig im Browser öffnen und weitergeben.',
                  ],
                  [
                    'pdf',
                    'PDF herunterladen',
                    'Alle Seiten in ihrer A4-Ausrichtung.',
                  ],
                  [
                    'epub',
                    'ePub',
                    'Festes Seitenlayout für unterstützende Lesegeräte.',
                  ],
                  [
                    'scorm',
                    'SCORM 1.2',
                    'Für Lernplattformen, mit Rückmeldung der Übungsergebnisse.',
                  ],
                ] as const
              ).map(([id, title, description]) => (
                <button
                  className="knopf"
                  key={id}
                  disabled={busy}
                  onClick={() => exportFile(id)}
                >
                  <strong>{title}</strong>
                  <small>{description}</small>
                </button>
              ))}
            </div>
          </>
        )}
        {!data && (
          <>
            <h3>Regal sichern</h3>
            <button
              className="knopf"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const h = await import('@/lib/portable');
                  h.saveDownload(
                    await h.exportBackup(setMessage),
                    'Grundschulbuch-Sicherung',
                    'sicherung.zip',
                  );
                })
              }
            >
              Alle Hefte und Ordner sichern
            </button>
            <label className="knopf">
              Sicherung wiederherstellen
              <input
                className="visually-hidden"
                type="file"
                accept=".zip"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    void run(async () => {
                      const h = await import('@/lib/portable');
                      await h.importBackup(file, setMessage);
                      window.location.reload();
                    });
                }}
              />
            </label>
          </>
        )}
        <h3>Heft oder PDF öffnen</h3>
        <label className="knopf">
          Datei auswählen
          <input
            className="visually-hidden"
            type="file"
            accept=".grundschulbuch,.json,.zip,.html,.epub,.pdf"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              void run(async () => {
                const helpers = await import('@/lib/portable');
                const imported = file.name.toLowerCase().endsWith('.pdf')
                  ? await helpers.importPdf(file, setMessage)
                  : await helpers.importPortable(file);
                window.location.assign(`/heft/${imported.book.id}`);
              });
            }}
          />
        </label>
        <p>
          Importierte Hefte erhalten eine eigene Kopie in deinem Regal.
          PDF-Seiten werden als gesperrte Hintergründe eingefügt; darauf kannst
          du schreiben und zeichnen.
        </p>
        {message && <p role="status">{message}</p>}
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
        <p className="hinweis">
          <a href="/runtime/quellcode.zip" download>
            Quellcode dieser Version herunterladen
          </a>
        </p>
      </section>
    </div>
  );
}
