// Video search (YouTube Data API v3) and details for the dialog
// "Video oder Webseite einfügen". Everything goes through this server: the API
// key set in the admin area never reaches a browser, and devices of children
// do not talk to YouTube before a video is actually started.
import fs from 'node:fs/promises';
import { dataPath, readJson, withLock, writeJson } from './store.mjs';
import { BookError, id, storeImage } from './notebooks.mjs';
import { fetchLimited, SourceError } from './image-sources.mjs';
import { detectVideo, youtubeId } from './video-address.mjs';
export { youtubeId };

// Origins can be replaced for the acceptance tests (stand-in for YouTube).
const API = `${process.env.YOUTUBE_API_ORIGIN || 'https://www.googleapis.com'}/youtube/v3`;
const IMAGES = process.env.YOUTUBE_IMAGE_ORIGIN || 'https://i.ytimg.com';
const OEMBED = process.env.YOUTUBE_OEMBED_ORIGIN || 'https://www.youtube.com';
// Mediatheken (replaceable for the tests as well).
const ARD_API = process.env.ARD_API_ORIGIN || 'https://api.ardmediathek.de';
const ZDF_PAGES = process.env.ZDF_PAGE_ORIGIN || '';
const SETTINGS = () => dataPath('einstellungen', 'youtube.json');
const MAX_JSON = 2 * 1024 * 1024;
/** Searches per account and hour; one search costs 100 of 10,000 daily units. */
export const SEARCHES_PER_HOUR = 30;
/** Same search within this time comes from memory and costs nothing. */
const CACHE_MS = 6 * 3600 * 1000;
const cache = new Map();

export const DURATIONS = ['any', 'short', 'medium', 'long'];
export const ORDERS = ['relevance', 'date', 'viewCount'];
const VIDEO_ID = /^[\w-]{11}$/;

async function stored() {
  return readJson(SETTINGS(), {});
}
/** The key: set in the admin area, otherwise from YOUTUBE_API_KEY_FILE. */
async function apiKey() {
  const settings = await stored();
  if (settings.key) return { key: settings.key, source: 'verwaltung' };
  if (process.env.YOUTUBE_API_KEY_FILE)
    try {
      const key = (await fs.readFile(process.env.YOUTUBE_API_KEY_FILE, 'utf8')).trim();
      if (key) return { key, source: 'datei' };
    } catch {}
  return { key: '', source: null };
}
/** What the admin area shows: never the key itself, only its end. */
export async function youtubeSettings() {
  const settings = await stored();
  const { key, source } = await apiKey();
  return {
    configured: !!key,
    source,
    keyEnd: key ? key.slice(-4) : '',
    childSearch: !!settings.childSearch,
    updatedAt: settings.updatedAt || null,
  };
}
/** Whether the search is available to this user (teachers always, children if allowed). */
export async function searchAvailable(role) {
  const s = await youtubeSettings();
  return s.configured && (role !== 'kind' || s.childSearch);
}

function apiError(json, status) {
  const reason = json?.error?.errors?.[0]?.reason || json?.error?.status || '';
  if (/quota|rateLimit|dailyLimit/i.test(reason))
    return new BookError('Die YouTube-Suche hat ihr Tageskontingent aufgebraucht. Morgen geht es wieder – Adressen lassen sich weiterhin direkt einfügen.', 429);
  if (/keyInvalid|API_KEY_INVALID|badRequest/i.test(reason) || status === 400)
    return new BookError('Der YouTube-Schlüssel ist ungültig. Bitte in der Verwaltung prüfen.', 503);
  if (/accessNotConfigured|SERVICE_DISABLED|forbidden|ipRefererBlocked|PERMISSION_DENIED/i.test(reason) || status === 403)
    return new BookError('Der YouTube-Schlüssel darf die YouTube Data API v3 nicht nutzen. Bitte die API in der Google Cloud Console aktivieren.', 503);
  return new BookError('YouTube antwortet gerade nicht. Bitte später noch einmal versuchen.', 502);
}
/** GET on the YouTube Data API; errors of the API become readable messages. */
async function youtube(path, params, key) {
  const url = new URL(`${API}/${path}`);
  for (const [name, value] of Object.entries({ ...params, key }))
    if (value !== undefined && value !== '') url.searchParams.set(name, String(value));
  let response;
  try {
    response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(8000), headers: { Accept: 'application/json' } });
  } catch {
    throw new BookError('YouTube ist gerade nicht erreichbar. Bitte später noch einmal versuchen.', 502);
  }
  const text = await response.text();
  if (text.length > MAX_JSON) throw new BookError('YouTube hat unerwartet geantwortet.', 502);
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  if (!response.ok) throw apiError(json, response.status);
  if (!json) throw new BookError('YouTube hat unerwartet geantwortet.', 502);
  return json;
}

