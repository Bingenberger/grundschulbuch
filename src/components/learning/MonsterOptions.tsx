'use client';
// Settings of “Monsternamen lesen”, like the dialog of the reference.
import { useState } from 'react';
import Icon from '../Icon';
import { Choices } from './OptionControls';
import { TextGlyph } from '../ui/Glyphs';
import { MONSTER_CASES, casing, cleanMonster, letterProblem, monsterPicture, nameCount, newLooks, partColor, pickNames, sayName, sayPart, splitLetters } from '@/lib/reference/monster';
import { speakAndWait, stopSpeaking } from '@/lib/speech';

type Monster = { letters: string; count: number; case: 'lower' | 'upper' | 'mixed'; closed: boolean; syl: 2 | 3; font: 'andika' | 'druck' | 'grund'; words: string[][]; looks: number[]; say?: [string, string][] };
const VOWELS = ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü', 'ei', 'au', 'eu', 'ie'];
const CONSONANTS = ['m', 'l', 's', 'r', 'n', 't', 'f', 'h', 'w', 'b', 'd', 'g', 'k', 'p', 'j', 'z', 'v', 'sch', 'pf', 'qu'];
const FONTS: { value: Monster['font']; label: string; family: string }[] = [
  { value: 'andika', label: 'Andika', family: 'Andika, sans-serif' },
  { value: 'druck', label: 'Druckschrift', family: 'Andika, sans-serif' },
  { value: 'grund', label: 'Grundschrift', family: '"Playwrite DE Grund", Andika, sans-serif' },
];

