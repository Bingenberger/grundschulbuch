'use client';
import { useEffect, useRef, useState } from 'react';
import { CassetteRecorder } from './Cassette';
export default function MusicAudioSource({ label, src, upload, onChange, onPreview }: { label: string; src?: string; upload: (file: File, done: (src: string) => void) => Promise<void>; onChange: (src: string) => void; onPreview?: () => void }) {
  const [recording, setRecording] = useState(false), audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => audio.current?.pause(), []);
  return <div className="music-audio-source"><label className="knopf compact">Ton laden<input type="file" className="visually-hidden" accept="audio/*" aria-label={`Ton für ${label}`} onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file, onChange); e.target.value = ''; }} /></label>
    <button type="button" className="knopf compact" onClick={() => setRecording(!recording)}>{recording ? 'Aufnahme schließen' : 'Aufnehmen'}</button>
    <button type="button" className="knopf compact" aria-label={`${label} anhören`} disabled={!src && !onPreview} onClick={() => { audio.current?.pause(); if (src) { audio.current = new Audio(src); void audio.current.play().catch(() => undefined); } else onPreview?.(); }}>Anhören</button>
    {recording && <div className="music-settings-recorder"><CassetteRecorder title={label} interactive onSave={blob => upload(new File([blob], 'aufnahme.webm', { type: blob.type }), sound => { onChange(sound); setRecording(false); })} /></div>}
  </div>;
}
