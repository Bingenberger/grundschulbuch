import { pictureHints, pictureCandidates } from '../reference/karaoke-pictures.mjs';
import { karaokeSongs, type MusicValues } from './music-settings';
export type KaraokePicture = { img: string; instead?: boolean };
export type PictureCandidate = { word: string; key: string; term?: string };
export type PictureCache = Map<string, Promise<string | null>>;
export function karaokePictureList(karaoke: MusicValues): PictureCandidate[] {
  const song = karaokeSongs.find(song => song.id === karaoke.song && song.text === karaoke.text);
  return pictureCandidates(karaoke, song ? pictureHints({ ...song, pics: song.pics || '' }) : undefined) as PictureCandidate[];
}
/** Same three-worker, sixty-word flow as the reference, using the school's media store. */
export async function completeKaraokePictures(karaoke: MusicValues, options: {
  signal: AbortSignal;
  cache?: PictureCache;
  onProgress?: (done: number, total: number) => void;
  onPicture?: (candidate: PictureCandidate, picture: KaraokePicture) => void;
  fetch?: typeof fetch;
}) {
  const pics = Object.assign(Object.create(null), karaoke.pics || {}) as Record<string, KaraokePicture>;
  const candidates = karaoke.picsOn === false || !String(karaoke.text || '').trim() ? [] : karaokePictureList(karaoke);
  const cache = options.cache || new Map(), request = options.fetch || fetch;
  const queue = [...candidates]; let done = 0, added = 0, errors = 0;
  const check = () => { if (options.signal.aborted) throw new DOMException('Bildsuche abgebrochen.', 'AbortError'); };
  options.onProgress?.(0, candidates.length); check();
  async function lookup(candidate: PictureCandidate): Promise<string | null> {
    const params = new URLSearchParams({ quelle: 'arasaac', karaoke: '1', q: candidate.word });
    if (candidate.term) params.set('begriff', candidate.term);
    const response = await request(`/api/bilder?${params}`, { signal: options.signal });
    const result = await response.json(); if (!response.ok) throw Error(result.error || 'Die Bildsuche ist nicht erreichbar.');
    const first = result.items?.[0]; if (!first) return null;
    const saved = await request('/api/bilder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quelle: 'arasaac', bild: first.full }), signal: options.signal });
    const media = await saved.json(); if (!saved.ok) throw Error(media.error || 'Das Bild konnte nicht gespeichert werden.');
    return media.src;
  }
  async function worker() {
    for (let candidate = queue.shift(); candidate; candidate = queue.shift()) {
      check();
      try {
        const key = JSON.stringify([candidate.word.toLocaleLowerCase('de-DE'), candidate.term || '']);
        let pending = cache.get(key);
        if (!pending) { pending = lookup(candidate).catch(error => { cache.delete(key); throw error; }); cache.set(key, pending); }
        const src = await pending; check();
        if (src && !pics[candidate.key]) { const picture = { img: src }; pics[candidate.key] = picture; added++; options.onPicture?.(candidate, picture); }
      } catch (error) { check(); errors++; void error; }
      finally { options.onProgress?.(++done, candidates.length); }
    }
  }
  await Promise.all([worker(), worker(), worker()]); check();
  return { karaoke: { ...karaoke, pics }, added, errors };
}
