'use client';
// The Bilder-Stundenplan of Lernsachen-Heft, drawn by the reference itself
// (reference/class-runtime.ts). Live, today's column is highlighted and a tap
// on a lesson, a break or a day reads it aloud, like in the reference.
import { useMemo } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { timetable, timetableAssets } from '@/lib/learning/stundenplan';
import { CLASS_CSS, renderTimetable, timetableSay } from '@/lib/reference/class-runtime';
import { lc } from '@/lib/reference/runtime';
import ReferenceWidget from './ReferenceWidget';
import { useLearning } from './Runtime';

export default function TimetableWidget({ element }: { element: PageElement }) {
  const { interactive } = useLearning(element);
  const tt = useMemo(() => timetable(element.settings?.tt), [element.settings?.tt]);
  const assets = useMemo(() => timetableAssets(tt), [tt]);
  return (
    <div
      className="timetable-widget"
      onClick={(e) => {
        if (!interactive) return;
        const say = timetableSay(e.target as Element);
        const cell = (e.target as Element).closest?.('[data-say]');
        if (!say || !cell) return;
        cell.classList.add('is-reading');
        void lc(say).then(() => cell.classList.remove('is-reading'));
      }}
      onPointerDown={(e) => { if (interactive && (e.target as Element).closest?.('[data-say]')) e.stopPropagation(); }}
    >
      <ReferenceWidget element={element} kind="timetable" field="tt" value={tt} render={renderTimetable} options={{ assets }} css={CLASS_CSS} />
    </div>
  );
}
