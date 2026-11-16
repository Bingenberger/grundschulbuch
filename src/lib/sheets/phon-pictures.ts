// Pictures for the words of “Laute hören” (Lernsachen-Heft 1.47.3). The
// reference takes the Anlaut pictures it ships and loads the other ARASAAC
// pictures from the internet. Here the Anlaut pictures of the app are used
// (public/anlaut), the others are copied from ARASAAC through the school
// server (like the picture search); a word without picture is written instead.
import { PHON_WORDS } from './sheets-1473';

type Word = { word: string; no?: number; pack?: string };
export type PhonAsset = { id: string; kind: 'image'; dataUrl: string; width: number; height: number; name: string };
const asset = (src: string, word: string): PhonAsset => ({ id: src, kind: 'image', dataUrl: src, width: 160, height: 160, name: word });

const known = new Map<string, PhonAsset | null>();

async function exists(src: string) {
  try { return (await fetch(src, { method: 'HEAD' })).ok; } catch { return false; }
}
async function copyArasaac(no: number) {
  try {
    const saved = await fetch('/api/bilder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quelle: 'arasaac', bild: `https://static.arasaac.org/pictograms/${no}/${no}_500.png` }) });
    return saved.ok ? ((await saved.json()).src as string) : null;
  } catch { return null; }
}
const wordList = () => {
  const words = PHON_WORDS as unknown as Map<string, Word> | Word[];
  return [...(words instanceof Map ? words.values() : words)].filter((w) => w.no && !Array.isArray(w.no));
};
const pictures = () => new Map([...known].filter((e): e is [string, PhonAsset] => !!e[1]));

/** The Anlaut pictures shipped with the app (no internet needed). */
export async function shippedPhonPictures() {
  for (const w of wordList()) {
    if (known.has(w.word) || w.pack !== 'anlaut') continue;
    const src = `/anlaut/${w.no}.webp`;
    if (await exists(src)) known.set(w.word, asset(src, w.word));
  }
  return pictures();
}

/** The other pictures from ARASAAC, copied through the school server; `progress` gets the map and how many are left. */
export async function onlinePhonPictures(progress: (map: Map<string, PhonAsset>, left: number) => void) {
  const missing = wordList().filter((w) => !known.has(w.word));
  for (let i = 0; i < missing.length; i++) {
    const src = await copyArasaac(Number(missing[i].no));
    known.set(missing[i].word, src ? asset(src, missing[i].word) : null);
    progress(pictures(), missing.length - i - 1);
  }
  return pictures();
}
