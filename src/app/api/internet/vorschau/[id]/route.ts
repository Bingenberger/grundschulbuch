import { currentUser, jsonError } from '@/lib/auth';
import { currentChild } from '@/lib/child-auth';
import { BookError } from '@/lib/notebooks.mjs';
import { mediathekThumbnail, youtubeThumbnail } from '@/lib/video-search.mjs';
export const dynamic = 'force-dynamic';

/**
 * Preview picture of a YouTube video, fetched by the server (search results,
 * dialog); `mediathek?adresse=…` for a video of the ARD or ZDF Mediathek.
 */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const teacher = await currentUser();
  const child = teacher ? null : await currentChild();
  if (!teacher && !child?.features.includes('internet')) return jsonError('Bitte anmelden.', 401);
  try {
    const { id } = await context.params;
    const address = new URL(request.url).searchParams.get('adresse') ?? '';
    if (id === 'mediathek' && address.length > 2000) throw new BookError('Ungültige Adresse.', 400);
    const picture = id === 'mediathek' ? await mediathekThumbnail(address) : await youtubeThumbnail(id);
    return new Response(new Uint8Array(picture.buffer), {
      headers: {
        'Content-Type': ['image/webp', 'image/png'].includes(picture.type) ? picture.type : 'image/jpeg',
        'Cache-Control': 'private, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e) {
    return jsonError('Kein Vorschaubild.', e instanceof BookError ? e.status : 404);
  }
}
