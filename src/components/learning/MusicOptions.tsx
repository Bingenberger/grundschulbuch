'use client';
import { useEffect, useRef, useState } from 'react';
import type { LearningSettings } from '@/lib/learning/catalog';
import { musicPreset } from '@/lib/learning/music';
import { decodeMusicConfig, encodeMusicConfig, musicOptions, resizeStudio, type MusicValues } from '@/lib/learning/music-settings';
import { instrumentDefaults, instrumentNotes, musicNoteName, fallingInstrument, echoInstrument, musicAudioTime, playMetronomeClick, stopMusicSound } from '@/lib/reference/music-runtime';
import { MusicSection, MusicSelect, MusicNumber, MusicToggle } from './MusicSettingControls';
import MusicMelodyOptions from './MusicMelodyOptions';
import MusicPercussionOptions from './MusicPercussionOptions';
import KaraokeMusicOptions from './KaraokeMusicOptions';
import MusicSettingsPreview from './MusicSettingsPreview';
const voices = musicOptions.voices.map(v => [v.id, v.label] as [string, string]);
const instruments = musicOptions.instruments.map(i => [i.id, i.label] as [string, string]);
function MetronomeOptions({ value: c, onChange }: { value: MusicValues; onChange: (value: MusicValues) => void }) {
  const set = (patch: MusicValues) => onChange({ ...c, ...patch });
  return <>
    <MusicNumber label="Tempo (BPM)" value={c.bpm ?? 90} min={40} max={208} onChange={bpm => set({ bpm })} />
    <div className="music-option-buttons">{musicOptions.tempos.map(([label, bpm]) => <button type="button" className="knopf compact" key={label} onClick={() => set({ bpm })}>{label} ({bpm})</button>)}</div>
    <MusicSelect label="Taktart" value={c.meter || '4/4'} options={musicOptions.meters.map(m => [m, m])} onChange={meter => set({ meter })} />
    <p>Die Eins klingt betont. Beim 6/8-Takt werden die 1 und die 4 betont.</p>
    <MusicSelect label="Klang" value={c.click || 'wood'} options={musicOptions.clicks.map(v => [v.id, v.label])} onChange={click => set({ click })} />
    <button type="button" className="knopf compact" onClick={() => { const when = musicAudioTime(); if (when === null) return; const count = Number(String(c.meter || '4/4').split('/')[0]); for (let beat = 0; beat < count; beat++) playMetronomeClick(c.click || 'wood', beat === 0 ? 2 : Number(c.meter === '6/8' && beat === 3), when + 0.05 + beat * 60 / Number(c.bpm || 90)); }}>Anhören</button>
  </>;
}
export default function MusicOptions({ settings, onChange, upload, busy, editing = false }: { settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean; editing?: boolean }) {
  const config = decodeMusicConfig(settings.musicConfig), kind = String(config.kind || ''), preset = musicPreset(settings.musicTemplate);
  const [clearStudio, setClearStudio] = useState(false), savedClips = useRef<unknown[]>([]);
  useEffect(() => () => stopMusicSound(), []);
  const onConfig = (next: MusicValues) => onChange({ musicConfig: encodeMusicConfig(next) });
  const group = (name: string) => { const value = (config[name] || {}) as MusicValues; return { value, set: (patch: MusicValues) => onConfig({ ...config, [name]: { ...value, ...patch } }) }; };
  const inst = group('inst'), echo = group('echo'), fall = group('fall'), nq = group('nq'), tuner = group('tuner'), hs = group('hs');
  const notes = config.inst ? instrumentNotes(inst.value) as number[] : [];
  function changeInstrument(skin: string) {
    const defaults = kind === 'fall' ? fallingInstrument(skin) : kind === 'echo' ? echoInstrument(skin).inst : instrumentDefaults(skin);
    inst.set({ skin, voice: defaults.voice, ...(kind === 'echo' || kind === 'fall' ? { octave: defaults.octave, octaves: defaults.octaves } : {}) });
  }
  return <fieldset className={`music-options${kind === 'karaoke' ? ' music-options-karaoke' : ''}`} disabled={busy}><legend>{preset?.title}</legend>
    {kind === 'karaoke' ? <KaraokeMusicOptions settings={settings} config={config} onConfig={onConfig} onChange={onChange} upload={upload} busy={busy} editing={editing} /> : <div className="music-settings-layout">
      <div className="music-settings-fields">
        {config.inst !== undefined && <>
          <MusicSection title="Instrument und Klang"><MusicSelect label="Instrument" value={inst.value.skin} options={instruments} onChange={changeInstrument} /><MusicSelect label="Klangfarbe" value={inst.value.voice} options={voices} onChange={voice => inst.set({ voice })} /></MusicSection>
          {kind === 'piano' && <>
            <MusicSection title="Tonleiter"><MusicSelect label="Tonleiter" value={inst.value.scale} options={musicOptions.scales.map(s => [s.id, s.label])} onChange={scale => inst.set({ scale })} />
              {inst.value.scale !== 'all' && <MusicSelect label="Grundton" value={inst.value.root} options={musicOptions.roots.map(root => [String(root), musicNoteName(root)])} onChange={root => inst.set({ root: Number(root) })} />}
              <p>{inst.value.scale === 'all' ? 'Alle Töne: weiße und schwarze Klaviertasten.' : 'Nur Töne der gewählten Tonleiter, vom Grundton zum Grundton.'} {String(inst.value.scale).startsWith('penta') && 'Mit der Pentatonik klingt alles zusammen gut.'}</p>
            </MusicSection>
            <MusicSection title={`Umfang: ${notes.length ? `${musicNoteName(notes[0])}${Math.floor(notes[0] / 12) - 1} bis ${musicNoteName(notes[notes.length - 1])}${Math.floor(notes[notes.length - 1] / 12) - 1}` : ''}`}>
              <MusicSelect label="Oktaven" value={inst.value.octaves} options={[1, 2, 3].map(n => [String(n), `${n} ${n === 1 ? 'Oktave' : 'Oktaven'}`])} onChange={octaves => inst.set({ octaves: Number(octaves), octave: Math.min(Number(inst.value.octave), 7 - Number(octaves)) })} />
              <MusicNumber label="Oktave" value={inst.value.octave} min={2} max={7 - Number(inst.value.octaves || 1)} onChange={octave => inst.set({ octave })} />
              <div className="music-option-buttons"><button type="button" disabled={Number(inst.value.octave) <= 2} onClick={() => inst.set({ octave: Number(inst.value.octave) - 1 })}>Tiefer</button><button type="button" disabled={Number(inst.value.octave) + Number(inst.value.octaves) >= 7} onClick={() => inst.set({ octave: Number(inst.value.octave) + 1 })}>Höher</button></div>
            </MusicSection>
          </>}
          {kind === 'echo' && <>
            <MusicSection title="Tonfolgen"><MusicMelodyOptions value={echo.value} onChange={echo.set} random /><p>Mit einem Lied kommt jede Runde der nächste Ton dazu, bis das ganze Lied nachgespielt ist.</p></MusicSection>
            {!echo.value.song && <MusicSection title="Töne"><MusicSelect label="Anzahl Töne" value={echo.value.tones} options={musicOptions.echoTones.map(t => [String(t.n), t.label])} onChange={tones => echo.set({ tones: Number(tones) })} /></MusicSection>}
            <MusicSection title="Tempo und Länge"><MusicSelect label="Geschwindigkeit" value={echo.value.speed} options={[["slow", 'Langsam'], ['mid', 'Mittel'], ['fast', 'Schnell']]} onChange={speed => echo.set({ speed })} /><MusicSelect label="Töne zu Beginn" value={echo.value.start} options={[1, 2, 3].map(n => [String(n), `Start mit ${n} ${n === 1 ? 'Ton' : 'Tönen'}`])} onChange={start => echo.set({ start: Number(start) })} /><MusicToggle label="Mit Sprachbegleitung" value={echo.value.voice !== false} onChange={voice => echo.set({ voice })} hint="Hör zu! Jetzt du! Super! – mit der Stimme des Geräts." /></MusicSection>
          </>}
          {kind === 'fall' && <>
            <MusicSection title="Lied"><MusicMelodyOptions value={fall.value} onChange={fall.set} /></MusicSection>
            <MusicSection title="Spielart"><MusicSelect label="Spielweise" value={fall.value.mode} options={[["wait", 'Warten (auf den richtigen Ton)'], ['rhythm', 'Im Takt']]} onChange={mode => fall.set({ mode })} /><MusicSelect label="Geschwindigkeit" value={fall.value.speed} options={[["slow", 'Langsam'], ['mid', 'Mittel'], ['fast', 'Schnell']]} onChange={speed => fall.set({ speed })} />{fall.value.mode === 'rhythm' && <MusicToggle label="Melodie mitspielen" value={fall.value.guide} onChange={guide => fall.set({ guide })} hint="Die Melodie klingt leise mit – zum Mitspielen." />}</MusicSection>
          </>}
          <MusicSection title="Beschriftung"><MusicSelect label="Tasten beschriften" value={inst.value.labels} options={[["none", 'Keine'], ['letters', 'C D E'], ['solfege', 'do re mi']]} onChange={labels => inst.set({ labels })} /><MusicToggle label="Farbige Töne" value={inst.value.colors} onChange={colors => inst.set({ colors })} hint="C rot, D orange, E gelb, F grün, G türkis, A blau, H rosa." /></MusicSection>
        </>}
        {['drums', 'sequencer'].includes(kind) && <MusicPercussionOptions config={config} onConfig={onConfig} upload={upload} />}
        {kind === 'notequiz' && <>
          <MusicSection title="Notenschlüssel"><MusicSelect label="Notenschlüssel" value={nq.value.clef} options={[["treble", 'Violinschlüssel'], ['bass', 'Bassschlüssel']]} onChange={clef => nq.set({ clef })} /></MusicSection>
          <MusicSection title="Tonraum"><MusicSelect label="Tonraum" value={nq.value.ledger ? 'ledger' : 'staff'} options={[["staff", nq.value.clef === 'bass' ? 'Im Notensystem (G bis A)' : 'Im Notensystem (E bis F)'], ['ledger', nq.value.clef === 'bass' ? 'Mit Hilfslinien (E bis C)' : 'Mit Hilfslinien (C bis A)']]} onChange={ledger => nq.set({ ledger: ledger === 'ledger' })} /></MusicSection>
          <MusicSection title="Antworten mit"><MusicSelect label="Antworten" value={nq.value.answer} options={[["names", 'Notennamen (C D E …)'], ['keys', 'Klaviertasten']]} onChange={answer => nq.set({ answer })} /><p>Bei Klaviertasten zählt die richtige Tonhöhe: Das C unter dem Notensystem ist ein anderes als das C darin.</p></MusicSection>
          <MusicSection title="Fragen pro Runde"><MusicSelect label="Fragen" value={nq.value.rounds} options={[5, 10, 20].map(n => [String(n), `${n} Noten`])} onChange={rounds => nq.set({ rounds: Number(rounds) })} /></MusicSection>
        </>}
        {kind === 'metronome' && <MusicSection title="Metronom"><MetronomeOptions value={config} onChange={onConfig} /></MusicSection>}
        {kind === 'tuner' && <MusicSection title="Stimmgerät"><MusicSelect label="Instrument stimmen" value={tuner.value.inst} options={musicOptions.tuners.map(t => [t.id, t.label])} onChange={inst => tuner.set({ inst })} /><p>{musicOptions.tuners.find(t => t.id === tuner.value.inst)?.strings.map(note => musicNoteName(note)).join(' – ') || 'Zeigt jeden gehörten Ton an.'}</p><MusicNumber label="Kammerton A (Hz)" value={tuner.value.a4} min={430} max={450} onChange={a4 => tuner.set({ a4 })} /><MusicSelect label="Empfindlichkeit" value={tuner.value.sens || 3} options={['gering', 'eher gering', 'mittel', 'hoch', 'sehr hoch'].map((text, i) => [String(i + 1), text])} onChange={sens => tuner.set({ sens: Number(sens) })} /><p>Höher bei leisen Instrumenten; niedriger in einem lauten Raum.</p></MusicSection>}
        {kind === 'hoerspiel' && <>
          <MusicSection title="Länge des Hörspiels"><MusicSelect label="Länge des Hörspiels" value={hs.value.len} options={[30, 60, 90, 120, 180].map(n => [String(n), `${n} Sekunden`])} onChange={len => onConfig({ ...config, hs: resizeStudio(hs.value, Number(len)) })} /><p>Teile hinter dem neuen Ende rücken nach vorn und werden bei Bedarf gekürzt.</p></MusicSection>
          <MusicSection title="Klang"><MusicToggle label="Stimme deutlich machen" value={hs.value.boost !== false} onChange={boost => hs.set({ boost })} hint="Gleicht leise und laute Sprachaufnahmen an, filtert Brummen weg und macht die Stimme klarer." /><MusicToggle label="Musik leiser, wenn gesprochen wird" value={hs.value.duck !== false} onChange={duck => hs.set({ duck })} />{hs.value.duck !== false && <MusicNumber label="Musik beim Sprechen (%)" value={Number(hs.value.duckLevel ?? 0.3) * 100} min={5} max={90} step={5} onChange={level => hs.set({ duckLevel: level / 100 })} />}</MusicSection>
          <MusicSection title="So geht es"><p>Oben liegen Geräusche, in der Mitte Sprache, unten Musik. Teile hinzufügen, verschieben und zum Bearbeiten antippen. Ein Tipp auf die Zeitleiste setzt den Startpunkt. Minus und Plus vergrößern die Zeitleiste; der Balken verschiebt sie. „Herunterladen“ speichert das ganze Hörspiel.</p><button type="button" disabled={!clearStudio && !(hs.value.clips as unknown[])?.length} onClick={() => { if (clearStudio) hs.set({ clips: savedClips.current }); else { savedClips.current = hs.value.clips as unknown[]; hs.set({ clips: [] }); } setClearStudio(!clearStudio); }}>{clearStudio ? 'Alles wird gelöscht – nochmal tippen zum Behalten' : 'Alles löschen'}</button></MusicSection>
        </>}
        {preset?.items.some((item, index) => item.kind === 'metronome' && index > 1) && <details className="music-setting-section"><summary>Begleit-Metronom einstellen</summary><MetronomeOptions value={(config.musicMetronome || { bpm: 90, meter: '4/4', click: 'wood' }) as MusicValues} onChange={musicMetronome => onConfig({ ...config, musicMetronome })} /></details>}
        {kind === 'recorder' && <p>Der Kassettenrekorder hat in der Referenz keine eigene Einstellungsseite. Mit der roten Taste wird das Mikrofon aufgenommen.</p>}
        {preset?.id === 'playlist' && <MusicSection title="Playlist"><label className="property-label">Beschreibung<textarea aria-label="Playlist-Beschreibung" maxLength={400} value={String(config.description || '')} onChange={e => onConfig({ ...config, description: e.target.value })} /></label><label className="knopf">Cover wählen<input type="file" accept="image/*" className="visually-hidden" aria-label="Cover wählen" onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file, image => onConfig({ ...config, cover: { image } })); e.target.value = ''; }} /></label>{Array.from({ length: 8 }, (_, i) => { const track = settings.tracks?.[i] || { title: '' }; const edit = (patch: Partial<typeof track>) => { const tracks = Array.from({ length: 8 }, (_, n) => ({ title: '', ...settings.tracks?.[n] })); tracks[i] = { ...track, ...patch }; onChange({ tracks }); }; return <div className="music-option-row" key={i}><label>Titel {i + 1}<input aria-label={`Titel ${i + 1}`} value={track.title} onChange={e => edit({ title: e.target.value })} /></label><label className="knopf">Ton laden<input type="file" accept="audio/*" className="visually-hidden" aria-label={`Ton für Titel ${i + 1}`} onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file, src => edit({ src })); e.target.value = ''; }} /></label></div>; })}</MusicSection>}
      </div>
      <aside className="music-settings-preview-column"><MusicSettingsPreview settings={settings} /><p className="template-note">Probiere die Einstellungen hier aus.</p></aside>
    </div>}
  </fieldset>;
}
