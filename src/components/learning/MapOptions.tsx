/* eslint-disable @next/next/no-img-element -- Map tiles and symbols. */
'use client';
// The editor of the Karte, after the reference's map dialog: search an
// address, move and zoom the map, tools Mitte setzen, Markierung setzen, Weg
// zeichnen and Messen, the design, markers (label, symbol) and paths (label,
// kind, start/end, colour, width, dashed, distance). The geometry, the marks
// and the tiles are the reference's own (reference/class-runtime.ts); tiles
// and the search go through the school server.
import { useLayoutEffect, useRef, useState } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { designOf, karte, type MapData, type MapPath, type Marker } from '@/lib/learning/karte';
import { distance, distanceText, fromView, fromWorld, labelBoxes, MAP_DESIGNS, MAP_SYMBOLS, MAP_W, mapMarks, mapSymbol, mapTiles, PATH_COLORS, PATH_KINDS, pathLength, searchAddress, tileUrl, toView, toWorld } from '@/lib/reference/class-runtime';
import { Toggle } from '../sheets/SheetParts';

const W = MAP_W as number, H = 760;
type Tool = 'none' | 'center' | 'mark' | 'path' | 'measure';
type Point = [number, number];
const TOOLS: [Tool, string][] = [['center', 'Mitte setzen'], ['mark', 'Markierung setzen'], ['path', 'Weg zeichnen'], ['measure', 'Messen']];
const symbols = MAP_SYMBOLS as { id: string; label: string; color: string }[];
const kinds = PATH_KINDS as { id: string; label: string }[];
const colors = PATH_COLORS as string[];
const designs = MAP_DESIGNS as { id: string; label: string; paper: string; frame: string }[];
type Props = { value: unknown; isNew: boolean; onChange: (v: JsonValue) => void };

