'use client';
// Settings of Lärmampel and Applausometer with the choices of the reference's
// dialog: kind, how quiet / how long, microphone sensitivity, a chime, the
// words of the eight levels – and its preview.
import { useLayoutEffect, useRef } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { APPLAUSE_SECONDS, APPLAUSE_WORDS, applauseConfig, applausePicture, MIC_SENSITIVITY, NOISE_LIMITS } from '@/lib/reference/class-runtime';
import { Slider, Toggle } from '../sheets/SheetParts';
import { Choices } from './OptionControls';

type Applause = { mode: 'applause' | 'noise'; secs: number; sens: number; limit: number; chime: boolean; words: string[] };

export default function ApplauseOptions({ value, onChange }: { value: unknown; onChange: (v: JsonValue) => void }) {
  const a = applauseConfig(value) as Applause;
  const latest = useRef(a);
  useLayoutEffect(() => { latest.current = a; });
  const set = (next: Partial<Applause>) => onChange(applauseConfig({ ...latest.current, ...next }) as JsonValue);
  const noise = a.mode === 'noise';
  const words = APPLAUSE_WORDS as string[];
  return (
    <div className="receipt-options">
      <div className="applause-preview" aria-hidden="true" dangerouslySetInnerHTML={{ __html: applausePicture(a, false, 520, 288) }} />
      <Choices label="Was soll es sein?" value={a.mode} onChange={(mode) => set({ mode })} options={[{ value: 'applause', label: 'Applausometer: Applaus messen' }, { value: 'noise', label: 'Lärmampel: hört immer zu' }]}
        hint={`${noise ? 'Die Ampel hört zu, bis du sie ausschaltest: grün, gelb oder rot – je nachdem, wie laut es ist. Sie zählt auch die Leise-Zeit.' : 'Ein Tipp auf „Messen!“: 3, 2, 1, los – dann wird geklatscht und gejubelt. Die lauteste Stelle zählt; die Stufe leuchtet auf und ihr Wort wird vorgelesen.'} Aufgenommen wird nichts, nur die Lautstärke wird gemessen.`} />
      {noise ? (
        <>
          <Choices label="Wie leise soll es sein?" value={a.limit} onChange={(limit) => set({ limit })} options={(NOISE_LIMITS as { v: number; label: string }[]).map((l) => ({ value: l.v, label: l.label }))} />
          <Toggle checked={a.chime} label="Leiser Hinweiston, wenn die Ampel rot wird" onChange={(chime) => set({ chime })} />
        </>
      ) : (
        <Choices label="Wie lange wird gemessen?" value={a.secs} onChange={(secs) => set({ secs })} options={(APPLAUSE_SECONDS as number[]).map((s) => ({ value: s, label: `${s} Sekunden` }))} />
      )}
      <Slider label={`Mikrofon: ${MIC_SENSITIVITY[a.sens - 1]} empfindlich`} value={a.sens} min={1} max={5} format={(v) => MIC_SENSITIVITY[v - 1]} hint="Zeigt die Skala zu schnell alles, nimm weniger; bleibt sie fast leer, nimm mehr." onChange={(sens) => set({ sens })} />
      {!noise && (
        <div className="receipt-option">
          <strong>Die Wörter der Stufen (von leise bis laut)</strong>
          <div className="applause-words">
            {a.words.map((w, i) => (
              <input key={i} className="text-input" aria-label={`Wort für Stufe ${i + 1}`} placeholder={words[i]} value={w} maxLength={24} onChange={(e) => set({ words: a.words.map((x, j) => (j === i ? e.target.value : x)) })} />
            ))}
          </div>
          <button type="button" className="knopf compact" onClick={() => set({ words: [...words] })}>Wie am Anfang</button>
        </div>
      )}
    </div>
  );
}
