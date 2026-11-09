'use client';
import { useState } from 'react';
import { uuid, type PageElement } from '@/lib/notebook-model';
import { Shape } from './Appearance';
const symbols: Record<string, string[]> = {
  Schule: ['✎', '📚', '📖', '📏', '✂', '📌', '📅', '🎒', '🏫', '💡'],
  Gefühle: ['🙂', '😊', '😀', '😢', '😴', '😕', '😮', '😎', '🤔', '❤️'],
  Tiere: ['🐈', '🐕', '🐭', '🦔', '🐘', '🐸', '🐟', '🦋', '🐝', '🐦'],
  Natur: ['☀', '☁', '🌧', '🌈', '❄', '🌳', '🌷', '🍄', '🍂', '🌍'],
  Alltag: ['🏠', '🚌', '🚲', '🚗', '🚦', '🕒', '🥛', '🍎', '🍞', '👕'],
  Musik: ['♫', '♪', '𝄞', '🎹', '🥁', '🎸', '🎵', '🎤', '🔔', '👏'],
  Mathe: ['＋', '−', '×', '÷', '=', '≠', '½', '¼', '∞', '€'],
  Wohnen: ['🛏', '🪑', '🚪', '🛋', '🪟', '🛁', '🚿', '🚽', '🧺', '🪴'],
  Küche: ['🍽', '🥄', '🍴', '🔪', '🥣', '☕', '🍳', '🥘', '🧊', '🧂'],
  Comic: ['💬', '💭', '💥', '❗', '❓', '⭐', '✨', '⚡', '👑', '🎈'],
};
export default function ElementsDialog({
  onInsert,
  onClose,
}: {
  onInsert: (el: PageElement) => void;
  onClose: () => void;
}) {
  const [category, setCategory] = useState('Formen');
  const base: PageElement = {
    id: uuid(),
    type: 'shape',
    x: 25,
    y: 35,
    width: 40,
    height: 40,
    rotation: 0,
    locked: false,
    color: '#42685b',
    fill: '#edf2e5',
    strokeWidth: 0.5,
  };
  return (
    <div className="modal-backdrop">
      <section
        className="modal template-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="elements-title"
      >
        <div className="dialog-heading">
          <h2 id="elements-title">Formen, Sprechblasen & Sticker</h2>
          <button className="knopf" onClick={onClose}>
            Schließen
          </button>
        </div>
        <div className="catalog-tabs">
          {['Formen', ...Object.keys(symbols)].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="symbol-grid">
          {category === 'Formen'
            ? [
                'rect',
                'rounded',
                'ellipse',
                'triangle',
                'line',
                'arrow',
                'star',
                'heart',
                'speech',
                'thought',
                'shout',
                'banner',
              ].map((shape) => (
                <button
                  key={shape}
                  aria-label={`Form ${shape}`}
                  onClick={() => {
                    onInsert({ ...base, shape });
                    onClose();
                  }}
                >
                  <Shape element={{ ...base, shape }} />
                </button>
              ))
            : symbols[category].map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => {
                    onInsert({ ...base, type: 'sticker', symbol });
                    onClose();
                  }}
                >
                  {symbol}
                </button>
              ))}
        </div>
      </section>
    </div>
  );
}
