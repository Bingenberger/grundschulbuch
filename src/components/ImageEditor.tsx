/* eslint-disable @next/next/no-img-element -- previews of the own picture */
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  EFFECTS,
  applyEffects,
  pixelate,
  render,
  toggleEffect,
  type EditStep,
  type EffectId,
  type Effects,
  type Pixels,
  type Rect,
} from '@/lib/image-edit.mjs';
import type { PageElement } from '@/lib/notebook-model';
import Icon from './Icon';
import { ChoiceButton, OptionGroup } from './ui/Choice';
import { imageFilters } from './learning/Appearance';

const PREVIEW_SIDE = 1200;
type Tool = 'none' | 'crop' | 'pixel' | 'bar';
type Edit = { steps: EditStep[]; effects: Effects };
export type EditedImage = { src: string; width: number; height: number };

export const effectLabels: Record<EffectId, string> = {
  scan: 'Arbeitsblatt',
  gray: 'Schwarzweiß',
  sepia: 'Alt',
  bright: 'Heller',
  contrast: 'Kontrast',
  vivid: 'Kräftig',
  pale: 'Blass',
  warm: 'Warm',
  cold: 'Kalt',
  invert: 'Umkehren',
};
const effectOrder: EffectId[] = ['bright', 'contrast', 'vivid', 'pale', 'scan', 'gray', 'sepia', 'warm', 'cold', 'invert'];
const aspects: [string, number | null][] = [
  ['Frei', null],
  ['Quadrat', 1],
  ['4:3', 4 / 3],
  ['3:4', 3 / 4],
  ['16:9', 16 / 9],
];

/** Crop, mirror and filter of older pictures become the first steps of the editor. */
export function editFromElement(el: PageElement): Edit {
  const steps: EditStep[] = [];
  if (el.crop) steps.push({ type: 'crop', x: el.crop.x, y: el.crop.y, w: el.crop.width, h: el.crop.height });
  if (el.flip) steps.push({ type: 'flip' });
  const filter = el.imageFilter as EffectId | undefined;
  return { steps, effects: filter && EFFECTS.includes(filter) ? toggleEffect({}, filter) : {} };
}

const copy = (img: Pixels): Pixels => ({ width: img.width, height: img.height, data: img.data.slice() });

function loadPixels(src: string) {
  return new Promise<Pixels>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, PREVIEW_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d', { willReadFrequently: true })!;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = context.getImageData(0, 0, canvas.width, canvas.height);
      resolve({ width: data.width, height: data.height, data: data.data });
    };
    image.onerror = () => reject(new Error('Das Bild konnte nicht geladen werden.'));
    image.src = src;
  });
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Largest centred rectangle with the given proportions (relative units). */
function fitAspect(img: Pixels, aspect: number | null): Rect {
  if (!aspect) return { x: 0.05, y: 0.05, w: 0.9, h: 0.9 };
  let w = 1, h = img.width / (img.height * aspect);
  if (h > 1) {
    w = (img.height * aspect) / img.width;
    h = 1;
  }
  return { x: (1 - w) / 2, y: (1 - h) / 2, w, h };
}

/**
 * Editing a picture: crop, turn, mirror, pixelate, black bars and combinable
 * effects. The browser only shows a preview; the server builds the final
 * picture from the original and these steps.
 */
