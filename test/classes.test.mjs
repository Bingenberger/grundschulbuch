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
