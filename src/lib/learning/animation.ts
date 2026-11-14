// Animation of Lernsachen-Heft: up to 8 objects (text, picture, sticker) with
// keyframes (place, size, turn, visibility, easing, path), up to 4 drawn
// paths, length, background, loop, autostart, poster frame. The stage and the
// motion are the reference's (reference/class-runtime.ts); pictures are media
// addresses. The page is the reference's template (title above the stage).
import { animationStart } from '../reference/class-runtime';

export type AnimKey = { t: number; x: number; y: number; s: number; rot: number; o: number; ease?: string; path?: { id: string; speed: number; turn?: boolean } };
export type AnimObject = { id: string; kind: 'text' | 'image' | 'sticker'; name: string; w: number; h: number; keys: AnimKey[]; text?: string; font?: string; size?: number; color?: string; bold?: boolean; fill?: string; img?: string; svg?: string; flip?: boolean };
export type Anim = { title: string; len: number; bg: string; bgImg?: string; objects: AnimObject[]; paths: { id: string; pts: [number, number][] }[]; loop: boolean; auto: boolean; showPaths: boolean; poster: number };

const media = (v: unknown) => (typeof v === 'string' && /^(\/api\/medien\/[\w./-]+|data:image\/)/.test(v) ? v : undefined);
/** The animation with only media addresses for pictures (else the reference's own checks apply when drawing). */
export function animation(raw: unknown): Anim {
  const start = animationStart() as Anim;
  if (!raw || typeof raw !== 'object') return start;
  const v = raw as Partial<Anim>;
  const objects = (Array.isArray(v.objects) ? v.objects : []).filter((o) => o && typeof o.id === 'string' && Array.isArray(o.keys) && o.keys.length && (o.kind !== 'image' || media(o.img))).slice(0, 8);
  return {
    ...start,
    ...v,
    title: typeof v.title === 'string' ? v.title.slice(0, 80) : start.title,
    objects: objects as AnimObject[],
    paths: (Array.isArray(v.paths) ? v.paths : []).slice(0, 4),
    ...(media(v.bgImg) ? { bgImg: media(v.bgImg) } : { bgImg: undefined }),
  };
}

export function animationAssets(a: Anim) {
  const assets: Record<string, { dataUrl: string }> = {};
  for (const x of [...a.objects.map((o) => o.img), a.bgImg]) if (x) assets[x] = { dataUrl: x };
  return assets;
}

/** An emoji of our sticker library as a sticker of the animation. */
export const emojiSvg = (symbol: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="82" font-size="84" text-anchor="middle">${symbol}</text></svg>`;
