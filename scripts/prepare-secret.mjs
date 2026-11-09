// Creates the private session key of this installation (.private/session-key).
// Never prints the key and never replaces an existing file.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('.private', 'session-key');
fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
try {
  fs.writeFileSync(file, `${crypto.randomBytes(48).toString('base64url')}\n`, { flag: 'wx', mode: 0o600 });
  console.log(`Schlüssel angelegt: ${file}`);
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log(`Schlüssel ist bereits vorhanden und bleibt unverändert: ${file}`);
}
