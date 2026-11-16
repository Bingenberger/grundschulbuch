/* eslint-disable */
// @ts-nocheck
// Generated from Lernsachen-Heft-komplett.html (1.47.3) by scripts/extract-tools-reference.mjs:
// the tools drawn by the reference's tool host, unchanged (page lookup: see the script).
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
var gi = null;
function _i() {
  pi();
  let e17 = zr();
  if (e17) try {
    if (!gi || gi.sampleRate !== e17.sampleRate) {
      let t11 = Math.round(e17.sampleRate * 0.03);
      gi = e17.createBuffer(1, t11, e17.sampleRate);
      let n11 = gi.getChannelData(0);
      for (let e18 = 0; e18 < t11; e18++) n11[e18] = (Math.random() * 2 - 1) * (1 - e18 / t11) ** 3;
    }
    let t10 = e17.currentTime, n10 = e17.createBufferSource();
    n10.buffer = gi;
    let r10 = e17.createBiquadFilter();
    r10.type = `bandpass`, r10.frequency.value = 2600, r10.Q.value = 1.2;
    let i10 = e17.createGain();
    i10.gain.setValueAtTime(0.18, t10), i10.gain.exponentialRampToValueAtTime(1e-4, t10 + 0.028), n10.connect(r10).connect(i10).connect(e17.destination), n10.start(t10), n10.stop(t10 + 0.035);
  } catch {
  }
}
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
var Dee = /* @__PURE__ */ new Set([...`iljtfr.,:;!|'()[] `]);
var Oee = /* @__PURE__ */ new Set([...`mwMW\xC4\xD6\xDCOQGDHNU@%`]);
function Go(e17, t10) {
  let n10 = 0;
  for (let t11 of e17) n10 += Dee.has(t11) ? 0.34 : Oee.has(t11) ? 0.86 : t11 >= `A` && t11 <= `Z` ? 0.7 : 0.58;
  return n10 * t10;
}
function Ko(e17, t10, n10, r10, i10 = 12, a10 = 4) {
  let o10 = e17.split(/\s+/).filter(Boolean);
  if (!o10.length) return { lines: [], size: r10 };
  for (let e18 = r10; ; e18 = Math.max(i10, Math.floor(e18 * 0.9))) {
    let r11 = [], s10 = ``;
    for (let n11 of o10) {
      let i11 = s10 ? `${s10} ${n11}` : n11;
      s10 && Go(i11, e18) > t10 ? (r11.push(s10), s10 = n11) : s10 = i11;
    }
    if (s10 && r11.push(s10), r11.length <= a10 && r11.length * e18 * 1.2 <= n10 && r11.every((n11) => Go(n11, e18) <= t10) || e18 <= i10) return { lines: r11.slice(0, a10), size: e18 };
  }
}
function qo(e17, t10, n10, r10, i10 = ``, a10 = `middle`) {
  if (!e17.length) return ``;
  let o10 = r10 * 1.2, s10 = n10 - (e17.length - 1) * o10 / 2 + r10 * 0.36;
  return `<text x="${A(t10)}" y="${A(s10)}" text-anchor="${a10}" font-family="${j}" font-size="${A(r10)}" ${i10}>${e17.map((e18, n11) => `<tspan x="${A(t10)}" dy="${n11 ? A(o10) : 0}">${Bo(e18)}</tspan>`).join(``)}</text>`;
}
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
var Os = [`#e03131`, `#1c7ed6`, `#2f9e44`, `#f08c00`, `#7048e8`, `#d6336c`, `#0c8599`, `#795548`];
var ks = () => ({ title: `Was essen wir am liebsten?`, cats: [{ label: `Apfel`, color: Os[0] }, { label: `Banane`, color: Os[3] }, { label: `Birne`, color: Os[2] }], counts: [0, 0, 0], view: `both` });
function As(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (Array.isArray(n10.cats) ? n10.cats : []).slice(0, 12).map((e18, n11) => {
    let r11 = e18 && typeof e18 == `object` ? e18 : {}, i11 = t10(r11.img);
    return { label: typeof r11.label == `string` ? r11.label.slice(0, 40) : ``, color: typeof r11.color == `string` && /^#[0-9a-f]{6}$/i.test(r11.color) ? r11.color : Os[n11 % Os.length], ...i11 ? { img: i11 } : {} };
  }), i10 = r10.map((e18, t11) => {
    let r11 = Array.isArray(n10.counts) ? Number(n10.counts[t11]) : 0;
    return Number.isFinite(r11) ? Math.max(0, Math.min(40, Math.round(r11))) : 0;
  });
  return { title: typeof n10.title == `string` ? n10.title.slice(0, 80) : ``, cats: r10.length ? r10 : ks().cats, counts: r10.length ? i10 : [0, 0, 0], view: n10.view === `tally` || n10.view === `bars` ? n10.view : `both` };
}
var Ms = /* @__PURE__ */ new Map();
var Ns = null;
function Ps(e17) {
  Ns = e17;
}
function Fs(e17) {
  let t10 = As(e17.tally, (e18) => typeof e18 == `string` ? e18 : void 0), n10 = JSON.stringify(t10.counts), r10 = Ms.get(e17.id);
  return r10 && r10.saved === n10 || Ms.set(e17.id, r10 = { saved: n10, n: [...t10.counts] }), r10.n;
}
function Is(e17, t10) {
  Ns?.(e17, [...t10]);
}
function Ls(e17, t10, n10, r10, i10) {
  let a10 = ``, o10 = r10 * 0.22, s10 = o10 * 4 + r10 * 0.5;
  for (let c10 = 0; c10 * 5 < e17; c10++) {
    let l10 = t10 + c10 * s10, u10 = Math.min(5, e17 - c10 * 5);
    for (let e18 = 0; e18 < Math.min(4, u10); e18++) a10 += `<line x1="${A(l10 + e18 * o10)}" y1="${A(n10 - r10 / 2)}" x2="${A(l10 + e18 * o10 + 2)}" y2="${A(n10 + r10 / 2)}" stroke="${i10}" stroke-width="${A(r10 * 0.09)}" stroke-linecap="round"/>`;
    u10 === 5 && (a10 += `<line x1="${A(l10 - o10 * 0.6)}" y1="${A(n10 + r10 * 0.32)}" x2="${A(l10 + o10 * 3.6)}" y2="${A(n10 - r10 * 0.32)}" stroke="${i10}" stroke-width="${A(r10 * 0.09)}" stroke-linecap="round"/>`);
  }
  return a10;
}
var Rs = (e17) => e17 * 0.22 * 4 + e17 * 0.5;
function zs(e17, t10, n10) {
  let r10 = As(e17.tally, (e18) => typeof e18 == `string` ? e18 : void 0), i10 = t10 ? Fs(e17) : r10.counts, a10 = Math.max(300, e17.w), o10 = Math.max(200, e17.h), s10 = [], c10 = `<rect x="0" y="0" width="${a10}" height="${o10}" rx="18" fill="#ffffff" stroke="#ced4da" stroke-width="3"/>`, l10 = r10.title ? 84 : 20;
  if (r10.title) {
    let e18 = Ko(r10.title, a10 - 80, 70, 42, 18, 1);
    c10 += qo(e18.lines, a10 / 2, 46, e18.size, `font-weight="700" fill="#1f2937"`);
  }
  let u10 = r10.cats.length, d10 = Math.min(170, (o10 - l10 - 20) / u10), f10 = l10 + (o10 - l10 - 20 - u10 * d10) / 2, p10 = Math.min(300, a10 * 0.24), m10 = t10 ? Math.min(64, d10 * 0.7) : 0, h10 = 20 + p10 + 16, g10 = a10 - h10 - 20 - 64 - (m10 ? m10 * 2 + 28 : 0), _10 = r10.view === `both` && g10 >= 420, v10 = r10.view !== `bars`, y10 = r10.view === `bars` || _10, b10 = v10 ? y10 ? g10 * 0.45 : g10 : 0, x10 = h10 + b10 + (b10 ? 24 : 0), S10 = h10 + g10 - x10, C10 = Math.max(5, ...i10);
  return r10.cats.forEach((e18, r11) => {
    let o11 = f10 + r11 * d10, l11 = o11 + d10 / 2;
    r11 && (c10 += `<line x1="20" y1="${A(o11)}" x2="${a10 - 20}" y2="${A(o11)}" stroke="#e9ecef" stroke-width="2"/>`);
    let u11 = Math.min(d10 - 16, 110);
    c10 += `<rect x="24" y="${A(l11 - u11 / 2)}" width="12" height="${A(u11)}" rx="6" fill="${e18.color}"/>`;
    let _11 = 48;
    e18.img && (s10.push({ src: n10(e18.img) ?? ``, x: _11, y: l11 - u11 / 2, w: u11, h: u11 }), _11 += u11 + 10);
    let w10 = Ko(e18.label, 20 + p10 - _11, d10 - 10, Math.min(36, d10 * 0.36), 12, 2);
    if (c10 += qo(w10.lines, _11, l11, w10.size, `fill="#1f2937" font-weight="700"`, `start`), v10) {
      let e19 = Math.min(d10 * 0.62, 70), t11 = Rs(e19), n11 = Math.min(1, b10 / Math.max(t11, Math.ceil(i10[r11] / 5) * t11));
      c10 += Ls(i10[r11], h10 + 8, l11, e19 * n11, `#343a40`);
    }
    if (y10) {
      let t11 = S10 * (i10[r11] / C10), n11 = Math.min(d10 * 0.6, 80);
      c10 += `<rect x="${A(x10)}" y="${A(l11 - n11 / 2)}" width="${A(S10)}" height="${A(n11)}" rx="8" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>`, i10[r11] && (c10 += `<rect x="${A(x10)}" y="${A(l11 - n11 / 2)}" width="${A(Math.max(12, t11))}" height="${A(n11)}" rx="8" fill="${e18.color}"/>`);
    }
    let T10 = Math.min(40, d10 * 0.4);
    if (c10 += `<text x="${A(h10 + g10 + 64 - 6)}" y="${A(l11 + T10 * 0.36)}" text-anchor="end" font-family="${j}" font-size="${A(T10)}" font-weight="700" fill="#1f2937">${i10[r11]}</text>`, m10) {
      let n11 = a10 - 20 - m10 * 2 - 14;
      c10 += `<g${Vo(t10, `m:${r11}`)}><title>${e18.label} weniger</title><circle cx="${A(n11 + m10 / 2)}" cy="${A(l11)}" r="${A(m10 / 2)}" fill="#f1f3f5" stroke="#868e96" stroke-width="3"/><path d="M${A(n11 + m10 * 0.28)} ${A(l11)}h${A(m10 * 0.44)}" stroke="#495057" stroke-width="${A(m10 * 0.1)}" stroke-linecap="round"/></g>`;
      let i11 = a10 - 20 - m10;
      c10 += `<g${Vo(t10, `p:${r11}`)}><title>${e18.label} dazu</title><circle cx="${A(i11 + m10 / 2)}" cy="${A(l11)}" r="${A(m10 / 2)}" fill="${e18.color}"/><path d="M${A(i11 + m10 * 0.26)} ${A(l11)}h${A(m10 * 0.48)}M${A(i11 + m10 / 2)} ${A(l11 - m10 * 0.24)}v${A(m10 * 0.48)}" stroke="#fff" stroke-width="${A(m10 * 0.11)}" stroke-linecap="round"/></g>`;
    }
  }), { body: c10, vw: a10, vh: o10, pics: s10.filter((e18) => e18.src) };
}
var Bs = (e17) => e17 === 1 ? `einmal` : `${e17}-mal`;
function Vs(e17) {
  let t10 = As(e17.tally, (e18) => typeof e18 == `string` ? e18 : void 0), n10 = Ms.get(e17.id)?.n ?? t10.counts, r10 = n10.reduce((e18, t11) => e18 + t11, 0), i10 = t10.title ? `${t10.title} ` : `Strichliste. `;
  if (!r10) return `${i10}Noch keine Striche.`;
  let a10 = Math.max(...n10), o10 = t10.cats.filter((e18, t11) => n10[t11] === a10).map((e18) => e18.label);
  return `${i10}${t10.cats.map((e18, t11) => `${e18.label}: ${Bs(n10[t11])}`).join(`, `)}. ${o10.length === 1 ? `Am meisten: ${o10[0]}.` : `Gleich viele: ${o10.join(` und `)}.`} Zusammen ${r10}.`;
}
var Hs = Uo({ cls: `lh-ct-tally`, view: zs, label: Vs, sounds: true, hit(e17, t10) {
  let n10 = Hs.item(e17);
  if (!n10) return;
  let r10 = Fs(n10), i10 = Number(t10.slice(2));
  i10 >= 0 && i10 < r10.length && (r10[i10] = t10.startsWith(`p:`) ? Math.min(40, r10[i10] + 1) : Math.max(0, r10[i10] - 1), _i(), t10.startsWith(`p:`) && r10[i10] % 5 == 0 && vi(), Is(e17, r10), Hs.redraw(e17));
} });
var Us = Hs.draw;
function Ws(e17, t10) {
  let n10 = e17.closest(`.lh-page, .interaction-surface, .paper`) ?? e17.parentElement;
  if (!n10) return false;
  for (let e18 of n10.querySelectorAll(`.lh-wg-tally`)) {
    let n11 = e18.dataset.lsId, r10 = n11 ? Hs.item(n11) : void 0;
    if (!r10 || !n11) continue;
    let i10 = As(r10.tally, (e19) => typeof e19 == `string` ? e19 : void 0).cats.findIndex((e19) => e19.label.trim().toLowerCase() === t10.trim().toLowerCase());
    if (i10 < 0) continue;
    let a10 = Fs(r10);
    return a10[i10] = Math.min(40, a10[i10] + 1), Is(n11, a10), Hs.redraw(n11), true;
  }
  return false;
}
var Ks = [`#e03131`, `#f08c00`, `#fab005`, `#40c057`, `#15aabf`, `#1c7ed6`, `#7048e8`, `#d6336c`, `#20c997`, `#845ef7`, `#ff922b`, `#74b816`];
var qs = (e17 = `wheel`) => ({ mode: e17, fields: [`Apfel`, `Banane`, `Birne`, `Kiwi`, `Orange`, `Traube`].map((e18, t10) => ({ label: e18, color: Ks[t10 * 2 % Ks.length] })), dice: 1, faces: `dots`, noRepeat: false, count: true, auto: true });
function Js(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = (Array.isArray(t10.fields) ? t10.fields : []).slice(0, 12).map((e18, t11) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {};
    return { label: typeof n11.label == `string` ? n11.label.slice(0, 30) : ``, color: typeof n11.color == `string` && /^#[0-9a-f]{6}$/i.test(n11.color) ? n11.color : Ks[t11 % Ks.length] };
  });
  return { mode: t10.mode === `dice` ? `dice` : `wheel`, fields: n10.length >= 2 ? n10 : qs().fields, dice: t10.dice === 2 ? 2 : 1, faces: t10.faces === `numbers` ? `numbers` : `dots`, noRepeat: t10.noRepeat === true, count: t10.count !== false, auto: t10.auto !== false };
}
var Ys = /* @__PURE__ */ new Map();
var Xs = (e17) => {
  let t10 = Ys.get(e17);
  return t10 || Ys.set(e17, t10 = { rot: 0, result: null, busy: false, left: [], shown: [5, 3] }), t10;
};
var Mee = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
function Nee(e17, t10, n10, r10, i10, a10) {
  let o10 = `<g transform="rotate(${A(a10)} ${A(e17)} ${A(t10)})"><rect x="${A(e17 - n10 / 2)}" y="${A(t10 - n10 / 2)}" width="${A(n10)}" height="${A(n10)}" rx="${A(n10 * 0.16)}" fill="#ffffff" stroke="#343a40" stroke-width="${A(n10 * 0.03)}"/>`;
  if (i10 === `numbers`) o10 += `<text x="${A(e17)}" y="${A(t10 + n10 * 0.2)}" text-anchor="middle" font-family="${j}" font-size="${A(n10 * 0.56)}" font-weight="700" fill="#1f2937">${r10}</text>`;
  else for (let [i11, a11] of Mee[r10] ?? []) o10 += `<circle cx="${A(e17 + i11 * n10 * 0.27)}" cy="${A(t10 + a11 * n10 * 0.27)}" r="${A(n10 * 0.085)}" fill="${r10 === 1 ? `#e03131` : `#1f2937`}"/>`;
  return o10 + `</g>`;
}
function Pee(e17, t10, n10, r10, i10, a10) {
  let o10 = e17.fields.length, s10 = 360 / o10, c10 = `<g class="lh-sp-wheel" transform="rotate(${A(i10)} ${A(t10)} ${A(n10)})">`;
  return e17.fields.forEach((e18, i11) => {
    let l10 = (i11 * s10 - 90 - s10 / 2) * Math.PI / 180, u10 = ((i11 + 1) * s10 - 90 - s10 / 2) * Math.PI / 180, d10 = +(s10 > 180);
    c10 += `<path d="M${A(t10)} ${A(n10)}L${A(t10 + r10 * Math.cos(l10))} ${A(n10 + r10 * Math.sin(l10))}A${r10} ${r10} 0 ${d10} 1 ${A(t10 + r10 * Math.cos(u10))} ${A(n10 + r10 * Math.sin(u10))}Z" fill="${e18.color}" stroke="#ffffff" stroke-width="${A(r10 * 0.02)}"${a10 === i11 ? ` class="lh-pop"` : ``}/>`;
    let f10 = i11 * s10 - 90, p10 = Ko(e18.label, r10 * 0.6, Math.min(r10 * 0.5, Math.PI * 2 * r10 * 0.6 / o10), r10 * 0.13, 10, 1), m10 = f10 > 90 && f10 < 270;
    c10 += `<g transform="rotate(${A(m10 ? f10 + 180 : f10)} ${A(t10)} ${A(n10)})">${qo(p10.lines, m10 ? t10 - r10 * 0.58 : t10 + r10 * 0.58, n10, p10.size, `font-weight="700" fill="#ffffff" stroke="rgba(0,0,0,.25)" stroke-width="2" paint-order="stroke"`)}</g>`;
  }), `${c10}</g><circle cx="${A(t10)}" cy="${A(n10)}" r="${A(r10)}" fill="none" stroke="#343a40" stroke-width="${A(r10 * 0.035)}"/><circle cx="${A(t10)}" cy="${A(n10)}" r="${A(r10 * 0.12)}" fill="#ffffff" stroke="#343a40" stroke-width="${A(r10 * 0.03)}"/>`;
}
function Fee(e17, t10) {
  let n10 = Js(e17.spin), r10 = Math.max(200, e17.w), i10 = Math.max(200, e17.h), a10 = t10 ? Xs(e17.id) : null, o10 = `<rect x="0" y="0" width="${r10}" height="${i10}" rx="20" fill="#ffffff"/>`, s10 = ``;
  if (n10.mode === `wheel`) {
    let e18 = Math.min(r10, i10 - 92) / 2 - 18, c11 = r10 / 2, l10 = (i10 - 92) / 2 + 6, u10 = a10?.result && !a10.busy ? a10.result[0] : null;
    o10 += `<g${Vo(t10, `go`)}><title>Drehen</title>${Pee(n10, c11, l10, e18, a10?.rot ?? 0, u10)}</g>`, o10 += `<path d="M${A(c11 - e18 * 0.09)} ${A(l10 - e18 - 14)}L${A(c11 + e18 * 0.09)} ${A(l10 - e18 - 14)}L${A(c11)} ${A(l10 - e18 + e18 * 0.12)}Z" fill="#343a40" stroke="#ffffff" stroke-width="3"/>`, u10 != null && (s10 = n10.fields[u10]?.label ?? ``);
  } else {
    let e18 = n10.dice, c11 = Math.min((r10 - 80) / e18 - 30, i10 - 92 - 50, 360), l10 = a10?.shown ?? [5, 3];
    for (let s11 = 0; s11 < e18; s11++) {
      let u10 = r10 / 2 + (s11 - (e18 - 1) / 2) * (c11 + 50);
      o10 += `<g${Vo(t10, `go`)}><title>W\xFCrfeln</title>${Nee(u10, (i10 - 92) / 2 + 10, c11, l10[s11] ?? 1, n10.faces, a10?.busy ? (Math.random() - 0.5) * 30 : 0)}</g>`;
    }
    a10?.result && !a10.busy && (s10 = e18 === 2 ? `${a10.result[0]} und ${a10.result[1]} = ${a10.result[0] + a10.result[1]}` : String(a10.result[0]));
  }
  let c10 = i10 - 92 + 6;
  return o10 += `<g${Vo(t10, `go`)}><rect x="${A(r10 / 2 - 150)}" y="${A(c10)}" width="300" height="74" rx="37" fill="${s10 ? `#ffffff` : `#1c7ed6`}" stroke="#1c7ed6" stroke-width="4"/>`, o10 += `<text x="${A(r10 / 2)}" y="${A(c10 + 37 + 14)}" text-anchor="middle" font-family="${j}" font-size="${s10.length > 14 ? 26 : 38}" font-weight="700" fill="${s10 ? `#1f2937` : `#ffffff`}">${s10 ? s10.replace(/&/g, `&amp;`).replace(/</g, `&lt;`) : n10.mode === `wheel` ? `Drehen` : `W\xFCrfeln`}</text></g>`, { body: o10, vw: r10, vh: i10 };
}
var Zs = (e17) => 1 - (1 - e17) ** 3.2;
var Qs = [``, `eins`, `zwei`, `drei`, `vier`, `f\xFCnf`, `sechs`];
function $s(e17, t10) {
  let n10 = nc.item(e17);
  if (!n10) return;
  let r10 = Js(n10.spin), i10 = Xs(e17);
  if (i10.busy) return;
  let a10 = r10.fields.length;
  r10.noRepeat && (!i10.left.length || i10.left.some((e18) => e18 >= a10)) && (i10.left = Array.from({ length: a10 }, (e18, t11) => t11));
  let o10 = r10.noRepeat ? i10.left : Array.from({ length: a10 }, (e18, t11) => t11), s10 = o10[Math.floor(Math.random() * o10.length)];
  r10.noRepeat && (i10.left = i10.left.filter((e18) => e18 !== s10));
  let c10 = 360 / a10, l10 = (Math.random() - 0.5) * c10 * 0.6, u10 = (i10.rot % 360 + 360) % 360, d10 = (360 - (s10 * c10 + l10) % 360 + 360) % 360, f10 = i10.rot, p10 = f10 + (5 + Math.floor(Math.random() * 2)) * 360 + (d10 - u10 + 360) % 360;
  i10.busy = true, i10.result = [s10], nc.redraw(e17);
  let m10 = performance.now(), h10 = -1, g10 = (n11) => {
    let r11 = Math.min(1, (n11 - m10) / 3600);
    i10.rot = f10 + (p10 - f10) * Zs(r11);
    for (let t11 of nc.nodes(e17)) {
      let e18 = t11.querySelector(`.lh-sp-wheel`), n12 = e18?.getAttribute(`transform`)?.match(/rotate\([\d.-]+ ([\d.]+) ([\d.]+)\)/);
      e18 && n12 && e18.setAttribute(`transform`, `rotate(${A(i10.rot)} ${n12[1]} ${n12[2]})`);
    }
    let o11 = Math.floor(((360 - i10.rot % 360) % 360 + c10 / 2) / c10) % a10;
    o11 !== h10 && (h10 >= 0 && _i(), h10 = o11), r11 < 1 ? requestAnimationFrame(g10) : ec(e17, t10, [s10]);
  };
  requestAnimationFrame(g10);
}
function Iee(e17, t10) {
  let n10 = nc.item(e17);
  if (!n10) return;
  let r10 = Js(n10.spin), i10 = Xs(e17);
  if (i10.busy) return;
  i10.busy = true, i10.result = null;
  let a10 = Array.from({ length: r10.dice }, () => 1 + Math.floor(Math.random() * 6)), o10 = 0, s10 = () => {
    o10++, i10.shown = Array.from({ length: r10.dice }, () => 1 + Math.floor(Math.random() * 6)), _i(), nc.redraw(e17), o10 < 9 ? setTimeout(s10, 70 + o10 * 12) : (i10.shown = a10, ec(e17, t10, a10));
  };
  s10();
}
function ec(e17, t10, n10) {
  let r10 = nc.item(e17), i10 = Xs(e17);
  if (i10.busy = false, i10.result = n10, nc.redraw(e17), !r10) return;
  let a10 = Js(r10.spin), o10 = a10.mode === `wheel` ? a10.fields[n10[0]]?.label ?? `` : n10.length === 2 ? String(n10[0] + n10[1]) : String(n10[0]);
  vi();
  let s10 = a10.mode === `wheel` ? o10 : n10.length === 2 ? `${Qs[n10[0]]} und ${Qs[n10[1]]}, das sind ${n10[0] + n10[1]}` : Qs[n10[0]], c10 = a10.count && !a10.auto;
  s10 && M(c10 ? `${s10}. Mach einen Strich!` : s10), a10.count && a10.auto && o10 && Ws(t10, o10);
}
function tc(e17) {
  let t10 = Js(e17.spin);
  return t10.mode === `dice` ? t10.dice === 2 ? `Zwei W\xFCrfel. Tippe zum W\xFCrfeln.` : `Ein W\xFCrfel. Tippe zum W\xFCrfeln.` : `Gl\xFCcksrad mit ${t10.fields.length} Feldern: ${t10.fields.map((e18) => e18.label).join(`, `)}. Tippe zum Drehen.`;
}
var nc = Uo({ cls: `lh-ct-spin`, view: Fee, label: tc, sounds: true, hit(e17, t10, n10, r10) {
  let i10 = nc.item(e17);
  i10 && t10 === `go` && (Js(i10.spin).mode === `wheel` ? $s(e17, r10) : Iee(e17, r10));
} });
var Lee = nc.draw;
function rc(e17) {
  Ys.delete(e17), nc.redraw(e17);
}
var ic = [{ id: `circle`, label: `Kreis`, plural: `Kreise` }, { id: `square`, label: `Quadrat`, plural: `Quadrate` }, { id: `triangle`, label: `Dreieck`, plural: `Dreiecke` }, { id: `star`, label: `Stern`, plural: `Sterne` }, { id: `heart`, label: `Herz`, plural: `Herzen` }];
var ac = [{ id: `red`, label: `rot`, adj: `roten`, hex: `#e03131` }, { id: `blue`, label: `blau`, adj: `blauen`, hex: `#1c7ed6` }, { id: `green`, label: `gr\xFCn`, adj: `gr\xFCnen`, hex: `#2f9e44` }, { id: `yellow`, label: `gelb`, adj: `gelben`, hex: `#fcc419` }, { id: `orange`, label: `orange`, adj: `orangen`, hex: `#fd7e14` }, { id: `purple`, label: `lila`, adj: `lila`, hex: `#9c36b5` }];
function sc(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = ic.some((e18) => e18.id === t10.shape) || t10.shape === `any` || t10.shape === `random` ? t10.shape : `star`, r10 = ac.some((e18) => e18.id === t10.color) || t10.color === `any` || t10.color === `random` ? t10.color : `red`;
  n10 === `any` && r10 === `any` && (r10 = `red`);
  let i10 = Number(t10.targets), a10 = Number.isFinite(i10) ? Math.max(2, Math.min(12, Math.round(i10))) : 6, o10 = Number(t10.targetsMax), s10 = Number.isFinite(o10) && Math.round(o10) > a10 ? Math.min(12, Math.round(o10)) : void 0;
  return { shape: n10, color: r10, targets: a10, ...s10 ? { targetsMax: s10 } : {}, level: t10.level === `medium` || t10.level === `hard` ? t10.level : `easy`, seed: typeof t10.seed == `number` && Number.isFinite(t10.seed) ? Math.floor(t10.seed) : 1 };
}
function cc(e17, t10 = e17.seed) {
  let n10 = uc((t10 ^ 1540483477) >>> 0);
  return { shape: e17.shape === `random` ? ic[Math.floor(n10() * ic.length)].id : e17.shape, color: e17.color === `random` ? ac[Math.floor(n10() * ac.length)].id : e17.color, targets: e17.targetsMax && e17.targetsMax > e17.targets ? e17.targets + Math.floor(n10() * (e17.targetsMax - e17.targets + 1)) : e17.targets, level: e17.level, seed: t10 };
}
function lc(e17) {
  let t10 = ac.find((t11) => t11.id === e17.color), n10 = ic.find((t11) => t11.id === e17.shape);
  return `alle ${t10 ? `${t10.adj} ` : ``}${n10 ? n10.plural : `Formen`}`;
}
function uc(e17) {
  let t10 = e17 >>> 0;
  return () => {
    t10 = t10 + 1831565813 >>> 0;
    let e18 = t10;
    return e18 = Math.imul(e18 ^ e18 >>> 15, e18 | 1), e18 ^= e18 + Math.imul(e18 ^ e18 >>> 7, e18 | 61), ((e18 ^ e18 >>> 14) >>> 0) / 4294967296;
  };
}
var dc = (e17, t10) => (e17.shape === `any` || t10.shape === e17.shape) && (e17.color === `any` || t10.color === e17.color);
function fc(e17) {
  let t10 = uc(e17.seed), n10 = (e18) => e18[Math.floor(t10() * e18.length)], r10 = e17.level === `easy` ? 14 : e17.level === `medium` ? 22 : 34, i10 = e17.level === `hard` ? 34 : e17.level === `medium` ? 42 : 48, a10 = ic.map((e18) => e18.id), o10 = ac.map((e18) => e18.id), s10 = [];
  for (let t11 = 0; t11 < e17.targets; t11++) s10.push({ shape: e17.shape === `any` ? n10(a10) : e17.shape, color: e17.color === `any` ? n10(o10) : e17.color, hit: true });
  for (let i11 = 0; i11 < r10; i11++) {
    let r11;
    for (let i12 = 0; ; i12++) {
      if (e17.level === `easy`) r11 = { shape: e17.shape === `any` ? n10(a10) : n10(a10.filter((t11) => t11 !== e17.shape)), color: e17.color === `any` ? n10(o10) : n10(o10.filter((t11) => t11 !== e17.color)) };
      else {
        let i13 = t10() < 0.5;
        r11 = { shape: i13 && e17.shape !== `any` ? e17.shape : n10(a10), color: !i13 && e17.color !== `any` ? e17.color : n10(o10) };
      }
      if (!dc(e17, r11) || i12 > 40) break;
    }
    s10.push({ ...r11, hit: false });
  }
  let c10 = [];
  for (let e18 of s10) {
    let n11 = i10 * (0.75 + t10() * 0.5);
    for (let r11 = 0; r11 < 400; r11++) {
      let r12 = 30 + n11 + t10() * (940 - 2 * n11), i11 = 30 + n11 + t10() * (580 - 2 * n11);
      if (c10.every((e19) => Math.hypot(e19.x - r12, e19.y - i11) > e19.r + n11 + 6)) {
        c10.push({ ...e18, x: r12, y: i11, r: n11, rot: (t10() - 0.5) * 50 });
        break;
      }
    }
  }
  return c10;
}
function pc(e17, t10, n10, r10, i10, a10 = 0, o10 = ``) {
  let s10 = a10 ? ` transform="rotate(${A(a10)} ${A(t10)} ${A(n10)})"` : ``, c10 = `fill="${i10}" stroke="#343a40" stroke-width="${A(Math.max(2, r10 * 0.07))}" stroke-linejoin="round"${o10}`;
  switch (e17) {
    case `circle`:
      return `<circle cx="${A(t10)}" cy="${A(n10)}" r="${A(r10 * 0.92)}" ${c10}${s10}/>`;
    case `square`:
      return `<rect x="${A(t10 - r10 * 0.8)}" y="${A(n10 - r10 * 0.8)}" width="${A(r10 * 1.6)}" height="${A(r10 * 1.6)}" rx="${A(r10 * 0.08)}" ${c10}${s10}/>`;
    case `triangle`:
      return `<path d="M${A(t10)} ${A(n10 - r10)}L${A(t10 + r10 * 0.95)} ${A(n10 + r10 * 0.72)}L${A(t10 - r10 * 0.95)} ${A(n10 + r10 * 0.72)}Z" ${c10}${s10}/>`;
    case `star`: {
      let e18 = ``;
      for (let i11 = 0; i11 < 10; i11++) {
        let a11 = Math.PI / 5 * i11 - Math.PI / 2, o11 = i11 % 2 ? r10 * 0.45 : r10;
        e18 += `${i11 ? `L` : `M`}${A(t10 + o11 * Math.cos(a11))} ${A(n10 + o11 * Math.sin(a11) + r10 * 0.08)}`;
      }
      return `<path d="${e18}Z" ${c10}${s10}/>`;
    }
    case `heart`: {
      let e18 = r10 / 12;
      return `<path d="M${A(t10)} ${A(n10 + 10 * e18)}C${A(t10 - 16 * e18)} ${A(n10)} ${A(t10 - 12 * e18)} ${A(n10 - 13 * e18)} ${A(t10 - 5 * e18)} ${A(n10 - 11 * e18)}C${A(t10 - 2 * e18)} ${A(n10 - 10 * e18)} ${A(t10)} ${A(n10 - 7 * e18)} ${A(t10)} ${A(n10 - 5 * e18)}C${A(t10)} ${A(n10 - 7 * e18)} ${A(t10 + 2 * e18)} ${A(n10 - 10 * e18)} ${A(t10 + 5 * e18)} ${A(n10 - 11 * e18)}C${A(t10 + 12 * e18)} ${A(n10 - 13 * e18)} ${A(t10 + 16 * e18)} ${A(n10)} ${A(t10)} ${A(n10 + 10 * e18)}Z" ${c10}${s10}/>`;
    }
  }
}
var mc = /* @__PURE__ */ new Map();
function hc(e17) {
  let t10 = sc(e17.seek), n10 = mc.get(e17.id);
  return n10 && n10.base === t10.seed || mc.set(e17.id, n10 = { base: t10.seed, seed: t10.seed, found: /* @__PURE__ */ new Set() }), n10;
}
function gc(e17, t10) {
  let n10 = sc(e17.seek), r10 = t10 ? hc(e17) : null, i10 = cc(n10, r10?.seed ?? n10.seed), a10 = fc(i10), o10 = 1e3, s10 = `<rect x="0" y="0" width="${o10}" height="740" rx="20" fill="#ffffff" stroke="#ced4da" stroke-width="3"/>`, c10 = i10.shape === `any` ? `circle` : i10.shape, l10 = ac.find((e18) => e18.id === i10.color)?.hex ?? `#ced4da`;
  s10 += pc(c10, 54, 52, 28, i10.color === `any` ? `#ffffff` : l10), i10.color === `any` && i10.shape !== `any` && (s10 += `<text x="54" y="62" text-anchor="middle" font-family="${j}" font-size="26" font-weight="700" fill="#343a40">?</text>`);
  let u10 = r10?.found.size ?? 0, d10 = a10.filter((e18) => e18.hit).length;
  return s10 += `<text x="100" y="64" font-family="${j}" font-size="34" font-weight="700" fill="#1f2937">Finde ${lc(i10).replace(/&/g, `&amp;`)}!</text>`, t10 && (s10 += `<text x="970" y="64" text-anchor="end" font-family="${j}" font-size="34" font-weight="700" fill="${u10 === d10 ? `#2f9e44` : `#1c7ed6`}">${u10} von ${d10}</text>`), s10 += `<g transform="translate(0 100)">`, a10.forEach((e18, n11) => {
    let i11 = ac.find((t11) => t11.id === e18.color).hex, a11 = r10?.found.has(n11);
    s10 += `<g${Vo(t10, `o:${n11}`)}>${pc(e18.shape, e18.x, e18.y, e18.r, i11, e18.rot)}`, a11 && (s10 += `<circle class="lh-pop" cx="${A(e18.x)}" cy="${A(e18.y)}" r="${A(e18.r + 9)}" fill="none" stroke="#2f9e44" stroke-width="7"/>`), s10 += `</g>`;
  }), s10 += `</g>`, t10 && u10 === d10 && d10 && (s10 += `<g class="lh-pop"><rect x="${o10 / 2 - 230}" y="300" width="460" height="150" rx="26" fill="#2f9e44" opacity="0.95"/><text x="${o10 / 2}" y="362" text-anchor="middle" font-family="${j}" font-size="46" font-weight="700" fill="#fff">Alle gefunden!</text>`, s10 += `<g${Vo(t10, `new`)}><rect x="${o10 / 2 - 120}" y="384" width="240" height="54" rx="27" fill="#ffffff"/><text x="${o10 / 2}" y="420" text-anchor="middle" font-family="${j}" font-size="28" font-weight="700" fill="#2f9e44">Neues Bild</text></g></g>`), { body: s10, vw: o10, vh: 740 };
}
function _c(e17) {
  let t10 = sc(e17.seek);
  return `Suchbild. Finde ${lc(cc(t10, mc.get(e17.id)?.seed ?? t10.seed))}!`;
}
var vc = Uo({ cls: `lh-ct-seek`, view: gc, label: _c, sounds: true, hit(e17, t10, n10) {
  let r10 = vc.item(e17);
  if (!r10) return;
  let i10 = hc(r10);
  if (t10 === `new`) {
    let t11 = sc(r10.seek), n11 = cc(t11, i10.seed);
    for (let e18 = 0; e18 < 20; e18++) {
      i10.seed = Math.floor(Math.random() * 1e9);
      let e19 = cc(t11, i10.seed);
      if ((t11.shape !== `random` || e19.shape !== n11.shape) && (t11.color !== `random` || e19.color !== n11.color)) break;
    }
    i10.found.clear(), vc.redraw(e17), M(_c(r10));
    return;
  }
  let a10 = fc(cc(sc(r10.seek), i10.seed)), o10 = Number(t10.slice(2)), s10 = a10[o10];
  if (!s10) return;
  if (!s10.hit) {
    yi(), Wo(n10);
    return;
  }
  if (i10.found.has(o10)) return;
  i10.found.add(o10), vc.redraw(e17);
  let c10 = a10.filter((e18) => e18.hit).length;
  i10.found.size === c10 ? (vi(), M(`Super! Du hast alle ${c10} gefunden.`)) : M(String(i10.found.size));
} });
var yc = vc.draw;
function bc(e17) {
  mc.delete(e17), vc.redraw(e17);
}
var Sc = [{ id: `AB`, label: `AB`, hint: `rot, blau, rot, blau \u2026` }, { id: `AAB`, label: `AAB`, hint: `rot, rot, blau \u2026` }, { id: `ABB`, label: `ABB`, hint: `rot, blau, blau \u2026` }, { id: `ABC`, label: `ABC`, hint: `drei im Wechsel` }, { id: `AABB`, label: `AABB`, hint: `immer zwei` }, { id: `ABCD`, label: `ABCD`, hint: `vier im Wechsel` }, { id: `mix`, label: `Gemischt`, hint: `jedes Mal anders` }];
var Ree = [`AB`, `AAB`, `ABB`, `ABC`, `AABB`, `ABCD`];
var Cc = [`#e03131`, `#1c7ed6`, `#fcc419`, `#2f9e44`, `#9c36b5`, `#fd7e14`];
var zee = [`circle`, `square`, `triangle`, `star`, `heart`];
function Tc(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = (e18, t11, n11, r10) => typeof e18 == `number` && Number.isFinite(e18) ? Math.max(t11, Math.min(n11, Math.round(e18))) : r10;
  return { kind: t10.kind === `shapes` ? `shapes` : `beads`, rule: Sc.some((e18) => e18.id === t10.rule) ? t10.rule : `AB`, blanks: n10(t10.blanks, 2, 6, 4), rounds: n10(t10.rounds, 1, 10, 5), seed: typeof t10.seed == `number` && Number.isFinite(t10.seed) ? Math.floor(t10.seed) : 1 };
}
function Ec(e17) {
  let t10 = e17 >>> 0;
  return () => {
    t10 = t10 + 1831565813 >>> 0;
    let e18 = t10;
    return e18 = Math.imul(e18 ^ e18 >>> 15, e18 | 1), e18 ^= e18 + Math.imul(e18 ^ e18 >>> 7, e18 | 61), ((e18 ^ e18 >>> 14) >>> 0) / 4294967296;
  };
}
var Dc = (e17, t10) => e17.shape === t10.shape && e17.color === t10.color;
function Oc(e17, t10) {
  let n10 = Ec(e17.seed + t10 * 7919), r10 = e17.rule === `mix` ? ((e18) => e18[Math.floor(n10() * e18.length)])(Ree) : e17.rule, i10 = [...new Set(r10.split(``))], a10 = [...Cc].sort(() => n10() - 0.5), o10 = [...zee].sort(() => n10() - 0.5), s10 = (t11) => e17.kind === `beads` ? { shape: `circle`, color: a10[t11] } : { shape: o10[t11], color: a10[t11] }, c10 = new Map(i10.map((e18, t11) => [e18, s10(t11)])), l10 = Math.max(6, r10.length * 2);
  return { rule: r10, seq: Array.from({ length: l10 + e17.blanks }, (e18, t11) => c10.get(r10[t11 % r10.length])), given: l10, choices: [...c10.values(), s10(i10.length)].sort(() => n10() - 0.5) };
}
var kc = /* @__PURE__ */ new Map();
function Ac(e17) {
  let t10 = Tc(e17.pat), n10 = kc.get(e17.id);
  return n10 && n10.base === t10.seed || kc.set(e17.id, n10 = { base: t10.seed, seed: t10.seed, round: 0, filled: 0, clean: 0, wrong: false, end: false }), n10;
}
function jc(e17, t10, n10, r10, i10) {
  return i10 === `beads` ? `<circle cx="${A(t10)}" cy="${A(n10)}" r="${A(r10)}" fill="${e17.color}" stroke="#343a40" stroke-width="3"/><circle cx="${A(t10 - r10 * 0.35)}" cy="${A(n10 - r10 * 0.35)}" r="${A(r10 * 0.22)}" fill="#ffffff" opacity="0.55"/>` : pc(e17.shape, t10, n10, r10, e17.color);
}
function Mc(e17, t10) {
  let n10 = Tc(e17.pat), r10 = t10 ? Ac(e17) : null, i10 = { ...n10, seed: r10?.seed ?? n10.seed }, a10 = Math.max(400, e17.w), o10 = Math.max(240, e17.h), s10 = Oc(i10, r10?.round ?? 0), c10 = s10.seq.length, l10 = r10 ? r10.filled : 0, u10 = `<rect x="0" y="0" width="${a10}" height="${o10}" rx="20" fill="#ffffff" stroke="#ced4da" stroke-width="3"/>`;
  u10 += `<text x="30" y="56" font-family="${j}" font-size="34" font-weight="700" fill="#1f2937">Wie geht es weiter?</text>`, t10 && !r10?.end && (u10 += `<text x="${a10 - 30}" y="56" text-anchor="end" font-family="${j}" font-size="28" fill="#868e96">${(r10?.round ?? 0) + 1} von ${i10.rounds}</text>`);
  let d10 = 90 + (o10 - 90) * (t10 ? 0.32 : 0.5), f10 = Math.min((a10 - 60) / c10 * 0.42, (o10 - 90) * 0.16, 60), p10 = (a10 - 60) / c10;
  i10.kind === `beads` && (u10 += `<path d="M20 ${A(d10)}Q${a10 / 2} ${A(d10 + f10 * 0.5)} ${a10 - 20} ${A(d10)}" fill="none" stroke="#868e96" stroke-width="4"/>`);
  for (let e18 = 0; e18 < c10; e18++) {
    let n11 = 30 + p10 * (e18 + 0.5), r11 = i10.kind === `beads` ? d10 + f10 * 0.5 * (1 - ((n11 - a10 / 2) / (a10 / 2)) ** 2) * 0.5 : d10;
    e18 < s10.given + l10 ? u10 += `<g${e18 >= s10.given ? ` class="lh-pop"` : ``}>${jc(s10.seq[e18], n11, r11, f10, i10.kind)}</g>` : u10 += `<circle cx="${A(n11)}" cy="${A(r11)}" r="${A(f10)}" fill="#ffffff" stroke="${e18 === s10.given + l10 && t10 ? `#f08c00` : `#adb5bd`}" stroke-width="${e18 === s10.given + l10 && t10 ? 5 : 3}" stroke-dasharray="8 6"/>`;
  }
  if (t10 && r10 && !r10.end) {
    let e18 = l10 >= i10.blanks, n11 = 90 + (o10 - 90) * 0.74, c11 = Math.min(70, (a10 - 100) / s10.choices.length / 2 - 16, (o10 - 90) * 0.16), d11 = Math.min(c11 * 2 + 50, (a10 - 60) / s10.choices.length), f11 = a10 / 2 - d11 * (s10.choices.length - 1) / 2;
    if (!e18) u10 += `<rect x="30" y="${A(n11 - c11 - 22)}" width="${a10 - 60}" height="${A(c11 * 2 + 44)}" rx="20" fill="#f8f9fa" stroke="#e9ecef" stroke-width="3"/>`, s10.choices.forEach((e19, r11) => u10 += `<g${Vo(t10, `c:${r11}`)}><circle cx="${A(f11 + r11 * d11)}" cy="${A(n11)}" r="${A(c11 + 12)}" fill="transparent"/>${jc(e19, f11 + r11 * d11, n11, c11, i10.kind)}</g>`);
    else {
      let e19 = r10.round + 1 >= i10.rounds;
      u10 += `<g${Vo(t10, e19 ? `end` : `next`)}><rect x="${a10 / 2 - 170}" y="${A(n11 - 40)}" width="340" height="80" rx="40" fill="#2f9e44"/><text x="${a10 / 2}" y="${A(n11 + 13)}" text-anchor="middle" font-family="${j}" font-size="36" font-weight="700" fill="#fff">${e19 ? `Fertig!` : `N\xE4chstes Muster`}</text></g>`;
    }
  }
  if (t10 && r10?.end) {
    let e18 = 90 + (o10 - 90) * 0.74;
    u10 += `<text x="${a10 / 2}" y="${A(e18 - 6)}" text-anchor="middle" font-family="${j}" font-size="38" font-weight="700" fill="#2f9e44">Super! ${r10.clean} von ${i10.rounds} ohne Fehler.</text>`, u10 += `<g${Vo(t10, `again`)}><rect x="${a10 / 2 - 130}" y="${A(e18 + 20)}" width="260" height="66" rx="33" fill="#1c7ed6"/><text x="${a10 / 2}" y="${A(e18 + 64)}" text-anchor="middle" font-family="${j}" font-size="30" font-weight="700" fill="#fff">Nochmal</text></g>`;
  }
  return { body: u10, vw: a10, vh: o10 };
}
var Nc = () => `Muster fortsetzen. Wie geht es weiter? Tippe die richtige Perle an.`;
var Pc = Uo({ cls: `lh-ct-pattern`, view: Mc, label: Nc, sounds: true, hit(e17, t10, n10) {
  let r10 = Pc.item(e17);
  if (!r10) return;
  let i10 = Ac(r10), a10 = { ...Tc(r10.pat), seed: i10.seed };
  if (t10 === `next`) i10.round++, i10.filled = 0, i10.wrong = false;
  else if (t10 === `end`) i10.end = true, vi(), M(`Super! ${i10.clean} von ${a10.rounds} ohne Fehler.`);
  else if (t10 === `again`) kc.set(e17, { base: i10.base, seed: Math.floor(Math.random() * 1e9), round: 0, filled: 0, clean: 0, wrong: false, end: false });
  else if (t10.startsWith(`c:`)) {
    let e18 = Oc(a10, i10.round), r11 = e18.choices[Number(t10.slice(2))], o10 = e18.seq[e18.given + i10.filled];
    if (!r11 || !o10) return;
    if (!Dc(r11, o10)) {
      i10.wrong = true, yi(), Wo(n10);
      return;
    }
    i10.filled++, i10.filled >= a10.blanks && (i10.wrong || i10.clean++, vi());
  }
  Pc.redraw(e17);
} });
var Fc = Pc.draw;
function Ic(e17) {
  kc.delete(e17), Pc.redraw(e17);
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
var tQe = [[`Obst`, `Apfel
Banane
Birne
Kiwi
Orange
Traube`], [`Farben`, `rot
blau
gelb
gr\xFCn
orange
lila`], [`Zahlen 1\u201310`, `1
2
3
4
5
6
7
8
9
10`], [`Wochentage`, `Montag
Dienstag
Mittwoch
Donnerstag
Freitag`], [`Bewegung`, `h\xFCpfen
klatschen
drehen
stampfen
winken
strecken`]];
var aQe = (e17, t10) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${e17 === `random` ? `<circle cx="50" cy="52" r="40" fill="#ffffff" stroke="#868e96" stroke-width="4" stroke-dasharray="9 7"/><text x="50" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="#495057">?</text>` : pc(e17 === `any` ? `circle` : e17, 50, 52, 40, t10)}</svg>`)}`;
var TOOLS_CSS = Eee;
var TOOL_REGISTRY = { "listen": { kind: "listen", field: "listen", draw: toe, label: eoe, config: (raw, media) => pg(raw, media, media), redraw: vg.redraw },
  "tally": { kind: "tally", field: "tally", draw: Us, label: Vs, config: (raw, media) => As(raw, media, media), redraw: Hs.redraw, register: Ps, state: ["counts"] },
  "spin": { kind: "spinner", field: "spin", draw: Lee, label: tc, config: (raw, media) => Js(raw, media, media), redraw: nc.redraw, reset: rc },
  "seek": { kind: "seek", field: "seek", draw: yc, label: _c, config: (raw, media) => sc(raw, media, media), redraw: vc.redraw, reset: bc },
  "pattern": { kind: "pattern", field: "pat", draw: Fc, label: Nc, config: (raw, media) => Tc(raw, media, media), redraw: Pc.redraw, reset: Ic } };
export { toe as renderListen, eoe as listenLabel, pg as listenConfig, yg as resetListen, noe as stopListen, lh as LISTEN_SOUNDS, dg as LISTEN_INSTRUMENTS, yae as playListenSound, Hh as listenSoundPicture, ic as SEEK_SHAPES, ac as SEEK_COLORS, aQe as seekPicture, Sc as PATTERN_RULES, tQe as SPIN_PRESETS, Os as TALLY_COLORS, Ks as SPIN_COLORS, TOOLS_CSS, TOOL_REGISTRY };
