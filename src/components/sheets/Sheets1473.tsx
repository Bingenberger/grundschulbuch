/* eslint-disable @next/next/no-img-element -- Generated pictures of the figure and the carpet. */
'use client';
// The settings dialogs of the four worksheets of Lernsachen-Heft 1.47.3
// (Vorlagen › Einstellbar): Rechnen im Alltag, Karopapier, Programmieren:
// Arbeitsblatt and Laute hören – with the choices of the reference's dialogs
// and our sheet parts (exercise cards, levels, pages, preview). The pages come
// from the reference's own generators (lib/sheets/sheets-1473.ts).
import { useEffect, useMemo, useState } from 'react';
import { uuid, type Page } from '@/lib/notebook-model';
import { toPages, type RefPage } from '@/lib/sheets/convert';
import {
  CODING_DEFAULTS, CODING_KINDS, CODING_LEVELS, CODING_WALLS, codingClean, codingPages, GRID_DEFAULTS, GRID_FORMATS, gridClean, gridPages,
  LABEL_COLORS, LABEL_DEFAULTS, LABEL_FONTS, LABEL_SIZES, labelCase, labelFont, labelFontAvailable, labelPages,
  LIFE_DEFAULTS, LIFE_FORMATS, lifeClean, lifePages, PHON_DEFAULTS, PHON_FORMATS, PHON_SOUNDS, phonClean, phonPages,
} from '@/lib/sheets/sheets-1473';
import { CODE_CARPETS, CODE_COSTUMES, carpetPicture, costumePicture } from '@/lib/reference/tools-runtime';
import { onlinePhonPictures, shippedPhonPictures } from '@/lib/sheets/phon-pictures';
import { Chips, FormatCard, PagesSection, Preview, Section, SheetDialog, Toggle, loadSettings, saveSettings, useSheetInsert, type SheetLayout } from './SheetParts';
import { findPicture } from '@/lib/learning/picture-search';
import { talkConfig } from '@/lib/learning/uk';

