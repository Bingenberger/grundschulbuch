import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import { currentChild } from '@/lib/child-auth';
import { grantTeachers } from '@/lib/classes.mjs';
import { BookError } from '@/lib/notebooks.mjs';
import { boundedBody } from '@/lib/http';
import * as videos from '@/lib/video-search.mjs';
export const dynamic = 'force-dynamic';

/**
 * Dialog „Video oder Webseite einfügen“: whether the video search is set up,
 * the search itself, title and preview of an address, and copying a preview
 * picture into the own media store. Children only with “Internet”.
 */
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  const teacher = await currentUser();
  const child = teacher ? null : await currentChild();
  if (!teacher && !child) return jsonError('Bitte erneut anmelden.', 401);
  if (child && !child.features.includes('internet')) return jsonError('Internet ist für dich nicht freigegeben.', 403);
  const owner = (teacher || child)!.id;
  const role = teacher ? teacher.role : 'kind';
  try {
    const body = JSON.parse((await boundedBody(request, 20000)).toString('utf8'));
    let result: unknown;
    switch (body.action) {
      case 'status':
        result = { search: await videos.searchAvailable(role), admin: role === 'admin' };
        break;
      case 'search':
        result = await videos.searchVideos(owner, role, body);
        break;
      case 'info':
        if (typeof body.url !== 'string' || body.url.length > 2000) return jsonError('Ungültige Internetadresse.', 400);
        result = await videos.videoInfo(body.url);
        break;
      case 'poster': {
        if (body.url !== undefined && (typeof body.url !== 'string' || body.url.length > 2000)) return jsonError('Ungültige Internetadresse.', 400);
        const stored = body.url ? await videos.storeMediathekPoster(owner, body.url) : await videos.storeYoutubePoster(owner, body.id);
        if (child) await grantTeachers(child, [stored.src]);
        result = stored;
        break;
      }
      default:
        return jsonError('Unbekannte Aktion.', 400);
    }
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return jsonError(
      e instanceof BookError ? e.message : 'Das hat nicht geklappt. Bitte noch einmal versuchen.',
      e instanceof BookError ? e.status : 400,
    );
  }
}
