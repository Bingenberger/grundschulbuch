'use client';
// “Mathe-Aufgaben” – the settings dialog of the reference: number range,
// exercises in five groups, settings, pages, preview.
import { useMemo, useState } from 'react';
import { MATH_DEFAULTS, MATH_FORMATS, MATH_RANGES, findFormat, makeMathPages, rangeText } from '@/lib/sheets/reference-sheets';
import { toPages, type RefPage } from '@/lib/sheets/convert';
import type { Page } from '@/lib/notebook-model';
import { Chips, FormatCard, PagesSection, Preview, Section, SheetDialog, Toggle, cleanLayout, loadSettings, saveSettings, useSheetInsert, type SheetLayout } from './SheetParts';

type Op = '+' | '-' | '*' | ':';
type MathSettings = SheetLayout & { range: number; formats: string[]; mixOps: Op[]; gaps: boolean; carry: 'any' | 'with' | 'without'; remainder: boolean };
type Format = { id: string; label: string; title: string; sample: string; group: string; hint?: string; available: (range: number) => boolean };

const KEY = 'grundschulbuch-mathe-aufgaben';
const GROUPS = ['Rechnen', 'Zahlen', 'Schriftlich', 'Knobeln', 'Formen'];
const OPS: Op[] = ['+', '-', '*', ':'];
const OP_TEXT: Record<Op, string> = { '+': '+', '-': '−', '*': '·', ':': ':' };
const ARITHMETIC = ['plus', 'minus', 'mal', 'geteilt', 'mixed'];
const formats = MATH_FORMATS as Format[];

const clean = (v: MathSettings): MathSettings => ({
  ...cleanLayout(v),
  range: MATH_RANGES.includes(v.range) ? v.range : MATH_DEFAULTS.range,
  formats: Array.isArray(v.formats) ? v.formats.filter((f) => !!findFormat(f)) : MATH_DEFAULTS.formats,
  mixOps: Array.isArray(v.mixOps) ? v.mixOps.filter((o) => OPS.includes(o)) : (MATH_DEFAULTS.mixOps as Op[]),
});

export default function MathSheetDialog({ onClose, onInsert }: { onClose: () => void; onInsert: (pages: Page[]) => Promise<void> }) {
  const [o, setO] = useState<MathSettings>(() => loadSettings(KEY, MATH_DEFAULTS as MathSettings, clean));
  const [roll, setRoll] = useState(0);
  const { busy, error, insert } = useSheetInsert(onInsert, onClose);
  const set = (v: Partial<MathSettings>) => setO((old) => ({ ...old, ...v }));
  const chosen = o.formats.filter((f) => findFormat(f)?.available(o.range));
  const has = (...ids: string[]) => ids.some((id) => chosen.includes(id));
  const mixed = (op: Op) => has('mixed') && o.mixOps.includes(op);
  const [pages, missing] = useMemo(() => {
    const placed = { placed: new Set<string>() };
    const ref: RefPage[] = chosen.length ? makeMathPages(o, placed) : [];
    return [toPages(ref, 'sheet-rechnen'), chosen.filter((f) => !placed.placed.has(f)).length] as const;
    // `roll` makes new tasks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o, roll]);
  const toggle = (id: string) => set({ formats: o.formats.includes(id) ? o.formats.filter((f) => f !== id) : [...o.formats, id] });
  const toggleOp = (op: Op) => {
    const next = o.mixOps.includes(op) ? o.mixOps.filter((x) => x !== op) : [...o.mixOps, op];
    if (next.length) set({ mixOps: OPS.filter((x) => next.includes(x)) });
  };
  const gapsFit = has(...ARITHMETIC) || has('wall', 'triangle', 'table');
  const settings = gapsFit || has('wplus', 'wminus', 'boat');

  return (
    <SheetDialog
      title="Mathe-Aufgaben"
      icon="calculator"
      pages={pages}
      busy={busy}
      error={error}
      reroll={() => setRoll((r) => r + 1)}
      onCancel={onClose}
      onInsert={() => insert(pages, () => saveSettings(KEY, o))}
    >
      <div className="sheet-opts">
        <Section title="1. Zahlenraum">
          <Chips label="Zahlenraum" value={o.range} onChange={(range) => set({ range })} options={MATH_RANGES.map((r: number) => ({ value: r, label: `bis ${rangeText(r)}` }))} />
        </Section>
        <Section title="2. Übungen auswählen">
          {GROUPS.map((g) => (
            <div key={g} className="sheet-group">
              <h4>{g}</h4>
              <div className="sheet-formats">
                {formats.filter((f) => f.group === g).map((f) => (
                  <FormatCard key={f.id} on={o.formats.includes(f.id)} ok={f.available(o.range)} label={f.label} sample={f.sample} hint={f.hint} title={f.title} onClick={() => toggle(f.id)} />
                ))}
              </div>
            </div>
          ))}
        </Section>
        {settings && (
          <Section title="3. Einstellungen">
            <div className="sheet-stack">
              {has('mixed') && (
                <div className="sheet-row">
                  <span>Gemischt aus</span>
                  <div className="sheet-chips">
                    {OPS.map((op) => (
                      <button key={op} type="button" aria-pressed={o.mixOps.includes(op)} aria-label={`Gemischt aus ${OP_TEXT[op]}`} className={`sheet-chip sheet-op${o.mixOps.includes(op) ? ' is-active' : ''}`} onClick={() => toggleOp(op)}>
                        {OP_TEXT[op]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {(has('plus', 'minus', 'wplus', 'wminus', 'boat') || mixed('+') || mixed('-')) && o.range > 10 && (
                <div className="sheet-row">
                  <span>{has('wplus', 'wminus') && !has('plus', 'minus', 'mixed', 'boat') ? 'Übertrag' : 'Zehnerübergang / Übertrag'}</span>
                  <Chips label="Zehnerübergang" value={o.carry} onChange={(carry) => set({ carry })} options={[{ value: 'any', label: 'egal' }, { value: 'without', label: 'ohne' }, { value: 'with', label: 'mit' }]} />
                </div>
              )}
              {gapsFit && (
                <Toggle checked={o.gaps} label="Ergänzungsaufgaben" hint="Manchmal fehlt eine Zahl der Aufgabe statt des Ergebnisses (3 + ▢ = 7) – bei Rechenmauern, Rechendreiecken und Rechentabellen fehlen auch untere Steine, Zahlen innen oder am Rand." onChange={(gaps) => set({ gaps })} />
              )}
              {(has('geteilt') || mixed(':')) && <Toggle checked={o.remainder} label="Geteilt mit Rest" hint="z. B. 17 : 5 = 3 R 2" onChange={(remainder) => set({ remainder })} />}
            </div>
          </Section>
        )}
        <PagesSection n={settings ? 4 : 3} o={o} set={set} chosen={chosen.length} missing={missing} />
      </div>
      <Preview pages={pages} hint="In jedes Kästchen tippt man das Ergebnis – oder schreibt es mit dem Stift." />
    </SheetDialog>
  );
}
