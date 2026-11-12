'use client';
// The worksheet dialogs taken over from the reference, by template.
import type { Page } from '@/lib/notebook-model';
import MathSheetDialog from './MathSheetDialog';
import ClockSheetDialog from './ClockSheetDialog';

export type SheetKind = 'math' | 'clock';

export default function SheetDialogFor({ kind, onClose, onInsert }: { kind: SheetKind; onClose: () => void; onInsert: (pages: Page[]) => Promise<void> }) {
  if (kind === 'clock') return <ClockSheetDialog onClose={onClose} onInsert={onInsert} />;
  return <MathSheetDialog onClose={onClose} onInsert={onInsert} />;
}
