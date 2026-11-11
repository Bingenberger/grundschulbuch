'use client';
import { useEffect, useState, useMemo } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { defaultWords } from '@/lib/learning/catalog';
import {
  connectWinner,
  battleFleet,
  crosswordGrid,
  mazeGrid,
  normalized,
  searchGrid,
  wordleFeedback,
} from '@/lib/learning/algorithms';
import { speakGerman } from '@/lib/speech';
import { useLearning } from './Runtime';
import MediaActivity from './MediaActivity';
import LetterGuessActivity from './LetterGuessActivity';
import SyllableAssemblyActivity from './SyllableAssemblyActivity';
export default function Activity({ element }: { element: PageElement }) {
  if (element.activityKind === 'syllables') return <SyllableAssemblyActivity element={element} />;
  if (element.activityKind === 'letterguess') return <LetterGuessActivity element={element} />;
  if (['quiz', 'matching', 'memory'].includes(element.activityKind!)) return <MediaActivity element={element} />;
  return <OtherActivity element={element} />;
}
function OtherActivity({ element: el }: { element: PageElement }) {
  const { state, update, interactive } = useLearning(el);
  const config = el.settings || {},
    kind = el.activityKind!;
  const words = useMemo(
    () => (config.words?.length ? config.words : defaultWords).slice(0, 30),
    [config.words],
  );
  const values = Array.isArray(state.values) ? state.values.map(String) : [];
  const numbers = (key: string): number[] =>
    Array.isArray(state[key]) ? (state[key] as unknown[]).map(Number) : [];
  const [draft, setDraft] = useState('');
  const [playing, setPlaying] = useState(false);
  const [readingIndex, setReadingIndex] = useState(0);
  const [notice, setNotice] = useState('');
  const setValue = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    update({ values: next, checked: false });
  };
  const score = (correct: number, total: number) =>
    update({
      checked: true,
      score: Math.round((correct / Math.max(1, total)) * 100),
      completed: correct === total,
    });
  const readWords = (config.text || words.join(' '))
    .split(/\s+/)
    .filter(Boolean);
  useEffect(() => {
    if (!playing || !interactive || kind !== 'reading') return;
    const timer = setInterval(
      () =>
        setReadingIndex((i) => {
          if (i + 1 >= readWords.length) {
            setPlaying(false);
            return 0;
          }
          return i + 1;
        }),
      Math.max(200, Math.min(3000, (config.seconds || 1) * 1000)),
    );
    return () => clearInterval(timer);
  }, [playing, kind, interactive, readWords.length, config.seconds]);
  let content: React.ReactNode;
  if (kind === 'cloze') {
    const text = config.text || 'Die [Sonne] scheint.';
    const answers = Array.from(text.matchAll(/\[([^\]]+)\]/g), (m) => m[1]);
    let index = 0;
    content = (
      <>
        <div className="cloze-text">
          {text.split(/\[([^\]]+)\]/g).map((part, i) => {
            if (i % 2 === 0) return <span key={i}>{part}</span>;
            const at = index++;
            return (
              <input
                key={i}
                aria-label={`Lücke ${at + 1}`}
                disabled={!interactive}
                value={values[at] || ''}
                onChange={(e) => setValue(at, e.target.value)}
                style={{ width: Math.max(70, part.length * 10) }}
              />
            );
          })}
        </div>
        <button
          disabled={!interactive}
          onClick={() =>
            score(
              answers.filter((a, i) =>
                a
                  .split('|')
                  .some((v) => normalized(v) === normalized(values[i] || '')),
              ).length,
              answers.length,
            )
          }
        >
          Lücken prüfen
        </button>
      </>
    );
  } else if (kind === 'typing') {
    const text = config.text || words.join(' ');
    content = (
      <>
        <p className="reading-source">{text}</p>
        <textarea
          aria-label="Dein abgeschriebener Text"
          disabled={!interactive}
          value={String(state.text || '')}
          onChange={(e) => update({ text: e.target.value, checked: false })}
        />
        <button
          disabled={!interactive}
          onClick={() =>
            score(
              normalized(String(state.text || '')) === normalized(text) ? 1 : 0,
              1,
            )
          }
        >
          Text vergleichen
        </button>
      </>
    );
  } else if (kind === 'reading') {
    const word = readWords[readingIndex];
    content = (
      <>
        <div className="flash-word">
          {word?.split('-').map((syllable, i) => (
            <span style={{ color: i % 2 ? '#316fab' : '#ba3c46' }} key={i}>
              {syllable}
            </span>
          ))}
        </div>
        <div className="learning-actions">
          <button disabled={!interactive} onClick={() => setPlaying(!playing)}>
            {playing ? 'Pause' : 'Blitzlesen starten'}
          </button>
          <button
            disabled={!interactive}
            onClick={() => {
              if (!speakGerman((word || '').replace(/-/g, '')))
                setNotice('Bitte eine deutsche Gerätestimme installieren.');
            }}
          >
            ▷ Anhören
          </button>
        </div>
      </>
    );
  } else if (kind === 'wordle') {
    const answer = words[(Number(config.seed) || 0) % words.length]
      .replace(/-/g, '')
      .toLocaleUpperCase('de');
    const guesses = Array.isArray(state.guesses)
      ? state.guesses.map(String)
      : [];
    content = (
      <>
        <div className="wordle-grid">
          {[
            ...guesses,
            ...Array.from(
              { length: Math.max(0, 6 - guesses.length) },
              () => '',
            ),
          ].map((guess, row) => (
            <div key={row}>
              {Array.from({ length: answer.length }, (_, i) => (
                <span
                  key={i}
                  className={guess ? wordleFeedback(answer, guess)[i] : ''}
                >
                  {guess[i] || ''}
                </span>
              ))}
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.length !== answer.length) {
              setNotice(`Das Wort hat ${answer.length} Buchstaben.`);
              return;
            }
            update({
              guesses: [...guesses, draft.toLocaleUpperCase('de')],
              completed: normalized(draft) === normalized(answer),
              score: normalized(draft) === normalized(answer) ? 100 : 0,
            });
            setDraft('');
            setNotice('');
          }}
        >
          <input
            aria-label="Dein Wort"
            value={draft}
            maxLength={answer.length}
            disabled={
              !interactive || guesses.length >= 6 || guesses.includes(answer)
            }
            onChange={(e) => setDraft(e.target.value.toLocaleUpperCase('de'))}
          />
          <button disabled={!interactive || guesses.length >= 6}>
            Wort prüfen
          </button>
        </form>
      </>
    );
  } else if (kind === 'wordsearch') {
    const data = searchGrid(
      words,
      Math.max(6, Math.min(15, config.columns || 12)),
      config.seed,
    );
    const found = numbers('found'),
      start = typeof state.start === 'number' ? state.start : -1;
    content = (
      <>
        <div
          className="letter-grid"
          style={{ gridTemplateColumns: `repeat(${data.size},1fr)` }}
        >
          {data.grid.map((letter, i) => (
            <button
              key={i}
              disabled={!interactive}
              className={
                found.some((n) => data.placed[n]?.cells.includes(i))
                  ? 'matched'
                  : start === i
                    ? 'selected'
                    : ''
              }
              onClick={() => {
                if (start < 0) {
                  update({ start: i });
                  return;
                }
                const index = data.placed.findIndex(
                  (p) =>
                    (p.cells[0] === start &&
                      p.cells[p.cells.length - 1] === i) ||
                    (p.cells[0] === i && p.cells[p.cells.length - 1] === start),
                );
                const next =
                  index >= 0 && !found.includes(index)
                    ? [...found, index]
                    : found;
                update({
                  start: -1,
                  found: next,
                  completed: next.length === data.placed.length,
                  score: Math.round(
                    (next.length / Math.max(1, data.placed.length)) * 100,
                  ),
                });
              }}
            >
              {letter}
            </button>
          ))}
        </div>
        <p>Tippe Anfang und Ende eines Wortes an.</p>
        <div className="word-bank">
          {data.placed.map((p, i) => (
            <span
              key={i}
              style={{
                textDecoration: found.includes(i) ? 'line-through' : 'none',
              }}
            >
              {p.word}
            </span>
          ))}
        </div>
      </>
    );
  } else if (kind === 'crossword') {
    const entries = (
        config.pairs?.length
          ? config.pairs
          : words.map((w, i) => ({ left: `Wort ${i + 1}`, right: w }))
      ).slice(0, 12),
      crossword = crosswordGrid(entries);
    const lookup = new Map(
      crossword.cells.map((cell, i) => [
        `${cell.x},${cell.y}`,
        { ...cell, index: i },
      ]),
    );
    content = (
      <>
        <div
          className="crossword-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${crossword.width},28px)`,
            gap: 1,
            margin: 'auto',
            width: 'max-content',
          }}
        >
          {Array.from(
            { length: crossword.width * crossword.height },
            (_, i) => {
              const cell = lookup.get(
                `${i % crossword.width},${Math.floor(i / crossword.width)}`,
              );
              return cell ? (
                <label key={i} style={{ position: 'relative' }}>
                  <small
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 1,
                      fontSize: 7,
                      pointerEvents: 'none',
                    }}
                  >
                    {cell.number}
                  </small>
                  <input
                    aria-label={`Zeile ${cell.y + 1}, Spalte ${cell.x + 1}`}
                    maxLength={1}
                    disabled={!interactive}
                    value={values[cell.index] || ''}
                    style={{
                      width: 28,
                      height: 30,
                      textAlign: 'center',
                      padding: '5px 0 0',
                      borderRadius: 0,
                    }}
                    onChange={(e) =>
                      setValue(
                        cell.index,
                        e.target.value.toLocaleUpperCase('de'),
                      )
                    }
                  />
                </label>
              ) : (
                <span key={i} />
              );
            },
          )}
        </div>
        <ol>
          {crossword.clues.map((clue) => (
            <li key={clue.number}>
              {clue.clue} ({clue.vertical ? 'senkrecht' : 'waagerecht'})
            </li>
          ))}
        </ol>
        <button
          disabled={!interactive}
          onClick={() =>
            score(
              crossword.cells.filter(
                (cell, i) =>
                  normalized(values[i] || '') === normalized(cell.letter),
              ).length,
              crossword.cells.length,
            )
          }
        >
          Kreuzworträtsel prüfen
        </button>
      </>
    );
  } else if (kind === 'maze') {
    const { walls, size } = mazeGrid(
      Math.max(4, Math.min(12, config.columns || 8)),
      config.seed,
    );
    const position = Math.max(
      0,
      Math.min(size * size - 1, Number(state.position) || 0),
    );
    const path = numbers('path');
    const step = (direction: number) => {
      if (walls[position][direction]) return;
      const next = position + [-size, 1, size, -1][direction];
      update({
        position: next,
        path: [...path, position].slice(-500),
        completed: next === size * size - 1,
        score: next === size * size - 1 ? 100 : 0,
      });
    };
    content = (
      <>
        <svg
          className="maze"
          viewBox={`0 0 ${size * 20} ${size * 20}`}
          aria-label="Labyrinth"
        >
          {walls.map((cell, i) => {
            const x = (i % size) * 20,
              y = Math.floor(i / size) * 20;
            return cell.map((wall, d) =>
              wall ? (
                <line
                  key={`${i}-${d}`}
                  x1={x + [0, 20, 0, 0][d]}
                  y1={y + [0, 0, 20, 0][d]}
                  x2={x + [20, 20, 20, 0][d]}
                  y2={y + [0, 20, 20, 20][d]}
                  stroke="#526e60"
                  strokeWidth="1.5"
                />
              ) : null,
            );
          })}
          <text x={size * 20 - 16} y={size * 20 - 4} fontSize="15">
            🧀
          </text>
          <circle
            cx={(position % size) * 20 + 10}
            cy={Math.floor(position / size) * 20 + 10}
            r="6"
            fill="#d19e4d"
          />
        </svg>
        <div className="maze-controls">
          {['↑', '→', '↓', '←'].map((text, i) => (
            <button
              key={i}
              aria-label={
                ['Nach oben', 'Nach rechts', 'Nach unten', 'Nach links'][i]
              }
              disabled={!interactive}
              onClick={() => step(i)}
            >
              {text}
            </button>
          ))}
        </div>
      </>
    );
  } else if (kind === 'connect4') {
    const board =
        numbers('board').length === 42 ? numbers('board') : Array(42).fill(0),
      winner = connectWinner(board),
      turn = Number(state.turn) || 1;
    content = (
      <>
        <p>{winner ? `Farbe ${winner} gewinnt!` : `Farbe ${turn} ist dran`}</p>
        <div className="connect-grid">
          {board.map((cell, i) => (
            <button
              key={i}
              aria-label={`Spalte ${(i % 7) + 1}, Zeile ${Math.floor(i / 7) + 1}`}
              disabled={!interactive || !!winner}
              className={`player-${cell}`}
              onClick={() => {
                const column = i % 7;
                for (let row = 5; row >= 0; row--) {
                  const at = row * 7 + column;
                  if (!board[at]) {
                    const next = [...board];
                    next[at] = turn;
                    update({
                      board: next,
                      turn: turn === 1 ? 2 : 1,
                      completed: !!connectWinner(next),
                    });
                    break;
                  }
                }
              }}
            />
          ))}
        </div>
      </>
    );
  } else if (kind === 'battleship') {
    const hits = numbers('hits'),
      targets = battleFleet(config.seed),
      done = targets.every((i) => hits.includes(i));
    content = (
      <>
        <p>
          Finde die versteckten Schiffe.{' '}
          {hits.filter((i) => targets.includes(i)).length} / {targets.length}{' '}
          Treffer
        </p>
        <div className="coordinate-grid">
          {Array.from({ length: 100 }, (_, i) => (
            <button
              key={i}
              disabled={!interactive || hits.includes(i)}
              aria-label={`${String.fromCharCode(65 + (i % 10))}${Math.floor(i / 10) + 1}`}
              onClick={() =>
                update({
                  hits: [...hits, i],
                  completed: targets.every((t) => [...hits, i].includes(t)),
                  score: Math.round(
                    (targets.filter((t) => [...hits, i].includes(t)).length /
                      targets.length) *
                      100,
                  ),
                })
              }
            >
              {hits.includes(i)
                ? targets.includes(i)
                  ? '●'
                  : '·'
                : `${String.fromCharCode(65 + (i % 10))}${Math.floor(i / 10) + 1}`}
            </button>
          ))}
        </div>
        {done && <strong>Alle Schiffe gefunden!</strong>}
      </>
    );
  }
  return (
    <section
      className="learning-widget activity"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <header>
        <strong>{config.title || 'Meine Übung'}</strong>
        <button
          className="reset-learning"
          aria-label="Übung neu beginnen"
          disabled={!interactive}
          onClick={() =>
            update({
              values: [],
              checked: false,
              score: 0,
              completed: false,
              index: 0,
              matched: [],
              open: [],
              guesses: [],
              found: [],
              position: 0,
              path: [],
              board: [],
              turn: 1,
              start: -1,
              hits: [],
              text: '',
            })
          }
        >
          ↺
        </button>
      </header>
      <div className="learning-content">{content}</div>
      {notice && <p role="status">{notice}</p>}
      {state.checked && (
        <p
          className={state.completed ? 'learning-success' : 'learning-feedback'}
          role="status"
        >
          {state.completed
            ? '✓ Alles richtig!'
            : `${Number(state.score) || 0} % richtig – du kannst weiter üben.`}
        </p>
      )}
    </section>
  );
}
