/* eslint-disable @next/next/no-img-element -- Authenticated school media. */
'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LearningSettings } from '@/lib/learning/catalog';
import type { PageElement } from '@/lib/notebook-model';
import { clapMedia, clapPicture, clappingScore, clappingStep, clappingWords, readClapping, type ClappingAction, type ClappingState } from '@/lib/learning/clapping';
import { ClapMicrophone } from '@/lib/learning/clap-microphone';
import { ClapPlayback } from '@/lib/learning/clap-playback';
import { clapSound } from '@/lib/learning/clap-sound';
import { startGermanSpeech } from '@/lib/speech';
import { useLearning } from './Runtime';

const emptySettings: LearningSettings = {};
export default function ClappingWidget({ element: el }: { element: PageElement }) {
  const { state: response, update, interactive } = useLearning(el), c = el.settings || emptySettings;
  const words = useMemo(() => clappingWords(c), [c]), state = useMemo(() => readClapping(response, c), [response, c]);
  const word = words[state.index], item = word ? clapMedia(c, word.word) : undefined;
  const scope = `${state.exercise}:${state.index}:${state.completed}`;
  const latest = useRef({ state, c, scope, update, interactive });
  const [notice, setNotice] = useState(''), [active, setActive] = useState<number | null>(null), [playing, setPlaying] = useState(false);
  const [micState, setMicState] = useState<'off' | 'opening' | 'ready' | 'listening'>('off'), [level, setLevel] = useState(0);
  const mode = useRef<'word' | 'demo'>('word');
  const save = useCallback((next: ClappingState) => {
    const value = latest.current;
    if (!value.interactive) return;
    value.update({ clapping: next, completed: next.completed, score: clappingScore(next, value.c) });
  }, []);
  const commit = useCallback((actions: ClappingAction[]) => {
    const value = latest.current;
    if (!value.interactive) return;
    const next = actions.reduce((s, action) => clappingStep(s, value.c, action), value.state);
    if (next !== value.state) save(next);
  }, [save]);
  const [microphone] = useState(() => new ClapMicrophone({ state: () => {}, level: () => {}, error: () => {}, count: () => {}, finish: () => {} }));
  const [playback] = useState(() => new ClapPlayback({ later: (fn, ms) => setTimeout(fn, ms), clear: timer => clearTimeout(timer), read: () => null, audio: () => () => {}, beat: () => () => {} }, () => {}, () => {}, () => {}));
  useEffect(() => {
    latest.current = { state, c, scope, update, interactive };
    microphone.update({
    state: setMicState, level: setLevel, error: setNotice,
    count: (wordScope, count) => { if (latest.current.scope === wordScope && latest.current.interactive) commit([{ type: 'count', count }]); },
    finish: (wordScope, count) => { if (latest.current.scope === wordScope && latest.current.interactive) commit([{ type: 'count', count }, { type: 'check' }]); },
  });
    playback.update({
    later: (fn, ms) => setTimeout(fn, ms), clear: timer => clearTimeout(timer),
    read: (text, done) => {
      const settings = latest.current.c;
      return startGermanSpeech(text, { voice: settings.voice, rate: settings.speechRate ?? 0.85, pitch: settings.speechPitch,
        onEnd: done, onError: () => { setNotice('Die Stimme konnte nicht abgespielt werden. Die Silbenhilfe funktioniert weiterhin.'); done(); } });
    },
    audio: (src, done) => {
      const sound = new Audio(src); sound.volume = Math.max(0, Math.min(1, latest.current.c.volume ?? 0.7));
      let stopped = false;
      sound.onended = () => { if (!stopped) done(); };
      sound.onerror = () => { if (!stopped) { setNotice('Die Aufnahme konnte nicht abgespielt werden.'); done(); } };
      void sound.play().catch(() => { if (!stopped) { setNotice('Die Aufnahme konnte nicht abgespielt werden.'); done(); } });
      return () => { stopped = true; sound.onended = null; sound.onerror = null; sound.pause(); };
    },
    beat: () => { try { return clapSound(latest.current.c.volume ?? 0.7); } catch { return () => {}; } },
  }, index => { if (mode.current === 'demo') setActive(index); }, () => { setActive(null); setPlaying(false); },
  () => setNotice('Keine lokale deutsche Stimme verfügbar. Bitte eine Stimme installieren oder eigene Aufnahmen hinterlegen.'));
 }, [state, c, scope, update, interactive, microphone, playback, commit]);
  useEffect(() => {
    let stopped = false;
    queueMicrotask(() => {
      if (stopped) return;
      playback.stop(); setActive(null); setPlaying(false);
      if (!interactive || state.completed) microphone.stop(); else microphone.pause();
    });
    return () => { stopped = true; playback.stop(); microphone.pause(); };
  }, [scope, interactive, state.completed, microphone, playback]);
  useEffect(() => {
    const stop = () => { playback.stop(); microphone.stop(); setActive(null); setPlaying(false); };
    const visibility = () => { if (document.visibilityState === 'hidden') stop(); };
    window.addEventListener('blur', stop); document.addEventListener('visibilitychange', visibility);
    return () => { playback.stop(); microphone.stop(); window.removeEventListener('blur', stop); document.removeEventListener('visibilitychange', visibility); };
  }, [microphone, playback]);
  function silence() { microphone.pause(); playback.stop(); setPlaying(false); setActive(null); }
  function hear(demonstrate: boolean) {
    if (!interactive || !word || demonstrate && !word.confirmed) return;
    silence(); setNotice(''); mode.current = demonstrate ? 'demo' : 'word';
    if (demonstrate) commit([{ type: 'help' }]);
    setPlaying(true);
    playback.start(demonstrate ? word.parts.map((text, i) => ({ text, audio: item?.syllables?.[i]?.text === text ? item.syllables[i].audio : undefined })) : [{ text: word.word, audio: item?.audio }], demonstrate);
  }
  const help = c.clappingHelp || (c.showWords === false ? 'none' : 'word');
  const showWord = help === 'word' || help === 'both' || state.helped;
  const showDots = help === 'dots' || help === 'both' || state.helped;
  const picture = item?.hideImage ? undefined : item?.image || (word ? clapPicture(word.word) : undefined);
  const advance = () => { silence(); commit([{ type: 'next' }]); };
  return <section className="learning-widget clapping-widget" style={{ fontFamily: `"${c.font || 'Andika'}", sans-serif` }} onPointerDown={event => event.stopPropagation()}>
    <header><strong>{c.title || 'Silben klatschen'}</strong></header>
    <div className="learning-content">
      {state.completed ? <div className="clapping-certificate" role="status"><h3>Geschafft!</h3><p>{state.results.filter(Boolean).length} von {words.length} Wörtern richtig geklatscht.</p>
        <div className="clapping-certificate-grid">{words.map((entry, i) => { const media = clapMedia(c, entry.word), image = !media?.hideImage && media?.image, symbol = !media?.hideImage && clapPicture(entry.word); return <div key={i}>
          {image ? <img src={image} alt="" /> : symbol && <span aria-hidden="true">{symbol}</span>}<strong>{entry.word}</strong><span>{state.results[i] ? '★' : '○'}</span>
        </div>; })}</div>
        <button type="button" disabled={!interactive} onClick={() => { silence(); commit([{ type: 'restart' }]); }}>Nochmal</button>
      </div> : word ? <>
        <p className="clapping-progress">Wort {state.index + 1} von {words.length} · {state.results.filter(Boolean).length} Sterne</p>
        <div className="clapping-word-picture">
          {picture ? item?.image && !item.hideImage ? <img src={item.image} alt={word.word} /> : <span role="img" aria-label={word.word}>{picture}</span> : <strong>{word.word}</strong>}
        </div>
        {showWord && <div className="clapping-syllables" aria-label={word.word}>{(word.confirmed ? word.parts : [word.word]).map((part, i) => <span key={i} className={`clapping-syllable clapping-colour-${i % 2}${active === i ? ' active' : ''}`}>
          <span>{part}</span>{word.confirmed && <svg viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><path d="M3 3 Q50 35 97 3" fill="none" stroke="currentColor" strokeWidth="3" /></svg>}
        </span>)}</div>}
        {showDots && word.confirmed && <div className="clapping-hint-dots" aria-label={`${word.parts.length} Silben`}>{word.parts.map((_, i) => <span className={active === i ? 'active' : undefined} key={i}>●</span>)}</div>}
        {!word.confirmed && <p role="status">Die Silbentrennung muss noch in den Einstellungen bestätigt werden. Bitte die Lehrkraft fragen.</p>}
        <button type="button" className="clapping-count-button" aria-label="Eine Silbe klatschen" disabled={!interactive || playing || state.correct} onClick={() => { silence(); commit([{ type: 'clap' }]); }}>👏</button>
        <p className="clapping-count" role="status">{state.claps} Klatscher</p>
        {state.checked && <p className={`clapping-feedback ${state.correct ? 'correct' : ''}`} role="status">{state.correct ? '★ Genau richtig!' : 'Noch nicht passend. Höre oder zeige dir die Silben und probiere es erneut.'}</p>}
        <div className="learning-actions">
          <button type="button" disabled={!interactive} onClick={() => hear(false)}>▷ Wort hören</button>
          <button type="button" disabled={!interactive || !word.confirmed} onClick={() => hear(true)}>Silben zeigen</button>
          {playing && <button type="button" onClick={silence}>Vorführung stoppen</button>}
          <button type="button" disabled={!interactive || !word.confirmed || playing} onClick={() => { silence(); commit([{ type: 'check' }]); }}>Prüfen</button>
          <button type="button" disabled={!interactive || !state.claps && !state.checked} onClick={() => { silence(); commit([{ type: 'reset' }]); }}>Neu klatschen</button>
          <button type="button" disabled={!interactive} onClick={advance}>Weiter</button>
        </div>
        <div className="clapping-microphone" role="group" aria-label="Klatschen mit Mikrofon">
          <button type="button" disabled={!interactive || !word.confirmed || state.correct || micState === 'opening'} onClick={() => {
            if (micState === 'listening') { microphone.stop(); return; }
            silence(); setNotice(''); commit([{ type: 'reset' }]); void microphone.start(scope, c.clappingSensitivity ?? 0.06);
          }}>{micState === 'listening' ? 'Klatschen stoppen' : micState === 'opening' ? 'Mikrofon wird geöffnet …' : 'Klatschen mit Mikrofon'}</button>
          {micState !== 'off' && <><button type="button" onClick={() => microphone.stop()}>Mikrofon aus</button><meter min={0} max={1} value={level} aria-label="Mikrofonpegel" /><span role="status">{micState === 'listening' ? 'Hört Klatschimpulse · kurze Stille beendet die Folge' : micState === 'opening' ? 'Bitte Mikrofonzugriff erlauben' : 'Mikrofon bereit'}</span></>}
          <small>Keine Tonaufnahme wird gespeichert. Sprache und Klassenlärm können mitgezählt werden.</small>
        </div>
      </> : <p role="status">Bitte Wörter für die Übung hinterlegen.</p>}
      {notice && <p role="status">{notice}</p>}
    </div>
  </section>;
}
