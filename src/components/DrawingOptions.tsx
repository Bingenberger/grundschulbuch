'use client';
import { useEditor } from '@/lib/editor-store';
import { brushProfiles } from '@/lib/brushes';

/** Shared controls keep drawing and erasing consistent in both editors. */
export default function DrawingOptions({ allowFill = false }: { allowFill?: boolean }) {
  const s = useEditor();
  const patch = useEditor.setState;
  const profile = brushProfiles[s.brush];
  const sizes = Array.from(new Set([...profile.sizes, s.penWidth])).sort((a, b) => a - b);
  const opacities = Array.from(new Set([0.25, 0.5, 0.75, 1, profile.opacity, s.penOpacity])).sort((a, b) => a - b);
  if (s.tool === 'eraser') return (
    <div className="drawing-options" role="group" aria-label="Radierer einstellen">
      <label>Radierart <select aria-label="Radierart" value={s.eraser.mode} onChange={e => patch({ eraser: { ...s.eraser, mode: e.target.value as 'area' | 'stroke' } })}>
        <option value="area">Fläche radieren</option><option value="stroke">Ganze Striche</option>
      </select></label>
      <label>Größe <select aria-label="Radiergröße" value={s.eraser.size} onChange={e => patch({ eraser: { ...s.eraser, size: Number(e.target.value) } })}>
        {[2, 5, 10, 20].map(n => <option key={n} value={n}>{n} mm</option>)}
      </select></label>
      {s.eraser.mode === 'area' && <>
        <label>Spitze <select aria-label="Radierform" value={s.eraser.tip || 'round'} onChange={e => patch({ eraser: { ...s.eraser, tip: e.target.value as 'round' | 'square' | 'slant' } })}>
          <option value="round">Rund</option><option value="square">Eckig</option><option value="slant">Schräg</option>
        </select></label>
        <label><input type="checkbox" checked={s.eraser.soft} onChange={e => patch({ eraser: { ...s.eraser, soft: e.target.checked } })} /> Weiche Kante</label>
        <label>Stärke <select aria-label="Radierstärke" value={s.eraser.opacity} onChange={e => patch({ eraser: { ...s.eraser, opacity: Number(e.target.value) } })}>
          {[0.25, 0.5, 1].map(n => <option key={n} value={n}>{n * 100} %</option>)}
        </select></label>
      </>}
    </div>
  );
  if (s.tool !== 'pen' && s.tool !== 'marker') return null;
  return <div className="drawing-options" role="group" aria-label="Stift einstellen">
    <label>Stiftart <select aria-label="Stiftart" value={s.tool === 'marker' ? 'marker' : s.brush === 'fill' && !allowFill ? 'pen' : s.brush} onChange={e => s.chooseBrush(e.target.value as typeof s.brush)}>
      {[
        ['pen', 'Stift'], ['fountain', 'Füller'], ['crayon', 'Buntstift'], ['marker', 'Marker'], ['water', 'Aquarell'],
        ...(allowFill ? [['fill', 'Farbeimer']] : []),
      ].map(([id, label]) => <option key={id} value={id}>{label}</option>)}
    </select></label>
    {s.brush !== 'fill' && <label>Stärke <select aria-label="Stiftstärke in Millimetern" value={s.penWidth} onChange={e => patch({ penWidth: Number(e.target.value) })}>
      {sizes.map(n => <option key={n} value={n}>{n} mm</option>)}
    </select></label>}
    {s.brush === 'fill' && <label>Füllart <select aria-label="Füllart" value={s.fillMode} onChange={e => patch({ fillMode: e.target.value as 'area' | 'object' })}>
      <option value="area">Zusammenhängende Fläche</option><option value="object">Geschlossene Form</option>
    </select></label>}
    {(s.brush !== 'fill' || s.fillMode === 'area') && <label>Deckkraft <select aria-label="Zeichendeckkraft" value={s.penOpacity} onChange={e => patch({ penOpacity: Number(e.target.value) })}>
    {opacities.map(n => <option key={n} value={n}>{Math.round(n * 100)} %</option>)}
  </select></label>}
  {s.brush === 'fountain' && <label>Schreibhand <select aria-label="Schreibhand" value={s.nibHand} onChange={e => patch({ nibHand: e.target.value as 'left' | 'right' })}>
    <option value="right">Rechts</option><option value="left">Links</option>
  </select></label>}
  {!['water', 'fill'].includes(s.brush) && <label title="Linien, Kreise, Dreiecke, Rechtecke, Pfeile, Sterne und Herzen: Am Strichende kurz stillhalten. Erkannte Form durch Loslassen übernehmen; Weiterzeichnen verwirft die Vorschau.">
    <input type="checkbox" checked={s.recognizeShapes} onChange={event => patch({ recognizeShapes: event.target.checked })} /> Formen erkennen
  </label>}
  {s.recognizeShapes && !['water', 'fill'].includes(s.brush) && <small>Am Strichende kurz stillhalten, dann loslassen.</small>}
  </div>;
}
