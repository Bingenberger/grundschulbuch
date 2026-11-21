// Portrait versions (990 × 1400 units, A4 upright) of the original page designs (1400 × 990).
// Every design is laid out anew by the rules in portrait-layouts.mjs: groups move to their new
// place, frames and lines are recalculated in their new size (never distorted), rows of lines
// are continued down the taller page. Writes
//   src/lib/reference/page-templates-portrait.json  (same format as page-templates.json)
//   src/lib/reference/template-vectors-portrait.json (only the recalculated vector shapes)
// usage: node scripts/build-portrait-templates.mjs
import fs from 'node:fs';
import layouts from './portrait-layouts.mjs';

const dir = new URL('../src/lib/reference/', import.meta.url);
const originals = JSON.parse(fs.readFileSync(new URL('page-templates.json', dir), 'utf8'));
const vectors = JSON.parse(fs.readFileSync(new URL('template-vectors.json', dir), 'utf8'));
export const W = 990, H = 1400;
const PAPER_IDS = ['blank', 'lin1', 'lin2', 'lin3', 'lines', 'lines-narrow', 'picture-lines', 'squares', 'squares-big', 'dots', 'music'];

const round = n => Math.round(n * 100) / 100;
/** Piecewise linear map through [[from, to], …]; one pair is a plain shift. */
function piecewise(points) {
  if (!points) return v => v;
  const p = [...points].sort((a, b) => a[0] - b[0]);
  if (p.length === 1) return v => v + p[0][1] - p[0][0];
  return v => {
    let i = 0;
    while (i < p.length - 2 && v > p[i + 1][0]) i++;
    const [a0, b0] = p[i], [a1, b1] = p[i + 1];
    return b0 + (v - a0) * (b1 - b0) / (a1 - a0);
  };
}
const center = it => [it.x + it.w / 2, it.y + it.h / 2];
const bbox = items => {
  const x0 = Math.min(...items.map(i => i.x)), y0 = Math.min(...items.map(i => i.y));
  return [x0, y0, Math.max(...items.map(i => i.x + i.w)) - x0, Math.max(...items.map(i => i.y + i.h)) - y0];
};

