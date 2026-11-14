'use client';
// The editor of the Animation, after the reference's dialog: a stage where
// objects are moved, turned (○) and resized (⤡) at the time of the playhead –
// each change makes a keyframe ◆ –, paths drawn with the finger, a timeline
// with ruler, playhead, poster star and a row of keyframes per object, and the
// tabs Objekte (text, picture, sticker; keyframe: size, turn, visibility,
// easing, path) and Animation (length, background, playing, poster, paths).
// The geometry, motion and drawing are the reference's own.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { animation, animationAssets, emojiSvg, type Anim, type AnimObject } from '@/lib/learning/animation';
import {
  ANIM_BACKGROUNDS, ANIM_EASES, ANIM_FONTS, ANIM_LENGTHS, ANIM_PATH_COLORS, animationExample, animationGif, backgroundSvg, CLASS_CSS, fontOf, KEY_EPS, keyAt, makeKey,
  measureText, objectSvg, objectTransform, pathDuration, pathLength2, pathsSvg, setKey, snapTime, STAGE_W, stateAt, timeText,
} from '@/lib/reference/class-runtime';
import { stickers } from '../editor/ContextBars';
import { Slider, Toggle } from '../sheets/SheetParts';
import { Choices } from './OptionControls';

type Props = { value: unknown; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean };
type State = { x: number; y: number; s: number; rot: number; o: number };
type Drag = { kind: 'path'; pts: [number, number][] } | { kind: 'move'; id: string; x0: number; y0: number; sx: number; sy: number } | { kind: 'size'; id: string; cx: number; cy: number; d0: number; s0: number } | { kind: 'rot'; id: string; cx: number; cy: number };
const SW = STAGE_W as number, SH = 720;
const colors = ANIM_PATH_COLORS as string[];
const eases = ANIM_EASES as { id: string; label: string; hint: string }[];
const uid = (p: string) => `${p}${Math.random().toString(36).slice(2, 10)}`;

