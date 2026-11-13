'use client';
// Runs a Zuordnung of Schiebesachen with its original player (DnDPlayer) in
// its own frame; the exercise was built in the settings, the state is per child.
import { useEffect, useMemo, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { DND_FAMILIES, dndConfig, exerciseAssets, playerExercise } from '@/lib/learning/zuordnung';
import { useDecorative } from '../Decorative';
import { useLearning } from './Runtime';
import PlayerFrame, { aliasFonts, dataUrl, framePage, loadPlayer, savedState, statePatch } from './PlayerFrame';
import { StillFrame } from './TextsachenFrame';

/** Builds the frame page of an exercise (also used by the preview in the settings). */
export function useZuordnungPage(exercise: Record<string, unknown> | undefined, state: unknown, off = false) {
  const key = exercise ? String(exercise.id ?? '') + JSON.stringify(exercise).length : '';
  const [page, setPage] = useState<{ key: string; html: string } | null>(null);
  useEffect(() => {
    if (off || !exercise) return;
    let live = true;
    const srcs = exerciseAssets(exercise);
    void Promise.all([loadPlayer('DnDPlayer'), ...srcs.map(async (s) => [s, await dataUrl(s)] as const)]).then(([js, ...found]) => {
      if (!live) return;
      const urls = new Map((found as (readonly [string, string | null])[]).filter((f): f is [string, string] => !!f[1]));
      setPage({ key, html: framePage({ kind: 'DnDPlayer', task: playerExercise(exercise, urls), state, js: js as string, fonts: aliasFonts(DND_FAMILIES), font: 'DnD Nunito' }) });
    });
    return () => { live = false; };
    // The page is built once per exercise; the state of that moment goes in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, off]);
  return page && page.key === key ? page.html : null;
}

export default function ZuordnungFrame({ element }: { element: PageElement }) {
  const { interactive, state, update } = useLearning(element);
  const decorative = useDecorative();
  const c = useMemo(() => dndConfig(element.settings?.dnd), [element.settings?.dnd]);
  const key = String(c.exercise?.id ?? '');
  const page = useZuordnungPage(c.exercise, savedState(state, key), decorative);
  const title = element.settings?.title || 'Zuordnung';
  if (decorative || !page)
    return <StillFrame icon="flow_chart" title={title} text={!c.exercise ? 'Noch keine Übung – bitte einstellen.' : decorative ? 'Karten an die richtige Stelle ziehen.' : 'Wird geladen …'} />;
  return <PlayerFrame page={page} title={`Zuordnung: ${title}`} interactive={interactive} onState={(s, percent) => update(statePatch(key, s, percent))} />;
}
