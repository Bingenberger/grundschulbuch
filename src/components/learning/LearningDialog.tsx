'use client';
import TextsachenOptions from './TextsachenOptions';
import ZuordnungOptions from './ZuordnungOptions';
import { dndConfig } from '@/lib/learning/zuordnung';
import { tsConfig, tsProblems } from '@/lib/learning/textsachen';
import Icon, { type IconName } from '../Icon';
import { Picker } from '../ui/Choice';
import { TextGlyph } from '../ui/Glyphs';
import AiDialog from './AiDialog';
import { ENABLED } from '@/lib/paused';
import VoiceOptions from './VoiceOptions';
import AlphabetOptions from './AlphabetOptions';
import SynthesisOptions from './SynthesisOptions';
import ClappingOptions from './ClappingOptions';
import MediaActivityOptions from './MediaActivityOptions';
import LetterGuessOptions from './LetterGuessOptions';
import SyllableOptions from './SyllableOptions';
import GeometryOptions from './GeometryOptions';
import { geometryCustom } from '@/lib/learning/geometry';
import KaraokeOptions from './KaraokeOptions';
import MusicOptions from './MusicOptions';
import NoteSheetDialog from '../sheets/NoteSheetDialog';
import { musicPage } from '@/lib/learning/music';
import { decodeMusicConfig, encodeMusicConfig } from '@/lib/learning/music-settings';
import { cleanKaraokeSettings } from '@/lib/reference/music-runtime';
import { karaokeLines, validKaraokeTimes } from '@/lib/learning/karaoke';
import { assemblyWords } from '@/lib/learning/syllable-assembly';
import { guessWords, validGuessWord } from '@/lib/learning/letter-guess';
import { clappingWords } from '@/lib/learning/clapping';
import { synthesisPairs } from '@/lib/learning/synthesis';
import { practiceWords } from '@/lib/learning/alphabet';
import WordBank from './WordBank';
import { effectWav, soundEffects } from '@/lib/learning/audio';
import { useEffect, useRef, useState } from 'react';
import { completeKaraokePictures, type PictureCache } from '@/lib/learning/karaoke-pictures';
import {
  activityCatalog,
  defaultSettings,
  widgetCatalog,
  type ActivityKind,
  type WidgetKind,
  type LearningSettings,
  type JsonValue,
} from '@/lib/learning/catalog';
import CheckoutOptions from './CheckoutOptions';
import { shopConfig } from '@/lib/learning/checkout';
import { checkoutPage, fullPageWidget, receiptPage } from '@/lib/learning/blocks';
import MonsterOptions from './MonsterOptions';
import SynthOptions from './SynthOptions';
import AnlautOptions from './AnlautOptions';
import ClapOptions from './ClapOptions';
import ReceiptOptions from './ReceiptOptions';
import { DienesOptions, HundredFieldOptions, NumberLineOptions, PlaceValueOptions } from './MathMaterialOptions';
import { cleanMonster } from '@/lib/reference/monster';
import { clone, uuid, type Page, type PageElement } from '@/lib/notebook-model';
import { learningBlocks, SUBJECTS, type LearningBlock, type Subject } from '@/lib/learning/blocks';
import { ChoiceButton, Choices, OptionGroup } from '../ui/Choice';
import { GROUPS, LEVELS, TOLERANCES, geoConfig, makeTasks, taskText, type GeoConfig } from '@/lib/learning/geodraw';
import { mathTool, pageSize } from '@/lib/learning/mathtool';
import { uploadImage } from '@/lib/client-api';
const activityIcons: Record<ActivityKind, IconName> = {
  quiz: 'questions', matching: 'flow_chart', cloze: 'rules', typing: 'signature',
  reading: 'reading', memory: 'gallery', maze: 'sports_mode', letterguess: 'faq',
  crossword: 'grid', wordsearch: 'search', wordle: 'list', syllables: 'reading_ebook',
  connect4: 'collaboration', battleship: 'binoculars',
};
const widgetIcons: Record<WidgetKind, IconName> = {
  timer: 'alarm_clock', multitimer: 'overtime', clock: 'clock', calendar: 'calendar',
  timetable: 'planner', noise: 'high_priority', applause: 'positive_dynamic',
  pitch: 'podium_with_speaker', piano: 'music', drums: 'speaker', sequencer: 'timeline',
  metronome: 'serial_tasks', tuner: 'electronics', echo: 'redo', notequiz: 'diploma_1',
  falling: 'music', recorder: 'audio_file', playlist: 'list', soundstudio: 'headset',
  karaoke: 'voice_presentation', slideshow: 'stack_of_photos', animation: 'film_reel',
  map: 'globe', calculator: 'calculator', mathtool: 'calculator', receipt: 'todo_list', geodraw: 'ruler', checkout: 'shop', monsternames: 'reading', textsachen: 'reading_ebook', zuordnung: 'flow_chart', syllablejoin: 'workflow', anlaut: 'kindle', clapsyllables: 'sports_mode', placevalue: 'grid', dienes: 'stack_of_photos', numberline: 'timeline', hundredfield: 'grid', mathboard: 'org_unit', shop: 'shop',
  geometry: 'radar_plot', monster: 'idea', synthesis: 'mind_map', clapping: 'like',
  alphabet: 'kindle', communication: 'comments',
};
const subjectIcons: Record<Subject, IconName> = {
  Deutsch: 'reading', Mathematik: 'calculator', Sachunterricht: 'globe', Musik: 'music',
  'Medien & Präsentation': 'podium_with_speaker', Klassenführung: 'alarm_clock',
  'Unterstützte Kommunikation': 'comments', 'Für alle Fächer': 'puzzle',
};
const blockIcon = (b: LearningBlock): IconName =>
  b.type === 'widget' ? widgetIcons[b.kind as WidgetKind] : activityIcons[b.kind as ActivityKind];

/** Size of a newly inserted learning element in mm. */
function startSize(kind: WidgetKind | ActivityKind, settings: LearningSettings) {
  if (kind === 'mathtool') return pageSize(mathTool(settings));
  if (kind === 'placevalue' || kind === 'dienes') return { width: 220, height: 160 };
  if (kind === 'numberline') return { width: 250, height: 80 };
  if (kind === 'hundredfield') return { width: 200, height: 150 };
  if (kind === 'checkout' || kind === 'monsternames' || kind === 'syllablejoin' || kind === 'anlaut' || kind === 'clapsyllables' || kind === 'textsachen' || kind === 'zuordnung') return { width: 297, height: 210 };
  return {
    width: kind === 'receipt' ? 120 : 180,
    height: kind === 'receipt' ? 126 : kind === 'alphabet' ? 210 : kind === 'synthesis' || kind === 'clapping' || kind === 'letterguess' || kind === 'syllables' || kind === 'geometry' ? 180 : 140,
  };
}

