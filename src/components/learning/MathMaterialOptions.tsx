'use client';
// Settings of the maths materials: Stellenwerttafel, Dienes-Material,
// Zahlenstrahl and Hunderterfeld – switches, sliders and short choices.
import type { JsonValue } from '@/lib/learning/catalog';
import { PLACES, placeSettings } from '@/lib/learning/placevalue';
import { dienesSettings } from '@/lib/learning/dienes';
import { numberLineSettings, ticks } from '@/lib/learning/numberline';
import { fieldSettings } from '@/lib/learning/hundredfield';
import { Chips, Slider, Toggle } from '../sheets/SheetParts';

type Props = { value: unknown; onChange: (v: JsonValue) => void };
const tasksText = (n: number) => (n === 0 ? 'keine' : n === 1 ? '1 Aufgabe' : `${n} Aufgaben`);

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="receipt-option">
      <strong>{title}</strong>
      {children}
    </div>
  );
}

export function PlaceValueOptions({ value, onChange }: Props) {
  const s = placeSettings(value);
  const set = (v: Partial<typeof s>) => onChange({ ...s, ...v } as unknown as JsonValue);
  return (
    <div className="receipt-options">
      <Row title="Kleinste Stelle">
        <Chips label="Kleinste Stelle" value={s.from} onChange={(from) => set({ from, to: Math.max(from + 1, s.to) })} options={PLACES.slice(0, 5).map((p, i) => ({ value: i, label: p.name }))} />
      </Row>
      <Row title="Größte Stelle">
        <Chips label="Größte Stelle" value={s.to} onChange={(to) => set({ to, from: Math.min(s.from, to - 1) })} options={PLACES.slice(1).map((p, i) => ({ value: i + 1, label: p.name }))} />
      </Row>
      <p className="option-hint">Die Spalten tragen die Montessori-Farben: Einer grün, Zehner blau, Hunderter rot – bei Tausendern beginnt es wieder mit Grün.</p>
      <Toggle checked={s.counters} label="Plättchen legen" hint="Tippen in eine Spalte legt ein Plättchen, Tippen auf ein Plättchen nimmt es weg." onChange={(counters) => set({ counters })} />
      <Toggle checked={s.digits} label="Ziffern mit + und −" hint="Unter jeder Spalte steht die Ziffer; + und − ändern sie." onChange={(digits) => set({ digits })} />
      <Toggle checked={s.exchange} label="Bündeln und Entbündeln" hint="Liegen 10 Plättchen in einer Spalte, werden sie zu 1 der nächsten Stelle gebündelt – und zurück." onChange={(exchange) => set({ exchange })} />
      <Toggle checked={s.total} label="Zahl darunter zeigen" hint="z. B. 3 H 4 Z 7 E = 347" onChange={(total) => set({ total })} />
      <Slider label="Zahlen legen üben" value={s.tasks} min={0} max={10} format={tasksText} hint="Mit Aufgaben steht oben „Lege die Zahl …“ mit Prüfen; Bündeln gehört zur richtigen Lösung." onChange={(tasks) => set({ tasks })} />
    </div>
  );
}

export function DienesOptions({ value, onChange }: Props) {
  const s = dienesSettings(value);
  const set = (v: Partial<typeof s>) => onChange({ ...s, ...v } as unknown as JsonValue);
  return (
    <div className="receipt-options">
      <Row title="Material bis">
        <Chips label="Material bis" value={s.to} onChange={(to) => set({ to })} options={[{ value: 1, label: 'Zehnerstangen' }, { value: 2, label: 'Hunderterplatten' }, { value: 3, label: 'Tausenderwürfel' }]} />
      </Row>
      <Row title="Farben">
        <Chips label="Farben" value={s.colors} onChange={(colors) => set({ colors })} options={[{ value: 'wood', label: 'Holz' }, { value: 'montessori', label: 'Montessori-Farben' }]} />
      </Row>
      <Toggle checked={s.exchange} label="Tauschen" hint="10 Einerwürfel gegen 1 Zehnerstange tauschen – und zurück." onChange={(exchange) => set({ exchange })} />
      <Toggle checked={s.total} label="Zahl darunter zeigen" onChange={(total) => set({ total })} />
      <Slider label="Zahlen legen üben" value={s.tasks} min={0} max={10} format={tasksText} hint="Mit Aufgaben steht oben „Lege die Zahl …“ mit Prüfen." onChange={(tasks) => set({ tasks })} />
    </div>
  );
}

