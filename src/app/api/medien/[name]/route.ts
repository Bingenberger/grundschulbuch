import { currentChild } from '@/lib/child-auth';
import { currentUser, jsonError } from '@/lib/auth';
import { BookError, readImage } from '@/lib/notebooks.mjs';
export const dynamic = 'force-dynamic';
export async function GET(
  request: Request,
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
    // Safari (iPad) asks for sound in pieces and expects them as such.
    const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range') || '');
    const size = buffer.length;
    let from = 0, to = size - 1;
    if (range && (range[1] || range[2])) {
      if (range[1]) {
        from = Number(range[1]);
        if (range[2]) to = Math.min(size - 1, Number(range[2]));
      } else from = Math.max(0, size - Number(range[2]));
      if (from >= size || from > to)
        return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    }
    const partial = !!range && !!(range[1] || range[2]);
    return new Response(new Uint8Array(buffer.subarray(from, to + 1)), {
      status: partial ? 206 : 200,
      headers: {
        'Accept-Ranges': 'bytes',
        'Content-Length': String(to - from + 1),
        ...(partial ? { 'Content-Range': `bytes ${from}-${to}/${size}` } : {}),
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
