/* eslint-disable @next/next/no-img-element */
'use client';
import Icon from './Icon';
import { Choices, Picker } from './ui/Choice';
import FeatureSwitches from './FeatureSwitches';
import { CHILD_DEFAULTS } from '@/lib/child-features.mjs';
import { uuid } from '@/lib/notebook-model';
import { useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { classApi, qrDigest } from '@/lib/child-api';
import { api, uploadImage } from '@/lib/client-api';
import type { SchoolClass, Child } from '@/lib/classes.mjs';
import type { BookSummary } from '@/lib/notebook-model';
import QrScanner from './QrScanner';
export default function Classroom({
  initialClasses,
  books,
}: {
  initialClasses: SchoolClass[];
  books: BookSummary[];
}) {
  const [classes, setClasses] = useState(initialClasses);
  const [activeId, setActiveId] = useState(initialClasses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [childName, setChildName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [scanChild, setScanChild] = useState<Child | 'batch' | null>(null);
  const [pendingDigest, setPendingDigest] = useState('');
  const [weak, setWeak] = useState(false);
  const [card, setCard] = useState<{ name: string; qr: string } | null>(null);
  const [childBooks, setChildBooks] = useState<{
    child: Child;
    books: BookSummary[];
  } | null>(null);
  const [bookId, setBookId] = useState(books[0]?.id || '');
  const [allowPages, setAllowPages] = useState(false);
  const [allowAudio, setAllowAudio] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [featureChild, setFeatureChild] = useState('');
  const active = classes.find((c) => c.id === activeId);
  async function run(task: () => Promise<void>) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await task();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function change(values: object) {
    const next = await classApi<SchoolClass>('change', {
      id: activeId,
      ...values,
    });
    setClasses((current) => current.map((c) => (c.id === next.id ? next : c)));
  }
  async function assign(child: Child, digest: string) {
    await change({ childId: child.id, digest });
    setPendingDigest('');
    setMessage(`Karte für ${child.name} zugeordnet.`);
  }
  return (
    <main className="seite class-page">
      <header className="kopf">
        <div>
          <Link href="/">‹ Mein Regal</Link>
          <h1>Meine Klassen</h1>
        </div>
        <Link className="knopf" href="/kinder">
          <Icon name="camera" size={22} /> Kinder-Anmeldung öffnen
        </Link>
      </header>
      <div className="class-create">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              const klass = await classApi<SchoolClass>('create', { title });
              setClasses([...classes, klass]);
              setActiveId(klass.id);
              setTitle('');
            });
          }}
        >
          <input
            aria-label="Name der neuen Klasse"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            placeholder="Neue Klasse, z. B. 1a"
            required
          />
          <button className="knopf knopf-haupt" disabled={busy}>
            Klasse anlegen
          </button>
        </form>
      </div>
      <nav className="reiter class-tabs" aria-label="Klassen">
        {classes.map((c) => (
          <button
            key={c.id}
            className="knopf"
            aria-pressed={activeId === c.id}
            onClick={() => {
              setActiveId(c.id);
              setChildBooks(null);
              setSelectedChildren([]);
            }}
          >
            {c.title}
            {c.archived ? ' · archiviert' : ''}
          </button>
        ))}
      </nav>
      {error && (
        <p className="fehler" role="alert">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      {active && (
        <>
          <section className="karte">
            <header className="kopf">
              <h2>{active.title}</h2>
              <button
                className="knopf"
                disabled={busy}
                onClick={() =>
                  run(() => change({ archived: !active.archived }))
                }
              >
                {active.archived ? 'Klasse aktivieren' : 'Archivieren'}
              </button>
            </header>
            <form
              className="child-create"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  await change({ addChild: childName });
                  setChildName('');
                });
              }}
            >
              <input
                aria-label="Vorname oder Kürzel"
                value={childName}
                maxLength={60}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Vorname oder Kürzel"
                required
              />
              <button className="knopf" disabled={busy}>
                <Icon name="plus" size={20} /> Kind hinzufügen
              </button>
              <button
                className="knopf"
                type="button"
                onClick={() => setScanChild('batch')}
              >
                Klasse einscannen
              </button>
            </form>
            <div className="child-list">
              {active.children.map((child) => (
                <article key={child.id} className="child-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedChildren.includes(child.id)}
                      onChange={(e) =>
                        setSelectedChildren(
                          e.target.checked
                            ? [...selectedChildren, child.id]
                            : selectedChildren.filter((id) => id !== child.id),
                        )
                      }
                    />{' '}
                    <strong>{child.name}</strong>
                  </label>
                  <small>
                    {child.hasCard ? '✓ Karte zugeordnet' : 'Noch keine Karte'}
                    {child.features ? ' · eigene Funktionen' : ''}
                  </small>
                  <div className="child-row-actions">
                    <button
                      className="knopf compact"
                      disabled={busy}
                      onClick={() => {
                        const name = prompt('Vorname oder Kürzel', child.name);
                        if (name?.trim())
                          void run(() =>
                            change({ childId: child.id, childName: name }),
                          );
                      }}
                    >
                      Umbenennen
                    </button>
                    <button
                      className="knopf compact danger-text"
                      disabled={busy}
                      onClick={() => {
                        if (
                          confirm(
                            `${child.name} und alle zugehörigen Hefte endgültig löschen? Benötigte Hefte bitte vorher als PDF exportieren.`,
                          )
                        )
                          void run(() => change({ removeChild: child.id }));
                      }}
                    >
                      Kind löschen
                    </button>
                    <button
                      className="knopf compact"
                      disabled={busy}
                      onClick={() => setScanChild(child)}
                    >
                      Karte scannen
                    </button>
                    <button
                      className="knopf compact"
                      disabled={busy}
                      onClick={() =>
                        run(async () => {
                          const value = `grundschulbuch:${uuid()}:${uuid()}`;
                          await assign(child, await qrDigest(value));
                          setCard({
                            name: child.name,
                            qr: await QRCode.toDataURL(value, {
                              width: 400,
                              margin: 3,
                            }),
                          });
                        })
                      }
                    >
                      Eigene QR-Karte
                    </button>
                    <button
                      className="knopf compact"
                      disabled={busy || !child.hasCard}
                      onClick={() => {
                        if (confirm(`Karte für ${child.name} ungültig machen?`))
                          void run(() =>
                            change({ childId: child.id, digest: null }),
                          );
                      }}
                    >
                      Karte sperren
                    </button>
                    <button
                      className="knopf compact"
                      disabled={busy}
                      onClick={() =>
                        run(async () => {
                          const result = await classApi<{ code: string }>(
                            'help',
                            { id: activeId, childId: child.id },
                          );
                          setMessage(
                            `Hilfscode für ${child.name}: ${result.code} · einmalig, zwei Minuten gültig.`,
                          );
                        })
                      }
                    >
                      Hilfscode
                    </button>
                    <button
                      className="knopf compact"
                      disabled={busy}
                      onClick={() =>
                        run(async () => {
                          setChildBooks({
                            child,
                            books: await classApi<BookSummary[]>('books', {
                              id: activeId,
                              childId: child.id,
                            }),
                          });
                        })
                      }
                    >
                      Hefte ansehen
                    </button>
                    <button
                      className="knopf compact"
                      aria-expanded={featureChild === child.id}
                      onClick={() => setFeatureChild(featureChild === child.id ? '' : child.id)}
                    >
                      <Icon name="settings" size={18} /> Funktionen
                    </button>
                  </div>
                  {featureChild === child.id && (
                    <div className="child-features">
                      <Choices
                        label={`Was ${child.name} im Heft sieht`}
                        value={child.features ? 'own' : 'class'}
                        disabled={busy}
                        onChange={(mode) =>
                          run(() =>
                            change({
                              childId: child.id,
                              features: mode === 'own' ? active.childFeatures ?? CHILD_DEFAULTS : null,
                            }),
                          )
                        }
                        options={[
                          { value: 'class', label: 'Wie die Klasse', icon: 'conference_call' },
                          { value: 'own', label: 'Eigene Auswahl', icon: 'businesswoman' },
                        ]}
                      />
                      {child.features && (
                        <FeatureSwitches
                          label={`Funktionen für ${child.name}`}
                          value={child.features}
                          disabled={busy}
                          onChange={(features) => run(() => change({ childId: child.id, features }))}
                        />
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
            {!active.children.length && (
              <p className="hinweis">
                Füge Kinder mit Vornamen oder Kürzel hinzu.
              </p>
            )}
          </section>
          <section className="karte class-section">
            <h2>Was die Kinder im Heft sehen</h2>
            <p>
              Gilt für alle Kinder der Klasse, die keine eigene Auswahl haben
              (unter „Funktionen“ beim Kind). Ton aufnehmen und Seiten
              hinzufügen werden beim Austeilen eines Hefts erlaubt.
            </p>
            <FeatureSwitches
              label="Funktionen für die Klasse"
              value={active.childFeatures ?? CHILD_DEFAULTS}
              disabled={busy}
              onChange={(childFeatures) => run(() => change({ childFeatures }))}
            />
            <button
              className="knopf compact"
              disabled={busy || (active.childFeatures ?? CHILD_DEFAULTS).join() === CHILD_DEFAULTS.join()}
              onClick={() => run(() => change({ childFeatures: CHILD_DEFAULTS }))}
            >
              <Icon name="synchronize" size={18} /> Standard wiederherstellen
            </button>
          </section>
          <section className="karte class-section">
            <h2>Ein Heft austeilen</h2>
            <p>
              Jedes Kind erhält eine eigene Kopie. Alle vorgegebenen Elemente
              sind gesperrt.
            </p>
            <Picker
              label="Heft"
              name="Heft zum Austeilen"
              value={bookId}
              onChange={setBookId}
              options={books.map((b) => ({ value: b.id, label: b.title, icon: 'reading_ebook' as const }))}
            />
            {!books.length && (
              <p className="hinweis">Lege zuerst im Regal ein Heft an, das du austeilen möchtest.</p>
            )}
            <label>
              <input
                type="checkbox"
                checked={allowPages}
                onChange={(e) => setAllowPages(e.target.checked)}
              />{' '}
              Kinder dürfen Seiten hinzufügen
            </label>
            <label style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={allowAudio}
                onChange={(e) => setAllowAudio(e.target.checked)}
              />{' '}
              Kinder dürfen Ton aufnehmen
            </label>
            <p className="hinweis">
              {selectedChildren.length
                ? `An ${selectedChildren.length} ausgewählte Kinder`
                : 'An die ganze Klasse'}
            </p>
            <button
              className="knopf knopf-haupt"
              disabled={
                busy || !bookId || active.archived || !active.children.length
              }
              onClick={() =>
                run(async () => {
                  await classApi('distribute', {
                    id: activeId,
                    bookId,
                    allowChildPages: allowPages,
                    allowChildAudio: allowAudio,
                    childIds: selectedChildren.length
                      ? selectedChildren
                      : undefined,
                  });
                  setMessage('Das Heft wurde ausgeteilt.');
                })
              }
            >
              Heft austeilen
            </button>
          </section>
          <section className="karte class-section">
            <h2>Freigegebene Bilder</h2>
            <p>Diese Sammlung dürfen die Kinder ohne Upload verwenden.</p>
            <label className="knopf">
              <Icon name="picture" size={20} /> Bild freigeben
              <input
                type="file"
                className="visually-hidden"
                accept="image/png,image/jpeg,image/webp"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    void run(async () => {
                      const src = await uploadImage(file);
                      await change({ images: [...active.images, src] });
                    });
                }}
              />
            </label>
            <div className="uploaded-images">
              {active.images.map((src) => (
                <button
                  key={src}
                  onClick={() =>
                    run(() =>
                      change({
                        images: active.images.filter((image) => image !== src),
                      }),
                    )
                  }
                  title="Aus der Sammlung entfernen"
                >
                  <img src={src} alt="Freigegebenes Bild entfernen" />
                </button>
              ))}
            </div>
          </section>
          <section className="class-section">
            <button
              className="knopf danger-text"
              disabled={busy}
              onClick={() => {
                if (
                  confirm(
                    `Klasse „${active.title}“, alle Kinder und deren Hefte endgültig löschen? Exportiere benötigte Hefte vorher als PDF.`,
                  )
                )
                  void run(async () => {
                    await classApi('delete', { id: activeId });
                    setClasses(classes.filter((c) => c.id !== activeId));
                    setActiveId('');
                  });
              }}
            >
              Klasse und Kinderhefte löschen
            </button>
          </section>
        </>
      )}
      {scanChild && (
        <QrScanner
          onClose={() => {
            setScanChild(null);
            setPendingDigest('');
          }}
          onDigest={async (digest, isWeak) => {
            setWeak(isWeak);
            if (isWeak || scanChild === 'batch') {
              setPendingDigest(digest);
              setScanChild(null);
            } else {
              await assign(scanChild, digest);
              setScanChild(null);
            }
          }}
        />
      )}
      {pendingDigest && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-title"
          >
            <h2 id="assign-title">Wem gehört diese Karte?</h2>
            {weak && (
              <p className="fehler">
                Dieser Code ist kurz oder leicht erratbar. Wir empfehlen eine
                eigene QR-Karte.
              </p>
            )}
            {active?.children.map((child) => (
              <button
                key={child.id}
                className="knopf"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await assign(child, pendingDigest);
                    setScanChild('batch');
                  })
                }
              >
                {child.name}
              </button>
            ))}
            <button className="knopf" onClick={() => setPendingDigest('')}>
              Abbrechen
            </button>
          </section>
        </div>
      )}
      {card && (
        <div className="modal-backdrop card-backdrop">
          <section
            className="modal printable-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-title"
          >
            <h2 id="card-title">Grundschulbuch · {card.name}</h2>
            <img
              src={card.qr}
              alt={`Anmeldekarte für ${card.name}`}
              width="280"
              height="280"
            />
            <p>Diese Karte gehört nur dir. Bewahre sie gut auf.</p>
            <div className="dialog-actions no-print">
              <button className="knopf" onClick={() => setCard(null)}>
                Schließen
              </button>
              <button
                className="knopf knopf-haupt"
                onClick={() => window.print()}
              >
                Karte drucken
              </button>
            </div>
          </section>
        </div>
      )}
      {childBooks && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="child-books-title"
          >
            <h2 id="child-books-title">Hefte von {childBooks.child.name}</h2>
            <p>
              Beim Öffnen kannst du mit Stift oder Text kommentieren und die
              Seite an der Tafel zeigen.
            </p>
            {childBooks.books.map((b) => (
              <article className="child-book-link" key={b.id}>
                <Link href={`/heft/${b.id}`} className="knopf">
                  {b.title}
                  {b.trashed ? ' · Papierkorb' : ''}
                </Link>
                <small>
                  Letzte Arbeit: {new Date(b.updatedAt).toLocaleString('de-DE')}
                </small>
                <small>
                  Vom Kind bearbeitete Seiten:{' '}
                  {b.pageProgress
                    ?.filter((p) => p.byChild)
                    .map((p) => p.index)
                    .join(', ') || 'noch keine'}
                </small>
                {b.trashed && (
                  <>
                    <button
                      className="knopf compact"
                      onClick={() =>
                        run(async () => {
                          await api('restore', { id: b.id });
                          setChildBooks({
                            ...childBooks,
                            books: childBooks.books.map((book) =>
                              book.id === b.id
                                ? { ...book, trashed: false }
                                : book,
                            ),
                          });
                        })
                      }
                    >
                      Wiederherstellen
                    </button>
                    <button
                      className="knopf compact danger-text"
                      onClick={() => {
                        if (confirm('Dieses Kinderheft endgültig löschen?'))
                          void run(async () => {
                            await api('delete', { id: b.id });
                            setChildBooks({
                              ...childBooks,
                              books: childBooks.books.filter(
                                (book) => book.id !== b.id,
                              ),
                            });
                          });
                      }}
                    >
                      Endgültig löschen
                    </button>
                  </>
                )}
              </article>
            ))}
            {!childBooks.books.length && <p>Noch keine Hefte vorhanden.</p>}
            <button className="knopf" onClick={() => setChildBooks(null)}>
              Schließen
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
