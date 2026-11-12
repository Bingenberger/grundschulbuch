import type {
  Notebook,
  BookData,
  BookSummary,
  Page,
  Template,
  PageElement,
} from './notebook-model';
export class BookError extends Error {
  status: number;
  constructor(message: string, status?: number);
}
export function id(value: unknown): string;
export function validatePage(value: unknown): Page;
export function remapPageLinks(pages: Page[], ids: Map<string, string>): Page[];
export function getBook(owner: string, bookId: string): Promise<BookData>;
export function listBooks(owner: string): Promise<BookSummary[]>;
export function createBook(
  owner: string,
  role: string,
  input: { title: string; color?: string; pages?: Page[]; sourceId?: string; orientation?: 'portrait' | 'landscape' },
): Promise<BookData>;
export function updateBook(
  owner: string,
  bookId: string,
  input: {
    revision: number;
    title?: string;
    color?: string;
    pageIds?: string[];
    folderId?: string | null;
  },
): Promise<Notebook>;
export function addPage(
  owner: string,
  bookId: string,
  input: Page,
  afterId?: string,
): Promise<{ book: Notebook; page: Page }>;
export function savePage(
  owner: string,
  bookId: string,
  input: Page,
  childMode?: boolean | { features?: readonly string[] },
  actor?: string,
): Promise<Page>;
export function deleteBook(owner: string, bookId: string): Promise<void>;
export function listTemplates(owner: string): Promise<Template[]>;
export function saveTemplate(
  owner: string,
  input: { title: string; page: Page },
): Promise<Template>;
export function removeTemplate(
  owner: string,
  templateId: string,
): Promise<void>;
export function checkMedia(
  owner: string,
  elements: PageElement[],
): Promise<void>;
export function storeImage(
  owner: string,
  buffer: Buffer,
): Promise<{ src: string }>;
export function readImage(owner: string, name: string): Promise<Buffer>;

export function trashBook(
  owner: string,
  bookId: string,
  trashed?: boolean,
): Promise<Notebook>;
export function accessibleOwner(
  teacher: string,
  bookId: string,
): Promise<string>;

export function storeAudio(
  owner: string,
  buffer: Buffer,
): Promise<{ src: string }>;
export function listAssets(owner: string): Promise<Template[]>;
export function saveAsset(
  owner: string,
  input: { title: string; page: Page },
): Promise<Template>;
export function removeAsset(owner: string, assetId: string): Promise<void>;
export function shareBook(
  owner: string,
  bookId: string,
  recipientId: string,
): Promise<BookData>;
export function shareTemplate(
  owner: string,
  templateId: string,
  recipientId: string,
): Promise<Template>;
export type Folder = { id: string; title: string; color: string };
export function listFolders(owner: string): Promise<Folder[]>;
export function saveFolder(
  owner: string,
  input: { folderId?: string; title?: string; color?: string },
): Promise<Folder>;
export function removeFolder(owner: string, folderId: string): Promise<void>;
export function preferences(
  owner: string,
  input?: Record<string, unknown>,
): Promise<Record<string, unknown>>;

export function storeWebApp(
  owner: string,
  buffer: Buffer,
): Promise<{ src: string }>;
export function editImage(
  owner: string,
  src: string,
  input: unknown,
): Promise<{ src: string; width: number; height: number }>;
