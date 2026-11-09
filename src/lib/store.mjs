// File-based storage: JSON files below one data directory, replaced atomically,
// with simple cross-process locks. Shared by the app and the scripts in scripts/,
// therefore plain JavaScript with JSDoc types.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export const SCHEMA_VERSION = 1;

const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const LOCK_TIMEOUT_MS = 10_000;
const LOCK_STALE_MS = 60_000;

/** Absolute path of the data directory. */
export function dataDir() {
  return path.resolve(process.env.GRUNDSCHULBUCH_DATA_DIR || path.join(process.cwd(), 'data'));
}

/**
 * Path below the data directory. Every segment is checked, so user input can
 * never leave the directory.
 * @param {...string} segments
 */
export function dataPath(...segments) {
  for (const segment of segments) {
    if (!SEGMENT.test(segment) || segment.includes('..')) throw new Error(`Ungültiger Pfadteil: ${segment}`);
  }
  return path.join(dataDir(), ...segments);
}

/**
 * Reads a JSON file. A missing file returns the fallback; without a fallback it throws.
 * @template T
 * @param {string} file
 * @param {T} [fallback]
 * @returns {Promise<T>}
 */
export async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === 'ENOENT' && fallback !== undefined) return fallback;
    throw error;
  }
}

/**
 * Writes JSON atomically: temporary file, fsync, rename. Readers see either the
 * old or the new content, never half a file.
 * @param {string} file
 * @param {unknown} value
 */
export async function writeJson(file, value) {
  const directory = path.dirname(file);
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  const temporary = `${file}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  const handle = await fs.open(temporary, 'wx', 0o600);
  try {
    await handle.writeFile(`${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await handle.sync();
  } finally {
    await handle.close();
  }
  try {
    await fs.rename(temporary, file);
  } catch (error) {
    await fs.rm(temporary, { force: true });
    throw error;
  }
  const dir = await fs.open(directory, 'r').catch(() => null);
  if (dir) await dir.sync().catch(() => {}).finally(() => dir.close());
}

/** @param {number} pid */
function processAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return /** @type {NodeJS.ErrnoException} */ (error).code === 'EPERM';
  }
}

/**
 * Removes a lock left behind by a process that no longer runs.
 * @param {string} lock
 */
async function clearStaleLock(lock) {
  const owner = await fs.readFile(path.join(lock, 'owner'), 'utf8').catch(() => null);
  if (owner !== null) {
    const pid = Number.parseInt(owner, 10);
    if (Number.isInteger(pid) && pid > 0 && !processAlive(pid)) await fs.rm(lock, { recursive: true, force: true });
    return;
  }
  // Lock directory without owner file: the owner died between mkdir and writing it.
  const stat = await fs.stat(lock).catch(() => null);
  if (stat && Date.now() - stat.mtimeMs > LOCK_STALE_MS) await fs.rm(lock, { recursive: true, force: true });
}

/**
 * Runs fn while holding a named lock that also excludes other processes
 * (e.g. scripts/bootstrap.mjs next to the running server).
 * @template T
 * @param {string} name
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withLock(name, fn) {
  const lock = dataPath('sperren', `${name}.lock`);
  await fs.mkdir(path.dirname(lock), { recursive: true, mode: 0o700 });
  const deadline = Date.now() + LOCK_TIMEOUT_MS;
  for (;;) {
    try {
      await fs.mkdir(lock, { mode: 0o700 });
      break;
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code !== 'EEXIST') throw error;
      await clearStaleLock(lock);
      if (Date.now() > deadline) throw new Error(`Sperre ${name} ist belegt.`);
      await new Promise(resolve => setTimeout(resolve, 25 + Math.random() * 50));
    }
  }
  try {
    await fs.writeFile(path.join(lock, 'owner'), String(process.pid), { mode: 0o600 });
    return await fn();
  } finally {
    await fs.rm(lock, { recursive: true, force: true });
  }
}

/** @returns {Promise<number | null>} schema version of the data directory, null if not migrated */
export async function schemaVersion() {
  const schema = await readJson(dataPath('schema.json'), null);
  return schema && typeof schema.version === 'number' ? schema.version : null;
}
