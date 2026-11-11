import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
const directory = await fs.mkdtemp(
  path.join(os.tmpdir(), 'grundschulbuch-hefte-'),
);
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'test-secret-for-transfer'.padEnd(48, 'x');
const books = await import('../src/lib/notebooks.mjs');
const transfers = await import('../src/lib/transfers.mjs');
const { readJson, dataPath, writeJson } = await import('../src/lib/store.mjs');
after(() => fs.rm(directory, { recursive: true, force: true }));
const alice = crypto.randomUUID(),
  bob = crypto.randomUUID();
const page = () => ({
  id: crypto.randomUUID(),
  revision: 0,
  orientation: 'portrait',
  ruling: 'linie1',
  elements: [],
});
const text = () => ({
  id: crypto.randomUUID(),
  type: 'text',
  x: 15,
  y: 20,
  width: 90,
  height: 20,
  rotation: 0,
  locked: true,
  color: '#123456',
  text: '<script>kein HTML</script>',
  font: 'Andika',
  fontSize: 18,
});
const status = (code) => (e) =>
  e instanceof books.BookError && e.status === code;

test('Regal trennt Eigentümer; fremde Hefte bleiben auch für Admin unzugänglich', async () => {
  const { book } = await books.createBook(alice, 'lehrkraft', {
    title: 'Deutsch',
  });
  assert.equal(
    (await books.listBooks(alice)).some((b) => b.id === book.id),
    true,
  );
  assert.equal((await books.listBooks(bob)).length, 0);
  await assert.rejects(books.getBook(bob, book.id), status(404));
  await assert.rejects(
    books.updateBook(bob, book.id, { revision: 0, title: 'Fremd' }),
    status(404),
  );
  await assert.rejects(
    books.savePage(bob, book.id, { ...page(), id: book.pageIds[0] }),
    status(404),
  );
  await assert.rejects(books.deleteBook(bob, book.id), status(404));
  await assert.rejects(books.getBook(alice, '../../etc'), status(400));
});

test('Seiten werden einzeln gespeichert, gesperrte Elemente bleiben erhalten', async () => {
  const p1 = page(),
    p2 = page();
  p1.elements.push(text());
  const created = await books.createBook(alice, 'lehrkraft', {
    title: 'Mathe',
    pages: [p1, p2],
  });
  const [a, b] = created.pages;
  await Promise.all([
    books.savePage(alice, created.book.id, { ...a, ruling: 'karo5' }),
    books.savePage(alice, created.book.id, { ...b, ruling: 'punkte' }),
  ]);
  const saved = await books.getBook(alice, created.book.id);
  assert.deepEqual(
    saved.pages.map((p) => p.ruling),
    ['karo5', 'punkte'],
  );
  assert.equal(saved.pages[0].elements[0].locked, true);
  await assert.rejects(books.savePage(alice, created.book.id, a), status(409));
  assert.equal(
    (await books.getBook(alice, created.book.id)).pages[0].ruling,
    'karo5',
  );
});

