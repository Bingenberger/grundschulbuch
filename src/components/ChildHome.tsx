'use client';
import Icon from './Icon';
import { useState } from 'react';
import Link from 'next/link';
import { childApi } from '@/lib/child-api';
import type { BookSummary, BookData } from '@/lib/notebook-model';
import QrScanner from './QrScanner';
import ScaledPage from './ScaledPage';
export default function ChildHome({
  name,
  books,
  startScanner = false,
}: {
  name?: string;
  books: BookSummary[];
  startScanner?: boolean;
}) {
  const [scanner, setScanner] = useState(startScanner);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  async function login(values: object) {
    setBusy(true);
    try {
      await childApi('login', values);
      window.location.replace('/kinder');
    } catch (e) {
      setError((e as Error).message);
      throw e;
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="child-home">
      <header className="child-header">
        <Link href="/kinder" className="brand">
          ▤ Grundschulbuch
        </Link>
        <button className="knopf" onClick={() => setScanner(true)}>
          <Icon name={name ? 'conference_call' : 'camera'} size={26} />{' '}
          {name ? 'Kind wechseln' : 'Karte scannen'}
        </button>
        {name && (
          <button
            className="knopf knopf-haupt"
            onClick={async () => {
              await childApi('logout');
              window.location.replace('/kinder');
            }}
          >
            <Icon name="ok" size={24} /> Fertig
          </button>
        )}
      </header>
      <div className="child-home-body">
        <h1>{name ? `Hallo ${name}!` : 'Dein Heft wartet auf dich.'}</h1>
        <p>
          {name
            ? 'Welches Heft möchtest du öffnen?'
            : 'Tippe auf „Karte scannen“ und halte deine Karte vor die Kamera.'}
        </p>
        {!name && (
          <>
            <button className="child-login" onClick={() => setScanner(true)}>
              <Icon name="camera" size={64} />Karte scannen
            </button>
            <form
              className="help-login"
              onSubmit={(e) => {
                e.preventDefault();
                void login({ code }).catch(() => undefined);
              }}
            >
              <label>
                Hilfscode von deiner Lehrkraft
                <input
                  aria-label="Hilfscode"
                  inputMode="numeric"
                  pattern="[0-9]{8}"
                  maxLength={8}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                />
              </label>
              <button className="knopf" disabled={busy || code.length !== 8}>
                Mit Hilfscode anmelden
              </button>
            </form>
            <p>
              <Link className="sidebar-link" href="/anmelden">
                Anmeldung für Lehrkräfte
              </Link>
            </p>
          </>
        )}
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
        {name && (
          <div className="child-books">
            {books.map((book) => (
              <article className="child-book" key={book.id}>
                <Link href={`/kinder/heft/${book.id}`}>
                  <div style={{ borderTopColor: book.color }}>
                    <ScaledPage page={book.preview} decorative />
                  </div>
                  <strong>{book.title}</strong>
                </Link>
                <button
                  className="sidebar-link"
                  onClick={async () => {
                    if (
                      confirm(
                        'Dieses Heft in den Papierkorb legen? Deine Lehrkraft kann es zurückholen.',
                      )
                    ) {
                      try {
                        await childApi('trash', { id: book.id });
                        window.location.reload();
                      } catch (e) {
                        setError((e as Error).message);
                      }
                    }
                  }}
                >
                  In den Papierkorb
                </button>
              </article>
            ))}
            <button
              className="new-book"
              disabled={busy}
              onClick={async () => {
                const title = prompt('Wie heißt dein neues Heft?');
                if (!title?.trim()) return;
                setBusy(true);
                try {
                  const data = await childApi<BookData>('create', { title });
                  window.location.assign(`/kinder/heft/${data.book.id}`);
                } catch (e) {
                  setError((e as Error).message);
                  setBusy(false);
                }
              }}
            >
              <Icon name="plus" size={56} />
              <strong>Mein neues Heft</strong>
            </button>
          </div>
        )}
      </div>
      {scanner && (
        <QrScanner
          onClose={() => setScanner(false)}
          onDigest={async (digest) => login({ digest })}
        />
      )}
    </main>
  );
}
