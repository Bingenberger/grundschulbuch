import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
const directory = await fs.mkdtemp(
  path.join(os.tmpdir(), 'grundschulbuch-klassen-'),
);
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'classes-test-secret'.padEnd(48, 'x');
const klass = await import('../src/lib/classes.mjs');
const books = await import('../src/lib/notebooks.mjs');
const store = await import('../src/lib/store.mjs');
after(() => fs.rm(directory, { recursive: true, force: true }));
const teacher = crypto.randomUUID(),
  other = crypto.randomUUID();
const status = (code) => (e) =>
  e instanceof books.BookError && e.status === code;
const digest = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');
const newClass = async (name = '1a') => {
  let c = await klass.createClass(teacher, name);
  c = await klass.changeClass(teacher, c.id, { addChild: 'Ada' });
  c = await klass.changeClass(teacher, c.id, { addChild: 'Ben' });
  return c;
};
const element = () => ({
  id: crypto.randomUUID(),
  type: 'text',
  x: 15,
  y: 20,
  width: 150,
  height: 20,
  rotation: 0,
  locked: false,
  color: '#123456',
  text: 'Aufgabe 1',
  font: 'Andika',
  fontSize: 18,
  bold: false,
});

test('Klassen sind getrennt; nur HMAC-Werte verlassen den Kartenspeicher', async () => {
  const c = await newClass();
  await assert.rejects(
    klass.changeClass(other, c.id, { title: 'Fremd' }),
    status(404),
  );
  const payload = 'anton:hoch-entropischer-test-code-kein-echtes-geheimnis';
  const sha = digest(payload);
  const changed = await klass.changeClass(teacher, c.id, {
    childId: c.children[0].id,
    digest: sha,
  });
  assert.equal(changed.children[0].hasCard, true);
  assert.equal('qrHash' in changed.children[0], false);
  const bytes = await fs.readFile(
    store.dataPath('klassen', `${c.id}.json`),
    'utf8',
  );
  assert.equal(bytes.includes(payload), false);
  assert.equal(bytes.includes(sha), false);
  assert.equal((await klass.loginChild(sha)).id, c.children[0].id);
  await assert.rejects(
    klass.changeClass(teacher, c.id, {
      childId: c.children[1].id,
      digest: sha,
    }),
    status(409),
  );
  await klass.changeClass(teacher, c.id, {
    childId: c.children[0].id,
    digest: null,
  });
  await assert.rejects(klass.loginChild(sha), status(401));
});

test('Hilfscodes laufen ab und gelten nur einmal', async () => {
  const c = await newClass('Hilfe');
  const issued = await klass.issueHelpCode(teacher, c.id, c.children[0].id);
  assert.equal((await klass.redeemHelpCode(issued.code)).id, c.children[0].id);
  await assert.rejects(klass.redeemHelpCode(issued.code), status(401));
  const expired = await klass.issueHelpCode(teacher, c.id, c.children[1].id);
  const { keyedHash } = await import('../src/lib/sessions.mjs');
  await store.writeJson(
    store.dataPath(
      'hilfscodes',
      `${keyedHash('help-code', expired.code)}.json`,
    ),
    { childId: c.children[1].id, expires: 0 },
  );
  await assert.rejects(klass.redeemHelpCode(expired.code), status(401));
});

test('Ausgeteilte Hefte sind unabhängige Kopien mit serverseitig gesperrten Aufgaben', async () => {
  const c = await newClass('Austeilen');
  const source = await books.createBook(teacher, 'lehrkraft', {
    title: 'Unser Heft',
  });
  source.pages[0].elements = [element()];
  const saved = await books.savePage(teacher, source.book.id, source.pages[0]);
  const copies = await klass.distribute(
    teacher,
    c.id,
    source.book.id,
    undefined,
    true,
    false,
  );
  assert.equal(copies.length, 2);
  assert.notEqual(copies[0].id, copies[1].id);
  const first = await books.getBook(c.children[0].id, copies[0].id);
  assert.equal(first.book.allowChildPages, true);
  assert.equal(first.pages[0].elements[0].locked, true);
  const page = first.pages[0];
  await assert.rejects(
    books.savePage(
      c.children[0].id,
      copies[0].id,
      { ...page, elements: [] },
      true,
    ),
    status(403),
  );
  await assert.rejects(
    books.savePage(
      c.children[0].id,
      copies[0].id,
      { ...page, elements: [{ ...page.elements[0], x: 25 }] },
      true,
    ),
    status(403),
  );
  await assert.rejects(
    books.savePage(
      c.children[0].id,
      copies[0].id,
      { ...page, ruling: 'karo5' },
      true,
    ),
    status(403),
  );
  await books.savePage(
    c.children[0].id,
    copies[0].id,
    {
      ...page,
      elements: [...page.elements, { ...element(), text: 'Meine Antwort' }],
    },
    true,
  );
  assert.equal(
    (await books.getBook(c.children[1].id, copies[1].id)).pages[0].elements
      .length,
    1,
  );
  assert.equal(
    (await books.getBook(teacher, source.book.id)).pages[0].revision,
    saved.revision,
  );
  assert.equal(
    await books.accessibleOwner(teacher, copies[0].id),
    c.children[0].id,
  );
  await assert.rejects(books.accessibleOwner(other, copies[0].id), status(404));
  await books.trashBook(c.children[0].id, copies[0].id);
  assert.equal(
    (await books.getBook(c.children[0].id, copies[0].id)).book.trashed,
    true,
  );
});