export default function LearningDialog({
  element,
  onSave,
  onClose,
  onWorksheet,
  onPages,
}: {
  element?: PageElement;
  onSave: (el: PageElement) => void;
  onClose: () => void;
  /** Opens the worksheet generator (task pages with solutions). */
  onWorksheet?: () => void;
  /** Building blocks that come as whole pages (the communication book). */
  onPages?: (pages: Page[]) => void;
}) {
  const [type, setType] = useState<'widget' | 'activity'>(
    element?.type === 'activity' ? 'activity' : 'widget',
  );
  const [kind, setKind] = useState<WidgetKind | ActivityKind>(
    element?.widgetKind || element?.activityKind || 'timer',
  );
  const [settings, setSettings] = useState<LearningSettings>(
    element?.settings?.musicTemplate ? { ...element.settings, musicConfig: element.response?.musicConfig || element.settings.musicConfig } : element?.settings || defaultSettings(kind),
  );
  const [showNotes, setShowNotes] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [musicProgress, setMusicProgress] = useState('');
  const musicRequest = useRef<AbortController | null>(null);
  useEffect(() => () => musicRequest.current?.abort(), []);
  const [query, setQuery] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [effect, setEffect] = useState<keyof typeof soundEffects>('rain');
  /** First pick a building block, then set it up. */
  const [stage, setStage] = useState<'choose' | 'configure'>(element ? 'configure' : 'choose');
  const [subject, setSubject] = useState<Subject | 'Alle'>('Alle');
  const [blockTitle, setBlockTitle] = useState('');
  const patch = (values: Partial<LearningSettings>) =>
    setSettings((s) => ({ ...s, ...values }));
  function choose(block: LearningBlock) {
    if (busy) return;
    if (block.generator === 'notes') { setShowNotes(true); return; }
    if (block.pages) {
      onPages?.(block.pages('landscape'));
      onClose();
      return;
    }
    if (block.direct && block.preset) {
      const preset = clone(block.preset);
      onSave({
        id: uuid(), x: 15, y: 45, ...startSize(block.kind, preset), rotation: 0, locked: false, color: '#253c42',
        type: block.type,
        widgetKind: block.type === 'widget' ? (block.kind as WidgetKind) : undefined,
        activityKind: block.type === 'activity' ? (block.kind as ActivityKind) : undefined,
        settings: preset,
      });
      onClose();
      return;
    }
    setType(block.type);
    setKind(block.kind);
    setSettings(block.preset ? clone(block.preset) : defaultSettings(block.kind));
    setBlockTitle(block.title);
    setStage('configure');
  }
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const found = learningBlocks.filter(
    (b) => (!b.pages || onPages) && words.every((w) => `${b.title} ${b.words}`.toLowerCase().includes(w)),
  );
  const count = (c: Subject) => found.filter((b) => b.subject === c).length;
  const shown = subject === 'Alle' || query ? SUBJECTS.filter((c) => count(c) > 0) : [subject];
  async function media(file: File, done: (src: string) => void) {
    setBusy(true);
    try {
      if (file.type.startsWith('image/')) done(await uploadImage(file));
      else {
        if (file.size > 20 * 1024 * 1024)
          throw new Error('Tondateien dürfen höchstens 20 MB groß sein.');
        const response = await fetch('/api/ton', {
          method: 'POST',
          body: file,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        done(data.src);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const numeric = (
    name: keyof LearningSettings,
    label: string,
    min: number,
    max: number,
    step = 1,
  ) => (
    <label className="property-label" key={name}>
      {label}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={Number(settings[name] ?? min)}
        onChange={(e) =>
          patch({
            [name]: Math.max(min, Math.min(max, Number(e.target.value))),
          })
        }
      />
    </label>
  );
  const upload = (accept: string, done: (src: string) => void, label = 'Datei wählen') => (
    <label className="knopf compact">
      {label}
      <input
        className="visually-hidden"
        type="file"
        accept={accept}
        aria-label={label}
        disabled={busy}
        onChange={(e) => {
          if (e.target.files?.[0]) void media(e.target.files[0], done);
          e.target.value = '';
        }}
      />
    </label>
  );
  if (showNotes) return <NoteSheetDialog onClose={() => setShowNotes(false)} onInsert={async pages => { onPages?.(pages); onClose(); }} />;
  return (
    <div className="modal-backdrop">
      <section
        className="modal learning-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="learning-dialog-title"
      >
        <div className="dialog-heading">
          <div>
            <h2 id="learning-dialog-title">
              {element ? 'Lernwerkzeug gestalten' : 'Lernwerkzeuge & Übungen'}
            </h2>
            <p>
              Gestalten, auf der Seite platzieren und im Tafelmodus oder
              Kinderheft benutzen.
            </p>
          </div>
          <button className="knopf" onClick={onClose}>
            Schließen
          </button>
        </div>
        <div className="learning-dialog-layout">
          {stage === 'choose' && (
            <div className="template-layout learning-chooser">
              <nav className="template-categories" aria-label="Fächer">
                <ChoiceButton icon="grid" label={`Alle · ${found.length}`} pressed={subject === 'Alle'} onClick={() => setSubject('Alle')} />
                {SUBJECTS.map((c) => (
                  <ChoiceButton
                    key={c}
                    icon={subjectIcons[c]}
                    label={`${c} · ${count(c)}`}
                    pressed={subject === c}
                    disabled={!count(c)}
                    onClick={() => setSubject(subject === c ? 'Alle' : c)}
                  />
                ))}
              </nav>
              <div className="template-main">
                <div className="template-tools">
                  <label className="template-search">
                    <Icon name="search" size={20} />
                    <input
                      type="search"
                      aria-label="Lernwerkzeug suchen"
                      placeholder="Suchen, z. B. Uhr, Silben, Klavier …"
                      value={query}
                      autoFocus
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                </div>
                {onWorksheet && !query && (
                  <button type="button" className="learning-worksheet" onClick={onWorksheet}>
                    <Icon name="survey" size={22} />
                    <span>
                      Arbeitsblatt erzeugen
                      <small>Rechnen, Uhr, Silben, Labyrinth … mit Lösungsseiten</small>
                    </span>
                  </button>
                )}
                {!found.length && <p className="template-note">Kein Lernwerkzeug gefunden.</p>}
                {shown.map((c) => (
                  <section key={c} className="template-group">
                    <h3>
                      <Icon name={subjectIcons[c]} size={20} /> {c}
                    </h3>
                    <div className={`learning-grid${c === 'Musik' ? ' learning-grid-music' : ''}`}>
                      {found
                        .filter((b) => b.subject === c)
                        .map((b) => (
                          <button key={b.id} type="button" className="learning-block" aria-label={b.title} onClick={() => choose(b)}>
                            {b.preview ? <span className="learning-block-preview">
                              {/* eslint-disable-next-line @next/next/no-img-element -- Static previews of the actual tools. */}
                              <img src={b.preview} alt={`Vorschau: ${b.title}`} width={480} height={340} loading="lazy" decoding="async" />
                            </span> : <Icon name={blockIcon(b)} size={34} />}
                            <span>{b.title}</span>
                          </button>
                        ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          )}
          {stage === 'configure' && (
          <form
            className="learning-options"
            onSubmit={async (e) => {
              e.preventDefault();
              if (busy) return;
              let readySettings = settings;
              if (settings.musicTemplate === 'karaoke') {
                const config = decodeMusicConfig(settings.musicConfig);
                readySettings = { ...settings, musicConfig: encodeMusicConfig({ ...config, karaoke: cleanKaraokeSettings(config.karaoke) }) };
              }
              if (kind === 'alphabet' && settings.words?.some(word => word.length > 80)) { setError('Ein Übungswort darf höchstens 80 Zeichen haben.'); return; }
              if (kind === 'alphabet' && settings.alphabetPractice && !practiceWords(settings).length) { setError('Bitte mindestens ein Übungswort hinterlegen.'); return; }
              if (kind === 'synthesis' && (!synthesisPairs(settings).length || settings.synthesisPairs?.some(p => !p.left.trim() || !p.right.trim() || p.left.length > 80 || p.right.length > 80))) { setError('Bitte gültige Laute oder Verbindungen auswählen. Jeder Teil darf höchstens 80 Zeichen haben.'); return; }
              if (kind === 'synthesis' && settings.synthesisPronunciations?.some(p => !p.text.trim() || !p.speak.trim() || p.text.length > 80 || p.speak.length > 80)) { setError('Bitte jede Aussprachekorrektur vollständig und mit höchstens 80 Zeichen je Teil eingeben.'); return; }
              if (kind === 'clapping' && (!clappingWords(settings).length || (settings.words || []).length > 16 || settings.words?.some(word => word.length > 80 || word.split('-').filter(Boolean).length > 12))) { setError('Bitte eine bis 16 Wörter mit höchstens 80 Zeichen und zwölf Silben je Wort eingeben.'); return; }
              if (kind === 'geometry' && geometryCustom(settings) && (!settings.path || settings.path.length < 2 || settings.path.length > 30 || settings.path.some((p, i, points) => !Number.isFinite(p.x) || !Number.isFinite(p.y) || p.x < 0 || p.y < 0 || p.x > 100 || p.y > 100 || i > 0 && p.x === points[i - 1].x && p.y === points[i - 1].y))) { setError('Bitte zwei bis 30 gültige Eckpunkte der eigenen Form eingeben.'); return; }
              if (kind === 'karaoke' && !settings.musicTemplate && (!karaokeLines(settings.text).length || (settings.text || '').replace(/\r\n?/g, '\n').split('\n').length > 300 || (settings.karaokeTimes !== undefined && !validKaraokeTimes(settings.karaokeTimes, karaokeLines(settings.text).length)))) { setError('Bitte einen Liedtext mit bis zu 300 Zeilen und aufsteigenden Startzeiten hinterlegen.'); return; }
              if (kind === 'syllables' && (!assemblyWords(settings).length || (settings.words || []).length > 30 || settings.words?.some(word => word.trim() && !assemblyWords({ words: [word] }).length))) { setError('Bitte bis 30 Wörter mit höchstens 80 Zeichen und zwölf Silben eingeben.'); return; }
              if (kind === 'letterguess' && (!guessWords(settings).length || (settings.words || []).length > 20 || settings.words?.some(word => word.trim() && !validGuessWord(word)))) { setError('Bitte eine bis 20 gültige Wörter oder kurze Ausdrücke mit höchstens 40 Zeichen eingeben.'); return; }
              const taskContent = (text: string, media?: { image?: string; audio?: string }) => !!text.trim() || !!media?.image || !!media?.audio;
              if (kind === 'quiz' && (!settings.questions?.length || settings.questions.some(q => !taskContent(q.text, q.media) || q.answers.length < 2 || q.answers.some((answer, i) => !taskContent(answer, q.answerMedia?.[i]))))) { setError('Bitte jede Frage und Antwort mit Text, Bild oder Ton ausfüllen.'); return; }
              if ((kind === 'matching' || kind === 'memory') && (!settings.pairs?.length || settings.pairs.some(pair => !taskContent(pair.left, pair.leftMedia) || !taskContent(pair.right, pair.rightMedia)))) { setError('Bitte beide Seiten jedes Paars mit Text, Bild oder Ton ausfüllen.'); return; }
              if (settings.musicTemplate === 'karaoke' && !(settings.musicConfig as { karaoke?: { text?: string } })?.karaoke?.text?.trim()) { setError('Bitte einen Liedtext eingeben oder ein Lied auswählen.'); return; }
              if (settings.musicTemplate === 'karaoke') {
                const controller = new AbortController(), cache: PictureCache = new Map(); musicRequest.current = controller; setBusy(true); setError('');
                const fillPictures = async (base: LearningSettings, prefix = '') => {
                  const config = decodeMusicConfig(base.musicConfig), result = await completeKaraokePictures(config.karaoke as Record<string, unknown>, {
                    signal: controller.signal, cache,
                    onProgress: (done, total) => setMusicProgress(total ? `${prefix}Bilder werden ergänzt … ${done} von ${total}` : prefix),
                  });
                  return { ...base, musicConfig: encodeMusicConfig({ ...config, karaoke: cleanKaraokeSettings(result.karaoke) }) };
                };
                try {
                  if (!element && onPages) {
                    const pages = musicPage(readySettings);
                    for (const [index, page] of pages.entries()) page.elements[0].settings = await fillPictures(page.elements[0].settings!, pages.length > 1 ? `Lied ${index + 1} von ${pages.length}: ` : '');
                    if (controller.signal.aborted) return;
                    onPages(pages); onClose(); return;
                  }
                  readySettings = await fillPictures(readySettings);
                } catch (error) { if (!controller.signal.aborted) setError((error as Error).message); return; }
                finally { setBusy(false); setMusicProgress(''); if (musicRequest.current === controller) musicRequest.current = null; }
              }
              if (settings.musicTemplate && !element && onPages) {
                onPages(musicPage(readySettings)); onClose(); return;
              }
              if (kind === 'checkout') {
                const raw = settings.checkout as { items?: { name?: string }[] } | undefined;
                if (!raw?.items?.some((item) => item.name?.trim())) { setError('Lege mindestens eine Ware mit Namen an.'); return; }
                const ready = { ...settings, checkout: shopConfig(settings.checkout) as unknown as JsonValue };
                if (!element && onPages) {
                  onPages(checkoutPage(ready));
                  onClose();
                  return;
                }
              }
              if (kind === 'textsachen') {
                const problems = tsProblems(tsConfig(settings.ts));
                if (problems.length) { setError(problems[0]); return; }
                // Like in Lernsachen-Heft, the exercise comes on its own page.
                if (!element && onPages) {
                  onPages(fullPageWidget('textsachen', { ...settings, ts: tsConfig(settings.ts) as unknown as JsonValue }));
                  onClose();
                  return;
                }
              }
              if (kind === 'zuordnung') {
                const dnd = dndConfig(settings.dnd);
                if (!dnd.exercise) { setError('Die Übung ist noch nicht fertig: Sie wird gerade gebaut oder es fehlt noch etwas (siehe Hinweis unter dem Inhalt).'); return; }
                if (!element && onPages) {
                  onPages(fullPageWidget('zuordnung', settings));
                  onClose();
                  return;
                }
              }
              if ((kind === 'anlaut' || kind === 'clapsyllables') && !element && onPages) {
                onPages(fullPageWidget(kind, settings));
                onClose();
                return;
              }
              if (kind === 'syllablejoin') {
                const syls = (settings.synth as { syls?: unknown[] } | undefined)?.syls;
                if (!syls?.length) { setError('Mit diesen Buchstaben lassen sich keine Silben bilden.'); return; }
                if (!element && onPages) {
                  onPages(fullPageWidget('syllablejoin', settings));
                  onClose();
                  return;
                }
              }
              if (kind === 'monsternames') {
                const m = cleanMonster(settings.monster) as { words: string[][] };
                if (!m.words.length) { setError('Mit diesen Buchstaben lassen sich keine Namen bilden.'); return; }
                if (!element && onPages) {
                  onPages(fullPageWidget('monsternames', { ...settings, monster: m as unknown as JsonValue }));
                  onClose();
                  return;
                }
              }
              // “Rechnen mit dem Taschenrechner”: receipt and calculator on their own page.
              if (kind === 'receipt' && !element && onPages) {
                onPages(receiptPage('landscape', settings.receipt));
                onClose();
                return;
              }
              const learning: PageElement = {
                ...(element || {
                  id: uuid(),
                  x: 15,
                  y: 45,
                  ...startSize(kind, settings),
                  rotation: 0,
                  locked: false,
                  color: '#253c42',
                }),
                type,
                widgetKind:
                  type === 'widget' ? (kind as WidgetKind) : undefined,
                activityKind:
                  type === 'activity' ? (kind as ActivityKind) : undefined,
                settings: kind === 'checkout' ? { ...settings, checkout: shopConfig(settings.checkout) as unknown as JsonValue } : readySettings,
              };
              if (settings.musicTemplate && JSON.stringify(element?.settings?.musicConfig) !== JSON.stringify(readySettings.musicConfig) && learning.response) {
                const { musicConfig: previousMusic, ...response } = learning.response; void previousMusic; learning.response = response;
              }
              onSave(learning);
              onClose();
            }}
          >
            {ENABLED.aiDesign && (
              <button
                type="button"
                className="knopf compact"
                onClick={() => setShowAI(true)}
              >
                Mit KI entwerfen
              </button>
            )}
            <div className="learning-options-heading">
              {!element && (
                <button type="button" className="knopf compact" onClick={() => setStage('choose')}>
                  <Icon name="left" size={18} /> Andere Auswahl
                </button>
              )}
              <h3>
                {blockTitle ||
                  (type === 'widget' ? widgetCatalog[kind as WidgetKind][0] : activityCatalog[kind as ActivityKind])}
              </h3>
            </div>
            <label className="property-label">
              Titel
              <input
                aria-label="Titel des Lernwerkzeugs"
                maxLength={120}
                value={settings.title || ''}
                onChange={(e) => patch({ title: e.target.value })}
              />
            </label>
            {settings.musicTemplate ? <MusicOptions settings={settings} onChange={patch} upload={media} busy={busy} editing={!!element} /> : <>
            {kind === 'karaoke' && <KaraokeOptions settings={settings} onChange={patch} upload={media} busy={busy} />}
            {kind === 'syllables' && <SyllableOptions settings={settings} onChange={patch} upload={media} busy={busy} />}
            {kind === 'letterguess' && <LetterGuessOptions settings={settings} onChange={patch} upload={media} busy={busy} />}
            {kind === 'clapping' && <ClappingOptions settings={settings} onChange={patch} upload={media} busy={busy} />}
            {kind === 'synthesis' && <SynthesisOptions settings={settings} onChange={patch} upload={media} busy={busy} />}
            {kind === 'alphabet' && <AlphabetOptions settings={settings} onChange={patch} upload={media} busy={busy} />}
            {[
              'monster',
              'alphabet',
              'crossword',
              'wordsearch',
              'wordle',
              'reading',
            ].includes(kind) && (
              <label className="property-label">
                {kind === 'alphabet' ? 'Übungswörter, je eines pro Zeile · bis 40 Wörter' : 'Wörter, je eines pro Zeile; Silben mit Bindestrich trennen'}
                <textarea
                  aria-label="Wörter der Übung"
                  value={(settings.words || []).join('\n')}
                  onChange={(e) =>
                    patch({ words: e.target.value.split('\n').slice(0, 40) })
                  }
                />
              </label>
            )}
            {[
              'cloze',
              'typing',
              'reading',
              'pitch',
              'calculator',
            ].includes(kind) && (
              <label className="property-label">
                {kind === 'cloze'
                  ? 'Text; Lösungen in [eckige Klammern] setzen'
                  : kind === 'calculator'
                    ? 'Kassenzettel, z. B. Brot: 2,40'
                    : 'Text'}
                <textarea
                  aria-label="Text der Übung"
                  maxLength={10000}
                  value={settings.text || ''}
                  onChange={(e) => patch({ text: e.target.value })}
                />
              </label>
            )}
            {(kind === 'quiz' || kind === 'matching' || kind === 'memory') && <MediaActivityOptions kind={kind} settings={settings} onChange={patch} upload={media} busy={busy} />}
            {kind === 'crossword' && (
              <label className="property-label">
                Paare, je eine Zeile: Begriff = Zuordnung
                <textarea
                  aria-label="Paare der Übung"
                  value={(settings.pairs || [])
                    .map((p) => `${p.left} = ${p.right}`)
                    .join('\n')}
                  onChange={(e) =>
                    patch({
                      pairs: e.target.value
                        .split('\n')
                        .slice(0, 20)
                        .map((line) => {
                          const at = line.indexOf('=');
                          return {
                            left: at < 0 ? line : line.slice(0, at).trim(),
                            right: at < 0 ? '' : line.slice(at + 1).trim(),
                          };
                        }),
                    })
                  }
                />
              </label>
            )}
            <div className="property-row">
              {[
                'timer',
                'multitimer',
                'pitch',
                  'animation',
                'reading',
              ].includes(kind) &&
                numeric(
                  'seconds',
                  kind === 'reading' ? 'Sekunden je Wort' : 'Dauer (Sekunden)',
                  1,
                  3600,
                )}
              {[
                'piano',
                'drums',
                'sequencer',
                'metronome',
                'echo',
                'falling',
                'battleship',
              ].includes(kind) && numeric('bpm', 'Tempo (BPM)', 30, 240)}
              {['mathboard', 'shop', 'calculator', 'map'].includes(kind) &&
                numeric(
                  'maximum',
                  kind === 'map' ? 'Meter pro Einheit' : 'Zahlenraum',
                  10,
                  1000,
                )}
              {[
                'wordsearch',
                'maze',
                'communication',
                'timetable',
                'memory',
              ].includes(kind) &&
                numeric('columns', 'Spalten / Rastergröße', 2, 15)}
            </div>
            {['piano', 'echo', 'notequiz', 'falling'].includes(kind) && (
              <Picker label="Instrument" value={settings.instrument || 'piano'} onChange={(value) => patch({ instrument: value })}
                options={[{ value: 'piano', label: 'Klavier', icon: 'music' as const }, { value: 'xylophone', label: 'Xylophon', icon: <TextGlyph text="♪" tone="orange" /> }, { value: 'marimba', label: 'Marimba', icon: <TextGlyph text="♪" tone="orange" /> }, { value: 'glockenspiel', label: 'Glockenspiel', icon: <TextGlyph text="♪" tone="violet" /> }, { value: 'musicbox', label: 'Spieluhr', icon: <TextGlyph text="♪" tone="violet" /> }, { value: 'organ', label: 'Orgel', icon: <TextGlyph text="♪" tone="green" /> }, { value: 'synth', label: 'Synthesizer', icon: 'electronics' as const }, { value: 'flute', label: 'Flöte', icon: <TextGlyph text="♪" tone="blue" /> }, { value: 'tube', label: 'Röhrenglocken', icon: <TextGlyph text="♪" tone="blue" /> }]} />
            )}
            {[
              'piano',
              'drums',
              'sequencer',
              'metronome',
              'echo',
              'notequiz',
              'falling',
            ].includes(kind) && (
              <label className="property-label">
                Lautstärke
                <input
                  type="range"
                  min="0"
                  max="1"
                  step=".05"
                  value={settings.volume ?? 0.35}
                  onChange={(e) => patch({ volume: Number(e.target.value) })}
                />
              </label>
            )}
            {kind === 'metronome' && (
              <>
                {numeric('rows', 'Schläge je Takt', 1, 12)}
                <Picker label="Klang" name="Klang des Metronoms" value={settings.mode || 'beep'} onChange={(value) => patch({ mode: value })}
                  options={[{ value: 'click', label: 'Klick', icon: <TextGlyph text="tk" tone="blue" /> }, { value: 'wood', label: 'Holz', icon: <TextGlyph text="tok" tone="orange" /> }, { value: 'bell', label: 'Glocke', icon: <TextGlyph text="♪" tone="violet" /> }, { value: 'beep', label: 'Piep', icon: <TextGlyph text="piep" tone="green" /> }, { value: 'cowbell', label: 'Kuhglocke', icon: <TextGlyph text="♪" tone="orange" /> }]} />
              </>
            )}
            {kind === 'tuner' && (
              <Picker label="Instrument" name="Instrument des Stimmgeräts" value={settings.mode || 'chromatic'} onChange={(value) => patch({ mode: value })}
                options={[{ value: 'chromatic', label: 'Chromatisch', icon: 'electronics' as const }, { value: 'guitar', label: 'Gitarre', icon: <TextGlyph text="6" tone="blue" /> }, { value: 'ukulele', label: 'Ukulele', icon: <TextGlyph text="4" tone="blue" /> }, { value: 'bass', label: 'Bass', icon: <TextGlyph text="4" tone="orange" /> }, { value: 'violin', label: 'Violine', icon: <TextGlyph text="4" tone="violet" /> }, { value: 'cello', label: 'Cello', icon: <TextGlyph text="4" tone="green" /> }]} />
            )}
            {kind === 'slideshow' && (
              <>
                <label><input type="checkbox" checked={settings.slideshowSound !== false} onChange={event => patch({ slideshowSound: event.target.checked })} /> Folienton automatisch mit der Folie starten</label>
                <label><input type="checkbox" checked={settings.slideshowWaitAudio !== false} onChange={event => patch({ slideshowWaitAudio: event.target.checked })} /> Vor dem Folienwechsel auch das Tonende abwarten</label>
                <p>Die Sekundenangabe ist die Mindestdauer einer Folie. Ohne Abwarten wird ein längerer Ton beim Wechsel beendet.</p>
                <Picker label="Textposition" value={settings.mode || 'center'} onChange={(value) => patch({ mode: value })}
                  options={[{ value: 'bottom', label: 'Unterschrift', icon: 'down' as const }, { value: 'top', label: 'Überschrift', icon: 'up' as const }, { value: 'lower', label: 'Bauchbinde', icon: 'rules' as const }, { value: 'side', label: 'Seitlich', icon: 'right' as const }, { value: 'center', label: 'Mitte', icon: 'collect' as const }, { value: 'none', label: 'Kein Text', icon: 'cancel' as const }]} />
                <label className="property-label">
                  Hintergrundfarbe
                  <input
                    type="color"
                    value={
                      settings.background?.startsWith('#')
                        ? settings.background
                        : '#f4f5eb'
                    }
                    onChange={(e) => patch({ background: e.target.value })}
                  />
                </label>
              </>
            )}
            {!settings.musicTemplate && kind === 'piano' && (
              <>
                <Picker label="Tonleiter" value={settings.mode || 'major'} onChange={(value) => patch({ mode: value })}
                  options={[{ value: 'all', label: 'Alle Töne', icon: 'music' as const }, { value: 'major', label: 'Dur', icon: <TextGlyph text="Dur" tone="green" /> }, { value: 'minor', label: 'Moll', icon: <TextGlyph text="Moll" tone="violet" /> }, { value: 'penta', label: 'Pentatonik', icon: <TextGlyph text="5" tone="green" /> }, { value: 'pentaMinor', label: 'Moll-Pentatonik', icon: <TextGlyph text="5" tone="violet" /> }, { value: 'blues', label: 'Blues', icon: <TextGlyph text="♪" tone="blue" /> }]} />
                {numeric('octaves', 'Oktaven', 1, 2)}
              </>
            )}
            {['drums', 'sequencer'].includes(kind) && (
              <Picker label="Instrumentengruppe" value={settings.mode || 'drumset'} onChange={(value) => patch({ mode: value })}
                options={[{ value: 'drumset', label: 'Schlagzeug', icon: 'speaker' as const }, { value: 'cajon', label: 'Cajón', icon: <TextGlyph text="◼" tone="orange" /> }, { value: 'hand', label: 'Bongos & Congas', icon: <TextGlyph text="◖◗" tone="orange" /> }, { value: 'orff', label: 'Orff-Instrumente', icon: 'music' as const }, { value: 'pads', label: 'Klang-Pads', icon: 'grid' as const }]} />
            )}
            {kind === 'soundstudio' && (
              <fieldset>
                <legend>Geräusche für das Hörspiel</legend>
                <Picker label="Geräusch" value={effect} onChange={setEffect}
                  options={(Object.entries(soundEffects) as [keyof typeof soundEffects, string][]).map(([value, label]) => ({ value, label, icon: 'audio_file' as const }))} />
                <button
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      const blob = await effectWav(effect);
                      await media(
                        new File([blob], effect + '.wav', {
                          type: 'audio/wav',
                        }),
                        (src) =>
                          patch({
                            tracks: [
                              ...(settings.tracks || []),
                              {
                                title: soundEffects[effect],
                                src,
                                offset: 0,
                                volume: 0.6,
                              },
                            ],
                          }),
                      );
                    } catch (e) {
                      setError((e as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Geräusch als Spur hinzufügen
                </button>
              </fieldset>
            )}
            {kind === 'mathtool' && (() => {
              const t = mathTool(settings);
              const sizes: [number, string][] =
                t.tool === 'boat' ? [[5, '5'], [10, '10'], [20, '20']] : t.tool === 'abacus' ? [[2, 'bis 20'], [10, 'bis 100']] : t.tool === 'ruler' ? [[10, '10 cm'], [15, '15 cm'], [20, '20 cm'], [30, '30 cm']] : [];
              return (
                <>
                  <Choices
                    label="Werkzeug"
                    value={t.tool}
                    onChange={(tool) => patch({ mathTool: tool, mathSize: tool === 'boat' ? 10 : tool === 'abacus' ? 2 : tool === 'ruler' ? 15 : 0 })}
                    options={[
                      { value: 'boat', label: 'Rechenschiffchen', icon: 'calculator' },
                      { value: 'abacus', label: 'Rechenrahmen', icon: 'org_unit' },
                      { value: 'ruler', label: 'Lineal', icon: 'ruler' },
                      { value: 'calc', label: 'Taschenrechner', icon: 'calculator' },
                    ]}
                  />
                  {sizes.length > 0 && (
                    <Choices
                      label="Größe"
                      value={t.n}
                      onChange={(mathSize) => patch({ mathSize })}
                      options={sizes.map(([value, label]) => ({ value, label, icon: <TextGlyph text={String(value)} /> }))}
                    />
                  )}
                </>
              );
            })()}
            {kind === 'zuordnung' && <ZuordnungOptions value={settings.dnd} title={settings.title || ''} onChange={(dnd) => patch({ dnd })} upload={media} busy={busy} />}
            {kind === 'textsachen' && <TextsachenOptions value={settings.ts} onChange={(ts) => patch({ ts })} upload={media} busy={busy} />}
            {kind === 'clapsyllables' && <ClapOptions value={settings.clap} onChange={(clap) => patch({ clap: clap as unknown as JsonValue })} />}
            {kind === 'anlaut' && <AnlautOptions value={settings.anlaut} onChange={(anlaut) => patch({ anlaut: anlaut as unknown as JsonValue })} />}
            {kind === 'syllablejoin' && <SynthOptions value={settings.synth} onChange={(synth) => patch({ synth: synth as unknown as JsonValue })} />}
            {kind === 'monsternames' && <MonsterOptions value={settings.monster} onChange={(monster) => patch({ monster: monster as unknown as JsonValue })} />}
            {kind === 'checkout' && <CheckoutOptions value={settings.checkout} onChange={(shop) => patch({ checkout: shop as unknown as JsonValue })} />}
            {kind === 'geodraw' && (() => {
              const g = geoConfig(settings.geo);
              // Every change of the settings makes a new series of tasks.
              const set = (values: Partial<GeoConfig>) => {
                const next = { ...g, ...values };
                patch({ geo: { ...next, tasks: makeTasks(next) } });
              };
              return (
                <>
                  <Choices label="Schwierigkeit" value={g.level} onChange={(level) => set({ level })} options={LEVELS.map((l) => ({ value: l.value, label: l.label, icon: <TextGlyph text={l.label[0]} /> }))} />
                  <p className="option-hint">{LEVELS.find((l) => l.value === g.level)?.hint}</p>
                  <Choices label="Aufgaben nacheinander" value={g.count} onChange={(count) => set({ count })} options={[1, 3, 5, 8, 10].map((n) => ({ value: n, label: String(n), icon: <TextGlyph text={String(n)} /> }))} />
                  <OptionGroup label="Formen (keine = alle)">
                    {GROUPS.map((x) => (
                      <ChoiceButton
                        key={x.value}
                        icon={<TextGlyph text={x.label[0]} />}
                        label={x.label}
                        pressed={g.groups.includes(x.value)}
                        onClick={() => set({ groups: g.groups.includes(x.value) ? g.groups.filter((v) => v !== x.value) : [...g.groups, x.value] })}
                      />
                    ))}
                  </OptionGroup>
                  <Choices label="Genauigkeit" value={g.tol} onChange={(tol) => set({ tol })} options={TOLERANCES.map((t) => ({ value: t.value, label: t.label, icon: <TextGlyph text={t.label[0]} /> }))} />
                  <p className="option-hint">{TOLERANCES.find((t) => t.value === g.tol)?.hint}</p>
                  <Choices label="Vorschau" value={g.flash} onChange={(flash) => set({ flash })} options={[[0, 'Aus'], [1, '1 Sek.'], [2, '2 Sek.'], [3, '3 Sek.']].map(([value, label]) => ({ value: value as number, label: label as string, icon: <TextGlyph text={String(value)} /> }))} />
                  <OptionGroup label={`Aufgaben (${g.tasks.length})`}>
                    {g.tasks.map((t, i) => (
                      <span key={i} className="option-hint">{i + 1}. {taskText(t)}</span>
                    ))}
                    <ChoiceButton icon="synchronize" label="Andere Aufgaben" onClick={() => set({})} />
                  </OptionGroup>
                  <p className="option-hint">Gezeichnet wird mit dem Stift am Lineal oder Geodreieck. „Start“ auf der Seite schaltet den Stift ein und legt das passende Werkzeug hin.</p>
                </>
              );
            })()}
            {kind === 'placevalue' && <PlaceValueOptions value={settings.place} onChange={(place) => patch({ place })} />}
            {kind === 'dienes' && <DienesOptions value={settings.dienes} onChange={(dienes) => patch({ dienes })} />}
            {kind === 'numberline' && <NumberLineOptions value={settings.numberline} onChange={(numberline) => patch({ numberline })} />}
            {kind === 'hundredfield' && <HundredFieldOptions value={settings.field} onChange={(field) => patch({ field })} />}
            {kind === 'receipt' && <ReceiptOptions value={settings.receipt} onChange={(receipt) => patch({ receipt })} />}
            {kind === 'mathboard' && (
              <Picker label="Rechenmaterial" value={settings.mode || 'beads'} onChange={(value) => patch({ mode: value })}
                options={[{ value: 'beads', label: 'Rechenrahmen / Zwanziger- und Hunderterfeld', icon: 'calculator' as const }, { value: 'place', label: 'Stellenwerttafel', icon: 'grid' as const }, { value: 'numberline', label: 'Zahlenstrahl', icon: 'timeline' as const }]} />
            )}
            {['communication', 'timetable', 'shop'].includes(kind) && (
              <div>
                <label className="property-label">
                  Felder; je eine Zeile
                  {kind === 'shop' ? ' · Ware = Preis in Cent' : ''}
                  <textarea
                    aria-label="Felder des Lernwerkzeugs"
                    value={(settings.cells || [])
                      .map((cell) =>
                        kind === 'shop'
                          ? `${cell.label} = ${cell.speak || 100}`
                          : cell.label,
                      )
                      .join('\n')}
                    onChange={(e) =>
                      patch({
                        cells: e.target.value
                          .split('\n')
                          .slice(0, 100)
                          .map((line, i) => {
                            const split = line.split('=');
                            return {
                              ...settings.cells?.[i],
                              label: split[0].trim(),
                              ...(kind === 'shop'
                                ? { speak: split[1]?.trim() || '100' }
                                : {}),
                            };
                          }),
                      })
                    }
                  />
                </label>
                <div className="cell-image-editors">
                  {(settings.cells || []).map((cell, i) => (
                    <div key={i}>
                      <span>{cell.label}</span>
                      {upload('image/*', (src) =>
                        patch({
                          cells: settings.cells!.map((cell, n) =>
                            n === i ? { ...cell, image: src } : cell,
                          ),
                        }),
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {['slideshow', 'multitimer'].includes(kind) && (
              <div>
                {(
                  settings.slides || [
                    { title: 'Erster Abschnitt', text: '', seconds: 60 },
                  ]
                ).map((slide, i) => (
                  <fieldset key={i} disabled={busy}>
                    <legend>
                      {kind === 'multitimer' ? 'Timer' : 'Folie'} {i + 1}
                    </legend>
                    <input
                      aria-label={`Titel ${i + 1}`}
                      value={slide.title}
                      onChange={(e) =>
                        patch({
                          slides: (settings.slides || []).map((s, n) =>
                            n === i ? { ...s, title: e.target.value } : s,
                          ),
                        })
                      }
                    />
                    <textarea
                      aria-label={`Text ${i + 1}`}
                      value={slide.text}
                      onChange={(e) =>
                        patch({
                          slides: settings.slides!.map((s, n) =>
                            n === i ? { ...s, text: e.target.value } : s,
                          ),
                        })
                      }
                    />
                    <label>
                      {kind === 'slideshow' ? 'Mindestdauer in Sekunden' : 'Sekunden'}{' '}
                      <input
                        type="number"
                        min="1"
                        max="3600"
                        value={slide.seconds || 5}
                        onChange={(e) =>
                          patch({
                            slides: settings.slides!.map((s, n) =>
                              n === i
                                ? { ...s, seconds: Math.max(1, Math.min(3600, Number(e.target.value) || 5)) }
                                : s,
                            ),
                          })
                        }
                      />
                    </label>
                    {kind === 'slideshow' && (
                      <>
                        {upload('image/*', (src) =>
                          patch({
                            slides: settings.slides!.map((s, n) =>
                              n === i ? { ...s, image: src } : s,
                            ),
                          }),
                          `Bild für Folie ${i + 1} wählen`,
                        )}
                        {upload('audio/*', (src) =>
                          patch({
                            slides: settings.slides!.map((s, n) =>
                              n === i ? { ...s, audio: src } : s,
                            ),
                          }),
                          `Ton für Folie ${i + 1} wählen`,
                        )}
                        {slide.image && <button type="button" onClick={() => patch({ slides: settings.slides!.map((s, n) => n === i ? { ...s, image: undefined } : s) })}>Bild entfernen</button>}
                        {slide.audio && <><p>Folienton hinterlegt.</p><button type="button" onClick={() => patch({ slides: settings.slides!.map((s, n) => n === i ? { ...s, audio: undefined } : s) })}>Ton entfernen</button></>}
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          slides: settings.slides!.filter((_, n) => n !== i),
                        })
                      }
                    >
                      Entfernen
                    </button>
                  </fieldset>
                ))}
                <button
                  type="button"
                  className="knopf"
                  disabled={busy}
                  onClick={() =>
                    patch({
                      slides: [
                        ...(settings.slides || []),
                        { title: 'Neuer Abschnitt', text: '', seconds: 5 },
                      ],
                    })
                  }
                >
                  ＋ Hinzufügen
                </button>
                {kind === 'slideshow' && (
                  <Picker label="Übergang" value={settings.transition || 'fade'} onChange={(transition) => patch({ transition })}
                    options={[{ value: 'fade', label: 'Überblenden', icon: 'stack_of_photos' as const }, { value: 'slide', label: 'Schieben', icon: 'right' as const }, { value: 'zoom', label: 'Zoomen', icon: 'expand' as const }, { value: 'kenburns', label: 'Kamerafahrt', icon: 'camcorder_pro' as const }, { value: 'none', label: 'Ohne', icon: 'cancel' as const }]} />
                )}
              </div>
            )}
            {kind === 'animation' && (
              <>
                <Picker label="Bewegung" value={settings.mode || 'linear'} onChange={(value) => patch({ mode: value })}
                  options={[{ value: 'linear', label: 'Gleichmäßig', icon: 'right' as const }, { value: 'in', label: 'Schneller werden', icon: 'positive_dynamic' as const }, { value: 'out', label: 'Langsamer werden', icon: 'down' as const }, { value: 'inout', label: 'Sanft an und aus', icon: 'synchronize' as const }]} />
                {(settings.frames || []).map((frame, i) => (
                  <fieldset key={i} disabled={busy}>
                    <legend>Schlüsselbild {i + 1}</legend>
                    <input
                      aria-label={`Text im Schlüsselbild ${i + 1}`}
                      value={frame.text}
                      onChange={(e) =>
                        patch({
                          frames: settings.frames!.map((f, n) =>
                            n === i ? { ...f, text: e.target.value } : f,
                          ),
                        })
                      }
                    />
                    <input
                      aria-label={`Symbol im Schlüsselbild ${i + 1}`}
                      maxLength={12}
                      value={frame.symbol || '●'}
                      onChange={(e) =>
                        patch({
                          frames: settings.frames!.map((f, n) =>
                            n === i ? { ...f, symbol: e.target.value } : f,
                          ),
                        })
                      }
                    />
                    {(['x', 'y'] as const).map((axis) => (
                      <label key={axis}>
                        {axis.toUpperCase()} (%)
                        <input
                          type="range"
                          min="5"
                          max="95"
                          value={frame[axis]}
                          onChange={(e) =>
                            patch({
                              frames: settings.frames!.map((f, n) =>
                                n === i
                                  ? { ...f, [axis]: Number(e.target.value) }
                                  : f,
                              ),
                            })
                          }
                        />
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          frames: settings.frames!.filter((_, n) => n !== i),
                        })
                      }
                      disabled={(settings.frames?.length || 0) < 3}
                    >
                      Entfernen
                    </button>
                  </fieldset>
                ))}
                <button
                  type="button"
                  className="knopf"
                  onClick={() =>
                    patch({
                      frames: [
                        ...(settings.frames || []),
                        { text: 'Neues Bild', symbol: '●', x: 50, y: 50 },
                      ],
                    })
                  }
                >
                  ＋ Schlüsselbild
                </button>
              </>
            )}
            {kind === 'animation' && (
              <>
                <h4>Weitere Objekte</h4>
                {(settings.actors || []).map((actor, i) => (
                  <fieldset key={i} disabled={busy}>
                    <legend>Objekt {i + 2}</legend>
                    <label>
                      Symbol{' '}
                      <input
                        maxLength={12}
                        value={actor.symbol}
                        onChange={(e) =>
                          patch({
                            actors: settings.actors!.map((a, n) =>
                              n === i ? { ...a, symbol: e.target.value } : a,
                            ),
                          })
                        }
                      />
                    </label>
                    <label>
                      Farbe{' '}
                      <input
                        type="color"
                        value={actor.color}
                        onChange={(e) =>
                          patch({
                            actors: settings.actors!.map((a, n) =>
                              n === i ? { ...a, color: e.target.value } : a,
                            ),
                          })
                        }
                      />
                    </label>
                    {upload('image/*', (src) =>
                      patch({
                        actors: settings.actors!.map((a, n) =>
                          n === i ? { ...a, image: src } : a,
                        ),
                      }),
                    )}
                    <label className="property-label">
                      Wegpunkte (X,Y in Prozent; je eine Zeile)
                      <textarea
                        value={actor.frames
                          .map((f) => `${f.x},${f.y}`)
                          .join('\n')}
                        onChange={(e) =>
                          patch({
                            actors: settings.actors!.map((a, n) =>
                              n === i
                                ? {
                                    ...a,
                                    frames: e.target.value
                                      .split('\n')
                                      .slice(0, 20)
                                      .map((line) => {
                                        const [x, y] = line
                                          .split(',')
                                          .map(Number);
                                        return {
                                          text: '',
                                          x: Math.max(0, Math.min(100, x || 0)),
                                          y: Math.max(0, Math.min(100, y || 0)),
                                        };
                                      }),
                                  }
                                : a,
                            ),
                          })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          actors: settings.actors!.filter((_, n) => n !== i),
                        })
                      }
                    >
                      Objekt entfernen
                    </button>
                  </fieldset>
                ))}
                <button
                  className="knopf"
                  type="button"
                  disabled={(settings.actors?.length || 0) >= 9}
                  onClick={() =>
                    patch({
                      actors: [
                        ...(settings.actors || []),
                        {
                          symbol: '★',
                          color: '#c49b42',
                          frames: [
                            { text: '', x: 85, y: 25 },
                            { text: '', x: 15, y: 70 },
                          ],
                        },
                      ],
                    })
                  }
                >
                  ＋ Weiteres Objekt
                </button>
              </>
            )}
            {['soundstudio', 'playlist', 'animation'].includes(
              kind,
            ) && (
              <div>
                {(settings.tracks || []).map((track, i) => (
                  <fieldset key={i}>
                    <input
                      aria-label={`Spurname ${i + 1}`}
                      value={track.title}
                      onChange={(e) =>
                        patch({
                          tracks: settings.tracks!.map((t, n) =>
                            n === i ? { ...t, title: e.target.value } : t,
                          ),
                        })
                      }
                    />
                    {kind === 'animation' && (
                      <>
                        <label>
                          Start in Sekunden
                          <input
                            type="number"
                            min="0"
                            max="180"
                            value={track.offset || 0}
                            onChange={(e) =>
                              patch({
                                tracks: settings.tracks!.map((t, n) =>
                                  n === i
                                    ? {
                                        ...t,
                                        offset: Math.max(
                                          0,
                                          Math.min(180, Number(e.target.value)),
                                        ),
                                      }
                                    : t,
                                ),
                              })
                            }
                          />
                        </label>
                        <label>
                          Lautstärke
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step=".05"
                            value={track.volume ?? 1}
                            onChange={(e) =>
                              patch({
                                tracks: settings.tracks!.map((t, n) =>
                                  n === i
                                    ? { ...t, volume: Number(e.target.value) }
                                    : t,
                                ),
                              })
                            }
                          />
                        </label>
                      </>
                    )}
                    {upload('audio/*', (src) =>
                      patch({
                        tracks: settings.tracks!.map((t, n) =>
                          n === i ? { ...t, src } : t,
                        ),
                      }),
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          tracks: settings.tracks!.filter((_, n) => n !== i),
                        })
                      }
                    >
                      Entfernen
                    </button>
                  </fieldset>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    patch({
                      tracks: [
                        ...(settings.tracks || []),
                        { title: 'Neue Spur', offset: 0, volume: 1 },
                      ],
                    })
                  }
                >
                  ＋ Tonspur
                </button>
              </div>
            )}
            {kind === 'map' && (
              <>
                <label className="property-label">
                  Orte: Name = X,Y (in Prozent)
                  <textarea
                    value={(settings.points || [])
                      .map((p) => `${p.label} = ${p.x},${p.y}`)
                      .join('\n')}
                    onChange={(e) =>
                      patch({
                        points: e.target.value
                          .split('\n')
                          .slice(0, 30)
                          .map((line) => {
                            const [label, coords] = line.split('=');
                            const [x, y] = (coords || '50,50')
                              .split(',')
                              .map(Number);
                            return {
                              label: label.trim(),
                              x: Math.max(0, Math.min(100, x || 0)),
                              y: Math.max(0, Math.min(100, y || 0)),
                            };
                          }),
                      })
                    }
                  />
                </label>
                {upload('image/*', (src) => patch({ background: src }))}
              </>
            )}
            {kind === 'geometry' && <GeometryOptions key={`${kind}:${element?.id || 'new'}`} settings={settings} onChange={patch} />}
            {[
              'monster',
              'synthesis',
              'clapping',
              'alphabet',
              'communication',
              'clock',
              'calendar',
              'timetable',
              'reading',
              'syllables',
            ].includes(kind) && (
              <VoiceOptions settings={settings} onChange={patch} />
            )}
            {['slideshow', 'animation', 'playlist'].includes(kind) && (
              <label>
                <input
                  type="checkbox"
                  checked={!!settings.repeat}
                  onChange={(e) => patch({ repeat: e.target.checked })}
                />{' '}
                In Schleife abspielen
              </label>
            )}
            {[
              'wordsearch',
              'memory',
              'maze',
              'quiz',
              'shop',
              'echo',
              'notequiz',
              'falling',
            ].includes(kind) && numeric('seed', 'Aufgabenvariante', 1, 999999)}
            {[
              'monster',
              'alphabet',
              'crossword',
              'wordsearch',
              'wordle',
              'reading',
            ].includes(kind) && (
              <WordBank onSelect={(words) => patch({ words: kind === 'alphabet' ? words.slice(0, 40) : words })} />
            )}
            </>}
            {musicProgress && <p role="status">{musicProgress} <button type="button" onClick={() => musicRequest.current?.abort()}>Bildsuche abbrechen</button></p>}
            {error && (
              <p className="fehler" role="alert">
                {error}
              </p>
            )}
            <div className="dialog-actions">
              <button type="button" className="knopf" onClick={onClose}>
                Abbrechen
              </button>
              <button className="knopf knopf-haupt" disabled={busy}>
                Auf die Seite übernehmen
              </button>
            </div>
          </form>
          )}
        </div>
        {showAI && (
          <AiDialog
            format={
              kind === 'quiz'
                ? 'quiz'
                : kind === 'slideshow'
                  ? 'slides'
                  : ['typing', 'reading', 'cloze', 'karaoke'].includes(kind)
                    ? 'text'
                    : 'words'
            }
            onClose={() => setShowAI(false)}
            onAccept={(values) => patch(kind === 'karaoke' && values.text !== undefined ? { ...values, karaokeTimes: undefined } : values)}
          />
        )}
      </section>
    </div>
  );
}
