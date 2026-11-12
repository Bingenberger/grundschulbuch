'use client';
// Answer box of a worksheet: a text with a placeholder. Everyone who works on
// the page types the answer straight into it. Unlocked boxes can still be
// selected and moved like any other element.
import type { PageElement } from '@/lib/notebook-model';
import { textStyle } from '../PageView';

export const isAnswerField = (el: PageElement) => el.type === 'text' && typeof el.placeholder === 'string';

export default function AnswerField({ element, onAnswer }: { element: PageElement; onAnswer: (text: string) => void }) {
  const style = textStyle(element);
  return (
    <input
      className="answer-field"
      value={element.text || ''}
      aria-label="Antwort"
      maxLength={200}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      style={{ ...style, padding: 0, lineHeight: 'normal', whiteSpace: undefined, overflowWrap: undefined }}
      onPointerDown={(e) => {
        // The editor's own handling would keep the box from getting the cursor.
        e.currentTarget.focus({ preventScroll: true });
        if (element.locked) e.stopPropagation();
      }}
      onDoubleClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onChange={(e) => onAnswer(e.target.value)}
    />
  );
}
