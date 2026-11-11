'use client';
import { useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';

/**
 * Sound on the page: one big round button. Tap plays, tap again pauses; the
 * ring shows how far it has played. Works in the editor, for children and in
 * the HTML export (no icon files).
 */
export default function AudioButton({ element }: { element: PageElement }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const title = element.alt || 'Ton';
  const r = 46, circumference = 2 * Math.PI * r;
  return (
    <div className="audio-button-box">
      <button
        type="button"
        className={`audio-button ${playing ? 'playing' : ''}`}
        aria-label={`${title} ${playing ? 'anhalten' : 'abspielen'}`}
        title={title}
        onPointerDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        onClick={() => {
          const a = audio.current;
          if (!a) return;
          if (a.paused) {
            if (a.ended) a.currentTime = 0;
            void a.play().catch(() => setPlaying(false));
          } else a.pause();
        }}
      >
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="49" className="audio-button-face" />
          <circle cx="50" cy="50" r={r} className="audio-button-track" />
          <circle
            cx="50"
            cy="50"
            r={r}
            className="audio-button-ring"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            transform="rotate(-90 50 50)"
          />
          {playing ? (
            <g className="audio-button-symbol">
              <rect x="36" y="32" width="10" height="36" rx="2.5" />
              <rect x="54" y="32" width="10" height="36" rx="2.5" />
            </g>
          ) : (
            <path className="audio-button-symbol" d="M40 30 L72 50 L40 70 Z" strokeLinejoin="round" />
          )}
        </svg>
      </button>
      <audio
        ref={audio}
        src={element.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          if (Number.isFinite(a.duration) && a.duration > 0) setProgress(a.currentTime / a.duration);
        }}
      />
    </div>
  );
}
