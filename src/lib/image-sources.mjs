// Image searches in ARASAAC, Wikimedia Commons and the school gallery
// (bilder.gsndk.de, JSON-API v1). Everything is fetched by the server: the
// devices of children never talk to other servers, a private gallery's token
// stays here, and chosen pictures are copied into the own media store.
import fs from 'node:fs/promises';
import { wordVariants, concreteWord, rankPictures, stopWords, compoundVariants } from './reference/karaoke-pictures.mjs';

const TIMEOUT = 8000;
const MAX_IMAGE = 12 * 1024 * 1024;
const MAX_JSON = 2 * 1024 * 1024;
const PER_PAGE = 30;
const AGENT = 'Grundschulbuch/1.0 (Schul-App; Bildsuche)';

export const SOURCES = ['arasaac', 'wikimedia', 'galerie'];

export class SourceError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.status = status;
  }
}

/** Origin of the school gallery, or '' when none is set up. */
export function galleryOrigin() {
  const origin = (process.env.GALLERY_ORIGIN || '').trim().replace(/\/+$/, '');
  try {
    const url = new URL(origin);
    return ['http:', 'https:'].includes(url.protocol) && url.pathname === '/' ? url.origin : '';
  } catch {
    return '';
  }
}

async function galleryHeaders() {
  const file = process.env.GALLERY_TOKEN_FILE;
  if (!file) return {};
  try {
    const token = (await fs.readFile(file, 'utf8')).trim();
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

/** Fetch with time and size limits; redirects are not followed. */
export async function fetchLimited(url, { headers = {}, max = MAX_IMAGE, signal } = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) abort();
  const timer = setTimeout(abort, TIMEOUT);
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': AGENT, ...headers },
      redirect: 'error',
      signal: controller.signal,
    });
    if (response.status === 404) throw new SourceError('Nicht gefunden.', 404);
    if (response.status === 401 || response.status === 403)
      throw new SourceError('Kein Zugriff auf die Bildquelle.', 502);
    if (!response.ok) throw new SourceError(`Die Bildquelle antwortet nicht (HTTP ${response.status}).`);
    if (Number(response.headers.get('content-length') || 0) > max)
      throw new SourceError('Das Bild ist zu groß.', 413);
    const chunks = [];
    let total = 0;
    const reader = response.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > max) {
        controller.abort();
        throw new SourceError('Das Bild ist zu groß.', 413);
      }
      chunks.push(value);
    }
    return { buffer: Buffer.concat(chunks), type: (response.headers.get('content-type') || '').split(';')[0].trim() };
  } catch (e) {
    if (e instanceof SourceError) throw e;
    throw new SourceError('Die Bildquelle ist gerade nicht erreichbar. Bitte später noch einmal versuchen.');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}

async function json(url, headers, signal) {
  const { buffer } = await fetchLimited(url, { headers, max: MAX_JSON, signal });
  try {
    return JSON.parse(buffer.toString('utf8'));
  } catch {
    throw new SourceError('Die Bildquelle hat unerwartet geantwortet.');
  }
}

const ARASAAC_CREDIT = 'Piktogramm: Sergio Palao · ARASAAC (arasaac.org) · CC BY-NC-SA 4.0';

async function arasaac(query, page) {
  let list;
  try {
    list = await json(`https://api.arasaac.org/v1/pictograms/de/search/${encodeURIComponent(query)}`);
  } catch (e) {
    if (e instanceof SourceError && e.status === 404) list = [];
    else throw e;
  }
  const valid = (Array.isArray(list) ? list : []).filter((p) => Number.isInteger(p?._id));
  const items = valid.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((p) => {
    const keyword = p.keywords?.find((k) => typeof k?.keyword === 'string')?.keyword || query;
    return {
      id: String(p._id),
      title: keyword,
      thumb: `https://static.arasaac.org/pictograms/${p._id}/${p._id}_300.png`,
      full: `https://static.arasaac.org/pictograms/${p._id}/${p._id}_500.png`,
      credit: ARASAAC_CREDIT,
      pageUrl: `https://arasaac.org/pictograms/de/${p._id}`,
    };
  });
  return { items, page, more: valid.length > page * PER_PAGE };
}

const plain = (html) =>
  String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

