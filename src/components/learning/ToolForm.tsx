/* eslint-disable @next/next/no-img-element -- Generated pictures and authenticated school media. */
'use client';
// Settings of a tool of Lernsachen-Heft 1.47.3, described as fields – the
// dialogs of the reference are all built from the same parts: a title, rows
// of buttons, switches, a colour, lists of entries with picture and word,
// ready-made lists. Like the reference, the form edits a draft (an empty new
// row stays until it is filled) and passes on the cleaned settings.
import { useLayoutEffect, useRef, useState } from 'react';
import { findPicture } from '@/lib/learning/picture-search';
import { Toggle } from '../sheets/SheetParts';
import { Choices } from './OptionControls';

export type Draft = Record<string, unknown>;
type When = { when?: (d: Draft) => boolean };
type Row = Record<string, unknown>;
export type Field = When & (
  | { t: 'text'; key: string; label: string; placeholder?: string; max?: number }
  | { t: 'lines'; key: string; label: string; hint?: string; max: number; rows?: number; placeholder?: string }
  | { t: 'choice'; key: string; label: string; options: { value: string | number | boolean; label: string }[] | ((d: Draft) => { value: string | number | boolean; label: string }[]); hint?: string | ((d: Draft) => string) }
  | { t: 'toggle'; key: string; label: string; hint?: string }
  | { t: 'colors'; key: string; label: string; colors: string[] }
  | { t: 'pick'; key: string; label: string; options: { id: string; label: string; src: string }[]; min?: number; hint?: string }
  | { t: 'presets'; label: string; options: { label: string; apply: (d: Draft) => Draft }[] }
  | { t: 'button'; label: string; apply: (d: Draft) => Draft; disabled?: (d: Draft) => boolean }
  | { t: 'note'; text: string | ((d: Draft) => string) }
  | {
      t: 'list'; key: string; label: string; what: string; max: number; min?: number;
      /** Main text of a row and its placeholder. */
      text?: string; placeholder?: string; textMax?: number;
      /** A second short text (time, number, year …). */
      extra?: { key: string; label: string; placeholder: string; max?: number; clean?: (v: string) => string };
      /** A switch per row (e.g. who speaks). */
      flag?: { key: string; on: string; off: string };
      picture?: boolean;
      /** A new row (default: empty text). */
      fresh?: (rows: Row[]) => Row;
    }
);

function move<T>(list: T[], index: number, by: number) {
  const next = [...list], [item] = next.splice(index, 1);
  next.splice(index + by, 0, item);
  return next;
}

/** Picture of a row: search by its word, own picture, or none. */
function RowPicture({ row, label, onChange, upload, busy }: { row: Row; label: string; onChange: (img: string | undefined) => void; upload: Upload; busy: boolean }) {
  const [note, setNote] = useState('');
  const word = String(row.q || row.text || row.label || row.name || '').trim();
  const search = async () => {
    if (!word) { setNote('Erst ein Wort eingeben, dann wird ein Bild dazu gesucht.'); return; }
    setNote(`Suche ein Bild für „${word}“ …`);
    try { const src = await findPicture(word, new AbortController().signal); if (src) { onChange(src); setNote(''); } else setNote(`Kein Bild für „${word}“ gefunden.`); }
    catch (e) { setNote((e as Error).message); }
  };
  return (
    <>
      <button type="button" className="knopf compact" onClick={() => void search()}>Bild suchen</button>
      <label className="knopf compact">
        Eigenes Bild
        <input className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label={`Eigenes Bild: ${label}`} disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (img) => onChange(img)); e.target.value = ''; }} />
      </label>
      {!!row.img && <button type="button" className="knopf compact" onClick={() => onChange(undefined)}>Ohne Bild</button>}
      {note && <span className="option-hint" role="status">{note}</span>}
    </>
  );
}

type Upload = (file: File, done: (src: string) => void) => Promise<void>;

