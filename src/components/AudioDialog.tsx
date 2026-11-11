'use client';
import { useEffect, useRef, useState } from 'react';
import Icon, { type IconName } from './Icon';
import { ChoiceButton } from './ui/Choice';
import { CassetteArt, MicGlyph } from './learning/Cassette';

export type AudioTab = 'record' | 'upload' | 'placeholder' | 'recorder';

const tabInfo: Record<AudioTab, [IconName, string]> = {
  record: ['voice_presentation', 'Aufnehmen'],
  upload: ['opened_folder', 'Hochladen'],
  placeholder: ['audio_file', 'Platzhalter'],
  recorder: ['kassette', 'Kassettenrekorder'],
};
const MAX_SECONDS = 300;
const MAX_BYTES = 20 * 1024 * 1024;

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/** Sound before it is saved: recorded or picked, can be listened to first. */
type Take = { blob: Blob; url: string; title: string };

function Preview({ take, busy, onTitle, onAgain, onSave, again }: {
  take: Take;
  busy: boolean;
  onTitle: (title: string) => void;
  onAgain: () => void;
  onSave: () => void;
  again: string;
}) {
  return (
    <div className="audio-take">
      <audio controls src={take.url} aria-label="Vorschau anhören" />
      <label className="property-label">
        Name
        <input className="option-input" value={take.title} maxLength={120} onChange={(e) => onTitle(e.target.value)} />
      </label>
      <div className="audio-actions">
        <ChoiceButton icon="undo" label={again} disabled={busy} onClick={onAgain} />
        <button type="button" className="knopf knopf-haupt" disabled={busy} onClick={onSave}>
          <Icon name="ok" size={20} /> {busy ? 'Wird gespeichert …' : 'Übernehmen'}
        </button>
      </div>
    </div>
  );
}

function RecordTab({ busy, onTake }: { busy: boolean; onTake: (take: Take) => void }) {
  const [state, setState] = useState<'idle' | 'starting' | 'recording'>('idle');
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const level = useRef<HTMLSpanElement>(null);
  const stop = useRef<() => void>(() => undefined);
  const cleanup = useRef<() => void>(() => undefined);
  useEffect(() => () => cleanup.current(), []);

  async function start() {
    setError('');
    setState('starting');
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      setState('idle');
      setError('Das Mikrofon ist nicht verfügbar. Bitte den Mikrofonzugriff erlauben oder eine Tondatei hochladen.');
      return;
    }
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    context.createMediaStreamSource(stream).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    const began = Date.now();
    let frame = 0;
    const tick = () => {
      analyser.getByteTimeDomainData(samples);
      let peak = 0;
      for (const v of samples) peak = Math.max(peak, Math.abs(v - 128));
      if (level.current) level.current.style.transform = `scaleX(${Math.min(1, peak / 90)})`;
      const elapsed = (Date.now() - began) / 1000;
      setSeconds(elapsed);
      if (elapsed >= MAX_SECONDS) recorder.stop();
      else frame = requestAnimationFrame(tick);
    };
    cleanup.current = () => {
      cancelAnimationFrame(frame);
      recorder.ondataavailable = null;
      recorder.onstop = null;
      if (recorder.state === 'recording') recorder.stop();
      stream?.getTracks().forEach((t) => t.stop());
      void context.close().catch(() => undefined);
    };
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
      cleanup.current();
      setState('idle');
      if (blob.size) onTake({ blob, url: URL.createObjectURL(blob), title: 'Meine Aufnahme' });
    };
    stop.current = () => recorder.state === 'recording' && recorder.stop();
    recorder.start(250);
    setSeconds(0);
    setState('recording');
    frame = requestAnimationFrame(tick);
  }

  const recording = state === 'recording';
  return (
    <div className="audio-record">
      <button
        type="button"
        className={`record-button ${recording ? 'recording' : ''}`}
        disabled={busy || state === 'starting'}
        aria-label={recording ? 'Aufnahme beenden' : 'Aufnahme starten'}
        onClick={() => (recording ? stop.current() : void start())}
      >
        <span className="record-symbol" aria-hidden="true" />
      </button>
      <strong>{recording ? 'Aufnahme läuft – tippe zum Beenden' : state === 'starting' ? 'Mikrofon wird gestartet …' : 'Tippe zum Aufnehmen'}</strong>
      <div className="record-meter" aria-hidden="true">
        <span ref={level} />
      </div>
      <span className="record-time" role="timer">
        {clock(seconds)} <small>/ höchstens {MAX_SECONDS / 60} Minuten</small>
      </span>
      {error && <p className="fehler" role="alert">{error}</p>}
    </div>
  );
}

