'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/client-api';
import type { PageElement, Template } from '@/lib/notebook-model';
import ScaledPage from './ScaledPage';
export default function CollectionDialog({
  onInsert,
  onClose,
}: {
  onInsert: (elements: PageElement[]) => void;
  onClose: () => void;
}) {
  const [assets, setAssets] = useState<Template[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    api<Template[]>('assets')
      .then(setAssets)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div className="modal-backdrop">
      <section
        className="modal template-dialog"
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
          sie in anderen Heften wiederzuverwenden.
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
        <div className="template-grid">
          {assets
            .filter((a) => a.title.toLowerCase().includes(query.toLowerCase()))
            .map((asset) => (
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
                  onClick={async () => {
                    try {
                      await api('removeAsset', { assetId: asset.id });
                      setAssets(assets.filter((a) => a.id !== asset.id));
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
      </section>
    </div>
  );
}
