// Unterstützte Kommunikation of Lernsachen-Heft: Sprechtaste (picture and word,
// speaks when tapped, may lead to another board), Satzleiste (collects the
// tapped words), Zurück-Taste (back to the board one came from), the boards
// with 2 to 20 fields, the theme boards and the communication book. Boards are
// pages of single keys, laid out by the reference (reference/class-runtime.ts);
// the ARASAAC pictures of the boards ship with the app (/uk/<id>.webp).
import { newPage, uuid, type Page, type PageElement } from '../notebook-model';
import { bookCells, TALK_BOARDS, TALK_GRIDS, talkLayout, WORD_CLASSES } from '../reference/class-runtime';

export type TalkConfig = {
  label: string;
  /** What is said (else the word). */
  say?: string;
  color: string;
  /** Picture: media address. */
  img?: string;
  /** Own recording instead of the computer voice. */
  sound?: string;
  /** Zurück-Taste. */
  back?: boolean;
  /** Another page of the notebook (a board). */
  link?: string;
  noLabel?: boolean;
};
type Cell = [string, number, string, string?];
type Board = { id: string; label: string; short?: string; keywords?: string; cols: number; rows: number; strip?: boolean; cells: Cell[] };
type Grid = { id: string; label: string; cols: number; rows: number; strip?: boolean };
export const BOARDS = TALK_BOARDS as unknown as Board[];
export const GRIDS = TALK_GRIDS as unknown as Grid[];
export const WORD_COLORS = Object.values(WORD_CLASSES as Record<string, { label: string; color: string }>);

export const picto = (id: number) => `/uk/${id}.webp`;
const media = (v: unknown) => (typeof v === 'string' && /^(\/uk\/\d+\.webp|\/api\/medien\/[\w./-]+|\/(kasse|bilder|anlaut)\/[a-z0-9-]+\.webp|data:(image|audio)\/)/.test(v) ? v : undefined);

export function talkConfig(raw: unknown): TalkConfig {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<TalkConfig>;
  return {
    label: typeof v.label === 'string' ? v.label.slice(0, 60) : '',
    ...(typeof v.say === 'string' && v.say.trim() ? { say: v.say.slice(0, 200) } : {}),
    color: typeof v.color === 'string' && /^#[0-9a-f]{6}$/i.test(v.color) ? v.color : '#ffffff',
    ...(media(v.img) ? { img: media(v.img) } : {}),
    ...(media(v.sound) ? { sound: media(v.sound) } : {}),
    ...(v.back === true ? { back: true } : {}),
    ...(typeof v.link === 'string' && v.link ? { link: v.link.slice(0, 80) } : {}),
    ...(v.noLabel === true ? { noLabel: true } : {}),
  };
}

/** The key as the reference's item (field names of the reference). */
export function talkItem(c: TalkConfig, id: string, w: number, h: number) {
  return { id, type: 'talk', w, h, label: c.label, color: c.color, ...(c.say ? { say: c.say } : {}), ...(c.img ? { asset: c.img } : {}), ...(c.sound ? { sound: c.sound } : {}), ...(c.back ? { back: true } : {}), ...(c.link ? { link: { page: c.link } } : {}), ...(c.noLabel ? { noLabel: true } : {}) };
}
export function talkAssets(c: TalkConfig) {
  const assets: Record<string, { dataUrl: string; width?: number; height?: number }> = {};
  if (c.img) assets[c.img] = { dataUrl: c.img, ...(c.img.startsWith('/uk/') ? { width: 200, height: 200 } : {}) };
  if (c.sound) assets[c.sound] = { dataUrl: c.sound };
  return assets;
}

const MM = 297 / 1400;
type RefItem = { type: string; kind?: string; x: number; y: number; w: number; h: number; label?: string; say?: string; color?: string; asset?: string; back?: boolean; link?: { page: string } };
/** Elements of a board page from the reference's layout (px of 1400 × 990 → mm). */
function elements(items: RefItem[], title: string): PageElement[] {
  return items.map((it) => {
    const box = { id: uuid(), x: Math.round(it.x * MM * 10) / 10, y: Math.round(it.y * MM * 10) / 10, width: Math.round(it.w * MM * 10) / 10, height: Math.round(it.h * MM * 10) / 10, rotation: 0, locked: true, color: '#253c42' };
    if (it.type === 'widget') return { ...box, type: 'widget', widgetKind: 'satzleiste', settings: { title: 'Satzleiste' } } as PageElement;
    const asset = typeof it.asset === 'string' ? /^arasaac-(\d+)-t$/.exec(it.asset) : null;
    const talk: TalkConfig = talkConfig({ label: it.label, say: it.say, color: it.color, ...(asset ? { img: picto(Number(asset[1])) } : {}), back: it.back, link: it.link?.page });
    return { ...box, type: 'widget', widgetKind: 'sprechtaste', settings: { title: talk.label || title, talk: talk as never } } as PageElement;
  });
}

function boardPage(cols: number, rows: number, strip: boolean, cells: Cell[] | undefined, title: string, back = false): Page {
  const page = newPage('blanko', 'landscape');
  page.elements = elements(talkLayout(cols, rows, strip, cells, back ? { back: true } : {}) as RefItem[], title);
  return page;
}

/** A board: a theme board (talk-basis …) or empty fields (talk-grid-6 …). */
export function boardPages(id: string): Page[] {
  const board = BOARDS.find((b) => b.id === id);
  if (board) return [boardPage(board.cols, board.rows, true, board.cells, board.label)];
  const grid = GRIDS.find((g) => g.id === id) ?? GRIDS[2];
  return [boardPage(grid.cols, grid.rows, !!grid.strip, undefined, grid.label)];
}

/** Links between inserted pages from one page id to another (keys and link badges). */
export function relink(pages: Page[], from: string, to: string): Page[] {
  return pages.map((p) => ({
    ...p,
    elements: p.elements.map((e) => {
      const talk = e.settings?.talk as unknown as TalkConfig | undefined;
      const link = e.link?.kind === 'page' && e.link.pageId === from ? { link: { kind: 'page' as const, pageId: to } } : {};
      return talk?.link === from ? { ...e, ...link, settings: { ...e.settings, talk: { ...talk, link: to } as never } } : { ...e, ...link };
    }),
  }));
}

/** The communication book: a first page with a key per board, each board with a back key (cye of the reference). */
export function bookPages(): Page[] {
  const index = boardPage(5, 2, true, bookCells() as Cell[], 'Kommunikationsbuch');
  const boards = BOARDS.map((b) => boardPage(b.cols, b.rows, true, b.cells, b.label, true));
  const keys = index.elements.filter((e) => e.widgetKind === 'sprechtaste');
  keys.forEach((e, i) => { if (boards[i]) (e.settings!.talk as unknown as TalkConfig).link = boards[i].id; });
  for (const b of boards) for (const e of b.elements) { const t = e.settings?.talk as unknown as TalkConfig | undefined; if (t?.back) t.link = index.id; }
  return [index, ...boards];
}