type Settings = SheetLayout & Record<string, unknown> & { formats?: string[] };
type Format = { id: string; label: string; sample: string; title?: string; hint?: string; online?: boolean };
type Props = { onClose: () => void; onInsert: (pages: Page[]) => Promise<void> };
const svg = (markup: unknown) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(String(markup))}`;

/** One of the four dialogs: exercises (or kind), a level, pages, preview. */
function RefSheet({ title, icon, storage, defaults, clean, make, formats, hint, extra, onClose, onInsert, pictures }: Props & {
  title: string; icon: Parameters<typeof SheetDialog>[0]['icon']; storage: string; defaults: unknown; clean: (v: Settings) => Settings;
  make: (o: Settings, placed: { placed: Set<string> }) => RefPage[]; formats?: Format[]; hint: string; pictures?: number;
  extra?: (o: Settings, set: (v: Partial<Settings>) => void) => React.ReactNode;
}) {
  const [o, setO] = useState<Settings>(() => loadSettings(storage, clean(defaults as Settings), clean));
  const [roll, setRoll] = useState(0);
  const { busy, error, insert } = useSheetInsert(onInsert, onClose);
  const set = (v: Partial<Settings>) => setO((old) => clean({ ...old, ...v } as Settings));
  const [pages, missing] = useMemo(() => {
    const placed = { placed: new Set<string>() };
    const ref = (formats && !o.formats?.length ? [] : make(o, placed)).map((p) => ({ ...p, items: p.items.map((it) => ((it as { asset?: string }).asset && !it.src ? { ...it, src: (it as { asset?: string }).asset } : it)) }));
    return [toPages(ref, `sheet-${storage}`), formats ? (o.formats ?? []).filter((f) => !placed.placed.has(f)).length : 0] as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o, roll, pictures]);
  const toggle = (id: string) => set({ formats: o.formats?.includes(id) ? o.formats.filter((f) => f !== id) : [...(o.formats ?? []), id] });
  return (
    <SheetDialog title={title} icon={icon} pages={pages} busy={busy} error={error} reroll={() => setRoll((r) => r + 1)} onCancel={onClose} onInsert={() => insert(pages, () => saveSettings(storage, o))}>
      <div className="sheet-opts">
        {formats && (
          <Section title="1. Übungen auswählen">
            <div className="sheet-formats">
              {formats.map((f) => <FormatCard key={f.id} on={!!o.formats?.includes(f.id)} label={f.label} sample={f.sample} title={f.title} hint={f.hint ?? (f.online ? 'Bilder aus der Bildersuche' : undefined)} onClick={() => toggle(f.id)} />)}
            </div>
          </Section>
        )}
        {extra?.(o, set)}
        <PagesSection n={formats ? 3 : 4} o={o} set={set} chosen={formats ? (o.formats?.length ?? 0) : 1} missing={missing} />
      </div>
      <Preview pages={pages} hint={hint} />
    </SheetDialog>
  );
}

function level(labels: [string, string, string][]) {
  return function chooseLevel(o: Settings, set: (v: Partial<Settings>) => void) {
    return (
      <Section title="2. Wie schwer?">
        <Chips label="Stufe" value={o.level as string} onChange={(value) => set({ level: value })} options={labels.map(([value, label, sample]) => ({ value, label: `${label} – ${sample}` }))} />
      </Section>
    );
  };
}

export function LifeSheetDialog(props: Props) {
  return <RefSheet {...props} title="Rechnen im Alltag: Lohn, Fahrplan, Geld" icon="calculator" storage="rechnen-im-alltag" defaults={LIFE_DEFAULTS} clean={lifeClean} make={lifePages} formats={LIFE_FORMATS as unknown as Format[]}
    hint="Die Antworten tippt man in die Kästchen – Uhrzeiten mit Punkt oder Doppelpunkt, Geld mit oder ohne €."
    extra={level([['easy', 'Leicht', 'ganze Euro, volle Stunden'], ['hard', 'Schwer', 'Cent, mehrere Tage, über die Stunde']])} />;
}

export function GridSheetDialog(props: Props) {
  return <RefSheet {...props} title="Karopapier: Symmetrie, Muster, Messen" icon="grid" storage="karopapier" defaults={GRID_DEFAULTS} clean={gridClean} make={gridPages} formats={GRID_FORMATS as unknown as Format[]}
    hint="Gemalt und gezeichnet wird mit dem Stift (oder auf Papier) – die Längen tippt man in die Kästchen. Die Kästchen sind 5 mm groß, die Strecken echt lang."
    extra={level([['easy', 'Leicht', 'kleine Figuren, ganze cm'], ['hard', 'Schwer', 'größere Figuren, halbe cm']])} />;
}

export function CodingSheetDialog(props: Props) {
  const kinds = CODING_KINDS as unknown as { value: string; label: string; hint: string }[];
  return <RefSheet {...props} title="Programmieren: Arbeitsblatt" icon="tree_structure" storage="programmieren-arbeitsblatt" defaults={CODING_DEFAULTS} clean={codingClean} make={(o) => codingPages(o)}
    hint="Zwei Aufgaben je Seite. Gelöst wird mit dem Stift – oder ausgedruckt."
    extra={(o, set) => (
      <>
        <Section title="1. Arbeitsblatt">
          <Chips label="Arbeitsblatt" value={o.kind as string} onChange={(kind) => set({ kind })} options={kinds.map((k) => ({ value: k.value, label: k.label }))} />
          <p className="sheet-note">{kinds.find((k) => k.value === o.kind)?.hint}</p>
        </Section>
        {o.kind !== 'cards' && (
          <Section title="2. Wie schwer?">
            <Chips label="Schwierigkeit" value={o.level as string} onChange={(level) => set({ level })} options={CODING_LEVELS as unknown as { value: string; label: string }[]} />
            <Chips label="Teppich" value={o.size as number} onChange={(size) => set({ size })} options={[{ value: 5, label: '5 × 5' }, { value: 6, label: '6 × 6' }]} />
            <Chips label="Hindernisse" value={o.walls as string} onChange={(walls) => set({ walls })} options={CODING_WALLS as unknown as { value: string; label: string }[]} />
          </Section>
        )}
        <Section title="3. Figur und Teppich">
          <div className="listen-picks" role="radiogroup" aria-label="Figur">
            {(CODE_COSTUMES as unknown as { id: string; nom: string }[]).map((c) => (
              <button key={c.id} type="button" role="radio" className="listen-pick" aria-checked={o.costume === c.id} onClick={() => set({ costume: c.id })}><img src={svg(costumePicture(c.id))} alt="" /><small>{c.nom.replace(/^\S+ /, '')}</small></button>
            ))}
          </div>
          <div className="listen-picks" role="radiogroup" aria-label="Aussehen">
            {(CODE_CARPETS as unknown as { id: string; label: string }[]).map((c) => (
              <button key={c.id} type="button" role="radio" className="listen-pick" aria-checked={o.mat === c.id} onClick={() => set({ mat: c.id })}><img src={svg(carpetPicture(c.id))} alt="" /><small>{c.label}</small></button>
            ))}
          </div>
          <p className="sheet-note">Zum Ausdrucken eignet sich „Klassisch“ am besten (wenig Farbe).</p>
        </Section>
      </>
    )} />;
}

export function PhonSheetDialog(props: Props) {
  // Pictures for the words: the Anlaut pictures of the app; others on request from ARASAAC.
  const [pictures, setPictures] = useState<Map<string, unknown>>(new Map());
  const [searching, setSearching] = useState(0);
  useEffect(() => {
    let stop = false;
    void shippedPhonPictures().then((map) => { if (!stop) setPictures(new Map(map)); });
    return () => { stop = true; };
  }, []);
  const more = () => { setSearching(1); void onlinePhonPictures((map, left) => { setPictures(new Map(map)); setSearching(left); }).then(() => setSearching(0)); };
  return <RefSheet {...props} title="Laute hören" icon="headset" storage="laute-hoeren" defaults={PHON_DEFAULTS} clean={phonClean} make={(o, placed) => phonPages(o, pictures, placed)} formats={PHON_FORMATS as unknown as Format[]} pictures={pictures.size}
    hint="Anlaute und Silbenzahlen tippt man in die Kästchen, alles andere mit dem Stift."
    extra={(o, set) => (
      <Section title="2. Welcher Laut?">
        <Chips label="Laut" value={o.sound as string} onChange={(sound) => set({ sound })} options={(PHON_SOUNDS as unknown as string[]).map((s) => ({ value: s, label: s }))} />
        <p className="sheet-note">Bilder: die Anlautbilder des Hefts. Wo kein Bild ist, steht das Wort.</p>
        <button type="button" className="knopf compact" disabled={searching > 0} onClick={more}>{searching > 0 ? `Bilder werden geholt … (noch ${searching})` : 'Weitere Bilder holen (ARASAAC, Internet)'}</button>
      </Section>
    )} />;
}

// Etiketten: cards with picture and word for a list of words – or Sprechtasten.
type LabelSettings = Record<string, unknown> & { grid: string; font: string; textCase: string; word: string; color: string; round: boolean; line: boolean; speak: boolean };
const LABEL_KEY = 'etiketten';
const cleanLabels = (v: LabelSettings): LabelSettings => ({ ...(LABEL_DEFAULTS as unknown as LabelSettings), ...v });
const wordsOf = (text: string) => text.split(/[\n,;]+/).map((w) => w.trim()).filter(Boolean).slice(0, 200);
const pictureCache = new Map<string, string | null>();

/** Reference pages → our pages; the Sprechtasten of “Vorlesen beim Antippen” become our keys. */
function labelPagesToOurs(ref: RefPage[]): Page[] {
  return ref.map((p) => {
    type Item = Omit<RefPage['items'][number], 'type'> & { type: string; kind?: string; label?: string; say?: string; asset?: string; color?: string; noLabel?: boolean; svg?: string };
    const items = p.items as unknown as Item[];
    // Keys are “talk” items; the frames carry the colour placeholder $C of the reference.
    const isKey = (it: Item) => it.type === 'talk' || it.type === 'widget';
    const [page] = toPages([{ ...p, items: items.filter((it) => !isKey(it)).map((it) => ({ ...it, ...(it.asset && !it.src ? { src: it.asset } : {}), ...(it.svg ? { svg: it.svg.replaceAll('$C', it.color || '#1f2937') } : {}) })) as RefPage['items'] }], 'sheet-etiketten');
    const k = 297 / 1400;
    page.elements.push(...items.filter(isKey).map((it) => ({
      id: uuid(), type: 'widget' as const, widgetKind: 'sprechtaste' as const,
      x: it.x * k, y: it.y * k, width: it.w * k, height: it.h * k, rotation: 0, locked: false, color: '#253c42',
      settings: { title: it.label || 'Sprechtaste', talk: talkConfig({ label: it.label, say: it.say, color: it.color, img: it.asset, noLabel: it.noLabel }) as never },
    })));
    return page;
  });
}

export function LabelsSheetDialog({ onClose, onInsert }: Props) {
  const [o, setO] = useState<LabelSettings>(() => loadSettings(LABEL_KEY, cleanLabels(LABEL_DEFAULTS as unknown as LabelSettings), cleanLabels));
  const [text, setText] = useState('Apfel\nBanane\nBirne\nTasse\nTeller\nLöffel');
  const [search, setSearch] = useState(true);
  const [found, setFound] = useState(0);
  const { busy, error, insert } = useSheetInsert(onInsert, onClose);
  const set = (v: Partial<LabelSettings>) => setO((old) => cleanLabels({ ...old, ...v }));
  const words = useMemo(() => wordsOf(text), [text]);
  // Pictures for the words, one after the other through the school server (ARASAAC).
  useEffect(() => {
    if (!search) return;
    let stop = false;
    void (async () => {
      for (const word of words) {
        if (stop) return;
        if (pictureCache.has(word)) continue;
        try { pictureCache.set(word, await findPicture(word, new AbortController().signal)); } catch { pictureCache.set(word, null); }
        if (!stop) setFound((n) => n + 1);
      }
    })();
    return () => { stop = true; };
  }, [words, search]);
  const missing = search ? words.filter((w) => !pictureCache.has(w)).length : 0;
  const pages = useMemo(() => {
    const entries = words.map((w) => ({ text: w, ...(search && pictureCache.get(w) ? { img: pictureCache.get(w)! } : {}) }));
    return entries.length ? labelPagesToOurs(labelPages(entries, o) as RefPage[]) : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, o, search, found]);
  const fonts = (LABEL_FONTS as unknown as string[]).filter((f) => labelFontAvailable(f)).map((f) => ({ value: f, label: (labelFont(f) as { label: string }).label }));
  return (
    <SheetDialog title="Etiketten" icon="bookmark" pages={pages} busy={busy} error={error} reroll={() => setFound((n) => n + 1)} rerollLabel="Neu zeichnen" onCancel={onClose} onInsert={() => insert(pages, () => saveSettings(LABEL_KEY, o))}>
      <div className="sheet-opts">
        <Section title="1. Wörter">
          <textarea className="text-input" rows={6} aria-label="Wörter" value={text} onChange={(e) => setText(e.target.value)} />
          <p className="sheet-note">Ein Wort pro Zeile oder mit Komma getrennt.</p>
          <Toggle checked={search} label="Bilder suchen (ARASAAC)" hint="Über den Schulserver. Ohne Bild steht nur das Wort da." onChange={setSearch} />
          {missing > 0 && <p className="sheet-note">Bilder werden gesucht … (noch {missing})</p>}
        </Section>
        <Section title="2. Größe">
          <Chips label="Größe" value={o.grid} onChange={(grid) => set({ grid })} options={(LABEL_SIZES as unknown as { id: string; label: string; hint: string }[]).map((g) => ({ value: g.id, label: `${g.label} (${g.hint})` }))} />
        </Section>
        <Section title="3. Aussehen">
          <Chips label="Schrift" value={o.font} onChange={(font) => set({ font })} options={fonts} />
          <Chips label="Schreibweise" value={o.textCase} onChange={(textCase) => set({ textCase })} options={[{ value: 'as', label: 'Wie eingegeben' }, { value: 'upper', label: String(labelCase('GROSS', 'upper')) }, { value: 'lower', label: 'klein' }]} />
          <Chips label="Wort" value={o.speak && o.word === 'above' ? 'below' : o.word} onChange={(word) => set({ word })} options={[{ value: 'below', label: 'Wort unten' }, ...(o.speak ? [] : [{ value: 'above', label: 'Wort oben' }]), { value: 'none', label: 'Kein Wort' }]} />
          <div className="mt-colors" role="radiogroup" aria-label="Farbe des Rahmens">
            {(LABEL_COLORS as unknown as string[]).map((c) => <button key={c} type="button" role="radio" aria-checked={o.color === c} aria-label={c} title={c} style={{ background: c }} onClick={() => set({ color: c })} />)}
          </div>
          <Toggle checked={o.round} label="Runde Ecken" onChange={(round) => set({ round })} />
          {!o.speak && <Toggle checked={o.line} label="Linie zwischen Bild und Wort" onChange={(line) => set({ line })} />}
          <Toggle checked={o.speak} label="Vorlesen beim Antippen" hint="Die Etiketten werden Sprechtasten: ein Tipp sagt das Wort." onChange={(speak) => set({ speak })} />
        </Section>
      </div>
      <Preview pages={pages} hint="Zum Ausdrucken und Ausschneiden – oder als Sprechtasten im Heft." empty="Gib mindestens ein Wort ein." />
    </SheetDialog>
  );
}
