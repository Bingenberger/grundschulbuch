'use client';
import { useState, type ReactNode } from 'react';
import Icon, { type IconName } from '../Icon';

export type OptionSection = {
  id: string;
  label: string;
  icon: IconName;
  content: ReactNode;
};

/**
 * The bottom bar shows the settings of whatever is chosen: a tool, an element
 * or the page. Long lists are split into sections chosen on the left.
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
  const current = visible.find((s) => s.id === chosen) || visible[0];
  return (
    <section className="option-bar" aria-label={label}>
      {visible.length > 1 && (
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
      )}
      <div className="option-content">
        {children}
        {current?.content}
      </div>
    </section>
  );
}
