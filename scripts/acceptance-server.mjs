// Isolated fixture server: no real school records and no persistent browser data.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
const directory = await fs.mkdtemp(
  path.join(os.tmpdir(), 'grundschulbuch-acceptance-'),
);
process.env.GRUNDSCHULBUCH_DATA_DIR = directory;
process.env.SESSION_SECRET = 'acceptance-only-session-secret'.padEnd(48, 'x');
process.env.BASE_URL = 'http://localhost:3100';
process.env.SCHOOL_END_HOUR = '24';
execFileSync(process.execPath, ['scripts/migrate.mjs'], {
  env: process.env,
  stdio: 'pipe',
});
const { issueOneTimeCode, redeemOneTimeCode } =
  await import('../src/lib/accounts.mjs');
for (const name of ['Frau Beispiel', 'Herr Muster']) {
  const { code } = await issueOneTimeCode(name);
  await redeemOneTimeCode(name, code, '483920');
}
// Stand-in for the school gallery (JSON-API v1 of bilder.gsndk.de) with a token.
const http = await import('node:http');
const { default: sharp } = await import('sharp');
const galleryToken = 'acceptance-gallery-token';
await fs.writeFile(path.join(directory, 'gallery-token'), galleryToken);
const colours = { Apfel: '#e53935', Baum: '#43a047', Sonne: '#fdd835' };
const pictures = Object.fromEntries(
  await Promise.all(
    Object.entries(colours).map(async ([name, background]) => [
      name,
      await sharp({ create: { width: 320, height: 240, channels: 3, background } }).png().toBuffer(),
    ]),
  ),
);
const gallery = http.createServer((request, response) => {
  if (request.headers.authorization !== `Bearer ${galleryToken}`) {
    response.writeHead(401, { 'Content-Type': 'application/json' });
    return response.end('{"error":"unauthorized"}');
  }
  const url = new URL(request.url, 'http://127.0.0.1');
  const media = url.pathname.match(/^\/media\/(thumbnails|display)\/(\w+)\.png$/);
  if (media && pictures[media[2]]) {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    return response.end(pictures[media[2]]);
  }
  if (url.pathname === '/api/v1/images') {
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const items = Object.keys(pictures)
      .filter((name) => name.toLowerCase().includes(q))
      .map((name, i) => ({
        id: i + 1,
        description: `${name} (Testbild)`,
        tags: [name.toLowerCase()],
        style: null,
        width: 320,
        height: 240,
        thumbnail_url: `/media/thumbnails/${name}.png`,
        display_url: `/media/display/${name}.png`,
        license: 'KI-generiert, CC0 1.0',
      }));
    response.writeHead(200, { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify({ items, page: 1, per_page: 30, total: items.length, total_pages: items.length ? 1 : 0 }));
  }
  response.writeHead(404);
  response.end();
});
await new Promise((resolve) => gallery.listen(3199, '127.0.0.1', resolve));
// Stand-in for YouTube: Data API v3 (search, videos), oEmbed and preview pictures.
const preview = await sharp({ create: { width: 320, height: 180, channels: 3, background: '#6d4c41' } }).jpeg().toBuffer();
const youtubeVideos = [
  { id: 'igelvideo01', title: 'Der Igel im Winter &amp; Frühling', channel: 'Sachgeschichten', duration: 'PT3M20S' },
  { id: 'igelvideo02', title: 'Igel bauen ein Nest', channel: 'Tierforscher', duration: 'PT12M5S' },
];
const youtube = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  const send = (status, body) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(body));
  };
  if (url.pathname.startsWith('/youtube/v3/') && url.searchParams.get('key') !== 'AIzaTESTSCHLUESSEL')
    return send(400, { error: { errors: [{ reason: 'keyInvalid' }] } });
  if (url.pathname === '/youtube/v3/search') {
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const hits = q.includes('igel') ? youtubeVideos : [];
    return send(200, {
      items: hits.map((v) => ({ id: { kind: 'youtube#video', videoId: v.id }, snippet: { title: v.title, channelTitle: v.channel, description: '', publishedAt: '2025-01-15T08:00:00Z' } })),
    });
  }
  if (url.pathname === '/youtube/v3/videos') {
    const ids = (url.searchParams.get('id') || '').split(',');
    return send(200, { items: youtubeVideos.filter((v) => ids.includes(v.id)).map((v) => ({ id: v.id, contentDetails: { duration: v.duration }, statistics: { viewCount: '4321' } })) });
  }
  if (url.pathname === '/oembed') {
    const id = new URL(url.searchParams.get('url') || 'http://x').searchParams.get('v');
    const video = youtubeVideos.find((v) => v.id === id);
    return video ? send(200, { title: video.title.replace('&amp;', '&') }) : send(404, {});
  }
  // ARD Mediathek: „erlaubt“ may be embedded, every other video only opens the Mediathek.
  const ard = /^\/page-gateway\/pages\/ard\/item\/([\w-]+)$/.exec(url.pathname);
  if (ard) {
    const open = ard[1].startsWith('Y3JpZERlcmxhdWJ0');
    return send(200, { widgets: [{ title: open ? 'Igel im Herbst' : 'Igel in der Stadt', embeddable: open, image: { src: 'http://127.0.0.1:3198/image-service/images/igel?w={width}' } }] });
  }
  // ZDF: a video page without the ZDF player.
  if (url.pathname.startsWith('/video/')) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    return response.end('<meta property="og:title" content="Igel-Doku | jetzt im ZDF streamen"><meta property="og:image" content="http://127.0.0.1:3198/assets/igel~1920x1080">');
  }
  if (/^\/(vi\/[\w-]{11}\/(mq|hq)default\.jpg|image-service\/images\/igel|assets\/igel~768x432)$/.test(url.pathname)) {
    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
    return response.end(preview);
  }
  response.writeHead(404);
  response.end();
});
await new Promise((resolve) => youtube.listen(3198, '127.0.0.1', resolve));
process.env.YOUTUBE_API_ORIGIN = 'http://127.0.0.1:3198';
process.env.YOUTUBE_IMAGE_ORIGIN = 'http://127.0.0.1:3198';
process.env.YOUTUBE_OEMBED_ORIGIN = 'http://127.0.0.1:3198';
process.env.ARD_API_ORIGIN = 'http://127.0.0.1:3198';
process.env.ZDF_PAGE_ORIGIN = 'http://127.0.0.1:3198';
process.env.GALLERY_ORIGIN = 'http://127.0.0.1:3199';
process.env.GALLERY_TOKEN_FILE = path.join(directory, 'gallery-token');
await fs.cp('public', '.next/standalone/public', { recursive: true });
await fs.cp('.next/static', '.next/standalone/.next/static', {
  recursive: true,
});
const server = spawn(process.execPath, ['.next/standalone/server.js'], {
  env: { ...process.env, PORT: '3100', HOSTNAME: '127.0.0.1' },
  stdio: 'inherit',
});
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  server.kill('SIGTERM');
  gallery.close();
  youtube.close();
  await fs.rm(directory, { recursive: true, force: true });
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
server.on('exit', async (code) => {
  await stop();
  process.exitCode = code || 0;
});
