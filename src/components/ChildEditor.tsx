/* eslint-disable @next/next/no-img-element */
'use client';
import Icon from './Icon';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, flushEditor } from '@/lib/editor-store';
import { speakGerman } from '@/lib/speech';
import ReaderMode from './ReaderMode';
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
import { uploadAudio } from '@/lib/client-api';
import AudioDialog, { AudioEditDialog } from './AudioDialog';
import { audioElement, audioPlaceholder, cassetteRecorder, isAudioPlaceholder, withRecording } from './editor/audio-elements';
import ScaledPage from './ScaledPage';
import { useShapeRecognition } from '@/lib/use-shape-recognition';
import EditorHeader from './editor/EditorHeader';
import ToolRail, { type RailItem } from './editor/ToolRail';
import PagePanel from './editor/PagePanel';
import DrawingBar from './editor/DrawingBar';
import ElementBar from './editor/ElementBar';
import TemplateChooser from './editor/TemplateChooser';
import { PAPER, templateCatalog } from './editor/page-templates';
import ImageDialog from './ImageDialog';
import ImageEditor, { editFromElement } from './ImageEditor';
import { cascade, fillPlaceholder, imageElement, isPlaceholder, withEditedPicture, type ChosenImage } from './editor/image-elements';
import InlineText from './editor/InlineText';
import { useTextEditing } from './editor/use-text-editing';
import { clampZoom, fitZoom, usePinchZoom } from './editor/use-pinch-zoom';
import { fitText } from './editor/text-measure';
import { tapDistance } from '@/lib/selection';
import ElementActions from './editor/ElementActions';
import SelectionHandles, { type HandleKind } from './editor/SelectionHandles';
import { elementCenter, resizeAtCorner, rotateTo, type Corner } from '@/lib/transform';
import { SelectBar, ShapesBar, findStamp } from './editor/ContextBars';
import PageBar from './editor/PageBar';
import EmbedDialog from './learning/EmbedDialog';
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
  /** Paper chooser for a new page (children get empty pages only). */
  const [choosePaper, setChoosePaper] = useState(false);
  const paper = useMemo(() => templateCatalog([]).filter((e) => e.category === PAPER), []);
  /** Placeholder that gets the photo (instead of a new picture). */
  const [fillId, setFillId] = useState<string | null>(null);
  /** Picture open in the editor. */
  const [editImage, setEditImage] = useState<PageElement | null>(null);
  /** Sound open for trimming and improving. */
  const [editAudio, setEditAudio] = useState<PageElement | null>(null);
  const [readAloud, setReadAloud] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [recordTarget, setRecordTarget] = useState<string | null>(null);
  const [draft, setDraft] = useState<PageElement | null>(null);
  const [guide, setGuide] = useState<DrawingGuide | null>(null);
  const [erasePreview, setErasePreview] = useState<PageElement[] | null>(null);
  const surface = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [reader, setReader] = useState(false);
  const [panel, setPanel] = useState<'insert' | 'page' | null>(null);
  const [stamp, setStamp] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);
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
    /** Tapping a selected text box again starts writing in it. */
    editOnTap?: string;
  } | null>(null);
  const page = s.pages.find((p) => p.id === s.activeId);
  const writing = useTextEditing(page?.id);
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
  const railActive: RailItem = selectedElements.length ? 'select' : panel ?? (s.tool === 'marker' ? 'pen' : s.tool);
  const stampActive = !!stamp && panel === 'insert';
  useEffect(() => {
    if (!stampActive) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStamp(null);
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [stampActive]);
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
  const ready = !!page && s.book?.id === initial.book.id;
  function cancelGesture() {
    const g = gesture.current;
    gesture.current = null;
    if (g?.pointer !== undefined && surface.current?.hasPointerCapture(g.pointer)) surface.current.releasePointerCapture(g.pointer);
    recognition.cancel();
    setDraft(null);
    setErasePreview(null);
  }
  const fitPage = () => setZoom((z) => fitZoom(scroller.current, z));
  usePinchZoom(scroller, zoom, setZoom, { enabled: ready && !reader, onStart: cancelGesture, onFit: fitPage });
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
    if (stampActive && s.tool === 'select') {
      stampAt(p);
      return;
    }
    if (s.tool === 'select') {
      // Strokes do not catch pointer events themselves; find one near the tap.
      element ??= strokeAt(page!.elements, p, e.pointerType === 'touch' ? 4 : 2.5);
      if (isAudioPlaceholder(element) && !element!.src) {
        s.select(element!.locked ? [] : [element!.id]);
        setRecordTarget(element!.id);
        setShowAudio(true);
        speak('Aufnehmen');
        return;
      }
      if (isPlaceholder(element) && !element!.src) {
        s.select(element!.locked ? [] : [element!.id]);
        openFill(element!);
        return;
      }
      const editOnTap =
        element?.type === 'text' && !element.locked && s.selected.length === 1 && s.selected[0] === element.id
          ? element.id
          : undefined;
      s.select(element && !element.locked ? [element.id] : []);
      if (!element || element.locked) return;
      gesture.current = { el: element, points: [], start: p, move: true, pointer: e.pointerId, editOnTap };
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
    const editOnTap =
      handle === 'move' && el.type === 'text' && s.selected.length === 1 && s.selected[0] === el.id ? el.id : undefined;
    s.select([el.id]);
    gesture.current = { el, points: [], start: point(e), move: true, handle, pointer: e.pointerId, editOnTap };
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
    if (!cancel && g.editOnTap) {
      const p = point(e);
      if (Math.hypot(p.x - g.start.x, p.y - g.start.y) < tapDistance) {
        gesture.current = null;
        setDraft(null);
        writing.begin(g.editOnTap);
        return;
      }
    }
    const recognized = !cancel && !g.move && !g.erase && !g.guideEdge ? recognition.finish(g.points) : null;
    recognition.cancel();
    gesture.current = null;
    if (g && !cancel && !g.erase) {
      const el = g.move
        ? g.el.type === 'text'
          ? fitText(draft || g.el, page!)
          : draft || g.el
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
  async function addPage(input: Page) {
    if (!(await flushEditor()) || !page) return;
    try {
      const result = await childApi<{ book: Notebook; page: Page }>('addPage', {
        id: s.book!.id,
        page: input,
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
  function closeImages() {
    setShowImages(false);
    setFillId(null);
  }
  function openFill(el: PageElement) {
    setFillId(el.id);
    setShowImages(true);
    speak('Foto machen');
  }
  function chooseImage(image: ChosenImage) {
    if (fillId) {
      const id = fillId;
      // Locked placeholders keep their place; only the picture changes.
      s.edit((p) => ({ ...p, elements: p.elements.map((el) => (el.id === id ? fillPlaceholder(el, image) : el)) }));
      closeImages();
      return;
    }
    imageElement(image, size)
      .then((element) => {
        const placed = cascade(element, page!.elements, size);
        insert(placed);
        closeImages();
        if (image.edit) setEditImage(placed);
      })
      .catch((e) => useEditor.setState({ error: (e as Error).message }));
  }
  /** Children's stamps stay movable (the server keeps locked elements for teachers). */
  function stampAt(point: Point) {
    const made = findStamp(stamp)?.make();
    if (!made) return;
    const x = Math.max(0, Math.min(size.width - made.width, point.x - made.width / 2));
    const y = Math.max(0, Math.min(size.height - made.height, point.y - made.height / 2));
    s.edit((p) => ({ ...p, elements: [...p.elements, { ...made, locked: false, x, y }] }));
  }
  function chooseRail(item: RailItem) {
    if (item !== 'insert' && item !== 'page') setPanel(null);
    switch (item) {
      case 'insert':
      case 'page':
        setPanel(railActive === item ? null : item);
        useEditor.setState({ tool: 'select', selected: [] });
        speak(item === 'insert' ? 'Einfügen' : 'Seite');
        break;
      case 'internet':
        setShowEmbed(true);
        speak('Internet');
        break;
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
      case 'text': {
        const text = fitText({
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
        }, page!, { autoSize: true });
        insert(text);
        writing.begin(text.id);
        speak('Text schreiben');
        break;
      }
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
        onReader={() => {
          cancelGesture();
          writing.done();
          useEditor.setState({ tool: 'select', selected: [] });
          setReader(true);
          speak('Lesemodus');
        }}
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
          onAdd={features.has('addPage') ? () => setChoosePaper(true) : undefined}
          overview={features.has('pages')}
        />
        <div className="editor-main">
          <section className="canvas-area">
            <LinkContext.Provider value={links}>
            <div className="canvas-scroll" ref={scroller}>
              <div className="canvas-sheet">

        <ScaledPage page={page} zoom={zoom}>
          <LearningRuntime
                  uploadAudio={(id, file) => uploadAudio(file, s.book!.id, id)}
            interactive={s.tool === 'select'}
            allowExternal={features.has('internet')}
            onResponse={(id, response) =>
              s.edit((p) => ({
                ...p,
                elements: p.elements.map((el) =>
                  el.id === id ? { ...el, response } : el,
                ),
              }))
            }
            onRecord={(id) => {
              // The server checks that this recorder may take a recording.
              setRecordTarget(id);
              setShowAudio(true);
            }}
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
                  className={`${selected?.id === el.id ? 'selected' : ''} ${writing.editingId === el.id ? 'text-editing' : ''}`}
                  onPointerDown={(e) => down(e, el)}
                  onDoubleClick={() => {
                    if (el.type === 'text' && !el.locked) writing.begin(el.id);
                    else if (isPlaceholder(el) && !el.src) openFill(el);
                    else if (el.type === 'image' && el.src && !el.locked && features.has('imageEdit')) setEditImage(el);
                  }}
                  style={{
                    pointerEvents:
                      s.tool === 'select' && el.type !== 'stroke'
                        ? 'auto'
                        : 'none',
                  }}
                >
                  {writing.editingId === el.id ? (
                    <InlineText
                      element={el}
                      selectAll={writing.selectAll}
                      onText={writing.type}
                      onHeight={writing.height}
                      onDone={writing.done}
                    />
                  ) : undefined}
                </ElementView>
              ))}
              {selected && !selected.locked && (
                <SelectionHandles
                  element={draft?.id === selected.id ? draft : selected}
                  locked={false}
                  onStart={(e, handle) => grab(e, selected, handle)}
                  onMove={move}
                  onEnd={up}
                  editing={writing.editingId === selected.id}
                  onDoubleClick={() => {
                    if (selected.type === 'text') writing.begin(selected.id);
                    else if (selected.type === 'image' && selected.src && features.has('imageEdit')) setEditImage(selected);
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
            <div className="zoom-float" role="group" aria-label="Seite">
              {features.has('readAloud') && (
                <button type="button" onClick={readPage}>
                  <Icon name="speaker" size={22} />
                  <span>Seite vorlesen</span>
                </button>
              )}
              <button type="button" aria-label="Seite kleiner" onClick={() => setZoom((z) => clampZoom(z - 0.1))}>
                <Icon name="minus" size={22} />
              </button>
              <span className="zoom-value">{Math.round(zoom * 100)} %</span>
              <button type="button" aria-label="Seite größer" onClick={() => setZoom((z) => clampZoom(z + 0.1))}>
                <Icon name="plus" size={22} />
              </button>
              <button type="button" onClick={fitPage}>
                <Icon name="expand" size={22} />
                <span>Ganze Seite</span>
              </button>
            </div>
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
              actions={{
                onResize: resizeSelected,
                onRotate: rotateSelected,
                onEditImage: setEditImage,
                onEditAudio: setEditAudio,
              }}
            />
          ) : panel === 'insert' ? (
            <ShapesBar
              onInsert={(element) => insert(cascade({ ...element, locked: false }, page.elements, size))}
              stamp={stamp}
              onStamp={setStamp}
            />
          ) : panel === 'page' ? (
            <PageBar
              key={page.id}
              features={features}
              page={page}
              pageIndex={s.book.pageIds.indexOf(page.id)}
              pageCount={s.pages.length}
              templates={false}
              onDuplicate={() => undefined}
              onMove={() => undefined}
              onDelete={() => undefined}
              onSaveTemplate={() => undefined}
              onTemplates={() => setChoosePaper(true)}
            />
          ) : (
            <SelectBar features={features} multi={false} onMulti={() => undefined} />
          )}
        </div>
      </div>
      {showEmbed && (
        <EmbedDialog
          child
          onClose={() => setShowEmbed(false)}
          onInsert={(el) => {
            insert(el);
            setShowEmbed(false);
          }}
        />
      )}
      {choosePaper && page && (
        <TemplateChooser
          title="Neue Seite"
          hint="Wähle das Papier für deine neue Seite."
          entries={paper}
          orientation="landscape"
          onClose={() => setChoosePaper(false)}
          onPick={(entry, orientation) => {
            setChoosePaper(false);
            void addPage({ ...entry.build(orientation)[0], template: entry.key });
          }}
        />
      )}
      {editAudio?.src && (
        <AudioEditDialog
          src={editAudio.src}
          title={editAudio.alt || 'Ton'}
          bookId={s.book.id}
          elementId={editAudio.id}
          onClose={() => setEditAudio(null)}
          onSaved={(src, title) => {
            const id = editAudio.id;
            s.edit((p) => ({ ...p, elements: p.elements.map((el) => (el.id === id ? { ...el, src, alt: title } : el)) }));
            setEditAudio(null);
          }}
        />
      )}
      {reader && (
        <ReaderMode
          title={s.book.title}
          pages={s.book.pageIds.map((id) => s.pages.find((p) => p.id === id)).filter((p): p is Page => !!p)}
          pageId={page.id}
          onPage={choosePage}
          allowExternal={features.has('internet')}
          uploadAudio={(id, file) => uploadAudio(file, s.book!.id, id)}
          onResponse={(id, response) =>
            s.edit((p) => ({ ...p, elements: p.elements.map((el) => (el.id === id ? { ...el, response } : el)) }))
          }
          onRecord={(id) => {
            setRecordTarget(id);
            setShowAudio(true);
          }}
          onSpeak={features.has('readAloud') ? readPage : undefined}
          onClose={() => setReader(false)}
        />
      )}
      {showAudio && (
        <AudioDialog
          bookId={s.book.id}
          child={true}
          only={recordTarget ? ['record', 'upload'] : undefined}
          elementId={recordTarget || undefined}
          title={recordTarget ? 'Aufnehmen' : 'Ton hinzufügen'}
          onClose={() => {
            setShowAudio(false);
            setRecordTarget(null);
          }}
          onAudio={(src, title) => {
            if (recordTarget) {
              const target = recordTarget;
              s.edit((p) => ({ ...p, elements: p.elements.map((el) => (el.id === target ? withRecording(el, src, title) : el)) }));
            } else insert(cascade(audioElement(src, title), page!.elements, size));
            setRecordTarget(null);
            setShowAudio(false);
          }}
        />
      )}
      {editImage?.src && (
        <ImageEditor
          src={editImage.src}
          initial={editFromElement(editImage)}
          onClose={() => setEditImage(null)}
          onDone={(result) => {
            const id = editImage.id;
            s.edit((p) => ({ ...p, elements: p.elements.map((el) => (el.id === id ? withEditedPicture(el, result) : el)) }));
            setEditImage(null);
          }}
        />
      )}
      {showImages && (
        <ImageDialog
          features={features}
          child
          released={images}
          only={fillId ? ['camera', 'upload'] : undefined}
          uploadQuery={fillId ? `?${new URLSearchParams({ book: s.book!.id, element: fillId })}` : ''}
          title={fillId ? 'Mach ein Foto' : 'Ein Bild einfügen'}
          onImage={chooseImage}
          onClose={closeImages}
        />
      )}
    </main>
  );
}
