/* eslint-disable @next/next/no-img-element -- Generated pictures and authenticated school media. */
'use client';
// Settings of the tools of Lernsachen-Heft 1.47.3 with the choices of the
// reference's dialogs – and the tool itself as a playable preview:
// Strichliste und Diagramm, Glücksrad und Würfel, Suchbild, Muster fortsetzen.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { findPicture } from '@/lib/learning/picture-search';
import { fingerprint, toolAssets, toolConfig, toolSpec, toolUnits, type ToolId } from '@/lib/learning/werkzeuge';
import ToolForm from './ToolForm';
import { TOOL_FORMS } from './tool-forms';
import { PATTERN_RULES, SEEK_COLORS, SEEK_SHAPES, seekPicture, SPIN_COLORS, SPIN_PRESETS, TALLY_COLORS, TOOLS_CSS } from '@/lib/reference/tools-runtime';
import { Toggle } from '../sheets/SheetParts';
import { Choices } from './OptionControls';
import { TOOL_HOST_CSS } from './ToolWidget';

type Props = { tool: ToolId; value: unknown; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean };
type Config = Record<string, unknown>;

/** The tool, playable, as the preview of the reference's dialogs. */
function Preview({ tool, config, width, height }: { tool: ToolId; config: Config; width: number; height: number }) {
  const box = useRef<HTMLDivElement>(null);
  const spec = toolSpec(tool);
  // A new id for new settings: the preview starts afresh like the reference's.
  const id = `preview-${tool}-${fingerprint(config)}`;
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.replaceChildren();
    spec.draw(el, { id, w: width, h: height, locked: true, [spec.field]: config }, true, { assets: toolAssets(config) });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="tool-preview" style={{ aspectRatio: `${width} / ${height}` }}>
      <style>{TOOLS_CSS + TOOL_HOST_CSS}</style>
      <div ref={box} className={`reference-widget lh-wg-${tool} is-live`} role="group" aria-label="Vorschau zum Ausprobieren" />
    </div>
  );
}

/** A row of colour buttons (the palette of the tool). */
function Colors({ label, value, colors, onChange }: { label: string; value: string; colors: string[]; onChange: (c: string) => void }) {
  return (
    <div className="mt-colors" role="radiogroup" aria-label={label}>
      {colors.map((c) => <button key={c} type="button" role="radio" aria-checked={value === c} aria-label={c} title={c} style={{ background: c }} onClick={() => onChange(c)} />)}
    </div>
  );
}

function move<T>(list: T[], index: number, by: number) {
  const next = [...list], [item] = next.splice(index, 1);
  next.splice(index + by, 0, item);
  return next;
}

