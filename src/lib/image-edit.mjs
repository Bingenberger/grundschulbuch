// Picture editing shared by the browser (preview) and the server (final
// picture): turning, mirroring, cropping, pixelating, black bars and
// combinable effects. Works on RGBA pixels: { width, height, data }.
// Positions are relative (0…1) to the picture at that step, so preview and
// server agree even at different resolutions.

/** Order in which effects are applied. */
export const EFFECTS = ['bright', 'contrast', 'vivid', 'pale', 'scan', 'gray', 'sepia', 'warm', 'cold', 'invert'];
export const EFFECT_DEFAULTS = {
  scan: 50, gray: 100, sepia: 100, bright: 50, contrast: 50, vivid: 50, pale: 50, warm: 50, cold: 50, invert: 100,
};
/** Effects that exclude each other. */
export const EXCLUSIVE = [['scan', 'gray', 'sepia'], ['vivid', 'pale'], ['warm', 'cold']];
export const MAX_SIDE = 2000;
const MAX_STEPS = 200;
const MAX_POINTS = 4000;

const clamp = (n) => (n < 0 ? 0 : n > 255 ? 255 : n);

/** Switches an effect on (with its default strength) or off. */
export function toggleEffect(effects, id) {
  const next = { ...effects };
  if (next[id] !== undefined) {
    delete next[id];
    return next;
  }
  for (const group of EXCLUSIVE) if (group.includes(id)) for (const other of group) delete next[other];
  next[id] = EFFECT_DEFAULTS[id];
  return next;
}

export function applyEffects(img, effects) {
  const list = EFFECTS.filter((id) => effects?.[id] !== undefined).map((id) => [id, effects[id]]);
  if (!list.length) return img;
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i + 1], b = d[i + 2];
    for (const [id, amount] of list) {
      const k = amount / 100;
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      switch (id) {
        case 'scan':
          r = g = b = clamp(((y - (10 + amount * 1.2)) / 120) * 255);
          break;
        case 'gray':
          r += (y - r) * k; g += (y - g) * k; b += (y - b) * k;
          break;
        case 'sepia': {
          const sr = clamp(0.393 * r + 0.769 * g + 0.189 * b), sg = clamp(0.349 * r + 0.686 * g + 0.168 * b), sb = clamp(0.272 * r + 0.534 * g + 0.131 * b);
          r += (sr - r) * k; g += (sg - g) * k; b += (sb - b) * k;
          break;
        }
        case 'bright': {
          const add = amount * 0.7;
          r = clamp(r + add); g = clamp(g + add); b = clamp(b + add);
          break;
        }
        case 'contrast': {
          const f = 1 + amount * 0.008;
          r = clamp((r - 128) * f + 128); g = clamp((g - 128) * f + 128); b = clamp((b - 128) * f + 128);
          break;
        }
        case 'vivid': {
          const f = 1 + amount * 0.012;
          r = clamp(y + (r - y) * f); g = clamp(y + (g - y) * f); b = clamp(y + (b - y) * f);
          break;
        }
        case 'pale': {
          const f = 1 - amount * 0.011, add = amount * 0.5;
          r = clamp(y + (r - y) * f + add); g = clamp(y + (g - y) * f + add); b = clamp(y + (b - y) * f + add);
          break;
        }
        case 'warm':
          r = clamp(r + amount * 0.44); b = clamp(b - amount * 0.44);
          break;
        case 'cold':
          r = clamp(r - amount * 0.36); b = clamp(b + amount * 0.52);
          break;
        case 'invert':
          r += (255 - 2 * r) * k; g += (255 - 2 * g) * k; b += (255 - 2 * b) * k;
          break;
      }
    }
    d[i] = r; d[i + 1] = g; d[i + 2] = b;
  }
  return img;
}

const blank = (width, height, Array) => ({ width, height, data: new Array(width * height * 4) });

/** Quarter turn: 1 clockwise, -1 counter-clockwise. */
export function rotate(img, dir) {
  const { width: w, height: h, data } = img;
  const out = blank(h, w, data.constructor);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const nx = dir > 0 ? h - 1 - y : y, ny = dir > 0 ? x : w - 1 - x;
      const from = (y * w + x) * 4, to = (ny * h + nx) * 4;
      out.data[to] = data[from]; out.data[to + 1] = data[from + 1]; out.data[to + 2] = data[from + 2]; out.data[to + 3] = data[from + 3];
    }
  return out;
}

export function flip(img) {
  const { width: w, height: h, data } = img;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w >> 1; x++) {
      const a = (y * w + x) * 4, b = (y * w + (w - 1 - x)) * 4;
      for (let c = 0; c < 4; c++) {
        const t = data[a + c];
        data[a + c] = data[b + c];
        data[b + c] = t;
      }
    }
  return img;
}

/** Pixel rectangle of a relative one, at least one pixel. */
function pixels(img, rect) {
  const x = Math.max(0, Math.min(img.width - 1, Math.round(rect.x * img.width)));
  const y = Math.max(0, Math.min(img.height - 1, Math.round(rect.y * img.height)));
  const w = Math.max(1, Math.min(img.width - x, Math.round(rect.w * img.width)));
  const h = Math.max(1, Math.min(img.height - y, Math.round(rect.h * img.height)));
  return { x, y, w, h };
}

