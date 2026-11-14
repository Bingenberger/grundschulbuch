// Uhr, Timer and Datum of Regal › Zeit in Lernsachen-Heft, and its Multi-Timer.
// The widgets themselves are the reference's (reference/class-runtime.ts); here
// are their settings as the reference keeps them on the item, and their sizes.

export type ZeitKind = 'clock' | 'timer' | 'date';
export type Place = { name: string; lat: number; lon: number };
export type ZeitConfig = {
  kind: ZeitKind;
  /** Uhr: analog or digital. */
  face: 'analog' | 'digital';
  /** Timer: fixed (runs when the page opens) or flexible (each tap: next 5 minutes). */
  timer: 'fixed' | 'flex';
  minutes: number;
  /** Timer without the gong at the end. */
  silent: boolean;
  /** Datum: the place of the weather (none: no weather). */
  place?: Place;
};

/** Quick choices of the timer dialog in the reference. */
export const TIMER_MINUTES = [5, 10, 15, 20, 30, 45, 60];

export function defaultZeit(kind: ZeitKind = 'clock'): ZeitConfig {
  return { kind, face: 'analog', timer: 'fixed', minutes: 10, silent: false };
}

export function zeitConfig(raw: unknown): ZeitConfig {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<ZeitConfig>;
  const kind: ZeitKind = v.kind === 'timer' || v.kind === 'date' ? v.kind : 'clock';
  const minutes = Number(v.minutes);
  const p = v.place;
  const place = p && typeof p.name === 'string' && Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180
    ? { name: p.name.slice(0, 80), lat: Math.round(p.lat * 100) / 100, lon: Math.round(p.lon * 100) / 100 } : undefined;
  return {
    kind,
    face: v.face === 'digital' ? 'digital' : 'analog',
    timer: v.timer === 'flex' ? 'flex' : 'fixed',
    minutes: Number.isFinite(minutes) ? Math.max(1, Math.min(60, Math.round(minutes))) : 10,
    silent: v.silent === true,
    ...(place ? { place } : {}),
  };
}

/** The item the reference draws (its own field names). */
export function zeitItem(c: ZeitConfig, id: string) {
  return { id, type: 'widget', kind: c.kind, face: c.face, timer: c.timer, minutes: c.minutes, ...(c.silent ? { silent: true } : {}), ...(c.place ? { place: c.place } : {}) };
}

/** Sizes of the reference (oH, 1400 px = page width) in mm on our A4 landscape page. */
const PX = 297 / 1400;
export function zeitSize(c: ZeitConfig) {
  const px = c.kind === 'timer' ? { w: 300, h: 348 } : c.kind === 'date' ? { w: 640, h: 200 } : c.face === 'digital' ? { w: 400, h: 180 } : { w: 300, h: 300 };
  return { width: Math.round(px.w * PX), height: Math.round(px.h * PX) };
}
export const MULTI_TIMER_SIZE = { width: Math.round(520 * PX), height: Math.round(520 * PX) };

/** What the widget says in the catalogue and in its title. */
export const ZEIT_TITLES: Record<ZeitKind, string> = { clock: 'Uhr', timer: 'Timer', date: 'Datum' };
