import { test, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'grundschulbuch-videos-'));
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'video-test-secret'.padEnd(48, 'x');
delete process.env.YOUTUBE_API_KEY_FILE;
const videos = await import('../src/lib/video-search.mjs');
const address = await import('../src/lib/video-address.mjs');
const books = await import('../src/lib/notebooks.mjs');
const store = await import('../src/lib/store.mjs');
const realFetch = globalThis.fetch;
after(async () => {
  globalThis.fetch = realFetch;
  await fs.rm(directory, { recursive: true, force: true });
});
/** Stand-in for the YouTube Data API: records requests, answers by path. */
let calls = [];
function fakeYoutube(handler) {
  calls = [];
  globalThis.fetch = async (input) => {
    const url = new URL(String(input));
    calls.push(url);
    const [status, body] = handler(url);
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  };
}
const status = (code) => (e) => e instanceof books.BookError && e.status === code;
beforeEach(() => {
  globalThis.fetch = realFetch;
});

test('Adressen: YouTube (auch Shorts und youtu.be), Vimeo, ZDF, Videodateien und Webseiten ohne https://', () => {
  assert.equal(address.youtubeId('https://www.youtube.com/watch?v=abcdefghijk&t=3'), 'abcdefghijk');
  assert.equal(address.youtubeId('https://youtu.be/abcdefghijk'), 'abcdefghijk');
  assert.equal(address.youtubeId('https://youtube.com/shorts/abcdefghijk'), 'abcdefghijk');
  assert.equal(address.youtubeId('https://www.youtube.com/watch?v=zu-kurz'), null);
  assert.deepEqual(address.detectVideo('https://vimeo.com/76979871'), { kind: 'vimeo', id: '76979871' });
  assert.equal(address.detectVideo('https://www.zdf.de/kinder/logo/videos/logo-nachrichten-100.html')?.kind, 'zdf');
  assert.equal(address.detectVideo('https://www.zdf.de/kinder/logo'), null);
  assert.equal(address.detectVideo('https://www.ardmediathek.de/'), null);
  assert.equal(address.detectVideo('https://example.org/film.mp4')?.kind, 'file');
  assert.equal(address.detectVideo('https://www.planet-schule.de/'), null);
  assert.equal(address.playerAddress('https://youtu.be/abcdefghijk'), 'https://www.youtube-nocookie.com/embed/abcdefghijk');
  assert.equal(address.webAddress('planet-schule.de'), 'https://planet-schule.de/');
  assert.equal(address.webAddress('javascript:alert(1)'), null);
  assert.equal(address.webAddress('kein text'), null);
  assert.equal(address.hostOf('https://www.blinde-kuh.de/x'), 'blinde-kuh.de');
});

test('Mediatheken: nur der eigene Player von ARD und ZDF spielt im Heft, sonst öffnet sich die Mediathek', () => {
  const ardId = 'Y3JpZDovL21kci5kZS9iZWl0cmFnL2Ntcy81ZGZh';
  const ard = `https://www.ardmediathek.de/video/heute-im-osten/akw-in-gefahr/mdr/${ardId}`;
  assert.deepEqual(address.detectVideo(ard), { kind: 'ard', id: ardId, embed: false });
  assert.equal(address.playsInPage(ard), false);
  const ardPlayer = `https://www.ardmediathek.de/embed/${ardId}`;
  assert.deepEqual(address.detectVideo(ardPlayer), { kind: 'ard', id: ardId, embed: true });
  assert.equal(address.playsInPage(ardPlayer), true);
  assert.equal(address.playerAddress(ardPlayer), ardPlayer);
  const zdf = 'https://www.zdf.de/video/dokus/frontal-die-doku-100/inside-deutsche-bank-106';
  assert.deepEqual(address.detectVideo(zdf), { kind: 'zdf', id: 'inside-deutsche-bank-106', embed: false });
  assert.equal(address.playsInPage(zdf), false);
  assert.deepEqual(address.detectVideo('https://www.zdf.de/play/reportagen/purplus-100/aufklaerung-was-geht-da-unten-100'), { kind: 'zdf', id: 'aufklaerung-was-geht-da-unten-100', embed: false });
  const zdfPlayer = 'https://ngp.zdf.de/miniplayer/embed/?mediaID=inside-deutsche-bank-106';
  assert.equal(address.playsInPage(zdfPlayer), true);
  assert.equal(address.autoplayAddress(zdfPlayer), zdfPlayer);
  assert.equal(address.autoplayAddress('https://youtu.be/abcdefghijk'), 'https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=1');
  assert.equal(address.playsInPage('https://youtu.be/abcdefghijk'), true);
  assert.equal(address.playsInPage('https://www.planet-schule.de/'), true);
});

