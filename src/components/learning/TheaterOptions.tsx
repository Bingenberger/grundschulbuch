/* eslint-disable @next/next/no-img-element -- Generated pictures of the stage and figures, school media. */
'use client';
// Settings of the Puppentheater with the choices of the reference's dialog:
// title, stage picture (or an own picture), up to six figures (each with the
// figure editor), automatic turning to the next stage. Recording, playing and
// the video happen on the stage itself.
import { useState } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { figureSvg, THEATER_BACKS, theaterBackPicture } from '@/lib/reference/tools-runtime';
import { findPicture } from '@/lib/learning/picture-search';
import { Toggle } from '../sheets/SheetParts';
import { figureLook } from './FigureWidget';
import { FIGURE_FIELDS, figureDraft, figureFromDraft } from './FigureOptions';
import { theaterSettings } from './TheaterWidget';
import ToolForm from './ToolForm';

type Cast = { av: Record<string, unknown>; x: number; y: number; s: number };
const svg = (markup: unknown) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(String(markup))}`;
const MAX = 6;

export default function TheaterOptions({ value, onChange, upload, busy }: { value: unknown; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean }) {
  const th = theaterSettings(value);
  const cast = th.cast as Cast[];
  const [editing, setEditing] = useState<number | null>(null);
  const [note, setNote] = useState('');
  // New settings: the recorded take belongs to the old cast and is dropped.
  const set = (patch: Record<string, unknown>, keepTake = true) => onChange(theaterSettings({ ...th, ...patch, ...(keepTake ? {} : { take: undefined }) }) as unknown as JsonValue);
  const castPatch = (next: Cast[]) => set({ cast: next }, false);
  const search = async () => {
    const word = String(th.title || '').trim();
    if (!word) { setNote('Gib zuerst den Titel ein – dazu wird ein Bild gesucht.'); return; }
    setNote(`Suche ein Bild für „${word}“ …`);
    try { const src = await findPicture(word, new AbortController().signal); if (src) { set({ img: src }); setNote(''); } else setNote(`Kein Bild für „${word}“ gefunden.`); } catch (e) { setNote((e as Error).message); }
  };
  return (
    <div className="receipt-options tool-options">
      <label className="receipt-option">
        <strong>Titel des Stücks</strong>
        <input className="text-input" aria-label="Titel" placeholder="z. B. Der verlorene Ball" maxLength={80} value={String(th.title ?? '')} onChange={(e) => set({ title: e.target.value })} />
        <small className="option-hint">Steht unten in der Leiste und im Video.</small>
      </label>
      <div className="receipt-option">
        <strong>Bühnenbild</strong>
        <div className="listen-picks" role="radiogroup" aria-label="Bühnenbild">
          {(THEATER_BACKS as unknown as { id: string; label: string }[]).map((b) => (
            <button key={b.id} type="button" role="radio" className="listen-pick" aria-checked={!th.img && th.back === b.id} onClick={() => set({ back: b.id, img: undefined })}>
              <img src={theaterBackPicture(b.id) as string} alt="" />
              <small>{b.label}</small>
            </button>
          ))}
          {!!th.img && <span className="listen-pick" role="radio" aria-checked="true"><img src={String(th.img)} alt="" /><small>Eigenes Bild</small></span>}
        </div>
        <div className="learning-actions">
          <label className="knopf compact">
            Eigenes Bild …
            <input className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label="Eigenes Bühnenbild" disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (img) => set({ img })); e.target.value = ''; }} />
          </label>
          <button type="button" className="knopf compact" onClick={() => void search()}>Bild zum Titel suchen</button>
        </div>
        {note && <p className="option-hint" role="status">{note}</p>}
      </div>
      <div className="receipt-option">
        <strong>Figuren ({cast.length} von {MAX})</strong>
        <div className="theater-cast">
          {cast.map((c, i) => (
            <div key={i} className="theater-figure">
              <img src={svg(figureSvg(figureLook(c.av), {}, {}))} alt={`Figur ${i + 1}`} />
              <div className="learning-actions">
                <button type="button" className="knopf compact" aria-pressed={editing === i} onClick={() => setEditing(editing === i ? null : i)}>{editing === i ? 'Fertig' : `Figur ${i + 1} ändern`}</button>
                <button type="button" className="knopf compact" aria-label={`Figur ${i + 1} entfernen`} onClick={() => { castPatch(cast.filter((_, j) => j !== i)); setEditing(null); }}>Entfernen</button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="knopf" disabled={cast.length >= MAX} onClick={() => { castPatch([...cast, { av: figureLook({ child: true }), x: 200 + cast.length * 180, y: 800, s: 1 }]); setEditing(cast.length); }}>＋ Figur</button>
        {editing !== null && cast[editing] && (
          <div className="theater-edit">
            <ToolForm key={editing} fields={FIGURE_FIELDS.filter((f) => !('key' in f) || !['sayText', 'sayPitch'].includes(f.key))} value={figureDraft({ av: cast[editing].av as never })}
              onChange={(d) => castPatch(cast.map((c, j) => (j === editing ? { ...c, av: figureFromDraft(d).av as unknown as Record<string, unknown> } : c)))} upload={upload} busy={busy} />
          </div>
        )}
        <p className="option-hint">Neue Figuren oder Änderungen löschen eine schon gemachte Aufnahme.</p>
      </div>
      <Toggle checked={!!th.next} label="Automatischer Seitenwechsel" hint="Ist auf der nächsten Seite auch ein Puppentheater, blättert das Heft nach dem Abspielen dorthin und spielt weiter." onChange={(next) => set({ next: next || undefined })} />
    </div>
  );
}
