// Saved settings only allow plain keys (a–z, 0–9, - and _). Keys like „ä“,
// „ß“ or „mä“ are stored as „k-e4“, „k-df“, „k-6d-e4“ and read back here.
const PLAIN = /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/;
const CODED = /^k(-[0-9a-f]{1,4})+$/;

export const encodeKey = (key: string) => (PLAIN.test(key) && !CODED.test(key) ? key : 'k' + [...key].map((c) => '-' + c.charCodeAt(0).toString(16)).join(''));
export const decodeKey = (key: string) => (CODED.test(key) ? key.slice(2).split('-').map((h) => String.fromCharCode(parseInt(h, 16))).join('') : key);

type Map = Record<string, unknown>;
const recode = (value: unknown, code: (k: string) => string) =>
  value && typeof value === 'object' && !Array.isArray(value) ? Object.fromEntries(Object.entries(value as Map).map(([k, v]) => [code(k), v])) : value;

/** Encodes the keys of the named maps (e.g. keys, sounds, voice). */
export function encodeMaps<T>(settings: T, maps: string[]): T {
  if (!settings || typeof settings !== 'object') return settings;
  const out = { ...(settings as Map) };
  for (const m of maps) if (m in out) out[m] = recode(out[m], encodeKey);
  return out as T;
}
/** Reads the keys of the named maps back. */
export function decodeMaps<T>(settings: T, maps: string[]): T {
  if (!settings || typeof settings !== 'object') return settings;
  const out = { ...(settings as Map) };
  for (const m of maps) if (m in out) out[m] = recode(out[m], decodeKey);
  return out as T;
}
