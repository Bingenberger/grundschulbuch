// Teacher accounts: name + six-digit PIN. New accounts and lost PINs are handled
// with a one-time code that only scripts/bootstrap.mjs issues on the server
// console; no HTTP request creates accounts.
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { dataPath, readJson, writeJson, withLock } from './store.mjs';
import { endUserSessions, keyedHash } from './sessions.mjs';

const BCRYPT_ROUNDS = 11;
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const CODE_MINUTES = 15;
export const MAX_FAILURES = 5;
export const LOCK_MINUTES = 15;
// Compared against when the name is unknown, so timing does not reveal accounts.
const DUMMY_HASH = bcrypt.hashSync('000000', BCRYPT_ROUNDS);

/**
 * @typedef {'admin' | 'lehrkraft'} Role
 * @typedef {{ hash: string, expiresAt: string }} OneTimeCode
 * @typedef {{ id: string, name: string, role: Role, pinHash: string | null,
 *   einmalcode: OneTimeCode | null, createdAt: string, updatedAt: string }} Account
 * @typedef {{ id: string, name: string, role: Role }} PublicAccount
 * @typedef {{ ok: true, user: PublicAccount }
 *   | { ok: false, reason: 'falsch' | 'gesperrt', until?: string }} LoginResult
 */

const accountsFile = () => dataPath('lehrkraefte.json');
const attemptsFile = () => dataPath('anmeldeversuche.json');

/** @returns {Promise<{ version: 1, users: Account[] }>} */
export async function readAccounts() {
  const data = await readJson(accountsFile());
  if (data?.version !== 1 || !Array.isArray(data.users)) throw new Error('lehrkraefte.json ist ungültig.');
  return data;
}

/** @param {Account} account @returns {PublicAccount} */
const toPublic = account => ({ id: account.id, name: account.name, role: account.role });

/** Trims and unifies a name; returns null if it is not acceptable. @param {unknown} value */
export function normalizeName(value) {
  if (typeof value !== 'string') return null;
  const name = value.normalize('NFC').trim().replace(/\s+/g, ' ');
  return /^[\p{L}\p{N}][\p{L}\p{N} .'-]{0,39}$/u.test(name) ? name : null;
}

/** @param {string} name */
const nameKey = name => name.toLocaleLowerCase('de');

/**
 * Returns an error message for an unsuitable PIN, null if it is fine.
 * @param {unknown} pin
 */
export function pinProblem(pin) {
  if (typeof pin !== 'string' || !/^\d{6}$/.test(pin)) return 'Die PIN muss aus genau sechs Ziffern bestehen.';
  if (/^(\d)\1{5}$/.test(pin) || '0123456789'.includes(pin) || '9876543210'.includes(pin)) {
    return 'Diese PIN ist zu leicht zu erraten.';
  }
  return null;
}

/** @param {string} code */
const codeHash = code => keyedHash('einmalcode', code.toUpperCase().replace(/[^A-Z0-9]/g, ''));

function newCode() {
  const chars = Array.from({ length: 12 }, () => CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)]);
  return [chars.slice(0, 4), chars.slice(4, 8), chars.slice(8)].map(group => group.join('')).join('-');
}

/**
 * Creates an account or, for an existing one, a new one-time code (lost PIN).
 * An existing account is never replaced. The first account becomes admin.
 * @param {string} rawName
 * @param {{ admin?: boolean }} [options]
 */
export async function issueOneTimeCode(rawName, options = {}) {
  const name = normalizeName(rawName);
  if (!name) throw new Error('Ungültiger Name: 1–40 Zeichen, Buchstaben, Ziffern, Leerzeichen, . \' -');
  const code = newCode();
  const expiresAt = new Date(Date.now() + CODE_MINUTES * 60_000).toISOString();
  return withLock('lehrkraefte', async () => {
    const data = await readAccounts();
    const now = new Date().toISOString();
    let account = data.users.find(user => nameKey(user.name) === nameKey(name));
    const created = !account;
    if (!account) {
      account = {
        id: crypto.randomUUID(), name,
        role: options.admin || !data.users.some(user => user.role === 'admin') ? 'admin' : 'lehrkraft',
        pinHash: null, einmalcode: null, createdAt: now, updatedAt: now,
      };
      data.users.push(account);
    } else if (options.admin && account.role !== 'admin') {
      account.role = 'admin';
    }
    account.einmalcode = { hash: codeHash(code), expiresAt };
    account.updatedAt = now;
    await writeJson(accountsFile(), data);
    return { user: toPublic(account), code, expiresAt, created };
  });
}

