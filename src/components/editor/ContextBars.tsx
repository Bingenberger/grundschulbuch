'use client';
import type { PageElement } from '@/lib/notebook-model';
import type { Feature } from '@/lib/features';
import type { IconName } from '../Icon';
import { ChoiceButton, OptionGroup } from '../ui/Choice';
import OptionBar from './OptionBar';

const typeIcons: Record<string, [IconName, string]> = {
  text: ['document', 'Text'],
  image: ['picture', 'Bild'],
  stroke: ['signature', 'Zeichnung'],
  audio: ['audio_file', 'Ton'],
  shape: ['workflow', 'Form'],
  sticker: ['like', 'Symbol'],
  widget: ['puzzle', 'Lernwerkzeug'],
  activity: ['puzzle', 'Übung'],
  embed: ['globe', 'Einbettung'],
};

/** Bottom bar for “Auswahl” while nothing is selected. */
export function SelectBar({
  features,
  elements,
  multi,
  onMulti,
  onSelect,
}: {
  features: Set<Feature>;
  elements: PageElement[];
  multi: boolean;
  onMulti: (on: boolean) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <OptionBar label="Auswahl">
      {features.has('elementArrange') && (
        <OptionGroup label="Auswählen">
          <ChoiceButton
            icon="todo_list"
            label="Mehrere auswählen"
            pressed={multi}
            onClick={() => onMulti(!multi)}
          />
        </OptionGroup>
      )}
      {elements.length > 0 && (
        <OptionGroup label={`Elemente der Seite (${elements.length})`}>
          {elements.map((el) => {
            const [icon, type] = typeIcons[el.type] || ['document', 'Element'];
            const name =
              el.text?.slice(0, 18) || (el.settings?.title as string | undefined) || el.alt || type;
            return (
              <ChoiceButton
                key={el.id}
                icon={el.locked ? 'lock' : icon}
                label={name}
                title={el.locked ? `${type} · gesperrt` : type}
                onClick={() => onSelect(el.id)}
              />
            );
          })}
        </OptionGroup>
      )}
      <span className="option-hint">Tippe ein Element auf der Seite an, um es zu verschieben und einzustellen.</span>
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
