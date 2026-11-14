'use client';
// Runs a quiz of Quizsachen with its original player (QuizPlayer) in its own
// frame, like Lernsachen-Heft; the quiz was built in the settings, the state
// is kept per child.
import { useEffect, useMemo, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { QZ_FAMILIES, quizConfig } from '@/lib/learning/quiz';
import { exerciseAssets, playerExercise } from '@/lib/learning/zuordnung';
import { useDecorative } from '../Decorative';
import { useLearning } from './Runtime';
import PlayerFrame, { aliasFonts, dataUrl, framePage, loadPlayer, savedState, statePatch } from './PlayerFrame';
import { StillFrame } from './TextsachenFrame';

/** Builds the frame page of a quiz (also used by the preview in the settings). */
export function useQuizPage(quiz: Record<string, unknown> | undefined, state: unknown, off = false) {
  const key = quiz ? String(quiz.id ?? '') + JSON.stringify(quiz).length : '';
  const [page, setPage] = useState<{ key: string; html: string } | null>(null);
  useEffect(() => {
    if (off || !quiz) return;
    let live = true;
    // The assets of a quiz look like those of a Zuordnung (dataUrl per picture).
    const srcs = exerciseAssets(quiz);
    void Promise.all([loadPlayer('QuizPlayer'), ...srcs.map(async (s) => [s, await dataUrl(s)] as const)]).then(([js, ...found]) => {
      if (!live) return;
      const urls = new Map((found as (readonly [string, string | null])[]).filter((f): f is [string, string] => !!f[1]));
      setPage({ key, html: framePage({ kind: 'QuizPlayer', task: playerExercise(quiz, urls), state, js: js as string, fonts: aliasFonts(QZ_FAMILIES), font: 'QZ Nunito' }) });
    });
    return () => { live = false; };
    // The page is built once per quiz; the state of that moment goes in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, off]);
  return page && page.key === key ? page.html : null;
}

export default function QuizFrame({ element }: { element: PageElement }) {
  const { interactive, state, update } = useLearning(element);
  const decorative = useDecorative();
  const c = useMemo(() => quizConfig(element.settings?.qz), [element.settings?.qz]);
  const key = String(c.quiz?.id ?? '');
  const page = useQuizPage(c.quiz, savedState(state, key), decorative);
  const title = element.settings?.title || 'Quiz';
  if (decorative || !page)
    return <StillFrame icon="questions" title={title} text={!c.quiz ? 'Noch kein Quiz – bitte einstellen.' : decorative ? 'Fragen beantworten und überprüfen.' : 'Wird geladen …'} />;
  return <PlayerFrame page={page} title={`Quiz: ${title}`} interactive={interactive} onState={(s, percent) => update(statePatch(key, s, percent))} />;
}
