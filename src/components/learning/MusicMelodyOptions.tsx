'use client';
import { useState } from 'react';
import { musicOptions, type MusicValues } from '@/lib/learning/music-settings';
import { parseMusicMidi, pickMidiTrack, midiMelody } from '@/lib/reference/music-runtime';
import { MusicSelect } from './MusicSettingControls';
export default function MusicMelodyOptions({ value, onChange, random = false }: { value: MusicValues; onChange: (patch: MusicValues) => void; random?: boolean }) {
  const [midi, setMidi] = useState<{ data: ReturnType<typeof parseMusicMidi>; name: string } | null>(null), [track, setTrack] = useState(-1), [error, setError] = useState('');
  const custom = value.custom as { title?: string; notes?: [number | null, number][]; bpm?: number } | undefined;
  async function load(file: File) {
    try {
      if (file.size > 2 * 1024 * 1024) throw Error('Die MIDI-Datei ist zu groß (höchstens 2 MB).');
      const data = parseMusicMidi(await file.arrayBuffer()), index = pickMidiTrack(data), name = file.name.replace(/\.(mid|midi|kar)$/i, ''), melody = index >= 0 ? midiMelody(data, index, name) : null;
      if (!melody) throw Error('In dieser Datei ist keine Melodie mit mindestens vier Tönen.');
      setMidi({ data, name }); setTrack(index); setError(''); onChange({ song: 'custom', custom: melody });
    } catch (e) { setError((e as Error).message || 'Die MIDI-Datei lässt sich nicht lesen.'); }
  }
  const tracks = (midi?.data.tracks || []) as { name: string; notes: unknown[] }[];
  return <div className="music-melody-options"><MusicSelect label={random ? 'Tonfolgen' : 'Lied'} value={value.song || ''} options={[
    ...(random ? [['', 'Zufällig'] as [string, string]] : []), ...musicOptions.melodies.map(m => [m.id, m.title] as [string, string]), ...(custom ? [['custom', `Eigenes Lied: ${custom.title}`] as [string, string]] : []),
  ]} onChange={song => onChange({ song: song || undefined })} />
    <label className="knopf">MIDI-Datei laden …<input type="file" className="visually-hidden" aria-label="MIDI-Datei laden" accept=".mid,.midi,.kar,audio/midi,audio/x-midi" onChange={e => { const file = e.target.files?.[0]; if (file) void load(file); e.target.value = ''; }} /></label>
    {tracks.filter(t => t.notes.length >= 4).length > 1 && <MusicSelect label="MIDI-Spur" value={track} options={tracks.flatMap((t, i) => t.notes.length >= 4 ? [[String(i), `Spur ${i + 1}${t.name ? `: ${t.name}` : ''} (${t.notes.length} Töne)`] as [string, string]] : [])} onChange={id => { if (!midi) return; const i = Number(id), melody = midiMelody(midi.data, i, midi.name); if (melody) { setTrack(i); onChange({ song: 'custom', custom: melody }); } }} />}
    {value.song === 'custom' && custom && <p>{custom.notes?.filter(n => n[0] !== null).length} Töne, Tempo {custom.bpm}. Pro Stelle wird der höchste Ton verwendet; der Rhythmus wird auf Sechzehntel gerundet.</p>}
    {error && <p role="alert">{error}</p>}
  </div>;
}
