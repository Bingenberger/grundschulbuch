'use client';
// Settings of “Rechnen mit dem Taschenrechner” (Kassenzettel): the options of
// the reference, laid out with switches and sliders.
import type { LearningSettings } from '@/lib/learning/catalog';
import { Chips, Slider, Toggle } from '../sheets/SheetParts';

type Receipt = NonNullable<LearningSettings['receipt']>;

export default function ReceiptOptions({ value, onChange }: { value: Receipt | undefined; onChange: (r: Receipt) => void }) {
  const r = value || {};
  const set = (v: Partial<Receipt>) => onChange({ ...r, ...v });
  const count = Math.max(3, Math.min(10, r.count ?? 5));
  const rounds = Math.max(1, Math.min(10, r.rounds ?? 3));
  return (
    <div className="receipt-options">
      <div className="receipt-option">
        <strong>Schreibweise</strong>
        <Chips
          label="Schreibweise"
          value={r.format || 'eurocent'}
          onChange={(format) => set({ format })}
          options={[
            { value: 'eurocent', label: 'Euro und Cent (1,49 €)' },
            { value: 'euro', label: 'Nur Euro (6 €)' },
            { value: 'cent', label: 'Nur Cent (45 ct)' },
          ]}
        />
      </div>
      <Toggle checked={r.level === 'complex'} label="Krumme Preise" hint={r.level === 'complex' ? 'Preise wie 1,49 € oder 3,97 €.' : 'Aus: einfache Preise wie 1,50 € oder 3 €.'} onChange={(on) => set({ level: on ? 'complex' : 'simple' })} />
      <Slider label="Einkäufe auf dem Kassenzettel" value={count} min={3} max={10} format={(v) => (v === 1 ? '1 Einkauf' : `${v} Einkäufe`)} onChange={(c) => set({ count: c })} />
      <Toggle checked={!!r.change} label="Wechselgeld rechnen" hint="Ist die Summe richtig, erscheint, wie viel bezahlt wurde (aufgerundet, z. B. 20 €) – dann wird das Rückgeld ausgerechnet und eingetragen." onChange={(change) => set({ change })} />
      <Slider label="Kassenzettel nacheinander" value={rounds} min={1} max={10} format={(v) => (v === 1 ? '1 Zettel' : `${v} Zettel`)} hint="Danach kommt eine Auswertung: Zeit, Fehler, wie oft verbessert wurde." onChange={(n) => set({ rounds: n })} />
    </div>
  );
}