test('Mediatheken: Titel, Bild und Player kommen vom Server, ARD nur wenn Einbetten erlaubt ist', async () => {
  const ardId = 'Y3JpZDovL21kci5kZS9lcmxhdWJ0';
  const closedId = 'Y3JpZDovL3dkci5kZS9nZXNwZXJydA';
  const zdfPage = `<html><head><meta property="og:title" content="Igel im Winter | jetzt im ZDF streamen"/>
    <meta property="og:image" content="https://www.zdf.de/assets/igel-100~1920x1080?cb=1"/></head>
    <script type="application/ld+json">{"embedUrl":"https://ngp.zdf.de/miniplayer/embed?mediaID=igel-im-winter-100"}</script></html>`;
  calls = [];
  globalThis.fetch = async (input) => {
    const url = new URL(String(input));
    calls.push(url);
    if (url.hostname === 'api.ardmediathek.de') {
      const open = url.pathname.endsWith(ardId);
      return Response.json({ title: 'Seite', widgets: [{ title: open ? 'Igel &amp; Co.' : 'Gesperrt', embeddable: open, image: { src: 'https://api.ardmediathek.de/image-service/images/urn:ard:image:1?w={width}' } }] });
    }
    // „/play/“ pages name no player; the same path under „/video/“ does.
    if (url.hostname === 'www.zdf.de' && url.pathname.startsWith('/video/'))
      return new Response(zdfPage.replaceAll('igel-im-winter-100', url.pathname.split('/').at(-1)), { headers: { 'Content-Type': 'text/html' } });
    return new Response('', { status: 404 });
  };
  const open = await videos.videoInfo(`https://www.ardmediathek.de/video/x/igel/mdr/${ardId}`);
  assert.equal(open.kind, 'ard');
  assert.equal(open.title, 'Igel & Co.');
  assert.equal(open.player, `https://www.ardmediathek.de/embed/${ardId}`);
  assert.match(open.thumb, /^\/api\/internet\/vorschau\/mediathek\?adresse=/);
  assert.equal(calls.at(-1).href, `https://api.ardmediathek.de/page-gateway/pages/ard/item/${ardId}?embedded=true`);
  const closed = await videos.videoInfo(`https://www.ardmediathek.de/video/x/y/wdr/${closedId}`);
  assert.equal(closed.player, '');
  assert.equal((await videos.mediathekDetails(`https://www.ardmediathek.de/video/x/y/wdr/${closedId}`)).image, 'https://api.ardmediathek.de/image-service/images/urn:ard:image:1?w=640');

  const zdf = await videos.videoInfo('https://www.zdf.de/video/dokus/igel-100/igel-im-winter-100?x=1');
  assert.equal(zdf.title, 'Igel im Winter');
  assert.equal(zdf.player, 'https://ngp.zdf.de/miniplayer/embed/?mediaID=igel-im-winter-100');
  assert.equal((await videos.mediathekDetails('https://www.zdf.de/video/dokus/igel-100/igel-im-winter-100')).image, 'https://www.zdf.de/assets/igel-100~768x432?cb=1');
  const play = await videos.videoInfo('https://www.zdf.de/play/reportagen/purplus-100/aufklaerung-was-geht-da-unten-100');
  assert.equal(play.player, 'https://ngp.zdf.de/miniplayer/embed/?mediaID=aufklaerung-was-geht-da-unten-100');
  assert.equal(calls.at(-1).pathname, '/video/reportagen/purplus-100/aufklaerung-was-geht-da-unten-100');
  // The server only asks the broadcasters' own addresses.
  assert.ok(calls.every((url) => ['api.ardmediathek.de', 'www.zdf.de'].includes(url.hostname)));
  assert.equal((await videos.videoInfo('https://ngp.zdf.de/miniplayer/embed/?mediaID=igel-im-winter-100')).player, 'https://ngp.zdf.de/miniplayer/embed/?mediaID=igel-im-winter-100');
});

test('Verwaltung: Schlüssel wird geprüft, nie herausgegeben und lässt sich entfernen', async () => {
  assert.equal((await videos.youtubeSettings()).configured, false);
  fakeYoutube(() => [400, { error: { errors: [{ reason: 'keyInvalid' }] } }]);
  await assert.rejects(videos.setYoutubeSettings({ key: 'AIzaFALSCH' }), status(503));
  assert.equal((await videos.youtubeSettings()).configured, false);
  await assert.rejects(videos.setYoutubeSettings({ key: 'mit leerzeichen' }), status(400));

  fakeYoutube(() => [200, { items: [] }]);
  const saved = await videos.setYoutubeSettings({ key: ' AIzaRICHTIG1234 ' });
  assert.equal(calls[0].pathname, '/youtube/v3/videos');
  assert.equal(calls[0].searchParams.get('key'), 'AIzaRICHTIG1234');
  assert.equal(saved.configured, true);
  assert.equal(saved.keyEnd, '1234');
  assert.equal(JSON.stringify(saved).includes('AIzaRICHTIG'), false, 'der Schlüssel verlässt den Server nicht');
  assert.equal(await videos.searchAvailable('lehrkraft'), true);
  assert.equal(await videos.searchAvailable('kind'), false);
  await videos.setYoutubeSettings({ childSearch: true });
  assert.equal(await videos.searchAvailable('kind'), true);
  await videos.setYoutubeSettings({ childSearch: false });

  // Without internet the key is kept with a warning.
  globalThis.fetch = async () => {
    throw new TypeError('offline');
  };
  const offline = await videos.setYoutubeSettings({ key: 'AIzaOFFLINE9999' });
  assert.equal(offline.keyEnd, '9999');
  assert.match(offline.warning, /nicht geprüft/);
  const removed = await videos.setYoutubeSettings({ key: '' });
  assert.equal(removed.configured, false);
  await assert.rejects(videos.searchVideos(crypto.randomUUID(), 'lehrkraft', { q: 'Igel' }), status(503));
});