test('Archivierte Klassen sperren Kinderzugang; Löschen entfernt Kinderhefte und Karten', async () => {
  const c = await newClass('Archiv');
  const sha = digest('archivierte-karte-1234567890');
  await klass.changeClass(teacher, c.id, {
    childId: c.children[0].id,
    digest: sha,
  });
  const b = await books.createBook(c.children[0].id, 'kind', {
    title: 'Kinderheft',
  });
  await klass.changeClass(teacher, c.id, { archived: true });
  await assert.rejects(klass.loginChild(sha), status(401));
  assert.equal(await klass.childById(c.children[0].id), null);
  assert.equal(
    await books.accessibleOwner(teacher, b.book.id),
    c.children[0].id,
  );
  await klass.deleteClass(teacher, c.id);
  await assert.rejects(books.getBook(c.children[0].id, b.book.id), status(404));
});

test('Lehrkräfte legen fest, welche Funktionen Kinder sehen: Klasse als Vorgabe, Kind mit eigener Auswahl', async () => {
  const { CHILD_DEFAULTS } = await import('../src/lib/child-features.mjs');
  let c = await newClass('Funktionen');
  const [ada, ben] = c.children;
  assert.deepEqual((await klass.childById(ada.id)).features, [...CHILD_DEFAULTS]);
  c = await klass.changeClass(teacher, c.id, { childFeatures: ['pen', 'text', 'pen'] });
  assert.deepEqual(c.childFeatures, ['pen', 'text']);
  assert.deepEqual((await klass.childById(ben.id)).features, ['pen', 'text']);
  c = await klass.changeClass(teacher, c.id, { childId: ada.id, features: ['eraser'] });
  assert.deepEqual(c.children.find((k) => k.id === ada.id).features, ['eraser']);
  assert.deepEqual((await klass.childById(ada.id)).features, ['eraser']);
  assert.deepEqual((await klass.childById(ben.id)).features, ['pen', 'text']);
  c = await klass.changeClass(teacher, c.id, { childId: ada.id, features: null });
  assert.deepEqual((await klass.childById(ada.id)).features, ['pen', 'text']);
  for (const bad of [['admin'], 'pen', [1], { pen: true }])
    await assert.rejects(klass.changeClass(teacher, c.id, { childFeatures: bad }), status(400));
  await assert.rejects(klass.changeClass(teacher, c.id, { childId: ada.id, features: ['share'] }), status(400));
  await assert.rejects(klass.changeClass(other, c.id, { childFeatures: ['pen'] }), status(404));
});

test('Verwaltung: Klasse mit mehreren Lehrkräften, Kinder als Liste, Kind wechselt die Klasse', async () => {
  const accounts = await import('../src/lib/accounts.mjs');
  await store.writeJson(store.dataPath('lehrkraefte.json'), { version: 1, users: [] });
  const a = (await accounts.createAccount(`Lehrkraft A ${crypto.randomInt(1e6)}`, 'lehrkraft')).account;
  const b = (await accounts.createAccount(`Lehrkraft B ${crypto.randomInt(1e6)}`, 'lehrkraft')).account;
  await assert.rejects(klass.adminCreateClass('2b', [crypto.randomUUID()]), status(404));
  let c = await klass.adminCreateClass('2b', [a.id, b.id]);
  assert.deepEqual(c.teacherIds, [a.id, b.id]);
  c = await klass.adminChangeClass(c.id, { addChildren: ['Ada', ' ', 'Ben', 'Cem'] });
  assert.deepEqual(c.children.map((k) => k.name), ['Ada', 'Ben', 'Cem']);
  // Both teachers see the class and the children's notebooks.
  assert.ok((await klass.listClasses(a.id)).some((k) => k.id === c.id));
  assert.ok((await klass.listClasses(b.id)).some((k) => k.id === c.id));
  const child = await klass.childById(c.children[0].id);
  assert.deepEqual(child.teacherIds, [a.id, b.id]);
  const book = await books.createBook(child.id, 'kind', { title: 'Mein Heft' });
  assert.equal(await books.accessibleOwner(b.id, book.book.id), child.id);
  // Shared classes are deleted in the admin area only.
  await assert.rejects(klass.deleteClass(a.id, c.id), status(409));
  c = await klass.adminChangeClass(c.id, { teacherIds: [b.id] });
  assert.ok(!(await klass.listClasses(a.id)).some((k) => k.id === c.id));
  await assert.rejects(books.accessibleOwner(a.id, book.book.id), status(404));
  // Moving keeps notebooks.
  const d = await klass.adminCreateClass('3b', [a.id]);
  await klass.moveChild(child.id, d.id);
  assert.equal((await klass.childById(child.id)).classId, d.id);
  assert.equal(await books.accessibleOwner(a.id, book.book.id), child.id);
  assert.equal((await books.getBook(child.id, book.book.id)).book.title, 'Mein Heft');
  await klass.adminDeleteClass(c.id);
  await klass.adminDeleteClass(d.id);
  await assert.rejects(books.getBook(child.id, book.book.id), status(404));
});

