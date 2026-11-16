// Hör-Memory and Was hörst du? of Lernsachen-Heft 1.47.3: settings as the
// reference keeps them (mode, set, picks, own) and the media they use.
import { listenConfig, LISTEN_INSTRUMENTS, LISTEN_SOUNDS } from '../reference/tools-runtime';

export type ListenOwn = { label: string; sound: string; img?: string };
export type ListenSettings = { mode: 'memory' | 'quiz'; set: 'fx' | 'instruments' | 'own'; picks: string[]; own: ListenOwn[] };
type Choice = { id: string; label: string };

export const LISTEN_FX = LISTEN_SOUNDS as unknown as Choice[];
export const LISTEN_INSTRUMENT_CHOICES = LISTEN_INSTRUMENTS as unknown as Choice[];
/** At most this many sounds take part (as in the reference). */
export const LISTEN_MAX = 8;
/** First choices when the kind of sounds changes (as in the reference's dialog). */
export const LISTEN_START: Record<ListenSettings['set'], string[]> = {
  fx: ['rain', 'thunder', 'birds', 'knock', 'bell', 'clock'],
  instruments: ['piano', 'drum', 'triangle', 'flute'],
  own: [],
};

/** Own sounds and pictures are media addresses of the school server. */
const media = (v: unknown) => (typeof v === 'string' && /^\/api\/medien\/[\w./-]+$/.test(v) ? v : undefined);

/** Cleaned settings, with the reference's own rules (pg). */
export function listenSettings(raw: unknown): ListenSettings {
  return listenConfig(raw, media, media) as ListenSettings;
}

/** The reference looks up own media by key; ours are addresses already. */
export function listenAssets(c: ListenSettings) {
  const assets: Record<string, { dataUrl: string }> = {};
  for (const o of c.own) {
    assets[o.sound] = { dataUrl: o.sound };
    if (o.img) assets[o.img] = { dataUrl: o.img };
  }
  return assets;
}
