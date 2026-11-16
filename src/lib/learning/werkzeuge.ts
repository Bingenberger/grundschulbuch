// The tools of Lernsachen-Heft 1.47.3 that are drawn by the reference's tool
// host (reference/tools-runtime.ts): one widget kind “werkzeug” for all of
// them. The settings keep the tool and its configuration as the reference
// stores it (settings.werkzeug); what is tapped and kept (counts, ticks, …)
// goes into the response, tied to the configuration it belongs to.
import presetData from './werkzeug-presets.json';
import { TOOL_REGISTRY } from '../reference/tools-runtime';
import { uuid, type PageElement } from '../notebook-model';
import { referenceElement } from './page-designs';
import type { JsonValue, LearningSettings } from './catalog';

/** Tools available as “werkzeug” (Hör-Memory has its own kind “hoeren”). */
export const TOOL_IDS = ['tally', 'spin', 'seek', 'pattern', 'mood', 'vote', 'rating', 'check', 'stress', 'steps', 'traffic', 'pieces', 'body', 'timeline', 'phone', 'practice', 'circles', 'week'] as const;
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
export const toolSpec = (tool: ToolId) => REGISTRY[tool];
/** Names of the tools (catalogue labels of the reference). */
export const TOOL_TITLES: Record<ToolId, string> = {
  tally: 'Strichliste und Diagramm', spin: 'Glücksrad und Würfel', seek: 'Suchbild', pattern: 'Muster fortsetzen',
  mood: 'Wie geht es dir heute?', vote: 'Abstimmung und Wahl', rating: 'Selbst- und Fremdeinschätzung', check: 'Checkliste',
  stress: 'Stressbarometer', steps: 'Ablaufplan', traffic: 'Fußgängerampel', pieces: 'Stückzähler', body: 'Wo tut es weh?',
  timeline: 'Zeitleiste', phone: 'Telefonieren üben', practice: 'Gespräche üben',
  circles: 'Nähe und Distanz', week: 'Wochenplan',
};
export const isTool = (v: unknown): v is ToolId => typeof v === 'string' && (TOOL_IDS as readonly string[]).includes(v);

type PresetItem = Record<string, unknown> & { type: string; kind?: string; x: number; y: number; w: number; h: number };
export type ToolPreset = { id: string; title: string; group: string; items: PresetItem[] };
export const TOOL_PRESETS = presetData as unknown as ToolPreset[];

/** Own pictures and sounds are media addresses of the school server. */
const media = (v: unknown) => (typeof v === 'string' && /^\/api\/medien\/[\w./-]+$/.test(v) ? v : undefined);

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
export const presetTools = (preset: ToolPreset) => preset.items.filter((i) => i.type === 'widget').map((i) => toolOfKind(i.kind));
/** The elements of a preset page (the reference's items in mm; texts and read-aloud keys as in the page designs). */
export function presetElements(preset: ToolPreset): PageElement[] {
  return preset.items.flatMap((item) => {
    if (item.type !== 'widget') return [referenceElement(item, MM)];
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
