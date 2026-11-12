// Starting words of “Silben klatschen” like the reference, with ARASAAC pictures
// shipped in the app.
import { makeClap } from './clap';

export function defaultClap() {
  return makeClap({
    words: [
      { w: 'Banane', img: '/bilder/2530.webp' },
      { w: 'Hund', img: '/bilder/7202.webp' },
      { w: 'Tomate', img: '/bilder/2594.webp' },
      { w: 'Schokolade', img: '/kasse/25940.webp' },
    ],
  });
}
/** Pictures that may be shown (also in exported books). */
export const safePicture = (v: unknown) =>
  typeof v === 'string' && (/^\/(bilder|kasse|anlaut)\/[a-z0-9-]+\.webp$/.test(v) || /^\/api\/medien\/[a-f0-9]{64}\.[a-z0-9]+$/.test(v) || /^media\/[\w.-]+$/.test(v) || /^data:image\//.test(v)) ? v : undefined;
