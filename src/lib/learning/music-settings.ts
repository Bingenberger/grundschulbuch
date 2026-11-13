import data from './music-options-data.json';
import type { JsonValue, LearningSettings } from './catalog';
export type MusicValues = Record<string, unknown>;
export type Song = { id: string; title: string; credit: string; group: string; text: string; secs: number; repeat?: number; design?: string; pics?: string };
export const musicOptions = data;
export const karaokeSongs = data.songs as Song[];
/** Word keys may contain spaces or umlauts. Store pictures as a list, not JSON object keys. */
export function encodeMusicConfig(value: MusicValues): JsonValue {
  const config = { ...value }, karaoke = value.karaoke as MusicValues | undefined;
  if (karaoke?.pics && typeof karaoke.pics === 'object') {
    config.musicPictures = Object.entries(karaoke.pics).map(([word, picture]) => ({ word, ...(picture as MusicValues) }));
    config.karaoke = { ...karaoke, pics: {} };
  }
  return JSON.parse(JSON.stringify(config)) as JsonValue;
}
export function decodeMusicConfig(value: unknown): MusicValues {
  const config = value && typeof value === 'object' ? value as MusicValues : {};
  if (!Array.isArray(config.musicPictures) || !config.karaoke) return config;
  const pics = Object.fromEntries((config.musicPictures as MusicValues[]).filter(p => typeof p.word === 'string' && typeof p.img === 'string').map(({ word, ...picture }) => [String(word), picture]));
  return { ...config, karaoke: { ...(config.karaoke as MusicValues), pics } };
}
export function songSettings(song: Song, previous: MusicValues): MusicValues {
  const rest = { ...previous }; delete rest.audio; delete rest.timing; delete rest.skip;
  return { ...rest, song: song.id, title: song.title, credit: song.credit, text: song.text, secs: song.secs, repeat: song.repeat ?? 1, design: song.design && previous.design === 'stage' ? song.design : previous.design || 'stage', pics: {}, nopic: [] };
}
export function sequenceSteps(seq: MusicValues, steps: number): MusicValues {
  const before = Number(seq.steps) || 16;
  if (steps === before) return seq;
  return { ...seq, steps, tracks: ((seq.tracks || []) as MusicValues[]).map(track => ({ ...track, steps: Array.from({ length: steps }, (_, i) => {
    const old = (track.steps || []) as boolean[];
    return (steps === 8 ? old[i * 2] : i % 2 === 0 && old[i / 2]) || false;
  }) })) };
}
export function resizeStudio(hs: MusicValues, len: number): MusicValues {
  return { ...hs, len, clips: ((hs.clips || []) as MusicValues[]).map(clip => {
    const dur = Math.min(Number(clip.dur), len);
    return { ...clip, dur, start: Math.min(Number(clip.start), Math.max(0, len - dur)) };
  }) };
}
export function settingsWithMusic(settings: LearningSettings, config: MusicValues): LearningSettings {
  return { ...settings, musicConfig: encodeMusicConfig(config) };
}
