/* eslint-disable @next/next/no-img-element -- School-owned media. */
'use client';
import { FontPicker, Picker } from '../ui/Choice';
import { OpacityGlyph, TextGlyph } from '../ui/Glyphs';
import { themeIcons } from './pickerIcons';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { LearningSettings } from '@/lib/learning/catalog';
import { defaultWords } from '@/lib/learning/catalog';
import { clapMedia, clapSyllables, clapWord, spellableClapWord } from '@/lib/learning/clapping';
import { wordBanks } from '@/lib/learning/words';
import AudioDialog from '../AudioDialog';
export default function ClappingOptions({ settings: c, onChange, upload, busy }: {
  settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void;
  upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean;
}) {
  const [theme, setTheme] = useState<keyof typeof wordBanks>('Natur'), [count, setCount] = useState(0), [letters, setLetters] = useState('');
  const [record, setRecord] = useState<{ word: string; done: (src: string) => void } | null>(null);
  const words = c.words || defaultWords;
  const selection = wordBanks[theme].filter(word => (!count || clapSyllables(word).parts.length === count) && spellableClapWord(word, letters.toLocaleLowerCase('de').split(/[\s,;]+/).filter(Boolean)));
  function media(word: string, patch: Partial<NonNullable<LearningSettings['clappingItems']>[number]>) {
    const selected = new Set(words.map(value => clapWord(value).toLocaleLowerCase('de')));
    onChange({ clappingItems: [...(c.clappingItems || []).filter(item => selected.has(clapWord(item.word).toLocaleLowerCase('de')) && clapWord(item.word).toLocaleLowerCase('de') !== clapWord(word).toLocaleLowerCase('de')), { ...clapMedia(c, word), word: clapWord(word), ...patch }] });
  }
  const file = (accept: string, label: string, done: (src: string) => void) => <label className="knopf compact">{label}<input className="visually-hidden" aria-label={label} type="file" accept={accept} onChange={event => { const selected = event.target.files?.[0]; if (selected) void upload(selected, done); event.target.value = ''; }} /></label>;
  return <fieldset className="clapping-options" disabled={busy}>
    <legend>Silben klatschen</legend>
    <label className="property-label">Wörter, je eines pro Zeile · bis 16 Wörter<textarea aria-label="Wörter zum Silbenklatschen" value={words.join('\n')} onChange={event => onChange({ words: event.target.value.split('\n').slice(0, 16) })} /></label>
    <p>Silben mit Bindestrichen festlegen, etwa Ba-na-ne. Bei unbekannten Wörtern wird eine Trennung vorgeschlagen; bitte prüfen und übernehmen, bevor automatisch bewertet wird.</p>
    <details><summary>Wörter aus einer Liste wählen</summary>
      <Picker label="Thema" name="Wortliste zum Silbenklatschen" value={theme} onChange={setTheme} options={(Object.keys(wordBanks) as (keyof typeof wordBanks)[]).map(key => ({ value: key, label: key, icon: themeIcons[key] }))} />
      <Picker label="Silbenzahl" name="Wortliste nach Silbenzahl filtern" value={count} onChange={setCount} options={[{ value: 0, label: 'Alle', icon: 'list' }, ...[1, 2, 3, 4, 5, 6].map(n => ({ value: n, label: n === 1 ? '1 Silbe' : `${n} Silben`, icon: <TextGlyph text={String(n)} tone="orange" /> }))]} />
      <label className="property-label">Nur aus gelernten Lauten · optional, mit Leerzeichen<input aria-label="Wortliste nach gelernten Lauten filtern" value={letters} onChange={event => setLetters(event.target.value)} placeholder="m a u s sch …" /></label>
      <p>{selection.length ? selection.join(' · ') : 'Keine passenden Wörter.'}</p>
      <button type="button" className="knopf compact" disabled={!selection.length} onClick={() => onChange({ words: selection.slice(0, 16) })}>Wörter übernehmen</button>
    </details>
    <Picker label="Hilfen von Anfang an" name="Silbenhilfen" value={c.clappingHelp || (c.showWords === false ? 'none' : 'word')} onChange={clappingHelp => onChange({ clappingHelp })}
      options={[{ value: 'none', label: 'Ohne Hilfe', icon: 'cancel' }, { value: 'dots', label: 'Punkte', icon: <TextGlyph text="•••" tone="orange" /> }, { value: 'word', label: 'Wort mit Silbenbögen', icon: 'document' }, { value: 'both', label: 'Wort und Punkte', icon: 'todo_list' }]} />
    <FontPicker name="Schrift beim Silbenklatschen" value={c.font || 'Andika'} onChange={font => onChange({ font })} />
    <Picker label="Mikrofonempfindlichkeit" name="Mikrofonempfindlichkeit beim Silbenklatschen" value={c.clappingSensitivity ?? 0.06} onChange={clappingSensitivity => onChange({ clappingSensitivity })}
      options={[{ value: 0.035, label: 'Hoch · leises Klatschen', icon: <OpacityGlyph opacity={0.35} color="#1e88e5" /> }, { value: 0.06, label: 'Normal', icon: <OpacityGlyph opacity={0.65} color="#1e88e5" /> }, { value: 0.1, label: 'Niedrig · kräftiges Klatschen', icon: <OpacityGlyph opacity={1} color="#1e88e5" /> }]} />
    <details><summary>Trennung prüfen, Wortbilder und Aufnahmen</summary>
      {words.slice(0, 16).map((entry, i) => {
        const base = clapSyllables(entry), info = { ...base, confirmed: base.confirmed || !!c.clappingConfirmed?.includes(base.parts.join('-')) }, item = clapMedia(c, info.word);
        return <fieldset key={i} disabled={!info.word}><legend>{info.word || `Wort ${i + 1}`}</legend>
          <p>{info.parts.join(' – ') || 'Noch kein Wort'} · {info.parts.length} Silben{!info.confirmed && ' · Vorschlag, bitte prüfen'}</p>
          {!info.confirmed && info.word && <button type="button" className="knopf compact" onClick={() => onChange({ words: words.map((word, n) => n === i ? info.parts.join('-') : word), clappingConfirmed: [...(c.clappingConfirmed || []).filter(value => value !== info.parts.join('-')), info.parts.join('-')].slice(-16) })}>Trennung übernehmen</button>}
          <label className="property-label">Silbentrennung<input aria-label={`Silbentrennung für Wort ${i + 1}`} maxLength={80} value={entry} onChange={event => onChange({ words: words.map((word, n) => n === i ? event.target.value : word) })} /></label>
          <label><input type="checkbox" checked={!!item?.hideImage} onChange={event => media(info.word, { hideImage: event.target.checked })} /> Ohne Bild · Wort im Bildfeld anzeigen</label>
          {item?.image && !item.hideImage && <img className="alphabet-config-image" src={item.image} alt={info.word} />}
          <div className="learning-actions">
            {file('image/png,image/jpeg,image/webp', `Wortbild für Wort ${i + 1} wählen`, image => media(info.word, { image, hideImage: false }))}
            {file('audio/*', `Wortaufnahme für Wort ${i + 1} wählen`, audio => media(info.word, { audio }))}
            <button type="button" className="knopf compact" onClick={() => setRecord({ word: info.word, done: audio => media(info.word, { audio }) })}>Wort aufnehmen</button>
            {item?.audio && <audio controls src={item.audio} preload="none" />}
            {item && <button type="button" className="knopf compact" onClick={() => onChange({ clappingItems: (c.clappingItems || []).filter(value => clapWord(value.word).toLocaleLowerCase('de') !== info.word.toLocaleLowerCase('de')) })}>Eigene Wortmedien entfernen</button>}
          </div>
          <details><summary>Aufnahmen für die einzelnen Silben</summary>
            {info.parts.map((part, n) => { const audio = item?.syllables?.[n]?.text === part ? item.syllables[n].audio : undefined; return <div className="learning-actions" key={n}>
              <span>{part}</span>{file('audio/*', `Silbe ${n + 1} für Wort ${i + 1} aufnehmen oder wählen`, src => media(info.word, { syllables: info.parts.map((text, j) => ({ text, ...(j === n ? { audio: src } : item?.syllables?.[j]?.text === text ? { audio: item.syllables[j].audio } : {}) })) }))}
              {audio && <audio controls src={audio} preload="none" />}
            </div>; })}
          </details>
        </fieldset>;
      })}
    </details>
    {record && createPortal(<div className="alphabet-recording"><p className="alphabet-recording-label">Wort aufnehmen: {record.word}</p><AudioDialog bookId="" onClose={() => setRecord(null)} onAudio={src => { record.done(src); setRecord(null); }} /></div>, document.body)}
  </fieldset>;
}
