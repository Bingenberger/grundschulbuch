import { NextResponse } from 'next/server';
import { currentUser, jsonError } from '@/lib/auth';
import { currentChild } from '@/lib/child-auth';
export const dynamic = 'force-dynamic';

// Map pictures (tiles) and the address search for the map of Lernsachen-Heft,
// asked by the school server: the devices of the children do not talk to an
// outside service. Tiles come from the German OpenStreetMap server
// (tile.openstreetmap.de, FOSSGIS e. V.) or, as in the reference, from
// tile.openstreetmap.org; the search from Nominatim (OpenStreetMap Foundation).
// Only the tile numbers or the search text go there – nothing about the
// teacher or the children. Map data © OpenStreetMap contributors (ODbL).
const AGENT = 'Grundschulbuch (Lernplattform einer Grundschule; Kartenausschnitte für Arbeitshefte)';
const TILES: Record<string, string> = { de: 'https://tile.openstreetmap.de', org: 'https://tile.openstreetmap.org' };
const SEARCH = 'https://nominatim.openstreetmap.org/search';

type Tile = { at: number; body: ArrayBuffer; type: string };
const tiles = new Map<string, Tile>();
const KEEP_TILE = 7 * 24 * 3600 * 1000;
const searches = new Map<string, { at: number; body: unknown }>();
let lastSearch = 0;

async function tile(source: string, z: number, x: number, y: number) {
  const key = `${source}/${z}/${x}/${y}`;
  const hit = tiles.get(key);
  if (hit && Date.now() - hit.at < KEEP_TILE) {
    tiles.delete(key); tiles.set(key, hit); // most recently used last
    return hit;
  }
  const response = await fetch(`${TILES[source]}/${z}/${x}/${y}.png`, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': AGENT, Accept: 'image/png' } });
  if (!response.ok) throw Error(String(response.status));
  const found = { at: Date.now(), body: await response.arrayBuffer(), type: response.headers.get('content-type') || 'image/png' };
  tiles.set(key, found);
  while (tiles.size > 3000) tiles.delete(tiles.keys().next().value!);
  return found;
}

async function search(text: string) {
  const hit = searches.get(text);
  if (hit && Date.now() - hit.at < 24 * 3600 * 1000) return hit.body;
  // Nominatim allows one request per second.
  const wait = lastSearch + 1100 - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastSearch = Date.now();
  const response = await fetch(`${SEARCH}?format=jsonv2&limit=5&accept-language=de&q=${encodeURIComponent(text)}`, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': AGENT, Accept: 'application/json' } });
  if (!response.ok) throw Error(String(response.status));
  const list = (await response.json()) as Record<string, unknown>[];
  const body = list.flatMap((r) => (r.lat && r.lon ? [{ display_name: typeof r.display_name === 'string' ? r.display_name : '', lat: String(r.lat), lon: String(r.lon) }] : []));
  searches.set(text, { at: Date.now(), body });
  if (searches.size > 500) searches.delete(searches.keys().next().value!);
  return body;
}

const int = (v: string | null) => (v !== null && /^\d{1,7}$/.test(v) ? Number(v) : NaN);

/**
 * GET ?quelle=de|org&z=…&x=…&y=… → the tile (PNG)
 * GET ?suche=…                   → [{ display_name, lat, lon }]
 */
export async function GET(request: Request) {
  if (!(await currentUser()) && !(await currentChild())) return jsonError('Bitte anmelden.', 401);
  const params = new URL(request.url).searchParams;
  try {
    if (params.has('suche')) {
      const text = (params.get('suche') || '').trim().slice(0, 120);
      if (text.length < 2) return jsonError('Bitte eine Adresse oder einen Ort eingeben.', 400);
      return NextResponse.json(await search(text), { headers: { 'Cache-Control': 'private, max-age=3600' } });
    }
    const source = params.get('quelle') === 'org' ? 'org' : 'de';
    const z = int(params.get('z')), x = int(params.get('x')), y = int(params.get('y'));
    if (!(z >= 0 && z <= 19) || !(x >= 0 && x < 2 ** z) || !(y >= 0 && y < 2 ** z)) return jsonError('Ungültige Kachel.', 400);
    const found = await tile(source, z, x, y);
    return new NextResponse(new Uint8Array(found.body), { headers: { 'Content-Type': found.type, 'Cache-Control': 'private, max-age=604800', 'Content-Security-Policy': "default-src 'none'" } });
  } catch {
    return jsonError('Die Karte ist gerade nicht erreichbar.', 502);
  }
}
