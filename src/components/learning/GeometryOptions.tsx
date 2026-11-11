'use client';
import { useState } from 'react';
import type { LearningSettings } from '@/lib/learning/catalog';
import { defaultGeometryPath, geometryCustom, geometryTrace } from '@/lib/learning/geometry';
export function parseGeometryPath(text: string) {
  const rows = text.trim().split(/\r?\n/);
  if (rows.length < 2 || rows.length > 30) return null;
  const points = rows.map(row => { const match = /^\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*$/.exec(row); return match ? { x: Number(match[1]), y: Number(match[2]) } : null; });
  if (points.some((p, i) => !p || p.x > 100 || p.y > 100 || i > 0 && p.x === points[i - 1]?.x && p.y === points[i - 1]?.y)) return null;
  return points as { x: number; y: number }[];
}
export default function GeometryOptions({ settings: c, onChange }: { settings: LearningSettings; onChange: (patch: Partial<LearningSettings>) => void }) {
  const [path, setPath] = useState(() => (c.path?.length ? c.path : defaultGeometryPath).map(p => `${p.x},${p.y}`).join('\n'));
  const custom = geometryCustom(c), parsed = parseGeometryPath(path);
  return <fieldset className="geometry-options"><legend>Geometrie · Aufgabenablauf</legend>
    <label className="property-label">Aufgaben<select aria-label="Geometrie-Aufgabenart" value={custom ? 'custom' : 'series'} onChange={event => onChange({ geometryMode: event.target.value as 'series' | 'custom', path: event.target.value === 'custom' ? parsed || [] : c.path, geometryHelp: c.geometryHelp || (custom ? 'trace' : 'preview') })}><option value="series">Erzeugte Aufgabenserie</option><option value="custom">Eigene Form</option></select></label>
    {!custom && <><label className="property-label">Schwierigkeit<select aria-label="Geometrie-Schwierigkeit" value={Math.max(1, Math.min(3, c.difficulty || 1))} onChange={event => onChange({ difficulty: Number(event.target.value) })}><option value={1}>Leicht · waagerechte und senkrechte Strecken</option><option value={2}>Mittel · Dreiecke und schräge Vierecke</option><option value={3}>Schwer · mehrteilige Konturen</option></select></label>
      <label className="property-label">Aufgaben je Serie<input aria-label="Anzahl der Geometrieaufgaben" type="number" min={1} max={12} value={c.geometryCount || 5} onChange={event => onChange({ geometryCount: Math.max(1, Math.min(12, Math.round(Number(event.target.value) || 5))) })} /></label>
      <label className="property-label">Aufgabenvariante<input aria-label="Geometrie-Aufgabenvariante" type="number" min={0} max={999999} value={c.seed ?? 42} onChange={event => onChange({ seed: Math.max(0, Math.min(999999, Math.round(Number(event.target.value) || 0))) })} /></label></>}
    <label className="property-label">Vorlage<select aria-label="Geometrie-Vorlagenhilfe" value={geometryTrace(c) ? 'trace' : 'preview'} onChange={event => onChange({ geometryHelp: event.target.value as 'preview' | 'trace' })}><option value="preview">Kurz ansehen, dann aus dem Gedächtnis zeichnen</option><option value="trace">Dauerhaft zum Nachzeichnen anzeigen</option></select></label>
    <label className="property-label">Vorschaudauer in Sekunden<input aria-label="Geometrie-Vorschaudauer" type="number" min={1} max={15} value={c.geometryPreview || 3} onChange={event => onChange({ geometryPreview: Math.max(1, Math.min(15, Math.round(Number(event.target.value) || 3))) })} /></label>
    {custom && <><label className="property-label">Eckpunkte · X,Y je Zeile, jeweils 0 bis 100<textarea aria-label="Eigene Geometrieform" value={path} onChange={event => { const value = event.target.value; setPath(value); onChange({ path: parseGeometryPath(value) || [] }); }} /></label>
      <p>Zwischen zwei aufeinanderfolgenden Punkten liegt eine Strecke. Zum Schließen den ersten Punkt am Ende wiederholen. Zwei bis 30 Punkte; keine direkt aufeinanderfolgenden gleichen Punkte.</p>{!parsed && <p role="alert">Bitte gültige Eckpunkte eingeben, zum Beispiel 20,20 und 80,20.</p>}</>}
    <p>Lineal und Geodreieck können auf der Zeichenfläche verschoben, gedreht und geschlossen werden. Ein Kästchen entspricht einer Rastereinheit; die Anzeige ist keine maßhaltige Zentimeterskala.</p>
  </fieldset>;
}
