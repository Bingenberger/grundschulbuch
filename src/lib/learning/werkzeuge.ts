// The tools of Lernsachen-Heft 1.47.3 that are drawn by the reference's tool
// host (reference/tools-runtime.ts): one widget kind “werkzeug” for all of
// them. The settings keep the tool and its configuration as the reference
// stores it (settings.werkzeug); what is tapped and kept (counts, ticks, …)
// goes into the response, tied to the configuration it belongs to.
import presetData from './werkzeug-presets.json';
import sortData from './sort-sets.json';
import { registerBudget, SPIN_COLORS, TOOL_REGISTRY } from '../reference/tools-runtime';
import { findPicture } from './picture-search';
import { uuid, type PageElement } from '../notebook-model';
import { referenceElement } from './page-designs';
import type { JsonValue, LearningSettings } from './catalog';

/** Tools available as “werkzeug” (Hör-Memory has its own kind “hoeren”). */
export const TOOL_IDS = ['tally', 'spin', 'seek', 'pattern', 'mood', 'vote', 'rating', 'check', 'stress', 'steps', 'traffic', 'pieces', 'body', 'timeline', 'phone', 'practice', 'circles', 'week', 'sort', 'budget', 'machine', 'kipartner'] as const;
export type ToolId = (typeof TOOL_IDS)[number];
type ToolSpec = {
  kind: string;
  field: string;
  draw: (el: HTMLElement, item: Record<string, unknown>, live: boolean, options: Record<string, unknown>) => void;
  label: (item: Record<string, unknown>) => string;
  config: (raw: unknown, media: (v: unknown) => string | undefined) => Record<string, unknown>;
  redraw: (id: string) => void;
  /** Starts the tool afresh after new settings. */
  reset?: (id: string) => void;
  register?: (save: (id: string, a: unknown, b?: unknown) => void) => void;
  state?: string[];
};
const REGISTRY = TOOL_REGISTRY as unknown as Record<ToolId, ToolSpec>;
// The Geld-Planer saves its whole plan (rows filled in on the page, maybe with
// a picture); pictures come from our picture search and are kept on the school server.
REGISTRY.budget = {
  ...REGISTRY.budget,
  state: ['bud'],
  register: (save) => registerBudget({
    save: (id: string, bud: unknown) => save(id, bud),
    picture: async (query?: string) => {
      if (!query?.trim()) return null;
      try { const src = await findPicture(query.trim(), new AbortController().signal); return src ? { id: src, kind: 'image', dataUrl: src } : null; } catch { return null; }
    },
  }),
};
export const toolSpec = (tool: ToolId) => REGISTRY[tool];
/** Names of the tools (catalogue labels of the reference). */
export const TOOL_TITLES: Record<ToolId, string> = {
  tally: 'Strichliste und Diagramm', spin: 'Glücksrad und Würfel', seek: 'Suchbild', pattern: 'Muster fortsetzen',
  mood: 'Wie geht es dir heute?', vote: 'Abstimmung und Wahl', rating: 'Selbst- und Fremdeinschätzung', check: 'Checkliste',
  stress: 'Stressbarometer', steps: 'Ablaufplan', traffic: 'Fußgängerampel', pieces: 'Stückzähler', body: 'Wo tut es weh?',
  timeline: 'Zeitleiste', phone: 'Telefonieren üben', practice: 'Gespräche üben',
  circles: 'Nähe und Distanz', week: 'Wochenplan', sort: 'Sortieren', budget: 'Geld-Planer', machine: 'Automat',
  kipartner: 'KI-Partner bauen',
};
export const isTool = (v: unknown): v is ToolId => typeof v === 'string' && (TOOL_IDS as readonly string[]).includes(v);

type PresetItem = Record<string, unknown> & { type: string; kind?: string; x: number; y: number; w: number; h: number };
export type ToolPreset = { id: string; title: string; group: string; items: PresetItem[] };
/** Ready-made sets of Sortieren and Bild-Quiz (with their pictures). */
export const SORT_SETS = sortData.sets;
export const SORT_COLORS = sortData.colors;
/** The catalogue starts Sortieren with the Ernährungsampel and the Bild-Quiz with the signs (as the reference). */
const SORT_START: Record<string, string> = { sort: 'food', 'sort-quiz': 'signs-quiz' };
export const TOOL_PRESETS = (presetData as unknown as ToolPreset[]).map((p) => {
  const set = SORT_SETS.find((s) => s.id === SORT_START[p.id]);
  return set ? { ...p, items: p.items.map((i) => (i.kind === 'sort' ? { ...i, sort: { title: set.title, mode: set.mode, ask: set.ask ?? 'Was ist das?', boxes: set.boxes, items: set.items } } : i)) } : p;
});

