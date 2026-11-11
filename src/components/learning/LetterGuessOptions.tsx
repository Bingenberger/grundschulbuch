/* eslint-disable @next/next/no-img-element -- School media. */
'use client';
import { FontPicker, Picker } from '../ui/Choice';
import { TextGlyph } from '../ui/Glyphs';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { LearningSettings } from '@/lib/learning/catalog';
import { guessMedia, guessWord, guessWords, validGuessWord } from '@/lib/learning/letter-guess';
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
    <Picker label="Buchstaben" name="Buchstaben beim Raten" value={c.letterGuessCase || 'upper'} onChange={letterGuessCase => onChange({ letterGuessCase })}
      options={[{ value: 'upper', label: 'GROSS', icon: <TextGlyph text="AB" /> }, { value: 'lower', label: 'klein', icon: <TextGlyph text="ab" /> }]} />
    <Picker label="Anordnung" name="Anordnung beim Buchstabenraten" value={c.letterGuessLayout || 'abc'} onChange={letterGuessLayout => onChange({ letterGuessLayout })}
      options={[{ value: 'abc', label: 'ABC', icon: <TextGlyph text="ABC" tone="green" /> }, { value: 'qwertz', label: 'QWERTZ', icon: <TextGlyph text="QWE" tone="green" /> }]} />
    <Picker label="Hinweis" name="Hinweis beim Buchstabenraten" value={c.letterGuessClue || 'image'} onChange={letterGuessClue => onChange({ letterGuessClue })}
      options={[{ value: 'none', label: 'Ohne Hinweis', icon: 'cancel' }, { value: 'image', label: 'Wortbild', icon: 'picture' }, { value: 'audio', label: 'Wort anhören', icon: 'speaker' }, { value: 'both', label: 'Bild und Ton', icon: 'gallery' }]} />
    <FontPicker name="Schrift beim Buchstabenraten" value={c.font || 'Andika'} onChange={font => onChange({ font })} />
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
