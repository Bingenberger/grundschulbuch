/* eslint-disable @next/next/no-img-element -- School media. */
'use client';
// The editor of the Bilder-Stundenplan, laid out like the reference's dialog:
// Plan (choose a subject, tap the lessons), Tage & Zeiten, Fächer, Nach der
// Schule, Aussehen. The grid is drawn by the reference's own timetable code.
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { presetAfter, presetSubjects, timetable, type Break, type Subject, type Timetable } from '@/lib/learning/stundenplan';
import { clockText, CLASS_CSS, fontOf, TIMETABLE_DESIGNS, TIMETABLE_FONTS, timetableHtml, timetableTimes } from '@/lib/reference/class-runtime';
import { findPicture } from '@/lib/learning/picture-search';
import { Chips, Slider, Toggle } from '../sheets/SheetParts';
import { Choices } from './OptionControls';

type Props = { value: unknown; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean };
type Tab = 'plan' | 'times' | 'subjects' | 'after' | 'look';
const TABS: [Tab, string][] = [['plan', 'Plan'], ['times', 'Tage & Zeiten'], ['subjects', 'Fächer'], ['after', 'Nach der Schule'], ['look', 'Aussehen']];
const designs = TIMETABLE_DESIGNS as { id: string; label: string }[];
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 10)}`;

/** The timetable as the reference draws it (1400 × 990), scaled to the width. */
function Grid({ t, onCell, small }: { t: Timetable; onCell?: (day: number, lesson: number | 'after') => void; small?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setW(el.clientWidth);
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(el);
    return () => observer?.disconnect();
  }, []);
  const html = useMemo(() => timetableHtml(t, 1400, 990, { src: (s: string) => s, editing: !!onCell }), [t, onCell]);
  const k = w / 1400;
  return (
    <div ref={box} className={`tt-grid${small ? ' is-small' : ''}`} style={{ height: Math.round(990 * k) }}>
      <div
        className="tt-grid-page"
        style={{ transform: `scale(${k})`, visibility: k ? 'visible' : 'hidden' }}
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={(e) => {
          const cell = (e.target as Element).closest?.('.lh-tt-cell') as HTMLElement | null;
          if (cell && onCell) onCell(Number(cell.dataset.d), cell.dataset.l === 'after' ? 'after' : Number(cell.dataset.l));
        }}
      />
    </div>
  );
}

function Picture({ s, size }: { s: Subject; size: number }) {
  return s.img ? <img className="tt-pic" src={s.img} alt="" style={{ width: size, height: size }} /> : <span className="tt-pic is-empty" style={{ width: size, height: size, background: s.color }} />;
}

/** Name, colour and picture of each subject (E6 of the reference). */
function SubjectList({ list, onChange, defaults, addLabel, upload, busy }: { list: Subject[]; onChange: (l: Subject[]) => void; defaults: () => Subject[]; addLabel: string; upload: Props['upload']; busy: boolean }) {
  const set = (i: number, next: Partial<Subject>) => onChange(list.map((s, j) => (j === i ? { ...s, ...next } : s)));
  const [note, setNote] = useState('');
  const search = async (i: number) => {
    const name = list[i].name.trim();
    if (!name) { setNote('Gib zuerst einen Namen ein, dann wird ein Bild dazu gesucht.'); return; }
    setNote(`Suche ein Bild für „${name}“ …`);
    try {
      const src = await findPicture(name, new AbortController().signal);
      if (src) { set(i, { img: src }); setNote(''); } else setNote(`Kein Bild für „${name}“ gefunden.`);
    } catch (e) { setNote((e as Error).message); }
  };
  return (
    <div className="tt-subjects">
      {note && <p className="option-hint" role="status">{note}</p>}
      {list.map((s, i) => (
        <div key={s.id} className="tt-subject">
          <Picture s={s} size={44} />
          <input className="text-input" aria-label="Name" placeholder="Name" value={s.name} maxLength={40} onChange={(e) => set(i, { name: e.target.value })} />
          <label className="tt-color" style={{ background: s.color }} title="Farbe">
            <input type="color" value={s.color} aria-label={`Farbe von ${s.name || 'dem Fach'}`} onChange={(e) => set(i, { color: e.target.value })} />
          </label>
          <button type="button" className="knopf compact" aria-label={`Bild für ${s.name || 'das Fach'} suchen`} onClick={() => void search(i)}>Bild suchen</button>
          <label className="knopf compact">
            Foto
            <input className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label={`Eigenes Bild für ${s.name || 'das Fach'}`} disabled={busy} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file, (src) => set(i, { img: src }));
              e.target.value = '';
            }} />
          </label>
          {s.img && <button type="button" className="knopf compact" aria-label={`Bild von ${s.name} entfernen`} onClick={() => set(i, { img: undefined })}>Ohne Bild</button>}
          <button type="button" className="knopf compact" aria-label={`${s.name || 'Fach'} löschen`} onClick={() => onChange(list.filter((_, j) => j !== i))}>Löschen</button>
        </div>
      ))}
      <div className="learning-actions">
        <button type="button" className="knopf" disabled={list.length >= 60} onClick={() => onChange([...list, { id: uid('s'), name: '', color: '#4dabf7' }])}>+ {addLabel}</button>
        <button type="button" className="knopf" onClick={() => {
          // Keep subjects already used in the plan (same name), add the standard ones.
          const names = new Set(list.map((s) => s.name.toLowerCase()));
          onChange([...list, ...defaults().filter((s) => !names.has(s.name.toLowerCase())).map((s) => ({ ...s, id: uid('s') }))]);
        }}>Standardliste</button>
      </div>
    </div>
  );
}

export default function TimetableOptions({ value, onChange, upload, busy }: Props) {
  const t = timetable(value);
  const latest = useRef(t);
  useLayoutEffect(() => { latest.current = t; });
  const set = (next: Partial<Timetable>) => onChange(timetable({ ...latest.current, ...next }) as unknown as JsonValue);
  const [tab, setTab] = useState<Tab>('plan');
  const [brush, setBrush] = useState<string | null>(t.subjects[0]?.id ?? null);
  const [split, setSplit] = useState(false);
  const [find, setFind] = useState('');
  const [note, setNote] = useState('');
  const all = [...t.subjects, ...t.after.options];
  const known = new Set(all.map((s) => s.id));
  const activeBrush = brush === 'erase' || (brush && known.has(brush)) ? brush : null;

  const cell = (day: number, lesson: number | 'after') => {
    if (!activeBrush) { setNote('Wähle zuerst ein Fach (oder „Leeren“).'); return; }
    setNote('');
    const now = lesson === 'after' ? t.after.plan[day] ?? [] : t.plan[day]?.[lesson] ?? [];
    const next = activeBrush === 'erase' ? [] : split && now.length === 1 && now[0] !== activeBrush ? [now[0], activeBrush] : [activeBrush];
    if (lesson === 'after') set({ after: { ...t.after, plan: t.after.plan.map((p, d) => (d === day ? next : p)) } });
    else set({ plan: t.plan.map((days, d) => (d === day ? days.map((p, l) => (l === lesson ? next : p)) : days)) });
  };
  const q = find.trim().toLowerCase();
  const filter = (l: Subject[]) => (q ? l.filter((s) => s.name.toLowerCase().includes(q)) : l);
  const setBreak = (i: number, next: Partial<Break>) => set({ breaks: t.breaks.map((b, j) => (j === i ? { ...b, ...next } : b)) });
  const day = timetableTimes(t) as { lessons: { from: number; to: number }[]; breaks: { after: number; from: number; to: number; b: Break }[] };
  const start = `${String(Math.floor(t.start / 60)).padStart(2, '0')}:${String(t.start % 60).padStart(2, '0')}`;
  const brushButton = (s: Subject) => (
    <button key={s.id} type="button" className={`tt-brush${activeBrush === s.id ? ' is-active' : ''}`} style={{ borderColor: s.color }} aria-pressed={activeBrush === s.id} onClick={() => setBrush(s.id)}>
      <Picture s={s} size={30} />
      <span>{s.name || '…'}</span>
    </button>
  );

  return (
    <div className="receipt-options tt-editor">
      <style>{CLASS_CSS}</style>
      <div className="tt-tabs" role="tablist" aria-label="Stundenplan">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={`tt-tab${tab === id ? ' is-active' : ''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === 'plan' && (
        <div className="tt-plan">
          <div className="tt-side">
            <input type="search" className="text-input" placeholder="Fach suchen …" aria-label="Fach suchen" value={find} onChange={(e) => setFind(e.target.value)} />
            <button type="button" className={`tt-brush${activeBrush === 'erase' ? ' is-active' : ''}`} aria-pressed={activeBrush === 'erase'} onClick={() => setBrush('erase')}><span className="tt-pic is-empty" style={{ width: 30, height: 30 }} /> <span>Leeren</span></button>
            <Toggle checked={split} label="Geteilte Stunde" hint="Ein zweites Fach kommt dazu (Kochen | Werken)." onChange={setSplit} />
            <div className="tt-brushes" role="group" aria-label="Fächer zum Eintragen">
              {filter(t.subjects).map(brushButton)}
              {t.after.on && filter(t.after.options).length > 0 && <strong className="tt-brushlabel">{t.after.label}</strong>}
              {t.after.on && filter(t.after.options).map(brushButton)}
            </div>
          </div>
          <div className="tt-main">
            <p className="option-hint">Wähle ein Fach aus der Liste und tippe auf die Stunden, in denen es ist.</p>
            {note && <p className="option-hint" role="status">{note}</p>}
            <Grid t={t} onCell={cell} />
          </div>
        </div>
      )}

      {tab === 'times' && (
        <>
          <Choices label="Tage" value={t.days} onChange={(days) => set({ days })} options={[{ value: 5, label: 'Montag bis Freitag' }, { value: 6, label: 'Montag bis Samstag' }, { value: 7, label: 'Ganze Woche' }]} />
          <Slider label="Stunden" value={t.lessons} min={1} max={10} format={(v) => `${v} Stunden`} onChange={(lessons) => set({ lessons })} />
          <label className="receipt-option">
            <strong>Beginn</strong>
            <input className="text-input tt-time" type="time" value={start} aria-label="Beginn der ersten Stunde" onChange={(e) => {
              const m = /^(\d{1,2}):(\d{2})/.exec(e.target.value);
              if (m) set({ start: Math.min(840, Math.max(300, Number(m[1]) * 60 + Number(m[2]))) });
            }} />
          </label>
          <Slider label="Eine Stunde" value={t.len} min={20} max={90} step={5} format={(v) => `${v} Min.`} onChange={(len) => set({ len })} />
          <Toggle checked={t.times} label="Zeitleiste zeigen" hint="Links stehen die Uhrzeiten jeder Stunde und Pause." onChange={(times) => set({ times })} />
          <div className="receipt-option">
            <strong>Pausen</strong>
            {t.breaks.map((b, i) => (
              <fieldset key={i} className="tt-break">
                <legend>{b.label || 'Pause'}</legend>
                {t.lessons > 1 && (
                  <div className="receipt-option">
                    <small>nach der … Stunde</small>
                    <Chips label={`Pause ${i + 1} nach der Stunde`} value={Math.min(b.after, t.lessons - 1)} options={Array.from({ length: t.lessons - 1 }, (_, n) => ({ value: n + 1, label: `${n + 1}.` }))} onChange={(after) => setBreak(i, { after })} />
                  </div>
                )}
                <Slider label="Länge" value={b.min} min={5} max={90} step={5} format={(v) => `${v} Min.`} onChange={(min) => setBreak(i, { min })} />
                <input className="text-input" aria-label={`Name der Pause ${i + 1}`} placeholder="Pause" value={b.label} maxLength={30} onChange={(e) => setBreak(i, { label: e.target.value })} />
                <div className="tt-pause-pics" role="radiogroup" aria-label={`Bild der Pause ${i + 1}`}>
                  <button type="button" role="radio" aria-checked={!b.sub} className="knopf compact" onClick={() => setBreak(i, { sub: undefined })}>ohne Bild</button>
                  {t.subjects.filter((s) => s.img).map((s) => (
                    <button key={s.id} type="button" role="radio" aria-checked={b.sub === s.id} aria-label={`Bild: ${s.name}`} title={s.name} className="tt-pause-pic" onClick={() => setBreak(i, { sub: s.id })}><Picture s={s} size={28} /></button>
                  ))}
                </div>
                <button type="button" className="knopf compact" onClick={() => set({ breaks: t.breaks.filter((_, j) => j !== i) })}>Pause löschen</button>
              </fieldset>
            ))}
            <button type="button" className="knopf" disabled={t.breaks.length >= 6} onClick={() => set({ breaks: [...t.breaks, { after: Math.min(t.lessons - 1, Math.max(1, (t.breaks.at(-1)?.after ?? 2) + 2)), min: 15, label: 'Pause' }] })}>+ Pause dazu</button>
            <p className="option-hint">
              So sieht der Tag aus:{' '}
              {day.lessons.map((l, i) => (
                <span key={i}>
                  {i + 1}. {clockText(l.from)}–{clockText(l.to)}
                  {day.breaks.filter((b) => b.after === i + 1).map((b, j) => <em key={j}> · {b.b.label} {clockText(b.from)}–{clockText(b.to)}</em>)}
                  {i + 1 < day.lessons.length ? ' · ' : ''}
                </span>
              ))}
            </p>
          </div>
        </>
      )}

      {tab === 'subjects' && (
        <>
          <p className="option-hint">Name, Farbe und Bild jedes Fachs. „Bild suchen“ nimmt ein Piktogramm von ARASAAC zum Namen, „Foto“ ein eigenes Bild.</p>
          <SubjectList list={t.subjects} onChange={(subjects) => set({ subjects })} defaults={presetSubjects} addLabel="Fach dazu" upload={upload} busy={busy} />
        </>
      )}

      {tab === 'after' && (
        <>
          <Toggle checked={t.after.on} label="Eine Zeile „Nach der Schule“" hint="Unter den Stunden: wie es nach der Schule weitergeht – Tagesstätte, Bus, Abholung …" onChange={(on) => set({ after: { ...t.after, on } })} />
          {t.after.on && (
            <>
              <label className="receipt-option">
                <strong>Name der Zeile</strong>
                <input className="text-input" aria-label="Name der Zeile" placeholder="Nach der Schule" value={t.after.label} maxLength={40} onChange={(e) => set({ after: { ...t.after, label: e.target.value } })} />
              </label>
              <SubjectList list={t.after.options} onChange={(options) => set({ after: { ...t.after, options } })} defaults={presetAfter} addLabel="Möglichkeit dazu" upload={upload} busy={busy} />
              <p className="option-hint">Eingetragen wird im Reiter „Plan“ wie die Fächer.</p>
            </>
          )}
        </>
      )}

      {tab === 'look' && (
        <>
          <label className="receipt-option">
            <strong>Überschrift</strong>
            <input className="text-input" aria-label="Überschrift" placeholder="Mein Stundenplan" value={t.title} maxLength={80} onChange={(e) => set({ title: e.target.value })} />
            <small className="option-hint">Leer lassen für keine Überschrift</small>
          </label>
          <div className="receipt-option">
            <strong>Design</strong>
            <div className="tt-designs" role="radiogroup" aria-label="Design">
              {designs.map((d) => (
                <button key={d.id} type="button" role="radio" aria-checked={t.design === d.id} className={`tt-design${t.design === d.id ? ' is-active' : ''}`} onClick={() => set({ design: d.id })}>
                  <Grid t={{ ...t, design: d.id }} small />
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>
          <Choices label="In den Stunden steht" value={t.show} onChange={(show) => set({ show })} options={[{ value: 'both', label: 'Bild und Text' }, { value: 'pic', label: 'Nur Bild' }, { value: 'text', label: 'Nur Text' }]} />
          <Choices label="Schrift" value={t.font} onChange={(font) => set({ font })} options={(TIMETABLE_FONTS as string[]).map((f) => ({ value: f, label: fontOf(f).label as string }))} />
          <Toggle checked={t.today} label="Den heutigen Tag hervorheben" hint="Im Heft und auf der Tafel, z. B. Mo am Montag." onChange={(today) => set({ today })} />
        </>
      )}

      {tab !== 'plan' && (
        <div className="tt-preview-all">
          <strong>Vorschau</strong>
          <Grid t={t} />
        </div>
      )}
    </div>
  );
}
