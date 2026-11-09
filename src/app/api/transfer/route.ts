import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import {
  createTransfer,
  transferStatus,
  transferUpload,
} from '@/lib/transfers.mjs';
import { BookError } from '@/lib/notebooks.mjs';
import { boundedBody } from '@/lib/http';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  try {
    const token = new URL(request.url).searchParams.get('token');
    if (token)
      return NextResponse.json(
        await transferUpload(
          token,
          await boundedBody(request, 12 * 1024 * 1024),
        ),
      );
    const user = await currentUser();
    if (!user) return jsonError('Bitte anmelden.', 401);
    return NextResponse.json(await createTransfer(user.id));
  } catch (e) {
    return jsonError(
      e instanceof BookError ? e.message : 'Upload fehlgeschlagen.',
      e instanceof BookError ? e.status : 500,
    );
  }
}
export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) return jsonError('Bitte anmelden.', 401);
  try {
    const transfer = await transferStatus(
      new URL(request.url).searchParams.get('token') || '',
      user.id,
    );
    return NextResponse.json(
      { images: transfer.images },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Link abgelaufen.', 404);
  }
}
