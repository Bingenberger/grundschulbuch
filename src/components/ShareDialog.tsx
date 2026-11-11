'use client';
import { Picker } from './ui/Choice';
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
        <Picker
          label="Was möchtest du weitergeben?"
          name="Inhalt zum Weitergeben"
          value={source}
          onChange={setSource}
          options={[
            { value: 'book', label: 'Dieses Heft', icon: 'reading_ebook' },
            ...templates
              .filter((t) => !t.school)
              .map((t) => ({ value: t.id, label: `Vorlage: ${t.title}`, icon: 'template' as const })),
          ]}
        />
        {colleagues.length > 0 && (
          <Picker
            label="An wen?"
            name="Empfangende Lehrkraft"
            value={recipient}
            onChange={setRecipient}
            options={colleagues.map((c) => ({ value: c.id, label: c.name, icon: 'businesswoman' as const }))}
          />
        )}
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
