'use client';
import { musicOptions, sequenceSteps, type MusicValues } from '@/lib/learning/music-settings';
import { sequenceBeat, sequenceMelody, sequenceKey, playMusicDrum, playMusicTone, musicNoteName } from '@/lib/reference/music-runtime';
import { MusicSection, MusicSelect, MusicColors, MusicNumber, MusicToggle } from './MusicSettingControls';
import MusicAudioSource from './MusicAudioSource';
const drums = Object.entries(musicOptions.drumVoices);
const voices = musicOptions.voices.map(v => [v.id, v.label] as [string, string]);
export default function MusicPercussionOptions({ config, onConfig, upload }: { config: MusicValues; onConfig: (config: MusicValues) => void; upload: (file: File, done: (src: string) => void) => Promise<void> }) {
  const sequencer = config.kind === 'sequencer', c = (config[sequencer ? 'seq' : 'kit'] || {}) as MusicValues;
  const set = (value: MusicValues) => onConfig({ ...config, [sequencer ? 'seq' : 'kit']: value });
  const rows = (c[sequencer ? 'tracks' : 'pads'] || []) as MusicValues[];
  const edit = (index: number, patch: MusicValues) => set({ ...c, [sequencer ? 'tracks' : 'pads']: rows.map((row, i) => i === index ? patch : row) });
  const noteTracks = rows.some(row => row.note !== undefined), drumTracks = rows.some(row => row.drum);
  return <>
    {!sequencer && <MusicSection title="Instrumente"><MusicSelect label="Schlaginstrument" value={c.skin} options={[["drumset", 'Schlagzeug'], ['cajon', 'Cajón'], ['hand', 'Bongos & Congas'], ['orff', 'Orff-Instrumente'], ['pads', 'Klang-Pads']]} onChange={skin => set({ ...c, skin, pads: c.pads || musicOptions.padColors.map(color => ({ color, label: '' })) })} />
      <MusicToggle label="Namen zeigen" value={c.labels !== false} onChange={labels => set({ ...c, labels })} /></MusicSection>}
    {sequencer && <>
      <MusicSection title="Schritte und Tempo"><MusicSelect label="Schritte" value={c.steps} options={[["8", '8 Schritte (Achtel)'], ['16', '16 Schritte (Sechzehntel)']]} onChange={steps => set(sequenceSteps(c, Number(steps)))} /><MusicNumber label="Tempo (BPM)" value={c.bpm} min={50} max={180} onChange={bpm => set({ ...c, bpm })} /></MusicSection>
      {noteTracks && <MusicSection title="Tonleiter"><MusicSelect label="Tonleiter" value={(c.key as MusicValues)?.scale || 'penta'} options={musicOptions.scales.filter(s => s.id !== 'all').map(s => [s.id, s.label])} onChange={scale => set(sequenceKey(c, { scale, root: (c.key as MusicValues)?.root ?? 0 }))} /><MusicSelect label="Grundton" value={(c.key as MusicValues)?.root || 0} options={musicOptions.roots.map(root => [String(root), musicNoteName(root)])} onChange={root => set(sequenceKey(c, { scale: (c.key as MusicValues)?.scale || 'penta', root: Number(root) }))} /><p>Die Ton-Spuren bekommen die Töne der Tonleiter. Die gesetzten Schritte bleiben erhalten.</p></MusicSection>}
      {drumTracks && <MusicSection title="Beispiel-Beats"><div className="music-option-buttons">{musicOptions.beats.map(beat => <button type="button" className="knopf compact" key={beat.id} onClick={() => set(sequenceBeat(c, beat.id))}>{beat.label}</button>)}</div><p>Beispiele ändern nur die Schlagzeug-Spuren; Töne und Aufnahmen bleiben erhalten.</p></MusicSection>}
      {noteTracks && <MusicSection title="Beispiel-Melodien"><div className="music-option-buttons">{musicOptions.sequenceMelodies.map(melody => <button type="button" className="knopf compact" key={melody.id} onClick={() => set(sequenceMelody(c, melody.id))}>{melody.label}</button>)}</div><p>Beispiele ändern nur die Ton-Spuren; Schlagzeug und Aufnahmen bleiben erhalten.</p></MusicSection>}
    </>}
    {(sequencer || c.skin === 'pads') && <MusicSection title={sequencer ? 'Spuren' : 'Pads'}>
      {!sequencer && <p>Jedes Pad kann eine Aufnahme oder einen eingebauten Klang spielen. Leere Pads öffnen beim Antippen die Aufnahme.</p>}
      <div className="music-track-list">{rows.map((row, index) => {
        const label = `${sequencer ? 'Spur' : 'Pad'} ${index + 1}`, colors = sequencer ? musicOptions.trackColors : musicOptions.padColors;
        const source = row.sound || row.rec ? 'rec' : sequencer ? row.drum ? `d:${row.drum}` : `n:${row.note ?? 60}` : String(row.voice || '');
        const clean = { ...row }; for (const key of ['sound', 'rec', 'drum', 'note', 'voice']) delete clean[key];
        const choices: [string, string][] = sequencer ? [['rec', 'Eigene Aufnahme'], ...drums.map(([id, text]) => [`d:${id}`, `Schlagzeug: ${text}`] as [string, string]), ...Array.from({ length: 25 }, (_, i) => [String(`n:${60 + i}`), `Ton: ${musicNoteName(60 + i)}${Math.floor((60 + i) / 12) - 1}`] as [string, string])] : [['', 'Leer'], ...(row.sound ? [['rec', 'Eigene Aufnahme'] as [string, string]] : []), ...drums];
        const preview = row.note !== undefined ? () => { const tone = playMusicTone(String(row.voice || 'xylophone'), Number(row.note)); setTimeout(() => tone?.release(undefined), 400); } : row.drum || row.voice ? () => playMusicDrum(String(row.drum || row.voice)) : undefined;
        return <fieldset key={index} className="music-track"><legend>{label}</legend>
          <MusicColors label={`Farbe von ${label}`} value={row.color} colors={colors} onChange={color => edit(index, { ...row, color })} />
          <label className="property-label">Name von {label}<input aria-label={`Name von ${label}`} maxLength={sequencer ? 20 : 30} value={String(row.label || '')} onChange={e => edit(index, { ...row, label: e.target.value })} /></label>
          <MusicSelect label={`Klang von ${label}`} value={source} options={choices} onChange={value => edit(index, value === 'rec' ? { ...clean, ...(row.sound ? { sound: row.sound } : {}), rec: true } : value.startsWith('d:') ? { ...clean, drum: value.slice(2) } : value.startsWith('n:') ? { ...clean, note: Number(value.slice(2)), voice: row.voice || 'xylophone' } : { ...clean, ...(value ? { voice: value } : {}) })} />
          {sequencer && row.note !== undefined && <MusicSelect label={`Instrument von ${label}`} value={row.voice || 'xylophone'} options={voices} onChange={voice => edit(index, { ...row, voice })} />}
          <MusicAudioSource label={label} src={typeof row.sound === 'string' ? row.sound : undefined} upload={upload} onChange={sound => edit(index, { ...clean, sound, ...(sequencer ? { rec: true } : {}) })} onPreview={preview} />
          {rows.length > (sequencer ? 1 : 2) && <button type="button" onClick={() => set({ ...c, [sequencer ? 'tracks' : 'pads']: rows.filter((_, i) => i !== index) })} aria-label={`${label} entfernen`}>{label} entfernen</button>}
        </fieldset>;
      })}</div>
      {rows.length < (sequencer ? 8 : 12) && <button type="button" className="knopf" onClick={() => set({ ...c, [sequencer ? 'tracks' : 'pads']: [...rows, { label: '', color: (sequencer ? musicOptions.trackColors : musicOptions.padColors)[rows.length % (sequencer ? 9 : 8)], ...(sequencer ? { drum: 'kick', steps: Array(Number(c.steps) || 16).fill(false) } : {}) }] })}>{sequencer ? 'Spur dazu' : 'Pad dazu'}</button>}
    </MusicSection>}
  </>;
}
