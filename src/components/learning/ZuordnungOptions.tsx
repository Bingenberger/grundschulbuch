/* eslint-disable @next/next/no-img-element -- School media. */
'use client';
// Settings of a Zuordnung, laid out like “Neue Übung” in Schiebesachen:
// format, the list (with example and “So geht's”), options of the format,
// pictures, design – and a preview of the exercise as the children see it.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { DND_FAMILIES, DND_FORMATS, dndConfig, type DndConfig, type DndFormat } from '@/lib/learning/zuordnung';
import { buildExercise, countOf, DESIGNS, designOf, FORMATS, parseText, pictureFallbacks, pictureTerms, problemOf } from '@/lib/reference/schiebesachen-builder';
import { findPicture, pictureSize } from '@/lib/learning/picture-search';
import { Chips, Toggle } from '../sheets/SheetParts';
import { aliasFonts } from './PlayerFrame';
import PlayerFrame from './PlayerFrame';
import { useZuordnungPage } from './ZuordnungFrame';

type Format = { id: DndFormat; title: string; desc: string; example: string; help: [string, string][]; max: number };
const formats = (FORMATS as unknown as Format[]).filter((f) => DND_FORMATS.includes(f.id));
const formatOf = (id: DndFormat) => formats.find((f) => f.id === id) ?? formats[0];
const PREVIEW = { w: 960, h: 620 };
type Props = { value: unknown; title: string; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean };

/** The builder measures card texts in the page: it needs the fonts under the player's names. */
function pageFonts() {
  if (document.getElementById('dnd-fonts')) return;
  const style = document.createElement('style');
  style.id = 'dnd-fonts';
  style.textContent = aliasFonts(DND_FAMILIES);
  document.head.appendChild(style);
}

function Summary({ format, parsed }: { format: DndFormat; parsed: { groups: { entries: unknown[] }[]; distractors: unknown[] } }) {
  const n = countOf(format, parsed) as number, d = parsed.distractors.length;
  const text =
    format === 'sortieren' || format === 'artikel' ? `${parsed.groups.filter((g) => g.entries.length).length} Spalten · ${n} Karten`
    : format === 'paare' ? `${n} Paare`
    : format === 'reihenfolge' ? `${n} Schritte`
    : format === 'buchstabieren' ? `${n === 1 ? '1 Wort' : `${n} Wörter – eine Seite pro Wort`}${d ? ` · ${d} Ablenker` : ''}`
    : format === 'silben' ? `${n === 1 ? '1 Wort' : `${n} Wörter`}${n > 4 ? ` auf ${Math.ceil(n / 4)} Seiten` : ''}${d ? ` · ${d} Ablenker` : ''}`
    : `${n} Karten`;
  return <p className="dnd-status" role="status">✓ {text}</p>;
}

