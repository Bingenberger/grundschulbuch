'use client';
import type { PageElement } from '@/lib/notebook-model';
import { corners, type Corner } from '@/lib/transform';
import Icon from '../Icon';

export type HandleKind = 'move' | Corner | 'rotate';

const cornerNames: Record<Corner, string> = {
  nw: 'oben links',
  ne: 'oben rechts',
  sw: 'unten links',
  se: 'unten rechts',
};

/**
 * Frame around a selected element: grab it anywhere to move it, at the four
 * corners to resize and at the handle above it to rotate. Interactive learning
 * tools keep a move bar instead, so their buttons stay usable.
 */
export default function SelectionHandles({
  element,
  locked,
  onStart,
  onMove,
  onEnd,
  onDoubleClick,
}: {
  element: PageElement;
  locked: boolean;
  onStart: (event: React.PointerEvent, kind: HandleKind) => void;
  onMove: (event: React.PointerEvent) => void;
  onEnd: (event: React.PointerEvent, cancel?: boolean) => void;
  onDoubleClick?: () => void;
}) {
  const events = (kind: HandleKind) => ({
    onPointerDown: (e: React.PointerEvent) => onStart(e, kind),
    onPointerMove: onMove,
    onPointerUp: (e: React.PointerEvent) => onEnd(e),
    onPointerCancel: (e: React.PointerEvent) => onEnd(e, true),
  });
  const interactive = ['widget', 'activity', 'embed', 'audio'].includes(element.type);
  return (
    <div
      className={`selection-handles ${locked ? 'locked' : ''}`}
      style={{
        left: `${element.x}mm`,
        top: `${element.y}mm`,
        width: `${element.width}mm`,
        height: `${element.height}mm`,
        transform: `rotate(${element.rotation}deg)`,
      }}
    >
      {locked ? (
        <span className="lock-indicator">Gesperrt</span>
      ) : (
        <>
          {interactive ? (
            <button className="move-element-handle" aria-label="Element verschieben" {...events('move')}>
              ↔ Verschieben
            </button>
          ) : (
            <div className="move-area" aria-hidden="true" onDoubleClick={onDoubleClick} {...events('move')} />
          )}
          <span className="rotate-stem" aria-hidden="true" />
          <button className="rotate-handle" aria-label="Element drehen" title="Drehen · mit Umschalttaste in 15°-Schritten" {...events('rotate')}>
            <Icon name="drehen" size={18} />
          </button>
          {corners.map((corner) => (
            <button
              key={corner}
              className={`resize-handle ${corner}`}
              aria-label={`Größe ändern ${cornerNames[corner]}`}
              {...events(corner)}
            />
          ))}
        </>
      )}
    </div>
  );
}
