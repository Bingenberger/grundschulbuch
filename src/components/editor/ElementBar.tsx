'use client';
import { useState, type RefObject } from 'react';
import { useEditor } from '@/lib/editor-store';
import { fonts, type PageElement } from '@/lib/notebook-model';
import type { Feature } from '@/lib/features';
import { imageFilters } from '../learning/Appearance';
import RichTextDialog from '../learning/RichTextDialog';
import { ChoiceButton, Choices, ColorChoice, OptionGroup, Stepper } from '../ui/Choice';
import { AlignGlyph, FontGlyph, ImageFilterGlyph, OpacityGlyph, SwatchGlyph } from '../ui/Glyphs';
import OptionBar, { type OptionSection } from './OptionBar';
import { palette } from './DrawingBar';

export type ElementActions = {
  onResize: (factor: number) => void;
  onRotate: (degrees: number) => void;
  onGeometry?: (key: 'width' | 'height', value: number) => void;
  onLayer?: (front: boolean) => void;
  onLock?: () => void;
  onCollection?: () => void;
  onGroup?: (group: boolean) => void;
  onConfigure?: (element: PageElement) => void;
};

const textFrames: [string, string, Parameters<typeof ChoiceButton>[0]['icon']][] = [
  ['none', 'Ohne', 'cancel'],
  ['box', 'Kasten', 'frame'],
  ['note', 'Notizzettel', 'document'],
  ['speech', 'Sprechblase', 'comments'],
  ['thought', 'Denkblase', 'idea'],
  ['shout', 'Rufblase', 'high_priority'],
  ['banner', 'Banner', 'bookmark'],
];
const filterLabels: [string, string][] = [
  ['none', 'Original'], ['scan', 'Arbeitsblatt'], ['gray', 'Schwarzweiß'],
  ['sepia', 'Sepia'], ['bright', 'Heller'], ['contrast', 'Kontrast'],
  ['vivid', 'Kräftig'], ['pale', 'Blass'], ['warm', 'Warm'], ['cold', 'Kalt'],
  ['invert', 'Umkehren'],
];
const imageFrames: [string, string, Parameters<typeof ChoiceButton>[0]['icon']][] = [
  ['none', 'Ohne', 'cancel'],
  ['photo', 'Foto', 'picture'],
  ['polaroid', 'Sofortbild', 'old_time_camera'],
  ['border', 'Dunkler Rand', 'frame'],
  ['round', 'Rund', 'doughnut_chart'],
  ['shadow', 'Schatten', 'night_landscape'],
];