type Cat = { label: string; color: string; img?: string };
function TallyOptions({ c, set, upload, busy }: { c: Config; set: (next: Config) => void; upload: Props['upload']; busy: boolean }) {
  const cats = c.cats as Cat[], counts = c.counts as number[];
  const colors = TALLY_COLORS as string[];
  const [note, setNote] = useState('');
  const cat = (i: number, patch: Partial<Cat>) => set({ cats: cats.map((x, n) => (n === i ? { ...x, ...patch } : x)) });
  const search = async (i: number) => {
    const word = cats[i].label.trim();
    if (!word) { setNote('Gib zuerst ein Wort ein, dann wird ein Bild dazu gesucht.'); return; }
    setNote(`Suche ein Bild für „${word}“ …`);
    try { const src = await findPicture(word, new AbortController().signal); if (src) { cat(i, { img: src }); setNote(''); } else setNote(`Kein Bild für „${word}“ gefunden.`); }
    catch (e) { setNote((e as Error).message); }
  };
  return (
    <>
      <label className="receipt-option">
        <strong>Frage oder Überschrift</strong>
        <input className="text-input" aria-label="Überschrift" placeholder="z. B. Was essen wir am liebsten?" value={c.title as string} maxLength={80} onChange={(e) => set({ title: e.target.value })} />
      </label>
      <div className="receipt-option">
        <strong>Was wird gezählt?</strong>
        <ol className="tool-rows">
          {cats.map((x, i) => (
            <li key={i} className="tool-row">
              {x.img ? <img src={x.img} alt={`Bild für ${x.label}`} /> : <span className="tool-row-empty" aria-hidden="true" style={{ background: x.color }} />}
              <input className="text-input" aria-label={`Ding ${i + 1}`} placeholder="Wort" value={x.label} maxLength={40} onChange={(e) => cat(i, { label: e.target.value })} />
              <Colors label={`Farbe für Ding ${i + 1}`} value={x.color} colors={colors} onChange={(color) => cat(i, { color })} />
              <div className="learning-actions">
                <button type="button" className="knopf compact" onClick={() => void search(i)}>Bild suchen</button>
                <label className="knopf compact">
                  Eigenes Bild
                  <input className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label={`Eigenes Bild für Ding ${i + 1}`} disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (img) => cat(i, { img })); e.target.value = ''; }} />
                </label>
                {x.img && <button type="button" className="knopf compact" onClick={() => cat(i, { img: undefined })}>Ohne Bild</button>}
                <button type="button" className="knopf compact" disabled={i === 0} aria-label={`Ding ${i + 1} nach oben`} onClick={() => set({ cats: move(cats, i, -1), counts: move(counts, i, -1) })}>↑</button>
                <button type="button" className="knopf compact" disabled={i === cats.length - 1} aria-label={`Ding ${i + 1} nach unten`} onClick={() => set({ cats: move(cats, i, 1), counts: move(counts, i, 1) })}>↓</button>
                {cats.length > 2 && <button type="button" className="knopf compact" aria-label={`Ding ${i + 1} entfernen`} onClick={() => set({ cats: cats.filter((_, n) => n !== i), counts: counts.filter((_, n) => n !== i) })}>Entfernen</button>}
              </div>
            </li>
          ))}
        </ol>
        {note && <p className="option-hint" role="status">{note}</p>}
        <div className="learning-actions">
          <button type="button" className="knopf" disabled={cats.length >= 12} onClick={() => set({ cats: [...cats, { label: '', color: colors[cats.length % colors.length] }], counts: [...counts, 0] })}>Dazu</button>
          <button type="button" className="knopf" disabled={!counts.some(Boolean)} onClick={() => set({ counts: counts.map(() => 0) })}>Alle Striche löschen</button>
        </div>
      </div>
      <Choices label="Zeigen" value={c.view as string} onChange={(view) => set({ view })} options={[{ value: 'both', label: 'Striche und Diagramm' }, { value: 'tally', label: 'Nur Striche' }, { value: 'bars', label: 'Nur Diagramm' }]} />
    </>
  );
}

