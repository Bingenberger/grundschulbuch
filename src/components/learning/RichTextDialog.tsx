'use client';
import { useEffect, useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
export default function RichTextDialog({
  element,
  onSave,
  onClose,
}: {
  element: PageElement;
  onSave: (values: Partial<PageElement>) => void;
  onClose: () => void;
}) {
  const editor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = editor.current;
    if (!root) return;
    root.replaceChildren();
    for (const run of element.runs?.length
      ? element.runs
      : [
          {
            text: element.text || '',
            bold: element.bold,
            italic: element.italic,
            underline: element.underline,
          },
        ]) {
      const span = document.createElement('span');
      span.textContent = run.text;
      span.style.fontWeight = run.bold ? '700' : '400';
      span.style.fontStyle = run.italic ? 'italic' : 'normal';
      span.style.textDecoration = run.underline ? 'underline' : 'none';
      if ('color' in run && run.color) span.style.color = run.color;
      root.append(span);
    }
    root.focus();
  }, [element]);
  function commit() {
    const root = editor.current;
    if (!root) return;
    const runs: NonNullable<PageElement['runs']> = [];
    const visit = (
      node: Node,
      style: Omit<NonNullable<PageElement['runs']>[number], 'text'>,
    ) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent) runs.push({ text: node.textContent, ...style });
        return;
      }
      if (!(node instanceof HTMLElement)) return;
      const next = { ...style };
      if (
        ['B', 'STRONG'].includes(node.tagName) ||
        Number(node.style.fontWeight) >= 600
      )
        next.bold = true;
      if (
        ['I', 'EM'].includes(node.tagName) ||
        node.style.fontStyle === 'italic'
      )
        next.italic = true;
      if (
        node.tagName === 'U' ||
        node.style.textDecoration.includes('underline')
      )
        next.underline = true;
      const rgb = node.style.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (rgb)
        next.color =
          '#' +
          rgb
            .slice(1, 4)
            .map((n) => Number(n).toString(16).padStart(2, '0'))
            .join('');
      if (node.tagName === 'BR') runs.push({ text: '\n', ...next });
      else {
        if (
          ['DIV', 'P'].includes(node.tagName) &&
          node !== root &&
          runs.length &&
          !runs[runs.length - 1].text.endsWith('\n')
        )
          runs.push({ text: '\n', ...next });
        node.childNodes.forEach((child) => visit(child, next));
      }
    };
    root.childNodes.forEach((node) => visit(node, {}));
    onSave({ runs, text: runs.map((r) => r.text).join('') });
    onClose();
  }
  const command = (name: string, value?: string) => {
    editor.current?.focus();
    document.execCommand(name, false, value);
  };
  return (
    <div className="modal-backdrop">
      <section
        className="modal rich-text-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rich-title"
      >
        <h2 id="rich-title">Text gestalten</h2>
        <div className="rich-toolbar">
          {[
            ['bold', 'Fett'],
            ['italic', 'Kursiv'],
            ['underline', 'Unterstrichen'],
            ['removeFormat', 'Format entfernen'],
          ].map(([name, label]) => (
            <button
              className="knopf"
              key={name}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => command(name)}
            >
              {label}
            </button>
          ))}
          <input
            type="color"
            aria-label="Farbe des markierten Textes"
            onPointerDown={() => {}}
            onChange={(e) => command('foreColor', e.target.value)}
          />
        </div>
        <div
          className="rich-editor"
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Formatierter Text"
          aria-multiline="true"
          ref={editor}
          style={{
            fontFamily: element.font,
            fontSize: element.fontSize || 18,
            whiteSpace: 'pre-wrap',
          }}
          onPaste={(e) => {
            e.preventDefault();
            document.execCommand(
              'insertText',
              false,
              e.clipboardData.getData('text/plain'),
            );
          }}
        />
        <p>Markiere Wörter, um einzelne Stellen hervorzuheben.</p>
        <div className="dialog-actions">
          <button className="knopf" onClick={onClose}>
            Abbrechen
          </button>
          <button className="knopf knopf-haupt" onClick={commit}>
            Text übernehmen
          </button>
        </div>
      </section>
    </div>
  );
}
