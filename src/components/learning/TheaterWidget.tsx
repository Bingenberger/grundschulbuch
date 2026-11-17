'use client';
// Puppentheater of Lernsachen-Heft 1.47.3, drawn and run by the reference
// itself (reference/tools-runtime.ts): figures on a stage, a recording of
// voice and movements, playing it back, a video. Here the notebook provides
// what the reference asks for: its pages (for “Automatischer Seitenwechsel”),
// saving a recording (the sound goes to the school server, movements and
// figures into the response of the element) and the positions of the figures.
import { useContext, useEffect } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { useEditor } from '@/lib/editor-store';
import { fingerprint } from '@/lib/learning/werkzeuge';
import { wavBlob } from '@/lib/learning/audio';
import { registerTheaterHost, registerTheaterPositions, registerTheaterSave, renderTheater, THEATER_CSS, theaterConfig } from '@/lib/reference/tools-runtime';
import { LinkContext } from '../LinkContext';
import ReferenceWidget from './ReferenceWidget';
import { useLearning } from './Runtime';

const media = (v: unknown) => (typeof v === 'string' && /^\/api\/medien\/[\w./-]+$/.test(v) ? v : undefined);
export const theaterSettings = (raw: unknown) => theaterConfig(raw, media) as Record<string, unknown>;
type TheaterState = { base: string; take?: unknown; positions?: { x: number; y: number }[] };

/** Settings of the stage with what was recorded or moved since (only for these settings). */
export function theaterCurrent(element: Pick<PageElement, 'settings' | 'response'>) {
  const th = theaterSettings(element.settings?.th);
  const saved = (element.response as { theater?: TheaterState } | undefined)?.theater;
  if (!saved || saved.base !== fingerprint(element.settings?.th)) return th;
  const cast = (th.cast as { x: number; y: number }[]).map((c, i) => (saved.positions?.[i] ? { ...c, ...saved.positions[i] } : c));
  return theaterSettings({ ...th, cast, ...(saved.take ? { take: saved.take } : {}) });
}

/**
 * The iPad records MP4 in fragments that it then plays only for a moment from
 * the server and cannot measure for the mouths; WAV it plays everywhere.
 */
async function asWav(blob: Blob) {
  if (blob.type === 'audio/wav') return blob;
  try {
    const Offline = window.OfflineAudioContext ?? (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext;
    const data = await blob.arrayBuffer();
    const buffer = await new Promise<AudioBuffer>((resolve, reject) => {
      const done = new Offline(1, 1, 24000).decodeAudioData(data, resolve, reject);
      done?.then?.(resolve, reject);
    });
    return buffer.length ? wavBlob(buffer) : blob;
  } catch {
    return blob;
  }
}

// One host for all stages: the reference keeps it globally.
const savers = new Map<string, { take: (take: unknown, blob: Blob) => Promise<void>; move: (positions: { x: number; y: number }[]) => void }>();
let openPage: ((index: number) => void) | null = null;
const KIND: Record<string, string> = { puppentheater: 'theater', figur: 'avatar' };
let registered = false;
function register() {
  if (registered) return;
  registered = true;
  registerTheaterHost({
    pages: () => {
      const s = useEditor.getState();
      const ids = s.book?.pageIds ?? s.pages.map((p) => p.id);
      return ids.map((id) => s.pages.find((p) => p.id === id)).filter(Boolean).map((p) => ({
        id: p!.id,
        items: p!.elements.map((e) => ({ id: e.id, type: e.type, kind: KIND[e.widgetKind ?? ''] ?? e.widgetKind, ...(e.widgetKind === 'puppentheater' ? { th: theaterCurrent(e) } : {}), ...(e.settings?.av ? { av: e.settings.av, say: e.settings.say } : {}) })),
      }));
    },
    show: (index: number) => openPage?.(index),
    src: (key: string) => media(key),
    asset: (key: string) => (media(key) ? { id: key, dataUrl: key } : undefined),
  });
  registerTheaterSave((id: string, rec: { blob: Blob; mime: string }, take: Record<string, unknown>) => { void savers.get(id)?.take(take, rec.blob); });
  registerTheaterPositions((id: string, positions: { x: number; y: number }[]) => savers.get(id)?.move(positions));
}

export default function TheaterWidget({ element }: { element: PageElement }) {
  const { update, uploadAudio, state } = useLearning(element);
  const links = useContext(LinkContext);
  const th = theaterCurrent(element);
  const base = fingerprint(element.settings?.th);
  useEffect(() => {
    register();
    openPage = (index) => {
      const s = useEditor.getState();
      const id = (s.book?.pageIds ?? s.pages.map((p) => p.id))[index];
      if (id) links.openPage?.(id);
    };
    const saved = () => ((state as { theater?: TheaterState }).theater?.base === base ? (state as { theater: TheaterState }).theater : { base });
    savers.set(element.id, {
      take: async (take, blob) => {
        if (!uploadAudio) return;
        const sound = await uploadAudio(element.id, await asWav(blob));
        update({ theater: { ...saved(), base, take: { ...(take as Record<string, unknown>), sound } } } as never);
      },
      move: (positions) => update({ theater: { ...saved(), base, positions: positions.map((p) => ({ x: Math.round(p.x), y: Math.round(p.y) })) } } as never),
    });
    return () => { savers.delete(element.id); };
  }, [element.id, base, update, uploadAudio, links, state]);
  return <ReferenceWidget element={element} kind="theater" field="th" value={th} render={renderTheater} options={{ assets: {} }} css={THEATER_CSS} />;
}
