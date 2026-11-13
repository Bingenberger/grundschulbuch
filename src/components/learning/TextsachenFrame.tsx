'use client';
// Runs an exercise of Textsachen in its own frame, like Lernsachen-Heft does:
// the original player (reference/textsachen-player.ts) gets the task, the last
// state and reports changes and results back; we keep the state per child.
import { useEffect, useMemo, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { TS_FAMILIES, TS_MODES, pictureWords, pictureOf, playerTask, tsConfig } from '@/lib/learning/textsachen';
import { useDecorative } from '../Decorative';
import Icon, { type IconName } from '../Icon';
import { useLearning } from './Runtime';
import PlayerFrame, { aliasFonts, dataUrl, framePage, loadPlayer, savedState, statePatch } from './PlayerFrame';

export function StillFrame({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="textsachen-frame is-still">
      <Icon name={icon as IconName} size={40} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

export default function TextsachenFrame({ element }: { element: PageElement }) {
  const { interactive, state, update } = useLearning(element);
  const decorative = useDecorative();
  const c = useMemo(() => tsConfig(element.settings?.ts), [element.settings?.ts]);
  const title = element.settings?.title || TS_MODES[c.mode].label;
  const key = JSON.stringify([c, title]);
  const [ready, setReady] = useState<{ key: string; js: string; urls: Map<string, string> } | null>(null);

  useEffect(() => {
    if (decorative) return;
    let live = true;
    const srcs = pictureWords(c).map((w) => pictureOf(c, w)).filter((s): s is string => !!s);
    void Promise.all([loadPlayer('TSPlayer'), ...srcs.map(async (s) => [s, await dataUrl(s)] as const)]).then(([js, ...found]) => {
      if (live) setReady({ key, js: js as string, urls: new Map((found as (readonly [string, string | null])[]).filter((f): f is [string, string] => !!f[1])) });
    });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, decorative]);

  // The page of the frame is built once per task; the state of that moment goes in.
  const page = useMemo(() => {
    if (!ready || ready.key !== key) return null;
    return framePage({ kind: 'TSPlayer', task: playerTask(c, title, ready.urls), state: savedState(state, key), js: ready.js, fonts: aliasFonts(TS_FAMILIES), font: 'TS Nunito' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, key]);

  if (decorative || !page) return <StillFrame icon={TS_MODES[c.mode].icon} title={title} text={decorative ? TS_MODES[c.mode].desc : 'Wird geladen …'} />;
  return <PlayerFrame page={page} title={`${TS_MODES[c.mode].label}: ${title}`} interactive={interactive} onState={(s, percent) => update(statePatch(key, s, percent))} />;
}
