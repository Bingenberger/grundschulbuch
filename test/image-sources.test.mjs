import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchImages, allowedImageUrl, loadImage } from '../src/lib/image-sources.mjs';

function answer(body, { status = 200, type = 'application/json' } = {}) {
  const bytes = typeof body === 'string' || Buffer.isBuffer(body) ? Buffer.from(body) : Buffer.from(JSON.stringify(body));
  return new Response(bytes, { status, headers: { 'content-type': type, 'content-length': String(bytes.length) } });
}
function mockFetch(handler) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return handler(String(url), options);
  };
  return calls;
}

test('ARASAAC: Treffer mit Vorschau, großer Fassung und Bildnachweis; „nichts gefunden“ ist kein Fehler', async () => {
  const calls = mockFetch((url) =>
    url.includes('/search/Hund')
      ? answer([{ _id: 2517, keywords: [{ keyword: 'Hund' }] }, { _id: 'x' }, { _id: 7, keywords: [] }])
      : answer('[]', { status: 404 }),
  );
  const result = await searchImages('arasaac', 'Hund');
  assert.equal(result.items.length, 2);
  assert.deepEqual(result.items[0], {
    id: '2517',
    title: 'Hund',
    thumb: 'https://static.arasaac.org/pictograms/2517/2517_300.png',
    full: 'https://static.arasaac.org/pictograms/2517/2517_500.png',
    credit: 'Piktogramm: Sergio Palao · ARASAAC (arasaac.org) · CC BY-NC-SA 4.0',
    pageUrl: 'https://arasaac.org/pictograms/de/2517',
  });
  assert.equal(calls[0].options.redirect, 'error');
  assert.deepEqual((await searchImages('arasaac', 'Quatsch')).items, []);
  assert.deepEqual((await searchImages('arasaac', '  ')).items, []);
});

test('Wikimedia: Lizenz und Urheber im Bildnachweis, 1280-px-Fassung, GIFs werden ausgelassen', async () => {
  mockFetch(() =>
    answer({
      continue: { gsroffset: 30 },
      query: {
        pages: [
          { pageid: 2, index: 2, title: 'File:Katze.gif', imageinfo: [{ mime: 'image/gif', thumburl: 'https://upload.wikimedia.org/a.gif', url: 'x' }] },
          {
            pageid: 1,
            index: 1,
            title: 'File:Rote_Katze.jpg',
            imageinfo: [{
              mime: 'image/jpeg',
              width: 4000,
              height: 3000,
              url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Rote_Katze.jpg',
              thumburl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Rote_Katze.jpg/330px-Rote_Katze.jpg',
              descriptionurl: 'https://commons.wikimedia.org/wiki/File:Rote_Katze.jpg',
              extmetadata: { Artist: { value: '<a href="#">Erika Muster</a>' }, LicenseShortName: { value: 'CC BY-SA 4.0' } },
            }],
          },
        ],
      },
    }),
  );
  const result = await searchImages('wikimedia', 'Katze');
  assert.equal(result.items.length, 1);
  assert.equal(result.more, true);
  const [cat] = result.items;
  assert.equal(cat.title, 'Rote Katze');
  assert.equal(cat.full, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Rote_Katze.jpg/1280px-Rote_Katze.jpg');
  assert.equal(cat.credit, '„Rote Katze“ von Erika Muster · CC BY-SA 4.0 · Wikimedia Commons');
  assert.ok(allowedImageUrl('wikimedia', cat.full) && allowedImageUrl('wikimedia', cat.thumb));
});

test('Schulgalerie: Token wird mitgeschickt, Medienpfade werden zu Adressen der Galerie', async () => {
  process.env.GALLERY_ORIGIN = 'https://bilder.example.org/';
  delete process.env.GALLERY_TOKEN_FILE;
  const calls = mockFetch(() =>
    answer({ items: [{ id: 5, description: 'Apfel', tags: ['apfel'], thumbnail_url: '/media/thumbnails/Apfel_1.webp', display_url: '/media/display/Apfel_1.webp' },
      { id: 6, description: 'böse', thumbnail_url: 'https://evil.example/x.png', display_url: '/media/display/x.webp' }], total_pages: 2 }),
  );
  const result = await searchImages('galerie', 'Apfel', 1);
  assert.match(calls[0].url, /^https:\/\/bilder\.example\.org\/api\/v1\/images\?page=1&per_page=30&q=Apfel$/);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].full, 'https://bilder.example.org/media/display/Apfel_1.webp');
  assert.equal(result.more, true);
  assert.ok(allowedImageUrl('galerie', result.items[0].thumb));
  assert.ok(!allowedImageUrl('galerie', 'https://bilder.example.org/api/v1/images'));
  delete process.env.GALLERY_ORIGIN;
  await assert.rejects(searchImages('galerie', ''), /nicht eingerichtet/);
});

test('Nur Adressen der Suchen werden geladen, nur Rasterbilder werden angenommen', async () => {
  assert.ok(!allowedImageUrl('arasaac', 'https://static.arasaac.org/../etc/passwd'));
  assert.ok(!allowedImageUrl('arasaac', 'http://static.arasaac.org/pictograms/1/1_300.png'));
  assert.ok(!allowedImageUrl('wikimedia', 'https://commons.wikimedia.org/w/api.php'));
  assert.ok(!allowedImageUrl('quatsch', 'https://static.arasaac.org/pictograms/1/1_300.png'));
  mockFetch(() => answer('<svg onload="alert(1)"/>', { type: 'image/svg+xml' }));
  await assert.rejects(loadImage('arasaac', 'https://static.arasaac.org/pictograms/1/1_300.png'), /kein unterstütztes Bild/);
  mockFetch(() => answer(Buffer.alloc(13 * 1024 * 1024), { type: 'image/png' }));
  await assert.rejects(loadImage('arasaac', 'https://static.arasaac.org/pictograms/1/1_500.png'), /zu groß/);
});
