/* eslint-disable @next/next/no-img-element -- School media. */
'use client';
// The editor of the Diaschau, after the reference's dialog: photos (up to 30,
// each with caption and own sound, order), design, seconds per photo, wait for
// the sound, loop, transition, kind of caption, background music and its
// volume – and a full-screen preview played by the reference itself.
import { useLayoutEffect, useRef, useState } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { show, showAssets, type Show, type Slide } from '@/lib/learning/diaschau';
import { CLASS_CSS, playSlideshow, SHOW_CAPTIONS, SHOW_DESIGNS, SHOW_MOODS, SHOW_TRANSITIONS } from '@/lib/reference/class-runtime';
import { Slider, Toggle } from '../sheets/SheetParts';
import { Choices } from './OptionControls';

type Props = { value: unknown; title: string; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean };
const list = (v: unknown) => v as { id: string; label: string }[];
const designs = SHOW_DESIGNS as { id: string; label: string; bg: string; accent: string }[];

export default function SlideshowOptions({ value, title, onChange, upload, busy }: Props) {
  const s = show(value);
  const latest = useRef(s);
  useLayoutEffect(() => { latest.current = s; });
  const set = (next: Partial<Show>) => { const v = { ...latest.current, ...next }; latest.current = v; onChange(v as unknown as JsonValue); };
  const setSlide = (i: number, next: Partial<Slide>) => set({ slides: latest.current.slides.map((x, j) => (j === i ? { ...x, ...next } : x)) });
  const move = (i: number, d: number) => {
    const l = [...latest.current.slides];
    if (i + d < 0 || i + d >= l.length) return;
    [l[i], l[i + d]] = [l[i + d], l[i]];
    set({ slides: l });
  };
  const [note, setNote] = useState('');
  const addPhotos = async (files: File[]) => {
    const pics = files.filter((f) => f.type.startsWith('image/')).sort((a, b) => a.name.localeCompare(b.name, 'de', { numeric: true }));
    if (!pics.length) { setNote('Darin sind keine Bilder.'); return; }
    const room = 30 - latest.current.slides.length;
    if (room <= 0) { setNote('Eine Diaschau hat höchstens 30 Fotos.'); return; }
    if (pics.length > room) setNote(`Es werden ${room} von ${pics.length} Bildern übernommen – höchstens 30 Fotos.`);
    else setNote('');
    for (const [i, f] of pics.slice(0, room).entries()) {
      setNote(`Fotos werden gespeichert … ${i + 1} von ${Math.min(room, pics.length)}`);
      await upload(f, (img) => set({ slides: [...latest.current.slides, { img }] }));
    }
    setNote('');
  };
  const mood = s.music?.sound ? 'own' : s.music?.mood ?? 'none';
  const vol = Math.round((s.music?.vol ?? 0.6) * 100);

  return (
    <div className="receipt-options">
      <style>{CLASS_CSS}</style>
      <div className="receipt-option">
        <strong>Fotos: {s.slides.length} von höchstens 30</strong>
        <div className="learning-actions">
          <label className="knopf compact">
            Fotos wählen …
            <input className="visually-hidden" type="file" accept="image/*" multiple aria-label="Fotos für die Diaschau" disabled={busy || s.slides.length >= 30} onChange={(e) => { void addPhotos([...(e.target.files ?? [])]); e.target.value = ''; }} />
          </label>
          <button type="button" className="knopf compact" disabled={!s.slides.length || busy} onClick={() => playSlideshow({ ...latest.current, title: title.trim() || latest.current.title }, (x: string) => showAssets(latest.current)[x]?.dataUrl)}>Vorschau</button>
        </div>
        {note && <p className="option-hint" role="status">{note}</p>}
        <p className="option-hint">Die Fotos passen sich in der Diaschau von selbst ein – hoch oder quer.</p>
        {s.slides.length > 0 && (
          <ol className="show-list">
            {s.slides.map((sl, i) => (
              <li key={sl.img + i} className="show-row">
                <span className="show-no">{i + 1}</span>
                <img className="show-thumb" alt="" src={sl.img} />
                <input className="text-input" value={sl.caption ?? ''} maxLength={200} placeholder="Beschriftung (freiwillig)" aria-label={`Beschriftung von Foto ${i + 1}`} onChange={(e) => setSlide(i, { caption: e.target.value })} />
                {sl.sound ? (
                  <button type="button" className="knopf compact" aria-label={`Ton von Foto ${i + 1} entfernen`} onClick={() => setSlide(i, { sound: undefined })}>× Ton</button>
                ) : (
                  <label className="knopf compact">
                    Ton
                    <input className="visually-hidden" type="file" accept="audio/*" aria-label={`Ton zu Foto ${i + 1}`} disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (sound) => setSlide(i, { sound })); e.target.value = ''; }} />
                  </label>
                )}
                <button type="button" className="knopf compact" aria-label="Nach vorn" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                <button type="button" className="knopf compact" aria-label="Nach hinten" disabled={i === s.slides.length - 1} onClick={() => move(i, 1)}>↓</button>
                <button type="button" className="knopf compact" aria-label={`Foto ${i + 1} entfernen`} onClick={() => set({ slides: latest.current.slides.filter((_, j) => j !== i) })}>Entfernen</button>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="receipt-option">
        <strong>Design</strong>
        <div className="map-designs" role="radiogroup" aria-label="Design">
          {designs.map((d) => (
            <button key={d.id} type="button" role="radio" aria-checked={s.design === d.id} className={`knopf compact${s.design === d.id ? ' is-active' : ''}`} onClick={() => set({ design: d.id })}>
              <span className="map-swatch" style={{ background: d.bg, borderColor: d.accent }} /> {d.label}
            </button>
          ))}
        </div>
      </div>
      <Slider label="Ablauf" value={s.dur} min={2} max={20} format={(v) => `${v} Sekunden pro Foto`} onChange={(dur) => set({ dur })} />
      <Toggle checked={s.wait} label="Foto bleibt, bis sein Ton zu Ende ist" hint="Ein Foto mit Ton wechselt erst, wenn der Ton fertig ist – auch wenn das länger dauert." onChange={(wait) => set({ wait })} />
      <Toggle checked={s.loop} label="Am Ende von vorn beginnen" onChange={(loop) => set({ loop })} />
      <Choices label="Übergang" value={s.transition} onChange={(transition) => set({ transition })} options={list(SHOW_TRANSITIONS).map((t) => ({ value: t.id, label: t.label }))} />
      <Choices label="Beschriftung" value={s.caption} onChange={(caption) => set({ caption })} options={list(SHOW_CAPTIONS).map((t) => ({ value: t.id, label: t.label }))} hint="Die Beschriftung jedes Fotos schreibst du oben in die Liste." />
      <div className="receipt-option">
        <strong>Hintergrundmusik</strong>
        <div className="map-designs" role="radiogroup" aria-label="Hintergrundmusik">
          {[{ id: 'none', label: 'Keine' }, ...list(SHOW_MOODS)].map((m) => (
            <button key={m.id} type="button" role="radio" aria-checked={mood === m.id} className={`knopf compact${mood === m.id ? ' is-active' : ''}`} onClick={() => set({ music: m.id === 'none' ? undefined : { mood: m.id, vol: vol / 100 } })}>{m.label}</button>
          ))}
          <label className={`knopf compact${mood === 'own' ? ' is-active' : ''}`}>
            Eigene Musik …
            <input className="visually-hidden" type="file" accept="audio/*" aria-label="Eigene Musik für die Diaschau" disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (sound) => set({ music: { sound, vol: vol / 100 } })); e.target.value = ''; }} />
          </label>
        </div>
        {mood !== 'none' && <Slider label="Lautstärke der Musik" value={vol} min={5} max={100} step={5} format={(v) => `${v} %`} hint="Spricht ein Foto, wird die Musik von selbst leiser." onChange={(v) => set({ music: { ...latest.current.music!, vol: v / 100 } })} />}
      </div>
    </div>
  );
}
