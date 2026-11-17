/* eslint-disable @next/next/no-img-element -- School media and static previews. */
'use client';
// Settings of the Erklärbär (Textsachen, Lernsachen.blog), built after its
// editor but with our controls: scenes, look, voice (computer voice or own
// recordings per sentence), music – and a preview that can be saved as a video.
import { useEffect, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { EXPLAIN_DESIGNS, EXPLAIN_MUSIC, type ExplainSettings, type TsConfig } from '@/lib/learning/textsachen';
import { explainScenes, explainSentences } from '@/lib/learning/erklaerbaer';
import Icon from '../Icon';
import { Chips, Slider, Toggle } from '../sheets/SheetParts';
import { LearningRuntime } from './Runtime';
import TextsachenFrame from './TextsachenFrame';

type Props = {
  c: TsConfig;
  title: string;
  set: (next: Partial<TsConfig>) => void;
  upload: (file: File, done: (src: string) => void) => Promise<void>;
  busy: boolean;
  Part: (p: { title: string; children: React.ReactNode }) => React.ReactNode;
};

const short = (text: string, n: number) => (text.length > n ? text.slice(0, n - 2) + ' …' : text);
const RECORD_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];

export default function ExplainOptions({ c, title, set, upload, busy, Part }: Props) {
  const e = c.settings.explain;
  const explain = (next: Partial<ExplainSettings>) => set({ settings: { ...c.settings, explain: { ...e, ...next } } });
  const scenes = explainScenes(c);
  const pictured = c.pictures.length;
  const musicFile = useRef<HTMLInputElement>(null);

  const chooseMusic = (file?: File) => {
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) { window.alert('Die Musikdatei ist zu groß (höchstens 12 MB).'); return; }
    void upload(file, (src) => explain({ music: 'own', audio: src, musicName: file.name }));
  };

  return (
    <>
      <Part title="Szenen">
        {!pictured && <p className="option-hint">Noch keine Bildwörter – ohne Bilder zeigt der Film nur den Text. Bildwörter oben im Text antippen.</p>}
        <Toggle checked={e.autoScenes} label="Szenen auch automatisch wechseln" hint={e.autoScenes ? 'Eine leere Zeile im Text beginnt immer eine neue Szene. Dazu wird nach mindestens drei Bildern umgeblättert.' : 'Nur eine leere Zeile im Text beginnt eine neue Szene – so steht z. B. ein Satz mit seinem Bild allein auf dem Blatt.'} onChange={(v) => explain({ autoScenes: v })} />
        {scenes.length > 0 && (
          <>
            <p className="option-hint">{scenes.length === 1 ? 'Der Film hat eine Szene.' : `Der Film hat ${scenes.length} Szenen.`} Auf ein Blatt kommen höchstens 6 Bilder – bringt ein Satz mehr, beginnt mit ihm die nächste Szene.</p>
            <ol className="ex-scenes" aria-label="Szenen des Films">
              {scenes.map((scene, i) => (
                <li key={i}>
                  <span className="ex-scene-number">{i + 1}</span>
                  <span className="ex-scene-pictures">
                    {scene.pictures.length ? scene.pictures.map((p) => <img key={p.word} src={p.image} alt={p.word} title={p.word} width={30} height={30} />) : <em>ohne Bild</em>}
                  </span>
                  <span className="ex-scene-text">
                    {short(scene.sentences[0].text, 70)}
                    {scene.sentences.length > 1 && <small> + {scene.sentences.length - 1} {scene.sentences.length === 2 ? 'Satz' : 'Sätze'}</small>}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </Part>

      <Part title="Aussehen">
        <div className="receipt-option">
          <strong>Hintergrund</strong>
          <div className="ex-backs" role="radiogroup" aria-label="Hintergrund">
            {EXPLAIN_DESIGNS.map((d) => (
              <button key={d.id} type="button" role="radio" aria-checked={e.design === d.id} className={`ex-back${e.design === d.id ? ' is-active' : ''}`} onClick={() => explain({ design: d.id })}>
                <img src={`/previews/erklaerbaer/${d.id}.jpg`} alt="" width={256} height={144} loading="lazy" />
                <span>{d.label}</span>
              </button>
            ))}
          </div>
        </div>
        <Toggle checked={e.subtitles} label="Untertitel" hint="Der Satz steht unten, das gesprochene Wort ist markiert." onChange={(v) => explain({ subtitles: v })} />
        {e.subtitles && <div className="ex-sub"><Toggle checked={e.sylSubs} label="Silben rot und blau" hint="Die Sätze in Sprechsilben, abwechselnd blau und rot – auch der Titel am Anfang." onChange={(v) => explain({ sylSubs: v })} /></div>}
        <Toggle checked={e.labels} label="Wörter unter den Bildern" onChange={(v) => explain({ labels: v })} />
        {e.labels && <div className="ex-sub"><Toggle checked={e.sylLabels} label="Silben rot und blau" hint="Die Wörter unter den Bildern in Sprechsilben." onChange={(v) => explain({ sylLabels: v })} /></div>}
        <div className="receipt-option">
          <strong>Hand</strong>
          <Chips label="Hautfarbe der Hand" value={e.hand} onChange={(v) => explain({ hand: v })} options={[
            { value: 'light', label: <><span className="ex-hand" style={{ background: '#f6d2b8' }} /> Hell</> },
            { value: 'medium', label: <><span className="ex-hand" style={{ background: '#d39b6a' }} /> Mittel</> },
            { value: 'dark', label: <><span className="ex-hand" style={{ background: '#8a5636' }} /> Dunkel</> },
          ]} />
        </div>
        <Slider label="Pause nach jedem Satz" value={e.pause} min={0} max={2} step={0.1} format={(v) => `${v.toFixed(1).replace('.', ',')} s`} onChange={(v) => explain({ pause: v })} />
      </Part>

      <Part title="Stimme">
        <Chips label="Stimme" value={e.voice} onChange={(v) => explain({ voice: v })} options={[
          { value: 'tts', label: <><Icon name="speaker" size={18} /> Computerstimme</> },
          { value: 'rec', label: <><Icon name="voice_presentation" size={18} /> Eigene Aufnahmen</> },
        ]} />
        {e.voice === 'rec'
          ? <Recordings c={c} set={set} upload={upload} busy={busy} />
          : <p className="option-hint">Die Computerstimme liest im Film vor. In ein gespeichertes Video kommt sie nicht (das kann kein Browser) – dort stehen die Untertitel. Mit eigenen Aufnahmen ist deine Stimme im Video.</p>}
      </Part>

      <Part title="Musik">
        <Chips label="Hintergrundmusik" value={e.music} onChange={(v) => (v === 'own' && !e.audio ? musicFile.current?.click() : explain({ music: v }))} options={EXPLAIN_MUSIC.map((m) => ({ value: m.id, label: <><Icon name={m.id === 'none' ? 'cancel' : m.id === 'own' ? 'audio_file' : 'music'} size={18} /> {m.label}</> }))} />
        {e.music === 'own' && (
          <p className="ex-music">
            <span>{e.musicName || 'Eigene Musik'}</span>
            <button type="button" className="knopf compact" disabled={busy} onClick={() => musicFile.current?.click()}>Andere Datei …</button>
          </p>
        )}
        <input ref={musicFile} className="visually-hidden" type="file" accept="audio/*" aria-label="Musikdatei wählen" disabled={busy} onChange={(ev) => { chooseMusic(ev.target.files?.[0]); ev.target.value = ''; }} />
        {e.music !== 'none' && <Slider label="Lautstärke der Musik" value={e.musicVolume} min={0.05} max={1} step={0.05} format={(v) => `${Math.round(v * 100)} %`} onChange={(v) => explain({ musicVolume: v })} />}
      </Part>

      <Part title="Vorschau und Video">
        <div className="ex-preview">
          <LearningRuntime interactive>
            <TextsachenFrame video element={{ id: 'erklaerbaer-vorschau', type: 'widget', widgetKind: 'textsachen', x: 0, y: 0, width: 160, height: 110, settings: { ts: c, title } } as unknown as PageElement} />
          </LearningRuntime>
        </div>
        <p className="option-hint">Im Heft gibt es den Knopf „Als Video speichern“ nicht – nur hier.</p>
      </Part>
    </>
  );
}

/** Own recordings, one per sentence of the film. */
function Recordings({ c, set, upload, busy }: Pick<Props, 'c' | 'set' | 'upload' | 'busy'>) {
  const sentences = explainSentences(c.text);
  const [recording, setRecording] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const recorder = useRef<MediaRecorder | null>(null);
  const latest = useRef(c);
  useEffect(() => { latest.current = c; });
  useEffect(() => () => recorder.current?.stop(), []);
  const audioOf = (key: string) => c.voice.find((r) => r.sentence === key)?.audio;
  const missing = sentences.filter((s) => !audioOf(s.key)).length;

  async function record(key: string) {
    setNote('');
    let stream: MediaStream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch {
      setNote('Das Mikrofon ist nicht erreichbar. Erlaube den Zugriff in den Einstellungen des Browsers.');
      return;
    }
    const mimeType = RECORD_TYPES.find((t) => typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(t));
    const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];
    rec.ondataavailable = (ev) => { if (ev.data.size) chunks.push(ev.data); };
    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      recorder.current = null;
      setRecording(null);
      const type = (rec.mimeType || mimeType || 'audio/webm').split(';')[0];
      const blob = new Blob(chunks, { type });
      if (!blob.size) { setNote('Es wurde nichts aufgenommen.'); return; }
      const file = new File([blob], `satz.${type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm'}`, { type });
      void upload(file, (src) => set({ voice: [...latest.current.voice.filter((r) => r.sentence !== key), { sentence: key, audio: src }] })).catch(() => setNote('Die Aufnahme konnte nicht gespeichert werden.'));
    };
    recorder.current = rec;
    setRecording(key);
    rec.start();
  }
  const remove = (key: string) => set({ voice: latest.current.voice.filter((r) => r.sentence !== key) });

  if (!sentences.length) return <p className="option-hint">Es gibt noch keinen Text zum Aufnehmen.</p>;
  return (
    <div className="ex-recordings">
      <p className="option-hint" role="status">{missing ? `Noch ${missing === 1 ? 'ein Satz' : `${missing} Sätze`} ohne Aufnahme – dort liest die Computerstimme.` : 'Alle Sätze sind aufgenommen.'}</p>
      {note && <p className="option-hint" role="alert">{note}</p>}
      <ol>
        {sentences.map((s) => {
          const src = audioOf(s.key), now = recording === s.key;
          return (
            <li key={s.key} className={`ex-rec${src ? ' is-done' : ''}${now ? ' is-recording' : ''}`}>
              <span className="ex-rec-text">{s.text}</span>
              <span className="ex-rec-actions">
                {now
                  ? <button type="button" className="knopf compact is-danger" onClick={() => recorder.current?.stop()}><Icon name="cancel" size={18} /> Stopp</button>
                  : <button type="button" className="knopf compact" disabled={busy || !!recording} onClick={() => void record(s.key)}><Icon name="voice_presentation" size={18} /> {src ? 'Neu aufnehmen' : 'Aufnehmen'}</button>}
                {src && !now && <button type="button" className="knopf compact" onClick={() => void new Audio(src).play().catch(() => {})}><Icon name="speaker" size={18} /> Anhören</button>}
                {src && !now && <button type="button" className="knopf compact" aria-label={`Aufnahme löschen: ${short(s.text, 40)}`} onClick={() => remove(s.key)}><Icon name="empty_trash" size={18} /> Löschen</button>}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
