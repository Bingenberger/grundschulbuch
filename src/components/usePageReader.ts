'use client';
// Liest eine Seite vor: Satz für Satz, der Satz leuchtet hell und das
// gesprochene Wort gelb mit (CSS Custom Highlight API; ohne sie wird das
// Element umrandet). Bilder sagen ihre Beschreibung, Töne spielen an ihrer
// Stelle. Ein zweiter Aufruf hält an.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Page } from '@/lib/notebook-model';
import { readingSteps, sentenceRanges } from '@/lib/read-page';
import { startGermanSpeech, stopSpeaking } from '@/lib/speech';

type Highlights = { set(name: string, h: unknown): void; delete(name: string): void };
const highlights = (): Highlights | null =>
  typeof CSS !== 'undefined' && 'highlights' in CSS && typeof (window as unknown as { Highlight?: unknown }).Highlight === 'function'
    ? (CSS as unknown as { highlights: Highlights }).highlights
    : null;

// Der CSS-Baustein des Builds kennt ::highlight() noch nicht – die Regeln kommen zur Laufzeit dazu.
function ensureHighlightStyle() {
  if (document.getElementById('read-highlight-style')) return;
  const style = document.createElement('style');
  style.id = 'read-highlight-style';
  style.textContent =
    '::highlight(read-sentence){background-color:#fff3a6}::highlight(read-word){background-color:#ffd54f;color:#1e293b}';
  document.head.append(style);
}
function elementNode(root: HTMLElement | null, id: string) {
  return root?.querySelector<HTMLElement>(`[data-element-id="${CSS.escape(id)}"]`) ?? null;
}
/** Textknoten eines Textelements ohne Link-Abzeichen und Rahmen. */
function textNodes(node: HTMLElement) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement?.closest('.link-layer,svg,[aria-hidden="true"]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const list: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) list.push(n as Text);
  return list;
}
function rangeOf(nodes: Text[], start: number, end: number) {
  const range = document.createRange();
  let offset = 0, startSet = false;
  for (const n of nodes) {
    const len = n.data.length;
    if (!startSet && start <= offset + len) {
      range.setStart(n, Math.max(0, start - offset));
      startSet = true;
    }
    if (startSet && end <= offset + len) {
      range.setEnd(n, Math.max(0, end - offset));
      return range;
    }
    offset += len;
  }
  return null;
}

export function usePageReader(root: () => HTMLElement | null, onError?: (message: string) => void) {
  const [reading, setReading] = useState(false);
  const run = useRef(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const marked = useRef<HTMLElement | null>(null);

  const clear = useCallback(() => {
    const h = highlights();
    h?.delete('read-sentence');
    h?.delete('read-word');
    marked.current?.classList.remove('is-reading');
    marked.current = null;
  }, []);
  const stop = useCallback(() => {
    run.current++;
    stopSpeaking();
    audio.current?.pause();
    audio.current = null;
    clear();
    setReading(false);
  }, [clear]);
  useEffect(() => stop, [stop]);

  const mark = (node: HTMLElement | null) => {
    marked.current?.classList.remove('is-reading');
    marked.current = node;
    node?.classList.add('is-reading');
  };

  const say = (text: string, onBoundary?: (i: number, len: number) => void) =>
    new Promise<boolean>((resolve) => {
      let done = false;
      const end = () => {
        if (!done) {
          done = true;
          resolve(true);
        }
      };
      const started = startGermanSpeech(text, { onEnd: end, onError: end, onBoundary });
      if (!started) return resolve(false);
      // Manche Stimmen melden ihr Ende nicht.
      setTimeout(end, 4000 + text.length * 160);
    });

  const play = (src: string, my: number) =>
    new Promise<void>((resolve) => {
      const a = new Audio(src);
      audio.current = a;
      const end = () => {
        if (audio.current === a) audio.current = null;
        resolve();
      };
      a.onended = end;
      a.onerror = end;
      a.onpause = end;
      a.play().catch(end);
      if (run.current !== my) a.pause();
    });

  const read = useCallback(
    async (page: Page) => {
      stop();
      const my = ++run.current;
      const steps = readingSteps(page);
      if (!steps.length) return;
      setReading(true);
      const h = highlights();
      if (h) ensureHighlightStyle();
      const Highlight = (window as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
      try {
        for (const step of steps) {
          if (run.current !== my) return;
          const node = elementNode(root(), step.id);
          mark(node);
          if (step.kind === 'audio') {
            await play(step.src, my);
            continue;
          }
          if (step.kind === 'say') {
            if (!(await say(step.text))) throw new Error('voice');
            continue;
          }
          // Text: Satz für Satz, mit leuchtendem Satz und Wort, wenn die Seite den Text genau so zeigt.
          const nodes = node ? textNodes(node) : [];
          const exact = !!h && !!Highlight && nodes.map((n) => n.data).join('') === step.text;
          if (exact) node?.classList.remove('is-reading');
          for (const s of sentenceRanges(step.text)) {
            if (run.current !== my) return;
            const sentence = exact ? rangeOf(nodes, s.start, s.end) : null;
            if (sentence) h!.set('read-sentence', new Highlight!(sentence));
            h?.delete('read-word');
            const spoken = await say(step.text.slice(s.start, s.end), (i, len) => {
              if (run.current !== my || !exact) return;
              const from = s.start + i;
              const to = len ? from + len : from + (/^[\p{L}\p{N}]+/u.exec(step.text.slice(from))?.[0].length ?? 0);
              const word = to > from ? rangeOf(nodes, from, Math.min(to, s.end)) : null;
              if (word) h!.set('read-word', new Highlight!(word));
            });
            if (!spoken) throw new Error('voice');
          }
        }
      } catch {
        onError?.('Zum Vorlesen braucht es eine deutsche Stimme auf diesem Gerät.');
      } finally {
        if (run.current === my) {
          clear();
          setReading(false);
        }
      }
    },
    [root, stop, clear, onError],
  );

  const toggle = useCallback((page: Page) => (reading ? stop() : void read(page)), [reading, stop, read]);
  return { reading, read, stop, toggle };
}
