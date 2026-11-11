'use client';
import { FontPicker, Picker } from '../ui/Choice';
import { TextGlyph } from '../ui/Glyphs';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { LearningSettings } from '@/lib/learning/catalog';
import { customSynthesisPairs, defaultSynthesisLetters, knownSynthesisLetters, normalSound, stretchableSound, synthesisConsonants, synthesisMode, synthesisVowels } from '@/lib/learning/synthesis';
import AudioDialog from '../AudioDialog';
export default function SynthesisOptions({ settings: c, onChange, upload, busy }: {
  settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void;
  upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean;
}) {
  const [sound, setSound] = useState('m'), [record, setRecord] = useState(false);
  const mode = synthesisMode(c), known = knownSynthesisLetters(c), recording = c.synthesisSounds?.find(item => normalSound(item.sound) === sound);
  const pairs = c.synthesisPairs || customSynthesisPairs(c);
  const recordable = Array.from(new Set([...synthesisConsonants, ...pairs.map(p => normalSound(p.left)).filter(Boolean)]));
  function setAudio(audio: string) {
    onChange({ synthesisSounds: [...(c.synthesisSounds || []).filter(item => normalSound(item.sound) !== sound), ...(audio ? [{ sound, audio }] : [])] });
  }
  function toggle(letter: string) { onChange({ synthesisLetters: known.includes(letter) ? known.filter(l => l !== letter) : [...known, letter] }); }
  return <fieldset className="synthesis-options" disabled={busy}>
    <legend>Laute verbinden</legend>
    <Picker label="Aufgaben" name="Aufgaben für Laute verbinden" value={mode} onChange={next => onChange({ synthesisMode: next, ...(next === 'sounds' && c.synthesisPairs?.some(p => !p.left.trim() || !p.right.trim()) ? { synthesisPairs: undefined } : {}) })}
      options={[{ value: 'sounds', label: 'Aus gelernten Lauten', icon: 'serial_tasks' }, { value: 'pairs', label: 'Eigene Verbindungen', icon: 'mind_map' }]} />
    {mode === 'sounds' ? <>
      <p>Grün umrandete Mitlaute lassen sich dehnen. Wähle mindestens einen Mitlaut und einen Selbstlaut.</p>
      <div className="synthesis-sound-choices" role="group" aria-label="Gelernte Mitlaute">{synthesisConsonants.map(letter => <button type="button" key={letter} className={stretchableSound(letter) ? 'stretchable' : undefined} aria-pressed={known.includes(letter)} onClick={() => toggle(letter)}>{letter}</button>)}</div>
      <div className="synthesis-sound-choices" role="group" aria-label="Gelernte Selbstlaute">{synthesisVowels.map(letter => <button type="button" key={letter} aria-pressed={known.includes(letter)} onClick={() => toggle(letter)}>{letter}</button>)}</div>
      <label className="property-label">Anzahl Silben<input type="number" aria-label="Anzahl der Verbindungen" min={1} max={12} value={c.synthesisCount || 6} onChange={event => onChange({ synthesisCount: Math.max(1, Math.min(12, Math.round(Number(event.target.value) || 1))) })} /></label>
      <small>Mit wenigen Lauten können Silben mehrfach vorkommen.</small>
      <button type="button" className="knopf compact" onClick={() => onChange({ synthesisLetters: [...defaultSynthesisLetters] })}>Erste Laute auswählen</button>
    </> : <label className="property-label">Eine Verbindung pro Zeile, z. B. m + a oder la + ma<textarea aria-label="Eigene Lautverbindungen" value={pairs.map(pair => `${pair.left} + ${pair.right}`).join('\n')} onChange={event => onChange({ synthesisPairs: event.target.value.split('\n').slice(0, 12).map(line => { const [left, ...rest] = line.split('+'); return { left: left.trim(), right: rest.join('+').trim() }; }) })} /></label>}
    <Picker<'' | 'lower' | 'upper' | 'mixed'> label="Buchstaben" name="Buchstaben beim Lauteverbinden" value={c.synthesisCase || (mode === 'pairs' ? '' : 'lower')} onChange={value => onChange({ synthesisCase: value || undefined })}
      options={[...(mode === 'pairs' ? [{ value: '' as const, label: 'Wie eingegeben', icon: <TextGlyph text="Aa" tone="green" /> }] : []), ...[{ value: 'lower' as const, label: 'klein', icon: <TextGlyph text="ab" /> }, { value: 'upper' as const, label: 'GROSS', icon: <TextGlyph text="AB" /> }, { value: 'mixed' as const, label: 'Gemischt', icon: <TextGlyph text="Ab" /> }]]} />
    <FontPicker name="Schrift beim Lauteverbinden" value={c.font || 'Andika'} onChange={font => onChange({ font })} />
    <label><input type="checkbox" checked={c.synthesisSpeak !== false} onChange={event => onChange({ synthesisSpeak: event.target.checked })} /> Verbundene Silbe vorlesen</label>
    <label><input type="checkbox" checked={!!c.synthesisDragSound} onChange={event => onChange({ synthesisDragSound: event.target.checked })} /> Anfangslaut beim Ziehen vorsprechen</label>
    <p>Ohne Aufnahme bleibt der Anfangslaut stumm: Das Kind spricht ihn selbst. Eine Aufnahme wird nur bei dehnbaren Lauten wiederholt.</p>
    <details><summary>Eigene Lautaufnahmen</summary>
      <Picker label="Anfangslaut" name="Lautaufnahme auswählen" value={sound} onChange={setSound} options={recordable.map(letter => ({ value: letter, label: letter, icon: <TextGlyph text={letter} tone="orange" /> }))} />
      <div className="learning-actions">
        <label className="knopf compact">Lautdatei wählen<input className="visually-hidden" aria-label="Lautdatei für das Ziehen" type="file" accept="audio/*" onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file, setAudio); event.target.value = ''; }} /></label>
        <button type="button" className="knopf compact" onClick={() => setRecord(true)}>Laut aufnehmen</button>
        {recording && <><audio controls src={recording.audio} preload="none" /><button type="button" className="knopf compact" onClick={() => setAudio('')}>Lautaufnahme entfernen</button></>}
      </div>
    </details>
    <details><summary>Aussprache der Silben verbessern</summary><label className="property-label">Silbe = Sprechweise, je eine pro Zeile<textarea aria-label="Aussprache beim Lauteverbinden" value={(c.synthesisPronunciations || []).map(p => `${p.text} = ${p.speak}`).join('\n')} onChange={event => onChange({ synthesisPronunciations: event.target.value.split('\n').filter(Boolean).slice(0, 80).map(line => { const [text, ...rest] = line.split('='); return { text: text.trim(), speak: rest.join('=').trim() }; }) })} /></label></details>
    {record && createPortal(<div className="alphabet-recording"><p className="alphabet-recording-label">Anfangslaut {sound} aufnehmen · bitte nur den Laut sprechen</p><AudioDialog bookId="" onClose={() => setRecord(false)} onAudio={audio => { setAudio(audio); setRecord(false); }} /></div>, document.body)}
  </fieldset>;
}