/** Own pictures and sounds are media addresses of the school server; the pictures of the
 *  ready-made sort sets ship with the app (public/sortieren). */
const media = (v: unknown) => (typeof v === 'string' && (/^\/api\/medien\/[\w./-]+$/.test(v) || /^\/sortieren\/[\w-]+\.(webp|svg)$/.test(v)) ? v : undefined);

/** Cleaned configuration, with the reference's own rules. */
export function toolConfig(tool: ToolId, raw: unknown) {
  return REGISTRY[tool].config(raw, media);
}

/** The reference looks up pictures by key; ours are addresses already. */
export function toolAssets(value: unknown) {
  const assets: Record<string, { dataUrl: string }> = {};
  (function scan(v: unknown) {
    if (typeof v === 'string') { if (media(v)) assets[v] = { dataUrl: v }; }
    else if (Array.isArray(v)) v.forEach(scan);
    else if (v && typeof v === 'object') Object.values(v).forEach(scan);
  })(value);
  return assets;
}

/** A short fingerprint of a configuration (FNV-1a), to tie a response to it. */
export function fingerprint(value: unknown) {
  let h = 0x811c9dc5;
  for (const ch of JSON.stringify(value ?? null)) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193) >>> 0;
  return h.toString(36);
}

export type ToolResponse = { base: string; state: Record<string, JsonValue> };
/** The configuration with what was kept while using it (only if the settings did not change since). */
export function toolCurrent(tool: ToolId, settings: LearningSettings | undefined, response: unknown) {
  const config = toolConfig(tool, settings?.werkzeug);
  const saved = (response as { werkzeug?: ToolResponse } | undefined)?.werkzeug;
  const keys = REGISTRY[tool].state;
  if (!keys || !saved || saved.base !== fingerprint(settings?.werkzeug)) return config;
  const state = Object.fromEntries(keys.filter((k) => k in saved.state).map((k) => [k, saved.state[k]]));
  // The Geld-Planer keeps its whole plan.
  if (state.bud) return toolConfig(tool, state.bud);
  // Nähe und Distanz keeps the ring of each person (as the reference saves it).
  if (Array.isArray(state.rings)) return toolConfig(tool, { ...config, people: (config.people as { ring: number }[]).map((p, i) => ({ ...p, ring: (state.rings as number[])[i] ?? -1 })) });
  return toolConfig(tool, { ...config, ...state });
}

const MM = 297 / 1400;
const mm = (v: number) => Math.round(v * MM * 10) / 10;
/** Size of the tool on the page as in the reference's catalogue (first item of its kind). */
export function toolSize(tool: ToolId) {
  const kind = REGISTRY[tool].kind;
  const item = TOOL_PRESETS.flatMap((p) => p.items).find((i) => i.kind === kind);
  return item ? { width: mm(item.w), height: mm(item.h) } : { width: 250, height: 170 };
}
/** Size of the tool in the reference's units (1400 = page width), for previews. */
export function toolUnits(tool: ToolId): [number, number] {
  const kind = REGISTRY[tool].kind;
  const item = TOOL_PRESETS.flatMap((p) => p.items).find((i) => i.kind === kind);
  return item ? [item.w, item.h] : [1300, 870];
}
export const toolOfKind = (kind: unknown) => TOOL_IDS.find((t) => REGISTRY[t].kind === kind);

/** Settings of a tool element for a configuration. */
export function toolSettings(tool: ToolId, config: unknown, title: string): LearningSettings {
  return { title, tool, werkzeug: toolConfig(tool, config) as unknown as JsonValue };
}

/** The tools of a preset page (undefined: a tool not taken over yet). */
export const presetTools = (preset: ToolPreset) => preset.items.filter((i) => i.type === 'widget' && !['avatar', 'bookmarks', 'code'].includes(String(i.kind))).map((i) => toolOfKind(i.kind));
/** The elements of a preset page (the reference's items in mm; texts and read-aloud keys as in the page designs). */
export function presetElements(preset: ToolPreset): PageElement[] {
  return preset.items.flatMap((item) => {
    if (item.type !== 'widget') return [referenceElement(item, MM)];
    const box = { id: uuid(), type: 'widget' as const, x: mm(item.x), y: mm(item.y), width: mm(item.w), height: mm(item.h), rotation: 0, locked: false, color: '#253c42' };
    // Widgets of the reference that are kinds of their own here.
    if (item.kind === 'avatar') return [{ ...box, widgetKind: 'figur', settings: { title: 'Figur', av: item.av, ...(item.say ? { say: item.say } : {}) } } as PageElement];
    if (item.kind === 'bookmarks') return [{ ...box, widgetKind: 'linksammlung', settings: { title: 'Linksammlung', bm: item.bm } } as PageElement];
    if (item.kind === 'code') return [{ ...box, widgetKind: 'programmieren', settings: { title: 'Programmieren', pg: item.pg } } as PageElement];
    const tool = toolOfKind(item.kind);
    if (!tool) return [];
    const field = REGISTRY[tool].field;
    return [{
      id: uuid(), type: 'widget', widgetKind: 'werkzeug',
      x: mm(item.x), y: mm(item.y), width: mm(item.w), height: mm(item.h), rotation: 0, locked: false, color: '#253c42',
      settings: toolSettings(tool, item[field], TOOL_TITLES[tool]),
    } as PageElement];
  });
}

