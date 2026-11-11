'use client';
import { clone, newPage, rulings, uuid, type Page, type Ruling, type Template } from '@/lib/notebook-model';
import { blueprintPages, blueprints } from '@/lib/learning/templates';
import type { IconName } from '../Icon';

export type Orientation = Page['orientation'];
export type TemplateEntry = {
  key: string;
  title: string;
  category: string;
  /** Pages of the template in the chosen format. */
  build: (orientation: Orientation) => Page[];
  /** Saved pages keep their own format. */
  orientation?: Orientation;
  /** Own saved template (can be removed). */
  savedId?: string;
  words: string;
};

export const PAPER = 'Papier & Lineatur';
const categoryIcons: Record<string, IconName> = {
  [PAPER]: 'rules',
  Schreiben: 'signature',
  Gestalten: 'template',
  'Comic & Film': 'clapperboard',
  Alltag: 'planner',
  Wohnen: 'home',
  Präsentation: 'podium_with_speaker',
  Musik: 'music',
  Mathe: 'calculator',
  Kommunikation: 'comments',
  'Interaktive Übungen': 'puzzle',
  Schulvorlagen: 'graduation_cap',
  Schule: 'graduation_cap',
  'Lesen & Schreiben': 'reading',
  Kennenlernen: 'conference_call',
  Deutsch: 'reading_ebook',
  Organisation: 'todo_list',
  'Eigene Vorlagen': 'bookmark',
};
export const categoryIcon = (category: string): IconName => categoryIcons[category] || 'template';

/** Fresh ids, so a template can be used again and again. */
function copyPage(page: Page): Page {
  const groups = new Map<string, string>();
  const copy = clone(page);
  return {
    ...copy,
    id: uuid(),
    revision: 0,
    elements: copy.elements.map((el) => ({
      ...el,
      id: uuid(),
      groupId: el.groupId ? groups.get(el.groupId) || (groups.set(el.groupId, uuid()), groups.get(el.groupId)) : undefined,
      link: el.link?.kind === 'page' ? undefined : el.link,
    })),
  };
}

export function templateCatalog(saved: Template[]): TemplateEntry[] {
  const paper: TemplateEntry[] = (Object.entries(rulings) as [Ruling, string][]).map(([ruling, title]) => ({
    key: `paper-${ruling}`,
    title,
    category: PAPER,
    build: (o) => [newPage(ruling, o)],
    words: `${title} ${PAPER} linien lineatur papier kariert`,
  }));
  const designed: TemplateEntry[] = blueprints.map((meta) => ({
    key: `bp-${meta.id}`,
    title: meta.title,
    category: meta.category,
    build: (o) => blueprintPages(meta, o),
    words: `${meta.title} ${meta.category} ${meta.widget || ''} ${meta.activity || ''}`,
  }));
  const own: TemplateEntry[] = saved.map((t) => {
    const category = t.category || (t.school ? 'Schulvorlagen' : 'Eigene Vorlagen');
    return {
      key: `tpl-${t.id}`,
      title: t.title,
      category,
      build: () => [copyPage(t.page)],
      orientation: t.page.orientation,
      savedId: t.school ? undefined : t.id,
      words: `${t.title} ${category}`,
    };
  });
  return [...paper, ...designed, ...own];
}

/**
 * New background for a page from a template; what is already on the page
 * stays. Only an empty page also gets the template's elements.
 */
export function applyTemplate(page: Page, template: Page, key: string): Page {
  const empty = !page.elements.length;
  return {
    ...page,
    template: key,
    orientation: empty ? template.orientation : page.orientation,
    ruling: template.ruling,
    paperColor: template.paperColor,
    lineColor: template.lineColor,
    pageFrame: template.pageFrame,
    frameColor: template.frameColor,
    backgroundImage: template.backgroundImage,
    elements: empty ? template.elements : page.elements,
  };
}

const RECENT = 'grundschulbuch-vorlagen-zuletzt';
export function recentTemplates(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT) || '[]');
    return Array.isArray(list) ? list.filter((k) => typeof k === 'string').slice(0, 8) : [];
  } catch {
    return [];
  }
}
export function rememberTemplate(key: string) {
  try {
    localStorage.setItem(RECENT, JSON.stringify([key, ...recentTemplates().filter((k) => k !== key)].slice(0, 8)));
  } catch {}
}
