import type { LearningSettings } from './catalog';
export type Slide = NonNullable<LearningSettings['slides']>[number];
export function slideshowSlides(c: LearningSettings): Slide[] {
  return c.slides?.length ? c.slides : [{ title: 'Meine Geschichte', text: 'Gestalte deine Folien im Einstellungsfenster.', seconds: 5 }];
}
export function slideshowIndex(value: unknown, count: number) {
  return Math.max(0, Math.min(Math.max(0, count - 1), Math.floor(Number(value) || 0)));
}
export type SlideAudio = Pick<HTMLAudioElement, 'volume' | 'onended' | 'onerror' | 'ontimeupdate' | 'play' | 'pause'>;
export type SlideshowSnapshot = { index: number; status: 'idle' | 'playing' | 'paused' | 'ended'; error: string };
type Options = {
  slides: Slide[]; index?: number; completed?: boolean; repeat?: boolean; sound?: boolean; waitAudio?: boolean; volume?: number;
  audio: (src: string) => SlideAudio; now: () => number;
  schedule: (callback: () => void, ms: number) => unknown; cancel: (timer: unknown) => void;
  onChange: (snapshot: SlideshowSnapshot) => void; onIndex: (index: number) => void; onFinish: (index: number) => void;
};
/** Owns one slide's audio and timers. Nothing is loaded or scheduled until play(). */
export function createSlideshowPlayback(o: Options) {
  const slides = o.slides.length ? o.slides : slideshowSlides({});
  let index = slideshowIndex(o.index, slides.length), status: SlideshowSnapshot['status'] = o.completed && index === slides.length - 1 ? 'ended' : 'idle';
  let onIndex = o.onIndex, onFinish = o.onFinish;
  let error = '', elapsed = 0, began: number | null = null, generation = 0, audio: SlideAudio | null = null;
  let audioDone = !slides[index].audio || o.sound === false, timer: unknown = null, watchdog: unknown = null;
  const snapshot = (): SlideshowSnapshot => ({ index, status, error });
  const publish = () => o.onChange(snapshot());
  const duration = () => Math.max(1, Math.min(3600, slides[index].seconds || 5)) * 1000;
  function clearTimers() { if (timer !== null) o.cancel(timer); if (watchdog !== null) o.cancel(watchdog); timer = watchdog = null; }
  function detach() {
    generation++; clearTimers();
    if (audio) { audio.onended = audio.onerror = audio.ontimeupdate = null; audio.pause(); audio = null; }
  }
  function pause() {
    if (status !== 'playing') return;
    if (began !== null) elapsed = Math.min(duration(), elapsed + Math.max(0, o.now() - began));
    began = null; generation++; clearTimers(); audio?.pause(); status = 'paused'; publish();
  }
  function fail(token: number, message: string) {
    if (token !== generation || status !== 'playing') return;
    pause(); error = message; publish();
  }
  function watch(token: number) {
    if (watchdog !== null) o.cancel(watchdog);
    watchdog = o.schedule(() => fail(token, 'Der Folienton reagiert nicht mehr. Bitte erneut starten oder ohne Ton fortsetzen.'), 30000);
  }
  function ready() {
    if (status !== 'playing' || elapsed < duration() || o.waitAudio !== false && !audioDone) return;
    if (index + 1 < slides.length || o.repeat) {
      const next = index + 1 < slides.length ? index + 1 : 0;
      load(next); onIndex(index); play();
    } else {
      detach(); began = null; status = 'ended'; publish(); onFinish(index);
    }
  }
  function load(next: number) {
    detach(); index = slideshowIndex(next, slides.length); elapsed = 0; began = null;
    audioDone = !slides[index].audio || o.sound === false; error = ''; status = 'idle';
  }
  function play() {
    if (status === 'playing') return;
    if (status === 'ended') { load(0); onIndex(index); }
    error = ''; status = 'playing'; const token = ++generation;
    began = elapsed < duration() ? o.now() : null;
    timer = o.schedule(() => { if (token !== generation) return; timer = null; elapsed = duration(); began = null; ready(); }, Math.max(0, duration() - elapsed));
    publish();
    if (!audioDone) {
      try {
        audio ||= o.audio(slides[index].audio!);
        audio.volume = Math.max(0, Math.min(1, o.volume ?? 0.8));
        audio.onended = () => { if (token !== generation || status !== 'playing') return; audioDone = true; if (watchdog !== null) o.cancel(watchdog); watchdog = null; ready(); };
        audio.onerror = () => fail(token, 'Der Folienton konnte nicht abgespielt werden. Bitte erneut starten oder ohne Ton fortsetzen.');
        audio.ontimeupdate = () => { if (token === generation && status === 'playing' && !audioDone) watch(token); };
        watch(token);
        void audio.play().catch(() => fail(token, 'Der Browser konnte den Folienton nicht starten. Bitte erneut starten oder ohne Ton fortsetzen.'));
      } catch { fail(token, 'Der Folienton konnte nicht geladen werden. Bitte erneut starten oder ohne Ton fortsetzen.'); }
    }
  }
  function jump(next: number, notify = true) {
    const resume = status === 'playing' && notify;
    load(next); if (notify) onIndex(index); publish(); if (resume) play();
  }
  function withoutAudio() {
    pause(); detach(); audioDone = true; error = ''; play();
  }
  function stop() { detach(); began = null; elapsed = 0; status = 'idle'; error = ''; publish(); }
  function restore(next: number, completed: boolean) {
    next = slideshowIndex(next, slides.length);
    if (next !== index || completed && status !== 'ended' || !completed && status === 'ended') {
      load(next); if (completed && index === slides.length - 1) status = 'ended'; publish();
    }
  }
  function setResponseHandlers(indexHandler: Options['onIndex'], finishHandler: Options['onFinish']) { onIndex = indexHandler; onFinish = finishHandler; }
  return { snapshot, play, pause, jump, withoutAudio, stop, restore, setResponseHandlers };
}
