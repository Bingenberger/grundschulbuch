// What the widgets of the reference expect from their surroundings – speech,
// sounds and taps – provided with our own means. The widget code itself
// (reference/*.ts) stays unchanged and draws into the element it is given.
import { speakAndWait, stopSpeaking } from '../speech';
import { feedback } from '../learning/feedback';

/** Speaks `text` (or plays a recording) and resolves when it is over. */
export function lc(text: string, audioUrl?: string, options: { pitch?: number; rate?: number } = {}): Promise<void> {
  if (audioUrl) return Kr(audioUrl);
  if (!text) return Promise.resolve();
  return speakAndWait(text, options);
}
/** Stops speaking. */
export const dc = () => stopSpeaking();
/** The “well done” sound. */
export const vi = () => feedback(true);
/** A short tap feedback in the reference (vibration); nothing here. */
export const pi = () => {};

let context: AudioContext | null = null;
/** The shared audio context (created on first use, after a tap). */
export function Vr(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    context ??= new Ctx();
    if (context.state === 'suspended') void context.resume();
    return context;
  } catch {
    return null;
  }
}
let playing: HTMLAudioElement | null = null;
/** Plays a recording; resolves when it has ended. */
export function Kr(url: string): Promise<void> {
  return new Promise((resolve) => {
    qr();
    const audio = new Audio(url);
    playing = audio;
    const done = () => {
      if (playing === audio) playing = null;
      resolve();
    };
    audio.onended = done;
    audio.onerror = done;
    audio.play().catch(done);
  });
}
/** Stops a recording that is playing. */
export function qr() {
  playing?.pause();
  playing = null;
}

/** A widget works when it is live (Tafel, Kinderheft, protected page). */
export const Ti = (el: Element) => el.classList.contains('is-live');

type Release = { release?: () => void } | null | undefined | unknown;
type TapOptions = { hit: (key: Element) => Release; slide?: boolean; silent?: boolean; begin?: () => void };
const taps = new WeakMap<Element, TapOptions>();
const releaseOf = (r: Release) => (r && typeof r === 'object' && 'release' in r && typeof (r as { release?: unknown }).release === 'function' ? (r as { release: () => void }).release : null);
/**
 * Keys of the widget (`.lh-key[data-a]`), like the reference: a key acts when
 * it is pressed; a widget may also want to know when it is let go (long press).
 * The editor does not move the element when a key is pressed.
 */
export function Si(el: HTMLElement, options: TapOptions) {
  const known = taps.has(el);
  taps.set(el, options);
  el.querySelectorAll('.lh-key[data-a]').forEach((key) => {
    key.setAttribute('tabindex', Ti(el) ? '0' : '-1');
    if (!key.hasAttribute('role')) key.setAttribute('role', 'button');
    if (!key.hasAttribute('aria-label')) {
      const label = key.querySelector('title')?.textContent?.trim() || key.textContent?.trim();
      if (label) key.setAttribute('aria-label', label);
    }
  });
  if (known) return;
  const pressed = new Map<number, { key: Element; release: (() => void) | null }>();
  el.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || !Ti(el)) return;
    const key = (e.target as Element).closest?.('.lh-key[data-a]');
    if (!key || !el.contains(key)) return;
    e.stopPropagation();
    const options = taps.get(el);
    if (!options?.silent) Vr();
    key.classList.add('is-down');
    options?.begin?.();
    pressed.set(e.pointerId, { key, release: releaseOf(options?.hit(key)) });
  });
  const up = (e: PointerEvent) => {
    const p = pressed.get(e.pointerId);
    if (!p) return;
    pressed.delete(e.pointerId);
    p.key.classList.remove('is-down');
    p.release?.();
  };
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  el.addEventListener('keydown', (e) => {
    if ((e.key !== 'Enter' && e.key !== ' ') || e.metaKey || e.ctrlKey || e.altKey || !Ti(el)) return;
    const key = (e.target as Element).closest?.('.lh-key[data-a]');
    if (!key || !el.contains(key)) return;
    e.preventDefault();
    e.stopPropagation();
    if (!e.repeat) releaseOf(taps.get(el)?.hit(key))?.();
  });
}
