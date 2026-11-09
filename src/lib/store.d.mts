export const SCHEMA_VERSION: number;
export function dataDir(): string;
export function dataPath(...segments: string[]): string;
export function readJson<T = unknown>(file: string, fallback?: T): Promise<T>;
export function writeJson(file: string, value: unknown): Promise<void>;
export function withLock<T>(name: string, fn: () => Promise<T>): Promise<T>;
export function schemaVersion(): Promise<number | null>;
