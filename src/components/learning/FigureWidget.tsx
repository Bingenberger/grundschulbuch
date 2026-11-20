'use client';
// A Figur of Lernsachen-Heft 1.47.3 (e.g. on the Gefühle-Karten): drawn by
// the reference itself (reference/tools-runtime.ts); tapped, it waves and says
// its text (the mouth moves with it) or “Hallo, ich bin …”.
import type { PageElement } from '@/lib/notebook-model';
import { FIGURE_CSS, figureConfig, renderFigure, speakFigure } from '@/lib/reference/tools-runtime';
import { useLearning } from './Runtime';
import ReferenceWidget from './ReferenceWidget';
import { ownAudio } from './OwnRecording';

export const figureLook = (raw: unknown) => figureConfig(raw) as Record<string, unknown>;
/** What a figure or photo says; `audio` is an own recording (then the text only describes it). */
export type Say = { text: string; pitch: string; audio?: string };
export const sayOf = (raw: unknown): Say => {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<Say>;
  const audio = ownAudio(v.audio);
  return { text: typeof v.text === 'string' ? v.text.slice(0, 300) : '', pitch: typeof v.pitch === 'string' ? v.pitch : 'normal', ...(audio ? { audio } : {}) };
};
/** For the reference's code: the recording as an asset `voice`. */
export const sayItem = (say: Say) => ({ text: say.text, pitch: say.pitch, ...(say.audio ? { sound: 'voice' } : {}) });
export const sayAssets = (say: Say) => (say.audio ? { voice: { url: say.audio } } : {});
export const assetUrl = (a: { url: string }) => a.url;

/** How the figure moves when tapped (as in the reference; empty: talks with text, else waves). */
export const FIGURE_MOVES = [
  ['talk', 'Mit den Händen reden'], ['wave', 'Winken'], ['cross', 'Arme verschränken'], ['dance', 'Tanzen'],
  ['jump', 'Hüpfen'], ['bow', 'Verbeugen'], ['clap', 'Klatschen'], ['cheer', 'Jubeln'], ['random', 'Zufällig'],
] as const;
export const moveOf = (raw: unknown) => (FIGURE_MOVES.some(([id]) => id === raw) ? (raw as string) : undefined);

export default function FigureWidget({ element }: { element: PageElement }) {
  const { interactive } = useLearning(element);
  const av = figureLook(element.settings?.av), say = sayOf(element.settings?.say), move = moveOf(element.settings?.move);
  // Tapped (board, child's book, protected page): it speaks its text or recording and moves.
  const speak = (box: HTMLElement) => speakFigure({ id: element.id, kind: 'avatar', av, say: sayItem(say), ...(move ? { move } : {}) }, box.querySelector('.reference-widget'));
  return (
    <div
      className="figure-widget"
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : -1}
      aria-label={interactive ? `${String(av.name || 'Figur')} antippen` : undefined}
      onPointerDown={(e) => interactive && e.stopPropagation()}
      onClick={(e) => interactive && speak(e.currentTarget)}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          speak(e.currentTarget);
        }
      }}
    >
      <ReferenceWidget element={element} kind="avatar" field="av" value={{ ...av, _say: say, _move: move }} css={FIGURE_CSS}
        options={{ assets: sayAssets(say), assetUrl }}
        render={(el, item, live, options) => {
          const { _say, _move, ...look } = item.av as Record<string, unknown>;
          renderFigure(el, { ...item, av: look, say: sayItem(_say as Say), ...(_move ? { move: _move } : {}) }, live, options);
        }} />
    </div>
  );
}
