// Isolated fixture server: no real school records and no persistent browser data.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
const directory = await fs.mkdtemp(
  path.join(os.tmpdir(), 'grundschulbuch-acceptance-'),
);
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'acceptance-only-session-secret'.padEnd(48, 'x');
process.env.BASE_URL = 'http://localhost:3100';
process.env.SCHOOL_END_HOUR = '24';
execFileSync(process.execPath, ['scripts/migrate.mjs'], {
  env: process.env,
  stdio: 'pipe',
});
const { issueOneTimeCode, redeemOneTimeCode } =
  await import('../src/lib/accounts.mjs');
for (const name of ['Frau Beispiel', 'Herr Muster']) {
  const { code } = await issueOneTimeCode(name);
  await redeemOneTimeCode(name, code, '483920');
}
await fs.cp('public', '.next/standalone/public', { recursive: true });
await fs.cp('.next/static', '.next/standalone/.next/static', {
  recursive: true,
});
const server = spawn(process.execPath, ['.next/standalone/server.js'], {
  env: { ...process.env, PORT: '3100', HOSTNAME: '127.0.0.1' },
  stdio: 'inherit',
});
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  server.kill('SIGTERM');
  await fs.rm(directory, { recursive: true, force: true });
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
server.on('exit', async (code) => {
  await stop();
  process.exitCode = code || 0;
});
