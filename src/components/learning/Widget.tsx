import type { PageElement } from '@/lib/notebook-model';
import ClassWidgets from './ClassWidgets';
import MusicWidgets from './MusicWidgets';
import KaraokeWidget from './KaraokeWidget';
import LanguageWidgets from './LanguageWidgets';
import AlphabetWidget from './AlphabetWidget';
import SynthesisWidget from './SynthesisWidget';
import ClappingWidget from './ClappingWidget';
import MathWidgets from './MathWidgets';
import GeometryWidget from './GeometryWidget';
import CreativeWidgets from './CreativeWidgets';
import SlideshowWidget from './SlideshowWidget';
export default function Widget({ element }: { element: PageElement }) {
  const kind = element.widgetKind!;
  if (kind === 'geometry') return <GeometryWidget element={element} />;
  if (kind === 'slideshow') return <SlideshowWidget element={element} />;
  if (kind === 'karaoke') return <KaraokeWidget element={element} />;
  if (kind === 'clapping') return <ClappingWidget element={element} />;
  if (kind === 'synthesis') return <SynthesisWidget element={element} />;
  if (kind === 'alphabet') return <AlphabetWidget element={element} />;
  if (
    [
      'timer',
      'multitimer',
      'clock',
      'calendar',
      'timetable',
      'noise',
      'applause',
      'pitch',
      'tuner',
    ].includes(kind)
  )
    return <ClassWidgets element={element} />;
  if (
    [
      'piano',
      'drums',
      'sequencer',
      'metronome',
      'echo',
      'notequiz',
      'falling',
      'recorder',
      'playlist',
      'soundstudio',
    ].includes(kind)
  )
    return <MusicWidgets element={element} />;
  if (
    ['communication', 'monster'].includes(
      kind,
    )
  )
    return <LanguageWidgets element={element} />;
  if (['calculator', 'mathboard', 'shop'].includes(kind))
    return <MathWidgets element={element} />;
  return <CreativeWidgets element={element} />;
}
