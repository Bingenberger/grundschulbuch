'use client';
import { CLOCK_DEFAULTS, MATH_DEFAULTS, MAZE_DEFAULTS, MONEY_DEFAULTS, makeClockPages, makeMazePages, makeMathPages, makeMoneyPages } from '@/lib/sheets/reference-sheets';
import { toPages } from '@/lib/sheets/convert';
import { clone, newPage, rulings, uuid, type Page, type Ruling, type Template } from '@/lib/notebook-model';
import { blueprintPages, blueprints } from '@/lib/learning/templates';
import { isInteractiveBlueprint } from '@/lib/learning/blocks';
import { generatePages, type WorksheetKind } from '@/lib/learning/worksheets';
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
  /** “Einstellbar”: opens the worksheet settings instead of inserting right away. */
  configure?: { kind: WorksheetKind; words?: string };
  words: string;
};

export const PAPER = 'Papier & Lineatur';
export const CONFIGURABLE = 'Einstellbar';
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
  [CONFIGURABLE]: 'settings',
};

/** The settable worksheets of the reference: a dialog, then a static page. */
const configurable: [string, WorksheetKind, string?][] = [
  ['Buchstaben üben', 'nachspuren', 'A, a, B, b, C, c, D, d'],
  ['Ziffern üben', 'nachspuren', '0, 1, 2, 3, 4, 5, 6, 7, 8, 9'],
  ['Mathe-Aufgaben', 'rechnen'],
  ['Uhrzeiten üben', 'uhr'],
  ['Rechnen mit Geld', 'moneycalc'],
  ['Labyrinth', 'mazes'],
  ['Noten lernen', 'notenames'],
];
/** Preview of “Mathe-Aufgaben” like in the reference: plus, Rechenmauern, Zahlenstrahl. */
function mathSample() {
  return toPages(makeMathPages({ ...MATH_DEFAULTS, range: 20, formats: ['plus', 'wall', 'line'], layout: 'mixed', pages: 1 }, undefined).slice(0, 1), 'sheet-rechnen');
}
/** Preview of “Uhrzeiten üben” like in the reference: ablesen, in Worten, einzeichnen. */
function clockSample() {
  return toPages(makeClockPages({ ...CLOCK_DEFAULTS, formats: ['read', 'words', 'draw'] }, undefined).slice(0, 1), 'sheet-uhr');
}
/** Preview of “Rechnen mit Geld” like in the reference (drawn coins). */
function moneySample() {
  return toPages(makeMoneyPages({ ...MONEY_DEFAULTS, pics: 'own', formats: ['count', 'change', 'calc'] }, undefined, undefined).slice(0, 1), 'sheet-geld');
}
/** Preview of “Labyrinth” like in the reference: easy, two cats. */
function mazeSample() {
  return toPages(makeMazePages({ ...MAZE_DEFAULTS, level: 1, cats: 2, pages: 1, solutions: false }).slice(0, 1), 'sheet-labyrinth');
}
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
  // Interactive building blocks live in “Lernwerkzeuge” (learning/blocks.ts).
  const designed: TemplateEntry[] = blueprints.filter((meta) => !isInteractiveBlueprint(meta)).map((meta) => ({
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
  const settable: TemplateEntry[] = configurable.map(([title, kind, words]) => ({
    key: `cfg-${title}`,
    title,
    category: CONFIGURABLE,
    // A fixed seed keeps the preview calm.
    build: () => (kind === 'rechnen' ? mathSample() : kind === 'uhr' ? clockSample() : kind === 'moneycalc' ? moneySample() : kind === 'mazes' ? mazeSample() : generatePages({ kind, title, words: words || '', maximum: 20, seed: 7, showSolutions: false }).slice(0, 1)),
    orientation: ['rechnen', 'uhr', 'moneycalc', 'mazes'].includes(kind) ? 'landscape' : 'portrait',
    configure: { kind, words },
    words: `${title} ${CONFIGURABLE} arbeitsblatt einstellbar`,
  }));
  return [...paper, ...designed, ...settable, ...own];
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
