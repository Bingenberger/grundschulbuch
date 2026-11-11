/* eslint-disable @next/next/no-img-element -- School-owned media. */
'use client';
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import type { PageElement } from '@/lib/notebook-model';
import type { LearningSettings } from '@/lib/learning/catalog';
import { assemblyMedia, assemblyScore, assemblyStep, assemblyTiles, assemblyWords, readAssembly, type AssemblyAction, type AssemblyState } from '@/lib/learning/syllable-assembly';
import { clapPicture } from '@/lib/learning/clapping';
import { startGermanSpeech } from '@/lib/speech';
import { useLearning } from './Runtime';
const empty: LearningSettings = {};
function SyllableBoard({ state, settings: c, interactive, act }: { state: AssemblyState; settings: LearningSettings; interactive: boolean; act: (action: AssemblyAction) => void }) {
  const word = assemblyWords(c)[state.index], tiles = assemblyTiles(c, state.index), enabled = interactive && !state.correct;
  const root = useRef<HTMLDivElement>(null), drag = useRef<{ pointer: number; tile: number; x: number; y: number; moved: boolean } | null>(null), suppress = useRef(false);
  const [selected, setSelected] = useState<number | null>(null), [ghost, setGhost] = useState<{ tile: number; x: number; y: number } | null>(null);
  const cancel = useCallback(() => { if (drag.current) suppress.current = true; drag.current = null; setGhost(null); setSelected(null); }, [setSelected, setGhost]);
  useEffect(() => {
    const hide = () => { if (document.visibilityState === 'hidden') cancel(); };
    window.addEventListener('blur', cancel); document.addEventListener('visibilitychange', hide);
    return () => { window.removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', hide); };
  }, [cancel]);
  function choose(tile: number) { if (!enabled) return; if (suppress.current) { suppress.current = false; return; } setSelected(tile); }
  function start(event: ReactPointerEvent<HTMLButtonElement>, tile: number) {
    if (!enabled || event.button !== 0 || drag.current) return;
    event.stopPropagation(); suppress.current = false;
    drag.current = { pointer: event.pointerId, tile, x: event.clientX, y: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function place(slot: number, tile: number) { act({ type: 'place', slot, tile }); setSelected(null); root.current?.focus({ preventScroll: true }); }
  function finish(event: ReactPointerEvent) {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    drag.current = null; setGhost(null);
    if (!current.moved) return;
    suppress.current = true; setTimeout(() => { suppress.current = false; }, 0);
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-syllable-slot]');
    if (target && root.current?.contains(target)) place(Number(target.dataset.syllableSlot), current.tile);
    else setSelected(null);
  }
  return <div className="syllable-board" ref={root} tabIndex={interactive ? 0 : undefined} aria-label="Silben legen" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancel(); } }}
    onPointerMove={event => { const current = drag.current; if (!current || current.pointer !== event.pointerId) return; if (Math.hypot(event.clientX - current.x, event.clientY - current.y) >= 6) current.moved = true; if (current.moved) { event.preventDefault(); setSelected(null); setGhost({ tile: current.tile, x: event.clientX, y: event.clientY }); } }}
    onPointerUp={finish} onPointerCancel={cancel} onLostPointerCapture={() => { if (drag.current) cancel(); }}>
    <div className="syllable-slots" role="group" aria-label="Ablagefelder">{state.placed.map((tile, slot) => <button type="button" key={slot} data-syllable-slot={slot} disabled={!enabled} aria-label={`Silbenfeld ${slot + 1}${tile >= 0 ? `: ${word.parts[tile]}` : ': leer'}`} className={`syllable-slot${state.checked ? state.correct ? ' right' : ' wrong' : ''}`}
      style={{ color: c.syllableColours !== false ? slot % 2 ? '#ba3c46' : '#316fab' : undefined }}
      onPointerDown={event => { if (tile >= 0) start(event, tile); }}
      onClick={event => { if (event.detail === 0) suppress.current = false; if (suppress.current) { suppress.current = false; return; } if (selected !== null) place(slot, selected); else if (tile >= 0) choose(tile); }}>{tile >= 0 ? word.parts[tile] : <span aria-hidden="true">{slot + 1}</span>}</button>)}</div>
    <div className="syllable-bank" role="group" aria-label="Silbenkarten">{tiles.map(tile => !state.placed.includes(tile.id) && <button type="button" key={tile.id} data-syllable-tile={tile.id} aria-pressed={selected === tile.id} disabled={!enabled} className="syllable-tile" onPointerDown={event => start(event, tile.id)} onClick={event => { if (event.detail === 0) suppress.current = false; choose(tile.id); }}>{tile.text}</button>)}</div>
    <p role="status">{selected === null ? 'Ziehe eine Silbe in ein Feld oder tippe erst die Silbe und dann das Feld an.' : `Silbe „${word.parts[selected]}“ gewählt. Wähle ein Ablagefeld.`}</p>
    {selected !== null && state.placed.includes(selected) && <button type="button" disabled={!enabled} onClick={() => { const slot = state.placed.indexOf(selected); act({ type: 'place', slot, tile: -1 }); setSelected(null); }}>Silbe zurücklegen</button>}
    {ghost && createPortal(<div className="syllable-drag-ghost" style={{ left: ghost.x, top: ghost.y }}>{word.parts[ghost.tile]}</div>, document.body)}
  </div>;
}
export default function SyllableAssemblyActivity({ element: el }: { element: PageElement }) {
  const { state: response, update, interactive } = useLearning(el), c = el.settings || empty;
  const words = useMemo(() => assemblyWords(c), [c]), state = useMemo(() => readAssembly(response, c), [response, c]), word = words[state.index];
  const [epoch, setEpoch] = useState(0), [notice, setNotice] = useState(''), [speaking, setSpeaking] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null), speech = useRef<(() => void) | null>(null), timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = useCallback(() => { audio.current?.pause(); audio.current = null; const cancel = speech.current; speech.current = null; cancel?.(); if (timer.current !== null) clearTimeout(timer.current); timer.current = null; setSpeaking(false); }, []);
  useEffect(() => { let disposed = false; queueMicrotask(() => { if (!disposed) stop(); }); return () => { disposed = true; stop(); }; }, [interactive, state.exercise, state.index, state.completed, stop]);
  useEffect(() => { const hide = () => { if (document.visibilityState === 'hidden') stop(); }; window.addEventListener('blur', stop); document.addEventListener('visibilitychange', hide); return () => { window.removeEventListener('blur', stop); document.removeEventListener('visibilitychange', hide); }; }, [stop]);
  function act(action: AssemblyAction) {
    if (!interactive) return;
    const next = assemblyStep(state, c, action);
    if (action.type !== 'place' && action.type !== 'check') { stop(); setNotice(''); setEpoch(value => value + 1); }
    if (next !== state) update({ syllableAssembly: next, score: assemblyScore(next, c), completed: next.completed });
  }
  const item = word ? assemblyMedia(c, word.word) : undefined, prompt = c.syllablePrompt || 'image';
  const picture = word && (prompt === 'image' || prompt === 'both') ? item?.image || clapPicture(word.word) : undefined;
  function listen() {
    if (!interactive || !word) return;
    stop(); setNotice(''); setSpeaking(true); timer.current = setTimeout(stop, 60000);
    if (item?.audio) {
      const sound = new Audio(item.audio); audio.current = sound; sound.volume = Math.max(0, Math.min(1, c.volume ?? 0.8));
      const fail = () => { if (audio.current === sound) { stop(); setNotice('Die Wortaufnahme konnte nicht abgespielt werden.'); } };
      sound.onended = () => { if (audio.current === sound) stop(); }; sound.onerror = fail; void sound.play().catch(fail);
    } else {
      speech.current = startGermanSpeech(word.word, { voice: c.voice, rate: c.speechRate ?? 0.85, pitch: c.speechPitch, onEnd: stop, onError: stop });
      if (!speech.current) { stop(); setNotice('Zum Anhören bitte eine deutsche Gerätestimme installieren oder eine Wortaufnahme hinterlegen.'); }
    }
  }
  return <section className="learning-widget syllable-assembly-widget" aria-label="Silbenlesen" style={{ fontFamily: `"${c.font || 'Andika'}", sans-serif` }} onPointerDown={event => event.stopPropagation()}>
    <header><strong>{c.title || 'Silbenlesen'}</strong></header><div className="learning-content">
      {state.completed ? <div className="guess-certificate" role="status"><h3>Geschafft!</h3><p>{state.results.filter(Boolean).length} von {words.length} Wörtern zusammengesetzt.</p><ol>{words.map((entry, i) => <li key={i}>{state.results[i] ? '★' : '○'} {entry.word}</li>)}</ol><button type="button" disabled={!interactive} onClick={() => act({ type: 'restart' })}>Nochmal</button></div>
        : word ? <><p>Wort {state.index + 1} von {words.length}</p>
          {picture && <div className="guess-picture">{item?.image ? <img src={item.image} alt="Wortbild" /> : <span role="img" aria-label="Wortbild">{picture}</span>}</div>}
          {(prompt === 'word' || prompt === 'both') && <p className="syllable-prompt">{word.parts.map((part, i) => <span key={i} style={{ color: c.syllableColours !== false ? i % 2 ? '#ba3c46' : '#316fab' : undefined }}>{part}</span>)}</p>}
          {prompt === 'image' && !picture && <p>Für dieses Wort ist noch kein Bild hinterlegt. Du kannst es dir anhören.</p>}
          <button type="button" disabled={!interactive} onClick={listen}>▷ Wort anhören</button>{speaking && <button type="button" onClick={stop}>Ton stoppen</button>}
          <SyllableBoard key={`${state.exercise}:${state.index}:${interactive}:${epoch}`} state={state} settings={c} interactive={interactive} act={act} />
          <p role="status">{!word.confirmed ? 'Die Silbentrennung muss zunächst in den Einstellungen geprüft und übernommen werden.' : state.checked ? state.correct ? '★ Das Wort ist richtig zusammengesetzt!' : 'Noch nicht richtig. Ordne die Silben noch einmal.' : 'Lege alle Silben ab und prüfe dein Wort.'}</p>
          <div className="learning-actions"><button type="button" disabled={!interactive || !word.confirmed || state.correct || state.placed.some(tile => tile < 0)} onClick={() => act({ type: 'check' })}>Wort prüfen</button>
            <button type="button" disabled={!interactive || state.placed.every(tile => tile < 0)} onClick={() => act({ type: 'reset' })}>Wort neu legen</button>
            <button type="button" disabled={!interactive || state.correct} onClick={() => act({ type: 'skip' })}>Wort überspringen</button>
            <button type="button" disabled={!interactive || !state.correct} onClick={() => act({ type: 'next' })}>{state.index + 1 === words.length ? 'Ergebnis ansehen' : 'Nächstes Wort'}</button></div>
        </> : <p role="status">Bitte Wörter in den Einstellungen hinterlegen.</p>}
      {notice && <p role="status">{notice}</p>}
    </div>
  </section>;
}
