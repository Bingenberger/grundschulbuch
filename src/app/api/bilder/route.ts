import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import { currentChild } from '@/lib/child-auth';
import { grantImages } from '@/lib/classes.mjs';
import { BookError, storeImage } from '@/lib/notebooks.mjs';
import { SourceError, galleryOrigin, loadImage, searchImages } from '@/lib/image-sources.mjs';
export const dynamic = 'force-dynamic';

/** Who may use which source: children only pictograms and the school gallery. */
async function access(source: string) {
  const teacher = await currentUser();
  if (teacher) return { owner: teacher.id, child: null };
  const child = await currentChild();
  if (!child) throw new SourceError('Bitte anmelden.', 401);
  if (!child.features.includes('imageSearch') || !['arasaac', 'galerie'].includes(source))
    throw new SourceError('Diese Bildquelle ist hier nicht freigegeben.', 403);
  return { owner: child.id, child };
}

function failure(e: unknown, fallback: string) {
  if (e instanceof SourceError || e instanceof BookError) return jsonError(e.message, e.status);
  return jsonError(fallback, 500);
}

/**
 * GET ?quelle=…&q=…&seite=…  → search
 * GET ?quelle=…&bild=<url>    → preview picture (allowlisted addresses only)
 * GET ?quellen                → which sources are set up
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (params.has('quellen')) return NextResponse.json({ galerie: !!galleryOrigin() });
  const source = params.get('quelle') || '';
  try {
    await access(source);
    const picture = params.get('bild');
    if (picture) {
      const image = await loadImage(source, picture);
      return new NextResponse(new Uint8Array(image.buffer), {
        headers: {
          'Content-Type': image.type,
          'Cache-Control': 'private, max-age=86400',
          'Content-Security-Policy': "default-src 'none'",
        },
      });
    }
    return NextResponse.json(await searchImages(source, params.get('q') || '', params.get('seite') || 1), {
      headers: { 'Cache-Control': 'private, max-age=300' },
    });
  } catch (e) {
    return failure(e, 'Die Bildsuche ist fehlgeschlagen.');
  }
}

/** POST {quelle, bild} → copies the full picture into the own media store. */
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  try {
    const body = await request.json().catch(() => ({}));
    const source = typeof body.quelle === 'string' ? body.quelle : '';
    const { owner, child } = await access(source);
    const image = await loadImage(source, typeof body.bild === 'string' ? body.bild : '');
    const result = await storeImage(owner, image.buffer);
    if (child) await grantImages(child.teacherId, [result.src]);
    return NextResponse.json(result);
  } catch (e) {
    return failure(e, 'Das Bild konnte nicht übernommen werden.');
  }
}
