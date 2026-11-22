'use client';
import { useState } from 'react';
import { useEditor } from '@/lib/editor-store';
import { fonts, type PageElement } from '@/lib/notebook-model';
import type { Feature } from '@/lib/features';
import RichTextDialog from '../learning/RichTextDialog';
import { ChoiceButton, ChoiceMenu, Choices, ColorChoice, OptionGroup, Stepper } from '../ui/Choice';
import { AlignGlyph, FontGlyph, OpacityGlyph, StrokeGlyph, SwatchGlyph } from '../ui/Glyphs';
import OptionBar, { type OptionSection } from './OptionBar';
import { palette } from './DrawingBar';
import { isPlaceholder } from './image-elements';
import { FrameGlyph, frameFill, frameKind, frameLine, frameWidth, type TextFrameKind } from '../TextFrame';
import { fitText, onRuling, pxToMm } from './text-measure';
import { isFourLine, isLineatur, LINEATUR_KINDS, lineaturLabels, lineaturSettings, type LineaturSettings } from '@/lib/lineatur';
import { LineaturGlyph } from '../learning/LineaturWidget';
import { paeckchenConfig, redraw as redrawPaeckchen } from '@/lib/learning/paeckchen';
import type { JsonValue } from '@/lib/learning/catalog';

const lineaturColors: [string, string][] = [
  ['', 'Blau'],
  ['#8d969b', 'Grau'],
  ['#4caf50', 'Grün'],
  ['#e57373', 'Rot'],
  ['#253c42', 'Dunkel'],
];

export type ElementActions = {
  onResize: (factor: number) => void;
  onRotate: (degrees: number) => void;
  onGeometry?: (key: 'width' | 'height', value: number) => void;
  onLayer?: (front: boolean) => void;
  onLock?: () => void;
  onCollection?: () => void;
  onGroup?: (group: boolean) => void;
  onConfigure?: (element: PageElement) => void;
  /** „Weitere Übung“: mehr Übungen mit demselben Text oder denselben Wörtern (Textsachen). */
  onMoreExercises?: (element: PageElement) => void;
  /** Opens the picture editor (crop, turn, pixelate, effects). */
  onEditImage?: (element: PageElement) => void;
  /** Opens trimming and “Klang verbessern” for a sound. */
  onEditAudio?: (element: PageElement) => void;
  /** Opens the image dialog for a photo placeholder. */
  onFill?: (element: PageElement) => void;
  /** Opens „Video oder Webseite ändern“ for an embedded video, web page or QR poster. */
  onEditEmbed?: (element: PageElement) => void;
};

