// Settings of the Dienes material (pieces up to Zehner, Hunderter or Tausender).
import { clamp } from './placevalue';

export type DienesSettings = { to: number; colors: 'wood' | 'montessori'; total: boolean; exchange: boolean; tasks: number };
export const DIENES_DEFAULTS: DienesSettings = { to: 2, colors: 'wood', total: true, exchange: true, tasks: 0 };
export function dienesSettings(raw: unknown): DienesSettings {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Partial<DienesSettings>;
  return {
    to: clamp(v.to ?? DIENES_DEFAULTS.to, 1, 3),
    colors: v.colors === 'montessori' ? 'montessori' : 'wood',
    total: v.total !== false,
    exchange: v.exchange !== false,
    tasks: clamp(v.tasks ?? 0, 0, 10),
  };
}
