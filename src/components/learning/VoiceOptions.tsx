'use client';
import { useEffect, useState } from 'react';
import type { LearningSettings } from '@/lib/learning/catalog';
import { speakGerman } from '@/lib/speech';
export default function VoiceOptions({
  settings,
  onChange,
}: {
  settings: LearningSettings;
  onChange: (patch: Partial<LearningSettings>) => void;
}) {
  const [voices, setVoices] = useState<string[]>([]);
  useEffect(() => {
    if (!window.speechSynthesis) return;
    let active = true;
    const refresh = () => {
      if (active)
        setVoices(
          speechSynthesis
            .getVoices()
            .filter(
              (v) => v.localService && v.lang.toLowerCase().startsWith('de'),
            )
            .map((v) => v.name),
        );
    };
    queueMicrotask(refresh);
    speechSynthesis.addEventListener('voiceschanged', refresh);
    return () => {
      active = false;
      speechSynthesis.removeEventListener('voiceschanged', refresh);
    };
  }, []);
  return (
    <fieldset>
      <legend>Vorlesen</legend>
      <label className="property-label">
        Stimme auf diesem Gerät
        <select
          value={settings.voice || ''}
          onChange={(e) => onChange({ voice: e.target.value })}
        >
          <option value="">Deutsche Standardstimme</option>
          {voices.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </label>
      <label className="property-label">
        Geschwindigkeit
        <input
          type="range"
          min=".3"
          max="2"
          step=".1"
          value={settings.speechRate ?? 1}
          onChange={(e) => onChange({ speechRate: Number(e.target.value) })}
        />
      </label>
      <label className="property-label">
        Tonhöhe
        <input
          type="range"
          min=".5"
          max="2"
          step=".1"
          value={settings.speechPitch ?? 1}
          onChange={(e) => onChange({ speechPitch: Number(e.target.value) })}
        />
      </label>
      <button
        type="button"
        onClick={() =>
          speakGerman('So klingt diese Stimme.', {
            voice: settings.voice,
            rate: settings.speechRate,
            pitch: settings.speechPitch,
          })
        }
      >
        Stimme ausprobieren
      </button>
      {!voices.length && (
        <small>
          Installiere auf dem Gerät eine deutsche Stimme, um das Vorlesen zu
          verwenden.
        </small>
      )}
    </fieldset>
  );
}
