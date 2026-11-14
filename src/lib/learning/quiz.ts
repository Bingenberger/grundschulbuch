// Quiz of Quizsachen (Lernsachen.blog), as in Lernsachen-Heft: a template of
// “Neues Quiz” (Bunte Kacheln, Bilderrätsel …), the questions written as text
// like in “Fragen per Text eingeben”, pictures and the course of the quiz
// (“Ablauf”). The builder of Quizsachen (reference/quizsachen-builder.ts) makes
// the quiz once in the settings; it is kept, so a child's state (which refers
// to its questions and answers) stays valid. The original player (QuizPlayer)
// runs it; pictures are media addresses until the frame is built.
import { newQuiz, questionFrom, readQuestions, TEMPLATES } from '../reference/quizsachen-builder';

export const QUIZ_TEMPLATES = (TEMPLATES as { id: string; name: string; desc: string; type: string }[]).map(({ id, name, desc, type }) => ({ id, name, desc, type }));
const templateIds = QUIZ_TEMPLATES.map((t) => t.id);

/** The “Ablauf” of Quizsachen (quiz.settings), with its defaults. */
export type QuizSettings = {
  feedback: 'immediate' | 'end';
  attempts: 1 | 2;
  showSolution: boolean;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  partialCredit: boolean;
  allowBack: boolean;
  progress: 'bar' | 'dots' | 'number' | 'none';
  startCard: boolean;
  overview: boolean;
  retryWrong: boolean;
  retryAll: boolean;
  sounds: boolean;
  autoRead: boolean;
  passPercent: number;
};
const FLAGS = ['showSolution', 'shuffleQuestions', 'shuffleAnswers', 'partialCredit', 'allowBack', 'startCard', 'overview', 'retryWrong', 'retryAll', 'sounds', 'autoRead'] as const;

export type QuizPicture = { term: string; image: string; source?: 'arasaac' | 'upload' };
export type QuizConfig = {
  template: string;
  /** The questions as in “Fragen per Text eingeben” (Quizsachen format, GIFT or Aiken). */
  text: string;
  autoPictures: boolean;
  /** Pictures by search term (what stands in “[Bild: …]”). */
  pictures: QuizPicture[];
  settings: QuizSettings;
  /** The quiz made by the builder (pictures point to media addresses). */
  quiz?: Record<string, unknown>;
};

/** Player font families (“QZ …”) and the family of the same font in our page. */
export const QZ_FAMILIES: Record<string, string> = {
  'QZ Nunito': 'Nunito', 'QZ Lexend': 'Lexend', 'QZ Atkinson Hyperlegible': 'Atkinson Hyperlegible',
  'QZ Andika': 'Andika', 'QZ Merriweather': 'Merriweather', 'QZ Caveat': 'Caveat',
};

/** The course a template starts with (e.g. Teilpunkte for Reihenfolge, Vorlesen for Hör-Quiz). */
export function templateSettings(template: string): QuizSettings {
  return quizSettings(newQuiz(template).settings);
}

export function defaultQuiz(template = 'kacheln'): QuizConfig {
  return { template, text: '', autoPictures: true, pictures: [], settings: templateSettings(template) };
}

function quizSettings(raw: unknown): QuizSettings {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<keyof QuizSettings, unknown>>;
  const flags = Object.fromEntries(FLAGS.map((k) => [k, typeof v[k] === 'boolean' ? v[k] : !['shuffleQuestions', 'partialCredit', 'autoRead'].includes(k)])) as Record<(typeof FLAGS)[number], boolean>;
  const pass = Number(v.passPercent);
  return {
    ...flags,
    feedback: v.feedback === 'end' ? 'end' : 'immediate',
    attempts: v.attempts === 2 ? 2 : 1,
    progress: v.progress === 'dots' || v.progress === 'number' || v.progress === 'none' ? v.progress : 'bar',
    passPercent: Number.isFinite(pass) ? Math.max(0, Math.min(100, Math.round(pass / 5) * 5)) : 60,
  };
}

