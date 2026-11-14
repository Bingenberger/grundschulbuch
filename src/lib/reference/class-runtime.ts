/* eslint-disable */
// @ts-nocheck
// Generated from Lernsachen-Heft.html by scripts/extract-class-reference.mjs:
// Uhr, Timer, Datum (Regal › Zeit) and the Multi-Timer of the reference,
// unchanged except that the weather is asked through /api/wetter.
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
function Po(e17) {
  let t10 = mo(e17.skin).label;
  return e17.scale === `all` ? t10 : `${t10} in ${xo(e17)}`;
}
var Fo = { kick: `Bass`, snare: `Snare`, hihat: `Hi-Hat`, hihatOpen: `Hi-Hat offen`, tom1: `Tom 1`, tom2: `Tom 2`, floortom: `Standtom`, crash: `Becken`, ride: `Ride`, clap: `Klatschen`, cajonBass: `Caj\xF3n Bass`, cajonSlap: `Caj\xF3n Slap`, bongoHigh: `Bongo hoch`, bongoLow: `Bongo tief`, congaHigh: `Conga hoch`, congaLow: `Conga tief`, handdrum: `Handtrommel`, triangle: `Triangel`, tambourine: `Schellenkranz`, claves: `Klangh\xF6lzer`, shaker: `Rassel`, cymbal: `Becken`, woodblock: `Holzblock`, cowbell: `Kuhglocke` };
var Lo = [{ id: `drumset`, label: `Schlagzeug` }, { id: `cajon`, label: `Caj\xF3n` }, { id: `hand`, label: `Bongos & Congas` }, { id: `orff`, label: `Orff-Instrumente` }, { id: `pads`, label: `Klang-Pads` }];
var Bo = (e17) => Lo.find((t10) => t10.id === e17)?.label ?? `Schlagzeug`;
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
var Qd = (e17 = `cinema`) => ({ title: `Meine Diaschau`, slides: [], dur: 5, transition: `fade`, caption: `bottom`, design: e17, wait: true, loop: false });
var nte = (e17) => {
  let t10 = e17.show ?? Qd();
  return `Diaschau \u201E${t10.title}\u201C mit ${t10.slides.length === 1 ? `einem Foto` : `${t10.slides.length} Fotos`}. Tippe auf \u201EDiaschau ansehen\u201C.`;
};
function Vf(e17) {
  let t10 = e17.anim;
  if (!t10) return `Animation`;
  let n10 = t10.objects.filter((e18) => e18.kind === `text` && e18.text?.trim()).map((e18) => e18.text.replace(/\n/g, ` `).trim());
  return [`Animation: ${t10.title}`, `${t10.len} Sekunden`, ...n10].join(`. `);
}
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
function hh(e17) {
  return `Elevator Pitch: ${Hm(Vm(e17.pitch).secs)} Zeit. Tippe auf \u201ELos!\u201C \u2013 der Fahrstuhl f\xE4hrt nach oben, oben ist die Zeit um.`;
}
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
function iw(e17, t10) {
  let n10 = Math.PI / 180, r10 = (t10[0] - e17[0]) * n10, i10 = (t10[1] - e17[1]) * n10, a10 = Math.sin(r10 / 2) ** 2 + Math.cos(e17[0] * n10) * Math.cos(t10[0] * n10) * Math.sin(i10 / 2) ** 2;
  return 127420176e-1 * Math.asin(Math.min(1, Math.sqrt(a10)));
}
var aw = (e17) => e17.reduce((t10, n10, r10) => r10 ? t10 + iw(e17[r10 - 1], n10) : 0, 0);
function ow(e17) {
  return e17 < 1e3 ? `${Math.max(10, Math.round(e17 / 10) * 10)} m` : e17 < 1e4 ? `${(e17 / 1e3).toFixed(1).replace(`.`, `,`)} km` : `${Math.round(e17 / 1e3)} km`;
}
var uw = (e17 = `classic`) => ({ lat: 51.1657, lon: 10.4515, zoom: 5, markers: [], design: e17 });
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
var xT = [`Montag`, `Dienstag`, `Mittwoch`, `Donnerstag`, `Freitag`, `Samstag`, `Sonntag`];
var ST = [`Januar`, `Februar`, `M\xE4rz`, `April`, `Mai`, `Juni`, `Juli`, `August`, `September`, `Oktober`, `November`, `Dezember`];
var CT = `erste.zweite.dritte.vierte.f\xFCnfte.sechste.siebte.achte.neunte.zehnte.elfte.zw\xF6lfte.dreizehnte.vierzehnte.f\xFCnfzehnte.sechzehnte.siebzehnte.achtzehnte.neunzehnte.zwanzigste.einundzwanzigste.zweiundzwanzigste.dreiundzwanzigste.vierundzwanzigste.f\xFCnfundzwanzigste.sechsundzwanzigste.siebenundzwanzigste.achtundzwanzigste.neunundzwanzigste.drei\xDFigste.einunddrei\xDFigste`.split(`.`);
var qse = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function Xse(e17) {
  let t10 = e17.getDate();
  for (let n10 = 0; n10 < e17.getMonth(); n10++) t10 += qse[n10];
  return t10 > 355 ? `Winter` : t10 > 265 ? `Herbst` : t10 > 172 ? `Sommer` : t10 > 79 ? `Fr\xFChling` : `Winter`;
}
function wT() {
  let e17 = /* @__PURE__ */ new Date();
  return { day: xT[(e17.getDay() + 6) % 7], date: e17.getDate(), month: ST[e17.getMonth()], year: e17.getFullYear(), season: Xse(e17), key: `${e17.getFullYear()}-${e17.getMonth() + 1}-${e17.getDate()}` };
}
var DT = { start: `Welcher Tag ist heute?`, day: `Welchen Tag haben wir?`, date: `Welches Datum haben wir?`, month: `Welchen Monat haben wir?`, year: `Welches Jahr haben wir?`, done: `` };
var AT = (e17) => `Heute ist ${e17.day}, der ${CT[e17.date - 1]} ${e17.month} ${e17.year}.`;
var jT = (e17) => `Es ist ${e17.season}.`;
var MT = /* @__PURE__ */ new Map();
function cce(e17) {
  let t10 = MT.get(e17.id), n10 = wT();
  return !t10 || t10.key !== n10.key || t10.step === `start` ? `Das sprechende Kalenderblatt. ${DT.start}` : t10.step === `done` ? `${AT(n10)} ${jT(n10)}` : DT[t10.step];
}
var sE = { entries: [], v: 0 };
var cE = (e17) => sE;
var mE = (e17) => cE(e17).entries.map((e18) => e18.word).join(` `);
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
var h6 = [{ name: `Deutsch`, color: `#e03131`, arasaac: 37740 }, { name: `Mathe`, color: `#1c7ed6`, arasaac: 10260 }, { name: `Sachunterricht`, color: `#2f9e44`, arasaac: 35437 }, { name: `Englisch`, color: `#7048e8`, arasaac: 32705 }, { name: `Kunst`, color: `#f76707`, arasaac: 11245 }, { name: `Musik`, color: `#d6336c`, arasaac: 24791 }, { name: `Sport`, color: `#0ca678`, arasaac: 7010 }, { name: `Schwimmen`, color: `#1098ad`, arasaac: 6568 }, { name: `Religion`, color: `#a5734d`, arasaac: 24471 }, { name: `Ethik`, color: `#868e96`, arasaac: 34709 }, { name: `Werken`, color: `#e8590c`, arasaac: 9805 }, { name: `Textiles Gestalten`, color: `#c2255c`, arasaac: 7068 }, { name: `Kochen`, color: `#f59f00`, arasaac: 5485 }, { name: `Lesen`, color: `#9c36b5`, arasaac: 2447 }, { name: `Schreiben`, color: `#364fc7`, arasaac: 2380 }, { name: `Computer`, color: `#495057`, arasaac: 22801 }, { name: `Morgenkreis`, color: `#fab005`, arasaac: 27575 }, { name: `F\xF6rderung`, color: `#5c940d`, arasaac: 37810 }, { name: `Logop\xE4die`, color: `#e64980`, arasaac: 6142 }, { name: `Ergotherapie`, color: `#20c997`, arasaac: 24821 }, { name: `Physiotherapie`, color: `#15aabf`, arasaac: 8725 }, { name: `Klassenrat`, color: `#845ef7`, arasaac: 38789 }, { name: `B\xFCcherei`, color: `#a61e4d`, arasaac: 32450 }, { name: `Garten`, color: `#37b24d`, arasaac: 2434 }, { name: `Spielen`, color: `#ff922b`, arasaac: 23392 }, { name: `Basteln`, color: `#fd7e14`, arasaac: 7794 }, { name: `Theater`, color: `#be4bdb`, arasaac: 32412 }, { name: `Ausflug`, color: `#40c057`, arasaac: 4670 }, { name: `Hausaufgaben`, color: `#343a40`, arasaac: 32556 }, { name: `Fr\xFChst\xFCck`, color: `#f08c00`, arasaac: 4626 }, { name: `Pause`, color: `#fab005`, arasaac: 33064 }, { name: `Mittagessen`, color: `#e67700`, arasaac: 4611 }];
var g6 = [{ name: `Tagesst\xE4tte`, color: `#1c7ed6`, arasaac: 25692 }, { name: `Hort`, color: `#7048e8`, arasaac: 25693 }, { name: `Mittagsbetreuung`, color: `#f08c00`, arasaac: 4611 }, { name: `Bus`, color: `#e03131`, arasaac: 2263 }, { name: `Taxi`, color: `#fab005`, arasaac: 2580 }, { name: `Abholung`, color: `#2f9e44`, arasaac: 35060 }, { name: `Nach Hause`, color: `#495057`, arasaac: 32940 }];
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
` + Ra + Sne + Kne;
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
export { classTime as renderTime, classTap as tapTime, classTick as tickTime, classStart as startTime, classReset as resetTimer, xO as timeSpeech, yO as dateText, CO as timerState, Ule as searchPlace, Hle as loadWeather, BO as weatherWord, Ia as renderMultiTimer, Ki as multiTimerConfig, La as multiTimerLabel, Ea as onMultiTimerChange, sa as stopMultiTimer, Hi as MULTI_TIMER_SOUNDS, Ui as MULTI_TIMER_START, Bi as MULTI_TIMER_COLORS, zi as MULTI_TIMER_NEXT_COLORS, Vi as MULTI_TIMER_ICONS, xne as renderApplause, um as applauseConfig, Rm as applauseLabel, Sm as applausePicture, om as APPLAUSE_WORDS, sm as APPLAUSE_SECONDS, une as NOISE_LIMITS, lNe as MIC_SENSITIVITY, bne as stopApplause, Wne as renderTimetable, Nh as timetableLabel, Gne as timetableSay, jh as timetableHtml, wh as timetableConfig, Ch as timetableStart, Eh as timetableTimes, Th as clockText, h6 as TIMETABLE_SUBJECTS, g6 as TIMETABLE_AFTER, yh as TIMETABLE_DESIGNS, gh as TIMETABLE_FONTS, Be as fontOf, CLASS_CSS };
