'use client';
// Settings of the Elevator Pitch as in the reference's dialog: how long the
// ride takes, the text on the curtain, fanfare and applause at the end.
import { useLayoutEffect, useRef } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { PITCH_SECONDS, pitchConfig, secondsText } from '@/lib/reference/class-runtime';
import { Toggle } from '../sheets/SheetParts';
import { Choices } from './OptionControls';

type Pitch = { secs: number; sound: boolean; title: string };
export default function PitchOptions({ value, onChange }: { value: unknown; onChange: (v: JsonValue) => void }) {
  const p = pitchConfig(value) as Pitch;
  const latest = useRef(p);
  useLayoutEffect(() => { latest.current = p; });
  const set = (next: Partial<Pitch>) => onChange({ ...latest.current, ...next } as JsonValue);
  return (
    <div className="receipt-options">
      <Choices label="Wie lange dauert die Fahrt?" value={p.secs} onChange={(secs) => set({ secs })} options={(PITCH_SECONDS as number[]).map((s) => ({ value: s, label: secondsText(s) }))}
        hint="So lange hat man Zeit: Der Fahrstuhl fährt in dieser Zeit vom Erdgeschoss nach oben. Am Gerät lässt sich die Zeit auch umschalten." />
      <label className="receipt-option">
        <strong>Auf dem Vorhang steht</strong>
        <input className="text-input" aria-label="Text auf dem Vorhang" placeholder="Elevator Pitch" value={p.title} maxLength={40} onChange={(e) => set({ title: e.target.value })} />
        <small className="option-hint">z. B. das Thema des Vortrags</small>
      </label>
      <Toggle checked={p.sound} label="Am Ende Fanfare und Applaus" hint="Das Konfetti kommt immer." onChange={(sound) => set({ sound })} />
    </div>
  );
}
