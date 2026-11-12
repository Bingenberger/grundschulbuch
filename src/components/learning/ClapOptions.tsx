'use client';
// Settings of “Silben klatschen”, like the dialog of the reference.
import { useState } from 'react';
import Icon from '../Icon';
import { Choices } from '../ui/Choice';
import { TextGlyph } from '../ui/Glyphs';
import { uploadImage } from '@/lib/client-api';
import { cleanClap, splitWord, syllablesOf } from '@/lib/reference/clap';
import { safePicture } from '@/lib/reference/clap-defaults';
import { lc, dc } from '@/lib/reference/runtime';

type Word = { w: string; syl?: string[]; img?: string };
type Clap = { words: Word[]; help: 'none' | 'dots' | 'word'; font: 'andika' | 'druck' | 'grund'; mic: boolean; random: boolean; auto: boolean };
const COLORS = ['#2563eb', '#dc2626'];
const FONTS = [
  { value: 'andika' as const, label: 'Andika', family: 'Andika' },
  { value: 'druck' as const, label: 'Druckschrift', family: 'Andika' },
  { value: 'grund' as const, label: 'Grundschrift', family: 'Playwrite DE Grund' },
];
const yesNo = [
  { value: true, label: 'Ja', icon: 'checkmark' as const },
  { value: false, label: 'Nein', icon: 'cancel' as const },
];
const asText = (w: Word) => (w.syl ? w.syl.join('-') : w.w);

export default function ClapOptions({ value, onChange }: { value: unknown; onChange: (c: Clap) => void }) {
  const c = cleanClap(value, safePicture) as Clap;
  const [texts, setTexts] = useState(() => c.words.map(asText));
  const [fresh, setFresh] = useState('');
  const [error, setError] = useState('');
  const set = (v: Partial<Clap>) => onChange({ ...c, ...v });
  /** “Ba-na-ne” keeps the own syllables; a word alone is split by the notebook. */
  const word = (text: string, img?: string): Word | null => {
    const w = splitWord(text) as { w: string; syl?: string[] } | null;
    return w ? { ...w, ...(img ? { img } : {}) } : null;
  };
  const setWords = (list: string[], imgs: (string | undefined)[]) => {
    setTexts(list);
    const words = list.map((t, i) => word(t, imgs[i])).filter((w): w is Word => !!w);
    if (words.length) set({ words });
  };
  const imgs = c.words.map((w) => w.img);
  const family = FONTS.find((f) => f.value === c.font)?.family;

  return (
    <div className="monster-options">
      <section>
        <h3>
          Die Wörter <span className="option-hint">{texts.length === 1 ? '1 Wort' : `${texts.length} Wörter`} (höchstens 16)</span>
        </h3>
        {error && <p className="sheet-warn">{error}</p>}
        <ul className="clap-list">
          {texts.map((text, i) => {
            const w = word(text);
            const img = imgs[i];
            return (
              <li key={i} className={w ? '' : 'is-bad'}>
                <label className="anlaut-keypic" title="Bild wählen">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" />
                  ) : (
                    <Icon name="picture" />
                  )}
                  <input
                    className="visually-hidden"
                    type="file"
                    accept="image/*"
                    aria-label={`Bild für ${w?.w ?? text} wählen`}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (!file) return;
                      try {
                        setError('');
                        const src = await uploadImage(file);
                        setWords(texts, imgs.map((p, k) => (k === i ? src : p)));
                      } catch (err) {
                        setError((err as Error).message);
                      }
                    }}
                  />
                </label>
                <div className="clap-word">
                  <input value={text} aria-label="Wort, Silben mit Bindestrich" onChange={(e) => setWords(texts.map((t, k) => (k === i ? e.target.value : t)), imgs)} />
                  <span className="clap-syl" style={{ fontFamily: family }}>
                    {w ? (syllablesOf(w) as string[]).map((s, k) => <b key={k} style={{ color: COLORS[k % 2] }}>{s}</b>) : <em>nur ein Wort aus Buchstaben</em>}
                    {w && <small> {(syllablesOf(w) as string[]).length === 1 ? '1 Silbe' : `${(syllablesOf(w) as string[]).length} Silben`}</small>}
                  </span>
                </div>
                <button type="button" className="knopf compact" aria-label="Anhören" disabled={!w} onClick={() => w && (dc(), void lc(w.w))}>
                  <Icon name="speaker" />
                </button>
                {img && (
                  <button type="button" className="knopf compact" aria-label="Bild entfernen" onClick={() => setWords(texts, imgs.map((p, k) => (k === i ? undefined : p)))}>
                    <Icon name="remove_image" />
                  </button>
                )}
                <button type="button" className="knopf compact" aria-label="Wort löschen" disabled={texts.length < 2} onClick={() => setWords(texts.filter((_, k) => k !== i), imgs.filter((_, k) => k !== i))}>
                  <Icon name="cancel" />
                </button>
              </li>
            );
          })}
        </ul>
        <p className="option-hint">Die Silben trennt das Heft selbst. Stimmt eine Trennung nicht, schreib das Wort mit Bindestrichen („Ba-na-ne“). Ein Tipp auf das Bild wählt ein anderes.</p>
        <div className="clap-add">
          <input value={fresh} placeholder="Neues Wort, z. B. Melone" aria-label="Neues Wort" onChange={(e) => setFresh(e.target.value)} />
          <button type="button" className="knopf" disabled={!word(fresh) || texts.length >= 16} onClick={() => { setWords([...texts, fresh.trim()], [...imgs, undefined]); setFresh(''); }}>
            <Icon name="plus" /> Wort dazu
          </button>
        </div>
      </section>
      <h3>Was sehen die Kinder?</h3>
      <Choices label="Hilfe" value={c.help} onChange={(help) => set({ help })} options={[{ value: 'none', label: 'Nur das Bild', icon: 'picture' }, { value: 'dots', label: 'Punkte (einer je Silbe)', icon: <TextGlyph text="• •" /> }, { value: 'word', label: 'Wort in Silbenschrift', icon: <TextGlyph text="Ba" /> }]} />
      <Choices label="Schrift" value={c.font} onChange={(font) => set({ font })} options={FONTS.map((f) => ({ value: f.value, label: f.label, icon: <TextGlyph text="Aa" font={f.family} /> }))} />
      <p className="option-hint">„Silben zeigen“ spricht das Wort und klatscht es vor: Silbe für Silbe mit Bogen und Punkt. „Weiter“ bringt das nächste Bild.</p>
      <h3>Ablauf</h3>
      <Choices label="Zufällige Reihenfolge" value={c.random} onChange={(random) => set({ random })} options={yesNo} />
      <p className="option-hint">Bei jedem Start neu gemischt.</p>
      <Choices label="Wort vorlesen, sobald das Bild kommt" value={c.auto} onChange={(auto) => set({ auto })} options={yesNo} />
      <p className="option-hint">Sonst hören die Kinder es mit „Hören“ neben dem Bild.</p>
      <Choices label="Klatschen mit dem Mikrofon zählen" value={c.mic} onChange={(mic) => set({ mic })} options={yesNo} />
      <p className="option-hint">Knopf „Klatschen“: Das Heft hört zu, zählt das Klatschen und sagt, ob es passt. In einer lauten Klasse zählt es nur ungefähr. Es wird nichts aufgenommen oder gespeichert.</p>
    </div>
  );
}
