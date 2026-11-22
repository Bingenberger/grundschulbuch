'use client';
import Icon from './Icon';
import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { api } from '@/lib/client-api';
import type { Folder } from '@/lib/notebooks.mjs';
import type { BookData, BookSummary, Notebook } from '@/lib/notebook-model';
import ScaledPage from './ScaledPage';
import FileDialog from './FileDialog';
import SaveDialog from './SaveDialog';
import HelpDialog from './HelpDialog';
import LogoutButton from '@/app/LogoutButton';
import { FolderGlyph, MenuItem, PopMenu } from './ui/PopMenu';
const colors = [
  '#52796f',
  '#c48057',
  '#637ca5',
  '#9b7198',
  '#c7a24b',
  '#657b57',
];
/** Neue Ordner bekommen der Reihe nach eine eigene Farbe. */
const folderColors = ['#52796f', '#e09f3e', '#637ca5', '#c05d7b', '#7a9e3a', '#8e6fb5', '#d1704b', '#3d9aa8'];
// Ansicht und Sortierung merkt sich das Gerät.
// Ohne Speicher (privates Fenster) gilt die Wahl bis zum Neuladen.
const regalListeners = new Set<() => void>();
const regalChosen = new Map<string, string>();
function readRegal(key: string) {
  try {
    return localStorage.getItem(`regal.${key}`) ?? regalChosen.get(key) ?? null;
  } catch {
    return regalChosen.get(key) ?? null;
  }
}
function rememberRegal(key: string, value: string) {
  regalChosen.set(key, value);
  try {
    localStorage.setItem(`regal.${key}`, value);
  } catch {}
  regalListeners.forEach((l) => l());
}
function subscribeRegal(listener: () => void) {
  regalListeners.add(listener);
  return () => regalListeners.delete(listener);
}

