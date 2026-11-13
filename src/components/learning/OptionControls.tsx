'use client';
// The choices of the settings pages, drawn the same way everywhere: yes/no as a
// switch, a long row of numbers as a slider, everything else as labelled chips.
import type { ReactNode } from 'react';
import { Chips, Slider, Toggle } from '../sheets/SheetParts';

type Option<T> = { value: T; label: string; icon?: ReactNode };
export function Choices<T extends string | number | boolean>({ label, value, options, onChange, hint }: { label: string; value: T; options: Option<T>[]; onChange: (v: T) => void; hint?: string }) {
  const values = options.map((o) => o.value);
  if (values.length === 2 && values.includes(true as T) && values.includes(false as T))
    return <Toggle checked={value === true} label={label} hint={hint} onChange={(v) => onChange(v as T)} />;
  if (values.length > 5 && values.every((v, i) => typeof v === 'number' && (i === 0 || v === (values[i - 1] as number) + 1))) {
    const text = (n: number) => options.find((o) => o.value === n)?.label ?? String(n);
    return <Slider label={label} value={value as number} min={values[0] as number} max={values[values.length - 1] as number} format={text} hint={hint} onChange={(v) => onChange(v as T)} />;
  }
  return (
    <div className="receipt-option">
      <strong>{label}</strong>
      <Chips label={label} value={value as string | number} options={options.map((o) => ({ value: o.value as string | number, label: o.label }))} onChange={(v) => onChange(v as T)} />
      {hint && <p className="option-hint">{hint}</p>}
    </div>
  );
}
