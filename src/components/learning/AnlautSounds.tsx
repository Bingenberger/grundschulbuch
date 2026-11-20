/* eslint-disable @next/next/no-img-element -- Pictures of the keys. */
'use client';
// “Laute” of the Anlaut-Tastatur as in Lernsachen-Heft 1.49.0: every key with
// its picture and a hint how to say it; listen, record (ends by itself after
// 3 seconds or with a second tap) and delete. Without an own recording the
// keyboard plays the shipped sound.
import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import { uploadAudio } from '@/lib/client-api';
import { shippedSound } from '@/lib/reference/recordings';
import { lc } from '@/lib/reference/runtime';

export type SoundTile = { g: string; second: boolean; name: string; word?: string; img?: string };
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü']);
const SHORT = ['b', 'd', 'g', 'k', 'c', 'ck', 'p', 't', 'qu', 'x', 'z', 'tz', 'pf'];
/** The key of a sound: “a” or, for the second half of a key, “a2”. */
export const soundKey = (g: string, second: boolean) => (second ? `${g}2` : g);
/** How to say it (texts of the reference). */
export function soundHint(g: string, second: boolean, pairs: boolean) {
  if (VOWELS.has(g) && pairs) return second ? 'Kurz sprechen' : 'Lang und deutlich sprechen';
  if (VOWELS.has(g)) return 'Lang und deutlich sprechen';
  return SHORT.includes(g) ? 'Ganz kurz, ohne „e“ danach' : 'Den Laut lang ziehen, nicht den Buchstabennamen sagen';
}
/** What the computer voice says for a key without a recording (as the keyboard does). */
const SPOKEN: Record<string, string> = { a: 'ah', e: 'eh', i: 'ieh', o: 'oh', u: 'uh', ä: 'äh', ö: 'öh', ü: 'üh', ei: 'ei', au: 'au', eu: 'oi', äu: 'oi', ie: 'ieh', ai: 'ei', y: 'ü', m: 'hm', n: 'nö', l: 'lö', r: 'rö', s: 'sö', ß: 'sö', f: 'fö', v: 'fö', w: 'wö', h: 'hö', j: 'jö', sch: 'schö', ch: 'ach', ng: 'ing', b: 'bö', d: 'dö', g: 'gö', k: 'kö', c: 'kö', ck: 'kö', p: 'pö', t: 'tö', qu: 'kwoh', x: 'xö', z: 'zö', tz: 'zö', pf: 'pfö', sp: 'schpö', st: 'schtö' };
const SPOKEN_2: Record<string, string> = { e: 'ä', ch: 'ich', v: 'wö' };

type Rec = { key: string; stop: () => void };

export default function AnlautSounds({ tiles, sounds, pairs, onChange }: { tiles: SoundTile[]; sounds: Record<string, string>; pairs: boolean; onChange: (key: string, src: string | undefined) => void }) {
  const [rec, setRec] = useState<Rec | null>(null);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const recRef = useRef<Rec | null>(null);
  useEffect(() => () => recRef.current?.stop(), []);

  const listen = (t: SoundTile) => {
    const key = soundKey(t.g, t.second), src = sounds[key];
    void lc(src ? '' : t.second ? SPOKEN_2[t.g] ?? SPOKEN[t.g] ?? t.g : SPOKEN[t.g] ?? t.g, src);
  };

  async function record(t: SoundTile) {
    const key = soundKey(t.g, t.second);
    if (recRef.current) { recRef.current.stop(); return; }
    setError('');
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError('Das Mikrofon ist nicht erlaubt – erlaube es in den Einstellungen des Browsers.');
      return;
    }
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream);
    let loudest = 0, frame = 0, timer = 0;
    const context = new AudioContext(), analyser = context.createAnalyser(), data = new Uint8Array(analyser.fftSize);
    context.createMediaStreamSource(stream).connect(analyser);
    const meter = () => {
      analyser.getByteTimeDomainData(data);
      let peak = 0;
      for (const v of data) peak = Math.max(peak, Math.abs(v - 128) / 128);
      loudest = Math.max(loudest, peak);
      setLevel(peak);
      frame = requestAnimationFrame(meter);
    };
    const stop = () => {
      if (recorder.state !== 'inactive') recorder.stop();
    };
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onstop = async () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      stream.getTracks().forEach((track) => track.stop());
      void context.close();
      recRef.current = null;
      setRec(null);
      setLevel(0);
      if (loudest < 0.04) { setError('Nichts zu hören – sprich etwas näher am Mikrofon.'); return; }
      setBusy(key);
      try {
        const src = await uploadAudio(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }), '');
        onChange(key, src);
        void lc('', src);
      } catch {
        setError('Die Aufnahme hat nicht geklappt.');
      } finally {
        setBusy('');
      }
    };
    recorder.start();
    meter();
    timer = window.setTimeout(stop, 3000);
    const current = { key, stop };
    recRef.current = current;
    setRec(current);
  }

  return (
    <>
      <p className="option-hint">
        Sprich jeden Laut einmal ein: <strong>Aufnehmen</strong>, den Laut sagen, kurz warten (die Aufnahme endet von selbst nach 3 Sekunden oder mit einem zweiten Tipp). Sag den Laut, nicht den Buchstabennamen – „mmm“, nicht „em“; kurze Laute wie b, d, g ganz kurz und ohne „e“. Die Aufnahmen kommen mit ins Heft. Ohne eigene Aufnahme spricht die Tastatur die mitgelieferten Laute.
      </p>
      {error && <p className="sheet-warn" role="alert">{error}</p>}
      <ul className="anlaut-sounds">
        {tiles.map((t) => {
          const key = soundKey(t.g, t.second), src = sounds[key], shipped = shippedSound(key);
          const own = !!src && src !== shipped, recording = rec?.key === key;
          return (
            <li key={key} className={`${src ? 'is-done' : ''}${recording ? ' is-rec' : ''}`}>
              <span className="anlaut-sound-pic">{t.img && <img src={t.img} alt="" />}</span>
              <span className="anlaut-sound-name">
                <b>{t.name}</b>
                <small>{t.word ? `wie ${t.word.toLowerCase().startsWith(t.g) ? '' : 'in '}${t.word} · ` : ''}{soundHint(t.g, t.second, pairs)}{src && !own ? ' · mitgeliefert' : ''}</small>
              </span>
              {recording && <span className="anlaut-sound-level" style={{ '--l': level.toFixed(2) } as React.CSSProperties} aria-hidden="true" />}
              <button type="button" className="knopf compact" title={own ? 'Aufnahme anhören' : src ? 'Mitgelieferten Laut anhören' : 'Computerstimme anhören'} aria-label={`${t.name} anhören`} onClick={() => listen(t)}>
                <Icon name="speaker" size={18} />
              </button>
              <button type="button" className={`knopf compact${recording ? ' danger' : ''}`} disabled={(!!rec && !recording) || busy === key} onClick={() => void record(t)}>
                {recording ? 'Stopp' : busy === key ? 'Speichert …' : own ? 'Neu' : 'Aufnehmen'}
              </button>
              <button type="button" className="knopf compact" title={shipped ? 'Eigene Aufnahme löschen (dann wieder der mitgelieferte Laut)' : 'Aufnahme löschen'} aria-label={`Aufnahme ${t.name} löschen`} disabled={!own} onClick={() => onChange(key, shipped)}>
                <Icon name="empty_trash" size={18} />
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