export default function MonsterOptions({ value, onChange }: { value: unknown; onChange: (m: Monster) => void }) {
  const m = cleanMonster(value) as Monster;
  const [say, setSay] = useState<[string, string][]>(m.say ?? []);
  const letters = splitLetters(m.letters) as string[];
  const problem = letterProblem(letters) as string;
  const possible = problem ? 0 : (nameCount(letters, m.closed, m.syl) as number);
  const most = Math.min(8, possible);
  /** New names whenever letters, number, length or ending change. */
  const remake = (next: Partial<Monster>) => {
    const o = { ...m, ...next };
    const ls = splitLetters(o.letters) as string[];
    const max = Math.min(8, letterProblem(ls) ? 0 : nameCount(ls, o.closed, o.syl));
    const count = Math.max(1, Math.min(o.count, max || 1));
    const words = letterProblem(ls) ? [] : (pickNames(ls, count, o.closed, o.syl) as string[][]);
    onChange({ ...o, count, words, looks: words.length === m.words.length ? m.looks : newLooks(words.length), say });
  };
  const setPairs = (pairs: [string, string][]) => {
    setSay(pairs);
    const ready = pairs.filter(([a, b]) => a.trim() && b.trim());
    onChange({ ...m, say: ready.length ? ready : undefined });
  };
  const toggle = (l: string) => remake({ letters: (letters.includes(l) ? letters.filter((x) => x !== l) : [...letters, l]).join(' ') });
  const listen = async (word: string[]) => {
    stopSpeaking();
    for (const part of word) {
      await speakAndWait(sayPart(part, m.say));
      await new Promise((r) => setTimeout(r, 250));
    }
    await speakAndWait(sayName(word, m.say));
  };
  const chips = (list: string[]) => (
    <div className="monster-letters" role="group">
      {list.map((l) => (
        <button key={l} type="button" aria-pressed={letters.includes(l)} className={`sheet-chip${letters.includes(l) ? ' is-active' : ''}`} onClick={() => toggle(l)}>
          {l}
        </button>
      ))}
    </div>
  );
  const family = FONTS.find((f) => f.value === m.font)?.family;

  return (
    <div className="monster-options">
      <section>
        <h3>Diese Buchstaben kennen die Kinder schon</h3>
        <p className="option-hint">Antippen wählt einen Buchstaben aus oder ab – oder tippe sie unten ein (Laute aus mehreren Buchstaben mit Leerzeichen: „sch ei“).</p>
        <h4>Selbstlaute</h4>
        {chips(VOWELS)}
        <h4>Mitlaute</h4>
        {chips(CONSONANTS)}
        <label className="property-label">
          Buchstaben
          <input value={m.letters} aria-label="Gelernte Buchstaben" placeholder="z. B. m a l o i s" maxLength={200} onChange={(e) => remake({ letters: e.target.value })} />
        </label>
        <p className={problem ? 'sheet-warn' : 'option-hint'}>{problem || `Daraus lassen sich ${possible.toLocaleString('de-DE')} verschiedene Namen bilden.`}</p>
      </section>
      <Choices label="Wie viele Monster?" value={m.count} onChange={(count) => remake({ count })} options={Array.from({ length: Math.max(1, most) }, (_, i) => i + 1).map((v) => ({ value: v, label: v === 1 ? '1 Monster' : `${v} Monster`, icon: <TextGlyph text={String(v)} /> }))} />
      {most < 8 && !problem && <p className="option-hint">Mit diesen Buchstaben gehen höchstens {most} verschiedene Namen.</p>}
      <Choices label="Wie lang sind die Namen?" value={m.syl} onChange={(syl) => remake({ syl })} options={[{ value: 2, label: '2 Silben: mo-la', icon: <TextGlyph text="2" /> }, { value: 3, label: '3 Silben: mo-la-si', icon: <TextGlyph text="3" /> }]} />
      <Choices label="Auch eine letzte Silbe mit Mitlaut am Ende" value={m.closed} onChange={(closed) => remake({ closed })} options={[{ value: true, label: 'Ja', icon: 'checkmark' }, { value: false, label: 'Nein', icon: 'cancel' }]} />
      <p className="option-hint">{m.syl === 3 ? 'z. B. ma-lo-mis, ri-su-nel' : 'z. B. ma-lom, ri-sun'}</p>
      <Choices label="Schreibweise" value={m.case} onChange={(c) => onChange({ ...m, case: c })} options={(MONSTER_CASES as { id: Monster['case']; label: string }[]).map((c) => ({ value: c.id, label: c.label, icon: <TextGlyph text={c.label.split(':')[1]?.trim().slice(0, 2) || 'mo'} /> }))} />
      <Choices label="Schrift" value={m.font} onChange={(font) => onChange({ ...m, font })} options={FONTS.map((f) => ({ value: f.value, label: f.label, icon: <TextGlyph text="Aa" font={f.family.split(',')[0].replace(/"/g, '')} /> }))} />
      <section>
        <div className="option-row"><h4>Die Monster und ihre Namen</h4><button type="button" className="knopf compact" disabled={!!problem} onClick={() => remake({ looks: newLooks(m.words.length) })}><Icon name="synchronize" size={18} /> Andere Wörter</button></div>
        {m.words.length && !problem ? (
          <ul className={`monster-preview${m.syl === 3 ? ' is-long' : ''}`}>
            {m.words.map((w, i) => (
              <li key={`${w.join('')}${i}`}>
                <button type="button" className="monster-listen" title="Anhören" aria-label={`${w.join('-')} anhören`} onClick={() => void listen(w)}>
                  <span className="monster-pic" dangerouslySetInnerHTML={{ __html: monsterPicture(m.looks[i] ?? i, 72) }} />
                  <span className="monster-name" style={{ fontFamily: family }}>
                    {w.map((part, k) => (
                      <b key={k} style={{ color: partColor(k) }}>{casing(part, m.case, k === 0)}</b>
                    ))}
                  </span>
                  <Icon name="speaker" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="option-hint">{problem || 'Noch keine Namen.'}</p>
        )}
        {m.words.length > 0 && !problem && <p className="option-hint">Tippe auf einen Namen: Du hörst die Silben und den ganzen Namen so, wie die Kinder sie hören.</p>}
      </section>
      <section>
        <h3>Aussprache verbessern</h3>
        <p className="option-hint">Liest die Computerstimme eine Silbe oder einen Namen falsch, schreib hier, wie sie klingen soll – z. B. „sir“ → „sihr“. Ein langer Selbstlaut bekommt ein h (leh, mahl), ein kurzer einen doppelten Mitlaut (lomm). Die häufigsten Fälle korrigiert das Heft schon selbst.</p>
        {say.map(([a, b], i) => (
          <div key={i} className="monster-say">
            <input value={a} aria-label="Silbe oder Name" placeholder="Silbe oder Name, z. B. sir" onChange={(e) => setPairs(say.map((p, k) => (k === i ? [e.target.value.toLowerCase().slice(0, 24), p[1]] : p)))} />
            <span aria-hidden="true">→</span>
            <input value={b} aria-label="So spricht die Stimme" placeholder="so sprechen, z. B. sihr" onChange={(e) => setPairs(say.map((p, k) => (k === i ? [p[0], e.target.value.slice(0, 40)] : p)))} />
            <button type="button" className="knopf compact" aria-label="Anhören" disabled={!(b || a).trim()} onClick={() => void speakAndWait((b || a).trim())}>
              <Icon name="speaker" />
            </button>
            <button type="button" className="knopf compact" aria-label="Korrektur löschen" onClick={() => setPairs(say.filter((_, k) => k !== i))}>
              <Icon name="cancel" />
            </button>
          </div>
        ))}
        <button type="button" className="knopf compact" disabled={say.length >= 40} onClick={() => setSay([...say, ['', '']])}><Icon name="plus" size={18} /> Korrektur dazu</button>
      </section>
    </div>
  );
}
