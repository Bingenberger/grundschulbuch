/* eslint-disable @next/next/no-img-element -- School media and generated design samples. */
'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { LearningSettings } from '@/lib/learning/catalog';
import { karaokeSongs, musicOptions, songSettings, type MusicValues } from '@/lib/learning/music-settings';
import { parseLyrics, lyricWords, wordKey, parseMusicLrc, exportMusicLrc } from '@/lib/reference/music-runtime';
import { completeKaraokePictures, type PictureCache } from '@/lib/learning/karaoke-pictures';
import { downloadBlob } from '@/lib/learning/audio';
import ImageDialog from '../ImageDialog';
import { MusicSection, MusicSelect, MusicNumber, MusicToggle } from './MusicSettingControls';
import MusicSettingsPreview from './MusicSettingsPreview';
import { CassetteRecorder } from './Cassette';

type Props = { settings: LearningSettings; config: MusicValues; onConfig: (value: MusicValues) => void; onChange: (patch: Partial<LearningSettings>) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean; editing: boolean };
type Picture = { img: string; instead?: boolean };
type Timing = { n: number; end: number; marks: [number, number][] };
const tabs = [['song', 'Lied'], ['look', 'Aussehen'], ['pics', 'Bilder'], ['play', 'Ablauf & Musik']];
export default function KaraokeMusicOptions({ settings, config, onConfig, onChange, upload, busy, editing }: Props) {
  const k = (config.karaoke || {}) as MusicValues;
  const [tab, setTab] = useState('song'), [search, setSearch] = useState(''), [wordSearch, setWordSearch] = useState(''), [view, setView] = useState('live');
  const [pictureWord, setPictureWord] = useState<string | null>(null), [record, setRecord] = useState(false), [notice, setNotice] = useState(''), [progress, setProgress] = useState('');
  const [lrc, setLrc] = useState<{ text: string; timing?: Timing } | null>(null);
  const request = useRef<AbortController | null>(null), latest = useRef({ k, config, onConfig });
  const pictureCache = useRef<PictureCache>(new Map());
  useLayoutEffect(() => { latest.current = { k, config, onConfig }; });
  useEffect(() => () => { const controller = request.current; request.current = null; controller?.abort(); }, []);
  useEffect(() => { if (busy) request.current?.abort(); }, [busy]);
  const set = (patch: MusicValues) => {
    if (patch.text !== undefined || patch.picsOn === false) { request.current?.abort(); setProgress(''); }
    const karaoke = { ...k, ...patch }, next = { ...config, karaoke };
    latest.current = { ...latest.current, k: karaoke, config: next }; onConfig(next);
  };
  const selected = settings.musicSongs ?? (editing && k.song ? [String(k.song)] : []), multi = !editing && selected.length > 1;
  const lyrics = parseLyrics(String(k.text || ''), Number(k.repeat) || 1) as { verses: number; slots: { kind: string; text?: string }[] };
  const timing = k.timing as Timing | undefined, validTiming = timing?.n === lyrics.slots.length;
  const pics = (k.pics || {}) as Record<string, Picture>, words = lyricWords(String(k.text || '')) as string[];
  const choose = (song: (typeof karaokeSongs)[number]) => {
    request.current?.abort(); setProgress('');
    const ids = editing ? [song.id] : selected.includes(song.id) ? selected.filter(id => id !== song.id) : [...selected, song.id];
    if (ids.length === 1) { const single = karaokeSongs.find(s => s.id === ids[0])!, karaoke = songSettings(single, k), next = { ...config, karaoke }; onChange({ musicSongs: ids }); latest.current = { ...latest.current, k: karaoke, config: next }; onConfig(next); void suggest(karaoke); }
    else { onChange({ musicSongs: ids }); if (!ids.length) ownSong(); }
  };
  function ownSong() { request.current?.abort(); setProgress(''); onChange({ musicSongs: [] }); onConfig({ ...config, karaoke: { ...k, song: undefined, audio: undefined, timing: undefined, title: '', credit: '', text: '', pics: {}, nopic: [], skip: [], repeat: 1 } }); }
  function changePicture(word: string, picture?: Picture) {
    const now = latest.current, current = (now.k.pics || {}) as Record<string, Picture>, pictures: Record<string, Picture> = Object.assign(Object.create(null), current), hidden = new Set((now.k.nopic || []) as string[]), key = wordKey(word);
    if (picture) { pictures[key] = picture; hidden.delete(key); } else { delete pictures[key]; hidden.add(key); }
    const karaoke = { ...now.k, pics: pictures, nopic: [...hidden] }, config = { ...now.config, karaoke };
    latest.current = { ...now, k: karaoke, config };
    now.onConfig(config);
  }
  async function suggest(target: MusicValues = latest.current.k) {
    request.current?.abort(); const controller = new AbortController(); request.current = controller; setNotice('');
    try {
      const result = await completeKaraokePictures(target, {
        signal: controller.signal, cache: pictureCache.current,
        onProgress: (done, total) => { if (!controller.signal.aborted) setProgress(total ? `Bilder werden gesucht … ${done} von ${total}` : ''); },
        onPicture: (candidate, picture) => {
          const now = latest.current.k;
          if (now.text !== target.text || now.song !== target.song || now.picsOn === false || (now.nopic as string[] | undefined)?.includes(candidate.key) || (now.pics as Record<string, Picture>)?.[candidate.key]) return;
          changePicture(candidate.word, picture);
        },
      });
      if (request.current === controller) setNotice(result.errors ? 'Einige Bilder konnten nicht geladen werden. Eigene Bilder bleiben erhalten; fehlende Vorschläge lassen sich später erneut suchen.' : result.added ? `${result.added} Bilder automatisch ergänzt.` : 'Keine weiteren Bildvorschläge gefunden. Du kannst eigene Bilder wählen.');
    } catch (error) { if (!controller.signal.aborted) setNotice((error as Error).message); }
    finally { if (request.current === controller) setProgress(''); }
  }
  async function importLrc(file: File) {
    try { if (file.size > 256000) throw Error('Die LRC-Datei ist zu groß.'); const parsed = parseMusicLrc(await file.text()); if (!parsed) throw Error('In dieser Datei stehen keine Zeilen mit Zeiten.'); setLrc(parsed as { text: string; timing?: Timing }); setNotice(''); }
    catch (error) { setNotice((error as Error).message); }
  }
  return <div className="karaoke-reference-options">
    <div className="music-option-tabs" role="tablist" aria-label="Karaoke-Einstellungen">{tabs.map(([id, label]) => <button type="button" role="tab" aria-selected={tab === id} aria-controls={`karaoke-panel-${id}`} key={id} onClick={() => setTab(id)}>{label}</button>)}</div>
    {progress && <p role="status" className="karaoke-picture-progress">{progress} <button type="button" onClick={() => { request.current?.abort(); setProgress(''); }}>Suche beenden</button></p>}
    <div className="music-settings-layout">
      <div className="music-settings-fields" id={`karaoke-panel-${tab}`} role="tabpanel" aria-label={tabs.find(t => t[0] === tab)?.[1]}>
        {tab === 'song' && <>
          <MusicSection title="Lied auswählen">
            <label className="property-label">Lied suchen<input type="search" aria-label="Lied suchen" value={search} onChange={e => setSearch(e.target.value)} /></label>
            <button type="button" className="knopf" onClick={ownSong} aria-pressed={!selected.length}>Eigenes Lied</button>
            <div className="karaoke-song-library">{[...new Set(karaokeSongs.map(song => song.group))].map(group => {
              const songs = karaokeSongs.filter(song => song.group === group && `${song.title} ${song.text}`.toLocaleLowerCase('de-DE').includes(search.toLocaleLowerCase('de-DE')));
              return songs.length ? <section key={group}><h5>{group}</h5>{songs.map(song => <button type="button" key={song.id} aria-pressed={selected.includes(song.id)} onClick={() => choose(song)}><strong>{selected.includes(song.id) ? '✓ ' : ''}{song.title}</strong><small>{song.credit.split(' · ')[0]}</small></button>)}</section> : null;
            })}</div>
            <p className="template-note">31 Liedvorlagen aus der Referenz stehen zur Auswahl. {editing ? 'Wähle ein Lied oder bearbeite den eigenen Text.' : 'Mehrere Lieder werden als einzelne Seiten angelegt.'}</p>
          </MusicSection>
          {multi ? <MusicSection title={`${selected.length} Lieder – jeweils eine Seite`}><ol>{selected.map(id => <li key={id}>{karaokeSongs.find(song => song.id === id)?.title}</li>)}</ol><p>Aussehen und Ablauf gelten für alle gewählten Lieder.</p></MusicSection> : <MusicSection title="Liedtext">
            <label className="property-label">Titel<input aria-label="Liedtitel" maxLength={120} value={String(k.title || '')} onChange={e => set({ title: e.target.value })} /></label>
            <label className="property-label">Text und Melodie von<input aria-label="Text und Melodie von" maxLength={300} value={String(k.credit || '')} onChange={e => set({ credit: e.target.value })} /></label>
            <label className="property-label">Liedtext<textarea aria-label="Liedtext" rows={12} maxLength={20000} value={String(k.text || '')} onChange={e => set({ text: e.target.value })} /></label>
            {lyrics.verses > 1 && <div role="group" aria-label="Strophen"><h5>Welche Strophen werden gesungen?</h5>{Array.from({ length: lyrics.verses }, (_, i) => i + 1).map(verse => {
              const skip = new Set((k.skip || []) as number[]), active = !skip.has(verse);
              return <button type="button" className="knopf compact" key={verse} aria-pressed={active} onClick={() => { if (active && lyrics.verses - skip.size <= 1) return; if (active) skip.add(verse); else skip.delete(verse); set({ skip: [...skip].sort((a, b) => a - b) }); }}>{active ? '✓ ' : ''}Strophe {verse}</button>;
            })}</div>}
            <details><summary>So schreibst du den Liedtext</summary><ul><li>Jede Textzeile wird eine Karaoke-Zeile. Leerzeilen trennen Strophen.</li><li>„Refrain:“ beginnt den Refrain. Später genügt „Refrain“.</li><li>„---“ ist ein Zwischenspiel, „--- 2“ dauert doppelt so lange; „--- Solo“ erhält eine Beschriftung.</li><li>„Liese: …“ kennzeichnet eine Rolle.</li><li>„[Hut]“ zeigt das Bild anstelle des Worts.</li></ul></details>
          </MusicSection>}
        </>}
        {tab === 'look' && <>
          <MusicSection title="Gestaltung"><div className="karaoke-design-grid" role="radiogroup" aria-label="Gestaltung">{musicOptions.designs.map(design => <button type="button" key={design.id} role="radio" aria-checked={k.design === design.id} aria-label={design.label} onClick={() => set({ design: design.id })}><img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(design.svg)}`} alt="" /><span>{design.label}</span></button>)}</div></MusicSection>
          <MusicSection title="Schrift"><MusicSelect label="Schrift" value={k.font} options={musicOptions.fonts.map(f => [f.id, f.label])} onChange={font => set({ font })} />
            <MusicNumber label="Schriftgröße (höchstens)" value={k.size} min={36} max={130} step={2} onChange={size => set({ size })} /><p>Lange Zeilen werden automatisch kleiner, damit alle gleich groß sind.</p>
            <MusicToggle label="Silben rot und blau" value={k.syllables} onChange={syllables => set({ syllables })} />
            <MusicToggle label="Wörter beim Singen nacheinander färben" value={k.follow} onChange={follow => set({ follow })} hint="Ungefähr über die Silben jeder Zeile verteilt." />
          </MusicSection>
        </>}
        {tab === 'pics' && <MusicSection title="Bilder im Liedtext">
          <MusicToggle label="Bilder über den Wörtern" value={k.picsOn !== false} onChange={picsOn => set({ picsOn })} hint="Bilder von ARASAAC oder eigene Bilder. [Wort] zeigt das Bild statt des Worts." />
          <button type="button" className="knopf" disabled={!!progress || !String(k.text || '').trim() || k.picsOn === false} onClick={() => void suggest()}>Bilder vorschlagen</button>
          <label className="property-label">Wort suchen<input type="search" aria-label="Wort suchen" value={wordSearch} onChange={e => setWordSearch(e.target.value)} /></label>
          <div className="karaoke-picture-words">{words.filter(word => word.toLocaleLowerCase('de-DE').includes(wordSearch.toLocaleLowerCase('de-DE'))).sort((a, b) => Number(!pics[wordKey(a)]) - Number(!pics[wordKey(b)])).map(word => {
            const picture = pics[wordKey(word)];
            return <div key={wordKey(word)} className="karaoke-picture-word"><button type="button" aria-label={`Bild für ${word}`} onClick={() => setPictureWord(word)}>{picture ? <img src={picture.img} alt="" /> : '+'}</button><strong>{word}</strong>{picture && <><MusicToggle label={`statt Wort: ${word}`} value={picture.instead} onChange={instead => changePicture(word, { ...picture, instead })} /><button type="button" aria-label={`Bild von ${word} entfernen`} onClick={() => changePicture(word)}>Entfernen</button></>}</div>;
          })}</div>{!words.length && <p>Noch kein Liedtext.</p>}
        </MusicSection>}
        {tab === 'play' && <>
          <MusicSection title="So geht es zur nächsten Zeile"><MusicSelect label="Zeilenwechsel" value={k.mode} options={[["auto", 'Automatisch'], ['hand', 'Von Hand']]} onChange={mode => set({ mode })} /><p>{k.mode === 'hand' ? 'Bei jeder neuen Zeile auf „Nächste“ tippen. Am Ende lässt sich der Zeitplan übernehmen.' : 'Der Balken läuft im eingestellten Tempo. „Pause“ hält an; „Nächste“ oder Wischen springt weiter.'}</p>
            {!validTiming && <><MusicNumber label="Sekunden pro Zeile" value={k.secs} min={1.5} max={12} step={0.5} onChange={secs => set({ secs })} /><MusicNumber label="Vorspiel" value={k.intro} min={0} max={20} step={0.5} onChange={intro => set({ intro })} /></>}
            <MusicSelect label="Wie oft singen?" value={k.repeat} options={[1, 2, 3, 4].map(n => [String(n), `${n}×`])} onChange={repeat => set({ repeat: Number(repeat) })} /><p>Für Kanons läuft das Lied entsprechend oft hintereinander.</p>
          </MusicSection>
          <MusicSection title="Musik zum Lied">
            {typeof k.audio === 'string' ? <><audio controls src={k.audio} aria-label="Musik zum Lied anhören" preload="metadata" /><button type="button" onClick={() => set({ audio: undefined })}>Musik entfernen</button></> : <p>Ohne Musik singt ihr selbst oder begleitet mit Instrumenten.</p>}
            <label className="knopf">{k.audio ? 'Andere Musik …' : 'Musik wählen …'}<input type="file" accept="audio/*" className="visually-hidden" aria-label="Musik zum Lied wählen" onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file, audio => { set({ audio, timing: undefined }); setNotice('Neue Musik: Nimm den Zeitplan bei Bedarf neu auf.'); }); e.target.value = ''; }} /></label>
            <button type="button" className="knopf" onClick={() => setRecord(true)}>Musik aufnehmen</button>
            {record && <div className="music-settings-recorder"><CassetteRecorder title="Musik zum Lied" interactive={!busy} onSave={blob => upload(new File([blob], 'musik.webm', { type: blob.type }), audio => { set({ audio, timing: undefined }); setRecord(false); })} /><button type="button" onClick={() => setRecord(false)}>Aufnahme schließen</button></div>}
          </MusicSection>
          <MusicSection title="Zeitplan">
            {timing ? <><p>{validTiming ? `Aufgenommen: ${timing.marks.filter(([, line]) => line >= 0).length} Zeilen in ${(timing.end / 1000).toFixed(1)} Sekunden.` : 'Der Liedtext hat sich geändert – der Zeitplan passt nicht mehr.'}</p><button type="button" onClick={() => set({ timing: undefined })}>Zeitplan löschen</button></> : <p>Noch kein Zeitplan – jede Zeile dauert {String(k.secs)} Sekunden.</p>}
            <p>Am Liedblatt „Von Hand“ wählen, starten und bei jeder neuen Zeile „Nächste“ antippen. „Leerzeile“ fügt eine Pause ein; am Ende „Zeitplan merken“ wählen.</p>
            <label className="knopf">LRC-Datei laden<input type="file" accept=".lrc,.txt,text/plain" className="visually-hidden" aria-label="LRC-Datei laden" onChange={e => { const file = e.target.files?.[0]; if (file) void importLrc(file); e.target.value = ''; }} /></label>
            <button type="button" disabled={!String(k.text || '').trim()} onClick={() => downloadBlob(new Blob([exportMusicLrc(k)], { type: 'text/plain;charset=utf-8' }), `${String(k.title || 'Lied').replace(/[\\/:*?"<>|]/g, ' ')}.lrc`)}>Als LRC speichern</button>
            {lrc && <div className="karaoke-lrc-preview"><p>Importvorschau: {lrc.text.split('\n').length} Zeilen. Der bisherige Text und Zeitplan werden bei Übernahme ersetzt.</p><pre>{lrc.text.slice(0, 400)}</pre><button type="button" onClick={() => { onChange({ musicSongs: [] }); set({ text: lrc.text, timing: lrc.timing, song: undefined, repeat: 1, mode: 'auto' }); setLrc(null); }}>Liedtext und Zeitplan übernehmen</button><button type="button" onClick={() => setLrc(null)}>Import verwerfen</button></div>}
          </MusicSection>
          <MusicSection title="Aufnahme"><MusicSelect label="Aufnahmequelle" value={k.rec || 'room'} options={[["room", 'Mikrofon (Raumklang)'], ['mix', 'Mikrofon und Musik gemeinsam']]} onChange={rec => set({ rec })} /></MusicSection>
        </>}
        {notice && <p role="status">{notice}</p>}
      </div>
      <aside className="music-settings-preview-column"><div className="music-option-tabs" role="group" aria-label="Vorschauansicht"><button type="button" aria-pressed={view === 'live'} onClick={() => setView('live')}>Karaoke</button><button type="button" aria-pressed={view === 'sheet'} onClick={() => setView('sheet')}>Liedblatt (Druck)</button></div><MusicSettingsPreview settings={settings} live={view === 'live'} /><p className="template-note">{view === 'live' ? 'Probiere das Lied hier aus. Änderungen werden erst mit „Auf die Seite übernehmen“ gespeichert.' : 'So sieht das Liedblatt beim Drucken aus.'}</p></aside>
    </div>
    {pictureWord && <ImageDialog features={new Set(['imageUpload', 'imageSearch', 'imageWeb'])} title={`Bild für „${pictureWord}“`} onClose={() => setPictureWord(null)} onImage={image => { const previous = pics[wordKey(pictureWord)]; changePicture(pictureWord, { img: image.src, ...(previous?.instead ? { instead: true } : {}) }); setPictureWord(null); }} />}
  </div>;
}
