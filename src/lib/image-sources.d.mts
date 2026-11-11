export type ImageSource = 'arasaac' | 'wikimedia' | 'galerie';
export type ImageHit = {
  id: string;
  title: string;
  thumb: string;
  full: string;
  width?: number;
  height?: number;
  credit?: string;
  license?: string;
  pageUrl?: string;
};
export const SOURCES: readonly ImageSource[];
export class SourceError extends Error {
  status: number;
  constructor(message: string, status?: number);
}
export function galleryOrigin(): string;
export function fetchLimited(
  url: string,
  options?: { headers?: Record<string, string>; max?: number },
): Promise<{ buffer: Buffer; type: string }>;
export function searchImages(
  source: string,
  query: string,
  page?: number | string,
): Promise<{ items: ImageHit[]; page: number; more: boolean }>;
export function allowedImageUrl(source: string, url: string): boolean;
export function loadImage(source: string, url: string): Promise<{ buffer: Buffer; type: string }>;
