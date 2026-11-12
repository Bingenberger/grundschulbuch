// The seven customers of the reference shop, drawn as SVG (200 × 240).
// Port of the reference drawings; no user text goes into these strings.
import type { Mood } from './checkout';

const EYE = '#3b2a20';
type Face = { skin: string; shade: string; brow: string; mood: Mood; ears?: boolean; rx?: number; ry?: number };

function face(f: Face) {
  const rx = f.rx ?? 44, ry = f.ry ?? 50;
  let s = '';
  if (f.ears !== false)
    s += `<ellipse cx="${100 - rx + 1}" cy="100" rx="9" ry="12" fill="${f.skin}" stroke="${f.shade}" stroke-width="2"/><ellipse cx="${100 + rx - 1}" cy="100" rx="9" ry="12" fill="${f.skin}" stroke="${f.shade}" stroke-width="2"/>`;
  s += `<ellipse cx="100" cy="96" rx="${rx}" ry="${ry}" fill="${f.skin}" stroke="${f.shade}" stroke-width="2"/>`;
  s += `<circle cx="76" cy="116" r="8" fill="#ff7b6b" opacity=".28"/><circle cx="124" cy="116" r="8" fill="#ff7b6b" opacity=".28"/>`;
  s += `<ellipse cx="84" cy="99" rx="5" ry="6.5" fill="${EYE}"/><ellipse cx="116" cy="99" rx="5" ry="6.5" fill="${EYE}"/><circle cx="85.8" cy="96.6" r="1.8" fill="#fff"/><circle cx="117.8" cy="96.6" r="1.8" fill="#fff"/>`;
  s += f.mood === 'sad'
    ? `<path d="M74 88q9-1 18-7M108 81q9 6 18 7" fill="none" stroke="${f.brow}" stroke-width="4" stroke-linecap="round"/>`
    : `<path d="M74 85q10-7 20-2M106 83q10-5 20 2" fill="none" stroke="${f.brow}" stroke-width="4" stroke-linecap="round"/>`;
  s += `<path d="M100 104q-6 11 1 13" fill="none" stroke="${f.shade}" stroke-width="2.6" stroke-linecap="round"/>`;
  s += f.mood === 'sad'
    ? `<path d="M88 132q12-9 24 0" fill="none" stroke="#7a2e2e" stroke-width="3.4" stroke-linecap="round"/>`
    : `<path d="M86 124q14 13 28 0" fill="#fff" stroke="#7a2e2e" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return s;
}

function body(b: { cloth: string; dark: string; skin: string; shade: string; neck?: 'v' | 'none' }) {
  let s = `<rect x="86" y="132" width="28" height="44" rx="10" fill="${b.skin}" stroke="${b.shade}" stroke-width="2"/>`;
  s += `<path d="M18 240C20 196 46 170 100 168C154 170 180 196 182 240Z" fill="${b.cloth}" stroke="${b.dark}" stroke-width="2.5"/>`;
  if (b.neck === 'v') s += `<path d="M84 169L100 196L116 169Z" fill="${b.skin}" stroke="${b.dark}" stroke-width="2.5" stroke-linejoin="round"/>`;
  else if (b.neck !== 'none') s += `<path d="M82 169Q100 186 118 169" fill="${b.skin}" stroke="${b.dark}" stroke-width="2.5"/>`;
  s += `<path d="M48 206Q52 226 50 240M152 206Q148 226 150 240" fill="none" stroke="${b.dark}" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`;
  return s;
}

const svg = (inner: string, child: boolean) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="100%" height="100%" aria-hidden="true">${child ? `<g transform="translate(9 30) scale(.91)">${inner}</g>` : inner}</svg>`;

export type Customer = { pitch: number; rate: number; child: boolean; greet: string; draw: (mood: Mood) => string };

export const CUSTOMERS: Customer[] = [
  { pitch: 1.35, rate: 1.02, child: true, greet: 'Hallo!', draw: (mood) => {
    const skin = '#f6d3b8', shade = '#d9a685', hair = '#8a4b22';
    let s = '';
    for (const side of [-1, 1]) {
      for (let k = 0; k < 5; k++) s += `<ellipse cx="${100 + side * (50 + k * 1.5)}" cy="${118 + k * 17}" rx="11" ry="10" fill="${hair}" stroke="#6b3615" stroke-width="2"/>`;
      s += `<path d="M${100 + side * 57} 200l${side * 12} -8l0 18z" fill="#e8590c"/><circle cx="${100 + side * 57}" cy="201" r="4" fill="#c2410c"/>`;
    }
    s += body({ cloth: '#f76707', dark: '#c2410c', skin, shade });
    s += `<text x="100" y="222" text-anchor="middle" font-family="Verdana, sans-serif" font-size="26" font-weight="700" fill="#fff4e6">★</text>`;
    s += face({ skin, shade, brow: hair, mood });
    s += `<path d="M55 98C50 52 80 40 100 41C120 40 150 52 145 98C138 74 124 60 103 59L100 66L97 59C76 60 62 74 55 98Z" fill="${hair}" stroke="#6b3615" stroke-width="2" stroke-linejoin="round"/>`;
    return svg(s, true);
  } },
  { pitch: 1.25, rate: 1.05, child: true, greet: 'Hallo!', draw: (mood) => {
    const skin = '#8d5a3b', shade = '#6b3f26', hair = '#1f1a17';
    let s = body({ cloth: '#2f9e44', dark: '#1e7a31', skin, shade, neck: 'none' });
    s += `<path d="M66 172Q100 196 134 172" fill="none" stroke="#1e7a31" stroke-width="7" stroke-linecap="round"/><path d="M90 186v26M110 186v26" stroke="#e9ecef" stroke-width="3" stroke-linecap="round"/>`;
    s += face({ skin, shade, brow: hair, mood });
    for (const x of [58, 64, 136, 142]) s += `<circle cx="${x}" cy="86" r="7" fill="${hair}"/>`;
    s += `<path d="M55 86C55 42 145 42 145 86Z" fill="#1c7ed6" stroke="#1864ab" stroke-width="2.5" stroke-linejoin="round"/>`;
    s += `<path d="M52 86Q104 74 164 84L170 94Q110 86 52 96Z" fill="#1864ab" stroke="#124e8a" stroke-width="2" stroke-linejoin="round"/><circle cx="100" cy="44" r="4" fill="#124e8a"/>`;
    s += `<path d="M100 46V84" stroke="#1864ab" stroke-width="2" opacity=".6"/>`;
    return svg(s, true);
  } },
  { pitch: 1.1, rate: 0.98, child: false, greet: 'Guten Tag!', draw: (mood) => {
    const skin = '#c98c5c', shade = '#a26c42';
    let s = `<path d="M50 104C44 40 156 40 150 104C154 146 148 176 100 184C52 176 46 146 50 104Z" fill="#0c8599" stroke="#0b7285" stroke-width="2.5"/>`;
    s += body({ cloth: '#9c36b5', dark: '#7b2a8f', skin, shade, neck: 'none' });
    s += `<path d="M58 170Q100 196 142 170Q132 190 100 194Q68 190 58 170Z" fill="#0c8599" stroke="#0b7285" stroke-width="2.5"/>`;
    s += face({ skin, shade, brow: '#2b1d14', mood, ears: false, rx: 38, ry: 46 });
    s += `<path d="M58 88C52 30 148 30 142 88C130 70 70 70 58 88Z" fill="#0c8599" stroke="#0b7285" stroke-width="2.5" stroke-linejoin="round"/>`;
    s += `<path d="M60 86C72 70 128 70 140 86" fill="none" stroke="#15aabf" stroke-width="6" stroke-linecap="round"/>`;
    return svg(s, false);
  } },
  { pitch: 0.8, rate: 0.96, child: false, greet: 'Guten Tag!', draw: (mood) => {
    const skin = '#f2c79a', shade = '#cf9b6c', hair = '#5c3d24';
    let s = body({ cloth: '#1971c2', dark: '#145a9c', skin, shade, neck: 'v' });
    s += `<path d="M84 169L74 186L94 182ZM116 169L126 186L106 182Z" fill="#e7f5ff" stroke="#145a9c" stroke-width="2" stroke-linejoin="round"/>`;
    s += face({ skin, shade, brow: hair, mood });
    s += `<path d="M57 100C59 150 141 150 143 100C137 126 125 138 100 140C75 138 63 126 57 100Z" fill="${hair}" stroke="#432b18" stroke-width="2"/>`;
    s += `<path d="M84 117q16-9 32 0q-16 7-32 0Z" fill="${hair}"/>`;
    s += `<path d="M56 92C50 30 150 30 144 92C140 70 128 60 100 60C72 60 60 70 56 92Z" fill="${hair}" stroke="#432b18" stroke-width="2" stroke-linejoin="round"/>`;
    return svg(s, false);
  } },
  { pitch: 1.05, rate: 0.9, child: false, greet: 'Guten Tag!', draw: (mood) => {
    const skin = '#ffdcbc', shade = '#e0b28c', hair = '#c9ccd1';
    let s = `<circle cx="100" cy="42" r="19" fill="${hair}" stroke="#9aa0a7" stroke-width="2"/>`;
    s += body({ cloth: '#c2255c', dark: '#9c1d4a', skin, shade });
    s += `<path d="M100 186V240" stroke="#9c1d4a" stroke-width="2.5"/><circle cx="108" cy="204" r="3" fill="#fff0f6"/><circle cx="108" cy="224" r="3" fill="#fff0f6"/>`;
    for (let k = 0; k < 9; k++) {
      const a = Math.PI * (0.15 + (0.7 * k) / 8);
      s += `<circle cx="${100 - Math.cos(a) * 22}" cy="${170 + Math.sin(a) * 14}" r="3" fill="#f8f9fa" stroke="#ced4da" stroke-width="1"/>`;
    }
    s += face({ skin, shade, brow: '#9aa0a7', mood });
    s += `<path d="M54 100C46 52 78 44 100 46C122 44 154 52 146 100C140 76 126 64 100 66C74 64 60 76 54 100Z" fill="${hair}" stroke="#9aa0a7" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<circle cx="84" cy="99" r="13" fill="#ffffff" fill-opacity=".25" stroke="#6c5442" stroke-width="2.6"/><circle cx="116" cy="99" r="13" fill="#ffffff" fill-opacity=".25" stroke="#6c5442" stroke-width="2.6"/><path d="M97 97q3-3 6 0M71 96l-14-4M129 96l14-4" fill="none" stroke="#6c5442" stroke-width="2.6" stroke-linecap="round"/>`;
    return svg(s, false);
  } },
  { pitch: 0.7, rate: 0.9, child: false, greet: 'Guten Tag!', draw: (mood) => {
    const skin = '#6b4128', shade = '#4d2c19', hair = '#eef0f2';
    let s = body({ cloth: '#8d6e63', dark: '#6d5047', skin, shade, neck: 'v' });
    s += `<path d="M84 169L100 196L116 169" fill="#f1f3f5" stroke="#6d5047" stroke-width="2"/><path d="M80 170L92 214L72 190ZM120 170L108 214L128 190Z" fill="#a1887f" stroke="#6d5047" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<path d="M100 178L88 171V187ZM100 178L112 171V187Z" fill="#c92a2a" stroke="#962020" stroke-width="1.6" stroke-linejoin="round"/><circle cx="100" cy="178" r="3.4" fill="#962020"/>`;
    s += face({ skin, shade, brow: hair, mood });
    s += `<ellipse cx="84" cy="60" rx="12" ry="5" fill="#fff" opacity=".2" transform="rotate(-18 84 60)"/>`;
    const x = (side: number, v: number) => 100 + side * (100 - v);
    for (const side of [-1, 1])
      s += `<path d="M${x(side, 51)} 92C${x(side, 45)} 84 ${x(side, 46)} 74 ${x(side, 53)} 69C${x(side, 53)} 61 ${x(side, 61)} 55 ${x(side, 69)} 58C${x(side, 64)} 67 ${x(side, 62)} 78 ${x(side, 61)} 90Z" fill="${hair}" stroke="#ced4da" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<path d="M84 120q8-7 16-3q8-4 16 3q-3 5-16 3q-13 2-16-3Z" fill="${hair}" stroke="#ced4da" stroke-width="1.5" stroke-linejoin="round"/>`;
    return svg(s, false);
  } },
  { pitch: 1.2, rate: 1.08, child: false, greet: 'Hi!', draw: (mood) => {
    const skin = '#e9b98f', shade = '#c98f62', hair = '#3a2418';
    let s = `<path d="M118 50C150 30 178 52 166 92C160 112 150 124 140 130C148 104 150 78 126 64Z" fill="${hair}" stroke="#24160e" stroke-width="2" stroke-linejoin="round"/>`;
    s += body({ cloth: '#fab005', dark: '#d9930a', skin, shade });
    s += `<path d="M104 198L90 220H101L96 236L112 212H101Z" fill="#fff9db" stroke="#d9930a" stroke-width="1.6" stroke-linejoin="round"/>`;
    s += `<path d="M70 160Q100 178 130 160" fill="none" stroke="#343a40" stroke-width="6" stroke-linecap="round"/>`;
    for (const side of [-1, 1])
      s += `<rect x="${100 + side * 33 - 11}" y="156" width="22" height="26" rx="10" fill="#12b886" stroke="#087f5b" stroke-width="2.5" transform="rotate(${side * -18} ${100 + side * 33} 169)"/>`;
    s += face({ skin, shade, brow: hair, mood });
    s += `<circle cx="57" cy="114" r="3" fill="#fab005" stroke="#d9930a" stroke-width="1.2"/><circle cx="143" cy="114" r="3" fill="#fab005" stroke="#d9930a" stroke-width="1.2"/>`;
    s += `<path d="M56 98C48 50 80 40 102 41C126 41 154 54 145 98C142 80 134 66 120 60C104 70 80 74 60 90Z" fill="${hair}" stroke="#24160e" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<path d="M76 66C90 62 106 60 118 60" fill="none" stroke="#5c3a26" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`;
    s += `<circle cx="126" cy="50" r="6" fill="#e64980" stroke="#a61e4d" stroke-width="2"/>`;
    return svg(s, false);
  } },
];
