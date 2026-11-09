import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import * as classes from '@/lib/classes.mjs';
import { BookError, getBook, listBooks } from '@/lib/notebooks.mjs';
import { boundedBody } from '@/lib/http';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  const user = await currentUser();
  if (!user) return jsonError('Bitte anmelden.', 401);
  try {
    const body = JSON.parse((await boundedBody(request, 100000)).toString());
    let result;
    switch (body.action) {
      case 'list':
        result = await classes.listClasses(user.id);
        break;
      case 'create':
        result = await classes.createClass(user.id, body.title);
        break;
      case 'change':
        result = await classes.changeClass(user.id, body.id, body);
        break;
      case 'delete':
        await classes.deleteClass(user.id, body.id);
        result = { ok: true };
        break;
      case 'distribute':
        result = await classes.distribute(
          user.id,
          body.id,
          body.bookId,
          body.childIds,
          body.allowChildPages,
          body.allowChildAudio,
        );
        break;
      case 'help':
        result = await classes.issueHelpCode(user.id, body.id, body.childId);
        break;
      case 'books': {
        const klass = await classes.ownedClass(user.id, body.id);
        if (!klass.children.some((c) => c.id === body.childId))
          return jsonError('Kind nicht gefunden.', 404);
        result = await Promise.all(
          (await listBooks(body.childId)).map(async (book) => {
            const data = await getBook(body.childId, book.id);
            return {
              ...book,
              pageProgress: data.pages.map((p, i) => ({
                index: i + 1,
                updatedAt: p.updatedAt,
                byChild: p.lastEditorId === body.childId,
              })),
            };
          }),
        );
        break;
      }
      default:
        return jsonError('Unbekannte Aktion.', 400);
    }
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return jsonError(
      e instanceof BookError ? e.message : 'Anfrage fehlgeschlagen.',
      e instanceof BookError ? e.status : 400,
    );
  }
}
