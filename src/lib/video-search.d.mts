export type VideoHit = {
  id: string;
  url: string;
  title: string;
  channel: string;
  description: string;
  publishedAt: string | null;
  /** Length in seconds (0 if unknown). */
  seconds: number;
  views: number;
};
export type VideoSearchResult = { items: VideoHit[]; nextPageToken: string | null };
export type YoutubeSettings = {
  configured: boolean;
  source: 'verwaltung' | 'datei' | null;
  keyEnd: string;
  childSearch: boolean;
  updatedAt: string | null;
};
export const SEARCHES_PER_HOUR: number;
export const DURATIONS: readonly ['any', 'short', 'medium', 'long'];
export const ORDERS: readonly ['relevance', 'date', 'viewCount'];
export function youtubeSettings(): Promise<YoutubeSettings>;
export function setYoutubeSettings(input: { key?: string; childSearch?: boolean }): Promise<YoutubeSettings & { warning: string }>;
export function searchAvailable(role: string): Promise<boolean>;
export function plainText(value: unknown): string;
export function durationSeconds(value: string): number;
export function searchVideos(
  owner: string,
  role: string,
  input: { q?: unknown; duration?: unknown; order?: unknown; pageToken?: unknown },
): Promise<VideoSearchResult>;
export function youtubeId(address: string): string | null;
export function videoInfo(address: string): Promise<{
  kind: 'youtube' | 'vimeo' | 'ard' | 'zdf' | null;
  id?: string;
  title: string;
  thumb: string;
  /** Own player of the ARD/ZDF Mediathek, or '' if the video may not play inside a page. */
  player: string;
}>;
export function mediathekDetails(address: string): Promise<{ title: string; image: string; player: string }>;
export function mediathekThumbnail(address: string): Promise<{ buffer: Buffer; type: string }>;
export function storeMediathekPoster(owner: string, address: string): Promise<{ src: string }>;
export function youtubeThumbnail(videoId: string, size?: 'mq' | 'hq' | 'mqdefault'): Promise<{ buffer: Buffer; type: string }>;
export function storeYoutubePoster(owner: string, videoId: string): Promise<{ src: string }>;