/** Fields of the wheel from text: one per line or separated by commas (as in the reference). */
const fieldsOf = (text: string) => text.split(/[\n,;]+/).map((w) => w.trim().slice(0, 30)).filter(Boolean).slice(0, 12).map((label, i) => ({ label, color: (SPIN_COLORS as string[])[i % (SPIN_COLORS as string[]).length] }));
function SpinOptions({ c, set }: { c: Config; set: (next: Config) => void }) {
  const [text, setText] = useState(() => (c.fields as { label: string }[]).map((f) => f.label).join('\n'));
  const count = fieldsOf(text).length;
  const wheel = c.mode === 'wheel';
  const typed = (value: string) => { setText(value); const fields = fieldsOf(value); if (fields.length >= 2) set({ fields }); };
  return (
    <>
      <Choices label="Art" value={c.mode as string} onChange={(mode) => set({ mode })} options={[{ value: 'wheel', label: 'Glücksrad' }, { value: 'dice', label: 'Würfel' }]} />
      {wheel ? (
        <div className="receipt-option">
          <strong>Felder des Rads</strong>
          <textarea className="text-input" rows={7} aria-label="Felder des Rads" placeholder={'z. B.\nAnna\nBen\nCem'} value={text} onChange={(e) => typed(e.target.value)} />
          <p className="option-hint">Ein Feld pro Zeile oder mit Komma getrennt – 2 bis 12 (jetzt {count}). Die Farben kommen von selbst.</p>
          <div className="learning-actions">
            {(SPIN_PRESETS as [string, string][]).map(([label, words]) => <button key={label} type="button" className="knopf compact" onClick={() => typed(words)}>{label}</button>)}
          </div>
          <Toggle checked={!!c.noRepeat} label="Ohne Wiederholung" hint="Ein Feld kommt erst wieder, wenn alle anderen dran waren – z. B. „Wer ist dran?“ mit den Namen der Klasse." onChange={(noRepeat) => set({ noRepeat })} />
        </div>
      ) : (
        <>
          <Choices label="Anzahl" value={c.dice as number} onChange={(dice) => set({ dice })} options={[{ value: 1, label: 'Ein Würfel' }, { value: 2, label: 'Zwei Würfel' }]} />
          <Choices label="Seiten" value={c.faces as string} onChange={(faces) => set({ faces })} options={[{ value: 'dots', label: 'Punkte' }, { value: 'numbers', label: 'Zahlen' }]} />
        </>
      )}
      <Toggle checked={!!c.count} label="Strichliste daneben" hint={wheel ? 'Neben dem Rad steht eine Strichliste mit denselben Feldern – so sieht man, was am häufigsten kommt.' : 'Neben dem Würfel steht eine Strichliste mit den Augenzahlen (bei zwei Würfeln: den Summen 2 bis 12).'} onChange={(count) => set({ count })} />
      {!!c.count && (
        <Choices label="Die Striche …" value={c.auto ? 'auto' : 'self'} onChange={(v) => set({ auto: v === 'auto' })} options={[{ value: 'auto', label: 'kommen von selbst' }, { value: 'self', label: 'machen die Kinder' }]}
          hint={c.auto ? (wheel ? 'Jedes Drehen macht beim Ergebnis einen Strich.' : 'Jedes Würfeln macht beim Ergebnis einen Strich.') : 'Die Kinder tippen nach jedem Mal in der Strichliste beim Ergebnis auf + (− nimmt einen Strich weg). Die Stimme erinnert sie: „Mach einen Strich!“'} />
      )}
      {!!c.count && <p className="option-hint">Eine Strichliste auf dieser Seite bekommt die neuen Felder (die Striche gleicher Felder bleiben) – gibt es keine, kommt eine dazu.</p>}
    </>
  );
}

const RANGES: [number, number][] = [[2, 4], [3, 6], [4, 8], [6, 12]];
function SeekOptions({ c, set }: { c: Config; set: (next: Config) => void }) {
  const colors = SEEK_COLORS as { id: string; label: string; hex: string }[];
  const hex = colors.find((x) => x.id === c.color)?.hex ?? '#dee2e6';
  const shapes = [...(SEEK_SHAPES as { id: string; plural: string }[]).map((x) => ({ id: x.id, label: x.plural })), { id: 'random', label: 'Zufällig' }, { id: 'any', label: 'Alle Formen' }];
  const range = c.targetsMax ? `${c.targets}-${c.targetsMax}` : '';
  return (
    <>
      <div className="receipt-option">
        <strong>Was soll man finden?</strong>
        <div className="listen-picks" role="radiogroup" aria-label="Form">
          {shapes.map((x) => (
            <button key={x.id} type="button" role="radio" className="listen-pick" aria-checked={c.shape === x.id} disabled={x.id === 'any' && c.color === 'any'} onClick={() => set({ shape: x.id })}>
              <img src={seekPicture(x.id, x.id === 'any' ? '#dee2e6' : hex) as string} alt="" />
              <small>{x.label}</small>
            </button>
          ))}
        </div>
        <div className="mt-colors" role="radiogroup" aria-label="Farbe">
          {colors.map((x) => <button key={x.id} type="button" role="radio" aria-checked={c.color === x.id} aria-label={x.label} title={x.label} style={{ background: x.hex }} onClick={() => set({ color: x.id })} />)}
        </div>
        <div className="learning-actions">
          <button type="button" className="knopf compact" aria-pressed={c.color === 'random'} onClick={() => set({ color: 'random' })}>Zufällige Farbe</button>
          <button type="button" className="knopf compact" aria-pressed={c.color === 'any'} disabled={c.shape === 'any'} onClick={() => set({ color: 'any' })}>Alle Farben</button>
        </div>
        <p className="option-hint">„Zufällig“: Jedes neue Bild sucht eine andere Form bzw. Farbe.</p>
      </div>
      <Choices label="Wie viele?" value={c.targetsMax ? 0 : (c.targets as number)} onChange={(targets) => set({ targets, targetsMax: undefined })} options={[3, 4, 5, 6, 8, 10, 12].map((n) => ({ value: n, label: String(n) }))} />
      <Choices label="Oder zufällig – bei jedem Bild neu" value={range} onChange={(v) => { const [targets, targetsMax] = v.split('-').map(Number); set({ targets, targetsMax }); }} options={RANGES.map(([a, b]) => ({ value: `${a}-${b}`, label: `${a} bis ${b}` }))} />
      <Choices label="Wie schwer?" value={c.level as string} onChange={(level) => set({ level })} options={[{ value: 'easy', label: 'Leicht' }, { value: 'medium', label: 'Mittel' }, { value: 'hard', label: 'Schwer' }]}
        hint="Leicht: die anderen haben eine andere Form und Farbe. Mittel: gleiche Form oder gleiche Farbe. Schwer: mehr und kleiner." />
      <button type="button" className="knopf" onClick={() => set({ seed: Math.floor(Math.random() * 1e9) })}>Neues Bild</button>
    </>
  );
}

