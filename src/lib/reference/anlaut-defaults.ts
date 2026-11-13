// Starting point of a new Anlaut-Tastatur: the pictures and words of the
// reference (ARASAAC, shipped in public/anlaut) and the shipped sounds.
import keys from './anlaut-keys.json';
import { newAnlaut } from './anlaut';
import { shippedSounds } from './recordings';

export function defaultAnlaut() {
  return { ...newAnlaut(), keys: JSON.parse(JSON.stringify(keys)), sounds: shippedSounds() };
}
/** Pictures and recordings that may be shown or played (also in exported books). */
export const safeAnlautAsset = (v: unknown) =>
  typeof v === 'string' && (/^\/(anlaut|laute)\/[a-z0-9-]+\.(webp|m4a)$/.test(v) || /^\/api\/medien\/[a-f0-9]{64}\.[a-z0-9]+$/.test(v) || /^media\/[\w.-]+$/.test(v) || /^data:(image|audio)\//.test(v))
    ? v
    : undefined;
