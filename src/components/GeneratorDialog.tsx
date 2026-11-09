'use client';
import {
  allGenerators,
  generatePages,
  type WorksheetKind,
} from '@/lib/learning/worksheets';
import AiDialog from './learning/AiDialog';
import WordBank from './learning/WordBank';
import { useState } from 'react';

import type { Page } from '@/lib/notebook-model';
export default function GeneratorDialog({
  onInsert,
  onClose,
  dictionaryOrigin,
}: {
  onInsert: (pages: Page[]) => Promise<void>;
  onClose: () => void;
  dictionaryOrigin: string;
}) {
  const [kind, setKind] = useState<WorksheetKind>('rechnen');
  const [title, setTitle] = useState('');
  const [words, setWords] = useState('Son-ne, Blu-me, Re-gen-bo-gen');
  const [maximum, setMaximum] = useState(20);
  const [solutions, setSolutions] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const wordFormat = ['silben', 'wortsuche', 'nachspuren'].includes(kind),
    numberFormat =
      !wordFormat &&
      ![
        'uhren',
        'clockdraw',
        'clockwords',
        'clock24',
        'timespan',
        'earlierlater',
        'notenames',
        'notedraw',
        'notewords',
        'notevalues',
        'patterns',
        'tracing',
        'mazes',
        'sudoku',
      ].includes(kind);
  const minimum = ['writtenplus', 'writtenminus'].includes(kind)
    ? 100
    : kind === 'tenstep'
      ? 20
      : ['rechnen', 'zahlenhaus'].includes(kind)
        ? 5
        : 10;
  return (
    <div className="modal-backdrop">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="generator-title"
      >
        <h2 id="generator-title">Ein Arbeitsblatt erstellen</h2>
        <button className="knopf compact" onClick={() => setShowAI(true)}>
          Wörter mit KI entwerfen
        </button>
        <label className="property-label">
          Übungsformat
          <select
            aria-label="Übungsformat"
            value={kind}
            onChange={(e) => setKind(e.target.value as WorksheetKind)}
          >
            {Object.entries(allGenerators).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="feld">
          <span>Überschrift</span>
          <input
            maxLength={80}
            placeholder={allGenerators[kind]}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        {numberFormat ? (
          <label className="feld">
            <span>
              Zahlenraum ({minimum} bis{' '}
              {['rechnen', 'zahlenhaus', 'uhren'].includes(kind)
                ? 100
                : '10 000'}
              )
            </span>
            <input
              type="number"
              min={minimum}
              max={
                ['rechnen', 'zahlenhaus', 'uhren'].includes(kind) ? 100 : 10000
              }
              value={Math.max(minimum, maximum)}
              onChange={(e) => setMaximum(Number(e.target.value))}
            />
          </label>
        ) : (
          ['silben', 'wortsuche', 'nachspuren'].includes(kind) && (
            <label className="property-label">
              Wörter / Zeichen, durch Komma getrennt
              {kind === 'silben' && (
                <small>
                  Silben mit Bindestrich trennen, z. B. Re-gen-bo-gen.
                </small>
              )}
              <textarea
                aria-label="Wörter für das Arbeitsblatt"
                maxLength={600}
                value={words}
                onChange={(e) => setWords(e.target.value)}
              />
            </label>
          )
        )}
        {wordFormat && (
          <WordBank onSelect={(words) => setWords(words.join(', '))} />
        )}
        <label>
          <input
            type="checkbox"
            checked={solutions}
            onChange={(e) => setSolutions(e.target.checked)}
          />{' '}
          Lösungsseite anfügen
        </label>
        {dictionaryOrigin && (
          <p>
            <a href={dictionaryOrigin} target="_blank" rel="noreferrer">
              Schul-Wörterbuch öffnen ↗
            </a>{' '}
            · Wörter von dort hier eintragen.
          </p>
        )}
        <p>
          Bei Rechenaufgaben, Zahlenhäusern, Uhren und Suchrätseln wird eine
          Lösungsseite angefügt. Alle Elemente bleiben bearbeitbar.
        </p>
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button className="knopf" disabled={busy} onClick={onClose}>
            Abbrechen
          </button>
          <button
            className="knopf knopf-haupt"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onInsert(
                  generatePages({
                    kind,
                    title,
                    words,
                    maximum: Math.max(minimum, maximum),
                    seed: crypto.getRandomValues(new Uint32Array(1))[0],
                    showSolutions: solutions,
                  }),
                );
                onClose();
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? 'Wird erstellt …' : 'Seiten ins Heft einfügen'}
          </button>
        </div>
        {showAI && (
          <AiDialog
            onClose={() => setShowAI(false)}
            onAccept={(result) => {
              if (result.words) setWords(result.words.join(', '));
            }}
          />
        )}
      </section>
    </div>
  );
}
