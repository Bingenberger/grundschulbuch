'use client';
import type { RefObject } from 'react';
import { useEditor } from '@/lib/editor-store';
import { brushProfiles, type Brush } from '@/lib/brushes';
import { normaliseGuideAngle, type DrawingGuide } from '@/lib/drawing-guide';
import type { Feature } from '@/lib/features';
import type { IconName } from '../Icon';
import { ChoiceButton, Choices, ColorChoice, OptionGroup, Stepper } from '../ui/Choice';
import { DotGlyph, OpacityGlyph, SoftGlyph, StrokeGlyph, SwatchGlyph, TipGlyph } from '../ui/Glyphs';
import PageEyedropper from '../PageEyedropper';
import PageFillTool from '../PageFillTool';
import OptionBar, { type OptionSection } from './OptionBar';

export const palette: [string, string][] = [
  ['#253c42', 'Schwarz'],
  ['#ffffff', 'Weiß'],
  ['#e03131', 'Rot'],
  ['#f76707', 'Orange'],
  ['#fcc419', 'Gelb'],
  ['#2f9e44', 'Grün'],
  ['#1c7ed6', 'Blau'],
  ['#7048e8', 'Lila'],
  ['#8d5524', 'Braun'],
];

const brushes: [Brush, IconName, string, Feature | null][] = [
  ['pen', 'filzstift', 'Filzstift', null],
  ['fountain', 'fueller', 'Füller', 'brushFountain'],
  ['crayon', 'buntstift', 'Buntstift', null],
  ['marker', 'textmarker', 'Textmarker', null],
  ['water', 'pinsel', 'Aquarell', 'brushWater'],
  ['fill', 'farbeimer', 'Farbeimer', 'fill'],
];

const mm = (n: number) => `${String(n).replace('.', ',')} mm`;

