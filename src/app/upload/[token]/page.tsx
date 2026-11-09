'use client';
import { use, useState } from 'react';
export default function Upload({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <main className="seite">
      <section className="karte anmeldung">
        <h1>Ein Bild ins Heft</h1>
        <p>
          Wähle ein Bild oder fotografiere dein Arbeitsmaterial. Es erscheint
          anschließend am anderen Gerät.
        </p>
        <label className="knopf knopf-haupt">
          {busy ? 'Bild wird übertragen …' : 'Bild auswählen / fotografieren'}
          <input
            className="visually-hidden"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setMessage('');
              try {
                if (file.size > 12 * 1024 * 1024)
                  throw new Error('Das Bild darf höchstens 12 MB groß sein.');
                const response = await fetch(
                  `/api/transfer?token=${encodeURIComponent(token)}`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': file.type },
                    body: file,
                  },
                );
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                setMessage(
                  '✓ Das Bild ist angekommen. Du kannst ein weiteres hinzufügen.',
                );
              } catch (error) {
                setMessage((error as Error).message);
              } finally {
                setBusy(false);
                e.target.value = '';
              }
            }}
          />
        </label>
        <p role="status">{message}</p>
        <small>
          Der Link gilt zehn Minuten. PNG, JPEG oder WebP, bis 12 MB.
        </small>
      </section>
    </main>
  );
}
