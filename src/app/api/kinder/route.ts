import { NextResponse } from 'next/server';
import { fromOwnOrigin, jsonError, stopSession } from '@/lib/auth';
import {
  currentChild,
  startChildSession,
  stopChildSession,
} from '@/lib/child-auth';
import { loginChild, redeemHelpCode } from '@/lib/classes.mjs';
import * as books from '@/lib/notebooks.mjs';
import { boundedBody } from '@/lib/http';
import { dataPath, readJson, withLock, writeJson } from '@/lib/store.mjs';
export const dynamic = 'force-dynamic';
// Failed scans share a bounded persistent bucket. Real QR cards contain ample entropy.
async function loginLimit() {
  return withLock('kinder-anmeldung', async () => {
    const file = dataPath('kinder-versuche.json');
    const now = Date.now();
    const record = await readJson(file, { start: now, count: 0 });
    if (now - record.start > 60000) {
      record.start = now;
      record.count = 0;
    }
    if (record.count >= 60)
      throw new books.BookError(
        'Bitte eine Minute warten und die Lehrkraft fragen.',
        429,
      );
    record.count++;
    await writeJson(file, record);
  });
}
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  try {
    const body = JSON.parse(
      (await boundedBody(request, 5 * 1024 * 1024)).toString(),
    );
    if (body.action === 'login') {
      await loginLimit();
      const child = body.code
        ? await redeemHelpCode(body.code)
        : await loginChild(body.digest);
      const response = NextResponse.json({ ok: true });
      await stopSession(response);
      await startChildSession(response, child);
      return response;
    }
    if (body.action === 'logout') {
      const response = NextResponse.json({ ok: true });
      await stopChildSession(response);
      return response;
    }
    const child = await currentChild();
    if (!child) return jsonError('Bitte deine Karte noch einmal scannen.', 401);
    let result;
    switch (body.action) {
      case 'ping':
        result = { ok: true };
        break;
      case 'list':
        result = (await books.listBooks(child.id)).filter((b) => !b.trashed);
        break;
      case 'open': {
        result = await books.getBook(child.id, body.id);
        if (result.book.trashed)
          return jsonError('Das Heft liegt im Papierkorb.', 403);
        break;
      }
      case 'page':
        result = await books.savePage(child.id, body.id, body.page, { features: child.features });
        break;
      case 'create':
        result = await books.createBook(child.id, 'kind', {
          title: body.title,
          orientation: 'landscape',
        });
        break;
      case 'addPage': {
        const data = await books.getBook(child.id, body.id);
        if (!data.book.allowChildPages || data.book.trashed)
          return jsonError('Bitte deine Lehrkraft um eine neue Seite.', 403);
        const page = books.validatePage(body.page);
        if (page.elements.length)
          return jsonError('Nur leere Seiten dürfen hinzugefügt werden.', 403);
        result = await books.addPage(child.id, body.id, page);
        break;
      }
      case 'trash':
        result = await books.trashBook(child.id, body.id);
        break;
      case 'images':
        result = child.images;
        break;
      default:
        return jsonError('Diese Aktion ist nicht erlaubt.', 403);
    }
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return jsonError(
      e instanceof books.BookError
        ? e.message
        : 'Das hat nicht geklappt. Bitte deine Lehrkraft fragen.',
      e instanceof books.BookError ? e.status : 400,
    );
  }
}
