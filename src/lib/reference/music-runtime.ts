/* eslint-disable */
// @ts-nocheck
// Generated from Lernsachen-Heft.html by scripts/extract-music-reference.mjs.
var e = Object.create;
var t = Object.defineProperty;
var n = Object.getOwnPropertyDescriptor;
var r = Object.getOwnPropertyNames;
var i = Object.getPrototypeOf;
var a = Object.prototype.hasOwnProperty;
var s = (e17, t10) => () => (t10 || (e17((t10 = { exports: {} }).exports, t10, t10.exports), e17 = null), t10.exports);
var l = (e17, i10, o10, s10) => {
  if (i10 && typeof i10 == `object` || typeof i10 == `function`) for (var c10 = r(i10), l10 = 0, u10 = c10.length, d10; l10 < u10; l10++) d10 = c10[l10], !a.call(e17, d10) && d10 !== o10 && t(e17, d10, { get: ((e18) => i10[e18]).bind(null, d10), enumerable: !(s10 = n(i10, d10)) || s10.enumerable });
  return e17;
};
var u = (n10, r10, o10) => (o10 = n10 == null ? {} : e(i(n10)), l(r10 || !n10 || !n10.__esModule || !a.call(n10, `default`) ? t(o10, `default`, { value: n10, enumerable: true }) : o10, n10));
var ze = [{ id: `andika`, family: `Andika`, label: `Andika`, hint: `f\xFCr Leseanf\xE4nger, einst\xF6ckiges a`, fallback: `Verdana, sans-serif` }, { id: `druck`, family: `Andika`, label: `Druckschrift`, hint: `Grundschul-Druckschrift wie in Bayern (Gruschudru)`, fallback: `Andika, Verdana, sans-serif` }, { id: `grund`, family: `Playwrite DE Grund`, label: `Grundschrift`, hint: `wie in der Schule (Playwrite DE Grund)`, fallback: `Andika, Verdana, sans-serif` }, { id: `schreib`, family: `Playwrite DE VA`, label: `Schreibschrift VA`, hint: `verbundene Schrift (Vereinfachte Ausgangsschrift)`, fallback: `cursive` }, { id: `sas`, family: `Playwrite DE SAS`, label: `Schreibschrift SAS`, hint: `verbundene Schrift (Schulausgangsschrift, z. B. in Bayern)`, fallback: `cursive` }, { id: `lexend`, family: `Lexend`, label: `Lexend`, hint: `besonders leicht lesbar, weite Buchstaben`, fallback: `Verdana, sans-serif` }, { id: `nunito`, family: `Nunito`, label: `Nunito`, hint: `serifenlos, freundlich`, fallback: `system-ui, sans-serif` }, { id: `atkinson`, family: `Atkinson Hyperlegible`, label: `Atkinson`, hint: `barrierefrei, gut unterscheidbare Buchstaben`, fallback: `Verdana, sans-serif` }, { id: `merriweather`, family: `Merriweather`, label: `Merriweather`, hint: `mit Serifen, wie in B\xFCchern`, fallback: `Georgia, serif` }, { id: `caveat`, family: `Caveat`, label: `Handschrift`, hint: `locker wie mit dem Stift geschrieben`, fallback: `cursive` }, { id: `comic`, family: `Bangers`, label: `Comic`, hint: `gro\xDFe Comic-Buchstaben (Bangers)`, fallback: `Impact, sans-serif` }];
function Be(e17) {
  return ze.find((t10) => t10.id === e17) ?? ze[0];
}
function Ve(e17) {
  let t10 = Be(e17);
  return `"${t10.family}", ${t10.fallback}`;
}
var fr = new TextEncoder();
function pr(e17) {
  let t10 = new Uint8Array(e17.reduce((e18, t11) => e18 + t11.length, 0)), n10 = 0;
  for (let r10 of e17) t10.set(r10, n10), n10 += r10.length;
  return t10;
}
var mr = (...e17) => new Uint8Array(e17);
var hr = (e17) => mr(e17 >> 8 & 255, e17 & 255);
var gr = (e17) => mr(e17 >>> 24 & 255, e17 >> 16 & 255, e17 >> 8 & 255, e17 & 255);
var _r = (e17) => new Uint8Array(e17);
var vr = (e17, ...t10) => {
  let n10 = pr(t10);
  return pr([gr(8 + n10.length), fr.encode(e17), n10]);
};
var yr = (e17, t10, n10, ...r10) => vr(e17, mr(t10, n10 >> 16 & 255, n10 >> 8 & 255, n10 & 255), ...r10);
var br = (e17, ...t10) => {
  let n10 = pr(t10), r10 = n10.length, i10 = r10 < 128 ? mr(r10) : mr(128 | r10 >> 21 & 127, 128 | r10 >> 14 & 127, 128 | r10 >> 7 & 127, r10 & 127);
  return pr([mr(e17), i10, n10]);
};
var xr = pr([gr(65536), gr(0), gr(0), gr(0), gr(65536), gr(0), gr(0), gr(0), gr(1073741824)]);
function Cr(e17, t10) {
  let n10 = 0;
  for (let r10 = 0; r10 < 4 && t10 < e17.length; r10++) {
    let r11 = e17[t10++];
    if (n10 = n10 << 7 | r11 & 127, !(r11 & 128)) break;
  }
  return [n10, t10];
}
function wr(e17, t10, n10) {
  let r10 = t10;
  for (; r10 + 1 < n10; ) {
    let t11 = e17[r10], [i10, a10] = Cr(e17, r10 + 1), o10 = Math.min(n10, a10 + i10);
    if (t11 === 5) return e17.slice(a10, o10);
    if (t11 === 3) {
      let t12 = a10 + 2, n11 = e17[t12++] ?? 0;
      n11 & 128 && (t12 += 2), n11 & 64 && (t12 += 1 + (e17[t12] ?? 0)), n11 & 32 && (t12 += 2);
      let r11 = wr(e17, t12, o10);
      if (r11) return r11;
    } else if (t11 === 4) {
      let t12 = wr(e17, a10 + 13, o10);
      if (t12) return t12;
    }
    if (o10 <= r10) break;
    r10 = o10;
  }
  return null;
}
var Tr = (e17) => !!e17 && e17.length >= 2 && e17.length <= 16 && e17[0] >> 3 >= 1 && e17[0] >> 3 <= 30 && ((e17[0] & 7) << 1 | e17[1] >> 7) <= 12 && (e17[1] >> 3 & 15) >= 1 && (e17[1] >> 3 & 15) <= 7;
function Er(e17) {
  if (Tr(e17) && e17[0] !== 3) return e17;
  let t10 = wr(e17, e17.length > 12 && e17[4] === 101 && e17[5] === 115 && e17[6] === 100 && e17[7] === 115 ? 12 : e17.length > 4 && e17[0] === 0 && e17[4] === 3 ? 4 : 0, e17.length);
  return Tr(t10) ? t10 : null;
}
function Dr(e17, t10, n10, r10, i10 = 96e3) {
  let a10 = e17.length, o10 = a10 * 1024, s10 = e17.reduce((e18, t11) => Math.max(e18, t11.length), 0), c10 = yr(`esds`, 0, 0, br(3, hr(1), mr(0), br(4, mr(64, 21), mr(s10 >> 16 & 255, s10 >> 8 & 255, s10 & 255), gr(i10), gr(i10), br(5, t10)), br(6, mr(2)))), l10 = vr(`mp4a`, _r(6), hr(1), _r(8), hr(r10), hr(16), hr(0), hr(0), gr(n10 * 65536), c10), u10 = (t11) => vr(`moov`, yr(`mvhd`, 0, 0, gr(0), gr(0), gr(n10), gr(o10), gr(65536), hr(256), _r(10), xr, _r(24), gr(2)), vr(`trak`, yr(`tkhd`, 0, 7, gr(0), gr(0), gr(1), gr(0), gr(o10), _r(8), hr(0), hr(0), hr(256), hr(0), xr, gr(0), gr(0)), vr(`mdia`, yr(`mdhd`, 0, 0, gr(0), gr(0), gr(n10), gr(o10), hr(21956), hr(0)), yr(`hdlr`, 0, 0, gr(0), fr.encode(`soun`), _r(12), fr.encode(`SoundHandler\0`)), vr(`minf`, yr(`smhd`, 0, 0, hr(0), hr(0)), vr(`dinf`, yr(`dref`, 0, 0, gr(1), yr(`url `, 0, 1))), vr(`stbl`, yr(`stsd`, 0, 0, gr(1), l10), yr(`stts`, 0, 0, gr(1), gr(a10), gr(1024)), yr(`stsc`, 0, 0, gr(1), gr(1), gr(a10), gr(1)), yr(`stsz`, 0, 0, gr(0), gr(a10), ...e17.map((e18) => gr(e18.length))), yr(`stco`, 0, 0, gr(1), gr(t11))))))), d10 = vr(`ftyp`, fr.encode(`M4A `), gr(512), fr.encode(`M4A `), fr.encode(`isom`), fr.encode(`iso2`), fr.encode(`mp41`));
  return pr([d10, u10(d10.length + u10(0).length + 8), gr(8 + e17.reduce((e18, t11) => e18 + t11.length, 0)), fr.encode(`mdat`), ...e17]);
}
var Or = (e17, t10) => (e17[t10] << 24 >>> 0) + (e17[t10 + 1] << 16) + (e17[t10 + 2] << 8) + e17[t10 + 3];
function kr(e17, t10, n10, r10) {
  let i10 = t10;
  for (; i10 + 8 <= n10; ) {
    let t11 = Or(e17, i10);
    if (t11 < 8 || i10 + t11 > n10) return null;
    if (String.fromCharCode(e17[i10 + 4], e17[i10 + 5], e17[i10 + 6], e17[i10 + 7]) === r10) return [i10 + 8, i10 + t11];
    i10 += t11;
  }
  return null;
}
function Ar(e17) {
  let t10 = (t11, ...n11) => {
    let r11 = t11;
    for (let t12 of n11) r11 &&= kr(e17, r11[0], r11[1], t12);
    return r11;
  }, n10 = kr(e17, 0, e17.length, `moov`), r10 = kr(e17, 0, e17.length, `mdat`), i10 = t10(n10, `trak`, `mdia`), a10 = t10(i10, `mdhd`), o10 = t10(i10, `minf`, `stbl`), s10 = t10(o10, `stsd`), c10 = t10(o10, `stsz`), l10 = t10(o10, `stco`);
  if (!r10 || !a10 || !s10 || !c10 || !l10) return null;
  let u10 = kr(e17, s10[0] + 8, s10[1], `mp4a`), d10 = u10 && kr(e17, u10[0] + 28, u10[1], `esds`);
  if (!u10 || !d10) return null;
  let f10 = wr(e17, d10[0] + 4, d10[1]);
  if (!f10 || f10[0] !== 3) return null;
  let p10 = Er(f10);
  if (!p10) return null;
  let m10 = e17[u10[0] + 16] << 8 | e17[u10[0] + 17], h10 = Or(e17, a10[0] + (e17[a10[0]] === 1 ? 20 : 12));
  if (Or(e17, l10[0] + 4) !== 1) return null;
  let g10 = Or(e17, c10[0] + 8), _10 = Or(e17, c10[0] + 4), v10 = Or(e17, l10[0] + 8);
  if (!g10 || !h10 || m10 < 1 || m10 > 8 || c10[0] + 12 + (_10 ? 0 : g10 * 4) > c10[1]) return null;
  let y10 = [], b10 = 0;
  for (let t11 = 0; t11 < g10; t11++) {
    let n11 = _10 || Or(e17, c10[0] + 12 + t11 * 4);
    if (v10 + n11 > e17.length) return null;
    y10.push(e17.subarray(v10, v10 + n11)), v10 += n11, b10 += n11;
  }
  return Dr(y10, p10, h10, m10, Math.max(8e3, Math.round(b10 * 8 * h10 / (g10 * 1024))));
}
function jr(e17) {
  let t10 = /^data:audio\/(?:mp4|x-m4a|m4a);base64,/i.exec(e17);
  if (!t10 || typeof atob != `function`) return e17;
  let n10 = e17.slice(t10[0].length);
  try {
    let t11 = atob(n10.slice(0, 2048).replace(/[^A-Za-z0-9+/=]/g, ``).slice(0, 2048)), r10 = t11.indexOf(`esds`);
    if (r10 < 0) return e17;
    let i10 = false;
    for (let e18 = r10; e18 < Math.min(t11.length - 3, r10 + 64) && !i10; e18++) i10 = t11.charCodeAt(e18) === 3 && t11.charCodeAt(e18 + 1) === 128 && t11.charCodeAt(e18 + 2) === 128 && t11.charCodeAt(e18 + 3) === 128;
    if (!i10) return e17;
    let a10 = atob(n10), o10 = new Uint8Array(a10.length);
    for (let e18 = 0; e18 < a10.length; e18++) o10[e18] = a10.charCodeAt(e18);
    let s10 = Ar(o10);
    if (!s10) return e17;
    let c10 = ``;
    for (let e18 = 0; e18 < s10.length; e18 += 32768) c10 += String.fromCharCode(...s10.subarray(e18, e18 + 32768));
    return `data:audio/mp4;base64,${btoa(c10)}`;
  } catch {
    return e17;
  }
}
var Mr = null;
var Nr = /* @__PURE__ */ new Set();
var Pr = 0;
function Fr(e17, t10) {
  let n10 = Mr;
  if (Mr = null, n10) try {
    n10.stop();
  } catch {
  }
  let r10 = { kind: e17, stop: t10 };
  return Mr = r10, { release: () => {
    Mr === r10 && (Mr = null, zr());
  }, holds: () => Mr === r10 };
}
var Lr = () => Mr?.kind ?? null;
function Rr(e17) {
  Mr ? Nr.add(e17) : e17();
}
function zr() {
  Nr.size && !Pr && typeof window < `u` && (Pr = window.setTimeout(() => {
    if (Pr = 0, Mr) return;
    let e17 = [...Nr];
    Nr.clear();
    for (let t10 of e17) try {
      t10();
    } catch {
    }
  }, 250));
}
var Br = null;
function Vr() {
  try {
    let e17 = window.AudioContext ?? window.webkitAudioContext;
    return e17 ? (Br ??= new e17(), (Br.state === `suspended` || Br.state === `interrupted`) && Br.resume(), Br) : null;
  } catch {
    return null;
  }
}
var Hr = /* @__PURE__ */ new Map();
var Ur = null;
var Wr = (e17) => `${e17.length}:${e17.slice(-64)}`;
function Gr(e17, t10) {
  let n10 = Wr(t10), r10 = Hr.get(n10);
  return r10 || (r10 = fetch(t10).then((e18) => e18.arrayBuffer()).then((t11) => new Promise((n11) => {
    e17.decodeAudioData(t11, n11, () => n11(null))?.catch?.(() => n11(null));
  })).catch(() => null), Hr.set(n10, r10)), r10;
}
function qr() {
  let e17 = Ur;
  if (Ur = null, e17) {
    try {
      e17.src?.stop();
    } catch {
    }
    e17.done();
  }
}
function Jr(e17) {
  if (e17) try {
    e17.pause(), e17.hasAttribute(`src`) && (e17.removeAttribute(`src`), e17.load());
  } catch {
  }
}
var Yr = (e17) => e17?.name ?? `error`;
function Xr(e17, t10, n10 = {}) {
  let r10 = /^data:([^;,]+)/.exec(t10)?.[1] ?? ``;
  !Br && r10 && typeof e17.canPlayType == `function` && e17.canPlayType(r10) === `` && Vr(), fi();
  let i10 = false, a10 = true, o10 = false, s10 = new AbortController(), c10 = 0, l10 = -1, u10 = false, d10 = t10, f10 = null, p10 = 0, m10 = -1, h10 = (t11) => {
    if (i10) return;
    i10 = true, clearTimeout(p10), s10.abort(), Jr(e17);
    let r11 = f10;
    if (f10 = null, r11) {
      r11.onended = null;
      try {
        r11.stop();
      } catch {
      }
    }
    a10 ? queueMicrotask(() => n10.onEnd?.(t11)) : n10.onEnd?.(t11);
  }, g10 = () => {
    i10 || o10 || (o10 = true, n10.onStart?.());
  }, _10 = () => {
    clearTimeout(p10);
    let t11 = e17.duration, n11 = Number.isFinite(t11) && t11 > 0 ? Math.max(0, t11 - e17.currentTime) : 30;
    p10 = window.setTimeout(() => {
      i10 || f10 || (!e17.paused && e17.currentTime > m10 + 0.05 ? (m10 = e17.currentTime, _10()) : h10(e17.paused ? `paused` : `ended`));
    }, n11 * 1e3 + 2e3);
  }, v10 = async (n11) => {
    if (i10 || l10 === c10) return;
    if (l10 = c10, n11 === `NotAllowedError`) return h10(`gesture`);
    if (n11 === `AbortError`) return h10(`paused`);
    if (!u10) {
      u10 = true;
      let e18 = jr(t10);
      if (e18 !== t10) {
        d10 = e18, y10(e18);
        return;
      }
    }
    let r11 = Vr(), a11 = r11 ? await Gr(r11, d10) : null;
    if (i10) return;
    if (!r11 || !a11) return h10(`format`);
    if (r11.state !== `running`) return h10(`gesture`);
    s10.abort(), Jr(e17);
    let o11 = f10 = r11.createBufferSource();
    o11.buffer = a11, o11.connect(r11.destination), o11.onended = () => f10 === o11 && h10(`ended`), o11.start(), g10(), clearTimeout(p10), p10 = window.setTimeout(() => h10(`ended`), a11.duration * 1e3 + 600);
  }, y10 = (t11) => {
    s10.abort(), s10 = new AbortController();
    let n11 = ++c10, r11 = { signal: s10.signal };
    e17.addEventListener(`playing`, g10, r11), e17.addEventListener(`ended`, () => h10(`ended`), r11), e17.addEventListener(`pause`, () => e17.paused && !e17.ended && !e17.error && h10(`paused`), r11), e17.addEventListener(`error`, () => n11 === c10 && !!e17.error && void v10(`error`), r11), e17.src = t11, _10();
    try {
      e17.play()?.catch((e18) => n11 === c10 && void v10(Yr(e18)));
    } catch (e18) {
      v10(Yr(e18));
    }
  };
  return y10(t10), a10 = false, { stop: () => h10(`stopped`), get over() {
    return i10;
  } };
}
var Zr = `auto`;
var Qr = 0;
function $r() {
  try {
    let e17 = navigator.audioSession, t10 = Qr > 0 ? `play-and-record` : Zr;
    if (!e17 || e17.type === t10) return;
    if (Qr === 0 && Lr()) {
      Rr($r);
      return;
    }
    e17.type = t10;
  } catch {
  }
}
function ei() {
  Zr = `playback`, $r();
}
function ni() {
  Qr++, $r();
  let e17 = false;
  return () => {
    e17 || (e17 = true, Qr--, $r());
  };
}
var ri = [];
function ai() {
  qr(), Hr.clear();
  let e17 = Br;
  Br = null, mi = false, oi = null;
  for (let e18 of ri) try {
    e18();
  } catch {
  }
  e17 && e17.close().catch(() => void 0), $r();
}
var oi = null;
var si = false;
var ci = -1 / 0;
var li = 1e4;
function ui() {
  if (typeof window < `u` && `speechSynthesis` in window && window.speechSynthesis.speaking) return;
  let e17 = performance.now();
  e17 - ci < li || (ci = e17, ai());
}
function di(e17) {
  let t10 = performance.now();
  if (e17.state === `running`) {
    let n10 = oi?.ctx === e17 && t10 - oi.at > 600 && e17.currentTime === oi.t;
    oi = { ctx: e17, t: e17.currentTime, at: t10 }, n10 && ui();
  } else si || (si = true, setTimeout(() => {
    si = false, Br === e17 && e17.state !== `running` && ui();
  }, 900));
}
function fi() {
  let e17 = Br;
  if (!e17) return;
  let t10 = e17.state;
  t10 === `suspended` || t10 === `interrupted` ? e17.resume().catch(() => void 0) : t10 === `running` && !mi && pi();
}
function pi() {
  let e17 = Vr();
  if (e17 && (di(e17), !(e17.state !== `running` || mi))) {
    mi = true;
    try {
      let t10 = e17.createBufferSource();
      t10.buffer = e17.createBuffer(1, 1, 22050), t10.connect(e17.destination), t10.start();
    } catch {
    }
  }
}
var mi = false;
function vi() {
  let e17 = Vr();
  if (!e17) return;
  let t10 = e17.currentTime + 0.02;
  for (let [n10, r10] of [[988, 0], [1319, 0.09], [1760, 0.18]]) {
    let i10 = e17.createOscillator(), a10 = e17.createGain();
    i10.type = `triangle`, i10.frequency.value = n10, a10.gain.setValueAtTime(1e-4, t10 + r10), a10.gain.exponentialRampToValueAtTime(0.22, t10 + r10 + 0.015), a10.gain.exponentialRampToValueAtTime(1e-4, t10 + r10 + 0.35), i10.connect(a10).connect(e17.destination), i10.start(t10 + r10), i10.stop(t10 + r10 + 0.4);
  }
}
function yi() {
  let e17 = Vr();
  if (!e17) return;
  let t10 = e17.currentTime + 0.02, n10 = e17.createOscillator(), r10 = e17.createGain();
  n10.type = `sine`, n10.frequency.setValueAtTime(330, t10), n10.frequency.exponentialRampToValueAtTime(196, t10 + 0.35), r10.gain.setValueAtTime(1e-4, t10), r10.gain.exponentialRampToValueAtTime(0.25, t10 + 0.02), r10.gain.exponentialRampToValueAtTime(1e-4, t10 + 0.45), n10.connect(r10).connect(e17.destination), n10.start(t10), n10.stop(t10 + 0.5);
}
var bi = /* @__PURE__ */ new WeakMap();
var xi = /* @__PURE__ */ new WeakSet();
function Si(e17, t10) {
  bi.set(e17, t10), e17.classList.add(`lh-instrument`), ki(e17), xi.has(e17) || (xi.add(e17), Li(), e17.addEventListener(`keydown`, (t11) => {
    if (t11.key !== `Enter` && t11.key !== ` ` || t11.metaKey || t11.ctrlKey || t11.altKey) return;
    let n10 = t11.target.closest?.(`.lh-key`);
    if (!n10 || !e17.contains(n10) || !Ei(e17) || (t11.preventDefault(), t11.stopPropagation(), t11.repeat || Di.has(n10))) return;
    let r10 = bi.get(e17);
    if (!r10) return;
    r10.silent || (Vr(), pi());
    let i10 = n10.getAttribute(`data-a`);
    i10 && Oi.set(e17, i10);
    let a10 = { node: e17, key: null, note: null, x: 0, y: 0 };
    Di.set(n10, a10), r10.begin?.(), Ni(a10, n10);
  }), e17.addEventListener(`pointerdown`, (t11) => {
    if (t11.button > 0 || !Ei(e17)) return;
    bi.get(e17)?.silent || (Vr(), pi()), t11.preventDefault(), Pi(t11.pointerId);
    let n10 = { node: e17, key: null, note: null, x: t11.clientX, y: t11.clientY };
    wi.set(t11.pointerId, n10), bi.get(e17)?.begin?.(), Ni(n10, Ai(e17, t11.clientX, t11.clientY));
  }));
}
var wi = /* @__PURE__ */ new Map();
var Ti = (e17) => e17.classList.contains(`is-armed`) || !e17.closest(`.lh-edit`) || !!e17.closest(`.is-board`);
var Ei = Ti;
var Di = /* @__PURE__ */ new Map();
var Oi = /* @__PURE__ */ new WeakMap();
function ki(e17, t10) {
  if (t10 === void 0 && !e17.isConnected && !e17.classList.contains(`is-armed`)) {
    requestAnimationFrame(() => e17.isConnected && ki(e17));
    return;
  }
  let n10 = t10 ?? Ei(e17);
  e17.querySelectorAll(`.lh-key[data-a]`).forEach((e18) => {
    if (e18.setAttribute(`tabindex`, n10 ? `0` : `-1`), e18.hasAttribute(`role`) || e18.setAttribute(`role`, `button`), !e18.hasAttribute(`aria-label`)) {
      let t11 = e18.querySelector(`title`)?.textContent?.trim() || e18.textContent?.trim();
      t11 && e18.setAttribute(`aria-label`, t11);
    }
  });
  let r10 = Oi.get(e17);
  r10 && requestAnimationFrame(() => {
    document.activeElement && document.activeElement !== document.body && e17.contains(document.activeElement) || document.activeElement && document.activeElement !== document.body || e17.querySelector(`.lh-key[data-a="${CSS.escape(r10)}"]`)?.focus();
  });
}
function Ai(e17, t10, n10) {
  let r10 = document.elementFromPoint(t10, n10)?.closest(`.lh-key`) ?? null;
  return r10 && e17.contains(r10) ? r10 : null;
}
function ji(e17) {
  e17.setAttribute(`data-down`, String(Number(e17.getAttribute(`data-down`) ?? 0) + 1)), e17.classList.add(`is-down`);
}
function Mi(e17) {
  let t10 = Number(e17.getAttribute(`data-down`) ?? 1) - 1;
  t10 > 0 ? e17.setAttribute(`data-down`, String(t10)) : (e17.removeAttribute(`data-down`), e17.classList.remove(`is-down`));
}
function Ni(e17, t10) {
  e17.key !== t10 && (e17.key && (e17.note?.release(), Mi(e17.key)), e17.key = t10, e17.note = null, t10 && (ji(t10), e17.note = bi.get(e17.node)?.hit(t10) ?? null));
}
function Pi(e17) {
  let t10 = wi.get(e17);
  t10 && (wi.delete(e17), t10.note?.release(), t10.key && Mi(t10.key), bi.get(t10.node)?.end?.());
}
function Fi(e17, t10, n10) {
  let r10 = Math.hypot(t10 - e17.x, n10 - e17.y), i10 = Math.min(24, Math.max(1, Math.ceil(r10 / 8)));
  for (let r11 = 1; r11 <= i10; r11++) Ni(e17, Ai(e17.node, e17.x + (t10 - e17.x) * r11 / i10, e17.y + (n10 - e17.y) * r11 / i10));
  e17.x = t10, e17.y = n10;
}
var Ii = false;
function Li() {
  if (Ii) return;
  Ii = true, window.addEventListener(`pointermove`, (e18) => {
    let t10 = wi.get(e18.pointerId);
    if (t10) {
      if (e18.pointerType === `mouse` && !e18.buttons) return Pi(e18.pointerId);
      bi.get(t10.node)?.slide && Fi(t10, e18.clientX, e18.clientY);
    }
  }, { passive: true });
  for (let e18 of [`pointerup`, `pointercancel`]) window.addEventListener(e18, (e19) => Pi(e19.pointerId), true);
  let e17 = () => {
    for (let [e18, t10] of Di) Di.delete(e18), t10.note?.release(), t10.key && Mi(t10.key), bi.get(t10.node)?.end?.();
  };
  window.addEventListener(`keyup`, (t10) => (t10.key === `Enter` || t10.key === ` `) && e17(), true), window.addEventListener(`blur`, e17), document.addEventListener(`visibilitychange`, () => {
    if (document.hidden) for (let e18 of [...wi.keys()]) Pi(e18);
  });
}
var Ri = `
.lh-instrument svg text{pointer-events:none}
.lh-instrument .lh-key:focus{outline:none}
.lh-instrument .lh-key:focus-visible{outline:3px solid #2160c4;outline-offset:2px}
.lh-instrument .lh-key:focus-visible .lh-kdown{opacity:.14}
.lh-instrument .lh-key{cursor:pointer}
.lh-instrument .lh-key.is-off{cursor:default}
.lh-instrument .lh-key.is-down .lh-kdown{opacity:.24}
.lh-edit .lh-instrument:not(.is-armed) .lh-key{cursor:inherit}
.lh-instrument.is-armed,.lh-page:not(.lh-edit) .lh-instrument{touch-action:none}`;
var Ba = { rate: 0.75, pitch: 0.95, tone: `lively` };
var Ha = 0.5;
var Ua = 1.5;
var Wa = 0.6;
var Ga = 1.5;
var qa = `lernheft-voice`;
var Ja = (e17, t10, n10, r10) => typeof e17 == `number` && Number.isFinite(e17) ? Math.min(n10, Math.max(t10, Math.round(e17 * 100) / 100)) : r10;
function Ya(e17, t10 = Ba) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {};
  return { rate: Ja(n10.rate, Ha, Ua, t10.rate), pitch: Ja(n10.pitch, Wa, Ga, t10.pitch), tone: n10.tone === `calm` || n10.tone === `lively` || n10.tone === `normal` ? n10.tone : t10.tone };
}
var Za;
var Qa = null;
function $a() {
  if (Za === void 0) try {
    let e17 = localStorage.getItem(qa);
    Za = e17 ? Ya(JSON.parse(e17)) : null;
  } catch {
    Za = null;
  }
  return Za;
}
var to = () => $a() ?? Qa ?? Ba;
function no(e17, t10) {
  if (t10 === `normal`) return e17;
  if (t10 === `calm`) return e17.replace(/!/g, `.`);
  let n10 = e17.replace(/\.(?=\s|$)/g, `!`);
  return /[.!?…:;,]\s*$/.test(n10) || !n10.trim() ? n10 : `${n10.replace(/\s+$/, ``)}!`;
}
var ro = [{ id: `piano`, label: `Klavier`, voice: `piano`, keys: true }, { id: `synth`, label: `Synthesizer`, voice: `synth`, keys: true }, { id: `xylophone`, label: `Xylophon`, voice: `xylophone`, keys: false }, { id: `glockenspiel`, label: `Glockenspiel`, voice: `glockenspiel`, keys: false }, { id: `tubes`, label: `Klangrohre`, voice: `tube`, keys: false }];
var ao = [{ id: `all`, label: `Alle T\xF6ne`, steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], minor: false }, { id: `major`, label: `Dur`, steps: [0, 2, 4, 5, 7, 9, 11], minor: false }, { id: `minor`, label: `Moll`, steps: [0, 2, 3, 5, 7, 8, 10], minor: true }, { id: `penta`, label: `Pentatonik`, steps: [0, 2, 4, 7, 9], minor: false }, { id: `pentaMinor`, label: `Moll-Pentatonik`, steps: [0, 3, 5, 7, 10], minor: true }, { id: `blues`, label: `Blues`, steps: [0, 3, 5, 6, 7, 10], minor: true }];
var oo = [`C`, `Cis`, `D`, `Dis`, `E`, `F`, `Fis`, `G`, `Gis`, `A`, `Ais`, `H`];
var so = [`C`, `Des`, `D`, `Es`, `E`, `F`, `Ges`, `G`, `As`, `A`, `B`, `H`];
var co = /* @__PURE__ */ new Set([5, 10, 3, 8, 1, 6]);
var lo = /* @__PURE__ */ new Set([2, 7, 0, 5, 10, 3]);
var fo = [`#e03131`, `#f76707`, `#fd7e14`, `#f59f00`, `#fcc419`, `#82c91e`, `#37b24d`, `#0ca678`, `#1098ad`, `#4263eb`, `#7048e8`, `#e64980`];
var po = { skin: `piano`, voice: `piano`, scale: `all`, root: 0, octave: 4, octaves: 2, labels: `none`, colors: false };
var mo = (e17) => ro.find((t10) => t10.id === e17) ?? ro[0];
var ho = (e17) => ao.find((t10) => t10.id === e17) ?? ao[0];
var go = (e17) => (e17 % 12 + 12) % 12;
function _o(e17) {
  let t10 = mo(e17), n10 = { ...po, skin: e17, voice: t10.voice };
  return e17 === `xylophone` ? { ...n10, scale: `major`, octave: 5, octaves: 1, labels: `letters`, colors: true } : e17 === `glockenspiel` ? { ...n10, scale: `major`, octave: 5, octaves: 1, labels: `letters` } : e17 === `tubes` ? { ...n10, scale: `major`, octave: 4, octaves: 1, labels: `letters`, colors: true } : n10;
}
function vo(e17) {
  return e17.scale === `all` ? false : ho(e17.scale).minor ? lo.has(e17.root) : co.has(e17.root);
}
var yo = (e17, t10 = false) => (t10 ? so : oo)[go(e17)];
var bo = (e17) => yo(e17.root, vo(e17));
function xo(e17) {
  let t10 = ho(e17.scale);
  if (t10.id === `all`) return t10.label;
  let n10 = bo(e17);
  return t10.id === `major` ? `${n10}-Dur` : t10.id === `minor` ? `${n10.toLowerCase()}-Moll` : `${t10.minor ? n10.toLowerCase() : n10}-${t10.label}`;
}
var So = (e17, t10) => ho(e17.scale).steps.includes(go(t10 - e17.root));
var Co = [`do`, ``, `re`, ``, `mi`, `fa`, ``, `so`, ``, `la`, ``, `ti`];
function wo(e17, t10) {
  let n10 = ho(e17.scale);
  return n10.id === `all` ? Co[go(t10)] : Co[go(t10 - e17.root + (n10.minor ? 9 : 0))];
}
function To(e17, t10) {
  return e17.scale === `blues` && go(t10 - e17.root) === 6 ? so[go(t10)] : yo(t10, vo(e17));
}
function Eo(e17, t10) {
  return e17.labels === `letters` ? To(e17, t10) : e17.labels === `solfege` ? wo(e17, t10) : ``;
}
var Do = (e17) => [1, 3, 6, 8, 10].includes(go(e17));
var Oo = (e17) => fo[go(e17)];
var ko = (e17) => 440 * 2 ** ((e17 - 69) / 12);
var Ao = (e17) => mo(e17.skin).keys && e17.scale === `all`;
function jo(e17) {
  let t10 = Ao(e17), n10 = 12 * (e17.octave + 1) + (t10 ? 0 : e17.root), r10 = n10 + 12 * e17.octaves, i10 = [];
  for (let a10 = n10; a10 <= r10; a10++) (t10 || So(e17, a10)) && i10.push(a10);
  return i10;
}
function Po(e17) {
  let t10 = mo(e17.skin).label;
  return e17.scale === `all` ? t10 : `${t10} in ${xo(e17)}`;
}
var Fo = { kick: `Bass`, snare: `Snare`, hihat: `Hi-Hat`, hihatOpen: `Hi-Hat offen`, tom1: `Tom 1`, tom2: `Tom 2`, floortom: `Standtom`, crash: `Becken`, ride: `Ride`, clap: `Klatschen`, cajonBass: `Caj\xF3n Bass`, cajonSlap: `Caj\xF3n Slap`, bongoHigh: `Bongo hoch`, bongoLow: `Bongo tief`, congaHigh: `Conga hoch`, congaLow: `Conga tief`, handdrum: `Handtrommel`, triangle: `Triangel`, tambourine: `Schellenkranz`, claves: `Klangh\xF6lzer`, shaker: `Rassel`, cymbal: `Becken`, woodblock: `Holzblock`, cowbell: `Kuhglocke` };
var Lo = [{ id: `drumset`, label: `Schlagzeug` }, { id: `cajon`, label: `Caj\xF3n` }, { id: `hand`, label: `Bongos & Congas` }, { id: `orff`, label: `Orff-Instrumente` }, { id: `pads`, label: `Klang-Pads` }];
var Ro = [`#e03131`, `#fd7e14`, `#fab005`, `#40c057`, `#15aabf`, `#4c6ef5`, `#7950f2`, `#e64980`];
var zo = (e17 = 8) => Array.from({ length: e17 }, (e18, t10) => ({ label: ``, color: Ro[t10 % Ro.length] }));
var Bo = (e17) => Lo.find((t10) => t10.id === e17)?.label ?? `Schlagzeug`;
function Vo(e17) {
  return e17 === `pads` ? { skin: e17, labels: true, pads: zo() } : { skin: e17, labels: true };
}
var Ho = (e17) => e17.label || (e17.voice ? Fo[e17.voice] : ``);
var Go = null;
function Ko() {
  let e17 = Vr();
  return e17 ? (Go?.ctx === e17 || (ei(), Go = qo(e17)), Go) : null;
}
function qo(e17) {
  let t10 = e17.createDynamicsCompressor();
  t10.threshold.value = -16, t10.knee.value = 12, t10.ratio.value = 4, t10.attack.value = 3e-3, t10.release.value = 0.2, t10.connect(e17.destination);
  let n10 = e17.createGain();
  n10.gain.value = 0.8, n10.connect(t10);
  let r10 = e17.sampleRate, i10 = Math.floor(r10 * 1.6), a10 = e17.createBuffer(2, i10, r10);
  for (let e18 = 0; e18 < 2; e18++) {
    let t11 = a10.getChannelData(e18);
    for (let e19 = 0; e19 < i10; e19++) t11[e19] = (Math.random() * 2 - 1) * (1 - e19 / i10) ** 3;
  }
  let o10 = e17.createConvolver();
  o10.buffer = a10;
  let s10 = e17.createGain();
  s10.gain.value = 0.16, s10.connect(o10), o10.connect(t10);
  let c10 = e17.createBuffer(1, r10, r10), l10 = c10.getChannelData(0);
  for (let e18 = 0; e18 < r10; e18++) l10[e18] = Math.random() * 2 - 1;
  let u10 = e17.createGain();
  return u10.gain.value = 0.7, u10.connect(e17.destination), { ctx: e17, dry: n10, wet: s10, noise: c10, comp: t10, metro: u10 };
}
var Jo = [];
var Yo = 32;
var Xo = null;
function Zo(e17, t10, n10, r10) {
  let i10 = e17.ctx.createGain();
  if (i10.gain.setValueAtTime(n10, t10), Xo) return i10.connect(Xo), { out: i10, stops: [], end: t10 };
  if (i10.connect(e17.dry), r10 > 0) {
    let t11 = e17.ctx.createGain();
    t11.gain.value = r10, i10.connect(t11).connect(e17.wet);
  }
  return { out: i10, stops: [], end: t10 };
}
function Qo(e17, t10, n10, r10, i10, a10, o10, s10 = t10.out, c10 = 1) {
  if (n10 > 16e3 || r10 <= 0) return null;
  let l10 = e17.ctx.createOscillator();
  l10.frequency.setValueAtTime(n10 * c10, i10), c10 !== 1 && l10.frequency.exponentialRampToValueAtTime(n10, i10 + 0.04);
  let u10 = e17.ctx.createGain();
  u10.gain.setValueAtTime(0, i10), u10.gain.linearRampToValueAtTime(r10, i10 + a10), u10.gain.setTargetAtTime(0, i10 + a10, o10), l10.connect(u10).connect(s10);
  let d10 = i10 + a10 + o10 * 7;
  return l10.start(i10), l10.stop(d10), t10.stops.push(l10), t10.end = Math.max(t10.end, d10), l10;
}
function $o(e17, t10, n10, r10, i10, a10, o10, s10 = `bandpass`, c10 = 0) {
  let l10 = e17.ctx.createBufferSource();
  l10.buffer = e17.noise, l10.loop = o10 * 8 > 0.9;
  let u10 = e17.ctx.createBiquadFilter();
  u10.type = s10, u10.frequency.value = Math.min(16e3, r10), u10.Q.value = i10;
  let d10 = e17.ctx.createGain();
  c10 > 0 ? (d10.gain.setValueAtTime(0, n10), d10.gain.linearRampToValueAtTime(a10, n10 + c10)) : d10.gain.setValueAtTime(a10, n10), d10.gain.setTargetAtTime(0, n10 + c10, o10), l10.connect(u10).connect(d10).connect(t10.out), l10.start(n10), l10.stop(n10 + c10 + o10 * 8), t10.stops.push(l10), t10.end = Math.max(t10.end, n10 + c10 + o10 * 8);
}
var es = (e17, t10, n10) => Math.min(n10, Math.max(t10, e17));
function ts(e17, t10, n10, r10, i10) {
  let a10 = Zo(e17, n10, i10.level * r10, i10.reverb), o10 = a10.out;
  if (i10.lowpass) {
    let t11 = e17.ctx.createBiquadFilter();
    t11.type = `lowpass`, t11.frequency.value = Math.min(18e3, i10.lowpass), t11.Q.value = 0.4, t11.connect(a10.out), o10 = t11;
  }
  for (let [r11, s11, c10] of i10.parts) Qo(e17, a10, t10 * r11, s11, n10, i10.attack, i10.decay * c10, o10, i10.bend);
  i10.click && $o(e17, a10, n10, i10.click[0], i10.click[1], i10.click[2] * r10, i10.click[3]);
  let s10 = i10.damp;
  return { v: a10, release: (t11) => {
    if (!s10) return;
    let r11 = t11 ?? e17.ctx.currentTime;
    a10.out.gain.setTargetAtTime(0, Math.max(r11, n10 + 0.02), s10);
    for (let e18 of a10.stops) e18.stop(Math.max(r11, n10 + 0.02) + s10 * 8);
  } };
}
function ns(e17, t10, n10, r10) {
  let i10 = e17.ctx.createGain();
  i10.gain.setValueAtTime(0, n10), i10.gain.linearRampToValueAtTime(1, n10 + r10.attack), i10.gain.setTargetAtTime(r10.sustain, n10 + r10.attack, r10.decay), i10.connect(t10.out), t10.end = n10 + 30;
  let a10 = setTimeout(() => s10(), 2e4), o10 = false, s10 = (s11) => {
    if (o10) return;
    if (o10 = true, clearTimeout(a10), s11 !== void 0) {
      let e18 = Math.max(s11, n10 + r10.attack);
      i10.gain.setTargetAtTime(0, e18, r10.rel);
      for (let n11 of t10.stops) n11.stop(e18 + r10.rel * 8);
      return;
    }
    let c10 = Math.max(e17.ctx.currentTime, n10 + r10.attack * 0.5);
    i10.gain.cancelScheduledValues(c10), i10.gain.setValueAtTime(Math.max(1e-4, i10.gain.value), c10), i10.gain.setTargetAtTime(0, c10, r10.rel);
    for (let e18 of t10.stops) e18.stop(c10 + r10.rel * 8);
  };
  return t10.env = i10, s10;
}
function rs(e17, t10, n10, r10, i10, a10, o10 = 1) {
  let s10 = e17.ctx.createOscillator();
  s10.type = i10, s10.frequency.setValueAtTime(n10, r10);
  let c10 = e17.ctx.createGain();
  return c10.gain.value = o10, s10.connect(c10).connect(a10), s10.start(r10), t10.stops.push(s10), s10;
}
function is(e17, t10, n10, r10, i10, a10, o10) {
  let s10 = e17.ctx.createOscillator();
  s10.frequency.value = i10;
  let c10 = e17.ctx.createGain();
  c10.gain.setValueAtTime(0, r10), c10.gain.linearRampToValueAtTime(1, r10 + o10 + 0.4), s10.connect(c10);
  for (let [t11, r11] of n10) {
    let n11 = e17.ctx.createGain();
    n11.gain.value = r11 * a10, c10.connect(n11).connect(t11.frequency);
  }
  s10.start(r10), t10.stops.push(s10);
}
function as(e17, t10, n10, r10, i10) {
  let a10 = ko(n10);
  switch (t10) {
    case `piano`: {
      let t11 = [];
      return [1, 0.55, 0.32, 0.2, 0.12, 0.08, 0.05].forEach((e18, n11) => {
        let r11 = n11 + 1, i11 = r11 * Math.sqrt(1 + 35e-5 * r11 * r11);
        t11.push([i11, e18, 1 / (1 + 0.45 * n11)]), r11 <= 2 && t11.push([i11 * 1.0011, e18 * 0.35, 1 / (1 + 0.45 * n11)]);
      }), ts(e17, a10, r10, i10, { parts: t11, decay: es(3.4 * (261.6 / a10) ** 0.6, 0.45, 6), attack: 3e-3, level: 0.26, reverb: 1, click: [Math.min(a10 * 3, 3500), 1.2, 0.18, 0.012], damp: 0.09, lowpass: a10 * (5 + 9 * i10) });
    }
    case `xylophone`:
      return ts(e17, a10, r10, i10, { parts: [[1, 1, 1], [3, 0.3, 0.45], [6.1, 0.08, 0.25]], decay: es(0.5 * (523 / a10) ** 0.4, 0.14, 0.8), attack: 2e-3, level: 0.42, reverb: 0.7, click: [2600, 0.8, 0.28, 6e-3] });
    case `marimba`:
      return ts(e17, a10, r10, i10, { parts: [[1, 1, 1], [3.93, 0.22, 0.35], [9.2, 0.04, 0.2]], decay: es(1.1 * (262 / a10) ** 0.4, 0.35, 1.8), attack: 4e-3, level: 0.45, reverb: 0.8, click: [900, 0.7, 0.18, 8e-3], lowpass: a10 * 7 });
    case `glockenspiel`:
      return ts(e17, a10, r10, i10, { parts: [[1, 1, 1], [2.76, 0.45, 0.6], [5.4, 0.22, 0.4], [8.93, 0.12, 0.3]], decay: es(2.2 * (1047 / a10) ** 0.3, 0.8, 3.2), attack: 1e-3, level: 0.3, reverb: 1, click: [6e3, 0.7, 0.08, 4e-3] });
    case `musicbox`:
      return ts(e17, a10, r10, i10, { parts: [[1, 1, 1], [2, 0.2, 0.5], [3.01, 0.12, 0.3], [5.9, 0.06, 0.2]], decay: es(1.4 * (1047 / a10) ** 0.3, 0.5, 2), attack: 1e-3, level: 0.34, reverb: 1.2 });
    case `tube`:
      return ts(e17, a10, r10, i10, { parts: [[1, 1, 1], [3, 0.07, 0.35]], decay: es(0.22 * (262 / a10) ** 0.2, 0.1, 0.32), attack: 3e-3, level: 0.55, reverb: 0.5, click: [a10 * 2, 1, 0.35, 0.01], lowpass: a10 * 6, bend: 1.05 });
    case `organ`: {
      let t11 = Zo(e17, r10, 0.15 * (0.6 + 0.4 * i10), 0.9), n11 = ns(e17, t11, r10, { attack: 0.012, decay: 0.1, sustain: 1, rel: 0.05 }), o10 = t11.env;
      return is(e17, t11, [[1, 0.9], [2, 0.6], [3, 0.35], [4, 0.3], [6, 0.15], [8, 0.1]].filter(([e18]) => a10 * e18 < 12e3).map(([n12, i11]) => [rs(e17, t11, a10 * n12, r10, `sine`, o10, i11), a10 * n12]), r10, 6, 3e-3, 0), $o(e17, t11, r10, 3e3, 0.7, 0.08, 4e-3), { v: t11, release: n11 };
    }
    case `synth`: {
      let t11 = Zo(e17, r10, 0.11 * (0.6 + 0.4 * i10), 0.8), n11 = ns(e17, t11, r10, { attack: 8e-3, decay: 0.2, sustain: 0.65, rel: 0.15 }), o10 = t11.env, s10 = e17.ctx.createBiquadFilter();
      return s10.type = `lowpass`, s10.Q.value = 4, s10.frequency.setValueAtTime(Math.min(16e3, a10 * 12), r10), s10.frequency.setTargetAtTime(Math.min(16e3, a10 * 3 + 400), r10 + 0.01, 0.25), s10.connect(o10), rs(e17, t11, a10 * 1.004, r10, `sawtooth`, s10), rs(e17, t11, a10 * 0.996, r10, `sawtooth`, s10), rs(e17, t11, a10 / 2, r10, `square`, s10, 0.3), { v: t11, release: n11 };
    }
    case `flute`: {
      let t11 = Zo(e17, r10, 0.3 * (0.6 + 0.4 * i10), 1), n11 = ns(e17, t11, r10, { attack: 0.07, decay: 0.2, sustain: 0.85, rel: 0.08 }), o10 = t11.env;
      is(e17, t11, [[rs(e17, t11, a10, r10, `sine`, o10), a10], [rs(e17, t11, a10 * 2, r10, `sine`, o10, 0.12), a10 * 2], [rs(e17, t11, a10 * 3, r10, `sine`, o10, 0.05), a10 * 3]], r10, 5, 6e-3, 0.3);
      let s10 = e17.ctx.createBufferSource();
      s10.buffer = e17.noise, s10.loop = true;
      let c10 = e17.ctx.createBiquadFilter();
      c10.type = `bandpass`, c10.frequency.value = Math.min(12e3, a10 * 2), c10.Q.value = 2;
      let l10 = e17.ctx.createGain();
      return l10.gain.value = 0.05, s10.connect(c10).connect(l10).connect(o10), s10.start(r10), t11.stops.push(s10), { v: t11, release: n11 };
    }
  }
}
function os(e17, t10, n10, r10, i10, a10, o10, s10, c10 = `sine`) {
  let l10 = e17.ctx.createOscillator();
  l10.type = c10, l10.frequency.setValueAtTime(r10, n10), l10.frequency.exponentialRampToValueAtTime(Math.max(20, i10), n10 + a10);
  let u10 = e17.ctx.createGain();
  u10.gain.setValueAtTime(0, n10), u10.gain.linearRampToValueAtTime(o10, n10 + 2e-3), u10.gain.setTargetAtTime(0, n10 + 2e-3, s10), l10.connect(u10).connect(t10.out), l10.start(n10), l10.stop(n10 + s10 * 8), t10.stops.push(l10), t10.end = Math.max(t10.end, n10 + s10 * 8);
}
function ss(e17, t10, n10, r10, i10, a10, o10, s10) {
  let c10 = e17.ctx.createBiquadFilter();
  c10.type = `bandpass`, c10.frequency.value = o10, c10.Q.value = 0.8;
  let l10 = e17.ctx.createBiquadFilter();
  l10.type = `highpass`, l10.frequency.value = s10;
  let u10 = e17.ctx.createGain();
  u10.gain.setValueAtTime(0, n10), u10.gain.linearRampToValueAtTime(i10, n10 + 2e-3), u10.gain.setTargetAtTime(0, n10 + 2e-3, a10), c10.connect(l10).connect(u10).connect(t10.out);
  for (let i11 of [2, 3, 4.16, 5.43, 6.79, 8.21]) {
    let o11 = e17.ctx.createOscillator();
    o11.type = `square`, o11.frequency.value = r10 * i11, o11.connect(c10), o11.start(n10), o11.stop(n10 + a10 * 8), t10.stops.push(o11);
  }
  t10.end = Math.max(t10.end, n10 + a10 * 8);
}
function cs(e17, t10, n10, r10) {
  let i10 = Zo(e17, n10, r10, t10 === `kick` || t10 === `cajonBass` ? 0.08 : 0.35);
  switch (t10) {
    case `kick`:
      os(e17, i10, n10, 150, 46, 0.12, 1, 0.14), $o(e17, i10, n10, 3e3, 0.7, 0.18, 4e-3);
      break;
    case `snare`:
      os(e17, i10, n10, 200, 170, 0.05, 0.45, 0.05, `triangle`), os(e17, i10, n10, 340, 300, 0.05, 0.25, 0.04, `triangle`), $o(e17, i10, n10, 1400, 0.5, 0.65, 0.07, `highpass`);
      break;
    case `hihat`:
      ss(e17, i10, n10, 40, 0.35, 0.035, 1e4, 7e3), $o(e17, i10, n10, 8e3, 0.5, 0.15, 0.025, `highpass`);
      break;
    case `hihatOpen`:
      ss(e17, i10, n10, 40, 0.3, 0.25, 1e4, 7e3), $o(e17, i10, n10, 8e3, 0.5, 0.12, 0.2, `highpass`);
      break;
    case `tom1`:
    case `tom2`:
    case `floortom`: {
      let r11 = t10 === `tom1` ? 210 : t10 === `tom2` ? 160 : 105;
      os(e17, i10, n10, r11 * 1.45, r11, 0.16, 0.85, t10 === `floortom` ? 0.3 : 0.23), os(e17, i10, n10, r11 * 2.3, r11 * 1.6, 0.12, 0.18, 0.08), $o(e17, i10, n10, 1500, 0.6, 0.15, 0.02, `lowpass`);
      break;
    }
    case `crash`:
    case `cymbal`:
      ss(e17, i10, n10, 55, 0.3, t10 === `cymbal` ? 0.9 : 0.7, 8e3, 4e3), $o(e17, i10, n10, 5e3, 0.4, 0.35, t10 === `cymbal` ? 0.8 : 0.6, `highpass`);
      break;
    case `ride`:
      ss(e17, i10, n10, 70, 0.18, 0.5, 6e3, 3e3), Qo(e17, i10, 620, 0.12, n10, 2e-3, 0.9), Qo(e17, i10, 1490, 0.08, n10, 2e-3, 0.7);
      break;
    case `clap`:
      for (let t11 of [0, 0.011, 0.022]) $o(e17, i10, n10 + t11, 1100, 1, 0.7, 6e-3);
      $o(e17, i10, n10 + 0.033, 1100, 1, 0.55, 0.08);
      break;
    case `cajonBass`:
      os(e17, i10, n10, 115, 62, 0.06, 1, 0.12), $o(e17, i10, n10, 400, 0.7, 0.3, 0.02, `lowpass`);
      break;
    case `cajonSlap`:
      os(e17, i10, n10, 360, 320, 0.04, 0.35, 0.04), $o(e17, i10, n10, 2200, 0.8, 0.8, 0.045), $o(e17, i10, n10 + 4e-3, 3e3, 0.6, 0.3, 0.09, `highpass`);
      break;
    case `bongoHigh`:
    case `bongoLow`: {
      let r11 = t10 === `bongoHigh` ? 420 : 300;
      os(e17, i10, n10, r11 * 1.06, r11, 0.03, 0.85, t10 === `bongoHigh` ? 0.07 : 0.09), os(e17, i10, n10, r11 * 1.6, r11 * 1.5, 0.03, 0.15, 0.04), $o(e17, i10, n10, 3e3, 0.8, 0.2, 8e-3);
      break;
    }
    case `congaHigh`:
    case `congaLow`: {
      let r11 = t10 === `congaHigh` ? 260 : 190;
      os(e17, i10, n10, r11 * 1.08, r11, 0.04, 0.9, t10 === `congaHigh` ? 0.14 : 0.18), os(e17, i10, n10, r11 * 1.55, r11 * 1.5, 0.04, 0.12, 0.06), $o(e17, i10, n10, 2200, 0.8, 0.18, 0.01);
      break;
    }
    case `handdrum`:
      os(e17, i10, n10, 175, 140, 0.08, 0.8, 0.18), os(e17, i10, n10, 260, 235, 0.05, 0.25, 0.09), $o(e17, i10, n10, 2e3, 0.6, 0.18, 0.015, `lowpass`);
      break;
    case `triangle`:
      for (let [t11, r11] of [[1, 0.5], [1.003, 0.3], [2.03, 0.3], [3.11, 0.2], [4.18, 0.12]]) Qo(e17, i10, 1250 * t11, r11, n10, 1e-3, 1.1);
      $o(e17, i10, n10, 6e3, 0.6, 0.06, 4e-3);
      break;
    case `tambourine`:
      for (let [t11, r11] of [[0, 7200], [6e-3, 8400], [0.013, 6600], [0.021, 9100], [0.03, 7800]]) $o(e17, i10, n10 + t11, r11, 3, 0.45, 0.05);
      for (let t11 of [5200, 6150, 7300]) Qo(e17, i10, t11, 0.06, n10, 2e-3, 0.14);
      os(e17, i10, n10, 220, 190, 0.03, 0.15, 0.04);
      break;
    case `claves`:
      Qo(e17, i10, 2500, 0.8, n10, 1e-3, 0.045), Qo(e17, i10, 5100, 0.12, n10, 1e-3, 0.02);
      break;
    case `shaker`:
      $o(e17, i10, n10, 6e3, 1.2, 0.6, 0.05, `bandpass`, 0.025);
      break;
    case `woodblock`:
      Qo(e17, i10, 880, 0.7, n10, 1e-3, 0.05), Qo(e17, i10, 1760, 0.18, n10, 1e-3, 0.025), $o(e17, i10, n10, 3e3, 0.8, 0.2, 4e-3);
      break;
    case `cowbell`: {
      let t11 = e17.ctx.createBiquadFilter();
      t11.type = `bandpass`, t11.frequency.value = 2600, t11.Q.value = 0.7;
      let r11 = e17.ctx.createGain();
      r11.gain.setValueAtTime(0.5, n10), r11.gain.setTargetAtTime(0.15, n10, 0.02), r11.gain.setTargetAtTime(0, n10 + 0.05, 0.12), t11.connect(r11).connect(i10.out);
      for (let r12 of [540, 800]) {
        let a10 = e17.ctx.createOscillator();
        a10.type = `square`, a10.frequency.value = r12, a10.connect(t11), a10.start(n10), a10.stop(n10 + 1), i10.stops.push(a10);
      }
      i10.end = n10 + 1;
      break;
    }
  }
  return i10;
}
function ls(e17, t10 = {}) {
  let n10 = Ko();
  if (!n10) return;
  let r10 = Math.max(n10.ctx.currentTime + 3e-3, t10.when ?? 0);
  try {
    cs(n10, e17, r10, es(t10.vel ?? 0.9, 0.05, 1));
  } catch {
  }
}
var us = /* @__PURE__ */ new Map();
function ds(e17, t10) {
  let n10 = us.get(e17);
  if (n10) return n10;
  let r10 = Ko();
  return r10 ? (n10 = fetch(t10).then((e18) => e18.arrayBuffer()).then((e18) => new Promise((t11) => r10.ctx.decodeAudioData(e18, t11, () => t11(null)))).catch(() => null), us.set(e17, n10), n10) : Promise.resolve(null);
}
function fs(e17, t10) {
  Vr()?.state === `running` && ds(e17, t10);
}
function ps(e17, t10, n10 = {}) {
  let r10 = Ko();
  r10 && ds(e17, t10).then((e18) => {
    if (!e18) {
      new Audio(t10).play().catch(() => void 0);
      return;
    }
    let i10 = r10.ctx.createBufferSource();
    i10.buffer = e18;
    let a10 = r10.ctx.createGain();
    a10.gain.value = 0.9, i10.connect(a10).connect(r10.dry), i10.start(Math.max(r10.ctx.currentTime, n10.when ?? 0));
  });
}
function ms(e17, t10, n10 = {}) {
  let r10 = Ko();
  if (!r10) return null;
  let i10 = Math.max(r10.ctx.currentTime + 5e-3, n10.when ?? 0), a10 = es(n10.vel ?? 0.85, 0.05, 1), o10;
  try {
    Xo = n10.out ?? null, o10 = as(r10, e17, t10, i10, a10);
  } catch {
    return null;
  } finally {
    Xo = null;
  }
  let s10 = { v: o10.v, at: i10, release: o10.release };
  for (Jo.push(s10); Jo.length > Yo; ) {
    let e18 = Jo.shift(), t11 = r10.ctx.currentTime;
    e18.v.out.gain.setTargetAtTime(0, t11, 0.02);
    for (let n11 of e18.v.stops) n11.stop(t11 + 0.2);
  }
  return o10.v.stops[0]?.addEventListener(`ended`, () => {
    let e18 = Jo.indexOf(s10);
    e18 >= 0 && Jo.splice(e18, 1);
  }), { release: o10.release };
}
function hs() {
  let e17 = Go;
  if (!e17) return;
  let t10 = e17.ctx.currentTime;
  for (let e18 of Jo.splice(0)) {
    e18.v.out.gain.setTargetAtTime(0, t10, 0.03);
    for (let n10 of e18.v.stops) n10.stop(t10 + 0.3);
  }
}
function gs() {
  return Ko()?.ctx.currentTime ?? null;
}
function _s(e17, t10, n10) {
  let r10 = Ko();
  if (!r10) return;
  let i10 = Math.max(r10.ctx.currentTime + 2e-3, n10), a10 = { out: r10.ctx.createGain(), stops: [], end: i10 };
  a10.out.gain.value = t10 === 2 ? 1 : t10 === 1 ? 0.8 : 0.6, a10.out.connect(r10.metro);
  let o10 = t10 === 2 ? 1.5 : t10 === 1 ? 1.2 : 1;
  try {
    switch (e17) {
      case `click`:
        $o(r10, a10, i10, 3e3 * o10, 0.8, 0.9, 8e-3, `highpass`), Qo(r10, a10, 1200 * o10, 0.4, i10, 1e-3, 0.015);
        break;
      case `wood`:
        Qo(r10, a10, 900 * o10, 0.8, i10, 1e-3, 0.045), Qo(r10, a10, 1800 * o10, 0.2, i10, 1e-3, 0.02), $o(r10, a10, i10, 3e3, 0.8, 0.2, 4e-3);
        break;
      case `bell`:
        Qo(r10, a10, 1568 * o10, 0.5, i10, 1e-3, 0.2), Qo(r10, a10, 1568 * o10 * 2.76, 0.15, i10, 1e-3, 0.1);
        break;
      case `beep`: {
        let e18 = r10.ctx.createOscillator();
        e18.type = `sine`, e18.frequency.value = 880 * o10;
        let t11 = r10.ctx.createGain();
        t11.gain.setValueAtTime(0, i10), t11.gain.linearRampToValueAtTime(0.5, i10 + 4e-3), t11.gain.setValueAtTime(0.5, i10 + 0.05), t11.gain.linearRampToValueAtTime(0, i10 + 0.07), e18.connect(t11).connect(a10.out), e18.start(i10), e18.stop(i10 + 0.08);
        break;
      }
      case `cowbell`:
        a10.out.gain.value *= 0.8;
        for (let e18 of [540 * o10, 800 * o10]) Qo(r10, a10, e18, 0.25, i10, 1e-3, 0.08);
    }
  } catch {
  }
}
function ys() {
  let e17 = Ko();
  return e17 ? { ctx: e17.ctx, out: bs(e17), noise: e17.noise } : null;
}
function bs(e17) {
  let t10 = e17.ctx.createGain();
  t10.connect(e17.dry);
  let n10 = e17.ctx.createGain();
  return n10.gain.value = 0.25, t10.connect(n10).connect(e17.wet), t10;
}
function iee(e17) {
  let t10 = qo(e17);
  return { ctx: t10.ctx, noise: t10.noise, out: () => bs(t10), note: (e18, n10, r10, i10, a10, o10) => {
    try {
      Xo = o10 ?? null, as(t10, e18, n10, r10, es(i10, 0.05, 1)).release(r10 + a10);
    } catch {
    } finally {
      Xo = null;
    }
  } };
}
var xs = (e17) => Math.round(e17 * 10) / 10;
var Ss = `Andika, Andika, Verdana, Arial, sans-serif`;
var Cs = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
function ws(e17) {
  let t10 = parseInt(e17.slice(1), 16);
  return [t10 >> 16 & 255, t10 >> 8 & 255, t10 & 255];
}
var Ts = (e17) => {
  let [t10, n10, r10] = ws(e17);
  return 0.299 * t10 + 0.587 * n10 + 0.114 * r10 > 150 ? `#1f2937` : `#ffffff`;
};
var Es = (e17, t10) => `#` + ws(e17).map((e18) => Math.round(e18 * t10).toString(16).padStart(2, `0`)).join(``);
var Ds = (e17, t10, n10, r10, i10, a10) => `<rect x="${xs(e17)}" y="${xs(t10)}" width="${xs(Math.max(0, n10))}" height="${xs(Math.max(0, r10))}" rx="${xs(i10)}" ${a10}/>`;
var Os = (e17, t10, n10, r10, i10) => i10 ? `<text x="${xs(e17)}" y="${xs(t10)}" font-size="${xs(n10)}" font-family="${Ss}" font-weight="700" text-anchor="middle" fill="${r10}">${i10}</text>` : ``;
function ks(e17, t10, n10, r10 = ``) {
  return `<g class="lh-key${t10 ? ` is-off` : ``}" data-n="${e17}"${t10 ? ` data-off="1"` : ``}>${n10(true)}${n10(false)}${r10}</g>`;
}
var As = (e17, t10) => e17 ? `class="lh-kface" ${t10}` : `class="lh-kdown" fill="#000000" opacity="0"`;
var js = (e17, t10) => !t10 && Ao(e17);
var Ms = (e17, t10) => t10 ? [...new Set(t10)].sort((e18, t11) => e18 - t11) : jo(e17);
var Ns = (e17, t10) => Math.max(6, Math.min(e17, t10) * 0.035);
function Ps(e17, t10, n10, r10) {
  let i10 = js(e17, r10), a10 = i10 ? jo(e17) : Ms(e17, r10), o10 = (t11) => r10 ? r10.includes(t11) : So(e17, t11), s10 = i10 ? a10.filter((e18) => !Do(e18)) : a10, c10 = e17.skin === `synth`, l10 = Ns(t10, n10), u10 = n10 * (c10 ? 0.22 : 0.15), d10 = l10, f10 = u10, p10 = t10 - 2 * l10, m10 = n10 - u10 - l10, h10 = p10 / Math.max(1, s10.length), g10 = Math.max(1.5, h10 * 0.05), _10 = Ds(0, 0, t10, n10, Math.min(t10, n10) * 0.05, `fill="${c10 ? `#262a33` : `#1c1917`}"`);
  if (c10) {
    let e18 = u10 * 0.2;
    for (let t11 = 0; t11 < 4; t11++) {
      let n12 = l10 + e18 * 1.6 + t11 * e18 * 3.2, r12 = u10 * 0.5;
      _10 += `<circle cx="${xs(n12)}" cy="${xs(r12)}" r="${xs(e18)}" fill="#3b4150" stroke="#0f1115" stroke-width="${xs(e18 * 0.15)}"/><path d="M${xs(n12)} ${xs(r12)}L${xs(n12 + e18 * 0.6 * Math.cos(-2.2 + t11 * 0.9))} ${xs(r12 + e18 * 0.6 * Math.sin(-2.2 + t11 * 0.9))}" stroke="#e5e7eb" stroke-width="${xs(e18 * 0.16)}" stroke-linecap="round"/>`;
    }
    let n11 = Math.min(t10 * 0.3, u10 * 2.8), r11 = t10 - l10 - n11;
    _10 += Ds(r11, u10 * 0.2, n11, u10 * 0.6, u10 * 0.08, `fill="#0f3d2e" stroke="#0b1f18" stroke-width="2"`);
    for (let e19 = 0; e19 < 6; e19++) _10 += Ds(r11 + n11 * (0.1 + e19 * 0.14), u10 * (0.62 - 0.05 * (e19 * 7 % 5)), n11 * 0.08, u10 * (0.08 + 0.05 * (e19 * 7 % 5)), 1, `fill="#4ade80"`);
  } else _10 += Ds(d10, f10 - n10 * 0.02, p10, n10 * 0.02, 0, `fill="#b91c1c"`), _10 += Ds(t10 * 0.42, u10 * 0.38, t10 * 0.16, u10 * 0.16, u10 * 0.08, `fill="#3f3a36"`);
  if (!i10) return a10.forEach((t11, n11) => {
    let r11 = Do(t11), i11 = r11 ? `#2b3341` : e17.colors ? Oo(t11) : `#ffffff`, a11 = r11 && e17.colors, o11 = Math.min(h10 * 0.42, m10 * 0.13), s11 = d10 + n11 * h10 + g10 / 2, c11 = r11 ? ` stroke="#6b7280" stroke-width="${xs(Math.max(1.5, h10 * 0.035))}"` : ``;
    _10 += ks(t11, false, (e18) => Ds(s11, f10, h10 - g10, m10, h10 * 0.1, As(e18, `fill="${i11}"${c11}`)) + (a11 && e18 ? Ds(s11 + h10 * 0.1, f10 + m10 * 0.8, h10 * 0.8 - g10, m10 * 0.12, h10 * 0.08, `fill="${Oo(t11)}"`) : ``), Os(d10 + (n11 + 0.5) * h10, f10 + m10 * (a11 ? 0.74 : 1) - o11 * 0.6, o11, Ts(i11), Eo(e17, t11)));
  }), _10;
  s10.forEach((t11, n11) => {
    let r11 = !o10(t11), i11 = r11 ? `#c3c8d0` : e17.colors ? Oo(t11) : `#ffffff`, a11 = Math.min(h10 * 0.42, m10 * 0.13);
    _10 += ks(t11, r11, (e18) => Ds(d10 + n11 * h10 + g10 / 2, f10, h10 - g10, m10, h10 * 0.1, As(e18, `fill="${i11}"`)), Os(d10 + (n11 + 0.5) * h10, f10 + m10 - a11 * 0.6, a11, r11 ? `#7b828e` : Ts(i11), Eo(e17, t11)));
  });
  let v10 = h10 * 0.6, y10 = m10 * 0.62;
  return a10.forEach((t11) => {
    if (!Do(t11)) return;
    let n11 = s10.indexOf(t11 + 1);
    if (n11 <= 0) return;
    let r11 = !o10(t11), i11 = d10 + n11 * h10 - v10 / 2, a11 = e17.colors && !r11, c11 = Math.min(v10 * 0.4, y10 * 0.14);
    _10 += ks(t11, r11, (e18) => Ds(i11, f10, v10, y10, v10 * 0.12, As(e18, `fill="${r11 ? `#6b7280` : `#111827`}"`)) + (a11 && e18 ? Ds(i11 + v10 * 0.12, f10 + y10 * 0.76, v10 * 0.76, y10 * 0.16, v10 * 0.12, `fill="${Oo(t11)}"`) : ``), Os(i11 + v10 / 2, f10 + y10 * (a11 ? 0.7 : 0.9), c11, r11 ? `#cbd0d8` : `#ffffff`, Eo(e17, t11)));
  }), _10;
}
function Fs(e17, t10, n10, r10) {
  let i10 = r10 ?? jo(e17), a10 = i10.length, o10 = e17.skin === `glockenspiel`, s10 = t10 * 0.04, c10 = n10 * 0.07, l10 = (t10 - 2 * s10) / a10, u10 = l10 * 0.8, d10 = n10 - 2 * c10, f10 = d10 * 0.56, p10 = (e18) => a10 > 1 ? d10 - (d10 - f10) * e18 / (a10 - 1) : d10, m10 = (e18) => s10 + e18 * l10 + (l10 - u10) / 2, h10 = o10 ? Ds(0, 0, t10, n10, Math.min(t10, n10) * 0.06, `fill="#1e3a8a"`) : ``, g10 = o10 ? n10 * 0.05 : n10 * 0.07;
  for (let e18 of [-1, 1]) h10 += `<path d="M${xs(m10(0) - u10 * 0.3)} ${xs(n10 / 2 + e18 * p10(0) * 0.28)}L${xs(m10(a10 - 1) + u10 * 1.3)} ${xs(n10 / 2 + e18 * p10(a10 - 1) * 0.28)}" stroke="${o10 ? `#b91c1c` : `#7c4a21`}" stroke-width="${xs(g10)}" stroke-linecap="round"/>`;
  return i10.forEach((t11, r11) => {
    let i11 = m10(r11), a11 = p10(r11), s11 = n10 / 2 - a11 / 2, c11 = e17.colors ? Oo(t11) : o10 ? `#d9e0e8` : r11 % 2 ? `#d29654` : `#dca463`, l11 = (e18) => {
      let t12 = Ds(i11, s11, u10, a11, u10 * 0.16, As(e18, `fill="${c11}" stroke="${Es(c11, 0.62)}" stroke-width="${xs(Math.max(1.5, u10 * 0.04))}"`));
      if (!e18) return t12;
      t12 += o10 ? Ds(i11 + u10 * 0.16, s11 + a11 * 0.05, u10 * 0.13, a11 * 0.9, u10 * 0.06, `fill="#ffffff" opacity="0.55"`) : `<path d="M${xs(i11 + u10 * 0.36)} ${xs(s11 + a11 * 0.08)}V${xs(s11 + a11 * 0.92)}M${xs(i11 + u10 * 0.64)} ${xs(s11 + a11 * 0.08)}V${xs(s11 + a11 * 0.92)}" stroke="${Es(c11, 0.85)}" stroke-width="${xs(u10 * 0.03)}" opacity="0.6"/>`;
      for (let e19 of [0.22, 0.78]) t12 += `<circle cx="${xs(i11 + u10 / 2)}" cy="${xs(s11 + a11 * e19)}" r="${xs(u10 * 0.07)}" fill="${o10 ? `#6b7280` : `#5c3d1e`}"/>`;
      return t12;
    }, d11 = Math.min(u10 * 0.48, a11 * 0.2);
    h10 += ks(t11, false, l11, Os(i11 + u10 / 2, s11 + a11 * 0.62 + d11 * 0.35, d11, Ts(c11), Eo(e17, t11)));
  }), h10;
}
var Is = (e17, t10) => Math.min(e17 * 0.72, t10 * 0.7);
function Ls(e17, t10, n10, r10) {
  let i10 = r10 ?? jo(e17), a10 = i10.length, o10 = t10 * 0.03, s10 = (t10 - 2 * o10) / a10, c10 = Is(s10, n10), l10 = n10 * 0.97, u10 = n10 * 0.94, d10 = n10 * 0.48, f10 = ``;
  return i10.forEach((t11, n11) => {
    let r11 = a10 > 1 ? u10 - (u10 - d10) * n11 / (a10 - 1) : u10, i11 = o10 + n11 * s10 + (s10 - c10) / 2, p10 = l10 - r11, m10 = e17.colors ? Oo(t11) : `#4dabf7`, h10 = (e18) => {
      let t12 = Ds(i11, p10, c10, r11, c10 * 0.2, As(e18, `fill="${m10}" stroke="${Es(m10, 0.68)}" stroke-width="${xs(Math.max(1.5, c10 * 0.05))}"`));
      if (!e18) return t12;
      let n12 = Math.min(c10 * 0.24, r11 * 0.16);
      return t12 += Ds(i11, p10, c10, n12, Math.min(c10 * 0.12, n12 / 2), `fill="${Es(m10, 0.75)}"`), t12 += Ds(i11 + c10 * 0.16, p10 + n12 + r11 * 0.08, c10 * 0.14, Math.max(0, r11 - n12 - r11 * 0.22), c10 * 0.07, `fill="#ffffff" opacity="0.35"`), t12;
    }, g10 = Math.min(c10 * 0.5, 44, r11 * 0.34);
    f10 += ks(t11, false, h10, Os(i11 + c10 / 2, l10 - Math.min(c10 * 0.38, r11 * 0.22), g10, Ts(m10), Eo(e17, t11)));
  }), f10;
}
function Rs(e17, t10, n10, r10) {
  let i10 = /* @__PURE__ */ new Map();
  if (e17.skin === `piano` || e17.skin === `synth`) {
    let a11 = Ns(t10, n10);
    if (!js(e17, r10)) {
      let n11 = Ms(e17, r10), o12 = (t10 - 2 * a11) / Math.max(1, n11.length);
      return n11.forEach((e18, t11) => i10.set(e18, { x: a11 + (t11 + 0.5) * o12, w: o12 })), i10;
    }
    let o11 = jo(e17), s11 = o11.filter((e18) => !Do(e18)), c10 = (t10 - 2 * a11) / s11.length;
    return s11.forEach((e18, t11) => i10.set(e18, { x: a11 + (t11 + 0.5) * c10, w: c10 })), o11.forEach((e18) => {
      let t11 = s11.indexOf(e18 + 1);
      Do(e18) && t11 > 0 && i10.set(e18, { x: a11 + t11 * c10, w: c10 * 0.6 });
    }), i10;
  }
  let a10 = r10 ?? jo(e17), o10 = t10 * (e17.skin === `tubes` ? 0.03 : 0.04), s10 = (t10 - 2 * o10) / a10.length;
  return a10.forEach((t11, r11) => i10.set(t11, { x: o10 + (r11 + 0.5) * s10, w: e17.skin === `tubes` ? Is(s10, n10) : s10 * 0.8 })), i10;
}
function zs(e17, t10, n10, r10) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t10} ${n10}" width="${t10}" height="${n10}">${e17.skin === `piano` || e17.skin === `synth` ? Ps(e17, t10, n10, r10) : e17.skin === `tubes` ? Ls(e17, t10, n10, r10) : Fs(e17, t10, n10, r10)}</svg>`;
}
var Bs = /* @__PURE__ */ new WeakMap();
function Vs(e17, t10, n10, r10) {
  let i10 = t10.inst ?? po, a10 = Math.max(1, Math.round(t10.w)), o10 = Math.max(1, Math.round(t10.h));
  Bs.set(e17, t10);
  let s10 = `${JSON.stringify(i10)}|${a10}x${o10}|${n10}`;
  if (e17.dataset.k === s10) return;
  e17.dataset.k = s10, e17.classList.add(`lh-instrument`), e17.setAttribute(`aria-label`, Po(i10));
  let c10 = zs(i10, a10, o10);
  if (n10) {
    let n11 = document.createElement(`div`);
    n11.className = `lh-wg-pic`, n11.innerHTML = c10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(n11), t10.locked && e17.classList.add(`is-armed`), Si(e17, { slide: true, hit: (t11) => t11.hasAttribute(`data-off`) ? null : ms((Bs.get(e17)?.inst ?? po).voice, Number(t11.getAttribute(`data-n`))) });
    return;
  }
  let l10 = document.createElement(`img`);
  l10.className = `lh-wg-pic`, l10.alt = ``, l10.draggable = false, l10.src = r10 ? r10(c10) : Cs(c10), l10.style.width = `${a10}px`, l10.style.height = `${o10}px`, e17.replaceChildren(l10);
}
function Hs() {
  return typeof window < `u` && `speechSynthesis` in window && typeof SpeechSynthesisUtterance < `u`;
}
var Us = 0.95;
var Ws = 180;
var Gs = null;
var Ks = null;
var Ys = 0;
var Xs;
var Zs = /* @__PURE__ */ new Set();
function Qs(e17) {
  let t10 = e17.lang.replace(`_`, `-`).toLowerCase(), n10 = 0;
  return t10 === `de-de` ? n10 += 8 : t10.startsWith(`de`) && (n10 += 4), typeof navigator < `u` && navigator.onLine === false && !e17.localService && (n10 -= 10), /natural|premium|enhanced|neural/i.test(e17.name) && (n10 += 3), /google|anna|petra|helena|katja|marlene|vicki/i.test(e17.name) && (n10 += 1), e17.default && (n10 += 1), n10;
}
function $s(e17) {
  let t10 = e17.filter((e18) => /^de([-_]|$)/i.test(e18.lang));
  return t10.length ? t10.sort((e18, t11) => Qs(t11) - Qs(e18))[0] : null;
}
function ec() {
  if (Xs !== void 0) return Xs;
  let e17 = window.speechSynthesis.getVoices();
  return e17.length && (Xs = $s(e17)), Xs ?? null;
}
function rc() {
  if (Xs !== void 0) return Promise.resolve(Xs);
  let e17 = window.speechSynthesis, t10 = e17.getVoices();
  return t10.length ? (Xs = $s(t10), Promise.resolve(Xs)) : new Promise((t11) => {
    let n10 = false, r10 = () => {
      if (n10) return;
      n10 = true, e17.removeEventListener?.(`voiceschanged`, i10);
      let r11 = e17.getVoices(), a10 = $s(r11);
      r11.length && (Xs = a10), t11(a10);
    }, i10 = () => {
      e17.getVoices().length && r10();
    };
    e17.addEventListener?.(`voiceschanged`, i10), setTimeout(r10, 1500);
  });
}
function ic(e17) {
  let t10 = e17.replace(/\s+/g, ` `).trim();
  if (!t10) return [];
  let n10 = t10.match(/[^.!?…;:]+[.!?…;:]*["»«“”')\]]*\s*/g) ?? [t10], r10 = [], i10 = ``, a10 = (e18) => {
    let t11 = e18.trim();
    t11 && r10.push(t11);
  };
  for (let e18 of n10) if (e18.length > Ws) {
    a10(i10), i10 = ``;
    let t11 = e18;
    for (; t11.length > Ws; ) {
      let e19 = t11.slice(0, Ws), n11 = Math.max(e19.lastIndexOf(`, `), e19.lastIndexOf(` \u2013 `));
      n11 < Ws / 3 && (n11 = e19.lastIndexOf(` `)), n11 < Ws / 3 && (n11 = Ws), a10(t11.slice(0, n11 + 1)), t11 = t11.slice(n11 + 1);
    }
    i10 = t11;
  } else i10.length + e18.length > Ws ? (a10(i10), i10 = e18) : i10 += e18;
  return a10(i10), r10;
}
var ac;
function oc() {
  return ac ?? (uc() ? true : void 0);
}
var sc = 2500;
var cc = (e17 = {}) => Math.min(3, Math.max(0.3, Us * (e17.style ?? to()).rate * (e17.rate ?? 1)));
function lc(e17, t10, n10 = {}) {
  let r10 = Hs() && (window.speechSynthesis.speaking || window.speechSynthesis.pending), i10 = n10.part ? null : Fr(`speech`, dc);
  dc();
  let a10 = ++Ys;
  return new Promise((o10) => {
    let s10 = false, c10 = () => {
    }, l10 = () => {
      s10 || (s10 = true, Gs === c10 && (Gs = null), i10?.release(), o10());
    };
    if (t10 && typeof Audio < `u`) {
      Ks ??= new Audio();
      let e18 = Xr(Ks, t10, { onStart: () => a10 === Ys && n10.onVoice?.(), onEnd: () => l10() });
      c10 = () => e18.stop(), Gs = c10;
      return;
    }
    if (t10) {
      l10();
      return;
    }
    let u10 = n10.style ?? to();
    e17 = no(e17, u10.tone);
    let d10 = ic(e17), f10 = e17.replace(/\s+/g, ` `).trim(), p10 = [], m10 = 0;
    for (let e18 of d10) {
      let t11 = f10.indexOf(e18, m10);
      p10.push(t11 < 0 ? m10 : t11), m10 = (t11 < 0 ? m10 : t11) + e18.length;
    }
    if (!Hs() || !d10.length) {
      l10();
      return;
    }
    let h10 = window.speechSynthesis, g10 = 0, _10 = 0;
    c10 = () => {
      clearTimeout(g10), clearTimeout(_10), h10.cancel(), Zs.clear(), l10();
    }, Gs = c10;
    let v10 = false, y10 = () => {
      clearTimeout(_10), v10 || a10 !== Ys || (v10 = true, n10.onVoice?.());
    }, b10 = (e18) => {
      let t11 = 0, r11 = () => {
        if (clearTimeout(g10), s10 || a10 !== Ys) return;
        if (t11 >= d10.length) {
          l10();
          return;
        }
        let i11 = p10[t11], o11 = d10[t11++], f11 = new SpeechSynthesisUtterance(o11);
        f11.lang = e18?.lang ?? `de-DE`, e18 && (f11.voice = e18), f11.rate = cc(n10), f11.pitch = Math.min(2, Math.max(0.1, u10.pitch * (n10.pitch ?? 1)));
        let m11 = false;
        f11.onstart = () => {
          a10 === Ys && (n10.onPart?.(i11, o11.length, `start`), oc() === true ? v10 || (_10 = window.setTimeout(y10, sc)) : y10());
        }, f11.onboundary = (e19) => {
          a10 !== Ys || e19.name && e19.name !== `word` || (m11 = true, ac = true, y10(), n10.onBoundary?.(i11 + e19.charIndex));
        };
        let b11 = false, x10 = (e19) => {
          b11 || (b11 = true, Zs.delete(f11), e19 && !m11 && a10 === Ys && /\S\s+\S/.test(o11) && (ac = false), a10 === Ys && n10.onPart?.(i11, o11.length, `end`), r11());
        };
        f11.onend = () => x10(true), f11.onerror = (e19) => {
          Zs.delete(f11), b11 || (b11 = true, a10 !== Ys || e19.error === `interrupted` || e19.error === `canceled` ? l10() : c10());
        }, Zs.add(f11), g10 = window.setTimeout(() => x10(false), 4e3 + o11.length * 160), h10.speak(f11), h10.paused && h10.resume();
      };
      r11();
    };
    if (uc()) r10 ? setTimeout(() => !s10 && a10 === Ys && b10(null), 80) : b10(null);
    else {
      if (!r10) {
        let e18 = ec();
        if (e18 || Xs === null) {
          b10(e18), Xs === void 0 && rc();
          return;
        }
      }
      rc().then((e18) => {
        s10 || a10 !== Ys || (r10 ? setTimeout(() => !s10 && a10 === Ys && b10(e18), 80) : b10(e18));
      });
    }
  });
}
function uc() {
  let e17 = typeof navigator < `u` ? navigator.userAgent : ``;
  return /iPad|iPhone|iPod/.test(e17) || /Macintosh/.test(e17) && `ontouchend` in document || /Safari/.test(e17) && !/Chrome|Chromium|Edg|Firefox/.test(e17);
}
function dc() {
  Ys++;
  let e17 = Gs;
  Gs = null, e17?.();
}
var pc = { g: 55, C: 60, D: 62, E: 64, F: 65, G: 67, A: 69, H: 71, c: 72 };
function mc(e17) {
  return e17.trim().split(/\s+/).map((e18) => {
    let t10 = /^([gCDEFGAHc-])([\d.]*)$/.exec(e18);
    if (!t10) throw Error(`bad note ${e18}`);
    return [t10[1] === `-` ? null : pc[t10[1]], t10[2] ? Number(t10[2]) : 1];
  });
}
var hc = [{ id: `entchen`, title: `Alle meine Entchen`, bpm: 100, notes: mc(`C D E F G2 G2 A A A A G4 A A A A G4 F F F F E2 E2 D D D D C4`) }, { id: `haenschen`, title: `H\xE4nschen klein`, bpm: 100, notes: mc(`G E E2 F D D2 C D E F G G G2 G E E2 F D D2 C E G G C4 D D D D D E F2 E E E E E F G2 G E E2 F D D2 C E G G C4`) }, { id: `jakob`, title: `Bruder Jakob`, bpm: 100, notes: mc(`C D E C C D E C E F G2 E F G2 G.5 A.5 G.5 F.5 E C G.5 A.5 G.5 F.5 E C C g C2 C g C2`) }, { id: `weihnachtsmann`, title: `Morgen kommt der Weihnachtsmann`, bpm: 100, notes: mc(`C C G G A A G2 F F E E D D C2 G G F F E E D2 G G F F E E D2 C C G G A A G2 F F E E D D C2`) }, { id: `freude`, title: `Ode an die Freude`, bpm: 100, notes: mc(`E E F G G F E D C C D E E1.5 D.5 D2 E E F G G F E D C C D E D1.5 C.5 C2`) }, { id: `jingle`, title: `Jingle Bells`, bpm: 120, notes: mc(`E E E2 E E E2 E G C D E4 F F F F F E E E E D D E D2 G2 E E E2 E E E2 E G C D E4 F F F F F E E E G G F D C4`) }, { id: `mary`, title: `Mary Had a Little Lamb`, bpm: 110, notes: mc(`E D C D E E E2 D D D2 E G G2 E D C D E E E E D D E D C4`) }, { id: `scale`, title: `Tonleiter (C-Dur)`, bpm: 90, notes: mc(`C D E F G A H c2 c H A G F E D C2`) }];
var gc = (e17) => hc.find((t10) => t10.id === e17) ?? hc[0];
var _c = (e17) => [...new Set(e17.notes.map((e18) => e18[0]).filter((e18) => e18 !== null))].sort((e18, t10) => e18 - t10);
function vc(e17) {
  let t10 = new DataView(e17), n10 = 0, r10 = (e18) => {
    let r11 = ``;
    for (let i11 = 0; i11 < e18; i11++) r11 += String.fromCharCode(t10.getUint8(n10 + i11));
    return n10 += e18, r11;
  }, i10 = () => t10.getUint8(n10++), a10 = () => {
    let e18 = t10.getUint16(n10);
    return n10 += 2, e18;
  }, o10 = () => {
    let e18 = t10.getUint32(n10);
    return n10 += 4, e18;
  }, s10 = () => {
    let e18 = 0;
    for (let t11 = 0; t11 < 4; t11++) {
      let t12 = i10();
      if (e18 = e18 << 7 | t12 & 127, !(t12 & 128)) break;
    }
    return e18;
  };
  if (r10(4) !== `MThd`) throw Error(`Das ist keine MIDI-Datei.`);
  let c10 = o10();
  a10();
  let l10 = a10(), u10 = a10();
  n10 += c10 - 6;
  let d10 = u10 & 32768 ? 480 : u10 || 480, f10 = 5e5, p10 = false, m10 = [];
  for (let e18 = 0; e18 < l10 && n10 + 8 <= t10.byteLength; e18++) {
    let e19 = r10(4), a11 = o10(), c11 = Math.min(t10.byteLength, n10 + a11);
    if (e19 !== `MTrk`) {
      n10 = c11;
      continue;
    }
    let l11 = 0, u11 = 0, d11 = ``, h10 = /* @__PURE__ */ new Map(), g10 = [], _10 = (e20, t11) => {
      let n11 = e20 * 128 + t11, r11 = h10.get(n11);
      r11 !== void 0 && (h10.delete(n11), e20 !== 9 && g10.push({ tick: r11, dur: Math.max(1, l11 - r11), m: t11 }));
    };
    for (; n10 < c11; ) {
      l11 += s10();
      let e20 = i10();
      e20 < 128 ? (n10--, e20 = u11) : e20 < 240 && (u11 = e20);
      let a12 = e20 & 240, o11 = e20 & 15;
      if (e20 === 255) {
        let e21 = i10(), a13 = s10();
        e21 === 3 && !d11 ? d11 = r10(a13) : e21 === 81 && a13 === 3 && !p10 ? (f10 = t10.getUint8(n10) << 16 | t10.getUint8(n10 + 1) << 8 | t10.getUint8(n10 + 2), p10 = true, n10 += 3) : n10 += a13;
      } else if (e20 === 240 || e20 === 247) n10 += s10();
      else if (a12 === 144) {
        let e21 = i10();
        i10() === 0 ? _10(o11, e21) : (_10(o11, e21), h10.set(o11 * 128 + e21, l11));
      } else if (a12 === 128) {
        let e21 = i10();
        i10(), _10(o11, e21);
      } else n10 += a12 === 192 || a12 === 208 ? 1 : 2;
    }
    n10 = c11, m10.push({ name: d11.trim(), notes: g10.sort((e20, t11) => e20.tick - t11.tick || t11.m - e20.m) });
  }
  return { ppq: d10, tempo: f10, tracks: m10 };
}
function yc(e17) {
  let t10 = -1, n10 = -1 / 0;
  return e17.tracks.forEach((e18, r10) => {
    if (e18.notes.length < 4) return;
    let i10 = e18.notes.reduce((e19, t11) => e19 + t11.m, 0) / e18.notes.length + Math.min(20, e18.notes.length / 10);
    i10 > n10 && (n10 = i10, t10 = r10);
  }), t10;
}
var bc = (e17) => Math.round(e17 * 4) / 4;
function xc(e17, t10, n10) {
  let r10 = e17.tracks[t10];
  if (!r10?.notes.length) return null;
  let i10 = /* @__PURE__ */ new Map();
  for (let t11 of r10.notes) {
    let n11 = bc(t11.tick / e17.ppq), r11 = i10.get(n11);
    (!r11 || t11.m > r11.m) && i10.set(n11, t11);
  }
  let a10 = [...i10.keys()].sort((e18, t11) => e18 - t11).slice(0, 600), o10 = a10.map((e18) => i10.get(e18).m).sort((e18, t11) => e18 - t11), s10 = o10[Math.floor(o10.length / 2)], c10 = (e18) => {
    let t11 = e18;
    for (; t11 > s10 + 12; ) t11 -= 12;
    for (; t11 < s10 - 12; ) t11 += 12;
    return t11;
  }, l10 = o10[o10.length - 1] - o10[0] > 24, u10 = [], d10 = a10[0] ?? 0;
  return a10.forEach((t11, n11) => {
    t11 > d10 && u10.push([null, bc(t11 - d10)]);
    let r11 = i10.get(t11), o11 = a10[n11 + 1] ?? t11 + r11.dur / e17.ppq, s11 = Math.max(0.25, Math.min(bc(r11.dur / e17.ppq) || 0.25, bc(o11 - t11) || 0.25));
    u10.push([l10 ? c10(r11.m) : r11.m, s11]), d10 = t11 + s11;
  }), { id: `custom`, title: n10.slice(0, 60) || `Eigenes Lied`, bpm: Math.round(Math.min(240, Math.max(30, 6e7 / e17.tempo))), notes: u10 };
}
var Cc = { tones: 3, speed: `mid`, start: 1, voice: true };
var wc = [{ n: 3, label: `3 T\xF6ne (C E G)`, steps: [0, 4, 7] }, { n: 4, label: `4 T\xF6ne (C D E G)`, steps: [0, 2, 4, 7] }, { n: 5, label: `5 T\xF6ne (Pentatonik)`, steps: [0, 2, 4, 7, 9] }, { n: 6, label: `6 T\xF6ne (C bis A)`, steps: [0, 2, 4, 5, 7, 9] }, { n: 8, label: `8 T\xF6ne (Tonleiter)`, steps: [0, 2, 4, 5, 7, 9, 11, 12] }];
var Tc = { slow: 950, mid: 700, fast: 480 };
function Dc(e17) {
  return e17.song ? e17.song === `custom` ? e17.custom ?? null : gc(e17.song) : null;
}
var Oc = (e17) => e17.notes.map((e18) => e18[0]).filter((e18) => e18 !== null);
function kc(e17, t10) {
  let n10 = Dc(t10);
  return n10 ? _c(n10) : Ac(e17, t10.tones);
}
function Ac(e17, t10) {
  let n10 = 12 * (e17.octave + 1) + e17.root;
  return (wc.find((e18) => e18.n === t10) ?? wc[0]).steps.map((e18) => n10 + e18);
}
var jc = `Andika, Andika, Verdana, Arial, sans-serif`;
var Mc = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var Nc = (e17) => e17.inst ?? _o(`xylophone`);
var Pc = (e17) => e17.echo ?? Cc;
function aee(e17, t10, n10) {
  let r10 = Nc(e17), i10 = kc(r10, Pc(e17)), a10 = Math.min(1300, i10.length * 170 + 120), o10 = zs(r10, a10, 515, i10).replace(`<svg `, `<svg x="${(1300 - a10) / 2}" y="200" `);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 720" width="${t10}" height="${n10}"><rect x="0" y="0" width="1300" height="176" rx="40" fill="#ffffff" opacity="0.94" stroke="#dee2e6" stroke-width="3"/><g class="lh-key" data-a="start"><circle cx="100" cy="88" r="64" fill="#2f9e44"/><path d="M82 56L130 88L82 120Z" fill="#ffffff"/><circle class="lh-kdown" cx="100" cy="88" r="64" fill="#000000" opacity="0"/><title>Start</title></g><text class="lh-echo-msg" x="560" y="84" font-size="54" font-family="${jc}" font-weight="700" text-anchor="middle" fill="#343a40">Tippe auf \u25B6</text><g class="lh-echo-dots"></g><g class="lh-key" data-a="repeat"><circle cx="1000" cy="88" r="50" fill="#1c7ed6"/><path d="M978 98a24 24 0 1 0 6-24" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/><path d="M972 58l12 18-21 3z" fill="#ffffff"/><circle class="lh-kdown" cx="1000" cy="88" r="50" fill="#000000" opacity="0"/><title>Nochmal h\xF6ren</title></g><text class="lh-echo-round" x="1180" y="74" font-size="30" font-family="${jc}" font-weight="700" text-anchor="middle" fill="#495057">Runde \u2013</text><text class="lh-echo-best" x="1180" y="122" font-size="26" font-family="${jc}" font-weight="700" text-anchor="middle" fill="#e67700">\u2605 Rekord 0</text>` + o10 + `</svg>`;
}
var Fc = /* @__PURE__ */ new Map();
var Ic = (e17) => {
  let t10 = Fc.get(e17);
  return t10 || Fc.set(e17, t10 = { phase: `idle`, seq: [], input: 0, round: 0, best: 0, token: 0 }), t10;
};
var Lc = /* @__PURE__ */ new Map();
var Rc = /* @__PURE__ */ new Map();
var zc = /* @__PURE__ */ new Map();
var Bc = { idle: `Tippe auf \u25B6`, listen: `H\xF6r zu \u2026`, turn: `Jetzt du!`, good: `Super!`, oops: `H\xF6r noch einmal`, done: `Das ganze Lied!` };
function Vc(e17) {
  let t10 = Ic(e17);
  for (let n10 of Lc.get(e17) ?? []) {
    let e18 = n10.querySelector(`.lh-echo-msg`);
    e18 && (e18.textContent = Bc[t10.phase], e18.setAttribute(`fill`, t10.phase === `good` || t10.phase === `done` ? `#2f9e44` : t10.phase === `oops` ? `#e8590c` : `#343a40`));
    let r10 = n10.querySelector(`.lh-echo-round`);
    r10 && (r10.textContent = t10.round ? `Runde ${t10.round}` : `Runde \u2013`);
    let i10 = n10.querySelector(`.lh-echo-best`);
    i10 && (i10.textContent = `\u2605 Rekord ${t10.best}`);
    let a10 = n10.querySelector(`.lh-echo-dots`);
    if (a10) {
      let e19 = t10.seq.length, n11 = Math.min(40, 600 / Math.max(1, e19)), r11 = Math.min(14, n11 * 0.38);
      a10.innerHTML = t10.seq.map((i11, a11) => {
        let o10 = 560 + (a11 - (e19 - 1) / 2) * n11, s10 = t10.phase === `done` || (t10.phase === `turn` || t10.phase === `oops` || t10.phase === `good`) && a11 < t10.input;
        return `<circle cx="${o10.toFixed(1)}" cy="138" r="${r11.toFixed(1)}" fill="${s10 ? `#40c057` : `#e9ecef`}" stroke="#adb5bd" stroke-width="2"/>`;
      }).join(``);
    }
  }
}
function Hc(e17, t10, n10, r10) {
  for (let i10 of Lc.get(e17) ?? []) i10.querySelectorAll(`.lh-key[data-n="${t10}"]`).forEach((e18) => {
    e18.classList.add(n10), setTimeout(() => e18.classList.remove(n10), r10);
  });
}
var Uc = (e17) => new Promise((t10) => setTimeout(t10, e17));
async function Wc(e17, t10) {
  Pc(e17).voice && await Promise.race([lc(t10), Uc(2500)]);
}
function Gc(e17, t10) {
  let n10 = t10.length, r10 = n10 >= 2 && t10[n10 - 1] === t10[n10 - 2] ? t10[n10 - 1] : null, i10 = e17.filter((e18) => e18 !== r10);
  return i10[Math.floor(Math.random() * i10.length)];
}
async function Kc(e17) {
  let t10 = Rc.get(e17);
  if (!t10) return;
  let n10 = Ic(e17), r10 = ++n10.token;
  if (n10.phase = `listen`, n10.input = 0, Vc(e17), await Wc(t10, `H\xF6r zu!`), n10.token !== r10) return;
  await Uc(250);
  let i10 = Tc[Pc(t10).speed], a10 = Nc(t10).voice;
  for (let t11 of n10.seq) {
    if (n10.token !== r10) return;
    let o10 = ms(a10, t11);
    Hc(e17, t11, `is-lit`, i10 * 0.7), await Uc(i10 * 0.7), o10?.release(), await Uc(i10 * 0.3);
  }
  n10.token === r10 && (n10.phase = `turn`, Vc(e17), Wc(t10, `Jetzt du!`));
}
function qc(e17) {
  let t10 = Rc.get(e17);
  if (!t10) return;
  dc();
  let n10 = Ic(e17), r10 = Dc(Pc(t10)), i10 = kc(Nc(t10), Pc(t10));
  if (n10.seq = [], r10) n10.seq = Oc(r10).slice(0, Pc(t10).start);
  else for (let e18 = 0; e18 < Pc(t10).start; e18++) n10.seq.push(Gc(i10, n10.seq));
  n10.round = 1, Kc(e17);
}
function Jc(e17, t10) {
  let n10 = Rc.get(e17), r10 = Ic(e17);
  if (!n10 || r10.phase !== `turn`) return;
  if (t10 === r10.seq[r10.input]) {
    if (r10.input++, Vc(e17), r10.input < r10.seq.length) return;
    let t11 = ++r10.token;
    r10.phase = `good`, r10.best = Math.max(r10.best, r10.seq.length), Vc(e17), setTimeout(() => {
      vi(), Wc(n10, `Super!`);
    }, 350);
    let i11 = Dc(Pc(n10));
    if (i11 && r10.seq.length >= Oc(i11).length) {
      setTimeout(() => {
        r10.token === t11 && (r10.phase = `done`, Vc(e17), Wc(n10, `Das ganze Lied! Toll gemacht.`));
      }, 1200);
      return;
    }
    setTimeout(() => {
      r10.token === t11 && (r10.seq.push(i11 ? Oc(i11)[r10.seq.length] : Gc(kc(Nc(n10), Pc(n10)), r10.seq)), r10.round++, Kc(e17));
    }, 1700);
    return;
  }
  let i10 = ++r10.token;
  r10.phase = `oops`, Hc(e17, t10, `is-wrong`, 700), Vc(e17), setTimeout(() => {
    yi(), Wc(n10, `H\xF6r noch einmal.`);
  }, 250), setTimeout(() => r10.token === i10 && void Kc(e17), 1800);
}
function Yc(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h));
  n10 && Rc.set(t10.id, t10);
  let o10 = `${i10}x${a10}|${n10}|${JSON.stringify(t10.inst)}|${JSON.stringify(t10.echo)}`;
  if (e17.dataset.k === o10) return;
  e17.dataset.k = o10, e17.setAttribute(`aria-label`, `H\xF6r zu \u2013 spiel nach: ein Tonfolgen-Spiel`);
  let s10 = aee(t10, i10, a10);
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(s10) : Mc(s10), t11.style.width = `${i10}px`, t11.style.height = `${a10}px`, e17.replaceChildren(t11);
    return;
  }
  let c10 = document.createElement(`div`);
  c10.className = `lh-wg-pic`, c10.innerHTML = s10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(c10), t10.locked && e17.classList.add(`is-armed`);
  let l10 = Lc.get(t10.id);
  l10 || Lc.set(t10.id, l10 = /* @__PURE__ */ new Set());
  for (let e18 of l10) e18.isConnected || l10.delete(e18);
  l10.add(e17);
  let u10 = `${JSON.stringify(t10.inst)}|${JSON.stringify(t10.echo)}`, d10 = zc.get(t10.id);
  if (d10 !== void 0 && d10 !== u10) {
    let e18 = Ic(t10.id);
    e18.token++, e18.phase = `idle`, e18.seq = [], e18.round = 0;
  }
  zc.set(t10.id, u10), Vc(t10.id), Si(e17, { slide: false, hit: (e18) => {
    let n11 = t10.id, r11 = e18.getAttribute(`data-a`);
    if (r11 === `start`) return qc(n11), null;
    if (r11 === `repeat`) {
      let e19 = Ic(n11);
      return e19.seq.length && e19.phase !== `listen` && Kc(n11), null;
    }
    let i11 = e18.getAttribute(`data-n`);
    if (i11 === null || e18.hasAttribute(`data-off`)) return null;
    let a11 = ms(Nc(Rc.get(n11) ?? t10).voice, Number(i11));
    return Jc(n11, Number(i11)), a11;
  } });
}
var Zc = `
.lh-wg-echo .lh-key.is-lit .lh-kdown{fill:#ffffff;opacity:.55}
.lh-wg-echo .lh-key.is-wrong .lh-kdown{fill:#e03131;opacity:.55}`;
var Qc = [`#e03131`, `#f08c00`, `#2f9e44`, `#1c7ed6`, `#7048e8`, `#e64980`, `#0ca678`, `#495057`];
var $c = (e17, t10) => e17.label || (e17.drum ? Fo[e17.drum] : e17.note === void 0 ? e17.rec ? `Aufnahme` : `` : t10 ? To(t10, e17.note) : yo(e17.note));
var el = (e17, t10) => Array.from({ length: e17 }, (e18, n10) => t10.includes(n10));
function tl(e17, t10, n10 = 16, r10 = []) {
  return { label: ``, color: Qc[t10 % Qc.length], drum: e17, steps: el(n10, r10) };
}
var il = [0, 2, 4, 6, 8, 10, 12, 14];
var al = [2, 6, 10, 14];
var ol = [0, 4, 8, 12];
var sl = Array.from({ length: 16 }, (e17, t10) => t10);
var cl = [{ id: `rock`, label: `Rock`, bpm: 100, color: `#e03131`, hits: { kick: [0, 8, 10], snare: [4, 12], hihat: il, crash: [0] } }, { id: `pop`, label: `Pop`, bpm: 104, color: `#e64980`, hits: { kick: [0, 6, 8], snare: [4, 12], clap: [12], hihat: il } }, { id: `disco`, label: `Disco`, bpm: 118, color: `#7048e8`, hits: { kick: ol, snare: [4, 12], clap: [4, 12], hihat: al, hihatOpen: al } }, { id: `hiphop`, label: `Hip-Hop`, bpm: 88, color: `#495057`, hits: { kick: [0, 7, 10], snare: [4, 12], clap: [12], hihat: il } }, { id: `funk`, label: `Funk`, bpm: 100, color: `#f08c00`, hits: { kick: [0, 3, 6, 10], snare: [4, 7, 12], hihat: sl, cowbell: [2, 10] } }, { id: `reggae`, label: `Reggae`, bpm: 76, color: `#2f9e44`, hits: { kick: [8], snare: [8], hihat: al, cowbell: [4, 12] } }, { id: `bossa`, label: `Bossa Nova`, bpm: 128, color: `#0ca678`, hits: { kick: [0, 3, 8, 11], clap: [0, 6, 12], hihat: il } }, { id: `samba`, label: `Samba`, bpm: 100, color: `#fab005`, hits: { kick: ol, snare: [2, 10], hihat: sl, cowbell: [0, 3, 6, 8, 11, 14] } }, { id: `march`, label: `Marsch`, bpm: 112, color: `#1c7ed6`, hits: { kick: [0, 8], snare: [4, 6, 12, 14], crash: [0], cowbell: ol } }, { id: `techno`, label: `Techno`, bpm: 126, color: `#15aabf`, hits: { kick: ol, clap: [4, 12], hihat: al, cowbell: [3, 11], crash: [0] } }];
var ll = (e17) => Math.random() < e17;
var ul = (e17) => e17[Math.floor(Math.random() * e17.length)];
var dl = [`kick`, `cajonBass`, `floortom`, `congaLow`, `bongoLow`, `handdrum`];
var fl = [`snare`, `clap`, `cajonSlap`];
var pl = [`hihat`, `shaker`, `tambourine`, `ride`];
var ml = [`crash`, `cymbal`, `triangle`];
function hl(e17, t10) {
  if (dl.includes(e17)) {
    let e18 = [8, 8, 10, 6, 3, 11, 14, 7].filter(() => ll(0.3));
    return [.../* @__PURE__ */ new Set([0, ...e18.slice(0, 3)])];
  }
  return fl.includes(e17) ? t10.back ? (t10.back = false, ll(0.35) ? [4, 12, ul([7, 14, 15])] : [4, 12]) : ul([[], [12], [4, 12], [12, 14], [4, 12, 15]]) : pl.includes(e17) ? ul([il, il, sl, al, il.filter(() => ll(0.85))]) : e17 === `hihatOpen` ? ul([[], [14], [6, 14], al]) : ml.includes(e17) ? ll(0.6) ? [0] : [] : ul([[], ol, al, [0, 3, 6, 10, 12], [0, 10], [2, 10], [0, 3, 8, 11]]);
}
function gl(e17) {
  let t10 = (t11) => Array.from({ length: e17.steps }, (n11, r11) => t11.includes(e17.steps === 16 ? r11 : r11 * 2)), n10 = { back: true }, r10 = e17.tracks.map((e18) => {
    let r11 = [];
    return e18.sound || e18.rec ? r11 = ul([[0, 8], [4, 12], [0, 6, 12], [2, 10], [0, 3, 8, 11]]) : e18.drum && (r11 = hl(e18.drum, n10)), { ...e18, steps: t10(r11) };
  }), i10 = r10.map((e18, t11) => e18.note !== void 0 && !e18.sound ? t11 : -1).filter((e18) => e18 >= 0);
  if (i10.length) {
    let t11 = Math.floor(i10.length / 2);
    for (let n11 = 0; n11 < e17.steps; n11++) {
      let a10 = e17.steps === 16 ? n11 % 4 == 0 : n11 % 2 == 0, o10 = e17.steps !== 16 || n11 % 2 == 0;
      ll(a10 ? 0.75 : o10 ? 0.35 : 0.12) && (t11 = Math.min(i10.length - 1, Math.max(0, t11 + ul([-2, -1, -1, 0, 1, 1, 2]))), r10[i10[t11]].steps[n11] = true);
    }
  }
  return { ...e17, tracks: r10 };
}
function _l(e17, t10) {
  let n10 = cl.find((e18) => e18.id === t10);
  if (!n10) return e17;
  let r10 = e17.steps === 16 ? 1 : 2;
  return { ...e17, bpm: n10.bpm, tracks: e17.tracks.map((t11) => {
    let i10 = t11.drum ? n10.hits[t11.drum] : void 0;
    return t11.drum ? { ...t11, steps: Array.from({ length: e17.steps }, (e18, t12) => !!i10?.includes(t12 * r10)) } : t11;
  }) };
}
var vl = (e17) => e17.tracks.some((e18) => e18.drum && !e18.sound);
var yl = (e17) => e17.tracks.some((e18) => !e18.drum && e18.note !== void 0 && !e18.sound);
var bl = [{ id: `updown`, label: `Auf und ab`, bpm: 96, color: `#1c7ed6`, notes: [[0, 60], [2, 64], [4, 67], [6, 72], [8, 76], [10, 72], [12, 67], [14, 64]] }, { id: `bells`, label: `Glockenturm`, bpm: 80, color: `#f08c00`, notes: [[0, 76], [2, 72], [4, 74], [6, 67], [8, 67], [10, 74], [12, 76], [14, 72]] }, { id: `call`, label: `Rufen`, bpm: 92, color: `#e64980`, notes: [[0, 67], [4, 64], [6, 69], [8, 67], [12, 64]] }, { id: `echo`, label: `Echo`, bpm: 96, color: `#7048e8`, notes: [[0, 72], [2, 74], [4, 76], [8, 60], [10, 62], [12, 64]] }, { id: `rain`, label: `Regentropfen`, bpm: 104, color: `#15aabf`, notes: [[0, 76], [3, 72], [6, 74], [8, 69], [11, 72], [14, 76]] }, { id: `skip`, label: `H\xFCpfen`, bpm: 100, color: `#2f9e44`, notes: [[0, 60], [3, 64], [4, 67], [7, 64], [8, 60], [11, 64], [12, 67], [15, 72]] }, { id: `waves`, label: `Wellen`, bpm: 88, color: `#4263eb`, notes: [[0, 62], [2, 67], [4, 72], [6, 67], [8, 64], [10, 69], [12, 74], [14, 69]] }, { id: `lullaby`, label: `Wiegenlied`, bpm: 72, color: `#0ca678`, notes: [[0, 67], [4, 64], [8, 62], [10, 64], [12, 60]] }, { id: `gallop`, label: `Galopp`, bpm: 132, color: `#e03131`, notes: [[0, 60], [1, 64], [2, 67], [4, 60], [5, 64], [6, 67], [8, 62], [9, 67], [10, 69], [12, 67], [14, 72]] }, { id: `fanfare`, label: `Fanfare`, bpm: 108, color: `#fab005`, notes: [[0, 60], [2, 67], [3, 67], [4, 72], [8, 67], [10, 72], [11, 72], [12, 76]] }];
var xl = (e17) => e17.tracks.flatMap((e18, t10) => !e18.drum && e18.note !== void 0 && !e18.sound ? [{ i: t10, n: e18.note }] : []).sort((e18, t10) => e18.n - t10.n);
var Sl = [60, 62, 64, 67, 69, 72, 74, 76];
function Cl(e17) {
  let t10 = xl(e17), n10 = t10.length;
  return (e18) => {
    let r10 = Math.max(0, Sl.indexOf(e18));
    return t10[n10 >= Sl.length ? r10 : Math.round(r10 * (n10 - 1) / (Sl.length - 1))]?.i;
  };
}
function wl(e17, t10) {
  let n10 = bl.find((e18) => e18.id === t10), r10 = xl(e17);
  if (!n10 || !r10.length) return e17;
  let i10 = Cl(e17), a10 = e17.steps === 16 ? 1 : 2, o10 = e17.tracks.map((e18, t11) => r10.some((e19) => e19.i === t11) ? { ...e18, steps: e18.steps.map(() => false) } : e18);
  for (let [e18, t11] of n10.notes) {
    let n11 = i10(t11);
    e18 % a10 === 0 && n11 !== void 0 && (o10[n11].steps[e18 / a10] = true);
  }
  return { ...e17, bpm: n10.bpm, tracks: o10 };
}
function Dl(e17, t10) {
  let n10 = xl(e17);
  if (!n10.length) return e17;
  let r10 = ho(t10.scale).steps, i10 = 60 + t10.root - (t10.root > 7 ? 12 : 0), a10 = Array.from({ length: n10.length }, (e18, t11) => i10 + 12 * Math.floor(t11 / r10.length) + r10[t11 % r10.length]), o10 = e17.tracks.slice();
  return n10.forEach((e18, t11) => {
    let n11 = a10[t11];
    o10[e18.i] = { ...o10[e18.i], note: n11, color: fo[(n11 % 12 + 12) % 12], label: `` };
  }), { ...e17, tracks: o10, key: t10 };
}
function Ol() {
  return _l({ steps: 16, bpm: 100, tracks: [`crash`, `hihat`, `snare`, `clap`, `kick`, `cowbell`].map((e17, t10) => tl(e17, t10)) }, `rock`);
}
var Nl = [`C`, `D`, `E`, `F`, `G`, `A`, `H`];
var Pl = [0, 2, 4, 5, 7, 9, 11];
var Fl = (e17) => Math.round(e17 * 10) / 10;
var Il = (e17) => Nl[(e17 % 7 + 7) % 7];
var Ll = (e17) => 12 * (Math.floor(e17 / 7) + 1) + Pl[(e17 % 7 + 7) % 7];
var Rl = (e17) => Pl.includes((e17 % 12 + 12) % 12);
var zl = (e17, t10) => t10 - (e17 === `treble` ? 30 : 18);
var Bl = (e17, t10, n10) => e17 + 4 * t10 - n10 * t10 / 2;
function Vl(e17, t10) {
  return e17 === `treble` ? t10 ? [28, 40] : [30, 38] : t10 ? [16, 28] : [18, 26];
}
function Hl(e17, t10, n10, r10, i10 = `#1f2937`) {
  let a10 = ``;
  for (let o10 = 0; o10 < 5; o10++) a10 += `<path d="M${Fl(e17)} ${Fl(t10 + o10 * r10)}H${Fl(e17 + n10)}" stroke="${i10}" stroke-width="${Fl(Math.max(1.2, r10 * 0.09))}"/>`;
  return a10;
}
function Ul(e17, t10, n10, r10, i10 = `#1f2937`) {
  let a10 = r10 / 10;
  return ((e18) => `<g transform="translate(${Fl(t10)} ${Fl(n10)}) scale(${Fl(a10 * 1e3) / 1e3})">${e18}</g>`)(e17 === `treble` ? `<path d="M15 30C14 24 24 23 24 31C24 39 11 42 6 34C1 25 8 13 19 7C26 3 26 -8 21 -12C16 -16 12 -8 13 0C14 10 16 24 18 36L19 47C19.5 54 12 56 10 51" fill="none" stroke="${i10}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11.5" cy="50" r="3.2" fill="${i10}"/>` : `<path d="M5 10.5C4 3 13 -1 19 3C26 8 24 22 6 33" fill="none" stroke="${i10}" stroke-width="3" stroke-linecap="round"/><circle cx="6" cy="10" r="3.4" fill="${i10}"/><circle cx="28" cy="5" r="2" fill="${i10}"/><circle cx="28" cy="15" r="2" fill="${i10}"/>`);
}
function Gl(e17, t10, n10, r10, i10, a10 = `quarter`, o10 = `#1f2937`) {
  let s10 = zl(e17, t10), c10 = Bl(r10, i10, s10), l10 = i10 * (a10 === `whole` ? 0.72 : 0.62), u10 = i10 * 0.45, d10 = Fl(Math.max(1.2, i10 * 0.12)), f10 = ``, p10 = l10 * 1.75;
  for (let e18 = -2; e18 >= s10; e18 -= 2) f10 += `<path d="M${Fl(n10 - p10)} ${Fl(Bl(r10, i10, e18))}H${Fl(n10 + p10)}" stroke="${o10}" stroke-width="${Fl(Math.max(1.2, i10 * 0.09))}"/>`;
  for (let e18 = 10; e18 <= s10; e18 += 2) f10 += `<path d="M${Fl(n10 - p10)} ${Fl(Bl(r10, i10, e18))}H${Fl(n10 + p10)}" stroke="${o10}" stroke-width="${Fl(Math.max(1.2, i10 * 0.09))}"/>`;
  let m10 = a10 === `whole` || a10 === `half`;
  if (f10 += `<ellipse cx="${Fl(n10)}" cy="${Fl(c10)}" rx="${Fl(l10)}" ry="${Fl(u10)}" transform="rotate(-20 ${Fl(n10)} ${Fl(c10)})" fill="${m10 ? `none` : o10}" stroke="${o10}" stroke-width="${m10 ? Fl(i10 * 0.16) : 0}"/>`, a10 === `whole`) return f10;
  let h10 = s10 < 4, g10 = h10 ? n10 + l10 * 0.9 : n10 - l10 * 0.9, _10 = h10 ? c10 - i10 * 3.4 : c10 + i10 * 3.4;
  if (f10 += `<path d="M${Fl(g10)} ${Fl(c10 + (h10 ? -i10 * 0.1 : i10 * 0.1))}V${Fl(_10)}" stroke="${o10}" stroke-width="${d10}" stroke-linecap="round"/>`, a10 === `eighth`) {
    let e18 = h10 ? 1 : -1;
    f10 += `<path d="M${Fl(g10)} ${Fl(_10)}c${Fl(i10 * 0.2)} ${Fl(e18 * i10 * 0.9)} ${Fl(i10 * 1.15)} ${Fl(e18 * i10 * 1.1)} ${Fl(i10 * 0.85)} ${Fl(e18 * i10 * 2.3)}" fill="none" stroke="${o10}" stroke-width="${Fl(i10 * 0.22)}" stroke-linecap="round"/>`;
  }
  return f10;
}
var Jl = { clef: `treble`, ledger: false, answer: `names`, rounds: 10 };
var Yl = `Andika, Andika, Verdana, Arial, sans-serif`;
var see = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var Xl = 30;
var Zl = 132;
var cee = 700;
var Ql = (e17) => e17.nq ?? Jl;
function lee(e17) {
  let [t10, n10] = Vl(e17.clef, e17.ledger), r10 = { ..._o(`piano`), labels: `none` }, i10 = [];
  for (let e18 = t10; e18 <= n10; e18++) i10.push(Ll(e18));
  return { inst: r10, only: i10 };
}
function uee(e17, t10, n10) {
  let r10 = Ql(e17), i10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 720" width="${t10}" height="${n10}">`;
  if (i10 += `<rect x="0" y="0" width="1300" height="350" rx="36" fill="#ffffff" opacity="0.96" stroke="#dee2e6" stroke-width="3"/>`, i10 += `<g class="lh-key" data-a="start"><circle cx="90" cy="78" r="54" fill="#2f9e44"/><path d="M74 50L116 78L74 106Z" fill="#ffffff"/><circle class="lh-kdown" cx="90" cy="78" r="54" fill="#000000" opacity="0"/><title>Start</title></g>`, i10 += `<text class="lh-nq-msg" x="650" y="92" font-size="46" font-family="${Yl}" font-weight="700" text-anchor="middle" fill="#343a40">Tippe auf \u25B6</text>`, i10 += `<text class="lh-nq-score" x="1200" y="92" font-size="40" font-family="${Yl}" font-weight="700" text-anchor="middle" fill="#495057"></text>`, i10 += Hl(190, Zl, 1050, Xl) + Ul(r10.clef, 200, Zl, Xl), i10 += `<g class="lh-nq-note"></g>`, r10.answer === `names`) Nl.forEach((e18, t11) => {
    let n11 = 22.5 + t11 * 182.5, r11 = fo[[0, 2, 4, 5, 7, 9, 11][t11]];
    i10 += `<g class="lh-key" data-l="${e18}"><rect x="${n11}" y="400" width="160" height="280" rx="30" fill="${r11}"/><rect x="${n11 + 12}" y="412" width="136" height="90" rx="20" fill="#ffffff" opacity="0.2"/><text x="${n11 + 80}" y="582" font-size="110" font-family="${Yl}" font-weight="700" text-anchor="middle" fill="#ffffff">${e18}</text><rect class="lh-kdown" x="${n11}" y="400" width="160" height="280" rx="30" fill="#000000" opacity="0"/></g>`;
  });
  else {
    let { inst: e18, only: t11 } = lee(r10);
    i10 += zs(e18, 1300, 340, t11).replace(`<svg `, `<svg x="0" y="375" `);
  }
  return i10 + `</svg>`;
}
var $l = /* @__PURE__ */ new Map();
var eu = (e17) => {
  let t10 = $l.get(e17);
  return t10 || $l.set(e17, t10 = { phase: `idle`, d: 0, n: 0, score: 0, token: 0 }), t10;
};
var tu = /* @__PURE__ */ new Map();
var nu = /* @__PURE__ */ new Map();
var ru = /* @__PURE__ */ new Map();
function iu(e17, t10) {
  let n10 = eu(e17), r10 = nu.get(e17);
  if (!r10) return;
  let i10 = Ql(r10), a10 = t10 ?? (n10.phase === `idle` ? `Tippe auf \u25B6` : n10.phase === `ask` ? `Welche Note ist das?` : n10.phase === `done` ? `Geschafft! ${n10.score} von ${i10.rounds} richtig` : ``);
  for (let t11 of tu.get(e17) ?? []) {
    let e18 = t11.querySelector(`.lh-nq-msg`);
    e18 && (e18.textContent = a10, e18.setAttribute(`fill`, n10.phase === `right` || n10.phase === `done` ? `#2f9e44` : n10.phase === `wrong` ? `#e8590c` : `#343a40`));
    let r11 = t11.querySelector(`.lh-nq-score`);
    r11 && (r11.textContent = n10.phase === `idle` ? `` : `${n10.score} / ${i10.rounds}`);
    let o10 = t11.querySelector(`.lh-nq-note`);
    o10 && (o10.innerHTML = n10.phase === `idle` || n10.phase === `done` ? `` : Gl(i10.clef, n10.d, cee, Zl, Xl, `quarter`, n10.phase === `right` ? `#2f9e44` : n10.phase === `wrong` ? `#e8590c` : `#1f2937`));
  }
}
function dee(e17, t10, n10) {
  for (let r10 of tu.get(e17) ?? []) r10.querySelectorAll(t10).forEach((e18) => {
    e18.classList.add(`is-lit`), setTimeout(() => e18.classList.remove(`is-lit`), n10);
  });
}
function au(e17) {
  let t10 = nu.get(e17);
  if (!t10) return;
  let n10 = eu(e17), r10 = Ql(t10);
  if (n10.n >= r10.rounds) {
    n10.phase = `done`, iu(e17), vi();
    return;
  }
  let [i10, a10] = Vl(r10.clef, r10.ledger), o10 = n10.d;
  for (; o10 === n10.d; ) o10 = i10 + Math.floor(Math.random() * (a10 - i10 + 1));
  n10.d = o10, n10.n++, n10.phase = `ask`, iu(e17);
}
function fee(e17) {
  let t10 = eu(e17);
  t10.token++, t10.n = 0, t10.score = 0, t10.d = 0, au(e17);
}
function ou(e17, t10) {
  let n10 = eu(e17), r10 = nu.get(e17);
  if (!r10 || n10.phase !== `ask`) return;
  let i10 = ++n10.token, a10 = Il(n10.d);
  t10 ? (n10.score++, n10.phase = `right`, iu(e17, `Richtig! Das ist ein ${a10}.`), setTimeout(() => vi(), 250)) : (n10.phase = `wrong`, iu(e17, `Das ist ein ${a10}.`), yi(), dee(e17, Ql(r10).answer === `names` ? `.lh-key[data-l="${a10}"]` : `.lh-key[data-n="${Ll(n10.d)}"]`, 1400)), setTimeout(() => n10.token === i10 && au(e17), t10 ? 1200 : 1900);
}
function pee(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h));
  n10 && nu.set(t10.id, t10);
  let o10 = `${i10}x${a10}|${n10}|${JSON.stringify(t10.nq)}`;
  if (e17.dataset.k === o10) return;
  e17.dataset.k = o10, e17.setAttribute(`aria-label`, `Noten-Trainer: Welche Note ist das?`);
  let s10 = uee(t10, i10, a10);
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(s10) : see(s10), t11.style.width = `${i10}px`, t11.style.height = `${a10}px`, e17.replaceChildren(t11);
    return;
  }
  let c10 = document.createElement(`div`);
  c10.className = `lh-wg-pic`, c10.innerHTML = s10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(c10), t10.locked && e17.classList.add(`is-armed`);
  let l10 = tu.get(t10.id);
  l10 || tu.set(t10.id, l10 = /* @__PURE__ */ new Set());
  for (let e18 of l10) e18.isConnected || l10.delete(e18);
  l10.add(e17);
  let u10 = JSON.stringify(t10.nq);
  if (ru.has(t10.id) && ru.get(t10.id) !== u10) {
    let e18 = eu(t10.id);
    e18.token++, e18.phase = `idle`;
  }
  ru.set(t10.id, u10), iu(t10.id), Si(e17, { slide: false, hit: (e18) => {
    let n11 = t10.id, r11 = eu(n11);
    if (e18.getAttribute(`data-a`) === `start`) return fee(n11), null;
    let i11 = e18.getAttribute(`data-l`);
    if (i11) {
      let e19 = ms(`piano`, Ll(r11.d - (r11.d % 7 + 7) % 7 + Nl.indexOf(i11)));
      return ou(n11, i11 === Il(r11.d)), e19;
    }
    let a11 = e18.getAttribute(`data-n`);
    if (a11 === null || e18.hasAttribute(`data-off`)) return null;
    let o11 = ms(`piano`, Number(a11));
    return Rl(Number(a11)) && ou(n11, Number(a11) === Ll(r11.d)), o11;
  } });
}
var mee = `
.lh-wg-notequiz .lh-key.is-lit .lh-kdown{fill:#ffffff;opacity:.6}`;
var cu = { song: `entchen`, mode: `wait`, speed: `mid`, guide: false };
var lu = (e17) => e17.song === `custom` && e17.custom ? e17.custom : gc(e17.song);
var uu = `Andika, Andika, Verdana, Arial, sans-serif`;
var gee = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var _ee = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
var du = (e17) => Math.round(e17 * 10) / 10;
var fu = 1300;
var vee = 720;
var yee = 520;
var bee = 534;
var pu = 186;
var mu = 170;
var xee = { slow: 1.4, mid: 1, fast: 0.75 };
var See = { slow: `langsam`, mid: `mittel`, fast: `schnell` };
var hu = /* @__PURE__ */ new Map();
var gu = (e17) => ({ ...e17.fall ?? cu, ...hu.get(e17.id) ?? {} });
function _u(e17, t10) {
  return { inst: { ...e17.inst ?? _o(`tubes`), root: 0 }, only: _c(t10) };
}
function Cee(e17, t10, n10) {
  let r10 = gu(e17), i10 = lu(r10), { inst: a10, only: o10 } = _u(e17, i10), s10 = Rs(a10, fu, pu, o10), c10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fu} ${vee}" width="${t10}" height="${n10}">`;
  c10 += `<rect x="0" y="100" width="${fu}" height="438" rx="26" fill="#0b1026" opacity="0.88"/>`;
  for (let e18 of o10) {
    let t11 = s10.get(e18);
    if (!t11) continue;
    let n11 = (e19) => `<rect x="${du(t11.x - t11.w / 2)}" y="108" width="${du(t11.w)}" height="418" rx="10" ${e19}/>`;
    c10 += `<g class="lh-key" data-n="${e18}">${n11(`fill="${fo[e18 % 12]}" opacity="0.13"`)}${n11(`class="lh-kdown" fill="#ffffff" opacity="0"`)}</g>`;
  }
  c10 += `<rect x="10" y="517" width="1280" height="6" rx="3" fill="#ffffff" opacity="0.95"/>`, c10 += `<g class="lh-fall-notes"></g>`, c10 += `<text class="lh-fall-msg" x="${fu / 2}" y="330" font-size="58" font-family="${uu}" font-weight="700" text-anchor="middle" fill="#ffffff">Tippe auf \u25B6</text>`, c10 += `<rect x="0" y="0" width="1300" height="96" rx="30" fill="#ffffff" opacity="0.96" stroke="#dee2e6" stroke-width="3"/>`, c10 += `<g class="lh-key" data-a="start"><circle cx="58" cy="48" r="38" fill="#2f9e44"/><path class="lh-fall-play" d="M46 28L76 48L46 68Z" fill="#ffffff"/><rect class="lh-fall-stop" x="42" y="32" width="32" height="32" rx="5" fill="#ffffff" opacity="0"/><circle class="lh-kdown" cx="58" cy="48" r="38" fill="#000000" opacity="0"/><title>Start / Stopp</title></g>`;
  let l10 = (e18, t11, n11, r11, i11, a11, o11) => `<g class="lh-key" data-a="${e18}"><rect x="${t11}" y="18" width="${n11}" height="60" rx="16" fill="${a11}" stroke="${o11}" stroke-width="3"/><text class="${r11}" x="${t11 + n11 / 2}" y="58" font-size="26" font-family="${uu}" font-weight="700" text-anchor="middle" fill="#212529">${_ee(i11)}</text><rect class="lh-kdown" x="${t11}" y="18" width="${n11}" height="60" rx="16" fill="#000000" opacity="0"/></g>`;
  return c10 += l10(`songs`, 116, 500, `lh-fall-title`, `\u266B ${i10.title}`, `#e7f5ff`, `#1c7ed6`), c10 += l10(`mode`, 636, 200, `lh-fall-mode`, r10.mode === `wait` ? `Warten` : `Im Takt`, `#fff3bf`, `#f08c00`), c10 += l10(`speed`, 856, 230, `lh-fall-speed`, `Tempo: ${See[r10.speed]}`, `#f1f3f5`, `#adb5bd`), c10 += `<text class="lh-fall-score" x="1192" y="58" font-size="30" font-family="${uu}" font-weight="700" text-anchor="middle" fill="#495057"></text>`, c10 += zs(a10, fu, pu, o10).replace(`<svg `, `<svg x="0" y="${bee}" `), c10 += `<g class="lh-fall-lib" display="none">`, c10 += `<g class="lh-key" data-a="close"><rect x="0" y="0" width="${fu}" height="${vee}" rx="30" fill="#000000" opacity="0.4"/></g>`, c10 += `<rect x="150" y="40" width="1000" height="640" rx="30" fill="#ffffff"/><text x="${fu / 2}" y="104" font-size="38" font-family="${uu}" font-weight="700" text-anchor="middle" fill="#212529">Lied aussuchen</text>`, (r10.custom ? [...hc.slice(0, 7), r10.custom] : hc).forEach((e18, t11) => {
    let n11 = 190 + t11 % 2 * 470, r11 = 140 + Math.floor(t11 / 2) * 128, i11 = [`#e03131`, `#f08c00`, `#2f9e44`, `#1c7ed6`, `#7048e8`, `#e64980`, `#0ca678`, `#495057`][t11 % 8];
    c10 += `<g class="lh-key" data-a="song:${e18.id}"><rect x="${n11}" y="${r11}" width="450" height="108" rx="20" fill="#ffffff" stroke="${i11}" stroke-width="5"/><text x="${n11 + 225}" y="${r11 + 66}" font-size="${e18.title.length > 24 ? 24 : 30}" font-family="${uu}" font-weight="700" text-anchor="middle" fill="${i11}">${_ee(e18.title)}</text><rect class="lh-kdown" x="${n11}" y="${r11}" width="450" height="108" rx="20" fill="#000000" opacity="0"/></g>`;
  }), c10 += `</g>`, c10 + `</svg>`;
}
var vu = /* @__PURE__ */ new Map();
var yu = /* @__PURE__ */ new Map();
var bu = /* @__PURE__ */ new Map();
var xu = /* @__PURE__ */ new WeakMap();
function wee(e17) {
  let t10 = gu(e17), n10 = lu(t10), r10 = 60 / n10.bpm * xee[t10.speed], i10 = [], a10 = 3;
  for (let [e18, t11] of n10.notes) e18 !== null && i10.push({ m: e18, t: a10, d: t11 * r10, hit: false, missed: false, guided: false }), a10 += t11 * r10;
  return { running: false, done: false, t: 0, last: 0, notes: i10, next: 0, score: 0, end: a10 + 0.6, raf: 0, flashUntil: 0, flash: `` };
}
function Tee(e17, t10, n10) {
  let r10 = xu.get(e17);
  if (r10 && r10.length === n10.notes.length) return r10;
  let i10 = e17.querySelector(`.lh-fall-notes`);
  if (!i10) return [];
  let { inst: a10, only: o10 } = _u(t10, lu(gu(t10))), s10 = Rs(a10, fu, pu, o10);
  i10.replaceChildren();
  let c10 = `http://www.w3.org/2000/svg`;
  return r10 = n10.notes.map((e18) => {
    let t11 = s10.get(e18.m) ?? { x: fu / 2, w: 60 }, n11 = document.createElementNS(c10, `rect`), r11 = Math.min(t11.w * 0.86, 150);
    return n11.setAttribute(`x`, String(du(t11.x - r11 / 2))), n11.setAttribute(`width`, String(du(r11))), n11.setAttribute(`rx`, `12`), n11.setAttribute(`fill`, fo[e18.m % 12]), n11.setAttribute(`stroke`, `#ffffff`), n11.setAttribute(`stroke-width`, `3`), n11.setAttribute(`display`, `none`), n11.setAttribute(`pointer-events`, `none`), i10.appendChild(n11), n11;
  }), a10.labels !== `none` && n10.notes.forEach((e18, t11) => {
    let n11 = document.createElementNS(c10, `text`);
    n11.setAttribute(`x`, String(du(Number(r10[t11].getAttribute(`x`)) + Number(r10[t11].getAttribute(`width`)) / 2))), n11.setAttribute(`font-size`, `26`), n11.setAttribute(`font-family`, uu), n11.setAttribute(`font-weight`, `700`), n11.setAttribute(`text-anchor`, `middle`), n11.setAttribute(`fill`, `#ffffff`), n11.setAttribute(`display`, `none`), n11.setAttribute(`pointer-events`, `none`), n11.textContent = Eo(a10, e18.m), i10.appendChild(n11), r10[t11].label = n11;
  }), xu.set(e17, r10), r10;
}
function Su(e17) {
  let t10 = vu.get(e17), n10 = bu.get(e17);
  if (!n10) return;
  let r10 = gu(n10);
  for (let i10 of yu.get(e17) ?? []) {
    if (!i10.isConnected) continue;
    i10.classList.toggle(`is-running`, !!t10?.running);
    let e18 = i10.querySelector(`.lh-fall-msg`), a10 = i10.querySelector(`.lh-fall-score`), o10 = t10?.notes.length ?? 0;
    if (a10 && (a10.textContent = t10 && (t10.running || t10.done) ? `${t10.score} / ${o10}` : ``), e18) {
      let n11 = t10 && performance.now() < t10.flashUntil ? t10.flash : ``;
      e18.textContent = !t10 || !t10.running && !t10.done ? `Tippe auf \u25B6` : t10.done ? r10.mode === `wait` ? `Super \u2013 das ganze Lied!` : `Geschafft! ${t10.score} von ${o10}` : n11;
    }
    if (!t10) continue;
    let s10 = Tee(i10, n10, t10), c10 = r10.mode === `wait` && t10.running ? t10.notes[t10.next] : void 0;
    t10.notes.forEach((e19, n11) => {
      let r11 = s10[n11];
      if (!r11) return;
      let i11 = yee - (e19.t - t10.t) * mu, a11 = Math.max(16, e19.d * mu - 8), o11 = !e19.hit && i11 > 102 && i11 - a11 < 550 && !(e19.missed && i11 - a11 > 530);
      if (r11.setAttribute(`display`, o11 ? `inline` : `none`), r11.label && r11.label.setAttribute(`display`, o11 ? `inline` : `none`), !o11) return;
      let c11 = Math.max(108, i11 - a11);
      r11.setAttribute(`y`, String(du(c11))), r11.setAttribute(`height`, String(du(Math.max(4, i11 - c11)))), r11.setAttribute(`opacity`, e19.missed ? `0.35` : `1`), r11.label && r11.label.setAttribute(`y`, String(du(i11 - 10)));
    }), i10.querySelectorAll(`.lh-key.is-lit`).forEach((e19) => e19.classList.remove(`is-lit`)), c10 && t10.t >= c10.t - 0.05 && i10.querySelectorAll(`.lh-key[data-n="${c10.m}"]`).forEach((e19) => e19.classList.add(`is-lit`));
  }
}
function Cu(e17) {
  let t10 = vu.get(e17), n10 = bu.get(e17);
  if (!t10 || !n10 || !t10.running) return;
  if (![...yu.get(e17) ?? []].some((e18) => e18.isConnected)) {
    t10.running = false;
    return;
  }
  let r10 = gu(n10), i10 = performance.now(), a10 = Math.min(0.1, (i10 - t10.last) / 1e3);
  if (t10.last = i10, r10.mode === `wait`) {
    let n11 = t10.notes[t10.next];
    t10.t = n11 ? Math.min(n11.t, t10.t + a10) : t10.t + a10, !n11 && t10.t > t10.end && wu(e17);
  } else {
    t10.t += a10;
    for (let e18 of t10.notes) if (!e18.hit && !e18.missed && t10.t > e18.t + 0.25 && (e18.missed = true), r10.guide && !e18.guided && t10.t >= e18.t) {
      e18.guided = true;
      let t11 = ms((n10.inst ?? _o(`tubes`)).voice, e18.m, { vel: 0.35 });
      setTimeout(() => t11?.release(), e18.d * 900);
    }
    t10.t > t10.end && wu(e17);
  }
  Su(e17), t10.running && (t10.raf = requestAnimationFrame(() => Cu(e17)));
}
function wu(e17) {
  let t10 = vu.get(e17);
  t10 && (t10.running = false, t10.done = true, vi(), Su(e17));
}
function Eee(e17) {
  let t10 = bu.get(e17);
  if (!t10) return;
  let n10 = vu.get(e17);
  n10 && cancelAnimationFrame(n10.raf);
  let r10 = wee(t10);
  r10.running = true, r10.last = performance.now(), vu.set(e17, r10);
  for (let t11 of yu.get(e17) ?? []) xu.delete(t11);
  r10.raf = requestAnimationFrame(() => Cu(e17));
}
function Tu(e17) {
  let t10 = vu.get(e17);
  if (t10) {
    cancelAnimationFrame(t10.raf), vu.delete(e17);
    for (let t11 of yu.get(e17) ?? []) t11.querySelector(`.lh-fall-notes`)?.replaceChildren(), xu.delete(t11);
    Su(e17);
    for (let t11 of yu.get(e17) ?? []) t11.classList.remove(`is-running`);
  }
}
function Dee(e17, t10) {
  let n10 = vu.get(e17), r10 = bu.get(e17);
  if (!n10?.running || !r10) return;
  if (gu(r10).mode === `wait`) {
    let e18 = n10.notes[n10.next];
    e18 && e18.m === t10 && n10.t >= e18.t - 0.6 && (e18.hit = true, n10.next++, n10.score++, n10.t = Math.max(n10.t, e18.t));
    return;
  }
  let i10 = null;
  for (let e18 of n10.notes) !e18.hit && !e18.missed && e18.m === t10 && Math.abs(e18.t - n10.t) <= 0.22 && (!i10 || Math.abs(e18.t - n10.t) < Math.abs(i10.t - n10.t)) && (i10 = e18);
  i10 && (i10.hit = true, n10.score++, n10.flash = Math.abs(i10.t - n10.t) < 0.09 ? `Super!` : `Gut!`, n10.flashUntil = performance.now() + 500);
}
function Eu(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h));
  n10 && bu.set(t10.id, t10);
  let o10 = `${i10}x${a10}|${n10}|${JSON.stringify(t10.inst)}|${JSON.stringify(gu(t10))}`;
  if (e17.dataset.k === o10) return;
  e17.dataset.k = o10, e17.setAttribute(`aria-label`, `Notenregen: ${lu(gu(t10)).title}`);
  let s10 = Cee(t10, i10, a10);
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(s10) : gee(s10), t11.style.width = `${i10}px`, t11.style.height = `${a10}px`, e17.replaceChildren(t11);
    return;
  }
  let c10 = document.createElement(`div`);
  c10.className = `lh-wg-pic`, c10.innerHTML = s10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(c10), xu.delete(e17), t10.locked && e17.classList.add(`is-armed`);
  let l10 = yu.get(t10.id);
  l10 || yu.set(t10.id, l10 = /* @__PURE__ */ new Set());
  for (let e18 of l10) e18.isConnected || l10.delete(e18);
  l10.add(e17), Su(t10.id);
  let u10 = () => {
    Tu(t10.id);
    let e18 = bu.get(t10.id) ?? t10;
    for (let n11 of yu.get(t10.id) ?? []) delete n11.dataset.k, Eu(n11, e18, true, {});
  };
  Si(e17, { slide: false, hit: (e18) => {
    let n11 = t10.id, r11 = e18.getAttribute(`data-a`), i11 = (e19) => yu.get(n11)?.forEach((t11) => t11.classList.toggle(`is-library`, e19));
    if (r11) {
      let e19 = gu(bu.get(n11) ?? t10);
      return r11 === `start` ? vu.get(n11)?.running ? Tu(n11) : Eee(n11) : r11 === `songs` ? i11(true) : r11 === `close` ? i11(false) : r11.startsWith(`song:`) ? (hu.set(n11, { ...hu.get(n11) ?? {}, song: r11.slice(5) }), i11(false), u10()) : r11 === `mode` ? (hu.set(n11, { ...hu.get(n11) ?? {}, mode: e19.mode === `wait` ? `rhythm` : `wait` }), u10()) : r11 === `speed` && (hu.set(n11, { ...hu.get(n11) ?? {}, speed: e19.speed === `slow` ? `mid` : e19.speed === `mid` ? `fast` : `slow` }), u10()), null;
    }
    let a11 = e18.getAttribute(`data-n`);
    if (a11 === null || e18.hasAttribute(`data-off`)) return null;
    let o11 = ms((bu.get(n11) ?? t10).inst?.voice ?? `tube`, Number(a11));
    return Dee(n11, Number(a11)), o11;
  } });
}
var kee = `
.lh-wg-fall.is-running .lh-fall-play{opacity:0}
.lh-wg-fall.is-running .lh-fall-stop{opacity:1}
.lh-wg-fall.is-library .lh-fall-lib{display:inline}
.lh-wg-fall .lh-key.is-lit .lh-kdown{fill:#ffffff;opacity:.55;animation:lh-fall-blink .6s ease-in-out infinite alternate}
@keyframes lh-fall-blink{from{opacity:.15}to{opacity:.6}}`;
function Ou(e17, t10) {
  let n10 = e17[0]?.length ?? 0, r10 = Math.max(1, e17.length), i10 = new DataView(new ArrayBuffer(44 + n10 * r10 * 2)), a10 = (e18, t11) => [...t11].forEach((t12, n11) => i10.setUint8(e18 + n11, t12.charCodeAt(0)));
  a10(0, `RIFF`), i10.setUint32(4, 36 + n10 * r10 * 2, true), a10(8, `WAVEfmt `), i10.setUint32(16, 16, true), i10.setUint16(20, 1, true), i10.setUint16(22, r10, true), i10.setUint32(24, t10, true), i10.setUint32(28, t10 * r10 * 2, true), i10.setUint16(32, r10 * 2, true), i10.setUint16(34, 16, true), a10(36, `data`), i10.setUint32(40, n10 * r10 * 2, true);
  let o10 = 44;
  for (let t11 = 0; t11 < n10; t11++) for (let n11 = 0; n11 < r10; n11++) {
    let r11 = Math.max(-1, Math.min(1, e17[n11][t11]));
    i10.setInt16(o10, r11 < 0 ? r11 * 32768 : r11 * 32767, true), o10 += 2;
  }
  return new Blob([i10.buffer], { type: `audio/wav` });
}
var Aee = (e17) => Ou(Array.from({ length: Math.min(2, e17.numberOfChannels) }, (t10, n10) => e17.getChannelData(n10)), e17.sampleRate);
function ku(e17 = /* @__PURE__ */ new Date()) {
  return `${e17.toLocaleDateString(`de-DE`)} ${e17.toLocaleTimeString(`de-DE`, { hour: `2-digit`, minute: `2-digit` }).replace(`:`, `.`)}`;
}
async function Au(e17, t10) {
  let n10 = new File([e17], t10, { type: e17.type || `application/octet-stream` });
  try {
    if (typeof navigator.share == `function` && navigator.canShare?.({ files: [n10] }) && matchMedia(`(pointer: coarse)`).matches) {
      await navigator.share({ files: [n10] });
      return;
    }
  } catch (e18) {
    if (e18 instanceof DOMException && e18.name === `AbortError`) return;
  }
  let r10 = URL.createObjectURL(n10), i10 = document.createElement(`a`);
  i10.href = r10, i10.download = t10, i10.rel = `noopener`, i10.style.display = `none`, document.body.appendChild(i10), i10.click(), i10.remove(), setTimeout(() => URL.revokeObjectURL(r10), 6e4);
}
var ju = (e17) => !e17.sound && !e17.fx && !e17.mood;
var Mu = (e17) => e17 !== false;
var Nu = [{ label: `Musik`, color: `#1c7ed6` }, { label: `Sprache`, color: `#f08c00` }, { label: `Ger\xE4usche`, color: `#2f9e44` }];
var Pu = [{ id: `rain`, label: `Regen`, dur: 8, loop: true }, { id: `wind`, label: `Wind`, dur: 8, loop: true }, { id: `thunder`, label: `Donner`, dur: 3.5, loop: false }, { id: `waves`, label: `Meer`, dur: 10, loop: true }, { id: `birds`, label: `V\xF6gel`, dur: 8, loop: true }, { id: `steps`, label: `Schritte`, dur: 4, loop: true }, { id: `knock`, label: `Klopfen`, dur: 1.2, loop: false }, { id: `door`, label: `T\xFCr`, dur: 1.8, loop: false }, { id: `bell`, label: `Glocke`, dur: 3, loop: false }, { id: `clock`, label: `Uhr tickt`, dur: 6, loop: true }, { id: `heart`, label: `Herzschlag`, dur: 6, loop: true }, { id: `magic`, label: `Zauber`, dur: 2.2, loop: false }, { id: `applause`, label: `Applaus`, dur: 4, loop: true }, { id: `fire`, label: `Feuer`, dur: 8, loop: true }];
var Fu = [{ id: `happy`, label: `Fr\xF6hlich` }, { id: `calm`, label: `Ruhig` }, { id: `tense`, label: `Spannend` }, { id: `spooky`, label: `Gruselig` }];
var Iu = (e17) => Pu.find((t10) => t10.id === e17);
var Lu = () => ({ len: 60, clips: [] });
var Bu = (e17, t10, n10) => Math.min(n10, Math.max(t10, e17));
function Vu(e17, t10, n10, r10, i10, a10, o10, s10 = 0.3) {
  let c10 = e17.ctx.createBufferSource();
  c10.buffer = e17.noise, c10.loop = true;
  let l10 = e17.ctx.createBiquadFilter();
  l10.type = r10, l10.frequency.value = i10, l10.Q.value = a10;
  let u10 = e17.ctx.createGain();
  return u10.gain.setValueAtTime(0, t10), u10.gain.linearRampToValueAtTime(o10, t10 + Math.min(s10, n10 / 3)), u10.gain.setValueAtTime(o10, t10 + Math.max(0, n10 - s10)), u10.gain.linearRampToValueAtTime(0, t10 + n10), c10.connect(l10).connect(u10).connect(e17.out), c10.start(t10, Math.random() * 0.5), c10.stop(t10 + n10 + 0.05), e17.stops.push(c10), u10;
}
function Hu(e17, t10, n10, r10, i10, a10, o10) {
  let s10 = e17.ctx.createBufferSource();
  s10.buffer = e17.noise;
  let c10 = e17.ctx.createBiquadFilter();
  c10.type = n10, c10.frequency.value = r10, c10.Q.value = i10;
  let l10 = e17.ctx.createGain();
  l10.gain.setValueAtTime(a10, t10), l10.gain.setTargetAtTime(0, t10, o10), s10.connect(c10).connect(l10).connect(e17.out), s10.start(t10, Math.random() * 0.8), s10.stop(t10 + o10 * 8), e17.stops.push(s10);
}
function Uu(e17, t10, n10, r10, i10, a10, o10, s10 = `sine`) {
  let c10 = e17.ctx.createOscillator();
  c10.type = s10, c10.frequency.setValueAtTime(n10, t10), c10.frequency.exponentialRampToValueAtTime(Math.max(20, r10), t10 + i10);
  let l10 = e17.ctx.createGain();
  l10.gain.setValueAtTime(0, t10), l10.gain.linearRampToValueAtTime(a10, t10 + 5e-3), l10.gain.setTargetAtTime(0, t10 + 5e-3, o10), c10.connect(l10).connect(e17.out), c10.start(t10), c10.stop(t10 + o10 * 8 + 0.01), e17.stops.push(c10);
}
function Wu(e17, t10, n10, r10, i10, a10) {
  let o10 = e17.ctx.createOscillator();
  o10.frequency.value = i10;
  let s10 = e17.ctx.createGain();
  s10.gain.value = a10, o10.connect(s10).connect(t10), o10.start(n10), o10.stop(n10 + r10), e17.stops.push(o10);
}
var Gu = (e17, t10) => e17 + Math.random() * (t10 - e17);
function Ku(e17, t10, n10, r10) {
  switch (t10) {
    case `rain`:
      Vu(e17, n10, r10, `bandpass`, 3e3, 0.4, 0.22, 0.8);
      for (let t11 = n10 + 0.05; t11 < n10 + r10 - 0.1; t11 += Gu(0.02, 0.09)) Hu(e17, t11, `highpass`, 4e3, 0.7, Gu(0.03, 0.12), 6e-3);
      break;
    case `wind`:
      Wu(e17, Vu(e17, n10, r10, `lowpass`, 600, 1, 0.3, 1.2).gain, n10, r10, 0.18, 0.12);
      break;
    case `thunder`:
      Hu(e17, n10, `highpass`, 1500, 0.5, 0.5, 0.06), Vu(e17, n10 + 0.05, Math.min(r10, 3.2), `lowpass`, 220, 0.8, 0.8, 0.15), Hu(e17, n10 + 0.4, `lowpass`, 400, 0.6, 0.6, 0.5);
      break;
    case `waves`:
      Wu(e17, Vu(e17, n10, r10, `lowpass`, 900, 0.6, 0.22, 1.5).gain, n10, r10, 0.12, 0.18);
      break;
    case `birds`:
      for (let t11 = n10 + Gu(0.1, 0.5); t11 < n10 + r10 - 0.3; t11 += Gu(0.5, 1.4)) {
        let n11 = Math.floor(Gu(2, 5)), r11 = Gu(2400, 3600);
        for (let i10 = 0; i10 < n11; i10++) Uu(e17, t11 + i10 * 0.11, r11, r11 * Gu(1.2, 1.6), 0.07, 0.12, 0.03);
      }
      break;
    case `steps`:
      for (let t11 = n10 + 0.1; t11 < n10 + r10 - 0.1; t11 += 0.55) Uu(e17, t11, 110, 55, 0.08, 0.5, 0.05), Hu(e17, t11, `lowpass`, 1200, 0.6, 0.25, 0.03);
      break;
    case `knock`:
      for (let t11 of [0, 0.25, 0.5]) Uu(e17, n10 + t11, 200, 120, 0.04, 0.6, 0.04), Hu(e17, n10 + t11, `bandpass`, 900, 1, 0.4, 0.02);
      break;
    case `door`: {
      let t11 = e17.ctx.createOscillator();
      t11.type = `sawtooth`, t11.frequency.setValueAtTime(520, n10), t11.frequency.linearRampToValueAtTime(880, n10 + 0.4), t11.frequency.linearRampToValueAtTime(460, n10 + 0.9);
      let r11 = e17.ctx.createBiquadFilter();
      r11.type = `bandpass`, r11.frequency.value = 1500, r11.Q.value = 4;
      let i10 = e17.ctx.createGain();
      i10.gain.setValueAtTime(0, n10), i10.gain.linearRampToValueAtTime(0.18, n10 + 0.1), i10.gain.linearRampToValueAtTime(0, n10 + 1), t11.connect(r11).connect(i10).connect(e17.out), t11.start(n10), t11.stop(n10 + 1.05), e17.stops.push(t11), Uu(e17, n10 + 1.1, 90, 50, 0.1, 0.7, 0.08), Hu(e17, n10 + 1.1, `lowpass`, 800, 0.7, 0.5, 0.05);
      break;
    }
    case `bell`:
      for (let [t11, r11] of [[1, 0.4], [2.76, 0.18], [5.4, 0.08]]) Uu(e17, n10, 523 * t11, 523 * t11, 0.01, r11, 0.8);
      break;
    case `clock`:
      for (let t11 = n10 + 0.05, i10 = 0; t11 < n10 + r10; t11 += 0.5, i10++) Uu(e17, t11, i10 % 2 ? 2e3 : 2600, i10 % 2 ? 2e3 : 2600, 0.01, 0.25, 8e-3);
      break;
    case `heart`:
      for (let t11 = n10 + 0.1; t11 < n10 + r10 - 0.3; t11 += 0.85) Uu(e17, t11, 70, 45, 0.1, 0.9, 0.06), Uu(e17, t11 + 0.2, 60, 40, 0.1, 0.6, 0.05);
      break;
    case `magic`:
      [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96].forEach((t11, r11) => Uu(e17, n10 + r11 * 0.09, 440 * 2 ** ((t11 - 69) / 12), 440 * 2 ** ((t11 - 69) / 12), 0.01, 0.12, 0.25, `triangle`)), Vu(e17, n10, 1.6, `highpass`, 7e3, 0.5, 0.06, 0.4);
      break;
    case `applause`: {
      let t11 = e17.ctx.createGain();
      t11.gain.setValueAtTime(0, n10), t11.gain.linearRampToValueAtTime(1, n10 + 0.4), t11.gain.setValueAtTime(1, n10 + Math.max(0.4, r10 - 0.8)), t11.gain.linearRampToValueAtTime(0, n10 + r10), t11.connect(e17.out);
      let i10 = { ...e17, out: t11 };
      for (let e18 = n10; e18 < n10 + r10; e18 += Gu(0.012, 0.04)) Hu(i10, e18, `bandpass`, Gu(1200, 3200), 1.2, Gu(0.1, 0.3), 0.012);
      break;
    }
    case `fire`:
      Vu(e17, n10, r10, `lowpass`, 500, 0.7, 0.18, 0.8);
      for (let t11 = n10 + 0.1; t11 < n10 + r10 - 0.1; t11 += Gu(0.05, 0.35)) Hu(e17, t11, `highpass`, Gu(2500, 6e3), 1, Gu(0.08, 0.3), 8e-3);
  }
}
var Mee = { happy: { bpm: 112, style: `arp`, bars: [[48, [60, 64, 67, 72]], [53, [60, 65, 69, 72]], [55, [62, 67, 71, 74]], [48, [60, 64, 67, 72]]] }, calm: { bpm: 72, style: `pad`, bars: [[45, [57, 60, 64]], [41, [53, 57, 60]], [48, [55, 60, 64]], [43, [55, 59, 62]]] }, tense: { bpm: 96, style: `pulse`, bars: [[45, [69, 72]], [45, [69, 72]], [41, [69, 72]], [40, [68, 71]]] }, spooky: { bpm: 60, style: `spooky`, bars: [[45, [57, 60, 63]], [44, [56, 59, 62]], [45, [57, 60, 63]], [46, [58, 61, 64]]] } };
function qu(e17, t10, n10, r10) {
  let i10 = Mee[e17], a10 = 60 / i10.bpm, o10 = i10.style === `arp` || i10.style === `pulse` ? a10 / 2 : a10;
  for (let e18 = Math.ceil(t10 / o10 - 1e-6); e18 * o10 < n10; e18++) {
    let t11 = e18 * o10, n11 = Math.floor(t11 / a10 + 1e-6), [s10, c10] = i10.bars[Math.floor(n11 / 4) % 4], l10 = n11 % 4 == 0 && Math.abs(t11 - n11 * a10) < 1e-6;
    if (i10.style === `arp`) r10(t11, `xylophone`, c10[e18 % c10.length], o10, 0.5), l10 && r10(t11, `piano`, s10, a10 * 2, 0.6);
    else if (i10.style === `pad`) {
      if (l10) {
        for (let e19 of c10) r10(t11, `organ`, e19, a10 * 4 - 0.05, 0.35);
        r10(t11, `flute`, s10 + 12, a10 * 2, 0.25);
      } else r10(t11, `musicbox`, c10[(n11 + 1) % c10.length] + 12, a10, 0.3);
    } else if (i10.style === `pulse`) r10(t11, `synth`, s10, o10 * 0.8, 0.45), e18 % 4 == 3 && r10(t11, `glockenspiel`, c10[e18 % 2] + 12, o10, 0.3);
    else {
      if (l10) for (let e19 of c10) r10(t11, `organ`, e19 - 12, a10 * 4 - 0.05, 0.3);
      e18 % 3 == 1 && r10(t11, `glockenspiel`, 84 + [0, 1, 6, 7, 11][e18 % 5], a10, 0.2);
    }
  }
}
var Ju = `Andika, Andika, Verdana, Arial, sans-serif`;
var Nee = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var Pee = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
var Yu = (e17) => Math.round(e17 * 10) / 10;
var Xu = 1300;
var Zu = 700;
var Qu = 230;
var $u = 1280;
var Fee = 160;
var ed = 160;
var td = 676;
var nd = (e17) => Fee + (2 - e17) * 174;
var rd = [1, 2, 4, 8, 16];
var id = (e17) => rd.filter((t10) => e17.len / t10 >= 4).pop() ?? 1;
var Iee = (e17) => ({ zoom: 1, from: 0, span: e17.len });
function ad(e17, t10, n10) {
  let r10 = Math.min(t10, id(e17)), i10 = e17.len / r10;
  return { zoom: r10, from: Bu(n10, 0, e17.len - i10), span: i10 };
}
var od = (e17, t10) => Qu + (t10 - e17.from) / e17.span * 1050;
function sd(e17, t10, n10) {
  let r10 = od(e17, t10), i10 = od(e17, t10 + n10);
  if (i10 < Qu || r10 > $u) return null;
  let a10 = Math.max(Qu, r10);
  return { x: a10, w: Math.max(18, Math.min($u, i10) - a10) };
}
var cd = (e17) => `${Math.floor(e17 / 60)}:${String(Math.floor(e17 % 60)).padStart(2, `0`)}`;
var Lee = (e17) => e17.label || (e17.fx ? Iu(e17.fx)?.label ?? `` : e17.mood ? Fu.find((t10) => t10.id === e17.mood)?.label ?? `Musik` : ju(e17) ? `Eigenes Ger\xE4usch` : `Aufnahme`);
var Ree = (e17, t10, n10) => `<g transform="translate(${Yu(e17)} ${Yu(t10)})"><rect x="-5" y="-13" width="10" height="17" rx="5" fill="${n10}"/><path d="M-9 -2a9 9 0 0 0 18 0M0 7v6" fill="none" stroke="${n10}" stroke-width="2.5" stroke-linecap="round"/></g>`;
var ld = `fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
var ud = `fill="#ffffff"`;
var dd = `<path d="M24 52h52a14 14 0 0 0 0-28 20 20 0 0 0-38-4 15 15 0 0 0-14 32z" ${ud}/>`;
var fd = { rain: `${dd}<path d="M32 64l-5 12M50 64l-5 12M68 64l-5 12M41 80l-4 10M59 80l-4 10" ${ld}/>`, wind: `<path d="M12 36h50a10 10 0 1 0-10-10M12 54h66a11 11 0 1 1-11 11M12 72h36" ${ld}/>`, thunder: `${dd}<path d="M54 54L40 74h14L44 94l24-28H54l8-12z" fill="#ffe066" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>`, waves: `<path d="M8 44q10-12 21 0t21 0 21 0 21 0M8 66q10-12 21 0t21 0 21 0 21 0" ${ld}/>`, birds: `<path d="M12 44q10-12 20 0 10-12 20 0M48 70q9-11 18 0 9-11 18 0M58 30q7-8 14 0 7-8 14 0" ${ld}/>`, steps: `<ellipse cx="34" cy="62" rx="12" ry="20" ${ud}/><ellipse cx="66" cy="38" rx="12" ry="20" ${ud}/><circle cx="34" cy="34" r="5" ${ud}/><circle cx="66" cy="10" r="5" ${ud}/>`, knock: `<rect x="18" y="10" width="44" height="82" rx="4" ${ld}/><circle cx="52" cy="54" r="4" ${ud}/><path d="M74 36q8 8 0 16M84 28q14 16 0 32" ${ld}/>`, door: `<path d="M22 92V12h48v80M14 92h64" ${ld}/><path d="M70 12l14 8v66l-14 6" ${ld}/><circle cx="60" cy="54" r="4" ${ud}/>`, bell: `<path d="M50 14a24 24 0 0 0-24 24v20l-8 14h64l-8-14V38a24 24 0 0 0-24-24z" ${ud}/><circle cx="50" cy="82" r="8" ${ud}/><path d="M50 6v8" ${ld}/>`, clock: `<circle cx="50" cy="52" r="36" ${ld}/><path d="M50 30v22l14 10" ${ld}/>`, heart: `<path d="M50 86C20 64 10 48 10 34a20 20 0 0 1 40-8 20 20 0 0 1 40 8c0 14-10 30-40 52z" ${ud}/>`, magic: `<path d="M18 86l44-44" ${ld}/><path d="M68 10l5 13 13 5-13 5-5 13-5-13-13-5 13-5z" ${ud}/><circle cx="30" cy="30" r="4" ${ud}/><circle cx="84" cy="62" r="4" ${ud}/>`, applause: `<path d="M30 80c-12-12-14-26-6-34l18-18a6 6 0 0 1 9 9l-8 8 20-20a6 6 0 0 1 9 9L58 48l6-6a6 6 0 0 1 9 9L58 66c-8 10-18 18-28 14z" ${ud}/><path d="M78 22l8-8M84 36l10-2M64 12l2-10" ${ld}/>`, fire: `<path d="M50 92c-20 0-30-14-28-30 2-14 14-20 12-38 14 8 22 20 20 32 4-4 6-10 6-16 10 8 18 20 18 32 0 12-10 20-28 20z" fill="#ffe066"/><path d="M50 92c-9 0-14-6-13-14 1-7 7-10 7-18 8 6 14 12 14 20 0 7-3 12-8 12z" fill="#ff8787"/>` };
function zee(e17, t10, n10) {
  return ((e18) => `<g transform="translate(${Yu(t10)} ${Yu(n10)})" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${e18}</g>`)(e17 === 0 ? `<path d="M-6 12V-18L14 -22V8"/><ellipse cx="-12" cy="12" rx="7" ry="5.5" fill="#ffffff"/><ellipse cx="8" cy="8" rx="7" ry="5.5" fill="#ffffff"/>` : e17 === 1 ? `<rect x="-7" y="-24" width="14" height="26" rx="7" fill="#ffffff"/><path d="M-14 -4a14 14 0 0 0 28 0M0 10v10M-8 20h16"/>` : `<path d="M-22 -8h8l12 -10v36l-12 -10h-8z" fill="#ffffff"/><path d="M6 -6a10 10 0 0 1 0 12M12 -13a20 20 0 0 1 0 26"/>`);
}
function Bee(e17, t10, n10, r10, i10, a10 = {}) {
  let o10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Xu} ${Zu}" width="${t10}" height="${n10}">`;
  o10 += `<rect width="${Xu}" height="${Zu}" rx="30" fill="#ffffff" opacity="0.96" stroke="#dee2e6" stroke-width="3"/>`, o10 += `<g class="lh-key" data-a="play"><circle cx="66" cy="56" r="40" fill="#2f9e44"/><path class="lh-hs-play" d="M54 36L84 56L54 76Z" fill="#ffffff"/><rect class="lh-hs-stop" x="50" y="40" width="32" height="32" rx="5" fill="#ffffff" opacity="0"/><circle class="lh-kdown" cx="66" cy="56" r="40" fill="#000000" opacity="0"/><title>Abspielen / Stopp</title></g>`, o10 += `<g class="lh-key" data-a="home"><circle cx="150" cy="56" r="30" fill="#495057"/><path d="M138 44v24M162 44L144 56L162 68Z" fill="#ffffff" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/><circle class="lh-kdown" cx="150" cy="56" r="30" fill="#000000" opacity="0"/><title>An den Anfang</title></g>`, o10 += `<text class="lh-hs-time" x="200" y="66" font-size="28" font-family="Menlo, Consolas, monospace" font-weight="700" fill="#212529">0:00</text>`;
  let s10 = (e18, t11, n11, r11, i11, a11 = ``) => `<g class="lh-key" data-a="${e18}"><rect x="${t11}" y="24" width="${n11}" height="64" rx="16" fill="${i11}"/><text x="${t11 + n11 / 2}" y="65" font-size="25" font-family="${Ju}" font-weight="700" text-anchor="middle" fill="#ffffff">${r11}</text><rect class="lh-kdown" x="${t11}" y="24" width="${n11}" height="64" rx="16" fill="#000000" opacity="0"/>${a11 ? `<title>${a11}</title>` : ``}</g>`;
  r10 && (o10 += s10(`add-fx`, 452, 180, `+ Ger\xE4usch`, Nu[2].color) + s10(`add-rec`, 642, 180, `+ Sprache`, Nu[1].color) + s10(`add-music`, 832, 180, `+ Musik`, Nu[0].color)), o10 += `<g class="lh-key lh-hs-save" data-a="save"><rect x="1030" y="24" width="244" height="64" rx="16" fill="#f1f3f5" stroke="#495057" stroke-width="3"/><path d="M1058 38v24M1047 51l11 11 11-11M1046 72h24" fill="none" stroke="#343a40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="1166" y="65" font-size="24" font-family="${Ju}" font-weight="700" text-anchor="middle" fill="#343a40">Herunterladen</text><rect class="lh-kdown" x="1030" y="24" width="244" height="64" rx="16" fill="#000000" opacity="0"/><title>Das ganze H\xF6rspiel als Tondatei</title></g>`;
  let c10 = (e18, t11, n11, r11, i11) => `<g class="lh-key${i11 ? ` is-off` : ``}" data-a="${e18}"><rect x="${t11}" y="98" width="52" height="42" rx="12" fill="#e9ecef"/><path d="${n11}" stroke="${i11 ? `#adb5bd` : `#343a40`}" stroke-width="4" stroke-linecap="round"/><rect class="lh-kdown" x="${t11}" y="98" width="52" height="42" rx="12" fill="#000000" opacity="0"/><title>${r11}</title></g>`;
  o10 += c10(`zoom-out`, 16, `M30 119h24`, `Zeitleiste verkleinern`, i10.zoom <= 1), o10 += `<text x="108" y="127" font-size="22" font-family="${Ju}" font-weight="700" text-anchor="middle" fill="#495057">${i10.zoom}\xD7</text>`, o10 += c10(`zoom-in`, 148, `M162 119h24M174 107v24`, `Zeitleiste vergr\xF6\xDFern`, i10.zoom >= id(e17)), o10 += `<g class="lh-key" data-a="seek"><rect x="${Qu}" y="100" width="1050" height="40" fill="#f1f3f5" rx="8"/>`;
  let l10 = [0.5, 1, 2, 5, 10, 15, 30].find((e18) => i10.span / e18 <= 14) ?? 30;
  for (let e18 = Math.ceil(i10.from / l10) * l10; e18 <= i10.from + i10.span + 1e-6; e18 += l10) {
    let t11 = od(i10, e18), n11 = Math.abs(e18 - Math.round(e18)) < 1e-6;
    o10 += `<path d="M${Yu(t11)} 122v${n11 ? 14 : 8}" stroke="#868e96" stroke-width="2"/>`, n11 && (o10 += `<text x="${Yu(t11)}" y="117" font-size="16" font-family="${Ju}" text-anchor="middle" fill="#868e96">${cd(Math.round(e18))}</text>`);
  }
  o10 += `</g>`;
  for (let e18 of [2, 1, 0]) {
    let t11 = nd(e18), n11 = Nu[e18].color;
    o10 += `<rect x="20" y="${t11}" width="196" height="${ed}" rx="18" fill="${n11}"/>${zee(e18, 118, t11 + 54)}<text x="118" y="${t11 + 116}" font-size="26" font-family="${Ju}" font-weight="700" text-anchor="middle" fill="#ffffff">${Nu[e18].label}</text>`, o10 += `<rect x="${Qu}" y="${t11}" width="1050" height="${ed}" rx="14" fill="${n11}" opacity="0.08"/>`;
  }
  if (e17.clips.forEach((e18, t11) => {
    let n11 = sd(i10, e18.start, e18.dur);
    if (!n11) return;
    let r11 = nd(e18.track) + 10, s11 = Nu[e18.track].color, c11 = ju(e18), l11 = Lee(e18), u10 = c11 ? `fill="#ffffff" stroke="${s11}" stroke-width="3" stroke-dasharray="10 7"` : `fill="${s11}" stroke="#ffffff" stroke-width="3" opacity="${Yu(0.55 + 0.45 * Math.min(1, e18.vol))}"`;
    o10 += `<g class="lh-hs-clip" data-clip="${t11}"><rect x="${Yu(n11.x)}" y="${r11}" width="${Yu(n11.w)}" height="140" rx="14" ${u10}/>`;
    let d10 = n11.w < 90 ? 16 : 24, f10 = Math.max(2, Math.floor((n11.w - 16) / (d10 * 0.56)));
    o10 += `<text x="${Yu(n11.x + 8)}" y="${r11 + 44}" font-size="${d10}" font-family="${Ju}" font-weight="700" fill="${c11 ? s11 : `#ffffff`}">${Pee(l11.length > f10 ? l11.slice(0, Math.max(1, f10 - 1)) + `\u2026` : l11)}</text>`;
    let p10 = e18.track === 2 && !e18.noPic && n11.w >= 96 && e18.img ? a10[e18.img] : void 0;
    p10 ? o10 += `<rect x="${Yu(n11.x + 8)}" y="${r11 + 54}" width="78" height="78" rx="10" fill="#ffffff"/><image href="${p10.dataUrl}" x="${Yu(n11.x + 11)}" y="${r11 + 57}" width="72" height="72" preserveAspectRatio="xMidYMid meet"/>` : e18.track === 2 && !e18.noPic && !e18.img && e18.fx && n11.w >= 96 ? o10 += `<g transform="translate(${Yu(n11.x + 10)} ${r11 + 54}) scale(0.76)">${fd[e18.fx]}</g>` : c11 && n11.w > 46 && (o10 += Ree(n11.x + 22, r11 + 92, s11)), o10 += `</g>`;
  }), o10 += `<g class="lh-hs-head" pointer-events="none"><path d="M${Qu} 98V${nd(0) + ed}" stroke="#e03131" stroke-width="4"/><path d="M220 92h20l-10 14z" fill="#e03131"/></g>`, i10.zoom > 1) {
    let t11 = 1050 * i10.span / e17.len, n11 = Qu + 1050 * i10.from / e17.len;
    o10 += `<g class="lh-key" data-a="scroll"><rect x="${Qu}" y="${td}" width="1050" height="20" rx="10" fill="#e9ecef"/><rect class="lh-hs-thumb" x="${Yu(n11)}" y="${td}" width="${Yu(t11)}" height="20" rx="10" fill="#868e96"/><title>Zeitleiste verschieben</title></g>`;
  }
  return e17.clips.length || (o10 += `<text x="755" y="${nd(1) + ed / 2 + 12}" font-size="28" font-family="${Ju}" font-weight="700" text-anchor="middle" fill="#868e96">${r10 ? `Oben f\xFCgst du Ger\xE4usche, Sprache und Musik hinzu.` : `Noch leer`}</text>`), o10 + `</svg>`;
}
var md = /* @__PURE__ */ new WeakMap();
function Vee(e17) {
  let t10 = md.get(e17);
  if (t10) return t10;
  let n10 = e17.getChannelData(0), r10 = Math.max(1, Math.round(e17.sampleRate * 0.02)), i10 = [], a10 = 0;
  for (let e18 = 0; e18 + r10 <= n10.length; e18 += r10) {
    let t11 = 0;
    for (let i11 = e18; i11 < e18 + r10; i11 += 2) t11 += n10[i11] * n10[i11];
    let o11 = Math.sqrt(t11 / Math.ceil(r10 / 2));
    i10.push(o11), o11 > a10 && (a10 = o11);
  }
  let o10 = i10.filter((e18) => e18 > a10 * 0.15 && e18 > 2e-3), s10 = o10.length ? Math.sqrt(o10.reduce((e18, t11) => e18 + t11 * t11, 0) / o10.length) : a10, c10 = Bu(0.16 / Math.max(s10, 1e-4), 0.6, 12);
  return md.set(e17, c10), c10;
}
function Hee(e17, t10) {
  let n10 = e17.createBiquadFilter();
  n10.type = `highpass`, n10.frequency.value = 90, n10.Q.value = 0.7;
  let r10 = e17.createBiquadFilter();
  r10.type = `peaking`, r10.frequency.value = 3200, r10.Q.value = 0.9, r10.gain.value = 4;
  let i10 = e17.createDynamicsCompressor();
  i10.threshold.value = -24, i10.knee.value = 6, i10.ratio.value = 3.5, i10.attack.value = 4e-3, i10.release.value = 0.2;
  let a10 = e17.createGain();
  return a10.gain.value = 1.5, n10.connect(r10).connect(i10).connect(a10).connect(t10), n10;
}
function hd(e17, t10, n10, r10, i10) {
  let { ctx: a10 } = e17, o10 = [0, 1, 2].map(() => {
    let t11 = a10.createGain();
    return t11.connect(e17.out), t11;
  }), s10 = Mu(t10.boost) ? Hee(a10, o10[1]) : o10[1];
  if (Mu(t10.duck) && i10 === void 0) {
    let e18 = t10.clips.filter((e19) => e19.track === 1 && e19.sound && e19.start + e19.dur > r10).map((e19) => [e19.start, e19.start + e19.dur]).sort((e19, t11) => e19[0] - t11[0]), i11 = [];
    for (let t11 of e18) {
      let e19 = i11[i11.length - 1];
      e19 && t11[0] <= e19[1] + 0.6 ? e19[1] = Math.max(e19[1], t11[1]) : i11.push([...t11]);
    }
    let a11 = o10[0].gain, s11 = t10.duckLevel ?? 0.3;
    a11.setValueAtTime(1, Math.max(0, n10 + r10));
    for (let [e19, t11] of i11) e19 <= r10 ? a11.setValueAtTime(s11, Math.max(0, n10 + r10)) : a11.setTargetAtTime(s11, n10 + e19 - 0.15, 0.08), a11.setTargetAtTime(1, n10 + t11 + 0.15, 0.3);
  }
  let c10 = [], l10 = [];
  return t10.clips.forEach((u10, d10) => {
    if (i10 !== void 0 && d10 !== i10 || u10.start + u10.dur <= r10 || ju(u10)) return;
    let f10 = Math.max(0, r10 - u10.start), p10 = n10 + u10.start + f10, m10 = a10.createGain();
    m10.gain.value = u10.vol;
    let h10 = u10.track === 1 && !!u10.sound;
    if (m10.connect(h10 ? s10 : o10[u10.track]), u10.sound) l10.push(e17.buffer(u10.sound).then((n11) => {
      if (!n11 || !e17.alive()) return;
      h10 && Mu(t10.boost) && (m10.gain.value = u10.vol * Vee(n11));
      let r11 = a10.createBufferSource();
      r11.buffer = n11, r11.connect(m10);
      let i11 = Math.max(a10.currentTime, p10);
      r11.start(i11, f10 + Math.max(0, i11 - p10), Math.max(0.05, u10.dur - f10)), e17.stops.push(r11);
    }));
    else if (u10.fx) {
      if (!Iu(u10.fx)?.loop && f10 > 0.3) return;
      Ku({ ctx: a10, out: m10, noise: e17.noise, stops: e17.stops }, u10.fx, p10, u10.dur - f10);
    } else u10.mood && c10.push({ clip: u10, out: m10, done: f10 });
  }), { moods: c10, ready: Promise.all(l10).then(() => void 0) };
}
function gd(e17, t10, n10, r10) {
  for (let i10 of t10) {
    let t11 = i10.clip, a10 = Math.min(t11.dur, r10 - t11.start);
    a10 <= i10.done || (qu(t11.mood, i10.done, a10, (r11, a11, o10, s10, c10) => e17.note(a11, o10, n10 + t11.start + r11, c10, s10, i10.out)), i10.done = a10);
  }
}
var _d = /* @__PURE__ */ new Map();
var vd = /* @__PURE__ */ new Map();
var yd = /* @__PURE__ */ new Map();
var bd = /* @__PURE__ */ new Map();
var xd = /* @__PURE__ */ new Map();
var Sd = /* @__PURE__ */ new Map();
var Cd = /* @__PURE__ */ new WeakMap();
var wd = /* @__PURE__ */ new WeakSet();
var Td = /* @__PURE__ */ new Set();
var Ed = null;
var Dd = null;
var Od = null;
var kd = null;
function Uee(e17, t10, n10) {
  Ed = e17, Dd = t10, Od = n10;
}
var Ad = (e17) => xd.get(e17)?.it.hs ?? Lu();
var jd = (e17) => {
  let t10 = yd.get(e17);
  return ad(Ad(e17), t10?.zoom ?? 1, t10?.from ?? 0);
};
function Md(e17, t10, n10) {
  let r10 = n10.get(t10.id);
  return r10 || (r10 = fetch(t10.dataUrl).then((e18) => e18.arrayBuffer()).then((t11) => new Promise((n11) => e17.decodeAudioData(t11, n11, () => n11(null)))).catch(() => null), n10.set(t10.id, r10)), r10;
}
function Nd(e17) {
  let t10 = Ad(e17), n10 = jd(e17), r10 = _d.get(e17), i10 = r10 ? Math.max(0, r10.out.context.currentTime - r10.t0) : vd.get(e17) ?? 0, a10 = Td.has(e17);
  for (let o10 of bd.get(e17) ?? []) {
    o10.classList.toggle(`is-running`, !!r10), o10.classList.toggle(`is-saving`, a10);
    let e18 = o10.querySelector(`.lh-hs-time`);
    e18 && (e18.textContent = a10 ? `Datei \u2026` : `${cd(i10)} / ${cd(t10.len)}`);
    let s10 = o10.querySelector(`.lh-hs-head`), c10 = od(n10, Math.min(t10.len, i10));
    s10?.setAttribute(`transform`, `translate(${Yu(c10 - Qu)} 0)`), s10?.setAttribute(`opacity`, c10 < 229 || c10 > 1281 ? `0` : `1`);
  }
}
function Pd(e17) {
  let t10 = xd.get(e17);
  if (t10) for (let n10 of bd.get(e17) ?? []) n10.isConnected && Ud(n10, t10.it, true, { assets: t10.assets });
}
function Fd(e17, t10, n10, r10 = false) {
  let i10 = ad(Ad(e17), t10, n10);
  yd.set(e17, { zoom: i10.zoom, from: i10.from }), r10 ? requestAnimationFrame(() => Pd(e17)) : Pd(e17);
}
function Id(e17, t10) {
  let n10 = Ad(e17), r10 = jd(e17), i10 = rd[Bu(rd.indexOf(r10.zoom) + t10, 0, rd.length - 1)], a10 = vd.get(e17) ?? 0, o10 = n10.len / Math.min(i10, id(n10)), s10 = _d.get(e17);
  Fd(e17, i10, (s10 ? s10.out.context.currentTime - s10.t0 : a10) - o10 / 3, true);
}
function Ld(e17, t10) {
  Rd(e17);
  let n10 = ys(), r10 = xd.get(e17);
  if (!n10 || !r10) return;
  let i10 = Ad(e17), a10 = t10 === void 0 ? (vd.get(e17) ?? 0) >= i10.len - 0.2 ? 0 : vd.get(e17) ?? 0 : i10.clips[t10].start, o10 = n10.ctx.currentTime + 0.08 - a10, s10 = { t0: o10, out: n10.out, stops: [], timer: 0, raf: 0, moods: [] };
  _d.set(e17, s10);
  let c10 = { ctx: n10.ctx, noise: n10.noise, out: n10.out, stops: s10.stops, buffer: (e18) => {
    let t11 = r10.assets[e18];
    return t11 ? Md(n10.ctx, t11, Sd) : Promise.resolve(null);
  }, alive: () => _d.get(e17) === s10, note: (e18, t11, r11, i11, a11, o11) => {
    let s11 = ms(e18, t11, { when: r11, vel: i11, out: o11 });
    s11 && setTimeout(() => s11.release(), Math.max(0, (r11 + a11 - n10.ctx.currentTime) * 1e3));
  } };
  s10.moods = hd(c10, i10, o10, a10, t10).moods;
  let l10 = () => gd(c10, s10.moods, o10, n10.ctx.currentTime - o10 + 0.3);
  l10(), s10.timer = window.setInterval(l10, 60);
  let u10 = t10 === void 0 ? Math.min(i10.len, Math.max(0, ...i10.clips.map((e18) => e18.start + e18.dur)) + 0.5) : i10.clips[t10].start + i10.clips[t10].dur, d10 = () => {
    if (_d.get(e17) !== s10) return;
    let r11 = n10.ctx.currentTime - o10;
    if (r11 >= u10 || ![...bd.get(e17) ?? []].some((e18) => e18.isConnected)) {
      Rd(e17, t10 === void 0 ? Math.min(r11, i10.len) : a10);
      return;
    }
    let c11 = jd(e17);
    c11.zoom > 1 && t10 === void 0 && (r11 > c11.from + c11.span * 0.92 || r11 < c11.from) && Fd(e17, c11.zoom, r11 - c11.span * 0.08), Nd(e17), s10.raf = requestAnimationFrame(d10);
  };
  s10.raf = requestAnimationFrame(d10), Nd(e17);
}
function Rd(e17, t10) {
  let n10 = _d.get(e17);
  if (!n10) return;
  _d.delete(e17), clearInterval(n10.timer), cancelAnimationFrame(n10.raf);
  let r10 = n10.out.context;
  n10.out.gain.setTargetAtTime(0, r10.currentTime, 0.05), setTimeout(() => n10.out.disconnect(), 400);
  for (let e18 of n10.stops) try {
    e18.stop(r10.currentTime + 0.3);
  } catch {
  }
  n10.moods.length && hs(), vd.set(e17, t10 ?? Math.max(0, r10.currentTime - n10.t0)), Nd(e17);
}
async function Kee(e17, t10) {
  let n10 = window.OfflineAudioContext ?? window.webkitOfflineAudioContext, r10 = e17.clips.filter((e18) => !ju(e18));
  if (!n10 || !r10.length) return null;
  let i10 = Math.min(e17.len, Math.max(...r10.map((e18) => e18.start + e18.dur))) + 0.8, a10 = 44100, o10 = new n10(2, Math.ceil(i10 * a10), a10), s10 = iee(o10), c10 = /* @__PURE__ */ new Map(), l10 = { ctx: s10.ctx, noise: s10.noise, out: s10.out(), stops: [], buffer: (e18) => t10[e18] ? Md(s10.ctx, t10[e18], c10) : Promise.resolve(null), alive: () => true, note: s10.note }, { moods: u10, ready: d10 } = hd(l10, e17, 0, 0);
  return gd(l10, u10, 0, e17.len), await d10, o10.startRendering();
}
async function Hd(e17, t10 = `H\xF6rspiel`) {
  let n10 = xd.get(e17);
  if (!n10) return `failed`;
  if (Td.has(e17)) return `busy`;
  Rd(e17), Td.add(e17), Nd(e17);
  try {
    let r10 = await Kee(Ad(e17), n10.assets);
    if (!r10) return `empty`;
    let i10 = Aee(r10), a10 = kd ? await kd(i10).catch(() => null) : null;
    return await Au(a10 ?? i10, `${t10} ${ku()}.${a10 ? `m4a` : `wav`}`), `ok`;
  } catch (e18) {
    return console.warn(`[hoerspiel] the play could not be saved`, e18), `failed`;
  } finally {
    Td.delete(e17), Nd(e17);
  }
}
function Ud(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h));
  n10 && xd.set(t10.id, { it: t10, assets: r10.assets ?? xd.get(t10.id)?.assets ?? {} });
  let o10 = n10 && !!Dd, s10 = t10.hs ?? Lu(), c10 = n10 ? jd(t10.id) : Iee(s10), l10 = `${i10}x${a10}|${n10}|${o10}|${c10.zoom},${Yu(c10.from)}|${JSON.stringify(t10.hs)}`;
  if (e17.dataset.k === l10) return;
  e17.dataset.k = l10, e17.setAttribute(`aria-label`, `H\xF6rspiel mit ${(t10.hs?.clips ?? []).length === 1 ? `einem Teil` : `${(t10.hs?.clips ?? []).length} Teilen`}`);
  let u10 = Bee(s10, i10, a10, o10, c10, r10.assets ?? xd.get(t10.id)?.assets ?? {});
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(u10) : Nee(u10), t11.style.width = `${i10}px`, t11.style.height = `${a10}px`, e17.replaceChildren(t11);
    return;
  }
  let d10 = document.createElement(`div`);
  d10.className = `lh-wg-pic`, d10.innerHTML = u10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(d10), t10.locked && e17.classList.add(`is-armed`);
  let f10 = bd.get(t10.id);
  f10 || bd.set(t10.id, f10 = /* @__PURE__ */ new Set());
  for (let e18 of f10) e18.isConnected || f10.delete(e18);
  f10.add(e17), Nd(t10.id), Cd.set(e17, t10.id), Si(e17, { slide: false, hit: (t11) => {
    let n11 = Cd.get(e17), r11 = t11.getAttribute(`data-a`);
    if (!n11) return null;
    if (r11 === `play`) _d.has(n11) ? Rd(n11) : Ld(n11);
    else if (r11 === `home`) {
      Rd(n11, 0), vd.set(n11, 0);
      let e18 = jd(n11);
      e18.zoom > 1 && Fd(n11, e18.zoom, 0, true), Nd(n11);
    } else r11 === `add-fx` || r11 === `add-rec` || r11 === `add-music` ? (Rd(n11), Dd?.(n11, r11 === `add-fx` ? `fx` : r11 === `add-rec` ? `rec` : `music`, vd.get(n11) ?? 0)) : r11 === `save` ? Hd(n11) : r11 === `zoom-in` ? Id(n11, 1) : r11 === `zoom-out` && Id(n11, -1);
    return null;
  } }), wd.has(e17) || (wd.add(e17), e17.addEventListener(`pointerdown`, (t11) => {
    let n11 = Cd.get(e17);
    if (!n11 || t11.button > 0 || !Ti(e17) || !e17.querySelector(`svg`)) return;
    let r11 = (t12) => {
      let n12 = (e17.querySelector(`svg`) ?? e17).getBoundingClientRect();
      return n12.width ? (t12 - n12.left) / n12.width * Xu : Qu;
    }, i11 = (e18) => {
      let t12 = jd(n11);
      return Bu(t12.from + (r11(e18) - Qu) / 1050 * t12.span, 0, Ad(n11).len);
    }, a11 = t11.target;
    if (a11.closest(`[data-a="seek"]`)) {
      let e18 = jd(n11).zoom >= 4 ? 10 : 2, r12 = Math.round(i11(t11.clientX) * e18) / e18, a12 = _d.has(n11);
      Rd(n11, r12), vd.set(n11, r12), Nd(n11), a12 && Ld(n11);
      return;
    }
    if (a11.closest(`[data-a="scroll"]`)) {
      t11.preventDefault();
      let e18 = Ad(n11), i12 = jd(n11), o12 = e18.len / 1050, s12 = !!a11.closest(`.lh-hs-thumb`), c12 = s12 ? i12.from : Bu((r11(t11.clientX) - Qu) * o12 - i12.span / 2, 0, e18.len - i12.span), l12 = r11(t11.clientX);
      s12 || Fd(n11, i12.zoom, c12);
      let u12 = 0, d12 = (e19) => {
        e19.pointerId === t11.pointerId && (cancelAnimationFrame(u12), u12 = requestAnimationFrame(() => Fd(n11, i12.zoom, c12 + (r11(e19.clientX) - l12) * o12)));
      }, f12 = (e19) => {
        e19.pointerId === t11.pointerId && (window.removeEventListener(`pointermove`, d12), window.removeEventListener(`pointerup`, f12, true), window.removeEventListener(`pointercancel`, f12, true));
      };
      window.addEventListener(`pointermove`, d12), window.addEventListener(`pointerup`, f12, true), window.addEventListener(`pointercancel`, f12, true);
      return;
    }
    let o11 = a11.closest(`[data-clip]`);
    if (!o11) return;
    t11.preventDefault();
    let s11 = Number(o11.getAttribute(`data-clip`)), c11 = Ad(n11), l11 = c11.clips[s11];
    if (!l11) return;
    let u11 = jd(n11), d11 = u11.zoom >= 4 ? 20 : 4, f11 = i11(t11.clientX), p10 = false, m10 = l11.start, h10 = o11.querySelector(`rect`), g10 = o11.querySelector(`text`), _10 = (e18) => {
      if (e18.pointerId !== t11.pointerId || !Ed) return;
      let n12 = i11(e18.clientX) - f11;
      if (!p10 && Math.abs(n12) < u11.span / 150) return;
      p10 = true, m10 = Math.min(c11.len - l11.dur, Math.max(0, Math.round((l11.start + n12) * d11) / d11));
      let r12 = sd(u11, m10, l11.dur);
      r12 && (h10?.setAttribute(`x`, String(Yu(r12.x))), h10?.setAttribute(`width`, String(Yu(r12.w))), g10?.setAttribute(`x`, String(Yu(r12.x + 8))));
    }, v10 = (e18) => {
      if (e18.pointerId === t11.pointerId && (window.removeEventListener(`pointermove`, _10), window.removeEventListener(`pointerup`, v10, true), window.removeEventListener(`pointercancel`, v10, true), e18.type !== `pointercancel` || p10)) {
        if (p10 && Ed) {
          let e19 = c11.clips.map((e20, t12) => t12 === s11 ? { ...e20, start: m10 } : e20);
          Ed(n11, { ...c11, clips: e19 });
        } else p10 || (Od ? Od(n11, s11) : Ld(n11, s11));
      }
    };
    window.addEventListener(`pointermove`, _10), window.addEventListener(`pointerup`, v10, true), window.addEventListener(`pointercancel`, v10, true);
  }));
}
var Jee = `
.lh-wg-hoerspiel.is-running .lh-hs-play{opacity:0}
.lh-wg-hoerspiel.is-running .lh-hs-stop{opacity:1}
.lh-wg-hoerspiel.is-saving .lh-hs-save{opacity:.5}
.lh-wg-hoerspiel .lh-key.is-off{opacity:.5}
.lh-wg-hoerspiel .lh-hs-clip{cursor:grab}`;
var hte = [{ rms: 8e-3, clarity: 0.7, dip: 0.25 }, { rms: 5e-3, clarity: 0.62, dip: 0.3 }, { rms: 25e-4, clarity: 0.55, dip: 0.35 }, { rms: 12e-4, clarity: 0.5, dip: 0.4 }, { rms: 6e-4, clarity: 0.45, dip: 0.45 }];
var gte = (e17) => hte[Math.min(5, Math.max(1, Math.round(e17.sens ?? 3))) - 1];
var _te = 1200;
var Hf = [{ id: `chromatic`, label: `Chromatisch`, strings: [], fmin: 30, fmax: 2e3 }, { id: `guitar`, label: `Gitarre`, strings: [40, 45, 50, 55, 59, 64], fmin: 60, fmax: 1400 }, { id: `ukulele`, label: `Ukulele`, strings: [67, 60, 64, 69], fmin: 180, fmax: 1100 }, { id: `bass`, label: `Bass`, strings: [28, 33, 38, 43], fmin: 30, fmax: 500 }, { id: `violin`, label: `Violine`, strings: [55, 62, 69, 76], fmin: 170, fmax: 3e3 }, { id: `cello`, label: `Cello`, strings: [36, 43, 50, 57], fmin: 55, fmax: 1e3 }];
var Uf = { inst: `chromatic`, a4: 440 };
var Wf = (e17) => Hf.find((t10) => t10.id === e17) ?? Hf[0];
var vte = [`C`, `C\u266F`, `D`, `D\u266F`, `E`, `F`, `F\u266F`, `G`, `G\u266F`, `A`, `A\u266F`, `H`];
var Kf = (e17) => vte[(Math.round(e17) % 12 + 12) % 12];
var yte = (e17) => Math.floor(Math.round(e17) / 12) - 1;
function bte(e17, t10, n10, r10, i10 = 25e-4, a10 = 0.35) {
  let o10 = 0;
  for (let t11 = 0; t11 < e17.length; t11++) o10 += e17[t11] * e17[t11];
  if (o10 = Math.sqrt(o10 / e17.length), o10 < i10) return null;
  let s10 = Math.floor(e17.length / 2), c10 = Math.max(2, Math.floor(t10 / r10)), l10 = Math.min(e17.length - s10 - 1, Math.ceil(t10 / n10));
  if (l10 <= c10 + 2) return null;
  let u10 = new Float32Array(l10 + 2);
  for (let t11 = 1; t11 <= l10 + 1; t11++) {
    let n11 = 0;
    for (let r11 = 0; r11 < s10; r11++) {
      let i11 = e17[r11] - e17[r11 + t11];
      n11 += i11 * i11;
    }
    u10[t11] = n11;
  }
  let d10 = new Float32Array(l10 + 2);
  d10[0] = 1;
  let f10 = 0;
  for (let e18 = 1; e18 <= l10 + 1; e18++) f10 += u10[e18], d10[e18] = f10 > 0 ? u10[e18] * e18 / f10 : 1;
  let p10 = -1;
  for (let e18 = c10; e18 <= l10; e18++) if (d10[e18] < 0.15) {
    for (; e18 + 1 <= l10 && d10[e18 + 1] < d10[e18]; ) e18++;
    p10 = e18;
    break;
  }
  if (p10 < 0) {
    let e18 = c10;
    for (let t11 = c10; t11 <= l10; t11++) d10[t11] < d10[e18] && (e18 = t11);
    if (d10[e18] > a10) return null;
    p10 = e18;
  }
  let m10 = d10[p10 - 1], h10 = d10[p10], g10 = d10[p10 + 1] ?? h10, _10 = m10 - 2 * h10 + g10, v10 = t10 / (_10 ? p10 + (m10 - g10) / (2 * _10) : p10);
  return v10 >= n10 * 0.9 && v10 <= r10 * 1.1 ? { f: v10, clarity: 1 - h10 } : null;
}
var xte = 1300;
var Ste = 720;
var qf = `"Nunito", Nunito, system-ui, Verdana, sans-serif`;
var Jf = 650;
var Yf = 790;
var Cte = 640;
var wte = 44;
var Tte = (e17) => Math.max(-50, Math.min(50, e17)) / 50 * wte;
function Xf(e17, t10) {
  let n10 = (e17 - 90) * Math.PI / 180;
  return { x: Jf + Math.cos(n10) * t10, y: Yf + Math.sin(n10) * t10 };
}
function Zf(e17, t10, n10, r10, i10) {
  let a10 = Xf(e17, r10), o10 = Xf(t10, r10), s10 = Xf(t10, n10), c10 = Xf(e17, n10);
  return `<path d="M${a10.x.toFixed(1)} ${a10.y.toFixed(1)}A${r10} ${r10} 0 0 1 ${o10.x.toFixed(1)} ${o10.y.toFixed(1)}L${s10.x.toFixed(1)} ${s10.y.toFixed(1)}A${n10} ${n10} 0 0 0 ${c10.x.toFixed(1)} ${c10.y.toFixed(1)}z" fill="${i10}"/>`;
}
function Ete(e17, t10) {
  let n10 = Wf(e17.inst), r10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${xte} ${Ste}" width="100%" height="100%" preserveAspectRatio="none">`;
  r10 += `<defs><linearGradient id="tn-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b4250"/><stop offset="1" stop-color="#1b1f27"/></linearGradient><linearGradient id="tn-face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#efe3c4"/></linearGradient><linearGradient id="tn-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/></linearGradient><linearGradient id="tn-lcd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1a14"/><stop offset="1" stop-color="#16261d"/></linearGradient><clipPath id="tn-win"><rect x="90" y="40" width="1120" height="370" rx="30"/></clipPath></defs>`, r10 += `<rect x="4" y="4" width="1292" height="712" rx="54" fill="url(#tn-body)" stroke="#11141a" stroke-width="8"/>`, r10 += `<rect x="22" y="22" width="1256" height="676" rx="40" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="3"/>`, r10 += `<rect x="84" y="34" width="1132" height="382" rx="36" fill="#0d1015"/>`, r10 += `<g clip-path="url(#tn-win)"><rect x="90" y="40" width="1120" height="370" fill="url(#tn-face)"/>`, r10 += Zf(-44, -12, 570, 600, `#f8b4b4`) + Zf(12, wte, 570, 600, `#f8b4b4`), r10 += Zf(-12, -4.4, 570, 600, `#ffe08a`) + Zf(4.4, 12, 570, 600, `#ffe08a`), r10 += Zf(-4.4, 4.4, 570, 600, `#7bd88f`);
  for (let e18 = -50; e18 <= 50; e18 += 5) {
    let t11 = Tte(e18), n11 = e18 % 10 == 0, i10 = Xf(t11, 600), a10 = Xf(t11, Cte - (n11 ? 4 : 18));
    if (r10 += `<line x1="${i10.x.toFixed(1)}" y1="${i10.y.toFixed(1)}" x2="${a10.x.toFixed(1)}" y2="${a10.y.toFixed(1)}" stroke="#3b2f1e" stroke-width="${e18 === 0 ? 7 : n11 ? 4.5 : 2.5}" stroke-linecap="round"/>`, n11) {
      let n12 = Xf(t11, 670);
      r10 += `<text x="${n12.x.toFixed(1)}" y="${n12.y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family='${qf}' font-size="${e18 === 0 ? 34 : 26}" font-weight="${e18 === 0 ? 800 : 600}" fill="#3b2f1e" transform="rotate(${t11.toFixed(1)} ${n12.x.toFixed(1)} ${n12.y.toFixed(1)})">${e18 > 0 ? `+` + e18 : e18}</text>`;
    }
  }
  if (r10 += `<text x="150" y="380" font-family='${qf}' font-size="64" font-weight="800" fill="#b08d57">\u266D</text>`, r10 += `<text x="1150" y="380" text-anchor="end" font-family='${qf}' font-size="64" font-weight="800" fill="#b08d57">\u266F</text>`, r10 += `<text x="${Jf}" y="384" text-anchor="middle" font-family='${qf}' font-size="24" font-weight="700" letter-spacing="6" fill="#b08d57">CENT</text>`, r10 += `<g class="tn-needle" transform="rotate(0 ${Jf} ${Yf})"><path d="M645 630L${Jf} 158L655 630z" fill="#c92a2a"/><rect x="647" y="490" width="6" height="150" fill="#212529"/></g>`, r10 += `<rect x="90" y="40" width="1120" height="370" fill="url(#tn-glass)"/></g>`, r10 += `<rect x="90" y="440" width="300" height="150" rx="26" fill="#11151c" stroke="#000000" stroke-opacity="0.4" stroke-width="3"/>`, r10 += `<g class="lh-key tn-mic" data-a="mic"><circle cx="160" cy="515" r="46" fill="#2f9e44" class="tn-micbtn"/><path d="M160 486a13 13 0 0 1 13 13v18a13 13 0 0 1-26 0v-18a13 13 0 0 1 13-13zM138 515a22 22 0 0 0 44 0M160 537v12M148 549h24" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="100" y="455" width="280" height="120" fill="#000000" opacity="0"/></g>`, r10 += `<text class="tn-status" x="222" y="505" font-family='${qf}' font-size="28" font-weight="800" fill="#e9ecef" pointer-events="none">${t10 ? `Start` : `Stimmger\xE4t`}</text>`, r10 += `<text class="tn-status2" x="222" y="540" font-family='${qf}' font-size="21" fill="#adb5bd" pointer-events="none">${t10 ? `Mikrofon an` : `\xFCber das Mikrofon`}</text>`, r10 += `<rect x="420" y="440" width="460" height="150" rx="26" fill="url(#tn-lcd)" stroke="#000000" stroke-opacity="0.5" stroke-width="3"/>`, r10 += `<text class="tn-note" x="628" y="522" text-anchor="middle" dominant-baseline="central" font-family='${qf}' font-size="112" font-weight="800" fill="#5c7c66">\u2013</text>`, r10 += `<text class="tn-oct" x="700" y="560" font-family='${qf}' font-size="40" font-weight="700" fill="#5c7c66"></text>`, r10 += `<text class="tn-freq" x="860" y="574" text-anchor="end" font-family='${qf}' font-size="22" font-weight="600" fill="#5c7c66"></text>`, r10 += `<rect x="910" y="440" width="300" height="150" rx="26" fill="#11151c" stroke="#000000" stroke-opacity="0.4" stroke-width="3"/>`, r10 += `<text class="tn-hint" x="1060" y="500" text-anchor="middle" font-family='${qf}' font-size="34" font-weight="800" fill="#e9ecef">${t10 ? `Spiel einen Ton` : ``}</text>`, r10 += `<text class="tn-cents" x="1060" y="548" text-anchor="middle" font-family='${qf}' font-size="26" font-weight="600" fill="#adb5bd"></text>`, Hf.forEach((t11, n11) => {
    let i10 = t11.id === e17.inst, a10 = 90 + n11 * 189;
    r10 += `<g class="lh-key" data-a="inst:${t11.id}"><rect x="${a10}" y="606" width="175" height="40" rx="20" fill="${i10 ? `#e8c27a` : `#2b313c`}" stroke="${i10 ? `#e8c27a` : `#4a5363`}" stroke-width="2"/><text x="${a10 + 87.5}" y="626" text-anchor="middle" dominant-baseline="central" font-family='${qf}' font-size="21" font-weight="700" fill="${i10 ? `#1b1f27` : `#ced4da`}">${t11.label}</text></g>`;
  }), n10.strings.length) {
    let e18 = n10.strings.length, t11 = Jf - (e18 * 150 + (e18 - 1) * 18) / 2;
    n10.strings.forEach((e19, n11) => {
      let i10 = t11 + n11 * 168;
      r10 += `<g class="lh-key tn-string" data-a="str:${n11}" data-s="${n11}"><rect x="${i10}" y="656" width="150" height="46" rx="14" fill="#2b313c" stroke="#4a5363" stroke-width="2" class="tn-strbg"/><text x="${i10 + 75 - 8}" y="680" text-anchor="middle" dominant-baseline="central" font-family='${qf}' font-size="26" font-weight="800" fill="#e9ecef">${Kf(e19)}<tspan font-size="17" dy="8">${yte(e19)}</tspan></text><path d="M${i10 + 150 - 34} 671l12 9-12 9z" fill="#868e96"/></g>`;
    });
  } else r10 += `<text x="${Jf}" y="681" text-anchor="middle" dominant-baseline="central" font-family='${qf}' font-size="22" fill="#868e96">alle T\xF6ne \xB7 Kammerton a = ${e17.a4} Hz</text>`;
  return r10 + `</svg>`;
}
var Qf = /* @__PURE__ */ new Map();
var $f = /* @__PURE__ */ new Map();
var ep = /* @__PURE__ */ new Map();
var tp = null;
var np = /* @__PURE__ */ new Set();
var rp = (e17) => {
  let t10 = ep.get(e17)?.tuner ?? Uf;
  return { ...t10, inst: Qf.get(e17) ?? t10.inst };
};
function ip(e17) {
  let t10 = tp?.id === e17 ? tp : null, n10 = Wf(rp(e17).inst), r10 = t10?.reading && performance.now() - t10.reading.at < _te ? t10.reading : null, i10 = !!r10 && Math.abs(r10.cents) <= 5, a10 = r10 ? i10 ? `#69db7c` : `#ffd43b` : `#5c7c66`;
  for (let o10 of $f.get(e17) ?? []) {
    if (!o10.isConnected) continue;
    let s10 = (e18) => o10.querySelector(e18);
    s10(`.tn-needle`)?.setAttribute(`transform`, `rotate(${(t10?.needle ?? 0).toFixed(2)} ${Jf} ${Yf})`), s10(`.tn-needle`)?.setAttribute(`opacity`, r10 ? `1` : `0.45`);
    let c10 = s10(`.tn-note`), l10 = s10(`.tn-oct`), u10 = r10 ? r10.string >= 0 ? n10.strings[r10.string] : Math.round(r10.m) : 0;
    c10 && (c10.textContent = r10 ? Kf(u10) : `\u2013`, c10.setAttribute(`fill`, a10)), l10 && (l10.textContent = r10 ? String(yte(u10)) : ``, l10.setAttribute(`fill`, a10));
    let d10 = s10(`.tn-freq`);
    d10 && (d10.textContent = r10 ? `${r10.f.toFixed(1).replace(`.`, `,`)} Hz` : ``, d10.setAttribute(`fill`, a10));
    let f10 = s10(`.tn-hint`), p10 = s10(`.tn-cents`);
    f10 && (f10.textContent = t10 ? r10 ? i10 ? `Gestimmt \u2713` : r10.cents < 0 ? r10.cents < -50 ? `Viel zu tief` : `Zu tief` : r10.cents > 50 ? `Viel zu hoch` : `Zu hoch` : `Spiel einen Ton` : np.has(e17) ? `Kein Mikrofon` : `Mikrofon an`, f10.setAttribute(`fill`, r10 ? i10 ? `#69db7c` : `#ffd43b` : `#e9ecef`)), p10 && (p10.textContent = r10 ? `${r10.cents > 0 ? `+` : r10.cents < 0 ? `\u2212` : `\xB1`}${Math.abs(Math.round(r10.cents))} Cent${r10.string >= 0 ? ` \xB7 Saite ${r10.string + 1}` : ``}` : np.has(e17) && !t10 ? `im Browser erlauben` : ``);
    let m10 = s10(`.tn-status`), h10 = s10(`.tn-status2`);
    m10 && (m10.textContent = t10 ? `H\xF6rt zu` : `Start`), h10 && (h10.textContent = t10 ? `Tippen: aus` : `Mikrofon an`), s10(`.tn-micbtn`)?.setAttribute(`fill`, t10 ? `#e03131` : `#2f9e44`), o10.querySelectorAll(`.tn-string`).forEach((e18) => {
      let t11 = !!r10 && r10.string === Number(e18.dataset.s), n11 = e18.querySelector(`.tn-strbg`);
      n11?.setAttribute(`fill`, t11 ? i10 ? `#2f9e44` : `#e8c27a` : `#2b313c`), n11?.setAttribute(`stroke`, t11 ? `#ffffff` : `#4a5363`);
    });
  }
}
function ap() {
  let e17 = tp;
  if (!e17) return;
  e17.raf = requestAnimationFrame(ap);
  let t10 = performance.now();
  if (t10 - e17.last >= 70) {
    e17.last = t10, e17.an.getFloatTimeDomainData(e17.buf);
    let n11 = rp(e17.id), r11 = Wf(n11.inst), i10 = gte(n11), a10 = bte(e17.buf, e17.an.context.sampleRate, r11.fmin, r11.fmax, i10.rms, i10.dip);
    if (a10 && a10.clarity > i10.clarity) {
      let i11 = 69 + 12 * Math.log2(a10.f / n11.a4);
      e17.hist.length && Math.abs(i11 - e17.hist[e17.hist.length - 1]) > 0.5 && (e17.hist = []), e17.hist.push(i11), e17.hist.length > 5 && e17.hist.shift();
      let o10 = [...e17.hist].sort((e18, t11) => e18 - t11)[Math.floor(e17.hist.length / 2)], s10 = -1, c10 = (o10 - Math.round(o10)) * 100;
      r11.strings.length && (s10 = r11.strings.reduce((e18, t11, n12) => Math.abs(o10 - t11) < Math.abs(o10 - r11.strings[e18]) ? n12 : e18, 0), c10 = (o10 - r11.strings[s10]) * 100), e17.reading = { m: o10, cents: c10, f: n11.a4 * 2 ** ((o10 - 69) / 12), string: s10, at: t10 };
    }
  }
  let n10 = e17.reading && t10 - e17.reading.at < _te ? e17.reading : null, r10 = n10 ? Tte(n10.cents) : 0;
  e17.needle += (r10 - e17.needle) * 0.24, ip(e17.id);
}
async function Dte(e17) {
  if (tp?.id === e17) return;
  op();
  let t10 = Vr();
  if (!t10 || !navigator.mediaDevices?.getUserMedia) {
    np.add(e17), ip(e17);
    return;
  }
  pi();
  let n10 = ni();
  try {
    let r10 = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }), i10 = t10.createMediaStreamSource(r10), a10 = t10.createAnalyser();
    a10.fftSize = 4096, i10.connect(a10), np.delete(e17), tp = { id: e17, stream: r10, src: i10, an: a10, buf: new Float32Array(a10.fftSize), end: n10, raf: 0, last: 0, hist: [], reading: null, needle: 0 }, ap();
  } catch (t11) {
    console.warn(`[tuner] no microphone`, t11), n10(), np.add(e17), ip(e17);
  }
}
function op() {
  let e17 = tp;
  e17 && (tp = null, cancelAnimationFrame(e17.raf), e17.src.disconnect(), e17.stream.getTracks().forEach((e18) => e18.stop()), e17.end(), ip(e17.id));
}
var sp = (e17) => tp?.id === e17;
function cp(e17) {
  sp(e17) ? op() : Dte(e17);
}
function lp(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h)), o10 = n10 ? { ...t10.tuner ?? Uf, inst: Qf.get(t10.id) ?? t10.tuner?.inst ?? `chromatic` } : t10.tuner ?? Uf, s10 = `${i10}x${a10}|${n10}|${o10.inst}|${o10.a4}|${o10.sens ?? 3}`;
  if (e17.dataset.k === s10) return;
  e17.dataset.k = s10, e17.setAttribute(`aria-label`, up(t10));
  let c10 = Ete(o10, n10);
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(c10) : `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(c10), t11.style.width = `${i10}px`, t11.style.height = `${a10}px`, e17.replaceChildren(t11);
    return;
  }
  ep.set(t10.id, t10);
  let l10 = $f.get(t10.id);
  l10 || $f.set(t10.id, l10 = /* @__PURE__ */ new Set());
  for (let e18 of l10) e18.isConnected || l10.delete(e18);
  l10.add(e17);
  let u10 = document.createElement(`div`);
  u10.className = `lh-wg-pic`, u10.innerHTML = c10, e17.replaceChildren(u10), t10.locked && e17.classList.add(`is-armed`), e17.dataset.tunerId = t10.id, ip(t10.id), Si(e17, { slide: false, hit: (t11) => {
    let n11 = e17.dataset.tunerId;
    if (!n11) return null;
    let r11 = t11.getAttribute(`data-a`) ?? ``;
    if (r11 === `mic`) cp(n11);
    else if (r11.startsWith(`inst:`)) Qf.set(n11, r11.slice(5)), tp?.id === n11 && (tp.hist = [], tp.reading = null), requestAnimationFrame(() => {
      for (let e18 of $f.get(n11) ?? []) {
        let t12 = ep.get(n11);
        e18.isConnected && t12 && lp(e18, t12, true, {});
      }
    });
    else if (r11.startsWith(`str:`)) {
      let e18 = rp(n11), t12 = Wf(e18.inst).strings[Number(r11.slice(4))];
      if (t12 !== void 0) {
        let n12 = ms(`organ`, t12 + 12 * Math.log2(e18.a4 / 440), { vel: 0.7 });
        setTimeout(() => n12?.release(), 2200);
      }
    }
    return null;
  } });
}
function up(e17) {
  let t10 = Wf((e17.tuner ?? Uf).inst);
  return `Stimmger\xE4t${t10.strings.length ? ` f\xFCr ${t10.label}: ${t10.strings.map(Kf).join(` `)}` : `, chromatisch`}. Tippe auf das Mikrofon und spiel einen Ton.`;
}
var Ote = `
.lh-wg-tuner .lh-key{cursor:pointer}
.lh-edit .lh-wg-tuner:not(.is-armed) .lh-key{cursor:inherit}
`;
var $ne = s(((e17, t10) => {
  function n10(e18) {
    var t11 = [], n11 = 0;
    if (this.trie = this.createTrie(e18.patterns), this.leftMin = e18.leftmin, this.rightMin = e18.rightmin, this.exceptions = {}, e18.exceptions) for (t11 = e18.exceptions.split(/,\s?/g); n11 < t11.length; n11 += 1) this.exceptions[t11[n11].replace(/\u2027/g, ``).toLowerCase()] = RegExp(`(` + t11[n11].split(`\u2027`).join(`)(`) + `)`, `i`);
  }
  n10.TrieNode, n10.prototype.createTrie = function(e18) {
    var t11 = 0, n11 = 0, r10 = 0, i10 = 0, a10 = null, o10 = null, s10 = null, c10 = null, l10 = { _points: [] }, u10;
    for (t11 in e18) if (e18.hasOwnProperty(t11)) for (u10 = e18[t11].match(RegExp(`.{1,` + +t11 + `}`, `g`)), n11 = 0; n11 < u10.length; n11 += 1) {
      for (a10 = u10[n11].replace(/[0-9]/g, ``).split(``), o10 = u10[n11].split(/\D/), c10 = l10, r10 = 0; r10 < a10.length; r10 += 1) s10 = a10[r10].charCodeAt(0), c10[s10] || (c10[s10] = {}), c10 = c10[s10];
      for (c10._points = [], i10 = 0; i10 < o10.length; i10 += 1) c10._points[i10] = o10[i10] || 0;
    }
    return l10;
  }, n10.prototype.hyphenateText = function(e18, t11) {
    t11 ||= 4;
    for (var n11 = e18.split(/([a-zA-Z0-9_\u0027\u00AD\u00DF-\u00EA\u00EB\u00EC-\u00EF\u00F1-\u00F6\u00F8-\u00FD\u0101\u0103\u0105\u0107\u0109\u010D\u010F\u0111\u0113\u0117\u0119\u011B\u011D\u011F\u0123\u0125\u012B\u012F\u0131\u0135\u0137\u013C\u013E\u0142\u0144\u0146\u0148\u0151\u0153\u0155\u0159\u015B\u015D\u015F\u0161\u0165\u016B\u016D\u016F\u0171\u0173\u017A\u017C\u017E\u017F\u0219\u021B\u02BC\u0390\u03AC-\u03CE\u03F2\u0401\u0410-\u044F\u0451\u0454\u0456\u0457\u045E\u0491\u0531-\u0556\u0561-\u0587\u0902\u0903\u0905-\u090B\u090E-\u0910\u0912\u0914-\u0928\u092A-\u0939\u093E-\u0943\u0946-\u0948\u094A-\u094D\u0982\u0983\u0985-\u098B\u098F\u0990\u0994-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BE-\u09C3\u09C7\u09C8\u09CB-\u09CD\u09D7\u0A02\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A14-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A82\u0A83\u0A85-\u0A8B\u0A8F\u0A90\u0A94-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABE-\u0AC3\u0AC7\u0AC8\u0ACB-\u0ACD\u0B02\u0B03\u0B05-\u0B0B\u0B0F\u0B10\u0B14-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3E-\u0B43\u0B47\u0B48\u0B4B-\u0B4D\u0B57\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C02\u0C03\u0C05-\u0C0B\u0C0E-\u0C10\u0C12\u0C14-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3E-\u0C43\u0C46-\u0C48\u0C4A-\u0C4D\u0C82\u0C83\u0C85-\u0C8B\u0C8E-\u0C90\u0C92\u0C94-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBE-\u0CC3\u0CC6-\u0CC8\u0CCA-\u0CCD\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3E-\u0D43\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D60\u0D61\u0D7A-\u0D7F\u1F00-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB2-\u1FB4\u1FB6\u1FB7\u1FBD\u1FBF\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD2\u1FD3\u1FD6\u1FD7\u1FE2-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u200D\u2019]+)/gi), r10 = 0; r10 < n11.length; r10 += 1) n11[r10].indexOf(`/`) === -1 ? n11[r10].length > t11 && (n11[r10] = this.hyphenate(n11[r10]).join(`\xAD`)) : r10 !== 0 && r10 !== n11.length - 1 && !/\s+\/|\/\s+/.test(n11[r10]) && (n11[r10] += `\u200B`);
    return n11.join(``);
  }, n10.prototype.hyphenate = function(e18) {
    var t11, n11 = [], r10, i10, a10, o10, s10, c10 = [], l10, u10 = e18.toLowerCase(), d10, f10, p10 = Math.max, m10 = this.trie, h10 = [``];
    if (this.exceptions.hasOwnProperty(u10)) return e18.match(this.exceptions[u10]).slice(1);
    if (e18.indexOf(`\xAD`) !== -1) return [e18];
    for (e18 = `_` + e18 + `_`, t11 = e18.toLowerCase().split(``), r10 = e18.split(``), l10 = t11.length, i10 = 0; i10 < l10; i10 += 1) c10[i10] = 0, n11[i10] = t11[i10].charCodeAt(0);
    for (i10 = 0; i10 < l10; i10 += 1) for (s10 = m10, a10 = i10; a10 < l10 && (s10 = s10[n11[a10]], s10); a10 += 1) if (d10 = s10._points, d10) for (o10 = 0, f10 = d10.length; o10 < f10; o10 += 1) c10[i10 + o10] = p10(c10[i10 + o10], d10[o10]);
    for (i10 = 1; i10 < l10 - 1; i10 += 1) i10 > this.leftMin && i10 < l10 - this.rightMin && c10[i10] % 2 ? h10.push(r10[i10]) : h10[h10.length - 1] += r10[i10];
    return h10;
  }, t10.exports = n10;
}));
var ere = s(((e17, t10) => {
  t10.exports = { id: `de`, leftmin: 2, rightmin: 2, patterns: { 3: `2aaa1\xE4a1ba1da1ga1j2aoa1\xF6a1p2aqa1\xDFa2ua1x\xE41a\xE41b\xE41d\xE41g\xE41j\xE41k1\xE4q\xE41\xDF1\xE4x\xE41z1bibl21cac\xE43c1dc4h1cic1jc4k3co2cp2cs3cu1cy1de1did1\xF61due1be1d4eee1fe1ge1ke1m2eoe1pe1qe1\xDFe1te3\xFCe1wey1e1z1fa1f\xE41fe1fi1fo1f\xF61fu1f\xFC1fy2gd1geg1n1guh1j2hl2hnh1q2hr4hsh2\xFC2hwh1zi1a2i\xE42ici1d2ifi1ji1\xDFi1\xFCj2u1ka1k\xE4kl21ko1k\xF6k1q2ks1k\xFC1le1li4ln1lo1l\xF61ly1ma3m\xE41me1mi1mo1m\xF61mu1m\xFC1my1na1n\xE41ne1nin1j1noo1b2oco1d2oi2ol2omo1qo2uo1vo1x\xF61b\xF61d\xF61e1\xF6f2\xF6n\xF6o1\xF61\xDF\xF61v\xF61w\xF61zp2a1p\xE4p2e1php1j1puqu42rc1re1ri4rnr1q1ru1r\xFC1ry1sa1s\xE41sc1se1si1so1s\xF6s1t1su1s\xFC1\xDFe1\xDFi\xDF1j1\xDFu1ta1t\xE41tet1h1ti1to2t\xF62ts1tu2t\xFC2ua2ucu1h2uiu1ju1lun12uou1q2usu1w1\xFCb2\xFCc2\xFCd\xFC1g\xFC1k2\xFCn\xFC1\xDF2\xFCt\xFC1v\xFC1zve2v2r2vsw2aw2\xE42wnw2rw2ux1a1xe1xix1jx1q1xu2xyx1zy1by1ey1gy1hy1jy1ly1py1ry1vy1wy1yz\xE42zu1zw2`, 4: `_ax4_\xE4m3_ch2_en1_eu1_fs4_gd2_gs4_he2_ia4_in1_ks2_oa3_\xF6d2_pf4_ph4_ps2_st4_th4_ts2_um3_ur1_xe3a1abaa1ca3au2abaab1\xE41abd1abf1abg1abh2abi1abkab1l1abnab3r1abs2abu2ab\xFC1abw2aby1abz2aca2acc2acu1add2adf2adh5adj2ado2adp2adq2adu2a1eae2bae2cae2da2ekae2pa2eta2ewae2xaf1a2afe2afia2f\xF62agaag2n2agt2ah_2ahsa1huah1wa1hyaif2a2il2aisaje22ak_2akb2akc2akd4ako2aks1akza1laa1l\xE42ale2ali2aloa1lu4aly2am_2am\xE42amf2amk2amla2m\xF62amu1anb2ane1anf1anh2anj1anl2anna1n\xF61anra1n\xFC1anwao1ia1opa1or2ap_2apa2apea2pfap2n2apr2ar_a1raa1r\xE41arb2are2arf2arh2ari2arr2arua2r\xFC2arv2ary4asha2s\xF6a2s\xFCa\xDFe22a1tata1at2cat2eat2h3atmat1\xF64atra3t\xFC2au_2aub4auc2aue2aug2auj4aum4aunau1o2auu2auw2aux2auz2a1\xFC2a1v4avia2vr2a1wax2eays4ay3t2a1zaz2aaz2oaz2u\xE4b2s\xE41ck\xE42da\xE42dr\xE4d2s2\xE41e\xE4f3l\xE4f3r\xE4f2s\xE4g2n\xE4h1a\xE43hi2\xE4hm2\xE4hs\xE41hu\xE4h1w\xE41im\xE41la2\xE4le\xE41lu2\xE4ml\xE4m2s2\xE4n_2\xE4ne2\xE4ns\xE41on\xE41pa\xE4r1\xE4\xE4r1c4\xE4re\xE41r\xF6\xE42r\xFC1\xE4rz\xE43su\xE43te\xE4t2h\xE4u1c\xE42uf1\xE4ug4\xE4ul2\xE4um\xE42un2\xE4ur1\xE4u\xDF4\xE41v3bah3basb2\xE4rb2\xE4s4b1bb3bebb2sbbu12b1c3be_3bea3beb3bek3bel1bembe1o3bet1bezbge3bib23bilbiz24b1j2bl_b2leb2lo3bl\xFC2b1mbni2bo4abo2cboe1b1op2b\xF6fb1\xF6l2b1qb2r42br_3br\xE43br\xFC4b1sb3s\xE4b3scb4slb2s\xF6bss2bs2t4b3tb5teb4thbt4rbt\xFC1bu2fb\xFC1c2b1v2b1w3by1by3pbys2ca1h3camc4an3carc\xE4s22c1ccch22cec2cefce1i2cek1cen1cer1cetce1u2c1f4ch_2chb2chc2chd2chf2chg2chh2chj2chk2chp4chs2cht4ch\xFC2chv4chw1chy2chzci1cci2s4ck_ck1ack1\xE42ckb2ckc2ckd1cke2ckf2ckg2ckh1cki2ckk2ckm2ckp4cks2ckt1cku2ckv2ckw1cky2ckzclo1co2ccoi22c1qcre2cry2cs2ac2si4c1tcti22c1z3da_da1ad1afd1agda1sd\xE42u2d1cd3dhd5dodeg2d1eides1det2dga2d3gl3di_3dicdi2edi1p2d1j4d1ld3ladni2d1obdo2o2d1qd2r4d3rid3r\xF62d1s4dsb4dsld2s\xF6dss4dst42d1td2thdto2d3t\xF6dt3rd3t\xFCdu2fdu1idu1odur22d\xFCb3d\xFCf3d\xFCn2d1wdwa2dy2s2d1z2e1aea2ceak1eam3e2ase1\xE422eba2ebl2ebre3bue1ce2ecle3cr2ected2eed2\xF6ee1eeeg2e1eie1en2ef_2efa2efe2efi2eflefs22efu2ef\xFCegd4e3gee2gn2egue1hee1hi2ehme1hoehs22ehte1hue1h\xFCeh1we1hy4eibe2idei1ee4ilei1p2eire2it2eiu2e1jek2a1ekdek4nek2oek4r2ektek2ue1la2eli2eln2eloe1l\xFC2elz2ema2emm2em\xFCen3fe4nre4nten1ue1n\xFCe1nye1ofe1ohe4ole1ore1ove1\xF62e3pae3puer1ae1r\xE4er1cer3h2erie1roer1\xF62eru2esbes2c2esf4eshes3l2esmes2\xF62esp2esres3we3syes3ze3teet2he3tie3t\xF62etre3t\xFC2etz2euf1euke1um2euneu1p2eut2eux2e1ve3vo2ewae3w\xE42eweew2s2ex_3exp2exuey4neys4e3ziez2wfab43facf4ahf2alf2arf3atf\xE41cf1\xE4u2f1cfe2c3fewf1ex3fez2f1fff2efff4ff3lff2s3fi_fid2fi2ofi2r3fis3fiz2f1jf2l22fl_1fl\xE4f3l\xF6f4l\xFC2f\xF6f2f1qf2r2f3ruf3r\xFC4f1sf3scf3sifs2tf2s\xFCf3sy4f1tf2thf3t\xF6f3t\xFC3fugf1umf2ur3fut2f\xFCbf\xFC2r2f1v2f1w2f1zfz2afz2\xF6fzu33ga_ga1c5gaiga1kg\xE4s5g\xE44ugbi22g1cg1dag1dog1d\xF6gdt4gd1uge1cged4gef4g2el4g1gg3gegg4r2g1h4gh_gh2egh1lg2hugh1w2g1j4gl_2gls3gl\xFCg2ly2gn_gn2e2gng2gnp2gns2gnt2gnug2n\xFCg2ny2gnzgo4a2goggo1igo1y2g1qg2r4gse2g4slgso2gsp4g4swg3sy2g1tg3tegt2sg3t\xFCgu1cgu2egu2t2g\xFCbg\xFCr1g\xFCs32g1v2g1w3haah1ahh1aph2as2h1c2heahe3x2hi_2hiahi2ehi2n2hio2hiuhlb4hld4hlg4hll2hlm2h2lo2h1mh2moh3m\xF6hm2sh2muh2nah2n\xE4hn2eh1nu2hodhoe42hoih2on2hoo2hop3hov1h2\xF6h\xF62ch4\xF6rhr1chr3dhrf2hrg2h2rihrr4h3r\xFCh2ryhrz2hss24h1th2thhto2h4tshtt4h3t\xFChu1chu2n2hurh\xFCs32h1vhvi23hyg3hyphz2o2ia_i4aai2ab2iaci2afi2ahi3aii2aji2ak2iali2am2iani2apia1q2iasi3au2iavi1\xE4mi\xE4r22i1bib2oi2b\xF6ice1idt4i2dyie1ci1eii1exif3lif3rif2s2i1gi2gli3go4i1hi3heih3mih3nih3rihs2ih1wi3i2ii4s2i1k4ikei2kni1la6ilbil2cilf22iloilv42im_2ime2imo2imt2imu2inein3f2inoi1n\xF62inp2inrin1ui1ny2i1oio1cio2dion2i2ori2oui2ovio2xi3\xF6n2ip_i1pai1peiph2ip4li1pr2ips2ipu2i1qi1r\xE4ir1cir2eir2i2irki1roi1r\xF62isb2iseis3ti2s\xFC4it\xE4i6tli3t\xF6i3t\xFC2itzium12i1v2i1w2i1xi2xai3xi2i1zi2z\xF6ja1c2jatje2aje1cje2gje2pje3wji2ajit3ji2vjoa3jo2iju2kjus32j1v3ka_ka1ck2adk2agka2o3kask1\xE4hk1\xE4nk\xE4r2kby42k3cki1c3kir2kiz2k3j4kl_k2lek1lu2kly2k1mk2n2k3nek3nu3kn\xFC3komk2onk2os3kowk\xF62fk1\xF6lk2r4kst44k1tk2thktt2k3t\xFCkt3zku1ckuh12k\xFCbk\xFC1c2k1v2k1w3la_1lad2laf1lai3lao1lawlay1l\xE41c1l\xE4d2l\xE4f4l\xE4t2l1blb2slb2u2l1c4l1dld3rldt43le_2lec3ledle2e3lehl2ek2leple2u3levl2ey2l1flf4u2l1glgd4l3go3li_3liali1cl2ie3ligli3l2limli2o3liu4l1j2l1klk2l4l1lllb4llg4llk4ll5mlln22l1mlm3plm3tlnd2l3nil1nul1n\xFC3loklo2o2lox2l\xF6d4l\xF6g4l\xF6\xDF2l1plp2fl3pu2l1q4l1s4l1tl2thl6tsltt2l3t\xFC1luf4luo2lur3lux2l\xFCb5l\xFCd2l1v2l3wly3c3lynly1oly3u2l1zl2z\xF6lz1wm1abmae2ma1f3mas3ma\xDFm4aymb4lmby42m3c2m1dmd1ameb43mehme1o2me\xF63mesmeu13mi_mi1c3mig3mil3mit2m1jm3ka4m1lm3li4m1mmmd2mmm2mm3pmm2smoa33moh3mom3mos3motmo1ym\xF62c4m\xF6km1\xF6l2m1pm2pfm3pim3pu2m1q4m1sm3s\xE4m3scm3sem2s\xFCm3sy4m1tm2thm3t\xF6mtt2m3t\xFCmt3zmu1a3munm4us2m\xFCb3m\xFCn3m\xFCt2m1vmwa2my4s2m1z3na_n1af3nain1ar3nas3natn1au3n\xE4e3n\xE4s2n\xE4unby42n1cn2ck2n1dn2d\xF6ndy33ne_2nec3nedn1efneg4ne2l3nenne2un2ew3nez2n1fnf2\xE4nff4n3finf4lnf2onf4rnf3s4n1gng3mn2gnn3h\xE4n3hen3hu3nian1idn4ie3niknin1n2ip2nitni3v3nix2n1k4n1nnn3fnng4n3ni3no_no1cn1of3nov3now3noz2n\xF6dn2\xF6r2n1q6n1snsp4n3sy2n1tn3ton3t\xF6n4tsn3tun3t\xFC1nu_1nud3nuenuf21nug1nuinu2n1nuo2nup2nur1nut1nuu1nux1nuz3n\xFC_3n\xFCs1n\xFCt4n1w1ny_1nyhn1yo1nyr1nys1nyw2n1znz3so4aco4ado4aho2aro2aso4ato5au2obbob2e1objob1lo3cao1ceo1ck2odrodt4o2ecoen12ofa2ofiof3l2ofo2oft2o1go3ghogs2o1hao1h\xE4o1heo1hio1hooh1soh3to1huoh1wo3ieo1imo1inoi2r2o1j2o1kok4n4okrokt4o1lao1l\xE4ol2io3loo1lu3olyoms2omy12ona2on\xE42onc2oneono1o1nuon3v1onyon3zoof2o1opo1oro1pao1pi2or_or1ao3r\xE4or1c4ore2orf2orh2orm2orq2orro3ru2osh2osio3sk2oso2o1to3t\xFCoub4oug2o3uho3um2our2ouv2o1\xFC2ovi2ovo2o1wo3wiox2aox2eo2xu1oxyo1yo2o1zoz2eo3zi\xF6b2l2\xF61c\xF6di3\xF6f3l\xF6g3l\xF6g3r\xF61he\xF61hu\xF61ke\xF6k3r3\xF6l_\xF6ls2\xF6m2s\xF6n2e\xF63ni\xF6n2s\xF61nu\xF61pe\xF6r1c\xF6ru4\xF62sa\xF62sp\xF62st\xF63su2\xF61t\xF6t2h\xF6ts2\xF6ze31pa_1paa1pacpag41pak1pap2pa\xDF1pat1pau3p\xE4d3p\xE4r3p\xE4s2p1b2p3cpda41pe_pe2a1pedpef4pei13pel1pem1pep3pet4pf_1pf\xE4pff4pf3r2p1g4ph_ph2a2ph\xE42phb4phd2phf4phg4phkph2l2phm2phn2ph\xF6ph4r2phs2phz3pik1pilpi2o3pip3pispku22pl_3pl\xE4p4lo2p1n1p2opo1c3podpo2i3pokpo2wpo3xp\xF62c2p1ppp3lppt2p2r2p4r\xE42p1s4ps_p3sep2s\xF6p2st2p1tpt1ap3tep2thptt2pt\xFC4pt3zpu1apub42puc2pur3put1p\xFCf2p\xFClp\xFCn22p1v2p1w3py1pys4py3t2p1z1ra_r1abr2ad1raer2afr2air2alr2apr1arr2as2ra\xDF1rat1ra\xFCr2ax4r\xE4f4r\xE4g2r\xE4h2r\xE4mr\xE42u2r1brbb2rb2orb2srb2ur1ce2r1dr2d\xF6rdt43re_2re\xE43reg3rekre2u2re\xFCr1ew3rez2r1frf2u4r1gr1h42rh_2rha2rh\xE42rh\xF62rhsrid2r2ie3rigr2isr2itrix12r1j2r1krk4n4r1lrl2erl3t4r1mrm2urnd4r3nern3frng2r3nirn1\xF6r1nur1n\xFCr1nyro1c2rof3roir2onr1or4ro\xDF2rox2r\xF6f4r\xF6gr1\xF6k4r\xF6pr1\xF6rrp4erpf4r3porp3tr3pu2r1rrrb2rr1crr2or3ru4r1sr3sirs3lr3sor3sy4r1tr3t\xF6r4tsrtt4r3t\xFCrt3zru1a3ruf4rug2rum3rut4ruz2r\xFCb2r1v2r1w4r1xry2c2r1zrz2\xF63sa_3saa3sams1an3sat3s\xE4l2sc_s2ci2scj4scl2scos2cr2scs2scusd4r3see3seh3seq3set2s1hsh2as3h\xE4sh3ns3h\xF6sh4rsib43sio2s1j4sk_4skbsk4lsk4n4sk\xF64skss3l\xE4sl3bs3les3li4sna4sn\xF63so_so4aso1c3sog3sol3somso3o3sos3sov3sow3sozs\xF62cs\xF62fs1\xF6s1sp22sp_s2p\xE42spls3pn4spy2s1q6s1sss3l6st_s2ta2stb2stdst2e2stf2stg4sth2stj2stk4stl4stm2stns2to1st\xF62stp2stqs2trst2u1st\xFC2stv2stwsu2n3suv3s\xFCc3s\xFCn4s3v2s1ws3was3we1s4ysyl12s1zsz2os3z\xFC2\xDF1c2\xDF1d2\xDF1f2\xDF1h2\xDF1l2\xDF1m\xDF1o2\xDFos2\xDFst22\xDF1t2\xDF1\xFC2\xDF1v2\xDF1w2\xDF1z3ta_4taatah2t2ai2tam3tas3tav3tax4t\xE4bt\xE41c4t\xE4d3t\xE4e3t\xE4g2t\xE4h4t\xE4mt1\xE4pt\xE42st2\xE4t2t\xE4x4t1ct4ckt3cr3te_2teh3ten3tes4th_th2e1thi2thk2thp2ths2th\xFC2thvt2hy3tig3tik3tio3tip3tis3tiv2t1j4t3ltl4e3to_to1c3tod3tok3ton3too4to\xDF3tow4t\xF6ft\xF64l3t\xF6n4t\xF6\xDF3t\xF6ttpf42t1q2tr_3tritry14ts_ts1ot2s\xF6t3sy4t1tt3tit3tot3t\xF6ttt4t3tut3t\xFC2tub3tuc2tud3tue4tuf2tuh2tuk4t\xFCb3t\xFCf3t\xFCm4t3v4t3wtwa21ty13typtys44t1ztz1\xE4tz2\xF6u1amu3auu1ayu1\xE4mu1\xE4u2u1bub2lub1ru1ce2u1d2u1eu2edu2eguen1u2ep2uffuf3luf3r2u1gugo3u2g\xF6u2g\xFC2uh_uh1wu1ieu3iguk2au1keu1kiuk4nuk2\xF6u1kuulb4ulg4u2l\xFC1umf1umg1umk1uml4umm1umr1umz4un_u3ne2unk1unruns21unt1unw2unzu3ofuos2u1pau3piu1pr2ur_u1raurd22ure2urfu1r\xF6ur3purt2u3ruur\xFC2u2s\xFC2u1\xDF2u1tu3teuto1u3t\xF6u3t\xFCu1\xFC22u1xux2eux2oux3tu1ya2u1z2\xFCbc2\xFCbd\xFCbe2\xFCb3l\xFCb3r\xFCd3r\xFCf3l\xFC2gn\xFCg3s\xFCh1a\xFC1he\xFCh1i\xFCh1s\xFCh3t\xFC1hu\xFCh1w\xFCl1a\xFCl2c\xFCl4e\xFC1lu\xFCn2s\xFCnt2\xFC1nu\xFC1pe\xFC1pi\xFCr1a\xFCrr2\xFCr2s\xFCs2a\xFC2stva1cva1sv4at2v1b2v1dve3bve3cve3dve3gve3hve4ive3over1ves12ve\xFCve3v2v1g2v1hvi2cvig22v1k2v1m2v1n3vol3voyv\xF62c2v1pv3revs2e2v3t2v1v2v1w2v1z1waa1wag1wah1walwa2p1was1w\xE4h1w\xE4l1w\xE4swbu22w1c2w1dwe2a1weg1wehwe2i1wet2w1g2w3h1widwi2ewik21wil2w1k2w1l2w1mwn3s1wohwot21w\xF6c2w1pw3ro2w1sws2t2w1twti21wucwul2wus21w\xFChw\xFCl2w\xFCn32w1w1xa_1xae2x1b2x1c4x1d2xekxe2lx1emx2en3xes2x1f2x1g2x1hxib4xi1cxi3gxil12x1l2x1m2x1nx1or4x1p2x1r4x1txt1\xE4xt1uxu1axu2s2x1v2x1w3xy_3xys1yacy1\xE4ty1c2y1d4y2efy1f2ygi2yg2lyhr2y1i4y1k2yl3cynt2y1nuy1ofyom2y1osy1ouypa2ype2y2pfy3phypo3y3riyrr2yse1y1t2yu2ry1z2za1c3zahz1anz1as2z3czd\xE41ze1e2z1h2z1j3zolzo2oz1orz1\xF6l2z\xF6n2z1qz3saz3shz3skz3sz2z1tz3t\xF6z3t\xFCzu3azub4zud4zu3kzuz22z\xFCb2z1v4z1zzz2\xF6`, 5: `_ab1a_abi4_ab3l_abo2_ack2_ag4n_ag4r_ag2u_ai2s_ang2_an3s_apo1_aps2_as3t_at4h_au3d_\xE4t2s_by4t_dab4_de1i_de1s_d\xFC1b_dys1_ei3k_eke2_enn2_er1e_erf4_er1i_es1p_et2s_eu3t_ext4_fe2i_fi2s_ga4t_ge3u_hi2s_im2a_im5m_in3e_ink4_inu1_ire3_is2a_jor3_ka2i_ki4e_kus2_li2f_ma3d_ma2i_me2e_ne4s_ni4e_nob4_nus2_ob1a_obe2_or2a_ort2_ozo4_pro1_ro4a_ro3m_r\xFC1b_sch4_sha2_te2e_te2f_te2s_ti2a_tid1_ti2s_to2w_umo2_un3d_un3e_un3g_un3s_ur2i_ut2a_ut3r_\xFCbe4_vo4r_wa2s_wi4e_wor2_ya4l_za2s_zi2e_zwe2aa2beaa2gr4a2araart2aas5tab2\xE4uab1ebabe1eabei12abela3ber2abet2abew3abfiab1irab1it2ableab3liab4loa2blua2bo_ab2of2abora3braa4br\xE42abr\xFC2abs_abs2aab5scab3spabst4ab3szab1uraby4ta1cem2ach_ach1a2achba1che4achfa1chiach3lach3mach3na1choach3\xF6ach3ra4chta1chuach3\xFC2achvac1in2ada_ad2agada2m4adav1a2d\xE42ade_2aden4a3diad2obad3ru2ads2ad3stad3szad2t1ad4tead4tra2elaa2eleae2o3aes5ta2faka2fana3faraf4ata2faua2fexaf2fl2af3lafo1saf3raaf3r\xE4af3reaf3r\xF6af2spag1abag1arag1auag2diag2drag2duage1iag2er2agesag3gl1aggr2a2glag4laa4gl\xF6ag4nuag4roagsa2ags3pag2th2a1haah4at2a1heahe1sa1h2iahin3ah2l\xF6ahnt21ahorah1osa2h3\xF6ahr1aah3riaht3saian3aid2sai1e2aien3ai3g4a3ik_ai3keai3kuai2loa1indain4ea1ingai2saaiso2a3iv_aive3a3ivla3ivs2akal2akarak4at4a1kea2kefa2keu2a1ki2ak3lak4li2a1kr4akra3akroak3sh2akta2aktb2a1kua2kun4a3k\xFC2ala_al1abal1afala2ga3lalal1ama2larala4s2alatal1aual1\xE4mal2bralb3sal2d\xE4al2dral3dualen1ale2pale4talf4r3algi3almba2l1\xF6al3\xF6fal2\xF6s1alphal2ufa2lumal1ural2zw2am2aamab4amad2ama3g2am4e4ame_a2meba3meta2mewa3miea3mis2ammlammu2am3pr2am2sam3sa1amt_am4t\xF6am2tu2ana_2anabana3ca3nak2anam2ananan1\xE4s2anbuan3ch2and_2andua3nee2anfi4ang_2angf2anghang1l2angoang1r2a3ni2ank_an3klank1rankt42anmu3ann\xE4an1oda3nola3nos2anpr1ans\xE41ansc2ansk2ant_2anto1antr1antw2a1nuanu3s2anzb2anzg2anzs1anz\xFC2anzwa1os3ao3t2a3ot_a2pefap2faa3pfla3ph\xE4a2pht2ap3la2pot3applap3pu2a3pua3ra_ar2ab2arb_4arba2arbiar2bl2arbr2arbt2arbu1ar1ca2reaa4rega2reha4reka3renare3uar2ewarf1rar2glar2gnar2iaar1ima3riuarm2\xE4arn2e2a1roar1oba2rorar2rh2arsaarse32arsiar2st2arto2artsar1ufar1uhar1umarwa2ar2z\xE42arze1arztas3aua2s1\xE4a2sca4as2ea2seba3ses2asisas1ora2s1pas2phas2pias2poa3spuas2stas3teas3tias3to2astra\xDFen3at1abat2afat4agata3la3tama2tatat1aua2t1\xE44ate_a2teb4atena2tep4atesat3ha3athl4a3ti4atorat3r\xE4at3reat2saat2seat2siat2soat3taatt3sa3tubatu2nat2zoau2draue2baue2sau2faauff43aufn4au1iau2isau3l\xFCaun2eau1nua4unz2aup22ausc1ausd3ausf1ausg1auslau2so1ausr1aus\xFC1ausz2aut_2aute1autoauz2wa3v4aawi3eax4am2a1yaa1yeuaysi1\xE42b3l\xE41che\xE41chi\xE4ch3l\xE42chr\xE41chu\xE4ck2e\xE4f2fl\xE4ge1i\xE4ge3s\xE42g3l\xE42g3r\xE4g4ra1\xE42gy2\xE43he\xE4hl1a\xE4hl2e\xE4h3ne\xE4h3ri\xE41is_\xE41isk\xE42k3l\xE42k3r\xE4lbe2\xE4l2bl\xE4l2p3\xE4mt2e\xE4n5de\xE4n2dr\xE4ne1s\xE4n2f52\xE4nge\xE4n2gl\xE4n2gr2\xE43ni\xE4nk2e\xE4n2kr\xE4nk2s\xE4p2pl\xE4p2pr\xE4p4st\xE4r4af\xE4re2n\xE4r2gr\xE4rk2s\xE4rm2s\xE4r1o2\xE4rse2\xE4r4si\xE4r2st\xE4rt4e\xE4r2th\xE4r2zw\xE45s4e\xE4se3t\xE42s1p\xE4ss2e\xE4s2st\xE4s4tr\xE4te2n\xE4t1ob\xE42t3r\xE4t2sa\xE4t2s\xE4\xE4ts3l\xE4t4tr\xE4t2zw\xE4u2br\xE4ude3\xE4u3el\xE4uf2e\xE4ug3l\xE4u2ma\xE4un2e\xE4u1nu\xE4u3se\xE43usg\xE43usk\xE43usn\xE4u2sp\xE4u2trba2bl2babs2b1afbais2ba2kabak1lbak1rbal2a2b1amban2ab1ang2banlban3tb1anzbar3bbar3nba2scba2stbau3gbau1sba1yobben3bbe4pbb2l\xF62b3d4bde1sbe3anbe3arbe3asb2ebe1be1cbedi4be1eh3bef4be3g2beil2b2einbe3li1ben_ben3nbe1ra3be1sbes2abe1ur3b2ew2b1ex2b5f4bfal22b1g2bges42b5h2bhut2bi3akbibe2bie2sbik2abil2abi2lubin2ebi2o1bio3dbi3onbiri1bi3seb1isobi2spb2it_b2itebi2tu2b1k4b3lad3blatb3leb3blemb4letb3leub2lie2bligb4lisb2litb4locb3los2blun3blut4b3n2bnis1bo5asb1ob3bo2blbo2brbo3d22b1ofbo3febo1is3bon_bond1bo2ne3bonsbo4r\xE4bor2sb1ortbo2scbo3thbo2xib\xF62b32b1p2bpa2gb4ra_b4rahbr\xE44u2bre_3brea2breg3bremb4rer2brigb4riob3rohb4ronb4rucbru4sbs3arbsat2b4s\xE4rbs2\xE4ubs2cabs4cub3se_bse2bbsi4tbs2kubso2rbs2plb3stob3st\xF6b3st\xFCbtal3btil4b4ts2bu2e3bu3libung4b2urgbu2sa2b3z22c1abca2chca2e3ca3g4cal3tca2pecar3ncas3tca1y2ceco4ce2drcen3gcere3ce3sh2ceta2chab2chaf1chaoch1\xE4s1chef4chei2chic2chl2ch2lech2lu4ch2m2chn42chobcho2fch1ohch2r44chrech3rh2chuf2chuh2chum1cka_2ckac1ckag2ckalcka4r2ckau2ckeh2ckexck1imck1in3ckis2ck3l2ck3nck1o22ck3rckt2e3c4l2clet4co3chco2d2co3dicoff4co1itco2keco2lecol2oco2peco1racor3dco3recos3tco4te1c4r2cte3ecti4octur6cu2p32d1ab2d1acd2ac_dagi2dah3lda1ho3d4aida1inda1isdal2ada3l\xF6d1altdamo3d4ampd2an_d1ang2danw2d1apd2aph4dapp3darlda2rod3arrdar3sd1artda2rudas4tdat2a4datmdau3e2dauk2d1\xE4h2d1\xE4p2d\xE4rzd\xE43us2d1b4dbu2cdco4r2d1d2ddar2de2adde3asde3b43de1cde1e4de3gldehe2de3hod2eicde2l\xF6d2en_dend2den3gd2enhde2nide1nude1ondepi2d4er_de3rude2sade2spde2sude1unde3us2dexp2d1f42d1g2dga3gd2ge_2d1h2d2hisdi4abdi2addi4amdi1cediet3dik2adin2adi2obdi2spdist2di2tadi2thdit3sdi2tu3di5vdi3z22d1k4d3l2edli2f2d3m24d5n2dnis1d2obadob4ld2obrdole4doll22doped2opp2dorc2dordd2orp2dortd2os_dos3sdost1dot6hdo3und\xF62l13d2\xF6r2d3p2drag4d3rai2dr\xE4dd4r\xE4h4dre_2dreg4drem2d3rhd4ri_d4ridd4ried4rifd4rikd4rild3robd3rocd4roid3roud5rubdr\xFC1bd2sands1\xE4nd3seidse4td3shodso2rd2sp\xE4ds2pods2pud2steds2tids2tud2sundta2dd5teadt3hodt5s2du1ardub3l2d1uh2dumd2dumf2dumg2dumld2ump2dumrd1umsdung42dunrdun2s2duntdus3t2d1v2e3a2beab3lea2drea2g4ea3gaea3gleakt2ea2laeam1oea2nae2anoe3ar_ea2rae3arre3arveas3se3athea5tre3aug2ebedebe2i2ebeleb2en2ebeteb3loeb2l\xF62eb2oebot2eb\xF62seb4rueb2s1ebse22e3caech1\xE4e1chiech3lech3mech3ne1chuech1weci6a2eckteco3dec1s4e3d2aed2dre3deiede2re3d2oeds2\xE4ed2suedu2se3dy3ee3a2eeb2lee2ceee1chee2ckeede3e1effeef4leef3see1imeel2ee1empeena2e2en\xE4e2encee3nie2enoeen3see1rae1erde1erkee1r\xF6eert2e1erzee3s2ees3kee3taee2thee1u2e1e2xef1are2fate2f\xE4ue3fe_ef1emef2er2eff_1effief2flefi2s1efkue3fraef4r\xFCef3soef3spe2fumege1ue2gloeg3nieg2thegus32e1ha2e1h\xE4eh2eceh2ele3hereh1l\xE4ehle2eh3loeh3mue3holehr1\xE4eh3rieh3sheh3\xFCbei2blei3de2eidn1eifrei3gl2eigt2eigu2eil_2eilbeil3d2eilne1impei4n\xE4ein3kei3o2eip2fei3ree1irre2is_2eit\xE4ei3teei2theitt4e3ke_e3kene3kese3keye3k2lekt2oe3k2wela2cel1afela2h2elaoela4s2e1l\xE4el2da2ele_elea2ele2c2eleh2elei1eleke3lepel2ete3leu2elevele2x1elf_el3feelf4l1elfm1elfte3lieel3klel3leelm2ael5nae2lofe2lolelon2el\xF62selto22e1luel1ure2lyaelz2eema2keme2se2mop3empfem2saem2stem3t21emule2n1a4ena_2enace3nade4naf4enahe4nak4enam4enaten1\xE4u2ene_2enem2enen2enesenf2aenf2uen3geen2gl1engpe3ni_e3nice2nide3niee3nio2enise3nit2enive2nofen1ohe3nolen1one3noteno2w2e1n\xF6en3sp1entd1entn2ent\xFC1entw1entz2enut4enw\xFCeo2fee1on_e1onde1onfe1onhe1onle1onre1onse1opee1opfeop4te3or_e3orbe3orse3orweo1s2e3os_eo3ulepa2gep3leep2paep4plep2prept2aepu2se3ra_era2ge1raie2rake1rale1rape2rare1rasera2\xDFe1rawe1razer1\xE4her1\xE4merb2eer3brer3da1erdber3de4ere_er1ebere2l2erer2ereserf2eerf4rerg3s2erh\xFCe3ribe3rio2erk_erk3te3ro_er3oaer1ofer1ohe3rone3rose3rower\xF62d2er\xF6ker3p4er3r\xE42err\xFCers2aer3seers2ier3sker3sner3sper3sz4ertier3uzer\xFC4bes3abes3ake3sceesch2es2eles2hues2ide2siles2ire4skees3kles3kue4skye3sote3spies3sces3se2essoe1stre1stues4t\xFCe\xDFe2setab4et1am3etapet4atet1\xE4het2enete2oet3h\xFCeti2m2e3toeto2bets2pet3suett1aet2thet2z\xE4et2zweu1a2eu2gaeugs4euil4eu1ineu2k\xE4e3um_e3umbe3umleun2eeu1o2eur2eeu3speust4eut2heu2zw4everew\xE42se2we_e3wirewi2se3witex3atex1er1exis2ext_ex2tu2e3xye3z2aezi2sf1abefab5sfa2drfaib4fa2ke2fanb2fanf2fanlf1anp2fanrfan3s2fanw2f1ap3farifa3shf3aug3f4avfa2xa2f1b22f3d4fdie2f2echfe2drfe2eife1emfef4lf4eief1eisfel3tf2em_fem4m2fempfe2n\xE4fen3gfe2nof1entf2er_fe1raf2eref2ertf1erwfe2st3fete2fexpff3arff1auffe2eff3eiffe2mff4enf2fexff4laff4l\xE4ff4lof3fluf3fl\xFCff3roff3r\xF6ffs3t4f3g2fge3s2f1h2fi3atfien3fi3klfi2krfil3dfilg4fi3lif2inafi3nifin2sfi3olfi3rafis2afis2pfi3tu4f1k4f3ladf3lapf3l\xE4nf4leef3lerflo2wf4luc2f3m2fma2d2f3n2fni2sfob2l2f1offoli3fo2nafon2efo2nu2f1opfo1ra3form2f1\xF6k2f1\xF6lf\xF6r2s4f1p2f4racf5radfra4mf5rap2fre_f3recf3red2fregf3repf4reufri3dfri2e2frig1frisf3rocfro2sf3rotf2sanfs3arf4scefs4cofse4tf2sphfs1prfs3s4fs3thf4ta_f2tabft1afft1anft1arf3tatft3hoft1opft2s1ftsa2ftse4ft3stf2tumftwa4ft3z23f2uhfung42funt2gabfgab4r2gabz2gadlga1flga2kagal2ag4amo2ganbgan3d2ganh2ganl2ganwga1ny2garb2garc3gardg2arsga3ruga2saga2siga3spgas3sgat2a2gatmgat4rgau1cg2aukg1aus2g1\xE4p2g\xE4rz2g1b2gber2gby4tgd1ing1d3rgd3s2ge3a2geb2ageb4rge1e2ge3ecge2esge1imge1irge2isge3lege3l\xFCgelz2ge3migem2uge3nagen3ggen3ngeo2rge1ouge3p4ge1ragerm4ge3sigest2ge5trge1ulge1ur2g1ex2g1f4gga4tg2g3lgg4log2g3n3gh2rgie3ggi2elgi2gugi3negi3tugi4us4g3k2g1labg1lac3glad3gl\xE4tg2l4e2gle_3gleag3lecg3leg2glehg3len2glesg4lia2glib2glif2gligg2lik4gling2lio2glisg2lizglo3gg2lom2g1luglu2t2g1m2g2n2ag4na_2gnacg4nat3g2n\xE4g3neh2gneug2nieg2nifg4nin3g2nogno1r2g1of2g1ohgol2a2gord2gorggo2s1go3stgo3th2g1p2g4rebg4remg4rerg3retg3revgri2e3grif2grig2groc2grohgron4g4rosgro4ug4ruf2grut4g2s1gsa2gg3salgs3angs3arg3s2cg4scagsch4g4scogs2ehgsen1gs3ergse4tgsi2dg3silg3spigs3plgsr\xFC2gs5s4gs3tag3stog3st\xF6gs3trg3stugs3t\xFCgti2mg5t4rgu3amgu1as2guedguet42g1uhgu1is3gummgu4stgut1agut3h2g3z2hab2ahab2eh2absha1kl2haleh1alph1amth2an_h2andh4ann2hanr2hantha2plha2pr2harbh2ardhasi1h1\xE4ff2h3b22h3d4hdan2he2adhe3behe2blhe3brhed2ghee4she2f\xE42heffhe2frhe2fuhe3guh1eieh1eifh1eighe2im4heioh1eiwhe3lihe3lohe2l\xF63hemdhe3mi3hemmh2en_he2n\xE4heng22henihe2nohen3z4he2ohe3onhe3ophe3phherg22hermhe3roh1er\xF6hert2he3thhet2ih2e2uheu3ghe1y22h3f4hfi2s2h3g2hget42h1h2hi2achi1ce2hi3dh2idehi2krh1infh1inhhi3nohi4onhi3or2hip1hi2phhi2pih2i2rhi3rahi3rihirn1hi3rohir2shis2ahi2sehi2sthi1thhi3ti2h1k4h4lachla2nh1lash1lath3l\xE4dh1l\xE4sh1l\xE4uh3lebhle3eh3lerh3lesh3lexh2lieh2lifh2liph2lish2lith3lochl1ofhl1oph4lorh3l\xF6ch2l\xF6shl3t2h3lufh3lukh1l\xFCfh2mabh3magh3manh3marh4m\xE4ch4m\xE4hh4m\xE4lh4m\xE4uh3me_hme1eh3menh4monhm3p4hm3sahms1phn1adh3namhn1anhn3d4h2nelhn3exh2nich2nidh2niehn1imhn1inh2niphn3k4h2norhnts2h2nuch2nulho2blho2efho4fa3hole4holo3holzhom2ehono3ho1rahor3dh1orgho3slho2spho4st2hot_ho3thh1o2xho1y2h\xF63ckh\xF62s1h3\xF6st2h3p2hr1achr3adh1raih3r\xE4uh2rech3redh3refh3relh3rephre2th3revh3richri4eh3rinh2robh3rohh3rolh4ronh2rorh3rouhrs3khr2suhr4swhr2thh3ruhh4r\xFCbh2sanh2sauh2sp\xE4h2sphh1stah1stoh2s1uh2t1ahta4nht2ash2t\xE4rht1ehhte2sh4thohtod1h3t\xF6pht4riht3r\xF6ht2soht2sphtti2ht3z2hu2buhuko3hu2l\xE4hu2loh1umsh1unah1up_h1upshurg2hu3sahu2sohu2tihut2th4\xFCbsh3\xFCbuhvil4hwe1c2hy2thzug4iab4liaf4li3ak_i3akti5al_ia2l\xE4ial3bial3dialk2i3allia2lui3am_i4amoian2ei3anni2anoi3anti3anzi3ar_ia2rai2ascia3shi2asiias3siast4i3at_i4ate1iatri3atsia3uni1\xE4r_i1\xE4rsi1\xE4t_i1\xE4taib1eiibe4nibi2ki3blai3blei4br\xE4ich1aich1\xE4i1chei1chiich3lich3mi1choi1chuich1wi3damid2ani2deiidni3i2dol2i2drie3a2ie2b\xE4ie2blie2ckie2drie1e2iel3di1ell2i1eni3en_i3enai3endi2enei3enfi3enhi3enji3enki3enmi3enni3en\xF6i3enpi3enrien2sie1nui3envi3enwi3enzie1o2i2erei4erii1ernie2r\xF6ie3sui1ettieu2eie1unif1arif4atif1aui2fecife2iif2enif2flif4l\xE4i1fl\xFCif4rai1freif3seif3spif2taiga3iig1l\xE4ig4nai4gn\xE4ig4noig4raig3s\xE4ig4seig3soi2harihe1eihe4ni4is_i4i3ti2k\xE4ri3ki_ik1ini2k3lik3noiko3si2k\xF6lik3r\xE4ik3reik1s2ik3soik3szikt2eikt3ri2kuni3kusi1l\xE41il2daild1oil2drile2hil1el2ill_2illsil3\xF6fi1lu2i2lumi3lusim4ati2megi2meji2meki2mew1immo1impoimp4s1impuim2stin2afin3ami3napina4sin1\xE4sin3do2indrin3eii3nelin1euine2x2ingain2gl4inhei3nie2inigin2ir2inis2inn_2innlin1odin1orino3tin3suint2hin3zwi2odaio3e4iof4li2o3hio3k4i3ol_i3om_i3omsi3on_ion3di2onyi2o1pio4pfi3opsi3opti3or_i3orci3orpi3orsi3ortio3s2i2osti3ot_i3otsi3oz_i1\xF62ki1\xF6s_ipen3i3perip3fa2i1piipi2sip2plip3pui1r2ai3radirat2ir2bli3ree2irekir2glirg4sir2he2irigir4m\xE4ir2no1ironiro2sirr2hir3seir3shir2sti3sacis2api2saui2scaise3eisi2ais1opis1pais1peis3sais2stis4t\xF6is4t\xFCit1amit1ani3tatit1auit2\xE4rit\xE4t22itelite4ni2texi5thr1itiii5tocit3rei3truit2sait2soit1uhitut4it2z\xE42i3u2i2vebive4niwur2ix2emiz1apiz1auize2niz4erizo2bi2z1wja3nejani1ja1stje3najet3tjo2b1job3rjoni1jo1rajord2jo2scjou4lju2blju3nijur2ok3a2aka3ar2kabh2kabska1frka1inka3kak1allkalo5k3amakand4kan2ekank42kanlk1anska3nu2kanw3kara2karbk2ardk2argk2arkk2arskar3tkaru2k2arwka3sekasi1kas3s2kattk1ausk\xE4se32k3b4kbo4nkbu2s2k3d2k1effkefi4kege2ke2glk1einkei1skeit2ke2lake2l\xE4kel1ek4eltk2en_ke2no2keo2ke2plk2er_k2erck2erlkerz2k6es_ket3ske1up2k3f42k1g22k1h4kho3mki3a4ki3drki2elki3k4ki3liki3lok2imik2in_k2ing2kinhk2inik2innkin3ski3orkio4skis2pkist2ki3zi2k1k44kla_k4lar4kle_4kleh2klic2kligk2link3lipk2lir4klizk4lopkl\xF62sk2l\xF6tkluf23knabk4neiko2al2kobjkoff4ko1i2kol4ako3leko4muko3nu2kop_ko1pe2kops2kopzko3riko2spko2stko3ta2k1ouko2wek1o2x2k1p2k4rawk4raz2kre_2kreg2k3rh2krib2krip3kris2krufkr\xFC1bk2sanks3ark2sauks2\xE4nksch4ks3hak3sofks1pak3speks2puks3s2k1stak1stek1stok1strk1stuk2s1uk3talkt1amkt1ankt\xE43skte3ekt1eik2texkt3hokt1imk3topkt4rokt3s4kul2a4kulpkung42kuntku2roku2spkus3tku2suk\xFCr4s2k3z2kze3lla3ba2labb2labf2labg2labhlab2ol2abrl1abt3labu2labwla1celad2il1adl2ladm3ladul1advla2falaf3slaf3tla2gala2gnlago2l2akk2l1al4lall4lalpl2amil2amp2lanb2lanf2lanll1anp2lanslar3sla2ru4lasdla3se2lash2lasila2so2laspla2stlat2ala3telat2s1lauglawa41l\xE4nd2l\xE4ub2l\xE4uc2l\xE4ue1l\xE4ufl3bacl3bl\xE4lb3lel2blil3blolb3salb3selb4sklb3splbs6tl3chel3chilch3llch3rlch3\xFClch1wlda2gld1all3daml3dasl3datld1auld1\xE4rl2deil2dexldo2rld2osld2\xF62l2dreld4r\xFCld3sald3stld3thle2adle2bl4leddle3dele3eilef2ale2g\xE4le2glleg4r4lehs4lehtl2eicl2eidl2eitlel3s4lemplem3sl2en_le2n\xE4l2enfle3nil2enkle1os3lepa3lepf3leprl2er_lerb4lerk2ler3tl1erzles2ele3shlesi1le3skles2t4lesw2lesy2leto4leud3leut2lexe2lexzl3fahlfe1elf3lolf2trlfur1lga3tlg3rel3gro2l1h23lhi_li3acli3akli3amli3arlia1sli3b4libi34lickli4ds3lie_lig4nli3keli2krlil2a3limol1inv2linzli4om3lis_li2spliss2lit2ali3telit2hli3tu2lixili2zalk3lolk4nelk4ralk2s1lk3s\xE4lks3tl3k2\xFClla2nl3lapll1aullch4ll3d4ll2emll2esl2lexll3l2ll1obl3lowll3shll5t4llu2fll1urll3z2lme2el2m\xF6llmpf4lms2tlna4rl3n4e2lobjl2obrlo1fllof4rloi4rlol2a2lopf2loptlo1ralo4r\xE42lorcl1ordlo3ro3lorq3los_lo4sa3loselo2talot4h2l1ovlo2vel\xF62b3l2\xF62fl1\xF6hrlpi4plp3t42l3r2lre1slrut4lr\xFC1bl3sacl2saul3sexl4shalsho2ls2pols3s2lst2al2stels4trls2tuls1uml2sunlsu3sl2tabltag4lt1aklt1ehlt2enlt3hol3thul2toblt1oplto2wlt1\xF6ll3t\xF6rlt1\xF6sl3tr\xE4lt3relt3sclt2solt1uhlu1anluba2lubs2lu2drlu2es2lufflu2golu2gu2l1uhlume22lumf2lumll2umpl1umsl1umw1lu2n2lunt2lunwl1urnl1urt2luselu2splu4stlu2t\xE4l\xFCh1lly1ar2lymply3nolzo2flz3t2m2abe2mabk2mabs2mabtma2cima3damal3dmalu4mam3m2manbm2anfm2anh2manlm4ann2manzma2orm2app2marb4marrm1arzmat4cma3unma1yom1\xE4hnm\xE41i2m1\xE4rg2m1b2mbe2em3b4rm2d1\xE4m2deimds2em2e1cmedi32medyme1efmega1m2eil3meldmell2m2en_m2ens2meou3mer_me1rame2ro3mersmes1ame4s\xE44mesume3th2m1ex2m1f4mfi4l4m1g22m1h4mi2admi3akmibi1mi3damie3lmi2ermi4etmi2kimi2ku4milzmi3nimi1nu3mir_mi3ra3miri3mirs3mirwmi2samise1mi2tami2th4mitz4m1k4m2mabmm1eimm3simm3spm2mummm2unmm\xFCl22m3n22mobj3m2odmo2dr4mog_mo2i32mol_mom2e3m2onmo3ne3mo2o2moptmo1ramork4m1o2xmp2flm3ponmp3ta2m3r2m2sanm4sapms1asm2saumsch2m4scom4sexmso2rm2sp\xE4ms2poms2pums3s2m3stoms4trms4t\xFCms1ummt1abmt1akm3tammt1armt3homti2smt1\xF6sm4ts1mt2samt2semt1um2m3uhmu3la2mulsmu3nim4unkmunt24munzmu3ra3musimu2spmus3tmu2sumuts32m1w2mwa4rmwel42n1abna2b\xE44nabg4nabhna2bln2abona2br4nabt3n2ac4naddn2ade3n2ag3n2ahn3ahnnai2en1aig2n1akna2ka3nakon2al_na2l\xE4n4alena2lu2nalyn4am_3name3namon1an_4nanb2nanh2nani4nank2nanl3nannna3non1anp2nanr2nanw5nar_2narcn2ard4narg3narin2ark2narmn2arpn2as_4naspn4ata4natmnats14natt4naufn3aug5naui3n2\xE4cn1\xE4hn2n1\xE4nn\xE42scn2\xE4ss2n3b4nbe3nnbes4nbu2snch3mnd2agndat2nd1aun2dein2dobndo1cnd1opnd1orn2dr\xF6nd3thndt4rn2d\xFC4ne2apne3asne3atne2bl3necane1ckne2de2nee33nehm2n1ein2eid4neifne2ke3nelanel3bne3lin2em_n4en_n2enbn2encn2enhne2nin2enjnen3kne2non2ensn2envn2enwne2obne1os2nepfn2er_ne1ranere2n1erfn1erh3nerin1erkne2ron2erpn2erv3n2esn4es_nes4cnes1one2thneu1cneu3gneur22n1exnf1aknfo1snft2on2f1ung1adng3d4n3gefn3gerng3g4ng3hun2glon2gl\xF6ng3neng1orngs3cng3tsn2gum2n1h4n3hann3harn3haunhe2rnib4lni2deni3drnie3bni1elnig2anig3rni3klni2kr3n2ilnim2o2ninfni2obni3okni3olni3ra3n2isni2tinit4sni3tunk2amn2k\xE4hnke2cnk2lonk2lunk4nan2knenk2\xF6fn2k\xF6l2n3l22n1m4n2naunne2snn2exn2nofnn3scnn3senn2thnn1ur3nobl2no2dno3drn3olen2on_3nor_nor2a2norc3norh3norm3norsn1ortno3shno2t\xE4no2tr2n\xF62f2n3p4npa2gnpro1npsy32n3r2n3savns2cans1ebnse2tn3sexn3siln4sphn2sponsr\xFC2ns3s2ns2tins2tunst2\xFCn2styns2umnta3mnt4atnt1\xE4mnte2bnte1ent1ehnt2enn3ternteu3nte3vn3thrnti3cntmo2nt3sants2onts2pnts2tntum4nt3z21nu1anu3arnubi11nu1cnu2esnu2fe2n1uhnu3k4n2um_2numf2numg3numm2numr2nuna2nunt3nu2snu3scnu3senu3slnu2ta2n\xFC4bn\xFCr1c2n1v2n3ver2nymun2zadn2zann2z\xE4rnz1ecn2zornz2\xF6ln2zw\xF62o3a2o4abioa3deo4a3ioa3ke2obano3bar2obe_2obea2obewobi4t2o3boo3briob3skobs2pob3sz2o3buobu2s2o3b\xFC2oby4och1ao1cheoch3loch3moch1ooch3roch1socht2o1chuoch1wo3ckeo3ckio2ckoo3d2aod2dro3debo3dexo3diro2donodo4so2dre2o3du2o1e2o4e3so2e3to3et_o3etsof1amof1auof2eno3feroffs2of2fuof1laof4l\xE4of4l\xF6of3raof3r\xE4of4r\xFCofs1aof3thoga3dog2loo3g4nog3spohl1aoh3looh2lu3ohngoh2ni1ohnmo2h3\xF6ohr1aoh1ro2o1hyo1i2do2isco1ismoiss2oi1thoki2ook1l\xE4o2labol2arol4drole3eoler2ole3sol1exol2faol2flolf1rol2glol2grol2klolk3rol2of1olymol2zwo2mabo2mebome3co2melo2mepom2esom3maom3pfomtu3ona2bo2naeo3nalon1apon2auonbe3one2ion3f2ong4rong3s4o3nion3k2onli4o3nodono3sons1aonsi2ons3lons1pont2hont3s2onukoor3foo4skoo2tr2o1\xF62opab4o3panopa5so1peco1pei2opf_op2f\xE4o2pfeopf1l4oph2o3pheopin2op3li2o3poop4plop2pr2o1pr1opsiop3szo1rad2orak2oral3oramo1rasor1\xE4torb2l2orcaor2ce4orda1ordnor2do2ordr2ords2ordwore2hor1eror3gaor2glor2gn4oril2oritork2aork2s2o1ro2o1r\xF6orr4aor3rh2ors2or3shor3szor4t\xF6or2ufo2r3\xFCo2ryaos3ados4anosa1sos4co2o3seose3eose2no3shoo4skaos3keo4skios2lo2os1pos2peos2saos4s\xE4os3to2osu42o3syo2tebote2s4ot2hot4heo2throt2inotli2ot4olot2oroto1so3traot2saot3scots1pot2thou2ceou2geou3glouri4outu4ove3so3wecoy1s4o3z2aozon1\xF62ble\xF62b3r\xF6b2s3\xF6ch1l\xF62chr\xF6ch2s\xF6cht4\xF6d2st\xF6f2fl\xF6h3ri\xF63ig_\xF62ko3\xF6l1a2\xF6l1ei\xF6l1em\xF6l4en\xF6l1im\xF6l1in\xF6l3la\xF6l1o2\xF6l3sa\xF6l3sz\xF62l1u\xF6lz2w\xF6nn2e\xF6n3sc\xF6n3sp\xF6pf3l\xF6r3a2\xF6r2dr\xF6r2gl\xF6r2kl\xF6r1o2\xF6rs2e\xF6rt2e\xF6r2tr\xF6s2st\xF6s3te\xF6s2th\xF6s3tr\xF62t3a\xF6t2sc\xF6t2tr\xF6zes4pa3dapa2drpa3ghpa1ho3pala1pal\xE4pa3li2paltpank42panl2pannpant2panz4papi23para1parc2parg1paro2parppa4stpat4cp3auf3p\xE42cp\xE42to2p1d2pea4rpech1pe2en2peicpe1im2pekupel3dpena41pennpe1rapere21perl3pero5perspe3sape2stp2fabp2fadp2fafpf1aip2feipf3lopf3lup2forpf1ra2pfs2pf3slpf3sz2pf3tpgra2p3hopph3t2phu4s2p1h\xFCpi2a3pias4p4id2pi2el3pierpi3lepin2epi3oipi2pepi3ri4pisopi1thpit2s2pitz2p1k2pkur11p2l43p4lap5la_p5lad2ple_ple1cp4legp4lem2pligp4likp4liz2p3lu2p1m2po3b42p3ohpo3id3poin3p4olpo3li2pondpo1pepo2plpo3pt2pornpor3spos2epo3ta3potep\xF62blp2p1hpp1l\xE4p2plep2pripp3sa1prak1prax1pr\xE4d1pr\xE4g3pr\xE4m3pr\xE4s2pre_2prec1pred1preipri4e2prig1p4ro3prob2proc3prod3prog3proj3prot1pr\xFCf2pr\xFCnps4anp3s2hps1idps2pop3staps2tup3st\xFC3p2syps2zept2abpt3atpte4lp4tospto2wp2t3rpt3s2pt1um3p2typu2dr2p1uh2pundpun2s2puntput2spwa4r1queura2abr3aalra3ar2rabd2rabf2rabgra2br2rabs2rabt1rabyra1cer2ackr4ad_3radf3radlrad5tra2gn4raht2raic1rake3rak\xFCr4al_ral3bra3le2ralgr4aliralk2r4alsra2lu3ralyr2ammr2an_4ranc2ranf2ranl2ranr2rapfr2ara2rarbr2arkr2arpr4as_ras2ar4at_r3atlrat4r4rau_4raud2rauf2raug3raum3r2\xE4d3r\xE4n_3r\xE4ni3r\xE4ns2r1\xE4rr2\xE4r_r\xE43rar\xE4u2s4r\xE4utr2bakr3bl\xE4rb2l\xF6rb4rirb3serbs1orb3sprby4tr1chirch3lrch3mrch3rrch1wr2ck1r2dafrd2amr4dapr2deir3denrd1itr2dobr3donrd1osrd4rird3tard3thrdwa4re2amre3asreb1rre2b\xFCr2ech3red_4reddre1elre1er3refe4reff3refl3refo5reg_rehl4r2ei_r2eie2reigr1einre3larel2ere3lorelu2r4em_r2emi4remur4en_r2enare2n\xE4re2nir2enzre3or3repe3repo4reppr1erfr1ergr1erkr1erlrer2nr2eror1er\xF6r1ertre2sa3rese3reso2ress3rest3resu2reulre2wi4rezirf2\xE4urf2esrf4l\xF6r3fl\xFCr3forrf4rurf4r\xFCrf2sarf2targ2abrg2anr2gnorg3spr2ha_r3herr2hoe2rholrhu2sri3amria1sri3atri1ceri1elri1euri2frrif3s5rig_5rigjrig1l4rigrrik1lr2imb2rimprim2s2rink3rinn2rint4r1irris2ari3so3rissri2strit4r5riturk2amr2k\xE4hrk4lork2lur3krirk2sprk1strk2tark1uhrk2umrku2nr3l2arle2ar3lecrle2ir3letr3l2irli2sr3l2orm2\xE4rrm3d2r3me_r2meorm2esrmo1srm3sarmt2arna2brna4nr2naurn3drr4nefrn2eirne2nr5nesrn2etr4nexr3nodr1n\xF6trn1ur2robj2robsro3e4roh1lro1irro3lerol3s2roly4rom_4romm4romt3ronnrons2ro1pero3phr2oraro3shro2\xDFu3routr\xF62du1r2\xF6h1r2\xF6l3r\xF6mir2\xF6s_r2\xF6se2r1p2r3p4ar2plirpro1rps3trr2abrr2arrr1\xE4mr3r2er4rewrr2herrik2rro3mrr2strr2thr3r2\xFCrr\xFC1brs3abrs2anrs3arr3shors2klr4skor4skrr4skurs4nor4sobrs2p4rs3s2rs2thrs2tir3stor3st\xF6rs2tur3swirtal2rt1amrt1\xE4rrten1r2thirto1prt1orr5trirt2sorube2ru2drru2fa3ruinru1is4rumfru2mi4ruml4rumz2rund4runn2runwru3pr4r3urru2ra5ruroru2siru2strut3hru2zwr\xFC1ch4r\xFCmmrz2anr2zarr2zasrz1idrz1oprz3terz2thr3zw\xE42s1absa2besa2blsa2br4sabss1adm3safasa2fe3safi3sagasag4nsa2gr3s2aisail22s1aksa2ka3saki3sakr4sakt3salo5samms1amps2an_s3anbs2and3sani2s1apsa2po3sapr2s1ar3saris3arrs1aspsat2a4satmsa2trsa3tss1a4u3sau_3sauc3saue3saum3saur2s3avsa2vos3\xE4hns1\xE4lt2s1\xE4m2s1\xE4r3s2\xE4t3s\xE4ul2s\xE4u\xDF4s3b4sba4n2scams2cans2cap2scar2s1ce4sch_s4ch\xE44schb4schc2schd2schf2schg2schh2schks4chls4ch\xF62schp2schq4schss4chu3sch\xFC2schv2schz4s3d2sde1sseb4rse1ecse2glseg4rse3heseh1lseh1sseh3ts1ein3s2eks2el_s2elsse2n\xE43senkse2noseo2rs4er_3seraser3gs1erh3seriseru25ses_se3su2s1exse2xe4sexpsex3t4s3f4sflo44s3g2sha2k1shass3h2e3shi_3shidshi4rs3hoc4shof3shop3showsi2ad2siat5si1cs2ido3s4iesien3sie2ssi1f43s4igsig4nsi2kisik1lsi2krsik3ssi2ku3silosin1ision43s2issi2sasis3s3s2itsit3rsi3tusiv1asive3si2vr2s1k24skams3kar4skasskel1s4keps2kifs2kig4skirski1s3skiz4skom4skor4skow4sk3t2s1l23slal4slans2laws3lo_s3loe2s3m22s3n4snab4so3baso3et3softso3la3s2onsone22sopf3sor_s1orc3sorsso4rus4os_2s1ox2s1\xF6k2spaa4spak4spap3spa\xDF4spaus2paz3sp\xE4h2sp\xE4rs3pe_2spel4spet4s3pf2sphas4ph\xE4s3phespi2k4spil3spio4spis4spla4spl\xE44sple2spod2spogs2poi2spok4spol4spr_3spru2s3ps2s4pt2spun2spup3spur4sput4s3r4sret3sr\xFC2ds5safs3sagss1ajs3sals3s2\xE4s4sces4scoss1ecssoi4ss2poss3s4sst2ass2thss2tis3st\xFC4sta_3staast2ac2stag3stah2stak2stax3s2t\xE44st\xE4g2st3c2steas2ted4stee2stem4stens2tep2ster4stes2stetst3ev4stexs4th\xE4s4this2thu2stia2stibs2ticsti2e2stig2stiks2til2stio2stis2stiv2sto_s3tob1stof4ston4stoo1sto\xDF4stou2stow2stoz2st\xF6t1stru1stub4stuc2stue3stuf3stuhstu2n3st\xFCt4st3zsu1ansuba24subi3su1c2s1uhsu1issul2asul2isult23summ3sun_su4nes1unf4sunt3s2upsup3psu2ras1urtsu2s1su3sasu3shsu3sisus3s2s\xFC4bs\xFC2d1sweh24swie4swilsy4n34s3zas2zess2zis4s3zu4s3zw2\xDF1a22\xDF1b22\xDF1ec2\xDF1ei\xDFen3g\xDFe2ni\xDFe2no\xDFe2ro\xDFer3t2\xDF3g2\xDFig4s2\xDF1in2\xDF1k4\xDFler32\xDF1n22\xDF1p22\xDF3r22\xDF1s22\xDF1um5taan4tab_2tabf2tabg2tabh2tabkta2br4tabsta2b\xFC2tabw2tabz2t1ac3tacut1adatadi33taf_4tafft1afg3t2agt3agotai2ltai4r2takzta2latal3d3talo2talt3tameta2mit1amt3tan_2tanbta3ne4tanf2tang3tanit2ank4tanlt2anot1ansta2nuta3or2tapfta2pl2tarb4tark2taro2tartta2ruta3sata2tht3atlt4atmt1auk3taum4t\xE4gyt1\xE4mt3t\xE4nzt2\xE4r_t\xE42ru4t\xE4tt2t\xE4u\xDF4t3b2t3chat3chetch2itch3lt2chutch1w4t3d4tdun2te2a22teakte3alte3an3tebat2ech2teckte1emte2es2teff3teha3teh\xE43tei_teik43teiltekt25tel_3telatelb43telg3telk5teln3telp5tels3tem_tem3st6en_ten3ate2n\xE4t4enbten3gt4enhte2nit4enjt4enmten3n3terct4erit4erot3er\xF6tert2teru2t2estte2su3tet2t2et_4teth4tetl3teuf3teumte1unte2vite1xa4texp3text4t1f4tfi2l4t1g2tger22th4at2hagt3hait2hak2t3h\xE43thea2thebt2hect2hekt2hem1then3theot2hest2heut2hik4th3l4th3m2th3n1t2hot3hoft3horthou24t3h\xF62thub4thunti2ad3tib4ti1cetieg42tiehti1elti1etti1eu3tif_ti1fr4tift3tilgti2l\xF6til3stilt4ti2lut2imiti3nat1inbt1infti1nuti3orti3plti1rhti2sptium2tive3ti2za4t3k45tlem6t5li4t3m24t5n4tnes2to4asto5at4tobjtob2ltode2toi4rto3la3tole4tolz2tomg3topo2topt3tor_to1ra4torct1ord3toret1orgto2r\xF63torsto2rut2orwto3sc3toseto4sktos2p4toss3totrtots23t4outo3un3t\xF6ch4t1\xF6kt1\xF6st4t3p21t2r45tra_3trac3trag3trak3tral4tra\xDF5tr\xE4c3tr\xE4g4tr\xE4s4tr\xE4\xDF4treb4trec3tref4treg2trekt4remt4rert4rett4reut3rev2trez2t3rh4trict4riptri2x3tro_3troe3tront4rop3troyt3r\xF6c2tr\xF6h3tr\xF6s3trua4truktrum2t4r\xFCbt4r\xFCgts1adts1alt2sants1ast2sauts1emts3krtso2rt3sout2sp\xE4t2spht2spots3s4t1st4ts2tut2s1u1tsubtt1abtt2actt1aktt2altta1st3telttes1tto1st3trott3rutt3r\xFCtts1ptt2untu3antuf2etuff3tu2istul2at2um_3tun_3tune3tungt1up_tu2r\xE4tur1c3turntu2rotu4rutu2satu2sotu3ta3t\xFCch3t\xFCr_t\xFCr1c3t\xFCre3t\xFCrg4t\xFCtztwi4ety2pat2za2tz1agtz1altz1artz1aut3ze_t2zortz2thtz1w\xE4tz1witz1wuu1a2bu1a2cuad4ru1al_u1albu1alfu1alru1alsu1altua2luu1ansu3ar_u1arsua3saua2thuat2iubau1u3b4iu2bopub3r\xE4u2b\xFCbuch1auch1\xE4u1cheu1chiuch3luch3much3nu1chuuch3\xFCuch1wu2ckiu3d2au2donud3rau3druue2ckue2enu2elaue2leueli4ue2miue2n\xE4ue2niue2nou2ereu3errue2tau3fahuf1akuf3aru3fasuf1au2ufe_uff4luffs4u2fobufo2ruf3s\xE4uf4sou2fumug1afug1akuga4sug1auug3d2ug3huu2g1lug3lou4gluu2g3nug1orug3roug3seug3siuh1lauh1l\xE4uh2liuhme4uhr1auh3riuhrt4uh2ruuh4r\xFCui2chui1emu4igeu1in_u1is_u3k\xE4uu1k2lu1k4ruk2tauku2sul1abul1amula2sul1\xE4mul2drule4nule2tu2lexul3f4uli2kul3kaul2knull2aull3sulo2iul1orul2sauls3z2ultaul3thult3sul2vrulz2wuma4rum2enum1irumm2aum2suum3t2um2un2una_1unabun3acun4alun3at1unda1undd1undf2undg1undn1undv1undzune2bune2hung5hun2idunik4un2imuni2r2unisunks23unkuunna2uno4run2os2uns_un3se1unsiun3skun3spun3taun3trunt3s2untuu1o2bu3or_u3orsu1os_uote2u1pe2uper1up2faup2plup2prupt1oup4tru2rabu2rar2u1r\xE4ur1\xE4nurch1ur3diure4nurf3turi2cur1imurk2s4u1rou3roluro1sur4swur2zaur2z\xE4ur2ziur2zou4safu3sepus3klu4skous3ocu3sohus1ouus1peu2spou2spuus2thus3tru1stuus2uru2t\xE4rut1egute2lut2esut2etu4tevutfi4ut2heu2thiu2thuuto3cut4orutos4ut3r\xFCut3teutts2ut2zo2u1u2uufe22u1v4u2ve_uz1weuz3z4\xFCbe3c\xFCber3\xFC1che\xFCch3l\xFCd3a4\xFCd1o4\xFCd3s2\xFCdsa1\xFCd3t4\xFC2f1a\xFCfer2\xFCf2fl\xFC2f1i\xFCf2to\xFC2g3l\xFCg4st\xFChla2\xFChl2e\xFCh3mo\xFCh3ne\xFChn2s\xFCh1ro\xFChs2p\xFCh4th\xFCl2la\xFCl2lo\xFCl2l\xF6\xFC2n1a\xFCn2da\xFCn2dr\xFCnd3s\xFCnen3\xFCn2fa\xFCn2fr\xFCnn2s\xFCn3sc\xFCn3se\xFCn3sp\xFCn2za\xFCp2pl\xFCr2fl\xFCr2fr\xFCr3sc\xFCr3se\xFCr3sp\xFCrt2h\xFCse3h\xFCse3l\xFCse1s\xFCss2e\xFCs2st\xFC2t3r\xFCt2s1\xFCt2tr2v1abval2s2vang2varb2v1auve3arveit4ve3lave3leve3live3love3maven2cve3neve3nive3n\xF6ver3averd2vere2verf4verg4ve3river3kvert2ver3uve3tavete1ve3trve3x22v1f4vi3arvi2elvi2ervima2vi4navin2svi3savise4vi2spvis2u2v1l22v1obvo3gavo2gu2v1opvo2r1vor3avor3dvor3evor3gvo3ri2v3rav4ree2v3rov1stav3s2zvu2et2vumfwa5gewa3gowai2b2walb2walmwa3nawa3sawa3sewa3sh2w\xE4ngw\xE4s2c2w1b2we2bawe2blweb3swe2e4weed3we2fl2weiewe3niwerd2we2r\xF6wer2s1wesewe4stwet2s2w1eywie3lwin2e2wing1wi4rwi2sp1wisswi3th1wo1c1wolfwor3aw3s2kwun2s4wur_wur2s2xa2b1x2adxa1fl1x2agx3a2mx2anz1x2asx1e4gx2er_x2erexers22x3euxich2xide2xie3lxil2axi2loxi2lux2is1xis2cxi2sexis3sxi2su2x1k22x3s2x2t1axt2asx2t\xE4nxtfi4xt3s2x3turx1u2n2y1aby1al_y1a2myan2gy1anky2chiych3nyen4ny2erey2es_yes2pye2thygie5yke3nyk3s2y4le_yli4nyl3s2y2l1uyma4tym3p4ympi1y2n1oyno4dyon4iy1ontyp3any4p3sy3r2eyri2ayri1ey3r4oys2any3s2cy3s2hy4s3lysme3ys2poys1prys3t4y3s2zy2te_y2tesy3to1yure3zab3lz1a2dza3de2z1afza3grzale32z1amza2na3zani2zarb2zarcz1arm3zaubz3aug3zaun2z1\xE4c3z2\xE4h2z1\xE4mz1\xE4rgz1\xE4rm4z3b4zb\xFC1b2z3d2zdan2zeik4zelu25zen_zen3nze2no3zentz2er_zerk2z2ernzers2ze2s\xE4ze3sczes1ezes1ize2spze2tr2z1ex2z1f42z1g2z2henzhir3zi3arzid3rzil2ezin2ezi2o3zi3opzirk22z3k42z1l22z1m2zme2e2z3n42z1ob2z1ofzo2gl2z1oh2zopezo2ri2z3ot2z\xF62f2z3p42z3r24z1s2zt3hozt3s2zu4chzudi4zu2elzu3f4zu3gl2zumf2zumg2zumlzun2ezung42zuntz1urkzu3s4zu5t2z\xFCr1cz1wac4zwahz1war2zwas4zw\xE4l2zweg2zwet4zwirz2wit2z1woz1w\xF6rz1wur2z1w\xFCz3z4az3z2o`, 6: `_ab3ol_ab1or_akt2a_al3br_alt3s_ampe4_an3d2_angs4_ans2p_ans2t_an3th_ari1e_ark2a_ar2sc_as4ta_au2f3_au4s3_be3ra_boge2_da2r1_darm1_de2al_de1o2_des2e_de3sk_des2t_do2mo_do1pe_dorf1_ehe1i_ei3e2_ei4na_ei2sp_ei4st_ei4tr_el2bi_elb3s_em3m2_end3s_enns3_en2t3_en4tr_er2da_ere3c_es3ta_est2h_es3to_es5tr_eu3g4_eve4r_flug1_for2t_fu2sc_ge3ne_guss1_he3fe_he3ri_inn2e_kamp2_kle2i_kni4e_kopf1_le4ar_li4tu_ma3la_ma2st_mel2a_mi4t1_n\xE4s1c_no4th_oper4_oste2_ost3r_poka2_ram3s_reli1_ri2as_rom2a_r\xF62s1_se3ck_sen3s_ser2u_se2t1_si4te_ski1e_tal2e_ta2to_te3no_te4st_ti5ta_tite4_to4pl_tro2s_tu3ri_uf2e2_ufer1_un3a2_uni4t_uns4t_uro2p_ur3s2_wah4l4a1a2naa2r1aaar3f4aat4s3ab1aufab1eilabe2laab1erkab1erzab1ins1a2blaab5lag1a2bl\xE4ab4le_3a2bl\xF61a2bon2absarab3s2i2abst_ab3ste1abteia1chalach3auach1eia3cho_ach1orach3su4ach1wa1ckarack2ena2ckinack2seack3slacon4na3d2abad3amaa2d1an3a4dapade2aladefi4a2deina2deri4ade1sades4sadi3enad4resa2f1eca2fentaf1erlaf4fluaf3s2aaf3s2haf2t1aaf2teiaf2t3raf2tura2f3urag1a2da3gen_age4naage2saage4si3a2gitag4ne_a2g3rea2g3riag4samag4setag4spoag3staag3stea2gundahl3a2ahl3szah4n1aah3r2eahrta2ain3spai3s2e2a3kam1a2kazaken2nak3rauak5tan2aktikak2t3r2aktstal1ageal3amealami5al3ampal1anaal1ansal1anza3lar_a3lareal2armal3arral1asial1assal3augal2b1lalb3lial2bohalb3rualds2ta4l1eha2l1eia2l1ela2lengal1epoal1erl3alermal1etaal1etha2l1eua4leur3a2lexal2glial1insa2linvalk1ar1alkohalk3s2alks4tal2labal2laual3les1allg\xE4al2lobalo2gaal1opeal1orc3alpe_al3sklal3sunal4takal3tamal2treal2trial2troalt2seal1umbame2n1amer2aa2meriame3rua4mesh2a3mirami3taami3ti2ammalam2meiam2minam3stram2t1aam2t1\xE4am4tel2amtemam2t3ram4treanadi3an1algan3dacande2san2dexand2suand1uran3e2can2ei_an3eifan1e4kan1ethanft5san3f2uang1ar3angeb2angiean2gla4angs_an2i3d3a4nima4ninsan2keian4kl\xF6ank3ra3an3naann2aban3n2ea2n1orans2enan2seuan3skrans1pa1anspran3s2z1antei1anthran2tro2anwet1anzeian2zwiar3abtara3d2a2r3al2a2rara2r1auar2bauar2bec2arbenar2bre2arbs2ar2droar1effar1ehra2reinar2erfa2reria2rerlar1intar2kalar2knear2korar4kriark1s4ark3saark3shar2lesar2nana2r1oparr3hear3s2har3staar3t2ear2thear3t2iartin2art3rear2z1was1alaa3schea3schia2schma3schua3s2hiasin2gaska3sa3skopas3s2aas3s2eas3s2ias2s1pass3tias3stras3stu2as3taas4tauas4tofast3r\xE4aswa2s3a2sylat1apfa2tausat3eiga2teliate2ru4athe1atil4sati2st4atmusatra4tat3romat4setat2s1pat4takat4tauat2teiatz1eratz3t2at2z1w2au1a2au2bliau2bloauf1an2aufe_2aufehauf1er2aufs_2auft_4augehaule2sau2malau2m1oaum3p2aum3s6au3n4aau2nio2au3r2au2sauau2spraus3s22auts4ava3t4\xE4che1e\xE4ch2sp\xE4ch4st\xE42d1ia\xE4ft4s3\xE4g3str2\xE4h3t4\xE4l2l1a\xE4mi3en\xE4ne2n1\xE4ng3se\xE4n2k3l\xE4n2s1c\xE4nse3h\xE4p2s1c\xE42r3a2\xE42r1ei\xE4r1int\xE4r2k3l\xE4rt2s3\xE4se3g2\xE4ser2i\xE4skop2\xE43s2kr\xE4s6s1c\xE44s3t2\xE4\xDF1erk\xE44t1a2\xE4t2e1i\xE4tein2\xE4t2s1i\xE4t2s1p\xE4t2s3t\xE4um4s52\xE43us_backs4b1a2drbah2nuba2k1iba2krabal3th3b2andban2drba3n2eban4klban2kr2b1ansbar3deba2reibar2enbar3zwba3s2abau3sp3b2\xE41cbbens2bb3lerbbru2cbe2delbe2erkbe1erlbe1etabei1f4bei3k4bei3labe1indbei3scbeis2ebei1stbeit2sbe3lasbe3lecbe3leibe2letbel3label3szbel3t4ben3arbe3nei3ben3gbe3n2iben2sebenst4ben2su2bentbb2entib1ents2bentwben3unben3z2ber3ambe2ranbere4sber3nab1erntbe2robbe3ropbe3rumbe3slobes2pobess4ebes3szbe2tapbe3thabien3sbi2ke_bi2kes2b1inb2b1infbin3gl2b1intbi2solbi2s5tb2it2abla3b4b2lancb2latt2b3law3ble2a2b3legb3lein3ble4nb3leseble3sz2blich3blickbling43blitzbo3ch2bo2e3ibon2debo1r2abo2reibo4rigbo4s3pbot2st2b3radb4ra3k2b3refb3reif2b3repbri2er2b3rolbrust3bru2thb2s1adb3sandb3sel_bse2n1b3s2esb2s1ofb3s2pubst3acbst1akbs3t\xE4tbst3erb2stipb4stodbs4trib4st\xFCbb2s1unbu2chibul2la2b3umkbu3r4ibus1erbu2sinbu2s1pbu2s1ubzeit1carri1ca3t4hcha2ck2ch1akch2anb3chancch1ang4chanz4char_1characha2sc3chato4chatuch1\xE4rm3chef_3chefi3chefsch1eimcher3ach1ess2cheta1ch1iachi3na4chind2chinf2chinhch1insch1int1chiruch1offch1orcchre3s1chron2chunt2ck3an4ckeffck1ehe4ck1eick1entcke2rack2ereck1erhck2ern2ckero2ck1id2ckunt2ck1upcon2nec1s4trcussi43d2ab\xE4da2ben3d2ablda2bredab4r\xFCdach3ada2chodach1sdal3b2d1amma2d1amt2d1ana2dangedan4kldan2kr2d1ans2dantwd2anz_4danzida2r3a2darb2dar2mada3s2hdat4e2da3teidate4n4d3atl4daush2d1\xE4mt2d1\xE4nd2d1\xE4ngde3a2tde4ca_de2cka2d1eff2d1ehrdein2ddein2sdel1\xE4ndel1ec2delek2delem2delfmdelle2de2lopde3lordel5scdel2sodel3t4dem2ar2d1empden3th2dentwdera2bde1radde2rapder2bl2derdbderer33derieder3m2de4ruhde4rumde3sacdesa2gde4samdes2\xE4cde2sebde4sehde2seide4setde2sinde2sordes3s2de2sto2d1etwde1urlde2xisdha1s4di3e2ddi3enidie2thdige4sdil2s52d1imb2d1ind2d1inf2d1inh2d1ins2d1intdion3sdi4re_di2rendi2ris2d1irl2d1isrdi4t3rdle2ra2d1o2fdo2mardo5n4adoni1e2d1opfdor2f\xE4dor2fldor2fr2d1orgdo2riedor2tad\xF62s1c3d4ra_2d3rad2drahm3d4ramd3rand2d3r\xE4t2d3r\xE4ud4rea_d4reas3d4rehd4reiv4d3ren2d3rep4d3rer4dres_d4resc3d4ria2d5ricd5riegd4rin_3d4rit4dritu2d3rod2d3rot2d3rovdr\xF62s13d4ruc2d3ruh2d5rutd2sau2d2s1efds2eigd2serhds1errd3s2had2s1imds2infd3skuld2s1opds1orids1pasd2sprods3tabd4stagd4stead3steid4stemds4tilds4tipds1umsds2zend4theidtran2du1alvdu2bli2d1ufe2d1umb2d3umkd2ums_2d1umvdund2a2d1unfdun3kedun2kl2d1url2dursadwest3ea3dereadli4e3aleiealti2eat4e2eater1eat3s2e3au2feau1ste3b2akebert4eb3lereb4leue3blieeb3reiebs3paeb3staeb3strebu2t12e3cheech1eie2cho_e2ch3rech3taech1uheck3seede2aledens1edi4aled2s1oed2s1pee2choeed3s2ee2lekee3lenee4nage1e2pie1erbtee3r2eeere2see4reteer2\xF6se1ertree3r2uee4tateewa4re2f1adef1anae2fente3f4lu2e3f2oef3reaef3rolef3romef2tanege2raeg4saleg4stoegung4eh1ache3h2aleh2auseh1eff1e2hepehe1raeh1inteh1lameh2linehl2seehr1a2eh2reiehre3seh1ro2ehr1obehr1ofeh1stee2hunt2ei3a2ei2bareibu4tei2choei2d1aei3danei3dra4eien33eifr\xFCeig2er2eigew2eigrueik2arei3kauei2lareilen1eil3f41eilzuei2moreim2plei2n1aei4nasein3dr2einduei4nelei2neu2einfoein3g2e1initein4szei2sa4eis2peeis4thei1stoei2sumei2tabei2tanei2tarei2troeit3umek1s4tek5triel3abiel2abte2l1akel4amiel4ampel1ansel1anze2l1apel3ariel1asiel1aspel2ast3elbiseld3s22e3lebe2l1el1e2leme3lem_el1empel1erdel1erfel1erkel1erl2eles2el1esse2l1ideli2neel1itael3lanel5le_el3linell3spel1opee2l1orelo2riel2sumelte2kel2t3re2l1umel3useel2zwae2m1ad3emanze3m2ene2m1imemi5naem1intemi3tiemma3uem2meiem3pflem2spren4amee4nanden3angen3areen2ascen3atte3nauee2n1\xE4ren4ce_en2dalend3siend3szend2umen1e2ce2neffe4neine2n1elene4lee2nerfe4nerhe4nerk4enerne4nerz1engad3engagen3g2ien3gloeng3see2n1inen3k2\xFCeno2mae2n1openost3en1\xF62den3sacen2sauen2sebens2el1ensemensen1en3skaens2po2enstoent4agen2teb1entfa3entgaen2thi3entlaen\xFC1ste1o2b1e3p2f41episo1e2pocep2tale3rad_er3admeraf4aera1frer3aicer3alleran3de3raneer3anfe2ranher3anmer3apfe3rarie2rathe3ratie2ratme1rauber3aueerau2fer3augerb4sper3chl2erdece3recher1effer1eige2reiner1ele2e3reme3renae3renz4erer_e4rerl4ererne3reroer1errer1erse2rerter1erwer1esser1eul4erf\xFCr1ergolergs4t1erhabe2riat4e3ric4e3rieer1inber1inker1inter1ita1erkl\xE42erkreern1oser1o2ber3onye4ro2rer3smoert2aker2thoerts2eeruf4ser1u4mer1underung4er1unses2aches3anze3s2ases3cape3schaes3evaes2haresi1eres3intes2kates4loges2ortes2sau4essemessi2aes2sofes2spues3stres3stuest1ake1stare1state3stele1stile2stipes4trie2s1umes3umse4teinet3haleti2tae4t1ofetons4e2treset4riget2tabet2teiet2t3ret4troett3szetwa4retze4seu2esceu4glae3um2seum4sceums1peum3steu4neie3un2geu2nioeun3ka3eu3roeu1staeu1stoeu1stre2velae2vent1e2xeme2x1inex2tinfa2benfa2chof1aderfa3l2afal2klfal3tefalt2sfan2gr2f1ankf1an3zfar2br2f3arcfarr3s3f4art2f3arzfa3s4afa2to32f1auff1ausb2f1\xE4rmf\xE42\xDFerfeatu42f1eckfe1inifek2tafe2l1afel2drfe2lesfe2l1ofen3safer2anfe2rauferde3fer2erf1erfaf2erl_f4erpaf2ers_fest1afest3r2f1etafe4tagfeu4ruf2f3efffe1inf3f4r\xE4ff3shoffs4trfi2kinfik1o2fi2kobfi2lesfi4linfil2ipfin3sp2f1intfi2s5tfit1o2fi2tor3f4l\xE4c2f5l\xE4d2f3l\xE4u2f3leb3f6limfli4ne2f5lon1f4lop1f4lot1f4lug4f3orgfo3rinfor4stfor2thfor3tu2f1o2xf3rand1f4r\xE4nfreik2frein42f3ricf4risc1f4ronfro2nafs1allfs4ammf2s1asf2sauff2sausf2sautfs1e2bf2s1emf2s1erf2si2df2s1o2f3spanfs1penf3s2plf2sprefs2prif2sprofs2pruf2stasf3steif2stipf3st4rf2s1unf2t1alft1e2hft1eigft1eisf4theif2t3rof2t3r\xF6f3t4ruft4samft3s2cft4sehfts3elfts2tift1url2f1unffun2klfun2ko2f1unmfu4re_fus2safus2stfzu4gaga2b5l2ga2dr2g1amtgan2gagan2grg3anla3g2ano2g1armga3r2og1arti2g1arzgas3eiga2sorga4spega4sprgas4taga4ste2g1auf2g1autg2d1aug2d1erge3g2l2g1eifge2in_gein2sge2intgein2vgei3shgelb1rge5lehgell2age3lorgels2tgel3szge3lumge4namge4nargen1ebge3necgen3szgen3th2gentwge2rabger2erger3noge1r2\xF6ge3r2ug1erwag2e1s23ge3scges4pige3steges3thge3t2a2getapge3t4ugge2ne3g2het3g2hiegi3alogi2e1igie1stgi2me_gi4mesgi2met2g1indgin2ga2g1insgi3t2ag2lade2g1lag3glanz2gl\xE4uf2g3leb4g5lerg3lese3g2lid3g2lie3g2lit3g2loa3g2lobg3loch3g4lok3g2lop3g2lotgne2tr4g3notgoa3li2gonis2g1ope2g1opfg2o1ragra2bigra2bl2gradl2g3rah2g3rak2g3r\xE4u2g5re_2g3recg4re2eg3reit2g3ric2g3r\xF6h2g3rui2g3rum3g4rup2g3r\xFCc3g4r\xFCng3s2ahg4saltgs3amags3augg4s3cegs4chig4s3crg3sel_gs3elig3selngs5erkg4setags4pieg4spingsrat4g3stang3starg4s3t\xE4g5st\xE4mg3stelg1steugst2heg3stirgs3tocg4stolgs3topgst4rig4sturgs4t\xFCcgu1an_gu1antgu4d3r2g1u2fgu1ins2g1unfg2ung_gunge2g2un4s2gunt22g1urlgurt3sgu2s3agus2spgus2stha2choha2delha4dinh1adle2h2al_ha2lauhal2bahalb3rhal2lahal2sthand3shan2krh4a3rah1arm_h2armehar2thh1arti2ha3sahat5t2h1aukthau2sahau2sc2hautohau2trh\xE43usphe1choh1echthe3ckehe2e3lhe2fanhe2f3lhe3friheim3phei4muheine2h1einkhe1ismhe1isthel1eche3lenhe4lof4h1emphend2she2nethenst2hen5trh1entshe2ral2heraphe3rasherb4she2relh1erf\xFCh1erkeher3thher2zwhe1stahe2tapheter2he3t4she1x4ahfell1hi2angh1i4dihi3enshier1ihiers2hil2frh1induhin2enhi3n2ihin3n2hin3s22hi3rehl1anzh1lauth5len_hlen3ghl2ennhle2rahl1erghl1erwh4lerzh4lesihl1indh3listhlo2reh3losihl2sanhl2serhl3skuhl3slohme1inhmen2shme2rahn3eighn3einhne4n1hne4pfh3nerlh3nerzhn3s2khn1unfho2ch3ho2ckahock3tho2f3rhol1au4holdyhol3g4ho4lor3hol3sh1o2lyho2mecho2medho4seihotli42ho2w1h1raneh3rechh4rei_h3reich3r2enhr2erghr2erkhr2ermhr2erzh4rickh4rineh4rinhh4risth4romeh4romihr2sauhr2serhr4sethr2tabhr2tanhr2torhrt3rihr2trohrt2sahrt2sehr1umsh2s1ech3s2exh2s1ofhs2porh2spr\xE4h2sprohst2anh1stechst2heh1s2tih2storh1s4trhst3rih1stunhs2ungh3t2alht3aneh3tankh4tasyht3a2tht1e2ch2t1efhte2heh2teifh2temph2t1euh2t1exh4theihthe3uh2t1inh2tolyh2torgh4trefh2t3ruh2t3r\xFChts2tihu2b1ahu2b3lhu4b3rhu2h1ahu2h1ihuk3t4hu2l3ahu2lerhu2lethu3m2ahung4shu3ni1hus4sahus2sphu2tabhu3t2hh\xFChne4h2wallh1weibhy2pe_i4a3g2ia2l1ai3aleiial3laia2lorial3t4ial3z2ia2nali3and2ia3p2fi2a3spi3a4tai3at4hib2blii2beigi2beisibela2iben3aib3renib4stei2bunki2buntibu2s1ich1eii2chini3chloi2ch3ri3ck2eid2ab4i2d1au1i2deeidel2\xE4ide3soide3sp1i2dio1idol_i3d2scid2s1pie2breie2choie2fauief3f4ie2f3lie2froie4g5lie3g4nie2g3riegs3cie3lasiel3auiel1ecielo4biel3sziel3taiena2bi3e2n\xE4ien1ebie3neri3en3gi3e2noien3scien3siiens2kien3szier3a2ie2rapie3resi3ereuierin3ier3k2i3ern_iers2tier3teies2spie1staie2t1aie4t1oie2triiet2seiet3zwifens2if1ergif1erhi1f4lai1frauif4reii1f4r\xFCif2topift3szig2absig1artiga1s4ige4naig1erzi2g1imig3reiig4salig3sprig4stoig4st\xF6ig3strig3st\xFCigung4i2h1ami2h1umi4i3a4ik1amtik1anzik1artik3atti2k1aui2k1eiike2l1ik1erfi2kindi3k4l\xE4i2k3raik2trei2l3abi2l1acil1a2di2l1akil1ansil1aspi2l1auil3ausild2eril2doril1e2cil1eheil1einil2f3lilf4s3ilie4ni2l1ipi3lip_i3lipsil3l2ail3l2iil2makil2mauil2mini2l1oril3t2hilung4i2manwima2tri2melei2melfi4meshi2metiim2meiim1orgim3pseim3staimt3s2in3a2ci4nacki2n1adin2arain2arsin4arti2n3auin2dalin2dan1indexind4riin3dr\xFC1indusin1ehein2erhi4neskine3un1info_1infosing1af1inhab2inhar2inhauin2i3dini3krini3sei3nitzin2nor1inntain3olsino1s4in1\xF62dins2aminsch2in2seb2insenin3skr1insta1insufin3s2z1integin3t4rin5trii3n2umin3unzinvil4io2i3dio2naui3ons3ion4stiore4nipi3elipi3en1i2rakir2k3lirli4nir2makir2mauir2mumir2narirpla4irt2stiru2s1isage2is3arei2s1\xE4ni2schmi2s3crise3haise3hiise2n1is2endisen3si2serhiser2uis2hasi2s1idi2s1of3i2soti2sparis1picis2pitis2pori2sprois4sauis3stais3stoiss3tris3stuis2sumis4tabis4tamist2anis4teliste4nistes3is4tocis5t\xF6rist4raist3reisum3pi\xDF1ersit1ab_ital1ait1altit2an_it1arti3tauci4t1axi2t1\xE4si2t1eii4teigit2eili4teinite2lai4tepoi2t1idit2innitmen2i2t1ofit3rafit3rasit3rauit3r\xE4uit3ricit3romit4ronit3runit2stoit2tebit4triitt2spi2t1umi2tunsit1urgitzes4it2z1wi2v1akiv1angi2v1eiiv1elti2v1urizei3ci2z1irjahr4sja3l2ajean2sjek2trje4s3tje2t1aje2t3hje2t3rjet3s2jugen2jut2e1kab2blka2ben2kabla2kabl\xE4ka3b4r2k1abt2k3adaka1f4lkaf3t2kaken42kala_ka2lanka3leikal2kakal2krkal4trkan2alka2nau2kanda2k1angk2ans_k2anz_2k1apfka3r2i2k1armk2arp3kar2pfk2artaka2s3tka3tanka3t4hka4t3r4kaufrkau3t22kautok1\xE42mik\xE42s1ckdamp22k1e1cke2he_kehr2s2k1eic2k1eig2keinhkel1acke3lagkel3b4ke2lenke2lerkell4e2k1empken3au2kenl\xE4kens2kken3szk2enteken3thk2entrk2entu2kentwke1radk2erkok1e2rok2ers_ke2selke4t1ake2t3h2k1e2xki1f4lki1f4r2k1intkis4to4k1lack4leidk3lem_2k3lerkle2ra2k3leukle3usk2lisc2klistklit2s2k3locklo2i3klost4klung42k1l\xFCc2k5nerkno4bl2k5norkoh3lukol2k5ko3n2ekon3s4ko1r2a2k1orckot3s22k3radk3rats2kraum2k3r\xE4t2k3rec2kred_2k3refk3reick3reih2k3rick3ries3k4ronks1e2bk2s1emk2sentks1erlk2s1idk2s1ink2s1o2ks2pork1s2tik2stork2str\xE4k2stumks2zenk2t1adkt1aktkta4rek2t1auk2tempk2tentkte3ruk2t1idkt1insk2t1ofkt1opekt4rankt3rask4trefktro1skt3runk2tuns2k1uhrku3l2eku3l2i2k3umlkum2s1kun4s4kunst32k1up_kur2blku2reikuri2ekur2spkur2stlab4ralab4ri2l3absla2ce_la2gio2la1hola2kesla2k1ila1k4lla3min1lammf2l1amtlamt4sla4munl1analla2nau3l2andlan2gl2lanh\xE4l2anhe4lanli2l3ann4lans\xE42lantrlan2zwlap4pll3artila2saulast1ola4tel2l3athl2auf_lau2fol2aufz2lausl2lausr2lauto2l1\xE4hnl\xE42s1cl4betal2b1idlb2latl4bre_lb3ritlbst3elb4stol2b3uflbzei2l3d2acl2d1akld1amml2da2rld3arild1arml2delel3der_ld1erpl2d1idl2d1iml2dranl3d4rul2d1umle2chile2gau3l2ei_lei2br4l1eigl2ein_l2eindl2eine2leinkl2eintl4eistlei2talekt2a2lektr3l2ela3lemesle4nad2lendul2e2nolen3szl1ents4lentzlen2zil2e1rale2ragle2raul1erfol2erfrl2erf\xFCl2erkal2erkol2erlel4ers_lers2klers2tl2ert_l2ertel2erzales2amle3serleste3le1stole2tat2le3thlet4tule3u2f2leurole2xislfang3l2f1ecl4feisl3f4l\xE4l3f4lulf3ramlgen2alge3ral2getilian2gli3chili2ckali3d2ali2deo2l1idolid3scli3enelien3slie2stli2grelik2spli3m2ali3n2alin3alli2nefli2nehli2nepli2nes2l1inflings52l1inh2l1injlink2sli2noll2ins_l2insal2insc2linsp2linst2l1intli3os_li2p3ali3s2a2l1islli2tallit1s2lit3szlizei3lk1alpl3k2anl3kar_lken3tl3k4lul2k3rol2k3rulk4st\xE4ll1abbl2labtll1affll1aktl3l2alll3amall2anwll1anzll1armll3augl2lausl2l1\xE4mll1echlle3enl2l1efll1eiml3len_llen3gl3ler_lle2ral2lerzll1imbll1impll1insl2lobel2l1ofll1opfl3lor_l3lorel2l1oul2l3\xF6fll3s2kll2sprllti2mllt5s2l2marclm1auslm1indlm1inslm3stelm3s2zln3are3l2ob_lo2berlob4ril1o2felo2gaulo3h2e2l1ohrlo2k3rl1o2lylo2minlo2n1olo3renlo4skelo2speloss2elo4stelo3thalo3thiloti4o2l3\xF6felpe2n3l2p1holrat4sl3s2all2sannl3sarel2s1ecl2s1emls1erels1ergl2serhls1erlls2logl3s2pil2sprol3s2pulstab6ls4tafl3stecl3steil3stell4stemls2tiel2stitls2zenlt1a2mlt3andlt1angl3tarblt1artl2t1aultbau1lt3elil5ten_lter3alt2erglt4er\xF6lte2thl2t1eul4theiltimo4l2t1ofl4t3\xF6tltra3llt3r\xE4ult4rielt3roclt3rosl2t3r\xF6l2t1umltu2ri4lu4b32l1ufelu2g1alu4g3llu2g3rlug3salug3splu1id_2l1una2l1unf2l1unilu2s1ulu2t1alu4teglu2toplu4t3rl2z3acl3z2anlz2erklz1indlz2wecm2ab4rma2d4rma4d2sma2ge_ma2gebma2gefma2gegma2gekma2gepma2getma2gevma2gew2m1aggma3g4n2m1agomai4se2m1aktmal1akma2lanma2lauma3lermali1emal3lo2malltma2nauman3d2ma2net2mansa2mans\xE42mansc2mantwmar3g2maro3dma3r2uma2tanma2telma5trimat3semat3sp2mausg4m1\xE4ndm\xE43t4rm2d1ummedie4mee2n12m1eif2m1eig3meistme3lamme2laume2lekme2lermelet42melf_mel2semel5t4mena2bme3nalmen3armen3aumen3glme3normen4skmen2somen3ta2mentnmer2er3merinme2sal4meser2me3shmes2stmeste2me1stome3t2amie3drmi2e1imien3smie2romie4timi2karmi3l2amilch1mild4s2m1impmin2enmin2eumin2ga3min2omi2t1rmit3s2mit5sami5tsumi2t1umk5re_m2m1akm2m1almm1angmm1anzm2m1aumme4namme2samm1inbmm1infmm1inhmm1insmm1intmmi3scmm3stamm3strmm\xFCll1m4nesimode3smo2galmo2k1lmon2s3mon3su2m1opemo2rar2m1orcmor2drmo2rermos4tampf3limpf1ormp3strms3andm4s1efms1erwms1inims1orim2spedm2spotm2sprom4stagm3stelm3s2tims5tr\xE4m3s2tumt3aremt1eltm2t1eum2t1immtmen2m2t3romt2sprmt1urtmu3cke4m3unfmu4s1amu2s1omut1aumut2stmvoll14n3absna2ch1nach3s4na2drna1f4rna2gemna2h1a3n2aldna2letnal3lanalmo2na2lopnal2phn2als_nal3t4n4amenna3m4n2n1amtnamt4sn1and24n1ang2n1ans2nantrnap2sina2r1an2arle4n3artna3r2unasyl2na3t4hnat4sanat4sc3n2aul4nausb4nausgn2auso4nauss4nausw2n1\xE42mn\xE4r4s53n\xE41umnbe2inn2d1akn2danlnd1annnde2sendi2a3ndo2ben2d3ren2drobnd3rolnd3rosn2druind2sornd2spr2n1ebnne3ein4n1ehr3neigtnek3t42n1ele5neleb4nelek4nelemne3lennel4la3ne3lu2n1embn1e2mi2n3emp2n1emsnen3a2n1endgnen3einenen14nengb4nengs4nengtnens4enen3skn1entb4nentn5nentrn1ents4nentzne2n3u2n1epone2posne2ranne2rapne2raun1erbine2reb2nerf\xFC3nergrn2erlin1erm\xE4n2ern_ne1r\xF6sn2ert_n1ertrne2rup2n1erzne3sanne3skane2s1pne1stanes3tine2tadne2tapn1etatne2taunet3han1e2tunet2zi2n1eupnfalt4nf5linnft4s3ng2absn2g1acn2g1akng2anfng1anzn2g1\xE4ln3g2enngen2an3gl\xE4sn2glicngrab6ng3ratng3rocngs3panich1s3n2id_nie4n3ni3eneni1eronifes3ni2grenig4spni2kalni2karni3ker4n1imp3n2in_n2in4a4n3ind4n1inhni2nor2n1insn2ins_4ninse4n1int2n1invni2s1eni3se_ni2s1pni3spinis3s4ni2s1uni3t4rni3tscnitts1n2k3adn2k1akn3k2aln2kansn2kausn2k1\xE4rnk4ergnk1inhnk3lennk3lesn2klienk3lunn2k3ronks2eink3s2znk2taknk2tannkt1itnk4topnk2trunmen2snna2ben2nadan2n1annnen3gnn2erhnn2erknne2r\xF6nner2znnes1enne4stnn1o2rnn3s2pn2n1ufno2blano2leu3n2opano2radno1rakno3ral3n2os_no2s3pn2ostenost1r2nostvno3tabno2telno3t3hno4thano4thi2n1o2x4n1\xF64lnr\xE4u3snre3sznr\xF62s1n2sangn2santn2sausn2s1\xE4nns1e2dns1entn2s1epns1erfns1ergn2serhns1ersnsfi4lnsho2fn2simpnsi4tensi2trns2kaln2s1opn4spatn3s2pins4piens3ponn4spr\xE4n4spronst1akn3starn3statns4tornst\xFC1bn2s1unns2ungns4unrns4unsn4s3zint3absn3t2alnt1angnt2arbnt1arknt2armn2t1\xE4unte3aunt1ebente3g6n2teignt4enent4ernnt4ersnt4ertnt2hern2t3hon3t4hunti3kln2tinfntini1nt2insn3ti1tnt4lemntmen2nto3ment3recn5trepnt4rign5tropn2t3r\xFCnt4saunt2sto3n4tu_ntu2ra2n3umb2n1ums2n3umz3nung_n3ungl2n1uninu4t3rn2z1aun2z1\xE4nnzdi1snzi2ganzig4snz1inin2zurkn2z1wan2z1w\xE4n2z1wuoa3cheoa3chioa4k1lo4a3lao4a3mi3oa3seo3b2al2o3b2\xE4ob3ein2o3b2iob3iteo2b3li2o3bloo2b3reob3s2hob2staocha2boche4boch1eioch3\xF62och3teochu2fo2ckarock2erock3szodein3ode2n1odene4ode3sp2o3diaof1a2co2f1eiof2f1a1offizof2f5lof2f3r2o1f1rof4samof2speof2sprof2s1uof2teio2g1abog1alaog1ango2g1eiogi2erog1steohen3sohl3auoh3lecohl1eioh3lemoh3lenoh3lepohls2eoh2n1ooho2laoh1o2poh4rinoimmu4oka2laokale43o2kelok2s1po2l1akolars2ol1aufol4damol1eieol1eisol2fraoli3k4ol2kreol2lakol2lelolo3p2ol1ortol2strol2z1aol2zinom2anwom1arto2m1auo2m1eio3men_o2meruom1erzomiet1om1ingom1orgo4munto2narbon3ausone2n3onens2on1erbon1ergon1er\xF6o3netton3g2lon2i3do4nikro4n1imon3ingonlo2con3n2eo2nokeon1orconsa2gon4samon2sebonse2lonst2hon3t2aoo2k3lo2p3adop3aktopa2leo1pe4nop2f3aop3fahopf3laop1fl\xFCopi5a4op5lago2p3le1op3t4or3a2bor4altor2ando2ranhor3arbor3attor1\xE4ndor2baror2dauor2deuor2ditor2dumore4aso2r1efor1eigo2reino2rerfor1ethor2fleorf3s42orgetor3g2h2orgiaorgi1eor3gle2o3ric4orie_o3rier4orin1or5ne_or3s4aor2t\xE4ror2tefor2theor2torort3reo4r3un2o3s2ao3scheo2s1eio3s2hi2os2kl2os2koos3peco3s2poos2seios2s3oos4sonos2s3pos2s3tost1auos4teios2t3hos3tilost3r\xE4ost3reost3ufo3s2zeo2\xDF1elota2goo5tarko3tarto2t1auot3augotei4not4em3otemp2ot5helo2t3hiot3hosot1opfoto2rao2t3reot3rinot4spaots2peot2sprot2t3rot4triou1f4lou4le_o3undsou3s2ioviso3owe2r11o2xid\xF6be2la\xF6be4li\xF6h3l2e\xF6l2k3l\xF6l2nar\xF6l2ung\xF6nizi1\xF6p4s3t\xF62r3ec\xF62r1ei\xF6r2erg\xF62rerl\xF6r2f3l\xF62r1im\xF6rner2\xF6r3s2k\xF62scha\xF62schl\xF62schw\xF62s1ei\xF6s2s1c\xF6te4n3pa1f4rpa1k4lpak2topala3tpa2narpa3neipa2neu1pa2nopan3slpa5regpa5rek1park_par2klpar2kr1partn1partypar3z2pa3s2ppat4e2pa5t4rpa3unip\xE43ckep\xE42t3hp\xE4t3s4pekt4spe2letpe2lexpell2apell4epen3dape4nenpe2n1o3pensi1pensupen3z2per2anper4nape2robperwa4pes3s2p2f1akpf1ansp2fa4rpf3arepf3armp2f1au4p3fe_pf1eimpf1einp3fen_p2fentp3fer_pf2erwp3f2esp2f3l\xE4pf3leipf3lie2p1heiphen3dphen3sphi2ka2phthepi3as_pi3chlpiela2ping3s3pinsepi3onupi4pel3pirinpi3t2aplan3gpo2laupo4lorpo1o2bpo1ralpo1raupo4stapo4st\xE4po2stopos6trpo2t1upp3anlppe2n1p2p1f4p3p2hopp5lanp2p3rap2p3repre2e13preis2p3rer3p4res1prinz2prosspro1stp3steap3stelp3s2tipt3albp4t3ecp4t1eip4telept1in1pto3mept1urspul2sppu2s3t2r3aacra2barrab2blr2aber1r4abi2r3abwra2chura2dam2radapraf3arra2ferra3gle3r2ahmrail4l2r3airra2krera2kro2raktira2la2ral3abr3alar3r4aldral3larall2e2rallgr3alp_2ralper3al3trama3srambi2ra2mer1r2ami2r1amtramt4sr4andar4anderand3sr4aner1rangirani1eran2kr2r1anm2r1anpr2ans_r2ansp2rantr2r3anw3rareirar3f42r3arz2rato_rat2st3raub_rau2mi3rausc2rausgrau2spraut5sr\xE42s1c3r\xE4tser2b1abrbal3arba3rerb1artrb1aufrb1echr4bel\xE4rb1entr3b2larbla2dr2ble_rb3lerrb2linrb4seirb3skarb4st\xE4rb3strr1che_r1chenrch1s2rch3sprch3tar3d2acr2d1akr2d1alrdani1rd1antrd1anzrd2ei_rden3drde3rerde3sprdi3a2rdia4lrdo2berd3ratre2altre3at_re3atsre2b1are2b1lreb3ra4rechs2reck_2recki2reditre2hacre2h1ire2h1orei4bl4reifrrei3gareim2p4reingr3eink4reinr4re2ke2r1elbre3lei2r1elf2r1elt4rempfrena2bre3nal3rendiren3drren4gl2rengp2rengsr1ense2rentw3r4er_2r1erbr2erbr2r1erdr2erenr2erki2rerl\xF62r1ermre2robr2erse2rerspr2erte2rertr2r1erzrer5zer2erzy3r4es_ress2ere1stare2thyreu3g2re3uni2r1eurrewa4rrf1\xE4ltr2fentrf3licrf3linrf2s1\xE4rf2s3trf3t4rr2g1ahr2g1akrge4anrge2blr2getor2glanr2gleur2g1obr2gregr2gresr2gretrg3rinrgs4tr3r4he_3r4henrho2i3rib2blri1cha2ridolrie2frriene4rien3srie2nuri1er_ri4ereri2f1ari2ferri2f1orim4scr2i3na2r1indri3n4erine1i2r1infrin2foring3lrin2gr2r1inh2rinitr1innu2r1insrin4sorin2sp2r1inv3risikri4s1pri3t2irit2trr3klaur2klisrk5nebr2k5nurk3r\xE4urk3rinrk2s1erk3shirk2tinrk2t3rrk3trark4trirk1unirl\xF6s3srl2s1prl3ster3m2agrma2larm1ansrm1anzrm1a2pr2maphr2m1efr2mider2m1imrm3starm3umsrn2andrn3anirn2a2rrn3arern3arirn3eifr4nerfr4nerkr4n1inr2n1opr2n1orrn3s2\xE4rn3s2prn3s2zrn3t2ero2bei3rock_r2o3deroh3na3r2ohrro2madro2mer4ro1nyror3alro2ratro2reiro2r1oror3thro3s2iro3smoro3starost1rro4tagrote3iro2thoro4trirots2orot2taro3t2uro3untr\xF62b3lrpe2rerrer4srre2strr2n3ar2r3obrr3stur4samprs3anprs3antrsch2lr3schur3schwr2seinrse2n1rs2endrse4ners1erers1er\xF6rs1ersrs1erzrs1etars2kalrs2kanrs2kiers2kisr4s1opr4sordr2s3phrs2tecr3stier2stinr2stiprs4tobr4stotr3s4trr3s4t\xFCrtals1rt1angrt1annrt1antrt1anzr2t1arrte1e2rt4eifr2telfr2temort1ersrt3holrt2humr2t1idr2tinfrto2rirt3recrt3rosrtr\xFC2crt2spart2sprru2ckurude2aruf2s32r1uhrru1insru2m3ar2ums_2r1unar2unde2r1unf2runglrun2kr2r1unl2r1unm4r3untru2r1erus4stru3staru4teiru2t3rr\xFC1benrwun3srz1a2cr5zenerz1engr3z2ofrzug2u3sabetsa3blesach3t2s1ada2s3affsa1f4r3s2al_sal2se2s1alt3s2alz4s1amnsam2tos2an2cs4and_3sang_2s3anh2s3anl2s3anssan4sk2s3anw3s4ar_3s2ara4s3arb3s2ard3s2ars4sartisa4ru24s3ath4s3atlsauri1s3ausw2s1\xE4nd3s\xE4nge2schak2schao3sche_2schefsch2en3sches4schexschi4es4chim3schis2schm\xF62schn_2schoxschs2e4sch3tscht2ascht4rsch2up3s4cop3sco4rsda3mese3at_s1echtsee3igseein2se1er_se1er\xF62s1effse2galse4helse2hinseh3rese2h\xFCb2s1ei_2s1eie2s1eig2seinb4seing2seinh4seink2seinl2seinn4seinr2seinw4s1eis3s2eitse2l1ase3ladsela2gse3lamsel1ec4selem2self_s3elixse2l3\xF6sel3szsel3trs4e3ma2s1emp3s2en_se4nagsen3gl3s2enise4nob3s2enss2ent_s2enti2sentw2sentzse2n3use5refser2ers2erfrs3erf\xFCs2ergr2serh\xF6se2robs2ers_2sersas4ert_s2ertase3rum3s4ervse2selse1stase2tatse1u2n3s2ha_4s3hansho4resi2achsi3enesi1errsi3gnusi2g3rsig4stsi2k1\xE4sik3t42s1immsi3n4a2s1ind2s1infsing1asin3ghsin2gr4s1inhsini1e2s1inq2s1ins2s1int4s1invsi2s1esi2s1osi2s1psi2tausi2tra3skala4skanz3s2ki_3s2kik3skulpsla2vesler3s3s4lipsli4tuslo3be4s5not2s1o2bs1o2he4sohng2s1ohr4so2lyson3auson3s\xE4so1ral2s3ordso2rei4s1ostso3unt2s1\xF62l2spala2spara4sparo3sparuspe3p4s1peri2sperl2speros2perr4spers3s2pez4spi4p3s2plis3p4lu4s3poss2potts2pracs2pran4sprax2spr\xE4m4spr\xE4s2spred2spres2sprob4spr\xFCfsrat2ssr\xF62s1ssa3bos2sanos4sansss2antss3attsse3hass1er\xF6s3s2essse3tass1offs2s1opss1oris2spros3stelss4tipss2turss1ums2stabb3s4tad3staff2stale2stalkst1almst1alpst1ami4stan_sta4na3stand2stani2stans2stanws4tar_4staris4tarsst1asis3tat_2stauf2staum3staur2staus4st\xE4lts4t\xE4nd5st\xE4tts3t\xE4us4s5te_3s2tegste2gr3s4tehs2te2i3steig4steil1s2tel2stel_2steln2stels4stem_s5ten_st4ens4stermste4sts4teti3s2teu1steue4steufs2t3ho2stie_s2tiegs2tiel2stien3s2tif3s4tims4tinfs3tinnst1ins1stitu2sto3d4stod_s4toffs4t3om2stopo2stor_2store2storg2storis3tort2stose4stote2st\xF6ch2strad2strag4strai4strak2stral5stra\xDF2strua2strug3struk2strup2st3t43s4tud2stumt2stun_4stunn2stuntstu3rest3url2sturn2s3tus2st\xFCch2st\xFCr_2st\xFCre2st\xFCrg2st\xFCrs3s2tyl3su2b3su2cha2s1u2fsu1it_su2marsu2mau3s2umesu2mels3umfesum1o2su2mors3umsas3umst2s1uni2s1urls\xFCden24s3zeis2zena4szent4s3zet2\xDF1e2g\xDFe2l1a\xDF2ers_2\xDFerse\xDFge2bl2t1abb3tabel2taben3table2t3abn2t3abtta3d2s3taf2et1af4rta2ga24ta3gltag4sttah3leta3i2kta1insta1ir_t1a2kata2krotak6ta3taktb3t2al_ta3lagta3lakt1alb_t1albk3t4aletal2l\xF6ta2mert1amplt1a2na4t2andt3ankl2tanwa2tanw\xE4t2anz_t1anzat1anzuta2pe_ta2pes2t1armt1artitar2to2t1arz4t1aspta2tanta2tautat3eita2temtat3heta2tom4tatue2t1auf4taufg4taufnt1ausb3tausct2auset1ausk4tausltaxi1s2t1\xE4ltt1\xE4ngs3t4ebbte3cha3technteck2ete2ckite2en3te1erwteg3ret3eifr2t1ein4teinf4teinnt3eis_t3eisb3te3letel1eb2telemtel1ente4leute2littell2ete2l1\xF63telt4tel3tatel3thte2min2temme2tempfte4m1utena2bte4naste4nauten3dat6endit6endote2nefte2nettens2et4entat3entb4tentdt4ente4tentnten3zwt3e2pi3t4er_tera2bte1rafter3am4terbs4terbtte2relt4erfrte3ria3termi2ternct4ers_terst4ter3zatesa2cte2santes\xE42cte2selte2sprtes3s2te2tat3teur_2t1exz3t4ha_3thal_4t3hau1t2he_2t3heit4heint4henet4heni2therr3these2t3hil2t3himth4mag2t3hoc2t3hoht4hol_2t3hot1th2r2ti3a2mtiden2ti2deo3tief_3ti2erti2kamti2karti2kinti2kr\xE4ti2larti2leiti2lel4t1imp3t2in_4t1indti3n2eting3lting3s2t1inj2t1int4t1invti2seiti1sta2ti3tuti2vanti2velti2v1oti2v3rtlung4tnes4s3tochtto4d1utom1e2to2mento2nauto2nehto2pakto2patto2rauto4r\xE4nto2relt3orga3torint1ort_3tost4to1sta3to3teto2thotouil44tractt3rad_6trahm5t4rai2trand3trankt3rann3transt3raset3rasi3tr\xE4ne4t5re_tre2brt3recht4reck6t3red5t4ree4trefe4trefot4rei_4treic2treift3reigt3reint3reis6treitt3reiz6t3relt4ren_3trendt3rent2trepe2trepot4reprt4res_3treuh5trieb2triegtri4er5triggt3rind4tringtri3ni4trinn4tripttrizi13t4roitro2ke4trom_tro2mi4troml2t3roo3tropf2t3r\xF6ttrums15t4ruptru2thtr\xFC1betr\xFC1bu2t3r\xFCct4sa4bt3s2act2s1aht4s3art2s1\xE4nts4cort3seiltse2n1t2s1erts1init2s1irt1slalt3spalts1parts2pedt3spekt3s2pit4stagts3takts4talt2stipt4stitts3tocts3tort2strits3t\xFCrtta2bet2t1adtt2anttt1arttt1ebett1eiftt1eistte2lattel1otte2satte2s\xE4tt2h\xE4ut2t3hott4roctt2sentt2sortt2spett2sprtt2stitu1almtu2chitu3fent3u2kr3t2ume2t3umf2t3umg2t3umk2t3umrtum2situm2so2t3umt2t3umz2t1una2t1und2t3unft3unga2tunif2t3unttu2re_tu2reitu2resturin1t\xFCck2s3t\xFCr3s3t\xFCtentze4n1tz2enetz1erltze2rotz2erst3ze2stzgel2tz1indtz1inttz2tinua2lauu3aletual2mau3a2louara2bu2be2cub3licu2b3luub2sanub2s1oub2spau1cha_uch1eiu3chesuch1iluch1inu2ch3ruch2souchst4u2ckemuder2eudert4udi3enuditi4ue2neruenge4uen2zuue2r3aue2r1\xE4u3erehu3ereru3erexuer3g2uer2neue2r3ouer3scuer3t2u3erumue4teku2f1\xE4su2f1eiu2f1emu3fen_u2fentuf2ernuf2frouf1oriuf4sinuf2spouft3s2u2g1apu2g1eiug3ladu3g2l\xF6ug4serug3spaug4sprug4spuug5st\xE4ug3strug3st\xFCuhe3s6uh2reruh4rinuisi4nui4s5tukle1iuk2t3ruld2seu2l1elul1erful1erhul1erwule2saul1etaul1insul2lesul2p1hul4samuls2thul4trium1allum1anzu2maut1um3d2umer2aum1ins3umsatum4serum2simu2m1uru3n2amu2n3an2un2asun4dabun4deiun2didun2dorun2d3r4unds_und3spund3stun2ei_un3einunen2tun4es41unget1ungew1ungl\xFCun2g1rung3raung3riung4saun3ide1u2nifun3islu3n2it3u2nivun2keiun3n2eunvol2u1or3cu2pf2eu2pf1iu3rabaura2beur2anbur2anhu2r1auur3b2aur1effu2releu4r1epur1erhur1erwur2griurg3s4ur1iniur3insur1int1urlauur3sacur2sanur2sauur2serur4sinurst4rur2z1wus4annu2s1ecu2s1eiu3seiduse1rau2serpu2s1opu2spatus1picus2porus4sezus2sofu1stalus3tauust2inu2stunu2sturut1altut3a2mu2t1apu2t1arute4geut1ei_ut1eieutel1eute2n1u2tentu4t1exu2t3hout1opfu2topsut3reaut3s2aut2s1\xE4ut2spaut5t4lutu4reutu5ruut2z1wuve3r\xE4\xFCb2s3t\xFCcht4e\xFC3cken\xFCck1er\xFC3den_\xFCden4g\xFCdwes2\xFC2f1ei\xFC2h1ei\xFChl1ac\xFCh3r2e\xFChr3ta\xFC2ment\xFCn2fli\xFCn2g3l\xFCn3str\xFC2r1ei\xFC3r2o1\xFC2schl\xFCs2s1c\xFC2t1alva2teiva2t3hvatik2va2t3rvat3s4va2t1uveits32ve3muve3nalve3radve3rasver3b2ve4rekve4rinver3stver5te2ve3scves3tivi4a3tvie2w1vi2l1avi4leh2v1i2m2v1intvi3s2ovoll1avol2livo5rigv1steuwab2blwa3chewaffe2wa2g3nwah2liwal4dawal2tawal2towang4s1war2eware1iwart4ewass4e4webebwe2g1awe2g3lwe2g3rweg3s4wei4blwei2gawei3k4wei4trwel2t1wel4trwen3a4we2r3awer2bl1werbu1werduwerer2wer2fl1werk_wer2ka1werkewer2klwer2kuwer2tawer2to1wertswe2s1pwest1awes2thwest3rwes4tuwett3swi3ckawien2ewie2stwim2mawin2drwi3s2e1witzlwo2chawoche4woh2lewo2r3iwo4r3uw\xF6rt2hwul3sewur2fa1wurstwus3te1wu4t1xe3lei3x2em_xen3s2x1i2doxin3s2xi2so2xis4t\xE4x1i2tuxtblo4x2t1eix4tentx2t3evy3chisyloni1y2p1iny1s4tyy2s1u22z3a2b2z3a2k2z1all2z3anf2z3anlz1artizar2tr2z1arzza1st42z3at3z1au2fzb\xFCbe32zecho2z1eck2z1effzei3lazeile42z1einzei3s4zeist4zei2trze2lenzell2azel3sz2z1empzens2ezent3sze2r3a2zerh\xF6z2erl_2zerl\xF62z1erq2z1erzze3skuzes2spzes2stze2s3tze3sta2zettszger2azi3alozi1erhziers1zi1es_2z1impzin4er2z1inf2z1inhzin1itzin2sa2z1invzirk6szi3s2zzi1t2hzor4ne2z1oszz2t1auz4tehezt1inszt3reczu3ckezug1un2z1uhr2z1um_zumen22z1umszup2fizu3r2a2z1url2z1urs2z1urtz2wangz2weigz1weis2z1wel2z1wen2z1werz2werg2z1weszzi1s4`, 7: `_al4tei_amt4s3_and4ri_an3gli_angst3_an4si__an4tag_ausch3_be3erb_be3r2e_berg3a_bo4s3k_bu4ser_da4rin_da4te__da4tes_de4in__dien4e_ebe2r1_en2d3r_en4tei_er4dan_er4dar_er4dei_er4der_es5t4e_fer4no_fi3est_fi4le__fi4len_ge5nar_ge3r2a_ge3r2e_ger4in_hau2t1_her3an_ho4met_ima4ge_ka2b5l_li4ve__lo3ver_lus4tr_men3t4_orts3e_pa4r1e_reb3s2_re3cha_rein4t_reli3e_res6tr_sali3e_sim3p4_sto4re_tage4s_ti4me__ti4mes_to4nin_tri3es_ul4mei_urin4s_ur3o2m_ve5n2e_wei4ta_wor4tu_zin4stab1er2raber4ziaber4zoab3essea4cherfa4cherka4cher\xF6ach1o2bach2t1oach1u2fa3d2ar3ade1r2aade3s2pade5str2ad3recaf4t5reage4neba4gentuage4ralage4selage2s3pag3esseags4toca2h1erhah4l1eiahner4eahre4s3ahr6tria3isch_ajekt4o1a2k4adak5t4riala5ch2a2l1angalb3einalb3eisal4berh3a2l1efa4l3einal3endsa2l1erfa2l1erha2l1ert3a2lerza2l1eskali4eneali4nalal3lenda2l1o2balt3eigalt3ricalt4st\xFCalzer4zamen4seamp2fa2am4schlana4lin2ana1s4and4artandel4san2d3r\xFCand4sasand3stean2f5laan2g1eian4gerwan2g3raan2k1anan2k3noan2k3r\xE43antennan3t4heant3rina3ra3lia2r1anga2r1ansa2r1anza2r3appar2b3unaren4seare3r2aa2r1erhar2f3raari3e4nari3erdari3ergarin3itark3amtar2k1arark3aueark3lagark4trear4merkar3m2ora2r1o2dar2r3adarre4n3ar4schla4schecasch3laa2s3e2ma2s1o2fas4s3eia1s4tasas6t3rea2t1aktater3s2ato4mana2t1ortat4schnatt3angat3t4h\xE4at2t3r\xE4at4zerkat4zerwat2z1inau2b1alauch3taau4ferkaup4terau2s1ahau4schmau4schoaus3erp3aussagaus4se_aus5triau2t1\xE4u\xE43isch_\xE4l4schl\xE4n3n4e2\xE42r1ene\xE4r4ment\xE4ser4ei\xE4se4ren\xE4skopf3\xE4t4schl\xE4t4schr\xE4u4schm\xE4us2s1cba2k1erban2k1aba2r1ambau3s2k2b1eierbei4ge_2b1eimebe1in2hbe2l1enben3dorben4spaben4sprben5t4rber4ei_be4rerkber4in_ber3issbe2s1erb3esst_be3s4ze4b1illubis2s1cb2i3tusbjek4to2b3leidbo2l1anbor2d1ibor2d3rbor2t3rbra1st42b3rat_2b3riemb4schanb6schefb4s1erfb4s1ersbst1a2bb2s3tr\xE4bs3treubtast3rbu4schlbu4schmbu4schwb\xFCgel3eca3s2a3ch3a2bich3anst3chartache4fer4chelemche4ler4chents4chentwche3rei2ch1e4x3chines2ch1invch3leinch4sper2ch1unf4ckense4ckentw4ckerh\xF64ckerke2ck1err4ckerze2ck1eseck4stro2ck1um3com4te_comtes4cre4mes2d1alar2d1amm\xE4dan4ce_dan5kladan2k1odar2m1i2d1au2f2d1aus3delei4gde3leindel4lebdel4leide2l1obdel4sandel2s5edel2s1p4denergden4sende2re2bde4reckder3ediderer4tderin4f4derkl\xE44derneuder3taudert4rades3eltde2sen1de4stredes4tumdeten4tdge4t1edie4nebdi3ens_die2s3cdi2s5tedi4tengd2o3r4ador2f1a2d3rast2d3rauc3d4reck2d3reic3d4riscdrunge3dr\xFC5cked4s1amtds3assid4schind2s1e2bd4seinsd2s1engd2s1entd2s1erfd2s1erkd2s1erzd4s1etad3s2kand2s1pard3stell2d1un3ddu4schndu4schrdu4schwe4aler_e3at5t4ebens3eebet2s3eb4scheeb4st\xE4tebs3temebs3t2hech1o2bede3n2eeden4seeden4speder3t2ed2s1esed2s3treein4see2f1e2be2f1i2de2f1insege4strehen6t3ehe3strehl3eineh4lenteh5l2erehr1e2cehr3erleienge44eigeno1ei2g3nei3k4laei4leineil3inseim3allei4nengein4fo_ein4fosein4hab3einkomei2n1o23einsate4inverekt4antekt3erfekt3ergela4bene2l3a2me2l1a2re2l1eine3leinee4leing2e3len_e4lensee2l1ente2l1erge2l1errell3ebeell3eiseller4nelt3eng3elternelt3s2kelt3s2pe2m3anfe2m1ansem2d3a2e2m1erw1e2metiem2p3leena3l2ien3d2acend4ortend3romend3s2pene4bene4n1enten4entr4e3ner_e2n1erd1e2nerge2n1erle2n1erre2n1erse2n1erte2n3erue2n1erwe4n3essenge3raeni3er_e2n1i4me2n1o2benob4lee2n1o2ren4terb3entspr4entwetenz3erte4ratemerd3erwer3echser1e2ckere4dite2r1e2h4e3rei_4e3ren_e4rensee4rentne2r3erfe2r1erher3e4tiere4vid3ergebn4ergeh\xE4e3ri3k44e3rin_e2r1ini3erlebnermen4serm3erse2r1o2pers4toder4tersert3ins3erweck6erweise4s3atoe2s3einese4lere3s2peke3s2pore3s4praess3erges2s1paestab4be4starb1e2stase1s2tecest3ories3trope\xDFe3r2eeten3d2eter4h\xF6eter4tre4traume6t3recetsch3wet2t3auette4n1et4t1umeu3ereieu3g2ereve5r2iewinde3e2z1ennfa4chebfa2ch1if\xE4h2r1ufeh4lei2f1eing4f1einh2f1einw2fe2lekfe2l1erfel4sohfe4rangfer3erz4ferneufest3eifet2t3afeuer3effel2d1f2f3emifi1er2ffi2l1anfisch3o2f3leinflu4gerfor4teifor2t3r2f5raucf4schanf4scheff4s1ehrf2s1entf4s1etaf3s2kief2s1pasf3s2porf4stechf3s4telf3sternft1a2bef4t1entft4scheft4s3t\xE4ft4stri2f1u2nifun2k3rfus2s1pfu2\xDF1er4gangeb2g3ankugas5tangebe4amge4lanzge4lessgel3stegel3t2agen4auggen2d1rgen3eidgen3erngen4samgen4ta_2g1entfge4renggerin4fgerin4tger4satger4stoges3aufges3eltge2s3erges3s2tgien2e12g3isel3g2laub2g1lauf4g3lein4g3lisc2gni2s13g2num_2g3rede2g3reic2g3rein2g3renng3riese2g3ringg4s3a2kg4schefg3s2eilg3s2pekg3s2porgst3entgst3errg4s3torgs4trat4gungew2g1unglguschi5gus4serhaf3f4lhalan4chal4beihal4t3rhar4mes2h1aufmhau4spah\xE4u2s1chba2r3ahe4b1eihe5ch2ehe2f1eihef3ermheiler4heit4s3he2l3auh3e2lekhel3ershel4meihe4n3a2hen3endhen3erg2h3entwher3a2bhe4reck4hereighe4rerwh1er2foherin4fherin4sh3erlauhe2s5trhie4rinhif3f4rhi2l3a4hin4t1ahir4nerhlags4ohle3runhner3eih3nungeho2l1ei2hot3s2hrei4bah4r3eigh3re2s1h2r1etah3rieslhr2s1achr2s3anhr3schlhr2s1enhr4s1inhr4s1ofh2s1achh4schanhse4lerh2s1erlh2s1ingh2s1parhst3alth2s3tauh3steinh5stellhst3ranh3taktsh4t3alth4t3a2mh4t3assh2t1eimh2t1eish4tentfht3erfoht3erf\xFCh2t1erhh4terklht3erscht3ersth2t1erzh4t1eseh4t1esshte3stah4t3rakht3randh2t3rath4t5rinh2t3rolh2t3rosh4t1r\xF6sht3spriht4stabhts4tieht4st\xFCrh2t1urshu2b3eihu2b1enhu2l3eihu4lenthu2l1inhut4zeni3alenti3alerfi3alerhi3a2leti3a4liai1\xE4t3s4i2b1aufich4speich2t3rieb4stoieb4strie2f1akie2f1anie3g4rai2e2l1aien4erfienge4fien3s2eie3r2erie4rerfi2er5niier4sehier3staier3steies2s3tie2t3hoie4t1\xF64i2f3armift3erkif4t3riift3s2pi2g1angi4gefari3g4neuig3steiig4strei2k1a4ki2k1anoi4kanzei2k1erhi2ker2li2k1etaik4leriik2o3p4ikt3erki2l3a2mi4lentsi2l1erfi2l1ergi2l1erril2f3reilig1a2ili4gabi2l1indil3l2eril4mangil2m3atil2z1arilz3erki2m1armimat5scima4turi2m1erfi2m1erzi2m1infi2m1insindes4ii2n1engin3erbei4nerbiiner4l\xF6ing4sam3inkarninma4leinn4stains3ertin3skanin3stelin4s3umional3aion4spiir2m1eii4s1amtisch3ari3s2chei4schefi4schini2sch1lisch3leisch3obisch3reisch3rui4schwai4schwoisch3wuise3infi4seinti2s1ermi2s1essis4s1aci1s4tati1s4teui1s4tilit3a4reiten3s2iti4kaniti3k2ei2t1in1i2t3ranits1a2git2s1e4its3er1it2s1peit4stafi2v1enei2v1enti2z1enejek4terjektor4je2t1u2jugend3jung3s42k1a2bo2k3a2drka3len_ka4lenskal3eri2k1annakari3es2k1artikau2f1okauf4spke1in2d2k1eiseke4leim2ke2lek2ke3letkel3s2kk3enten2k1ents4kerfahk4erfamk3ergebk3er4h\xF6kerin4tker4kenker4neuker4zeu2k1i2dekie2l3o2ki3l2aki3n4o32k1inse4k1lastkle3ari4k3leit2k1o2fekop4fenkot4tak2k3r\xE4um2k3redekreier4k4s1amtk2s1ersk2s1erwk3stat4k2t3a2rk2t1erhk2t1ingkti4terk4torgakt3oriek2u3n2akuri4erku4schl4l3aben4l1a2bl2l1a2drla2g1oblan2d3rlang3s4l1a2po2la2r1anla2r1eila4rene3l2ar3glar3ini2l1ar3t3lasserla2t3ralat4tanlat2t3rlau2b3rlaub4se2l1aussl\xE4r2m1al2b1edel2b1insld3a2b1ld3a2ckl2d1a2dl2d3a2nld4arm_lecht4ele2g1asleh3r2elein4dulei4\xDFerleit3s22le2lekle2m1o24lendet4lenerg2l1ennilen4sem2l3entwlent4w\xE4le2r3asler3engle4rers3lergehl3ergen2l1ergilerin4s2l1er2\xF63l2erra2l1esellger\xE4u33lichem3licherliebe4slie2s3clik4ter2l1indulingst4lin2k1ali4schu2l1i4solkor2b1ll1a2bel2l1a2mlle4n3all3endul4lentsl4lerfol4lergoll3erntll3ertrl2l1indl2l1o2rll1\xF64sellus5t6l2m3a2blm3einsl2m1e2pl2m1erz2l1o2bllos3t4r2l1\xF64l3l2s1a2dl4s1ambl4schinl4schm\xFCl2s1e2bl2s1ersl2s1erwl2s1impls3ohnel4t3amel2t3atol2t1eislt4stablt4stocltu4ranluf2t1aluf2t1eluf2t5rlung4sclus4s3alus2s1cluss3erlus2s1olus2s1plus2s3tlus4st\xE4lus4t1alust3relut1o2fmach4trma4ges_ma4laktma4l3atma2l3ut2m1analman4ce_man3ers2m1angr4ma3r2oma3s2pa4m1aspemassen3mas4telma1s4trma2ta2b2m1au2fm\xE4u2s1cmbast3emedien3mein4dame1i4so2m1e2miment4spme2r3apme4rensmerin4dmerin4tmerz4en4m1essames2s1omes2s1pme4t3r\xF6mierer4mil4cheminde4sming3s4mi4schami4schnmi4schwmis2s1cmi2s5tem2m1ansmme4linm4mentwmme2ra2mme4recmmi1s4tmo4n1ermor2d3amoster4mpf3erpmpf3errms5trenm2t1erfm4t1ergm2t1erlm2t1ersm2t1ertm4t1etam2t1insmt3s2kamun2d1am\xFCl4lenm\xFCtter3na3chenna2l1a2na4lent4n1a2nana4schw4n1a2synauf4frn4austenbe3r2en3ce2n3n2d1anznde4al_nde4l\xE4nnde4robn2d3ratn4d3runnd4stabnds3taune2e2i22ne2he_2nehen44n3eing4n3eink3ne3l2o4n1endb4n1endd4n1endf4n1endh4n1endk4n1endp4n1endt4n1endwne4nenenen4ge_nen4gen4n1entl4n3entwne2ra2bne3r4alne2r3am4nerbe_4nerben4n5erfonerfor42n3erh\xF62n1erl\xF6ner4mit4n1ernt3n2ers_2n3ersa4n3essine2t1akne2t1annett4scnfi4le_n2g3a2mn2g1andn2g1einnge4ramnge4z\xE4nn2g1i2dn3g2locngs5trinie3l2a3n2ing4ni4schwnitt4san4k3algn2k1insn2k1ortnk2s1aln4n1alln4nentsn2n1unfn2o3ble2n1ob2s2n3o2fenor2d5rno4t3eino2t3inno2t1opn2s1a2dn2s1alln2s1\xE4usn6schefn4schronsen4spn2s1erkn2s1er\xF6n2s1erwn2s1erzn4s1etan2s1inin4sperin4stat_nst3eifn3stemmns4tentnst4er\xF6n4stracn4strien3t2a3cn4tanzan2t1eisn4t1essn2t1inhnton2s1nt3reifnt3riegntu4re_ntu4res1n2ung4n2z1a2gn4zensen4zentwn4zentznz3erwe2o3b4enoben3d4oben3seobe4riso2ch1ecocher4ko3d2e1iof2f1inoge2l1io2h1eiso2h1erto2h1erzoh4lergoh4lerwo3isch_ol2l3auoll1e2col2l1eiol4lerkoma4nero3m2eiso2m1indo2m1into2n1erdon3n2anont3antont3erwon4t3riop4ferdopi3er_o2r3almor2d3amor2d1irord3s2to4rientor2k3aror4mansor4mentor3n2o1oro3n2aor2t1akor4t1anor2t1auort3eigort3erfor2t3evort3insor4trauort3ricor2t1umo4sentsoss3andost1a2bos4t3amost3angos3tarros4ta4soster3eos4t1obost3ranost3roto2\xDF1enzo2\xDF1ereo2\xDF1erfo3t2e1iote2l1aote4leio2t1erwo2t1i2mot4terkoun4ge_our4ne_ozen4ta\xF6chs4tu\xF6gen2s1\xF6l2f1ei\xF62r1e2l\xF63r2erz\xF62r1une\xF62sch3mpa2r3afpar3akt2par2erpar4kampar4kaupe2l1a2pe3li4npe3n2alper2r1a2ph1erspil4zerpingen4pi2z1in3ple5n4po2p3akpo2p3arpor4tinpor4trepor6tripo2s3tepost3eipost3rap2p3a2bppe4lerp4t1entpt3ereip4t1erwp4t1erz2r1acetra4chebra4chinracht3rr3a2d3r3ra1k4l2r3alm_r4alt2hram4manram4m3uram2p3lran4dep4r3aneiran4spara2r1inra4schl2r3asph2r3attarau3e2nrau4man2raus5srbe3r2erchst4rr2d1elbrden4glrder4err2d1innre3alerrech3ar3reigewrei3l2arei3l2irei3necre1in2v2re2lek2r1entl2r1ents4r3entzr4ergen2r1ern\xE44r3erns4r3ernt3r2ers_2r1ersare2s2tu2r3evid2r3e2x1rfi4le_rfolg4srf4s1idrf2s3prr2g1a2drge4ralrge4taprgi4selr2g3ralrg5s2turi2d3anri3ers_ri3estiri2f1eirif4terri4generin4dexrin4diz4rinnta3r4ins_r4inspirin4tegrin4t5rri4schori4schwr3i2talr2k3reark4stecrkt3ersrk2t1o2rl2s3tor2m1aldr2n1anzr4n3eisr4n1enern3enser4n1ergrn4erhir4n1ertrol4lanro4nerbron4tanros2s1crre4aler2s1a2dr4s1amtr2s3angr3sch2er4stantrs4temprs4terbrst3ingrst3ranr2t1almrt3a4rer2t3attrtei3lartei1s4rten3s2rt3ereir4terfar4terfor4t3erhr2t1erkrter4rerte3s2kr2t1imar4t3rakr4treisrt4s1ehr2t1urtru3a2r3ruch3strun2d1arund3er2r1u2ni4r3uniorus2s1pru2t1o2rve4n1er2z1erfr2z1ergr2z1erkr2z1erwrz2t3ror3z2wecsa2cho22s1a2drsa4gentsa3i2k1sa2l1ids3ameri6s1amma2s3a2nasan4dri4s3antr4s3a2sy2s3aufb2s3ausb3s2ausesbe3r2es4ch2al4schanc4schangsch3ei_4schemp4schess4schiru4schle_sch6lit4schre_4schrinsch3rom4schrousch3s2k4schunt4schwetsch4wilsdien4e2s1echo2s1e2ckse2e1i4se2h1a2se4h1eise4herk5s4ein_sein4dusei3n2esein4fos4eins_4seinsp4seinstsel3ers2s1endl4s1entf2s3entg2s1entsser3a2dse2r3als3erbe_s3ereig2s1erfo4serf\xFCl4serken2s3ernt4s3er\xF6f4sersehse4r1ufse3rund4se4tap4s1e2thsi3ach_siege4ssi2g1a2si2k1absik3erlsin3g4lsing3sasi4schuska4te_4skategska4tes4s3klassni3er_sni3ersso4l3eisol4lerson2s1o2s1orga5s2orgeso2r1o24s1o2ve4spensi3s2pi4e4spier43s4prec3sprosssrat4scss1a2cks4s1alas4s1albs4s3amts4s3angs4s3anzs3sa1s2s2s1egasse3infss3ersessquet4s3ta3li4s3tann3staus_st3a2ve4stechn3steilhstei4naste4mar6s5ter_3sterncs4t3ese3s4tett1s2ti2rst1i4sosto3s2t1s4trah4strans3s4tras4straum4s5tr\xE4g4str\xE4ne4s5tref4streibst3renn2s4trig2s5trisst3rollstro4ma4st3run2s4t3s42stum2sstum4sc3s4tunds2t3uni2s3tuns2st3urtsuch4st3s4zene2\xDF1estr\xDFi2g1a2ta2b1anta4bend2t1a2drta2g1eitahl3sk3t2aktuta4lensta2l1optan4gar2t1anme4t1anna3t2ans_4t3ansi4t3anspta4rens3t4a3rita2ta2bta2t3erta2t1um4t3ausg4t3auss4t1auswtbauer4tbe3r2e4teilhet3einget3einlate2l3abte2l1acte2l1autele4bete4l1ecte4l1ehte4leinte4lerd4t3elf_te2l1inte4losttel3s2kte2m1ei3temperte4na2dte4na2g4t3endf4t1endl4t3endpten3d4rten3eidten3ens4tenerg4t1eng_ten4glate4n3in4tensem4t3entw4t3entzte3ran_te2re2bter3endte4rengte4rerkterer4z4terfol4terf\xFCl3ter3g2t6ergru4terkl\xE42t1erl\xF6ter4mert3erneuter4re_ter4sert4erst_t4erstit4erstute4r1ufter4w\xE4h2t3erzbtes3tantest3eitestes4teu3ereteu3eriteu2r3a2t3e2xe2t1e2xi4thrin_4thrinsti4dendti3e4n3tie4recti4gerzti2ma2gtim2m1atin2g1at1in1ittin2k1l3t2ins_4t1inseti4que_ti4schatisch3w3ti3t2etle2r3atmen6t3tmo4desto2d1ertor3inttra3chatra4demtra4far2t3rams3t4ran_tre4ale3t4reib2t3reih4trenditre2t3r2t3rund3t4runkt3s2chat4schart3sch2et4schefts4chemtsch4lit4schrot2s1e2bt4seindt2s1engt2s1entt2s1i2dts4paret3s2pont3s2port4spreits3t\xE4tit2s3tepts3tradt4strants3traut2s3tr\xE4t4streut4stropt2s3tr\xFCtte4lebtte4lent3u2fertums5trtung4s5tu2r1ertu4schlt2z1e2ct2z1eiet2z1eistz3entsubal3l2ubi3os_u2b3rituch4spruch4toruch2t3ru4ckentu3ck2eruden3s2ue3reigue4rergue4rerku4erinnuer4neru3erunfu3eruntu2f1\xE42\xDFu2f1erhu4ferleufs3temuf2t1ebu4gabteu2g1erfu2g1erlugge4stu2g3r\xFCsu3isch_u3ischsuk2t1inulm3einu2m3a2ku2m1artu2m1ausument4su2m1ergu2m1erlu2m1erwumpf4lium2p3leum2s1peun2d1umun2k1a2unk4titunk2t3run2n3aduns4t1runte4riunvoll3up4t3a2upt3ergu2r3a2mu2r1anau2r1angurgros4ur3s2zeu2s1eseusi3er_us3partu2s1pasu3s2peku5s4pizust3abeu5strasus6trisute4leiuter4eruto4berut4schlut4schmut4sch\xF6utz3engut2z1in\xFCch2s1c\xFCck3eri\xFC4ckers\xFCck4spe\xFC3d2ens\xFC2f1erg\xFC2h1eng\xFC2h1erk\xFC2h1erz\xFChr3ei_\xFCl2l1ei\xFCn2f1ei\xFC2r1ent\xFCste3neva2t3a4va4t1inve4l1auvenen4dve3rand2ve3s2evid3s2tvie2h3avie4recvi2l1invollen4vormen4waffel3wah4lerwalt4stwar3stewa4schaw\xE43schewe3cke_we3ckeswei3strwer4gelwe4r3iowest3eiwest1o2wim4m3uwolf4s3wol4lerwor2t3rxi2d1emx2t1e2dxtra3b4x2t3rany2l3a2myl4antezei2t1aze2l1a2ze2l1erze2l1inzel3t2hze4n3aczen4semzen4zerze2re2b2z1erg\xE4z3erhalzerin4tzer4neb2z1ersazert1a2zert4anzer4tin4zerwei3z2erzazessen4zger4s1zin4ser4zinsufzon4terz3t2herzu2g1arzu4gentzwan2d1`, 8: `_al1e2r1_al5l4en_anden6k_ar4m3ac_ar4t3ei_ber6gab_ber4g3r_de3r4en_einen6g_en4d3er_en5der__er4zen4_ka4t3io_lo4g3in_mode6ra_ost5end_oste6re_par3t4h_richt6e_sucher6_tan4k3la2ch1e2ca4ch3erwacht5ergach6tritack3sta43a2er2o1af4t3erlage4s3tiah4l3erhal4b3erw3a2l1e2bal2l3a4rall5erfaalli5er_al4t3erfam4t3ernand6spas3a4n1erban4g3erfan4g3erlan4g3erzang4s3poani5ers_an2t3a4ran2z1i4nar4t3ramau5ereinau4s3erwauster6mau4ten4gau4t3erh\xE4s4s3erkbach7t4ebal4l3ehbe4r3eiwber6gan_ber3st4abe6steinbe4s3tolbote3n4ebst5einbbu4s3chach3e4ben6chergebcher6zie6ckergeb4d3achse2d1an3d22d1e4ben3d2e1i2mde2l1a2gde4l3augdel5sterde4n3endden4k3li4den4semde4r3eisde3r4erbde3r4erfde4r3ero4d3erh\xF6h4d3ersatdest5altdest5ratdienst5r2d1in1it4d3innerdi4t3erldi4t3ermdi4t3ersd4s3t\xE4tid3s4tern2d1u2m1edu4sch3le3a4reneech3t4eiege4n3a2eg4se4r1ehr6erleei4b3uteei4d3errei2m1a2gein6karnein6stalei6schwuei4s3erwek4t3erzeld5erstel4d3erwe4ler4fae4ler4lae4l3ern\xE4e4l3e4taelgi5er_elgi5ersel4l3einemen4t3he6mentspen4d3esse4n3ermoeni5ers_en5sch4eenst5alten4s3t\xE4ten4t3rolen4z3erfen4z3ergen4z3erke2r3a4sie4r3eis_e4r3entferi3e4n3er6tereier4t3erfess4e3rees4t3enges4t3erhes4t3essestmo6deet4z3enteue6reifeut6schnfacher5ffal6schafal6schmfe4r3anzfrach6trf4s3t\xE4tif4s3tresf4s3t\xFCtef4t1e4tift4s3tanfzeiten6gas4t3el2g1eise2gel4b3ragel4b3rogel6dersge4l3ers4g3ereigge4ren4sge4r3entge4s3terglei4t5rgrammen6gros6selg3s4tatigs4t3rosgu4t3erhhaft4s3phal6lerfhau3f4lihau5steihau6terkhe4f3inghel4l3auhe2n1e2bhe4r3eishe4r3o4bhfel6lerhich6terho6ckerlhol6zeneh6rerlebh3s4terbh3t4akt_h4teil4zh4t3elith4t3entsht5erkenh6terneuh4t3erreh6terstaht6ersteht6raumeht4s3turhu4l3enghut4z3eria4l3ermie4n3a2gie4n3ergienst5r\xE4ie4r3erziesen3s4ie4t3erhie4t3ertiker6fahi3l4aufbim4m3enti2n1e2bei4ner4trin2g1a2gin4n3ermin4s3t\xE4tir4m3untir4sch3wi4sch3eii5schingi6schwiri4s3etatiso6nendis4s3cheit4z3ergjah4r3eika4n1a4s6kantennkehr4s3o4ken4gagken5steiker6gebnkerin6stk3er4lauk3er4lebk6erlebe2k1er2zikeu6schlkor6dergkre1i2e4k4s3tanzk4t3erfolan2d3a22lat2t1alat4t3inl2d1e2seleben4s3lei6nerble4n3end5lentwet4l3ereigle4r3eim3l4ergew6lerwerbli4g3ers2l1in1itl6lergebl6lergen2l1or3g2l4s3ort_l4s3t\xE4tils6ternels6ternsl4te4leml4t1e4skl2t1o2rilu2g1e2blus6serflus6serklus6serslu4t3ergl2z1u4femagi5er_magi5ersmar6schmmar6schrma4t3erdmen6tanz4m3entwi4m3erg\xE4nmes6sergmp4f3ergmp4f3erz4m3ungebmu4r1u2fnacht6ra4n3a2mernavi5er_navi5ersn4d3entsnder5stene2n1e2bn4g3erseng4s3e4h2n3i2gelni4k3ingn4k3erfanseh5eren4s3ort_n4s3prien4s3tatens6terbenst5opfenten6te_nt4s3parober3in4ode6rat_ode6rateoh4l3erholl5endsoll5erweol4z3ernonderer5on4t3endopf5erdeopi5ers_or4d3engo2r1e2ckorsch5lior4t3entor4t3ereor4t3offor4t3r\xE4uos4s3enzo2\xDF1en2k\xF64sch3eipargel6dp\xE44t1e2hp\xE44t3entpe4l3inkp2f1in3spos4t3agrach6tr\xE4rali5er_rali5ersran4d3errau4m3agr\xE4u5scher2b1a2der4b3lastrch6terwrderin6sr4d3erntrege4l3\xE4re4h3entreister6re4n3end4r3erken4r3erlaurge4l3errgen4z3w4r3innerrkstati6rk4t3engrk4t3erfrk6terscrk4t3erwr2m1o2rirn3e4benrol3l4enrpe4r3inr6scherlr4s3ort_r6strangr4t3erler4t3ern\xE4ru6ckerlrun6derlrun6dersrun6derwr4z3entssa4l3erbsat4z3en6schlein2s1e2bense4l3erl4s1e2pos6sereignse4r3eimse4r3enk2s1i2deoson5ende2s1o2riesr\xFCcker6sse3in4tstel4l3\xE4s4t3endss4t3engls4t3entfste6rersstes6se_5st4reif1s4tri2ksun6derhtan6zerhta4r3eretau3f4litau6schrtau6schwtblock5e4t1e2bentein3e4cte2m1o2rte2n1e2bte3n4ei_ten4t3riten6zerh4t3erde_te4r3eif6tergreiter4n3art6erscha6terwerbtes6terkti4v3erlto6ckenttr\xFCcker6t4s1amt4t4s3esset3s4terotta6gess2t1u2niotu2r1a2gtu2r1e4tu2ch1e4cu3erin4tuern3s4tu4g3reisun4d3erfund5erhau2r1an5sur3a4renu6schentusch5werusi5ers_u4t3ersa\xFCge6leiswach6stuwach4t4rwahl5entwandels6we5cken_wein4s3aweis4s3pwel6schlwel6schrwel4t3a2wen4k3ri5werdensxpor6terx2t1er2fx2t1il2l2z1e2benzeit5endzei4t3er4z3ergebzer4n3ei4z3erstezer4t3agzer6terezer6trau`, 9: `_char8me__er8stein_he6r5inn_men8schl_men8schw_os5t6alg_r\xFC6cker6_wort5en6_wor8tendach8traumalli7ers_allkon8tral5s6terbausan8ne_\xE4h4l3e4be6b5rechtebs3e4r3inchner8ei_dampf8erfden6s5taue6ch5erziee4r3en4ge6l5eier_erg3el4s3fal6l5erk6fel6ternfor4m3a4gforni7er_fzei8tendgot6t5erggrab8schegren6z5eih\xE46s5chenhe6rin6nuherin8terh6l3er4n\xE4h6t5erspaieler8gebi2k1e2r2eil4d3en4ti4sch3e4hkamp8ferfke6rin6nulan6d5erwlan6d5erzleis6s5erlepositi86mel6ternmorgen5s65n2en3t2aner8schlenich8tersn4n3er4wano6t5entrnsch7werdn5s6ternen5s6ternsos4s3en4kpapieren8ram6m5ersr8blasserres6s5erw6r5innenmris6t5ersr6st5eingrs4t3er4wr4t3er4lasfal6l5erspani7er_sse6r5atts4s3e4strsu6m5ents4t3a4genttblocken8tes6ter6g\xFCr4g3en4gvati8ons_vol6l5endwer6t5ermwin4d3e4czes6s5end`, 10: `_er8brecht_os8ten8deder6t5en6deren8z7endgram8m7endhrei6b5e6cos6t5er6werein8s7trewel6t5en6dwin8n7ersczge8rin8nu`, 11: `_er8stritt__spiege8leiach8tr\xE4ume_lei8t7er8scpapie8r7endpiegelei8en`, 12: `ach8tr\xE4umen_7sprechende_`, 13: `_er8stritten_` }, charSubstitution: { \u017F: `s` } };
}));
var tre = u($ne(), 1);
var nre = u(ere(), 1);
var rre = `Silbentrennung (Silben rot und blau):
Hypher 0.2.5 - Copyright (c) 2011, Bram Stein. All rights reserved. Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met: 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. 3. The name of the author may not be used to endorse or promote products derived from this software without specific prior written permission. THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

German hyphenation patterns dehyphn-x-2011-06-01 (hyph-de-1996, reformed orthography) - Copyright (C) 2007, 2008, 2009, 2011 Werner Lemberg <wl@gnu.org>. Distributed under the LaTeX Project Public License (LPPL) 1.3c, https://www.latex-project.org/lppl/ (the patterns allow "version 1 of the License, or any later version"). Changes: converted to the Hypher pattern format by Bram Stein (npm package hyphenation.de 0.2.1) and used in that form; this program sets its own minimum syllable lengths and post-processes the result for reading (Sprechsilben). The authors of the patterns are not responsible for this program. Unmodified original: https://github.com/hyphenation/tex-hyphen (commit a9435ac, hyph-utf8/tex/generic/hyph-utf8/patterns/tex/hyph-de-1996.tex) and CTAN (hyph-utf8).`;
var are = { beispiel: [`bei`, `spiel`], beispiele: [`bei`, `spie`, `le`], astronaut: [`as`, `tro`, `naut`], astronauten: [`as`, `tro`, `nau`, `ten`] };
var ore = [[`warum`, `wa rum`], [`darum`, `da rum`], [`worum`, `wo rum`], [`herum`, `he rum`], [`heran`, `he ran`], [`herauf`, `he rauf`], [`heraus`, `he raus`], [`herein`, `he rein`], [`herab`, `he rab`], [`her\xFCber`, `he r\xFC ber`], [`herunter`, `he run ter`], [`hinauf`, `hi nauf`], [`hinaus`, `hi naus`], [`hinein`, `hi nein`], [`hinab`, `hi nab`], [`hin\xFCber`, `hi n\xFC ber`], [`hinunter`, `hi nun ter`], [`daran`, `da ran`], [`darauf`, `da rauf`], [`daraus`, `da raus`], [`darin`, `da rin`], [`dar\xFCber`, `da r\xFC ber`], [`darunter`, `da run ter`], [`woran`, `wo ran`], [`worauf`, `wo rauf`], [`woraus`, `wo raus`], [`worin`, `wo rin`], [`wor\xFCber`, `wo r\xFC ber`], [`worunter`, `wo run ter`], [`voran`, `vo ran`], [`voraus`, `vo raus`], [`vor\xFCber`, `vo r\xFC ber`], [`hieran`, `hie ran`], [`hierauf`, `hie rauf`], [`hieraus`, `hie raus`], [`hierin`, `hie rin`], [`hier\xFCber`, `hie r\xFC ber`]].map(([e17, t10]) => [e17, t10.split(` `)]).sort((e17, t10) => t10[0].length - e17[0].length);
var qh = [`ei`, `nan`, `der`];
function Jh(e17, t10) {
  let n10 = [], r10 = 0;
  for (let i10 of t10) n10.push(e17.slice(r10, r10 + i10.length)), r10 += i10.length;
  return n10;
}
var Yh = null;
var Xh = false;
function sre() {
  if (!Yh && !Xh) try {
    Yh = new tre.default({ ...nre.default, leftmin: 1, rightmin: 2 }), Object.defineProperty(Yh, "licence", { value: rre });
  } catch {
    Xh = true;
  }
  return Yh;
}
var Zh = /^[aeiouyäöü]/i;
function cre(e17) {
  return e17.match(/[^aeiouyäöü]*[aeiouyäöü]+(?:[^aeiouyäöü]*$|[^aeiouyäöü](?=[^aeiouyäöü]))?/gi) ?? [e17];
}
var lre = /(?:ea|eo|ia|io|iu|oa|ao|ua|uo|ui)/i;
function ure(e17) {
  let t10 = [], n10 = e17;
  for (let e18 = 0; e18 < 8; e18++) {
    let e19 = n10.slice(1).match(lre);
    if (!e19 || e19.index === void 0) break;
    let r10 = e19.index + 1;
    if (/q/i.test(n10[r10 - 1] ?? ``) || /^eau/i.test(n10.slice(r10))) break;
    t10.push(n10.slice(0, r10 + 1)), n10 = n10.slice(r10 + 1);
  }
  return t10.push(n10), t10.filter(Boolean);
}
function Qh(e17) {
  let t10 = [];
  for (let n10 of e17) !/[aeiouyäöü]/i.test(n10) && t10.length ? t10[t10.length - 1] += n10 : t10.push(n10);
  return t10.length > 1 && !/[aeiouyäöü]/i.test(t10[0]) && t10.splice(0, 2, t10[0] + t10[1]), t10;
}
function dre(e17) {
  let t10 = Qh(e17);
  if (!t10.length) return t10;
  let n10 = [];
  for (let e18 of t10) for (let t11 of ure(e18)) {
    let e19 = t11, r11;
    for (; r11 = e19.match(/^(.*?(?:ei|au|eu|ai|äu))([aeiouäöü].*)$/i); ) n10.push(r11[1]), e19 = r11[2];
    e19 && n10.push(e19);
  }
  let r10 = [];
  if (n10.forEach((e18, t11) => {
    let n11 = r10[r10.length - 1];
    (t11 === 0 || /[aeiouyäöü]$/i.test(n11 ?? ``) || Zh.test(e18)) && /^[aeiouäöü](?:sch|ch|ck|ph|qu|[bcdfghjklmnprstvwxzß])[aeiouyäöü]/i.test(e18) ? r10.push(e18.slice(0, 1), e18.slice(1)) : r10.push(e18);
  }), n10.splice(0, n10.length, ...r10), n10.length <= 1) return n10;
  let i10 = [...n10];
  for (let e18 = 0; e18 < i10.length - 1; e18++) {
    let t11 = i10[e18], n11 = i10[e18 + 1];
    if (!t11 || !n11) continue;
    let r11 = t11.toLowerCase(), a10 = n11.toLowerCase(), o10 = (r12) => {
      i10[e18] = t11.slice(0, -r12), i10[e18 + 1] = t11.slice(-r12) + n11;
    }, s10 = (r12) => {
      i10[e18] = t11 + n11.slice(0, r12), i10[e18 + 1] = n11.slice(r12);
    };
    a10.startsWith(`st`) ? s10(1) : r11.endsWith(`st`) ? o10(1) : r11.endsWith(`c`) && a10.startsWith(`k`) ? a10.length > 1 && Zh.test(a10.slice(1)) ? o10(1) : s10(1) : r11.endsWith(`ck`) && Zh.test(a10) ? o10(2) : r11.endsWith(`c`) && a10.startsWith(`h`) ? a10.length > 1 && Zh.test(a10.slice(1)) ? o10(1) : s10(1) : r11.endsWith(`ch`) && Zh.test(a10) ? o10(2) : r11.endsWith(`s`) && a10.startsWith(`ch`) ? a10.startsWith(`chen`) || o10(1) : r11.endsWith(`sch`) && Zh.test(a10) ? o10(3) : r11.endsWith(`p`) && a10.startsWith(`h`) || r11.endsWith(`q`) && a10.startsWith(`u`) || r11.endsWith(`t`) && a10.startsWith(`h`) ? o10(1) : a10.startsWith(`fn`) ? s10(1) : r11.endsWith(`\xDF`) && Zh.test(a10) && o10(1);
  }
  return Qh(i10.filter((e18) => e18.length > 0));
}
var $h = /* @__PURE__ */ new Map();
function eg(e17) {
  if (!e17) return [];
  let t10 = $h.get(e17);
  if (t10) return t10;
  let n10, r10 = e17.toLowerCase(), i10 = are[r10], a10 = ore.find(([e18]) => r10.startsWith(e18));
  if (i10) n10 = Jh(e17, i10);
  else if (a10) {
    let t11 = Jh(e17, a10[1]), r11 = e17.slice(a10[0].length);
    n10 = [...t11, ...r11 ? eg(r11) : []];
  } else if (r10.endsWith(`einander`) && r10.length > 8) n10 = [...eg(e17.slice(0, -8)), ...Jh(e17.slice(-8), qh)];
  else if (r10 === `einander`) n10 = Jh(e17, qh);
  else {
    let t11 = sre();
    n10 = dre(t11 ? t11.hyphenate(e17) : cre(e17));
  }
  return n10.join(``) !== e17 && (n10 = [e17]), $h.size > 5e3 && $h.clear(), $h.set(e17, n10), n10;
}
var fre = /[A-Za-zÄÖÜäöüßÀ-ɏ]+/g;
function tg(e17) {
  let t10 = [], n10 = 0;
  for (let r10 of e17.matchAll(fre)) {
    let i10 = r10.index ?? 0;
    i10 > n10 && t10.push({ text: e17.slice(n10, i10) }), eg(r10[0]).forEach((e18, n11) => t10.push({ text: e18, color: n11 % 2 })), n10 = i10 + r10[0].length;
  }
  return n10 < e17.length && t10.push({ text: e17.slice(n10) }), t10;
}
var Zg = [`stage`, `campfire`, `songbook`, `meadow`, `sea`, `chalk`, `neon`, `winter`];
var Qg = [`#2563eb`, `#dc2626`];
var $g = [`#93c5fd`, `#fca5a5`];
function e_(e17) {
  let t10 = e17;
  return () => (t10 = t10 * 16807 % 2147483647, (t10 - 1) / 2147483646);
}
function t_(e17, t10, n10, r10 = `#fff`) {
  let i10 = e_(t10), a10 = ``;
  for (let t11 = 0; t11 < e17; t11++) {
    let e18 = Math.round(i10() * 1400), t12 = Math.round(i10() * n10), o10 = (0.8 + i10() * 2.2).toFixed(1);
    a10 += `<circle cx="${e18}" cy="${t12}" r="${o10}" fill="${r10}" opacity="${(0.35 + i10() * 0.6).toFixed(2)}"/>`;
  }
  return a10;
}
var n_ = (e17, t10, n10, r10, i10 = 1) => `<g transform="translate(${e17} ${t10}) scale(${n10})" fill="${r10}" opacity="${i10}"><ellipse cx="0" cy="0" rx="9" ry="7" transform="rotate(-20)"/><rect x="6.5" y="-38" width="3" height="38"/><path d="M9.5 -38c8 6 14 10 12 22c-2-8-6-11-12-12z"/></g>`;
function Lre() {
  let e17 = (e18, t10, n10) => Array.from({ length: 5 }, (r10, i10) => {
    let a10 = e18 + i10 * t10 * n10 / 5;
    return `<path d="M${a10} 0 Q${a10 + n10 * 12} 495 ${a10} 990" stroke="#450a0a" stroke-width="5" fill="none" opacity=".45"/>`;
  }).join(``);
  return `<defs><linearGradient id="kst" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1035"/><stop offset="1" stop-color="#0a0814"/></linearGradient><radialGradient id="ksp" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#fff7d6" stop-opacity=".22"/><stop offset="1" stop-color="#fff7d6" stop-opacity="0"/></radialGradient><linearGradient id="kcu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7f1d1d"/><stop offset=".5" stop-color="#b91c1c"/><stop offset="1" stop-color="#7f1d1d"/></linearGradient><linearGradient id="kfl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c4a21"/><stop offset="1" stop-color="#4a2a10"/></linearGradient></defs><rect width="1400" height="990" fill="url(#kst)"/><path d="M380 0 L120 960 L760 960 L520 0Z" fill="url(#ksp)"/><path d="M880 0 L620 960 L1260 960 L1020 0Z" fill="url(#ksp)"/><rect x="0" y="930" width="1400" height="60" fill="url(#kfl)"/>` + Array.from({ length: 12 }, (e18, t10) => `<path d="M${t10 * 120} 930 L${t10 * 120 - 30} 990" stroke="#3b2208" stroke-width="2" opacity=".6"/>`).join(``) + `<path d="M0 0H64C58 330 46 660 30 990H0Z" fill="url(#kcu)"/>${e17(6, 50, 1)}<path d="M1400 0H1336C1342 330 1354 660 1370 990H1400Z" fill="url(#kcu)"/>${e17(1394, 50, -1)}<path d="M0 0H1400V26` + Array.from({ length: 14 }, (e18, t10) => `Q${1400 - t10 * 100 - 50} 52 ${1400 - (t10 + 1) * 100} 26`).join(``) + `Z" fill="#991b1b"/><path d="M0 26` + Array.from({ length: 14 }, (e18, t10) => `Q${t10 * 100 + 50} 52 ${(t10 + 1) * 100} 26`).join(``) + `" fill="none" stroke="#fbbf24" stroke-width="4"/>`;
}
function Rre() {
  return `<defs><linearGradient id="kcs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1a36"/><stop offset=".65" stop-color="#25204d"/><stop offset="1" stop-color="#4b2a4a"/></linearGradient><radialGradient id="kcg" cx=".5" cy="1" r=".75"><stop offset="0" stop-color="#fb923c" stop-opacity=".45"/><stop offset="1" stop-color="#fb923c" stop-opacity="0"/></radialGradient></defs><rect width="1400" height="990" fill="url(#kcs)"/>${t_(140, 7, 700)}<circle cx="1130" cy="92" r="44" fill="#fef3c7"/><circle cx="1150" cy="80" r="40" fill="#1a2148" opacity=".9"/><rect x="0" y="560" width="1400" height="430" fill="url(#kcg)"/><path d="M0 990V900Q200 860 420 905T860 900T1400 890V990Z" fill="#0a1022"/><path d="M0 990V760L40 640L80 770L110 600L160 780L190 700L220 990Z" fill="#081022"/><path d="M1180 990L1210 690L1250 800L1290 620L1330 790L1370 700L1400 760V990Z" fill="#081022"/>`;
}
function zre() {
  let e17 = ``;
  for (let t10 = 0; t10 < 5; t10++) e17 += `<path d="M40 ${966 + t10 * 4}H1360" stroke="#cdb88f" stroke-width="1.4"/>`;
  return `<rect width="1400" height="990" fill="#fbf6e9"/><rect x="14" y="14" width="1372" height="962" rx="18" fill="none" stroke="#d9c49b" stroke-width="3"/><rect x="24" y="24" width="1352" height="942" rx="12" fill="none" stroke="#e8d9b8" stroke-width="1.5"/>` + e17 + n_(1150, 110, 1.1, `#b08d57`, 0.45) + n_(1195, 98, 0.9, `#b08d57`, 0.4) + n_(1240, 970, 1, `#b08d57`, 0.45) + n_(90, 975, 0.9, `#b08d57`, 0.45);
}
function Bre() {
  let e17 = e_(11), t10 = ``, n10 = [`#f472b6`, `#facc15`, `#fb7185`, `#a78bfa`, `#ffffff`, `#f97316`];
  for (let r11 = 0; r11 < 46; r11++) {
    let i10 = Math.round(e17() * 1400), a10 = Math.round(948 + e17() * 36), o10 = n10[r11 % n10.length];
    t10 += `<g transform="translate(${i10} ${a10})"><path d="M0 0V-14" stroke="#3f8f3a" stroke-width="2"/><circle cx="0" cy="-16" r="6" fill="${o10}"/><circle cx="0" cy="-16" r="2.4" fill="#facc15"/></g>`;
  }
  let r10 = (e18, t11, n11) => `<g transform="translate(${e18} ${t11}) scale(${n11})" fill="#fff" opacity=".9"><ellipse cx="0" cy="0" rx="60" ry="26"/><ellipse cx="-34" cy="8" rx="40" ry="20"/><ellipse cx="38" cy="10" rx="44" ry="20"/><ellipse cx="6" cy="-18" rx="34" ry="24"/></g>`;
  return `<defs><linearGradient id="kms" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a5d8ff"/><stop offset="1" stop-color="#eaf6ff"/></linearGradient></defs><rect width="1400" height="990" fill="url(#kms)"/><circle cx="1110" cy="70" r="56" fill="#ffe066"/><circle cx="1110" cy="70" r="76" fill="#ffe066" opacity=".25"/>` + r10(260, 120, 0.8) + r10(820, 70, 0.6) + `<path d="M0 990V930Q300 900 640 928T1400 918V990Z" fill="#8bd17c"/><path d="M0 990V958Q420 936 900 958T1400 950V990Z" fill="#69b85b"/>` + t10;
}
function Vre() {
  let e17 = (e18, t10, n10, r10 = 1) => {
    let i10 = `M0 ${e18}`;
    for (let e19 = 0; e19 < 1400; e19 += 100) i10 += ` q25 ${-n10} 50 0 t50 0`;
    return `<path d="${i10} V990 H0Z" fill="${t10}" opacity="${r10}"/>`;
  };
  return `<defs><linearGradient id="kss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bae6fd"/><stop offset="1" stop-color="#f0f9ff"/></linearGradient></defs><rect width="1400" height="990" fill="url(#kss)"/><path d="M300 60q12 -12 24 0q12 -12 24 0M370 96q9 -9 18 0q9 -9 18 0M980 120q10 -10 20 0q10 -10 20 0" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round"/><g transform="translate(110 846)"><path d="M0 40h120l-18 26H18z" fill="#92400e"/><path d="M60 40V-40" stroke="#78350f" stroke-width="4"/><path d="M64 -36L116 32H64z" fill="#fff"/><path d="M56 -26L14 32H56z" fill="#fde68a"/></g>` + e17(920, `#38bdf8`, 14, 0.85) + e17(946, `#0ea5e9`, 12) + e17(968, `#0369a1`, 10);
}
function Hre() {
  let e17 = e_(23), t10 = ``;
  for (let n10 = 0; n10 < 18; n10++) t10 += `<ellipse cx="${Math.round(e17() * 1400)}" cy="${Math.round(e17() * 990)}" rx="${Math.round(60 + e17() * 160)}" ry="${Math.round(20 + e17() * 50)}" fill="#fff" opacity="${(0.02 + e17() * 0.035).toFixed(3)}"/>`;
  return `<rect width="1400" height="990" fill="#8b5a2b"/><rect x="6" y="6" width="1388" height="978" fill="#6f4520" opacity=".5"/><rect x="20" y="20" width="1360" height="950" rx="6" fill="#244a3f"/>${t10}<rect x="20" y="20" width="1360" height="950" rx="6" fill="none" stroke="#18332b" stroke-width="4"/><rect x="520" y="962" width="90" height="10" rx="4" fill="#f8fafc" opacity=".85"/><rect x="640" y="962" width="60" height="10" rx="4" fill="#fde68a" opacity=".85"/>` + n_(1150, 130, 1, `#f8fafc`, 0.2) + n_(1210, 112, 0.8, `#f8fafc`, 0.18);
}
function Ure() {
  return `<defs><linearGradient id="kns" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12002b"/><stop offset="1" stop-color="#22063f"/></linearGradient><filter id="kng" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter></defs><rect width="1400" height="990" fill="url(#kns)"/>${t_(60, 3, 990, `#c4b5fd`)}<rect x="26" y="26" width="1348" height="938" rx="34" fill="none" stroke="#f0abfc" stroke-width="10" filter="url(#kng)" opacity=".8"/><rect x="26" y="26" width="1348" height="938" rx="34" fill="none" stroke="#fdf4ff" stroke-width="3"/><path d="M60 975H1340" stroke="#22d3ee" stroke-width="8" filter="url(#kng)" opacity=".7"/><path d="M60 975H1340" stroke="#cffafe" stroke-width="2"/>` + n_(1140, 130, 1.1, `#22d3ee`, 0.55) + n_(1205, 110, 0.85, `#f0abfc`, 0.55);
}
function Wre() {
  let e17 = e_(31), t10 = ``;
  for (let n11 = 0; n11 < 70; n11++) {
    let n12 = Math.round(e17() * 1400), r11 = Math.round(e17() * 900), i11 = 1.5 + e17() * 3.5;
    t10 += `<circle cx="${n12}" cy="${r11}" r="${i11.toFixed(1)}" fill="#fff" opacity="${(0.35 + e17() * 0.5).toFixed(2)}"/>`;
  }
  let n10 = (e18, t11, n11, r11) => `<g transform="translate(${e18} ${t11}) scale(${n11})" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity="${r11}" fill="none">` + [0, 60, 120].map((e19) => `<path d="M0 -14V14M-5 -10L0 -6L5 -10M-5 10L0 6L5 10" transform="rotate(${e19})"/>`).join(``) + `</g>`, r10 = (e18, t11, n11) => {
    let r11 = n11 * 0.62, i11 = `<rect x="${e18 - n11 * 0.05}" y="${t11 - n11 * 0.12}" width="${n11 * 0.1}" height="${n11 * 0.12}" fill="#3f2a1d"/>`;
    for (let a11 = 0; a11 < 3; a11++) {
      let o10 = t11 - n11 + a11 * n11 * 0.26, s10 = r11 * (0.55 + a11 * 0.22), c10 = o10 + n11 * 0.42;
      i11 += `<path d="M${e18} ${o10}L${e18 + s10 / 2} ${c10}H${e18 - s10 / 2}Z" fill="#14532d"/><path d="M${e18} ${o10}L${e18 + s10 * 0.16} ${o10 + n11 * 0.13}Q${e18} ${o10 + n11 * 0.17} ${e18 - s10 * 0.16} ${o10 + n11 * 0.13}Z" fill="#f8fafc"/>`;
    }
    return i11;
  }, i10 = `<path d="M0 12Q175 40 350 12T700 12T1050 12T1400 12" fill="none" stroke="#1e293b" stroke-width="2.5"/>`, a10 = [`#f87171`, `#fbbf24`, `#4ade80`, `#60a5fa`, `#f472b6`];
  for (let e18 = 0; e18 < 28; e18++) {
    let t11 = 25 + e18 * 50, n11 = t11 % 350 / 350 * Math.PI, r11 = 12 + Math.sin(n11) * 14 + 5, o10 = a10[e18 % a10.length];
    i10 += `<circle cx="${t11}" cy="${r11.toFixed(1)}" r="11" fill="${o10}" opacity=".28"/><ellipse cx="${t11}" cy="${r11.toFixed(1)}" rx="4.5" ry="6.5" fill="${o10}"/>`;
  }
  return `<defs><linearGradient id="kws" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1d3f"/><stop offset=".7" stop-color="#1d3b72"/><stop offset="1" stop-color="#3b5b98"/></linearGradient><radialGradient id="kwg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fde68a" stop-opacity=".55"/><stop offset="1" stop-color="#fde68a" stop-opacity="0"/></radialGradient></defs><rect width="1400" height="990" fill="url(#kws)"/>${t_(70, 17, 600)}<circle cx="1130" cy="110" r="70" fill="url(#kwg)"/><path d="M1130 74L1139 101L1167 101L1144 117L1153 144L1130 128L1107 144L1116 117L1093 101L1121 101Z" fill="#fde68a"/>` + t10 + n10(300, 210, 1.3, 0.35) + n10(820, 150, 1.1, 0.3) + n10(620, 330, 0.9, 0.25) + `<path d="M0 990V905Q260 870 560 900T1100 892T1400 880V990Z" fill="#e2e8f0"/><path d="M0 990V940Q380 915 760 938T1400 930V990Z" fill="#f8fafc"/>` + r10(28, 930, 170) + r10(92, 948, 110) + r10(1350, 925, 220) + i10;
}
var r_ = { stage: { id: `stage`, label: `B\xFChne`, dark: true, text: `#fffbeb`, title: `#fde68a`, accent: `#fbbf24`, soft: `#e9d5b5`, plateTitle: `#991b1b`, panel: `rgba(20,10,35,.72)`, btn: `#2a1b40`, btnText: `#fef3c7`, btnLine: `#5b4378`, play: `#f59e0b`, playText: `#1c1306`, rail: `rgba(255,255,255,.18)`, card: `#fffbeb`, cardText: `#3b2508`, syl: $g, bg: Lre(), bottom: 920, swatch: `#1e1035` }, campfire: { id: `campfire`, label: `Lagerfeuer`, dark: true, text: `#fff7ed`, title: `#fdba74`, accent: `#fb923c`, soft: `#d6c3e0`, plateTitle: `#9a3412`, panel: `rgba(8,16,34,.66)`, btn: `#1c2448`, btnText: `#ffedd5`, btnLine: `#3b4680`, play: `#f97316`, playText: `#1f0d02`, rail: `rgba(255,255,255,.18)`, card: `#fff7ed`, cardText: `#431407`, syl: $g, bg: Rre(), bottom: 885, swatch: `#25204d` }, songbook: { id: `songbook`, label: `Liederbuch`, dark: false, text: `#2b2118`, title: `#7c4a1e`, accent: `#b45309`, soft: `#8a7556`, plateTitle: `#7c4a1e`, panel: `rgba(240,229,205,.85)`, btn: `#fffaf0`, btnText: `#5b3b17`, btnLine: `#d9c49b`, play: `#b45309`, playText: `#fffaf0`, rail: `rgba(124,74,30,.16)`, card: `#fffdf7`, cardText: `#3a2a16`, syl: Qg, bg: zre(), bottom: 950, swatch: `#fbf6e9` }, meadow: { id: `meadow`, label: `Fr\xFChlingswiese`, dark: false, text: `#1f2937`, title: `#166534`, accent: `#16a34a`, soft: `#3f6212`, plateTitle: `#166534`, panel: `rgba(255,255,255,.7)`, btn: `#ffffff`, btnText: `#14532d`, btnLine: `#bbf7d0`, play: `#16a34a`, playText: `#ffffff`, rail: `rgba(22,101,52,.15)`, card: `#ffffff`, cardText: `#1f2937`, syl: Qg, bg: Bre(), bottom: 910, swatch: `#a5d8ff` }, sea: { id: `sea`, label: `Meer`, dark: false, text: `#0c2a43`, title: `#075985`, accent: `#0284c7`, soft: `#335a78`, plateTitle: `#075985`, panel: `rgba(255,255,255,.68)`, btn: `#ffffff`, btnText: `#0c4a6e`, btnLine: `#bae6fd`, play: `#0284c7`, playText: `#ffffff`, rail: `rgba(3,105,161,.16)`, card: `#ffffff`, cardText: `#0c2a43`, syl: Qg, bg: Vre(), bottom: 895, swatch: `#bae6fd` }, chalk: { id: `chalk`, label: `Kreidetafel`, dark: true, text: `#f8fafc`, title: `#fde68a`, accent: `#fde68a`, soft: `#cfe3da`, plateTitle: `#1d3a31`, panel: `rgba(16,40,33,.6)`, btn: `#2f5a4d`, btnText: `#f8fafc`, btnLine: `#4d7a6b`, play: `#fde68a`, playText: `#1d3a31`, rail: `rgba(255,255,255,.2)`, card: `#f8fafc`, cardText: `#1d3a31`, syl: $g, bg: Hre(), bottom: 950, swatch: `#244a3f` }, neon: { id: `neon`, label: `Neon`, dark: true, text: `#ffffff`, title: `#f0abfc`, accent: `#22d3ee`, soft: `#c4b5fd`, plateTitle: `#7e22ce`, panel: `rgba(18,0,43,.7)`, btn: `#2a0a4a`, btnText: `#fdf4ff`, btnLine: `#7e22ce`, play: `#22d3ee`, playText: `#0b0420`, rail: `rgba(255,255,255,.18)`, card: `#fdf4ff`, cardText: `#2e1065`, glow: `0 0 .18em rgba(34,211,238,.75)`, syl: $g, bg: Ure(), bottom: 950, swatch: `#22063f` }, winter: { id: `winter`, label: `Winter`, dark: true, text: `#ffffff`, title: `#fde68a`, accent: `#fbbf24`, soft: `#cbd5e1`, plateTitle: `#991b1b`, panel: `rgba(8,20,45,.66)`, btn: `#1e3a6e`, btnText: `#f1f5f9`, btnLine: `#3b5b98`, play: `#dc2626`, playText: `#ffffff`, rail: `rgba(255,255,255,.2)`, card: `#fffaf0`, cardText: `#7f1d1d`, syl: $g, bg: Wre(), bottom: 880, swatch: `#1d3b72` } };
var i_ = (e17) => r_[e17 in r_ ? e17 : `stage`];
var a_ = (e17) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 990" width="1400" height="990">${e17.bg}</svg>`;
var o_ = [`grund`, `druck`, `andika`, `nunito`, `lexend`, `schreib`, `sas`];
var s_ = { min: 36, max: 130, def: 84 };
var c_ = [1, 0.85, 0.7];
var l_ = (e17, t10) => typeof e17 == `string` ? e17.slice(0, t10) : ``;
var u_ = (e17, t10, n10, r10) => typeof e17 == `number` && Number.isFinite(e17) ? Math.min(r10, Math.max(n10, e17)) : t10;
var d_ = (e17, t10, n10) => t10.includes(String(e17)) ? e17 : n10;
function f_() {
  return { title: `Mein Lied`, credit: ``, text: ``, font: `grund`, size: s_.def, syllables: false, follow: false, design: `stage`, pics: {}, picsOn: true, secs: 4, intro: 3, repeat: 1, mode: `auto`, rec: `room` };
}
function Gre(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : null;
  if (!t10 || !Array.isArray(t10.marks)) return;
  let n10 = [];
  for (let e18 of t10.marks.slice(0, 4e3)) Array.isArray(e18) && typeof e18[0] == `number` && typeof e18[1] == `number` && Number.isFinite(e18[0]) && n10.push([Math.max(0, Math.round(e18[0])), Math.max(-1, Math.round(e18[1]))]);
  n10.sort((e18, t11) => e18[0] - t11[0]);
  let r10 = typeof t10.n == `number` ? Math.max(0, Math.round(t10.n)) : 0, i10 = u_(t10.end, n10.length ? n10[n10.length - 1][0] + 4e3 : 0, 0, 216e5);
  return n10.length && r10 ? { marks: n10, end: Math.max(i10, n10[n10.length - 1][0]), n: r10 } : void 0;
}
function p_(e17, t10 = (e18) => typeof e18 == `string` && e18 ? e18 : void 0, n10 = t10) {
  let r10 = e17 && typeof e17 == `object` ? e17 : {}, i10 = f_(), a10 = {};
  if (r10.pics && typeof r10.pics == `object`) for (let [e18, n11] of Object.entries(r10.pics).slice(0, 400)) {
    let r11 = n11 && typeof n11 == `object` ? n11 : {}, i11 = t10(r11.img);
    i11 && e18.length <= 40 && (a10[e18.toLocaleLowerCase(`de-DE`)] = { img: i11, ...r11.instead === true ? { instead: true } : {} });
  }
  let o10 = n10(r10.audio), s10 = Gre(r10.timing), c10 = Array.isArray(r10.nopic) ? r10.nopic.filter((e18) => typeof e18 == `string` && e18.length <= 40).slice(0, 400) : [], l10 = Array.isArray(r10.skip) ? [...new Set(r10.skip.filter((e18) => typeof e18 == `number` && Number.isInteger(e18) && e18 >= 1 && e18 <= 99))].sort((e18, t11) => e18 - t11) : [];
  return { title: l_(r10.title, 120) || i10.title, credit: l_(r10.credit, 300), ...typeof r10.song == `string` && r10.song ? { song: r10.song.slice(0, 40) } : {}, text: l_(r10.text, 2e4), font: d_(r10.font, o_, i10.font), size: Math.round(u_(r10.size, i10.size, s_.min, s_.max)), syllables: r10.syllables === true, follow: r10.follow === true, design: d_(r10.design, Zg, i10.design), pics: a10, picsOn: r10.picsOn !== false, ...c10.length ? { nopic: c10 } : {}, secs: Math.round(u_(r10.secs, i10.secs, 1.5, 20) * 10) / 10, intro: Math.round(u_(r10.intro, i10.intro, 0, 30) * 10) / 10, repeat: Math.round(u_(r10.repeat, 1, 1, 5)), ...l10.length ? { skip: l10 } : {}, mode: d_(r10.mode, [`auto`, `hand`], `auto`), rec: d_(r10.rec, [`room`, `mix`], `room`), ...o10 ? { audio: o10 } : {}, ...s10 ? { timing: s10 } : {} };
}
var h_ = /^\s*(refrain|kehrvers|chorus|ref\.?)\s*:\s*$/i;
var g_ = /^\s*\(?\s*(refrain|kehrvers|chorus|ref\.?)\s*\)?\s*:?\s*$/i;
var __ = /^\s*-{3,}\s*(\d+(?:[.,]\d+)?)?\s*(.*)$/;
var v_ = /^\s*([A-Za-zÄÖÜäöüß]{1,16})\s*:\s+(\S.*)$/;
var qre = /^\s*\d{1,2}[.)]\s+/;
var y_ = /* @__PURE__ */ new Map();
function b_(e17, t10 = 1) {
  let n10 = `${t10}|${e17}`, r10 = y_.get(n10);
  if (r10) return r10;
  let i10 = [], a10 = [];
  for (let t11 of e17.replace(/\r/g, ``).split(`
`)) t11.trim() ? a10.push(t11.replace(/\s+$/, ``)) : a10.length && (i10.push(a10), a10 = []);
  a10.length && i10.push(a10);
  let o10 = [], s10 = [], c10 = 0;
  for (let e18 of i10) {
    let t11 = h_.test(e18[0]), n11 = [], r11;
    if ((t11 ? e18.slice(1) : e18).forEach((e19, i12) => {
      let a12 = __.exec(e19);
      if (a12) {
        let e20 = a12[1] ? Math.min(8, Math.max(0.25, Number(a12[1].replace(`,`, `.`)))) : 1;
        n11.push({ kind: `inst`, text: a12[2].trim().slice(0, 40), factor: e20 });
        return;
      }
      if (!t11 && g_.test(e19)) {
        n11.push({ kind: `ref`, text: `Refrain` });
        return;
      }
      let s11 = i12 === 0 ? e19.replace(qre, ``) : e19, c11 = v_.exec(s11), l11 = false;
      c11 && !g_.test(c11[1]) && (r11 = c11[1], l11 = true, s11 = c11[2], o10.includes(r11) || o10.push(r11)), n11.push({ kind: `line`, text: s11.trim(), ...r11 ? { role: r11 } : {}, ...l11 ? { roleStart: l11 } : {} });
    }), !n11.length) continue;
    let i11 = n11.some((e19) => e19.kind === `line`), a11 = t11 ? `refrain` : i11 || n11.some((e19) => e19.kind === `ref`) ? `verse` : `inst`;
    s10.push({ kind: a11, no: a11 === `verse` && i11 ? ++c10 : 0, lines: n11 });
  }
  let l10 = s10.find((e18) => e18.kind === `refrain`), u10 = [], d10 = [], f10 = Math.max(1, Math.min(5, t10));
  for (let e18 = 1; e18 <= f10; e18++) {
    let t11 = f10 > 1 ? ` \xB7 ${e18}. Mal` : ``, n11 = ``, r11 = (e19, r12, i11, a11) => {
      r12 !== n11 && (d10.push({ label: r12 + t11, kind: i11, start: u10.length }), n11 = r12), u10.push({ kind: e19.kind === `inst` ? `inst` : `line`, text: e19.text, ...e19.role ? { role: e19.role } : {}, factor: e19.factor ?? 1, sec: d10.length - 1, verse: a11 });
    };
    for (let e19 of s10) {
      let t12 = e19.kind === `refrain` ? `Refrain` : e19.kind === `inst` ? `Musik` : `Strophe ${e19.no}`;
      for (let n12 of e19.lines) if (n12.kind !== `ref`) r11(n12, t12, e19.kind, e19.no);
      else if (l10) for (let t13 of l10.lines) r11(t13, `Refrain`, `refrain`, e19.no);
      else r11({ kind: `line`, text: `Refrain` }, t12, `verse`, e19.no);
    }
  }
  if (c10 === 1 && !l10) for (let e18 of d10) e18.label = e18.label.replace(/^Strophe 1/, `Lied`);
  let p10 = { blocks: s10, slots: u10, sections: d10, roles: o10, verses: c10 };
  return y_.size > 40 && y_.clear(), y_.set(n10, p10), p10;
}
function x_(e17, t10) {
  let n10 = e17.slots[t10];
  return n10?.text ? n10.text : t10 === 0 ? `Vorspiel` : t10 === e17.slots.length - 1 ? `Nachspiel` : `Zwischenspiel`;
}
var S_ = `A-Za-z\xC4\xD6\xDC\xE4\xF6\xFC\xDF\xC0-\u024F`;
var Jre = RegExp(`\\[([^\\]\\n]{1,40})\\]|([${S_}]+(?:['\u2019][${S_}]+)*)|([^\\[${S_}]+|\\[)`, `g`);
var Yre = RegExp(`^[${S_}]+(?:['\u2019][${S_}]+)*$`);
var C_ = (e17) => e17.trim().toLocaleLowerCase(`de-DE`).replace(/['’]/g, ``);
function w_(e17) {
  let t10 = [];
  for (let n10 of e17.matchAll(Jre)) if (n10[1] !== void 0) {
    let e18 = n10[1].trim();
    Yre.test(e18) ? t10.push({ text: e18, key: C_(e18), instead: true }) : t10.push({ text: n10[0] });
  } else n10[2] === void 0 ? t10.push({ text: n10[0] }) : t10.push({ text: n10[2], key: C_(n10[2]) });
  return t10;
}
function T_(e17) {
  let t10 = /* @__PURE__ */ new Set(), n10 = [];
  for (let r10 of e17.replace(/\r/g, ``).split(`
`)) {
    if (__.test(r10) || h_.test(r10) || g_.test(r10)) continue;
    let e18 = v_.exec(r10);
    for (let i10 of w_(e18 ? e18[2] : r10)) !i10.key || t10.has(i10.key) || i10.key.length < 2 || (t10.add(i10.key), n10.push(i10.text));
  }
  return n10;
}
var E_ = (e17) => e17.replace(/\[([^\]\n]{1,40})\]/g, `$1`);
var D_ = 1400;
var O_ = 990;
var k_ = 50;
var Xre = 1190;
var A_ = { x: 1222, w: 150, top: 150, bottom: 952 };
var j_ = { top: 178, bottom: 836 };
var M_ = { top: 846, bottom: 962 };
var N_ = 84;
var Zre = 100;
var Qre = 10;
var P_ = `'Nunito', Nunito, Verdana, sans-serif`;
var F_ = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/"/g, `&quot;`);
var I_ = (e17) => Math.round(e17 * 100) / 100;
var $re = { play: `<path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/>`, pause: `<rect x="6" y="5" width="4.2" height="14" rx="1.2" fill="currentColor"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2" fill="currentColor"/>`, reset: `<path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5M4.5 4v4.8h4.8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`, rec: `<circle cx="12" cy="12" r="7" fill="currentColor"/>`, stop: `<rect x="6" y="6" width="12" height="12" rx="2.2" fill="currentColor"/>`, tempo: `<path d="M8.5 21h7l-2.4-16.5h-2.2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 15.5l5.5-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="17.6" cy="7.4" r="1.6" fill="currentColor"/>`, auto: `<path d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M18.4 3v3.8h-3.8M5.6 21v-3.8h3.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 9.2v5.6l4.6-2.8z" fill="currentColor"/>`, hand: `<path d="M8.5 12V5.6a1.5 1.5 0 0 1 3 0V11M11.5 10.5V4.2a1.5 1.5 0 0 1 3 0v6.6M14.5 11V6a1.5 1.5 0 0 1 3 0v7.5c0 4.4-2.7 7.5-6.6 7.5-3.1 0-4.9-1.6-6-4.2L3.6 13a1.5 1.5 0 0 1 2.6-1.4l2.3 2.9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`, list: `<path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="4.5" cy="6" r="1.6" fill="currentColor"/><circle cx="4.5" cy="12" r="1.6" fill="currentColor"/><circle cx="4.5" cy="18" r="1.6" fill="currentColor"/>`, next: `<path d="M5 5l9.5 7L5 19z" fill="currentColor"/><rect x="16" y="5" width="3.2" height="14" rx="1.2" fill="currentColor"/>`, gap: `<path d="M4 5.5h16M4 18.5h16" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M4 12h2.5M10.75 12h2.5M17.5 12H20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>`, listen: `<path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><rect x="3" y="13.5" width="5" height="7.5" rx="1.8" fill="currentColor"/><rect x="16" y="13.5" width="5" height="7.5" rx="1.8" fill="currentColor"/>`, save: `<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`, check: `<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`, music: `<path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.6" fill="currentColor"/><circle cx="16.5" cy="16" r="2.6" fill="currentColor"/>`, close: `<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>` };
var L_ = (e17, t10) => `<svg viewBox="0 0 24 24" width="${I_(t10)}" height="${I_(t10)}" aria-hidden="true">${$re[e17] ?? ``}</svg>`;
var R_ = null;
var z_ = /* @__PURE__ */ new Set();
function B_(e17) {
  if (typeof document > `u` || !document.fonts || z_.has(e17)) return null;
  let t10 = `40px "${Be(e17).family}"`;
  try {
    return document.fonts.check(t10) ? null : (z_.add(e17), document.fonts.load(t10).catch(() => void 0));
  } catch {
    return null;
  }
}
function V_(e17, t10, n10) {
  return typeof document > `u` || (R_ ??= document.createElement(`canvas`).getContext(`2d`), !R_) ? e17.length * n10 * 0.55 : (R_.font = `${n10}px ${Ve(t10)}`, R_.measureText(e17).width);
}
function H_(e17, t10, n10, r10) {
  let i10 = 0;
  for (let a10 of w_(t10)) {
    let t11 = a10.key ? e17.k.pics[a10.key] : void 0;
    t11 && (a10.instead || r10 && t11.instead) ? i10 += n10 * 1.5 : i10 += t11 && r10 ? Math.max(V_(a10.text, e17.k.font, n10), n10 * 1.15) : V_(a10.text, e17.k.font, n10);
  }
  return i10;
}
var U_ = (e17, t10) => w_(t10).some((t11) => t11.key && e17.k.pics[t11.key] && (t11.instead || e17.k.picsOn));
function eie(e17) {
  let t10 = e17.p.slots.filter((e18) => e18.kind === `line`), n10 = (n11, r11) => t10.every((t11) => {
    let i10 = U_(e17, t11.text), a10 = Math.ceil(H_(e17, t11.text, n11, e17.k.picsOn) / 1105.8);
    return a10 <= r11 && a10 * n11 * (i10 ? 2.5 : 1.3) <= 300;
  }), r10 = e17.k.size;
  for (let e18 = r10; e18 >= Math.max(s_.min, r10 * 0.72); e18 -= 2) if (n10(e18, 1)) return e18;
  for (let e18 = r10; e18 >= 26; e18 -= 2) if (n10(e18, 2)) return e18;
  return 26;
}
function W_(e17, t10, n10, r10 = {}) {
  let i10 = ``, a10 = 0, o10 = n10 * 1.15, s10 = n10 * 1.5, c10 = ``, l10 = () => {
    c10 && (i10 += `<span class="lh-ka-g">${c10}</span>`), c10 = ``;
  };
  for (let n11 of w_(t10)) {
    if (!n11.key) {
      for (let e18 of n11.text.split(/(\s+)/)) e18 && (/^\s+$/.test(e18) ? (l10(), i10 += ` `) : c10 += F_(e18));
      continue;
    }
    let t11 = e17.k.pics[n11.key], u10 = t11 ? e17.src(t11.img) : void 0, d10 = !!u10 && (n11.instead || e17.k.picsOn && !!t11?.instead), f10 = !!u10 && !d10 && e17.k.picsOn, p10 = e17.k.syllables ? tg(n11.text).map((t12) => t12.color === void 0 ? F_(t12.text) : `<span style="color:${e17.d.syl[t12.color]}">${F_(t12.text)}</span>`).join(``) : F_(n11.text), m10 = eg(n11.text).length || 1, h10 = r10.follow ? ` data-w="${a10++}" data-n="${m10}"` : ``;
    c10 += d10 ? `<span class="lh-ka-w is-pic"${h10}><img src="${u10}" alt="${F_(n11.text)}" draggable="false" style="width:${I_(s10)}px;height:${I_(s10)}px"></span>` : f10 ? `<span class="lh-ka-w has-pic"${h10} style="padding-top:${I_(o10 * 1.08)}px;min-width:${I_(o10)}px"><img src="${u10}" alt="" draggable="false" style="width:${I_(o10)}px;height:${I_(o10)}px"><span class="lh-ka-t">${p10}</span></span>` : `<span class="lh-ka-w"${h10}>${p10}</span>`;
  }
  return l10(), i10;
}
var tie = [`#e8590c`, `#1c7ed6`, `#2b8a3e`, `#ae3ec9`];
var nie = [`#ffa94d`, `#74c0fc`, `#8ce99a`, `#e599f7`];
var G_ = (e17, t10) => (e17.d.dark ? nie : tie)[Math.max(0, e17.p.roles.indexOf(t10)) % 4];
function rie(e17, t10, n10, r10, i10, a10) {
  return { k: e17, d: i_(e17.design), p: b_(e17.text, e17.repeat), kx: t10 / D_, ky: n10 / O_, s: Math.min(t10 / D_, n10 / O_), src: (e18) => {
    let t11 = e18 ? r10[e18] : void 0;
    return t11 ? i10 ? i10(t11) : t11.dataUrl : void 0;
  }, stickerUrl: a10 };
}
var iie = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var K_ = /* @__PURE__ */ new Map();
function q_(e17) {
  let t10 = a_(e17.d), n10;
  return e17.stickerUrl ? n10 = e17.stickerUrl(t10) : (n10 = K_.get(e17.d.id) ?? iie(t10), K_.set(e17.d.id, n10)), `<img class="lh-ka-bg" src="${n10}" alt="" draggable="false" style="width:${I_(D_ * e17.kx)}px;height:${I_(O_ * e17.ky)}px">`;
}
var J_ = (e17, t10, n10, r10, i10) => `left:${I_(t10 * e17.kx)}px;top:${I_(n10 * e17.ky)}px;width:${I_(r10 * e17.kx)}px;height:${I_(i10 * e17.ky)}px`;
function Y_(e17) {
  let t10 = e17.d;
  return [`width:${I_(D_ * e17.kx)}px;height:${I_(O_ * e17.ky)}px`, `font-family:${Ve(e17.k.font).replace(/"/g, `'`)}`, `--ka-text:${t10.text};--ka-title:${t10.title};--ka-accent:${t10.accent};--ka-soft:${t10.soft};--ka-panel:${t10.panel};--ka-btn:${t10.btn};--ka-btntext:${t10.btnText};--ka-btnline:${t10.btnLine}`, `--ka-ptitle:${t10.plateTitle};--ka-play:${t10.play};--ka-playtext:${t10.playText};--ka-rail:${t10.rail};--ka-card:${t10.card};--ka-cardtext:${t10.cardText};--ka-glow:${t10.glow ?? `none`}`].join(`;`);
}
function X_(e17, t10) {
  let n10 = t10 - k_, r10 = e17.k.title || `Ohne Titel`, i10 = Math.max(30, Math.min(56, (n10 - 44) * 0.96 * 100 / Math.max(1, V_(r10, e17.k.font, 100)))), a10 = e17.k.credit + (e17.k.repeat > 1 ? `${e17.k.credit ? ` \xB7 ` : ``}${e17.k.repeat}\xD7 singen` : ``);
  return `<div class="lh-ka-head" style="${J_(e17, k_, 40, n10, 130)}"><div class="lh-ka-plate" style="padding:${I_(4 * e17.s)}px ${I_(20 * e17.s)}px ${I_(8 * e17.s)}px;border-radius:${I_(18 * e17.s)}px"><div class="lh-ka-title" style="font-size:${I_(i10 * e17.s)}px">${F_(r10)}</div>` + (a10 ? `<div class="lh-ka-credit" style="font-size:${I_(19 * e17.s)}px">${F_(a10)}</div>` : ``) + `</div></div>`;
}
function aie(e17, t10, n10) {
  let r10 = e17.p.slots[t10];
  if (r10.kind === `inst`) return `<div class="lh-ka-l is-inst is-later" data-i="${t10}" style="font-size:${I_(n10 * 0.62 * e17.s)}px">${L_(`music`, n10 * 0.6 * e17.s)}<span>${F_(x_(e17.p, t10))}</span>${L_(`music`, n10 * 0.6 * e17.s)}</div>`;
  let i10 = r10.role ? `<span class="lh-ka-role" style="color:${G_(e17, r10.role)};font-size:${I_(26 * e17.s)}px">${F_(r10.role)}</span>` : ``;
  return `<div class="lh-ka-l is-later" data-i="${t10}" style="font-size:${I_(n10 * e17.s)}px">${i10}<div class="lh-ka-lt">${W_(e17, r10.text, n10 * e17.s, { follow: true })}</div></div>`;
}
function Z_(e17) {
  let t10 = eie(e17), n10 = e17.p.slots.map((n11, r11) => aie(e17, r11, t10)).join(``), r10 = 1140, i10 = (t11, n11, r11, i11 = ``) => `<div class="lh-key lh-ka-ctl${i11}" data-a="${t11}" role="button" aria-label="${F_(r11)}" style="width:${I_(Zre * e17.kx)}px"><span class="lh-ka-round" style="width:${I_(N_ * e17.s)}px;height:${I_(N_ * e17.s)}px"><span class="lh-ka-ic">${L_(n11, N_ * 0.5 * e17.s)}</span><i class="lh-kdown"></i></span><span class="lh-ka-cl" style="font-size:${I_(17 * e17.s)}px">${F_(r11)}</span></div>`, a10 = (t11, n11, r11, i11 = ``) => `<div class="lh-key lh-ka-btn${i11}" data-a="${t11}" role="button" aria-label="${F_(r11)}" style="height:${I_(108 * e17.ky)}px"><i class="lh-kdown"></i><span class="lh-ka-ic">${L_(n11, 46 * e17.s)}</span><span class="lh-ka-bl" style="font-size:${I_(20 * e17.s)}px">${F_(r11)}</span></div>`;
  return `<div class="lh-ka is-live${e17.d.dark ? ` is-dark` : ``}${e17.k.syllables ? ` is-syl` : ``}" style="${Y_(e17)};--trA:${I_(234 * e17.kx)}px;--trH:${I_(344 * e17.kx)}px">` + q_(e17) + X_(e17, Xre) + `<div class="lh-ka-badge" style="left:${I_(k_ * e17.kx)}px;top:${I_((j_.top - 4) * e17.ky)}px;font-size:${I_(24 * e17.s)}px"></div><div class="lh-ka-area" style="${J_(e17, k_, j_.top, r10, j_.bottom - j_.top)}"><div class="lh-ka-cd" style="font-size:${I_(230 * e17.s)}px"></div><div class="lh-ka-mark" style="font-size:${I_(54 * e17.s)}px"></div>` + (e17.p.slots.length ? n10 : `<div class="lh-ka-empty" style="font-size:${I_(34 * e17.s)}px">Noch kein Liedtext \u2013 tippe oben auf \u201EEinstellen\u201C.</div>`) + `</div><div class="lh-ka-bar" style="${J_(e17, k_, M_.top, r10, M_.bottom - M_.top)}"><div class="lh-ka-status" style="font-size:${I_(22 * e17.s)}px"></div><div class="lh-ka-time" style="font-size:${I_(22 * e17.s)}px"></div><div class="lh-ka-track" style="top:${I_(22 * e17.ky)}px;height:${I_(76 * e17.ky)}px"><div class="lh-ka-rail" style="height:${I_(26 * e17.ky)}px"><div class="lh-ka-fill"></div></div></div><div class="lh-ka-ctls" style="gap:${I_(Qre * e17.kx)}px">` + i10(`pause`, `play`, `Start`, ` is-pause`) + i10(`gap`, `gap`, `Leerzeile`, ` is-gap`) + i10(`next`, `next`, `N\xE4chste`, ` is-next`) + `</div></div><div class="lh-ka-panel" style="${J_(e17, A_.x, A_.top, A_.w, A_.bottom - A_.top)};gap:${I_(12 * e17.ky)}px;padding:${I_(10 * e17.s)}px">` + a10(`play`, `play`, `Start`, ` is-play`) + a10(`reset`, `reset`, `Von vorn`) + a10(`rec`, `rec`, `Aufnahme`, ` is-rec`) + a10(`tempo`, `tempo`, `Tempo 100%`) + a10(`mode`, `auto`, `Automatisch`) + a10(`list`, `list`, `Strophen`) + `</div><div class="lh-ka-over"></div></div>`;
}
function oie(e17, t10, n10) {
  return t10.kind === `ref` ? `<div class="lh-ka-sl is-ref">Refrain</div>` : t10.kind === `inst` ? `<div class="lh-ka-sl is-inst">\u266A ${F_(t10.text || `Musik`)}</div>` : `<div class="lh-ka-sl">${t10.roleStart && t10.role ? `<span class="lh-ka-srole" style="color:${G_(e17, t10.role)}">${F_(t10.role)}:</span> ` : ``}${W_(e17, t10.text, n10 * e17.s)}</div>`;
}
function Q_(e17) {
  let t10 = e17.d.bottom, n10 = new Set(e17.k.skip ?? []), r10 = e17.p.blocks.filter((e18) => !(e18.no && n10.has(e18.no))), i10 = r10.length ? r10 : e17.p.blocks, a10 = (e18) => e18.kind === `refrain` ? `Refrain:` : e18.no ? `${e18.no}.` : ``, o10 = (t11, n11) => i10.map((r11) => {
    let i11 = t11 * 1.6, a11 = 0;
    for (let o11 of r11.lines) {
      let r12 = o11.kind === `line` && U_(e17, o11.text), s11 = o11.kind === `line` ? Math.max(1, Math.ceil(H_(e17, (o11.roleStart && o11.role ? o11.role + `: ` : ``) + o11.text, t11, e17.k.picsOn) / Math.max(40, (n11 - i11) * 0.9))) : 1;
      a11 += s11 * t11 * (r12 ? 2.42 : 1.3);
    }
    return a11 + (r11.kind === `refrain` ? t11 * 1.3 : 0) + t11 * 0.7;
  }), s10 = (e18, t11, n11) => {
    let r11 = [[]], i11 = 0;
    return e18.forEach((e19, t12) => {
      i11 + e19 > n11 && r11[r11.length - 1].length && (r11.push([]), i11 = 0), r11[r11.length - 1].push(t12), i11 += e19;
    }), r11.length <= t11 && r11.every((t12) => t12.reduce((t13, n12) => t13 + e18[n12], 0) <= n11 + 1) ? r11 : null;
  }, c10 = [];
  for (let e18 of [1, 2, 3]) {
    let n11 = (1280 - (e18 - 1) * 44) / e18;
    for (let r11 = 52; r11 >= 14; --r11) {
      let i11 = s10(o10(r11, n11), e18, t10 - 176);
      if (i11) {
        c10.push({ s: r11, cols: e18, layout: i11 });
        break;
      }
    }
  }
  let l10 = Math.max(0, ...c10.map((e18) => e18.s)), u10 = c10.find((e18) => e18.s >= l10 * 0.84) ?? null;
  u10 ??= { s: 14, cols: 3, layout: [i10.map((e18, t11) => t11)] };
  let d10 = (1280 - (u10.cols - 1) * 44) / u10.cols, f10 = u10.s, p10 = u10.layout.map((n11, r11) => {
    let o11 = n11.map((t11) => {
      let n12 = i10[t11], r12 = a10(n12);
      return `<div class="lh-ka-sb${n12.kind === `refrain` ? ` is-refrain` : ``}" style="padding-left:${I_(f10 * 1.6 * e17.s)}px;margin-bottom:${I_(f10 * 0.7 * e17.s)}px">${r12 && n12.kind !== `refrain` ? `<span class="lh-ka-sno" style="width:${I_(f10 * 1.4 * e17.s)}px">${r12}</span>` : ``}${n12.kind === `refrain` ? `<div class="lh-ka-shead">${r12}</div>` : ``}${n12.lines.map((t12) => oie(e17, t12, f10)).join(``)}</div>`;
    }).join(``);
    return `<div class="lh-ka-scol" style="${J_(e17, 60 + r11 * (d10 + 44), 176, d10, t10 - 176)};font-size:${I_(f10 * e17.s)}px">${o11}</div>`;
  }).join(``);
  return `<div class="lh-ka is-sheet${e17.d.dark ? ` is-dark` : ``}" style="${Y_(e17)}">` + q_(e17) + X_(e17, 1350) + (i10.length ? p10 : `<div class="lh-ka-empty" style="${J_(e17, k_, 400, 1300, 100)};font-size:${I_(34 * e17.s)}px">Noch kein Liedtext</div>`) + `</div>`;
}
var $_ = 1e3;
var ev = /* @__PURE__ */ new Map();
var tv = /* @__PURE__ */ new Map();
var nv = /* @__PURE__ */ new Map();
var rv = /* @__PURE__ */ new Map();
function iv(e17) {
  let t10 = ev.get(e17);
  return t10 || (t10 = { phase: `idle`, pos: 0, since: 0, rate: 1, mode: ov(e17).mode, slot: -1, gapAfter: -1, events: [], real: [], realPos: 0, realSince: 0, logged: NaN, clean: true, el: null, elAsset: ``, routed: false, rec: null, pending: null, recording: false, take: null, listen: null, card: ``, count: 0, timer: 0, raf: 0, skip: null, sung: -1, message: `` }, ev.set(e17, t10)), t10;
}
var av = /* @__PURE__ */ new WeakMap();
var lie = {};
function ov(e17) {
  let t10 = tv.get(e17)?.karaoke ?? lie, n10 = av.get(t10);
  return n10 || av.set(t10, n10 = p_(t10)), n10;
}
var sv = (e17) => {
  let t10 = ov(e17);
  return b_(t10.text, t10.repeat);
};
function cv(e17) {
  let t10 = iv(e17);
  return new Set(t10.skip ?? ov(e17).skip ?? []);
}
function lv(e17) {
  let t10 = sv(e17), n10 = cv(e17), r10 = t10.slots.map((e18) => !(e18.verse && n10.has(e18.verse)));
  return r10.some(Boolean) ? r10 : t10.slots.map(() => true);
}
var uv = (e17) => lv(e17).flatMap((e18, t10) => e18 ? [t10] : []);
function dv(e17) {
  let t10 = iv(e17), n10 = ov(e17), r10 = sv(e17);
  if (t10.listen && t10.take) return { ...kie(t10.take, r10.slots.length), timed: true, cuts: [] };
  let i10 = lv(e17), a10 = t10.timing ?? n10.timing;
  if (a10 && a10.n === r10.slots.length) {
    let e18 = [], t11 = [], n11 = -1;
    for (let [r11, o11] of a10.marks) o11 >= 0 && !i10[o11] && n11 < 0 && (n11 = r11), o11 >= 0 && i10[o11] && n11 >= 0 && (t11.push([n11, r11]), n11 = -1), n11 < 0 && e18.push([r11, o11]);
    return n11 >= 0 && t11.push([n11, a10.end]), { marks: e18, end: a10.end, timed: true, cuts: t11 };
  }
  let o10 = [], s10 = n10.intro * 1e3;
  return r10.slots.forEach((e18, t11) => {
    i10[t11] && (o10.push([s10, t11]), s10 += n10.secs * 1e3 * (e18.kind === `inst` ? e18.factor : 1));
  }), { marks: o10, end: s10, timed: false, cuts: [] };
}
function fv(e17) {
  return e17.listen ? e17.listen.currentTime * 1e3 : e17.el ? e17.el.currentTime * 1e3 : e17.phase === `run` ? e17.pos + (performance.now() - e17.since) * e17.rate : e17.pos;
}
var pv = (e17) => e17.phase === `run` ? e17.realPos + (performance.now() - e17.realSince) : e17.realPos;
function mv(e17) {
  let t10 = iv(e17), n10 = sv(e17), r10 = n10.slots.length;
  if (t10.phase === `idle` && !t10.listen) return { code: -1, after: -1, p: 0, next: null };
  if (t10.mode === `hand` && !t10.listen) {
    let n11 = dv(e17), r11 = fv(t10), i11 = n11.marks.findIndex(([, e18]) => e18 === t10.slot), a11 = i11 >= 0 ? (n11.marks[i11 + 1]?.[0] ?? n11.end) - n11.marks[i11][0] : 0;
    return { code: t10.slot, after: t10.gapAfter, p: t10.slot >= 0 && a11 > 0 ? Math.min(1, (r11 - (t10.events.findLast?.(([, e18]) => e18 === t10.slot)?.[0] ?? r11)) / a11) : null, next: null };
  }
  let i10 = dv(e17), a10 = fv(t10);
  if (t10.phase === `end` || a10 >= i10.end) return { code: -3, after: r10 - 1, p: 1, next: null };
  let o10 = -1;
  for (let e18 = 0; e18 < i10.marks.length; e18++) i10.marks[e18][0] <= a10 && (o10 = e18);
  let s10 = (e18) => {
    for (let t11 = e18; t11 < i10.marks.length; t11++) {
      let e19 = i10.marks[t11][1];
      if (e19 >= 0 && n10.slots[e19]?.kind === `line`) return i10.marks[t11][0] - a10;
    }
    return null;
  };
  if (o10 < 0) return { code: -1, after: -1, p: 0, next: s10(0) };
  let [c10, l10] = i10.marks[o10], u10 = i10.cuts.find(([e18]) => e18 > c10), d10 = Math.min(i10.marks[o10 + 1]?.[0] ?? i10.end, u10 ? u10[0] : 1 / 0), f10 = d10 > c10 ? Math.min(1, Math.max(0, (a10 - c10) / (d10 - c10))) : 1;
  if (l10 < 0) {
    let e18 = -1;
    for (let t11 = o10 - 1; t11 >= 0; t11--) if (i10.marks[t11][1] >= 0) {
      e18 = i10.marks[t11][1];
      break;
    }
    return { code: -2, after: e18, p: f10, next: s10(o10 + 1) };
  }
  return { code: l10, after: -1, p: f10, next: n10.slots[l10]?.kind === `inst` ? s10(o10 + 1) : null };
}
var uie = /* @__PURE__ */ new Map();
function die(e17, t10) {
  let n10 = uie.get(e17);
  if (n10) return n10;
  let r10 = t10.dataUrl;
  try {
    let e18 = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(t10.dataUrl);
    if (e18) {
      let n11 = e18[2] ? Uint8Array.from(atob(e18[3]), (e19) => e19.charCodeAt(0)) : new TextEncoder().encode(decodeURIComponent(e18[3]));
      r10 = URL.createObjectURL(new Blob([n11], { type: e18[1] || t10.mime || `audio/mpeg` }));
    }
  } catch {
  }
  return uie.set(e17, r10), r10;
}
function hv(e17, t10) {
  let n10 = e17;
  n10.preservesPitch = true, n10.webkitPreservesPitch = true, n10.mozPreservesPitch = true, e17.playbackRate = t10;
}
function fie(e17, t10 = false) {
  let n10 = iv(e17), r10 = ov(e17), i10 = r10.audio ? nv.get(e17)?.[r10.audio] : void 0;
  if (!r10.audio || !i10) return gv(n10), null;
  if (n10.el && n10.elAsset === r10.audio && !t10) return n10.el;
  gv(n10);
  let a10 = new Audio();
  return a10.preload = `auto`, a10.src = die(r10.audio, i10), hv(a10, n10.rate), a10.addEventListener(`ended`, () => {
    iv(e17).el === a10 && iv(e17).phase === `run` && iv(e17).mode === `auto` && xv(e17);
  }), n10.el = a10, n10.elAsset = r10.audio, a10;
}
function gv(e17) {
  e17.el && (e17.el.pause(), e17.el = null, e17.elAsset = ``, e17.routed = false);
}
function pie(e17) {
  let t10 = iv(e17);
  cancelAnimationFrame(t10.raf);
  let n10 = () => {
    if (t10.phase === `run` || t10.listen) {
      if ((t10.mode === `auto` || t10.listen) && t10.phase === `run`) {
        let n11 = fv(t10), r10 = dv(e17).cuts.find(([e18, t11]) => n11 >= e18 && n11 < t11);
        r10 && Sv(e17, r10[1]);
      }
      if (t10.mode === `auto` || t10.listen) {
        let n11 = mv(e17);
        if (n11.code === -3 && t10.phase === `run` && !t10.el) {
          xv(e17);
          return;
        }
        _v(t10, n11.code) && jv(e17);
      }
      Nv(e17), t10.raf = requestAnimationFrame(n10);
    }
  };
  t10.raf = requestAnimationFrame(n10);
}
function _v(e17, t10) {
  return t10 !== e17.logged && (e17.logged = t10, e17.events.push([Math.round(fv(e17)), t10]), e17.recording && e17.real.push([Math.round(pv(e17)), t10]), true);
}
function vv(e17) {
  let t10 = iv(e17);
  if (t10.listen) {
    t10.listen.paused ? t10.listen.play().catch(() => void 0) : t10.listen.pause(), jv(e17);
    return;
  }
  if (t10.phase === `run` || t10.phase === `count`) return;
  t10.phase === `end` && bv(e17, true), (t10.card === `list` || t10.card === `end`) && (t10.card = ``);
  let n10 = fie(e17);
  if (t10.phase === `idle` && (t10.events = [], t10.real = [], t10.logged = NaN, t10.clean = true, t10.slot = -1, t10.realPos = 0, t10.handDone = void 0, !n10 && (t10.pos = 0, t10.mode === `auto`))) {
    let n11 = dv(e17), r10 = sv(e17), i10 = n11.marks.find(([, e18]) => e18 >= 0 && r10.slots[e18]?.kind === `line`);
    i10 && i10[0] < 3 * $_ && (t10.pos = i10[0] - 3 * $_);
  }
  t10.phase = `run`, t10.since = performance.now(), t10.realSince = t10.since, n10 && (hv(n10, t10.rate), n10.play().catch(() => void 0)), t10.rec?.resume(), t10.mode === `hand` && _v(t10, t10.slot), jv(e17), pie(e17);
}
function mie(e17) {
  let t10 = iv(e17);
  t10.listen ? (t10.listen.pause(), jv(e17)) : t10.phase === `run` && (t10.pos = fv(t10), t10.realPos = pv(t10), t10.phase = `pause`, t10.el?.pause(), t10.rec?.pause(), cancelAnimationFrame(t10.raf), jv(e17));
}
var yv = (e17) => e17.listen ? !e17.listen.paused : e17.phase === `run`;
function bv(e17, t10 = true) {
  let n10 = iv(e17);
  if (clearTimeout(n10.timer), cancelAnimationFrame(n10.raf), n10.pending &&= (n10.pending.stop(), null), n10.listen && Ev(n10), n10.recording && wv(e17), n10.el) {
    n10.el.pause();
    try {
      n10.el.currentTime = 0;
    } catch {
    }
  }
  n10.phase = `idle`, n10.pos = 0, n10.slot = -1, n10.gapAfter = -1, n10.events = [], n10.logged = NaN, n10.clean = true, t10 || Tv(n10), n10.card === `end` && t10 || (n10.card = ``), jv(e17);
}
function xv(e17) {
  let t10 = iv(e17);
  if (t10.phase !== `end`) {
    if (cancelAnimationFrame(t10.raf), _v(t10, -3), t10.pos = fv(t10), t10.realPos = pv(t10), t10.phase = `end`, t10.el?.pause(), t10.mode === `hand`) {
      let n10 = sv(e17), r10 = t10.events.filter(([, e18]) => e18 >= 0).map(([, e18]) => e18);
      t10.clean && n10.slots.length && uv(e17).length === n10.slots.length && r10.length === n10.slots.length && r10.every((e18, t11) => e18 === t11) && (t10.handDone = { marks: t10.events.filter(([, e18]) => e18 >= 0 || e18 === -2).map(([e18, t11]) => [e18, t11 === -2 ? -1 : t11]), end: Math.round(t10.pos), n: n10.slots.length });
    }
    t10.recording ? (clearTimeout(t10.timer), t10.timer = window.setTimeout(() => void wv(e17), 1200)) : t10.handDone && (t10.card = `end`), jv(e17);
  }
}
function hie(e17, t10) {
  let n10 = iv(e17);
  if (!sv(e17).slots.length || n10.listen) return;
  if (n10.mode === `hand`) {
    if (n10.phase === `idle` || n10.phase === `end`) {
      if (t10 < 0) return;
      n10.phase === `end` && bv(e17), vv(e17);
    }
    t10 < 0 && (n10.clean = false);
    let r11 = uv(e17), i11 = n10.slot, a11 = i11 === -2 ? n10.gapAfter : i11, o11;
    o11 = t10 > 0 ? i11 === -1 ? r11[0] ?? -3 : r11.find((e18) => e18 > a11) ?? -3 : i11 === -3 ? r11[r11.length - 1] ?? 0 : i11 === -2 ? Math.max(0, n10.gapAfter) : [...r11].reverse().find((e18) => e18 < i11) ?? r11[0] ?? 0, Cv(e17, o11);
    return;
  }
  let r10 = dv(e17), i10 = mv(e17), a10 = uv(e17), o10 = (e18) => a10.indexOf(e18), s10 = i10.code === -1 ? -1 : i10.code === -2 ? o10(i10.after) + (t10 > 0 ? 0 : 1) : i10.code === -3 ? a10.length : o10(i10.code), c10 = Math.max(-1, Math.min(a10.length, s10 + t10));
  t10 < 0 && (n10.clean = false), Sv(e17, c10 < 0 ? 0 : c10 >= a10.length ? r10.end : r10.marks.find(([, e18]) => e18 === a10[c10])?.[0] ?? 0);
}
function Sv(e17, t10) {
  let n10 = iv(e17);
  if (n10.el) try {
    n10.el.currentTime = t10 / 1e3;
  } catch {
  }
  n10.pos = t10, n10.since = performance.now(), (n10.phase === `idle` || n10.phase === `end`) && (n10.phase = `pause`, n10.card === `end` && (n10.card = ``)), Nv(e17), jv(e17);
}
function Cv(e17, t10) {
  let n10 = iv(e17);
  n10.phase === `pause` && vv(e17), t10 === -2 && (n10.gapAfter = n10.slot), n10.slot = t10, _v(n10, t10), t10 === -3 ? xv(e17) : jv(e17);
}
function gie(e17) {
  let t10 = iv(e17);
  t10.mode !== `hand` || t10.slot < 0 || t10.phase === `end` || t10.phase === `idle` || Cv(e17, -2);
}
function _ie(e17, t10) {
  let n10 = iv(e17);
  n10.card = ``, n10.mode === `hand` ? ((n10.phase === `idle` || n10.phase === `end`) && (bv(e17), vv(e17)), (t10 !== 0 || n10.slot !== -1) && (n10.clean = false), Cv(e17, t10)) : (n10.clean = false, Sv(e17, dv(e17).marks.find(([, e18]) => e18 === t10)?.[0] ?? 0));
}
function vie(e17) {
  let t10 = iv(e17), n10 = c_[(c_.indexOf(t10.rate) + 1) % c_.length];
  t10.phase === `run` && !t10.el && (t10.pos = fv(t10), t10.since = performance.now()), t10.rate = n10, t10.el && hv(t10.el, n10), jv(e17);
}
function yie(e17) {
  let t10 = iv(e17);
  bv(e17), t10.mode = t10.mode === `auto` ? `hand` : `auto`, jv(e17);
}
var bie = [`audio/mp4`, `audio/webm;codecs=opus`, `audio/webm`, `audio/ogg;codecs=opus`];
async function xie() {
  if (!navigator.mediaDevices?.getUserMedia) return null;
  let e17 = ni();
  try {
    return { stream: await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }), done: e17 };
  } catch (t10) {
    return console.warn(`[karaoke] no microphone`, t10), e17(), null;
  }
}
function Sie(e17, t10) {
  if (typeof MediaRecorder > `u`) return null;
  let n10 = bie.find((e18) => {
    try {
      return MediaRecorder.isTypeSupported(e18);
    } catch {
      return false;
    }
  }), r10;
  try {
    r10 = new MediaRecorder(e17, { ...n10 ? { mimeType: n10 } : {}, audioBitsPerSecond: 128e3 });
  } catch {
    return null;
  }
  let i10 = [];
  return r10.ondataavailable = (e18) => {
    e18.data.size && i10.push(e18.data);
  }, { start: () => {
    r10.state === `inactive` && r10.start(1e3);
  }, pause: () => {
    r10.state === `recording` && r10.pause();
  }, resume: () => {
    r10.state === `paused` && r10.resume();
  }, stop: () => new Promise((e18) => {
    let a10 = () => (r10.mimeType || n10 || `audio/webm`).split(`;`)[0], o10 = () => {
      t10(), e18(i10.length ? { blob: new Blob(i10, { type: a10() }), mime: a10() } : null);
    };
    if (r10.state === `inactive`) return o10();
    r10.addEventListener(`stop`, o10, { once: true });
    try {
      r10.stop();
    } catch {
      o10();
    }
  }) };
}
function Cie(e17) {
  let t10 = iv(e17);
  bv(e17, false);
  let n10 = ov(e17);
  pi();
  let r10 = n10.rec === `mix`, i10 = fie(e17, r10);
  i10 && (i10.muted = true, i10.play().then(() => {
    i10.pause(), i10.currentTime = 0;
  }).catch(() => void 0).finally(() => {
    i10.muted = false;
  })), t10.card = `count`, t10.phase = `count`, jv(e17);
  let a10, o10 = () => {
    a10 !== void 0 && t10.phase === `count` && (t10.pending = null, a10 ? (t10.rec = a10, t10.recording = true, t10.card = ``, t10.phase = `idle`, a10.start(), vv(e17)) : (t10.phase = `idle`, t10.card = `nomic`, jv(e17)));
  };
  xie().then((e18) => {
    if (!e18) {
      a10 = null, o10();
      return;
    }
    let n11 = () => {
      e18.stream.getTracks().forEach((e19) => e19.stop()), e18.done();
    };
    if (t10.phase !== `count`) {
      n11();
      return;
    }
    let s10 = e18.stream, c10 = () => {
    };
    if (r10 && i10) {
      let n12 = Vr();
      if (n12 && `createMediaStreamDestination` in n12) try {
        let r11 = n12.createMediaStreamDestination(), a11 = n12.createMediaStreamSource(e18.stream);
        a11.connect(r11);
        let o11 = n12.createMediaElementSource(i10);
        o11.connect(n12.destination), o11.connect(r11), t10.routed = true, s10 = r11.stream, c10 = () => a11.disconnect();
      } catch (e19) {
        console.warn(`[karaoke] mixing failed - the room sound only`, e19);
      }
    }
    a10 = Sie(s10, () => {
      c10(), n11();
    }), a10 || n11(), t10.pending = a10, o10();
  });
}
async function wv(e17) {
  let t10 = iv(e17), n10 = t10.rec;
  if (!n10 || !t10.recording) return;
  let r10 = Math.round(pv(t10));
  t10.recording = false, t10.rec = null;
  let i10 = t10.real.slice();
  i10.some(([, e18]) => e18 === -3) || i10.push([r10, -3]);
  let a10 = await n10.stop();
  a10 && (Tv(t10), t10.take = { blob: a10.blob, mime: a10.mime, url: URL.createObjectURL(a10.blob), dur: r10, real: i10 }, t10.card = `end`), jv(e17);
}
function Tv(e17) {
  e17.take && URL.revokeObjectURL(e17.take.url), e17.take = null;
}
function wie(e17) {
  let t10 = iv(e17);
  t10.phase === `count` ? bv(e17, false) : t10.recording ? (t10.phase !== `end` && xv(e17), clearTimeout(t10.timer), wv(e17)) : Cie(e17);
}
function Tie(e17) {
  let t10 = iv(e17);
  if (!t10.take) return;
  bv(e17);
  let n10 = new Audio(t10.take.url);
  t10.listen = n10, t10.card = ``, t10.logged = NaN, n10.addEventListener(`ended`, () => {
    t10.listen === n10 && (Ev(t10), t10.phase = `end`, t10.card = `end`, jv(e17));
  }), n10.play().catch(() => void 0), jv(e17), pie(e17);
}
function Ev(e17) {
  e17.listen &&= (e17.listen.pause(), null);
}
var Eie = (e17) => (e17 || `Lied`).replace(/[\\/:*?"<>|]+/g, ` `).trim().slice(0, 60);
var Die = () => window.OfflineAudioContext ?? window.webkitOfflineAudioContext;
async function Oie(e17) {
  let t10 = iv(e17).take;
  if (!t10) return;
  let n10 = `${Eie(ov(e17).title)} \u2013 Aufnahme ${ku()}`;
  if (/^audio\/(mp4|x-m4a|aac)$/.test(t10.mime)) return Au(t10.blob, `${n10}.m4a`);
  try {
    let e18 = Die();
    if (!e18) throw Error(`no offline context`);
    let r10 = await new e18(1, 44100, 44100).decodeAudioData(await t10.blob.arrayBuffer());
    await Au(Ou(Array.from({ length: Math.min(2, r10.numberOfChannels) }, (e19, t11) => r10.getChannelData(t11)), r10.sampleRate), `${n10}.wav`);
  } catch {
    await Au(t10.blob, `${n10}.${t10.mime.includes(`ogg`) ? `ogg` : `webm`}`);
  }
}
var kie = (e17, t10) => ({ marks: e17.real.filter(([, e18]) => e18 >= 0 || e18 === -2).map(([e18, t11]) => [e18, t11 === -2 ? -1 : t11]), end: e17.dur, n: t10 });
var Dv = null;
var Ov = null;
function Aie(e17, t10) {
  Dv = e17, Ov = t10;
}
function jie(e17) {
  let t10 = iv(e17);
  if (!t10.take || !Dv) return;
  let n10 = kie(t10.take, sv(e17).slots.length);
  Dv(e17, { blob: t10.take.blob, mime: t10.take.mime, dur: t10.take.dur }, n10), t10.card = ``, t10.message = `Die Aufnahme ist jetzt die Musik des Lieds.`, t10.timing = void 0, jv(e17);
}
function Mie(e17) {
  let t10 = iv(e17);
  t10.handDone && (Ov ? Ov(e17, t10.handDone) : t10.timing = t10.handDone, t10.handDone = void 0, t10.card = ``, t10.mode = `auto`, t10.message = `Zeitplan gemerkt \u2013 \u201EAutomatisch\u201C l\xE4uft jetzt in diesem Tempo.`, bv(e17));
}
function kv(e17, t10) {
  let n10 = iv(e17);
  switch (n10.message = ``, t10) {
    case `play`:
    case `pause`:
      yv(n10) ? mie(e17) : vv(e17);
      return;
    case `reset`:
      if (n10.listen) {
        Ev(n10), n10.phase = `idle`, n10.card = `end`, jv(e17);
        return;
      }
      bv(e17);
      return;
    case `rec`:
      wie(e17);
      return;
    case `tempo`:
      vie(e17);
      return;
    case `mode`:
      yie(e17);
      return;
    case `list`:
      n10.card = n10.card === `list` ? `` : `list`, jv(e17);
      return;
    case `next`:
      hie(e17, 1);
      return;
    case `gap`:
      gie(e17);
      return;
    case `listen`:
      Tie(e17);
      return;
    case `save`:
      Oie(e17);
      return;
    case `use`:
      jie(e17);
      return;
    case `timing`:
      Mie(e17);
      return;
    case `close`:
      n10.card = ``, jv(e17);
      return;
  }
  t10.startsWith(`go:`) && _ie(e17, Number(t10.slice(3))), t10.startsWith(`v:`) && Nie(e17, Number(t10.slice(2)));
}
function Nie(e17, t10) {
  let n10 = iv(e17), r10 = sv(e17), i10 = cv(e17);
  if (i10.has(t10)) i10.delete(t10);
  else if (r10.verses - i10.size > 1) i10.add(t10);
  else return;
  n10.skip = [...i10].sort((e18, t11) => e18 - t11), n10.phase !== `idle` && bv(e17), n10.card = `list`, jv(e17);
}
var Av = (e17) => {
  let t10 = Math.max(0, Math.floor(e17 / 1e3));
  return `${Math.floor(t10 / 60)}:${String(t10 % 60).padStart(2, `0`)}`;
};
function jv(e17) {
  let t10 = iv(e17), n10 = sv(e17), r10 = ov(e17), i10 = mv(e17);
  for (let a10 of rv.get(e17) ?? []) {
    if (!a10.isConnected) continue;
    let o10 = a10.querySelector(`.lh-ka`);
    if (!o10) continue;
    o10.classList.toggle(`is-hand`, t10.mode === `hand` && !t10.listen), o10.classList.toggle(`is-running`, yv(t10)), o10.classList.toggle(`is-recording`, t10.recording), o10.classList.toggle(`is-follow`, r10.follow), Pie(o10, n10, i10, uv(e17));
    let s10 = (e18, t11, n11) => {
      let r11 = o10.querySelector(`.lh-ka-btn[data-a="${e18}"]`);
      if (!r11) return;
      let i11 = r11.querySelector(`.lh-ka-bl`);
      if (i11 && i11.textContent !== t11 && (i11.textContent = t11), r11.setAttribute(`aria-label`, t11), n11 && r11.dataset.ic !== n11) {
        r11.dataset.ic = n11;
        let e19 = r11.querySelector(`.lh-ka-ic`), t12 = e19?.querySelector(`svg`)?.getAttribute(`width`) ?? `40`;
        e19 && (e19.innerHTML = L_(n11, Number(t12)));
      }
    }, c10 = yv(t10), l10 = c10 ? `Pause` : t10.phase === `end` ? `Nochmal` : t10.phase === `pause` || t10.listen && t10.listen.paused ? `Weiter` : `Start`;
    s10(`play`, l10, c10 ? `pause` : `play`);
    let u10 = o10.querySelector(`.lh-ka-ctl[data-a="pause"]`);
    if (u10) {
      let e18 = u10.querySelector(`.lh-ka-cl`);
      e18 && e18.textContent !== l10 && (e18.textContent = l10), u10.setAttribute(`aria-label`, l10), u10.classList.toggle(`is-on`, c10);
      let t11 = c10 ? `pause` : `play`;
      if (u10.dataset.ic !== t11) {
        u10.dataset.ic = t11;
        let e19 = u10.querySelector(`.lh-ka-ic`), n11 = e19?.querySelector(`svg`)?.getAttribute(`width`) ?? `40`;
        e19 && (e19.innerHTML = L_(t11, Number(n11)));
      }
    }
    s10(`rec`, t10.recording || t10.phase === `count` ? `Stopp` : `Aufnahme`, t10.recording || t10.phase === `count` ? `stop` : `rec`), s10(`tempo`, `Tempo ${Math.round(t10.rate * 100)}%`), s10(`mode`, t10.mode === `hand` ? `Von Hand` : `Automatisch`, t10.mode === `hand` ? `hand` : `auto`), o10.querySelector(`.lh-ka-btn[data-a="list"]`)?.classList.toggle(`is-on`, t10.card === `list`), o10.querySelector(`.lh-ka-btn[data-a="tempo"]`)?.classList.toggle(`is-on`, t10.rate !== 1);
    let d10 = o10.querySelector(`.lh-ka-status`);
    if (d10) {
      let e18 = n10.slots.length, r11 = i10.code >= 0 ? `Zeile ${i10.code + 1} von ${e18}` : ``, a11 = t10.message ? t10.message : t10.listen ? `Ihr h\xF6rt eure Aufnahme.` : t10.recording ? `\u25CF Aufnahme l\xE4uft${r11 ? ` \xB7 ` + r11 : ``}` : t10.phase === `pause` ? `Angehalten \u2013 tippe auf Weiter.` : t10.phase === `end` ? `Ende` : t10.phase === `run` ? t10.mode === `hand` ? `${r11 || `Tippe auf \u201EN\xE4chste\u201C, wenn die erste Zeile beginnt`}` : r11 : t10.mode === `hand` ? `Von Hand: Tippe f\xFCr jede neue Zeile auf \u201EN\xE4chste\u201C` : `Tippe auf Start`;
      d10.textContent !== a11 && (d10.textContent = a11);
    }
    Fie(o10, e17, t10, n10);
  }
  Nv(e17);
}
function Pie(e17, t10, n10, r10) {
  let i10 = (e18) => r10.find((t11) => t11 > e18) ?? -9, a10 = (e18) => [...r10].reverse().find((t11) => t11 < e18) ?? -9, o10 = n10.code >= 0 ? n10.code : n10.code === -1 ? r10[0] ?? -9 : -9, s10 = n10.code >= 0 ? i10(n10.code) : n10.code === -1 ? r10[1] ?? -9 : n10.code === -2 ? i10(n10.after) : -9, c10 = n10.code >= 0 ? a10(n10.code) : n10.code === -2 ? n10.after : n10.code === -3 ? r10[r10.length - 1] ?? -9 : -9, l10 = `${n10.code}|${n10.after}|${r10.join(`,`)}`;
  if (e17.dataset.shown === l10) return;
  e17.dataset.shown = l10, e17.querySelectorAll(`.lh-ka-l`).forEach((e18) => {
    let t11 = Number(e18.dataset.i), r11 = t11 === o10 ? n10.code === -1 ? `is-cur is-wait` : `is-cur` : t11 === s10 ? `is-next` : t11 === c10 ? `is-prev` : t11 < (o10 >= 0 ? o10 : c10) ? `is-gone` : `is-later`, i11 = `${e18.classList.contains(`is-inst`) ? `lh-ka-l is-inst` : `lh-ka-l`} ${r11}`;
    e18.className !== i11 && (e18.className = i11, e18.querySelectorAll(`.is-sung`).forEach((e19) => e19.classList.remove(`is-sung`)));
  });
  let u10 = e17.querySelector(`.lh-ka-mark`);
  u10 && (u10.textContent = n10.code === -2 ? `\u266A` : n10.code === -3 ? `\u266A Ende \u266A` : n10.code === -1 ? `\u266A Vorspiel \u266A` : ``, u10.classList.toggle(`is-on`, n10.code === -2 || n10.code === -3), u10.classList.toggle(`is-pre`, n10.code === -1));
  let d10 = e17.querySelector(`.lh-ka-badge`);
  if (d10) {
    let e18 = n10.code >= 0 ? n10.code : n10.code === -1 ? r10[0] ?? -1 : n10.code === -2 ? i10(n10.after) : -1, a11 = t10.sections[t10.slots[e18]?.sec ?? -1], o11 = t10.sections.length > 1 && a11 ? a11.label : ``;
    d10.textContent !== o11 && (d10.textContent = o11), d10.classList.toggle(`is-refrain`, a11?.kind === `refrain`);
  }
}
function Mv(e17, t10, n10, r10 = ``) {
  return `<div class="lh-key lh-ka-cbtn${r10}" data-a="${e17}" role="button" aria-label="${F_(n10)}"><i class="lh-kdown"></i>${L_(t10, 30)}<span>${F_(n10)}</span></div>`;
}
function Fie(e17, t10, n10, r10) {
  let i10 = e17.querySelector(`.lh-ka-over`);
  if (!i10) return;
  let a10 = Number(e17.dataset.s || 1), o10 = ``;
  if (n10.card === `count`) o10 = `<div class="lh-ka-countnote" style="font-size:${I_(34 * a10)}px">${L_(`rec`, 40 * a10)} Gleich geht die Aufnahme los \u2026</div>`;
  else if (n10.card === `nomic`) o10 = `<div class="lh-ka-card" style="font-size:${I_(26 * a10)}px"><div class="lh-ka-cardtitle">Kein Mikrofon</div><p>Das Mikrofon ist nicht erlaubt oder fehlt. Erlaube den Zugriff in den Einstellungen des Browsers und versuche es noch einmal.</p><div class="lh-ka-cardbtns">${Mv(`close`, `check`, `OK`)}</div></div>`;
  else if (n10.card === `list`) {
    let e18 = lv(t10), n11 = cv(t10), i11 = r10.verses > 1 && r10.verses <= 20 ? `<div class="lh-ka-cardsub">Diese Strophen singen wir:</div><div class="lh-ka-verses">${Array.from({ length: r10.verses }, (e19, t11) => t11 + 1).map((e19) => `<div class="lh-key lh-ka-vchip${n11.has(e19) ? `` : ` is-on`}" data-a="v:${e19}" role="button" aria-pressed="${!n11.has(e19)}" aria-label="Strophe ${e19}"><i class="lh-kdown"></i>${n11.has(e19) ? `` : L_(`check`, 22)}<span>${e19}</span></div>`).join(``)}</div><div class="lh-ka-cardsub">Wohin springen?</div>` : ``, s11 = r10.sections.filter((t11) => e18[t11.start]).slice(0, 40).map((e19) => {
      let t11 = r10.slots[e19.start], n12 = t11 ? t11.kind === `inst` ? x_(r10, e19.start) : E_(t11.text) : ``;
      return `<div class="lh-key lh-ka-sec${e19.kind === `refrain` ? ` is-refrain` : ``}" data-a="go:${e19.start}" role="button" aria-label="${F_(e19.label)}"><i class="lh-kdown"></i><b>${F_(e19.label)}</b><span>${F_(n12)}</span></div>`;
    }).join(``);
    o10 = `<div class="lh-ka-card is-list" style="font-size:${I_(22 * a10)}px"><div class="lh-ka-cardtitle">${i11 ? `Strophen` : `Wohin springen?`}</div>${i11}<div class="lh-ka-secs">${s11}</div><div class="lh-ka-cardbtns">${Mv(`close`, `close`, `Schlie\xDFen`)}</div></div>`;
  } else if (n10.card === `end`) {
    let e18 = [], t11 = ``;
    n10.take && (e18.push(`Eure Aufnahme ist fertig (${Av(n10.take.dur)}).`), t11 += Mv(`listen`, `listen`, `Anh\xF6ren`) + Mv(`save`, `save`, `Speichern`), Dv && (t11 += Mv(`use`, `music`, `Als Musik des Lieds`))), n10.handDone && (e18.push(`Zeitplan aufgenommen: ${n10.handDone.marks.filter(([, e19]) => e19 >= 0).length} Zeilen in ${Av(n10.handDone.end)}.`), t11 += Mv(`timing`, `check`, `Zeitplan merken`, ` is-main`)), t11 += Mv(`close`, `close`, `Schlie\xDFen`), o10 = `<div class="lh-ka-card" style="font-size:${I_(26 * a10)}px"><div class="lh-ka-cardtitle">Geschafft!</div>${e18.map((e19) => `<p>${F_(e19)}</p>`).join(``)}<div class="lh-ka-cardbtns">${t11}</div></div>`;
  }
  let s10 = `${n10.card}|${n10.count}|${!!n10.take}|${!!n10.handDone}|${[...cv(t10)].join(`,`)}`;
  i10.dataset.k !== s10 && (i10.dataset.k = s10, i10.innerHTML = o10, i10.classList.toggle(`is-open`, !!o10), o10 && Iie(e17));
}
function Iie(e17) {
  let t10 = e17.closest(`.lh-instrument`), n10 = !!t10 && Ti(t10);
  e17.querySelectorAll(`.lh-ka-over .lh-key[data-a]`).forEach((e18) => {
    e18.setAttribute(`tabindex`, n10 ? `0` : `-1`);
  });
}
function Nv(e17) {
  let t10 = iv(e17), n10 = sv(e17), r10 = ov(e17), i10 = mv(e17), a10 = dv(e17), o10 = fv(t10);
  for (let s10 of rv.get(e17) ?? []) {
    let c10 = s10.querySelector(`.lh-ka`);
    if (!c10) continue;
    (t10.mode === `auto` || t10.listen) && Pie(c10, n10, i10, uv(e17));
    let l10 = c10.querySelector(`.lh-ka-fill`), u10 = i10.code === -3 ? 1 : i10.code === -1 ? 0 : i10.p ?? 0;
    l10 && (l10.style.width = `${Math.round(Math.min(1, Math.max(0, u10)) * 1e3) / 10}%`);
    let d10 = c10.querySelector(`.lh-ka-time`);
    if (d10) {
      let e18 = t10.listen && t10.take ? t10.take.dur : t10.el && Number.isFinite(t10.el.duration) ? t10.el.duration * 1e3 : t10.mode === `auto` ? a10.end : 0, n11 = t10.phase === `idle` && !t10.listen ? e18 ? Av(e18) : `` : e18 ? `${Av(o10)} / ${Av(e18)}` : Av(o10);
      d10.textContent !== n11 && (d10.textContent = n11);
    }
    let f10 = i10.next !== null && yv(t10) && (t10.mode === `auto` || t10.listen) ? i10.next : null, p10 = f10 !== null && f10 > 0 && f10 <= 3 * $_ ? Math.ceil(f10 / $_) : 0;
    c10.classList.toggle(`is-intro`, i10.code === -1 && t10.phase !== `idle` && (t10.mode === `auto` || !!t10.listen)), c10.classList.toggle(`is-counting`, p10 > 0), c10.classList.toggle(`is-cue`, p10 === 1);
    let m10 = c10.querySelector(`.lh-ka-cd`);
    if (m10 && m10.dataset.n !== String(p10) && (m10.dataset.n = String(p10), m10.textContent = p10 ? String(p10) : ``, m10.classList.remove(`is-beat`), p10 && (m10.offsetWidth, m10.classList.add(`is-beat`))), r10.follow && i10.code >= 0 && i10.p !== null && (t10.mode === `auto` || t10.listen)) {
      let e18 = c10.querySelector(`.lh-ka-l[data-i="${i10.code}"]`);
      if (e18) {
        let t11 = [...e18.querySelectorAll(`.lh-ka-w`)], n11 = t11.reduce((e19, t12) => e19 + Number(t12.dataset.n || 1), 0), r11 = 0, a11 = 0;
        for (let e19 of t11) r11 / Math.max(1, n11) <= i10.p * 1.04 && a11++, r11 += Number(e19.dataset.n || 1);
        e18.dataset.sung !== String(a11) && (e18.dataset.sung = String(a11), t11.forEach((e19, t12) => e19.classList.toggle(`is-sung`, t12 < a11)));
      }
    }
  }
}
var Lie = /* @__PURE__ */ new WeakSet();
var Rie = Ti;
function zie(e17) {
  Lie.has(e17) || (Lie.add(e17), e17.addEventListener(`pointerdown`, (t10) => {
    let n10 = t10.target.closest?.(`.lh-ka-track`);
    if (!n10 || !e17.contains(n10) || t10.button > 0 || !Rie(e17)) return;
    let r10 = e17.dataset.karaokeId;
    if (!r10) return;
    t10.preventDefault();
    let i10 = { x: t10.clientX, y: t10.clientY, pid: t10.pointerId }, a10 = (e18) => {
      if (e18.pointerId !== i10.pid || (window.removeEventListener(`pointerup`, a10, true), window.removeEventListener(`pointercancel`, a10, true), e18.type !== `pointerup`)) return;
      let t11 = e18.clientX - i10.x, n11 = e18.clientY - i10.y;
      Math.abs(t11) > 40 && Math.abs(t11) > Math.abs(n11) * 1.2 && hie(r10, t11 > 0 ? 1 : -1);
    };
    window.addEventListener(`pointerup`, a10, true), window.addEventListener(`pointercancel`, a10, true);
  }));
}
var Pv = /* @__PURE__ */ new WeakSet();
function Bie(e17, t10, n10, r10) {
  let i10 = p_(t10.karaoke), a10 = Math.max(1, Math.round(t10.w)), o10 = Math.max(1, Math.round(t10.h));
  r10.assets && nv.set(t10.id, r10.assets);
  let s10 = r10.assets ?? nv.get(t10.id) ?? {}, c10 = `${a10}x${o10}|${n10}|${JSON.stringify(t10.karaoke ?? null)}|${Object.keys(s10).length}`;
  if (e17.dataset.k === c10) return;
  e17.dataset.k = c10, e17.setAttribute(`aria-label`, Gie(t10));
  let l10 = rie(i10, a10, o10, s10, r10.assetUrl, r10.stickerUrl), u10 = B_(i10.font);
  if (u10 && !Pv.has(e17) && (Pv.add(e17), u10.then(() => {
    Pv.delete(e17), delete e17.dataset.k, Bie(e17, n10 ? tv.get(t10.id) ?? t10 : t10, n10, r10);
  })), !n10) {
    e17.innerHTML = Q_(l10);
    return;
  }
  let d10 = tv.get(t10.id);
  tv.set(t10.id, t10), d10 && JSON.stringify(d10.karaoke) !== JSON.stringify(t10.karaoke) && Vie(t10.id, true);
  let f10 = rv.get(t10.id);
  f10 || rv.set(t10.id, f10 = /* @__PURE__ */ new Set());
  for (let e18 of f10) e18.isConnected || f10.delete(e18);
  f10.add(e17), e17.dataset.karaokeId = t10.id, e17.innerHTML = Z_(l10);
  let p10 = e17.querySelector(`.lh-ka`);
  p10 && (p10.dataset.s = String(l10.s)), t10.locked && e17.classList.add(`is-armed`), zie(e17), Si(e17, { slide: false, silent: true, hit: (t11) => {
    let n11 = e17.dataset.karaokeId, r11 = t11.getAttribute(`data-a`);
    if (!n11 || !r11) return null;
    let i11 = false;
    return { release: () => {
      i11 || (i11 = true, pi(), kv(n11, r11));
    } };
  } }), requestAnimationFrame(() => jv(t10.id));
}
function Vie(e17, t10 = false) {
  let n10 = ev.get(e17);
  if (n10) {
    clearTimeout(n10.timer), cancelAnimationFrame(n10.raf), n10.recording && wv(e17), Ev(n10), gv(n10), t10 || Tv(n10), n10.phase = `idle`, n10.pos = 0, n10.slot = -1, n10.events = [], n10.timing = void 0, n10.handDone = void 0, n10.skip = null, n10.card = n10.take && t10 ? n10.card : ``, n10.mode = ov(e17).mode;
    for (let t11 of rv.get(e17) ?? []) t11.querySelector(`.lh-ka`)?.removeAttribute(`data-shown`);
  }
}
function Gie(e17) {
  return `Karaoke-Liedblatt: ${p_(e17.karaoke).title}. Tippe auf Start und sing mit.`;
}
function Kie(e17) {
  let t10 = [];
  for (let n11 of e17.replace(/\r/g, ``).split(`
`)) {
    let e18 = [...n11.matchAll(/\[(\d{1,3}):(\d{1,2}(?:[.,]\d{1,3})?)\]/g)];
    if (!e18.length) continue;
    let r11 = n11.replace(/\[[^\]]*\]/g, ``).trim();
    for (let n12 of e18) t10.push([Math.round((Number(n12[1]) * 60 + Number(n12[2].replace(`,`, `.`))) * 1e3), r11]);
  }
  if (!t10.length) return null;
  t10.sort((e18, t11) => e18[0] - t11[0]);
  let n10 = [], r10 = [];
  for (let [e18, i11] of t10) i11 ? (r10.push([e18, n10.length]), n10.push(i11)) : n10.length && r10.push([e18, -1]);
  let i10 = t10[t10.length - 1][0] + 4e3;
  r10.length && r10[r10.length - 1][1] === -1 && (i10 = r10.pop()[0]);
  let a10 = n10.join(`
`);
  return { text: a10, timing: r10.length ? { marks: r10, end: i10, n: b_(a10, 1).slots.length } : void 0 };
}
function qie(e17) {
  let t10 = b_(e17.text, e17.repeat), n10 = e17.timing && e17.timing.n === t10.slots.length ? e17.timing : null, r10 = (e18) => {
    let t11 = e18 / 1e3;
    return `[${String(Math.floor(t11 / 60)).padStart(2, `0`)}:${(t11 % 60).toFixed(2).padStart(5, `0`)}]`;
  }, i10 = [`[ti:${e17.title}]`, ...e17.credit ? [`[au:${e17.credit}]`] : []];
  if (!n10) {
    let n11 = [], a10 = e17.intro * 1e3;
    return t10.slots.forEach((t11) => {
      n11.push(r10(a10) + (t11.kind === `inst` ? `` : E_(t11.text))), a10 += e17.secs * 1e3 * (t11.kind === `inst` ? t11.factor : 1);
    }), [...i10, ...n11, r10(a10)].join(`
`);
  }
  return [...i10, ...n10.marks.map(([e18, n11]) => r10(e18) + (n11 >= 0 && t10.slots[n11]?.kind === `line` ? E_(t10.slots[n11].text) : ``)), r10(n10.end)].join(`
`);
}
var Jie = `
.lh-ka{position:relative;box-sizing:border-box;overflow:hidden;color:var(--ka-text);user-select:none;-webkit-user-select:none;line-height:1.25}
.lh-ka *{box-sizing:border-box}
.lh-ka-bg{position:absolute;left:0;top:0;display:block;pointer-events:none}
.lh-ka-head{position:absolute;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;pointer-events:none}
.lh-ka-plate{display:flex;flex-direction:column;gap:2px;max-width:100%;background:rgba(255,255,255,.8);box-shadow:0 2px 10px rgba(0,0,0,.12)}
.lh-ka-title{color:var(--ka-ptitle);font-weight:700;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lh-ka-credit{color:#374151;font-family:${P_};line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lh-ka-badge{position:absolute;padding:.12em .7em;border-radius:99px;background:var(--ka-accent);color:var(--ka-playtext);font-family:${P_};font-weight:800;line-height:1.3;pointer-events:none;transform:translateY(-50%)}
.lh-ka-badge:empty{display:none}
.lh-ka-badge.is-refrain{background:var(--ka-title)}
.lh-ka-area{position:absolute;overflow:hidden;pointer-events:none}
.lh-ka-l{position:absolute;left:0;right:0;top:110%;display:flex;flex-direction:column;align-items:center;text-align:center;transform:translateY(-50%) scale(.82);opacity:0;visibility:hidden;transition:top .55s ease,transform .55s ease,opacity .55s ease,visibility 0s linear .55s;text-shadow:var(--ka-glow)}
.lh-ka-lt{max-width:100%;text-wrap:balance;line-height:1.25}
.lh-ka-l.is-cur{top:38%;transform:translateY(-50%) scale(1);opacity:1;visibility:visible;transition:top .55s ease,transform .55s ease,opacity .55s ease,visibility 0s}
.lh-ka-l.is-cur.is-wait{opacity:.8}
.lh-ka-l.is-next{top:80%;transform:translateY(-50%) scale(.8);opacity:.34;visibility:visible;transition:top .55s ease,transform .55s ease,opacity .55s ease,visibility 0s}
.lh-ka-l.is-prev{top:-6%;transform:translateY(-50%) scale(.8);opacity:0;visibility:visible}
.lh-ka-l.is-gone{top:-30%}
.lh-ka-l.is-inst{flex-direction:row;justify-content:center;gap:.4em;font-family:${P_};font-style:italic;color:var(--ka-soft)}
.lh-ka-l.is-inst svg{flex:none}
.lh-ka-role{display:block;font-family:${P_};font-weight:800;line-height:1.2;margin-bottom:.15em}
.lh-ka-g{white-space:nowrap}
.lh-ka-w{display:inline-block;transition:color .25s}
.lh-ka-bl{white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.lh-ka-w.has-pic{position:relative;text-align:center}
.lh-ka-w.has-pic img{position:absolute;top:0;left:0;right:0;margin:0 auto}
.lh-ka-w img{display:block;object-fit:contain;pointer-events:none;border-radius:8%}
.lh-ka.is-dark .lh-ka-w img{background:#fff;padding:3%}
.lh-ka-w.is-pic{vertical-align:middle;margin:0 .05em}
.lh-ka.is-follow .lh-ka-l.is-cur .lh-ka-w.is-sung{color:var(--ka-accent)}
.lh-ka.is-follow.is-syl .lh-ka-l.is-cur .lh-ka-w.is-sung{color:inherit;text-decoration:underline;text-decoration-color:var(--ka-accent);text-decoration-thickness:.09em;text-underline-offset:.14em}
.lh-ka-mark{position:absolute;left:0;right:0;top:38%;transform:translateY(-50%);text-align:center;color:var(--ka-soft);font-family:${P_};opacity:0;transition:opacity .4s}
.lh-ka-mark.is-on{opacity:.75}
.lh-ka.is-intro:not(.is-counting) .lh-ka-mark.is-pre{opacity:.75}
.lh-ka.is-counting .lh-ka-mark{opacity:0}
.lh-ka-cd{position:absolute;left:0;right:0;top:38%;transform:translateY(-50%);text-align:center;font-family:${P_};font-weight:900;line-height:1;color:var(--ka-accent);text-shadow:0 6px 24px rgba(0,0,0,.35);pointer-events:none}
.lh-ka-cd.is-beat{animation:lh-ka-beat .9s ease-out both}
@keyframes lh-ka-beat{0%{opacity:0;transform:translateY(-50%) scale(1.5)}25%{opacity:1;transform:translateY(-50%) scale(1)}80%{opacity:1}100%{opacity:.25;transform:translateY(-50%) scale(.9)}}
.lh-ka.is-counting .lh-ka-l.is-cur.is-inst{opacity:0}
.lh-ka.is-intro .lh-ka-l{opacity:0 !important;transition:opacity .25s}
.lh-ka.is-intro.is-cue .lh-ka-l.is-cur{opacity:1 !important;transition:opacity 1s ease-in}
.lh-ka.is-intro.is-cue .lh-ka-l.is-next{opacity:.34 !important;transition:opacity 1s ease-in}
.lh-ka-empty{position:absolute;left:0;right:0;top:40%;text-align:center;color:var(--ka-soft);font-family:${P_}}
.lh-ka-bar{position:absolute}
.lh-ka-status,.lh-ka-time{position:absolute;top:0;font-family:${P_};font-weight:700;color:var(--ka-soft);white-space:nowrap;line-height:1.3;pointer-events:none}
.lh-ka-status{left:0;max-width:62%;overflow:hidden;text-overflow:ellipsis}
.lh-ka-time{font-variant-numeric:tabular-nums;right:var(--trA)}
.lh-ka.is-hand .lh-ka-time{right:var(--trH)}
.lh-ka.is-recording .lh-ka-status{color:#ef4444}
.lh-ka-track{position:absolute;left:0;right:var(--trA);display:flex;align-items:center;cursor:pointer;touch-action:none}
.lh-ka.is-hand .lh-ka-track{right:var(--trH)}
.lh-ka-rail{position:relative;width:100%;border-radius:99px;background:var(--ka-rail);overflow:hidden;pointer-events:none}
.lh-ka-fill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:99px;background:var(--ka-accent)}
.lh-ka.is-hand .lh-ka-fill{opacity:.4}
.lh-ka-ctls{position:absolute;right:0;top:0;display:flex;align-items:flex-start}
.lh-ka-ctl{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;flex:none}
.lh-ka-ctl.is-gap{display:none}
.lh-ka.is-hand .lh-ka-ctl.is-gap{display:flex}
.lh-ka-round{position:relative;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--ka-btn);color:var(--ka-btntext);border:2px solid var(--ka-btnline);box-shadow:0 4px 0 rgba(0,0,0,.25);overflow:hidden}
.lh-ka-ctl.is-next .lh-ka-round{background:var(--ka-accent);color:var(--ka-playtext);border-color:transparent}
.lh-ka-ctl.is-pause.is-on .lh-ka-round{background:var(--ka-play);color:var(--ka-playtext);border-color:transparent}
.lh-ka-round svg{display:block}
.lh-ka-round .lh-kdown{border-radius:50%}
.lh-ka-cl{font-family:${P_};font-weight:800;color:var(--ka-soft);white-space:nowrap;line-height:1.1;pointer-events:none}
.lh-ka .lh-key.lh-ka-ctl.is-down{transform:none}
.lh-ka .lh-key.lh-ka-ctl.is-down .lh-ka-round{transform:translateY(2px)}
.lh-instrument .lh-key.lh-ka-ctl.is-down .lh-kdown{opacity:.24}
.lh-ka .lh-kdown{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;transition:opacity .08s}
.lh-ka .lh-key.is-down{transform:translateY(2px)}
.lh-ka-panel{position:absolute;display:flex;flex-direction:column;border-radius:26px;background:var(--ka-panel)}
.lh-ka-btn{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4%;flex:none;border-radius:20px;background:var(--ka-btn);color:var(--ka-btntext);border:2px solid var(--ka-btnline);box-shadow:0 3px 0 rgba(0,0,0,.2);font-family:${P_};font-weight:800;line-height:1.1;text-align:center;overflow:hidden}
.lh-ka-btn svg{display:block}
.lh-ka-btn.is-play{background:var(--ka-play);color:var(--ka-playtext);border-color:transparent}
.lh-ka-btn.is-rec svg{color:#ef4444}
.lh-ka.is-recording .lh-ka-btn.is-rec{background:#ef4444;color:#fff;border-color:#b91c1c;animation:lh-ka-pulse 1.2s ease-in-out infinite}
.lh-ka.is-recording .lh-ka-btn.is-rec svg{color:#fff}
.lh-ka-btn.is-on{border-color:var(--ka-accent);box-shadow:0 0 0 3px var(--ka-accent)}
.lh-ka-over{position:absolute;inset:0;display:none;align-items:center;justify-content:center;flex-direction:column;background:rgba(0,0,0,.35);pointer-events:auto}
.lh-ka-over.is-open{display:flex}
.lh-ka-count{font-family:${P_};font-weight:900;color:#fff;line-height:1;text-shadow:0 6px 30px rgba(0,0,0,.5);animation:lh-ka-pop .9s ease-out}
.lh-ka-countnote{display:flex;align-items:center;gap:.4em;padding:.5em 1em;border-radius:20px;background:var(--ka-card);color:var(--ka-cardtext);font-family:${P_};font-weight:800}
.lh-ka-countnote svg{color:#ef4444}
.lh-ka-card{max-width:78%;max-height:88%;display:flex;flex-direction:column;gap:.5em;padding:1em 1.3em;border-radius:24px;background:var(--ka-card);color:var(--ka-cardtext);font-family:${P_};box-shadow:0 20px 60px rgba(0,0,0,.35);animation:lh-ka-in .35s cubic-bezier(.3,1.4,.5,1)}
.lh-ka-card p{margin:0;line-height:1.35}
.lh-ka-cardtitle{font-size:1.3em;font-weight:900}
.lh-ka-cardbtns{display:flex;flex-wrap:wrap;gap:.5em;margin-top:.4em}
.lh-ka-cbtn{position:relative;display:flex;align-items:center;gap:.45em;padding:.55em 1em;border-radius:16px;background:#f1f3f5;color:#212529;font-weight:800;overflow:hidden;min-height:2.6em}
.lh-ka-cbtn.is-main{background:#2f9e44;color:#fff}
.lh-ka-cbtn[data-a="listen"]{background:#1c7ed6;color:#fff}
.lh-ka-card.is-list{width:78%}
.lh-ka-cardsub{font-weight:800;opacity:.75;margin-top:.2em}
.lh-ka-verses{display:flex;flex-wrap:wrap;gap:.4em}
.lh-ka-vchip{position:relative;display:flex;align-items:center;justify-content:center;gap:.2em;min-width:2.6em;height:2.4em;padding:0 .7em;border-radius:99px;background:#f1f3f5;color:#868e96;font-weight:900;font-size:1.1em;overflow:hidden;text-decoration:line-through}
.lh-ka-vchip.is-on{background:#2f9e44;color:#fff;text-decoration:none}
.lh-ka-secs{display:grid;grid-template-columns:1fr 1fr;gap:.4em;overflow:auto;min-height:0}
.lh-ka-sec{position:relative;display:flex;flex-direction:column;gap:.1em;padding:.6em .8em;border-radius:14px;background:#f1f3f5;color:#212529;overflow:hidden;font-size:1.1em}
.lh-ka-sec b{font-weight:900}
.lh-ka-sec span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.75}
.lh-ka-sec.is-refrain{background:#fff3bf}
.lh-ka.is-sheet .lh-ka-scol{position:absolute;line-height:1.3}
.lh-ka-sb{position:relative}
.lh-ka-sno{position:absolute;left:0;top:0;font-weight:700;color:var(--ka-accent)}
.lh-ka-shead{margin-left:-1.6em;font-family:${P_};font-weight:800;font-size:.8em;color:var(--ka-accent)}
.lh-ka-sb.is-refrain .lh-ka-sl{font-style:italic}
.lh-ka-sl{line-height:1.3;text-wrap:balance;padding-left:.9em;text-indent:-.9em}
.lh-ka-sl .lh-ka-w{text-indent:0}
.lh-ka-sl.is-ref{font-family:${P_};font-style:italic;font-weight:700;font-size:.8em;color:var(--ka-accent)}
.lh-ka-sl.is-inst{font-family:${P_};font-style:italic;font-size:.8em;color:var(--ka-soft)}
.lh-ka-srole{font-family:${P_};font-weight:800;font-size:.8em}
.lh-edit .lh-wg-karaoke:not(.is-armed) .lh-key,.lh-edit .lh-wg-karaoke:not(.is-armed) .lh-ka-track{cursor:inherit}
@keyframes lh-ka-pulse{50%{box-shadow:0 0 0 6px rgba(239,68,68,.35)}}
@keyframes lh-ka-pop{from{transform:scale(1.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes lh-ka-in{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}
@media (prefers-reduced-motion:reduce){.lh-ka-l{transition:opacity .2s,visibility 0s linear .2s}.lh-ka-l.is-cur,.lh-ka-l.is-next{transition:opacity .2s}.lh-ka-count,.lh-ka-card,.lh-ka-cd.is-beat{animation:none}.lh-ka.is-recording .lh-ka-btn.is-rec{animation:none}}`;
var Dce = 1300;
var hE = 700;
var Oce = `Andika, Andika, Verdana, Arial, sans-serif`;
var gE = (e17) => Math.round(e17 * 10) / 10;
var kce = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var Ace = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
var _E = (e17, t10, n10, r10, i10) => i10 ? `<text x="${gE(e17)}" y="${gE(t10)}" font-size="${gE(n10)}" font-family="${Oce}" font-weight="700" text-anchor="middle" fill="${r10}">${Ace(i10)}</text>` : ``;
var vE = (e17, t10, n10, r10) => `<circle cx="${gE(e17)}" cy="${gE(t10)}" r="${gE(n10)}" ${r10}/>`;
var yE = (e17, t10, n10, r10, i10, a10) => `<rect x="${gE(e17)}" y="${gE(t10)}" width="${gE(n10)}" height="${gE(r10)}" rx="${gE(i10)}" ${a10}/>`;
var bE = `class="lh-kdown" fill="#000000" opacity="0"`;
var xE = (e17, t10, n10, r10 = ``) => `<g class="lh-key" ${e17}>${t10}${n10}${r10}</g>`;
var SE = (e17, t10, n10, r10 = ``) => xE(`data-d="${e17}"`, t10, n10, r10);
function CE(e17, t10, n10, r10, i10, a10) {
  let o10 = vE(t10, n10, r10, `fill="${i10}" stroke="#1f2937" stroke-width="4"`) + vE(t10, n10, r10 * 0.86, `fill="#f8f5ee"`) + vE(t10, n10, r10 * 0.68, `fill="none" stroke="#e7e1d3" stroke-width="3"`);
  for (let e18 = 0; e18 < 8; e18++) {
    let i11 = e18 / 8 * Math.PI * 2;
    o10 += vE(t10 + Math.cos(i11) * r10 * 0.93, n10 + Math.sin(i11) * r10 * 0.93, r10 * 0.05, `fill="#dee2e6" stroke="#868e96" stroke-width="2"`);
  }
  return SE(e17, o10, vE(t10, n10, r10, bE), a10 ? _E(t10, n10 + r10 * 0.1, Math.min(44, r10 * 0.26), `#7c2d12`, Fo[e17]) : ``);
}
function wE(e17, t10, n10, r10, i10, a10 = Fo[e17]) {
  return SE(e17, vE(t10, n10, r10, `fill="#f0c14b" stroke="#a67c1a" stroke-width="4"`) + vE(t10, n10, r10 * 0.75, `fill="none" stroke="#c9962b" stroke-width="3" opacity="0.6"`) + vE(t10, n10, r10 * 0.52, `fill="none" stroke="#c9962b" stroke-width="3" opacity="0.6"`) + vE(t10, n10, r10 * 0.22, `fill="#d9a836" stroke="#a67c1a" stroke-width="2"`) + vE(t10, n10, r10 * 0.05, `fill="#5c4310"`), vE(t10, n10, r10, bE), i10 ? _E(t10, n10 + r10 * 0.62, Math.min(40, r10 * 0.22), `#5c4310`, a10) : ``);
}
function jce(e17) {
  let t10 = e17.labels;
  return yE(20, 20, 1260, 660, 60, `fill="#7f1d1d"`) + yE(44, 44, 1212, 612, 44, `fill="none" stroke="#991b1b" stroke-width="6" stroke-dasharray="2 14" stroke-linecap="round"`) + CE(`kick`, 630, 500, 175, `#b91c1c`, t10) + CE(`tom1`, 500, 215, 88, `#b91c1c`, t10) + CE(`tom2`, 760, 215, 92, `#b91c1c`, t10) + CE(`floortom`, 960, 500, 120, `#b91c1c`, t10) + CE(`snare`, 330, 500, 105, `#adb5bd`, t10) + wE(`hihat`, 120, 420, 95, t10) + wE(`crash`, 230, 140, 110, t10) + wE(`ride`, 1110, 190, 125, t10);
}
function Mce(e17) {
  let t10 = e17.labels, n10 = ``, r10 = (e18) => `<ellipse cx="220" cy="380" rx="95" ry="125" ${e18}/>`;
  n10 += SE(`shaker`, r10(`fill="#fab005" stroke="#e67700" stroke-width="6"`) + `<ellipse cx="190" cy="330" rx="30" ry="50" fill="#ffffff" opacity="0.35"/>` + [0, 1, 2, 3, 4].map((e18) => vE(190 + e18 % 3 * 30, 400 + Math.floor(e18 / 3) * 34, 6, `fill="#e67700" opacity="0.6"`)).join(``), r10(bE), t10 ? _E(220, 560, 40, `#7a4b00`, Fo.shaker) : ``), n10 += yE(430, 50, 440, 620, 20, `fill="#8a5a2b"`), n10 += SE(`cajonSlap`, yE(448, 68, 404, 170, 8, `fill="#efc28a"`), yE(448, 68, 404, 170, 8, bE), t10 ? _E(650, 168, 44, `#6b4423`, `Slap`) : ``);
  let i10 = ``;
  for (let e18 = 0; e18 < 6; e18++) i10 += `<path d="M${500 + e18 * 62} 250C${520 + e18 * 62} 380 ${470 + e18 * 62} 500 ${505 + e18 * 62} 645" fill="none" stroke="#c98b4b" stroke-width="3" opacity="0.5"/>`;
  n10 += SE(`cajonBass`, yE(448, 238, 404, 414, 8, `fill="#e3ad70"`) + i10, yE(448, 238, 404, 414, 8, bE), t10 ? _E(650, 470, 50, `#6b4423`, `Bass`) : ``);
  for (let [e18, t11] of [[458, 78], [842, 78], [458, 642], [842, 642]]) n10 += vE(e18, t11, 6, `fill="#5c3a1e"`);
  let a10 = (e18) => vE(1080, 380, 130, e18), o10 = (e18) => `<g transform="rotate(${e18} 1080 400)"><ellipse cx="1080" cy="400" rx="34" ry="60" fill="#fff5f5" stroke="#c92a2a" stroke-width="4"/><path d="M1060 350v-32M1072 345v-40M1084 345v-42M1096 350v-36" stroke="#c92a2a" stroke-width="10" stroke-linecap="round"/><path d="M1060 350v-32M1072 345v-40M1084 345v-42M1096 350v-36" stroke="#fff5f5" stroke-width="5" stroke-linecap="round"/></g>`;
  return n10 += SE(`clap`, a10(`fill="#ffc9c9" stroke="#f03e3e" stroke-width="6"`) + o10(-18) + o10(18) + `<path d="M990 300l-22-18M1170 300l22-18M1080 270v-26" stroke="#f03e3e" stroke-width="6" stroke-linecap="round"/>`, a10(bE), t10 ? _E(1080, 560, 40, `#a61e4d`, Fo.clap) : ``), n10;
}
function TE(e17, t10, n10, r10, i10, a10, o10, s10, c10) {
  let l10 = n10 + a10, u10 = s10 ? `M${t10 - r10} ${n10}C${t10 - r10 * 1.25} ${n10 + a10 * 0.35} ${t10 - r10 * 0.9} ${n10 + a10 * 0.8} ${t10 - r10 * 0.7} ${l10}L${t10 + r10 * 0.7} ${l10}C${t10 + r10 * 0.9} ${n10 + a10 * 0.8} ${t10 + r10 * 1.25} ${n10 + a10 * 0.35} ${t10 + r10} ${n10}Z` : `M${t10 - r10} ${n10}L${t10 - r10 * 0.85} ${l10}Q${t10} ${l10 + i10 * 0.8} ${t10 + r10 * 0.85} ${l10}L${t10 + r10} ${n10}Z`, d10 = ``;
  for (let e18 = 1; e18 < 5; e18++) {
    let a11 = t10 - r10 + 2 * r10 * e18 / 5;
    d10 += `<path d="M${gE(a11)} ${n10 + i10}L${gE(t10 + (a11 - t10) * (s10 ? 0.7 : 0.85))} ${l10}" stroke="#000000" stroke-width="3" opacity="0.15"/>`;
  }
  let f10 = (e18, n11) => `<path d="M${gE(t10 - r10 * n11)} ${gE(e18)}Q${t10} ${gE(e18 + i10 * 1.6)} ${gE(t10 + r10 * n11)} ${gE(e18)}" fill="none" stroke="#495057" stroke-width="7"/>`;
  return SE(e17, `<ellipse cx="${t10}" cy="${gE(l10 + 8)}" rx="${gE(r10 * 0.9)}" ry="${gE(i10 * 0.5)}" fill="#000000" opacity="0.12"/><path d="${u10}" fill="${o10}" stroke="#3d2412" stroke-width="4" stroke-linejoin="round"/>` + d10 + f10(n10 + i10 * 0.4, 1.02) + f10(l10 - a10 * 0.08, s10 ? 0.74 : 0.87) + `<ellipse cx="${t10}" cy="${n10}" rx="${r10}" ry="${i10}" fill="#f3e2c0" stroke="#6b4423" stroke-width="5"/>`, `<g ${bE}><path d="${u10}"/><ellipse cx="${t10}" cy="${n10}" rx="${r10}" ry="${i10}"/></g>`, c10 ? _E(t10, n10 + a10 * 0.6, Math.min(40, r10 * 0.3), `#fff3e0`, Fo[e17]) : ``);
}
function Nce(e17) {
  let t10 = e17.labels;
  return yE(325, 330, 32, 70, 8, `fill="#5c3a1e"`) + TE(`bongoHigh`, 230, 300, 105, 38, 160, `#a0522d`, false, t10) + TE(`bongoLow`, 470, 290, 125, 44, 175, `#8b4513`, false, t10) + TE(`congaHigh`, 820, 190, 120, 42, 470, `#a0522d`, true, t10) + TE(`congaLow`, 1080, 210, 135, 48, 460, `#8b4513`, true, t10);
}
function EE(e17) {
  let t10 = Math.max(1, Math.ceil(e17 / 4)), n10 = Math.min(310, (650 - (t10 - 1) * 30) / t10), r10 = (hE - (t10 * n10 + (t10 - 1) * 30)) / 2;
  return Array.from({ length: e17 }, (e18, t11) => ({ x: 25 + t11 % 4 * 320, y: r10 + Math.floor(t11 / 4) * (n10 + 30), w: 290, h: n10 }));
}
var DE = [{ id: `handdrum`, color: `#e8590c`, icon: (e17, t10, n10) => vE(e17, t10, 90 * n10, `fill="#f6e7c8" stroke="#b07d4f" stroke-width="${gE(16 * n10)}"`) + Array.from({ length: 12 }, (r10, i10) => vE(e17 + Math.cos(i10 / 12 * 6.283) * 90 * n10, t10 + Math.sin(i10 / 12 * 6.283) * 90 * n10, 4 * n10, `fill="#868e96"`)).join(``) }, { id: `triangle`, color: `#1098ad`, icon: (e17, t10, n10) => `<path d="M${gE(e17 + 70 * n10)} ${gE(t10 + 70 * n10)}H${gE(e17 - 80 * n10)}L${gE(e17)} ${gE(t10 - 80 * n10)}L${gE(e17 + 74 * n10)} ${gE(t10 + 52 * n10)}" fill="none" stroke="#868e96" stroke-width="${gE(12 * n10)}" stroke-linecap="round" stroke-linejoin="round"/><path d="M${gE(e17)} ${gE(t10 - 80 * n10)}v${gE(-26 * n10)}" stroke="#495057" stroke-width="${gE(4 * n10)}"/><path d="M${gE(e17 + 40 * n10)} ${gE(t10 - 10 * n10)}l${gE(70 * n10)} ${gE(-70 * n10)}" stroke="#495057" stroke-width="${gE(8 * n10)}" stroke-linecap="round"/>` }, { id: `tambourine`, color: `#e64980`, icon: (e17, t10, n10) => vE(e17, t10, 82 * n10, `fill="#f8f0e3" stroke="#c08552" stroke-width="${gE(24 * n10)}"`) + Array.from({ length: 6 }, (r10, i10) => {
  let a10 = i10 / 6 * 6.283 + 0.5;
  return vE(e17 + Math.cos(a10) * 82 * n10, t10 + Math.sin(a10) * 82 * n10, 15 * n10, `fill="#dee2e6" stroke="#868e96" stroke-width="${gE(3 * n10)}"`);
}).join(``) }, { id: `claves`, color: `#a0522d`, icon: (e17, t10, n10) => [-24, 24].map((r10) => `<rect x="${gE(e17 - 100 * n10)}" y="${gE(t10 - 13 * n10)}" width="${gE(200 * n10)}" height="${gE(26 * n10)}" rx="${gE(13 * n10)}" fill="#d9a066" stroke="#8a5a2b" stroke-width="${gE(4 * n10)}" transform="rotate(${r10} ${gE(e17)} ${gE(t10)})"/>`).join(``) }, { id: `shaker`, color: `#f08c00`, icon: (e17, t10, n10) => yE(e17 - 12 * n10, t10 + 30 * n10, 24 * n10, 90 * n10, 10 * n10, `fill="#a0522d"`) + `<ellipse cx="${gE(e17)}" cy="${gE(t10 - 25 * n10)}" rx="${gE(62 * n10)}" ry="${gE(72 * n10)}" fill="#ff922b" stroke="#d9480f" stroke-width="${gE(5 * n10)}"/>` + [-25, 0, 25].map((r10) => vE(e17 + r10 * n10, t10 - 25 * n10 + (r10 ? 18 : -14) * n10, 8 * n10, `fill="#ffd43b"`)).join(``) }, { id: `cymbal`, color: `#d4a017`, icon: (e17, t10, n10) => vE(e17, t10, 90 * n10, `fill="#f0c14b" stroke="#a67c1a" stroke-width="4"`) + vE(e17, t10, 62 * n10, `fill="none" stroke="#c9962b" stroke-width="3" opacity="0.6"`) + vE(e17, t10, 22 * n10, `fill="#d9a836" stroke="#a67c1a" stroke-width="2"`) }, { id: `woodblock`, color: `#7c4a21`, icon: (e17, t10, n10) => yE(e17 - 100 * n10, t10 - 50 * n10, 200 * n10, 100 * n10, 22 * n10, `fill="#c08552" stroke="#7c4a21" stroke-width="${gE(5 * n10)}"`) + yE(e17 - 80 * n10, t10 - 6 * n10, 160 * n10, 12 * n10, 6 * n10, `fill="#5c3a1e"`) + `<path d="M${gE(e17 + 60 * n10)} ${gE(t10 - 60 * n10)}l${gE(60 * n10)} ${gE(-50 * n10)}" stroke="#5c3a1e" stroke-width="${gE(9 * n10)}" stroke-linecap="round"/>` }, { id: `cowbell`, color: `#495057`, icon: (e17, t10, n10) => yE(e17 - 16 * n10, t10 - 100 * n10, 32 * n10, 30 * n10, 8 * n10, `fill="#495057"`) + `<path d="M${gE(e17 - 55 * n10)} ${gE(t10 - 75 * n10)}H${gE(e17 + 55 * n10)}L${gE(e17 + 92 * n10)} ${gE(t10 + 70 * n10)}H${gE(e17 - 92 * n10)}Z" fill="#adb5bd" stroke="#495057" stroke-width="${gE(5 * n10)}" stroke-linejoin="round"/><ellipse cx="${gE(e17)}" cy="${gE(t10 + 70 * n10)}" rx="${gE(92 * n10)}" ry="${gE(14 * n10)}" fill="#495057"/>` }];
function Pce(e17) {
  let t10 = EE(DE.length);
  return DE.map((n10, r10) => {
    let i10 = t10[r10], a10 = Math.min(1, (i10.h - 70) / 240), o10 = (e18) => yE(i10.x, i10.y, i10.w, i10.h, 30, e18);
    return SE(n10.id, o10(`fill="#ffffff" stroke="${n10.color}" stroke-width="6"`) + n10.icon(i10.x + i10.w / 2, i10.y + (i10.h - (e17.labels ? 44 : 0)) / 2, a10), o10(bE), e17.labels ? _E(i10.x + i10.w / 2, i10.y + i10.h - 24, 34, n10.color, Fo[n10.id]) : ``);
  }).join(``);
}
var OE = (e17, t10, n10, r10) => `<g transform="translate(${gE(e17)} ${gE(t10)}) scale(${gE(n10 / 24)})"><rect x="8.5" y="2.5" width="7" height="12.5" rx="3.5" fill="${r10}"/><path d="M5 11.5a7 7 0 0 0 14 0M12 18.5V22M8.5 22h7" fill="none" stroke="${r10}" stroke-width="2" stroke-linecap="round"/></g>`;
function Fce(e17, t10) {
  let n10 = e17.pads ?? [], r10 = EE(n10.length);
  return n10.map((e18, n11) => {
    let i10 = r10[n11], a10 = !!(e18.sound || e18.voice), o10 = (e19) => yE(i10.x, i10.y, i10.w, i10.h, 32, e19), s10 = Ho(e18), c10;
    return c10 = a10 ? o10(`fill="${e18.color}"`) + yE(i10.x + 10, i10.y + 10, i10.w - 20, i10.h * 0.35, 24, `fill="#ffffff" opacity="0.18"`) + (e18.sound ? OE(i10.x + i10.w - 52, i10.y + 16, 34, `#ffffff`) : ``) + _E(i10.x + i10.w / 2, i10.y + i10.h / 2 + 16, Math.min(46, i10.w / Math.max(4, s10.length * 0.62)), `#ffffff`, s10) : o10(`fill="${e18.color}" fill-opacity="0.15" stroke="${e18.color}" stroke-width="5" stroke-dasharray="14 10"`) + (t10 ? OE(i10.x + i10.w / 2 - 30, i10.y + i10.h / 2 - 62, 60, e18.color) + _E(i10.x + i10.w / 2, i10.y + i10.h / 2 + 46, 32, e18.color, s10 || `Aufnehmen`) : _E(i10.x + i10.w / 2, i10.y + i10.h / 2 + 14, 36, e18.color, s10)), xE(`data-p="${n11}"`, c10, o10(bE));
  }).join(``);
}
function Ice(e17, t10, n10, r10 = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Dce} ${hE}" width="${t10}" height="${n10}">${e17.skin === `cajon` ? Mce(e17) : e17.skin === `hand` ? Nce(e17) : e17.skin === `orff` ? Pce(e17) : e17.skin === `pads` ? Fce(e17, r10) : jce(e17)}</svg>`;
}
var kE = /* @__PURE__ */ new WeakMap();
var AE = null;
function Lce(e17) {
  AE = e17;
}
function Rce(e17, t10) {
  let n10 = kE.get(e17), r10 = n10?.it.kit?.pads?.[t10];
  if (!n10 || !r10) return;
  let i10 = r10.sound ? n10.assets[r10.sound] : void 0;
  i10 ? ps(i10.id, i10.dataUrl) : r10.voice ? ls(r10.voice) : AE?.(n10.it.id, t10);
}
function zce(e17, t10, n10, r10) {
  let i10 = t10.kit ?? Vo(`drumset`), a10 = Math.max(1, Math.round(t10.w)), o10 = Math.max(1, Math.round(t10.h));
  kE.set(e17, { it: t10, assets: r10.assets ?? kE.get(e17)?.assets ?? {} });
  let s10 = n10 && !!AE, c10 = `${JSON.stringify(i10)}|${a10}x${o10}|${n10}|${s10}`;
  if (e17.dataset.k === c10) return;
  e17.dataset.k = c10, e17.setAttribute(`aria-label`, Bo(i10.skin));
  let l10 = Ice(i10, a10, o10, s10);
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(l10) : kce(l10), t11.style.width = `${a10}px`, t11.style.height = `${o10}px`, e17.replaceChildren(t11);
    return;
  }
  let u10 = document.createElement(`div`);
  u10.className = `lh-wg-pic`, u10.innerHTML = l10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(u10), t10.locked && e17.classList.add(`is-armed`);
  for (let e18 of i10.pads ?? []) {
    let t11 = e18.sound ? r10.assets?.[e18.sound] : void 0;
    t11 && fs(t11.id, t11.dataUrl);
  }
  Si(e17, { slide: false, hit: (t11) => {
    let n11 = t11.getAttribute(`data-d`);
    n11 && ls(n11);
    let r11 = t11.getAttribute(`data-p`);
    return r11 !== null && Rce(e17, Number(r11)), null;
  } });
}
var fD = `Andika, Andika, Verdana, Arial, sans-serif`;
var ule = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var pD = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
var mD = (e17) => Math.round(e17 * 10) / 10;
var hD = 1300;
var gD = 700;
var dle = 120;
var _D = 240;
function vD(e17) {
  let t10 = Math.max(1, e17.tracks.length), n10 = Math.min(96, 570 / t10);
  return { rowH: n10, cellW: 1050 / e17.steps, y0: dle + (570 - n10 * t10) / 2 };
}
var yD = `#e9ecef`;
var bD = `#dde1e6`;
var xD = (e17, t10, n10, r10) => `<g transform="translate(${mD(e17)} ${mD(t10)}) scale(${mD(n10 / 24)})"><rect x="8.5" y="2.5" width="7" height="12.5" rx="3.5" fill="${r10}"/><path d="M5 11.5a7 7 0 0 0 14 0M12 18.5V22M8.5 22h7" fill="none" stroke="${r10}" stroke-width="2" stroke-linecap="round"/></g>`;
function fle(e17, t10, n10, r10) {
  let i10 = vD(e17), a10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${hD} ${gD}" width="${t10}" height="${n10}">`;
  a10 += `<rect width="${hD}" height="${gD}" rx="34" fill="#ffffff" opacity="0.95" stroke="#dee2e6" stroke-width="3"/>`, a10 += `<g class="lh-key" data-a="play"><circle cx="76" cy="60" r="44" fill="#2f9e44"/><path class="lh-seq-play" d="M62 38L96 60L62 82Z" fill="#ffffff"/><rect class="lh-seq-stop" x="57" y="41" width="38" height="38" rx="6" fill="#ffffff" opacity="0"/><circle class="lh-kdown" cx="76" cy="60" r="44" fill="#000000" opacity="0"/><title>Abspielen / Stopp</title></g>`;
  let o10 = (e18, t11, n11, r11) => `<g class="lh-key" data-a="${e18}"><rect x="${t11}" y="30" width="64" height="60" rx="14" fill="#495057"/>${r11}<rect class="lh-kdown" x="${t11}" y="30" width="64" height="60" rx="14" fill="#000000" opacity="0"/><title>${n11}</title></g>`;
  a10 += o10(`slower`, 150, `Langsamer`, `<path d="M168 60h28" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>`), a10 += `<text class="lh-seq-bpm" x="290" y="58" font-size="40" font-family="${fD}" font-weight="700" text-anchor="middle" fill="#212529">${e17.bpm}</text><text x="290" y="84" font-size="16" font-family="${fD}" font-weight="700" text-anchor="middle" fill="#868e96">Schl\xE4ge / Min.</text>`, a10 += o10(`faster`, 366, `Schneller`, `<path d="M384 60h28M398 46v28" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>`);
  let s10 = (e18, t11) => `<circle cx="${e18}" cy="${t11}" r="5" fill="#212529"/>`;
  a10 += `<g class="lh-key" data-a="dice"><rect x="470" y="30" width="150" height="60" rx="14" fill="#fff3bf" stroke="#f08c00" stroke-width="3"/><rect x="482" y="40" width="40" height="40" rx="8" fill="#ffffff" stroke="#212529" stroke-width="3"/>${s10(492, 50) + s10(512, 50) + s10(502, 60) + s10(492, 70) + s10(512, 70)}<text x="572" y="70" font-size="24" font-family="${fD}" font-weight="700" text-anchor="middle" fill="#a35200">W\xFCrfeln</text><rect class="lh-kdown" x="470" y="30" width="150" height="60" rx="14" fill="#000000" opacity="0"/></g>`;
  let c10 = 640;
  return vl(e17) && (a10 += `<g class="lh-key" data-a="beats"><rect x="${c10}" y="30" width="150" height="60" rx="14" fill="#e7f5ff" stroke="#1c7ed6" stroke-width="3"/><path d="M${c10 + 24} 74V46l22-4v28" fill="none" stroke="#1c7ed6" stroke-width="4" stroke-linejoin="round"/><circle cx="${c10 + 20}" cy="74" r="6" fill="#1c7ed6"/><circle cx="${c10 + 42}" cy="70" r="6" fill="#1c7ed6"/><text x="${c10 + 100}" y="70" font-size="24" font-family="${fD}" font-weight="700" text-anchor="middle" fill="#1864ab">Beats</text><rect class="lh-kdown" x="${c10}" y="30" width="150" height="60" rx="14" fill="#000000" opacity="0"/></g>`, c10 += 166), yl(e17) && (a10 += `<g class="lh-key" data-a="melodies"><rect x="${c10}" y="30" width="176" height="60" rx="14" fill="#f3f0ff" stroke="#7048e8" stroke-width="3"/><path d="M${c10 + 14} 74l12-12 12 6 12-20" fill="none" stroke="#7048e8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${[[14, 74], [26, 62], [38, 68], [50, 48]].map(([e18, t11]) => `<circle cx="${c10 + e18}" cy="${t11}" r="5.5" fill="#7048e8"/>`).join(``)}<text x="${c10 + 116}" y="70" font-size="24" font-family="${fD}" font-weight="700" text-anchor="middle" fill="#5f3dc4">Melodien</text><rect class="lh-kdown" x="${c10}" y="30" width="176" height="60" rx="14" fill="#000000" opacity="0"/></g>`), a10 += `<g class="lh-key" data-a="clear"><rect x="1206" y="30" width="64" height="60" rx="14" fill="#f1f3f5" stroke="#adb5bd" stroke-width="2"/><path d="M1224 46h28M1232 46v-5h12v5M1228 50l2 28h16l2-28" fill="none" stroke="#495057" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect class="lh-kdown" x="1206" y="30" width="64" height="60" rx="14" fill="#000000" opacity="0"/><title>Leeren</title></g>`, e17.tracks.forEach((t11, n11) => {
    let o11 = i10.y0 + n11 * i10.rowH, s11 = !!t11.rec && !t11.sound, c11 = $c(t11, e17.key), l10 = Math.min(30, i10.rowH * 0.38, 190 / Math.max(3, c11.length * 0.58)), u10 = (e18) => `<rect x="14" y="${mD(o11 + 4)}" width="212" height="${mD(i10.rowH - 8)}" rx="14" ${e18}/>`;
    a10 += `<g class="lh-key" data-t="${n11}">${u10(s11 ? `fill="${t11.color}" fill-opacity="0.15" stroke="${t11.color}" stroke-width="3" stroke-dasharray="10 7"` : `fill="${t11.color}"`)}`, a10 += s11 ? (r10 ? xD(30, o11 + i10.rowH / 2 - 14, 28, t11.color) : ``) + `<text x="${r10 ? 70 : _D / 2 - 4}" y="${mD(o11 + i10.rowH / 2 + l10 * 0.35)}" font-size="${mD(r10 ? Math.min(l10, 24) : l10)}" font-family="${fD}" font-weight="700" ${r10 ? `` : `text-anchor="middle" `}fill="${t11.color}">${r10 ? `Aufnehmen` : pD(c11)}</text>` : (t11.sound ? xD(184, o11 + i10.rowH / 2 - 11, 22, `#ffffff`) : ``) + `<text x="${_D / 2 - (t11.sound ? 14 : 0)}" y="${mD(o11 + i10.rowH / 2 + l10 * 0.35)}" font-size="${mD(l10)}" font-family="${fD}" font-weight="700" text-anchor="middle" fill="#ffffff">${pD(c11)}</text>`, a10 += `${u10(SD)}</g>`, t11.steps.forEach((r11, s12) => {
      let c12 = _D + s12 * i10.cellW, l11 = (e18) => `<rect x="${mD(c12 + 3)}" y="${mD(o11 + 4)}" width="${mD(i10.cellW - 6)}" height="${mD(i10.rowH - 8)}" rx="${mD(Math.min(12, i10.cellW * 0.2))}" ${e18}/>`, u11 = s12 % (e17.steps === 16 ? 4 : 2) == 0;
      a10 += `<g class="lh-key" data-c="${n11},${s12}">${l11(`class="lh-kface" fill="${r11 ? t11.color : u11 ? bD : yD}"`)}${l11(SD)}</g>`;
    });
  }), a10 += `<rect class="lh-seq-head" x="${_D}" y="${mD(i10.y0 - 4)}" width="${mD(i10.cellW)}" height="${mD(i10.rowH * e17.tracks.length + 8)}" rx="10" fill="none" stroke="#212529" stroke-width="5" opacity="0" pointer-events="none"/>`, a10 + (vl(e17) ? ple() : ``) + (yl(e17) ? mle(e17) : ``) + `</svg>`;
}
var SD = `class="lh-kdown" fill="#000000" opacity="0"`;
function CD(e17, t10, n10) {
  let r10 = `<g class="${e17}" display="none">`;
  return r10 += `<g class="lh-key" data-a="close"><rect x="0" y="0" width="${hD}" height="${gD}" rx="34" fill="#000000" opacity="0.35"/></g>`, r10 += `<rect x="110" y="40" width="1080" height="620" rx="30" fill="#ffffff"/>`, r10 += `<text x="${hD / 2}" y="100" font-size="38" font-family="${fD}" font-weight="700" text-anchor="middle" fill="#212529">${t10}</text>`, r10 += `<g class="lh-key" data-a="close"><circle cx="1140" cy="88" r="30" fill="#f1f3f5"/><path d="M1128 76l24 24M1152 76l-24 24" stroke="#495057" stroke-width="5" stroke-linecap="round"/><circle class="lh-kdown" cx="1140" cy="88" r="30" fill="#000000" opacity="0"/><title>Schlie\xDFen</title></g>`, n10.forEach((e18, t11) => {
    let n11 = 140 + t11 % 5 * 204, i10 = 140 + Math.floor(t11 / 5) * 250;
    r10 += `<g class="lh-key" data-a="${e18.a}"><rect x="${n11}" y="${i10}" width="196" height="230" rx="22" fill="#ffffff" stroke="${e18.color}" stroke-width="5"/><text x="${n11 + 98}" y="${i10 + 52}" font-size="${e18.label.length > 10 ? 25 : 30}" font-family="${fD}" font-weight="700" text-anchor="middle" fill="${e18.color}">${pD(e18.label)}</text><text x="${n11 + 98}" y="${i10 + 78}" font-size="17" font-family="${fD}" font-weight="700" text-anchor="middle" fill="#868e96">${e18.bpm} Schl\xE4ge / Min.</text>${e18.mini(n11, i10)}<rect class="lh-kdown" x="${n11}" y="${i10}" width="196" height="230" rx="22" fill="#000000" opacity="0"/></g>`;
  }), r10 + `</g>`;
}
function ple() {
  let e17 = [[`kick`], [`snare`, `clap`], [`hihat`, `hihatOpen`], [`crash`, `cowbell`]];
  return CD(`lh-seq-lib`, `Beat laden`, cl.map((t10) => ({ a: `beat:${t10.id}`, label: t10.label, bpm: t10.bpm, color: t10.color, mini: (n10, r10) => {
    let i10 = ``;
    return e17.forEach((e18, a10) => Array.from({ length: 16 }, (o10, s10) => {
      let c10 = e18.some((e19) => t10.hits[e19]?.includes(s10));
      i10 += `<rect x="${n10 + 14 + s10 * 10.5}" y="${r10 + 92 + a10 * 22}" width="8" height="16" rx="2" fill="${c10 ? t10.color : `#e9ecef`}"/>`;
    })), i10;
  } })));
}
function mle(e17) {
  let t10 = [...new Set(bl.flatMap((e18) => e18.notes.map(([, e19]) => e19)))].sort((e18, t11) => t11 - e18), n10 = Math.min(16, 96 / t10.length), r10 = Cl(e17), i10 = (t11) => e17.tracks[r10(t11) ?? -1]?.color ?? fo[t11 % 12];
  return CD(`lh-seq-mel`, `Melodie laden`, bl.map((e18) => ({ a: `mel:${e18.id}`, label: e18.label, bpm: e18.bpm, color: e18.color, mini: (r11, a10) => {
    let o10 = ``;
    return t10.forEach((t11, s10) => Array.from({ length: 16 }, (c10, l10) => {
      let u10 = e18.notes.some(([e19, n11]) => e19 === l10 && n11 === t11);
      o10 += `<rect x="${r11 + 14 + l10 * 10.5}" y="${mD(a10 + 90 + s10 * n10)}" width="8" height="${mD(n10 - 2)}" rx="2" fill="${u10 ? i10(t11) : `#f1f3f5`}"/>`;
    })), o10;
  } })));
}
var wD = /* @__PURE__ */ new Map();
var TD = /* @__PURE__ */ new Map();
var ED = /* @__PURE__ */ new Map();
var DD = /* @__PURE__ */ new Map();
var OD = null;
var kD = null;
function hle(e17) {
  OD = e17;
}
function gle(e17) {
  kD = e17;
}
var AD = (e17) => wD.get(e17) ?? Ol();
var jD = /* @__PURE__ */ new Set();
function MD(e17, t10) {
  wD.set(e17, t10), jD.add(e17);
}
function _le(e17) {
  jD.delete(e17) && OD?.(e17, AD(e17));
}
function ND(e17, t10, n10, r10 = 0.3) {
  if (t10.sound) {
    let r11 = DD.get(e17)?.[t10.sound];
    r11 && ps(r11.id, r11.dataUrl, { when: n10 });
  } else if (t10.drum) ls(t10.drum, { when: n10 });
  else if (t10.note !== void 0) {
    let e18 = ms(t10.voice ?? `xylophone`, t10.note, { when: n10 }), i10 = gs() ?? 0;
    e18 && setTimeout(() => e18.release(), Math.max(0, ((n10 ?? i10) - i10 + r10) * 1e3));
  }
}
var PD = /* @__PURE__ */ new Map();
var FD = 0;
var vle = (e17) => 60 / e17.bpm / (e17.steps / 4);
function ID(e17, t10) {
  let n10 = vD(AD(e17));
  for (let r10 of ED.get(e17) ?? []) {
    let e18 = r10.querySelector(`.lh-seq-head`);
    e18 && (e18.setAttribute(`opacity`, t10 < 0 ? `0` : `1`), t10 >= 0 && e18.setAttribute(`x`, String(mD(_D + t10 * n10.cellW))));
  }
}
function LD() {
  let e17 = gs();
  if (e17 !== null) {
    for (let [t10, n10] of PD) {
      if (![...ED.get(t10) ?? []].some((e18) => e18.isConnected)) {
        PD.delete(t10);
        continue;
      }
      let r10 = AD(t10);
      for (n10.next < 0 && (n10.next = e17 + 0.06); n10.next < e17 + 0.12; ) {
        let i10 = n10.step % r10.steps, a10 = vle(r10);
        for (let e18 of r10.tracks) e18.steps[i10] && ND(t10, e18, n10.next, a10 * 0.9);
        window.setTimeout(() => PD.get(t10) === n10 && ID(t10, i10), Math.max(0, (n10.next - e17) * 1e3)), n10.next += a10, n10.step = (i10 + 1) % r10.steps;
      }
    }
    PD.size || (clearInterval(FD), FD = 0);
  }
}
function RD(e17) {
  let t10 = PD.has(e17);
  for (let n10 of ED.get(e17) ?? []) {
    n10.classList.toggle(`is-running`, t10);
    let r10 = n10.querySelector(`.lh-seq-bpm`);
    r10 && (r10.textContent = String(AD(e17).bpm));
  }
  t10 || ID(e17, -1);
}
function zD(e17) {
  let t10 = gs();
  t10 !== null && (PD.set(e17, { next: t10 + 0.06, step: 0 }), FD ||= window.setInterval(LD, 25), LD(), RD(e17));
}
function BD(e17) {
  PD.delete(e17), RD(e17);
}
function yle(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h)), o10 = t10.seq ?? Ol();
  if (n10) {
    let e18 = JSON.stringify(o10);
    TD.get(t10.id) !== e18 && (TD.set(t10.id, e18), wD.set(t10.id, JSON.parse(e18))), r10.assets && DD.set(t10.id, r10.assets);
  }
  let s10 = n10 ? AD(t10.id) : o10, c10 = n10 && !!kD, l10 = `${i10}x${a10}|${n10}|${c10}|${JSON.stringify(o10)}`;
  if (e17.dataset.k === l10) return;
  e17.dataset.k = l10, e17.setAttribute(`aria-label`, `Sequenzer: ${s10.tracks.length} Spuren, ${s10.steps} Schritte, ${s10.bpm} Schl\xE4ge pro Minute`);
  let u10 = fle(s10, i10, a10, c10);
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(u10) : ule(u10), t11.style.width = `${i10}px`, t11.style.height = `${a10}px`, e17.replaceChildren(t11);
    return;
  }
  let d10 = document.createElement(`div`);
  d10.className = `lh-wg-pic`, d10.innerHTML = u10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(d10), t10.locked && e17.classList.add(`is-armed`);
  let f10 = ED.get(t10.id);
  f10 || ED.set(t10.id, f10 = /* @__PURE__ */ new Set());
  for (let e18 of f10) e18.isConnected || f10.delete(e18);
  f10.add(e17), RD(t10.id);
  let p10 = null;
  Si(e17, { slide: true, begin: () => {
    p10 = null;
  }, end: () => _le(t10.id), hit: (e18) => {
    let n11 = t10.id, r11 = e18.getAttribute(`data-a`), i11 = AD(n11);
    if (r11) {
      if (p10 !== null) return null;
      p10 = false;
      let e19 = (e20) => ED.get(n11)?.forEach((t11) => {
        t11.classList.toggle(`is-library`, e20 === `is-library`), t11.classList.toggle(`is-melodies`, e20 === `is-melodies`);
      });
      if (r11 === `play`) PD.has(n11) ? BD(n11) : zD(n11);
      else if (r11 === `dice`) MD(n11, gl(i11)), HD(n11);
      else if (r11 === `beats`) e19(`is-library`);
      else if (r11 === `melodies`) e19(`is-melodies`);
      else if (r11 === `close`) e19(``);
      else if (r11.startsWith(`beat:`) || r11.startsWith(`mel:`)) MD(n11, r11.startsWith(`beat:`) ? _l(i11, r11.slice(5)) : wl(i11, r11.slice(4))), HD(n11), RD(n11), e19(``);
      else if (r11 === `slower` || r11 === `faster`) {
        let e20 = Math.min(180, Math.max(50, i11.bpm + (r11 === `faster` ? 4 : -4)));
        MD(n11, { ...i11, bpm: e20 }), RD(n11);
      } else r11 === `clear` && (MD(n11, { ...i11, tracks: i11.tracks.map((e20) => ({ ...e20, steps: e20.steps.map(() => false) })) }), HD(n11));
      return null;
    }
    let a11 = e18.getAttribute(`data-t`);
    if (a11 !== null) {
      if (p10 !== null) return null;
      p10 = false;
      let e19 = i11.tracks[Number(a11)];
      return e19 && (e19.rec && !e19.sound ? kD?.(n11, Number(a11)) : ND(n11, e19)), null;
    }
    let o11 = e18.getAttribute(`data-c`);
    if (!o11) return null;
    let [s11, c11] = o11.split(`,`).map(Number), l11 = i11.tracks[s11];
    if (!l11 || (p10 === null && (p10 = !l11.steps[c11]), l11.steps[c11] === p10)) return null;
    let u11 = i11.tracks.map((e19, t11) => t11 === s11 ? { ...e19, steps: e19.steps.map((e20, t12) => t12 === c11 ? p10 : e20) } : e19);
    MD(n11, { ...i11, tracks: u11 });
    let d11 = e18.querySelector(`.lh-kface`), f11 = c11 % (i11.steps === 16 ? 4 : 2) == 0;
    return d11?.setAttribute(`fill`, p10 ? l11.color : f11 ? bD : yD), p10 && !PD.has(n11) && ND(n11, l11), null;
  } });
}
function HD(e17) {
  let t10 = AD(e17);
  for (let n10 of ED.get(e17) ?? []) n10.querySelectorAll(`.lh-key[data-c]`).forEach((e18) => {
    let [n11, r10] = (e18.getAttribute(`data-c`) ?? `0,0`).split(`,`).map(Number), i10 = t10.tracks[n11], a10 = r10 % (t10.steps === 16 ? 4 : 2) == 0;
    e18.querySelector(`.lh-kface`)?.setAttribute(`fill`, i10?.steps[r10] ? i10.color : a10 ? bD : yD);
  });
}
var xle = `
.lh-wg-sequencer.is-running .lh-seq-play{opacity:0}
.lh-wg-sequencer.is-library .lh-seq-lib,.lh-wg-sequencer.is-melodies .lh-seq-mel{display:inline}
.lh-wg-sequencer.is-running .lh-seq-stop{opacity:1}`;
var qD = [`2/4`, `3/4`, `4/4`, `5/4`, `6/8`];
var JD = [{ id: `click`, label: `Klick` }, { id: `wood`, label: `Holzblock` }, { id: `bell`, label: `Glocke` }, { id: `beep`, label: `Piep` }, { id: `cowbell`, label: `Kuhglocke` }];
var YD = `Andika, Andika, Verdana, Arial, sans-serif`;
var Ele = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
function XD(e17) {
  return e17 < 60 ? `Largo` : e17 < 66 ? `Larghetto` : e17 < 76 ? `Adagio` : e17 < 108 ? `Andante` : e17 < 120 ? `Moderato` : e17 < 168 ? `Allegro` : e17 <= 200 ? `Presto` : `Prestissimo`;
}
var ZD = (e17) => Number(e17.split(`/`)[0]);
var QD = (e17, t10) => t10 === 0 ? 2 : +(e17 === `6/8` && t10 === 3);
var $D = (e17) => qD.includes(e17.meter) ? e17.meter : `4/4`;
var eO = /* @__PURE__ */ new Map();
var tO = /* @__PURE__ */ new Map();
var nO = /* @__PURE__ */ new Map();
var rO = /* @__PURE__ */ new WeakMap();
var iO = (e17) => tO.get(e17.id) ?? Math.min(208, Math.max(40, e17.bpm ?? 90));
function Dle(e17, t10, n10) {
  let r10 = $D(e17), i10 = ZD(r10), a10 = iO(e17), o10 = Array.from({ length: i10 }, (e18, t11) => {
    let n11 = 246 + (t11 - (i10 - 1) / 2) * Math.min(30, 170 / i10), a11 = QD(r10, t11);
    return `<circle class="lh-beat" data-b="${t11}" cx="${n11}" cy="128" r="${a11 ? 9 : 7}" fill="#495057" stroke="${a11 ? `#ffd43b` : `#868e96`}" stroke-width="2"/>`;
  }).join(``), s10 = (e18, t11, n11, r11) => `<g class="lh-key" data-a="${e18}"><rect x="${t11}" y="148" width="60" height="34" rx="10" fill="#495057"/>${r11}<rect class="lh-kdown" x="${t11}" y="148" width="60" height="34" rx="10" fill="#000000" opacity="0"/><title>${n11}</title></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="${t10}" height="${n10}"><g class="lh-key" data-a="toggle"><path d="M52 10H88L132 192H8Z" fill="#8b5a2b"/><path d="M60 22H80L114 178H26Z" fill="#f3e2c0"/>` + [0, 1, 2, 3, 4, 5, 6].map((e18) => `<path d="M${62 + e18 * 0.4} ${40 + e18 * 18}H${78 - e18 * 0.4}" stroke="#b08d57" stroke-width="2"/>`).join(``) + `<g class="lh-pend"><path d="M70 172V34" stroke="#343a40" stroke-width="4" stroke-linecap="round"/><rect x="61" y="70" width="18" height="16" rx="3" fill="#ced4da" stroke="#343a40" stroke-width="2"/></g><circle cx="70" cy="172" r="6" fill="#343a40"/><rect x="8" y="182" width="124" height="10" rx="4" fill="#6b4423"/><path class="lh-kdown" d="M52 10H88L132 192H8Z" fill="#000000" opacity="0"/></g><rect x="144" y="10" width="208" height="182" rx="18" fill="#212529"/><text class="lh-bpm" x="246" y="70" font-size="50" font-family="${YD}" font-weight="700" text-anchor="middle" fill="#f8f9fa">${a10}</text><text class="lh-tname" x="246" y="98" font-size="17" font-family="${YD}" font-weight="700" text-anchor="middle" fill="#adb5bd">${XD(a10)} \xB7 ${r10}</text>` + o10 + s10(`slower`, 152, `Langsamer`, `<path d="M172 165h20" stroke="#f8f9fa" stroke-width="5" stroke-linecap="round"/>`) + s10(`toggle`, 216, `Start / Stopp`, `<path class="lh-m-play" d="M240 154l16 11-16 11z" fill="#69db7c"/><rect class="lh-m-stop" x="238" y="156" width="18" height="18" rx="3" fill="#ff8787" opacity="0"/>`) + s10(`faster`, 280, `Schneller`, `<path d="M300 165h20M310 155v20" stroke="#f8f9fa" stroke-width="5" stroke-linecap="round"/>`) + `</svg>`;
}
function aO(e17, t10 = -1) {
  let n10 = eO.get(e17);
  for (let r10 of nO.get(e17) ?? []) {
    let e18 = rO.get(r10);
    if (!e18) continue;
    let i10 = iO(e18);
    r10.classList.toggle(`is-running`, !!n10), r10.style.setProperty(`--lh-beat`, `${(60 / i10).toFixed(3)}s`);
    let a10 = r10.querySelector(`.lh-bpm`);
    a10 && (a10.textContent = String(i10));
    let o10 = r10.querySelector(`.lh-tname`);
    if (o10 && (o10.textContent = `${XD(i10)} \xB7 ${$D(e18)}`), r10.querySelectorAll(`.lh-beat`).forEach((e19) => e19.classList.toggle(`is-on`, Number(e19.getAttribute(`data-b`)) === t10)), t10 >= 0) {
      let e19 = r10.querySelector(`.lh-pend`);
      e19 && (e19.style.transform = `rotate(${t10 % 2 ? -22 : 22}deg)`);
    } else if (!n10) {
      let e19 = r10.querySelector(`.lh-pend`);
      e19 && (e19.style.transform = ``);
    }
  }
}
var oO = 0;
function sO() {
  let e17 = gs();
  if (e17 !== null) {
    for (let [t10, n10] of eO) if (![...nO.get(t10) ?? []].some((e18) => e18.isConnected)) eO.delete(t10);
    else for (n10.next < 0 && (n10.next = e17 + 0.06); n10.next < e17 + 0.12; ) {
      let r10 = n10.beat;
      _s(n10.click, QD(n10.meter, r10), n10.next), window.setTimeout(() => eO.get(t10) === n10 && aO(t10, r10), Math.max(0, (n10.next - e17) * 1e3)), n10.next += 60 / n10.bpm, n10.beat = (r10 + 1) % ZD(n10.meter);
    }
    eO.size || (clearInterval(oO), oO = 0);
  }
}
function cO(e17) {
  let t10 = gs();
  t10 !== null && (eO.set(e17.id, { bpm: iO(e17), meter: $D(e17), click: JD.some((t11) => t11.id === e17.click) ? e17.click : `wood`, next: t10 + 0.06, beat: 0 }), oO ||= window.setInterval(sO, 25), sO(), aO(e17.id));
}
function lO(e17) {
  eO.delete(e17), aO(e17);
}
function dO(e17, t10) {
  let n10 = Math.min(208, Math.max(40, iO(e17) + t10));
  tO.set(e17.id, n10);
  let r10 = eO.get(e17.id);
  r10 && (r10.bpm = n10), aO(e17.id);
}
function kle(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h));
  rO.set(e17, t10);
  let o10 = `${i10}x${a10}|${n10}|${t10.bpm}|${t10.meter}|${t10.click}`;
  if (e17.dataset.k === o10) return;
  e17.dataset.k = o10, e17.setAttribute(`aria-label`, `Metronom: ${iO(t10)} Schl\xE4ge pro Minute, ${$D(t10)}-Takt`);
  let s10 = Dle(t10, i10, a10);
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(s10) : Ele(s10), t11.style.width = `${i10}px`, t11.style.height = `${a10}px`, e17.replaceChildren(t11);
    return;
  }
  let c10 = document.createElement(`div`);
  c10.className = `lh-wg-pic`, c10.innerHTML = s10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(c10), t10.locked && e17.classList.add(`is-armed`);
  let l10 = nO.get(t10.id);
  l10 || nO.set(t10.id, l10 = /* @__PURE__ */ new Set());
  for (let e18 of l10) e18.isConnected || l10.delete(e18);
  l10.add(e17);
  let u10 = eO.get(t10.id);
  u10 && (u10.meter = $D(t10), u10.click = JD.some((e18) => e18.id === t10.click) ? t10.click : `wood`, u10.beat %= ZD(u10.meter)), aO(t10.id), Si(e17, { slide: false, hit: (n11) => {
    let r11 = rO.get(e17) ?? t10, i11 = n11.getAttribute(`data-a`);
    return i11 === `toggle` ? eO.has(r11.id) ? lO(r11.id) : cO(r11) : i11 === `slower` ? dO(r11, -4) : i11 === `faster` && dO(r11, 4), null;
  } });
}
var Ale = `
.lh-wg-metronome .lh-pend{transform-box:view-box;transform-origin:70px 172px;transition:transform var(--lh-beat,.6s) ease-in-out}
.lh-wg-metronome .lh-beat.is-on{fill:#ffd43b}
.lh-wg-metronome.is-running .lh-m-play{opacity:0}
.lh-wg-metronome.is-running .lh-m-stop{opacity:1}`;
var GA = { tubes: { inst: _o(`tubes`), echo: { ...Cc, tones: 3 } }, xylophone: { inst: _o(`xylophone`), echo: { ...Cc, tones: 5 } }, piano: { inst: { ..._o(`piano`), octaves: 1, labels: `letters`, colors: true }, echo: { ...Cc, tones: 5 } }, glockenspiel: { inst: _o(`glockenspiel`), echo: { ...Cc, tones: 5 } }, synth: { inst: { ..._o(`synth`), octaves: 1, labels: `letters` }, echo: { ...Cc, tones: 5 } } };
var Fue = (e17) => GA[e17];
var Rue = { tubes: { ..._o(`tubes`), labels: `letters`, colors: true }, xylophone: { ..._o(`xylophone`), octave: 4 }, glockenspiel: { ..._o(`glockenspiel`), octave: 4 }, piano: { ..._o(`piano`), labels: `letters`, colors: true }, synth: { ..._o(`synth`), labels: `letters` } };
var YA = (e17) => Rue[e17];
var LW = new Set(`ich du er sie es wir ihr und oder aber denn das dass ist sind war wird haben hat ein eine einen einem einer eines dem den der die des mit von zu in im am um f\xFCr auf aus bei nach zum zur an als wie auch nicht nur noch mich dich sich uns euch mir dir ihm ihnen mein dein sein unser euer kein keine doch mal ja nein man wer was wen wem wessen welche welcher welches dieser diese dieses diesem diesen jener jene jenes jemand niemand alle alles aller allen jeder jede jedes jedem jeden viele vieles einige manche mancher etwas nichts selbst einander meine meiner meines meinem meinen deine deiner deines deinem deinen seine seiner seines seinem seinen ihre ihrer ihres ihrem ihren unsere unserer unseres unserem unseren eure eurer eures eurem euren keiner keines keinem keinen ihn \xFCber unter vor hinter neben zwischen durch gegen ohne bis seit w\xE4hrend wegen trotz au\xDFer entlang weil wenn ob damit obwohl sondern sowie bevor nachdem indem sodass falls dann da dort hier jetzt heute gestern morgen immer nie niemals oft manchmal schon sehr so ganz fast wieder etwa vielleicht ziemlich gleich bald nun eben erst sogar also deshalb darum danach davor dabei dazu hin her mehr weniger wenig viel genug wohl halt dies dessen deren denen worden gar zwar bin bist seid sei seien w\xE4re w\xE4ren gewesen wesen werden werde wirst werdet wurde wurden w\xFCrde w\xFCrden geworden habe hast habt hatte hatten h\xE4tte h\xE4tten gehabt kann kannst k\xF6nnen k\xF6nnt konnte konnten k\xF6nnte k\xF6nnten gekonnt muss musst m\xFCssen m\xFCsst musste mussten m\xFCsste m\xFCssten will willst wollen wollt wollte wollten gewollt soll sollst sollen sollt sollte sollten darf darfst d\xFCrfen d\xFCrft durfte durften d\xFCrfte mag magst m\xF6gen m\xF6gt mochte mochten m\xF6chte m\xF6chten m\xF6chtest tut tun tue tust`.split(/\s+/));
var ixe = /(heit|keit|schaft|tum|ismus|ität|tion|ung|nis)$/;
var axe = new Set(`zeitung wohnung kleidung nahrung zeichnung leitung verpackung landschaft station portion universit\xE4t gef\xE4ngnis zeugnis rechnung einladung mannschaft bewegung`.split(` `));
var zW = (e17) => e17.toLocaleLowerCase(`de-DE`);
function BW(e17) {
  let t10 = zW(e17.trim());
  return t10.length < 2 || /^\d+$/.test(t10) || LW.has(t10) ? false : /\s/.test(t10) ? true : !(ixe.test(t10) && t10.length > 5 && !axe.has(t10));
}
var uxe = 60;
function QW(e17, t10) {
  let { audio: n10, timing: r10, ...i10 } = t10, a10 = e17.design && t10.design === f_().design ? e17.design : t10.design;
  return { ...i10, design: a10, song: e17.id, title: e17.title, credit: e17.credit, text: e17.text, secs: e17.secs, repeat: e17.repeat ?? 1, pics: {}, nopic: [], skip: void 0 };
}
function pxe(e17, t10) {
  let n10 = new Set(e17.nopic ?? []), r10 = new Set([...e17.text.matchAll(/\[([^\]\n]{1,40})\]/g)].map((e18) => C_(e18[1]))), i10 = [];
  for (let a10 of T_(e17.text)) {
    let o10 = C_(a10);
    e17.pics[o10] || n10.has(o10) || (t10 ? (o10 in t10 || r10.has(o10)) && i10.push({ word: a10, key: o10, term: t10[o10] }) : (r10.has(o10) || /^[A-ZÄÖÜ]/.test(a10) && a10.length > 2 && BW(a10)) && i10.push({ word: a10, key: o10 }));
  }
  return i10.slice(0, uxe);
}
function tG(e17) {
  let t10 = new Set(T_(e17.text).map(C_)), n10 = {};
  for (let [r11, i11] of Object.entries(e17.pics)) t10.has(r11) && (n10[r11] = i11);
  let r10 = (e17.nopic ?? []).filter((e18) => t10.has(e18)), i10 = b_(e17.text, 1).verses, a10 = (e17.skip ?? []).filter((e18) => e18 <= i10), o10 = b_(e17.text, 1).slots.find((e18) => e18.kind === `line`)?.text.replace(/[,.;:!?]+$/, ``) ?? ``, s10 = e17.title.trim() || o10.replace(/\[([^\]]*)\]/g, `$1`).slice(0, 120) || `Mein Lied`;
  return { ...e17, title: s10, pics: n10, nopic: r10.length ? r10 : void 0, skip: a10.length && a10.length < i10 ? a10 : void 0 };
}
async function musicCaptureStream(includeMicrophone = false) {
  const engine = Ko();
  if (!engine) throw Error('Audio wird von diesem Browser nicht unterstützt.');
  const microphone = includeMicrophone ? await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }) : null;
  let destination, source, connected = false;
  try {
    if (engine.ctx.state === 'suspended') await engine.ctx.resume();
    destination = engine.ctx.createMediaStreamDestination();
    engine.comp.connect(destination); connected = true;
    if (microphone) { source = engine.ctx.createMediaStreamSource(microphone); source.connect(destination); }
    let released = false;
    return { stream: destination.stream, release: () => {
      if (released) return;
      released = true;
      engine.comp.disconnect(destination); source?.disconnect();
      microphone?.getTracks().forEach(track => track.stop());
    } };
  } catch (error) {
    if (connected) engine.comp.disconnect(destination);
    source?.disconnect(); destination?.stream.getTracks().forEach(track => track.stop());
    microphone?.getTracks().forEach(track => track.stop());
    throw error;
  }
}
function musicStop(id) {
  BD(id); lO(id); Rd(id); hs(); Tu(id); Vie(id);
  const echo = Ic(id); echo.token++; echo.phase = 'idle';
  if (tp?.id === id) cp(id);
}
function musicRegister(saveSequence, studioChange, studioAdd, studioEdit, sequenceRecord, padRecord, karaokeAudio, karaokeTiming) {
  hle(saveSequence); gle(sequenceRecord); Uee(studioChange, studioAdd, studioEdit); Lce(padRecord); Aie(karaokeAudio, karaokeTiming);
}
var MUSIC_CSS = [Ri, Zc, mee, kee, Jee, Ote, xle, Ale, Jie].join('\n');
export { tG as cleanKaraokeSettings, pxe as karaokePictureCandidates, QW as karaokeSongSettings, b_ as parseLyrics, T_ as lyricWords, C_ as wordKey, Kie as parseMusicLrc, qie as exportMusicLrc, vc as parseMusicMidi, yc as pickMidiTrack, xc as midiMelody, _l as sequenceBeat, wl as sequenceMelody, Dl as sequenceKey, _o as instrumentDefaults, YA as fallingInstrument, Fue as echoInstrument, jo as instrumentNotes, yo as musicNoteName, gs as musicAudioTime, _s as playMetronomeClick, ls as playMusicDrum, ms as playMusicTone, ps as playMusicSample, hs as stopMusicSound, Bie as renderKaraoke, Vs as renderInstrument, zce as renderDrums, kle as renderMetronome, Yc as renderEcho, yle as renderSequencer, pee as renderNoteQuiz, Eu as renderFalling, Ud as renderStudio, lp as renderTuner, musicCaptureStream, musicStop, musicRegister, MUSIC_CSS, Pu as studioEffects, Fu as studioMoods };
