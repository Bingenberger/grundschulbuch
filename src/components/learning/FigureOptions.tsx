/* eslint-disable @next/next/no-img-element -- Generated pictures of the figure. */
'use client';
// Settings of a Figur with the choices of the reference's figure editor: name,
// child or adult, skin, hair, hat, feeling, eyes, brows, mouth, cheeks, beard,
// glasses, clothes, shoes, and what it says – each choice shown as a picture of
// the figure itself, as in the reference – with an own recording and the
// movement when tapped (Lernsachen-Heft 1.49.0).
import type { JsonValue, LearningSettings } from '@/lib/learning/catalog';
import { FIGURE_CHOICES, FIGURE_COLORS, FIGURE_CSS, FIGURE_PITCHES, figureSvg, figureView } from '@/lib/reference/tools-runtime';
import { FIGURE_MOVES, figureLook, moveOf, sayOf } from './FigureWidget';
import ToolForm, { type Draft, type Field } from './ToolForm';
import OwnRecording from './OwnRecording';
import { Choices } from '../ui/Choice';
import { speakGerman } from '@/lib/speech';

type Choice = { id: string; label: string };
const choices = FIGURE_CHOICES as unknown as Record<string, Choice[]>;
const colors = FIGURE_COLORS as unknown as Record<string, string[]>;
const svg = (markup: unknown) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(String(markup))}`;
/** A picture of the figure with one part changed, as the reference's editor shows it. */
const look = (d: Draft, change: Draft, part: string) => { const av = figureLook({ ...d, ...change }); return svg(figureSvg(av, {}, { view: figureView(av, part) })); };
const gallery = (key: string, label: string, part: string, extra: (id: string) => Draft = () => ({}), list: Choice[] = choices[key]): Field =>
  ({ t: 'gallery', key, label, options: (d) => list.map((c) => ({ id: c.id, label: c.label, src: look(d, { [key]: c.id, ...extra(c.id) }, part) })) });

export const FIGURE_FIELDS: Field[] = [
  { t: 'text', key: 'name', label: 'Name', placeholder: 'z. B. Mia', max: 40 },
  { t: 'gallery', key: 'kind', label: 'Figur', options: (d) => [{ id: 'child', label: 'Kind' }, { id: 'adult', label: 'Erwachsen' }].map((c) => ({ ...c, src: look(d, { child: c.id === 'child' }, 'all') })) },
  { t: 'colors', key: 'skin', label: 'Hautfarbe', colors: colors.skin },
  gallery('hair', 'Frisur', 'head', () => ({ hat: 'none' })),
  { t: 'colors', key: 'hairColor', label: 'Haarfarbe', colors: colors.hairColor },
  gallery('hat', 'Kopfbedeckung', 'head'),
  { t: 'colors', key: 'hatColor', label: 'Farbe der Kopfbedeckung', colors: colors.hatColor, when: (d) => d.hat !== 'none' || d.hair === 'plaits' },
  gallery('feel', 'Gefühl', 'face', () => ({ glasses: 'none' }), [{ id: 'none', label: 'Kein Gefühl' }, ...choices.feel]),
  gallery('eyes', 'Augen', 'eyes', () => ({ glasses: 'none' })),
  { t: 'colors', key: 'eyeColor', label: 'Augenfarbe', colors: colors.eyeColor, when: (d) => d.eyes === 'round' },
  { t: 'toggle', key: 'brows', label: 'Augenbrauen' },
  gallery('mouth', 'Mund', 'mouth'),
  { t: 'toggle', key: 'cheeks', label: 'Rote Bäckchen' },
  gallery('beard', 'Bart', 'face'),
  gallery('glasses', 'Brille', 'eyes'),
  gallery('top', 'Oberteil', 'body'),
  { t: 'colors', key: 'topColor', label: 'Farbe des Oberteils', colors: colors.topColor },
  gallery('pattern', 'Muster', 'body'),
  { ...gallery('bottom', 'Unterteil', 'legs'), when: (d) => d.top !== 'dress' },
  { t: 'colors', key: 'bottomColor', label: 'Farbe des Unterteils', colors: colors.bottomColor },
  { t: 'colors', key: 'shoes', label: 'Farbe der Schuhe', colors: colors.shoes },
  { t: 'text', key: 'sayText', label: 'Das sagt die Figur beim Antippen', placeholder: 'z. B. Hallo! Heute lernen wir die Uhr.', max: 300 },
  { t: 'note', text: 'Leer lassen: Die Figur sagt ihren Namen. Mit Text spricht sie ihn, der Mund bewegt sich dazu. Im Puppentheater spricht sie nur mit eigener Aufnahme. Wie sie sich dabei bewegt, wählst du unter „Bewegung“.' },
  { t: 'choice', key: 'sayPitch', label: 'Stimme', options: (FIGURE_PITCHES as unknown as Choice[]).map((p) => ({ value: p.id, label: p.label })) },
];

/** Figure settings ↔ what the form edits (the figure, “Kind/Erwachsen”, its speech). */
export const figureDraft = (s: LearningSettings): Draft => {
  const av = figureLook(s.av), say = sayOf(s.say);
  return { ...av, kind: av.child ? 'child' : 'adult', feel: av.feel ?? 'none', sayText: say.text, sayPitch: say.pitch };
};
export const figureFromDraft = ({ kind, feel, sayText, sayPitch, ...av }: Draft) => ({
  av: figureLook({ ...av, child: kind === 'child', ...(feel && feel !== 'none' ? { feel } : { feel: undefined }), name: String(av.name ?? '').trim() }) as unknown as JsonValue,
  say: { text: String(sayText ?? ''), pitch: String(sayPitch ?? 'normal') } as unknown as JsonValue,
});

let playing: HTMLAudioElement | null = null;
/** “Anhören”: the recording, else the text or “Hallo, ich bin …”. */
export function trySay(say: { text: string; audio?: string }, name = '') {
  playing?.pause();
  if (say.audio) { playing = new Audio(say.audio); void playing.play().catch(() => undefined); return; }
  const text = say.text.trim() || (name.trim() ? `Hallo, ich bin ${name.trim()}!` : '');
  if (text) speakGerman(text);
}

export default function FigureOptions({ settings, onChange, upload, busy }: { settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean }) {
  const draft = figureDraft(settings);
  const say = sayOf(settings.say), move = moveOf(settings.move);
  const preview = svg(figureSvg(figureLook(settings.av), {}, {}));
  const talks = !!(say.text.trim() || say.audio);
  return (
    <div className="receipt-options tool-options">
      <style>{FIGURE_CSS}</style>
      <div className="tool-preview figure-preview"><img src={preview} alt="Vorschau der Figur" /></div>
      <p className="option-hint">Ein Tipp auf die Figur: sie winkt und sagt „Hallo, ich bin …“ oder ihren Text.</p>
      <ToolForm fields={FIGURE_FIELDS} value={draft} onChange={(d) => { const next = figureFromDraft(d); onChange({ ...next, say: { ...(next.say as object), ...(say.audio ? { audio: say.audio } : {}) } as unknown as JsonValue }); }} upload={upload} busy={busy} />
      <div className="receipt-option">
        <strong>Eigene Aufnahme</strong>
        <OwnRecording audio={say.audio} onChange={(audio) => onChange({ say: { text: say.text, pitch: say.pitch, ...(audio ? { audio } : {}) } as unknown as JsonValue })}
          onTry={() => trySay(say, String(figureLook(settings.av).name ?? ''))}
          hint={say.audio ? 'Mit eigener Aufnahme spricht die Aufnahme – der Text ist dann nur noch die Beschreibung.' : 'Ohne eigene Aufnahme spricht die Computerstimme.'} />
      </div>
      <Choices label="So bewegt sich die Figur beim Antippen" value={move ?? ''} onChange={(m) => onChange({ move: m || undefined })}
        options={[{ value: '', label: talks ? 'Von selbst (reden)' : 'Von selbst (winken)', icon: 'refresh' as const }, ...FIGURE_MOVES.map(([value, label]) => ({ value, label, icon: <span className="figure-move" aria-hidden="true">{MOVE_ICONS[value]}</span> }))]} />
      <p className="option-hint">Die Bewegung läuft, während die Figur spricht – auch beim Abspielen im Puppentheater.</p>
      <p className="option-hint">In jedem Heft wiederverwenden: die Figur auf der Seite antippen, dann „In Sammlung sichern“ – sie liegt dann unter „Selbst gemacht“.</p>
    </div>
  );
}
const MOVE_ICONS: Record<string, string> = { talk: '🗣', wave: '👋', cross: '🙅', dance: '💃', jump: '🦘', bow: '🙇', clap: '👏', cheer: '🙌', random: '🔀' };
