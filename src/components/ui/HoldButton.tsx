'use client';
// Knopf, der erst nach längerem Drücken auslöst (Tafel beenden): ein Balken
// füllt sich am unteren Rand. Mit der Tastatur (Eingabe, Leertaste) löst er sofort aus –
// aus Versehen passiert das nicht.
import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function HoldButton({
  children,
  label,
  hint = 'Zum Beenden 2 Sekunden gedrückt halten',
  ms = 2000,
  className = '',
  onDone,
}: {
  children: ReactNode;
  label: string;
  hint?: string;
  ms?: number;
  className?: string;
  onDone: () => void;
}) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return (
    <button
      type="button"
      className={`hold-button ${holding ? 'is-holding' : ''} ${className}`}
      aria-label={label}
      title={hint}
      style={{ '--hold-ms': `${ms}ms` } as React.CSSProperties}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        stop();
        setHolding(true);
        timer.current = setTimeout(() => {
          timer.current = null;
          setHolding(false);
          onDone();
        }, ms);
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
        // detail 0: mit der Tastatur ausgelöst
        if (e.detail === 0) onDone();
      }}
    >
      {children}
      <span className="hold-hint" aria-hidden="true">
        {holding ? 'Halten …' : 'Halten'}
      </span>
    </button>
  );
}
