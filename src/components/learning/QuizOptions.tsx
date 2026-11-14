/* eslint-disable @next/next/no-img-element -- School media. */
'use client';
// Settings of a quiz, laid out after Quizsachen: a template of “Neues Quiz”,
// the questions as in “Fragen per Text eingeben” (with example and “So
// geht's”), pictures, the “Ablauf” – and a preview as the children see it.
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { buildQuiz, QUIZ_TEMPLATES, quizConfig, quizPictureTerms, quizProblem, readQuiz, templateSettings, type QuizConfig, type QuizPicture, type QuizSettings } from '@/lib/learning/quiz';
import { EXAMPLE, TYPES } from '@/lib/reference/quizsachen-builder';
import { findPicture, pictureSize } from '@/lib/learning/picture-search';
import { Slider, Toggle } from '../sheets/SheetParts';
import { Choices } from './OptionControls';
import PlayerFrame from './PlayerFrame';
import { useQuizPage } from './QuizFrame';

const PREVIEW = { w: 1000, h: 700 };
const types = TYPES as Record<string, { label: string }>;
type Props = { value: unknown; title: string; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean };

/** “So geht's” of “Fragen per Text eingeben” in Quizsachen. */
const HELP: [string, string][] = [
  ['? Frage', 'Eine neue Frage beginnt mit einem Fragezeichen.'],
  ['(x) richtig  ( ) falsch', 'Einfachauswahl – genau eine Antwort ist richtig.'],
  ['[x] richtig  [ ] falsch', 'Mehrfachauswahl – eine oder mehrere richtig.'],
  ['+ richtig  - falsch', 'Kurzform; mehrere „+“ ergeben eine Mehrfachauswahl.'],
  ['= richtig  = falsch', 'Richtig oder falsch.'],
  ['1. Teil  2. Teil', 'Reihenfolge – in der richtigen Reihenfolge nummeriert.'],
  ['> Erklärung', 'Rückmeldung (>+ nur bei richtig, >- nur bei falsch).'],
  ['[Bild: Igel]', 'Suchwort für ein Piktogramm (ARASAAC) – an Frage oder Antwort.'],
  ['Titel: …', 'Titel des Quiz (optional, ganz oben).'],
];

