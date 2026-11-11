/* eslint-disable @next/next/no-img-element */
'use client';
import Icon from './Icon';
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
import { useShapeRecognition } from '@/lib/use-shape-recognition';
import EditorHeader from './editor/EditorHeader';
import ToolRail, { type RailItem } from './editor/ToolRail';
import PagePanel from './editor/PagePanel';
import DrawingBar from './editor/DrawingBar';
import ElementBar from './editor/ElementBar';
import ElementActions from './editor/ElementActions';
import SelectionHandles, { type HandleKind } from './editor/SelectionHandles';
import { elementCenter, resizeAtCorner, rotateTo, type Corner } from '@/lib/transform';
import { SelectBar } from './editor/ContextBars';
import { featuresFor } from '@/lib/features';
import { strokeAt } from '@/lib/selection';
import { LinkContext, LinkLayer } from './LinkContext';
import DrawingRuler from './learning/DrawingRuler';
import { captureGuideEdge, projectToGuideEdge, type DrawingGuide, type GuideEdge } from '@/lib/drawing-guide';
import { previousArrowShaft } from '@/lib/shape-recognition';
import { inkPaintOrder } from '@/lib/brushes';
import { appendSamples, eraseElements, newStroke, pointerSamples, type EraserProgress, type EraserOptions } from '@/lib/drawing';
export default function ChildEditor({
  initial,
  images,
  allowed,
}: {
  initial: BookData;
  images: string[];
  /** Functions the teacher allows (class or child setting). */
  allowed?: readonly string[];
}) {
  const s = useEditor();
  const recognition = useShapeRecognition(s.recognizeShapes && !['water', 'fill'].includes(s.brush), s.activeId);
  const [showImages, setShowImages] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const [showAudio, setShowAudio] = useState(false);
  const [recordTarget, setRecordTarget] = useState<string | null>(null);
  const [draft, setDraft] = useState<PageElement | null>(null);
  const [guide, setGuide] = useState<DrawingGuide | null>(null);
  const [erasePreview, setErasePreview] = useState<PageElement[] | null>(null);
  const surface = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    el: PageElement;
    points: Point[];
    start: Point;
    move: boolean;
    /** Which part of the selection frame was grabbed. */
    handle?: HandleKind;
    guideEdge?: GuideEdge;
    erase?: boolean;
    pointer?: number;
    originals?: PageElement[];
    eraserId?: string;
    eraserProgress?: EraserProgress;
  eraserOptions?: EraserOptions;
  } | null>(null);
  const page = s.pages.find((p) => p.id === s.activeId);
  const selected = page?.elements.find((el) => s.selected.includes(el.id));
  const selectedElements = page?.elements.filter((el) => s.selected.includes(el.id)) || [];
  const features = featuresFor('child', s.book, allowed);
  const links = {
    openPage: (id: string) => {
      if (s.book?.pageIds.includes(id)) choosePage(id);
    },
    pageNumber: (id: string) => {
      const i = s.book?.pageIds.indexOf(id) ?? -1;
      return i < 0 ? undefined : i + 1;
    },
  };
  const railActive: RailItem = selectedElements.length ? 'select' : s.tool === 'marker' ? 'pen' : s.tool;
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
    if (value === 'marker') s.chooseBrush('marker');
    else if (value === 'pen') s.chooseBrush(s.brush === 'marker' || s.brush === 'fill' ? 'pen' : s.brush);
    useEditor.setState({ tool: value, selected: [] });
    speak(label);
  }
  function point(e: React.PointerEvent): Point {
    const samples = pointerSamples(e.nativeEvent, surface.current!.getBoundingClientRect(), size.width, size.height);
    return samples[samples.length - 1];
  }

  function down(e: React.PointerEvent, element?: PageElement) {
    if (
      gesture.current || e.button !== 0 ||
      (s.pencilOnly && e.pointerType !== 'pen' && s.tool !== 'select')
    )
      return;
    e.preventDefault();
    e.stopPropagation();
    if (s.tool === 'pen' && s.brush === 'fill') return;
    const p = point(e);
    if (s.tool === 'select') {
      // Strokes do not catch pointer events themselves; find one near the tap.
      element ??= strokeAt(page!.elements, p, e.pointerType === 'touch' ? 4 : 2.5);
      s.select(element && !element.locked ? [element.id] : []);
      if (!element || element.locked) return;
      gesture.current = { el: element, points: [], start: p, move: true, pointer: e.pointerId };
    } else if (s.tool === 'eraser') {
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
        points: [p],
        start: p,
        pointer: e.pointerId,
        originals: page!.elements,
        eraserId: uuid(),
        eraserProgress: { checked: 0, hits: new Set() },
        eraserOptions: s.eraser,
        move: false,
        erase: true,
      };
      erase();
    } else {
      recognition.cancel();
      const guideEdge = s.tool === 'marker' || !['water', 'fill'].includes(s.brush) ? captureGuideEdge(p, guide, s.penWidth) : undefined;
      const initialPoint = guideEdge ? projectToGuideEdge(p, guideEdge) : p;
      const el = newStroke(initialPoint, size.width, size.height, s, e.pointerType);
      gesture.current = { el, guideEdge, points: [initialPoint], start: initialPoint, move: false, pointer: e.pointerId };
      setDraft(el);
    }
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function grab(e: React.PointerEvent, el: PageElement, handle: HandleKind) {
    if (gesture.current || e.button !== 0 || el.locked) return;
    e.preventDefault();
    e.stopPropagation();
    s.select([el.id]);
    gesture.current = { el, points: [], start: point(e), move: true, handle, pointer: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function move(e: React.PointerEvent) {
    const g = gesture.current;
    if (!g || g.pointer !== e.pointerId) return;
    let samples = pointerSamples(e.nativeEvent, surface.current!.getBoundingClientRect(), size.width, size.height);
    if (g.guideEdge) samples = samples.map(point => projectToGuideEdge(point, g.guideEdge!));
    const p = samples[samples.length - 1];
    if (g.erase) {
      appendSamples(g.points, samples);
      erase();
      return;
    }
    if (g.move && g.handle === 'rotate')
      setDraft(rotateTo(g.el, elementCenter(g.el), g.start, p, e.shiftKey));
    else if (g.move && g.handle && g.handle !== 'move')
      setDraft(resizeAtCorner(g.el, g.handle as Corner, g.start, p, e.shiftKey || g.el.type === 'image'));
    else if (g.move)
      setDraft({
        ...g.el,
        x: Math.max(0, Math.min(size.width - 5, g.el.x + p.x - g.start.x)),
        y: Math.max(0, Math.min(size.height - 5, g.el.y + p.y - g.start.y)),
      });
    else if (g.points.length < 19000) {
      appendSamples(g.points, samples);
      if (g.guideEdge) setDraft({ ...g.el, points: [...g.points] });
      else recognition.update(g.points, shape => setDraft({ ...g.el, points: shape?.points || [...g.points], geometry: shape?.kind }), surface.current!.getBoundingClientRect().width / size.width, previousArrowShaft(page!.elements, g.el));
    }
  }
  function up(e: React.PointerEvent, cancel = false) {
    const g = gesture.current;
    if (!g || g.pointer !== e.pointerId) return;
    if (!cancel && !g.move) {
      let samples = pointerSamples(e.nativeEvent, surface.current!.getBoundingClientRect(), size.width, size.height);
      if (g.guideEdge) samples = samples.map(point => projectToGuideEdge(point, g.guideEdge!));
      appendSamples(g.points, samples);
    }
    const recognized = !cancel && !g.move && !g.erase && !g.guideEdge ? recognition.finish(g.points) : null;
    recognition.cancel();
    gesture.current = null;
    if (g && !cancel && !g.erase) {
      const el = g.move
        ? draft || g.el
        : compactStroke({ ...g.el, points: recognized?.points || g.points, geometry: recognized?.kind });
      s.edit((page) => ({
        ...page,
        elements: g.move
          ? page.elements.map((old) => (old.id === el.id ? el : old))
          : [...page.elements.filter(old => old.id !== recognized?.replaceId), el],
      }));
    }
    if (g && !cancel && g.erase) s.edit(p => ({ ...p, elements: eraseElements(g.originals!, g.points, g.eraserId!, g.eraserOptions!, g.eraserProgress) }));
    setDraft(null);
    setErasePreview(null);
  }
  function erase() {
    const g = gesture.current;
    if (g?.erase) setErasePreview(eraseElements(g.originals!, g.points, g.eraserId!, g.eraserOptions!, g.eraserProgress));
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
  function rotateSelected(degrees: number) {
    s.edit((p) => ({
      ...p,
      elements: p.elements.map((el) =>
        s.selected.includes(el.id) && !el.locked
          ? { ...el, rotation: (el.rotation + degrees + 360) % 360 }
          : el,
      ),
    }));
  }
  function choosePage(id: string) {
    gesture.current = null;
    setDraft(null);
    setErasePreview(null);
    useEditor.setState({ activeId: id, selected: [], past: [], future: [] });
  }
  async function addPage() {
    if (!(await flushEditor()) || !page) return;
    try {
      const result = await childApi<{ book: Notebook; page: Page }>('addPage', {
        id: s.book!.id,
        page: newPage(page.ruling, page.orientation),
      });
      useEditor.setState({
        book: result.book,
        pages: [...useEditor.getState().pages, result.page],
        activeId: result.page.id,
        selected: [],
        past: [],
        future: [],
      });
    } catch (e) {
      useEditor.setState({ error: (e as Error).message });
    }
  }
  function readPage() {
    if (
      !speakGerman(
        page!.elements
          .filter((el) => el.type === 'text')
          .map((el) => el.text)
          .join('. '),
      )
    )
      useEditor.setState({
        error: 'Bitte eine deutsche Offline-Stimme auf diesem Gerät installieren.',
      });
  }
  function chooseRail(item: RailItem) {
    switch (item) {
      case 'select':
        tool('select', 'Auswahl');
        break;
      case 'pen':
        s.chooseBrush(s.brush);
        speak('Stift');
        break;
      case 'eraser':
        tool('eraser', 'Radierer');
        break;
      case 'text':
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
        speak('Text schreiben');
        setTimeout(() => textArea.current?.focus(), 50);
        break;
      case 'image':
        setShowImages(true);
        speak('Bild einfügen');
        break;
      case 'audio':
        setShowAudio(true);
        speak('Aufnehmen');
        break;
    }
  }
  return (
    <main className="editor child-mode">
      <EditorHeader
        features={features}
        backLabel="Meine Hefte"
        onBack={() => void leave('/kinder')}
        title={s.book.title}
        status={s.error ? '⚠ Nicht gespeichert' : s.saving || Object.keys(s.dirty).length ? 'Wird gespeichert …' : '✓ Gespeichert'}
        statusError={!!s.error}
        canUndo={s.past.length > 0}
        canRedo={false}
        onUndo={() => {
          s.undo();
          speak('Rückgängig');
        }}
        onRedo={() => undefined}
        readAloud={readAloud}
        onReadAloud={setReadAloud}
        onDone={() => void leave('/kinder', true)}
        actions={
          <ElementActions
            features={features}
            count={selectedElements.length}
            locked={selectedElements.length > 0 && selectedElements.every((el) => el.locked)}
            canPaste={false}
            pages={s.pages}
            pageIds={s.book.pageIds}
            onCopy={() => undefined}
            onCut={() => undefined}
            onPaste={() => undefined}
            onDuplicate={() => undefined}
            onLink={() => undefined}
            onDelete={() => {
              s.edit((p) => ({
                ...p,
                elements: p.elements.filter((el) => el.locked || !s.selected.includes(el.id)),
              }));
              s.select([]);
              speak('Löschen');
            }}
          />
        }
      />
      {s.error && (
        <div className="error-banner" role="alert">
          {s.error}
          <button className="knopf" onClick={() => void flushEditor()}>
            Nochmal speichern
          </button>
        </div>
      )}
      <div className="editor-body">
        <ToolRail features={features} active={railActive} onChoose={chooseRail} />
        <PagePanel
          pages={s.pages}
          pageIds={s.book.pageIds}
          activeId={page.id}
          onChoose={choosePage}
          onAdd={features.has('addPage') ? () => void addPage() : undefined}
          overview={features.has('pages')}
        />
        <div className="editor-main">
          <section className="canvas-area">
            <LinkContext.Provider value={links}>
            <div className="canvas-scroll">
              <div className="canvas-sheet">

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
              onPointerUp={(e) => up(e)}
              onPointerCancel={(e) => up(e, true)}
              onLostPointerCapture={(e) => up(e, true)}
            >
              {inkPaintOrder((erasePreview || page.elements).filter(el => el.id !== recognition.replaceId), draft).map((el) => (
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
              {selected && !selected.locked && (
                <SelectionHandles
                  element={draft?.id === selected.id ? draft : selected}
                  locked={false}
                  onStart={(e, handle) => grab(e, selected, handle)}
                  onMove={move}
                  onEnd={up}
                  onDoubleClick={() => {
                    if (selected.type === 'text') textArea.current?.focus();
                  }}
                />
              )}
              <LinkLayer elements={page.elements.map((el) => (draft?.id === el.id ? draft : el))} />
              {guide && <DrawingRuler guide={guide} onChange={setGuide} onClose={() => setGuide(null)} />}
            </div>
          </LearningRuntime>
        </ScaledPage>
              </div>
            </div>
            </LinkContext.Provider>
            {features.has('readAloud') && <div className="zoom-float" role="group" aria-label="Seite">
              <button type="button" onClick={readPage}>
                <Icon name="speaker" size={22} />
                <span>Seite vorlesen</span>
              </button>
            </div>}
          </section>
          {draft?.geometry && (s.tool === 'pen' || s.tool === 'marker') && <span className="shape-hint" role="status">Form erkannt – zum Übernehmen loslassen.</span>}
          {s.tool === 'pen' || s.tool === 'marker' || s.tool === 'eraser' ? (
            <>
              <DrawingBar features={features} surface={surface} pageId={page.id} guide={guide} onGuide={setGuide} />
            </>
          ) : selectedElements.length ? (
            <ElementBar
              features={features}
              elements={selectedElements}
              textArea={textArea}
              actions={{
                onResize: resizeSelected,
                onRotate: rotateSelected,
              }}
            />
          ) : (
            <SelectBar features={features} multi={false} onMulti={() => undefined} />
          )}
        </div>
      </div>
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
