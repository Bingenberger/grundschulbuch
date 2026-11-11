'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FIXES, RATE, audibleRange, encodeWav, peaks, processAudio, type Fix } from '@/lib/audio-edit.mjs';
import Icon from './Icon';
import { ChoiceButton, OptionGroup } from './ui/Choice';

const MAX_EDIT_SECONDS = 600;
/** WAV at 22 kHz: the server takes 20 MB, that is about seven and a half minutes. */
const MAX_SAVE_SECONDS = 450;

const fixInfo: Record<Fix, [string, string]> = {
  level: ['Lautstärke angleichen', 'Leise Aufnahmen werden lauter, sehr laute leiser – so klingen alle Töne etwa gleich laut.'],
  clear: ['Stimme klarer', 'Brummen weg, Sprache deutlicher und gleichmäßiger.'],
  quiet: ['Rauschen in Pausen leiser', 'Zwischen den Wörtern wird das Rauschen und Brummen des Raums leiser.'],
  pauses: ['Lange Pausen kürzen', 'Pausen über einer halben Sekunde werden auf eine Viertelsekunde gekürzt.'],
};
const fixIcons: Record<Fix, string> = { level: '⇕', clear: '✦', quiet: '∿', pauses: '⇥' };

const clock = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;

async function decode(source: Blob): Promise<Float32Array> {
  const context = new OfflineAudioContext(1, 1, RATE);
  const buffer = await context.decodeAudioData(await source.arrayBuffer());
  const out = new Float32Array(buffer.length);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < out.length; i++) out[i] += data[i] / buffer.numberOfChannels;
  }
  return out;
}

/**
 * Trimming (waveform with two handles, “Stille entfernen”) and “Klang
 * verbessern”. Saves the original file when nothing was changed, else a WAV.
 */
