'use client';
// “In die Sammlung legen” as in Lernsachen-Heft 1.49.0 (“Ins Regal legen”):
// a suggested name – the figure's name, the photo's words … – and where it goes.
import { useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { SHELF_LABELS, shelfCategory, shelfName } from '@/lib/collection';

export default function ShelveDialog({ elements, onSave, onClose }: { elements: PageElement[]; onSave: (name: string) => void; onClose: () => void }) {
  const suggested = shelfName(elements);
  const [name, setName] = useState(suggested);
  const where = SHELF_LABELS[shelfCategory(elements)];
  const save = () => onSave(name.trim() || suggested);
  return (
    <div className="modal-backdrop">
      <section className="modal shelve-dialog" role="dialog" aria-modal="true" aria-labelledby="shelve-title" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
        <div className="dialog-heading">
          <h2 id="shelve-title">In die Sammlung legen</h2>
        </div>
        <label className="property-label">
          Name in der Sammlung (unter „{where}“)
          <input className="option-input" value={name} maxLength={60} autoFocus onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} />
        </label>
        <div className="learning-actions">
          <button type="button" className="knopf" onClick={onClose}>Abbrechen</button>
          <button type="button" className="knopf knopf-haupt" onClick={save}>Ablegen</button>
        </div>
      </section>
    </div>
  );
}