const RANGE_ENDS = [10, 20, 30, 50, 100, 200, 500, 1000];
export function NumberLineOptions({ value, onChange }: Props) {
  const s = numberLineSettings(value);
  const set = (v: Partial<typeof s>) => onChange({ ...s, ...v } as unknown as JsonValue);
  const { small } = ticks(s.start, s.end);
  const startStep = s.end <= 100 ? 10 : 100;
  return (
    <div className="receipt-options">
      <Row title="Zahlenstrahl bis">
        <Chips label="Zahlenstrahl bis" value={s.end} onChange={(end) => set({ end, start: Math.min(s.start, end - 10) })} options={RANGE_ENDS.map((n) => ({ value: n, label: String(n) }))} />
      </Row>
      <Slider label="Beginnt bei" value={s.start} min={0} max={Math.max(0, s.end - 10)} step={startStep} onChange={(start) => set({ start })} hint="Für einen Ausschnitt, z. B. von 30 bis 50." />
      <Row title="Beschriftung">
        <Chips label="Beschriftung" value={s.labels} onChange={(labels) => set({ labels })} options={[{ value: 'all', label: 'Alle wichtigen Striche' }, { value: 'big', label: 'Nur die langen Striche' }, { value: 'ends', label: 'Nur Anfang und Ende' }]} />
      </Row>
      <p className="option-hint">Kleinster Abstand zwischen zwei Strichen: {small}.</p>
      <Row title="So wird gearbeitet">
        <Chips label="So wird gearbeitet" value={s.mode} onChange={(mode) => set({ mode })} options={[{ value: 'free', label: 'Punkte und Sprünge' }, { value: 'find', label: 'Zahlen finden' }]} />
      </Row>
      <p className="option-hint">{s.mode === 'free' ? 'Punkte setzen und Rechensprünge zeichnen (+7, −3); Antippen löscht sie wieder.' : 'Oben steht „Wo liegt die 37?“ – die Kinder tippen die Stelle auf dem Zahlenstrahl an.'}</p>
      <Toggle checked={s.values} label={s.mode === 'free' ? 'Zahl am Punkt zeigen' : 'Getippte Zahl zeigen'} onChange={(values) => set({ values })} />
      {s.mode === 'find' && <Slider label="Aufgaben" value={s.tasks} min={1} max={10} format={tasksText} onChange={(tasks) => set({ tasks })} />}
    </div>
  );
}

export function HundredFieldOptions({ value, onChange }: Props) {
  const s = fieldSettings(value);
  const set = (v: Partial<typeof s>) => onChange({ ...s, ...v } as unknown as JsonValue);
  return (
    <div className="receipt-options">
      <Row title="Größe">
        <Chips label="Größe" value={s.size} onChange={(size) => set({ size })} options={[{ value: 20, label: 'Zwanzigerfeld' }, { value: 100, label: 'Hunderterfeld' }]} />
      </Row>
      <Row title="So wird gearbeitet">
        <Chips label="So wird gearbeitet" value={s.mode} onChange={(mode) => set({ mode })} options={[{ value: 'paint', label: 'Frei färben' }, { value: 'cover', label: 'Abdeckwinkel' }, { value: 'show', label: 'Zahlen zeigen' }]} />
      </Row>
      <p className="option-hint">
        {s.mode === 'paint' ? 'Rot, Blau und Radierer: Tippen färbt einen Punkt, Wischen färbt viele.' : s.mode === 'cover' ? 'Der Winkel deckt das Feld ab; Tippen auf einen Punkt schiebt ihn dorthin – so sieht man genau so viele Punkte.' : 'Oben steht „Zeige 37“ – die Kinder färben so viele Punkte und prüfen.'}
      </p>
      <Toggle checked={s.count} label="Anzahl zeigen" hint={s.mode === 'paint' ? 'z. B. 30 + 7 = 37' : undefined} onChange={(count) => set({ count })} />
      {s.mode === 'show' && <Slider label="Aufgaben" value={s.tasks} min={1} max={10} format={tasksText} onChange={(tasks) => set({ tasks })} />}
    </div>
  );
}
