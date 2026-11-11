'use client';
import { useEffect, useRef, useState } from 'react';

/** Microphone drawn inline (works in the HTML export without icon files). */
export function MicGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="mic-glyph" aria-hidden="true">
      <rect x="8" y="2" width="8" height="13" rx="4" fill="#e53935" />
      <path d="M5 11a7 7 0 0 0 14 0" fill="none" stroke="#546e7a" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 18v4M8 22h8" stroke="#546e7a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Spool({ cx, tape, spinning }: { cx: number; tape: number; spinning: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={40} r={6 + tape * 5} fill="#4e342e" />
      <g className={spinning ? 'spool spinning' : 'spool'} style={{ transformOrigin: `${cx}px 40px` }}>
        <circle cx={cx} cy={40} r={6} fill="#eceff1" stroke="#90a4ae" strokeWidth="1" />
        {[0, 60, 120].map((a) => (
          <rect key={a} x={cx - 0.8} y={35} width={1.6} height={10} fill="#78909c" transform={`rotate(${a} ${cx} 40)`} />
        ))}
      </g>
    </g>
  );
}

/** The cassette: label with the title, two spools; the tape winds from left to right. */
export function CassetteArt({ title, spinning, progress = 0 }: { title: string; spinning: boolean; progress?: number }) {
  return (
    <svg viewBox="0 0 120 76" className="cassette-art" role="img" aria-label={`Kassette: ${title}`}>
      <rect x="2" y="2" width="116" height="72" rx="6" fill="#37474f" />
      <rect x="10" y="6" width="100" height="19" rx="3" fill="#fff8e1" />
      <text x="60" y="19" textAnchor="middle" fontSize="9" fontFamily="Andika, sans-serif" fill="#3e2723">
        {title.length > 24 ? `${title.slice(0, 23)}…` : title}
      </text>
      <rect x="24" y="28" width="72" height="24" rx="11" fill="#263238" />
      <Spool cx={40} tape={1 - progress} spinning={spinning} />
      <Spool cx={80} tape={progress} spinning={spinning} />
      <path d="M22 74l6-12h64l6 12" fill="#455a64" />
      <circle cx="40" cy="68" r="2" fill="#263238" />
      <circle cx="80" cy="68" r="2" fill="#263238" />
    </svg>
  );
}

const clock = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');
const MAX_SECONDS = 300;

type KeyProps = {
  colour: 'red' | 'green' | 'blue' | 'yellow' | 'violet';
  symbol: React.ReactNode;
  label: string;
  disabled?: boolean;
  pressed?: boolean;
  onClick?: () => void;
};
/** Big round toy-like key with a short label below. */
function Key({ colour, symbol, label, disabled, pressed, onClick }: KeyProps) {
  return (
    <button
      type="button"
      className={`tape-key ${colour} ${pressed ? 'pressed' : ''}`}
      disabled={disabled}
      aria-pressed={pressed}
      onClick={onClick}
    >
      <span className="tape-key-cap" aria-hidden="true">
        {symbol}
      </span>
      <span className="tape-key-label">{label}</span>
    </button>
  );
}

const Tri = ({ flip = false }: { flip?: boolean }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d={flip ? 'M15 4 L5 10 L15 16 Z' : 'M5 4 L15 10 L5 16 Z'} fill="currentColor" />
  </svg>
);
const Twin = ({ back = false }: { back?: boolean }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    {back ? (
      <path d="M10 4 L2 10 L10 16 Z M18 4 L10 10 L18 16 Z" fill="currentColor" />
    ) : (
      <path d="M2 4 L10 10 L2 16 Z M10 4 L18 10 L10 16 Z" fill="currentColor" />
    )}
  </svg>
);

/**
 * Cassette recorder on the page, built like a toy: the record key records
 * right away with the microphone (press again to stop), then listen, wind
 * back and forth, open a sound file or save the recording. The recording
 * belongs to this copy of the notebook. Give it `key={src}` so a new
 * recording starts fresh.
 */
