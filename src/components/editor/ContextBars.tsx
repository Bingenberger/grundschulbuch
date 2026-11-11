'use client';
import type { Feature } from '@/lib/features';
import { useState } from 'react';
import { uuid, type PageElement } from '@/lib/notebook-model';
import { Shape } from '../learning/Appearance';
import { ChoiceButton, Choices, OptionGroup } from '../ui/Choice';
import OptionBar, { type OptionSection } from './OptionBar';

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

const shapes: [string, string][] = [
  ['rect', 'Rechteck'],
  ['rounded', 'Abgerundet'],
  ['ellipse', 'Kreis'],
  ['triangle', 'Dreieck'],
  ['line', 'Linie'],
  ['arrow', 'Pfeil'],
  ['star', 'Stern'],
  ['heart', 'Herz'],
  ['speech', 'Sprechblase'],
  ['thought', 'Denkblase'],
  ['shout', 'Rufblase'],
  ['banner', 'Banner'],
];
const stickers: Record<string, [string, string][]> = {
  Schule: [['✎', 'Stift'], ['📚', 'Bücher'], ['📖', 'Buch'], ['📏', 'Lineal'], ['✂', 'Schere'], ['📌', 'Pinnnadel'], ['📅', 'Kalender'], ['🎒', 'Ranzen'], ['🏫', 'Schule'], ['💡', 'Idee']],
  Gefühle: [['🙂', 'Lächeln'], ['😊', 'Freude'], ['😀', 'Lachen'], ['😢', 'Traurig'], ['😴', 'Müde'], ['😕', 'Unsicher'], ['😮', 'Staunen'], ['😎', 'Cool'], ['🤔', 'Nachdenken'], ['❤️', 'Herz']],
  Tiere: [['🐈', 'Katze'], ['🐕', 'Hund'], ['🐭', 'Maus'], ['🦔', 'Igel'], ['🐘', 'Elefant'], ['🐸', 'Frosch'], ['🐟', 'Fisch'], ['🦋', 'Schmetterling'], ['🐝', 'Biene'], ['🐦', 'Vogel']],
  Natur: [['☀', 'Sonne'], ['☁', 'Wolke'], ['🌧', 'Regen'], ['🌈', 'Regenbogen'], ['❄', 'Schnee'], ['🌳', 'Baum'], ['🌷', 'Blume'], ['🍄', 'Pilz'], ['🍂', 'Blätter'], ['🌍', 'Erde']],
  Alltag: [['🏠', 'Haus'], ['🚌', 'Bus'], ['🚲', 'Fahrrad'], ['🚗', 'Auto'], ['🚦', 'Ampel'], ['🕒', 'Uhr'], ['🥛', 'Milch'], ['🍎', 'Apfel'], ['🍞', 'Brot'], ['👕', 'T-Shirt']],
  Musik: [['♫', 'Noten'], ['♪', 'Note'], ['𝄞', 'Notenschlüssel'], ['🎹', 'Klavier'], ['🥁', 'Trommel'], ['🎸', 'Gitarre'], ['🎵', 'Musik'], ['🎤', 'Mikrofon'], ['🔔', 'Glocke'], ['👏', 'Klatschen']],
  Mathe: [['＋', 'Plus'], ['−', 'Minus'], ['×', 'Mal'], ['÷', 'Geteilt'], ['=', 'Gleich'], ['≠', 'Ungleich'], ['½', 'Halb'], ['¼', 'Viertel'], ['∞', 'Unendlich'], ['€', 'Euro']],
  Wohnen: [['🛏', 'Bett'], ['🪑', 'Stuhl'], ['🚪', 'Tür'], ['🛋', 'Sofa'], ['🪟', 'Fenster'], ['🛁', 'Badewanne'], ['🚿', 'Dusche'], ['🚽', 'Toilette'], ['🧺', 'Korb'], ['🪴', 'Pflanze']],
  Küche: [['🍽', 'Teller'], ['🥄', 'Löffel'], ['🍴', 'Besteck'], ['🔪', 'Messer'], ['🥣', 'Schüssel'], ['☕', 'Tasse'], ['🍳', 'Pfanne'], ['🥘', 'Topf'], ['🧊', 'Eis'], ['🧂', 'Salz']],
  Comic: [['💬', 'Sprechen'], ['💭', 'Denken'], ['💥', 'Knall'], ['❗', 'Ausruf'], ['❓', 'Frage'], ['⭐', 'Stern'], ['✨', 'Funkeln'], ['⚡', 'Blitz'], ['👑', 'Krone'], ['🎈', 'Ballon']],
};
const textStamps: [string, string][] = [
  ['★ Gut gemacht!', '#477e4a'],
  ['Super!', '#1e88e5'],
  ['Prima gelernt!', '#8e24aa'],
  ['Toll gelesen!', '#ef6c00'],
  ['Bitte verbessern', '#c62828'],
  ['Gesehen ✓', '#455a64'],
];
const emojiStamps: [string, string][] = [
  ['⭐', 'Stern'], ['🌟', 'Glitzerstern'], ['👍', 'Daumen hoch'], ['😊', 'Lächeln'], ['🏆', 'Pokal'], ['🥇', 'Medaille'],
  ['🎉', 'Feier'], ['💯', 'Hundert'], ['✅', 'Erledigt'], ['❤️', 'Herz'], ['🌈', 'Regenbogen'], ['🦄', 'Einhorn'],
  ['🐞', 'Marienkäfer'], ['🚀', 'Rakete'], ['💪', 'Stark'], ['👀', 'Angeschaut'],
];

