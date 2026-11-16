/* eslint-disable */
// @ts-nocheck
// Generated from Lernsachen-Heft-komplett.html (1.47.3) by scripts/extract-tools-reference.mjs:
// the tools drawn by the reference's tool host, unchanged.
var Xn = new TextEncoder();
function Zn(e17) {
  let t10 = new Uint8Array(e17.reduce((e18, t11) => e18 + t11.length, 0)), n10 = 0;
  for (let r10 of e17) t10.set(r10, n10), n10 += r10.length;
  return t10;
}
var Qn = (...e17) => new Uint8Array(e17);
var $n = (e17) => Qn(e17 >> 8 & 255, e17 & 255);
var er = (e17) => Qn(e17 >>> 24 & 255, e17 >> 16 & 255, e17 >> 8 & 255, e17 & 255);
var tr = (e17) => new Uint8Array(e17);
var nr = (e17, ...t10) => {
  let n10 = Zn(t10);
  return Zn([er(8 + n10.length), Xn.encode(e17), n10]);
};
var rr = (e17, t10, n10, ...r10) => nr(e17, Qn(t10, n10 >> 16 & 255, n10 >> 8 & 255, n10 & 255), ...r10);
var ir = (e17, ...t10) => {
  let n10 = Zn(t10), r10 = n10.length, i10 = r10 < 128 ? Qn(r10) : Qn(128 | r10 >> 21 & 127, 128 | r10 >> 14 & 127, 128 | r10 >> 7 & 127, r10 & 127);
  return Zn([Qn(e17), i10, n10]);
};
var ar = Zn([er(65536), er(0), er(0), er(0), er(65536), er(0), er(0), er(0), er(1073741824)]);
function sr(e17, t10) {
  let n10 = 0;
  for (let r10 = 0; r10 < 4 && t10 < e17.length; r10++) {
    let r11 = e17[t10++];
    if (n10 = n10 << 7 | r11 & 127, !(r11 & 128)) break;
  }
  return [n10, t10];
}
function cr(e17, t10, n10) {
  let r10 = t10;
  for (; r10 + 1 < n10; ) {
    let t11 = e17[r10], [i10, a10] = sr(e17, r10 + 1), o10 = Math.min(n10, a10 + i10);
    if (t11 === 5) return e17.slice(a10, o10);
    if (t11 === 3) {
      let t12 = a10 + 2, n11 = e17[t12++] ?? 0;
      n11 & 128 && (t12 += 2), n11 & 64 && (t12 += 1 + (e17[t12] ?? 0)), n11 & 32 && (t12 += 2);
      let r11 = cr(e17, t12, o10);
      if (r11) return r11;
    } else if (t11 === 4) {
      let t12 = cr(e17, a10 + 13, o10);
      if (t12) return t12;
    }
    if (o10 <= r10) break;
    r10 = o10;
  }
  return null;
}
var lr = (e17) => !!e17 && e17.length >= 2 && e17.length <= 16 && e17[0] >> 3 >= 1 && e17[0] >> 3 <= 30 && ((e17[0] & 7) << 1 | e17[1] >> 7) <= 12 && (e17[1] >> 3 & 15) >= 1 && (e17[1] >> 3 & 15) <= 7;
function ur(e17) {
  if (lr(e17) && e17[0] !== 3) return e17;
  let t10 = cr(e17, e17.length > 12 && e17[4] === 101 && e17[5] === 115 && e17[6] === 100 && e17[7] === 115 ? 12 : e17.length > 4 && e17[0] === 0 && e17[4] === 3 ? 4 : 0, e17.length);
  return lr(t10) ? t10 : null;
}
function dr(e17, t10, n10, r10, i10 = 96e3) {
  let a10 = e17.length, o10 = a10 * 1024, s10 = e17.reduce((e18, t11) => Math.max(e18, t11.length), 0), c10 = rr(`esds`, 0, 0, ir(3, $n(1), Qn(0), ir(4, Qn(64, 21), Qn(s10 >> 16 & 255, s10 >> 8 & 255, s10 & 255), er(i10), er(i10), ir(5, t10)), ir(6, Qn(2)))), l10 = nr(`mp4a`, tr(6), $n(1), tr(8), $n(r10), $n(16), $n(0), $n(0), er(n10 * 65536), c10), u10 = (t11) => nr(`moov`, rr(`mvhd`, 0, 0, er(0), er(0), er(n10), er(o10), er(65536), $n(256), tr(10), ar, tr(24), er(2)), nr(`trak`, rr(`tkhd`, 0, 7, er(0), er(0), er(1), er(0), er(o10), tr(8), $n(0), $n(0), $n(256), $n(0), ar, er(0), er(0)), nr(`mdia`, rr(`mdhd`, 0, 0, er(0), er(0), er(n10), er(o10), $n(21956), $n(0)), rr(`hdlr`, 0, 0, er(0), Xn.encode(`soun`), tr(12), Xn.encode(`SoundHandler\0`)), nr(`minf`, rr(`smhd`, 0, 0, $n(0), $n(0)), nr(`dinf`, rr(`dref`, 0, 0, er(1), rr(`url `, 0, 1))), nr(`stbl`, rr(`stsd`, 0, 0, er(1), l10), rr(`stts`, 0, 0, er(1), er(a10), er(1024)), rr(`stsc`, 0, 0, er(1), er(1), er(a10), er(1)), rr(`stsz`, 0, 0, er(0), er(a10), ...e17.map((e18) => er(e18.length))), rr(`stco`, 0, 0, er(1), er(t11))))))), d10 = nr(`ftyp`, Xn.encode(`M4A `), er(512), Xn.encode(`M4A `), Xn.encode(`isom`), Xn.encode(`iso2`), Xn.encode(`mp41`));
  return Zn([d10, u10(d10.length + u10(0).length + 8), er(8 + e17.reduce((e18, t11) => e18 + t11.length, 0)), Xn.encode(`mdat`), ...e17]);
}
var fr = (e17, t10) => (e17[t10] << 24 >>> 0) + (e17[t10 + 1] << 16) + (e17[t10 + 2] << 8) + e17[t10 + 3];
function pr(e17, t10, n10, r10) {
  let i10 = t10;
  for (; i10 + 8 <= n10; ) {
    let t11 = fr(e17, i10);
    if (t11 < 8 || i10 + t11 > n10) return null;
    if (String.fromCharCode(e17[i10 + 4], e17[i10 + 5], e17[i10 + 6], e17[i10 + 7]) === r10) return [i10 + 8, i10 + t11];
    i10 += t11;
  }
  return null;
}
function mr(e17) {
  let t10 = (t11, ...n11) => {
    let r11 = t11;
    for (let t12 of n11) r11 &&= pr(e17, r11[0], r11[1], t12);
    return r11;
  }, n10 = pr(e17, 0, e17.length, `moov`), r10 = pr(e17, 0, e17.length, `mdat`), i10 = t10(n10, `trak`, `mdia`), a10 = t10(i10, `mdhd`), o10 = t10(i10, `minf`, `stbl`), s10 = t10(o10, `stsd`), c10 = t10(o10, `stsz`), l10 = t10(o10, `stco`);
  if (!r10 || !a10 || !s10 || !c10 || !l10) return null;
  let u10 = pr(e17, s10[0] + 8, s10[1], `mp4a`), d10 = u10 && pr(e17, u10[0] + 28, u10[1], `esds`);
  if (!u10 || !d10) return null;
  let f10 = cr(e17, d10[0] + 4, d10[1]);
  if (!f10 || f10[0] !== 3) return null;
  let p10 = ur(f10);
  if (!p10) return null;
  let m10 = e17[u10[0] + 16] << 8 | e17[u10[0] + 17], h10 = fr(e17, a10[0] + (e17[a10[0]] === 1 ? 20 : 12));
  if (fr(e17, l10[0] + 4) !== 1) return null;
  let g10 = fr(e17, c10[0] + 8), _10 = fr(e17, c10[0] + 4), v10 = fr(e17, l10[0] + 8);
  if (!g10 || !h10 || m10 < 1 || m10 > 8 || c10[0] + 12 + (_10 ? 0 : g10 * 4) > c10[1]) return null;
  let y10 = [], b10 = 0;
  for (let t11 = 0; t11 < g10; t11++) {
    let n11 = _10 || fr(e17, c10[0] + 12 + t11 * 4);
    if (v10 + n11 > e17.length) return null;
    y10.push(e17.subarray(v10, v10 + n11)), v10 += n11, b10 += n11;
  }
  return dr(y10, p10, h10, m10, Math.max(8e3, Math.round(b10 * 8 * h10 / (g10 * 1024))));
}
function hr(e17) {
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
    let s10 = mr(o10);
    if (!s10) return e17;
    let c10 = ``;
    for (let e18 = 0; e18 < s10.length; e18 += 32768) c10 += String.fromCharCode(...s10.subarray(e18, e18 + 32768));
    return `data:audio/mp4;base64,${btoa(c10)}`;
  } catch {
    return e17;
  }
}
var gr = null;
var _r = /* @__PURE__ */ new Set();
var vr = 0;
function yr(e17, t10) {
  let n10 = gr;
  if (gr = null, n10) try {
    n10.stop();
  } catch {
  }
  let r10 = { kind: e17, stop: t10 };
  return gr = r10, { release: () => {
    gr === r10 && (gr = null, Cr());
  }, holds: () => gr === r10 };
}
var xr = () => gr?.kind ?? null;
function Sr(e17) {
  gr ? _r.add(e17) : e17();
}
function Cr() {
  _r.size && !vr && typeof window < `u` && (vr = window.setTimeout(() => {
    if (vr = 0, gr) return;
    let e17 = [..._r];
    _r.clear();
    for (let t10 of e17) try {
      t10();
    } catch {
    }
  }, 250));
}
var Dr = `lernheft-audiolog-entries`;
var Or = 1500;
var kr = false;
var Ar = [];
var jr = 0;
var Mr = 0;
function Nr() {
  Mr = 0;
  try {
    sessionStorage.setItem(Dr, JSON.stringify(Ar));
  } catch {
  }
}
function Pr(e17, t10) {
  kr && (Ar.push([Math.round(performance.now() - jr), e17, ...t10 ? [t10] : []]), Ar.length > Or && Ar.splice(0, Ar.length - Or), Mr ||= window.setTimeout(Nr, 1e3));
}
var Fr = () => kr;
var Rr = null;
function zr() {
  try {
    let e17 = window.AudioContext ?? window.webkitAudioContext;
    if (!e17) return null;
    if (!Rr) {
      let t10 = Rr = new e17();
      Pr(`ctx-new`, { state: t10.state, rate: t10.sampleRate }), Fr() && t10.addEventListener?.(`statechange`, () => Pr(`ctx-state`, { state: t10.state, t: +t10.currentTime.toFixed(2), current: t10 === Rr }));
    }
    return (Rr.state === `suspended` || Rr.state === `interrupted`) && Br(Rr, `use`), Rr;
  } catch {
    return null;
  }
}
function Br(e17, t10) {
  let n10 = e17.state, r10 = e17.resume();
  if (!Fr()) {
    r10.catch(() => void 0);
    return;
  }
  let i10 = performance.now();
  Pr(`resume`, { why: t10, from: n10, gesture: navigator.userActivation?.isActive }), r10.then(() => Pr(`resume-done`, { state: e17.state, ms: Math.round(performance.now() - i10) }), (e18) => Pr(`resume-fail`, { name: e18?.name }));
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
function Kr(e17) {
  let t10 = yr(`clip`, qr);
  qr();
  let n10 = zr();
  if (!n10) return t10.release(), Promise.resolve();
  let r10 = Gr(n10, e17);
  return new Promise((e18) => {
    let i10 = false, a10 = () => {
      i10 || (i10 = true, Ur?.done === a10 && (Ur = null), t10.release(), e18());
    };
    r10.then((e19) => {
      if (i10) return;
      if (!e19) return a10();
      let t11 = n10.createBufferSource();
      t11.buffer = e19, t11.connect(n10.destination), t11.onended = a10, Ur = { src: t11, done: a10 }, t11.start(), setTimeout(a10, e19.duration * 1e3 + 600);
    }), Ur ??= { src: null, done: a10 };
  });
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
  !Rr && r10 && typeof e17.canPlayType == `function` && e17.canPlayType(r10) === `` && zr(), fi();
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
      let e18 = hr(t10);
      if (e18 !== t10) {
        d10 = e18, y10(e18);
        return;
      }
    }
    let r11 = zr(), a11 = r11 ? await Gr(r11, d10) : null;
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
    if (Qr === 0 && xr()) {
      Sr($r);
      return;
    }
    e17.type = t10, Pr(`session`, { type: t10 });
  } catch {
  }
}
function ei() {
  Zr = `playback`, $r();
}
var ri = [];
function ai() {
  Pr(`reset`), qr(), Hr.clear();
  let e17 = Rr;
  Rr = null, di = null, mi = false, oi = null;
  for (let e18 of ri) try {
    e18();
  } catch {
  }
  e17 && e17.close().catch(() => void 0), $r();
}
var oi = null;
var si = false;
var ci = -1 / 0;
var yee = 1e4;
function li() {
  if (typeof window < `u` && `speechSynthesis` in window && window.speechSynthesis.speaking) return;
  let e17 = performance.now();
  e17 - ci < yee || (ci = e17, Pr(`auto-reset`), ai());
}
function ui(e17) {
  let t10 = performance.now();
  if (e17.state === `running`) {
    let n10 = oi?.ctx === e17 && t10 - oi.at > 600 && e17.currentTime === oi.t;
    oi = { ctx: e17, t: e17.currentTime, at: t10 }, n10 && (Pr(`clock-stuck`, { t: +e17.currentTime.toFixed(2) }), li());
  } else si || (si = true, setTimeout(() => {
    si = false, Rr === e17 && e17.state !== `running` && (Pr(`not-running-after-tap`, { state: e17.state }), di = e17);
  }, 900));
}
var di = null;
function fi() {
  let e17 = Rr;
  if (!e17) return;
  let t10 = e17.state;
  if (di) {
    let n10 = di === e17 && t10 !== `running`;
    if (di = null, n10) {
      li(), Rr || pi();
      return;
    }
  }
  t10 === `suspended` || t10 === `interrupted` ? Br(e17, `tap`) : t10 === `running` && !mi && pi();
}
function pi() {
  let e17 = zr();
  if (e17 && (ui(e17), !(e17.state !== `running` || mi))) {
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
  let e17 = zr();
  if (!e17) return;
  let t10 = e17.currentTime + 0.02;
  for (let [n10, r10] of [[988, 0], [1319, 0.09], [1760, 0.18]]) {
    let i10 = e17.createOscillator(), a10 = e17.createGain();
    i10.type = `triangle`, i10.frequency.value = n10, a10.gain.setValueAtTime(1e-4, t10 + r10), a10.gain.exponentialRampToValueAtTime(0.22, t10 + r10 + 0.015), a10.gain.exponentialRampToValueAtTime(1e-4, t10 + r10 + 0.35), i10.connect(a10).connect(e17.destination), i10.start(t10 + r10), i10.stop(t10 + r10 + 0.4);
  }
}
function yi() {
  let e17 = zr();
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
    r10.silent || (zr(), pi());
    let i10 = n10.getAttribute(`data-a`);
    i10 && Oi.set(e17, i10);
    let a10 = { node: e17, key: null, note: null, x: 0, y: 0 };
    Di.set(n10, a10), r10.begin?.(), Ni(a10, n10);
  }), e17.addEventListener(`pointerdown`, (t11) => {
    if (t11.button > 0 || !Ei(e17)) return;
    bi.get(e17)?.silent || (zr(), pi()), t11.preventDefault(), Pi(t11.pointerId);
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
var La = { rate: 0.75, pitch: 0.95, tone: `lively` };
var za = 0.5;
var Ba = 1.5;
var Va = 0.6;
var Ha = 1.5;
var Wa = `lernheft-voice`;
var Ga = (e17, t10, n10, r10) => typeof e17 == `number` && Number.isFinite(e17) ? Math.min(n10, Math.max(t10, Math.round(e17 * 100) / 100)) : r10;
function Ka(e17, t10 = La) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {};
  return { rate: Ga(n10.rate, za, Ba, t10.rate), pitch: Ga(n10.pitch, Va, Ha, t10.pitch), tone: n10.tone === `calm` || n10.tone === `lively` || n10.tone === `normal` ? n10.tone : t10.tone };
}
var Ja;
var wee = null;
function Ya() {
  if (Ja === void 0) try {
    let e17 = localStorage.getItem(Wa);
    Ja = e17 ? Ka(JSON.parse(e17)) : null;
  } catch {
    Ja = null;
  }
  return Ja;
}
var Xa = () => Ya() ?? wee ?? La;
function Za(e17, t10) {
  if (t10 === `normal`) return e17;
  if (t10 === `calm`) return e17.replace(/!/g, `.`);
  let n10 = e17.replace(/\.(?=\s|$)/g, `!`);
  return /[.!?…:;,]\s*$/.test(n10) || !n10.trim() ? n10 : `${n10.replace(/\s+$/, ``)}!`;
}
var wo = (e17) => 440 * 2 ** ((e17 - 69) / 12);
var Bo = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/"/g, `&quot;`);
var A = (e17) => Math.round(e17 * 10) / 10;
var j = `Andika, Andika, Verdana, Arial, sans-serif`;
var Vo = (e17, t10) => e17 ? ` class="lh-key" data-a="${t10}"` : ``;
var Ho = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(e17);
function Uo(e17) {
  let t10 = /* @__PURE__ */ new Map(), n10 = /* @__PURE__ */ new Map(), r10 = /* @__PURE__ */ new Map(), i10 = (e18) => (t11) => {
    let n11 = t11 ? e18.assets?.[t11] : void 0;
    return n11 ? e18.assetUrl ? e18.assetUrl(n11) : n11.dataUrl : void 0;
  };
  function a10(e18) {
    return (e18.pics ?? []).map((t11) => {
      let n11 = document.createElement(`img`);
      return n11.className = `lh-ls-pic`, n11.alt = ``, n11.draggable = false, n11.src = t11.src, n11.style.left = `${t11.x / e18.vw * 100}%`, n11.style.top = `${t11.y / e18.vh * 100}%`, n11.style.width = `${t11.w / e18.vw * 100}%`, n11.style.height = `${t11.h / e18.vh * 100}%`, t11.rot && (n11.style.transform = `rotate(${t11.rot}deg)`), t11.dim && (n11.style.opacity = `0.35`), n11;
    });
  }
  function o10(t11, n11) {
    let i11 = e17.view(n11, true, r10.get(n11.id) ?? (() => void 0)), o11 = document.createElement(`div`);
    o11.className = `lh-ls ${e17.cls}`, o11.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${i11.vw} ${i11.vh}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">${i11.body}</svg>`, o11.append(...a10(i11));
    let s11 = t11.querySelector(`:scope > .lh-ls`);
    s11 ? s11.replaceWith(o11) : t11.replaceChildren(o11), t11.setAttribute(`aria-label`, e17.label(n11)), e17.after?.(t11, n11);
  }
  function s10(e18) {
    let r11 = t10.get(e18);
    if (r11) for (let t11 of n10.get(e18) ?? []) t11.isConnected && o10(t11, r11);
  }
  function c10(s11, c11, l10, u10) {
    let d10 = Math.max(1, Math.round(c11.w)), f10 = Math.max(1, Math.round(c11.h)), p10 = !l10 || !!e17.still?.(c11);
    !p10 && u10.assets && r10.set(c11.id, i10(u10));
    let { x: m10, y: h10, ...g10 } = c11, _10 = `${d10}x${f10}|${p10}|${JSON.stringify(g10)}`;
    if (s11.dataset.k === _10) return;
    if (s11.dataset.k = _10, p10) {
      let t11 = e17.view(c11, false, i10(u10)), n11 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t11.vw} ${t11.vh}" width="${d10}" height="${f10}" preserveAspectRatio="xMidYMid meet">${t11.body}</svg>`, r11 = document.createElement(`img`);
      r11.className = `lh-wg-pic`, r11.alt = ``, r11.draggable = false, r11.src = u10.stickerUrl ? u10.stickerUrl(n11) : Ho(n11), r11.style.width = `${d10}px`, r11.style.height = `${f10}px`;
      let o11 = document.createElement(`div`);
      o11.className = `lh-ls ${e17.cls}`, o11.append(r11, ...a10(t11)), s11.replaceChildren(o11), s11.setAttribute(`aria-label`, e17.label(c11));
      return;
    }
    t10.set(c11.id, c11);
    let v10 = n10.get(c11.id);
    v10 || n10.set(c11.id, v10 = /* @__PURE__ */ new Set());
    for (let e18 of v10) e18.isConnected || v10.delete(e18);
    v10.add(s11), s11.dataset.lsId = c11.id, o10(s11, c11), c11.locked && s11.classList.add(`is-armed`), Si(s11, { slide: false, silent: !e17.sounds, hit: (n11) => {
      let r11 = s11.dataset.lsId, i11 = n11.getAttribute(`data-a`);
      return r11 && i11 && t10.has(r11) ? e17.hit?.(r11, i11, n11, s11) ?? null : null;
    } });
  }
  return { draw: c10, redraw: s10, item: (e18) => t10.get(e18), nodes: (e18) => [...n10.get(e18) ?? []].filter((e19) => e19.isConnected), ids: () => [...t10.keys()], src: (e18) => r10.get(e18) ?? (() => void 0) };
}
function Wo(e17) {
  e17 && (e17.classList.remove(`is-nope`), e17.getBoundingClientRect?.(), e17.classList.add(`is-nope`), setTimeout(() => e17.classList.remove(`is-nope`), 500));
}
var Eee = `
.lh-ls{position:absolute;inset:0;overflow:hidden}
.lh-ls>svg{position:absolute;inset:0;display:block}
.lh-ls>.lh-wg-pic{position:absolute;left:0;top:0}
.lh-ls-pic{position:absolute;object-fit:contain;pointer-events:none;-webkit-user-drag:none}
.lh-ls .lh-key{cursor:pointer}
.lh-edit .lh-widget:not(.is-armed) .lh-ls .lh-key{cursor:inherit}
.lh-ls .lh-key.is-down{filter:brightness(.9)}
.lh-ls .is-nope{animation:lh-ls-nope .45s ease-in-out}
.lh-ls .lh-pop{transform-box:fill-box;transform-origin:center;animation:lh-ls-pop .3s ease-out}
@keyframes lh-ls-nope{20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@keyframes lh-ls-pop{from{transform:scale(.5)}60%{transform:scale(1.12)}to{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.lh-ls .is-nope,.lh-ls .lh-pop{animation:none}}`;
function Jo() {
  return typeof window < `u` && `speechSynthesis` in window && typeof SpeechSynthesisUtterance < `u`;
}
var Yo = 0.95;
var Xo = 180;
var Zo = null;
var Qo = null;
var es = 0;
var ts;
var ns = /* @__PURE__ */ new Set();
function rs(e17) {
  let t10 = e17.lang.replace(`_`, `-`).toLowerCase(), n10 = 0;
  return t10 === `de-de` ? n10 += 8 : t10.startsWith(`de`) && (n10 += 4), typeof navigator < `u` && navigator.onLine === false && !e17.localService && (n10 -= 10), /natural|premium|enhanced|neural/i.test(e17.name) && (n10 += 3), /google|anna|petra|helena|katja|marlene|vicki/i.test(e17.name) && (n10 += 1), e17.default && (n10 += 1), n10;
}
function is(e17) {
  let t10 = e17.filter((e18) => /^de([-_]|$)/i.test(e18.lang));
  return t10.length ? t10.sort((e18, t11) => rs(t11) - rs(e18))[0] : null;
}
function as() {
  if (ts !== void 0) return ts;
  let e17 = window.speechSynthesis.getVoices();
  return e17.length && (ts = is(e17)), ts ?? null;
}
function cs() {
  if (ts !== void 0) return Promise.resolve(ts);
  let e17 = window.speechSynthesis, t10 = e17.getVoices();
  return t10.length ? (ts = is(t10), Promise.resolve(ts)) : new Promise((t11) => {
    let n10 = false, r10 = () => {
      if (n10) return;
      n10 = true, e17.removeEventListener?.(`voiceschanged`, i10);
      let r11 = e17.getVoices(), a10 = is(r11);
      r11.length && (ts = a10), t11(a10);
    }, i10 = () => {
      e17.getVoices().length && r10();
    };
    e17.addEventListener?.(`voiceschanged`, i10), setTimeout(r10, 1500);
  });
}
function Aee(e17) {
  let t10 = e17.replace(/\s+/g, ` `).trim();
  if (!t10) return [];
  let n10 = t10.match(/[^.!?…;:]+[.!?…;:]*["»«“”')\]]*\s*/g) ?? [t10], r10 = [], i10 = ``, a10 = (e18) => {
    let t11 = e18.trim();
    t11 && r10.push(t11);
  };
  for (let e18 of n10) if (e18.length > Xo) {
    a10(i10), i10 = ``;
    let t11 = e18;
    for (; t11.length > Xo; ) {
      let e19 = t11.slice(0, Xo), n11 = Math.max(e19.lastIndexOf(`, `), e19.lastIndexOf(` \u2013 `));
      n11 < Xo / 3 && (n11 = e19.lastIndexOf(` `)), n11 < Xo / 3 && (n11 = Xo), a10(t11.slice(0, n11 + 1)), t11 = t11.slice(n11 + 1);
    }
    i10 = t11;
  } else i10.length + e18.length > Xo ? (a10(i10), i10 = e18) : i10 += e18;
  return a10(i10), r10;
}
var ls;
function us() {
  return ls ?? (ps() ? true : void 0);
}
var jee = 2500;
var ds = 2500;
var fs = (e17 = {}) => Math.min(3, Math.max(0.3, Yo * (e17.style ?? Xa()).rate * (e17.rate ?? 1)));
function M(e17, t10, n10 = {}) {
  let r10 = Jo() && (window.speechSynthesis.speaking || window.speechSynthesis.pending), i10 = n10.part ? null : yr(`speech`, ms);
  if (ms(), r10) try {
    window.speechSynthesis.cancel();
  } catch {
  }
  let a10 = ++es;
  return Pr(`speak`, { len: e17.length, text: e17.length <= 24 ? e17 : void 0, rec: !!t10, busy: r10, gesture: navigator.userActivation?.isActive }), new Promise((o10) => {
    let s10 = false, c10 = () => {
    }, l10 = () => {
      s10 || (s10 = true, Zo === c10 && (Zo = null), i10?.release(), o10());
    };
    if (t10 && typeof Audio < `u`) {
      Qo ??= new Audio();
      let e18 = Xr(Qo, t10, { onStart: () => a10 === es && n10.onVoice?.(), onEnd: () => l10() });
      c10 = () => e18.stop(), Zo = c10;
      return;
    }
    if (t10) {
      l10();
      return;
    }
    let u10 = n10.style ?? Xa();
    e17 = Za(e17, u10.tone);
    let d10 = Aee(e17), f10 = e17.replace(/\s+/g, ` `).trim(), p10 = [], m10 = 0;
    for (let e18 of d10) {
      let t11 = f10.indexOf(e18, m10);
      p10.push(t11 < 0 ? m10 : t11), m10 = (t11 < 0 ? m10 : t11) + e18.length;
    }
    if (!Jo() || !d10.length) {
      l10();
      return;
    }
    let h10 = window.speechSynthesis, g10 = 0, _10 = 0;
    c10 = () => {
      clearTimeout(g10), clearTimeout(_10), h10.cancel(), ns.clear(), l10();
    }, Zo = c10;
    let v10 = false, y10 = () => {
      clearTimeout(_10), v10 || a10 !== es || (v10 = true, n10.onVoice?.());
    }, b10 = (e18) => {
      let t11 = 0, r11 = () => {
        if (clearTimeout(g10), s10 || a10 !== es) return;
        if (t11 >= d10.length) {
          l10();
          return;
        }
        let i11 = p10[t11], o11 = d10[t11++], f11 = false, m11 = false, b11 = null, x10 = 0, S10 = (e19) => {
          if (!m11) {
            if (m11 = true, clearTimeout(x10), b11 && ns.delete(b11), Pr(e19 ? `speech-end` : `speech-watchdog`), !e19) try {
              h10.cancel();
            } catch {
            }
            e19 && !f11 && a10 === es && /\S\s+\S/.test(o11) && (ls = false), a10 === es && n10.onPart?.(i11, o11.length, `end`), r11();
          }
        }, C10 = (t12) => {
          let r12 = new SpeechSynthesisUtterance(o11);
          b11 = r12, r12.lang = e18?.lang ?? `de-DE`, e18 && (r12.voice = e18), r12.rate = fs(n10), r12.pitch = Math.min(2, Math.max(0.1, u10.pitch * (n10.pitch ?? 1)));
          let d11 = false;
          r12.onstart = () => {
            Pr(`speech-start`, { stale: a10 !== es, attempt: t12 }), r12 === b11 && (d11 = true, clearTimeout(x10), a10 === es && (n10.onPart?.(i11, o11.length, `start`), us() === true ? v10 || (_10 = window.setTimeout(y10, jee)) : y10()));
          }, r12.onboundary = (e19) => {
            r12 !== b11 || a10 !== es || e19.name && e19.name !== `word` || (f11 = true, ls = true, y10(), n10.onBoundary?.(i11 + e19.charIndex));
          }, r12.onend = () => r12 === b11 && S10(true), r12.onerror = (e19) => {
            ns.delete(r12), Pr(`speech-error`, { error: e19.error, stale: a10 !== es || r12 !== b11 }), r12 === b11 && (m11 || (m11 = true, clearTimeout(x10), a10 !== es || e19.error === `interrupted` || e19.error === `canceled` ? l10() : c10()));
          }, ns.add(r12), clearTimeout(g10), g10 = window.setTimeout(() => S10(false), 4e3 + o11.length * 160), ps() && (x10 = window.setTimeout(() => {
            if (!(d11 || m11 || s10 || a10 !== es)) {
              Pr(`speech-nostart`, { attempt: t12, len: o11.length }), clearTimeout(g10), ns.delete(r12), b11 = null;
              try {
                h10.cancel();
              } catch {
              }
              t12 === 0 ? window.setTimeout(() => !m11 && !s10 && a10 === es && C10(1), 120) : (b11 = r12, S10(false));
            }
          }, ds)), h10.speak(r12), h10.paused && h10.resume();
        };
        C10(0);
      };
      r11();
    };
    if (ps()) r10 ? setTimeout(() => !s10 && a10 === es && b10(null), 80) : b10(null);
    else {
      if (!r10) {
        let e18 = as();
        if (e18 || ts === null) {
          b10(e18), ts === void 0 && cs();
          return;
        }
      }
      cs().then((e18) => {
        s10 || a10 !== es || (r10 ? setTimeout(() => !s10 && a10 === es && b10(e18), 80) : b10(e18));
      });
    }
  });
}
function ps() {
  let e17 = typeof navigator < `u` ? navigator.userAgent : ``;
  return /iPad|iPhone|iPod/.test(e17) || /Macintosh/.test(e17) && `ontouchend` in document || /Safari/.test(e17) && !/Chrome|Chromium|Edg|Firefox/.test(e17);
}
function ms() {
  es++;
  let e17 = Zo;
  Zo = null, e17?.();
}
var Pm = null;
function Fm() {
  let e17 = zr();
  return e17 ? (Pm?.ctx === e17 || (ei(), Pm = Im(e17)), Pm) : null;
}
function Im(e17) {
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
var Lm = [];
var iae = 32;
var Rm = null;
function zm(e17, t10, n10, r10) {
  let i10 = e17.ctx.createGain();
  if (i10.gain.setValueAtTime(n10, t10), Rm) return i10.connect(Rm), { out: i10, stops: [], end: t10 };
  if (i10.connect(e17.dry), r10 > 0) {
    let t11 = e17.ctx.createGain();
    t11.gain.value = r10, i10.connect(t11).connect(e17.wet);
  }
  return { out: i10, stops: [], end: t10 };
}
function Bm(e17, t10, n10, r10, i10, a10, o10, s10 = t10.out, c10 = 1) {
  if (n10 > 16e3 || r10 <= 0) return null;
  let l10 = e17.ctx.createOscillator();
  l10.frequency.setValueAtTime(n10 * c10, i10), c10 !== 1 && l10.frequency.exponentialRampToValueAtTime(n10, i10 + 0.04);
  let u10 = e17.ctx.createGain();
  u10.gain.setValueAtTime(0, i10), u10.gain.linearRampToValueAtTime(r10, i10 + a10), u10.gain.setTargetAtTime(0, i10 + a10, o10), l10.connect(u10).connect(s10);
  let d10 = i10 + a10 + o10 * 7;
  return l10.start(i10), l10.stop(d10), t10.stops.push(l10), t10.end = Math.max(t10.end, d10), l10;
}
function Vm(e17, t10, n10, r10, i10, a10, o10, s10 = `bandpass`, c10 = 0) {
  let l10 = e17.ctx.createBufferSource();
  l10.buffer = e17.noise, l10.loop = o10 * 8 > 0.9;
  let u10 = e17.ctx.createBiquadFilter();
  u10.type = s10, u10.frequency.value = Math.min(16e3, r10), u10.Q.value = i10;
  let d10 = e17.ctx.createGain();
  c10 > 0 ? (d10.gain.setValueAtTime(0, n10), d10.gain.linearRampToValueAtTime(a10, n10 + c10)) : d10.gain.setValueAtTime(a10, n10), d10.gain.setTargetAtTime(0, n10 + c10, o10), l10.connect(u10).connect(d10).connect(t10.out), l10.start(n10), l10.stop(n10 + c10 + o10 * 8), t10.stops.push(l10), t10.end = Math.max(t10.end, n10 + c10 + o10 * 8);
}
var Hm = (e17, t10, n10) => Math.min(n10, Math.max(t10, e17));
function Um(e17, t10, n10, r10, i10) {
  let a10 = zm(e17, n10, i10.level * r10, i10.reverb), o10 = a10.out;
  if (i10.lowpass) {
    let t11 = e17.ctx.createBiquadFilter();
    t11.type = `lowpass`, t11.frequency.value = Math.min(18e3, i10.lowpass), t11.Q.value = 0.4, t11.connect(a10.out), o10 = t11;
  }
  for (let [r11, s11, c10] of i10.parts) Bm(e17, a10, t10 * r11, s11, n10, i10.attack, i10.decay * c10, o10, i10.bend);
  i10.click && Vm(e17, a10, n10, i10.click[0], i10.click[1], i10.click[2] * r10, i10.click[3]);
  let s10 = i10.damp;
  return { v: a10, release: (t11) => {
    if (!s10) return;
    let r11 = t11 ?? e17.ctx.currentTime;
    a10.out.gain.setTargetAtTime(0, Math.max(r11, n10 + 0.02), s10);
    for (let e18 of a10.stops) e18.stop(Math.max(r11, n10 + 0.02) + s10 * 8);
  } };
}
function Wm(e17, t10, n10, r10) {
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
function Gm(e17, t10, n10, r10, i10, a10, o10 = 1) {
  let s10 = e17.ctx.createOscillator();
  s10.type = i10, s10.frequency.setValueAtTime(n10, r10);
  let c10 = e17.ctx.createGain();
  return c10.gain.value = o10, s10.connect(c10).connect(a10), s10.start(r10), t10.stops.push(s10), s10;
}
function Km(e17, t10, n10, r10, i10, a10, o10) {
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
function qm(e17, t10, n10, r10, i10) {
  let a10 = wo(n10);
  switch (t10) {
    case `piano`: {
      let t11 = [];
      return [1, 0.55, 0.32, 0.2, 0.12, 0.08, 0.05].forEach((e18, n11) => {
        let r11 = n11 + 1, i11 = r11 * Math.sqrt(1 + 35e-5 * r11 * r11);
        t11.push([i11, e18, 1 / (1 + 0.45 * n11)]), r11 <= 2 && t11.push([i11 * 1.0011, e18 * 0.35, 1 / (1 + 0.45 * n11)]);
      }), Um(e17, a10, r10, i10, { parts: t11, decay: Hm(3.4 * (261.6 / a10) ** 0.6, 0.45, 6), attack: 3e-3, level: 0.26, reverb: 1, click: [Math.min(a10 * 3, 3500), 1.2, 0.18, 0.012], damp: 0.09, lowpass: a10 * (5 + 9 * i10) });
    }
    case `xylophone`:
      return Um(e17, a10, r10, i10, { parts: [[1, 1, 1], [3, 0.3, 0.45], [6.1, 0.08, 0.25]], decay: Hm(0.5 * (523 / a10) ** 0.4, 0.14, 0.8), attack: 2e-3, level: 0.42, reverb: 0.7, click: [2600, 0.8, 0.28, 6e-3] });
    case `marimba`:
      return Um(e17, a10, r10, i10, { parts: [[1, 1, 1], [3.93, 0.22, 0.35], [9.2, 0.04, 0.2]], decay: Hm(1.1 * (262 / a10) ** 0.4, 0.35, 1.8), attack: 4e-3, level: 0.45, reverb: 0.8, click: [900, 0.7, 0.18, 8e-3], lowpass: a10 * 7 });
    case `glockenspiel`:
      return Um(e17, a10, r10, i10, { parts: [[1, 1, 1], [2.76, 0.45, 0.6], [5.4, 0.22, 0.4], [8.93, 0.12, 0.3]], decay: Hm(2.2 * (1047 / a10) ** 0.3, 0.8, 3.2), attack: 1e-3, level: 0.3, reverb: 1, click: [6e3, 0.7, 0.08, 4e-3] });
    case `musicbox`:
      return Um(e17, a10, r10, i10, { parts: [[1, 1, 1], [2, 0.2, 0.5], [3.01, 0.12, 0.3], [5.9, 0.06, 0.2]], decay: Hm(1.4 * (1047 / a10) ** 0.3, 0.5, 2), attack: 1e-3, level: 0.34, reverb: 1.2 });
    case `tube`:
      return Um(e17, a10, r10, i10, { parts: [[1, 1, 1], [3, 0.07, 0.35]], decay: Hm(0.22 * (262 / a10) ** 0.2, 0.1, 0.32), attack: 3e-3, level: 0.55, reverb: 0.5, click: [a10 * 2, 1, 0.35, 0.01], lowpass: a10 * 6, bend: 1.05 });
    case `organ`: {
      let t11 = zm(e17, r10, 0.15 * (0.6 + 0.4 * i10), 0.9), n11 = Wm(e17, t11, r10, { attack: 0.012, decay: 0.1, sustain: 1, rel: 0.05 }), o10 = t11.env;
      return Km(e17, t11, [[1, 0.9], [2, 0.6], [3, 0.35], [4, 0.3], [6, 0.15], [8, 0.1]].filter(([e18]) => a10 * e18 < 12e3).map(([n12, i11]) => [Gm(e17, t11, a10 * n12, r10, `sine`, o10, i11), a10 * n12]), r10, 6, 3e-3, 0), Vm(e17, t11, r10, 3e3, 0.7, 0.08, 4e-3), { v: t11, release: n11 };
    }
    case `synth`: {
      let t11 = zm(e17, r10, 0.11 * (0.6 + 0.4 * i10), 0.8), n11 = Wm(e17, t11, r10, { attack: 8e-3, decay: 0.2, sustain: 0.65, rel: 0.15 }), o10 = t11.env, s10 = e17.ctx.createBiquadFilter();
      return s10.type = `lowpass`, s10.Q.value = 4, s10.frequency.setValueAtTime(Math.min(16e3, a10 * 12), r10), s10.frequency.setTargetAtTime(Math.min(16e3, a10 * 3 + 400), r10 + 0.01, 0.25), s10.connect(o10), Gm(e17, t11, a10 * 1.004, r10, `sawtooth`, s10), Gm(e17, t11, a10 * 0.996, r10, `sawtooth`, s10), Gm(e17, t11, a10 / 2, r10, `square`, s10, 0.3), { v: t11, release: n11 };
    }
    case `flute`: {
      let t11 = zm(e17, r10, 0.3 * (0.6 + 0.4 * i10), 1), n11 = Wm(e17, t11, r10, { attack: 0.07, decay: 0.2, sustain: 0.85, rel: 0.08 }), o10 = t11.env;
      Km(e17, t11, [[Gm(e17, t11, a10, r10, `sine`, o10), a10], [Gm(e17, t11, a10 * 2, r10, `sine`, o10, 0.12), a10 * 2], [Gm(e17, t11, a10 * 3, r10, `sine`, o10, 0.05), a10 * 3]], r10, 5, 6e-3, 0.3);
      let s10 = e17.ctx.createBufferSource();
      s10.buffer = e17.noise, s10.loop = true;
      let c10 = e17.ctx.createBiquadFilter();
      c10.type = `bandpass`, c10.frequency.value = Math.min(12e3, a10 * 2), c10.Q.value = 2;
      let l10 = e17.ctx.createGain();
      return l10.gain.value = 0.05, s10.connect(c10).connect(l10).connect(o10), s10.start(r10), t11.stops.push(s10), { v: t11, release: n11 };
    }
  }
}
function Jm(e17, t10, n10, r10, i10, a10, o10, s10, c10 = `sine`) {
  let l10 = e17.ctx.createOscillator();
  l10.type = c10, l10.frequency.setValueAtTime(r10, n10), l10.frequency.exponentialRampToValueAtTime(Math.max(20, i10), n10 + a10);
  let u10 = e17.ctx.createGain();
  u10.gain.setValueAtTime(0, n10), u10.gain.linearRampToValueAtTime(o10, n10 + 2e-3), u10.gain.setTargetAtTime(0, n10 + 2e-3, s10), l10.connect(u10).connect(t10.out), l10.start(n10), l10.stop(n10 + s10 * 8), t10.stops.push(l10), t10.end = Math.max(t10.end, n10 + s10 * 8);
}
function Ym(e17, t10, n10, r10, i10, a10, o10, s10) {
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
function aae(e17, t10, n10, r10) {
  let i10 = zm(e17, n10, r10, t10 === `kick` || t10 === `cajonBass` ? 0.08 : 0.35);
  switch (t10) {
    case `kick`:
      Jm(e17, i10, n10, 150, 46, 0.12, 1, 0.14), Vm(e17, i10, n10, 3e3, 0.7, 0.18, 4e-3);
      break;
    case `snare`:
      Jm(e17, i10, n10, 200, 170, 0.05, 0.45, 0.05, `triangle`), Jm(e17, i10, n10, 340, 300, 0.05, 0.25, 0.04, `triangle`), Vm(e17, i10, n10, 1400, 0.5, 0.65, 0.07, `highpass`);
      break;
    case `hihat`:
      Ym(e17, i10, n10, 40, 0.35, 0.035, 1e4, 7e3), Vm(e17, i10, n10, 8e3, 0.5, 0.15, 0.025, `highpass`);
      break;
    case `hihatOpen`:
      Ym(e17, i10, n10, 40, 0.3, 0.25, 1e4, 7e3), Vm(e17, i10, n10, 8e3, 0.5, 0.12, 0.2, `highpass`);
      break;
    case `tom1`:
    case `tom2`:
    case `floortom`: {
      let r11 = t10 === `tom1` ? 210 : t10 === `tom2` ? 160 : 105;
      Jm(e17, i10, n10, r11 * 1.45, r11, 0.16, 0.85, t10 === `floortom` ? 0.3 : 0.23), Jm(e17, i10, n10, r11 * 2.3, r11 * 1.6, 0.12, 0.18, 0.08), Vm(e17, i10, n10, 1500, 0.6, 0.15, 0.02, `lowpass`);
      break;
    }
    case `crash`:
    case `cymbal`:
      Ym(e17, i10, n10, 55, 0.3, t10 === `cymbal` ? 0.9 : 0.7, 8e3, 4e3), Vm(e17, i10, n10, 5e3, 0.4, 0.35, t10 === `cymbal` ? 0.8 : 0.6, `highpass`);
      break;
    case `ride`:
      Ym(e17, i10, n10, 70, 0.18, 0.5, 6e3, 3e3), Bm(e17, i10, 620, 0.12, n10, 2e-3, 0.9), Bm(e17, i10, 1490, 0.08, n10, 2e-3, 0.7);
      break;
    case `clap`:
      for (let t11 of [0, 0.011, 0.022]) Vm(e17, i10, n10 + t11, 1100, 1, 0.7, 6e-3);
      Vm(e17, i10, n10 + 0.033, 1100, 1, 0.55, 0.08);
      break;
    case `cajonBass`:
      Jm(e17, i10, n10, 115, 62, 0.06, 1, 0.12), Vm(e17, i10, n10, 400, 0.7, 0.3, 0.02, `lowpass`);
      break;
    case `cajonSlap`:
      Jm(e17, i10, n10, 360, 320, 0.04, 0.35, 0.04), Vm(e17, i10, n10, 2200, 0.8, 0.8, 0.045), Vm(e17, i10, n10 + 4e-3, 3e3, 0.6, 0.3, 0.09, `highpass`);
      break;
    case `bongoHigh`:
    case `bongoLow`: {
      let r11 = t10 === `bongoHigh` ? 420 : 300;
      Jm(e17, i10, n10, r11 * 1.06, r11, 0.03, 0.85, t10 === `bongoHigh` ? 0.07 : 0.09), Jm(e17, i10, n10, r11 * 1.6, r11 * 1.5, 0.03, 0.15, 0.04), Vm(e17, i10, n10, 3e3, 0.8, 0.2, 8e-3);
      break;
    }
    case `congaHigh`:
    case `congaLow`: {
      let r11 = t10 === `congaHigh` ? 260 : 190;
      Jm(e17, i10, n10, r11 * 1.08, r11, 0.04, 0.9, t10 === `congaHigh` ? 0.14 : 0.18), Jm(e17, i10, n10, r11 * 1.55, r11 * 1.5, 0.04, 0.12, 0.06), Vm(e17, i10, n10, 2200, 0.8, 0.18, 0.01);
      break;
    }
    case `handdrum`:
      Jm(e17, i10, n10, 175, 140, 0.08, 0.8, 0.18), Jm(e17, i10, n10, 260, 235, 0.05, 0.25, 0.09), Vm(e17, i10, n10, 2e3, 0.6, 0.18, 0.015, `lowpass`);
      break;
    case `triangle`:
      for (let [t11, r11] of [[1, 0.5], [1.003, 0.3], [2.03, 0.3], [3.11, 0.2], [4.18, 0.12]]) Bm(e17, i10, 1250 * t11, r11, n10, 1e-3, 1.1);
      Vm(e17, i10, n10, 6e3, 0.6, 0.06, 4e-3);
      break;
    case `tambourine`:
      for (let [t11, r11] of [[0, 7200], [6e-3, 8400], [0.013, 6600], [0.021, 9100], [0.03, 7800]]) Vm(e17, i10, n10 + t11, r11, 3, 0.45, 0.05);
      for (let t11 of [5200, 6150, 7300]) Bm(e17, i10, t11, 0.06, n10, 2e-3, 0.14);
      Jm(e17, i10, n10, 220, 190, 0.03, 0.15, 0.04);
      break;
    case `claves`:
      Bm(e17, i10, 2500, 0.8, n10, 1e-3, 0.045), Bm(e17, i10, 5100, 0.12, n10, 1e-3, 0.02);
      break;
    case `shaker`:
      Vm(e17, i10, n10, 6e3, 1.2, 0.6, 0.05, `bandpass`, 0.025);
      break;
    case `woodblock`:
      Bm(e17, i10, 880, 0.7, n10, 1e-3, 0.05), Bm(e17, i10, 1760, 0.18, n10, 1e-3, 0.025), Vm(e17, i10, n10, 3e3, 0.8, 0.2, 4e-3);
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
function Xm(e17, t10 = {}) {
  let n10 = Fm();
  if (!n10) return;
  let r10 = Math.max(n10.ctx.currentTime + 3e-3, t10.when ?? 0);
  try {
    aae(n10, e17, r10, Hm(t10.vel ?? 0.9, 0.05, 1));
  } catch {
  }
}
function eh(e17, t10, n10 = {}) {
  let r10 = Fm();
  if (!r10) return null;
  let i10 = Math.max(r10.ctx.currentTime + 5e-3, n10.when ?? 0);
  n10.when === void 0 && Pr(`note`, { m: t10, voice: e17, state: r10.ctx.state, t: +r10.ctx.currentTime.toFixed(2) });
  let a10 = Hm(n10.vel ?? 0.85, 0.05, 1), o10;
  try {
    Rm = n10.out ?? null, o10 = qm(r10, e17, t10, i10, a10);
  } catch {
    return null;
  } finally {
    Rm = null;
  }
  let s10 = { v: o10.v, at: i10, release: o10.release };
  for (Lm.push(s10); Lm.length > iae; ) {
    let e18 = Lm.shift(), t11 = r10.ctx.currentTime;
    e18.v.out.gain.setTargetAtTime(0, t11, 0.02);
    for (let n11 of e18.v.stops) n11.stop(t11 + 0.2);
  }
  return o10.v.stops[0]?.addEventListener(`ended`, () => {
    let e18 = Lm.indexOf(s10);
    e18 >= 0 && Lm.splice(e18, 1);
  }), { release: o10.release };
}
function ih() {
  let e17 = Fm();
  return e17 ? { ctx: e17.ctx, out: ah(e17), noise: e17.noise } : null;
}
function ah(e17) {
  let t10 = e17.ctx.createGain();
  t10.connect(e17.dry);
  let n10 = e17.ctx.createGain();
  return n10.gain.value = 0.25, t10.connect(n10).connect(e17.wet), t10;
}
var ch = [{ label: `Musik`, color: `#1c7ed6` }, { label: `Sprache`, color: `#f08c00` }, { label: `Ger\xE4usche`, color: `#2f9e44` }];
var lh = [{ id: `rain`, label: `Regen`, dur: 8, loop: true }, { id: `wind`, label: `Wind`, dur: 8, loop: true }, { id: `thunder`, label: `Donner`, dur: 3.5, loop: false }, { id: `waves`, label: `Meer`, dur: 10, loop: true }, { id: `birds`, label: `V\xF6gel`, dur: 8, loop: true }, { id: `steps`, label: `Schritte`, dur: 4, loop: true }, { id: `knock`, label: `Klopfen`, dur: 1.2, loop: false }, { id: `door`, label: `T\xFCr`, dur: 1.8, loop: false }, { id: `bell`, label: `Glocke`, dur: 3, loop: false }, { id: `clock`, label: `Uhr tickt`, dur: 6, loop: true }, { id: `heart`, label: `Herzschlag`, dur: 6, loop: true }, { id: `magic`, label: `Zauber`, dur: 2.2, loop: false }, { id: `applause`, label: `Applaus`, dur: 4, loop: true }, { id: `fire`, label: `Feuer`, dur: 8, loop: true }];
var dh = (e17) => lh.find((t10) => t10.id === e17);
function gh(e17, t10, n10, r10, i10, a10, o10, s10 = 0.3) {
  let c10 = e17.ctx.createBufferSource();
  c10.buffer = e17.noise, c10.loop = true;
  let l10 = e17.ctx.createBiquadFilter();
  l10.type = r10, l10.frequency.value = i10, l10.Q.value = a10;
  let u10 = e17.ctx.createGain();
  return u10.gain.setValueAtTime(0, t10), u10.gain.linearRampToValueAtTime(o10, t10 + Math.min(s10, n10 / 3)), u10.gain.setValueAtTime(o10, t10 + Math.max(0, n10 - s10)), u10.gain.linearRampToValueAtTime(0, t10 + n10), c10.connect(l10).connect(u10).connect(e17.out), c10.start(t10, Math.random() * 0.5), c10.stop(t10 + n10 + 0.05), e17.stops.push(c10), u10;
}
function _h(e17, t10, n10, r10, i10, a10, o10) {
  let s10 = e17.ctx.createBufferSource();
  s10.buffer = e17.noise;
  let c10 = e17.ctx.createBiquadFilter();
  c10.type = n10, c10.frequency.value = r10, c10.Q.value = i10;
  let l10 = e17.ctx.createGain();
  l10.gain.setValueAtTime(a10, t10), l10.gain.setTargetAtTime(0, t10, o10), s10.connect(c10).connect(l10).connect(e17.out), s10.start(t10, Math.random() * 0.8), s10.stop(t10 + o10 * 8), e17.stops.push(s10);
}
function vh(e17, t10, n10, r10, i10, a10, o10, s10 = `sine`) {
  let c10 = e17.ctx.createOscillator();
  c10.type = s10, c10.frequency.setValueAtTime(n10, t10), c10.frequency.exponentialRampToValueAtTime(Math.max(20, r10), t10 + i10);
  let l10 = e17.ctx.createGain();
  l10.gain.setValueAtTime(0, t10), l10.gain.linearRampToValueAtTime(a10, t10 + 5e-3), l10.gain.setTargetAtTime(0, t10 + 5e-3, o10), c10.connect(l10).connect(e17.out), c10.start(t10), c10.stop(t10 + o10 * 8 + 0.01), e17.stops.push(c10);
}
function yh(e17, t10, n10, r10, i10, a10) {
  let o10 = e17.ctx.createOscillator();
  o10.frequency.value = i10;
  let s10 = e17.ctx.createGain();
  s10.gain.value = a10, o10.connect(s10).connect(t10), o10.start(n10), o10.stop(n10 + r10), e17.stops.push(o10);
}
var bh = (e17, t10) => e17 + Math.random() * (t10 - e17);
function xh(e17, t10, n10, r10) {
  switch (t10) {
    case `rain`:
      gh(e17, n10, r10, `bandpass`, 3e3, 0.4, 0.22, 0.8);
      for (let t11 = n10 + 0.05; t11 < n10 + r10 - 0.1; t11 += bh(0.02, 0.09)) _h(e17, t11, `highpass`, 4e3, 0.7, bh(0.03, 0.12), 6e-3);
      break;
    case `wind`:
      yh(e17, gh(e17, n10, r10, `lowpass`, 600, 1, 0.3, 1.2).gain, n10, r10, 0.18, 0.12);
      break;
    case `thunder`:
      _h(e17, n10, `highpass`, 1500, 0.5, 0.5, 0.06), gh(e17, n10 + 0.05, Math.min(r10, 3.2), `lowpass`, 220, 0.8, 0.8, 0.15), _h(e17, n10 + 0.4, `lowpass`, 400, 0.6, 0.6, 0.5);
      break;
    case `waves`:
      yh(e17, gh(e17, n10, r10, `lowpass`, 900, 0.6, 0.22, 1.5).gain, n10, r10, 0.12, 0.18);
      break;
    case `birds`:
      for (let t11 = n10 + bh(0.1, 0.5); t11 < n10 + r10 - 0.3; t11 += bh(0.5, 1.4)) {
        let n11 = Math.floor(bh(2, 5)), r11 = bh(2400, 3600);
        for (let i10 = 0; i10 < n11; i10++) vh(e17, t11 + i10 * 0.11, r11, r11 * bh(1.2, 1.6), 0.07, 0.12, 0.03);
      }
      break;
    case `steps`:
      for (let t11 = n10 + 0.1; t11 < n10 + r10 - 0.1; t11 += 0.55) vh(e17, t11, 110, 55, 0.08, 0.5, 0.05), _h(e17, t11, `lowpass`, 1200, 0.6, 0.25, 0.03);
      break;
    case `knock`:
      for (let t11 of [0, 0.25, 0.5]) vh(e17, n10 + t11, 200, 120, 0.04, 0.6, 0.04), _h(e17, n10 + t11, `bandpass`, 900, 1, 0.4, 0.02);
      break;
    case `door`: {
      let t11 = e17.ctx.createOscillator();
      t11.type = `sawtooth`, t11.frequency.setValueAtTime(520, n10), t11.frequency.linearRampToValueAtTime(880, n10 + 0.4), t11.frequency.linearRampToValueAtTime(460, n10 + 0.9);
      let r11 = e17.ctx.createBiquadFilter();
      r11.type = `bandpass`, r11.frequency.value = 1500, r11.Q.value = 4;
      let i10 = e17.ctx.createGain();
      i10.gain.setValueAtTime(0, n10), i10.gain.linearRampToValueAtTime(0.18, n10 + 0.1), i10.gain.linearRampToValueAtTime(0, n10 + 1), t11.connect(r11).connect(i10).connect(e17.out), t11.start(n10), t11.stop(n10 + 1.05), e17.stops.push(t11), vh(e17, n10 + 1.1, 90, 50, 0.1, 0.7, 0.08), _h(e17, n10 + 1.1, `lowpass`, 800, 0.7, 0.5, 0.05);
      break;
    }
    case `bell`:
      for (let [t11, r11] of [[1, 0.4], [2.76, 0.18], [5.4, 0.08]]) vh(e17, n10, 523 * t11, 523 * t11, 0.01, r11, 0.8);
      break;
    case `clock`:
      for (let t11 = n10 + 0.05, i10 = 0; t11 < n10 + r10; t11 += 0.5, i10++) vh(e17, t11, i10 % 2 ? 2e3 : 2600, i10 % 2 ? 2e3 : 2600, 0.01, 0.25, 8e-3);
      break;
    case `heart`:
      for (let t11 = n10 + 0.1; t11 < n10 + r10 - 0.3; t11 += 0.85) vh(e17, t11, 70, 45, 0.1, 0.9, 0.06), vh(e17, t11 + 0.2, 60, 40, 0.1, 0.6, 0.05);
      break;
    case `magic`:
      [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96].forEach((t11, r11) => vh(e17, n10 + r11 * 0.09, 440 * 2 ** ((t11 - 69) / 12), 440 * 2 ** ((t11 - 69) / 12), 0.01, 0.12, 0.25, `triangle`)), gh(e17, n10, 1.6, `highpass`, 7e3, 0.5, 0.06, 0.4);
      break;
    case `applause`: {
      let t11 = e17.ctx.createGain();
      t11.gain.setValueAtTime(0, n10), t11.gain.linearRampToValueAtTime(1, n10 + 0.4), t11.gain.setValueAtTime(1, n10 + Math.max(0.4, r10 - 0.8)), t11.gain.linearRampToValueAtTime(0, n10 + r10), t11.connect(e17.out);
      let i10 = { ...e17, out: t11 };
      for (let e18 = n10; e18 < n10 + r10; e18 += bh(0.012, 0.04)) _h(i10, e18, `bandpass`, bh(1200, 3200), 1.2, bh(0.1, 0.3), 0.012);
      break;
    }
    case `fire`:
      gh(e17, n10, r10, `lowpass`, 500, 0.7, 0.18, 0.8);
      for (let t11 = n10 + 0.1; t11 < n10 + r10 - 0.1; t11 += bh(0.05, 0.35)) _h(e17, t11, `highpass`, bh(2500, 6e3), 1, bh(0.08, 0.3), 8e-3);
  }
}
var Rh = `fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
var zh = `fill="#ffffff"`;
var Bh = `<path d="M24 52h52a14 14 0 0 0 0-28 20 20 0 0 0-38-4 15 15 0 0 0-14 32z" ${zh}/>`;
var Vh = { rain: `${Bh}<path d="M32 64l-5 12M50 64l-5 12M68 64l-5 12M41 80l-4 10M59 80l-4 10" ${Rh}/>`, wind: `<path d="M12 36h50a10 10 0 1 0-10-10M12 54h66a11 11 0 1 1-11 11M12 72h36" ${Rh}/>`, thunder: `${Bh}<path d="M54 54L40 74h14L44 94l24-28H54l8-12z" fill="#ffe066" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>`, waves: `<path d="M8 44q10-12 21 0t21 0 21 0 21 0M8 66q10-12 21 0t21 0 21 0 21 0" ${Rh}/>`, birds: `<path d="M12 44q10-12 20 0 10-12 20 0M48 70q9-11 18 0 9-11 18 0M58 30q7-8 14 0 7-8 14 0" ${Rh}/>`, steps: `<ellipse cx="34" cy="62" rx="12" ry="20" ${zh}/><ellipse cx="66" cy="38" rx="12" ry="20" ${zh}/><circle cx="34" cy="34" r="5" ${zh}/><circle cx="66" cy="10" r="5" ${zh}/>`, knock: `<rect x="18" y="10" width="44" height="82" rx="4" ${Rh}/><circle cx="52" cy="54" r="4" ${zh}/><path d="M74 36q8 8 0 16M84 28q14 16 0 32" ${Rh}/>`, door: `<path d="M22 92V12h48v80M14 92h64" ${Rh}/><path d="M70 12l14 8v66l-14 6" ${Rh}/><circle cx="60" cy="54" r="4" ${zh}/>`, bell: `<path d="M50 14a24 24 0 0 0-24 24v20l-8 14h64l-8-14V38a24 24 0 0 0-24-24z" ${zh}/><circle cx="50" cy="82" r="8" ${zh}/><path d="M50 6v8" ${Rh}/>`, clock: `<circle cx="50" cy="52" r="36" ${Rh}/><path d="M50 30v22l14 10" ${Rh}/>`, heart: `<path d="M50 86C20 64 10 48 10 34a20 20 0 0 1 40-8 20 20 0 0 1 40 8c0 14-10 30-40 52z" ${zh}/>`, magic: `<path d="M18 86l44-44" ${Rh}/><path d="M68 10l5 13 13 5-13 5-5 13-5-13-13-5 13-5z" ${zh}/><circle cx="30" cy="30" r="4" ${zh}/><circle cx="84" cy="62" r="4" ${zh}/>`, applause: `<path d="M30 80c-12-12-14-26-6-34l18-18a6 6 0 0 1 9 9l-8 8 20-20a6 6 0 0 1 9 9L58 48l6-6a6 6 0 0 1 9 9L58 66c-8 10-18 18-28 14z" ${zh}/><path d="M78 22l8-8M84 36l10-2M64 12l2-10" ${Rh}/>`, fire: `<path d="M50 92c-20 0-30-14-28-30 2-14 14-20 12-38 14 8 22 20 20 32 4-4 6-10 6-16 10 8 18 20 18 32 0 12-10 20-28 20z" fill="#ffe066"/><path d="M50 92c-9 0-14-6-13-14 1-7 7-10 7-18 8 6 14 12 14 20 0 7-3 12-8 12z" fill="#ff8787"/>` };
var vae = (e17) => Vh[e17];
function yae(e17, t10 = 3.5) {
  let n10 = ih();
  if (!n10) return () => void 0;
  let r10 = dh(e17), i10 = Math.min(t10, r10?.dur ?? 3), a10 = n10.ctx.createGain();
  a10.connect(n10.out);
  let o10 = [], s10 = n10.ctx.currentTime + 0.03;
  xh({ ctx: n10.ctx, out: a10, noise: n10.noise, stops: o10 }, e17, s10, i10), a10.gain.setValueAtTime(1, s10 + Math.max(0, i10 - 0.35)), a10.gain.linearRampToValueAtTime(0, s10 + i10);
  let c10 = window.setTimeout(() => a10.disconnect(), (i10 + 0.5) * 1e3);
  return () => {
    clearTimeout(c10);
    for (let e18 of o10) try {
      e18.stop();
    } catch {
    }
    a10.disconnect();
  };
}
var Hh = (e17) => `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 120 120"><rect x="-10" y="-10" width="120" height="120" rx="18" fill="${ch[2].color}"/>${Vh[e17]}</svg>`);
var Uae = { C: 60, D: 62, E: 64, F: 65, G: 67, A: 69, c: 72, e: 76, g: 79 };
var sg = (e17, t10, n10) => () => t10.forEach((t11, r10) => setTimeout(() => {
  let r11 = eh(e17, Uae[t11] ?? 60, { vel: 0.8 });
  setTimeout(() => r11?.release(), n10 * 0.9);
}, r10 * n10));
var cg = (e17, t10) => () => e17.forEach((e18, n10) => setTimeout(() => Xm(e18, { vel: 0.9 }), n10 * t10));
var lg = `fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"`;
var ug = `fill="#ffffff"`;
var dg = [{ id: `piano`, label: `Klavier`, play: sg(`piano`, [`C`, `E`, `G`, `c`], 260), pic: `<rect x="10" y="26" width="80" height="50" rx="4" ${ug}/>${[22, 34, 52, 64, 76].map((e17) => `<rect x="${e17}" y="26" width="7" height="30" fill="#343a40"/>`).join(``)}<path d="M10 76h80" ${lg}/>` }, { id: `xylophone`, label: `Xylofon`, play: sg(`xylophone`, [`G`, `E`, `G`, `c`], 220), pic: `${[0, 1, 2, 3, 4].map((e17) => `<rect x="${14 + e17 * 15}" y="${24 + e17 * 4}" width="11" height="${56 - e17 * 8}" rx="3" ${ug}/>`).join(``)}<path d="M70 18l14-10" ${lg}/>` }, { id: `glockenspiel`, label: `Glockenspiel`, play: sg(`glockenspiel`, [`c`, `g`, `e`, `c`], 300), pic: `<path d="M12 30h76M12 70h76" ${lg}/>${[0, 1, 2, 3, 4, 5].map((e17) => `<rect x="${16 + e17 * 12}" y="${36 + e17 * 2}" width="8" height="${28 - e17 * 4}" rx="2" ${ug}/>`).join(``)}` }, { id: `flute`, label: `Fl\xF6te`, play: sg(`flute`, [`E`, `G`, `A`, `G`], 330), pic: `<rect x="44" y="6" width="12" height="88" rx="6" ${ug}/>${[24, 36, 48, 60].map((e17) => `<circle cx="50" cy="${e17}" r="3" fill="#343a40"/>`).join(``)}` }, { id: `organ`, label: `Orgel`, play: () => [`C`, `E`, `G`].forEach((e17) => {
  let t10 = eh(`organ`, Uae[e17], { vel: 0.6 });
  setTimeout(() => t10?.release(), 1400);
}), pic: `${[0, 1, 2, 3, 4].map((e17) => `<rect x="${18 + e17 * 14}" y="${14 + Math.abs(2 - e17) * 10}" width="10" height="${72 - Math.abs(2 - e17) * 10}" rx="5" ${ug}/>`).join(``)}` }, { id: `drum`, label: `Trommel`, play: cg([`kick`, `snare`, `kick`, `kick`, `snare`], 230), pic: `<ellipse cx="50" cy="36" rx="34" ry="12" ${ug}/><path d="M16 36v34c0 7 15 12 34 12s34-5 34-12V36" ${lg}/><path d="M26 8l18 22M74 8l-18 22" ${lg}/>` }, { id: `triangle`, label: `Triangel`, play: cg([`triangle`, `triangle`], 600), pic: `<path d="M50 14L84 80H16z" ${lg}/><path d="M70 30l18 30" ${lg}/>` }, { id: `tambourine`, label: `Tamburin`, play: cg([`tambourine`, `tambourine`, `tambourine`], 260), pic: `<circle cx="50" cy="50" r="34" ${lg}/>${[0, 1, 2, 3, 4, 5].map((e17) => `<circle cx="${A(50 + 34 * Math.cos(e17 * 1.047))}" cy="${A(50 + 34 * Math.sin(e17 * 1.047))}" r="6" ${ug}/>`).join(``)}` }, { id: `claves`, label: `Klangh\xF6lzer`, play: cg([`claves`, `claves`, `claves`], 280), pic: `<rect x="14" y="30" width="62" height="12" rx="6" transform="rotate(-20 45 36)" ${ug}/><rect x="24" y="58" width="62" height="12" rx="6" transform="rotate(20 55 64)" ${ug}/>` }, { id: `shaker`, label: `Rassel`, play: cg([`shaker`, `shaker`, `shaker`, `shaker`], 160), pic: `<ellipse cx="44" cy="38" rx="24" ry="28" ${ug}/><path d="M58 60l22 26" ${lg}/>` }, { id: `cymbal`, label: `Becken`, play: cg([`crash`], 0), pic: `<ellipse cx="50" cy="40" rx="40" ry="10" ${ug}/><path d="M50 30v-6M50 50v40M36 90h28" ${lg}/>` }, { id: `cowbell`, label: `Kuhglocke`, play: cg([`cowbell`, `cowbell`], 380), pic: `<path d="M34 20h32l12 60H22z" ${ug}/><path d="M50 8v12" ${lg}/>` }];
var Wae = `#2f9e44`;
var Gae = `#7048e8`;
var Kae = `#1c7ed6`;
var fg = (e17 = `memory`) => ({ mode: e17, set: `fx`, picks: [`rain`, `thunder`, `birds`, `knock`, `bell`, `clock`], own: [] });
function pg(e17, t10, n10) {
  let r10 = e17 && typeof e17 == `object` ? e17 : {}, i10 = r10.set === `instruments` || r10.set === `own` ? r10.set : `fx`, a10 = i10 === `fx` ? lh.map((e18) => e18.id) : dg.map((e18) => e18.id), o10 = (Array.isArray(r10.picks) ? r10.picks : []).filter((e18, t11, n11) => typeof e18 == `string` && a10.includes(e18) && n11.indexOf(e18) === t11).slice(0, 8), s10 = (Array.isArray(r10.own) ? r10.own : []).slice(0, 8).flatMap((e18) => {
    let r11 = e18 && typeof e18 == `object` ? e18 : {}, i11 = n10(r11.sound), a11 = t10(r11.img);
    return i11 ? [{ label: typeof r11.label == `string` ? r11.label.slice(0, 30) : ``, sound: i11, ...a11 ? { img: a11 } : {} }] : [];
  });
  return { mode: r10.mode === `quiz` ? `quiz` : `memory`, set: i10, picks: o10.length ? o10 : i10 === `instruments` ? [`piano`, `drum`, `triangle`, `flute`] : i10 === `fx` ? fg().picks : [], own: s10 };
}
function Jae(e17, t10) {
  return e17.set === `own` ? e17.own.map((e18, n10) => ({ key: `o${n10}`, label: e18.label, color: Kae, img: e18.img, url: t10(e18.sound) })) : e17.set === `instruments` ? e17.picks.flatMap((e18) => {
    let t11 = dg.find((t12) => t12.id === e18);
    return t11 ? [{ key: e18, label: t11.label, color: Gae, pic: t11.pic, inst: e18 }] : [];
  }) : e17.picks.flatMap((e18) => {
    let t11 = lh.find((t12) => t12.id === e18);
    return t11 ? [{ key: e18, label: t11.label, color: Wae, pic: vae(t11.id), fx: t11.id }] : [];
  });
}
var mg = null;
function hg(e17) {
  mg?.(), mg = null, e17.fx ? mg = yae(e17.fx, 3.5) : e17.inst ? dg.find((t10) => t10.id === e17.inst)?.play() : e17.url && (Kr(e17.url), mg = qr);
}
var gg = /* @__PURE__ */ new Map();
var _g = (e17) => {
  let t10 = [...e17];
  for (let e18 = t10.length - 1; e18 > 0; e18--) {
    let n10 = Math.floor(Math.random() * (e18 + 1));
    [t10[e18], t10[n10]] = [t10[n10], t10[e18]];
  }
  return t10;
};
function Yae(e17, t10) {
  return _g([t10, ..._g(Array.from({ length: e17 }, (e18, t11) => t11).filter((e18) => e18 !== t10)).slice(0, Math.min(3, e17 - 1))]);
}
function Xae(e17, t10) {
  let n10 = pg(e17.listen, (e18) => typeof e18 == `string` ? e18 : void 0, (e18) => typeof e18 == `string` ? e18 : void 0), r10 = gg.get(e17.id), i10 = n10.mode === `memory` ? t10 * 2 : t10;
  if (!r10 || r10.order.length !== i10) {
    let i11 = n10.mode === `memory` ? _g([...Array.from({ length: t10 }, (e18, t11) => t11), ...Array.from({ length: t10 }, (e18, t11) => t11)]) : _g(Array.from({ length: t10 }, (e18, t11) => t11));
    gg.set(e17.id, r10 = { order: i11, open: null, found: /* @__PURE__ */ new Set(), last: null, tries: 0, round: 0, choices: t10 ? Yae(t10, i11[0]) : [], firstTry: 0, missed: false });
  }
  return r10;
}
var Zae = (e17, t10, n10, r10) => `<g transform="translate(${A(e17 - n10 / 2)} ${A(t10 - n10 / 2)}) scale(${A(n10 / 100)})"><path d="M30 40a22 22 0 1 1 44 0c0 14-10 18-14 26-3 6-2 16-12 18-8 1-12-6-12-6" fill="none" stroke="${r10}" stroke-width="9" stroke-linecap="round"/><path d="M42 40a10 10 0 1 1 20 0c0 6-6 8-8 12" fill="none" stroke="${r10}" stroke-width="8" stroke-linecap="round"/></g>`;
function Qae(e17, t10, n10, r10, i10, a10, o10, s10 = true) {
  let c10 = `<rect x="${A(t10)}" y="${A(n10)}" width="${A(r10)}" height="${A(i10)}" rx="16" fill="${e17.color}"/>`, l10 = Math.min(r10, i10 - (s10 ? 40 : 0)) * 0.78, u10 = t10 + (r10 - l10) / 2, d10 = n10 + (i10 - (s10 ? 40 : 0) - l10) / 2 + 4;
  return e17.img && o10(e17.img) ? (c10 += `<rect x="${A(u10 - 6)}" y="${A(d10 - 6)}" width="${A(l10 + 12)}" height="${A(l10 + 12)}" rx="12" fill="#ffffff"/>`, a10.push({ src: o10(e17.img), x: u10, y: d10, w: l10, h: l10 })) : e17.pic && (c10 += `<g transform="translate(${A(u10)} ${A(d10)}) scale(${A(l10 / 100)})">${e17.pic}</g>`), s10 && (c10 += `<text x="${A(t10 + r10 / 2)}" y="${A(n10 + i10 - 14)}" text-anchor="middle" font-family="${j}" font-size="${A(Math.min(28, r10 * 0.15))}" font-weight="700" fill="#ffffff">${Bo(e17.label)}</text>`), c10;
}
function $ae(e17, t10, n10) {
  let r10 = pg(e17.listen, (e18) => typeof e18 == `string` ? e18 : void 0, (e18) => typeof e18 == `string` ? e18 : void 0), i10 = Jae(r10, n10), a10 = Math.max(400, e17.w), o10 = Math.max(300, e17.h), s10 = t10 && i10.length ? Xae(e17, i10.length) : null, c10 = [], l10 = `<rect x="0" y="0" width="${a10}" height="${o10}" rx="20" fill="#f8f9fa" stroke="#ced4da" stroke-width="3"/>`;
  if (!i10.length) return { body: l10 + `<text x="${a10 / 2}" y="${o10 / 2}" text-anchor="middle" font-family="${j}" font-size="28" fill="#868e96">Noch keine Ger\xE4usche \u2013 tippe auf \u201EEinstellen\u201C.</text>`, vw: a10, vh: o10 };
  if (r10.mode === `memory`) {
    l10 += `<text x="30" y="56" font-family="${j}" font-size="36" font-weight="700" fill="#1f2937">H\xF6r-Memory: Finde die Paare!</text>`, s10 && (l10 += `<text x="${a10 - 30}" y="56" text-anchor="end" font-family="${j}" font-size="28" fill="#495057">${s10.tries === 1 ? `1 Versuch` : `${s10.tries} Versuche`}</text>`);
    let e18 = i10.length * 2, r11 = Math.ceil(Math.sqrt(e18 * ((a10 - 40) / (o10 - 100))));
    r11 = Math.max(2, Math.min(e18, r11));
    let u11 = Math.ceil(e18 / r11), d11 = (a10 - 40 - (r11 - 1) * 16) / r11, f11 = Math.min((o10 - 100 - (u11 - 1) * 16) / u11, d11 * 1.1), p11 = 84 + (o10 - 100 - u11 * f11 - (u11 - 1) * 16) / 2;
    return (s10?.order ?? Array.from({ length: e18 }, (e19, t11) => t11 % i10.length)).forEach((e19, a11) => {
      let o11 = 20 + a11 % r11 * (d11 + 16), u12 = p11 + Math.floor(a11 / r11) * (f11 + 16), m11 = s10?.found.has(a11), h11 = s10?.open === a11 || s10?.last === a11;
      l10 += `<g${Vo(t10, `c:${a11}`)}${m11 ? ` class="lh-pop"` : ``}>`, l10 += m11 ? Qae(i10[e19], o11, u12, d11, f11, c10, n10) : `<rect x="${A(o11)}" y="${A(u12)}" width="${A(d11)}" height="${A(f11)}" rx="16" fill="${h11 ? `#fff3bf` : `#ffffff`}" stroke="${h11 ? `#f08c00` : `#adb5bd`}" stroke-width="${h11 ? 6 : 3}"/>${Zae(o11 + d11 / 2, u12 + f11 / 2, Math.min(d11, f11) * 0.6, h11 ? `#f08c00` : `#868e96`)}`, l10 += `</g>`;
    }), s10 && s10.found.size === e18 && (l10 += `<g class="lh-pop"><rect x="${a10 / 2 - 240}" y="${o10 / 2 - 70}" width="480" height="150" rx="26" fill="#2f9e44" opacity="0.95"/><text x="${a10 / 2}" y="${o10 / 2 - 10}" text-anchor="middle" font-family="${j}" font-size="40" font-weight="700" fill="#fff">Alle Paare! ${s10.tries} Versuche</text><g${Vo(t10, `again`)}><rect x="${a10 / 2 - 110}" y="${o10 / 2 + 14}" width="220" height="52" rx="26" fill="#fff"/><text x="${a10 / 2}" y="${o10 / 2 + 49}" text-anchor="middle" font-family="${j}" font-size="28" font-weight="700" fill="#2f9e44">Nochmal</text></g></g>`), { body: l10, vw: a10, vh: o10, pics: c10 };
  }
  l10 += `<text x="30" y="56" font-family="${j}" font-size="36" font-weight="700" fill="#1f2937">Was h\xF6rst du?</text>`;
  let u10 = s10 && s10.round >= i10.length;
  if (s10 && !u10 && (l10 += `<text x="${a10 - 30}" y="56" text-anchor="end" font-family="${j}" font-size="28" fill="#495057">${s10.round + 1} von ${i10.length}</text>`), u10) return l10 += `<text x="${a10 / 2}" y="${o10 / 2 - 20}" text-anchor="middle" font-family="${j}" font-size="44" font-weight="700" fill="#2f9e44">Geschafft! ${s10.firstTry} von ${i10.length} gleich richtig.</text>`, l10 += `<g${Vo(t10, `again`)}><rect x="${a10 / 2 - 120}" y="${o10 / 2 + 20}" width="240" height="64" rx="32" fill="#1c7ed6"/><text x="${a10 / 2}" y="${o10 / 2 + 62}" text-anchor="middle" font-family="${j}" font-size="30" font-weight="700" fill="#fff">Nochmal</text></g>`, { body: l10, vw: a10, vh: o10, pics: c10 };
  let d10 = Math.min(80, o10 * 0.12), f10 = 90 + d10;
  l10 += `<g${Vo(t10, `play`)}><title>Anh\xF6ren</title><circle cx="${a10 / 2}" cy="${A(f10)}" r="${A(d10)}" fill="#f08c00"/>${Zae(a10 / 2, f10, d10 * 1.2, `#ffffff`)}</g>`, l10 += `<text x="${a10 / 2}" y="${A(f10 + d10 + 38)}" text-anchor="middle" font-family="${j}" font-size="26" fill="#495057">Tippe auf das Ohr, dann auf das richtige Bild.</text>`;
  let p10 = s10?.choices ?? i10.slice(0, 4).map((e18, t11) => t11), m10 = f10 + d10 + 64, h10 = Math.min(260, (a10 - 60 - (p10.length - 1) * 24) / p10.length), g10 = Math.min(o10 - m10 - 20, h10 * 1.12), _10 = a10 / 2 - (p10.length * h10 + (p10.length - 1) * 24) / 2;
  return p10.forEach((e18, r11) => l10 += `<g${Vo(t10, `a:${e18}`)}>${Qae(i10[e18], _10 + r11 * (h10 + 24), m10, h10, g10, c10, n10)}</g>`), { body: l10, vw: a10, vh: o10, pics: c10 };
}
function eoe(e17) {
  return pg(e17.listen, (e18) => typeof e18 == `string` ? e18 : void 0, (e18) => typeof e18 == `string` ? e18 : void 0).mode === `memory` ? `H\xF6r-Memory: Tippe auf die Karten und finde die Paare, die gleich klingen.` : `Was h\xF6rst du? Tippe auf das Ohr und dann auf das richtige Bild.`;
}
var vg = Uo({ cls: `lh-ct-listen`, view: $ae, label: eoe, sounds: true, hit(e17, t10, n10) {
  let r10 = vg.item(e17);
  if (!r10) return;
  let i10 = pg(r10.listen, (e18) => typeof e18 == `string` ? e18 : void 0, (e18) => typeof e18 == `string` ? e18 : void 0), a10 = Jae(i10, vg.src(e17));
  if (!a10.length) return;
  let o10 = Xae(r10, a10.length);
  if (t10 === `again`) gg.delete(e17), vg.redraw(e17);
  else if (i10.mode === `memory` && t10.startsWith(`c:`)) {
    let n11 = Number(t10.slice(2));
    if (o10.found.has(n11) || o10.open === n11) {
      hg(a10[o10.order[n11]]);
      return;
    }
    if (hg(a10[o10.order[n11]]), o10.open === null) o10.open = n11, o10.last = null;
    else {
      let t11 = o10.open;
      o10.tries++, o10.open = null, o10.order[n11] === o10.order[t11] ? (o10.found.add(n11), o10.found.add(t11), o10.last = null, setTimeout(() => {
        vi(), M(a10[o10.order[n11]].label), o10.found.size === o10.order.length && M(`Alle Paare gefunden! Mit ${o10.tries} Versuchen.`);
      }, 1300)) : (o10.last = n11, setTimeout(() => {
        o10.last === n11 && (o10.last = null, vg.redraw(e17));
      }, 2200));
    }
    vg.redraw(e17);
  } else if (i10.mode === `quiz`) {
    let r11 = o10.order[o10.round];
    t10 === `play` && r11 !== void 0 ? hg(a10[r11]) : t10.startsWith(`a:`) && r11 !== void 0 && (Number(t10.slice(2)) === r11 ? (mg?.(), o10.missed || o10.firstTry++, vi(), M(`Richtig: ${a10[r11].label}!`), o10.round++, o10.missed = false, o10.round < a10.length && (o10.choices = Yae(a10.length, o10.order[o10.round])), vg.redraw(e17)) : (o10.missed = true, yi(), Wo(n10)));
  }
} });
var toe = vg.draw;
function yg(e17) {
  gg.delete(e17), vg.redraw(e17);
}
function noe() {
  mg?.(), mg = null;
}
var TOOLS_CSS = Eee;
export { toe as renderListen, eoe as listenLabel, pg as listenConfig, yg as resetListen, noe as stopListen, lh as LISTEN_SOUNDS, dg as LISTEN_INSTRUMENTS, yae as playListenSound, Hh as listenSoundPicture, TOOLS_CSS };