/**
 * Admin: stores the key (checked with a cheap request first) and whether
 * children with “Internet” may search. An empty key removes it.
 */
export async function setYoutubeSettings(input) {
  return withLock('einstellungen-youtube', async () => {
    const settings = await stored();
    let warning = '';
    if (input.key !== undefined) {
      if (typeof input.key !== 'string' || input.key.length > 200 || /\s/.test(input.key.trim()))
        throw new BookError('Bitte den API-Schlüssel ohne Leerzeichen einfügen.');
      const key = input.key.trim();
      if (key) {
        try {
          await youtube('videos', { part: 'id', id: 'jNQXAC9IVRw' }, key);
        } catch (e) {
          // Without internet the key cannot be checked; it is kept anyway.
          if (e.status !== 502) throw e;
          warning = 'Der Schlüssel wurde gespeichert, konnte aber nicht geprüft werden, weil YouTube nicht erreichbar war.';
        }
        settings.key = key;
      } else delete settings.key;
      cache.clear();
    }
    if (input.childSearch !== undefined) settings.childSearch = !!input.childSearch;
    settings.updatedAt = new Date().toISOString();
    await writeJson(SETTINGS(), settings);
    return { ...(await youtubeSettings()), warning };
  });
}

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
/** The API returns titles with HTML entities (&amp;, &#39;). */
export function plainText(value) {
  return String(value ?? '')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (all, name) => {
      if (name[0] === '#') {
        const code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
        return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : '';
      }
      return entities[name.toLowerCase()] ?? all;
    })
    .trim();
}
/** ISO 8601 duration of the API (PT1H2M3S) in seconds. */
export function durationSeconds(value) {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value || '');
  if (!m) return 0;
  return ((+m[1] || 0) * 24 + (+m[2] || 0)) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0);
}

async function countSearch(owner) {
  await withLock(`videosuche-${id(owner)}`, async () => {
    const file = dataPath('videosuche-zaehler', `${id(owner)}.json`);
    const now = Date.now();
    const record = await readJson(file, { start: now, count: 0 });
    if (now - record.start > 3600000) {
      record.start = now;
      record.count = 0;
    }
    if (record.count >= SEARCHES_PER_HOUR)
      throw new BookError(`Höchstens ${SEARCHES_PER_HOUR} Suchen pro Stunde. Bitte etwas später weitersuchen.`, 429);
    record.count++;
    await writeJson(file, record);
  });
}

/**
 * Searches YouTube for embeddable videos with SafeSearch “strict”, in German
 * first. Results of the same search are kept for some hours.
 */
