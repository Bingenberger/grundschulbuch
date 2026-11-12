'use client';
// “Noten lernen” – the settings dialog of the reference.
import { useMemo, useState } from 'react';
import { NOTE_DEFAULTS, NOTE_FORMATS, findNoteFormat, makeNotePages } from '@/lib/sheets/reference-sheets';
import { toPages, type RefPage } from '@/lib/sheets/convert';
import type { Page } from '@/lib/notebook-model';
import { FormatCard, PagesSection, Preview, Section, SheetDialog, cleanLayout, loadSettings, saveSettings, useSheetInsert, type SheetLayout } from './SheetParts';

type NoteSettings = SheetLayout & { clef: 'treble' | 'bass'; ledger: boolean; formats: string[] };
const KEY = 'grundschulbuch-noten-lernen';
const formats = NOTE_FORMATS as { id: string; label: string; sample: string }[];
const clean = (v: NoteSettings): NoteSettings => ({
  ...cleanLayout(v),
  clef: v.clef === 'bass' ? 'bass' : 'treble',
  ledger: v.ledger === true,
  formats: Array.isArray(v.formats) ? v.formats.filter((f) => !!findNoteFormat(f)) : NOTE_DEFAULTS.formats,
});

function Level({ on, label, sample, onClick }: { on: boolean; label: string; sample: string; onClick: () => void }) {
  return (
    <button type="button" role="radio" aria-checked={on} className={`sheet-chip sheet-level${on ? ' is-active' : ''}`} onClick={onClick}>
      <span>{label}</span>
      <small>{sample}</small>
    </button>
  );
}

export default function NoteSheetDialog({ onClose, onInsert }: { onClose: () => void; onInsert: (pages: Page[]) => Promise<void> }) {
  const [o, setO] = useState<NoteSettings>(() => loadSettings(KEY, NOTE_DEFAULTS as NoteSettings, clean));
  const [roll, setRoll] = useState(0);
  const { busy, error, insert } = useSheetInsert(onInsert, onClose);
  const set = (v: Partial<NoteSettings>) => setO((old) => ({ ...old, ...v }));
  const [pages, missing] = useMemo(() => {
    const placed = { placed: new Set<string>() };
    const ref: RefPage[] = o.formats.length ? makeNotePages(o, placed) : [];
    return [toPages(ref, 'sheet-noten'), o.formats.filter((f) => !placed.placed.has(f)).length] as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o, roll]);
  const toggle = (id: string) => set({ formats: o.formats.includes(id) ? o.formats.filter((f) => f !== id) : [...o.formats, id] });

  return (
    <SheetDialog title="Noten lernen" icon="music" pages={pages} busy={busy} error={error} reroll={() => setRoll((r) => r + 1)} rerollLabel="Andere Noten" onCancel={onClose} onInsert={() => insert(pages, () => saveSettings(KEY, o))}>
      <div className="sheet-opts">
        <Section title="1. Notenschlüssel und Tonraum">
          <div className="sheet-chips" role="radiogroup" aria-label="Notenschlüssel">
            <Level on={o.clef === 'treble'} label="Violinschlüssel" sample="G-Schlüssel" onClick={() => set({ clef: 'treble' })} />
            <Level on={o.clef === 'bass'} label="Bassschlüssel" sample="F-Schlüssel" onClick={() => set({ clef: 'bass' })} />
          </div>
          <div className="sheet-chips" role="radiogroup" aria-label="Tonraum" style={{ marginTop: 8 }}>
            <Level on={!o.ledger} label="Im Notensystem" sample={o.clef === 'bass' ? 'G bis A' : 'E bis F'} onClick={() => set({ ledger: false })} />
            <Level on={o.ledger} label="Mit Hilfslinien" sample={o.clef === 'bass' ? 'E bis C' : 'C bis A'} onClick={() => set({ ledger: true })} />
          </div>
        </Section>
        <Section title="2. Übungen auswählen">
          <div className="sheet-formats">
            {formats.map((f) => (
              <FormatCard key={f.id} on={o.formats.includes(f.id)} label={f.label} sample={f.sample} onClick={() => toggle(f.id)} />
            ))}
          </div>
        </Section>
        <PagesSection n={3} o={o} set={set} chosen={o.formats.length} missing={missing} />
      </div>
      <Preview pages={pages} hint="Die Notennamen tippt man in die Kästchen – Noten zeichnet man mit dem Stift." />
    </SheetDialog>
  );
}
