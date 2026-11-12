'use client';
// “Silben verbinden” of the reference, with its recorded sounds and syllables.
import type { PageElement } from '@/lib/notebook-model';
import { SYNTH_CSS, cleanSynth, renderSynth, stopSynth } from '@/lib/reference/synth';
import { safeRecording } from '@/lib/reference/recordings';
import ReferenceWidget from './ReferenceWidget';

type Synth = { sounds?: Record<string, string>; voice?: Record<string, string> };

export default function SyllableJoin({ element }: { element: PageElement }) {
  const synth = cleanSynth(element.settings?.synth, (v: unknown) => (safeRecording(v) ? v : undefined)) as Synth;
  // The recordings are their own “assets”: the path is the id.
  const assets = Object.fromEntries([...Object.values(synth.sounds ?? {}), ...Object.values(synth.voice ?? {})].map((src) => [src, { dataUrl: src }]));
  return <ReferenceWidget element={element} kind="synth" field="synth" value={synth} render={renderSynth} options={{ assets }} css={SYNTH_CSS} stop={stopSynth} />;
}
