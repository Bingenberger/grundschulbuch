import type { Notebook } from './notebook-model';
import type { ChildFeature } from './child-features.mjs';
export type Child = {
  id: string;
  name: string;
  hasCard: boolean;
  cardVersion: number;
  /** Own selection; null or missing means “like the class”. */
  features?: ChildFeature[] | null;
};
export type SchoolClass = {
  id: string;
  teacherId: string;
  title: string;
  archived: boolean;
  children: Child[];
  images: string[];
  createdAt: string;
  /** Class default for children; missing means CHILD_DEFAULTS. */
  childFeatures?: ChildFeature[];
};
export type ChildRecord = {
  id: string;
  name: string;
  cardVersion: number;
  classId: string;
  teacherId: string;
  images: string[];
  classTitle: string;
  /** Effective functions for this child (own, class or default). */
  features: ChildFeature[];
};
export function ownedClass(
  owner: string,
  classId: string,
): Promise<SchoolClass>;
export function listClasses(owner: string): Promise<SchoolClass[]>;
export function createClass(owner: string, title: string): Promise<SchoolClass>;
export function changeClass(
  owner: string,
  classId: string,
  input: Record<string, unknown>,
): Promise<SchoolClass>;
export function deleteClass(owner: string, classId: string): Promise<void>;
export function grantImages(owner: string, sources: string[]): Promise<void>;
export function distribute(
  owner: string,
  classId: string,
  bookId: string,
  childIds?: string[],
  allowChildPages?: boolean,
  allowChildAudio?: boolean,
): Promise<Notebook[]>;
export function childById(
  childId: string,
  includeArchived?: boolean,
): Promise<ChildRecord | null>;
export function loginChild(digest: string): Promise<ChildRecord>;
export function issueHelpCode(
  owner: string,
  classId: string,
  childId: string,
): Promise<{ code: string; expires: number }>;
export function redeemHelpCode(code: string): Promise<ChildRecord>;
