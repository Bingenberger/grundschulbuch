import { recognizeStroke, recognizeArrowHead, type Recognition } from './shape-recognition';
import type { PageElement, Point } from './notebook-model';

type Scheduler = {
  now: () => number;
  set: (callback: () => void, delay: number) => ReturnType<typeof setTimeout>;
  clear: (timer: ReturnType<typeof setTimeout>) => void;
};
const browserScheduler: Scheduler = {
  now: () => performance.now(),
  set: (callback, delay) => setTimeout(callback, delay),
  clear: timer => clearTimeout(timer),
};
const separation = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/** The same hold/release state machine is used by both editors. Tolerances are
 * screen pixels, converted with the actual page scale, rather than tiny fixed
 * millimetre thresholds that penalise zoomed-out pages or stylus tremor. */
export class ShapeHold {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private anchor: Point | null = null;
  private snappedAt: Point | null = null;
  private candidate: Recognition | null = null;
  private points: Point[] = [];
  private shaft: PageElement | null = null;
  private restIndex = 0;
  private since = 0;
  private scale = 96 / 25.4;
  private preview: ((shape: Recognition | null) => void) | null = null;

  constructor(private scheduler: Scheduler = browserScheduler) {}

  get replacementId() { return this.candidate?.replaceId; }

  cancel() {
    if (this.timer !== null) this.scheduler.clear(this.timer);
    this.timer = null; this.anchor = null; this.snappedAt = null;
    this.candidate = null; this.points = []; this.preview = null; this.shaft = null;
  }

  private recognize() {
    const end = this.points[this.points.length - 1];
    if (!end || !this.anchor) return null;
    // Repeated sensor events while holding must not append a tiny scribble to
    // the end of an otherwise recognisable circle or polygon.
    const trimmed = [...this.points.slice(0, this.restIndex), end];
    const shape = recognizeArrowHead(trimmed, this.shaft) || recognizeStroke(trimmed) || recognizeStroke(this.points);
    if (shape) { this.candidate = shape; this.snappedAt = { ...end }; }
    return shape;
  }

  private attempt = () => {
    this.timer = null;
    const shape = this.recognize();
    if (shape) this.preview?.(shape);
  };

  update(points: Point[], preview: (shape: Recognition | null) => void, pixelsPerMm = 96 / 25.4, shaft: PageElement | null = null) {
    if (!points.length) return;
    this.points = points; this.preview = preview; this.shaft = shaft;
    this.scale = Number.isFinite(pixelsPerMm) && pixelsPerMm > 0 ? pixelsPerMm : 96 / 25.4;
    const end = points[points.length - 1];
    if (this.candidate && this.snappedAt && separation(end, this.snappedAt) * this.scale <= 14) {
      preview(this.candidate); return;
    }
    if (!this.candidate && this.anchor && separation(end, this.anchor) * this.scale <= 7) {
      preview(null);
      if (this.timer === null) this.timer = this.scheduler.set(this.attempt, 100);
      return;
    }
    if (this.timer !== null) this.scheduler.clear(this.timer);
    this.candidate = null; this.snappedAt = null;
    this.anchor = { ...end }; this.restIndex = points.length - 1;
    this.since = this.scheduler.now(); preview(null);
    this.timer = this.scheduler.set(this.attempt, 550);
  }

  finish(points: Point[], confirmedOnly = false): Recognition | null {
    this.points = points;
    const end = points[points.length - 1];
    let shape = this.candidate && end && this.snappedAt && separation(end, this.snappedAt) * this.scale <= 14 ? this.candidate : null;
    // A busy browser can dispatch pointer-up before a due timer callback.
    if (!shape && !confirmedOnly && end && this.anchor && separation(end, this.anchor) * this.scale <= 7 && this.scheduler.now() - this.since >= 550)
      shape = this.recognize();
    this.cancel();
    return shape;
  }
}
