'use client';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import type { LearningSettings } from '@/lib/learning/catalog';
import { captureGuideEdge, projectToGuideEdge, type DrawingGuide, type GuideEdge } from '@/lib/drawing-guide';
import { assessGeometry, geometryScore, geometrySegmentAt, geometryStep, geometryTasks, geometryTrace, readGeometry, type GeometryAction, type GeometryPoint, type GeometryState } from '@/lib/learning/geometry';
import GeometryGuide, { geometrySurfacePoint } from './GeometryGuide';
import { useLearning } from './Runtime';
export default function GeometryWidget({ element }: { element: PageElement }) {
  const { state: response, update, interactive } = useLearning(element), c = element.settings || {}, state = readGeometry(response, c), tasks = geometryTasks(c);
  function act(action: GeometryAction) { if (!interactive) return; const next = geometryStep(state, c, action); if (next !== state) update({ geometry: next, score: geometryScore(next, c), completed: next.completed }); }
  return <section className="learning-widget geometry-widget" aria-label="Geometrie" onPointerDown={event => event.stopPropagation()}><header><strong>{c.title || 'Geometrie'}</strong></header><div className="learning-content">
    {state.completed ? <div className="guess-certificate" role="status"><h3>Serie beendet!</h3><p>{state.results.filter(r => r.correct).length} von {tasks.length} Formen gelöst.</p><ol>{tasks.map((task, i) => <li key={i}>{state.results[i]?.correct ? '★' : '○'} {task.name}{state.results[i]?.helped ? ' · mit Hilfe' : ''}</li>)}</ol><button type="button" disabled={!interactive} onClick={() => act({ type: 'restart' })}>Nochmal</button></div>
      : <GeometryBoard key={`${state.exercise}:${state.index}:${interactive}`} settings={c} state={state} interactive={interactive} act={act} />}
  </div></section>;
}
function GeometryBoard({ settings: c, state, interactive, act }: { settings: LearningSettings; state: GeometryState; interactive: boolean; act: (action: GeometryAction) => void }) {
  const tasks = geometryTasks(c), task = tasks[state.index], trace = geometryTrace(c), assessment = assessGeometry(task, state.segments), id = useId().replace(/:/g, '');
  const [phase, setPhase] = useState<'ready' | 'preview' | 'draw'>(trace || state.segments.length || state.viewed ? 'draw' : 'ready'), [guide, setGuide] = useState<DrawingGuide | null>(null), [line, setLine] = useState<{ a: GeometryPoint; b: GeometryPoint } | null>(null), [cursor, setCursor] = useState({ x: 100, y: 100 }), [focused, setFocused] = useState(false), [erasing, setErasing] = useState(false);
  const svg = useRef<SVGSVGElement>(null), gesture = useRef<{ pointer: number; a: GeometryPoint; edge?: GuideEdge } | null>(null), keyboard = useRef<GeometryPoint | null>(null);
  const cancel = useCallback(() => { gesture.current = null; keyboard.current = null; setLine(null); }, [setLine]);
  useEffect(() => {
    const blur = () => { cancel(); setPhase(value => value === 'preview' ? 'draw' : value); }, hide = () => { if (document.visibilityState === 'hidden') blur(); };
    window.addEventListener('blur', blur); document.addEventListener('visibilitychange', hide);
    return () => { window.removeEventListener('blur', blur); document.removeEventListener('visibilitychange', hide); };
  }, [cancel]);
  useEffect(() => { if (phase !== 'preview') return; const timer = setTimeout(() => setPhase('draw'), Math.max(1, Math.min(15, c.geometryPreview || 3)) * 1000); return () => clearTimeout(timer); }, [phase, c.geometryPreview]);
  const targetVisible = !interactive || trace || phase === 'preview' || state.solution || state.correct;
  const canDraw = interactive && phase === 'draw' && !state.correct;
  function snapped(point: GeometryPoint, edge?: GuideEdge) { return edge ? projectToGuideEdge(point, edge) : { x: Math.round(point.x / 10) * 10, y: Math.round(point.y / 10) * 10 }; }
  function preview() { cancel(); act({ type: state.viewed ? 'help' : 'preview' }); setPhase('preview'); }
  function action(type: 'undo' | 'reset' | 'check' | 'solution') { cancel(); act({ type }); }
  const width = (Math.max(...task.path.map(p => p.x)) - Math.min(...task.path.map(p => p.x))) / 10, height = (Math.max(...task.path.map(p => p.y)) - Math.min(...task.path.map(p => p.y))) / 10;
  return <>
    <p>Aufgabe {state.index + 1} von {tasks.length} · {task.name}</p><p>Zeichne die Form ab dem roten Startpunkt. Sie ist {width} Kästchen breit und {height} Kästchen hoch. Ein Kästchen ist eine Rastereinheit.</p>
    {!trace && <div className="learning-actions"><button type="button" disabled={!interactive || phase === 'preview' || state.correct} onClick={preview}>{state.viewed ? 'Vorschau wiederholen' : 'Vorlage ansehen'}</button><span role="status">{phase === 'preview' ? `Vorlage für ${c.geometryPreview || 3} Sekunden` : phase === 'ready' ? 'Vorlage ansehen, dann zeichnen.' : 'Jetzt die Form zeichnen.'}</span></div>}
    <svg ref={svg} viewBox="0 0 200 200" className="geometry-board" role="group" aria-label="Zeichenfläche · Pfeile bewegen den Zeichenpunkt, Enter setzt Anfang und Ende einer Strecke" tabIndex={interactive ? 0 : undefined} style={{ touchAction: 'none' }} onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); cancel(); }}
      onPointerDown={event => { if (!canDraw || event.button !== 0 || gesture.current) return; event.preventDefault(); event.stopPropagation(); keyboard.current = null; const point = geometrySurfacePoint(event.currentTarget, event); if (erasing) { act({ type: 'remove', index: geometrySegmentAt(state.segments, point) }); return; } const edge = captureGuideEdge({ ...point, pressure: 0.5 }, guide, 0, 5), a = snapped(point, edge); gesture.current = { pointer: event.pointerId, a, edge }; setLine({ a, b: a }); event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={event => { const current = gesture.current; if (!current || current.pointer !== event.pointerId) return; event.preventDefault(); setLine({ a: current.a, b: snapped(geometrySurfacePoint(event.currentTarget, event), current.edge) }); }}
      onPointerUp={event => { const current = gesture.current; if (!current || current.pointer !== event.pointerId) return; gesture.current = null; setLine(null); act({ type: 'add', segment: { a: current.a, b: snapped(geometrySurfacePoint(event.currentTarget, event), current.edge) } }); }}
      onPointerCancel={cancel} onLostPointerCapture={() => { if (gesture.current) cancel(); }}
      onKeyDown={event => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancel(); return; }
        if (!canDraw) return;
        const delta = ({ ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] } as Record<string, number[]>)[event.key];
        if (delta) { event.preventDefault(); event.stopPropagation(); const step = event.shiftKey ? 1 : 10, point = { x: Math.max(0, Math.min(200, cursor.x + delta[0] * step)), y: Math.max(0, Math.min(200, cursor.y + delta[1] * step)) }; setCursor(point); if (keyboard.current) setLine({ a: keyboard.current, b: point }); }
        else if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) { event.preventDefault(); event.stopPropagation(); if (erasing) { act({ type: 'remove', index: geometrySegmentAt(state.segments, cursor) }); return; } if (keyboard.current) { act({ type: 'add', segment: { a: keyboard.current, b: cursor } }); keyboard.current = null; setLine(null); } else { keyboard.current = cursor; setLine({ a: cursor, b: cursor }); } }
      }}>
      <defs><pattern id={`geometry-grid-${id}`} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#c8d9dc" strokeWidth=".5" /></pattern></defs><rect width="200" height="200" fill={`url(#geometry-grid-${id})`} />
      {targetVisible && <polyline className="geometry-target" points={task.path.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#71836b" strokeDasharray="3 2" strokeWidth="1.2" />}
      <circle cx={task.path[0].x} cy={task.path[0].y} r="2.5" fill="#ba3c46"><title>Startpunkt</title></circle>
      {state.segments.map((segment, i) => <line key={i} className="geometry-segment" x1={segment.a.x} y1={segment.a.y} x2={segment.b.x} y2={segment.b.y} stroke={state.checked ? assessment.matched.includes(i) ? '#32834c' : '#ba3c46' : '#316fab'} strokeWidth="1.4" strokeLinecap="round" />)}
      {line && <line x1={line.a.x} y1={line.a.y} x2={line.b.x} y2={line.b.y} stroke="#316fab" strokeWidth="1.4" strokeDasharray="2 1" />}
      {focused && canDraw && <circle cx={cursor.x} cy={cursor.y} r="2" fill="none" stroke="#253c42" />}
      {guide && interactive && <GeometryGuide guide={guide} change={value => { cancel(); setGuide(value); }} close={() => { cancel(); setGuide(null); }} />}
    </svg>
    {focused && <p role="status">Zeichenpunkt: {cursor.x / 10} Kästchen von links, {cursor.y / 10} von oben. Enter setzt Anfang und Ende einer Strecke.</p>}
    <p>Ziehe vom Anfang zum Ende jeder Strecke. Ohne Zeichenhilfe rasten Punkte im Raster ein. Mit Lineal oder Geodreieck nahe außerhalb einer Kante beginnen; die Strecke folgt dieser Kante. Der Streckenradierer entfernt eine angetippte Strecke vollständig.</p>
    <div className="learning-actions"><button type="button" disabled={!interactive} aria-pressed={erasing} onClick={() => { cancel(); setErasing(value => !value); }}>{erasing ? 'Stift verwenden' : 'Streckenradierer'}</button><button type="button" disabled={!interactive} onClick={() => { cancel(); setGuide({ kind: 'ruler', x: 100, y: 110, angle: 0 }); }}>Lineal</button><button type="button" disabled={!interactive} onClick={() => { cancel(); setGuide({ kind: 'triangle', x: 100, y: 110, angle: 0 }); }}>Geodreieck</button>
      {guide && <><label>Winkel <input aria-label="Winkel der Zeichenhilfe" type="number" min={0} max={359} value={guide.angle} onChange={event => { cancel(); setGuide({ ...guide, angle: Math.max(0, Math.min(359, Number(event.target.value) || 0)) }); }} />°</label><button type="button" onClick={() => { cancel(); setGuide(null); }}>Zeichenhilfe schließen</button></>}</div>
    <p role="status">{state.checked ? state.correct ? '★ Die Form stimmt!' : `${assessment.matched.length} Strecken passen. ${assessment.missing} fehlen oder müssen korrigiert werden, ${assessment.extra} sind zusätzlich oder unpassend.` : `${state.segments.length} Strecken gezeichnet.`}{state.helped && ' · Mit Hilfe'}</p>
    <div className="learning-actions"><button type="button" disabled={!interactive || !state.segments.length || state.correct || phase !== 'draw'} onClick={() => action('check')}>Form prüfen</button><button type="button" disabled={!interactive || !state.segments.length} onClick={() => action('undo')}>Letzte Strecke zurück</button><button type="button" disabled={!interactive || !state.segments.length} onClick={() => action('reset')}>Neu zeichnen</button>
      <button type="button" disabled={!interactive || state.attempts < 2 || state.correct || state.solution} onClick={() => { setPhase('draw'); action('solution'); }}>Lösung zeigen</button><button type="button" disabled={!interactive || state.correct} onClick={() => act({ type: 'skip' })}>Aufgabe überspringen</button><button type="button" disabled={!interactive || !state.correct} onClick={() => act({ type: 'next' })}>{state.index + 1 === tasks.length ? 'Ergebnis ansehen' : 'Nächste Aufgabe'}</button></div>
  </>;
}
