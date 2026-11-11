/* eslint-disable @next/next/no-img-element -- School-owned media. */
'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { LearningSettings } from '@/lib/learning/catalog';
import { alphabetKeys, practiceWords, upperGerman } from '@/lib/learning/alphabet';
import { fonts } from '@/lib/notebook-model';
import AudioDialog from '../AudioDialog';
export default function AlphabetOptions({ settings: c, onChange, upload, busy }: {
  settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void;
  upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean;
}) {
  const [selected, setSelected] = useState('a');
  const [record, setRecord] = useState<{ label: string; done: (src: string) => void } | null>(null);
  const base = alphabetKeys.find(key => key.id === selected)!;
  const custom = c.alphabetKeys?.find(key => key.id === selected);
  const variants = base.variants.map((variant, i) => ({ ...variant, ...custom?.variants[i] }));
  function variantChange(i: number, patch: { word?: string; image?: string; audio?: string }) {
    const values = variants.map((variant, n) => {
      const v = n === i ? { ...variant, ...patch } : variant;
      return { word: v.word, ...(v.image ? { image: v.image } : {}), ...(v.audio ? { audio: v.audio } : {}) };
    });
    onChange({ alphabetKeys: [...(c.alphabetKeys || []).filter(key => key.id !== selected), { id: selected, variants: values }] });
  }
  const mediaInput = (accept: string, label: string, done: (src: string) => void) => <label className="knopf compact">{label}<input className="visually-hidden" type="file" accept={accept} disabled={busy} aria-label={label} onChange={event => {
    const file = event.target.files?.[0]; if (file) void upload(file, done); event.target.value = '';
  }} /></label>;
  const words = Array.from(new Set(practiceWords(c)));
  function promptChange(word: string, patch: { image?: string; audio?: string }) {
    const old = c.alphabetPrompts?.find(p => p.word === word);
    onChange({ alphabetPrompts: [...(c.alphabetPrompts || []).filter(p => p.word !== word && words.includes(p.word)), { ...old, word, ...patch }] });
  }
  return <fieldset className="alphabet-options" disabled={busy}>
    <fieldset><legend>Anlaut-Tastatur</legend>
      <label className="property-label">Betriebsart<select aria-label="Betriebsart der Anlaut-Tastatur" value={c.alphabetPractice ? 'practice' : 'free'} onChange={e => onChange({ alphabetPractice: e.target.value === 'practice' })}><option value="free">Freies Schreiben</option><option value="practice">Wörter üben</option></select></label>
      <label className="property-label">Tabelle<select aria-label="Anlauttabelle" value={c.alphabetTable || 'basic'} onChange={e => onChange({ alphabetTable: e.target.value as 'basic' | 'full' })}><option value="basic">Erste Tabelle · 35 Tasten</option><option value="full">Ganze Tabelle · 44 Tasten</option></select></label>
      <label className="property-label">Anordnung<select aria-label="Tastenanordnung" value={c.alphabetLayout || 'abc'} onChange={e => onChange({ alphabetLayout: e.target.value as 'abc' | 'qwertz' })}><option value="abc">ABC</option><option value="qwertz">QWERTZ</option></select></label>
      <label className="property-label">Buchstaben<select aria-label="Buchstaben der Anlaut-Tastatur" value={c.alphabetLetters || 'both'} onChange={e => onChange({ alphabetLetters: e.target.value as 'both' | 'lower' | 'upper' })}><option value="both">Groß und klein · mit Umschalttaste</option><option value="lower">Nur klein</option><option value="upper">Nur GROSS</option></select></label>
      <label className="property-label">Schrift<select aria-label="Schrift der Anlaut-Tastatur" value={c.font || 'Andika'} onChange={e => onChange({ font: e.target.value })}>{Object.entries(fonts).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label><input type="checkbox" checked={c.alphabetVowels !== false} onChange={e => onChange({ alphabetVowels: e.target.checked })} /> Selbstlaute rot markieren</label>
      <label><input type="checkbox" checked={c.alphabetSpeech !== false} onChange={e => onChange({ alphabetSpeech: e.target.checked })} /> Tastenklang einschalten</label>
      <p>Eigene Lautaufnahme hat Vorrang. Ohne Aufnahme wird das Bildwort von der Geräte-Stimme gesprochen. Gedrückt halten erklärt die Taste, ohne zu schreiben.</p>
      {c.alphabetPractice && <label className="property-label">Wortvorgabe<select aria-label="Wortvorgabe" value={c.alphabetPrompt || 'word'} onChange={e => onChange({ alphabetPrompt: e.target.value as 'word' | 'image' | 'both' | 'audio' })}><option value="word">Wort</option><option value="image">Bild</option><option value="both">Wort und Bild</option><option value="audio">Nur hören</option></select></label>}
    </fieldset>
    <details><summary>Tastenbilder und Laute anpassen</summary>
      <label className="property-label">Taste<select aria-label="Anlauttaste bearbeiten" value={selected} onChange={e => setSelected(e.target.value)}>{alphabetKeys.map(key => <option value={key.id} key={key.id}>{upperGerman(key.id)} · {key.variants.map(v => v.word).join(' / ')}</option>)}</select></label>
      {variants.map((variant, i) => <fieldset key={`${selected}-${i}`}><legend>{upperGerman(selected)} · {variant.hint || variant.word}</legend>
        <label className="property-label">Bildwort<input aria-label={`Bildwort ${selected} ${i + 1}`} maxLength={80} required value={variant.word} onChange={e => variantChange(i, { word: e.target.value })} /></label>
        {variant.image ? <img className="alphabet-config-image" src={variant.image} alt={variant.word} /> : <span aria-hidden="true">{variant.symbol}</span>}
        <div className="learning-actions">{mediaInput('image/png,image/jpeg,image/webp', `Bild für ${selected} ${i + 1} wählen`, image => variantChange(i, { image }))}
          {variant.image && <button type="button" className="knopf compact" onClick={() => variantChange(i, { image: '' })}>Eigenes Bild entfernen</button>}
          {mediaInput('audio/*', `Laut für ${selected} ${i + 1} wählen`, audio => variantChange(i, { audio }))}
          <button type="button" className="knopf compact" onClick={() => setRecord({ label: `${upperGerman(selected)} · ${variant.word}`, done: audio => variantChange(i, { audio }) })}>Laut aufnehmen</button>
          {variant.audio && <><audio controls src={variant.audio} preload="none" /><button type="button" className="knopf compact" onClick={() => variantChange(i, { audio: '' })}>Eigenen Laut entfernen</button></>}
        </div>
      </fieldset>)}
      <button type="button" className="knopf compact" onClick={() => onChange({ alphabetKeys: (c.alphabetKeys || []).filter(key => key.id !== selected) })}>Diese Taste zurücksetzen</button>
    </details>
    {c.alphabetPractice && <details><summary>Bilder und Ton für Übungswörter</summary>
      <p>Ohne eigenes Wortbild wird ein passendes Tastenbild verwendet, sofern vorhanden. Für „Nur hören“ kann eine eigene Wortaufnahme hinterlegt werden.</p>
      {words.map((word, i) => { const prompt = c.alphabetPrompts?.find(p => p.word === word); return <fieldset key={`${word}-${i}`}><legend>{word}</legend>
        {prompt?.image && <img className="alphabet-config-image" src={prompt.image} alt={word} />}
        <div className="learning-actions">{mediaInput('image/png,image/jpeg,image/webp', `Wortbild für ${word} wählen`, image => promptChange(word, { image }))}
          {mediaInput('audio/*', `Wortaufnahme für ${word} wählen`, audio => promptChange(word, { audio }))}
          {prompt?.audio && <audio controls src={prompt.audio} preload="none" />}
          {prompt && <button type="button" className="knopf compact" onClick={() => onChange({ alphabetPrompts: (c.alphabetPrompts || []).filter(p => p.word !== word) })}>Wortmedien entfernen</button>}
        </div>
      </fieldset>; })}
    </details>}
    {record && createPortal(<div className="alphabet-recording"><p className="alphabet-recording-label">Laut aufnehmen: {record.label}. Bitte nur den Laut sprechen.</p><AudioDialog bookId="" onClose={() => setRecord(null)} onAudio={src => { record.done(src); setRecord(null); }} /></div>, document.body)}
  </fieldset>;
}
