// Schulschluss für Kinder: bis zu welcher vollen Stunde (Europe/Berlin) sich Kinder
// anmelden können und ihre Sitzung läuft. Die Verwaltung stellt es ein; ohne
// Einstellung gilt SCHOOL_END_HOUR des Servers (Standard 16 Uhr).
import { BookError } from './notebooks.mjs';
import { dataPath, readJson, withLock, writeJson } from './store.mjs';

const FILE = () => dataPath('einstellungen', 'schulschluss.json');
const valid = (n) => Number.isInteger(n) && n >= 1 && n <= 24;

/** Default of the server (environment), 16 when not set or invalid. */
export function serverEndHour() {
  const n = Number(process.env.SCHOOL_END_HOUR || 16);
  return valid(n) ? n : 16;
}

/** What the admin area shows. */
export async function schoolHoursSettings() {
  const stored = await readJson(FILE(), {});
  const own = valid(stored.endHour) ? stored.endHour : null;
  return { endHour: own ?? serverEndHour(), own: own !== null, serverEndHour: serverEndHour(), updatedAt: stored.updatedAt || null };
}

/** The hour from which children can no longer sign in (24 = until midnight). */
export async function schoolEndHour() {
  return (await schoolHoursSettings()).endHour;
}

/** Admin: sets the hour, or null to go back to the server default. */
export async function setSchoolEndHour(endHour) {
  if (endHour !== null && !valid(endHour)) throw new BookError('Bitte eine volle Stunde zwischen 1 und 24 wählen.');
  return withLock('einstellungen-schulschluss', async () => {
    await writeJson(FILE(), endHour === null ? {} : { endHour, updatedAt: new Date().toISOString() });
    return schoolHoursSettings();
  });
}
