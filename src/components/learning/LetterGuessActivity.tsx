/* eslint-disable @next/next/no-img-element -- School-owned media. */
'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import type { LearningSettings } from '@/lib/learning/catalog';
import { clapPicture } from '@/lib/learning/clapping';
import { canonicalGuess, guessAlphabet, guessDisplay, guessLimit, guessMedia, guessPhase, guessRows, guessSlots, guessWords, letterGuessScore, letterGuessStep, readLetterGuess, wrongGuesses, type LetterGuessAction } from '@/lib/learning/letter-guess';
import { startGermanSpeech } from '@/lib/speech';
import { useLearning } from './Runtime';
const empty: LearningSettings = {};
export function GuessMouse({ errors, limit }: { errors: number; limit: number }) {
  const progress = Math.min(1, errors / limit);
  return <svg className="guess-mouse" viewBox="0 0 100 54" width="100%" height="140" role="img" aria-label={errors >= limit ? 'Die Maus hat den Käse erreicht.' : `${limit - errors} Fehlversuche übrig.`}>
    <path d="M12 43H88" stroke="#b8c9a9" strokeWidth="1" strokeDasharray="2 2" />
    {Array.from({ length: limit + 1 }, (_, i) => <circle key={i} cx={12 + i / limit * 76} cy="43" r="1.3" fill={i <= errors ? '#ae8151' : '#d9e3ce'} />)}
    <g className="guess-mouse-position" style={{ transform: `translateX(${progress * 70}px)` }}><text x="6" y="35" fontSize="17" aria-hidden="true">🐭</text></g>
    <text x="82" y="35" fontSize="17" aria-hidden="true">🧀</text>
  </svg>;
}
export default function LetterGuessActivity({ element: el }: { element: PageElement }) {
  const { state: response, update, interactive } = useLearning(el), c = el.settings || empty;
  const words = useMemo(() => guessWords(c), [c]), state = useMemo(() => readLetterGuess(response, c), [response, c]);
  const word = words[state.index] || '', phase = guessPhase(state, c), errors = wrongGuesses(state, c), limit = guessLimit(c), item = guessMedia(c, word);
  const clue = c.letterGuessClue || 'image', showImage = clue === 'image' || clue === 'both', hear = clue === 'audio' || clue === 'both';
  const picture = showImage ? item?.image || clapPicture(word) : undefined;
  const [notice, setNotice] = useState(''), [speaking, setSpeaking] = useState(false), [focus, setFocus] = useState(false);
  const root = useRef<HTMLElement>(null), audio = useRef<HTMLAudioElement | null>(null), speech = useRef<(() => void) | null>(null), timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = useCallback(() => { audio.current?.pause(); audio.current = null; speech.current?.(); speech.current = null; if (timer.current !== null) clearTimeout(timer.current); timer.current = null; setSpeaking(false); }, []);
  useEffect(() => {
    let stopped = false; queueMicrotask(() => { if (!stopped) stop(); });
    return () => { stopped = true; stop(); };
  }, [interactive, state.exercise, state.index, state.completed, stop]);
  useEffect(() => {
    const hide = () => { if (document.visibilityState === 'hidden') stop(); };
    window.addEventListener('blur', stop); document.addEventListener('visibilitychange', hide);
    return () => { window.removeEventListener('blur', stop); document.removeEventListener('visibilitychange', hide); };
  }, [stop]);
  useEffect(() => { if (focus && interactive) root.current?.focus({ preventScroll: true }); }, [focus, interactive, state.index, state.completed, phase]);
  function act(action: LetterGuessAction) {
    if (!interactive) return;
    if (action.type !== 'guess') { stop(); setNotice(''); }
    if (action.type === 'next' || action.type === 'restart' || action.type === 'retry') setFocus(true);
    const next = letterGuessStep(state, c, action);
    if (next !== state) {
      if (action.type === 'guess') root.current?.focus({ preventScroll: true });
      update({ letterGuess: next, score: letterGuessScore(next, c), completed: next.completed });
    }
  }
  function listen() {
    if (!interactive || !word) return;
    stop(); setNotice(''); setSpeaking(true); timer.current = setTimeout(stop, 60000);
    if (item?.audio) {
      const sound = new Audio(item.audio); audio.current = sound; sound.volume = Math.max(0, Math.min(1, c.volume ?? 0.8));
      const fail = () => { if (audio.current === sound) { stop(); setNotice('Die Wortaufnahme konnte nicht abgespielt werden.'); } };
      sound.onended = () => { if (audio.current === sound) stop(); }; sound.onerror = fail; void sound.play().catch(fail);
    } else {
      speech.current = startGermanSpeech(word, { voice: c.voice, rate: c.speechRate ?? 0.85, pitch: c.speechPitch, onEnd: stop, onError: stop });
      if (!speech.current) { stop(); setNotice('Zum Anhören bitte eine deutsche Stimme auf dem Gerät installieren oder eine Wortaufnahme hinterlegen.'); }
    }
  }
  return <section ref={root} className="learning-widget letter-guess-widget" tabIndex={interactive ? 0 : undefined} aria-label="Buchstaben raten" style={{ fontFamily: `"${c.font || 'Andika'}", sans-serif` }} onPointerDown={event => event.stopPropagation()}
    onCompositionEnd={event => act({ type: 'guess', letter: event.data })}
    onKeyDown={event => {
      if (!interactive || event.repeat || event.nativeEvent.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
      const letter = canonicalGuess(event.key);
      if (!guessAlphabet.includes(letter)) return;
      event.preventDefault(); event.stopPropagation(); act({ type: 'guess', letter });
    }}>
    <header><strong>{c.title || 'Buchstaben raten'}</strong></header>
    <div className="learning-content">
      {state.completed ? <div className="guess-certificate" role="status"><h3>Geschafft!</h3><p>{state.results.filter(Boolean).length} von {words.length} Wörtern erraten.</p><ol>{words.map((word, i) => <li key={i}>{state.results[i] ? '★' : '○'} {guessDisplay(word, c)}</li>)}</ol><button type="button" disabled={!interactive} onClick={() => act({ type: 'restart' })}>Nochmal</button></div>
        : word ? <>
          <p className="guess-progress">Wort {state.index + 1} von {words.length}</p>
          <p>Tippe Buchstaben an oder verwende die Tastatur. Jeder falsche Buchstabe bringt die Maus näher zum Käse.</p>
          {picture && <div className="guess-picture">{item?.image ? <img src={item.image} alt={`Wortbild: ${word}`} /> : <span role="img" aria-label={`Wortbild: ${word}`}>{picture}</span>}</div>}
          {hear && <button type="button" disabled={!interactive} onClick={listen}>▷ Wort anhören</button>}
          {speaking && <button type="button" onClick={stop}>Ton stoppen</button>}
          <GuessMouse errors={errors.length} limit={limit} />
          <div className="guess-slots" role="group" aria-label="Gesuchtes Wort">{guessSlots(state, c).map((slot, i) => <span className={slot.letter ? `guess-slot${slot.visible ? ' visible' : ''}` : 'guess-separator'} key={i} aria-label={slot.letter ? slot.visible ? `Buchstabe ${i + 1}: ${slot.text}` : `Buchstabe ${i + 1}: noch verdeckt` : slot.text === ' ' ? 'Wortabstand' : slot.text}>{slot.visible ? slot.text === ' ' ? '\u00a0' : slot.text : '_'}</span>)}</div>
          <p className="guess-feedback" role="status">{phase === 'won' ? '★ Wort erraten!' : phase === 'lost' ? 'Die Maus hat den Käse erreicht. Hier ist das gesuchte Wort.' : phase === 'revealed' ? 'Hier ist die Lösung. Dieses Wort zählt noch nicht als erraten.' : `${limit - errors.length} Fehlversuche übrig.`}</p>
          <div className="guess-keyboard" role="group" aria-label="Buchstabentastatur">{guessRows(c).map((row, i) => <div className="guess-key-row" key={i} style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0,1fr))` }}>{row.map(letter => {
            const used = state.guessed.includes(letter), wrong = errors.includes(letter), text = guessDisplay(letter, c);
            return <button type="button" data-guess-letter={letter} key={letter} disabled={!interactive || used || phase !== 'playing'} className={used ? wrong ? 'guess-wrong' : 'guess-right' : undefined} aria-label={`${text} raten${used ? wrong ? ' – nicht im Wort' : ' – im Wort' : ''}`} onClick={() => act({ type: 'guess', letter })}>{text}</button>;
          })}</div>)}</div>
          <div className="learning-actions">
            <button type="button" disabled={!interactive || !state.guessed.length && !state.revealed} onClick={() => act({ type: 'retry' })}>Wort neu versuchen</button>
            <button type="button" disabled={!interactive || phase !== 'playing'} onClick={() => act({ type: 'reveal' })}>Lösung zeigen</button>
            <button type="button" disabled={!interactive || phase === 'playing'} onClick={() => act({ type: 'next' })}>{state.index + 1 === words.length ? 'Ergebnis ansehen' : 'Nächstes Wort'}</button>
          </div>
        </> : <p role="status">Bitte gültige Wörter in den Einstellungen hinterlegen.</p>}
      {notice && <p role="status">{notice}</p>}
    </div>
  </section>;
}
