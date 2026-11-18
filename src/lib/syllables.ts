// Silbentrennung für Lesetexte (Silbenmethode) und „Silben klatschen“.
// Ein Vorschlag für unbekannte Wörter, keine verbindliche deutsche Trennung:
// Lehrlisten mit ausdrücklich gesetzten Silben haben Vorrang.
import { wordBanks } from './learning/words';

export const plainWord = (word: string) => word.normalize('NFC').replace(/-/g, '').trim();
const normal = (word: string) => plainWord(word).toLocaleLowerCase('de');
const dictionary = new Map(Object.values(wordBanks).flat().map((word) => [normal(word), word.split('-')]));
for (const word of ['Son-ne', 'Blu-me', 'Re-gen-bo-gen', 'Scho-ko-la-de', 'Haus', 'Fa-mi-li-e', 'Feu-er', 'Bau-er', 'Fe-ri-en'])
  dictionary.set(normal(word), word.split('-'));

/** Silben eines Worts; `known`: aus einer Lehrliste oder mit Bindestrichen vorgegeben. */
export function syllabify(input: string): { word: string; parts: string[]; known: boolean } {
  const text = input.normalize('NFC').trim(), word = plainWord(text);
  if (text.includes('-')) return { word, parts: text.split('-').filter(Boolean), known: true };
  const listed = dictionary.get(normal(text));
  if (listed) {
    let offset = 0;
    return {
      word,
      parts: listed.map((part) => {
        const value = word.slice(offset, offset + part.length);
        offset += part.length;
        return value;
      }),
      known: true,
    };
  }
  const nuclei: { start: number; end: number }[] = [];
  const lower = word.toLocaleLowerCase('de');
  for (let i = 0; i < lower.length; i++)
    if (/[aeiouäöüy]/.test(lower[i])) {
      if (lower[i] === 'u' && lower[i - 1] === 'q') continue;
      const pair = lower.slice(i, i + 2),
        end = ['au', 'ei', 'eu', 'äu', 'ie', 'ai', 'oi'].includes(pair) ? i + 2 : i + 1;
      nuclei.push({ start: i, end });
      i = end - 1;
    }
  const cuts: number[] = [];
  for (let i = 1; i < nuclei.length; i++) {
    const previous = nuclei[i - 1], next = nuclei[i], between = lower.slice(previous.end, next.start);
    let cut = previous.end;
    if (between.length) {
      const cluster = ['sch', 'ch', 'ck', 'ph', 'th', 'qu'].find((part) => between.endsWith(part));
      cut = next.start - (cluster?.length || 1);
    }
    if (cut > (cuts[cuts.length - 1] || 0)) cuts.push(cut);
  }
  const boundaries = [0, ...cuts, word.length];
  return { word, parts: boundaries.slice(1).map((end, i) => word.slice(boundaries[i], end)).filter(Boolean), known: false };
}

/** Ein Text in Stücke: Silben abwechselnd blau (0) und rot (1), in jedem Wort mit Blau beginnend; alles andere ohne Farbe. */
export function syllableSegments(text: string): { text: string; tone: 0 | 1 | null }[] {
  const out: { text: string; tone: 0 | 1 | null }[] = [];
  for (const piece of text.split(/(\p{L}+)/u)) {
    if (!piece) continue;
    if (!/^\p{L}+$/u.test(piece)) {
      out.push({ text: piece, tone: null });
      continue;
    }
    const parts = syllabify(piece).parts;
    // Nur wenn die Silben genau das Wort ergeben (sonst das ganze Wort blau).
    const ok = parts.join('') === piece;
    (ok ? parts : [piece]).forEach((part, i) => out.push({ text: part, tone: (i % 2) as 0 | 1 }));
  }
  return out;
}
export const SYLLABLE_COLORS = ['#1565c0', '#d32f2f'] as const;