export default function MapOptions({ value, isNew, onChange }: Props) {
  // The map being edited stays here (a path being drawn has only one point,
  // which the cleaned map would drop); every change also goes to the settings.
  const [m, setM] = useState<MapData>(() => karte(value));
  const latest = useRef(m);
  const set = (next: Partial<MapData>) => {
    const v = { ...latest.current, ...next };
    latest.current = v;
    setM(v);
    onChange(v as unknown as JsonValue);
  };
  const setMarkers = (f: (l: Marker[]) => Marker[]) => set({ markers: f(latest.current.markers) });
  const setPaths = (f: (l: MapPath[]) => MapPath[]) => set({ paths: f(latest.current.paths ?? []) });
  const paths = m.paths ?? [];

  const [tool, setTool] = useState<Tool>(isNew ? 'center' : 'none');
  const [marker, setMarker] = useState<number | null>(null);
  const [drawing, setDrawing] = useState(-1);
  const [path, setPath] = useState<number | null>(null);
  const [measure, setMeasure] = useState<{ a: Point; b?: Point } | null>(null);
  const undo = useRef<number[]>([]);
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<{ name: string; lat: number; lon: number }[] | null>(null);
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState('');
  const view = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.6);
  useLayoutEffect(() => {
    const el = view.current;
    if (!el) return;
    const measureSize = () => setK(el.clientWidth / W);
    measureSize();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measureSize);
    observer?.observe(el);
    return () => observer?.disconnect();
  }, []);

  const cfg = (): MapData => latest.current;
  const finishPath = () => {
    const l = latest.current.paths ?? [];
    if (drawing >= 0 && (l[drawing]?.pts.length ?? 0) < 2) { setPaths((p) => p.filter((_, i) => i !== drawing)); setPath(null); }
    setDrawing(-1);
    undo.current = [];
  };
  const choose = (t: Tool) => { finishPath(); setTool(t); setMeasure(null); };
  const undoPoint = () => {
    const p = paths[drawing];
    if (!p) return;
    const cut = undo.current.pop() ?? p.pts.length - 1;
    if (cut <= 0) { setPaths((l) => l.filter((_, i) => i !== drawing)); setPath(null); setDrawing(-1); undo.current = []; }
    else setPaths((l) => l.map((x, i) => (i === drawing ? { ...x, pts: x.pts.slice(0, cut) } : x)));
  };
  const at = (cx: number, cy: number) => {
    const r = view.current!.getBoundingClientRect();
    return { x: ((cx - r.left) / r.width) * W, y: ((cy - r.top) / r.height) * H };
  };
  const markerAt = (x: number, y: number) => {
    let best = -1, d = 34;
    cfg().markers.forEach((mk, i) => { const p = toView(cfg(), mk.lat, mk.lon); const dd = Math.hypot(p.x - x, p.y - 36 - y); if (dd < d) { d = dd; best = i; } });
    return best;
  };
  const snap = (x: number, y: number): Point => {
    let best: Marker | null = null, d = 30;
    for (const mk of cfg().markers) { const p = toView(cfg(), mk.lat, mk.lon); const dd = Math.min(Math.hypot(p.x - x, p.y - y), Math.hypot(p.x - x, p.y - 36 - y)); if (dd < d) { d = dd; best = mk; } }
    if (best) return [best.lat, best.lon];
    const g = fromView(cfg(), x, y);
    return [g.lat, g.lon];
  };
  const zoomTo = (z: number) => set({ zoom: Math.max(2, Math.min(18, z)) });
  const follow = (move: (e: PointerEvent) => void, up: () => void) => {
    const end = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end); up(); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
  };

  // Pointer on the map, as in the reference (me of W6).
  const down = (e: React.PointerEvent) => {
    if (e.button > 0 || busy) return;
    e.preventDefault();
    const t = at(e.clientX, e.clientY);
    if (tool === 'path') {
      let i = drawing;
      const first = snap(t.x, t.y);
      if (i < 0 || !paths[i]) {
        if (paths.length >= 20) { setNote('Höchstens 20 Wege.'); return; }
        i = paths.length;
        undo.current = [0];
        setPaths((l) => [...l, { pts: [first], label: '', color: colors[l.length % colors.length], width: 2, dash: false, dist: true }]);
        setDrawing(i); setPath(i);
      } else {
        undo.current.push(paths[i].pts.length);
        setPaths((l) => l.map((x, j) => (j === i && x.pts.length < 400 ? { ...x, pts: [...x.pts, first] } : x)));
      }
      let last = t;
      follow((ev) => {
        const n = at(ev.clientX, ev.clientY);
        if (Math.hypot(n.x - last.x, n.y - last.y) < 14) return;
        last = n;
        const g = fromView(cfg(), n.x, n.y);
        setPaths((l) => l.map((x, j) => (j === i && x.pts.length < 400 ? { ...x, pts: [...x.pts, [g.lat, g.lon] as Point] } : x)));
      }, () => {});
      return;
    }
    const label = tool === 'mark' || tool === 'center' || tool === 'none'
      ? (labelBoxes(cfg()) as { kind: string; index: number; box: { x: number; y: number; w: number; h: number }; base: { x: number; y: number } }[]).find((b) => t.x >= b.box.x && t.x <= b.box.x + b.box.w && t.y >= b.box.y && t.y <= b.box.y + b.box.h)
      : undefined;
    if (label) {
      let moved = false;
      follow((ev) => {
        const n = at(ev.clientX, ev.clientY);
        if (!moved && Math.hypot(n.x - t.x, n.y - t.y) < 5) return;
        moved = true;
        const lx = Math.round(label.box.x + (n.x - t.x) - label.base.x), ly = Math.round(label.box.y + (n.y - t.y) - label.base.y);
        if (label.kind === 'marker') setMarkers((l) => l.map((x, j) => (j === label.index ? { ...x, lx, ly } : x)));
        else if (label.kind === 'path') setPaths((l) => l.map((x, j) => (j === label.index ? { ...x, lx, ly } : x)));
        else { const end = label.kind as 'start' | 'end'; setPaths((l) => l.map((x, j) => (j === label.index && x[end] ? { ...x, [end]: { ...x[end]!, lx, ly } } : x))); }
      }, () => (label.kind === 'marker' ? setMarker(label.index) : setPath(label.index)));
      return;
    }
    const grab = tool === 'mark' || tool === 'center' || tool === 'none' ? markerAt(t.x, t.y) : -1;
    const start = cfg();
    const world = toWorld(start.lat, start.lon, start.zoom);
    let moved = false;
    if (grab >= 0) setMarker(grab);
    follow((ev) => {
      const n = at(ev.clientX, ev.clientY);
      if (!moved && Math.hypot(n.x - t.x, n.y - t.y) < 6) return;
      moved = true;
      if (grab >= 0) { const g = fromView(cfg(), n.x, n.y); setMarkers((l) => l.map((x, j) => (j === grab ? { ...x, lat: g.lat, lon: g.lon } : x))); }
      else { const g = fromWorld(world.x - (n.x - t.x), world.y - (n.y - t.y), start.zoom); set({ lat: g.lat, lon: g.lon }); }
    }, () => {
      if (moved || grab >= 0 || tool === 'none') return;
      const g = fromView(cfg(), t.x, t.y);
      if (tool === 'measure') {
        const p = snap(t.x, t.y);
        setMeasure((was) => (was && !was.b ? { a: was.a, b: p } : { a: p }));
        if (measure && !measure.b) setTool('none');
      } else if (tool === 'center') { set({ lat: g.lat, lon: g.lon }); setTool('none'); }
      else if (cfg().markers.length < 40) { const index = cfg().markers.length; setMarkers((l) => [...l, { lat: g.lat, lon: g.lon, sym: 'place', label: '' }]); setMarker(index); setTool('none'); }
      else setNote('Höchstens 40 Markierungen.');
    });
  };

  const search = async () => {
    if (!query.trim()) return;
    setBusy('Suche …'); setNote('');
    try {
      const list = await searchAddress(query.trim());
      setFound(list);
      if (list.length === 1) goTo(list[0]);
    } catch { setNote('Die Suche hat nicht geklappt. Gibt es Internet?'); }
    setBusy('');
  };
  const goTo = (p: { lat: number; lon: number }) => { set({ lat: p.lat, lon: p.lon, zoom: Math.max(m.zoom, 15) }); setFound(null); };

  const design = designOf(m.design);
  const mk = marker === null ? undefined : m.markers[marker];
  const pa = path === null ? undefined : paths[path];
  const setMk = (i: number, next: Partial<Marker>) => setMarkers((l) => l.map((x, j) => (j === i ? { ...x, ...next } : x)));
  const setPa = (i: number, next: Partial<MapPath>) => setPaths((l) => l.map((x, j) => (j === i ? { ...x, ...next } : x)));
  const air = measure?.b ? (distance(measure.a, measure.b) as number) : null;
  const overlay = (() => {
    let s = mapMarks({ ...m, paths: paths.filter((p) => p.pts.length >= 2) }) as string;
    if (pa) {
      const pts = pa.pts.map(([la, lo]) => toView(m, la, lo));
      for (const p of pts.length < 2 ? pts : [pts[0], pts[pts.length - 1]]) s += `<circle cx="${p.x}" cy="${p.y}" r="11" fill="#ffffff" stroke="${pa.color}" stroke-width="5"/>`;
    }
    if (mk) { const p = toView(m, mk.lat, mk.lon); s += `<circle cx="${p.x}" cy="${p.y - 40}" r="30" fill="none" stroke="#212529" stroke-width="4" stroke-dasharray="8 6"/>`; }
    if (measure) {
      const a = toView(m, measure.a[0], measure.a[1]);
      s += `<circle cx="${a.x}" cy="${a.y}" r="10" fill="#212529"/>`;
      if (measure.b) {
        const b = toView(m, measure.b[0], measure.b[1]), text = `Luftlinie ca. ${distanceText(distance(measure.a, measure.b))}`, w = text.length * 12 + 24;
        s += `<path d="M${a.x} ${a.y}L${b.x} ${b.y}" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/><path d="M${a.x} ${a.y}L${b.x} ${b.y}" stroke="#212529" stroke-width="6" stroke-dasharray="14 10" stroke-linecap="round"/><circle cx="${b.x}" cy="${b.y}" r="10" fill="#212529"/>`;
        s += `<g transform="translate(${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - 24})"><rect x="${-w / 2}" y="-24" width="${w}" height="36" rx="10" fill="#212529"/><text x="0" y="1" font-size="22" font-family="Andika, Verdana, sans-serif" font-weight="700" text-anchor="middle" fill="#ffffff">${text}</text></g>`;
      }
    }
    return s;
  })();
  const hint = air !== null ? `Luftlinie: ca. ${distanceText(air)}.`
    : tool === 'none' ? 'Wähle oben ein Werkzeug. Ziehen verschiebt die Karte, Markierungen und Beschriftungen.'
    : tool === 'center' ? 'Tippe auf die Karte: dort ist dann die Mitte. Ziehen verschiebt die Karte.'
    : tool === 'mark' ? 'Tippe auf die Karte: dort kommt eine Markierung hin. Markierungen und Beschriftungen lassen sich ziehen.'
    : tool === 'path' ? 'Tippe Punkt für Punkt – oder ziehe mit dem Finger. Bei einer Markierung rastet der Weg ein. „Weg fertig“ beendet ihn.'
    : measure ? 'Jetzt den zweiten Punkt antippen.' : 'Tippe zwei Punkte an (oder zwei Markierungen): dann siehst du die Entfernung.';

  return (
    <div className="receipt-options map-editor">
      <div className="map-main">
        {/* No form of its own: the settings dialog is already one. */}
        <div className="map-search">
          <input className="text-input" value={query} placeholder="Adresse oder Ort, z. B. Marienplatz München" aria-label="Adresse suchen" onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void search(); } }} />
          <button type="button" className="knopf compact" disabled={!query.trim() || !!busy} onClick={() => void search()}>Suchen</button>
        </div>
        {found && (
          <ul className="map-found">
            {found.length ? found.map((p) => <li key={`${p.lat},${p.lon}`}><button type="button" className="knopf" onClick={() => goTo(p)}>{p.name}</button></li>) : <li className="option-hint">Nichts gefunden.</li>}
          </ul>
        )}
        <div className="map-tools" role="group" aria-label="Werkzeug">
          {TOOLS.map(([id, label]) => (
            <button key={id} type="button" className={`knopf compact${tool === id ? ' is-active' : ''}`} aria-pressed={tool === id} onClick={() => choose(tool === id ? 'none' : id)}>{label}</button>
          ))}
        </div>
        <p className="option-hint map-hint">
          {hint}
          {air !== null && measure?.b && paths.length < 20 && (
            <button type="button" className="knopf compact" onClick={() => { setPaths((l) => [...l, { pts: [measure.a, measure.b!], label: '', color: '#212529', width: 2, dash: true, dist: true }]); setPath(paths.length); setMeasure(null); }}>Als Linie auf die Karte</button>
          )}
          {air !== null && <button type="button" className="knopf compact" onClick={() => choose('measure')}>Neu messen</button>}
        </p>
        {note && <p className="option-hint" role="status">{note}</p>}
        <div ref={view} className="map-view" style={{ aspectRatio: `${W} / ${H}`, borderColor: design.frame }} onPointerDown={down} onWheel={(e) => { e.preventDefault(); zoomTo(m.zoom + (e.deltaY < 0 ? 1 : -1)); }}>
          {(mapTiles(m) as { z: number; x: number; y: number; left: number; top: number }[]).map((t) => (
            <img key={`${t.z}/${t.x}/${t.y}/${Math.round(t.left)}`} data-tint={design.tint} className="map-tile" alt="" draggable={false} src={tileUrl(t.z, t.x, t.y)} style={{ left: t.left * k, top: t.top * k, width: 256 * k, height: 256 * k }} />
          ))}
          <svg className="map-marks" viewBox={`0 0 ${W} ${H}`} dangerouslySetInnerHTML={{ __html: overlay }} />
          <div className="map-zoom">
            <button type="button" aria-label="Näher heran" disabled={m.zoom >= 18} onPointerDown={(e) => e.stopPropagation()} onClick={() => zoomTo(m.zoom + 1)}>+</button>
            <button type="button" aria-label="Weiter weg" disabled={m.zoom <= 2} onPointerDown={(e) => e.stopPropagation()} onClick={() => zoomTo(m.zoom - 1)}>−</button>
          </div>
          {tool === 'path' && drawing >= 0 && (
            <div className="map-drawbar" onPointerDown={(e) => e.stopPropagation()}>
              <button type="button" className="knopf compact" onClick={undoPoint}>Rückgängig</button>
              <button type="button" className="knopf compact is-active" onClick={() => { finishPath(); setTool('none'); }}>Weg fertig</button>
            </div>
          )}
          <span className="map-credit">© OpenStreetMap-Mitwirkende, openstreetmap.de</span>
          {busy && <div className="map-busy">{busy}</div>}
        </div>
        <p className="option-hint">Kartendaten © OpenStreetMap-Mitwirkende (openstreetmap.org, ODbL), Kartenbild openstreetmap.de (FOSSGIS e. V.) – über den Schulserver. Dorthin gehen nur der Suchtext und die Nummern der Kartenbilder, nichts über dich oder die Kinder.</p>
      </div>

      <div className="map-side">
        <div className="receipt-option">
          <strong>Design</strong>
          <div className="map-designs" role="radiogroup" aria-label="Design">
            {designs.map((d) => (
              <button key={d.id} type="button" role="radio" aria-checked={m.design === d.id} className={`knopf compact${m.design === d.id ? ' is-active' : ''}`} onClick={() => set({ design: d.id })}>
                <span className="map-swatch" style={{ background: d.paper, borderColor: d.frame }} /> {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="receipt-option">
          <strong>Markierungen ({m.markers.length})</strong>
          {!m.markers.length && <p className="option-hint">Noch keine. Wähle „Markierung setzen“ und tippe auf die Karte.</p>}
          <div className="map-list">
            {m.markers.map((x, i) => (
              <button key={i} type="button" className={`map-row${marker === i ? ' is-active' : ''}`} onClick={() => setMarker(i)}>
                <img alt="" src={mapSymbol(x.sym)} /><span>{x.label || symbols.find((s) => s.id === x.sym)?.label}</span>
              </button>
            ))}
          </div>
          {mk && marker !== null && (
            <div className="map-edit">
              <input className="text-input" value={mk.label} placeholder="z. B. Unsere Schule" maxLength={60} aria-label="Beschriftung der Markierung" onChange={(e) => setMk(marker, { label: e.target.value })} />
              <div className="map-syms" role="radiogroup" aria-label="Symbol">
                {symbols.map((s) => (
                  <button key={s.id} type="button" role="radio" aria-checked={mk.sym === s.id} aria-label={s.label} title={s.label} className={`map-sym${mk.sym === s.id ? ' is-active' : ''}`} onClick={() => setMk(marker, { sym: s.id })}><img alt="" src={mapSymbol(s.id)} /></button>
                ))}
              </div>
              {mk.lx !== undefined && <button type="button" className="knopf compact" onClick={() => setMk(marker, { lx: undefined, ly: undefined })}>Beschriftung zurücksetzen</button>}
              <button type="button" className="knopf compact" onClick={() => { setMarkers((l) => l.filter((_, j) => j !== marker)); setMarker(null); }}>Markierung löschen</button>
            </div>
          )}
        </div>

        <div className="receipt-option">
          <strong>Wege ({paths.filter((p) => p.pts.length >= 2).length})</strong>
          {!paths.length && <p className="option-hint">Noch keine. Wähle „Weg zeichnen“ und tippe Punkt für Punkt auf die Karte – oder ziehe mit dem Finger.</p>}
          <div className="map-list">
            {paths.map((p, i) => (
              <button key={i} type="button" className={`map-row${path === i ? ' is-active' : ''}`} onClick={() => setPath(i)}>
                <span className="map-pathswatch" style={{ background: p.color }} /><span>{p.label || `Weg ${i + 1}`} · ca. {distanceText(pathLength(p.pts))}</span>
              </button>
            ))}
          </div>
          {pa && path !== null && (
            <div className="map-edit">
              <input className="text-input" value={pa.label} placeholder={pa.kind ? kinds.find((x) => x.id === pa.kind)?.label : 'z. B. Mein Schulweg'} maxLength={60} aria-label="Beschriftung des Wegs" onChange={(e) => setPa(path, { label: e.target.value })} />
              <div className="map-chips" role="radiogroup" aria-label="Art des Wegs">
                <button type="button" role="radio" aria-checked={!pa.kind} className={`knopf compact${pa.kind ? '' : ' is-active'}`} onClick={() => setPa(path, { kind: undefined })}>Ohne Art</button>
                {kinds.map((x) => <button key={x.id} type="button" role="radio" aria-checked={pa.kind === x.id} className={`knopf compact${pa.kind === x.id ? ' is-active' : ''}`} onClick={() => setPa(path, { kind: x.id })}>{x.label}</button>)}
              </div>
              <Toggle checked={!!pa.start} label="Anfang markieren" onChange={(v) => setPa(path, { start: v ? { label: '' } : undefined })} />
              {pa.start && <input className="text-input" value={pa.start.label} placeholder="Beschriftung, z. B. Zuhause" maxLength={60} aria-label="Beschriftung am Anfang" onChange={(e) => setPa(path, { start: { ...pa.start!, label: e.target.value } })} />}
              <Toggle checked={!!pa.end} label="Ende markieren" onChange={(v) => setPa(path, { end: v ? { label: '' } : undefined })} />
              {pa.end && <input className="text-input" value={pa.end.label} placeholder="Beschriftung, z. B. Schule" maxLength={60} aria-label="Beschriftung am Ende" onChange={(e) => setPa(path, { end: { ...pa.end!, label: e.target.value } })} />}
              <p className="option-hint">Länge: ca. {distanceText(pathLength(pa.pts))} ({pa.pts.length} Punkte)</p>
              <div className="map-chips" role="radiogroup" aria-label="Farbe">
                {colors.map((c) => <button key={c} type="button" role="radio" aria-checked={pa.color === c} aria-label={`Farbe ${c}`} className="map-color" style={{ background: c }} onClick={() => setPa(path, { color: c })} />)}
              </div>
              <div className="map-chips" role="radiogroup" aria-label="Dicke">
                {([[1, 'Dünn'], [2, 'Mittel'], [3, 'Dick']] as const).map(([w, l]) => <button key={w} type="button" role="radio" aria-checked={pa.width === w} className={`knopf compact${pa.width === w ? ' is-active' : ''}`} onClick={() => setPa(path, { width: w })}>{l}</button>)}
              </div>
              <Toggle checked={pa.dash} label="Gestrichelt" onChange={(dash) => setPa(path, { dash })} />
              <Toggle checked={pa.dist} label="Entfernung auf die Karte schreiben" hint="Geschätzt aus den Punkten des Wegs." onChange={(dist) => setPa(path, { dist })} />
              {(pa.lx !== undefined || pa.start?.lx !== undefined || pa.end?.lx !== undefined) && (
                <button type="button" className="knopf compact" onClick={() => setPa(path, { lx: undefined, ly: undefined, ...(pa.start ? { start: { label: pa.start.label } } : {}), ...(pa.end ? { end: { label: pa.end.label } } : {}) })}>Beschriftungen zurücksetzen</button>
              )}
              <button type="button" className="knopf compact" disabled={pa.pts.length < 2} onClick={() => setPa(path, { pts: pa.pts.slice(0, -1) })}>Letzten Punkt weg</button>
              <button type="button" className="knopf compact" onClick={() => { setPaths((l) => l.filter((_, j) => j !== path)); setPath(null); setDrawing(-1); }}>Weg löschen</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
