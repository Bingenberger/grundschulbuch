/* eslint-disable @next/next/no-img-element -- Generated sound pictures and authenticated school media. */
'use client';
// Settings of Hör-Memory and Was hörst du? with the choices of the reference's
// dialog: game, kind of sounds (Alltag und Natur, Instrumente, eigene
// Aufnahmen), which sounds (at most eight; tapping plays them), own sounds with
// word and picture – and a preview that can be played right away.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { JsonValue } from '@/lib/learning/catalog';
import { LISTEN_FX, LISTEN_MAX, LISTEN_START, listenAssets, listenSettings, type ListenOwn, type ListenSettings } from '@/lib/learning/hoeren';
import { findPicture } from '@/lib/learning/picture-search';
import { LISTEN_INSTRUMENTS, listenSoundPicture, playListenSound, renderListen, resetListen, stopListen, TOOLS_CSS } from '@/lib/reference/tools-runtime';
import AudioDialog from '../AudioDialog';
import { LISTEN_HOST_CSS } from './ListenWidget';
import { Choices } from './OptionControls';

type Props = { value: unknown; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean };

const PREVIEW_ID = 'listen-preview';
const instrumentPicture = (pic: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><rect x="-10" y="-10" width="120" height="120" rx="18" fill="#7048e8"/>${pic}</svg>`)}`;

/** The tool itself, playable, as the preview of the reference's dialog. */
function Preview({ c }: { c: ListenSettings }) {
  const box = useRef<HTMLDivElement>(null);
  const key = JSON.stringify(c);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    resetListen(PREVIEW_ID);
    renderListen(el, { id: PREVIEW_ID, w: 1300, h: 820, locked: true, listen: c }, true, { assets: listenAssets(c) });
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => stopListen(), []);
  return (
    <div className="listen-preview">
      <style>{TOOLS_CSS + LISTEN_HOST_CSS}</style>
      <div ref={box} className="reference-widget lh-wg-listen is-live" role="group" aria-label="Vorschau zum Ausprobieren" />
    </div>
  );
}

