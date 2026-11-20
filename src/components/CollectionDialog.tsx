'use client';
// “Meine Sammlung”, sorted like the shelf of Lernsachen-Heft 1.49.0: own
// figures and talking photos under “Selbst gemacht”, everything else under
// “Persönlich”. The collection lives on the school server, so it is there in
// every notebook and on every device.
import { useEffect, useState } from 'react';
import { api } from '@/lib/client-api';
import type { PageElement, Template } from '@/lib/notebook-model';
import { SHELF_LABELS, shelfCategory, type ShelfCategory } from '@/lib/collection';
import ScaledPage from './ScaledPage';

const NOTES: Record<ShelfCategory, string> = {
  made: 'Eigene Figuren und sprechende Fotos: auf der Seite antippen, dann „In Sammlung sichern“ – so nimmst du sie in jedes Heft mit.',
  personal: 'Eigene Bilder, Zeichnungen, Texte und Lernwerkzeuge: auf der Seite antippen, dann „In Sammlung sichern“.',
};

export default function CollectionDialog({
  onInsert,
  onClose,
}: {
  onInsert: (elements: PageElement[]) => void;
  onClose: () => void;
}) {
  const [assets, setAssets] = useState<Template[] | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    api<Template[]>('assets')
      .then(setAssets)
      .catch((e) => setError(e.message));
  }, []);
  const found = (assets ?? []).filter((a) => a.title.toLowerCase().includes(query.trim().toLowerCase()));
  const sections = (['made', 'personal'] as const).map((cat) => ({ cat, entries: found.filter((a) => shelfCategory(a.page.elements) === cat) }));
  return (
    <div className="modal-backdrop">
      <section
        className="modal template-dialog collection-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="collection-title"
      >
        <div className="dialog-heading">
          <h2 id="collection-title">Meine Sammlung</h2>
          <button className="knopf" onClick={onClose}>
            Schließen
          </button>
        </div>
        <p>
          Markiere Elemente auf einer Seite und wähle „In Sammlung sichern“, um
          sie in anderen Heften wiederzuverwenden. Die Sammlung liegt auf dem
          Schulserver – in jedem Heft und auf jedem Gerät.
        </p>
        <label className="search">
          <input
            aria-label="Sammlung durchsuchen"
            placeholder="Suchen …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
        {assets && query.trim() && !found.length && <p className="option-hint">Nichts gefunden.</p>}
        {sections.map(({ cat, entries }) => (query.trim() && !entries.length ? null : (
          <section key={cat} className={`collection-section is-${cat}`} aria-labelledby={`collection-${cat}`}>
            <h3 id={`collection-${cat}`}>{SHELF_LABELS[cat]}</h3>
            {!entries.length && assets && <p className="option-hint">{NOTES[cat]}</p>}
            <div className="template-grid">
              {entries.map((asset) => (
                <div key={asset.id}>
                  <button
                    onClick={() => {
                      onInsert(asset.page.elements);
                      onClose();
                    }}
                  >
                    <ScaledPage page={asset.page} decorative />
                    <strong>{asset.title}</strong>
                  </button>
                  <button
                    className="sidebar-link"
                    aria-label={`${asset.title} aus der Sammlung entfernen`}
                    onClick={async () => {
                      try {
                        await api('removeAsset', { assetId: asset.id });
                        setAssets((all) => (all ?? []).filter((a) => a.id !== asset.id));
                      } catch (e) {
                        setError((e as Error).message);
                      }
                    }}
                  >
                    Entfernen
                  </button>
                </div>
              ))}
            </div>
            {entries.length > 0 && <p className="option-hint">{NOTES[cat]}</p>}
          </section>
        )))}
      </section>
    </div>
  );
}
