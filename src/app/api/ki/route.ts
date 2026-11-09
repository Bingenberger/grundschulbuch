import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import { boundedBody } from '@/lib/http';
import { BookError } from '@/lib/notebooks.mjs';
import { aiStatus, generateLearning } from '@/lib/ai.mjs';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!(await currentUser())) return jsonError('Bitte anmelden.', 401);
  try {
    return NextResponse.json(await aiStatus(), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return jsonError('Der KI-Dienst ist nicht eingerichtet.', 503);
  }
}
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  const user = await currentUser();
  if (!user) return jsonError('Bitte anmelden.', 401);
  try {
    const body = JSON.parse((await boundedBody(request, 10000)).toString());
    return NextResponse.json(await generateLearning(user.id, body));
  } catch (e) {
    return jsonError(
      e instanceof BookError ? e.message : 'Die Erstellung ist fehlgeschlagen.',
      e instanceof BookError ? e.status : 400,
    );
  }
}
