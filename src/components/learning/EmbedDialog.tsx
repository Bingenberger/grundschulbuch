'use client';
import { Picker } from '../ui/Choice';
import { useState } from 'react';
import { uuid, type PageElement } from '@/lib/notebook-model';
export default function EmbedDialog({
  onInsert,
  onClose,
  child = false,
}: {
  onInsert: (el: PageElement) => void;
  onClose: () => void;
  /** Children embed videos, web pages, links and QR posters, but no own HTML apps. */
  child?: boolean;
}) {
  const [url, setUrl] = useState(''),
    [title, setTitle] = useState(''),
    [kind, setKind] = useState<NonNullable<PageElement['embedKind']>>('video'),
    [error, setError] = useState(''),
    [app, setApp] = useState<File | null>(null),
    [busy, setBusy] = useState(false);
  return (
    <div className="modal-backdrop">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="embed-title"
      >
        <h2 id="embed-title">Video, Webseite oder QR-Code</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              let src: string | undefined;
              if (kind === 'app') {
                if (!app) throw new Error('Bitte eine HTML-Datei wählen.');
                const response = await fetch('/api/apps', {
                  method: 'POST',
                  body: app,
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                src = data.src;
              }
              const address = new URL(
                kind === 'app' ? 'https://example.invalid' : url,
              );
              if (
                !['http:', 'https:'].includes(address.protocol) ||
                address.username ||
                address.password
              )
                throw new Error(
                  'Bitte eine HTTP- oder HTTPS-Adresse verwenden.',
                );
              onInsert({
                id: uuid(),
                type: 'embed',
                x: 20,
                y: 40,
                width: kind === 'qr' ? 65 : 170,
                height: kind === 'qr' ? 75 : 100,
                rotation: 0,
                locked: false,
                color: '#253c42',
                url: kind === 'app' ? undefined : address.href,
                src,
                embedKind: kind,
                alt: title,
              });
              onClose();
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <Picker
            label="Art"
            value={kind}
            onChange={setKind}
            options={[
              { value: 'video', label: 'Video', icon: 'camcorder_pro' },
              { value: 'webpage', label: 'Webseite', icon: 'globe' },
              { value: 'link', label: 'Verknüpfung', icon: 'next' },
              { value: 'qr', label: 'QR-Plakat', icon: 'grid' },
              ...(child ? [] : [{ value: 'app' as const, label: 'Eigene HTML-App', icon: 'settings' as const }]),
            ]}
          />
          {kind === 'app' ? (
            <label className="feld">
              <span>Eigenständige HTML-Datei (bis 2 MB)</span>
              <input
                type="file"
                accept=".html,.htm"
                required
                onChange={(e) => setApp(e.target.files?.[0] || null)}
              />
              <small>
                Die App läuft getrennt vom Heft. Bilder, Schriften und Skripte
                müssen in der Datei enthalten sein.
              </small>
            </label>
          ) : (
            <>
              <label className="feld">
                <span>Internetadresse</span>
                <input
                  type="url"
                  aria-label="Internetadresse"
                  required
                  maxLength={2000}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://…"
                />
              </label>
            </>
          )}
          <label className="feld">
            <span>Beschriftung</span>
            <input
              maxLength={300}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <p>
            Externe Inhalte werden erst nach Antippen geladen. In Kinderheften
            nur, wenn die Lehrkraft dem Kind „Internet“ erlaubt.
          </p>
          {error && (
            <p className="fehler" role="alert">
              {error}
            </p>
          )}
          <div className="dialog-actions">
            <button type="button" className="knopf" onClick={onClose}>
              Abbrechen
            </button>
            <button className="knopf knopf-haupt" disabled={busy}>
              {busy ? 'Wird geladen …' : 'Einfügen'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
