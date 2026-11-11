'use client';
import { useRef, useState } from 'react';

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

/**
 * Cassette recorder on the page: record (or open a sound file), listen,
 * wind back and forth, save the recording as a file. The recording belongs to
 * this copy of the notebook. Give it `key={src}` so a new recording starts fresh.
 */
export function CassetteRecorder({
  title,
  src,
  interactive,
  onRecord,
}: {
  title: string;
  src?: string;
  interactive: boolean;
  onRecord?: () => void;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const wind = (delta: number) => {
    const a = audio.current;
    if (!a || !Number.isFinite(a.duration)) return;
    a.currentTime = Math.max(0, Math.min(a.duration, a.currentTime + delta));
  };
  const stop = (e: React.PointerEvent) => e.stopPropagation();
  return (
    <div className="cassette-recorder" onPointerDown={stop}>
      <CassetteArt title={title} spinning={playing} progress={duration ? time / duration : 0} />
      <div className="cassette-time" aria-live="off">
        {src ? `${clock(time)} / ${clock(duration)}` : 'Noch keine Aufnahme'}
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
      <div className="cassette-keys">
        <button type="button" className="cassette-key record" disabled={!interactive || !onRecord} onClick={onRecord}>
          <span aria-hidden="true">●</span> Aufnehmen
        </button>
        <button type="button" className="cassette-key" disabled={!src} onClick={() => wind(-5)}>
          <span aria-hidden="true">◀◀</span> Zurück
        </button>
        <button
          type="button"
          className="cassette-key"
          disabled={!src}
          onClick={() => {
            const a = audio.current;
            if (!a) return;
            if (a.paused) void a.play().catch(() => undefined);
            else a.pause();
          }}
        >
          <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span> {playing ? 'Pause' : 'Abspielen'}
        </button>
        <button
          type="button"
          className="cassette-key"
          disabled={!src}
          onClick={() => {
            const a = audio.current;
            if (!a) return;
            a.pause();
            a.currentTime = 0;
            setTime(0);
          }}
        >
          <span aria-hidden="true">■</span> Stopp
        </button>
        <button type="button" className="cassette-key" disabled={!src} onClick={() => wind(5)}>
          <span aria-hidden="true">▶▶</span> Vor
        </button>
        {src ? (
          <a className="cassette-key" href={src} download={`${title || 'Aufnahme'}`}>
            <span aria-hidden="true">⤓</span> Speichern
          </a>
        ) : (
          <button type="button" className="cassette-key" disabled>
            <span aria-hidden="true">⤓</span> Speichern
          </button>
        )}
      </div>
    </div>
  );
}
