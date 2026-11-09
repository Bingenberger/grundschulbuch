'use client';
import { useEffect, useRef, useState } from 'react';
export default function AudioDialog({
  onClose,
  onAudio,
  bookId,
}: {
  onClose: () => void;
  onAudio: (src: string) => void;
  bookId: string;
}) {
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
      if (recorder.current) {
        recorder.current.onstop = null;
        if (recorder.current.state === 'recording') recorder.current.stop();
      }
      stream.current?.getTracks().forEach((t) => t.stop());
    },
    [],
  );
  async function upload(blob: Blob) {
    setBusy(true);
    try {
      const response = await fetch(`/api/ton?book=${bookId}`, {
        method: 'POST',
        headers: { 'Content-Type': blob.type || 'application/octet-stream' },
        body: blob,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      onAudio(result.src);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function start() {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const rec = new MediaRecorder(stream.current);
      recorder.current = rec;
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      rec.onstop = () => {
        stream.current?.getTracks().forEach((t) => t.stop());
        if (timeout.current) clearTimeout(timeout.current);
        setRecording(false);
        void upload(new Blob(chunks, { type: rec.mimeType }));
      };
      rec.start();
      setRecording(true);
      timeout.current = setTimeout(() => rec.stop(), 60000);
    } catch {
      stream.current?.getTracks().forEach((t) => t.stop());
      setError(
        'Das Mikrofon ist nicht verfügbar. Bitte den Mikrofonzugriff erlauben oder eine Tondatei auswählen.',
      );
    }
  }
  return (
    <div className="modal-backdrop">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audio-title"
      >
        <h2 id="audio-title">Ton hinzufügen</h2>
        <p>
          Sprich eine Aufgabe oder eine Antwort ein. Eine Aufnahme dauert
          höchstens eine Minute.
        </p>
        <button
          className="knopf knopf-haupt"
          disabled={busy}
          onClick={() => (recording ? recorder.current?.stop() : void start())}
        >
          {recording ? '■ Aufnahme beenden' : '● Aufnahme starten'}
        </button>
        <p>
          <label className="knopf">
            Tondatei auswählen
            <input
              className="visually-hidden"
              disabled={busy || recording}
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 20 * 1024 * 1024)
                    setError('Die Datei darf höchstens 20 MB groß sein.');
                  else void upload(file);
                }
              }}
            />
          </label>
        </p>
        {busy && <p role="status">Ton wird gespeichert …</p>}
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
        <button
          className="knopf"
          disabled={recording || busy}
          onClick={onClose}
        >
          Schließen
        </button>
      </section>
    </div>
  );
}
