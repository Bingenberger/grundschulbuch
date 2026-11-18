'use client';
import { useState } from 'react';
import type { BookData } from '@/lib/notebook-model';
import { flushEditor } from '@/lib/editor-store';
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
          <p>
            Dieses Heft speicherst du als Heftdatei, HTML, PDF, SCORM oder ePub
            im Heft oben mit „Speichern“.
          </p>
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
