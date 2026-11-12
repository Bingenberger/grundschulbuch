'use client';
// “Buchstaben üben” and “Ziffern üben” – the settings dialog of the reference:
// script, swing exercises, letters or digits, picture and word on each page.
import { useEffect, useMemo, useState } from 'react';
import {
  DIGITS,
  DIGIT_DEFAULTS,
  LETTERS_AZ,
  LETTERS_SOUNDS,
  LETTERS_UMLAUT,
  LETTERS_VOWELS,
  LETTER_DEFAULTS,
  SCRIPTS,
  SWINGS,
  SWING_PATHS,
  letterPictureList,
  loadScriptFonts,
  makeLetterPages,
} from '@/lib/sheets/reference-sheets';
import { toPages } from '@/lib/sheets/convert';
import type { Page } from '@/lib/notebook-model';
import { Chips, Preview, Section, SheetDialog, Toggle, loadSettings, saveSettings, useSheetInsert } from './SheetParts';

type Mode = 'letters' | 'digits';
type Script = 'grund' | 'druck' | 'schreib' | 'sas';
type LetterSettings = { script: Script; swings: string[]; letters: string[]; case: 'upper' | 'lower' | 'both'; picture: boolean; word: boolean; pics: 'arasaac' | 'own' };
const KEYS: Record<Mode, string> = { letters: 'grundschulbuch-buchstaben', digits: 'grundschulbuch-ziffern' };
const SCRIPT_LABELS: [Script, string][] = [
  ['grund', 'Grundschrift'],
  ['druck', 'Druckschrift'],
  ['schreib', 'Schreibschrift VA'],
  ['sas', 'Schreibschrift SAS'],
];
const FAMILY: Record<Script, string> = { grund: '"Playwrite DE Grund", Andika, sans-serif', druck: 'Andika, sans-serif', schreib: '"Playwrite DE VA", cursive', sas: '"Playwrite DE SAS", cursive' };
const swings = SWINGS as { id: string; label: string }[];
const ALL_LETTERS = [...LETTERS_AZ, ...LETTERS_UMLAUT, ...LETTERS_SOUNDS] as string[];

const cleaner = (mode: Mode) => (v: LetterSettings): LetterSettings => {
  const defaults = (mode === 'digits' ? DIGIT_DEFAULTS : LETTER_DEFAULTS) as LetterSettings;
  const allowed = mode === 'digits' ? (DIGITS as string[]) : ALL_LETTERS;
  return {
    script: (SCRIPTS as string[]).includes(v.script) ? v.script : 'grund',
    swings: mode === 'letters' && Array.isArray(v.swings) ? v.swings.filter((s) => swings.some((x) => x.id === s)) : [],
    letters: Array.isArray(v.letters) ? v.letters.filter((l) => allowed.includes(l)) : defaults.letters,
    case: v.case === 'upper' || v.case === 'lower' ? v.case : 'both',
    picture: v.picture !== false,
    word: v.word !== false,
    pics: v.pics === 'own' ? 'own' : 'arasaac',
  };
};

/** A picture several times next to each other (“die sieben Zwerge”), cut to its content. */
async function repeated(src: string, times: number, size = 500): Promise<string> {
  const bitmap = await createImageBitmap(await (await fetch(src)).blob());
  const base = document.createElement('canvas');
  base.width = bitmap.width;
  base.height = bitmap.height;
  const ctx = base.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const data = ctx.getImageData(0, 0, base.width, base.height).data;
  let x0 = base.width, y0 = base.height, x1 = -1, y1 = -1;
  for (let y = 0; y < base.height; y++)
    for (let x = 0; x < base.width; x++) {
      const i = (y * base.width + x) * 4;
      if (data[i + 3] < 12 || (data[i] > 250 && data[i + 1] > 250 && data[i + 2] > 250)) continue;
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
  const box = x1 < 0 ? { x: 0, y: 0, w: base.width, h: base.height } : { x: Math.max(0, x0 - 2), y: Math.max(0, y0 - 2), w: Math.min(base.width - 1, x1 + 2) - Math.max(0, x0 - 2) + 1, h: Math.min(base.height - 1, y1 + 2) - Math.max(0, y0 - 2) + 1 };
  const n = Math.max(1, times), cols = n <= 3 ? n : Math.ceil(n / 2), rows = n <= 3 ? 1 : 2;
  const gap = Math.round(box.w * 0.06), drop = Math.round(box.h * 0.55);
  const w = cols * box.w + (cols - 1) * gap, h = box.h + (rows - 1) * drop, k = Math.min(1, size / Math.max(w, h));
  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(w * k));
  out.height = Math.max(1, Math.round(h * k));
  const g = out.getContext('2d')!;
  g.imageSmoothingQuality = 'high';
  for (let t = 0; t < n; t++) {
    const row = t < cols ? 0 : 1, inRow = row === 0 ? cols : n - cols, at = row === 0 ? t : t - cols;
    const x = ((w - (inRow * box.w + (inRow - 1) * gap)) / 2 + at * (box.w + gap)) * k;
    g.drawImage(base, box.x, box.y, box.w, box.h, x, row * drop * k, box.w * k, box.h * k);
  }
  return out.toDataURL('image/png');
}