// ── Glücksrad und Würfel with “Strichliste daneben” (Lernsachen-Heft 1.49.0) ──

type Spin = { mode?: string; dice?: number; count?: boolean; fields?: { label: string; color: string }[] };
type Cat = { label: string; color: string };
/** The fields a tally needs for a wheel (its fields) or dice (1–6, sums 2–12). */
export function spinCats(spin: Spin): Cat[] {
  if (spin.mode === 'wheel') return (spin.fields ?? []).map((f) => ({ label: f.label, color: f.color }));
  const first = spin.dice === 2 ? 2 : 1, n = spin.dice === 2 ? 11 : 6, colors = SPIN_COLORS as unknown as string[];
  return Array.from({ length: n }, (_, i) => ({ label: String(first + i), color: colors[i % colors.length] }));
}
/** A tally for the wheel or the dice, with the reference's question. */
export function spinTally(spin: Spin) {
  const cats = spinCats(spin);
  return { title: spin.mode === 'wheel' ? 'Was kommt am häufigsten?' : spin.dice === 2 ? 'Welche Summe kommt am häufigsten?' : 'Welche Zahl kommt am häufigsten?', cats, counts: cats.map(() => 0), view: 'both' };
}
const isTally = (el: PageElement) => el.type === 'widget' && el.widgetKind === 'werkzeug' && el.settings?.tool === 'tally';
const isSpin = (el: PageElement) => el.type === 'widget' && el.widgetKind === 'werkzeug' && el.settings?.tool === 'spin';

/**
 * After the wheel or dice was set with “Strichliste daneben”: a tally on the
 * page gets the new fields (strokes of the same fields stay); without one, a
 * tally comes next to it – as the reference does.
 */
export function syncSpinTally(elements: PageElement[], spinId: string, before: unknown, page: { width: number; height: number }): PageElement[] {
  const spinEl = elements.find((e) => e.id === spinId);
  if (!spinEl || !isSpin(spinEl)) return elements;
  const spin = toolConfig('spin', spinEl.settings?.werkzeug) as Spin;
  if (!spin.count) return elements;
  const old = spinCats(toolConfig('spin', before ?? spinEl.settings?.werkzeug) as Spin).map((c) => c.label.toLowerCase());
  const tallies = elements.filter(isTally);
  const target = tallies.find((t) => ((toolConfig('tally', t.settings?.werkzeug).cats as Cat[]) ?? []).every((c) => old.includes(c.label.toLowerCase()))) ?? (tallies.length === 1 ? tallies[0] : undefined);
  const fresh = spinTally(spin);
  if (target) {
    const now = toolCurrent('tally', target.settings, target.response) as { cats: Cat[]; counts: number[] };
    const kept = new Map(now.cats.map((c, i) => [c.label.toLowerCase(), now.counts[i] ?? 0]));
    const config = { ...toolConfig('tally', target.settings?.werkzeug), cats: fresh.cats, counts: fresh.cats.map((c) => kept.get(c.label.toLowerCase()) ?? 0) };
    return elements.map((e) => {
      if (e.id !== target.id) return e;
      const next = { ...e, settings: { ...e.settings, werkzeug: toolConfig('tally', config) as unknown as JsonValue } };
      delete next.response;
      return next;
    });
  }
  // Next to the wheel if there is room (reference: 40 apart, at least 480 wide), else at the right edge.
  const gap = mm(40), wide = mm(680), x = spinEl.x + spinEl.width + gap;
  const box = page.width - x - mm(30) >= mm(480)
    ? { x, y: spinEl.y, width: Math.min(wide, page.width - x - mm(30)), height: spinEl.height }
    : { x: Math.max(0, page.width - wide - mm(30)), y: Math.max(0, Math.min(spinEl.y, page.height - mm(760))), width: wide, height: Math.min(mm(760), page.height) };
  return [...elements, { id: uuid(), type: 'widget', widgetKind: 'werkzeug', ...box, rotation: 0, locked: false, color: '#253c42', settings: toolSettings('tally', fresh, TOOL_TITLES.tally) } as PageElement];
}
/** A new wheel with “Strichliste daneben” goes to the left, its tally to the right (reference layout). */
export const SPIN_WITH_TALLY = { x: mm(40), y: mm(110), width: mm(600), height: mm(760) };
