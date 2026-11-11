'use client';
import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import type { LearningSettings } from '@/lib/learning/catalog';
import { normalSound, readSynthesis, stretchableSound, synthesisDrag, synthesisLabel, synthesisPairs, synthesisScore, synthesisStep, synthesisVehicle, synthesisMode, type SynthesisPair, type SynthesisState } from '@/lib/learning/synthesis';
import { startGermanSpeech } from '@/lib/speech';
import { useLearning } from './Runtime';

type RoundProps = { state: SynthesisState; pair: SynthesisPair; settings: LearningSettings; interactive: boolean; join: () => void; advance: () => void; notice: (text: string) => void; instructions: string; autoFocus: boolean };
function SynthesisRound(props: RoundProps) {
  const { state, pair, settings: c, interactive } = props;
  const display = synthesisLabel(pair, c), label = display.left + display.right;
  const [progress, setProgress] = useState(0), [wobble, setWobble] = useState(0);
  const svg = useRef<SVGSVGElement>(null), audio = useRef<HTMLAudioElement | null>(null), latest = useRef(props);
  const drag = useRef<{ pointer: number; start: { x: number; y: number }; progress: number } | null>(null);
  useEffect(() => { latest.current = props; });
  function stopAudio() { audio.current?.pause(); audio.current = null; }
  useEffect(() => {
    const cancel = () => {
      const active = drag.current; drag.current = null;
      audio.current?.pause(); audio.current = null; setProgress(0);
      if (active && svg.current?.hasPointerCapture(active.pointer)) svg.current.releasePointerCapture(active.pointer);
    };
    const visibility = () => { if (document.visibilityState === 'hidden') cancel(); };
    window.addEventListener('blur', cancel); document.addEventListener('visibilitychange', visibility);
    return () => { window.removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', visibility); audio.current?.pause(); audio.current = null; drag.current = null; };
  }, []);
  useEffect(() => {
    if (!interactive) { audio.current?.pause(); audio.current = null; drag.current = null; }
    if (interactive && state.phase === 'ready' && latest.current.autoFocus) svg.current?.focus({ preventScroll: true });
    if (!interactive || state.phase !== 'joined') return;
    const value = latest.current, syllable = value.pair.left + value.pair.right;
    let stopSpeech: (() => void) | null = null;
    if (value.settings.synthesisSpeak !== false) {
      const spoken = value.settings.synthesisPronunciations?.find(p => normalSound(p.text) === normalSound(syllable))?.speak || syllable;
      stopSpeech = startGermanSpeech(spoken, { voice: value.settings.voice, rate: value.settings.speechRate ?? 0.85, pitch: value.settings.speechPitch ?? 1.1 });
      if (!stopSpeech)
        value.notice('Zum Vorlesen bitte eine deutsche Stimme auf dem Gerät installieren. Du kannst die Silbe auch selbst sprechen.');
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => latest.current.advance(), reduced ? 200 : 1700);
    const stopReading = () => stopSpeech?.();
    window.addEventListener('blur', stopReading);
    return () => { clearTimeout(timer); stopSpeech?.(); window.removeEventListener('blur', stopReading); };
  }, [interactive, state.phase, props.autoFocus]);
  function position(event: ReactPointerEvent) {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return null;
    return new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  }
  function join() {
    if (!latest.current.interactive || latest.current.state.phase !== 'ready') return;
    const owner = drag.current; drag.current = null; stopAudio();
    if (owner && svg.current?.hasPointerCapture(owner.pointer)) svg.current.releasePointerCapture(owner.pointer);
    latest.current.join();
  }
  function cancel(event: ReactPointerEvent, reset = true) {
    const active = drag.current;
    if (!active || active.pointer !== event.pointerId) return;
    drag.current = null; stopAudio();
    if (reset) setProgress(0);
    if (svg.current?.hasPointerCapture(active.pointer)) svg.current.releasePointerCapture(active.pointer);
  }
  const stretchable = stretchableSound(pair.left);
  return <div className="synthesis-stage">
    {state.phase === 'joined' ? <div className={`synthesis-delivery${interactive ? '' : ' synthesis-delivery-static'}`} role="status" aria-label={`Verbunden: ${label}`}>
      <span className="synthesis-joined-word"><span>{display.left}</span><span>{display.right}</span></span>
      <span className="synthesis-vehicle" aria-hidden="true">{synthesisVehicle(state)}</span>
    </div> : <svg ref={svg} viewBox="0 0 100 80" width="100%" height="100%" role="button"
      tabIndex={interactive ? 0 : -1} aria-disabled={!interactive} aria-label={`Laut ${display.left} zu ${display.right} ziehen`} aria-describedby={props.instructions}
      onContextMenu={event => event.preventDefault()}
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); join(); } }}
      onPointerDown={event => {
        event.preventDefault(); event.stopPropagation();
        if (!interactive || event.button !== 0 || drag.current || !(event.target instanceof Element) || !event.target.closest('[data-synthesis-drag]')) return;
        const start = position(event); if (!start) return;
        drag.current = { pointer: event.pointerId, start, progress: 0 };
        event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.focus({ preventScroll: true });
      }}
      onPointerMove={event => {
        event.preventDefault(); event.stopPropagation();
        const active = drag.current;
        if (!interactive || !active || active.pointer !== event.pointerId) return;
        const point = position(event); if (!point) return;
        const amount = synthesisDrag(active.start, point); active.progress = amount; setProgress(amount);
        if (amount >= 1) { join(); return; }
        if (amount > 0.02 && c.synthesisDragSound && !audio.current) {
          const src = c.synthesisSounds?.find(value => normalSound(value.sound) === normalSound(pair.left))?.audio;
          if (src) {
            const sound = new Audio(src); audio.current = sound; latest.current.notice(''); sound.loop = stretchable; sound.volume = Math.max(0, Math.min(1, c.volume ?? 0.8));
            void sound.play().catch(() => { if (audio.current === sound) latest.current.notice('Die Lautaufnahme konnte nicht abgespielt werden.'); });
          }
        }
      }}
      onPointerUp={event => {
        if (!drag.current || drag.current.pointer !== event.pointerId) return;
        if (drag.current.progress < 0.04) setWobble(n => n + 1);
        cancel(event);
      }}
      onPointerCancel={event => cancel(event)} onLostPointerCapture={event => cancel(event)}>
      <path d="M30 63H70m-5-3 5 3-5 3" fill="none" stroke="#a1b4a0" strokeWidth=".7" aria-hidden="true" />
      {stretchable && progress > 0 && <text x="6" y="40" fontSize="7" fill="#4b7e49" opacity=".7" aria-hidden="true">{display.left.repeat(Math.max(1, Math.ceil(progress * 6)))}</text>}
      <g data-synthesis-drag="true" transform={`translate(${progress * 40} 0)`}>
        <g className={wobble ? wobble % 2 ? 'synthesis-wobble-a' : 'synthesis-wobble-b' : undefined}>
          <rect x="6" y="20" width="24" height="35" rx="3" fill="#fff8e6" stroke={stretchable ? '#528c4b' : '#ba9972'} strokeWidth="1" />
          <text x="18" y="42" textAnchor="middle" fontSize="16" fill="#a73544" {...(display.left.length >= 3 ? { textLength: 20, lengthAdjust: 'spacingAndGlyphs' as const } : {})}>{display.left}</text>
        </g>
      </g>
      <rect x="70" y="20" width="24" height="35" rx="3" fill="#edf4fb" stroke="#7292ad" strokeWidth="1" />
      <text x="82" y="42" textAnchor="middle" fontSize="16" fill="#2b6594" {...(display.right.length >= 3 ? { textLength: 20, lengthAdjust: 'spacingAndGlyphs' as const } : {})}>{display.right}</text>
    </svg>}
  </div>;
}

