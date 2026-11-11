'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { textStyle } from '../PageView';
import { pxToMm } from './text-measure';

type Caret = { left: number; top: number; height: number } | null;

/**
 * Writing directly in the text box on the page. A thick blinking cursor shows
 * children where they are; the browser's own thin one is hidden.
 */
export default function InlineText({
  element,
  onText,
  onHeight,
  onDone,
  selectAll,
}: {
  element: PageElement;
  onText: (text: string) => void;
  /** Height in mm the whole text needs, reported after each change. */
  onHeight: (mm: number) => void;
  onDone: () => void;
  selectAll?: boolean;
}) {
  const area = useRef<HTMLTextAreaElement>(null);
  const mirror = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const [cursor, setCursor] = useState(0);
  const [caret, setCaret] = useState<Caret>(null);
  const [, refresh] = useState(0);
  const text = element.text ?? element.runs?.map((r) => r.text).join('') ?? '';

  const track = useCallback(() => {
    const field = area.current;
    if (!field || document.activeElement !== field) return setCaret(null);
    if (field.selectionStart !== field.selectionEnd) {
      setCursor(field.selectionEnd);
      return setCaret(null);
    }
    setCursor(field.selectionStart);
    refresh((n) => n + 1);
  }, []);

  useEffect(() => {
    const field = area.current;
    if (!field) return;
    field.focus({ preventScroll: true });
    if (selectAll) field.select();
    else field.setSelectionRange(field.value.length, field.value.length);
    track();
    document.addEventListener('selectionchange', track);
    return () => document.removeEventListener('selectionchange', track);
    // Focus only once, when editing starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Position of the cursor and the height the text needs, from a hidden copy.
  useLayoutEffect(() => {
    const field = area.current;
    const copy = mirror.current;
    const mark = marker.current;
    if (!field || !copy || !mark) return;
    if (document.activeElement === field && field.selectionStart === field.selectionEnd)
    {
      const next = { left: mark.offsetLeft, top: mark.offsetTop - field.scrollTop, height: mark.offsetHeight };
      setCaret((old) =>
        old && old.left === next.left && old.top === next.top && old.height === next.height ? old : next,
      );
    }
    onHeight(pxToMm(copy.offsetHeight));
  });

  const style = textStyle(element);
  return (
    <div className="inline-text" style={{ ...style, height: '100%', boxSizing: 'border-box' }}>
      <div className="inline-text-inner">
        <div className="inline-text-mirror" ref={mirror} aria-hidden="true">
          {text.slice(0, cursor)}
          <span ref={marker}>{'​'}</span>
          {text.slice(cursor)}
        </div>
        <textarea
          ref={area}
          aria-label="Text"
          spellCheck={false}
          value={text}
          onPointerDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            onText(e.target.value);
            setCursor(e.target.selectionStart);
          }}
          onKeyUp={track}
          onPointerUp={track}
          onFocus={track}
          onBlur={() => {
            setCaret(null);
            onDone();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Escape') {
              e.preventDefault();
              area.current?.blur();
            }
          }}
        />
        {caret && (
          <span
            key={`${caret.left}-${caret.top}-${text.length}`}
            className="text-caret"
            aria-hidden="true"
            style={{ left: caret.left, top: caret.top, height: caret.height }}
          />
        )}
      </div>
    </div>
  );
}
