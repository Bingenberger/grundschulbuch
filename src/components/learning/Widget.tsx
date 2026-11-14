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
import MathTool from './MathTool';
import Receipt from './Receipt';
import GeoDraw from './GeoDraw';
import Checkout from './Checkout';
import MonsterReader from './MonsterReader';
import SyllableJoin from './SyllableJoin';
import AnlautKeyboard from './AnlautKeyboard';
import ClapSyllables from './ClapSyllables';
import PlaceValueTable from './PlaceValueTable';
import DienesMaterial from './DienesMaterial';
import NumberLine from './NumberLine';
import HundredField from './HundredField';
import TextsachenFrame from './TextsachenFrame';
import ZuordnungFrame from './ZuordnungFrame';
import QuizFrame from './QuizFrame';
import TimeWidget from './TimeWidget';
import MultiTimerWidget from './MultiTimerWidget';
import ApplauseWidget from './ApplauseWidget';
import TimetableWidget from './TimetableWidget';
import CalendarSheet from './CalendarSheet';
import MusicTemplate from './MusicTemplate';
export default function Widget({ element }: { element: PageElement }) {
  const kind = element.widgetKind!;
  if (element.settings?.musicTemplate) return <MusicTemplate element={element} />;
  if (kind === 'mathtool') return <MathTool element={element} />;
  if (kind === 'receipt') return <Receipt element={element} />;
  if (kind === 'geodraw') return <GeoDraw element={element} />;
  if (kind === 'checkout') return <Checkout element={element} />;
  if (kind === 'monsternames') return <MonsterReader element={element} />;
  if (kind === 'syllablejoin') return <SyllableJoin element={element} />;
  if (kind === 'anlaut') return <AnlautKeyboard element={element} />;
  if (kind === 'clapsyllables') return <ClapSyllables element={element} />;
  if (kind === 'placevalue') return <PlaceValueTable element={element} />;
  if (kind === 'dienes') return <DienesMaterial element={element} />;
  if (kind === 'numberline') return <NumberLine element={element} />;
  if (kind === 'hundredfield') return <HundredField element={element} />;
  if (kind === 'textsachen') return <TextsachenFrame element={element} />;
  if (kind === 'zuordnung') return <ZuordnungFrame element={element} />;
  if (kind === 'quizsachen') return <QuizFrame element={element} />;
  if (kind === 'zeit') return <TimeWidget element={element} />;
  if (kind === 'phasen') return <MultiTimerWidget element={element} />;
  if (kind === 'ampel') return <ApplauseWidget element={element} />;
  if (kind === 'stundenplan') return <TimetableWidget element={element} />;
  if (kind === 'kalenderblatt') return <CalendarSheet element={element} />;
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
