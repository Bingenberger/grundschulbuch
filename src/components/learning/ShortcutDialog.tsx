'use client';
import { useState } from 'react';
import {
  defaultShortcuts,
  editorCommands,
  keyChord,
  type Shortcuts,
  type EditorCommand,
} from '@/lib/editor-commands';
export default function ShortcutDialog({
  shortcuts,
  onSave,
  onClose,
}: {
  shortcuts: Shortcuts;
  onSave: (shortcuts: Shortcuts) => Promise<void>;
  onClose: () => void;
}) {
  const [keys, setKeys] = useState(shortcuts),
    [error, setError] = useState('');
  return (
    <div className="modal-backdrop">
      <section
        className="modal template-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <h2 id="shortcuts-title">Hilfe & Tastaturkürzel</h2>
        <p>
          Wähle ein Feld und drücke die gewünschte Tastenkombination. „Mod“
          bedeutet Strg bzw. ⌘. Markieren und Ziehen bewegt Elemente; der
          Eckpunkt verändert ihre Größe. Lernwerkzeuge wählst du über „Elemente
          der Seite“ aus.
        </p>
        <div className="shortcut-list">
          {Object.entries(editorCommands).map(([id, [label]]) => (
            <label key={id}>
              <span>{label}</span>
              <input
                aria-label={`Tastenkürzel ${label}`}
                value={keys[id as EditorCommand]}
                onChange={(e) => setKeys({ ...keys, [id]: e.target.value })}
                onKeyDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (['Control', 'Meta', 'Alt', 'Shift'].includes(e.key))
                    return;
                  setKeys({ ...keys, [id]: keyChord(e) });
                }}
              />
            </label>
          ))}
        </div>
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button className="knopf" onClick={() => setKeys(defaultShortcuts)}>
            Zurücksetzen
          </button>
          <button className="knopf" onClick={onClose}>
            Schließen
          </button>
          <button
            className="knopf knopf-haupt"
            onClick={async () => {
              const values = Object.values(keys).filter(Boolean);
              if (new Set(values).size !== values.length) {
                setError(
                  'Jede Tastenkombination darf nur einmal vergeben werden.',
                );
                return;
              }
              try {
                await onSave(keys);
                onClose();
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            Übernehmen
          </button>
        </div>
      </section>
    </div>
  );
}
