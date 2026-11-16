'use client';
// The worksheet dialogs taken over from the reference, by template.
import type { Page } from '@/lib/notebook-model';
import MathSheetDialog from './MathSheetDialog';
import ClockSheetDialog from './ClockSheetDialog';
import MoneySheetDialog from './MoneySheetDialog';
import MazeSheetDialog from './MazeSheetDialog';
import NoteSheetDialog from './NoteSheetDialog';
import LetterSheetDialog from './LetterSheetDialog';
import { CodingSheetDialog, GridSheetDialog, LabelsSheetDialog, LifeSheetDialog, PhonSheetDialog } from './Sheets1473';

export type SheetKind = 'math' | 'clock' | 'money' | 'maze' | 'notes' | 'letters' | 'digits' | 'alltagsrechnen' | 'karopapier' | 'programmierblatt' | 'laute' | 'etiketten';

export default function SheetDialogFor({ kind, onClose, onInsert }: { kind: SheetKind; onClose: () => void; onInsert: (pages: Page[]) => Promise<void> }) {
  if (kind === 'alltagsrechnen') return <LifeSheetDialog onClose={onClose} onInsert={onInsert} />;
  if (kind === 'karopapier') return <GridSheetDialog onClose={onClose} onInsert={onInsert} />;
  if (kind === 'programmierblatt') return <CodingSheetDialog onClose={onClose} onInsert={onInsert} />;
  if (kind === 'laute') return <PhonSheetDialog onClose={onClose} onInsert={onInsert} />;
  if (kind === 'etiketten') return <LabelsSheetDialog onClose={onClose} onInsert={onInsert} />;
  if (kind === 'letters' || kind === 'digits') return <LetterSheetDialog mode={kind} onClose={onClose} onInsert={onInsert} />;
  if (kind === 'notes') return <NoteSheetDialog onClose={onClose} onInsert={onInsert} />;
  if (kind === 'maze') return <MazeSheetDialog onClose={onClose} onInsert={onInsert} />;
  if (kind === 'money') return <MoneySheetDialog onClose={onClose} onInsert={onInsert} />;
  if (kind === 'clock') return <ClockSheetDialog onClose={onClose} onInsert={onInsert} />;
  return <MathSheetDialog onClose={onClose} onInsert={onInsert} />;
}