/** Settings of the selected element(s) in the bottom bar. */
export default function ElementBar({
  features,
  elements,
  textArea,
  actions,
}: {
  features: Set<Feature>;
  elements: PageElement[];
  textArea?: RefObject<HTMLTextAreaElement | null>;
  actions: ElementActions;
}) {
  const s = useEditor();
  const [rich, setRich] = useState(false);
  const has = (f: Feature) => features.has(f);
  const first = elements.length === 1 ? elements[0] : undefined;
  const allLocked = elements.every((el) => el.locked);
  const locked = first?.locked ?? allLocked;
  const patch = (values: Partial<PageElement>) => s.patchElements(values);
  const sections: OptionSection[] = [];
  const colorful = first && ['text', 'shape', 'stroke', 'sticker'].includes(first.type);

  if (first && has('elementStyle') && !locked) {
    sections.push({
      id: 'style',
      label: 'Gestalten',
      icon: 'settings',
      content: (
        <>
          {(first.type === 'widget' || first.type === 'activity') && actions.onConfigure && (
            <OptionGroup label={first.type === 'widget' ? 'Lernwerkzeug' : 'Übung'}>
              <ChoiceButton icon="settings" label="Aufgabe gestalten" onClick={() => actions.onConfigure!(first)} />
            </OptionGroup>
          )}
          {first.type === 'text' && (
            <>
              <OptionGroup label="Text" plain>
                <textarea
                  className="option-text"
                  aria-label="Text"
                  ref={textArea}
                  value={first.text}
                  onChange={(e) => patch({ text: e.target.value, runs: undefined })}
                />
              </OptionGroup>
              <Stepper
                label="Schriftgröße"
                value={first.fontSize || 18}
                min={6}
                max={150}
                step={2}
                unit="pt"
                onChange={(fontSize) => patch({ fontSize })}
              />
              <OptionGroup label="Auszeichnung">
                <ChoiceButton
                  icon={<span className="font-glyph"><strong>F</strong></span>}
                  label="Fett"
                  pressed={!!first.bold}
                  onClick={() => patch({ bold: !first.bold })}
                />
                {has('elementArrange') && (
                  <ChoiceButton icon="rules" label="Wörter einzeln formatieren" onClick={() => setRich(true)} />
                )}
              </OptionGroup>
            </>
          )}
          {(first.type === 'image' || first.type === 'audio') && (
            <OptionGroup label="Beschreibung" plain>
              <input
                className="option-input"
                aria-label="Bildbeschreibung"
                value={first.alt || ''}
                maxLength={300}
                onChange={(e) => patch({ alt: e.target.value })}
              />
            </OptionGroup>
          )}
          {first.type === 'image' && (
            <OptionGroup label="Bild">
              <ChoiceButton icon="synchronize" label="Spiegeln" pressed={!!first.flip} onClick={() => patch({ flip: !first.flip })} />
            </OptionGroup>
          )}
          {colorful && (
            <OptionGroup label="Farbe">
              {palette.map(([color, label]) => (
                <ChoiceButton
                  key={color}
                  icon={<SwatchGlyph color={color} />}
                  label={label}
                  pressed={first.color.toLowerCase() === color}
                  onClick={() => patch({ color })}
                />
              ))}
              <ColorChoice label="Eigene Farbe" ariaLabel="Farbe des Elements" value={first.color} onChange={(color) => patch({ color })} />
            </OptionGroup>
          )}
          {first.type === 'shape' && (
            <>
              <OptionGroup label="Füllung">
                <ColorChoice label="Füllfarbe" value={first.fill || '#ffffff'} onChange={(fill) => patch({ fill })} />
              </OptionGroup>
              <Stepper
                label="Linienstärke"
                value={first.strokeWidth ?? 0.4}
                min={0}
                max={10}
                step={0.2}
                unit="mm"
                onChange={(strokeWidth) => patch({ strokeWidth })}
              />
            </>
          )}
          {has('elementArrange') && (
            <Choices
              label="Deckkraft"
              value={first.opacity ?? 1}
              onChange={(opacity) => patch({ opacity })}
              options={Array.from(new Set([1, 0.75, 0.5, 0.25, first.opacity ?? 1])).map((n) => ({
                value: n,
                label: `${Math.round(n * 100)} %`,
                icon: <OpacityGlyph opacity={n} color={first.color} />,
              }))}
            />
          )}
        </>
      ),
    });
    if (first.type === 'text')
      sections.push(
        {
          id: 'font',
          label: 'Schrift',
          icon: 'kindle',
          content: (
            <>
              <OptionGroup label="Schrift">
                {Object.entries(fonts).map(([font, label]) => (
                  <ChoiceButton
                    key={font}
                    icon={<FontGlyph font={font} />}
                    label={label}
                    pressed={first.font === font}
                    onClick={() => patch({ font: font as PageElement['font'] })}
                  />
                ))}
              </OptionGroup>
              <Choices
                label="Ausrichtung"
                value={first.align || 'left'}
                onChange={(align) => patch({ align })}
                options={(
                  [['left', 'Links'], ['center', 'Mitte'], ['right', 'Rechts'], ['justify', 'Blocksatz']] as const
                ).map(([value, label]) => ({ value, label, icon: <AlignGlyph align={value} /> }))}
              />
              <Stepper
                label="Zeilenabstand"
                value={first.lineHeight || 1.6}
                min={0.8}
                max={3}
                step={0.1}
                onChange={(lineHeight) => patch({ lineHeight })}
              />
            </>
          ),
        },
        {
          id: 'textframe',
          label: 'Textkasten',
          icon: 'comments',
          content: (
            <Choices
              label="Textkasten"
              value={first.textFrame || 'none'}
              onChange={(textFrame) => patch({ textFrame })}
              options={textFrames.map(([value, label, icon]) => ({ value, label, icon }))}
            />
          ),
        },
      );
    if (first.type === 'image')
      sections.push(
        {
          id: 'filter',
          label: 'Bildfilter',
          icon: 'gallery',
          content: (
            <Choices
              label="Bildfilter"
              value={first.imageFilter || 'none'}
              onChange={(imageFilter) => patch({ imageFilter })}
              options={filterLabels.map(([value, label]) => ({
                value,
                label,
                icon: <ImageFilterGlyph src={first.src} filter={imageFilters[value] || 'none'} />,
              }))}
            />
          ),
        },
        {
          id: 'imageframe',
          label: 'Rahmen & Ausschnitt',
          icon: 'frame',
          content: (
            <>
              <Choices
                label="Bildrahmen"
                value={first.imageFrame || 'none'}
                onChange={(imageFrame) => patch({ imageFrame })}
                options={imageFrames.map(([value, label, icon]) => ({ value, label, icon }))}
              />
              <OptionGroup label="Bildausschnitt">
                {(['x', 'y', 'width', 'height'] as const).map((key) => {
                  const crop = first.crop || { x: 0, y: 0, width: 1, height: 1 };
                  return (
                    <label className="option-slider" key={key}>
                      <span>
                        {{ x: 'Links', y: 'Oben', width: 'Breite', height: 'Höhe' }[key]} · {Math.round(crop[key] * 100)} %
                      </span>
                      <input
                        type="range"
                        min={key === 'width' || key === 'height' ? 0.05 : 0}
                        max="1"
                        step=".01"
                        value={crop[key]}
                        onChange={(e) => {
                          const next = { ...crop, [key]: Number(e.target.value) };
                          if (next.x + next.width > 1) {
                            if (key === 'x') next.width = 1 - next.x;
                            else next.x = 1 - next.width;
                          }
                          if (next.y + next.height > 1) {
                            if (key === 'y') next.height = 1 - next.y;
                            else next.y = 1 - next.height;
                          }
                          next.width = Math.max(0.02, next.width);
                          next.height = Math.max(0.02, next.height);
                          next.x = Math.min(next.x, 1 - next.width);
                          next.y = Math.min(next.y, 1 - next.height);
                          patch({ crop: next });
                        }}
                      />
                    </label>
                  );
                })}
                <ChoiceButton icon="panorama" label="Ganzes Bild" onClick={() => patch({ crop: { x: 0, y: 0, width: 1, height: 1 } })} />
              </OptionGroup>
            </>
          ),
        },
      );
  }

  sections.push({
    id: 'arrange',
    label: 'Anordnen',
    icon: 'org_unit',
    content: (
      <>
        {!allLocked && (
          <OptionGroup label="Größe & Drehung">
            <ChoiceButton icon="plus" label="Größer" onClick={() => actions.onResize(1.1)} />
            <ChoiceButton icon="minus" label="Kleiner" onClick={() => actions.onResize(1 / 1.1)} />
            <ChoiceButton icon="rotate_to_landscape" label="Links drehen" onClick={() => actions.onRotate(-15)} />
            <ChoiceButton icon="rotate_to_portrait" label="Rechts drehen" onClick={() => actions.onRotate(15)} />
          </OptionGroup>
        )}
        {has('elementArrange') && actions.onLayer && (
          <OptionGroup label="Ebene">
            <ChoiceButton icon="up" label="Nach vorn" onClick={() => actions.onLayer!(true)} />
            <ChoiceButton icon="down" label="Nach hinten" onClick={() => actions.onLayer!(false)} />
            {elements.length > 1 && actions.onGroup && (
              <>
                <ChoiceButton icon="collect" label="Gruppieren" onClick={() => actions.onGroup!(true)} />
                <ChoiceButton icon="tree_structure" label="Gruppe lösen" onClick={() => actions.onGroup!(false)} />
              </>
            )}
          </OptionGroup>
        )}
        {(has('elementLock') || has('collection')) && (
          <OptionGroup label="Bearbeiten">
            {has('elementLock') && actions.onLock && (
              <ChoiceButton icon={allLocked ? 'unlock' : 'lock'} label={allLocked ? 'Entsperren' : 'Sperren'} onClick={actions.onLock} />
            )}
            {has('collection') && actions.onCollection && (
              <ChoiceButton icon="filing_cabinet" label="In Sammlung sichern" onClick={actions.onCollection} />
            )}
          </OptionGroup>
        )}
        {allLocked && <span className="option-hint">Gesperrte Elemente lassen sich nicht verändern.</span>}
      </>
    ),
  });

  if (first && !locked && has('elementGeometry') && actions.onGeometry)
    sections.push({
      id: 'geometry',
      label: 'Maße & Position',
      icon: 'ruler',
      content: (
        <>
          <Stepper label="Breite" value={first.width} min={1} max={400} unit="mm" onChange={(n) => actions.onGeometry!('width', n)} />
          <Stepper label="Höhe" value={first.height} min={1} max={400} unit="mm" onChange={(n) => actions.onGeometry!('height', n)} />
          <Stepper label="Drehung" value={Math.round(first.rotation)} min={-180} max={180} step={5} unit="°" onChange={(rotation) => patch({ rotation })} />
          <Stepper label="Abstand links" value={Math.round(first.x)} min={-297} max={594} unit="mm" onChange={(x) => patch({ x })} />
          <Stepper label="Abstand oben" value={Math.round(first.y)} min={-297} max={594} unit="mm" onChange={(y) => patch({ y })} />
        </>
      ),
    });

  return (
    <>
      <OptionBar
        key={`${first?.id || elements.length}-${first?.type}`}
        label={elements.length === 1 ? 'Element einstellen' : `${elements.length} Elemente einstellen`}
        sections={sections}
      />
      {rich && first && (
        <RichTextDialog element={first} onClose={() => setRich(false)} onSave={patch} />
      )}
    </>
  );
}
