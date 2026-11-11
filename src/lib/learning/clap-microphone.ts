import { ClapDetector } from './clap-detector';
type Callbacks = { state: (value: 'off' | 'opening' | 'ready' | 'listening') => void; count: (scope: string, count: number) => void; finish: (scope: string, count: number) => void; error: (message: string) => void; level: (value: number) => void };
type Environment = { request: () => Promise<MediaStream>; context: () => AudioContext; frame: (callback: FrameRequestCallback) => number; cancel: (id: number) => void; now: () => number };
const browser: Environment = { request: () => navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }), context: () => { const Constructor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; return new Constructor(); }, frame: fn => requestAnimationFrame(fn), cancel: id => cancelAnimationFrame(id), now: () => performance.now() };
/** Owns a live stream, but never records or uploads audio. Pause keeps permission
 * and the stream for the next word; stop disposes it, including late requests. */
export class ClapMicrophone {
  private stream: MediaStream | null = null;
  private context: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private samples: Float32Array<ArrayBuffer> | null = null;
  private frame: number | null = null;
  private generation = 0;
  private pending = false;
  private scope: string | null = null;
  private detector: ClapDetector | null = null;
  private since = 0;
  private lastLevel = 0;
  constructor(private callbacks: Callbacks, private environment: Environment = browser) {}
  update(callbacks: Callbacks) { this.callbacks = callbacks; }
  async start(scope: string, threshold = 0.06) {
    if (this.pending) return;
    const token = ++this.generation;
    if (!this.stream) {
      this.pending = true; this.callbacks.state('opening');
      let stream: MediaStream | null = null, context: AudioContext | null = null;
      try {
        stream = await this.environment.request();
        if (token !== this.generation) { stream.getTracks().forEach(track => track.stop()); return; }
        context = this.environment.context(); await context.resume();
        if (token !== this.generation) { stream.getTracks().forEach(track => track.stop()); await context.close(); return; }
        const source = context.createMediaStreamSource(stream), analyser = context.createAnalyser();
        analyser.fftSize = 1024; source.connect(analyser);
        this.stream = stream; this.context = context; this.source = source; this.analyser = analyser;
        this.samples = new Float32Array(analyser.fftSize);
      } catch {
        stream?.getTracks().forEach(track => track.stop()); void context?.close().catch(() => {});
        if (token === this.generation) { this.callbacks.state('off'); this.callbacks.error('Das Mikrofon ist nicht verfügbar. Bitte Zugriff erlauben oder die Klatschtaste benutzen.'); }
        return;
      } finally { if (token === this.generation) this.pending = false; }
    }
    if (token !== this.generation) return;
    this.scope = scope; this.detector = new ClapDetector(threshold); this.since = this.environment.now();
    this.callbacks.state('listening'); this.schedule();
  }
  pause() {
    this.generation++; this.pending = false; this.scope = null; this.detector = null;
    this.callbacks.state(this.stream ? 'ready' : 'off');
  }
  stop() {
    this.pause();
    if (this.frame !== null) this.environment.cancel(this.frame);
    this.frame = null; this.source?.disconnect(); this.source = null;
    this.stream?.getTracks().forEach(track => track.stop()); this.stream = null;
    void this.context?.close().catch(() => {}); this.context = null; this.analyser = null; this.samples = null;
    this.callbacks.state('off'); this.callbacks.level(0);
  }
  private schedule() { if (this.frame === null) this.frame = this.environment.frame(this.tick); }
  private tick = (now: number) => {
    this.frame = null;
    if (!this.analyser || !this.samples) return;
    this.analyser.getFloatTimeDomainData(this.samples);
    let sum = 0, peak = 0;
    for (const sample of this.samples) { sum += sample * sample; peak = Math.max(peak, Math.abs(sample)); }
    const rms = Math.sqrt(sum / this.samples.length);
    if (now - this.lastLevel >= 100) { this.lastLevel = now; this.callbacks.level(Math.min(1, rms * 5)); }
    const detector = this.detector, scope = this.scope;
    if (detector && scope) {
      const result = detector.sample(rms, peak, now);
      if (result.clap) this.callbacks.count(scope, detector.count);
      if (this.detector !== detector || this.scope !== scope) { if (this.analyser) this.schedule(); return; }
      if (result.finished || detector.count >= 32) { this.pause(); this.callbacks.finish(scope, detector.count); }
      else if (now - this.since > 12000) { this.pause(); this.callbacks.error('Noch keine ruhige Klatschfolge erkannt. Bitte erneut versuchen oder die Klatschtaste benutzen.'); }
    }
    if (this.analyser) this.schedule();
  };
}
