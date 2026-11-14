// Diaschau of Lernsachen-Heft: up to 30 photos with caption and own sound,
// seconds per photo, transition, kind of caption, design, background music,
// “photo stays until its sound is over”, “start again at the end”. Pictures
// and sounds are media addresses (school server); the page is the reference's
// (background and title colour of the design, the show below).
import { showDesign, showStart } from '../reference/class-runtime';

export type Slide = { img: string; caption?: string; sound?: string };
export type Show = { title: string; slides: Slide[]; dur: number; transition: string; caption: string; design: string; music?: { mood?: string; sound?: string; vol: number }; wait: boolean; loop: boolean };
export type ShowDesign = { id: string; label: string; bg: string; accent: string; paper: string; title: string; page: () => string };

const media = (v: unknown) => (typeof v === 'string' && /^(\/api\/medien\/[\w./-]+|data:(image|audio)\/)/.test(v) ? v : undefined);
export function show(raw: unknown): Show {
  const start = showStart() as Show;
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<Show>;
  const slides = (Array.isArray(v.slides) ? v.slides : []).flatMap((s) => {
    const img = media(s?.img);
    if (!img) return [];
    const sound = media(s.sound);
    return [{ img, ...(typeof s.caption === 'string' && s.caption.trim() ? { caption: s.caption.slice(0, 200) } : {}), ...(sound ? { sound } : {}) }];
  }).slice(0, 30);
  const music = v.music && typeof v.music === 'object' ? v.music : undefined;
  const vol = Math.max(0.05, Math.min(1, Number(music?.vol) || 0.6));
  return {
    ...start,
    title: typeof v.title === 'string' && v.title.trim() ? v.title.slice(0, 80) : start.title,
    slides,
    dur: Math.max(2, Math.min(20, Math.round(Number(v.dur) || start.dur))),
    transition: typeof v.transition === 'string' ? v.transition : start.transition,
    caption: typeof v.caption === 'string' ? v.caption : start.caption,
    design: typeof v.design === 'string' ? v.design : start.design,
    ...(music?.sound && media(music.sound) ? { music: { sound: media(music.sound), vol } } : music?.mood ? { music: { mood: String(music.mood), vol } } : {}),
    wait: v.wait !== false,
    loop: v.loop === true,
  };
}
export const designOfShow = (id: string) => showDesign(id) as ShowDesign;

/** Pictures and sounds as the assets the reference asks for. */
export function showAssets(s: Show) {
  const assets: Record<string, { dataUrl: string }> = {};
  for (const x of [...s.slides.flatMap((sl) => [sl.img, sl.sound]), s.music?.sound]) if (x) assets[x] = { dataUrl: x };
  return assets;
}
