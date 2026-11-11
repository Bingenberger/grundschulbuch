'use client';
import { useEffect, useRef, useState } from 'react';
import { useEditor, flushEditor } from '@/lib/editor-store';
import { api } from '@/lib/client-api';
import {
  uuid,
  clone,
  compactStroke,
  dimensions,
  fonts,
  newPage,
  rulings,
  type BookData,
  type Notebook,
  type Page,
  type PageElement,
  type Point,
  type Template,
} from '@/lib/notebook-model';
import { ElementView } from './PageView';
import ScaledPage from './ScaledPage';
import DrawingOptions from './DrawingOptions';
import PageEyedropper from './PageEyedropper';
import PageFillTool from './PageFillTool';
import BoardPointer, { type BoardPointerMode } from './BoardPointer';
import { useShapeRecognition } from '@/lib/use-shape-recognition';
import { previousArrowShaft } from '@/lib/shape-recognition';
import { inkPaintOrder } from '@/lib/brushes';
import { appendSamples, eraseElements, newStroke, pointerSamples, type EraserProgress, type EraserOptions } from '@/lib/drawing';
import AudioDialog from './AudioDialog';
import CollectionDialog from './CollectionDialog';
import GeneratorDialog from './GeneratorDialog';
import ShareDialog from './ShareDialog';
import { LearningRuntime } from './learning/Runtime';
import LearningDialog from './learning/LearningDialog';
import ElementsDialog from './learning/ElementsDialog';
import EmbedDialog from './learning/EmbedDialog';
import DrawingRuler from './learning/DrawingRuler';
import DrawingGuideTools from './DrawingGuideTools';
import { captureGuideEdge, projectToGuideEdge, type DrawingGuide, type GuideEdge } from '@/lib/drawing-guide';
import ShortcutDialog from './learning/ShortcutDialog';
import {
  defaultShortcuts,
  keyChord,
  type EditorCommand,
  type Shortcuts,
} from '@/lib/editor-commands';
import { speakGerman } from '@/lib/speech';
import Inspector from './learning/Inspector';
import FileDialog from './FileDialog';
import { blueprints, blueprintPages } from '@/lib/learning/templates';
import ImageDialog from './ImageDialog';

