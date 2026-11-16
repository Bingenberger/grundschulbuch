/* eslint-disable @next/next/no-img-element -- Generated pictures of the figure. */
'use client';
// Settings of a Figur with the choices of the reference's figure editor: name,
// child or adult, skin, hair, hat, feeling, eyes, brows, mouth, cheeks, beard,
// glasses, clothes, shoes, and what it says – each choice shown as a picture of
// the figure itself, as in the reference. (The movements of the reference's
// editor are not offered here; the figure waves or talks.)
import type { JsonValue, LearningSettings } from '@/lib/learning/catalog';
import { FIGURE_CHOICES, FIGURE_COLORS, FIGURE_CSS, FIGURE_PITCHES, figureSvg, figureView } from '@/lib/reference/tools-runtime';
import { figureLook, sayOf } from './FigureWidget';
import ToolForm, { type Draft, type Field } from './ToolForm';

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
  { t: 'note', text: 'Leer lassen: Die Figur sagt ihren Namen. Mit Text spricht sie ihn, der Mund bewegt sich dazu.' },
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

export default function FigureOptions({ settings, onChange, upload, busy }: { settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean }) {
  const draft = figureDraft(settings);
  const preview = svg(figureSvg(figureLook(settings.av), {}, {}));
  return (
    <div className="receipt-options tool-options">
      <style>{FIGURE_CSS}</style>
      <div className="tool-preview figure-preview"><img src={preview} alt="Vorschau der Figur" /></div>
      <p className="option-hint">Ein Tipp auf die Figur: sie winkt und sagt „Hallo, ich bin …“ oder ihren Text.</p>
      <ToolForm fields={FIGURE_FIELDS} value={draft} onChange={(d) => onChange(figureFromDraft(d))} upload={upload} busy={busy} />
    </div>
  );
}
