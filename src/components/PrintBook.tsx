'use client';
import { Picker } from './ui/Choice';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { BookData } from '@/lib/notebook-model';
import PageView from './PageView';
import { twoUpSheets } from '@/lib/two-up';
async function printWhenLoaded() {
  await document.fonts.ready;
  await Promise.all(
    Array.from(document.images).map((image) => image.decode().catch(() => undefined)),
  );
  window.print();
}
/** Druckansicht. Aus dem Dialog „Drucken und PDF“ kommen die gewählten Seiten
 *  (`only`) und der Wunsch, gleich den Druckdialog zu öffnen (`autoPrint`). */
export default function PrintBook({
  data,
  only = null,
  autoPrint = false,
  twoUp: initialTwoUp = false,
}: {
  data: BookData;
  only?: string[] | null;
  autoPrint?: boolean;
  /** Zwei Seiten verkleinert (A5) auf einem A4-Blatt. */
  twoUp?: boolean;
}) {
  const [twoUp, setTwoUp] = useState(initialTwoUp);
  const [orientation, setOrientation] = useState<'all' | 'portrait' | 'landscape'>('all');
  const [busy, setBusy] = useState(false);
  const printable = data.pages.filter(
    (p) => p.paperMode !== 'endless' && (!only || only.includes(p.id)),
  );
  const mixed = new Set(printable.map((p) => p.orientation)).size > 1;
  const pages =
    orientation === 'all' ? printable : printable.filter((p) => p.orientation === orientation);
  const started = useRef(false);
  useEffect(() => {
    if (!autoPrint || mixed || !printable.length || started.current) return;
    started.current = true;
    setBusy(true);
    void printWhenLoaded().finally(() => setBusy(false));
  }, [autoPrint, mixed, printable.length]);
  if (!printable.length)
    return (
      <main className="print-book">
        <Link className="knopf" href={`/heft/${data.book.id}`}>‹ Zurück zum Heft</Link>
        <p>Dieses Heft enthält Endlospapier. Speichere es als Heftdatei oder HTML.</p>
      </main>
    );
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
          {printable.length < data.pages.length &&
            ` Gedruckt ${printable.length === 1 ? 'wird 1 Seite' : `werden ${printable.length} Seiten`} von ${data.pages.length}.`}
        </p>
        {mixed && (
          <label>
            Das Heft enthält Hoch- und Querformat. Für maßhaltige Ausdrucke die
            Formate getrennt drucken:{' '}
            <Picker
              label="Seiten drucken"
              value={orientation}
              onChange={setOrientation}
              options={[
                { value: 'all', label: 'Alle Seiten · Vorschau', icon: 'stack_of_photos' },
                { value: 'portrait', label: 'Nur Hochformat', icon: 'rotate_to_portrait' },
                { value: 'landscape', label: 'Nur Querformat', icon: 'rotate_to_landscape' },
              ]}
            />
          </label>
        )}
        {printable.length > 1 && (
          <label className="print-twoup">
            <input type="checkbox" checked={twoUp} onChange={(e) => setTwoUp(e.target.checked)} />{' '}
            2 Seiten auf ein Blatt (A5) – zum Durchschneiden
          </label>
        )}
        <button
          className="knopf knopf-haupt"
          disabled={busy || (mixed && orientation === 'all')}
          onClick={async () => {
            setBusy(true);
            await printWhenLoaded();
            setBusy(false);
          }}
        >
          {busy ? 'Schriften und Bilder laden …' : 'Drucken / als PDF sichern'}
        </button>
      </div>
      {/* Zwei Querformat-Seiten kommen auf ein A4-Blatt im Hochformat und umgekehrt. */}
      <style>{`@media print { @page { size: A4 ${(pages[0]?.orientation === 'landscape') !== twoUp ? 'landscape' : 'portrait'}; margin: 0; } }`}</style>
      <div className={`print-pages${twoUp ? ' two-up' : ''}`}>
        {twoUp
          ? twoUpSheets(pages).map((pair) => (
              <div key={pair[0].id} className={`print-sheet ${pair[0].orientation}`}>
                {pair.map((page) => (
                  <div key={page.id} className="print-half">
                    <PageView page={page} />
                  </div>
                ))}
              </div>
            ))
          : pages.map((page) => <PageView key={page.id} page={page} />)}
      </div>
    </main>
  );
}
