// Issues a one-time code for a teacher account: creates the account if needed,
// otherwise only replaces a pending code (lost PIN). The code appears only on
// the controlling terminal, never in logs.
//   node scripts/bootstrap.mjs NAME [--admin]
import { CODE_MINUTES, issueOneTimeCode } from '../src/lib/accounts.mjs';
import { SCHEMA_VERSION, schemaVersion } from '../src/lib/store.mjs';

const args = process.argv.slice(2);
const admin = args.includes('--admin');
const name = args.filter(arg => arg !== '--admin').join(' ');

if (!name) {
  console.error('Aufruf: node scripts/bootstrap.mjs NAME [--admin]');
  process.exit(2);
}
if (!process.stdout.isTTY) {
  console.error('Der Einmalcode wird nur an einem Terminal angezeigt (z. B. docker compose exec, nicht in Logs).');
  process.exit(2);
}
if ((await schemaVersion()) !== SCHEMA_VERSION) {
  console.error('Das Datenverzeichnis ist nicht migriert. Zuerst scripts/migrate.mjs ausführen.');
  process.exit(1);
}

try {
  const { user, code, created } = await issueOneTimeCode(name, { admin });
  console.log(created ? `Konto „${user.name}“ angelegt (${user.role}).` : `Neuer Einmalcode für das vorhandene Konto „${user.name}“.`);
  console.log(`\n  Einmalcode: ${code}\n`);
  console.log(`Gültig ${CODE_MINUTES} Minuten für eine Anmeldung unter „Mit Einmalcode“. Dabei wird eine persönliche PIN festgelegt.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
