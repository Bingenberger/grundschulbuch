import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import { mediaReferences } from '@/lib/learning/validation.mjs';
import { grantImages } from '@/lib/classes.mjs';
import { listPublicAccounts } from '@/lib/accounts.mjs';
import * as books from '@/lib/notebooks.mjs';
import { boundedBody } from '@/lib/http';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  const user = await currentUser();
  if (!user) return jsonError('Bitte erneut anmelden.', 401);
  try {
    const body = JSON.parse(
      (await boundedBody(request, 5 * 1024 * 1024)).toString('utf8'),
    );
    const owner = body.id
      ? await books.accessibleOwner(user.id, body.id)
      : user.id;
    let result;
    switch (body.action) {
      case 'folders':
        result = await books.listFolders(user.id);
        break;
      case 'folder':
        result = await books.saveFolder(user.id, body);
        break;
      case 'removeFolder':
        await books.removeFolder(user.id, body.folderId);
        result = { ok: true };
        break;
      case 'preferences':
        result = await books.preferences(user.id, body.settings);
        break;
      case 'list':
        result = await books.listBooks(user.id);
        break;
      case 'open':
        result = await books.getBook(owner, body.id);
        break;
      case 'create':
        result = await books.createBook(user.id, user.role, body);
        break;
      case 'duplicate': {
        const source = await books.getBook(owner, body.id);
        result = await books.createBook(user.id, user.role, {
          title: `${source.book.title.slice(0, 110)} (Kopie)`,
          color: source.book.color,
          pages: source.pages,
          sourceId: source.book.id,
        });
        break;
      }
      case 'update':
        result = await books.updateBook(owner, body.id, body);
        break;
      case 'restore':
        result = await books.trashBook(owner, body.id, false);
        break;
      case 'delete':
        await books.deleteBook(owner, body.id);
        result = { ok: true };
        break;
      case 'page': {
        if (owner !== user.id) {
          const page = books.validatePage(body.page);
          for (const src of mediaReferences(page)) {
            const el = {
              id: '',
              type: 'image' as const,
              x: 0,
              y: 0,
              width: 1,
              height: 1,
              rotation: 0,
              locked: false,
              color: '#ffffff',
              src,
            };
            try {
              await books.checkMedia(owner, [el]);
            } catch {
              await books.checkMedia(user.id, [el]);
              await grantImages(owner, [el.src!]);
            }
          }
        }
        result = await books.savePage(
          owner,
          body.id,
          body.page,
          false,
          user.id,
        );
        break;
      }
      case 'addPage':
        result = await books.addPage(owner, body.id, body.page, body.afterId);
        break;
      case 'colleagues':
        result = (await listPublicAccounts()).filter(
          (account) => account.id !== user.id,
        );
        break;
      case 'share':
        result = await books.shareBook(owner, body.id, body.recipientId);
        break;
      case 'shareTemplate':
        result = await books.shareTemplate(
          user.id,
          body.templateId,
          body.recipientId,
        );
        break;
      case 'assets':
        result = await books.listAssets(user.id);
        break;
      case 'asset':
        result = await books.saveAsset(user.id, body);
        break;
      case 'removeAsset':
        await books.removeAsset(user.id, body.assetId);
        result = { ok: true };
        break;
      case 'templates':
        result = await books.listTemplates(user.id);
        break;
      case 'template':
        result = await books.saveTemplate(user.id, body);
        break;
      case 'removeTemplate':
        await books.removeTemplate(user.id, body.templateId);
        result = { ok: true };
        break;
      default:
        return jsonError('Unbekannte Aktion.', 400);
    }
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    if (e instanceof books.BookError) return jsonError(e.message, e.status);
    if (e instanceof SyntaxError || e instanceof TypeError)
      return jsonError('Ungültige Anfrage.', 400);
    console.error('Werkstatt: Speicherfehler');
    return jsonError('Speichern fehlgeschlagen. Bitte erneut versuchen.', 500);
  }
}
