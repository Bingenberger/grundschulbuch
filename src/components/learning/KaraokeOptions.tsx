'use client';
import { useState } from 'react';
import type { LearningSettings } from '@/lib/learning/catalog';
import { downloadBlob } from '@/lib/learning/audio';
import { exportKaraokeLrc, formatKaraokeTime, karaokeLines, karaokeTimeline, MAX_KARAOKE_TIME, parseKaraokeLrc, validKaraokeTimes } from '@/lib/learning/karaoke';
export default function KaraokeOptions({ settings: c, onChange, upload, busy }: {
  settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void;
  upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean;
}) {
  const [pending, setPending] = useState<ReturnType<typeof parseKaraokeLrc> | null>(null), [reading, setReading] = useState(false), [notice, setNotice] = useState('');
  const lines = karaokeLines(c.text), times = c.karaokeTimes ?? karaokeTimeline(c).map(cue => cue.at), valid = validKaraokeTimes(times, lines.length);
  async function importLrc(file: File) {
    setPending(null); setNotice(''); setReading(true);
    try { if (file.size > 256000) throw new Error('Die LRC-Datei ist zu groß.'); setPending(parseKaraokeLrc(await file.text())); }
    catch (error) { setNotice((error as Error).message); }
    finally { setReading(false); }
  }
  function music(src: string | undefined) {
    const first = { ...(c.tracks?.[0] || { title: 'Musik', offset: 0, volume: 1 }), src };
    onChange({ tracks: [first, ...(c.tracks || []).slice(1)] });
  }
  return <fieldset className="karaoke-options" disabled={busy || reading}><legend>Liedtext und Musik</legend>
    <label className="property-label">Liedtext · bis 300 Zeilen<textarea aria-label="Liedtext" maxLength={10000} value={c.text || ''} onChange={event => {
      const text = event.target.value;
      onChange({ text, karaokeTimes: karaokeLines(text).length === lines.length ? c.karaokeTimes : undefined });
      if (c.karaokeTimes && karaokeLines(text).length !== lines.length) setNotice('Die Zeilenzahl wurde geändert. Bitte den Zeitplan neu festlegen.');
    }} /></label>
    <p>Leerzeilen sind Instrumentalpausen. Die Musik und die Textmarkierung verwenden dieselbe Abspielposition; ein Antippen einer Zeile springt zu deren Startzeit.</p>
    <label className="property-label">Sekunden je Zeile ohne eigenen Zeitplan<input aria-label="Sekunden je Liedzeile" type="number" min={0.1} max={3600} step={0.1} value={c.seconds ?? 3} onChange={event => onChange({ seconds: Math.max(0.1, Math.min(3600, Number(event.target.value) || 3)) })} /></label>
    <label><input type="checkbox" checked={!!c.repeat} onChange={event => onChange({ repeat: event.target.checked })} /> Lied wiederholen</label>
    <div className="learning-actions"><label className="knopf compact">Musik wählen<input className="visually-hidden" aria-label="Musik zum Lied wählen" type="file" accept="audio/*" onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file, music); event.target.value = ''; }} /></label>
      {c.tracks?.[0]?.src && <button type="button" onClick={() => music(undefined)}>Musik entfernen</button>}</div>
    {c.tracks?.[0]?.src && <p>Musik hinterlegt: {c.tracks[0].title || 'Musik'}. Anhören und Vorspulen sind im Liedwerkzeug möglich.</p>}
    {(c.tracks?.length || 0) > 1 && <p>Dieses ältere Werkzeug enthält weitere Tonspuren. Karaoke verwendet die erste Spur; die übrigen Dateien bleiben im Heft erhalten.</p>}
    <details><summary>Zeitplan bearbeiten · {c.karaokeTimes ? 'eigene Zeiten' : 'gleichmäßige Zeilenabstände'}</summary>
      <p>Startzeiten in Sekunden ab Beginn der Musik, aufsteigend. Gleiche Startzeiten markieren mehrere Zeilen zusammen. Die erste Zeile darf nach einem Vorspiel beginnen. Ohne Musik bestimmt „Sekunden je Zeile“ auch die Dauer der letzten Zeile.</p>
      {lines.map((line, i) => <label className="karaoke-cue-option" key={i}><span>{i + 1}. {line || '♪ Instrumentalpause'}</span><input aria-label={`Startzeit für Liedzeile ${i + 1}`} type="number" min={0} max={MAX_KARAOKE_TIME} step={0.001} value={times[i] ?? 0} onChange={event => onChange({ karaokeTimes: lines.map((_, n) => n === i ? Math.max(0, Math.min(MAX_KARAOKE_TIME, Number(event.target.value) || 0)) : times[n] ?? 0) })} /></label>)}
      {!valid && <p role="alert">Bitte für jede Zeile eine gültige, aufsteigende Startzeit angeben.</p>}
      <button type="button" disabled={!c.karaokeTimes} onClick={() => onChange({ karaokeTimes: undefined })}>Gleichmäßige Zeilenabstände verwenden</button>
    </details>
    <div className="learning-actions"><label className="knopf compact">LRC-Datei laden<input className="visually-hidden" aria-label="LRC-Datei laden" type="file" accept=".lrc,.txt,text/plain" onChange={event => { const file = event.target.files?.[0]; if (file) void importLrc(file); event.target.value = ''; }} /></label>
      <button type="button" disabled={!lines.length || !valid} onClick={() => downloadBlob(new Blob([exportKaraokeLrc(c)], { type: 'text/plain;charset=utf-8' }), 'lied.lrc')}>Als LRC speichern</button></div>
    <p>LRC mit zeilenweisen Zeitmarken wie [00:03.500]. Wortweise Zeitmarken und ein vom Wert 0 abweichender offset werden noch nicht unterstützt und beim Import gemeldet.</p>
    {pending && <div className="karaoke-import-preview"><p>Importvorschau: {pending.karaokeTimes.length} Zeilen. Die Übernahme ersetzt Liedtext und Zeitplan; die Musik bleibt erhalten.</p><ol>{karaokeLines(pending.text).slice(0, 3).map((line, i) => <li key={i}>{formatKaraokeTime(pending.karaokeTimes[i])} · {line || 'Instrumentalpause'}</li>)}</ol>
      <button type="button" onClick={() => { onChange(pending); setPending(null); setNotice('Liedtext und Zeitplan wurden übernommen.'); }}>Liedtext und Zeiten übernehmen</button>
      <button type="button" onClick={() => setPending(null)}>Import verwerfen</button></div>}
    {notice && <p role="status">{notice}</p>}
  </fieldset>;
}
