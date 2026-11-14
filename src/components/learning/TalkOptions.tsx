'use client';
// Settings of a Sprechtaste as in the reference: word, what is said, colour
// (the colours of the word classes), picture (ARASAAC search or own picture),
// own recording, without word, Zurück-Taste – with a preview of the key.
import { useLayoutEffect, useRef, useState } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { talkAssets, talkConfig, talkItem, WORD_COLORS, type TalkConfig } from '@/lib/learning/uk';
import { findPicture } from '@/lib/learning/picture-search';
import { CLASS_CSS, renderTalk } from '@/lib/reference/class-runtime';
import { Toggle } from '../sheets/SheetParts';

type Props = { value: unknown; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean };

function Preview({ c }: { c: TalkConfig }) {
  const box = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.replaceChildren();
    el.className = 'talk-key';
    renderTalk(talkItem(c, 'preview', 180, 180), el, { interactive: false, assets: talkAssets(c), placeholders: true });
  });
  return (
    <div className="time-preview">
      <style>{CLASS_CSS}</style>
      <div ref={box} className="talk-key" style={{ position: 'relative', width: 180, height: 180 }} />
    </div>
  );
}

export default function TalkOptions({ value, onChange, upload, busy }: Props) {
  const c = talkConfig(value);
  const latest = useRef(c);
  useLayoutEffect(() => { latest.current = c; });
  const set = (next: Partial<TalkConfig>) => onChange(talkConfig({ ...latest.current, ...next }) as unknown as JsonValue);
  const [note, setNote] = useState('');
  const search = async () => {
    const word = c.label.trim();
    if (!word) { setNote('Gib zuerst ein Wort ein, dann wird ein Bild dazu gesucht.'); return; }
    setNote(`Suche ein Bild für „${word}“ …`);
    try {
      const src = await findPicture(word, new AbortController().signal);
      if (src) { set({ img: src }); setNote(''); } else setNote(`Kein Bild für „${word}“ gefunden.`);
    } catch (e) { setNote((e as Error).message); }
  };
  return (
    <div className="receipt-options">
      <Preview c={c} />
      <label className="receipt-option">
        <strong>Wort</strong>
        <input className="text-input" aria-label="Wort auf der Taste" placeholder="z. B. trinken" value={c.label} maxLength={60} onChange={(e) => set({ label: e.target.value })} />
      </label>
      <label className="receipt-option">
        <strong>Das sagt die Taste</strong>
        <input className="text-input" aria-label="Das sagt die Taste" placeholder={c.label ? `leer: „${c.label}“` : 'z. B. Ich möchte etwas trinken.'} value={c.say ?? ''} maxLength={200} onChange={(e) => set({ say: e.target.value })} />
        <small className="option-hint">Leer lassen: Die Taste sagt ihr Wort. In die Satzleiste kommt immer das Wort.</small>
      </label>
      <div className="receipt-option">
        <strong>Farbe</strong>
        <div className="mt-colors" role="radiogroup" aria-label="Farbe">
          {WORD_COLORS.map((w) => (
            <button key={w.label} type="button" role="radio" aria-checked={c.color === w.color} aria-label={w.label} title={w.label} style={{ background: w.color }} onClick={() => set({ color: w.color })} />
          ))}
        </div>
        <small className="option-hint">Farben der Wortarten: {WORD_COLORS.map((w) => w.label).join(', ')}.</small>
      </div>
      <div className="receipt-option">
        <strong>Bild</strong>
        <div className="learning-actions">
          <button type="button" className="knopf compact" onClick={() => void search()}>Bild zum Wort suchen</button>
          <label className="knopf compact">
            Eigenes Bild
            <input className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label="Eigenes Bild für die Taste" disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (img) => set({ img })); e.target.value = ''; }} />
          </label>
          {c.img && <button type="button" className="knopf compact" onClick={() => set({ img: undefined })}>Ohne Bild</button>}
        </div>
        {note && <p className="option-hint" role="status">{note}</p>}
      </div>
      <div className="receipt-option">
        <strong>Eigene Aufnahme</strong>
        <div className="learning-actions">
          <label className="knopf compact">
            Tondatei wählen
            <input className="visually-hidden" type="file" accept="audio/*" aria-label="Tondatei für die Taste" disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (sound) => set({ sound })); e.target.value = ''; }} />
          </label>
          {c.sound && <button type="button" className="knopf compact" onClick={() => set({ sound: undefined })}>Ohne Aufnahme</button>}
        </div>
        <small className="option-hint">{c.sound ? 'Die Taste spielt die Aufnahme ab.' : 'Ohne eigene Aufnahme spricht die Computerstimme des Geräts.'}</small>
      </div>
      <Toggle checked={!!c.noLabel} label="Wort nicht anzeigen" hint="Nur das Bild – gesprochen wird trotzdem." onChange={(noLabel) => set({ noLabel })} />
      <Toggle checked={!!c.back} label="Zurück-Taste" hint="Führt zur Tafel, von der man kam." onChange={(back) => set({ back })} />
      <p className="option-hint">Eine Taste kann zu einer anderen Seite führen (z. B. zu einer Tafel): Taste auswählen und oben „Link“ wählen.</p>
    </div>
  );
}
