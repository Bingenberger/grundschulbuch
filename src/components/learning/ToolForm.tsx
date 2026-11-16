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
type Option = { value: string | number | boolean; label: string };
type Extra = { key: string; label: string; placeholder: string; max?: number; wide?: boolean; numeric?: boolean; clean?: (v: string) => string };
/** A list of entries: word (and a second text), picture, colour, a switch. */
export type ListSpec = {
  what: string; max: number; min?: number;
  /** Main text of a row and its placeholder. */
  text?: string; placeholder?: string; textMax?: number;
  /** A second text (time, number, year, a rule …). */
  extra?: Extra;
  /** Further short texts (e.g. date and amount of a booking). */
  extras?: Extra[];
  /** A switch per row (e.g. who speaks). */
  flag?: { key: string; on: string; off: string };
  /** A colour per row. */
  color?: { key: string; colors: string[] };
  /** A choice per row (e.g. the box a card belongs to). */
  choice?: { key: string; label: string; options: (d: Draft) => Option[] };
  picture?: boolean;
  /** A new row (default: empty text). */
  fresh?: (rows: Row[]) => Row;
};
export type Field = When & (
  | { t: 'text'; key: string; label: string; placeholder?: string; max?: number }
  | { t: 'lines'; key: string; label: string; hint?: string; max: number; rows?: number; placeholder?: string }
  | { t: 'choice'; key: string; label: string; options: Option[] | ((d: Draft) => Option[]); hint?: string | ((d: Draft) => string); apply?: (d: Draft, value: unknown) => Draft }
  | { t: 'toggle'; key: string; label: string; hint?: string }
  | { t: 'colors'; key: string; label: string; colors: string[] }
  | { t: 'picture'; key: string; label: string; query?: (d: Draft) => string }
  | { t: 'pick'; key: string; label: string; options: { id: string; label: string; src: string }[]; min?: number; hint?: string }
  | { t: 'presets'; label: string; options: { label: string; apply: (d: Draft) => Draft }[] }
  | { t: 'button'; label: string; apply: (d: Draft) => Draft; disabled?: (d: Draft) => boolean }
  | { t: 'note'; text: string | ((d: Draft) => string) }
  | ({ t: 'list'; key: string; label: string } & ListSpec)
  /** One list per day (Wochenplan): tabs for the days, then the list of that day. */
  | ({ t: 'days'; key: string; label: string; days: string[]; count: (d: Draft) => number } & ListSpec)
);

type Upload = (file: File, done: (src: string) => void) => Promise<void>;

function move<T>(list: T[], index: number, by: number) {
  const next = [...list], [item] = next.splice(index, 1);
  next.splice(index + by, 0, item);
  return next;
}
const wordOf = (row: Row, key: string) => String(row.q || row[key] || row.text || row.label || row.name || '').trim();

/** Picture of an entry: search by its word, own picture, or none. */
function Picture({ src, word, label, onChange, upload, busy }: { src?: string; word: string; label: string; onChange: (img: string | undefined) => void; upload: Upload; busy: boolean }) {
  const [note, setNote] = useState('');
  const search = async () => {
    if (!word) { setNote('Erst ein Wort eingeben, dann wird ein Bild dazu gesucht.'); return; }
    setNote(`Suche ein Bild für „${word}“ …`);
    try { const found = await findPicture(word, new AbortController().signal); if (found) { onChange(found); setNote(''); } else setNote(`Kein Bild für „${word}“ gefunden.`); }
    catch (e) { setNote((e as Error).message); }
  };
  return (
    <>
      <button type="button" className="knopf compact" onClick={() => void search()}>Bild suchen</button>
      <label className="knopf compact">
        Eigenes Bild
        <input className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label={`Eigenes Bild: ${label}`} disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (img) => onChange(img)); e.target.value = ''; }} />
      </label>
      {!!src && <button type="button" className="knopf compact" onClick={() => onChange(undefined)}>Ohne Bild</button>}
      {note && <span className="option-hint" role="status">{note}</span>}
    </>
  );
}

