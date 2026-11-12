'use client';
// “Labyrinth” – the settings dialog of the reference: form, difficulty, cats.
import { useMemo, useState } from 'react';
import { MAZE_DEFAULTS, MAZE_LEVELS, makeMazePages, mazeSizeLabel } from '@/lib/sheets/reference-sheets';
import { toPages } from '@/lib/sheets/convert';
import type { Page } from '@/lib/notebook-model';
import { Counter, Preview, Section, SheetDialog, Toggle, cleanLayout, loadSettings, saveSettings, useSheetInsert, type SheetLayout } from './SheetParts';

type MazeSettings = SheetLayout & { shape: 'square' | 'round'; level: number; cats: number };
const KEY = 'grundschulbuch-labyrinth';
const levels = MAZE_LEVELS as { label: string }[];
const clean = (v: MazeSettings): MazeSettings => ({
  ...cleanLayout(v),
  layout: 'mixed',
  shape: v.shape === 'round' ? 'round' : 'square',
  level: Math.min(levels.length - 1, Math.max(0, Math.round(Number(v.level) || 0))),
  cats: Math.min(4, Math.max(0, Math.round(Number(v.cats) || 0))),
});

function ShapeIcon({ shape }: { shape: 'square' | 'round' }) {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
      {shape === 'square' ? (
        <path d="M6 6h36v14M42 28v14H6V18M6 10V6M14 14h20M14 14v20h12M34 14v14M22 22v4h12M26 34h8" />
      ) : (
        <>
          <path d="M8.2 30A17 17 0 1 1 18 40.2M40 24a16 16 0 0 1-16 16" transform="rotate(-20 24 24)" />
          <path d="M33 24a9 9 0 1 1-9-9M24 33a9 9 0 0 1-9-9M24 6v9M33 24h7" />
        </>
      )}
    </svg>
  );
}

export default function MazeSheetDialog({ onClose, onInsert }: { onClose: () => void; onInsert: (pages: Page[]) => Promise<void> }) {
  const [o, setO] = useState<MazeSettings>(() => loadSettings(KEY, MAZE_DEFAULTS as MazeSettings, clean));
  const [roll, setRoll] = useState(0);
  const { busy, error, insert } = useSheetInsert(onInsert, onClose);
  const set = (v: Partial<MazeSettings>) => setO((old) => ({ ...old, ...v }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pages = useMemo(() => toPages(makeMazePages(o), 'sheet-labyrinth'), [o, roll]);

  return (
    <SheetDialog title="Labyrinth" icon="template" pages={pages} busy={busy} error={error} reroll={() => setRoll((r) => r + 1)} rerollLabel="Andere Labyrinthe" onCancel={onClose} onInsert={() => insert(pages, () => saveSettings(KEY, o))}>
      <div className="sheet-opts">
        <Section title="1. Form">
          <div className="sheet-chips" role="radiogroup" aria-label="Form">
            {(
              [
                ['square', 'Eckig'],
                ['round', 'Rund'],
              ] as const
            ).map(([shape, label]) => (
              <button key={shape} type="button" role="radio" aria-checked={o.shape === shape} className={`sheet-chip sheet-shape${o.shape === shape ? ' is-active' : ''}`} onClick={() => set({ shape })}>
                <ShapeIcon shape={shape} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </Section>
        <Section title="2. Wie schwer?">
          <div className="sheet-chips" role="radiogroup" aria-label="Schwierigkeit">
            {levels.map((l, i) => (
              <button key={l.label} type="button" role="radio" aria-checked={o.level === i} className={`sheet-chip sheet-level${o.level === i ? ' is-active' : ''}`} onClick={() => set({ level: i })}>
                <span>{l.label}</span>
                <small>{mazeSizeLabel(o.shape, i)}</small>
              </button>
            ))}
          </div>
        </Section>
        <Section title="3. Katzen">
          <Counter label="Katzen als Hindernisse" value={o.cats} min={0} max={4} onChange={(cats) => set({ cats })} />
          <p className="sheet-note">Die Katzen sitzen auf dem kürzesten Weg – an ihnen kommt die Maus nicht vorbei. Es gibt immer einen Weg um alle Katzen herum.</p>
        </Section>
        <Section title="4. Seiten">
          <div className="sheet-stack">
            <Counter label="Anzahl der Seiten" value={o.pages} onChange={(n) => set({ pages: n })} />
            <Toggle checked={o.solutions} label="Lösungsseiten anhängen" hint="Am Ende kommen die Labyrinthe noch einmal – mit dem Weg zum Käse in Grün." onChange={(solutions) => set({ solutions })} />
          </div>
        </Section>
      </div>
      <Preview pages={pages} hint="Die Maus startet links, der Käse ist das Ziel. Den Weg zeichnet man mit dem Stift." />
    </SheetDialog>
  );
}
