'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, flushEditor } from '@/lib/editor-store';
import { api } from '@/lib/client-api';
import {
  uuid,
  clone,
  compactStroke,
  dimensions,
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
import BoardPointer, { type BoardPointerMode } from './BoardPointer';
import { useShapeRecognition } from '@/lib/use-shape-recognition';
import { previousArrowShaft } from '@/lib/shape-recognition';
import { inkPaintOrder } from '@/lib/brushes';
import { appendSamples, eraseElements, newStroke, pointerSamples, type EraserProgress, type EraserOptions } from '@/lib/drawing';
import AudioDialog, { AudioEditDialog } from './AudioDialog';
import { audioElement, audioPlaceholder, cassetteRecorder, isAudioPlaceholder, withRecording } from './editor/audio-elements';
import CollectionDialog from './CollectionDialog';
import GeneratorDialog from './GeneratorDialog';
import MathSheetDialog from './sheets/MathSheetDialog';
import { ENABLED } from '@/lib/paused';
import type { WorksheetKind } from '@/lib/learning/worksheets';
import ShareDialog from './ShareDialog';
import { LearningRuntime, pageDrawing } from './learning/Runtime';
import LearningDialog from './learning/LearningDialog';
import EmbedDialog from './learning/EmbedDialog';
import DrawingRuler from './learning/DrawingRuler';
import EditorHeader from './editor/EditorHeader';
import ToolRail, { type RailItem } from './editor/ToolRail';
import PagePanel from './editor/PagePanel';
import DrawingBar from './editor/DrawingBar';
import ElementBar from './editor/ElementBar';
import ElementActions from './editor/ElementActions';
import InlineText from './editor/InlineText';
import { settleText, useTextEditing } from './editor/use-text-editing';
import AnswerField, { isAnswerField } from './editor/AnswerField';
import { fitText } from './editor/text-measure';
import SelectionHandles, { type HandleKind } from './editor/SelectionHandles';
import { elementCenter, resizeAtCorner, rotateTo, type Corner } from '@/lib/transform';
import PageBar from './editor/PageBar';
import TemplateChooser from './editor/TemplateChooser';
import PageTiles from './editor/PageTiles';
import { applyTemplate, templateCatalog } from './editor/page-templates';
import { SelectBar, ShapesBar, findStamp } from './editor/ContextBars';
import { featuresFor } from '@/lib/features';
import { LinkContext, LinkLayer } from './LinkContext';
import { elementsInFrame, rectFrom, strokeAt, tapDistance, type Rect } from '@/lib/selection';
import { DotGlyph } from './ui/Glyphs';
import Icon from './Icon';
import { captureGuideEdge, projectToGuideEdge, type DrawingGuide, type GuideEdge } from '@/lib/drawing-guide';
import ShortcutDialog from './learning/ShortcutDialog';
import {
  defaultShortcuts,
  keyChord,
  type EditorCommand,
  type Shortcuts,
} from '@/lib/editor-commands';
import { speakGerman } from '@/lib/speech';
import ReaderMode from './ReaderMode';
import FileDialog from './FileDialog';
import ImageDialog from './ImageDialog';
import ImageEditor, { editFromElement } from './ImageEditor';
import { cascade, fillPlaceholder, imageElement, isPlaceholder, withEditedPicture, placeholderElement, type ChosenImage } from './editor/image-elements';
import { uploadAudio, uploadImage } from '@/lib/client-api';
import { clampZoom, fitZoom, usePinchZoom } from './editor/use-pinch-zoom';

type Gesture = {
  type: 'move' | 'resize' | 'rotate' | 'draw' | 'erase' | 'frame';
  corner?: Corner;
  /** Centre the rotation angle is measured around (the grabbed element). */
  pivot?: { x: number; y: number };
  start: Point;
  originals: PageElement[];
  points: Point[];
  pointer: number;
  stroke?: PageElement;
  guideEdge?: GuideEdge;
  eraserId?: string;
  eraserProgress?: EraserProgress;
  eraserOptions?: EraserOptions;
  /** Tapping a selected text box again starts writing in it. */
  editOnTap?: string;
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
  dictionaryOrigin,
}: {
  initial: BookData;
  initialTemplates: Template[];
  dictionaryOrigin: string;
}) {
  const s = useEditor();
  const recognition = useShapeRecognition(s.recognizeShapes && !['water', 'fill'].includes(s.brush), s.activeId);
  const cancelRecognition = recognition.cancel;
  const ready = s.book?.id === initial.book.id;
  const [templates, setTemplates] = useState(initialTemplates);
  /** Template chooser: for a new page or to change the current page. */
  const [templateMode, setTemplateMode] = useState<'new' | 'change' | null>(null);
  const [showImages, setShowImages] = useState(false);
  /** Placeholder that gets the chosen picture (instead of a new element). */
  const [fillId, setFillId] = useState<string | null>(null);
  /** Picture open in the editor. */
  const [editImage, setEditImage] = useState<PageElement | null>(null);
  /** Sound open for trimming and improving. */
  const [editAudio, setEditAudio] = useState<PageElement | null>(null);
  const [showAudio, setShowAudio] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  /** Worksheet dialogs taken over from the reference. */
  const [sheetDialog, setSheetDialog] = useState<'math' | null>(null);
  const [showGenerator, setShowGenerator] = useState<boolean | { kind: WorksheetKind; title: string; words?: string }>(false);
  const [showShare, setShowShare] = useState(false);
  const [learning, setLearning] = useState<PageElement | 'new' | null>(null);
  /** Stamp chosen under “Einfügen”: every tap on the page places it. */
  const [stamp, setStamp] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const [recordTarget, setRecordTarget] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [shortcuts, setShortcuts] = useState<Shortcuts>(defaultShortcuts),
    [showShortcuts, setShowShortcuts] = useState(false);
  const [guide, setGuide] = useState<DrawingGuide | null>(null);
  const [boardDraw, setBoardDraw] = useState(false);
  const [boardPointer, setBoardPointer] = useState<BoardPointerMode>('none');
  const [lightSize, setLightSize] = useState(0.2);
  const [showFiles, setShowFiles] = useState(false);
  const [board, setBoard] = useState(false);
  const [reader, setReader] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleted, setDeleted] = useState<{ pages: Page[]; before: string[]; first: number } | null>(null);
  const [showTiles, setShowTiles] = useState(false);
  const [multi, setMulti] = useState(false);
  const [draft, setDraft] = useState<PageElement | null>(null);
  const [preview, setPreview] = useState<PageElement[] | null>(null);
  const [erasePreview, setErasePreview] = useState<PageElement[] | null>(null);
  const [frame, setFrame] = useState<Rect | null>(null);
  const [panel, setPanel] = useState<'insert' | 'page' | null>(null);
  const features = featuresFor('teacher');
  const surface = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [clipboard, setClipboard] = useState<PageElement[]>([]);
  const page = s.pages.find((p) => p.id === s.activeId);
  const catalog = useMemo(() => templateCatalog(templates), [templates]);
  const writing = useTextEditing(page?.id, board);
  const selected =
    page?.elements.filter((el) => s.selected.includes(el.id)) || [];
  const first = selected.length === 1 ? selected[0] : undefined;
  const links = {
    openPage: (id: string) => {
      if (useEditor.getState().book?.pageIds.includes(id)) choosePage(id);
    },
    pageNumber: (id: string) => {
      const i = useEditor.getState().book?.pageIds.indexOf(id) ?? -1;
      return i < 0 ? undefined : i + 1;
    },
  };
  const railActive: RailItem = selected.length
    ? 'select'
    : panel ?? (s.tool === 'marker' ? 'pen' : s.tool);
  const stampActive = !!stamp && panel === 'insert' && !board;
  useEffect(() => {
    if (!stampActive) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStamp(null);
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [stampActive]);
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
  const drawing = pageDrawing(
    s.edit,
    () => useEditor.getState().pages.find((p) => p.id === useEditor.getState().activeId),
    (setSquare) => {
      s.chooseBrush('pen');
      useEditor.setState({ selected: [] });
      setGuide({ kind: setSquare ? 'triangle' : 'ruler', x: size.width / 2, y: size.height * 0.72, angle: 0 });
    },
  );
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
        setTemplateMode('new');
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
        setPanel('page');
        useEditor.setState({ tool: 'select', selected: [] });
        break;
      case 'itemsPanel':
        setPanel(null);
        useEditor.setState({ tool: 'select', selected: [] });
        break;
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
        else if (first?.type === 'text' && !first.locked) writing.begin(first.id);
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
        setZoom((z) => clampZoom(z + 0.1));
        break;
      case 'zoomOut':
        setZoom((z) => clampZoom(z - 0.1));
        break;
      case 'zoomFit':
        setZoom((z) => fitZoom(scroller.current, z));
        break;
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
    recognition.cancel(); setDraft(null); setPreview(null); setErasePreview(null); setFrame(null);
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
  function chooseRail(item: RailItem) {
    if (item !== 'insert' && item !== 'page') setPanel(null);
    switch (item) {
      case 'select':
        useEditor.setState({ tool: 'select' });
        break;
      case 'pen':
        s.chooseBrush(s.brush);
        break;
      case 'eraser':
        useEditor.setState({ tool: 'eraser', selected: [] });
        break;
      case 'text':
        insertText();
        break;
      case 'image':
        setShowImages(true);
        break;
      case 'audio':
        setShowAudio(true);
        break;
      case 'learning':
        setLearning('new');
        break;
      case 'internet':
        setShowEmbed(true);
        break;
      case 'insert':
      case 'page':
        setPanel(railActive === item ? null : item);
        useEditor.setState({ tool: 'select', selected: [] });
        break;
    }
  }
  /** Puts a copy of the chosen stamp centred on the tapped point. */
  function stampAt(point: { x: number; y: number }) {
    const made = findStamp(stamp)?.make();
    if (!made) return;
    const x = Math.max(0, Math.min(size.width - made.width, point.x - made.width / 2));
    const y = Math.max(0, Math.min(size.height - made.height, point.y - made.height / 2));
    s.edit((p) => ({ ...p, elements: [...p.elements, { ...made, x, y }] }));
  }
  /** Deletes pages right away; “Rückgängig” brings them back for a while. */
  function deletePages(ids: string[]) {
    const order = s.book?.pageIds || [];
    const gone = ids.filter((id) => order.includes(id));
    if (!gone.length || gone.length >= order.length) return;
    void run(async () => {
      const state = useEditor.getState();
      const before = state.book!.pageIds;
      const book = await api<Notebook>('update', {
        id: state.book!.id,
        revision: state.book!.revision,
        pageIds: before.filter((p) => !gone.includes(p)),
      });
      const removed = gone.map((id) => clone(useEditor.getState().pages.find((p) => p.id === id)!)).filter(Boolean);
      useEditor.setState({ book, pages: useEditor.getState().pages.filter((p) => !gone.includes(p.id)) });
      if (gone.includes(useEditor.getState().activeId)) {
        const first = Math.min(...gone.map((id) => before.indexOf(id)));
        choosePage(book.pageIds[Math.max(0, Math.min(first, book.pageIds.length) - 1)] || book.pageIds[0]);
      }
      setDeleted({ pages: removed, before, first: Math.min(...gone.map((id) => before.indexOf(id))) });
    });
  }
  function deletePage(id = page?.id) {
    if (id) deletePages([id]);
  }
  useEffect(() => {
    if (!deleted) return;
    const timer = setTimeout(() => setDeleted(null), 15000);
    return () => clearTimeout(timer);
  }, [deleted]);
  /** Puts deleted pages back with their content, at their old places. */
  function restorePage() {
    const undo = deleted;
    if (!undo) return;
    setDeleted(null);
    void run(async () => {
      const renamed = new Map<string, string>();
      const added: Page[] = [];
      let book = useEditor.getState().book!;
      for (const p of undo.pages) {
        const result = await api<{ book: Notebook; page: Page }>('addPage', { id: book.id, page: p });
        renamed.set(p.id, result.page.id);
        added.push(result.page);
        book = result.book;
      }
      const order = undo.before.map((id) => renamed.get(id) || id).filter((id) => book.pageIds.includes(id));
      const rest = book.pageIds.filter((id) => !order.includes(id));
      book = await api<Notebook>('update', { id: book.id, revision: book.revision, pageIds: [...order, ...rest] });
      const pages = [...useEditor.getState().pages, ...added];
      useEditor.setState({ book, pages: book.pageIds.map((id) => pages.find((x) => x.id === id)!) });
      choosePage(renamed.get(undo.pages[0].id) || book.pageIds[0]);
    });
  }
  /** New order of all pages (tile view). */
  function arrange(ids: string[]) {
    void run(async () => {
      const state = useEditor.getState();
      const book = await api<Notebook>('update', { id: state.book!.id, revision: state.book!.revision, pageIds: ids });
      useEditor.setState({ book, pages: ids.map((id) => useEditor.getState().pages.find((p) => p.id === id)!) });
    });
  }
  /** Copies pages; each copy comes right after its page. */
  function duplicatePages(ids: string[]) {
    void run(async () => {
      for (const id of ids) {
        const state = useEditor.getState();
        const source = state.pages.find((p) => p.id === id);
        if (!source) continue;
        const result = await api<{ book: Notebook; page: Page }>('addPage', {
          id: state.book!.id,
          page: { ...source, elements: cloneElements(source.elements, 0) },
          afterId: id,
        });
        const pages = [...useEditor.getState().pages, result.page];
        useEditor.setState({ book: result.book, pages: result.book.pageIds.map((p) => pages.find((x) => x.id === p)!) });
      }
    });
  }
  function insertText() {
    const element = fitText({
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
    }, page!, { autoSize: true });
    insert(element);
    writing.begin(element.id, true);
  }
  function closeImages() {
    setShowImages(false);
    setFillId(null);
  }
  function insertImage(image: ChosenImage) {
    if (fillId) {
      const id = fillId;
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
  /** Opens recording for a sound button or recorder on the page. */
  function recordInto(id: string) {
    setRecordTarget(id);
    setShowAudio(true);
  }
  function openFill(el: PageElement) {
    setFillId(el.id);
    setShowImages(true);
  }
  /** Picture of the current page, placed on a new page right behind it (80 % wide). */
  async function pageScreenshot() {
    const { pageSnapshot } = await import('@/lib/portable');
    const current = page!;
    const { png } = await pageSnapshot(current);
    const src = await uploadImage(await (await fetch(png)).blob());
    const element = await imageElement({ src, alt: `Bildschirmfoto von Seite ${pageIndex + 1}` }, size, {
      maxWidth: size.width * 0.8,
      x: size.width * 0.1,
      y: 15,
    });
    await run(() => add(newPage('blanko', current.orientation)));
    insert(element);
    closeImages();
  }
  function pointer(event: React.PointerEvent): Point {
    const samples = pointerSamples(event.nativeEvent, surface.current!.getBoundingClientRect(), size.width, size.height);
    return samples[samples.length - 1];
  }

  function start(
    event: React.PointerEvent,
    element?: PageElement,
    handle: HandleKind = 'move',
  ) {
    if (gesture.current || (board && !boardDraw) || event.button !== 0) return;
    if (stampActive && s.tool === 'select') {
      event.preventDefault();
      event.stopPropagation();
      stampAt(pointer(event));
      return;
    }
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
    } else {
      // Strokes do not catch pointer events themselves; find one near the tap.
      const target = element ?? strokeAt(page!.elements, point, event.pointerType === 'touch' ? 4 : 2.5);
      if (!target) {
        gesture.current = { type: 'frame', start: point, originals: [], points: [], pointer: event.pointerId };
        setFrame(rectFrom(point, point));
        return;
      }
      let ids = s.selected.includes(target.id)
        ? s.selected
        : target.groupId
          ? page!.elements
              .filter((el) => el.groupId === target.groupId)
              .map((el) => el.id)
          : [target.id];
      if (multi || event.shiftKey) {
        ids = s.selected.includes(target.id)
          ? s.selected.filter((id) => id !== target.id)
          : [...s.selected, target.id];
        s.select(ids);
        return;
      }
      const editOnTap =
        handle === 'move' && target.type === 'text' && !target.locked && s.selected.length === 1 && s.selected[0] === target.id
          ? target.id
          : undefined;
      s.select(ids);
      if (target.locked) return;
      const originals = page!.elements.filter(
        (el) => ids.includes(el.id) && !el.locked,
      );
      gesture.current = {
        type: handle === 'move' ? 'move' : handle === 'rotate' ? 'rotate' : 'resize',
        corner: handle === 'move' || handle === 'rotate' ? undefined : handle,
        pivot: handle === 'rotate' ? elementCenter(target) : undefined,
        start: point,
        originals,
        points: [],
        pointer: event.pointerId,
        editOnTap,
      };
    }
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
    if (g.type === 'frame') {
      setFrame(rectFrom(g.start, point));
      return;
    }
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
          if (g.type === 'rotate') return rotateTo(el, g.pivot || elementCenter(el), g.start, point, event.shiftKey);
          return resizeAtCorner(el, g.corner || 'se', g.start, point, event.shiftKey || el.type === 'image');
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
    if (g.type === 'frame') {
      gesture.current = null;
      const rect = frame;
      setFrame(null);
      if (cancel || !rect) return;
      const additive = multi || event.shiftKey;
      if (Math.max(rect.width, rect.height) < tapDistance) {
        if (!additive) s.select([]);
        return;
      }
      const ids = elementsInFrame(page!.elements, rect);
      s.select(additive ? [...new Set([...s.selected, ...ids])] : ids);
      return;
    }
    if (!cancel && g.editOnTap) {
      const p = pointer(event);
      if (Math.hypot(p.x - g.start.x, p.y - g.start.y) < tapDistance) {
        gesture.current = null;
        setPreview(null);
        writing.begin(g.editOnTap);
        return;
      }
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
    if (!cancel && preview && (g.type === 'move' || g.type === 'resize' || g.type === 'rotate'))
      s.edit((p) => ({
        ...p,
        elements: p.elements.map(
          (el) => settleText(preview, p).find((n) => n.id === el.id) || el,
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
        ['Tab', 'Enter', ' '].includes(event.key) &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        event.target instanceof HTMLElement &&
        event.target.closest('button,a,summary,[role="button"]')
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
        templateMode ||
        showTiles ||
        showAudio ||
        showCollection ||
        showGenerator ||
        showShare ||
        learning ||
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
  usePinchZoom(scroller, zoom, setZoom, {
    enabled: ready && !!page && !!s.book && !board && !reader,
    onStart: cancelDrawingGesture,
    onFit: () => performCommand('zoomFit'),
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
      <EditorHeader
        features={features}
        backLabel="Mein Regal"
        busy={busy}
        onBack={() => run(async () => { window.location.assign('/'); })}
        title={s.book.title}
        onRename={(title) =>
          void run(async () => {
            const book = await api<Notebook>('update', { id: s.book!.id, revision: s.book!.revision, title });
            useEditor.setState({ book });
          })
        }
        status={s.error ? '⚠ Nicht gespeichert' : s.saving ? 'Speichert …' : Object.keys(s.dirty).length ? 'Änderungen …' : '✓ Gespeichert'}
        statusError={!!s.error}
        canUndo={s.past.length > 0}
        canRedo={s.future.length > 0}
        onUndo={s.undo}
        onRedo={s.redo}
        onFiles={() => setShowFiles(true)}
        onBoard={() => {
          cancelDrawingGesture(); setBoardPointer('none'); setBoard(true);
          setBoardDraw(false);
          useEditor.setState({ tool: 'select', selected: [] });
          document.documentElement.requestFullscreen?.().catch(() => undefined);
        }}
        onReader={() => {
          cancelDrawingGesture();
          writing.done();
          setStamp(null);
          useEditor.setState({ tool: 'select', selected: [] });
          setReader(true);
        }}
        onShare={() => run(async () => { setShowShare(true); })}
        onPrint={() => run(async () => { window.location.assign(`/drucken/${s.book!.id}`); })}
        onHelp={() => setShowShortcuts(true)}
        actions={
          <ElementActions
            features={features}
            count={selected.length}
            locked={selected.length > 0 && selected.every((el) => el.locked)}
            canPaste={clipboard.length > 0}
            link={first?.link}
            pages={s.pages}
            pageIds={s.book.pageIds}
            onCopy={() => setClipboard(clone(selected))}
            onCut={() => {
              setClipboard(clone(selected.filter((el) => !el.locked)));
              performCommand('delete');
            }}
            onPaste={() => performCommand('paste')}
            onDuplicate={() => performCommand('duplicate')}
            onDelete={() => performCommand('delete')}
            onLink={(link) => s.patchElements({ link })}
          />
        }
      />
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
      <div className="editor-body">
        <ToolRail features={features} active={railActive} onChoose={chooseRail} />
        <PagePanel
          pages={s.pages}
          pageIds={s.book.pageIds}
          activeId={page.id}
          busy={busy}
          onChoose={choosePage}
          onAdd={() => setTemplateMode('new')}
          onDelete={s.book.pageIds.length > 1 ? (id) => deletePage(id) : undefined}
          onTiles={() => setShowTiles(true)}
        />
        <div className="editor-main">
        <section className="canvas-area">
          <LinkContext.Provider value={links}>
          <div className="canvas-scroll" ref={scroller}>
            <div className="canvas-sheet">
              <ScaledPage
                page={page}
                maxScale={board ? 1.8 : 1}
                zoom={board ? 1 : zoom}
              >
                <LearningRuntime
                  drawing={drawing}
                  uploadAudio={(id, file) => uploadAudio(file, s.book!.id, id)}
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
                        className={`${s.selected.includes(el.id) && !board ? 'selected' : ''} ${el.locked ? 'locked' : ''} ${writing.editingId === el.id ? 'text-editing' : ''}`}
                        onPointerDown={(e) => start(e, el)}
                        onDoubleClick={() => {
                          if (el.type === 'text' && !el.locked) writing.begin(el.id);
                          else if (isPlaceholder(el) && !el.src) openFill(el);
                          else if (isAudioPlaceholder(el) && !el.src) recordInto(el.id);
                          else if (el.type === 'image' && el.src && !el.locked) setEditImage(el);
                          else if (el.type === 'audio' && el.src && !el.locked) setEditAudio(el);
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
                        ) : isAnswerField(el) ? (
                          <AnswerField element={el} onAnswer={(text) => s.edit((p) => ({ ...p, elements: p.elements.map((e) => (e.id === el.id ? { ...e, text } : e)) }))} />
                        ) : undefined}
                      </ElementView>
                    ))}
                    {!board &&
                      page.elements
                        .filter((el) => s.selected.includes(el.id))
                        .map((el) => (
                          <SelectionHandles
                            key={`handle-${el.id}`}
                            element={preview?.find((p) => p.id === el.id) || el}
                            locked={el.locked}
                            onStart={(e, kind) => start(e, el, kind)}
                            onMove={move}
                            onEnd={end}
                            editing={writing.editingId === el.id}
                            onDoubleClick={() => {
                              if (el.type === 'text') writing.begin(el.id);
                              else if (isPlaceholder(el) && !el.src) openFill(el);
                          else if (isAudioPlaceholder(el) && !el.src) recordInto(el.id);
                          else if (el.type === 'image' && el.src && !el.locked) setEditImage(el);
                          else if (el.type === 'audio' && el.src && !el.locked) setEditAudio(el);
                            }}
                          />
                        ))}
                    {frame && (
                      <div
                        className="selection-frame"
                        style={{ left: `${frame.x}mm`, top: `${frame.y}mm`, width: `${frame.width}mm`, height: `${frame.height}mm` }}
                      />
                    )}
                    <LinkLayer elements={page.elements.map((el) => preview?.find((p) => p.id === el.id) || el)} />
                    {guide && (!board || boardPointer === 'none') && <DrawingRuler guide={guide} onChange={setGuide} onClose={() => setGuide(null)} />}
                    {board && boardPointer !== 'none' && <BoardPointer key={`${page.id}-${boardPointer}`} mode={boardPointer} width={size.width} height={size.height} size={lightSize} onClose={() => setBoardPointer('none')} />}
                  </div>
                </LearningRuntime>
              </ScaledPage>
            </div>
          </div>
          </LinkContext.Provider>
          {deleted && (
            <div className="undo-notice" role="status">
              <Icon name="empty_trash" size={22} />
              <span>{deleted.pages.length === 1 ? `Seite ${deleted.first + 1} gelöscht` : `${deleted.pages.length} Seiten gelöscht`}</span>
              <button type="button" className="knopf compact" disabled={busy} onClick={restorePage}>
                <Icon name="undo" size={20} /> Rückgängig
              </button>
              <button type="button" className="undo-notice-close" aria-label="Hinweis schließen" onClick={() => setDeleted(null)}>
                <Icon name="cancel" size={18} />
              </button>
            </div>
          )}
          <div className="zoom-float" role="group" aria-label="Ansicht">
            <button type="button" aria-label="Ansicht verkleinern" onClick={() => performCommand('zoomOut')}>
              <Icon name="minus" size={22} />
            </button>
            <span className="zoom-value">{Math.round(zoom * 100)} %</span>
            <button type="button" aria-label="Ansicht vergrößern" onClick={() => performCommand('zoomIn')}>
              <Icon name="plus" size={22} />
            </button>
            <button type="button" onClick={() => performCommand('zoomFit')}>
              <Icon name="expand" size={22} />
              <span>Ganze Seite</span>
            </button>
          </div>
        </section>
        {draft?.geometry && (s.tool === 'pen' || s.tool === 'marker') && <span className="shape-hint" role="status">Form erkannt – zum Übernehmen loslassen.</span>}
        {s.tool === 'pen' || s.tool === 'marker' || s.tool === 'eraser' ? (
          <>
            <DrawingBar
              features={features}
              surface={surface}
              pageId={page.id}
              guide={guide}
              onGuide={setGuide}
              fillDisabled={board && !boardDraw}
            />
          </>
        ) : selected.length ? (
          <ElementBar
            features={features}
            elements={selected}
            actions={{
              onResize: (factor) => performCommand(factor > 1 ? 'bigger' : 'smaller'),
              onRotate: (degrees) => performCommand(degrees < 0 ? 'rotateLeft' : 'rotateRight'),
              onGeometry: patchGeometry,
              onLayer: layer,
              onLock: () => performCommand('lock'),
              onFill: openFill,
              onEditImage: setEditImage,
              onEditAudio: setEditAudio,
              onCollection: () => {
                const name = prompt('Name für die Sammlung');
                if (name?.trim())
                  void run(async () => {
                    await api('asset', { title: name, page: { ...page, elements: selected } });
                    setShowCollection(true);
                  });
              },
              onGroup: (group) => performCommand(group ? 'group' : 'ungroup'),
              onConfigure: setLearning,
            }}
          />
        ) : panel === 'insert' ? (
          <ShapesBar
            onInsert={(element) => insert(cascade(element, page.elements, size))}
            stamp={stamp}
            onStamp={setStamp}
          />
        ) : panel === 'page' ? (
          <PageBar
            key={page.id}
            features={features}
            page={page}
            pageIndex={pageIndex}
            pageCount={s.pages.length}
            busy={busy}
            onDuplicate={() => run(() => add({ ...page, elements: cloneElements(page.elements, 0) }))}
            onMove={(delta) => run(() => reorder(delta))}
            onDelete={() => deletePage()}
            onTemplates={() => setTemplateMode('new')}
            onChangeTemplate={() => setTemplateMode('change')}
            onTiles={() => setShowTiles(true)}
            onSaveTemplate={(name) =>
              run(async () => {
                const template = await api<Template>('template', { title: name, page });
                setTemplates([...templates, template]);
              })
            }
          />
        ) : (
          <SelectBar
            features={features}
            multi={multi}
            onMulti={setMulti}
            onSelectAll={page.elements.some((el) => !el.locked) ? () => performCommand('selectAll') : undefined}
          />
        )}
        </div>
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
            <Icon name={boardDraw ? 'ok' : 'signature'} size={26} />
            {boardDraw ? 'Zeichnen beenden' : 'Auf der Tafel schreiben'}
          </button>
          <button className="knopf" aria-pressed={boardPointer === 'laser'} onClick={() => presentation(boardPointer === 'laser' ? 'none' : 'laser')}><Icon name="flash_on" size={26} />Laserpointer</button>
          <button className="knopf" aria-pressed={boardPointer === 'light'} onClick={() => presentation(boardPointer === 'light' ? 'none' : 'light')}><Icon name="idea" size={26} />Taschenlampe</button>
          {boardPointer === 'light' && (
            <div className="board-choice" role="group" aria-label="Lichtkreisgröße">
              {([[0.12, 'Klein'], [0.2, 'Mittel'], [0.3, 'Groß']] as const).map(([value, label]) => (
                <button key={value} type="button" className="knopf" aria-pressed={lightSize === value} onClick={() => setLightSize(value)}>
                  <DotGlyph size={value * 30} />
                  {label}
                </button>
              ))}
            </div>
          )}
          {boardPointer !== 'none' && <button className="knopf" onClick={() => presentation('none')}>Zeigehilfe beenden</button>}

          <button
            className="knopf"
            disabled={pageIndex === 0}
            onClick={() => choosePage(s.book!.pageIds[pageIndex - 1])}
          >
            <Icon name="previous" size={22} /> Zurück
          </button>
          <span>
            {pageIndex + 1} / {s.pages.length}
          </span>
          <button
            className="knopf"
            disabled={pageIndex === s.pages.length - 1}
            onClick={() => choosePage(s.book!.pageIds[pageIndex + 1])}
          >
            Weiter <Icon name="next" size={22} />
          </button>
          <button className="knopf knopf-haupt" onClick={() => { cancelDrawingGesture(); setBoardPointer('none'); setBoardDraw(false); setBoard(false); }}>
            <Icon name="cancel" size={22} /> Tafelmodus beenden
          </button>
        </div>
      )}
      {reader && (
        <ReaderMode
          title={s.book.title}
          pages={s.book.pageIds.map((id) => s.pages.find((p) => p.id === id)).filter((p): p is Page => !!p)}
          pageId={page.id}
          onPage={choosePage}
          allowExternal
          uploadAudio={(id, file) => uploadAudio(file, s.book!.id, id)}
          onResponse={(id, response) =>
            s.edit((p) => ({ ...p, elements: p.elements.map((el) => (el.id === id ? { ...el, response } : el)) }))
          }
          onRecord={(id) => {
            setRecordTarget(id);
            setShowAudio(true);
          }}
          onSpeak={(p) => speakGerman(p.elements.filter((el) => el.type === 'text').map((el) => el.text).join('. '))}
          onClose={() => setReader(false)}
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
      {showAudio && (
        <AudioDialog
          bookId={s.book.id}
          child={false}
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
          onPlaceholder={(label) => {
            insert(cascade(audioPlaceholder(label), page!.elements, size));
            setShowAudio(false);
          }}
          onRecorder={() => {
            insert(cascade(cassetteRecorder(), page!.elements, size));
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
      {sheetDialog === 'math' && (
        <MathSheetDialog
          onClose={() => setSheetDialog(null)}
          onInsert={async (pages) => {
            if (!(await flushEditor())) throw new Error('Bitte erst die aktuelle Seite speichern.');
            // A notebook with just one empty page gets the first page right there.
            if (s.pages.length === 1 && !page.elements.length) {
              s.edit(() => ({ ...pages[0], id: page.id, revision: page.revision }));
              for (const extra of pages.slice(1)) await add(extra);
            } else for (const p of pages) await add(p);
          }}
        />
      )}
      {showGenerator && (
        <GeneratorDialog
          dictionaryOrigin={dictionaryOrigin}
          initial={typeof showGenerator === 'object' ? showGenerator : undefined}
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
          onPages={(pages) =>
            void run(async () => {
              // A notebook with just one empty page gets the first page right there.
              if (s.pages.length === 1 && !page.elements.length) {
                s.edit(() => ({ ...pages[0], id: page.id, revision: page.revision }));
                for (const extra of pages.slice(1)) await add(extra);
              } else for (const p of pages) await add(p);
            })
          }
          onClose={() => setLearning(null)}
          onWorksheet={
            ENABLED.worksheetGenerator
              ? () => {
                  setLearning(null);
                  setShowGenerator(true);
                }
              : undefined
          }
          onSave={(el) => {
            if (learning === 'new') {
              // New tools start in the middle of the page and do not cover each other.
              const width = Math.min(el.width, size.width), height = Math.min(el.height, size.height);
              const centred = { ...el, width, height, x: Math.max(0, (size.width - width) / 2), y: Math.max(0, (size.height - height) / 2) };
              insert(cascade(centred, page.elements, size));
            } else
              s.edit((p) => ({
                ...p,
                elements: p.elements.map((old) =>
                  old.id === el.id ? el : old,
                ),
              }));
          }}
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
          only={fillId ? ['camera', 'upload', 'arasaac', 'wikimedia', 'galerie'] : undefined}
          title={fillId ? 'Bild für den Platzhalter' : 'Ein Bild einfügen'}
          onImage={insertImage}
          onPlaceholder={(label, shape) => {
            insert(cascade(placeholderElement(label, shape), page!.elements, size));
            closeImages();
          }}
          onPageScreenshot={pageScreenshot}
          onClose={closeImages}
        />
      )}
      {showTiles && (
        <PageTiles
          pages={s.pages}
          pageIds={s.book.pageIds}
          activeId={page.id}
          busy={busy}
          onClose={() => setShowTiles(false)}
          onOpen={(id) => {
            choosePage(id);
            setShowTiles(false);
          }}
          onArrange={arrange}
          onDuplicate={duplicatePages}
          onDelete={deletePages}
        />
      )}
      {templateMode && (
        <TemplateChooser
          title={templateMode === 'new' ? 'Neue Seite' : 'Vorlage für diese Seite'}
          hint={
            templateMode === 'new'
              ? 'Wähle eine Vorlage für die neue Seite – oder hole Seiten aus einer Datei.'
              : 'Leere Seiten bekommen auch den Inhalt der Vorlage. Was schon auf der Seite ist, bleibt erhalten.'
          }
          entries={templateMode === 'change' ? catalog.filter((e) => !e.configure) : catalog}
          current={templateMode === 'change' ? page.template : undefined}
          orientation={templateMode === 'change' ? page.orientation : 'landscape'}
          lockOrientation={templateMode === 'change' && page.elements.length > 0}
          busy={busy}
          onClose={() => setTemplateMode(null)}
          onImport={
            templateMode === 'new'
              ? () => {
                  setTemplateMode(null);
                  setShowFiles(true);
                }
              : undefined
          }
          onRemove={(entry) =>
            run(async () => {
              await api('removeTemplate', { templateId: entry.savedId });
              setTemplates(templates.filter((t) => t.id !== entry.savedId));
            })
          }
          onPick={(entry, orientation) => {
            if (entry.configure) {
              setTemplateMode(null);
              if (entry.configure.kind === 'rechnen') setSheetDialog('math');
              else setShowGenerator({ ...entry.configure, title: entry.title });
              return;
            }
            if (templateMode === 'change') {
              const [model] = entry.build(page.elements.length ? page.orientation : orientation);
              s.edit((p) => applyTemplate(p, model, entry.key));
              setTemplateMode(null);
              return;
            }
            void run(async () => {
              const created = entry.build(orientation).map((p) => ({ ...p, template: entry.key }));
              // A notebook with just one empty page gets the template right there.
              if (s.pages.length === 1 && !page.elements.length) {
                s.edit(() => ({ ...created[0], id: page.id, revision: page.revision }));
                for (const extra of created.slice(1)) await add(extra);
              } else for (const p of created) await add(p);
              setTemplateMode(null);
            });
          }}
        />
      )}
    </main>
  );
}