export async function searchVideos(owner, role, input) {
  const { key } = await apiKey();
  if (!key) throw new BookError('Die Videosuche ist noch nicht eingerichtet. Die Verwaltung kann dafür einen YouTube-Schlüssel hinterlegen.', 503);
  if (role === 'kind' && !(await youtubeSettings()).childSearch)
    throw new BookError('Die Videosuche ist für Kinder nicht freigegeben.', 403);
  const q = typeof input.q === 'string' ? input.q.replace(/\s+/g, ' ').trim() : '';
  if (!q || q.length > 200) throw new BookError('Bitte einen Suchbegriff mit höchstens 200 Zeichen eingeben.');
  const duration = DURATIONS.includes(input.duration) ? input.duration : 'any';
  const order = ORDERS.includes(input.order) ? input.order : 'relevance';
  const pageToken = typeof input.pageToken === 'string' && /^[\w-]{1,100}$/.test(input.pageToken) ? input.pageToken : '';
  const cacheKey = JSON.stringify([q.toLowerCase(), duration, order, pageToken]);
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.result;
  await countSearch(owner);
  const found = await youtube('search', {
    part: 'snippet',
    type: 'video',
    q,
    maxResults: 12,
    safeSearch: 'strict',
    videoEmbeddable: 'true',
    relevanceLanguage: 'de',
    regionCode: 'DE',
    videoDuration: duration,
    order,
    pageToken,
  }, key);
  const ids = (found.items || []).map((item) => item.id?.videoId).filter((v) => VIDEO_ID.test(v || ''));
  const details = ids.length
    ? await youtube('videos', { part: 'contentDetails,statistics', id: ids.join(',') }, key)
    : { items: [] };
  const extra = new Map((details.items || []).map((v) => [v.id, v]));
  const items = (found.items || [])
    .filter((item) => VIDEO_ID.test(item.id?.videoId || ''))
    .map((item) => {
      const more = extra.get(item.id.videoId);
      return {
        id: item.id.videoId,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        title: plainText(item.snippet?.title).slice(0, 300),
        channel: plainText(item.snippet?.channelTitle).slice(0, 120),
        description: plainText(item.snippet?.description).slice(0, 300),
        publishedAt: item.snippet?.publishedAt || null,
        seconds: durationSeconds(more?.contentDetails?.duration),
        views: Number(more?.statistics?.viewCount) || 0,
      };
    });
  const result = { items, nextPageToken: found.nextPageToken || null };
  cache.set(cacheKey, { at: Date.now(), result });
  if (cache.size > 500) cache.delete(cache.keys().next().value);
  return result;
}

async function oembed(url, max = 256 * 1024) {
  try {
    const { buffer } = await fetchLimited(url, { max });
    return JSON.parse(buffer.toString('utf8'));
  } catch {
    return null;
  }
}
const mediathekCache = new Map();
const MEDIATHEK_MS = 3600 * 1000;
const NO_DETAILS = { title: '', image: '', player: '' };

function metaContent(html, property) {
  const tag = new RegExp(`<meta[^>]+(?:property|name)="${property}"[^>]*>`, 'i').exec(html)?.[0] ?? '';
  return plainText(/content="([^"]*)"/i.exec(tag)?.[1] ?? '');
}

/** ARD: title, picture and whether the broadcaster allows the own player in other pages. */
async function ardDetails(videoId) {
  const data = await oembed(`${ARD_API}/page-gateway/pages/ard/item/${encodeURIComponent(videoId)}?embedded=true`, MAX_JSON);
  const widget = Array.isArray(data?.widgets) ? data.widgets[0] : null;
  if (!widget) return NO_DETAILS;
  const src = String(widget.image?.src ?? '').replace('{width}', '640');
  return {
    title: plainText(widget.title || data.title || '').slice(0, 300),
    image: src.startsWith(`${ARD_API}/image-service/`) ? src : '',
    player: widget.embeddable === true ? `https://www.ardmediathek.de/embed/${videoId}` : '',
  };
}