/** Settings for pen and eraser in the bottom bar (both editors). */
export default function DrawingBar({
  features,
  surface,
  pageId,
  guide,
  onGuide,
  fillDisabled,
}: {
  features: Set<Feature>;
  surface: RefObject<HTMLDivElement | null>;
  pageId: string;
  guide: DrawingGuide | null;
  onGuide: (guide: DrawingGuide | null) => void;
  fillDisabled?: boolean;
}) {
  const s = useEditor();
  const patch = useEditor.setState;
  const has = (f: Feature) => features.has(f);
  const input = (
    <Choices
      label="Malen mit"
      value={s.pencilOnly}
      onChange={(pencilOnly) => patch({ pencilOnly })}
      options={[
        { value: false, label: 'Stift und Finger', icon: 'touchscreen_smartphone' },
        { value: true, label: 'Nur Stift', icon: 'signature', title: 'Finger und Handballen zeichnen nicht mit.' },
      ]}
    />
  );
  if (s.tool === 'eraser') {
    const e = s.eraser;
    const set = (values: Partial<typeof e>) => patch({ eraser: { ...e, ...values } });
    return (
      <OptionBar label="Radierer einstellen">
        <Choices
          label="Radierart"
          value={e.mode}
          onChange={(mode) => set({ mode })}
          options={[
            { value: 'area', label: 'Fläche radieren', icon: 'radierer' },
            { value: 'stroke', label: 'Ganze Striche', icon: 'cancel' },
          ]}
        />
        {has('eraserOptions') && (
          <>
            <Choices
              label="Größe"
              value={e.size}
              onChange={(size) => set({ size })}
              options={[2, 5, 10, 20].map((n) => ({ value: n, label: mm(n), icon: <DotGlyph size={n / 1.7 + 2} /> }))}
            />
            {e.mode === 'area' && (
              <>
                <Choices
                  label="Spitze"
                  value={e.tip || 'round'}
                  onChange={(tip) => set({ tip })}
                  options={[
                    { value: 'round', label: 'Rund', icon: <TipGlyph tip="round" /> },
                    { value: 'square', label: 'Eckig', icon: <TipGlyph tip="square" /> },
                    { value: 'slant', label: 'Schräg', icon: <TipGlyph tip="slant" /> },
                  ]}
                />
                <Choices
                  label="Kante"
                  value={e.soft}
                  onChange={(soft) => set({ soft })}
                  options={[
                    { value: false, label: 'Hart', icon: <SoftGlyph soft={false} /> },
                    { value: true, label: 'Weich', icon: <SoftGlyph soft /> },
                  ]}
                />
                <Choices
                  label="Stärke"
                  value={e.opacity}
                  onChange={(opacity) => set({ opacity })}
                  options={[0.25, 0.5, 1].map((n) => ({
                    value: n,
                    label: n === 1 ? 'Ganz' : `${n * 100} %`,
                    icon: <OpacityGlyph opacity={n} color="#f48fb1" />,
                  }))}
                />
              </>
            )}
          </>
        )}
        {input}
        <span className="option-hint">
          {e.mode === 'area'
            ? 'Radiert nur die überfahrene Stelle. Bilder und Texte bleiben erhalten.'
            : 'Entfernt ganze Striche. Gesperrte Elemente bleiben erhalten.'}
        </span>
      </OptionBar>
    );
  }
  if (s.tool !== 'pen' && s.tool !== 'marker') return null;
  const brush: Brush = s.tool === 'marker' ? 'marker' : s.brush;
  const profile = brushProfiles[brush];
  const sizes = Array.from(new Set([...profile.sizes, s.penWidth])).sort((a, b) => a - b);
  const opacities = Array.from(new Set([0.25, 0.5, 0.75, 1, profile.opacity, s.penOpacity])).sort((a, b) => b - a);
  const shapes = !['water', 'fill'].includes(brush);
  const main = (
    <>
      <Choices
        label="Stiftart"
        value={brush}
        onChange={(b) => s.chooseBrush(b)}
        options={brushes
          .filter(([, , , feature]) => !feature || has(feature))
          .map(([value, icon, label]) => ({ value, icon, label }))}
      />
      {brush !== 'fill' && (
        <Choices
          label="Dicke"
          value={s.penWidth}
          onChange={(penWidth) => patch({ penWidth })}
          options={sizes.map((n) => ({ value: n, label: mm(n), icon: <StrokeGlyph width={n / (brush === 'marker' || brush === 'water' ? 3 : 1)} /> }))}
        />
      )}
      <OptionGroup label="Farbe">
        {palette.map(([color, label]) => (
          <ChoiceButton
            key={color}
            icon={<SwatchGlyph color={color} />}
            label={label}
            pressed={s.color.toLowerCase() === color}
            onClick={() => patch({ color })}
          />
        ))}
        <ColorChoice label="Eigene Farbe" ariaLabel="Stiftfarbe" value={s.color} onChange={(color) => patch({ color })} />
        {has('eyedropper') && <PageEyedropper key={pageId} surface={surface} />}
      </OptionGroup>
      {brush === 'fill' && (
        <Choices
          label="Füllart"
          value={s.fillMode}
          onChange={(fillMode) => patch({ fillMode })}
          options={[
            { value: 'area', label: 'Zusammenhängende Fläche', icon: 'farbeimer' },
            { value: 'object', label: 'Geschlossene Form', icon: 'workflow' },
          ]}
        />
      )}
      {(brush !== 'fill' || s.fillMode === 'area') && (
        <Choices
          label="Deckkraft"
          value={s.penOpacity}
          onChange={(penOpacity) => patch({ penOpacity })}
          options={opacities.map((n) => ({
            value: n,
            label: `${Math.round(n * 100)} %`,
            icon: <OpacityGlyph opacity={n} color={s.color} />,
          }))}
        />
      )}
      {brush === 'fountain' && (
        <Choices
          label="Schreibhand"
          value={s.nibHand}
          onChange={(nibHand) => patch({ nibHand })}
          options={[
            { value: 'right', label: 'Rechts', icon: 'right' },
            { value: 'left', label: 'Links', icon: 'left' },
          ]}
        />
      )}
      <PageFillTool key={`fill-${pageId}`} surface={surface} disabled={fillDisabled} />
    </>
  );
  const helpers = brush === 'fill' ? null : (
    <>
      {shapes && has('shapeRecognition') && (
        <Choices
          label="Formen erkennen"
          value={s.recognizeShapes}
          onChange={(recognizeShapes) => patch({ recognizeShapes })}
          options={[
            {
              value: true,
              label: 'Erkennen',
              icon: 'workflow',
              title: 'Linien, Kreise, Dreiecke, Rechtecke, Pfeile, Sterne und Herzen: Am Strichende kurz stillhalten, dann loslassen.',
            },
            { value: false, label: 'Aus', icon: 'cancel' },
          ]}
        />
      )}
      {has('guides') && (
        <OptionGroup label="Zeichenhilfe">
          {([['ruler', 'ruler', 'Lineal'], ['triangle', 'geodreieck', 'Geodreieck']] as const).map(([kind, icon, label]) => (
            <ChoiceButton
              key={kind}
              icon={icon}
              label={label}
              pressed={guide?.kind === kind}
              onClick={() =>
                onGuide(guide?.kind === kind ? null : {
                  kind,
                  x: guide?.x ?? 105,
                  y: guide?.y ?? (kind === 'ruler' ? 76 : 95),
                  angle: guide?.angle ?? 0,
                })
              }
            />
          ))}
        </OptionGroup>
      )}
      {guide && (
        <Stepper
          label="Winkel der Zeichenhilfe"
          value={Math.round(guide.angle)}
          min={-360}
          max={360}
          step={15}
          unit="°"
          onChange={(angle) => onGuide({ ...guide, angle: normaliseGuideAngle(angle) })}
        />
      )}
      {input}
      {s.recognizeShapes && shapes && <span className="option-hint">Am Strichende kurz stillhalten, dann loslassen.</span>}
    </>
  );
  const sections: OptionSection[] = [{ id: 'pen', label: 'Stift & Farbe', icon: 'signature', content: main }];
  if (helpers) sections.push({ id: 'helpers', label: 'Hilfen', icon: 'ruler', content: helpers });
  return <OptionBar label="Stift einstellen" sections={sections} />;
}
