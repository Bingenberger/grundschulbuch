import presets from './music-presets.json';
import { karaokeSongs, decodeMusicConfig, encodeMusicConfig, songSettings } from './music-settings';
import { clone, newPage, uuid, type Page } from '../notebook-model';
import type { JsonValue, LearningSettings, WidgetKind } from './catalog';
export type MusicItem = { type: string; kind?: string; x: number; y: number; w: number; h: number; html?: string; placeholder?: string; color?: string; size?: number; bold?: boolean; font?: string; [key: string]: unknown };
export type MusicPreset = { id: string; title: string; hidden: boolean; generator?: string; paper: string; background: string; items: MusicItem[] };
export const musicPresets = presets as unknown as MusicPreset[];
export const musicPreset = (id?: string) => musicPresets.find(p => p.id === id);
export function musicKind(preset: MusicPreset): WidgetKind {
  const kind = preset.items.find(i => i.type === 'widget')?.kind;
  return ({ fall: 'falling', hoerspiel: 'soundstudio' }[kind || ''] || kind || 'playlist') as WidgetKind;
}
export function musicSettings(preset: MusicPreset): LearningSettings {
  const main = preset.items.find(i => i.type === 'widget');
  return { title: preset.title, musicTemplate: preset.id, musicConfig: main ? JSON.parse(JSON.stringify(main)) as JsonValue : {}, tracks: [], volume: 0.8 };
}
export function musicPage(settings: LearningSettings): Page[] {
  const preset = musicPreset(settings.musicTemplate);
  if (!preset) return [];
  if (preset.id === 'karaoke' && (settings.musicSongs?.length || 0) > 1) {
    const config = decodeMusicConfig(settings.musicConfig);
    const { musicSongs, ...singleSettings } = settings;
    return musicSongs!.flatMap(id => { const song = karaokeSongs.find(s => s.id === id);
      if (!song) return [];
      const current = config.karaoke as Record<string, unknown>, karaoke = songSettings(song, current);
      if (current.song === song.id) { karaoke.pics = current.pics; karaoke.nopic = current.nopic; }
      return musicPage({ ...singleSettings, title: song.title, musicConfig: encodeMusicConfig({ ...config, karaoke }) });
    });
  }
  const page = newPage('blanko', 'landscape');
  page.paperColor = preset.paper;
  page.elements.push({ id: uuid(), type: 'widget', widgetKind: musicKind(preset), settings: clone(settings), x: 0, y: 0, width: 297, height: 210, rotation: 0, locked: true, color: '#253c42' });
  return [page];
}
