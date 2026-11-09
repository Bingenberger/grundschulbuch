import { NextResponse } from 'next/server';
import { fromOwnOrigin, jsonError, stopSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  const response = NextResponse.json({ ok: true });
  await stopSession(response);
  return response;
}