type Gesture = {
  type: 'move' | 'resize' | 'draw' | 'erase';
  start: Point;
  originals: PageElement[];
  points: Point[];
  pointer: number;
  stroke?: PageElement;
  guideEdge?: GuideEdge;
  eraserId?: string;
  eraserProgress?: EraserProgress;
  eraserOptions?: EraserOptions;
};
const cloneElements = (elements: PageElement[], offset = 5) => {
  const groups = new Map<string, string>();
  return elements.map((el) => {
    if (el.groupId && !groups.has(el.groupId)) groups.set(el.groupId, uuid());
    return {
      ...clone(el),
      id: uuid(),
      groupId: el.groupId ? groups.get(el.groupId) : undefined,
      x: Math.min(297, el.x + offset),
      y: Math.min(297, el.y + offset),
    };
  });
};
export default function Editor({
  initial,
  initialTemplates,
  galleryOrigin,
  dictionaryOrigin,
}: {
  initial: BookData;
  initialTemplates: Template[];
  galleryOrigin: string;
  dictionaryOrigin: string;
}) {
  const s = useEditor();
  const recognition = useShapeRecognition(s.recognizeShapes && !['water', 'fill'].includes(s.brush), s.activeId);
  const cancelRecognition = recognition.cancel;
  const ready = s.book?.id === initial.book.id;
  const [templates, setTemplates] = useState(initialTemplates);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [learning, setLearning] = useState<PageElement | 'new' | null>(null);
  const [showElements, setShowElements] = useState(false),
    [showEmbed, setShowEmbed] = useState(false);
  const [recordTarget, setRecordTarget] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [shortcuts, setShortcuts] = useState<Shortcuts>(defaultShortcuts),
    [showShortcuts, setShowShortcuts] = useState(false);
  const [guide, setGuide] = useState<DrawingGuide | null>(null);
  const [boardDraw, setBoardDraw] = useState(false);
  const [boardPointer, setBoardPointer] = useState<BoardPointerMode>('none');
  const [lightSize, setLightSize] = useState(0.2);
  const [showFiles, setShowFiles] = useState(false),
    [templateCategory, setTemplateCategory] = useState('Alle');
  const [templateQuery, setTemplateQuery] = useState('');
  const [board, setBoard] = useState(false);
  const [busy, setBusy] = useState(false);
  const [multi, setMulti] = useState(false);
  const [draft, setDraft] = useState<PageElement | null>(null);
  const [preview, setPreview] = useState<PageElement[] | null>(null);
  const [erasePreview, setErasePreview] = useState<PageElement[] | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [title, setTitle] = useState(initial.book.title);
  const surface = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const [clipboard, setClipboard] = useState<PageElement[]>([]);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const page = s.pages.find((p) => p.id === s.activeId);
  const selected =
    page?.elements.filter((el) => s.selected.includes(el.id)) || [];
  const first = selected.length === 1 ? selected[0] : undefined;
  useEffect(() => {
    useEditor.getState().load(initial);
    return () => {
      useEditor.setState({ selected: [] });
    };
  }, [initial]);
  useEffect(() => {
    if (!ready || !Object.keys(s.dirty).length || s.conflict || s.saving)
      return;
    const timer = setTimeout(() => {
      void flushEditor();
    }, 900);
    return () => clearTimeout(timer);
  }, [ready, s.dirty, s.saving, s.conflict]);
  useEffect(() => {
    if (!board && document.fullscreenElement) void document.exitFullscreen();
  }, [board]);
  useEffect(() => {
    const changed = () => {
      if (!document.fullscreenElement) {
        gesture.current = null; cancelRecognition(); setDraft(null); setPreview(null); setErasePreview(null);
        setBoard(false); setBoardDraw(false); setBoardPointer('none');
      }
    };
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, [cancelRecognition]);
  useEffect(() => {
    const unload = (event: BeforeUnloadEvent) => {
      if (Object.keys(useEditor.getState().dirty).length) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    const hide = () => {
      if (document.visibilityState === 'hidden') void flushEditor();
    };
    window.addEventListener('beforeunload', unload);
    document.addEventListener('visibilitychange', hide);
    return () => {
      window.removeEventListener('beforeunload', unload);
      document.removeEventListener('visibilitychange', hide);
    };
  }, []);
  useEffect(() => {
    api<Record<string, unknown>>('preferences')
      .then((data) => {
        if (data.shortcuts && typeof data.shortcuts === 'object')
          setShortcuts({ ...defaultShortcuts, ...data.shortcuts });
      })
      .catch(() => undefined);
  }, []);

  const size = dimensions(page || initial.pages[0]);
  const pageIndex = s.book?.pageIds.indexOf(page?.id || '') ?? -1;
  async function run(task: () => Promise<void>, save = true) {
    setBusy(true);
    try {
      if (save && !(await flushEditor())) return;
      await task();
    } catch (e) {
      useEditor.setState({ error: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }
  function performCommand(command: EditorCommand) {
    if (!page || !s.book) return;
    const editSelected = (fn: (el: PageElement) => PageElement) =>
      s.edit((p) => ({
        ...p,
        elements: p.elements.map((el) =>
          s.selected.includes(el.id) && !el.locked ? fn(el) : el,
        ),
      }));
    const directions: Record<string, [number, number]> = {
      moveLeft: [-1, 0],
      moveRight: [1, 0],
      moveUp: [0, -1],
      moveDown: [0, 1],
      moveLeft10: [-10, 0],
      moveRight10: [10, 0],
      moveUp10: [0, -10],
      moveDown10: [0, 10],
    };
    if (directions[command]) {
      const [dx, dy] = directions[command];
      editSelected((el) => ({
        ...el,
        x: Math.max(-297, Math.min(594, el.x + dx)),
        y: Math.max(-297, Math.min(594, el.y + dy)),
      }));
      return;
    }
    switch (command) {
      case 'undo':
        s.undo();
        break;
      case 'redo':
        s.redo();
        break;
      case 'save':
        void flushEditor();
        break;
      case 'files':
        setShowFiles(true);
        break;
      case 'help':
        setShowShortcuts(true);
        break;
      case 'nextPage':
        if (pageIndex < s.pages.length - 1)
          choosePage(s.book.pageIds[pageIndex + 1]);
        break;
      case 'prevPage':
        if (pageIndex > 0) choosePage(s.book.pageIds[pageIndex - 1]);
        break;
      case 'firstPage':
        choosePage(s.book.pageIds[0]);
        break;
      case 'lastPage':
        choosePage(s.book.pageIds[s.pages.length - 1]);
        break;
      case 'newPage':
        void run(() => add());
        break;
      case 'readPage':
        speakGerman(
          page.elements
            .filter((el) => el.type === 'text')
            .map((el) => el.text)
            .join('. '),
        );
        break;
      case 'addText':
        insertText();
        break;
      case 'addImage':
        setShowImages(true);
        break;
      case 'addAudio':
        setShowAudio(true);
        break;
      case 'addEmbed':
        setShowEmbed(true);
        break;
      case 'pen':
        if (s.tool === 'pen') useEditor.setState({ tool: 'select' });
        else s.chooseBrush(s.brush === 'marker' ? 'pen' : s.brush);
        break;
      case 'shelf':
        setShowCollection(true);
        break;
      case 'pagePanel':
        s.select([]);
        break;
      case 'itemsPanel': {
        const details = document.querySelector(
          '.element-list',
        ) as HTMLDetailsElement;
        if (details) details.open = !details.open;
        break;
      }
      case 'selectNext':
      case 'selectPrev': {
        const at = page.elements.findIndex((el) => el.id === s.selected[0]),
          delta = command === 'selectNext' ? 1 : -1;
        if (page.elements.length)
          s.select([
            page.elements[
              (at + delta + page.elements.length) % page.elements.length
            ].id,
          ]);
        break;
      }
      case 'selectAll':
        s.select(page.elements.filter((el) => !el.locked).map((el) => el.id));
        break;
      case 'activate':
        if (first?.type === 'widget' || first?.type === 'activity')
          setLearning(first);
        else if (first?.type === 'text') textArea.current?.focus();
        break;
      case 'copy':
        setClipboard(clone(selected));
        break;
      case 'paste':
      case 'duplicate': {
        const elements = cloneElements(
          command === 'paste' ? clipboard : selected,
        );
        s.edit((p) => ({ ...p, elements: [...p.elements, ...elements] }));
        s.select(elements.map((el) => el.id));
        break;
      }
      case 'delete':
        s.edit((p) => ({
          ...p,
          elements: p.elements.filter(
            (el) => el.locked || !s.selected.includes(el.id),
          ),
        }));
        s.select([]);
        break;
      case 'group':
        s.patchElements({ groupId: uuid() });
        break;
      case 'ungroup':
        s.patchElements({ groupId: undefined });
        break;
      case 'front':
        layer(true);
        break;
      case 'back':
        layer(false);
        break;
      case 'lock':
        s.edit((p) => ({
          ...p,
          elements: p.elements.map((el) =>
            s.selected.includes(el.id)
              ? { ...el, locked: !selected.every((el) => el.locked) }
              : el,
          ),
        }));
        break;
      case 'rotateLeft':
      case 'rotateRight':
        editSelected((el) => ({
          ...el,
          rotation:
            (el.rotation + (command === 'rotateLeft' ? -15 : 15) + 360) % 360,
        }));
        break;
      case 'bigger':
      case 'smaller': {
        const factor = command === 'bigger' ? 1.1 : 1 / 1.1;
        editSelected((el) => {
          const width = Math.max(1, Math.min(500, el.width * factor)),
            height = Math.max(1, Math.min(500, el.height * factor));
          return {
            ...el,
            width,
            height,
            points: el.points?.map((p) => ({
              ...p,
              x: (p.x * width) / el.width,
              y: (p.y * height) / el.height,
            })),
          };
        });
        break;
      }
      case 'zoomIn':
        setZoom((z) => Math.min(3, z + 0.1));
        break;
      case 'zoomOut':
        setZoom((z) => Math.max(0.2, z - 0.1));
        break;
      case 'zoomFit': {
        const paper = surface.current?.getBoundingClientRect(),
          area = surface.current?.closest('.canvas-scroll');
        if (paper && area)
          setZoom((z) =>
            Math.max(
              0.2,
              Math.min(
                3,
                z *
                  Math.min(
                    (area.clientHeight - 30) / paper.height,
                    (area.clientWidth - 40) / paper.width,
                  ),
              ),
            ),
          );
        break;
      }
      case 'board':
      case 'boardNow':
        cancelDrawingGesture(); setBoardPointer('none');
        setBoard(true);
        setBoardDraw(command === 'boardNow');
        if (command === 'boardNow') s.chooseBrush(s.brush === 'fill' ? 'pen' : s.brush);
        else useEditor.setState({ tool: 'select', selected: [] });
        break;
      case 'escape':
        if (board && boardPointer !== 'none') { setBoardPointer('none'); break; }
        cancelDrawingGesture(); setBoard(false);
        setBoardDraw(false);
        s.select([]);
        break;
    }
  }
  function cancelDrawingGesture() {
    const active = gesture.current;
    gesture.current = null;
    if (active && surface.current?.hasPointerCapture(active.pointer)) surface.current.releasePointerCapture(active.pointer);
    recognition.cancel(); setDraft(null); setPreview(null); setErasePreview(null);
  }
  function presentation(mode: BoardPointerMode) {
    cancelDrawingGesture();
    setBoardDraw(false); setBoardPointer(mode);
    useEditor.setState({ tool: 'select', selected: [] });
  }
  function choosePage(id: string) {
    cancelDrawingGesture();
    useEditor.setState({ activeId: id, selected: [], past: [], future: [] });
    setPreview(null);
    setDraft(null);
  }
  async function add(input: Page = newPage(page!.ruling, page!.orientation)) {
    const result = await api<{ book: Notebook; page: Page }>('addPage', {
      id: s.book!.id,
      page: input,
      afterId: useEditor.getState().activeId,
    });
    const pages = [...useEditor.getState().pages, result.page];
    useEditor.setState({
      book: result.book,
      pages: result.book.pageIds.map((id) => pages.find((p) => p.id === id)!),
    });
    choosePage(result.page.id);
    setShowTemplates(false);
  }
  async function reorder(delta: number) {
    const ids = [...s.book!.pageIds];
    const to = pageIndex + delta;
    if (to < 0 || to >= ids.length) return;
    [ids[pageIndex], ids[to]] = [ids[to], ids[pageIndex]];
    const book = await api<Notebook>('update', {
      id: s.book!.id,
      revision: s.book!.revision,
      pageIds: ids,
    });
    useEditor.setState({
      book,
      pages: ids.map(
        (id) => useEditor.getState().pages.find((p) => p.id === id)!,
      ),
    });
  }
  function insert(el: PageElement) {
    s.edit((p) => ({ ...p, elements: [...p.elements, el] }));
    s.select([el.id]);
    useEditor.setState({ tool: 'select' });
  }
  function insertText() {
    insert({
      id: uuid(),
      type: 'text',
      x: 20,
      y: 20,
      width: Math.min(130, size.width - 30),
      height: 28,
      rotation: 0,
      locked: false,
      color: s.color,
      text: 'Hier steht dein Text.',
      font: 'Andika',
      fontSize: 18,
      bold: false,
    });
    setTimeout(() => {
      textArea.current?.focus();
      textArea.current?.select();
    }, 50);
  }
  function insertImage(src: string) {
    const image = new Image();
    image.onload = () => {
      const width = Math.min(90, size.width - 40);
      const height = Math.min(
        (width * image.height) / image.width,
        size.height - 40,
      );
      insert({
        id: uuid(),
        type: 'image',
        x: 20,
        y: 25,
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
    image.onerror = () =>
      useEditor.setState({ error: 'Das Bild konnte nicht geöffnet werden.' });
    image.src = src;
  }
  function pointer(event: React.PointerEvent): Point {
    const samples = pointerSamples(event.nativeEvent, surface.current!.getBoundingClientRect(), size.width, size.height);
    return samples[samples.length - 1];
  }

  function start(
    event: React.PointerEvent,
    element?: PageElement,
    resize = false,
  ) {
    if (gesture.current || (board && !boardDraw) || event.button !== 0) return;
    if (s.tool !== 'select' && s.pencilOnly && event.pointerType !== 'pen')
      return;
    event.preventDefault();
    event.stopPropagation();
    const point = pointer(event);
    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);
    if (s.tool === 'pen' && s.brush === 'fill') return;
    if (s.tool === 'pen' || s.tool === 'marker') {
      recognition.cancel();
      const guideEdge = s.tool === 'marker' || !['water', 'fill'].includes(s.brush) ? captureGuideEdge(point, guide, s.penWidth) : undefined;
      const initialPoint = guideEdge ? projectToGuideEdge(point, guideEdge) : point;
      const stroke = newStroke(initialPoint, size.width, size.height, s, event.pointerType);
      gesture.current = {
        stroke,
        guideEdge,
        type: 'draw',
        start: initialPoint,
        points: [initialPoint],
        originals: [],
        pointer: event.pointerId,
      };
      setDraft(stroke);
    } else if (s.tool === 'eraser') {
      gesture.current = {
        type: 'erase',
        eraserId: uuid(),
        eraserProgress: { checked: 0, hits: new Set() },
        eraserOptions: s.eraser,
        start: point,
        points: [point],
        originals: page!.elements,
        pointer: event.pointerId,
      };
      erase();
    } else if (element) {
      let ids = s.selected.includes(element.id)
        ? s.selected
        : element.groupId
          ? page!.elements
              .filter((el) => el.groupId === element.groupId)
              .map((el) => el.id)
          : [element.id];
      if (multi || event.shiftKey) {
        ids = s.selected.includes(element.id)
          ? s.selected.filter((id) => id !== element.id)
          : [...s.selected, element.id];
        s.select(ids);
        return;
      }
      s.select(ids);
      if (element.locked) return;
      const originals = page!.elements.filter(
        (el) => ids.includes(el.id) && !el.locked,
      );
      gesture.current = {
        type: resize ? 'resize' : 'move',
        start: point,
        originals,
        points: [],
        pointer: event.pointerId,
      };
    } else s.select([]);
  }
  function erase() {
    const g = gesture.current;
    if (g?.type === 'erase') setErasePreview(eraseElements(g.originals, g.points, g.eraserId!, g.eraserOptions!, g.eraserProgress));
  }
  function move(event: React.PointerEvent) {
    const g = gesture.current;
    if (!g || g.pointer !== event.pointerId) return;
    event.preventDefault();
    let samples = pointerSamples(event.nativeEvent, surface.current!.getBoundingClientRect(), size.width, size.height);
    if (g.guideEdge) samples = samples.map(point => projectToGuideEdge(point, g.guideEdge!));
    const point = samples[samples.length - 1];
    if (g.type === 'draw' || g.type === 'erase') {
      appendSamples(g.points, samples);
      if (g.type === 'erase') erase();
      else if (g.guideEdge) setDraft(el => el ? { ...el, points: [...g.points] } : null);
      else recognition.update(g.points, shape => setDraft({ ...g.stroke!, points: shape?.points || [...g.points], geometry: shape?.kind }), surface.current!.getBoundingClientRect().width / size.width, previousArrowShaft(page!.elements, g.stroke!));
    }
    else {
      const dx = point.x - g.start.x,
        dy = point.y - g.start.y;
      setPreview(
        g.originals.map((el) => {
          if (g.type === 'move')
            return {
              ...el,
              x: Math.max(-el.width + 5, Math.min(size.width - 5, el.x + dx)),
              y: Math.max(-el.height + 5, Math.min(size.height - 5, el.y + dy)),
            };
          const angle = (-el.rotation * Math.PI) / 180;
          const width = Math.max(
            3,
            Math.min(
              400,
              el.width + dx * Math.cos(angle) - dy * Math.sin(angle),
            ),
          );
          const height = Math.max(
            3,
            Math.min(
              400,
              el.height + dx * Math.sin(angle) + dy * Math.cos(angle),
            ),
          );
          return {
            ...el,
            width,
            height,
            points: el.points?.map((p) => ({
              ...p,
              x: (p.x * width) / el.width,
              y: (p.y * height) / el.height,
            })),
          };
        }),
      );
    }
  }
  function end(event: React.PointerEvent, cancel = false) {
    const g = gesture.current;
    if (!g || g.pointer !== event.pointerId) return;
    if (!cancel && (g.type === 'draw' || g.type === 'erase')) {
      let samples = pointerSamples(event.nativeEvent, surface.current!.getBoundingClientRect(), size.width, size.height);
      if (g.guideEdge) samples = samples.map(point => projectToGuideEdge(point, g.guideEdge!));
      appendSamples(g.points, samples);
    }
    const recognized = !cancel && g.type === 'draw' && !g.guideEdge ? recognition.finish(g.points) : null;
    recognition.cancel();
    gesture.current = null;
    if (!cancel && g.type === 'draw' && g.stroke)
      s.edit((p) => ({
        ...p,
        elements: [
          ...p.elements.filter(el => el.id !== recognized?.replaceId),
          compactStroke({ ...g.stroke!, points: recognized?.points || [...g.points], geometry: recognized?.kind }),
        ],
      }));
    if (!cancel && g.type === 'erase')
      s.edit(p => ({ ...p, elements: eraseElements(g.originals, g.points, g.eraserId!, g.eraserOptions!, g.eraserProgress) }));
    if (!cancel && preview && (g.type === 'move' || g.type === 'resize'))
      s.edit((p) => ({
        ...p,
        elements: p.elements.map(
          (el) => preview.find((n) => n.id === el.id) || el,
        ),
      }));
    setDraft(null);
    setPreview(null);
    setErasePreview(null);
  }
  function layer(front: boolean) {
    s.edit((p) => {
      const chosen = p.elements.filter(
        (el) => s.selected.includes(el.id) && !el.locked,
      );
      const rest = p.elements.filter((el) => !chosen.includes(el));
      return {
        ...p,
        elements: front ? [...rest, ...chosen] : [...chosen, ...rest],
      };
    });
  }
  function patchGeometry(key: 'width' | 'height', value: number) {
    s.edit((p) => ({
      ...p,
      elements: p.elements.map((el) =>
        s.selected.includes(el.id) && !el.locked
          ? {
              ...el,
              [key]: value,
              points: el.points?.map((point) => ({
                ...point,
                x: key === 'width' ? (point.x * value) / el.width : point.x,
                y: key === 'height' ? (point.y * value) / el.height : point.y,
              })),
            }
          : el,
      ),
    }));
  }
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (
        event.key === 'Tab' &&
        event.target instanceof HTMLElement &&
        event.target.closest('button,a,summary')
      )
        return;
      if (
        event.target instanceof HTMLElement &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) ||
          event.target.isContentEditable)
      )
        return;
      if (
        showImages ||
        showTemplates ||
        showAudio ||
        showCollection ||
        showGenerator ||
        showShare ||
        learning ||
        showElements ||
        showEmbed ||
        showFiles ||
        showShortcuts
      )
        return;
      const chord = keyChord(event);
      const command = (Object.keys(shortcuts) as EditorCommand[]).find(
        (id) => shortcuts[id] === chord,
      );
      if (command) {
        event.preventDefault();
        performCommand(command);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });
  if (!ready || !page || !s.book)
    return (
      <main className="seite">
        <p>Heft wird geöffnet …</p>
      </main>
    );
  return (
    <main
      className={`editor ${board ? `board-mode ${page.orientation === 'landscape' ? 'board-landscape' : ''}` : ''}`}
    >
      <header className="editor-header">
        <button
          className="back-button"
          disabled={busy}
          onClick={() =>
            run(async () => {
              window.location.assign('/');
            })
          }
        >
          ‹ <span>Mein Regal</span>
        </button>
        <span className="header-divider" />
        <input
          className="book-title"
          aria-label="Heftname"
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (title.trim() && title.trim() !== s.book!.title)
              void run(async () => {
                const book = await api<Notebook>('update', {
                  id: s.book!.id,
                  revision: s.book!.revision,
                  title,
                });
                useEditor.setState({ book });
              });
          }}
        />
        <span
          className={`save-status ${s.error ? 'save-error' : ''}`}
          role="status"
        >
          {s.error
            ? '⚠ Nicht gespeichert'
            : s.saving
              ? 'Speichert …'
              : Object.keys(s.dirty).length
                ? 'Änderungen …'
                : '✓ Gespeichert'}
        </span>
        <button
          className="knopf compact"
          onClick={() => {
            cancelDrawingGesture(); setBoardPointer('none'); setBoard(true);
            setBoardDraw(false);
            useEditor.setState({ tool: 'select', selected: [] });
            document.documentElement
              .requestFullscreen?.()
              .catch(() => undefined);
          }}
        >
          ⛶ Tafelmodus
        </button>
        <button
          className="knopf compact"
          disabled={busy}
          onClick={() =>
            run(async () => {
              setShowShare(true);
            })
          }
        >
          Weitergeben
        </button>
        <button
          className="knopf compact"
          disabled={busy}
          onClick={() =>
            run(async () => {
              window.location.assign(`/drucken/${s.book!.id}`);
            })
          }
        >
          Drucken / PDF
        </button>
      </header>
      {s.error && (
        <div className="error-banner" role="alert">
          {s.error}
          <button className="knopf compact" onClick={() => void flushEditor()}>
            Erneut speichern
          </button>
          {s.conflict && (
            <button
              className="knopf compact"
              onClick={() =>
                run(async () => {
                  const target = s.pages.find((p) => p.id === s.conflictPageId);
                  if (!target) return;
                  await add(target);
                  const fresh = await api<BookData>('open', { id: s.book!.id });
                  const dirty = { ...useEditor.getState().dirty };
                  delete dirty[target.id];
                  const current = useEditor.getState();
                  useEditor.setState({
                    pages: current.pages.map((p) =>
                      p.id === target.id
                        ? fresh.pages.find((saved) => saved.id === p.id)!
                        : p,
                    ),
                    dirty,
                    conflict: false,
                    conflictPageId: '',
                    error: '',
                  });
                }, false)
              }
            >
              Diese Fassung als neue Seite sichern
            </button>
          )}
        </div>
      )}
      <nav className="editor-toolbar" aria-label="Werkzeuge">
        <div className="tool-group">
          {(
            [
              ['select', '↖', 'Auswahl'],
              ['pen', '✎', 'Stift'],
              ['marker', '▰', 'Textmarker'],
              ['eraser', '⌫', 'Radierer'],
            ] as const
          ).map(([tool, icon, label]) => (
            <button
              key={tool}
              className="tool"
              aria-pressed={s.tool === tool}
              onClick={() => {
                if (tool === 'marker') s.chooseBrush('marker');
                else if (tool === 'pen') s.chooseBrush(s.brush === 'marker' ? 'pen' : s.brush);
                useEditor.setState({ tool });
                if (tool !== 'select') s.select([]);
              }}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
        <div className="tool-group">
          <button className="tool" onClick={insertText}>
            <span>T</span>Text
          </button>
          <button className="tool" onClick={() => setShowImages(true)}>
            <span>▧</span>Bild
          </button>
          <button className="tool" onClick={() => setShowTemplates(true)}>
            <span>▤</span>Vorlagen
          </button>
          <button className="tool" onClick={() => setShowGenerator(true)}>
            <span>＋</span>Arbeitsblatt
          </button>
          <button className="tool" onClick={() => setShowCollection(true)}>
            <span>☆</span>Sammlung
          </button>
          <button className="tool" onClick={() => setShowAudio(true)}>
            <span>♫</span>Ton
          </button>
          <button
            className="tool"
            onClick={() =>
              insert({
                id: uuid(),
                type: 'text',
                x: 20,
                y: 20,
                width: 65,
                height: 20,
                rotation: -5,
                locked: true,
                color: '#477e4a',
                text: '★ Gut gemacht!',
                font: 'Andika',
                fontSize: 21,
                bold: true,
              })
            }
          >
            <span>☆</span>Stempel
          </button>
        </div>
        <div className="tool-group">
          <button className="tool" onClick={() => setLearning('new')}>
            <span>◈</span>Lernwerkzeuge
          </button>
          <button className="tool" onClick={() => setShowElements(true)}>
            <span>◇</span>Formen
          </button>
          <button className="tool" onClick={() => setShowEmbed(true)}>
            <span>↗</span>Internet
          </button>
          <button className="tool" onClick={() => setShowFiles(true)}>
            <span>⇅</span>Dateien
          </button>
          <button className="tool" onClick={() => setShowShortcuts(true)}>
            <span>?</span>Hilfe
          </button>
          <label className="tool color-tool">
            <input
              type="color"
              aria-label="Stiftfarbe"
              value={s.color}
              onChange={(e) => useEditor.setState({ color: e.target.value })}
            />
            Farbe
          </label>
        </div>
        <DrawingGuideTools guide={guide} onChange={setGuide} />
        <DrawingOptions allowFill />
        {!board && <PageEyedropper key={page.id} surface={surface} />}
        <PageFillTool key={`fill-${page.id}`} surface={surface} disabled={board && !boardDraw} />
        {draft?.geometry && (s.tool === 'pen' || s.tool === 'marker') && <span role="status">Form erkannt – zum Übernehmen loslassen.</span>}
        <div className="tool-group">
          <button className="tool" disabled={!s.past.length} onClick={s.undo}>
            <span>↶</span>Zurück
          </button>
          <button className="tool" disabled={!s.future.length} onClick={s.redo}>
            <span>↷</span>Wiederholen
          </button>
        </div>
        <label className="pencil-only">
          <input
            type="checkbox"
            checked={s.pencilOnly}
            onChange={(e) =>
              useEditor.setState({ pencilOnly: e.target.checked })
            }
          />{' '}
          Nur Stift zeichnet
        </label>
      </nav>
      <div className="editor-workspace">
        <aside className="page-sidebar">
          <div className="sidebar-heading">
            <strong>Seiten</strong>
            <span>{s.pages.length}</span>
          </div>
          <div className="page-thumbnails">
            {s.book.pageIds.map((id, index) => {
              const p = s.pages.find((p) => p.id === id)!;
              return (
                <button
                  key={id}
                  className={`page-thumbnail ${page.id === id ? 'active' : ''}`}
                  aria-label={`Seite ${index + 1} öffnen`}
                  aria-current={page.id === id ? 'page' : undefined}
                  disabled={busy}
                  onClick={() => {
                    choosePage(id);
                  }}
                >
                  <ScaledPage page={p} decorative />
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </button>
              );
            })}
          </div>
          <button
            className="knopf add-page"
            disabled={busy}
            onClick={() => run(() => add())}
          >
            ＋ Seite
          </button>
          <button
            className="sidebar-link"
            onClick={() => setShowTemplates(true)}
          >
            Aus Vorlage einfügen
          </button>
        </aside>
        <section className="canvas-area">
          <div className="canvas-caption">
            <span>
              {rulings[page.ruling]} <i>·</i> A4{' '}
              {page.orientation === 'portrait' ? 'Hochformat' : 'Querformat'}
            </span>
            <span>
              Seite {pageIndex + 1} von {s.pages.length}
            </span>
          </div>
          <div className="canvas-scroll">
            <div className="canvas-sheet">
              <ScaledPage
                page={page}
                maxScale={board ? 1.8 : 1}
                zoom={board ? 1 : zoom}
              >
                <LearningRuntime
                  interactive={boardPointer === 'none' && (s.tool === 'select' || (board && !boardDraw))}
                  allowExternal
                  onResponse={(id, response) =>
                    s.edit((p) => ({
                      ...p,
                      elements: p.elements.map((el) =>
                        el.id === id ? { ...el, response } : el,
                      ),
                    }))
                  }
                  onRecord={(id) => {
                    setRecordTarget(id);
                    setShowAudio(true);
                  }}
                >
                  <div
                    className={`interaction-surface tool-${s.tool}`}
                    ref={surface}
                    style={{
                      touchAction:
                        s.tool !== 'select'
                          ? s.pencilOnly
                            ? 'pan-x pan-y'
                            : 'none'
                          : 'none',
                    }}
                    onPointerDown={(e) => start(e)}
                    onPointerMove={move}
                    onPointerUp={(e) => end(e)}
                    onPointerCancel={(e) => end(e, true)}
                    onLostPointerCapture={(e) => end(e, true)}
                  >
                    {inkPaintOrder((erasePreview || page.elements).filter(el => el.id !== recognition.replaceId), draft).map((el) => (
                      <ElementView
                        key={el.id}
                        element={preview?.find((p) => p.id === el.id) || el}
                        className={`${s.selected.includes(el.id) && !board ? 'selected' : ''} ${el.locked ? 'locked' : ''}`}
                        onPointerDown={(e) => start(e, el)}
                        onDoubleClick={() => {
                          if (el.type === 'text' && !el.locked)
                            textArea.current?.focus();
                        }}
                        style={{
                          pointerEvents:
                            s.tool === 'select' && el.type !== 'stroke'
                              ? 'auto'
                              : 'none',
                        }}
                      >
                        {undefined}
                      </ElementView>
                    ))}
                    {page.elements
                      .filter((el) => s.selected.includes(el.id))
                      .map((el) => {
                        const rendered =
                          preview?.find((p) => p.id === el.id) || el;
                        return (
                          <div
                            key={`handle-${el.id}`}
                            className={`selection-handles ${el.locked ? 'locked' : ''}`}
                            style={{
                              left: `${rendered.x}mm`,
                              top: `${rendered.y}mm`,
                              width: `${rendered.width}mm`,
                              height: `${rendered.height}mm`,
                              transform: `rotate(${rendered.rotation}deg)`,
                            }}
                          >
                            {!el.locked && !board && (
                              <button
                                className="move-element-handle"
                                aria-label="Element verschieben"
                                onPointerDown={(e) => start(e, el)}
                                onPointerMove={move}
                                onPointerUp={(e) => end(e)}
                                onPointerCancel={(e) => end(e, true)}
                              >
                                ↔ Verschieben
                              </button>
                            )}
                            {!el.locked && !board && (
                              <button
                                className="resize-handle"
                                aria-label="Element vergrößern"
                                onPointerDown={(e) => start(e, el, true)}
                                onPointerMove={move}
                                onPointerUp={(e) => end(e)}
                                onPointerCancel={(e) => end(e, true)}
                              />
                            )}
                            {el.locked && (
                              <span className="lock-indicator">Gesperrt</span>
                            )}
                          </div>
                        );
                      })}
                    {guide && (!board || boardPointer === 'none') && <DrawingRuler guide={guide} onChange={setGuide} onClose={() => setGuide(null)} />}
                    {board && boardPointer !== 'none' && <BoardPointer key={`${page.id}-${boardPointer}`} mode={boardPointer} width={size.width} height={size.height} size={lightSize} onClose={() => setBoardPointer('none')} />}
                  </div>
                </LearningRuntime>
              </ScaledPage>
            </div>
          </div>
          <div className="canvas-bottom">
            <div className="zoom-controls">
              <button
                aria-label="Ansicht verkleinern"
                onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))}
              >
                −
              </button>
              <span className="zoom-value">{Math.round(zoom * 100)} %</span>
              <button
                aria-label="Ansicht vergrößern"
                onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              >
                ＋
              </button>
              <button
                onClick={() => {
                  const paper = surface.current?.getBoundingClientRect(),
                    area = surface.current?.closest('.canvas-scroll');
                  if (paper && area)
                    setZoom((z) =>
                      Math.max(
                        0.2,
                        Math.min(
                          3,
                          z *
                            Math.min(
                              (area.clientHeight - 30) / paper.height,
                              (area.clientWidth - 40) / paper.width,
                            ),
                        ),
                      ),
                    );
                }}
              >
                Ganze Seite
              </button>
            </div>
            <span>
              {s.tool === 'eraser'
                ? s.eraser.mode === 'area' ? 'Radiere nur die überfahrene Stelle. Bilder und Texte bleiben erhalten.' : 'Radierer entfernt ganze Striche. Gesperrte Elemente bleiben erhalten.'
                : s.tool === 'select'
                  ? 'Element antippen · am Eckpunkt vergrößern'
                  : 'Direkt auf der Seite zeichnen'}
            </span>
            <span>Maße in Millimetern</span>
          </div>
        </section>
        <aside className="properties">
          <details className="element-list">
            <summary>Elemente der Seite ({page.elements.length})</summary>
            {page.elements.map((el, i) => (
              <button
                key={el.id}
                className="sidebar-link"
                onClick={() => {
                  useEditor.setState({ tool: 'select' });
                  s.select([el.id]);
                }}
              >
                {i + 1}.{' '}
                {el.text?.slice(0, 25) ||
                  el.settings?.title ||
                  el.alt ||
                  (
                    {
                      text: 'Text',
                      image: 'Bild',
                      stroke: 'Zeichnung',
                      audio: 'Ton',
                      shape: 'Form',
                      sticker: 'Symbol',
                      widget: 'Lernwerkzeug',
                      activity: 'Übung',
                      embed: 'Einbettung',
                    } as Record<string, string>
                  )[el.type]}
                {el.locked ? ' · gesperrt' : ''}
              </button>
            ))}
          </details>
          <h2>
            {selected.length
              ? `${selected.length === 1 ? 'Element' : `${selected.length} Elemente`}`
              : 'Deine Seite'}
          </h2>
          {selected.length ? (
            <>
              {first?.type === 'text' && (
                <>
                  <label className="property-label">
                    Text
                    <textarea
                      aria-label="Text"
                      ref={textArea}
                      value={first.text}
                      disabled={first.locked}
                      onChange={(e) =>
                        s.patchElements({
                          text: e.target.value,
                          runs: undefined,
                        })
                      }
                    />
                  </label>
                  <label className="property-label">
                    Schrift
                    <select
                      aria-label="Schrift"
                      value={first.font}
                      disabled={first.locked}
                      onChange={(e) =>
                        s.patchElements({
                          font: e.target.value as PageElement['font'],
                        })
                      }
                    >
                      {Object.entries(fonts).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="property-row">
                    <label>
                      Größe (pt)
                      <input
                        type="number"
                        min="6"
                        max="150"
                        value={first.fontSize}
                        disabled={first.locked}
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          if (n >= 6 && n <= 150)
                            s.patchElements({ fontSize: n });
                        }}
                      />
                    </label>
                    <button
                      className="knopf"
                      disabled={first.locked}
                      aria-pressed={first.bold}
                      onClick={() => s.patchElements({ bold: !first.bold })}
                    >
                      <strong>Fett</strong>
                    </button>
                  </div>
                </>
              )}
              {(first?.type === 'image' || first?.type === 'audio') && (
                <label className="property-label">
                  Bildbeschreibung
                  <input
                    value={first.alt || ''}
                    maxLength={300}
                    disabled={first.locked}
                    onChange={(e) => s.patchElements({ alt: e.target.value })}
                  />
                </label>
              )}
              {first && (
                <>
                  <div className="property-row">
                    {(['width', 'height'] as const).map((key) => (
                      <label key={key}>
                        {key === 'width' ? 'Breite' : 'Höhe'} (mm)
                        <input
                          type="number"
                          min="1"
                          max="400"
                          step="1"
                          value={Math.round(first[key] * 10) / 10}
                          disabled={first.locked}
                          onChange={(e) => {
                            const n = Number(e.target.value);
                            if (n >= 1 && n <= 400) patchGeometry(key, n);
                          }}
                        />
                      </label>
                    ))}
                  </div>
                  <label className="property-label">
                    Drehung · {Math.round(first.rotation)}°
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={first.rotation}
                      disabled={first.locked}
                      onChange={(e) =>
                        s.patchElements({ rotation: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="property-label">
                    Farbe
                    <input
                      type="color"
                      value={first.color}
                      disabled={first.locked}
                      onChange={(e) =>
                        s.patchElements({ color: e.target.value })
                      }
                    />
                  </label>
                </>
              )}
              <div className="property-row">
                <button className="knopf compact" onClick={() => layer(true)}>
                  Nach vorn
                </button>
                <button className="knopf compact" onClick={() => layer(false)}>
                  Nach hinten
                </button>
              </div>
              <button
                className="knopf property-button"
                onClick={() =>
                  s.edit((p) => ({
                    ...p,
                    elements: p.elements.map((el) =>
                      s.selected.includes(el.id)
                        ? { ...el, locked: !selected.every((el) => el.locked) }
                        : el,
                    ),
                  }))
                }
              >
                {selected.every((el) => el.locked) ? 'Entsperren' : 'Sperren'}
              </button>
              <div className="property-row">
                <button
                  className="knopf compact"
                  onClick={() => {
                    setClipboard(clone(selected));
                  }}
                >
                  Kopieren
                </button>
                <button
                  className="knopf compact"
                  disabled={!clipboard.length}
                  onClick={() => {
                    const elements = cloneElements(clipboard);
                    s.edit((p) => ({
                      ...p,
                      elements: [...p.elements, ...elements],
                    }));
                    s.select(elements.map((el) => el.id));
                  }}
                >
                  Einfügen
                </button>
              </div>
              <button
                className="knopf property-button"
                onClick={() => {
                  const name = prompt('Name für die Sammlung');
                  if (name?.trim())
                    void run(async () => {
                      await api('asset', {
                        title: name,
                        page: { ...page, elements: selected },
                      });
                      setShowCollection(true);
                    });
                }}
              >
                In Sammlung sichern
              </button>
              <button
                className="knopf property-button danger-text"
                disabled={selected.every((el) => el.locked)}
                onClick={() => {
                  s.edit((p) => ({
                    ...p,
                    elements: p.elements.filter(
                      (el) => el.locked || !s.selected.includes(el.id),
                    ),
                  }));
                  s.select([]);
                }}
              >
                Elemente entfernen
              </button>
              <button className="sidebar-link" onClick={() => s.select([])}>
                Seiteneinstellungen
              </button>
            </>
          ) : (
            <>
              <p className="property-hint">
                Ein Blatt für deine nächste Unterrichtsidee.
              </p>
              <label className="property-label">
                Lineatur
                <select
                  aria-label="Lineatur"
                  value={page.ruling}
                  onChange={(e) =>
                    s.edit((p) => ({
                      ...p,
                      ruling: e.target.value as Page['ruling'],
                    }))
                  }
                >
                  {Object.entries(rulings).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="property-label">
                Format
                <select
                  aria-label="Format"
                  value={page.orientation}
                  onChange={(e) =>
                    s.edit((p) => ({
                      ...p,
                      orientation: e.target.value as Page['orientation'],
                    }))
                  }
                >
                  <option value="portrait">A4 · Hochformat</option>
                  <option value="landscape">A4 · Querformat</option>
                </select>
              </label>
              <div className="property-divider" />
              <button
                className="knopf property-button"
                disabled={busy}
                onClick={() =>
                  run(() =>
                    add({ ...page, elements: cloneElements(page.elements, 0) }),
                  )
                }
              >
                Seite duplizieren
              </button>
              <div className="property-row">
                <button
                  className="knopf compact"
                  disabled={busy || pageIndex === 0}
                  onClick={() => run(() => reorder(-1))}
                >
                  ↑ Früher
                </button>
                <button
                  className="knopf compact"
                  disabled={busy || pageIndex === s.pages.length - 1}
                  onClick={() => run(() => reorder(1))}
                >
                  ↓ Später
                </button>
              </div>
              <button
                className="knopf property-button danger-text"
                disabled={busy || s.pages.length < 2}
                onClick={() => {
                  if (
                    window.confirm(
                      `Seite ${pageIndex + 1} endgültig entfernen?`,
                    )
                  )
                    void run(async () => {
                      const book = await api<Notebook>('update', {
                        id: s.book!.id,
                        revision: s.book!.revision,
                        pageIds: s.book!.pageIds.filter((id) => id !== page.id),
                      });
                      useEditor.setState({
                        book,
                        pages: s.pages.filter((p) => p.id !== page.id),
                      });
                      choosePage(book.pageIds[Math.max(0, pageIndex - 1)]);
                    });
                }}
              >
                Seite löschen
              </button>
              <div className="property-divider" />
              <label className="property-label">
                Als eigene Vorlage
                <input
                  placeholder="Name der Vorlage"
                  maxLength={120}
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </label>
              <button
                className="knopf property-button"
                disabled={busy || !templateName.trim()}
                onClick={() =>
                  run(async () => {
                    const template = await api<Template>('template', {
                      title: templateName,
                      page,
                    });
                    setTemplates([...templates, template]);
                    setTemplateName('');
                    setShowTemplates(true);
                  })
                }
              >
                Vorlage speichern
              </button>
              {clipboard.length > 0 && (
                <button
                  className="knopf property-button"
                  onClick={() => {
                    const elements = cloneElements(clipboard);
                    s.edit((p) => ({
                      ...p,
                      elements: [...p.elements, ...elements],
                    }));
                    s.select(elements.map((el) => el.id));
                  }}
                >
                  Elemente einfügen
                </button>
              )}
            </>
          )}
          <div className="property-divider" />
          <Inspector element={first} onConfigure={setLearning} />
          {selected.length > 1 && (
            <div className="property-row">
              <button
                className="knopf compact"
                onClick={() => {
                  const groupId = uuid();
                  s.patchElements({ groupId });
                }}
              >
                Gruppieren
              </button>
              <button
                className="knopf compact"
                onClick={() => s.patchElements({ groupId: undefined })}
              >
                Gruppe lösen
              </button>
            </div>
          )}
          <label className="multi-select">
            <input
              type="checkbox"
              checked={multi}
              onChange={(e) => setMulti(e.target.checked)}
            />{' '}
            Mehrfachauswahl
          </label>
        </aside>
      </div>
      {board && (
        <div className="board-controls" role="group" aria-label="Tafelwerkzeuge">
          <button
            className="knopf"
            aria-pressed={boardDraw}
            onClick={() => {
              cancelDrawingGesture(); setBoardPointer('none');
              setBoardDraw(!boardDraw);
              if (boardDraw) useEditor.setState({ tool: 'select', selected: [] });
              else s.chooseBrush(s.brush === 'fill' ? 'pen' : s.brush);
            }}
          >
            {boardDraw ? '✓ Zeichnen beenden' : '✎ Auf der Tafel schreiben'}
          </button>
          <button className="knopf" aria-pressed={boardPointer === 'laser'} onClick={() => presentation(boardPointer === 'laser' ? 'none' : 'laser')}>Laserpointer</button>
          <button className="knopf" aria-pressed={boardPointer === 'light'} onClick={() => presentation(boardPointer === 'light' ? 'none' : 'light')}>Taschenlampe</button>
          {boardPointer === 'light' && <label>Lichtkreis <select aria-label="Lichtkreisgröße" value={lightSize} onChange={event => setLightSize(Number(event.target.value))}>
            <option value="0.12">Klein</option><option value="0.2">Mittel</option><option value="0.3">Groß</option>
          </select></label>}
          {boardPointer !== 'none' && <button className="knopf" onClick={() => presentation('none')}>Zeigehilfe beenden</button>}

          <button
            className="knopf"
            disabled={pageIndex === 0}
            onClick={() => choosePage(s.book!.pageIds[pageIndex - 1])}
          >
            ‹ Zurück
          </button>
          <span>
            {pageIndex + 1} / {s.pages.length}
          </span>
          <button
            className="knopf"
            disabled={pageIndex === s.pages.length - 1}
            onClick={() => choosePage(s.book!.pageIds[pageIndex + 1])}
          >
            Weiter ›
          </button>
          <button className="knopf knopf-haupt" onClick={() => { cancelDrawingGesture(); setBoardPointer('none'); setBoardDraw(false); setBoard(false); }}>
            Tafelmodus beenden
          </button>
        </div>
      )}
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
              alt: 'Tonaufnahme',
            });
            setShowAudio(false);
          }}
        />
      )}
      {showCollection && (
        <CollectionDialog
          onClose={() => setShowCollection(false)}
          onInsert={(elements) => {
            const copies = cloneElements(elements, 0);
            s.edit((p) => ({ ...p, elements: [...p.elements, ...copies] }));
            s.select(copies.map((el) => el.id));
          }}
        />
      )}
      {showGenerator && (
        <GeneratorDialog
          dictionaryOrigin={dictionaryOrigin}
          onClose={() => setShowGenerator(false)}
          onInsert={async (pages) => {
            if (!(await flushEditor()))
              throw new Error('Bitte erst die aktuelle Seite speichern.');
            for (const p of pages) await add(p);
          }}
        />
      )}
      {showShare && (
        <ShareDialog
          bookId={s.book.id}
          templates={templates}
          onClose={() => setShowShare(false)}
        />
      )}
      {learning && (
        <LearningDialog
          element={learning === 'new' ? undefined : learning}
          onClose={() => setLearning(null)}
          onSave={(el) => {
            if (learning === 'new') insert(el);
            else
              s.edit((p) => ({
                ...p,
                elements: p.elements.map((old) =>
                  old.id === el.id ? el : old,
                ),
              }));
          }}
        />
      )}
      {showElements && (
        <ElementsDialog
          onClose={() => setShowElements(false)}
          onInsert={insert}
        />
      )}
      {showEmbed && (
        <EmbedDialog onClose={() => setShowEmbed(false)} onInsert={insert} />
      )}
      {showShortcuts && (
        <ShortcutDialog
          shortcuts={shortcuts}
          onClose={() => setShowShortcuts(false)}
          onSave={async (keys) => {
            const previous = await api<Record<string, unknown>>('preferences');
            await api('preferences', {
              settings: { ...previous, shortcuts: keys },
            });
            setShortcuts(keys);
          }}
        />
      )}
      {showFiles && (
        <FileDialog
          data={{ book: s.book, pages: s.pages }}
          onClose={() => setShowFiles(false)}
        />
      )}
      {showImages && (
        <ImageDialog
          galleryOrigin={galleryOrigin}
          onImage={insertImage}
          onClose={() => setShowImages(false)}
        />
      )}
      {showTemplates && (
        <div className="modal-backdrop">
          <section
            className="modal template-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="templates-title"
          >
            <div className="dialog-heading">
              <div>
                <h2 id="templates-title">Eine neue Seite</h2>
                <p>Wähle eine Lineatur oder eine gespeicherte Vorlage.</p>
              </div>
              <button className="knopf" onClick={() => setShowTemplates(false)}>
                Schließen
              </button>
            </div>
            <label className="search">
              <input
                aria-label="Vorlagen suchen"
                placeholder="Vorlagen suchen …"
                value={templateQuery}
                onChange={(e) => setTemplateQuery(e.target.value)}
              />
            </label>
            <div className="catalog-tabs">
              {['Alle', ...new Set(blueprints.map((t) => t.category))].map(
                (category) => (
                  <button
                    key={category}
                    aria-pressed={templateCategory === category}
                    onClick={() => setTemplateCategory(category)}
                  >
                    {category}
                  </button>
                ),
              )}
            </div>
            <div className="blueprint-list">
              {blueprints
                .filter(
                  (t) =>
                    (templateCategory === 'Alle' ||
                      t.category === templateCategory) &&
                    `${t.title} ${t.category}`
                      .toLowerCase()
                      .includes(templateQuery.toLowerCase()),
                )
                .map((t) => (
                  <button
                    key={t.id}
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        const created = blueprintPages(t);
                        if (
                          s.pages.length === 1 &&
                          !page.elements.length &&
                          page.ruling === 'blanko'
                        ) {
                          s.edit(() => ({
                            ...created[0],
                            id: page.id,
                            revision: page.revision,
                          }));
                          for (const extra of created.slice(1))
                            await add(extra);
                          setShowTemplates(false);
                        } else for (const p of created) await add(p);
                      })
                    }
                  >
                    <span>{t.widget ? '◈' : t.activity ? '✓' : '▤'}</span>
                    <strong>{t.title}</strong>
                    <small>{t.category}</small>
                  </button>
                ))}
            </div>
            <h3>Lineaturen und gespeicherte Vorlagen</h3>
            <div className="template-grid">
              {Object.entries(rulings)
                .filter(([, label]) =>
                  label.toLowerCase().includes(templateQuery.toLowerCase()),
                )
                .map(([ruling, label]) => (
                  <button
                    key={ruling}
                    disabled={busy}
                    onClick={() =>
                      run(() =>
                        add(
                          newPage(ruling as Page['ruling'], page.orientation),
                        ),
                      )
                    }
                  >
                    <ScaledPage
                      page={{
                        ...page,
                        ruling: ruling as Page['ruling'],
                        elements: [],
                      }}
                    />
                    <strong>{label}</strong>
                  </button>
                ))}
              {templates
                .filter((t) =>
                  `${t.title} ${t.category || ''}`
                    .toLowerCase()
                    .includes(templateQuery.toLowerCase()),
                )
                .map((t) => (
                  <div className="saved-template" key={t.id}>
                    <button
                      disabled={busy}
                      onClick={() =>
                        run(() =>
                          add({
                            ...t.page,
                            elements: cloneElements(t.page.elements, 0),
                          }),
                        )
                      }
                    >
                      <ScaledPage page={t.page} decorative />
                      <strong>{t.title}</strong>
                      <small>
                        {t.category ||
                          (t.school ? 'Schulvorlage' : 'Eigene Vorlage')}
                      </small>
                    </button>
                    {!t.school && (
                      <button
                        className="sidebar-link"
                        disabled={busy}
                        onClick={() =>
                          run(async () => {
                            await api('removeTemplate', { templateId: t.id });
                            setTemplates(
                              templates.filter(
                                (template) => template.id !== t.id,
                              ),
                            );
                          })
                        }
                      >
                        Vorlage entfernen
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
