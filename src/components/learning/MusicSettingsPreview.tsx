'use client';
import { useId } from 'react';
import type { LearningSettings } from '@/lib/learning/catalog';
import { musicPreset, musicKind } from '@/lib/learning/music';
import { LearningRuntime } from './Runtime';
import MusicTemplate from './MusicTemplate';
export default function MusicSettingsPreview({ settings, live = true }: { settings: LearningSettings; live?: boolean }) {
  const id = useId(), preset = musicPreset(settings.musicTemplate);
  if (!preset) return null;
  return <div className="music-settings-preview" aria-label={live ? 'Spielbare Vorschau' : 'Liedblatt-Vorschau'}>
    <LearningRuntime interactive={live}>
      <MusicTemplate element={{ id: `music-preview-${id}`, type: 'widget', widgetKind: musicKind(preset), settings, x: 0, y: 0, width: 297, height: 210, rotation: 0, locked: true, color: '#253c42' }} />
    </LearningRuntime>
  </div>;
}
