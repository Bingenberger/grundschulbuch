// Icons for recurring choices in the learning-tool dialogs.
import type { ChoiceIcon } from '../ui/Choice';
import { TextGlyph } from '../ui/Glyphs';

export const themeIcons: Record<string, ChoiceIcon> = {
  Schule: 'graduation_cap',
  Tiere: 'like',
  Natur: 'landscape',
  Essen: 'shop',
  Bewegung: 'sports_mode',
  'Kurze Wörter': <TextGlyph text="ab" tone="green" />,
};
