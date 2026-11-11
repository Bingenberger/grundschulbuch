/** Detect a short burst after a quiet interval, not every loud audio frame.
 * This is an approximation; speech and classroom noise may also contain bursts. */
export class ClapDetector {
  private floor = 0.008;
  private latched = false;
  private last = -Infinity;
  private quietSince: number | null = null;
  count = 0;
  constructor(public threshold = 0.06) {}
  sample(rms: number, peak: number, now: number) {
    if (!Number.isFinite(rms + peak + now) || rms < 0 || peak < 0) return { clap: false, finished: false };
    const gate = Math.max(this.threshold, this.floor * 4);
    const quiet = rms < gate * 0.45 && peak < gate * 1.5;
    if (quiet) {
      this.latched = false; this.quietSince ??= now;
      this.floor = this.floor * 0.96 + rms * 0.04;
    } else this.quietSince = null;
    const attack = !this.latched && rms >= gate && peak >= gate * 2;
    const clap = attack && now - this.last >= 220;
    if (attack) this.latched = true;
    if (clap) { this.last = now; this.count = Math.min(32, this.count + 1); }
    return { clap, finished: this.count > 0 && this.quietSince !== null && now - this.quietSince >= 900 && now - this.last >= 1000 };
  }
}
