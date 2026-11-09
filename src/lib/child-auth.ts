import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { keyedHash } from './sessions.mjs';
import { dataPath, readJson, writeJson, withLock } from './store.mjs';
import { BookError } from './notebooks.mjs';
import { childById, type ChildRecord } from './classes.mjs';
const COOKIE = 'gsb_kind';
const fileFor = (token: string) =>
  dataPath('kinder-sitzungen', `${keyedHash('child-session', token)}.json`);
type Record = {
  childId: string;
  cardVersion: number;
  touched: number;
  schoolDay: string;
};
const schoolTime = () =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Berlin',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date());
export function schoolEndHour() {
  const n = Number(process.env.SCHOOL_END_HOUR || 16);
  return Number.isInteger(n) && n >= 1 && n <= 24 ? n : 16;
}
export async function currentChild(): Promise<ChildRecord | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  return withLock(`kind-${keyedHash('child-session', token)}`, async () => {
    const record = await readJson<Record | null>(fileFor(token), null);
    const now = schoolTime();
    if (
      !record ||
      Date.now() - record.touched > 600000 ||
      record.schoolDay !== now.slice(0, 10) ||
      Number(now.slice(11, 13)) >= schoolEndHour()
    )
      return null;
    const child = await childById(record.childId);
    if (!child || child.cardVersion !== record.cardVersion) return null;
    await writeJson(fileFor(token), { ...record, touched: Date.now() });
    return child;
  });
}
export async function startChildSession(
  response: NextResponse,
  child: Pick<ChildRecord, 'id' | 'cardVersion'>,
) {
  if (Number(schoolTime().slice(11, 13)) >= schoolEndHour())
    throw new BookError(
      'Für heute ist Schulschluss. Du kannst dich morgen wieder anmelden.',
      403,
    );
  const previous = (await cookies()).get(COOKIE)?.value;
  if (previous && /^[a-f0-9]{64}$/.test(previous))
    await fs.rm(fileFor(previous), { force: true });
  const token = crypto.randomBytes(32).toString('hex');
  await writeJson(fileFor(token), {
    childId: child.id,
    cardVersion: child.cardVersion,
    touched: Date.now(),
    schoolDay: schoolTime().slice(0, 10),
  });
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: (process.env.BASE_URL || '').startsWith('https:'),
    path: '/',
    maxAge: 36000,
  });
}
export async function stopChildSession(response: NextResponse) {
  const token = (await cookies()).get(COOKIE)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token))
    await fs.rm(fileFor(token), { force: true });
  response.cookies.delete(COOKIE);
}
