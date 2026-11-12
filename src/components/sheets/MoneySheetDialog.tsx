'use client';
// “Rechnen mit Geld” – the settings dialog of the reference.
import { useMemo, useState } from 'react';
import { MONEY_DEFAULTS, MONEY_FORMATS, findMoneyFormat, makeMoneyPages, moneyValues } from '@/lib/sheets/reference-sheets';
import { toPages, type RefPage } from '@/lib/sheets/convert';
import type { Page } from '@/lib/notebook-model';
import { moneyPicture } from '@/lib/learning/checkout';
import { Chips, FormatCard, PagesSection, Preview, Section, SheetDialog, cleanLayout, loadSettings, saveSettings, useSheetInsert, type SheetLayout } from './SheetParts';

type MoneySettings = SheetLayout & { formats: string[]; money: 'coins' | 'notes' | 'both'; amounts: 'cent' | 'euro' | 'mixed'; notation: 'comma' | 'units'; max: number; pics: 'arasaac' | 'own' };
type Format = { id: string; label: string; title: string; sample: string; hint?: string; available?: (o: MoneySettings) => boolean };
const KEY = 'grundschulbuch-rechnen-mit-geld';
const MAXIMA = [10, 20, 100, 1000];
const formats = MONEY_FORMATS as Format[];
const clean = (v: MoneySettings): MoneySettings => ({
  ...cleanLayout(v),
  formats: Array.isArray(v.formats) ? v.formats.filter((f) => !!findMoneyFormat(f)) : MONEY_DEFAULTS.formats,
  money: v.money === 'coins' || v.money === 'notes' ? v.money : 'both',
  amounts: v.amounts === 'cent' || v.amounts === 'euro' ? v.amounts : 'mixed',
  notation: v.notation === 'units' ? 'units' : 'comma',
  max: MAXIMA.includes(v.max) ? v.max : MONEY_DEFAULTS.max,
  pics: v.pics === 'own' ? 'own' : 'arasaac',
});
/** The ARASAAC coins and notes that are part of the app. */
const pictures = (o: MoneySettings) => (o.pics === 'arasaac' ? new Map((moneyValues(o) as number[]).map((v) => [v, { id: moneyPicture(v) }])) : undefined);

/** Builds the pages; exercises that cannot be made with these settings are left out. */
function build(o: MoneySettings, chosen: string[]) {
  const placed = { placed: new Set<string>() };
  const tryWith = (ids: string[]): RefPage[] | null => {
    try {
      return makeMoneyPages({ ...o, formats: ids }, placed, pictures(o));
    } catch {
      return null;
    }
  };
  let ids = chosen;
  let ref = ids.length ? tryWith(ids) : [];
  const impossible: string[] = [];
  if (!ref) {
    impossible.push(...ids.filter((id) => !tryWith([id])));
    ids = ids.filter((id) => !impossible.includes(id));
    placed.placed.clear();
    ref = (ids.length && tryWith(ids)) || [];
  }
  return { pages: toPages(ref, 'sheet-geld'), missing: ids.filter((f) => !placed.placed.has(f)).length, impossible };
}

export default function MoneySheetDialog({ onClose, onInsert }: { onClose: () => void; onInsert: (pages: Page[]) => Promise<void> }) {
  const [o, setO] = useState<MoneySettings>(() => loadSettings(KEY, MONEY_DEFAULTS as MoneySettings, clean));
  const [roll, setRoll] = useState(0);
  const { busy, error, insert } = useSheetInsert(onInsert, onClose);
  const set = (v: Partial<MoneySettings>) => setO((old) => ({ ...old, ...v }));
  const ok = (id: string) => {
    const f = findMoneyFormat(id) as Format | undefined;
    return !!f && (!f.available || f.available(o));
  };
  const chosen = o.formats.filter(ok);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { pages, missing, impossible } = useMemo(() => build(o, chosen), [o, roll]);
  const toggle = (id: string) => set({ formats: o.formats.includes(id) ? o.formats.filter((f) => f !== id) : [...o.formats, id] });

  return (
    <SheetDialog title="Rechnen mit Geld" icon="calculator" pages={pages} busy={busy} error={error} reroll={() => setRoll((r) => r + 1)} onCancel={onClose} onInsert={() => insert(pages, () => saveSettings(KEY, o))}>
      <div className="sheet-opts">
        <Section title="1. Schwierigkeit">
          <div className="sheet-stack">
            <div className="sheet-row">
              <span>Beträge</span>
              <Chips label="Beträge" value={o.amounts} onChange={(amounts) => set({ amounts })} options={[{ value: 'cent', label: 'Nur Cent' }, { value: 'euro', label: 'Nur Euro' }, { value: 'mixed', label: 'Euro und Cent' }]} />
            </div>
            {o.amounts !== 'cent' && (
              <div className="sheet-row">
                <span>Geld</span>
                <Chips label="Geld" value={o.money} onChange={(money) => set({ money })} options={[{ value: 'coins', label: 'Nur Münzen' }, { value: 'notes', label: 'Nur Scheine' }, { value: 'both', label: 'Münzen und Scheine' }]} />
              </div>
            )}
            {o.amounts === 'mixed' && o.money !== 'notes' && (
              <div className="sheet-row">
                <span>Schreibweise</span>
                <Chips label="Schreibweise" value={o.notation} onChange={(notation) => set({ notation })} options={[{ value: 'comma', label: 'Mit Komma (3,50 €)' }, { value: 'units', label: 'Ohne Komma (3 € 50 ct)' }]} />
              </div>
            )}
            {o.amounts !== 'cent' && (
              <div className="sheet-row">
                <span>Beträge bis</span>
                <Chips label="Beträge bis" value={o.max} onChange={(max) => set({ max })} options={MAXIMA.map((m) => ({ value: m, label: `${m} €` }))} />
              </div>
            )}
            {o.amounts === 'cent' && <p className="sheet-note">Nur Cent: Beträge unter 1 € mit den Cent-Münzen.</p>}
            <div className="sheet-row">
              <span>Bilder</span>
              <Chips label="Bilder der Münzen und Scheine" value={o.pics} onChange={(pics) => set({ pics })} options={[{ value: 'arasaac', label: 'ARASAAC-Piktogramme' }, { value: 'own', label: 'Eigene Zeichnungen' }]} />
            </div>
            {o.pics === 'arasaac' && <p className="sheet-note">Münzen und Scheine von ARASAAC (Sergio Palao, CC BY-NC-SA 4.0) – sie sind in der App enthalten und kommen mit ins Heft.</p>}
          </div>
        </Section>
        <Section title="2. Übungen auswählen">
          <div className="sheet-formats">
            {formats.map((f) => (
              <FormatCard key={f.id} on={o.formats.includes(f.id)} ok={ok(f.id)} label={f.label} sample={f.sample} hint={f.hint || 'Nur bei Euro und Cent mit Münzen'} title={f.title} onClick={() => toggle(f.id)} />
            ))}
          </div>
          {impossible.length > 0 && (
            <p className="sheet-warn">
              Mit diesem Geld lassen sich keine Aufgaben bilden für: {impossible.map((id) => (findMoneyFormat(id) as Format).label).join(', ')}.
            </p>
          )}
        </Section>
        <PagesSection n={3} o={o} set={set} chosen={chosen.length} missing={missing} />
      </div>
      <Preview pages={pages} hint="Die Beträge tippt man in die Kästchen – oder schreibt sie mit dem Stift. Einkreisen geht mit dem Stift." />
    </SheetDialog>
  );
}
