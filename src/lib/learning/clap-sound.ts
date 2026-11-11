import { audioContext } from './audio';
/** A short, locally synthesised clap-like beat; no downloaded recording. */
export function clapSound(volume = 0.5): () => void {
  const context = audioContext(), buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.09), context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * Math.exp(-i / samples.length * 7);
  const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
  source.buffer = buffer; filter.type = 'highpass'; filter.frequency.value = 800; gain.gain.value = Math.max(0, Math.min(1, volume)) * 0.6;
  source.connect(filter); filter.connect(gain); gain.connect(context.destination);
  let stopped = false;
  const disconnect = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
  source.onended = disconnect; source.start();
  return () => { if (stopped) return; stopped = true; try { source.stop(); } catch {} disconnect(); };
}
