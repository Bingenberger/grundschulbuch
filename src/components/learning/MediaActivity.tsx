/* eslint-disable @next/next/no-img-element -- Authenticated school media. */
'use client';
import { useCallback, useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import type { PageElement } from '@/lib/notebook-model';
import type { LearningSettings } from '@/lib/learning/catalog';
import { shuffled } from '@/lib/learning/algorithms';
import { mediaActivityScore, mediaActivityStep, memoryDeck, matchingRight, pairCard, readMediaActivity, taskPairs, taskQuestions, type MediaActivityAction, type MediaActivityKind, type MediaActivityState, type TaskCard } from '@/lib/learning/media-activity';
import { startGermanSpeech } from '@/lib/speech';
import { useLearning } from './Runtime';
const emptySettings: LearningSettings = {};
export function TaskContent({ card }: { card: TaskCard }) {
  const media = card.media;
  return <span className="task-content">
    {media?.image && <img src={media.image} alt={card.text || 'Aufgabenbild'} draggable={false} />}
    {media?.audio && <span className="task-sound-icon" aria-hidden="true">🔊</span>}
    {(!media?.hideText || !media.image && !media.audio) && card.text && <span>{card.text}</span>}
  </span>;
}
type Shared = { audioBusy: boolean; state: MediaActivityState; c: LearningSettings; interactive: boolean; act: (action: MediaActivityAction) => void; play: (card: TaskCard) => void };
function AudioButton({ card, label, play, enabled, readText }: { card: TaskCard; label: string; play: (card: TaskCard) => void; enabled: boolean; readText?: boolean }) {
  if (!card.media?.audio && (!readText || !card.text)) return null;
  return <button type="button" className="task-audio" disabled={!enabled} aria-label={label} onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); play(card); }}>▷ Anhören</button>;
}
function QuizTask({ state, c, interactive, act, play }: Shared) {
  const questions = taskQuestions(c), question = questions[state.index];
  const selected = state.answers[state.index] ?? -1, checked = state.evaluated[state.index];
  const card = { text: question.text, media: question.media };
  const right = questions.filter((q, i) => state.evaluated[i] && state.answers[i] === q.correct).length;
  return <>
    <p>Frage {state.index + 1} von {questions.length}</p>
    <div className="activity-question"><TaskContent card={card} /></div>
    <AudioButton card={card} label="Frage anhören" enabled={interactive} play={play} readText={c.mediaReadText} />
    <div className="answer-options task-answer-options">{question.answers.map((answer, i) => { const card = { text: answer, media: question.answerMedia?.[i] }; return <div key={i}>
      <button type="button" disabled={!interactive} aria-pressed={selected === i} aria-label={`Antwort ${String.fromCharCode(65 + i)}${answer ? `: ${answer}` : ''}`} onClick={() => act({ type: 'answer', choice: i })}><span className="task-letter" aria-hidden="true">{String.fromCharCode(65 + i)}</span><TaskContent card={card} /></button>
      <AudioButton card={card} label={`Antwort ${String.fromCharCode(65 + i)} anhören`} enabled={interactive} play={play} readText={c.mediaReadText} />
    </div>; })}</div>
    {checked && <p role="status">{selected === question.correct ? '✓ Richtig!' : question.explanation || 'Noch nicht richtig. Probiere eine andere Antwort.'}</p>}
    <p role="status">{right} von {questions.length} Fragen richtig geprüft.{state.completed && ' Geschafft!'}</p>
    <div className="learning-actions">
      <button type="button" disabled={!interactive || state.index === 0} onClick={() => act({ type: 'question', index: state.index - 1 })}>‹ Zurück</button>
      <button type="button" disabled={!interactive || selected < 0} onClick={() => act({ type: 'check' })}>Prüfen</button>
      <button type="button" disabled={!interactive || state.index + 1 >= questions.length} onClick={() => act({ type: 'question', index: state.index + 1 })}>Weiter ›</button>
      <button type="button" disabled={!interactive} onClick={() => act({ type: 'restart' })}>Nochmal</button>
    </div>
  </>;
}
function MatchingTask({ state, c, interactive, act, play }: Shared) {
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointer: number; source: number; button: HTMLButtonElement; start: { x: number; y: number }; moved: boolean } | null>(null);
  const suppressed = useRef<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null), [ghost, setGhost] = useState<{ x: number; y: number; source: number } | null>(null), [over, setOver] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const pairs = taskPairs(c), order = shuffled(pairs.map((_, i) => i), c.seed), descriptionId = useId();
  useEffect(() => {
    const cancel = () => {
      const active = drag.current; drag.current = null;
      if (active?.button.hasPointerCapture(active.pointer)) active.button.releasePointerCapture(active.pointer);
      setGhost(null); setOver(null);
    };
    const hidden = () => { if (document.visibilityState === 'hidden') cancel(); };
    window.addEventListener('blur', cancel); document.addEventListener('visibilitychange', hidden);
    return () => { const active = drag.current; drag.current = null; if (active?.button.hasPointerCapture(active.pointer)) active.button.releasePointerCapture(active.pointer); window.removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', hidden); };
  }, []);
  function target(x: number, y: number) {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-match-target]');
    return el && root.current?.contains(el) ? Number(el.dataset.matchTarget) : null;
  }
  function place(row: number, source: number) {
    if (!interactive) return;
    act({ type: 'place', row, source }); setSelected(null); setMessage(`Karte dem Platz ${row + 1} zugeordnet.`);
  }
  function begin(event: ReactPointerEvent<HTMLButtonElement>, source: number) {
    event.stopPropagation();
    if (!interactive || event.button !== 0 || drag.current) return;
    suppressed.current = null;
    drag.current = { pointer: event.pointerId, source, button: event.currentTarget, start: { x: event.clientX, y: event.clientY }, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function finish(event: ReactPointerEvent, cancelled = false) {
    const active = drag.current;
    if (!active || active.pointer !== event.pointerId) return;
    drag.current = null;
    if (active.moved) {
      suppressed.current = active.source;
      if (!cancelled) { const row = target(event.clientX, event.clientY); if (row !== null) place(row, active.source); }
    }
    setGhost(null); setOver(null);
    if (active.button.hasPointerCapture(active.pointer)) active.button.releasePointerCapture(active.pointer);
  }
  function choose(event: React.MouseEvent, source: number) {
    if (event.detail !== 0 && suppressed.current === source) { suppressed.current = null; return; }
    setSelected(current => current === source ? null : source);
  }
  const sourceButton = (source: number) => <button type="button" className="matching-source" onContextMenu={event => event.preventDefault()} disabled={!interactive} aria-pressed={selected === source} aria-label={`Karte ${source + 1} auswählen`} aria-describedby={`${descriptionId}-source-${source}`} onPointerDown={event => begin(event, source)} onClick={event => choose(event, source)}><TaskContent card={pairCard(c, source, 'right')} /><span className="visually-hidden" id={`${descriptionId}-source-${source}`}>{pairCard(c, source, 'right').text || 'Bild- oder Tonkarte'}</span></button>;
  return <div ref={root} className="matching-task" onKeyDown={event => {
    if (event.key !== 'Escape' || !drag.current && selected === null) return;
    event.preventDefault(); event.stopPropagation();
    const active = drag.current; drag.current = null;
    if (active) { suppressed.current = active.source; if (active.button.hasPointerCapture(active.pointer)) active.button.releasePointerCapture(active.pointer); }
    setGhost(null); setOver(null); setSelected(null); setMessage('Verschieben abgebrochen.');
  }} onPointerMove={event => {
    const active = drag.current;
    if (!interactive || !active || active.pointer !== event.pointerId) return;
    event.preventDefault(); event.stopPropagation();
    if (!active.moved && Math.hypot(event.clientX - active.start.x, event.clientY - active.start.y) < 6) return;
    active.moved = true; setGhost({ x: event.clientX, y: event.clientY, source: active.source }); setOver(target(event.clientX, event.clientY));
  }} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)} onLostPointerCapture={event => finish(event, true)}>
    <p>Ziehe eine Karte auf den passenden Platz. Oder wähle erst die Karte und dann den Platz mit der Tastatur oder durch Antippen.</p>
    <div className="matching-bank" role="group" aria-label="Zuordnungskarten">{order.filter(source => !state.placements.includes(source)).map(source => <div key={source}>
      {sourceButton(source)}<AudioButton card={pairCard(c, source, 'right')} label={`Karte ${source + 1} anhören`} enabled={interactive} play={play} readText={c.mediaReadText} />
    </div>)}</div>
    <div className="matching-rows">{pairs.map((_, row) => { const source = state.placements[row] ?? -1, card = pairCard(c, row, 'left'); return <div className={`matching-row${over === row ? ' over' : ''}`} key={row}>
      <div><TaskContent card={card} /><span className="visually-hidden" id={`${descriptionId}-prompt-${row}`}>{card.text || `Bild- oder Tonaufgabe ${row + 1}`}</span><AudioButton card={card} label={`Aufgabe ${row + 1} anhören`} enabled={interactive} play={play} readText={c.mediaReadText} /></div>
      <div>
        <button type="button" className="matching-drop" onContextMenu={event => event.preventDefault()} data-match-target={row} disabled={!interactive} aria-pressed={source >= 0 && selected === source} aria-label={`Zuordnungsplatz ${row + 1}`} aria-describedby={`${descriptionId}-prompt-${row}`} onPointerDown={event => { if (source >= 0) begin(event, source); }} onClick={event => { if (event.detail !== 0 && suppressed.current === source) { suppressed.current = null; return; } if (selected !== null) place(row, selected); else if (source >= 0) setSelected(source); }}>{source >= 0 ? <TaskContent card={pairCard(c, source, 'right')} /> : 'Hier ablegen'}</button>
        {source >= 0 && <div className="matching-placed-actions"><AudioButton card={pairCard(c, source, 'right')} label={`Zugeordnete Karte ${row + 1} anhören`} enabled={interactive} play={play} readText={c.mediaReadText} /><button type="button" disabled={!interactive} onClick={() => { act({ type: 'place', row, source: -1 }); setSelected(null); }}>Zurücklegen</button></div>}
        {state.checked && <span role="status">{matchingRight(c, row, source) ? '✓ Richtig' : source < 0 ? 'Noch leer' : 'Noch nicht passend'}</span>}
      </div>
    </div>; })}</div>
    <div className="learning-actions"><button type="button" disabled={!interactive} onClick={() => act({ type: 'check' })}>Zuordnungen prüfen</button><button type="button" disabled={!interactive} onClick={() => { setSelected(null); act({ type: 'restart' }); }}>Nochmal</button></div>
    {state.completed && <p role="status">Geschafft! Alle Paare passen.</p>}
    {message && <p role="status">{message}</p>}
    {ghost && createPortal(<div className="matching-ghost" style={{ left: ghost.x + 12, top: ghost.y + 12 }} aria-hidden="true"><TaskContent card={pairCard(c, ghost.source, 'right')} /></div>, document.body)}
  </div>;
}
function MemoryTask({ state, c, interactive, act, play, audioBusy }: Shared) {
  const deck = memoryDeck(c), latest = useRef({ act, interactive });
  useEffect(() => { latest.current = { act, interactive }; });
  const openKey = state.open.join(',');
  useEffect(() => {
    if (!interactive || audioBusy || !openKey.includes(',')) return;
    const timer = setTimeout(() => { if (latest.current.interactive) latest.current.act({ type: 'resolve' }); }, 900);
    return () => clearTimeout(timer);
  }, [interactive, openKey, state.exercise, audioBusy]);
  return <>
    <div className="memory-grid task-memory-grid" style={{ gridTemplateColumns: `repeat(${Math.max(2, Math.min(6, c.columns || 4))}, minmax(0, 1fr))` }}>
      {deck.map((entry, i) => { const face = state.open.includes(i) || state.matched.includes(i), card = pairCard(c, entry.pair, entry.side); return <div key={i} className={state.matched.includes(i) ? 'matched' : ''}>
        <button type="button" className="memory-card" disabled={!interactive || state.matched.includes(i) || state.open.includes(i) || state.open.length === 2} aria-label={face ? `Aufgedeckte Karte ${i + 1}${card.text ? `: ${card.text}` : ''}` : `Karte ${i + 1} aufdecken`} onClick={() => { act({ type: 'flip', card: i }); if (card.media?.audio || c.mediaReadText) play(card); }}>{face ? <TaskContent card={card} /> : <span aria-hidden="true">?</span>}</button>
        {face && <AudioButton card={card} label={`Karte ${i + 1} erneut anhören`} enabled={interactive} play={play} readText={c.mediaReadText} />}
      </div>; })}
    </div>
    <p role="status">{state.matched.length / 2} von {taskPairs(c).length} Paaren · {state.moves} Spielzüge{state.completed && ' · Geschafft!'}</p>
    <button type="button" disabled={!interactive} onClick={() => act({ type: 'restart' })}>Nochmal</button>
  </>;
}
export default function MediaActivity({ element: el }: { element: PageElement }) {
  const { state: response, update, interactive } = useLearning(el), c = el.settings || emptySettings;
  const kind = el.activityKind as MediaActivityKind, state = readMediaActivity(response, kind, c);
  const [notice, setNotice] = useState(''), [audioBusy, setAudioBusy] = useState(false), [epoch, setEpoch] = useState(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sound = useRef<HTMLAudioElement | null>(null), speech = useRef<(() => void) | null>(null);
  const stop = useCallback(() => { sound.current?.pause(); sound.current = null; speech.current?.(); speech.current = null; if (timeout.current) clearTimeout(timeout.current); timeout.current = null; setAudioBusy(false); }, []);
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => { if (!cancelled) stop(); });
    return () => { cancelled = true; stop(); };
  }, [interactive, state.exercise, stop]);
  useEffect(() => {
    const hide = () => { if (document.visibilityState === 'hidden') stop(); };
    window.addEventListener('blur', stop); document.addEventListener('visibilitychange', hide);
    return () => { window.removeEventListener('blur', stop); document.removeEventListener('visibilitychange', hide); };
  }, [stop]);
  function play(card: TaskCard) {
    if (!interactive) return;
    stop(); setNotice(''); setAudioBusy(true);
    timeout.current = setTimeout(stop, 60000);
    if (card.media?.audio) {
      const audio = new Audio(card.media.audio); sound.current = audio; audio.volume = Math.max(0, Math.min(1, c.volume ?? 0.8));
      const done = () => { if (sound.current === audio) stop(); };
      const failed = () => { if (sound.current === audio) { stop(); setNotice('Der Ton konnte nicht abgespielt werden. Bitte erneut versuchen.'); } };
      audio.onended = done; audio.onerror = failed; void audio.play().catch(failed);
    } else if (card.text) {
      speech.current = startGermanSpeech(card.text, { voice: c.voice, rate: c.speechRate, pitch: c.speechPitch, onEnd: stop, onError: stop });
      if (!speech.current) { stop(); setNotice('Zum Vorlesen bitte eine deutsche Stimme auf dem Gerät installieren.'); }
    } else stop();
  }
  function act(action: MediaActivityAction) {
    if (!interactive) return;
    if (action.type === 'restart') { setEpoch(value => value + 1); setNotice(''); }
    if (action.type === 'restart' || action.type === 'question' || action.type === 'resolve') stop();
    const next = mediaActivityStep(state, kind, c, action);
    if (next !== state) update({ mediaActivity: next, score: mediaActivityScore(next, kind, c), completed: next.completed });
  }
  const shared = { state, c, interactive, act, play, audioBusy };
  return <section className="learning-widget media-activity" onPointerDown={event => event.stopPropagation()}>
    <header><strong>{c.title || ({ quiz: 'Quiz', matching: 'Zuordnungen', memory: 'Memory' }[kind])}</strong></header>
    <div className="learning-content">
      {kind === 'quiz' ? <QuizTask {...shared} /> : kind === 'matching' ? <MatchingTask key={`${state.exercise}-${interactive}-${epoch}`} {...shared} /> : <MemoryTask key={`${state.exercise}-${epoch}`} {...shared} />}
      {audioBusy && <button type="button" onClick={stop}>Ton stoppen</button>}
      {notice && <p role="status">{notice}</p>}
    </div>
  </section>;
}
