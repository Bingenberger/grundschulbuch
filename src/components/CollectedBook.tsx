'use client';
import { useCallback, useState } from 'react';
import ReaderMode from './ReaderMode';
import { usePageReader } from './usePageReader';
import { featuresFor } from '@/lib/features';
import type { BookData, Page } from '@/lib/notebook-model';

/**
 * A book the teacher has collected: the child can still leaf through it and
 * have it read aloud, but nothing can be changed until it is given back.
 */
export default function CollectedBook({ initial, allowed }: { initial: BookData; allowed?: readonly string[] }) {
  const pages = initial.book.pageIds
    .map((id) => initial.pages.find((p) => p.id === id))
    .filter((p): p is Page => !!p);
  const [pageId, setPageId] = useState(pages[0]?.id ?? '');
  const [error, setError] = useState('');
  const features = featuresFor('child', initial.book, allowed);
  const reader = usePageReader(
    useCallback(() => document.querySelector<HTMLElement>('.reader'), []),
    setError,
  );
  return (
    <main className="child-collected">
      <ReaderMode
        title={initial.book.title}
        pages={pages}
        pageId={pageId}
        onPage={setPageId}
        onResponse={() => undefined}
        readOnly
        allowExternal={features.has('internet')}
        onSpeak={features.has('readAloud') ? (page) => reader.toggle(page) : undefined}
        closeLabel="Meine Hefte"
        notice={error || 'Deine Lehrkraft hat dieses Heft eingesammelt. Du kannst es dir ansehen.'}
        onClose={() => window.location.assign('/kinder')}
      />
    </main>
  );
}
