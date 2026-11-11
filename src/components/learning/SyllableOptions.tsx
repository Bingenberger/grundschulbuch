/* eslint-disable @next/next/no-img-element -- School media. */
'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { LearningSettings } from '@/lib/learning/catalog';
import { assemblyMedia, assemblyWords } from '@/lib/learning/syllable-assembly';
import { clapWord, clapSyllables } from '@/lib/learning/clapping';
import { fonts } from '@/lib/notebook-model';
import WordBank from './WordBank';
import AudioDialog from '../AudioDialog';
export default function SyllableOptions({ settings: c, onChange, upload, busy }: {
  settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void;
  upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean;
}) {
  const [record, setRecord] = useState<{ word: string; done: (src: string) => void } | null>(null);
  const words = assemblyWords(c).map(word => word.word);
  function media(word: string, patch: { image?: string; audio?: string }) {
    const wanted = new Set(words.map(word => word.toLocaleLowerCase('de')));
    onChange({ syllableItems: [...(c.syllableItems || []).filter(item => wanted.has(clapWord(item.word).toLocaleLowerCase('de')) && clapWord(item.word).toLocaleLowerCase('de') !== word.toLocaleLowerCase('de')), { ...assemblyMedia(c, word), word, ...patch }] });
  }
  const file = (accept: string, label: string, done: (src: string) => void) => <label className="knopf compact">{label}<input className="visually-hidden" type="file" accept={accept} aria-label={label} onChange={event => { const selected = event.target.files?.[0]; if (selected) void upload(selected, done); event.target.value = ''; }} /></label>;
  return <fieldset className="syllable-options" disabled={busy}><legend>Silbenlesen · Silben legen</legend>
    <label className="property-label">Wörter, je eines pro Zeile · bis 30 Wörter<textarea aria-label="Wörter zum Silbenlegen" value={(c.words || []).join('\n')} onChange={event => onChange({ words: event.target.value.split('\n').slice(0, 30) })} /></label>
    <p>Silben mit Bindestrichen trennen, etwa Ba-na-ne. Vorschläge für unbekannte Wörter bitte prüfen und übernehmen. Bis 80 Zeichen und zwölf Silben je Wort.</p>
    <WordBank onSelect={words => onChange({ words: words.slice(0, 30) })} />
    <details><summary>Silbentrennung prüfen</summary>{(c.words || []).map((entry, i) => {
      const info = clapSyllables(entry), confirmed = info.confirmed || c.syllableConfirmed?.includes(info.parts.join('-'));
      return <div key={i}><p>{info.parts.join(' – ')}{!confirmed && ' · Vorschlag, bitte prüfen'}</p>{!confirmed && info.word && <button type="button" onClick={() => onChange({ words: c.words?.map((word, n) => n === i ? info.parts.join('-') : word), syllableConfirmed: [...(c.syllableConfirmed || []).filter(value => value !== info.parts.join('-')), info.parts.join('-')].slice(-30) })}>Trennung für Wort {i + 1} übernehmen</button>}</div>;
    })}</details>
    <label className="property-label">Hinweis<select aria-label="Hinweis beim Silbenlegen" value={c.syllablePrompt || 'image'} onChange={event => onChange({ syllablePrompt: event.target.value as 'image' | 'word' | 'audio' | 'both' })}><option value="image">Wortbild</option><option value="word">Geschriebenes Wort</option><option value="audio">Wort anhören</option><option value="both">Bild und geschriebenes Wort</option></select></label>
    <label><input type="checkbox" checked={c.syllableColours !== false} onChange={event => onChange({ syllableColours: event.target.checked })} /> Silben abwechselnd blau und rot anzeigen</label>
    <label className="property-label">Schrift<select aria-label="Schrift beim Silbenlegen" value={c.font || 'Andika'} onChange={event => onChange({ font: event.target.value })}>{Object.entries(fonts).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <details><summary>Eigene Wortbilder und Wortaufnahmen</summary>
      {Array.from(new Set(words)).map((word, i) => { const item = assemblyMedia(c, word); return <fieldset key={word}><legend>{word}</legend>
        {item?.image && <img className="alphabet-config-image" src={item.image} alt={word} />}
        <div className="learning-actions">
          {file('image/png,image/jpeg,image/webp', `Wortbild ${i + 1} wählen`, image => media(word, { image }))}
          {file('audio/*', `Wortaufnahme ${i + 1} wählen`, audio => media(word, { audio }))}
          <button type="button" className="knopf compact" onClick={() => setRecord({ word, done: audio => media(word, { audio }) })}>Wort aufnehmen</button>
          {item?.audio && <audio controls src={item.audio} preload="none" />}
          {item && <button type="button" className="knopf compact" onClick={() => onChange({ syllableItems: (c.syllableItems || []).filter(item => clapWord(item.word).toLocaleLowerCase('de') !== word.toLocaleLowerCase('de')) })}>Eigene Medien entfernen</button>}
        </div>
      </fieldset>; })}
    </details>
    {record && createPortal(<div className="alphabet-recording"><p className="alphabet-recording-label">Wort aufnehmen: {record.word}</p><AudioDialog bookId="" onClose={() => setRecord(null)} onAudio={src => { record.done(src); setRecord(null); }} /></div>, document.body)}
  </fieldset>;
}
