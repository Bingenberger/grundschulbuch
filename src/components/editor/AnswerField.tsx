'use client';
// Answer box of a worksheet: a locked text with a placeholder. Everyone who
// works on the page types the answer straight into it.
import type { PageElement } from '@/lib/notebook-model';
import { textStyle } from '../PageView';

export const isAnswerField = (el: PageElement) => el.type === 'text' && typeof el.placeholder === 'string' && el.locked;

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
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onChange={(e) => onAnswer(e.target.value)}
    />
  );
}
