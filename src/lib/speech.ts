/** Use only voices installed on the device; no remote speech service for children. */
export function speakGerman(
  text: string,
  options: { voice?: string; rate?: number; pitch?: number } = {},
): boolean {
  if (!window.speechSynthesis) return false;
  const voices = speechSynthesis
    .getVoices()
    .filter((v) => v.localService && v.lang.toLowerCase().startsWith('de'));
  const voice = voices.find((v) => v.name === options.voice) || voices[0];
  if (!voice) return false;
  speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'de-DE';
  speech.voice = voice;
  speech.rate = Math.max(0.3, Math.min(2, options.rate ?? 1));
  speech.pitch = Math.max(0.5, Math.min(2, options.pitch ?? 1));
  speechSynthesis.speak(speech);
  return true;
}
