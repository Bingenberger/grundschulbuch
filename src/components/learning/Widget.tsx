import type { PageElement } from '@/lib/notebook-model';
import ClassWidgets from './ClassWidgets';
import MusicWidgets from './MusicWidgets';
import LanguageWidgets from './LanguageWidgets';
import MathWidgets from './MathWidgets';
import CreativeWidgets from './CreativeWidgets';
export default function Widget({ element }: { element: PageElement }) {
  const kind = element.widgetKind!;
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
      'karaoke',
    ].includes(kind)
  )
    return <MusicWidgets element={element} />;
  if (
    ['communication', 'alphabet', 'clapping', 'synthesis', 'monster'].includes(
      kind,
    )
  )
    return <LanguageWidgets element={element} />;
  if (['calculator', 'mathboard', 'shop', 'geometry'].includes(kind))
    return <MathWidgets element={element} />;
  return <CreativeWidgets element={element} />;
}
