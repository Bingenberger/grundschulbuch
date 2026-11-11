'use client';
import type { Feature } from '@/lib/features';
import type { IconName } from '../Icon';
import { ChoiceButton, OptionGroup } from '../ui/Choice';
import OptionBar from './OptionBar';

/** Bottom bar for “Auswahl” while nothing is selected: kept short on purpose. */
export function SelectBar({
  features,
  multi,
  onMulti,
  onSelectAll,
}: {
  features: Set<Feature>;
  multi: boolean;
  onMulti: (on: boolean) => void;
  onSelectAll?: () => void;
}) {
  return (
    <OptionBar label="Auswahl">
      {features.has('elementArrange') && (
        <OptionGroup label="Auswählen">
          <ChoiceButton
            icon="todo_list"
            label="Mehrere antippen"
            title="Jedes angetippte Element kommt zur Auswahl hinzu."
            pressed={multi}
            onClick={() => onMulti(!multi)}
          />
          {onSelectAll && <ChoiceButton icon="collect" label="Alles auswählen" onClick={onSelectAll} />}
        </OptionGroup>
      )}
      <span className="option-hint">
        Tippe ein Element an, um es zu verschieben und einzustellen.
        {features.has('elementArrange') ? ' Für mehrere Elemente einen Rahmen um sie ziehen.' : ''}
      </span>
    </OptionBar>
  );
}

export type InsertAction = 'shapes' | 'stamp' | 'templates' | 'worksheet' | 'collection' | 'internet';

const insertItems: [InsertAction, IconName, string][] = [
  ['shapes', 'workflow', 'Formen & Symbole'],
  ['stamp', 'approval', 'Stempel'],
  ['templates', 'template', 'Vorlagen'],
  ['worksheet', 'survey', 'Arbeitsblatt'],
  ['collection', 'filing_cabinet', 'Sammlung'],
  ['internet', 'globe', 'Internet'],
];

/** Bottom bar behind “Einfügen”. */
export function InsertBar({
  features,
  onInsert,
}: {
  features: Set<Feature>;
  onInsert: (action: InsertAction) => void;
}) {
  return (
    <OptionBar label="Einfügen">
      <OptionGroup label="Einfügen">
        {insertItems
          .filter(([id]) => features.has(id))
          .map(([id, icon, label]) => (
            <ChoiceButton key={id} icon={icon} label={label} onClick={() => onInsert(id)} />
          ))}
      </OptionGroup>
    </OptionBar>
  );
}
