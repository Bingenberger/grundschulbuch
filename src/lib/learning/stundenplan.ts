// Bilder-Stundenplan of Lernsachen-Heft: the timetable as the reference keeps
// it (title, days, lessons, times, breaks, subjects with colour and picture,
// the plan, a row “Nach der Schule”, design, font). Pictures are media
// addresses: the ARASAAC pictures of the preset subjects ship with the app
// (/stundenplan/<id>.webp), own pictures lie on the school server.
import { TIMETABLE_AFTER, TIMETABLE_SUBJECTS, timetableConfig, timetableStart } from '../reference/class-runtime';

export type Subject = { id: string; name: string; color: string; img?: string };
export type Break = { after: number; min: number; label: string; sub?: string };
export type Timetable = {
  title: string;
  days: 5 | 6 | 7;
  lessons: number;
  start: number;
  len: number;
  breaks: Break[];
  times: boolean;
  show: 'both' | 'pic' | 'text';
  design: string;
  font: string;
  today: boolean;
  subjects: Subject[];
  plan: string[][][];
  after: { on: boolean; label: string; options: Subject[]; plan: string[][] };
};

type Preset = { name: string; color: string; arasaac: number };
export const presetPicture = (id: number) => `/stundenplan/${id}.webp`;
const fromPresets = (list: Preset[], prefix: string): Subject[] => list.map((p, i) => ({ id: `${prefix}${i}`, name: p.name, color: p.color, img: presetPicture(p.arasaac) }));
export const presetSubjects = () => fromPresets(TIMETABLE_SUBJECTS as Preset[], 's');
export const presetAfter = () => fromPresets(TIMETABLE_AFTER as Preset[], 'a');

/** A new timetable as in the reference (qEe): the standard subjects, a break with the picture “Pause”. */
export function defaultTimetable(): Timetable {
  const t = timetableStart() as Timetable;
  t.subjects = presetSubjects();
  t.after = { ...t.after, options: presetAfter(), plan: Array.from({ length: 7 }, () => []) };
  t.plan = Array.from({ length: 7 }, () => Array.from({ length: 10 }, () => []));
  const pause = t.subjects.find((s) => s.name === 'Pause');
  if (pause) t.breaks = [{ ...t.breaks[0], sub: pause.id }];
  return t;
}

/** The timetable cleaned like the reference does (wh); pictures must be media addresses. */
export function timetable(raw: unknown): Timetable {
  if (!raw || typeof raw !== 'object') return defaultTimetable();
  return timetableConfig(raw, (img: unknown) => (typeof img === 'string' && /^(\/stundenplan\/\d+\.webp|\/api\/medien\/[\w./-]+|data:image\/)/.test(img) ? img : undefined)) as Timetable;
}

/** Pictures of a timetable, as the assets the reference's renderer asks for. */
export function timetableAssets(t: Timetable) {
  const assets: Record<string, { dataUrl: string }> = {};
  for (const s of [...t.subjects, ...t.after.options]) if (s.img) assets[s.img] = { dataUrl: s.img };
  return assets;
}