export default function ZuordnungOptions({ value, title, onChange, upload, busy }: Props) {
  const c = dndConfig(value);
  const latest = useRef(c);
  useLayoutEffect(() => { latest.current = c; });
  const set = (next: Partial<DndConfig>) => onChange({ ...latest.current, ...next } as unknown as JsonValue);
  const f = formatOf(c.format);
  const [help, setHelp] = useState(false);

  // Start with the example of the format, like Schiebesachen.
  useEffect(() => {
    if (!c.text.trim()) set({ text: f.example });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c.format]);

  const parsed = useMemo(() => {
    const p = parseText(c.format, c.text);
    if (!p.title && title.trim()) p.title = title.trim();
    return p;
  }, [c.format, c.text, title]);
  const problem = c.text.trim() ? (problemOf(c.format, parsed) as string | null) : 'Schreibe die Begriffe ins Feld.';
  const showPictures = c.format !== 'silben' || c.syllableHelp !== 'wort';
  const terms = (showPictures ? pictureTerms(c.format, parsed, c.syllableHelp) : []) as string[];
  const termsKey = terms.join('\n');
  const pictureOf = (term: string) => c.pictures.find((p) => p.term === term)?.image;
  const setPicture = (term: string, image?: string) =>
    set({ pictures: [...latest.current.pictures.filter((p) => p.term !== term), ...(image ? [{ term, image }] : [])] });

  // Pictures that are missing are looked for by themselves (ARASAAC).
  const searched = useRef(new Set<string>());
  const [searching, setSearching] = useState(false);
  const [note, setNote] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!c.autoPictures) return;
    const todo = terms.filter((t) => !pictureOf(t) && !searched.current.has(t)).slice(0, 24);
    if (!todo.length) return;
    const fallbacks = pictureFallbacks(parsed) as Map<string, string>;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        for (const term of todo) {
          searched.current.add(term);
          let src = await findPicture(term, controller.signal);
          if (!src && fallbacks.get(term)) src = await findPicture(fallbacks.get(term)!, controller.signal);
          if (src && !latest.current.pictures.some((p) => p.term === term)) setPicture(term, src);
        }
      } catch (e) {
        if (!controller.signal.aborted) setNote((e as Error).message);
      } finally {
        setSearching(false);
      }
    }, 1000);
    return () => { window.clearTimeout(timer); controller.abort(); setSearching(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termsKey, c.autoPictures, retry]);

  // Build the exercise (a moment after each change), like the preview of Schiebesachen.
  const buildKey = JSON.stringify([c.format, parsed, c.design, c.dragPictures, c.syllableHelp, c.syllableColors, c.pictures, problem]);
  useEffect(() => {
    if (problem) { if (latest.current.exercise) set({ exercise: undefined }); return; }
    let live = true;
    const timer = window.setTimeout(async () => {
      pageFonts();
      const design = designOf(c.design);
      try { await document.fonts.load(`700 28px "DnD ${design.font === 'andika' ? 'Andika' : design.font === 'atkinson' ? 'Atkinson Hyperlegible' : 'Nunito'}"`); } catch {}
      const pictures = new Map();
      for (const p of latest.current.pictures) {
        const size = await pictureSize(p.image);
        pictures.set(p.term, { dataUrl: p.image, mime: 'image/png', ...size, name: p.term, license: { source: 'arasaac' } });
      }
      if (!live) return;
      try {
        const { exercise } = buildExercise(c.format, parsed, { design, dragPictures: c.dragPictures, pictures, syllableHelp: c.syllableHelp, syllableColors: c.syllableColors });
        set({ exercise });
      } catch (e) {
        setNote(`Die Übung lässt sich so nicht bauen: ${(e as Error).message}`);
      }
    }, 350);
    return () => { live = false; window.clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildKey]);
  const preview = useZuordnungPage(c.exercise, null);

  return (
    <div className="receipt-options ts-options">
      <section className="ts-part">
        <h4>Übungsformat</h4>
        <div className="ts-modes" role="radiogroup" aria-label="Übungsformat">
          {formats.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={c.format === x.id} className={`ts-mode${c.format === x.id ? ' is-active' : ''}`} onClick={() => set({ format: x.id, text: c.text.trim() === f.example.trim() ? x.example : c.text, exercise: undefined })}>
              <strong>{x.title}</strong>
              <span>{x.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="ts-part">
        <h4>Inhalt</h4>
        <p className="option-hint">{f.desc}</p>
        <div className="learning-actions">
          <button type="button" className="knopf compact" onClick={() => set({ text: f.example })}>Beispiel</button>
          <button type="button" className="knopf compact" aria-pressed={help} onClick={() => setHelp(!help)}>So geht&apos;s</button>
        </div>
        {help && (
          <table className="dnd-help">
            <tbody>
              {f.help.map(([code, text]) => (
                <tr key={code}><td><code>{code}</code></td><td>{text}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        <textarea className="dnd-input" aria-label="Inhalt der Übung" rows={9} value={c.text} onChange={(e) => set({ text: e.target.value })} />
        {problem ? <p className="dnd-status is-problem" role="status">⚠ {problem}</p> : <Summary format={c.format} parsed={parsed} />}
        {parsed.warnings.length > 0 && <ul className="ts-checks">{parsed.warnings.slice(0, 4).map((w: string) => <li key={w}>{w}</li>)}</ul>}
        {c.format === 'bildwort' && <Chips label="Was wird gezogen?" value={c.dragPictures ? 'pics' : 'words'} onChange={(v) => set({ dragPictures: v === 'pics' })} options={[{ value: 'words', label: 'Wörter zu den Bildern' }, { value: 'pics', label: 'Bilder zu den Wörtern' }]} />}
        {c.format === 'silben' && (
          <>
            <Chips label="Was steht neben den Kästchen?" value={c.syllableHelp} onChange={(v) => set({ syllableHelp: v })} options={[{ value: 'bild', label: 'Bild' }, { value: 'wort', label: 'Wort' }, { value: 'hoeren', label: 'Hören' }]} />
            <p className="option-hint">{c.syllableHelp === 'bild' ? 'Neben den Kästchen steht das Bild zum Wort.' : c.syllableHelp === 'wort' ? 'Neben den Kästchen steht das Wort – die Silben werden rechts daneben nachgelegt.' : 'Neben den Kästchen ein Ohr: ein Tipp darauf liest das Wort vor, geschrieben steht es nicht.'}</p>
            <Toggle checked={c.syllableColors} label="Silben blau und rot" hint="Wie bei der Silbenmethode: die 1. Silbe blau, die 2. rot, die 3. wieder blau …" onChange={(v) => set({ syllableColors: v })} />
          </>
        )}
      </section>

      {showPictures && (
        <section className="ts-part">
          <h4>Bilder</h4>
          <Toggle checked={c.autoPictures} label="Bilder automatisch suchen" hint={terms.length ? `${terms.length} ${terms.length === 1 ? 'Bild' : 'Bilder'} von ARASAAC (Piktogramme, CC BY-NC-SA) – du kannst sie danach ändern.` : 'Schreibe [Bild: Suchwort] hinter eine Karte, um ein Piktogramm zu bekommen.'} onChange={(v) => set({ autoPictures: v })} />
          {searching && <p className="option-hint" role="status">Bilder werden gesucht …</p>}
          {note && <p className="option-hint" role="status">{note}</p>}
          {terms.length > 0 && (
            <div className="ts-pictures">
              {terms.map((term) => {
                const image = pictureOf(term);
                return (
                  <div key={term} className="ts-picture">
                    {image ? <img src={image} alt={term} /> : <span className="ts-picture-empty" aria-hidden="true">?</span>}
                    <strong>{term.replace(/^#\d+$/, 'Bild')}</strong>
                    <span className="ts-picture-actions">
                      <label className="knopf compact">
                        {image ? 'Ändern' : 'Bild wählen'}
                        <input className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label={`Bild für ${term} wählen`} disabled={busy} onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void upload(file, (src) => setPicture(term, src));
                          e.target.value = '';
                        }} />
                      </label>
                      {image ? (
                        <button type="button" className="knopf compact" aria-label={`Bild für ${term} entfernen`} onClick={() => { searched.current.add(term); setPicture(term); }}>Ohne Bild</button>
                      ) : (
                        <button type="button" className="knopf compact" aria-label={`Bild für ${term} suchen`} onClick={() => { searched.current.delete(term); setNote(''); set({ autoPictures: true }); setRetry((n) => n + 1); }}>Suchen</button>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <section className="ts-part">
        <h4>Design</h4>
        <div className="dnd-designs" role="radiogroup" aria-label="Design">
          {(DESIGNS as { id: string; name: string; bg: string; card: string; border: boolean; text: string; title: string }[]).map((d) => (
            <button key={d.id} type="button" role="radio" aria-checked={c.design === d.id} className={`dnd-design${c.design === d.id ? ' is-active' : ''}`} style={{ background: d.bg }} onClick={() => set({ design: d.id })}>
              <span className="dnd-design-card" style={{ background: d.card, color: d.text, borderColor: d.border ? '#cbd5e1' : 'transparent' }}>Abc</span>
              <span style={{ color: d.title }}>{d.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="ts-part">
        <h4>Vorschau</h4>
        <div className="dnd-preview">{preview ? <PlayerFrame page={preview} title="Vorschau der Übung" interactive={false} stage={PREVIEW} /> : <p className="option-hint">{problem ? 'Die Vorschau erscheint, sobald die Übung vollständig ist.' : 'Die Übung wird gebaut …'}</p>}</div>
        <p className="option-hint">Alles lässt sich danach wieder ändern. Die Übung kommt auf eine eigene Seite.</p>
      </section>
    </div>
  );
}
