'use client';
import { CassetteRecorder } from './Cassette';
import { Picker } from '../ui/Choice';
import { TextGlyph } from '../ui/Glyphs';
import { useEffect, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { seeded, noteFrequency } from '@/lib/learning/algorithms';
import {
  audioContext,
  downloadBlob,
  drum,
  mixAudio,
  notesWav,
  rhythmWav,
  tone,
} from '@/lib/learning/audio';
import { useLearning } from './Runtime';
const scale = [60, 62, 64, 65, 67, 69, 71, 72],
  names = ['C', 'D', 'E', 'F', 'G', 'A', 'H', 'C'];
export default function MusicWidgets({
  element: el,
}: {
  element: PageElement;
}) {
  const { state, update, interactive, onRecord, uploadAudio } = useLearning(el),
    c = el.settings || {},
    kind = el.widgetKind;
  const [playing, setPlaying] = useState(false),
    [step, setStep] = useState(0),
    [recording, setRecording] = useState(false),
    [notice, setNotice] = useState('');
  const started = useRef(0),
    events = useRef<{ note: number; at: number; duration: number }[]>([]),
    timeouts = useRef<ReturnType<typeof setTimeout>[]>([]),
    players = useRef<HTMLAudioElement[]>([]);
  const recorded = Array.isArray(state.events)
    ? (state.events as unknown as {
        note: number;
        at: number;
        duration: number;
      }[])
    : [];
  const target = c.notes?.length
    ? c.notes
    : scale
        .slice(0, 4)
        .map((_, i) => scale[seeded((c.seed || 42) + i)(scale.length)]);
  const beats = (
    Array.isArray(state.beats)
      ? state.beats
      : c.beats || Array.from({ length: 4 }, () => Array(16).fill(false))
  ) as boolean[][];
  useEffect(
    () => () => {
      timeouts.current.forEach(clearTimeout);
      players.current.forEach((p) => p.pause());
    },
    [],
  );
  useEffect(() => {
    if (
      !playing ||
      !interactive ||
      !['sequencer', 'metronome', 'falling'].includes(kind!)
    )
      return;
    const delay = 60000 / Math.max(30, Math.min(240, c.bpm || 90)) / (kind === 'sequencer' ? 4 : 1);
    const id = setInterval(() => setStep((old) => old + 1), delay);
    return () => clearInterval(id);
  }, [playing, interactive, kind, c.bpm]);
  useEffect(() => {
    if (!playing || !interactive) return;
    if (kind === 'sequencer')
      beats.forEach((row, i) => {
        if (row[step % 16])
          drum(i, c.volume ?? 0.3, undefined, c.mode || 'drumset');
      });
    if (kind === 'metronome') {
      const accent = step % Math.max(1, Math.min(12, c.rows || 4)) === 0;
      if (c.mode === 'wood') drum(6, c.volume ?? 0.3, undefined, 'orff');
      else if (c.mode === 'cowbell')
        tone(accent ? 980 : 720, 0.12, c.volume ?? 0.3, 'tube');
      else if (c.mode === 'bell')
        tone(accent ? 1320 : 880, 0.2, c.volume ?? 0.3, 'glockenspiel');
      else
        tone(
          accent ? 1200 : 800,
          c.mode === 'click' ? 0.025 : 0.06,
          c.volume ?? 0.3,
        );
    }
  }, [step, playing, interactive, kind, beats, c.volume, c.mode, c.rows]);
  function key(note: number) {
    tone(noteFrequency(note), 0.6, c.volume ?? 0.3, c.instrument);
    if (recording && events.current.length < 2000)
      events.current.push({
        note,
        at: (audioContext().currentTime - started.current) / 1,
        duration: 0.5,
      });
    if (kind === 'echo') {
      const index = Number(state.index) || 0;
      if (note === target[index]) {
        update({
          index: index + 1,
          completed: index + 1 === target.length,
          score: Math.round(((index + 1) / target.length) * 100),
        });
        setNotice(
          index + 1 === target.length
            ? '✓ Genau nachgespielt!'
            : 'Richtig, weiter!',
        );
      } else {
        setNotice('Höre noch einmal hin.');
        update({ index: 0, attempts: (Number(state.attempts) || 0) + 1 });
      }
    }
    if (kind === 'falling') {
      const index = Number(state.index) || 0;
      if (note === target[index % target.length]) {
        update({
          index: index + 1,
          score: Math.min(100, (index + 1) * 10),
          completed: index >= 9,
        });
        setNotice('✓');
      } else setNotice('Das war ein anderer Ton.');
    }
  }
  const pitchNames = [
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
  const allowed = (
    {
      all: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      penta: [0, 2, 4, 7, 9],
      pentaMinor: [0, 3, 5, 7, 10],
      blues: [0, 3, 5, 6, 7, 10],
    } as Record<string, number[]>
  )[c.mode || 'major'] || [0, 2, 4, 5, 7, 9, 11];
  const keys =
    kind === 'piano'
      ? Array.from(
          { length: Math.max(1, Math.min(2, c.octaves || 1)) * 12 + 1 },
          (_, i) => 60 + i,
        ).filter((note) => allowed.includes(note % 12))
      : scale;
  const keyboard = (
    <div className="piano-keys">
      {keys.map((note) => (
        <button
          disabled={!interactive}
          className={[1, 3, 6, 8, 10].includes(note % 12) ? 'black-key' : ''}
          key={note}
          aria-label={`Ton ${pitchNames[note % 12]}${Math.floor(note / 12) - 1}`}
          onPointerDown={(e) => {
            e.preventDefault();
            key(note);
          }}
        >
          {pitchNames[note % 12]}
        </button>
      ))}
    </div>
  );
  const melodies: Record<string, number[]> = {
    Morgengruß: [60, 64, 67, 72, 71, 67, 64, 60],
    Spaziergang: [60, 62, 64, 65, 67, 65, 64, 62],
    Fragespiel: [60, 64, 67, 64, 62, 65, 69, 65],
    Kreistanz: [60, 62, 64, 67, 64, 62, 60, 60],
    Treppenstufen: [60, 62, 60, 64, 62, 65, 64, 67],
    Sternenlicht: [72, 67, 69, 64, 65, 62, 64, 60],
    Regentanz: [64, 64, 62, 60, 67, 65, 64, 62],
    Abendlied: [67, 64, 65, 62, 64, 60, 62, 60],
  };
  const recordControls = (
    <div className="learning-actions">
      <button
        disabled={!interactive}
        aria-pressed={recording}
        onClick={() => {
          if (recording) {
            update({ events: events.current.map((e) => ({ ...e })) });
            setRecording(false);
          } else {
            events.current = [];
            started.current = audioContext().currentTime;
            setRecording(true);
          }
        }}
      >
        {recording ? '■ Melodie beenden' : '● Melodie aufnehmen'}
      </button>
      <button
        disabled={!interactive || !recorded.length}
        onClick={() =>
          recorded.forEach((n) =>
            timeouts.current.push(
              setTimeout(
                () =>
                  tone(
                    noteFrequency(n.note),
                    n.duration,
                    c.volume ?? 0.3,
                    c.instrument,
                  ),
                n.at * 1000,
              ),
            ),
          )
        }
      >
        ▷ Melodie
      </button>
      <button
        disabled={!interactive || !recorded.length}
        onClick={async () =>
          downloadBlob(
            await notesWav(recorded, c.instrument, c.volume),
            'melodie.wav',
          )
        }
      >
        WAV
      </button>
    </div>
  );
  let content: React.ReactNode;
  if (kind === 'piano')
    content = (
      <>
        <Picker
          compact
          label="Melodie wählen"
          value={String(state.melody || 'custom')}
          disabled={!interactive}
          onChange={(melody) =>
            update({
              melody,
              events: (melodies[melody] || []).map((note, i) => ({
                note,
                at: i * 0.5,
                duration: i === 7 ? 0.9 : 0.4,
              })),
            })
          }
          options={[
            { value: 'custom', label: 'Eigene Melodie', icon: <TextGlyph text="✎" tone="green" /> },
            ...Object.keys(melodies).map((name) => ({ value: name, label: name, icon: <TextGlyph text="♪" /> })),
          ]}
        />
        {keyboard}
        {recordControls}
      </>
    );
  else if (kind === 'drums')
    content = (
      <div className="drum-pads">
        {[
          'Bassdrum',
          'Snare',
          'Hi-Hat',
          'Becken',
          'Cajón',
          'Bongo',
          'Klangholz',
          'Glocke',
        ].map((label, i) => (
          <button
            key={i}
            disabled={!interactive}
            onPointerDown={(e) => {
              e.preventDefault();
              if (i < 7)
                drum(i, c.volume ?? 0.3, undefined, c.mode || 'drumset');
              else tone(1047, 0.7, c.volume ?? 0.3, 'glockenspiel');
            }}
          >
            {label}
          </button>
        ))}
      </div>
    );
  else if (kind === 'sequencer')
    content = (
      <>
        <Picker
          compact
          label="Rhythmusvorlage"
          disabled={!interactive}
          value={String(state.pattern || 'custom')}
          onChange={(pattern) => {
              const at = [
                'rock',
                'pop',
                'disco',
                'hiphop',
                'funk',
                'reggae',
                'bossa',
                'samba',
                'march',
                'techno',
              ].indexOf(pattern);
              const kick =
                [
                  [0, 8],
                  [0, 6, 8],
                  [0, 4, 8, 12],
                  [0, 7, 10],
                  [0, 3, 8, 11],
                  [4, 12],
                  [0, 6, 10],
                  [0, 3, 8, 11],
                  [0, 8],
                  [0, 4, 8, 12],
                ][at] || [];
              update({
                pattern,
                beats: [
                  Array.from({ length: 16 }, (_, i) => kick.includes(i)),
                  Array.from({ length: 16 }, (_, i) => [4, 12].includes(i)),
                  Array.from(
                    { length: 16 },
                    (_, i) => i % (at === 5 ? 4 : 2) === 0,
                  ),
                  Array.from(
                    { length: 16 },
                    (_, i) => at > 4 && [3, 7, 11, 15].includes(i),
                  ),
                ],
              });
          }}
          options={[
            { value: 'custom', label: 'Eigener Rhythmus', icon: <TextGlyph text="✎" tone="green" /> },
            ...([['rock', 'Rock'], ['pop', 'Pop'], ['disco', 'Disco'], ['hiphop', 'Hip-Hop'], ['funk', 'Funk'], ['reggae', 'Reggae'], ['bossa', 'Bossa Nova'], ['samba', 'Samba'], ['march', 'Marsch'], ['techno', 'Techno']] as const).map(([value, label]) => ({ value, label, icon: <TextGlyph text="♩" tone="orange" /> })),
          ]}
        />
        <div className="sequencer">
          {beats.slice(0, 4).map((row, r) => (
            <div key={r}>
              <span>{['Bass', 'Snare', 'Hi-Hat', 'Klang'][r]}</span>
              {Array.from({ length: 16 }, (_, col) => (
                <button
                  key={col}
                  disabled={!interactive}
                  aria-label={`Spur ${r + 1}, Schritt ${col + 1}`}
                  aria-pressed={!!row[col]}
                  className={playing && step % 16 === col ? 'is-step' : ''}
                  onClick={() => {
                    const next = beats.map((b) => [...b]);
                    next[r][col] = !next[r][col];
                    update({ beats: next, pattern: 'custom' });
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="learning-actions">
          <button
            disabled={!interactive}
            onClick={() => {
              audioContext();
              setPlaying(!playing);
              setStep(0);
            }}
          >
            {playing ? '■ Stop' : '▷ Rhythmus'}
          </button>
          <button
            disabled={!interactive}
            onClick={async () => {
              downloadBlob(
                await rhythmWav(
                  beats,
                  c.bpm || 90,
                  c.volume ?? 0.3,
                  c.mode || 'drumset',
                ),
                'rhythmus.wav',
              );
            }}
          >
            WAV speichern
          </button>
        </div>
      </>
    );
  else if (kind === 'metronome')
    content = (
      <>
        <div className="metronome-dots">
          {Array.from(
            { length: Math.max(1, Math.min(12, c.rows || 4)) },
            (_, i) => i,
          ).map((i) => (
            <span
              className={
                playing && step % Math.max(1, Math.min(12, c.rows || 4)) === i
                  ? 'active'
                  : ''
              }
              key={i}
            >
              ●
            </span>
          ))}
        </div>
        <strong className="tempo">{c.bpm || 90} BPM</strong>
        <button
          disabled={!interactive}
          onClick={() => {
            audioContext();
            setPlaying(!playing);
            setStep(0);
          }}
        >
          {playing ? '■ Stop' : '▷ Start'}
        </button>
      </>
    );
  else if (kind === 'echo')
    content = (
      <>
        <button
          disabled={!interactive}
          onClick={() => {
            target.forEach((note, i) =>
              timeouts.current.push(
                setTimeout(
                  () =>
                    tone(
                      noteFrequency(note),
                      0.45,
                      c.volume ?? 0.3,
                      c.instrument,
                    ),
                  i * 650,
                ),
              ),
            );
            update({ index: 0 });
            setNotice('Höre zu und spiele die Folge nach.');
          }}
        >
          ▷ Tonfolge anhören
        </button>
        <div className="sequence-progress">
          {target.map((_, i) => (
            <span key={i}>{i < (Number(state.index) || 0) ? '●' : '○'}</span>
          ))}
        </div>
        {keyboard}
      </>
    );
  else if (kind === 'notequiz' || kind === 'falling') {
    const index = Number(state.index) || 0,
      note = target[index % target.length],
      scaleIndex = Math.max(0, scale.indexOf(note));
    content = (
      <>
        <svg className="staff" viewBox="0 0 220 100">
          {[30, 40, 50, 60, 70].map((y) => (
            <line key={y} x1="10" x2="210" y1={y} y2={y} stroke="#a8b6a5" />
          ))}
          <text x="15" y="73" fontSize="55">
            𝄞
          </text>
          <ellipse
            cx={kind === 'falling' ? 180 - (step % 16) * 8 : 115}
            cy={80 - scaleIndex * 5}
            rx="7"
            ry="5"
            transform={`rotate(-20 ${kind === 'falling' ? 180 - (step % 16) * 8 : 115} ${80 - scaleIndex * 5})`}
            fill="#355e4a"
          />
          <line
            x1={kind === 'falling' ? 187 - (step % 16) * 8 : 122}
            x2={kind === 'falling' ? 187 - (step % 16) * 8 : 122}
            y1={80 - scaleIndex * 5}
            y2={50 - scaleIndex * 5}
            stroke="#355e4a"
            strokeWidth="2"
          />
        </svg>
        {kind === 'falling' ? (
          <>
            <button
              disabled={!interactive}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? 'Pause' : 'Notenregen starten'}
            </button>
            {keyboard}
          </>
        ) : (
          <div className="learning-actions">
            {names.slice(0, 7).map((name, i) => (
              <button
                key={name}
                disabled={!interactive}
                onClick={() => {
                  const correct = scale[i] === note || (note === 72 && i === 0);
                  setNotice(
                    correct ? '✓ Richtig!' : 'Versuche es noch einmal.',
                  );
                  if (correct) {
                    tone(noteFrequency(note));
                    update({
                      index: index + 1,
                      score: 100,
                      completed: index + 1 >= target.length,
                    });
                  }
                }}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </>
    );
  } else if (kind === 'playlist') {
    const tracks = (c.tracks || []).filter((t) => t.src),
      index = Math.max(
        0,
        Math.min(tracks.length - 1, Number(state.index) || 0),
      ),
      track = tracks[index];
    content = (
      <>
        <div className="playlist-items">
          {tracks.length ? (
            tracks.map((t, i) => (
              <button
                key={i}
                aria-pressed={index === i}
                disabled={!interactive}
                onClick={() => update({ index: i })}
              >
                {i + 1}. {t.title}
              </button>
            ))
          ) : (
            <p>Füge in den Einstellungen Tondateien hinzu.</p>
          )}
        </div>
        {track?.src && (
          <audio
            controls
            autoPlay={playing && interactive}
            key={index}
            src={track.src}
            onPlay={() => setPlaying(true)}
            onEnded={() => {
              if (index + 1 < tracks.length) update({ index: index + 1 });
              else if (c.repeat) update({ index: 0 });
              else setPlaying(false);
            }}
          />
        )}
        <div className="learning-actions">
          <button
            disabled={!interactive || index === 0}
            onClick={() => update({ index: index - 1 })}
          >
            ‹ Voriger Titel
          </button>
          <button
            disabled={!interactive || index + 1 >= tracks.length}
            onClick={() => update({ index: index + 1 })}
          >
            Nächster Titel ›
          </button>
        </div>
      </>
    );
  } else if (kind === 'recorder')
    content = (
      <CassetteRecorder
        key={typeof state.recordingSrc === 'string' ? state.recordingSrc : 'leer'}
        title={c.title || 'Meine Aufnahme'}
        src={typeof state.recordingSrc === 'string' ? state.recordingSrc : undefined}
        interactive={interactive}
        onOpen={onRecord ? () => onRecord(el.id) : undefined}
        onSave={
          uploadAudio
            ? async (file) => {
                const src = await uploadAudio(el.id, file);
                update({
                  recordingSrc: src,
                  recordings: [
                    ...(Array.isArray(state.recordings) ? state.recordings : []),
                    { title: 'Aufnahme', src, offset: 0, volume: 1 },
                  ],
                });
              }
            : undefined
        }
      />
    );
  else if (kind === 'soundstudio') {
    const recordings = Array.isArray(state.recordings)
      ? (state.recordings as unknown as {
          title: string;
          src: string;
          offset: number;
          volume: number;
        }[])
      : [];
    const tracks = [...(c.tracks || []), ...recordings];
    const overrides = Array.isArray(state.mix)
      ? (state.mix as unknown as { offset: number; volume: number }[])
      : [];
    const mixed = tracks.map((track, i) => ({ ...track, ...overrides[i] }));
    content = (
      <>
        <div className="studio-tracks">
          {mixed.map((track, i) => (
            <div key={i}>
              <strong>{track.title || `Spur ${i + 1}`}</strong>
              {track.src ? (
                <audio controls src={track.src} preload="metadata" />
              ) : (
                <span>Noch kein Ton</span>
              )}
              <label>
                Start (s)
                <input
                  type="number"
                  min="0"
                  max="120"
                  step=".5"
                  disabled={!interactive}
                  value={track.offset || 0}
                  onChange={(e) => {
                    const next = [...overrides];
                    next[i] = {
                      offset: Number(e.target.value),
                      volume: track.volume ?? 1,
                    };
                    update({ mix: next.map((v) => (v ? { ...v } : null)) });
                  }}
                />
              </label>
              <label>
                Lautstärke
                <input
                  type="range"
                  min="0"
                  max="1"
                  step=".05"
                  disabled={!interactive}
                  value={track.volume ?? 1}
                  onChange={(e) => {
                    const next = [...overrides];
                    next[i] = {
                      offset: track.offset || 0,
                      volume: Number(e.target.value),
                    };
                    update({ mix: next.map((v) => (v ? { ...v } : null)) });
                  }}
                />
              </label>
            </div>
          ))}
        </div>
        <div className="learning-actions">
          <button
            disabled={!interactive || !onRecord}
            onClick={() => onRecord?.(el.id)}
          >
            ● Neue Aufnahme
          </button>
          <button
            disabled={!interactive}
            onClick={() => {
              players.current.forEach((p) => p.pause());
              timeouts.current.forEach(clearTimeout);
              mixed
                .filter((t) => t.src)
                .forEach((track) =>
                  timeouts.current.push(
                    setTimeout(
                      () => {
                        const audio = new Audio(track.src);
                        audio.volume = track.volume ?? 1;
                        players.current.push(audio);
                        void audio.play();
                      },
                      (track.offset || 0) * 1000,
                    ),
                  ),
                );
            }}
          >
            ▷ Alle Spuren
          </button>
          <button
            disabled={!interactive}
            onClick={() => {
              players.current.forEach((p) => p.pause());
              timeouts.current.forEach(clearTimeout);
            }}
          >
            ■ Stop
          </button>
          <button
            disabled={!interactive || !mixed.some((t) => t.src)}
            onClick={async () => {
              try {
                downloadBlob(
                  await mixAudio(
                    mixed.filter(
                      (t): t is typeof t & { src: string } => !!t.src,
                    ),
                  ),
                  'hoerspiel.wav',
                );
              } catch {
                setNotice('Eine Tondatei konnte nicht gelesen werden.');
              }
            }}
          >
            WAV exportieren
          </button>
        </div>
      </>
    );
  }

  return (
    <section
      className="learning-widget music-widget"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <header>
        <strong>{c.title || 'Musik'}</strong>
      </header>
      <div className="learning-content">{content}</div>
      {notice && <p role="status">{notice}</p>}
    </section>
  );
}
