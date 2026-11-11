'use client';
import { useCallback, useEffect, useState } from 'react';
import type { Recognition } from './shape-recognition';
import type { PageElement, Point } from './notebook-model';
import { ShapeHold } from './shape-hold';

export function useShapeRecognition(enabled: boolean, scope: string) {
  const [hold] = useState(() => new ShapeHold());
  const [replacement, setReplacement] = useState<{ scope: string; id: string } | null>(null);
  const cancel = useCallback(() => { hold.cancel(); setReplacement(null); }, [hold]);
  useEffect(() => () => hold.cancel(), [hold, enabled, scope]);
  const update = useCallback((points: Point[], preview: (shape: Recognition | null) => void, pixelsPerMm?: number, shaft: PageElement | null = null) => {
    if (!enabled || !points.length) { preview(null); return; }
    hold.update(points, shape => {
      setReplacement(shape?.replaceId ? { scope, id: shape.replaceId } : null);
      preview(shape);
    }, pixelsPerMm, shaft);
  }, [enabled, hold, scope]);
  const finish = useCallback((points: Point[], confirmedOnly = false): Recognition | null => {
    setReplacement(null);
    if (!enabled) { hold.cancel(); return null; }
    return hold.finish(points, confirmedOnly);
  }, [enabled, hold]);
  return { update, finish, cancel, replaceId: enabled && replacement?.scope === scope && hold.replacementId === replacement.id ? replacement.id : undefined };
}
