/* eslint-disable @next/next/no-img-element -- Stored school media use authenticated URLs. */
'use client';
import { useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { defaultWords } from '@/lib/learning/catalog';
import { speakGerman } from '@/lib/speech';
import { useLearning } from './Runtime';
export default function LanguageWidgets({
  element: el,
}: {
  element: PageElement;
}) {
  const { state, update, interactive } = useLearning(el),
    c = el.settings || {},
    kind = el.widgetKind;
  const [notice, setNotice] = useState('');
  const words = c.words?.length ? c.words : defaultWords,
    index = (Number(state.index) || 0) % words.length,
    word = words[index];
  const say = (text: string) => {
    if (
      !speakGerman(text, {
        voice: c.voice,
        rate: c.speechRate,
        pitch: c.speechPitch,
      })
    )
      setNotice('Bitte eine deutsche Stimme auf dem Gerät installieren.');
  };
  let content: React.ReactNode;
  if (kind === 'communication') {
    const cells: NonNullable<typeof c.cells> = c.cells?.length
      ? c.cells
      : ['Ich', 'möchte', 'trinken', 'Pause', 'ja', 'nein'].map((label) => ({
          label,
        }));
    const sentence = Array.isArray(state.sentence)
      ? state.sentence.map(Number)
      : [];
    content = (
      <>
        <div className="sentence-strip">
          {sentence.map((n, i) => (
            <button
              disabled={!interactive}
              key={i}
              onClick={() =>
                update({ sentence: sentence.filter((_, j) => j !== i) })
              }
            >
              {cells[n]?.label}
            </button>
          ))}
        </div>
        <div
          className="communication-grid"
          style={{
            gridTemplateColumns: `repeat(${Math.max(2, Math.min(6, c.columns || 4))},1fr)`,
          }}
        >
          {cells.map((cell, i) => (
            <button
              key={i}
              disabled={!interactive}
              style={{ background: cell.color || '#eff4e7' }}
              onClick={() => {
                update({ sentence: [...sentence, i].slice(-40) });
                say(cell.speak || cell.label);
              }}
            >
              {cell.image && <img src={cell.image} alt="" />}
              <strong>{cell.label}</strong>
            </button>
          ))}
        </div>
        <div className="learning-actions">
          <button
            disabled={!interactive || !sentence.length}
            onClick={() => say(sentence.map((i) => cells[i]?.label).join(' '))}
          >
            ▷ Satz sprechen
          </button>
          <button
            disabled={!interactive}
            onClick={() => update({ sentence: [] })}
          >
            Satz leeren
          </button>
        </div>
      </>
    );
  } else if (kind === 'monster')
    content = (
      <>
        <svg className="reading-monster" viewBox="0 0 150 110">
          <path
            d="M25 90Q5 20 55 25L65 5L80 26Q150 10 130 90Z"
            fill={['#b9d5a0', '#dec296', '#b5c5e0'][index % 3]}
            stroke="#52735e"
            strokeWidth="2"
          />
          <circle cx="58" cy="50" r="13" fill="white" />
          <circle cx="99" cy="50" r="13" fill="white" />
          <circle cx="60" cy="51" r="5" fill="#354b3d" />
          <circle cx="96" cy="51" r="5" fill="#354b3d" />
          <path
            d="M57 77Q80 94 103 75"
            fill="none"
            stroke="#354b3d"
            strokeWidth="3"
          />
        </svg>
        <div className="flash-word">
          {word.split('-').map((part, i) => (
            <span key={i} style={{ color: i % 2 ? '#336ca2' : '#b53d49' }}>
              {part}
            </span>
          ))}
        </div>
        <div className="learning-actions">
          <button
            disabled={!interactive}
            onClick={() => say(word.replace(/-/g, ''))}
          >
            ▷ Anhören
          </button>
          <button
            disabled={!interactive}
            onClick={() =>
              update({
                index: index + 1,
                score: Math.min(100, ((index + 1) / words.length) * 100),
                completed: index + 1 >= words.length,
              })
            }
          >
            Gelesen – weiter
          </button>
        </div>
      </>
    );
  return (
    <section
      className="learning-widget"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <header>
        <strong>{c.title || 'Lesen & Sprechen'}</strong>
      </header>
      <div className="learning-content">{content}</div>
      {notice && <p role="status">{notice}</p>}
    </section>
  );
}
