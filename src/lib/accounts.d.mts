export type Role = 'admin' | 'lehrkraft';
export type PublicAccount = { id: string; name: string; role: Role };
export type LoginResult = { ok: true; user: PublicAccount } | { ok: false; reason: 'falsch' | 'gesperrt'; until?: string };
export const CODE_MINUTES: number;
export const MAX_FAILURES: number;
export const LOCK_MINUTES: number;
export function normalizeName(value: unknown): string | null;
export function pinProblem(pin: unknown): string | null;
export function issueOneTimeCode(name: string, options?: { admin?: boolean }): Promise<{ user: PublicAccount; code: string; expiresAt: string; created: boolean }>;
export function login(name: unknown, pin: unknown): Promise<LoginResult>;
export function redeemOneTimeCode(name: unknown, code: unknown, pin: string): Promise<LoginResult>;
export function findAccount(id: string): Promise<PublicAccount | null>;
export function readAccounts(): Promise<{ version: 1; users: unknown[] }>;

export function listPublicAccounts(): Promise<PublicAccount[]>;
export function setAccountBlocked(name: string, blocked: boolean): Promise<PublicAccount>;

export type AdminAccount = PublicAccount & { blocked: boolean; hasPin: boolean; codeUntil: string | null; createdAt: string };
export const ADMIN_CODE_DAYS: number;
export class AccountError extends Error { status: number; constructor(message: string, status?: number); }
export function listAdminAccounts(): Promise<AdminAccount[]>;
export function createAccount(name: unknown, role: unknown): Promise<{ account: AdminAccount; code: string; expiresAt: string }>;
export function resetAccountCode(id: string): Promise<{ account: AdminAccount; code: string; expiresAt: string }>;
export function renameAccount(id: string, name: unknown): Promise<AdminAccount>;
export function setAccountRole(id: string, role: unknown): Promise<AdminAccount>;
export function setAccountBlockedById(id: string, blocked: boolean): Promise<AdminAccount>;
export function deleteUnusedAccount(id: string): Promise<void>;
