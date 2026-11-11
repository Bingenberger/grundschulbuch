// Editing sound: trimming, removing silence at both ends and "Klang
// verbessern" (even volume, clearer voice, quieter noise in pauses, shorter
// pauses). Works on mono Float32 samples; the result is saved as WAV.

export const RATE = 22050;
export const MAX_SECONDS = 300;
const WINDOW = 0.02; // seconds per loudness window

/** Loudness (RMS) per 20 ms window. */
export function loudness(samples, rate) {
  const size = Math.max(1, Math.round(rate * WINDOW));
  const out = new Float32Array(Math.ceil(samples.length / size));
  for (let w = 0; w < out.length; w++) {
    let sum = 0;
    const end = Math.min(samples.length, (w + 1) * size);
    for (let i = w * size; i < end; i++) sum += samples[i] * samples[i];
    out[w] = Math.sqrt(sum / Math.max(1, end - w * size));
  }
  return out;
}

/** Threshold between speech and background: above the noise floor, below the voice. */
function speechThreshold(levels) {
  const sorted = Array.from(levels).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const floor = sorted[Math.floor(sorted.length * 0.1)];
  const peak = sorted[Math.floor(sorted.length * 0.98)];
  // Without pauses (one steady sound) the floor is the voice itself.
  return Math.max(0.008, peak * 0.06, Math.min(floor * 2.5, peak * 0.5));
}

/**
 * Start and end (seconds) without silence at both ends, with a little
 * breathing room; null when nothing is clearly audible.
 */
export function audibleRange(samples, rate) {
  const levels = loudness(samples, rate);
  const threshold = speechThreshold(levels);
  let first = -1, last = -1;
  for (let i = 0; i < levels.length; i++)
    if (levels[i] > threshold) {
      if (first < 0) first = i;
      last = i;
    }
  if (first < 0) return null;
  const duration = samples.length / rate;
  return {
    start: Math.max(0, first * WINDOW - 0.1),
    end: Math.min(duration, (last + 1) * WINDOW + 0.15),
  };
}

export function slice(samples, rate, start, end) {
  return samples.slice(Math.max(0, Math.round(start * rate)), Math.min(samples.length, Math.round(end * rate)));
}

/** Even volume: loudness of speech to a common level, peaks below clipping. */
export function level(samples, rate) {
  const levels = loudness(samples, rate);
  const threshold = speechThreshold(levels);
  const voiced = Array.from(levels).filter((l) => l > threshold);
  if (!voiced.length) return samples;
  const speech = voiced.reduce((a, b) => a + b, 0) / voiced.length;
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const gain = Math.min(0.12 / speech, 0.95 / Math.max(peak, 1e-6), 12);
  return samples.map((s) => s * gain);
}

/** Clearer voice: no rumble below ~100 Hz and gentle compression. */
export function clearVoice(samples, rate) {
  // Second-order high-pass (RBJ biquad), 100 Hz.
  const w = (2 * Math.PI * 100) / rate, q = Math.SQRT1_2;
  const alpha = Math.sin(w) / (2 * q), cos = Math.cos(w);
  const a0 = 1 + alpha;
  const b0 = (1 + cos) / 2 / a0, b1 = -(1 + cos) / a0, b2 = (1 + cos) / 2 / a0;
  const a1 = (-2 * cos) / a0, a2 = (1 - alpha) / a0;
  const out = new Float32Array(samples.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < samples.length; i++) {
    const x = samples[i];
    const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    out[i] = y;
  }
  // Compressor 3:1 above -24 dBFS with a smooth envelope.
  const attack = Math.exp(-1 / (0.005 * rate)), release = Math.exp(-1 / (0.12 * rate));
  const threshold = 0.063;
  let envelope = 0;
  for (let i = 0; i < out.length; i++) {
    const a = Math.abs(out[i]);
    envelope = a > envelope ? attack * envelope + (1 - attack) * a : release * envelope + (1 - release) * a;
    if (envelope > threshold) out[i] *= (threshold * (envelope / threshold) ** (1 / 3)) / envelope;
  }
  return out;
}

/** Background noise between words fades to a fifth. */
export function quietPauses(samples, rate) {
  const levels = loudness(samples, rate);
  const threshold = speechThreshold(levels);
  const size = Math.max(1, Math.round(rate * WINDOW));
  const out = new Float32Array(samples.length);
  let gain = 1;
  const step = 1 / (0.03 * rate);
  for (let i = 0; i < samples.length; i++) {
    const w = Math.floor(i / size);
    // Look a little ahead so the start of a word is not cut.
    const speaking = levels[w] > threshold || levels[w + 1] > threshold || levels[w + 2] > threshold || levels[w - 1] > threshold;
    const target = speaking ? 1 : 0.2;
    gain += Math.max(-step, Math.min(step, target - gain));
    out[i] = samples[i] * gain;
  }
  return out;
}

/** Pauses longer than half a second become a quarter of a second. */
export function shortenPauses(samples, rate) {
  const levels = loudness(samples, rate);
  const threshold = speechThreshold(levels);
  const size = Math.max(1, Math.round(rate * WINDOW));
  const keep = Math.round(0.125 * rate);
  const parts = [];
  let from = 0, quietStart = -1;
  const flush = (q0, q1) => {
    // Keep 0.125 s at each side of a long pause.
    if ((q1 - q0) / rate > 0.5) {
      parts.push(samples.subarray(from, q0 + keep));
      from = q1 - keep;
    }
  };
  for (let w = 0; w <= levels.length; w++) {
    const quiet = w < levels.length && levels[w] <= threshold;
    if (quiet && quietStart < 0) quietStart = w * size;
    if (!quiet && quietStart >= 0) {
      flush(quietStart, Math.min(samples.length, w * size));
      quietStart = -1;
    }
  }
  parts.push(samples.subarray(from));
  const out = new Float32Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

export const FIXES = ['level', 'clear', 'quiet', 'pauses'];

/** Applies trimming and the chosen improvements in a sensible order. */
export function processAudio(samples, rate, { start = 0, end = samples.length / rate, level: lv, clear, quiet, pauses } = {}) {
  let out = slice(samples, rate, start, end);
  if (clear) out = clearVoice(out, rate);
  if (quiet) out = quietPauses(out, rate);
  if (pauses) out = shortenPauses(out, rate);
  if (lv) out = level(out, rate);
  return out;
}

/** 16-bit mono WAV. */
export function encodeWav(samples, rate) {
  const bytes = new Uint8Array(44 + samples.length * 2);
  const view = new DataView(bytes.buffer);
  const text = (at, s) => [...s].forEach((c, i) => view.setUint8(at + i, c.charCodeAt(0)));
  text(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  text(8, 'WAVE');
  text(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return bytes;
}

/** Highest level per column, for drawing the waveform. */
export function peaks(samples, columns) {
  const out = new Float32Array(columns);
  const per = samples.length / columns;
  for (let c = 0; c < columns; c++) {
    let max = 0;
    const end = Math.min(samples.length, Math.floor((c + 1) * per));
    for (let i = Math.floor(c * per); i < end; i++) max = Math.max(max, Math.abs(samples[i]));
    out[c] = max;
  }
  return out;
}
