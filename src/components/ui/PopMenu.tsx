'use client';
// Small menu that opens below its button (book and folder actions in the shelf).
// Every entry has an icon and a text, as everywhere in the app.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Icon, { type IconName } from '../Icon';

export function PopMenu({
  label,
  small = false,
  children,
}: {
  label: string;
  small?: boolean;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    // Opens upwards when there is no room below.
    const r = button.current?.getBoundingClientRect();
    setUp(!!r && window.innerHeight - r.bottom < 300 && r.top > window.innerHeight - r.bottom);
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener('pointerdown', away, true);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('pointerdown', away, true);
      window.removeEventListener('keydown', key);
    };
  }, [open]);
  return (
    <div className={`pop-menu${small ? ' is-small' : ''}`} ref={box}>
      <button
        ref={button}
        type="button"
        className="pop-menu-button"
        aria-label={label}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span aria-hidden="true" className="pop-menu-dots">•••</span>
        {!small && <span>Mehr</span>}
      </button>
      {open && (
        <div className={`pop-menu-panel${up ? ' is-up' : ''}`} role="group" aria-label={label}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  icon,
  label,
  pressed,
  danger,
  onClick,
  children,
}: {
  icon: IconName | ReactNode;
  /** Accessible name when it should differ from the visible text. */
  label?: string;
  pressed?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`pop-menu-item${danger ? ' is-danger' : ''}`}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      <span className="pop-menu-icon">{typeof icon === 'string' ? <Icon name={icon as IconName} size={18} /> : icon}</span>
      <span>{children}</span>
      {pressed && <span className="pop-menu-check" aria-hidden="true">✓</span>}
    </button>
  );
}

/** Folder in the folder's own colour. */
export function FolderGlyph({ color }: { color: string }) {
  return (
    <svg className="folder-glyph" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 6.5a2 2 0 0 1 2-2h4.6l2 2.2h8.4a2 2 0 0 1 2 2v9.8a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z" fill={color} />
      <path d="M2.5 9.2h19v9.3a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z" fill="#fff" fillOpacity=".22" />
    </svg>
  );
}
