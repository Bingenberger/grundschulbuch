'use client';
import AiDialog from './AiDialog';
import VoiceOptions from './VoiceOptions';
import WordBank from './WordBank';
import { effectWav, soundEffects } from '@/lib/learning/audio';
import { useState } from 'react';
import {
  activityCatalog,
  defaultSettings,
  widgetCatalog,
  type ActivityKind,
  type WidgetKind,
  type LearningSettings,
} from '@/lib/learning/catalog';
import { uuid, type PageElement } from '@/lib/notebook-model';
import { uploadImage } from '@/lib/client-api';
export default function LearningDialog({
  element,
  onSave,
  onClose,
}: {
  element?: PageElement;
  onSave: (el: PageElement) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<'widget' | 'activity'>(
    element?.type === 'activity' ? 'activity' : 'widget',
  );
  const [kind, setKind] = useState<WidgetKind | ActivityKind>(
    element?.widgetKind || element?.activityKind || 'timer',
  );
  const [settings, setSettings] = useState<LearningSettings>(
    element?.settings || defaultSettings(kind),
  );
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [effect, setEffect] = useState<keyof typeof soundEffects>('rain');
  const patch = (values: Partial<LearningSettings>) =>
    setSettings((s) => ({ ...s, ...values }));
  function choose(
    type: 'widget' | 'activity',
    kind: WidgetKind | ActivityKind,
  ) {
    setType(type);
    setKind(kind);
    setSettings(defaultSettings(kind));
  }
  async function media(file: File, done: (src: string) => void) {
    setBusy(true);
    try {
      if (file.type.startsWith('image/')) done(await uploadImage(file));
      else {
        if (file.size > 20 * 1024 * 1024)
          throw new Error('Tondateien dürfen höchstens 20 MB groß sein.');
        const response = await fetch('/api/ton', {
          method: 'POST',
          body: file,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        done(data.src);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const numeric = (
    name: keyof LearningSettings,
    label: string,
    min: number,
    max: number,
    step = 1,
  ) => (
    <label className="property-label" key={name}>
      {label}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={Number(settings[name] ?? min)}
        onChange={(e) =>
          patch({
            [name]: Math.max(min, Math.min(max, Number(e.target.value))),
          })
        }
      />
    </label>
  );
  const upload = (accept: string, done: (src: string) => void) => (
    <label className="knopf compact">
      Datei wählen
      <input
        className="visually-hidden"
        type="file"
        accept={accept}
        disabled={busy}
        onChange={(e) => {
          if (e.target.files?.[0]) void media(e.target.files[0], done);
        }}
      />
    </label>
  );
  return (
    <div className="modal-backdrop">
      <section
        className="modal learning-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="learning-dialog-title"
      >
        <div className="dialog-heading">
          <div>
            <h2 id="learning-dialog-title">
              {element ? 'Lernwerkzeug gestalten' : 'Lernwerkzeuge & Übungen'}
            </h2>
            <p>
              Gestalten, auf der Seite platzieren und im Tafelmodus oder
              Kinderheft benutzen.
            </p>
          </div>
          <button className="knopf" onClick={onClose}>
            Schließen
          </button>
        </div>
        <div className="learning-dialog-layout">
          {!element && (
            <nav className="learning-catalog">
              <input
                aria-label="Lernwerkzeug suchen"
                placeholder="Werkzeug suchen …"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <h3>Interaktive Übungen</h3>
              {Object.entries(activityCatalog)
                .filter(([, label]) =>
                  label.toLowerCase().includes(query.toLowerCase()),
                )
                .map(([id, label]) => (
                  <button
                    key={id}
                    aria-pressed={type === 'activity' && kind === id}
                    onClick={() => choose('activity', id as ActivityKind)}
                  >
                    {label}
                  </button>
                ))}
              {Array.from(
                new Set(Object.values(widgetCatalog).map(([, group]) => group)),
              ).map((group) => (
                <div key={group}>
                  <h3>{group}</h3>
                  {Object.entries(widgetCatalog)
                    .filter(
                      ([, data]) =>
                        data[1] === group &&
                        data[0].toLowerCase().includes(query.toLowerCase()),
                    )
                    .map(([id, [label]]) => (
                      <button
                        key={id}
                        aria-pressed={type === 'widget' && kind === id}
                        onClick={() => choose('widget', id as WidgetKind)}
                      >
                        {label}
                      </button>
                    ))}
                </div>
              ))}
            </nav>
          )}
          <form
            className="learning-options"
            onSubmit={(e) => {
              e.preventDefault();
              const learning: PageElement = {
                ...(element || {
                  id: uuid(),
                  x: 15,
                  y: 45,
                  width: 180,
                  height: 140,
                  rotation: 0,
                  locked: false,
                  color: '#253c42',
                }),
                type,
                widgetKind:
                  type === 'widget' ? (kind as WidgetKind) : undefined,
                activityKind:
                  type === 'activity' ? (kind as ActivityKind) : undefined,
                settings,
              };
              onSave(learning);
              onClose();
            }}
          >
            <button
              type="button"
              className="knopf compact"
              onClick={() => setShowAI(true)}
            >
              Mit KI entwerfen
            </button>
            <h3>
              {type === 'widget'
                ? widgetCatalog[kind as WidgetKind][0]
                : activityCatalog[kind as ActivityKind]}
            </h3>
            <label className="property-label">
              Titel
              <input
                aria-label="Titel des Lernwerkzeugs"
                maxLength={120}
                value={settings.title || ''}
                onChange={(e) => patch({ title: e.target.value })}
              />
            </label>
            {[
              'monster',
              'synthesis',
              'clapping',
              'alphabet',
              'syllables',
              'crossword',
              'wordsearch',
              'wordle',
              'reading',
            ].includes(kind) && (
              <label className="property-label">
                Wörter, je eines pro Zeile; Silben mit Bindestrich trennen
                <textarea
                  aria-label="Wörter der Übung"
                  value={(settings.words || []).join('\n')}
                  onChange={(e) =>
                    patch({ words: e.target.value.split('\n').slice(0, 40) })
                  }
                />
              </label>
            )}
            {[
              'cloze',
              'typing',
              'reading',
              'karaoke',
              'pitch',
              'calculator',
            ].includes(kind) && (
              <label className="property-label">
                {kind === 'cloze'
                  ? 'Text; Lösungen in [eckige Klammern] setzen'
                  : kind === 'calculator'
                    ? 'Kassenzettel, z. B. Brot: 2,40'
                    : 'Text'}
                <textarea
                  aria-label="Text der Übung"
                  maxLength={10000}
                  value={settings.text || ''}
                  onChange={(e) => patch({ text: e.target.value })}
                />
              </label>
            )}
            {kind === 'quiz' && (
              <div>
                <p>Fragen und Antworten</p>
                {(settings.questions || []).map((question, i) => (
                  <fieldset key={i}>
                    <legend>Frage {i + 1}</legend>
                    <input
                      aria-label={`Frage ${i + 1}`}
                      value={question.text}
                      onChange={(e) =>
                        patch({
                          questions: settings.questions!.map((q, n) =>
                            n === i ? { ...q, text: e.target.value } : q,
                          ),
                        })
                      }
                    />
                    {question.answers.map((answer, j) => (
                      <label className="quiz-answer-editor" key={j}>
                        <input
                          type="radio"
                          name={`correct-${i}`}
                          checked={question.correct === j}
                          onChange={() =>
                            patch({
                              questions: settings.questions!.map((q, n) =>
                                n === i ? { ...q, correct: j } : q,
                              ),
                            })
                          }
                        />
                        <input
                          aria-label={`Frage ${i + 1}, Antwort ${j + 1}`}
                          value={answer}
                          onChange={(e) =>
                            patch({
                              questions: settings.questions!.map((q, n) =>
                                n === i
                                  ? {
                                      ...q,
                                      answers: q.answers.map((a, k) =>
                                        k === j ? e.target.value : a,
                                      ),
                                    }
                                  : q,
                              ),
                            })
                          }
                        />
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          questions: settings.questions!.map((q, n) =>
                            n === i
                              ? {
                                  ...q,
                                  answers: [...q.answers, 'Neue Antwort'],
                                }
                              : q,
                          ),
                        })
                      }
                    >
                      ＋ Antwort
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          questions: settings.questions!.filter(
                            (_, n) => n !== i,
                          ),
                        })
                      }
                    >
                      Frage entfernen
                    </button>
                  </fieldset>
                ))}
                <button
                  type="button"
                  className="knopf"
                  onClick={() =>
                    patch({
                      questions: [
                        ...(settings.questions || []),
                        {
                          text: 'Neue Frage',
                          answers: ['Antwort 1', 'Antwort 2'],
                          correct: 0,
                        },
                      ],
                    })
                  }
                >
                  ＋ Frage
                </button>
              </div>
            )}
            {['matching', 'memory', 'crossword'].includes(kind) && (
              <label className="property-label">
                Paare, je eine Zeile: Begriff = Zuordnung
                <textarea
                  aria-label="Paare der Übung"
                  value={(settings.pairs || [])
                    .map((p) => `${p.left} = ${p.right}`)
                    .join('\n')}
                  onChange={(e) =>
                    patch({
                      pairs: e.target.value
                        .split('\n')
                        .slice(0, 20)
                        .map((line) => {
                          const at = line.indexOf('=');
                          return {
                            left: at < 0 ? line : line.slice(0, at).trim(),
                            right: at < 0 ? '' : line.slice(at + 1).trim(),
                          };
                        }),
                    })
                  }
                />
              </label>
            )}
            <div className="property-row">
              {[
                'timer',
                'multitimer',
                'pitch',
                'karaoke',
                'animation',
                'reading',
              ].includes(kind) &&
                numeric(
                  'seconds',
                  kind === 'reading' ? 'Sekunden je Wort' : 'Dauer (Sekunden)',
                  1,
                  3600,
                )}
              {[
                'piano',
                'drums',
                'sequencer',
                'metronome',
                'echo',
                'falling',
                'battleship',
              ].includes(kind) && numeric('bpm', 'Tempo (BPM)', 30, 240)}
              {['mathboard', 'shop', 'calculator', 'map'].includes(kind) &&
                numeric(
                  'maximum',
                  kind === 'map' ? 'Meter pro Einheit' : 'Zahlenraum',
                  10,
                  1000,
                )}
              {[
                'wordsearch',
                'maze',
                'communication',
                'timetable',
                'memory',
              ].includes(kind) &&
                numeric('columns', 'Spalten / Rastergröße', 2, 15)}
            </div>
            {['piano', 'echo', 'notequiz', 'falling'].includes(kind) && (
              <label className="property-label">
                Instrument
                <select
                  value={settings.instrument || 'piano'}
                  onChange={(e) => patch({ instrument: e.target.value })}
                >
                  {[
                    'piano',
                    'xylophone',
                    'marimba',
                    'glockenspiel',
                    'musicbox',
                    'organ',
                    'synth',
                    'flute',
                    'tube',
                  ].map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>
            )}
            {[
              'piano',
              'drums',
              'sequencer',
              'metronome',
              'echo',
              'notequiz',
              'falling',
            ].includes(kind) && (
              <label className="property-label">
                Lautstärke
                <input
                  type="range"
                  min="0"
                  max="1"
                  step=".05"
                  value={settings.volume ?? 0.35}
                  onChange={(e) => patch({ volume: Number(e.target.value) })}
                />
              </label>
            )}
            {kind === 'metronome' && (
              <>
                {numeric('rows', 'Schläge je Takt', 1, 12)}
                <label className="property-label">
                  Klang
                  <select
                    value={settings.mode || 'beep'}
                    onChange={(e) => patch({ mode: e.target.value })}
                  >
                    {[
                      ['click', 'Klick'],
                      ['wood', 'Holz'],
                      ['bell', 'Glocke'],
                      ['beep', 'Piep'],
                      ['cowbell', 'Kuhglocke'],
                    ].map(([id, label]) => (
                      <option value={id} key={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
            {kind === 'tuner' && (
              <label className="property-label">
                Instrument
                <select
                  value={settings.mode || 'chromatic'}
                  onChange={(e) => patch({ mode: e.target.value })}
                >
                  {[
                    ['chromatic', 'Chromatisch'],
                    ['guitar', 'Gitarre'],
                    ['ukulele', 'Ukulele'],
                    ['bass', 'Bass'],
                    ['violin', 'Violine'],
                    ['cello', 'Cello'],
                  ].map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {kind === 'slideshow' && (
              <>
                <label className="property-label">
                  Textposition
                  <select
                    value={settings.mode || 'center'}
                    onChange={(e) => patch({ mode: e.target.value })}
                  >
                    {[
                      ['bottom', 'Unterschrift'],
                      ['top', 'Überschrift'],
                      ['lower', 'Bauchbinde'],
                      ['side', 'Seitlich'],
                      ['center', 'Mitte'],
                      ['none', 'Kein Text'],
                    ].map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="property-label">
                  Hintergrundfarbe
                  <input
                    type="color"
                    value={
                      settings.background?.startsWith('#')
                        ? settings.background
                        : '#f4f5eb'
                    }
                    onChange={(e) => patch({ background: e.target.value })}
                  />
                </label>
              </>
            )}
            {kind === 'piano' && (
              <>
                <label className="property-label">
                  Tonleiter
                  <select
                    value={settings.mode || 'major'}
                    onChange={(e) => patch({ mode: e.target.value })}
                  >
                    {[
                      ['all', 'Alle Töne'],
                      ['major', 'Dur'],
                      ['minor', 'Moll'],
                      ['penta', 'Pentatonik'],
                      ['pentaMinor', 'Moll-Pentatonik'],
                      ['blues', 'Blues'],
                    ].map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                {numeric('octaves', 'Oktaven', 1, 2)}
              </>
            )}
            {['drums', 'sequencer'].includes(kind) && (
              <label className="property-label">
                Instrumentengruppe
                <select
                  value={settings.mode || 'drumset'}
                  onChange={(e) => patch({ mode: e.target.value })}
                >
                  {[
                    ['drumset', 'Schlagzeug'],
                    ['cajon', 'Cajón'],
                    ['hand', 'Bongos & Congas'],
                    ['orff', 'Orff-Instrumente'],
                    ['pads', 'Klang-Pads'],
                  ].map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {kind === 'soundstudio' && (
              <fieldset>
                <legend>Geräusche für das Hörspiel</legend>
                <select
                  aria-label="Geräusch"
                  value={effect}
                  onChange={(e) =>
                    setEffect(e.target.value as keyof typeof soundEffects)
                  }
                >
                  {Object.entries(soundEffects).map(([id, label]) => (
                    <option value={id} key={id}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      const blob = await effectWav(effect);
                      await media(
                        new File([blob], effect + '.wav', {
                          type: 'audio/wav',
                        }),
                        (src) =>
                          patch({
                            tracks: [
                              ...(settings.tracks || []),
                              {
                                title: soundEffects[effect],
                                src,
                                offset: 0,
                                volume: 0.6,
                              },
                            ],
                          }),
                      );
                    } catch (e) {
                      setError((e as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Geräusch als Spur hinzufügen
                </button>
              </fieldset>
            )}
            {kind === 'mathboard' && (
              <label className="property-label">
                Rechenmaterial
                <select
                  value={settings.mode || 'beads'}
                  onChange={(e) => patch({ mode: e.target.value })}
                >
                  <option value="beads">
                    Rechenrahmen / Zwanziger- und Hunderterfeld
                  </option>
                  <option value="place">Stellenwerttafel</option>
                  <option value="numberline">Zahlenstrahl</option>
                </select>
              </label>
            )}
            {['communication', 'timetable', 'shop'].includes(kind) && (
              <div>
                <label className="property-label">
                  Felder; je eine Zeile
                  {kind === 'shop' ? ' · Ware = Preis in Cent' : ''}
                  <textarea
                    aria-label="Felder des Lernwerkzeugs"
                    value={(settings.cells || [])
                      .map((cell) =>
                        kind === 'shop'
                          ? `${cell.label} = ${cell.speak || 100}`
                          : cell.label,
                      )
                      .join('\n')}
                    onChange={(e) =>
                      patch({
                        cells: e.target.value
                          .split('\n')
                          .slice(0, 100)
                          .map((line, i) => {
                            const split = line.split('=');
                            return {
                              ...settings.cells?.[i],
                              label: split[0].trim(),
                              ...(kind === 'shop'
                                ? { speak: split[1]?.trim() || '100' }
                                : {}),
                            };
                          }),
                      })
                    }
                  />
                </label>
                <div className="cell-image-editors">
                  {(settings.cells || []).map((cell, i) => (
                    <div key={i}>
                      <span>{cell.label}</span>
                      {upload('image/*', (src) =>
                        patch({
                          cells: settings.cells!.map((cell, n) =>
                            n === i ? { ...cell, image: src } : cell,
                          ),
                        }),
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {['slideshow', 'multitimer'].includes(kind) && (
              <div>
                {(
                  settings.slides || [
                    { title: 'Erster Abschnitt', text: '', seconds: 60 },
                  ]
                ).map((slide, i) => (
                  <fieldset key={i}>
                    <legend>
                      {kind === 'multitimer' ? 'Timer' : 'Folie'} {i + 1}
                    </legend>
                    <input
                      aria-label={`Titel ${i + 1}`}
                      value={slide.title}
                      onChange={(e) =>
                        patch({
                          slides: (settings.slides || []).map((s, n) =>
                            n === i ? { ...s, title: e.target.value } : s,
                          ),
                        })
                      }
                    />
                    <textarea
                      aria-label={`Text ${i + 1}`}
                      value={slide.text}
                      onChange={(e) =>
                        patch({
                          slides: settings.slides!.map((s, n) =>
                            n === i ? { ...s, text: e.target.value } : s,
                          ),
                        })
                      }
                    />
                    <label>
                      Sekunden{' '}
                      <input
                        type="number"
                        min="1"
                        max="3600"
                        value={slide.seconds || 5}
                        onChange={(e) =>
                          patch({
                            slides: settings.slides!.map((s, n) =>
                              n === i
                                ? { ...s, seconds: Number(e.target.value) }
                                : s,
                            ),
                          })
                        }
                      />
                    </label>
                    {kind === 'slideshow' && (
                      <>
                        {upload('image/*', (src) =>
                          patch({
                            slides: settings.slides!.map((s, n) =>
                              n === i ? { ...s, image: src } : s,
                            ),
                          }),
                        )}
                        {upload('audio/*', (src) =>
                          patch({
                            slides: settings.slides!.map((s, n) =>
                              n === i ? { ...s, audio: src } : s,
                            ),
                          }),
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          slides: settings.slides!.filter((_, n) => n !== i),
                        })
                      }
                    >
                      Entfernen
                    </button>
                  </fieldset>
                ))}
                <button
                  type="button"
                  className="knopf"
                  onClick={() =>
                    patch({
                      slides: [
                        ...(settings.slides || []),
                        { title: 'Neuer Abschnitt', text: '', seconds: 5 },
                      ],
                    })
                  }
                >
                  ＋ Hinzufügen
                </button>
                {kind === 'slideshow' && (
                  <label className="property-label">
                    Übergang
                    <select
                      value={settings.transition || 'fade'}
                      onChange={(e) => patch({ transition: e.target.value })}
                    >
                      {['fade', 'slide', 'zoom', 'kenburns', 'none'].map(
                        (t) => (
                          <option key={t}>{t}</option>
                        ),
                      )}
                    </select>
                  </label>
                )}
              </div>
            )}
            {kind === 'animation' && (
              <>
                <label className="property-label">
                  Bewegung
                  <select
                    value={settings.mode || 'linear'}
                    onChange={(e) => patch({ mode: e.target.value })}
                  >
                    <option value="linear">Gleichmäßig</option>
                    <option value="in">Schneller werden</option>
                    <option value="out">Langsamer werden</option>
                    <option value="inout">Sanft an und aus</option>
                  </select>
                </label>
                {(settings.frames || []).map((frame, i) => (
                  <fieldset key={i}>
                    <legend>Schlüsselbild {i + 1}</legend>
                    <input
                      aria-label={`Text im Schlüsselbild ${i + 1}`}
                      value={frame.text}
                      onChange={(e) =>
                        patch({
                          frames: settings.frames!.map((f, n) =>
                            n === i ? { ...f, text: e.target.value } : f,
                          ),
                        })
                      }
                    />
                    <input
                      aria-label={`Symbol im Schlüsselbild ${i + 1}`}
                      maxLength={12}
                      value={frame.symbol || '●'}
                      onChange={(e) =>
                        patch({
                          frames: settings.frames!.map((f, n) =>
                            n === i ? { ...f, symbol: e.target.value } : f,
                          ),
                        })
                      }
                    />
                    {(['x', 'y'] as const).map((axis) => (
                      <label key={axis}>
                        {axis.toUpperCase()} (%)
                        <input
                          type="range"
                          min="5"
                          max="95"
                          value={frame[axis]}
                          onChange={(e) =>
                            patch({
                              frames: settings.frames!.map((f, n) =>
                                n === i
                                  ? { ...f, [axis]: Number(e.target.value) }
                                  : f,
                              ),
                            })
                          }
                        />
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          frames: settings.frames!.filter((_, n) => n !== i),
                        })
                      }
                      disabled={(settings.frames?.length || 0) < 3}
                    >
                      Entfernen
                    </button>
                  </fieldset>
                ))}
                <button
                  type="button"
                  className="knopf"
                  onClick={() =>
                    patch({
                      frames: [
                        ...(settings.frames || []),
                        { text: 'Neues Bild', symbol: '●', x: 50, y: 50 },
                      ],
                    })
                  }
                >
                  ＋ Schlüsselbild
                </button>
              </>
            )}
            {kind === 'animation' && (
              <>
                <h4>Weitere Objekte</h4>
                {(settings.actors || []).map((actor, i) => (
                  <fieldset key={i}>
                    <legend>Objekt {i + 2}</legend>
                    <label>
                      Symbol{' '}
                      <input
                        maxLength={12}
                        value={actor.symbol}
                        onChange={(e) =>
                          patch({
                            actors: settings.actors!.map((a, n) =>
                              n === i ? { ...a, symbol: e.target.value } : a,
                            ),
                          })
                        }
                      />
                    </label>
                    <label>
                      Farbe{' '}
                      <input
                        type="color"
                        value={actor.color}
                        onChange={(e) =>
                          patch({
                            actors: settings.actors!.map((a, n) =>
                              n === i ? { ...a, color: e.target.value } : a,
                            ),
                          })
                        }
                      />
                    </label>
                    {upload('image/*', (src) =>
                      patch({
                        actors: settings.actors!.map((a, n) =>
                          n === i ? { ...a, image: src } : a,
                        ),
                      }),
                    )}
                    <label className="property-label">
                      Wegpunkte (X,Y in Prozent; je eine Zeile)
                      <textarea
                        value={actor.frames
                          .map((f) => `${f.x},${f.y}`)
                          .join('\n')}
                        onChange={(e) =>
                          patch({
                            actors: settings.actors!.map((a, n) =>
                              n === i
                                ? {
                                    ...a,
                                    frames: e.target.value
                                      .split('\n')
                                      .slice(0, 20)
                                      .map((line) => {
                                        const [x, y] = line
                                          .split(',')
                                          .map(Number);
                                        return {
                                          text: '',
                                          x: Math.max(0, Math.min(100, x || 0)),
                                          y: Math.max(0, Math.min(100, y || 0)),
                                        };
                                      }),
                                  }
                                : a,
                            ),
                          })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          actors: settings.actors!.filter((_, n) => n !== i),
                        })
                      }
                    >
                      Objekt entfernen
                    </button>
                  </fieldset>
                ))}
                <button
                  className="knopf"
                  type="button"
                  disabled={(settings.actors?.length || 0) >= 9}
                  onClick={() =>
                    patch({
                      actors: [
                        ...(settings.actors || []),
                        {
                          symbol: '★',
                          color: '#c49b42',
                          frames: [
                            { text: '', x: 85, y: 25 },
                            { text: '', x: 15, y: 70 },
                          ],
                        },
                      ],
                    })
                  }
                >
                  ＋ Weiteres Objekt
                </button>
              </>
            )}
            {['soundstudio', 'karaoke', 'playlist', 'animation'].includes(
              kind,
            ) && (
              <div>
                {(settings.tracks || []).map((track, i) => (
                  <fieldset key={i}>
                    <input
                      aria-label={`Spurname ${i + 1}`}
                      value={track.title}
                      onChange={(e) =>
                        patch({
                          tracks: settings.tracks!.map((t, n) =>
                            n === i ? { ...t, title: e.target.value } : t,
                          ),
                        })
                      }
                    />
                    {kind === 'animation' && (
                      <>
                        <label>
                          Start in Sekunden
                          <input
                            type="number"
                            min="0"
                            max="180"
                            value={track.offset || 0}
                            onChange={(e) =>
                              patch({
                                tracks: settings.tracks!.map((t, n) =>
                                  n === i
                                    ? {
                                        ...t,
                                        offset: Math.max(
                                          0,
                                          Math.min(180, Number(e.target.value)),
                                        ),
                                      }
                                    : t,
                                ),
                              })
                            }
                          />
                        </label>
                        <label>
                          Lautstärke
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step=".05"
                            value={track.volume ?? 1}
                            onChange={(e) =>
                              patch({
                                tracks: settings.tracks!.map((t, n) =>
                                  n === i
                                    ? { ...t, volume: Number(e.target.value) }
                                    : t,
                                ),
                              })
                            }
                          />
                        </label>
                      </>
                    )}
                    {upload('audio/*', (src) =>
                      patch({
                        tracks: settings.tracks!.map((t, n) =>
                          n === i ? { ...t, src } : t,
                        ),
                      }),
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          tracks: settings.tracks!.filter((_, n) => n !== i),
                        })
                      }
                    >
                      Entfernen
                    </button>
                  </fieldset>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    patch({
                      tracks: [
                        ...(settings.tracks || []),
                        { title: 'Neue Spur', offset: 0, volume: 1 },
                      ],
                    })
                  }
                >
                  ＋ Tonspur
                </button>
              </div>
            )}
            {kind === 'map' && (
              <>
                <label className="property-label">
                  Orte: Name = X,Y (in Prozent)
                  <textarea
                    value={(settings.points || [])
                      .map((p) => `${p.label} = ${p.x},${p.y}`)
                      .join('\n')}
                    onChange={(e) =>
                      patch({
                        points: e.target.value
                          .split('\n')
                          .slice(0, 30)
                          .map((line) => {
                            const [label, coords] = line.split('=');
                            const [x, y] = (coords || '50,50')
                              .split(',')
                              .map(Number);
                            return {
                              label: label.trim(),
                              x: Math.max(0, Math.min(100, x || 0)),
                              y: Math.max(0, Math.min(100, y || 0)),
                            };
                          }),
                      })
                    }
                  />
                </label>
                {upload('image/*', (src) => patch({ background: src }))}
              </>
            )}
            {kind === 'geometry' && (
              <label className="property-label">
                Eckpunkte des Linienzuges: X,Y je Zeile (0–100)
                <textarea
                  value={(
                    settings.path || [
                      { x: 20, y: 20 },
                      { x: 80, y: 20 },
                      { x: 80, y: 70 },
                      { x: 20, y: 70 },
                      { x: 20, y: 20 },
                    ]
                  )
                    .map((p) => `${p.x},${p.y}`)
                    .join('\n')}
                  onChange={(e) =>
                    patch({
                      path: e.target.value
                        .split('\n')
                        .slice(0, 30)
                        .map((line) => {
                          const [x, y] = line.split(',').map(Number);
                          return {
                            x: Math.max(0, Math.min(100, x || 0)),
                            y: Math.max(0, Math.min(100, y || 0)),
                          };
                        }),
                    })
                  }
                />
              </label>
            )}
            {[
              'monster',
              'synthesis',
              'clapping',
              'alphabet',
              'communication',
              'clock',
              'calendar',
              'timetable',
              'reading',
              'syllables',
            ].includes(kind) && (
              <VoiceOptions settings={settings} onChange={patch} />
            )}
            {['slideshow', 'animation', 'playlist'].includes(kind) && (
              <label>
                <input
                  type="checkbox"
                  checked={!!settings.repeat}
                  onChange={(e) => patch({ repeat: e.target.checked })}
                />{' '}
                In Schleife abspielen
              </label>
            )}
            {[
              'wordsearch',
              'memory',
              'maze',
              'quiz',
              'shop',
              'echo',
              'notequiz',
              'falling',
            ].includes(kind) && numeric('seed', 'Aufgabenvariante', 1, 999999)}
            {[
              'monster',
              'synthesis',
              'clapping',
              'alphabet',
              'syllables',
              'crossword',
              'wordsearch',
              'wordle',
              'reading',
            ].includes(kind) && (
              <WordBank onSelect={(words) => patch({ words })} />
            )}
            {error && (
              <p className="fehler" role="alert">
                {error}
              </p>
            )}
            <div className="dialog-actions">
              <button type="button" className="knopf" onClick={onClose}>
                Abbrechen
              </button>
              <button className="knopf knopf-haupt" disabled={busy}>
                Auf die Seite übernehmen
              </button>
            </div>
          </form>
        </div>
        {showAI && (
          <AiDialog
            format={
              kind === 'quiz'
                ? 'quiz'
                : kind === 'slideshow'
                  ? 'slides'
                  : ['typing', 'reading', 'cloze', 'karaoke'].includes(kind)
                    ? 'text'
                    : 'words'
            }
            onClose={() => setShowAI(false)}
            onAccept={(values) => patch(values)}
          />
        )}
      </section>
    </div>
  );
}
