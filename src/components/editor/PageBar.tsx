'use client';
import { useState } from 'react';
import { useEditor } from '@/lib/editor-store';
import { rulings, type Page } from '@/lib/notebook-model';
import { PAGE_FRAMES } from '@/lib/learning/validation.mjs';
import { uploadImage } from '@/lib/client-api';
import type { Feature } from '@/lib/features';
import Icon from '../Icon';
import ScaledPage from '../ScaledPage';
import PageView from '../PageView';
import { ChoiceButton, ColorChoice, OptionGroup } from '../ui/Choice';
import OptionBar, { type OptionSection } from './OptionBar';

const frameLabels: Record<string, string> = {
  none: 'Keiner', line: 'Linie', double: 'Doppellinie', rounded: 'Abgerundet',
  classic: 'Klassisch', certificate: 'Urkunde', corners: 'Ecken',
  worksheet: 'Name und Datum', band: 'Farbiger Rand', dashed: 'Gestrichelt',
  dots: 'Punkte', wave: 'Wellen', zigzag: 'Zickzack', scallop: 'Bögen',
  stars: 'Sterne', hearts: 'Herzen', flowers: 'Blumen', leaves: 'Blätter',
  crayon: 'Handgemalt', bunting: 'Wimpel', confetti: 'Konfetti',
};

/** Enlarged top-left corner of a page: shows rulings and frames clearly. */
function CornerGlyph({ page }: { page: Page }) {
  return (
    <span className="page-corner" aria-hidden="true">
      <span className="page-corner-inner">
        <PageView page={{ ...page, elements: [] }} />
      </span>
    </span>
  );
}

function PageGlyph({ page }: { page: Page }) {
  return (
    <span className={`page-glyph ${page.orientation}`}>
      <ScaledPage page={{ ...page, elements: [] }} decorative />
    </span>
  );
}

/** Page settings in the bottom bar (former right-hand column). */
export default function PageBar({
  features,
  page,
  pageIndex,
  pageCount,
  busy,
  onDuplicate,
  onMove,
  onDelete,
  onSaveTemplate,
  onTemplates,
  onChangeTemplate,
}: {
  features: Set<Feature>;
  page: Page;
  pageIndex: number;
  pageCount: number;
  busy?: boolean;
  onDuplicate: () => void;
  onMove: (delta: number) => void;
  onDelete: () => void;
  onSaveTemplate: (name: string) => void;
  onTemplates: () => void;
  /** Other template for this page; the content stays. */
  onChangeTemplate?: () => void;
}) {
  const s = useEditor();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const pagePatch = (values: Partial<Page>) => s.edit((p) => ({ ...p, ...values }));
  const sections: OptionSection[] = [];
  if (features.has('pageDesign')) {
    sections.push(
      {
        id: 'ruling',
        label: 'Lineatur',
        icon: 'rules',
        content: (
          <OptionGroup label="Lineatur">
            {Object.entries(rulings).map(([ruling, label]) => (
              <ChoiceButton
                key={ruling}
                icon={<CornerGlyph page={{ ...page, ruling: ruling as Page['ruling'] }} />}
                label={label}
                pressed={page.ruling === ruling}
                onClick={() => pagePatch({ ruling: ruling as Page['ruling'] })}
              />
            ))}
          </OptionGroup>
        ),
      },
      {
        id: 'format',
        label: 'Format & Farben',
        icon: 'landscape',
        content: (
          <>
            <OptionGroup label="Format">
              {(['portrait', 'landscape'] as const).map((orientation) => (
                <ChoiceButton
                  key={orientation}
                  icon={<PageGlyph page={{ ...page, orientation }} />}
                  label={orientation === 'portrait' ? 'Hochformat' : 'Querformat'}
                  pressed={page.orientation === orientation}
                  onClick={() => pagePatch({ orientation })}
                />
              ))}
            </OptionGroup>
            <OptionGroup label="Farben">
              <ColorChoice label="Papierfarbe" value={page.paperColor || '#ffffff'} onChange={(paperColor) => pagePatch({ paperColor })} />
              <ColorChoice label="Linienfarbe" value={page.lineColor || '#a0bcd3'} onChange={(lineColor) => pagePatch({ lineColor })} />
              <ColorChoice label="Rahmenfarbe" value={page.frameColor || '#52796f'} onChange={(frameColor) => pagePatch({ frameColor })} />
            </OptionGroup>
            <OptionGroup label="Hintergrundbild">
              <label className="choice">
                <span className="choice-icon"><Icon name="add_image" /></span>
                <span className="choice-label">Bild wählen</span>
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
                <ChoiceButton icon="remove_image" label="Entfernen" onClick={() => pagePatch({ backgroundImage: undefined })} />
              )}
              {error && <span className="option-hint fehler" role="alert">{error}</span>}
            </OptionGroup>
          </>
        ),
      },
      {
        id: 'frame',
        label: 'Seitenrahmen',
        icon: 'frame',
        content: (
          <OptionGroup label="Seitenrahmen">
            {PAGE_FRAMES.map((id: string) => (
              <ChoiceButton
                key={id}
                icon={<CornerGlyph page={{ ...page, ruling: 'blanko', pageFrame: id }} />}
                label={frameLabels[id] || id}
                pressed={(page.pageFrame || 'none') === id}
                onClick={() => pagePatch({ pageFrame: id })}
              />
            ))}
          </OptionGroup>
        ),
      },
    );
  }
  if (features.has('pageDesign')) sections.push(
{
        id: 'template',
        label: 'Vorlage',
        icon: 'template',
        content: (
          <>
            {onChangeTemplate && (
              <OptionGroup label="Vorlage dieser Seite">
                <ChoiceButton icon={<PageGlyph page={page} />} label="Andere Vorlage wählen" disabled={busy} onClick={onChangeTemplate} />
              </OptionGroup>
            )}
            {features.has('pageManage') && (
              <OptionGroup label="Neue Seite">
                <ChoiceButton icon="template" label="Neue Seite mit Vorlage" disabled={busy} onClick={onTemplates} />
              </OptionGroup>
            )}
            <span className="option-hint">Beim Wechsel der Vorlage bleibt alles erhalten, was schon auf der Seite ist.</span>
          </>
        ),
      });
  if (features.has('pageManage'))
    sections.push({
      id: 'manage',
      label: 'Seite verwalten',
      icon: 'settings',
      content: (
        <>
          <OptionGroup label={`Seite ${pageIndex + 1} von ${pageCount}`}>
            <ChoiceButton icon="file" label="Duplizieren" disabled={busy} onClick={onDuplicate} />
            <ChoiceButton icon="up" label="Nach vorn" disabled={busy || pageIndex === 0} onClick={() => onMove(-1)} />
            <ChoiceButton icon="down" label="Nach hinten" disabled={busy || pageIndex === pageCount - 1} onClick={() => onMove(1)} />
            <ChoiceButton icon="template" label="Neue Seite aus Vorlage" disabled={busy} onClick={onTemplates} />
            <ChoiceButton icon="empty_trash" label="Seite löschen" danger disabled={busy || pageCount < 2} onClick={onDelete} />
          </OptionGroup>
          <OptionGroup label="Als eigene Vorlage" plain>
            <input
              className="option-input"
              placeholder="Name der Vorlage"
              aria-label="Name der Vorlage"
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <ChoiceButton
              icon="template"
              label="Vorlage speichern"
              disabled={busy || !name.trim()}
              onClick={() => {
                onSaveTemplate(name);
                setName('');
              }}
            />
          </OptionGroup>
        </>
      ),
    });
  return <OptionBar label="Seite einstellen" sections={sections} />;
}

