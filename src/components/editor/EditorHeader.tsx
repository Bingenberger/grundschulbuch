'use client';
import { useState } from 'react';
import Icon from '../Icon';
import type { Feature } from '@/lib/features';

/** Top bar of both editors; children see fewer buttons. */
export default function EditorHeader({
  features,
  backLabel,
  onBack,
  title,
  onRename,
  status,
  statusError,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  busy,
  onFiles,
  onBoard,
  onShare,
  onPrint,
  onHelp,
  readAloud,
  onReadAloud,
  onDone,
}: {
  features: Set<Feature>;
  backLabel: string;
  onBack: () => void;
  title: string;
  onRename?: (title: string) => void;
  status: string;
  statusError?: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  busy?: boolean;
  onFiles?: () => void;
  onBoard?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
  onHelp?: () => void;
  readAloud?: boolean;
  onReadAloud?: (on: boolean) => void;
  onDone?: () => void;
}) {
  const [draft, setDraft] = useState(title);
  const has = (f: Feature) => features.has(f);
  return (
    <header className="editor-header">
      <button type="button" className="header-button back-button" disabled={busy} onClick={onBack}>
        <Icon name="library" size={26} />
        <span>{backLabel}</span>
      </button>
      {has('rename') && onRename ? (
        <input
          className="book-title"
          aria-label="Heftname"
          maxLength={120}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (draft.trim() && draft.trim() !== title) onRename(draft);
          }}
        />
      ) : (
        <h1 className="book-title">{title}</h1>
      )}
      <span className={`save-status ${statusError ? 'save-error' : ''}`} role="status">
        {status}
      </span>
      <div className="header-actions">
        <button type="button" className="header-button" disabled={!canUndo} onClick={onUndo}>
          <Icon name="undo" size={24} />
          <span>Zurück</span>
        </button>
        {has('redo') && (
          <button type="button" className="header-button" disabled={!canRedo} onClick={onRedo}>
            <Icon name="redo" size={24} />
            <span>Wiederholen</span>
          </button>
        )}
        {has('readAloud') && onReadAloud && (
          <button
            type="button"
            className="header-button"
            aria-pressed={readAloud}
            onClick={() => onReadAloud(!readAloud)}
          >
            <Icon name="speaker" size={24} />
            <span>Vorlesen</span>
          </button>
        )}
        {has('files') && onFiles && (
          <button type="button" className="header-button" onClick={onFiles}>
            <Icon name="opened_folder" size={24} />
            <span>Dateien</span>
          </button>
        )}
        {has('board') && onBoard && (
          <button type="button" className="header-button" onClick={onBoard}>
            <Icon name="video_projector" size={24} />
            <span>Tafelmodus</span>
          </button>
        )}
        {has('share') && onShare && (
          <button type="button" className="header-button" disabled={busy} onClick={onShare}>
            <Icon name="share" size={24} />
            <span>Weitergeben</span>
          </button>
        )}
        {has('print') && onPrint && (
          <button type="button" className="header-button" disabled={busy} onClick={onPrint}>
            <Icon name="print" size={24} />
            <span>Drucken / PDF</span>
          </button>
        )}
        {has('help') && onHelp && (
          <button type="button" className="header-button" onClick={onHelp}>
            <Icon name="questions" size={24} />
            <span>Hilfe</span>
          </button>
        )}
        {onDone && (
          <button type="button" className="header-button header-done" onClick={onDone}>
            <Icon name="ok" size={24} />
            <span>Fertig</span>
          </button>
        )}
      </div>
    </header>
  );
}