function UploadTab({ busy, onTake }: { busy: boolean; onTake: (take: Take) => void }) {
  const [over, setOver] = useState(false);
  const [error, setError] = useState('');
  const pick = (file?: File) => {
    if (!file) return;
    if (file.size > MAX_BYTES) return setError('Die Datei darf höchstens 20 MB groß sein.');
    setError('');
    onTake({ blob: file, url: URL.createObjectURL(file), title: file.name.replace(/\.[a-z0-9]{2,5}$/i, '').slice(0, 120) || 'Ton' });
  };
  return (
    <>
      <label
        className={`upload-area ${over ? 'drag-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          pick(Array.from(e.dataTransfer.files).find((f) => f.type.startsWith('audio/')));
        }}
      >
        <Icon name="audio_file" size={40} />
        <strong>Tondatei auswählen</strong>
        <small>oder hierher ziehen · MP3, M4A, OGG, WAV oder WebM · bis 20 MB</small>
        <input
          type="file"
          accept="audio/*"
          aria-label="Tondatei auswählen"
          disabled={busy}
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </label>
      {error && <p className="fehler" role="alert">{error}</p>}
    </>
  );
}

/**
 * Adding sound: record (first), upload, an empty sound button for children to
 * fill, or a cassette recorder on the page. `only` limits the tabs.
 */
export default function AudioDialog({
  bookId,
  child = false,
  only,
  elementId,
  title = 'Ton hinzufügen',
  onAudio,
  onPlaceholder,
  onRecorder,
  onClose,
}: {
  bookId: string;
  child?: boolean;
  only?: AudioTab[];
  /** Sound button or recorder that gets the recording (lets children record there). */
  elementId?: string;
  title?: string;
  /** Saved sound and its name. */
  onAudio: (src: string, title: string) => void;
  onPlaceholder?: (label: string) => void;
  onRecorder?: () => void;
  onClose: () => void;
}) {
  const available = (
    [
      'record',
      'upload',
      !child && onPlaceholder && 'placeholder',
      !child && onRecorder && 'recorder',
    ] as (AudioTab | false | undefined)[]
  ).filter((t): t is AudioTab => !!t && (!only || only.includes(t)));
  const [tab, setTab] = useState<AudioTab>(available[0]);
  const [take, setTake] = useState<Take | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [label, setLabel] = useState('Tippe hier und sprich deine Antwort ein.');
  useEffect(() => () => {
    if (take) URL.revokeObjectURL(take.url);
  }, [take]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [onClose, busy]);

  async function save() {
    if (!take) return;
    setBusy(true);
    setError('');
    try {
      const query = new URLSearchParams({ book: bookId, ...(elementId ? { element: elementId } : {}) });
      const response = await fetch(`/api/ton?${query}`, {
        method: 'POST',
        headers: { 'Content-Type': take.blob.type || 'application/octet-stream' },
        body: take.blob,
      });
      const result = await response.json().catch(() => ({ error: 'Der Ton konnte nicht gespeichert werden.' }));
      if (!response.ok) throw new Error(result.error);
      onAudio(result.src, take.title.trim() || 'Ton');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <section className="modal image-dialog audio-dialog" role="dialog" aria-modal="true" aria-labelledby="audio-title">
        <div className="dialog-heading">
          <h2 id="audio-title">{title}</h2>
          <button type="button" className="knopf" disabled={busy} onClick={onClose}>
            Schließen
          </button>
        </div>
        <div className="image-dialog-layout">
          <nav className="image-tabs" aria-label="Art des Tons">
            {available.map((t) => (
              <ChoiceButton
                key={t}
                icon={tabInfo[t][0]}
                label={tabInfo[t][1]}
                pressed={tab === t}
                disabled={busy}
                onClick={() => {
                  setTab(t);
                  setTake(null);
                  setError('');
                }}
              />
            ))}
          </nav>
          <div className="image-tab-panel" role="region" aria-label={tabInfo[tab][1]}>
            <div className="image-tab-body">
              {(tab === 'record' || tab === 'upload') &&
                (take ? (
                  <Preview
                    take={take}
                    busy={busy}
                    again={tab === 'record' ? 'Neu aufnehmen' : 'Andere Datei'}
                    onTitle={(t) => setTake({ ...take, title: t })}
                    onAgain={() => setTake(null)}
                    onSave={() => void save()}
                  />
                ) : tab === 'record' ? (
                  <RecordTab busy={busy} onTake={setTake} />
                ) : (
                  <UploadTab busy={busy} onTake={setTake} />
                ))}
              {tab === 'placeholder' && onPlaceholder && (
                <>
                  <p className="image-tab-intro">
                    Ein leerer Ton-Knopf mit einer Aufgabe. Wer darauf tippt, nimmt sich auf – auch Kinder in einem
                    gesperrten Arbeitsblatt und ohne eigene Ton-Erlaubnis.
                  </p>
                  <label className="property-label">
                    Aufgabe auf dem Knopf
                    <input className="option-input" value={label} maxLength={200} onChange={(e) => setLabel(e.target.value)} />
                  </label>
                  <div className="audio-placeholder-preview" aria-hidden="true">
                    <span className="audio-placeholder">
                      <MicGlyph />
                      <span>{label || 'Tippe hier und nimm dich auf.'}</span>
                    </span>
                  </div>
                  <button type="button" className="knopf knopf-haupt" onClick={() => onPlaceholder(label)}>
                    <Icon name="audio_file" size={22} /> Platzhalter einfügen
                  </button>
                </>
              )}
              {tab === 'recorder' && onRecorder && (
                <>
                  <p className="image-tab-intro">
                    Ein Kassettenrekorder auf der Seite: aufnehmen, anhören, mit den Spulen vor- und zurückspulen,
                    eine Tondatei öffnen und die Aufnahme als Datei speichern. Die Aufnahme bleibt im Heft.
                  </p>
                  <div className="audio-recorder-preview" aria-hidden="true">
                    <CassetteArt title="Meine Aufnahme" spinning={false} />
                  </div>
                  <button type="button" className="knopf knopf-haupt" onClick={onRecorder}>
                    <Icon name="kassette" size={22} /> Kassettenrekorder einfügen
                  </button>
                </>
              )}
              {error && <p className="fehler" role="alert">{error}</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
