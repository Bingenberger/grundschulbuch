// Container entry point: reads the private key from SESSION_SECRET_FILE,
// checks BASE_URL and starts the Next.js standalone server.
import fs from 'node:fs';
import { spawn } from 'node:child_process';

if (process.env.SESSION_SECRET_FILE) {
  if (process.env.SESSION_SECRET) throw new Error('Nur eine Quelle für den Sitzungsschlüssel angeben.');
  process.env.SESSION_SECRET = fs.readFileSync(process.env.SESSION_SECRET_FILE, 'utf8').trim();
  delete process.env.SESSION_SECRET_FILE;
}
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) throw new Error('Privater Sitzungsschlüssel fehlt.');

const origin = new URL(process.env.BASE_URL || 'http://localhost:3000');
if (!['http:', 'https:'].includes(origin.protocol) || origin.username || origin.password
  || origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('BASE_URL muss eine reine Origin sein, z. B. https://buch.schule.de');
}

process.umask(0o077);
const server = spawn(process.execPath, ['server.js'], { stdio: 'inherit', env: { ...process.env, HOSTNAME: '0.0.0.0' } });
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.kill(signal));
server.on('exit', code => process.exit(code ?? 1));
