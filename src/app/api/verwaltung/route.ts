import { NextResponse } from 'next/server';
import { currentUser, fromOwnOrigin, jsonError } from '@/lib/auth';
import * as accounts from '@/lib/accounts.mjs';
import * as classes from '@/lib/classes.mjs';
import * as books from '@/lib/notebooks.mjs';
import { boundedBody } from '@/lib/http';
import { adminOverview } from '@/lib/admin';
import { setYoutubeSettings } from '@/lib/video-search.mjs';
export const dynamic = 'force-dynamic';

/** Admin area: accounts, classes, children and school templates. */
export async function POST(request: Request) {
  if (!fromOwnOrigin(request)) return jsonError('Anfrage nicht erlaubt.', 403);
  const user = await currentUser();
  if (!user) return jsonError('Bitte anmelden.', 401);
  if (user.role !== 'admin') return jsonError('Nur für die Verwaltung.', 403);
  try {
    const body = JSON.parse((await boundedBody(request, 5 * 1024 * 1024)).toString('utf8'));
    let result: unknown;
    switch (body.action) {
      case 'overview':
        result = await adminOverview();
        break;
      // Accounts
      case 'createAccount':
        result = await accounts.createAccount(body.name, body.role);
        break;
      case 'resetCode':
        result = await accounts.resetAccountCode(body.id);
        break;
      case 'renameAccount':
        result = await accounts.renameAccount(body.id, body.name);
        break;
      case 'setRole':
        result = await accounts.setAccountRole(body.id, body.role);
        break;
      case 'block':
        if (body.id === user.id && body.blocked) return jsonError('Das eigene Konto kann nicht gesperrt werden.', 400);
        result = await accounts.setAccountBlockedById(body.id, !!body.blocked);
        break;
      case 'deleteAccount':
        await accounts.deleteUnusedAccount(body.id);
        result = { ok: true };
        break;
      // Classes and children
      case 'createClass':
        result = await classes.adminCreateClass(body.title, body.teacherIds ?? []);
        break;
      case 'changeClass':
        result = await classes.adminChangeClass(body.id, body);
        break;
      case 'deleteClass':
        await classes.adminDeleteClass(body.id);
        result = { ok: true };
        break;
      case 'moveChild':
        await classes.moveChild(body.childId, body.targetId);
        result = await classes.listAllClasses();
        break;
      // School templates
      case 'publishTemplate':
        result = await books.publishSchoolTemplate(user.id, body);
        break;
      case 'saveTemplateEdit':
        result = await books.saveSchoolTemplateEdit(user.id, body);
        break;
      case 'removeTemplate':
        await books.removeSchoolTemplate(body.templateId);
        result = { ok: true };
        break;
      case 'hideTemplate':
        result = await books.setTemplateHidden(body.key, !!body.hidden);
        break;
      case 'templatePolicy':
        result = await books.setTemplatePolicy(body.key, body.classId ?? null, body.patch);
        break;
      // Settings for the whole instance
      case 'youtube':
        result = await setYoutubeSettings({
          ...(body.key !== undefined ? { key: body.key } : {}),
          ...(body.childSearch !== undefined ? { childSearch: !!body.childSearch } : {}),
        });
        break;
      default:
        return jsonError('Unbekannte Aktion.', 400);
    }
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    const known = e instanceof books.BookError || e instanceof accounts.AccountError;
    return jsonError(known ? (e as Error).message : 'Anfrage fehlgeschlagen.', known ? (e as { status: number }).status : 400);
  }
}
