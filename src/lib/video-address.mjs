// Recognises video addresses, the same in the browser and on the server.
const VIDEO_ID = /^[\w-]{11}$/;

/** YouTube video id of an address (watch, youtu.be, shorts, embed, live), or null. */
export function youtubeId(address) {
  let url;
  try {
    url = new URL(address);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m|music)\./, '');
  let candidate = null;
  if (host === 'youtu.be') candidate = url.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    candidate = url.searchParams.get('v');
    const path = /^\/(?:embed|shorts|live|v)\/([^/?#]+)/.exec(url.pathname);
    if (!candidate && path) candidate = path[1];
  }
  return candidate && VIDEO_ID.test(candidate) ? candidate : null;
}

const MEDIA_ID = /^[\w-]{1,200}$/;
const ARD_ID = /^[A-Za-z0-9_-]{16,400}$/;

/**
 * What kind of video an address is: YouTube, Vimeo, ARD or ZDF Mediathek
 * (also zdfheute), a video file, or null for an ordinary web page.
 * For the Mediatheken `embed` tells whether the address is already their own
 * player (the only thing they allow inside other pages).
 */
export function detectVideo(address) {
  let url;
  try {
    url = new URL(address);
  } catch {
    return null;
  }
  const yt = youtubeId(address);
  if (yt) return { kind: 'youtube', id: yt };
  const host = url.hostname.toLowerCase();
  const vimeo = /^\/(?:video\/)?(\d+)/.exec(url.pathname);
  if (/(^|\.)vimeo\.com$/.test(host) && vimeo) return { kind: 'vimeo', id: vimeo[1] };
  if (/(^|\.)ardmediathek\.de$/.test(host)) {
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts.at(-1) ?? '';
    if (['video', 'embed', 'player'].includes(parts[0]) && ARD_ID.test(id))
      return { kind: 'ard', id, embed: parts[0] === 'embed' };
    return null;
  }
  if (/^ngp\.zdf\.de$/.test(host) && url.pathname.startsWith('/miniplayer/embed')) {
    const id = url.searchParams.get('mediaID') ?? '';
    return MEDIA_ID.test(id) ? { kind: 'zdf', id, embed: true } : null;
  }
  if (/(^|\.)(zdf\.de|zdfheute\.de)$/.test(host) && /\/(videos?|play)\//.test(url.pathname)) {
    const id = url.pathname.split('/').filter(Boolean).at(-1)?.replace(/\.html$/, '') ?? '';
    return MEDIA_ID.test(id) ? { kind: 'zdf', id, embed: false } : null;
  }
  if (/\.(mp4|webm|mov|m4v)$/i.test(url.pathname)) return { kind: 'file' };
  return null;
}

/** „Video von YouTube“, „Video aus der ARD Mediathek“ … */
export const VIDEO_SOURCES = { youtube: 'von YouTube', vimeo: 'von Vimeo', ard: 'aus der ARD Mediathek', zdf: 'aus der ZDF-Mediathek', file: '' };
/** Where a Mediathek video opens when it may not play inside the page. */
export const MEDIATHEK_NAMES = { ard: 'ARD Mediathek', zdf: 'ZDF-Mediathek' };

/** Address that plays inside the page (YouTube without cookies, Vimeo, Mediathek player). */
export function playerAddress(address) {
  const video = detectVideo(address);
  if (video?.kind === 'youtube') return `https://www.youtube-nocookie.com/embed/${video.id}`;
  if (video?.kind === 'vimeo') return `https://player.vimeo.com/video/${video.id}`;
  if (video?.kind === 'ard' && video.embed) return `https://www.ardmediathek.de/embed/${video.id}`;
  if (video?.kind === 'zdf' && video.embed) return `https://ngp.zdf.de/miniplayer/embed/?mediaID=${video.id}`;
  return address;
}

/** Player address that starts at once (preview in the dialog). */
export function autoplayAddress(address) {
  const player = playerAddress(address);
  const kind = detectVideo(address)?.kind;
  return kind === 'youtube' || kind === 'vimeo' ? `${player}?autoplay=1` : player;
}

/**
 * Mediathek pages may not be shown inside other pages (ZDF forbids it, ARD
 * shows its whole web site): such a video opens in a new window instead.
 */
export function playsInPage(address) {
  const video = detectVideo(address);
  return !(video && (video.kind === 'ard' || video.kind === 'zdf') && !video.embed);
}

/** Host name without „www.“, e.g. for „Webseite planet-schule.de“. */
export function hostOf(address) {
  try {
    return new URL(address).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** Accepts addresses without https:// as the template does („planet-schule.de“). */
export function webAddress(input) {
  const text = String(input ?? '').trim();
  if (!text) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text.replace(/^\/+/, '')}`);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    if (!url.hostname.includes('.') && url.hostname !== 'localhost') return null;
    return url.href;
  } catch {
    return null;
  }
}