/** A stamp: tapping the page places a copy right there. */
export type Stamp = { key: string; label: string; make: () => PageElement };
const stampList: Stamp[] = [
  ...textStamps.map(([text, color]) => ({ key: `text:${text}`, label: text, make: () => stampElement(text, color) })),
  { key: 'date', label: 'Datum von heute', make: () => stampElement(new Date().toLocaleDateString('de-DE'), '#455a64') },
  ...emojiStamps.map(([symbol, label]) => ({ key: `emoji:${symbol}`, label, make: () => emojiStamp(symbol) })),
];
export const findStamp = (key: string | null) => stampList.find((st) => st.key === key) || null;

/** Element for a shape, sticker or stamp, placed near the top left. */
function shapeElement(shape: string): PageElement {
  return {
    id: uuid(), type: 'shape', shape, x: 25, y: 35, width: shape === 'line' || shape === 'arrow' ? 60 : 40,
    height: shape === 'line' || shape === 'arrow' ? 10 : 40, rotation: 0, locked: false, color: '#42685b', fill: '#edf2e5', strokeWidth: 0.5,
  };
}
function stickerElement(symbol: string): PageElement {
  return { id: uuid(), type: 'sticker', symbol, x: 25, y: 35, width: 30, height: 30, rotation: 0, locked: false, color: '#42685b' };
}
function stampElement(text: string, color: string): PageElement {
  return {
    id: uuid(), type: 'text', x: 20, y: 20, width: Math.max(45, text.length * 4.2), height: 20, rotation: -5,
    // Teachers' stamps cannot be moved by children.
    locked: true, color, text, font: 'Andika', fontSize: 21, bold: true, textFrame: 'box', borderWidth: 0.8,
  };
}

function emojiStamp(symbol: string): PageElement {
  return {
    id: uuid(), type: 'sticker', symbol, x: 0, y: 0, width: 22, height: 22,
    // A little tilt like a real stamp.
    rotation: Math.round(Math.random() * 16 - 8), locked: true, color: '#42685b',
  };
}

/**
 * Bottom bar behind “Einfügen”: shapes and stickers (one tap inserts), and
 * stamps (choose one, then every tap on the page stamps it there).
 */
export function ShapesBar({
  onInsert,
  stamp,
  onStamp,
}: {
  onInsert: (element: PageElement) => void;
  stamp: string | null;
  onStamp: (key: string | null) => void;
}) {
  const [group, setGroup] = useState('Schule');
  const sections: OptionSection[] = [
    {
      id: 'shapes',
      label: 'Formen',
      icon: 'workflow',
      content: (
        <OptionGroup label="Formen">
          {shapes.map(([shape, label]) => (
            <ChoiceButton
              key={shape}
              icon={
                <span className="shape-glyph" aria-hidden="true">
                  <Shape element={shapeElement(shape)} />
                </span>
              }
              label={label}
              onClick={() => onInsert(shapeElement(shape))}
            />
          ))}
        </OptionGroup>
      ),
    },
    {
      id: 'stickers',
      label: 'Sticker',
      icon: 'like',
      content: (
        <>
          <Choices
            label="Thema"
            value={group}
            onChange={setGroup}
            options={Object.keys(stickers).map((name) => ({
              value: name,
              label: name,
              icon: <span className="sticker-glyph">{stickers[name][0][0]}</span>,
            }))}
          />
          <OptionGroup label={group}>
            {stickers[group].map(([symbol, label]) => (
              <ChoiceButton
                key={symbol}
                icon={<span className="sticker-glyph">{symbol}</span>}
                label={label}
                onClick={() => onInsert(stickerElement(symbol))}
              />
            ))}
          </OptionGroup>
        </>
      ),
    },
    {
      id: 'stamps',
      label: 'Stempel',
      icon: 'approval',
      content: (
        <>
          <OptionGroup label="Text-Stempel">
            {stampList
              .filter((st) => !st.key.startsWith('emoji:'))
              .map((st) => {
                const sample = st.make();
                return (
                  <ChoiceButton
                    key={st.key}
                    icon={<span className="stamp-glyph" style={{ color: sample.color, borderColor: sample.color }}>{st.key === 'date' ? 'D' : (sample.text || '').replace(/[^\p{L}]/gu, '').slice(0, 1)}</span>}
                    label={st.label}
                    pressed={stamp === st.key}
                    onClick={() => onStamp(stamp === st.key ? null : st.key)}
                  />
                );
              })}
          </OptionGroup>
          <OptionGroup label="Emoji-Stempel">
            {stampList
              .filter((st) => st.key.startsWith('emoji:'))
              .map((st) => (
                <ChoiceButton
                  key={st.key}
                  icon={<span className="sticker-glyph">{st.key.slice(6)}</span>}
                  label={st.label}
                  pressed={stamp === st.key}
                  onClick={() => onStamp(stamp === st.key ? null : st.key)}
                />
              ))}
          </OptionGroup>
          <span className="option-hint" role="status">
            {stamp ? 'Tippe auf die Seite, um zu stempeln. Noch einmal auf den Stempel tippen beendet das Stempeln.' : 'Stempel wählen, dann auf die Seite tippen – so oft du möchtest.'}
          </span>
        </>
      ),
    },
  ];
  return <OptionBar label="Einfügen" sections={sections} />;
}
