import type { LearningSettings } from './catalog';
export type KaraokeCue = { at: number; text: string };
export const MAX_KARAOKE_LINES = 300;
export const MAX_KARAOKE_TIME = 86400;
export function karaokeLines(text: string | undefined) {
  const value = (text ?? 'Dein Liedtext').replace(/\r\n?/g, '\n');
  return value.trim() ? value.split('\n').slice(0, MAX_KARAOKE_LINES) : [];
}
export function validKaraokeTimes(times: unknown, count: number): times is number[] {
  return Array.isArray(times) && times.length === count && times.length <= MAX_KARAOKE_LINES && times.every((at, i) => typeof at === 'number' && Number.isFinite(at) && at >= 0 && at <= MAX_KARAOKE_TIME && (i === 0 || at >= times[i - 1]));
}
export function karaokeTimeline(c: LearningSettings): KaraokeCue[] {
  const lines = karaokeLines(c.text), seconds = Math.max(0.1, Math.min(3600, c.seconds ?? 3));
  const times = validKaraokeTimes(c.karaokeTimes, lines.length) ? c.karaokeTimes : lines.map((_, i) => i * seconds);
  return lines.map((text, i) => ({ text, at: times[i] }));
}
/** Find the last cue at or before the actual playback position; tied cues sing together. */
export function karaokeActive(cues: KaraokeCue[], time: number): number[] {
  if (!Number.isFinite(time) || time < 0) return [];
  let low = 0, high = cues.length;
  while (low < high) { const middle = (low + high) >>> 1; if (cues[middle].at <= time) low = middle + 1; else high = middle; }
  if (!low) return [];
  const last = low - 1, at = cues[last].at, active = [last];
  for (let i = last - 1; i >= 0 && cues[i].at === at; i--) active.unshift(i);
  return active;
}
export function karaokeDuration(c: LearningSettings) {
  const cues = karaokeTimeline(c);
  return cues.length ? cues[cues.length - 1].at + Math.max(0.1, Math.min(3600, c.seconds ?? 3)) : 0;
}
export function formatKaraokeTime(seconds: number) {
  const ms = Math.round(Math.max(0, seconds) * 1000), minutes = Math.floor(ms / 60000), rest = Math.floor(ms / 1000) % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
}
/** Basic line-timed LRC. Deliberately reject offset/word-timing extensions instead of misaligning them. */
export function parseKaraokeLrc(source: string): { text: string; karaokeTimes: number[] } {
  if (source.length > 100000) throw new Error('Die LRC-Datei ist zu groß.');
  const cues: KaraokeCue[] = [];
  for (const raw of source.replace(/^\uFEFF/, '').split(/\r\n?|\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (/^\[offset:/i.test(line)) { if (!/^\[offset:\s*[+-]?0\s*\]$/i.test(line)) throw new Error('LRC-Zeitversätze werden noch nicht unterstützt. Bitte Zeiten ohne offset exportieren.'); continue; }
    if (/^\[(ar|ti|al|by|re|ve|length):[^\]]*\]$/i.test(line)) continue;
    let remaining = line; const times: number[] = [];
    while (/^\[\d{1,4}:/.test(remaining)) {
      const stamp = /^\[(\d{1,4}):([0-5]\d)(?:[.,](\d{1,3}))?\]/.exec(remaining);
      if (!stamp) throw new Error('Ungültige LRC-Zeit. Erwartet wird [mm:ss.xxx] vor jeder Textzeile.');
      const at = Number(stamp[1]) * 60 + Number(stamp[2]) + Number(`0.${stamp[3] || '0'}`);
      if (at > MAX_KARAOKE_TIME) throw new Error('Ein LRC-Zeitpunkt liegt nach 24 Stunden.');
      times.push(at); remaining = remaining.slice(stamp[0].length);
    }
    if (!times.length) throw new Error('Jede Liedzeile benötigt eine Zeitmarke wie [00:03.000].');
    if (/<\d+:\d/.test(remaining)) throw new Error('Wortweise LRC-Zeitmarken werden noch nicht unterstützt. Bitte zeilenweise Zeiten verwenden.');
    for (const at of times) cues.push({ at, text: remaining.trim() });
    if (cues.length > MAX_KARAOKE_LINES) throw new Error('Bitte höchstens 300 zeitgesteuerte Zeilen verwenden.');
  }
  cues.sort((a, b) => a.at - b.at);
  const text = cues.map(cue => cue.text).join('\n');
  if (!cues.length || !text.trim()) throw new Error('Die Datei enthält keinen Liedtext mit Zeitmarken.');
  if (text.length > 10000) throw new Error('Der Liedtext darf höchstens 10.000 Zeichen enthalten.');
  return { text, karaokeTimes: cues.map(cue => cue.at) };
}
export function exportKaraokeLrc(c: LearningSettings) {
  return karaokeTimeline(c).map(cue => `[${formatKaraokeTime(cue.at)}]${cue.text}`).join('\n');
}
