'use client';
import { useEffect, useState } from 'react';
import type { LearningSettings } from '@/lib/learning/catalog';
export default function AiDialog({
  format = 'words',
  onAccept,
  onClose,
}: {
  format?: 'words' | 'quiz' | 'text' | 'slides';
  onAccept: (settings: LearningSettings) => void;
  onClose: () => void;
}) {
  const [topic, setTopic] = useState(''),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState<{
      configured: boolean;
      provider: string;
      model: string;
    } | null>(null),
    [result, setResult] = useState<LearningSettings | null>(null),
    [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/ki')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStatus(data);
      })
      .catch(() => setError('Der Dienst ist nicht erreichbar.'));
  }, []);
  return (
    <div className="modal-backdrop ai-backdrop">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-title"
      >
        <h2 id="ai-title">Mit KI entwerfen</h2>
        <p>
          {status?.configured
            ? `Freigegebener Dienst: ${status.provider} · ${status.model}`
            : 'Die Schulverwaltung muss einen KI-Dienst freigeben.'}
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError('');
            try {
              const response = await fetch('/api/ki', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, format }),
              });
              const data = await response.json();
              if (!response.ok) throw new Error(data.error);
              setResult(data);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="property-label">
            Thema und gewünschte Schwierigkeit
            <textarea
              aria-label="Thema für den KI-Entwurf"
              maxLength={2000}
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Zum Beispiel: zehn zweisilbige Wörter zum Herbst, Klasse 1"
            />
          </label>
          <p className="hinweis">
            Nur dieses Themenfeld wird an den freigegebenen Dienst gesendet.
            Keine Namen oder Arbeiten der Kinder eintragen. Prüfe den Entwurf
            vor dem Übernehmen.
          </p>
          <button className="knopf" disabled={busy || !status?.configured}>
            {busy ? 'Entwurf wird erstellt …' : 'Entwurf erstellen'}
          </button>
        </form>
        {result && (
          <div className="ai-result">
            <h3>Entwurf prüfen</h3>
            {result.words && <p>{result.words.join(', ')}</p>}
            {result.text && <p>{result.text}</p>}
            {result.questions?.map((q, i) => (
              <div key={i}>
                <strong>{q.text}</strong>
                <ul>
                  {q.answers.map((a, n) => (
                    <li key={n}>
                      {n === q.correct ? '✓ ' : ''}
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {result.slides?.map((s, i) => (
              <div key={i}>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        )}
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button className="knopf" disabled={busy} onClick={onClose}>
            Schließen
          </button>
          {result && (
            <button
              className="knopf knopf-haupt"
              onClick={() => {
                onAccept(result);
                onClose();
              }}
            >
              Entwurf übernehmen
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
