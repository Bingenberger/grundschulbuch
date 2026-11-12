// Recordings of sounds and syllables shipped with the reference (public/laute).
import index from './recordings.json';

const sounds = index.sounds as Record<string, string>;
const syllables = index.syllables as Record<string, string>;
const SOUND_ALIAS: Record<string, string> = { c: 'k', ck: 'k', ß: 's', tz: 'z', ai: 'ei', äu: 'eu', ie: 'i', v: 'f', v2: 'w', ä2: 'e2' };

/** The recorded sound of a letter (“mmm”), if there is one. */
export function shippedSound(letter: string): string | undefined {
  return sounds[letter] ?? sounds[SOUND_ALIAS[letter]];
}
/** The recorded syllable (“ma”), if there is one. */
export function shippedSyllable(a: string, b: string): string | undefined {
  return syllables[(a === 'v' ? 'f' : a) + (b === 'äu' ? 'eu' : b === 'ie' ? 'i' : b)];
}
/** Paths of recordings that may be played (also when the book is exported). */
export const safeRecording = (v: unknown): v is string =>
  typeof v === 'string' && (/^\/laute\/[a-z0-9-]+\.m4a$/.test(v) || /^media\/[\w.-]+$/.test(v) || /^data:audio\/mp4;base64,/.test(v));

/** Adds the shipped recordings a “Silben verbinden” page needs. */
export function withRecordings<T extends { syls: [string, string][]; sound?: boolean; read?: boolean; tts?: boolean }>(synth: T): T & { sounds?: Record<string, string>; voice?: Record<string, string> } {
  const sounds: Record<string, string> = {}, voice: Record<string, string> = {};
  for (const [a, b] of synth.syls) {
    const s = synth.sound && !sounds[a] ? shippedSound(a) : undefined;
    if (s) sounds[a] = s;
    const v = synth.read && !synth.tts ? shippedSyllable(a, b) : undefined;
    if (v) voice[a + b] = v;
  }
  const out: T & { sounds?: Record<string, string>; voice?: Record<string, string> } = { ...synth };
  delete out.sounds;
  delete out.voice;
  if (Object.keys(sounds).length) out.sounds = sounds;
  if (Object.keys(voice).length) out.voice = voice;
  return out;
}
