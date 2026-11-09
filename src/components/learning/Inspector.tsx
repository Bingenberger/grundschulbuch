'use client';
import { useState } from 'react';
import type { PageElement, Page } from '@/lib/notebook-model';
import { useEditor } from '@/lib/editor-store';
import { PAGE_FRAMES } from '@/lib/learning/validation.mjs';
import RichTextDialog from './RichTextDialog';
import { uploadImage } from '@/lib/client-api';
export default function Inspector({
  element,
  onConfigure,
}: {
  element?: PageElement;
  onConfigure: (el: PageElement) => void;
}) {
  const s = useEditor(),
    [rich, setRich] = useState(false),
    [error, setError] = useState('');
  const page = s.pages.find((p) => p.id === s.activeId);
  if (!page) return null;
  const patch = (values: Partial<PageElement>) => s.patchElements(values);
  const pagePatch = (values: Partial<Page>) =>
    s.edit((p) => ({ ...p, ...values }));
  if (!element)
    return (
      <div className="advanced-inspector">
        <h3>Seite gestalten</h3>
        {(
          [
            ['paperColor', 'Papierfarbe', '#ffffff'],
            ['lineColor', 'Linienfarbe', '#a0bcd3'],
            ['frameColor', 'Rahmenfarbe', '#52796f'],
          ] as const
        ).map(([key, label, fallback]) => (
          <label className="property-label" key={key}>
            {label}
            <input
              type="color"
              value={page[key] || fallback}
              onChange={(e) => pagePatch({ [key]: e.target.value })}
            />
          </label>
        ))}
        <label className="property-label">
          Seitenrahmen
          <select
            aria-label="Seitenrahmen"
            value={page.pageFrame || 'none'}
            onChange={(e) => pagePatch({ pageFrame: e.target.value })}
          >
            {PAGE_FRAMES.map((id) => (
              <option key={id} value={id}>
                {
                  (
                    {
                      none: 'Keiner',
                      line: 'Linie',
                      double: 'Doppellinie',
                      rounded: 'Abgerundet',
                      classic: 'Klassisch',
                      certificate: 'Urkunde',
                      corners: 'Ecken',
                      worksheet: 'Name und Datum',
                      band: 'Farbiger Rand',
                      dashed: 'Gestrichelt',
                      dots: 'Punkte',
                      wave: 'Wellen',
                      zigzag: 'Zickzack',
                      scallop: 'Bögen',
                      stars: 'Sterne',
                      hearts: 'Herzen',
                      flowers: 'Blumen',
                      leaves: 'Blätter',
                      crayon: 'Handgemalt',
                      bunting: 'Wimpel',
                      confetti: 'Konfetti',
                    } as Record<string, string>
                  )[id]
                }
              </option>
            ))}
          </select>
        </label>
        <label className="knopf property-button">
          Hintergrundbild wählen
          <input
            className="visually-hidden"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setError('');
              try {
                pagePatch({ backgroundImage: await uploadImage(file) });
              } catch (err) {
                setError((err as Error).message);
              }
            }}
          />
        </label>
        {page.backgroundImage && (
          <button
            className="knopf property-button"
            onClick={() => pagePatch({ backgroundImage: undefined })}
          >
            Hintergrund entfernen
          </button>
        )}
        {error && (
          <p role="alert" className="fehler">
            {error}
          </p>
        )}
      </div>
    );
  return (
    <div className="advanced-inspector">
      <h3>Weitere Einstellungen</h3>
      {['widget', 'activity'].includes(element.type) && (
        <button
          className="knopf property-button"
          onClick={() => onConfigure(element)}
        >
          Aufgabe / Werkzeug gestalten
        </button>
      )}
      {element.type === 'text' && (
        <>
          <button
            className="knopf property-button"
            disabled={element.locked}
            onClick={() => setRich(true)}
          >
            Wörter einzeln formatieren
          </button>
          <label className="property-label">
            Ausrichtung
            <select
              aria-label="Textausrichtung"
              disabled={element.locked}
              value={element.align || 'left'}
              onChange={(e) =>
                patch({ align: e.target.value as PageElement['align'] })
              }
            >
              <option value="left">Links</option>
              <option value="center">Zentriert</option>
              <option value="right">Rechts</option>
              <option value="justify">Blocksatz</option>
            </select>
          </label>
          <label className="property-label">
            Zeilenabstand
            <input
              type="number"
              min=".8"
              max="3"
              step=".1"
              value={element.lineHeight || 1.6}
              disabled={element.locked}
              onChange={(e) =>
                patch({
                  lineHeight: Math.max(
                    0.8,
                    Math.min(3, Number(e.target.value)),
                  ),
                })
              }
            />
          </label>
          <label className="property-label">
            Textkasten
            <select
              value={element.textFrame || 'none'}
              disabled={element.locked}
              onChange={(e) => patch({ textFrame: e.target.value })}
            >
              {[
                ['none', 'Ohne'],
                ['box', 'Kasten'],
                ['note', 'Notizzettel'],
                ['speech', 'Sprechblase'],
                ['thought', 'Denkblase'],
                ['shout', 'Rufblase'],
                ['banner', 'Banner'],
              ].map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </>
      )}
      {element.type === 'image' && (
        <>
          <label className="property-label">
            Bildfilter
            <select
              aria-label="Bildfilter"
              value={element.imageFilter || 'none'}
              disabled={element.locked}
              onChange={(e) => patch({ imageFilter: e.target.value })}
            >
              {[
                ['none', 'Original'],
                ['scan', 'Arbeitsblatt'],
                ['gray', 'Schwarzweiß'],
                ['sepia', 'Sepia'],
                ['bright', 'Heller'],
                ['contrast', 'Kontrast'],
                ['vivid', 'Kräftig'],
                ['pale', 'Blass'],
                ['warm', 'Warm'],
                ['cold', 'Kalt'],
                ['invert', 'Umkehren'],
              ].map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="property-label">
            Bildrahmen
            <select
              value={element.imageFrame || 'none'}
              disabled={element.locked}
              onChange={(e) => patch({ imageFrame: e.target.value })}
            >
              {[
                ['none', 'Ohne'],
                ['photo', 'Foto'],
                ['polaroid', 'Sofortbild'],
                ['border', 'Dunkler Rand'],
                ['round', 'Rund'],
                ['shadow', 'Schatten'],
              ].map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            className="knopf property-button"
            disabled={element.locked}
            onClick={() => patch({ flip: !element.flip })}
          >
            Bild spiegeln
          </button>
          <h4>Bildausschnitt</h4>
          {(['x', 'y', 'width', 'height'] as const).map((key) => {
            const crop = element.crop || { x: 0, y: 0, width: 1, height: 1 };
            return (
              <label className="property-label" key={key}>
                {
                  { x: 'Links', y: 'Oben', width: 'Breite', height: 'Höhe' }[
                    key
                  ]
                }{' '}
                · {Math.round(crop[key] * 100)} %
                <input
                  type="range"
                  min={key === 'width' || key === 'height' ? 0.05 : 0}
                  max="1"
                  step=".01"
                  disabled={element.locked}
                  value={crop[key]}
                  onChange={(e) => {
                    const next = { ...crop, [key]: Number(e.target.value) };
                    if (next.x + next.width > 1) {
                      if (key === 'x') next.width = 1 - next.x;
                      else next.x = 1 - next.width;
                    }
                    if (next.y + next.height > 1) {
                      if (key === 'y') next.height = 1 - next.y;
                      else next.y = 1 - next.height;
                    }
                    next.width = Math.max(0.02, next.width);
                    next.height = Math.max(0.02, next.height);
                    next.x = Math.min(next.x, 1 - next.width);
                    next.y = Math.min(next.y, 1 - next.height);
                    patch({ crop: next });
                  }}
                />
              </label>
            );
          })}
          <button
            className="knopf property-button"
            disabled={element.locked}
            onClick={() => patch({ crop: { x: 0, y: 0, width: 1, height: 1 } })}
          >
            Ganzes Bild
          </button>
        </>
      )}
      {element.type === 'shape' && (
        <>
          <label className="property-label">
            Füllfarbe
            <input
              type="color"
              value={element.fill || '#ffffff'}
              disabled={element.locked}
              onChange={(e) => patch({ fill: e.target.value })}
            />
          </label>
          <label className="property-label">
            Linienstärke (mm)
            <input
              type="number"
              min="0"
              max="10"
              step=".1"
              value={element.strokeWidth ?? 0.4}
              disabled={element.locked}
              onChange={(e) => patch({ strokeWidth: Number(e.target.value) })}
            />
          </label>
        </>
      )}
      <label className="property-label">
        Deckkraft
        <input
          type="range"
          min=".05"
          max="1"
          step=".05"
          disabled={element.locked}
          value={element.opacity ?? 1}
          onChange={(e) => patch({ opacity: Number(e.target.value) })}
        />
      </label>
      <div className="property-row">
        {(['x', 'y'] as const).map((key) => (
          <label key={key}>
            {key.toUpperCase()} (mm)
            <input
              type="number"
              min="-297"
              max="594"
              value={Math.round(element[key])}
              disabled={element.locked}
              onChange={(e) =>
                patch({
                  [key]: Math.max(-297, Math.min(594, Number(e.target.value))),
                })
              }
            />
          </label>
        ))}
      </div>
      {rich && (
        <RichTextDialog
          element={element}
          onClose={() => setRich(false)}
          onSave={patch}
        />
      )}
    </div>
  );
}
