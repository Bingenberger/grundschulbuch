// Pictures for words: ARASAAC pictograms through the school server (the same
// matcher as the karaoke sheet), saved into the school's media store.
export async function findPicture(word: string, signal: AbortSignal): Promise<string | null> {
  const found = await fetch(`/api/bilder?${new URLSearchParams({ quelle: 'arasaac', karaoke: '1', q: word })}`, { signal });
  const result = await found.json();
  if (!found.ok) throw Error(result.error || 'Die Bildsuche ist nicht erreichbar.');
  const first = result.items?.[0];
  if (!first) return null;
  const saved = await fetch('/api/bilder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quelle: 'arasaac', bild: first.full }), signal });
  const media = await saved.json();
  if (!saved.ok) throw Error(media.error || 'Das Bild konnte nicht gespeichert werden.');
  return media.src as string;
}

const sizes = new Map<string, Promise<{ width: number; height: number }>>();
/** Width and height of a picture (for laying out cards). */
export function pictureSize(src: string) {
  let found = sizes.get(src);
  if (!found) {
    found = new Promise((done) => {
      const img = new Image();
      img.onload = () => done({ width: img.naturalWidth || 300, height: img.naturalHeight || 300 });
      img.onerror = () => done({ width: 300, height: 300 });
      img.src = src;
    });
    sizes.set(src, found);
  }
  return found;
}