export function quizConfig(raw: unknown): QuizConfig {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<QuizConfig>;
  const template = templateIds.includes(v.template as string) ? (v.template as string) : 'kacheln';
  return {
    template,
    text: typeof v.text === 'string' ? v.text.slice(0, 20000) : '',
    autoPictures: v.autoPictures !== false,
    pictures: (Array.isArray(v.pictures) ? v.pictures : [])
      .filter((p) => p && typeof p.term === 'string' && typeof p.image === 'string' && p.image)
      .map((p) => ({ term: p.term, image: p.image, ...(p.source === 'upload' || p.source === 'arasaac' ? { source: p.source } : {}) }))
      .slice(0, 120),
    settings: v.settings ? quizSettings(v.settings) : templateSettings(template),
    ...(v.quiz && typeof v.quiz === 'object' ? { quiz: v.quiz } : {}),
  };
}

export type ReadQuestion = { type: 'single' | 'multiple' | 'truefalse' | 'order'; text: string; image?: string; answers: { text: string; correct: boolean; image?: string }[]; feedback: { correct: string; wrong: string } };
export type ReadQuiz = { format: 'quizsachen' | 'gift' | 'aiken'; title?: string; cover?: string; questions: ReadQuestion[]; issues: { line?: number; message: string }[] };

/** The questions read from the text, as Quizsachen reads them. */
export function readQuiz(text: string): ReadQuiz {
  return readQuestions(text) as ReadQuiz;
}

/** Search terms of the pictures (“[Bild: …]” at questions, answers and “Titelbild:”). */
export function quizPictureTerms(read: ReadQuiz): string[] {
  const terms = new Set<string>();
  if (read.cover) terms.add(read.cover);
  for (const q of read.questions) {
    if (q.image) terms.add(q.image);
    for (const a of q.answers) if (a.image) terms.add(a.image);
  }
  return [...terms];
}

const ARASAAC = {
  source: 'arasaac', author: 'Sergio Palao', license: 'CC BY-NC-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de', sourceUrl: 'https://arasaac.org',
  attribution: 'Piktogramm: Sergio Palao. Herkunft: ARASAAC (https://arasaac.org). Lizenz: CC BY-NC-SA 4.0. Eigentümer: Regierung von Aragón (Spanien).',
};

/**
 * Builds the quiz as “Neues Quiz” with the template and then “Fragen per Text
 * eingeben” do in Quizsachen. `sizes` holds width and height of the pictures.
 */
export function buildQuiz(c: QuizConfig, title: string, sizes: Map<string, { width: number; height: number }>) {
  const read = readQuiz(c.text);
  const quiz = newQuiz(c.template) as Record<string, unknown> & { questions: unknown[]; assets: Record<string, unknown>; title: { text: string }; settings: QuizSettings; cover?: string };
  quiz.questions = [];
  const ids = new Map<string, string>();
  const picture = (term?: string) => {
    if (!term) return undefined;
    const p = c.pictures.find((x) => x.term === term);
    if (!p) return undefined;
    let id = ids.get(p.image);
    if (!id) {
      id = `as${ids.size + 1}`;
      ids.set(p.image, id);
      const size = sizes.get(p.image) ?? { width: 300, height: 300 };
      quiz.assets[id] = { id, kind: 'image', mime: /\.jpe?g$/i.test(p.image) ? 'image/jpeg' : /\.webp$/i.test(p.image) ? 'image/webp' : 'image/png', dataUrl: p.image, ...size, name: term, license: p.source === 'upload' ? { source: 'upload' } : { ...ARASAAC, title: term } };
    }
    return id;
  };
  for (const q of read.questions) quiz.questions.push(questionFrom(quiz, quiz, q, undefined, picture));
  const cover = picture(read.cover);
  if (cover) quiz.cover = cover;
  quiz.title.text = (read.title || title || '').trim();
  quiz.settings = { ...quiz.settings, ...c.settings };
  return quiz;
}

/** What still stops the quiz (shown under the questions). */
export function quizProblem(read: ReadQuiz, text: string): string | null {
  if (!text.trim()) return 'Schreibe die Fragen ins Feld.';
  if (!read.questions.length) return 'Es wurde noch keine Frage erkannt. Fragen beginnen mit „?“.';
  return null;
}
