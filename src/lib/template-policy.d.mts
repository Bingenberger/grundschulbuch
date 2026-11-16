import type { Page } from './notebook-model';
export type InsertionMode = 'template' | 'editable' | 'fixed';
export type TemplatePolicy = { enabled?: boolean; insertion?: InsertionMode };
export type TemplatePolicies = { global: Record<string, TemplatePolicy>; classes: Record<string, Record<string, TemplatePolicy>> };
export function templatePolicy(policies: TemplatePolicies | undefined, hidden: string[], key: string, classId?: string | null): Required<TemplatePolicy>;
export function applyInsertionMode(page: Page, insertion: InsertionMode): Page;
