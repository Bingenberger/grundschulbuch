import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createSession, endSession, readSession, SESSION_HOURS } from './sessions.mjs';
import { findAccount, type PublicAccount } from './accounts.mjs';

const COOKIE = 'gsb_sitzung';

function publicOrigin() {
  return new URL(process.env.BASE_URL || 'http://localhost:3000').origin;
}

/** The logged-in teacher, or null. */
export async function currentUser(): Promise<PublicAccount | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  const session = await readSession(token);
  return session ? findAccount(session.userId) : null;
}

/** Starts a session and sets the cookie on the response. */
export async function startSession(response: NextResponse, userId: string) {
  const token = await createSession(userId);
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: publicOrigin().startsWith('https:'),
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function stopSession(response: NextResponse) {
  await endSession((await cookies()).get(COOKIE)?.value);
  response.cookies.delete(COOKIE);
}

/**
 * Changing requests must come from our own pages. The SameSite cookie already
 * blocks most cross-site requests; the Origin check covers the rest.
 */
export function fromOwnOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  if (origin === publicOrigin()) return true;
  // During development the app is also opened via the LAN address.
  return process.env.NODE_ENV !== 'production' && new URL(origin).host === request.headers.get('host');
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
