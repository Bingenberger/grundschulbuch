'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import type { LearningSettings } from '@/lib/learning/catalog';
import { formatKaraokeTime, karaokeActive, karaokeDuration, karaokeTimeline } from '@/lib/learning/karaoke';
import { useLearning } from './Runtime';
export default function KaraokeWidget({ element }: { element: PageElement }) {
  const { state, interactive, onRecord } = useLearning(element), c = element.settings || {};
  // A changed song starts paused; playback position is transient, never a child answer.
  const identity = JSON.stringify([c.text, c.karaokeTimes, c.seconds, c.tracks?.[0]?.src, c.repeat, interactive]);
  return <KaraokePlayer key={identity} settings={c} interactive={interactive} recording={typeof state.recordingSrc === 'string' ? state.recordingSrc : undefined} record={onRecord ? () => onRecord(element.id) : undefined} />;
}
function KaraokePlayer({ settings: c, interactive, recording, record }: { settings: LearningSettings; interactive: boolean; recording?: string; record?: () => void }) {
  const cues = karaokeTimeline(c), duration = karaokeDuration(c), src = c.tracks?.[0]?.src;
  const audio = useRef<HTMLAudioElement>(null), recorded = useRef<HTMLAudioElement>(null), position = useRef(0), activePlay = useRef(0);
  const [time, setTime] = useState(0), [playing, setPlaying] = useState(false), [ended, setEnded] = useState(false), [notice, setNotice] = useState('');
  const active = karaokeActive(cues, time);
  const invalidate = useCallback(() => { activePlay.current++; }, []);
  const stop = useCallback(() => { activePlay.current++; audio.current?.pause(); recorded.current?.pause(); setPlaying(false); }, [setPlaying]);
  const sync = useCallback(() => {
    const sound = audio.current;
    if (sound && Number.isFinite(sound.currentTime)) { position.current = sound.currentTime; setTime(sound.currentTime); setEnded(sound.ended); }
  }, [setTime, setEnded]);
  useEffect(() => {
    const sound = audio.current, take = recorded.current;
    const hide = () => { if (document.visibilityState === 'hidden') stop(); };
    window.addEventListener('blur', stop); document.addEventListener('visibilitychange', hide);
    return () => { invalidate(); sound?.pause(); take?.pause(); window.removeEventListener('blur', stop); document.removeEventListener('visibilitychange', hide); };
  }, [stop, invalidate]);
  useEffect(() => { const take = recorded.current; return () => take?.pause(); }, [recording]);
  useEffect(() => { if (audio.current) audio.current.volume = Math.max(0, Math.min(1, (c.volume ?? 0.8) * (c.tracks?.[0]?.volume ?? 1))); }, [c.volume, c.tracks]);
  useEffect(() => {
    if (!playing || !interactive) return;
    let frame = 0, previous = 0;
    const began = performance.now(), start = position.current;
    function tick(now: number) {
      if (now - previous >= 50) {
        previous = now;
        if (src) sync();
        else {
          const elapsed = start + (now - began) / 1000, finished = elapsed >= duration && !c.repeat;
          const current = c.repeat && duration > 0 ? elapsed % duration : Math.min(duration, elapsed);
          position.current = current; setTime(current);
          if (finished) { setEnded(true); setPlaying(false); return; }
        }
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [playing, interactive, src, duration, c.repeat, sync]);
  async function toggle() {
    if (!interactive || !cues.length) return;
    if (playing) { stop(); return; }
    recorded.current?.pause(); setNotice('');
    const sound = audio.current;
    if (sound) {
      const request = ++activePlay.current;
      try {
        if (sound.ended) sound.currentTime = 0;
        await sound.play();
        if (activePlay.current !== request) return;
        sync(); setPlaying(true);
      } catch { if (activePlay.current === request) { setPlaying(false); setNotice('Die Musik konnte nicht gestartet werden. Bitte die Tondatei prüfen und erneut starten.'); } }
    } else {
      if (ended) { position.current = 0; setTime(0); }
      setEnded(false); setPlaying(true);
    }
  }
  function seek(at: number) {
    if (!interactive) return;
    setEnded(false);
    if (audio.current) {
      try { audio.current.currentTime = Math.min(at, Number.isFinite(audio.current.duration) ? audio.current.duration : at); sync(); }
      catch { setNotice('Bitte die Musik erst laden, bevor du zu einer Zeile springst.'); }
    } else {
      // Restart the monotonic clock from the new position while preserving pause/play.
      position.current = at; setTime(at);
      setPlaying(false);
    }
  }
  return <section className="learning-widget karaoke-widget" aria-label="Karaoke und Liedblatt" onPointerDown={event => event.stopPropagation()}>
    <header><strong>{c.title || 'Karaoke & Liedblatt'}</strong></header>
    <div className="learning-content">
      <p className="karaoke-help">{src ? 'Die Markierung folgt der Musik. Tippe auf eine Zeile, um zu ihr zu springen.' : 'Ohne Musik läuft die Textbegleitung nach dem eingestellten Zeitplan. Eine Zeile antippen setzt die Begleitung dort auf Pause.'}</p>
      {src && <audio ref={audio} className="karaoke-backing" src={src} controls={interactive} preload="metadata" loop={!!c.repeat} aria-label="Musik zum Lied"
        onPlay={() => { if (!interactive) { audio.current?.pause(); return; } recorded.current?.pause(); setEnded(false); setPlaying(true); setNotice(''); sync(); }}
        onPause={() => { setPlaying(false); sync(); }} onTimeUpdate={sync} onSeeking={sync} onSeeked={sync} onLoadedMetadata={sync}
        onEnded={() => { sync(); setPlaying(false); setEnded(true); }} onError={() => { setPlaying(false); setNotice('Die Musik konnte nicht geladen werden. Bitte die Tondatei in den Einstellungen prüfen.'); }} />}
      <div className="karaoke-lines" role="group" aria-label="Liedtext">{cues.map((cue, i) => <button type="button" key={i} disabled={!interactive} aria-current={!ended && active.includes(i) ? 'step' : undefined} className={!ended && active.includes(i) ? 'active' : undefined} aria-label={`Zeile ${i + 1}, ${formatKaraokeTime(cue.at)}: ${cue.text || 'Instrumentalpause'}`} onClick={() => seek(cue.at)}>{cue.text || <span className="karaoke-pause">♪ Instrumentalpause</span>}</button>)}</div>
      {!cues.length && <p>Bitte einen Liedtext in den Einstellungen hinterlegen.</p>}
      <p className="karaoke-position"><span role="status">{ended ? 'Lied beendet' : playing ? 'Wiedergabe läuft' : 'Pausiert'}</span> · <output aria-label="Abspielzeit" aria-live="off">{formatKaraokeTime(time)}</output></p>
      <div className="learning-actions"><button type="button" disabled={!interactive || !cues.length} onClick={() => void toggle()}>{playing ? 'Pause' : '▷ Lied starten'}</button>
        <button type="button" disabled={!interactive} onClick={() => { stop(); seek(0); }}>Zum Anfang</button>
        <button type="button" disabled={!interactive || !record} onClick={() => { stop(); record?.(); }}>● Gesang aufnehmen</button></div>
      {recording && <div className="karaoke-recording"><p>Eigene Aufnahme</p><audio key={recording} ref={recorded} src={recording} controls={interactive} preload="none" aria-label="Eigene Gesangsaufnahme" onPlay={() => { activePlay.current++; audio.current?.pause(); setPlaying(false); if (!interactive) recorded.current?.pause(); }} /></div>}
      {notice && <p role="alert">{notice}</p>}
    </div>
  </section>;
}
