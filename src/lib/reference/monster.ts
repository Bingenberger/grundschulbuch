/* eslint-disable */
// @ts-nocheck
// “Monsternamen lesen” – the widget of the reference (Lernsachen-Heft), taken
// over unchanged: monsters, made-up names from the letters the children know,
// syllables to tap and hear, catching the monster, certificate.
// MonsterReader.tsx shows it and handles taps, speech and the animation.

// Fonts of the reference mapped to ours.
const Ve = (s) => ({ andika: '"Andika", Verdana, sans-serif', grund: '"Playwrite DE Grund", Andika, sans-serif', druck: '"Andika", Verdana, sans-serif' })[s] ?? '"Andika", sans-serif';
var ze = [{ id: `andika`, family: `LH Andika`, label: `Andika`, hint: `f\xFCr Leseanf\xE4nger, einst\xF6ckiges a`, fallback: `Verdana, sans-serif` }, { id: `druck`, family: `LH Druckschrift`, label: `Druckschrift`, hint: `Grundschul-Druckschrift wie in Bayern (Gruschudru)`, fallback: `Andika, Verdana, sans-serif` }, { id: `grund`, family: `LH Grundschrift`, label: `Grundschrift`, hint: `wie in der Schule (Playwrite DE Grund)`, fallback: `Andika, Verdana, sans-serif` }, { id: `schreib`, family: `LH Schreibschrift`, label: `Schreibschrift VA`, hint: `verbundene Schrift (Vereinfachte Ausgangsschrift)`, fallback: `cursive` }, { id: `sas`, family: `LH Schreibschrift SAS`, label: `Schreibschrift SAS`, hint: `verbundene Schrift (Schulausgangsschrift, z. B. in Bayern)`, fallback: `cursive` }, { id: `lexend`, family: `LH Lexend`, label: `Lexend`, hint: `besonders leicht lesbar, weite Buchstaben`, fallback: `Verdana, sans-serif` }, { id: `nunito`, family: `LH Nunito`, label: `Nunito`, hint: `serifenlos, freundlich`, fallback: `system-ui, sans-serif` }, { id: `atkinson`, family: `LH Atkinson Hyperlegible`, label: `Atkinson`, hint: `barrierefrei, gut unterscheidbare Buchstaben`, fallback: `Verdana, sans-serif` }, { id: `merriweather`, family: `LH Merriweather`, label: `Merriweather`, hint: `mit Serifen, wie in B\xFCchern`, fallback: `Georgia, serif` }, { id: `caveat`, family: `LH Caveat`, label: `Handschrift`, hint: `locker wie mit dem Stift geschrieben`, fallback: `cursive` }, { id: `comic`, family: `LH Comic`, label: `Comic`, hint: `gro\xDFe Comic-Buchstaben (Bangers)`, fallback: `Impact, sans-serif` }];
function Be(e10) {
  return ze.find((t10) => t10.id === e10) ?? ze[0];
}
function referenceFamily(e10) {
  let t10 = Be(e10);
  return `"${t10.family}", ${t10.fallback}`;
}
function up(e10) {
  let t10 = Wf((e10.tuner ?? Uf).inst);
  return `Stimmger\xE4t${t10.strings.length ? ` f\xFCr ${t10.label}: ${t10.strings.map(Kf).join(` `)}` : `, chromatisch`}. Tippe auf das Mikrofon und spiel einen Ton.`;
}
var Ote = `
.lh-wg-tuner .lh-key{cursor:pointer}
.lh-edit .lh-wg-tuner:not(.is-armed) .lh-key{cursor:inherit}
`, dp = `#2b2540`, fp = `stroke="${dp}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"`, pp = `stroke="${dp}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`, mp = { blob: { y: 96, w: 56, top: 42, side: 66 }, tall: { y: 76, w: 44, top: 24, side: 50 }, pear: { y: 84, w: 36, top: 38, side: 64 }, box: { y: 86, w: 52, top: 38, side: 52 }, ghost: { y: 86, w: 50, top: 32, side: 60 }, spiky: { y: 100, w: 50, top: 40, side: 62 }, bean: { y: 90, w: 44, top: 40, side: 58 }, cone: { y: 116, w: 40, top: 30, side: 62 } };
function kte() {
  let e10 = [];
  for (let t10 = 0; t10 < 18; t10++) {
    let n10 = Math.PI * 2 * t10 / 18 - Math.PI / 2, r10 = t10 % 2 ? 66 : 80;
    e10.push(`${(100 + Math.cos(n10) * r10 * 0.92).toFixed(1)} ${(112 + Math.sin(n10) * r10 * 0.86).toFixed(1)}`);
  }
  return `M${e10.join(`L`)}Z`;
}
var Ate = { blob: `M100 40C152 40 174 80 172 122C170 162 140 180 100 180C60 180 30 162 28 122C26 80 48 40 100 40Z`, tall: `M100 22C140 22 152 58 152 100V152C152 174 132 182 100 182C68 182 48 174 48 152V100C48 58 60 22 100 22Z`, pear: `M100 36C126 36 138 62 140 86C144 114 178 128 172 158C166 180 136 182 100 182C64 182 34 180 28 158C22 128 56 114 60 86C62 62 74 36 100 36Z`, box: `M46 52Q46 36 62 36H138Q154 36 154 52V164Q154 180 138 180H62Q46 180 46 164Z`, ghost: `M38 112C38 60 66 30 100 30C134 30 162 60 162 112V178L146 164L130 180L114 164L100 180L86 164L70 180L54 164L38 178Z`, spiky: kte(), bean: `M72 40C112 30 162 52 162 102C162 152 140 180 100 180C68 180 38 162 38 128C38 104 58 96 56 76C54 56 58 44 72 40Z`, cone: `M100 26C112 26 178 160 172 172C166 182 34 182 28 172C22 160 88 26 100 26Z` };
function hp(e10, t10, n10, r10 = 0) {
  return `<circle cx="${e10}" cy="${t10}" r="${n10}" fill="#ffffff" ${fp}/><circle cx="${e10 + r10 * n10 * 0.25}" cy="${t10 + n10 * 0.12}" r="${n10 * 0.5}" fill="${dp}"/><circle cx="${e10 + r10 * n10 * 0.25 - n10 * 0.18}" cy="${t10 - n10 * 0.1}" r="${n10 * 0.17}" fill="#ffffff"/>`;
}
function jte(e10) {
  let t10 = mp[e10.body];
  return e10.eyes === 1 ? hp(100, t10.y, t10.w * 0.42, 0.4) : e10.eyes === 2 ? hp(100 - t10.w * 0.42, t10.y, t10.w * 0.3, 0.5) + hp(100 + t10.w * 0.42, t10.y, t10.w * 0.3, 0.5) : hp(100 - t10.w * 0.55, t10.y + 4, t10.w * 0.22, 0.4) + hp(100, t10.y - 8, t10.w * 0.26, 0.4) + hp(100 + t10.w * 0.55, t10.y + 4, t10.w * 0.22, 0.4);
}
function Mte(e10) {
  let t10 = mp[e10.body], n10 = t10.y + 38 + (e10.eyes === 1 ? 4 : 0), r10 = Math.max(26, t10.w * 0.62);
  switch (e10.mouth) {
    case `smile`:
      return `<path d="M${100 - r10} ${n10 - 6}Q100 ${n10 + 30} ${100 + r10} ${n10 - 6}Q100 ${n10 + 6} ${100 - r10} ${n10 - 6}Z" fill="#7a1f3d" ${fp}/><path d="M${100 - r10 * 0.4} ${n10 + 12}Q100 ${n10 + 2} ${100 + r10 * 0.4} ${n10 + 12}Q100 ${n10 + 20} ${100 - r10 * 0.4} ${n10 + 12}Z" fill="#ff8fab"/>`;
    case `fangs`:
      return `<path d="M${100 - r10} ${n10 - 4}Q100 ${n10 + 24} ${100 + r10} ${n10 - 4}Z" fill="#7a1f3d" ${fp}/><path d="M${100 - r10 * 0.62} ${n10 - 2}l7 13l7 -12z M${100 + r10 * 0.62} ${n10 - 2}l-7 13l-7 -12z" fill="#ffffff" ${pp}/>`;
    case `zigzag`: {
      let e11 = `M${100 - r10} ${n10}`;
      for (let t11 = 1; t11 <= 6; t11++) e11 += `L${(100 - r10 + 2 * r10 * t11 / 6).toFixed(1)} ${t11 % 2 ? n10 - 8 : n10}`;
      return `<path d="${e11}" fill="none" ${fp}/>`;
    }
    case `o`:
      return `<ellipse cx="100" cy="${n10}" rx="11" ry="13" fill="#7a1f3d" ${fp}/><ellipse cx="100" cy="${n10 + 5}" rx="6" ry="4" fill="#ff8fab"/>`;
    case `grin`:
      return `<path d="M${100 - r10} ${n10 - 8}Q${100 - r10} ${n10 + 16} 100 ${n10 + 16}Q${100 + r10} ${n10 + 16} ${100 + r10} ${n10 - 8}Z" fill="#ffffff" ${fp}/><path d="M${100 - r10 + 4} ${n10 + 2}H${100 + r10 - 4}M${100 - r10 * 0.33} ${n10 - 7}V${n10 + 15}M100 ${n10 - 7}V${n10 + 16}M${100 + r10 * 0.33} ${n10 - 7}V${n10 + 15}" fill="none" ${pp}/>`;
  }
}
function Nte(e10) {
  let t10 = mp[e10.body], n10 = ``;
  for (let r10 of e10.extras) r10 === `horns` && (n10 += `<path d="M${100 - t10.w * 0.62} ${t10.top + 14}C${100 - t10.w * 0.9} ${t10.top - 4} ${100 - t10.w * 0.98} ${t10.top - 22} ${100 - t10.w * 0.74} ${t10.top - 34}C${100 - t10.w * 0.58} ${t10.top - 16} ${100 - t10.w * 0.34} ${t10.top - 4} ${100 - t10.w * 0.26} ${t10.top + 10}Z" fill="#fff3bf" ${fp}/><path d="M${100 + t10.w * 0.62} ${t10.top + 14}C${100 + t10.w * 0.9} ${t10.top - 4} ${100 + t10.w * 0.98} ${t10.top - 22} ${100 + t10.w * 0.74} ${t10.top - 34}C${100 + t10.w * 0.58} ${t10.top - 16} ${100 + t10.w * 0.34} ${t10.top - 4} ${100 + t10.w * 0.26} ${t10.top + 10}Z" fill="#fff3bf" ${fp}/>`), r10 === `antennae` && (n10 += `<path d="M84 ${t10.top + 10}Q70 ${t10.top - 18} 60 ${t10.top - 30}M116 ${t10.top + 10}Q130 ${t10.top - 18} 140 ${t10.top - 30}" fill="none" ${fp}/><circle cx="60" cy="${t10.top - 32}" r="9" fill="#ffd43b" ${fp}/><circle cx="140" cy="${t10.top - 32}" r="9" fill="#ffd43b" ${fp}/>`), r10 === `ears` && (n10 += `<path d="M${100 - t10.w * 0.9} ${t10.top + 26}L${100 - t10.w * 0.86} ${t10.top - 22}L${100 - t10.w * 0.2} ${t10.top + 8}Z" fill="${e10.color}" ${fp}/><path d="M${100 + t10.w * 0.9} ${t10.top + 26}L${100 + t10.w * 0.86} ${t10.top - 22}L${100 + t10.w * 0.2} ${t10.top + 8}Z" fill="${e10.color}" ${fp}/>`), r10 === `wings` && (n10 += `<path d="M${100 - t10.side + 6} 104C${100 - t10.side - 20} 70 ${100 - t10.side - 48} 72 ${100 - t10.side - 58} 92C${100 - t10.side - 44} 96 ${100 - t10.side - 44} 112 ${100 - t10.side - 32} 118C${100 - t10.side - 22} 112 ${100 - t10.side - 14} 124 ${100 - t10.side + 4} 128Z" fill="${e10.light}" ${fp}/><path d="M${100 + t10.side - 6} 104C${100 + t10.side + 20} 70 ${100 + t10.side + 48} 72 ${100 + t10.side + 58} 92C${100 + t10.side + 44} 96 ${100 + t10.side + 44} 112 ${100 + t10.side + 32} 118C${100 + t10.side + 22} 112 ${100 + t10.side + 14} 124 ${100 + t10.side - 4} 128Z" fill="${e10.light}" ${fp}/>`), r10 === `tail` && (n10 += `<path d="M${100 + t10.side - 10} 160C${100 + t10.side + 30} 168 ${100 + t10.side + 34} 130 ${100 + t10.side + 14} 128C${100 + t10.side} 128 ${100 + t10.side + 4} 146 ${100 + t10.side + 16} 142" fill="none" stroke="${dp}" stroke-width="13" stroke-linecap="round"/><path d="M${100 + t10.side - 10} 160C${100 + t10.side + 30} 168 ${100 + t10.side + 34} 130 ${100 + t10.side + 14} 128C${100 + t10.side} 128 ${100 + t10.side + 4} 146 ${100 + t10.side + 16} 142" fill="none" stroke="${e10.color}" stroke-width="6" stroke-linecap="round"/>`), r10 === `arms` && (n10 += `<path d="M${100 - t10.side + 8} 128C${100 - t10.side - 14} 122 ${100 - t10.side - 24} 104 ${100 - t10.side - 22} 88" fill="none" stroke="${dp}" stroke-width="15" stroke-linecap="round"/><path d="M${100 - t10.side + 8} 128C${100 - t10.side - 14} 122 ${100 - t10.side - 24} 104 ${100 - t10.side - 22} 88" fill="none" stroke="${e10.color}" stroke-width="7" stroke-linecap="round"/><path d="M${100 + t10.side - 8} 128C${100 + t10.side + 14} 134 ${100 + t10.side + 26} 150 ${100 + t10.side + 30} 164" fill="none" stroke="${dp}" stroke-width="15" stroke-linecap="round"/><path d="M${100 + t10.side - 8} 128C${100 + t10.side + 14} 134 ${100 + t10.side + 26} 150 ${100 + t10.side + 30} 164" fill="none" stroke="${e10.color}" stroke-width="7" stroke-linecap="round"/>`), r10 === `feet` && (n10 += `<ellipse cx="76" cy="182" rx="20" ry="11" fill="${e10.color}" ${fp}/><ellipse cx="124" cy="182" rx="20" ry="11" fill="${e10.color}" ${fp}/>`);
  return n10;
}
function Pte(e10) {
  let t10 = mp[e10.body], n10 = ``;
  for (let r10 of e10.extras) r10 === `belly` && (n10 += `<ellipse cx="100" cy="${Math.min(150, t10.y + 66)}" rx="${t10.w * 0.8}" ry="${Math.max(16, 172 - t10.y - 66)}" fill="${e10.light}" opacity="0.9"/>`), r10 === `spots` && (n10 += `<circle cx="${100 - t10.side * 0.6}" cy="150" r="9" fill="${e10.light}"/><circle cx="${100 + t10.side * 0.55}" cy="140" r="12" fill="${e10.light}"/><circle cx="${100 + t10.side * 0.25}" cy="166" r="6" fill="${e10.light}"/><circle cx="${100 - t10.side * 0.25}" cy="${t10.top + 18}" r="7" fill="${e10.light}"/>`), r10 === `stripes` && (n10 += `<path d="M${100 - t10.w * 0.7} 150Q100 160 ${100 + t10.w * 0.7} 150M${100 - t10.w * 0.6} 166Q100 175 ${100 + t10.w * 0.6} 166" fill="none" stroke="${e10.light}" stroke-width="7" stroke-linecap="round"/>`), r10 === `tuft` && (n10 += `<path d="M86 ${t10.top + 4}C80 ${t10.top - 18} 92 ${t10.top - 26} 96 ${t10.top - 12}C96 ${t10.top - 30} 112 ${t10.top - 30} 106 ${t10.top - 10}C116 ${t10.top - 22} 126 ${t10.top - 10} 114 ${t10.top + 4}" fill="${e10.light}" ${fp}/>`);
  return n10;
}
var gp = [{ body: `blob`, color: `#69db7c`, light: `#d3f9d8`, eyes: 2, mouth: `fangs`, extras: [`horns`, `feet`, `spots`] }, { body: `tall`, color: `#b197fc`, light: `#e5dbff`, eyes: 1, mouth: `smile`, extras: [`antennae`, `arms`, `belly`] }, { body: `pear`, color: `#ffa94d`, light: `#ffe8cc`, eyes: 3, mouth: `zigzag`, extras: [`tuft`, `feet`] }, { body: `box`, color: `#74c0fc`, light: `#d0ebff`, eyes: 2, mouth: `grin`, extras: [`ears`, `stripes`, `feet`] }, { body: `ghost`, color: `#faa2c1`, light: `#ffdeeb`, eyes: 2, mouth: `o`, extras: [`arms`, `spots`] }, { body: `spiky`, color: `#ffe066`, light: `#fff9db`, eyes: 2, mouth: `fangs`, extras: [`feet`, `spots`] }, { body: `bean`, color: `#63e6be`, light: `#c3fae8`, eyes: 1, mouth: `smile`, extras: [`antennae`, `tail`, `feet`] }, { body: `cone`, color: `#ff8787`, light: `#ffe3e3`, eyes: 2, mouth: `zigzag`, extras: [`horns`, `feet`, `spots`] }, { body: `blob`, color: `#4dabf7`, light: `#a5d8ff`, eyes: 2, mouth: `grin`, extras: [`wings`, `feet`, `belly`] }, { body: `tall`, color: `#c0eb75`, light: `#e9fac8`, eyes: 3, mouth: `o`, extras: [`tuft`, `arms`, `stripes`] }, { body: `box`, color: `#9775fa`, light: `#d0bfff`, eyes: 1, mouth: `fangs`, extras: [`horns`, `belly`, `feet`] }, { body: `pear`, color: `#f783ac`, light: `#ffdeeb`, eyes: 2, mouth: `smile`, extras: [`ears`, `spots`, `feet`] }, { body: `ghost`, color: `#66d9e8`, light: `#c5f6fa`, eyes: 1, mouth: `zigzag`, extras: [`antennae`, `arms`] }, { body: `spiky`, color: `#ff922b`, light: `#ffd8a8`, eyes: 3, mouth: `grin`, extras: [`tail`, `feet`] }, { body: `bean`, color: `#ffd43b`, light: `#fff3bf`, eyes: 2, mouth: `o`, extras: [`wings`, `feet`, `spots`] }, { body: `cone`, color: `#91a7ff`, light: `#dbe4ff`, eyes: 1, mouth: `smile`, extras: [`tuft`, `arms`, `belly`] }], _p = gp.length;
function vp(e10) {
  let t10 = gp[(e10 % gp.length + gp.length) % gp.length];
  return `<g><ellipse cx="100" cy="186" rx="62" ry="8" fill="#000000" opacity="0.12"/>` + Nte(t10) + `<path d="${Ate[t10.body]}" fill="${t10.color}" ${fp}/>` + Pte(t10) + jte(t10) + Mte(t10) + `<path d="M${100 - mp[t10.body].w * 0.9} ${mp[t10.body].y + 26}q6 4 12 0M${100 + mp[t10.body].w * 0.9 - 12} ${mp[t10.body].y + 26}q6 4 12 0" fill="none" stroke="#ff6b9a" stroke-width="5" stroke-linecap="round" opacity="0.55"/></g>`;
}
function Fte(e10, t10 = 200) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-32 -24 264 222" width="${t10}" height="${Math.round(t10 * 222 / 264)}">${vp(e10)}</svg>`;
}
var yp = [`andika`, `druck`, `grund`], Ite = `m a l o i s e r n u`, bp = [{ id: `lower`, label: `klein: mo la` }, { id: `upper`, label: `GROSS: MO LA` }, { id: `mixed`, label: `gemischt: Mo la` }], xp = /* @__PURE__ */ new Set([`a`, `e`, `i`, `o`, `u`, `\xE4`, `\xF6`, `\xFC`, `ei`, `au`, `eu`, `\xE4u`, `ie`]), Lte = [`sch`, `ch`, `ei`, `au`, `eu`, `\xE4u`, `ie`, `qu`, `pf`], Sp = /* @__PURE__ */ new Set([`\xDF`, `x`, `y`, `c`, `q`, `ch`]), Rte = /* @__PURE__ */ new Set([`m`, `n`, `l`, `r`, `s`, `t`, `f`, `k`, `p`, `sch`, `ch`]), Cp = new Set(`mama.papa.popo.pipi.kaka.pupu.hure.nazi.titi.fotze.pimmel.kacke.mist.sau.m\xF6se.pisse.kotze.nutte.tunte.homo.lusche.pussi.muschi.arsch.dumme.doofi.bulle`.split(`.`)), wp = /* @__PURE__ */ new Set([`fik`, `fuk`, `pis`, `kak`, `kot`, `hur`, `dum`, `fot`, `tit`, `puf`, `pup`, `sau`, `schis`, `schei`, `scheis`, `sex`, `nut`, `pim`, `m\xF6s`, `dof`]);
function Tp(e10) {
  let t10 = [];
  for (let n10 of e10.toLowerCase().split(/[^a-zäöüß]+/).filter(Boolean)) if (n10.length > 1 && Lte.includes(n10)) t10.push(n10);
  else for (let e11 of n10) t10.push(e11);
  return [...new Set(t10)];
}
var Ep = (e10, t10) => {
  let n10 = e10.filter((e11) => xp.has(e11)), r10 = e10.filter((e11) => !xp.has(e11) && !Sp.has(e11)), i10 = e10.filter((e11) => Rte.has(e11)), a10 = r10.flatMap((e11) => n10.map((t11) => e11 === `qu` && t11 === `u` ? `` : e11 + t11)).filter((e11) => e11 && !wp.has(e11)), o10 = t10 ? a10.flatMap((e11) => i10.map((t11) => e11 + t11)).filter((e11) => !wp.has(e11)) : [];
  return { open: a10, last: [...a10, ...o10], ok: n10.length > 0 && r10.length > 0 };
};
function Dp(e10, t10) {
  let { open: n10, last: r10 } = Ep(e10, t10), i10 = [];
  for (let e11 of n10) for (let t11 of r10) e11 !== t11 && !Cp.has(e11 + t11) && i10.push([e11, t11]);
  return i10;
}
function zte(e10, t10) {
  let { open: n10, last: r10 } = Ep(e10, t10), i10 = (e11) => e11[Math.floor(Math.random() * e11.length)], a10 = /* @__PURE__ */ new Set(), o10 = [];
  if (n10.length < 2) return o10;
  for (let e11 = 0; e11 < 12e3 && o10.length < 3e3; e11++) {
    let e12 = [i10(n10), i10(n10), i10(r10)], t11 = e12.join(`-`);
    e12[0] === e12[1] || e12[1] === e12[2] || a10.has(t11) || Cp.has(e12[0] + e12[1]) || Cp.has(e12[1] + e12[2]) || Cp.has(e12.join(``)) || (a10.add(t11), o10.push(e12));
  }
  return o10;
}
function Bte(e10, t10, n10) {
  if (n10 === 2) return Dp(e10, t10).length;
  let { open: r10, last: i10 } = Ep(e10, t10);
  return r10.length < 2 ? 0 : r10.length * (r10.length - 1) * (i10.length - 1);
}
function Op(e10) {
  return e10.some((e11) => xp.has(e11)) ? e10.some((e11) => !xp.has(e11) && !Sp.has(e11)) ? `` : `Es fehlt ein Mitlaut (m, l, s, r, n \u2026).` : `Es fehlt ein Selbstlaut (a, e, i, o, u \u2026).`;
}
var kp = (e10) => {
  let t10 = e10.slice();
  for (let e11 = t10.length - 1; e11 > 0; e11--) {
    let n10 = Math.floor(Math.random() * (e11 + 1));
    [t10[e11], t10[n10]] = [t10[n10], t10[e11]];
  }
  return t10;
};
function Ap(e10, t10, n10, r10 = 2) {
  let i10 = kp(r10 === 3 ? zte(e10, n10) : Dp(e10, n10)), a10 = [], o10 = /* @__PURE__ */ new Set(), s10 = /* @__PURE__ */ new Set();
  for (let e11 of [0, 1, 2]) for (let n11 of i10) {
    if (a10.length >= t10) break;
    if (a10.includes(n11)) continue;
    let r11 = n11.every((e12) => !o10.has(e12));
    if ((e11 !== 0 || r11 && !s10.has(n11[0][0])) && (e11 !== 1 || r11)) {
      a10.push(n11);
      for (let e12 of n11) o10.add(e12);
      s10.add(n11[0][0]);
    }
  }
  return a10;
}
function jp(e10) {
  return kp(Array.from({ length: _p }, (e11, t10) => t10)).slice(0, e10);
}
function Mp(e10 = {}) {
  let t10 = e10.letters ?? `m a l o i s e r n u`, n10 = e10.closed ?? false, r10 = e10.syl ?? 2, i10 = Ap(Tp(t10), Math.min(8, Math.max(1, e10.count ?? 6)), n10, r10);
  return { letters: t10, count: i10.length || 1, case: e10.case ?? `lower`, closed: n10, syl: r10, font: e10.font ?? `andika`, words: i10, looks: jp(i10.length) };
}
function Np(e10) {
  let t10 = e10 && typeof e10 == `object` ? e10 : {}, n10 = typeof t10.letters == `string` ? t10.letters.slice(0, 200) : Ite, r10 = t10.syl === 3 ? 3 : 2, i10 = (Array.isArray(t10.words) ? t10.words : []).filter((e11) => Array.isArray(e11) && e11.length === r10 && e11.every((e12) => typeof e12 == `string` && /^[a-zäöüß]{1,6}$/.test(e12))).slice(0, 8).map((e11) => e11.slice()), a10 = Array.isArray(t10.looks) ? t10.looks : [], o10 = i10.map((e11, t11) => {
    let n11 = a10[t11];
    return typeof n11 == `number` && Number.isInteger(n11) && n11 >= 0 && n11 < _p ? n11 : t11 % _p;
  }), s10 = { letters: n10, count: i10.length || 1, case: t10.case === `upper` || t10.case === `mixed` ? t10.case : `lower`, closed: t10.closed === true, syl: r10, font: yp.includes(String(t10.font)) ? t10.font : `andika`, words: i10, looks: o10 }, c10 = (Array.isArray(t10.say) ? t10.say : []).filter((e11) => Array.isArray(e11) && e11.length === 2 && typeof e11[0] == `string` && typeof e11[1] == `string` && !!e11[0].trim() && !!e11[1].trim()).slice(0, 40).map(([e11, t11]) => [e11.trim().toLowerCase().slice(0, 24), t11.trim().slice(0, 40)]);
  return c10.length && (s10.say = c10), i10.length ? s10 : { ...Mp(s10), ...c10.length ? { say: c10 } : {} };
}
function Pp(e10, t10, n10) {
  return t10 === `upper` ? e10.toUpperCase().replace(/ẞ/g, `SS`) : t10 === `mixed` && n10 ? e10.charAt(0).toUpperCase() + e10.slice(1) : e10;
}
var Vte = (e10, t10) => e10.map((e11, n10) => Pp(e11, t10, n10 === 0)).join(``), Fp = (e10) => e10 % 2 ? Jte : qte, Hte = { a: `ah`, e: `eh`, i: `ieh`, o: `oh`, u: `uh`, \u00E4: `\xE4h`, \u00F6: `\xF6h`, \u00FC: `\xFCh` }, Ute = { a: `ahr`, e: `ehr`, i: `ihr`, o: `ohr`, u: `uhr`, \u00E4: `\xE4hr`, \u00F6: `\xF6hr`, \u00FC: `\xFChr` }, Wte = { m: `mm`, n: `nn`, l: `ll`, s: `ss`, t: `tt`, f: `ff`, p: `pp`, k: `ck` }, Gte = { v: `f`, qu: `kw` }, Kte = { meh: `mee`, heh: `hee`, duh: `du`, jah: `ja`, mall: `mal`, tall: `tal`, well: `w\xE4ll`, bell: `b\xE4ll`, sell: `s\xE4ll`, tell: `t\xE4ll`, dell: `d\xE4ll`, nell: `n\xE4ll`, jell: `j\xE4ll`, less: `l\xE4ss`, mess: `m\xE4ss`, bess: `b\xE4ss`, tess: `t\xE4ss`, jess: `j\xE4ss`, jeff: `j\xE4ff`, jack: `jak`, jock: `jok`, jill: `jil`, jinn: `jin`, rich: `riech`, tech: `t\xE4ch` }, Ip = (e10) => new Map((e10 ?? []).map(([e11, t10]) => [e11.trim().toLowerCase(), t10.trim()]).filter(([e11, t10]) => e11 && t10));
function Lp(e10) {
  let t10 = /^(sch|qu|pf|[^aeiouäöü]*)(ei|au|eu|äu|ie|[aeiouäöü])(.*)$/.exec(e10);
  if (!t10) return e10;
  let [, n10, r10, i10] = t10, a10 = Gte[n10] ?? n10, o10;
  return o10 = r10 === `ie` ? a10 + (i10 === `r` ? `ier` : `ieh${i10}`) : r10.length > 1 ? a10 + r10 + (i10 === `r` ? `er` : i10) : i10 ? i10 === `r` ? a10 + Ute[r10] : i10 === `k` && r10 === `u` ? `${a10}ukk` : a10 + r10 + (Wte[i10] ?? i10) : a10 + Hte[r10], Kte[o10] ?? o10;
}
function Rp(e10, t10) {
  return Ip(t10).get(e10) ?? Lp(e10);
}
function zp(e10, t10) {
  let n10 = Ip(t10);
  return n10.get(e10.join(``)) || e10.map((t11, r10) => n10.get(t11) ?? (r10 === e10.length - 1 && r10 > 0 && /^(sch|qu|pf|[^aeiouäöü]*)e$/.test(t11) ? t11 : Lp(t11))).join(``);
}
var Bp = 1400, Vp = 990, qte = `#2563eb`, Jte = `#dc2626`, Hp = 116, Yte = 16, Xte = 22, Up = { k: 2, cx: 700, cy: 360 }, Wp = (e10) => e10.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`), Gp = (e10, t10) => Bp / 2 - (e10 * Hp + (e10 - 1) * Yte) / 2 + t10 * 132;
function Zte() {
  let e10 = `<defs><linearGradient id="lh-mo-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4e6"/><stop offset="1" stop-color="#e7f5ff"/></linearGradient></defs>`;
  e10 += `<rect width="${Bp}" height="${Vp}" fill="url(#lh-mo-bg)"/>`;
  for (let [t10, n10, r10, i10] of [[80, 260, 10, `#ffd43b`], [1320, 300, 12, `#ff8787`], [140, 520, 7, `#74c0fc`], [1270, 560, 8, `#b197fc`], [70, 760, 12, `#63e6be`], [1340, 800, 10, `#ffa94d`], [250, 200, 6, `#f783ac`], [1150, 210, 7, `#69db7c`]]) e10 += `<circle cx="${t10}" cy="${n10}" r="${r10}" fill="${i10}" opacity="0.55"/>`;
  for (let [t10, n10, r10] of [[200, 380, `#ffd43b`], [1210, 430, `#ffa94d`], [300, 640, `#b197fc`]]) e10 += `<path d="M${t10} ${n10 - 18}l5 12 13 1-10 8 4 13-12-7-12 7 4-13-10-8 13-1z" fill="${r10}" opacity="0.6"/>`;
  return e10;
}
var Qte = (e10, t10, n10, r10) => `<g transform="translate(${e10} ${t10}) scale(${n10})"><path d="M-14 -6h7l10-9v30l-10-9h-7z" fill="${r10}"/><path d="M8 -8q6 8 0 16M13 -14q11 14 0 28" fill="none" stroke="${r10}" stroke-width="3.4" stroke-linecap="round"/></g>`;
function $te(e10, t10) {
  let n10 = e10.words.length, r10 = ``;
  for (let i10 = 0; i10 < n10; i10++) {
    let a10 = Gp(n10, i10), o10 = i10 < t10;
    r10 += `<rect x="${a10}" y="${Xte}" width="${Hp}" height="${Hp}" rx="24" fill="#ffffff" fill-opacity="${o10 ? 0.95 : 0.6}" stroke="${o10 ? `#f59f00` : `#adb5bd`}" stroke-width="4"${o10 ? `` : ` stroke-dasharray="10 8"`}/>`, r10 += o10 ? `<g transform="translate(${a10 + 4} 28) scale(${108 / 200})">${vp(e10.looks[i10])}</g>` : `<text x="${a10 + Hp / 2}" y="100" font-size="56" font-family="Verdana, sans-serif" font-weight="700" text-anchor="middle" fill="#ced4da">?</text>`;
  }
  return r10;
}
function ene(e10) {
  return e10 === 3 ? { boxes: [150, 452, 754], boxW: 280, word: { x: 1068, w: 182 }, counter: { x: 1306, y: 97 } } : { boxes: [352, 718], boxW: 330, word: { x: 1088, w: 196 }, counter: { x: 200, y: Kp.y + Kp.h / 2 + 17 } };
}
var Kp = { y: 594, h: 196 }, qp = { y: 846, h: 96 };
function Jp(e10) {
  let t10 = 0;
  for (let n10 of e10) `mwMW`.includes(n10) ? t10 += 0.88 : `ijlftrI`.includes(n10) ? t10 += 0.34 : n10 === n10.toUpperCase() && n10 !== n10.toLowerCase() ? t10 += 0.7 : t10 += 0.58;
  return Math.max(t10, 0.8);
}
function tne(e10, t10) {
  let n10 = 0.8;
  for (let t11 of e10.words) t11.forEach((t12, r10) => n10 = Math.max(n10, Jp(Pp(t12, e10.case, r10 === 0))));
  return Math.min(150, Math.floor((t10 - 92) / n10));
}
function nne(e10, t10) {
  let n10 = e10.words[t10], r10 = Ve(e10.font).replace(/"/g, `'`), i10 = ene(n10.length), a10 = Kp.y + Kp.h / 2, o10 = (t11) => {
    let o11 = i10.boxes[t11], s11 = Pp(n10[t11], e10.case, t11 === 0), c11 = tne(e10, i10.boxW), l11 = Fp(t11);
    return `<g class="lh-key lh-mo-syl" data-a="s${t11 + 1}"><rect x="${o11}" y="${Kp.y}" width="${i10.boxW}" height="${Kp.h}" rx="30" fill="#ffffff" stroke="#94a3b8" stroke-width="5"/><text x="${o11 + i10.boxW / 2}" y="${a10 + c11 * 0.36}" font-size="${c11}" font-family="${r10}" font-weight="700" text-anchor="middle" fill="${l11}">${Wp(s11)}</text><rect class="lh-kdown" x="${o11}" y="${Kp.y}" width="${i10.boxW}" height="${Kp.h}" rx="30" fill="#000000" opacity="0"/><title>Silbe ${t11 + 1} vorlesen</title></g>`;
  }, s10 = i10.word.x, c10 = i10.word.w, l10 = Kp.y + 8, u10 = Kp.h - 16;
  return `<g class="lh-mo-word">` + n10.map((e11, t11) => o10(t11)).join(``) + `<g class="lh-key" data-a="word"><rect x="${s10}" y="${l10}" width="${c10}" height="${u10}" rx="30" fill="#7048e8"/>${Qte(s10 + c10 / 2, l10 + 56, 2, `#ffffff`)}<text x="${s10 + c10 / 2}" y="${l10 + u10 - 26}" font-size="34" font-family="Verdana, sans-serif" font-weight="700" text-anchor="middle" fill="#ffffff">Wort</text><rect class="lh-kdown" x="${s10}" y="${l10}" width="${c10}" height="${u10}" rx="30" fill="#000000" opacity="0"/><title>Ganzes Wort vorlesen</title></g><text x="${i10.counter.x}" y="${i10.counter.y}" font-size="48" font-family="Verdana, sans-serif" font-weight="700" text-anchor="middle" fill="#868e96">${t10 + 1} / ${e10.words.length}</text></g><g class="lh-key lh-mo-read" data-a="read"><rect x="480" y="${qp.y}" width="440" height="${qp.h}" rx="${qp.h / 2}" fill="#2f9e44"/><path d="M546 ${qp.y + 48}l20 20 36-40" fill="none" stroke="#ffffff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><text x="760" y="${qp.y + 66}" font-size="50" font-family="Verdana, sans-serif" font-weight="700" text-anchor="middle" fill="#ffffff">Gelesen!</text><rect class="lh-kdown" x="480" y="${qp.y}" width="440" height="${qp.h}" rx="${qp.h / 2}" fill="#000000" opacity="0"/><title>Das Wort ist gelesen</title></g>`;
}
var rne = () => (/* @__PURE__ */ new Date()).toLocaleDateString(`de-DE`, { day: `numeric`, month: `long`, year: `numeric` });
function ine(e10, t10) {
  let n10 = e10.words.length, r10 = Ve(e10.font).replace(/"/g, `'`), i10 = n10 <= 4 ? n10 : Math.ceil(n10 / 2), a10 = Math.ceil(n10 / i10), o10 = Math.min(a10 === 1 ? 250 : 200, 980 / i10), s10 = `<rect width="${Bp}" height="${Vp}" fill="#212529" opacity="0.35"/>`;
  s10 += `<g class="lh-mo-cert">`, s10 += `<rect x="150" y="70" width="1100" height="850" rx="44" fill="#fffdf5" stroke="#f59f00" stroke-width="12"/>`, s10 += `<rect x="180" y="100" width="1040" height="790" rx="30" fill="none" stroke="#ffd43b" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round"/>`;
  for (let [e11, t11, n11] of [[230, 150, `#ff8787`], [330, 120, `#74c0fc`], [1080, 130, `#69db7c`], [1170, 180, `#b197fc`], [220, 840, `#ffa94d`], [1180, 830, `#f783ac`], [260, 300, `#ffd43b`], [1150, 320, `#63e6be`]]) s10 += `<path d="M${e11} ${t11 - 16}l4 11 12 1-9 7 3 12-10-7-10 7 3-12-9-7 12-1z" fill="${n11}"/>`;
  s10 += `<text x="700" y="205" font-size="104" font-family="Verdana, sans-serif" font-weight="700" text-anchor="middle" fill="#e8590c">Urkunde</text>`;
  let c10 = `Super gelesen! Du hast ${n10 === 1 ? `das Monster` : `alle ${n10} Monster`} gefangen.`;
  s10 += `<text x="700" y="270" font-size="${Math.min(40, Math.floor(1e3 / (0.64 * c10.length)))}" font-family="${r10}" font-weight="700" text-anchor="middle" fill="#495057">${c10}</text>`;
  let l10 = a10 === 1 ? 310 : 284, u10 = Math.min(40, o10 / 5, ...e10.words.map((t11) => o10 * 0.95 / Jp(Vte(t11, e10.case))));
  for (let t11 = 0; t11 < n10; t11++) {
    let a11 = Math.floor(t11 / i10), c11 = Math.min(i10, n10 - a11 * i10), d10 = t11 - a11 * i10, f10 = 700 - c11 * o10 / 2 + d10 * o10, p10 = l10 + a11 * (o10 + 36), m10 = (o10 - 30) / 200, h10 = e10.words[t11];
    s10 += `<g class="lh-mo-certitem" data-i="${t11}"><g transform="translate(${f10 + 15} ${p10}) scale(${m10})">${vp(e10.looks[t11])}</g>`, s10 += `<text x="${f10 + o10 / 2}" y="${p10 + o10 - 4}" font-size="${u10.toFixed(1)}" font-family="${r10}" font-weight="700" text-anchor="middle">${h10.map((t12, n11) => `<tspan fill="${Fp(n11)}">${Wp(Pp(t12, e10.case, n11 === 0))}</tspan>`).join(``)}</text></g>`;
  }
  return s10 += `<text x="700" y="${t10 ? 800 : 850}" font-size="30" font-family="Verdana, sans-serif" text-anchor="middle" fill="#868e96">am ${rne()}</text>`, t10 && (s10 += `<g class="lh-key" data-a="again"><rect x="540" y="822" width="320" height="76" rx="38" fill="#1c7ed6"/><text x="700" y="873" font-size="40" font-family="Verdana, sans-serif" font-weight="700" text-anchor="middle" fill="#ffffff">Nochmal</text><rect class="lh-kdown" x="540" y="822" width="320" height="76" rx="38" fill="#000000" opacity="0"/><title>Nochmal von vorn</title></g>`), s10 + `</g>`;
}
function Yp(e10, t10, n10, r10 = Bp, i10 = Vp) {
  let a10 = e10.words.length, o10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Bp} ${Vp}" width="${r10}" height="${i10}">${Zte()}`;
  return o10 += $te(e10, Math.min(t10, a10)), t10 < a10 ? (o10 += `<g class="lh-mo-big"><g class="lh-mo-bob"><g transform="translate(${Up.cx - 100 * Up.k} ${Up.cy - 100 * Up.k}) scale(${Up.k})">${vp(e10.looks[t10])}</g></g></g>`, o10 += nne(e10, t10)) : o10 += ine(e10, n10), o10 + `</svg>`;
}
var Xp = /* @__PURE__ */ new Map(), Zp = (e10) => {
  let t10 = Xp.get(e10);
  return t10 || Xp.set(e10, t10 = { at: 0, busy: false }), t10;
}, Qp = /* @__PURE__ */ new Map(), $p = /* @__PURE__ */ new Set();
function em(e10) {
  Xp.delete(e10), tm.has(e10) && (tm.set(e10, (tm.get(e10) ?? 0) + 1), dc()), nm(e10);
}
var tm = /* @__PURE__ */ new Map(), ane = (e10) => new Promise((t10) => setTimeout(t10, e10));
function one() {
  if ([...tm.values()].length) {
    for (let [e10, t10] of tm) tm.set(e10, t10 + 1);
    dc();
  }
}
async function sne(e10) {
  let t10 = Qp.get(e10)?.monster;
  if (!t10) return;
  let n10 = (tm.get(e10) ?? 0) + 1;
  tm.set(e10, n10);
  let r10 = () => tm.get(e10) === n10 && Zp(e10).at >= t10.words.length;
  await lc(t10.words.length === 1 ? `Super! Du hast das Monster gefangen.` : `Super! Du hast alle Monster gefangen.`);
  for (let n11 = 0; n11 < t10.words.length; n11++) {
    if (await ane(n11 ? 350 : 600), !r10()) return;
    let i10 = (t11) => document.querySelectorAll(`.lh-wg-monster.is-live[data-monster-id="${e10}"] .lh-mo-certitem[data-i="${n11}"]`).forEach((e11) => e11.classList.toggle(`is-saying`, t11));
    i10(true), await lc(zp(t10.words[n11], t10.say)), i10(false);
  }
}
function nm(e10) {
  document.querySelectorAll(`.lh-wg-monster.is-live`).forEach((t10) => {
    if (t10.dataset.monsterId !== e10) return;
    let n10 = Qp.get(e10);
    n10 && (delete t10.dataset.k, im(t10, n10, true, {}));
  });
}
function rm(e10, t10, n10) {
  e10.querySelectorAll(`.is-saying`).forEach((e11) => e11.classList.remove(`is-saying`)), n10?.classList.add(`is-saying`), lc(t10).finally(() => n10?.classList.remove(`is-saying`));
}
function cne(e10, t10) {
  let n10 = t10.monster, r10 = Zp(t10.id);
  if (!n10 || r10.busy || r10.at >= n10.words.length) return;
  dc(), r10.busy = true;
  let i10 = n10.words.length, a10 = e10.querySelector(`.lh-mo-big`);
  if (e10.classList.add(`is-going`), a10) {
    let e11 = Gp(i10, r10.at) + Hp / 2 - Up.cx, t11 = 80 - Up.cy, n11 = 108 / (200 * Up.k);
    a10.style.transition = `transform .85s cubic-bezier(.5,-.25,.35,1)`, a10.style.transform = `translate(${e11}px, ${t11}px) scale(${n11})`;
  }
  vi(), window.setTimeout(() => {
    r10.busy = false, r10.at++, e10.classList.remove(`is-going`), $p.add(t10.id), nm(t10.id), r10.at >= i10 && sne(t10.id);
  }, 900);
}
function im(e10, t10, n10, r10) {
  let i10 = t10.monster ?? Mp(), a10 = Math.max(1, Math.round(t10.w)), o10 = Math.max(1, Math.round(t10.h)), s10 = n10 ? Math.min(Zp(t10.id).at, i10.words.length) : 0, c10 = `${a10}x${o10}|${n10}|${JSON.stringify(i10)}|${s10}`;
  if (e10.dataset.k === c10) return;
  if (e10.dataset.k = c10, e10.setAttribute(`aria-label`, am(t10)), !n10) {
    let t11 = Yp(i10, 0, false, a10, o10), n11 = document.createElement(`img`);
    n11.className = `lh-wg-pic`, n11.alt = ``, n11.draggable = false, n11.src = r10.stickerUrl ? r10.stickerUrl(t11) : `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(t11), n11.style.width = `${a10}px`, n11.style.height = `${o10}px`, e10.replaceChildren(n11);
    return;
  }
  Qp.set(t10.id, t10), e10.dataset.monsterId = t10.id;
  let l10 = document.createElement(`div`);
  l10.className = `lh-wg-pic`, l10.innerHTML = Yp(i10, s10, true, a10, o10).replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e10.replaceChildren(l10), $p.delete(t10.id) && l10.querySelector(`.lh-mo-big`)?.classList.add(`is-new`), t10.locked && e10.classList.add(`is-armed`), e10.classList.add(`lh-swipe-ok`), Si(e10, { slide: false, hit: (t11) => {
    let n11 = Qp.get(e10.dataset.monsterId ?? ``), r11 = n11?.monster;
    if (!n11 || !r11) return null;
    let i11 = t11.getAttribute(`data-a`), a11 = r11.words[Math.min(Zp(n11.id).at, r11.words.length - 1)], o11 = i11 && /^s[123]$/.test(i11) ? Number(i11[1]) - 1 : -1;
    return o11 >= 0 && a11[o11] ? rm(e10, Rp(a11[o11], r11.say), e10.querySelector(`.lh-mo-syl[data-a="${i11}"]`)) : i11 === `word` ? rm(e10, zp(a11, r11.say), null) : i11 === `read` ? cne(e10, n11) : i11 === `again` && em(n11.id), null;
  } });
}
function am(e10) {
  let t10 = e10.monster;
  return t10 ? `Monsternamen lesen: ${t10.words.length === 1 ? `ein Monster` : `${t10.words.length} Monster`} \u2013 lies den Namen und tippe auf \u201EGelesen\u201C.` : `Monsternamen lesen`;
}
var lne = `
.lh-wg-monster .lh-mo-big{transform-box:view-box;transform-origin:${Up.cx}px ${Up.cy}px}
.lh-wg-monster .lh-mo-big.is-new{animation:lh-mo-pop .55s cubic-bezier(.3,1.5,.5,1)}
.lh-wg-monster .lh-mo-bob{transform-box:view-box;transform-origin:${Up.cx}px 560px;animation:lh-mo-bob 2.6s ease-in-out infinite}
.lh-wg-monster.is-going .lh-mo-bob{animation:none}
.lh-wg-monster .lh-mo-word{transition:opacity .3s}
.lh-wg-monster.is-going .lh-mo-word,.lh-wg-monster.is-going .lh-mo-read{opacity:.25}
.lh-wg-monster .lh-mo-syl.is-saying rect:first-child{stroke:#fab005;stroke-width:9}
.lh-wg-monster .lh-mo-cert{transform-box:view-box;transform-origin:700px 495px;animation:lh-mo-pop .6s cubic-bezier(.3,1.4,.5,1)}
.lh-wg-monster .lh-mo-certitem{transform-box:fill-box;transform-origin:center;transition:transform .25s}
.lh-wg-monster .lh-mo-certitem.is-saying{transform:scale(1.14)}
@keyframes lh-mo-pop{from{transform:scale(.15);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes lh-mo-bob{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-8px) rotate(-1.5deg)}70%{transform:translateY(-3px) rotate(1.5deg)}}
@media (prefers-reduced-motion:reduce){.lh-wg-monster .lh-mo-bob{animation:none}}`, om = [`Fl\xFCsterflausch`, `Kicherkr\xFCmel`, `Klatschkeks`, `Jubeljuchu`, `Hurraholla`, `Donnerdackel`, `Krawummbumm`, `Supertornado!`], sm = [3, 5, 8, 10], une = [{ v: 1, label: `Fl\xFCstern` }, { v: 2, label: `Leise` }, { v: 3, label: `Gruppenarbeit` }, { v: 4, label: `Lebhaft` }, { v: 5, label: `Laut` }], cm = { mode: `applause`, secs: 5, sens: 3, limit: 3, chime: false, words: om }, lm = (e10, t10, n10, r10) => typeof e10 == `number` && Number.isFinite(e10) ? Math.round(Math.min(n10, Math.max(t10, e10))) : r10;
export const makeMonster = Mp;
export const cleanMonster = Np;
export const drawMonster = Yp;
export const monsterPicture = Fte;
export const sayPart = Rp;
export const sayName = zp;
export const monsterLabel = am;
export const pickNames = Ap;
export const splitLetters = Tp;
export const letterProblem = Op;
export const nameCount = Bte;
export const newLooks = jp;
export const casing = Pp;
export const partColor = Fp;
export const MONSTER_CASES = bp;
export const MONSTER_FONTS = yp;
export const MONSTER_CSS = lne;
export const monsterSlot = (n, i) => ({ x: Gp(n, i) + Hp / 2 - Up.cx, y: 80 - Up.cy, scale: 108 / (200 * Up.k) });
