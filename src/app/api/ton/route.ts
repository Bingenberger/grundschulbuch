import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import { currentChild } from '@/lib/child-auth';
import { BookError, getBook, storeAudio } from '@/lib/notebooks.mjs';
import { grantImages } from '@/lib/classes.mjs';
import { boundedBody } from '@/lib/http';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  try {
    const teacher = await currentUser();
    const child = teacher ? null : await currentChild();
    if (!teacher && !child) return jsonError('Bitte anmelden.', 401);
    if (child) {
      const data = await getBook(
        child.id,
        new URL(request.url).searchParams.get('book') || '',
      );
      if (!data.book.allowChildAudio || data.book.trashed)
        return jsonError('Aufnahmen sind hier nicht erlaubt.', 403);
    }
    const result = await storeAudio(
      (teacher || child)!.id,
      await boundedBody(request, 20 * 1024 * 1024),
    );
    if (child) await grantImages(child.teacherId, [result.src]);
    return NextResponse.json(result);
  } catch (e) {
    return jsonError(
      e instanceof BookError
        ? e.message
        : 'Ton konnte nicht gespeichert werden.',
      e instanceof BookError ? e.status : 500,
    );
  }
}
