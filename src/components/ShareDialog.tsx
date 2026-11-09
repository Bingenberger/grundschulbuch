'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/client-api';
import type { PublicAccount } from '@/lib/accounts.mjs';
import type { Template } from '@/lib/notebook-model';
export default function ShareDialog({
  bookId,
  templates,
  onClose,
}: {
  bookId: string;
  templates: Template[];
  onClose: () => void;
}) {
  const [colleagues, setColleagues] = useState<PublicAccount[]>([]);
  const [recipient, setRecipient] = useState('');
  const [source, setSource] = useState('book');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    api<PublicAccount[]>('colleagues')
      .then((data) => {
        setColleagues(data);
        setRecipient(data[0]?.id || '');
      })
      .catch((e) => setMessage(e.message));
  }, []);
  return (
    <div className="modal-backdrop">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
      >
        <h2 id="share-title">Im Kollegium weitergeben</h2>
        <p>Die Lehrkraft erhält eine eigene, unabhängig bearbeitbare Kopie.</p>
        <label className="property-label">
          Was möchtest du weitergeben?
          <select
            aria-label="Inhalt zum Weitergeben"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="book">Dieses Heft</option>
            {templates
              .filter((t) => !t.school)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  Vorlage: {t.title}
                </option>
              ))}
          </select>
        </label>
        <label className="property-label">
          An wen?
          <select
            aria-label="Empfangende Lehrkraft"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            {colleagues.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        {!colleagues.length && (
          <p>
            Es gibt noch keine weitere Lehrkraft. Neue Konten legt die
            Administration mit dem Bootstrap-Skript an.
          </p>
        )}
        {message && <p role="status">{message}</p>}
        <div className="dialog-actions">
          <button className="knopf" onClick={onClose}>
            Schließen
          </button>
          <button
            className="knopf knopf-haupt"
            disabled={!recipient || busy}
            onClick={async () => {
              setBusy(true);
              try {
                if (source === 'book')
                  await api('share', { id: bookId, recipientId: recipient });
                else
                  await api('shareTemplate', {
                    templateId: source,
                    recipientId: recipient,
                  });
                setMessage('Die Kopie liegt jetzt im Regal der Lehrkraft.');
              } catch (e) {
                setMessage((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            Kopie weitergeben
          </button>
        </div>
      </section>
    </div>
  );
}
