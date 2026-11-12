import { tone } from './audio';

/** Short sounds for right (two rising notes) and wrong (one low note). */
export function feedback(right: boolean) {
  try {
    if (right) {
      tone(659, 0.15, 0.25);
      setTimeout(() => tone(880, 0.3, 0.25), 130);
    } else tone(196, 0.35, 0.25);
  } catch {}
}
