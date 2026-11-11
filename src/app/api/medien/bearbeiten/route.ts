import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import { currentChild } from '@/lib/child-auth';
import { grantImages } from '@/lib/classes.mjs';
import { BookError, editImage } from '@/lib/notebooks.mjs';
export const dynamic = 'force-dynamic';

/** POST {src, steps, effects} → the edited picture as a new media file. */
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  const teacher = await currentUser();
  const child = teacher ? null : await currentChild();
  if (!teacher && !child) return jsonError('Bitte erneut anmelden.', 401);
  if (child && !child.features.includes('imageEdit'))
    return jsonError('Bilder bearbeiten ist hier nicht freigegeben.', 403);
  try {
    const body = await request.json().catch(() => ({}));
    const result = await editImage((teacher || child)!.id, body.src, { steps: body.steps, effects: body.effects });
    if (child) await grantImages(child.teacherId, [result.src]);
    return NextResponse.json(result);
  } catch (e) {
    return jsonError(
      e instanceof BookError ? e.message : 'Das Bild konnte nicht bearbeitet werden.',
      e instanceof BookError ? e.status : 500,
    );
  }
}
