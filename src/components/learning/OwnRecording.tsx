'use client';
// “Eigene Aufnahme …” as in Lernsachen-Heft 1.49.0 (Figur, Sprechendes Foto,
// Anlaut-Tastatur): record with the microphone or choose a sound file; the
// recording is stored on the school server and replaces the computer voice.
import { useState } from 'react';
import { createPortal } from 'react-dom';
import AudioDialog from '../AudioDialog';

/** Only sounds stored on the school server count as an own recording. */
export const ownAudio = (v: unknown) => (typeof v === 'string' && /^\/api\/medien\/[a-f0-9]{64}\.[a-z0-9]+$/.test(v) ? v : undefined);

export default function OwnRecording({ audio, onChange, onTry, hint, title = 'Eigene Aufnahme', label = 'Eigene Aufnahme …', changeLabel = 'Aufnahme ändern …', removeLabel = 'Ohne Aufnahme', tryLabel = 'Anhören' }: {
  audio?: string;
  onChange: (audio: string | undefined) => void;
  /** Plays what is set now (with the movement of the figure or photo). */
  onTry?: () => void;
  hint?: string;
  title?: string;
  label?: string;
  changeLabel?: string;
  removeLabel?: string;
  tryLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="own-recording">
      <div className="learning-actions">
        <button type="button" className="knopf compact" onClick={() => setOpen(true)}>{audio ? changeLabel : label}</button>
        {audio && <button type="button" className="knopf compact" onClick={() => onChange(undefined)}>{removeLabel}</button>}
        {onTry && <button type="button" className="knopf compact" onClick={onTry}>{tryLabel}</button>}
      </div>
      {hint && <p className="option-hint">{hint}</p>}
      {open && createPortal(
        <div className="alphabet-recording">
          <p className="alphabet-recording-label">{title}</p>
          <AudioDialog bookId="" only={['record', 'upload']} title={title} onClose={() => setOpen(false)} onAudio={(src) => { onChange(src); setOpen(false); }} />
        </div>,
        document.body,
      )}
    </div>
  );
}
