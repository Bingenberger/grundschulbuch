export const SESSION_HOURS: number;
export const MAX_SESSIONS_PER_USER: number;
export type SessionRecord = { userId: string; createdAt: string; expiresAt: string };
export function sessionSecret(): string;
export function keyedHash(purpose: string, value: string): string;
export function createSession(userId: string): Promise<string>;
export function readSession(token: string | undefined): Promise<SessionRecord | null>;
export function endSession(token: string | undefined): Promise<void>;
export function endUserSessions(userId: string): Promise<void>;
