'use client';
// Settings of the Multi-Timer, with the choices of its “Timer Konfiguration”
// in Lernsachen-Heft: start delay, signal, and up to nine phases (symbol,
// name, minutes, colour; together at most 120 minutes).
import { useLayoutEffect, useRef, useState } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { MULTI_TIMER_COLORS, MULTI_TIMER_ICONS, MULTI_TIMER_NEXT_COLORS, MULTI_TIMER_SOUNDS, multiTimerConfig } from '@/lib/reference/class-runtime';
import { Chips, Slider } from '../sheets/SheetParts';

type Phase = { min: number; name: string; icon: string; color: string };
type Multi = { phases: Phase[]; delay: number; sound: string };
const icons = Object.entries(MULTI_TIMER_ICONS as Record<string, string[]>);
const sounds = MULTI_TIMER_SOUNDS as { id: string; label: string }[];

export default function MultiTimerOptions({ value, onChange }: { value: unknown; onChange: (v: JsonValue) => void }) {
  const m = multiTimerConfig(value) as Multi;
  const latest = useRef(m);
  useLayoutEffect(() => { latest.current = m; });
  const set = (next: Partial<Multi>) => onChange(multiTimerConfig({ ...latest.current, ...next }) as JsonValue);
  const setPhase = (i: number, next: Partial<Phase>) => set({ phases: latest.current.phases.map((p, j) => (j === i ? { ...p, ...next } : p)) });
  const total = m.phases.reduce((n, p) => n + p.min, 0);
  const [picking, setPicking] = useState<number | null>(null);
  const move = (i: number, d: number) => {
    const phases = [...m.phases];
    const [p] = phases.splice(i, 1);
    phases.splice(Math.max(0, Math.min(phases.length, i + d)), 0, p);
    set({ phases });
  };

  return (
    <div className="receipt-options">
      <Slider label="Start-Verzögerung" value={m.delay} min={1} max={60} format={(v) => `${v} Min.`} hint="Minuten bis Start (aufgerundet auf die nächste volle Minute)." onChange={(delay) => set({ delay })} />
      <div className="receipt-option">
        <strong>Tonsignal</strong>
        <Chips label="Tonsignal" value={m.sound} options={sounds.map((s) => ({ value: s.id, label: s.label }))} onChange={(sound) => set({ sound })} />
        <p className="option-hint">Signal bei jedem Phasenwechsel.</p>
      </div>
      <div className="receipt-option">
        <strong>Phasen</strong>
        <p className="option-hint">Zusammen {total} von höchstens 120 Minuten. Auf der Uhr steht jede Phase als farbiger Ring – genau dort, wo der Minutenzeiger in dieser Zeit entlangläuft.</p>
        {m.phases.map((p, i) => (
          <fieldset key={i} className="mt-phase" style={{ borderColor: p.color }}>
            <legend>Phase {i + 1}</legend>
            <div className="mt-phase-row">
              <button type="button" className="mt-phase-icon" aria-label={`Symbol für Phase ${i + 1}: ${p.icon}`} aria-expanded={picking === i} onClick={() => setPicking(picking === i ? null : i)}>{p.icon}</button>
              <input className="text-input" aria-label={`Name von Phase ${i + 1}`} value={p.name} maxLength={40} onChange={(e) => setPhase(i, { name: e.target.value })} />
              <button type="button" className="knopf compact" aria-label={`Phase ${i + 1} nach oben`} disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
              <button type="button" className="knopf compact" aria-label={`Phase ${i + 1} nach unten`} disabled={i === m.phases.length - 1} onClick={() => move(i, 1)}>↓</button>
              <button type="button" className="knopf compact" aria-label={`Phase ${i + 1} löschen`} disabled={m.phases.length === 1} onClick={() => set({ phases: m.phases.filter((_, j) => j !== i) })}>Löschen</button>
            </div>
            {picking === i && (
              <div className="mt-icons">
                {icons.map(([group, list]) => (
                  <div key={group} role="group" aria-label={group}>
                    <small>{group}</small>
                    {list.map((icon) => <button key={icon} type="button" aria-pressed={p.icon === icon} onClick={() => { setPhase(i, { icon }); setPicking(null); }}>{icon}</button>)}
                  </div>
                ))}
              </div>
            )}
            <Slider label="Minuten" value={p.min} min={0} max={Math.min(60, 120 - total + p.min)} format={(v) => `${v} Min.`} onChange={(min) => setPhase(i, { min })} />
            <div className="mt-colors" role="radiogroup" aria-label={`Farbe von Phase ${i + 1}`}>
              {(MULTI_TIMER_COLORS as string[]).map((color) => (
                <button key={color} type="button" role="radio" aria-checked={p.color === color} aria-label={color} style={{ background: color }} onClick={() => setPhase(i, { color })} />
              ))}
            </div>
          </fieldset>
        ))}
        <button type="button" className="knopf" disabled={m.phases.length >= 9 || total >= 120} onClick={() => set({ phases: [...m.phases, { min: Math.min(10, 120 - total), name: `Phase ${m.phases.length + 1}`, icon: '⏱️', color: (MULTI_TIMER_NEXT_COLORS as string[])[m.phases.length % 9] }] })}>
          + Timer hinzufügen
        </button>
      </div>
    </div>
  );
}
