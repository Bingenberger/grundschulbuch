'use client';
// Settings of the Mathe-Werkzeuge as in the reference (“Rechenschiffchen
// einstellen”, “Rechenrahmen einstellen”): a preview on top, then layout,
// what lies there at the start and the sum or number below.
import type { PageElement } from '@/lib/notebook-model';
import type { LearningSettings } from '@/lib/learning/catalog';
import { mathTool, mathToolSettings, type MathShow, type MathTool as Tool, type MathToolKind } from '@/lib/learning/mathtool';
import { Choices } from '../ui/Choice';
import { TextGlyph } from '../ui/Glyphs';
import { Chips, Section, Slider, Toggle } from '../sheets/SheetParts';
import MathTool from './MathTool';
import { LearningRuntime } from './Runtime';

const showOptions = (what: string): { value: MathShow | 'off'; label: string }[] => [
  { value: 'off', label: 'Nicht zeigen' },
  { value: 'tap', label: `${what} zum Aufdecken (?)` },
  { value: 'on', label: `${what} immer zeigen` },
];

export default function MathToolOptions({ settings, onChange }: { settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void }) {
  const t = mathTool(settings);
  const set = (v: Partial<Tool>) => onChange(mathToolSettings(mathTool(mathToolSettings({ ...t, ...v }))));
  const show = (value: MathShow | 'off') => set({ show: value === 'off' ? undefined : value });
  const blue = t.blue ?? 0, red = t.red ?? 0;
  const preview = { id: 'mt-preview', type: 'widget', widgetKind: 'mathtool', settings: { ...settings, ...mathToolSettings(t) }, x: 0, y: 0, width: 10, height: 10, rotation: 0, locked: false } as PageElement;
  return (
    <div className="mt-options">
      <Choices
        label="Werkzeug"
        value={t.tool}
        onChange={(tool: MathToolKind) => onChange(mathToolSettings(mathTool({ mathTool: tool, mathSize: tool === 'boat' ? 10 : tool === 'abacus' ? 2 : tool === 'ruler' ? 15 : 0 })))}
        options={[
          { value: 'boat', label: 'Rechenschiffchen', icon: 'calculator' },
          { value: 'abacus', label: 'Rechenrahmen', icon: 'org_unit' },
          { value: 'ruler', label: 'Lineal', icon: 'ruler' },
          { value: 'calc', label: 'Taschenrechner', icon: 'calculator' },
        ]}
      />
      {t.tool !== 'ruler' && (
        <div className="mt-preview" aria-hidden="true">
          <LearningRuntime interactive={false}>
            <MathTool element={preview} />
          </LearningRuntime>
        </div>
      )}
      {t.tool === 'boat' && (
        <>
          <Section title="Schiffchen">
            <Chips
              label="Plätze"
              value={t.n}
              options={[5, 10, 20].map((n) => ({ value: n, label: n === 5 ? '5 Plätze (ein Schiffchen)' : `${n} Plätze` }))}
              onChange={(n) => set({ n })}
            />
            {t.n > 5 && (
              <Chips
                label="Anordnung"
                value={t.wide ? 'wide' : 'stack'}
                options={[
                  { value: 'stack', label: 'Untereinander (Fünfer-Reihen)' },
                  { value: 'wide', label: 'Nebeneinander (Zehner-Reihen)' },
                ]}
                onChange={(v) => set({ wide: v === 'wide' })}
              />
            )}
            <p className="mt-note">Jedes Schiffchen hat fünf Plätze – so sieht man die 5 und die 10 auf einen Blick. Die Plättchen liegen immer der Reihe nach, erst die blauen, dann die roten.</p>
          </Section>
          <Section title="Am Anfang liegen schon Plättchen">
            <Slider label="Blaue Plättchen" value={blue} min={0} max={t.n} onChange={(v) => set({ blue: v, red: Math.min(red, t.n - v) })} />
            <Slider
              label="Rote Plättchen"
              value={red}
              min={0}
              max={Math.max(0, t.n - blue)}
              hint="Zum Beispiel 4 blaue und 3 rote für „4 + 3“ – oder leer lassen, dann legen die Kinder selbst."
              onChange={(v) => set({ red: v })}
            />
          </Section>
          <Section title="Rechnung unter den Schiffchen">
            <Chips label="Rechnung" value={t.show ?? 'off'} options={showOptions('Rechnung')} onChange={show} />
            <p className="mt-note">Zeigt, was gelegt ist: „7“ oder mit beiden Farben „4 + 3 = 7“. Zum Aufdecken steht dort ein Fragezeichen, bis man es antippt – auf dem Ausdruck bleibt es als Aufgabe stehen.</p>
          </Section>
        </>
      )}
      {t.tool === 'abacus' && (
        <>
          <Section title="Rechenrahmen">
            <Chips
              label="Größe"
              value={t.n}
              options={[
                { value: 2, label: 'Bis 20 (zwei Reihen)' },
                { value: 10, label: 'Bis 100 (zehn Reihen)' },
              ]}
              onChange={(n) => set({ n, start: Math.min(t.start ?? 0, n * 10) })}
            />
            <p className="mt-note">In jeder Reihe sind zehn Kugeln, nach fünf wechselt die Farbe. Alle Kugeln warten rechts; eine Zahl stellt man ein, indem man sie nach links schiebt – ein Tipp auf eine Kugel nimmt alle davor mit.</p>
          </Section>
          <Section title="Am Anfang ist schon eine Zahl eingestellt">
            <Slider
              label="Zahl"
              value={t.start ?? 0}
              min={0}
              max={t.n * 10}
              hint="Volle Reihen sind Zehner, in der nächsten Reihe liegen die Einer – zum Beispiel 43: vier Reihen und drei Kugeln."
              onChange={(start) => set({ start })}
            />
          </Section>
          <Section title="Zahl unter dem Rahmen">
            <Chips label="Zahl" value={t.show ?? 'off'} options={showOptions('Zahl')} onChange={show} />
          </Section>
        </>
      )}
      {t.tool === 'calc' && (
        <Section title="Kassenzettel">
          <Toggle
            checked={!!t.tape}
            label="Kassenzettel links neben dem Taschenrechner"
            hint="Ein Papierstreifen läuft mit und listet jede Rechnung der Reihe nach auf – so lässt sich nachvollziehen, was gerechnet wurde. Das × oben am Zettel reißt ihn ab (leert ihn)."
            onChange={(tape) => set({ tape })}
          />
        </Section>
      )}
      {t.tool === 'ruler' && (
        <Choices
          label="Länge"
          value={t.n}
          onChange={(n) => set({ n })}
          options={[10, 15, 20, 30].map((value) => ({ value, label: `${value} cm`, icon: <TextGlyph text={String(value)} /> }))}
        />
      )}
    </div>
  );
}
