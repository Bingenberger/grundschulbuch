'use client';
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import Icon, { type IconName } from '../Icon';

export type OptionSection = {
  id: string;
  label: string;
  icon: IconName;
  content: ReactNode;
};

// Folded or not holds for every bar (tool, element, page) and is remembered on
// the device: on a tablet the bar takes much of the screen.
const storageKey = 'grundschulbuch-option-bar-folded';
const listeners = new Set<() => void>();
let folded: boolean | null = null;
function readFolded() {
  if (folded === null) {
    try {
      folded = localStorage.getItem(storageKey) === '1';
    } catch {
      folded = false;
    }
  }
  return folded;
}
function setFolded(value: boolean) {
  folded = value;
  try {
    localStorage.setItem(storageKey, value ? '1' : '0');
  } catch {}
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * The bottom bar shows the settings of whatever is chosen: a tool, an element
 * or the page. Long lists are split into sections chosen on the left. It can be
 * folded to a slim strip.
 */
export default function OptionBar({
  label,
  sections,
  children,
}: {
  label: string;
  sections?: OptionSection[];
  children?: ReactNode;
}) {
  const visible = sections?.filter(Boolean) ?? [];
  const [chosen, setChosen] = useState<string>('');
  const isFolded = useSyncExternalStore(subscribe, readFolded, () => false);
  const current = visible.find((s) => s.id === chosen) || visible[0];
  // The fold button sits in the same spot in both states (bottom left), so a
  // second tap undoes the first without hunting for the button.
  const fold = (
    <button
      type="button"
      className="option-fold"
      aria-expanded={!isFolded}
      aria-label={isFolded ? `${label} ausklappen` : undefined}
      onClick={() => setFolded(!isFolded)}
    >
      <Icon name={isFolded ? 'up' : 'down'} size={20} />
      <span>{isFolded ? 'Ausklappen' : 'Einklappen'}</span>
    </button>
  );
  if (isFolded)
    return (
      <section className="option-bar folded" aria-label={label}>
        {fold}
        <span className="option-folded-label" aria-hidden="true" onClick={() => setFolded(false)}>
          {label}
        </span>
      </section>
    );
  return (
    <section className="option-bar" aria-label={label}>
      {visible.length > 1 && (
        <div className="option-side">
          <div className="option-sections" role="group" aria-label={`${label}: Bereiche`}>
            {visible.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={current?.id === s.id}
                onClick={() => setChosen(s.id)}
              >
                <Icon name={s.icon} size={22} />
                <span>{s.label}</span>
              </button>
            ))}
          </div>
          {fold}
        </div>
      )}
      <div className="option-content">
        {children}
        {current?.content}
      </div>
      {visible.length > 1 ? null : fold}
    </section>
  );
}
