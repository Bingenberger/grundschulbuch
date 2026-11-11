type Stop = () => void;
type Environment = {
  read: (text: string, done: () => void) => Stop | null;
  audio: (src: string, done: () => void) => Stop;
  beat: () => Stop;
  later: (callback: () => void, ms: number) => ReturnType<typeof setTimeout>;
  clear: (id: ReturnType<typeof setTimeout>) => void;
};
/** A cancellable demonstration: each syllable owns its sound, highlight and
 * watchdog. Late media events from a stopped word cannot advance a new one. */
export class ClapPlayback {
  private generation = 0;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private stops: Stop[] = [];
  constructor(private environment: Environment, private active: (index: number) => void, private finished: () => void, private unavailable: () => void) {}
  update(environment: Environment, active: (index: number) => void, finished: () => void, unavailable: () => void) {
    this.environment = environment; this.active = active; this.finished = finished; this.unavailable = unavailable;
  }
  stop() {
    this.generation++;
    for (const timer of this.timers) this.environment.clear(timer);
    this.timers.clear(); this.stops.splice(0).forEach(stop => stop());
  }
  start(parts: { text: string; audio?: string }[], beats = true) {
    this.stop(); const token = this.generation;
    const later = (fn: () => void, ms: number) => {
      const timer = this.environment.later(() => { this.timers.delete(timer); if (token === this.generation) fn(); }, ms);
      this.timers.add(timer); return timer;
    };
    const step = (index: number) => {
      if (token !== this.generation) return;
      if (index >= parts.length) { this.finished(); return; }
      this.active(index);
      if (beats) this.stops.push(this.environment.beat());
      let done = false;
      const finish = () => {
        if (done || token !== this.generation) return;
        done = true;
        this.stops.splice(0).forEach(stop => stop());
        for (const timer of this.timers) this.environment.clear(timer);
        this.timers.clear(); later(() => step(index + 1), beats ? 300 : 0);
      };
      later(finish, beats ? 5000 : 20000);
      const part = parts[index];
      const stop = part.audio ? this.environment.audio(part.audio, finish) : this.environment.read(part.text, finish);
      if (stop) { if (done || token !== this.generation) stop(); else this.stops.push(stop); }
      else { this.unavailable(); later(finish, 650); }
    };
    step(0);
  }
}