function ListEditor({ spec, label, rows, draft, onRows, upload, busy }: { spec: ListSpec; label: string; rows: Row[]; draft: Draft; onRows: (rows: Row[]) => void; upload: Upload; busy: boolean }) {
  const [searching, setSearching] = useState(false);
  const textKey = spec.text ?? 'text';
  const row = (i: number, patch: Row) => onRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  /** Pictures for all entries that have a word but no picture (as “Fehlende Bilder suchen”). */
  const searchAll = async () => {
    const next = [...rows];
    setSearching(true);
    for (let i = 0; i < next.length; i++) {
      const word = wordOf(next[i], textKey);
      if (next[i].img || !word) continue;
      try { const src = await findPicture(word, new AbortController().signal); if (src) next[i] = { ...next[i], img: src }; } catch { /* keep going */ }
    }
    setSearching(false);
    onRows(next);
  };
  return (
    <div className="receipt-option">
      <strong>{label}</strong>
      <ol className="tool-rows">
        {rows.map((r, i) => {
          const name = `${spec.what} ${i + 1}`;
          return (
            <li key={i} className={`tool-row${spec.extra?.wide ? ' tool-row-wide' : ''}`}>
              {spec.picture ? (r.img ? <img src={String(r.img)} alt={`Bild: ${name}`} /> : <span className="tool-row-empty listen-own-empty" aria-hidden="true">?</span>)
                : spec.color ? <span className="tool-row-empty" aria-hidden="true" style={{ background: String(r[spec.color.key] ?? '#dee2e6') }} /> : <span aria-hidden="true" />}
              <div className="tool-row-texts">
                {spec.flag && <button type="button" className="knopf compact" aria-pressed={!!r[spec.flag.key]} aria-label={`${name}: ${r[spec.flag.key] ? spec.flag.on : spec.flag.off}`} onClick={() => row(i, { [spec.flag!.key]: !r[spec.flag!.key] })}>{r[spec.flag.key] ? spec.flag.on : spec.flag.off}</button>}
                <input className="text-input" aria-label={name} placeholder={spec.placeholder} value={String(r[textKey] ?? '')} maxLength={spec.textMax ?? 120} onChange={(e) => row(i, { [textKey]: e.target.value, q: undefined })} />
                {[...(spec.extra ? [spec.extra] : []), ...(spec.extras ?? [])].map((x) => (
                  <input key={x.key} className={`text-input${x.wide ? '' : ' tool-row-extra'}`} aria-label={`${name}: ${x.label}`} placeholder={x.placeholder} inputMode={x.numeric ? 'decimal' : undefined} value={String(r[x.key] ?? '')} maxLength={x.max ?? 20} onChange={(e) => row(i, { [x.key]: x.clean ? x.clean(e.target.value) : e.target.value })} />
                ))}
              </div>
              <div className="learning-actions">
                {spec.choice && spec.choice.options(draft).map((o) => (
                  <button key={String(o.value)} type="button" className="knopf compact" aria-pressed={r[spec.choice!.key] === o.value} aria-label={`${name}: ${spec.choice!.label} ${o.label}`} onClick={() => row(i, { [spec.choice!.key]: o.value })}>{o.label}</button>
                ))}
                {spec.picture && <Picture src={r.img as string | undefined} word={wordOf(r, textKey)} label={name} upload={upload} busy={busy} onChange={(img) => row(i, { img })} />}
                <button type="button" className="knopf compact" disabled={i === 0} aria-label={`${name} nach oben`} onClick={() => onRows(move(rows, i, -1))}>↑</button>
                <button type="button" className="knopf compact" disabled={i === rows.length - 1} aria-label={`${name} nach unten`} onClick={() => onRows(move(rows, i, 1))}>↓</button>
                <button type="button" className="knopf compact" disabled={rows.length <= (spec.min ?? 0)} aria-label={`${name} entfernen`} onClick={() => onRows(rows.filter((_, j) => j !== i))}>Entfernen</button>
              </div>
              {spec.color && (
                <div className="mt-colors" role="radiogroup" aria-label={`Farbe: ${name}`}>
                  {spec.color.colors.map((c) => <button key={c} type="button" role="radio" aria-checked={r[spec.color!.key] === c} aria-label={c} title={c} style={{ background: c }} onClick={() => row(i, { [spec.color!.key]: c })} />)}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div className="learning-actions">
        <button type="button" className="knopf" disabled={rows.length >= spec.max} onClick={() => onRows([...rows, spec.fresh ? spec.fresh(rows) : { [textKey]: '' }])}>＋ {spec.what}</button>
        {spec.picture && <button type="button" className="knopf" disabled={searching || !rows.some((r) => !r.img && wordOf(r, textKey))} onClick={() => void searchAll()}>{searching ? 'Bilder werden gesucht …' : 'Fehlende Bilder suchen'}</button>}
      </div>
      <small className="option-hint">Höchstens {spec.max}.</small>
    </div>
  );
}

function Days({ f, draft, set, upload, busy }: { f: Extract<Field, { t: 'days' }>; draft: Draft; set: (d: Draft) => void; upload: Upload; busy: boolean }) {
  const [day, setDay] = useState(0);
  const count = f.count(draft), shown = Math.min(day, count - 1);
  const lists = (draft[f.key] as Row[][]) ?? [];
  return (
    <div className="receipt-option">
      <strong>{f.label}</strong>
      <div className="learning-actions" role="tablist" aria-label="Tag">
        {f.days.slice(0, count).map((name, i) => (
          <button key={name} type="button" role="tab" className="knopf compact" aria-selected={i === shown} onClick={() => setDay(i)}>{name}</button>
        ))}
      </div>
      <ListEditor spec={f} label={f.days[shown]} rows={lists[shown] ?? []} draft={draft} upload={upload} busy={busy}
        onRows={(rows) => set({ [f.key]: f.days.map((_, i) => (i === shown ? rows : lists[i] ?? [])) })} />
    </div>
  );
}

export default function ToolForm({ fields, value, onChange, upload, busy }: { fields: Field[]; value: Draft; onChange: (d: Draft) => void; upload: Upload; busy: boolean }) {
  const [draft, setDraft] = useState<Draft>(() => structuredClone(value));
  const latest = useRef(draft);
  useLayoutEffect(() => { latest.current = draft; });
  const set = (next: Draft) => { const d = { ...latest.current, ...next }; latest.current = d; setDraft(d); onChange(d); };

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
            return <Choices key={n} label={f.label} value={draft[f.key] as string} onChange={(v) => set(f.apply ? f.apply(latest.current, v) : { [f.key]: v })} options={(typeof f.options === 'function' ? f.options(draft) : f.options) as { value: string; label: string }[]} hint={typeof f.hint === 'function' ? f.hint(draft) : f.hint} />;
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
          case 'picture': {
            const src = draft[f.key] as string | undefined;
            return (
              <div key={n} className="receipt-option">
                <strong>{f.label}</strong>
                <div className="tool-row">
                  {src ? <img src={src} alt={f.label} /> : <span className="tool-row-empty listen-own-empty" aria-hidden="true">?</span>}
                  <div className="learning-actions"><Picture src={src} word={f.query?.(draft) ?? ''} label={f.label} upload={upload} busy={busy} onChange={(img) => set({ [f.key]: img })} /></div>
                </div>
              </div>
            );
          }
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
          case 'list':
            return <ListEditor key={n} spec={f} label={f.label} rows={(draft[f.key] as Row[]) ?? []} draft={draft} upload={upload} busy={busy} onRows={(rows) => set({ [f.key]: rows })} />;
          case 'days':
            return <Days key={n} f={f} draft={draft} set={set} upload={upload} busy={busy} />;
        }
      })}
    </>
  );
}
