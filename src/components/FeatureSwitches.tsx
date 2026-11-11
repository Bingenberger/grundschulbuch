'use client';
import { CHILD_FEATURES, type ChildFeature } from '@/lib/child-features.mjs';
import type { IconName } from './Icon';
import { ChoiceButton, OptionGroup } from './ui/Choice';

const info: Record<ChildFeature, [IconName, string]> = {
  pen: ['signature', 'Stift'],
  eraser: ['radierer', 'Radierer'],
  text: ['document', 'Text schreiben'],
  image: ['picture', 'Bilder einfügen'],
  imageUpload: ['camera', 'Eigene Bilder & Fotos'],
  imageSearch: ['search', 'Bilder suchen'],
  imageEdit: ['edit_image', 'Bilder bearbeiten'],
  pages: ['seiten', 'Seitenübersicht'],
  readAloud: ['speaker', 'Vorlesen'],
  brushFountain: ['fueller', 'Füller'],
  brushWater: ['pinsel', 'Aquarell'],
  fill: ['farbeimer', 'Farbeimer'],
  eyedropper: ['pipette', 'Pipette'],
  guides: ['ruler', 'Lineal & Geodreieck'],
  shapeRecognition: ['workflow', 'Formen erkennen'],
  eraserOptions: ['settings', 'Radierer einstellen'],
  elementStyle: ['template', 'Farbe & Schrift ändern'],
};

const groups: [string, ChildFeature[]][] = [
  ['Werkzeuge', ['pen', 'eraser', 'text', 'image', 'pages', 'readAloud']],
  ['Bilder', ['imageUpload', 'imageSearch', 'imageEdit']],
  ['Stift & Radierer', ['brushFountain', 'brushWater', 'fill', 'eyedropper', 'guides', 'shapeRecognition', 'eraserOptions']],
  ['Gestalten', ['elementStyle']],
];

/** On/off buttons for the functions children see in their notebooks. */
export default function FeatureSwitches({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: readonly ChildFeature[];
  onChange: (features: ChildFeature[]) => void;
  disabled?: boolean;
}) {
  const toggle = (f: ChildFeature) =>
    onChange(CHILD_FEATURES.filter((x) => (x === f ? !value.includes(f) : value.includes(x))));
  return (
    <div className="feature-switches" role="group" aria-label={label}>
      {groups.map(([group, list]) => (
        <OptionGroup key={group} label={group}>
          {list.map((f) => (
            <ChoiceButton
              key={f}
              icon={info[f][0]}
              label={info[f][1]}
              pressed={value.includes(f)}
              disabled={disabled}
              onClick={() => toggle(f)}
            />
          ))}
        </OptionGroup>
      ))}
    </div>
  );
}