async function wikimedia(query, page) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap|drawing`,
    gsrnamespace: '6',
    gsrlimit: String(PER_PAGE),
    gsroffset: String((page - 1) * PER_PAGE),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size|mime',
    iiurlwidth: '330',
    iiextmetadatafilter: 'Artist|LicenseShortName|AttributionRequired|ObjectName',
    iiextmetadatalanguage: 'de',
    uselang: 'de',
  });
  const data = await json(`https://commons.wikimedia.org/w/api.php?${params}`);
  const pages = (data?.query?.pages || []).slice().sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  const items = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info?.thumburl || !/^image\/(jpeg|png|webp|svg\+xml|tiff)$/.test(info.mime || '')) continue;
    const meta = info.extmetadata || {};
    const title = plain(meta.ObjectName?.value) || String(p.title || '').replace(/^(File|Datei):/i, '').replace(/\.[a-z0-9]{2,5}$/i, '').replace(/_/g, ' ');
    const artist = plain(meta.Artist?.value) || 'unbekannt';
    const license = plain(meta.LicenseShortName?.value) || 'Lizenz siehe Wikimedia Commons';
    // Without tracking parameters; thumbnails come in fixed steps, 1280 px is plenty.
    const bare = (url) => String(url || '').split('?')[0];
    const thumb = bare(info.thumburl);
    const full =
      info.width && info.width <= 1280 && info.mime !== 'image/svg+xml' && info.mime !== 'image/tiff'
        ? bare(info.url)
        : thumb.replace(/\/\d+px-([^/]+)$/, '/1280px-$1');
    items.push({
      id: String(p.pageid),
      title,
      thumb,
      full,
      width: info.width,
      height: info.height,
      credit: `„${title}“ von ${artist} · ${license} · Wikimedia Commons`,
      pageUrl: info.descriptionurl,
    });
  }
  return { items, page, more: Boolean(data?.continue) };
}

async function galerie(query, page) {
  const origin = galleryOrigin();
  if (!origin) throw new SourceError('Die Schulgalerie ist nicht eingerichtet.', 404);
  const params = new URLSearchParams({ page: String(page), per_page: String(PER_PAGE) });
  if (query) params.set('q', query.slice(0, 100));
  const data = await json(`${origin}/api/v1/images?${params}`, await galleryHeaders());
  const media = (path) => (typeof path === 'string' && /^\/media\/(thumbnails|display)\/[\w.-]+$/.test(path) ? origin + path : '');
  const items = (Array.isArray(data?.items) ? data.items : [])
    .map((item) => ({
      id: String(item.id),
      title: String(item.description || (item.tags || []).join(', ') || 'Bild'),
      thumb: media(item.thumbnail_url),
      full: media(item.display_url),
      width: item.width ?? undefined,
      height: item.height ?? undefined,
      // CC0 – no credit needed, but the note is kept for the record.
      license: typeof item.license === 'string' ? item.license : '',
    }))
    .filter((item) => item.thumb && item.full);
  return { items, page, more: page < (data?.total_pages || 0) };
}

/** Normalised search result: items with thumb/full URL, title and credit. */
export async function searchImages(source, query, page = 1) {
  const q = String(query || '').trim().slice(0, 100);
  const n = Math.max(1, Math.min(50, Number.parseInt(page, 10) || 1));
  if (source === 'arasaac') return q ? arasaac(q, n) : { items: [], page: n, more: false };
  if (source === 'wikimedia') return q ? wikimedia(q, n) : { items: [], page: n, more: false };
  if (source === 'galerie') return galerie(q, n);
  throw new SourceError('Unbekannte Bildquelle.', 400);
}

