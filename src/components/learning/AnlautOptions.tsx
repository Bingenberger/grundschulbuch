'use client';
// Settings of the “Anlaut-Tastatur”, like the dialog of the reference:
// keys, pictures of the keys, practising words.
import { useState } from 'react';
import Icon from '../Icon';
import { Choices } from '../ui/Choice';
import { TextGlyph } from '../ui/Glyphs';
import { uploadImage } from '@/lib/client-api';
import { cleanAnlaut } from '@/lib/reference/anlaut';
import { safeAnlautAsset } from '@/lib/reference/anlaut-defaults';
import defaults from '@/lib/reference/anlaut-keys.json';
import { decodeMaps, encodeMaps } from '@/lib/reference/keys';

type Key = { word: string; img?: string; alt?: { word: string; img?: string } };
type Anlaut = {
  table: 'basic' | 'full'; layout: 'abc' | 'qwertz'; letters: 'both' | 'lower' | 'upper'; font: string; vowels: boolean; speak: 'sound' | 'none'; syllables: boolean; pairs: boolean;
  keys: Record<string, Key>; sounds: Record<string, string>; voice?: unknown;
  practice?: { words: { w: string; img?: string }[]; show: 'word' | 'picture' | 'both' | 'hear'; random: boolean; strictCase: boolean };
};
const BASIC = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'qu', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ä', 'ö', 'ü', 'ß', 'sch', 'ch', 'ei', 'au', 'eu'];
const FULL = [...BASIC, 'äu', 'ie', 'sp', 'st', 'pf', 'ng', 'ck', 'tz', 'ai'];
const PAIRS = ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü', 'ch', 'v'];
const VOWEL_NOTE = new Set(['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü']);
const FONTS = [
  { value: 'grund', label: 'Grundschrift', family: 'Playwrite DE Grund' },
  { value: 'druck', label: 'Druckschrift', family: 'Andika' },
  { value: 'andika', label: 'Andika', family: 'Andika' },
  { value: 'nunito', label: 'Nunito', family: 'Nunito' },
  { value: 'schreib', label: 'Schreibschrift VA', family: 'Playwrite DE VA' },
];
const SHOW = [
  { value: 'word' as const, label: 'Wort lesen' },
  { value: 'hear' as const, label: 'Wort anhören' },
  { value: 'both' as const, label: 'Bild und Wort' },
  { value: 'picture' as const, label: 'Nur Bild' },
];
const yesNo = [
  { value: true, label: 'Ja', icon: 'checkmark' as const },
  { value: false, label: 'Nein', icon: 'cancel' as const },
];
const label = (g: string) => (g === 'ß' ? 'ß' : `${g.charAt(0).toUpperCase()}${g.slice(1)} ${g}`);

