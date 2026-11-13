import presets from './music-presets.json' with { type: 'json' };
export const findMusicPreset = id => presets.find(p => p.id === id);
/** A recording is invited only where the teacher inserted an audio tool. */
export function musicInvitesAudio(settings) {
  return !!findMusicPreset(settings?.musicTemplate)?.items.some(item => ['recorder', 'sequencer', 'hoerspiel', 'karaoke'].includes(item.kind));
}
export function validateMusicConfig(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw Error('Ungültige Musikeinstellungen.');
  const visit = value => {
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) {
      if (['sound', 'image', 'img'].includes(key) && item && (typeof item !== 'string' || !/^\/api\/medien\/[a-f0-9]{64}\.[a-z0-9]+$/.test(item))) throw Error('Musik und Bilder müssen auf dem Schulserver liegen.');
      visit(item);
    }
  };
  visit(config);
  return config;
}