function PatternOptions({ c, set }: { c: Config; set: (next: Config) => void }) {
  const rules = PATTERN_RULES as { id: string; label: string; hint: string }[];
  return (
    <>
      <Choices label="Was" value={c.kind as string} onChange={(kind) => set({ kind })} options={[{ value: 'beads', label: 'Perlen (Farben)' }, { value: 'shapes', label: 'Formen' }]} />
      <div className="receipt-option">
        <strong>Regel</strong>
        <div className="learning-actions" role="group" aria-label="Regel">
          {rules.map((r) => (
            <button key={r.id} type="button" className="knopf compact tool-rule" aria-pressed={c.rule === r.id} onClick={() => set({ rule: r.id })}>
              <span>{r.label}</span> <small>{r.hint}</small>
            </button>
          ))}
        </div>
      </div>
      <Choices label="Leere Plätze" value={c.blanks as number} onChange={(blanks) => set({ blanks })} options={[2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) }))} />
      <Choices label="Wie viele Muster nacheinander?" value={c.rounds as number} onChange={(rounds) => set({ rounds })} options={[1, 3, 5, 8, 10].map((n) => ({ value: n, label: String(n) }))} />
      <button type="button" className="knopf" onClick={() => set({ seed: Math.floor(Math.random() * 1e9) })}>Andere Farben</button>
    </>
  );
}

const HINTS: Partial<Record<ToolId, string>> = {
  tally: '„+“ macht einen Strich, „−“ nimmt einen weg. Jeder fünfte Strich geht quer über die vier davor.',
  spin: 'Probier es aus: Tippe auf das Rad oder den Würfel und dann rechts beim Ergebnis auf +.',
  seek: 'Im Heft tippt man die richtigen an. Ausgedruckt kreist man sie ein.',
  pattern: 'Probier es aus: Tippe unten auf die Perle, die als Nächstes kommt.',
};

export default function ToolOptions({ tool, value, onChange, upload, busy }: Props) {
  const c = useMemo(() => toolConfig(tool, value), [tool, value]);
  const latest = useRef(c);
  useLayoutEffect(() => { latest.current = c; });
  const set = (next: Config) => onChange(toolConfig(tool, { ...latest.current, ...next }) as unknown as JsonValue);
  // Clean settings are kept as the reference would store them.
  useEffect(() => { if (JSON.stringify(c) !== JSON.stringify(value)) onChange(c as unknown as JsonValue); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [w, h] = toolUnits(tool);
  const form = TOOL_FORMS[tool];
  return (
    <div className="receipt-options tool-options">
      <Preview tool={tool} config={c} width={w} height={h} />
      <p className="option-hint">{form ? (typeof form.hint === 'function' ? form.hint(c) : form.hint) : HINTS[tool]}</p>
      {form && <ToolForm fields={form.fields} value={form.toDraft ? form.toDraft(c) : c} onChange={(d) => onChange(toolConfig(tool, form.fromDraft ? form.fromDraft(d) : d) as unknown as JsonValue)} upload={upload} busy={busy} />}
      {tool === 'tally' && <TallyOptions c={c} set={set} upload={upload} busy={busy} />}
      {tool === 'spin' && <SpinOptions c={c} set={set} />}
      {tool === 'seek' && <SeekOptions c={c} set={set} />}
      {tool === 'pattern' && <PatternOptions c={c} set={set} />}
    </div>
  );
}
