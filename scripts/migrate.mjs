// Prepares or upgrades the data directory. Runs as an explicit, exclusive job
// before the server starts; the server itself never migrates.
import fs from 'node:fs/promises';
import { SCHEMA_VERSION, dataDir, dataPath, readJson, schemaVersion, withLock, writeJson } from '../src/lib/store.mjs';

await fs.mkdir(dataDir(), { recursive: true, mode: 0o700 });
await withLock('migration', async () => {
  const version = await schemaVersion();
  if (version === SCHEMA_VERSION) {
    console.log(`Daten sind aktuell (Schema ${version}).`);
    return;
  }
  if (version !== null) {
    throw new Error(`Unbekannte Schema-Version ${version}. Diese Version des Grundschulbuchs kennt nur ${SCHEMA_VERSION}.`);
  }
  const entries = (await fs.readdir(dataDir())).filter(name => !['sperren', 'lost+found'].includes(name));
  if (entries.length > 0) {
    throw new Error(`Das Datenverzeichnis enthält Dateien, aber keine schema.json: ${entries.join(', ')}`);
  }
  await fs.mkdir(dataPath('sitzungen'), { recursive: true, mode: 0o700 });
  await writeJson(dataPath('lehrkraefte.json'), await readJson(dataPath('lehrkraefte.json'), { version: 1, users: [] }));
  await writeJson(dataPath('schema.json'), { version: SCHEMA_VERSION });
  console.log(`Datenverzeichnis angelegt (Schema ${SCHEMA_VERSION}).`);
}).catch(error => {
  console.error(`Migration abgebrochen: ${error.message}`);
  process.exit(1);
});