test('Ältere Klassen mit einer Lehrkraft (teacherId) gelten weiter', async () => {
  const id = crypto.randomUUID();
  await store.writeJson(store.dataPath('klassen', `${id}.json`), {
    id, teacherId: teacher, title: 'Alt', archived: false, children: [], images: [], createdAt: new Date().toISOString(),
  });
  const listed = (await klass.listClasses(teacher)).find((k) => k.id === id);
  assert.deepEqual(listed.teacherIds, [teacher]);
  const changed = await klass.changeClass(teacher, id, { title: 'Alt 2' });
  assert.deepEqual(changed.teacherIds, [teacher]);
  const raw = JSON.parse(await fs.readFile(store.dataPath('klassen', `${id}.json`), 'utf8'));
  assert.equal('teacherId' in raw, false);
});

test('Einsammeln: Kinder sehen das Heft nur noch an, Lehrkraft kommentiert, gibt zurück und legt ein Sammelheft an', async () => {
  const c = await newClass('Einsammeln');
  const [ada, ben] = c.children;
  const source = await books.createBook(teacher, 'lehrkraft', { title: 'Lesetagebuch' });
  source.pages[0].elements = [element()];
  await books.savePage(teacher, source.book.id, source.pages[0]);
  const first = await klass.distribute(teacher, c.id, source.book.id, undefined, false, false);
  const second = await klass.distribute(teacher, c.id, source.book.id, [ben.id], false, false);
  assert.equal(first[0].distributionId, first[1].distributionId);
  assert.notEqual(first[0].distributionId, second[0].distributionId);
  const adaBook = first.find((b) => b.ownerId === ada.id);
  let page = (await books.getBook(ada.id, adaBook.id)).pages[0];
  page = await books.savePage(ada.id, adaBook.id, { ...page, elements: [...page.elements, { ...element(), text: 'Ada war hier' }] }, true);

  let list = await klass.distributions(teacher, c.id);
  assert.equal(list.length, 2);
  const group = list.find((d) => d.key === first[0].distributionId);
  assert.deepEqual(group.copies.map((x) => x.childName), ['Ada', 'Ben']);
  assert.deepEqual(group.copies[0].editedPages, [1]);
  assert.deepEqual(group.copies[1].editedPages, []);
  await assert.rejects(klass.distributions(other, c.id), status(404));
  await assert.rejects(klass.collect(other, c.id, group.key, true), status(404));

  list = await klass.collect(teacher, c.id, group.key, true);
  assert.ok(list.find((d) => d.key === group.key).copies.every((x) => x.collected));
  assert.ok(list.find((d) => d.key !== group.key).copies.every((x) => !x.collected), 'andere Austeilung bleibt bei den Kindern');
  await assert.rejects(books.savePage(ada.id, adaBook.id, { ...page, elements: page.elements.slice(0, 1) }, true), status(403));
  await assert.rejects(books.trashBook(ada.id, adaBook.id, true, true), status(403));
  const commented = await books.savePage(ada.id, adaBook.id, { ...page, elements: [...page.elements, { ...element(), text: 'Prima!' }] }, false, teacher);
  assert.equal(commented.lastEditorId, teacher);

  list = await klass.collect(teacher, c.id, group.key, false, [ada.id]);
  const after = list.find((d) => d.key === group.key).copies;
  assert.deepEqual(after.map((x) => x.collected), [false, true]);
  await books.savePage(ada.id, adaBook.id, commented, true);

  const gathered = await klass.gather(teacher, 'lehrkraft', c.id, group.key);
  assert.equal(gathered.book.ownerId, teacher);
  assert.equal(gathered.pages.length, 4);
  assert.equal(gathered.pages[0].elements[0].text, 'Ada');
  assert.ok(gathered.pages[1].elements.some((el) => el.text === 'Ada war hier'));
  assert.equal(gathered.pages[2].elements[0].text, 'Ben');
  assert.equal((await books.getBook(ada.id, adaBook.id)).pages.length, 1, 'Kinderhefte bleiben bei den Kindern');
  await assert.rejects(klass.gather(teacher, 'lehrkraft', c.id, 'heft-unbekannt'), status(404));
});