/** ZDF: title, picture and the ZDF player („miniplayer“) named on the video page. */
async function zdfDetails(address) {
  const url = new URL(address);
  if (!['www.zdf.de', 'zdf.de', 'www.zdfheute.de', 'zdfheute.de'].includes(url.hostname)) return NO_DETAILS;
  const origin = ZDF_PAGES || `https://${url.hostname}`;
  // „/play/…“ is the series player; the same path under „/video/“ names the ZDF player.
  const paths = url.pathname.startsWith('/play/') ? [url.pathname.replace(/^\/play\//, '/video/'), url.pathname] : [url.pathname];
  const own = url.pathname.split('/').filter(Boolean).at(-1)?.replace(/\.html$/, '');
  for (const path of paths) {
    let html;
    try {
      html = (await fetchLimited(`${origin}${path}`, { max: 3 * 1024 * 1024 })).buffer.toString('utf8');
    } catch {
      continue;
    }
    const ids = [...html.matchAll(/ngp\.zdf\.de\/miniplayer\/embed\/?\?mediaID=([\w-]{1,200})/g)].map((m) => m[1]);
    // Prefer the video of the address itself over others named on the page.
    const media = ids.find((id) => id === own) ?? ids[0];
    if (!media && path !== paths.at(-1)) continue;
    const image = metaContent(html, 'og:image').replace(/~\d+x\d+/, '~768x432');
    return {
      title: metaContent(html, 'og:title').replace(/\s*[|–-]\s*(jetzt im ZDF streamen|ZDFmediathek|ZDFheute|ZDF)\s*$/i, '').slice(0, 300),
      image: /^https:\/\/www\.(zdf|zdfheute)\.de\/assets\//.test(image) || (ZDF_PAGES && image.startsWith(`${ZDF_PAGES}/assets/`)) ? image : '',
      player: media ? `https://ngp.zdf.de/miniplayer/embed/?mediaID=${media}` : '',
    };
  }
  return NO_DETAILS;
}

/**
 * Title, picture and own player of an ARD or ZDF Mediathek video. Only these
 * players may appear inside a page; without one the video opens the Mediathek.
 */
export async function mediathekDetails(address) {
  const video = detectVideo(address);
  if (video?.kind !== 'ard' && video?.kind !== 'zdf') return NO_DETAILS;
  const key = `${video.kind}:${video.id}:${video.embed ? 'p' : address}`;
  const hit = mediathekCache.get(key);
  if (hit && Date.now() - hit.at < MEDIATHEK_MS) return hit.details;
  const details =
    video.kind === 'ard'
      ? await ardDetails(video.id)
      : video.embed
        ? { ...NO_DETAILS, player: `https://ngp.zdf.de/miniplayer/embed/?mediaID=${video.id}` }
        : await zdfDetails(address);
  mediathekCache.set(key, { at: Date.now(), details });
  if (mediathekCache.size > 300) mediathekCache.delete(mediathekCache.keys().next().value);
  return details;
}

/** Title and preview picture of a video address, fetched by the server. */
export async function videoInfo(address) {
  const yt = youtubeId(address);
  if (yt) {
    const data = await oembed(`${OEMBED}/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${yt}`)}`);
    return { kind: 'youtube', id: yt, title: typeof data?.title === 'string' ? data.title.slice(0, 300) : '', thumb: `/api/internet/vorschau/${yt}`, player: '' };
  }
  let url;
  try {
    url = new URL(address);
  } catch {
    return { kind: null, title: '', thumb: '', player: '' };
  }
  if (/(^|\.)vimeo\.com$/i.test(url.hostname) && /^\/\d+/.test(url.pathname)) {
    const data = await oembed(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url.href)}`);
    return { kind: 'vimeo', title: typeof data?.title === 'string' ? data.title.slice(0, 300) : '', thumb: '', player: '' };
  }
  const video = detectVideo(url.href);
  if (video?.kind === 'ard' || video?.kind === 'zdf') {
    const details = await mediathekDetails(url.href);
    return {
      kind: video.kind,
      title: details.title,
      thumb: details.image ? `/api/internet/vorschau/mediathek?adresse=${encodeURIComponent(url.href)}` : '',
      player: details.player,
    };
  }
  return { kind: null, title: '', thumb: '', player: '' };
}

/** Preview picture of an ARD or ZDF video (only from the broadcaster's picture service). */
export async function mediathekThumbnail(address) {
  const { image } = await mediathekDetails(address);
  if (!image) throw new BookError('Kein Vorschaubild.', 404);
  try {
    return await fetchLimited(image, { max: 3 * 1024 * 1024 });
  } catch (e) {
    throw new BookError('Vorschaubild nicht erreichbar.', e instanceof SourceError && e.status === 404 ? 404 : 502);
  }
}
/** Copies the picture of a Mediathek video into the own media store. */
export async function storeMediathekPoster(owner, address) {
  const { buffer } = await mediathekThumbnail(address);
  return storeImage(owner, buffer);
}

/** Preview picture of a YouTube video (for the dialog and the search results). */
export async function youtubeThumbnail(videoId, size = 'mqdefault') {
  if (!VIDEO_ID.test(videoId || '')) throw new BookError('Unbekanntes Video.', 404);
  try {
    return await fetchLimited(`${IMAGES}/vi/${videoId}/${size === 'hq' ? 'hqdefault' : 'mqdefault'}.jpg`, { max: 2 * 1024 * 1024 });
  } catch (e) {
    throw new BookError(e instanceof SourceError && e.status === 404 ? 'Kein Vorschaubild.' : 'Vorschaubild nicht erreichbar.', e.status || 502);
  }
}
/** Copies the preview picture into the own media store: the page shows it without asking YouTube. */
export async function storeYoutubePoster(owner, videoId) {
  const { buffer } = await youtubeThumbnail(videoId, 'hq');
  return storeImage(owner, buffer);
}