export default function AnimationOptions({ value, onChange, upload, busy }: Props) {
  const [t, setT] = useState<Anim>(() => animation(value));
  const latest = useRef(t);
  const history = useRef<Anim[]>([]);
  const [msg, setMsg] = useState('');
  const [undoable, setUndoable] = useState(0);
  // Every change goes to the settings as well.
  const put = (next: Anim) => { latest.current = next; setT(next); onChange(next as unknown as JsonValue); };
  const commit = (next: Anim | null, error = 'Höchstens 24 Keyframes pro Objekt.') => {
    if (!next) { setMsg(error); return; }
    history.current.push(latest.current);
    if (history.current.length > 60) history.current.shift();
    setUndoable(history.current.length);
    put(next);
  };
  const undo = () => { const prev = history.current.pop(); setUndoable(history.current.length); if (prev) put(prev); };

  const [selected, setSelected] = useState<string | null>(t.objects[t.objects.length - 1]?.id ?? null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [tool, setTool] = useState<'move' | 'path'>('move');
  const [tab, setTab] = useState<'obj' | 'anim'>('obj');
  const [drag, setDrag] = useState<Drag | null>(null);
  const [picking, setPicking] = useState(false);
  const stage = useRef<SVGSVGElement>(null);
  const ruler = useRef<HTMLDivElement>(null);

  const obj = t.objects.find((o) => o.id === selected) ?? null;
  const keyIndex = obj ? (keyAt(obj, time) as number) : -1;
  const key = obj && keyIndex >= 0 ? obj.keys[keyIndex] : null;
  const now = obj ? (stateAt(obj, time, t) as State) : null;

  // Playing (as in the reference: from the playhead, stop or loop at the end).
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const start = performance.now() - time * 1000;
    const step = (ms: number) => {
      let s = (ms - start) / 1000;
      if (s >= t.len) { if (!t.loop) { setTime(t.len); setPlaying(false); return; } s %= t.len; }
      setTime(s);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);
  const play = () => { if (playing) { setPlaying(false); return; } if (time >= t.len - 0.01) setTime(0); setPlaying(true); };

  const place = () => { const n = t.objects.length; return makeKey(0, SW / 2 + ((n % 3) - 1) * 120, 360 + ((Math.floor(n / 3) % 3) - 1) * 90); };
  const add = (o: Omit<AnimObject, 'id' | 'keys'>) => {
    if (t.objects.length >= 8) { setMsg('Eine Animation hat höchstens 8 Objekte.'); return; }
    const n = { ...o, id: uid('ao'), keys: [place()] } as AnimObject;
    commit({ ...latest.current, objects: [...latest.current.objects, n] });
    setSelected(n.id); setTab('obj'); setPlaying(false);
  };
  const addText = () => {
    const o = { kind: 'text' as const, name: `Text ${t.objects.filter((x) => x.kind === 'text').length + 1}`, text: 'Hallo!', font: 'andika', size: 72, color: '#1f2937', bold: true, w: 0, h: 0 };
    add({ ...o, ...measureText(o) });
  };
  const addImage = (file: File) => {
    if (t.objects.length >= 8) { setMsg('Eine Animation hat höchstens 8 Objekte.'); return; }
    void upload(file, (img) => {
      const pic = new Image();
      pic.onload = () => {
        const k = 360 / Math.max(pic.naturalWidth || 1, pic.naturalHeight || 1);
        add({ kind: 'image', name: file.name.replace(/\.[a-z0-9]+$/i, '').slice(0, 40) || 'Bild', img, w: Math.round(pic.naturalWidth * k), h: Math.round(pic.naturalHeight * k) });
      };
      pic.onerror = () => add({ kind: 'image', name: 'Bild', img, w: 360, h: 270 });
      pic.src = img;
    });
  };
  const addSticker = (symbol: string, label: string) => { setPicking(false); add({ kind: 'sticker', name: label, svg: emojiSvg(symbol), w: 240, h: 240 }); };
  const change = (id: string, patch: Partial<AnimObject>, record = true) => {
    const next = { ...latest.current, objects: latest.current.objects.map((o) => (o.id === id ? { ...o, ...patch } : o)) };
    if (record) commit(next); else put(next);
  };
  const changeText = (o: AnimObject, patch: Partial<AnimObject>) => change(o.id, { ...patch, ...measureText({ ...o, ...patch }) });
  const remove = (id: string) => { commit({ ...latest.current, objects: latest.current.objects.filter((o) => o.id !== id) }); setSelected(null); };
  const reorder = (id: string, d: number) => {
    const l = [...latest.current.objects], i = l.findIndex((o) => o.id === id), j = i + d;
    if (i < 0 || j < 0 || j >= l.length) return;
    [l[i], l[j]] = [l[j], l[i]];
    commit({ ...latest.current, objects: l });
  };
  const duplicate = (o: AnimObject) => {
    if (t.objects.length >= 8) { setMsg('Eine Animation hat höchstens 8 Objekte.'); return; }
    const n = { ...o, id: uid('ao'), name: `${o.name} 2`.slice(0, 60), keys: o.keys.map((k) => ({ ...k, x: k.x + 40, y: k.y + 40, ...(k.path ? { path: { ...k.path } } : {}) })) };
    commit({ ...latest.current, objects: [...latest.current.objects, n] });
    setSelected(n.id);
  };
  const keyChange = (patch: Partial<State> & { ease?: string; path?: unknown }, record = true) => {
    if (!obj) return;
    setPlaying(false);
    const next = setKey(latest.current, obj.id, time, patch) as Anim | null;
    if (record) commit(next); else if (next) put(next);
  };
  const removeKey = () => { if (obj && keyIndex >= 0 && obj.keys.length > 1) commit({ ...latest.current, objects: latest.current.objects.map((o) => (o.id === obj.id ? { ...o, keys: o.keys.filter((_, i) => i !== keyIndex) } : o)) }); };
  const choosePath = (id: string | null) => {
    if (!obj) return;
    if (!id) { keyChange({ path: undefined }); return; }
    const p = t.paths.find((x) => x.id === id);
    if (p) keyChange({ path: { id, speed: key?.path?.speed ?? 300, ...(key?.path?.turn ? { turn: true } : {}) }, x: p.pts[0][0], y: p.pts[0][1] });
  };
  const removePath = (id: string) => commit({ ...latest.current, paths: latest.current.paths.filter((p) => p.id !== id), objects: latest.current.objects.map((o) => ({ ...o, keys: o.keys.map((k) => (k.path?.id === id ? { ...k, path: undefined } : k)) })) });

  // Stage pointer handling (we/Te/Ee of the reference).
  const at = (e: React.PointerEvent) => { const r = stage.current!.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * SW, y: ((e.clientY - r.top) / r.height) * SH }; };
  const down = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button > 0 || msg.startsWith('Das GIF')) return;
    e.preventDefault(); setPlaying(false);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* not needed */ }
    const p = at(e);
    if (tool === 'path') {
      if (t.paths.length >= 4) { setMsg('Höchstens 4 Pfade.'); return; }
      setDrag({ kind: 'path', pts: [[Math.round(p.x), Math.round(p.y)]] });
      return;
    }
    const target = e.target as Element;
    const handle = (target.closest('[data-h]') as HTMLElement | null)?.dataset.h;
    if (handle && obj && now) {
      history.current.push(latest.current);
      setUndoable(history.current.length);
      setDrag(handle === 'size' ? { kind: 'size', id: obj.id, cx: now.x, cy: now.y, d0: Math.max(10, Math.hypot(p.x - now.x, p.y - now.y)), s0: now.s } : { kind: 'rot', id: obj.id, cx: now.x, cy: now.y });
      return;
    }
    const id = (target.closest('[data-o]') as HTMLElement | null)?.dataset.o;
    if (!id) { setSelected(null); return; }
    setSelected(id); setTab('obj');
    const o = t.objects.find((x) => x.id === id)!;
    if (o.keys[keyAt(o, time) as number]?.path) { setMsg('Hier folgt das Objekt einem Pfad – nimm den Pfad weg oder setze die Abspielmarke woandershin.'); return; }
    const st = stateAt(o, time, t) as State;
    history.current.push(latest.current);
    setUndoable(history.current.length);
    setDrag({ kind: 'move', id, x0: p.x, y0: p.y, sx: st.x, sy: st.y });
  };
  const move = (e: React.PointerEvent) => {
    if (!drag) return;
    const p = at(e);
    if (drag.kind === 'path') {
      const last = drag.pts[drag.pts.length - 1];
      if (Math.hypot(p.x - last[0], p.y - last[1]) >= 12 && drag.pts.length < 400) setDrag({ ...drag, pts: [...drag.pts, [Math.round(p.x), Math.round(p.y)]] });
      return;
    }
    let patch: Partial<State>;
    if (drag.kind === 'move') patch = { x: drag.sx + p.x - drag.x0, y: drag.sy + p.y - drag.y0 };
    else if (drag.kind === 'size') patch = { s: Math.min(6, Math.max(0.1, (drag.s0 * Math.hypot(p.x - drag.cx, p.y - drag.cy)) / drag.d0)) };
    else {
      let a = (Math.atan2(p.y - drag.cy, p.x - drag.cx) * 180) / Math.PI + 90;
      if (a > 180) a -= 360;
      const snap = Math.round(a / 15) * 15;
      if (Math.abs(snap - a) < 4) a = snap;
      patch = { rot: a };
    }
    const next = setKey(latest.current, drag.id, time, patch) as Anim | null;
    if (next) put(next); else { setMsg('Höchstens 24 Keyframes pro Objekt.'); setDrag(null); }
  };
  const up = () => {
    if (drag?.kind === 'path') {
      const e = drag.pts;
      const pts = e.map((p, i) => (i === 0 || i === e.length - 1 ? p : [Math.round((e[i - 1][0] + p[0] * 2 + e[i + 1][0]) / 4), Math.round((e[i - 1][1] + p[1] * 2 + e[i + 1][1]) / 4)])) as [number, number][];
      const path = { id: uid('ap'), pts };
      if (pts.length >= 2 && (pathLength2(path) as number) >= 40) {
        let next: Anim = { ...latest.current, paths: [...latest.current.paths, path] };
        if (obj) next = (setKey(next, obj.id, time, { path: { id: path.id, speed: 300 }, x: pts[0][0], y: pts[0][1] }) as Anim | null) ?? next;
        commit(next);
        if (obj) setMsg(`„${obj.name}“ folgt jetzt diesem Pfad – ab ${timeText(time)}.`);
      }
      setTool('move');
    }
    setDrag(null);
  };

  // Timeline (Oe/ke/Ae of the reference).
  const timeOf = (clientX: number) => { const r = ruler.current!.getBoundingClientRect(); return snapTime(((clientX - r.left) / r.width) * t.len, t.len) as number; };
  const scrub = (e: React.PointerEvent) => {
    if (e.button > 0) return;
    e.preventDefault(); setPlaying(false); setTime(timeOf(e.clientX));
    const mv = (ev: PointerEvent) => setTime(timeOf(ev.clientX));
    const end = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', end); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', end);
  };
  const dragKey = (e: React.PointerEvent, o: AnimObject, i: number) => {
    if (e.button > 0) return;
    e.preventDefault(); e.stopPropagation(); setPlaying(false); setSelected(o.id); setTab('obj');
    const before = latest.current, x0 = e.clientX, t0 = o.keys[i].t;
    let moved = false;
    const mv = (ev: PointerEvent) => {
      if (!moved && Math.abs(ev.clientX - x0) < 4) return;
      moved = true;
      const r = ruler.current!.getBoundingClientRect();
      let nt = snapTime(t0 + ((ev.clientX - x0) / r.width) * t.len, t.len) as number;
      if (o.keys.some((k, j) => j !== i && Math.abs(k.t - nt) < 0.05)) return;
      nt = Math.min(t.len, Math.max(0, nt));
      put({ ...before, objects: before.objects.map((x) => (x.id === o.id ? { ...x, keys: x.keys.map((k, j) => (j === i ? { ...k, t: nt } : k)).sort((a, b) => a.t - b.t) } : x)) });
      setTime(nt);
    };
    const end = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', end); if (moved) { history.current.push(before); setUndoable(history.current.length); } else setTime(t0); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', end);
  };
  const dragPoster = (e: React.PointerEvent) => {
    if (e.button > 0) return;
    e.preventDefault(); e.stopPropagation(); setPlaying(false);
    const before = latest.current, x0 = e.clientX, p0 = before.poster;
    let moved = false;
    const mv = (ev: PointerEvent) => {
      if (!moved && Math.abs(ev.clientX - x0) < 4) return;
      moved = true;
      const r = ruler.current!.getBoundingClientRect();
      const p = snapTime(p0 + ((ev.clientX - x0) / r.width) * before.len, before.len) as number;
      put({ ...before, poster: p }); setTime(p);
    };
    const end = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', end); if (moved) { history.current.push(before); setUndoable(history.current.length); } else setTime(p0); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', end);
  };

  const gif = async () => {
    if (!t.objects.length) { setMsg('Lege zuerst etwas auf die Bühne.'); return; }
    setPlaying(false); setMsg('Das GIF wird erstellt … 0 %');
    try {
      const blob: Blob = await animationGif(t, animationAssets(t), { width: 640, fps: 12, onProgress: (p: number) => setMsg(`Das GIF wird erstellt … ${Math.round(p * 100)} %`) });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${(t.title || 'Animation').replace(/[\\/:*?"<>|]/g, '').slice(0, 60)} (Animation).gif`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      setMsg(`GIF gespeichert (${Math.max(1, Math.round(blob.size / 1024))} KB).`);
    } catch { setMsg('Das GIF konnte nicht erstellt werden.'); }
  };

  const objects = t.objects, background = t.bg, bgImg = t.bgImg, paths = t.paths;
  const svgs = useMemo(() => new Map(objects.map((o) => [o.id, objectSvg(o, (id?: string) => id) as string])), [objects]);
  const bg = useMemo(() => backgroundSvg({ bg: background, bgImg }, (id?: string) => id) as string, [background, bgImg]);
  const pathsShown = useMemo(() => pathsSvg({ paths }, true) as string, [paths]);

  // Frame with the handles for turning and resizing (ze of the reference).
  const handles = () => {
    if (!obj || !now || playing || tool !== 'move') return null;
    const { x, y, rot, s } = now, hw = (obj.w * s) / 2, hh = (obj.h * s) / 2, a = (rot * Math.PI) / 180;
    const pt = (dx: number, dy: number) => ({ x: x + dx * Math.cos(a) - dy * Math.sin(a), y: y + dx * Math.sin(a) + dy * Math.cos(a) });
    const c = pt(hw + 10, hh + 10), inside = (p: { x: number; y: number }) => p.x > 20 && p.x < 1260 && p.y > 20 && p.y < 700;
    const top = pt(0, -hh - 46), below = !inside(top) && inside(pt(0, hh + 46)), m = below ? pt(0, hh + 46) : top, base = pt(0, below ? hh : -hh);
    return (
      <g>
        <rect x={-hw - 6} y={-hh - 6} width={2 * hw + 12} height={2 * hh + 12} transform={`translate(${x} ${y}) rotate(${rot})`} fill="none" stroke="#2160c4" strokeWidth="3" strokeDasharray="10 6" pointerEvents="none" />
        <line x1={base.x} y1={base.y} x2={m.x} y2={m.y} stroke="#2160c4" strokeWidth="3" pointerEvents="none" />
        <g data-h="rot" className="an-handle"><circle cx={m.x} cy={m.y} r="22" fill="#ffffff" stroke="#2160c4" strokeWidth="4" /><path d={`M${m.x - 9} ${m.y + 2}a9 9 0 1 1 3 6`} fill="none" stroke="#2160c4" strokeWidth="3.5" strokeLinecap="round" /></g>
        <g data-h="size" className="an-handle"><circle cx={c.x} cy={c.y} r="22" fill="#2160c4" stroke="#ffffff" strokeWidth="4" /><path d={`M${c.x - 7} ${c.y - 7}L${c.x + 7} ${c.y + 7}M${c.x + 7} ${c.y - 1}V${c.y + 7}H${c.x - 1}`} fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></g>
      </g>
    );
  };
  const travel = (o: AnimObject) => o.keys.flatMap((k, i) => {
    if (!k.path) return [];
    const p = t.paths.find((x) => x.id === k.path!.id);
    if (!p) return [];
    const next = o.keys[i + 1]?.t ?? t.len, end = Math.min(next, t.len, k.t + (pathDuration(p, k.path.speed) as number));
    return [<span key={`p${i}`} className="an-travel" style={{ left: `${(k.t / t.len) * 100}%`, width: `${(Math.max(0, end - k.t) / t.len) * 100}%`, background: colors[t.paths.indexOf(p) % colors.length] }} />];
  });
  const eps = KEY_EPS as number;
  const ease = key?.ease ?? [...(obj?.keys ?? [])].reverse().find((k) => k.t < time)?.ease ?? 'inout';

  return (
    <div className="receipt-options an-editor">
      <style>{CLASS_CSS}</style>
      <div className="an-main">
        <div className="an-bar">
          <button type="button" className="knopf compact" aria-label={playing ? 'Anhalten' : 'Abspielen'} onClick={play}>{playing ? '❚❚' : '▶'}</button>
          <button type="button" className="knopf compact" aria-label="Zum Anfang" onClick={() => { setPlaying(false); setTime(0); }}>⟲</button>
          <span className="an-time">{timeText(time)} / {t.len} s</span>
          <span style={{ flex: 1 }} />
          <button type="button" className="knopf compact" disabled={!undoable} onClick={undo}>Rückgängig</button>
          <button type="button" className={`knopf compact${tool === 'path' ? ' is-active' : ''}`} aria-pressed={tool === 'path'} disabled={t.paths.length >= 4 && tool !== 'path'} onClick={() => setTool(tool === 'path' ? 'move' : 'path')}>Pfad zeichnen</button>
        </div>
        <p className="option-hint">
          {tool === 'path'
            ? obj ? `Zeichne mit dem Finger einen Weg – „${obj.name}“ fährt ihn ab ${timeText(time)} ab.` : 'Zeichne mit dem Finger einen Weg. Wähle danach bei einem Keyframe „Pfad“.'
            : t.objects.length ? 'Setze die Abspielmarke unten auf eine Zeit und verschiebe, drehe ○ oder vergrößere ⤡ ein Objekt – dort entsteht ein Keyframe ◆.' : 'Lege unten Texte, Bilder oder Sticker auf die Bühne – oder sieh dir das Beispiel an.'}
        </p>
        {msg && <p className="option-hint" role="status">{msg}</p>}
        <div className="an-stagewrap">
          <svg ref={stage} className={`an-stage${tool === 'path' ? ' is-path' : ''}`} viewBox={`0 0 ${SW} ${SH}`} role="application" aria-label="Bühne der Animation" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
            <g dangerouslySetInnerHTML={{ __html: bg }} />
            <g dangerouslySetInnerHTML={{ __html: pathsShown }} pointerEvents="none" />
            {t.objects.map((o) => {
              const st = stateAt(o, time, t) as State;
              return <g key={o.id} data-o={o.id} className="an-obj" transform={objectTransform(st)} opacity={playing ? st.o : Math.max(st.o, 0.18)} dangerouslySetInnerHTML={{ __html: svgs.get(o.id) ?? '' }} />;
            })}
            {drag?.kind === 'path' && <path d={drag.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')} fill="none" stroke={colors[t.paths.length % colors.length]} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />}
            {handles()}
          </svg>
          {!t.objects.length && (
            <div className="an-empty">
              <button type="button" className="knopf compact" onClick={addText}>Text</button>
              <button type="button" className="knopf compact is-active" onClick={() => { commit(animationExample() as Anim); setSelected(null); setTime(0); setPlaying(true); }}>Beispiel ansehen</button>
            </div>
          )}
        </div>
        <div className="an-timeline">
          <div className="an-row">
            <span className="an-name" title="Der Stern zeigt, welches Bild man vor dem Abspielen sieht.">★ Vorschaubild</span>
            <div className="an-track an-ruler" ref={ruler} onPointerDown={scrub}>
              {Array.from({ length: t.len + 1 }, (_, i) => <span key={i} className="an-tick" style={{ left: `${(i / t.len) * 100}%` }}>{i}</span>)}
              <span className="an-head" style={{ left: `${(time / t.len) * 100}%` }} />
              <span role="slider" tabIndex={0} aria-label="Vorschaubild" aria-valuemin={0} aria-valuemax={t.len} aria-valuenow={t.poster} aria-valuetext={timeText(t.poster)} className={`an-poster${Math.abs(t.poster - time) < eps ? ' is-current' : ''}`} style={{ left: `${(t.poster / t.len) * 100}%` }} onPointerDown={dragPoster}>★</span>
            </div>
          </div>
          {[...t.objects].reverse().map((o) => (
            <div key={o.id} className={`an-row${o.id === selected ? ' is-active' : ''}`}>
              <button type="button" className="an-name" onClick={() => { setSelected(o.id); setTab('obj'); }}>{o.kind === 'text' ? 'T' : o.kind === 'image' ? '🖼' : '★'} {o.name}</button>
              <div className="an-track" onPointerDown={(e) => { setSelected(o.id); setTab('obj'); scrub(e); }}>
                {travel(o)}
                {o.keys.map((k, i) => <span key={i} role="button" aria-label={`Keyframe bei ${timeText(k.t)}`} className={`an-key${o.id === selected && Math.abs(k.t - time) < eps ? ' is-current' : ''}${k.o < 0.5 ? ' is-hidden' : ''}`} style={{ left: `${(k.t / t.len) * 100}%` }} onPointerDown={(e) => dragKey(e, o, i)} />)}
                <span className="an-head" style={{ left: `${(time / t.len) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="learning-actions">
          <button type="button" className="knopf compact" disabled={!t.objects.length || msg.startsWith('Das GIF')} onClick={() => void gif()}>Als GIF speichern</button>
        </div>
      </div>

      <div className="an-side">
        <div className="tt-tabs" role="tablist" aria-label="Animation">
          <button type="button" role="tab" aria-selected={tab === 'obj'} className={`tt-tab${tab === 'obj' ? ' is-active' : ''}`} onClick={() => setTab('obj')}>Objekte</button>
          <button type="button" role="tab" aria-selected={tab === 'anim'} className={`tt-tab${tab === 'anim' ? ' is-active' : ''}`} onClick={() => setTab('anim')}>Animation</button>
        </div>
        {tab === 'anim' ? (
          <>
            <Choices label="Länge" value={t.len} onChange={(len) => { commit({ ...latest.current, len, poster: Math.min(latest.current.poster, len), objects: latest.current.objects.map((o) => ({ ...o, keys: o.keys.map((k) => ({ ...k, t: Math.min(k.t, len) })) })) }); setTime((x) => Math.min(x, len)); }} options={(ANIM_LENGTHS as number[]).map((v) => ({ value: v, label: `${v} s` }))}
              hint={t.objects.some((o) => o.keys.some((k) => k.t > t.len - 0.01 && t.len < 20)) ? 'Keyframes hinter dem Ende rücken beim Kürzen ans Ende.' : undefined} />
            <div className="receipt-option">
              <strong>Hintergrund</strong>
              <div className="mt-colors" role="radiogroup" aria-label="Farbe des Hintergrunds">
                {(ANIM_BACKGROUNDS as string[]).map((c) => <button key={c} type="button" role="radio" aria-checked={t.bg === c} aria-label={c} style={{ background: c }} onClick={() => put({ ...latest.current, bg: c })} />)}
              </div>
              <div className="learning-actions">
                <label className="knopf compact">
                  {t.bgImg ? 'Anderes Bild …' : 'Bild als Hintergrund …'}
                  <input className="visually-hidden" type="file" accept="image/*" aria-label="Hintergrundbild der Animation" disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (img) => commit({ ...latest.current, bgImg: img })); e.target.value = ''; }} />
                </label>
                {t.bgImg && <button type="button" className="knopf compact" onClick={() => commit({ ...latest.current, bgImg: undefined })}>Bild weg</button>}
              </div>
            </div>
            <Toggle checked={t.loop} label="Am Ende von vorn beginnen" onChange={(loop) => put({ ...latest.current, loop })} />
            <Toggle checked={t.auto} label="Startet von selbst" hint="sobald die Seite aufgeschlagen wird" onChange={(auto) => put({ ...latest.current, auto })} />
            <Toggle checked={t.showPaths} label="Pfade beim Abspielen zeigen" onChange={(showPaths) => put({ ...latest.current, showPaths })} />
            <div className="receipt-option">
              <strong>Vorschaubild</strong>
              <p className="option-hint">So sieht man die Animation, bevor sie abgespielt wird – auf der Seite, in Vorschaubildern und im PDF. Zieh dafür den Stern in der Zeitleiste an die passende Stelle. Jetzt: bei {timeText(t.poster)}.</p>
              <div className="learning-actions">
                <button type="button" className="knopf compact" disabled={Math.abs(t.poster - time) < eps} onClick={() => commit({ ...latest.current, poster: snapTime(time, t.len) as number })}>Bild an der Abspielmarke ({timeText(time)})</button>
                {t.poster > 0 && <button type="button" className="knopf compact" onClick={() => commit({ ...latest.current, poster: 0 })}>Zurück auf 0 s</button>}
              </div>
            </div>
            <div className="receipt-option">
              <strong>Pfade ({t.paths.length} von 4)</strong>
              {!t.paths.length && <p className="option-hint">Noch keine. Tippe oben auf „Pfad zeichnen“ und zeichne mit dem Finger einen Weg.</p>}
              {t.paths.map((p, i) => (
                <div key={p.id} className="map-row"><span className="map-pathswatch" style={{ background: colors[i % colors.length] }} /><span>Pfad {i + 1}</span><span style={{ flex: 1 }} /><button type="button" className="knopf compact" aria-label={`Pfad ${i + 1} löschen`} onClick={() => removePath(p.id)}>Löschen</button></div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="receipt-option">
              <strong>Objekte ({t.objects.length} von 8)</strong>
              <div className="learning-actions">
                <button type="button" className="knopf compact" disabled={t.objects.length >= 8} onClick={addText}>Text</button>
                <label className="knopf compact">
                  Bild …
                  <input className="visually-hidden" type="file" accept="image/*" aria-label="Bild für die Animation" disabled={busy || t.objects.length >= 8} onChange={(e) => { const f = e.target.files?.[0]; if (f) addImage(f); e.target.value = ''; }} />
                </label>
                <button type="button" className="knopf compact" aria-expanded={picking} disabled={t.objects.length >= 8} onClick={() => setPicking(!picking)}>Sticker …</button>
              </div>
              {picking && (
                <div className="mt-icons">
                  {Object.entries(stickers).map(([group, list]) => (
                    <div key={group} role="group" aria-label={group}>
                      <small>{group}</small>
                      {list.map(([symbol, label]) => <button key={symbol} type="button" aria-label={label} title={label} onClick={() => addSticker(symbol, label)}>{symbol}</button>)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {obj ? (
              <>
                <div className="map-edit">
                  <div className="learning-actions">
                    <strong style={{ flex: 1 }}>{obj.name}</strong>
                    <button type="button" className="knopf compact" aria-label="Nach vorne" disabled={t.objects[t.objects.length - 1]?.id === obj.id} onClick={() => reorder(obj.id, 1)}>↑</button>
                    <button type="button" className="knopf compact" aria-label="Nach hinten" disabled={t.objects[0]?.id === obj.id} onClick={() => reorder(obj.id, -1)}>↓</button>
                    <button type="button" className="knopf compact" onClick={() => duplicate(obj)}>Verdoppeln</button>
                    <button type="button" className="knopf compact" disabled={obj.kind === 'text'} onClick={() => change(obj.id, { flip: !obj.flip })}>Spiegeln</button>
                    <button type="button" className="knopf compact" onClick={() => remove(obj.id)}>Löschen</button>
                  </div>
                  {obj.kind === 'text' ? (
                    <>
                      <textarea className="dnd-input" rows={2} aria-label="Text" value={obj.text ?? ''} onChange={(e) => changeText(obj, { text: e.target.value.split('\n').slice(0, 3).join('\n').slice(0, 160), name: (e.target.value.split('\n')[0] || 'Text').slice(0, 30) })} />
                      <Choices label="Schrift" value={obj.font ?? 'andika'} onChange={(font) => changeText(obj, { font })} options={(ANIM_FONTS as string[]).map((f) => ({ value: f, label: fontOf(f).label as string }))} />
                      <Toggle checked={!!obj.bold} label="Fett" onChange={(bold) => changeText(obj, { bold })} />
                      <label className="receipt-option"><strong>Farbe</strong><input type="color" aria-label="Textfarbe" value={obj.color ?? '#1f2937'} onChange={(e) => change(obj.id, { color: e.target.value })} /></label>
                      <Toggle checked={!!obj.fill} label="Kasten dahinter" onChange={(v) => changeText(obj, { fill: v ? '#fff3bf' : undefined })} />
                      {obj.fill && <label className="receipt-option"><strong>Farbe des Kastens</strong><input type="color" aria-label="Farbe des Kastens" value={obj.fill} onChange={(e) => changeText(obj, { fill: e.target.value })} /></label>}
                    </>
                  ) : (
                    <label className="receipt-option"><strong>Name</strong><input className="text-input" aria-label="Name des Objekts" value={obj.name} maxLength={40} onChange={(e) => change(obj.id, { name: e.target.value }, false)} /></label>
                  )}
                </div>
                <div className="map-edit">
                  <strong>◆ {key ? `Keyframe bei ${timeText(time)}` : `Bei ${timeText(time)}`}</strong>
                  {!key && <p className="option-hint">Hier ist noch kein Keyframe. Jede Änderung legt einen an.</p>}
                  <div className="learning-actions">
                    {!key && <button type="button" className="knopf compact" onClick={() => keyChange({})}>Keyframe setzen</button>}
                    {key && obj.keys.length > 1 && <button type="button" className="knopf compact" onClick={removeKey}>Keyframe löschen</button>}
                  </div>
                  {now && (
                    <>
                      <Slider label="Größe" value={Math.round(now.s * 100)} min={10} max={400} step={5} format={(v) => `${v} %`} onChange={(v) => keyChange({ s: v / 100 })} />
                      <Slider label="Drehung" value={Math.round(now.rot)} min={-180} max={180} step={5} format={(v) => `${v}°`} onChange={(v) => keyChange({ rot: v })} />
                      <Slider label="Sichtbarkeit" value={Math.round(now.o * 100)} min={0} max={100} step={5} format={(v) => `${v} %`} onChange={(v) => keyChange({ o: v / 100 })} />
                      <div className="learning-actions">
                        <button type="button" className="knopf compact" onClick={() => keyChange({ o: 0 })}>Unsichtbar</button>
                        <button type="button" className="knopf compact" onClick={() => keyChange({ o: 1 })}>Sichtbar</button>
                      </div>
                      <p className="option-hint">Ein- und Ausblenden: zwei Keyframes mit verschiedener Sichtbarkeit.</p>
                    </>
                  )}
                  <Choices label="Bewegung bis zum nächsten Keyframe" value={ease} onChange={(e) => keyChange({ ease: e })} options={eases.map((e) => ({ value: e.id, label: e.label }))} hint={eases.find((e) => e.id === ease)?.hint} />
                  {t.paths.length ? (
                    <>
                      <Choices label="Pfad" value={key?.path?.id ?? ''} onChange={(id) => choosePath(id || null)} options={[{ value: '', label: 'Ohne Pfad' }, ...t.paths.map((p, i) => ({ value: p.id, label: `Pfad ${i + 1}` }))]} />
                      {key?.path && (
                        <>
                          <Slider label="Geschwindigkeit" value={key.path.speed} min={50} max={1200} step={50} format={(v) => (v <= 150 ? 'langsam' : v <= 450 ? 'mittel' : v <= 800 ? 'schnell' : 'sehr schnell')} onChange={(speed) => keyChange({ path: { ...key.path!, speed } })} />
                          <Toggle checked={!!key.path.turn} label="In Fahrtrichtung drehen" onChange={(turn) => keyChange({ path: { ...key.path!, turn: turn || undefined } })} />
                          <p className="option-hint">Dauer auf dem Pfad: {timeText(pathDuration(t.paths.find((p) => p.id === key.path!.id), key.path.speed))}. Ein Keyframe danach beendet den Weg dort.</p>
                        </>
                      )}
                    </>
                  ) : <p className="option-hint">Zeichne oben mit „Pfad zeichnen“ einen Weg – das gewählte Objekt folgt ihm dann.</p>}
                </div>
              </>
            ) : t.objects.length > 0 && <p className="option-hint">Tippe auf der Bühne oder unten in der Zeitleiste auf ein Objekt.</p>}
          </>
        )}
      </div>
    </div>
  );
}