/** Only addresses the searches hand out may be loaded (no open proxy). */
export function allowedImageUrl(source, url) {
  if (typeof url !== 'string' || url.length > 1000 || url.includes('..')) return false;
  if (source === 'arasaac') return /^https:\/\/static\.arasaac\.org\/pictograms\/\d+\/\d+_(300|500)\.png$/.test(url);
  if (source === 'wikimedia')
    return /^https:\/\/(upload|thumb)\.wikimedia\.org\/wikipedia\/commons\/[\w/%.,~!'()+@-]+$/.test(url);
  if (source === 'galerie') {
    const origin = galleryOrigin();
    return !!origin && new RegExp(`^${origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/media/(thumbnails|display)/[\\w.-]+$`).test(url);
  }
  return false;
}

const RASTER = /^image\/(png|jpeg|webp|gif)$/;

/** Loads a preview or a full picture of a source. */
export async function loadImage(source, url) {
  if (!allowedImageUrl(source, url)) throw new SourceError('Diese Bildadresse ist nicht erlaubt.', 400);
  const result = await fetchLimited(url, { headers: source === 'galerie' ? await galleryHeaders() : {} });
  if (!RASTER.test(result.type)) throw new SourceError('Das ist kein unterstütztes Bild.', 415);
  return result;
}

// Karaoke uses the reference's morphology and keyword ranking, rather than the
// first generic search hit. Only public ARASAAC results are cached here.
const karaokeResults = new Map();
let karaokeVocabulary, vocabularyRequest, vocabularyFailedAt = 0;
async function pictureVocabulary() {
  if (karaokeVocabulary) return karaokeVocabulary;
  if (Date.now() - vocabularyFailedAt < 60000) return null;
  if (!vocabularyRequest) vocabularyRequest = json('https://api.arasaac.org/v1/keywords/de').then(data => {
    karaokeVocabulary = new Set((data.words || []).map(word => String(word).trim().toLocaleLowerCase('de-DE')).filter(word => word.length > 1 && word.length <= 30 && !/\s/.test(word)));
    return karaokeVocabulary;
  }).catch(() => { vocabularyFailedAt = Date.now(); vocabularyRequest = null; return null; });
  return vocabularyRequest;
}
export async function findKaraokeImage(word, term = '', signal) {
  const text = String(word || '').trim().slice(0, 80), lower = text.toLocaleLowerCase('de-DE'), hint = String(term || '').trim().slice(0, 80).toLocaleLowerCase('de-DE');
  const controller = new AbortController(), abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true }); if (signal?.aborted) abort();
  const timer = setTimeout(abort, 15000);
  const check = () => { if (controller.signal.aborted) throw new SourceError('Die Bildsuche wurde abgebrochen oder hat zu lange gedauert.'); };
  async function search(query) {
    check(); const cached = karaokeResults.get(query); if (cached) return cached;
    let data;
    try { data = await json(`https://api.arasaac.org/v1/pictograms/de/search/${encodeURIComponent(query)}`, undefined, controller.signal); }
    catch (error) { if (error instanceof SourceError && error.status === 404) data = []; else throw error; }
    const list = (Array.isArray(data) ? data : []).filter(item => Number.isInteger(item?._id));
    if (karaokeResults.size > 3000) karaokeResults.delete(karaokeResults.keys().next().value);
    karaokeResults.set(query, list); return list;
  }
  function result(picture, query) {
    return { id: String(picture._id), title: query, thumb: `https://static.arasaac.org/pictograms/${picture._id}/${picture._id}_300.png`, full: `https://static.arasaac.org/pictograms/${picture._id}/${picture._id}_300.png`, credit: ARASAAC_CREDIT, pageUrl: `https://arasaac.org/pictograms/de/${picture._id}` };
  }
  try {
    check();
    if (hint) {
      const list = await search(hint), match = rankPictures(list, hint, null)[0] || (hint !== lower ? list.find(picture => !picture.violence && !picture.sex) : null);
      if (match) return result(match, hint);
    }
    if (!concreteWord(lower)) return null;
    const noun = text === text.toLocaleUpperCase('de-DE') && text !== lower ? null : /^[A-ZÄÖÜ]/.test(text);
    let variants;
    if (/\s/.test(lower)) variants = [lower];
    else { const vocabulary = await pictureVocabulary(); check(); const all = wordVariants(lower, noun); variants = vocabulary ? [...all.filter(candidate => vocabulary.has(candidate)), ...(noun === false ? [] : compoundVariants(lower, vocabulary))] : all.slice(0, 5); }
    for (const candidate of variants.slice(0, 5)) {
      check(); if (stopWords.has(candidate) || !concreteWord(candidate)) return null;
      const picture = rankPictures(await search(candidate), candidate, noun)[0]; if (picture) return result(picture, candidate);
    }
    return null;
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}
