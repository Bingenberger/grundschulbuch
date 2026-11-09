import type { LearningSettings, LearningResponse } from './catalog';
export const WIDGET_KINDS: string[];
export const ACTIVITY_KINDS: string[];
export const SHAPES: string[];
export const PAGE_FRAMES: string[];
export function boundedJson(value: unknown): unknown;
export function learningSettings(value: unknown): LearningSettings;
export function learningResponse(value: unknown): LearningResponse;
export function mediaReferences(value: unknown): string[];
export function safeWebUrl(value: unknown): string;
export function lockedDesign<T>(element: T): T;

export function widgetSettings(value: unknown): LearningSettings;
