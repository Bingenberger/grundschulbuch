import { stopChildSession } from '@/lib/child-auth';
import { NextResponse } from 'next/server';
import { pinProblem, redeemOneTimeCode } from '@/lib/accounts.mjs';
import { fromOwnOrigin, jsonError, startSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  const body = await request.json().catch(() => null);
  const problem = pinProblem(body?.pin);
  if (problem) return jsonError(problem, 400);
  const result = await redeemOneTimeCode(body?.name, body?.code, body.pin);
  if (!result.ok) {
    return result.reason === 'gesperrt'
      ? jsonError('Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen.', 429)
      : jsonError('Name oder Einmalcode stimmt nicht, oder der Code ist abgelaufen.', 401);
  }
  const response = NextResponse.json({ user: result.user });
  await stopChildSession(response);
  await startSession(response, result.user.id);
  return response;
}
