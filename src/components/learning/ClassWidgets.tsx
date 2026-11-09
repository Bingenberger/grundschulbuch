/* eslint-disable @next/next/no-img-element -- Stored school media use authenticated URLs. */
'use client';
import { useEffect, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { detectedPitch } from '@/lib/learning/algorithms';
import { audioContext, tone } from '@/lib/learning/audio';
import { speakGerman } from '@/lib/speech';
import { useLearning } from './Runtime';
export default function ClassWidgets({
  element: el,
}: {
  element: PageElement;
}) {
  const { state, update, interactive } = useLearning(el),
    c = el.settings || {},
    kind = el.widgetKind;
  const say = (text: string) =>
    speakGerman(text, {
      voice: c.voice,
      rate: c.speechRate,
      pitch: c.speechPitch,
    });
  const [now, setNow] = useState(() => Date.now());
  const [mic, setMic] = useState(false);
  const [level, setLevel] = useState(0);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [error, setError] = useState('');
  const lastBell = useRef(0);
  useEffect(() => {
    if (!interactive || !['timer', 'multitimer', 'pitch'].includes(kind!))
      return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [interactive, kind]);
  useEffect(() => {
    if (!mic || !interactive) return;
    let source: MediaStream | null = null,
      stopped = false,
      raf = 0;
    const begin = async () => {
      try {
        source = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (stopped) {
          source.getTracks().forEach((t) => t.stop());
          return;
        }
        const ctx = audioContext(),
          input = ctx.createMediaStreamSource(source),
          analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        input.connect(analyser);
        const samples = new Float32Array(analyser.fftSize);
        let previous = 0;
        const frame = (time: number) => {
          if (stopped) return;
          if (time - previous > 100) {
            previous = time;
            analyser.getFloatTimeDomainData(samples);
            let sum = 0;
            for (const n of samples) sum += n * n;
            setLevel(Math.min(100, Math.sqrt(sum / samples.length) * 350));
            if (kind === 'tuner')
              setFrequency(detectedPitch(samples, ctx.sampleRate));
          }
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
      } catch {
        setError(
          'Bitte Mikrofonzugriff erlauben. Es wird kein Ton hochgeladen.',
        );
        setMic(false);
      }
    };
    void begin();
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      source?.getTracks().forEach((t) => t.stop());
    };
  }, [mic, interactive, kind]);
  const deadline = Number(state.deadline) || 0,
    remaining = deadline
      ? Math.max(0, Math.ceil((deadline - now) / 1000))
      : Number(state.remaining ?? c.seconds ?? 60);
  useEffect(() => {
    if (
      !deadline ||
      remaining > 0 ||
      lastBell.current === deadline ||
      !interactive
    )
      return;
    lastBell.current = deadline;
    tone(880, 0.7, 0.25);
  }, [deadline, remaining, interactive]);
  let content: React.ReactNode;
  if (kind === 'timer' || kind === 'pitch')
    content = (
      <>
        <div
          className={`timer-face ${remaining === 0 ? 'timer-finished' : ''}`}
        >
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#dfe8dc"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={remaining < 10 ? '#bf5757' : '#52796f'}
              strokeWidth="8"
              strokeDasharray={`${Math.max(0, Math.min(1, remaining / (c.seconds || 60))) * 276.46} 276.46`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <strong>
            {Math.floor(remaining / 60)}:
            {String(remaining % 60).padStart(2, '0')}
          </strong>
        </div>
        <div className="learning-actions">
          <button
            disabled={!interactive}
            onClick={() =>
              update(
                deadline
                  ? { deadline: 0, remaining }
                  : { deadline: Date.now() + remaining * 1000 },
              )
            }
          >
            {deadline && remaining ? 'Pause' : 'Start'}
          </button>
          <button
            disabled={!interactive}
            onClick={() => update({ deadline: 0, remaining: c.seconds || 60 })}
          >
            Zurücksetzen
          </button>
        </div>
        {kind === 'pitch' && (
          <p>{c.text || 'Beschreibe deine Idee in einer Minute.'}</p>
        )}
      </>
    );
  else if (kind === 'multitimer') {
    const timers = c.slides?.length
      ? c.slides
      : [
          { title: 'Arbeiten', seconds: c.seconds || 300 },
          { title: 'Aufräumen', seconds: 60 },
          { title: 'Pause', seconds: 120 },
        ];
    const times = Array.isArray(state.deadlines)
      ? state.deadlines.map(Number)
      : [];
    content = (
      <div className="multi-timers">
        {timers.map((timer, i) => {
          const left = times[i]
            ? Math.max(0, Math.ceil((times[i] - now) / 1000))
            : timer.seconds || 60;
          return (
            <div key={i}>
              <strong>{timer.title}</strong>
              <output>
                {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
              </output>
              <button
                disabled={!interactive}
                onClick={() => {
                  const next = [...times];
                  next[i] = Date.now() + (timer.seconds || 60) * 1000;
                  update({ deadlines: next });
                }}
              >
                Start
              </button>
              <button
                disabled={!interactive}
                onClick={() => {
                  const next = [...times];
                  next[i] = 0;
                  update({ deadlines: next });
                }}
              >
                ↺
              </button>
            </div>
          );
        })}
      </div>
    );
  } else if (kind === 'clock') {
    const hour = Number(state.hour ?? 3),
      minute = Number(state.minute ?? 0);
    const hand = (angle: number, length: number) => ({
      x: 50 + length * Math.sin(angle),
      y: 50 - length * Math.cos(angle),
    });
    const h = hand(((hour + minute / 60) / 12) * Math.PI * 2, 24),
      m = hand((minute / 60) * Math.PI * 2, 36);
    content = (
      <>
        <svg
          viewBox="0 0 100 100"
          className="clock-face"
          onPointerDown={(e) => {
            if (!interactive) return;
            const box = e.currentTarget.getBoundingClientRect(),
              x = ((e.clientX - box.left) / box.width) * 100 - 50,
              y = ((e.clientY - box.top) / box.height) * 100 - 50;
            const angle = (Math.atan2(x, -y) + Math.PI * 2) % (Math.PI * 2);
            if (Math.hypot(x, y) < 28)
              update({ hour: Math.round((angle / (Math.PI * 2)) * 12) % 12 });
            else
              update({ minute: Math.round((angle / (Math.PI * 2)) * 60) % 60 });
          }}
        >
          <circle cx="50" cy="50" r="47" fill="#fffdf4" stroke="#6f8975" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = ((i + 1) / 12) * Math.PI * 2;
            return (
              <text
                x={50 + 39 * Math.sin(a)}
                y={53 - 39 * Math.cos(a)}
                textAnchor="middle"
                fontSize="8"
                key={i}
              >
                {i + 1}
              </text>
            );
          })}
          <line
            x1="50"
            y1="50"
            x2={h.x}
            y2={h.y}
            stroke="#c35858"
            strokeWidth="3"
          />
          <line
            x1="50"
            y1="50"
            x2={m.x}
            y2={m.y}
            stroke="#46709a"
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="3" fill="#52796f" />
        </svg>
        <div className="learning-actions">
          <label>
            Stunde{' '}
            <input
              type="number"
              min="0"
              max="23"
              disabled={!interactive}
              value={hour}
              onChange={(e) => update({ hour: Number(e.target.value) })}
            />
          </label>
          <label>
            Minute{' '}
            <input
              type="number"
              min="0"
              max="59"
              disabled={!interactive}
              value={minute}
              onChange={(e) => update({ minute: Number(e.target.value) })}
            />
          </label>
          <button
            disabled={!interactive}
            onClick={() => say(`${hour} Uhr ${minute || ''}`)}
          >
            ▷
          </button>
        </div>
      </>
    );
  } else if (kind === 'calendar') {
    const date = new Date(
      String(
        state.date ||
          new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Europe/Berlin',
          }).format(new Date()),
      ) + 'T12:00:00',
    );
    const year = date.getFullYear(),
      month = date.getMonth(),
      first = new Date(year, month, 1),
      days = new Date(year, month + 1, 0).getDate(),
      offset = (first.getDay() + 6) % 7;
    content = (
      <>
        <div className="learning-actions">
          <button
            disabled={!interactive}
            onClick={() =>
              update({
                date: new Date(year, month - 1, 15, 12)
                  .toISOString()
                  .slice(0, 10),
              })
            }
          >
            ‹
          </button>
          <strong>
            {date.toLocaleDateString('de-DE', {
              month: 'long',
              year: 'numeric',
            })}
          </strong>
          <button
            disabled={!interactive}
            onClick={() =>
              update({
                date: new Date(year, month + 1, 15, 12)
                  .toISOString()
                  .slice(0, 10),
              })
            }
          >
            ›
          </button>
        </div>
        <div className="calendar-grid">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
            <b key={d}>{d}</b>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <span key={`e${i}`} />
          ))}
          {Array.from({ length: days }, (_, i) => (
            <button
              disabled={!interactive}
              key={i}
              aria-pressed={date.getDate() === i + 1}
              onClick={() => {
                const selected = new Date(year, month, i + 1, 12);
                update({ date: selected.toISOString().slice(0, 10) });
                say(
                  selected.toLocaleDateString('de-DE', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }),
                );
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </>
    );
  } else if (kind === 'noise' || kind === 'applause')
    content = (
      <>
        <div
          className="noise-light"
          style={{
            background:
              level > 65 ? '#c25a56' : level > 30 ? '#d5ae4a' : '#70a16b',
          }}
        >
          <strong>
            {kind === 'applause'
              ? `${Math.round(level)} %`
              : level > 65
                ? 'Leiser bitte'
                : level > 30
                  ? 'Etwas lauter'
                  : 'Ruhig'}
          </strong>
        </div>
        <meter min="0" max="100" value={level} />
        <button disabled={!interactive} onClick={() => setMic(!mic)}>
          {mic ? 'Mikrofon ausschalten' : 'Mikrofon einschalten'}
        </button>
        <small>Der Ton wird nur auf diesem Gerät gemessen.</small>
      </>
    );
  else if (kind === 'tuner') {
    const tunings: Record<string, number[]> = {
      guitar: [40, 45, 50, 55, 59, 64],
      ukulele: [67, 60, 64, 69],
      bass: [28, 33, 38, 43],
      violin: [55, 62, 69, 76],
      cello: [36, 43, 50, 57],
    };
    const strings = tunings[c.mode || 'guitar'] || [60, 62, 64, 65, 67, 69, 71];
    const midi = frequency
      ? c.mode && c.mode !== 'chromatic'
        ? strings.reduce((nearest, n) =>
            Math.abs(69 + 12 * Math.log2(frequency / 440) - n) <
            Math.abs(69 + 12 * Math.log2(frequency / 440) - nearest)
              ? n
              : nearest,
          )
        : Math.round(69 + 12 * Math.log2(frequency / 440))
      : 69;
    const names = [
      'C',
      'Cis',
      'D',
      'Dis',
      'E',
      'F',
      'Fis',
      'G',
      'Gis',
      'A',
      'B',
      'H',
    ];
    const cents = frequency
      ? 1200 * Math.log2(frequency / (440 * Math.pow(2, (midi - 69) / 12)))
      : 0;
    content = (
      <>
        <div className="tuner-note">
          {frequency ? names[((midi % 12) + 12) % 12] : '–'}
        </div>
        <output>
          {frequency
            ? `${frequency.toFixed(1)} Hz · ${cents >= 0 ? '+' : ''}${Math.round(cents)} Cent`
            : 'Spiele einen Ton'}
        </output>
        <meter
          min="-50"
          max="50"
          low={-10}
          high={10}
          optimum={0}
          value={cents}
        />
        <button disabled={!interactive} onClick={() => setMic(!mic)}>
          {mic ? 'Stoppen' : 'Stimmen starten'}
        </button>
        <div className="learning-actions">
          {strings.map((note) => (
            <button
              key={note}
              disabled={!interactive}
              onClick={() => tone(440 * Math.pow(2, (note - 69) / 12), 1, 0.2)}
            >
              {names[note % 12]}
              {Math.floor(note / 12) - 1}
            </button>
          ))}
        </div>
      </>
    );
  } else if (kind === 'timetable')
    content = (
      <div
        className="timetable-grid"
        style={{
          gridTemplateColumns: `repeat(${Math.max(2, Math.min(7, c.columns || 5))},1fr)`,
        }}
      >
        {(c.cells || []).map((cell, i) => (
          <button
            key={i}
            disabled={!interactive}
            aria-pressed={state.selected === i}
            style={{ background: cell.color || '#f0f4e9' }}
            onClick={() => {
              update({ selected: i });
              say(cell.speak || cell.label);
            }}
          >
            {cell.image && <img src={cell.image} alt="" />}
            <span>{cell.label}</span>
          </button>
        ))}
      </div>
    );
  return (
    <section
      className="learning-widget"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <header>
        <strong>{c.title || 'Unterrichtswerkzeug'}</strong>
      </header>
      <div className="learning-content">{content}</div>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
