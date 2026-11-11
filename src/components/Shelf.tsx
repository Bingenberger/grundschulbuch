'use client';
import Icon from './Icon';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/client-api';
import type { Folder } from '@/lib/notebooks.mjs';
import type { BookData, BookSummary, Notebook } from '@/lib/notebook-model';
import ScaledPage from './ScaledPage';
import FileDialog from './FileDialog';
import LogoutButton from '@/app/LogoutButton';
const colors = [
  '#52796f',
  '#c48057',
  '#637ca5',
  '#9b7198',
  '#c7a24b',
  '#657b57',
];
export default function Shelf({
  initialBooks,
  name,
}: {
  initialBooks: BookSummary[];
  name: string;
}) {
  const [books, setBooks] = useState(initialBooks);
  const [showFiles, setShowFiles] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]),
    [folder, setFolder] = useState('all');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    api<Folder[]>('folders')
      .then(setFolders)
      .catch((e) => setError(e.message));
  }, []);

  const [dialog, setDialog] = useState<{
    type: 'new' | 'rename' | 'delete';
    book?: BookSummary;
  } | null>(null);
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(colors[0]);
  async function duplicate(book: BookSummary) {
    setBusy(true);
    setError('');
    try {
      await api<BookData>('duplicate', { id: book.id });
      setBooks(await api<BookSummary[]>('list'));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (dialog?.type === 'new') {
        const data = await api<BookData>('create', { title, color });
        window.location.assign(`/heft/${data.book.id}`);
        return;
      }
      if (dialog?.type === 'rename' && dialog.book) {
        const book = await api<Notebook>('update', {
          id: dialog.book.id,
          revision: dialog.book.revision,
          title,
          color,
        });
        setBooks(books.map((b) => (b.id === book.id ? { ...b, ...book } : b)));
      }
      if (dialog?.type === 'delete' && dialog.book) {
        await api('delete', { id: dialog.book.id });
        setBooks(books.filter((b) => b.id !== dialog.book?.id));
      }
      setDialog(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function folderTask(task: () => Promise<void>) {
    try {
      await task();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function moveBook(book: BookSummary, folderId: string | null) {
    await folderTask(async () => {
      const saved = await api<Notebook>('update', {
        id: book.id,
        revision: book.revision,
        folderId,
      });
      setBooks((current) =>
        current.map((b) => (b.id === book.id ? { ...b, ...saved } : b)),
      );
    });
  }
  async function createFolder() {
    const title = prompt('Wie heißt der neue Ordner?');
    if (title?.trim())
      await folderTask(async () => {
        const f = await api<Folder>('folder', { title });
        setFolders((current) => [...current, f]);
        setFolder(f.id);
      });
  }
  async function renameFolder(f: Folder) {
    const title = prompt('Ordnername', f.title);
    if (title?.trim())
      await folderTask(async () => {
        await api('folder', { folderId: f.id, title });
        setFolders(await api<Folder[]>('folders'));
      });
  }
  async function deleteFolder(f: Folder) {
    if (confirm('Ordner entfernen? Die Hefte bleiben im Regal.'))
      await folderTask(async () => {
        await api('removeFolder', { folderId: f.id });
        setFolders(await api<Folder[]>('folders'));
        setBooks(await api<BookSummary[]>('list'));
        setFolder('all');
      });
  }
  return (
    <main className="shelf">
      <header className="app-header">
        <Link href="/" className="brand">
          <span className="brand-icon">▤</span> Grundschulbuch
        </Link>
        <div className="account">
          <Link href="/klassen" className="icon-link">
            <Icon name="conference_call" size={24} /> Meine Klassen
          </Link>
          <span>{name}</span>
          <LogoutButton />
        </div>
      </header>
      <div className="shelf-body">
        <div className="eyebrow">DEIN PLATZ FÜR GUTE IDEEN</div>
        <div className="shelf-heading">
          <div>
            <h1>
              Mein Regal<span className="title-dot">.</span>
            </h1>
            <p>Aus einer leeren Seite wird ein kleines Stück Lernen.</p>
          </div>
          <button
            className="knopf knopf-haupt"
            onClick={() => {
              setDialog({ type: 'new' });
              setTitle('');
              setColor(colors[books.length % colors.length]);
            }}
          >
            <Icon name="plus" size={22} /> Neues Heft
          </button>
        </div>
        <button className="knopf" onClick={() => setShowFiles(true)}>
          <Icon name="opened_folder" size={22} /> Heft, ePub oder PDF öffnen
        </button>
        <div className="shelf-filter">
          <label className="search">
            <Icon name="search" size={20} />
            <input
              aria-label="Hefte suchen"
              placeholder="Ein Heft suchen …"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <span>
            {books.length} {books.length === 1 ? 'Heft' : 'Hefte'} · nur für
            dich
          </span>
        </div>
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
        <div className="folder-bar">
          <button
            className="knopf compact"
            aria-pressed={folder === 'all'}
            onClick={() => setFolder('all')}
          >
            Alle Hefte
          </button>
          <button
            className="knopf compact"
            aria-pressed={folder === 'none'}
            onClick={() => setFolder('none')}
          >
            Ohne Ordner
          </button>
          {folders.map((f) => (
            <div
              key={f.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const book = books.find(
                  (b) => b.id === e.dataTransfer.getData('text/plain'),
                );
                if (book) void moveBook(book, f.id);
              }}
            >
              <button
                className="knopf compact"
                aria-pressed={folder === f.id}
                onClick={() => setFolder(f.id)}
              >
                <Icon name="folder" size={18} /> {f.title}
              </button>
              <button
                className="folder-edit"
                aria-label={`Ordner ${f.title} umbenennen`}
                onClick={() => void renameFolder(f)}
              >
                ✎
              </button>
              <button
                className="folder-edit"
                aria-label={`Ordner ${f.title} löschen`}
                onClick={() => void deleteFolder(f)}
              >
                ×
              </button>
            </div>
          ))}
          <button className="knopf compact" onClick={() => void createFolder()}>
            <Icon name="folder" size={18} /> Neuer Ordner
          </button>
        </div>
        <div className="book-grid">
          {books
            .filter((b) =>
              folder === 'all' || folder === 'none'
                ? !b.folderId || folder === 'all'
                : b.folderId === folder,
            )
            .filter((b) =>
              b.title
                .toLocaleLowerCase('de')
                .includes(query.toLocaleLowerCase('de')),
            )
            .map((book) => (
              <article
                className="book-card"
                key={book.id}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData('text/plain', book.id)
                }
              >
                <Link
                  className="book-cover"
                  href={`/heft/${book.id}`}
                  style={{ background: book.color }}
                >
                  <span className="book-binding" />
                  <div className="book-label">
                    <span>GRUNDSCHULBUCH</span>
                    <strong>{book.title}</strong>
                    <small>
                      {book.pageIds.length}{' '}
                      {book.pageIds.length === 1 ? 'Seite' : 'Seiten'} · A4
                    </small>
                  </div>
                  <div className="cover-preview">
                    <ScaledPage page={book.preview} decorative />
                  </div>
                </Link>
                <div className="book-caption">
                  <Link href={`/heft/${book.id}`}>{book.title}</Link>
                  <p>
                    Bearbeitet am{' '}
                    {new Date(book.updatedAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <div className="book-actions">
                  <select
                    aria-label={`Ordner für ${book.title}`}
                    value={book.folderId || ''}
                    onChange={async (e) => {
                      try {
                        const saved = await api<Notebook>('update', {
                          id: book.id,
                          revision: book.revision,
                          folderId: e.target.value || null,
                        });
                        setBooks(
                          books.map((b) =>
                            b.id === book.id ? { ...b, ...saved } : b,
                          ),
                        );
                      } catch (e) {
                        setError((e as Error).message);
                      }
                    }}
                  >
                    <option value="">Ohne Ordner</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setDialog({ type: 'rename', book });
                      setTitle(book.title);
                      setColor(book.color);
                    }}
                    disabled={busy}
                  >
                    Umbenennen
                  </button>
                  <button onClick={() => duplicate(book)} disabled={busy}>
                    Duplizieren
                  </button>
                  <button
                    aria-label={`${book.title} löschen`}
                    onClick={() => setDialog({ type: 'delete', book })}
                    disabled={busy}
                  >
                    Löschen
                  </button>
                </div>
              </article>
            ))}
          <button
            className="new-book"
            onClick={() => {
              setDialog({ type: 'new' });
              setTitle('');
            }}
          >
            <Icon name="idea" size={56} />
            <strong>Eine neue Idee?</strong>
            <small>Lege ein leeres Heft an.</small>
          </button>
        </div>
        {books.length > 0 &&
          !books.some((b) =>
            b.title
              .toLocaleLowerCase('de')
              .includes(query.toLocaleLowerCase('de')),
          ) && <p className="leer">Kein Heft mit diesem Namen gefunden.</p>}
        <footer className="shelf-footer">
          <span>Für kleine Schritte und große Entdeckungen.</span>
          <span>Deine Hefte bleiben auf dem Schulserver.</span>
        </footer>
      </div>
      {dialog && (
        <div className="modal-backdrop">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className="modal"
          >
            <form onSubmit={submit}>
              <h2 id="dialog-title">
                {dialog.type === 'new'
                  ? 'Ein neues Heft'
                  : dialog.type === 'delete'
                    ? 'Heft löschen?'
                    : 'Heft gestalten'}
              </h2>
              {dialog.type === 'delete' ? (
                <p>
                  „{dialog.book?.title}“ und alle Seiten werden endgültig
                  gelöscht.
                </p>
              ) : (
                <>
                  <label className="feld">
                    <span>Name des Hefts</span>
                    <input
                      autoFocus
                      required
                      maxLength={120}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Zum Beispiel: Unsere Buchstaben"
                    />
                  </label>
                  <div className="color-choices" aria-label="Umschlagfarbe">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Farbe ${c}`}
                        aria-pressed={color === c}
                        style={{ background: c }}
                        onClick={() => setColor(c)}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="dialog-actions">
                <button
                  type="button"
                  className="knopf"
                  disabled={busy}
                  onClick={() => setDialog(null)}
                >
                  Abbrechen
                </button>
                <button
                  className={`knopf ${dialog.type === 'delete' ? 'danger' : 'knopf-haupt'}`}
                  disabled={busy}
                >
                  {busy
                    ? 'Einen Moment …'
                    : dialog.type === 'delete'
                      ? 'Endgültig löschen'
                      : dialog.type === 'new'
                        ? 'Heft anlegen'
                        : 'Speichern'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      {showFiles && <FileDialog onClose={() => setShowFiles(false)} />}
    </main>
  );
}
