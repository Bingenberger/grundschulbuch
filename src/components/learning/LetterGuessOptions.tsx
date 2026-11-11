/* eslint-disable @next/next/no-img-element -- School media. */
'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { LearningSettings } from '@/lib/learning/catalog';
import { guessMedia, guessWord, guessWords, validGuessWord } from '@/lib/learning/letter-guess';
import { fonts } from '@/lib/notebook-model';
import WordBank from './WordBank';
import VoiceOptions from './VoiceOptions';
import AudioDialog from '../AudioDialog';
export default function LetterGuessOptions({ settings: c, onChange, upload, busy }: {
  settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void;
  upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean;
}) {
  const [record, setRecord] = useState<{ word: string; done: (src: string) => void } | null>(null);
  const words = guessWords(c);
  function media(word: string, patch: { image?: string; audio?: string }) {
    const wanted = new Set(words.map(word => word.toLocaleLowerCase('de')));
    onChange({ letterGuessItems: [...(c.letterGuessItems || []).filter(item => wanted.has(guessWord(item.word).toLocaleLowerCase('de')) && guessWord(item.word).toLocaleLowerCase('de') !== word.toLocaleLowerCase('de')), { ...guessMedia(c, word), word, ...patch }] });
  }
  const file = (accept: string, label: string, done: (src: string) => void) => <label className="knopf compact">{label}<input className="visually-hidden" type="file" accept={accept} aria-label={label} onChange={event => { const selected = event.target.files?.[0]; if (selected) void upload(selected, done); event.target.value = ''; }} /></label>;
  return <fieldset className="letter-guess-options" disabled={busy}><legend>Buchstaben raten · Maus und Käse</legend>
    <label className="property-label">Wörter, je eines pro Zeile · bis 20 Wörter<textarea aria-label="Wörter zum Buchstabenraten" value={(c.words || []).join('\n')} onChange={event => onChange({ words: event.target.value.split('\n').slice(0, 20) })} /></label>
    <p>Bis 40 Zeichen pro Wort oder kurzem Ausdruck. Deutsche Buchstaben einschließlich Ä, Ö, Ü und ß, Leerzeichen und Apostrophe sind möglich. Bindestriche aus Silbenlisten werden entfernt.</p>
    {(c.words || []).some(word => word.trim() && !validGuessWord(word)) && <p role="status">Bitte nur Wörter mit den angebotenen Buchstaben verwenden.</p>}
    <WordBank onSelect={words => onChange({ words: words.slice(0, 20) })} />
    <label className="property-label">Erlaubte Fehlversuche<input type="number" min={4} max={12} aria-label="Fehlversuche beim Buchstabenraten" value={c.letterGuessLives || 8} onChange={event => onChange({ letterGuessLives: Math.max(4, Math.min(12, Math.round(Number(event.target.value) || 8))) })} /></label>
    <label className="property-label">Buchstaben<select aria-label="Buchstaben beim Raten" value={c.letterGuessCase || 'upper'} onChange={event => onChange({ letterGuessCase: event.target.value as 'upper' | 'lower' })}><option value="upper">GROSS</option><option value="lower">klein</option></select></label>
    <label className="property-label">Anordnung<select aria-label="Anordnung beim Buchstabenraten" value={c.letterGuessLayout || 'abc'} onChange={event => onChange({ letterGuessLayout: event.target.value as 'abc' | 'qwertz' })}><option value="abc">ABC</option><option value="qwertz">QWERTZ</option></select></label>
    <label className="property-label">Hinweis<select aria-label="Hinweis beim Buchstabenraten" value={c.letterGuessClue || 'image'} onChange={event => onChange({ letterGuessClue: event.target.value as 'none' | 'image' | 'audio' | 'both' })}><option value="none">Ohne Hinweis</option><option value="image">Wortbild</option><option value="audio">Wort anhören</option><option value="both">Bild und Ton</option></select></label>
    <label className="property-label">Schrift<select aria-label="Schrift beim Buchstabenraten" value={c.font || 'Andika'} onChange={event => onChange({ font: event.target.value })}>{Object.entries(fonts).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    {(c.letterGuessClue === 'audio' || c.letterGuessClue === 'both') && <VoiceOptions settings={c} onChange={onChange} />}
    <details><summary>Eigene Wortbilder und Wortaufnahmen</summary>
      {Array.from(new Set(words)).map((word, i) => { const item = guessMedia(c, word); return <fieldset key={word}><legend>{word}</legend>
        {item?.image && <img className="alphabet-config-image" src={item.image} alt={word} />}
        <div className="learning-actions">
          {file('image/png,image/jpeg,image/webp', `Wortbild ${i + 1} wählen`, image => media(word, { image }))}
          {file('audio/*', `Wortaufnahme ${i + 1} wählen`, audio => media(word, { audio }))}
          <button type="button" className="knopf compact" onClick={() => setRecord({ word, done: audio => media(word, { audio }) })}>Wort aufnehmen</button>
          {item?.audio && <audio controls src={item.audio} preload="none" />}
          {item && <button type="button" className="knopf compact" onClick={() => onChange({ letterGuessItems: (c.letterGuessItems || []).filter(item => guessWord(item.word).toLocaleLowerCase('de') !== word.toLocaleLowerCase('de')) })}>Eigene Medien entfernen</button>}
        </div>
      </fieldset>; })}
    </details>
    {record && createPortal(<div className="alphabet-recording"><p className="alphabet-recording-label">Wort aufnehmen: {record.word}</p><AudioDialog bookId="" onClose={() => setRecord(null)} onAudio={src => { record.done(src); setRecord(null); }} /></div>, document.body)}
  </fieldset>;
}
