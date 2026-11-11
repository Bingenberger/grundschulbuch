/* eslint-disable @next/next/no-img-element -- Media are stored on the school server. */
'use client';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { alphabetFeedback, alphabetRows, alphabetScore, alphabetStep, alphabetText, isVowelKey, letterText, practiceWords, readAlphabet, upperGerman, type AlphabetAction, type AlphabetKey, type AlphabetVariant } from '@/lib/learning/alphabet';
import { speakGerman } from '@/lib/speech';
import { useLearning } from './Runtime';

export default function AlphabetWidget({ element: el }: { element: PageElement }) {
  const { state: response, update, interactive } = useLearning(el), c = el.settings || {};
  const state = readAlphabet(response, c), rows = alphabetRows(c), words = practiceWords(c), target = words[state.index] || '';
  const [notice, setNotice] = useState('');
  const latest = useRef({ state, c, update, interactive });
  const audio = useRef<HTMLAudioElement | null>(null);
  const hold = useRef<{ pointer: number; id: string; x: number; y: number; timer: ReturnType<typeof setTimeout> | null; suppress: boolean } | null>(null);
  useEffect(() => { latest.current = { state, c, update, interactive }; });
  useEffect(() => () => { if (hold.current?.timer) clearTimeout(hold.current.timer); audio.current?.pause(); audio.current = null; }, []);
  useEffect(() => {
    if (!interactive) { if (hold.current?.timer) clearTimeout(hold.current.timer); hold.current = null; audio.current?.pause(); audio.current = null; }
  }, [interactive]);
  useEffect(() => {
    if (!interactive || !state.correct || state.completed || !c.alphabetPractice) return;
    const index = state.index, exercise = state.exercise;
    const timer = setTimeout(() => {
      const value = latest.current;
      if (!value.interactive || value.state.index !== index || value.state.exercise !== exercise || !value.state.correct) return;
      const next = alphabetStep(value.state, value.c, { type: 'next' });
      value.update({ alphabet: next, completed: next.completed, score: alphabetScore(next, value.c) });
    }, 1000);
    return () => clearTimeout(timer);
  }, [interactive, state.correct, state.completed, state.index, state.exercise, c.alphabetPractice]);

  function dispatch(action: AlphabetAction) {
    const value = latest.current;
    if (!value.interactive) return;
    const next = alphabetStep(value.state, value.c, action);
    if (next === value.state) return;
    value.update({ alphabet: next, text: alphabetText(next), ...(value.c.alphabetPractice ? { completed: next.completed, score: alphabetScore(next, value.c) } : {}) });
  }
  function speak(text: string, src?: string) {
    if (!latest.current.interactive) return;
    audio.current?.pause(); audio.current = null;
    if (src) {
      window.speechSynthesis?.cancel();
      const sound = new Audio(src); audio.current = sound; sound.volume = Math.max(0, Math.min(1, c.volume ?? 0.8));
      setNotice('');
      void sound.play().catch(() => { if (audio.current === sound) setNotice('Die Aufnahme konnte nicht abgespielt werden. Bitte erneut versuchen.'); });
    } else if (!speakGerman(text, { voice: c.voice, rate: c.speechRate ?? 0.85, pitch: c.speechPitch ?? 1.1 }))
      setNotice('Zum Vorlesen bitte eine deutsche Stimme auf dem Gerät installieren oder eigene Aufnahmen hinterlegen.');
    else setNotice('');
  }
  const prompt = c.alphabetPrompts?.find(p => p.word.normalize('NFC').replace(/-/g, '').toLocaleLowerCase('de') === target.toLocaleLowerCase('de'));
  const picture = rows.flat().flatMap(key => key.variants).find(v => v.word.replace(/-/g, '').toLocaleLowerCase('de') === target.toLocaleLowerCase('de'));
  const pictureSource = prompt?.image || picture?.image, symbol = picture?.symbol;
  const shownPrompt = c.alphabetPrompt || 'word';
  const input = alphabetText(state), locked = !interactive || !!c.alphabetPractice && (state.correct || state.completed);
  function stopHold(event: ReactPointerEvent, cancel = false) {
    const active = hold.current;
    if (!active || active.pointer !== event.pointerId) return;
    if (active.timer) clearTimeout(active.timer);
    active.timer = null;
    if (cancel) active.suppress = true;
  }
  function keyButton(key: AlphabetKey, variant: AlphabetVariant, i: number) {
    const id = `${key.id}-${i}`, label = `${letterText(key.id, c, state.shift)} schreiben – ${variant.word}${variant.hint ? ` (${variant.hint})` : ''}`;
    return <button type="button" key={id} disabled={locked} aria-label={label}
      title="Antippen: schreiben. Gedrückt halten: Bildwort erklären, ohne zu schreiben."
      onContextMenu={event => event.preventDefault()}
      onPointerDown={event => {
        if (event.button !== 0 || locked || hold.current?.timer) return;
        const active = { pointer: event.pointerId, id, x: event.clientX, y: event.clientY, timer: null as ReturnType<typeof setTimeout> | null, suppress: false };
        hold.current = active;
        active.timer = setTimeout(() => { active.timer = null; active.suppress = true; speak(`${upperGerman(key.id)} wie ${variant.word}`); }, 550);
      }}
      onPointerMove={event => { const active = hold.current; if (active && active.pointer === event.pointerId && Math.hypot(event.clientX - active.x, event.clientY - active.y) > 12) stopHold(event, true); }}
      onPointerUp={event => stopHold(event)} onPointerCancel={event => stopHold(event, true)} onPointerLeave={event => stopHold(event, true)}
      onClick={() => {
        const active = hold.current; hold.current = null;
        if (active?.timer) clearTimeout(active.timer);
        if (active?.id === id && active.suppress) return;
        dispatch({ type: 'insert', text: key.id, variant: i });
        if (c.alphabetSpeech !== false) speak(variant.word, variant.audio);
      }}>
      {variant.image ? <img src={variant.image} alt="" draggable={false} /> : <span className="alphabet-symbol" aria-hidden="true">{variant.symbol}</span>}
      <small>{variant.word}</small>{variant.hint && <span className="alphabet-length" aria-hidden="true">{variant.hint === 'lang' ? '━' : '●'}</span>}
    </button>;
  }
  return <section className={`learning-widget alphabet-widget alphabet-layout-${c.alphabetLayout || 'abc'}`} style={{ fontFamily: `"${c.font || 'Andika'}", sans-serif` }}
    onPointerDown={event => event.stopPropagation()} onCompositionEnd={event => dispatch({ type: 'insert', text: event.data, physical: true })}
    onKeyDown={event => {
      if (!interactive || event.nativeEvent.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target instanceof HTMLElement && event.target.closest('button') && (event.key === 'Enter' || event.key === ' ')) return;
      if (event.key === 'Backspace') { event.preventDefault(); event.stopPropagation(); dispatch({ type: 'backspace' }); }
      else if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); if (c.alphabetPractice) dispatch({ type: 'check' }); else speak(input); }
      else if (Array.from(event.key).length === 1 && /^[\p{L} '’!?.,]$/u.test(event.key)) { event.preventDefault(); event.stopPropagation(); dispatch({ type: 'insert', text: event.key, physical: true }); }
    }}>
    <header><strong>{c.title || 'Anlaut-Tastatur'}</strong></header>
    <div className="learning-content">
      {c.alphabetPractice && <div className="alphabet-practice">
        <p>Wort {Math.min(state.index + 1, words.length)} von {words.length} <span aria-label={`${state.results.filter(Boolean).length} Sterne`}>{state.results.map((right, i) => <span key={i}>{right ? '★' : '○'}</span>)}</span></p>
        {!state.completed && <>
          {(shownPrompt === 'word' || shownPrompt === 'both' || state.attempts >= 2 && !state.correct) && <strong className="alphabet-target">{target}</strong>}
          {(shownPrompt === 'image' || shownPrompt === 'both') && (pictureSource ? <img className="alphabet-prompt-image" src={pictureSource} alt="Übungsbild" /> : symbol ? <span className="alphabet-prompt-symbol" aria-label="Übungsbild">{symbol}</span> : <p>Kein Wortbild hinterlegt. Du kannst das Wort anhören.</p>)}
          <button type="button" disabled={!interactive || !target} onClick={() => speak(target, prompt?.audio)}>▷ Wort anhören</button>
          {!words.length && <p role="status">Bitte zuerst Wörter in den Einstellungen hinterlegen.</p>}
        </>}
        {state.completed && <div role="status"><strong>Geschafft! {state.results.filter(Boolean).length} von {words.length} Sternen.</strong><button type="button" disabled={!interactive} onClick={() => dispatch({ type: 'restart' })}>Nochmal</button></div>}
      </div>}
      {!state.completed && <>
        <div className="alphabet-output" tabIndex={interactive ? 0 : undefined} role="group" aria-label="Geschriebenes Wort">
          {!input && <span className="alphabet-placeholder">Hier schreiben …</span>}
          {state.prefix && <span className="alphabet-legacy-text">{state.prefix}</span>}
          {state.tokens.map((token, i) => <button type="button" key={i} className={c.alphabetVowels !== false && isVowelKey(token.toLocaleLowerCase('de')) ? 'alphabet-written-vowel' : undefined} disabled={!interactive} aria-label={`${token === ' ' ? 'Leerzeichen' : token} noch einmal hören`} onClick={() => {
            const variant = rows.flat().find(key => key.id === token.toLocaleLowerCase('de'))?.variants[state.variants[i] || 0];
            speak(variant?.word || token, variant?.audio);
          }}>{token === ' ' ? '\u00a0' : token}</button>)}
        </div>
        {c.alphabetPractice && state.checked && <div className="alphabet-feedback" role="status">
          {state.correct ? <strong>★ Richtig!</strong> : <>
            <span aria-label="Buchstabenvergleich">{alphabetFeedback(input, target).map((part, i) => <span key={i} className={`alphabet-letter-${part.status}`}>{part.text}</span>)}</span>
            <p>{state.attempts >= 2 ? 'Hier ist das Wort als Hilfe. Probiere es noch einmal.' : 'Schau noch einmal. Eine leere Stelle zeigt einen fehlenden Buchstaben.'}</p>
          </>}
        </div>}
        <div className="alphabet-keyboard" role="group" aria-label="Anlauttastatur">
          {rows.map((row, i) => <div className="alphabet-row" key={i} style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}>
            {row.map(key => <div key={key.id} className={`alphabet-key ${c.alphabetVowels !== false && isVowelKey(key.id) ? 'alphabet-vowel' : ''}`}>
              <b>{c.alphabetLetters === 'both' || !c.alphabetLetters ? `${upperGerman(key.id)} ${key.id}` : letterText(key.id, c)}</b>
              <div className="alphabet-variants">{key.variants.map((variant, n) => keyButton(key, variant, n))}</div>
            </div>)}
          </div>)}
        </div>
        <div className="learning-actions">
          {(!c.alphabetLetters || c.alphabetLetters === 'both') && <button type="button" disabled={locked} aria-pressed={state.shift} onClick={() => dispatch({ type: 'shift' })}>⇧ Großbuchstaben</button>}
          <button type="button" disabled={locked || !input} onClick={() => dispatch({ type: 'backspace' })}>⌫ Zurück</button>
          <button type="button" disabled={locked} onClick={() => dispatch({ type: 'insert', text: ' ' })}>Leerzeichen</button>
          <button type="button" disabled={!interactive || !input} onClick={() => speak(input)}>▷ Vorlesen</button>
          <button type="button" disabled={locked || !input} onClick={() => dispatch({ type: 'clear' })}>Alles neu</button>
          {c.alphabetPractice && <>
            <button type="button" disabled={locked || !words.length} onClick={() => dispatch({ type: 'check' })}>Fertig – prüfen</button>
            <button type="button" disabled={!interactive || !state.correct && state.attempts < 2} onClick={() => dispatch({ type: 'next' })}>{state.correct ? 'Weiter' : 'Wort überspringen'}</button>
          </>}
        </div>
      </>}
      {notice && <p role="status">{notice}</p>}
    </div>
  </section>;
}
