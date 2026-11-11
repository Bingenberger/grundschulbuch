import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import { currentChild } from '@/lib/child-auth';
import { grantImages } from '@/lib/classes.mjs';
import { BookError, getBook, storeImage } from '@/lib/notebooks.mjs';
import { boundedBody } from '@/lib/http';
export const dynamic = 'force-dynamic';

/** Whether the element is a photo placeholder the teacher put into this child's notebook. */
async function placeholderIn(childId: string, bookId: string, elementId: string) {
  if (!bookId || !elementId) return false;
  try {
    const data = await getBook(childId, bookId);
    return (
      !data.book.trashed &&
      data.pages.some((page) =>
        page.elements.some((el) => el.id === elementId && el.type === 'image' && typeof el.placeholder === 'string'),
      )
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  const teacher = await currentUser();
  const child = teacher ? null : await currentChild();
  if (!teacher && !child) return jsonError('Bitte erneut anmelden.', 401);
  if (child) {
    const params = new URL(request.url).searchParams;
    if (
      !child.features.includes('imageUpload') &&
      !(await placeholderIn(child.id, params.get('book') || '', params.get('element') || ''))
    )
      return jsonError('Eigene Bilder sind hier nicht freigegeben.', 403);
  }
  try {
    const result = await storeImage(
      (teacher || child)!.id,
      await boundedBody(request, 12 * 1024 * 1024),
    );
    if (child) await grantImages(child.teacherId, [result.src]);
    return NextResponse.json(result);
  } catch (e) {
    return jsonError(
      e instanceof BookError
        ? e.message
        : 'Bild konnte nicht gespeichert werden.',
      e instanceof BookError ? e.status : 500,
    );
  }
}