export function CassetteRecorder({
  title,
  src,
  interactive,
  onSave,
  onOpen,
}: {
  title: string;
  src?: string;
  interactive: boolean;
  /** Saves a recording made with the record key. */
  onSave?: (file: Blob) => Promise<void>;
  /** Opens the sound dialog (record or upload a file). */
  onOpen?: () => void;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mode, setMode] = useState<'idle' | 'starting' | 'recording' | 'saving'>('idle');
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState('');
  const recorder = useRef<{ stop: () => void; cancel: () => void } | null>(null);
  useEffect(() => () => recorder.current?.cancel(), []);

  const wind = (delta: number) => {
    const a = audio.current;
    if (!a || !Number.isFinite(a.duration)) return;
    a.currentTime = Math.max(0, Math.min(a.duration, a.currentTime + delta));
  };

  async function record() {
    if (mode === 'recording') return recorder.current?.stop();
    if (!onSave) return onOpen?.();
    audio.current?.pause();
    setMessage('');
    setMode('starting');
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      setMode('idle');
      setMessage('Das Mikrofon ist nicht erlaubt.');
      return;
    }
    const media = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    const began = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - began) / 1000;
      setSeconds(elapsed);
      if (elapsed >= MAX_SECONDS) media.stop();
    }, 200);
    let cancelled = false;
    const finish = () => {
      clearInterval(timer);
      stream.getTracks().forEach((t) => t.stop());
    };
    media.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    media.onstop = async () => {
      finish();
      recorder.current = null;
      if (cancelled) return;
      setMode('saving');
      try {
        await onSave(new Blob(chunks, { type: media.mimeType || 'audio/webm' }));
        setMode('idle');
      } catch (e) {
        setMode('idle');
        setMessage((e as Error).message || 'Die Aufnahme konnte nicht gespeichert werden.');
      }
    };
    recorder.current = {
      stop: () => media.state === 'recording' && media.stop(),
      cancel: () => {
        cancelled = true;
        if (media.state === 'recording') media.stop();
        else finish();
      },
    };
    media.start(250);
    setSeconds(0);
    setMode('recording');
  }

  const recording = mode === 'recording';
  const busy = mode !== 'idle' && !recording;
  const status = recording
    ? `Aufnahme ${clock(seconds)}`
    : mode === 'starting'
      ? 'Mikrofon startet …'
      : mode === 'saving'
        ? 'Wird gespeichert …'
        : src
          ? `${clock(time)} / ${clock(duration)}`
          : 'Noch leer';
  return (
    <div className={`tape-recorder ${recording ? 'recording' : ''}`} onPointerDown={(e) => e.stopPropagation()}>
      <div className="tape-handle" aria-hidden="true" />
      <div className="tape-body">
        <div className="tape-top">
          <div className="tape-speaker" aria-hidden="true" />
          <div className="tape-window">
            <CassetteArt title={title} spinning={playing || recording} progress={duration ? time / duration : 0} />
          </div>
          <div className="tape-side">
            <span className="tape-light" aria-hidden="true" />
            <div className="tape-display" role="status" aria-live="off">
              {status}
            </div>
          </div>
        </div>
        {src && (
          <audio
            ref={audio}
            src={src}
            preload="metadata"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onDurationChange={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
        )}
        <div className="tape-keys">
          <Key
            colour="red"
            symbol={recording ? <span className="tape-square" /> : <span className="tape-dot" />}
            label={recording ? 'Fertig' : 'Aufnehmen'}
            pressed={recording}
            disabled={!interactive || busy || (!onSave && !onOpen)}
            onClick={() => void record()}
          />
          <Key colour="yellow" symbol={<Twin back />} label="Zurück" disabled={!src || recording} onClick={() => wind(-5)} />
          <Key
            colour="green"
            symbol={playing ? <span className="tape-pause" /> : <Tri />}
            label={playing ? 'Pause' : 'Abspielen'}
            disabled={!src || recording || busy}
            onClick={() => {
              const a = audio.current;
              if (!a) return;
              if (a.paused) void a.play().catch(() => undefined);
              else a.pause();
            }}
          />
          <Key
            colour="blue"
            symbol={<span className="tape-square" />}
            label="Stopp"
            disabled={!src && !recording}
            onClick={() => {
              if (recording) return recorder.current?.stop();
              const a = audio.current;
              if (!a) return;
              a.pause();
              a.currentTime = 0;
              setTime(0);
            }}
          />
          <Key colour="yellow" symbol={<Twin />} label="Vor" disabled={!src || recording} onClick={() => wind(5)} />
        </div>
        <div className="tape-extras">
          {onOpen && (
            <button type="button" className="tape-small" disabled={!interactive || recording || busy} onClick={onOpen}>
              Datei öffnen
            </button>
          )}
          {src ? (
            <a className="tape-small" href={src} download={title || 'Aufnahme'}>
              Speichern
            </a>
          ) : null}
        </div>
        {message && (
          <p className="tape-message" role="alert">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
