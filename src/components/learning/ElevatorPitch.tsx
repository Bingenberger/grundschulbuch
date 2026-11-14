'use client';
// Elevator Pitch of Lernsachen-Heft, drawn and run by the reference itself
// (reference/class-runtime.ts): the lift rides up while one talks, at the top
// the time is over – with curtain, confetti, fanfare and applause.
import type { PageElement } from '@/lib/notebook-model';
import { CLASS_CSS, pitchConfig, renderPitch, stopPitch } from '@/lib/reference/class-runtime';
import ReferenceWidget from './ReferenceWidget';

export default function ElevatorPitch({ element }: { element: PageElement }) {
  return <ReferenceWidget element={element} kind="pitch" field="pitch" value={pitchConfig(element.settings?.pitch)} render={renderPitch} css={CLASS_CSS} stop={() => stopPitch(element.id)} />;
}
