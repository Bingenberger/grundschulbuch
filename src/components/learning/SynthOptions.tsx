'use client';
// Settings of “Silben verbinden”, like the dialog of the reference.
import { useState } from 'react';
import Icon from '../Icon';
import { ChoiceButton, Choices, OptionGroup } from '../ui/Choice';
import { TextGlyph } from '../ui/Glyphs';

import { casing, cleanSynth, pickSyllables, sayPart, splitLetters, stretchable, syllablePairs } from '@/lib/reference/synth';
import { MONSTER_CASES, letterProblem } from '@/lib/reference/monster';
import { safeRecording, shippedSound, shippedSyllable, withRecordings } from '@/lib/reference/recordings';
import { lc, dc } from '@/lib/reference/runtime';
import { decodeMaps, encodeMaps } from '@/lib/reference/keys';

type Synth = { letters: string; case: 'lower' | 'upper' | 'mixed'; font: 'andika' | 'druck' | 'grund'; syls: [string, string][]; sound: boolean; read: boolean; tts?: boolean; say?: [string, string][] };
const VOWELS = ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü', 'ei', 'au', 'eu', 'ie'];
const CONSONANTS = ['m', 'l', 's', 'r', 'n', 't', 'f', 'h', 'w', 'b', 'd', 'g', 'k', 'p', 'j', 'z', 'v', 'sch', 'pf', 'qu'];
const FONTS = [
  { value: 'andika' as const, label: 'Andika', family: 'Andika, sans-serif' },
  { value: 'druck' as const, label: 'Druckschrift', family: 'Andika, sans-serif' },
  { value: 'grund' as const, label: 'Grundschrift', family: '"Playwrite DE Grund", Andika, sans-serif' },
];
const yesNo = [
  { value: true, label: 'Ja', icon: 'checkmark' as const },
  { value: false, label: 'Nein', icon: 'cancel' as const },
];

