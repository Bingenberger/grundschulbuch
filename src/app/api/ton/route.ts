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
      // A sound button or recorder from the teacher may always be filled.
      const elementId = new URL(request.url).searchParams.get('element');
      const invited =
        !!elementId &&
        data.pages.some((page) =>
          page.elements.some(
            (el) =>
              el.id === elementId &&
              ((el.type === 'audio' && typeof el.placeholder === 'string') ||
                (el.type === 'widget' && ['recorder', 'soundstudio', 'karaoke'].includes(el.widgetKind || ''))),
          ),
        );
      if ((!data.book.allowChildAudio && !invited) || data.book.trashed)
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