test('Nur ein konkurrierender Schreiber derselben Seitenversion gewinnt', async () => {
  const { book, pages } = await books.createBook(alice, 'admin', {
    title: 'Gleichzeitig',
  });
  const result = await Promise.allSettled([
    books.savePage(alice, book.id, { ...pages[0], ruling: 'linie2' }),
    books.savePage(alice, book.id, { ...pages[0], ruling: 'linie3' }),
  ]);
  assert.equal(result.filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal(
    result.filter((r) => r.status === 'rejected' && r.reason.status === 409)
      .length,
    1,
  );
});

test('Seiten einfügen, umsortieren und entfernen; mindestens eine Seite bleibt', async () => {
  const { book } = await books.createBook(alice, 'lehrkraft', {
    title: 'Seiten',
  });
  const added = await books.addPage(alice, book.id, page(), book.pageIds[0]);
  const reordered = await books.updateBook(alice, book.id, {
    revision: added.book.revision,
    pageIds: [...added.book.pageIds].reverse(),
  });
  assert.equal(reordered.pageIds[0], added.page.id);
  await assert.rejects(
    books.updateBook(alice, book.id, { revision: 0, title: 'Veraltet' }),
    status(409),
  );
  await assert.rejects(
    books.updateBook(alice, book.id, {
      revision: reordered.revision,
      pageIds: [],
    }),
    status(400),
  );
  await assert.rejects(
    books.updateBook(alice, book.id, {
      revision: reordered.revision,
      pageIds: [crypto.randomUUID()],
    }),
    status(400),
  );
  const reduced = await books.updateBook(alice, book.id, {
    revision: reordered.revision,
    pageIds: [added.page.id],
  });
  assert.equal(reduced.pageIds.length, 1);
});

test('Validierung weist Data-URLs, Fremdadressen, ungültige Geometrie und doppelte IDs zurück', () => {
  const p = page();
  const el = text();
  assert.throws(
    () => books.validatePage({ ...p, elements: [{ ...el, x: Infinity }] }),
    status(400),
  );
  assert.throws(
    () => books.validatePage({ ...p, elements: [el, el] }),
    status(400),
  );
  for (const src of [
    'data:image/png;base64,a',
    'https://fremd.de/bild.png',
    '/api/medien/../../secret',
  ]) {
    assert.throws(
      () =>
        books.validatePage({ ...p, elements: [{ ...el, type: 'image', src }] }),
      status(400),
    );
  }
  for (const ruling of [
    'blanko',
    'linie1',
    'linie2',
    'linie3',
    'linie4',
    'karo5',
    'karo10',
    'rechnen',
    'punkte',
    'noten',
    'bildzeilen',
  ])
    assert.equal(books.validatePage({ ...p, ruling }).ruling, ruling);
});

test('Vorlagen sind eigene Kopien und bleiben zwischen Lehrkräften getrennt', async () => {
  const p = page();
  const template = await books.saveTemplate(alice, {
    title: 'Meine Vorlage',
    page: p,
  });
  assert.ok(
    (await books.listTemplates(alice)).some((t) => t.id === template.id),
  );
  assert.equal((await books.listTemplates(bob)).length, 0);
  await books.removeTemplate(bob, template.id);
  assert.ok(
    (await books.listTemplates(alice)).some((t) => t.id === template.id),
  );
  await books.removeTemplate(alice, template.id);
  assert.equal(
    (await books.listTemplates(alice)).some((t) => t.id === template.id),
    false,
  );
});

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=',
  'base64',
);
test('Medien sind dedupliziert, aber nur für berechtigte Eigentümer lesbar', async () => {
  const first = await books.storeImage(alice, png);
  const again = await books.storeImage(alice, png);
  assert.equal(first.src, again.src);
  const name = first.src.split('/').pop();
  assert.ok((await books.readImage(alice, name)).length);
  await assert.rejects(books.readImage(bob, name), status(403));
  await books.storeImage(bob, png);
  assert.ok(await books.readImage(bob, name));
  const other = crypto.randomUUID();
  await assert.rejects(
    books.createBook(other, 'lehrkraft', {
      title: 'Bildklau',
      pages: [
        { ...page(), elements: [{ ...text(), type: 'image', src: first.src }] },
      ],
    }),
    status(403),
  );
  await assert.rejects(
    books.storeImage(alice, Buffer.from('<svg></svg>')),
    status(400),
  );
  assert.ok(
    (await readJson(dataPath('medien', 'rechte', `${alice}.json`))).includes(
      name,
    ),
  );
});

test('Smartphone-Links sind befristet und nur die Lehrkraft kann die Liste lesen', async () => {
  const { token, expires } = await transfers.createTransfer(alice);
  assert.ok(expires > Date.now());
  await transfers.transferUpload(token, png);
  const statusResult = await transfers.transferStatus(token, alice);
  assert.equal(statusResult.images.length, 1);
  await assert.rejects(transfers.transferStatus(token, bob), status(404));
  const { keyedHash } = await import('../src/lib/sessions.mjs');
  await writeJson(
    dataPath('transfers', `${keyedHash('transfer', token)}.json`),
    { ...statusResult, expires: Date.now() - 1 },
  );
  await assert.rejects(transfers.transferUpload(token, png), status(404));
  await assert.rejects(transfers.transferStatus('../code'), status(404));
});

test('Links zeigen auf Internetseiten oder Heftseiten und wandern beim Kopieren mit', async () => {
  const linked = (link) => ({ ...page(), elements: [{ ...text(), link }] });
  assert.deepEqual(books.validatePage(linked({ kind: 'url', url: 'https://example.org/a b' })).elements[0].link, { kind: 'url', url: 'https://example.org/a%20b' });
  for (const bad of [{ kind: 'url', url: 'javascript:alert(1)' }, { kind: 'url', url: 'ftp://example.org' }, { kind: 'page', pageId: '../x' }, { kind: 'mail' }, 'https://example.org'])
    assert.throws(() => books.validatePage(linked(bad)), status(400));
  // Copying a notebook gives pages new ids; page links must follow them.
  const first = { ...page(), id: crypto.randomUUID() }, second = { ...page(), id: crypto.randomUUID() };
  first.elements = [{ ...text(), link: { kind: 'page', pageId: second.id } }];
  second.elements = [{ ...text(), link: { kind: 'page', pageId: crypto.randomUUID() } }];
  const copy = await books.createBook(alice, 'lehrkraft', { title: 'Mit Links', pages: [first, second] });
  assert.notEqual(copy.pages[1].id, second.id);
  assert.deepEqual(copy.pages[0].elements[0].link, { kind: 'page', pageId: copy.pages[1].id });
  // Links to pages outside the copied notebook stay unchanged.
  assert.equal(copy.pages[1].elements[0].link.pageId, second.elements[0].link.pageId);
});