export default function SynthOptions({ value, onChange }: { value: unknown; onChange: (s: Synth) => void }) {
  const s = cleanSynth(decodeMaps(value, ['sounds', 'voice']), (v: unknown) => (safeRecording(v) ? v : undefined)) as Synth;
  const [say, setSay] = useState<[string, string][]>(s.say ?? []);
  const letters = splitLetters(s.letters) as string[];
  const problem = letterProblem(letters) as string;
  const possible = problem ? 0 : (syllablePairs(letters) as unknown[]).length;
  const most = Math.min(12, possible);
  const save = (next: Synth) => onChange(encodeMaps(withRecordings(next), ['sounds', 'voice']));
  const remake = (next: Partial<Synth>) => {
    const o = { ...s, ...next };
    const ls = splitLetters(o.letters) as string[];
    const max = Math.min(12, letterProblem(ls) ? 0 : (syllablePairs(ls) as unknown[]).length);
    const count = Math.max(1, Math.min(next.syls ? next.syls.length : s.syls.length || 8, max || 1));
    save({ ...o, syls: letterProblem(ls) ? [] : (pickSyllables(ls, count) as [string, string][]) });
  };
  const toggle = (l: string) => remake({ letters: (letters.includes(l) ? letters.filter((x) => x !== l) : [...letters, l]).join(' ') });
  const listen = (a: string, b: string) => {
    dc();
    const rec = s.tts ? undefined : shippedSyllable(a, b);
    void (rec ? lc('', rec) : lc(sayPart(a + b, s.say)));
  };
  const family = FONTS.find((f) => f.value === s.font)?.family;
  const firsts = [...new Set(s.syls.map(([a]) => a))];
  const shipped = firsts.filter((a) => shippedSound(a));
  const voiceOnly = firsts.filter((a) => !shippedSound(a));
  const chips = (list: string[]) => (
    <div className="monster-letters" role="group">
      {list.map((l) => (
        <button key={l} type="button" aria-pressed={letters.includes(l)} className={`sheet-chip${letters.includes(l) ? ' is-active' : ''}${(stretchable as Set<string>).has(l) ? ' synth-stretch' : ''}`} onClick={() => toggle(l)}>
          {l}
        </button>
      ))}
    </div>
  );
  const setPairs = (pairs: [string, string][]) => {
    setSay(pairs);
    const ready = pairs.filter(([a, b]) => a.trim() && b.trim());
    save({ ...s, say: ready.length ? ready : undefined });
  };

  return (
    <div className="monster-options">
      <section>
        <h3>Diese Buchstaben kennen die Kinder schon</h3>
        <p className="option-hint">
          Das Kind zieht den ersten Buchstaben langsam zum zweiten und spricht dabei den Laut lang („mmmm–a“). Am leichtesten sind Laute, die man dehnen kann – sie sind <span className="synth-stretch-note">grün umrandet</span>: m, l, s, f, r, n, w, sch.
        </p>
        <h4>Selbstlaute</h4>
        {chips(VOWELS)}
        <h4>Mitlaute</h4>
        {chips(CONSONANTS)}
        <label className="property-label">
          Buchstaben
          <input value={s.letters} aria-label="Gelernte Buchstaben" placeholder="z. B. m l s a o i" maxLength={200} onChange={(e) => remake({ letters: e.target.value })} />
        </label>
        <p className={problem ? 'sheet-warn' : 'option-hint'}>{problem || `Daraus lassen sich ${possible} verschiedene Silben bilden.`}</p>
      </section>
      <Choices
        label="Wie viele Silben?"
        value={Math.max(1, s.syls.length)}
        onChange={(n) => {
          const ls = splitLetters(s.letters) as string[];
          save({ ...s, syls: pickSyllables(ls, n) as [string, string][] });
        }}
        options={Array.from({ length: Math.max(1, most) }, (_, i) => i + 1).map((v) => ({ value: v, label: v === 1 ? '1 Silbe' : `${v} Silben`, icon: <TextGlyph text={String(v)} /> }))}
      />
      {most < 12 && !problem && <p className="option-hint">Mit diesen Buchstaben gehen höchstens {most} verschiedene Silben.</p>}
      <Choices label="Schreibweise" value={s.case} onChange={(c) => save({ ...s, case: c })} options={(MONSTER_CASES as { id: Synth['case']; label: string }[]).map((c) => ({ value: c.id, label: c.label, icon: <TextGlyph text={c.label.split(':')[1]?.trim().slice(0, 2) || 'mo'} /> }))} />
      <Choices label="Schrift" value={s.font} onChange={(font) => save({ ...s, font })} options={FONTS.map((f) => ({ value: f.value, label: f.label, icon: <TextGlyph text="Aa" font={f.family.split(',')[0].replace(/"/g, '')} /> }))} />
      <section>
        <OptionGroup label="Die Silben">
          <ChoiceButton icon="synchronize" label="Andere Silben" disabled={!!problem} onClick={() => remake({})} />
        </OptionGroup>
        {s.syls.length && !problem ? (
          <ul className="monster-preview">
            {s.syls.map(([a, b], i) => (
              <li key={`${a}${b}${i}`}>
                <button type="button" className="monster-listen" title="Anhören" aria-label={`${a}${b} anhören`} onClick={() => listen(a, b)}>
                  <span className="synth-parts" style={{ fontFamily: family }}>
                    <b className="synth-a">{casing(a, s.case, true)}</b> + <b className="synth-b">{casing(b, s.case, false)}</b>
                  </span>
                  <span className="monster-name" style={{ fontFamily: family }}>{casing(a + b, s.case, true)}</span>
                  <Icon name="speaker" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="option-hint">{problem || 'Noch keine Silben.'}</p>
        )}
        {s.syls.length > 0 && !problem && <p className="option-hint">Die Reihenfolge ist zufällig. Tippe auf eine Silbe, um sie zu hören.</p>}
      </section>
      <Choices label="Ersten Laut beim Ziehen vorsprechen" value={s.sound} onChange={(sound) => save({ ...s, sound })} options={yesNo} />
      <p className="option-hint">
        {s.sound
          ? [shipped.length ? `Mitgelieferte Laute: ${shipped.join(', ')}.` : '', voiceOnly.length ? `Nur ungefähr mit der Computerstimme: ${voiceOnly.join(', ')}.` : ''].filter(Boolean).join(' ')
          : 'Aus: Das Kind spricht den Laut selbst, während es zieht – so ist die Übung gedacht.'}
      </p>
      <Choices label="Silbe nach dem Verbinden vorlesen" value={s.read} onChange={(read) => save({ ...s, read })} options={yesNo} />
      <p className="option-hint">Zur Kontrolle: Das Kind liest die Silbe, dann hört es sie.</p>
      {s.read && (
        <>
          <Choices label="Die Silben liest" value={s.tts ? 'tts' : 'rec'} onChange={(v) => save({ ...s, tts: v === 'tts' })} options={[{ value: 'rec', label: 'Aufnahmen', icon: 'audio_file' }, { value: 'tts', label: 'Computerstimme', icon: 'speaker' }]} />
          <p className="option-hint">{s.tts ? 'Die Computerstimme des Geräts liest die Silben – wie sie klingt, lässt sich unten verbessern.' : 'Mitgelieferte Aufnahmen der Silben (wo keine dabei ist, liest die Computerstimme).'}</p>
        </>
      )}
      {s.read && s.tts && (
        <section>
          <h3>Aussprache verbessern</h3>
          <p className="option-hint">Liest die Computerstimme eine Silbe falsch, schreib hier, wie sie klingen soll – z. B. „sir“ → „sihr“. Ein langer Selbstlaut bekommt ein h (leh, mahl), ein kurzer einen doppelten Mitlaut (lomm). Die häufigsten Fälle korrigiert das Heft schon selbst.</p>
          {say.map(([a, b], i) => (
            <div key={i} className="monster-say">
              <input value={a} aria-label="Silbe" placeholder="Silbe, z. B. sir" onChange={(e) => setPairs(say.map((p, k) => (k === i ? [e.target.value.toLowerCase().slice(0, 24), p[1]] : p)))} />
              <span aria-hidden="true">→</span>
              <input value={b} aria-label="So spricht die Stimme" placeholder="so sprechen, z. B. sihr" onChange={(e) => setPairs(say.map((p, k) => (k === i ? [p[0], e.target.value.slice(0, 40)] : p)))} />
              <button type="button" className="knopf compact" aria-label="Anhören" disabled={!(b || a).trim()} onClick={() => void lc((b || a).trim())}>
                <Icon name="speaker" />
              </button>
              <button type="button" className="knopf compact" aria-label="Korrektur löschen" onClick={() => setPairs(say.filter((_, k) => k !== i))}>
                <Icon name="cancel" />
              </button>
            </div>
          ))}
          <ChoiceButton icon="plus" label="Korrektur dazu" disabled={say.length >= 40} onClick={() => setSay([...say, ['', '']])} />
        </section>
      )}
    </div>
  );
}
