/* eslint-disable @next/next/no-img-element -- Inline reference artwork and authenticated audio. */
'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { musicPreset, type MusicItem } from '@/lib/learning/music';
import { decodeMusicConfig, encodeMusicConfig } from '@/lib/learning/music-settings';
import { registerMusic } from '@/lib/learning/music-runtime';
import { MUSIC_CSS, renderInstrument, renderDrums, renderMetronome, renderEcho, renderSequencer, renderNoteQuiz, renderFalling, renderStudio, renderTuner, renderKaraoke, musicCaptureStream, musicStop, studioEffects, studioMoods } from '@/lib/reference/music-runtime';
import { useLearning } from './Runtime';
import { CassetteRecorder } from './Cassette';

type Config = Record<string, unknown>;
const renderers: Record<string, (box: HTMLElement, item: Config, live: boolean, options: Config) => void> = {
  piano: (box, item, live) => renderInstrument(box, item, live, undefined), drums: renderDrums, metronome: renderMetronome,
  echo: renderEcho, sequencer: renderSequencer, notequiz: renderNoteQuiz, fall: renderFalling,
  hoerspiel: renderStudio, tuner: renderTuner, karaoke: renderKaraoke,
};
function assets(value: unknown, result: Record<string, { id: string; dataUrl: string }> = {}) {
  if (typeof value === 'string' && /^(?:\/api\/medien\/|data:(?:audio|image)\/|blob:|media\/)/.test(value)) result[value] = { id: value, dataUrl: value };
  else if (Array.isArray(value)) value.forEach(v => assets(v, result));
  else if (value && typeof value === 'object') Object.values(value).forEach(v => assets(v, result));
  return result;
}
function Control({ item, id, live }: { item: MusicItem; id: string; live: boolean }) {
  const box = useRef<HTMLDivElement>(null), key = JSON.stringify(item);
  useLayoutEffect(() => {
    if (box.current) renderers[item.kind || '']?.(box.current, { ...item, id, locked: live }, live, { assets: assets(item) });
    // The reference keeps playback when a response is saved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, id, live]);
  useEffect(() => {
    if (!live) return;
    const stop = () => musicStop(id), hidden = () => { if (document.hidden) stop(); };
    window.addEventListener('blur', stop); document.addEventListener('visibilitychange', hidden);
    return () => { stop(); window.removeEventListener('blur', stop); document.removeEventListener('visibilitychange', hidden); };
  }, [id, live]);
  return <div ref={box} className={`music-control lh-wg-${item.kind} ${live ? 'is-live' : ''}`} style={{ width: item.w, height: item.h }} />;
}

type Popup = { kind: string; at: number; index?: number };
export default function MusicTemplate({ element }: { element: PageElement }) {
  const runtime = useLearning(element), { interactive, state, update, uploadAudio, onRecord, onConfigure } = runtime;
  const preset = musicPreset(element.settings?.musicTemplate), root = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1), [popup, setPopup] = useState<Popup | null>(null), [notice, setNotice] = useState('');
  const config = decodeMusicConfig(state.musicConfig || element.settings?.musicConfig);
  const current = useRef({ config, update, interactive, uploadAudio });
  useLayoutEffect(() => { current.current = { config, update, interactive, uploadAudio }; });
  useLayoutEffect(() => {
    const node = root.current; if (!node) return;
    const measure = () => setScale(node.clientWidth / 1400);
    measure(); const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(node); window.addEventListener('resize', measure);
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  useEffect(() => registerMusic(element.id, {
    sequence: seq => { const c = current.current; c.update({ musicConfig: encodeMusicConfig({ ...c.config, seq }) }); },
    studio: hs => { const c = current.current; c.update({ musicConfig: encodeMusicConfig({ ...c.config, hs }) }); },
    add: (kind, at) => setPopup({ kind, at }),
    edit: index => setPopup({ kind: 'edit', at: 0, index }),
    record: track => setPopup({ kind: 'track', at: 0, index: track }),
    pad: index => setPopup({ kind: 'pad', at: 0, index }),
    karaokeTiming: timing => { const c = current.current; c.update({ musicConfig: encodeMusicConfig({ ...c.config, karaoke: { ...(c.config.karaoke as Config), timing, mode: 'auto' } }) }); },
    karaokeAudio: (take, timing) => { const c = current.current; if (!c.uploadAudio) return; void c.uploadAudio(element.id, take.blob).then(src => {
      const latest = current.current; latest.update({ musicConfig: encodeMusicConfig({ ...latest.config, karaoke: { ...(latest.config.karaoke as Config), audio: src, timing, mode: 'auto' } }), recordingSrc: src });
    }).catch(error => setNotice(error.message)); },
  }), [element.id]);
  if (!preset) return <p>Musikvorlage nicht gefunden.</p>;
  const main = preset.items.find(i => i.type === 'widget'), title = element.settings?.title || preset.title;
  function change(next: Config) { update({ musicConfig: encodeMusicConfig(next) }); }
  function addClip(values: Config) {
    const hs = (config.hs || { len: 60, clips: [] }) as { len: number; clips: Config[] };
    if (hs.clips.length >= 80) { setNotice('Das Hörspiel enthält bereits 80 Teile.'); return; }
    const start = Math.min(Math.max(0, popup?.at || 0), hs.len - 0.2);
    const dur = Math.min(Number(values.dur) || 4, hs.len - start);
    change({ ...config, hs: { ...hs, clips: [...hs.clips, { start, track: 2, label: '', vol: 1, ...values, dur }] } });
    setPopup(null);
  }
  async function saveAudio(file: Blob) {
    if (!uploadAudio) throw Error('Aufnahmen können hier nicht gespeichert werden.');
    const src = await uploadAudio(element.id, file);
    if (popup?.kind === 'pad') {
      const kit = config.kit as { pads: Config[] };
      change({ ...config, kit: { ...kit, pads: kit.pads.map((p, i) => i === popup.index ? { ...p, sound: src, label: p.label || 'Aufnahme' } : p) } }); setPopup(null);
    } else if (popup?.kind === 'track') {
      const seq = config.seq as { tracks: Config[] };
      change({ ...config, seq: { ...seq, tracks: seq.tracks.map((t, i) => i === popup.index ? { ...t, sound: src, label: 'Aufnahme' } : t) } }); setPopup(null);
    } else if (popup) {
      let dur = 4;
      try { const a = new Audio(src); await new Promise<void>(resolve => { a.onloadedmetadata = () => { if (Number.isFinite(a.duration)) dur = a.duration; resolve(); }; a.onerror = () => resolve(); }); } catch { /* Default clip duration. */ }
      addClip({ sound: src, label: 'Aufnahme', dur, track: popup.kind === 'music' ? 0 : 1 });
    } else update({ recordingSrc: src });
  }
  const recording = typeof state.recordingSrc === 'string' ? state.recordingSrc : undefined;
  const fileInput = <label className="knopf">Tondatei wählen<input type="file" aria-label="Tondatei wählen" accept="audio/*" className="visually-hidden" onChange={e => {
    const file = e.target.files?.[0]; if (file) void saveAudio(file).catch(error => setNotice(error.message)); e.target.value = '';
  }} /></label>;
  return <section ref={root} className={`music-template ${interactive ? 'is-live' : ''}`} aria-label={title} onPointerDown={event => { if (interactive) event.stopPropagation(); }}>
    <style>{MUSIC_CSS}</style>
    {onConfigure && <button type="button" className="music-settings-launch" aria-label={`${title} einstellen`} onPointerDown={event => event.stopPropagation()} onClick={() => { musicStop(element.id); preset.items.forEach((_, i) => musicStop(`${element.id}-${i}`)); onConfigure(element.id); }}>⚙ Einstellen</button>}
    <div className="music-stage" style={{ transform: `scale(${scale})`, background: preset.paper }} inert={!interactive}>
      <img className="music-backdrop" src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(preset.background)}`} alt="" draggable={false} />
      {preset.items.map((original, index) => {
        const isMain = original === main, item = isMain ? { ...original, ...config, kind: original.kind, w: original.w, h: original.h } as MusicItem : original.kind === 'metronome' ? { ...original, ...((config.musicMetronome || {}) as Config) } as MusicItem : original;
        const pos = { left: original.x, top: original.y, width: original.w, height: original.h };
        if (preset.id === 'playlist' && index > 2) return null;
        if (original.type === 'text') return <div key={index} className="music-reference-title" style={{ ...pos, fontSize: original.size, fontWeight: original.bold ? 800 : 400, color: original.color, fontFamily: 'Nunito, Andika, sans-serif' }}>{preset.id === 'playlist' ? (index === 1 ? title : String(config.description || original.placeholder)) : index === 0 && title !== preset.title ? title : preset.generator === 'instrument' && index === 0 ? ({ piano: 'Klavier', xylophone: 'Xylophon', glockenspiel: 'Glockenspiel', tubes: 'Klangrohre', synth: 'Synthesizer' }[String((config.inst as Config)?.skin)] || original.html) : original.html || original.placeholder}</div>;
        if (item.kind === 'recorder') return <div key={index} className="music-cassette-slot" style={pos}>
          <div style={{ width: 680, height: 340, transform: `scale(${original.w / 680})`, transformOrigin: 'top left' }}>
            <CassetteRecorder key={recording} title={title} src={recording} interactive={interactive} capture={original.mic ? undefined : musicCaptureStream}
              onSave={uploadAudio ? saveAudio : undefined} onOpen={onRecord ? () => onRecord(element.id) : undefined} />
          </div>
        </div>;
        if (item.type === 'widget') return <div key={index} className="music-control-slot" style={pos}><Control id={isMain ? element.id : `${element.id}-${index}`} item={item} live={interactive} /></div>;
        return null;
      })}
      {preset.id === 'playlist' && <div className="music-playlist">
        <div className="music-playlist-cover">{(config.cover as { image?: string } | undefined)?.image ? <img src={String((config.cover as { image: string }).image)} alt="Cover" /> : <span>♫</span>}</div>
        {(element.settings?.tracks?.length ? element.settings.tracks : Array.from({ length: 8 }, () => ({ title: 'Titel – Interpret', src: undefined }))).map((track, i) => <div className="music-playlist-track" key={i} style={{ top: 90 + i * 108 }}>
          {track.src ? <audio src={track.src} controls preload="none" aria-label={track.title} /> : <span className="music-playlist-play">▶</span>}<span>{track.title}</span>
        </div>)}
      </div>}
      {notice && !popup && <p className="music-notice" role="status">{notice}</p>}
      {popup && <div className="music-popup" role="dialog" aria-label="Klang bearbeiten">
        <button type="button" className="music-popup-close" onClick={() => setPopup(null)}>Schließen</button>
        {popup.kind === 'fx' && <><h3>Geräusch wählen</h3><div className="music-sound-grid">{(studioEffects as { id: string; label: string; dur: number }[]).map(fx => <button type="button" key={fx.id} onClick={() => addClip({ fx: fx.id, label: fx.label, dur: fx.dur, track: 2 })}>{fx.label}</button>)}</div></>}
        {popup.kind === 'music' && <><h3>Musik wählen</h3><div className="music-sound-grid">{(studioMoods as { id: string; label: string }[]).map(mood => <button type="button" key={mood.id} onClick={() => addClip({ mood: mood.id, label: mood.label, dur: 12, track: 0 })}>{mood.label}</button>)}</div>{fileInput}</>}
        {['rec', 'track', 'pad'].includes(popup.kind) && <><h3>Aufnehmen oder Tondatei wählen</h3><div className="music-popup-recorder"><CassetteRecorder title="Neue Aufnahme" interactive={interactive} onSave={uploadAudio ? saveAudio : undefined} /></div>{fileInput}</>}
        {popup.kind === 'edit' && (() => {
          const hs = config.hs as { len: number; clips: Config[] }, clip = hs.clips[popup.index!]; if (!clip) return null;
          const edit = (patch: Config) => change({ ...config, hs: { ...hs, clips: hs.clips.map((c, i) => i === popup.index ? { ...c, ...patch } : c) } });
          return <><h3>Klang bearbeiten</h3><label>Name<input value={String(clip.label || '')} maxLength={30} onChange={e => edit({ label: e.target.value })} /></label>
            <label>Beginn (Sekunden)<input type="number" min={0} max={hs.len - Number(clip.dur)} step={0.25} value={Number(clip.start)} onChange={e => edit({ start: Math.max(0, Math.min(hs.len - Number(clip.dur), Number(e.target.value))) })} /></label>
            <label>Dauer (Sekunden)<input type="number" min={0.2} max={hs.len - Number(clip.start)} step={0.25} value={Number(clip.dur)} onChange={e => edit({ dur: Math.max(0.2, Math.min(hs.len - Number(clip.start), Number(e.target.value))) })} /></label>
            <label>Lautstärke<input type="range" min={0} max={2} step={0.1} value={Number(clip.vol)} onChange={e => edit({ vol: Number(e.target.value) })} /></label>
            <button type="button" onClick={() => { change({ ...config, hs: { ...hs, clips: hs.clips.filter((_, i) => i !== popup.index) } }); setPopup(null); }}>Klang löschen</button></>;
        })()}
        {notice && <p role="alert">{notice}</p>}
      </div>}
    </div>
  </section>;
}
