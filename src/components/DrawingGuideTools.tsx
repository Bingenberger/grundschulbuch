'use client';
import { normaliseGuideAngle, type DrawingGuide } from '@/lib/drawing-guide';

export default function DrawingGuideTools({ guide, onChange }: {
  guide: DrawingGuide | null;
  onChange: (guide: DrawingGuide | null) => void;
}) {
  return <div className="tool-group drawing-guide-tools" role="group" aria-label="Zeichenhilfen">
    {([['ruler', '📏', 'Lineal'], ['triangle', '△', 'Geodreieck']] as const).map(([kind, icon, label]) =>
      <button key={kind} className="tool" aria-pressed={guide?.kind === kind} onClick={() => onChange(guide?.kind === kind ? null : {
        kind, x: guide?.x ?? 105, y: guide?.y ?? (kind === 'ruler' ? 76 : 95), angle: guide?.angle ?? 0,
      })}><span>{icon}</span>{label}</button>)}
    {guide && <>
      <label>Winkel <input aria-label="Winkel der Zeichenhilfe" type="number" min="-360" max="360" step="1" value={Math.round(guide.angle)} onChange={event => {
        const angle = Number(event.target.value);
        if (Number.isFinite(angle)) onChange({ ...guide, angle: normaliseGuideAngle(angle) });
      }} />°</label>
      <button className="tool" onClick={() => onChange(null)}>Zeichenhilfe entfernen</button>
    </>}
  </div>;
}
