'use client';
// Lärmampel and Applausometer of Lernsachen-Heft, drawn and run by the
// reference itself (reference/class-runtime.ts). Only the loudness is
// measured through the microphone – nothing is recorded, kept or sent.
import type { PageElement } from '@/lib/notebook-model';
import { applauseConfig, CLASS_CSS, renderApplause, stopApplause } from '@/lib/reference/class-runtime';
import ReferenceWidget from './ReferenceWidget';

export default function ApplauseWidget({ element }: { element: PageElement }) {
  const applause = applauseConfig(element.settings?.applause);
  return <ReferenceWidget element={element} kind="applause" field="applause" value={applause} render={renderApplause} css={CLASS_CSS} stop={() => stopApplause(element.id)} />;
}