export default function AudioEditor({
  source,
  title,
  busy,
  saveLabel = 'Übernehmen',
  extra,
  onSave,
}: {
  source: Blob;
  title: string;
  busy: boolean;
  saveLabel?: string;
  /** Further buttons left of “Übernehmen” (e.g. “Neu aufnehmen”). */
  extra?: React.ReactNode;
  onSave: (file: Blob, title: string) => void;
}) {
  const [samples, setSamples] = useState<Float32Array | null>(null);
  const [state, setState] = useState<'decoding' | 'ready' | 'failed' | 'toolong'>('decoding');
  const [range, setRange] = useState({ start: 0, end: 0 });
  const [fixes, setFixes] = useState<Partial<Record<Fix, boolean>>>({});
  const [name, setName] = useState(title);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [playhead, setPlayhead] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const wave = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ handle: 'start' | 'end'; id: number } | null>(null);
  const player = useRef<{ context: AudioContext; node: AudioBufferSourceNode; frame: number } | null>(null);
  const duration = samples ? samples.length / RATE : 0;

  useEffect(() => {
    let stopped = false;
    decode(source).then(
      (data) => {
        if (stopped) return;
        if (data.length / RATE > MAX_EDIT_SECONDS) return setState('toolong');
        setSamples(data);
        setRange({ start: 0, end: data.length / RATE });
        setState('ready');
      },
      () => !stopped && setState('failed'),
    );
    return () => {
      stopped = true;
    };
  }, [source]);

  const stop = () => {
    const p = player.current;
    if (!p) return;
    player.current = null;
    cancelAnimationFrame(p.frame);
    p.node.onended = null;
    try {
      p.node.stop();
    } catch {}
    void p.context.close().catch(() => undefined);
    setPlayhead(null);
    setPlaying(false);
  };
  useEffect(() => () => stop(), []);

  // Waveform: grey outside the chosen part.
  const columns = useMemo(() => (samples ? peaks(samples, 600) : null), [samples]);
  useEffect(() => {
    const c = canvas.current;
    if (!c || !columns) return;
    const width = c.clientWidth * devicePixelRatio, height = c.clientHeight * devicePixelRatio;
    c.width = width;
    c.height = height;
    const g = c.getContext('2d')!;
    g.clearRect(0, 0, width, height);
    const max = Math.max(...columns, 0.01);
    const bar = width / columns.length;
    columns.forEach((p, i) => {
      const t = ((i + 0.5) / columns.length) * duration;
      g.fillStyle = t >= range.start && t <= range.end ? '#1e88e5' : '#b0bec5';
      const h = Math.max(1, (p / max) * height * 0.9);
      g.fillRect(i * bar, (height - h) / 2, Math.max(1, bar - 0.5), h);
    });
  }, [columns, range, duration]);

  const changed = range.start > 0.01 || range.end < duration - 0.01 || FIXES.some((f) => fixes[f]);
  const length = range.end - range.start;

  function setEdge(handle: 'start' | 'end', t: number) {
    stop();
    setNote('');
    setRange((r) =>
      handle === 'start'
        ? { ...r, start: Math.max(0, Math.min(r.end - 0.1, t)) }
        : { ...r, end: Math.min(duration, Math.max(r.start + 0.1, t)) },
    );
  }
  const timeAt = (clientX: number) => {
    const rect = wave.current!.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * duration;
  };

  function play() {
    if (player.current) return stop();
    if (!samples) return;
    const out = processAudio(samples, RATE, { ...range, ...fixes });
    const context = new AudioContext();
    const buffer = context.createBuffer(1, out.length, RATE);
    buffer.copyToChannel(out as Float32Array<ArrayBuffer>, 0);
    const node = context.createBufferSource();
    node.buffer = buffer;
    node.connect(context.destination);
    const began = context.currentTime;
    const total = out.length / RATE;
    const tick = () => {
      if (!player.current) return;
      const t = context.currentTime - began;
      // The playhead follows the original timeline only when nothing shortens pauses.
      setPlayhead(fixes.pauses ? null : range.start + Math.min(t, total));
      player.current.frame = requestAnimationFrame(tick);
    };
    node.onended = stop;
    node.start();
    player.current = { context, node, frame: requestAnimationFrame(tick) };
    setPlaying(true);
  }

  function save() {
    stop();
    setError('');
    if (!changed) return onSave(source, name.trim() || title);
    if (!samples) return;
    const out = processAudio(samples, RATE, { ...range, ...fixes });
    if (out.length / RATE > MAX_SAVE_SECONDS)
      return setError('Bearbeitete Töne dürfen höchstens 7½ Minuten lang sein. Bitte einen kürzeren Teil wählen.');
    onSave(new Blob([encodeWav(out, RATE) as Uint8Array<ArrayBuffer>], { type: 'audio/wav' }), name.trim() || title);
  }

  const pct = (t: number) => `${duration ? (t / duration) * 100 : 0}%`;
  return (
    <div className="audio-editor">
      {state === 'decoding' && <p className="image-tab-intro">Wellenform wird erstellt …</p>}
      {(state === 'failed' || state === 'toolong') && (
        <p className="image-tab-intro">
          {state === 'toolong'
            ? 'Zum Bearbeiten ist der Ton zu lang (über 10 Minuten). Du kannst ihn aber unverändert übernehmen.'
            : 'Diese Tondatei kann hier nicht bearbeitet werden. Du kannst sie aber unverändert übernehmen.'}
        </p>
      )}
      {state === 'ready' && (
        <>
          <p className="image-tab-note">Ziehe die Griffe, um Anfang und Ende festzulegen. Nur der blaue Teil wird übernommen.</p>
          <div
            className="audio-wave"
            ref={wave}
            onPointerDown={(e) => {
              if (busy) return;
              const t = timeAt(e.clientX);
              const target = (e.target as HTMLElement).dataset.handle as 'start' | 'end' | undefined;
              const handle = target || (Math.abs(t - range.start) <= Math.abs(t - range.end) ? 'start' : 'end');
              drag.current = { handle, id: e.pointerId };
              e.currentTarget.setPointerCapture(e.pointerId);
              if (!target) setEdge(handle, t);
            }}
            onPointerMove={(e) => {
              if (drag.current?.id === e.pointerId) setEdge(drag.current.handle, timeAt(e.clientX));
            }}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
          >
            <canvas ref={canvas} aria-hidden="true" />
            <div className="audio-shade" style={{ left: 0, width: pct(range.start) }} />
            <div className="audio-shade" style={{ left: pct(range.end), right: 0 }} />
            {playhead !== null && <div className="audio-playhead" style={{ left: pct(playhead) }} />}
            {(['start', 'end'] as const).map((handle) => (
              <div
                key={handle}
                className={`audio-handle ${handle}`}
                data-handle={handle}
                style={{ left: pct(range[handle]) }}
                role="slider"
                tabIndex={0}
                aria-label={handle === 'start' ? 'Anfang' : 'Ende'}
                aria-valuemin={0}
                aria-valuemax={Math.round(duration * 10) / 10}
                aria-valuenow={Math.round(range[handle] * 10) / 10}
                aria-valuetext={clock(range[handle])}
                onKeyDown={(e) => {
                  const step = e.shiftKey ? 1 : 0.1;
                  const delta = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step } as Record<string, number>;
                  if (e.key in delta) {
                    e.preventDefault();
                    setEdge(handle, range[handle] + delta[e.key]);
                  }
                }}
              />
            ))}
          </div>
          <div className="audio-times">
            <span>Anfang {clock(range.start)}</span>
            <strong>Länge {clock(length)}</strong>
            <span>Ende {clock(range.end)}</span>
          </div>
          <div className="audio-edit-actions">
            <ChoiceButton icon={<span className="font-glyph">{playing ? '■' : '▶'}</span>} label={playing ? 'Stopp' : 'Anhören'} disabled={busy} onClick={play} />
            <ChoiceButton
              icon="zuschneiden"
              label="Stille entfernen"
              disabled={busy}
              onClick={() => {
                stop();
                const found = samples && audibleRange(samples, RATE);
                if (!found) return setNote('Hier wurde nichts deutlich Hörbares gefunden – der Ton ist überall sehr leise.');
                if (found.start < 0.05 && found.end > duration - 0.05) return setNote('Am Anfang und am Ende wurde keine Stille gefunden.');
                setRange(found);
                setNote(`Stille entfernt – der Ton ist jetzt ${clock(found.end - found.start)} lang.`);
              }}
            />
            <ChoiceButton
              icon="synchronize"
              label="Alles"
              disabled={busy || !changed}
              onClick={() => {
                stop();
                setRange({ start: 0, end: duration });
                setNote('');
              }}
            />
            {note && <span className="editor-hint" role="status">{note}</span>}
          </div>
          <OptionGroup label="Klang verbessern">
            {FIXES.map((fix) => (
              <ChoiceButton
                key={fix}
                icon={<span className="font-glyph">{fixIcons[fix]}</span>}
                label={fixInfo[fix][0]}
                title={fixInfo[fix][1]}
                pressed={!!fixes[fix]}
                disabled={busy}
                onClick={() => {
                  stop();
                  setFixes({ ...fixes, [fix]: !fixes[fix] });
                }}
              />
            ))}
          </OptionGroup>
        </>
      )}
      <label className="property-label">
        Name
        <input className="option-input" value={name} maxLength={120} onChange={(e) => setName(e.target.value)} />
      </label>
      {error && <p className="fehler" role="alert">{error}</p>}
      <div className="audio-actions">
        <span>{extra}</span>
        <button type="button" className="knopf knopf-haupt" disabled={busy || state === 'decoding'} onClick={save}>
          <Icon name="ok" size={20} /> {busy ? 'Wird gespeichert …' : saveLabel}
        </button>
      </div>
    </div>
  );
}
