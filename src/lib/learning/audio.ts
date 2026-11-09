let context: AudioContext | null = null;
export function audioContext(): AudioContext {
  const Constructor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!Constructor)
    throw new Error('Dieser Browser unterstützt keine Klanginstrumente.');
  if (!context || context.state === 'closed') context = new Constructor();
  void context.resume();
  return context;
}
function synth(
  ctx: BaseAudioContext,
  frequency: number,
  duration: number,
  volume: number,
  instrument: string,
  at: number,
) {
  if (volume <= 0) return;
  const timbres: Record<
    string,
    { wave: OscillatorType; partial: number; strength: number; decay: number }
  > = {
    piano: { wave: 'sine', partial: 2, strength: 0.22, decay: 0.8 },
    xylophone: { wave: 'sine', partial: 3.9, strength: 0.35, decay: 0.3 },
    marimba: { wave: 'sine', partial: 4, strength: 0.12, decay: 0.5 },
    glockenspiel: { wave: 'sine', partial: 2.76, strength: 0.45, decay: 1.2 },
    musicbox: { wave: 'sine', partial: 3, strength: 0.2, decay: 1.1 },
    organ: { wave: 'triangle', partial: 2, strength: 0.3, decay: 1 },
    synth: { wave: 'sawtooth', partial: 1.005, strength: 0.15, decay: 0.6 },
    flute: { wave: 'sine', partial: 2, strength: 0.04, decay: 1 },
    tube: { wave: 'triangle', partial: 3, strength: 0.09, decay: 0.4 },
  };
  const t = timbres[instrument] || timbres.piano;
  for (const [ratio, strength] of [
    [1, 1],
    [t.partial, t.strength],
  ]) {
    const osc = ctx.createOscillator(),
      gain = ctx.createGain();
    osc.type = t.wave;
    osc.frequency.value = frequency * ratio;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.linearRampToValueAtTime(
      Math.min(0.7, volume) * strength,
      at + 0.01,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      at + Math.max(0.03, duration * t.decay),
    );
    osc.connect(gain).connect(ctx.destination);
    osc.start(at);
    osc.stop(at + Math.max(duration, duration * t.decay) + 0.02);
  }
}
export function tone(
  frequency: number,
  duration = 0.45,
  volume = 0.3,
  instrument = 'piano',
  when?: number,
) {
  const ctx = audioContext();
  synth(ctx, frequency, duration, volume, instrument, when ?? ctx.currentTime);
}
function percussion(
  ctx: BaseAudioContext,
  index: number,
  volume: number,
  at: number,
  kit = 'drumset',
) {
  if (volume <= 0) return;
  if (kit === 'pads' || kit === 'orff') {
    synth(
      ctx,
      [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25][index % 8],
      0.35,
      volume,
      kit === 'orff' ? 'xylophone' : 'synth',
      at,
    );
    return;
  }
  if (kit === 'hand' || kit === 'cajon' || index % 4 === 0) {
    const osc = ctx.createOscillator(),
      gain = ctx.createGain(),
      frequency =
        kit === 'hand'
          ? 170 + index * 33
          : kit === 'cajon'
            ? 90 + index * 24
            : 140;
    osc.frequency.setValueAtTime(frequency, at);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.4, at + 0.2);
    gain.gain.setValueAtTime(volume, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
    osc.connect(gain).connect(ctx.destination);
    osc.start(at);
    osc.stop(at + 0.3);
    if (kit === 'hand' || index % 2 === 0) return;
  }
  const length = index % 4 === 3 ? 0.6 : 0.18,
    buffer = ctx.createBuffer(
      1,
      Math.floor(ctx.sampleRate * length),
      ctx.sampleRate,
    ),
    samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++)
    samples[i] = (Math.random() * 2 - 1) * Math.exp((-i / samples.length) * 7);
  const source = ctx.createBufferSource(),
    filter = ctx.createBiquadFilter(),
    gain = ctx.createGain();
  source.buffer = buffer;
  filter.type = 'highpass';
  filter.frequency.value =
    index % 4 === 1 ? 1200 : index % 4 === 2 ? 5000 : 2400;
  gain.gain.value = volume;
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(at);
}
export function drum(
  index: number,
  volume = 0.35,
  when?: number,
  kit = 'drumset',
) {
  const ctx = audioContext();
  percussion(ctx, index, volume, when ?? ctx.currentTime, kit);
}
export async function rhythmWav(
  beats: boolean[][],
  bpm: number,
  volume = 0.3,
  kit = 'drumset',
) {
  const beat = 60 / Math.max(30, Math.min(240, bpm)) / 4,
    ctx = new OfflineAudioContext(1, Math.ceil((16 * beat + 1) * 22050), 22050);
  beats.slice(0, 8).forEach((row, r) =>
    row.slice(0, 16).forEach((on, col) => {
      if (on) percussion(ctx, r, volume, col * beat, kit);
    }),
  );
  return wavBlob(await ctx.startRendering());
}
export const soundEffects = {
  rain: 'Regen',
  wind: 'Wind',
  thunder: 'Donner',
  waves: 'Meer',
  birds: 'Vögel',
  steps: 'Schritte',
  knock: 'Klopfen',
  door: 'Tür',
  bell: 'Glocke',
  clock: 'Uhr',
  heart: 'Herzschlag',
  magic: 'Zauber',
  applause: 'Applaus',
  fire: 'Feuer',
} as const;
export async function effectWav(kind: keyof typeof soundEffects, seconds = 4) {
  const rate = 22050,
    ctx = new OfflineAudioContext(1, Math.ceil(seconds * rate), rate),
    buffer = ctx.createBuffer(1, Math.ceil(seconds * rate), rate),
    samples = buffer.getChannelData(0);
  let smooth = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate,
      noise = Math.random() * 2 - 1;
    smooth = 0.98 * smooth + 0.02 * noise;
    const fade = Math.min(1, t * 15, (seconds - t) * 8);
    let value = 0;
    if (kind === 'rain') value = noise * 0.18;
    if (kind === 'wind') value = smooth * 3 * (0.5 + 0.3 * Math.sin(t * 2));
    if (kind === 'thunder') value = smooth * 5 * Math.exp(-t * 1.5);
    if (kind === 'waves')
      value = noise * 0.25 * (0.5 + 0.5 * Math.sin(t * 1.5));
    if (kind === 'birds')
      value =
        Math.sin(2 * Math.PI * (1500 * t + 150 * Math.sin(t * 18))) *
        Math.max(0, Math.sin(t * 9)) ** 12 *
        0.2;
    if (
      kind === 'steps' ||
      kind === 'knock' ||
      kind === 'clock' ||
      kind === 'heart'
    ) {
      const interval = kind === 'clock' ? 1 : kind === 'heart' ? 0.8 : 0.5,
        phase = t % interval,
        second = kind === 'heart' ? (t + 0.16) % interval : 99;
      value =
        (noise * 0.4 +
          Math.sin(
            t *
              2 *
              Math.PI *
              (kind === 'heart' ? 65 : kind === 'clock' ? 1800 : 180),
          ) *
            0.5) *
        (Math.exp(-phase * 85) + Math.exp(-second * 85));
    }
    if (kind === 'door')
      value =
        Math.sin(2 * Math.PI * (100 * t + 10 * Math.sin(t * 8))) *
          0.2 *
          Math.sin((Math.PI * t) / seconds) ** 2 +
        (t > seconds - 0.1 ? noise * 0.4 : 0);
    if (kind === 'bell')
      value =
        (Math.sin(t * 2 * Math.PI * 660) +
          Math.sin(t * 2 * Math.PI * 1815) * 0.3) *
        Math.exp(-t * 1.5) *
        0.3;
    if (kind === 'magic')
      value =
        Math.sin(2 * Math.PI * (500 * t + 150 * t * t)) *
        0.25 *
        Math.sin((Math.PI * t) / seconds) ** 2;
    if (kind === 'applause')
      value =
        noise *
        0.3 *
        (0.4 + 0.6 * Math.abs(Math.sin(t * 47) * Math.sin(t * 29)));
    if (kind === 'fire')
      value = smooth + (Math.random() > 0.996 ? noise * 0.7 : 0);
    samples[i] = Math.max(-0.9, Math.min(0.9, value * fade));
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
  return wavBlob(await ctx.startRendering());
}
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob),
    a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export function wavBlob(buffer: AudioBuffer): Blob {
  const length = buffer.length,
    channels = Math.min(2, buffer.numberOfChannels),
    data = new ArrayBuffer(44 + length * channels * 2),
    view = new DataView(data);
  const text = (offset: number, s: string) =>
    Array.from(s).forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, 'RIFF');
  view.setUint32(4, 36 + length * channels * 2, true);
  text(8, 'WAVE');
  text(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  text(36, 'data');
  view.setUint32(40, length * channels * 2, true);
  for (let i = 0; i < length; i++)
    for (let c = 0; c < channels; c++) {
      const value = Math.max(-1, Math.min(1, buffer.getChannelData(c)[i]));
      view.setInt16(
        44 + (i * channels + c) * 2,
        value < 0 ? value * 32768 : value * 32767,
        true,
      );
    }
  return new Blob([data], { type: 'audio/wav' });
}
export async function notesWav(
  notes: { note: number; at: number; duration?: number }[],
  instrument = 'piano',
  volume = 0.3,
) {
  const end = Math.max(1, ...notes.map((n) => n.at + (n.duration || 0.5))),
    ctx = new OfflineAudioContext(
      1,
      Math.ceil(Math.min(180, end + 0.5) * 22050),
      22050,
    );
  for (const note of notes) {
    if (note.at < 0 || note.at >= 180) continue;
    synth(
      ctx,
      440 * Math.pow(2, (note.note - 69) / 12),
      note.duration || 0.5,
      volume,
      instrument,
      note.at,
    );
  }
  return wavBlob(await ctx.startRendering());
}
export async function mixAudio(
  tracks: { src: string; offset?: number; volume?: number }[],
) {
  const ctx = audioContext();
  const buffers = await Promise.all(
    tracks.slice(0, 12).map(async (track) => ({
      track,
      buffer: await ctx.decodeAudioData(
        await (await fetch(track.src)).arrayBuffer(),
      ),
    })),
  );
  const duration = Math.min(
    180,
    Math.max(
      1,
      ...buffers.map(
        ({ track, buffer }) => (track.offset || 0) + buffer.duration,
      ),
    ),
  );
  const offline = new OfflineAudioContext(
    2,
    Math.ceil(duration * 22050),
    22050,
  );
  for (const { track, buffer } of buffers) {
    const source = offline.createBufferSource(),
      gain = offline.createGain();
    source.buffer = buffer;
    gain.gain.value = Math.max(0, Math.min(1, track.volume ?? 1));
    source.connect(gain).connect(offline.destination);
    source.start(Math.max(0, track.offset || 0));
  }
  return wavBlob(await offline.startRendering());
}