export default function AnlautOptions({ value, onChange: save }: { value: unknown; onChange: (a: Anlaut) => void }) {
  const a = cleanAnlaut(decodeMaps(value, ['keys', 'sounds']), safeAnlautAsset) as Anlaut;
  const onChange = (next: Anlaut) => save(encodeMaps(next, ['keys', 'sounds']));
  const [tab, setTab] = useState<'keys' | 'pictures' | 'practice'>('keys');
  const [error, setError] = useState('');
  const [words, setWords] = useState((a.practice?.words ?? []).map((w) => w.w).join('\n'));
  const set = (v: Partial<Anlaut>) => onChange({ ...a, ...v });
  const setKey = (g: string, second: boolean, v: Partial<Key>) => {
    const key = a.keys[g] ?? { word: '' };
    set({ keys: { ...a.keys, [g]: second ? { ...key, alt: { word: key.alt?.word ?? '', ...key.alt, ...v } } : { ...key, ...v } } });
  };
  const list = a.table === 'full' ? FULL : BASIC;
  const tiles = list.flatMap((g) => [{ g, second: false }, ...(a.pairs && PAIRS.includes(g) ? [{ g, second: true }] : [])]);
  const practising = !!a.practice;
  const setPractice = (v: Partial<NonNullable<Anlaut['practice']>> | null, text = words) => {
    if (v === null) return set({ practice: undefined });
    const list = text.split('\n').map((w) => w.trim()).filter(Boolean).slice(0, 60).map((w) => ({ w: w.slice(0, 40) }));
    set({ practice: { words: list, show: 'word', random: false, strictCase: false, ...a.practice, ...v } });
  };

  return (
    <div className="monster-options">
      <div className="anlaut-tabs" role="tablist">
        {(
          [
            ['keys', 'Tastatur'],
            ['pictures', 'Bilder'],
            ['practice', practising ? `Üben (${a.practice?.words.length ?? 0})` : 'Üben'],
          ] as const
        ).map(([id, text]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={`sheet-chip${tab === id ? ' is-active' : ''}`} onClick={() => setTab(id)}>
            {text}
          </button>
        ))}
      </div>
      {tab === 'keys' && (
        <>
          <h3>Tasten</h3>
          <Choices label="Tabelle" value={a.table} onChange={(table) => set({ table })} options={[{ value: 'basic', label: 'Erste Tabelle (35 Tasten)', icon: <TextGlyph text="35" /> }, { value: 'full', label: 'Ganze Tabelle (44 Tasten: auch äu, ie, sp, st, pf, ng, ck, tz, ai)', icon: <TextGlyph text="44" /> }]} />
          <Choices label="Anordnung" value={a.layout} onChange={(layout) => set({ layout })} options={[{ value: 'abc', label: 'Nach dem ABC', icon: <TextGlyph text="ABC" /> }, { value: 'qwertz', label: 'Wie eine Computertastatur', icon: <TextGlyph text="QW" /> }]} />
          <Choices label="Buchstaben" value={a.letters} onChange={(letters) => set({ letters })} options={[{ value: 'both', label: 'Groß und klein (M m, mit Taste ⇧)', icon: <TextGlyph text="Mm" /> }, { value: 'lower', label: 'Nur klein (m)', icon: <TextGlyph text="m" /> }, { value: 'upper', label: 'Nur GROSS (M)', icon: <TextGlyph text="M" /> }]} />
          <Choices label="Selbstlaute rot" value={a.vowels} onChange={(vowels) => set({ vowels })} options={yesNo} />
          <p className="option-hint">a e i o u, Umlaute und Zwielaute auf rosa Tasten.</p>
          <Choices label="Zwei Bilder bei Lauten mit zwei Aussprachen" value={a.pairs} onChange={(pairs) => set({ pairs })} options={yesNo} />
          <p className="option-hint">Selbstlaute lang und kurz (Igel – Insel, mit Strich und Punkt wie bei der Silbenmethode), ch wie in Buch und Milch, v wie in Vogel und Vase. Jede Hälfte der Taste hat ihren eigenen Laut.</p>
          <h3>Schrift</h3>
          <Choices label="Schrift" value={a.font} onChange={(font) => set({ font })} options={FONTS.map((f) => ({ value: f.value, label: f.label, icon: <TextGlyph text="Aa" font={f.family} /> }))} />
          <Choices label="Geschriebenes Wort in Silben blau und rot" value={a.syllables} onChange={(syllables) => set({ syllables })} options={yesNo} />
          <h3>Sprachausgabe</h3>
          <Choices label="Sprachausgabe" value={a.speak} onChange={(speak) => set({ speak })} options={[{ value: 'sound', label: 'Laute sprechen', icon: 'speaker' }, { value: 'none', label: 'Stumm', icon: 'cancel' }]} />
          <p className="option-hint">
            {a.speak === 'none'
              ? 'Die Tastatur schreibt nur: Die Tasten sind stumm, der Knopf „Vorlesen“ fehlt, langes Drücken schreibt wie ein Tipp, Rückmeldungen beim Üben kommen ohne Stimme. Nur ein Übungswort zum Hören („Hör zu“, „Wort anhören“) wird vorgelesen.'
              : 'Jede Taste spricht ihren Laut (mitgelieferte Aufnahmen). Das ganze Wort liest die Tastatur erst vor, wenn das Kind auf den runden Knopf „Vorlesen“ am Ende der Zeile tippt. Eine Taste lange gedrückt halten sagt „M wie Maus“, ohne zu schreiben.'}
          </p>
        </>
      )}
      {tab === 'pictures' && (
        <>
          <p className="option-hint">Wort und Bild jeder Taste. Am besten passen sie zu den Anlautbildern eurer Fibel. Tippe auf ein Bild, um ein anderes zu wählen.</p>
          {error && <p className="sheet-warn">{error}</p>}
          <div className="anlaut-keygrid">
            {tiles.map(({ g, second }) => {
              const key = a.keys[g];
              const entry = second ? key?.alt : key;
              const original = (defaults as Record<string, Key>)[g];
              const before = second ? original?.alt : original;
              const note = second ? (VOWEL_NOTE.has(g) ? '• kurz' : ` ${second ? 2 : 1}`) : a.pairs && PAIRS.includes(g) ? (VOWEL_NOTE.has(g) ? '— lang' : ' 1') : '';
              const name = `${label(g)}${note ? ` ${note}` : ''}`;
              return (
                <div key={`${g}${second ? 2 : 1}`} className={`anlaut-keytile${second ? ' is-second' : ''}`}>
                  <label className="anlaut-keypic" title="Anderes Bild">
                    {entry?.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.img} alt="" />
                    ) : (
                      <Icon name="picture" />
                    )}
                    <input
                      className="visually-hidden"
                      type="file"
                      accept="image/*"
                      aria-label={`Anderes Bild für ${name}`}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (!file) return;
                        try {
                          setError('');
                          setKey(g, second, { img: await uploadImage(file) });
                        } catch (err) {
                          setError((err as Error).message);
                        }
                      }}
                    />
                  </label>
                  <b>{name}</b>
                  <input value={entry?.word ?? ''} aria-label={`Wort für ${name}`} maxLength={40} onChange={(e) => setKey(g, second, { word: e.target.value })} />
                  {before && (entry?.word !== before.word || entry?.img !== before.img) && (
                    <button type="button" className="sheet-link" onClick={() => setKey(g, second, { word: before.word, img: before.img })}>
                      Wie vorher
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      {tab === 'practice' && (
        <>
          <Choices label="Wörter üben" value={practising} onChange={(on) => setPractice(on ? {} : null)} options={yesNo} />
          <p className="option-hint">{practising ? 'Die Kinder schreiben die Wörter der Reihe nach, mit einem Stern für jedes richtige Wort.' : 'Aus: freies Schreiben mit der Tastatur.'}</p>
          {practising && (
            <>
              <Choices label="So wird das Wort gezeigt" value={a.practice!.show} onChange={(show) => setPractice({ show })} options={SHOW.map((s) => ({ value: s.value, label: s.label, icon: s.value === 'hear' ? 'speaker' : s.value === 'word' ? <TextGlyph text="Wort" /> : 'picture' }))} />
              <Choices label="Gemischte Reihenfolge" value={a.practice!.random} onChange={(random) => setPractice({ random })} options={yesNo} />
              <Choices label="Groß- und Kleinschreibung zählt" value={a.practice!.strictCase && a.letters === 'both'} onChange={(strictCase) => setPractice({ strictCase })} options={yesNo} />
              <p className="option-hint">{a.letters === 'both' ? 'Nein: „mama“ ist für „Mama“ auch richtig.' : `Die Tastatur schreibt nur ${a.letters === 'upper' ? 'GROSSBUCHSTABEN' : 'kleine Buchstaben'} – so stehen auch die Wörter da.`}</p>
              <label className="property-label">
                Eigene Wörter
                <textarea rows={6} value={words} placeholder={'Ein Wort pro Zeile, z. B.\nRoller\nMelone'} onChange={(e) => { setWords(e.target.value); setPractice({}, e.target.value); }} />
              </label>
              {!a.practice!.words.length && <p className="option-hint">Noch keine Wörter – schreibe eigene, ein Wort pro Zeile.</p>}
              {(a.practice!.show === 'picture' || a.practice!.show === 'both') && <p className="option-hint">Bilder zu den Wörtern lassen sich hier noch nicht wählen – ohne Bild zeigt die Übung das Wort.</p>}
            </>
          )}
        </>
      )}
    </div>
  );
}
