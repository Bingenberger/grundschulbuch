import { currentChild } from '@/lib/child-auth';
import { currentUser, jsonError } from '@/lib/auth';
import { BookError, readImage } from '@/lib/notebooks.mjs';
export const dynamic = 'force-dynamic';
export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> },
) {
  const user = (await currentUser()) || (await currentChild());
  if (!user) return jsonError('Bitte anmelden.', 401);
  try {
    const { name } = await context.params;
    const buffer = await readImage(user.id, name);
    const type =
      (
        {
          apphtml: 'text/plain; charset=utf-8',
          png: 'image/png',
          jpg: 'image/jpeg',
          webp: 'image/webp',
          mp3: 'audio/mpeg',
          wav: 'audio/wav',
          ogg: 'audio/ogg',
          webm: 'audio/webm',
          m4a: 'audio/mp4',
        } as Record<string, string>
      )[name.split('.').pop()!] || 'application/octet-stream';
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': type,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        ...(name.endsWith('.apphtml')
          ? { 'Content-Disposition': 'attachment; filename=lernapp.html' }
          : {}),
      },
    });
  } catch (e) {
    return jsonError(
      'Bild nicht gefunden.',
      e instanceof BookError ? e.status : 404,
    );
  }
}
