import { test } from 'node:test';
import assert from 'node:assert/strict';
import { audibleRange, level, shortenPauses, quietPauses, clearVoice, processAudio, encodeWav, loudness } from '../src/lib/audio-edit.mjs';

const rate = 8000;
/** Silence, tone, silence … described as [seconds, amplitude] parts (with a little noise). */
function sound(parts) {
  const out = [];
  let seed = 1;
  const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5) * 0.004;
  for (const [seconds, amp] of parts)
    for (let i = 0; i < seconds * rate; i++) out.push(Math.sin((out.length / rate) * 2 * Math.PI * 300) * amp + noise());
  return Float32Array.from(out);
}
const rms = (s) => Math.sqrt(s.reduce((a, b) => a + b * b, 0) / s.length);

test('Stille am Anfang und Ende wird gefunden, Stille überall ergibt nichts', () => {
  const range = audibleRange(sound([[1, 0], [2, 0.3], [1.5, 0]]), rate);
  assert.ok(Math.abs(range.start - 0.9) < 0.05, `Anfang ${range.start}`);
  assert.ok(Math.abs(range.end - 3.15) < 0.05, `Ende ${range.end}`);
  assert.equal(audibleRange(sound([[2, 0]]), rate), null);
});

test('Lautstärke angleichen: leise und laute Aufnahmen landen etwa gleich laut, ohne Übersteuern', () => {
  const quiet = level(sound([[1, 0.02]]), rate), loud = level(sound([[1, 0.9]]), rate);
  assert.ok(Math.abs(rms(quiet) - rms(loud)) < 0.02, `${rms(quiet)} vs ${rms(loud)}`);
  assert.ok(Math.max(...loud.map(Math.abs)) <= 0.95 + 1e-6);
});

test('Lange Pausen werden auf eine Viertelsekunde gekürzt, kurze bleiben', () => {
  const long = shortenPauses(sound([[0.5, 0.3], [2, 0], [0.5, 0.3]]), rate);
  assert.ok(Math.abs(long.length / rate - 1.25) < 0.06, `${long.length / rate} s`);
  const short = shortenPauses(sound([[0.5, 0.3], [0.3, 0], [0.5, 0.3]]), rate);
  assert.equal(short.length, Math.round(1.3 * rate));
});

test('Rauschen in Pausen wird leiser, die Stimme bleibt; Brummen verschwindet', () => {
  const input = sound([[0.5, 0.3], [1, 0], [0.5, 0.3]]);
  const out = quietPauses(input, rate);
  const pause = (s) => rms(s.subarray(Math.round(0.8 * rate), Math.round(1.2 * rate)));
  assert.ok(pause(out) < pause(input) * 0.3);
  assert.ok(Math.abs(rms(out.subarray(0, 3000)) - rms(input.subarray(0, 3000))) < 0.01);
  const hum = Float32Array.from({ length: rate }, (_, i) => Math.sin((i / rate) * 2 * Math.PI * 40) * 0.3);
  assert.ok(rms(clearVoice(hum, rate).subarray(2000)) < 0.08);
});

test('Zuschneiden und WAV: richtige Länge und gültiger Dateikopf', () => {
  const out = processAudio(sound([[3, 0.3]]), rate, { start: 0.5, end: 2 });
  assert.equal(out.length, 1.5 * rate);
  const wav = encodeWav(out, rate);
  assert.equal(new TextDecoder().decode(wav.subarray(0, 4)), 'RIFF');
  assert.equal(new DataView(wav.buffer).getUint32(24, true), rate);
  assert.equal(wav.length, 44 + out.length * 2);
  assert.equal(loudness(new Float32Array(0), rate).length, 0);
});
