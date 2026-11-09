import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-test-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = dir;
process.env.SESSION_SECRET = 'test-schluessel-'.padEnd(48, 'x');

const store = await import('../src/lib/store.mjs');
const accounts = await import('../src/lib/accounts.mjs');
const sessions = await import('../src/lib/sessions.mjs');

before(() => {
  execFileSync(process.execPath, ['scripts/migrate.mjs'], { env: process.env, stdio: 'pipe' });
});
after(() => fs.rm(dir, { recursive: true, force: true }));

test('Migration legt Schema und leere Kontenliste an und ist wiederholbar', async () => {
  assert.equal(await store.schemaVersion(), 1);
  assert.deepEqual((await accounts.readAccounts()).users, []);
  execFileSync(process.execPath, ['scripts/migrate.mjs'], { env: process.env, stdio: 'pipe' });
});

test('Pfade verlassen das Datenverzeichnis nicht', () => {
  assert.throws(() => store.dataPath('..', 'etc'));
  assert.throws(() => store.dataPath('a/b'));
  assert.throws(() => store.dataPath('.versteckt'));
});

test('PIN-Regeln', () => {
  assert.equal(accounts.pinProblem('483920'), null);
  assert.ok(accounts.pinProblem('12345'));
  assert.ok(accounts.pinProblem('111111'));
  assert.ok(accounts.pinProblem('234567'));
  assert.ok(accounts.pinProblem('987654'));
  assert.ok(accounts.pinProblem(483920));
});

test('Erstzugang: erstes Konto wird Admin, Einmalcode setzt PIN und gilt nur einmal', async () => {
  const issued = await accounts.issueOneTimeCode('Frau Beispiel');
  assert.equal(issued.created, true);
  assert.equal(issued.user.role, 'admin');
  assert.match(issued.code, /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/);

  assert.equal((await accounts.login('Frau Beispiel', '483920')).ok, false, 'ohne PIN keine Anmeldung');
  const redeemed = await accounts.redeemOneTimeCode('frau  beispiel', issued.code.toLowerCase(), '483920');
  assert.equal(redeemed.ok, true);
  assert.equal((await accounts.redeemOneTimeCode('Frau Beispiel', issued.code, '502913')).ok, false, 'Code verbraucht');
  assert.equal((await accounts.login('Frau Beispiel', '483920')).ok, true);

  const second = await accounts.issueOneTimeCode('Herr Muster');
  assert.equal(second.user.role, 'lehrkraft');
  const again = await accounts.issueOneTimeCode('Frau Beispiel');
  assert.equal(again.created, false, 'vorhandenes Konto wird nicht ersetzt');
  assert.equal((await accounts.readAccounts()).users.length, 2);
});

test('Fünf Fehlversuche sperren den Namen', async () => {
  const { code } = await accounts.issueOneTimeCode('Frau Sperre');
  await accounts.redeemOneTimeCode('Frau Sperre', code, '561203');
  for (let i = 0; i < accounts.MAX_FAILURES; i++) {
    assert.equal((await accounts.login('Frau Sperre', '000001')).ok, false);
  }
  const locked = await accounts.login('Frau Sperre', '561203');
  assert.deepEqual([locked.ok, locked.ok ? null : locked.reason], [false, 'gesperrt']);
});

test('Sitzungen: anlegen, lesen, beenden; neue PIN beendet alle', async () => {
  const { user, code } = await accounts.issueOneTimeCode('Herr Sitzung');
  await accounts.redeemOneTimeCode('Herr Sitzung', code, '740215');
  const token = await sessions.createSession(user.id);
  assert.equal((await sessions.readSession(token))?.userId, user.id);
  assert.equal(await sessions.readSession('x'.repeat(43)), null);
  assert.equal(await sessions.readSession('../../etc/passwd'), null);

  const other = await sessions.createSession(user.id);
  await sessions.endSession(token);
  assert.equal(await sessions.readSession(token), null);
  assert.ok(await sessions.readSession(other));

  const reset = await accounts.issueOneTimeCode('Herr Sitzung');
  await accounts.redeemOneTimeCode('Herr Sitzung', reset.code, '806342');
  assert.equal(await sessions.readSession(other), null);
});

test('Höchstens zehn Sitzungen pro Konto', async () => {
  const { user } = await accounts.issueOneTimeCode('Frau Viele');
  const tokens = [];
  for (let i = 0; i < sessions.MAX_SESSIONS_PER_USER + 2; i++) tokens.push(await sessions.createSession(user.id));
  const alive = (await Promise.all(tokens.map(token => sessions.readSession(token)))).filter(Boolean);
  assert.equal(alive.length, sessions.MAX_SESSIONS_PER_USER);
  assert.equal(await sessions.readSession(tokens[0]), null);
});

test('Gleichzeitige Schreiber verlieren unter der Sperre keine Einträge', async () => {
  const file = store.dataPath('zaehler.json');
  await store.writeJson(file, { n: 0 });
  await Promise.all(Array.from({ length: 20 }, () => store.withLock('zaehler', async () => {
    const { n } = await store.readJson(file);
    await store.writeJson(file, { n: n + 1 });
  })));
  assert.equal((await store.readJson(file)).n, 20);
});
