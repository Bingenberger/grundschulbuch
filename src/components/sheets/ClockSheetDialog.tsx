'use client';
// “Uhrzeiten üben” – the settings dialog of the reference.
import { useMemo, useState } from 'react';
import { CLOCK_DEFAULTS, CLOCK_FORMATS, CLOCK_LEVELS, findClockFormat, makeClockPages } from '@/lib/sheets/reference-sheets';
import { toPages, type RefPage } from '@/lib/sheets/convert';
import type { Page } from '@/lib/notebook-model';
import { FormatCard, LevelChips, PagesSection, Preview, Section, SheetDialog, cleanLayout, loadSettings, saveSettings, useSheetInsert, type SheetLayout } from './SheetParts';

type Level = 'hour' | 'half' | 'quarter' | 'five' | 'minute';
type ClockSettings = SheetLayout & { level: Level; formats: string[] };
const KEY = 'grundschulbuch-uhrzeiten';
const levels = CLOCK_LEVELS as { id: Level; label: string; sample: string }[];
const formats = CLOCK_FORMATS as { id: string; label: string; title: string; sample: string }[];
const clean = (v: ClockSettings): ClockSettings => ({
  ...cleanLayout(v),
  level: levels.some((l) => l.id === v.level) ? v.level : (CLOCK_DEFAULTS.level as Level),
  formats: Array.isArray(v.formats) ? v.formats.filter((f) => !!findClockFormat(f)) : CLOCK_DEFAULTS.formats,
});

export default function ClockSheetDialog({ onClose, onInsert }: { onClose: () => void; onInsert: (pages: Page[]) => Promise<void> }) {
  const [o, setO] = useState<ClockSettings>(() => loadSettings(KEY, CLOCK_DEFAULTS as ClockSettings, clean));
  const [roll, setRoll] = useState(0);
  const { busy, error, insert } = useSheetInsert(onInsert, onClose);
  const set = (v: Partial<ClockSettings>) => setO((old) => ({ ...old, ...v }));
  const [pages, missing] = useMemo(() => {
    const placed = { placed: new Set<string>() };
    const ref: RefPage[] = o.formats.length ? makeClockPages(o, placed) : [];
    return [toPages(ref, 'sheet-uhr'), o.formats.filter((f) => !placed.placed.has(f)).length] as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o, roll]);
  const toggle = (id: string) => set({ formats: o.formats.includes(id) ? o.formats.filter((f) => f !== id) : [...o.formats, id] });

  return (
    <SheetDialog title="Uhrzeiten üben" icon="clock" pages={pages} busy={busy} error={error} reroll={() => setRoll((r) => r + 1)} onCancel={onClose} onInsert={() => insert(pages, () => saveSettings(KEY, o))}>
      <div className="sheet-opts">
        <Section title="1. Wie genau?">
          <LevelChips label="Genauigkeit" value={o.level} options={levels} onChange={(level) => set({ level })} />
          <p className="sheet-note">Jede Stufe enthält auch die leichteren Uhrzeiten.</p>
        </Section>
        <Section title="2. Übungen auswählen">
          <div className="sheet-formats">
            {formats.map((f) => (
              <FormatCard key={f.id} on={o.formats.includes(f.id)} label={f.label} sample={f.sample} title={f.title} onClick={() => toggle(f.id)} />
            ))}
          </div>
        </Section>
        <PagesSection n={3} o={o} set={set} chosen={o.formats.length} missing={missing} />
      </div>
      <Preview pages={pages} hint="Die Uhrzeit tippt man in die Kästchen – die Zeiger malt man mit dem Stift." />
    </SheetDialog>
  );
}
