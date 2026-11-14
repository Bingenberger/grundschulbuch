// Karte of Lernsachen-Heft: a section of OpenStreetMap with markers and paths,
// on a page in one of the map designs. The reference keeps on the item the
// centre, zoom, design, markers, paths and a picture of the section (`img`);
// markers and paths are drawn over the picture, so only the centre, the zoom
// and the design need a new picture. The picture lies on the school server.
import { mapConfig, mapDesign, mapStart, MAP_W } from '../reference/class-runtime';

export type Marker = { lat: number; lon: number; sym: string; label: string; lx?: number; ly?: number };
export type MapPath = { pts: [number, number][]; label: string; color: string; width: number; dash: boolean; dist: boolean; kind?: string; start?: { label: string; lx?: number; ly?: number }; end?: { label: string; lx?: number; ly?: number }; lx?: number; ly?: number };
export type MapData = { lat: number; lon: number; zoom: number; markers: Marker[]; design: string; paths?: MapPath[]; img?: string };
export type MapDesign = { id: string; label: string; paper: string; title: string; page: () => string; frame: string; frameW: number; tint: string };

const picture = (img: unknown) => (typeof img === 'string' && /^(\/api\/medien\/[\w./-]+|data:image\/)/.test(img) ? img : undefined);
export function karte(raw: unknown): MapData {
  return mapConfig(raw && typeof raw === 'object' ? raw : mapStart(), picture) as MapData;
}
export const designOf = (id: string) => mapDesign(id) as MapDesign;

/** What the picture of the section depends on. */
export const pictureKey = (m: MapData) => `${m.lat.toFixed(6)},${m.lon.toFixed(6)},${m.zoom},${m.design}`;

/** The page of the reference (Gue): title above, the map below, in px of 1400 × 990. */
export function mapLayout(design: string) {
  const d = designOf(design);
  const k = 1300 / ((MAP_W as number) + 2 * d.frameW);
  return { title: { x: 70, y: 46, w: 1260, h: 90, size: 56 }, map: { x: 50, y: 170, w: 1300, h: Math.round((760 + 2 * d.frameW) * k) } };
}