const textFrames: [TextFrameKind, string][] = [
  ['none', 'Ohne'],
  ['box', 'Kasten'],
  ['note', 'Notizzettel'],
  ['speech', 'Sprechblase'],
  ['thought', 'Denkblase'],
  ['shout', 'Rufblase'],
  ['banner', 'Banner'],
];
const fills: [string, string][] = [
  ['#ffffff', 'Weiß'],
  ['#fff59d', 'Gelb'],
  ['#ffe0b2', 'Orange'],
  ['#f8bbd0', 'Rosa'],
  ['#c8e6c9', 'Grün'],
  ['#bbdefb', 'Blau'],
  ['#e1bee7', 'Lila'],
  ['#eceff1', 'Grau'],
];
const lineWidths: [number, string][] = [
  [0, 'Ohne'],
  [0.4, 'Dünn'],
  [0.8, 'Mittel'],
  [1.4, 'Dick'],
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
  actions,
}: {
  features: Set<Feature>;
  elements: PageElement[];
  actions: ElementActions;
}) {
  const s = useEditor();
  const [rich, setRich] = useState(false);
  const has = (f: Feature) => features.has(f);
  const first = elements.length === 1 ? elements[0] : undefined;
  const allLocked = elements.every((el) => el.locked);
  const locked = first?.locked ?? allLocked;
  const patch = (values: Partial<PageElement>) => s.patchElements(values);
  const page = s.pages.find((p) => p.id === s.activeId);
  // Text on a lined page keeps sitting on the rows when its font changes.
  const patchText = (values: Partial<PageElement>, autoSize = false) =>
    s.edit((p) => ({
      ...p,
      elements: p.elements.map((el) =>
        s.selected.includes(el.id) && !el.locked
          ? el.type === 'text'
            ? fitText({ ...el, ...values }, p, { autoSize })
            : { ...el, ...values }
          : el,
      ),
    }));
  // After a new frame shape, the box grows until the text fits inside again.
  const growToFit = (id: string) => {
    let tries = 0;
    const step = () => {
      const text = document.querySelector<HTMLElement>(`.interaction-surface [data-element-id="${id}"] > div`);
      const state = useEditor.getState();
      const el = state.pages.find((p) => p.id === state.activeId)?.elements.find((e) => e.id === id);
      if (!text || !el) return;
      const need = Math.round(pxToMm(text.offsetHeight) * 100) / 100;
      if (need > el.height + 0.3 && tries++ < 4) {
        state.edit((p) => ({ ...p, elements: p.elements.map((e) => (e.id === id ? { ...e, height: need } : e)) }), false);
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };
  const ruled = first?.type === 'text' && !!page && onRuling(first, page);
  const sections: OptionSection[] = [];
  const colorful = first && (['text', 'shape', 'stroke', 'sticker'].includes(first.type) || !!first.speechText);

  if (first && has('elementStyle') && !locked) {
    sections.push({
      id: 'style',
      label: 'Gestalten',
      icon: 'settings',
      content: (
        <>
          {first.type==='embed' && first.embedKind!=='app' && (
            <OptionGroup label={first.embedKind==='qr' ? 'QR-Plakat' : first.embedKind==='video' ? 'Video' : 'Webseite'}>
              {actions.onEditEmbed && !locked && <ChoiceButton icon="globe" label={first.url ? 'Ändern' : 'Video oder Webseite einfügen'} onClick={() => actions.onEditEmbed!(first)} />}
              {first.url && <ChoiceButton icon="share" label="In neuem Fenster öffnen" onClick={() => window.open(first.url, '_blank', 'noopener')} />}
            </OptionGroup>
          )}
          {isLineatur(first) && (() => {
            const l = lineaturSettings(first);
            const set = (values: Partial<LineaturSettings>) => {
              const next = { ...l, ...values };
              if (!isFourLine(next.ruling)) delete next.house;
              if (!next.color) delete next.color;
              patch({ settings: { ...first.settings, title: lineaturLabels[next.ruling], lineatur: next } });
            };
            return (
              <OptionGroup label="Lineatur">
                <ChoiceMenu
                  label="Art"
                  value={l.ruling}
                  onChange={(ruling) => set({ ruling })}
                  options={LINEATUR_KINDS.map((ruling) => ({ value: ruling, label: lineaturLabels[ruling], icon: <LineaturGlyph settings={{ ruling }} /> }))}
                />
                {isFourLine(l.ruling) && (
                  <ChoiceButton
                    icon={<LineaturGlyph settings={{ ...l, house: true }} wide={1.4} />}
                    label="Zeilenhaus"
                    title="Dach, Erdgeschoss und Keller farbig, mit kleinem Haus am Zeilenanfang (Klasse 1)"
                    pressed={!!l.house}
                    onClick={() => set({ house: !l.house })}
                  />
                )}
                <ChoiceMenu
                  label="Linienfarbe"
                  value={l.color || ''}
                  onChange={(color) => set({ color: color || undefined })}
                  options={lineaturColors.map(([color, label]) => ({ value: color, label, icon: <SwatchGlyph color={color || '#5b8fd6'} /> }))}
                />
              </OptionGroup>
            );
          })()}
          {(first.type === 'widget' || first.type === 'activity') && !isLineatur(first) && actions.onConfigure && (
            <OptionGroup label={first.type === 'widget' ? 'Lernwerkzeug' : 'Übung'}>
              <ChoiceButton icon="settings" label="Aufgabe gestalten" onClick={() => actions.onConfigure!(first)} />
              {first.type === 'widget' && first.widgetKind === 'paeckchen' && (
                <ChoiceButton
                  icon="drehen"
                  label="Neu generieren"
                  title="Dieselben Aufgaben mit anderen Zahlen; eingetragene Ergebnisse werden geleert"
                  onClick={() => patch({ settings: { ...first.settings, paeckchen: redrawPaeckchen(paeckchenConfig(first.settings?.paeckchen)) as unknown as JsonValue } })}
                />
              )}
              {first.type === 'widget' && first.widgetKind === 'textsachen' && actions.onMoreExercises && (
                <ChoiceButton icon="plus" label="Weitere Übung" title="Mehr Übungen mit demselben Text oder denselben Wörtern, jede auf einer eigenen Seite" onClick={() => actions.onMoreExercises!(first)} />
              )}
            </OptionGroup>
          )}
          {first.type === 'text' && (
            <>
              <ChoiceMenu
                label="Schrift"
                value={first.font || ''}
                onChange={(font) => patchText({ font: font as PageElement['font'], referenceFont: undefined }, true)}
                options={Object.entries(fonts).map(([font, label]) => ({ value: font, label, icon: <FontGlyph font={font} /> }))}
              />
              <Stepper
                label="Schriftgröße"
                value={first.fontSize || 18}
                min={6}
                max={150}
                step={2}
                unit="pt"
                onChange={(fontSize) => patchText({ fontSize })}
              />
              <OptionGroup label="Auszeichnung">
                <ChoiceButton
                  icon={<span className="font-glyph"><strong>F</strong></span>}
                  label="Fett"
                  pressed={!!first.bold}
                  onClick={() => patch({ bold: !first.bold })}
                />
                <ChoiceButton
                  icon={<span className="font-glyph"><em style={{ fontFamily: 'Georgia, serif' }}>K</em></span>}
                  label="Kursiv"
                  pressed={!!first.italic}
                  onClick={() => patch({ italic: !first.italic })}
                />
                <ChoiceButton
                  icon={<span className="font-glyph"><u>U</u></span>}
                  label="Unterstrichen"
                  pressed={!!first.underline}
                  onClick={() => patch({ underline: !first.underline })}
                />
                <ChoiceButton
                  icon={<span className="syllable-glyph" aria-hidden="true"><span style={{ color: '#1565c0' }}>Sil</span><span style={{ color: '#d32f2f' }}>ben</span></span>}
                  label="Silben rot und blau"
                  title="Den Text in Silben blau und rot zeigen (Silbenmethode) – beim Schreiben ist er schwarz"
                  pressed={!!first.syllables}
                  onClick={() => patch({ syllables: !first.syllables })}
                />
                {has('elementArrange') && (
                  <ChoiceButton icon="rules" label="Wörter einzeln formatieren" onClick={() => setRich(true)} />
                )}
                {ruled && <ChoiceButton icon="rules" label="Passend zur Lineatur" onClick={() => patchText({}, true)} />}
              </OptionGroup>
              <ChoiceMenu
                label="Ausrichtung"
                value={first.align || 'left'}
                onChange={(align) => patch({ align })}
                options={(
                  [['left', 'Links'], ['center', 'Mitte'], ['right', 'Rechts'], ['justify', 'Blocksatz']] as const
                ).map(([value, label]) => ({ value, label, icon: <AlignGlyph align={value} /> }))}
              />
              {!ruled && (
                <Stepper
                  label="Zeilenabstand"
                  value={first.lineHeight || 1.6}
                  min={0.8}
                  max={3}
                  step={0.1}
                  onChange={(lineHeight) => patch({ lineHeight })}
                />
              )}
            </>
          )}
          {isPlaceholder(first) && (
            <>
              <OptionGroup label="Platzhalter">
                {actions.onFill && (
                  <ChoiceButton icon="camera" label={first.src ? 'Anderes Bild' : 'Bild wählen'} onClick={() => actions.onFill!(first)} />
                )}
                {first.src && (
                  <ChoiceButton icon="remove_image" label="Bild entfernen" onClick={() => patch({ src: undefined, credit: undefined, crop: undefined, alt: '' })} />
                )}
              </OptionGroup>
              <OptionGroup label="Hinweis im Rahmen" plain>
                <input
                  className="option-input"
                  aria-label="Hinweis im Rahmen"
                  value={first.placeholder}
                  maxLength={200}
                  onChange={(e) => patch({ placeholder: e.target.value })}
                />
              </OptionGroup>
            </>
          )}
          {first.type === 'image' && first.src && (
            <OptionGroup label="Bildnachweis" plain>
              <input
                className="option-input"
                aria-label="Bildnachweis"
                placeholder="z. B. Foto: Klasse 2b"
                value={first.credit || ''}
                maxLength={400}
                onChange={(e) => patch({ credit: e.target.value || undefined })}
              />
            </OptionGroup>
          )}
          {first.type === 'audio' && first.src && actions.onEditAudio && (
            <OptionGroup label="Ton">
              <ChoiceButton icon="audio_file" label="Ton bearbeiten" onClick={() => actions.onEditAudio!(first)} />
            </OptionGroup>
          )}
          {['image', 'audio', 'sticker', 'shape', 'stroke'].includes(first.type) && (
            <OptionGroup label={first.type === 'audio' ? 'Name' : 'Beschreibung'} plain>
              <input
                className="option-input"
                aria-label={first.type === 'audio' ? 'Name der Tontaste' : 'Bildbeschreibung'}
                title={first.type === 'audio' ? undefined : '„Seite vorlesen“ liest diese Beschreibung vor'}
                value={first.alt || ''}
                maxLength={300}
                onChange={(e) => patch({ alt: e.target.value })}
              />
            </OptionGroup>
          )}
          {first.type === 'audio' && first.speechText !== undefined && (
            <OptionGroup label="Vorlesetext" plain>
              <textarea className="option-input" aria-label="Vorlesetext" value={first.speechText} maxLength={2000}
                onChange={e=>{if(e.target.value.trim())patch({speechText:e.target.value});}} />
            </OptionGroup>
          )}
          {first.type === 'image' && first.src && has('imageEdit') && actions.onEditImage && (
            <OptionGroup label="Bild">
              <ChoiceButton icon="edit_image" label="Bild bearbeiten" onClick={() => actions.onEditImage!(first)} />
            </OptionGroup>
          )}
          {colorful && (
            <ChoiceMenu
              label="Farbe"
              value={first.color.toLowerCase()}
              onChange={(color) => patch({ color })}
              options={palette.map(([color, label]) => ({ value: color, label, icon: <SwatchGlyph color={color} /> }))}
              face={palette.some(([c]) => c === first.color.toLowerCase()) ? undefined : { icon: <SwatchGlyph color={first.color} />, label: 'Eigene' }}
              extra={<ColorChoice label="Eigene Farbe" ariaLabel="Farbe des Elements" value={first.color} onChange={(color) => patch({ color })} />}
            />
          )}
          {first.type === 'shape' && (
            <>
              <OptionGroup label="Füllung">
                <ChoiceButton icon="cancel" label="Ohne Füllung" pressed={first.fill==='none'} onClick={()=>patch({fill:'none'})}/>
                <ColorChoice label="Füllfarbe" value={first.fill==='none'?'#ffffff':first.fill || '#ffffff'} onChange={(fill) => patch({ fill })} />
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
            <ChoiceMenu
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
          id: 'textframe',
          label: 'Textkasten',
          icon: 'comments',
          content: (
            <>
              <ChoiceMenu
                label="Form"
                value={frameKind(first)}
                onChange={(textFrame) => {
                  patch({ textFrame,referenceFrameId:undefined,referencePadding:undefined,referenceCentered:undefined });
                  growToFit(first.id);
                }}
                options={textFrames.map(([value, label]) => ({ value, label, icon: <FrameGlyph kind={value} /> }))}
              />
              <ChoiceMenu
                label="Hintergrund"
                value={frameFill(first).toLowerCase()}
                onChange={(background) => patch({ background })}
                options={[
                  { value: 'none', label: 'Ohne', icon: 'cancel' },
                  ...fills.map(([color, label]) => ({ value: color, label, icon: <SwatchGlyph color={color} /> })),
                ]}
                face={frameFill(first) === 'none' || fills.some(([c]) => c === frameFill(first).toLowerCase()) ? undefined : { icon: <SwatchGlyph color={frameFill(first)} />, label: 'Eigene' }}
                extra={
                  <ColorChoice
                    label="Eigene Farbe"
                    ariaLabel="Hintergrundfarbe"
                    value={frameFill(first) === 'none' ? '#ffffff' : frameFill(first)}
                    onChange={(background) => patch({ background })}
                  />
                }
              />
              <ChoiceMenu
                label="Rahmenlinie"
                value={frameWidth(first)}
                onChange={(borderWidth) => {
                  patch({ borderWidth });
                  growToFit(first.id);
                }}
                options={Array.from(new Set([...lineWidths.map(([n]) => n), frameWidth(first)])).map((n) => ({
                  value: n,
                  label: lineWidths.find(([w]) => w === n)?.[1] || `${n} mm`,
                  icon: n ? <StrokeGlyph width={n * 3} color={frameLine(first)} /> : 'cancel',
                }))}
              />
              {frameWidth(first) > 0 && (
                <ChoiceMenu
                  label="Rahmenfarbe"
                  value={first.borderColor?.toLowerCase() || ''}
                  onChange={(color) => patch({ borderColor: color || undefined })}
                  options={[
                    { value: '', label: 'Wie die Schrift', icon: <span className="font-glyph" style={{ color: first.color }}>A</span> },
                    ...palette.map(([color, label]) => ({ value: color, label, icon: <SwatchGlyph color={color} /> })),
                  ]}
                  face={!first.borderColor || palette.some(([c]) => c === first.borderColor!.toLowerCase()) ? undefined : { icon: <SwatchGlyph color={first.borderColor} />, label: 'Eigene' }}
                  extra={
                    <ColorChoice
                      label="Eigene Farbe"
                      ariaLabel="Rahmenfarbe"
                      value={frameLine(first)}
                      onChange={(borderColor) => patch({ borderColor })}
                    />
                  }
                />
              )}
            </>
          ),
        },
      );
    if (first.type === 'image' && first.src)
      sections.push({
        id: 'imageframe',
        label: 'Rahmen',
        icon: 'frame',
        content: (
          <Choices
            label="Bildrahmen"
            value={first.imageFrame || 'none'}
            onChange={(imageFrame) => patch({ imageFrame })}
            options={imageFrames.map(([value, label, icon]) => ({ value, label, icon }))}
          />
        ),
      });
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
              <ChoiceButton icon={allLocked ? 'unlock' : 'lock'} label={allLocked ? 'Lösen' : 'Befestigen'} onClick={actions.onLock} />
            )}
            {has('collection') && actions.onCollection && (
              <ChoiceButton icon="filing_cabinet" label="In Sammlung sichern" onClick={actions.onCollection} />
            )}
          </OptionGroup>
        )}
        {/* Eine Übung von Textsachen füllt die Seite gesperrt aus – „Weitere Übung“ ändert sie nicht. */}
        {allLocked && first?.type === 'widget' && first.widgetKind === 'textsachen' && actions.onMoreExercises && (
          <OptionGroup label="Übung">
            <ChoiceButton icon="plus" label="Weitere Übung" title="Mehr Übungen mit demselben Text oder denselben Wörtern, jede auf einer eigenen Seite" onClick={() => actions.onMoreExercises!(first)} />
          </OptionGroup>
        )}
        {first && !locked && has('elementGeometry') && actions.onGeometry && (
          <>
            <Stepper label="Breite" value={first.width} min={1} max={400} unit="mm" onChange={(n) => actions.onGeometry!('width', n)} />
            <Stepper label="Höhe" value={first.height} min={1} max={400} unit="mm" onChange={(n) => actions.onGeometry!('height', n)} />
            <Stepper label="Drehung" value={Math.round(first.rotation)} min={-180} max={180} step={5} unit="°" onChange={(rotation) => patch({ rotation })} />
            <Stepper label="Abstand links" value={Math.round(first.x)} min={-297} max={594} unit="mm" onChange={(x) => patch({ x })} />
            <Stepper label="Abstand oben" value={Math.round(first.y)} min={-297} max={594} unit="mm" onChange={(y) => patch({ y })} />
          </>
        )}
        {allLocked && <span className="option-hint">Befestigte Elemente lassen sich nicht verändern. „Lösen“ macht sie wieder beweglich.</span>}
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