export default function QuizOptions({ value, title, onChange, upload, busy }: Props) {
  const c = quizConfig(value);
  const latest = useRef(c);
  useLayoutEffect(() => { latest.current = c; });
  const set = (next: Partial<QuizConfig>) => onChange({ ...latest.current, ...next } as unknown as JsonValue);
  const setting = (next: Partial<QuizSettings>) => set({ settings: { ...latest.current.settings, ...next } });
  const s = c.settings;
  const [help, setHelp] = useState(false);

  // Start with the example of Quizsachen.
  useEffect(() => {
    if (!c.text.trim()) set({ text: EXAMPLE as string });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const read = useMemo(() => readQuiz(c.text), [c.text]);
  const problem = quizProblem(read, c.text);
  const terms = quizPictureTerms(read);
  const termsKey = terms.join('\n');
  const pictureOf = (term: string) => c.pictures.find((p) => p.term === term)?.image;
  const setPicture = (term: string, image?: string, source: QuizPicture['source'] = 'arasaac') =>
    set({ pictures: [...latest.current.pictures.filter((p) => p.term !== term), ...(image ? [{ term, image, source }] : [])] });

  // Pictures that are missing are looked for by themselves (ARASAAC), like
  // “Bilder automatisch suchen” in Quizsachen.
  const searched = useRef(new Set<string>());
  const [searching, setSearching] = useState(false);
  const [note, setNote] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!c.autoPictures) return;
    const todo = terms.filter((t) => !pictureOf(t) && !searched.current.has(t)).slice(0, 24);
    if (!todo.length) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        for (const term of todo) {
          searched.current.add(term);
          const src = await findPicture(term, controller.signal);
          if (src && !latest.current.pictures.some((p) => p.term === term)) setPicture(term, src);
        }
      } catch (e) {
        if (!controller.signal.aborted) setNote((e as Error).message);
      } finally {
        setSearching(false);
      }
    }, 1000);
    return () => { window.clearTimeout(timer); controller.abort(); setSearching(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termsKey, c.autoPictures, retry]);

  // Build the quiz a moment after each change.
  const buildKey = JSON.stringify([c.template, c.text, c.pictures, c.settings, title, problem]);
  useEffect(() => {
    if (problem) { if (latest.current.quiz) set({ quiz: undefined }); return; }
    let live = true;
    const timer = window.setTimeout(async () => {
      const sizes = new Map<string, { width: number; height: number }>();
      for (const p of latest.current.pictures) sizes.set(p.image, await pictureSize(p.image));
      if (!live) return;
      try {
        set({ quiz: buildQuiz(latest.current, title, sizes) });
      } catch (e) {
        setNote(`Das Quiz lässt sich so nicht bauen: ${(e as Error).message}`);
      }
    }, 350);
    return () => { live = false; window.clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildKey]);
  const preview = useQuizPage(c.quiz, null);

  const counts = read.questions.reduce<Record<string, number>>((n, q) => ({ ...n, [q.type]: (n[q.type] ?? 0) + 1 }), {});
  const summary = `${read.questions.length} ${read.questions.length === 1 ? 'Frage' : 'Fragen'}: ${Object.entries(counts).map(([t, n]) => `${n}× ${types[t]?.label ?? t}`).join(', ')}`;
  const immediate = s.feedback === 'immediate';

  return (
    <div className="receipt-options ts-options">
      <section className="ts-part">
        <h4>Vorlage</h4>
        <div className="ts-modes" role="radiogroup" aria-label="Vorlage">
          {QUIZ_TEMPLATES.map((t) => (
            <button key={t.id} type="button" role="radio" aria-checked={c.template === t.id} className={`ts-mode${c.template === t.id ? ' is-active' : ''}`} onClick={() => set({ template: t.id, settings: templateSettings(t.id), quiz: undefined })}>
              <strong>{t.id === 'leer' ? 'Schlicht' : t.name}</strong>
              <span>{t.id === 'leer' ? 'Ohne besondere Gestaltung – Frage oben, Antworten darunter.' : t.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="ts-part">
        <h4>Fragen</h4>
        <p className="option-hint">Schreibe die Fragen wie in Quizsachen unter „Fragen per Text eingeben“. Fragen im GIFT-Format (Moodle/mebis) und im Aiken-Format werden auch erkannt.</p>
        <div className="learning-actions">
          <button type="button" className="knopf compact" onClick={() => set({ text: EXAMPLE as string })}>Beispiel</button>
          <button type="button" className="knopf compact" aria-pressed={help} onClick={() => setHelp(!help)}>So geht&apos;s</button>
        </div>
        {help && (
          <table className="dnd-help">
            <tbody>
              {HELP.map(([code, text]) => (
                <tr key={code}><td>{code.split('  ').map((x) => <code key={x}>{x}</code>).reduce<ReactNode[]>((a, b, i) => (i ? [...a, ' ', b] : [b]), [])}</td><td>{text}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        <textarea className="dnd-input" aria-label="Fragen als Text" rows={12} spellCheck value={c.text} placeholder={'? Wie viele Beine hat eine Spinne?\n( ) sechs\n(x) acht\n( ) zehn'} onChange={(e) => set({ text: e.target.value })} />
        {problem ? <p className="dnd-status is-problem" role="status">⚠ {problem}</p> : <p className="dnd-status" role="status">✓ {summary}</p>}
        {read.title && <p className="option-hint">Titel: <strong>{read.title}</strong></p>}
        {read.issues.length > 0 && <ul className="ts-checks">{read.issues.slice(0, 5).map((w, i) => <li key={i}>{w.message}</li>)}</ul>}
      </section>

      {terms.length > 0 && (
        <section className="ts-part">
          <h4>Bilder</h4>
          <Toggle checked={c.autoPictures} label="Bilder automatisch suchen" hint={`Für jedes [Bild: …] wird das erste passende Piktogramm von ARASAAC eingefügt (CC BY-NC-SA). Du kannst es danach ändern.`} onChange={(v) => set({ autoPictures: v })} />
          {searching && <p className="option-hint" role="status">Bilder werden gesucht …</p>}
          {note && <p className="option-hint" role="status">{note}</p>}
          <div className="ts-pictures">
            {terms.map((term) => {
              const image = pictureOf(term);
              return (
                <div key={term} className="ts-picture">
                  {image ? <img src={image} alt={term} /> : <span className="ts-picture-empty" aria-hidden="true">?</span>}
                  <strong>{term}</strong>
                  <span className="ts-picture-actions">
                    <label className="knopf compact">
                      {image ? 'Ändern' : 'Bild wählen'}
                      <input className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label={`Bild für ${term} wählen`} disabled={busy} onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void upload(file, (src) => setPicture(term, src, 'upload'));
                        e.target.value = '';
                      }} />
                    </label>
                    {image ? (
                      <button type="button" className="knopf compact" aria-label={`Bild für ${term} entfernen`} onClick={() => { searched.current.add(term); setPicture(term); }}>Ohne Bild</button>
                    ) : (
                      <button type="button" className="knopf compact" aria-label={`Bild für ${term} suchen`} onClick={() => { searched.current.delete(term); setNote(''); set({ autoPictures: true }); setRetry((n) => n + 1); }}>Suchen</button>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="ts-part">
        <h4>Rückmeldung</h4>
        <Choices label="Wann gibt es Rückmeldung?" value={s.feedback} onChange={(feedback) => setting({ feedback })} options={[{ value: 'immediate', label: 'Nach jeder Frage' }, { value: 'end', label: 'Erst am Ende' }]}
          hint={immediate ? 'Überprüfen, sofort sehen, ob es stimmt – dann weiter.' : 'Alle Fragen beantworten, das Ergebnis kommt auf der Abschlusskarte.'} />
        {immediate && <Choices label="Versuche pro Frage" value={s.attempts} onChange={(attempts) => setting({ attempts })} options={[{ value: 1, label: 'Ein Versuch' }, { value: 2, label: 'Zwei Versuche' }]} hint={s.attempts === 2 ? 'Im zweiten Versuch gibt es die halbe Punktzahl.' : undefined} />}
        {!immediate && <Toggle checked={s.allowBack} label="„Zurück“-Knopf" hint="Antworten können bis zum Ende geändert werden." onChange={(allowBack) => setting({ allowBack })} />}
        <Toggle checked={s.showSolution} label="Richtige Lösung zeigen" hint={immediate ? 'Nach einer falschen Antwort.' : 'Beim Ansehen der Antworten am Ende.'} onChange={(showSolution) => setting({ showSolution })} />
        <Toggle checked={s.sounds} label="Töne für richtig und falsch" onChange={(sounds) => setting({ sounds })} />
      </section>

      <section className="ts-part">
        <h4>Bewertung und Reihenfolge</h4>
        <Toggle checked={s.partialCredit} label="Teilpunkte" hint="Mehrfachauswahl und Reihenfolge: anteilig Punkte statt alles oder nichts." onChange={(partialCredit) => setting({ partialCredit })} />
        <Slider label="Bestanden ab" value={s.passPercent} min={0} max={100} step={5} format={(v) => `${v} %`} hint="Für die Sterne auf der Abschlusskarte." onChange={(passPercent) => setting({ passPercent })} />
        <Toggle checked={s.shuffleQuestions} label="Fragen mischen" onChange={(shuffleQuestions) => setting({ shuffleQuestions })} />
        <Toggle checked={s.shuffleAnswers} label="Antworten mischen" hint="Reihenfolge-Fragen werden immer gemischt." onChange={(shuffleAnswers) => setting({ shuffleAnswers })} />
      </section>

      <section className="ts-part">
        <h4>Anzeige und Vorlesen</h4>
        <Choices label="Fortschritt" value={s.progress} onChange={(progress) => setting({ progress })} options={[{ value: 'bar', label: 'Balken' }, { value: 'dots', label: 'Punkte' }, { value: 'number', label: 'Zahl' }, { value: 'none', label: 'Keine' }]}
          hint={s.progress === 'dots' ? 'Ein Punkt pro Frage – bei Rückmeldung nach jeder Frage grün oder rot.' : s.progress === 'bar' ? 'Ein Balken mit „Frage 3 von 10“.' : s.progress === 'number' ? 'Nur „3 / 10“.' : 'Keine Anzeige.'} />
        <Toggle checked={s.startCard} label="Startkarte" hint="Vor der ersten Frage eine Karte mit dem Titel und „Start“." onChange={(startCard) => setting({ startCard })} />
        <Toggle checked={s.autoRead} label="Fragen automatisch vorlesen" hint="Jede Frage wird beim Erscheinen vorgelesen. Gut für Kinder, die noch nicht lesen. Die Computerstimme ersetzt kein echtes Sprachvorbild." onChange={(autoRead) => setting({ autoRead })} />
      </section>

      <section className="ts-part">
        <h4>Abschlusskarte</h4>
        <Toggle checked={s.overview} label="Übersicht aller Fragen" hint="Mit richtig/falsch – jede Frage lässt sich noch einmal ansehen." onChange={(overview) => setting({ overview })} />
        <Toggle checked={s.retryWrong} label="„Falsche wiederholen“" hint="Nur die falsch beantworteten Fragen noch einmal spielen." onChange={(retryWrong) => setting({ retryWrong })} />
        <Toggle checked={s.retryAll} label="„Nochmal von vorn“" onChange={(retryAll) => setting({ retryAll })} />
      </section>

      <section className="ts-part">
        <h4>Vorschau</h4>
        <div className="dnd-preview">{preview ? <PlayerFrame page={preview} title="Vorschau des Quiz" interactive={false} stage={PREVIEW} /> : <p className="option-hint">{problem ? 'Die Vorschau erscheint, sobald das Quiz eine Frage hat.' : 'Das Quiz wird gebaut …'}</p>}</div>
        <p className="option-hint">Alles lässt sich danach wieder ändern. Das Quiz kommt auf eine eigene Seite.</p>
      </section>
    </div>
  );
}
