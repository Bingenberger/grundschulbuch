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
async function allClasses() {
  const files = await fs.readdir(dataPath('klassen')).catch((e) => {
    if (e.code === 'ENOENT') return [];
    throw e;
  });
  return Promise.all(
    files
      .filter((f) => f.endsWith('.json'))
      .map((f) => readJson(dataPath('klassen', f))),
  );
}
export async function ownedClass(owner, classId) {
  const klass = await readJson(classPath(classId), null);
  if (!klass || klass.teacherId !== owner)
    throw new BookError('Klasse nicht gefunden.', 404);
  return klass;
}
function publicClass(klass) {
  return {
    ...klass,
    children: klass.children.map(({ qrHash, ...child }) => ({
      ...child,
      hasCard: !!qrHash,
    })),
  };
}
export async function listClasses(owner) {
  return (await allClasses())
    .filter((c) => c.teacherId === owner)
    .map(publicClass);
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
export async function createClass(owner, title) {
  return withLock('klassen', async () => {
    const klass = {
      id: crypto.randomUUID(),
      teacherId: owner,
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
  return withLock('klassen', async () => {
    const klass = await ownedClass(owner, classId);
    if (input.title !== undefined) klass.title = name(input.title);
    if (input.archived !== undefined) klass.archived = !!input.archived;
    if (input.childFeatures !== undefined)
      klass.childFeatures = features(input.childFeatures);
    if (input.addChild !== undefined) {
      if (klass.children.length >= 100)
        throw new BookError('Höchstens 100 Kinder pro Klasse.');
      klass.children.push({
        id: crypto.randomUUID(),
        name: name(input.addChild),
        qrHash: null,
        cardVersion: 0,
      });
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
    if (input.images) {
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
  });
}
export async function deleteClass(owner, classId) {
  return withLock('klassen', async () => {
    const klass = await ownedClass(owner, classId);
    for (const child of klass.children) {
      for (const book of await listBooks(child.id))
        await deleteBook(child.id, book.id);
      await fs.rm(dataPath('medien', 'rechte', `${child.id}.json`), {
        force: true,
      });
    }
    await fs.rm(classPath(classId));
  });
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
        teacherId: klass.teacherId,
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
