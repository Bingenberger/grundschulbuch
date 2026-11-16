import { CLOCK_DEFAULTS, MATH_DEFAULTS, MAZE_DEFAULTS, MONEY_DEFAULTS, NOTE_DEFAULTS, LETTER_DEFAULTS, DIGIT_DEFAULTS, makeLetterPages, makeClockPages, makeMazePages, makeNotePages, makeMathPages, makeMoneyPages } from '@/lib/sheets/reference-sheets';
import { toPages } from '@/lib/sheets/convert';
import { clone, rulings, uuid, type Page, type Ruling, type Template } from '@/lib/notebook-model';
import { blueprintPages, blueprints } from '@/lib/learning/templates';
import { isInteractiveBlueprint } from '@/lib/learning/blocks';
import { generatePages, type WorksheetKind } from '@/lib/learning/worksheets';
import type { IconName } from '../Icon';
import { templatePolicy, applyInsertionMode, type TemplatePolicies } from '@/lib/template-policy.mjs';
import {referencePaper} from '@/lib/learning/reference-paper';

export type Orientation = Page['orientation'];
export type TemplateEntry = {
  key: string;
  title: string;
  category: string;
  /** Pages of the template in the chosen format. */
  build: (orientation?: Orientation) => Page[];
  /** Saved pages keep their own format. */
  orientation?: Orientation;
  /** Own saved template (can be removed). */
  savedId?: string;
  /** Id of the school template behind this entry (admin area). */
  schoolId?: string;
  /** A school template takes the place of the built-in one. */
  replaced?: boolean;
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
  'Beruf & Praktikum': 'businesswoman',
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
/** Preview of “Noten lernen” like in the reference. */
function noteSample() {
  return toPages(makeNotePages({ ...NOTE_DEFAULTS }, undefined).slice(0, 1), 'sheet-noten');
}
/** Preview of “Buchstaben üben” (A) and “Ziffern üben” (5) like in the reference. */
function letterSample(digits: boolean) {
  const o = digits ? { ...DIGIT_DEFAULTS, letters: ['5'], pics: 'own' } : { ...LETTER_DEFAULTS, letters: ['A'], pics: 'own' };
  return toPages(makeLetterPages(o, undefined).slice(0, 1), digits ? 'sheet-ziffern' : 'sheet-buchstaben');
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
/** Fit saved portrait designs onto the chosen paper without stretching. */
function orientPage(page:Page,orientation:Orientation):Page {
  if(page.orientation===orientation)return page;
  const k=210/297,dx=orientation==='landscape'?(297-210*k)/2:0,dy=orientation==='portrait'?(297-210*k)/2:0;
  return {...page,orientation,elements:page.elements.map(el=>({...el,x:el.x*k+dx,y:el.y*k+dy,width:el.width*k,height:el.height*k,
    ...(el.fontSize?{fontSize:Math.max(6,el.fontSize*k)}:{}),...(el.textLinePitch?{textLinePitch:el.textLinePitch*k}:{}),...(el.designScale?{designScale:el.designScale*k}:{}),...(el.strokeWidth?{strokeWidth:el.strokeWidth*k}:{}),...(el.penWidth?{penWidth:el.penWidth*k}:{}),...(el.points?{points:el.points.map(p=>({...p,x:p.x*k,y:p.y*k}))}:{})})),
    ...(page.templateRuling?{templateRuling:{...page.templateRuling,top:page.templateRuling.top*k+dy,left:page.templateRuling.left*k+dx,right:page.templateRuling.right*k+dx,pitch:page.templateRuling.pitch*k,baseline:page.templateRuling.baseline*k,xHeight:page.templateRuling.xHeight*k}}:{})};
}

/**
 * All templates. School templates with `replaces` take the place (and key) of
 * a built-in one; keys in `hidden` are left out unless `withHidden` is set.
 */
export function templateCatalog(saved: Template[], hidden: string[] = [], withHidden = false, policies?: TemplatePolicies, classId?: string | null): TemplateEntry[] {
  const paper: TemplateEntry[] = (Object.entries(rulings) as [Ruling, string][]).map(([ruling, title]) => ({
    key: `paper-${ruling}`,
    title,
    category: PAPER,
    build: (o='landscape') => [referencePaper(ruling,o)],
    words: `${title} ${PAPER} linien lineatur papier kariert`,
  }));
  // Interactive building blocks live in “Lernwerkzeuge” (learning/blocks.ts).
  const designed: TemplateEntry[] = blueprints.filter((meta) => !isInteractiveBlueprint(meta)).map((meta) => ({
    key: `bp-${meta.id}`,
    title: meta.title,
    category: meta.category,
    build: (o='landscape') => blueprintPages(meta, o),
    words: `${meta.title} ${meta.category} ${meta.widget || ''} ${meta.activity || ''}`,
  }));
  const toEntry = (t: Template, key = `tpl-${t.id}`, fallback?: string): TemplateEntry => {
    const category = t.category || fallback || (t.school ? 'Schulvorlagen' : 'Eigene Vorlagen');
    return {
      key,
      title: t.title,
      category,
      build: (o='landscape') => [{ ...orientPage(copyPage(t.page),o), template: key }],
      savedId: t.school ? undefined : t.id,
      schoolId: t.school ? t.id : undefined,
      words: `${t.title} ${category}`,
    };
  };
  const replacements = new Map(saved.filter((t) => t.school && t.replaces).map((t) => [t.replaces!, t]));
  const own: TemplateEntry[] = saved.filter((t) => !(t.school && t.replaces)).map((t) => toEntry(t));
  const settable: TemplateEntry[] = configurable.map(([title, kind, words]) => ({
    key: `cfg-${title}`,
    title,
    category: CONFIGURABLE,
    // A fixed seed keeps the preview calm.
    build: () => (kind === 'rechnen' ? mathSample() : kind === 'uhr' ? clockSample() : kind === 'moneycalc' ? moneySample() : kind === 'mazes' ? mazeSample() : kind === 'notenames' ? noteSample() : kind === 'nachspuren' ? letterSample(title === 'Ziffern üben') : generatePages({ kind, title, words: words || '', maximum: 20, seed: 7, showSolutions: false }).slice(0, 1)),
    orientation: 'landscape',
    configure: { kind, words },
    words: `${title} ${CONFIGURABLE} arbeitsblatt einstellbar`,
  }));
  const hide = new Set(withHidden ? [] : hidden);
  // Keep published school designs even when their former built-in approximation
  // no longer exists in the original catalogue.
  const keys=new Set([...paper,...designed,...settable].map(e=>e.key));
  for(const t of saved) if(t.school&&t.replaces&&!keys.has(t.replaces)) own.push(toEntry(t,t.replaces));
  return [...paper, ...designed, ...settable, ...own]
    .map((entry) => {
      const t = replacements.get(entry.key);
      if (!t || entry.configure) return entry;
      // A built-in template replaced by a school one keeps its key and place.
      return { ...toEntry(t, entry.key, entry.category === 'Schulvorlagen' ? undefined : entry.category), replaced: true };
    })
    .filter((entry) => withHidden || (policies ? templatePolicy(policies, hidden, entry.key, classId).enabled : !hide.has(entry.key)))
    .map(entry => withHidden ? entry : {
      ...entry,
      build: (orientation='landscape') => entry.build(orientation).map(page => {
        const {templateClassId: previousClass, ...content} = page;
        void previousClass;
        return applyInsertionMode({ ...content, template: entry.key, ...(classId ? {templateClassId:classId} : {}) }, templatePolicy(policies,hidden,entry.key,classId).insertion);
      }),
    });
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
    templateClassId: template.templateClassId,
    orientation: empty ? template.orientation : page.orientation,
    paperMode: empty ? template.paperMode : page.paperMode,
    ruling: template.ruling,
    paperReferenceId: template.paperReferenceId,
    templateRuling: template.templateRuling,
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
