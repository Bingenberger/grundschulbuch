/* eslint-disable */
// @ts-nocheck
// The worksheet generators of the reference (Lernsachen-Heft) – Mathe-Aufgaben,
// Uhrzeiten üben … – taken over unchanged so the sheets look and behave the same. It works in the
// reference's page units (1400 × 990, A4 landscape) and builds plain items:
//   text   { type:'text', x, y, w, h, size, html, font, align, color, bold, placeholder? }
//          – an item with `placeholder` is a box the child types the answer into
//   sticker{ type:'sticker', x, y, w, h, svg }   – drawn parts (lines, dots, boxes)
// math-sheet.ts turns these into our page elements.
// Glossary of the short names: RB number text, K random int, PB pick, IB chance,
// LB shuffle, XB text height, ZB box width, tV unique task, nV columns,
// rV answer box, $B sheet (items + answers), eV drawing, xV make pages.

const mT = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
let idCounter = 0;
const YO = (prefix = '') => `${prefix}${(++idCounter).toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const ZO = (template = 'blank', paper = '#ffffff') => ({ id: YO('pg'), template, paper, lineColor: '', items: [] });
const j = (e) => ({ id: YO('tx'), type: 'text', html: '', font: 'andika', size: 32, color: '#1f2937', align: 'left', ...e, rot: e.rot ?? 0 });
const Ck = (e) => ({ id: YO('st'), type: 'sticker', ...e, rot: e.rot ?? 0 });

var G_e = `#b4bfcc`, _B = `#cfe0f5`, K_e = `#15803d`, vB = [`null`, `eins`, `zwei`, `drei`, `vier`, `f\xFCnf`, `sechs`, `sieben`, `acht`, `neun`, `zehn`, `elf`, `zw\xF6lf`, `dreizehn`, `vierzehn`, `f\xFCnfzehn`, `sechzehn`, `siebzehn`, `achtzehn`, `neunzehn`], yB = [``, ``, `zwanzig`, `drei\xDFig`, `vierzig`, `f\xFCnfzig`, `sechzig`, `siebzig`, `achtzig`, `neunzig`];
function q_e(e10, t10) {
  if (e10 === 0) return ``;
  if (e10 === 1) return t10 ? `eins` : `ein`;
  if (e10 < 20) return vB[e10];
  let n10 = Math.floor(e10 / 10), r10 = e10 % 10;
  return r10 ? `${r10 === 1 ? `ein` : vB[r10]}und${yB[n10]}` : yB[n10];
}
function bB(e10, t10) {
  let n10 = Math.floor(e10 / 100), r10 = e10 % 100;
  return (n10 ? `${n10 === 1 ? `ein` : vB[n10]}hundert` : ``) + q_e(r10, t10);
}
function J_e(e10) {
  if (e10 === 0) return `null`;
  let t10 = Math.floor(e10 / 1e3), n10 = e10 % 1e3;
  return (t10 ? `${t10 === 1 ? `ein` : bB(t10, false)}tausend` : ``) + bB(n10, true);
}
function xB(e10, t10, n10, r10, i10, a10, o10, s10) {
  let c10 = n10, l10 = r10 + (i10 - XB(o10)) / 2;
  for (let n11 of a10) n11.ans ? rV(e10, t10, c10, r10, (i10 - s10) / 2, n11.w, s10, n11.t, o10) : e10.num(c10, l10, n11.w, n11.t, o10, n11.align ?? `center`), c10 += n11.w;
}
var SB = 74;
function CB(e10, t10) {
  let n10 = e10 <= 20 ? t10 === `+` ? K(2, 9) : K(11, 19) : K(11, e10 - 11), r10 = n10 % 10;
  if (t10 === `+`) {
    if (r10 === 0) return null;
    let t11 = K(11 - r10, 9);
    if (t11 < 2 || t11 > 9 || r10 + t11 <= 10 || n10 + t11 > e10) return null;
    let i11 = 10 - r10;
    return [n10, t11, i11, t11 - i11, n10 + t11];
  }
  if (r10 === 0 || r10 >= 9) return null;
  let i10 = K(r10 + 1, 9);
  return n10 - i10 < 0 ? null : [n10, i10, r10, i10 - r10, n10 - i10];
}
function Y_e(e10, t10) {
  return tV(e10, () => CB(e10.base, t10), (e11) => `${t10}${e11[0]},${e11[1]}`);
}
function X_e(e10, t10, n10) {
  let r10 = ZB(Math.max(2, RB(e10.base).length), 30), i10 = nV(6 * r10 + 170, 50, 2), a10 = new eV(70, VB, SB);
  for (let o10 = 0; o10 < i10.n; o10++) {
    let s10 = IB(0.5) ? `+` : `-`, [c10, l10, u10, d10, f10] = Y_e(e10, s10), p10 = s10 === `+` ? `+` : `\u2212`, m10 = (e11, t11 = false) => ({ t: RB(e11), w: r10, ans: t11 }), h10 = (e11) => ({ t: e11, w: 34 });
    xB(t10, a10, i10.x(o10), n10, SB, [m10(c10), h10(p10), m10(l10), h10(`=`), m10(c10), h10(p10), m10(u10, true), h10(p10), m10(d10, true), h10(`=`), m10(f10, true)], 30, 52);
  }
  t10.graphic(a10, n10, `Rechenk\xE4stchen`);
}
var wB = 208;
function Z_e(e10, t10) {
  let n10 = e10.base;
  return tV(e10, () => {
    if (n10 <= 20) {
      let e12 = CB(n10, t10);
      return e12 ? { a: e12[0], b: e12[1], j: [e12[2], e12[3]], mid: t10 === `+` ? e12[0] + e12[2] : e12[0] - e12[2], end: e12[4] } : null;
    }
    let e11 = K(11, Math.min(n10 / 2, 99));
    if (e11 % 10 == 0) return null;
    let r10 = t10 === `+` ? K(10, n10 - e11) : K(e11 + 1, n10), i10 = Math.floor(e11 / 10) * 10, a10 = t10 === `+` ? r10 + i10 : r10 - i10;
    return { a: r10, b: e11, j: [i10, e11 - i10], mid: a10, end: t10 === `+` ? r10 + e11 : r10 - e11 };
  }, (e11) => `${t10}${e11.a},${e11.b}`);
}
function Q_e(e10, t10, n10) {
  let r10 = ZB(Math.max(2, RB(e10.base).length), 28), i10 = nV(580, 60, 2), a10 = new eV(70, VB, wB);
  for (let o10 = 0; o10 < i10.n; o10++) {
    let s10 = i10.x(o10), c10 = IB(0.5) ? `+` : `-`, l10 = Z_e(e10, c10), u10 = c10 === `+` ? `+` : `\u2212`;
    xB(t10, a10, s10, n10, 48, [{ t: RB(l10.a), w: r10, align: `right` }, { t: u10, w: 34 }, { t: RB(l10.b), w: r10 }, { t: `=`, w: 34 }, { t: RB(l10.end), w: r10, ans: true }], 28, 44);
    let d10 = Math.max(r10 + 20, 540 * l10.j[0] / l10.b), f10 = Math.max(r10 + 20, 540 * l10.j[1] / l10.b), p10 = Math.min(1, 520 / (d10 + f10));
    d10 *= p10, f10 *= p10;
    let m10 = c10 === `+` ? 1 : -1, h10 = c10 === `+` ? s10 + 20 : s10 + 580 - 20, g10 = h10, _10 = h10 + m10 * d10, v10 = _10 + m10 * f10;
    a10.line(s10, 150, s10 + 580, 150, GB, 3);
    for (let e11 of [g10, _10, v10]) a10.line(e11, 140, e11, 160, GB, 3);
    let y10 = (e11, i11, o11) => {
      a10.curve(e11, 144, (e11 + i11) / 2, 64, i11, 144, qB, 2.5, true);
      let s11 = (e11 + i11) / 2, c11 = Math.max(r10, ZB(RB(o11).length + 1, 24));
      rV(t10, a10, s11 - c11 / 2, n10, 58, c11, 36, `${u10}${RB(o11)}`, 24);
    };
    y10(g10, _10, l10.j[0]), y10(_10, v10, l10.j[1]), t10.num(g10 - r10 / 2, n10 + 164, r10, RB(l10.a), 26), rV(t10, a10, _10 - r10 / 2, n10, 164, r10, 38, RB(l10.mid), 24), rV(t10, a10, v10 - r10 / 2, n10, 164, r10, 38, RB(l10.end), 24);
  }
  t10.graphic(a10, n10, `Rechenstrich`);
}
function $_e(e10, t10, n10) {
  let r10 = new eV(70, VB, 74), i10 = nV(600, 50, 2);
  for (let a10 = 0; a10 < i10.n; a10++) {
    let o10 = i10.x(a10), s10 = tV(e10, () => K(e10.base <= 10 ? 0 : 1, e10.R), (e11) => `w${e11}`), c10 = J_e(s10), l10 = c10.length > 24 ? 22 : c10.length > 16 ? 26 : 30, u10 = ZB(RB(e10.R).length, 30);
    if (IB(0.5)) t10.text(o10, n10 + (74 - XB(l10)) / 2, 600 - u10 - 50, mT(c10), l10, { align: `left` }), t10.num(o10 + 600 - u10 - 50, n10 + (74 - XB(30)) / 2, 40, `\u2192`, 30), rV(t10, r10, o10 + 600 - u10 - 4, n10, 11, u10, 52, RB(s10), 30);
    else {
      t10.num(o10, n10 + (74 - XB(30)) / 2, u10, RB(s10), 30, `right`), t10.num(o10 + u10, n10 + (74 - XB(30)) / 2, 50, `\u2192`, 30);
      let e11 = o10 + u10 + 60;
      r10.line(e11, 60, o10 + 600, 60, JB, 2), t10.answer(e11, n10 + 74 - 14 - XB(l10) + 2, o10 + 600 - e11, c10, l10, `left`);
    }
  }
  t10.graphic(r10, n10, `Zahlw\xF6rter`);
}
var TB = [`dot`, `square`, `triangle`, `star`, `diamond`, `heart`], EB = [`#e03131`, `#1c7ed6`, `#2f9e44`, `#f08c00`, `#7048e8`, `#d6336c`];
function DB(e10, t10, n10, r10, i10, a10) {
  switch (t10) {
    case `dot`:
      e10.circle(n10, r10, i10, a10);
      break;
    case `square`:
      e10.rect(n10 - i10 * 0.85, r10 - i10 * 0.85, i10 * 1.7, i10 * 1.7, a10, a10, 0, 3);
      break;
    case `triangle`:
      e10.poly([[n10, r10 - i10], [n10 + i10, r10 + i10 * 0.8], [n10 - i10, r10 + i10 * 0.8]], a10, a10, 1);
      break;
    case `diamond`:
      e10.poly([[n10, r10 - i10], [n10 + i10 * 0.8, r10], [n10, r10 + i10], [n10 - i10 * 0.8, r10]], a10, a10, 1);
      break;
    case `heart`:
      e10.poly(Array.from({ length: 24 }, (e11, t11) => {
        let a11 = t11 / 24 * Math.PI * 2, o10 = 16 * Math.sin(a11) ** 3, s10 = -(13 * Math.cos(a11) - 5 * Math.cos(2 * a11) - 2 * Math.cos(3 * a11) - Math.cos(4 * a11));
        return [n10 + o10 / 17 * i10, r10 + s10 / 17 * i10];
      }), a10, a10, 1);
      break;
    default: {
      let t11 = [];
      for (let e11 = 0; e11 < 10; e11++) {
        let a11 = Math.PI / 5 * e11 - Math.PI / 2, o10 = e11 % 2 ? i10 * 0.45 : i10;
        t11.push([n10 + Math.cos(a11) * o10, r10 + Math.sin(a11) * o10]);
      }
      e10.poly(t11, a10, a10, 1);
    }
  }
}
var OB = 96;
function eve(e10, t10, n10) {
  let r10 = Math.min(20, e10.R), i10 = nV(442, 60, 2), a10 = new eV(70, VB, OB), o10 = new eV(70, VB, OB);
  for (let s10 = 0; s10 < i10.n; s10++) {
    let c10 = i10.x(s10), [l10, u10] = tV(e10, () => {
      let e11 = K(1, Math.max(1, r10 - 2)), t11 = K(e11 + 2, Math.min(r10, Math.max(e11 + 2, e11 + 8)));
      return t11 > r10 ? null : [e11, t11];
    }, (e11) => `c${e11[0]},${e11[1]}`), d10 = PB(TB), f10 = PB(EB);
    for (let e11 of [a10, o10]) e11.rect(c10, 18, 56, 56, `#ffffff`, qB, 2.5, 10);
    t10.num(c10, n10 + 18 + (56 - XB(32)) / 2, 56, String(l10), 32);
    for (let e11 = 0; e11 < u10; e11++) {
      let t11 = Math.floor(e11 / 10), n11 = e11 % 10, r11 = c10 + 80 + n11 * 38 + (n11 >= 5 ? 10 : 0) + 15, i11 = 6 + t11 * 44 + 15 + (u10 <= 10 ? 22 : 0);
      for (let e12 of [a10, o10]) DB(e12, d10, r11, i11, 15, f10);
      e11 < l10 && o10.circle(r11, i11, 20, `none`, K_e, 3);
    }
  }
  t10.graphic(a10, n10, `Mengen`, o10);
}
var kB = 132;
function tve(e10, t10, n10) {
  let r10 = ZB(Math.max(2, RB(e10.R).length), 30), i10 = e10.R <= 20 ? 300 : e10.R <= 100 ? 320 : 880, a10 = nV(i10 + 20 + r10, 40, 3), o10 = new eV(70, VB, kB);
  for (let s10 = 0; s10 < a10.n; s10++) {
    let c10 = a10.x(s10), l10 = tV(e10, () => K(e10.R <= 10 ? 1 : e10.R <= 20 ? 3 : 11, Math.min(e10.R, e10.R <= 100 ? 99 : 999)), (e11) => `n${e11}`);
    if (o10.rect(c10, 2, i10, 124, `#f8fafc`, `#dbe4f0`, 2, 12), l10 <= 20) {
      let e11 = PB(TB), t11 = PB(EB);
      if (IB(0.5)) for (let n11 = 0; n11 < l10; n11++) {
        let r11 = Math.floor(n11 / 10), i11 = n11 % 10;
        DB(o10, e11, c10 + 24 + i11 * 26 + (i11 >= 5 ? 10 : 0), 38 + r11 * 48, 12, t11);
      }
      else {
        let n11 = [];
        for (let e12 = 0; n11.length < l10 && e12 < 4e3; e12++) {
          let e13 = [c10 + 20 + Math.random() * (i10 - 40), 20 + Math.random() * 84];
          n11.every((t12) => Math.hypot(t12[0] - e13[0], t12[1] - e13[1]) > 2.3 * 12) && n11.push(e13);
        }
        for (let [r11, i11] of n11) DB(o10, e11, r11, i11, 12, t11);
      }
    } else {
      let t11 = Math.floor(l10 / 100), n11 = Math.floor(l10 % 100 / 10), r11 = l10 % 10, i11 = c10 + 14, a11 = e10.R <= 100 ? 9 : 6;
      for (let e11 = 0; e11 < t11; e11++) {
        o10.rect(i11, 12, 10 * a11, 10 * a11, `#ffe8cc`, `#e8590c`, 1.5, 2);
        for (let e12 = 1; e12 < 10; e12++) o10.line(i11 + e12 * a11, 12, i11 + e12 * a11, 12 + 10 * a11, `#e8590c`, 0.8), o10.line(i11, 12 + e12 * a11, i11 + 10 * a11, 12 + e12 * a11, `#e8590c`, 0.8);
        i11 += 10 * a11 + 8;
      }
      for (let e11 = 0; e11 < n11; e11++) {
        o10.rect(i11, 12, a11 + 2, 10 * a11, `#d0ebff`, `#1c7ed6`, 1.5, 2);
        for (let e12 = 1; e12 < 10; e12++) o10.line(i11, 12 + e12 * a11, i11 + a11 + 2, 12 + e12 * a11, `#1c7ed6`, 0.8);
        i11 += a11 + 8;
      }
      for (let e11 = 0; e11 < r11; e11++) o10.rect(i11 + e11 % 3 * (a11 + 4), 12 + Math.floor(e11 / 3) * (a11 + 6), a11 + 2, a11 + 2, `#d3f9d8`, `#2f9e44`, 1.5, 2);
    }
    rV(t10, o10, c10 + i10 + 20, n10, 36, r10, 56, RB(l10), 30);
  }
  t10.graphic(o10, n10, `Anzahl`);
}
function nve(e10, t10, n10) {
  let r10 = e10.base, i10 = r10 >= 100 && IB(0.4), a10 = Math.max(2, RB(e10.R).length), o10 = Math.max(70, ZB(a10, 26)), s10 = nV(4 * o10, 50, 3), c10 = new eV(70, VB, 204);
  for (let a11 = 0; a11 < s10.n; a11++) {
    let l10 = s10.x(a11), u10 = tV(e10, () => {
      let t11 = i10 ? 10 : Math.max(5, Math.floor(r10 / 2)), n11 = LB(Array.from({ length: t11 }, (e11, t12) => t12 + 1)).slice(0, 3), a12 = LB(Array.from({ length: t11 }, (e11, t12) => t12 + 1)).slice(0, 3);
      if (n11.length < 3 || a12.length < 3) return null;
      let o11 = n11.map((e11) => a12.map((t12) => i10 ? e11 * t12 : e11 + t12));
      return o11.flat().some((e11) => e11 > r10) ? null : { rs: n11.map((t12) => t12 * e10.scale), cs: a12.map((t12) => i10 ? t12 : t12 * e10.scale), res: o11.map((t12) => t12.map((t13) => t13 * e10.scale)) };
    }, (e11) => `t${e11.rs.join(`,`)}|${e11.cs.join(`,`)}`), d10 = e10.o.gaps, f10 = d10 ? K(0, 2) : -1, p10 = d10 ? K(0, 2) : -1, m10 = f10 >= 0 ? +(p10 === 0) : -1, h10 = p10 >= 0 ? +(f10 === 0) : -1, g10 = (e11, t11, n11) => c10.rect(e11, t11, o10, 50, n11, JB, 2, 0);
    g10(l10, 0, `#dbe4ff`), t10.num(l10, n10 + (50 - XB(30)) / 2, o10, i10 ? `\xB7` : `+`, 30);
    for (let e11 = 0; e11 < 3; e11++) {
      g10(l10 + (e11 + 1) * o10, 0, `#edf2ff`);
      let r11 = n10 + (50 - XB(26)) / 2;
      e11 === f10 ? t10.answer(l10 + (e11 + 1) * o10, r11, o10, RB(u10.cs[e11]), 26) : t10.num(l10 + (e11 + 1) * o10, r11, o10, RB(u10.cs[e11]), 26);
    }
    for (let e11 = 0; e11 < 3; e11++) {
      let r11 = (e11 + 1) * 50;
      g10(l10, r11, `#edf2ff`);
      let i11 = n10 + r11 + (50 - XB(26)) / 2;
      e11 === p10 ? t10.answer(l10, i11, o10, RB(u10.rs[e11]), 26) : t10.num(l10, i11, o10, RB(u10.rs[e11]), 26);
      for (let n11 = 0; n11 < 3; n11++) g10(l10 + (n11 + 1) * o10, r11, `#ffffff`), n11 === f10 && e11 === m10 || e11 === p10 && n11 === h10 ? t10.num(l10 + (n11 + 1) * o10, i11, o10, RB(u10.res[e11][n11]), 26) : t10.answer(l10 + (n11 + 1) * o10, i11, o10, RB(u10.res[e11][n11]), 26);
    }
  }
  t10.graphic(c10, n10, `Rechentabellen`);
}
var AB = 30, rve = 4, ive = [{ id: `zigzag`, w: 2, lines: [[[0, 3], [1, 1], [2, 3]]] }, { id: `castle`, w: 2, lines: [[[0, 3], [0, 1], [1, 1], [1, 3], [2, 3]]] }, { id: `stairs`, w: 4, lines: [[[0, 3], [0, 2], [1, 2], [1, 1], [2, 1], [2, 2], [3, 2], [3, 3], [4, 3]]] }, { id: `meander`, w: 4, lines: [[[0, 3], [0, 1], [3, 1], [3, 2], [1, 2], [1, 3], [4, 3]]] }, { id: `triangles`, w: 3, lines: [[[0, 3], [1, 1], [2, 3], [0, 3]]] }, { id: `diamonds`, w: 2, lines: [[[0, 2], [1, 1], [2, 2], [1, 3], [0, 2]]] }, { id: `saw`, w: 2, lines: [[[0, 3], [2, 1], [2, 3]]] }, { id: `waves`, w: 4, lines: [[[0, 2], [1, 1], [2, 2], [3, 3], [4, 2]]] }];
function ave(e10, t10, n10) {
  let r10 = new eV(70, VB, 120), i10 = Math.floor(VB / AB);
  for (let e11 = 0; e11 <= i10; e11++) r10.line(70 + e11 * AB, 0, 70 + e11 * AB, 120, _B, 1);
  for (let e11 = 0; e11 <= rve; e11++) r10.line(70, e11 * AB, 70 + i10 * AB, e11 * AB, _B, 1);
  let a10 = tV(e10, () => PB(ive), (e11) => `p${e11.id}`), o10 = a10.w <= 2 ? 2 : 1, s10 = a10.w <= 2 ? 4 : 2;
  for (let e11 = 0; e11 < o10 + s10; e11++) {
    let t11 = 1 + e11 * a10.w;
    if (t11 + a10.w > i10 - 1) break;
    for (let n11 of a10.lines) r10.polyline(n11.map(([e12, n12]) => [70 + (t11 + e12) * AB, n12 * AB]), e11 < o10 ? GB : G_e, e11 < o10 ? 3.5 : 3);
  }
  t10.graphic(r10, n10, `Muster`);
}
var jB = (e10) => (t10) => t10 <= e10, ove = (e10) => (t10) => t10 >= e10;
function sve() {
  return [{ id: `tenstep`, label: `Zehner\xFCbergang`, title: `Zehner\xFCbergang in Schritten`, sample: `8 + 5 = 8 + \u25A2 + \u25A2`, group: `Rechnen`, available: (e10) => e10 >= 20 && e10 <= 1e3, hint: `von 20 bis 1000`, instruction: () => `Rechne in zwei Schritten: erst bis zum vollen Zehner, dann weiter.`, rowH: () => SB, row: X_e, mixRows: 2 }, { id: `strich`, label: `Rechenstrich`, title: `Rechenstrich`, sample: `38 \u2312 58 \u2312 63`, group: `Rechnen`, available: (e10) => e10 >= 20 && e10 <= 1e3, hint: `von 20 bis 1000`, instruction: () => `Rechne am Rechenstrich: Trage die Spr\xFCnge und die Zahlen ein.`, rowH: () => wB, row: Q_e, mixRows: 1 }, { id: `table`, label: `Rechentabellen`, title: `Rechentabellen`, sample: `+ \u2502 3 \u2502 5 \u2502 7`, group: `Rechnen`, available: ove(10), instruction: (e10) => e10.o.gaps ? `F\xFClle die Tabellen aus. Manche Zahlen am Rand fehlen auch.` : `F\xFClle die Tabellen aus: Zahl links mit Zahl oben.`, rowH: () => 206, row: nve }, { id: `words`, label: `Zahlen schreiben`, title: `Zahlen und Zahlw\xF6rter`, sample: `siebzehn \u2192 17`, group: `Zahlen`, available: jB(1e4), hint: `bis 10 000`, instruction: () => `Schreibe die Zahl mit Ziffern \u2013 oder als Wort.`, rowH: () => 74, row: $_e, mixRows: 2 }, { id: `count`, label: `Anzahl bestimmen`, title: `Wie viele sind es?`, sample: `\u25CF\u25CF\u25CF\u25CF\u25CF \u25CF\u25CF \u2192 \u25A2`, group: `Zahlen`, available: jB(1e3), hint: `bis 1000`, instruction: (e10) => e10.R <= 20 ? `Wie viele sind es? Z\xE4hle und schreibe die Zahl.` : `Wie viele sind es? Hunderter, Zehner und Einer z\xE4hlen.`, rowH: () => kB, row: tve, mixRows: 1 }, { id: `circle`, label: `Mengen einkreisen`, title: `Mengen einkreisen`, sample: `4: \u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF`, group: `Zahlen`, available: jB(20), hint: `nur bis 20`, instruction: () => `Kreise so viele ein, wie die Zahl sagt.`, rowH: () => OB, row: eve, mixRows: 2 }, { id: `pattern`, label: `Muster nachzeichnen`, title: `Muster`, sample: `\u2571\u2572\u2571\u2572 auf K\xE4stchen`, group: `Formen`, available: () => true, noRange: true, instruction: () => `Zeichne die Muster nach und setze sie bis zum Ende fort.`, rowH: () => 124, row: ave, mixRows: 2 }];
}
var MB = [10, 20, 100, 1e3, 1e4, 1e6], NB = { range: 20, formats: [`plus`, `minus`], mixOps: [`+`, `-`], gaps: false, carry: `any`, remainder: false, layout: `mixed`, pages: 1, solutions: false };
function K(e10, t10) {
  let n10 = Math.ceil(e10), r10 = Math.floor(t10);
  return r10 <= n10 ? n10 : n10 + Math.floor(Math.random() * (r10 - n10 + 1));
}
var PB = (e10) => e10[Math.floor(Math.random() * e10.length)], FB = (e10, t10, n10) => Math.min(n10, Math.max(t10, e10)), IB = (e10) => Math.random() < e10;
function LB(e10) {
  for (let t10 = e10.length - 1; t10 > 0; t10--) {
    let n10 = Math.floor(Math.random() * (t10 + 1));
    [e10[t10], e10[n10]] = [e10[n10], e10[t10]];
  }
  return e10;
}
function RB(e10) {
  let t10 = String(Math.abs(Math.round(e10))), n10 = t10.length >= 5 ? t10.replace(/\B(?=(\d{3})+(?!\d))/g, `\u202F`) : t10;
  return e10 < 0 ? `\u2212` + n10 : n10;
}
function zB(e10, t10) {
  for (; e10 > 0 || t10 > 0; e10 = Math.floor(e10 / 10), t10 = Math.floor(t10 / 10)) if (e10 % 10 + t10 % 10 >= 10) return true;
  return false;
}
function BB(e10, t10) {
  for (; t10 > 0; e10 = Math.floor(e10 / 10), t10 = Math.floor(t10 / 10)) if (e10 % 10 < t10 % 10) return true;
  return false;
}
var VB = 1260, HB = 112, UB = 12, WB = 16, GB = `#1f2937`, KB = `#475569`, qB = `#2160c4`, JB = `#7c93b8`, YB = `#b7cdee`, cve = `#15803d`, XB = (e10) => Math.round(e10 * 1.3 + 8), ZB = (e10, t10) => Math.ceil(e10 * 0.62 * t10 + 22), QB = (e10) => Math.round(e10 * 10) / 10, $B = class {
  items = [];
  answers = /* @__PURE__ */ new Map();
  swaps = /* @__PURE__ */ new Map();
  text(e10, t10, n10, r10, i10, a10 = {}) {
    let o10 = j({ x: QB(e10), y: QB(t10), w: QB(n10), h: XB(i10), size: i10, html: r10, font: a10.font ?? `andika`, align: a10.align ?? `center`, color: a10.color ?? `#1f2937`, ...a10.bold ? { bold: true } : {}, locked: true });
    return this.items.push(o10), o10;
  }
  num(e10, t10, n10, r10, i10, a10 = `center`) {
    this.text(e10, t10, n10, mT(r10), i10, { align: a10 });
  }
  answer(e10, t10, n10, r10, i10, a10 = `center`) {
    let o10 = j({ x: QB(e10), y: QB(t10), w: QB(n10), h: XB(i10), size: i10, html: ``, font: `andika`, align: a10, placeholder: ` `, locked: true });
    this.items.push(o10), this.answers.set(o10.id, r10);
  }
  graphic(e10, t10, n10, r10) {
    if (!e10.parts.length) return;
    let i10 = e10.sticker(t10, n10);
    this.items.unshift(i10), r10 && this.swaps.set(i10.id, { ...r10.sticker(t10, n10), id: YO(`st`) });
  }
}, eV = class {
  x0;
  w;
  h;
  parts = [];
  constructor(e10, t10, n10) {
    this.x0 = e10, this.w = t10, this.h = n10;
  }
  X = (e10) => QB(e10 - this.x0 + 4);
  Y = (e10) => QB(e10 + 4);
  rect(e10, t10, n10, r10, i10 = `#ffffff`, a10 = JB, o10 = 2.5, s10 = 8) {
    this.parts.push(`<rect x="${this.X(e10)}" y="${this.Y(t10)}" width="${QB(n10)}" height="${QB(r10)}" rx="${s10}" fill="${i10}" stroke="${a10}" stroke-width="${o10}"/>`);
  }
  line(e10, t10, n10, r10, i10 = GB, a10 = 2.5, o10 = ``) {
    this.parts.push(`<line x1="${this.X(e10)}" y1="${this.Y(t10)}" x2="${this.X(n10)}" y2="${this.Y(r10)}" stroke="${i10}" stroke-width="${a10}" stroke-linecap="round"${o10}/>`);
  }
  circle(e10, t10, n10, r10, i10 = `none`, a10 = 0) {
    this.parts.push(`<circle cx="${this.X(e10)}" cy="${this.Y(t10)}" r="${QB(n10)}" fill="${r10}"${i10 === `none` ? `` : ` stroke="${i10}" stroke-width="${a10}"`}/>`);
  }
  poly(e10, t10, n10 = GB, r10 = 2.5) {
    this.parts.push(`<polygon points="${e10.map(([e11, t11]) => `${this.X(e11)},${this.Y(t11)}`).join(` `)}" fill="${t10}" stroke="${n10}" stroke-width="${r10}" stroke-linejoin="round"/>`);
  }
  curve(e10, t10, n10, r10, i10, a10, o10 = GB, s10 = 2.5, c10 = false) {
    if (this.parts.push(`<path d="M${this.X(e10)} ${this.Y(t10)}Q${this.X(n10)} ${this.Y(r10)} ${this.X(i10)} ${this.Y(a10)}" fill="none" stroke="${o10}" stroke-width="${s10}" stroke-linecap="round"/>`), c10) {
      let e11 = Math.atan2(a10 - r10, i10 - n10), t11 = [i10 - 12 * Math.cos(e11 - 0.45), a10 - 12 * Math.sin(e11 - 0.45)], c11 = [i10 - 12 * Math.cos(e11 + 0.45), a10 - 12 * Math.sin(e11 + 0.45)];
      this.parts.push(`<path d="M${this.X(t11[0])} ${this.Y(t11[1])}L${this.X(i10)} ${this.Y(a10)}L${this.X(c11[0])} ${this.Y(c11[1])}" fill="none" stroke="${o10}" stroke-width="${s10}" stroke-linecap="round" stroke-linejoin="round"/>`);
    }
  }
  polyline(e10, t10 = GB, n10 = 3, r10 = ``) {
    this.parts.push(`<polyline points="${e10.map(([e11, t11]) => `${this.X(e11)},${this.Y(t11)}`).join(` `)}" fill="none" stroke="${t10}" stroke-width="${n10}" stroke-linecap="round" stroke-linejoin="round"${r10}/>`);
  }
  raw(e10) {
    this.parts.push(e10);
  }
  at(e10, t10) {
    return [this.X(e10), this.Y(t10)];
  }
  label(e10, t10, n10, r10, i10 = GB) {
    this.parts.push(`<text x="${this.X(e10)}" y="${this.Y(t10)}" font-family="Arial, Helvetica, sans-serif" font-size="${r10}" font-weight="700" fill="${i10}" text-anchor="middle">${mT(n10)}</text>`);
  }
  sticker(e10, t10) {
    let n10 = this.w + 8, r10 = this.h + 8;
    return Ck({ x: this.x0 - 4, y: e10 - 4, w: n10, h: r10, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n10} ${r10}">${this.parts.join(``)}</svg>`, name: t10, locked: true });
  }
};
function tV(e10, t10, n10) {
  let r10 = null;
  for (let i10 = 0; i10 < 2e3; i10++) {
    let i11 = t10();
    if (!i11) continue;
    r10 = i11;
    let a10 = n10(i11);
    if (!e10.seen.has(a10)) return e10.seen.add(a10), i11;
  }
  if (r10) return r10;
  throw Error(`no task`);
}
function nV(e10, t10, n10) {
  let r10 = FB(Math.floor((VB + t10) / (e10 + t10)), 1, n10), i10 = (VB - r10 * e10) / r10;
  return { n: r10, x: (t11) => 70 + i10 / 2 + t11 * (e10 + i10) };
}
function rV(e10, t10, n10, r10, i10, a10, o10, s10, c10) {
  t10.rect(n10 + 2, i10, a10 - 4, o10), e10.answer(n10 + 2, r10 + i10 + (o10 - XB(c10)) / 2, a10 - 4, s10, c10);
}
function iV(e10) {
  let t10 = e10.base, n10, r10;
  if (t10 <= 20) {
    let e11 = K(3, t10);
    n10 = K(1, e11 - 1), r10 = e11 - n10;
  } else {
    if (r10 = PB(t10 === 100 ? [K(1, 9), K(1, 9) * 10, K(11, 89)] : [K(1, 9), K(1, 9) * 10, K(1, 9) * 100, K(11, 99), K(11, 99) * 10, K(101, 899)]), n10 = t10 === 100 ? IB(0.2) ? K(1, 9) * 10 : K(11, 89) : IB(0.25) ? PB([K(1, 9) * 100, K(11, 99) * 10]) : K(101, 899), n10 + r10 > t10) return null;
    IB(0.3) && ([n10, r10] = [r10, n10]);
  }
  let i10 = t10 <= 10 ? `any` : e10.o.carry;
  return i10 === `with` && !zB(n10, r10) || i10 === `without` && zB(n10, r10) ? null : [n10, r10];
}
function lve(e10) {
  let t10 = e10.base, n10, r10;
  if (t10 <= 20) n10 = K(2, t10), r10 = K(1, n10 - 1);
  else if (n10 = t10 === 100 ? K(20, 100) : K(200, 1e3), r10 = PB(t10 === 100 ? [K(1, 9), K(1, 9) * 10, K(11, 89)] : [K(1, 9), K(1, 9) * 10, K(1, 9) * 100, K(11, 99), K(11, 99) * 10, K(101, 899)]), r10 >= n10) return null;
  let i10 = t10 <= 10 ? `any` : e10.o.carry;
  return i10 === `with` && !BB(n10, r10) || i10 === `without` && BB(n10, r10) ? null : [n10, r10];
}
function aV(e10) {
  let t10 = e10.base, n10, r10;
  if (t10 <= 20) {
    if (n10 = K(t10 === 10 ? 1 : 2, t10 === 10 ? 5 : 10), r10 = K(t10 === 10 ? 1 : 2, Math.floor(t10 / n10)), n10 * r10 > t10 || n10 === 1 && r10 === 1) return null;
  } else if (t10 === 100) n10 = IB(0.85) ? K(2, 10) : 1, r10 = K(2, 10);
  else if (n10 = K(2, 9), r10 = PB([K(2, 9) * 10, K(11, 99), K(1, 9) * 100, K(11, 30)]), n10 * r10 > t10) return null;
  return IB(0.5) ? [n10, r10] : [r10, n10];
}
function uve(e10, t10) {
  let n10 = e10.scale, r10 = RB;
  return tV(e10, () => {
    let i10, a10 = false;
    if (t10 === `+`) {
      let t11 = iV(e10);
      if (!t11) return null;
      i10 = [r10(t11[0] * n10), `+`, r10(t11[1] * n10), `=`, r10((t11[0] + t11[1]) * n10)];
    } else if (t10 === `-`) {
      let t11 = lve(e10);
      if (!t11) return null;
      i10 = [r10(t11[0] * n10), `\u2212`, r10(t11[1] * n10), `=`, r10((t11[0] - t11[1]) * n10)];
    } else if (t10 === `*`) {
      let t11 = aV(e10);
      if (!t11) return null;
      let [a11, o11] = t11[0] >= t11[1] ? [t11[0] * n10, t11[1]] : [t11[0], t11[1] * n10];
      i10 = [r10(a11), `\xB7`, r10(o11), `=`, r10(a11 * o11)];
    } else {
      let t11 = aV(e10);
      if (!t11) return null;
      let o11 = e10.base <= 100 ? IB(0.5) ? t11[0] : t11[1] : Math.min(t11[0], t11[1]);
      if (o11 < 2) return null;
      let s10 = t11[0] * t11[1] / o11 * n10;
      if (e10.o.remainder) {
        let t12 = K(1, o11 - 1), n11 = s10 * o11 + t12;
        if (n11 > e10.R) return null;
        i10 = [r10(n11), `:`, r10(o11), `=`, `${r10(s10)} R ${r10(t12)}`], a10 = true;
      } else i10 = [r10(s10 * o11), `:`, r10(o11), `=`, r10(s10)];
    }
    let o10 = e10.o.gaps && !a10 && IB(0.5) ? PB([0, 2]) : 4;
    return { tok: i10, gap: o10, ans: i10[o10] };
  }, (e11) => e11.tok.join(` `));
}
var oV = () => true, sV = 74;
function dve(e10, t10, n10, r10) {
  let i10 = r10.includes(`:`) && e10.o.remainder, a10 = Math.max(2, RB(e10.R).length), o10 = ZB(a10, 34), s10 = i10 ? ZB(a10 + 4, 34) : o10, c10 = nV(2 * o10 + s10 + 80, 60, 4), l10 = new eV(70, VB, sV), u10 = n10 + (sV - XB(34)) / 2;
  for (let i11 = 0; i11 < c10.n; i11++) {
    let a11 = c10.x(i11), d10 = uve(e10, PB(r10)), f10 = [[a11, o10], [a11 + o10, 40], [a11 + o10 + 40, o10], [a11 + 2 * o10 + 40, 40], [a11 + 2 * o10 + 80, s10]];
    d10.tok.forEach((e11, r11) => {
      r11 === d10.gap ? rV(t10, l10, f10[r11][0], n10, 9, f10[r11][1], 56, d10.ans, 34) : t10.num(f10[r11][0], u10, f10[r11][1], e11, 34, r11 === 0 ? `right` : r11 === 4 ? `left` : `center`);
    });
  }
  t10.graphic(l10, n10, `Rechenk\xE4stchen`);
}
var fve = (e10) => e10.o.gaps ? `Rechne. Finde auch die fehlenden Zahlen.` : `Rechne.`;
function cV(e10, t10, n10, r10, i10, a10) {
  return { id: e10, label: t10, title: n10, sample: r10, group: `Rechnen`, available: oV, instruction: fve, rowH: () => sV, row: (e11, t11, n11) => dve(e11, t11, n11, a10 ? a10(e11) : i10()), mixRows: 2 };
}
function pve(e10, t10, n10) {
  let r10 = `die H\xE4lfte von ${RB(e10.R)}:`, i10 = Math.ceil(r10.length * 0.52 * 30 + 16), a10 = ZB(RB(e10.R).length, 30), o10 = nV(i10 + 10 + a10, 60, 3), s10 = new eV(70, VB, 70), c10 = e10.base, l10 = e10.scale;
  for (let r11 = 0; r11 < o10.n; r11++) {
    let u10 = o10.x(r11), d10 = IB(0.5), f10 = tV(e10, () => {
      if (d10) {
        let e12 = 2 * (c10 <= 20 ? K(1, c10 / 2) : c10 === 100 ? K(6, 50) : K(51, 500));
        return { label: `die H\xE4lfte von ${RB(e12 * l10)}:`, ans: RB(e12 / 2 * l10) };
      }
      let e11 = c10 <= 20 ? K(1, c10 / 2) : c10 === 100 ? K(6, 50) : PB([K(11, 99) * 5, K(6, 50) * 10, K(101, 500)]);
      return { label: `das Doppelte von ${RB(e11 * l10)}:`, ans: RB(2 * e11 * l10) };
    }, (e11) => e11.label);
    t10.text(u10, n10 + (70 - XB(30)) / 2, i10, mT(f10.label), 30, { align: `right` }), rV(t10, s10, u10 + i10 + 10, n10, 8, a10, 54, f10.ans, 30);
  }
  t10.graphic(s10, n10, `Rechenk\xE4stchen`);
}
function mve(e10, t10, n10) {
  let r10 = sV, i10 = ZB(Math.max(2, RB(e10.R).length), 34), a10 = nV(3 * i10 + 20, 60, 4), o10 = new eV(70, VB, r10);
  for (let s10 = 0; s10 < a10.n; s10++) {
    let c10 = a10.x(s10), l10 = tV(e10, () => e10.R <= 20 ? K(1, e10.R - 1) : K(2, e10.R - 1), (e11) => `nb${e11}`);
    rV(t10, o10, c10, n10, 9, i10, 56, RB(l10 - 1), 34), t10.num(c10 + i10 + 10, n10 + (r10 - XB(34)) / 2, i10, RB(l10), 34), rV(t10, o10, c10 + 2 * i10 + 20, n10, 9, i10, 56, RB(l10 + 1), 34);
  }
  t10.graphic(o10, n10, `Rechenk\xE4stchen`);
}
function hve(e10, t10, n10) {
  let r10 = sV, i10 = Math.max(2, RB(e10.R).length), a10 = ZB(i10, 34), o10 = e10.R <= 100, s10 = o10 ? ZB(2 * i10 + 3, 34) : a10, c10 = nV(s10 + 66 + a10 + 20, 60, 3), l10 = new eV(70, VB, r10);
  for (let i11 = 0; i11 < c10.n; i11++) {
    let u10 = c10.x(i11), d10 = tV(e10, () => {
      let t11, n11;
      if (o10 && IB(0.45)) {
        let r12 = iV({ ...e10, o: { ...e10.o, carry: `any` } });
        if (!r12) return null;
        n11 = r12[0] + r12[1], t11 = `${RB(r12[0])} + ${RB(r12[1])}`;
      } else n11 = K(1, e10.R - 1), t11 = RB(n11);
      let r11;
      if (IB(0.18)) r11 = n11;
      else if (n11 >= 10 && IB(0.3)) {
        let e11 = String(n11).split(``), t12 = K(0, e11.length - 2);
        [e11[t12], e11[t12 + 1]] = [e11[t12 + 1], e11[t12]], r11 = Number(e11.join(``)), (r11 === n11 || e11[0] === `0`) && (r11 = n11 + (IB(0.5) ? 1 : -1));
      } else r11 = n11 + (IB(0.5) ? 1 : -1) * K(1, Math.max(1, Math.round(e10.R / 10)));
      return r11 < 0 || r11 > e10.R ? null : { left: t11, right: RB(r11), ans: n11 < r11 ? `<` : n11 > r11 ? `>` : `=` };
    }, (e11) => `${e11.left}?${e11.right}`), f10 = n10 + (r10 - XB(34)) / 2;
    t10.num(u10, f10, s10, d10.left, 34, `right`), rV(t10, l10, u10 + s10 + 10, n10, 9, 66, 56, d10.ans, 34), t10.num(u10 + s10 + 66 + 20, f10, a10, d10.right, 34, `left`);
  }
  t10.graphic(l10, n10, `Rechenk\xE4stchen`);
}
var gve = { 10: [1, 2], 20: [1, 2, 3, 4, 5], 100: [2, 3, 4, 5, 6, 9, 10, 11, 20], 1e3: [5, 10, 20, 25, 50, 100, 110, 200, 250] };
function _ve(e10, t10, n10) {
  let r10 = sV, i10 = ZB(Math.max(2, RB(e10.R).length), 32) - 4, a10 = (e11) => e11 * i10 + (e11 - 1) * 8, o10 = 7;
  for (; a10(o10) > 1260 && o10 > 5; ) o10--;
  let s10 = o10 - (o10 >= 7 ? 3 : 2), c10 = nV(a10(o10), 90, 2), l10 = new eV(70, VB, r10);
  for (let r11 = 0; r11 < c10.n; r11++) {
    let a11 = c10.x(r11), u10 = tV(e10, () => {
      let t11 = PB(gve[e10.base]), n11 = (o10 - 1) * t11;
      if (n11 > e10.base) return null;
      let r12 = IB(0.65), i11 = t11 % 25 == 0 ? 25 : t11 % 10 == 0 ? 10 : t11 % 5 == 0 ? 5 : 1, a12 = r12 ? K(0, e10.base - n11) : K(n11, e10.base);
      return IB(0.6) && (a12 = r12 ? Math.floor(a12 / i11) * i11 : Math.ceil(a12 / i11) * i11), a12 < 0 || a12 > e10.base || (r12 ? a12 + n11 : a12 - n11) < 0 || (r12 ? a12 + n11 : a12) > e10.base ? null : Array.from({ length: o10 }, (n12, i12) => (a12 + (r12 ? i12 : -i12) * t11) * e10.scale);
    }, (e11) => e11.join(`,`));
    for (let e11 = 0; e11 < o10; e11++) {
      let r12 = a11 + e11 * (i10 + 8);
      e11 < s10 ? (l10.rect(r12 + 2, 10, i10 - 4, 54, `#eef2f7`, YB, 2, 8), t10.num(r12, n10 + 10 + (54 - XB(32)) / 2, i10, RB(u10[e11]), 32)) : rV(t10, l10, r12, n10, 10, i10, 54, RB(u10[e11]), 32);
    }
  }
  t10.graphic(l10, n10, `Zahlenfolgen`);
}
var lV = { roof: 66, floor: 52, floors: 4 };
function vve(e10, t10, n10) {
  let r10 = Math.max(74, ZB(RB(e10.R).length, 30)), i10 = 2 * r10, a10 = nV(i10, 50, 5), o10 = lV.roof + lV.floors * lV.floor, s10 = new eV(70, VB, o10 + 4), c10 = e10.base, l10 = e10.scale;
  for (let u10 = 0; u10 < a10.n; u10++) {
    let d10 = a10.x(u10), f10 = tV(e10, () => c10 === 10 ? K(5, 10) : c10 === 20 ? K(10, 20) : c10 === 100 ? IB(0.5) ? K(2, 10) * 10 : K(21, 99) : IB(0.5) ? K(2, 10) * 100 : K(11, 99) * 10, (e11) => `h${e11}`), p10 = c10 >= 100 && f10 % (c10 / 10) == 0 && f10 / (c10 / 10) >= 5 && IB(0.6) ? c10 / 10 : c10 === 1e3 && f10 % 10 == 0 ? 10 : 1, m10 = LB(Array.from({ length: f10 / p10 - 1 }, (e11, t11) => (t11 + 1) * p10));
    f10 <= 5 && m10.push(0);
    let h10 = m10.slice(0, lV.floors);
    s10.poly([[d10 - 6, lV.roof], [d10 + i10 / 2, 2], [d10 + i10 + 6, lV.roof]], `#ffe8a3`), s10.rect(d10, lV.roof, i10, lV.floors * lV.floor, `#ffffff`, GB, 2.5, 0), s10.line(d10 + r10, lV.roof, d10 + r10, o10, GB, 2);
    for (let e11 = 1; e11 < lV.floors; e11++) s10.line(d10, lV.roof + e11 * lV.floor, d10 + i10, lV.roof + e11 * lV.floor, GB, 2);
    t10.num(d10 + i10 * 0.2, n10 + 44 - XB(30) / 2, i10 * 0.6, RB(f10 * l10), 30), h10.forEach((e11, i11) => {
      let a11 = n10 + lV.roof + i11 * lV.floor + (lV.floor - XB(30)) / 2, o11 = IB(0.5), s11 = [e11 * l10, (f10 - e11) * l10];
      for (let e12 = 0; e12 < 2; e12++) {
        let n11 = d10 + e12 * r10;
        e12 === 0 === o11 ? t10.num(n11, a11, r10, RB(s11[e12]), 30) : t10.answer(n11, a11, r10, RB(s11[e12]), 30);
      }
    });
  }
  t10.graphic(s10, n10, `Zahlenh\xE4user`);
}
var yve = [`E`, `Z`, `H`, `T`, `ZT`, `HT`, `M`];
function bve(e10, t10, n10) {
  let r10 = String(e10.R - 1).length, i10 = ZB(RB(e10.R - 1).length, 30), a10 = nV(i10 + 40 + r10 * 58, 50, 3), o10 = new eV(70, VB, 100);
  for (let s10 = 0; s10 < a10.n; s10++) {
    let c10 = a10.x(s10), l10 = tV(e10, () => K(10 ** (r10 - 1), e10.R - 1), (e11) => `p${e11}`), u10 = String(l10).padStart(r10, `0`).split(``), d10 = c10 + i10 + 40;
    for (let e11 = 0; e11 < r10; e11++) o10.rect(d10 + e11 * 58, 8, 58, 34, `#dbeafe`, GB, 2, 0), o10.label(d10 + e11 * 58 + 29, 33, yve[r10 - 1 - e11], 19, qB), o10.rect(d10 + e11 * 58, 42, 58, 54, `#ffffff`, GB, 2, 0);
    let f10 = n10 + 42 + (54 - XB(30)) / 2;
    IB(0.5) ? (t10.num(c10, f10, i10, RB(l10), 30, `right`), u10.forEach((e11, n11) => t10.answer(d10 + n11 * 58, f10, 58, e11, 30))) : (rV(t10, o10, c10, n10, 42, i10, 54, RB(l10), 30), u10.forEach((e11, n11) => t10.num(d10 + n11 * 58, f10, 58, e11, 30))), t10.num(c10 + i10, f10, 40, `=`, 30);
  }
  t10.graphic(o10, n10, `Stellenwerttafel`);
}
function xve(e10, t10, n10) {
  let r10 = e10.R, i10 = 0, a10 = r10, o10 = 1;
  if (r10 >= 100) {
    if (IB(0.5)) o10 = r10 / 100;
    else if (r10 === 100) i10 = K(0, 8) * 10, a10 = i10 + 20;
    else {
      let e11 = r10 / 10;
      i10 = K(0, 9) * e11, a10 = i10 + e11, o10 = e11 / 100;
    }
  }
  let s10 = Math.round((a10 - i10) / o10), c10 = s10 === 10 ? 5 : 10, l10 = 1160 / s10, u10 = ZB(RB(a10).length, 26) - 6, d10 = new eV(70, VB, 130);
  d10.line(90, 40, 1310, 40, GB, 3), d10.poly([[1310, 31], [1326, 40], [1310, 49]], GB, GB, 1);
  for (let e11 = 0; e11 <= s10; e11++) {
    let t11 = 120 + e11 * l10, n11 = e11 % c10 === 0 ? 22 : e11 % 5 == 0 ? 15 : 8;
    d10.line(t11, 40 - n11, t11, 40 + n11, GB, e11 % c10 === 0 ? 3 : 2);
  }
  let f10 = [], p10 = (e11) => f10.every((t11) => Math.abs(t11 - e11) > u10 + 14), m10 = (e11, r11) => {
    let a11 = 120 + e11 * l10;
    f10.push(a11);
    let s11 = RB(i10 + e11 * o10);
    r11 ? (d10.line(a11, 62, a11, 70, JB, 2), rV(t10, d10, a11 - u10 / 2, n10, 70, u10, 48, s11, 26)) : t10.num(a11 - u10 / 2, n10 + 70 + (48 - XB(26)) / 2, u10, s11, 26);
  };
  m10(0, false), m10(s10, false), IB(0.5) && p10(120 + s10 / 2 * l10) && m10(s10 / 2, false);
  let h10 = s10 <= 10 ? 3 : 4, g10 = 0;
  for (let e11 = 0; e11 < 200 && g10 < h10; e11++) {
    let e12 = s10 >= 50 && IB(0.7) ? K(1, s10 / 5 - 1) * 5 : K(1, s10 - 1);
    p10(120 + e12 * l10) && (m10(e12, true), g10++);
  }
  t10.graphic(d10, n10, `Zahlenstrahl`);
}
function Sve(e10, t10, n10) {
  let r10 = 8.6, i10 = ZB(3, 32), a10 = nV(266 + i10, 50, 4), o10 = new eV(70, VB, 248), s10 = new eV(70, VB, 248);
  for (let c10 = 0; c10 < a10.n; c10++) {
    let l10 = a10.x(c10), u10 = tV(e10, () => K(7, 100), (e11) => `f${e11}`), d10 = IB(0.4);
    for (let e11 of [o10, s10]) e11.rect(l10, 0, 242, 242, `#ffffff`, YB, 2, 10);
    for (let e11 = 0; e11 < 10; e11++) for (let t11 = 0; t11 < 10; t11++) {
      let n11 = l10 + 6 + 11 + t11 * 22 + (t11 >= 5 ? 10 : 0), i11 = 17 + e11 * 22 + (e11 >= 5 ? 10 : 0), a11 = e11 * 10 + t11 + 1 <= u10, c11 = t11 < 5 ? `#e03131` : `#2160c4`;
      s10.circle(n11, i11, r10, a11 ? c11 : `#ffffff`, a11 ? `none` : `#94a3b8`, 1.6), d10 || !a11 ? o10.circle(n11, i11, r10, `#ffffff`, `#94a3b8`, 1.6) : o10.circle(n11, i11, r10, c11);
    }
    d10 ? t10.num(l10 + 242 + 24, n10 + 93 + (56 - XB(32)) / 2, i10, RB(u10), 32) : (rV(t10, o10, l10 + 242 + 24, n10, 93, i10, 56, RB(u10), 32), s10.rect(l10 + 242 + 26, 93, i10 - 4, 56));
  }
  t10.graphic(o10, n10, `Hunderterfeld`, s10);
}
var uV = { cell: 30, mid: 8, pad: 22, top: 8 }, dV = (e10) => {
  let t10 = e10 === 10 ? 5 : 10, n10 = t10 * uV.cell + (t10 === 10 ? uV.mid : 0);
  return { cols: t10, innerW: n10, w: n10 + 2 * uV.pad, h: 2 * uV.cell + 2 * uV.top };
};
function Cve(e10, t10, n10) {
  let r10 = dV(e10.R), i10 = ZB(2, 30), a10 = 3 * i10 + 68, o10 = Math.max(r10.w, a10), s10 = nV(o10, 50, 4), c10 = r10.h + 12, l10 = c10 + 52 + 2, u10 = new eV(70, VB, l10), d10 = new eV(70, VB, l10), f10 = `#b45309`;
  for (let l11 = 0; l11 < s10.n; l11++) {
    let p10 = s10.x(l11), m10 = p10 + (o10 - r10.w) / 2, [h10, g10] = tV(e10, () => {
      let t11 = K(3, e10.R), n11 = K(1, t11 - 1), r11 = t11 - n11, i11 = e10.R <= 10 ? `any` : e10.o.carry;
      return i11 === `with` && !zB(n11, r11) || i11 === `without` && zB(n11, r11) ? null : [n11, r11];
    }, (e11) => `b${e11[0]}+${e11[1]}`), _10 = IB(0.4);
    for (let e11 of [u10, d10]) {
      e11.poly([[m10, 0], [m10 + r10.w, 0], [m10 + r10.w - 18, r10.h], [m10 + 18, r10.h]], `#fde68a`, f10, 2.5);
      let t11 = m10 + uV.pad;
      e11.rect(t11, uV.top, r10.innerW, 2 * uV.cell, `#ffffff`, f10, 2, 3);
      for (let n11 = 1; n11 < r10.cols; n11++) {
        let i11 = t11 + n11 * uV.cell + (n11 >= 5 && r10.cols === 10 ? uV.mid : 0);
        n11 === 5 && r10.cols === 10 && (e11.line(i11 - uV.mid, uV.top, i11 - uV.mid, uV.top + 2 * uV.cell, f10, 1.5), e11.line(i11 - uV.mid / 2, uV.top, i11 - uV.mid / 2, uV.top + 2 * uV.cell, f10, uV.mid - 2)), e11.line(i11, uV.top, i11, uV.top + 2 * uV.cell, f10, 1.5);
      }
      e11.line(t11, uV.top + uV.cell, t11 + r10.innerW, uV.top + uV.cell, f10, 1.5);
    }
    for (let e11 = 0; e11 < h10 + g10; e11++) {
      let t11 = Math.floor(e11 / r10.cols), n11 = e11 % r10.cols, i11 = m10 + uV.pad + n11 * uV.cell + (n11 >= 5 && r10.cols === 10 ? uV.mid : 0) + uV.cell / 2, a11 = uV.top + t11 * uV.cell + uV.cell / 2, o11 = e11 < h10 ? `#e03131` : `#1c7ed6`;
      d10.circle(i11, a11, 11, o11), _10 || u10.circle(i11, a11, 11, o11);
    }
    let v10 = p10 + (o10 - a10) / 2, y10 = [[v10, i10], [v10 + i10, 34], [v10 + i10 + 34, i10], [v10 + 2 * i10 + 34, 34], [v10 + 2 * i10 + 68, i10]], b10 = [String(h10), `+`, String(g10), `=`, String(h10 + g10)], x10 = n10 + c10 + (52 - XB(30)) / 2;
    b10.forEach((e11, r11) => {
      (_10 ? r11 === 4 : r11 % 2 == 0) ? (rV(t10, u10, y10[r11][0], n10, c10, y10[r11][1], 52, e11, 30), d10.rect(y10[r11][0] + 2, c10, y10[r11][1] - 4, 52)) : t10.num(y10[r11][0], x10, y10[r11][1], e11, 30, r11 === 0 ? `right` : r11 === 4 ? `left` : `center`);
    });
  }
  t10.graphic(u10, n10, `Rechenschiffchen`, d10);
}
var fV = 46;
function pV(e10, t10, n10, r10) {
  let i10 = Math.min(6, String(e10.R).length - 1), a10 = i10 + (r10 === `+` ? 2 : 1), o10 = a10 * fV, s10 = nV(o10, 56, 5), c10 = new eV(70, VB, 168), l10 = e10.o.carry;
  for (let u10 = 0; u10 < s10.n; u10++) {
    let d10 = s10.x(u10), [f10, p10] = tV(e10, () => {
      let t11 = 10 ** (i10 - 1), n11 = K(r10 === `+` ? t11 : Math.ceil(t11 * 1.5), Math.min(e10.R - 1, 10 ** i10 - 1)), a11 = i10 > 1 && IB(0.3) ? i10 - 1 : i10, o11 = K(10 ** (a11 - 1), 10 ** a11 - 1);
      if (l10 === `without`) {
        let e11 = String(n11).split(``).reverse().map(Number), t12 = 0;
        for (let n12 = 0; n12 < a11; n12++) {
          let i11 = r10 === `+` ? 9 - e11[n12] : e11[n12], o12 = +(n12 === a11 - 1);
          if (i11 < o12) return null;
          t12 += K(o12, i11) * 10 ** n12;
        }
        o11 = t12;
      }
      if (r10 === `+` && n11 + o11 > e10.R || r10 === `-` && o11 >= n11) return null;
      let s11 = r10 === `+` ? zB(n11, o11) : BB(n11, o11);
      return l10 === `with` && !s11 || l10 === `without` && s11 ? null : [n11, o11];
    }, (e11) => `w${r10}${e11[0]},${e11[1]}`), m10 = r10 === `+` ? f10 + p10 : f10 - p10, h10 = [2, 48, 120];
    for (let e11 of h10) for (let t11 = 0; t11 < a10; t11++) c10.rect(d10 + t11 * fV, e11, fV, fV, `none`, YB, 1.6, 0);
    for (let e11 = 0; e11 < a10; e11++) c10.rect(d10 + e11 * fV + 8, 97, 30, 20, `none`, YB, 1.2, 4);
    c10.line(d10, h10[2], d10 + o10, h10[2], GB, 3);
    let g10 = (e11, r11, i11) => {
      let o11 = String(e11).split(``);
      o11.forEach((e12, s11) => {
        let c11 = d10 + (a10 - o11.length + s11) * fV, l11 = n10 + r11 + (fV - XB(30)) / 2;
        i11 ? t10.answer(c11, l11, fV, e12, 30) : t10.num(c11, l11, fV, e12, 30);
      });
    };
    g10(f10, h10[0], false), g10(p10, h10[1], false), t10.num(d10, n10 + h10[1] + (fV - XB(30)) / 2, fV, r10 === `+` ? `+` : `\u2212`, 30), g10(m10, h10[2], true);
  }
  t10.graphic(c10, n10, `Rechenk\xE4stchen`);
}
var wve = { 3: [[`00`, `02`, `10`], [`00`, `02`, `20`], [`01`, `10`, `11`], [`00`, `11`, `20`], [`02`, `10`, `20`]], 4: [[`00`, `01`, `03`, `12`], [`00`, `02`, `10`, `12`], [`01`, `02`, `10`, `12`], [`00`, `01`, `02`, `30`], [`10`, `11`, `12`, `01`], [`00`, `03`, `11`, `20`]] };
function Tve(e10, t10, n10) {
  let r10 = e10.R <= 20 ? 3 : 4, i10 = Math.max(88, ZB(RB(e10.R).length, 28)), a10 = nV(r10 * i10, 50, 4), o10 = new eV(70, VB, r10 * 52 + 4), s10 = e10.base, c10 = r10 === 3 ? 4 : 8;
  for (let l10 = 0; l10 < a10.n; l10++) {
    let u10 = a10.x(l10), d10 = tV(e10, () => {
      let t11 = Math.max(2, Math.floor(s10 / c10 * 1.6)), n11 = [Array.from({ length: r10 }, () => K(s10 <= 10 ? 0 : 1, t11))];
      for (; n11[n11.length - 1].length > 1; ) {
        let e11 = n11[n11.length - 1];
        n11.push(e11.slice(1).map((t12, n12) => e11[n12] + t12));
      }
      let i11 = n11[r10 - 1][0];
      return i11 > s10 || i11 < s10 * 0.3 ? null : n11.map((t12) => t12.map((t13) => t13 * e10.scale));
    }, (e11) => e11[0].join(`,`)), f10 = e10.o.gaps && !IB(0.2) ? PB(wve[r10]) : null;
    for (let e11 = 0; e11 < r10; e11++) {
      let a11 = r10 - e11, s11 = (r10 - 1 - e11) * 52;
      for (let c11 = 0; c11 < a11; c11++) {
        let a12 = u10 + e11 * i10 / 2 + c11 * i10;
        o10.rect(a12, s11, i10, 52, e11 === r10 - 1 ? `#ffe3e3` : `#ffffff`, `#b45309`, 2.5, 4);
        let l11 = f10 ? f10.includes(`${e11}${c11}`) : e11 === 0, p10 = n10 + s11 + (52 - XB(28)) / 2;
        l11 ? t10.num(a12, p10, i10, RB(d10[e11][c11]), 28) : t10.answer(a12, p10, i10, RB(d10[e11][c11]), 28);
      }
    }
  }
  t10.graphic(o10, n10, `Rechenmauern`);
}
function Eve(e10, t10, n10) {
  let r10 = ZB(Math.max(2, RB(e10.R).length), 28), i10 = Math.max(230, 3.3 * r10), a10 = Math.round(i10 * 0.87), o10 = nV(i10 + 2 * (r10 + 16), 30, 3), s10 = new eV(70, VB, a10 + 50 + 22), c10 = e10.base;
  for (let l10 = 0; l10 < o10.n; l10++) {
    let u10 = o10.x(l10) + r10 + 16, [d10, f10, p10] = tV(e10, () => {
      let t11 = Math.max(2, Math.floor(c10 / 2)), n11 = [K(1, t11), K(1, t11), K(1, t11)];
      return n11[0] + n11[1] > c10 || n11[0] + n11[2] > c10 || n11[1] + n11[2] > c10 ? null : n11.map((t12) => t12 * e10.scale);
    }, (e11) => e11.join(`,`)), m10 = [u10 + i10 / 2, 4], h10 = [u10, a10], g10 = [u10 + i10, a10];
    s10.poly([m10, h10, g10], `#e7f5ff`, qB, 3);
    let _10 = [u10 + i10 / 2, a10 * 0.64];
    s10.line(_10[0], _10[1], (m10[0] + h10[0]) / 2, (m10[1] + h10[1]) / 2, qB, 2), s10.line(_10[0], _10[1], (m10[0] + g10[0]) / 2, (m10[1] + g10[1]) / 2, qB, 2), s10.line(_10[0], _10[1], _10[0], a10, qB, 2);
    let v10 = [[u10 + i10 / 2, a10 * 0.38, d10], [u10 + i10 * 0.27, a10 * 0.82, f10], [u10 + i10 * 0.73, a10 * 0.82, p10]], y10 = [[u10 + i10 * 0.25 - r10 / 2 - 26, a10 * 0.48, d10 + f10], [u10 + i10 * 0.75 + r10 / 2 + 26, a10 * 0.48, d10 + p10], [u10 + i10 / 2, a10 + 25 + 12, f10 + p10]], [b10, x10] = e10.o.gaps && !IB(0.2) ? PB([[[true, true, false], [false, true, false]], [[true, false, true], [true, false, false]], [[false, true, true], [true, false, false]], [[true, false, false], [true, true, false]], [[false, true, false], [true, false, true]], [[false, false, true], [false, true, true]]]) : [[true, true, true], [false, false, false]];
    v10.forEach(([e11, i11, a11], o11) => {
      let s11 = n10 + i11 - XB(28) / 2;
      b10[o11] ? t10.num(e11 - r10 / 2, s11, r10, RB(a11), 28) : t10.answer(e11 - r10 / 2, s11, r10, RB(a11), 28);
    }), y10.forEach(([e11, i11, a11], o11) => {
      x10[o11] ? (s10.rect(e11 - r10 / 2, i11 - 25, r10, 50, `#ffffff`, qB, 2.5, 8), t10.num(e11 - r10 / 2, n10 + i11 - XB(28) / 2, r10, RB(a11), 28)) : rV(t10, s10, e11 - r10 / 2, n10, i11 - 25, r10, 50, RB(a11), 28);
    });
  }
  t10.graphic(s10, n10, `Rechendreiecke`);
}
var Dve = [2, 7, 6, 9, 5, 1, 4, 3, 8], Ove = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
function kve(e10) {
  let t10 = new Set(e10);
  for (let e11 = true; e11 && t10.size; ) {
    e11 = false;
    for (let n10 of Ove) {
      let r10 = n10.filter((e12) => t10.has(e12));
      r10.length === 1 && (t10.delete(r10[0]), e11 = true);
    }
  }
  return t10.size === 0;
}
function Ave(e10, t10, n10) {
  let r10 = e10.base, i10 = Math.max(74, ZB(RB(e10.R).length, 32)), a10 = 3 * i10, o10 = nV(a10, 50, 4), s10 = new eV(70, VB, 40 + a10 + 4);
  for (let c10 = 0; c10 < o10.n; c10++) {
    let l10 = o10.x(c10), u10 = tV(e10, () => {
      let t11 = r10 === 10 ? 1 : r10 === 20 ? K(1, 2) : r10 === 100 ? K(1, 10) : K(2, 100), n11 = K(0, Math.max(0, r10 - 9 * t11));
      if (9 * t11 + n11 > r10) return null;
      let i11 = [...Dve];
      for (let e11 = K(0, 3); e11 > 0; e11--) i11 = [6, 3, 0, 7, 4, 1, 8, 5, 2].map((e12) => i11[e12]);
      return IB(0.5) && (i11 = [2, 1, 0, 5, 4, 3, 8, 7, 6].map((e11) => i11[e11])), { vals: i11.map((r11) => (t11 * r11 + n11) * e10.scale), sum: (15 * t11 + 3 * n11) * e10.scale };
    }, (e11) => e11.vals.join(`,`)), d10 = /* @__PURE__ */ new Set(), f10 = IB(0.5) ? 4 : 5;
    for (let e11 = 0; e11 < 200; e11++) {
      let e12 = new Set(LB([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, f10));
      if (kve(e12)) {
        d10 = e12;
        break;
      }
    }
    t10.text(l10 - 20, n10 + (40 - XB(24)) / 2, a10 + 40, mT(`Zauberzahl: ${RB(u10.sum)}`), 24, { bold: true, color: `#7c3aed` }), s10.rect(l10, 40, a10, a10, `#ffffff`, `#7c3aed`, 3.5, 6);
    for (let e11 = 1; e11 < 3; e11++) s10.line(l10 + e11 * i10, 40, l10 + e11 * i10, 40 + a10, `#7c3aed`, 2), s10.line(l10, 40 + e11 * i10, l10 + a10, 40 + e11 * i10, `#7c3aed`, 2);
    u10.vals.forEach((e11, r11) => {
      let a11 = l10 + r11 % 3 * i10, o11 = n10 + 40 + Math.floor(r11 / 3) * i10 + (i10 - XB(32)) / 2;
      d10.has(r11) ? t10.answer(a11, o11, i10, RB(e11), 32) : t10.num(a11, o11, i10, RB(e11), 32);
    });
  }
  t10.graphic(s10, n10, `Magische Quadrate`);
}
function jve(e10) {
  let t10 = e10.map((e11) => [...e11]), n10 = (e11, n11, r11) => {
    for (let i11 = 0; i11 < 4; i11++) if (t10[e11][i11] === r11 || t10[i11][n11] === r11) return false;
    let i10 = e11 - e11 % 2, a10 = n11 - n11 % 2;
    for (let e12 = 0; e12 < 2; e12++) for (let n12 = 0; n12 < 2; n12++) if (t10[i10 + e12][a10 + n12] === r11) return false;
    return true;
  }, r10 = (e11) => {
    if (e11 === 16) return true;
    let i10 = Math.floor(e11 / 4), a10 = e11 % 4;
    if (t10[i10][a10]) return r10(e11 + 1);
    for (let o10 = 1; o10 <= 4; o10++) if (n10(i10, a10, o10)) {
      if (t10[i10][a10] = o10, r10(e11 + 1)) return true;
      t10[i10][a10] = 0;
    }
    return false;
  };
  return r10(0), t10;
}
function Mve(e10, t10, n10) {
  let r10 = nV(232, 60, 4), i10 = new eV(70, VB, 236);
  for (let a10 = 0; a10 < r10.n; a10++) {
    let o10 = r10.x(a10), s10 = tV(e10, () => vA(4), (e11) => e11.flat().join(``)), c10 = jve(s10);
    i10.rect(o10, 0, 232, 232, `#ffffff`, GB, 4, 4);
    for (let e11 = 1; e11 < 4; e11++) i10.line(o10 + e11 * 58, 0, o10 + e11 * 58, 232, GB, e11 === 2 ? 4 : 1.6), i10.line(o10, e11 * 58, o10 + 232, e11 * 58, GB, e11 === 2 ? 4 : 1.6);
    for (let e11 = 0; e11 < 4; e11++) for (let r11 = 0; r11 < 4; r11++) {
      let i11 = n10 + e11 * 58 + (58 - XB(34)) / 2;
      s10[e11][r11] ? t10.text(o10 + r11 * 58, i11, 58, String(s10[e11][r11]), 34, { bold: true }) : t10.answer(o10 + r11 * 58, i11, 58, String(c10[e11][r11]), 34);
    }
  }
  t10.graphic(i10, n10, `Sudoku`);
}
var Nve = (e10) => (t10) => t10 <= e10, mV = (e10) => (t10) => t10 >= e10, hV = Pve([cV(`plus`, `Plus`, `Plus-Aufgaben`, `3 + 4 = \u25A2`, () => [`+`]), cV(`minus`, `Minus`, `Minus-Aufgaben`, `9 \u2212 5 = \u25A2`, () => [`-`]), cV(`mal`, `Mal`, `Mal-Aufgaben`, `3 \xB7 4 = \u25A2`, () => [`*`]), cV(`geteilt`, `Geteilt`, `Geteilt-Aufgaben`, `12 : 3 = \u25A2`, () => [`:`]), cV(`mixed`, `Gemischt`, `Gemischte Aufgaben`, `+ \u2212 \xB7 : gemischt`, () => [`+`, `-`], (e10) => e10.o.mixOps.length ? e10.o.mixOps : [`+`, `-`]), { id: `double`, label: `Verdoppeln & Halbieren`, title: `Verdoppeln und Halbieren`, sample: `das Doppelte von 6`, group: `Rechnen`, available: oV, instruction: () => `Verdopple und halbiere.`, rowH: () => 70, row: pve, mixRows: 2 }, { id: `neighbors`, label: `Nachbarzahlen`, title: `Nachbarzahlen`, sample: `\u25A2 15 \u25A2`, group: `Zahlen`, available: oV, instruction: () => `Schreibe die Nachbarzahlen: eins weniger und eins mehr.`, rowH: () => sV, row: mve, mixRows: 2 }, { id: `compare`, label: `Vergleichen`, title: `Zahlen vergleichen`, sample: `14 \u25A2 17  (<, >, =)`, group: `Zahlen`, available: oV, instruction: () => `Setze <, > oder = ein.`, rowH: () => sV, row: hve, mixRows: 2 }, { id: `sequence`, label: `Zahlenfolgen`, title: `Zahlenfolgen`, sample: `2, 4, 6, \u25A2, \u25A2`, group: `Zahlen`, available: oV, instruction: () => `Wie geht es weiter? Setze die Zahlenfolgen fort.`, rowH: () => sV, row: _ve, mixRows: 2 }, { id: `house`, label: `Zahlenh\xE4user`, title: `Zahlenh\xE4user`, sample: `Zerlegen: 7 = 3 + \u25A2`, group: `Zahlen`, available: oV, instruction: () => `Zerlege die Zahl im Dach. Erg\xE4nze die Zahlenh\xE4user.`, rowH: () => lV.roof + lV.floors * lV.floor + 6, row: vve }, { id: `place`, label: `Stellenwerte`, title: `Stellenwerte`, sample: `H Z E \u2013 Stellenwerttafel`, group: `Zahlen`, available: mV(20), hint: `ab Zahlenraum 20`, instruction: () => `Trage die Zahl in die Stellenwerttafel ein oder schreibe die Zahl auf.`, rowH: () => 102, row: bve, mixRows: 2 }, { id: `line`, label: `Zahlenstrahl`, title: `Zahlenstrahl`, sample: `0 \u253C\u253C\u253C\u253C 10`, group: `Zahlen`, available: oV, instruction: () => `Welche Zahlen geh\xF6ren an den Zahlenstrahl?`, rowH: () => 130, row: xve, mixRows: 1 }, { id: `boat`, label: `Rechenschiffchen`, title: `Rechenschiffchen`, sample: `\u25CF\u25CF\u25CF\u25CF\u25CB rote + blaue Pl\xE4ttchen`, group: `Zahlen`, available: Nve(20), hint: `nur bis 20`, instruction: () => `Schreibe die Aufgabe zu den Pl\xE4ttchen \u2013 oder male die Pl\xE4ttchen ins Schiffchen.`, rowH: (e10) => dV(e10.R).h + 12 + 52 + 4, row: Cve }, { id: `field`, label: `Hunderterfeld`, title: `Hunderterfeld`, sample: `\u25CF\u25CF\u25CF\u25CB\u25CB Zahlen bis 100`, group: `Zahlen`, available: (e10) => e10 === 100, hint: `nur im Zahlenraum bis 100`, instruction: () => `Wie viele Punkte sind es? Schreibe die Zahl auf \u2013 oder male so viele Punkte an.`, rowH: () => 248, row: Sve }, { id: `wplus`, label: `Schriftlich plus`, title: `Schriftlich addieren`, sample: `  345
+ 123`, group: `Schriftlich`, available: mV(100), hint: `ab Zahlenraum 100`, instruction: () => `Rechne schriftlich. Den \xDCbertrag schreibst du klein in die schmale Zeile.`, rowH: () => 170, row: (e10, t10, n10) => pV(e10, t10, n10, `+`) }, { id: `wminus`, label: `Schriftlich minus`, title: `Schriftlich subtrahieren`, sample: `  586
\u2212 243`, group: `Schriftlich`, available: mV(100), hint: `ab Zahlenraum 100`, instruction: () => `Rechne schriftlich. Den \xDCbertrag schreibst du klein in die schmale Zeile.`, rowH: () => 170, row: (e10, t10, n10) => pV(e10, t10, n10, `-`) }, { id: `wall`, label: `Rechenmauern`, title: `Rechenmauern`, sample: `Steine addieren`, group: `Knobeln`, available: oV, instruction: (e10) => e10.o.gaps ? `Zwei Steine nebeneinander ergeben zusammen den Stein dar\xFCber. Finde alle fehlenden Steine.` : `Zwei Steine nebeneinander ergeben zusammen den Stein dar\xFCber.`, rowH: (e10) => (e10.R <= 20 ? 3 : 4) * 52 + 6, row: Tve }, { id: `triangle`, label: `Rechendreiecke`, title: `Rechendreiecke`, sample: `innen + innen = au\xDFen`, group: `Knobeln`, available: oV, instruction: (e10) => e10.o.gaps ? `Zwei Zahlen innen ergeben zusammen die Zahl au\xDFen daneben. Finde auch fehlende Zahlen innen.` : `Zwei Zahlen innen ergeben zusammen die Zahl au\xDFen daneben.`, rowH: (e10) => {
  let t10 = ZB(Math.max(2, RB(e10.R).length), 28);
  return Math.round(Math.max(230, 3.3 * t10) * 0.87) + 50 + 24;
}, row: Eve }, { id: `magic`, label: `Magische Quadrate`, title: `Magische Quadrate`, sample: `Zauberzahl 15`, group: `Knobeln`, available: oV, instruction: () => `In jeder Zeile, jeder Spalte und jeder Diagonale ergibt sich die Zauberzahl.`, rowH: (e10) => 40 + 3 * Math.max(74, ZB(RB(e10.R).length, 32)) + 6, row: Ave }, { id: `sudoku`, label: `Sudoku 4 \xD7 4`, title: `Sudoku`, sample: `1 bis 4`, group: `Knobeln`, available: oV, noRange: true, instruction: () => `In jeder Zeile, jeder Spalte und jedem Viererblock steht jede Zahl von 1 bis 4 genau einmal.`, rowH: () => 238, row: Mve }]);
function Pve(e10) {
  let t10 = sve(), n10 = [];
  for (let r10 of e10) n10.push(r10), e10.slice(e10.indexOf(r10) + 1).some((e11) => e11.group === r10.group) || n10.push(...t10.filter((e11) => e11.group === r10.group));
  return [...n10, ...t10.filter((t11) => !e10.some((e11) => e11.group === t11.group))];
}
var gV = (e10) => hV.find((t10) => t10.id === e10), _V = (e10) => RB(e10);
function vV(e10, t10) {
  return e10.text(70, 34, VB, mT(t10), 44, { align: `left`, bold: true, color: qB, font: `nunito` });
}
function yV(e10, t10, n10, r10, i10) {
  let a10 = n10.instruction(e10);
  t10.text(70, r10, VB, mT(a10), a10.length > 84 ? 22 : 26, { align: `left`, bold: true, color: KB, font: `nunito` }), r10 += 46;
  let o10 = n10.rowH(e10);
  for (let a11 = 0; a11 < i10; a11++) n10.row(e10, t10, r10), r10 += o10 + UB;
  return r10;
}
function Fve(e10, t10, n10) {
  let r10 = ZO(n10);
  r10.items = e10.items.map((e11) => {
    let n11 = t10.swaps.get(e11.id);
    if (n11) return { ...n11, id: YO(`st`) };
    let r11 = { ...e11, id: YO(e11.type.slice(0, 2)) }, i11 = t10.answers.get(e11.id);
    return i11 !== void 0 && r11.type === `text` && (r11.html = mT(i11), r11.color = cve, r11.bold = true, delete r11.placeholder), r11;
  });
  let i10 = r10.items.find((e11) => e11.type === `text` && e11.y < HB && e11.size === 44);
  return i10 && (i10.html = `L\xF6sung: ${i10.html}`), r10;
}
function bV(e10, t10, n10, r10, i10, a10) {
  if (!e10.length) return [];
  let o10 = [], s10 = (e11) => {
    let t11 = ZO(i10);
    return t11.items = e11.items, t11;
  };
  if (t10.layout === `single` || e10.length === 1) {
    let i11 = Math.max(1, t10.pages);
    for (let t11 of e10) for (let e11 = 0; e11 < i11; e11++) {
      let e12 = n10(), i12 = new $B();
      vV(i12, r10(t11));
      let c11 = t11.rowH(e12);
      yV(e12, i12, t11, HB, Math.max(1, Math.floor(814 / (c11 + UB)))), a10?.placed.add(t11.id), o10.push({ page: s10(i12), sheet: i12 });
    }
  } else {
    let i11 = 0;
    for (let c11 = 0; c11 < Math.max(1, t10.pages); c11++) {
      let t11 = n10(), c12 = [], l10 = 0;
      for (let n11 = 0; n11 < e10.length; n11++) {
        let r11 = e10[(i11 + n11) % e10.length], a11 = r11.rowH(t11) + UB, o11 = 46 + a11 + (c12.length ? WB : 0);
        if (l10 + o11 > 848 && c12.length) break;
        let s11 = Math.max(1, Math.min(r11.mixRows ?? 1, Math.floor((848 - l10 - o11 + a11) / a11)));
        c12.push({ f: r11, rows: s11 }), l10 += o11 + (s11 - 1) * a11;
      }
      i11 = (i11 + c12.length) % e10.length;
      for (let e11 = true; e11; ) {
        e11 = false;
        for (let n11 of c12) {
          let r11 = n11.f.rowH(t11) + UB;
          l10 + r11 <= 848 && (n11.rows++, l10 += r11, e11 = true);
        }
      }
      let u10 = new $B();
      vV(u10, r10(null));
      let d10 = HB;
      for (let e11 of c12) d10 = yV(t11, u10, e11.f, d10, e11.rows) + WB, a10?.placed.add(e11.f.id);
      o10.push({ page: s10(u10), sheet: u10 });
    }
  }
  let c10 = o10.map((e11) => e11.page);
  if (t10.solutions) for (let e11 of o10) c10.push(Fve(e11.page, e11.sheet, i10));
  return c10;
}
function Ive(e10) {
  let t10 = e10.range > 1e3 ? e10.range / 1e3 : 1;
  return { R: e10.range, base: e10.range / t10, scale: t10, o: e10, seen: /* @__PURE__ */ new Set() };
}
function xV(e10, t10) {
  let n10 = e10.formats.map(gV).filter((t11) => !!t11 && t11.available(e10.range)), r10 = (t11) => t11?.noRange ? `` : ` bis ${_V(e10.range)}`;
  return bV(n10, e10, () => Ive(e10), (e11) => `${e11 ? e11.title : `Mathe`}${r10(e11)}`, `math`, t10);
}
function Lve() {
  return xV({ ...NB, range: 20, formats: [`plus`, `wall`, `line`], layout: `mixed`, pages: 1 })[0];
}

// Sudoku with exactly one solution (from the reference).
function vA(e10) {
  let t10 = e10 === 4 ? 2 : 3, n10 = Array.from({ length: e10 }, () => Array(e10).fill(0)), r10 = (r11, i11, a11) => {
    for (let t11 = 0; t11 < e10; t11++) if (n10[r11][t11] === a11 || n10[t11][i11] === a11) return false;
    let o11 = r11 - r11 % t10, s11 = i11 - i11 % t10;
    for (let e11 = 0; e11 < t10; e11++) for (let r12 = 0; r12 < t10; r12++) if (n10[o11 + e11][s11 + r12] === a11) return false;
    return true;
  }, i10 = () => Array.from({ length: e10 }, (e11, t11) => t11 + 1).sort(() => Math.random() - 0.5), a10 = (t11) => {
    if (t11 === e10 * e10) return true;
    let o11 = Math.floor(t11 / e10), s11 = t11 % e10;
    for (let e11 of i10()) if (r10(o11, s11, e11)) {
      if (n10[o11][s11] = e11, a10(t11 + 1)) return true;
      n10[o11][s11] = 0;
    }
    return false;
  };
  a10(0);
  let o10 = (t11) => {
    let i11 = -1;
    for (let t12 = 0; t12 < e10 * e10; t12++) if (!n10[Math.floor(t12 / e10)][t12 % e10]) {
      i11 = t12;
      break;
    }
    if (i11 < 0) return 1;
    let a11 = Math.floor(i11 / e10), s11 = i11 % e10, c11 = 0;
    for (let i12 = 1; i12 <= e10 && c11 < t11; i12++) r10(a11, s11, i12) && (n10[a11][s11] = i12, c11 += o10(t11 - c11), n10[a11][s11] = 0);
    return c11;
  }, s10 = e10 === 4 ? 8 : 34, c10 = e10 * e10, l10 = Array.from({ length: e10 * e10 }, (e11, t11) => t11).sort(() => Math.random() - 0.5);
  for (let t11 of l10) {
    if (c10 <= s10) break;
    let r11 = Math.floor(t11 / e10), i11 = t11 % e10, a11 = n10[r11][i11];
    n10[r11][i11] = 0, o10(2) === 1 ? c10-- : n10[r11][i11] = a11;
  }
  return n10;
}


// ---- Uhrzeiten üben ----
var Gse = [`zw\xF6lf`, `eins`, `zwei`, `drei`, `vier`, `f\xFCnf`, `sechs`, `sieben`, `acht`, `neun`, `zehn`, `elf`, `zw\xF6lf`], gT = (e10) => Gse[(e10 - 1) % 12 + 1];
function _T(e10, t10) {
  let n10 = gT(e10), r10 = gT(e10 + 1);
  switch (t10) {
    case 0:
      return e10 % 12 == 1 ? `ein Uhr` : `${n10} Uhr`;
    case 5:
      return `f\xFCnf nach ${n10}`;
    case 10:
      return `zehn nach ${n10}`;
    case 15:
      return `Viertel nach ${n10}`;
    case 20:
      return `zwanzig nach ${n10}`;
    case 25:
      return `f\xFCnf vor halb ${r10}`;
    case 30:
      return `halb ${r10}`;
    case 35:
      return `f\xFCnf nach halb ${r10}`;
    case 40:
      return `zwanzig vor ${r10}`;
    case 45:
      return `Viertel vor ${r10}`;
    case 50:
      return `zehn vor ${r10}`;
    case 55:
      return `f\xFCnf vor ${r10}`;
  }
  return t10 < 30 ? t10 === 1 ? `eine Minute nach ${n10}` : `${t10} Minuten nach ${n10}` : 60 - t10 == 1 ? `eine Minute vor ${r10}` : `${60 - t10} Minuten vor ${r10}`;
}
function vT(e10) {
  return e10 < 5 ? `in der Nacht` : e10 < 9 ? `am Morgen` : e10 < 12 ? `am Vormittag` : e10 < 14 ? `am Mittag` : e10 < 18 ? `am Nachmittag` : e10 < 22 ? `am Abend` : `in der Nacht`;
}
var q6 = [{ id: `hour`, label: `Volle Stunden`, sample: `7:00` }, { id: `half`, label: `Halbe Stunden`, sample: `7:30` }, { id: `quarter`, label: `Viertelstunden`, sample: `7:15` }, { id: `five`, label: `5 Minuten`, sample: `7:25` }, { id: `minute`, label: `Minutengenau`, sample: `7:23` }], J6 = { level: `half`, formats: [`read`, `draw`], layout: `mixed`, pages: 1, solutions: false }, Y6 = { hour: [0], half: [0, 30], quarter: [0, 15, 30, 45], five: Array.from({ length: 12 }, (e10, t10) => t10 * 5), minute: Array.from({ length: 60 }, (e10, t10) => t10) }, X6 = { hour: [60, 3], half: [30, 5], quarter: [15, 8], five: [5, 24], minute: [1, 150] }, Z6 = (e10) => String(e10).padStart(2, `0`), Q6 = (e10, t10) => `${e10}:${Z6(t10)}`;
function hDe(e10) {
  let t10 = Math.floor(e10 / 60), n10 = e10 % 60;
  return t10 ? n10 ? `${t10} Std. ${n10} Min.` : `${t10} Std.` : `${n10} Min.`;
}
function $6(e10, t10, n10, r10, i10) {
  e10.circle(t10, n10, r10, `#ffffff`, GB, 4);
  for (let i11 = 0; i11 < 60; i11++) {
    let a10 = i11 * 6 * Math.PI / 180, o10 = i11 % 5 == 0, s10 = r10 - (o10 ? r10 * 0.15 : r10 * 0.07), c10 = r10 - 5;
    e10.line(t10 + Math.sin(a10) * s10, n10 - Math.cos(a10) * s10, t10 + Math.sin(a10) * c10, n10 - Math.cos(a10) * c10, GB, o10 ? 3 : 1.2);
  }
  for (let i11 = 1; i11 <= 12; i11++) {
    let a10 = i11 * 30 * Math.PI / 180, o10 = r10 * 0.68;
    e10.label(t10 + Math.sin(a10) * o10, n10 - Math.cos(a10) * o10 + r10 * 0.075, String(i11), Math.round(r10 * 0.21), GB);
  }
  if (i10) {
    let [a10, o10] = i10, s10 = (a10 % 12 * 30 + o10 * 0.5) * Math.PI / 180, c10 = o10 * 6 * Math.PI / 180;
    e10.line(t10, n10, t10 + Math.sin(s10) * r10 * 0.5, n10 - Math.cos(s10) * r10 * 0.5, GB, 8), e10.line(t10, n10, t10 + Math.sin(c10) * r10 * 0.8, n10 - Math.cos(c10) * r10 * 0.8, qB, 4.5);
  }
  e10.circle(t10, n10, 6, GB);
}
var e82 = 30, t8 = 52, n8 = 58;
function r8(e10, t10, n10, r10, i10, a10, o10) {
  return rV(e10, t10, n10, r10, i10, n8, t8, String(a10), e82), e10.num(n10 + n8, r10 + i10 + (t8 - XB(e82)) / 2, 22, `:`, e82), rV(e10, t10, n10 + n8 + 22, r10, i10, n8, t8, Z6(o10), e82), 138;
}
var i8 = 84, a8 = 230;
function o8(e10) {
  return (t10, n10, r10) => {
    let i10 = nV(a8, 24, 5), a10 = e10 ? 36 : 0, o10 = new eV(70, VB, a10 + 168 + 16 + t8 + 2);
    for (let s10 = 0; s10 < i10.n; s10++) {
      let c10 = i10.x(s10), [l10, u10] = tV(t10, () => e10 ? [IB(0.65) ? K(13, 22) : PB([K(0, 4), K(5, 12), 23]), PB(Y6[t10.o.level])] : [K(1, 12), PB(Y6[t10.o.level])], (t11) => `${e10 ? `d` : `r`}${t11[0]}:${t11[1]}`);
      e10 && n10.text(c10, r10 + (a10 - XB(22)) / 2, a8, mT(vT(l10)), 22, { bold: true, color: KB, font: `nunito` }), $6(o10, c10 + a8 / 2, a10 + i8 + 4, i8, [l10, u10]), r8(n10, o10, c10 + 46, r10, a10 + 168 + 16, l10, u10);
    }
    n10.graphic(o10, r10, `Uhren`);
  };
}
function gDe(e10, t10, n10) {
  let r10 = nV(a8, 24, 5), i10 = new eV(70, VB, 220), a10 = new eV(70, VB, 220), o10 = e10.o.level === `hour` || e10.o.level === `half` || e10.o.level === `quarter`;
  for (let s10 = 0; s10 < r10.n; s10++) {
    let c10 = r10.x(s10), [l10, u10] = tV(e10, () => [K(1, 12), PB(Y6[e10.o.level])], (e11) => `z${e11[0]}:${e11[1]}`), d10 = o10 && IB(0.5), f10 = d10 ? 24 : 30;
    t10.text(c10, n10 + (44 - XB(f10)) / 2, a8, mT(d10 ? _T(l10, u10) : `${Q6(l10, u10)} Uhr`), f10, { bold: !d10 }), $6(i10, c10 + a8 / 2, 132, i8), $6(a10, c10 + a8 / 2, 132, i8, [l10, u10]);
  }
  t10.graphic(i10, n10, `Uhren`, a10);
}
var s8 = 70;
function _De(e10, t10, n10) {
  let r10 = nV(491, 80, 2), i10 = new eV(70, VB, s8);
  for (let a10 = 0; a10 < r10.n; a10++) {
    let o10 = r10.x(a10), [s10, c10] = tV(e10, () => [K(1, 12), PB(Y6[e10.o.level])], (e11) => `w${e11[0]}:${e11[1]}`);
    t10.text(o10, n10 + (s8 - XB(28)) / 2, 337, mT(_T(s10, c10)), 28, { align: `right` }), r8(t10, i10, o10 + 337 + 16, n10, 9, s10, c10);
  }
  t10.graphic(i10, n10, `Rechenk\xE4stchen`);
}
function vDe(e10, t10, n10) {
  let r10 = nV(595, 36, 2), i10 = new eV(70, VB, s8), [a10, o10] = X6[e10.o.level];
  for (let s10 = 0; s10 < r10.n; s10++) {
    let c10 = r10.x(s10), l10 = tV(e10, () => {
      let t11 = K(1, o10) * a10, n11 = K(6, 17), r11 = PB(Y6[e10.o.level]), i11 = n11 * 60 + r11 + t11;
      return i11 >= 1440 ? null : { a: Q6(n11, r11), b: Q6(Math.floor(i11 / 60), i11 % 60), d: t11 };
    }, (e11) => `s${e11.a}-${e11.b}`), u10 = n10 + (s8 - XB(26)) / 2;
    t10.text(c10, u10, 327, mT(`${l10.a} Uhr bis ${l10.b} Uhr`), 26, { align: `right` });
    let d10 = c10 + 327 + 12;
    rV(t10, i10, d10, n10, 9, n8, t8, String(Math.floor(l10.d / 60)), e82), t10.text(d10 + n8, n10 + (s8 - XB(24)) / 2, 70, `Std.`, 24, { align: `left` }), d10 += 128, rV(t10, i10, d10, n10, 9, n8, t8, String(l10.d % 60), e82), t10.text(d10 + n8, n10 + (s8 - XB(24)) / 2, 70, `Min.`, 24, { align: `left` });
  }
  t10.graphic(i10, n10, `Rechenk\xE4stchen`);
}
function yDe(e10, t10, n10) {
  let r10 = nV(562, 60, 2), i10 = new eV(70, VB, s8), [a10, o10] = X6[e10.o.level];
  for (let s10 = 0; s10 < r10.n; s10++) {
    let c10 = r10.x(s10), l10 = tV(e10, () => {
      let t11 = K(1, Math.min(o10, Math.floor(150 / a10))) * a10, n11 = K(6, 18) * 60 + PB(Y6[e10.o.level]), r11 = IB(0.65), i11 = r11 ? n11 + t11 : n11 - t11;
      return i11 < 0 || i11 >= 1440 ? null : { text: `${Q6(Math.floor(n11 / 60), n11 % 60)} Uhr ${r11 ? `+` : `\u2212`} ${hDe(t11)} =`, h: Math.floor(i11 / 60), m: i11 % 60 };
    }, (e11) => e11.text);
    t10.text(c10, n10 + (s8 - XB(28)) / 2, 410, mT(l10.text), 28, { align: `right` }), r8(t10, i10, c10 + 410 + 14, n10, 9, l10.h, l10.m);
  }
  t10.graphic(i10, n10, `Rechenk\xE4stchen`);
}
var c8 = [{ id: `read`, label: `Uhrzeit ablesen`, title: `Uhrzeiten ablesen`, sample: `Uhr \u2192 7:30`, instruction: () => `Wie sp\xE4t ist es? Schreibe die Uhrzeit auf.`, rowH: () => 240, row: o8(false) }, { id: `draw`, label: `Zeiger einzeichnen`, title: `Zeiger einzeichnen`, sample: `7:30 \u2192 Zeiger malen`, instruction: () => `Zeichne die Zeiger ein: den kleinen f\xFCr die Stunden, den gro\xDFen f\xFCr die Minuten.`, rowH: () => 222, row: gDe }, { id: `words`, label: `Uhrzeit in Worten`, title: `Uhrzeiten in Worten`, sample: `Viertel nach drei \u2192 3:15`, instruction: () => `Schreibe die Uhrzeit mit Ziffern.`, rowH: () => s8, row: _De, mixRows: 2 }, { id: `day`, label: `Tageszeit (24 Stunden)`, title: `Uhrzeiten mit 24 Stunden`, sample: `am Nachmittag \u2192 15:30`, instruction: () => `Achte auf die Tageszeit: Schreibe die Uhrzeit mit 24 Stunden.`, rowH: () => 276, row: o8(true) }, { id: `span`, label: `Zeitspannen`, title: `Zeitspannen`, sample: `8:15 bis 9:00 \u2192 45 Min.`, instruction: () => `Wie lange dauert es?`, rowH: () => s8, row: vDe, mixRows: 2 }, { id: `later`, label: `Fr\xFCher und sp\xE4ter`, title: `Fr\xFCher und sp\xE4ter`, sample: `7:20 + 25 Min. \u2192 7:45`, instruction: () => `Wie sp\xE4t ist es dann?`, rowH: () => s8, row: yDe, mixRows: 2 }], l8 = (e10) => c8.find((t10) => t10.id === e10);
function u8(e10, t10) {
  return bV(e10.formats.map(l8).filter((e11) => !!e11), e10, () => ({ o: e10, seen: /* @__PURE__ */ new Set() }), (e11) => e11 ? e11.title : `Uhrzeiten`, `clock`, t10);
}
function bDe() {
  return u8({ ...J6, formats: [`read`, `words`, `draw`] })[0];
}

export const CLOCK_LEVELS = q6;
export const CLOCK_DEFAULTS = J6;
export const CLOCK_FORMATS = c8;
export const findClockFormat = l8;
export const makeClockPages = u8;


// ---- Rechnen mit Geld ----
// Pictures of coins and notes: `asset` is the picture's path (ARASAAC, in the app).
const xk = (e) => ({ id: YO('im'), type: 'image', fit: 'contain', ...e, src: e.asset, rot: e.rot ?? 0 });
var SV = { formats: [`count`, `change`], money: `both`, amounts: `mixed`, notation: `comma`, max: 20, pics: `arasaac`, layout: `mixed`, pages: 1, solutions: false }, Rve = `#15803d`, CV = [1, 2, 5, 10, 20, 50], wV = [100, 200], zve = [500, 1e3, 2e3, 5e3, 1e4, 2e4], Bve = (e10) => String(e10).padStart(2, `0`), TV = (e10) => e10.amounts === `cent` ? 99 : e10.max * 100;
function EV(e10) {
  if (e10.amounts === `cent`) return CV;
  let t10 = [];
  return e10.money !== `notes` && t10.push(...e10.amounts === `euro` ? wV : [...CV, ...wV]), e10.money !== `coins` && t10.push(...zve), t10.filter((t11) => t11 <= TV(e10));
}
var DV = (e10) => e10.amounts === `cent` ? 1 : e10.money === `notes` ? 500 : e10.amounts === `euro` ? 100 : 1;
function OV(e10, t10) {
  let n10 = Math.floor(e10 / 100), r10 = e10 % 100;
  return t10.amounts === `cent` ? `${e10} ct` : t10.amounts === `euro` || t10.money === `notes` ? `${n10} \u20AC` : t10.notation === `comma` ? `${n10},${Bve(r10)} \u20AC` : n10 ? r10 ? `${n10} \u20AC ${r10} ct` : `${n10} \u20AC` : `${r10} ct`;
}
function kV(e10, t10, n10) {
  let r10 = DV(e10), i10 = Math.max(r10, Math.ceil(t10 / r10) * r10), a10 = Math.floor(n10 / r10) * r10, o10 = K(i10 / r10, Math.max(i10 / r10, a10 / r10)) * r10;
  return e10.amounts === `mixed` && e10.money !== `notes` && IB(0.6) ? Math.max(r10, Math.round(o10 / 5) * 5) : o10;
}
function AV(e10, t10) {
  let n10 = [], r10 = [...t10].sort((e11, t11) => t11 - e11);
  for (let t11 of r10) for (; e10 >= t11; ) n10.push(t11), e10 -= t11;
  return e10 === 0 ? n10 : [];
}
var jV = { 1: 4775, 2: 4777, 5: 4779, 10: 4781, 20: 4783, 50: 4785, 100: 4776, 200: 10279, 500: 4780, 1e3: 4782, 2e3: 4784, 5e3: 4786, 1e4: 4787, 2e4: 4788 }, MV = (e10) => e10 < 100 ? `${e10} Cent` : e10 < 500 ? `${e10 / 100} Euro` : `${e10 / 100}-Euro-Schein`;
function Vve(e10) {
  return e10.pics === `arasaac` ? EV(e10).map((e11) => ({ value: e11, id: jV[e11], word: MV(e11), crop: true, size: 320 })) : [];
}
var NV = { 1: 22, 2: 25.5, 5: 28.5, 10: 26.5, 20: 30, 50: 32.5, 100: 31, 200: 34.5 }, PV = { 500: [120, 62, `#8f99a5`, `#e5e8ec`], 1e3: [125, 65, `#e0645c`, `#fbdcd9`], 2e3: [130, 68, `#4f7fd1`, `#dbe6fa`], 5e3: [135, 70, `#f0943c`, `#fde6cf`], 1e4: [140, 73, `#4da56f`, `#d6efdf`], 2e4: [146, 73, `#d6ad2e`, `#f8eec8`] }, FV = (e10) => e10 >= 500 ? [PV[e10][0], PV[e10][1]] : [2 * NV[e10], 2 * NV[e10]];
function Hve(e10, t10, n10, r10) {
  if (t10 >= 500) {
    let [i11, a11, o11, s10] = PV[t10];
    e10.rect(n10, r10, i11, a11, s10, o11, 2.5, 6), e10.rect(n10 + 6, r10 + 6, i11 - 12, a11 - 12, `none`, o11, 1.2, 4), e10.circle(n10 + i11 - 20, r10 + a11 / 2, 10, o11), e10.label(n10 + i11 / 2 - 10, r10 + a11 / 2 + 9, `${t10 / 100} \u20AC`, 22, o11);
    return;
  }
  let i10 = NV[t10], a10 = n10 + i10, o10 = r10 + i10;
  if (t10 === 100 || t10 === 200) {
    let [n11, r11] = t10 === 100 ? [`#e0b42c`, `#cfd4da`] : [`#cfd4da`, `#e0b42c`];
    e10.circle(a10, o10, i10, n11, `#8a6d1c`, 1.5), e10.circle(a10, o10, i10 * 0.68, r11, `#8a8f96`, 1), e10.label(a10, o10 + i10 * 0.24, `${t10 / 100} \u20AC`, Math.round(i10 * 0.62), GB);
  } else {
    let n11 = t10 < 10;
    e10.circle(a10, o10, i10, n11 ? `#c97a3d` : `#e0b42c`, n11 ? `#8a4a1c` : `#8a6d1c`, 1.5), e10.circle(a10, o10, i10 * 0.82, `none`, n11 ? `#a35e2a` : `#b8901f`, 1), e10.label(a10, o10 + i10 * 0.22, `${t10} ct`, Math.round(i10 * 0.55), GB);
  }
}
function IV(e10, t10, n10, r10) {
  let i10 = [], a10 = [], o10 = t10, s10 = n10, c10 = 0, l10 = () => {
    for (let e11 of a10) e11.y += (c10 - e11.h) / 2;
    a10 = [];
  };
  for (let n11 of e10) {
    let [e11, u10] = FV(n11);
    o10 + e11 > t10 + r10 && o10 > t10 && (l10(), o10 = t10, s10 += c10 + 6, c10 = 0);
    let d10 = { x: o10, y: s10, w: e11, h: u10 };
    i10.push(d10), a10.push(d10), o10 += e11 + 6, c10 = Math.max(c10, u10);
  }
  return l10(), i10;
}
var LV = (e10) => Math.round(e10 * 10) / 10;
function RV(e10, t10, n10, r10, i10, a10) {
  i10.forEach((i11, o10) => {
    let s10 = a10[o10], c10 = e10.pics?.get(i11);
    if (c10) t10.items.push(xk({ x: LV(s10.x), y: LV(r10 + s10.y), w: s10.w, h: s10.h, asset: c10.id, fit: `contain`, alt: MV(i11), locked: true }));
    else for (let e11 of n10) Hve(e11, i11, s10.x, s10.y);
  });
}
function zV(e10, t10, n10, r10, i10, a10, o10, s10) {
  let c10 = IV(i10, a10, o10, s10);
  return RV(e10, t10, n10, r10, i10, c10), c10;
}
function BV(e10, t10) {
  return Math.max(0, ...IV(e10, 0, 0, t10).map((e11) => e11.y + e11.h));
}
function VV(e10, t10, n10, r10, i10) {
  let a10 = EV(e10.o);
  for (let o10 = 0; o10 < 400; o10++) {
    let o11 = K(2, e10.o.amounts === `cent` ? 6 : 7), s10 = Array.from({ length: o11 }, () => PB(a10)).sort((e11, t11) => t11 - e11), c10 = s10.reduce((e11, t11) => e11 + t11, 0);
    if (c10 >= t10 && c10 <= n10 && BV(s10, r10) <= i10) return s10;
  }
  return AV(kV(e10.o, t10, n10), a10);
}
var HV = 590, UV = 400, WV = 170;
function Uve(e10, t10, n10) {
  let r10 = e10.o, i10 = new eV(70, VB, WV), a10 = nV(HV, 60, 2);
  for (let o10 = 0; o10 < a10.n; o10++) {
    let s10 = a10.x(o10), c10 = tV(e10, () => VV(e10, DV(r10), TV(r10), UV, 148), (e11) => `c${e11.join(`,`)}`), l10 = c10.reduce((e11, t11) => e11 + t11, 0);
    i10.rect(s10, 0, 420, 164, `#f8fafc`, `#dbe4f0`, 2, 12);
    let u10 = BV(c10, UV);
    zV(e10, t10, [i10], n10, c10, s10 + 10, Math.max(8, (164 - u10) / 2), UV);
    let d10 = ZB(OV(TV(r10), r10).length, 26);
    rV(t10, i10, s10 + HV - d10, n10, 57, d10, 56, OV(l10, r10), 26);
  }
  t10.graphic(i10, n10, `Geld`);
}
var GV = 160;
function Wve(e10, t10, n10) {
  let r10 = e10.o, i10 = new eV(70, VB, GV), a10 = new eV(70, VB, GV), o10 = nV(HV, 60, 2), s10 = EV(r10);
  for (let c10 = 0; c10 < o10.n; c10++) {
    let l10 = o10.x(c10), u10 = ZB(OV(TV(r10), r10).length, 26) + 20, d10 = tV(e10, () => {
      let e11 = kV(r10, DV(r10) * 2, Math.min(TV(r10), r10.amounts === `cent` ? 99 : TV(r10) * 0.6)), t11 = AV(e11, s10);
      if (!t11.length || t11.length > 6) return null;
      let n11 = Array.from({ length: K(2, 3) }, () => PB(s10)), i11 = LB([...t11.map((e12, t12) => ({ v: e12, need: true, i: t12 })), ...n11.map((e12, t12) => ({ v: e12, need: false, i: 100 + t12 }))]).sort((e12, t12) => t12.v - e12.v);
      return BV(i11.map((e12) => e12.v), HV - u10 - 16) > 150 ? null : { target: e11, need: t11, all: i11 };
    }, (e11) => `p${e11.target}`);
    for (let e11 of [i10, a10]) e11.rect(l10, 4, u10, 52, `#fff9db`, `#f08c00`, 2.5, 10);
    t10.num(l10, n10 + 4 + (52 - XB(26)) / 2, u10, OV(d10.target, r10), 26);
    let f10 = zV(e10, t10, [i10, a10], n10, d10.all.map((e11) => e11.v), l10 + u10 + 16, 4, HV - u10 - 16);
    d10.all.forEach((e11, t11) => {
      if (!e11.need) return;
      let n11 = f10[t11];
      a10.rect(n11.x - 4, n11.y - 4, n11.w + 8, n11.h + 8, `none`, Rve, 3, n11.w === n11.h ? n11.w / 2 + 4 : 8);
    });
  }
  t10.graphic(i10, n10, `Geld legen`, a10);
}
var KV = 96;
function Gve(e10, t10, n10) {
  let r10 = e10.o, i10 = new eV(70, VB, KV), a10 = nV(HV, 60, 2), o10 = EV(r10).filter((e11) => e11 >= (r10.amounts === `cent` ? 10 : 100));
  for (let s10 = 0; s10 < a10.n; s10++) {
    let c10 = a10.x(s10), l10 = tV(e10, () => {
      let e11 = r10.amounts === `cent` ? 100 : PB(o10.filter((e12) => e12 > DV(r10) * 2));
      if (!e11) return null;
      let t11 = kV(r10, Math.max(DV(r10), e11 * 0.2), e11 - DV(r10));
      return t11 > 0 && t11 < e11 ? { paid: e11, price: t11 } : null;
    }, (e11) => `ch${e11.paid},${e11.price}`), u10 = ZB(OV(TV(r10), r10).length, 24) + 30;
    i10.poly([[c10, 20], [c10 + u10 - 18, 20], [c10 + u10, 46], [c10 + u10 - 18, 72], [c10, 72]], `#fff9db`, `#f08c00`, 2.5), t10.num(c10, n10 + 46 - XB(24) / 2, u10 - 14, OV(l10.price, r10), 24), t10.text(c10 + u10 + 4, n10 + 46 - XB(18) / 2, 92, `bezahlt:`, 18, { align: `center`, color: `#475569` });
    let d10 = l10.paid, [f10, p10] = FV(d10);
    RV(e10, t10, [i10], n10, [d10], [{ x: c10 + u10 + 98, y: 46 - p10 / 2, w: f10, h: p10 }]);
    let m10 = ZB(OV(TV(r10), r10).length, 24);
    t10.text(c10 + HV - m10 - 92, n10 + 46 - XB(18) / 2, 88, `zur\xFCck:`, 18, { align: `right`, color: `#475569` }), rV(t10, i10, c10 + HV - m10, n10, 20, m10, 52, OV(l10.paid - l10.price, r10), 24);
  }
  t10.graphic(i10, n10, `Wechselgeld`);
}
var Kve = [`Brot`, `Milch`, `\xC4pfel`, `Butter`, `K\xE4se`, `Eier`, `Saft`, `Nudeln`, `Bananen`, `Joghurt`, `M\xFCsli`, `Tomaten`, `Honig`, `Kekse`, `Wasser`, `Reis`, `M\xF6hren`, `Gurke`], qV = 380, JV = 36;
function YV() {
  return 254;
}
function qve(e10, t10, n10) {
  let r10 = e10.o, i10 = YV(), a10 = new eV(70, VB, i10), o10 = nV(qV, 40, 3);
  for (let s10 = 0; s10 < o10.n; s10++) {
    let c10 = o10.x(s10), l10 = K(3, 4), u10 = tV(e10, () => {
      let e11 = LB([...Kve]).slice(0, l10), t11 = TV(r10), n11 = Math.max(DV(r10), Math.floor(t11 / (l10 + 1))), i11 = e11.map(() => kV(r10, DV(r10), n11)), a11 = i11.reduce((e12, t12) => e12 + t12, 0);
      return a11 <= t11 ? { names: e11, prices: i11, sum: a11 } : null;
    }, (e11) => `l${e11.names.join(`,`)}${e11.prices.join(`,`)}`);
    a10.rect(c10, 0, qV, i10 - 4, `#fffef5`, `#d9c58a`, 2, 6);
    for (let e11 = 1; e11 <= 4; e11++) a10.line(c10 + 14, 44 + e11 * JV, c10 + qV - 14, 44 + e11 * JV, `#e9dfb9`, 1.5);
    t10.text(c10 + 14, n10 + 8, 352, `Einkaufszettel`, 22, { align: `left`, bold: true, color: `#8a6d1c` }), u10.names.forEach((e11, i11) => {
      let a11 = n10 + 44 + (i11 + 1) * JV - XB(22) + 6;
      t10.text(c10 + 14, a11, qV / 2, mT(e11), 22, { align: `left` }), t10.text(c10 + qV / 2, a11, qV / 2 - 14, mT(OV(u10.prices[i11], r10)), 22, { align: `right` });
    });
    let d10 = ZB(OV(TV(r10), r10).length, 24);
    t10.text(c10 + 14, n10 + i10 - 4 - 56 + (52 - XB(22)) / 2, qV - d10 - 40, `Zusammen:`, 22, { align: `left`, bold: true }), rV(t10, a10, c10 + qV - d10 - 12, n10, i10 - 4 - 56, d10, 50, OV(u10.sum, r10), 24);
  }
  t10.graphic(a10, n10, `Einkaufszettel`);
}
var XV = 74;
function Jve(e10, t10, n10) {
  let r10 = e10.o, i10 = new eV(70, VB, XV), a10 = nV(HV, 60, 2);
  for (let o10 = 0; o10 < a10.n; o10++) {
    let s10 = a10.x(o10), c10 = tV(e10, () => kV(r10, 101, TV(r10)), (e11) => `cv${e11}`), l10 = IB(0.5), u10 = l10 ? OV(c10, r10) : `${c10} ct`, d10 = l10 ? `${c10} ct` : OV(c10, r10), f10 = ZB(Math.max(u10.length, 8), 28);
    t10.num(s10, n10 + (XV - XB(28)) / 2, f10, u10, 28, `right`), t10.num(s10 + f10, n10 + (XV - XB(28)) / 2, 40, `=`, 28), rV(t10, i10, s10 + f10 + 44, n10, 11, ZB(Math.max(d10.length, 6), 28), 52, d10, 28);
  }
  t10.graphic(i10, n10, `Rechenk\xE4stchen`);
}
var ZV = 170;
function Yve(e10, t10, n10) {
  let r10 = e10.o, i10 = new eV(70, VB, ZV), a10 = (VB - 80) / 2, o10 = VV(e10, DV(r10), TV(r10), a10 - 20, 148), s10 = IB(0.25) ? AV(o10.reduce((e11, t11) => e11 + t11, 0), EV(r10).filter((e11) => e11 < Math.max(...o10))) : [], c10 = s10.length && BV(s10, a10 - 20) <= 148 ? s10 : VV(e10, DV(r10), TV(r10), a10 - 20, 148), l10 = o10.reduce((e11, t11) => e11 + t11, 0), u10 = c10.reduce((e11, t11) => e11 + t11, 0);
  for (let [r11, s11] of [[o10, 70], [c10, 70 + a10 + 80]]) i10.rect(s11, 0, a10, 164, `#f8fafc`, `#dbe4f0`, 2, 12), zV(e10, t10, [i10], n10, r11, s11 + 10, Math.max(8, (164 - BV(r11, a10 - 20)) / 2), a10 - 20);
  rV(t10, i10, 70 + a10 + 12, n10, 57, 56, 56, l10 > u10 ? `>` : l10 < u10 ? `<` : `=`, 30), t10.graphic(i10, n10, `Geld vergleichen`);
}
function Xve(e10, t10, n10) {
  let r10 = e10.o, i10 = new eV(70, VB, XV), a10 = nV(HV, 60, 2);
  for (let o10 = 0; o10 < a10.n; o10++) {
    let s10 = a10.x(o10), c10 = IB(0.55), l10 = tV(e10, () => {
      let e11 = kV(r10, DV(r10), TV(r10) - DV(r10)), t11 = kV(r10, DV(r10), c10 ? TV(r10) - e11 : e11 - DV(r10));
      return t11 <= 0 || (c10 ? e11 + t11 > TV(r10) : t11 >= e11) ? null : { a: e11, b: t11, r: c10 ? e11 + t11 : e11 - t11 };
    }, (e11) => `k${c10 ? `+` : `-`}${e11.a},${e11.b}`), u10 = ZB(OV(TV(r10), r10).length, 28), d10 = n10 + (XV - XB(28)) / 2;
    t10.num(s10, d10, u10, OV(l10.a, r10), 28, `right`), t10.num(s10 + u10, d10, 34, c10 ? `+` : `\u2212`, 28), t10.num(s10 + u10 + 34, d10, u10, OV(l10.b, r10), 28, `right`), t10.num(s10 + 2 * u10 + 34, d10, 34, `=`, 28), rV(t10, i10, s10 + 2 * u10 + 68, n10, 11, u10, 52, OV(l10.r, r10), 28);
  }
  t10.graphic(i10, n10, `Rechenk\xE4stchen`);
}
var QV = [{ id: `count`, label: `Betr\xE4ge bestimmen`, title: `Wie viel Geld ist es?`, sample: `M\xFCnzen \u2192 3,50 \u20AC`, instruction: () => `Wie viel Geld ist es? Schreibe den Betrag auf.`, rowH: () => WV, row: Uve }, { id: `pay`, label: `Geld legen`, title: `Geld legen`, sample: `2,70 \u20AC \u2192 einkreisen`, instruction: () => `Kreise so viel Geld ein, wie auf dem Schild steht.`, rowH: () => GV, row: Wve }, { id: `change`, label: `Wechselgeld`, title: `Wechselgeld`, sample: `3,20 \u20AC mit 5 \u20AC bezahlt`, instruction: () => `Wie viel Geld bekommst du zur\xFCck?`, rowH: () => KV, row: Gve, mixRows: 2 }, { id: `list`, label: `Einkaufszettel`, title: `Einkaufszettel`, sample: `Brot + Milch + \u2026 = \u25A2`, instruction: () => `Rechne aus, wie viel der Einkauf zusammen kostet.`, rowH: () => YV(), row: qve }, { id: `convert`, label: `Euro und Cent umrechnen`, title: `Euro und Cent`, sample: `3,50 \u20AC = \u25A2 ct`, available: (e10) => e10.amounts === `mixed` && e10.money !== `notes`, hint: `nur bei Euro und Cent`, instruction: () => `Rechne um: 1 \u20AC = 100 ct.`, rowH: () => XV, row: Jve, mixRows: 2 }, { id: `compare`, label: `Vergleichen`, title: `Wer hat mehr Geld?`, sample: `Geld \u25A2 Geld  (<, >, =)`, instruction: () => `Wo ist mehr Geld? Setze <, > oder = ein.`, rowH: () => ZV, row: Yve }, { id: `calc`, label: `Rechnen mit Geld`, title: `Rechnen mit Geld`, sample: `3,50 \u20AC + 1,20 \u20AC = \u25A2`, instruction: () => `Rechne mit den Geldbetr\xE4gen.`, rowH: () => XV, row: Xve, mixRows: 2 }], $V = (e10) => QV.find((t10) => t10.id === e10);
function eH(e10, t10, n10) {
  let r10 = e10.formats.map($V).filter((t11) => !!t11 && (!t11.available || t11.available(e10))), i10 = e10.amounts === `cent` ? `bis 1 \u20AC` : `bis ${e10.max} \u20AC`, a10 = e10.pics === `arasaac` ? n10 : void 0;
  return bV(r10, e10, () => ({ o: e10, seen: /* @__PURE__ */ new Set(), pics: a10 }), (e11) => `${e11 ? e11.title : `Rechnen mit Geld`} ${i10}`, `money`, t10);
}
function Zve() {
  return eH({ ...SV, pics: `own`, formats: [`count`, `change`, `calc`] })[0];
}

export const MONEY_DEFAULTS = SV;
export const MONEY_FORMATS = QV;
export const findMoneyFormat = $V;
export const moneyValues = EV;
export const makeMoneyPages = eH;


// ---- Labyrinth ----
var K8 = [{ label: `Sehr leicht`, cols: 6, rows: 5, rings: 3 }, { label: `Leicht`, cols: 9, rows: 7, rings: 5 }, { label: `Mittel`, cols: 13, rows: 10, rings: 7 }, { label: `Schwer`, cols: 18, rows: 14, rings: 10 }, { label: `Knifflig`, cols: 25, rows: 20, rings: 13 }], pOe = { shape: `square`, level: 1, cats: 2, layout: `mixed`, pages: 1, solutions: false }, mOe = (e10, t10) => {
  let n10 = K8[t10];
  return e10 === `round` ? `${n10.rings} Ringe` : `${n10.cols} \xD7 ${n10.rows} Felder`;
}, hOe = `#2b3a55`, q8 = `#334155`, gOe = `#16a34a`, J8 = { x: 70, y: 166, w: 1260, h: 792 }, Y8 = 118, X8 = (e10) => Math.round(e10 * 10) / 10, Z8 = (e10, t10) => e10 < t10 ? e10 * 65536 + t10 : t10 * 65536 + e10, Q8 = (e10, t10, n10) => e10.open.has(Z8(t10, n10));
function _Oe(e10, t10) {
  let n10 = new Uint8Array(e10.n), r10 = [t10];
  for (n10[t10] = 1; r10.length; ) {
    let t11 = r10[r10.length - 1], i10 = e10.nb[t11].filter((e11) => !n10[e11]);
    if (!i10.length) {
      r10.pop();
      continue;
    }
    let a10 = PB(i10);
    e10.open.add(Z8(t11, a10)), n10[a10] = 1, r10.push(a10);
  }
}
function $8(e10, t10, n10, r10) {
  let i10 = new Int32Array(e10.n).fill(-1);
  i10[t10] = t10;
  let a10 = [t10];
  for (let t11 = 0; t11 < a10.length && i10[n10] < 0; t11++) {
    let n11 = a10[t11];
    for (let t12 of e10.nb[n11]) i10[t12] < 0 && !r10.has(t12) && Q8(e10, n11, t12) && (i10[t12] = n11, a10.push(t12));
  }
  if (i10[n10] < 0) return null;
  let o10 = [n10];
  for (let e11 = n10; e11 !== t10; ) e11 = i10[e11], o10.push(e11);
  return o10.reverse();
}
function vOe(e10, t10, n10, r10, i10) {
  let a10 = /* @__PURE__ */ new Set(), o10 = (t11) => [...a10].some((n11) => n11 === t11 || e10.nb[n11].includes(t11)), s10 = (r11) => {
    for (let i11 of LB(r11)) {
      if (a10.add(i11), $8(e10, t10, n10, a10)) return true;
      a10.delete(i11);
    }
    return false;
  };
  for (let c10 = 0; c10 < r10; c10++) {
    let r11 = false;
    for (let c11 = 0; c11 < 40 && !r11; c11++) {
      let c12 = $8(e10, t10, n10, a10);
      if (!c12 || (r11 = s10(c12.slice(2, -2).filter((e11) => !o10(e11))) || s10(c12.slice(1, -1).filter((e11) => !a10.has(e11))), !r11 && !i10(c12))) break;
    }
    if (!r11) {
      let r12 = new Set($8(e10, t10, n10, a10) ?? []), i11 = Array.from({ length: e10.n }, (e11, t11) => t11).filter((i12) => !r12.has(i12) && !o10(i12) && i12 !== t10 && i12 !== n10 && !e10.nb[t10].includes(i12) && !e10.nb[n10].includes(i12));
      i11.length && a10.add(PB(i11));
    }
  }
  return [...a10];
}
var yOe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80"><path d="M18 54C6 55 3 66 9 72c5 4 12 2 14 6" fill="none" stroke="${q8}" stroke-width="3" stroke-linecap="round"/><ellipse cx="36" cy="69" rx="7" ry="4" fill="#f4a6c0" stroke="${q8}" stroke-width="2.5"/><ellipse cx="61" cy="68" rx="7" ry="4" fill="#f4a6c0" stroke="${q8}" stroke-width="2.5"/><path d="M16 54c0-20 18-30 36-30 14 0 22 6 28 14l15 9c3 2 2 6-2 7l-13 3c-8 9-20 13-34 13-18 0-30-4-30-16z" fill="#c9cfd8" stroke="${q8}" stroke-width="3" stroke-linejoin="round"/><circle cx="63" cy="24" r="11" fill="#c9cfd8" stroke="${q8}" stroke-width="3"/><circle cx="63" cy="24" r="6" fill="#f4a6c0"/><circle cx="77" cy="40" r="3.4" fill="${q8}"/><circle cx="78" cy="39" r="1.1" fill="#fff"/><circle cx="95" cy="50" r="3.6" fill="#f06595"/><path d="M86 52l13-5M86 54l14 2M85 56l12 6" stroke="${q8}" stroke-width="1.6" stroke-linecap="round"/></svg>`, bOe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80"><path d="M6 46L84 14l10 32z" fill="#ffe066" stroke="${q8}" stroke-width="3" stroke-linejoin="round"/><path d="M6 46h88v26H6z" fill="#fcc419" stroke="${q8}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="27" cy="60" rx="6" ry="5" fill="#f59f00"/><ellipse cx="60" cy="56" rx="4.5" ry="4" fill="#f59f00"/><ellipse cx="79" cy="64" rx="5" ry="4" fill="#f59f00"/><ellipse cx="57" cy="34" rx="5" ry="3" fill="#fab005"/><ellipse cx="76" cy="26" rx="3.5" ry="2.2" fill="#fab005"/></svg>`, xOe = [{ fur: `#ffa94d`, light: `#ffe8cc`, stripes: `#e8590c`, eyes: `#c0eb75` }, { fur: `#adb5bd`, light: `#f1f3f5`, stripes: `#6c757d`, eyes: `#c0eb75` }, { fur: `#495057`, light: `#dee2e6`, eyes: `#ffd43b` }, { fur: `#c08552`, light: `#f3d9c4`, stripes: `#8d5524`, eyes: `#c0eb75` }];
function SOe(e10) {
  let t10 = `stroke="${q8}" stroke-width="3" stroke-linejoin="round"`, n10 = e10.stripes ? `<path d="M44 22l2 8M50 20v10M56 22l-2 8M27 72l9 2M26 80l9 0M73 72l-9 2M74 80l-9 0" stroke="${e10.stripes}" stroke-width="3" stroke-linecap="round"/>` : ``, r10 = (t11) => `<ellipse cx="${t11}" cy="40" rx="6" ry="6.5" fill="${e10.eyes}" stroke="${q8}" stroke-width="2"/><ellipse cx="${t11}" cy="40" rx="1.8" ry="5" fill="${q8}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M68 88c22 2 28-18 18-30" fill="none" stroke="${q8}" stroke-width="11" stroke-linecap="round"/><path d="M68 88c22 2 28-18 18-30" fill="none" stroke="${e10.fur}" stroke-width="5" stroke-linecap="round"/><path d="M26 94c-6-20 4-36 24-36s30 16 24 36z" fill="${e10.fur}" ${t10}/><path d="M40 94c-2-14 2-24 10-24s12 10 10 24z" fill="${e10.light}"/><ellipse cx="41" cy="93" rx="8" ry="5" fill="${e10.light}" stroke="${q8}" stroke-width="2.5"/><ellipse cx="59" cy="93" rx="8" ry="5" fill="${e10.light}" stroke="${q8}" stroke-width="2.5"/><path d="M24 44c0-12 2-22 4-38l16 13c4-1 8-1 12 0L72 6c2 16 4 26 4 38 0 14-12 22-26 22S24 58 24 44z" fill="${e10.fur}" ${t10}/><path d="M31 13l10 8-9 4zM69 13l-10 8 9 4z" fill="#f4a6c0"/>` + n10 + `<ellipse cx="50" cy="53" rx="11" ry="8" fill="${e10.light}"/>` + r10(39) + r10(61) + `<path d="M46 48h8l-4 5z" fill="#f06595"/><path d="M50 53q-3 5-7 3M50 53q3 5 7 3" fill="none" stroke="${q8}" stroke-width="2" stroke-linecap="round"/><path d="M38 52l-20-4M38 55l-20 2M62 52l20-4M62 55l20 2" stroke="${q8}" stroke-width="1.6" stroke-linecap="round"/></svg>`;
}
var e52 = (e10, t10, n10, r10) => `A${X8(e10)} ${X8(e10)} 0 0 ${r10} ${X8(t10)} ${X8(n10)}`;
function COe(e10, t10) {
  let { cols: n10, rows: r10 } = K8[e10], i10 = Math.min((J8.w - 264) / n10, J8.h / r10), a10 = n10 * i10, o10 = r10 * i10, s10 = J8.x + (J8.w - a10) / 2, c10 = J8.y + (J8.h - o10) / 2, l10 = (e11, t11) => t11 * n10 + e11, u10 = { n: n10 * r10, nb: [], open: /* @__PURE__ */ new Set() };
  for (let e11 = 0; e11 < r10; e11++) for (let t11 = 0; t11 < n10; t11++) {
    let i11 = [];
    t11 > 0 && i11.push(l10(t11 - 1, e11)), t11 < n10 - 1 && i11.push(l10(t11 + 1, e11)), e11 > 0 && i11.push(l10(t11, e11 - 1)), e11 < r10 - 1 && i11.push(l10(t11, e11 + 1)), u10.nb.push(i11);
  }
  let d10 = K(0, Math.floor((r10 - 1) / 2)), f10 = K(Math.ceil((r10 - 1) / 2), r10 - 1), p10 = l10(0, d10), m10 = l10(n10 - 1, f10);
  _Oe(u10, p10);
  let h10 = (e11, t11) => e11 >= 0 && t11 >= 0 && e11 < n10 - 1 && t11 < r10 - 1 && Q8(u10, l10(e11, t11), l10(e11 + 1, t11)) && Q8(u10, l10(e11, t11 + 1), l10(e11 + 1, t11 + 1)) && Q8(u10, l10(e11, t11), l10(e11, t11 + 1)) && Q8(u10, l10(e11 + 1, t11), l10(e11 + 1, t11 + 1)), g10 = (e11) => {
    for (let t11 = 0; t11 < 80; t11++) {
      let t12 = e11.length && Math.random() < 0.7 ? PB(e11) : K(0, u10.n - 1), r11 = PB(u10.nb[t12]);
      if (Q8(u10, t12, r11)) continue;
      u10.open.add(Z8(t12, r11));
      let i11 = Math.min(t12 % n10, r11 % n10), a11 = Math.min(Math.floor(t12 / n10), Math.floor(r11 / n10));
      if (h10(i11 - 1, a11 - 1) || h10(i11, a11 - 1) || h10(i11 - 1, a11) || h10(i11, a11)) u10.open.delete(Z8(t12, r11));
      else return true;
    }
    return false;
  };
  for (let e11 = 0; e11 < t10; e11++) g10([]);
  let _10 = vOe(u10, p10, m10, t10, g10), v10 = $8(u10, p10, m10, new Set(_10)) ?? [], y10 = FB(i10 * 0.085, 4, 11), b10 = y10, x10 = (e11) => X8(b10 + e11 * i10), S10 = (e11) => X8(b10 + e11 * i10), C10 = ``;
  for (let e11 = 0; e11 < r10; e11++) for (let t11 = 0; t11 < n10; t11++) t11 < n10 - 1 && !Q8(u10, l10(t11, e11), l10(t11 + 1, e11)) && (C10 += `M${x10(t11 + 1)} ${S10(e11)}V${S10(e11 + 1)}`), e11 < r10 - 1 && !Q8(u10, l10(t11, e11), l10(t11, e11 + 1)) && (C10 += `M${x10(t11)} ${S10(e11 + 1)}H${x10(t11 + 1)}`);
  C10 += `M${x10(0)} ${S10(0)}H${x10(n10)}V${S10(f10)}M${x10(n10)} ${S10(f10 + 1)}V${S10(r10)}H${x10(0)}V${S10(d10 + 1)}M${x10(0)} ${S10(d10)}V${S10(0)}`;
  let w10 = `<path d="${C10}" fill="none" stroke="${hOe}" stroke-width="${X8(y10)}" stroke-linecap="round" stroke-linejoin="round"/>`, T10 = v10.length ? `<path d="M${x10(0)} ${S10(d10 + 0.5)}L${v10.map((e11) => `${x10(e11 % n10 + 0.5)} ${S10(Math.floor(e11 / n10) + 0.5)}`).join(`L`)}L${x10(n10)} ${S10(f10 + 0.5)}" fill="none" stroke="${gOe}" stroke-width="${X8(FB(i10 * 0.24, 6, 28))}" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>` : ``, E10 = `<rect x="${x10(0)}" y="${S10(0)}" width="${X8(a10)}" height="${X8(o10)}" fill="#ffffff"/>`, D10 = Y8 * 0.8, O10 = FB(c10 + (d10 + 0.5) * i10 - D10 * 0.62, J8.y - 20, J8.y + J8.h - D10), ee2 = Y8 * 0.9, te2 = ee2 * 0.8, ne2 = FB(c10 + (f10 + 0.5) * i10 - te2 * 0.6, J8.y - 20, J8.y + J8.h - te2), re2 = i10 * 0.9;
  return { box: { x: s10 - b10, y: c10 - b10, w: a10 + 2 * b10, h: o10 + 2 * b10 }, draw: (e11) => E10 + (e11 ? T10 : ``) + w10, mouse: { x: s10 - 10 - Y8, y: O10, w: Y8, h: D10 }, cheese: { x: s10 + a10 + 12, y: ne2, w: ee2, h: te2 }, cats: _10.map((e11) => ({ x: s10 + (e11 % n10 + 0.5) * i10 - re2 / 2, y: c10 + (Math.floor(e11 / n10) + 0.5) * i10 - re2 / 2, w: re2, h: re2 })), alt: `Labyrinth mit ${n10} \xD7 ${r10} Feldern` };
}
function wOe(e10, t10) {
  let n10 = K8[e10].rings, r10 = J8.h / 2 - 6, i10 = J8.x + J8.w / 2, a10 = J8.y + J8.h / 2, o10 = r10 / (n10 + 1.3), s10 = 1.3 * o10;
  s10 < 60 && (s10 = 60, o10 = (r10 - s10) / n10);
  let c10 = (e11) => s10 + (e11 - 1) * o10, l10 = (e11) => e11 === 0 ? 0 : s10 + (e11 - 0.5) * o10, u10 = [1, Math.max(6, Math.round(2 * Math.PI * l10(1) / o10))];
  for (let e11 = 2; e11 <= n10; e11++) {
    let t11 = 2 * Math.PI * l10(e11) / u10[e11 - 1];
    u10.push(u10[e11 - 1] * (t11 > 1.7 * o10 ? 2 : 1));
  }
  let d10 = [0, 1];
  for (let e11 = 2; e11 <= n10; e11++) d10.push(d10[e11 - 1] + u10[e11 - 1]);
  let f10 = d10[n10] + u10[n10], p10 = (e11) => {
    let t11 = 0;
    for (; t11 < n10 && e11 >= d10[t11 + 1]; ) t11++;
    return t11;
  }, m10 = (e11, t11) => e11 === 0 ? 0 : d10[e11] + (t11 % u10[e11] + u10[e11]) % u10[e11], h10 = { n: f10, nb: Array.from({ length: f10 }, () => []), open: /* @__PURE__ */ new Set() }, g10 = (e11, t11) => {
    h10.nb[e11].push(t11), h10.nb[t11].push(e11);
  };
  for (let e11 = 1; e11 <= n10; e11++) for (let t11 = 0; t11 < u10[e11]; t11++) g10(m10(e11, t11), m10(e11, t11 + 1)), g10(m10(e11, t11), e11 === 1 ? 0 : m10(e11 - 1, Math.floor(t11 / (u10[e11] / u10[e11 - 1]))));
  let _10 = Math.PI - Math.PI / u10[n10], v10 = (e11, t11) => _10 + 2 * Math.PI * t11 / u10[e11], y10 = (e11) => {
    let t11 = p10(e11);
    return t11 === 0 ? 0 : v10(t11, e11 - d10[t11] + 0.5);
  }, b10 = m10(n10, 0);
  _Oe(h10, b10);
  let x10 = (e11) => {
    for (let t11 = 0; t11 < 80; t11++) {
      let t12 = e11.length && Math.random() < 0.7 ? PB(e11) : K(1, f10 - 1), n11 = PB(h10.nb[t12]);
      if (!(n11 === 0 || t12 === 0 || Q8(h10, t12, n11))) return h10.open.add(Z8(t12, n11)), true;
    }
    return false;
  };
  for (let e11 = 0; e11 < t10; e11++) x10([]);
  let S10 = vOe(h10, b10, 0, t10, x10), C10 = $8(h10, b10, 0, new Set(S10)) ?? [], w10 = FB(o10 * 0.085, 4, 10), T10 = r10 + w10, E10 = (e11, t11) => [T10 + e11 * Math.cos(t11), T10 + e11 * Math.sin(t11)], D10 = (e11, t11) => {
    let [n11, r11] = E10(e11, t11);
    return `${X8(n11)} ${X8(r11)}`;
  }, O10 = ``;
  for (let e11 = 1; e11 <= n10; e11++) for (let t11 = 0; t11 < u10[e11]; t11++) {
    let i11 = m10(e11, t11), a11 = v10(e11, t11), s11 = v10(e11, t11 + 1);
    if (!Q8(h10, i11, e11 === 1 ? 0 : m10(e11 - 1, Math.floor(t11 / (u10[e11] / u10[e11 - 1]))))) {
      let [t12, n11] = E10(c10(e11), s11);
      O10 += `M${D10(c10(e11), a11)}${e52(c10(e11), t12, n11, 1)}`;
    }
    if (Q8(h10, i11, m10(e11, t11 + 1)) || (O10 += `M${D10(c10(e11), s11)}L${D10(c10(e11) + o10, s11)}`), e11 === n10 && t11 !== 0) {
      let [e12, t12] = E10(r10, s11);
      O10 += `M${D10(r10, a11)}${e52(r10, e12, t12, 1)}`;
    }
  }
  let ee2 = `<path d="${O10}" fill="none" stroke="${hOe}" stroke-width="${X8(w10)}" stroke-linecap="round" stroke-linejoin="round"/>`, te2 = `M${D10(r10, Math.PI)}L${D10(l10(n10), Math.PI)}`, ne2 = (e11, t11, n11) => {
    let r11 = n11 - t11;
    for (; r11 > Math.PI; ) r11 -= 2 * Math.PI;
    for (; r11 <= -Math.PI; ) r11 += 2 * Math.PI;
    if (Math.abs(r11) < 1e-6) return ``;
    let [i11, a11] = E10(e11, t11 + r11);
    return e52(e11, i11, a11, +(r11 > 0));
  };
  for (let e11 = 1; e11 < C10.length; e11++) {
    let t11 = C10[e11 - 1], n11 = C10[e11], r11 = p10(t11), i11 = p10(n11), a11 = y10(t11), o11 = y10(n11);
    te2 += i11 === 0 ? `L${X8(T10)} ${X8(T10)}` : r11 === i11 ? ne2(l10(r11), a11, o11) : i11 < r11 ? `L${D10(l10(i11), a11)}${ne2(l10(i11), a11, o11)}` : `${ne2(l10(r11), a11, o11)}L${D10(l10(i11), o11)}`;
  }
  let re2 = C10.length ? `<path d="${te2}" fill="none" stroke="${gOe}" stroke-width="${X8(FB(o10 * 0.26, 6, 26))}" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>` : ``, ie2 = `<circle cx="${X8(T10)}" cy="${X8(T10)}" r="${X8(r10)}" fill="#ffffff"/>`, ae2 = Y8 * 0.8, oe2 = Math.min(Y8, s10 * 1.5);
  return { box: { x: i10 - T10, y: a10 - T10, w: 2 * T10, h: 2 * T10 }, draw: (e11) => ie2 + (e11 ? re2 : ``) + ee2, mouse: { x: i10 - r10 - 10 - Y8, y: a10 - ae2 * 0.62, w: Y8, h: ae2 }, cheese: { x: i10 - oe2 / 2, y: a10 - oe2 * 0.4, w: oe2, h: oe2 * 0.8 }, cats: S10.map((e11) => {
    let t11 = p10(e11), n11 = Math.min(o10, 2 * Math.PI * l10(t11) / u10[t11]) * 0.96, [r11, s11] = E10(l10(t11), y10(e11));
    return { x: i10 - T10 + r11 - n11 / 2, y: a10 - T10 + s11 - n11 / 2, w: n11, h: n11 };
  }), alt: `Rundes Labyrinth mit ${n10} Ringen` };
}
var TOe = (e10) => ({ x: X8(e10.x), y: X8(e10.y), w: X8(e10.w), h: X8(e10.h) });
function t5(e10, t10, n10, r10) {
  return Ck({ ...TOe(e10), svg: t10, name: n10, alt: r10, locked: true });
}
function EOe(e10, t10) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${X8(e10.box.w)} ${X8(e10.box.h)}">${e10.draw(t10)}</svg>`;
}
function n5(e10) {
  return j({ x: 70, y: 34, w: VB, h: XB(44), size: 44, html: e10, font: `nunito`, align: `left`, bold: true, color: qB, locked: true });
}
function DOe(e10) {
  let t10 = FB(Math.round(e10.level), 0, K8.length - 1), n10 = FB(Math.round(e10.cats), 0, 4), r10 = e10.shape === `round` ? wOe(t10, n10) : COe(t10, n10), i10 = LB(xOe.slice()), a10 = [...r10.cats.map((e11, t11) => t5(e11, SOe(i10[t11 % i10.length]), `Katze`, `Katze \u2013 hier kommt die Maus nicht vorbei`)), t5(r10.mouse, yOe, `Maus`, `Maus \u2013 hier geht es los`), t5(r10.cheese, bOe, `K\xE4se`, `K\xE4se \u2013 das Ziel`), j({ x: 70, y: 104, w: VB, h: XB(26), size: 26, html: n10 ? `Zeichne den Weg der Maus zum K\xE4se. An den Katzen kommt sie nicht vorbei!` : `Zeichne mit dem Stift den Weg der Maus zum K\xE4se.`, font: `nunito`, align: `left`, bold: true, color: KB, locked: true })], o10 = ZO(`maze`);
  o10.items = [t5(r10.box, EOe(r10, false), `Labyrinth`, r10.alt), n5(`Labyrinth`), ...a10];
  let s10 = ZO(`maze`);
  return s10.items = [t5(r10.box, EOe(r10, true), `Labyrinth`, `${r10.alt}, mit dem Weg zum K\xE4se`), n5(`L\xF6sung: Labyrinth`), ...a10.map((e11) => ({ ...e11, id: YO(e11.type.slice(0, 2)) }))], [o10, s10];
}
function OOe(e10) {
  let t10 = Array.from({ length: FB(e10.pages, 1, 20) }, () => DOe(e10));
  return [...t10.map((e11) => e11[0]), ...e10.solutions ? t10.map((e11) => e11[1]) : []];
}
function kOe() {
  return OOe({ ...pOe, level: 1, cats: 2, pages: 1, solutions: false })[0];
}

export const MAZE_LEVELS = K8;
export const MAZE_DEFAULTS = pOe;
export const mazeSizeLabel = mOe;
export const makeMazePages = OOe;


// ---- Noten lernen ----
var Kl = [`AFFE`, `CAFE`, `CHEF`, `DACH`, `FACH`, `HEFE`, `FEE`, `ADE`, `ACH`, `EHE`, `AHA`, `EGGE`], ql = { whole: `4`, half: `2`, quarter: `1`, eighth: `\xBD` }, Jl = { clef: `treble`, ledger: false, answer: `names`, rounds: 10 };
var Ml = (e10) => (e10?.tracks ?? []).map((e11) => e11.sound).filter((e11) => !!e11), Nl = [`C`, `D`, `E`, `F`, `G`, `A`, `H`], Pl = [0, 2, 4, 5, 7, 9, 11], Fl = (e10) => Math.round(e10 * 10) / 10, Il = (e10) => Nl[(e10 % 7 + 7) % 7], Ll = (e10) => 12 * (Math.floor(e10 / 7) + 1) + Pl[(e10 % 7 + 7) % 7], Rl = (e10) => Pl.includes((e10 % 12 + 12) % 12), zl = (e10, t10) => t10 - (e10 === `treble` ? 30 : 18), Bl = (e10, t10, n10) => e10 + 4 * t10 - n10 * t10 / 2;
function Vl(e10, t10) {
  return e10 === `treble` ? t10 ? [28, 40] : [30, 38] : t10 ? [16, 28] : [18, 26];
}
function Hl(e10, t10, n10, r10, i10 = `#1f2937`) {
  let a10 = ``;
  for (let o10 = 0; o10 < 5; o10++) a10 += `<path d="M${Fl(e10)} ${Fl(t10 + o10 * r10)}H${Fl(e10 + n10)}" stroke="${i10}" stroke-width="${Fl(Math.max(1.2, r10 * 0.09))}"/>`;
  return a10;
}
function Ul(e10, t10, n10, r10, i10 = `#1f2937`) {
  let a10 = r10 / 10;
  return ((e11) => `<g transform="translate(${Fl(t10)} ${Fl(n10)}) scale(${Fl(a10 * 1e3) / 1e3})">${e11}</g>`)(e10 === `treble` ? `<path d="M15 30C14 24 24 23 24 31C24 39 11 42 6 34C1 25 8 13 19 7C26 3 26 -8 21 -12C16 -16 12 -8 13 0C14 10 16 24 18 36L19 47C19.5 54 12 56 10 51" fill="none" stroke="${i10}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11.5" cy="50" r="3.2" fill="${i10}"/>` : `<path d="M5 10.5C4 3 13 -1 19 3C26 8 24 22 6 33" fill="none" stroke="${i10}" stroke-width="3" stroke-linecap="round"/><circle cx="6" cy="10" r="3.4" fill="${i10}"/><circle cx="28" cy="5" r="2" fill="${i10}"/><circle cx="28" cy="15" r="2" fill="${i10}"/>`);
}
var Wl = (e10) => e10 * 3.2;
function Gl(e10, t10, n10, r10, i10, a10 = `quarter`, o10 = `#1f2937`) {
  let s10 = zl(e10, t10), c10 = Bl(r10, i10, s10), l10 = i10 * (a10 === `whole` ? 0.72 : 0.62), u10 = i10 * 0.45, d10 = Fl(Math.max(1.2, i10 * 0.12)), f10 = ``, p10 = l10 * 1.75;
  for (let e11 = -2; e11 >= s10; e11 -= 2) f10 += `<path d="M${Fl(n10 - p10)} ${Fl(Bl(r10, i10, e11))}H${Fl(n10 + p10)}" stroke="${o10}" stroke-width="${Fl(Math.max(1.2, i10 * 0.09))}"/>`;
  for (let e11 = 10; e11 <= s10; e11 += 2) f10 += `<path d="M${Fl(n10 - p10)} ${Fl(Bl(r10, i10, e11))}H${Fl(n10 + p10)}" stroke="${o10}" stroke-width="${Fl(Math.max(1.2, i10 * 0.09))}"/>`;
  let m10 = a10 === `whole` || a10 === `half`;
  if (f10 += `<ellipse cx="${Fl(n10)}" cy="${Fl(c10)}" rx="${Fl(l10)}" ry="${Fl(u10)}" transform="rotate(-20 ${Fl(n10)} ${Fl(c10)})" fill="${m10 ? `none` : o10}" stroke="${o10}" stroke-width="${m10 ? Fl(i10 * 0.16) : 0}"/>`, a10 === `whole`) return f10;
  let h10 = s10 < 4, g10 = h10 ? n10 + l10 * 0.9 : n10 - l10 * 0.9, _10 = h10 ? c10 - i10 * 3.4 : c10 + i10 * 3.4;
  if (f10 += `<path d="M${Fl(g10)} ${Fl(c10 + (h10 ? -i10 * 0.1 : i10 * 0.1))}V${Fl(_10)}" stroke="${o10}" stroke-width="${d10}" stroke-linecap="round"/>`, a10 === `eighth`) {
    let e11 = h10 ? 1 : -1;
    f10 += `<path d="M${Fl(g10)} ${Fl(_10)}c${Fl(i10 * 0.2)} ${Fl(e11 * i10 * 0.9)} ${Fl(i10 * 1.15)} ${Fl(e11 * i10 * 1.1)} ${Fl(i10 * 0.85)} ${Fl(e11 * i10 * 2.3)}" fill="none" stroke="${o10}" stroke-width="${Fl(i10 * 0.22)}" stroke-linecap="round"/>`;
  }
  return f10;
}

var r5 = { clef: `treble`, ledger: false, formats: [`name`, `draw`], layout: `mixed`, pages: 1, solutions: false }, i5 = 18, FOe = 2.7 * i5, IOe = 156.6, a5 = 58, o5 = 50, s5 = 30, LOe = `#15803d`, c5 = (e10) => Vl(e10.o.clef, e10.o.ledger), ROe = (e10) => K(...c5(e10));
function zOe(e10, t10) {
  let n10 = [];
  for (; n10.length < t10; ) {
    let t11 = ROe(e10);
    n10.length && n10[n10.length - 1] === t11 || n10.push(t11);
  }
  return n10;
}
function l5(e10, t10, n10, r10) {
  let [i10, a10] = e10.at(n10, FOe);
  return e10.raw(Hl(i10, a10, r10, i5) + Ul(t10.o.clef, i10 + 4, a10, i5)), n10 + Wl(i5) + 34;
}
function u5(e10, t10, n10, r10, i10 = `quarter`, a10 = GB) {
  let [o10, s10] = e10.at(r10, FOe);
  e10.raw(Gl(t10.o.clef, n10, o10, s10, i5, i10, a10));
}
var d5 = (e10, t10, n10) => Array.from({ length: n10 }, (r10, i10) => n10 === 1 ? (e10 + t10) / 2 : e10 + (t10 - e10) * i10 / (n10 - 1));
function BOe(e10, t10, n10) {
  let r10 = new eV(70, VB, 214.6), i10 = l5(r10, e10, 70, VB), a10 = tV(e10, () => zOe(e10, 8), (e11) => `n${e11.join(`,`)}`);
  d5(i10 + 10, 70 + VB - 50, a10.length).forEach((i11, o10) => {
    u5(r10, e10, a10[o10], i11), rV(t10, r10, i11 - a5 / 2, n10, 164.6, a5, o5, Il(a10[o10]), s5);
  }), t10.graphic(r10, n10, `Noten`);
}
function VOe(e10, t10, n10) {
  let r10 = 164.6 + XB(s5), i10 = new eV(70, VB, r10), a10 = new eV(70, VB, r10), o10 = l5(i10, e10, 70, VB);
  l5(a10, e10, 70, VB);
  let [s10, c10] = c5(e10), l10 = tV(e10, () => zOe(e10, 7), (e11) => `z${e11.map(Il).join(``)}`);
  d5(o10 + 20, 70 + VB - 60, l10.length).forEach((r11, i11) => {
    let o11 = Il(l10[i11]);
    t10.text(r11 - 40, n10 + IOe + 8, 80, mT(o11), s5, { bold: true });
    for (let t11 = s10; t11 <= c10; t11++) Il(t11) === o11 && u5(a10, e10, t11, r11, `whole`, LOe);
  }), t10.graphic(i10, n10, `Notenlinien`, a10);
}
function HOe(e10, t10, n10) {
  let r10 = new eV(70, VB, 214.6), i10 = (VB - 40) / 2, [a10, o10] = c5(e10);
  tV(e10, () => LB(Kl.slice()).slice(0, 2), (e11) => `w${e11.join(`,`)}`).forEach((s10, c10) => {
    let l10 = 70 + c10 * (i10 + 40), u10 = d5(l5(r10, e10, l10, i10) + 20, l10 + i10 - 40, s10.length);
    [...s10].forEach((i11, s11) => {
      let c11 = [];
      for (let e11 = a10; e11 <= o10; e11++) Il(e11) === i11 && c11.push(e11);
      u5(r10, e10, PB(c11), u10[s11]), rV(t10, r10, u10[s11] - a5 / 2, n10, 164.6, a5, o5, i11, s5);
    });
  }), t10.graphic(r10, n10, `Notenr\xE4tsel`);
}
function UOe(e10, t10, n10) {
  let r10 = new eV(70, VB, 214.6), i10 = l5(r10, e10, 70, VB), a10 = tV(e10, () => {
    let e11 = [`whole`, `half`, `quarter`, `eighth`];
    return LB([...e11, PB(e11), PB(e11)]);
  }, (e11) => `v${e11.join(`,`)}`);
  d5(i10 + 20, 70 + VB - 60, a10.length).forEach((i11, o10) => {
    u5(r10, e10, ROe(e10), i11, a10[o10]), rV(t10, r10, i11 - a5 / 2, n10, 164.6, a5, o5, ql[a10[o10]], s5);
  }), t10.graphic(r10, n10, `Notenwerte`);
}
var WOe = [{ id: `name`, label: `Notennamen`, title: `Notennamen`, sample: `Note \u2192 C D E \u2026`, instruction: () => `Wie hei\xDFen die Noten? Schreibe den Namen in das K\xE4stchen.`, rowH: () => 214.6, row: BOe }, { id: `draw`, label: `Noten einzeichnen`, title: `Noten einzeichnen`, sample: `C D E \u2192 Noten malen`, instruction: () => `Zeichne die Noten mit dem Stift auf die Notenlinien.`, rowH: () => 164.6 + XB(s5), row: VOe }, { id: `word`, label: `Notenr\xE4tsel`, title: `Notenr\xE4tsel`, sample: `Noten \u2192 DACH`, instruction: () => `Notenr\xE4tsel: Schreibe die Notennamen auf \u2013 welches Wort ergibt sich?`, rowH: () => 214.6, row: HOe }, { id: `values`, label: `Notenwerte`, title: `Notenwerte`, sample: `Halbe \u2192 2 Schl\xE4ge`, instruction: () => `Wie viele Schl\xE4ge dauert die Note? Ganze = 4, Halbe = 2, Viertel = 1, Achtel = \xBD`, rowH: () => 214.6, row: UOe }], GOe = (e10) => WOe.find((t10) => t10.id === e10);
function KOe(e10, t10) {
  let n10 = e10.formats.map(GOe).filter((e11) => !!e11), r10 = e10.clef === `bass` ? ` (Bassschl\xFCssel)` : ``;
  return bV(n10, e10, () => ({ o: e10, seen: /* @__PURE__ */ new Set() }), (e11) => `${e11 ? e11.title : `Noten lernen`}${r10}`, `notes`, t10);
}
function qOe() {
  return KOe({ ...r5, formats: [`name`, `word`, `draw`] })[0];
}

export const NOTE_DEFAULTS = r5;
export const NOTE_FORMATS = WOe;
export const findNoteFormat = GOe;
export const makeNotePages = KOe;

export const MATH_RANGES = MB;
export const MATH_DEFAULTS = NB;
export const MATH_FORMATS = hV;
export const findFormat = gV;
export const makeMathPages = xV;
export const rangeText = RB;
