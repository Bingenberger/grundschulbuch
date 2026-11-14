import { NextResponse } from 'next/server';
import { currentUser, jsonError } from '@/lib/auth';
import { currentChild } from '@/lib/child-auth';
export const dynamic = 'force-dynamic';

// Weather for the date widget (Regal › Zeit of Lernsachen-Heft) from
// Open-Meteo.com (data CC BY 4.0), asked by the school server: the devices of
// the children do not talk to an outside service, and only the place name or
// its rounded coordinates go there – nothing about the teacher or the children.
const FORECAST = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search';

const cache = new Map<string, { at: number; body: unknown }>();
const KEEP = 15 * 60 * 1000;

async function ask(url: string) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < KEEP) return hit.body;
  const response = await fetch(url, { signal: AbortSignal.timeout(10000), headers: { Accept: 'application/json' } });
  if (!response.ok) throw Error(String(response.status));
  const body = await response.json();
  cache.set(url, { at: Date.now(), body });
  if (cache.size > 500) cache.delete(cache.keys().next().value!);
  return body;
}

const coordinate = (value: string | null, limit: number) => {
  const n = Number(value);
  return value !== null && value.trim() !== '' && Number.isFinite(n) && Math.abs(n) <= limit ? n.toFixed(2) : null;
};

/**
 * GET ?art=wetter&latitude=…&longitude=… → { current: { weather_code, is_day } }
 * GET ?art=ort&name=…                     → { results: [{ name, latitude, longitude, admin1, country }] }
 */
export async function GET(request: Request) {
  if (!(await currentUser()) && !(await currentChild())) return jsonError('Bitte anmelden.', 401);
  const params = new URL(request.url).searchParams;
  try {
    if (params.get('art') === 'wetter') {
      const lat = coordinate(params.get('latitude'), 90), lon = coordinate(params.get('longitude'), 180);
      if (!lat || !lon) return jsonError('Ungültiger Ort.', 400);
      const body = (await ask(`${FORECAST}?latitude=${lat}&longitude=${lon}&current=weather_code,is_day&timezone=auto`)) as { current?: { weather_code?: unknown; is_day?: unknown } };
      const code = body.current?.weather_code;
      return NextResponse.json({ current: typeof code === 'number' ? { weather_code: code, is_day: body.current?.is_day === 0 ? 0 : 1 } : null }, { headers: { 'Cache-Control': 'private, max-age=600' } });
    }
    if (params.get('art') === 'ort') {
      const name = (params.get('name') || '').trim().slice(0, 80);
      if (name.length < 2) return jsonError('Bitte einen Ort eingeben.', 400);
      const body = (await ask(`${GEOCODING}?name=${encodeURIComponent(name)}&count=8&language=de&format=json`)) as { results?: Record<string, unknown>[] };
      const results = (body.results ?? [])
        .filter((r) => typeof r.name === 'string' && typeof r.latitude === 'number' && typeof r.longitude === 'number')
        .slice(0, 8)
        .map((r) => ({ name: r.name, latitude: r.latitude, longitude: r.longitude, admin1: typeof r.admin1 === 'string' ? r.admin1 : undefined, country: typeof r.country === 'string' ? r.country : undefined }));
      return NextResponse.json({ results }, { headers: { 'Cache-Control': 'private, max-age=3600' } });
    }
    return jsonError('Unbekannte Anfrage.', 400);
  } catch {
    return jsonError('Das Wetter ist gerade nicht erreichbar.', 502);
  }
}
