'use client';
import Icon, { type IconName } from '../Icon';
import type { Feature } from '@/lib/features';

export type RailItem =
  | 'select' | 'pen' | 'eraser' | 'text' | 'image' | 'audio' | 'internet' | 'learning'
  | 'insert' | 'page';

const items: [RailItem, IconName, string][] = [
  ['select', 'cursor', 'Auswahl'],
  ['pen', 'signature', 'Stift'],
  ['eraser', 'radierer', 'Radierer'],
  ['text', 'document', 'Text'],
  ['image', 'picture', 'Bild'],
  ['audio', 'audio_file', 'Ton'],
  ['internet', 'globe', 'Internet'],
  ['learning', 'puzzle', 'Lernwerkzeuge'],
  ['insert', 'approval', 'Einfügen'],
];

/** The reduced main toolbar on the left edge, shared by teachers and children. */
export default function ToolRail({
  features,
  active,
  onChoose,
}: {
  features: Set<Feature>;
  active: RailItem | null;
  onChoose: (item: RailItem) => void;
}) {
  const button = ([id, icon, label]: [RailItem, IconName, string]) =>
    features.has(id as Feature) && (
      <button
        key={id}
        type="button"
        className="rail-button"
        aria-pressed={active === id}
        onClick={() => onChoose(id)}
      >
        <Icon name={icon} size={30} />
        <span>{label}</span>
      </button>
    );
  return (
    <nav className="tool-rail" aria-label="Werkzeuge">
      {items.map(button)}
      <span className="rail-spacer" />
      {button(['page', 'rules', 'Seite'])}
    </nav>
  );
}
