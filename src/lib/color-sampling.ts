export function canvasPoint(point: { x: number; y: number }, rect: { left: number; top: number; width: number; height: number }, width: number, height: number) {
  return {
    x: Math.max(0, Math.min(width - 1, Math.floor((point.x - rect.left) / rect.width * width))),
    y: Math.max(0, Math.min(height - 1, Math.floor((point.y - rect.top) / rect.height * height))),
  };
}

/** Composite transparent pixels over white, as on the paper. */
export function rgbaHex(rgba: ArrayLike<number>): string {
  const alpha = (rgba[3] ?? 255) / 255;
  return '#' + [0, 1, 2].map(i => Math.round(rgba[i] * alpha + 255 * (1 - alpha)).toString(16).padStart(2, '0')).join('');
}
