// Reordering pages in the tile view.
/** New order: the moved pages (in their order) go before `target` (or to the end). */
export function moveTo(ids: string[], moving: string[], target: number): string[] {
  const rest = ids.filter((id) => !moving.includes(id));
  const before = ids.slice(0, target).filter((id) => !moving.includes(id)).length;
  const ordered = ids.filter((id) => moving.includes(id));
  return [...rest.slice(0, before), ...ordered, ...rest.slice(before)];
}

