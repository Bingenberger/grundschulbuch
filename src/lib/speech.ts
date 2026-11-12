type SpeechOptions = { voice?: string; rate?: number; pitch?: number; onEnd?: () => void; onError?: () => void };
let activeSpeech: SpeechSynthesisUtterance | null = null;
/** Use only voices installed on the device; no remote speech service for children.
 * The cancellation handle owns this utterance, so a departing widget cannot
 * cancel another widget's newer speech. */
export function startGermanSpeech(text: string, options: SpeechOptions = {}): (() => void) | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const synthesis = window.speechSynthesis;
  const voices = synthesis.getVoices().filter(v => v.localService && v.lang.toLowerCase().startsWith('de'));
  const voice = voices.find(v => v.name === options.voice) || voices[0];
  if (!voice) return null;
  activeSpeech = null; synthesis.cancel();
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'de-DE'; speech.voice = voice;
  speech.rate = Math.max(0.3, Math.min(2, options.rate ?? 1));
  speech.pitch = Math.max(0.5, Math.min(2, options.pitch ?? 1));
  activeSpeech = speech;
  const done = (callback?: () => void) => { if (activeSpeech === speech) { activeSpeech = null; callback?.(); } };
  speech.onend = () => done(options.onEnd); speech.onerror = () => done(options.onError);
  synthesis.speak(speech);
  return () => {
    if (activeSpeech !== speech) return;
    activeSpeech = null; synthesis.cancel();
  };
}
export function speakGerman(text: string, options: SpeechOptions = {}): boolean {
  return startGermanSpeech(text, options) !== null;
}

let cutOff: (() => void) | null = null;
/**
 * Speaks and resolves when the sentence is over – also when it is cut off by
 * the next one, or (if the voice never reports its end) after a generous time,
 * like the reference does.
 */
export function speakAndWait(text: string, options: Omit<SpeechOptions, 'onEnd' | 'onError'> = {}): Promise<void> {
  return new Promise((resolve) => {
    cutOff?.();
    let finished = false;
    const end = () => {
      if (finished) return;
      finished = true;
      if (cutOff === end) cutOff = null;
      resolve();
    };
    cutOff = end;
    const started = startGermanSpeech(text, { ...options, onEnd: end, onError: end });
    setTimeout(end, started ? 4000 + text.length * 160 : 350);
  });
}
/** Stops speaking; waiting sentences go on at once. */
export function stopSpeaking() {
  cutOff?.();
  if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
}