function parseVector(id) {
  const v = vectors[id];
  const m = v.markup.match(/^<g transform="matrix\(([^)]*)\)">(<(\w+)([^>]*)>(?:<\/\w+>)?)<\/g>$/);
  if (!m || m[1].trim() !== '1 0 0 1 0 0') return null;
  const attrs = {};
  for (const a of m[4].matchAll(/([\w-]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
  return { tag: m[3], attrs, element: m[2] };
}
function primitive(item) {
  const p = parseVector(item.vectorId);
  return p ? p.tag : 'other';
}
/** A straight-lined path in absolute commands, as [{cmd, nums}]. */
function straightPath(d) {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const out = [];
  for (const t of tokens) {
    if (/[A-Za-z]/.test(t)) { if (!'MLHVZ'.includes(t)) return null; out.push({ cmd: t, nums: [] }); }
    else if (out.length) out[out.length - 1].nums.push(Number(t)); else return null;
  }
  return out;
}

/** Can this element take a new width and height of its own (instead of moving as a whole)? */
function stretchable(item, rule) {
  if (rule.rigid) return false;
  if (item.type === 'text') return !item.svgLabel || (rule.to && rule.to.length === 4);
  if (item.type === 'image' || item.type === 'embed') return true;
  if (item.type !== 'vector') return false;
  const p = parseVector(item.vectorId);
  if (!p) return false;
  if (['rect', 'line', 'ellipse'].includes(p.tag)) return true;
  if (p.tag === 'path') return !!straightPath(p.attrs.d) && (rule.stretchPaths || Math.max(item.w, item.h) > 120);
  return false;
}

let vectorCount = 0;
const newVectors = {};
/** Recalculate a vector's geometry through the maps X and Y. */
function remapVector(item, X, Y, designId) {
  const p = parseVector(item.vectorId), a = { ...p.attrs };
  let x0, y0, x1, y1;
  if (p.tag === 'rect') {
    x0 = X(+a.x); y0 = Y(+a.y); x1 = X(+a.x + +a.width); y1 = Y(+a.y + +a.height);
    Object.assign(a, { x: round(x0), y: round(y0), width: round(x1 - x0), height: round(y1 - y0) });
  } else if (p.tag === 'line') {
    const lx1 = X(+a.x1), ly1 = Y(+a.y1), lx2 = X(+a.x2), ly2 = Y(+a.y2);
    Object.assign(a, { x1: round(lx1), y1: round(ly1), x2: round(lx2), y2: round(ly2) });
    x0 = Math.min(lx1, lx2); x1 = Math.max(lx1, lx2); y0 = Math.min(ly1, ly2); y1 = Math.max(ly1, ly2);
  } else if (p.tag === 'ellipse') {
    x0 = X(+a.cx - +a.rx); x1 = X(+a.cx + +a.rx); y0 = Y(+a.cy - +a.ry); y1 = Y(+a.cy + +a.ry);
    Object.assign(a, { cx: round((x0 + x1) / 2), cy: round((y0 + y1) / 2), rx: round((x1 - x0) / 2), ry: round((y1 - y0) / 2) });
  } else if (p.tag === 'path') {
    const xs = [], ys = [];
    a.d = straightPath(a.d).map(({ cmd, nums }) => {
      if (cmd === 'H') return 'H' + nums.map(n => { const v = round(X(n)); xs.push(v); return v; }).join(' ');
      if (cmd === 'V') return 'V' + nums.map(n => { const v = round(Y(n)); ys.push(v); return v; }).join(' ');
      if (cmd === 'Z') return 'Z';
      const pts = [];
      for (let i = 0; i < nums.length; i += 2) { const px = round(X(nums[i])), py = round(Y(nums[i + 1])); xs.push(px); ys.push(py); pts.push(px + ' ' + py); }
      return cmd + pts.join('L');
    }).join('');
    x0 = Math.min(...xs); x1 = Math.max(...xs); y0 = Math.min(...ys); y1 = Math.max(...ys);
  }
  const viewBox = [round(x0), round(y0), round(Math.max(.5, x1 - x0)), round(Math.max(.5, y1 - y0))];
  const id = `${designId}~p${vectorCount++}`;
  const attrs = Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ');
  newVectors[id] = { markup: `<g transform="matrix(1 0 0 1 0 0)"><${p.tag} ${attrs}></${p.tag}></g>`, viewBox };
  return { ...item, vectorId: id, x: viewBox[0], y: viewBox[1], w: viewBox[2], h: viewBox[3] };
}

/** Matches an element against a rule's selection. */
function selects(rule, item, index) {
  if (rule.ids && !rule.ids.includes(index)) return false;
  if (rule.in) {
    const [cx, cy] = center(item), [x0, y0, x1, y1] = rule.in;
    if (cx < x0 || cx > x1 || cy < y0 || cy > y1) return false;
  }
  if (rule.type && item.type !== rule.type) return false;
  if (rule.shape && (item.type !== 'vector' || primitive(item) !== rule.shape)) return false;
  if (rule.orient) { const o = item.w >= item.h ? 'h' : 'v'; if (o !== rule.orient) return false; }
  if (rule.where && !rule.where(item, index)) return false;
  return true;
}

/** The maps of a rule: `to` fits the selection's bounding box into a target box. */
function maps(rule, selected) {
  if (rule.to) {
    const [bx, by, bw, bh] = bbox(selected), [tx, ty, tw, th] = rule.to;
    const sx = tw === undefined ? 1 : tw / Math.max(bw, .5), sy = th === undefined ? sx : th / Math.max(bh, .5);
    // A box with its own width and height is a new layout (sizes of type stay); a box with
    // only a width scales the group as a whole.
    return { X: v => tx + (v - bx) * sx, Y: v => ty + (v - by) * sy, u: rule.u ?? (th === undefined ? sx : 1) };
  }
  const X = rule.x ? piecewise(rule.x) : piecewise([[0, rule.dx || 0]]);
  const Y = rule.y ? piecewise(rule.y) : piecewise([[0, rule.dy || 0]]);
  return { X, Y, u: rule.u ?? 1 };
}

function place(item, rule, m, designId) {
  const { X, Y, u } = m;
  let out;
  if (rule.line) {
    const p = parseVector(item.vectorId), [x1, y1, x2, y2] = rule.line;
    const viewBox = [Math.min(x1, x2), Math.min(y1, y2), Math.max(.5, Math.abs(x2 - x1)), Math.max(.5, Math.abs(y2 - y1))];
    const attrs = Object.entries({ ...p.attrs, x1, y1, x2, y2 }).map(([k, v]) => `${k}="${v}"`).join(' ');
    const id = `${designId}~p${vectorCount++}`;
    newVectors[id] = { markup: `<g transform="matrix(1 0 0 1 0 0)"><line ${attrs}></line></g>`, viewBox };
    out = { ...item, vectorId: id, x: viewBox[0], y: viewBox[1], w: viewBox[2], h: viewBox[3] };
  } else if (stretchable(item, rule)) {
    if (item.type === 'vector') out = remapVector(item, X, Y, designId);
    else {
      const x0 = X(item.x), y0 = Y(item.y), x1 = X(item.x + item.w), y1 = Y(item.y + item.h);
      out = { ...item, x: round(x0), y: round(y0), w: round(x1 - x0), h: round(y1 - y0) };
    }
  } else {
    const [cx, cy] = center(item), w = item.w * u, h = item.h * u;
    out = { ...item, x: round(X(cx) - w / 2), y: round(Y(cy) - h / 2), w: round(w), h: round(h) };
  }
  if (out.type === 'text' && u !== 1) out.size = round(out.size * u);
  if (rule.set) Object.assign(out, typeof rule.set === 'function' ? rule.set(out) : rule.set);
  return out;
}

const shift = (item, dy) => ({ ...item, y: round(item.y + dy) });

export function buildPortrait(original) {
  const spec = layouts[original.id];
  if (!spec) throw Error('Keine Hochformat-Anordnung für ' + original.id);
  const rules = spec.rules || [];
  const used = new Set();
  let items = [];
  for (const rule of rules) {
    const chosen = original.items.map((it, i) => [it, i]).filter(([it, i]) => (rule.copy || !used.has(i)) && selects(rule, it, i));
    if (!chosen.length) { if (!rule.optional) throw Error(`${original.id}: Regel ohne Elemente ${JSON.stringify({ ...rule, where: undefined })}`); continue; }
    const m = maps(rule, chosen.map(([it]) => it));
    for (const [it, i] of chosen) {
      if (!rule.copy) used.add(i);
      if (rule.drop) continue;
      const out = place(it, rule, m, original.id);
      if (rule.maxY !== undefined && out.y + out.h > rule.maxY + .01) continue;
      items.push({ ...out, _order: i + (rule.copy ? .5 : 0) });
    }
  }
  const left = original.items.map((_, i) => i).filter(i => !used.has(i));
  if (left.length) throw Error(`${original.id}: Elemente ohne Regel: ${left.join(', ')}`);
  for (const op of spec.repeat || []) {
    const [x0, y0, x1, y1] = op.band, base = items.filter(it => {
      const [cx, cy] = center(it);
      return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1 && (!op.types || op.types.includes(it.type));
    });
    if (!base.length) throw Error(`${original.id}: Wiederholung ohne Elemente ${op.band}`);
    let k = 1;
    for (; ; k++) {
      const copies = base.map(it => ({ ...shift(it, k * op.pitch), _order: it._order + k * 1e-4 }));
      if (copies.some(c => c.y + c.h > op.until + .01)) break;
      items.push(...copies);
    }
    op.made = k - 1;
  }
  if (spec.custom) items = spec.custom(items, { newVector: (markup, viewBox) => { const id = `${original.id}~p${vectorCount++}`; newVectors[id] = { markup, viewBox }; return id; } }) || items;
  // Keep the original drawing order of the elements (copies follow their original).
  items = items.map((it, n) => ({ it, n })).sort((a, b) => (a.it._order ?? 1e9) - (b.it._order ?? 1e9) || a.n - b.n).map(({ it }) => { const out = { ...it }; delete out._order; return out; });
  let grid = spec.grid === undefined ? null : typeof spec.grid === 'function' ? spec.grid(spec.repeat || []) : spec.grid;
  const portrait = { ...original, grid, svg: '', items };
  if (PAPER_IDS.includes(original.id)) portrait.svg = svgOf(portrait);
  return portrait;
}

/** Static SVG of the vector shapes (used for paper backgrounds behind pages). */
function svgOf(design) {
  return design.items.filter(it => it.type === 'vector').map(it => {
    const v = newVectors[it.vectorId] || vectors[it.vectorId];
    const sw = it.strokeWidth; // in units of the shape's own viewBox, like --template-width
    const markup = v.markup.replaceAll('var(--template-fill)', it.fill).replaceAll('var(--template-stroke)', it.color).replaceAll('var(--template-width)', round(sw));
    return `<svg x="${it.x}" y="${it.y}" width="${it.w}" height="${it.h}" viewBox="${v.viewBox.join(' ')}" preserveAspectRatio="none" overflow="visible"${it.opacity !== 1 ? ` opacity="${it.opacity}"` : ''}>${markup}</svg>`;
  }).join('');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const portraits = originals.map(buildPortrait);
  const bad = [];
  for (const p of portraits) for (const it of p.items) {
    if (it.x < -1 || it.y < -1 || it.x + it.w > W + 1 || it.y + it.h > H + 1) bad.push(`${p.id}: ${it.type} ${it.x},${it.y} ${it.w}×${it.h}`);
  }
  if (bad.length) console.warn('Außerhalb der Seite:\n' + bad.join('\n'));
  fs.writeFileSync(new URL('page-templates-portrait.json', dir), JSON.stringify(portraits));
  fs.writeFileSync(new URL('template-vectors-portrait.json', dir), JSON.stringify(newVectors));
  console.log(`${portraits.length} Hochformat-Vorlagen, ${Object.keys(newVectors).length} neu berechnete Formen.`);
}
