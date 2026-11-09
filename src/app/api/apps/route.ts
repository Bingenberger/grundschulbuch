import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import { BookError, storeWebApp } from '@/lib/notebooks.mjs';
import { boundedBody } from '@/lib/http';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  const teacher = await currentUser();
  if (!teacher) return jsonError('Bitte als Lehrkraft anmelden.', 401);
  try {
    return NextResponse.json(
      await storeWebApp(
        teacher.id,
        await boundedBody(request, 2 * 1024 * 1024),
      ),
    );
  } catch (e) {
    return jsonError(
      e instanceof BookError
        ? e.message
        : 'Die HTML-App konnte nicht gespeichert werden.',
      e instanceof BookError ? e.status : 500,
    );
  }
}