export default function ListenOptions({ value, onChange, upload, busy }: Props) {
  const c = listenSettings(value);
  const latest = useRef(c);
  useLayoutEffect(() => { latest.current = c; });
  const set = (next: Partial<ListenSettings>) => onChange(listenSettings({ ...latest.current, ...next }) as unknown as JsonValue);
  const [recording, setRecording] = useState<{ index: number; label: string } | null>(null);
  const [note, setNote] = useState('');
  const own = (index: number, patch: Partial<ListenOwn>) => set({ own: latest.current.own.map((o, i) => (i === index ? { ...o, ...patch } : o)) });
  const move = (index: number, by: number) => {
    const list = [...latest.current.own], [item] = list.splice(index, 1);
    list.splice(index + by, 0, item);
    set({ own: list });
  };
  const choices = c.set === 'fx'
    ? LISTEN_FX.map((s) => ({ id: s.id, label: s.label, src: listenSoundPicture(s.id) as string }))
    : (LISTEN_INSTRUMENTS as unknown as { id: string; label: string; pic: string }[]).map((s) => ({ id: s.id, label: s.label, src: instrumentPicture(s.pic) }));
  const play = (id: string) => {
    if (c.set === 'fx') playListenSound(id, 2.5);
    else (LISTEN_INSTRUMENTS as unknown as { id: string; play: () => void }[]).find((s) => s.id === id)?.play();
  };
  const toggle = (id: string) => {
    const picks = latest.current.picks;
    set({ picks: picks.includes(id) ? picks.filter((p) => p !== id) : picks.length >= LISTEN_MAX ? picks : [...picks, id] });
  };
  const searchPicture = async (index: number) => {
    const word = latest.current.own[index]?.label.trim();
    if (!word) { setNote('Gib zuerst ein, was es ist – dann wird ein Bild dazu gesucht.'); return; }
    setNote(`Suche ein Bild für „${word}“ …`);
    try {
      const src = await findPicture(word, new AbortController().signal);
      // The search saves the picture on the school server.
      if (src) { own(index, { img: src }); setNote(''); } else setNote(`Kein Bild für „${word}“ gefunden.`);
    } catch (e) { setNote((e as Error).message); }
  };
  return (
    <div className="receipt-options listen-options">
      <Preview c={c} />
      <p className="option-hint">Probier es aus – die eingebauten Geräusche brauchen kein Internet.</p>
      <Choices label="Spiel" value={c.mode} onChange={(mode) => set({ mode })} options={[{ value: 'memory', label: 'Hör-Memory' }, { value: 'quiz', label: 'Was hörst du?' }]}
        hint={c.mode === 'memory' ? 'Karten antippen und die Paare finden, die gleich klingen.' : 'Auf das Ohr tippen, zuhören und das passende Bild wählen.'} />
      <Choices label="Geräusche" value={c.set} onChange={(kind) => set({ set: kind, picks: [...LISTEN_START[kind]] })} options={[{ value: 'fx', label: 'Alltag und Natur' }, { value: 'instruments', label: 'Instrumente' }, { value: 'own', label: 'Eigene Aufnahmen' }]} />
      {c.set === 'own' ? (
        <div className="receipt-option">
          <strong>Eigene Geräusche</strong>
          <ol className="listen-own">
            {c.own.map((o, i) => (
              <li key={i} className="listen-own-row">
                {o.img ? <img src={o.img} alt={`Bild für ${o.label || `Geräusch ${i + 1}`}`} /> : <span className="listen-own-empty" aria-hidden="true">?</span>}
                <input className="text-input" aria-label={`Geräusch ${i + 1}`} placeholder="Was ist es?" value={o.label} maxLength={30} onChange={(e) => own(i, { label: e.target.value })} />
                <div className="learning-actions">
                  <audio controls preload="none" src={o.sound} aria-label={`Geräusch ${i + 1} anhören`} />
                  <button type="button" className="knopf compact" onClick={() => setRecording({ index: i, label: o.label || `Geräusch ${i + 1}` })}>Neu aufnehmen</button>
                  <button type="button" className="knopf compact" onClick={() => void searchPicture(i)}>Bild suchen</button>
                  <label className="knopf compact">
                    Eigenes Bild
                    <input className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label={`Eigenes Bild für Geräusch ${i + 1}`} disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (img) => own(i, { img })); e.target.value = ''; }} />
                  </label>
                  <button type="button" className="knopf compact" disabled={i === 0} aria-label={`Geräusch ${i + 1} nach oben`} onClick={() => move(i, -1)}>↑</button>
                  <button type="button" className="knopf compact" disabled={i === c.own.length - 1} aria-label={`Geräusch ${i + 1} nach unten`} onClick={() => move(i, 1)}>↓</button>
                  <button type="button" className="knopf compact" aria-label={`Geräusch ${i + 1} entfernen`} onClick={() => set({ own: latest.current.own.filter((_, n) => n !== i) })}>Entfernen</button>
                </div>
              </li>
            ))}
          </ol>
          <div className="learning-actions">
            <button type="button" className="knopf" disabled={c.own.length >= LISTEN_MAX} onClick={() => setRecording({ index: -1, label: 'Neues Geräusch' })}>Geräusch aufnehmen</button>
            <label className="knopf">
              Tondatei wählen
              <input className="visually-hidden" type="file" accept="audio/*" aria-label="Tondatei für ein neues Geräusch" disabled={busy || c.own.length >= LISTEN_MAX} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (sound) => set({ own: [...latest.current.own, { label: f.name.replace(/\.[a-z0-9]+$/i, '').slice(0, 30), sound }] })); e.target.value = ''; }} />
            </label>
          </div>
          {note && <p className="option-hint" role="status">{note}</p>}
          <p className="option-hint">Z. B. die Klingel der Schule, das Klappern des Geschirrs, die Stimmen der Klasse – mit einem Foto dazu. Höchstens {LISTEN_MAX} Geräusche.</p>
        </div>
      ) : (
        <div className="receipt-option">
          <strong>Welche Geräusche?</strong>
          <p className="option-hint">Antippen wählt aus (höchstens {LISTEN_MAX}) und spielt das Geräusch vor. Gewählt: {c.picks.length}</p>
          <div className="listen-picks">
            {choices.map((s) => (
              <button key={s.id} type="button" className="listen-pick" aria-pressed={c.picks.includes(s.id)} onClick={() => { play(s.id); toggle(s.id); }}>
                <img src={s.src} alt="" />
                <small>{s.label}</small>
              </button>
            ))}
          </div>
        </div>
      )}
      {recording && createPortal(
        <div className="alphabet-recording">
          <p className="alphabet-recording-label">Geräusch aufnehmen: {recording.label}</p>
          <AudioDialog bookId="" onClose={() => setRecording(null)} onAudio={(sound) => {
            if (recording.index < 0) set({ own: [...latest.current.own, { label: '', sound }] });
            else own(recording.index, { sound });
            setRecording(null);
          }} />
        </div>,
        document.body,
      )}
    </div>
  );
}