test('Suche: SafeSearch streng, nur einbettbare Videos, Länge und Text lesbar, Zwischenspeicher und Grenzen', async () => {
  fakeYoutube(() => [200, { items: [] }]);
  await videos.setYoutubeSettings({ key: 'AIzaSUCHE0000' });
  fakeYoutube((url) =>
    url.pathname.endsWith('/search')
      ? [200, {
          nextPageToken: 'CAwQAA',
          items: [
            { id: { videoId: 'abcdefghijk' }, snippet: { title: 'Igel &amp; Co: Wo schl&auml;ft der Igel?', channelTitle: 'Sachgeschichten &#39;Maus&#39;', description: 'Kurz', publishedAt: '2024-03-01T10:00:00Z' } },
            { id: { channelId: 'kein-video' }, snippet: { title: 'Kanal' } },
          ],
        }]
      : [200, { items: [{ id: 'abcdefghijk', contentDetails: { duration: 'PT1H2M5S' }, statistics: { viewCount: '1234' } }] }],
  );
  const owner = crypto.randomUUID();
  const result = await videos.searchVideos(owner, 'lehrkraft', { q: '  Igel  im Winter ', duration: 'short', order: 'date' });
  const search = calls.find((u) => u.pathname.endsWith('/search'));
  assert.equal(search.searchParams.get('safeSearch'), 'strict');
  assert.equal(search.searchParams.get('videoEmbeddable'), 'true');
  assert.equal(search.searchParams.get('type'), 'video');
  assert.equal(search.searchParams.get('q'), 'Igel im Winter');
  assert.equal(search.searchParams.get('videoDuration'), 'short');
  assert.equal(search.searchParams.get('order'), 'date');
  assert.equal(result.items.length, 1);
  assert.deepEqual(
    { title: result.items[0].title, channel: result.items[0].channel, seconds: result.items[0].seconds, views: result.items[0].views, url: result.items[0].url },
    { title: 'Igel & Co: Wo schl&auml;ft der Igel?', channel: "Sachgeschichten 'Maus'", seconds: 3725, views: 1234, url: 'https://www.youtube.com/watch?v=abcdefghijk' },
  );
  assert.equal(result.nextPageToken, 'CAwQAA');

  calls = [];
  await videos.searchVideos(owner, 'lehrkraft', { q: 'igel im winter', duration: 'short', order: 'date' });
  assert.equal(calls.length, 0, 'gleiche Suche kommt aus dem Zwischenspeicher');

  await assert.rejects(videos.searchVideos(owner, 'kind', { q: 'Igel' }), status(403));
  await assert.rejects(videos.searchVideos(owner, 'lehrkraft', { q: '' }), status(400));

  fakeYoutube(() => [403, { error: { errors: [{ reason: 'quotaExceeded' }] } }]);
  await assert.rejects(videos.searchVideos(owner, 'lehrkraft', { q: 'Kontingent' }), status(429));

  await store.writeJson(store.dataPath('videosuche-zaehler', `${owner}.json`), { start: Date.now(), count: videos.SEARCHES_PER_HOUR });
  await assert.rejects(videos.searchVideos(owner, 'lehrkraft', { q: 'noch eine' }), status(429));
});

test('Hilfen: Dauer und HTML-Zeichen aus der API', () => {
  assert.equal(videos.durationSeconds('PT4M13S'), 253);
  assert.equal(videos.durationSeconds('P1DT1S'), 86401);
  assert.equal(videos.durationSeconds('kaputt'), 0);
  assert.equal(videos.plainText('Tom &amp; Jerry &#x1F600; &quot;hi&quot;'), 'Tom & Jerry 😀 "hi"');
});

test('Vorschaubild eines Videos: nur eigene Medien, nur bei Videos', () => {
  const base = { id: crypto.randomUUID(), type: 'embed', x: 0, y: 0, width: 160, height: 90, rotation: 0, locked: false, url: 'https://youtu.be/abcdefghijk', embedKind: 'video', alt: 'Igel', color: '#253c42' };
  const page = (el) => ({ id: crypto.randomUUID(), revision: 0, orientation: 'portrait', ruling: 'blanko', elements: [el] });
  const poster = `/api/medien/${'a'.repeat(64)}.webp`;
  assert.equal(books.validatePage(page({ ...base, poster })).elements[0].poster, poster);
  assert.equal('poster' in books.validatePage(page(base)).elements[0], false);
  assert.throws(() => books.validatePage(page({ ...base, poster: 'https://i.ytimg.com/vi/x/hqdefault.jpg' })), /Vorschaubild/);
  assert.throws(() => books.validatePage(page({ ...base, embedKind: 'link', poster })), /Vorschaubild/);
});
