/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useRef, useState } from 'react';
import { useEditor, flushEditor } from '@/lib/editor-store';
import { speakGerman } from '@/lib/speech';
import { childApi } from '@/lib/child-api';
import {
  uuid,
  compactStroke,
  dimensions,
  newPage,
  type BookData,
  type Notebook,
  type Page,
  type PageElement,
  type Point,
} from '@/lib/notebook-model';
import { ElementView } from './PageView';
import { LearningRuntime } from './learning/Runtime';
import AudioDialog from './AudioDialog';
import ScaledPage from './ScaledPage';
export default function ChildEditor({
  initial,
  images,
}: {
  initial: BookData;
  images: string[];
}) {
  const s = useEditor();
  const [showImages, setShowImages] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const [text, setText] = useState('');
  const [showAudio, setShowAudio] = useState(false);
  const [recordTarget, setRecordTarget] = useState<string | null>(null);
  const [draft, setDraft] = useState<PageElement | null>(null);
  const surface = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    el: PageElement;
    points: Point[];
    start: Point;
    move: boolean;
    erase?: boolean;
  } | null>(null);
  const page = s.pages.find((p) => p.id === s.activeId);
  const selected = page?.elements.find((el) => s.selected.includes(el.id));
  useEffect(() => {
    useEditor.getState().load(initial, 'child');
  }, [initial]);
  useEffect(() => {
    if (!Object.keys(s.dirty).length || s.conflict || s.saving) return;
    const timer = setTimeout(() => {
      void flushEditor();
    }, 800);
    return () => clearTimeout(timer);
  }, [s.dirty, s.conflict, s.saving]);
  useEffect(() => {
    const unload = (e: BeforeUnloadEvent) => {
      if (Object.keys(useEditor.getState().dirty).length) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', unload);
    return () => window.removeEventListener('beforeunload', unload);
  }, []);
  if (!page || s.book?.id !== initial.book.id)
    return <p>Dein Heft wird geöffnet …</p>;
  const size = dimensions(page);
  const index = s.book.pageIds.indexOf(page.id);
  async function leave(url: string, logout = false) {
    if (!(await flushEditor())) return;
    if (logout) await childApi('logout');
    window.location.replace(url);
  }
  function speak(label: string) {
    if (readAloud && !speakGerman(label))
      useEditor.setState({
        error:
          'Bitte eine deutsche Offline-Stimme auf diesem Gerät installieren.',
      });
  }
  function tool(value: typeof s.tool, label: string) {
    useEditor.setState({ tool: value, selected: [] });
    speak(label);
  }
  function point(e: React.PointerEvent) {
    const rect = surface.current!.getBoundingClientRect();
    return {
      x: Math.max(
        0,
        Math.min(
          size.width,
          ((e.clientX - rect.left) / rect.width) * size.width,
        ),
      ),
      y: Math.max(
        0,
        Math.min(
          size.height,
          ((e.clientY - rect.top) / rect.height) * size.height,
        ),
      ),
      pressure: e.pressure || 0.5,
    };
  }
  function down(e: React.PointerEvent, element?: PageElement) {
    if (
      e.button !== 0 ||
      (s.pencilOnly && e.pointerType !== 'pen' && s.tool !== 'select')
    )
      return;
    e.preventDefault();
    e.stopPropagation();
    const p = point(e);
    if (s.tool === 'select') {
      s.select(element && !element.locked ? [element.id] : []);
      setText(
        element?.type === 'text' && !element.locked ? element.text || '' : '',
      );
      if (!element || element.locked) return;
      gesture.current = { el: element, points: [], start: p, move: true };
    } else if (s.tool === 'eraser') {
      s.checkpoint();
      gesture.current = {
        el: {
          id: '',
          type: 'stroke',
          x: 0,
          y: 0,
          width: 1,
          height: 1,
          rotation: 0,
          locked: false,
          color: s.color,
        },
        points: [],
        start: p,
        move: false,
        erase: true,
      };
      erase(p);
    } else {
      const el: PageElement = {
        id: uuid(),
        type: 'stroke',
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        rotation: 0,
        locked: false,
        color: s.color,
        penWidth: s.tool === 'marker' ? 5 : s.penWidth,
        opacity: s.tool === 'marker' ? 0.3 : 1,
        points: [p],
      };
      gesture.current = { el, points: [p], start: p, move: false };
      setDraft(el);
    }
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function move(e: React.PointerEvent) {
    const g = gesture.current;
    if (!g) return;
    const p = point(e);
    if (g.erase) {
      erase(p);
      return;
    }
    if (g.move)
      setDraft({
        ...g.el,
        x: Math.max(0, Math.min(size.width - 5, g.el.x + p.x - g.start.x)),
        y: Math.max(0, Math.min(size.height - 5, g.el.y + p.y - g.start.y)),
      });
    else if (g.points.length < 19000) {
      g.points.push(p);
      setDraft({ ...g.el, points: [...g.points] });
    }
  }
  function up(cancel = false) {
    const g = gesture.current;
    gesture.current = null;
    if (g && !cancel && !g.erase) {
      const el = g.move
        ? draft || g.el
        : compactStroke({ ...g.el, points: g.points });
      s.edit((page) => ({
        ...page,
        elements: g.move
          ? page.elements.map((old) => (old.id === el.id ? el : old))
          : [...page.elements, el],
      }));
    }
    setDraft(null);
  }
  function erase(point: Point) {
    s.edit(
      (p) => ({
        ...p,
        elements: p.elements.filter((el) => {
          if (el.locked || el.type !== 'stroke') return true;
          const angle = (-el.rotation * Math.PI) / 180,
            dx = point.x - el.x - el.width / 2,
            dy = point.y - el.y - el.height / 2;
          const x = dx * Math.cos(angle) - dy * Math.sin(angle) + el.width / 2,
            y = dx * Math.sin(angle) + dy * Math.cos(angle) + el.height / 2;
          const points = el.points || [];
          return !points.some((p, i) => {
            const q = points[Math.max(0, i - 1)],
              vx = p.x - q.x,
              vy = p.y - q.y;
            const t = Math.max(
              0,
              Math.min(
                1,
                ((x - q.x) * vx + (y - q.y) * vy) / (vx * vx + vy * vy || 1),
              ),
            );
            return (
              Math.hypot(x - q.x - t * vx, y - q.y - t * vy) <
              Math.max(3, (el.penWidth || 1) / 2 + 1)
            );
          });
        }),
      }),
      false,
    );
  }
  function resizeSelected(factor: number) {
    s.edit((p) => ({
      ...p,
      elements: p.elements.map((el) => {
        if (!s.selected.includes(el.id) || el.locked) return el;
        const width = Math.max(1, Math.min(290, el.width * factor)),
          height = Math.max(1, Math.min(290, el.height * factor));
        return {
          ...el,
          width,
          height,
          points: el.points?.map((point) => ({
            ...point,
            x: (point.x * width) / el.width,
            y: (point.y * height) / el.height,
          })),
        };
      }),
    }));
  }
  function insert(el: PageElement) {
    s.edit((page) => ({ ...page, elements: [...page.elements, el] }));
    s.select([el.id]);
    useEditor.setState({ tool: 'select' });
  }
  return (
    <main className="child-editor">
      <header className="child-header">
        <button className="knopf" onClick={() => leave('/kinder')}>
          ‹ Meine Hefte
        </button>
        <h1>{s.book.title}</h1>
        <label>
          <input
            type="checkbox"
            checked={readAloud}
            onChange={(e) => setReadAloud(e.target.checked)}
          />{' '}
          Vorlesen
        </label>
        <button
          className="knopf knopf-haupt"
          onClick={() => leave('/kinder', true)}
        >
          ✓ Fertig
        </button>
      </header>
      <nav className="child-tools">
        {(
          [
            ['select', '↖', 'Bewegen'],
            ['pen', '✎', 'Stift'],
            ['marker', '▰', 'Leuchtstift'],
            ['eraser', '⌫', 'Radierer'],
          ] as const
        ).map(([value, icon, label]) => (
          <button
            className="tool"
            key={value}
            aria-pressed={s.tool === value}
            onClick={() => tool(value, label)}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
        <button
          className="tool"
          onClick={() => {
            insert({
              id: uuid(),
              type: 'text',
              x: 20,
              y: 25,
              width: 120,
              height: 30,
              rotation: 0,
              locked: false,
              color: s.color,
              text: '',
              font: 'Andika',
              fontSize: 22,
            });
            setText('');
            speak('Text schreiben');
          }}
        >
          <span>T</span>Schreiben
        </button>
        <button
          className="tool"
          onClick={() => {
            setShowImages(true);
            speak('Bild einfügen');
          }}
        >
          <span>▧</span>Bilder
        </button>
        {s.book.allowChildAudio && (
          <button className="tool" onClick={() => setShowAudio(true)}>
            <span>♫</span>Aufnehmen
          </button>
        )}
        <button
          className="tool"
          onClick={() => {
            if (
              !speakGerman(
                page.elements
                  .filter((el) => el.type === 'text')
                  .map((el) => el.text)
                  .join('. '),
              )
            )
              useEditor.setState({
                error:
                  'Bitte eine deutsche Offline-Stimme auf diesem Gerät installieren.',
              });
          }}
        >
          <span>▷</span>Vorlesen
        </button>
        <label className="tool">
          <input
            type="color"
            aria-label="Farbe"
            value={s.color}
            onChange={(e) => useEditor.setState({ color: e.target.value })}
          />
          Farbe
        </label>
        <button
          className="tool"
          disabled={!s.past.length}
          onClick={() => {
            s.undo();
            speak('Rückgängig');
          }}
        >
          <span>↶</span>Zurück
        </button>
        <label className="pencil-only">
          <input
            type="checkbox"
            checked={s.pencilOnly}
            onChange={(e) =>
              useEditor.setState({ pencilOnly: e.target.checked })
            }
          />{' '}
          Nur Stift
        </label>
      </nav>
      {s.error && (
        <div className="error-banner" role="alert">
          {s.error}
          <button className="knopf" onClick={() => void flushEditor()}>
            Nochmal speichern
          </button>
        </div>
      )}
      {selected?.type === 'text' && (
        <div className="child-text">
          <label>
            Dein Text
            <input
              autoFocus
              aria-label="Dein Text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                s.patchElements({ text: e.target.value });
              }}
            />
          </label>
          <button className="knopf" onClick={() => s.select([])}>
            ✓ Fertig schreiben
          </button>
        </div>
      )}
      {selected && !selected.locked && (
        <div className="child-element-controls">
          <button className="knopf compact" onClick={() => resizeSelected(1.1)}>
            ＋ Größer
          </button>
          <button
            className="knopf compact"
            onClick={() => resizeSelected(1 / 1.1)}
          >
            − Kleiner
          </button>
          <button
            className="knopf compact"
            onClick={() => {
              s.edit((page) => ({
                ...page,
                elements: page.elements.filter(
                  (el) => el.id !== selected.id || el.locked,
                ),
              }));
              s.select([]);
            }}
          >
            Entfernen
          </button>
        </div>
      )}
      <div className="child-canvas">
        <ScaledPage page={page}>
          <LearningRuntime
            interactive={s.tool === 'select'}
            onResponse={(id, response) =>
              s.edit((p) => ({
                ...p,
                elements: p.elements.map((el) =>
                  el.id === id ? { ...el, response } : el,
                ),
              }))
            }
            onRecord={
              s.book.allowChildAudio
                ? (id) => {
                    setRecordTarget(id);
                    setShowAudio(true);
                  }
                : undefined
            }
          >
            <div
              className={`interaction-surface tool-${s.tool}`}
              ref={surface}
              style={{ touchAction: s.pencilOnly ? 'pan-x pan-y' : 'none' }}
              onPointerDown={(e) => down(e)}
              onPointerMove={move}
              onPointerUp={() => up()}
              onPointerCancel={() => up(true)}
            >
              {page.elements.map((el) => (
                <ElementView
                  element={draft?.id === el.id ? draft : el}
                  key={el.id}
                  className={selected?.id === el.id ? 'selected' : ''}
                  onPointerDown={(e) => down(e, el)}
                  style={{
                    pointerEvents:
                      s.tool === 'select' && el.type !== 'stroke'
                        ? 'auto'
                        : 'none',
                  }}
                />
              ))}
              {draft && !page.elements.some((el) => el.id === draft.id) && (
                <ElementView
                  element={draft}
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </div>
          </LearningRuntime>
        </ScaledPage>
      </div>
      <footer className="child-page-controls">
        <button
          className="knopf"
          disabled={!index}
          onClick={() =>
            useEditor.setState({
              activeId: s.book!.pageIds[index - 1],
              selected: [],
              past: [],
              future: [],
            })
          }
        >
          ‹ Zurück
        </button>
        <span>
          Seite {index + 1} von {s.pages.length}
          <small>
            {s.saving || Object.keys(s.dirty).length
              ? 'Wird gespeichert …'
              : '✓ Gespeichert'}
          </small>
        </span>
        <button
          className="knopf"
          disabled={index === s.pages.length - 1}
          onClick={() =>
            useEditor.setState({
              activeId: s.book!.pageIds[index + 1],
              selected: [],
              past: [],
              future: [],
            })
          }
        >
          Weiter ›
        </button>
        {s.book.allowChildPages && (
          <button
            className="knopf"
            onClick={async () => {
              if (!(await flushEditor())) return;
              try {
                const result = await childApi<{ book: Notebook; page: Page }>(
                  'addPage',
                  {
                    id: s.book!.id,
                    page: newPage(page.ruling, page.orientation),
                  },
                );
                useEditor.setState({
                  book: result.book,
                  pages: [...s.pages, result.page],
                  activeId: result.page.id,
                  selected: [],
                  past: [],
                  future: [],
                });
              } catch (e) {
                useEditor.setState({ error: (e as Error).message });
              }
            }}
          >
            ＋ Seite
          </button>
        )}
      </footer>
      {showAudio && (
        <AudioDialog
          bookId={s.book.id}
          onClose={() => setShowAudio(false)}
          onAudio={(src) => {
            if (recordTarget) {
              const target = recordTarget;
              s.edit((p) => ({
                ...p,
                elements: p.elements.map((el) =>
                  el.id === target
                    ? {
                        ...el,
                        response: {
                          ...el.response,
                          recordingSrc: src,
                          recordings: [
                            ...(Array.isArray(el.response?.recordings)
                              ? el.response.recordings
                              : []),
                            { title: 'Aufnahme', src, offset: 0, volume: 1 },
                          ],
                        },
                      }
                    : el,
                ),
              }));
              setRecordTarget(null);
              setShowAudio(false);
              return;
            }
            insert({
              id: uuid(),
              type: 'audio',
              x: 20,
              y: 25,
              width: 100,
              height: 28,
              rotation: 0,
              locked: false,
              color: '#253c42',
              src,
              alt: 'Meine Aufnahme',
            });
            setShowAudio(false);
          }}
        />
      )}
      {showImages && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="child-images-title"
          >
            <h2 id="child-images-title">Deine Bilder</h2>
            <div className="uploaded-images">
              {images.map((src) => (
                <button
                  key={src}
                  onClick={() => {
                    const image = new Image();
                    image.onload = () => {
                      const height = Math.min(
                        (90 * image.height) / image.width,
                        120,
                      );
                      insert({
                        id: uuid(),
                        type: 'image',
                        x: 20,
                        y: 20,
                        width: (height * image.width) / image.height,
                        height,
                        rotation: 0,
                        locked: false,
                        color: '#253c42',
                        src,
                        alt: '',
                      });
                      setShowImages(false);
                    };
                    image.src = src;
                  }}
                >
                  <img src={src} alt="Bild einfügen" />
                </button>
              ))}
            </div>
            {!images.length && (
              <p>Deine Lehrkraft hat noch keine Bilder freigegeben.</p>
            )}
            <button className="knopf" onClick={() => setShowImages(false)}>
              Schließen
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