export default function SynthesisWidget({ element: el }: { element: PageElement }) {
  const { state: response, update, interactive } = useLearning(el), c = el.settings || {};
  const state = readSynthesis(response, c), pairs = synthesisPairs(c, state.round), current = pairs[state.index];
  const [notice, setNotice] = useState(''), [focusCards, setFocusCards] = useState(false), instructions = useId();
  const restart = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (interactive && state.phase === 'complete' && focusCards) restart.current?.focus({ preventScroll: true }); }, [interactive, state.phase, focusCards]);
  function act(action: 'join' | 'advance' | 'restart' | 'new') {
    if (!interactive) return;
    setFocusCards(true);
    const next = synthesisStep(state, c, action);
    if (next === state) return;
    update({ synthesis: next, score: synthesisScore(next, c), completed: next.phase === 'complete' });
  }
  return <section className="learning-widget synthesis-widget" style={{ fontFamily: `"${c.font || 'Andika'}", sans-serif` }} onPointerDown={event => event.stopPropagation()}>
    <header><strong>{c.title || 'Laute verbinden'}</strong></header>
    <div className="learning-content">
      <ol className="synthesis-collection" aria-label="Gesammelte Silben">
        {pairs.map((pair, i) => { const text = synthesisLabel(pair, c); return <li key={i} className={i < state.index ? 'collected' : ''} aria-label={i < state.index ? text.left + text.right : `Platz ${i + 1}`}>
          {i < state.index ? text.left + text.right : <span aria-hidden="true">☆</span>}
        </li>; })}
      </ol>
      {state.phase === 'complete' ? <div className="synthesis-certificate" role="status"><span aria-hidden="true">★</span><h3>Geschafft!</h3><p>Du hast {pairs.length} Silben verbunden.</p><p>{pairs.map(p => { const text = synthesisLabel(p, c); return text.left + text.right; }).join(' · ')}</p></div>
        : current ? <>
          <p id={instructions}>Ziehe die linke Karte zur rechten und sprich die Laute zusammen. Mit der Tastatur: Eingabetaste.</p>
          <SynthesisRound key={`${el.id}-${state.exercise}-${state.round}-${state.index}-${state.phase}-${interactive}`} state={state} pair={current} settings={c} interactive={interactive} join={() => act('join')} advance={() => act('advance')} notice={setNotice} instructions={instructions} autoFocus={focusCards} />
        </> : <p role="status">Bitte mindestens einen Mitlaut und einen Selbstlaut oder eine eigene Verbindung in den Einstellungen auswählen.</p>}
      <div className="learning-actions">
        <button type="button" ref={restart} disabled={!interactive || !pairs.length} onClick={() => act('restart')}>{state.phase === 'complete' ? 'Nochmal' : 'Von vorn'}</button>
        <button type="button" disabled={!interactive || !pairs.length} onClick={() => act('new')}>{synthesisMode(c) === 'pairs' ? 'Neu mischen' : 'Neue Silben'}</button>
      </div>
      {notice && <p role="status">{notice}</p>}
    </div>
  </section>;
}