export default function ToolForm({ fields, value, onChange, upload, busy }: { fields: Field[]; value: Draft; onChange: (d: Draft) => void; upload: Upload; busy: boolean }) {
  const [draft, setDraft] = useState<Draft>(() => structuredClone(value));
  const latest = useRef(draft);
  useLayoutEffect(() => { latest.current = draft; });
  const set = (next: Draft) => { const d = { ...latest.current, ...next }; latest.current = d; setDraft(d); onChange(d); };
  const [searching, setSearching] = useState('');

  /** Pictures for all rows of a list that have a word but no picture (as “Fehlende Bilder suchen”). */
  const searchAll = async (key: string) => {
    const rows = [...(latest.current[key] as Row[])];
    let missing = 0;
    setSearching(key);
    for (let i = 0; i < rows.length; i++) {
      const word = String(rows[i].q || rows[i].text || rows[i].label || '').trim();
      if (rows[i].img || !word) continue;
      try { const src = await findPicture(word, new AbortController().signal); if (src) rows[i] = { ...rows[i], img: src }; else missing++; } catch { missing++; }
    }
    setSearching('');
    set({ [key]: rows });
    return missing;
  };

  return (
    <>
      {fields.filter((f) => !f.when || f.when(draft)).map((f, n) => {
        switch (f.t) {
          case 'text':
            return (
              <label key={n} className="receipt-option">
                <strong>{f.label}</strong>
                <input className="text-input" aria-label={f.label} placeholder={f.placeholder} value={String(draft[f.key] ?? '')} maxLength={f.max ?? 80} onChange={(e) => set({ [f.key]: e.target.value })} />
              </label>
            );
          case 'lines': {
            const lines = (draft[f.key] as string[]) ?? [];
            return (
              <label key={n} className="receipt-option">
                <strong>{f.label}</strong>
                <textarea className="text-input" rows={f.rows ?? 6} aria-label={f.label} placeholder={f.placeholder} value={lines.join('\n')} onChange={(e) => set({ [f.key]: e.target.value.split('\n') })} />
                <small className="option-hint">{f.hint ?? 'Eine Zeile pro Eintrag'} – höchstens {f.max} (jetzt {lines.filter((l) => l.trim()).length}).</small>
              </label>
            );
          }
          case 'choice':
            return <Choices key={n} label={f.label} value={draft[f.key] as string} onChange={(v) => set({ [f.key]: v })} options={(typeof f.options === 'function' ? f.options(draft) : f.options) as { value: string; label: string }[]} hint={typeof f.hint === 'function' ? f.hint(draft) : f.hint} />;
          case 'toggle':
            return <Toggle key={n} checked={!!draft[f.key]} label={f.label} hint={f.hint} onChange={(v) => set({ [f.key]: v })} />;
          case 'colors':
            return (
              <div key={n} className="receipt-option">
                <strong>{f.label}</strong>
                <div className="mt-colors" role="radiogroup" aria-label={f.label}>
                  {f.colors.map((c) => <button key={c} type="button" role="radio" aria-checked={draft[f.key] === c} aria-label={c} title={c} style={{ background: c }} onClick={() => set({ [f.key]: c })} />)}
                </div>
              </div>
            );
          case 'pick': {
            const chosen = (draft[f.key] as string[]) ?? [];
            return (
              <div key={n} className="receipt-option">
                <strong>{f.label}</strong>
                {f.hint && <p className="option-hint">{f.hint}</p>}
                <div className="listen-picks">
                  {f.options.map((o) => {
                    const on = chosen.includes(o.id);
                    return (
                      <button key={o.id} type="button" className="listen-pick" aria-pressed={on} disabled={on && chosen.length <= (f.min ?? 0)} onClick={() => set({ [f.key]: on ? chosen.filter((c) => c !== o.id) : [...chosen, o.id] })}>
                        <img src={o.src} alt="" />
                        <small>{o.label}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }
          case 'presets':
            return (
              <div key={n} className="receipt-option">
                <strong>{f.label}</strong>
                <div className="learning-actions">
                  {f.options.map((o) => <button key={o.label} type="button" className="knopf compact" onClick={() => set(o.apply(latest.current))}>{o.label}</button>)}
                </div>
              </div>
            );
          case 'button':
            return <div key={n} className="learning-actions"><button type="button" className="knopf" disabled={f.disabled?.(draft)} onClick={() => set(f.apply(latest.current))}>{f.label}</button></div>;
          case 'note':
            return <p key={n} className="option-hint">{typeof f.text === 'function' ? f.text(draft) : f.text}</p>;
          case 'list': {
            const rows = (draft[f.key] as Row[]) ?? [];
            const textKey = f.text ?? 'text';
            const row = (i: number, patch: Row) => set({ [f.key]: rows.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
            return (
              <div key={n} className="receipt-option">
                <strong>{f.label}</strong>
                <ol className="tool-rows">
                  {rows.map((r, i) => {
                    const name = `${f.what} ${i + 1}`;
                    return (
                      <li key={i} className="tool-row">
                        {f.picture ? (r.img ? <img src={String(r.img)} alt={`Bild: ${name}`} /> : <span className="tool-row-empty listen-own-empty" aria-hidden="true">?</span>) : <span aria-hidden="true" />}
                        <div className="tool-row-texts">
                          {f.flag && <button type="button" className="knopf compact" aria-pressed={!!r[f.flag.key]} aria-label={`${name}: ${r[f.flag.key] ? f.flag.on : f.flag.off}`} onClick={() => row(i, { [f.flag!.key]: !r[f.flag!.key] })}>{r[f.flag.key] ? f.flag.on : f.flag.off}</button>}
                          <input className="text-input" aria-label={name} placeholder={f.placeholder} value={String(r[textKey] ?? '')} maxLength={f.textMax ?? 120} onChange={(e) => row(i, { [textKey]: e.target.value, q: undefined })} />
                          {f.extra && <input className="text-input tool-row-extra" aria-label={`${name}: ${f.extra.label}`} placeholder={f.extra.placeholder} value={String(r[f.extra.key] ?? '')} maxLength={f.extra.max ?? 20} onChange={(e) => row(i, { [f.extra!.key]: f.extra!.clean ? f.extra!.clean(e.target.value) : e.target.value })} />}
                        </div>
                        <div className="learning-actions">
                          {f.picture && <RowPicture row={r} label={name} upload={upload} busy={busy} onChange={(img) => row(i, { img })} />}
                          <button type="button" className="knopf compact" disabled={i === 0} aria-label={`${name} nach oben`} onClick={() => set({ [f.key]: move(rows, i, -1) })}>↑</button>
                          <button type="button" className="knopf compact" disabled={i === rows.length - 1} aria-label={`${name} nach unten`} onClick={() => set({ [f.key]: move(rows, i, 1) })}>↓</button>
                          <button type="button" className="knopf compact" disabled={rows.length <= (f.min ?? 0)} aria-label={`${name} entfernen`} onClick={() => set({ [f.key]: rows.filter((_, j) => j !== i) })}>Entfernen</button>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <div className="learning-actions">
                  <button type="button" className="knopf" disabled={rows.length >= f.max} onClick={() => set({ [f.key]: [...rows, f.fresh ? f.fresh(rows) : { [textKey]: '' }] })}>＋ {f.what}</button>
                  {f.picture && <button type="button" className="knopf" disabled={!!searching || !rows.some((r) => !r.img && String(r.q || r[textKey] || '').trim())} onClick={() => void searchAll(f.key)}>{searching === f.key ? 'Bilder werden gesucht …' : 'Fehlende Bilder suchen'}</button>}
                </div>
                <small className="option-hint">Höchstens {f.max}.</small>
              </div>
            );
          }
        }
      })}
    </>
  );
}
