import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { dataPath, readJson, writeJson, withLock } from './store.mjs';
import {
  BookError,
  id,
  getBook,
  createBook,
  listBooks,
  deleteBook,
} from './notebooks.mjs';
import { mediaReferences } from './learning/validation.mjs';
import { keyedHash } from './sessions.mjs';
import { CHILD_DEFAULTS, cleanChildFeatures } from './child-features.mjs';
const classPath = (classId) => dataPath('klassen', `${id(classId)}.json`);
const digestPattern = /^[a-f0-9]{64}$/;
/** Teachers of a class; older files have a single teacherId. */
export function teachersOf(klass) {
  if (Array.isArray(klass.teacherIds)) return klass.teacherIds;
  return klass.teacherId ? [klass.teacherId] : [];
}
function normalize(klass) {
  if (!klass) return klass;
  const { teacherId, ...rest } = klass;
  return { ...rest, teacherIds: teachersOf({ teacherId, ...rest }) };
}
async function allClasses() {
  const files = await fs.readdir(dataPath('klassen')).catch((e) => {
    if (e.code === 'ENOENT') return [];
    throw e;
  });
  return Promise.all(
    files
      .filter((f) => f.endsWith('.json'))
      .map(async (f) => normalize(await readJson(dataPath('klassen', f)))),
  );
}
async function readClass(classId) {
  const klass = normalize(await readJson(classPath(classId), null));
  if (!klass) throw new BookError('Klasse nicht gefunden.', 404);
  return klass;
}
export async function ownedClass(owner, classId) {
  const klass = await readClass(classId).catch(() => null);
  if (!klass || !klass.teacherIds.includes(owner))
    throw new BookError('Klasse nicht gefunden.', 404);
  return klass;
}
function publicClass(klass) {
  return {
    ...normalize(klass),
    children: klass.children.map(({ qrHash, ...child }) => ({
      ...child,
      hasCard: !!qrHash,
    })),
  };
}
export async function listClasses(owner) {
  return (await allClasses())
    .filter((c) => c.teacherIds.includes(owner))
    .map(publicClass);
}
/** Admin: every class of the school. */
export async function listAllClasses() {
  return (await allClasses())
    .map(publicClass)
    .sort((a, b) => a.title.localeCompare(b.title, 'de', { numeric: true }));
}
function features(list) {
  try {
    return cleanChildFeatures(list);
  } catch (e) {
    throw new BookError(e.message);
  }
}
function name(value) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 60)
    throw new BookError('Bitte einen Namen mit höchstens 60 Zeichen eingeben.');
  return value.trim();
}
async function teacherList(value) {
  if (!Array.isArray(value) || value.length > 30 || value.some((t) => typeof t !== 'string'))
    throw new BookError('Ungültige Auswahl der Lehrkräfte.');
  const { readAccounts } = await import('./accounts.mjs');
  const known = new Set((await readAccounts()).users.map((u) => u.id));
  const list = [...new Set(value)];
  if (list.some((t) => !known.has(t))) throw new BookError('Lehrkraft nicht gefunden.', 404);
  return list;
}
export async function createClass(owner, title) {
  return adminCreateClass(title, [owner], false);
}
/** Admin: new class for any teachers (also none yet). */
export async function adminCreateClass(title, teacherIds = [], check = true) {
  const teachers = check ? await teacherList(teacherIds) : teacherIds;
  return withLock('klassen', async () => {
    const klass = {
      id: crypto.randomUUID(),
      teacherIds: teachers,
      title: name(title),
      archived: false,
      children: [],
      createdAt: new Date().toISOString(),
      images: [],
    };
    await writeJson(classPath(klass.id), klass);
    return publicClass(klass);
  });
}
export async function changeClass(owner, classId, input) {
  return withLock('klassen', async () =>
    applyChange(await ownedClass(owner, classId), input, owner),
  );
}
/** Admin: like changeClass for any class, also the list of teachers. */
export async function adminChangeClass(classId, input) {
  const teachers = input.teacherIds !== undefined ? await teacherList(input.teacherIds) : undefined;
  return withLock('klassen', async () => {
    const klass = await readClass(classId);
    if (teachers) klass.teacherIds = teachers;
    return applyChange(klass, { ...input, images: undefined }, null);
  });
}
function newChild(value) {
  return { id: crypto.randomUUID(), name: name(value), qrHash: null, cardVersion: 0 };
}
async function applyChange(klass, input, owner) {
  const classId = klass.id;
  {
    if (input.title !== undefined) klass.title = name(input.title);
    if (input.archived !== undefined) klass.archived = !!input.archived;
    if (input.childFeatures !== undefined)
      klass.childFeatures = features(input.childFeatures);
    if (input.addChild !== undefined) {
      if (klass.children.length >= 100)
        throw new BookError('Höchstens 100 Kinder pro Klasse.');
      klass.children.push(newChild(input.addChild));
    }
    if (input.addChildren !== undefined) {
      if (!Array.isArray(input.addChildren))
        throw new BookError('Bitte Namen als Liste schicken.');
      const names = input.addChildren
        .filter((n) => typeof n === 'string' && n.trim())
        .map((n) => n.trim());
      if (klass.children.length + names.length > 100)
        throw new BookError('Höchstens 100 Kinder pro Klasse.');
      klass.children.push(...names.map(newChild));
    }
    if (input.removeChild) {
      const child = klass.children.find((c) => c.id === input.removeChild);
      if (!child) throw new BookError('Kind nicht gefunden.', 404);
      for (const book of await listBooks(child.id))
        await deleteBook(child.id, book.id);
      await fs.rm(dataPath('medien', 'rechte', `${child.id}.json`), {
        force: true,
      });
      klass.children = klass.children.filter((c) => c.id !== child.id);
    }
    if (input.childId) {
      const child = klass.children.find((c) => c.id === input.childId);
      if (!child) throw new BookError('Kind nicht gefunden.', 404);
      if (input.childName !== undefined) child.name = name(input.childName);
      if (input.features !== undefined)
        child.features =
          input.features === null ? null : features(input.features);
      if (input.digest !== undefined) {
        if (input.digest !== null && !digestPattern.test(input.digest))
          throw new BookError('Ungültige Kartenprüfsumme.');
        const hash =
          input.digest === null ? null : keyedHash('child-qr', input.digest);
        if (
          hash &&
          (await allClasses()).some((c) =>
            c.children.some((k) => k.id !== child.id && k.qrHash === hash),
          )
        )
          throw new BookError(
            'Diese Karte gehört bereits zu einem anderen Kind.',
            409,
          );
        child.qrHash = hash;
        child.cardVersion++;
      }
    }
    if (input.images && owner) {
      const rights = await readJson(
        dataPath('medien', 'rechte', `${owner}.json`),
        [],
      );
      if (
        !Array.isArray(input.images) ||
        input.images.length > 100 ||
        input.images.some(
          (src) =>
            typeof src !== 'string' || !rights.includes(src.split('/').pop()),
        )
      )
        throw new BookError('Nur eigene Bilder können freigegeben werden.');
      klass.images = [...new Set(input.images)];
      for (const child of klass.children)
        await grantImages(child.id, klass.images);
    }
    await writeJson(classPath(classId), klass);
    return publicClass(klass);
  }
}
export async function deleteClass(owner, classId) {
  return withLock('klassen', async () => {
    const klass = await ownedClass(owner, classId);
    if (klass.teacherIds.length > 1)
      throw new BookError(
        'Diese Klasse gehört mehreren Lehrkräften. Bitte archivieren oder in der Verwaltung löschen.',
        409,
      );
    await removeClass(klass);
  });
}
/** Admin: delete any class with the notebooks of its children. */
export async function adminDeleteClass(classId) {
  return withLock('klassen', async () => removeClass(await readClass(classId)));
}
/** Admin: a child changes class (new school year); notebooks and card stay. */
export async function moveChild(childId, targetClassId) {
  return withLock('klassen', async () => {
    const target = await readClass(targetClassId);
    const source = (await allClasses()).find((c) => c.children.some((k) => k.id === childId));
    if (!source) throw new BookError('Kind nicht gefunden.', 404);
    if (source.id === target.id) return publicClass(target);
    if (target.children.length >= 100)
      throw new BookError('Höchstens 100 Kinder pro Klasse.');
    const child = source.children.find((k) => k.id === childId);
    source.children = source.children.filter((k) => k.id !== childId);
    target.children.push(child);
    await grantImages(child.id, target.images);
    await writeJson(classPath(source.id), source);
    await writeJson(classPath(target.id), target);
    return publicClass(target);
  });
}
async function removeClass(klass) {
  const classId = klass.id;
  {
    for (const child of klass.children) {
      for (const book of await listBooks(child.id))
        await deleteBook(child.id, book.id);
      await fs.rm(dataPath('medien', 'rechte', `${child.id}.json`), {
        force: true,
      });
    }
    await fs.rm(classPath(classId));
  }
}
/** Pictures a child adds are also usable by all teachers of the class. */
export async function grantTeachers(child, sources) {
  for (const teacher of child.teacherIds) await grantImages(teacher, sources);
}
export async function grantImages(owner, sources) {
  await withLock(`medien-${id(owner)}`, async () => {
    const file = dataPath('medien', 'rechte', `${owner}.json`);
    const rights = await readJson(file, []);
    await writeJson(file, [
      ...new Set([...rights, ...sources.map((s) => s.split('/').pop())]),
    ]);
  });
}
export async function distribute(
  owner,
  classId,
  bookId,
  childIds,
  allowChildPages,
  allowChildAudio = false,
) {
  return withLock('klassen', async () => {
    const klass = await ownedClass(owner, classId);
    if (klass.archived) throw new BookError('Die Klasse ist archiviert.');
    const source = await getBook(owner, bookId);
    const result = [];
    const chosen = klass.children.filter(
      (c) => !childIds || childIds.includes(c.id),
    );
    const sourceImages = mediaReferences(source.pages);
    for (const child of chosen) {
      await grantImages(child.id, [...sourceImages, ...klass.images]);
      const copy = await createBook(child.id, 'kind', {
        title: source.book.title,
        color: source.book.color,
        sourceId: source.book.id,
        pages: source.pages.map((p) => ({
          ...p,
          elements: p.elements.map((el) => ({ ...el, response: undefined, locked: true })),
        })),
      });
      copy.book.classId = classId;
      copy.book.allowChildPages = !!allowChildPages;
      copy.book.allowChildAudio = !!allowChildAudio;
      await writeJson(dataPath('hefte', copy.book.id, 'heft.json'), copy.book);
      result.push(copy.book);
    }
    return result;
  });
}