/** @param {string} key @returns {Promise<string | null>} lock end if the name is locked */
async function lockedUntil(key) {
  const attempts = await readJson(attemptsFile(), {});
  const until = attempts[key]?.lockedUntil;
  return until && Date.parse(until) > Date.now() ? until : null;
}

/** @param {string} key @param {boolean} success */
async function recordAttempt(key, success) {
  await withLock('anmeldeversuche', async () => {
    /** @type {Record<string, { failures: number, lockedUntil?: string }>} */
    const attempts = await readJson(attemptsFile(), {});
    if (success) {
      delete attempts[key];
    } else {
      const entry = attempts[key] && !(attempts[key].lockedUntil && Date.parse(attempts[key].lockedUntil) <= Date.now())
        ? attempts[key] : { failures: 0 };
      entry.failures += 1;
      if (entry.failures >= MAX_FAILURES) entry.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString();
      attempts[key] = entry;
    }
    await writeJson(attemptsFile(), attempts);
  });
}

/**
 * Checks name and PIN. Five failures lock the name for 15 minutes; unknown
 * names share one entry, so guessing names cannot fill the file.
 * @param {unknown} rawName
 * @param {unknown} pin
 * @returns {Promise<LoginResult>}
 */
export async function login(rawName, pin) {
  const name = normalizeName(rawName);
  const account = name ? (await readAccounts()).users.find(user => nameKey(user.name) === nameKey(name)) : undefined;
  const key = account ? `konto:${account.id}` : 'unbekannt';
  const until = await lockedUntil(key);
  if (until) return { ok: false, reason: 'gesperrt', until };
  const valid = await bcrypt.compare(typeof pin === 'string' ? pin : '', account?.pinHash ?? DUMMY_HASH);
  const success = Boolean(account?.pinHash) && !account?.blocked && valid;
  await recordAttempt(key, success);
  return success && account ? { ok: true, user: toPublic(account) } : { ok: false, reason: 'falsch' };
}

/**
 * First access or lost PIN: the one-time code sets a new PIN. All existing
 * sessions of the account end.
 * @param {unknown} rawName
 * @param {unknown} code
 * @param {string} pin already checked with pinProblem()
 * @returns {Promise<LoginResult>}
 */
export async function redeemOneTimeCode(rawName, code, pin) {
  const name = normalizeName(rawName);
  if (!name || typeof code !== 'string') return { ok: false, reason: 'falsch' };
  const pinHash = await bcrypt.hash(pin, BCRYPT_ROUNDS);
  const result = await withLock('lehrkraefte', async () => {
    const data = await readAccounts();
    const account = data.users.find(user => nameKey(user.name) === nameKey(name));
    const key = account ? `konto:${account.id}` : 'unbekannt';
    const until = await lockedUntil(key);
    if (until) return /** @type {LoginResult} */ ({ ok: false, reason: 'gesperrt', until });
    const stored = account?.einmalcode;
    const matches = !account?.blocked && Boolean(stored) && Date.parse(stored.expiresAt) > Date.now()
      && crypto.timingSafeEqual(Buffer.from(stored.hash, 'hex'), Buffer.from(codeHash(code), 'hex'));
    await recordAttempt(key, matches);
    if (!matches || !account) return /** @type {LoginResult} */ ({ ok: false, reason: 'falsch' });
    account.pinHash = pinHash;
    account.einmalcode = null;
    account.updatedAt = new Date().toISOString();
    await writeJson(accountsFile(), data);
    return /** @type {LoginResult} */ ({ ok: true, user: toPublic(account) });
  });
  if (result.ok) await endUserSessions(result.user.id);
  return result;
}

/** @param {string} id @returns {Promise<PublicAccount | null>} */
export async function findAccount(id) {
  const account = (await readAccounts()).users.find(user => user.id === id);
  return account && !account.blocked ? toPublic(account) : null;
}

/** Public colleague directory, without PIN hashes or bootstrap codes. */
export async function listPublicAccounts() { return (await readAccounts()).users.filter(user => !user.blocked).map(toPublic); }
/** Console administration only; disabling an account immediately ends its sessions. */
export async function setAccountBlocked(name, blocked) {
  return withLock('lehrkraefte', async () => {
    const accounts = await readAccounts(); const user = accounts.users.find(u => nameKey(u.name) === nameKey(name));
    if (!user) throw new Error('Konto nicht gefunden.');
    const otherAdmins = accounts.users.filter(u => u.id !== user.id && u.role === 'admin' && !u.blocked);
    if (blocked && user.role === 'admin' && !otherAdmins.length) throw new Error('Das letzte aktive Admin-Konto kann nicht gesperrt werden.');
    user.blocked = !!blocked; user.updatedAt = new Date().toISOString(); await writeJson(accountsFile(), accounts); await endUserSessions(user.id); return toPublic(user);
  });
}