export default function LetterSheetDialog({ mode, onClose, onInsert }: { mode: Mode; onClose: () => void; onInsert: (pages: Page[]) => Promise<void> }) {
  const digits = mode === 'digits';
  const [o, setO] = useState<LetterSettings>(() => loadSettings(KEYS[mode], (digits ? DIGIT_DEFAULTS : LETTER_DEFAULTS) as LetterSettings, cleaner(mode)));
  const [fonts, setFonts] = useState(false);
  const [pictures, setPictures] = useState(new Map<number, { id: string }>());
  const { busy, error, insert } = useSheetInsert(onInsert, onClose);
  const set = (v: Partial<LetterSettings>) => setO((old) => ({ ...old, ...v }));
  const toggle = (key: 'swings' | 'letters', id: string) => setO((old) => ({ ...old, [key]: old[key].includes(id) ? old[key].filter((x) => x !== id) : [...old[key], id] }));

  useEffect(() => {
    void Promise.resolve(loadScriptFonts()).then(() => setFonts(true));
  }, []);
  // ARASAAC pictures of the chosen letters (shipped with the app).
  const wanted = (letterPictureList(o) as { id: number; word: string; times?: number }[]);
  const wantedKey = wanted.map((w) => `${w.id}x${w.times ?? 1}`).join(',');
  useEffect(() => {
    let alive = true;
    void Promise.all(
      wanted.map(async (w) => [w.id, { id: w.times && w.times > 1 ? await repeated(`/bilder/${w.id}.webp`, w.times).catch(() => `/bilder/${w.id}.webp`) : `/bilder/${w.id}.webp` }] as const),
    ).then((list) => alive && setPictures(new Map(list)));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantedKey]);

  const pages = useMemo(() => (fonts ? toPages(makeLetterPages(o, o.pics === 'arasaac' ? pictures : undefined), digits ? 'sheet-ziffern' : 'sheet-buchstaben') : []), [o, fonts, pictures, digits]);
  const chip = (l: string) => (
    <button key={l} type="button" aria-pressed={o.letters.includes(l)} className={`sheet-chip sheet-letter${o.letters.includes(l) ? ' is-active' : ''}`} style={{ fontFamily: FAMILY[o.script] }} onClick={() => toggle('letters', l)}>
      {l === 'ß' || digits ? l : o.case === 'lower' ? l.toLowerCase() : o.case === 'upper' ? l : `${l}${l.toLowerCase()}`}
    </button>
  );
  let n = 1;

  return (
    <SheetDialog title={digits ? 'Ziffern üben' : 'Buchstaben üben'} icon={digits ? 'calculator' : 'signature'} pages={pages} busy={busy || !fonts} error={error} onCancel={onClose} onInsert={() => insert(pages, () => saveSettings(KEYS[mode], o))}>
      <div className="sheet-opts">
        <Section title={`${n++}. Schrift`}>
          <div className="sheet-chips sheet-scripts" role="radiogroup" aria-label="Schrift">
            {SCRIPT_LABELS.map(([id, label]) => (
              <button key={id} type="button" role="radio" aria-checked={o.script === id} className={`sheet-chip sheet-level${o.script === id ? ' is-active' : ''}`} onClick={() => set({ script: id })}>
                <span>{label}</span>
                <small style={{ fontFamily: FAMILY[id], fontSize: 20, opacity: 1 }}>{digits ? '1 2 3' : 'Aa Bb'}</small>
              </button>
            ))}
          </div>
        </Section>
        {!digits && (
          <Section title={`${n++}. Schwungübungen`}>
            <div className="sheet-swings">
              {swings.map((s) => (
                <button key={s.id} type="button" aria-pressed={o.swings.includes(s.id)} className={`sheet-chip sheet-swing${o.swings.includes(s.id) ? ' is-active' : ''}`} onClick={() => toggle('swings', s.id)}>
                  <svg width="30" height="28" viewBox="0 0 30 28" aria-hidden="true">
                    <path d={(SWING_PATHS as Record<string, string>)[s.id]} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {s.label}
                </button>
              ))}
            </div>
          </Section>
        )}
        <Section title={`${n++}. ${digits ? 'Ziffern' : 'Buchstaben'}`}>
          <div className="sheet-quick">
            {digits ? (
              <>
                <button type="button" className="sheet-link" onClick={() => set({ letters: [...(DIGITS as string[])] })}>0 bis 9</button>
                <button type="button" className="sheet-link" onClick={() => set({ letters: [] })}>Keine</button>
              </>
            ) : (
              <>
                <button type="button" className="sheet-link" onClick={() => set({ letters: [...(LETTERS_VOWELS as string[])] })}>Vokale</button>
                <button type="button" className="sheet-link" onClick={() => set({ letters: [...(LETTERS_AZ as string[])] })}>A bis Z</button>
                <button type="button" className="sheet-link" onClick={() => set({ letters: [] })}>Keine</button>
              </>
            )}
          </div>
          {digits ? (
            <div className="sheet-letters">{(DIGITS as string[]).map(chip)}</div>
          ) : (
            <>
              <div className="sheet-letters">{(LETTERS_AZ as string[]).map(chip)}</div>
              <div className="sheet-letters">{(LETTERS_UMLAUT as string[]).map(chip)}</div>
              <div className="sheet-letters">{(LETTERS_SOUNDS as string[]).map(chip)}</div>
              <Chips label="Groß- und Kleinbuchstaben" value={o.case} onChange={(c) => set({ case: c })} options={[{ value: 'upper', label: 'Großbuchstaben' }, { value: 'lower', label: 'Kleinbuchstaben' }, { value: 'both', label: 'Groß und klein' }]} />
            </>
          )}
        </Section>
        <Section title={`${n++}. Auf jeder ${digits ? 'Ziffernseite' : 'Buchstabenseite'}`}>
          <div className="sheet-stack">
            <Toggle
              checked={o.picture}
              label={digits ? 'Mengenbild mit Zahlwort' : 'Anlautbild mit Wort'}
              hint={digits ? 'Ein Bild mit so vielen Dingen, wie die Ziffer sagt (4: Pferd mit vier Beinen), dazu ein Zehnerfeld.' : 'Ein Bild, dessen Name mit dem Buchstaben anfängt. Fehlt eins, tippst du später auf den Platzhalter.'}
              onChange={(picture) => set({ picture })}
            />
            {o.picture && (
              <div className="sheet-indent">
                <Chips label="Bilder" value={o.pics} onChange={(pics) => set({ pics })} options={[{ value: 'arasaac', label: 'ARASAAC-Piktogramme' }, { value: 'own', label: 'Eigene Zeichnungen' }]} />
                {o.pics === 'arasaac' && <p className="sheet-note">Piktogramme von ARASAAC (Sergio Palao, CC BY-NC-SA 4.0) – sie sind in der App enthalten und kommen mit ins Heft.</p>}
              </div>
            )}
            <Toggle checked={o.word} label={digits ? 'Zahlwort zum Abschreiben' : 'Wort zum Abschreiben'} hint={digits ? 'Das Zahlwort (z. B. „vier“) am Anfang der letzten Zeile.' : 'Das Anlautwort am Anfang der letzten Zeile.'} onChange={(word) => set({ word })} />
          </div>
        </Section>
      </div>
      <Preview
        pages={pages}
        empty={fonts ? `Wähle mindestens ${digits ? 'eine Ziffer' : 'einen Buchstaben oder eine Schwungübung'} aus.` : 'Die Schriften werden geladen …'}
        hint={digits ? 'Jede Ziffernseite: groß nachspuren, in der Lineatur nachspuren, dann selbst weiterschreiben – mit dem Stift.' : 'Jede Buchstabenseite: groß nachspuren, in der Lineatur nachspuren, dann selbst weiterschreiben – mit dem Stift.'}
      />
    </SheetDialog>
  );
}