export async function childById(childId, includeArchived = false) {
  for (const klass of await allClasses()) {
    const child = klass.children.find((c) => c.id === childId);
    if (child && (!klass.archived || includeArchived))
      return {
        ...child,
        classId: klass.id,
        teacherIds: klass.teacherIds,
        images: klass.images,
        classTitle: klass.title,
        features: [
          ...(child.features ?? klass.childFeatures ?? CHILD_DEFAULTS),
        ],
      };
  }
  return null;
}
export async function loginChild(digest) {
  if (!digestPattern.test(digest)) throw new BookError('Ungültige Karte.');
  const hash = keyedHash('child-qr', digest);
  for (const klass of await allClasses()) {
    const child =
      !klass.archived && klass.children.find((c) => c.qrHash === hash);
    if (child) return child;
  }
  throw new BookError(
    'Diese Karte ist nicht zugeordnet. Bitte die Lehrkraft fragen.',
    401,
  );
}
export async function issueHelpCode(owner, classId, childId) {
  const klass = await ownedClass(owner, classId);
  if (!klass.children.some((c) => c.id === childId))
    throw new BookError('Kind nicht gefunden.', 404);
  const code = crypto.randomInt(10000000, 99999999).toString();
  await writeJson(
    dataPath('hilfscodes', `${keyedHash('help-code', code)}.json`),
    { childId, expires: Date.now() + 120000 },
  );
  return { code, expires: Date.now() + 120000 };
}
export async function redeemHelpCode(code) {
  if (typeof code !== 'string' || !/^[0-9]{8}$/.test(code))
    throw new BookError('Der Hilfscode stimmt nicht.', 401);
  return withLock(`hilfe-${keyedHash('help-code', code)}`, async () => {
    const file = dataPath('hilfscodes', `${keyedHash('help-code', code)}.json`);
    const entry = await readJson(file, null);
    if (!entry || entry.expires < Date.now())
      throw new BookError('Dieser Hilfscode ist abgelaufen.', 401);
    await fs.rm(file);
    const child = await childById(entry.childId);
    if (!child) throw new BookError('Kind nicht gefunden.', 401);
    return child;
  });
}
