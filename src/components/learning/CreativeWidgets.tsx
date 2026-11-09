/* eslint-disable @next/next/no-img-element -- Stored school media use authenticated URLs. */
'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { animationPose } from '@/lib/learning/algorithms';
import { downloadBlob, audioContext } from '@/lib/learning/audio';
import { useLearning } from './Runtime';
export default function CreativeWidgets({
  element: el,
}: {
  element: PageElement;
}) {
  const { state, update, interactive } = useLearning(el),
    c = el.settings || {},
    kind = el.widgetKind;
  const [playing, setPlaying] = useState(false),
    [phase, setPhase] = useState(0),
    [notice, setNotice] = useState(''),
    [exporting, setExporting] = useState(false);
  const alive = useRef(true),
    sources = useRef<AudioBufferSourceNode[]>([]),
    videoRecorder = useRef<MediaRecorder | null>(null),
    videoStream = useRef<MediaStream | null>(null);
  const map = useRef<SVGSVGElement>(null),
    recordTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const slides = useMemo(
      () =>
        c.slides?.length
          ? c.slides
          : [
              {
                title: 'Meine Geschichte',
                text: 'Gestalte deine Folien im Einstellungsfenster.',
                seconds: 5,
              },
            ],
      [c.slides],
    ),
    frames = c.frames?.length
      ? c.frames
      : [
          { text: 'Los!', symbol: '●', x: 15, y: 50, color: '#52796f' },
          { text: 'Ziel!', symbol: '●', x: 85, y: 50, color: '#52796f' },
        ],
    index = Math.max(0, Math.min(slides.length - 1, Number(state.index) || 0));
  useEffect(() => {
    if (!playing || !interactive) return;
    if (kind === 'slideshow') {
      const timer = setTimeout(
        () => {
          if (index + 1 < slides.length) update({ index: index + 1 });
          else if (c.repeat) update({ index: 0 });
          else setPlaying(false);
        },
        Math.max(1, slides[index].seconds || 5) * 1000,
      );
      return () => clearTimeout(timer);
    }
    if (kind === 'animation') {
      const start = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const p = (now - start) / (Math.max(1, c.seconds || 3) * 1000);
        if (p >= 1 && !c.repeat) {
          setPhase(1);
          setPlaying(false);
          return;
        }
        setPhase(p % 1);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }
  }, [playing, interactive, kind, index, slides, c.repeat, c.seconds, update]);
  useEffect(() => {
    alive.current = true;
    const timers = recordTimers.current,
      heldSources = sources.current;
    return () => {
      alive.current = false;
      timers.forEach(clearTimeout);
      heldSources.forEach((source) => {
        try {
          source.stop();
        } catch {}
      });
      if (videoRecorder.current) {
        videoRecorder.current.onstop = null;
        if (videoRecorder.current.state === 'recording')
          videoRecorder.current.stop();
      }
      videoStream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  useEffect(() => {
    if (!playing && !exporting)
      sources.current.forEach((source) => {
        try {
          source.stop();
        } catch {}
      });
  }, [playing, exporting]);
  async function soundtrack(destination?: AudioNode) {
    const ctx = audioContext(),
      tracks = (c.tracks || []).filter((t) => t.src),
      decoded = await Promise.all(
        tracks.map(async (track) => ({
          track,
          buffer: await ctx.decodeAudioData(
            await (await fetch(track.src!)).arrayBuffer(),
          ),
        })),
      );
    return () => {
      if (!alive.current) return;
      const start = ctx.currentTime + 0.02,
        end = start + Math.max(1, Math.min(180, c.seconds || 3));
      for (const { track, buffer } of decoded) {
        const at = start + (track.offset || 0);
        if (at >= end) continue;
        const source = ctx.createBufferSource(),
          gain = ctx.createGain();
        source.buffer = buffer;
        gain.gain.value = track.volume ?? 1;
        source.connect(gain).connect(destination || ctx.destination);
        source.start(at);
        source.stop(end);
        sources.current.push(source);
      }
    };
  }

  const actors = [
    {
      symbol: '●',
      color: '#52796f',
      image: undefined as string | undefined,
      frames,
    },
    ...(c.actors || []),
  ];
  const animated = animationPose(frames, phase, c.mode);
  let content: React.ReactNode;
  if (kind === 'slideshow') {
    const slide = slides[index];
    content = (
      <>
        <div
          className={`slideshow transition-${c.transition || 'fade'} slide-text-${c.mode || 'center'}`}
          key={index}
          style={{
            background: c.background?.startsWith('#')
              ? c.background
              : '#f4f5eb',
          }}
        >
          {slide.image && <img src={slide.image} alt="" />}
          <div>
            <h3>{slide.title}</h3>
            <p>{slide.text}</p>
          </div>
          {slide.audio && <audio controls src={slide.audio} />}
        </div>
        <div className="learning-actions">
          <button
            disabled={!interactive || index === 0}
            onClick={() => update({ index: index - 1 })}
          >
            ‹
          </button>
          <span>
            {index + 1} / {slides.length}
          </span>
          <button
            disabled={!interactive || exporting}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? 'Pause' : '▷ Automatisch'}
          </button>
          <button
            disabled={!interactive || index >= slides.length - 1}
            onClick={() => update({ index: index + 1 })}
          >
            ›
          </button>
        </div>
      </>
    );
  } else if (kind === 'animation')
    content = (
      <>
        <svg
          className="animation-stage"
          viewBox="0 0 200 110"
          style={{
            background: c.background?.startsWith('#')
              ? c.background
              : '#f1f5e9',
          }}
        >
          {actors.map((actor, i) => {
            const pose = animationPose(actor.frames, phase, c.mode);
            return (
              <g
                key={i}
                opacity={pose.opacity}
                transform={`translate(${pose.x * 2} ${pose.y}) rotate(${pose.angle}) scale(${pose.scale})`}
              >
                {actor.image ? (
                  <image
                    href={actor.image}
                    x="-13"
                    y="-13"
                    width="26"
                    height="26"
                    preserveAspectRatio="xMidYMid meet"
                  />
                ) : (
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="26"
                    fill={i === 0 ? pose.color : actor.color}
                  >
                    {i === 0 ? pose.symbol : actor.symbol}
                  </text>
                )}
              </g>
            );
          })}
          <text x="100" y="103" textAnchor="middle" fontSize="8">
            {animated.text}
          </text>
        </svg>
        <input
          aria-label="Animationsposition"
          disabled={!interactive || exporting}
          type="range"
          min="0"
          max="1"
          step=".01"
          value={phase}
          onChange={(e) => {
            setPlaying(false);
            setPhase(Number(e.target.value));
          }}
        />
        <div className="learning-actions">
          <button
            disabled={!interactive || exporting}
            onClick={async () => {
              if (playing) {
                setPlaying(false);
                return;
              }
              try {
                if (c.tracks?.some((t) => t.src)) (await soundtrack())();
                setPhase(0);
                setPlaying(true);
              } catch {
                setNotice('Die Tonspur konnte nicht geladen werden.');
              }
            }}
          >
            {playing ? 'Stop' : '▷ Abspielen'}
          </button>
          <button
            disabled={!interactive || exporting}
            onClick={async () => {
              if (typeof MediaRecorder === 'undefined') {
                setNotice(
                  'Für Videoaufnahmen bitte einen Browser mit MediaRecorder verwenden.',
                );
                return;
              }
              const sound = c.tracks?.some((t) => t.src)
                ? audioContext().createMediaStreamDestination()
                : null;
              let beginSound: (() => void) | undefined;
              try {
                if (sound) beginSound = await soundtrack(sound);
              } catch {
                setNotice('Die Tonspur konnte nicht geladen werden.');
                return;
              }
              const images = await Promise.all(
                actors.map((actor) =>
                  actor.image
                    ? new Promise<HTMLImageElement | null>((resolve) => {
                        const image = new Image();
                        image.onload = () => resolve(image);
                        image.onerror = () => resolve(null);
                        image.src = actor.image!;
                      })
                    : Promise.resolve(null),
                ),
              );
              if (!alive.current) return;
              const canvas = document.createElement('canvas');
              canvas.width = 800;
              canvas.height = 440;
              const ctx = canvas.getContext('2d')!;
              const stream = canvas.captureStream(25);
              if (sound)
                sound.stream
                  .getAudioTracks()
                  .forEach((track) => stream.addTrack(track));
              videoStream.current = stream;
              const rec = new MediaRecorder(stream),
                chunks: Blob[] = [];
              videoRecorder.current = rec;
              rec.ondataavailable = (e) => {
                if (e.data.size) chunks.push(e.data);
              };
              rec.onstop = () => {
                downloadBlob(
                  new Blob(chunks, { type: rec.mimeType }),
                  'animation.' +
                    (rec.mimeType.includes('mp4') ? 'mp4' : 'webm'),
                );
                stream.getTracks().forEach((t) => t.stop());
                sources.current.forEach((source) => {
                  try {
                    source.stop();
                  } catch {}
                });
                setExporting(false);
                setNotice('Video ist fertig.');
              };
              const start = performance.now(),
                duration = Math.max(1, Math.min(180, c.seconds || 3)) * 1000;
              const draw = () => {
                const phase = Math.min(
                  1,
                  (performance.now() - start) / duration,
                );
                ctx.fillStyle = c.background?.startsWith('#')
                  ? c.background
                  : '#f1f5e9';
                ctx.fillRect(0, 0, 800, 440);
                actors.forEach((actor, i) => {
                  const pose = animationPose(actor.frames, phase, c.mode);
                  ctx.save();
                  ctx.translate(pose.x * 8, pose.y * 4);
                  ctx.rotate((pose.angle * Math.PI) / 180);
                  ctx.scale(pose.scale, pose.scale);
                  ctx.globalAlpha = Math.max(0, Math.min(1, pose.opacity));
                  ctx.fillStyle = i === 0 ? pose.color : actor.color;
                  ctx.font = '104px sans-serif';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  if (images[i]) ctx.drawImage(images[i]!, -52, -52, 104, 104);
                  else ctx.fillText(i === 0 ? pose.symbol : actor.symbol, 0, 0);
                  ctx.restore();
                });
                ctx.fillStyle = '#35543c';
                ctx.font = '28px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(
                  animationPose(frames, phase, c.mode).text,
                  400,
                  415,
                );
                if (phase < 1) recordTimers.current.push(setTimeout(draw, 40));
                else rec.stop();
              };
              draw();
              rec.start();
              beginSound?.();
              setExporting(true);
              setNotice('Video wird aufgenommen …');
            }}
          >
            Video speichern
          </button>
        </div>
      </>
    );
  else if (kind === 'map') {
    const points = c.points || [],
      path = Array.isArray(state.path)
        ? (state.path as unknown as { x: number; y: number }[])
        : [],
      distance =
        path
          .slice(1)
          .reduce(
            (sum, p, i) => sum + Math.hypot(p.x - path[i].x, p.y - path[i].y),
            0,
          ) * (c.maximum || 10);
    content = (
      <>
        <svg
          ref={map}
          className="map-stage"
          viewBox="0 0 200 140"
          onPointerDown={(e) => {
            if (!interactive) return;
            const box = e.currentTarget.getBoundingClientRect();
            const p = {
              x: Math.round(((e.clientX - box.left) / box.width) * 200),
              y: Math.round(((e.clientY - box.top) / box.height) * 140),
            };
            update({ path: [...path, p].slice(-100).map((p) => ({ ...p })) });
          }}
        >
          <rect width="200" height="140" fill="#eaf0dc" />
          {(c.background?.startsWith('/api/medien/') ||
            c.background?.startsWith('data:image/')) && (
            <image
              href={c.background}
              width="200"
              height="140"
              preserveAspectRatio="xMidYMid slice"
            />
          )}
          {[20, 60, 100, 140, 180].map((x) => (
            <path
              key={x}
              d={`M${x} 0V140M0 ${x / 1.5}H200`}
              stroke="#fff"
              strokeWidth="5"
            />
          ))}
          <path
            d="M0 90 Q70 20 110 105T200 70"
            fill="none"
            stroke="#b0d1e2"
            strokeWidth="8"
          />
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x * 2}
                cy={point.y * 1.4}
                r="4"
                fill="#b85e59"
              />
              <text x={point.x * 2 + 5} y={point.y * 1.4 - 3} fontSize="7">
                {point.label}
              </text>
            </g>
          ))}
          <polyline
            points={path.map((p) => `${p.x},${p.y}`).join(' ')}
            stroke="#466d9b"
            strokeWidth="2"
            fill="none"
          />
          {path.map((p, i) => (
            <circle cx={p.x} cy={p.y} r="2" fill="#466d9b" key={i} />
          ))}
        </svg>
        <p>Tippe Wegpunkte an. Strecke: {Math.round(distance)} m</p>
        <div className="learning-actions">
          <button
            disabled={!interactive || exporting}
            onClick={() => update({ path: [] })}
          >
            Weg löschen
          </button>
          <button
            disabled={!interactive || exporting}
            onClick={() => {
              if (map.current)
                downloadBlob(
                  new Blob(
                    [new XMLSerializer().serializeToString(map.current)],
                    { type: 'image/svg+xml' },
                  ),
                  'karte.svg',
                );
            }}
          >
            Karte speichern
          </button>
        </div>
      </>
    );
  }
  return (
    <section
      className="learning-widget"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <header>
        <strong>{c.title || 'Gestalten'}</strong>
      </header>
      <div className="learning-content">{content}</div>
      {notice && <p role="status">{notice}</p>}
    </section>
  );
}