export default function ImageEditor({
  src,
  initial,
  title = 'Bild bearbeiten',
  onDone,
  onClose,
}: {
  src: string;
  initial?: Edit;
  title?: string;
  onDone: (image: EditedImage) => void;
  onClose: () => void;
}) {
  const [base, setBase] = useState<Pixels | null>(null);
  const [edit, setEdit] = useState<Edit>(initial || { steps: [], effects: {} });
  const [history, setHistory] = useState<Edit[]>([]);
  const [tool, setTool] = useState<Tool>('none');
  const [cropRect, setCropRect] = useState<Rect | null>(null);
  const [aspect, setAspect] = useState<number | null>(null);
  const [brush, setBrush] = useState(0.045);
  const [barRect, setBarRect] = useState<Rect | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number; width: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<
    | { kind: 'crop'; handle: string; start: { x: number; y: number }; rect: Rect }
    | { kind: 'pixel'; pts: [number, number][] }
    | { kind: 'bar'; start: { x: number; y: number } }
    | null
  >(null);
  const live = useRef<[number, number][] | null>(null);
  const [liveTick, setLiveTick] = useState(0);

  useEffect(() => {
    let stopped = false;
    loadPixels(src).then(
      (pixels) => !stopped && setBase(pixels),
      (e) => !stopped && setError((e as Error).message),
    );
    return () => {
      stopped = true;
    };
  }, [src]);

  // Geometry and censoring; effects come on top for the display.
  const working = useMemo(() => (base ? render(base, edit.steps, {}) : null), [base, edit.steps]);

  useEffect(() => {
    if (!working || !canvas.current) return;
    let frame = requestAnimationFrame(() => {
      frame = 0;
      let shown = copy(working);
      if (live.current?.length) shown = pixelate(shown, { r: brush, pts: live.current });
      applyEffects(shown, edit.effects);
      const c = canvas.current!;
      c.width = shown.width;
      c.height = shown.height;
      c.getContext('2d')!.putImageData(new ImageData(shown.data as Uint8ClampedArray<ArrayBuffer>, shown.width, shown.height), 0, 0);
    });
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [working, edit.effects, liveTick, brush]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [onClose]);

  function commit(next: Edit) {
    setHistory((h) => [...h.slice(-29), edit]);
    setEdit(next);
  }
  const push = (step: EditStep) => commit({ ...edit, steps: [...edit.steps, step] });
  function undo() {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((h) => h.slice(0, -1));
    setEdit(previous);
    setTool('none');
    setCropRect(null);
  }
  function chooseTool(next: Tool) {
    if (next === tool) {
      setTool('none');
      setCropRect(null);
      return;
    }
    setTool(next);
    setCropRect(next === 'crop' && working ? fitAspect(working, aspect) : null);
  }

  const point = (e: React.PointerEvent) => {
    const rect = canvas.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  };

  function down(e: React.PointerEvent) {
    if (!working || busy) return;
    const p = point(e);
    const handle = (e.target as HTMLElement).dataset.handle;
    if (tool === 'crop' && cropRect && handle) {
      drag.current = { kind: 'crop', handle, start: p, rect: cropRect };
    } else if (tool === 'pixel') {
      drag.current = { kind: 'pixel', pts: [[p.x, p.y]] };
      live.current = drag.current.pts;
      setLiveTick((n) => n + 1);
    } else if (tool === 'bar') {
      drag.current = { kind: 'bar', start: p };
      setBarRect({ x: p.x, y: p.y, w: 0, h: 0 });
    } else return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function move(e: React.PointerEvent) {
    const p = point(e);
    if (tool === 'pixel') setCursor({ ...p, width: canvas.current!.getBoundingClientRect().width });
    const d = drag.current;
    if (!d || !working) return;
    if (d.kind === 'pixel') {
      d.pts.push([p.x, p.y]);
      setLiveTick((n) => n + 1);
    } else if (d.kind === 'bar') {
      setBarRect({
        x: clamp01(Math.min(d.start.x, p.x)),
        y: clamp01(Math.min(d.start.y, p.y)),
        w: Math.abs(clamp01(p.x) - clamp01(d.start.x)),
        h: Math.abs(clamp01(p.y) - clamp01(d.start.y)),
      });
    } else {
      const dx = p.x - d.start.x, dy = p.y - d.start.y;
      let { x, y, w, h } = d.rect;
      const min = 0.05;
      if (d.handle === 'move') {
        x = Math.max(0, Math.min(1 - w, x + dx));
        y = Math.max(0, Math.min(1 - h, y + dy));
      } else {
        const right = x + w, bottom = y + h;
        if (d.handle.includes('w')) x = Math.max(0, Math.min(right - min, x + dx));
        if (d.handle.includes('e')) w = Math.max(min, Math.min(1 - x, w + dx));
        if (d.handle.includes('w')) w = right - x;
        if (d.handle.includes('n')) y = Math.max(0, Math.min(bottom - min, y + dy));
        if (d.handle.includes('s')) h = Math.max(min, Math.min(1 - y, h + dy));
        if (d.handle.includes('n')) h = bottom - y;
        if (aspect) {
          // Keep the proportions: the height follows the width.
          h = Math.min((w * working.width) / (working.height * aspect), d.handle.includes('n') ? bottom : 1 - y);
          w = (h * working.height * aspect) / working.width;
          if (d.handle.includes('n')) y = bottom - h;
          if (d.handle.includes('w')) x = right - w;
        }
      }
      setCropRect({ x, y, w, h });
    }
  }
  function up() {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.kind === 'pixel') {
      live.current = null;
      push({ type: 'pixel', r: brush, pts: d.pts.map(([x, y]) => [Math.round(x * 10000) / 10000, Math.round(y * 10000) / 10000]) });
    } else if (d.kind === 'bar') {
      const r = barRect;
      setBarRect(null);
      if (r && r.w > 0.01 && r.h > 0.01) push({ type: 'bar', ...r });
    }
  }

  async function save() {
    if (!edit.steps.length && !Object.keys(edit.effects).length) return onClose();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/medien/bearbeiten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src, ...edit }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      onDone(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const active = effectOrder.filter((id) => edit.effects[id] !== undefined);
  const pct = (n: number) => `${n * 100}%`;
  return (
    <div className="modal-backdrop">
      <section className="modal image-editor" role="dialog" aria-modal="true" aria-labelledby="image-editor-title">
        <div className="dialog-heading">
          <h2 id="image-editor-title">{title}</h2>
          <button type="button" className="knopf" onClick={onClose}>
            Abbrechen
          </button>
        </div>
        <div className="editor-tools" role="toolbar" aria-label="Werkzeuge">
          <ChoiceButton icon="zuschneiden" label="Zuschneiden" pressed={tool === 'crop'} disabled={!working} onClick={() => chooseTool('crop')} />
          <ChoiceButton icon="rotate_to_landscape" label="Links drehen" disabled={!working || tool === 'crop'} onClick={() => push({ type: 'rotate', dir: -1 })} />
          <ChoiceButton icon="rotate_to_portrait" label="Rechts drehen" disabled={!working || tool === 'crop'} onClick={() => push({ type: 'rotate', dir: 1 })} />
          <ChoiceButton icon="synchronize" label="Spiegeln" disabled={!working || tool === 'crop'} onClick={() => push({ type: 'flip' })} />
          <ChoiceButton icon="privacy" label="Verpixeln" pressed={tool === 'pixel'} disabled={!working} onClick={() => chooseTool('pixel')} />
          <ChoiceButton icon="balken" label="Balken" pressed={tool === 'bar'} disabled={!working} onClick={() => chooseTool('bar')} />
          <span className="editor-tools-gap" />
          <ChoiceButton icon="undo" label="Rückgängig" disabled={!history.length || busy} onClick={undo} />
        </div>
        <div className="editor-sub">
          {tool === 'crop' && (
            <>
              <OptionGroup label="Seitenverhältnis">
                {aspects.map(([label, value]) => (
                  <ChoiceButton
                    key={label}
                    icon={<span className="aspect-glyph" style={{ aspectRatio: String(value || 1.4) }} />}
                    label={label}
                    pressed={aspect === value}
                    onClick={() => {
                      setAspect(value);
                      if (working) setCropRect(fitAspect(working, value));
                    }}
                  />
                ))}
              </OptionGroup>
              <button
                type="button"
                className="knopf knopf-haupt"
                onClick={() => {
                  if (cropRect) push({ type: 'crop', ...cropRect });
                  setTool('none');
                  setCropRect(null);
                }}
              >
                <Icon name="ok" size={20} /> Ausschnitt übernehmen
              </button>
            </>
          )}
          {tool === 'pixel' && (
            <>
              <span className="editor-hint">Male über Gesichter, Namen oder Kennzeichen.</span>
              <label className="editor-amount">
                <span>Pinselgröße</span>
                <input type="range" min={0.015} max={0.12} step={0.005} value={brush} aria-label="Pinselgröße" onChange={(e) => setBrush(Number(e.target.value))} />
              </label>
            </>
          )}
          {tool === 'bar' && <span className="editor-hint">Ziehe einen Balken über die Stelle, die niemand sehen soll.</span>}
          {tool === 'none' && (
            <div className="editor-effects">
              <OptionGroup label="Effekte – auch mehrere zusammen">
                <ChoiceButton
                  icon="clear_filters"
                  label="Original"
                  pressed={!active.length}
                  onClick={() => active.length && commit({ ...edit, effects: {} })}
                />
                {effectOrder.map((id) => (
                  <ChoiceButton
                    key={id}
                    icon={<span className="effect-glyph" style={{ backgroundImage: `url(${src})`, filter: imageFilters[id] || 'none' }} />}
                    label={effectLabels[id]}
                    pressed={edit.effects[id] !== undefined}
                    onClick={() => commit({ ...edit, effects: toggleEffect(edit.effects, id) })}
                  />
                ))}
              </OptionGroup>
              {active.length > 0 && (
                <div className="editor-amounts">
                  {active.map((id) => {
                    const what = id === 'scan' ? 'Schwellenwert' : 'Stärke';
                    return (
                      <label key={id} className="editor-amount">
                        <span>
                          {effectLabels[id]} <small>{what}</small>
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={edit.effects[id]}
                          aria-label={`${effectLabels[id]}: ${what}`}
                          onPointerDown={() => setHistory((h) => [...h.slice(-29), edit])}
                          onKeyDown={() => setHistory((h) => (h[h.length - 1] === edit ? h : [...h.slice(-29), edit]))}
                          onChange={(e) => setEdit({ ...edit, effects: { ...edit.effects, [id]: Number(e.target.value) } })}
                        />
                        <output>{edit.effects[id]}</output>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="editor-stage-area">
          {!working && !error && <p className="editor-hint">Bild wird geladen …</p>}
          <div
            className={`editor-stage tool-${tool}`}
            style={{ display: working ? undefined : 'none' }}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onPointerLeave={() => setCursor(null)}
          >
            <canvas ref={canvas} aria-label="Vorschau des Bildes" role="img" />
            {tool === 'crop' && cropRect && (
              <div
                className="crop-box"
                data-handle="move"
                style={{ left: pct(cropRect.x), top: pct(cropRect.y), width: pct(cropRect.w), height: pct(cropRect.h) }}
              >
                {['nw', 'ne', 'sw', 'se'].map((h) => (
                  <span key={h} className={`crop-handle ${h}`} data-handle={h} aria-hidden="true" />
                ))}
              </div>
            )}
            {barRect && (
              <div className="bar-preview" style={{ left: pct(barRect.x), top: pct(barRect.y), width: pct(barRect.w), height: pct(barRect.h) }} />
            )}
            {tool === 'pixel' && cursor && (
              <div
                className="brush-cursor"
                style={{
                  left: pct(cursor.x),
                  top: pct(cursor.y),
                  width: brush * 2 * cursor.width,
                  height: brush * 2 * cursor.width,
                }}
              />
            )}
          </div>
        </div>
        {error && <p className="fehler" role="alert">{error}</p>}
        <div className="editor-footer">
          <button type="button" className="knopf" onClick={onClose}>
            Abbrechen
          </button>
          <button type="button" className="knopf knopf-haupt" disabled={!working || busy || tool === 'crop'} onClick={() => void save()}>
            <Icon name="ok" size={20} /> {busy ? 'Wird gespeichert …' : 'Übernehmen'}
          </button>
        </div>
      </section>
    </div>
  );
}
