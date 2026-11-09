import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import { BookError, storeImage } from '@/lib/notebooks.mjs';
import { boundedBody } from '@/lib/http';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  const user = await currentUser();
  if (!user) return jsonError('Bitte erneut anmelden.', 401);
  try {
    return NextResponse.json(
      await storeImage(user.id, await boundedBody(request, 12 * 1024 * 1024)),
    );
  } catch (e) {
    return jsonError(
      e instanceof BookError
        ? e.message
        : 'Bild konnte nicht gespeichert werden.',
      e instanceof BookError ? e.status : 500,
    );
  }
}
