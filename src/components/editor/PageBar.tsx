'use client';
import { useState } from 'react';
import { useEditor } from '@/lib/editor-store';
import { fitsSheet, rulings, type Page } from '@/lib/notebook-model';
import { PAGE_FRAMES } from '@/lib/learning/validation.mjs';
import { uploadImage } from '@/lib/client-api';
import {referencePaper} from '@/lib/learning/reference-paper';
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

export type SchoolDraft = {
  title: string;
  category: string;
  /** Categories already in use, offered as buttons. */
  categories: string[];
  /** What publishing does, e.g. “Ersetzt die Vorlage „Brief“ für alle.” */
  note: string;
};

/** Admins: publish the current page as school template. */
function SchoolPublish({ draft, busy, onPublish }: { draft: SchoolDraft; busy?: boolean; onPublish: (title: string, category: string) => void }) {
  const [title, setTitle] = useState(draft.title);
  const [category, setCategory] = useState(draft.category);
  return (
    <OptionGroup label="Schulvorlage für alle" plain>
      <input className="option-input" placeholder="Name der Schulvorlage" aria-label="Name der Schulvorlage" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="option-input" placeholder="Kategorie" aria-label="Kategorie der Schulvorlage" maxLength={40} value={category} onChange={(e) => setCategory(e.target.value)} />
      {draft.categories.slice(0, 12).map((c) => (
        <ChoiceButton key={c} icon="folder" label={c} pressed={category === c} onClick={() => setCategory(c)} />
      ))}
      <ChoiceButton icon="graduation_cap" label="Für alle veröffentlichen" disabled={busy || !title.trim()} onClick={() => onPublish(title, category)} />
      <span className="option-hint">{draft.note}</span>
    </OptionGroup>
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
  onTiles,
  templates = true,
  school,
  onPublishSchool,
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
  /** Opens the tile view of all pages. */
  onTiles?: () => void;
  /** Section “Vorlage” (not for children). */
  templates?: boolean;
  /** Admins only: publishing this page as school template for everybody. */
  school?: SchoolDraft;
  onPublishSchool?: (title: string, category: string) => void;
}) {
  const s = useEditor();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const pagePatch = (values: Partial<Page>) => s.edit((p) => {
    const paper = values.ruling || (values.orientation && p.paperReferenceId)
      ? referencePaper(values.ruling || p.ruling, values.orientation || p.orientation) : null;
    return { ...p, ...values, ...(paper ? {paperReferenceId:paper.paperReferenceId,templateRuling:paper.templateRuling} : {}) };
  });
  const sections: OptionSection[] = [];
  if (features.has('pageDesign'))
    sections.push(
      {
        id: 'paper',
        label: 'Papier',
        icon: 'rules',
        content: (
          <>
            <OptionGroup label="Lineatur">
              {Object.entries(rulings).map(([ruling, label]) => (
                <ChoiceButton
                  key={ruling}
                  icon={<CornerGlyph page={{ ...page, ...referencePaper(ruling as Page['ruling'],page.orientation) }} />}
                  label={label}
                  pressed={page.ruling === ruling}
                  onClick={() => pagePatch({ ruling: ruling as Page['ruling'] })}
                />
              ))}
            </OptionGroup>
            <OptionGroup label="Format">
              {(['landscape', 'portrait'] as const).map((orientation) => (
                <ChoiceButton
                  key={orientation}
                  icon={<PageGlyph page={{ ...page, orientation,paperMode:undefined }} />}
                  label={orientation === 'portrait' ? 'Hochformat' : 'Querformat'}
                  pressed={!page.paperMode && page.orientation === orientation}
                  disabled={page.paperMode==='endless'&&!fitsSheet(page,orientation)}
                  title={page.paperMode==='endless'?'Alle Inhalte müssen auf das gewählte Papierformat passen.':undefined}
                  onClick={() => pagePatch({ orientation, paperMode:undefined })}
                />
              ))}
              <ChoiceButton icon="seiten" label="Endlospapier" pressed={page.paperMode==='endless'} onClick={()=>pagePatch({paperMode:'endless',orientation:'landscape'})}/>
              {page.paperMode==='endless'&&<span className="option-hint">Die Fläche ist in alle Richtungen offen und wächst mit. Verschieben mit zwei Fingern, Mausrad, mittlerer Maustaste oder Leertaste + Ziehen. Speichere sie als Heftdatei oder HTML; Drucken und PDF entfallen.</span>}
            </OptionGroup>
          </>
        ),
      },
      {
        id: 'colours',
        label: 'Farben & Bild',
        icon: 'landscape',
        content: (
          <>
            <OptionGroup label="Farben">
              <ColorChoice label="Papierfarbe" value={page.paperColor || '#ffffff'} onChange={(paperColor) => pagePatch({ paperColor })} />
              <ColorChoice label="Linienfarbe" value={page.lineColor || '#a0bcd3'} onChange={(lineColor) => pagePatch({ lineColor })} />
              {(page.paperColor || page.lineColor) && (
                <ChoiceButton
                  icon="synchronize"
                  label="Standardfarben"
                  onClick={() => pagePatch({ paperColor: undefined, lineColor: undefined })}
                />
              )}
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
        label: 'Rahmen',
        icon: 'frame',
        content: (
          <>
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
            {page.pageFrame && page.pageFrame !== 'none' && (
              <OptionGroup label="Rahmenfarbe">
                <ColorChoice label="Rahmenfarbe" value={page.frameColor || '#52796f'} onChange={(frameColor) => pagePatch({ frameColor })} />
              </OptionGroup>
            )}
          </>
        ),
      },
    );
  if (features.has('pageDesign') && templates)
    sections.push(
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
            <OptionGroup label="Als eigene Vorlage speichern" plain>
              <input
                className="option-input"
                placeholder="Name der Vorlage"
                aria-label="Name der Vorlage"
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <ChoiceButton
                icon="bookmark"
                label="Vorlage speichern"
                disabled={busy || !name.trim()}
                onClick={() => {
                  onSaveTemplate(name);
                  setName('');
                }}
              />
            </OptionGroup>
            {school && onPublishSchool && <SchoolPublish key={page.template || 'neu'} draft={school} busy={busy} onPublish={onPublishSchool} />}
            <span className="option-hint">Beim Wechsel der Vorlage bleibt alles erhalten, was schon auf der Seite ist.</span>
          </>
        ),
      },
    );
  if (features.has('pageManage'))
    sections.push({
      id: 'manage',
      label: 'Seiten',
      icon: 'seiten',
      content: (
        <>
          {onTiles && (
            <OptionGroup label="Alle Seiten">
              <ChoiceButton icon="grid" label="Kachelansicht" disabled={busy} onClick={onTiles} />
            </OptionGroup>
          )}
          <OptionGroup label={`Seite ${pageIndex + 1} von ${pageCount}`}>
            <ChoiceButton icon="plus" label="Neue Seite" disabled={busy} onClick={onTemplates} />
            <ChoiceButton icon="file" label="Duplizieren" disabled={busy} onClick={onDuplicate} />
            <ChoiceButton icon="up" label="Nach vorn" disabled={busy || pageIndex === 0} onClick={() => onMove(-1)} />
            <ChoiceButton icon="down" label="Nach hinten" disabled={busy || pageIndex === pageCount - 1} onClick={() => onMove(1)} />
            <ChoiceButton icon="empty_trash" label="Seite löschen" danger disabled={busy || pageCount < 2} onClick={onDelete} />
          </OptionGroup>
        </>
      ),
    });
  return <OptionBar label="Seite einstellen" sections={sections} />;
}

