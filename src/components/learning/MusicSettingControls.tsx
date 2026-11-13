'use client';
import { useId, type ReactNode } from 'react';
export function MusicSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="music-setting-section"><h4>{title}</h4>{children}</section>;
}
export function MusicSelect({ label, value, options, onChange }: { label: string; value: unknown; options: (readonly [string, string])[]; onChange: (value: string) => void }) {
  return <label className="property-label">{label}<select aria-label={label} value={String(value ?? '')} onChange={e => onChange(e.target.value)}>{options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select></label>;
}
export function MusicNumber({ label, value, min, max, step = 1, onChange }: { label: string; value: unknown; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return <label className="property-label">{label}<input aria-label={label} type="number" min={min} max={max} step={step} value={Number(value ?? min)} onChange={e => { if (e.target.value !== '') onChange(Math.min(max, Math.max(min, Number(e.target.value)))); }} /></label>;
}
export function MusicToggle({ label, value, onChange, hint }: { label: string; value: unknown; onChange: (value: boolean) => void; hint?: string }) {
  const description = useId();
  return <label className="music-setting-toggle"><span><input type="checkbox" aria-label={label} aria-describedby={hint ? description : undefined} checked={!!value} onChange={e => onChange(e.target.checked)} /> {label}</span>{hint && <small id={description}>{hint}</small>}</label>;
}
export function MusicColors({ label, value, colors, onChange }: { label: string; value: unknown; colors: string[]; onChange: (value: string) => void }) {
  return <div className="music-colors" role="radiogroup" aria-label={label}>{colors.map(color => <button key={color} type="button" role="radio" aria-label={`${label}: ${color}`} aria-checked={value === color} style={{ background: color }} onClick={() => onChange(color)} />)}</div>;
}
