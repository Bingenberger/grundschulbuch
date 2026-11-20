'use client';
// Answer box of a worksheet: a text with a placeholder. Everyone who works on
// the page types the answer straight into it. Unlocked boxes can still be
// selected and moved like any other element. With a Lösungskontrolle a ✓ or ✗
// appears at the top right (at once, or after “Prüfen”).
import type { PageElement } from '@/lib/notebook-model';
import { shownMark } from '@/lib/sheets/answers';
import { textStyle } from '../PageView';

export const isAnswerField = (el: PageElement) => el.type === 'text' && typeof el.placeholder === 'string';
export const isCheckButton = (el: PageElement) => el.type === 'text' && el.action === 'check';

const MARKS = {
  ok: <><circle cx="50" cy="50" r="47" fill="#16a34a" stroke="#fff" strokeWidth="6" /><path d="M27 52l15 15 32-34" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" /></>,
  bad: <><circle cx="50" cy="50" r="47" fill="#dc2626" stroke="#fff" strokeWidth="6" /><path d="M33 33l34 34M67 33L33 67" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" /></>,
};

/** ✓ or ✗ beside an answer box (size follows the writing). */
export function AnswerMark({ element }: { element: PageElement }) {
  const mark = shownMark(element);
  if (!mark) return null;
  const size = Math.max(5.5, (element.fontSize ?? 20) * 0.3);
  return (
    <svg className={`answer-mark is-${mark}`} viewBox="0 0 100 100" role="img" aria-label={mark === 'ok' ? 'richtig' : 'falsch'} style={{ width: `${size}mm`, height: `${size}mm`, right: `${-size * 0.45}mm`, top: `${-size * 0.45}mm` }}>
      {MARKS[mark]}
    </svg>
  );
}

/**
 * `typing`: the pen (or another tool) is on – a tap still opens the box for
 * typing, and pen and ruler stay where they are.
 */
export default function AnswerField({ element, onAnswer, typing = false }: { element: PageElement; onAnswer: (text: string) => void; typing?: boolean }) {
  const style = textStyle(element);
  return (
    <>
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
          if (element.locked || typing) e.stopPropagation();
        }}
        onDoubleClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onChange={(e) => onAnswer(e.target.value)}
      />
      <AnswerMark element={element} />
    </>
  );
}

/** The “Prüfen” button of a worksheet page. */
export function CheckButton({ element, onCheck }: { element: PageElement; onCheck: () => void }) {
  const style = textStyle(element);
  return (
    <button
      type="button"
      className="answer-check"
      style={{ ...style, background: element.background || '#16a34a', color: element.color || '#fff', padding: 0 }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onCheck();
      }}
    >
      {element.text || 'Prüfen'}
    </button>
  );
}

/** A new answer takes away the ✓/✗ of “Prüfen”. */
export const typedAnswer = (el: PageElement, text: string): PageElement => {
  const next = { ...el, text };
  delete next.marked;
  return next;
};
