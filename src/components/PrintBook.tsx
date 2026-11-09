'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { BookData } from '@/lib/notebook-model';
import PageView from './PageView';
export default function PrintBook({ data }: { data: BookData }) {
  const [orientation, setOrientation] = useState<
    'all' | 'portrait' | 'landscape'
  >('all');
  const [busy, setBusy] = useState(false);
  const mixed = new Set(data.pages.map((p) => p.orientation)).size > 1;
  const pages =
    orientation === 'all'
      ? data.pages
      : data.pages.filter((p) => p.orientation === orientation);
  return (
    <main className="print-book">
      <div className="print-controls">
        <Link className="knopf" href={`/heft/${data.book.id}`}>
          ‹ Zurück zum Heft
        </Link>
        <h1>{data.book.title}</h1>
        <p>
          Im Druckdialog: A4, Maßstab 100 %, Ränder „Keine“ und Kopf-/Fußzeilen
          ausschalten. Für eine PDF „Als PDF sichern“ wählen.
        </p>
        {mixed && (
          <label>
            Das Heft enthält Hoch- und Querformat. Für maßhaltige Ausdrucke die
            Formate getrennt drucken:{' '}
            <select
              value={orientation}
              onChange={(e) =>
                setOrientation(e.target.value as typeof orientation)
              }
            >
              <option value="all">Alle Seiten · Vorschau</option>
              <option value="portrait">Nur Hochformat</option>
              <option value="landscape">Nur Querformat</option>
            </select>
          </label>
        )}
        <button
          className="knopf knopf-haupt"
          disabled={busy || (mixed && orientation === 'all')}
          onClick={async () => {
            setBusy(true);
            await document.fonts.ready;
            await Promise.all(
              Array.from(document.images).map((image) =>
                image.decode().catch(() => undefined),
              ),
            );
            setBusy(false);
            window.print();
          }}
        >
          {busy ? 'Schriften und Bilder laden …' : 'Drucken / als PDF sichern'}
        </button>
      </div>
      <style>{`@media print { @page { size: A4 ${pages[0]?.orientation === 'landscape' ? 'landscape' : 'portrait'}; margin: 0; } }`}</style>
      <div className="print-pages">
        {pages.map((page) => (
          <PageView key={page.id} page={page} />
        ))}
      </div>
    </main>
  );
}
