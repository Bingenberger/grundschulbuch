import { useEffect, useRef, useState } from 'react';

export default function PortableRecorder({
  onSave,
  onClose,
}: {
  onSave: (src: string) => void;
  onClose: () => void;
}) {
  const recorder = useRef<MediaRecorder | null>(null),
    stream = useRef<MediaStream | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(false),
    [error, setError] = useState('');
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (recorder.current) {
        recorder.current.onstop = null;
        if (recorder.current.state === 'recording') recorder.current.stop();
      }
      stream.current?.getTracks().forEach((t) => t.stop());
    },
    [],
  );
  async function save(blob: Blob) {
    if (blob.size > 20 * 1024 * 1024) {
      setError('Die Tondatei darf höchstens 20 MB groß sein.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onSave(String(reader.result));
    reader.readAsDataURL(blob);
  }
  async function record() {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const rec = new MediaRecorder(stream.current),
        chunks: Blob[] = [];
      recorder.current = rec;
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      rec.onstop = () => {
        if (timer.current) clearTimeout(timer.current);
        stream.current?.getTracks().forEach((t) => t.stop());
        setActive(false);
        void save(new Blob(chunks, { type: rec.mimeType }));
      };
      rec.start();
      setActive(true);
      timer.current = setTimeout(() => rec.stop(), 60000);
    } catch {
      stream.current?.getTracks().forEach((t) => t.stop());
      setError(
        'Das Mikrofon ist nicht verfügbar. Du kannst eine Tondatei auswählen.',
      );
    }
  }
  return (
    <div className="modal-backdrop">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portable-record-title"
      >
        <h2 id="portable-record-title">Ton aufnehmen</h2>
        <p>
          Die Aufnahme bleibt in dieser Heftkopie. Speichere die Kopie
          anschließend, um sie aufzubewahren.
        </p>
        <button
          onClick={() => (active ? recorder.current?.stop() : void record())}
        >
          {active ? '■ Aufnahme beenden' : '● Aufnahme starten'}
        </button>
        <label className="knopf">
          Tondatei auswählen
          <input
            type="file"
            accept="audio/*"
            disabled={active}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void save(file);
            }}
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button onClick={onClose}>Schließen</button>
      </section>
    </div>
  );
}