export function crop(img, rect) {
  const { x, y, w, h } = pixels(img, rect);
  const out = blank(w, h, img.data.constructor);
  for (let row = 0; row < h; row++) {
    const from = ((y + row) * img.width + x) * 4;
    out.data.set(img.data.subarray(from, from + w * 4), row * w * 4);
  }
  return out;
}

export function bar(img, rect) {
  const { x, y, w, h } = pixels(img, rect);
  for (let row = y; row < y + h; row++)
    for (let col = x; col < x + w; col++) {
      const i = (row * img.width + col) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 17;
      img.data[i + 3] = 255;
    }
  return img;
}

/**
 * Pixelates along a painted line. Blocks sit on one grid and take their
 * colour from the picture before this line, so the result is the same
 * wherever the line passes twice.
 */
export function pixelate(img, stroke) {
  const { width: w, height: h } = img;
  const radius = Math.max(2, stroke.r * w);
  const size = Math.max(4, Math.round(radius / 3));
  const source = img.data.slice();
  const done = new Set();
  const block = (bx, by) => {
    const key = by * 100000 + bx;
    if (done.has(key)) return;
    done.add(key);
    const x0 = bx * size, y0 = by * size, x1 = Math.min(w, x0 + size), y1 = Math.min(h, y0 + size);
    let r = 0, g = 0, b = 0, a = 0, n = 0;
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const i = (y * w + x) * 4;
        r += source[i]; g += source[i + 1]; b += source[i + 2]; a += source[i + 3]; n++;
      }
    if (!n) return;
    r /= n; g /= n; b /= n; a /= n;
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const i = (y * w + x) * 4;
        img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = a;
      }
  };
  const dab = (cx, cy) => {
    for (let by = Math.floor((cy - radius) / size); by <= Math.floor((cy + radius) / size); by++)
      for (let bx = Math.floor((cx - radius) / size); bx <= Math.floor((cx + radius) / size); bx++) {
        if (bx < 0 || by < 0 || bx * size >= w || by * size >= h) continue;
        const mx = bx * size + size / 2, my = by * size + size / 2;
        if ((mx - cx) ** 2 + (my - cy) ** 2 <= (radius + size / 2) ** 2) block(bx, by);
      }
  };
  const pts = stroke.pts.map(([x, y]) => [x * w, y * h]);
  pts.forEach(([x, y], i) => {
    if (i > 0) {
      const [px, py] = pts[i - 1];
      const steps = Math.floor(Math.hypot(x - px, y - py) / (radius / 2));
      for (let s = 1; s < steps; s++) dab(px + ((x - px) * s) / steps, py + ((y - py) * s) / steps);
    }
    dab(x, y);
  });
  return img;
}

export function applyStep(img, step) {
  switch (step.type) {
    case 'rotate':
      return rotate(img, step.dir);
    case 'flip':
      return flip(img);
    case 'crop':
      return crop(img, step);
    case 'bar':
      return bar(img, step);
    case 'pixel':
      return pixelate(img, step);
    default:
      return img;
  }
}

/** Applies all steps in order and the effects at the end. */
export function render(img, steps, effects) {
  let out = { width: img.width, height: img.height, data: img.data.slice() };
  for (const step of steps) out = applyStep(out, step);
  return applyEffects(out, effects);
}

/** Size of the picture after the steps (for the element's proportions). */
export function resultSize(width, height, steps) {
  let w = width, h = height;
  for (const step of steps) {
    if (step.type === 'rotate') [w, h] = [h, w];
    if (step.type === 'crop') {
      w = Math.max(1, Math.round(step.w * w));
      h = Math.max(1, Math.round(step.h * h));
    }
  }
  return { width: w, height: h };
}

const unit = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1;

/** Checks an edit from the browser; throws a German message when invalid. */
export function cleanEdit(input) {
  const steps = Array.isArray(input?.steps) ? input.steps : null;
  if (!steps || steps.length > MAX_STEPS) throw new Error('Ungültige Bildbearbeitung.');
  const clean = steps.map((s) => {
    if (s?.type === 'rotate' && (s.dir === 1 || s.dir === -1)) return { type: 'rotate', dir: s.dir };
    if (s?.type === 'flip') return { type: 'flip' };
    if ((s?.type === 'crop' || s?.type === 'bar') && [s.x, s.y, s.w, s.h].every(unit) && s.w > 0 && s.h > 0 && s.x + s.w <= 1.0001 && s.y + s.h <= 1.0001)
      return { type: s.type, x: s.x, y: s.y, w: s.w, h: s.h };
    if (
      s?.type === 'pixel' &&
      typeof s.r === 'number' && s.r > 0 && s.r <= 0.5 &&
      Array.isArray(s.pts) && s.pts.length >= 1 && s.pts.length <= MAX_POINTS &&
      s.pts.every((p) => Array.isArray(p) && p.length === 2 && p.every((n) => typeof n === 'number' && n >= -0.5 && n <= 1.5))
    )
      return { type: 'pixel', r: s.r, pts: s.pts.map(([x, y]) => [x, y]) };
    throw new Error('Ungültige Bildbearbeitung.');
  });
  const effects = {};
  for (const [id, amount] of Object.entries(input?.effects || {})) {
    if (!EFFECTS.includes(id) || typeof amount !== 'number' || amount < 0 || amount > 100) throw new Error('Ungültiger Effekt.');
    effects[id] = Math.round(amount);
  }
  for (const group of EXCLUSIVE)
    if (group.filter((id) => effects[id] !== undefined).length > 1) throw new Error('Diese Effekte schließen sich aus.');
  return { steps: clean, effects };
}
