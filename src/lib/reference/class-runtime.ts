/* eslint-disable */
// @ts-nocheck
// Generated from Lernsachen-Heft.html by scripts/extract-class-reference.mjs:
// Uhr, Timer, Datum (Regal › Zeit) and the Multi-Timer of the reference,
// unchanged except that the weather is asked through /api/wetter.
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
function hi() {
  let e17 = Vr();
  if (!e17) return;
  let t10 = e17.currentTime + 0.05;
  for (let [n10, r10] of [[784, 0], [988, 0.32], [1175, 0.64], [784, 1.7], [988, 2.02], [1175, 2.34]]) {
    let i10 = e17.createOscillator(), a10 = e17.createGain();
    i10.type = `sine`, i10.frequency.value = n10, a10.gain.setValueAtTime(1e-4, t10 + r10), a10.gain.exponentialRampToValueAtTime(0.28, t10 + r10 + 0.02), a10.gain.exponentialRampToValueAtTime(1e-4, t10 + r10 + 1.3), i10.connect(a10).connect(e17.destination), i10.start(t10 + r10), i10.stop(t10 + r10 + 1.4);
  }
}
function vi() {
  let e17 = Vr();
  if (!e17) return;
  let t10 = e17.currentTime + 0.02;
  for (let [n10, r10] of [[988, 0], [1319, 0.09], [1760, 0.18]]) {
    let i10 = e17.createOscillator(), a10 = e17.createGain();
    i10.type = `triangle`, i10.frequency.value = n10, a10.gain.setValueAtTime(1e-4, t10 + r10), a10.gain.exponentialRampToValueAtTime(0.22, t10 + r10 + 0.015), a10.gain.exponentialRampToValueAtTime(1e-4, t10 + r10 + 0.35), i10.connect(a10).connect(e17.destination), i10.start(t10 + r10), i10.stop(t10 + r10 + 0.4);
  }
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
var zi = [`#ef4444`, `#eab308`, `#22c55e`, `#3b82f6`, `#a855f7`, `#f97316`, `#06b6d4`, `#ec4899`, `#64748b`];
var Bi = [`#ef4444`, `#f97316`, `#f59e0b`, `#eab308`, `#84cc16`, `#22c55e`, `#10b981`, `#14b8a6`, `#06b6d4`, `#0ea5e9`, `#3b82f6`, `#6366f1`, `#8b5cf6`, `#a855f7`, `#d946ef`, `#ec4899`, `#f43f5e`, `#64748b`];
var Vi = { Unterricht: [`\u270D\uFE0F`, `\u{1F9EE}`, `\u{1F4D6}`, `\u{1F5E3}\uFE0F`, `\u{1F465}`, `\u{1F464}`, `\u2702\uFE0F`, `\u{1F5D1}\uFE0F`, `\u{1F4D4}`, `\u{1F4DA}`, `\u270F\uFE0F`, `\u{1F3A8}`, `\u{1F3B6}`, `\u{1F392}`, `\u{1F3EB}`, `\u{1F440}`, `\u{1F442}`, `\u{1F463}`, `\u{1F514}`, `\u{1F64B}\u200D\u2642\uFE0F`], Stimmungen: [`\u{1F914}`, `\u{1F92B}`, `\u{1F912}`, `\u{1F603}`, `\u{1F973}`, `\u{1F9D0}`, `\u{1F60E}`, `\u{1F634}`, `\u{1F60B}`, `\u{1F60F}`, `\u{1F926}\u200D\u2642\uFE0F`, `\u{1F937}`, `\u{1F4A9}`], Gesten: [`\u{1F44D}`, `\u{1F44E}`, `\u270C\uFE0F`, `\u{1F918}`, `\u{1F44F}`, `\u261D\uFE0F`, `\u{1F44B}`, `\u{1F64F}`, `\u{1FAF5}`], "Fokus & Arbeit": [`\u{1F9E0}`, `\u{1F4DD}`, `\u{1F4CA}`, `\u{1F4BC}`, `\u{1F4A1}`, `\u{1F50D}`, `\u{1F393}`, `\u26A1`, `\u{1F3D7}\uFE0F`, `\u{1F504}`, `\u{1F500}`, `\u{1F4AD}`, `\u{1F4AC}`, `\u{1F3C1}`, `\u{1F310}`, `\u2705`, `\u2753`, `\u26D4\uFE0F`, `\u{1F510}`], Bed\u00FCrfnisse: [`\u{1F6BD}`, `\u{1F6B0}`, `\u{1F9FC}`, `\u{1F6CC}`, `\u{1F96A}`, `\u{1F964}`, `\u{1F9E5}`, `\u{1F9D6}`, `\u{1F9B7}`, `\u{1F9F4}`, `\u{1F6CF}\uFE0F`, `\u{1F6C1}`, `\u{1F6BF}`, `\u{1F9F9}`, `\u{1F9FB}`], "Essen & Trinken": [`\u{1F34E}`, `\u{1F968}`, `\u{1F956}`, `\u{1F354}`, `\u{1F355}`, `\u{1F957}`, `\u{1F35D}`, `\u{1F370}`, `\u{1F36D}`, `\u2615\uFE0F`, `\u{1F375}`, `\u{1F37D}\uFE0F`, `\u{1F95B}`], "Sport & Training": [`\u26BD\uFE0F`, `\u{1F3C0}`, `\u{1F3C8}`, `\u{1F94F}`, `\u{1F3D3}`, `\u{1F3F8}`, `\u{1F6DD}`, `\u{1F3C3}`, `\u{1F938}\u200D\u2640\uFE0F`, `\u26F9\uFE0F\u200D\u2642\uFE0F`, `\u{1F9D8}\u200D\u2640\uFE0F`, `\u{1F3CA}\u200D\u2640\uFE0F`, `\u{1F6B4}\u200D\u2640\uFE0F`, `\u{1F3C6}`, `\u{1F947}`], "Medien & Spiel": [`\u{1F3AE}`, `\u{1F4FA}`, `\u{1F4F9}`, `\u{1F4F7}`, `\u{1F5A8}\uFE0F`, `\u{1F5A5}\uFE0F`, `\u{1F3B2}`, `\u{1F9E9}`, `\u2328\uFE0F`, `\u{1F579}\uFE0F`, `\u23F1\uFE0F`, `\u{1F9F8}`, `\u{1F381}`, `\u{1F389}`, `\u{1F0CF}`, `\u{1F3A7}`, `\u{1F4BB}`, `\u{1F4F1}`, `\u{1F50B}`, `\u25B6\uFE0F`, `\u{1F509}`], "Verkehr & Drau\xDFen": [`\u{1F68C}`, `\u{1F697}`, `\u{1F69C}`, `\u{1F682}`, `\u2708\uFE0F`, `\u{1F680}`, `\u{1F3E0}`, `\u{1F6B2}`, `\u{1F6B6}`, `\u{1F332}`, `\u{1F327}\uFE0F`, `\u2600\uFE0F`, `\u2744\uFE0F`, `\u2603\uFE0F`, `\u{1F4A7}`, `\u{1F4A8}`, `\u2602\uFE0F`, `\u{1F6D1}`, `\u{1F6B8}`], Tiere: [`\u{1F648}`, `\u{1F649}`, `\u{1F64A}`, `\u{1F986}`, `\u{1F984}`, `\u{1F40C}`, `\u{1F996}`, `\u{1F9A6}`, `\u{1F994}`, `\u{1F9A5}`, `\u{1F437}`, `\u{1F415}`, `\u{1F434}`, `\u{1F425}`], "Haushalt & Sonstiges": [`\u{1F9FA}`, `\u{1F6D2}`, `\u{1F527}`, `\u23F0`, `\u{1F4B6}`, `\u{1F388}`, `\u{1F511}`, `\u{1F6AA}`, `\u{1FA91}`] };
var Hi = [{ id: `school`, label: `\u{1F514} Schulgong` }, { id: `digital`, label: `\u{1F47E} Digital` }, { id: `gentle`, label: `\u{1F343} Sanft` }, { id: `mute`, label: `\u{1F515} Stumm` }];
var Ui = { phases: [{ min: 10, name: `Think`, icon: `\u{1F914}`, color: `#ef4444` }, { min: 10, name: `Pair`, icon: `\u{1F465}`, color: `#eab308` }, { min: 10, name: `Share`, icon: `\u{1F4AC}`, color: `#22c55e` }], delay: 1, sound: `school` };
var Wi = /^#[0-9a-f]{6}$/i;
var Gi = (e17, t10, n10, r10) => typeof e17 == `number` && Number.isFinite(e17) ? Math.max(t10, Math.min(n10, Math.round(e17))) : r10;
function Ki(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = Array.isArray(t10.phases) ? t10.phases : Ui.phases, r10 = [], i10 = 0;
  for (let [e18, t11] of n10.entries()) {
    if (r10.length >= 9) break;
    let n11 = t11 && typeof t11 == `object` ? t11 : {}, a10 = Math.min(Gi(n11.min, 0, 60, 10), 120 - i10);
    i10 += a10, r10.push({ min: a10, name: typeof n11.name == `string` ? n11.name.slice(0, 40) : `Phase ${e18 + 1}`, icon: typeof n11.icon == `string` && n11.icon.trim() ? [...n11.icon.trim()].slice(0, 8).join(``) : `\u23F1\uFE0F`, color: typeof n11.color == `string` && Wi.test(n11.color) ? n11.color : zi[e18 % zi.length] });
  }
  return r10.length || r10.push({ ...Ui.phases[0] }), { phases: r10, delay: Gi(t10.delay, 1, 60, 1), sound: t10.sound === `digital` || t10.sound === `gentle` || t10.sound === `mute` ? t10.sound : `school` };
}
var qi = (e17) => e17.phases.reduce((e18, t10) => e18 + t10.min, 0);
var Ji = `lernheft-multitimer`;
var Yi = /* @__PURE__ */ new Map();
var Xi = /* @__PURE__ */ new Map();
var Zi = /* @__PURE__ */ new Map();
var Qi = false;
function $i() {
  if (!Qi) {
    Qi = true;
    try {
      let e17 = JSON.parse(localStorage.getItem(Ji) ?? `{}`);
      for (let [t10, n10] of Object.entries(e17.runs ?? {})) n10 && typeof n10.start == `number` && Yi.set(t10, { start: n10.start, skipped: n10.skipped || 0, paused: !!n10.paused, pauseAt: n10.pauseAt ?? null, active: n10.active ?? -1 });
      for (let [t10, n10] of Object.entries(e17.cfg ?? {})) Zi.set(t10, Ki(n10));
    } catch {
    }
    Yi.size && ua();
  }
}
function ea() {
  try {
    let e17 = {};
    for (let [t11, n10] of Zi) e17[t11] = n10;
    let t10 = {};
    for (let [e18, n10] of Yi) t10[e18] = n10;
    !Yi.size && !Zi.size ? localStorage.removeItem(Ji) : localStorage.setItem(Ji, JSON.stringify({ runs: t10, cfg: e17 }));
  } catch {
  }
  fa();
}
var ta = (e17) => Xi.get(e17) ?? Ui;
function na(e17, t10, n10) {
  let r10 = t10.paused && t10.pauseAt ? t10.pauseAt : n10, i10 = r10 < t10.start, a10 = i10 ? 0 : r10 - t10.start + t10.skipped, o10 = 0;
  for (let [t11, n11] of e17.phases.entries()) {
    let e18 = n11.min * 6e4;
    if (!(e18 <= 0)) {
      if (!i10 && a10 >= o10 && a10 < o10 + e18) return { waiting: i10, idx: t11, rem: o10 + e18 - a10, done: false, now: r10 };
      o10 += e18;
    }
  }
  return { waiting: i10, idx: -1, rem: 0, done: !i10 && a10 > 0 && o10 > 0, now: r10 };
}
var ra = (e17 = 50) => {
  let t10 = /* @__PURE__ */ new Date(), n10 = (6e4 - (t10.getSeconds() * 1e3 + t10.getMilliseconds())) % 6e4;
  return n10 < e17 ? 6e4 : n10;
};
function ia(e17) {
  let t10 = ta(e17);
  qi(t10) && (Yi.set(e17, { start: Date.now() + ra() + (t10.delay - 1) * 6e4, skipped: 0, paused: false, pauseAt: null, active: -1 }), ea(), ua());
}
function aa(e17) {
  let t10 = Yi.get(e17);
  t10 && (t10.paused ? (t10.start += Date.now() - (t10.pauseAt ?? Date.now()), t10.paused = false, t10.pauseAt = null) : (t10.paused = true, t10.pauseAt = Date.now()), ea());
}
function oa(e17) {
  let t10 = Yi.get(e17);
  if (!t10) return;
  t10.paused && aa(e17);
  let n10 = Date.now();
  if (n10 < t10.start) {
    t10.start = n10, ea();
    return;
  }
  let r10 = n10 - t10.start + t10.skipped, i10 = 0;
  for (let a10 of ta(e17).phases) if (i10 += a10.min * 6e4, r10 < i10) {
    t10.start = n10 + ra(100) - i10, t10.skipped = 0, pa(`beep`), ea();
    return;
  }
  sa(e17);
}
function sa(e17) {
  Yi.delete(e17) && ea();
}
var la = 0;
function ua() {
  la || typeof window > `u` || (la = window.setInterval(() => {
    if (!Yi.size) clearInterval(la), la = 0;
    else for (let [e17, t10] of [...Yi]) {
      let n10 = ta(e17), r10 = na(n10, t10, Date.now());
      r10.done ? (Yi.delete(e17), ea(), ma(n10.sound)) : !r10.waiting && r10.idx > -1 && r10.idx !== t10.active && (t10.active !== -1 && r10.idx > t10.active && n10.sound !== `mute` && pa(n10.sound), t10.active = r10.idx, ea());
    }
  }, 250));
}
var da = null;
function fa() {
  let e17 = navigator;
  if (Yi.size && !da && e17.wakeLock && document.visibilityState === `visible`) e17.wakeLock.request(`screen`).then((e18) => {
    da = e18, Yi.size || e18.release().then(() => da = null);
  }).catch(() => void 0);
  else if (!Yi.size && da) {
    let e18 = da;
    da = null, e18.release().catch(() => void 0);
  }
}
function pa(e17) {
  let t10 = Vr();
  if (!t10 || e17 === `mute`) return;
  let n10 = t10.currentTime, r10 = t10.createOscillator(), i10 = t10.createGain();
  r10.connect(i10), i10.connect(t10.destination), e17 === `school` ? (r10.frequency.setValueAtTime(660, n10), r10.frequency.exponentialRampToValueAtTime(330, n10 + 0.6), i10.gain.setValueAtTime(0.3, n10), i10.gain.exponentialRampToValueAtTime(0.01, n10 + 0.6), r10.start(n10), r10.stop(n10 + 0.6)) : e17 === `digital` ? (r10.type = `square`, r10.frequency.setValueAtTime(880, n10), i10.gain.setValueAtTime(0.1, n10), i10.gain.setValueAtTime(0, n10 + 0.1), i10.gain.setValueAtTime(0.1, n10 + 0.15), i10.gain.setValueAtTime(0, n10 + 0.25), r10.start(n10), r10.stop(n10 + 0.3)) : e17 === `gentle` ? (r10.type = `sine`, r10.frequency.setValueAtTime(440, n10), i10.gain.setValueAtTime(0, n10), i10.gain.linearRampToValueAtTime(0.5, n10 + 0.2), i10.gain.linearRampToValueAtTime(0, n10 + 1.2), r10.start(n10), r10.stop(n10 + 1.2)) : (r10.frequency.value = 600, i10.gain.setValueAtTime(0.1, n10), i10.gain.exponentialRampToValueAtTime(1e-3, n10 + 0.1), r10.start(n10), r10.stop(n10 + 0.1));
}
function ma(e17) {
  let t10 = Vr();
  if (!t10 || e17 === `mute`) return;
  let n10 = t10.currentTime, r10 = (e18, r11, i10, a10, o10, s10 = `exp`, c10 = 0) => {
    let l10 = t10.createOscillator(), u10 = t10.createGain();
    l10.type = a10, l10.connect(u10), u10.connect(t10.destination), l10.frequency.value = e18, s10 === `exp` ? (u10.gain.setValueAtTime(o10, n10 + r11), u10.gain.exponentialRampToValueAtTime(1e-3, n10 + r11 + i10)) : (u10.gain.setValueAtTime(0, n10), u10.gain.linearRampToValueAtTime(o10, n10 + c10), u10.gain.linearRampToValueAtTime(0, n10 + i10)), l10.start(n10 + r11), l10.stop(n10 + r11 + i10);
  };
  e17 === `school` ? [0, 0.5, 1, 1.8].forEach((e18, t11) => r10(t11 === 3 ? 880 : 660, e18, 0.8, `sine`, 0.2)) : e17 === `digital` ? [0, 0.15, 0.3, 0.45, 0.6].forEach((e18, t11) => r10(440 + t11 * 110, e18, 0.1, `square`, 0.1)) : [440, 554, 659].forEach((e18, t11) => r10(e18, 0, 3, `triangle`, 0.2, `swell`, 0.5 + t11 * 0.2));
}
var ha = 36e5;
var ga = Math.PI * 2;
function _a(e17, t10, n10, r10, i10) {
  let a10 = t10 / 2, o10 = t10 / 2, s10 = t10 / 800, c10 = Math.max(a10 - t10 * 0.035, 0), l10 = c10 * 0.4, u10 = l10 + (c10 - l10) / 2;
  e17.clearRect(0, 0, t10, t10), e17.beginPath(), e17.arc(a10, o10, c10, 0, ga), e17.fillStyle = `rgba(236, 254, 255, 0.4)`, e17.fill(), e17.lineWidth = Math.max(2, t10 * 5e-3), e17.strokeStyle = `#333`, e17.stroke(), qi(n10) > 60 && (e17.beginPath(), e17.arc(a10, o10, u10, 0, ga), e17.strokeStyle = `#e5e7eb`, e17.lineWidth = Math.max(1, s10), e17.stroke());
  let d10 = ((i10.getMinutes() + (i10.getSeconds() + i10.getMilliseconds() / 1e3) / 60) / 60 * 360 - 90) * (Math.PI / 180), f10 = [], p10 = `#9ca3af`;
  if (r10) {
    let s11 = r10.paused && r10.pauseAt ? r10.pauseAt : i10.getTime(), m11 = s11 < r10.start, h11 = m11 ? r10.start - s11 : r10.start - s11 - r10.skipped, g11 = m11 ? 0 : s11 - r10.start + r10.skipped, _11 = null;
    m11 && n10.phases[0] && (p10 = n10.phases[0].color, _11 = d10 + h11 / ha * ga);
    let v11 = (t11, n11, i11, s12) => {
      let f11 = t11 + n11, p11 = Math.max(t11, 0), h12 = Math.min(f11, ha);
      h12 > p11 && (e17.beginPath(), e17.arc(a10, o10, c10, d10 + p11 / ha * ga, d10 + h12 / ha * ga, false), e17.arc(a10, o10, u10, d10 + h12 / ha * ga, d10 + p11 / ha * ga, true), e17.closePath(), e17.save(), (s12 || r10.paused || m11) && (e17.globalAlpha = (s12 || m11) && r10.paused ? 0.3 : 0.8), m11 && !r10.paused && (e17.globalAlpha = 0.6), e17.fillStyle = i11, e17.fill(), e17.restore());
      let g12 = Math.max(t11, ha), _12 = Math.min(f11, 2 * ha);
      _12 > g12 && (e17.beginPath(), e17.arc(a10, o10, u10, d10 + (g12 - ha) / ha * ga, d10 + (_12 - ha) / ha * ga, false), e17.arc(a10, o10, l10, d10 + (_12 - ha) / ha * ga, d10 + (g12 - ha) / ha * ga, true), e17.closePath(), e17.save(), (s12 || r10.paused || m11) && (e17.globalAlpha = 0.6), e17.fillStyle = i11, e17.fill(), e17.restore());
    }, y11 = 0;
    for (let e18 of n10.phases) {
      let t11 = e18.min * 6e4;
      if (t11 <= 0) continue;
      let n11 = h11 + y11, r11 = Math.max(n11, 0), i11 = Math.min(n11 + t11, ha);
      if (i11 > r11 && f10.push({ angle: d10 + (r11 + i11) / 2 / ha * ga, icon: e18.icon, color: e18.color }), !m11 && g11 >= y11 && g11 < y11 + t11) {
        p10 = e18.color;
        let n12 = y11 + t11 - g11;
        n12 <= 6e4 && (_11 = d10 + n12 / ha * ga);
      }
      v11(n11, t11, e18.color, g11 < y11 && !m11), y11 += t11;
    }
    if (_11 !== null && !r10.paused) {
      e17.save(), e17.beginPath(), e17.moveTo(a10 + Math.cos(_11) * l10, o10 + Math.sin(_11) * l10), e17.lineTo(a10 + Math.cos(_11) * (c10 + t10 * 35e-4), o10 + Math.sin(_11) * (c10 + t10 * 35e-4)), e17.strokeStyle = p10, e17.lineWidth = t10 * 42e-4, e17.setLineDash([t10 * 0.0104, t10 * 83e-4]), e17.stroke(), e17.restore(), e17.save();
      let n11 = c10 - t10 * 0.06;
      e17.translate(a10 + Math.cos(_11) * n11, o10 + Math.sin(_11) * n11), e17.font = `${t10 * 0.042}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`, e17.textAlign = `center`, e17.textBaseline = `middle`, e17.fillText(`\u{1F3C1}`, 0, 0), e17.restore();
    }
  }
  for (let n11 = 0; n11 < 60; n11++) {
    let r11 = (n11 * 6 - 90) * (Math.PI / 180), i11 = n11 % 5 == 0, s11 = (i11 ? 0.0174 : 83e-4) * t10;
    e17.beginPath(), e17.moveTo(a10 + Math.cos(r11) * (c10 - s11), o10 + Math.sin(r11) * (c10 - s11)), e17.lineTo(a10 + Math.cos(r11) * (c10 - t10 * 14e-4), o10 + Math.sin(r11) * (c10 - t10 * 14e-4)), e17.strokeStyle = `#333`, e17.lineWidth = i11 ? Math.max(3, t10 * 7e-3) : Math.max(1, t10 * 3e-3), e17.stroke();
  }
  for (let t11 of f10) {
    let n11 = a10 + Math.cos(t11.angle) * c10, r11 = o10 + Math.sin(t11.angle) * c10, i11 = 27 * s10;
    e17.beginPath(), e17.arc(n11, r11, i11, 0, ga), e17.fillStyle = `#fff`, e17.fill(), e17.lineWidth = 2 * s10, e17.strokeStyle = t11.color, e17.stroke(), e17.font = `${i11 * 1.6}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Segoe UI",sans-serif`, e17.textAlign = `center`, e17.textBaseline = `middle`, e17.fillStyle = `#000`, e17.fillText(t11.icon, n11, r11 + i11 * 0.1);
  }
  let m10 = ((i10.getHours() % 12 + i10.getMinutes() / 60) * 30 - 90) * (Math.PI / 180), h10 = c10 * 0.6, g10 = 12 * s10;
  e17.beginPath(), e17.lineWidth = g10, e17.lineCap = `round`, e17.strokeStyle = `#991b1b`, e17.moveTo(a10, o10);
  let _10 = a10 + Math.cos(m10) * h10, v10 = o10 + Math.sin(m10) * h10;
  e17.lineTo(_10, v10), e17.stroke(), e17.beginPath(), e17.fillStyle = `#991b1b`, e17.arc(_10, v10, g10, 0, ga), e17.fill();
  let y10 = c10 * 0.85, b10 = 25 * s10, x10 = 20 * s10;
  e17.beginPath(), e17.lineWidth = 10 * s10, e17.lineCap = `butt`, e17.strokeStyle = `#1e3a8a`, e17.moveTo(a10, o10);
  let S10 = a10 + Math.cos(d10) * (y10 - b10), C10 = o10 + Math.sin(d10) * (y10 - b10);
  e17.lineTo(S10, C10), e17.stroke(), e17.beginPath(), e17.fillStyle = `#1e3a8a`, e17.moveTo(a10 + Math.cos(d10) * y10, o10 + Math.sin(d10) * y10);
  let w10 = -Math.sin(d10), T10 = Math.cos(d10);
  e17.lineTo(S10 + x10 / 2 * w10, C10 + x10 / 2 * T10), e17.lineTo(S10 - x10 / 2 * w10, C10 - x10 / 2 * T10), e17.closePath(), e17.fill();
  let E10 = ((i10.getSeconds() + i10.getMilliseconds() / 1e3) * 6 - 90) * (Math.PI / 180);
  return e17.beginPath(), e17.lineWidth = 3 * s10, e17.lineCap = `round`, e17.strokeStyle = `#ef4444`, e17.moveTo(a10, o10), e17.lineTo(a10 + Math.cos(E10) * c10 * 0.9, o10 + Math.sin(E10) * c10 * 0.9), e17.stroke(), e17.beginPath(), e17.arc(a10, o10, 15 * s10, 0, ga), e17.fillStyle = `#333`, e17.fill(), { col: p10 };
}
var va = { play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`, pause: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`, stop: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`, x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`, menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`, full: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`, unfull: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`, gear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>` };
var ya = (e17, t10, n10, r10) => `<div class="lh-key lh-mt-btn ${t10}" data-a="${e17}" role="button" aria-label="${n10}" title="${n10}">${r10}</div>`;
var ba = /* @__PURE__ */ new Set();
function xa(e17, t10, n10, r10, i10) {
  let a10 = Math.min(n10, r10);
  e17.innerHTML = `<div class="lh-mt${i10 ? ` is-full` : ``}" style="width:${n10}px;height:${r10}px"><div class="lh-mt-clock" style="width:${a10 * 0.94}px;height:${a10 * 0.94}px"><canvas class="lh-mt-cv"></canvas><div class="lh-mt-center" style="width:${a10 * 0.94 * 0.4}px;height:${a10 * 0.94 * 0.4}px;border-width:${Math.max(2, a10 * 55e-4)}px"><div class="lh-mt-icon" style="font-size:${a10 * 0.094}px"></div><div class="lh-mt-name" style="font-size:${a10 * 0.0376}px"></div><div class="lh-mt-time" style="font-size:${a10 * 0.061}px"></div></div></div>` + ya(`full`, `is-tr`, i10 ? `Vollbild beenden` : `Vollbild`, i10 ? va.unfull : va.full) + ya(`start`, `is-bl is-start`, `Start`, va.play) + `<div class="lh-mt-run is-bl">${ya(`skip`, ``, `Phase beenden`, va.stop)}${ya(`pause`, ``, `Pause / Weiter`, va.pause.replace(`<svg`, `<svg class="is-pause"`) + va.play.replace(`<svg`, `<svg class="is-play"`))}${ya(`reset`, `is-dark`, `Alles beenden`, va.x)}</div>` + ya(`menu`, `is-br`, `Men\xFC`, va.menu) + `<div class="lh-mt-tiny" hidden>${ya(`t-start`, `is-blue`, `Start`, va.play)}${ya(`t-skip`, `is-purple`, `Phase beenden`, va.stop)}${ya(`t-reset`, `is-red`, `Alles beenden`, va.x)}${ya(`t-full`, ``, i10 ? `Vollbild beenden` : `Vollbild`, i10 ? va.unfull : va.full)}${ya(`t-settings`, ``, `Einstellungen`, va.gear)}</div></div>`;
  let o10 = { host: e17, id: t10, full: i10, canvas: e17.querySelector(`canvas`), stopped: false };
  for (let t11 of ba) t11.host === e17 && (t11.stopped = true);
  ba.add(o10);
  let s10 = 0, c10 = 0, l10 = e17.querySelector(`.lh-mt`), u10 = l10.querySelector(`.lh-mt-center`), d10 = l10.querySelector(`.lh-mt-icon`), f10 = l10.querySelector(`.lh-mt-name`), p10 = l10.querySelector(`.lh-mt-time`), m10 = () => {
    if (o10.stopped || !e17.isConnected) {
      ba.delete(o10);
      return;
    }
    let n11 = l10.getBoundingClientRect(), r11 = l10.offsetWidth ? n11.width / l10.offsetWidth : 1;
    if (r11 > 0 && Math.abs(r11 - s10) > 0.01) {
      s10 = r11;
      let e18 = Math.min(a10 * 0.12, 40 / r11);
      l10.style.setProperty(`--b`, `${e18}px`), l10.style.setProperty(`--g`, `${Math.min(a10 * 0.04, 16 / r11)}px`), l10.style.setProperty(`--t`, `${Math.min(a10 * 0.13, 48 / r11)}px`), l10.classList.toggle(`is-tiny`, !i10 && Math.min(n11.width, n11.height) < 345);
    }
    let h11 = a10 * 0.94 * r11 * (window.devicePixelRatio || 1), g11 = Math.round(Math.min(2e3, Math.max(300, h11)));
    Math.abs(g11 - c10) > c10 * 0.08 && (c10 = g11, o10.canvas.width = o10.canvas.height = g11);
    let _10 = o10.canvas.getContext(`2d`), v10 = ta(t10), y10 = Yi.get(t10), b10 = _10 ? _a(_10, o10.canvas.width, v10, y10, /* @__PURE__ */ new Date()) : { col: `#9ca3af` };
    if (l10.classList.toggle(`is-running`, !!y10), y10) {
      let e18 = na(v10, y10, Date.now()), t11 = e18.waiting ? v10.phases[0] : v10.phases[e18.idx];
      if (t11) {
        d10.textContent !== t11.icon && (d10.textContent = t11.icon), f10.textContent !== t11.name && (f10.textContent = t11.name), f10.style.color = t11.color;
        let n12 = e18.waiting ? t11.min * 60 : Math.ceil(e18.rem / 1e3), r12 = `${Math.floor(n12 / 60)}:${String(n12 % 60).padStart(2, `0`)}`;
        p10.textContent !== r12 && (p10.textContent = r12);
      }
      u10.style.borderColor = b10.col, u10.classList.toggle(`is-waiting`, e18.waiting && !y10.paused), u10.classList.toggle(`is-blink`, !e18.waiting && !y10.paused && e18.rem < 6e4), u10.classList.toggle(`is-paused`, y10.paused), l10.style.setProperty(`--col`, b10.col), l10.classList.toggle(`is-paused`, y10.paused);
    } else u10.style.borderColor = `#e5e7eb`;
    requestAnimationFrame(m10);
  };
  requestAnimationFrame(m10);
  let h10 = l10.querySelector(`.lh-mt-tiny`), g10 = (e18 = h10.hidden) => {
    if (h10.hidden = !e18, !e18) return;
    let n11 = Yi.get(t10), r11 = h10.querySelector(`[data-a="t-start"]`), i11 = n11 ? n11.paused ? `Weiter` : `Pause` : `Start`;
    r11.innerHTML = n11 && !n11.paused ? va.pause : va.play, r11.title = i11, r11.setAttribute(`aria-label`, i11), r11.className = `lh-key lh-mt-btn ${n11 ? n11.paused ? `is-green` : `is-yellow` : `is-blue`}`;
  };
  i10 && e17.classList.add(`is-armed`), Si(e17, { slide: false, hit: (e18) => {
    let n11 = e18.getAttribute(`data-a`) ?? ``;
    return !n11.startsWith(`t-`) && n11 !== `menu` && g10(false), n11 === `start` ? ia(t10) : n11 === `pause` ? aa(t10) : n11 === `skip` ? oa(t10) : n11 === `reset` ? sa(t10) : n11 === `full` || n11 === `t-full` ? (g10(false), i10 ? wa() : Ca(t10)) : n11 === `menu` ? i10 || l10.classList.contains(`is-tiny`) ? g10() : Na(t10) : n11 === `t-start` ? (g10(false), Yi.has(t10) ? aa(t10) : ia(t10)) : n11 === `t-skip` ? (g10(false), oa(t10)) : n11 === `t-reset` ? (g10(false), sa(t10)) : n11 === `t-settings` && (g10(false), Na(t10)), null;
  } });
}
var Sa = null;
function Ca(e17) {
  wa();
  let t10 = document.createElement(`div`);
  t10.className = `lh-mt-fullbox bd-ui`, t10.setAttribute(`role`, `dialog`), t10.setAttribute(`aria-label`, `Multi-Timer im Vollbild`), document.body.appendChild(t10), Sa = t10, t10.dataset.overlayOpen = `true`;
  let n10 = () => xa(t10, e17, window.innerWidth, window.innerHeight, true);
  n10();
  let r10 = () => Sa === t10 && n10();
  window.addEventListener(`resize`, r10);
  let i10 = (e18) => {
    e18.key === `Escape` && Sa === t10 && (e18.stopPropagation(), e18.preventDefault(), wa());
  };
  window.addEventListener(`keydown`, i10, true), t10.addEventListener(`lh-close`, () => {
    window.removeEventListener(`resize`, r10), window.removeEventListener(`keydown`, i10, true);
  }), !(/iPad|iPhone|iPod/.test(navigator.userAgent) || /Macintosh/.test(navigator.userAgent) && `ontouchend` in document) && document.fullscreenEnabled && t10.requestFullscreen?.().catch(() => void 0);
  let a10 = () => {
    !document.fullscreenElement && Sa === t10 && t10.dataset.fs === `1` && wa(), t10.dataset.fs = document.fullscreenElement === t10 ? `1` : ``;
  };
  document.addEventListener(`fullscreenchange`, a10), t10.addEventListener(`lh-close`, () => document.removeEventListener(`fullscreenchange`, a10));
}
function wa() {
  let e17 = Sa;
  e17 && (Sa = null, e17.dispatchEvent(new Event(`lh-close`)), document.fullscreenElement === e17 && document.exitFullscreen?.().catch(() => void 0), e17.remove());
}
var Ta = null;
function Ea(e17) {
  Ta = e17;
}
var Da = 0;
function Oa(e17, t10) {
  if (Xi.set(e17, t10), Ta) {
    clearTimeout(Da);
    let n10 = Ta;
    Da = window.setTimeout(() => n10(e17, t10), 350);
  } else Zi.set(e17, t10), ea();
}
var ka = `.lh-mts-back{position:fixed;inset:0;z-index:2147482000;background:rgba(0,0,0,.4);display:flex;align-items:flex-end;justify-content:center;font:15px/1.4 "Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1f2937}
@media (min-width:640px){.lh-mts-back{align-items:center}}
.lh-mts{background:#fff;width:100%;max-width:560px;max-height:90vh;max-height:90dvh;display:flex;flex-direction:column;border-radius:16px 16px 0 0;box-shadow:0 25px 50px -12px rgba(0,0,0,.25);padding:16px 18px;box-sizing:border-box;touch-action:manipulation}
@media (min-width:640px){.lh-mts{border-radius:16px;max-height:86vh}}
.lh-mts *{box-sizing:border-box}
.lh-mts-head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #f9fafb;padding-bottom:8px;margin-bottom:14px}
.lh-mts-head h2{font-size:18px;font-weight:700;margin:0}
.lh-mts-done{color:#2563eb;background:#eff6ff;border:0;border-radius:6px;padding:6px 14px;font:inherit;font-weight:700;cursor:pointer}
.lh-mts-body{overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:14px;padding-bottom:12px}
.lh-mts-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:14px;border-bottom:1px solid #f3f4f6}
.lh-mts-row b{display:block;font-size:14px;color:#374151}.lh-mts-row small{display:block;font-size:12px;color:#9ca3af}
.lh-mts-num{display:flex;align-items:center;gap:4px;background:#f9fafb;border-radius:8px;padding:4px;flex-shrink:0}
.lh-mts-num button{width:34px;height:34px;border:0;background:#fff;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.12);font:inherit;font-weight:700;color:#4b5563;cursor:pointer}
.lh-mts-num input{width:34px;text-align:center;border:0;background:transparent;font:700 14px ui-monospace,Menlo,monospace;-moz-appearance:textfield}
.lh-mts-num input::-webkit-inner-spin-button,.lh-mts-num input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.lh-mts select{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:8px;font:inherit;font-size:14px}
.lh-mts-list{display:flex;flex-direction:column;gap:10px}
.lh-mts-ph{display:flex;align-items:center;gap:8px;background:#fff}
.lh-mts-ph.is-drag{opacity:.6}
.lh-mts-grip{color:#d1d5db;cursor:grab;touch-action:none;padding:4px;display:flex}
.lh-mts-grip svg{width:16px;height:16px}
.lh-mts-dot{width:18px;height:18px;border-radius:50%;border:0;box-shadow:0 1px 2px rgba(0,0,0,.15);cursor:pointer;flex-shrink:0}
.lh-mts-emo{width:42px;height:42px;display:flex;align-items:center;justify-content:center;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;font-size:22px;cursor:pointer;flex-shrink:0}
.lh-mts-name{flex:1;min-width:0;border:0;border-bottom:1px solid #e5e7eb;font:inherit;font-size:14px;padding:4px 2px;margin:0 6px;background:transparent}
.lh-mts-name:focus{outline:none;border-color:#3b82f6}
.lh-mts-del{width:26px;height:26px;border:0;background:none;color:#d1d5db;font-size:18px;cursor:pointer;flex-shrink:0}
.lh-mts-del:hover{color:#ef4444}
.lh-mts-add{width:100%;padding:9px;border:2px dashed #e5e7eb;border-radius:12px;background:none;color:#9ca3af;font:inherit;font-weight:700;font-size:14px;cursor:pointer}
.lh-mts-add:hover{border-color:#60a5fa;color:#3b82f6}
.lh-mts-err{color:#ef4444;font-size:12px;font-weight:700;text-align:right;min-height:16px}
.lh-mts-foot{border-top:1px solid #f3f4f6;padding-top:10px;text-align:center;font-size:11px;color:#94a3b8}
.lh-mts-pop{position:fixed;inset:0;z-index:2147482100;background:rgba(0,0,0,.4);display:flex;align-items:flex-end;justify-content:center}
@media (min-width:640px){.lh-mts-pop{align-items:center}}
.lh-mts-pop>div{background:#fff;width:100%;max-width:400px;max-height:80vh;max-height:80dvh;border-radius:24px 24px 0 0;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,.25)}
@media (min-width:640px){.lh-mts-pop>div{border-radius:16px}}
.lh-mts-pophead{padding:14px 16px;background:#f9fafb;border-bottom:1px solid #f3f4f6;display:flex;flex-direction:column;gap:10px}
.lh-mts-pophead>div{display:flex;justify-content:space-between;align-items:center}
.lh-mts-pophead h3{margin:0;font-size:16px}
.lh-mts-pophead button{width:32px;height:32px;border:0;border-radius:50%;background:none;font-size:16px;color:#6b7280;cursor:pointer}
.lh-mts-pophead input{width:100%;border:1px solid #e5e7eb;border-radius:12px;padding:8px;text-align:center;font-size:20px}
.lh-mts-grid{padding:14px 16px;overflow-y:auto;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;align-content:start}
.lh-mts-grid h4{grid-column:span 6;margin:10px 0 2px;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:#9ca3af}
.lh-mts-grid button{aspect-ratio:1;border:0;border-radius:8px;background:rgba(249,250,251,.6);font-size:24px;cursor:pointer;padding:0}
.lh-mts-grid button.is-col{border-radius:50%}`;
function Aa() {
  if (document.getElementById(`lh-mts-css`)) return;
  let e17 = document.createElement(`style`);
  e17.id = `lh-mts-css`, e17.textContent = ka, document.head.appendChild(e17);
}
var ja = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/"/g, `&quot;`);
var Ma = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>`;
function Na(e17) {
  Aa(), document.querySelector(`.lh-mts-back`)?.remove();
  let t10 = structuredClone(ta(e17)), n10 = document.createElement(`div`);
  n10.className = `lh-mts-back bd-ui`, n10.dataset.overlayOpen = `true`, n10.innerHTML = `<div class="lh-mts" role="dialog" aria-label="Timer Konfiguration"><div class="lh-mts-head"><h2>Timer Konfiguration</h2><button type="button" class="lh-mts-done">Fertig</button></div>
<div class="lh-mts-body">
<div class="lh-mts-row"><div><b>Start-Verz\xF6gerung</b><small>Minuten bis Start (aufgerundet)</small></div><div class="lh-mts-num"><button type="button" data-d="-1">-</button><input type="number" min="1" max="60" class="lh-mts-delay"><button type="button" data-d="1">+</button></div></div>
<div class="lh-mts-row"><div><b>Tonsignal</b><small>Signal bei Phasenwechsel</small></div><select class="lh-mts-sound">${Hi.map((e18) => `<option value="${e18.id}">${e18.label}</option>`).join(``)}</select></div>
<div class="lh-mts-list"></div>
<button type="button" class="lh-mts-add">+ Timer hinzuf\xFCgen</button>
<div class="lh-mts-err"></div>
</div>
<div class="lh-mts-foot">Visueller Multi-Timer \xB7 lernsachen.blog</div></div>`, document.body.appendChild(n10);
  let r10 = n10.querySelector(`.lh-mts-list`), i10 = n10.querySelector(`.lh-mts-delay`), a10 = n10.querySelector(`.lh-mts-sound`), o10 = n10.querySelector(`.lh-mts-add`), s10 = n10.querySelector(`.lh-mts-err`), c10 = 0, l10 = () => {
    s10.textContent = `Max. 120 Min!`, clearTimeout(c10), c10 = window.setTimeout(() => s10.textContent = ``, 3e3);
  }, u10 = () => Oa(e17, structuredClone(t10)), d10 = (n11) => {
    let r11 = t10.delay;
    t10.delay = Math.max(1, Math.min(60, Math.round(n11) || 1)), i10.value = String(t10.delay);
    let a11 = Yi.get(e17);
    a11 && t10.delay !== r11 && (a11.start += (t10.delay - r11) * 6e4, ea()), u10();
  };
  i10.value = String(t10.delay), a10.value = t10.sound;
  let f10 = () => {
    r10.innerHTML = t10.phases.map((e18, n11) => `<div class="lh-mts-ph" data-i="${n11}"><span class="lh-mts-grip" aria-label="Verschieben">${Ma}</span><button type="button" class="lh-mts-dot" data-a="color" style="background:${e18.color}" aria-label="Farbe"></button><button type="button" class="lh-mts-emo" data-a="emoji" aria-label="Symbol">${ja(e18.icon)}</button><input type="text" class="lh-mts-name" value="${ja(e18.name)}" aria-label="Name"><div class="lh-mts-num"><button type="button" data-a="dec">-</button><input type="number" min="0" max="60" value="${e18.min}" class="lh-mts-min" aria-label="Minuten"><button type="button" data-a="inc">+</button></div>${t10.phases.length > 1 ? `<button type="button" class="lh-mts-del" data-a="del" aria-label="Entfernen">\u2715</button>` : ``}</div>`).join(``), o10.style.display = t10.phases.length >= 9 ? `none` : ``;
  };
  f10();
  let p10 = (e18, n11) => {
    n11 = Math.max(0, Math.min(60, Math.round(n11) || 0)), qi(t10) - t10.phases[e18].min + n11 > 120 ? (l10(), f10()) : (t10.phases[e18].min = n11, f10(), u10());
  };
  n10.addEventListener(`click`, (e18) => {
    let r11 = e18.target;
    if (r11 === n10 || r11.closest(`.lh-mts-done`)) {
      v10();
      return;
    }
    let i11 = r11.closest(`[data-d]`);
    i11 && d10(t10.delay + Number(i11.dataset.d)), r11.closest(`.lh-mts-add`) && t10.phases.length < 9 && (t10.phases.push({ min: Math.min(15, Math.max(0, 120 - qi(t10))), name: `Phase ${t10.phases.length + 1}`, icon: `\u23F1\uFE0F`, color: zi[t10.phases.length % zi.length] }), f10(), u10());
    let a11 = r11.closest(`[data-a]`), o11 = r11.closest(`.lh-mts-ph`);
    if (!a11 || !o11) return;
    let s11 = Number(o11.dataset.i);
    a11.dataset.a === `inc` ? p10(s11, t10.phases[s11].min + 1) : a11.dataset.a === `dec` ? p10(s11, t10.phases[s11].min - 1) : a11.dataset.a === `del` && t10.phases.length > 1 ? (t10.phases.splice(s11, 1), f10(), u10()) : a11.dataset.a === `color` ? h10(s11) : a11.dataset.a === `emoji` && g10(s11);
  }), n10.addEventListener(`input`, (e18) => {
    let n11 = e18.target, r11 = n11.closest(`.lh-mts-ph`);
    r11 && n11.classList.contains(`lh-mts-name`) && (t10.phases[Number(r11.dataset.i)].name = n11.value.slice(0, 40), u10());
  }), n10.addEventListener(`change`, (e18) => {
    let n11 = e18.target, r11 = n11.closest(`.lh-mts-ph`);
    r11 && n11.classList.contains(`lh-mts-min`) ? p10(Number(r11.dataset.i), Number(n11.value)) : n11 === i10 ? d10(Number(n11.value)) : n11 === a10 && (t10.sound = a10.value, u10(), t10.sound !== `mute` && setTimeout(() => pa(t10.sound), 50));
  }), r10.addEventListener(`pointerdown`, (e18) => {
    let n11 = e18.target.closest(`.lh-mts-grip`), i11 = n11?.closest(`.lh-mts-ph`);
    if (!n11 || !i11) return;
    e18.preventDefault();
    let a11 = Number(i11.dataset.i);
    i11.classList.add(`is-drag`);
    let o11 = a11, s11 = (e19) => {
      let t11 = [...r10.querySelectorAll(`.lh-mts-ph`)];
      o11 = t11.length - 1;
      for (let [n13, r11] of t11.entries()) {
        let t12 = r11.getBoundingClientRect();
        if (e19.clientY < t12.top + t12.height / 2) {
          o11 = n13;
          break;
        }
      }
      let n12 = t11[o11];
      n12 && n12 !== i11 && (o11 > [...r10.children].indexOf(i11) ? n12.after(i11) : n12.before(i11));
    }, c11 = () => {
      window.removeEventListener(`pointermove`, s11), window.removeEventListener(`pointerup`, c11), window.removeEventListener(`pointercancel`, c11);
      let e19 = [...r10.querySelectorAll(`.lh-mts-ph`)].map((e20) => Number(e20.dataset.i)), n12 = e19.map((e20) => t10.phases[e20]);
      e19.some((e20, t11) => e20 !== t11) && (t10.phases = n12, u10()), f10();
    };
    window.addEventListener(`pointermove`, s11), window.addEventListener(`pointerup`, c11), window.addEventListener(`pointercancel`, c11);
  });
  let m10 = (e18, t11, n11 = false) => {
    let r11 = document.createElement(`div`);
    return r11.className = `lh-mts-pop bd-ui`, r11.innerHTML = `<div><div class="lh-mts-pophead"><div><h3>${e18}</h3><button type="button" class="lh-mts-x" aria-label="Schlie\xDFen">\u2715</button></div>${n11 ? `<input type="text" class="lh-mts-own" placeholder="Eigene Eingabe\u2026">` : ``}</div><div class="lh-mts-grid">${t11}</div></div>`, document.body.appendChild(r11), r11.addEventListener(`click`, (e19) => {
      (e19.target === r11 || e19.target.closest(`.lh-mts-x`)) && r11.remove();
    }), r11;
  }, h10 = (e18) => {
    let n11 = m10(`Farbe w\xE4hlen`, Bi.map((e19) => `<button type="button" class="is-col" data-c="${e19}" style="background:${e19}" aria-label="${e19}"></button>`).join(``));
    n11.addEventListener(`click`, (r11) => {
      let i11 = r11.target.closest(`[data-c]`);
      i11 && (t10.phases[e18].color = i11.dataset.c, n11.remove(), f10(), u10());
    });
  }, g10 = (e18) => {
    let n11 = m10(`Symbol w\xE4hlen`, Object.entries(Vi).map(([e19, t11]) => `<h4>${ja(e19)}</h4>${t11.map((e20) => `<button type="button" data-e="${ja(e20)}">${e20}</button>`).join(``)}`).join(``), true), r11 = n11.querySelector(`.lh-mts-own`);
    r11.value = t10.phases[e18].icon, r11.addEventListener(`input`, () => {
      let n12 = [...new Intl.Segmenter(`de`, { granularity: `grapheme` }).segment(r11.value)].map((e19) => e19.segment), i11 = n12[n12.length - 1] ?? ``;
      r11.value = i11, t10.phases[e18].icon = i11 || `?`, f10(), u10();
    }), n11.addEventListener(`click`, (r12) => {
      let i11 = r12.target.closest(`[data-e]`);
      i11 && (t10.phases[e18].icon = i11.dataset.e, n11.remove(), f10(), u10());
    });
  }, _10 = (e18) => {
    if (e18.key !== `Escape`) return;
    e18.stopPropagation(), e18.preventDefault();
    let t11 = document.querySelector(`.lh-mts-pop`);
    t11 ? t11.remove() : v10();
  };
  window.addEventListener(`keydown`, _10, true);
  let v10 = () => {
    window.removeEventListener(`keydown`, _10, true), document.querySelectorAll(`.lh-mts-pop`).forEach((e18) => e18.remove()), n10.remove(), Da && Ta && (clearTimeout(Da), Da = 0, Ta(e17, structuredClone(t10)));
  };
  for (let e18 of [n10, r10]) for (let t11 of [`pointerdown`, `touchstart`]) e18.addEventListener(t11, (e19) => e19.stopPropagation());
}
function Pa(e17, t10, n10, r10, i10, a10) {
  let o10 = (n11, r11) => `${(e17 + Math.cos(r11) * n11).toFixed(1)} ${(t10 + Math.sin(r11) * n11).toFixed(1)}`, s10 = +(a10 - i10 > Math.PI);
  return `M${o10(n10, i10)}A${n10} ${n10} 0 ${s10} 1 ${o10(n10, a10)}L${o10(r10, a10)}A${r10} ${r10} 0 ${s10} 0 ${o10(r10, i10)}Z`;
}
function Fa(e17, t10, n10) {
  let r10 = Math.min(t10, n10), i10 = r10 * 0.94, a10 = (t10 - i10) / 2, o10 = (n10 - i10) / 2, s10 = a10 + i10 / 2, c10 = o10 + i10 / 2, l10 = i10 / 800, u10 = i10 / 2 - i10 * 0.035, d10 = u10 * 0.4, f10 = d10 + (u10 - d10) / 2, p10 = -Math.PI / 2, m10 = `<svg xmlns="http://www.w3.org/2000/svg" width="${t10}" height="${n10}" viewBox="0 0 ${t10} ${n10}"><rect width="${t10}" height="${n10}" rx="${r10 * 0.04}" fill="#fff"/>`;
  m10 += `<circle cx="${s10}" cy="${c10}" r="${u10}" fill="rgba(236,254,255,0.4)" stroke="#333" stroke-width="${Math.max(2, i10 * 5e-3)}"/>`;
  let h10 = 0, g10 = [];
  for (let [t11, n11] of e17.phases.entries()) {
    let e18 = n11.min / 60;
    if (e18 <= 0) continue;
    let r11 = h10, i11 = h10 + e18, a11 = t11 ? 0.8 : 1;
    if (r11 < 1 && (m10 += `<path d="${Pa(s10, c10, u10, f10, p10 + r11 * ga, p10 + Math.min(i11, 1) * ga - 1e-4)}" fill="${n11.color}" fill-opacity="${a11}"/>`), i11 > 1 && (m10 += `<path d="${Pa(s10, c10, f10, d10, p10 + (Math.max(r11, 1) - 1) * ga, p10 + (Math.min(i11, 2) - 1) * ga - 1e-4)}" fill="${n11.color}" fill-opacity="0.6"/>`), r11 < 1) {
      let e19 = p10 + (r11 + Math.min(i11, 1)) / 2 * ga, t12 = s10 + Math.cos(e19) * u10, a12 = c10 + Math.sin(e19) * u10, o11 = 27 * l10;
      g10.push(`<circle cx="${t12}" cy="${a12}" r="${o11}" fill="#fff" stroke="${n11.color}" stroke-width="${2 * l10}"/><text x="${t12}" y="${a12 + o11 * 0.55}" font-size="${o11 * 1.5}" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">${ja(n11.icon)}</text>`);
    }
    h10 = i11;
  }
  qi(e17) > 60 && (m10 += `<circle cx="${s10}" cy="${c10}" r="${f10}" fill="none" stroke="#e5e7eb" stroke-width="${Math.max(1, l10)}"/>`);
  for (let e18 = 0; e18 < 60; e18++) {
    let t11 = (e18 * 6 - 90) * (Math.PI / 180), n11 = e18 % 5 == 0, r11 = (n11 ? 0.0174 : 83e-4) * i10;
    m10 += `<line x1="${s10 + Math.cos(t11) * (u10 - r11)}" y1="${c10 + Math.sin(t11) * (u10 - r11)}" x2="${s10 + Math.cos(t11) * (u10 - i10 * 14e-4)}" y2="${c10 + Math.sin(t11) * (u10 - i10 * 14e-4)}" stroke="#333" stroke-width="${n11 ? Math.max(3, i10 * 7e-3) : Math.max(1, i10 * 3e-3)}"/>`;
  }
  m10 += g10.join(``);
  let _10 = (e18, t11, n11, r11, i11) => {
    let a11 = (e18 - 90) * (Math.PI / 180);
    return `<line x1="${s10}" y1="${c10}" x2="${s10 + Math.cos(a11) * t11}" y2="${c10 + Math.sin(a11) * t11}" stroke="${r11}" stroke-width="${n11}" stroke-linecap="${i11}"/>`;
  }, v10 = Math.PI / 180 * 210;
  m10 += _10(300, u10 * 0.6, 12 * l10, `#991b1b`, `round`) + `<circle cx="${s10 + Math.cos(v10) * u10 * 0.6}" cy="${c10 + Math.sin(v10) * u10 * 0.6}" r="${12 * l10}" fill="#991b1b"/>`, m10 += _10(0, u10 * 0.85 - 25 * l10, 10 * l10, `#1e3a8a`, `butt`) + `<path d="M${s10} ${c10 - u10 * 0.85}L${s10 + 10 * l10} ${c10 - u10 * 0.85 + 25 * l10}L${s10 - 10 * l10} ${c10 - u10 * 0.85 + 25 * l10}Z" fill="#1e3a8a"/>`, m10 += _10(240, u10 * 0.9, 3 * l10, `#ef4444`, `round`) + `<circle cx="${s10}" cy="${c10}" r="${15 * l10}" fill="#333"/>`;
  let y10 = e17.phases.find((e18) => e18.min > 0) ?? e17.phases[0];
  if (y10) {
    let e18 = i10 * 0.2;
    m10 += `<circle cx="${s10}" cy="${c10}" r="${e18}" fill="#fff" stroke="${y10.color}" stroke-width="${Math.max(2, r10 * 55e-4)}"/>`, m10 += `<text x="${s10}" y="${c10 - e18 * 0.18}" font-size="${i10 * 0.094}" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">${ja(y10.icon)}</text>`, m10 += `<text x="${s10}" y="${c10 + e18 * 0.3}" font-size="${i10 * 0.0376}" font-weight="700" text-anchor="middle" fill="${y10.color}" font-family="Segoe UI,Roboto,Helvetica,Arial,sans-serif">${ja(y10.name.slice(0, 18))}</text>`, m10 += `<text x="${s10}" y="${c10 + e18 * 0.68}" font-size="${i10 * 0.061}" font-weight="700" text-anchor="middle" fill="#111827" font-family="ui-monospace,Menlo,monospace">${y10.min}:00</text>`;
  }
  return m10 + `</svg>`;
}
function Ia(e17, t10, n10, r10) {
  $i();
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h)), o10 = Zi.get(t10.id) ?? Ki(t10.multi), s10 = `${i10}x${a10}|${n10}|${JSON.stringify(o10)}`;
  if (e17.dataset.k !== s10) {
    if (e17.dataset.k = s10, e17.setAttribute(`aria-label`, La(o10)), !n10) {
      let t11 = document.createElement(`img`);
      t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false;
      let n11 = Fa(o10, i10, a10);
      t11.src = r10.stickerUrl ? r10.stickerUrl(n11) : `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(n11), t11.style.width = `${i10}px`, t11.style.height = `${a10}px`, e17.replaceChildren(t11);
    } else Xi.set(t10.id, o10), t10.locked && e17.classList.add(`is-armed`), xa(e17, t10.id, i10, a10, false);
  }
}
function La(e17) {
  let t10 = e17.phases.filter((e18) => e18.min > 0);
  return `Multi-Timer mit ${t10.length === 1 ? `einer Phase` : `${t10.length} Phasen`}: ${t10.map((e18) => `${e18.name || `Phase`} ${e18.min} ${e18.min === 1 ? `Minute` : `Minuten`}`).join(`, `)}.`;
}
var Ra = `
.lh-mt{position:relative;box-sizing:border-box;background:#fff;border-radius:calc(var(--b,40px)*.6);box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);overflow:hidden;font-family:"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-user-select:none;user-select:none;touch-action:manipulation}
.lh-mt.is-full{border-radius:0;box-shadow:none}
.lh-mt-clock{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
.lh-mt-cv{display:block;width:100%;height:100%}
.lh-mt-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:none;flex-direction:column;align-items:center;justify-content:center;background:#fff;border-radius:50%;border-style:solid;border-color:#e5e7eb;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);box-sizing:border-box;transition:border-color .3s,opacity .3s;z-index:2}
.lh-mt.is-running .lh-mt-center{display:flex}
.lh-mt-icon{line-height:1;margin-bottom:2%}
.lh-mt-name{font-weight:700;color:#1f2937;line-height:1.25;text-align:center;padding:0 10%;width:100%;box-sizing:border-box;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lh-mt-time{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:700;color:#111827;line-height:1;margin-top:2%}
.lh-mt-center.is-paused{opacity:.5}
.lh-mt-center.is-waiting{animation:lh-mt-wait 2s ease-in-out infinite}
.lh-mt-center.is-blink{animation:lh-mt-blink 1s infinite;border-color:#ef4444!important}
@keyframes lh-mt-wait{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1)}50%{opacity:.7;transform:translate(-50%,-50%) scale(.98)}}
@keyframes lh-mt-blink{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.7)}50%{box-shadow:0 0 0 calc(var(--b,40px)*.25) rgba(239,68,68,0)}}
.lh-mt-btn{position:absolute;z-index:3;width:var(--b,40px);height:var(--b,40px);border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.9);color:#4b5563;border:1px solid #f3f4f6;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);box-sizing:border-box;cursor:pointer;transition:transform .15s}
.lh-mt-btn:active{transform:scale(.95)}
.lh-mt-btn svg{width:50%;height:50%;pointer-events:none}
.lh-mt-btn.is-tr{top:var(--g,16px);right:var(--g,16px)}
.lh-mt-btn.is-br{bottom:var(--g,16px);right:var(--g,16px)}
.lh-mt-btn.is-bl,.lh-mt-run.is-bl{bottom:var(--g,16px);left:var(--g,16px)}
.lh-mt-btn.is-start{background:#2563eb;color:#fff;border:2px solid #fff;box-shadow:0 0 0 2px #dbeafe,0 10px 15px -3px rgba(0,0,0,.1)}
.lh-mt-run{position:absolute;z-index:3;display:none;gap:calc(var(--b,40px)*.1)}
.lh-mt-run .lh-mt-btn{position:relative;color:var(--col,#4b5563)}
.lh-mt-run .lh-mt-btn.is-dark{color:#111827}
.lh-mt.is-running .lh-mt-run{display:flex}
.lh-mt.is-running .lh-mt-btn.is-start{display:none}
.lh-mt-run [data-a="pause"] .is-play,.lh-mt.is-paused .lh-mt-run [data-a="pause"] .is-pause{display:none}
.lh-mt.is-paused .lh-mt-run [data-a="pause"] .is-play{display:block}
.lh-mt.is-tiny>.lh-mt-btn.is-tr,.lh-mt.is-tiny>.lh-mt-btn.is-start,.lh-mt.is-tiny>.lh-mt-run,.lh-mt.is-full>.lh-mt-btn.is-tr,.lh-mt.is-full>.lh-mt-btn.is-start,.lh-mt.is-full>.lh-mt-run{display:none!important}
.lh-mt-tiny{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5;display:grid;grid-template-columns:repeat(3,var(--t,48px));gap:calc(var(--t,48px)*.25);padding:calc(var(--t,48px)*.33);background:rgba(255,255,255,.95);border:1px solid #e5e7eb;border-radius:calc(var(--t,48px)*.33);box-shadow:0 25px 50px -12px rgba(0,0,0,.25)}
.lh-mt-tiny[hidden]{display:none}
.lh-mt-tiny .lh-mt-btn{position:relative;width:var(--t,48px);height:var(--t,48px);border-radius:calc(var(--t,48px)*.25);color:#374151;box-shadow:0 1px 2px rgba(0,0,0,.05)}
.lh-mt-tiny .is-blue{color:#2563eb}.lh-mt-tiny .is-purple{color:#9333ea}.lh-mt-tiny .is-red{color:#dc2626}.lh-mt-tiny .is-green{color:#16a34a}.lh-mt-tiny .is-yellow{color:#ca8a04}
.lh-edit .lh-wg-multitimer:not(.is-armed) .lh-mt-btn{cursor:inherit}
.lh-mt-fullbox{position:fixed;inset:0;z-index:2147481000;background:#fff}
@media (prefers-reduced-motion:reduce){.lh-mt-center{animation:none!important}}`;
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
var mo = (e17) => ro.find((t10) => t10.id === e17) ?? ro[0];
var ho = (e17) => ao.find((t10) => t10.id === e17) ?? ao[0];
var go = (e17) => (e17 % 12 + 12) % 12;
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
function To(e17, t10) {
  return e17.scale === `blues` && go(t10 - e17.root) === 6 ? so[go(t10)] : yo(t10, vo(e17));
}
var ko = (e17) => 440 * 2 ** ((e17 - 69) / 12);
function Po(e17) {
  let t10 = mo(e17.skin).label;
  return e17.scale === `all` ? t10 : `${t10} in ${xo(e17)}`;
}
var Fo = { kick: `Bass`, snare: `Snare`, hihat: `Hi-Hat`, hihatOpen: `Hi-Hat offen`, tom1: `Tom 1`, tom2: `Tom 2`, floortom: `Standtom`, crash: `Becken`, ride: `Ride`, clap: `Klatschen`, cajonBass: `Caj\xF3n Bass`, cajonSlap: `Caj\xF3n Slap`, bongoHigh: `Bongo hoch`, bongoLow: `Bongo tief`, congaHigh: `Conga hoch`, congaLow: `Conga tief`, handdrum: `Handtrommel`, triangle: `Triangel`, tambourine: `Schellenkranz`, claves: `Klangh\xF6lzer`, shaker: `Rassel`, cymbal: `Becken`, woodblock: `Holzblock`, cowbell: `Kuhglocke` };
var Lo = [{ id: `drumset`, label: `Schlagzeug` }, { id: `cajon`, label: `Caj\xF3n` }, { id: `hand`, label: `Bongos & Congas` }, { id: `orff`, label: `Orff-Instrumente` }, { id: `pads`, label: `Klang-Pads` }];
var Bo = (e17) => Lo.find((t10) => t10.id === e17)?.label ?? `Schlagzeug`;
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
var $c = (e17, t10) => e17.label || (e17.drum ? Fo[e17.drum] : e17.note === void 0 ? e17.rec ? `Aufnahme` : `` : t10 ? To(t10, e17.note) : yo(e17.note));
var cu = { song: `entchen`, mode: `wait`, speed: `mid`, guide: false };
var lu = (e17) => e17.song === `custom` && e17.custom ? e17.custom : gc(e17.song);
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
function qee(e17, t10) {
  let n10 = ys();
  if (!n10) return () => void 0;
  let r10 = n10.ctx, i10 = r10.currentTime + 0.1, a10 = 0, o10 = () => {
    let n11 = r10.currentTime - i10 + 0.3;
    n11 <= a10 || (qu(e17, a10, n11, (e18, n12, a11, o11, s11) => {
      let c10 = ms(n12, a11, { when: i10 + e18, vel: s11, out: t10 });
      c10 && setTimeout(() => c10.release(), Math.max(0, (i10 + e18 + o11 - r10.currentTime) * 1e3));
    }), a10 = n11);
  };
  o10();
  let s10 = window.setInterval(o10, 60);
  return () => {
    clearInterval(s10), hs();
  };
}
var qd = 1400;
var Jd = 990;
var Yd = (e17, t10, n10) => `<defs><linearGradient id="${e17}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${t10}"/><stop offset="1" stop-color="${n10}"/></linearGradient></defs><rect width="${qd}" height="${Jd}" fill="url(#${e17})"/>`;
var Xd = [{ id: `cinema`, label: `Kino`, bg: `#0b0d12`, text: `#ffffff`, band: `rgba(0,0,0,0.62)`, accent: `#e03131`, paper: `#111827`, title: `#f8f9fa`, page: () => {
  let e17 = Yd(`sh-cinema`, `#1f2937`, `#0b0d12`);
  for (let t10 of [0, 944]) {
    e17 += `<rect x="0" y="${t10}" width="${qd}" height="46" fill="#000000" opacity="0.55"/>`;
    for (let n10 = 18; n10 < qd; n10 += 56) e17 += `<rect x="${n10}" y="${t10 + 13}" width="28" height="20" rx="4" fill="#f8f9fa" opacity="0.5"/>`;
  }
  return e17;
} }, { id: `light`, label: `Hell`, bg: `#f8f9fa`, text: `#212529`, band: `rgba(255,255,255,0.86)`, accent: `#1c7ed6`, paper: `#f8f9fa`, title: `#1c3d5a`, page: () => Yd(`sh-light`, `#ffffff`, `#e9ecef`) + `<circle cx="1260" cy="120" r="220" fill="#1c7ed6" opacity="0.06"/><circle cx="120" cy="900" r="260" fill="#1c7ed6" opacity="0.05"/>` }, { id: `polaroid`, label: `Fotoalbum`, bg: `#a47148`, text: `#3b2a1a`, band: `rgba(255,250,240,0.9)`, accent: `#8c5a2b`, paper: `#c8a27a`, title: `#3b2a1a`, page: () => {
  let e17 = Yd(`sh-cork`, `#d2ad83`, `#b88a5c`), t10 = 7, n10 = () => ((t10 = t10 * 16807 % 2147483647) - 1) / 2147483646;
  for (let t11 = 0; t11 < 260; t11++) e17 += `<circle cx="${Math.round(n10() * qd)}" cy="${Math.round(n10() * Jd)}" r="${(1 + n10() * 2.5).toFixed(1)}" fill="#6b4423" opacity="${(0.15 + n10() * 0.25).toFixed(2)}"/>`;
  return e17;
} }, { id: `colorful`, label: `Bunt`, bg: `linear-gradient(135deg,#5f3dc4,#e64980 55%,#f76707)`, text: `#ffffff`, band: `rgba(33,15,60,0.55)`, accent: `#ffd43b`, paper: `#7048e8`, title: `#ffffff`, page: () => Yd(`sh-color`, `#7048e8`, `#f76707`) + `<circle cx="1180" cy="160" r="200" fill="#ffffff" opacity="0.1"/><circle cx="200" cy="860" r="240" fill="#ffffff" opacity="0.08"/>` }, { id: `nature`, label: `Natur`, bg: `linear-gradient(160deg,#ebfbee,#b2f2bb)`, text: `#1b4332`, band: `rgba(255,255,255,0.8)`, accent: `#2f9e44`, paper: `#ebfbee`, title: `#1b4332`, page: () => {
  let e17 = Yd(`sh-nature`, `#f4fce3`, `#c3fae8`), t10 = (e18, t11, n10, r10) => `<path d="M0 0C${n10 * 0.6} ${-n10 * 0.5} ${n10 * 1.4} ${-n10 * 0.3} ${n10 * 2} 0C${n10 * 1.4} ${n10 * 0.3} ${n10 * 0.6} ${n10 * 0.5} 0 0z" transform="translate(${e18} ${t11}) rotate(${r10})" fill="#2f9e44" opacity="0.16"/>`;
  return e17 += t10(40, 120, 90, -20) + t10(1240, 80, 70, 30) + t10(1300, 900, 110, 200) + t10(80, 930, 80, -60) + t10(700, 960, 60, -10), e17;
} }];
var Zd = (e17) => Xd.find((t10) => t10.id === e17) ?? Xd[0];
var Qd = (e17 = `cinema`) => ({ title: `Meine Diaschau`, slides: [], dur: 5, transition: `fade`, caption: `bottom`, design: e17, wait: true, loop: false });
var Zee = (e17) => e17.slides.length * e17.dur;
var Qee = (e17) => `${Math.floor(e17 / 60)}:${String(Math.round(e17 % 60)).padStart(2, `0`)}`;
var $d = `Andika, Andika, Verdana, Arial, sans-serif`;
var $ee = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var ef = 1300;
var tf = 780;
function ete(e17, t10, n10, r10) {
  let i10 = Zd(e17.design), a10 = i10.id === `cinema` || i10.id === `colorful`, o10 = a10 ? `#000000` : `#ffffff`, s10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ef} ${tf}" width="${t10}" height="${n10}">`;
  s10 += `<rect width="${ef}" height="${tf}" rx="30" fill="${o10}" opacity="${a10 ? 0.55 : 0.85}"/>`;
  let c10 = e17.slides[0] ? r10(e17.slides[0].img) : void 0;
  return c10 ? i10.id === `polaroid` ? s10 += `<rect x="320" y="34" width="660" height="580" rx="6" fill="#ffffff" transform="rotate(-2 650 320)"/><image href="${c10}" x="346" y="58" width="608" height="470" preserveAspectRatio="xMidYMid slice" transform="rotate(-2 650 320)"/>` : s10 += `<image href="${c10}" x="40" y="36" width="1220" height="600" preserveAspectRatio="xMidYMid meet"/>` : (s10 += `<rect x="40" y="36" width="1220" height="600" rx="22" fill="${a10 ? `#ffffff` : `#000000`}" opacity="0.06"/>`, s10 += `<g transform="translate(590 240)" fill="none" stroke="${a10 ? `#adb5bd` : `#868e96`}" stroke-width="8" stroke-linejoin="round"><rect x="0" y="0" width="120" height="96" rx="10"/><path d="M8 84l34-36 26 26 18-16 26 26"/><circle cx="88" cy="28" r="10"/></g>`, s10 += `<text x="650" y="420" font-size="30" font-family="${$d}" font-weight="700" text-anchor="middle" fill="${a10 ? `#ced4da` : `#868e96`}">Noch keine Fotos</text>`), s10 += `<g class="lh-key" data-a="start"><rect x="390" y="660" width="520" height="96" rx="48" fill="${i10.accent}"/><path d="M462 684L500 708L462 732Z" fill="#ffffff"/><text x="680" y="722" font-size="38" font-family="${$d}" font-weight="700" text-anchor="middle" fill="#ffffff">Diaschau ansehen</text><rect class="lh-kdown" x="390" y="660" width="520" height="96" rx="48" fill="#000000" opacity="0"/><title>Diaschau ansehen</title></g>`, s10 += `<text x="1240" y="720" font-size="26" font-family="${$d}" font-weight="700" text-anchor="end" fill="${a10 ? `#dee2e6` : `#495057`}">${e17.slides.length === 1 ? `1 Foto` : `${e17.slides.length} Fotos`} \xB7 ${Qee(Zee(e17))}</text>`, s10 + `</svg>`;
}
var nf = /* @__PURE__ */ new Map();
function tte(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h)), o10 = t10.show ?? Qd();
  n10 && r10.assets && nf.set(t10.id, r10.assets);
  let s10 = r10.assets ?? (n10 ? nf.get(t10.id) : void 0) ?? {}, c10 = `${i10}x${a10}|${n10}|${JSON.stringify(o10)}|${o10.slides[0] ? !!s10[o10.slides[0].img] : ``}`;
  if (e17.dataset.k === c10) return;
  e17.dataset.k = c10, e17.setAttribute(`aria-label`, `Diaschau \u201E${o10.title}\u201C mit ${o10.slides.length} Fotos`);
  let l10 = ete(o10, i10, a10, (e18) => s10[e18]?.dataUrl);
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(l10) : $ee(l10), t11.style.width = `${i10}px`, t11.style.height = `${a10}px`, e17.replaceChildren(t11);
    return;
  }
  let u10 = document.createElement(`div`);
  u10.className = `lh-wg-pic`, u10.innerHTML = l10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(u10), t10.locked && e17.classList.add(`is-armed`), Si(e17, { slide: false, hit: (e18) => (e18.getAttribute(`data-a`) === `start` && setTimeout(() => af(o10, (e19) => s10[e19]?.dataUrl), 0), null) });
}
var nte = (e17) => {
  let t10 = e17.show ?? Qd();
  return `Diaschau \u201E${t10.title}\u201C mit ${t10.slides.length === 1 ? `einem Foto` : `${t10.slides.length} Fotos`}. Tippe auf \u201EDiaschau ansehen\u201C.`;
};
var rf = null;
function af(e17, t10) {
  rf?.();
  let n10 = e17.slides.filter((e18) => t10(e18.img));
  if (!n10.length) return;
  let r10 = Zd(e17.design), i10 = (e18, t11, n11) => {
    let r11 = document.createElement(e18);
    return r11.className = t11, n11 !== void 0 && (r11.textContent = n11), r11;
  }, a10 = i10(`div`, `lh-show lh-show-${r10.id}`);
  a10.setAttribute(`role`, `dialog`), a10.setAttribute(`aria-label`, `Diaschau: ${e17.title}`), a10.tabIndex = -1, a10.dataset.overlayOpen = ``, a10.style.setProperty(`--show-bg`, r10.bg), a10.style.setProperty(`--show-text`, r10.text), a10.style.setProperty(`--show-band`, r10.band), a10.style.setProperty(`--show-accent`, r10.accent), a10.style.setProperty(`--show-dur`, `${e17.dur}s`);
  let o10 = i10(`div`, `lh-show-stage`), s10 = i10(`div`, `lh-show-bar`), c10 = (e18, t11, n11) => {
    let r11 = i10(`button`, `lh-show-btn`);
    return r11.type = `button`, r11.setAttribute(`aria-label`, e18), r11.title = e18, r11.innerHTML = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${t11}"/></svg>`, r11.addEventListener(`click`, (e19) => {
      e19.stopPropagation(), n11();
    }), r11;
  }, l10 = i10(`span`, `lh-show-count`), u10 = `M8 5v14M16 5v14`, d10 = c10(`Zur\xFCck`, `M15 18l-6-6 6-6`, () => ie2(C10 - 1, -1)), f10 = c10(`Pause`, u10, () => ae2()), p10 = c10(`Weiter`, `M9 18l6-6-6-6`, () => ie2(C10 + 1, 1)), m10 = c10(`Diaschau beenden`, `M18 6L6 18M6 6l12 12`, () => k10());
  s10.append(d10, f10, p10, l10, m10), a10.append(o10, s10), document.body.appendChild(a10), a10.focus({ preventScroll: true });
  try {
    let e18 = a10.requestFullscreen ? a10.requestFullscreen() : a10.webkitRequestFullscreen?.();
    e18 && typeof e18.catch == `function` && e18.catch(() => void 0);
  } catch {
  }
  let h10 = ys(), g10 = h10 ? h10.ctx.createGain() : null;
  h10 && g10 && (g10.gain.value = e17.music?.vol ?? 0.6, g10.connect(h10.out));
  let _10 = e17.music?.vol ?? 0.6, v10 = null, y10 = /* @__PURE__ */ new Map(), b10 = (e18) => {
    let n11 = y10.get(e18), r11 = t10(e18);
    return !n11 && h10 && r11 && (n11 = fetch(r11).then((e19) => e19.arrayBuffer()).then((e19) => new Promise((t11) => h10.ctx.decodeAudioData(e19, t11, () => t11(null)))).catch(() => null), y10.set(e18, n11)), n11 ?? Promise.resolve(null);
  };
  h10 && g10 && e17.music && (e17.music.mood ? v10 = qee(e17.music.mood, g10) : e17.music.sound && b10(e17.music.sound).then((e18) => {
    if (!e18 || ee2) return;
    let t11 = h10.ctx.createBufferSource();
    t11.buffer = e18, t11.loop = true, t11.connect(g10), t11.start(), v10 = () => {
      try {
        t11.stop();
      } catch {
      }
    };
  }));
  let x10 = null, S10 = () => {
    if (x10) {
      x10.onended = null;
      try {
        x10.stop();
      } catch {
      }
      x10 = null, h10 && g10 && g10.gain.setTargetAtTime(_10, h10.ctx.currentTime, 0.25);
    }
  }, C10 = -1, w10 = null, T10 = 0, E10 = 0, D10 = 0, O10 = false, ee2 = false, te2 = (a11) => {
    let o11 = n10[a11], s11 = i10(`div`, `lh-show-slide t-${e17.transition} cap-${e17.caption}`), c11 = t10(o11.img) ?? ``;
    if (r10.id === `cinema`) {
      let e18 = i10(`div`, `lh-show-back`);
      e18.style.backgroundImage = `url("${c11}")`, s11.append(e18);
    }
    let l11 = i10(`div`, `lh-show-frame`), u11 = i10(`img`, `lh-show-img`);
    return u11.alt = o11.caption ?? ``, u11.src = c11, u11.draggable = false, r10.id === `polaroid` && u11.style.setProperty(`--tilt`, `${a11 % 2 ? 1.6 : -1.6}deg`), l11.append(u11), s11.append(l11), o11.caption && e17.caption !== `none` && s11.append(i10(`div`, `lh-show-cap`, o11.caption)), s11;
  }, ne2 = (e18) => {
    clearTimeout(T10), E10 = performance.now() + e18, D10 = e18, O10 || (T10 = window.setTimeout(() => ie2(C10 + 1, 1), e18));
  }, re2 = () => {
    clearTimeout(T10);
    let e18 = i10(`div`, `lh-show-end`);
    e18.append(i10(`div`, `lh-show-endtitle`, `Ende`));
    let t11 = i10(`button`, `lh-show-again`, `Nochmal ansehen`);
    t11.type = `button`, t11.addEventListener(`click`, (t12) => {
      t12.stopPropagation(), e18.remove(), ie2(0, 1);
    });
    let n11 = i10(`button`, `lh-show-again is-quiet`, `Schlie\xDFen`);
    n11.type = `button`, n11.addEventListener(`click`, (e19) => {
      e19.stopPropagation(), k10();
    }), e18.append(t11, n11), o10.append(e18);
  };
  function ie2(t11, r11) {
    if (ee2) return;
    if (t11 >= n10.length) {
      if (e17.loop) t11 = 0;
      else return re2();
    }
    t11 < 0 && (t11 = n10.length - 1), o10.querySelector(`.lh-show-end`)?.remove(), S10();
    let i11 = te2(t11);
    i11.classList.add(`is-before`), r11 < 0 && i11.classList.add(`is-back`), o10.append(i11);
    let a11 = w10;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      i11.classList.remove(`is-before`), a11 && (a11.classList.add(`is-after`), r11 < 0 && a11.classList.add(`is-back`), setTimeout(() => a11.remove(), e17.transition === `kenburns` ? 1400 : 1e3));
    })), w10 = i11, C10 = t11, l10.textContent = `${t11 + 1} / ${n10.length}`;
    let s11 = e17.dur * 1e3;
    ne2(s11);
    let c11 = n10[t11].sound;
    c11 && h10 && g10 && b10(c11).then((n11) => {
      if (!n11 || ee2 || C10 !== t11) return;
      let r12 = h10.ctx.createBufferSource();
      r12.buffer = n11, r12.connect(h10.out);
      let i12 = h10.ctx.currentTime + 0.35;
      if (r12.start(i12), x10 = r12, g10.gain.setTargetAtTime(_10 * 0.35, h10.ctx.currentTime, 0.15), r12.onended = () => {
        x10 === r12 && (x10 = null), g10.gain.setTargetAtTime(_10, h10.ctx.currentTime, 0.3);
      }, e17.wait) {
        let e18 = (n11.duration + 0.95) * 1e3, t12 = s11 - Math.max(0, E10 - performance.now());
        e18 > s11 && ne2(e18 - t12);
      }
    });
  }
  function ae2() {
    O10 = !O10, a10.classList.toggle(`is-paused`, O10), f10.setAttribute(`aria-label`, O10 ? `Weiter abspielen` : `Pause`), f10.title = O10 ? `Weiter abspielen` : `Pause`, f10.querySelector(`path`)?.setAttribute(`d`, O10 ? `M7 4l13 8-13 8z` : u10), O10 ? (clearTimeout(T10), D10 = Math.max(0, E10 - performance.now()), h10?.ctx.suspend().catch(() => void 0)) : (h10?.ctx.resume().catch(() => void 0), ne2(D10));
  }
  let oe2 = (e18) => {
    let t11 = e18.key;
    [`Escape`, `ArrowRight`, `ArrowLeft`, `ArrowDown`, `ArrowUp`, ` `, `PageDown`, `PageUp`].includes(t11) && (e18.preventDefault(), e18.stopPropagation(), t11 === `Escape` ? k10() : t11 === ` ` ? ae2() : t11 === `ArrowLeft` || t11 === `ArrowUp` || t11 === `PageUp` ? ie2(C10 - 1, -1) : ie2(C10 + 1, 1));
  };
  o10.addEventListener(`click`, (e18) => {
    e18.target.closest(`button`) || ie2(C10 + 1, 1);
  }), window.addEventListener(`keydown`, oe2, true);
  let se2 = () => {
    let e18 = document.fullscreenElement ?? document.webkitFullscreenElement;
    !e18 && ce2 && k10(), e18 && (ce2 = true);
  }, ce2 = false;
  document.addEventListener(`fullscreenchange`, se2), document.addEventListener(`webkitfullscreenchange`, se2);
  function k10() {
    if (ee2) return;
    ee2 = true, rf = null, clearTimeout(T10), S10(), v10?.(), e17.music?.mood && hs(), O10 && h10?.ctx.resume().catch(() => void 0), h10 && g10 && (g10.gain.setTargetAtTime(0, h10.ctx.currentTime, 0.05), setTimeout(() => g10.disconnect(), 400)), window.removeEventListener(`keydown`, oe2, true), document.removeEventListener(`fullscreenchange`, se2), document.removeEventListener(`webkitfullscreenchange`, se2);
    let t11 = document;
    if ((t11.fullscreenElement ?? t11.webkitFullscreenElement) === a10) try {
      let e18 = t11.exitFullscreen ? t11.exitFullscreen() : t11.webkitExitFullscreen?.();
      e18 && typeof e18.catch == `function` && e18.catch(() => void 0);
    } catch {
    }
    a10.remove();
  }
  rf = k10, ie2(0, 1);
}
var ite = `
.lh-show{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;background:var(--show-bg);color:var(--show-text);font-family:${$d};outline:none;user-select:none;-webkit-user-select:none}
.lh-show-stage{position:relative;flex:1;overflow:hidden;cursor:pointer}
.lh-show-slide{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2vmin;padding:4vmin;box-sizing:border-box;transition:opacity .9s ease,transform .9s ease}
.lh-show-back{position:absolute;inset:-40px;background-size:cover;background-position:center;filter:blur(28px) brightness(.45);transform:scale(1.1)}
.lh-show-frame{position:relative;flex:1 1 auto;min-height:0;width:100%;display:flex;align-items:center;justify-content:center}
.lh-show-img{max-width:100%;max-height:100%;object-fit:contain;border-radius:1vmin;box-shadow:0 1.5vmin 4vmin rgba(0,0,0,.35)}
.lh-show-cinema .lh-show-img{border-radius:0}
.lh-show-polaroid .lh-show-img{background:#fff;border:2vmin solid #fff;border-bottom-width:7vmin;border-radius:.4vmin;box-sizing:border-box;transform:rotate(var(--tilt,0deg));box-shadow:0 1.5vmin 3.5vmin rgba(40,20,0,.45)}
.lh-show-cap{position:relative;font-weight:700;font-size:4vmin;line-height:1.25;text-align:center;max-width:90%;padding:1vmin 3vmin;border-radius:1.5vmin;background:var(--show-band)}
.lh-show-slide.cap-top .lh-show-cap{order:-1}
.lh-show-slide.cap-lower .lh-show-cap{position:absolute;left:6%;bottom:12%;max-width:62%;text-align:left;border-radius:0 1.5vmin 1.5vmin 0;border-left:1.4vmin solid var(--show-accent);font-size:3.6vmin}
.lh-show-slide.cap-side{flex-direction:row}
.lh-show-slide.cap-side .lh-show-frame{flex:1 1 68%;height:100%}
.lh-show-slide.cap-side .lh-show-cap{flex:0 0 26%;text-align:left;font-size:3.4vmin;align-self:center}
.lh-show-slide.cap-center .lh-show-cap{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:8vmin;background:none;color:#fff;text-shadow:0 .4vmin 2vmin rgba(0,0,0,.8),0 0 .6vmin rgba(0,0,0,.6)}
.lh-show-slide.t-fade.is-before,.lh-show-slide.t-fade.is-after,.lh-show-slide.t-kenburns.is-before,.lh-show-slide.t-kenburns.is-after{opacity:0}
.lh-show-slide.t-kenburns{transition:opacity 1.3s ease}
.lh-show-slide.t-kenburns .lh-show-img{animation:lh-kb var(--show-dur) linear forwards}
.lh-show.is-paused .lh-show-img{animation-play-state:paused}
@keyframes lh-kb{from{transform:scale(1)}to{transform:scale(1.12) translate(1%,-1%)}}
.lh-show-slide.t-slide.is-before{transform:translateX(100%)}
.lh-show-slide.t-slide.is-after{transform:translateX(-100%)}
.lh-show-slide.t-slide.is-before.is-back{transform:translateX(-100%)}
.lh-show-slide.t-slide.is-after.is-back{transform:translateX(100%)}
.lh-show-slide.t-zoom.is-before{opacity:0;transform:scale(1.25)}
.lh-show-slide.t-zoom.is-after{opacity:0;transform:scale(.85)}
.lh-show-slide.t-none{transition:none}
.lh-show-slide.t-none.is-after{opacity:0}
.lh-show-bar{display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 16px calc(10px + env(safe-area-inset-bottom));opacity:.7;transition:opacity .2s}
.lh-show-bar:hover,.lh-show.is-paused .lh-show-bar{opacity:1}
.lh-show-btn{width:52px;height:52px;border:0;border-radius:50%;background:var(--show-band);color:var(--show-text);display:flex;align-items:center;justify-content:center;cursor:pointer}
.lh-show-btn:last-child{margin-left:18px}
.lh-show-count{min-width:76px;text-align:center;font-weight:700;font-size:18px}
.lh-show-end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:var(--show-bg)}
.lh-show-endtitle{font-size:9vmin;font-weight:700}
.lh-show-again{border:0;border-radius:999px;padding:14px 34px;font:700 22px/1 ${$d};background:var(--show-accent);color:#fff;cursor:pointer}
.lh-show-again.is-quiet{background:var(--show-band);color:var(--show-text)}
@media (prefers-reduced-motion:reduce){.lh-show-slide{transition:opacity .4s}.lh-show-slide.t-slide.is-before,.lh-show-slide.t-slide.is-after,.lh-show-slide.t-zoom.is-before,.lh-show-slide.t-zoom.is-after{transform:none;opacity:0}.lh-show-slide.t-kenburns .lh-show-img{animation:none}}`;
var of = 1280;
var cf = [`#e8590c`, `#7048e8`, `#0ca678`, `#e64980`];
var df = () => ({ title: `Meine Animation`, len: 5, bg: `#ffffff`, objects: [], paths: [], loop: false, auto: false, showPaths: false, poster: 0 });
var pf = (e17) => e17 ? [...e17.objects.map((e18) => e18.img), e17.bgImg].filter((e18) => !!e18) : [];
function mf(e17, t10) {
  let n10 = Math.min(1, Math.max(0, t10));
  return e17 === `in` ? n10 * n10 * n10 : e17 === `out` ? 1 - (1 - n10) ** 3 : e17 === `inout` ? n10 < 0.5 ? 4 * n10 * n10 * n10 : 1 - (-2 * n10 + 2) ** 3 / 2 : n10;
}
function hf(e17) {
  let t10 = 0;
  for (let n10 = 1; n10 < e17.pts.length; n10++) t10 += Math.hypot(e17.pts[n10][0] - e17.pts[n10 - 1][0], e17.pts[n10][1] - e17.pts[n10 - 1][1]);
  return t10;
}
function cte(e17, t10) {
  let n10 = hf(e17), r10 = Math.min(1, Math.max(0, t10)) * n10;
  for (let t11 = 1; t11 < e17.pts.length; t11++) {
    let [n11, i11] = e17.pts[t11 - 1], [a11, o10] = e17.pts[t11], s10 = Math.hypot(a11 - n11, o10 - i11);
    if (r10 <= s10 || t11 === e17.pts.length - 1) {
      let e18 = s10 ? Math.min(1, r10 / s10) : 0;
      return { x: n11 + (a11 - n11) * e18, y: i11 + (o10 - i11) * e18, angle: Math.atan2(o10 - i11, a11 - n11) * 180 / Math.PI };
    }
    r10 -= s10;
  }
  let [i10, a10] = e17.pts[0];
  return { x: i10, y: a10, angle: 0 };
}
var gf = (e17, t10) => hf(e17) / Math.max(1, t10);
var _f = (e17, t10, n10) => e17 + (t10 - e17) * n10;
function vf(e17, t10, n10) {
  let r10 = e17.keys;
  if (!r10.length) return { x: of / 2, y: 360, rot: 0, s: 1, o: 1 };
  if (t10 <= r10[0].t) {
    let e18 = r10[0];
    return { x: e18.x, y: e18.y, rot: e18.rot, s: e18.s, o: e18.o };
  }
  let i10 = r10.length - 1;
  for (; i10 > 0 && r10[i10].t > t10; ) i10--;
  let a10 = r10[i10], o10 = r10[i10 + 1], s10 = o10 ? mf(a10.ease, (t10 - a10.t) / Math.max(1e-3, o10.t - a10.t)) : 1, c10 = o10 ? { x: _f(a10.x, o10.x, s10), y: _f(a10.y, o10.y, s10), rot: _f(a10.rot, o10.rot, s10), s: _f(a10.s, o10.s, s10), o: _f(a10.o, o10.o, s10) } : { x: a10.x, y: a10.y, rot: a10.rot, s: a10.s, o: a10.o }, l10 = a10.path ? n10.paths.find((e18) => e18.id === a10.path.id) : void 0;
  if (a10.path && l10) {
    let e18 = gf(l10, a10.path.speed), n11 = cte(l10, mf(a10.ease, e18 > 0 ? (t10 - a10.t) / e18 : 1));
    c10.x = n11.x, c10.y = n11.y, a10.path.turn && (c10.rot = (o10 ? _f(a10.rot, o10.rot, s10) : a10.rot) + n11.angle);
  }
  return c10;
}
var yf = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/"/g, `&quot;`);
var bf = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var xf = (e17) => (e17.text ?? ``).split(`
`).slice(0, 3);
function Cf(e17, t10) {
  let n10 = e17.flip ? ` transform="scale(-1 1)"` : ``;
  if (e17.kind === `image`) {
    let r11 = e17.img ? t10(e17.img) : void 0;
    return r11 ? `<image href="${r11}" x="${-e17.w / 2}" y="${-e17.h / 2}" width="${e17.w}" height="${e17.h}" preserveAspectRatio="none"${n10}/>` : `<rect x="${-e17.w / 2}" y="${-e17.h / 2}" width="${e17.w}" height="${e17.h}" fill="#e9ecef"/>`;
  }
  if (e17.kind === `sticker`) return `<image href="${bf(e17.svg ?? ``)}" x="${-e17.w / 2}" y="${-e17.h / 2}" width="${e17.w}" height="${e17.h}" preserveAspectRatio="xMidYMid meet"${n10}/>`;
  let r10 = e17.size ?? 72, i10 = xf(e17), a10 = r10 * 1.2, o10 = ``;
  return e17.fill && (o10 += `<rect x="${-e17.w / 2}" y="${-e17.h / 2}" width="${e17.w}" height="${e17.h}" rx="${r10 * 0.3}" fill="${e17.fill}"/>`), o10 += `<text text-anchor="middle" dominant-baseline="central" font-family="${yf(Ve(e17.font ?? `andika`))}" font-size="${r10}" font-weight="${e17.bold ? 700 : 400}" fill="${e17.color ?? `#1f2937`}">`, i10.forEach((e18, t11) => {
    o10 += `<tspan x="0" y="${((t11 - (i10.length - 1) / 2) * a10).toFixed(1)}">${yf(e18) || ` `}</tspan>`;
  }), o10 + `</text>`;
}
var wf = (e17) => `translate(${e17.x.toFixed(1)} ${e17.y.toFixed(1)}) rotate(${e17.rot.toFixed(1)}) scale(${e17.s.toFixed(3)})`;
function Tf(e17, t10) {
  return e17.paths.map((e18, n10) => {
    let r10 = cf[n10 % cf.length], i10 = e18.pts.map(([e19, t11], n11) => `${n11 ? `L` : `M`}${e19} ${t11}`).join(``), [a10, o10] = e18.pts[0];
    return `<path d="${i10}" fill="none" stroke="${r10}" stroke-width="6" stroke-dasharray="14 10" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>${t10 ? `<circle cx="${a10}" cy="${o10}" r="20" fill="${r10}"/><text x="${a10}" y="${o10}" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-size="22" font-weight="700" fill="#ffffff">${n10 + 1}</text>` : ``}`;
  }).join(``);
}
function Ef(e17, t10) {
  let n10 = `<rect width="${of}" height="720" fill="${e17.bg}"/>`, r10 = e17.bgImg ? t10(e17.bgImg) : void 0;
  return r10 && (n10 += `<image href="${r10}" width="${of}" height="720" preserveAspectRatio="xMidYMid slice"/>`), n10;
}
function lte(e17, t10, n10, r10 = of, i10 = 720) {
  let a10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${of} 720" width="${r10}" height="${i10}" preserveAspectRatio="none">${Ef(e17, n10)}`;
  e17.showPaths && (a10 += Tf(e17, false));
  for (let r11 of e17.objects) {
    let i11 = vf(r11, t10, e17);
    a10 += `<g transform="${wf(i11)}" opacity="${i11.o}">${Cf(r11, n10)}</g>`;
  }
  return a10 += `<g transform="translate(1210 650)"><circle r="44" fill="#000000" opacity="0.45"/><path d="M-14 -22L24 0L-14 22z" fill="#ffffff"/></g>`, e17.objects.length || (a10 += `<text x="${of / 2}" y="360" text-anchor="middle" dominant-baseline="central" font-family="Verdana, sans-serif" font-size="40" fill="#868e96">Noch leer \u2013 tippe auf \u201EBearbeiten\u201C</text>`), a10 + `</svg>`;
}
var Df = (e17) => Math.min(e17.len, Math.max(0, e17.poster ?? 0));
var Of = /* @__PURE__ */ new Map();
var kf = /* @__PURE__ */ new Map();
var Af = /* @__PURE__ */ new Map();
var jf = /* @__PURE__ */ new Map();
var Mf = /* @__PURE__ */ new WeakMap();
var Nf = 0;
var Pf = (e17, t10 = performance.now()) => {
  let n10 = Of.get(e17);
  return n10 ? n10.playing ? (t10 - n10.t0) / 1e3 : n10.at : 0;
};
function Ff(e17, t10, n10 = t10) {
  let r10 = Mf.get(e17), i10 = r10?.it.anim;
  if (!r10 || !i10) return;
  i10.objects.forEach((e18, n11) => {
    let a11 = r10.groups[n11];
    if (!a11) return;
    let o10 = vf(e18, t10, i10);
    a11.setAttribute(`transform`, wf(o10)), a11.setAttribute(`opacity`, String(Math.round(o10.o * 1e3) / 1e3));
  }), r10.bar?.setAttribute(`width`, String(Math.max(0, Math.min(1, n10 / i10.len)) * of));
  let a10 = Of.get(r10.it.id);
  e17.classList.toggle(`is-playing`, !!a10?.playing), e17.classList.toggle(`is-started`, !!a10 && (a10.playing || a10.at > 0));
}
function If(e17) {
  Nf = 0;
  let t10 = false;
  for (let [n10, r10] of Of) {
    if (!r10.playing) continue;
    let i10 = Af.get(n10)?.anim;
    if (!i10) continue;
    let a10 = (e17 - r10.t0) / 1e3;
    a10 >= i10.len && (i10.loop ? (r10.t0 += i10.len * 1e3 * Math.floor(a10 / i10.len), a10 = (e17 - r10.t0) / 1e3) : (r10.playing = false, r10.at = i10.len, a10 = i10.len));
    for (let e18 of kf.get(n10) ?? []) e18.isConnected && Ff(e18, a10);
    r10.playing && (t10 = true);
  }
  t10 && (Nf = requestAnimationFrame(If));
}
var ute = () => {
  !Nf && typeof requestAnimationFrame == `function` && (Nf = requestAnimationFrame(If));
};
function Lf(e17) {
  let t10 = Af.get(e17)?.anim;
  if (!t10) return;
  let n10 = Pf(e17), r10 = n10 >= t10.len - 0.01 ? 0 : n10;
  Of.set(e17, { t0: performance.now() - r10 * 1e3, playing: true, at: r10 }), ute();
}
function dte(e17) {
  let t10 = Of.get(e17);
  if (t10?.playing) {
    t10.at = Pf(e17), t10.playing = false;
    for (let n10 of kf.get(e17) ?? []) n10.isConnected && Ff(n10, t10.at);
  }
}
var Rf = (e17) => !!Of.get(e17)?.playing;
function zf(e17) {
  Rf(e17) ? dte(e17) : Lf(e17);
}
function pte(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h)), o10 = t10.anim ?? df();
  n10 && r10.assets && jf.set(t10.id, r10.assets);
  let s10 = r10.assets ?? (n10 ? jf.get(t10.id) : void 0) ?? {}, c10 = (e18) => s10[e18]?.dataUrl, l10 = `${i10}x${a10}|${n10}|${JSON.stringify(o10)}|${pf(o10).map((e18) => !!s10[e18]).join(``)}`;
  if (e17.dataset.k === l10) return;
  if (e17.dataset.k = l10, e17.setAttribute(`aria-label`, Vf(t10)), !n10) {
    let t11 = lte(o10, Df(o10), c10, i10, a10), n11 = document.createElement(`img`);
    n11.className = `lh-wg-pic`, n11.alt = ``, n11.draggable = false, n11.src = r10.stickerUrl ? r10.stickerUrl(t11) : bf(t11), n11.style.width = `${i10}px`, n11.style.height = `${a10}px`, e17.replaceChildren(n11);
    return;
  }
  Af.set(t10.id, t10);
  let u10 = kf.get(t10.id);
  u10 || kf.set(t10.id, u10 = /* @__PURE__ */ new Set());
  for (let e18 of u10) e18.isConnected || u10.delete(e18);
  u10.add(e17);
  let d10 = `<svg class="lh-an-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${of} 720" width="100%" height="100%" preserveAspectRatio="none">${Ef(o10, c10)}`;
  o10.showPaths && (d10 += Tf(o10, false));
  for (let e18 of o10.objects) d10 += `<g class="lh-an-o">${Cf(e18, c10)}</g>`;
  d10 += `<rect class="lh-an-bar" x="0" y="712" height="8" width="0" fill="#2160c4" opacity="0.7"/>`, d10 += `<rect class="lh-key lh-an-hit" data-a="toggle" width="${of}" height="720" fill="#000000" opacity="0"><title>Animation abspielen oder anhalten</title></rect>`, d10 += `<g class="lh-an-play" pointer-events="none"><circle cx="${of / 2}" cy="360" r="86" fill="#000000" opacity="0.5"/><path d="M${of / 2 - 26} 318L684 360L${of / 2 - 26} 402z" fill="#ffffff"/></g>`, d10 += `<g class="lh-an-pause" pointer-events="none"><circle cx="64" cy="656" r="38" fill="#000000" opacity="0.35"/><rect x="50" y="636" width="10" height="40" rx="3" fill="#ffffff"/><rect x="68" y="636" width="10" height="40" rx="3" fill="#ffffff"/></g>`, o10.objects.length || (d10 += `<text x="${of / 2}" y="500" text-anchor="middle" font-family="Verdana, sans-serif" font-size="36" fill="#868e96" pointer-events="none">Noch leer \u2013 \u201EBearbeiten\u201C in der Leiste</text>`), d10 += `</svg>`;
  let f10 = document.createElement(`div`);
  f10.className = `lh-wg-pic lh-an`, f10.innerHTML = d10, e17.replaceChildren(f10), Mf.set(e17, { groups: [...f10.querySelectorAll(`.lh-an-o`)], bar: f10.querySelector(`.lh-an-bar`), it: t10 }), t10.locked && e17.classList.add(`is-armed`), e17.classList.add(`lh-swipe-ok`), e17.dataset.animId = t10.id, Of.has(t10.id) ? Ff(e17, Pf(t10.id)) : Ff(e17, Df(o10), 0), Si(e17, { slide: false, silent: true, hit: () => {
    let t11 = e17.dataset.animId;
    return t11 && Af.get(t11)?.anim?.objects.length && zf(t11), null;
  } });
}
function Vf(e17) {
  let t10 = e17.anim;
  if (!t10) return `Animation`;
  let n10 = t10.objects.filter((e18) => e18.kind === `text` && e18.text?.trim()).map((e18) => e18.text.replace(/\n/g, ` `).trim());
  return [`Animation: ${t10.title}`, `${t10.len} Sekunden`, ...n10].join(`. `);
}
var mte = `
.lh-an{position:relative;overflow:hidden}
.lh-an-svg{display:block}
.lh-an .lh-an-pause{display:none}
.lh-wg-anim.is-playing .lh-an-play{display:none}
.lh-wg-anim.is-playing .lh-an-pause{display:inline;opacity:.75}
.lh-edit .lh-wg-anim:not(.is-armed) .lh-an-hit{cursor:inherit}
.lh-an-hit{cursor:pointer}
`;
var _te = 1200;
var Hf = [{ id: `chromatic`, label: `Chromatisch`, strings: [], fmin: 30, fmax: 2e3 }, { id: `guitar`, label: `Gitarre`, strings: [40, 45, 50, 55, 59, 64], fmin: 60, fmax: 1400 }, { id: `ukulele`, label: `Ukulele`, strings: [67, 60, 64, 69], fmin: 180, fmax: 1100 }, { id: `bass`, label: `Bass`, strings: [28, 33, 38, 43], fmin: 30, fmax: 500 }, { id: `violin`, label: `Violine`, strings: [55, 62, 69, 76], fmin: 170, fmax: 3e3 }, { id: `cello`, label: `Cello`, strings: [36, 43, 50, 57], fmin: 55, fmax: 1e3 }];
var Uf = { inst: `chromatic`, a4: 440 };
var Wf = (e17) => Hf.find((t10) => t10.id === e17) ?? Hf[0];
var vte = [`C`, `C\u266F`, `D`, `D\u266F`, `E`, `F`, `F\u266F`, `G`, `G\u266F`, `A`, `A\u266F`, `H`];
var Kf = (e17) => vte[(Math.round(e17) % 12 + 12) % 12];
var yte = (e17) => Math.floor(Math.round(e17) / 12) - 1;
var Jf = 650;
var Yf = 790;
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
function op() {
  let e17 = tp;
  e17 && (tp = null, cancelAnimationFrame(e17.raf), e17.src.disconnect(), e17.stream.getTracks().forEach((e18) => e18.stop()), e17.end(), ip(e17.id));
}
function up(e17) {
  let t10 = Wf((e17.tuner ?? Uf).inst);
  return `Stimmger\xE4t${t10.strings.length ? ` f\xFCr ${t10.label}: ${t10.strings.map(Kf).join(` `)}` : `, chromatisch`}. Tippe auf das Mikrofon und spiel einen Ton.`;
}
function am(e17) {
  let t10 = e17.monster;
  return t10 ? `Monsternamen lesen: ${t10.words.length === 1 ? `ein Monster` : `${t10.words.length} Monster`} \u2013 lies den Namen und tippe auf \u201EGelesen\u201C.` : `Monsternamen lesen`;
}
var om = [`Fl\xFCsterflausch`, `Kicherkr\xFCmel`, `Klatschkeks`, `Jubeljuchu`, `Hurraholla`, `Donnerdackel`, `Krawummbumm`, `Supertornado!`];
var sm = [3, 5, 8, 10];
var une = [{ v: 1, label: `Fl\xFCstern` }, { v: 2, label: `Leise` }, { v: 3, label: `Gruppenarbeit` }, { v: 4, label: `Lebhaft` }, { v: 5, label: `Laut` }];
var lm = (e17, t10, n10, r10) => typeof e17 == `number` && Number.isFinite(e17) ? Math.round(Math.min(n10, Math.max(t10, e17))) : r10;
function um(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = Array.from({ length: 8 }, (e18, n11) => {
    let r11 = Array.isArray(t10.words) ? t10.words[n11] : void 0;
    return typeof r11 == `string` && r11.trim() ? r11.trim().slice(0, 24) : om[n11];
  }), r10 = typeof t10.secs == `number` && sm.includes(t10.secs) ? t10.secs : 5;
  return { mode: t10.mode === `noise` ? `noise` : `applause`, secs: r10, sens: lm(t10.sens, 1, 5, 3), limit: lm(t10.limit, 1, 5, 3), chime: t10.chime === true, words: n10 };
}
var dm = [-4, -9, -14, -19, -24];
var fm = 46;
var dne = (e17, t10) => {
  let n10 = 20 * Math.log10(Math.max(e17, 1e-6)), r10 = dm[t10 - 1] ?? dm[2];
  return Math.min(1, Math.max(0, (n10 - (r10 - fm)) / fm));
};
var pm = [0.28, 0.38, 0.48, 0.58, 0.68];
var mm = (e17) => {
  let t10 = pm[e17.limit - 1] ?? pm[2];
  return { y: t10, r: Math.min(0.96, t10 + 0.14) };
};
var fne = (e17) => Math.min(7, Math.max(0, Math.ceil(e17 * 8) - 1));
var hm = 1300;
var gm = 720;
var _m = `Verdana, Arial, sans-serif`;
var pne = [`#40c057`, `#82c91e`, `#fab005`, `#fd7e14`, `#fa5252`, `#e64980`, `#be4bdb`, `#7950f2`];
var mne = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
var vm = (e17, t10, n10) => Math.max(14, Math.min(n10, Math.floor(t10 / (0.64 * Math.max(1, [...e17].length)))));
var ym = (e17) => ({ x: 600, y: 604 - 72 * e17, w: 300 + 50 * e17, h: 60 });
var bm = (e17, t10, n10) => `<g transform="translate(${e17} ${t10}) scale(${n10})" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"><rect x="-14" y="-34" width="28" height="48" rx="14" fill="#ffffff"/><path d="M-26 -6a26 26 0 0 0 52 0M0 20v14M-14 36h28"/></g>`;
function hne(e17, t10) {
  let n10 = `<defs><linearGradient id="lh-ap-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7950f2"/><stop offset="1" stop-color="#5f3dc4"/></linearGradient></defs>`;
  n10 += `<rect width="${hm}" height="${gm}" rx="56" fill="url(#lh-ap-body)"/>`, n10 += `<rect x="18" y="18" width="1264" height="684" rx="44" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round"/>`, n10 += `<rect x="60" y="46" width="470" height="112" rx="28" fill="#ffd43b" stroke="#f08c00" stroke-width="6"/>`;
  let r10 = 0, i10 = (e18, t11) => `<circle class="lh-ap-bulb lh-ap-b${r10++ % 2}" cx="${e18}" cy="${t11}" r="8" fill="#fff3bf" stroke="#f08c00" stroke-width="2"/>`;
  for (let e18 = 92; e18 <= 500; e18 += 34) n10 += i10(e18, 46) + i10(e18, 158);
  n10 += i10(60, 102) + i10(530, 102), n10 += `<text x="295" y="120" font-size="48" font-family="${_m}" font-weight="700" text-anchor="middle" fill="#5f3dc4">Applausometer</text>`, n10 += `<rect x="80" y="190" width="430" height="190" rx="22" fill="#1c1d3b" stroke="#2b2d5c" stroke-width="6"/>`;
  let a10 = t10 ? `Bereit?` : `Klatscht!`;
  n10 += `<text class="lh-ap-word" x="295" y="290" font-size="${vm(a10, 390, 54)}" font-family="${_m}" font-weight="700" text-anchor="middle" fill="#ffe066">${a10}</text>`, n10 += `<text class="lh-ap-sub" x="295" y="344" font-size="26" font-family="${_m}" text-anchor="middle" fill="#99e9f2">Tippe auf \u201EMessen!\u201C</text>`, n10 += `<rect x="80" y="396" width="430" height="18" rx="9" fill="#2b2d5c"/><rect class="lh-ap-live" x="80" y="396" width="${t10 ? 0 : 260}" height="18" rx="9" fill="#69db7c"/>`, n10 += `<g class="lh-key lh-ap-go" data-a="go"><circle cx="295" cy="566" r="114" fill="#c92a2a"/><circle class="lh-ap-gobg" cx="295" cy="558" r="104" fill="#fa5252"/>` + bm(295, 528, 1.05) + `<text class="lh-ap-golabel" x="295" y="624" font-size="40" font-family="${_m}" font-weight="700" text-anchor="middle" fill="#ffffff">Messen!</text><circle class="lh-kdown" cx="295" cy="558" r="110" fill="#000000" opacity="0"/><title>Messen</title></g>`;
  for (let r11 = 0; r11 < 8; r11++) {
    let i11 = ym(r11), a11 = pne[r11], o10 = !t10 && r11 < 5, s10 = e17.words[r11] ?? om[r11];
    n10 += `<g class="lh-ap-bar" data-i="${r11}"><rect x="${i11.x}" y="${i11.y}" width="${i11.w}" height="${i11.h}" rx="14" fill="${a11}" fill-opacity="0.22" stroke="${a11}" stroke-width="4"/><rect class="lh-ap-on" x="${i11.x}" y="${i11.y}" width="${i11.w}" height="${i11.h}" rx="14" fill="${a11}" opacity="${+!!o10}"/><text class="lh-ap-txt" x="${i11.x + 22}" y="${i11.y + 41}" font-size="${vm(s10, i11.w - 64, 30)}" font-family="${_m}" font-weight="700" fill="${o10 ? `#1f1f3a` : `#ffffff`}" fill-opacity="${o10 ? 1 : 0.8}">${mne(s10)}</text></g>`;
  }
  return n10 += `<g class="lh-ap-best" opacity="0"><path d="M0 -20l6 13 14 2-10 10 2 14-12-7-12 7 2-14-10-10 14-2z" fill="#ffffff" stroke="#1f1f3a" stroke-width="2.5"/><title>Rekord</title></g>`, n10;
}
var gne = [{ l: `r`, cy: 160, dim: `#4a1d1d`, lit: `#ff6b6b` }, { l: `y`, cy: 360, dim: `#4a3f12`, lit: `#ffd43b` }, { l: `g`, cy: 560, dim: `#173d1f`, lit: `#51cf66` }];
var _ne = { g: `<path d="M-38 16q38 40 76 0" fill="none" stroke="#1f2a1f" stroke-width="9" stroke-linecap="round"/>`, y: `<path d="M-32 28h64" fill="none" stroke="#3b3110" stroke-width="9" stroke-linecap="round"/>`, r: `<circle cx="0" cy="30" r="14" fill="none" stroke="#3b1515" stroke-width="8"/>` };
var xm = (e17) => 648 - e17 * 576;
function vne(e17, t10) {
  let n10 = mm(e17), r10 = `<defs><linearGradient id="lh-ap-nbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0c8599"/><stop offset="1" stop-color="#0b7285"/></linearGradient></defs>`;
  r10 += `<rect width="${hm}" height="${gm}" rx="56" fill="url(#lh-ap-nbody)"/>`, r10 += `<rect x="18" y="18" width="1264" height="684" rx="44" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round"/>`, r10 += `<rect x="80" y="40" width="300" height="640" rx="70" fill="#25262b" stroke="#495057" stroke-width="8"/>`;
  for (let e18 of gne) {
    let n11 = !t10 && e18.l === `g`;
    r10 += `<g class="lh-ap-lamp" data-l="${e18.l}" transform="translate(230 ${e18.cy})"><circle r="92" fill="${e18.dim}"/><g class="lh-ap-lit" opacity="${+!!n11}"><circle r="92" fill="${e18.lit}"/><circle cx="-30" cy="-22" r="11" fill="#212529" fill-opacity="0.8"/><circle cx="30" cy="-22" r="11" fill="#212529" fill-opacity="0.8"/>${_ne[e18.l]}</g></g>`;
  }
  r10 += `<rect x="440" y="60" width="90" height="600" rx="45" fill="#1c1d3b"/>`;
  let i10 = t10 ? 0 : 0.3;
  r10 += `<rect class="lh-ap-meter" x="452" y="${xm(i10)}" width="66" height="${648 - xm(i10)}" rx="22" fill="#51cf66"/>`;
  for (let [e18, t11] of [[xm(n10.y), `#ffd43b`], [xm(n10.r), `#ff6b6b`]]) r10 += `<rect x="428" y="${e18 - 3}" width="114" height="6" rx="3" fill="${t11}"/>`;
  let a10 = t10 ? `Ampel aus` : `Sch\xF6n leise!`;
  return r10 += `<text class="lh-ap-word" x="900" y="230" font-size="${vm(a10, 600, 72)}" font-family="${_m}" font-weight="700" text-anchor="middle" fill="#ffffff">${a10}</text>`, r10 += `<text class="lh-ap-sub" x="900" y="300" font-size="30" font-family="${_m}" text-anchor="middle" fill="#c3fae8">${t10 ? `Tippe auf \u201EAmpel an\u201C.` : `Die Ampel h\xF6rt zu.`}</text>`, r10 += `<text class="lh-ap-green" x="900" y="390" font-size="34" font-family="${_m}" font-weight="700" text-anchor="middle" fill="#ffe066">Leise-Zeit 0:00</text>`, r10 += `<g class="lh-key lh-ap-go" data-a="go"><rect class="lh-ap-gobg" x="650" y="470" width="500" height="140" rx="70" fill="#2f9e44" stroke="#ffffff" stroke-opacity="0.6" stroke-width="5"/>` + bm(735, 540, 0.95) + `<text class="lh-ap-golabel" x="950" y="557" font-size="48" font-family="${_m}" font-weight="700" text-anchor="middle" fill="#ffffff">Ampel an</text><rect class="lh-kdown" x="650" y="470" width="500" height="140" rx="70" fill="#000000" opacity="0"/><title>Ampel an oder aus</title></g>`, r10;
}
function Sm(e17, t10, n10 = hm, r10 = gm) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${hm} ${gm}" width="${n10}" height="${r10}">${e17.mode === `noise` ? vne(e17, t10) : hne(e17, t10)}</svg>`;
}
var Cm = /* @__PURE__ */ new Map();
var wm = (e17) => {
  let t10 = Cm.get(e17);
  return t10 || Cm.set(e17, t10 = { phase: `idle`, t0: 0, samples: [], peak: 0, result: -1, best: -1, record: false, light: null, redSince: 0, greenMs: 0, failed: false, party: 0 }), t10;
};
var Tm = /* @__PURE__ */ new Map();
var Em = /* @__PURE__ */ new Map();
var Dm = (e17) => um(Em.get(e17)?.applause);
var Om = null;
function km(e17, t10) {
  let n10 = Vr();
  if (n10) try {
    let r10 = n10.currentTime, i10 = n10.createOscillator(), a10 = n10.createGain();
    i10.frequency.value = e17, a10.gain.setValueAtTime(0, r10), a10.gain.linearRampToValueAtTime(0.18, r10 + 0.01), a10.gain.exponentialRampToValueAtTime(1e-3, r10 + t10 / 1e3), i10.connect(a10).connect(n10.destination), i10.start(r10), i10.stop(r10 + t10 / 1e3 + 0.05);
  } catch {
  }
}
var Am = 800;
var yne = (e17) => {
  let t10 = Math.floor(e17 / 1e3);
  return `${Math.floor(t10 / 60)}:${String(t10 % 60).padStart(2, `0`)}`;
};
function jm(e17) {
  let t10 = Dm(e17), n10 = wm(e17), r10 = Om?.id === e17 ? Om : null, i10 = performance.now();
  for (let a10 of Tm.get(e17) ?? []) {
    if (!a10.isConnected) continue;
    let e18 = (e19) => a10.querySelector(e19), o10 = (t11, n11, r11, i11) => {
      let a11 = e18(t11);
      a11 && (a11.textContent !== n11 && (a11.textContent = n11), r11 && i11 && a11.setAttribute(`font-size`, String(vm(n11, r11, i11))));
    };
    if (a10.classList.toggle(`is-listening`, !!r10), a10.classList.toggle(`is-party`, n10.party > i10), t10.mode === `noise`) {
      let i11 = mm(t10), s11 = r10?.shown ?? 0, c11 = e18(`.lh-ap-meter`);
      c11 && (c11.setAttribute(`y`, xm(s11).toFixed(1)), c11.setAttribute(`height`, (648 - xm(s11)).toFixed(1)), c11.setAttribute(`fill`, s11 > i11.r ? `#ff6b6b` : s11 > i11.y ? `#ffd43b` : `#51cf66`)), a10.querySelectorAll(`.lh-ap-lamp`).forEach((e19) => e19.classList.toggle(`is-on`, !!r10 && n10.light === e19.dataset.l)), o10(`.lh-ap-word`, r10 ? n10.light === `r` ? `Psst! Zu laut!` : n10.light === `y` ? `Etwas leiser!` : `Sch\xF6n leise!` : n10.failed ? `Kein Mikrofon` : `Ampel aus`, 600, 72), o10(`.lh-ap-sub`, r10 ? `Die Ampel h\xF6rt zu.` : n10.failed ? `Erlaube das Mikrofon im Browser.` : `Tippe auf \u201EAmpel an\u201C.`), o10(`.lh-ap-green`, `Leise-Zeit ${yne(n10.greenMs)}`), o10(`.lh-ap-golabel`, r10 ? `Ampel aus` : `Ampel an`, 320, 48), e18(`.lh-ap-gobg`)?.setAttribute(`fill`, r10 ? `#e03131` : `#2f9e44`);
      continue;
    }
    let s10 = n10.phase === `result` ? n10.result + 1 : r10 ? Math.round((r10.shown ?? 0) * 8) : 0;
    a10.querySelectorAll(`.lh-ap-bar`).forEach((e19) => {
      let t11 = Number(e19.dataset.i);
      e19.classList.toggle(`is-lit`, t11 < s10), e19.classList.toggle(`is-hit`, n10.phase === `result` && t11 === n10.result);
    }), e18(`.lh-ap-live`)?.setAttribute(`width`, String(Math.round((r10?.shown ?? 0) * 430)));
    let c10 = e18(`.lh-ap-best`);
    if (c10 && (c10.setAttribute(`opacity`, n10.best >= 0 ? `1` : `0`), n10.best >= 0)) {
      let e19 = ym(n10.best);
      c10.setAttribute(`transform`, `translate(${e19.x + e19.w - 32} ${e19.y + e19.h / 2})`);
    }
    let l10 = `Bereit?`, u10 = `Tippe auf \u201EMessen!\u201C`;
    if (n10.failed && n10.phase === `idle`) l10 = `Kein Mikrofon`, u10 = `Erlaube es im Browser.`;
    else if (n10.phase === `count`) {
      let e19 = 3 - Math.floor((i10 - n10.t0) / Am);
      l10 = String(Math.max(1, e19)), u10 = `Gleich geht es los \u2026`;
    } else n10.phase === `measure` ? (l10 = `Klatscht!`, u10 = `noch ${Math.max(1, Math.ceil((t10.secs * 1e3 - (i10 - n10.t0)) / 1e3))} s`) : n10.phase === `result` && (l10 = t10.words[n10.result] ?? ``, u10 = `Stufe ${n10.result + 1} von 8${n10.record ? ` \xB7 Rekord!` : ``}`);
    o10(`.lh-ap-word`, l10, 390, n10.phase === `count` ? 110 : 54), e18(`.lh-ap-word`)?.setAttribute(`y`, n10.phase === `count` ? `318` : `290`), o10(`.lh-ap-sub`, u10), o10(`.lh-ap-golabel`, n10.phase === `count` || n10.phase === `measure` ? `Stopp` : n10.phase === `result` ? `Nochmal!` : `Messen!`, 172, 40);
  }
}
function Mm(e17) {
  let t10 = wm(e17), n10 = Dm(e17);
  t10.phase = `result`, t10.result = fne(t10.peak), t10.record = t10.best >= 0 && t10.result > t10.best, t10.best = Math.max(t10.best, t10.result), t10.party = performance.now() + 3200, Fm(), vi();
  let r10 = n10.words[t10.result] ?? ``;
  window.setTimeout(() => void lc(t10.record ? `${r10}! Neuer Rekord!` : `${r10}!`), 450), jm(e17), window.setTimeout(() => jm(e17), 3300);
}
function Nm() {
  let e17 = Om;
  if (!e17) return;
  e17.raf = requestAnimationFrame(Nm);
  let t10 = performance.now(), n10 = Math.min(200, t10 - (e17.last || t10));
  e17.last = t10, e17.an.getFloatTimeDomainData(e17.buf);
  let r10 = 0;
  for (let t11 = 0; t11 < e17.buf.length; t11++) r10 += e17.buf[t11] * e17.buf[t11];
  let i10 = Dm(e17.id), a10 = dne(Math.sqrt(r10 / e17.buf.length), i10.sens);
  e17.shown += (a10 - e17.shown) * (a10 > e17.shown ? 0.55 : 0.12);
  let o10 = wm(e17.id);
  if (i10.mode === `noise`) {
    e17.slow += (a10 - e17.slow) * Math.min(1, n10 / 900);
    let r11 = mm(i10), s10 = o10.light;
    e17.slow > r11.r ? (o10.light = `r`, o10.redSince = t10) : o10.light = o10.light === `r` && t10 - o10.redSince < 2e3 ? `r` : e17.slow > r11.y ? `y` : `g`, o10.light === `g` && (o10.greenMs += n10), o10.light === `r` && s10 !== `r` && i10.chime && (km(660, 200), window.setTimeout(() => km(495, 300), 210));
  } else if (o10.phase === `count`) Math.floor((t10 - o10.t0) / Am) >= 3 && (o10.phase = `measure`, o10.t0 = t10, o10.samples = [], o10.peak = 0, km(1320, 260));
  else if (o10.phase === `measure`) {
    if (t10 - o10.t0 > 280) {
      o10.samples.push([t10, a10]);
      let e18 = 0, n11 = 0;
      for (let r11 = o10.samples.length - 1; r11 >= 0 && t10 - o10.samples[r11][0] <= 400; r11--) n11 += o10.samples[r11][1], e18++;
      e18 && (o10.peak = Math.max(o10.peak, n11 / e18));
    }
    t10 - o10.t0 >= i10.secs * 1e3 && Mm(e17.id);
  }
  jm(e17.id);
}
async function Pm(e17) {
  if (Om?.id === e17) return true;
  Fm(), op();
  let t10 = wm(e17), n10 = Vr();
  if (!n10 || !navigator.mediaDevices?.getUserMedia) return t10.failed = true, jm(e17), false;
  pi();
  let r10 = ni();
  try {
    let i10 = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }), a10 = n10.createMediaStreamSource(i10), o10 = n10.createAnalyser();
    return o10.fftSize = 2048, a10.connect(o10), t10.failed = false, Om = { id: e17, stream: i10, src: a10, an: o10, buf: new Float32Array(o10.fftSize), end: r10, raf: 0, last: 0, shown: 0, slow: 0 }, Nm(), true;
  } catch (n11) {
    return console.warn(`[applause] no microphone`, n11), r10(), t10.failed = true, jm(e17), false;
  }
}
function Fm() {
  let e17 = Om;
  e17 && (Om = null, cancelAnimationFrame(e17.raf), e17.src.disconnect(), e17.stream.getTracks().forEach((e18) => e18.stop()), e17.end(), jm(e17.id));
}
async function Im(e17) {
  let t10 = Dm(e17), n10 = wm(e17);
  if (t10.mode === `noise`) Om?.id === e17 ? (Fm(), n10.light = null) : (n10.light = `g`, n10.redSince = 0, await Pm(e17) || (n10.light = null)), jm(e17);
  else {
    if (n10.phase === `measure`) return Mm(e17);
    n10.phase === `count` ? (n10.phase = `idle`, Fm(), jm(e17)) : (n10.phase = `count`, n10.t0 = performance.now(), jm(e17), await Pm(e17) ? (n10.t0 = performance.now(), km(880, 140), window.setTimeout(() => n10.phase === `count` && km(880, 140), Am), window.setTimeout(() => n10.phase === `count` && km(880, 140), 2 * Am)) : (n10.phase = `idle`, jm(e17)));
  }
}
function bne(e17) {
  Om?.id === e17 && Fm(), Cm.delete(e17);
}
function xne(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h)), o10 = um(t10.applause), s10 = `${i10}x${a10}|${n10}|${JSON.stringify(o10)}`;
  if (e17.dataset.k === s10) return;
  e17.dataset.k = s10, e17.setAttribute(`aria-label`, Rm(t10));
  let c10 = Sm(o10, n10, i10, a10);
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(c10) : `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(c10), t11.style.width = `${i10}px`, t11.style.height = `${a10}px`, e17.replaceChildren(t11);
    return;
  }
  Em.set(t10.id, t10);
  let l10 = Tm.get(t10.id);
  l10 || Tm.set(t10.id, l10 = /* @__PURE__ */ new Set());
  for (let e18 of l10) e18.isConnected || l10.delete(e18);
  l10.add(e17);
  let u10 = document.createElement(`div`);
  u10.className = `lh-wg-pic`, u10.innerHTML = c10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(u10), t10.locked && e17.classList.add(`is-armed`), e17.dataset.applauseId = t10.id, jm(t10.id), Si(e17, { slide: false, hit: (t11) => {
    let n11 = e17.dataset.applauseId;
    return n11 && t11.getAttribute(`data-a`) === `go` && Im(n11), null;
  } });
}
function Rm(e17) {
  return um(e17.applause).mode === `noise` ? `L\xE4rmampel: zeigt Gr\xFCn, Gelb oder Rot \u2013 je nachdem, wie laut es ist. Tippe auf \u201EAmpel an\u201C.` : `Applausometer: tippe auf \u201EMessen\u201C und klatscht so laut ihr k\xF6nnt.`;
}
var Sne = `
.lh-wg-applause .lh-key{cursor:pointer}
.lh-edit .lh-wg-applause:not(.is-armed) .lh-key{cursor:inherit}
.lh-wg-applause .lh-ap-on{opacity:0;transition:opacity .08s}
.lh-wg-applause .lh-ap-txt{fill:#ffffff;fill-opacity:.8}
.lh-wg-applause .lh-ap-bar.is-lit .lh-ap-on{opacity:1}
.lh-wg-applause .lh-ap-bar.is-lit .lh-ap-txt{fill:#1f1f3a;fill-opacity:1}
.lh-wg-applause .lh-ap-bar{transform-box:fill-box;transform-origin:left center}
.lh-wg-applause .lh-ap-bar.is-hit{animation:lh-ap-hit .45s ease-in-out 8 alternate}
.lh-wg-applause .lh-ap-bar.is-hit rect:first-child{stroke:#ffffff;stroke-width:7}
.lh-wg-applause.is-listening .lh-ap-b0,.lh-wg-applause.is-party .lh-ap-b0{animation:lh-ap-bulb .5s steps(2,start) infinite}
.lh-wg-applause.is-listening .lh-ap-b1,.lh-wg-applause.is-party .lh-ap-b1{animation:lh-ap-bulb .5s steps(2,start) .25s infinite}
.lh-wg-applause .lh-ap-lit{opacity:0;transition:opacity .25s}
.lh-wg-applause .lh-ap-lamp.is-on .lh-ap-lit{opacity:1}
@keyframes lh-ap-hit{to{transform:scale(1.06)}}
@keyframes lh-ap-bulb{to{fill:#ffd43b}}
@media (prefers-reduced-motion:reduce){.lh-wg-applause .lh-ap-bar.is-hit,.lh-wg-applause .lh-ap-bulb{animation:none!important}}`;
var zm = [60, 90, 120, 180];
var Bm = { secs: 60, sound: true, title: `Elevator Pitch` };
function Vm(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {};
  return { secs: typeof t10.secs == `number` && zm.includes(t10.secs) ? t10.secs : 60, sound: t10.sound !== false, title: typeof t10.title == `string` && t10.title.trim() ? t10.title.trim().slice(0, 40) : Bm.title };
}
var Hm = (e17) => e17 < 120 ? `${e17} Sekunden` : `${e17 / 60} Minuten`;
var Cne = (e17) => e17 < 120 ? `${e17} s` : `${e17 / 60} Min.`;
var Um = 1400;
var Wm = 990;
var Gm = `Verdana, Arial, sans-serif`;
var Km = `Menlo, Consolas, monospace`;
var qm = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
var Jm = (e17, t10, n10) => Math.max(16, Math.min(n10, Math.floor(t10 / (0.62 * Math.max(1, [...e17].length)))));
var Ym = { x: 575, y: 175, w: 250, h: 635 };
var Xm = { x: 595, w: 210, h: 120 };
var Zm = Ym.y + Ym.h - 8 - Xm.h;
var wne = Ym.y + 8;
var Qm = 10;
var $m = (e17) => Zm - (Zm - wne) * Math.min(1, Math.max(0, e17));
var eh = (e17) => e17 <= 0 ? `EG` : String(e17);
var th = (e17) => {
  let t10 = Math.max(0, Math.ceil(e17 / 1e3));
  return `${Math.floor(t10 / 60)}:${String(t10 % 60).padStart(2, `0`)}`;
};
function nh(e17) {
  let t10 = `M0 0H240C215 260 170 470 128 600C168 720 205 860 215 990H0Z`, n10 = `<path d="${t10}" fill="url(#lh-ep-cur)"/><path d="${t10}" fill="url(#lh-ep-shade)"/><ellipse cx="132" cy="600" rx="26" ry="14" fill="#f2c14e" stroke="#b7791f" stroke-width="3"/>`;
  return e17 === `l` ? `<g>${n10}</g>` : `<g transform="translate(${Um} 0) scale(-1 1)">${n10}</g>`;
}
function Tne() {
  let e17 = `<defs><linearGradient id="lh-ep-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#160d2e"/><stop offset="1" stop-color="#31185a"/></linearGradient><linearGradient id="lh-ep-cur" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse" spreadMethod="repeat"><stop offset="0" stop-color="#7a0b1c"/><stop offset="0.5" stop-color="#d11a32"/><stop offset="1" stop-color="#7a0b1c"/></linearGradient><linearGradient id="lh-ep-shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.35"/></linearGradient><linearGradient id="lh-ep-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4423"/><stop offset="1" stop-color="#a0692f"/></linearGradient><linearGradient id="lh-ep-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8" stop-opacity="0.75"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0.08"/></linearGradient><clipPath id="lh-ep-shaftclip"><rect x="${Ym.x}" y="${Ym.y}" width="${Ym.w}" height="${Ym.h}"/></clipPath><clipPath id="lh-ep-doorclip"><rect x="10" y="12" width="190" height="100"/></clipPath></defs>`;
  e17 += `<rect width="${Um}" height="${Wm}" fill="url(#lh-ep-wall)"/>`, e17 += `<rect x="0" y="815" width="${Um}" height="175" fill="url(#lh-ep-floor)"/>`;
  for (let t10 = -700; t10 <= 2100; t10 += 140) e17 += `<path d="M${700 + (t10 - 700) * 0.72} 815L${t10} ${Wm}" stroke="#4a2e14" stroke-opacity="0.45" stroke-width="3"/>`;
  return e17 += `<rect x="0" y="812" width="${Um}" height="8" fill="#3b2410"/>`, e17 += `<ellipse class="lh-ep-pool" cx="700" cy="880" rx="330" ry="52" fill="#fff3bf" opacity="0.22"/>`, e17 += `<path class="lh-ep-beam" d="M288 140L312 140L840 905L520 905Z" fill="url(#lh-ep-beam)" opacity="0.45"/>`, e17 += `<path class="lh-ep-beam" d="M1088 140L1112 140L880 905L560 905Z" fill="url(#lh-ep-beam)" opacity="0.45"/>`, e17 += `<ellipse cx="360" cy="935" rx="56" ry="11" fill="#1c1c1c"/><path d="M360 935V700" stroke="#495057" stroke-width="7" stroke-linecap="round"/><path d="M360 712L392 676" stroke="#495057" stroke-width="6" stroke-linecap="round"/><rect x="382" y="640" width="26" height="44" rx="13" fill="#343a40" transform="rotate(40 395 662)"/><path d="M386 652l14 12M381 660l14 12" stroke="#868e96" stroke-width="2" transform="rotate(40 395 662)"/>`, e17;
}
function Ene(e17) {
  let t10 = nh(`l`) + nh(`r`), n10 = ``;
  for (let e18 = Um; e18 > 0; e18 -= 100) n10 += `Q${e18 - 50} 122 ${e18 - 100} 82`;
  t10 += `<path d="M0 0H${Um}V82${n10}Z" fill="url(#lh-ep-cur)"/>`, t10 += `<path d="M${Um} 82${n10}" fill="none" stroke="#f2c14e" stroke-width="7"/>`, t10 += `<text x="700" y="66" font-size="${Jm(e17, 820, 54)}" font-family="${Gm}" font-weight="700" text-anchor="middle" fill="#ffd43b" stroke="#5c0a14" stroke-width="3" paint-order="stroke">${qm(e17)}</text>`;
  for (let e18 of [300, 1100]) t10 += `<path d="M${e18} 96V112" stroke="#212529" stroke-width="6"/><circle cx="${e18}" cy="128" r="26" fill="#212529" stroke="#495057" stroke-width="4"/><circle class="lh-ep-lens" cx="${e18}" cy="134" r="14" fill="#fff3bf"/>`;
  return t10;
}
function Dne() {
  let { x: e17, y: t10, w: n10, h: r10 } = Ym, i10 = `<rect x="${e17}" y="${t10}" width="${n10}" height="${r10}" fill="#262a3b" stroke="#adb5bd" stroke-width="8"/>`;
  i10 += `<path d="M${e17 + 22} ${t10}V${t10 + r10}M${e17 + n10 - 22} ${t10}V${t10 + r10}" stroke="#495057" stroke-width="5"/>`;
  for (let t11 = 0; t11 <= Qm; t11++) {
    let r11 = $m(t11 / Qm) + Xm.h + 4;
    i10 += `<path d="M${e17 + 4} ${r11}H${e17 + n10 - 4}" stroke="#495057" stroke-width="3"/>`, i10 += `<text x="${e17 - 14}" y="${r11 + 2}" font-size="${t11 === Qm ? 26 : 22}" font-family="${Gm}" font-weight="700" text-anchor="end" fill="${t11 === Qm ? `#ffd43b` : `#adb5bd`}">${t11 === Qm ? `Ziel \u2605` : eh(t11)}</text>`;
  }
  return i10 += `<rect x="625" y="128" width="150" height="40" rx="10" fill="#111" stroke="#adb5bd" stroke-width="3"/><path class="lh-ep-up" d="M648 158l12-20 12 20z" fill="#5c4a12"/><text class="lh-ep-floor" x="725" y="159" font-size="28" font-family="${Km}" font-weight="700" text-anchor="middle" fill="#ffd43b">EG</text>`, i10;
}
function One(e17) {
  let t10 = $m(e17);
  return `<g clip-path="url(#lh-ep-shaftclip)"><g class="lh-ep-car" transform="translate(${Xm.x} ${t10.toFixed(1)})"><path d="M105 -700V0" stroke="#868e96" stroke-width="4"/><rect width="${Xm.w}" height="${Xm.h}" rx="8" fill="#ced4da" stroke="#868e96" stroke-width="4"/><rect x="10" y="12" width="190" height="100" fill="#fff3bf"/><g class="lh-ep-guest"><circle cx="105" cy="46" r="18" fill="#ffd8a8"/><circle cx="99" cy="43" r="2.6" fill="#212529"/><circle cx="111" cy="43" r="2.6" fill="#212529"/><path d="M97 52q8 7 16 0" fill="none" stroke="#212529" stroke-width="2.6" stroke-linecap="round"/><path d="M84 112V82q0-16 21-16t21 16v30z" fill="#4dabf7"/><path class="lh-ep-wave" d="M124 76l18-30" stroke="#ffd8a8" stroke-width="9" stroke-linecap="round"/></g><g clip-path="url(#lh-ep-doorclip)"><g class="lh-ep-door-l"><rect x="10" y="12" width="95" height="100" fill="#adb5bd" stroke="#868e96" stroke-width="2"/><rect x="88" y="52" width="6" height="22" rx="3" fill="#868e96"/></g><g class="lh-ep-door-r"><rect x="105" y="12" width="95" height="100" fill="#adb5bd" stroke="#868e96" stroke-width="2"/><rect x="116" y="52" width="6" height="22" rx="3" fill="#868e96"/></g></g></g></g>`;
}
function kne(e17, t10) {
  let n10 = `<rect x="880" y="200" width="260" height="190" rx="22" fill="#111318" stroke="#868e96" stroke-width="6"/><text x="1010" y="246" font-size="24" font-family="${Gm}" text-anchor="middle" fill="#adb5bd">Restzeit</text><text class="lh-ep-time" x="1010" y="350" font-size="92" font-family="${Km}" font-weight="700" text-anchor="middle" fill="#ffd43b">${th(e17 * 1e3)}</text>`;
  return n10 += `<g class="lh-key lh-ep-go" data-a="go"><circle cx="960" cy="510" r="70" fill="#1e7b34"/><circle class="lh-ep-gobg" cx="960" cy="504" r="64" fill="#2f9e44"/><path class="lh-ep-goicon" d="M945 478l34 24-34 24z" fill="#ffffff"/><text class="lh-ep-golabel" x="960" y="552" font-size="22" font-family="${Gm}" font-weight="700" text-anchor="middle" fill="#ffffff">Los!</text><circle class="lh-kdown" cx="960" cy="504" r="68" fill="#000000" opacity="0"/><title>Start oder Pause</title></g>`, n10 += `<g class="lh-key" data-a="reset"><circle cx="1090" cy="510" r="46" fill="#343a40" stroke="#868e96" stroke-width="3"/><path d="M1072 504a18 18 0 1 0 6-13" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/><path d="M1074 480l4 12 12-4" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle class="lh-kdown" cx="1090" cy="510" r="46" fill="#000000" opacity="0"/><title>Von vorn</title></g>`, zm.forEach((t11, r10) => {
    let i10 = 880 + r10 * 66, a10 = t11 === e17;
    n10 += `<g class="lh-key lh-ep-chip" data-a="d:${t11}"><rect x="${i10}" y="612" width="60" height="50" rx="14" fill="${a10 ? `#ffd43b` : `#343a40`}" stroke="${a10 ? `#f08c00` : `#868e96`}" stroke-width="3"/><text x="${i10 + 30}" y="644" font-size="17" font-family="${Gm}" font-weight="700" text-anchor="middle" fill="${a10 ? `#212529` : `#ffffff`}">${Cne(t11)}</text><rect class="lh-kdown" x="${i10}" y="612" width="60" height="50" rx="14" fill="#000000" opacity="0"/><title>${Hm(t11)}</title></g>`;
  }), n10;
}
function Ane(e17) {
  let t10 = `in ${Hm(e17)}!`;
  return `<text class="lh-ep-hint1" x="352" y="420" font-size="38" font-family="${Gm}" font-weight="700" text-anchor="middle" fill="#ffffff">\xDCberzeuge uns</text><text class="lh-ep-hint2" x="352" y="472" font-size="${Jm(t10, 320, 38)}" font-family="${Gm}" font-weight="700" text-anchor="middle" fill="#ffd43b">${qm(t10)}</text>`;
}
function jne() {
  let e17 = [`#ff6b6b`, `#ffd43b`, `#51cf66`, `#4dabf7`, `#cc5de8`, `#ff922b`, `#ffffff`], t10 = `<g class="lh-ep-confetti">`, n10 = 7, r10 = () => (n10 = n10 * 16807 % 2147483647) / 2147483647;
  for (let n11 = 0; n11 < 90; n11++) {
    let i10 = Math.round(r10() * Um), a10 = 10 + Math.round(r10() * 10), o10 = (2.4 + r10() * 2).toFixed(2), s10 = (r10() * 2.5).toFixed(2);
    t10 += `<rect class="lh-ep-conf" x="${i10}" y="-40" width="${a10}" height="${Math.round(a10 * 0.55)}" rx="2" fill="${e17[n11 % e17.length]}" style="animation-duration:${o10}s;animation-delay:${s10}s"/>`;
  }
  return t10 + `</g>`;
}
function Mne(e17, t10, n10, r10 = Um, i10 = Wm) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Um} ${Wm}" width="${r10}" height="${i10}">` + Tne() + Dne() + One(0) + Ane(t10) + kne(t10, n10) + Ene(e17.title) + (n10 ? jne() : ``) + `</svg>`;
}
function Nne(e17, t10, n10, r10, i10, a10) {
  for (let o10 of [-7, 7]) {
    let s10 = e17.createOscillator();
    s10.type = `sawtooth`, s10.frequency.value = n10, s10.detune.value = o10;
    let c10 = e17.createBiquadFilter();
    c10.type = `lowpass`, c10.Q.value = 1.2, c10.frequency.setValueAtTime(n10 * 1.5, r10), c10.frequency.linearRampToValueAtTime(n10 * 6, r10 + 0.06), c10.frequency.exponentialRampToValueAtTime(n10 * 3, r10 + i10);
    let l10 = e17.createGain();
    l10.gain.setValueAtTime(1e-4, r10), l10.gain.linearRampToValueAtTime(a10, r10 + 0.035), l10.gain.setValueAtTime(a10 * 0.8, r10 + Math.max(0.05, i10 - 0.06)), l10.gain.exponentialRampToValueAtTime(1e-4, r10 + i10 + 0.18), s10.connect(c10).connect(l10).connect(t10), s10.start(r10), s10.stop(r10 + i10 + 0.25);
  }
}
var Pne = (e17) => 440 * 2 ** ((e17 - 69) / 12);
function Fne() {
  let e17 = Vr();
  if (e17) try {
    let t10 = e17.createDynamicsCompressor(), n10 = e17.createGain();
    n10.gain.value = 0.9, t10.connect(n10).connect(e17.destination);
    let r10 = e17.currentTime + 0.05;
    for (let [n11, i11] of [[1567.98, 0.22], [3135.96, 0.06]]) {
      let a11 = e17.createOscillator(), o11 = e17.createGain();
      a11.frequency.value = n11, o11.gain.setValueAtTime(1e-4, r10), o11.gain.exponentialRampToValueAtTime(i11, r10 + 0.01), o11.gain.exponentialRampToValueAtTime(1e-4, r10 + 1.4), a11.connect(o11).connect(t10), a11.start(r10), a11.stop(r10 + 1.5);
    }
    let i10 = r10 + 0.55;
    for (let [n11, r11, a11] of [[[67], 0, 0.13], [[67], 0.16, 0.13], [[67], 0.32, 0.13], [[72], 0.48, 0.36], [[76], 0.88, 0.14], [[72, 76, 79, 84], 1.04, 1.3]]) for (let o11 of n11) Nne(e17, t10, Pne(o11), i10 + r11, a11, n11.length > 1 ? 0.06 : 0.09);
    let a10 = i10 + 1.2, o10 = 4.5, s10 = e17.createBuffer(1, e17.sampleRate, e17.sampleRate), c10 = s10.getChannelData(0);
    for (let e18 = 0; e18 < c10.length; e18++) c10[e18] = Math.random() * 2 - 1;
    let l10 = e17.createBufferSource();
    l10.buffer = s10, l10.loop = true;
    let u10 = e17.createBiquadFilter();
    u10.type = `bandpass`, u10.frequency.value = 1800, u10.Q.value = 0.6;
    let d10 = e17.createGain();
    d10.gain.setValueAtTime(1e-4, a10), d10.gain.linearRampToValueAtTime(0.09, a10 + 0.6), d10.gain.setValueAtTime(0.09, a10 + o10 - 1.6), d10.gain.linearRampToValueAtTime(1e-4, a10 + o10), l10.connect(u10).connect(d10).connect(t10), l10.start(a10), l10.stop(a10 + o10 + 0.1);
    let f10 = (e18) => Math.min(1, e18 / 0.6) * Math.min(1, (o10 - e18) / 1.6);
    for (let n11 = 0; n11 < 150; n11++) {
      let n12 = Math.random() * o10, r11 = e17.createBufferSource();
      r11.buffer = s10;
      let i11 = e17.createBiquadFilter();
      i11.type = `bandpass`, i11.frequency.value = 900 + Math.random() * 1800, i11.Q.value = 1.2;
      let c11 = e17.createGain(), l11 = (0.08 + Math.random() * 0.14) * f10(n12);
      c11.gain.setValueAtTime(1e-4, a10 + n12), c11.gain.exponentialRampToValueAtTime(Math.max(2e-4, l11), a10 + n12 + 4e-3), c11.gain.exponentialRampToValueAtTime(1e-4, a10 + n12 + 0.05), r11.connect(i11).connect(c11).connect(t10), r11.start(a10 + n12, Math.random() * 0.9), r11.stop(a10 + n12 + 0.07);
    }
    window.setTimeout(() => n10.disconnect(), (a10 - e17.currentTime + o10 + 1) * 1e3);
  } catch {
  }
}
var rh = /* @__PURE__ */ new Map();
var ih = (e17) => {
  let t10 = rh.get(e17);
  return t10 || rh.set(e17, t10 = { phase: `idle`, acc: 0, since: 0, secs: null, raf: 0 }), t10;
};
var ah = /* @__PURE__ */ new Map();
var oh = /* @__PURE__ */ new Map();
var sh = (e17) => Vm(oh.get(e17)?.pitch);
var ch = (e17) => ih(e17).secs ?? sh(e17).secs;
var lh = (e17) => e17.acc + (e17.phase === `run` ? performance.now() - e17.since : 0);
function uh(e17) {
  let t10 = ih(e17), n10 = ch(e17) * 1e3, r10 = t10.phase === `done` ? n10 : lh(t10), i10 = Math.min(1, r10 / n10), a10 = n10 - r10;
  for (let n11 of ah.get(e17) ?? []) {
    if (!n11.isConnected) continue;
    let r11 = (e18) => n11.querySelector(e18);
    r11(`.lh-ep-car`)?.setAttribute(`transform`, `translate(${Xm.x} ${$m(i10).toFixed(1)})`);
    let o10 = r11(`.lh-ep-time`);
    if (o10) {
      let e18 = th(a10);
      o10.textContent !== e18 && (o10.textContent = e18), o10.setAttribute(`fill`, t10.phase === `done` ? `#51cf66` : t10.phase === `run` && a10 <= 1e4 ? `#ff6b6b` : `#ffd43b`);
    }
    let s10 = r11(`.lh-ep-floor`);
    s10 && (s10.textContent = eh(Math.floor(i10 * Qm + 1e-6))), r11(`.lh-ep-up`)?.setAttribute(`fill`, t10.phase === `run` ? `#ffd43b` : `#5c4a12`);
    let c10 = r11(`.lh-ep-golabel`);
    c10 && (c10.textContent = t10.phase === `run` ? `Pause` : t10.phase === `pause` ? `Weiter` : t10.phase === `done` ? `Nochmal` : `Los!`), r11(`.lh-ep-goicon`)?.setAttribute(`d`, t10.phase === `run` ? `M940 478h12v48h-12zM966 478h12v48h-12z` : `M945 478l34 24-34 24z`);
    let l10 = r11(`.lh-ep-hint1`), u10 = r11(`.lh-ep-hint2`);
    if (l10 && u10) {
      let n12 = t10.phase === `done` ? `Applaus!` : `in ${Hm(ch(e17))}!`;
      l10.textContent = t10.phase === `done` ? `Geschafft!` : `\xDCberzeuge uns`, u10.textContent = n12, u10.setAttribute(`font-size`, String(Jm(n12, 320, 38)));
    }
    n11.classList.toggle(`is-running`, t10.phase === `run`), n11.classList.toggle(`is-final`, t10.phase === `run` && a10 <= 1e4), n11.classList.toggle(`is-done`, t10.phase === `done`);
  }
}
function dh(e17) {
  let t10 = ih(e17);
  if (t10.phase === `run`) {
    if (lh(t10) >= ch(e17) * 1e3) {
      t10.phase = `done`, t10.acc = ch(e17) * 1e3, uh(e17);
      for (let t11 of ah.get(e17) ?? []) t11.classList.add(`is-party`), window.setTimeout(() => t11.classList.remove(`is-party`), 9e3);
      sh(e17).sound && Fne();
    } else uh(e17), t10.raf = requestAnimationFrame(() => dh(e17));
  }
}
function fh(e17) {
  let t10 = ih(e17);
  if (t10.phase === `run`) t10.acc = lh(t10), t10.phase = `pause`, cancelAnimationFrame(t10.raf);
  else {
    if (t10.phase === `done` || t10.phase === `idle`) {
      t10.acc = 0;
      for (let t11 of ah.get(e17) ?? []) t11.classList.remove(`is-party`);
    }
    Vr(), t10.phase = `run`, t10.since = performance.now(), cancelAnimationFrame(t10.raf), t10.raf = requestAnimationFrame(() => dh(e17));
  }
  uh(e17);
}
function ph(e17) {
  let t10 = ih(e17);
  cancelAnimationFrame(t10.raf), t10.phase = `idle`, t10.acc = 0;
  for (let t11 of ah.get(e17) ?? []) t11.classList.remove(`is-party`);
  uh(e17);
}
function Lne(e17) {
  ph(e17), rh.delete(e17);
}
function Rne(e17) {
  for (let t10 of ah.get(e17) ?? []) {
    let n10 = oh.get(e17);
    t10.isConnected && n10 && (delete t10.dataset.k, mh(t10, n10, true, {}));
  }
}
function mh(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h)), o10 = Vm(t10.pitch), s10 = n10 ? rh.get(t10.id)?.secs ?? o10.secs : o10.secs, c10 = `${i10}x${a10}|${n10}|${JSON.stringify(o10)}|${s10}`;
  if (e17.dataset.k === c10) return;
  e17.dataset.k = c10, e17.setAttribute(`aria-label`, hh(t10));
  let l10 = Mne(o10, s10, n10, i10, a10);
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(l10) : `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(l10), t11.style.width = `${i10}px`, t11.style.height = `${a10}px`, e17.replaceChildren(t11);
    return;
  }
  oh.set(t10.id, t10);
  let u10 = ah.get(t10.id);
  u10 || ah.set(t10.id, u10 = /* @__PURE__ */ new Set());
  for (let e18 of u10) e18.isConnected || u10.delete(e18);
  u10.add(e17);
  let d10 = document.createElement(`div`);
  d10.className = `lh-wg-pic`, d10.innerHTML = l10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(d10), t10.locked && e17.classList.add(`is-armed`), e17.classList.add(`lh-swipe-ok`), e17.dataset.pitchId = t10.id, uh(t10.id), Si(e17, { slide: false, hit: (t11) => {
    let n11 = e17.dataset.pitchId;
    if (!n11) return null;
    let r11 = t11.getAttribute(`data-a`) ?? ``;
    if (r11 === `go`) fh(n11);
    else if (r11 === `reset`) ph(n11);
    else if (r11.startsWith(`d:`)) {
      let e18 = ih(n11);
      if (e18.phase === `run`) return null;
      e18.secs = Number(r11.slice(2)), ph(n11), requestAnimationFrame(() => Rne(n11));
    }
    return null;
  } });
}
function hh(e17) {
  return `Elevator Pitch: ${Hm(Vm(e17.pitch).secs)} Zeit. Tippe auf \u201ELos!\u201C \u2013 der Fahrstuhl f\xE4hrt nach oben, oben ist die Zeit um.`;
}
var zne = `
.lh-wg-pitch .lh-key{cursor:pointer}
.lh-edit .lh-wg-pitch:not(.is-armed) .lh-key{cursor:inherit}
.lh-wg-pitch .lh-ep-door-l,.lh-wg-pitch .lh-ep-door-r{transition:transform .9s ease-in-out .5s}
.lh-wg-pitch.is-done .lh-ep-door-l{transform:translateX(-86px)}
.lh-wg-pitch.is-done .lh-ep-door-r{transform:translateX(86px)}
.lh-wg-pitch .lh-ep-wave{transform-box:fill-box;transform-origin:0% 100%}
.lh-wg-pitch.is-done .lh-ep-wave{animation:lh-ep-wave .5s ease-in-out 1.2s infinite alternate}
.lh-wg-pitch .lh-ep-beam,.lh-wg-pitch .lh-ep-pool{transition:opacity .6s}
.lh-wg-pitch.is-running .lh-ep-beam{opacity:.6}
.lh-wg-pitch.is-done .lh-ep-beam{opacity:.85}
.lh-wg-pitch.is-done .lh-ep-pool{opacity:.45}
.lh-wg-pitch.is-final .lh-ep-time{animation:lh-ep-blink 1s steps(2,start) infinite}
.lh-wg-pitch .lh-ep-conf{opacity:0;transform-box:fill-box;transform-origin:center}
.lh-wg-pitch.is-party .lh-ep-conf{animation-name:lh-ep-fall;animation-timing-function:linear;animation-iteration-count:infinite}
@keyframes lh-ep-fall{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:1;transform:translateY(1080px) rotate(640deg)}}
@keyframes lh-ep-wave{to{transform:rotate(-28deg)}}
@keyframes lh-ep-blink{to{opacity:.35}}
@media (prefers-reduced-motion:reduce){.lh-wg-pitch.is-party .lh-ep-conf,.lh-wg-pitch.is-done .lh-ep-wave{animation:none}}`;
var gh = [`nunito`, `andika`, `druck`, `grund`, `lexend`];
var _h = [`Montag`, `Dienstag`, `Mittwoch`, `Donnerstag`, `Freitag`, `Samstag`, `Sonntag`];
var vh = [`Mo`, `Di`, `Mi`, `Do`, `Fr`, `Sa`, `So`];
var Bne = [`erste`, `zweite`, `dritte`, `vierte`, `f\xFCnfte`, `sechste`, `siebte`, `achte`, `neunte`, `zehnte`];
var yh = [{ id: `formal`, label: `Sachlich` }, { id: `clear`, label: `Klar` }, { id: `colorful`, label: `Bunt` }, { id: `playful`, label: `Verspielt` }, { id: `chalk`, label: `Tafel` }];
var bh = [`#e03131`, `#f76707`, `#f59f00`, `#2f9e44`, `#1c7ed6`, `#7048e8`, `#d6336c`];
var Vne = /^#[0-9a-f]{6}$/i;
var xh = (e17, t10, n10 = ``) => typeof e17 == `string` ? e17.slice(0, t10) : n10;
var Sh = (e17, t10, n10, r10) => typeof e17 == `number` && Number.isFinite(e17) ? Math.round(Math.min(n10, Math.max(t10, e17))) : r10;
function Ch() {
  return { title: `Mein Stundenplan`, days: 5, lessons: 6, start: 480, len: 45, breaks: [{ after: 3, min: 30, label: `Pause` }], times: true, show: `both`, design: `clear`, font: `nunito`, today: true, subjects: [], plan: [], after: { on: true, label: `Nach der Schule`, options: [], plan: [] } };
}
function wh(e17, t10 = (e18) => typeof e18 == `string` ? e18 : void 0) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = Ch(), i10 = (e18) => {
    let n11 = /* @__PURE__ */ new Set();
    return (Array.isArray(e18) ? e18 : []).filter((e19) => !!e19 && typeof e19 == `object`).map((e19) => {
      let n12 = xh(e19.id, 40), r11 = t10(e19.img);
      return { id: n12, name: xh(e19.name, 40).trim(), color: typeof e19.color == `string` && Vne.test(e19.color) ? e19.color : `#868e96`, ...r11 ? { img: r11 } : {} };
    }).filter((e19) => e19.id && !n11.has(e19.id) && (n11.add(e19.id), true)).slice(0, 60);
  }, a10 = i10(n10.subjects), o10 = n10.after && typeof n10.after == `object` ? n10.after : {}, s10 = i10(o10.options), c10 = new Set([...a10, ...s10].map((e18) => e18.id)), l10 = (e18) => Array.isArray(e18) ? e18.filter((e19) => typeof e19 == `string` && c10.has(e19)).slice(0, 2) : [], u10 = n10.days === 6 || n10.days === 7 ? n10.days : 5, d10 = Sh(n10.lessons, 1, 10, r10.lessons), f10 = Array.from({ length: 7 }, (e18, t11) => {
    let r11 = Array.isArray(n10.plan) ? n10.plan[t11] : void 0;
    return Array.from({ length: 10 }, (e19, t12) => l10(Array.isArray(r11) ? r11[t12] : void 0));
  }), p10 = (Array.isArray(n10.breaks) ? n10.breaks : []).filter((e18) => !!e18 && typeof e18 == `object`).map((e18) => ({ after: Sh(e18.after, 1, 9, 3), min: Sh(e18.min, 5, 120, 15), label: xh(e18.label, 30, `Pause`).trim() || `Pause`, ...typeof e18.sub == `string` && c10.has(e18.sub) ? { sub: e18.sub } : {} })).slice(0, 6);
  return { title: xh(n10.title, 80, r10.title), days: u10, lessons: d10, start: Sh(n10.start, 300, 840, r10.start), len: Sh(n10.len, 20, 120, r10.len), breaks: Array.isArray(n10.breaks) ? p10 : r10.breaks, times: n10.times !== false, show: n10.show === `text` || n10.show === `pic` ? n10.show : `both`, design: yh.some((e18) => e18.id === n10.design) ? n10.design : r10.design, font: gh.includes(String(n10.font)) ? n10.font : `nunito`, today: n10.today !== false, subjects: a10, plan: f10, after: { on: o10.on !== false, label: xh(o10.label, 40, r10.after.label), options: s10, plan: Array.from({ length: 7 }, (e18, t11) => l10(Array.isArray(o10.plan) ? o10.plan[t11] : void 0)) } };
}
var Th = (e17) => `${Math.floor(e17 / 60)}:${String(e17 % 60).padStart(2, `0`)}`;
function Eh(e17) {
  let t10 = [], n10 = [], r10 = e17.start;
  for (let i10 = 0; i10 < e17.lessons; i10++) {
    t10.push({ from: r10, to: r10 + e17.len }), r10 += e17.len;
    for (let t11 of e17.breaks) t11.after === i10 + 1 && i10 + 1 < e17.lessons && (n10.push({ after: i10 + 1, from: r10, to: r10 + t11.min, b: t11 }), r10 += t11.min);
  }
  return { lessons: t10, breaks: n10 };
}
function Une(e17, t10) {
  let n10 = parseInt(e17.slice(1), 16), r10 = (e18) => Math.round(255 - (255 - e18) * t10).toString(16).padStart(2, `0`);
  return `#${r10(n10 >> 16 & 255)}${r10(n10 >> 8 & 255)}${r10(n10 & 255)}`;
}
var Dh = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/"/g, `&quot;`);
var Oh = (e17) => `${Math.round(e17 * 10) / 10}px`;
var kh = (e17, t10, n10) => {
  let r10 = Math.max(3, ...e17.split(/\s+/).map((e18) => [...e18].length));
  return Math.max(8, Math.min(n10, t10 * 0.94 / (0.58 * r10)));
};
function Ah(e17, t10, n10, r10) {
  if (!e17) return ``;
  let i10 = e17.img ? r10(e17.img) : void 0, a10 = t10 !== `text` && i10, o10 = t10 !== `pic` || !i10, s10 = a10 ? o10 ? n10.h * 0.58 : n10.h * 0.84 : 0, c10 = a10 ? Math.min(n10.w * 0.86, o10 ? n10.h * 0.58 * 1.25 : n10.h * 0.84 * 1.25) : 0, l10 = kh(e17.name, n10.w, a10 ? n10.h * 0.235 : n10.h * 0.32);
  return `<div class="lh-tt-sub" style="--c:${e17.color}">` + (a10 ? `<img src="${Dh(i10)}" alt="" draggable="false" style="max-width:${Oh(c10)};max-height:${Oh(s10)}">` : ``) + (o10 ? `<span class="lh-tt-name" style="font-size:${Oh(l10)}">${Dh(e17.name)}</span>` : ``) + `</div>`;
}
function jh(e17, t10, n10, r10) {
  let i10 = Eh(e17), a10 = new Map([...e17.subjects, ...e17.after.options].map((e18) => [e18.id, e18])), o10 = Math.min(t10, n10) * 0.022, s10 = Math.min(t10, n10) * (e17.design === `formal` ? 0 : 8e-3), c10 = e17.title.trim() ? n10 * 0.085 : 0, l10 = n10 * 0.065, u10 = n10 * 0.048, d10 = e17.after.on, f10 = e17.lessons + +!!d10, p10 = 2 * o10 + c10 + l10 + i10.breaks.length * u10 + (f10 + i10.breaks.length) * s10, m10 = Math.max(20, (n10 - p10) / f10), h10 = e17.times || d10 ? t10 * (e17.times ? 0.105 : 0.085) : 0, g10 = (t10 - 2 * o10 - h10 - e17.days * s10) / e17.days, _10 = Ve(e17.font).replace(/"/g, `'`), v10 = `<div class="lh-tt lh-tt-${e17.design}${r10.editing ? ` is-editing` : ``}" style="width:${Oh(t10)};height:${Oh(n10)};padding:${Oh(o10)};font-family:${_10};--g:${Oh(s10)}">`;
  c10 && (v10 += `<div class="lh-tt-title" style="height:${Oh(c10)};font-size:${Oh(Math.min(c10 * 0.62, t10 * 0.9 / (0.56 * Math.max(4, [...e17.title].length))))}">${Dh(e17.title)}</div>`);
  let y10 = `${h10 ? `${Oh(h10)} ` : ``}repeat(${e17.days}, ${Oh(g10)})`, b10 = [Oh(l10)], x10 = h10 ? `<div class="lh-tt-corner"></div>` : ``, S10 = Math.min(l10 * 0.46, kh(`Donnerstag`, g10, l10 * 0.46)), C10 = g10 / S10 > 6.4;
  for (let t11 = 0; t11 < e17.days; t11++) {
    let e18 = r10.today === t11;
    x10 += `<div class="lh-tt-day${e18 ? ` is-today` : ``}" style="--dc:${bh[t11]};font-size:${Oh(S10)}">${C10 ? _h[t11] : vh[t11]}</div>`;
  }
  let w10 = (t11, n11, i11, o11) => {
    let s11 = { w: g10, h: m10 }, c11 = t11.length === 2 ? `<div class="lh-tt-split">${Ah(a10.get(t11[0]), e17.show, { w: g10 / 2 - 4, h: s11.h }, r10.src)}<i></i>${Ah(a10.get(t11[1]), e17.show, { w: g10 / 2 - 4, h: s11.h }, r10.src)}</div>` : Ah(a10.get(t11[0]), e17.show, s11, r10.src), l11 = a10.get(t11[0]), u11 = t11.map((e18) => a10.get(e18)?.name ?? ``).filter(Boolean);
    return `<div class="lh-tt-cell${t11.length ? `` : ` is-empty`}${i11 === `after` ? ` is-after` : ``}${r10.today === n11 ? ` is-today` : ``}" data-d="${n11}" data-l="${i11}" data-say="${Dh(`${o11}: ${u11.length ? u11.join(` oder `) : `frei`}`)}" style="--c:${l11?.color ?? `#adb5bd`};--tc:${Une(l11?.color ?? `#adb5bd`, 0.16)};--dc:${bh[n11]}">${c11}</div>`;
  }, T10 = 0;
  for (let t11 = 0; t11 < e17.lessons; t11++) {
    b10.push(Oh(m10));
    let n11 = i10.lessons[t11];
    if (h10) {
      let r11 = Math.min(m10 * 0.3, h10 * 0.3);
      x10 += `<div class="lh-tt-time"><b style="font-size:${Oh(r11)}">${t11 + 1}.</b>${e17.times ? `<span style="font-size:${Oh(Math.min(m10 * 0.16, h10 * 0.17))}">${Th(n11.from)}<br>${Th(n11.to)}</span>` : ``}</div>`;
    }
    for (let r11 = 0; r11 < e17.days; r11++) x10 += w10(e17.plan[r11]?.[t11] ?? [], r11, t11, `${_h[r11]}, ${Bne[t11] ?? `${t11 + 1}.`} Stunde${e17.times ? `, ${Th(n11.from)} Uhr` : ``}`);
    for (; T10 < i10.breaks.length && i10.breaks[T10].after === t11 + 1; T10++) {
      let t12 = i10.breaks[T10];
      b10.push(Oh(u10));
      let n12 = t12.b.sub ? a10.get(t12.b.sub) : void 0, o11 = n12?.img && e17.show !== `text` ? r10.src(n12.img) : void 0, s11 = u10 * 0.48;
      h10 && (x10 += `<div class="lh-tt-time is-break" style="font-size:${Oh(Math.min(u10 * 0.4, h10 * 0.17))}">${e17.times ? `${Th(t12.from)}\u2013${Th(t12.to)}` : ``}</div>`), x10 += `<div class="lh-tt-break" style="grid-column:span ${e17.days};font-size:${Oh(s11)}" data-say="${Dh(`${t12.b.label}${e17.times ? `, ${Th(t12.from)} bis ${Th(t12.to)} Uhr` : ``}`)}">` + (o11 ? `<img src="${Dh(o11)}" alt="" style="height:${Oh(u10 * 0.86)}">` : ``) + `<span>${Dh(t12.b.label)}</span>${e17.times ? `<small>${t12.b.min} Min.</small>` : ``}</div>`;
    }
  }
  if (d10) {
    b10.push(Oh(m10)), h10 && (x10 += `<div class="lh-tt-time is-afterlabel" style="font-size:${Oh(kh(e17.after.label, h10, m10 * 0.16))}">${Dh(e17.after.label)}</div>`);
    for (let t11 = 0; t11 < e17.days; t11++) x10 += w10(e17.after.plan[t11] ?? [], t11, `after`, `${_h[t11]}, ${e17.after.label}`);
  }
  return v10 += `<div class="lh-tt-grid" style="grid-template-columns:${y10};grid-template-rows:${b10.join(` `)}">${x10}</div>`, v10 + `</div>`;
}
var Mh = () => ((/* @__PURE__ */ new Date()).getDay() + 6) % 7;
function Wne(e17, t10, n10, r10) {
  let i10 = t10.tt ? wh(t10.tt) : Ch(), a10 = Math.max(1, Math.round(t10.w)), o10 = Math.max(1, Math.round(t10.h)), s10 = n10 && i10.today && Mh() < i10.days ? Mh() : void 0, c10 = `${a10}x${o10}|${n10}|${s10}|${JSON.stringify(t10.tt ?? null)}`;
  if (e17.dataset.k === c10) return;
  e17.dataset.k = c10, e17.setAttribute(`aria-label`, Nh(t10));
  let l10 = r10.assets ?? {};
  e17.innerHTML = jh(i10, a10, o10, { src: (e18) => {
    let t11 = l10[e18];
    return t11 ? r10.assetUrl ? r10.assetUrl(t11) : t11.dataUrl : void 0;
  }, today: s10 });
}
function Nh(e17) {
  let t10 = e17.tt;
  return t10 ? `Stundenplan${t10.title ? `: ${t10.title}` : ``}. Tippe auf eine Stunde, dann wird sie vorgelesen.` : `Stundenplan`;
}
var Gne = (e17) => e17?.closest?.(`[data-say]`)?.getAttribute(`data-say`) ?? null;
var Kne = `
.lh-tt{box-sizing:border-box;display:flex;flex-direction:column;color:#212529;background:#fff;line-height:1.1;overflow:hidden}
.lh-tt *{box-sizing:border-box}
.lh-tt-title{display:flex;align-items:center;justify-content:center;font-weight:800;text-align:center;white-space:nowrap;overflow:hidden}
.lh-tt-grid{display:grid;gap:var(--g)}
.lh-tt-day{display:flex;align-items:center;justify-content:center;font-weight:800;text-align:center;overflow:hidden}
.lh-tt-time{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center;font-variant-numeric:tabular-nums;overflow:hidden}
.lh-tt-time b{font-weight:800}
.lh-tt-time span{opacity:.75;line-height:1.15}
.lh-tt-time.is-afterlabel{font-weight:700;padding:0 4px;overflow-wrap:anywhere}
.lh-tt-cell{position:relative;display:flex;align-items:stretch;justify-content:center;overflow:hidden;min-width:0;min-height:0}
.lh-tt-sub{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3%;padding:3% 4%;text-align:center}
.lh-tt-sub img{display:block;width:auto;height:auto;flex:none}
.lh-tt-name{font-weight:700;line-height:1.05;overflow-wrap:break-word;-webkit-hyphens:auto;hyphens:auto;max-width:100%}
.lh-tt-split{flex:1;display:flex;min-width:0}
.lh-tt-split>i{flex:none;width:0;border-left:2px dashed currentColor;opacity:.35;margin:8% 0}
.lh-tt-break{display:flex;align-items:center;justify-content:center;gap:12px;font-weight:700;overflow:hidden}
.lh-tt-break img{display:block;width:auto}
.lh-tt-break small{font-size:.7em;font-weight:600;opacity:.7}
.lh-tt.is-editing .lh-tt-cell{cursor:pointer}
.lh-tt.is-editing .lh-tt-cell:hover{outline:3px solid #2160c4;outline-offset:-3px}
.lh-tt.is-editing .lh-tt-cell.is-empty::after{content:"+";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:28px;color:#adb5bd}
.lh-widget.is-live .lh-tt-cell,.lh-widget.is-live .lh-tt-break{cursor:pointer}
/* Sachlich: lines, a stripe of the subject colour */
.lh-tt-formal .lh-tt-title{justify-content:flex-start;color:#212529}
.lh-tt-formal .lh-tt-grid{border-top:2px solid #495057;border-left:1px solid #ced4da}
.lh-tt-formal .lh-tt-grid>*{border-right:1px solid #ced4da;border-bottom:1px solid #ced4da}
.lh-tt-formal .lh-tt-day{background:#f1f3f5;border-bottom:2px solid #495057}
.lh-tt-formal .lh-tt-corner{background:#f1f3f5;border-bottom:2px solid #495057}
.lh-tt-formal .lh-tt-time{background:#f8f9fa}
.lh-tt-formal .lh-tt-cell:not(.is-empty){border-left:6px solid var(--c)}
.lh-tt-formal .lh-tt-break{background:#f8f9fa;color:#495057;font-weight:600}
.lh-tt-formal .lh-tt-day.is-today{background:#e7f5ff}
/* Klar: blue head, tinted cells */
.lh-tt-clear{background:#f8fafc}
.lh-tt-clear .lh-tt-title{color:#1864ab}
.lh-tt-clear .lh-tt-day{background:#1c7ed6;color:#fff;border-radius:10px}
.lh-tt-clear .lh-tt-time{background:#e9ecef;border-radius:10px;color:#343a40}
.lh-tt-clear .lh-tt-cell{background:#fff;border:2px solid #dee2e6;border-radius:10px}
.lh-tt-clear .lh-tt-cell:not(.is-empty){background:var(--tc);border-color:var(--c)}
.lh-tt-clear .lh-tt-break{background:#fff3bf;border-radius:10px;color:#5c4813}
.lh-tt-clear .lh-tt-day.is-today{box-shadow:0 0 0 4px #fab005}
.lh-tt-clear .lh-tt-cell.is-today{border-width:3px}
/* Bunt: colourful days, full colours */
.lh-tt-colorful{background:#fff9db}
.lh-tt-colorful .lh-tt-title{color:#e8590c}
.lh-tt-colorful .lh-tt-day{background:var(--dc);color:#fff;border-radius:14px}
.lh-tt-colorful .lh-tt-time{background:#fff;border-radius:14px;color:#495057}
.lh-tt-colorful .lh-tt-cell{background:#fff;border-radius:14px}
.lh-tt-colorful .lh-tt-cell:not(.is-empty){background:var(--c);color:#fff}
.lh-tt-colorful .lh-tt-cell:not(.is-empty) .lh-tt-sub img{background:#fff;border-radius:12px;padding:4%}
.lh-tt-colorful .lh-tt-break{background:#ffe066;border-radius:14px;color:#5c4813}
.lh-tt-colorful .lh-tt-day.is-today{box-shadow:0 0 0 4px #212529}
/* Verspielt: cards on a soft background, round heads */
.lh-tt-playful{background:linear-gradient(160deg,#e7f5ff,#fff0f6 55%,#fff9db)}
.lh-tt-playful .lh-tt-title{color:#7048e8;letter-spacing:.02em}
.lh-tt-playful .lh-tt-day{background:#fff;color:var(--dc);border:4px solid var(--dc);border-radius:999px}
.lh-tt-playful .lh-tt-time{background:#fff;border-radius:20px;color:#7048e8;border:3px dashed #d0bfff}
.lh-tt-playful .lh-tt-cell{background:#fff;border-radius:22px;border:4px solid #e9ecef;box-shadow:0 4px 0 rgba(0,0,0,.08)}
.lh-tt-playful .lh-tt-cell:not(.is-empty){border-color:var(--c)}
.lh-tt-playful .lh-tt-cell:not(.is-empty) .lh-tt-name{color:var(--c)}
.lh-tt-playful .lh-tt-break{background:#fff;border-radius:999px;border:3px dotted #fcc419;color:#e67700}
.lh-tt-playful .lh-tt-day.is-today{background:var(--dc);color:#fff}
/* Tafel: chalk on green */
.lh-tt-chalk{background:#2b4a3a;color:#f8f9fa}
.lh-tt-chalk .lh-tt-title{color:#fff}
.lh-tt-chalk .lh-tt-day{border-bottom:3px solid rgba(255,255,255,.7);color:#fff}
.lh-tt-chalk .lh-tt-time{color:#e9ecef}
.lh-tt-chalk .lh-tt-cell{border:2px dashed rgba(255,255,255,.35);border-radius:8px}
.lh-tt-chalk .lh-tt-cell:not(.is-empty){border:3px solid var(--c);background:rgba(255,255,255,.06)}
.lh-tt-chalk .lh-tt-cell:not(.is-empty) .lh-tt-sub img{background:#fff;border-radius:10px;padding:4%}
.lh-tt-chalk .lh-tt-break{border-top:2px dashed rgba(255,255,255,.5);border-bottom:2px dashed rgba(255,255,255,.5);color:#ffe066}
.lh-tt-chalk .lh-tt-day.is-today{color:#ffe066;border-bottom-color:#ffe066}
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
var Kh = [`#2563eb`, `#dc2626`];
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
function pre(e17, t10, n10 = `syl`) {
  let r10 = e17.createDocumentFragment();
  for (let i10 of tg(t10)) {
    if (i10.color === void 0) {
      r10.append(i10.text);
      continue;
    }
    let t11 = e17.createElement(`span`);
    t11.className = `${n10} ${n10}-${i10.color ? `r` : `b`}`, t11.style.color = Kh[i10.color], t11.textContent = i10.text, r10.append(t11);
  }
  return r10;
}
function ng(e17, t10 = `syl`, n10 = {}) {
  let r10 = e17.ownerDocument, i10 = r10.createTreeWalker(e17, NodeFilter.SHOW_TEXT), a10 = [];
  for (let e18 = i10.nextNode(); e18; e18 = i10.nextNode()) {
    let n11 = e18;
    n11.data.trim() && !n11.parentElement?.closest(`.${t10}, script, style, svg`) && a10.push(n11);
  }
  for (let e18 of a10) {
    let i11 = pre(r10, e18.data, t10);
    if (!n10.plate) {
      e18.replaceWith(i11);
      continue;
    }
    let a11 = r10.createElement(`span`);
    a11.className = `${t10}-plate`, a11.append(i11), e18.replaceWith(a11);
  }
}
function Xg(e17) {
  let t10 = e17.anlaut?.practice;
  return t10 ? `Anlaut-Tastatur: ${t10.words.length === 1 ? `ein Wort` : `${t10.words.length} W\xF6rter`} zum Schreiben \u2013 tippe auf die Bilder.` : `Anlaut-Tastatur \u2013 tippe auf die Bilder und schreibe ein Wort.`;
}
var Zg = [`stage`, `campfire`, `songbook`, `meadow`, `sea`, `chalk`, `neon`, `winter`];
var o_ = [`grund`, `druck`, `andika`, `nunito`, `lexend`, `schreib`, `sas`];
var s_ = { min: 36, max: 130, def: 84 };
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
function Gie(e17) {
  return `Karaoke-Liedblatt: ${p_(e17.karaoke).title}. Tippe auf Start und sing mit.`;
}
function My(e17) {
  let t10 = e17.synth;
  if (!t10) return `Silben verbinden`;
  let n10 = t10.syls.length;
  return `Silben verbinden: ${n10 === 1 ? `eine Silbe` : `${n10} Silben`} \u2013 zieh den ersten Buchstaben zum zweiten.`;
}
function bb(e17) {
  let t10 = e17.clap;
  if (!t10) return `Silben klatschen`;
  let n10 = t10.words.length;
  return `Silben klatschen: ${n10 === 1 ? `ein Bild` : `${n10} Bilder`} \u2013 sprich das Wort und klatsche die Silben.`;
}
var Gae = [[`Milch 1 l`, 99, 149], [`Butter`, 179, 249], [`Brot`, 189, 349], [`Semmeln 6 St\xFCck`, 149, 259], [`\xC4pfel 1 kg`, 199, 299], [`Bananen 1 kg`, 139, 199], [`Tomaten`, 149, 249], [`Gurke`, 49, 89], [`Karotten 1 kg`, 79, 129], [`Kartoffeln 2,5 kg`, 249, 399], [`Nudeln`, 79, 169], [`Reis`, 119, 229], [`Joghurt`, 39, 89], [`K\xE4se`, 199, 399], [`Eier 10 St\xFCck`, 199, 329], [`Orangensaft`, 129, 249], [`Mineralwasser`, 39, 89], [`M\xFCsli`, 199, 399], [`Haferflocken`, 59, 119], [`Honig`, 299, 549], [`Kaffee`, 499, 899], [`Tee`, 129, 249], [`Schokolade`, 79, 189], [`Kekse`, 99, 199], [`Mehl`, 59, 99], [`Zucker`, 79, 129], [`Zahnpasta`, 89, 199], [`Seife`, 69, 149], [`Sp\xFClmittel`, 79, 149], [`Taschent\xFCcher`, 99, 199], [`Paprika`, 99, 179], [`Erdbeeren`, 199, 349], [`Quark`, 49, 99], [`Ketchup`, 99, 199]];
var xb = [[`Kaffee`, 5, 8], [`K\xE4se`, 3, 5], [`Honig`, 4, 6], [`Blumenstrau\xDF`, 6, 12], [`Waschmittel`, 6, 11], [`Wassermelone`, 3, 5], [`Pfanne`, 18, 34], [`Handtuch`, 8, 16], [`Regenschirm`, 9, 19], [`Brettspiel`, 19, 35], [`Fu\xDFball`, 12, 25], [`T-Shirt`, 9, 19], [`Bettw\xE4sche`, 25, 45], [`Toaster`, 19, 39], [`Kopfh\xF6rer`, 15, 49], [`Rucksack`, 19, 39], [`Puzzle`, 7, 15], [`Malkasten`, 6, 12], [`Tasse`, 3, 7], [`Kerzen`, 4, 9], [`Gie\xDFkanne`, 5, 11], [`Taschenlampe`, 7, 16], [`Federmappe`, 8, 18], [`Wecker`, 9, 21]];
var Kae = [[`Semmel`, 25, 45], [`Kaugummi`, 40, 90], [`Apfel`, 35, 60], [`Banane`, 25, 45], [`Lolli`, 15, 35], [`Breze`, 55, 85], [`Joghurt`, 39, 69], [`Mandarine`, 20, 35], [`Gummib\xE4rchen`, 69, 99], [`Wasser 0,5 l`, 49, 79], [`Radiergummi`, 45, 85], [`Bleistift`, 35, 75], [`Notizblock`, 69, 99], [`Postkarte`, 50, 90], [`M\xFCsliriegel`, 45, 79], [`Milch klein`, 49, 79], [`Keks`, 15, 40], [`Zeitung`, 80, 99], [`Spitzer`, 39, 79], [`Briefmarke`, 85, 95]];
var Sb = (e17, t10) => {
  let n10 = e17.slice();
  for (let e18 = n10.length - 1; e18 > 0; e18--) {
    let t11 = Math.floor(Math.random() * (e18 + 1));
    [n10[e18], n10[t11]] = [n10[t11], n10[e18]];
  }
  return n10.slice(0, t10);
};
var Cb = (e17, t10) => e17 + Math.floor(Math.random() * (t10 - e17 + 1));
function wb(e17, t10, n10) {
  let r10 = Math.max(3, Math.min(10, Math.round(e17)));
  return n10 === `euro` ? Sb(t10 === `simple` ? xb.filter(([, e18]) => e18 <= 8) : xb, r10).map(([e18, n11, r11]) => {
    let i10 = Cb(n11, t10 === `simple` ? Math.min(r11, 10) : r11);
    return t10 === `simple` && i10 > 5 && (i10 = Math.round(i10 / 5) * 5 || 5), { name: e18, price: i10 * 100 };
  }) : n10 === `cent` ? Sb(Kae, r10).map(([e18, n11, r11]) => {
    let i10 = Cb(n11, r11);
    return t10 === `simple` && (i10 = Math.min(90, Math.max(10, Math.round(i10 / 10) * 10))), { name: e18, price: Math.min(99, i10) };
  }) : Sb(Gae, r10).map(([e18, n11, r11]) => {
    let i10 = Cb(n11, r11);
    return i10 = t10 === `simple` ? Math.max(10, Math.round(i10 / 10) * 10) : i10, { name: e18, price: i10 };
  });
}
function Tb(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = t10.format === `euro` || t10.format === `cent` ? t10.format : `eurocent`, r10 = t10.level === `complex` ? `complex` : `simple`, i10 = (Array.isArray(t10.lines) ? t10.lines : []).filter((e18) => !!e18 && typeof e18 == `object`).map((e18) => ({ name: String(e18.name ?? ``).slice(0, 40), price: Math.max(0, Math.min(1e6, Math.round(Number(e18.price) || 0))) })).filter((e18) => e18.name).slice(0, 10), a10 = Math.max(3, Math.min(10, Math.round(Number(t10.count) || i10.length || 5))), o10 = Math.max(1, Math.min(10, Math.round(Number(t10.rounds) || 1)));
  return { count: a10, level: r10, format: n10, change: t10.change === true, rounds: o10, lines: i10.length ? i10 : wb(a10, r10, n10) };
}
function Zb(e17) {
  let t10 = Tb(e17.rc);
  return `Kassenzettel mit ${t10.lines.length} Eink\xE4ufen: Rechne die Summe mit dem Taschenrechner aus und trage sie ein${t10.change ? `, danach das R\xFCckgeld` : ``}.`;
}
var ax = [{ value: `easy`, label: `Leicht`, hint: `Strecken nach rechts, oben, unten oder links, Quadrate und Rechtecke \u2013 ganze Zentimeter, an den Karolinien entlang.` }, { value: `medium`, label: `Mittel`, hint: `L\xE4ngen mit Millimetern (4,5 cm), Rechtecke, rechtwinklige Dreiecke und Treppen.` }, { value: `hard`, label: `Schwer`, hint: `Mit Winkeln (Geodreieck): schr\xE4ge Strecken, gleichseitige und gleichschenklige Dreiecke, Parallelogramme, ein Haus mit Dach.` }, { value: `rising`, label: `Ansteigend`, hint: `Erst leicht, dann mittel, am Ende schwer.` }];
var ox = [{ value: `lines`, label: `Strecken` }, { value: `quads`, label: `Vierecke` }, { value: `tris`, label: `Dreiecke` }, { value: `more`, label: `Weitere Formen` }];
var cx = (e17, t10) => e17 + Math.floor(Math.random() * (t10 - e17 + 1));
var lx = (e17) => e17[Math.floor(Math.random() * e17.length)];
var ux = [0, 90, 0, 270, 90, 180];
function dx(e17, t10) {
  if (e17 === `easy`) {
    if (t10 === `lines`) return { k: `line`, a: 10 * cx(3, 10), d: lx(ux) };
    if (t10 === `quads`) {
      if (Math.random() < 0.4) return { k: `square`, a: 10 * cx(2, 5) };
      let e18 = 10 * cx(3, 8), t11 = 10 * cx(2, 5);
      return t11 === e18 && (t11 -= 10), { k: `rect`, a: e18, b: t11 };
    }
    return t10 === `tris` ? { k: `rtri`, a: 10 * cx(3, 6), b: 10 * cx(2, 5) } : { k: `stairs`, a: 10, b: 10, n: cx(3, 4) };
  }
  if (e17 === `medium`) {
    if (t10 === `lines`) {
      let e18 = cx(25, 95);
      return e18 % 10 == 0 && (e18 += 5), { k: `line`, a: e18, d: lx(ux) };
    }
    if (t10 === `quads`) {
      if (Math.random() < 0.3) return { k: `square`, a: 5 * cx(5, 11) };
      let e18 = 5 * cx(8, 16), t11 = 5 * cx(4, 10);
      return t11 === e18 && (t11 -= 5), { k: `rect`, a: e18, b: t11 };
    }
    return t10 === `tris` ? { k: `rtri`, a: 5 * cx(6, 14), b: 5 * cx(4, 10) } : { k: `stairs`, a: 5 * cx(3, 5), b: 5 * cx(2, 3), n: cx(3, 4) };
  }
  if (t10 === `lines`) return { k: `aline`, a: 10 * cx(4, 8), d: 5 * cx(4, 15) };
  if (t10 === `quads`) {
    let e18 = 10 * cx(4, 6), t11 = 10 * cx(2, 4);
    return { k: `para`, a: e18, b: t11 === e18 ? t11 - 10 : t11, d: lx([45, 50, 55, 60, 65, 70]) };
  }
  return t10 === `tris` ? Math.random() < 0.45 ? { k: `equi`, a: 10 * cx(3, 6) } : { k: `iso`, a: 10 * cx(4, 7), d: lx([35, 40, 45, 50, 55, 60]) } : { k: `house`, a: 10 * cx(3, 5) };
}
function fx(e17) {
  let t10 = Math.max(1, Math.min(10, Math.round(e17.count))), n10 = e17.groups.length ? e17.groups : ox.map((e18) => e18.value), r10 = [];
  for (let i10 = 0; i10 < t10; i10++) {
    let a10 = e17.level === `rising` ? i10 < t10 / 3 ? `easy` : i10 < 2 * t10 / 3 ? `medium` : `hard` : e17.level, o10 = dx(a10, lx(n10));
    for (let e18 = 0; e18 < 6 && r10.length && r10[r10.length - 1].k === o10.k; e18++) o10 = dx(a10, lx(n10));
    r10.push(o10);
  }
  return r10;
}
var loe = [`line`, `square`, `rect`, `rtri`, `stairs`, `aline`, `equi`, `iso`, `para`, `house`];
var px = (e17, t10, n10, r10) => typeof e17 == `number` && Number.isFinite(e17) ? Math.min(n10, Math.max(t10, Math.round(e17))) : r10;
function mx(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = ax.some((e18) => e18.value === t10.level) ? t10.level : `easy`, r10 = Array.isArray(t10.groups) ? t10.groups.filter((e18) => ox.some((t11) => t11.value === e18)) : [], i10 = t10.tol === `loose` || t10.tol === `strict` ? t10.tol : `normal`, a10 = { level: n10, count: px(t10.count, 1, 10, 5), groups: r10, tol: i10, flash: px(t10.flash, 0, 3, 2), tasks: (Array.isArray(t10.tasks) ? t10.tasks : []).filter((e18) => !!e18 && typeof e18 == `object` && loe.includes(e18.k)).slice(0, 10).map((e18) => ({ k: e18.k, a: px(e18.a, 5, 150, 50), ...e18.b === void 0 ? {} : { b: px(e18.b, 5, 150, 30) }, ...e18.d === void 0 ? {} : { d: px(e18.d, 0, 359, 0) }, ...e18.n === void 0 ? {} : { n: px(e18.n, 2, 6, 3) } })) };
  return a10.tasks.length || (a10.tasks = fx(a10)), a10;
}
var yx = (e17) => `${(e17 / 10).toLocaleString(`de-DE`, { maximumFractionDigits: 1 })}\xA0cm`;
var doe = { 0: `nach rechts`, 90: `nach oben`, 180: `nach links`, 270: `nach unten` };
var bx = `Der rote Punkt ist die Ecke unten links.`;
function xx(e17) {
  let t10 = e17.a, n10 = e17.b ?? t10, r10 = e17.d ?? 0;
  switch (e17.k) {
    case `line`:
      return `Zeichne eine Strecke: ${yx(t10)} lang${t10 % 10 ? ` (${t10}\xA0mm)` : ``}, vom roten Punkt ${doe[r10] ?? `nach rechts`}.`;
    case `aline`:
      return `Zeichne vom roten Punkt eine ${yx(t10)} lange Strecke schr\xE4g nach rechts oben. Der Winkel zur waagrechten Linie ist ${r10}\xB0.`;
    case `square`:
      return `Zeichne ein Quadrat mit ${yx(t10)} langen Seiten. ${bx}`;
    case `rect`:
      return `Zeichne ein Rechteck: ${yx(t10)} lang und ${yx(n10)} hoch. ${bx}`;
    case `rtri`:
      return `Zeichne ein rechtwinkliges Dreieck: vom roten Punkt ${yx(t10)} nach rechts, von dort ${yx(n10)} nach oben, dann zur\xFCck zum roten Punkt.`;
    case `stairs`:
      return `Zeichne eine Treppe mit ${e17.n ?? 3} Stufen: Jede Stufe ist ${yx(n10)} hoch und ${yx(t10)} breit. Fang am roten Punkt an und zeichne zuerst nach oben.`;
    case `equi`:
      return `Zeichne ein gleichseitiges Dreieck: Jede Seite ist ${yx(t10)} lang, alle Winkel sind 60\xB0. ${bx}`;
    case `iso`:
      return `Zeichne ein Dreieck: Die Grundseite ist ${yx(t10)} lang, vom roten Punkt nach rechts. Die beiden Winkel an der Grundseite sind je ${r10}\xB0.`;
    case `para`:
      return `Zeichne ein Parallelogramm: unten ${yx(t10)} lang, die schr\xE4gen Seiten ${yx(n10)} lang, der Winkel unten links ist ${r10}\xB0. ${bx}`;
    case `house`:
      return `Zeichne ein Haus: ein Quadrat mit ${yx(t10)} langen Seiten und darauf ein Dach. Die Dachseiten steigen mit 45\xB0 an und treffen sich \xFCber der Mitte. ${bx}`;
  }
}
function wx(e17) {
  return e17.replace(/(\d+),(\d+)/g, `$1 Komma $2`).replace(/(\d)\s*cm\b/g, `$1 Zentimeter`).replace(/(\d)\s*mm\b/g, `$1 Millimeter`).replace(/(\d)\s*°/g, `$1 Grad`).replace(/[()]/g, `,`);
}
function Jx(e17) {
  let t10 = mx(e17.geo), n10 = t10.tasks[0];
  return `Geometrie: ${t10.tasks.length === 1 ? `eine Aufgabe` : `${t10.tasks.length} Aufgaben`}. ${n10 ? wx(xx(n10)) : ``}`;
}
var eS = [1, 2, 5, 10, 20, 50, 100, 200];
var tS = [500, 1e3, 2e3, 5e3, 1e4, 2e4];
var nS = [{ value: `cent`, label: `Nur Cent`, hint: `Alles unter 1 \u20AC (35 ct) \u2013 ein Einkauf kostet h\xF6chstens 1 \u20AC.` }, { value: `euro`, label: `Ganze Euro`, hint: `Preise von 1 \u20AC bis 9 \u20AC, ohne Cent.` }, { value: `round`, label: `Glatte Preise`, hint: `Euro und 10-Cent-Schritte (1,50 \u20AC, 2,20 \u20AC).` }, { value: `mixed`, label: `Euro und Cent`, hint: `Ladenpreise wie 1,49 \u20AC oder 2,85 \u20AC.` }, { value: `bills`, label: `Nur Scheine`, hint: `Preise in 5-Euro-Schritten (5 \u20AC, 15 \u20AC, 40 \u20AC) \u2013 bezahlt wird mit Scheinen.` }, { value: `high`, label: `Hohe Summen`, hint: `Teure Dinge von 20 \u20AC bis 500 \u20AC (129,99 \u20AC).` }];
var rS = (e17, t10, n10) => t10.includes(String(e17)) ? e17 : n10;
var iS = (e17, t10) => typeof e17 == `string` ? e17.trim().slice(0, t10) : ``;
var aS = (e17, t10, n10, r10) => Math.max(t10, Math.min(n10, Math.round(Number(e17)) || r10));
function oS(e17, t10 = (e18) => typeof e18 == `string` && e18 ? e18 : void 0) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = [];
  for (let e18 of Array.isArray(n10.items) ? n10.items : []) {
    if (r10.length >= 12) break;
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, i11 = iS(n11.name, 30);
    if (!i11) continue;
    let a11 = { name: i11, price: aS(n11.price, 1, 1e7, 100), g: rS(n11.g, [`m`, `f`, `n`], `n`) };
    Number(n11.base) > 0 && (a11.base = aS(n11.base, 1, 1e7, a11.price));
    let o10 = t10(n11.img);
    o10 && (a11.img = o10);
    let s10 = iS(n11.sg, 40), c10 = iS(n11.pl, 40);
    s10 && (a11.sg = s10), c10 && (a11.pl = c10), r10.push(a11);
  }
  let i10 = {}, a10 = n10.money && typeof n10.money == `object` ? n10.money : {};
  for (let e18 of [...eS, ...tS]) {
    let n11 = t10(a10[String(e18)]);
    n11 && (i10[String(e18)] = n11);
  }
  return { basket: iS(n10.basket, 20), sign: iS(n10.sign, 24) || `LADEN`, level: rS(n10.level, nS.map((e18) => e18.value), `mixed`), items: r10.length ? r10 : [{ name: `Apfel`, price: 50, g: `m`, pl: `\xC4pfel` }], customers: aS(n10.customers, 1, 10, 5), kinds: aS(n10.kinds, 1, 5, 2), qty: n10.qty !== false, pics: n10.pics !== false, give: n10.give === true, read: n10.read === true, money: i10 };
}
function fC(e17) {
  let t10 = oS(e17.shop);
  return `Kasse: ${t10.customers === 1 ? `Ein Kunde kauft` : `${t10.customers} Kunden kaufen`} ein. Tippe die Waren ein, dr\xFCcke auf Summe und kassiere das Geld${t10.give ? `, dann gib das R\xFCckgeld heraus` : ``}.`;
}
function vC(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = t10.tool === `abacus` || t10.tool === `ruler` || t10.tool === `calc` ? t10.tool : `boat`, r10 = typeof t10.n == `number` && Number.isFinite(t10.n) ? Math.round(t10.n) : 0;
  return n10 === `boat` ? { tool: n10, n: [5, 10, 20].includes(r10) ? r10 : 10 } : n10 === `abacus` ? { tool: n10, n: r10 === 2 ? 2 : 10 } : n10 === `ruler` ? { tool: n10, n: Math.min(30, Math.max(10, r10 || 20)) } : { tool: n10, n: 0 };
}
var xC = (e17) => e17.tool === `boat` ? `Rechenschiffchen ${e17.n}` : e17.tool === `abacus` ? `Rechenrahmen ${e17.n === 2 ? 20 : 100}` : e17.tool === `ruler` ? `Lineal ${e17.n} cm` : `Taschenrechner`;
var SC = /* @__PURE__ */ new Map();
function RC(e17) {
  let t10 = vC(e17.mt);
  if (t10.tool === `boat`) {
    let n10 = SC.get(e17.id), r10 = n10?.cells.filter((e18) => e18 === 1).length ?? 0, i10 = n10?.cells.filter((e18) => e18 === 2).length ?? 0;
    return `${xC(t10)}${r10 || i10 ? `: ${r10} blaue und ${i10} rote Pl\xE4ttchen` : ``}.`;
  }
  if (t10.tool === `abacus`) {
    let n10 = SC.get(e17.id)?.rows.reduce((e18, t11) => e18 + t11, 0) ?? 0;
    return `${xC(t10)}${n10 ? `: ${n10} Kugeln links` : ``}.`;
  }
  return t10.tool === `calc` ? `Taschenrechner: ${SC.get(e17.id)?.calc.shown ?? `0`}.` : `${xC(t10)}.`;
}
var zC = [{ id: `walk`, label: `Fu\xDFweg` }, { id: `bike`, label: `Radweg` }, { id: `bus`, label: `Busfahrt` }, { id: `train`, label: `Bahnstrecke` }, { id: `car`, label: `Autofahrt` }, { id: `boat`, label: `Schiff` }];
var use = { walk: `<circle cx="13" cy="4" r="2.6" fill="C"/><path d="M12 8l-3 6 3 2-2 6M12 8l3 5 3 1M9 14l-4 2M12 16l4 6" fill="none" stroke="C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`, bike: `<circle cx="6" cy="16" r="4" fill="none" stroke="C" stroke-width="2.2"/><circle cx="18" cy="16" r="4" fill="none" stroke="C" stroke-width="2.2"/><path d="M6 16l4-8h6l2 8M10 8l2 8h-6M14 5h3" fill="none" stroke="C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`, bus: `<rect x="4" y="3" width="16" height="15" rx="3" fill="none" stroke="C" stroke-width="2.4"/><path d="M4 11h16M7 21v-3M17 21v-3" stroke="C" stroke-width="2.4" stroke-linecap="round"/>`, train: `<rect x="6" y="2" width="12" height="15" rx="3" fill="none" stroke="C" stroke-width="2.4"/><path d="M6 10h12M8 22l2-5M16 22l-2-5" stroke="C" stroke-width="2.4" stroke-linecap="round"/>`, car: `<path d="M3 15v-3l3-5h10l4 5h1v3zM6 12h14" fill="none" stroke="C" stroke-width="2.2" stroke-linejoin="round"/><circle cx="7.5" cy="16.5" r="2.3" fill="C"/><circle cx="17" cy="16.5" r="2.3" fill="C"/>`, boat: `<path d="M3 15h18l-3 5H6zM12 3v11M12 4l6 9h-6" fill="none" stroke="C" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>` };
var BC = [`#e03131`, `#1c7ed6`, `#2f9e44`, `#f08c00`, `#7048e8`, `#212529`];
var dse = { 1: 6, 2: 10, 3: 16 };
var VC = 1300;
var HC = `\xA9 OpenStreetMap-Mitwirkende`;
var UC = `\xA9 OpenStreetMap-Mitwirkende, openstreetmap.de`;
var WC = (e17, t10, n10, r10 = `de`) => r10 === `org` ? `/api/karte?quelle=org&z=${e17}&x=${t10}&y=${n10}` : `/api/karte?quelle=de&z=${e17}&x=${t10}&y=${n10}`;
var GC = [{ id: `place`, label: `Ort`, color: `#e03131` }, { id: `home`, label: `Zuhause`, color: `#f08c00` }, { id: `school`, label: `Schule`, color: `#1c7ed6` }, { id: `church`, label: `Kirche`, color: `#7048e8` }, { id: `train`, label: `Bahnhof`, color: `#495057` }, { id: `bus`, label: `Bushaltestelle`, color: `#0ca678` }, { id: `playground`, label: `Spielplatz`, color: `#f76707` }, { id: `tree`, label: `Park, Wald`, color: `#2f9e44` }, { id: `water`, label: `See, Fluss`, color: `#1098ad` }, { id: `mountain`, label: `Berg`, color: `#795548` }, { id: `museum`, label: `Museum`, color: `#5f3dc4` }, { id: `shop`, label: `Einkaufen`, color: `#d6336c` }, { id: `food`, label: `Essen`, color: `#e8590c` }, { id: `hospital`, label: `Krankenhaus`, color: `#c92a2a` }, { id: `police`, label: `Polizei`, color: `#1864ab` }, { id: `fire`, label: `Feuerwehr`, color: `#e03131` }, { id: `sport`, label: `Sport`, color: `#2b8a3e` }, { id: `star`, label: `Stern`, color: `#f59f00` }, { id: `flag`, label: `Ziel`, color: `#212529` }, { id: `treasure`, label: `Schatz`, color: `#a61e4d` }];
var KC = (e17) => GC.find((t10) => t10.id === e17) ?? GC[0];
var fse = { place: `<circle cx="12" cy="12" r="5" fill="#fff"/>`, home: `<path d="M4 12l8-7 8 7M7 10v9h10v-9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/>`, school: `<path d="M2 9l10-5 10 5-10 5zM6 11v5c3 3 9 3 12 0v-5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>`, church: `<path d="M12 2v6M9 5h6M6 21v-8l6-4 6 4v8zM10 21v-4h4v4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>`, train: `<rect x="6" y="3" width="12" height="13" rx="3" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M6 10h12M8 21l2-5M16 21l-2-5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`, bus: `<rect x="5" y="3" width="14" height="15" rx="3" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M5 11h14M8 21v-3M16 21v-3" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`, playground: `<path d="M4 21L9 4h6l5 17M7 13h10" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="9" r="1.6" fill="#fff"/>`, tree: `<path d="M12 2l7 10h-4l4 6H5l4-6H5zM12 18v4" fill="#fff" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>`, water: `<path d="M3 9q3-3 6 0t6 0 6 0M3 15q3-3 6 0t6 0 6 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`, mountain: `<path d="M2 20l7-12 4 6 3-4 6 10z" fill="#fff"/>`, museum: `<path d="M3 9l9-5 9 5zM5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/>`, shop: `<path d="M5 8h14l-1 13H6zM9 8a3 3 0 0 1 6 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>`, food: `<path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M16 21V3c-2 1-3 4-3 8h3" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`, hospital: `<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" fill="#fff"/>`, police: `<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><circle cx="12" cy="11" r="2.5" fill="#fff"/>`, fire: `<path d="M12 22c-4 0-7-3-6-7 1-3 4-4 3-9 4 2 6 6 5 9 2-1 2-3 2-4 2 2 3 4 3 6 0 3-3 5-7 5z" fill="#fff"/>`, sport: `<circle cx="12" cy="12" r="8" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M12 8l3.5 2.5-1.3 4h-4.4l-1.3-4z" fill="#fff"/>`, star: `<path d="M12 2l3 7 7 .6-5.4 4.8 1.7 7L12 17.8 5.7 21.4l1.7-7L2 9.6 9 9z" fill="#fff"/>`, flag: `<path d="M6 22V3M6 4h12l-3 4 3 4H6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`, treasure: `<path d="M5 5l14 14M19 5L5 19" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>` };
function qC(e17, t10 = 1) {
  return `<g transform="scale(${t10})"><path d="M0 0C-4 -14 -21 -24 -21 -40a21 21 0 0 1 42 0c0 16-17 26-21 40z" fill="${KC(e17).color}" stroke="#ffffff" stroke-width="3"/><g transform="translate(-12 -52)">${fse[e17]}</g></g>`;
}
var JC = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-24 -66 48 70" width="48" height="70">${qC(e17)}</svg>`);
var YC = 1400;
var pse = 990;
var XC = (e17, t10, n10) => `<defs><linearGradient id="${e17}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${t10}"/><stop offset="1" stop-color="${n10}"/></linearGradient></defs><rect width="${YC}" height="${pse}" fill="url(#${e17})"/>`;
var mse = (e17, t10, n10, r10) => `<g transform="translate(${e17} ${t10})" opacity="0.55"><circle r="${n10}" fill="none" stroke="${r10}" stroke-width="3"/><path d="M0 ${-n10 * 1.25}L${n10 * 0.22} 0 0 ${n10 * 1.25} ${-n10 * 0.22} 0zM${-n10 * 1.25} 0L0 ${n10 * 0.22} ${n10 * 1.25} 0 0 ${-n10 * 0.22}z" fill="${r10}"/><text y="${-n10 * 1.4}" font-size="${n10 * 0.5}" font-family="Georgia, serif" font-weight="700" text-anchor="middle" fill="${r10}">N</text></g>`;
var ZC = [{ id: `classic`, label: `Klassisch`, paper: `#ffffff`, title: `#1c3d5a`, page: () => XC(`mp-classic`, `#ffffff`, `#eef3f8`), frame: `#ffffff`, frameW: 10, tint: `none` }, { id: `treasure`, label: `Schatzkarte`, paper: `#f1e2c0`, title: `#5c3a12`, page: () => {
  let e17 = XC(`mp-old`, `#f6e9cb`, `#e2c995`);
  return e17 += `<rect x="12" y="12" width="1376" height="966" rx="26" fill="none" stroke="#8c5a2b" stroke-width="6" stroke-dasharray="20 12" opacity="0.55"/>`, e17 + mse(1300, 92, 36, `#7a4b1c`);
}, frame: `#8c5a2b`, frameW: 8, tint: `sepia` }, { id: `colorful`, label: `Bunt`, paper: `#4dabf7`, title: `#ffffff`, page: () => XC(`mp-color`, `#4dabf7`, `#9775fa`) + `<circle cx="1260" cy="120" r="190" fill="#ffffff" opacity="0.12"/><circle cx="110" cy="900" r="230" fill="#ffffff" opacity="0.1"/>`, frame: `#ffffff`, frameW: 14, tint: `none` }, { id: `night`, label: `Nacht`, paper: `#14213d`, title: `#ffe066`, page: () => {
  let e17 = XC(`mp-night`, `#1b2a4a`, `#0b1426`), t10 = 11, n10 = () => ((t10 = t10 * 16807 % 2147483647) - 1) / 2147483646;
  for (let t11 = 0; t11 < 70; t11++) e17 += `<circle cx="${Math.round(n10() * YC)}" cy="${Math.round(n10() * 160)}" r="${(1 + n10() * 2).toFixed(1)}" fill="#ffffff" opacity="${(0.3 + n10() * 0.5).toFixed(2)}"/>`;
  return e17;
}, frame: `#ffe066`, frameW: 6, tint: `dark` }, { id: `nature`, label: `Natur`, paper: `#ebfbee`, title: `#1b4332`, page: () => XC(`mp-nature`, `#f4fce3`, `#d3f9d8`), frame: `#2f9e44`, frameW: 8, tint: `soft` }];
var QC = (e17) => ZC.find((t10) => t10.id === e17) ?? ZC[0];
function $C(e17, t10, n10) {
  let r10 = 256 * 2 ** n10, i10 = Math.max(-85.05, Math.min(85.05, e17)) * Math.PI / 180;
  return { x: (t10 + 180) / 360 * r10, y: (1 - Math.log(Math.tan(i10) + 1 / Math.cos(i10)) / Math.PI) / 2 * r10 };
}
function ew(e17, t10, n10) {
  let r10 = 256 * 2 ** n10, i10 = e17 / r10 * 360 - 180;
  return { lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * t10 / r10))) * 180 / Math.PI, lon: ((i10 + 180) % 360 + 360) % 360 - 180 };
}
function tw(e17, t10, n10) {
  let r10 = $C(e17.lat, e17.lon, e17.zoom), i10 = $C(t10, n10, e17.zoom), a10 = 256 * 2 ** e17.zoom, o10 = i10.x - r10.x;
  return o10 > a10 / 2 && (o10 -= a10), o10 < -a10 / 2 && (o10 += a10), { x: VC / 2 + o10, y: 380 + (i10.y - r10.y) };
}
function nw(e17, t10, n10) {
  let r10 = $C(e17.lat, e17.lon, e17.zoom);
  return ew(r10.x + t10 - VC / 2, r10.y + n10 - 380, e17.zoom);
}
function rw(e17, t10 = VC, n10 = 760) {
  let r10 = $C(e17.lat, e17.lon, e17.zoom), i10 = r10.x - t10 / 2, a10 = r10.y - n10 / 2, o10 = 2 ** e17.zoom, s10 = [];
  for (let r11 = Math.floor(a10 / 256); r11 <= Math.floor((a10 + n10) / 256); r11++) if (!(r11 < 0 || r11 >= o10)) for (let n11 = Math.floor(i10 / 256); n11 <= Math.floor((i10 + t10) / 256); n11++) s10.push({ z: e17.zoom, x: (n11 % o10 + o10) % o10, y: r11, left: n11 * 256 - i10, top: r11 * 256 - a10 });
  return s10;
}
function iw(e17, t10) {
  let n10 = Math.PI / 180, r10 = (t10[0] - e17[0]) * n10, i10 = (t10[1] - e17[1]) * n10, a10 = Math.sin(r10 / 2) ** 2 + Math.cos(e17[0] * n10) * Math.cos(t10[0] * n10) * Math.sin(i10 / 2) ** 2;
  return 127420176e-1 * Math.asin(Math.min(1, Math.sqrt(a10)));
}
var aw = (e17) => e17.reduce((t10, n10, r10) => r10 ? t10 + iw(e17[r10 - 1], n10) : 0, 0);
function ow(e17) {
  return e17 < 1e3 ? `${Math.max(10, Math.round(e17 / 10) * 10)} m` : e17 < 1e4 ? `${(e17 / 1e3).toFixed(1).replace(`.`, `,`)} km` : `${Math.round(e17 / 1e3)} km`;
}
var sw = (e17, t10, n10, r10) => typeof e17 == `number` && Number.isFinite(e17) ? Math.min(r10, Math.max(n10, e17)) : t10;
var cw = (e17, t10) => {
  if (!t10 || typeof t10 != `object`) return {};
  let n10 = t10;
  return { [e17]: { label: typeof n10.label == `string` ? n10.label.slice(0, 60) : ``, ...lw(n10) } };
};
var lw = (e17) => typeof e17.lx == `number` && typeof e17.ly == `number` && Number.isFinite(e17.lx) && Number.isFinite(e17.ly) ? { lx: sw(e17.lx, 0, -1400, 1400), ly: sw(e17.ly, 0, -1e3, 1e3) } : {};
var uw = (e17 = `classic`) => ({ lat: 51.1657, lon: 10.4515, zoom: 5, markers: [], design: e17 });
function gse(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (Array.isArray(n10.markers) ? n10.markers.slice(0, 40) : []).flatMap((e18) => {
    let t11 = e18 && typeof e18 == `object` ? e18 : {};
    return typeof t11.lat != `number` || typeof t11.lon != `number` || !Number.isFinite(t11.lat) || !Number.isFinite(t11.lon) ? [] : [{ lat: sw(t11.lat, 0, -85, 85), lon: sw(t11.lon, 0, -180, 180), sym: GC.some((e19) => e19.id === t11.sym) ? t11.sym : `place`, label: typeof t11.label == `string` ? t11.label.slice(0, 60) : ``, ...lw(t11) }];
  }), i10 = t10(n10.img), a10 = (Array.isArray(n10.paths) ? n10.paths.slice(0, 20) : []).flatMap((e18) => {
    let t11 = e18 && typeof e18 == `object` ? e18 : {}, n11 = (Array.isArray(t11.pts) ? t11.pts.slice(0, 400) : []).flatMap((e19) => Array.isArray(e19) && typeof e19[0] == `number` && typeof e19[1] == `number` && Number.isFinite(e19[0]) && Number.isFinite(e19[1]) ? [[sw(e19[0], 0, -85, 85), sw(e19[1], 0, -180, 180)]] : []);
    return n11.length < 2 ? [] : [{ pts: n11, label: typeof t11.label == `string` ? t11.label.slice(0, 60) : ``, color: typeof t11.color == `string` && /^#[0-9a-f]{6}$/i.test(t11.color) ? t11.color : BC[0], width: t11.width === 1 || t11.width === 3 ? t11.width : 2, dash: t11.dash === true, dist: t11.dist !== false, ...lw(t11), ...zC.some((e19) => e19.id === t11.kind) ? { kind: t11.kind } : {}, ...cw(`start`, t11.start), ...cw(`end`, t11.end) }];
  });
  return { ...a10.length ? { paths: a10 } : {}, lat: sw(n10.lat, 51.1657, -85, 85), lon: sw(n10.lon, 10.4515, -180, 180), zoom: Math.round(sw(n10.zoom, 5, 2, 18)), markers: r10, design: ZC.some((e18) => e18.id === n10.design) ? n10.design : `classic`, ...i10 ? { img: i10 } : {} };
}
var dw = `Andika, Andika, Verdana, Arial, sans-serif`;
var vse = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/"/g, `&quot;`);
var yse = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var fw = `Verdana, Arial, Helvetica, sans-serif`;
var pw = 21;
var bse = 13;
var mw;
function hw(e17) {
  if (mw === void 0) try {
    mw = typeof document > `u` ? null : document.createElement(`canvas`).getContext(`2d`);
  } catch {
    mw = null;
  }
  return mw ? (mw.font = `700 ${pw}px ${fw}`, Math.max(mw.measureText(e17).width, e17.length * pw * 0.5)) : e17.length * pw * 0.66;
}
var xse = (e17, t10) => e17.x < t10.x + t10.w + 6 && t10.x < e17.x + e17.w + 6 && e17.y < t10.y + t10.h + 4 && t10.y < e17.y + e17.h + 4;
var gw = (e17) => e17.x >= 8 && e17.y >= 8 && e17.x + e17.w <= 1292 && e17.y + e17.h <= 724;
var Sse = (e17) => ({ ...e17, x: Math.min(1292 - e17.w, Math.max(8, e17.x)), y: Math.min(724 - e17.h, Math.max(8, e17.y)) });
function _w(e17, t10) {
  let n10 = e17.slice(1).map((t11, n11) => Math.hypot(t11.x - e17[n11].x, t11.y - e17[n11].y)), r10 = n10.reduce((e18, t11) => e18 + t11, 0) * t10;
  for (let t11 = 0; t11 < n10.length; t11++) {
    if (r10 <= n10[t11]) {
      let i10 = n10[t11] ? r10 / n10[t11] : 0;
      return { x: e17[t11].x + (e17[t11 + 1].x - e17[t11].x) * i10, y: e17[t11].y + (e17[t11 + 1].y - e17[t11].y) * i10 };
    }
    r10 -= n10[t11];
  }
  return e17[e17.length - 1];
}
function vw(e17, t10 = false) {
  let n10 = pw * 1.6, r10 = e17.markers.map((t11) => {
    let n11 = tw(e17, t11.lat, t11.lon);
    return { x: n11.x - 22, y: n11.y - 62, w: 44, h: 62 };
  }), i10 = [], a10 = (e18, n11, a11) => {
    if (t10 && (e18.anchor.x < 0 || e18.anchor.y < 0 || e18.anchor.x > 1300 || e18.anchor.y > 760)) return;
    if (a11 && a11.lx !== void 0 && a11.ly !== void 0) {
      let t11 = { ...e18.base, x: e18.base.x + a11.lx, y: e18.base.y + a11.ly };
      i10.push({ ...e18, box: t11, manual: true }), r10.push(t11);
      return;
    }
    let o10 = n11.find((e19) => gw(e19) && !r10.some((t11) => xse(t11, e19))) ?? n11.find((e19) => gw(e19)) ?? (t10 ? n11[0] : Sse(n11[0]));
    i10.push({ ...e18, box: o10, manual: false }), r10.push(o10);
  };
  for (let t11 of e17.paths ?? []) if (!(t11.pts.length < 2)) {
    if (t11.start) {
      let n11 = tw(e17, t11.pts[0][0], t11.pts[0][1]);
      r10.push({ x: n11.x - 16, y: n11.y - 16, w: 32, h: 32 });
    }
    if (t11.end) {
      let n11 = tw(e17, t11.pts[t11.pts.length - 1][0], t11.pts[t11.pts.length - 1][1]);
      r10.push({ x: n11.x - 10, y: n11.y - 44, w: 40, h: 54 });
    }
  }
  return (e17.paths ?? []).forEach((t11, r11) => {
    if (t11.pts.length < 2) return;
    let i11 = t11.pts.map(([t12, n11]) => tw(e17, t12, n11));
    for (let e18 of [`start`, `end`]) {
      let o11 = t11[e18];
      if (!o11?.label) continue;
      let s11 = e18 === `start` ? i11[0] : i11[i11.length - 1], c11 = hw(o11.label) + 26, l11 = { x: s11.x + 22, y: s11.y - n10 / 2, w: c11, h: n10 };
      a10({ kind: e18, index: r11, text: o11.label, color: t11.color, base: l11, anchor: s11 }, [l11, { ...l11, x: s11.x - 22 - c11 }, { ...l11, x: s11.x - c11 / 2, y: s11.y - 24 - n10 }, { ...l11, x: s11.x - c11 / 2, y: s11.y + 24 }], o11);
    }
    let o10 = [t11.label || (t11.kind ? zC.find((e18) => e18.id === t11.kind)?.label ?? `` : ``), t11.dist ? `ca. ${ow(aw(t11.pts))}` : ``].filter(Boolean).join(` \xB7 `);
    if (!o10) return;
    let s10 = hw(o10) + 26 + (t11.kind ? 30 : 0), c10 = (e18, t12) => {
      let r12 = _w(i11, e18);
      return { x: r12.x - s10 / 2, y: r12.y + t12 - n10 / 2, w: s10, h: n10 };
    }, l10 = _w(i11, 0.5), u10 = c10(0.5, -20);
    a10({ kind: `path`, index: r11, text: o10, color: t11.color, base: u10, anchor: l10, ...t11.kind ? { icon: t11.kind } : {} }, [u10, c10(0.5, 30), c10(0.5, -64), c10(0.3, -20), c10(0.7, -20), c10(0.3, 30), c10(0.7, 30)], t11);
  }), e17.markers.forEach((t11, r11) => {
    if (!t11.label) return;
    let i11 = tw(e17, t11.lat, t11.lon), o10 = hw(t11.label) + 26, s10 = { x: i11.x + 26, y: i11.y - 44 - n10 / 2, w: o10, h: n10 };
    a10({ kind: `marker`, index: r11, text: t11.label, color: KC(t11.sym).color, base: s10, anchor: { x: i11.x, y: i11.y - 40 } }, [s10, { ...s10, x: i11.x - 26 - o10 }, { ...s10, x: i11.x - o10 / 2, y: i11.y - 70 - n10 }, { ...s10, x: i11.x - o10 / 2, y: i11.y + 8 }], t11);
  }), i10;
}
var Cse = (e17, t10) => ({ x: Math.min(e17.x + e17.w, Math.max(e17.x, t10.x)), y: Math.min(e17.y + e17.h, Math.max(e17.y, t10.y)) });
function yw(e17, t10 = false) {
  let n10 = ``;
  for (let t11 of e17.paths ?? []) {
    let r11 = t11.pts.map(([t12, n11]) => tw(e17, t12, n11));
    if (r11.length < 2) continue;
    let i10 = r11.map((e18, t12) => `${t12 ? `L` : `M`}${e18.x.toFixed(1)} ${e18.y.toFixed(1)}`).join(``), a10 = dse[t11.width];
    n10 += `<path d="${i10}" fill="none" stroke="#ffffff" stroke-width="${a10 + 6}" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`, n10 += `<path d="${i10}" fill="none" stroke="${t11.color}" stroke-width="${a10}" stroke-linecap="round" stroke-linejoin="round"${t11.dash ? ` stroke-dasharray="${a10 * 2.2} ${a10 * 1.8}"` : ``}/>`;
  }
  for (let t11 of e17.paths ?? []) if (!(t11.pts.length < 2)) {
    if (t11.start) {
      let r11 = tw(e17, t11.pts[0][0], t11.pts[0][1]);
      n10 += `<circle cx="${r11.x.toFixed(1)}" cy="${r11.y.toFixed(1)}" r="14" fill="${t11.color}" stroke="#ffffff" stroke-width="4"/><circle cx="${r11.x.toFixed(1)}" cy="${r11.y.toFixed(1)}" r="4.5" fill="#ffffff"/>`;
    }
    if (t11.end) {
      let r11 = tw(e17, t11.pts[t11.pts.length - 1][0], t11.pts[t11.pts.length - 1][1]);
      n10 += `<g transform="translate(${r11.x.toFixed(1)} ${r11.y.toFixed(1)})"><circle r="7" fill="${t11.color}" stroke="#ffffff" stroke-width="3"/><path d="M0 0V-38" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/><path d="M0 0V-38" stroke="#212529" stroke-width="3.5" stroke-linecap="round"/><path d="M1 -38h24l-6 8 6 8H1z" fill="${t11.color}" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/></g>`;
    }
  }
  let r10 = vw(e17, t10);
  for (let e18 of r10) {
    let t11 = Cse(e18.box, e18.anchor);
    if (Math.hypot(t11.x - e18.anchor.x, t11.y - e18.anchor.y) < (e18.kind === `marker` ? 40 : e18.kind === `path` ? 30 : 26)) continue;
    let r11 = `M${e18.anchor.x.toFixed(1)} ${e18.anchor.y.toFixed(1)}L${t11.x.toFixed(1)} ${t11.y.toFixed(1)}`;
    n10 += `<path d="${r11}" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/><path d="${r11}" stroke="${e18.color}" stroke-width="3.5" stroke-linecap="round"/><circle cx="${e18.anchor.x.toFixed(1)}" cy="${e18.anchor.y.toFixed(1)}" r="5" fill="${e18.color}" stroke="#ffffff" stroke-width="2"/>`;
  }
  for (let t11 of e17.markers) {
    let r11 = tw(e17, t11.lat, t11.lon);
    r11.x < -60 || r11.y < -10 || r11.x > 1360 || r11.y > 840 || (n10 += `<g transform="translate(${r11.x.toFixed(1)} ${r11.y.toFixed(1)})">${qC(t11.sym)}</g>`);
  }
  for (let e18 of r10) {
    let t11 = e18.icon ? `<g transform="translate(${(e18.box.x + bse - 2).toFixed(1)} ${(e18.box.y + e18.box.h / 2 - 12).toFixed(1)})">${use[e18.icon].replace(/"C"/g, `"${e18.color}"`)}</g>` : ``, r11 = e18.box.x + (e18.icon ? 30 : 0) + (e18.box.w - (e18.icon ? 30 : 0)) / 2;
    n10 += `<g><rect x="${e18.box.x.toFixed(1)}" y="${e18.box.y.toFixed(1)}" width="${e18.box.w.toFixed(1)}" height="${e18.box.h.toFixed(1)}" rx="10" fill="#ffffff" opacity="0.94" stroke="${e18.color}" stroke-width="2.5"/>${t11}<text x="${r11.toFixed(1)}" y="${(e18.box.y + e18.box.h / 2 + pw * 0.36).toFixed(1)}" font-size="${pw}" font-family="${fw}" font-weight="700" text-anchor="middle" fill="#212529">${vse(e18.text)}</text></g>`;
  }
  return n10;
}
var bw = `<rect width="${VC}" height="760" fill="#e9f5e1"/><path d="M0 520C200 460 340 600 560 540S900 420 1300 500V760H0z" fill="#a5d8ff"/><path d="M0 220Q300 170 520 260T1300 200" fill="none" stroke="#ffffff" stroke-width="26"/><path d="M640 0Q600 300 700 760" fill="none" stroke="#ffffff" stroke-width="20"/><circle cx="300" cy="380" r="70" fill="#b2f2bb"/><circle cx="980" cy="330" r="90" fill="#b2f2bb"/>`;
function wse(e17, t10, n10, r10) {
  let i10 = QC(e17.design), a10 = e17.img ? r10(e17.img) : void 0, o10 = i10.frameW, s10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-o10} ${-o10} ${VC + 2 * o10} ${760 + 2 * o10}" width="${t10}" height="${n10}">`;
  return s10 += `<rect x="${-o10}" y="${-o10}" width="${VC + 2 * o10}" height="${760 + 2 * o10}" rx="${o10 + 14}" fill="${i10.frame}"/>`, s10 += `<svg x="0" y="0" width="${VC}" height="760" viewBox="0 0 ${VC} 760">`, s10 += a10 ? `<image href="${a10}" x="0" y="0" width="${VC}" height="760" preserveAspectRatio="none"/>` : bw, s10 += yw(e17), s10 += `<rect x="908" y="730" width="392" height="30" fill="#ffffff" opacity="0.8"/><text x="1290" y="751" font-size="17" font-family="${dw}" text-anchor="end" fill="#343a40">${UC}</text>`, s10 + `</svg></svg>`;
}
var xw = /* @__PURE__ */ new Map();
var Sw = /* @__PURE__ */ new Map();
var Cw = /* @__PURE__ */ new Map();
var ww = /* @__PURE__ */ new Map();
var Tw = /* @__PURE__ */ new WeakSet();
var Ew = 3;
var Tse = `<defs><filter id="lh-map-sepia" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.545 0.577 0.142 0 0 0.262 0.765 0.126 0 0 0.184 0.360 0.338 0 0 0 0 0 1 0"/></filter><filter id="lh-map-dark" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0"/><feColorMatrix type="hueRotate" values="180"/><feComponentTransfer><feFuncR type="linear" slope="0.85"/><feFuncG type="linear" slope="0.85"/><feFuncB type="linear" slope="0.85" intercept="0.07"/></feComponentTransfer></filter><filter id="lh-map-soft" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0.65"/><feComponentTransfer><feFuncR type="linear" slope="1.04" intercept="0.025"/><feFuncG type="linear" slope="1.04" intercept="0.025"/><feFuncB type="linear" slope="1.04" intercept="0.025"/></feComponentTransfer></filter></defs>`;
var Dw = (e17) => `${e17.lat},${e17.lon},${e17.zoom}`;
function Ow(e17, t10) {
  let n10 = xw.get(e17.id);
  return n10 && n10.z > 0 && n10.base === Dw(t10) ? n10 : { z: 0, lat: t10.lat, lon: t10.lon };
}
function Ese(e17, t10, n10, r10) {
  if (t10 <= 0) return { z: 0, lat: e17.lat, lon: e17.lon };
  let i10 = e17.zoom + t10, a10 = 2 ** t10, o10 = $C(e17.lat, e17.lon, i10), s10 = $C(n10, r10, i10), c10 = (VC * a10 - VC) / 2, l10 = (760 * a10 - 760) / 2;
  return { z: t10, ...ew(Math.min(o10.x + c10, Math.max(o10.x - c10, s10.x)), Math.min(o10.y + l10, Math.max(o10.y - l10, s10.y)), i10) };
}
function Dse(e17, t10, n10) {
  let r10 = QC(t10.design), i10 = r10.frameW, a10 = Ow(e17, t10), o10 = t10.zoom + a10.z, s10 = 2 ** a10.z, c10 = { ...t10, lat: a10.lat, lon: a10.lon, zoom: o10 }, l10 = t10.img ? n10(t10.img) : void 0, u10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-i10} ${-i10} ${VC + 2 * i10} ${760 + 2 * i10}" width="100%" height="100%">${Tse}`;
  if (u10 += `<rect x="${-i10}" y="${-i10}" width="${VC + 2 * i10}" height="${760 + 2 * i10}" rx="${i10 + 14}" fill="${r10.frame}"/>`, u10 += `<svg x="0" y="0" width="${VC}" height="760" viewBox="0 0 ${VC} 760" overflow="hidden"><rect width="${VC}" height="760" fill="#f2efe9"/><g class="lh-map-pan">`, l10) {
    let e18 = $C(t10.lat, t10.lon, o10), n11 = $C(a10.lat, a10.lon, o10), r11 = VC / 2 + (e18.x - n11.x) - VC * s10 / 2, i11 = 380 + (e18.y - n11.y) - 760 * s10 / 2;
    u10 += `<image href="${l10}" x="${r11.toFixed(1)}" y="${i11.toFixed(1)}" width="${VC * s10}" height="${760 * s10}" preserveAspectRatio="none"/>`;
  } else u10 += bw;
  if (a10.z > 0 && l10) {
    let e18 = r10.tint === `none` ? `` : ` filter="url(#lh-map-${r10.tint})"`;
    for (let t11 of rw(c10)) u10 += `<image href="${WC(t11.z, t11.x, t11.y)}" x="${t11.left.toFixed(1)}" y="${t11.top.toFixed(1)}" width="256" height="256"${e18}/>`;
  }
  u10 += yw(c10, a10.z > 0) + `</g>`, u10 += `<rect x="908" y="730" width="392" height="30" fill="#ffffff" opacity="0.8"/><text x="1290" y="751" font-size="17" font-family="${dw}" text-anchor="end" fill="#343a40">${UC}</text>`;
  let d10 = (e18, t11, n11, r11, i11) => `<g class="lh-key${i11 ? ` is-off` : ``}" data-a="${e18}"><rect x="1224" y="${t11}" width="58" height="58" rx="14" fill="#ffffff" opacity="0.95" stroke="#adb5bd" stroke-width="2"/><path d="${n11}" fill="none" stroke="${i11 ? `#ced4da` : `#212529`}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect class="lh-kdown" x="1224" y="${t11}" width="58" height="58" rx="14" fill="#000000" opacity="0"/><title>${r11}</title></g>`;
  return u10 += d10(`zin`, 18, `M1239 47h28M1253 33v28`, `N\xE4her heran`, a10.z >= Ew || o10 >= 18 || !l10), u10 += d10(`zout`, 84, `M1239 113h28`, `Weiter weg`, a10.z <= 0), a10.z > 0 && (u10 += d10(`reset`, 150, `M1240 179a13 13 0 1 0 4-9.5M1240 166v8h8`, `Ganze Karte`, false)), u10 + `</svg></svg>`;
}
function Ose(e17) {
  let t10 = Cw.get(e17);
  if (t10) for (let n10 of Sw.get(e17) ?? []) n10.isConnected && Aw(n10, t10, true, { assets: ww.get(e17) });
}
function kw(e17, t10, n10, r10) {
  let i10 = Cw.get(e17), a10 = i10?.map;
  if (!i10 || !a10) return;
  let o10 = Ow(i10, a10), s10 = Ese(a10, Math.max(0, Math.min(Ew, 18 - a10.zoom, t10)), n10 ?? o10.lat, r10 ?? o10.lon);
  xw.set(e17, { ...s10, base: Dw(a10) }), requestAnimationFrame(() => Ose(e17));
}
function Aw(e17, t10, n10, r10) {
  let i10 = Math.max(1, Math.round(t10.w)), a10 = Math.max(1, Math.round(t10.h)), o10 = t10.map ?? uw();
  n10 && r10.assets && ww.set(t10.id, r10.assets);
  let s10 = r10.assets ?? (n10 ? ww.get(t10.id) : void 0) ?? {}, c10 = n10 ? Ow(t10, o10) : null, l10 = `${i10}x${a10}|${n10}|${c10 ? `${c10.z},${c10.lat.toFixed(6)},${c10.lon.toFixed(6)}` : ``}|${JSON.stringify(o10)}|${o10.img ? !!s10[o10.img] : ``}`;
  if (e17.dataset.k === l10) return;
  if (e17.dataset.k = l10, e17.setAttribute(`aria-label`, jw(t10)), !n10) {
    let t11 = wse(o10, i10, a10, (e18) => s10[e18]?.dataUrl), n11 = document.createElement(`img`);
    n11.className = `lh-wg-pic`, n11.alt = ``, n11.draggable = false, n11.src = r10.stickerUrl ? r10.stickerUrl(t11) : yse(t11), n11.style.width = `${i10}px`, n11.style.height = `${a10}px`, e17.replaceChildren(n11);
    return;
  }
  Cw.set(t10.id, t10);
  let u10 = Sw.get(t10.id);
  u10 || Sw.set(t10.id, u10 = /* @__PURE__ */ new Set());
  for (let e18 of u10) e18.isConnected || u10.delete(e18);
  u10.add(e17);
  let d10 = document.createElement(`div`);
  d10.className = `lh-wg-pic`, d10.innerHTML = Dse(t10, o10, (e18) => s10[e18]?.dataUrl), e17.replaceChildren(d10), t10.locked && e17.classList.add(`is-armed`), e17.classList.add(`lh-map-live`), e17.classList.toggle(`is-zoomed`, !!c10 && c10.z > 0), e17.classList.toggle(`lh-swipe-ok`, !c10 || c10.z <= 0), e17.dataset.mapId = t10.id, Si(e17, { slide: false, silent: true, hit: (t11) => {
    let n11 = e17.dataset.mapId, r11 = n11 ? Cw.get(n11) : void 0;
    if (!n11 || !r11?.map) return null;
    let i11 = t11.getAttribute(`data-a`), a11 = Ow(r11, r11.map).z;
    return i11 === `zin` ? kw(n11, a11 + 1) : i11 === `zout` ? kw(n11, a11 - 1) : i11 === `reset` && kw(n11, 0), null;
  } }), Tw.has(e17) || (Tw.add(e17), e17.addEventListener(`pointerdown`, (t11) => {
    let n11 = e17.dataset.mapId, r11 = n11 ? Cw.get(n11) : void 0;
    if (!n11 || !r11?.map || t11.button > 0 || t11.target.closest(`.lh-key`) || !Ti(e17)) return;
    let i11 = Ow(r11, r11.map);
    if (i11.z <= 0) return;
    t11.preventDefault();
    let a11 = e17.querySelector(`svg`), o11 = e17.querySelector(`.lh-map-pan`);
    if (!a11 || !o11) return;
    let s11 = (VC + 2 * QC(r11.map.design).frameW) / Math.max(1, a11.getBoundingClientRect().width), c11 = t11.clientX, l11 = t11.clientY, u11 = 0, d11 = 0, f10 = (e18) => {
      e18.pointerId === t11.pointerId && (u11 = (e18.clientX - c11) * s11, d11 = (e18.clientY - l11) * s11, o11.setAttribute(`transform`, `translate(${u11.toFixed(1)} ${d11.toFixed(1)})`));
    }, p10 = (e18) => {
      if (e18.pointerId !== t11.pointerId || (window.removeEventListener(`pointermove`, f10), window.removeEventListener(`pointerup`, p10, true), window.removeEventListener(`pointercancel`, p10, true), Math.abs(u11) + Math.abs(d11) < 2)) return;
      let a12 = r11.map.zoom + i11.z, o12 = $C(i11.lat, i11.lon, a12), s12 = ew(o12.x - u11, o12.y - d11, a12);
      kw(n11, i11.z, s12.lat, s12.lon);
    };
    window.addEventListener(`pointermove`, f10), window.addEventListener(`pointerup`, p10, true), window.addEventListener(`pointercancel`, p10, true);
  }));
}
function jw(e17) {
  let t10 = e17.map ?? uw(), n10 = t10.markers.filter((e18) => e18.label).map((e18) => e18.label), r10 = (t10.paths ?? []).map((e18) => [e18.label, e18.dist ? `ungef\xE4hr ${ow(aw(e18.pts))}` : ``].filter(Boolean).join(`, `)).filter(Boolean);
  return `Karte${t10.markers.length ? ` mit ${t10.markers.length === 1 ? `einer Markierung` : `${t10.markers.length} Markierungen`}` : ``}${n10.length ? `: ${n10.join(`, `)}` : ``}.${r10.length ? ` Wege: ${r10.join(`; `)}.` : ``}`;
}
var Gse = [`zw\xF6lf`, `eins`, `zwei`, `drei`, `vier`, `f\xFCnf`, `sechs`, `sieben`, `acht`, `neun`, `zehn`, `elf`, `zw\xF6lf`];
var gT = (e17) => Gse[(e17 - 1) % 12 + 1];
function _T(e17, t10) {
  let n10 = gT(e17), r10 = gT(e17 + 1);
  switch (t10) {
    case 0:
      return e17 % 12 == 1 ? `ein Uhr` : `${n10} Uhr`;
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
function vT(e17) {
  return e17 < 5 ? `in der Nacht` : e17 < 9 ? `am Morgen` : e17 < 12 ? `am Vormittag` : e17 < 14 ? `am Mittag` : e17 < 18 ? `am Nachmittag` : e17 < 22 ? `am Abend` : `in der Nacht`;
}
var yT = 1400;
var bT = 990;
var xT = [`Montag`, `Dienstag`, `Mittwoch`, `Donnerstag`, `Freitag`, `Samstag`, `Sonntag`];
var ST = [`Januar`, `Februar`, `M\xE4rz`, `April`, `Mai`, `Juni`, `Juli`, `August`, `September`, `Oktober`, `November`, `Dezember`];
var Kse = [[`September`, `Oktober`, `November`, `Dezember`, `Januar`, `Februar`], [`M\xE4rz`, `April`, `Mai`, `Juni`, `Juli`, `August`]];
var CT = `erste.zweite.dritte.vierte.f\xFCnfte.sechste.siebte.achte.neunte.zehnte.elfte.zw\xF6lfte.dreizehnte.vierzehnte.f\xFCnfzehnte.sechzehnte.siebzehnte.achtzehnte.neunzehnte.zwanzigste.einundzwanzigste.zweiundzwanzigste.dreiundzwanzigste.vierundzwanzigste.f\xFCnfundzwanzigste.sechsundzwanzigste.siebenundzwanzigste.achtundzwanzigste.neunundzwanzigste.drei\xDFigste.einunddrei\xDFigste`.split(`.`);
var qse = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var Jse = { Winter: `#c5f6fa`, Fr\u00FChling: `#d3f9d8`, Sommer: `#fff3bf`, Herbst: `#ffd8a8` };
var Yse = [`Winter`, `Winter`, `Fr\xFChling`, `Fr\xFChling`, `Fr\xFChling`, `Sommer`, `Sommer`, `Sommer`, `Herbst`, `Herbst`, `Herbst`, `Winter`];
function Xse(e17) {
  let t10 = e17.getDate();
  for (let n10 = 0; n10 < e17.getMonth(); n10++) t10 += qse[n10];
  return t10 > 355 ? `Winter` : t10 > 265 ? `Herbst` : t10 > 172 ? `Sommer` : t10 > 79 ? `Fr\xFChling` : `Winter`;
}
function wT() {
  let e17 = /* @__PURE__ */ new Date();
  return { day: xT[(e17.getDay() + 6) % 7], date: e17.getDate(), month: ST[e17.getMonth()], year: e17.getFullYear(), season: Xse(e17), key: `${e17.getFullYear()}-${e17.getMonth() + 1}-${e17.getDate()}` };
}
var TT = [`start`, `day`, `date`, `month`, `year`, `done`];
var Zse = { start: `day`, day: `date`, date: `month`, month: `year`, year: `done`, done: `done` };
var ET = (e17) => e17 === `day` || e17 === `date` || e17 === `month` || e17 === `year`;
var DT = { start: `Welcher Tag ist heute?`, day: `Welchen Tag haben wir?`, date: `Welches Datum haben wir?`, month: `Welchen Monat haben wir?`, year: `Welches Jahr haben wir?`, done: `` };
var OT = (e17, t10) => String(e17 === `day` ? t10.day : e17 === `date` ? t10.date : e17 === `month` ? t10.month : t10.year);
function kT(e17, t10) {
  return e17 === `day` ? `Heute ist ${t10.day}.` : e17 === `date` ? `Heute ist der ${CT[t10.date - 1]}.` : e17 === `month` ? `Wir haben ${t10.month}.` : `Wir haben das Jahr ${t10.year}.`;
}
function Qse(e17, t10) {
  return e17 === `day` ? `Heute ist nicht ${t10}.` : e17 === `date` ? `Heute ist nicht der ${CT[Number(t10) - 1] ?? t10}.` : e17 === `month` ? `Wir haben gerade nicht ${t10}.` : `Wir haben nicht das Jahr ${t10}.`;
}
var AT = (e17) => `Heute ist ${e17.day}, der ${CT[e17.date - 1]} ${e17.month} ${e17.year}.`;
var jT = (e17) => `Es ist ${e17.season}.`;
var MT = /* @__PURE__ */ new Map();
var NT = (e17, t10 = 0, n10 = 0) => ({ step: `start`, solved: false, help: false, busy: false, season: false, key: e17, run: t10, v: n10 });
function PT(e17) {
  let t10 = wT(), n10 = MT.get(e17);
  return n10 && n10.key === t10.key || (n10 = NT(t10.key, (n10?.run ?? 0) + 1, (n10?.v ?? 0) + 1), MT.set(e17, n10)), n10;
}
var FT = (e17) => `${Math.round(e17 * 100) / 100}px`;
function IT(e17, t10, n10, r10, i10, a10, o10) {
  let s10 = document.createElement(`div`);
  return s10.className = t10, s10.style.left = FT(n10 * e17.k), s10.style.top = FT(r10 * e17.k), s10.style.width = FT(i10 * e17.k), s10.style.height = FT(a10 * e17.k), o10?.appendChild(s10), s10;
}
var LT = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
function RT(e17, t10, n10, r10 = `#1f2937`) {
  let i10 = Math.round(n10 * e17.k), a10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${i10}" height="${i10}" fill="none" stroke="${r10}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${t10}</svg>`, o10 = document.createElement(`img`);
  return o10.alt = ``, o10.draggable = false, o10.src = e17.opts.stickerUrl ? e17.opts.stickerUrl(a10) : LT(a10), o10.style.width = o10.style.height = FT(i10), o10;
}
var $se = `<path d="M11 5 6 9H2v6h4l5 4z" fill="#1f2937"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>`;
var ece = `<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>`;
var tce = `<path d="M7 4.5v15l12.5-7.5z" fill="#fff" stroke="#fff"/>`;
function zT(e17, t10, n10, r10, i10, a10, o10, s10 = `lh-cal-pic`) {
  let c10 = e17.it.pics?.[t10], l10 = c10 ? e17.opts.assets?.[c10] : void 0;
  if (!l10) return;
  let u10 = l10.width || i10, d10 = l10.height || a10, f10 = Math.min(i10 / u10, a10 / d10), p10 = document.createElement(`img`);
  p10.className = s10, p10.alt = ``, p10.draggable = false, p10.src = e17.opts.assetUrl ? e17.opts.assetUrl(l10) : l10.dataUrl, p10.style.left = FT((n10 + (i10 - u10 * f10) / 2) * e17.k), p10.style.top = FT((r10 + (a10 - d10 * f10) / 2) * e17.k), p10.style.width = FT(u10 * f10 * e17.k), p10.style.height = FT(d10 * f10 * e17.k), o10.appendChild(p10);
}
var BT = 380;
var VT = 84;
function HT(e17, t10, n10, r10, i10, a10) {
  let o10 = IT(e17, `lh-cal-card`, r10, i10, BT, VT, a10);
  zT(e17, `${t10}_${n10}`, 0, 0, VT, VT, o10);
  let s10 = IT(e17, `lh-cal-word`, 92, 0, 288, VT, o10);
  s10.style.background = t10 === `Tag` ? `#e7f8ff` : Jse[Yse[ST.indexOf(n10)]], s10.style.borderWidth = FT(3 * e17.k), s10.style.borderRadius = FT(18 * e17.k), s10.style.fontSize = FT((n10.length > 9 ? 44 : 50) * e17.k), s10.style.paddingLeft = FT(16 * e17.k);
  let c10 = document.createElement(`span`);
  return c10.textContent = n10, s10.appendChild(c10), ng(c10, `lh-syl`), o10;
}
function nce(e17, t10, n10, r10, i10) {
  let a10 = IT(e17, `lh-cal-tile`, n10, r10, VT, VT, i10);
  a10.style.borderWidth = FT(3 * e17.k), a10.style.borderRadius = FT(18 * e17.k), a10.style.fontSize = FT(48 * e17.k), a10.style.paddingRight = FT(8 * e17.k);
  let o10 = (e18, t11) => {
    let n11 = document.createElement(`span`);
    n11.textContent = e18, n11.style.color = t11, a10.appendChild(n11);
  };
  return t10 >= 10 && o10(String(Math.floor(t10 / 10)), `#dc2626`), o10(String(t10 % 10), `#2563eb`), o10(`.`, `#111827`), a10;
}
function rce(e17, t10, n10, r10, i10) {
  let a10 = IT(e17, `lh-cal-year`, n10, r10, 200, VT, i10);
  return a10.style.borderWidth = FT(3 * e17.k), a10.style.borderRadius = FT(18 * e17.k), a10.style.fontSize = FT(50 * e17.k), a10.textContent = String(t10), a10;
}
var UT = 136;
var WT = { day: { x: 142, y: UT, w: BT, h: VT, label: `Wochentag` }, date: { x: 546, y: UT, w: VT, h: VT, label: `Datum` }, month: { x: 654, y: UT, w: BT, h: VT, label: `Monat` }, year: { x: 1058, y: UT, w: 200, h: VT, label: `Jahr` } };
function GT(e17, t10, n10, r10, i10, a10) {
  return t10 === `day` ? HT(e17, `Tag`, n10, r10, i10, a10) : t10 === `month` ? HT(e17, `Monat`, n10, r10, i10, a10) : t10 === `date` ? nce(e17, Number(n10), r10, i10, a10) : rce(e17, Number(n10), r10, i10, a10);
}
function KT(e17, t10, n10) {
  return e17.setAttribute(`data-cal`, t10), e17.setAttribute(`role`, `button`), e17.setAttribute(`aria-label`, n10), e17;
}
function ice(e17, t10) {
  if (e17 === `day`) return xT.map((e18, t11) => t11 < 5 ? [e18, 300, 436 + t11 * 100] : [e18, 720, 436 + (t11 - 5) * 100]);
  if (e17 === `month`) return Kse.flatMap((e18, t11) => e18.map((e19, n11) => [e19, t11 ? 720 : 300, 428 + n11 * 92]));
  if (e17 === `date`) return Array.from({ length: 31 }, (e18, t11) => [String(t11 + 1), 154 + t11 % 10 * 112, 446 + Math.floor(t11 / 10) * 112]);
  let n10 = t10.year - 2 - t10.year % 2;
  return Array.from({ length: 6 }, (e18, t11) => [String(n10 + t11), t11 < 3 ? 480 : 720, 470 + t11 % 3 * 110]);
}
function ace(e17, t10, n10) {
  let { k: r10, t: i10 } = e17, a10 = document.createElement(`div`);
  a10.className = `lh-cal`, a10.style.left = FT((e17.it.w - yT * r10) / 2), a10.style.top = FT((e17.it.h - bT * r10) / 2), a10.style.width = FT(yT * r10), a10.style.height = FT(bT * r10), a10.style.fontFamily = Ve(`andika`), IT(e17, `lh-cal-band lh-cal-b1`, 0, 0, yT, 292, a10), IT(e17, `lh-cal-band lh-cal-b2`, 0, 292, yT, 112, a10), IT(e17, `lh-cal-band lh-cal-b3`, 0, 404, yT, 586, a10);
  let o10 = IT(e17, `lh-cal-sheet`, 80, 40, 1240, 232, a10);
  o10.style.borderRadius = FT(28 * r10), t10.step === `done` && KT(o10, `sheet`, `Das heutige Datum vorlesen`);
  let s10 = Math.round(1240 * r10), c10 = Math.round(80 * r10), l10 = ``;
  for (let e18 = 0; e18 < 12; e18++) {
    let t11 = 70 + e18 * 100;
    l10 += `<circle cx="${t11}" cy="58" r="7" fill="#334155"/><path d="M${t11} 58C${t11 - 16} 58 ${t11 - 16} 14 ${t11} 14S${t11 + 13} 32 ${t11 + 5} 44" fill="none" stroke="#475569" stroke-width="7" stroke-linecap="round"/>`;
  }
  let u10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 80" width="${s10}" height="${c10}">${l10}</svg>`, d10 = document.createElement(`img`);
  d10.className = `lh-cal-rings`, d10.alt = ``, d10.draggable = false, d10.src = e17.opts.stickerUrl ? e17.opts.stickerUrl(u10) : LT(u10), d10.style.left = FT(80 * r10), d10.style.top = FT(6 * r10), d10.style.width = FT(s10), d10.style.height = FT(c10), a10.appendChild(d10);
  let f10 = TT.indexOf(t10.step);
  for (let n11 of [`day`, `date`, `month`, `year`]) {
    let o11 = WT[n11];
    if (TT.indexOf(n11) < f10 || t10.step === n11 && t10.solved) {
      GT(e17, n11, OT(n11, i10), o11.x, o11.y, a10).classList.add(`is-placed`);
      continue;
    }
    let s11 = IT(e17, `lh-cal-slot${t10.step === n11 ? ` is-current` : ``}`, o11.x, o11.y, o11.w, o11.h, a10);
    s11.style.borderWidth = FT(3 * r10), s11.style.borderRadius = FT(18 * r10), s11.style.fontSize = FT((n11 === `date` ? 19 : 28) * r10), s11.textContent = o11.label;
  }
  n10 && t10.step !== `start` && KT(IT(e17, `lh-cal-round lh-cal-restart`, 60, 876, 88, 88, a10), `restart`, `Von vorn`).appendChild(RT(e17, ece, 44, `#475569`));
  let p10 = t10.step === `done` ? t10.season ? jT(i10) : AT(i10).replace(/ der \S+ /, ` der ${i10.date}. `) : DT[t10.step], m10 = KT(IT(e17, `lh-cal-q`, 170, 300, 1060, 96, a10), `question`, `Frage noch einmal h\xF6ren`);
  if (m10.style.fontSize = FT((p10.length > 34 ? 44 : 54) * r10), m10.textContent = p10, KT(IT(e17, `lh-cal-round lh-cal-speak`, 80, 310, 76, 76, a10), `question`, `Frage noch einmal h\xF6ren`).appendChild(RT(e17, $se, 40)), t10.step === `start`) {
    KT(IT(e17, `lh-cal-round lh-cal-start`, 595, 520, 210, 210, a10), `start`, `Los geht\u2019s`).appendChild(RT(e17, tce, 96, `#fff`));
    let t11 = IT(e17, `lh-cal-golabel`, 400, 750, 600, 70, a10);
    t11.style.fontSize = FT(46 * r10), t11.textContent = `Los geht\u2019s!`, KT(t11, `start`, `Los geht\u2019s`);
  } else if (ET(t10.step) && !t10.solved) {
    let n11 = t10.step;
    for (let [t11, r11, o11] of ice(n11, i10)) {
      let i11 = GT(e17, n11, t11, r11, o11, a10);
      i11.classList.add(`lh-cal-pick`), KT(i11, `pick`, n11 === `date` ? `der ${CT[Number(t11) - 1]}` : t11).setAttribute(`data-v`, t11);
    }
  } else t10.step === `done` && t10.season && zT(e17, `Baum_${i10.season}`, 450, 420, 500, 470, a10, `lh-cal-pic lh-cal-tree`);
  if (t10.step !== `start`) {
    let t11 = KT(IT(e17, `lh-cal-round lh-cal-help`, 1228, 852, 112, 112, a10), `help`, `Hilfe`);
    t11.style.borderWidth = FT(4 * r10), t11.style.fontSize = FT(78 * r10), t11.textContent = `?`;
  }
  return a10;
}
var qT = /* @__PURE__ */ new WeakMap();
var JT = /* @__PURE__ */ new WeakMap();
function YT(e17, t10, n10, r10) {
  r10.assets && qT.set(e17, r10);
  let i10 = r10.assets ? r10 : qT.get(e17) ?? r10, a10 = n10 ? PT(t10.id) : NT(wT().key), o10 = `${n10}|${a10.v}|${a10.key}|${t10.w}x${t10.h}`;
  if (e17.dataset.k === o10) return;
  e17.dataset.k = o10, e17.setAttribute(`aria-label`, `Das sprechende Kalenderblatt: ${a10.step === `done` ? AT(wT()) : DT[a10.step]}`), n10 && (e17.dataset.calId = t10.id, JT.set(e17, t10));
  let s10 = Math.min(t10.w / yT, t10.h / bT);
  e17.replaceChildren(ace({ k: s10, it: t10, opts: i10, t: wT() }, a10, n10));
}
function XT(e17) {
  document.querySelectorAll(`.lh-wg-calendar[data-cal-id]`).forEach((t10) => {
    let n10 = JT.get(t10);
    t10.dataset.calId === e17 && n10 && (delete t10.dataset.k, YT(t10, n10, true, {}));
  });
}
async function ZT(e17, t10, n10) {
  return e17.run === t10 && (await lc(n10), e17.run === t10);
}
async function QT(e17, t10, n10) {
  let r10 = t10.run;
  if (t10.step = n10, t10.solved = false, t10.help = false, t10.busy = false, t10.season = false, t10.v++, XT(e17.id), n10 !== `done`) {
    await ZT(t10, r10, DT[n10]);
    return;
  }
  let i10 = wT();
  t10.busy = true, await ZT(t10, r10, AT(i10)) && (t10.season = true, t10.busy = false, t10.v++, XT(e17.id), await ZT(t10, r10, jT(i10)));
}
function oce(e17, t10, n10) {
  let r10 = e17.parentElement;
  if (!r10 || typeof e17.animate != `function`) return Promise.resolve();
  let i10 = e17.cloneNode(true);
  i10.removeAttribute(`data-cal`), i10.classList.remove(`lh-cal-pick`, `is-wrong`), i10.classList.add(`is-flying`), r10.appendChild(i10), e17.style.visibility = `hidden`;
  let a10 = t10.x * n10 - parseFloat(e17.style.left), o10 = t10.y * n10 - parseFloat(e17.style.top);
  return i10.animate([{ transform: `translate(0, 0) scale(1)` }, { transform: `translate(${a10 / 2}px, ${o10 / 2 - 40 * n10}px) scale(1.1)`, offset: 0.5 }, { transform: `translate(${a10}px, ${o10}px) scale(1)` }], { duration: 650, easing: `ease-in-out`, fill: `forwards` }), new Promise((e18) => setTimeout(e18, 670));
}
async function $T(e17, t10, n10, r10, i10) {
  if (!ET(t10.step)) return;
  let a10 = t10.step, o10 = t10.run;
  t10.busy = true, dc(), i10 && vi(), n10 && await oce(n10, WT[a10], r10), t10.run === o10 && (t10.solved = true, t10.v++, XT(e17.id), await ZT(t10, o10, kT(a10, wT())) && await QT(e17, t10, Zse[a10]));
}
function sce(e17, t10, n10) {
  let r10 = PT(e17.id), i10 = n10?.closest(`[data-cal]`) ?? null, a10 = i10?.dataset.cal ?? ``, o10 = wT(), s10 = t10 ? Math.min(e17.w / yT, e17.h / bT) : 1;
  if (a10 === `restart`) eE(e17);
  else if (r10.step === `start`) QT(e17, r10, `day`);
  else if (a10 === `question` || a10 === `sheet`) {
    let e18 = r10.run;
    r10.step === `done` ? ZT(r10, e18, AT(o10)).then((t11) => t11 && r10.season && ZT(r10, e18, jT(o10))) : ZT(r10, e18, DT[r10.step]);
  } else if (a10 === `help`) {
    if (r10.step === `done`) {
      ZT(r10, r10.run, AT(o10));
      return;
    }
    if (!ET(r10.step) || r10.busy || r10.solved) return;
    let n11 = r10.step;
    if (!r10.help) {
      r10.help = true, ZT(r10, r10.run, kT(n11, o10));
      return;
    }
    r10.help = false, $T(e17, r10, t10?.querySelector(`[data-cal="pick"][data-v="${OT(n11, o10)}"]`) ?? null, s10, false);
  } else if (a10 === `pick` && i10 && ET(r10.step) && !r10.busy && !r10.solved) {
    let t11 = r10.step, n11 = i10.dataset.v ?? ``;
    if (n11 === OT(t11, o10)) {
      $T(e17, r10, i10, s10, true);
      return;
    }
    i10.classList.remove(`is-wrong`), i10.offsetWidth, i10.classList.add(`is-wrong`), ZT(r10, r10.run, Qse(t11, n11));
  }
}
function eE(e17) {
  let t10 = PT(e17.id);
  dc(), MT.set(e17.id, NT(t10.key, t10.run + 1, t10.v + 1)), XT(e17.id);
}
function cce(e17) {
  let t10 = MT.get(e17.id), n10 = wT();
  return !t10 || t10.key !== n10.key || t10.step === `start` ? `Das sprechende Kalenderblatt. ${DT.start}` : t10.step === `done` ? `${AT(n10)} ${jT(n10)}` : DT[t10.step];
}
var lce = `
.lh-wg-calendar{overflow:hidden}
.lh-cal{position:absolute;overflow:hidden;color:#1f2937;-webkit-user-select:none;user-select:none;line-height:1.15}
.lh-cal div{position:absolute;box-sizing:border-box}
.lh-cal img{position:absolute;display:block;max-width:none}
.lh-cal .lh-cal-round img,.lh-cal .lh-cal-q img{position:static}
.lh-cal-b1{background:linear-gradient(180deg,#fff3c4,#ffe89a)}
.lh-cal-b2{background:#dcfce7}
.lh-cal-b3{background:linear-gradient(180deg,#e2feff,#d6f3ff)}
.lh-cal-sheet{background:#fff;box-shadow:0 10px 26px rgba(120,90,0,.16),0 0 0 1px rgba(15,23,42,.06)}
.lh-cal-slot{border-style:dashed;border-color:#cbd5e1;color:#94a3b8;background:#f8fafc;display:flex;align-items:center;justify-content:center;font-weight:700}
.lh-cal-slot.is-current{border-color:#2563eb;color:#2563eb;background:#eff6ff;animation:lh-cal-pulse 1.6s ease-in-out infinite}
.lh-cal-word{border-style:solid;border-color:#334155;display:flex;align-items:center;white-space:nowrap;overflow:hidden;color:#2563eb}
.lh-cal-tile{background:#f4f4f5;border-style:solid;border-color:#111827;display:flex;align-items:center;justify-content:flex-end;line-height:1}
.lh-cal-year{background:#f8fafc;border-style:solid;border-color:#111827;display:flex;align-items:center;justify-content:center;line-height:1}
.lh-cal-card .lh-cal-pic{position:absolute}
.lh-cal-pick{cursor:pointer;border-radius:18px;transition:transform .12s}
.lh-cal-pick:active{transform:scale(.96)}
.lh-cal-pick.is-wrong{animation:lh-cal-shake .45s}
.lh-cal-placed,.lh-cal .is-placed{filter:drop-shadow(0 3px 5px rgba(15,23,42,.18))}
.lh-cal .is-flying{z-index:5;filter:drop-shadow(0 12px 18px rgba(15,23,42,.3))}
.lh-cal-q{display:flex;align-items:center;justify-content:center;text-align:center;font-weight:700;cursor:pointer}
.lh-cal-round{border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(15,23,42,.18)}
.lh-cal-speak{background:#fff}
.lh-cal-restart{background:#fff}
.lh-cal-help{background:#ffe066;border-style:solid;border-color:#1f2937;font-weight:700;line-height:1;color:#1f2937}
.lh-cal-start{background:linear-gradient(160deg,#4ade80,#16a34a);box-shadow:0 10px 28px rgba(22,163,74,.35);animation:lh-cal-breathe 2.4s ease-in-out infinite}
.lh-cal-golabel{display:flex;align-items:center;justify-content:center;font-weight:700;color:#15803d;cursor:pointer}
.lh-cal-tree{animation:lh-cal-pop .7s cubic-bezier(.3,1.45,.5,1) both}
@keyframes lh-cal-shake{20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
@keyframes lh-cal-pulse{50%{box-shadow:0 0 0 6px rgba(37,99,235,.16)}}
@keyframes lh-cal-breathe{50%{transform:scale(1.05)}}
@keyframes lh-cal-pop{from{transform:scale(.4);opacity:0}}
`;
var tE = (e17) => `${Math.round(e17 * 100) / 100}px`;
var uce = (e17, t10, n10, r10) => {
  let i10 = Math.min(e17 / n10, t10 / r10);
  return { x: (e17 - n10 * i10) / 2, y: (t10 - r10 * i10) / 2, w: n10 * i10, h: r10 * i10 };
};
var dce = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var nE = (e17, t10, n10, r10) => {
  let i10 = Math.max(8, Math.round(t10)), a10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${i10}" height="${i10}" fill="none" stroke="${n10}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${e17.replace(/currentColor/g, n10)}</svg>`, o10 = document.createElement(`img`);
  return o10.alt = ``, o10.draggable = false, o10.src = r10.stickerUrl ? r10.stickerUrl(a10) : dce(a10), o10.style.width = o10.style.height = tE(i10), o10;
};
var fce = `<path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>`;
var pce = `<path d="M21 5H9l-6 7 6 7h12z"/><path d="m17 9-6 6M11 9l6 6"/>`;
var mce = `<path d="M18 6 6 18M6 6l12 12"/>`;
var hce = `<path d="M12 5v14M5 12h14"/>`;
var gce = `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`;
var _ce = `<path d="M5 12h14M13 6l6 6-6 6"/>`;
var vce = `<path d="M19 12H5M11 6l-6 6 6 6"/>`;
function yce(e17, t10, n10) {
  t10.classList.add(`lh-talk`);
  let r10 = Math.min(e17.w, e17.h), i10 = document.createElement(n10.interactive ? `button` : `div`);
  i10.className = `lh-talk-card`, i10 instanceof HTMLButtonElement && (i10.type = `button`, i10.setAttribute(`aria-label`, e17.say || e17.label || `Leere Taste`)), i10.style.background = e17.color || `#ffffff`, i10.style.borderWidth = tE(Math.max(2, r10 * 0.022)), i10.style.borderRadius = tE(r10 * 0.12), t10.appendChild(i10);
  let a10 = e17.asset ? n10.assets[e17.asset] : void 0, o10 = e17.noLabel ? `` : e17.label;
  if (!a10 && !e17.label) {
    if (t10.classList.add(`is-placeholder`), n10.placeholders) {
      let e18 = document.createElement(`div`);
      e18.className = `lh-talk-ph`, e18.style.fontSize = tE(Math.max(12, Math.min(28, r10 * 0.12))), e18.appendChild(nE(hce, r10 * 0.28, `#64748b`, n10));
      let t11 = document.createElement(`span`);
      t11.textContent = `Bild und Wort`, e18.appendChild(t11), i10.appendChild(e18);
    }
    return;
  }
  let s10 = r10 * 0.07, c10 = o10 ? a10 ? Math.max(18, e17.h * 0.24) : e17.h - 2 * s10 : 0;
  if (a10) {
    let t11 = { w: e17.w - 2 * s10, h: e17.h - 2 * s10 - (o10 ? c10 : 0) }, r11 = uce(t11.w, t11.h, a10.width || t11.w, a10.height || t11.h), l10 = document.createElement(`img`);
    l10.className = `lh-talk-pic`, l10.alt = ``, l10.draggable = false, l10.src = n10.assetUrl ? n10.assetUrl(a10) : a10.dataUrl, l10.style.left = tE(s10 + r11.x), l10.style.top = tE(s10 + r11.y), l10.style.width = tE(r11.w), l10.style.height = tE(r11.h), i10.appendChild(l10);
  }
  if (o10) {
    let t11 = document.createElement(`div`);
    t11.className = `lh-talk-label`, t11.style.fontFamily = Ve(`andika`), t11.style.top = tE(a10 ? e17.h - s10 * 0.6 - c10 : s10), t11.style.height = tE(c10);
    let n11 = Math.min(c10 * (a10 ? 0.62 : 0.34), e17.w * 0.15), r11 = e17.w * 0.9, l10 = Math.min(n11, r11 / Math.max(3, o10.length * 0.56)), u10 = [...o10.matchAll(/ (?![…?!.])/g)].map((e18) => e18.index).sort((e18, t12) => Math.abs(e18 - o10.length / 2) - Math.abs(t12 - o10.length / 2))[0], d10 = u10 === void 0 ? null : [o10.slice(0, u10), o10.slice(u10 + 1)], f10 = d10 ? Math.min(n11, r11 / Math.max(3, Math.max(...d10.map((e18) => e18.length)) * 0.56), c10 * 0.92 / 2.1) : 0, p10 = !!d10 && f10 > l10 * 1.12;
    t11.style.fontSize = tE(Math.max(10, p10 ? f10 : l10)), p10 && d10 ? (t11.classList.add(`is-wrap`), t11.append(d10[0], document.createElement(`br`), d10[1])) : t11.textContent = o10, i10.appendChild(t11);
  }
  if (e17.sound) {
    let e18 = document.createElement(`span`);
    e18.className = `lh-talk-snd`;
    let t11 = Math.max(16, r10 * 0.14);
    e18.style.width = e18.style.height = tE(t11), e18.style.right = e18.style.top = tE(r10 * 0.04), e18.appendChild(nE(gce, t11 * 0.6, `#fff`, n10)), i10.appendChild(e18);
  }
  if (e17.back || e17.link) {
    t10.classList.add(`is-folder`);
    let a11 = document.createElement(`span`);
    a11.className = `lh-talk-go`;
    let o11 = Math.max(18, r10 * 0.17);
    a11.style.width = a11.style.height = tE(o11), a11.style.left = a11.style.top = tE(r10 * 0.04), a11.appendChild(nE(e17.back ? vce : _ce, o11 * 0.62, `#fff`, n10)), i10.appendChild(a11);
  }
}
var rE = [];
var iE = 0;
var bce = (e17) => new Promise((t10) => window.setTimeout(t10, e17));
function xce(e17, t10) {
  if (e17.back) {
    let n10 = rE.pop() ?? e17.link?.page;
    n10 ? t10.go(n10) : t10.previous();
  } else e17.link?.page ? (rE.push(t10.current()), rE.length > 50 && rE.shift(), t10.go(e17.link.page)) : e17.link?.url && window.open(e17.link.url, `_blank`, `noopener`);
}
var aE = null;
var oE = null;
function Sce(e17, t10, n10, r10) {
  let i10 = e17.sound ? n10[e17.sound] : void 0, a10 = i10 && typeof Audio < `u` ? Fr(`talk`, () => oE?.stop()) : null;
  dc(), oE?.stop(), oE = null, t10 && (t10.classList.remove(`is-pressed`), t10.offsetWidth, t10.classList.add(`is-pressed`), window.setTimeout(() => t10.classList.remove(`is-pressed`), 260));
  let o10 = Promise.resolve();
  if (i10 && a10) aE ??= new Audio(), o10 = new Promise((e18) => {
    let t11 = oE = Xr(aE, i10.dataUrl, { onEnd: () => {
      oE === t11 && (oE = null), a10.release(), e18();
    } });
  });
  else {
    let t11 = (e17.say || e17.label).trim();
    t11 && (o10 = lc(t11));
  }
  if (e17.back || e17.link) {
    if (!r10) return;
    let t11 = ++iE;
    Promise.race([o10, bce(2500)]).then(() => t11 === iE && xce(e17, r10));
    return;
  }
  let s10 = (e17.label || e17.say || ``).trim();
  if (!t10 || !s10) return;
  let c10 = t10.querySelector(`img.lh-talk-pic`)?.src;
  t10.parentElement?.querySelector(`.lh-wg-strip[data-strip-id]`) && Cce({ word: s10, pic: c10 });
}
var sE = { entries: [], v: 0 };
var cE = (e17) => sE;
var lE = /* @__PURE__ */ new WeakMap();
var uE = /* @__PURE__ */ new WeakMap();
function Cce(e17) {
  sE.entries = [...sE.entries, e17].slice(-30), sE.v++, dE();
}
function dE(e17) {
  document.querySelectorAll(`.lh-wg-strip[data-strip-id]`).forEach((e18) => {
    let t10 = lE.get(e18);
    t10 && (delete e18.dataset.k, pE(e18, t10, true, {}));
  });
}
function fE(e17, t10, n10, r10, i10, a10, o10, s10, c10, l10) {
  let u10 = document.createElement(`div`);
  return u10.className = `lh-strip-btn ${e17}`, u10.setAttribute(`data-strip`, t10), u10.setAttribute(`role`, `button`), u10.setAttribute(`aria-label`, n10), u10.style.left = tE(r10), u10.style.top = tE((a10 - i10) / 2), u10.style.width = u10.style.height = tE(i10), u10.style.background = c10, u10.appendChild(nE(o10, i10 * 0.5, s10, l10)), u10;
}
function pE(e17, t10, n10, r10) {
  r10.stickerUrl && uE.set(e17, r10);
  let i10 = r10.stickerUrl ? r10 : uE.get(e17) ?? r10, a10 = n10 ? cE(t10.id) : { entries: [], v: 0 }, o10 = `${n10}|${a10.v}|${t10.w}x${t10.h}`;
  if (e17.dataset.k === o10) return;
  e17.dataset.k = o10, n10 && (e17.dataset.stripId = t10.id, lE.set(e17, t10));
  let s10 = t10.h, c10 = document.createElement(`div`);
  c10.className = `lh-strip`, c10.style.borderRadius = tE(Math.min(28, s10 * 0.2)), c10.style.borderWidth = tE(Math.max(2, s10 * 0.025));
  let l10 = s10 * 0.62, u10 = s10 * 0.12, d10 = 3 * l10 + 4 * u10, f10 = document.createElement(`div`);
  f10.className = `lh-strip-words`, f10.setAttribute(`data-strip`, `speak`), f10.style.left = tE(u10), f10.style.top = tE(s10 * 0.08), f10.style.width = tE(Math.max(10, t10.w - d10 - u10)), f10.style.height = tE(s10 * 0.84), c10.appendChild(f10);
  let p10 = s10 * 0.84, m10 = Math.max(1, Math.floor((t10.w - d10 - u10) / (p10 + u10 * 0.5))), h10 = a10.entries.slice(-m10);
  if (!h10.length) {
    let e18 = document.createElement(`span`);
    e18.className = `lh-strip-hint`, e18.style.fontSize = tE(Math.max(12, s10 * 0.2)), e18.style.fontFamily = Ve(`andika`), e18.textContent = `Tippe auf die Bilder \u2013 hier entsteht dein Satz.`, f10.appendChild(e18);
  }
  h10.forEach((e18, t11) => {
    let n11 = document.createElement(`div`);
    if (n11.className = `lh-strip-word`, n11.style.left = tE(t11 * (p10 + u10 * 0.5)), n11.style.width = tE(p10), n11.style.height = tE(s10 * 0.84), e18.pic) {
      let t12 = document.createElement(`img`);
      t12.alt = ``, t12.draggable = false, t12.src = e18.pic, t12.style.left = tE(p10 * 0.12), t12.style.top = tE(s10 * 0.03), t12.style.width = tE(p10 * 0.76), t12.style.height = tE(s10 * 0.84 * 0.62), n11.appendChild(t12);
    }
    let r11 = document.createElement(`span`);
    r11.className = `lh-strip-label`, r11.style.fontFamily = Ve(`andika`), r11.style.fontSize = tE(Math.max(9, Math.min(s10 * 0.16, p10 * 0.95 / Math.max(3, e18.word.length * 0.55)))), r11.style.top = tE(e18.pic ? s10 * 0.84 * 0.66 : 0), r11.style.height = tE(e18.pic ? s10 * 0.84 * 0.32 : s10 * 0.84), r11.textContent = e18.word, n11.appendChild(r11), f10.appendChild(n11);
  });
  let g10 = t10.w - d10 + u10;
  c10.appendChild(fE(`is-speak`, `speak`, `Satz vorlesen`, g10, l10, s10, fce, `#fff`, `#16a34a`, i10)), g10 += l10 + u10, c10.appendChild(fE(`is-back`, `back`, `Letztes Wort l\xF6schen`, g10, l10, s10, pce, `#1f2937`, `#f1f5f9`, i10)), g10 += l10 + u10, c10.appendChild(fE(`is-clear`, `clear`, `Satz l\xF6schen`, g10, l10, s10, mce, `#b91c1c`, `#fee2e2`, i10)), e17.replaceChildren(c10), e17.setAttribute(`aria-label`, a10.entries.length ? `Satzleiste: ${a10.entries.map((e18) => e18.word).join(` `)}` : `Satzleiste, leer`);
}
function wce(e17) {
  let t10 = cE(e17);
  t10.entries = [], t10.v++, dE(e17);
}
var mE = (e17) => cE(e17).entries.map((e18) => e18.word).join(` `);
function Tce(e17, t10, n10) {
  let r10 = n10?.closest(`[data-strip]`)?.dataset.strip ?? `speak`, i10 = cE(e17.id);
  if (r10 === `back` || r10 === `clear`) {
    dc(), i10.entries = r10 === `back` ? i10.entries.slice(0, -1) : [], i10.v++, dE(e17.id);
    return;
  }
  let a10 = mE(e17.id);
  a10 && lc(a10, void 0, { onVoice: () => t10?.classList.add(`is-reading`) }).then(() => t10?.classList.remove(`is-reading`));
}
var Ece = `
.lh-talk{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}
.lh-page:not(.lh-edit) .lh-talk{touch-action:pinch-zoom}
.lh-talk-card{position:absolute;left:0;top:0;width:100%;height:100%;display:block;border-style:solid;border-color:#334155;overflow:hidden;padding:0;margin:0;font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:0 3px 8px rgba(15,23,42,.12);transition:transform .08s,box-shadow .08s}
.lh-talk.is-pressed .lh-talk-card{transform:scale(.94);box-shadow:0 0 0 6px rgba(250,204,21,.75)}
.lh-talk-pic{position:absolute;display:block;max-width:none;pointer-events:none;-webkit-user-select:none;user-select:none}
.lh-talk-label{position:absolute;left:4%;right:4%;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:700;line-height:1.05;color:#1f2937;overflow:hidden;white-space:nowrap;pointer-events:none}
.lh-talk-label.is-wrap{flex-direction:column}
.lh-talk.is-placeholder .lh-talk-card{border-style:dashed;border-color:#94a3b8;box-shadow:none}
.lh-talk-ph{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.3em;color:#64748b;font-family:"Nunito",system-ui,sans-serif;font-weight:700;pointer-events:none}
.lh-talk-ph img{display:block}
.lh-talk-snd{position:absolute;border-radius:50%;background:#7c3aed;display:flex;align-items:center;justify-content:center;pointer-events:none}
.lh-talk-go{position:absolute;border-radius:50%;background:#1f2937;display:flex;align-items:center;justify-content:center;pointer-events:none}
.lh-talk-go img{display:block}
.lh-talk.is-folder .lh-talk-card{box-shadow:4px 4px 0 rgba(51,65,85,.35),0 3px 8px rgba(15,23,42,.12)}
.lh-talk-snd img{display:block}
.lh-strip{position:absolute;left:0;top:0;width:100%;height:100%;background:#fff;border-style:solid;border-color:#334155;box-shadow:0 4px 12px rgba(15,23,42,.12);overflow:hidden}
.lh-strip > div{position:absolute}
.lh-strip-words{overflow:hidden;cursor:pointer}
.lh-strip-word{position:absolute;top:0}
.lh-strip-word img{position:absolute;display:block;object-fit:contain}
.lh-strip-label{position:absolute;left:0;width:100%;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:700;color:#1f2937;white-space:nowrap;overflow:hidden}
.lh-strip-hint{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;color:#94a3b8;font-weight:700;white-space:nowrap}
.lh-strip-btn{border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 6px rgba(15,23,42,.18)}
.lh-strip-btn img{display:block}
`;
var ble = (e17) => `Sequenzer mit ${(e17.seq?.tracks ?? []).map((t10) => $c(t10, e17.seq?.key) || (t10.drum ? Fo[t10.drum] : ``)).join(`, `)}.`;
var WD = (e17) => e17 ? e17.label?.trim() || e17.url.replace(/^https?:\/\//i, ``).replace(/\/$/, ``) : ``;
var qD = [`2/4`, `3/4`, `4/4`, `5/4`, `6/8`];
function XD(e17) {
  return e17 < 60 ? `Largo` : e17 < 66 ? `Larghetto` : e17 < 76 ? `Adagio` : e17 < 108 ? `Andante` : e17 < 120 ? `Moderato` : e17 < 168 ? `Allegro` : e17 <= 200 ? `Presto` : `Prestissimo`;
}
var ZD = (e17) => Number(e17.split(`/`)[0]);
var $D = (e17) => qD.includes(e17.meter) ? e17.meter : `4/4`;
var fO = `#1f2937`;
var jle = `#2563eb`;
var pO = `#e03131`;
var mO = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
var hO = (e17) => (Math.round(e17 * 10) / 10).toString();
var gO = (e17) => `${Math.round(e17 * 100) / 100}px`;
var _O = (e17, t10, n10, r10) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${e17}" width="${t10}" height="${n10}">${r10}</svg>`;
var vO = `Andika, Andika, Verdana, Arial, sans-serif`;
var Mle = [`Sonntag`, `Montag`, `Dienstag`, `Mittwoch`, `Donnerstag`, `Freitag`, `Samstag`];
var Nle = [`Januar`, `Februar`, `M\xE4rz`, `April`, `Mai`, `Juni`, `Juli`, `August`, `September`, `Oktober`, `November`, `Dezember`];
function yO(e17) {
  return `${Mle[e17.getDay()]}, der ${e17.getDate()}. ${Nle[e17.getMonth()]} ${e17.getFullYear()}`;
}
var bO = (e17) => e17 === 1 ? `eine Minute` : `${e17} Minuten`;
function xO(e17) {
  let t10 = /* @__PURE__ */ new Date();
  switch (e17.kind) {
    case `clock`: {
      let n10 = t10.getHours(), r10 = t10.getMinutes();
      return e17.face === `digital` ? `Es ist ${n10} Uhr${r10 ? ` ${r10}` : ``}.` : `Es ist ${_T(n10 % 12 || 12, r10)} ${vT(n10)}.`;
    }
    case `date`: {
      let n10 = `Heute ist ${yO(t10)}.`, r10 = e17.place ? PO(e17.place, false) : null;
      return r10 && e17.place && (n10 += ` Das Wetter in ${e17.place.name}: ${BO(r10).word}.`), n10;
    }
    case `timer`: {
      let t11 = CO(e17, true);
      return t11.state === `done` ? `Die Zeit ist um.` : t11.state === `run` ? t11.left >= 60 ? `Noch ${bO(Math.ceil(t11.left / 60))}.` : `Noch ${t11.left} Sekunden.` : e17.timer === `fixed` ? `Timer: ${bO(e17.minutes ?? 10)}.` : `Timer. Tippe ihn an, dann l\xE4uft er 5 Minuten. Jedes Antippen gibt 5 Minuten dazu.`;
    }
    case `calendar`:
      return cce(e17);
    case `strip`: {
      let t11 = mE(e17.id);
      return t11 ? `Satzleiste: ${t11}` : ``;
    }
    case `piano`:
      return e17.inst ? `${Po(e17.inst)}.` : `Klavier.`;
    case `drums`:
      return `${Bo(e17.kit?.skin ?? `drumset`)}.`;
    case `recorder`:
      return `Kassettenrekorder.`;
    case `sequencer`:
      return ble(e17);
    case `qr`:
      return e17.qr?.url ? `QR-Code f\xFCr ${WD(e17.qr)}` : `QR-Code, noch ohne Link`;
    case `slideshow`:
      return nte(e17);
    case `anim`:
      return Vf(e17);
    case `tuner`:
      return up(e17);
    case `monster`:
      return am(e17);
    case `applause`:
      return Rm(e17);
    case `multitimer`:
      return La(Ki(e17.multi));
    case `pitch`:
      return hh(e17);
    case `timetable`:
      return Nh(e17);
    case `anlaut`:
      return Xg(e17);
    case `karaoke`:
      return Gie(e17);
    case `mathtool`:
      return RC(e17);
    case `synth`:
      return My(e17);
    case `clap`:
      return bb(e17);
    case `receipt`:
      return Zb(e17);
    case `geometry`:
      return Jx(e17);
    case `shop`:
      return fC(e17);
    case `map`:
      return jw(e17);
    case `hoerspiel`:
      return `H\xF6rspiel-Studio mit ${(e17.hs?.clips ?? []).length === 1 ? `einem Teil` : `${(e17.hs?.clips ?? []).length} Teilen`}. Tippe auf Abspielen.`;
    case `fall`:
      return `Notenregen: ${lu(e17.fall ?? cu).title}. Tippe auf Start und spiele die T\xF6ne, wenn sie unten ankommen.`;
    case `notequiz`:
      return `Noten-Trainer: Tippe auf Start und finde heraus, welche Note es ist.`;
    case `echo`:
      return `H\xF6r zu \u2013 spiel nach: Tippe auf Start, h\xF6r zu und spiel die T\xF6ne nach.`;
    case `metronome`:
      return `Metronom: ${e17.bpm ?? 90} Schl\xE4ge pro Minute, ${XD(e17.bpm ?? 90)}, ${ZD($D(e17))} Schl\xE4ge im Takt.`;
  }
}
function Ple(e17, t10, n10) {
  let r10 = `<circle cx="100" cy="100" r="94" fill="#fff" stroke="${fO}" stroke-width="6"/>`;
  for (let e18 = 0; e18 < 60; e18++) {
    let t11 = e18 * Math.PI / 30, n11 = e18 % 5 == 0, i11 = n11 ? 79 : 84;
    r10 += `<line x1="${hO(100 + i11 * Math.sin(t11))}" y1="${hO(100 - i11 * Math.cos(t11))}" x2="${hO(100 + 89 * Math.sin(t11))}" y2="${hO(100 - 89 * Math.cos(t11))}" stroke="${fO}" stroke-width="${n11 ? 3.4 : 1.4}" stroke-linecap="round"/>`;
  }
  for (let e18 = 1; e18 <= 12; e18++) {
    let t11 = e18 * Math.PI / 6;
    r10 += `<text x="${hO(100 + 64 * Math.sin(t11))}" y="${hO(100 - 64 * Math.cos(t11) + 8)}" text-anchor="middle" font-family="${vO}" font-weight="700" font-size="23" fill="${fO}">${e18}</text>`;
  }
  let i10 = e17.getSeconds(), a10 = e17.getMinutes() + i10 / 60, o10 = e17.getHours() % 12 + a10 / 60, s10 = (e18, t11, n11, r11, i11) => {
    let a11 = e18 * Math.PI / 180;
    return `<line x1="${hO(100 - n11 * Math.sin(a11))}" y1="${hO(100 + n11 * Math.cos(a11))}" x2="${hO(100 + t11 * Math.sin(a11))}" y2="${hO(100 - t11 * Math.cos(a11))}" stroke="${i11}" stroke-width="${r11}" stroke-linecap="round"/>`;
  };
  return r10 += s10(o10 * 30, 46, 8, 10, fO) + s10(a10 * 6, 72, 10, 6.5, jle) + s10(i10 * 6, 80, 16, 2.4, pO), r10 += `<circle cx="100" cy="100" r="7" fill="${fO}"/><circle cx="100" cy="100" r="3" fill="${pO}"/>`, _O(`0 0 200 200`, t10, n10, r10);
}
function Fle(e17, t10, n10) {
  let r10 = document.createElement(`div`);
  r10.className = `lh-wg-digits`, r10.style.fontFamily = Ve(`andika`), r10.style.fontSize = gO(Math.min(e17.h * 0.68, e17.w / 2.9)), r10.style.borderRadius = gO(Math.min(e17.h, e17.w) * 0.2);
  let i10 = document.createElement(`span`);
  i10.textContent = String(t10.getHours());
  let a10 = document.createElement(`span`);
  a10.className = `lh-wg-colon${n10 && t10.getSeconds() % 2 ? ` is-off` : ``}`, a10.textContent = `:`;
  let o10 = document.createElement(`span`);
  return o10.textContent = String(t10.getMinutes()).padStart(2, `0`), r10.append(i10, a10, o10), r10;
}
var SO = /* @__PURE__ */ new Map();
function CO(e17, t10) {
  if (!t10) return e17.timer === `fixed` ? { state: `set`, left: (e17.minutes ?? 10) * 60 } : { state: `idle`, left: 0 };
  let n10 = SO.get(e17.id);
  if (!n10) return { state: `idle`, left: 0 };
  let r10 = Math.max(0, Math.ceil((n10.end - Date.now()) / 1e3));
  return r10 && !n10.done ? { state: `run`, left: r10 } : { state: `done`, left: 0 };
}
function Ile(e17, t10, n10) {
  switch (t10.state) {
    case `done`:
      return `Fertig!`;
    case `run`:
      return t10.left >= 60 ? `noch ${Math.ceil(t10.left / 60)} Min.` : `noch ${t10.left} Sek.`;
    case `set`:
      return `${e17.minutes ?? 10} Min.`;
    default:
      return n10 && e17.timer !== `fixed` ? `Antippen: 5 Min.` : `Timer`;
  }
}
function Lle(e17, t10, n10, r10) {
  let i10 = `<rect x="3" y="3" width="194" height="226" rx="28" fill="#fff" stroke="${fO}" stroke-width="5"/>`, a10 = Math.min(360, e17 / 3600 * 360);
  if (a10 >= 359.9) i10 += `<circle cx="100" cy="100" r="62" fill="${pO}"/>`;
  else if (a10 > 0.05) {
    let e18 = a10 * Math.PI / 180;
    i10 += `<path d="M100 100V38A62 62 0 ${+(a10 > 180)} 0 ${hO(100 - 62 * Math.sin(e18))} ${hO(100 - 62 * Math.cos(e18))}Z" fill="${pO}"/>`;
  }
  for (let e18 = 0; e18 < 60; e18++) {
    let t11 = -e18 * Math.PI / 30, n11 = e18 % 5 == 0, r11 = n11 ? 63 : 66;
    i10 += `<line x1="${hO(100 + r11 * Math.sin(t11))}" y1="${hO(100 - r11 * Math.cos(t11))}" x2="${hO(100 + 71 * Math.sin(t11))}" y2="${hO(100 - 71 * Math.cos(t11))}" stroke="${fO}" stroke-width="${n11 ? 2.6 : 1.1}" stroke-linecap="round"/>`;
  }
  for (let e18 = 0; e18 < 60; e18 += 5) {
    let t11 = -e18 * Math.PI / 30;
    i10 += `<text x="${hO(100 + 83 * Math.sin(t11))}" y="${hO(100 - 83 * Math.cos(t11) + 5.5)}" text-anchor="middle" font-family="${vO}" font-weight="700" font-size="15.5" fill="${fO}">${e18}</text>`;
  }
  return i10 += `<circle cx="100" cy="100" r="10" fill="#fff" stroke="${fO}" stroke-width="3.5"/>`, i10 += `<text x="100" y="${t10.length > 14 ? 214 : 215}" text-anchor="middle" font-family="${vO}" font-weight="700" font-size="${t10.length > 14 ? 17 : 20}" fill="${fO}">${t10}</text>`, _O(`0 0 200 232`, n10, r10, i10);
}
function wO(e17, t10 = e17.minutes ?? 10) {
  SO.set(e17.id, { end: Date.now() + t10 * 6e4, done: false });
}
var DO = 18e5;
var OO = 108e5;
var zle = 3e5;
var kO = `lernheft-weather`;
var AO = /* @__PURE__ */ new Map();
var jO = /* @__PURE__ */ new Map();
var MO = (e17) => `${e17.lat.toFixed(2)},${e17.lon.toFixed(2)}`;
function Ble(e17) {
  try {
    let t10 = JSON.parse(localStorage.getItem(kO) ?? `{}`)[e17];
    return t10 && typeof t10.code == `number` && typeof t10.at == `number` ? t10 : void 0;
  } catch {
    return;
  }
}
function Vle(e17, t10) {
  try {
    let n10 = JSON.parse(localStorage.getItem(kO) ?? `{}`);
    n10[e17] = t10;
    for (let [e18, t11] of Object.entries(n10)) Date.now() - t11.at > OO && delete n10[e18];
    localStorage.setItem(kO, JSON.stringify(n10));
  } catch {
  }
}
async function NO(e17, t10) {
  if (Date.now() - (jO.get(t10) ?? 0) < zle || (jO.set(t10, Date.now()), typeof navigator < `u` && navigator.onLine === false)) return;
  let n10 = new AbortController(), r10 = setTimeout(() => n10.abort(), 1e4);
  try {
    let r11 = `/api/wetter?art=wetter&latitude=${e17.lat.toFixed(2)}&longitude=${e17.lon.toFixed(2)}&current=weather_code,is_day&timezone=auto`, i10 = await fetch(r11, { signal: n10.signal, credentials: `same-origin`, referrerPolicy: `no-referrer` });
    if (!i10.ok) return;
    let a10 = await i10.json(), o10 = a10.current?.weather_code;
    if (typeof o10 != `number`) return;
    let s10 = { code: o10, day: a10.current?.is_day !== 0, at: Date.now() };
    AO.set(t10, s10), Vle(t10, s10);
  } catch {
  } finally {
    clearTimeout(r10);
  }
}
function PO(e17, t10) {
  let n10 = MO(e17), r10 = AO.get(n10);
  return r10 || (r10 = Ble(n10), r10 && AO.set(n10, r10)), t10 && (!r10 || Date.now() - r10.at > DO) && NO(e17, n10), r10 && Date.now() - r10.at < OO ? r10 : null;
}
async function Hle(e17) {
  let t10 = MO(e17), n10 = PO(e17, false);
  return (!n10 || Date.now() - n10.at > DO) && (jO.delete(t10), await NO(e17, t10)), !!PO(e17, false);
}
async function Ule(e17) {
  let t10 = `/api/wetter?art=ort&name=${encodeURIComponent(e17.trim())}&count=8&language=de&format=json`, n10 = await fetch(t10, { credentials: `same-origin`, referrerPolicy: `no-referrer` });
  if (!n10.ok) throw Error(String(n10.status));
  return ((await n10.json()).results ?? []).filter((e18) => typeof e18.name == `string` && typeof e18.latitude == `number` && typeof e18.longitude == `number`).map((e18) => ({ name: e18.name, lat: Math.round(e18.latitude * 100) / 100, lon: Math.round(e18.longitude * 100) / 100, detail: [e18.admin1, e18.country].filter(Boolean).join(`, `) }));
}
var Wle = (e17, t10, n10, r10) => `<g stroke="#f59f00" stroke-width="6" stroke-linecap="round">${Array.from({ length: 8 }, (i10, a10) => {
  let o10 = a10 * Math.PI / 4;
  return `<path d="M${hO(e17 + n10 * Math.cos(o10))} ${hO(t10 + n10 * Math.sin(o10))}L${hO(e17 + r10 * Math.cos(o10))} ${hO(t10 + r10 * Math.sin(o10))}"/>`;
}).join(``)}</g>`;
var FO = (e17, t10, n10) => Wle(e17, t10, n10 + 6, n10 + 18) + `<circle cx="${e17}" cy="${t10}" r="${n10}" fill="#ffd43b" stroke="#f59f00" stroke-width="4"/>`;
var IO = (e17, t10, n10) => `<path transform="translate(${e17} ${t10}) scale(${n10})" d="M62 14a34 34 0 1 0 24 56 28 28 0 1 1-24-56z" fill="#ffe066" stroke="#f59f00" stroke-width="${hO(3 / n10)}"/>`;
var LO = (e17, t10, n10, r10 = `#ffffff`, i10 = `#868e96`) => `<path transform="translate(${e17} ${t10}) scale(${n10})" d="M18 52a16 16 0 0 1-2-32 22 22 0 0 1 41-6 15 15 0 0 1 22 12 13 13 0 0 1-2 26z" fill="${r10}" stroke="${i10}" stroke-width="${(4 / n10).toFixed(2)}" stroke-linejoin="round"/>`;
var RO = (e17, t10, n10 = `#339af0`) => `<g stroke="${n10}" stroke-width="5" stroke-linecap="round">${e17.map((e18) => `<path d="M${e18} ${t10}l-5 12"/>`).join(``)}</g>`;
var zO = (e17) => `<g stroke="#4dabf7" stroke-width="3" stroke-linecap="round">${e17.map(([e18, t10]) => `<path d="M${e18 - 6} ${t10}h12M${e18} ${t10 - 6}v12M${e18 - 4} ${t10 - 4}l8 8M${e18 + 4} ${t10 - 4}l-8 8"/>`).join(``)}</g>`;
var Gle = `<path d="M52 58l-12 20h12l-8 18 22-26H54l8-12z" fill="#ffd43b" stroke="#e67700" stroke-width="3" stroke-linejoin="round"/>`;
var Kle = LO(14, 2, 0.8, `#e9ecef`) + `<g stroke="#adb5bd" stroke-width="6" stroke-linecap="round"><path d="M14 64h72M22 78h60M10 92h56"/></g>`;
function BO(e17) {
  let t10 = e17.code, n10 = (t11) => (e17.day ? FO(36, 38, 18) : IO(4, 0, 0.62)) + t11;
  return t10 === 0 ? { word: e17.day ? `sonnig` : `klar`, icon: e17.day ? FO(50, 50, 22) : IO(12, 6, 0.95) } : t10 === 1 ? { word: `heiter`, icon: n10(LO(30, 46, 0.62)) } : t10 === 2 ? { word: `wolkig`, icon: n10(LO(16, 38, 0.82)) } : t10 === 3 ? { word: `bew\xF6lkt`, icon: LO(0, 10, 0.7, `#dee2e6`) + LO(14, 32, 0.84) } : t10 === 45 || t10 === 48 ? { word: `neblig`, icon: Kle } : t10 >= 51 && t10 <= 55 ? { word: `Nieselregen`, icon: LO(8, 4, 1, `#e9ecef`) + RO([38, 62], 68) } : t10 === 56 || t10 === 57 || t10 === 66 || t10 === 67 ? { word: `Eisregen`, icon: LO(8, 4, 1, `#e9ecef`) + RO([28, 60], 66) + zO([[45, 76], [76, 80]]) } : t10 >= 61 && t10 <= 65 ? { word: `Regen`, icon: LO(8, 4, 1, `#dee2e6`) + RO([30, 48, 66], 66) } : t10 >= 71 && t10 <= 77 || t10 === 85 || t10 === 86 ? { word: `Schnee`, icon: LO(8, 4, 1, `#f1f3f5`) + zO([[30, 72], [52, 84], [72, 70]]) } : t10 >= 80 && t10 <= 82 ? { word: `Regenschauer`, icon: (e17.day ? FO(70, 26, 14) : ``) + LO(4, 10, 0.9, `#dee2e6`) + RO([26, 44, 62], 70) } : t10 >= 95 ? { word: `Gewitter`, icon: LO(8, 4, 1, `#adb5bd`, `#495057`) + Gle } : { word: `bew\xF6lkt`, icon: LO(14, 32, 0.84) };
}
function VO(e17, t10, n10, r10, i10) {
  if (t10) {
    let t11 = document.createElement(`div`);
    return t11.className = `lh-wg-pic`, t11.innerHTML = e17.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), t11;
  }
  let a10 = document.createElement(`img`);
  return a10.className = `lh-wg-pic`, a10.alt = ``, a10.draggable = false, a10.src = n10.stickerUrl ? n10.stickerUrl(e17) : mO(e17), a10.style.width = gO(r10), a10.style.height = gO(i10), a10;
}
function YO(e17 = ``) {
  let t10 = crypto.getRandomValues(new Uint32Array(2));
  return e17 + t10[0].toString(36) + t10[1].toString(36);
}
function Ek(e17) {
  return { id: YO(`wg`), type: `widget`, ...e17, rot: e17.rot ?? 0 };
}
function Dk(e17) {
  return { id: YO(`tk`), type: `talk`, label: ``, color: `#ffffff`, ...e17, rot: e17.rot ?? 0 };
}
var Ok = { P: { label: `Personen`, color: `#fff3bf` }, V: { label: `Tun-W\xF6rter`, color: `#d3f9d8` }, A: { label: `Wie-W\xF6rter`, color: `#d0ebff` }, N: { label: `Dinge, Orte`, color: `#ffe8cc` }, S: { label: `Soziales`, color: `#ffdeeb` }, F: { label: `Fragen`, color: `#e5dbff` }, K: { label: `Kleine W\xF6rter`, color: `#f1f3f5` }, W: { label: `Wei\xDF`, color: `#ffffff` } };
var kk = [{ id: `talk-basis`, label: `Erste W\xF6rter`, keywords: `basal basis ja nein mehr fertig stopp hilfe erste w\xF6rter`, cols: 3, rows: 2, cells: [[`Ja`, 5584, `S`, `Ja.`], [`Nein`, 5526, `S`, `Nein.`], [`Mehr`, 5508, `K`, `Mehr, bitte.`], [`Fertig`, 28429, `V`, `Ich bin fertig.`], [`Stopp`, 7196, `S`, `Stopp!`], [`Hilfe`, 32648, `V`, `Hilf mir bitte.`]] }, { id: `talk-brauche`, label: `Ich brauche \u2026`, keywords: `bed\xFCrfnisse pers\xF6nlich brauche toilette trinken essen pause hilfe schmerzen m\xFCde kalt warm`, cols: 4, rows: 3, cells: [[`Toilette`, 5921, `N`, `Ich muss auf die Toilette.`], [`trinken`, 6061, `V`, `Ich m\xF6chte etwas trinken.`], [`essen`, 6456, `V`, `Ich m\xF6chte etwas essen.`], [`Pause`, 24503, `N`, `Ich brauche eine Pause.`], [`Hilfe`, 32648, `V`, `Ich brauche Hilfe.`], [`Schmerzen`, 2367, `N`, `Mir tut etwas weh.`], [`m\xFCde`, 35537, `A`, `Ich bin m\xFCde.`], [`kalt`, 35583, `A`, `Mir ist kalt.`], [`warm`, 35721, `A`, `Mir ist warm.`], [`Ruhe`, 5936, `N`, `Ich brauche Ruhe.`], [`Taschentuch`, 17284, `N`, `Ich brauche ein Taschentuch.`], [`kuscheln`, 6023, `V`, `Ich m\xF6chte kuscheln.`]] }, { id: `talk-gefuehle`, label: `Gef\xFChle`, keywords: `gef\xFChle gef\xFChl fr\xF6hlich traurig w\xFCtend angst krank gut schlecht emotionen wie geht es dir`, cols: 4, rows: 3, cells: [[`fr\xF6hlich`, 35547, `A`, `Ich bin fr\xF6hlich.`], [`traurig`, 35545, `A`, `Ich bin traurig.`], [`w\xFCtend`, 35539, `A`, `Ich bin w\xFCtend.`], [`Angst`, 10261, `N`, `Ich habe Angst.`], [`m\xFCde`, 35537, `A`, `Ich bin m\xFCde.`], [`krank`, 3308, `A`, `Ich bin krank.`], [`gut`, 38564, `A`, `Mir geht es gut.`], [`schlecht`, 39951, `A`, `Mir geht es schlecht.`], [`\xFCberrascht`, 35529, `A`, `Ich bin \xFCberrascht.`], [`aufgeregt`, 30391, `A`, `Ich bin aufgeregt.`], [`ruhig`, 31310, `A`, `Ich bin ruhig.`], [`gelangweilt`, 35531, `A`, `Mir ist langweilig.`]] }, { id: `talk-schule`, short: `Schule`, label: `In der Schule`, keywords: `schule schulisch unterricht klasse stift schere kleber buch heft tafel lesen schreiben rechnen malen pause`, cols: 5, rows: 4, cells: [[`Lehrerin`, 6556, `P`], [`Mitsch\xFCler`, 37658, `P`], [`Stift`, 2440, `N`], [`Buntstifte`, 17016, `N`], [`Schere`, 2591, `N`], [`Kleber`, 2709, `N`], [`Buch`, 25191, `N`], [`Heft`, 2359, `N`], [`Arbeitsblatt`, 37405, `N`], [`Tafel`, 2526, `N`], [`Computer`, 7190, `N`], [`Tablet`, 28099, `N`], [`lesen`, 7141, `V`], [`schreiben`, 2380, `V`], [`rechnen`, 8518, `V`], [`malen`, 5574, `V`], [`Pause`, 24503, `N`, `Ich brauche eine Pause.`], [`fertig`, 28429, `V`, `Ich bin fertig.`], [`Hilfe`, 32648, `V`, `Kannst du mir helfen?`], [`Toilette`, 5921, `N`, `Ich muss auf die Toilette.`]] }, { id: `talk-zuhause`, short: `Zuhause`, label: `Zuhause und Familie`, keywords: `privat zuhause familie mama papa bruder schwester oma opa baby schlafen baden hund katze`, cols: 4, rows: 3, cells: [[`Mama`, 2458, `P`], [`Papa`, 31146, `P`], [`Bruder`, 2423, `P`], [`Schwester`, 2422, `P`], [`Oma`, 23710, `P`], [`Opa`, 23718, `P`], [`Baby`, 6060, `P`], [`Zuhause`, 6964, `N`], [`schlafen`, 6479, `V`], [`baden`, 6058, `V`], [`Hund`, 7202, `N`], [`Katze`, 7114, `N`]] }, { id: `talk-freizeit`, short: `Freizeit`, label: `Freizeit und Hobbys`, keywords: `freizeit hobbys hobby spielen fu\xDFball malen musik singen tanzen fahrrad schwimmen fernsehen spielplatz freunde`, cols: 4, rows: 4, cells: [[`spielen`, 23392, `V`], [`Fu\xDFball`, 16743, `N`], [`malen`, 5574, `V`], [`Musik h\xF6ren`, 2746, `V`], [`singen`, 6960, `V`], [`tanzen`, 35747, `V`], [`Fahrrad fahren`, 36945, `V`], [`schwimmen`, 6568, `V`], [`fernsehen`, 29123, `V`], [`Videospiel`, 37464, `N`], [`lesen`, 7141, `V`], [`drau\xDFen`, 5475, `A`], [`Spielplatz`, 33064, `N`], [`Freunde`, 2255, `P`], [`Puzzle`, 2540, `N`], [`basteln`, 7794, `V`]] }, { id: `talk-essen`, short: `Essen`, label: `Essen und Trinken`, keywords: `essen trinken fr\xFChst\xFCck pause wasser saft milch brot apfel banane nudeln pizza`, cols: 4, rows: 4, cells: [[`Wasser`, 32464, `N`], [`Saft`, 11461, `N`], [`Milch`, 2445, `N`], [`Kakao`, 4940, `N`], [`Brot`, 2494, `N`], [`Brezel`, 39058, `N`], [`Apfel`, 2462, `N`], [`Banane`, 2530, `N`], [`Nudeln`, 8652, `N`], [`Pizza`, 2527, `N`], [`Kartoffeln`, 2503, `N`], [`Joghurt`, 2618, `N`], [`K\xE4se`, 2541, `N`], [`Cornflakes`, 2328, `N`], [`Keks`, 8312, `N`], [`Eis`, 3348, `N`]] }, { id: `talk-kern`, short: `Kernw\xF6rter`, label: `Kernw\xF6rter mit Satzleiste`, keywords: `kernvokabular kernw\xF6rter kern satzleiste s\xE4tze bauen ich du wir m\xF6chte haben machen gehen nicht mehr`, cols: 6, rows: 4, strip: true, cells: [[`ich`, 6632, `P`], [`m\xF6chte`, 5441, `V`], [`haben`, 32761, `V`], [`ist`, 36480, `V`], [`gut`, 38564, `A`], [`ja`, 5584, `S`], [`du`, 6625, `P`], [`machen`, 32751, `V`], [`gehen`, 8142, `V`], [`spielen`, 23392, `V`], [`schlecht`, 39951, `A`], [`nein`, 5526, `S`], [`wir`, 7183, `P`], [`essen`, 6456, `V`], [`trinken`, 6061, `V`], [`helfen`, 32648, `V`], [`fertig`, 28429, `A`], [`mehr`, 5508, `K`], [`was`, 22620, `F`], [`wo`, 7764, `F`], [`hier`, 5382, `K`], [`nicht`, 5525, `K`], [`auch`, 11591, `K`], [`noch mal`, 37163, `K`]] }, { id: `talk-gespraech`, short: `Gespr\xE4ch`, label: `Gespr\xE4ch und Fragen`, keywords: `gespr\xE4ch fragen hallo tsch\xFCss danke bitte wie geht es dir wer was wo wann warum wie sozial`, cols: 4, rows: 3, cells: [[`Hallo`, 6522, `S`, `Hallo!`], [`Tsch\xFCss`, 6028, `S`, `Tsch\xFCss!`], [`Danke`, 8129, `S`, `Danke!`], [`Bitte`, 8195, `S`, `Bitte.`], [`Wie geht es dir?`, 11597, `S`], [`Mir geht es gut`, 13630, `S`, `Mir geht es gut.`], [`Wer?`, 9853, `F`], [`Was?`, 22620, `F`], [`Wo?`, 7764, `F`], [`Wann?`, 32874, `F`], [`Warum?`, 36719, `F`], [`Wie?`, 22619, `F`]] }, { id: `talk-orte`, label: `Orte`, keywords: `orte ort wohin schule zuhause klassenzimmer turnhalle spielplatz supermarkt arzt garten schwimmbad bus auto b\xE4ckerei`, cols: 4, rows: 3, cells: [[`Schule`, 32446, `N`], [`Zuhause`, 6964, `N`], [`Klassenzimmer`, 33072, `N`], [`Turnhalle`, 33076, `N`], [`Spielplatz`, 33064, `N`], [`Supermarkt`, 3389, `N`], [`Arzt`, 6561, `P`], [`Garten`, 2434, `N`], [`Schwimmbad`, 30516, `N`], [`Bus`, 2263, `N`], [`Auto`, 2339, `N`], [`B\xE4ckerei`, 6576, `N`]] }];
var Ak = [`zur\xFCck`, 39494, `K`];
var pue = { "talk-basis": 5584, "talk-brauche": 32648, "talk-gefuehle": 35547, "talk-schule": 32446, "talk-zuhause": 6964, "talk-freizeit": 23392, "talk-essen": 6456, "talk-kern": 5441, "talk-gespraech": 6522, "talk-orte": 3389 };
var jk = [{ id: `talk-grid-2`, label: `2 Felder`, cols: 2, rows: 1 }, { id: `talk-grid-4`, label: `4 Felder`, cols: 2, rows: 2 }, { id: `talk-grid-6`, label: `6 Felder`, cols: 3, rows: 2 }, { id: `talk-grid-9`, label: `9 Felder`, cols: 3, rows: 3 }, { id: `talk-grid-12`, label: `12 Felder`, cols: 4, rows: 3 }, { id: `talk-grid-20`, label: `20 Felder`, cols: 5, rows: 4 }, { id: `talk-grid-strip`, label: `Satzleiste + 15 Felder`, cols: 5, rows: 3, strip: true }];
var Mk = 40;
var Nk = { x: Mk, y: 34, w: 1320, h: 150 };
function mue(e17, t10, n10, r10) {
  let i10 = e17 * t10 <= 6 ? 30 : e17 * t10 <= 16 ? 20 : 16, a10 = n10 || r10 ? Nk.y + Nk.h + 26 : Mk, o10 = (1320 - (e17 - 1) * i10) / e17, s10 = (950 - a10 - (t10 - 1) * i10) / t10, c10 = [];
  for (let n11 = 0; n11 < t10; n11++) for (let t11 = 0; t11 < e17; t11++) c10.push({ x: Math.round(Mk + t11 * (o10 + i10)), y: Math.round(a10 + n11 * (s10 + i10)), w: Math.round(o10), h: Math.round(s10) });
  return c10;
}
var Pk = (e17) => `arasaac-${e17}-t`;
var Fk = (e17, t10, n10) => Dk({ x: e17, y: t10, w: n10, h: n10, label: Ak[0], back: true, asset: Pk(Ak[1]), color: Ok[Ak[2]].color, locked: true });
function Ik(e17, t10, n10, r10, i10 = {}) {
  let a10 = [], o10 = Nk.h;
  return i10.back && a10.push(Fk(Mk, Nk.y, o10)), n10 && a10.push(Ek({ ...Nk, ...i10.back ? { x: Mk + o10 + 20, w: Nk.w - o10 - 20 } : {}, kind: `strip`, locked: true })), mue(e17, t10, n10, i10.back).forEach((e18, t11) => {
    let n11 = r10?.[t11];
    a10.push(Dk({ ...e18, locked: true, ...n11 ? { label: n11[0], asset: Pk(n11[1]), color: Ok[n11[2]].color, ...n11[3] ? { say: n11[3] } : {} } : {} }));
  }), a10;
}
var Rk = () => kk.map((e17) => [e17.short ?? e17.label, pue[e17.id], `W`, (e17.short ?? e17.label).replace(/ …$/, ``)]);
var LP = 0.85;
var GP;
function Zpe() {
  if (GP === void 0) try {
    let e17 = document.createElement(`canvas`);
    e17.width = e17.height = 1, GP = e17.toDataURL(`image/webp`).startsWith(`data:image/webp`);
  } catch {
    GP = false;
  }
  return GP;
}
function Qpe(e17, t10, n10) {
  try {
    let r10 = e17.getImageData(0, 0, t10, n10).data;
    for (let e18 = 3; e18 < r10.length; e18 += 4) if (r10[e18] < 255) return true;
    return false;
  } catch {
    return true;
  }
}
function KP(e17, t10, n10) {
  let r10 = e17.toDataURL(t10, n10);
  if (r10.length < 32) throw Error(`Das Bild konnte nicht gespeichert werden (zu gro\xDF?).`);
  return { dataUrl: r10, mime: r10.slice(5, r10.indexOf(`;`)) || t10 };
}
async function qP(e17, t10) {
  let n10 = e17.getContext(`2d`), r10;
  return r10 = Zpe() ? KP(e17, `image/webp`, LP) : t10 ?? Qpe(n10, e17.width, e17.height) ? KP(e17, `image/png`) : KP(e17, `image/jpeg`, LP), { ...r10, width: e17.width, height: e17.height };
}
var h6 = [{ name: `Deutsch`, color: `#e03131`, arasaac: 37740 }, { name: `Mathe`, color: `#1c7ed6`, arasaac: 10260 }, { name: `Sachunterricht`, color: `#2f9e44`, arasaac: 35437 }, { name: `Englisch`, color: `#7048e8`, arasaac: 32705 }, { name: `Kunst`, color: `#f76707`, arasaac: 11245 }, { name: `Musik`, color: `#d6336c`, arasaac: 24791 }, { name: `Sport`, color: `#0ca678`, arasaac: 7010 }, { name: `Schwimmen`, color: `#1098ad`, arasaac: 6568 }, { name: `Religion`, color: `#a5734d`, arasaac: 24471 }, { name: `Ethik`, color: `#868e96`, arasaac: 34709 }, { name: `Werken`, color: `#e8590c`, arasaac: 9805 }, { name: `Textiles Gestalten`, color: `#c2255c`, arasaac: 7068 }, { name: `Kochen`, color: `#f59f00`, arasaac: 5485 }, { name: `Lesen`, color: `#9c36b5`, arasaac: 2447 }, { name: `Schreiben`, color: `#364fc7`, arasaac: 2380 }, { name: `Computer`, color: `#495057`, arasaac: 22801 }, { name: `Morgenkreis`, color: `#fab005`, arasaac: 27575 }, { name: `F\xF6rderung`, color: `#5c940d`, arasaac: 37810 }, { name: `Logop\xE4die`, color: `#e64980`, arasaac: 6142 }, { name: `Ergotherapie`, color: `#20c997`, arasaac: 24821 }, { name: `Physiotherapie`, color: `#15aabf`, arasaac: 8725 }, { name: `Klassenrat`, color: `#845ef7`, arasaac: 38789 }, { name: `B\xFCcherei`, color: `#a61e4d`, arasaac: 32450 }, { name: `Garten`, color: `#37b24d`, arasaac: 2434 }, { name: `Spielen`, color: `#ff922b`, arasaac: 23392 }, { name: `Basteln`, color: `#fd7e14`, arasaac: 7794 }, { name: `Theater`, color: `#be4bdb`, arasaac: 32412 }, { name: `Ausflug`, color: `#40c057`, arasaac: 4670 }, { name: `Hausaufgaben`, color: `#343a40`, arasaac: 32556 }, { name: `Fr\xFChst\xFCck`, color: `#f08c00`, arasaac: 4626 }, { name: `Pause`, color: `#fab005`, arasaac: 33064 }, { name: `Mittagessen`, color: `#e67700`, arasaac: 4611 }];
var g6 = [{ name: `Tagesst\xE4tte`, color: `#1c7ed6`, arasaac: 25692 }, { name: `Hort`, color: `#7048e8`, arasaac: 25693 }, { name: `Mittagsbetreuung`, color: `#f08c00`, arasaac: 4611 }, { name: `Bus`, color: `#e03131`, arasaac: 2263 }, { name: `Taxi`, color: `#fab005`, arasaac: 2580 }, { name: `Abholung`, color: `#2f9e44`, arasaac: 35060 }, { name: `Nach Hause`, color: `#495057`, arasaac: 32940 }];
async function lDe(e17) {
  let t10 = `/api/karte?suche=${encodeURIComponent(e17)}`, n10 = await fetch(t10, { headers: { Accept: `application/json` } });
  if (!n10.ok) throw Error(String(n10.status));
  return (await n10.json()).flatMap((e18) => e18.lat && e18.lon ? [{ name: e18.display_name ?? ``, lat: Number(e18.lat), lon: Number(e18.lon) }] : []).filter((e18) => Number.isFinite(e18.lat) && Number.isFinite(e18.lon));
}
function uDe(e17, t10) {
  if (t10 === `none`) return;
  let n10 = e17.getImageData(0, 0, VC, 760), r10 = n10.data;
  for (let e18 = 0; e18 < r10.length; e18 += 4) {
    let n11 = r10[e18], i10 = r10[e18 + 1], a10 = r10[e18 + 2];
    if (t10 === `sepia`) {
      let t11 = 0.393 * n11 + 0.769 * i10 + 0.189 * a10, o10 = 0.349 * n11 + 0.686 * i10 + 0.168 * a10, s10 = 0.272 * n11 + 0.534 * i10 + 0.131 * a10;
      r10[e18] = Math.min(255, n11 * 0.25 + t11 * 0.75), r10[e18 + 1] = Math.min(255, i10 * 0.25 + o10 * 0.75), r10[e18 + 2] = Math.min(255, a10 * 0.25 + s10 * 0.75 * 0.9);
    } else if (t10 === `dark`) {
      let t11 = 255 - n11, o10 = 255 - i10, s10 = 255 - a10;
      r10[e18] = Math.max(0, Math.min(255, (-0.574 * t11 + 1.43 * o10 + 0.144 * s10) * 0.85)), r10[e18 + 1] = Math.max(0, Math.min(255, (0.426 * t11 + 0.43 * o10 + 0.144 * s10) * 0.85)), r10[e18 + 2] = Math.max(0, Math.min(255, (0.426 * t11 + 1.43 * o10 - 0.856 * s10) * 0.85 + 18));
    } else {
      let t11 = 0.299 * n11 + 0.587 * i10 + 0.114 * a10;
      r10[e18] = Math.min(255, (t11 + 0.65 * (n11 - t11)) * 1.04 + 6), r10[e18 + 1] = Math.min(255, (t11 + 0.65 * (i10 - t11)) * 1.04 + 6), r10[e18 + 2] = Math.min(255, (t11 + 0.65 * (a10 - t11)) * 1.04 + 6);
    }
  }
  e17.putImageData(n10, 0, 0);
}
async function U6(e17, t10) {
  let n10 = document.createElement(`canvas`);
  n10.width = VC, n10.height = 760;
  let r10 = n10.getContext(`2d`);
  if (!r10) throw Error(`no canvas`);
  return r10.fillStyle = `#f2efe9`, r10.fillRect(0, 0, VC, 760), await Promise.all(rw(e17).map(async (e18) => {
    let n11 = await fetch(WC(e18.z, e18.x, e18.y, t10), { mode: `cors` });
    if (!n11.ok) throw Error(`tile ${n11.status}`);
    let i10 = await createImageBitmap(await n11.blob());
    r10.drawImage(i10, Math.round(e18.left), Math.round(e18.top), 256, 256), i10.close?.();
  })), uDe(r10, QC(e17.design).tint), qP(n10);
}
var lNe = [`wenig`, `etwas weniger`, `mittel`, `mehr`, `sehr`];
function classTime(e17, t10, n10, r10) {
  let i10 = /* @__PURE__ */ new Date(), a10 = Math.max(1, Math.round(t10.w)), o10 = Math.max(1, Math.round(t10.h));
  switch (t10.kind) {
    case `clock`: {
      let s10 = t10.face === `digital`, c10 = `${s10}|${i10.getHours()}:${i10.getMinutes()}|${s10 ? n10 ? i10.getSeconds() % 2 : 0 : i10.getSeconds()}`;
      if (e17.dataset.k === c10) return;
      e17.dataset.k = c10, e17.classList.toggle(`is-digital`, s10), e17.setAttribute(`aria-label`, `Uhr: ${i10.getHours()}:${String(i10.getMinutes()).padStart(2, `0`)} Uhr`), e17.replaceChildren(s10 ? Fle(t10, i10, n10) : VO(Ple(i10, a10, o10), n10, r10, a10, o10));
      return;
    }
    case `timer`: {
      let i11 = CO(t10, n10), s10 = Ile(t10, i11, n10), c10 = `${i11.state}|${i11.left}|${s10}`;
      if (e17.dataset.k === c10) return;
      e17.dataset.k = c10, e17.classList.toggle(`is-done`, i11.state === `done`), e17.setAttribute(`aria-label`, `Timer: ${s10}`), e17.replaceChildren(VO(Lle(i11.left, s10, a10, o10), n10, r10, a10, o10));
      return;
    }
    case `date`: {
      let a11 = yO(i10), o11 = t10.place ? PO(t10.place, n10) : null, s10 = o11 ? BO(o11) : null, c10 = `${a11}|${s10 ? s10.word + s10.icon.length : ``}`;
      if (e17.dataset.k === c10) return;
      e17.dataset.k = c10, e17.setAttribute(`aria-label`, s10 ? `${a11}. Wetter: ${s10.word}` : a11);
      let l10 = document.createElement(`div`);
      l10.className = `lh-wg-card`, l10.style.fontFamily = Ve(`andika`), l10.style.borderRadius = gO(Math.min(28, t10.h * 0.14));
      let u10 = document.createElement(`div`);
      u10.className = `lh-wg-band`, u10.style.height = gO(Math.max(8, t10.h * 0.09));
      let d10 = document.createElement(`div`);
      d10.className = `lh-wg-day`;
      let f10 = Math.max(10, Math.min(t10.h * (s10 ? 0.25 : 0.36), t10.w * 0.9 / (a11.length * 0.5)));
      if (d10.style.fontSize = gO(f10), d10.textContent = a11, l10.append(u10, d10), s10 && t10.place) {
        let e18 = document.createElement(`div`);
        e18.className = `lh-wg-weather`;
        let n11 = Math.min(f10 * 0.95, t10.h * 0.22);
        e18.style.fontSize = gO(n11);
        let i11 = document.createElement(`img`), a12 = Math.round(n11 * 1.9), o12 = _O(`0 0 100 100`, a12, a12, s10.icon);
        i11.src = r10.stickerUrl ? r10.stickerUrl(o12) : mO(o12), i11.alt = ``, i11.draggable = false, i11.style.width = i11.style.height = gO(a12);
        let c11 = document.createElement(`span`);
        c11.textContent = s10.word, e18.title = `Wetter in ${t10.place.name} \u2013 Daten: Open-Meteo.com`, e18.append(i11, c11), l10.appendChild(e18);
      }
      e17.replaceChildren(l10);
      return;
    }
    
  }
}
var CLASS_CSS = `
.lh-widget{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.lh-wg-pic{position:absolute;left:0;top:0;width:100%;height:100%;display:block}
.lh-wg-pic svg{display:block;width:100%;height:100%}
.lh-wg-digits{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1e293b;color:#f8fafc;font-weight:700;line-height:1;box-shadow:inset 0 0 0 4px #0f172a;white-space:nowrap}
.lh-wg-colon{padding:0 .04em;transform:translateY(-.06em)}
.lh-wg-colon.is-off{opacity:.25}
.lh-wg-card{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.15em;background:#fff;border:4px solid ${fO};overflow:hidden;color:${fO};padding:4% 3% 2%}
.lh-wg-band{position:absolute;left:0;right:0;top:0;background:${pO}}
.lh-wg-day{font-weight:700;white-space:nowrap;line-height:1.2}
.lh-wg-weather{display:flex;align-items:center;gap:.35em;font-weight:700;line-height:1.1;color:#334155}
.lh-wg-weather img{display:block;flex:none}
.lh-wg-timer.is-ringing .lh-wg-pic{animation:lh-wg-ring .4s ease-in-out 8}
@keyframes lh-wg-ring{25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
` + Ra + Sne + Kne + lce + Ece + zne + ite + mte;
function classTap(e, t) {
  if (e.kind === `timer`) { Vr(); pi(); }
  if (e.kind === `timer` && e.timer !== `fixed`) {
    dc();
    let n = SO.get(e.id), i = n && !n.done ? Math.max(0, n.end - Date.now()) / 6e4 : 0, r = Math.ceil(i / 5) * 5;
    r - i < 0.5 && (r += 5), r > 60 ? SO.delete(e.id) : wO(e, r);
    return;
  }
  let r = { onVoice: () => t?.classList.add(`is-reading`) };
  lc(xO(e), void 0, r).then(() => t?.classList.remove(`is-reading`));
}
function classTick(t, e) {
  if (e.kind === `timer`) {
    let n = SO.get(e.id);
    n && !n.done && n.end <= Date.now() && (n.done = !0, e.silent || hi(), t.classList.add(`is-ringing`), setTimeout(() => t.classList.remove(`is-ringing`), 3200));
  }
  classTime(t, e, !0, {});
}
function classReset(e) { e.timer === `fixed` ? wO(e) : SO.delete(e.id); }
function classStart(e) { e.kind === `timer` && e.timer === `fixed` && !SO.has(e.id) && wO(e); }
export { classTime as renderTime, classTap as tapTime, classTick as tickTime, classStart as startTime, classReset as resetTimer, xO as timeSpeech, yO as dateText, CO as timerState, Ule as searchPlace, Hle as loadWeather, BO as weatherWord, Ia as renderMultiTimer, Ki as multiTimerConfig, La as multiTimerLabel, Ea as onMultiTimerChange, sa as stopMultiTimer, Hi as MULTI_TIMER_SOUNDS, Ui as MULTI_TIMER_START, Bi as MULTI_TIMER_COLORS, zi as MULTI_TIMER_NEXT_COLORS, Vi as MULTI_TIMER_ICONS, xne as renderApplause, um as applauseConfig, Rm as applauseLabel, Sm as applausePicture, om as APPLAUSE_WORDS, sm as APPLAUSE_SECONDS, une as NOISE_LIMITS, lNe as MIC_SENSITIVITY, bne as stopApplause, Wne as renderTimetable, Nh as timetableLabel, Gne as timetableSay, jh as timetableHtml, wh as timetableConfig, Ch as timetableStart, Eh as timetableTimes, Th as clockText, h6 as TIMETABLE_SUBJECTS, g6 as TIMETABLE_AFTER, yh as TIMETABLE_DESIGNS, gh as TIMETABLE_FONTS, Be as fontOf, YT as renderCalendar, sce as tapCalendar, cce as calendarLabel, eE as restartCalendar, Aw as renderMap, jw as mapLabel, gse as mapConfig, uw as mapStart, QC as mapDesign, ZC as MAP_DESIGNS, GC as MAP_SYMBOLS, JC as mapSymbol, zC as PATH_KINDS, BC as PATH_COLORS, rw as mapTiles, $C as toWorld, ew as fromWorld, tw as toView, nw as fromView, yw as mapMarks, vw as labelBoxes, ow as distanceText, aw as pathLength, iw as distance, U6 as mapPicture, lDe as searchAddress, WC as tileUrl, VC as MAP_W, HC as MAP_DATA, UC as MAP_CREDIT, yce as renderTalk, Sce as tapTalk, pE as renderStrip, Tce as tapStrip, Cce as addToStrip, wce as clearStrip, kk as TALK_BOARDS, Ak as TALK_BACK, jk as TALK_GRIDS, Ok as WORD_CLASSES, pue as TALK_BOOK_ICONS, Ik as talkLayout, Rk as bookCells, Nk as STRIP_BOX, mh as renderPitch, hh as pitchLabel, Vm as pitchConfig, zm as PITCH_SECONDS, Hm as secondsText, Lne as stopPitch, Bm as PITCH_START, tte as renderSlideshow, nte as slideshowLabel, Qd as showStart, Xd as SHOW_DESIGNS, Zd as showDesign, pte as renderAnimation, Vf as animationLabel, df as animationStart, CLASS_CSS };