export default function Shelf({
  initialBooks,
  name,
  admin = false,
}: {
  initialBooks: BookSummary[];
  name: string;
  /** Shows the link to the admin area. */
  admin?: boolean;
}) {
  const [books, setBooks] = useState(initialBooks);
  const [showFiles, setShowFiles] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  // „Speichern und teilen“ für ein Heft, ohne es zu öffnen
  const [saving, setSaving] = useState<BookData | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]),
    [folder, setFolder] = useState('all');
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const view = useSyncExternalStore(subscribeRegal, () => readRegal('view') === 'list' ? 'list' : 'grid', () => 'grid');
  const sort = useSyncExternalStore(subscribeRegal, () => readRegal('sort') === 'name' ? 'name' : 'recent', () => 'recent');
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
  async function openSave(book: BookSummary) {
    setBusy(true);
    setError('');
    try {
      setSaving(await api<BookData>('open', { id: book.id }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
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
        const data = await api<BookData>('create', { title, color, orientation: 'landscape' });
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
  async function createFolder(title: string) {
    if (title.trim())
      await folderTask(async () => {
        const f = await api<Folder>('folder', { title: title.trim(), color: folderColors[folders.length % folderColors.length] });
        setFolders((current) => [...current, f]);
        setFolder(f.id);
      });
  }
  async function renameFolder(f: Folder, title: string) {
    if (title.trim() && title.trim() !== f.title)
      await folderTask(async () => {
        await api('folder', { folderId: f.id, title: title.trim() });
        setFolders(await api<Folder[]>('folders'));
      });
  }
  async function deleteFolder(f: Folder) {
    if (confirm(`Ordner „${f.title}“ entfernen? Die Hefte bleiben im Regal.`))
      await folderTask(async () => {
        await api('removeFolder', { folderId: f.id });
        setFolders(await api<Folder[]>('folders'));
        setBooks(await api<BookSummary[]>('list'));
        setFolder('all');
      });
  }
  const newBook = () => {
    setDialog({ type: 'new' });
    setTitle('');
    setColor(colors[books.length % colors.length]);
  };
  const needle = query.toLocaleLowerCase('de');
  const inFolder = (b: BookSummary) =>
    folder === 'all' ? true : folder === 'none' ? !b.folderId || !folders.some((f) => f.id === b.folderId) : b.folderId === folder;
  const shown = books
    .filter((b) => inFolder(b) && b.title.toLocaleLowerCase('de').includes(needle))
    .sort((a, b) => (sort === 'name' ? a.title.localeCompare(b.title, 'de') : b.updatedAt.localeCompare(a.updatedAt)));
  const current = folders.find((f) => f.id === folder);
  const heading = folder === 'all' ? 'Alle Hefte' : folder === 'none' ? 'Ohne Ordner' : current?.title || 'Ordner';
  const count = (id: string) =>
    books.filter((b) => (id === 'all' ? true : id === 'none' ? !b.folderId || !folders.some((f) => f.id === b.folderId) : b.folderId === id)).length;
  const dropOn = (folderId: string | null) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).classList.add('is-drop');
    },
    onDragLeave: (e: React.DragEvent) => (e.currentTarget as HTMLElement).classList.remove('is-drop'),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).classList.remove('is-drop');
      const book = books.find((b) => b.id === e.dataTransfer.getData('text/plain'));
      if (book && (book.folderId || null) !== folderId) void moveBook(book, folderId);
    },
  });
  const folderTitle = (b: BookSummary) => folders.find((f) => f.id === b.folderId)?.title;
  const bookMenu = (book: BookSummary) => (
    <PopMenu label={`${book.title}: mehr`}>
      {(close) => (
        <>
          <MenuItem icon="buntstift" onClick={() => { close(); setDialog({ type: 'rename', book }); setTitle(book.title); setColor(book.color); }}>Umbenennen</MenuItem>
          <MenuItem icon="stack_of_photos" onClick={() => { close(); void duplicate(book); }}>Duplizieren</MenuItem>
          <MenuItem icon="speichern" label={`${book.title} speichern`} onClick={() => { close(); void openSave(book); }}>Speichern …</MenuItem>
          <div className="pop-menu-title">In Ordner legen</div>
          <MenuItem icon="cancel" pressed={!book.folderId} onClick={() => { close(); void moveBook(book, null); }}>Ohne Ordner</MenuItem>
          {folders.map((f) => (
            <MenuItem key={f.id} icon={<FolderGlyph color={f.color} />} pressed={book.folderId === f.id} onClick={() => { close(); void moveBook(book, f.id); }}>{f.title}</MenuItem>
          ))}
          <hr />
          <MenuItem icon="empty_trash" danger label={`${book.title} löschen`} onClick={() => { close(); setDialog({ type: 'delete', book }); }}>Löschen</MenuItem>
        </>
      )}
    </PopMenu>
  );
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
          {admin && (
            <Link href="/verwaltung" className="icon-link">
              <Icon name="settings" size={24} /> Verwaltung
            </Link>
          )}
          <button type="button" className="icon-link help-link" onClick={() => setShowHelp(true)}>
            <Icon name="questions" size={24} /> Hilfe
          </button>
          <span>{name}</span>
          <LogoutButton />
        </div>
      </header>
      <div className="shelf-body">
        <div className="shelf-heading">
          <div>
            <h1>
              Mein Regal<span className="title-dot">.</span>
            </h1>
            <p>
              {books.length} {books.length === 1 ? 'Heft' : 'Hefte'} · nur für dich
            </p>
          </div>
          <div className="shelf-heading-actions">
            <button className="knopf" onClick={() => setShowFiles(true)}>
              <Icon name="opened_folder" size={22} /> Heft, ePub oder PDF öffnen
            </button>
            <button className="knopf knopf-haupt" onClick={newBook}>
              <Icon name="plus" size={22} /> Neues Heft
            </button>
          </div>
        </div>
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
        <div className="shelf-layout">
          <nav className="shelf-folders" aria-label="Ordner">
            <button type="button" className="folder-row" aria-pressed={folder === 'all'} onClick={() => setFolder('all')}>
              <Icon name="library" size={20} /> <span>Alle Hefte</span> <small>{count('all')}</small>
            </button>
            <button type="button" className="folder-row" aria-pressed={folder === 'none'} onClick={() => setFolder('none')} {...dropOn(null)}>
              <Icon name="document" size={20} /> <span>Ohne Ordner</span> <small>{count('none')}</small>
            </button>
            <h2>Ordner</h2>
            {folders.map((f) =>
              renaming === f.id ? (
                <form
                  key={f.id}
                  className="folder-row is-editing"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const value = new FormData(e.currentTarget).get('title') as string;
                    setRenaming(null);
                    void renameFolder(f, value);
                  }}
                >
                  <FolderGlyph color={f.color} />
                  <input name="title" aria-label={`Neuer Name für ${f.title}`} defaultValue={f.title} maxLength={80} autoFocus onBlur={(e) => e.currentTarget.form?.requestSubmit()} onKeyDown={(e) => e.key === 'Escape' && setRenaming(null)} />
                </form>
              ) : (
                <div key={f.id} className="folder-item" {...dropOn(f.id)}>
                  <button type="button" className="folder-row" aria-pressed={folder === f.id} onClick={() => setFolder(f.id)}>
                    <FolderGlyph color={f.color} /> <span>{f.title}</span> <small>{count(f.id)}</small>
                  </button>
                  <PopMenu label={`Ordner ${f.title}: mehr`} small>
                    {(close) => (
                      <>
                        <MenuItem icon="buntstift" label={`Ordner ${f.title} umbenennen`} onClick={() => { close(); setRenaming(f.id); }}>Umbenennen</MenuItem>
                        <MenuItem icon="empty_trash" danger label={`Ordner ${f.title} löschen`} onClick={() => { close(); void deleteFolder(f); }}>Ordner entfernen</MenuItem>
                      </>
                    )}
                  </PopMenu>
                </div>
              ),
            )}
            {creating ? (
              <form
                className="folder-row is-editing"
                onSubmit={(e) => {
                  e.preventDefault();
                  const value = new FormData(e.currentTarget).get('title') as string;
                  setCreating(false);
                  void createFolder(value);
                }}
              >
                <FolderGlyph color="#9aa9a0" />
                <input name="title" aria-label="Name des neuen Ordners" placeholder="Name des Ordners" maxLength={80} autoFocus onBlur={(e) => (e.currentTarget.value.trim() ? e.currentTarget.form?.requestSubmit() : setCreating(false))} onKeyDown={(e) => e.key === 'Escape' && setCreating(false)} />
              </form>
            ) : (
              <button type="button" className="folder-row folder-new" onClick={() => setCreating(true)}>
                <Icon name="plus" size={18} /> <span>Neuer Ordner</span>
              </button>
            )}
            {folders.length > 0 && <p className="folder-hint">Hefte lassen sich auf einen Ordner ziehen.</p>}
          </nav>
          <section className="shelf-main" aria-label={heading}>
            <div className="shelf-toolbar">
              <h2>
                {heading} <small>{shown.length}</small>
              </h2>
              <label className="search">
                <Icon name="search" size={20} />
                <input aria-label="Hefte suchen" placeholder="Ein Heft suchen …" value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
              <div className="shelf-switch" role="group" aria-label="Sortieren">
                <button type="button" aria-pressed={sort === 'recent'} onClick={() => rememberRegal('sort', 'recent')}>
                  <Icon name="clock" size={18} /> Zuletzt
                </button>
                <button type="button" aria-pressed={sort === 'name'} onClick={() => rememberRegal('sort', 'name')}>
                  <Icon name="list" size={18} /> A–Z
                </button>
              </div>
              <div className="shelf-switch" role="group" aria-label="Ansicht">
                <button type="button" aria-pressed={view === 'grid'} onClick={() => rememberRegal('view', 'grid')}>
                  <Icon name="grid" size={18} /> Kacheln
                </button>
                <button type="button" aria-pressed={view === 'list'} onClick={() => rememberRegal('view', 'list')}>
                  <Icon name="todo_list" size={18} /> Liste
                </button>
              </div>
            </div>
            <div className={view === 'list' ? 'book-list' : 'book-grid'}>
              {shown.map((book) => (
                <article
                  className="book-card"
                  key={book.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', book.id)}
                  style={{ '--book': book.color } as React.CSSProperties}
                >
                  <Link className="book-cover" href={`/heft/${book.id}`} tabIndex={-1} aria-hidden="true">
                    <span className={`cover-preview ${book.preview.orientation}`}>
                      <ScaledPage page={book.preview} decorative />
                    </span>
                  </Link>
                  <div className="book-caption">
                    <Link href={`/heft/${book.id}`}>{book.title}</Link>
                    <p>
                      {book.pageIds.length} {book.pageIds.length === 1 ? 'Seite' : 'Seiten'} · {new Date(book.updatedAt).toLocaleDateString('de-DE')}
                      {folder === 'all' && folderTitle(book) && (
                        <span className="book-folder-tag">
                          <FolderGlyph color={folders.find((f) => f.id === book.folderId)!.color} /> {folderTitle(book)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="book-actions">{bookMenu(book)}</div>
                </article>
              ))}
              {!query && (
                <button className="new-book" onClick={newBook}>
                  <Icon name="plus" size={28} />
                  <strong>Eine neue Idee?</strong>
                  <small>Lege ein leeres Heft an.</small>
                </button>
              )}
            </div>
            {query && !shown.length && <p className="leer">Kein Heft mit diesem Namen gefunden.</p>}
            {!query && !shown.length && folder !== 'all' && <p className="leer">In diesem Ordner liegt noch kein Heft. Ziehe ein Heft hierher oder lege es über „Mehr“ in den Ordner.</p>}
          </section>
        </div>
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
      {showHelp && <HelpDialog onClose={() => setShowHelp(false)} />}
      {saving && (
        <SaveDialog
          book={saving.book}
          pages={saving.pages}
          onRename={async (title) => {
            const saved = await api<Notebook>('update', { id: saving.book.id, revision: saving.book.revision, title });
            setSaving({ ...saving, book: saved });
            setBooks((list) => list.map((b) => (b.id === saved.id ? { ...b, ...saved } : b)));
          }}
          onClose={() => setSaving(null)}
        />
      )}
    </main>
  );
}
