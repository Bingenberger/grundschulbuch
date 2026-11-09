// Server-side sessions. The browser only holds a random token in an HttpOnly
// cookie; the server stores the record under an HMAC of that token, so the data
// directory alone does not reveal usable tokens. Deleting the record ends the
// session immediately (logout, PIN change, account removal).
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { dataPath, readJson, writeJson, withLock } from './store.mjs';

export const SESSION_HOURS = 8;
export const MAX_SESSIONS_PER_USER = 10;

/** @type {string | undefined} */
let cachedSecret;

/** The private key of the installation (scripts/prepare-secret.mjs). */
export function sessionSecret() {
  if (cachedSecret) return cachedSecret;
  let secret = process.env.SESSION_SECRET;
  if (!secret && process.env.SESSION_SECRET_FILE) secret = fs.readFileSync(process.env.SESSION_SECRET_FILE, 'utf8').trim();
  if (!secret || secret.length < 32) throw new Error('Privater Sitzungsschlüssel fehlt (SESSION_SECRET_FILE).');
  cachedSecret = secret;
  return secret;
}

/**
 * Keyed hash for tokens and, later, the children's QR codes.
 * @param {string} purpose
 * @param {string} value
 */
export function keyedHash(purpose, value) {
  return crypto.createHmac('sha256', sessionSecret()).update(`${purpose}:${value}`).digest('hex');
}

/** @param {string} token */
function recordFile(token) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  return dataPath('sitzungen', `${keyedHash('sitzung', token)}.json`);
}

/**
 * @typedef {{ userId: string, createdAt: string, expiresAt: string }} SessionRecord
 */

/** @returns {Promise<Array<{ file: string, record: SessionRecord }>>} */
async function allSessions() {
  const directory = dataPath('sitzungen');
  const names = await fsp.readdir(directory).catch(error => {
    if (error.code === 'ENOENT') return /** @type {string[]} */ ([]);
    throw error;
  });
  const sessions = [];
  for (const name of names.filter(item => item.endsWith('.json'))) {
    const file = path.join(directory, name);
    const record = await readJson(file, null).catch(() => null);
    if (record) sessions.push({ file, record });
  }
  return sessions;
}

/**
 * Starts a session and returns the token for the cookie. The oldest sessions
 * of the user are removed beyond MAX_SESSIONS_PER_USER.
 * @param {string} userId
 */
export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  /** @type {SessionRecord} */
  const record = {
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_HOURS * 3600_000).toISOString(),
  };
  await withLock('sitzungen', async () => {
    const own = (await allSessions())
      .filter(item => item.record.userId === userId)
      .sort((a, b) => a.record.createdAt.localeCompare(b.record.createdAt));
    for (const item of own.slice(0, Math.max(0, own.length - MAX_SESSIONS_PER_USER + 1))) await fsp.rm(item.file, { force: true });
    await writeJson(/** @type {string} */ (recordFile(token)), record);
  });
  return token;
}

/**
 * @param {string | undefined} token
 * @returns {Promise<SessionRecord | null>}
 */
export async function readSession(token) {
  const file = token ? recordFile(token) : null;
  if (!file) return null;
  /** @type {SessionRecord | null} */
  const record = await readJson(file, null).catch(() => null);
  if (!record) return null;
  if (Date.parse(record.expiresAt) <= Date.now()) {
    await fsp.rm(file, { force: true });
    return null;
  }
  return record;
}

/** @param {string | undefined} token */
export async function endSession(token) {
  const file = token ? recordFile(token) : null;
  if (file) await fsp.rm(file, { force: true });
}

/** Ends all sessions of a user, e.g. after a PIN change. @param {string} userId */
export async function endUserSessions(userId) {
  await withLock('sitzungen', async () => {
    for (const item of await allSessions()) {
      if (item.record.userId === userId) await fsp.rm(item.file, { force: true });
    }
  });
}
