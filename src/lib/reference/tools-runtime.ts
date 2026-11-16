/* eslint-disable */
// @ts-nocheck
// Generated from Lernsachen-Heft-komplett.html (1.47.3) by scripts/extract-tools-reference.mjs:
// the tools drawn by the reference's tool host, unchanged (page lookup: see the script).
var Be = [{ id: `andika`, family: `Andika`, label: `Andika`, hint: `f\xFCr Leseanf\xE4nger, einst\xF6ckiges a`, fallback: `Verdana, sans-serif` }, { id: `druck`, family: `Andika`, label: `Druckschrift`, hint: `Grundschul-Druckschrift wie in Bayern (Gruschudru)`, fallback: `Andika, Verdana, sans-serif` }, { id: `grund`, family: `Playwrite DE Grund`, label: `Grundschrift`, hint: `wie in der Schule (Playwrite DE Grund)`, fallback: `Andika, Verdana, sans-serif` }, { id: `schreib`, family: `Playwrite DE VA`, label: `Schreibschrift VA`, hint: `verbundene Schrift (Vereinfachte Ausgangsschrift)`, fallback: `cursive` }, { id: `sas`, family: `Playwrite DE SAS`, label: `Schreibschrift SAS`, hint: `verbundene Schrift (Schulausgangsschrift, z. B. in Bayern)`, fallback: `cursive` }, { id: `lexend`, family: `Lexend`, label: `Lexend`, hint: `besonders leicht lesbar, weite Buchstaben`, fallback: `Verdana, sans-serif` }, { id: `nunito`, family: `Nunito`, label: `Nunito`, hint: `serifenlos, freundlich`, fallback: `system-ui, sans-serif` }, { id: `atkinson`, family: `Atkinson Hyperlegible`, label: `Atkinson`, hint: `barrierefrei, gut unterscheidbare Buchstaben`, fallback: `Verdana, sans-serif` }, { id: `merriweather`, family: `Merriweather`, label: `Merriweather`, hint: `mit Serifen, wie in B\xFCchern`, fallback: `Georgia, serif` }, { id: `caveat`, family: `Caveat`, label: `Handschrift`, hint: `locker wie mit dem Stift geschrieben`, fallback: `cursive` }, { id: `comic`, family: `Bangers`, label: `Comic`, hint: `gro\xDFe Comic-Buchstaben (Bangers)`, fallback: `Impact, sans-serif` }];
function Ve(e17) {
  return Be.find((t10) => t10.id === e17) ?? Be[0];
}
function He(e17) {
  let t10 = Ve(e17);
  return `"${t10.family}", ${t10.fallback}`;
}
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
function br() {
  let e17 = gr;
  gr = null;
  try {
    e17?.stop();
  } catch {
  }
  Cr();
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
function ti(e17) {
  return !!e17 && e17.getAudioTracks().some((e18) => e18.readyState === `live` && !e18.muted);
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
var oo = [`#e03131`, `#f76707`, `#fd7e14`, `#f59f00`, `#fcc419`, `#82c91e`, `#37b24d`, `#0ca678`, `#1098ad`, `#4263eb`, `#7048e8`, `#e64980`];
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
var gs = [`#1c7ed6`, `#2f9e44`, `#e8590c`, `#7048e8`, `#d6336c`, `#0c8599`, `#495057`];
function _s(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (Array.isArray(n10.steps) ? n10.steps : []).slice(0, 12).flatMap((e18) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, r11 = typeof n11.text == `string` ? n11.text.slice(0, 120) : ``, i10 = t10(n11.img);
    return r11 || i10 ? [{ text: r11, ...i10 ? { img: i10 } : {} }] : [];
  });
  return { title: typeof n10.title == `string` ? n10.title.slice(0, 80) : ``, steps: r10, layout: n10.layout === `list` ? `list` : `cards`, numbers: n10.numbers !== false, tick: n10.tick !== false, color: typeof n10.color == `string` && /^#[0-9a-f]{6}$/i.test(n10.color) ? n10.color : gs[0] };
}
var ys = /* @__PURE__ */ new Map();
var bs = (e17) => {
  let t10 = ys.get(e17);
  return t10 || ys.set(e17, t10 = /* @__PURE__ */ new Set()), t10;
};
function xs(e17, t10, n10) {
  let r10 = Math.max(1, e17.steps.length), i10 = e17.title ? 92 : 24, a10 = t10 - 48, o10 = n10 - i10 - 24;
  if (e17.layout === `list`) {
    let t11 = Math.min(170, (o10 - (r10 - 1) * 12) / r10);
    return e17.steps.map((e18, n11) => ({ x: 24, y: i10 + n11 * (t11 + 12), w: a10, h: t11 }));
  }
  let s10 = { cols: 1, s: 0 };
  for (let e18 = 1; e18 <= r10; e18++) {
    let t11 = Math.ceil(r10 / e18), n11 = (a10 - (e18 - 1) * 44) / e18, i11 = (o10 - (t11 - 1) * 24) / t11, c11 = Math.min(n11, i11 / 1.18);
    c11 > s10.s && (s10 = { cols: e18, s: c11 });
  }
  let c10 = s10.cols, l10 = Math.ceil(r10 / c10), u10 = (a10 - (c10 - 1) * 44) / c10, d10 = Math.min((o10 - (l10 - 1) * 24) / l10, u10 * 1.35), f10 = i10 + (o10 - l10 * d10 - (l10 - 1) * 24) / 2;
  return e17.steps.map((e18, t11) => {
    let n11 = Math.floor(t11 / c10), i11 = t11 % c10, o11 = n11 === l10 - 1 ? r10 - n11 * c10 : c10;
    return { x: 24 + (a10 - o11 * u10 - (o11 - 1) * 44) / 2 + i11 * (u10 + 44), y: f10 + n11 * (d10 + 24), w: u10, h: d10 };
  });
}
function Ss(e17, t10, n10) {
  let r10 = _s(e17.steps, (e18) => typeof e18 == `string` ? e18 : void 0), i10 = Math.max(200, e17.w), a10 = Math.max(120, e17.h), o10 = t10 ? bs(e17.id) : /* @__PURE__ */ new Set(), s10 = t10 && r10.tick ? r10.steps.findIndex((e18, t11) => !o10.has(t11)) : -1, c10 = r10.color, l10 = `<rect x="0" y="0" width="${i10}" height="${a10}" rx="18" fill="#ffffff"/>`;
  r10.title && (l10 += qo([r10.title], i10 / 2, 48, Math.min(46, (i10 - 120) / Math.max(4, r10.title.length * 0.6)), `font-weight="700" fill="${c10}"`));
  let u10 = [], d10 = xs(r10, i10, a10);
  return r10.steps.forEach((e18, i11) => {
    let a11 = d10[i11], f10 = o10.has(i11), p10 = i11 === s10, m10 = r10.layout === `list`;
    l10 += `<g${Vo(t10, `s:${i11}`)}>`, l10 += `<rect x="${A(a11.x)}" y="${A(a11.y)}" width="${A(a11.w)}" height="${A(a11.h)}" rx="16" fill="${f10 ? `#ebfbee` : `#ffffff`}" stroke="${p10 ? `#f08c00` : c10}" stroke-width="${p10 ? 9 : 4}"/>`;
    let h10 = d10[i11 + 1];
    if (!m10 && h10 && Math.abs(h10.y - a11.y) < 1) {
      let e19 = a11.x + a11.w + 8, t11 = a11.y + a11.h / 2;
      l10 += `<path d="M${A(e19)} ${A(t11 - 14)}L${A(e19 + 26)} ${A(t11)}L${A(e19)} ${A(t11 + 14)}Z" fill="${c10}" opacity="0.7"/>`;
    }
    let g10 = r10.numbers ? 34 : 0, _10, v10, y10, b10;
    if (m10) {
      let t11 = a11.h - 20, r11 = a11.x + 14 + (g10 ? g10 * 2 + 8 : 0);
      e18.img && u10.push({ src: n10(e18.img) ?? ``, x: r11, y: a11.y + 10, w: t11, h: t11, dim: f10 }), _10 = e18.img ? r11 + t11 + 20 : r11, y10 = a11.x + a11.w - _10 - 70, v10 = a11.y + a11.h / 2, b10 = a11.h - 16;
      let o11 = Ko(e18.text, y10, b10, Math.min(44, a11.h * 0.34), 14, 3);
      l10 += qo(o11.lines, _10, v10, o11.size, `fill="#1f2937"${f10 ? ` opacity="0.55"` : ``}`, `start`), g10 && (l10 += Cs(a11.x + 14, a11.y + a11.h / 2 - g10, g10, i11 + 1, c10));
    } else {
      let t11 = e18.img ? Math.max(40, a11.h * 0.3) : a11.h - 30, r11 = a11.w - 24, o11 = a11.h - t11 - 22;
      e18.img && u10.push({ src: n10(e18.img) ?? ``, x: a11.x + 12, y: a11.y + 14, w: r11, h: Math.max(10, o11), dim: f10 }), _10 = a11.x + a11.w / 2, y10 = a11.w - 22, v10 = e18.img ? a11.y + a11.h - t11 / 2 - 6 : a11.y + a11.h / 2, b10 = t11 - 4;
      let s11 = Ko(e18.text, y10, b10, e18.img ? Math.min(34, a11.w * 0.13) : Math.min(52, a11.w * 0.16), 12, e18.img ? 2 : 5);
      l10 += qo(s11.lines, _10, v10, s11.size, `fill="#1f2937"${f10 ? ` opacity="0.55"` : ``}`), g10 && (l10 += Cs(a11.x + 6, a11.y + 6, Math.min(g10, a11.w * 0.14), i11 + 1, c10));
    }
    f10 && (l10 += `<g class="lh-pop"><circle cx="${A(a11.x + a11.w - 30)}" cy="${A(a11.y + 30)}" r="22" fill="#2f9e44"/><path d="M${A(a11.x + a11.w - 41)} ${A(a11.y + 30)}l8 8 15-16" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`), p10 && (l10 += `<g><rect x="${A(a11.x + a11.w / 2 - 50)}" y="${A(a11.y - 20)}" width="100" height="34" rx="17" fill="#f08c00"/><text x="${A(a11.x + a11.w / 2)}" y="${A(a11.y + 4)}" text-anchor="middle" font-family="${j}" font-size="22" font-weight="700" fill="#fff">Jetzt</text></g>`), l10 += `</g>`;
  }), r10.steps.length || (l10 += qo([`Noch keine Schritte \u2013 tippe auf \u201EEinstellen\u201C.`], i10 / 2, a10 / 2, 30, `fill="#868e96"`)), t10 && o10.size && (l10 += `<g${Vo(t10, `reset`)}><title>Von vorn</title><circle cx="${i10 - 40}" cy="40" r="28" fill="#f1f3f5" stroke="#adb5bd" stroke-width="3"/><path d="M${i10 - 52} 34a14 14 0 1 1 2 14" fill="none" stroke="#495057" stroke-width="5" stroke-linecap="round"/><path d="M${i10 - 60} 26l6 12 10-8z" fill="#495057"/></g>`), t10 && r10.steps.length && o10.size === r10.steps.length && (l10 += `<g class="lh-pop"><rect x="${A(i10 / 2 - 170)}" y="${A(a10 / 2 - 50)}" width="340" height="100" rx="24" fill="#2f9e44" opacity="0.94"/><text x="${A(i10 / 2)}" y="${A(a10 / 2 + 16)}" text-anchor="middle" font-family="${j}" font-size="48" font-weight="700" fill="#fff">Geschafft!</text></g>`), { body: l10, vw: i10, vh: a10, pics: u10.filter((e18) => e18.src) };
}
function Cs(e17, t10, n10, r10, i10) {
  let a10 = e17 + n10, o10 = t10 + n10;
  return `<circle cx="${A(a10)}" cy="${A(o10)}" r="${A(n10)}" fill="${i10}"/><text x="${A(a10)}" y="${A(o10 + n10 * 0.36)}" text-anchor="middle" font-family="${j}" font-size="${A(n10 * 1.05)}" font-weight="700" fill="#fff">${r10}</text>`;
}
function ws(e17) {
  let t10 = _s(e17.steps, (e18) => typeof e18 == `string` ? e18 : void 0), n10 = t10.steps.map((e18, t11) => `${t11 + 1}. ${e18.text}`).join(` `);
  return `${t10.title || `Ablaufplan`}. ${n10}`.trim();
}
var Ts = Uo({ cls: `lh-ct-steps`, view: Ss, label: ws, hit(e17, t10) {
  let n10 = Ts.item(e17);
  if (!n10) return;
  let r10 = _s(n10.steps, (e18) => typeof e18 == `string` ? e18 : void 0), i10 = bs(e17);
  if (t10 === `reset`) {
    i10.clear(), Ts.redraw(e17);
    return;
  }
  let a10 = Number(t10.slice(2)), o10 = r10.steps[a10];
  if (o10) {
    if (r10.tick) {
      if (i10.has(a10) ? i10.delete(a10) : i10.add(a10), Ts.redraw(e17), i10.size === r10.steps.length) {
        vi(), M(`${o10.text}. Geschafft!`);
        return;
      }
      if (!i10.has(a10)) return;
    }
    o10.text && M(o10.text);
  }
} });
var Es = Ts.draw;
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
function Rc(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (Array.isArray(n10.contacts) ? n10.contacts : []).slice(0, 6).flatMap((e18) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, r11 = typeof n11.name == `string` ? n11.name.slice(0, 30) : ``, i10 = typeof n11.number == `string` ? n11.number.replace(/[^\d *#+/-]/g, ``).slice(0, 20) : ``, a10 = t10(n11.img);
    return r11 || i10 ? [{ name: r11, number: i10, ...a10 ? { img: a10 } : {} }] : [];
  });
  return { mode: n10.mode === `free` || n10.mode === `sos` ? n10.mode : `call`, contacts: r10, show: n10.show !== false, sos: n10.sos === `110` ? `110` : `112` };
}
var Bc = (e17) => e17.replace(/\D/g, ``);
var Vc = { 0: `null`, 1: `eins`, 2: `zwei`, 3: `drei`, 4: `vier`, 5: `f\xFCnf`, 6: `sechs`, 7: `sieben`, 8: `acht`, 9: `neun`, "*": `Stern`, "#": `Raute` };
var Hc = (e17) => [...e17].map((e18) => Vc[e18]).filter(Boolean).join(` `);
var Uc = { 112: [{ ask: `Notruf Feuerwehr und Rettungsdienst. Wo ist der Notfall?`, hint: `Sag, wo du bist: Stra\xDFe, Hausnummer, Ort.`, word: `Wo?` }, { ask: `Was ist passiert?`, hint: `Sag, was los ist: ein Unfall, ein Feuer, jemand ist verletzt.`, word: `Was?` }, { ask: `Wie viele Menschen sind verletzt?`, hint: `Sag, wie viele es sind.`, word: `Wie viele?` }, { ask: `Wie hei\xDFt du?`, hint: `Sag deinen Namen.`, word: `Wer?` }, { ask: `Bleib bitte am Telefon. Hast du alles gesagt?`, hint: `Warte. Leg nicht auf, bis die Leitstelle fertig ist.`, word: `Warten!` }], 110: [{ ask: `Polizei Notruf. Wo bist du?`, hint: `Sag, wo du bist: Stra\xDFe, Hausnummer, Ort.`, word: `Wo?` }, { ask: `Was ist passiert?`, hint: `Sag, was los ist.`, word: `Was?` }, { ask: `Ist jemand verletzt?`, hint: `Sag, ob jemand verletzt ist.`, word: `Verletzt?` }, { ask: `Wie hei\xDFt du?`, hint: `Sag deinen Namen.`, word: `Wer?` }, { ask: `Bleib bitte am Telefon. Hast du alles gesagt?`, hint: `Warte. Leg nicht auf.`, word: `Warten!` }] };
var Wc = /* @__PURE__ */ new Map();
var Gc = (e17, t10) => {
  let n10 = Wc.get(e17);
  return n10 && t10 !== void 0 && n10.key !== t10 && (clearTimeout(n10.timer), n10.status !== `idle` && ms(), Wc.delete(e17), n10 = void 0), n10 || Wc.set(e17, n10 = { key: t10 ?? ``, num: ``, status: `idle`, who: -1, step: 0, task: 0, timer: 0 }), n10;
};
var Kc = [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `*`, `0`, `#`];
function qc(e17, t10, n10) {
  let r10 = Rc(e17.phone, (e18) => typeof e18 == `string` ? e18 : void 0), i10 = Math.max(500, e17.w), a10 = Math.max(400, e17.h), o10 = t10 ? Gc(e17.id, JSON.stringify(e17.phone ?? {})) : null, s10 = [], c10 = `<rect x="0" y="0" width="${i10}" height="${a10}" rx="20" fill="${r10.mode === `sos` ? `#fff5f5` : `#f8f9fa`}"/>`, l10 = a10 - 40, u10 = Math.min(i10 * 0.4, l10 * 0.56);
  c10 += `<rect x="30" y="20" width="${A(u10)}" height="${A(l10)}" rx="${A(u10 * 0.12)}" fill="#212529"/>`;
  let d10 = 30 + u10 * 0.07, f10 = u10 * 0.86, p10 = 20 + u10 * 0.1, m10 = l10 * 0.24;
  c10 += `<rect x="${A(d10)}" y="${A(p10)}" width="${A(f10)}" height="${A(m10)}" rx="14" fill="#e9fac8"/>`;
  let h10 = o10?.num ?? ``, g10 = o10?.status ?? `idle`, _10 = o10 && o10.who >= 0 ? r10.contacts[o10.who] : void 0, v10 = g10 === `ring` ? `Es klingelt \u2026` : (g10 === `talk` || g10 === `done`) && _10 ? `${_10.name} ist dran` : g10 === `sos` || g10 === `done` ? `Notruf ${r10.sos} (\xDCbung)` : g10 === `none` ? `Kein Anschluss` : r10.mode === `sos` ? `W\xE4hle ${r10.sos}` : `Tippe die Nummer`;
  c10 += `<text x="${A(d10 + f10 / 2)}" y="${A(p10 + m10 * 0.3)}" text-anchor="middle" font-family="${j}" font-size="${A(m10 * 0.15)}" fill="#495057">${Bo(v10)}</text>`;
  let y10 = h10 || ` `, b10 = Math.min(m10 * 0.36, (f10 - 20) / Math.max(4, y10.length * 0.62));
  c10 += `<text x="${A(d10 + f10 / 2)}" y="${A(p10 + m10 * 0.76)}" text-anchor="middle" font-family="${j}" font-size="${A(b10)}" font-weight="700" fill="#1f2937" letter-spacing="2">${Bo(y10)}</text>`;
  let x10 = p10 + m10 + l10 * 0.04, S10 = (20 + l10 - x10 - u10 * 0.06) / 5, C10 = f10 / 3;
  Kc.forEach((e18, n11) => {
    let r11 = d10 + C10 * (n11 % 3 + 0.5), i11 = x10 + S10 * (Math.floor(n11 / 3) + 0.5), a11 = Math.min(C10, S10) * 0.42;
    c10 += `<g${Vo(t10, `k:${e18}`)}><circle cx="${A(r11)}" cy="${A(i11)}" r="${A(a11)}" fill="#495057"/><text x="${A(r11)}" y="${A(i11 + a11 * 0.36)}" text-anchor="middle" font-family="${j}" font-size="${A(a11)}" font-weight="700" fill="#ffffff">${e18}</text></g>`;
  });
  let w10 = x10 + S10 * 4.5, T10 = Math.min(C10, S10) * 0.44, E10 = g10 === `ring` || g10 === `talk` || g10 === `sos`;
  c10 += `<g${Vo(t10, `del`)}><title>L\xF6schen</title><circle cx="${A(d10 + C10 * 0.5)}" cy="${A(w10)}" r="${A(T10 * 0.8)}" fill="#343a40"/><path d="M${A(d10 + C10 * 0.5 + T10 * 0.35)} ${A(w10 - T10 * 0.3)}h${A(-T10 * 0.5)}l${A(-T10 * 0.3)} ${A(T10 * 0.3)}l${A(T10 * 0.3)} ${A(T10 * 0.3)}h${A(T10 * 0.5)}z" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></g>`, c10 += `<g${Vo(t10, E10 ? `end` : `call`)}><title>${E10 ? `Auflegen` : `Anrufen`}</title><circle cx="${A(d10 + C10 * 1.5)}" cy="${A(w10)}" r="${A(T10)}" fill="${E10 ? `#e03131` : `#2f9e44`}"/>${Yc(d10 + C10 * 1.5, w10, T10, E10)}</g>`;
  let D10 = 30 + u10 + 40, O10 = i10 - D10 - 30;
  return O10 > 120 && (r10.mode === `free` ? c10 += Zc(r10, D10, O10, a10, t10, n10, s10) : r10.mode === `call` ? c10 += Qc(r10, o10, D10, O10, a10, t10, n10, s10) : c10 += $c(r10, o10, D10, O10, a10, t10)), { body: c10, vw: i10, vh: a10, pics: s10.filter((e18) => e18.src) };
}
var Jc = `<path d="M26 52C30 22 70 22 74 52" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round"/><path d="M4 56c0-8 6-12 14-12h12c8 0 12 5 12 11v6c0 7-6 10-12 10H16C8 71 4 66 4 60z" fill="#fff"/><path d="M96 56c0-8-6-12-14-12H70c-8 0-12 5-12 11v6c0 7 6 10 12 10h14c8 0 12-5 12-11z" fill="#fff"/>`;
function Yc(e17, t10, n10, r10) {
  let i10 = n10 * 1.3 / 100;
  return `<g transform="translate(${A(e17)} ${A(t10)}) scale(${A(i10 * 100) / 100}) rotate(${r10 ? 0 : -135}) translate(-50 ${r10 ? -50 : -48})" pointer-events="none">${Jc}</g>`;
}
function Xc(e17, t10, n10, r10, i10, a10, o10, s10, c10, l10) {
  let u10 = `<g${Vo(o10, a10)}><rect x="${A(t10)}" y="${A(n10)}" width="${A(r10)}" height="${A(i10)}" rx="14" fill="#ffffff" stroke="#dee2e6" stroke-width="3"/>`, d10 = i10 - 16;
  e17.img && s10(e17.img) ? c10.push({ src: s10(e17.img), x: t10 + 8, y: n10 + 8, w: d10, h: d10 }) : u10 += `<circle cx="${A(t10 + 8 + d10 / 2)}" cy="${A(n10 + i10 / 2)}" r="${A(d10 / 2)}" fill="#d0ebff"/><text x="${A(t10 + 8 + d10 / 2)}" y="${A(n10 + i10 / 2 + d10 * 0.18)}" text-anchor="middle" font-family="${j}" font-size="${A(d10 * 0.5)}" font-weight="700" fill="#1c7ed6">${Bo(e17.name.slice(0, 1).toUpperCase())}</text>`;
  let f10 = t10 + d10 + 24;
  return u10 += `<text x="${A(f10)}" y="${A(n10 + i10 * (l10 ? 0.43 : 0.6))}" font-family="${j}" font-size="${A(Math.min(34, i10 * 0.32))}" font-weight="700" fill="#1f2937">${Bo(e17.name)}</text>`, l10 && (u10 += `<text x="${A(f10)}" y="${A(n10 + i10 * 0.8)}" font-family="${j}" font-size="${A(Math.min(28, i10 * 0.26))}" fill="#495057" letter-spacing="1">${Bo(e17.number)}</text>`), u10 + `</g>`;
}
function Zc(e17, t10, n10, r10, i10, a10, o10) {
  let s10 = `<text x="${A(t10)}" y="62" font-family="${j}" font-size="38" font-weight="700" fill="#1f2937">Telefonbuch</text>`, c10 = Math.max(1, e17.contacts.length), l10 = Math.min(110, (r10 - 110) / c10 - 12);
  return e17.contacts.forEach((e18, r11) => s10 += Xc(e18, t10, 90 + r11 * (l10 + 12), n10, l10, `c:${r11}`, i10, a10, o10, true)), e17.contacts.length || (s10 += `<text x="${A(t10)}" y="130" font-family="${j}" font-size="26" fill="#868e96">Noch keine Kontakte \u2013 tippe auf \u201EEinstellen\u201C.</text>`), s10;
}
function Qc(e17, t10, n10, r10, i10, a10, o10, s10) {
  let c10 = e17.contacts[(t10?.task ?? 0) % Math.max(1, e17.contacts.length)];
  if (!c10) return `<text x="${A(n10)}" y="130" font-family="${j}" font-size="26" fill="#868e96">Noch keine Kontakte \u2013 tippe auf \u201EEinstellen\u201C.</text>`;
  let l10 = `<text x="${A(n10 + r10 / 2)}" y="70" text-anchor="middle" font-family="${j}" font-size="46" font-weight="700" fill="#1f2937">Ruf ${Bo(c10.name)} an!</text>`, u10 = Math.min(r10 * 0.6, i10 - 330);
  return c10.img && o10(c10.img) ? s10.push({ src: o10(c10.img), x: n10 + (r10 - u10) / 2, y: 100, w: u10, h: u10 }) : l10 += `<circle cx="${A(n10 + r10 / 2)}" cy="${A(100 + u10 / 2)}" r="${A(u10 / 2)}" fill="#d0ebff"/><text x="${A(n10 + r10 / 2)}" y="${A(100 + u10 / 2 + u10 * 0.18)}" text-anchor="middle" font-family="${j}" font-size="${A(u10 * 0.5)}" font-weight="700" fill="#1c7ed6">${Bo(c10.name.slice(0, 1).toUpperCase())}</text>`, e17.show && (l10 += `<text x="${A(n10 + r10 / 2)}" y="${A(100 + u10 + 60)}" text-anchor="middle" font-family="${j}" font-size="44" font-weight="700" fill="#1c7ed6" letter-spacing="3">${Bo(c10.number)}</text>`), a10 && e17.contacts.length > 1 && (l10 += `<g${Vo(a10, `next`)}><rect x="${A(n10 + r10 / 2 - 150)}" y="${A(i10 - 100)}" width="300" height="70" rx="35" fill="#ffffff" stroke="#1c7ed6" stroke-width="4"/><text x="${A(n10 + r10 / 2)}" y="${A(i10 - 54)}" text-anchor="middle" font-family="${j}" font-size="30" font-weight="700" fill="#1c7ed6">Andere Aufgabe</text></g>`), a10 && t10?.status === `done` && (l10 += `<g class="lh-pop"><circle cx="${A(n10 + r10 - 50)}" cy="120" r="44" fill="#2f9e44"/><path d="M${A(n10 + r10 - 72)} 120l15 15 28-30" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g>`), l10;
}
function $c(e17, t10, n10, r10, i10, a10) {
  let o10 = Uc[e17.sos], s10 = t10 && (t10.status === `sos` || t10.status === `done`) ? t10.step : -1, c10 = `<rect x="${A(n10)}" y="20" width="${A(r10)}" height="64" rx="14" fill="#e03131"/><text x="${A(n10 + r10 / 2)}" y="64" text-anchor="middle" font-family="${j}" font-size="30" font-weight="700" fill="#fff">Nur zum \xDCben! ${e17.sos} nur im echten Notfall.</text>`;
  c10 += `<text x="${A(n10)}" y="134" font-family="${j}" font-size="34" font-weight="700" fill="#1f2937">${e17.sos === `112` ? `Notruf 112: Feuerwehr und Rettungsdienst` : `Notruf 110: Polizei`}</text>`;
  let l10 = Math.min(96, (i10 - 290) / o10.length - 10);
  return o10.forEach((e18, i11) => {
    let a11 = 160 + i11 * (l10 + 10), o11 = i11 === s10, u10 = s10 > i11 || t10?.status === `done`;
    c10 += `<rect x="${A(n10)}" y="${A(a11)}" width="${A(r10)}" height="${A(l10)}" rx="14" fill="${o11 ? `#fff3bf` : `#ffffff`}" stroke="${o11 ? `#f08c00` : u10 ? `#2f9e44` : `#dee2e6`}" stroke-width="${o11 ? 6 : 3}"/>`, c10 += `<text x="${A(n10 + 20)}" y="${A(a11 + l10 * 0.6)}" font-family="${j}" font-size="${A(Math.min(34, l10 * 0.38))}" font-weight="700" fill="${u10 ? `#2f9e44` : `#e03131`}">${Bo(e18.word)}</text>`;
    let d10 = Ko(e18.hint, r10 - 230, l10 - 10, Math.min(26, l10 * 0.3), 12, 2);
    c10 += qo(d10.lines, n10 + 200, a11 + l10 / 2, d10.size, `fill="#343a40"`, `start`);
  }), a10 && t10?.status === `sos` && (c10 += `<g${Vo(a10, `go`)}><rect x="${A(n10 + r10 / 2 - 140)}" y="${A(i10 - 104)}" width="280" height="76" rx="38" fill="#2f9e44"/><text x="${A(n10 + r10 / 2)}" y="${A(i10 - 54)}" text-anchor="middle" font-family="${j}" font-size="34" font-weight="700" fill="#fff">Weiter</text></g>`), a10 && t10?.status === `done` && (c10 += `<text x="${A(n10 + r10 / 2)}" y="${A(i10 - 56)}" text-anchor="middle" font-family="${j}" font-size="34" font-weight="700" fill="#2f9e44">Gut gemacht! Hilfe ist unterwegs.</text>`), c10;
}
function el(e17) {
  let t10 = zr();
  if (!t10) return;
  let n10 = t10.currentTime + 0.05;
  for (let r10 = 0; r10 < e17; r10++) {
    let e18 = t10.createOscillator(), i10 = t10.createGain();
    e18.frequency.value = 425, i10.gain.setValueAtTime(0, n10 + r10 * 2), i10.gain.linearRampToValueAtTime(0.12, n10 + r10 * 2 + 0.02), i10.gain.setValueAtTime(0.12, n10 + r10 * 2 + 0.95), i10.gain.linearRampToValueAtTime(0, n10 + r10 * 2 + 1), e18.connect(i10).connect(t10.destination), e18.start(n10 + r10 * 2), e18.stop(n10 + r10 * 2 + 1.05);
  }
}
var tl = [1.25, 0.8, 1.1, 0.9, 1.35, 0.7];
function nl(e17) {
  let t10 = al.item(e17);
  if (!t10) return;
  let n10 = Rc(t10.phone, (e18) => typeof e18 == `string` ? e18 : void 0), r10 = Gc(e17), i10 = Bc(r10.num);
  i10 ? (ms(), r10.status = `ring`, al.redraw(e17), el(2), clearTimeout(r10.timer), r10.timer = window.setTimeout(() => {
    if (r10.status !== `ring`) return;
    if (n10.mode === `sos` && i10 === n10.sos) {
      r10.status = `sos`, r10.step = 0, al.redraw(e17), M(Uc[n10.sos][0].ask, void 0, { pitch: 0.85 });
      return;
    }
    if (i10 === `112` || i10 === `110`) {
      r10.status = `none`, al.redraw(e17), M(`Das ist die Nummer f\xFCr den Notruf. Die rufst du nur im echten Notfall an.`);
      return;
    }
    let t11 = n10.contacts.findIndex((e18) => Bc(e18.number) === i10);
    if (t11 < 0) {
      r10.status = `none`, al.redraw(e17), yi(), M(`Kein Anschluss unter dieser Nummer.`);
      return;
    }
    r10.who = t11, r10.status = `talk`;
    let a10 = n10.contacts[t11], o10 = n10.mode === `call` ? r10.task % n10.contacts.length : t11;
    al.redraw(e17), n10.mode === `call` && o10 === t11 ? (r10.status = `done`, al.redraw(e17), vi(), M(`Hallo, hier ist ${a10.name}! Sch\xF6n, dass du anrufst.`, void 0, { pitch: tl[t11 % tl.length] })) : n10.mode === `call` ? M(`Hallo, hier ist ${a10.name}. Du wolltest doch ${n10.contacts[o10].name} anrufen!`, void 0, { pitch: tl[t11 % tl.length] }) : M(`Hallo, hier ist ${a10.name}!`, void 0, { pitch: tl[t11 % tl.length] });
  }, 3600)) : M(`Tippe zuerst die Nummer.`);
}
function rl(e17) {
  let t10 = Gc(e17);
  clearTimeout(t10.timer), ms(), t10.status = `idle`, t10.who = -1, t10.num = ``, al.redraw(e17);
}
function il(e17) {
  let t10 = Rc(e17.phone, (e18) => typeof e18 == `string` ? e18 : void 0);
  if (t10.mode === `sos`) return `Notruf \xFCben. W\xE4hle ${Hc(t10.sos)}.`;
  if (t10.mode === `call`) {
    let n10 = t10.contacts[(Wc.get(e17.id)?.task ?? 0) % Math.max(1, t10.contacts.length)];
    return n10 ? `Ruf ${n10.name} an!${t10.show ? ` Die Nummer ist ${Hc(n10.number)}.` : ``}` : `Telefon.`;
  }
  return `Telefon. ${t10.contacts.map((e18) => e18.name).join(`, `)}.`;
}
var al = Uo({ cls: `lh-ct-phone`, view: qc, label: il, sounds: true, hit(e17, t10) {
  let n10 = al.item(e17);
  if (!n10) return;
  let r10 = Rc(n10.phone, (e18) => typeof e18 == `string` ? e18 : void 0), i10 = Gc(e17);
  if (t10.startsWith(`k:`)) {
    let e18 = t10.slice(2);
    if (i10.status !== `idle` && i10.status !== `none`) {
      _i();
      return;
    }
    i10.status = `idle`, i10.num.length < 16 && (i10.num += e18), _i(), M(Vc[e18] ?? e18);
  } else if (t10 === `del`) i10.status === `none` && (i10.status = `idle`), i10.num = i10.num.slice(0, -1), _i();
  else if (t10 === `call`) return nl(e17);
  else if (t10 === `end`) return rl(e17);
  else if (t10 === `next`) {
    i10.task = (i10.task + 1) % Math.max(1, r10.contacts.length), rl(e17), M(il(n10));
    return;
  } else if (t10 === `go` && i10.status === `sos`) {
    let e18 = Uc[r10.sos];
    i10.step++, i10.step >= e18.length ? (i10.status = `done`, vi(), M(`Danke. Die Hilfe ist unterwegs. Das hast du sehr gut gemacht!`, void 0, { pitch: 0.85 })) : M(e18[i10.step].ask, void 0, { pitch: 0.85 });
  } else if (t10.startsWith(`c:`)) {
    let e18 = r10.contacts[Number(t10.slice(2))];
    e18 && M(`${e18.name}: ${Hc(e18.number)}`);
    return;
  }
  al.redraw(e17);
} });
var ol = al.draw;
function cl(e17, t10) {
  let n10 = e17[0]?.length ?? 0, r10 = Math.max(1, e17.length), i10 = new DataView(new ArrayBuffer(44 + n10 * r10 * 2)), a10 = (e18, t11) => [...t11].forEach((t12, n11) => i10.setUint8(e18 + n11, t12.charCodeAt(0)));
  a10(0, `RIFF`), i10.setUint32(4, 36 + n10 * r10 * 2, true), a10(8, `WAVEfmt `), i10.setUint32(16, 16, true), i10.setUint16(20, 1, true), i10.setUint16(22, r10, true), i10.setUint32(24, t10, true), i10.setUint32(28, t10 * r10 * 2, true), i10.setUint16(32, r10 * 2, true), i10.setUint16(34, 16, true), a10(36, `data`), i10.setUint32(40, n10 * r10 * 2, true);
  let o10 = 44;
  for (let t11 = 0; t11 < n10; t11++) for (let n11 = 0; n11 < r10; n11++) {
    let r11 = Math.max(-1, Math.min(1, e17[n11][t11]));
    i10.setInt16(o10, r11 < 0 ? r11 * 32768 : r11 * 32767, true), o10 += 2;
  }
  return new Blob([i10.buffer], { type: `audio/wav` });
}
async function dl(e17, t10) {
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
var _te = `
.lh-kp-back{position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,42,.45);display:flex;align-items:flex-start;justify-content:center;padding:max(16px,env(safe-area-inset-top)) 16px 16px;overflow:auto;font-family:'Andika',Andika,system-ui,sans-serif;-webkit-user-select:text;user-select:text}
.lh-kp-sheet{background:#fff;color:#1f2937;border-radius:20px;box-shadow:0 20px 50px rgba(0,0,0,.3);width:min(640px,100%);padding:20px 22px 18px;border-top:10px solid var(--kp,#7048e8)}
.lh-kp-sheet h2{margin:0 0 4px;font-size:26px;line-height:1.2}
.lh-kp-sheet p{margin:8px 0;font-size:19px;line-height:1.4}
.lh-kp-sheet small{display:block;color:#64748b;font-size:15px;line-height:1.35;margin-top:6px}
.lh-kp-sheet textarea,.lh-kp-sheet input{width:100%;box-sizing:border-box;font:inherit;font-size:22px;line-height:1.35;border:3px solid #ced4da;border-radius:14px;padding:10px 12px;background:#fff;color:#1f2937}
.lh-kp-sheet textarea{resize:vertical;min-height:120px}
.lh-kp-sheet textarea:focus,.lh-kp-sheet input:focus{outline:none;border-color:var(--kp,#7048e8)}
.lh-kp-sheet input.is-bad{border-color:#e03131}
.lh-kp-sheet label{display:block;font-size:18px;font-weight:700;margin:12px 0 4px}
.lh-kp-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;margin-top:14px}
.lh-kp-sheet button{font:inherit;font-size:20px;font-weight:700;border-radius:999px;padding:12px 22px;border:3px solid #ced4da;background:#fff;color:#1f2937;cursor:pointer;min-height:52px}
.lh-kp-sheet button.is-main{background:var(--kp,#7048e8);border-color:var(--kp,#7048e8);color:#fff}
.lh-kp-sheet button.is-on{background:var(--kp,#7048e8);border-color:var(--kp,#7048e8);color:#fff}
.lh-kp-sheet button.is-danger{color:#c92a2a;border-color:#ffc9c9;margin-right:auto}`;
function vte() {
  if (document.getElementById(`lh-sheet-css`)) return;
  let e17 = document.createElement(`style`);
  e17.id = `lh-sheet-css`, e17.textContent = _te, document.head.appendChild(e17);
}
function Fl(e17, t10) {
  vte(), document.querySelector(`.lh-kp-back`)?.remove();
  let n10 = document.createElement(`div`);
  n10.className = `lh-kp-back bd-ui`, n10.dataset.overlayOpen = `true`;
  let r10 = document.createElement(`div`);
  r10.className = `lh-kp-sheet`, r10.setAttribute(`role`, `dialog`), r10.setAttribute(`aria-modal`, `true`), r10.setAttribute(`aria-label`, t10), r10.style.setProperty(`--kp`, e17), n10.append(r10);
  let i10 = () => n10.remove();
  return n10.addEventListener(`pointerdown`, (e18) => e18.target === n10 && i10()), n10.addEventListener(`keydown`, (e18) => {
    e18.key === `Escape` && (e18.preventDefault(), i10()), e18.stopPropagation();
  }), document.body.appendChild(n10), { back: n10, box: r10, close: i10 };
}
var Il = (e17, t10 = ``, n10 = ``) => {
  let r10 = document.createElement(e17);
  return t10 && (r10.className = t10), n10 && (r10.textContent = n10), r10;
};
var lu = [{ id: `low`, label: `Tief`, k: 0.62 }, { id: `normal`, label: `Normal`, k: 1 }, { id: `high`, label: `Hoch`, k: 1.45 }];
var pu = 30;
var mu = /* @__PURE__ */ new Map();
function hu(e17) {
  let t10 = mu.get(e17);
  return t10 || (t10 = (async () => {
    try {
      let t11 = await (await fetch(e17)).arrayBuffer(), n10 = window.OfflineAudioContext ?? window.webkitOfflineAudioContext;
      if (!n10) return null;
      let r10 = new n10(1, 1, 22050), i10 = await new Promise((e18, n11) => {
        let i11 = r10.decodeAudioData(t11, e18, n11);
        i11 && typeof i11.then == `function` && i11.then(e18, n11);
      }), a10 = i10.getChannelData(0), o10 = Math.max(1, Math.floor(i10.sampleRate / pu)), s10 = Math.ceil(a10.length / o10), c10 = new Float32Array(s10);
      for (let e18 = 0; e18 < s10; e18++) {
        let t12 = 0, n11 = Math.min(a10.length, (e18 + 1) * o10);
        for (let r11 = e18 * o10; r11 < n11; r11++) t12 += a10[r11] * a10[r11];
        c10[e18] = Math.sqrt(t12 / Math.max(1, n11 - e18 * o10));
      }
      let l10 = Array.from(c10).filter((e18) => e18 > 4e-3).sort((e18, t12) => e18 - t12), u10 = l10.length ? l10[Math.floor(l10.length * 0.9)] : 1, d10 = new Float32Array(s10);
      for (let e18 = 0; e18 < s10; e18++) {
        let t12 = c10[e18] / (u10 * 0.85);
        d10[e18] = t12 < 0.18 ? 0 : Math.min(1, t12);
      }
      return d10;
    } catch {
      return null;
    }
  })(), mu.set(e17, t10), t10);
}
function gu(e17) {
  let t10 = true, n10 = 0, r10 = 0, i10 = 0, a10 = false, o10 = performance.now(), s10 = e17.url ? hu(e17.url) : null, c10 = null;
  s10?.then((e18) => {
    c10 = e18;
  });
  let l10 = lu.find((t11) => t11.id === e17.pitch)?.k ?? 1, u10 = e17.url ? M(``, e17.url, { onVoice: () => r10 = performance.now() }) : M(e17.text ?? ``, void 0, { pitch: l10, rate: l10 < 1 ? 0.92 : 1, onVoice: () => r10 = performance.now() }), d10 = -1, f10 = (s11) => {
    if (a10) return;
    let l11 = 0;
    if (t10 && r10) {
      let e18 = s11 - r10;
      l11 = c10 ? c10[Math.floor(e18 / 1e3 * pu)] ?? 0 : Math.abs(Math.sin(e18 / 85)) * (0.4 + 0.6 * Math.abs(Math.sin(e18 / 270 + 1)));
    }
    let u11 = Math.round(l11 * 6) / 6;
    u11 !== d10 && (d10 = u11, e17.mouth(u11)), e17.frame?.(s11 - o10, t10), !t10 && !n10 && (n10 = s11), t10 || s11 - o10 < Math.max(300, e17.minMs ?? 0) || s11 - n10 < (e17.after ?? 0) ? i10 = requestAnimationFrame(f10) : (e17.mouth(-1), e17.frame?.(s11 - o10, false));
  };
  return i10 = requestAnimationFrame(f10), { done: u10.then(() => {
    t10 = false;
  }), stop: () => {
    a10 = true, t10 = false, cancelAnimationFrame(i10), e17.mouth(-1);
  } };
}
function _u(e17, t10) {
  let n10 = t10?.width || 800, r10 = t10?.height || 600, i10 = e17.x1 * n10, a10 = e17.y1 * r10, o10 = e17.x2 * n10, s10 = e17.y2 * r10;
  return { W: n10, H: r10, cx: (i10 + o10) / 2, cy: (a10 + s10) / 2, len: Math.max(8, Math.hypot(o10 - i10, s10 - a10)), angle: Math.atan2(s10 - a10, o10 - i10) * 180 / Math.PI };
}
var vu = (e17) => e17.toFixed(1);
function yu(e17, t10, n10, r10, i10) {
  let a10 = t10.len, o10 = a10 / 2;
  if (e17.style === `comic`) {
    let e18 = Math.max(0, r10);
    if (e18 < 0.05) return `<path d="M${vu(-o10)} 0Q0 ${vu(a10 * 0.22)} ${vu(o10)} 0" fill="none" stroke="#111827" stroke-width="${vu(Math.max(3, a10 * 0.06))}" stroke-linecap="round"/>`;
    let t11 = a10 * (0.15 + 0.55 * e18);
    return `<path d="M${vu(-o10)} 0Q0 ${vu(t11 * 1.6)} ${vu(o10)} 0Q0 ${vu(t11 * 0.2)} ${vu(-o10)} 0Z" fill="#7f1d1d" stroke="#111827" stroke-width="${vu(Math.max(3, a10 * 0.055))}" stroke-linejoin="round"/><ellipse cx="0" cy="${vu(t11 * 0.62)}" rx="${vu(o10 * 0.42)}" ry="${vu(t11 * 0.22)}" fill="#f87171"/>`;
  }
  let s10 = Math.max(0, r10);
  if (s10 < 0.04) return ``;
  let c10 = a10 * (e17.style === `normal` ? 0.32 : e17.style === `animal` ? 0.5 : 0.55) * s10, l10 = o10 * (e17.style === `normal` ? 0.92 : 1.05), u10 = e17.style === `monster` ? `#14070a` : e17.style === `animal` ? `#4c0519` : `#2a0a0a`, d10 = `<path d="M${vu(-l10)} 0Q0 ${vu(-c10 * 0.12)} ${vu(l10)} 0L${vu(l10 * 0.8)} ${vu(c10 * 0.9)}Q0 ${vu(c10 * 1.25)} ${vu(-l10 * 0.8)} ${vu(c10 * 0.9)}Z" fill="${u10}"/>`;
  if (e17.style === `animal` && (d10 += `<ellipse cx="0" cy="${vu(c10 * 0.85)}" rx="${vu(l10 * 0.55)}" ry="${vu(c10 * 0.3)}" fill="#fb7185"/>`), e17.style === `normal` && c10 > a10 * 0.08 && (d10 += `<path d="M${vu(-l10 * 0.7)} ${vu(c10 * 0.02)}H${vu(l10 * 0.7)}V${vu(c10 * 0.16)}Q0 ${vu(c10 * 0.24)} ${vu(-l10 * 0.7)} ${vu(c10 * 0.16)}Z" fill="#f8fafc" opacity=".85"/>`), e17.style === `monster`) {
    let e18 = 2 * l10 / 6, t11 = ``;
    for (let n11 = 0; n11 < 6; n11++) t11 += `M${vu(-l10 + n11 * e18)} 0l${vu(e18 / 2)} ${vu(Math.min(c10 * 0.45, a10 * 0.16))}l${vu(e18 / 2)} ${vu(-Math.min(c10 * 0.45, a10 * 0.16))}`;
    d10 += `<path d="${t11}Z" fill="#fff" stroke="#e5e7eb" stroke-width="1"/>`;
  }
  let f10 = a10 * 0.75;
  if (d10 += `<g transform="translate(0 ${vu(c10)})"><clipPath id="${i10}"><path d="M${vu(-o10 * 1.5)} 0A${vu(o10 * 1.5)} ${vu(f10)} 0 0 0 ${vu(o10 * 1.5)} 0Z"/></clipPath><g clip-path="url(#${i10})"><use href="#${n10}" transform="rotate(${vu(-t10.angle)}) translate(${vu(-t10.cx)} ${vu(-t10.cy)})"/></g>`, e17.style === `monster`) {
    let e18 = 2 * l10 * 0.9 / 5, t11 = `M${vu(-l10 * 0.9)} 0`;
    for (let n11 = 0; n11 < 5; n11++) t11 += `l${vu(e18 / 2)} ${vu(-Math.min(c10 * 0.4, a10 * 0.14))}l${vu(e18 / 2)} ${vu(Math.min(c10 * 0.4, a10 * 0.14))}`;
    d10 += `<path d="${t11}Z" fill="#fff" stroke="#e5e7eb" stroke-width="1"/>`;
  }
  return d10 + `</g>`;
}
function bu(e17, t10, n10, r10, i10 = -1) {
  let a10 = _u(e17, t10);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="lh-pt-svg" viewBox="0 0 ${a10.W} ${a10.H}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"><image id="lh-pti-${r10}" href="${n10}" width="${a10.W}" height="${a10.H}"/><g transform="translate(${vu(a10.cx)} ${vu(a10.cy)}) rotate(${vu(a10.angle)})" class="lh-pt-mouth">${yu(e17, a10, `lh-pti-${r10}`, i10, `lh-pt-${r10}`)}</g></svg>`;
}
function xu(e17, t10, n10, r10, i10) {
  e17.innerHTML = yu(t10, _u(t10, n10), `lh-pti-${r10}`, i10, `lh-pt-${r10}`);
}
var Cu = /* @__PURE__ */ new Map();
var wu = /* @__PURE__ */ new WeakMap();
var Tu = /* @__PURE__ */ new Set();
var Eu = /* @__PURE__ */ new Set();
function Du(e17, t10) {
  let n10 = t10?.querySelector(`svg.lh-pt-svg`), r10 = e17.pt;
  if (!n10 || !r10 || !t10) return;
  let i10 = Cu.get(e17.id)?.assets, a10 = Cu.get(e17.id)?.assetUrl, o10 = i10?.[r10.img], s10 = n10.querySelector(`.lh-pt-mouth`);
  if (!s10) return;
  wu.get(n10)?.stop();
  let c10 = e17.say, l10 = c10?.sound ? i10?.[c10.sound] : void 0, u10 = l10 ? a10 ? a10(l10) : l10.dataUrl : void 0, d10 = c10?.text?.trim() || (u10 ? `` : `Hallo!`);
  for (let n11 of Eu) if (n11(e17, t10, !!u10)) return;
  let f10 = gu({ text: d10, url: u10, pitch: c10?.pitch ?? (r10.style === `monster` ? `low` : `normal`), mouth: (t11) => xu(s10, r10, o10, e17.id, t11) });
  wu.set(n10, f10);
  for (let t11 of Tu) t11(e17.id, f10.done);
  return f10;
}
function Ou(e17, t10, n10, r10) {
  let i10 = t10?.querySelector(`svg.lh-pt-svg`), a10 = e17.pt, o10 = i10?.querySelector(`.lh-pt-mouth`);
  if (!i10 || !a10 || !o10) return;
  let s10 = Cu.get(e17.id)?.assets?.[a10.img];
  wu.get(i10)?.stop();
  let c10 = performance.now(), l10 = 0, u10 = NaN, d10 = (t11) => {
    t11 !== u10 && (u10 = t11, xu(o10, a10, s10, e17.id, t11));
  }, f10 = (e18) => {
    let t11 = e18 - c10;
    d10(t11 < n10 ? Math.round(r10(t11) * 6) / 6 : -1), t11 < n10 && (l10 = requestAnimationFrame(f10));
  };
  l10 = requestAnimationFrame(f10), wu.set(i10, { done: new Promise((e18) => setTimeout(e18, n10)), stop: () => (cancelAnimationFrame(l10), d10(-1)) });
}
var ku = [{ id: `happy`, label: `fr\xF6hlich`, say: `Ich bin fr\xF6hlich.` }, { id: `sad`, label: `traurig`, say: `Ich bin traurig.` }, { id: `angry`, label: `w\xFCtend`, say: `Ich bin w\xFCtend.` }, { id: `scared`, label: `\xE4ngstlich`, say: `Ich habe Angst.` }, { id: `surprised`, label: `\xFCberrascht`, say: `Ich bin \xFCberrascht.` }, { id: `tired`, label: `m\xFCde`, say: `Ich bin m\xFCde.` }];
var Au = [{ id: `talk`, label: `Mit den H\xE4nden reden` }, { id: `wave`, label: `Winken` }, { id: `cross`, label: `Arme verschr\xE4nken` }, { id: `dance`, label: `Tanzen` }, { id: `jump`, label: `H\xFCpfen` }, { id: `bow`, label: `Verbeugen` }, { id: `clap`, label: `Klatschen` }, { id: `cheer`, label: `Jubeln` }, { id: `random`, label: `Zuf\xE4llig` }];
var ju = { armL: 7, armR: -7, legL: 0, legR: 0, bob: 0, up: 0, dip: 0, squash: 0 };
var Mu = (e17) => e17 <= 0 ? 0 : e17 >= 1 ? 1 : e17 * e17 * (3 - 2 * e17);
function Nu(e17, t10) {
  let n10 = Math.sin;
  switch (e17) {
    case `wave`:
      return { armR: -150 + 18 * n10(t10 / 130) };
    case `cross`:
      return { armL: -64 + 2 * n10(t10 / 700), armR: 66 - 2 * n10(t10 / 700) };
    case `dance`: {
      let e18 = n10(t10 / 260);
      return { armL: 40 + 70 * (0.5 + 0.5 * e18), armR: -40 - 70 * (0.5 - 0.5 * e18), legL: 12 * e18, legR: 12 * e18, bob: -7 * Math.abs(e18), up: 7 * n10(t10 / 520) };
    }
    case `jump`: {
      let e18 = n10(t10 % 620 / 620 * Math.PI);
      return { armL: 7 + 55 * e18, armR: -7 - 55 * e18, legL: 9 * e18, legR: -9 * e18, bob: -34 * e18 };
    }
    case `bow`: {
      let e18 = t10 < 650 ? Mu(t10 / 650) : t10 < 1500 ? 1 : Mu(1 - (t10 - 1500) / 600), n11 = Nu(`talk`, t10), r10 = t10 < 2100 ? 0 : Mu((t10 - 2100) / 400);
      return { armL: 7 + 14 * e18 + ((n11.armL ?? 7) - 7) * r10, armR: -7 + 47 * e18 + ((n11.armR ?? -7) + 7) * r10, up: 6 * e18, dip: 22 * e18, squash: 0.18 * e18 };
    }
    case `clap`: {
      let e18 = Math.abs(n10(t10 / 150));
      return { armL: 7 - 50 * e18, armR: -7 + 50 * e18 };
    }
    case `cheer`: {
      let e18 = n10(t10 / 210);
      return { armL: 145 + 12 * e18, armR: -145 - 12 * e18, bob: -14 * Math.abs(e18) };
    }
    default:
      return { armR: -7 - (18 + 14 * n10(t10 / 380)), armL: 7 + (10 + 10 * n10(t10 / 520 + 2)) };
  }
}
function hne(e17, t10) {
  let n10 = {};
  for (let r10 of Object.keys(ju)) n10[r10] = ju[r10] + ((e17[r10] ?? ju[r10]) - ju[r10]) * t10;
  return n10;
}
var Fu = [`#fbe3cf`, `#f6d3b8`, `#eebd94`, `#d9a066`, `#b9794a`, `#8d5a3b`, `#6b4129`];
var Iu = [`#2b1d16`, `#5a3825`, `#8a4b22`, `#c47a35`, `#e8c170`, `#f3e2b0`, `#9ca3af`, `#e5e7eb`, `#d33f6a`, `#3b82f6`];
var Lu = [`#5b3a1e`, `#2f6fb3`, `#3f8f4a`, `#6b7280`];
var Ru = [`#ef4444`, `#f97316`, `#facc15`, `#22c55e`, `#14b8a6`, `#3b82f6`, `#6366f1`, `#a855f7`, `#ec4899`, `#ffffff`, `#9ca3af`, `#1f2937`, `#78350f`, `#1e3a8a`];
var zu = [`#1f2937`, `#78350f`, `#ffffff`, `#ef4444`, `#3b82f6`, `#22c55e`, `#ec4899`];
var Bu = [{ id: `short`, label: `Kurz` }, { id: `spiky`, label: `Stachelig` }, { id: `side`, label: `Seitenscheitel` }, { id: `curly`, label: `Locken` }, { id: `bob`, label: `Bob` }, { id: `long`, label: `Lang` }, { id: `ponytail`, label: `Pferdeschwanz` }, { id: `plaits`, label: `Z\xF6pfe` }, { id: `bun`, label: `Dutt` }, { id: `afro`, label: `Afro` }, { id: `bald`, label: `Glatze` }];
var Vu = [{ id: `dots`, label: `Punkte` }, { id: `round`, label: `Gro\xDF` }, { id: `lashes`, label: `Wimpern` }, { id: `happy`, label: `Fr\xF6hlich` }];
var Hu = [{ id: `smile`, label: `L\xE4cheln` }, { id: `laugh`, label: `Lachen` }, { id: `calm`, label: `Ruhig` }, { id: `wow`, label: `Staunen` }];
var Uu = [{ id: `none`, label: `Kein Bart` }, { id: `stubble`, label: `Stoppeln` }, { id: `moustache`, label: `Schnurrbart` }, { id: `full`, label: `Vollbart` }];
var Wu = [{ id: `none`, label: `Keine Brille` }, { id: `round`, label: `Rund` }, { id: `square`, label: `Eckig` }, { id: `sun`, label: `Sonnenbrille` }, { id: `safety`, label: `Schutzbrille` }];
var Gu = [{ id: `none`, label: `Nichts` }, { id: `cap`, label: `Kappe` }, { id: `beanie`, label: `M\xFCtze` }, { id: `scarf`, label: `Kopftuch` }, { id: `bow`, label: `Schleife` }, { id: `crown`, label: `Krone` }, { id: `helmet`, label: `Schutzhelm` }, { id: `chef`, label: `Kochm\xFCtze` }];
var Ku = [{ id: `tshirt`, label: `T-Shirt` }, { id: `sweater`, label: `Pullover` }, { id: `hoodie`, label: `Kapuzenpulli` }, { id: `shirt`, label: `Hemd` }, { id: `dress`, label: `Kleid` }, { id: `vest`, label: `Warnweste` }, { id: `apron`, label: `Sch\xFCrze` }, { id: `coat`, label: `Arbeitsjacke` }];
var qu = [{ id: `none`, label: `Einfarbig` }, { id: `stripes`, label: `Streifen` }, { id: `dots`, label: `Punkte` }, { id: `star`, label: `Stern` }];
var Ju = [{ id: `trousers`, label: `Hose` }, { id: `shorts`, label: `Kurze Hose` }, { id: `skirt`, label: `Rock` }];
var Yu = { child: true, skin: Fu[1], hair: `short`, hairColor: Iu[1], eyes: `dots`, eyeColor: Lu[0], brows: true, mouth: `smile`, cheeks: true, beard: `none`, glasses: `none`, hat: `none`, hatColor: Ru[0], top: `tshirt`, topColor: Ru[5], pattern: `none`, bottom: `trousers`, bottomColor: Ru[13], shoes: zu[0], name: `` };
var Xu = (e17) => e17.map((e18) => e18.id);
var Zu = (e17, t10, n10) => e17.includes(t10) ? t10 : n10;
var Qu = (e17, t10) => typeof e17 == `string` && /^#[0-9a-f]{6}$/i.test(e17) ? e17.toLowerCase() : t10;
function $u(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = Yu;
  return { child: t10.child !== false, skin: Qu(t10.skin, n10.skin), hair: Zu(Xu(Bu), t10.hair, n10.hair), hairColor: Qu(t10.hairColor, n10.hairColor), eyes: Zu(Xu(Vu), t10.eyes, n10.eyes), eyeColor: Qu(t10.eyeColor, n10.eyeColor), brows: t10.brows !== false, mouth: Zu(Xu(Hu), t10.mouth, n10.mouth), cheeks: t10.cheeks !== false, beard: Zu(Xu(Uu), t10.beard, n10.beard), glasses: Zu(Xu(Wu), t10.glasses, n10.glasses), hat: Zu(Xu(Gu), t10.hat, n10.hat), hatColor: Qu(t10.hatColor, n10.hatColor), top: Zu(Xu(Ku), t10.top, n10.top), topColor: Qu(t10.topColor, n10.topColor), pattern: Zu(Xu(qu), t10.pattern, n10.pattern), bottom: Zu(Xu(Ju), t10.bottom, n10.bottom), bottomColor: Qu(t10.bottomColor, n10.bottomColor), shoes: Qu(t10.shoes, n10.shoes), name: typeof t10.name == `string` ? t10.name.slice(0, 40) : ``, ...ku.some((e18) => e18.id === t10.feel) ? { feel: t10.feel } : {} };
}
var ed = [{ id: `girl`, name: `M\xE4dchen`, av: { hair: `plaits`, hairColor: `#8a4b22`, hatColor: `#ef4444`, top: `dress`, topColor: `#ec4899`, pattern: `dots`, shoes: `#ef4444` } }, { id: `boy`, name: `Junge`, av: { hair: `spiky`, hairColor: `#c47a35`, skin: `#eebd94`, top: `hoodie`, topColor: `#22c55e`, bottom: `shorts`, bottomColor: `#1e3a8a`, shoes: `#ffffff` } }, { id: `girl2`, name: `M\xE4dchen mit Locken`, av: { hair: `afro`, hairColor: `#2b1d16`, skin: `#8d5a3b`, eyes: `lashes`, top: `tshirt`, topColor: `#facc15`, pattern: `star`, bottom: `skirt`, bottomColor: `#6366f1` } }, { id: `boy2`, name: `Junge mit Brille`, av: { hair: `side`, hairColor: `#2b1d16`, skin: `#d9a066`, glasses: `round`, top: `sweater`, topColor: `#ef4444`, pattern: `stripes`, bottomColor: `#1f2937` } }, { id: `teacher`, name: `Lehrerin`, av: { child: false, hair: `bun`, hairColor: `#5a3825`, glasses: `square`, eyes: `round`, top: `shirt`, topColor: `#14b8a6`, bottom: `skirt`, bottomColor: `#1e3a8a`, mouth: `smile` } }, { id: `man`, name: `Mann mit Bart`, av: { child: false, hair: `short`, hairColor: `#2b1d16`, skin: `#b9794a`, beard: `full`, top: `tshirt`, topColor: `#3b82f6`, bottomColor: `#1f2937`, shoes: `#78350f` } }, { id: `woman`, name: `Frau mit Kopftuch`, av: { child: false, hat: `scarf`, hatColor: `#a855f7`, skin: `#eebd94`, top: `dress`, topColor: `#1e3a8a`, pattern: `none`, eyes: `lashes` } }, { id: `grandpa`, name: `Opa`, av: { child: false, hair: `bald`, hairColor: `#e5e7eb`, beard: `moustache`, glasses: `round`, top: `sweater`, topColor: `#78350f`, bottomColor: `#9ca3af`, mouth: `calm` } }, { id: `builder`, name: `Handwerkerin`, av: { child: false, hair: `ponytail`, hairColor: `#5a3825`, skin: `#d9a066`, hat: `helmet`, hatColor: `#facc15`, glasses: `safety`, top: `vest`, topColor: `#1e3a8a`, bottomColor: `#1f2937`, shoes: `#111827`, mouth: `smile` } }, { id: `cook`, name: `Koch`, av: { child: false, hair: `short`, hairColor: `#2b1d16`, skin: `#8d5a3b`, hat: `chef`, top: `apron`, topColor: `#ffffff`, bottomColor: `#1f2937`, shoes: `#111827`, mouth: `smile` } }, { id: `boss`, name: `Chefin`, av: { child: false, hair: `bob`, hairColor: `#e8c170`, skin: `#f2d3b3`, glasses: `square`, top: `shirt`, topColor: `#475569`, bottomColor: `#1f2937`, shoes: `#111827`, mouth: `smile` } }, { id: `colleague`, name: `Kollege in der Werkstatt`, av: { child: false, hair: `curly`, hairColor: `#2b1d16`, skin: `#b9794a`, top: `coat`, topColor: `#2563eb`, bottomColor: `#1e3a8a`, shoes: `#111827`, mouth: `smile` } }, { id: `king`, name: `K\xF6nig`, av: { child: false, hair: `curly`, hairColor: `#e8c170`, hat: `crown`, beard: `full`, top: `sweater`, topColor: `#ef4444`, bottomColor: `#a855f7`, shoes: `#78350f` } }];
function td(e17, t10 = 0.78) {
  let n10 = parseInt(e17.slice(1), 16), r10 = (e18) => Math.max(0, Math.min(255, Math.round(e18 * t10))), i10 = r10(n10 >> 16 & 255), a10 = r10(n10 >> 8 & 255), o10 = r10(n10 & 255);
  return `#${(1 << 24 | i10 << 16 | a10 << 8 | o10).toString(16).slice(1)}`;
}
var nd = (e17) => {
  let t10 = parseInt(e17.slice(1), 16);
  return 0.3 * (t10 >> 16 & 255) + 0.59 * (t10 >> 8 & 255) + 0.11 * (t10 & 255) > 225 ? `#9ca3af` : td(e17, 0.72);
};
var rd = `#3b2a20`;
function id(e17) {
  return e17.child ? { hx: 100, hy: 92, rx: 50, ry: 56, sy: 158, hip: 268, ankle: 370, bw: 38, arm: 96, ax: 30, lx: 13 } : { hx: 100, hy: 74, rx: 41, ry: 47, sy: 132, hip: 256, ankle: 372, bw: 44, arm: 114, ax: 35, lx: 15 };
}
function _ne(e17, t10) {
  let { hx: n10, hy: r10, rx: i10, ry: a10 } = t10, o10 = e17.hairColor, s10 = `fill="${o10}" stroke="${nd(o10)}" stroke-width="2.5" stroke-linejoin="round"`;
  if (e17.hat === `scarf`) return ``;
  switch (e17.hair) {
    case `bob`:
      return `<path d="M${n10 - i10 - 8} ${r10 + a10 * 0.55}Q${n10 - i10 - 14} ${r10 - a10 * 1.1} ${n10} ${r10 - a10 - 8}Q${n10 + i10 + 14} ${r10 - a10 * 1.1} ${n10 + i10 + 8} ${r10 + a10 * 0.55}Q${n10} ${r10 + a10 * 0.75} ${n10 - i10 - 8} ${r10 + a10 * 0.55}Z" ${s10}/>`;
    case `long`:
      return `<path d="M${n10 - i10 - 6} ${r10}Q${n10 - i10 - 12} ${r10 - a10 * 1.15} ${n10} ${r10 - a10 - 8}Q${n10 + i10 + 12} ${r10 - a10 * 1.15} ${n10 + i10 + 6} ${r10}L${n10 + i10 + 12} ${t10.sy + 46}Q${n10} ${t10.sy + 58} ${n10 - i10 - 12} ${t10.sy + 46}Z" ${s10}/>`;
    case `afro`: {
      let e18 = i10 * 1.42;
      return `<circle cx="${n10}" cy="${r10 - a10 * 0.18}" r="${e18}" ${s10}/>`;
    }
    case `ponytail`:
      return `<path d="M${n10 + i10 * 0.55} ${r10 - a10 * 0.75}Q${n10 + i10 * 1.65} ${r10 - a10 * 0.6} ${n10 + i10 * 1.25} ${r10 + a10 * 0.75}Q${n10 + i10 * 1.12} ${r10 + a10 * 0.2} ${n10 + i10 * 0.7} ${r10 - a10 * 0.2}Z" ${s10}/>`;
    case `plaits`: {
      let t11 = ``;
      for (let o11 of [-1, 1]) {
        let c10 = n10 + o11 * (i10 + 4);
        for (let e18 = 0; e18 < 4; e18++) t11 += `<ellipse cx="${c10 + o11 * 2}" cy="${r10 + a10 * 0.35 + e18 * 17}" rx="10" ry="11" ${s10}/>`;
        t11 += `<rect x="${c10 + o11 * 2 - 6}" y="${r10 + a10 * 0.35 + 62}" width="12" height="7" rx="3" fill="${e17.hatColor}"/>`;
      }
      return t11;
    }
    default:
      return ``;
  }
}
function vne(e17, t10) {
  let { hx: n10, hy: r10, rx: i10, ry: a10 } = t10, o10 = e17.hairColor, s10 = `fill="${o10}" stroke="${nd(o10)}" stroke-width="2.5" stroke-linejoin="round"`;
  if (e17.hat === `scarf` || e17.hair === `bald`) return e17.hair === `bald` && e17.hat !== `scarf` ? `<path d="M${n10 - i10 - 1} ${r10 + 4}Q${n10 - i10 - 4} ${r10 - a10 * 0.45} ${n10 - i10 * 0.62} ${r10 - a10 * 0.62}L${n10 - i10 * 0.7} ${r10 - a10 * 0.2}Q${n10 - i10 * 0.85} ${r10 - 4} ${n10 - i10 - 1} ${r10 + 4}ZM${n10 + i10 + 1} ${r10 + 4}Q${n10 + i10 + 4} ${r10 - a10 * 0.45} ${n10 + i10 * 0.62} ${r10 - a10 * 0.62}L${n10 + i10 * 0.7} ${r10 - a10 * 0.2}Q${n10 + i10 * 0.85} ${r10 - 4} ${n10 + i10 + 1} ${r10 + 4}Z" ${s10}/>` : ``;
  let c10 = n10 - i10 - 3, l10 = n10 + i10 + 3, u10 = r10 - a10 - 6, d10 = (e18) => `<path d="M${c10} ${r10 + 2}A${i10 + 3} ${r10 + 2 - u10} 0 0 1 ${l10} ${r10 + 2}${e18}Z" ${s10}/>`;
  switch (e17.hair) {
    case `spiky`: {
      let e18 = `M${c10} ${r10 + 2}`;
      for (let t11 = 0; t11 <= 7; t11++) {
        let n11 = t11 / 7, i11 = c10 + (l10 - c10) * n11, o11 = r10 - a10 * (0.55 + 0.45 * Math.sin(Math.PI * n11));
        e18 += `L${(i11 - (l10 - c10) / 7 / 2).toFixed(1)} ${(o11 - 2).toFixed(1)}L${i11.toFixed(1)} ${(o11 - 22 - 6 * Math.sin(Math.PI * n11)).toFixed(1)}`;
      }
      return e18 += `L${l10} ${r10 + 2}Q${n10 + i10 * 0.5} ${r10 - a10 * 0.55} ${n10} ${r10 - a10 * 0.6}Q${n10 - i10 * 0.5} ${r10 - a10 * 0.55} ${c10} ${r10 + 2}Z`, `<path d="${e18}" ${s10}/>`;
    }
    case `side`:
      return d10(`Q${n10 + i10 * 0.7} ${r10 - a10 * 0.58} ${n10 - i10 * 0.15} ${r10 - a10 * 0.48}Q${n10 - i10 * 0.6} ${r10 - a10 * 0.32} ${c10} ${r10 + 2}`);
    case `curly`: {
      let e18 = ``;
      for (let t11 = 0; t11 < 9; t11++) {
        let o11 = Math.PI * (1.05 + 0.9 * t11 / 8);
        e18 += `<circle cx="${(n10 + Math.cos(o11) * i10 * 0.98).toFixed(1)}" cy="${(r10 - a10 * 0.12 + Math.sin(o11) * a10 * 0.92).toFixed(1)}" r="${(i10 * 0.32).toFixed(1)}" ${s10}/>`;
      }
      return e18 + `<ellipse cx="${n10}" cy="${r10 - a10 * 0.72}" rx="${i10 * 0.75}" ry="${a10 * 0.3}" fill="${o10}"/>`;
    }
    case `afro`:
      return `<path d="M${c10} ${r10 + 2}A${i10 + 3} ${r10 + 2 - u10} 0 0 1 ${l10} ${r10 + 2}Q${n10 + i10 * 0.62} ${r10 - a10 * 0.42} ${n10} ${r10 - a10 * 0.5}Q${n10 - i10 * 0.62} ${r10 - a10 * 0.42} ${c10} ${r10 + 2}Z" fill="${o10}"/>`;
    case `bun`:
      return `<circle cx="${n10}" cy="${u10 - 4}" r="${i10 * 0.42}" ${s10}/>` + d10(`Q${n10 + i10 * 0.5} ${r10 - a10 * 0.62} ${n10} ${r10 - a10 * 0.66}Q${n10 - i10 * 0.5} ${r10 - a10 * 0.62} ${c10} ${r10 + 2}`);
    case `bob`:
    case `long`:
    case `plaits`:
      return d10(`Q${n10 + i10 * 0.62} ${r10 - a10 * 0.25} ${n10 + i10 * 0.28} ${r10 - a10 * 0.45}Q${n10} ${r10 - a10 * 0.32} ${n10 - i10 * 0.3} ${r10 - a10 * 0.45}Q${n10 - i10 * 0.62} ${r10 - a10 * 0.25} ${c10} ${r10 + 2}`);
    case `ponytail`:
      return d10(`Q${n10 + i10 * 0.5} ${r10 - a10 * 0.6} ${n10} ${r10 - a10 * 0.58}Q${n10 - i10 * 0.6} ${r10 - a10 * 0.52} ${c10} ${r10 + 2}`);
    default:
      return d10(`Q${n10 + i10 * 0.55} ${r10 - a10 * 0.52} ${n10 + i10 * 0.05} ${r10 - a10 * 0.55}Q${n10 - i10 * 0.45} ${r10 - a10 * 0.4} ${n10 - i10 * 0.5} ${r10 - a10 * 0.56}Q${n10 - i10 * 0.75} ${r10 - a10 * 0.3} ${c10} ${r10 + 2}`);
  }
}
function yne(e17, t10) {
  let { hx: n10, hy: r10, rx: i10, ry: a10 } = t10, o10 = e17.hatColor, s10 = nd(o10), c10 = `fill="${o10}" stroke="${s10}" stroke-width="2.5" stroke-linejoin="round"`;
  switch (e17.hat) {
    case `cap`:
      return `<path d="M${n10 - i10 - 2} ${r10 - a10 * 0.32}Q${n10 - i10} ${r10 - a10 - 14} ${n10} ${r10 - a10 - 12}Q${n10 + i10} ${r10 - a10 - 14} ${n10 + i10 + 2} ${r10 - a10 * 0.32}Z" ${c10}/><path d="M${n10 + i10 * 0.2} ${r10 - a10 * 0.36}Q${n10 + i10 * 1.3} ${r10 - a10 * 0.5} ${n10 + i10 * 1.55} ${r10 - a10 * 0.28}Q${n10 + i10 * 1.1} ${r10 - a10 * 0.18} ${n10 + i10 * 0.2} ${r10 - a10 * 0.26}Z" ${c10}/><circle cx="${n10}" cy="${r10 - a10 - 11}" r="4" fill="${s10}"/>`;
    case `beanie`:
      return `<path d="M${n10 - i10 - 3} ${r10 - a10 * 0.3}Q${n10 - i10} ${r10 - a10 - 20} ${n10} ${r10 - a10 - 18}Q${n10 + i10} ${r10 - a10 - 20} ${n10 + i10 + 3} ${r10 - a10 * 0.3}Z" ${c10}/><rect x="${n10 - i10 - 5}" y="${r10 - a10 * 0.42}" width="${2 * i10 + 10}" height="${a10 * 0.24}" rx="6" ${c10}/><circle cx="${n10}" cy="${r10 - a10 - 22}" r="10" fill="#ffffff" stroke="${s10}" stroke-width="2.5"/>`;
    case `crown`: {
      let e18 = r10 - a10 * 0.62, t11 = i10 * 0.85;
      return `<path d="M${n10 - t11} ${e18}L${n10 - t11 - 4} ${e18 - 34}L${n10 - t11 / 2} ${e18 - 16}L${n10} ${e18 - 40}L${n10 + t11 / 2} ${e18 - 16}L${n10 + t11 + 4} ${e18 - 34}L${n10 + t11} ${e18}Z" fill="#facc15" stroke="#b45309" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${n10}" cy="${e18 - 10}" r="5" fill="#ef4444"/><circle cx="${n10 - t11 * 0.62}" cy="${e18 - 8}" r="4" fill="#3b82f6"/><circle cx="${n10 + t11 * 0.62}" cy="${e18 - 8}" r="4" fill="#22c55e"/>`;
    }
    case `scarf`:
      return `<path d="M${n10} ${r10 - a10 - 12}C${n10 - i10 * 1.5} ${r10 - a10 - 10} ${n10 - i10 * 1.45} ${r10 + a10 * 0.6} ${n10 - i10 * 1.05} ${t10.sy + 18}L${n10 + i10 * 1.05} ${t10.sy + 18}C${n10 + i10 * 1.45} ${r10 + a10 * 0.6} ${n10 + i10 * 1.5} ${r10 - a10 - 10} ${n10} ${r10 - a10 - 12}ZM${n10} ${r10 - a10 * 0.84}C${n10 - i10 * 0.95} ${r10 - a10 * 0.84} ${n10 - i10 * 0.98} ${r10 + a10 * 0.6} ${n10} ${r10 + a10 * 0.98}C${n10 + i10 * 0.98} ${r10 + a10 * 0.6} ${n10 + i10 * 0.95} ${r10 - a10 * 0.84} ${n10} ${r10 - a10 * 0.84}Z" fill-rule="evenodd" ${c10}/>`;
    case `helmet`: {
      let e18 = r10 - a10 - 16;
      return `<path d="M${n10 - i10 - 4} ${r10 - a10 * 0.36}Q${n10 - i10 - 2} ${e18} ${n10} ${e18}Q${n10 + i10 + 2} ${e18} ${n10 + i10 + 4} ${r10 - a10 * 0.36}Z" ${c10}/><path d="M${n10 - i10 - 14} ${r10 - a10 * 0.3}H${n10 + i10 + 14}" stroke="${s10}" stroke-width="9" stroke-linecap="round"/><path d="M${n10 - i10 - 13} ${r10 - a10 * 0.3}H${n10 + i10 + 13}" stroke="${o10}" stroke-width="5" stroke-linecap="round"/><path d="M${n10} ${e18 + 2}V${r10 - a10 * 0.4}" stroke="${s10}" stroke-width="5" stroke-linecap="round"/>`;
    }
    case `chef`: {
      let e18 = r10 - a10 * 0.55, t11 = i10 * 0.95, o11 = `fill="#ffffff" stroke="#94a3b8" stroke-width="2.5"`;
      return `<circle cx="${n10 - t11 * 0.55}" cy="${e18 - 34}" r="${t11 * 0.55}" ${o11}/><circle cx="${n10 + t11 * 0.55}" cy="${e18 - 34}" r="${t11 * 0.55}" ${o11}/><circle cx="${n10}" cy="${e18 - 50}" r="${t11 * 0.62}" ${o11}/><rect x="${n10 - t11}" y="${e18 - 30}" width="${2 * t11}" height="34" rx="6" ${o11}/><path d="M${n10 - t11 + 6} ${e18 - 18}H${n10 + t11 - 6}" stroke="#e2e8f0" stroke-width="3"/>`;
    }
    case `bow`: {
      let e18 = n10 + i10 * 0.55, t11 = r10 - a10 * 0.78;
      return `<path d="M${e18} ${t11}L${e18 - 20} ${t11 - 13}L${e18 - 20} ${t11 + 13}ZM${e18} ${t11}L${e18 + 20} ${t11 - 13}L${e18 + 20} ${t11 + 13}Z" ${c10}/><circle cx="${e18}" cy="${t11}" r="6" ${c10}/>`;
    }
    default:
      return ``;
  }
}
function bne(e17, t10, n10) {
  let { hx: r10, hy: i10, rx: a10 } = t10, o10 = i10 + 4, s10 = e17.hair === `bald` || e17.hat === `scarf` ? td(e17.skin, 0.55) : td(e17.hairColor, 0.85), c10 = (e18) => `<path d="${e18}" fill="none" stroke="${s10}" stroke-width="3.8" stroke-linecap="round"/>`, l10 = ``;
  for (let t11 of [-1, 1]) {
    let i11 = r10 + t11 * a10 * 0.38, s11 = t11;
    n10 ? l10 += `<path d="M${i11 - 7} ${o10 + 1}q7 4 14 0" fill="none" stroke="${rd}" stroke-width="3" stroke-linecap="round"/>` : e17.feel === `happy` ? l10 += `<path d="M${i11 - 8} ${o10 + 3}q8 -10 16 0" fill="none" stroke="${rd}" stroke-width="3.6" stroke-linecap="round"/>` : e17.feel === `surprised` || e17.feel === `scared` ? l10 += `<circle cx="${i11}" cy="${o10}" r="9" fill="#fff" stroke="${rd}" stroke-width="1.8"/><circle cx="${i11}" cy="${o10 + +(e17.feel === `scared`)}" r="${e17.feel === `scared` ? 3.2 : 4.2}" fill="${rd}"/>` : e17.feel === `tired` ? l10 += `<path d="M${i11 - 8} ${o10}h16" stroke="${rd}" stroke-width="3.4" stroke-linecap="round"/><path d="M${i11 - 7} ${o10 + 1}q7 6 14 0" fill="${rd}" opacity=".85"/>` : l10 += `<ellipse cx="${i11}" cy="${o10 + (e17.feel === `sad` ? 2 : 0)}" rx="5" ry="6" fill="${rd}"/><circle cx="${i11 + 1.6}" cy="${o10 - 1.6}" r="1.6" fill="#fff"/>`;
    let u10 = i11 - s11 * 10, d10 = i11 + s11 * 10;
    e17.feel === `sad` ? l10 += c10(`M${u10} ${o10 - 17}L${d10} ${o10 - 11}`) : e17.feel === `angry` ? l10 += c10(`M${u10} ${o10 - 9}L${d10} ${o10 - 17}`) : e17.feel === `scared` ? l10 += c10(`M${u10} ${o10 - 19}Q${i11} ${o10 - 16} ${d10} ${o10 - 14}`) : e17.feel === `surprised` ? l10 += c10(`M${u10} ${o10 - 19}Q${i11} ${o10 - 25} ${d10} ${o10 - 19}`) : e17.feel === `tired` ? l10 += c10(`M${u10} ${o10 - 11}L${d10} ${o10 - 10}`) : l10 += c10(`M${u10} ${o10 - 15}Q${i11} ${o10 - 20} ${d10} ${o10 - 15}`);
  }
  return e17.feel === `sad` && (l10 += `<path d="M${r10 - a10 * 0.38 - 2} ${o10 + 9}q-3 7 0 9q3 -2 0 -9z" fill="#74c0fc"/>`), l10;
}
function xne(e17, t10) {
  let { hx: n10, hy: r10, ry: i10 } = t10, a10 = r10 + i10 * 0.56, o10 = `#7a2e2e`;
  switch (e17.feel) {
    case `happy`:
      return `<path d="M${n10 - 15} ${a10 - 3}Q${n10} ${a10 + 22} ${n10 + 15} ${a10 - 3}Z" fill="#7f1d1d" stroke="${o10}" stroke-width="2.6" stroke-linejoin="round"/><path d="M${n10 - 12} ${a10 - 1}H${n10 + 12}L${n10 + 10} ${a10 + 3}H${n10 - 10}Z" fill="#fff"/>`;
    case `sad`:
      return `<path d="M${n10 - 12} ${a10 + 6}q12 -11 24 0" fill="none" stroke="${o10}" stroke-width="3.4" stroke-linecap="round"/>`;
    case `angry`:
      return `<path d="M${n10 - 13} ${a10 + 5}q13 -8 26 0" fill="none" stroke="${o10}" stroke-width="3.6" stroke-linecap="round"/><path d="M${n10 - 9} ${a10 + 1}h18" stroke="${o10}" stroke-width="2" stroke-linecap="round"/>`;
    case `scared`:
      return `<path d="M${n10 - 12} ${a10 + 3}q3 -4 6 0t6 0t6 0t6 0" fill="none" stroke="${o10}" stroke-width="3" stroke-linecap="round"/>`;
    case `surprised`:
      return `<ellipse cx="${n10}" cy="${a10 + 3}" rx="8" ry="10" fill="#7f1d1d" stroke="${o10}" stroke-width="2.4"/>`;
    case `tired`:
      return `<ellipse cx="${n10}" cy="${a10 + 3}" rx="6" ry="7" fill="#7f1d1d" stroke="${o10}" stroke-width="2.2"/>`;
    default:
      return ``;
  }
}
function Sne(e17, t10, n10) {
  if (e17.feel) return bne(e17, t10, n10);
  let { hx: r10, hy: i10, rx: a10 } = t10, o10 = i10 + 4, s10 = ``;
  for (let t11 of [-1, 1]) {
    let i11 = r10 + t11 * a10 * 0.38;
    n10 || e17.eyes === `happy` ? s10 += n10 ? `<path d="M${i11 - 7} ${o10 + 1}q7 4 14 0" fill="none" stroke="${rd}" stroke-width="3" stroke-linecap="round"/>` : `<path d="M${i11 - 7} ${o10 + 2}q7 -9 14 0" fill="none" stroke="${rd}" stroke-width="3.4" stroke-linecap="round"/>` : e17.eyes === `round` ? s10 += `<circle cx="${i11}" cy="${o10}" r="9" fill="#fff" stroke="${rd}" stroke-width="1.6"/><circle cx="${i11 + 1}" cy="${o10 + 1}" r="5.6" fill="${e17.eyeColor}"/><circle cx="${i11 + 1}" cy="${o10 + 1}" r="2.8" fill="${rd}"/><circle cx="${i11 + 2.6}" cy="${o10 - 1.4}" r="1.6" fill="#fff"/>` : (s10 += `<ellipse cx="${i11}" cy="${o10}" rx="5" ry="6.5" fill="${rd}"/><circle cx="${i11 + 1.8}" cy="${o10 - 2.4}" r="1.8" fill="#fff"/>`, e17.eyes === `lashes` && (s10 += `<path d="M${i11 + t11 * 4} ${o10 - 5}l${t11 * 5} -5M${i11 + t11 * 6} ${o10 - 2}l${t11 * 6} -3" stroke="${rd}" stroke-width="2.2" stroke-linecap="round"/>`));
  }
  if (e17.brows) {
    let t11 = e17.hair === `bald` || e17.hat === `scarf` ? td(e17.skin, 0.55) : td(e17.hairColor, 0.85);
    s10 += `<path d="M${r10 - a10 * 0.38 - 10} ${o10 - 13}q10 -7 20 -2M${r10 + a10 * 0.38 - 10} ${o10 - 15}q10 -5 20 2" fill="none" stroke="${t11}" stroke-width="3.6" stroke-linecap="round"/>`;
  }
  return s10;
}
function ad(e17, t10, n10) {
  let { hx: r10, hy: i10, ry: a10 } = t10, o10 = i10 + a10 * 0.56, s10 = `#7a2e2e`;
  if (n10 !== void 0) {
    let e18 = Math.max(0, Math.min(1, n10));
    if (e18 < 0.08) return `<path d="M${r10 - 10} ${o10}q10 5 20 0" fill="none" stroke="${s10}" stroke-width="3.2" stroke-linecap="round"/>`;
    let t11 = 12 - e18 * 2, i11 = 3 + e18 * 11;
    return `<ellipse cx="${r10}" cy="${o10 + i11 / 2 - 2}" rx="${t11}" ry="${i11}" fill="#7f1d1d" stroke="${s10}" stroke-width="2.4"/><ellipse cx="${r10}" cy="${o10 + i11 * 1.1 - 3}" rx="${t11 * 0.6}" ry="${i11 * 0.42}" fill="#f87171"/>`;
  }
  if (e17.feel) return xne(e17, t10);
  switch (e17.mouth) {
    case `laugh`:
      return `<path d="M${r10 - 15} ${o10 - 3}Q${r10} ${o10 + 22} ${r10 + 15} ${o10 - 3}Z" fill="#7f1d1d" stroke="${s10}" stroke-width="2.6" stroke-linejoin="round"/><path d="M${r10 - 12} ${o10 - 1}H${r10 + 12}L${r10 + 10} ${o10 + 3}H${r10 - 10}Z" fill="#fff"/><ellipse cx="${r10}" cy="${o10 + 11}" rx="6" ry="3.5" fill="#f87171"/>`;
    case `calm`:
      return `<path d="M${r10 - 10} ${o10 + 1}q10 5 20 0" fill="none" stroke="${s10}" stroke-width="3.2" stroke-linecap="round"/>`;
    case `wow`:
      return `<ellipse cx="${r10}" cy="${o10 + 3}" rx="7" ry="9" fill="#7f1d1d" stroke="${s10}" stroke-width="2.4"/>`;
    default:
      return `<path d="M${r10 - 13} ${o10 - 3}q13 13 26 0" fill="#fff" stroke="${s10}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
}
function Cne(e17, t10) {
  let { hx: n10, hy: r10, rx: i10, ry: a10 } = t10, o10 = e17.hairColor, s10 = r10 + a10 * 0.56;
  switch (e17.beard) {
    case `stubble`:
      return `<path d="M${n10 - i10 * 0.9} ${r10 + a10 * 0.2}Q${n10 - i10 * 0.8} ${r10 + a10 * 1.02} ${n10} ${r10 + a10}Q${n10 + i10 * 0.8} ${r10 + a10 * 1.02} ${n10 + i10 * 0.9} ${r10 + a10 * 0.2}Q${n10} ${r10 + a10 * 0.55} ${n10 - i10 * 0.9} ${r10 + a10 * 0.2}Z" fill="${o10}" opacity=".28"/>`;
    case `moustache`:
      return `<path d="M${n10} ${s10 - 8}q-9 -5 -18 2q-4 6 3 5q8 -5 15 -2q7 -3 15 2q7 1 3 -5q-9 -7 -18 -2z" fill="${o10}" stroke="${nd(o10)}" stroke-width="1.8" stroke-linejoin="round"/>`;
    case `full`:
      return `<path d="M${n10 - i10 - 1} ${r10 + 2}Q${n10 - i10 * 0.95} ${r10 + a10 * 1.25} ${n10} ${r10 + a10 * 1.18}Q${n10 + i10 * 0.95} ${r10 + a10 * 1.25} ${n10 + i10 + 1} ${r10 + 2}Q${n10 + i10 * 0.6} ${r10 + a10 * 0.42} ${n10 + i10 * 0.3} ${r10 + a10 * 0.45}Q${n10} ${r10 + a10 * 0.3} ${n10 - i10 * 0.3} ${r10 + a10 * 0.45}Q${n10 - i10 * 0.6} ${r10 + a10 * 0.42} ${n10 - i10 - 1} ${r10 + 2}Z" fill="${o10}" stroke="${nd(o10)}" stroke-width="2.2" stroke-linejoin="round"/><ellipse cx="${n10}" cy="${s10 + 3}" rx="15" ry="9" fill="${e17.skin}"/>`;
    default:
      return ``;
  }
}
function wne(e17, t10) {
  let { hx: n10, hy: r10, rx: i10 } = t10, a10 = r10 + 4, o10 = n10 - i10 * 0.38, s10 = n10 + i10 * 0.38, c10 = `#1f2937`;
  switch (e17.glasses) {
    case `round`:
      return `<circle cx="${o10}" cy="${a10}" r="12.5" fill="#fff" fill-opacity=".18" stroke="${c10}" stroke-width="3"/><circle cx="${s10}" cy="${a10}" r="12.5" fill="#fff" fill-opacity=".18" stroke="${c10}" stroke-width="3"/><path d="M${o10 + 12.5} ${a10 - 1}q${s10 - o10 - 25 > 0 ? (s10 - o10 - 25) / 2 : 1} -5 ${s10 - o10 - 25} 0" fill="none" stroke="${c10}" stroke-width="3"/>`;
    case `square`:
      return `<rect x="${o10 - 14}" y="${a10 - 10}" width="28" height="20" rx="4" fill="#fff" fill-opacity=".18" stroke="${c10}" stroke-width="3"/><rect x="${s10 - 14}" y="${a10 - 10}" width="28" height="20" rx="4" fill="#fff" fill-opacity=".18" stroke="${c10}" stroke-width="3"/><path d="M${o10 + 14} ${a10 - 2}H${s10 - 14}" stroke="${c10}" stroke-width="3"/>`;
    case `sun`:
      return `<path d="M${o10 - 15} ${a10 - 9}H${o10 + 14}Q${o10 + 13} ${a10 + 13} ${o10} ${a10 + 12}Q${o10 - 14} ${a10 + 12} ${o10 - 15} ${a10 - 9}ZM${s10 - 14} ${a10 - 9}H${s10 + 15}Q${s10 + 14} ${a10 + 12} ${s10} ${a10 + 12}Q${s10 - 13} ${a10 + 13} ${s10 - 14} ${a10 - 9}Z" fill="#111827" stroke="${c10}" stroke-width="2.5"/><path d="M${o10 + 14} ${a10 - 6}H${s10 - 14}" stroke="${c10}" stroke-width="3"/><path d="M${o10 - 8} ${a10 - 4}l6 0" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>`;
    case `safety`:
      return `<path d="M${o10 - 20} ${a10 - 13}H${s10 + 20}Q${s10 + 22} ${a10 + 15} ${s10 + 4} ${a10 + 14}L${n10 + 6} ${a10 + 8}Q${n10} ${a10 + 4} ${n10 - 6} ${a10 + 8}L${o10 - 4} ${a10 + 14}Q${o10 - 22} ${a10 + 15} ${o10 - 20} ${a10 - 13}Z" fill="#bae6fd" fill-opacity=".45" stroke="${c10}" stroke-width="3" stroke-linejoin="round"/><path d="M${o10 - 20} ${a10 - 4}H${n10 - i10}M${s10 + 20} ${a10 - 4}H${n10 + i10}" stroke="${c10}" stroke-width="4"/>`;
    default:
      return ``;
  }
}
function Tne(e17, t10, n10) {
  let { hx: r10, hy: i10, rx: a10, ry: o10 } = t10, s10 = e17.skin, c10 = td(s10), l10 = ``;
  return e17.hat !== `scarf` && (l10 += `<ellipse cx="${r10 - a10 + 1}" cy="${i10 + 6}" rx="9" ry="12" fill="${s10}" stroke="${c10}" stroke-width="2"/><ellipse cx="${r10 + a10 - 1}" cy="${i10 + 6}" rx="9" ry="12" fill="${s10}" stroke="${c10}" stroke-width="2"/>`), l10 += `<ellipse cx="${r10}" cy="${i10}" rx="${a10}" ry="${o10}" fill="${s10}" stroke="${c10}" stroke-width="2"/>`, e17.cheeks && (l10 += `<circle cx="${r10 - a10 * 0.55}" cy="${i10 + o10 * 0.36}" r="8" fill="#ff7b6b" opacity=".28"/><circle cx="${r10 + a10 * 0.55}" cy="${i10 + o10 * 0.36}" r="8" fill="#ff7b6b" opacity=".28"/>`), l10 += Sne(e17, t10, !!n10.blink), l10 += `<path d="M${r10} ${i10 + o10 * 0.18}q-6 11 1 13" fill="none" stroke="${c10}" stroke-width="2.6" stroke-linecap="round"/>`, l10 += Cne(e17, t10), l10 += `<g class="av-mouth">${ad(e17, t10, n10.mouth)}</g>`, l10;
}
function Ene(e17, t10, n10, r10, i10, a10) {
  let o10 = nd(e17.topColor) === `#9ca3af` ? `#93c5fd` : `#ffffff`, s10 = e17.topColor === `#ffffff` ? 1 : 0.55;
  switch (e17.pattern) {
    case `stripes`: {
      let e18 = ``;
      for (let t11 = i10 + 14; t11 < a10 - 4; t11 += 18) e18 += `<path d="M${n10 + 3} ${t11}H${r10 - 3}" stroke="${o10}" stroke-width="6" opacity="${s10}"/>`;
      return e18;
    }
    case `dots`: {
      let e18 = ``, t11 = 0;
      for (let c10 = i10 + 16; c10 < a10 - 6; c10 += 20, t11++) for (let i11 = n10 + 12 + t11 % 2 * 10; i11 < r10 - 6; i11 += 20) e18 += `<circle cx="${i11}" cy="${c10}" r="4" fill="${o10}" opacity="${s10}"/>`;
      return e18;
    }
    case `star`: {
      let n11 = t10.hx, r11 = (i10 + a10) / 2 - 6;
      return `<polygon points="${Array.from({ length: 10 }, (e18, t11) => {
        let i11 = t11 % 2 ? 8.1 : 18, a11 = -Math.PI / 2 + t11 * Math.PI / 5;
        return `${(n11 + Math.cos(a11) * i11).toFixed(1)},${(r11 + Math.sin(a11) * i11).toFixed(1)}`;
      }).join(` `)}" fill="${e17.topColor === `#facc15` ? `#ffffff` : `#facc15`}" stroke="${nd(`#facc15`)}" stroke-width="1.5" stroke-linejoin="round"/>`;
    }
    default:
      return ``;
  }
}
function Dne(e17, t10) {
  let { hx: n10, sy: r10, hip: i10, bw: a10 } = t10, o10 = e17.topColor, s10 = nd(o10), c10 = n10 - a10, l10 = n10 + a10, u10 = e17.top === `dress` ? i10 + 62 : e17.top === `coat` ? i10 + 34 : i10 + 6, d10 = ``;
  if (e17.bottom === `skirt` && e17.top !== `dress`) {
    let t11 = e17.bottomColor;
    d10 += `<path d="M${c10 + 2} ${i10 - 8}L${c10 - 16} ${i10 + 52}Q${n10} ${i10 + 62} ${l10 + 16} ${i10 + 52}L${l10 - 2} ${i10 - 8}Z" fill="${t11}" stroke="${nd(t11)}" stroke-width="2.5" stroke-linejoin="round"/>`;
  }
  e17.top === `hoodie` && (d10 += `<path d="M${n10 - 30} ${r10 + 4}Q${n10} ${r10 - 26} ${n10 + 30} ${r10 + 4}Z" fill="${o10}" stroke="${s10}" stroke-width="2.5"/>`);
  let f10 = e17.top === `dress` ? `M${c10 + 12} ${r10}Q${c10} ${r10} ${c10 - 2} ${r10 + 18}L${c10 + 4} ${i10 - 30}L${c10 - 22} ${u10}Q${n10} ${u10 + 12} ${l10 + 22} ${u10}L${l10 - 4} ${i10 - 30}L${l10 + 2} ${r10 + 18}Q${l10} ${r10} ${l10 - 12} ${r10}Z` : `M${c10 + 12} ${r10}Q${c10} ${r10} ${c10 - 2} ${r10 + 18}L${c10 + 2} ${u10}Q${n10} ${u10 + 5} ${l10 - 2} ${u10}L${l10 + 2} ${r10 + 18}Q${l10} ${r10} ${l10 - 12} ${r10}Z`;
  if (d10 += `<path d="${f10}" fill="${o10}" stroke="${s10}" stroke-width="2.5" stroke-linejoin="round"/>`, d10 += Ene(e17, t10, c10, l10, r10 + 10, e17.top === `dress` ? i10 - 30 : u10), e17.top === `shirt`) {
    d10 += `<path d="M${n10 - 14} ${r10 - 1}L${n10} ${r10 + 18}L${n10 + 14} ${r10 - 1}" fill="${e17.skin}" stroke="${s10}" stroke-width="2.5" stroke-linejoin="round"/>`, d10 += `<path d="M${n10 - 16} ${r10 - 2}L${n10 - 3} ${r10 + 14}L${n10 - 20} ${r10 + 12}ZM${n10 + 16} ${r10 - 2}L${n10 + 3} ${r10 + 14}L${n10 + 20} ${r10 + 12}Z" fill="#ffffff" stroke="${s10}" stroke-width="2" stroke-linejoin="round"/>`;
    for (let e18 = r10 + 28; e18 < u10 - 8; e18 += 22) d10 += `<circle cx="${n10}" cy="${e18}" r="2.8" fill="${s10}"/>`;
  } else if (e17.top === `hoodie`) d10 += `<path d="M${n10 - 14} ${r10 - 2}Q${n10} ${r10 + 10} ${n10 + 14} ${r10 - 2}" fill="${e17.skin}" stroke="${s10}" stroke-width="2.5"/><path d="M${n10 - 7} ${r10 + 6}v24M${n10 + 7} ${r10 + 6}v24" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>`, d10 += `<path d="M${n10 - a10 * 0.6} ${u10 - 34}H${n10 + a10 * 0.6}V${u10 - 12}H${n10 - a10 * 0.6}Z" fill="none" stroke="${s10}" stroke-width="2.2" stroke-linejoin="round"/>`;
  else if (e17.top === `coat`) {
    d10 += `<path d="M${n10 - 16} ${r10 - 2}L${n10} ${r10 + 22}L${n10 + 16} ${r10 - 2}" fill="${e17.skin}" stroke="${s10}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${n10} ${r10 + 22}V${u10}" stroke="${s10}" stroke-width="2.2"/>`;
    for (let e18 = r10 + 34; e18 < u10 - 10; e18 += 24) d10 += `<circle cx="${n10 + 6}" cy="${e18}" r="2.8" fill="${s10}"/>`;
    d10 += `<rect x="${c10 + 10}" y="${i10 - 14}" width="${a10 * 0.6}" height="22" rx="3" fill="none" stroke="${s10}" stroke-width="2.2"/><rect x="${l10 - 10 - a10 * 0.6}" y="${i10 - 14}" width="${a10 * 0.6}" height="22" rx="3" fill="none" stroke="${s10}" stroke-width="2.2"/>`;
  } else d10 += `<path d="M${n10 - 14} ${r10 - 2}Q${n10} ${r10 + 14} ${n10 + 14} ${r10 - 2}" fill="${e17.skin}" stroke="${s10}" stroke-width="2.5"/>`, e17.top === `sweater` && (d10 += `<path d="M${c10 + 4} ${u10 - 8}H${l10 - 4}" stroke="${s10}" stroke-width="2.4"/>`);
  if (e17.top === `vest`) {
    d10 += `<path d="M${c10 + 4} ${r10 + 6}L${n10 - 14} ${r10 + 2}L${n10 - 6} ${r10 + 34}H${n10 + 6}L${n10 + 14} ${r10 + 2}L${l10 - 4} ${r10 + 6}L${l10 + 1} ${u10}Q${n10} ${u10 + 5} ${c10 - 1} ${u10}Z" fill="#d9f20f" stroke="#8a9b00" stroke-width="2.5" stroke-linejoin="round"/>`;
    for (let e18 of [i10 - 34, i10 - 10]) d10 += `<rect x="${c10}" y="${e18}" width="${2 * a10}" height="9" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>`;
  } else e17.top === `apron` && (d10 += `<path d="M${n10 - a10 * 0.55} ${r10 + 18}H${n10 + a10 * 0.55}V${i10 - 18}L${l10 + 4} ${i10 - 14}L${l10 + 8} ${i10 + 40}Q${n10} ${i10 + 48} ${c10 - 8} ${i10 + 40}L${c10 - 4} ${i10 - 14}L${n10 - a10 * 0.55} ${i10 - 18}Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5" stroke-linejoin="round"/><path d="M${n10 - a10 * 0.55} ${r10 + 18}L${n10 - 12} ${r10 - 2}M${n10 + a10 * 0.55} ${r10 + 18}L${n10 + 12} ${r10 - 2}" stroke="#94a3b8" stroke-width="3"/><rect x="${n10 - 18}" y="${i10 + 4}" width="36" height="22" rx="4" fill="none" stroke="#94a3b8" stroke-width="2.2"/>`);
  return d10;
}
function od(e17, t10) {
  let n10 = e17.top === `tshirt` || e17.top === `dress` || e17.top === `apron`, r10 = e17.topColor, i10 = e17.skin, a10 = t10.arm, o10 = n10 ? a10 * 0.34 : a10 - 12, s10 = `<path d="M0 0V${a10 - 8}" stroke="${td(i10)}" stroke-width="23" stroke-linecap="round"/><path d="M0 0V${a10 - 8}" stroke="${i10}" stroke-width="18" stroke-linecap="round"/>`;
  return s10 += `<path d="M0 -2V${o10}" stroke="${nd(r10)}" stroke-width="27" stroke-linecap="round"/><path d="M0 -2V${o10}" stroke="${r10}" stroke-width="22" stroke-linecap="round"/>`, s10 += `<circle cx="0" cy="${a10 - 4}" r="11" fill="${i10}" stroke="${td(i10)}" stroke-width="2.4"/>`, s10;
}
function sd(e17, t10, n10) {
  let r10 = t10.ankle - t10.hip, i10 = e17.skin, a10 = e17.bottomColor, o10 = ``, s10 = `<path d="M0 0V${r10 - 4}" stroke="${td(i10)}" stroke-width="19" stroke-linecap="round"/><path d="M0 0V${r10 - 4}" stroke="${i10}" stroke-width="14" stroke-linecap="round"/>`;
  return e17.top === `dress` || e17.bottom === `skirt` ? o10 += s10 : e17.bottom === `shorts` ? o10 += s10 + `<path d="M0 -6V${r10 * 0.36}" stroke="${nd(a10)}" stroke-width="29" stroke-linecap="round"/><path d="M0 -6V${r10 * 0.36}" stroke="${a10}" stroke-width="24" stroke-linecap="round"/>` : o10 += `<path d="M0 -6V${r10 - 6}" stroke="${nd(a10)}" stroke-width="29" stroke-linecap="round"/><path d="M0 -6V${r10 - 6}" stroke="${a10}" stroke-width="24" stroke-linecap="round"/>`, o10 += `<ellipse cx="${n10 * 7}" cy="${r10 + 6}" rx="17" ry="10" fill="${e17.shoes}" stroke="${nd(e17.shoes)}" stroke-width="2.5"/>`, o10;
}
var cd = (e17) => Math.round(e17 * 10) / 10;
function ld(e17, t10 = {}, n10 = {}) {
  let r10 = id(e17), i10 = t10.armL ?? 7, a10 = t10.armR ?? -7, o10 = r10.hx - r10.ax, s10 = r10.hx + r10.ax, c10 = r10.sy + 14, l10 = r10.hx - r10.lx, u10 = r10.hx + r10.lx, d10 = t10.bob ?? 0, f10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n10.view ?? `0 0 200 400`}" width="${n10.width ?? `100%`}" height="${n10.height ?? `100%`}" preserveAspectRatio="${n10.view ? `xMidYMid meet` : `xMidYMax meet`}" class="lh-av-svg">`;
  f10 += `<ellipse cx="100" cy="${r10.ankle + 16}" rx="52" ry="8" fill="#0f172a" opacity=".12"/>`, f10 += `<g class="av-all" transform="translate(0 ${cd(d10)})">`;
  let p10 = ud(r10, t10);
  return f10 += `<g class="av-up" transform="${p10}">${_ne(e17, r10)}</g>`, f10 += `<g class="av-legL" transform="rotate(${cd(t10.legL ?? 0)} ${l10} ${r10.hip})"><g transform="translate(${l10} ${r10.hip})">${sd(e17, r10, -1)}</g></g>`, f10 += `<g class="av-legR" transform="rotate(${cd(t10.legR ?? 0)} ${u10} ${r10.hip})"><g transform="translate(${u10} ${r10.hip})">${sd(e17, r10, 1)}</g></g>`, f10 += `<g class="av-up" transform="${p10}">`, f10 += `<rect x="${r10.hx - 11}" y="${r10.hy + r10.ry - 14}" width="22" height="${r10.sy - r10.hy - r10.ry + 22}" rx="8" fill="${e17.skin}" stroke="${td(e17.skin)}" stroke-width="2"/>`, f10 += Dne(e17, r10), f10 += `<g class="av-armL" transform="rotate(${cd(i10)} ${o10} ${c10})"><g transform="translate(${o10} ${c10})">${od(e17, r10)}</g></g>`, f10 += `<g class="av-armR" transform="rotate(${cd(a10)} ${s10} ${c10})"><g transform="translate(${s10} ${c10})">${od(e17, r10)}</g></g>`, f10 += `<g class="av-head">${Tne(e17, r10, t10)}${vne(e17, r10)}${wne(e17, r10)}${yne(e17, r10)}</g>`, f10 += `</g></g></svg>`, f10;
}
var ud = (e17, t10) => t10.up || t10.dip || t10.squash ? `translate(${e17.hx} ${cd(e17.hip + (t10.dip ?? 0))}) rotate(${cd(t10.up ?? 0)}) scale(1 ${cd(1 - (t10.squash ?? 0))}) translate(${-e17.hx} ${-e17.hip})` : ``;
function dd(e17, t10, n10) {
  let r10 = id(t10), i10 = r10.sy + 14, a10 = (t11, n11, r11, i11) => e17.querySelector(t11)?.setAttribute(`transform`, `rotate(${cd(n11)} ${r11} ${i11})`);
  a10(`.av-armL`, n10.armL ?? 7, r10.hx - r10.ax, i10), a10(`.av-armR`, n10.armR ?? -7, r10.hx + r10.ax, i10), a10(`.av-legL`, n10.legL ?? 0, r10.hx - r10.lx, r10.hip), a10(`.av-legR`, n10.legR ?? 0, r10.hx + r10.lx, r10.hip), e17.querySelector(`.av-all`)?.setAttribute(`transform`, `translate(0 ${cd(n10.bob ?? 0)})`);
  let o10 = ud(r10, n10);
  e17.querySelectorAll(`.av-up`).forEach((e18) => e18.setAttribute(`transform`, o10));
}
function fd(e17, t10) {
  let n10 = id(e17), r10 = (e18, t11, n11) => `${(e18 - n11 / 2).toFixed(1)} ${(t11 - n11 / 2).toFixed(1)} ${n11.toFixed(1)} ${n11.toFixed(1)}`;
  switch (t10) {
    case `head`:
      return r10(n10.hx, n10.hy - n10.ry * 0.12, Math.max(n10.rx, n10.ry) * 3.1);
    case `face`:
      return r10(n10.hx, n10.hy + n10.ry * 0.2, n10.ry * 2.25);
    case `eyes`:
      return r10(n10.hx, n10.hy + 2, n10.rx * 1.5);
    case `mouth`:
      return r10(n10.hx, n10.hy + n10.ry * 0.58, n10.rx * 1.05);
    case `body`:
      return r10(n10.hx, (n10.sy + n10.hip) / 2 + 4, (n10.hip - n10.sy) * 1.45);
    case `legs`:
      return r10(n10.hx, (n10.hip + n10.ankle) / 2 + 8, (n10.ankle - n10.hip) * 1.45);
    default:
      return `0 0 200 400`;
  }
}
var pd = (e17, t10) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(ld(e17, t10))}`;
var md = (e17) => e17?.name ? e17.name : `Figur`;
var hd = /* @__PURE__ */ new Map();
function One(e17, t10, n10, r10 = {}) {
  n10 && r10.assets && hd.set(t10.id, { assets: r10.assets, assetUrl: r10.assetUrl });
  let i10 = $u(t10.av), a10 = `${n10}|${JSON.stringify(i10)}`;
  e17.dataset.k !== a10 && (e17.dataset.k = a10, e17.setAttribute(`aria-label`, t10.say?.text || md(i10)), e17.innerHTML = n10 ? `<div class="lh-av">${ld(i10)}</div>` : `<img class="lh-av-img" src="${pd(i10)}" alt="" draggable="false">`);
}
var gd = /* @__PURE__ */ new WeakMap();
var kne = Au.map((e17) => e17.id).filter((e17) => e17 !== `random`);
var _d = (e17, t10) => e17 === `random` ? kne[Math.floor(Math.random() * kne.length)] : e17 ?? (t10 ? `talk` : `wave`);
function vd(e17, t10, n10) {
  gd.get(e17)?.stop();
  let r10 = id(t10), i10 = e17.querySelector(`.av-mouth`), a10 = 0, o10 = 0, s10 = (r11, i11) => {
    let s11 = Math.max(0, r11 - o10);
    o10 = r11, a10 = i11 ? Math.min(1, a10 + s11 / 260) : Math.max(0, a10 - s11 / 320), dd(e17, t10, hne(Nu(n10.move, r11), Mu(a10)));
  }, c10;
  if (!n10.text && !n10.url) {
    let o11 = performance.now(), l10 = n10.mime ? Math.max(n10.mime.ms, n10.move === `bow` ? 2100 : 0) : n10.move === `bow` ? 2200 : 1700, u10 = 0, d10 = NaN, f10 = (e18) => {
      e18 !== d10 && i10 && (d10 = e18, i10.innerHTML = e18 < 0 ? ad(t10, r10) : ad(t10, r10, e18));
    }, p10 = (t11) => {
      let r11 = t11 - o11;
      s10(r11, r11 < l10), n10.mime && f10(r11 < n10.mime.ms ? Math.round(n10.mime.level(r11) * 6) / 6 : -1), r11 < l10 || a10 > 0 ? u10 = requestAnimationFrame(p10) : gd.delete(e17);
    };
    u10 = requestAnimationFrame(p10), c10 = { stop: () => (cancelAnimationFrame(u10), dd(e17, t10, {}), f10(-1)), done: new Promise((e18) => setTimeout(e18, l10)) };
  } else {
    let a11 = gu({ text: n10.text, url: n10.url, pitch: n10.pitch, minMs: n10.move === `bow` ? 2100 : 0, after: 450, mouth: (e18) => {
      i10 && (i10.innerHTML = e18 < 0 ? ad(t10, r10) : ad(t10, r10, e18));
    }, frame: (e18, t11) => s10(e18, t11 || n10.move === `bow` && e18 < 2100) });
    c10 = { stop: () => {
      a11.stop(), dd(e17, t10, {});
    }, done: a11.done };
  }
  return gd.set(e17, c10), c10;
}
function Ane(e17, t10, n10, r10) {
  let i10 = t10?.querySelector(`svg.lh-av-svg`);
  if (!i10) return;
  let a10 = !!(e17.say?.text.trim() || e17.say?.sound);
  vd(i10, $u(e17.av), { text: ``, move: _d(e17.move, a10), mime: { ms: n10, level: r10 } });
}
function jne(e17, t10) {
  let n10 = t10?.querySelector(`svg.lh-av-svg`);
  if (!n10 || !t10) return;
  let r10 = $u(e17.av), i10 = hd.get(e17.id), a10 = e17.say?.sound ? i10?.assets[e17.say.sound] : void 0, o10 = a10 ? i10?.assetUrl ? i10.assetUrl(a10) : a10.dataUrl : void 0, s10 = !!(e17.say?.text.trim() || o10), c10 = s10 ? e17.say?.text.trim() ?? `` : r10.name ? `Hallo, ich bin ${r10.name}!` : ``;
  for (let n11 of Eu) if (n11(e17, t10, !!o10)) return;
  let l10 = vd(n10, r10, { text: c10, url: o10, pitch: e17.say?.pitch, move: _d(e17.move, s10) });
  for (let t11 of Tu) t11(e17.id, l10.done);
  return l10;
}
var Mne = `
.lh-av{position:absolute;inset:0}
.lh-av svg,.lh-av-img{display:block;width:100%;height:100%}
.lh-av svg{overflow:visible}
.lh-av-img{object-fit:contain;object-position:50% 100%}`;
var yd = `#1f2937`;
var bd = `#2b6cb0`;
var xd = (e17, t10) => [{ you: false, text: e17 }, { you: true, text: t10 }];
var Nne = [{ id: `sick`, label: `Krank melden`, p: { title: `Ich melde mich krank`, partner: `phone`, name: `Frau Meier (Werkstatt)`, lines: [...xd(`Werkstatt Sonnenhof, Meier, guten Morgen.`, `Guten Morgen, Frau Meier. Hier ist \u2026 Ich bin leider krank.`), ...xd(`Oh, gute Besserung! Was haben Sie denn?`, `Ich habe Fieber und Halsschmerzen.`), ...xd(`Wie lange fehlen Sie?`, `Ich gehe heute zum Arzt. Ich rufe morgen wieder an.`), ...xd(`In Ordnung. Danke f\xFCr Ihren Anruf. Auf Wiederh\xF6ren!`, `Auf Wiederh\xF6ren!`)] } }, { id: `doctor`, label: `Arzttermin`, p: { title: `Ich brauche einen Termin`, partner: `phone`, name: `Praxis Dr. Yilmaz`, lines: [...xd(`Praxis Doktor Yilmaz, guten Tag.`, `Guten Tag, hier ist \u2026 Ich brauche einen Termin.`), ...xd(`Was haben Sie denn?`, `Ich habe Halsschmerzen.`), ...xd(`K\xF6nnen Sie morgen um 9 Uhr kommen?`, `Ja, das passt. Morgen um 9 Uhr.`), ...xd(`Bringen Sie bitte Ihre Versichertenkarte mit.`, `Mache ich. Vielen Dank. Auf Wiederh\xF6ren!`)] } }, { id: `ride`, label: `Fahrdienst bestellen`, p: { title: `Ich bestelle den Fahrdienst`, partner: `phone`, name: `Fahrdienst`, lines: [...xd(`Fahrdienst, guten Tag. Was kann ich f\xFCr Sie tun?`, `Guten Tag, hier ist \u2026 Ich m\xF6chte eine Fahrt bestellen.`), ...xd(`Wann und wohin m\xF6chten Sie fahren?`, `Am Montag um 7 Uhr zur Werkstatt.`), ...xd(`Wie ist Ihre Adresse?`, `Meine Adresse ist \u2026`), ...xd(`Brauchen Sie Hilfe beim Einsteigen, zum Beispiel mit dem Rollstuhl?`, `Nein, danke. / Ja, ich habe einen Rollstuhl.`), ...xd(`Gut, wir holen Sie am Montag um 7 Uhr ab. Auf Wiederh\xF6ren!`, `Danke. Auf Wiederh\xF6ren!`)] } }, { id: `interview`, label: `Vorstellungsgespr\xE4ch`, p: { title: `Mein Vorstellungsgespr\xE4ch`, partner: `boss`, name: `Frau Wagner (Chefin)`, lines: [...xd(`Guten Tag! Sch\xF6n, dass Sie da sind. Bitte setzen Sie sich.`, `Guten Tag, Frau Wagner. Danke.`), ...xd(`Stellen Sie sich bitte kurz vor.`, `Ich hei\xDFe \u2026 Ich bin \u2026 Jahre alt. Ich gehe in die Berufsschulstufe.`), ...xd(`Warum m\xF6chten Sie ein Praktikum bei uns machen?`, `Ich arbeite gern mit \u2026 Ich m\xF6chte den Beruf kennenlernen.`), ...xd(`Was k\xF6nnen Sie gut?`, `Ich bin p\xFCnktlich und arbeite sorgf\xE4ltig.`), ...xd(`Haben Sie noch eine Frage an mich?`, `Wann f\xE4ngt die Arbeit an?`), ...xd(`Um 8 Uhr. Wir melden uns bei Ihnen. Auf Wiedersehen!`, `Danke f\xFCr das Gespr\xE4ch. Auf Wiedersehen!`)] } }, { id: `order`, label: `Im Caf\xE9 bestellen`, p: { title: `Ich bestelle im Caf\xE9`, partner: `cook`, name: `Kellner`, lines: [...xd(`Guten Tag! Was m\xF6chten Sie trinken?`, `Guten Tag. Ich h\xE4tte gern einen Apfelsaft, bitte.`), ...xd(`Gern. M\xF6chten Sie auch etwas essen?`, `Ja, ein St\xFCck Kuchen, bitte.`), ...xd(`Hier, bitte sch\xF6n. Guten Appetit!`, `Danke sch\xF6n.`), ...xd(`Darf es noch etwas sein?`, `Nein, danke. Ich m\xF6chte bitte zahlen.`), ...xd(`Das macht 6 Euro 50.`, `Hier sind 7 Euro. Stimmt so.`)] } }, { id: `help`, label: `Um Hilfe bitten (Arbeit)`, p: { title: `Ich bitte um Hilfe`, partner: `colleague`, name: `Herr Demir (Gruppenleiter)`, lines: [...xd(`Na, wie l\xE4uft es?`, `Entschuldigung, Herr Demir. Ich brauche Hilfe.`), ...xd(`Was ist denn los?`, `Ich verstehe die Aufgabe nicht. K\xF6nnen Sie es mir noch einmal zeigen?`), ...xd(`Klar. Schauen Sie: Zuerst \u2026, dann \u2026 Alles klar?`, `Ja, jetzt verstehe ich es. Danke!`), ...xd(`Gern. Sagen Sie einfach Bescheid, wenn etwas ist.`, `Mache ich.`)] } }];
function Sd(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = (Array.isArray(t10.lines) ? t10.lines : []).slice(0, 16).flatMap((e18) => {
    let t11 = e18 && typeof e18 == `object` ? e18 : {}, n11 = typeof t11.text == `string` ? t11.text.slice(0, 200) : ``;
    return n11 ? [{ you: t11.you === true, text: n11 }] : [];
  }), r10 = typeof t10.partner == `string` && (t10.partner === `phone` || ed.some((e18) => e18.id === t10.partner)) ? t10.partner : `phone`;
  return { title: typeof t10.title == `string` ? t10.title.slice(0, 80) : ``, partner: r10, name: typeof t10.name == `string` ? t10.name.slice(0, 40) : ``, lines: n10, hint: t10.hint !== false };
}
var Cd = /* @__PURE__ */ new Map();
function Fne(e17) {
  let t10 = JSON.stringify(e17.gp ?? {}), n10 = Cd.get(e17.id);
  return n10 && n10.key === t10 || (n10 && wd(n10), Cd.set(e17.id, n10 = { key: t10, pos: -1, tip: false, rec: `idle`, urls: /* @__PURE__ */ new Map() })), n10;
}
function wd(e17) {
  e17.stop?.();
  for (let t10 of e17.urls.values()) URL.revokeObjectURL(t10);
  e17.urls.clear();
}
var Td = null;
var Rne = false;
async function zne() {
  if (Td && ti(Td.stream)) return Td.stream.getAudioTracks().forEach((e18) => e18.enabled = true), Td.stream;
  Ed();
  let e17 = ni();
  try {
    let t10 = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    return Td = { stream: t10, end: e17 }, Rne || (Rne = true, window.addEventListener(`pagehide`, () => Ed())), t10;
  } catch (t10) {
    throw e17(), t10;
  }
}
function Bne() {
  Td && (ps() ? Ed() : Td.stream.getAudioTracks().forEach((e17) => e17.enabled = false));
}
function Ed() {
  let e17 = Td;
  Td = null, e17 && (e17.stream.getTracks().forEach((e18) => e18.stop()), e17.end());
}
var Vne = (e17) => e17.partner === `boss` || /frau|praxis/i.test(e17.name) ? 1.08 : 0.92;
async function Hne(e17, t10, n10) {
  let r10;
  try {
    r10 = await zne();
  } catch {
    M(`Das Mikrofon geht hier nicht. Sprich einfach laut.`);
    return;
  }
  let i10 = new MediaRecorder(r10), a10 = [];
  i10.ondataavailable = (e18) => e18.data.size && a10.push(e18.data), i10.onstop = () => {
    if (Bne(), t10.stop = void 0, t10.rec = `idle`, a10.length) {
      let e18 = t10.urls.get(n10);
      e18 && URL.revokeObjectURL(e18), t10.urls.set(n10, URL.createObjectURL(new Blob(a10, { type: i10.mimeType || `audio/mp4` })));
    }
    Dd.redraw(e17);
  }, t10.stop = () => i10.state !== `inactive` && i10.stop(), t10.rec = `on`, i10.start(), Dd.redraw(e17), setTimeout(() => t10.stop?.(), 3e4);
}
function Une(e17, t10, n10, r10, i10) {
  if (e17.partner === `phone`) {
    let e18 = Math.min(r10 * 0.6, i10 * 0.42), a11 = t10 + (r10 - e18) / 2, o10 = e18 * 1.9, s10 = n10 + (i10 - o10) / 2;
    return `<rect x="${A(a11)}" y="${A(s10)}" width="${A(e18)}" height="${A(o10)}" rx="${A(e18 * 0.16)}" fill="#1f2937"/><rect x="${A(a11 + e18 * 0.08)}" y="${A(s10 + o10 * 0.08)}" width="${A(e18 * 0.84)}" height="${A(o10 * 0.78)}" rx="10" fill="#e7f5ff"/><circle cx="${A(a11 + e18 / 2)}" cy="${A(s10 + o10 * 0.36)}" r="${A(e18 * 0.2)}" fill="#94a3b8"/><path d="M${A(a11 + e18 * 0.22)} ${A(s10 + o10 * 0.66)}q${A(e18 * 0.28)}-${A(e18 * 0.34)} ${A(e18 * 0.56)} 0" fill="#94a3b8"/>`;
  }
  let a10 = ed.find((t11) => t11.id === e17.partner);
  return ld($u({ ...Yu, child: false, ...a10?.av ?? {} }), {}, { width: String(Math.round(r10)), height: String(Math.round(i10)) }).replace(`<svg `, `<svg x="${A(t10)}" y="${A(n10)}" `);
}
function Wne(e17, t10) {
  let n10 = Sd(e17.gp), r10 = t10 ? Fne(e17) : { pos: -1, tip: false, rec: `idle`, urls: /* @__PURE__ */ new Map() }, i10 = Math.max(900, e17.w), a10 = Math.max(500, e17.h), o10 = `<rect x="0" y="0" width="${i10}" height="${a10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`;
  o10 += qo(Ko(n10.title || `Gespr\xE4ch \xFCben`, i10 * 0.7, 56, 40, 20, 1).lines, 30, 50, 36, `font-weight="700" fill="${yd}"`, `start`);
  let s10 = n10.lines.length;
  if (t10 && s10) for (let e18 = 0; e18 < s10; e18++) o10 += `<circle cx="${A(i10 - 30 - (s10 - 1 - e18) * 22)}" cy="44" r="7" fill="${e18 < r10.pos ? `#2f9e44` : e18 === r10.pos ? `#f08c00` : `#e2e8f0`}"/>`;
  let c10 = Math.min(330, i10 * 0.28);
  o10 += Une(n10, 30, 90, c10, a10 - 170), o10 += qo(Ko(n10.name, c10, 40, 24, 14, 1).lines, 30 + c10 / 2, a10 - 50, 22, `font-weight="700" fill="#475569"`);
  let l10 = 30 + c10 + 30, u10 = i10 - l10 - 30;
  if (!t10 || r10.pos < 0) {
    if (!t10) {
      let e18 = Math.min(64, (a10 - 110) / Math.max(1, s10));
      return n10.lines.forEach((t11, r11) => {
        let i11 = 90 + r11 * e18;
        o10 += `<rect x="${A(l10)}" y="${A(i11)}" width="${A(u10)}" height="${A(e18 - 6)}" rx="10" fill="${t11.you ? `#e7f5ff` : `#f8fafc`}" stroke="${t11.you ? bd : `#e2e8f0`}" stroke-width="2"/>`, o10 += qo(Ko(`${t11.you ? `Du` : n10.name.split(` (`)[0] || `Gegen\xFCber`}: ${t11.text}`, u10 - 24, e18 - 12, 22, 12, 2).lines, l10 + 12, i11 + (e18 - 6) / 2, 20, `fill="${yd}"`, `start`);
      }), { body: o10, vw: i10, vh: a10 };
    }
    return o10 += qo(Ko(`Ein Gespr\xE4ch zum \xDCben: ${s10} Schritte. H\xF6r gut zu. Wenn du dran bist, sprich laut.`, u10 - 40, 200, 32, 18, 4).lines, l10 + u10 / 2, a10 * 0.38, 30, `fill="${yd}"`), o10 += `<g${Vo(t10, `start`)}><rect x="${A(l10 + u10 / 2 - 150)}" y="${A(a10 * 0.56)}" width="300" height="90" rx="45" fill="#2f9e44"/><text x="${A(l10 + u10 / 2)}" y="${A(a10 * 0.56 + 58)}" text-anchor="middle" font-family="${j}" font-size="38" font-weight="700" fill="#ffffff">Start</text></g>`, { body: o10, vw: i10, vh: a10 };
  }
  if (r10.pos >= s10) return o10 += qo([`Gespr\xE4ch geschafft!`], l10 + u10 / 2, a10 * 0.36, 48, `font-weight="700" fill="#2f9e44"`), o10 += qo(Ko(`Du kannst es noch einmal \xFCben \u2013 vielleicht mit eigenen Worten.`, u10 - 40, 100, 28, 16, 2).lines, l10 + u10 / 2, a10 * 0.48, 26, `fill="${yd}"`), o10 += `<g${Vo(t10, `again`)}><rect x="${A(l10 + u10 / 2 - 150)}" y="${A(a10 * 0.6)}" width="300" height="80" rx="40" fill="${bd}"/><text x="${A(l10 + u10 / 2)}" y="${A(a10 * 0.6 + 52)}" text-anchor="middle" font-family="${j}" font-size="34" font-weight="700" fill="#ffffff">Nochmal</text></g>`, { body: o10, vw: i10, vh: a10 };
  let d10 = n10.lines[r10.pos];
  if (d10.you) {
    o10 += `<text x="${A(l10 + 20)}" y="128" font-family="${j}" font-size="34" font-weight="700" fill="${bd}">Du bist dran!</text>`;
    let e18 = n10.hint || r10.tip, i11 = a10 * 0.36;
    o10 += `<rect x="${A(l10 + 20)}" y="150" width="${A(u10 - 20)}" height="${A(i11)}" rx="20" fill="#e7f5ff" stroke="${bd}" stroke-width="3" stroke-dasharray="${e18 ? `0` : `10 8`}"/>`, o10 += e18 ? qo(Ko(d10.text, u10 - 80, i11 - 30, 34, 18, 4).lines, l10 + 50, 150 + i11 / 2, 32, `fill="${yd}"`, `start`) : `<g${Vo(t10, `tip`)}><rect x="${A(l10 + 20)}" y="150" width="${A(u10 - 20)}" height="${A(i11)}" fill="transparent"/>${qo([`\u{1F4A1} Tipp zeigen`], l10 + 10 + u10 / 2, 150 + i11 / 2, 32, `font-weight="700" fill="${bd}"`)}</g>`;
    let s11 = 150 + i11 + 30, c11 = r10.rec === `on`;
    o10 += `<g${Vo(t10, `rec`)}><rect x="${A(l10 + 20)}" y="${A(s11)}" width="250" height="76" rx="38" fill="${c11 ? `#e03131` : `#ffffff`}" stroke="#e03131" stroke-width="3"/><text x="${A(l10 + 145)}" y="${A(s11 + 48)}" text-anchor="middle" font-family="${j}" font-size="28" font-weight="700" fill="${c11 ? `#ffffff` : `#e03131`}">${c11 ? `\u25A0 Stopp` : `\u25CF Aufnehmen`}</text></g>`, r10.urls.has(r10.pos) && !c11 && (o10 += `<g${Vo(t10, `play`)}><rect x="${A(l10 + 290)}" y="${A(s11)}" width="250" height="76" rx="38" fill="#ffffff" stroke="#2f9e44" stroke-width="3"/><text x="${A(l10 + 415)}" y="${A(s11 + 48)}" text-anchor="middle" font-family="${j}" font-size="28" font-weight="700" fill="#2f9e44">\u25B6 Anh\xF6ren</text></g>`), o10 += `<text x="${A(l10 + 20)}" y="${A(s11 + 112)}" font-family="${j}" font-size="20" fill="#64748b">Die Aufnahme ist nur zum Anh\xF6ren \u2013 sie wird nicht gespeichert.</text>`;
  } else {
    let e18 = Ko(d10.text, u10 - 80, a10 * 0.4, 36, 18, 5), n11 = Math.min(a10 * 0.5, e18.lines.length * e18.size * 1.25 + 70);
    o10 += `<path d="M${A(l10 + 30)} ${A(150 + n11 * 0.4)}L${A(l10 - 6)} ${A(150 + n11 * 0.5)}L${A(l10 + 30)} ${A(150 + n11 * 0.6)}Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/>`, o10 += `<rect x="${A(l10 + 20)}" y="150" width="${A(u10 - 20)}" height="${A(n11)}" rx="24" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/>`, o10 += qo(e18.lines, l10 + 50, 150 + n11 / 2, e18.size, `fill="${yd}"`, `start`), o10 += `<g${Vo(t10, `hear`)}><rect x="${A(l10 + 20)}" y="${A(a10 - 110)}" width="250" height="76" rx="38" fill="#ffffff" stroke="#94a3b8" stroke-width="3"/><text x="${A(l10 + 145)}" y="${A(a10 - 62)}" text-anchor="middle" font-family="${j}" font-size="28" font-weight="700" fill="${yd}">\u{1F50A} Nochmal</text></g>`;
  }
  return o10 += `<g${Vo(t10, `next`)}><rect x="${A(i10 - 280)}" y="${A(a10 - 110)}" width="250" height="76" rx="38" fill="${bd}"/><text x="${A(i10 - 155)}" y="${A(a10 - 62)}" text-anchor="middle" font-family="${j}" font-size="30" font-weight="700" fill="#ffffff">Weiter \u2192</text></g>`, { body: o10, vw: i10, vh: a10 };
}
function Gne(e17) {
  let t10 = Sd(e17.gp);
  return `${t10.title}. ${t10.lines.map((e18) => `${e18.you ? `Du` : `Gegen\xFCber`}: ${e18.text}`).join(` `)}`;
}
var Dd = Uo({ cls: `lh-ct-practice`, view: Wne, label: Gne, hit(e17, t10, n10) {
  let r10 = Dd.item(e17);
  if (!r10) return;
  let i10 = Sd(r10.gp), a10 = Fne(r10), o10 = () => {
    let e18 = i10.lines[a10.pos];
    e18 && (e18.you ? M(`Du bist dran.`) : M(e18.text, void 0, { pitch: Vne(i10) }));
  };
  if (t10 === `start` || t10 === `again`) {
    a10.pos = 0, a10.tip = false;
    for (let e18 of a10.urls.values()) URL.revokeObjectURL(e18);
    a10.urls.clear(), _i(), o10();
  } else if (t10 === `next`) {
    if (a10.rec === `on`) return Wo(n10);
    ms(), a10.pos++, a10.tip = false, a10.pos >= i10.lines.length ? (vi(), M(`Gespr\xE4ch geschafft!`)) : o10();
  } else if (t10 === `hear`) ms(), o10();
  else if (t10 === `tip`) a10.tip = true, M(i10.lines[a10.pos]?.text ?? ``);
  else if (t10 === `rec`) {
    a10.rec === `on` ? a10.stop?.() : (ms(), Hne(e17, a10, a10.pos));
    return;
  } else if (t10 === `play`) {
    let e18 = a10.urls.get(a10.pos);
    e18 && M(``, e18);
    return;
  }
  Dd.redraw(e17);
} });
var Kne = Dd.draw;
var qne = [{ id: `ticket`, label: `Fahrkartenautomat` }, { id: `atm`, label: `Geldautomat` }, { id: `drinks`, label: `Getr\xE4nkeautomat` }];
var Od = (e17 = `ticket`) => ({ kind: e17, title: qne.find((t10) => t10.id === e17).label, items: e17 === `drinks` ? [{ name: `Wasser`, cent: 120 }, { name: `Apfelschorle`, cent: 150 }, { name: `Orangensaft`, cent: 170 }, { name: `Cola`, cent: 180 }, { name: `Kakao`, cent: 140 }, { name: `Tee`, cent: 100 }] : [{ name: `Einzelfahrt Erwachsene`, cent: 320 }, { name: `Einzelfahrt erm\xE4\xDFigt`, cent: 180 }, { name: `Tageskarte`, cent: 750 }, { name: `4-Fahrten-Karte`, cent: 1160 }], pin: `1234`, amounts: [2e3, 5e3, 1e4, 2e4] });
function kd(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = t10.kind === `atm` || t10.kind === `drinks` ? t10.kind : `ticket`, r10 = Od(n10), i10 = (Array.isArray(t10.items) ? t10.items : []).slice(0, 6).flatMap((e18) => {
    let t11 = e18 && typeof e18 == `object` ? e18 : {}, n11 = typeof t11.name == `string` ? t11.name.slice(0, 40) : ``, r11 = typeof t11.cent == `number` && Number.isFinite(t11.cent) ? Math.max(10, Math.min(5e3, Math.round(t11.cent / 10) * 10)) : 0;
    return n11 && r11 ? [{ name: n11, cent: r11 }] : [];
  }), a10 = typeof t10.pin == `string` && /^\d{4}$/.test(t10.pin) ? t10.pin : `1234`, o10 = (Array.isArray(t10.amounts) ? t10.amounts : []).filter((e18) => typeof e18 == `number` && e18 >= 500 && e18 <= 5e4).slice(0, 4);
  return { kind: n10, title: typeof t10.title == `string` ? t10.title.slice(0, 60) : r10.title, items: i10.length ? i10 : n10 === `atm` ? [] : r10.items, pin: a10, amounts: o10.length ? o10 : r10.amounts };
}
var Jne = [10, 20, 50, 100, 200];
var Yne = [500, 1e3, 2e3];
var Xne = { 500: `#c5cbb8`, 1e3: `#f2b8b0`, 2e3: `#a8c8ec`, 5e3: `#f6c58f`, 1e4: `#a7d7a0`, 2e4: `#f3e08b` };
var Ad = (e17) => `${Math.floor(e17 / 100)},${String(e17 % 100).padStart(2, `0`)} \u20AC`;
var jd = (e17) => e17 < 100 ? `${e17} Cent` : `${Math.floor(e17 / 100)} Euro${e17 % 100 ? ` ${e17 % 100}` : ``}`;
function Md(e17) {
  let t10 = [];
  for (let n10 of [2e3, 1e3, 500, 200, 100, 50, 20, 10]) for (; e17 >= n10; ) t10.push(n10), e17 -= n10;
  return t10;
}
function Nd(e17, t10, n10, r10) {
  let i10 = e17 >= 100 ? `${e17 / 100} \u20AC` : `${e17} ct`;
  if (e17 >= 500) return `<rect x="${A(t10 - r10 * 1.6)}" y="${A(n10 - r10 * 0.85)}" width="${A(r10 * 3.2)}" height="${A(r10 * 1.7)}" rx="6" fill="${Xne[e17] ?? `#ddd`}" stroke="#475569" stroke-width="2"/><text x="${A(t10)}" y="${A(n10 + r10 * 0.32)}" text-anchor="middle" font-family="${j}" font-size="${A(r10 * 0.85)}" font-weight="700" fill="#1f2937">${i10}</text>`;
  let a10 = e17 === 200 ? `#cfd4da` : e17 === 100 || e17 >= 10 && e17 <= 50 ? `#e0b84a` : `#c47a3a`, o10 = e17 === 200 ? `#e0b84a` : e17 === 100 ? `#cfd4da` : a10;
  return `<circle cx="${A(t10)}" cy="${A(n10)}" r="${A(r10)}" fill="${a10}" stroke="#7a5c1e" stroke-width="2"/>${o10 === a10 ? `` : `<circle cx="${A(t10)}" cy="${A(n10)}" r="${A(r10 * 0.7)}" fill="${o10}"/>`}<text x="${A(t10)}" y="${A(n10 + r10 * 0.3)}" text-anchor="middle" font-family="${j}" font-size="${A(r10 * 0.62)}" font-weight="700" fill="#1f2937">${i10}</text>`;
}
var Pd = /* @__PURE__ */ new Map();
var Fd = (e17) => ({ key: e17, step: `start`, choice: -1, paid: 0, pin: ``, tries: 0, amount: 0, out: [], msg: `` });
function Zne(e17) {
  let t10 = JSON.stringify(e17.mc ?? {}), n10 = Pd.get(e17.id);
  return n10 && n10.key === t10 || Pd.set(e17.id, n10 = Fd(t10)), n10;
}
var Id = `#1f2937`;
var $ne = `#0b3d6b`;
function Ld(e17, t10, n10, r10, i10, a10, o10, s10 = `#ffffff`, c10 = Id, l10 = 26) {
  return `<g${Vo(e17, t10)}><rect x="${A(n10)}" y="${A(r10)}" width="${A(i10)}" height="${A(a10)}" rx="12" fill="${s10}" stroke="#94a3b8" stroke-width="2"/>${qo(Ko(o10, i10 - 16, a10 - 8, l10, 12, 2).lines, n10 + i10 / 2, r10 + a10 / 2, l10, `font-weight="700" fill="${c10}"`)}</g>`;
}
function ere(e17, t10, n10, r10, i10, a10, o10) {
  let s10 = `<rect x="${A(r10)}" y="${A(i10)}" width="${A(a10)}" height="${A(o10)}" rx="12" fill="${$ne}"/>`, c10 = (e18) => qo(Ko(e18, a10 - 40, 70, 30, 16, 2).lines, r10 + a10 / 2, i10 + 44, 28, `font-weight="700" fill="#ffffff"`), l10 = e17.kind === `atm` ? 0 : e17.items[t10.choice]?.cent ?? 0;
  switch (t10.step) {
    case `start`:
      if (e17.kind === `atm`) s10 += c10(`Willkommen. Bitte Karte einstecken.`), s10 += `<rect x="${A(r10 + a10 / 2 - 70)}" y="${A(i10 + o10 / 2 - 20)}" width="140" height="90" rx="10" fill="#e7f5ff" opacity="0.9"/><path d="M${A(r10 + a10 / 2)} ${A(i10 + o10 / 2 + 90)}v40m-16-16l16 16 16-16" stroke="#ffd43b" stroke-width="6" fill="none"/>`;
      else {
        s10 += c10(e17.kind === `ticket` ? `Welche Fahrkarte m\xF6chtest du?` : `Was m\xF6chtest du trinken?`);
        let t11 = e17.items.length, l11 = e17.kind === `drinks` ? 3 : 1, u10 = Math.ceil(t11 / l11), d10 = (a10 - 40 - (l11 - 1) * 10) / l11, f10 = Math.min(76, (o10 - 100 - (u10 - 1) * 10) / u10);
        e17.items.forEach((t12, a11) => {
          let o11 = r10 + 20 + a11 % l11 * (d10 + 10), c11 = i10 + 86 + Math.floor(a11 / l11) * (f10 + 10);
          if (e17.kind === `drinks`) {
            let e18 = Ko(`${a11 + 1} \xB7 ${t12.name}`, d10 - 16, f10 / 2, 22, 12, 1);
            s10 += `<g${Vo(n10, `c:${a11}`)}><rect x="${A(o11)}" y="${A(c11)}" width="${A(d10)}" height="${A(f10)}" rx="12" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>${qo(e18.lines, o11 + d10 / 2, c11 + f10 * 0.34, e18.size, `font-weight="700" fill="${Id}"`)}${qo([Ad(t12.cent)], o11 + d10 / 2, c11 + f10 * 0.72, 22, `fill="#2b6cb0" font-weight="700"`)}</g>`;
          } else s10 += Ld(n10, `c:${a11}`, o11, c11, d10, f10, `${t12.name}  ${Ad(t12.cent)}`, `#ffffff`, Id, 22);
        });
      }
      break;
    case `pay`:
    case `wait`:
      s10 += c10(t10.step === `wait` ? `Kartenzahlung \u2026 bitte warten.` : e17.items[t10.choice]?.name ?? ``), [[`Zu zahlen:`, Ad(l10)], [`Bezahlt:`, Ad(t10.paid)], [`Noch:`, Ad(Math.max(0, l10 - t10.paid))]].forEach(([e18, t11], n11) => {
        s10 += `<text x="${A(r10 + 40)}" y="${A(i10 + 120 + n11 * 52)}" font-family="${j}" font-size="30" fill="#ffffff">${e18}</text><text x="${A(r10 + a10 - 40)}" y="${A(i10 + 120 + n11 * 52)}" text-anchor="end" font-family="${j}" font-size="34" font-weight="700" fill="${n11 === 2 ? `#ffd43b` : `#ffffff`}">${t11}</text>`;
      }), t10.step === `pay` && (s10 += `<text x="${A(r10 + a10 / 2)}" y="${A(i10 + o10 - 80)}" text-anchor="middle" font-family="${j}" font-size="22" fill="#cfe3f7">${e17.kind === `ticket` ? `M\xFCnzen, Scheine oder Karte` : `M\xFCnzen oder Scheine`} aus dem Geldbeutel</text>`), t10.step === `pay` && (s10 += Ld(n10, `cancel`, r10 + a10 / 2 - 110, i10 + o10 - 62, 220, 50, `Abbrechen`, `#e03131`, `#ffffff`, 24));
      break;
    case `take`:
      s10 += c10(t10.out.some((e18) => e18.kind === `ticket` || e18.kind === `drink`) ? `Bitte ${e17.kind === `ticket` ? `Fahrkarte` : `Getr\xE4nk`}${t10.out.some((e18) => e18.kind === `change`) ? ` und R\xFCckgeld` : ``} nehmen.` : `Bitte R\xFCckgeld nehmen.`);
      break;
    case `pin`:
      s10 += c10(t10.msg || `Geheimzahl eingeben`);
      for (let e18 = 0; e18 < 4; e18++) s10 += `<circle cx="${A(r10 + a10 / 2 - 75 + e18 * 50)}" cy="${A(i10 + 120)}" r="14" fill="${e18 < t10.pin.length ? `#ffffff` : `none`}" stroke="#ffffff" stroke-width="3"/>`;
      s10 += `<text x="${A(r10 + a10 / 2)}" y="${A(i10 + o10 - 30)}" text-anchor="middle" font-family="${j}" font-size="22" fill="#ffd43b">Verdecke die Tasten mit der anderen Hand!</text>`;
      break;
    case `amount`:
      s10 += c10(`Wie viel Geld m\xF6chtest du?`), e17.amounts.forEach((e18, t11) => {
        let o11 = (a10 - 50) / 2;
        s10 += Ld(n10, `m:${e18}`, r10 + 20 + t11 % 2 * (o11 + 10), i10 + 96 + Math.floor(t11 / 2) * 90, o11, 76, Ad(e18).replace(`,00`, ``), `#ffffff`, Id, 30);
      }), s10 += Ld(n10, `cancel`, r10 + a10 / 2 - 110, i10 + o10 - 62, 220, 50, `Abbrechen`, `#e03131`, `#ffffff`, 24);
      break;
    case `card`:
      s10 += c10(`Bitte zuerst die Karte entnehmen.`);
      break;
    case `cash`:
      s10 += c10(`Bitte das Geld entnehmen.`);
      break;
    case `receipt`:
      s10 += c10(`M\xF6chtest du einen Beleg?`), s10 += Ld(n10, `rc:1`, r10 + 40, i10 + 120, (a10 - 100) / 2, 80, `Ja`, `#2f9e44`, `#ffffff`, 30), s10 += Ld(n10, `rc:0`, r10 + a10 / 2 + 10, i10 + 120, (a10 - 100) / 2, 80, `Nein`, `#ffffff`, Id, 30);
      break;
    case `kept`:
      s10 += c10(`Dreimal falsch: Die Karte bleibt im Automaten.`), s10 += qo(Ko(`Ruf deine Bank an. (Beim \xDCben: \u201ENochmal\u201C.)`, a10 - 60, 80, 24, 14, 2).lines, r10 + a10 / 2, i10 + o10 / 2 + 20, 24, `fill="#ffd43b"`), s10 += Ld(n10, `again`, r10 + a10 / 2 - 110, i10 + o10 - 70, 220, 56, `Nochmal`, `#ffffff`, Id, 26);
      break;
    case `done`:
      s10 += c10(e17.kind === `atm` ? `Fertig. Steck die ${Ad(t10.amount).replace(`,00`, ``)} gut ein!` : e17.kind === `ticket` ? `Gute Fahrt!` : `Zum Wohl!`), s10 += Ld(n10, `again`, r10 + a10 / 2 - 130, i10 + o10 / 2, 260, 66, e17.kind === `atm` ? `Nochmal abheben` : `Nochmal kaufen`, `#ffffff`, Id, 26);
  }
  return s10;
}
function tre(e17, t10) {
  let n10 = kd(e17.mc), r10 = t10 ? Zne(e17) : Fd(``), i10 = Math.max(900, e17.w), a10 = Math.max(600, e17.h), o10 = `<rect x="0" y="0" width="${i10}" height="${a10}" rx="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>`, s10 = Math.min(700, i10 * 0.56), c10 = a10 - 60, l10 = n10.kind === `ticket` ? `#e8590c` : n10.kind === `atm` ? `#495057` : `#c92a2a`;
  o10 += `<rect x="30" y="30" width="${A(s10)}" height="${A(c10)}" rx="22" fill="${l10}" stroke="#1f2937" stroke-width="4"/>`, o10 += qo(Ko(n10.title, s10 - 60, 50, 32, 16, 1).lines, 30 + s10 / 2, 66, 30, `font-weight="700" fill="#ffffff"`);
  let u10 = s10 - 60, d10 = n10.kind === `atm` ? Math.min(330, c10 * 0.42) : Math.min(420, c10 * 0.55);
  o10 += ere(n10, r10, t10, 60, 100, u10, d10);
  let f10 = 100 + d10 + 20;
  n10.kind === `atm` ? ([`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `\u232B`, `0`, `OK`].forEach((e18, n11) => {
    let i11 = 60 + n11 % 3 * 80, a11 = f10 + Math.floor(n11 / 3) * 52, s11 = e18 === `OK` ? `#2f9e44` : e18 === `\u232B` ? `#f59f00` : `#e9ecef`;
    o10 += `<g${Vo(t10 && r10.step === `pin`, `k:${e18}`)}><rect x="${A(i11)}" y="${A(a11)}" width="70" height="44" rx="8" fill="${s11}" stroke="#1f2937" stroke-width="2"/><text x="${A(i11 + 35)}" y="${A(a11 + 31)}" text-anchor="middle" font-family="${j}" font-size="24" font-weight="700" fill="${e18 === `OK` ? `#ffffff` : Id}">${e18}</text></g>`;
  }), o10 += `<rect x="${A(330)}" y="${A(f10 + 10)}" width="${A(u10 - 240 - 30)}" height="14" rx="7" fill="#1f2937"/><text x="${A(330)}" y="${A(f10 + 50)}" font-family="${j}" font-size="20" fill="#ffffff">Karte</text>`, o10 += `<rect x="${A(330)}" y="${A(f10 + 90)}" width="${A(u10 - 240 - 30)}" height="20" rx="6" fill="#1f2937"/><text x="${A(330)}" y="${A(f10 + 134)}" font-family="${j}" font-size="20" fill="#ffffff">Geld</text>`) : (o10 += `<rect x="${A(60)}" y="${A(f10)}" width="120" height="16" rx="8" fill="#1f2937"/><text x="${A(60)}" y="${A(f10 + 40)}" font-family="${j}" font-size="20" fill="#ffffff">M\xFCnzen</text>`, o10 += `<rect x="${A(210)}" y="${A(f10)}" width="160" height="16" rx="6" fill="#1f2937"/><text x="${A(210)}" y="${A(f10 + 40)}" font-family="${j}" font-size="20" fill="#ffffff">Scheine</text>`, n10.kind === `ticket` && (o10 += `<rect x="${A(400)}" y="${A(f10)}" width="90" height="16" rx="6" fill="#1f2937"/><text x="${A(400)}" y="${A(f10 + 40)}" font-family="${j}" font-size="20" fill="#ffffff">Karte</text>`));
  let p10 = 30 + c10 - 130;
  o10 += `<rect x="${A(60)}" y="${A(p10)}" width="${A(u10)}" height="100" rx="14" fill="#1f2937"/><text x="${A(74)}" y="${A(p10 + 24)}" font-family="${j}" font-size="18" fill="#adb5bd">Ausgabe</text>`, r10.out.forEach((e18, n11) => {
    let r11 = 90 + n11 * 170;
    o10 += `<g${Vo(t10, `o:${n11}`)}><title>${Bo(e18.label)}</title>`, e18.kind === `ticket` || e18.kind === `receipt` ? o10 += `<rect x="${A(r11)}" y="${A(p10 + 30)}" width="140" height="58" rx="4" fill="#ffffff" stroke="#adb5bd" stroke-width="2"/>${qo(Ko(e18.label, 130, 50, 18, 10, 2).lines, r11 + 70, p10 + 59, 16, `font-weight="700" fill="${Id}"`)}` : e18.kind === `card` ? o10 += `<rect x="${A(r11)}" y="${A(p10 + 30)}" width="100" height="62" rx="8" fill="#1c7ed6"/><rect x="${A(r11 + 12)}" y="${A(p10 + 46)}" width="22" height="16" rx="3" fill="#ffd43b"/>` : e18.kind === `drink` ? o10 += `<rect x="${A(r11 + 30)}" y="${A(p10 + 26)}" width="44" height="68" rx="10" fill="#74c0fc" stroke="#1f2937" stroke-width="2"/><rect x="${A(r11 + 40)}" y="${A(p10 + 20)}" width="24" height="10" rx="3" fill="#e03131"/>` : (e18.values ?? []).slice(0, 4).forEach((e19, t11) => o10 += Nd(e19, r11 + 30 + t11 * 18, p10 + 60, 24)), o10 += `</g>`;
  });
  let m10 = 30 + s10 + 40, h10 = i10 - m10 - 30;
  if (o10 += `<rect x="${A(m10)}" y="30" width="${A(h10)}" height="${A(c10)}" rx="22" fill="#ffffff" stroke="#94a3b8" stroke-width="3"/>`, o10 += `<text x="${A(m10 + 24)}" y="72" font-family="${j}" font-size="28" font-weight="700" fill="${Id}">Dein Geldbeutel</text>`, n10.kind !== `atm` && (Jne.forEach((e18, n11) => {
    let r11 = m10 + 60 + n11 % 3 * ((h10 - 80) / 3), i11 = 130 + Math.floor(n11 / 3) * 90;
    o10 += `<g${Vo(t10, `p:${e18}`)}><title>${e18 >= 100 ? `${e18 / 100} Euro` : `${e18} Cent`}</title><circle cx="${A(r11)}" cy="${A(i11)}" r="44" fill="transparent"/>${Nd(e18, r11, i11, 34)}</g>`;
  }), Yne.forEach((e18, n11) => {
    let r11 = m10 + 80 + n11 % 2 * ((h10 - 80) / 2), i11 = 320 + Math.floor(n11 / 2) * 80;
    o10 += `<g${Vo(t10, `p:${e18}`)}><title>${e18 / 100} Euro</title>${Nd(e18, r11, i11, 30)}</g>`;
  })), n10.kind !== `drinks`) {
    let e18 = n10.kind === `atm` ? 120 : 470;
    o10 += `<g${Vo(t10, `card`)}><title>Bankkarte</title><rect x="${A(m10 + 40)}" y="${e18}" width="200" height="124" rx="14" fill="#1c7ed6"/><rect x="${A(m10 + 64)}" y="${e18 + 30}" width="40" height="30" rx="5" fill="#ffd43b"/><text x="${A(m10 + 64)}" y="${e18 + 100}" font-family="${j}" font-size="20" fill="#ffffff">Bankkarte</text></g>`;
  }
  return n10.kind === `atm` && (o10 += `<rect x="${A(m10 + 30)}" y="290" width="${A(h10 - 60)}" height="120" rx="10" fill="#fff9db" stroke="#fcc419" stroke-width="2"/>`, o10 += qo([`Nur zum \xDCben:`, `Deine \xDCbungs-PIN ist ${n10.pin}.`], m10 + h10 / 2, 350, 24, `fill="${Id}"`), o10 += qo(Ko(`Eine echte PIN verr\xE4tst du nie und schreibst sie nicht auf.`, h10 - 60, 100, 22, 14, 3).lines, m10 + h10 / 2, 480, 22, `fill="#475569"`), r10.amount && r10.step === `done` && (o10 += `<text x="${A(m10 + h10 / 2)}" y="${A(a10 - 80)}" text-anchor="middle" font-family="${j}" font-size="30" font-weight="700" fill="#2f9e44">+ ${Ad(r10.amount)}</text>`)), { body: o10, vw: i10, vh: a10 };
}
function nre(e17) {
  let t10 = kd(e17.mc);
  return `${t10.title}. ${t10.kind === `atm` ? `Steck die Karte ein.` : t10.items.map((e18) => `${e18.name}: ${jd(e18.cent)}`).join(`. `)}`;
}
var Rd = Uo({ cls: `lh-ct-machine`, view: tre, label: nre, sounds: true, hit(e17, t10, n10) {
  let r10 = Rd.item(e17);
  if (!r10) return;
  let i10 = kd(r10.mc), a10 = Zne(r10), o10 = (e18) => void M(e18), s10 = i10.items[a10.choice]?.cent ?? 0, c10 = (e18) => {
    yi(), Wo(n10), o10(e18);
  }, l10 = () => {
    let e18 = a10.paid - s10;
    a10.out = [{ kind: i10.kind === `ticket` ? `ticket` : `drink`, label: i10.items[a10.choice].name }, ...e18 > 0 ? [{ kind: `change`, label: `R\xFCckgeld ${Ad(e18)}`, values: Md(e18) }] : []], a10.step = `take`, vi(), o10(`${i10.kind === `ticket` ? `Deine Fahrkarte` : `Dein Getr\xE4nk`}${e18 > 0 ? ` und ${jd(e18)} R\xFCckgeld` : ``}. Bitte nehmen.`);
  };
  if (t10 === `again`) Pd.set(e17, Fd(a10.key));
  else if (t10.startsWith(`c:`) && a10.step === `start`) a10.choice = Number(t10.slice(2)), a10.step = `pay`, _i(), o10(`${i10.items[a10.choice].name}. Zu zahlen: ${jd(i10.items[a10.choice].cent)}.`);
  else if (t10.startsWith(`p:`)) {
    let e18 = Number(t10.slice(2));
    if (a10.step !== `pay`) return c10(a10.step === `start` ? i10.kind === `ticket` ? `W\xE4hle zuerst eine Fahrkarte.` : `W\xE4hle zuerst ein Getr\xE4nk.` : `Jetzt nicht.`);
    a10.paid += e18, _i(), a10.paid >= s10 ? l10() : o10(`Noch ${jd(s10 - a10.paid)}.`);
  } else if (t10 === `card`) {
    if (i10.kind === `atm`) {
      if (a10.step !== `start`) return c10(`Die Karte steckt schon.`);
      a10.step = `pin`, _i(), o10(`Geheimzahl eingeben. Verdecke die Tasten mit der anderen Hand.`);
    } else {
      if (a10.step !== `pay`) return c10(`W\xE4hle zuerst eine Fahrkarte.`);
      a10.step = `wait`, a10.paid = s10, _i(), setTimeout(() => {
        a10.step === `wait` && (l10(), Rd.redraw(e17));
      }, 1400);
    }
  } else if (t10 === `cancel`) a10.step === `pay` && a10.paid ? (a10.out = [{ kind: `change`, label: `Geld zur\xFCck ${Ad(a10.paid)}`, values: Md(a10.paid) }], a10.step = `take`, o10(`Abgebrochen. Nimm dein Geld zur\xFCck.`)) : i10.kind === `atm` && (a10.step === `amount` || a10.step === `pin`) ? (a10.out = [{ kind: `card`, label: `Bankkarte` }], a10.step = `card`, o10(`Abgebrochen. Bitte Karte entnehmen.`)) : Pd.set(e17, Fd(a10.key));
  else if (t10.startsWith(`k:`) && a10.step === `pin`) {
    let e18 = t10.slice(2);
    if (_i(), e18 === `\u232B`) a10.pin = a10.pin.slice(0, -1);
    else if (e18 === `OK`) {
      if (a10.pin.length < 4) return c10(`Die Geheimzahl hat vier Ziffern.`);
      a10.pin === i10.pin ? (a10.step = `amount`, a10.msg = ``, o10(`Richtig. Wie viel Geld m\xF6chtest du?`)) : (a10.tries++, a10.pin = ``, a10.tries >= 3 ? (a10.step = `kept`, yi(), o10(`Dreimal falsch. Die Karte bleibt im Automaten.`)) : (a10.msg = `Falsch. Noch ${3 - a10.tries} ${3 - a10.tries == 1 ? `Versuch` : `Versuche`}.`, c10(a10.msg)));
    } else a10.pin.length < 4 && (a10.pin += e18);
  } else if (t10.startsWith(`m:`) && a10.step === `amount`) a10.amount = Number(t10.slice(2)), a10.out = [{ kind: `card`, label: `Bankkarte` }], a10.step = `card`, _i(), o10(`Bitte zuerst die Karte entnehmen.`);
  else if (t10.startsWith(`o:`)) {
    let e18 = Number(t10.slice(2)), n11 = a10.out[e18];
    if (!n11) return;
    a10.out.splice(e18, 1), _i(), i10.kind === `atm` ? n11.kind === `card` ? (a10.out = [{ kind: `cash`, label: Ad(a10.amount), values: Md(a10.amount) }], a10.step = `cash`, o10(`Bitte das Geld entnehmen.`)) : n11.kind === `cash` ? (a10.step = `receipt`, o10(`M\xF6chtest du einen Beleg?`)) : n11.kind === `receipt` && (a10.step = `done`, vi()) : a10.out.length || (a10.step = `done`, vi(), o10(i10.kind === `ticket` ? `Gute Fahrt!` : `Zum Wohl!`));
  } else t10.startsWith(`rc:`) && a10.step === `receipt` && (t10 === `rc:1` ? (a10.out = [{ kind: `receipt`, label: `Beleg ${Ad(a10.amount)}` }], o10(`Bitte den Beleg nehmen.`)) : (a10.step = `done`, vi(), o10(`Fertig. Steck das Geld gut ein.`)));
  Rd.redraw(e17);
} });
var rre = Rd.draw;
var zd = `#1f2937`;
var Bd = `#2f9e44`;
var Vd = `#e03131`;
var Hd = `#2b6cb0`;
var Ud = (e17 = `month`) => ({ title: e17 === `cash` ? `Kassenbuch Sch\xFClercaf\xE9` : `Mein Geld im Monat`, mode: e17, income: [{ text: `Lohn aus der Werkstatt`, cent: 32e3 }, { text: `Grundsicherung`, cent: 56300 }], spend: [{ text: `Miete`, cent: 38e3 }, { text: `Strom`, cent: 4500 }, { text: `Handy`, cent: 1500 }, { text: `Essen und Trinken`, cent: 25e3 }], wishes: [{ text: `Kino`, cent: 1200 }, { text: `Konzert`, cent: 4500 }, { text: `Neue Schuhe`, cent: 6e3 }, { text: `Ausflug`, cent: 2500 }], book: [{ date: `3.11.`, text: `Verkauf Pausenbrote`, cent: 4250 }, { date: `4.11.`, text: `Einkauf Brot und K\xE4se`, cent: 1890, out: true }, { date: `5.11.`, text: `Verkauf Kaffee`, cent: 1800 }, { date: `6.11.`, text: `Einkauf Becher`, cent: 650, out: true }], start: 5e3, fill: false });
function Wd(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (e18) => (Array.isArray(e18) ? e18 : []).slice(0, 10).flatMap((e19) => {
    let n11 = e19 && typeof e19 == `object` ? e19 : {}, r11 = typeof n11.text == `string` ? n11.text.slice(0, 50) : ``, i10 = typeof n11.cent == `number` && Number.isFinite(n11.cent) ? Math.max(0, Math.min(1e7, Math.round(n11.cent))) : 0, a10 = t10(n11.img), o10 = typeof n11.date == `string` && n11.date.trim() ? n11.date.slice(0, 12) : void 0;
    return r11 ? [{ text: r11, cent: i10, ...a10 ? { img: a10 } : {}, ...o10 ? { date: o10 } : {}, ...n11.out === true ? { out: true } : {} }] : [];
  });
  return { title: typeof n10.title == `string` ? n10.title.slice(0, 80) : ``, mode: n10.mode === `cash` ? `cash` : `month`, income: r10(n10.income), spend: r10(n10.spend), wishes: r10(n10.wishes), book: r10(n10.book), start: typeof n10.start == `number` && Number.isFinite(n10.start) ? Math.max(0, Math.min(1e7, Math.round(n10.start))) : 0, fill: n10.fill === true };
}
var are = (e17) => typeof e17 == `string` ? e17 : void 0;
var Kd = (e17) => {
  let t10 = e17 < 0, n10 = Math.abs(e17);
  return `${t10 ? `\u2212` : ``}${String(Math.floor(n10 / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, `.`)},${String(n10 % 100).padStart(2, `0`)} \u20AC`;
};
var qd = (e17) => {
  let t10 = Math.abs(e17), n10 = Math.floor(t10 / 100), r10 = t10 % 100;
  return `${e17 < 0 ? `minus ` : ``}${n10 ? `${n10} Euro${r10 ? ` ${r10}` : ``}` : `${r10} Cent`}`;
};
function Jd(e17) {
  let t10 = e17.replace(/€|euro|eur/gi, ``).replace(/\s+/g, ``).replace(/,-+$/, ``);
  if (!t10 || (t10.includes(`,`) ? t10 = t10.replace(/\./g, ``).replace(`,`, `.`) : /^\d{1,3}(\.\d{3})+$/.test(t10) && (t10 = t10.replace(/\./g, ``)), !/^\d+(\.\d{1,2})?$/.test(t10))) return null;
  let n10 = Math.round(parseFloat(t10) * 100);
  return n10 <= 1e7 ? n10 : null;
}
var Yd = (e17) => `${Math.floor(e17 / 100)},${String(e17 % 100).padStart(2, `0`)}`;
var Xd = null;
function ore(e17) {
  Xd = e17;
}
var Zd = /* @__PURE__ */ new Map();
function Qd(e17) {
  let t10 = Wd(e17.bud, are), n10 = JSON.stringify(t10), r10 = Zd.get(e17.id);
  return r10 && r10.saved === n10 || Zd.set(e17.id, r10 = { saved: n10, b: t10 }), r10.b;
}
var $d = /* @__PURE__ */ new Map();
var ef = (e17) => {
  let t10 = $d.get(e17);
  return t10 || $d.set(e17, t10 = /* @__PURE__ */ new Set()), t10;
};
var tf = { i: `income`, o: `spend`, w: `wishes` };
var cre = { i: { one: `Einnahme`, add: `Neue Einnahme`, edit: `Einnahme \xE4ndern`, ex: `z. B. Lohn`, color: Bd }, o: { one: `Ausgabe`, add: `Neue Ausgabe`, edit: `Ausgabe \xE4ndern`, ex: `z. B. Miete`, color: Vd }, w: { one: `Wunsch`, add: `Neuer Wunsch`, edit: `Wunsch \xE4ndern`, ex: `z. B. Kino`, color: `#f59f00` } };
function lre(e17, t10, n10, r10) {
  return `<g class="lh-key" data-a="${n10}"><title>\xC4ndern</title><circle cx="${A(e17)}" cy="${A(t10)}" r="19" fill="#ffffff" stroke="${r10}" stroke-width="2.5"/><path d="M${A(e17 - 8)} ${A(t10 + 8)}l2.5-7.5 10-10 5 5-10 10z" fill="${r10}"/><path d="M${A(e17 - 8)} ${A(t10 + 8)}l7.5-2.5" stroke="${r10}" stroke-width="2"/></g>`;
}
function ure(e17, t10, n10, r10, i10, a10, o10) {
  return `<g class="lh-key" data-a="${i10}"><title>${Bo(a10)}</title><rect x="${A(e17)}" y="${A(t10)}" width="${A(n10)}" height="${A(r10)}" rx="10" fill="#ffffff" fill-opacity="0.7" stroke="${o10}" stroke-width="2.5" stroke-dasharray="9 7"/><circle cx="${A(e17 + 30)}" cy="${A(t10 + r10 / 2)}" r="15" fill="${o10}"/><path d="M${A(e17 + 30)} ${A(t10 + r10 / 2 - 8)}v16M${A(e17 + 22)} ${A(t10 + r10 / 2)}h16" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/><text x="${A(e17 + 56)}" y="${A(t10 + r10 / 2 + 8)}" font-family="${j}" font-size="22" font-weight="700" fill="${o10}">${Bo(a10)}</text></g>`;
}
function nf(e17, t10, n10, r10, i10, a10, o10, s10, c10, l10, u10, d10, f10) {
  let p10 = `<rect x="${A(r10)}" y="${A(i10)}" width="${A(a10)}" height="${A(o10)}" rx="14" fill="${t10}" fill-opacity="0.06" stroke="${t10}" stroke-width="3"/>`;
  p10 += `<text x="${A(r10 + 18)}" y="${A(i10 + 36)}" font-family="${j}" font-size="26" font-weight="700" fill="${t10}">${Bo(e17)}</text>`;
  let m10 = !!f10 && s10 && n10.length < 10, h10 = f10 && !s10 ? Math.max(0, 5 - n10.length) : 0, g10 = n10.length + +!!m10 + h10, _10 = Math.min(70, (o10 - 110) / Math.max(1, g10)), v10 = f10 && s10 ? r10 + a10 - 58 : r10 + a10 - 20;
  n10.forEach((e18, n11) => {
    let o11 = i10 + 52 + n11 * _10, m11 = d10?.has(n11);
    p10 += `<g${Vo(s10, c10(n11))}><rect x="${A(r10 + 8)}" y="${A(o11)}" width="${A(a10 - 16)}" height="${A(_10 - 6)}" rx="10" fill="${m11 ? `#fff3bf` : `#ffffff`}" stroke="${m11 ? `#f59f00` : `#e2e8f0`}" stroke-width="2"/>`;
    let h11 = r10 + 18;
    d10 && (p10 += `<rect x="${A(h11)}" y="${A(o11 + _10 / 2 - 15)}" width="26" height="26" rx="5" fill="${m11 ? `#f59f00` : `#ffffff`}" stroke="${m11 ? `#f59f00` : `#94a3b8`}" stroke-width="3"/>`, m11 && (p10 += `<path d="M${A(h11 + 5)} ${A(o11 + _10 / 2 - 2)}l6 6 11-12" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`), h11 += 36), e18.img && (u10.push({ src: l10(e18.img) ?? ``, x: h11, y: o11 + 4, w: _10 - 14, h: _10 - 14 }), h11 += _10 - 8), p10 += qo(Ko(e18.text, v10 - 130 - h11, _10 - 10, 24, 12, 2).lines, h11, o11 + (_10 - 6) / 2, 22, `fill="${zd}"`, `start`), p10 += `<text x="${A(v10)}" y="${A(o11 + (_10 - 6) / 2 + 8)}" text-anchor="end" font-family="${j}" font-size="22" font-weight="700" fill="${zd}">${Kd(e18.cent)}</text></g>`, f10 && s10 && (p10 += lre(r10 + a10 - 34, o11 + (_10 - 6) / 2, `ed:${f10}:${n11}`, t10));
  }), m10 && (p10 += ure(r10 + 8, i10 + 52 + n10.length * _10, a10 - 16, Math.min(56, _10 - 6), `add:${f10}`, cre[f10].one, t10));
  for (let e18 = 0; e18 < h10; e18++) {
    let t11 = i10 + 52 + (n10.length + e18) * _10;
    p10 += `<rect x="${A(r10 + 8)}" y="${A(t11)}" width="${A(a10 - 16)}" height="${A(_10 - 6)}" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/><path d="M${A(r10 + a10 - 150)} ${A(t11 + _10 - 18)}h112" stroke="#cbd5e1" stroke-width="2"/><text x="${A(r10 + a10 - 24)}" y="${A(t11 + _10 - 20)}" text-anchor="end" font-family="${j}" font-size="22" fill="#94a3b8">\u20AC</text>`;
  }
  let y10 = n10.reduce((e18, t11) => e18 + t11.cent, 0);
  return d10 || (p10 += `<text x="${A(r10 + a10 - 20)}" y="${A(i10 + o10 - 20)}" text-anchor="end" font-family="${j}" font-size="26" font-weight="700" fill="${t10}">zusammen ${Kd(y10)}</text>`), p10;
}
function dre(e17, t10, n10) {
  let r10 = t10 ? Qd(e17) : Wd(e17.bud, are), i10 = r10.fill && t10, a10 = Math.max(800, e17.w), o10 = Math.max(450, e17.h), s10 = [], c10 = `<rect x="0" y="0" width="${a10}" height="${o10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`;
  if (r10.title && (c10 += qo(Ko(r10.title, a10 - 60, 56, 40, 20, 1).lines, 30, 50, 36, `font-weight="700" fill="${zd}"`, `start`)), r10.mode === `month`) {
    let i11 = t10 ? ef(e17.id) : /* @__PURE__ */ new Set(), l10 = o10 - 80 - 120, u10 = (a10 - 40 - 32) / 3, d10 = (e18) => r10.fill ? e18 : void 0;
    c10 += nf(`Einnahmen`, Bd, r10.income, 20, 80, u10, l10, t10, (e18) => `i:${e18}`, n10, s10, void 0, d10(`i`)), c10 += nf(`Feste Ausgaben`, Vd, r10.spend, 20 + u10 + 16, 80, u10, l10, t10, (e18) => `o:${e18}`, n10, s10, void 0, d10(`o`)), c10 += nf(`W\xFCnsche`, `#f59f00`, r10.wishes, 20 + 2 * (u10 + 16), 80, u10, l10, t10, (e18) => `w:${e18}`, n10, s10, i11, d10(`w`));
    let f10 = r10.income.reduce((e18, t11) => e18 + t11.cent, 0), p10 = r10.spend.reduce((e18, t11) => e18 + t11.cent, 0), m10 = r10.wishes.reduce((e18, t11, n11) => e18 + (i11.has(n11) ? t11.cent : 0), 0), h10 = f10 - p10 - m10, g10 = o10 - 104;
    c10 += `<g${Vo(t10, `rest`)}><rect x="20" y="${g10}" width="${a10 - 40}" height="84" rx="16" fill="${h10 >= 0 ? `#ebfbee` : `#fff5f5`}" stroke="${h10 >= 0 ? Bd : Vd}" stroke-width="4"/>`, c10 += `<text x="44" y="${g10 + 54}" font-family="${j}" font-size="26" fill="${zd}">${Bo(`${Kd(f10)} \u2212 ${Kd(p10)}${m10 ? ` \u2212 ${Kd(m10)}` : ``} =`)}</text>`, c10 += `<text x="${a10 - 44}" y="${g10 + 56}" text-anchor="end" font-family="${j}" font-size="36" font-weight="700" fill="${h10 >= 0 ? Bd : Vd}">${h10 >= 0 ? `\xDCbrig` : `Es fehlen`}: ${Kd(Math.abs(h10))}</text></g>`;
  } else {
    let e18 = a10 - 40 - (i10 ? 54 : 0), n11 = [0.14, 0.4, 0.15, 0.15, 0.16].map((t11) => t11 * e18), s11 = n11.map((e19, t11) => 20 + n11.slice(0, t11).reduce((e20, t12) => e20 + t12, 0)), l10 = [`Datum`, `Was?`, `Einnahme`, `Ausgabe`, `Kassenstand`], u10 = i10 && r10.book.length < 10, d10 = r10.fill && !t10 ? Math.max(0, 6 - r10.book.length) : 0, f10 = r10.book.length + 1 + +!!u10 + d10, p10 = Math.min(64, (o10 - 84 - 70) / (f10 + 1));
    c10 += `<rect x="20" y="84" width="${A(e18)}" height="${A(p10)}" rx="10" fill="#e7f5ff"/>`, l10.forEach((e19, t11) => c10 += `<text x="${A(t11 < 2 ? s11[t11] + 12 : s11[t11] + n11[t11] - 12)}" y="${A(84 + p10 / 2 + 9)}"${t11 < 2 ? `` : ` text-anchor="end"`} font-family="${j}" font-size="24" font-weight="700" fill="${zd}">${e19}</text>`);
    let m10 = r10.start, h10 = [[``, `Anfangsbestand`, ``, ``, Kd(m10), `start`]];
    r10.book.forEach((e19, t11) => {
      m10 += e19.out ? -e19.cent : e19.cent, h10.push([e19.date ?? ``, e19.text, e19.out ? `` : Kd(e19.cent), e19.out ? Kd(e19.cent) : ``, Kd(m10), String(t11)]);
    }), h10.forEach((r11, a11) => {
      let o11 = 84 + (a11 + 1) * p10;
      c10 += `<g${Vo(t10, `b:${r11[5]}`)}><rect x="20" y="${A(o11)}" width="${A(e18)}" height="${A(p10)}" fill="${a11 % 2 ? `#f8fafc` : `#ffffff`}" stroke="#e2e8f0" stroke-width="1.5"/>`, r11.slice(0, 5).forEach((e19, t11) => {
        if (!e19) return;
        let r12 = t11 === 2 ? Bd : t11 === 3 ? Vd : t11 === 4 ? Hd : zd;
        c10 += t11 === 1 ? qo(Ko(e19, n11[1] - 20, p10 - 6, 24, 12, 1).lines, s11[1] + 12, o11 + p10 / 2, 22, `fill="${zd}"`, `start`) : `<text x="${A(t11 < 2 ? s11[t11] + 12 : s11[t11] + n11[t11] - 12)}" y="${A(o11 + p10 / 2 + 8)}"${t11 < 2 ? `` : ` text-anchor="end"`} font-family="${j}" font-size="22"${t11 === 4 ? ` font-weight="700"` : ``} fill="${r12}">${Bo(e19)}</text>`;
      }), c10 += `</g>`, i10 && (c10 += lre(20 + e18 + 30, o11 + p10 / 2, r11[5] === `start` ? `ed:start` : `ed:b:${r11[5]}`, Hd));
    }), u10 && (c10 += ure(20, 84 + (h10.length + 1) * p10 + 4, Math.min(e18, 420), Math.min(56, p10), `add:b`, `Buchung`, Hd));
    for (let t11 = 0; t11 < d10; t11++) {
      let r11 = 84 + (h10.length + 1 + t11) * p10;
      c10 += `<rect x="20" y="${A(r11)}" width="${A(e18)}" height="${A(p10)}" fill="${(h10.length + t11) % 2 ? `#f8fafc` : `#ffffff`}" stroke="#e2e8f0" stroke-width="1.5"/>`;
      for (let e19 = 1; e19 < n11.length; e19++) c10 += `<path d="M${A(s11[e19])} ${A(r11)}v${A(p10)}" stroke="#e2e8f0" stroke-width="1.5"/>`;
    }
    let g10 = 84 + (h10.length + 1 + +!!u10 + d10) * p10 + 10;
    c10 += `<text x="${A(20 + e18 - 12)}" y="${A(Math.min(o10 - 24, g10 + 34))}" text-anchor="end" font-family="${j}" font-size="30" font-weight="700" fill="${m10 >= 0 ? Bd : Vd}">Kassenstand jetzt: ${Kd(m10)}</text>`;
  }
  return { body: c10, vw: a10, vh: o10, pics: s10.filter((e18) => e18.src) };
}
function rf(e17, t10) {
  return e17.income.reduce((e18, t11) => e18 + t11.cent, 0) - e17.spend.reduce((e18, t11) => e18 + t11.cent, 0) - e17.wishes.reduce((e18, n10, r10) => e18 + (t10.has(r10) ? n10.cent : 0), 0);
}
function af(e17) {
  let t10 = Qd(e17);
  if (t10.mode === `cash`) return `${t10.title}. Kassenstand: ${qd(fre(t10))}.`;
  let n10 = rf(t10, ef(e17.id));
  return `${t10.title}. ${n10 >= 0 ? `\xDCbrig: ${qd(n10)}` : `Es fehlen ${qd(-n10)}`}.`;
}
var fre = (e17) => e17.book.reduce((e18, t10) => e18 + (t10.out ? -t10.cent : t10.cent), e17.start);
var of = (e17, t10) => {
  if (e17.mode === `cash`) return `Kassenstand: ${qd(fre(e17))}.`;
  let n10 = rf(e17, ef(t10));
  return n10 >= 0 ? `\xDCbrig: ${qd(n10)}.` : `Es fehlen ${qd(-n10)}.`;
};
function sf(e17, t10, n10) {
  let r10 = Zd.get(e17);
  r10 && (r10.b = t10), Xd && Xd.save(e17, t10, n10), df.redraw(e17);
}
function pre(e17, t10) {
  let n10 = ef(e17);
  $d.set(e17, new Set([...n10].filter((e18) => e18 !== t10).map((e18) => e18 > t10 ? e18 - 1 : e18)));
}
var mre = () => {
  let e17 = /* @__PURE__ */ new Date();
  return `${e17.getDate()}.${e17.getMonth() + 1}.`;
};
function cf(e17, t10, n10, r10 = {}) {
  let i10 = Il(`label`, ``, t10), a10 = Il(`input`);
  return a10.type = `text`, a10.value = n10, a10.maxLength = r10.max ?? 50, r10.placeholder && (a10.placeholder = r10.placeholder), r10.money && (a10.inputMode = `decimal`, a10.autocomplete = `off`), i10.append(a10), e17.append(i10), a10.addEventListener(`input`, () => a10.classList.remove(`is-bad`)), a10;
}
function lf(e17, t10, n10, r10) {
  let i10 = Il(`div`, `lh-kp-row`);
  if (t10) {
    let e18 = Il(`button`, `is-danger`, `L\xF6schen`);
    e18.type = `button`, e18.onclick = t10, i10.append(e18);
  }
  let a10 = Il(`button`, ``, `Abbrechen`), o10 = Il(`button`, `is-main`, `Fertig`);
  a10.type = o10.type = `button`, a10.onclick = n10, o10.onclick = r10, i10.append(a10, o10), e17.append(i10);
}
function hre(e17, t10, n10) {
  let r10 = df.item(e17);
  if (!r10) return;
  let i10 = Qd(r10), a10 = i10[tf[t10]], o10 = n10 >= 0 ? a10[n10] : void 0;
  if (n10 >= 0 && !o10) return;
  let s10 = cre[t10], { back: c10, box: l10, close: u10 } = Fl(s10.color, o10 ? s10.edit : s10.add);
  l10.append(Il(`h2`, ``, o10 ? s10.edit : s10.add));
  let d10 = cf(l10, `Was?`, o10?.text ?? ``, { placeholder: s10.ex }), f10 = cf(l10, `Wie viel Euro?`, o10 ? Yd(o10.cent) : ``, { placeholder: `0,00`, money: true, max: 14 }), p10 = o10?.img, m10 = null;
  if (Xd?.picture) {
    let t11 = Xd.picture, n11 = Il(`div`, `lh-kp-row`);
    n11.style.justifyContent = `flex-start`, n11.style.alignItems = `center`;
    let r11 = Il(`img`);
    r11.alt = ``, r11.style.cssText = `width:64px;height:64px;object-fit:contain;border:2px solid #e2e8f0;border-radius:12px;background:#fff`;
    let i11 = Il(`button`, ``, `Bild w\xE4hlen`), a11 = Il(`button`, ``, `Ohne Bild`);
    i11.type = a11.type = `button`;
    let o11 = () => {
      let t12 = m10?.dataUrl ?? (p10 ? df.src(e17)(p10) : void 0);
      r11.hidden = !t12, t12 && (r11.src = t12), i11.textContent = t12 ? `Anderes Bild` : `Bild w\xE4hlen (wenn du willst)`, a11.hidden = !t12;
    };
    i11.onclick = async () => {
      c10.style.display = `none`;
      let e18 = await t11(d10.value.trim()).catch(() => null);
      c10.style.display = ``, e18 && (m10 = e18, p10 = e18.id), o11();
    }, a11.onclick = () => {
      m10 = null, p10 = void 0, o11();
    }, n11.append(r11, i11, a11), l10.append(n11), o11();
  }
  let h10 = () => {
    let r11 = d10.value.replace(/\s+/g, ` `).trim(), s11 = Jd(f10.value);
    if (!r11) {
      d10.classList.add(`is-bad`), d10.focus();
      return;
    }
    if (s11 === null) {
      f10.classList.add(`is-bad`), f10.focus();
      return;
    }
    let c11 = { text: r11, cent: s11, ...p10 ? { img: p10 } : {} }, l11 = o10 ? a10.map((e18, t11) => t11 === n10 ? c11 : e18) : [...a10, c11], h11 = { ...i10, [tf[t10]]: l11 };
    u10(), sf(e17, h11, m10 && p10 === m10.id ? [m10] : []), _i(), M(`${r11}: ${qd(s11)}. ${of(h11, e17)}`);
  };
  lf(l10, o10 ? () => {
    u10(), t10 === `w` && pre(e17, n10);
    let r11 = { ...i10, [tf[t10]]: a10.filter((e18, t11) => t11 !== n10) };
    sf(e17, r11, []), M(`${o10.text} ist weg. ${of(r11, e17)}`);
  } : null, u10, h10), d10.addEventListener(`keydown`, (e18) => {
    e18.key === `Enter` && (e18.preventDefault(), f10.focus());
  }), f10.addEventListener(`keydown`, (e18) => {
    e18.key === `Enter` && (e18.preventDefault(), h10());
  }), d10.focus();
}
function uf(e17, t10) {
  let n10 = df.item(e17);
  if (!n10) return;
  let r10 = Qd(n10);
  if (t10 === `start`) {
    let { box: t11, close: n11 } = Fl(Hd, `Anfangsbestand`);
    t11.append(Il(`h2`, ``, `Anfangsbestand`)), t11.append(Il(`small`, ``, `So viel Geld ist am Anfang in der Kasse.`));
    let i11 = cf(t11, `Wie viel Euro?`, Yd(r10.start), { placeholder: `0,00`, money: true, max: 14 }), a11 = () => {
      let t12 = Jd(i11.value);
      if (t12 === null) {
        i11.classList.add(`is-bad`), i11.focus();
        return;
      }
      n11();
      let a12 = { ...r10, start: t12 };
      sf(e17, a12, []), M(`Anfangsbestand: ${qd(t12)}. ${of(a12, e17)}`);
    };
    lf(t11, null, n11, a11), i11.addEventListener(`keydown`, (e18) => {
      e18.key === `Enter` && (e18.preventDefault(), a11());
    }), i11.focus(), i11.select();
    return;
  }
  let i10 = t10 >= 0 ? r10.book[t10] : void 0;
  if (t10 >= 0 && !i10) return;
  let a10 = i10 ? `Buchung \xE4ndern` : `Neue Buchung`, { box: o10, close: s10 } = Fl(Hd, a10);
  o10.append(Il(`h2`, ``, a10));
  let c10 = !!i10?.out, l10 = Il(`div`, `lh-kp-row`);
  l10.style.justifyContent = `flex-start`;
  let u10 = Il(`button`, ``, `+ Einnahme`), d10 = Il(`button`, ``, `\u2212 Ausgabe`);
  u10.type = d10.type = `button`;
  let f10 = () => {
    u10.classList.toggle(`is-on`, !c10), d10.classList.toggle(`is-on`, c10), u10.setAttribute(`aria-pressed`, String(!c10)), d10.setAttribute(`aria-pressed`, String(c10));
  };
  u10.onclick = () => (c10 = false, f10()), d10.onclick = () => (c10 = true, f10()), l10.append(u10, d10), o10.append(l10), f10();
  let p10 = cf(o10, `Datum`, i10?.date ?? mre(), { placeholder: `3.11.`, max: 12 }), m10 = cf(o10, `Was?`, i10?.text ?? ``, { placeholder: `z. B. Verkauf Pausenbrote` }), h10 = cf(o10, `Wie viel Euro?`, i10 ? Yd(i10.cent) : ``, { placeholder: `0,00`, money: true, max: 14 }), g10 = () => {
    let n11 = m10.value.replace(/\s+/g, ` `).trim(), a11 = Jd(h10.value);
    if (!n11) {
      m10.classList.add(`is-bad`), m10.focus();
      return;
    }
    if (a11 === null) {
      h10.classList.add(`is-bad`), h10.focus();
      return;
    }
    let o11 = p10.value.trim(), l11 = { text: n11, cent: a11, ...o11 ? { date: o11.slice(0, 12) } : {}, ...c10 ? { out: true } : {} }, u11 = { ...r10, book: i10 ? r10.book.map((e18, n12) => n12 === t10 ? l11 : e18) : [...r10.book, l11] };
    s10(), sf(e17, u11, []), _i(), M(`${n11}: ${c10 ? `Ausgabe` : `Einnahme`} ${qd(a11)}. ${of(u11, e17)}`);
  };
  lf(o10, i10 ? () => {
    s10();
    let n11 = { ...r10, book: r10.book.filter((e18, n12) => n12 !== t10) };
    sf(e17, n11, []), M(`${i10.text} ist weg. ${of(n11, e17)}`);
  } : null, s10, g10);
  for (let [e18, t11] of [[p10, m10], [m10, h10]]) e18.addEventListener(`keydown`, (e19) => {
    e19.key === `Enter` && (e19.preventDefault(), t11.focus());
  });
  h10.addEventListener(`keydown`, (e18) => {
    e18.key === `Enter` && (e18.preventDefault(), g10());
  }), m10.focus();
}
var df = Uo({ cls: `lh-ct-budget`, view: dre, label: af, hit(e17, t10) {
  let n10 = df.item(e17);
  if (!n10) return;
  let r10 = Qd(n10), i10 = ef(e17), [a10, o10, s10] = t10.split(`:`), c10 = Number(o10);
  if (a10 === `add`) return { release: () => o10 === `b` ? uf(e17, -1) : hre(e17, o10, -1) };
  if (a10 === `ed`) return { release: () => o10 === `start` ? uf(e17, `start`) : o10 === `b` ? uf(e17, Number(s10)) : hre(e17, o10, Number(s10)) };
  if (a10 === `w`) {
    i10.has(c10) ? i10.delete(c10) : i10.add(c10), _i();
    let t11 = rf(r10, i10);
    M(`${r10.wishes[c10]?.text}: ${qd(r10.wishes[c10]?.cent ?? 0)}. ${t11 >= 0 ? `\xDCbrig: ${qd(t11)}` : `Es fehlen ${qd(-t11)}`}.`), df.redraw(e17);
  } else if (a10 === `i` || a10 === `o`) {
    let e18 = (a10 === `i` ? r10.income : r10.spend)[c10];
    e18 && M(`${e18.text}: ${qd(e18.cent)}.`);
  } else if (a10 === `rest`) M(af(n10));
  else if (a10 === `b`) {
    if (o10 === `start`) M(`Anfangsbestand: ${qd(r10.start)}.`);
    else {
      let e18 = r10.book[c10];
      e18 && M(`${e18.date ? `${e18.date} ` : ``}${e18.text}: ${e18.out ? `Ausgabe` : `Einnahme`} ${qd(e18.cent)}.`);
    }
  }
} });
var gre = df.draw;
var _re = `#1f2937`;
var vre = `#2b6cb0`;
var ff = `#7048e8`;
function pf(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (Array.isArray(n10.stations) ? n10.stations : []).slice(0, 10).flatMap((e18) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, r11 = typeof n11.text == `string` ? n11.text.slice(0, 80) : ``, i11 = t10(n11.img);
    return r11 || i11 ? [{ when: typeof n11.when == `string` ? n11.when.slice(0, 16) : ``, text: r11, ...i11 ? { img: i11 } : {} }] : [];
  }), i10 = typeof n10.now == `number` && n10.now >= 0 && n10.now < r10.length ? Math.round(n10.now) : -1;
  return { title: typeof n10.title == `string` ? n10.title.slice(0, 80) : ``, stations: r10, now: i10 };
}
var hf = (e17) => typeof e17 == `string` ? e17 : void 0;
function bre(e17, t10, n10) {
  let r10 = pf(e17.tl, hf), i10 = Math.max(800, e17.w), a10 = Math.max(400, e17.h), o10 = [], s10 = `<rect x="0" y="0" width="${i10}" height="${a10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`;
  r10.title && (s10 += qo(Ko(r10.title, i10 - 60, 56, 40, 20, 1).lines, 30, 50, 36, `font-weight="700" fill="${_re}"`, `start`));
  let c10 = r10.stations.length;
  if (!c10) return { body: s10 + qo([`Noch keine Stationen \u2013 tippe auf \u201EEinstellen\u201C.`], i10 / 2, a10 / 2, 28, `fill="#868e96"`), vw: i10, vh: a10 };
  let l10 = 80 + (a10 - 80) / 2, u10 = i10 - 60, d10 = c10 > 1 ? (u10 - 60) / (c10 - 1) : 0, f10 = r10.stations.map((e18, t11) => c10 > 1 ? 60 + t11 * d10 : i10 / 2), p10 = r10.now >= 0 ? f10[r10.now] : u10;
  s10 += `<path d="M30 ${A(l10)}H${A(p10)}" stroke="${vre}" stroke-width="8" stroke-linecap="round"/>`, p10 < u10 && (s10 += `<path d="M${A(p10)} ${A(l10)}H${u10 + 20}" stroke="${ff}" stroke-width="6" stroke-dasharray="14 12" stroke-linecap="round"/><path d="M${u10 + 14} ${A(l10 - 14)}l18 14-18 14" fill="none" stroke="${ff}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`);
  let m10 = Math.min(260, Math.max(140, d10 * 1.7 || 300)), h10 = Math.min((a10 - 80) / 2 - 50, 300);
  return r10.stations.forEach((e18, a11) => {
    let c11 = f10[a11], u11 = a11 % 2 == 0, d11 = r10.now >= 0 && a11 > r10.now, p11 = a11 === r10.now, g10 = d11 ? ff : vre, _10 = u11 ? l10 - 40 - h10 : l10 + 40, v10 = Math.max(16, Math.min(i10 - 16 - m10, c11 - m10 / 2));
    s10 += `<g${Vo(t10, `s:${a11}`)}>`, s10 += `<path d="M${A(c11)} ${A(l10)}V${A(u11 ? _10 + h10 : _10)}" stroke="${g10}" stroke-width="3"${d11 ? ` stroke-dasharray="6 6"` : ``}/>`, s10 += `<circle cx="${A(c11)}" cy="${A(l10)}" r="${p11 ? 18 : 11}" fill="${p11 ? `#f08c00` : g10}" stroke="#ffffff" stroke-width="4"/>`, s10 += `<rect x="${A(v10)}" y="${A(_10)}" width="${A(m10)}" height="${A(h10)}" rx="14" fill="${d11 ? `#f3f0ff` : `#ffffff`}" stroke="${p11 ? `#f08c00` : g10}" stroke-width="${p11 ? 6 : 3}"${d11 ? ` stroke-dasharray="10 8"` : ``}/>`, s10 += `<text x="${A(v10 + m10 / 2)}" y="${A(_10 + 32)}" text-anchor="middle" font-family="${j}" font-size="26" font-weight="700" fill="${g10}">${Bo(e18.when)}</text>`;
    let y10 = Math.min(70, h10 * 0.32);
    e18.img && o10.push({ src: n10(e18.img) ?? ``, x: v10 + 10, y: _10 + 44, w: m10 - 20, h: Math.max(10, h10 - 44 - y10 - 8) }), s10 += qo(Ko(e18.text, m10 - 20, e18.img ? y10 : h10 - 56, 24, 13, e18.img ? 2 : 4).lines, v10 + m10 / 2, e18.img ? _10 + h10 - y10 / 2 - 4 : _10 + 44 + (h10 - 44) / 2, 22, `fill="${_re}"`), p11 && (s10 += `<rect x="${A(c11 - 46)}" y="${A(u11 ? l10 + 22 : l10 - 56)}" width="92" height="34" rx="17" fill="#f08c00"/><text x="${A(c11)}" y="${A(u11 ? l10 + 46 : l10 - 32)}" text-anchor="middle" font-family="${j}" font-size="22" font-weight="700" fill="#ffffff">heute</text>`), s10 += `</g>`;
  }), { body: s10, vw: i10, vh: a10, pics: o10.filter((e18) => e18.src) };
}
var xre = (e17, t10) => {
  let n10 = e17.stations[t10];
  return `${e17.now >= 0 && t10 > e17.now ? `Mein Wunsch: ` : t10 === e17.now ? `Heute: ` : ``}${n10.when ? `${n10.when}: ` : ``}${n10.text}`;
};
function Sre(e17) {
  let t10 = pf(e17.tl, hf);
  return `${t10.title}. ${t10.stations.map((e18, n10) => xre(t10, n10)).join(`. `)}`;
}
var Cre = Uo({ cls: `lh-ct-timeline`, view: bre, label: Sre, hit(e17, t10) {
  let n10 = Cre.item(e17);
  if (!n10 || !t10.startsWith(`s:`)) return;
  let r10 = pf(n10.tl, hf), i10 = Number(t10.slice(2));
  r10.stations[i10] && M(xre(r10, i10));
} });
var wre = Cre.draw;
var gf = `#1f2937`;
var Tre = `#2b6cb0`;
var Ere = [`#2b6cb0`, `#e8590c`, `#2f9e44`, `#7048e8`, `#d6336c`, `#0c8599`, `#f59f00`, `#495057`];
function _f(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (Array.isArray(n10.options) ? n10.options : []).slice(0, 8).flatMap((e18) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, r11 = typeof n11.text == `string` ? n11.text.slice(0, 50) : ``, i11 = t10(n11.img);
    return r11 || i11 ? [{ text: r11, ...i11 ? { img: i11 } : {} }] : [];
  }), i10 = r10.map((e18, t11) => Array.isArray(n10.counts) && typeof n10.counts[t11] == `number` && Number.isFinite(n10.counts[t11]) ? Math.max(0, Math.min(999, Math.round(n10.counts[t11]))) : 0);
  return { title: typeof n10.title == `string` ? n10.title.slice(0, 80) : ``, secret: n10.secret === true, options: r10, counts: i10 };
}
var yf = (e17) => typeof e17 == `string` ? e17 : void 0;
var bf = /* @__PURE__ */ new Map();
var Ore = null;
function kre(e17) {
  Ore = e17;
}
function Are(e17) {
  let t10 = _f(e17.vote, yf), n10 = JSON.stringify([t10.options.map((e18) => e18.text), t10.counts, t10.secret]), r10 = bf.get(e17.id);
  return r10 && r10.saved === n10 || bf.set(e17.id, r10 = { saved: n10, counts: [...t10.counts], phase: r10 && r10.saved.endsWith(`${t10.secret}]`) ? r10.phase : t10.secret ? `wait` : `result`, ask: 0 }), r10;
}
var xf = (e17, t10, n10, r10, i10, a10, o10, s10, c10 = `#ffffff`) => `<g${Vo(e17, t10)}><rect x="${A(n10)}" y="${A(r10)}" width="${A(i10)}" height="${A(a10)}" rx="${A(a10 / 2)}" fill="${s10}"${s10 === `#ffffff` ? ` stroke="#94a3b8" stroke-width="3"` : ``}/>${qo(Ko(o10, i10 - 24, a10 - 8, 30, 14, 1).lines, n10 + i10 / 2, r10 + a10 / 2, 28, `font-weight="700" fill="${c10}"`)}</g>`;
function Sf(e17, t10, n10, r10, i10, a10, o10, s10, c10, l10) {
  let u10 = ``, d10 = e17.options.length, f10 = t10.reduce((e18, t11) => e18 + t11, 0), p10 = Math.max(0, ...t10), m10 = t10.filter((e18) => e18 === p10).length, h10 = Math.min(110, (s10 - o10) / Math.max(1, d10));
  return e17.options.forEach((e18, s11) => {
    let d11 = o10 + s11 * h10, g10 = h10 - 10, _10 = Ere[s11 % Ere.length], v10 = 40;
    u10 += `<g${r10 ? Vo(i10, `v:${s11}`) : ``}><rect x="20" y="${A(d11)}" width="${a10 - 40}" height="${A(g10)}" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>`, e18.img && (l10.push({ src: c10(e18.img) ?? ``, x: 28, y: d11 + 6, w: g10 - 12, h: g10 - 12 }), v10 = 28 + g10);
    let y10 = n10 ? a10 * 0.3 : a10 - v10 - 60;
    if (u10 += qo(Ko(e18.text, y10, g10 - 10, 30, 14, 2).lines, v10, d11 + g10 / 2, 28, `font-weight="700" fill="${gf}"`, `start`), n10) {
      let e19 = v10 + y10 + 20, n11 = a10 - e19 - 130, r11 = f10 ? t10[s11] / f10 : 0;
      u10 += `<rect x="${A(e19)}" y="${A(d11 + g10 * 0.22)}" width="${A(n11)}" height="${A(g10 * 0.56)}" rx="10" fill="#e2e8f0"/>`, t10[s11] && (u10 += `<rect x="${A(e19)}" y="${A(d11 + g10 * 0.22)}" width="${A(Math.max(12, n11 * r11))}" height="${A(g10 * 0.56)}" rx="10" fill="${_10}"/>`), u10 += `<text x="${a10 - 40}" y="${A(d11 + g10 / 2 + 11)}" text-anchor="end" font-family="${j}" font-size="30" font-weight="700" fill="${gf}">${t10[s11]}${f10 ? ` <tspan font-size="20" fill="#64748b">${Math.round(r11 * 100)} %</tspan>` : ``}</text>`, f10 && t10[s11] === p10 && m10 === 1 && (u10 += `<text x="${A(e19 + Math.max(12, n11 * r11) + 10)}" y="${A(d11 + g10 / 2 + 10)}" font-family="${j}" font-size="28">\u2605</text>`);
    } else i10 || (u10 += `<circle cx="${a10 - 70}" cy="${A(d11 + g10 / 2)}" r="${A(Math.min(26, g10 * 0.3))}" fill="#ffffff" stroke="${gf}" stroke-width="3"/>`);
    u10 += `</g>`;
  }), u10;
}
function Mre(e17, t10, n10) {
  let r10 = _f(e17.vote, yf), i10 = Math.max(700, e17.w), a10 = Math.max(450, e17.h), o10 = [], s10 = `<rect x="0" y="0" width="${i10}" height="${a10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`, c10 = t10 ? r10.title : `Stimmzettel: ${r10.title}`;
  if (s10 += qo(Ko(c10 || `Abstimmung`, i10 - 60, 56, 40, 20, 1).lines, 30, 50, 36, `font-weight="700" fill="${gf}"`, `start`), !r10.options.length) return { body: s10 + qo([`Noch keine M\xF6glichkeiten \u2013 tippe auf \u201EEinstellen\u201C.`], i10 / 2, a10 / 2, 28, `fill="#868e96"`), vw: i10, vh: a10 };
  if (!t10) return s10 += `<text x="30" y="92" font-family="${j}" font-size="22" fill="#475569">Mache ein Kreuz bei einer M\xF6glichkeit.</text>`, { body: s10 + Sf(r10, r10.counts, false, false, false, i10, 110, a10 - 20, n10, o10), vw: i10, vh: a10, pics: o10.filter((e18) => e18.src) };
  let l10 = Are(e17), u10 = l10.counts.reduce((e18, t11) => e18 + t11, 0), d10 = a10 - 110;
  if (l10.phase === `wait` || l10.phase === `thanks`) {
    s10 += `<rect x="20" y="80" width="${i10 - 40}" height="${A(d10 - 60)}" rx="18" fill="#e7f5ff" stroke="${Tre}" stroke-width="3"/>`, s10 += `<text x="${i10 / 2}" y="${A(a10 * 0.3)}" text-anchor="middle" font-family="${j}" font-size="48">\u{1F5F3}</text>`;
    let e18 = l10.phase === `thanks` ? `Danke, deine Stimme ist gez\xE4hlt.` : `Geheime Wahl: Eine Person nach der anderen.`;
    s10 += qo(Ko(e18, i10 - 140, 120, 40, 20, 2).lines, i10 / 2, a10 * 0.43, 38, `font-weight="700" fill="${gf}"`), s10 += `<text x="${i10 / 2}" y="${A(a10 * 0.53)}" text-anchor="middle" font-family="${j}" font-size="26" fill="#475569">Abgegebene Stimmen: ${u10}</text>`, l10.phase === `wait` && (s10 += xf(t10, `booth`, i10 / 2 - 170, a10 * 0.6, 340, 90, `Ich w\xE4hle`, Tre)), s10 += xf(t10, `count`, 30, a10 - 90, 260, 66, `Ausz\xE4hlen`, `#ffffff`, gf);
  } else if (l10.phase === `choose`) s10 += `<text x="30" y="98" font-family="${j}" font-size="26" fill="#475569">Tippe auf deine Wahl.</text>`, s10 += Sf(r10, l10.counts, false, true, t10, i10, 116, a10 - 20, n10, o10);
  else {
    s10 += Sf(r10, l10.counts, true, !r10.secret, t10, i10, 90, d10, n10, o10);
    let e18 = Math.max(0, ...l10.counts), c11 = l10.counts.map((t11, n11) => t11 === e18 ? n11 : -1).filter((e19) => e19 >= 0), f10 = u10 ? c11.length === 1 ? `Mehrheit: ${r10.options[c11[0]].text} (${e18} von ${u10} Stimmen)` : `Gleichstand: ${c11.map((e19) => r10.options[e19].text).join(` und `)}` : r10.secret ? `Noch keine Stimmen.` : `Tippe auf eine M\xF6glichkeit, um eine Stimme zu geben.`;
    s10 += qo(Ko(f10, i10 - 380, 60, 30, 16, 1).lines, 30, a10 - 56, 28, `font-weight="700" fill="${c11.length === 1 && u10 ? `#2f9e44` : gf}"`, `start`), r10.secret && (s10 += xf(t10, `back`, i10 - 600, a10 - 90, 260, 66, `Weiter w\xE4hlen`, `#ffffff`, gf)), s10 += xf(t10, `reset`, i10 - 320, a10 - 90, 290, 66, l10.ask > Date.now() ? `Wirklich? Tippen!` : `Neue Abstimmung`, l10.ask > Date.now() ? `#e03131` : `#ffffff`, l10.ask > Date.now() ? `#ffffff` : gf);
  }
  return { body: s10, vw: i10, vh: a10, pics: o10.filter((e18) => e18.src) };
}
function Nre(e17) {
  let t10 = _f(e17.vote, yf), n10 = bf.get(e17.id);
  return n10?.phase === `result` || n10 && !t10.secret ? `${t10.title}. ${t10.options.map((e18, t11) => `${e18.text}: ${n10.counts[t11]}`).join(`. `)}.` : `${t10.title}. ${t10.options.map((e18) => e18.text).join(`, `)}.`;
}
var Cf = Uo({ cls: `lh-ct-vote`, view: Mre, label: Nre, sounds: true, hit(e17, t10) {
  let n10 = Cf.item(e17);
  if (!n10) return;
  let r10 = _f(n10.vote, yf), i10 = Are(n10), a10 = () => Ore?.(e17, [...i10.counts]);
  if (t10.startsWith(`v:`)) {
    let n11 = Number(t10.slice(2));
    if (!r10.options[n11]) return;
    i10.counts[n11] = (i10.counts[n11] ?? 0) + 1, _i(), a10(), r10.secret ? (i10.phase = `thanks`, M(`Danke, deine Stimme ist gez\xE4hlt.`), setTimeout(() => {
      i10.phase === `thanks` && (i10.phase = `wait`), Cf.redraw(e17);
    }, 1600)) : M(`${r10.options[n11].text}: ${i10.counts[n11]}`);
  } else if (t10 === `booth`) i10.phase = `choose`, _i();
  else if (t10 === `count`) {
    i10.phase = `result`, vi();
    let e18 = i10.counts.reduce((e19, t12) => e19 + t12, 0), t11 = Math.max(0, ...i10.counts), n11 = i10.counts.map((e19, n12) => e19 === t11 ? n12 : -1).filter((e19) => e19 >= 0);
    M(e18 ? n11.length === 1 ? `Die Mehrheit hat gew\xE4hlt: ${r10.options[n11[0]].text}.` : `Gleichstand.` : `Noch keine Stimmen.`);
  } else t10 === `back` ? i10.phase = `wait` : t10 === `reset` && (i10.ask <= Date.now() ? (i10.ask = Date.now() + 3e3, setTimeout(() => Cf.redraw(e17), 3100)) : (i10.counts = r10.options.map(() => 0), i10.ask = 0, i10.phase = r10.secret ? `wait` : `result`, a10()));
  Cf.redraw(e17);
} });
var Pre = Cf.draw;
var wf = [`#e64980`, `#f08c00`, `#fab005`, `#40c057`, `#228be6`, `#7048e8`];
var Tf = `#1f2937`;
var Ef = [[{ label: `Familie und Partner`, rule: `umarmen, kuscheln, k\xFCssen`, color: `#e64980` }, { label: `Freunde`, rule: `umarmen, abklatschen`, color: `#f08c00` }, { label: `Bekannte (Kollegen, Nachbarn)`, rule: `Hand geben, freundlich gr\xFC\xDFen`, color: `#40c057` }, { label: `Fremde`, rule: `Abstand halten, h\xF6chstens winken`, color: `#228be6` }], [{ label: `Familie`, rule: `umarmen`, color: `#e64980` }, { label: `Freunde`, rule: `abklatschen`, color: `#fab005` }, { label: `Fremde`, rule: `Abstand halten`, color: `#228be6` }]];
function Df(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (Array.isArray(n10.rings) ? n10.rings : []).slice(0, 5).flatMap((e18, t11) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, r11 = typeof n11.label == `string` ? n11.label.slice(0, 40) : ``;
    return r11 ? [{ label: r11, rule: typeof n11.rule == `string` ? n11.rule.slice(0, 80) : ``, color: typeof n11.color == `string` && /^#[0-9a-f]{6}$/i.test(n11.color) ? n11.color : wf[t11 % wf.length] }] : [];
  }), i10 = r10.length >= 2 ? r10 : Ef[0], a10 = (Array.isArray(n10.people) ? n10.people : []).slice(0, 16).flatMap((e18) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, r11 = typeof n11.name == `string` ? n11.name.slice(0, 24) : ``, a11 = t10(n11.img), o11 = typeof n11.ring == `number` && n11.ring >= 0 && n11.ring < i10.length ? Math.round(n11.ring) : -1;
    return r11 || a11 ? [{ name: r11, ring: o11, ...a11 ? { img: a11 } : {} }] : [];
  }), o10 = t10(n10.centerImg);
  return { title: typeof n10.title == `string` ? n10.title.slice(0, 80) : ``, center: typeof n10.center == `string` && n10.center.trim() ? n10.center.slice(0, 20) : `Ich`, ...o10 ? { centerImg: o10 } : {}, rings: i10, people: a10 };
}
var kf = (e17) => typeof e17 == `string` ? e17 : void 0;
var Af = /* @__PURE__ */ new Map();
var Ire = null;
function Lre(e17) {
  Ire = e17;
}
function Rre(e17) {
  let t10 = Df(e17.nd, kf), n10 = t10.people.map((e18) => e18.ring), r10 = JSON.stringify([t10.people.map((e18) => e18.name), n10]), i10 = Af.get(e17.id);
  return i10 && i10.saved === r10 || Af.set(e17.id, i10 = { saved: r10, where: n10, sel: i10?.sel ?? -1 }), i10;
}
function Bre(e17, t10, n10, r10, i10, a10, o10) {
  let s10 = `<circle cx="${A(t10)}" cy="${A(n10)}" r="${A(r10)}" fill="#ffffff" stroke="${i10 ? `#f08c00` : `#475569`}" stroke-width="${i10 ? 7 : 3}"/>`;
  e17.img ? o10.push({ src: a10(e17.img) ?? ``, x: t10 - r10 * 0.72, y: n10 - r10 * 0.72, w: r10 * 1.44, h: r10 * 1.44 }) : s10 += `<text x="${A(t10)}" y="${A(n10 + r10 * 0.32)}" text-anchor="middle" font-family="${j}" font-size="${A(r10 * 0.9)}" font-weight="700" fill="${Tf}">${Bo((e17.name[0] ?? `?`).toUpperCase())}</text>`;
  let c10 = Ko(e17.name, r10 * 3.2, 30, 20, 11, 1);
  return s10 += `<rect x="${A(t10 - r10 * 1.6)}" y="${A(n10 + r10 + 2)}" width="${A(r10 * 3.2)}" height="28" rx="8" fill="#ffffff" opacity="0.85"/>`, s10 + qo(c10.lines, t10, n10 + r10 + 16, c10.size, `font-weight="700" fill="${Tf}"`);
}
function Vre(e17, t10, n10) {
  let r10 = Df(e17.nd, kf), i10 = t10 ? Rre(e17) : { where: r10.people.map((e18) => e18.ring), sel: -1 }, a10 = Math.max(800, e17.w), o10 = Math.max(500, e17.h), s10 = [], c10 = `<rect x="0" y="0" width="${a10}" height="${o10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`;
  r10.title && (c10 += qo(Ko(r10.title, a10 - 60, 56, 40, 20, 1).lines, 30, 50, 36, `font-weight="700" fill="${Tf}"`, `start`));
  let l10 = r10.rings.length, u10 = Math.min((o10 - 100) / 2, a10 * 0.3), d10 = 30 + u10, f10 = 80 + (o10 - 100) / 2, p10 = u10 * 0.2, m10 = (u10 - p10) / l10;
  for (let e18 = l10 - 1; e18 >= 0; e18--) {
    let n11 = p10 + (e18 + 1) * m10;
    c10 += `<g${Vo(t10, `r:${e18}`)}><circle cx="${A(d10)}" cy="${A(f10)}" r="${A(n11)}" fill="${r10.rings[e18].color}" fill-opacity="${0.16 + 0.04 * (l10 - e18)}" stroke="${r10.rings[e18].color}" stroke-width="4"/></g>`;
  }
  c10 += `<circle cx="${A(d10)}" cy="${A(f10)}" r="${A(p10)}" fill="#ffffff" stroke="${Tf}" stroke-width="4"/>`, r10.centerImg ? s10.push({ src: n10(r10.centerImg) ?? ``, x: d10 - p10 * 0.72, y: f10 - p10 * 0.72, w: p10 * 1.44, h: p10 * 1.44 }) : c10 += qo(Ko(r10.center, p10 * 1.8, p10, 30, 12, 1).lines, d10, f10, 28, `font-weight="700" fill="${Tf}"`);
  let h10 = Math.min(30, m10 * 0.32);
  for (let e18 = 0; e18 < l10; e18++) {
    let a11 = r10.people.map((e19, t11) => ({ p: e19, i: t11 })).filter((t11) => i10.where[t11.i] === e18), o11 = p10 + (e18 + 0.5) * m10;
    a11.forEach(({ p: r11, i: l11 }, u11) => {
      let p11 = -Math.PI / 2 + (u11 + 0.5) * (2 * Math.PI / Math.max(a11.length, 6)) + e18 * 0.4;
      c10 += `<g${Vo(t10, `p:${l11}`)}>${Bre(r11, d10 + o11 * Math.cos(p11), f10 + o11 * Math.sin(p11), h10, i10.sel === l11, n10, s10)}</g>`;
    });
  }
  let g10 = d10 + u10 + 40, _10 = a10 - g10 - 24, v10 = 90;
  r10.rings.forEach((e18, n11) => {
    c10 += `<g${Vo(t10, `r:${n11}`)}><rect x="${A(g10)}" y="${v10}" width="${A(_10)}" height="66" rx="12" fill="${e18.color}" fill-opacity="0.14" stroke="${e18.color}" stroke-width="3"/><circle cx="${A(g10 + 26)}" cy="${v10 + 33}" r="12" fill="${e18.color}"/>`, c10 += qo([e18.label], g10 + 48, v10 + 22, 22, `font-weight="700" fill="${Tf}"`, `start`), c10 += qo(Ko(e18.rule, _10 - 60, 26, 20, 12, 1).lines, g10 + 48, v10 + 48, 19, `fill="#475569"`, `start`) + `</g>`, v10 += 74;
  });
  let y10 = r10.people.map((e18, t11) => ({ p: e18, i: t11 })).filter((e18) => i10.where[e18.i] < 0);
  if (y10.length) {
    v10 += 10, c10 += `<text x="${A(g10)}" y="${v10 + 20}" font-family="${j}" font-size="22" fill="#475569">${t10 ? i10.sel >= 0 ? `Jetzt einen Kreis antippen.` : `Tippe einen Namen an, dann einen Kreis:` : `Wohin geh\xF6ren sie?`}</text>`;
    let e18 = Math.max(1, Math.floor(_10 / 110));
    y10.forEach(({ p: r11, i: a11 }, l11) => {
      let u11 = g10 + 50 + l11 % e18 * 110, d11 = v10 + 74 + Math.floor(l11 / e18) * 96;
      d11 + 60 > o10 || (c10 += `<g${Vo(t10, `p:${a11}`)}>${Bre(r11, u11, d11, 28, i10.sel === a11, n10, s10)}</g>`);
    });
  }
  return { body: c10, vw: a10, vh: o10, pics: s10.filter((e18) => e18.src) };
}
function Hre(e17) {
  let t10 = Df(e17.nd, kf), n10 = Af.get(e17.id)?.where ?? t10.people.map((e18) => e18.ring);
  return `${t10.title} ${t10.rings.map((e18, r10) => `${e18.label}: ${e18.rule}. ${t10.people.filter((e19, t11) => n10[t11] === r10).map((e19) => e19.name).join(`, `)}`).join(`. `)}`;
}
var jf = Uo({ cls: `lh-ct-circles`, view: Vre, label: Hre, hit(e17, t10) {
  let n10 = jf.item(e17);
  if (!n10) return;
  let r10 = Df(n10.nd, kf), i10 = Rre(n10);
  if (t10.startsWith(`p:`)) {
    let e18 = Number(t10.slice(2));
    i10.sel = i10.sel === e18 ? -1 : e18, i10.sel >= 0 && M(r10.people[e18].name), _i();
  } else if (t10.startsWith(`r:`)) {
    let n11 = Number(t10.slice(2)), a10 = r10.rings[n11];
    i10.sel >= 0 ? (i10.where[i10.sel] = n11, M(`${r10.people[i10.sel].name}: ${a10.label}. ${a10.rule}.`), i10.sel = -1, Ire?.(e17, [...i10.where])) : M(`${a10.label}: ${a10.rule}.`);
  }
  jf.redraw(e17);
} });
var Ure = jf.draw;
var Mf = () => ({ title: `Wo tut es weh?`, back: true, scale: true, since: true });
function Nf(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {};
  return { title: typeof t10.title == `string` ? t10.title.slice(0, 80) : Mf().title, back: t10.back !== false, scale: t10.scale !== false, since: t10.since !== false };
}
var Pf = `#1f2937`;
var Ff = `#f1f5f9`;
var Wre = `#64748b`;
var If = `#e03131`;
var Lf = (e17, t10, n10, r10) => `M${e17 - n10} ${t10}a${n10} ${r10} 0 1 0 ${2 * n10} 0a${n10} ${r10} 0 1 0 ${-2 * n10} 0z`;
var Rf = (e17, t10, n10, r10, i10 = 14) => `M${e17 + i10} ${t10}h${n10 - 2 * i10}a${i10} ${i10} 0 0 1 ${i10} ${i10}v${r10 - 2 * i10}a${i10} ${i10} 0 0 1 ${-i10} ${i10}h${-(n10 - 2 * i10)}a${i10} ${i10} 0 0 1 ${-i10} ${-i10}v${-(r10 - 2 * i10)}a${i10} ${i10} 0 0 1 ${i10} ${-i10}z`;
function zf(e17, t10, n10, r10, i10, a10, o10) {
  let s10 = (e18) => 300 - e18, c10 = (e18) => e18;
  return [{ id: `${n10}-r`, name: r10, say: a10, d: t10(e17 ? c10 : s10) }, { id: `${n10}-l`, name: i10, say: o10, d: t10(e17 ? s10 : c10) }];
}
function Bf(e17) {
  let t10 = [];
  return e17 ? (t10.push({ id: `head`, name: `Kopf`, say: `Mein Kopf`, d: Lf(150, 70, 52, 60) }), t10.push({ id: `eyes`, name: `Augen`, say: `Meine Augen`, d: Lf(130, 62, 11, 8) + Lf(170, 62, 11, 8) }), t10.push({ id: `mouth`, name: `Z\xE4hne`, say: `Meine Z\xE4hne`, d: Lf(150, 100, 17, 9) }), t10.push(...zf(e17, (e18) => Lf(e18(96), 72, 10, 18), `ear`, `rechtes Ohr`, `linkes Ohr`, `Mein rechtes Ohr`, `Mein linkes Ohr`)), t10.push({ id: `throat`, name: `Hals`, say: `Mein Hals`, d: Rf(128, 128, 44, 38, 10) }), t10.push({ id: `chest`, name: `Brust`, say: `Meine Brust`, d: Rf(92, 168, 116, 112, 18) }), t10.push({ id: `belly`, name: `Bauch`, say: `Mein Bauch`, d: Rf(96, 282, 108, 116, 20) })) : (t10.push({ id: `head-back`, name: `Hinterkopf`, say: `Mein Hinterkopf`, d: Lf(150, 70, 52, 60) }), t10.push({ id: `neck`, name: `Nacken`, say: `Mein Nacken`, d: Rf(128, 128, 44, 38, 10) }), t10.push({ id: `back-up`, name: `oberer R\xFCcken`, say: `Mein oberer R\xFCcken`, d: Rf(92, 168, 116, 112, 18) }), t10.push({ id: `back-low`, name: `unterer R\xFCcken`, say: `Mein unterer R\xFCcken`, d: Rf(96, 282, 108, 116, 20) })), t10.push(...zf(e17, (e18) => Lf(e18(70), 186, 26, 22), `shoulder`, `rechte Schulter`, `linke Schulter`, `Meine rechte Schulter`, `Meine linke Schulter`)), t10.push(...zf(e17, (e18) => `M${e18(48)} 204L${e18(78)} 210L${e18(62)} 390L${e18(34)} 384Z`, `arm`, `rechter Arm`, `linker Arm`, `Mein rechter Arm`, `Mein linker Arm`)), t10.push(...zf(e17, (e18) => Lf(e18(46), 414, 22, 28), `hand`, `rechte Hand`, `linke Hand`, `Meine rechte Hand`, `Meine linke Hand`)), t10.push(...zf(e17, (e18) => `M${e18(100)} 402H${e18(146)}L${e18(142)} 540H${e18(108)}Z`, `thigh`, `rechter Oberschenkel`, `linker Oberschenkel`, `Mein rechter Oberschenkel`, `Mein linker Oberschenkel`)), t10.push(...zf(e17, (e18) => Lf(e18(125), 562, 21, 22), `knee`, `rechtes Knie`, `linkes Knie`, `Mein rechtes Knie`, `Mein linkes Knie`)), t10.push(...zf(e17, (e18) => `M${e18(107)} 586H${e18(143)}L${e18(140)} 700H${e18(112)}Z`, `shin`, `rechtes Bein unten`, `linkes Bein unten`, `Mein rechtes Bein`, `Mein linkes Bein`)), t10.push(...zf(e17, (e18) => `M${e18(110)} 702H${e18(142)}L${e18(146)} 738C${e18(146)} 750 ${e18(132)} 754 ${e18(118)} 754H${e18(96)}C${e18(86)} 754 ${e18(88)} 740 ${e18(104)} 734Z`, `foot`, `rechter Fu\xDF`, `linker Fu\xDF`, `Mein rechter Fu\xDF`, `Mein linker Fu\xDF`)), t10;
}
var Gre = [...Bf(true), ...Bf(false)];
var Vf = [{ label: `kein Schmerz`, say: `Es tut nicht weh.`, color: `#2f9e44` }, { label: `ein bisschen`, say: `Es tut ein bisschen weh.`, color: `#82c91e` }, { label: `etwas mehr`, say: `Es tut etwas mehr weh.`, color: `#fab005` }, { label: `stark`, say: `Es tut stark weh.`, color: `#fd7e14` }, { label: `sehr stark`, say: `Es tut sehr stark weh.`, color: `#f03e3e` }, { label: `ganz schlimm`, say: `Es tut ganz schlimm weh.`, color: `#c92a2a` }];
var Hf = [`seit heute`, `seit gestern`, `seit ein paar Tagen`, `seit einer Woche`, `schon lange`];
var Uf = /* @__PURE__ */ new Map();
var Wf = (e17) => {
  let t10 = Uf.get(e17);
  return t10 || Uf.set(e17, t10 = { hurt: [], pain: -1, since: -1 }), t10;
};
function qre(e17, t10, n10, r10, i10) {
  let a10 = Vf[r10].color, o10 = i10 ? `#ffffff` : a10, s10 = `<circle cx="${A(e17)}" cy="${A(t10)}" r="${A(n10)}" fill="${i10 ? a10 : `#ffffff`}" stroke="${a10}" stroke-width="4"/>`;
  s10 += `<circle cx="${A(e17 - n10 * 0.33)}" cy="${A(t10 - n10 * 0.2)}" r="${A(n10 * 0.1)}" fill="${o10}"/><circle cx="${A(e17 + n10 * 0.33)}" cy="${A(t10 - n10 * 0.2)}" r="${A(n10 * 0.1)}" fill="${o10}"/>`;
  let c10 = t10 + n10 * 0.35, l10 = (0.3 - r10 * 0.12) * n10;
  return s10 += `<path d="M${A(e17 - n10 * 0.42)} ${A(c10 - l10 / 2)}Q${A(e17)} ${A(c10 + l10)} ${A(e17 + n10 * 0.42)} ${A(c10 - l10 / 2)}" fill="none" stroke="${o10}" stroke-width="${A(n10 * 0.1)}" stroke-linecap="round"/>`, r10 >= 5 && (s10 += `<path d="M${A(e17 - n10 * 0.33)} ${A(t10 - n10 * 0.05)}q-4 10 0 14q4-4 0-14" fill="#74c0fc"/>`), s10;
}
function Jre(e17, t10, n10, r10, i10, a10) {
  let o10 = `<g transform="translate(${A(t10)} ${A(n10)}) scale(${A(r10 * 1e3) / 1e3})">`, s10 = Bf(e17);
  o10 += `<g fill="${Ff}" stroke="#94a3b8" stroke-width="22" stroke-linejoin="round">${s10.map((e18) => `<path d="${e18.d}"/>`).join(``)}</g>`, o10 += `<g fill="${Ff}" stroke="${Ff}" stroke-width="16" stroke-linejoin="round">${s10.map((e18) => `<path d="${e18.d}"/>`).join(``)}</g>`;
  for (let e18 of s10) {
    let t11 = i10.includes(e18.id), n11 = e18.id === `eyes` || e18.id === `mouth`;
    o10 += `<g${Vo(a10, `p:${e18.id}`)}><title>${Bo(e18.name)}</title><path d="${e18.d}" fill="${t11 ? If : n11 ? `#ffffff` : Ff}" fill-opacity="${t11 ? 0.85 : 1}" stroke="${t11 ? If : n11 ? Wre : `#cbd5e1`}" stroke-width="${n11 ? 3 : 2}" stroke-linejoin="round"/></g>`;
  }
  return o10 += `<text x="150" y="790" text-anchor="middle" font-family="${j}" font-size="30" font-weight="700" fill="#64748b">${e17 ? `vorne` : `hinten`}</text>`, o10 + `</g>`;
}
function Gf(e17) {
  let t10 = e17.hurt.map((e18) => Gre.find((t11) => t11.id === e18)).filter((e18) => !!e18);
  return t10.length ? [t10.length === 1 ? `${t10[0].say} tut weh.` : `Mir tut weh: ${t10.map((e18) => e18.name).join(`, `)}.`, e17.pain >= 0 ? Vf[e17.pain].say : ``, e17.since >= 0 ? `Das ist so ${Hf[e17.since]}.` : ``].filter(Boolean).join(` `) : ``;
}
function Yre(e17, t10) {
  let n10 = Nf(e17.bd), r10 = t10 ? Wf(e17.id) : { hurt: [], pain: -1, since: -1 }, i10 = Math.max(800, e17.w), a10 = Math.max(500, e17.h), o10 = `<rect x="0" y="0" width="${i10}" height="${a10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`, s10 = Ko(n10.title, i10 * 0.5, 56, 40, 20, 1);
  o10 += qo(s10.lines, 30, 50, s10.size, `font-weight="700" fill="${Pf}"`, `start`);
  let c10 = (a10 - 110) / 800, l10 = 300 * c10;
  o10 += Jre(true, 20, 80, c10, r10.hurt, t10), n10.back && (o10 += Jre(false, 30 + l10, 80, c10, r10.hurt, t10));
  let u10 = 40 + l10 * (n10.back ? 2 : 1) + 20, d10 = i10 - u10 - 24, f10 = 84;
  if (n10.scale) {
    o10 += `<text x="${A(u10)}" y="${f10 + 24}" font-family="${j}" font-size="28" font-weight="700" fill="${Pf}">Wie stark?</text>`;
    let e18 = Math.min(40, d10 / 6 / 2 - 6);
    Vf.forEach((n11, i11) => {
      let a11 = u10 + e18 + 4 + d10 / 6 * i11, s11 = r10.pain === i11;
      o10 += `<g${Vo(t10, `s:${i11}`)}><title>${n11.label}</title><circle cx="${A(a11)}" cy="${f10 + 80}" r="${A(e18 + 8)}" fill="transparent"/>${qre(a11, f10 + 80, e18, i11, s11)}</g>`, o10 += qo(Ko(n11.label, d10 / 6 - 4, 40, 18, 11, 2).lines, a11, f10 + 80 + e18 + 26, 16, `fill="${Pf}"`);
    }), f10 += 190;
  }
  if (n10.since) {
    o10 += `<text x="${A(u10)}" y="${f10 + 24}" font-family="${j}" font-size="28" font-weight="700" fill="${Pf}">Seit wann?</text>`;
    let e18 = (d10 - 20) / 3;
    Hf.forEach((n11, i11) => {
      let a11 = u10 + i11 % 3 * (e18 + 10), s11 = f10 + 44 + Math.floor(i11 / 3) * 62, c11 = r10.since === i11;
      o10 += `<g${Vo(t10, `t:${i11}`)}><rect x="${A(a11)}" y="${s11}" width="${A(e18)}" height="52" rx="26" fill="${c11 ? `#2b6cb0` : `#f8fafc`}" stroke="${c11 ? `#2b6cb0` : `#94a3b8`}" stroke-width="3"/>${qo(Ko(n11, e18 - 16, 44, 22, 12, 1).lines, a11 + e18 / 2, s11 + 26, 21, `font-weight="700" fill="${c11 ? `#ffffff` : Pf}"`)}</g>`;
    }), f10 += 180;
  }
  let p10 = a10 - f10 - 24;
  o10 += `<rect x="${A(u10)}" y="${f10}" width="${A(d10)}" height="${A(p10)}" rx="16" fill="#fff5f5" stroke="${If}" stroke-width="3"/>`;
  let m10 = t10 ? Gf(r10) : ``;
  return o10 += m10 ? qo(Ko(m10, d10 - 40, p10 - 90, 30, 16, 6).lines, u10 + 20, f10 + (p10 - 70) / 2 + 6, 28, `fill="${Pf}"`, `start`) : qo(Ko(t10 ? `Tippe auf die Stelle, die weh tut.` : `Mir tut weh: \u2026`, d10 - 40, p10 - 90, 26, 16, 3).lines, u10 + 20, f10 + (p10 - 70) / 2, 26, `fill="#868e96"`, `start`), t10 && m10 && (o10 += `<g${Vo(t10, `read`)}><rect x="${A(u10 + 16)}" y="${A(f10 + p10 - 64)}" width="200" height="50" rx="25" fill="#2b6cb0"/><text x="${A(u10 + 116)}" y="${A(f10 + p10 - 31)}" text-anchor="middle" font-family="${j}" font-size="24" font-weight="700" fill="#ffffff">Vorlesen</text></g>`, o10 += `<g${Vo(t10, `clear`)}><rect x="${A(u10 + d10 - 196)}" y="${A(f10 + p10 - 64)}" width="180" height="50" rx="25" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/><text x="${A(u10 + d10 - 106)}" y="${A(f10 + p10 - 31)}" text-anchor="middle" font-family="${j}" font-size="24" font-weight="700" fill="#475569">L\xF6schen</text></g>`), { body: o10, vw: i10, vh: a10 };
}
function Xre(e17) {
  let t10 = Nf(e17.bd);
  return Gf(Wf(e17.id)) || `${t10.title} Tippe auf die Stelle, die weh tut.`;
}
var Kf = Uo({ cls: `lh-ct-body`, view: Yre, label: Xre, hit(e17, t10) {
  let n10 = Wf(e17);
  if (t10.startsWith(`p:`)) {
    let e18 = t10.slice(2), r10 = Gre.find((t11) => t11.id === e18);
    if (!r10) return;
    n10.hurt.includes(e18) ? n10.hurt = n10.hurt.filter((t11) => t11 !== e18) : (n10.hurt.push(e18), _i(), M(`${r10.say} tut weh.`));
  } else if (t10.startsWith(`s:`)) {
    let e18 = Number(t10.slice(2));
    n10.pain = n10.pain === e18 ? -1 : e18, n10.pain >= 0 && M(Vf[e18].say);
  } else if (t10.startsWith(`t:`)) {
    let e18 = Number(t10.slice(2));
    n10.since = n10.since === e18 ? -1 : e18, n10.since >= 0 && M(Hf[e18]);
  } else if (t10 === `read`) {
    ms(), M(Gf(n10));
    return;
  } else t10 === `clear` && Uf.delete(e17);
  Kf.redraw(e17);
} });
var Zre = Kf.draw;
var qf = [`#2f9e44`, `#f59f00`, `#e03131`, `#1c7ed6`, `#7048e8`, `#495057`, `#8d5524`, `#15aabf`];
var Jf = `#1f2937`;
var Yf = () => ({ title: `Sortieren`, mode: `sort`, ask: `Was ist das?`, boxes: [{ label: `A`, color: qf[0] }, { label: `B`, color: qf[3] }], items: [] });
function Xf(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (Array.isArray(n10.boxes) ? n10.boxes : []).slice(0, 4).flatMap((e18, t11) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, r11 = typeof n11.label == `string` ? n11.label.slice(0, 30) : ``;
    return r11 ? [{ label: r11, color: typeof n11.color == `string` && /^#[0-9a-f]{6}$/i.test(n11.color) ? n11.color : qf[t11 % qf.length] }] : [];
  }), i10 = n10.mode === `quiz` ? `quiz` : `sort`, a10 = (Array.isArray(n10.items) ? n10.items : []).slice(0, 24).flatMap((e18) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, i11 = typeof n11.text == `string` ? n11.text.slice(0, 60) : ``, a11 = typeof n11.box == `number` && n11.box >= 0 && n11.box < Math.max(1, r10.length) ? Math.round(n11.box) : 0, o10 = t10(n11.img);
    return i11 ? [{ text: i11, box: a11, ...o10 ? { img: o10 } : {} }] : [];
  });
  return { title: typeof n10.title == `string` ? n10.title.slice(0, 80) : ``, mode: i10, ask: typeof n10.ask == `string` && n10.ask.trim() ? n10.ask.slice(0, 80) : `Was ist das?`, boxes: r10.length >= 2 || i10 === `quiz` ? r10 : Yf().boxes, items: a10 };
}
var Qf = (e17) => typeof e17 == `string` ? e17 : void 0;
var $f = /* @__PURE__ */ new Map();
var ep = (e17) => {
  let t10 = [...e17];
  for (let e18 = t10.length - 1; e18 > 0; e18--) {
    let n10 = Math.floor(Math.random() * (e18 + 1));
    [t10[e18], t10[n10]] = [t10[n10], t10[e18]];
  }
  return t10;
};
function Qre(e17, t10) {
  return ep([t10, ...ep(e17.items.map((e18, t11) => t11).filter((n10) => n10 !== t10 && e17.items[n10].text !== e17.items[t10].text)).slice(0, 2)]);
}
function $re(e17, t10) {
  let n10 = ep(e17.items.map((e18, t11) => t11));
  return { key: t10, order: n10, pos: 0, miss: 0, clean: 0, placed: e17.boxes.map(() => []), choices: e17.mode === `quiz` && n10.length ? Qre(e17, n10[0]) : [], solved: false };
}
function eie(e17) {
  let t10 = Xf(e17.sort, Qf), n10 = JSON.stringify(e17.sort ?? {}), r10 = $f.get(e17.id);
  return r10 && r10.key === n10 || $f.set(e17.id, r10 = $re(t10, n10)), r10;
}
function nie(e17, t10, n10) {
  let r10 = Xf(e17.sort, Qf), i10 = Math.max(700, e17.w), a10 = Math.max(450, e17.h), o10 = [], s10 = `<rect x="0" y="0" width="${i10}" height="${a10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`, c10 = Ko(r10.title || (r10.mode === `quiz` ? r10.ask : `Sortieren`), i10 * 0.7, 56, 40, 20, 1);
  if (s10 += qo(c10.lines, 30, 50, c10.size, `font-weight="700" fill="${Jf}"`, `start`), !r10.items.length) return s10 += qo([`Noch keine Karten \u2013 tippe auf \u201EEinstellen\u201C.`], i10 / 2, a10 / 2, 30, `fill="#868e96"`), { body: s10, vw: i10, vh: a10 };
  if (!t10) return rie(r10, i10, a10, s10, n10);
  let l10 = eie(e17), u10 = r10.items.length, d10 = l10.pos >= u10;
  if (d10 || (s10 += `<text x="${i10 - 30}" y="50" text-anchor="end" font-family="${j}" font-size="26" fill="#64748b">${l10.pos + 1} von ${u10}</text>`), d10) {
    let e18 = `Fertig: ${l10.clean} von ${u10} beim ersten Mal richtig.`;
    return s10 += qo(Ko(e18, i10 - 100, 120, 44, 24, 2).lines, i10 / 2, a10 * 0.42, 40, `font-weight="700" fill="${l10.clean === u10 ? `#2f9e44` : Jf}"`), s10 += `<g${Vo(t10, `again`)}><rect x="${i10 / 2 - 150}" y="${A(a10 * 0.56)}" width="300" height="80" rx="40" fill="#2b6cb0"/><text x="${i10 / 2}" y="${A(a10 * 0.56 + 52)}" text-anchor="middle" font-family="${j}" font-size="36" font-weight="700" fill="#ffffff">Nochmal</text></g>`, { body: s10, vw: i10, vh: a10 };
  }
  let f10 = l10.order[l10.pos], p10 = r10.items[f10];
  if (r10.mode === `sort`) {
    let e18 = Math.min(360, i10 * 0.32), c11 = Math.min(a10 * 0.46, 330), u11 = i10 / 2 - e18 / 2;
    s10 += `<g${Vo(t10, `card`)}><rect x="${A(u11)}" y="86" width="${A(e18)}" height="${A(c11)}" rx="18" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>`, p10.img && o10.push({ src: n10(p10.img) ?? ``, x: u11 + 16, y: 100, w: e18 - 32, h: c11 - 56 - 24 });
    let d11 = Ko(p10.text, e18 - 24, p10.img ? 56 : c11 - 30, p10.img ? 32 : 46, 16, p10.img ? 1 : 3);
    s10 += qo(d11.lines, i10 / 2, p10.img ? 86 + c11 - 28 - 6 : 86 + c11 / 2, d11.size, `font-weight="700" fill="${Jf}"`) + `</g>`;
    let f11 = r10.boxes.length, m10 = (i10 - 40 - (f11 - 1) * 18) / f11, h10 = 86 + c11 + 30, g10 = a10 - h10 - 20;
    r10.boxes.forEach((e19, i11) => {
      let a11 = 20 + i11 * (m10 + 18), c12 = l10.miss >= 2 && p10.box === i11;
      s10 += `<g${Vo(t10, `b:${i11}`)}><rect x="${A(a11)}" y="${A(h10)}" width="${A(m10)}" height="${A(g10)}" rx="16" fill="${e19.color}" fill-opacity="0.12" stroke="${c12 ? `#f08c00` : e19.color}" stroke-width="${c12 ? 9 : 4}"/>`, s10 += `<rect x="${A(a11)}" y="${A(h10)}" width="${A(m10)}" height="54" rx="16" fill="${e19.color}"/>`;
      let u12 = Ko(e19.label, m10 - 20, 50, 28, 14, 1);
      s10 += qo(u12.lines, a11 + m10 / 2, h10 + 27, u12.size, `font-weight="700" fill="#ffffff"`);
      let d12 = l10.placed[i11] ?? [], f12 = Math.min(56, (m10 - 20) / 4);
      d12.slice(-12).forEach((e20, t11) => {
        let i12 = a11 + 10 + t11 % 4 * (f12 + 2), c13 = h10 + 64 + Math.floor(t11 / 4) * (f12 + 2);
        if (c13 + f12 > h10 + g10 - 6) return;
        let l11 = r10.items[e20].img;
        l11 ? o10.push({ src: n10(l11) ?? ``, x: i12, y: c13, w: f12, h: f12 }) : s10 += qo(Ko(r10.items[e20].text, f12, f12, 14, 8, 2).lines, i12 + f12 / 2, c13 + f12 / 2, 12, `fill="${Jf}"`);
      }), s10 += `</g>`;
    });
  } else {
    let e18 = Math.min(i10 * 0.42, a10 - 140);
    s10 += `<g${Vo(t10, `card`)}><rect x="40" y="100" width="${A(e18)}" height="${A(e18)}" rx="18" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/></g>`, p10.img ? o10.push({ src: n10(p10.img) ?? ``, x: 60, y: 120, w: e18 - 40, h: e18 - 40 }) : s10 += qo(Ko(p10.text, e18 - 40, e18 - 40, 40, 16, 3).lines, 40 + e18 / 2, 100 + e18 / 2, 36, `fill="${Jf}"`);
    let c11 = 40 + e18 + 40, u11 = i10 - c11 - 30;
    r10.ask.trim() !== r10.title.trim() && (s10 += qo(Ko(r10.ask, u11, 56, 34, 18, 2).lines, c11, 128, 32, `font-weight="700" fill="${Jf}"`, `start`));
    let d11 = Math.min(110, (a10 - 100 - 90 - 32) / 3);
    l10.choices.forEach((e19, n11) => {
      let i11 = 170 + n11 * (d11 + 16), a11 = l10.solved && e19 === f10;
      s10 += `<g${Vo(t10, `a:${e19}`)}><rect x="${A(c11)}" y="${A(i11)}" width="${A(u11)}" height="${A(d11)}" rx="16" fill="${a11 ? `#2f9e44` : `#f8fafc`}" stroke="${a11 ? `#2f9e44` : `#94a3b8`}" stroke-width="3"/>`, s10 += qo(Ko(r10.items[e19].text, u11 - 40, d11 - 16, 30, 14, 2).lines, c11 + 24, i11 + d11 / 2, 28, `fill="${a11 ? `#ffffff` : Jf}" font-weight="700"`, `start`) + `</g>`;
    }), l10.solved && (s10 += `<g${Vo(t10, `next`)}><rect x="${A(i10 - 250)}" y="${A(a10 - 96)}" width="220" height="72" rx="36" fill="#2b6cb0"/><text x="${A(i10 - 140)}" y="${A(a10 - 50)}" text-anchor="middle" font-family="${j}" font-size="32" font-weight="700" fill="#ffffff">Weiter \u2192</text></g>`);
  }
  return { body: s10, vw: i10, vh: a10, pics: o10.filter((e18) => e18.src) };
}
function rie(e17, t10, n10, r10, i10) {
  let a10 = [], o10 = e17.items.length, s10 = e17.mode === `quiz`, c10 = s10 ? n10 - 110 : n10 * 0.62 - 90, l10 = Math.min(o10, s10 ? 4 : 6), u10 = Math.ceil(o10 / l10), d10 = (t10 - 40 - (l10 - 1) * 12) / l10, f10 = Math.min(d10 * (s10 ? 1.1 : 0.9), (c10 - (u10 - 1) * 12) / u10);
  if (e17.items.forEach((e18, t11) => {
    let n11 = 20 + t11 % l10 * (d10 + 12), o11 = 86 + Math.floor(t11 / l10) * (f10 + 12);
    r10 += `<rect x="${A(n11)}" y="${A(o11)}" width="${A(d10)}" height="${A(f10)}" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>`;
    let c11 = s10 ? 40 : 30;
    e18.img && a10.push({ src: i10(e18.img) ?? ``, x: n11 + 6, y: o11 + 6, w: d10 - 12, h: f10 - c11 - 12 }), r10 += s10 ? `<path d="M${A(n11 + 12)} ${A(o11 + f10 - 12)}H${A(n11 + d10 - 12)}" stroke="#94a3b8" stroke-width="2"/>` : qo(Ko(e18.text, d10 - 10, c11, 20, 10, 1).lines, n11 + d10 / 2, e18.img ? o11 + f10 - c11 / 2 - 2 : o11 + f10 / 2, 18, `fill="${Jf}"`);
  }), !s10) {
    let i11 = e17.boxes.length, a11 = (t10 - 40 - (i11 - 1) * 18) / i11, o11 = n10 * 0.66;
    e17.boxes.forEach((e18, t11) => {
      let i12 = 20 + t11 * (a11 + 18);
      r10 += `<rect x="${A(i12)}" y="${A(o11)}" width="${A(a11)}" height="${A(n10 - o11 - 20)}" rx="16" fill="${e18.color}" fill-opacity="0.1" stroke="${e18.color}" stroke-width="4"/><rect x="${A(i12)}" y="${A(o11)}" width="${A(a11)}" height="54" rx="16" fill="${e18.color}"/>`, r10 += qo(Ko(e18.label, a11 - 20, 50, 28, 14, 1).lines, i12 + a11 / 2, o11 + 27, 26, `font-weight="700" fill="#ffffff"`);
    });
  }
  return { body: r10, vw: t10, vh: n10, pics: a10.filter((e18) => e18.src) };
}
function iie(e17) {
  let t10 = Xf(e17.sort, Qf), n10 = $f.get(e17.id), r10 = n10 && n10.pos < t10.items.length ? t10.items[n10.order[n10.pos]] : null;
  return t10.mode === `quiz` ? `${t10.title}. ${t10.ask}${r10 && n10 ? ` ${n10.choices.map((e18) => t10.items[e18].text).join(`, oder `)}?` : ``}` : `${t10.title}. ${r10 ? `${r10.text}. ` : ``}Wohin geh\xF6rt es? ${t10.boxes.map((e18) => e18.label).join(`, `)}.`;
}
var tp = Uo({ cls: `lh-ct-sort`, view: nie, label: iie, sounds: true, hit(e17, t10, n10) {
  let r10 = tp.item(e17);
  if (!r10) return;
  let i10 = Xf(r10.sort, Qf), a10 = eie(r10);
  if (t10 === `again`) {
    $f.set(e17, $re(i10, a10.key)), tp.redraw(e17);
    return;
  }
  let o10 = a10.order[a10.pos], s10 = i10.items[o10];
  if (!s10) return;
  if (t10 === `card`) {
    M(s10.text);
    return;
  }
  let c10 = () => {
    a10.pos++, a10.miss = 0, a10.solved = false, a10.pos < i10.items.length && i10.mode === `quiz` && (a10.choices = Qre(i10, a10.order[a10.pos])), a10.pos >= i10.items.length && M(`Fertig: ${a10.clean} von ${i10.items.length} beim ersten Mal richtig.`);
  };
  if (t10.startsWith(`b:`)) {
    let e18 = Number(t10.slice(2));
    e18 === s10.box ? (a10.miss || a10.clean++, a10.placed[e18].push(o10), vi(), M(`${s10.text}: ${i10.boxes[e18].label}.`), c10()) : (a10.miss++, yi(), Wo(n10), M(a10.miss >= 2 ? `${s10.text} geh\xF6rt zu ${i10.boxes[s10.box].label}.` : `Nicht ${i10.boxes[e18].label}. Versuch es noch einmal.`));
  } else t10.startsWith(`a:`) && !a10.solved ? Number(t10.slice(2)) === o10 ? (a10.miss || a10.clean++, a10.solved = true, vi(), M(s10.text)) : (a10.miss++, yi(), Wo(n10), a10.miss >= 2 && (a10.solved = true, M(`Richtig ist: ${s10.text}.`))) : t10 === `next` && c10();
  tp.redraw(e17);
} });
var aie = tp.draw;
var np = [{ fill: `#fff000`, ink: `#1f2937`, edge: `#e0c800` }, { fill: `#80c040`, ink: `#1f2937`, edge: `#6aa832` }, { fill: `#2070c0`, ink: `#ffffff`, edge: `#1a5c9e` }, { fill: `#ff0000`, ink: `#ffffff`, edge: `#d40000` }, { fill: `#ffb000`, ink: `#1f2937`, edge: `#e09a00` }, { fill: `#ffffff`, ink: `#1f2937`, edge: `#868e96` }, { fill: `#f0c0e0`, ink: `#1f2937`, edge: `#d9a3c6` }];
function oie(e17, t10) {
  let n10 = parseInt(e17.slice(1), 16), r10 = (e18) => Math.round(255 - (255 - e18) * t10).toString(16).padStart(2, `0`);
  return `#${r10(n10 >> 16 & 255)}${r10(n10 >> 8 & 255)}${r10(n10 & 255)}`;
}
var rp = [`Montag`, `Dienstag`, `Mittwoch`, `Donnerstag`, `Freitag`, `Samstag`, `Sonntag`];
var ip = `#1f2937`;
var ap = `#2b6cb0`;
var op = (e17 = `plan`) => ({ title: e17 === `duty` ? `Unser Dienstplan` : `Mein Wochenplan`, mode: e17, days: 7, colors: true, plan: [[{ text: `Arbeit`, time: `8:00` }, { text: `Einkaufen`, time: `16:00` }], [{ text: `Arbeit`, time: `8:00` }, { text: `Sport`, time: `18:00` }], [{ text: `Arbeit`, time: `8:00` }, { text: `W\xE4sche waschen`, time: `17:00` }], [{ text: `Arbeit`, time: `8:00` }, { text: `Arzt`, time: `15:30` }], [{ text: `Arbeit`, time: `8:00` }, { text: `Zimmer putzen`, time: `16:00` }], [{ text: `Freunde treffen`, time: `14:00` }], [{ text: `Familie besuchen`, time: `11:00` }]], duties: [{ text: `Tisch decken` }, { text: `Sp\xFClmaschine` }, { text: `M\xFCll rausbringen` }, { text: `Blumen gie\xDFen` }], names: [`Anna`, `Ben`, `Cem`, `Dana`] });
function sp(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (e18) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, r11 = typeof n11.text == `string` ? n11.text.slice(0, 60) : ``, i11 = typeof n11.time == `string` && n11.time.trim() ? n11.time.slice(0, 12) : void 0, a10 = t10(n11.img);
    return r11 || a10 ? [{ text: r11, ...i11 ? { time: i11 } : {}, ...a10 ? { img: a10 } : {} }] : [];
  }, i10 = rp.map((e18, t11) => Array.isArray(n10.plan) && Array.isArray(n10.plan[t11]) ? n10.plan[t11].slice(0, 6).flatMap(r10) : []);
  return { title: typeof n10.title == `string` ? n10.title.slice(0, 80) : ``, mode: n10.mode === `duty` ? `duty` : `plan`, days: n10.days === 5 ? 5 : 7, colors: n10.colors !== false, plan: i10, duties: (Array.isArray(n10.duties) ? n10.duties : []).slice(0, 8).flatMap(r10), names: (Array.isArray(n10.names) ? n10.names : []).filter((e18) => typeof e18 == `string` && !!e18.trim()).slice(0, 16).map((e18) => e18.slice(0, 24)) };
}
var lp = (e17) => typeof e17 == `string` ? e17 : void 0;
function sie(e17) {
  let t10 = new Date(Date.UTC(e17.getFullYear(), e17.getMonth(), e17.getDate())), n10 = t10.getUTCDay() || 7;
  t10.setUTCDate(t10.getUTCDate() + 4 - n10);
  let r10 = new Date(Date.UTC(t10.getUTCFullYear(), 0, 1));
  return { week: Math.ceil(((t10.getTime() - r10.getTime()) / 864e5 + 1) / 7), monday: new Date(e17.getFullYear(), e17.getMonth(), e17.getDate() - (e17.getDay() + 6) % 7) };
}
var cie = (e17) => Math.floor((sie(e17).monday.getTime() - new Date(2024, 0, 1).getTime()) / 6048e5 + 0.5);
function up(e17, t10 = 0, n10 = /* @__PURE__ */ new Date()) {
  let r10 = e17.names.length;
  if (!r10) return e17.duties.map(() => ``);
  let i10 = cie(n10) + t10;
  return e17.duties.map((t11, n11) => e17.names[((n11 + i10) % r10 + r10) % r10]);
}
var dp = /* @__PURE__ */ new Map();
var uie = (e17) => `${e17.getDate()}.${e17.getMonth() + 1}.`;
function die(e17, t10, n10) {
  let r10 = sp(e17.week, lp), i10 = Math.max(700, e17.w), a10 = Math.max(400, e17.h), o10 = [], s10 = `<rect x="0" y="0" width="${i10}" height="${a10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`, c10 = Ko(r10.title || (r10.mode === `duty` ? `Dienstplan` : `Wochenplan`), i10 * 0.6, 56, 40, 20, 1);
  s10 += qo(c10.lines, 30, 50, c10.size, `font-weight="700" fill="${ip}"`, `start`);
  let l10 = /* @__PURE__ */ new Date();
  if (r10.mode === `plan`) {
    let e18 = (l10.getDay() + 6) % 7, c11 = r10.days, u10 = (i10 - 40 - (c11 - 1) * 10) / c11;
    for (let i11 = 0; i11 < c11; i11++) {
      let c12 = 20 + i11 * (u10 + 10), l11 = t10 && i11 === e18, d10 = r10.colors ? np[i11] : void 0, f10 = a10 - 90 - 20;
      s10 += d10 ? `<rect x="${A(c12)}" y="90" width="${A(u10)}" height="${A(f10)}" rx="12" fill="${oie(d10.fill, 0.13)}" stroke="${oie(d10.edge, 0.55)}" stroke-width="2"/>` : `<rect x="${A(c12)}" y="90" width="${A(u10)}" height="${A(f10)}" rx="12" fill="${l11 ? `#e7f5ff` : `#f8fafc`}" stroke="${l11 ? ap : `#e2e8f0`}" stroke-width="${l11 ? 5 : 2}"/>`;
      let p10 = u10 < 150 ? rp[i11].slice(0, 2) : rp[i11], m10 = d10 ? `fill="${d10.fill}" stroke="${d10.edge}" stroke-width="2"` : `fill="${l11 ? ap : i11 >= 5 ? `#94a3b8` : `#475569`}"`;
      s10 += `<g${Vo(t10, `d:${i11}`)}><rect x="${A(c12)}" y="90" width="${A(u10)}" height="56" rx="12" ${m10}/><text x="${A(c12 + u10 / 2)}" y="127" text-anchor="middle" font-family="${j}" font-size="${A(Math.min(26, u10 / 6))}" font-weight="700" fill="${d10 ? d10.ink : `#ffffff`}">${Bo(p10)}</text></g>`, l11 && d10 && (s10 += `<rect x="${A(c12)}" y="90" width="${A(u10)}" height="${A(f10)}" rx="12" fill="none" stroke="${ap}" stroke-width="6" pointer-events="none"/>`), l11 && (s10 += `<text x="${A(c12 + u10 / 2)}" y="82" text-anchor="middle" font-family="${j}" font-size="20" font-weight="700" fill="${ap}">Heute</text>`);
      let h10 = r10.plan[i11], g10 = Math.min(170, (a10 - 90 - 76 - h10.length * 8) / Math.max(1, h10.length));
      h10.forEach((e19, r11) => {
        let a11 = 154 + r11 * (g10 + 8);
        s10 += `<g${Vo(t10, `e:${i11}:${r11}`)}><rect x="${A(c12 + 6)}" y="${A(a11)}" width="${A(u10 - 12)}" height="${A(g10)}" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>`;
        let l12 = a11 + 8;
        e19.time && (s10 += `<text x="${A(c12 + u10 / 2)}" y="${A(a11 + 26)}" text-anchor="middle" font-family="${j}" font-size="20" font-weight="700" fill="${ap}">${Bo(e19.time)}</text>`, l12 = a11 + 32);
        let d11 = Math.min(46, g10 * 0.32);
        e19.img && o10.push({ src: n10(e19.img) ?? ``, x: c12 + 12, y: l12, w: u10 - 24, h: Math.max(10, a11 + g10 - d11 - l12 - 4) });
        let f11 = Ko(e19.text, u10 - 20, e19.img ? d11 : a11 + g10 - l12 - 6, 22, 12, 2);
        s10 += qo(f11.lines, c12 + u10 / 2, e19.img ? a11 + g10 - d11 / 2 - 4 : (l12 + a11 + g10) / 2, f11.size, `fill="${ip}"`) + `</g>`;
      });
    }
  } else {
    let c11 = t10 ? dp.get(e17.id) ?? 0 : 0, { week: u10, monday: d10 } = sie(new Date(l10.getTime() + c11 * 7 * 864e5)), f10 = new Date(d10.getTime() + 5184e5), p10 = `${c11 === 0 ? `Diese Woche` : c11 === 1 ? `N\xE4chste Woche` : c11 === -1 ? `Letzte Woche` : `Woche ${u10}`} \xB7 ${uie(d10)}\u2013${uie(f10)}`;
    s10 += `<text x="${i10 - 30 - (t10 ? 130 : 0)}" y="56" text-anchor="end" font-family="${j}" font-size="26" font-weight="700" fill="${c11 === 0 ? ap : `#475569`}">${Bo(p10)}</text>`, t10 && (s10 += `<g${Vo(t10, `prev`)}><title>Woche davor</title><circle cx="${i10 - 110}" cy="47" r="26" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/><path d="M${i10 - 104} 35l-12 12 12 12" fill="none" stroke="#475569" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>`, s10 += `<g${Vo(t10, `next`)}><title>Woche danach</title><circle cx="${i10 - 50}" cy="47" r="26" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/><path d="M${i10 - 56} 35l12 12-12 12" fill="none" stroke="#475569" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>`);
    let m10 = up(r10, c11), h10 = r10.duties.length, g10 = r10.names.filter((e18) => !m10.includes(e18)), _10 = Math.min(120, (a10 - 96 - (g10.length ? 70 : 20)) / Math.max(1, h10));
    r10.duties.forEach((e18, r11) => {
      let a11 = 96 + r11 * _10;
      s10 += `<g${Vo(t10, `u:${r11}`)}><rect x="20" y="${A(a11 + 4)}" width="${i10 - 40}" height="${A(_10 - 8)}" rx="12" fill="${r11 % 2 ? `#f8fafc` : `#ffffff`}" stroke="#e2e8f0" stroke-width="2"/>`;
      let c12 = 40;
      e18.img && (o10.push({ src: n10(e18.img) ?? ``, x: 30, y: a11 + 10, w: _10 - 20, h: _10 - 20 }), c12 = 30 + _10);
      let l11 = Ko(e18.text, i10 * 0.5 - c12, _10 - 16, 32, 16, 2);
      s10 += qo(l11.lines, c12, a11 + _10 / 2, l11.size, `fill="${ip}"`, `start`), s10 += `<path d="M${A(i10 * 0.55)} ${A(a11 + _10 / 2)}h40" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/><path d="M${A(i10 * 0.55 + 32)} ${A(a11 + _10 / 2 - 10)}l12 10-12 10" fill="none" stroke="#94a3b8" stroke-width="4"/>`;
      let u11 = Ko(m10[r11] || `\u2013`, i10 * 0.4 - 60, _10 - 16, 40, 18, 1);
      s10 += qo(u11.lines, i10 * 0.55 + 70, a11 + _10 / 2, u11.size, `font-weight="700" fill="${ap}"`, `start`) + `</g>`;
    }), g10.length && (s10 += `<text x="40" y="${A(a10 - 34)}" font-family="${j}" font-size="24" fill="#475569">${Bo(`Frei: ${g10.join(`, `)}`)}</text>`), h10 || (s10 += qo([`Noch keine Dienste \u2013 tippe auf \u201EEinstellen\u201C.`], i10 / 2, a10 / 2, 28, `fill="#868e96"`));
  }
  return { body: s10, vw: i10, vh: a10, pics: o10.filter((e18) => e18.src) };
}
var fie = (e17) => {
  let t10 = /^(\d{1,2})[:.](\d{2})$/.exec(e17.trim());
  return t10 ? t10[2] === `00` ? `${Number(t10[1])} Uhr` : `${Number(t10[1])} Uhr ${t10[2]}` : e17;
};
var fp = (e17) => e17.time ? `${fie(e17.time)}: ${e17.text}` : e17.text;
function pie(e17) {
  let t10 = sp(e17.week, lp);
  if (t10.mode === `duty`) {
    let n11 = up(t10, dp.get(e17.id) ?? 0);
    return `${t10.title || `Dienstplan`}. ${t10.duties.map((e18, t11) => `${e18.text}: ${n11[t11]}.`).join(` `)}`;
  }
  let n10 = ((/* @__PURE__ */ new Date()).getDay() + 6) % 7, r10 = t10.plan[n10] ?? [];
  return `${t10.title || `Wochenplan`}. Heute ist ${rp[n10]}. ${r10.map(fp).join(`. `)}`;
}
var pp = Uo({ cls: `lh-ct-week`, view: die, label: pie, hit(e17, t10) {
  let n10 = pp.item(e17);
  if (!n10) return;
  let r10 = sp(n10.week, lp);
  if (t10 === `prev` || t10 === `next`) dp.set(e17, (dp.get(e17) ?? 0) + (t10 === `next` ? 1 : -1)), _i(), pp.redraw(e17);
  else if (t10.startsWith(`d:`)) {
    let e18 = Number(t10.slice(2)), n11 = r10.plan[e18];
    M(`${rp[e18]}. ${n11.length ? n11.map(fp).join(`. `) : `Nichts geplant.`}`);
  } else if (t10.startsWith(`e:`)) {
    let [, e18, n11] = t10.split(`:`).map(Number), i10 = r10.plan[e18]?.[n11];
    i10 && M(`${rp[e18]}, ${fp(i10)}`);
  } else if (t10.startsWith(`u:`)) {
    let n11 = Number(t10.slice(2)), i10 = up(r10, dp.get(e17) ?? 0);
    r10.duties[n11] && M(`${r10.duties[n11].text}: ${i10[n11] || `niemand`}.`);
  }
} });
var mie = pp.draw;
var mp = [{ label: `ruhig`, say: `Ich bin ruhig.`, color: `#2f9e44` }, { label: `etwas unruhig`, say: `Ich bin etwas unruhig.`, color: `#94d82d` }, { label: `angespannt`, say: `Ich bin angespannt.`, color: `#fcc419` }, { label: `sehr angespannt`, say: `Ich bin sehr angespannt.`, color: `#fd7e14` }, { label: `zu viel`, say: `Es ist mir zu viel.`, color: `#e03131` }];
var hp = [[`Pause machen`, `Ich mache eine Pause.`, `Pause`], [`tief atmen`, `Ich atme tief ein und aus.`, `atmen`], [`Kopfh\xF6rer`, `Ich setze meine Kopfh\xF6rer auf.`, `Kopfh\xF6rer`], [`Bescheid sagen`, `Ich sage Bescheid, dass es mir zu viel ist.`, `sprechen`], [`frische Luft`, `Ich gehe kurz an die frische Luft.`, `drau\xDFen`], [`etwas trinken`, `Ich trinke etwas.`, `trinken`], [`bewegen`, `Ich bewege mich ein bisschen.`, `gehen`], [`Ruheraum`, `Ich gehe in den Ruheraum.`, `Ruhe`]];
var hie = () => ({ title: `Wie geht es mir gerade?`, helps: hp.slice(0, 6).map(([e17, t10]) => ({ text: e17, say: t10 })) });
function gp(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (Array.isArray(n10.helps) ? n10.helps : []).slice(0, 8).flatMap((e18) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, r11 = typeof n11.text == `string` ? n11.text.slice(0, 40) : ``, i10 = typeof n11.say == `string` && n11.say.trim() ? n11.say.slice(0, 120) : void 0, a10 = t10(n11.img);
    return r11 ? [{ text: r11, ...i10 ? { say: i10 } : {}, ...a10 ? { img: a10 } : {} }] : [];
  });
  return { title: typeof n10.title == `string` ? n10.title.slice(0, 80) : hie().title, helps: r10 };
}
var vp = (e17) => typeof e17 == `string` ? e17 : void 0;
var yp = /* @__PURE__ */ new Map();
var bp = `#1f2937`;
function _ie(e17, t10, n10) {
  let r10 = gp(e17.stress, vp), i10 = t10 ? yp.get(e17.id) ?? -1 : -1, a10 = Math.max(700, e17.w), o10 = Math.max(450, e17.h), s10 = [], c10 = `<rect x="0" y="0" width="${a10}" height="${o10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`, l10 = Ko(r10.title, a10 - 60, 56, 40, 20, 1);
  c10 += qo(l10.lines, 30, 50, l10.size, `font-weight="700" fill="${bp}"`, `start`);
  let u10 = Math.min(330, a10 * 0.3), d10 = (o10 - 90 - 30) / 5;
  mp.forEach((e18, n11) => {
    let r11 = 4 - n11, a11 = 90 + n11 * d10, o11 = i10 === r11, s11 = mp[r11];
    c10 += `<g${Vo(t10, `l:${r11}`)}><rect x="30" y="${A(a11 + 4)}" width="${A(u10)}" height="${A(d10 - 8)}" rx="14" fill="${o11 ? s11.color : `#ffffff`}" stroke="${s11.color}" stroke-width="${o11 ? 6 : 4}"/>`, c10 += `<circle cx="${A(70)}" cy="${A(a11 + d10 / 2)}" r="${A(Math.min(24, d10 * 0.28))}" fill="${s11.color}" stroke="${o11 ? `#ffffff` : `none`}" stroke-width="3"/>`;
    let l11 = Ko(s11.label, u10 - 90, d10 - 16, 30, 16, 2);
    c10 += qo(l11.lines, 106, a11 + d10 / 2, l11.size, `font-weight="700" fill="${o11 && r11 >= 3 ? `#ffffff` : bp}"`, `start`) + `</g>`;
  });
  let f10 = 30 + u10 + 40, p10 = a10 - f10 - 30, m10 = i10 >= 2;
  c10 += `<text x="${A(f10)}" y="116" font-family="${j}" font-size="30" font-weight="700" fill="${m10 ? `#e8590c` : bp}">Was hilft mir?</text>`;
  let h10 = r10.helps.length, g10 = h10 > 4 ? 2 : 1, _10 = Math.ceil(h10 / g10), v10 = (p10 - (g10 - 1) * 16) / g10, y10 = Math.min(150, (o10 - 90 - 70) / Math.max(1, _10) - 12);
  return r10.helps.forEach((e18, r11) => {
    let i11 = f10 + r11 % g10 * (v10 + 16), a11 = 140 + Math.floor(r11 / g10) * (y10 + 12);
    c10 += `<g${Vo(t10, `h:${r11}`)}><rect x="${A(i11)}" y="${A(a11)}" width="${A(v10)}" height="${A(y10)}" rx="14" fill="${m10 ? `#fff4e6` : `#f8fafc`}" stroke="${m10 ? `#fd7e14` : `#e2e8f0`}" stroke-width="${m10 ? 4 : 2}"/>`;
    let o11 = i11 + 18;
    e18.img && (s10.push({ src: n10(e18.img) ?? ``, x: i11 + 8, y: a11 + 8, w: y10 - 16, h: y10 - 16 }), o11 = i11 + y10 + 4);
    let l11 = Ko(e18.text, i11 + v10 - o11 - 12, y10 - 16, 30, 16, 2);
    c10 += qo(l11.lines, o11, a11 + y10 / 2, l11.size, `fill="${bp}"`, `start`) + `</g>`;
  }), h10 || (c10 += qo([`Noch keine Ideen \u2013 tippe auf \u201EEinstellen\u201C.`], f10 + p10 / 2, o10 / 2, 26, `fill="#868e96"`)), { body: c10, vw: a10, vh: o10, pics: s10.filter((e18) => e18.src) };
}
function vie(e17) {
  let t10 = gp(e17.stress, vp), n10 = yp.get(e17.id);
  return `${t10.title}${n10 === void 0 ? `` : ` ${mp[n10].say}`} Was hilft mir? ${t10.helps.map((e18) => e18.text).join(`, `)}.`;
}
var xp = Uo({ cls: `lh-ct-stress`, view: _ie, label: vie, hit(e17, t10) {
  let n10 = xp.item(e17);
  if (!n10) return;
  let r10 = gp(n10.stress, vp);
  if (t10.startsWith(`l:`)) {
    let n11 = Number(t10.slice(2));
    yp.get(e17) === n11 ? yp.delete(e17) : (yp.set(e17, n11), _i(), M(n11 >= 2 ? `${mp[n11].say} Was hilft mir?` : mp[n11].say)), xp.redraw(e17);
  } else if (t10.startsWith(`h:`)) {
    let e18 = r10.helps[Number(t10.slice(2))];
    e18 && M(e18.say ?? e18.text);
  }
} });
var yie = xp.draw;
var Sp = () => ({ title: `Weihnachtskarten f\xFCr den Basar`, one: `Karte`, many: `Karten`, goal: 40, count: 0 });
function Cp(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = (e18, t11, n11, r11) => typeof e18 == `number` && Number.isFinite(e18) ? Math.max(t11, Math.min(n11, Math.round(e18))) : r11, r10 = (e18, t11, n11) => typeof e18 == `string` && e18.trim() ? e18.slice(0, t11) : n11;
  return { title: typeof t10.title == `string` ? t10.title.slice(0, 80) : Sp().title, one: r10(t10.one, 24, `St\xFCck`), many: r10(t10.many, 24, `St\xFCck`), goal: n10(t10.goal, 1, 999, 20), count: n10(t10.count, 0, 999, 0) };
}
var bie = `#1f2937`;
var xie = `#2b6cb0`;
var wp = /* @__PURE__ */ new Map();
var Tp = null;
function Sie(e17) {
  Tp = e17;
}
function Ep(e17) {
  let t10 = Cp(e17.pc), n10 = wp.get(e17.id);
  return n10 && n10.saved === t10.count || wp.set(e17.id, n10 = { saved: t10.count, count: t10.count, times: n10?.times ?? [] }), n10;
}
function wie(e17) {
  let t10 = e17.slice(-7).map((e18, t11, n11) => t11 ? e18 - n11[t11 - 1] : 0).slice(1);
  if (!t10.length) return 0;
  let n10 = [...t10].sort((e18, t11) => e18 - t11)[Math.floor(t10.length / 2)], r10 = t10.filter((e18) => e18 <= n10 * 3);
  return r10.reduce((e18, t11) => e18 + t11, 0) / r10.length;
}
var Tie = (e17) => `${Math.floor(e17 / 6e4)}:${String(Math.round(e17 % 6e4 / 1e3)).padStart(2, `0`)}`;
function Eie(e17, t10) {
  let n10 = Cp(e17.pc), r10 = t10 ? Ep(e17) : null, i10 = r10?.count ?? n10.count, a10 = Math.max(600, e17.w), o10 = Math.max(400, e17.h), s10 = `<rect x="0" y="0" width="${a10}" height="${o10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`, c10 = Ko(n10.title, a10 - 60, 60, 40, 20, 1);
  s10 += qo(c10.lines, 30, 52, c10.size, `font-weight="700" fill="${bie}"`, `start`);
  let l10 = i10 >= n10.goal;
  s10 += `<text x="${a10 / 2}" y="${A(o10 * 0.36)}" text-anchor="middle" font-family="${j}" font-size="${A(Math.min(150, o10 * 0.2))}" font-weight="700" fill="${l10 ? `#2f9e44` : bie}">${i10}<tspan font-size="${A(Math.min(60, o10 * 0.08))}" fill="#64748b"> von ${n10.goal} ${Bo(n10.many)}</tspan></text>`;
  let u10 = o10 * 0.43, d10 = a10 - 80, f10 = Math.min(46, o10 * 0.07);
  s10 += `<rect x="40" y="${A(u10)}" width="${d10}" height="${A(f10)}" rx="${A(f10 / 2)}" fill="#e2e8f0"/>`;
  let p10 = Math.min(1, i10 / n10.goal);
  if (p10 > 0 && (s10 += `<rect x="40" y="${A(u10)}" width="${A(Math.max(f10, d10 * p10))}" height="${A(f10)}" rx="${A(f10 / 2)}" fill="${l10 ? `#2f9e44` : xie}"/>`), n10.goal <= 60) for (let e18 = 1; e18 < n10.goal; e18++) s10 += `<path d="M${A(40 + d10 * e18 / n10.goal)} ${A(u10 + 4)}v${A(f10 - 8)}" stroke="#ffffff" stroke-width="2" opacity="0.7"/>`;
  let m10 = r10 ? wie(r10.times) : 0, h10 = Math.max(0, n10.goal - i10), g10 = l10 ? `Ziel erreicht.` : m10 ? `1 ${n10.one} in ${Tie(m10)} Minuten \xB7 noch ${h10} ${h10 === 1 ? n10.one : n10.many}, etwa ${Math.max(1, Math.round(m10 * h10 / 6e4))} Minuten` : `Noch ${h10} ${h10 === 1 ? n10.one : n10.many}`;
  if (s10 += `<text x="${a10 / 2}" y="${A(u10 + f10 + 50)}" text-anchor="middle" font-family="${j}" font-size="28" fill="#475569">${Bo(g10)}</text>`, t10) {
    let e18 = o10 * 0.66, n11 = Math.min(150, o10 * 0.24);
    s10 += `<g${Vo(t10, `plus`)}><title>Fertig: ein St\xFCck mehr</title><rect x="${A(a10 / 2 - 260)}" y="${A(e18)}" width="520" height="${A(n11)}" rx="${A(n11 / 2)}" fill="${xie}"/><text x="${a10 / 2}" y="${A(e18 + n11 / 2 + 22)}" text-anchor="middle" font-family="${j}" font-size="60" font-weight="700" fill="#ffffff">+1 fertig</text></g>`, s10 += `<g${Vo(t10, `minus`)}><title>Eins zur\xFCck</title><circle cx="${A(a10 / 2 - 340)}" cy="${A(e18 + n11 / 2)}" r="50" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/><text x="${A(a10 / 2 - 340)}" y="${A(e18 + n11 / 2 + 16)}" text-anchor="middle" font-family="${j}" font-size="44" font-weight="700" fill="#475569">\u22121</text></g>`, i10 && (s10 += `<g${Vo(t10, `reset`)}><title>Von vorn</title><circle cx="${A(a10 / 2 + 340)}" cy="${A(e18 + n11 / 2)}" r="50" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/><path d="M${A(a10 / 2 + 326)} ${A(e18 + n11 / 2 - 8)}a16 16 0 1 1 2 16" fill="none" stroke="#475569" stroke-width="6" stroke-linecap="round"/><path d="M${A(a10 / 2 + 316)} ${A(e18 + n11 / 2 - 18)}l8 14 12-10z" fill="#475569"/></g>`);
  }
  return { body: s10, vw: a10, vh: o10 };
}
function Dp(e17) {
  let t10 = Cp(e17.pc), n10 = wp.get(e17.id)?.count ?? t10.count;
  return `${t10.title}. ${n10} von ${t10.goal} ${t10.many} fertig.`;
}
var Op = Uo({ cls: `lh-ct-pieces`, view: Eie, label: Dp, sounds: true, hit(e17, t10) {
  let n10 = Op.item(e17);
  if (!n10) return;
  let r10 = Cp(n10.pc), i10 = Ep(n10);
  t10 === `plus` ? (i10.count = Math.min(999, i10.count + 1), i10.times.push(Date.now()), i10.count === r10.goal ? (vi(), M(`${r10.goal} ${r10.many}. Ziel erreicht.`)) : (_i(), M(String(i10.count)))) : t10 === `minus` ? (i10.count = Math.max(0, i10.count - 1), i10.times.pop(), _i()) : t10 === `reset` && (i10.count = 0, i10.times = []), Tp?.(e17, i10.count), Op.redraw(e17);
} });
var Die = Op.draw;
var kp = `#1f2937`;
var Oie = [``, `#2f9e44`, `#e03131`, `#f59f00`];
var Ap = [``, `ja`, `nein`, `wei\xDF nicht`];
var jp = [{ id: `barrier`, label: `Barriereanalyse`, title: `Ist der Ort barrierefrei?`, mode: `yesno`, items: [[`Der Eingang hat keine Stufen.`, `Eingang`], [`Die T\xFCr ist breit genug.`, `T\xFCr`], [`Es gibt einen Aufzug.`, `Aufzug`], [`Es gibt eine barrierefreie Toilette.`, `Toilette`], [`Die Schilder sind gut zu lesen.`, `Schild`], [`Die Haltestelle ist in der N\xE4he.`, `Bushaltestelle`], [`Es gibt Sitzpl\xE4tze zum Ausruhen.`, `Bank`], [`Ich wei\xDF, wen ich fragen kann.`, `fragen`]] }, { id: `bike`, label: `Fahrrad-Check`, title: `Ist mein Fahrrad verkehrssicher?`, mode: `yesno`, items: [[`Beide Bremsen funktionieren.`, `Bremse`], [`Das Licht vorne geht.`, `Fahrradlicht`], [`Das R\xFCcklicht geht.`, `R\xFCcklicht`], [`Die Reflektoren sind dran.`, `Reflektor`], [`Die Klingel funktioniert.`, `Fahrradklingel`], [`Die Reifen sind aufgepumpt.`, `Reifen`], [`Der Sattel ist richtig hoch.`, `Sattel`], [`Ich habe meinen Helm.`, `Fahrradhelm`]] }, { id: `leave`, label: `Wohnung verlassen`, title: `Bevor ich die Wohnung verlasse`, mode: `done`, items: [[`Herd ist aus.`, `Herd`], [`Wasser ist zu.`, `Wasserhahn`], [`Fenster sind zu.`, `Fenster`], [`Licht ist aus.`, `Lampe`], [`Schl\xFCssel ist dabei.`, `Schl\xFCssel`], [`Handy ist dabei.`, `Handy`], [`T\xFCr ist abgeschlossen.`, `abschlie\xDFen`]] }, { id: `trip`, label: `Packliste Ausflug`, title: `Was nehme ich mit?`, mode: `done`, items: [[`Ausweis`, `Ausweis`], [`Fahrkarte`, `Fahrkarte`], [`Geldbeutel`, `Geldbeutel`], [`Handy`, `Handy`], [`Trinkflasche`, `Trinkflasche`], [`Brotzeit`, `Brotzeit`], [`Jacke`, `Jacke`], [`Medikamente`, `Medikament`]] }, { id: `kitchen`, label: `Hygiene in der K\xFCche`, title: `Bevor ich koche`, mode: `done`, items: [[`H\xE4nde gewaschen`, `H\xE4nde waschen`], [`Fingern\xE4gel kurz und sauber`, `Fingern\xE4gel`], [`Schmuck abgelegt`, `Ring`], [`Haare zusammengebunden`, `Zopf`], [`Sch\xFCrze an`, `Sch\xFCrze`], [`Arbeitsplatz sauber`, `putzen`]] }, { id: `work`, label: `Arbeitsbeginn`, title: `Bin ich bereit f\xFCr die Arbeit?`, mode: `done`, items: [[`Arbeitskleidung an`, `Arbeitskleidung`], [`Schutzbrille / Geh\xF6rschutz bereit`, `Schutzbrille`], [`Werkzeug vollst\xE4ndig`, `Werkzeug`], [`Arbeitsplatz aufger\xE4umt`, `aufr\xE4umen`], [`Ich wei\xDF, was ich tun soll.`, `Aufgabe`]] }];
function Np(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = (Array.isArray(n10.items) ? n10.items : []).slice(0, 14).flatMap((e18) => {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, r11 = typeof n11.text == `string` ? n11.text.slice(0, 100) : ``, i11 = t10(n11.img);
    return r11 || i11 ? [{ text: r11, ...i11 ? { img: i11 } : {} }] : [];
  }), i10 = n10.mode === `done` ? `done` : `yesno`, a10 = r10.map((e18, t11) => Array.isArray(n10.vals) && [1, 2, 3].includes(n10.vals[t11]) && (i10 === `yesno` || n10.vals[t11] === 1) ? n10.vals[t11] : 0);
  return { title: typeof n10.title == `string` ? n10.title.slice(0, 80) : ``, mode: i10, items: r10, vals: a10 };
}
var Fp = (e17) => typeof e17 == `string` ? e17 : void 0;
var Ip = /* @__PURE__ */ new Map();
var Lp = null;
function kie(e17) {
  Lp = e17;
}
function Rp(e17) {
  let t10 = Np(e17.check, Fp), n10 = JSON.stringify([t10.items.map((e18) => e18.text), t10.vals]), r10 = Ip.get(e17.id);
  return r10 && r10.saved === n10 || Ip.set(e17.id, r10 = { saved: n10, vals: [...t10.vals] }), r10.vals;
}
function jie(e17, t10, n10, r10, i10, a10) {
  let o10 = Oie[r10], s10 = i10 ? `#ffffff` : a10 ? o10 : `#868e96`, c10 = `<circle cx="${A(e17)}" cy="${A(t10)}" r="${A(n10)}" fill="${i10 ? o10 : `#ffffff`}" stroke="${a10 || i10 ? o10 : `#868e96`}" stroke-width="3"/>`, l10 = n10 * 0.45;
  return r10 === 1 && (c10 += `<path d="M${A(e17 - l10)} ${A(t10)}l${A(l10 * 0.7)} ${A(l10 * 0.7)} ${A(l10 * 1.3)}-${A(l10 * 1.4)}" fill="none" stroke="${s10}" stroke-width="${A(n10 * 0.2)}" stroke-linecap="round" stroke-linejoin="round"/>`), r10 === 2 && (c10 += `<path d="M${A(e17 - l10)} ${A(t10 - l10)}L${A(e17 + l10)} ${A(t10 + l10)}M${A(e17 + l10)} ${A(t10 - l10)}L${A(e17 - l10)} ${A(t10 + l10)}" stroke="${s10}" stroke-width="${A(n10 * 0.2)}" stroke-linecap="round"/>`), r10 === 3 && (c10 += `<text x="${A(e17)}" y="${A(t10 + n10 * 0.38)}" text-anchor="middle" font-family="${j}" font-size="${A(n10 * 1.15)}" font-weight="700" fill="${s10}">?</text>`), c10;
}
function Mie(e17, t10, n10) {
  let r10 = Np(e17.check, Fp), i10 = t10 ? Rp(e17) : r10.vals, a10 = Math.max(500, e17.w), o10 = Math.max(300, e17.h), s10 = r10.items.length, c10 = [], l10 = `<rect x="0" y="0" width="${a10}" height="${o10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`, u10 = r10.title ? 92 : 24;
  if (r10.title) {
    let e18 = Ko(r10.title, a10 - 60, 56, 40, 20, 1);
    l10 += qo(e18.lines, 30, 50, e18.size, `font-weight="700" fill="${kp}"`, `start`);
  }
  let d10 = s10 > 7 ? 2 : 1, f10 = Math.ceil(s10 / d10), p10 = (a10 - 40 - (d10 - 1) * 24) / d10, m10 = Math.min(110, (o10 - u10 - 64) / Math.max(1, f10)), h10 = r10.mode === `yesno` ? 3 : 1, g10 = Math.min(26, m10 * 0.3), _10 = h10 * (g10 * 2 + 12) + 8;
  r10.items.forEach((e18, a11) => {
    let o11 = 20 + Math.floor(a11 / f10) * (p10 + 24), s11 = u10 + a11 % f10 * m10, d11 = s11 + m10 / 2, v11 = i10[a11] ?? 0;
    l10 += `<rect x="${A(o11)}" y="${A(s11 + 4)}" width="${A(p10)}" height="${A(m10 - 8)}" rx="12" fill="${v11 === 1 && r10.mode === `done` ? `#ebfbee` : `#f8fafc`}" stroke="#e2e8f0" stroke-width="2"/>`;
    let y11 = m10 - 20, b10 = o11 + 16;
    e18.img && (c10.push({ src: n10(e18.img) ?? ``, x: o11 + 10, y: s11 + 10, w: y11, h: y11, dim: r10.mode === `done` && v11 === 1 }), b10 = o11 + y11 + 22);
    let x10 = o11 + p10 - _10 - b10 - 8, S10 = Ko(e18.text, x10, m10 - 16, 30, 14, 2);
    l10 += `<g${Vo(t10, `t:${a11}`)}><rect x="${A(o11)}" y="${A(s11 + 4)}" width="${A(p10 - _10)}" height="${A(m10 - 8)}" fill="transparent"/>${qo(S10.lines, b10, d11, S10.size, `fill="${kp}"${r10.mode === `done` && v11 === 1 ? ` opacity="0.6"` : ``}`, `start`)}</g>`;
    for (let e19 = 1; e19 <= h10; e19++) {
      let n11 = o11 + p10 - _10 + 8 + (e19 - 1) * (g10 * 2 + 12) + g10;
      l10 += `<g${Vo(t10, `m:${a11}:${e19}`)}><title>${Ap[e19]}</title><circle cx="${A(n11)}" cy="${A(d11)}" r="${A(g10 + 6)}" fill="transparent"/>${jie(n11, d11, g10, e19, v11 === e19, t10)}</g>`;
    }
  }), s10 || (l10 += qo([`Noch keine Punkte \u2013 tippe auf \u201EEinstellen\u201C.`], a10 / 2, o10 / 2, 30, `fill="#868e96"`));
  let v10 = o10 - 32 + 8, y10 = (e18) => i10.filter((t11) => t11 === e18).length;
  if (r10.mode === `done`) {
    let e18 = s10 > 0 && y10(1) === s10;
    l10 += `<text x="30" y="${A(v10)}" font-family="${j}" font-size="26" font-weight="700" fill="${e18 ? `#2f9e44` : kp}">${e18 ? `Alles erledigt.` : `${y10(1)} von ${s10} erledigt`}</text>`;
  } else l10 += `<text x="30" y="${A(v10)}" font-family="${j}" font-size="26" font-weight="700" fill="${kp}">${Bo(`\u2713 ja: ${y10(1)}   \u2717 nein: ${y10(2)}   ? wei\xDF nicht: ${y10(3)}   offen: ${s10 - y10(1) - y10(2) - y10(3)}`)}</text>`;
  return { body: l10, vw: a10, vh: o10, pics: c10.filter((e18) => e18.src) };
}
function zp(e17) {
  let t10 = Np(e17.check, Fp), n10 = Ip.get(e17.id)?.vals ?? t10.vals, r10 = t10.items.map((e18, r11) => `${e18.text}${n10[r11] ? t10.mode === `done` ? ` Erledigt.` : ` ${Ap[n10[r11]]}.` : ``}`);
  return `${t10.title || `Checkliste`}. ${r10.join(` `)}`;
}
var Bp = Uo({ cls: `lh-ct-check`, view: Mie, label: zp, hit(e17, t10) {
  let n10 = Bp.item(e17);
  if (!n10) return;
  let r10 = Np(n10.check, Fp), i10 = Rp(n10);
  if (t10.startsWith(`t:`)) {
    M(r10.items[Number(t10.slice(2))]?.text ?? ``);
    return;
  }
  if (!t10.startsWith(`m:`)) return;
  let [, a10, o10] = t10.split(`:`).map(Number);
  i10[a10] = i10[a10] === o10 ? 0 : o10, _i(), Lp?.(e17, [...i10]), r10.mode === `done` && i10.filter((e18) => e18 === 1).length === r10.items.length ? (vi(), M(`Alles erledigt.`)) : i10[a10] && r10.mode === `yesno` && M(Ap[o10]), Bp.redraw(e17);
} });
var Nie = Bp.draw;
var Vp = [``, `klappt gut`, `klappt teilweise`, `klappt noch nicht`];
var Pie = [``, `#2f9e44`, `#f59f00`, `#e8590c`];
var Hp = `#1f2937`;
var Up = [{ id: `work`, label: `Arbeitsverhalten`, items: [`Ich bin p\xFCnktlich.`, `Ich arbeite sorgf\xE4ltig.`, `Ich arbeite ausdauernd.`, `Ich arbeite in einem guten Tempo.`, `Ich halte Ordnung am Arbeitsplatz.`, `Ich halte die Sicherheitsregeln ein.`, `Ich frage, wenn ich etwas nicht wei\xDF.`, `Ich arbeite selbstst\xE4ndig.`] }, { id: `social`, label: `Sozialverhalten`, items: [`Ich bin h\xF6flich und gr\xFC\xDFe.`, `Ich sage \u201ESie\u201C zu Erwachsenen.`, `Ich h\xF6re zu.`, `Ich arbeite gut im Team.`, `Ich helfe anderen.`, `Ich nehme Kritik an.`, `Ich bleibe bei Streit ruhig.`] }, { id: `day`, label: `Praxistag`, items: [`Ich war p\xFCnktlich da.`, `Ich hatte passende Kleidung.`, `Ich habe meine Aufgabe verstanden.`, `Ich habe bis zum Ende gearbeitet.`, `Mein Ergebnis ist ordentlich.`, `Ich habe aufger\xE4umt.`] }, { id: `home`, label: `Wohnen`, items: [`Ich halte mein Zimmer ordentlich.`, `Ich mache meine Dienste.`, `Ich kaufe allein ein.`, `Ich koche einfache Gerichte.`, `Ich wasche meine W\xE4sche.`, `Ich halte die Nachtruhe ein.`] }, { id: `result`, label: `Meine Arbeit`, items: [`Ich habe die Aufgabe verstanden.`, `Ich habe sorgf\xE4ltig gearbeitet.`, `Mein Ergebnis sieht gut aus.`, `Ich war rechtzeitig fertig.`, `Ich habe Hilfe geholt, wenn ich sie gebraucht habe.`, `Ich habe aufger\xE4umt.`] }, { id: `dish`, label: `Speise`, items: [`Es sieht lecker aus.`, `Es schmeckt gut.`, `Ich habe mich an das Rezept gehalten.`, `Ich habe sauber gearbeitet.`, `Ich war rechtzeitig fertig.`, `Ich habe aufger\xE4umt.`] }, { id: `piece`, label: `Werkst\xFCck`, items: [`Ich habe genau gemessen.`, `Ich habe sauber gearbeitet.`, `Mein Werkst\xFCck h\xE4lt gut.`, `Es sieht sch\xF6n aus.`, `Ich habe das Werkzeug richtig benutzt.`, `Ich habe aufger\xE4umt.`] }, { id: `art`, label: `Bild`, items: [`Mein Bild passt zum Thema.`, `Ich habe die ganze Fl\xE4che gestaltet.`, `Die Farben passen gut zusammen.`, `Ich habe sorgf\xE4ltig gearbeitet.`, `Ich hatte eine eigene Idee.`, `Ich habe aufger\xE4umt.`] }];
var Wp = () => ({ title: `Selbst- und Fremdeinsch\xE4tzung`, cols: 2, a: `Ich`, b: `Betreuer/in`, items: Up[0].items, va: [], vb: [] });
function Gp(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = (Array.isArray(t10.items) ? t10.items : []).filter((e18) => typeof e18 == `string` && !!e18.trim()).slice(0, 14).map((e18) => e18.slice(0, 80)), r10 = (e18) => n10.map((t11, n11) => Array.isArray(e18) && [1, 2, 3].includes(e18[n11]) ? e18[n11] : 0);
  return { title: typeof t10.title == `string` ? t10.title.slice(0, 80) : Wp().title, cols: t10.cols === 1 ? 1 : 2, a: typeof t10.a == `string` && t10.a.trim() ? t10.a.slice(0, 24) : `Ich`, b: typeof t10.b == `string` && t10.b.trim() ? t10.b.slice(0, 24) : `Betreuer/in`, items: n10.length ? n10 : Wp().items, va: r10(t10.va), vb: r10(t10.vb) };
}
var Kp = /* @__PURE__ */ new Map();
var qp = null;
function Iie(e17) {
  qp = e17;
}
function Jp(e17) {
  let t10 = Gp(e17.rate), n10 = JSON.stringify([t10.items, t10.va, t10.vb]), r10 = Kp.get(e17.id);
  return r10 && r10.saved === n10 || Kp.set(e17.id, r10 = { saved: n10, va: [...t10.va], vb: [...t10.vb] }), r10;
}
function Yp(e17, t10, n10, r10, i10, a10) {
  let o10 = Pie[r10], s10 = i10 ? o10 : `#ffffff`, c10 = i10 ? `#ffffff` : a10 ? o10 : `#868e96`, l10 = t10 - n10 * 0.22, u10 = `<circle cx="${A(e17)}" cy="${A(t10)}" r="${A(n10)}" fill="${s10}" stroke="${a10 ? o10 : `#868e96`}" stroke-width="${A(Math.max(2, n10 * 0.1))}"/>`;
  u10 += `<circle cx="${A(e17 - n10 * 0.33)}" cy="${A(l10)}" r="${A(n10 * 0.1)}" fill="${c10}"/><circle cx="${A(e17 + n10 * 0.33)}" cy="${A(l10)}" r="${A(n10 * 0.1)}" fill="${c10}"/>`;
  let d10 = t10 + n10 * 0.3, f10 = r10 === 1 ? `M${A(e17 - n10 * 0.42)} ${A(d10 - n10 * 0.08)}Q${A(e17)} ${A(d10 + n10 * 0.34)} ${A(e17 + n10 * 0.42)} ${A(d10 - n10 * 0.08)}` : r10 === 2 ? `M${A(e17 - n10 * 0.38)} ${A(d10)}H${A(e17 + n10 * 0.38)}` : `M${A(e17 - n10 * 0.38)} ${A(d10 + n10 * 0.14)}Q${A(e17)} ${A(d10 - n10 * 0.16)} ${A(e17 + n10 * 0.38)} ${A(d10 + n10 * 0.14)}`;
  return u10 + `<path d="${f10}" fill="none" stroke="${c10}" stroke-width="${A(Math.max(2, n10 * 0.1))}" stroke-linecap="round"/>`;
}
function Rie(e17, t10) {
  let n10 = Gp(e17.rate), r10 = t10 ? Jp(e17) : null, i10 = r10?.va ?? n10.va, a10 = r10?.vb ?? n10.vb, o10 = Math.max(700, e17.w), s10 = Math.max(400, e17.h), c10 = n10.items.length, l10 = `<rect x="0" y="0" width="${o10}" height="${s10}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`, u10 = Ko(n10.title, o10 - 60, 56, 40, 20, 1);
  l10 += qo(u10.lines, 30, 48, u10.size, `font-weight="700" fill="${Hp}"`, `start`);
  let d10 = o10 - 40 - n10.cols * 250, f10 = Math.min(92, (s10 - 132 - 70) / c10), p10 = Math.min(28, f10 * 0.34);
  for (let e18 = 0; e18 < n10.cols; e18++) {
    let t11 = 20 + d10 + e18 * 250 + 125;
    l10 += `<rect x="${A(20 + d10 + e18 * 250 + 6)}" y="86" width="238" height="${A(s10 - 86 - 70 + 6)}" rx="14" fill="${e18 ? `#f1f5f9` : `#f8fafc`}"/>`, l10 += `<text x="${A(t11)}" y="118" text-anchor="middle" font-family="${j}" font-size="26" font-weight="700" fill="${Hp}">${Bo(e18 ? n10.b : n10.a)}</text>`;
  }
  let m10 = 0, h10 = 0;
  n10.items.forEach((e18, r11) => {
    let s11 = 132 + r11 * f10, c11 = s11 + f10 / 2;
    r11 % 2 == 0 && (l10 += `<rect x="14" y="${A(s11)}" width="${o10 - 28}" height="${A(f10)}" fill="#0f172a" opacity="0.025"/>`);
    let u11 = Ko(e18, d10 - 30, f10 - 8, 28, 16, 2);
    l10 += `<g${Vo(t10, `l:${r11}`)}><rect x="20" y="${A(s11)}" width="${A(d10)}" height="${A(f10)}" fill="transparent"/>${qo(u11.lines, 34, c11, u11.size, `fill="${Hp}"`, `start`)}</g>`;
    for (let e19 = 0; e19 < n10.cols; e19++) {
      let n11 = e19 ? a10 : i10;
      for (let i11 = 1; i11 <= 3; i11++) {
        let a11 = 20 + d10 + e19 * 250 + 125 + (i11 - 2) * (p10 * 2 + 14);
        l10 += `<g${Vo(t10, `f:${e19}:${r11}:${i11}`)}><title>${Bo(Vp[i11])}</title><circle cx="${A(a11)}" cy="${A(c11)}" r="${A(p10 + 6)}" fill="transparent"/>${Yp(a11, c11, p10, i11, n11[r11] === i11, t10 || n11[r11] === i11)}</g>`;
      }
    }
    n10.cols === 2 && i10[r11] && a10[r11] && (h10++, i10[r11] === a10[r11] ? m10++ : l10 += `<text x="${o10 - 12}" y="${A(c11 + 10)}" text-anchor="end" font-family="${j}" font-size="28" font-weight="700" fill="#e8590c">\u2260</text>`);
  });
  let g10 = s10 - 35;
  return [1, 2, 3].forEach((e18, t11) => {
    let n11 = 30 + t11 * 250;
    l10 += Yp(n11 + 16, g10, 16, e18, true, true) + `<text x="${n11 + 42}" y="${A(g10 + 8)}" font-family="${j}" font-size="22" fill="${Hp}">${Vp[e18]}</text>`;
  }), n10.cols === 2 && h10 && (l10 += `<text x="${o10 - 30}" y="${A(g10 + 8)}" text-anchor="end" font-family="${j}" font-size="22" font-weight="700" fill="${Hp}">Gleich eingesch\xE4tzt: ${m10} von ${h10}</text>`), { body: l10, vw: o10, vh: s10 };
}
function Xp(e17) {
  let t10 = Gp(e17.rate), n10 = Kp.get(e17.id), r10 = n10?.va ?? t10.va, i10 = n10?.vb ?? t10.vb, a10 = t10.items.map((e18, n11) => [e18, r10[n11] ? `${t10.a}: ${Vp[r10[n11]]}.` : ``, t10.cols === 2 && i10[n11] ? `${t10.b}: ${Vp[i10[n11]]}.` : ``].filter(Boolean).join(` `));
  return `${t10.title}. ${a10.join(` `)}`;
}
var Zp = Uo({ cls: `lh-ct-rating`, view: Rie, label: Xp, hit(e17, t10) {
  let n10 = Zp.item(e17);
  if (!n10) return;
  let r10 = Gp(n10.rate), i10 = Jp(n10);
  if (t10.startsWith(`l:`)) {
    let e18 = Number(t10.slice(2));
    M([r10.items[e18], i10.va[e18] ? `${r10.a}: ${Vp[i10.va[e18]]}.` : ``, r10.cols === 2 && i10.vb[e18] ? `${r10.b}: ${Vp[i10.vb[e18]]}.` : ``].filter(Boolean).join(` `));
    return;
  }
  if (!t10.startsWith(`f:`)) return;
  let [, a10, o10, s10] = t10.split(`:`).map(Number), c10 = a10 ? i10.vb : i10.va;
  c10[o10] = c10[o10] === s10 ? 0 : s10, _i(), c10[o10] && M(Vp[s10]), qp?.(e17, [...i10.va], [...i10.vb]), Zp.redraw(e17);
} });
var zie = Zp.draw;
function $p(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = (e18, t11, n11, r10) => typeof e18 == `number` && Number.isFinite(e18) ? Math.max(t11, Math.min(n11, Math.round(e18))) : r10;
  return { green: n10(t10.green, 4, 30, 8), wait: n10(t10.wait, 1, 15, 4), talk: t10.talk !== false, tick: t10.tick !== false };
}
var em = 1300;
var tm = 870;
var nm = 300;
var rm = 540;
var Bie = [362, 480];
var im = 600;
var Vie = 780;
var Hie = 690;
var am = 480;
var om = 705;
var Uie = 290;
var Wie = 560;
var sm = 200;
var Gie = 92;
var cm = 40;
var lm = [`#e03131`, `#1c7ed6`, `#f59f00`, `#2f9e44`, `#7048e8`, `#0ca678`, `#e64980`, `#495057`];
var um = 3400;
var dm = /* @__PURE__ */ new Map();
var fm = (e17, t10) => e17 + Math.random() * (t10 - e17);
function pm() {
  let e17 = [];
  return [80, 620, 1120].forEach((t10, n10) => e17.push({ x: t10, lane: 0, color: lm[n10 * 2], v: fm(230, 290) })), [-20, 480, 980].forEach((t10, n10) => e17.push({ x: t10, lane: 1, color: lm[n10 * 2 + 1], v: fm(230, 290) })), e17;
}
var mm = (e17) => {
  let t10 = dm.get(e17);
  return t10 || dm.set(e17, t10 = { phase: `red`, timer: 0, ticker: 0, raf: 0, last: 0, cars: pm(), fig: `stand`, t0: 0, msg: `` }), t10;
};
var hm = (e17) => `translate(${A(e17.x)} ${Bie[e17.lane] - Gie / 2})${e17.lane === 0 ? ` translate(${sm} 0) scale(-1 1)` : ``}`;
function Kie(e17, t10) {
  return `<g class="lh-tr-car" data-i="${t10}" transform="${hm(e17)}"><path d="M190 58Q192 40 170 36L138 32 108 8Q100 2 88 2H50Q36 2 28 14L14 34Q0 38 0 54V64Q0 72 10 72H186Q192 72 190 58Z" fill="${e17.color}" stroke="#212529" stroke-width="3" stroke-linejoin="round"/><path d="M126 32L102 10Q97 6 90 6H72V32Z" fill="#d0ebff" stroke="#212529" stroke-width="2.5"/><path d="M66 6H50Q42 6 37 14L26 32H66Z" fill="#d0ebff" stroke="#212529" stroke-width="2.5"/><rect x="186" y="42" width="12" height="9" rx="3" fill="#ffe066"/><rect x="6" y="46" width="9" height="9" rx="3" fill="#ff8787"/><circle cx="50" cy="74" r="17" fill="#212529"/><circle cx="50" cy="74" r="7" fill="#adb5bd"/><circle cx="154" cy="74" r="17" fill="#212529"/><circle cx="154" cy="74" r="7" fill="#adb5bd"/></g>`;
}
function gm(e17, t10, n10) {
  let r10 = Math.sin(t10) * 16, i10 = e17 * 7;
  return `<rect x="-50" y="-180" width="100" height="190" fill="transparent"/><path d="M-10 -58L${A(-14 + r10 * 0.4)} -4M10 -58L${A(14 - r10 * 0.4)} -4" stroke="#1e3a8a" stroke-width="15" stroke-linecap="round"/><ellipse cx="${A(-15 + r10 * 0.4)}" cy="-3" rx="12" ry="6" fill="#343a40"/><ellipse cx="${A(15 - r10 * 0.4)}" cy="-3" rx="12" ry="6" fill="#343a40"/><path d="M-24 -112Q-24 -122 -14 -122H14Q24 -122 24 -112V-54H-24Z" fill="#f08c00" stroke="#212529" stroke-width="2.5"/>` + (n10 ? `<path d="M-22 -110L-40 -136M22 -110L40 -136" stroke="#f1c27d" stroke-width="10" stroke-linecap="round"/>` : `<path d="M-22 -110L${A(-34 - r10 * 0.3)} -66M22 -110L${A(34 + r10 * 0.3)} -66" stroke="#f1c27d" stroke-width="10" stroke-linecap="round"/>`) + `<g transform="translate(${A(i10)} 0) rotate(${A(e17 * 8)} 0 -144)"><circle cx="0" cy="-144" r="24" fill="#f1c27d" stroke="#212529" stroke-width="2.5"/><path d="M-24 -148Q-26 -172 0 -172Q26 -172 24 -148Q12 -160 -24 -148Z" fill="#6b3e1d"/><circle cx="${A(-8 + e17 * 6)}" cy="-144" r="3.4" fill="#212529"/><circle cx="${A(8 + e17 * 6)}" cy="-144" r="3.4" fill="#212529"/><path d="M-7 -132Q0 ${n10 ? -136 : -127} 7 -132" fill="none" stroke="#212529" stroke-width="2.5" stroke-linecap="round"/></g>`;
}
function _m(e17, t10) {
  if (!e17) return { y: om, k: 1, look: 0, step: 0, halt: false };
  let n10 = t10 - e17.t0;
  if (e17.fig === `walk`) {
    let e18 = Math.min(1, n10 / um);
    return { y: om + -415 * e18, k: 1 - 0.22 * e18, look: 0, step: n10 / 140, halt: false };
  }
  return e17.fig === `there` ? { y: Uie, k: 0.78, look: 0, step: 0, halt: false } : e17.fig === `look` ? { y: om, k: 1, look: n10 < 900 ? -1 : n10 < 1900 ? 1 : n10 < 2600 ? -1 : 0, step: 0, halt: false } : { y: om, k: 1, look: 0, step: 0, halt: e17.fig === `halt` };
}
var vm = (e17) => `translate(${Hie} ${A(e17.y)}) scale(${A(e17.k * 100) / 100})`;
function ym(e17, t10, n10, r10, i10) {
  let a10 = r10 ? i10 ? `#2fe06b` : `#ff3b30` : `#3a3d42`, o10 = i10 ? `<g stroke="${a10}" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M54 33l-6 27" stroke-width="15"/><path d="M52 38l-14 12M54 38l10 14" stroke-width="8"/><path d="M48 60l-14 28M48 60l16 26" stroke-width="10"/></g><circle cx="57" cy="19" r="10" fill="${a10}"/>` : `<g stroke="${a10}" stroke-linecap="round" fill="none"><path d="M50 34v28" stroke-width="18"/><path d="M45 38l-6 22M55 38l6 22" stroke-width="9"/><path d="M47 62l-3 28M53 62l3 28" stroke-width="10"/></g><circle cx="50" cy="20" r="10" fill="${a10}"/>`;
  return `<rect x="${A(e17)}" y="${A(t10)}" width="${A(n10)}" height="${A(n10)}" rx="${A(n10 * 0.12)}" fill="#1b1d20"/><g transform="translate(${A(e17 + n10 * 0.1)} ${A(t10 + n10 * 0.08)}) scale(${A(n10 * 0.8) / 100})">${o10}</g>`;
}
function qie(e17, t10) {
  let n10 = t10 ? mm(e17.id) : null, r10 = n10?.phase ?? `red`, i10 = r10 === `green`, a10 = ``;
  a10 += `<rect x="0" y="0" width="${em}" height="${nm}" fill="#dbeafe"/>`;
  for (let [e18, t11, n11, r11] of [[40, 150, 220, `#ffd8a8`], [300, 110, 200, `#d0bfff`], [860, 130, 230, `#b2f2bb`], [1120, 90, 170, `#ffc9c9`]]) {
    a10 += `<rect x="${e18}" y="${t11}" width="${n11}" height="${260 - t11}" fill="${r11}" stroke="#868e96" stroke-width="3"/>`;
    for (let r12 = 0; r12 < 2; r12++) for (let i11 = 0; i11 < 2; i11++) t11 + 28 + i11 * 64 + 40 <= 250 && (a10 += `<rect x="${e18 + 30 + n11 / 2 * r12}" y="${t11 + 28 + i11 * 64}" width="${n11 / 2 - 60}" height="40" fill="#ffffff" stroke="#868e96" stroke-width="2"/>`);
  }
  a10 += `<rect x="0" y="260" width="${em}" height="40" fill="#ced4da"/><rect x="0" y="294" width="${em}" height="6" fill="#adb5bd"/>`, a10 += `<rect x="0" y="${nm}" width="${em}" height="240" fill="#495057"/>`;
  for (let e18 = 20; e18 < em; e18 += 90) (e18 + 50 < im || e18 > Vie) && (a10 += `<rect x="${e18}" y="416" width="50" height="8" fill="#f8f9fa"/>`);
  for (let e18 of [im, 766]) for (let t11 = 308; t11 < 532; t11 += 40) a10 += `<rect x="${e18}" y="${t11}" width="14" height="24" fill="#f8f9fa"/>`;
  (n10?.cars ?? pm()).forEach((e18, t11) => a10 += Kie(e18, t11)), a10 += `<rect x="0" y="${rm}" width="${em}" height="10" fill="#adb5bd"/><rect x="0" y="550" width="${em}" height="320" fill="#dee2e6"/>`, a10 += `<rect x="470" y="120" width="20" height="589" fill="#e9ecef" stroke="#343a40" stroke-width="3"/>`, a10 += `<g${Vo(t10, `say`)}><title>Was zeigt die Ampel?</title><rect x="410" y="40" width="140" height="262" rx="16" fill="#212529"/>${ym(420, 50, 120, !i10, false)}${ym(420, 174, 120, i10, true)}</g>`;
  let o10 = r10 === `wait` || r10 === `stopping`;
  a10 += `<g${Vo(t10, `press`)}><title>Knopf dr\xFCcken</title><rect x="424" y="${Wie}" width="112" height="128" rx="10" fill="#ffd43b" stroke="#343a40" stroke-width="4"/>`, a10 += `<rect x="434" y="570" width="92" height="30" rx="5" fill="${o10 ? `#ffffff` : `#343a40`}"/><text x="${am}" y="591" text-anchor="middle" font-family="${j}" font-size="14" font-weight="700" fill="${o10 ? `#e03131` : `#868e96`}">Signal kommt</text>`, a10 += `<circle cx="${am}" cy="635" r="24" fill="#343a40"/><circle cx="${am}" cy="635" r="17" fill="${o10 ? `#fab005` : `#868e96`}"/><text x="${am}" y="679" text-anchor="middle" font-family="${j}" font-size="13" font-weight="700" fill="#343a40">Bitte dr\xFCcken</text></g>`;
  let s10 = _m(n10, typeof performance < `u` ? performance.now() : 0);
  a10 += `<g${Vo(t10, `go`)}><title>Los!</title><g class="lh-tr-fig" transform="${vm(s10)}">${gm(s10.look, s10.step, s10.halt)}</g></g>`;
  let c10 = n10?.msg || (i10 ? `Gr\xFCn! Schau auf beide Seiten.` : r10 === `red` ? `Dr\xFCcke den Knopf am gelben Kasten und warte auf Gr\xFCn.` : `Warte bei Rot.`);
  a10 += `<rect x="20" y="730" width="1260" height="120" rx="22" fill="#ffffff" stroke="#ced4da" stroke-width="3"/>`;
  let l10 = Ko(c10, t10 ? 920 : 1200, 104, 38, 26, 2);
  if (a10 += qo(l10.lines, 50, 790, l10.size, `font-weight="700" fill="${n10?.fig === `halt` ? `#e03131` : n10?.fig === `there` ? `#2f9e44` : `#1f2937`}"`, `start`), t10) {
    let e18 = n10?.fig === `there`;
    a10 += `<g${Vo(t10, e18 ? `again` : `go`)}><rect x="1000" y="746" width="250" height="88" rx="44" fill="${e18 ? `#1c7ed6` : `#2f9e44`}"/><text x="1125" y="804" text-anchor="middle" font-family="${j}" font-size="40" font-weight="700" fill="#ffffff">${e18 ? `Nochmal` : `Los!`}</text></g>`;
  }
  return { body: a10, vw: em, vh: tm };
}
function Jie(e17, t10) {
  let n10 = Math.max(0.3, e17.w / Math.max(1, e17.h));
  if (Math.abs(n10 - em / tm) < 0.02) return t10;
  if (n10 > em / tm) {
    let e18 = tm * n10, r11 = (e18 - em) / 2;
    return { ...t10, body: `<rect x="0" y="0" width="${A(e18)}" height="${nm}" fill="#dbeafe"/><rect x="0" y="${nm}" width="${A(e18)}" height="240" fill="#495057"/><rect x="0" y="${rm}" width="${A(e18)}" height="330" fill="#dee2e6"/><g transform="translate(${A(r11)} 0)">${t10.body}</g>`, vw: e18 };
  }
  let r10 = em / n10, i10 = (r10 - tm) / 2;
  return { ...t10, body: `<rect x="0" y="0" width="${em}" height="${A(i10 + nm)}" fill="#dbeafe"/><rect x="0" y="${A(i10 + nm)}" width="${em}" height="${A(r10 - i10 - nm)}" fill="#dee2e6"/><g transform="translate(0 ${A(i10)})">${t10.body}</g>`, vh: r10 };
}
var bm = { red: `Rot. Bleib stehen. Dr\xFCcke den Knopf und warte.`, wait: `Signal kommt. Warte bei Rot.`, stopping: `Rot. Warte noch, die Autos halten an.`, green: `Gr\xFCn. Schau auf beide Seiten, ob die Autos stehen.`, clear: `Rot. Bleib stehen.` };
function Yie(e17, t10) {
  let n10 = e17.phase === `stopping` || e17.phase === `green` || e17.phase === `clear`;
  for (let r10 of [0, 1]) {
    let i10 = r10 === 0 ? -1 : 1, a10 = (e18) => i10 > 0 ? e18.x + sm : -e18.x, o10 = (e18) => i10 > 0 ? e18.x : -(e18.x + sm), s10 = i10 > 0 ? 582 : -798, c10 = e17.cars.filter((e18) => e18.lane === r10).sort((e18, t11) => a10(t11) - a10(e18));
    c10.forEach((e18, r11) => {
      let l10 = a10(e18), u10 = r11 ? o10(c10[r11 - 1]) - cm : 1 / 0;
      n10 && l10 <= s10 + 1 && (u10 = Math.min(u10, s10));
      let d10 = u10 - l10, f10 = l10 + (d10 > 140 ? e18.v * t10 : Math.max(0, Math.min(e18.v * t10, d10 * Math.min(1, 3.5 * t10))));
      e18.x = i10 > 0 ? f10 - sm : -f10;
    });
    for (let e18 of c10) {
      if (!(i10 > 0 ? e18.x > 1330 : e18.x < -230)) continue;
      let t11 = c10.filter((t12) => t12 !== e18);
      e18.x = i10 > 0 ? Math.min(-240, ...t11.map((e19) => e19.x - sm - cm - 30)) - fm(0, 260) : Math.max(1340, ...t11.map((e19) => e19.x + sm + cm + 30)) + fm(0, 260), e18.color = lm[Math.floor(Math.random() * lm.length)], e18.v = fm(230, 300);
    }
  }
}
function xm(e17, t10) {
  let n10 = dm.get(e17);
  if (!n10) return;
  if (!wm.nodes(e17).length) {
    n10.raf = 0;
    return;
  }
  let r10 = Math.min(0.05, (t10 - (n10.last || t10)) / 1e3);
  n10.last = t10, Yie(n10, r10), n10.fig === `walk` && t10 - n10.t0 >= um && Zie(e17), n10.fig === `look` && t10 - n10.t0 > 2700 && (n10.fig = `stand`);
  let i10 = _m(n10, t10);
  for (let t11 of wm.nodes(e17)) {
    t11.querySelectorAll(`.lh-tr-car`).forEach((e19) => {
      let t12 = n10.cars[Number(e19.dataset.i)];
      if (!t12) return;
      e19.setAttribute(`transform`, hm(t12));
      let r11 = e19.firstElementChild;
      r11 && r11.getAttribute(`fill`) !== t12.color && r11.setAttribute(`fill`, t12.color);
    });
    let e18 = t11.querySelector(`.lh-tr-fig`);
    e18 && (e18.setAttribute(`transform`, vm(i10)), (n10.fig === `walk` || n10.fig === `look`) && (e18.innerHTML = gm(i10.look, i10.step, i10.halt)));
  }
  n10.raf = requestAnimationFrame((t11) => xm(e17, t11));
}
function Xie(e17) {
  let t10 = mm(e17);
  t10.raf || typeof requestAnimationFrame > `u` || (t10.last = 0, t10.raf = requestAnimationFrame((t11) => xm(e17, t11)));
}
function Sm(e17, t10) {
  let n10 = wm.item(e17), r10 = mm(e17);
  if (r10.phase = t10, r10.fig !== `walk` && r10.fig !== `there` && (r10.msg = ``), t10 === `green` && (r10.fig === `stand` || r10.fig === `halt`) && (r10.fig = `look`, r10.t0 = performance.now()), wm.redraw(e17), !n10) return;
  let i10 = $p(n10.traffic);
  i10.talk && (t10 === `green` || t10 === `wait`) && M(bm[t10]), clearInterval(r10.ticker), i10.tick && t10 !== `red` && (r10.ticker = window.setInterval(() => _i(), t10 === `green` ? 260 : 1100));
  let a10 = (t11, n11) => {
    clearTimeout(r10.timer), r10.timer = window.setTimeout(() => Sm(e17, t11), n11 * 1e3);
  };
  if (t10 === `wait`) a10(`stopping`, Math.max(0.5, i10.wait - 2));
  else if (t10 === `stopping`) a10(`green`, 2);
  else if (t10 === `green`) {
    clearTimeout(r10.timer);
    let t11 = () => {
      r10.fig === `walk` ? r10.timer = window.setTimeout(t11, 400) : Sm(e17, `clear`);
    };
    r10.timer = window.setTimeout(t11, i10.green * 1e3);
  } else t10 === `clear` && a10(`red`, 1.6);
}
function Zie(e17) {
  let t10 = mm(e17);
  t10.fig = `there`, t10.msg = `Super! Du bist bei Gr\xFCn gegangen.`, wm.redraw(e17), vi(), M(t10.msg);
}
function Qie(e17) {
  let t10 = mm(e17);
  t10.fig !== `walk` && t10.fig !== `there` && (t10.phase === `green` ? (t10.fig = `walk`, t10.t0 = performance.now(), t10.msg = `Gut! Die Autos stehen \u2013 jetzt \xFCber die Stra\xDFe.`, wm.redraw(e17)) : (t10.fig = `halt`, t10.msg = `Halt! Die Ampel ist rot.`, wm.redraw(e17), yi(), M(t10.phase === `red` ? `Halt! Die Ampel ist rot. Dr\xFCcke den Knopf und warte, bis sie gr\xFCn ist.` : `Halt! Die Ampel ist noch rot. Warte, bis sie gr\xFCn ist.`), window.setTimeout(() => {
    t10.fig === `halt` && (t10.fig = `stand`, t10.msg = ``, wm.redraw(e17));
  }, 2600)));
}
var Cm = (e17) => `Fu\xDFg\xE4ngerampel. ${bm[dm.get(e17.id)?.phase ?? `red`]}`;
var wm = Uo({ cls: `lh-ct-traffic`, view(e17, t10) {
  return t10 && Xie(e17.id), Jie(e17, qie(e17, t10));
}, label: Cm, sounds: true, hit(e17, t10) {
  let n10 = mm(e17);
  t10 === `say` ? M(bm[n10.phase]) : t10 === `press` ? (_i(), n10.phase === `red` ? Sm(e17, `wait`) : M(bm[n10.phase])) : t10 === `go` ? Qie(e17) : t10 === `again` && (n10.fig = `stand`, n10.msg = ``, wm.redraw(e17));
} });
var $ie = wm.draw;
var Tm = [{ id: `happy`, label: `fr\xF6hlich`, say: `Ich bin fr\xF6hlich.`, color: `#ffd43b` }, { id: `calm`, label: `ruhig`, say: `Ich bin ruhig.`, color: `#b2f2bb` }, { id: `tired`, label: `m\xFCde`, say: `Ich bin m\xFCde.`, color: `#d0bfff` }, { id: `sad`, label: `traurig`, say: `Ich bin traurig.`, color: `#a5d8ff` }, { id: `angry`, label: `w\xFCtend`, say: `Ich bin w\xFCtend.`, color: `#ff8787` }, { id: `scared`, label: `\xE4ngstlich`, say: `Ich habe Angst.`, color: `#dee2e6` }, { id: `surprised`, label: `\xFCberrascht`, say: `Ich bin \xFCberrascht.`, color: `#ffc078` }, { id: `sick`, label: `krank`, say: `Ich f\xFChle mich krank.`, color: `#c0eb75` }];
var Em = () => ({ title: `Wie geht es dir heute?`, feels: [`happy`, `calm`, `tired`, `sad`, `angry`, `scared`], count: false });
function Dm(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = (Array.isArray(t10.feels) ? t10.feels : []).filter((e18, t11, n11) => Tm.some((t12) => t12.id === e18) && n11.indexOf(e18) === t11);
  return { title: typeof t10.title == `string` ? t10.title.slice(0, 80) : Em().title, feels: n10.length >= 2 ? n10 : Em().feels, count: t10.count === true };
}
function Om(e17, t10, n10, r10) {
  let i10 = Tm.find((t11) => t11.id === e17), a10 = r10 / 50, o10 = (e18, r11) => `${A(t10 + e18 * a10)} ${A(n10 + r11 * a10)}`, s10 = `#343a40`, c10 = (e18) => `fill="none" stroke="${s10}" stroke-width="${A(e18 * a10)}" stroke-linecap="round" stroke-linejoin="round"`, l10 = `<circle cx="${A(t10)}" cy="${A(n10)}" r="${A(r10)}" fill="${i10.color}" stroke="${s10}" stroke-width="${A(3.5 * a10)}"/>`, u10 = (e18, r11, i11 = 5) => `<circle cx="${A(t10 + e18 * a10)}" cy="${A(n10 + r11 * a10)}" r="${A(i11 * a10)}" fill="${s10}"/>`;
  switch (e17) {
    case `happy`:
      l10 += `<path d="M${o10(-24, -10)}q6 -9 12 0M${o10(12, -10)}q6 -9 12 0" ${c10(5)}/><path d="M${o10(-26, 10)}Q${o10(0, 42)} ${o10(26, 10)}Z" fill="#c92a2a" stroke="${s10}" stroke-width="${A(4 * a10)}" stroke-linejoin="round"/>`;
      break;
    case `calm`:
      l10 += `<path d="M${o10(-24, -8)}q6 6 12 0M${o10(12, -8)}q6 6 12 0" ${c10(5)}/><path d="M${o10(-16, 18)}q16 10 32 0" ${c10(5)}/>`;
      break;
    case `tired`:
      l10 += `<path d="M${o10(-26, -8)}h14M${o10(12, -8)}h14" ${c10(5)}/><ellipse cx="${A(t10)}" cy="${A(n10 + 22 * a10)}" rx="${A(8 * a10)}" ry="${A(10 * a10)}" fill="#862e2e"/><text x="${A(t10 + 30 * a10)}" y="${A(n10 - 26 * a10)}" font-family="${j}" font-size="${A(20 * a10)}" font-weight="700" fill="${s10}">z</text><text x="${A(t10 + 40 * a10)}" y="${A(n10 - 38 * a10)}" font-family="${j}" font-size="${A(14 * a10)}" font-weight="700" fill="${s10}">z</text>`;
      break;
    case `sad`:
      l10 += u10(-18, -6) + u10(18, -6) + `<path d="M${o10(-28, -22)}l14 -6M${o10(28, -22)}l-14 -6" ${c10(4)}/><path d="M${o10(-18, 28)}q18 -16 36 0" ${c10(5)}/><path d="M${o10(-20, 4)}q-4 9 0 12q4 -3 0 -12z" fill="#4dabf7"/>`;
      break;
    case `angry`:
      l10 += u10(-18, -4) + u10(18, -4) + `<path d="M${o10(-30, -24)}l20 10M${o10(30, -24)}l-20 10" ${c10(5)}/><path d="M${o10(-18, 26)}q18 -12 36 0" ${c10(5)}/>`;
      break;
    case `scared`:
      l10 += `<circle cx="${A(t10 - 18 * a10)}" cy="${A(n10 - 6 * a10)}" r="${A(9 * a10)}" fill="#fff" stroke="${s10}" stroke-width="${A(2.5 * a10)}"/><circle cx="${A(t10 + 18 * a10)}" cy="${A(n10 - 6 * a10)}" r="${A(9 * a10)}" fill="#fff" stroke="${s10}" stroke-width="${A(2.5 * a10)}"/>` + u10(-18, -5, 3.5) + u10(18, -5, 3.5) + `<path d="M${o10(-28, -26)}q8 -6 16 -2M${o10(28, -26)}q-8 -6 -16 -2" ${c10(4)}/><path d="M${o10(-20, 24)}q5 -6 10 0t10 0t10 0t10 0" ${c10(4.5)}/>`;
      break;
    case `surprised`:
      l10 += `<circle cx="${A(t10 - 18 * a10)}" cy="${A(n10 - 8 * a10)}" r="${A(8 * a10)}" fill="#fff" stroke="${s10}" stroke-width="${A(2.5 * a10)}"/><circle cx="${A(t10 + 18 * a10)}" cy="${A(n10 - 8 * a10)}" r="${A(8 * a10)}" fill="#fff" stroke="${s10}" stroke-width="${A(2.5 * a10)}"/>` + u10(-18, -8, 4) + u10(18, -8, 4) + `<path d="M${o10(-28, -26)}q10 -10 20 0M${o10(8, -26)}q10 -10 20 0" ${c10(4)}/><ellipse cx="${A(t10)}" cy="${A(n10 + 22 * a10)}" rx="${A(9 * a10)}" ry="${A(12 * a10)}" fill="#862e2e"/>`;
      break;
    case `sick`:
      l10 += `<path d="M${o10(-24, -12)}l10 6l-10 6M${o10(24, -12)}l-10 6l10 6" ${c10(4.5)}/><path d="M${o10(-18, 26)}q6 -6 12 0t12 0t12 0" ${c10(4.5)}/><rect x="${A(t10 + 16 * a10)}" y="${A(n10 + 6 * a10)}" width="${A(30 * a10)}" height="${A(8 * a10)}" rx="${A(4 * a10)}" transform="rotate(-30 ${A(t10 + 30 * a10)} ${A(n10 + 10 * a10)})" fill="#fff" stroke="${s10}" stroke-width="${A(2.5 * a10)}"/>`;
  }
  return l10;
}
var km = /* @__PURE__ */ new Map();
var Am = (e17) => {
  let t10 = km.get(e17);
  return t10 || km.set(e17, t10 = { counts: {}, last: null }), t10;
};
function tae(e17, t10) {
  let n10 = Dm(e17.mood), r10 = Math.max(400, e17.w), i10 = Math.max(220, e17.h), a10 = t10 ? Am(e17.id) : null, o10 = `<rect x="0" y="0" width="${r10}" height="${i10}" rx="22" fill="#ffffff" stroke="#ced4da" stroke-width="3"/>`, s10 = n10.title ? 90 : 20;
  if (n10.title) {
    let e18 = Ko(n10.title, r10 - 160, 70, 46, 18, 1);
    o10 += qo(e18.lines, r10 / 2, 50, e18.size, `font-weight="700" fill="#1f2937"`);
  }
  let c10 = n10.feels.length, l10 = Math.min((r10 - 40) / c10, (i10 - s10 - 20) / 1.45), u10 = Math.ceil(c10 / 2), d10 = Math.min((r10 - 40) / u10, (i10 - s10 - 20) / 2 / 1.45), f10 = d10 > l10 * 1.15 ? 2 : 1, p10 = f10 === 2 ? u10 : c10, m10 = f10 === 2 ? d10 : l10, h10 = m10 * 0.38, g10 = s10 + (i10 - s10 - 20 - f10 * m10 * 1.45) / 2;
  return n10.feels.forEach((e18, i11) => {
    let s11 = Math.floor(i11 / p10), l11 = s11 === f10 - 1 ? c10 - s11 * p10 : p10, u11 = i11 - s11 * p10, d11 = r10 / 2 + (u11 - (l11 - 1) / 2) * m10, _10 = g10 + s11 * m10 * 1.45 + m10 * 0.55, v10 = Tm.find((t11) => t11.id === e18), y10 = a10?.last === e18;
    o10 += `<g${Vo(t10, `f:${e18}`)}${y10 ? ` class="lh-pop"` : ``}><rect x="${A(d11 - m10 / 2 + 6)}" y="${A(_10 - m10 * 0.5)}" width="${A(m10 - 12)}" height="${A(m10 * 1.38)}" rx="18" fill="${y10 ? `#fff9db` : `#ffffff`}" stroke="${y10 ? `#f08c00` : `#e9ecef`}" stroke-width="${y10 ? 6 : 3}"/>`, o10 += Om(e18, d11, _10, h10), o10 += `<text x="${A(d11)}" y="${A(_10 + h10 + m10 * 0.3)}" text-anchor="middle" font-family="${j}" font-size="${A(Math.min(34, m10 * 0.17))}" font-weight="700" fill="#1f2937">${v10.label}</text>`;
    let b10 = a10?.counts[e18] ?? 0;
    n10.count && b10 && (o10 += `<circle cx="${A(d11 + h10 * 0.95)}" cy="${A(_10 - h10 * 0.95)}" r="${A(Math.max(18, h10 * 0.3))}" fill="#1c7ed6"/><text x="${A(d11 + h10 * 0.95)}" y="${A(_10 - h10 * 0.95 + Math.max(18, h10 * 0.3) * 0.38)}" text-anchor="middle" font-family="${j}" font-size="${A(Math.max(18, h10 * 0.3))}" font-weight="700" fill="#fff">${b10}</text>`), o10 += `</g>`;
  }), t10 && n10.count && Object.values(a10?.counts ?? {}).some(Boolean) && (o10 += `<g${Vo(t10, `reset`)}><title>Von vorn</title><circle cx="${r10 - 44}" cy="44" r="28" fill="#f1f3f5" stroke="#adb5bd" stroke-width="3"/><path d="M${r10 - 56} 38a14 14 0 1 1 2 14" fill="none" stroke="#495057" stroke-width="5" stroke-linecap="round"/><path d="M${r10 - 64} 30l6 12 10-8z" fill="#495057"/></g>`), { body: o10, vw: r10, vh: i10 };
}
function jm(e17) {
  let t10 = Dm(e17.mood), n10 = km.get(e17.id), r10 = t10.count && n10 ? t10.feels.filter((e18) => n10.counts[e18]).map((e18) => `${Tm.find((t11) => t11.id === e18).label}: ${n10.counts[e18]}`) : [];
  return `${t10.title || `Gef\xFChle`}. ${r10.length ? r10.join(`, `) + `.` : t10.feels.map((e18) => Tm.find((t11) => t11.id === e18).label).join(`, `) + `.`}`;
}
var Mm = Uo({ cls: `lh-ct-mood`, view: tae, label: jm, sounds: true, hit(e17, t10) {
  let n10 = Mm.item(e17);
  if (!n10) return;
  let r10 = Am(e17);
  if (t10 === `reset`) {
    r10.counts = {}, r10.last = null, Mm.redraw(e17);
    return;
  }
  let i10 = t10.slice(2), a10 = Tm.find((e18) => e18.id === i10);
  a10 && (r10.last = i10, Dm(n10.mood).count && (r10.counts[i10] = (r10.counts[i10] ?? 0) + 1, vi()), Mm.redraw(e17), M(a10.say));
} });
var nae = Mm.draw;
function Nm(e17) {
  km.delete(e17), Mm.redraw(e17);
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
var goe = { g: 55, C: 60, D: 62, E: 64, F: 65, G: 67, A: 69, H: 71, c: 72 };
function Og(e17) {
  return e17.trim().split(/\s+/).map((e18) => {
    let t10 = /^([gCDEFGAHc-])([\d.]*)$/.exec(e18);
    if (!t10) throw Error(`bad note ${e18}`);
    return [t10[1] === `-` ? null : goe[t10[1]], t10[2] ? Number(t10[2]) : 1];
  });
}
var kg = [{ id: `entchen`, title: `Alle meine Entchen`, bpm: 100, notes: Og(`C D E F G2 G2 A A A A G4 A A A A G4 F F F F E2 E2 D D D D C4`) }, { id: `haenschen`, title: `H\xE4nschen klein`, bpm: 100, notes: Og(`G E E2 F D D2 C D E F G G G2 G E E2 F D D2 C E G G C4 D D D D D E F2 E E E E E F G2 G E E2 F D D2 C E G G C4`) }, { id: `jakob`, title: `Bruder Jakob`, bpm: 100, notes: Og(`C D E C C D E C E F G2 E F G2 G.5 A.5 G.5 F.5 E C G.5 A.5 G.5 F.5 E C C g C2 C g C2`) }, { id: `weihnachtsmann`, title: `Morgen kommt der Weihnachtsmann`, bpm: 100, notes: Og(`C C G G A A G2 F F E E D D C2 G G F F E E D2 G G F F E E D2 C C G G A A G2 F F E E D D C2`) }, { id: `freude`, title: `Ode an die Freude`, bpm: 100, notes: Og(`E E F G G F E D C C D E E1.5 D.5 D2 E E F G G F E D C C D E D1.5 C.5 C2`) }, { id: `jingle`, title: `Jingle Bells`, bpm: 120, notes: Og(`E E E2 E E E2 E G C D E4 F F F F F E E E E D D E D2 G2 E E E2 E E E2 E G C D E4 F F F F F E E E G G F D C4`) }, { id: `mary`, title: `Mary Had a Little Lamb`, bpm: 110, notes: Og(`E D C D E E E2 D D D2 E G G2 E D C D E E E E D D E D C4`) }, { id: `scale`, title: `Tonleiter (C-Dur)`, bpm: 90, notes: Og(`C D E F G A H c2 c H A G F E D C2`) }];
var zb = [`#2563eb`, `#0d9488`, `#7c3aed`, `#c2410c`, `#be123c`, `#4d7c0f`];
function Bb() {
  return { title: ``, layout: `cards`, path: false, color: zb[0], links: [] };
}
function Vb(e17) {
  if (typeof e17 != `string`) return null;
  let t10 = e17.trim();
  if (!t10) return null;
  try {
    let e18 = new URL(/^[a-z][a-z0-9+.-]*:/i.test(t10) ? t10 : `https://${t10}`);
    return e18.protocol === `http:` || e18.protocol === `https:` ? e18.href : null;
  } catch {
    return null;
  }
}
function Hb(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = Bb(), i10 = (e18, t11) => typeof e18 == `string` ? e18.slice(0, t11) : ``, a10 = [];
  for (let e18 of Array.isArray(n10.links) ? n10.links : []) {
    let n11 = e18 && typeof e18 == `object` ? e18 : {}, r11 = Vb(n11.url);
    if (!r11) continue;
    let o10 = t10(n11.img);
    if (a10.push({ url: r11, title: i10(n11.title, 200), desc: i10(n11.desc, 400), ...o10 ? { img: o10 } : {} }), a10.length >= 12) break;
  }
  return { title: i10(n10.title, 120), layout: n10.layout === `list` || n10.layout === `tiles` || n10.layout === `buttons` ? n10.layout : `cards`, path: n10.path === true, color: typeof n10.color == `string` && /^#[0-9a-f]{6}$/i.test(n10.color) ? n10.color : r10.color, links: a10 };
}
var Ub = (e17) => e17.replace(/[&<>"']/g, (e18) => ({ "&": `&amp;`, "<": `&lt;`, ">": `&gt;`, '"': `&quot;`, "'": `&#39;` })[e18]);
var Wb = (e17) => `${Math.round(e17 * 10) / 10}px`;
var Gb = (e17) => {
  try {
    return new URL(e17).hostname.replace(/^www\./, ``);
  } catch {
    return e17;
  }
};
var Kb = `lernheft-path-`;
function qb(e17) {
  try {
    let t10 = JSON.parse(localStorage.getItem(Kb + e17) ?? `[]`);
    return new Set(Array.isArray(t10) ? t10.filter((e18) => typeof e18 == `number`) : []);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function Jb(e17, t10) {
  try {
    t10.size ? localStorage.setItem(Kb + e17, JSON.stringify([...t10])) : localStorage.removeItem(Kb + e17);
  } catch {
  }
}
var Yb = (e17, t10) => {
  let n10 = 0;
  for (; n10 < t10 && e17.has(n10); ) n10++;
  return n10;
};
function Xb(e17, t10, n10) {
  let r10 = e17.links.length;
  if (!r10) return [];
  let i10 = Math.min(t10, n10) * 0.035, a10 = i10 + (e17.title.trim() ? Math.min(n10 * 0.12, 110) : 0), o10 = t10 - 2 * i10, s10 = n10 - a10 - i10, c10 = Math.min(t10, n10) * 0.025, l10;
  l10 = e17.layout === `list` ? r10 <= 5 ? 1 : 2 : e17.layout === `buttons` ? r10 <= 4 ? 1 : r10 <= 8 ? 2 : 3 : r10 <= 2 ? r10 : r10 <= 4 ? 2 : r10 <= 9 ? 3 : 4;
  let u10 = Math.ceil(r10 / l10), d10 = (o10 - (l10 - 1) * c10) / l10, f10 = (s10 - (u10 - 1) * c10) / u10;
  e17.layout === `cards` && (f10 = Math.min(f10, d10 * 0.95)), e17.layout === `tiles` && (f10 = Math.min(f10, d10 * 0.75)), e17.layout === `list` && (f10 = Math.min(f10, Math.max(90, d10 * 0.22))), e17.layout === `buttons` && (f10 = Math.min(f10, 120), d10 = Math.min(d10, 900));
  let p10 = u10 * f10 + (u10 - 1) * c10, m10 = i10 + (o10 - (l10 * d10 + (l10 - 1) * c10)) / 2, h10 = a10 + Math.max(0, (s10 - p10) / 2);
  return e17.links.map((e18, t11) => {
    let n11 = Math.floor(t11 / l10), i11 = Math.min(l10, r10 - n11 * l10), a11 = t11 % l10, o11 = (l10 - i11) * (d10 + c10) / 2;
    return { i: t11, x: m10 + o11 + a11 * (d10 + c10), y: h10 + n11 * (f10 + c10), w: d10, h: f10 };
  });
}
function Zb(e17, t10, n10, r10) {
  let i10 = Xb(e17, t10, n10), a10 = Math.min(t10, n10) * 0.035, o10 = e17.title.trim() ? Math.min(n10 * 0.12, 110) : 0, s10 = r10.done ?? /* @__PURE__ */ new Set(), c10 = e17.path ? Yb(s10, e17.links.length) : e17.links.length, l10 = `<div class="lh-bm lh-bm-${e17.layout}${e17.path ? ` is-path` : ``}" style="width:${Wb(t10)};height:${Wb(n10)};--bc:${e17.color}">`;
  if (o10 && (l10 += `<div class="lh-bm-title" style="left:${Wb(a10)};top:${Wb(a10)};width:${Wb(t10 - 2 * a10)};height:${Wb(o10)};font-size:${Wb(Math.min(o10 * 0.55, t10 * 0.9 / (0.55 * Math.max(6, [...e17.title].length))))}">${Ub(e17.title)}</div>`), e17.links.length || (l10 += `<div class="lh-bm-empty" style="font-size:${Wb(Math.min(t10, n10) * 0.05)}">Noch keine Links \u2013 tippe auf das Zahnrad.</div>`), e17.path && i10.length > 1) {
    let r11 = i10.map((e18) => `${(e18.x + e18.w / 2).toFixed(1)},${(e18.y + e18.h / 2).toFixed(1)}`).join(` `);
    l10 += `<svg class="lh-bm-line" width="${Wb(t10)}" height="${Wb(n10)}" viewBox="0 0 ${t10} ${n10}"><polyline points="${r11}" fill="none" stroke="${e17.color}" stroke-width="${Math.max(4, Math.min(t10, n10) * 8e-3)}" stroke-dasharray="14 12" stroke-linecap="round" opacity=".55"/></svg>`;
  }
  return e17.links.forEach((t11, n11) => {
    let a11 = i10[n11], o11 = t11.img ? r10.src(t11.img) : void 0, u10 = e17.path && n11 > c10, d10 = e17.path && s10.has(n11), f10 = `lh-bm-link${u10 ? ` is-locked` : ``}${d10 ? ` is-done` : ``}${e17.path && n11 === c10 ? ` is-next` : ``}`, p10 = e17.layout === `list` ? Math.min(a11.h * 0.24, a11.w * 0.05) : e17.layout === `buttons` ? Math.min(a11.h * 0.32, a11.w * 0.06) : Math.min(a11.w * 0.075, a11.h * 0.09), m10 = Ub(t11.title || Gb(t11.url)), h10 = Math.min(a11.w, a11.h) * (e17.layout === `cards` ? 0.24 : e17.layout === `tiles` ? 0.34 : e17.layout === `list` ? 0.42 : 0.36), g10 = o11 ? `<img class="lh-bm-img" src="${Ub(o11)}" alt="" draggable="false">` : `<div class="lh-bm-img lh-bm-noimg" style="font-size:${Wb(h10)}">${Ub(Gb(t11.url).slice(0, 1).toUpperCase())}</div>`, _10 = e17.path ? `<span class="lh-bm-num" style="font-size:${Wb(p10 * 0.9)}">${d10 ? `\u2713` : n11 + 1}</span>` : ``, v10 = u10 ? `<span class="lh-bm-lock" aria-hidden="true" style="font-size:${Wb(p10 * 0.85)}">\u{1F512}</span>` : ``, y10 = e17.layout === `buttons` ? `<span class="lh-bm-t" style="font-size:${Wb(p10)}">${m10}</span>` : `<span class="lh-bm-t" style="font-size:${Wb(p10)}">${m10}</span>${t11.desc && e17.layout !== `tiles` ? `<span class="lh-bm-d" style="font-size:${Wb(p10 * 0.68)}">${Ub(t11.desc)}</span>` : ``}<span class="lh-bm-u" style="font-size:${Wb(p10 * 0.6)}">${Ub(Gb(t11.url))}</span>`;
    l10 += `<div class="${f10}" data-i="${n11}" data-href="${Ub(t11.url)}" role="link" aria-label="${Ub(`${e17.path ? `${n11 + 1}. ` : ``}${t11.title || Gb(t11.url)}${u10 ? ` (noch gesperrt)` : ``}`)}" style="left:${Wb(a11.x)};top:${Wb(a11.y)};width:${Wb(a11.w)};height:${Wb(a11.h)}">${g10}<div class="lh-bm-text">${y10}</div>${_10}${v10}</div>`;
  }), r10.live && e17.path && s10.size && (l10 += `<button type="button" class="lh-bm-reset" data-a="reset" style="right:${Wb(a10 * 0.6)};bottom:${Wb(a10 * 0.4)};font-size:${Wb(Math.min(t10, n10) * 0.025)}">\u21BA Von vorn</button>`), l10 + `</div>`;
}
function Mue(e17, t10, n10, r10) {
  let i10 = t10.bm ? Hb(t10.bm, (e18) => typeof e18 == `string` ? e18 : void 0) : Bb(), a10 = Math.max(1, Math.round(t10.w)), o10 = Math.max(1, Math.round(t10.h)), s10 = n10 && i10.path ? qb(t10.id) : /* @__PURE__ */ new Set(), c10 = `${a10}x${o10}|${n10}|${[...s10].join(`,`)}|${JSON.stringify(t10.bm ?? null)}`;
  if (e17.dataset.k === c10) return;
  e17.dataset.k = c10, e17.setAttribute(`aria-label`, Qb(t10));
  let l10 = r10.assets ?? {};
  e17.innerHTML = Zb(i10, a10, o10, { src: (e18) => {
    let t11 = l10[e18];
    return t11 ? r10.assetUrl ? r10.assetUrl(t11) : t11.dataUrl : void 0;
  }, done: s10, live: n10 });
}
function Qb(e17) {
  let t10 = e17.bm;
  return t10?.links.length ? `${t10.title || `Linksammlung`}: ${t10.links.map((e18, n10) => `${t10.path ? `${n10 + 1}. ` : ``}${e18.title || Gb(e18.url)}`).join(`, `)}` : `Linksammlung`;
}
function Nue(e17, t10, n10) {
  let r10 = e17.bm;
  if (!r10) return null;
  if (t10?.closest?.(`[data-a="reset"]`)) return Jb(e17.id, /* @__PURE__ */ new Set()), n10(), null;
  let i10 = t10?.closest?.(`[data-i]`);
  if (!i10) return null;
  let a10 = Number(i10.getAttribute(`data-i`)), o10 = r10.links[a10], s10 = o10 ? Vb(o10.url) : null;
  if (!s10) return null;
  if (r10.path) {
    let t11 = qb(e17.id);
    if (a10 > Yb(t11, r10.links.length)) return i10.classList.remove(`is-nope`), i10.offsetWidth, i10.classList.add(`is-nope`), `\xD6ffne zuerst Link ${Yb(t11, r10.links.length) + 1}.`;
    t11.add(a10), Jb(e17.id, t11), n10();
  }
  return window.open(s10, `_blank`, `noopener`), null;
}
var Pue = `
.lh-bm{position:relative;box-sizing:border-box;overflow:hidden;font-family:'Nunito',Nunito,system-ui,sans-serif;color:#1e293b;line-height:1.2}
.lh-bm *{box-sizing:border-box}
.lh-bm-title{position:absolute;display:flex;align-items:center;justify-content:center;font-weight:800;text-align:center;white-space:nowrap;overflow:hidden;color:var(--bc)}
.lh-bm-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#64748b;text-align:center;padding:5%}
.lh-bm-line{position:absolute;left:0;top:0;pointer-events:none}
.lh-bm-link{position:absolute;display:flex;overflow:hidden;background:#fff;border-radius:16px;box-shadow:0 3px 10px rgba(15,23,42,.14);border:2px solid #e2e8f0;cursor:pointer}
.lh-bm-img{display:block;object-fit:cover;background:#f1f5f9;flex:none}
.lh-bm-noimg{display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;background:var(--bc);line-height:1}
.lh-bm-text{display:flex;flex-direction:column;gap:.25em;min-width:0;padding:.55em .7em;flex:1}
.lh-bm-t{font-weight:800;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.lh-bm-d{color:#475569;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.lh-bm-u{color:var(--bc);font-weight:700;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-top:auto}
.lh-bm-cards .lh-bm-link{flex-direction:column}
.lh-bm-cards .lh-bm-img{width:100%;height:52%}
.lh-bm-list .lh-bm-link{flex-direction:row;align-items:stretch}
.lh-bm-list .lh-bm-img{height:100%;aspect-ratio:1/1}
.lh-bm-list .lh-bm-text{justify-content:center}
.lh-bm-list .lh-bm-u{margin-top:0}
.lh-bm-tiles .lh-bm-img{position:absolute;inset:0;width:100%;height:100%}
.lh-bm-tiles .lh-bm-text{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(transparent,rgba(15,23,42,.82));color:#fff;padding-top:2em}
.lh-bm-tiles .lh-bm-u{color:#e2e8f0}
.lh-bm-buttons .lh-bm-link{flex-direction:row;align-items:center;border-radius:999px;border-color:var(--bc);border-width:3px;padding:0 .4em}
.lh-bm-buttons .lh-bm-img{height:78%;aspect-ratio:1/1;border-radius:50%;margin-left:.3em}
.lh-bm-buttons .lh-bm-text{justify-content:center}
.lh-bm-num{position:absolute;left:.35em;top:.35em;min-width:1.7em;height:1.7em;border-radius:999px;background:var(--bc);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px #fff}
.lh-bm-buttons .lh-bm-num,.lh-bm-list .lh-bm-num{position:static;order:-1;margin:0 .1em 0 .45em;align-self:center;flex:none}
.lh-bm-link.is-done{border-color:#22c55e}
.lh-bm-link.is-done .lh-bm-num{background:#16a34a}
.lh-bm-link.is-next{border-color:var(--bc);box-shadow:0 0 0 3px var(--bc),0 3px 10px rgba(15,23,42,.14)}
.lh-bm-link.is-locked{cursor:default}
.lh-bm-link.is-locked>.lh-bm-img,.lh-bm-link.is-locked>.lh-bm-text{filter:grayscale(1);opacity:.45}
.lh-bm-lock{position:absolute;right:.35em;top:.3em;line-height:1}
.lh-bm-buttons .lh-bm-lock{position:static;order:2;align-self:center;margin:0 .5em 0 .2em}
.lh-bm-link.is-nope{animation:lh-bm-nope .45s ease-in-out}
@keyframes lh-bm-nope{20%{transform:translateX(-10px)}40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(4px)}}
.lh-bm-reset{position:absolute;border:0;border-radius:999px;background:#fff;color:#334155;font-weight:700;padding:.35em .9em;box-shadow:0 2px 6px rgba(15,23,42,.18);cursor:pointer;font-family:inherit}`;
var $b = 1400;
var ex = 6e4;
var tx = 400;
var nx = [{ id: `meadow`, label: `Wiese` }, { id: `forest`, label: `Wald` }, { id: `room`, label: `Zimmer` }, { id: `street`, label: `Stadt` }, { id: `beach`, label: `Strand` }, { id: `space`, label: `Weltraum` }, { id: `stage`, label: `B\xFChne` }];
var rx = /* @__PURE__ */ new WeakSet();
var ix = (e17, t10) => !!e17.heard || t10.h === 1;
var ax = (e17, t10, n10) => Math.max(t10, Math.min(n10, e17));
var ox = (e17, t10, n10, r10) => typeof e17 == `number` && Number.isFinite(e17) ? ax(e17, n10, r10) : t10;
function sx(e17, t10) {
  let n10 = e17 && typeof e17 == `object` ? e17 : {}, r10 = [];
  for (let e18 of Array.isArray(n10.cast) ? n10.cast.slice(0, 6) : []) {
    let t11 = e18 && typeof e18 == `object` ? e18 : {};
    r10.push({ av: $u(t11.av), x: Math.round(ox(t11.x, 700, 0, $b)), y: Math.round(ox(t11.y, 760, 200, 860)), s: ox(t11.s, 1, 0.5, 1.8) });
  }
  let i10 = t10(n10.img, `image`), a10, o10 = n10.take, s10 = o10 ? t10(o10.sound, `audio`) : void 0;
  if (o10 && s10 && Array.isArray(o10.moves) && o10.moves.length === r10.length) {
    let e18 = (e19, t11) => Array.isArray(e19) ? e19.filter((e20) => typeof e20 == `number` && Number.isFinite(e20)).slice(0, t11).map((e20) => Math.round(e20)) : [];
    if (a10 = { sound: s10, dur: Math.round(ox(o10.dur, 0, 0, 62e3)), moves: o10.moves.map((t11) => {
      let n11 = e18(t11, 4500);
      return n11.slice(0, n11.length - n11.length % 3);
    }), talk: (() => {
      let t11 = e18(o10.talk, 1200);
      return t11.slice(0, t11.length - t11.length % 2);
    })() }, Array.isArray(o10.vis) && o10.vis.length === r10.length && (a10.vis = o10.vis.map((t11) => e18(t11, 200).sort((e19, t12) => e19 - t12))), Array.isArray(o10.acts)) {
      let e19 = o10.acts.filter((e20) => !!e20 && typeof e20 == `object` && typeof e20.id == `string`).slice(0, 200).map((e20) => ({ t: Math.round(ox(e20.t, 0, 0, 6200)), id: String(e20.id).slice(0, 60), d: Math.round(ox(e20.d, 100, 1, 6200)), ...e20.h === 1 ? { h: 1 } : {} }));
      e19.length && (a10.acts = e19);
    }
    o10.heard === true && (a10.heard = true);
  }
  return { title: typeof n10.title == `string` ? n10.title.slice(0, 80) : ``, back: nx.some((e18) => e18.id === n10.back) ? n10.back : `meadow`, ...i10 ? { img: i10 } : {}, cast: r10, ...a10 ? { take: a10 } : {}, ...n10.next === true ? { next: true } : {} };
}
var cx = (e17, t10) => `<defs><linearGradient id="thsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${e17}"/><stop offset="1" stop-color="${t10}"/></linearGradient></defs><rect width="1400" height="860" fill="url(#thsky)"/>`;
var lx = (e17, t10, n10 = 1) => `<g transform="translate(${e17} ${t10}) scale(${n10})" fill="#fff" opacity=".92"><ellipse cx="0" cy="0" rx="70" ry="34"/><ellipse cx="-50" cy="12" rx="48" ry="26"/><ellipse cx="55" cy="10" rx="50" ry="28"/></g>`;
var ux = (e17, t10, n10 = 1, r10 = `#16a34a`) => `<g transform="translate(${e17} ${t10}) scale(${n10})"><rect x="-14" y="-40" width="28" height="120" rx="8" fill="#92400e"/><circle cx="0" cy="-90" r="80" fill="${r10}"/><circle cx="-50" cy="-50" r="55" fill="${r10}"/><circle cx="50" cy="-50" r="55" fill="${r10}"/></g>`;
var Iue = (e17, t10, n10 = 1) => `<g transform="translate(${e17} ${t10}) scale(${n10})"><rect x="-12" y="-20" width="24" height="70" fill="#78350f"/><path d="M0-260L90-20H-90Z" fill="#166534"/><path d="M0-300L70-120H-70Z" fill="#15803d"/></g>`;
function Lue(e17) {
  let t10 = ``;
  switch (e17) {
    case `forest`:
      t10 = cx(`#a7f3d0`, `#ecfccb`) + `<rect y="600" width="1400" height="260" fill="#65a30d"/>`;
      for (let e18 = 0; e18 < 9; e18++) t10 += Iue(60 + e18 * 160, 560 + e18 % 2 * 30, 0.9 + e18 % 3 * 0.12);
      t10 += `<ellipse cx="300" cy="760" rx="120" ry="18" fill="#4d7c0f"/><ellipse cx="1100" cy="740" rx="150" ry="20" fill="#4d7c0f"/>`;
      for (let e18 = 0; e18 < 6; e18++) t10 += `<circle cx="${140 + e18 * 230}" cy="${780 + e18 % 2 * 40}" r="10" fill="#ef4444"/><circle cx="${140 + e18 * 230}" cy="${780 + e18 % 2 * 40}" r="4" fill="#fde047"/>`;
      break;
    case `room`:
      t10 = `<rect width="1400" height="860" fill="#fde68a"/><rect y="620" width="1400" height="240" fill="#b45309"/>`;
      for (let e18 = 0; e18 < 8; e18++) t10 += `<path d="M${e18 * 180} 620V860" stroke="#92400e" stroke-width="4"/>`;
      t10 += `<rect y="600" width="1400" height="24" fill="#92400e"/><rect x="900" y="140" width="300" height="250" rx="10" fill="#bae6fd" stroke="#fff" stroke-width="16"/><path d="M1050 140V390M900 265H1200" stroke="#fff" stroke-width="12"/>`, t10 += `<rect x="220" y="170" width="200" height="150" fill="#fff" stroke="#78350f" stroke-width="12"/><path d="M240 300l50-60 40 40 30-30 40 50z" fill="#22c55e"/><circle cx="380" cy="210" r="16" fill="#facc15"/>`, t10 += `<path d="M640 0V80" stroke="#334155" stroke-width="4"/><path d="M600 80h80l-15 40h-50z" fill="#f97316"/>`;
      break;
    case `street`:
      t10 = cx(`#7dd3fc`, `#e0f2fe`) + lx(300, 120) + lx(1050, 90, 0.8), [[40, 260, 240, `#fca5a5`], [300, 200, 220, `#fde68a`], [540, 300, 260, `#a5b4fc`], [820, 230, 230, `#86efac`], [1070, 280, 290, `#fdba74`]].forEach(([e18, n10, r10, i10]) => {
        t10 += `<rect x="${e18}" y="${n10}" width="${r10}" height="${620 - n10}" fill="${i10}" stroke="#475569" stroke-width="4"/><path d="M${e18} ${n10}l${r10 / 2} -70 ${r10 / 2} 70z" fill="#b91c1c" stroke="#475569" stroke-width="4"/>`;
        for (let i11 = 0; i11 < 3; i11++) for (let a10 = 0; a10 < 2; a10++) n10 + 40 + i11 * 110 < 560 && (t10 += `<rect x="${e18 + 30 + a10 * (r10 - 100)}" y="${n10 + 40 + i11 * 110}" width="40" height="55" fill="#e0f2fe" stroke="#475569" stroke-width="3"/>`);
      }), t10 += `<rect y="620" width="1400" height="90" fill="#cbd5e1"/><rect y="700" width="1400" height="160" fill="#475569"/>`;
      for (let e18 = 0; e18 < 8; e18++) t10 += `<rect x="${40 + e18 * 180}" y="772" width="100" height="14" fill="#f8fafc"/>`;
      break;
    case `beach`:
      t10 = cx(`#38bdf8`, `#e0f2fe`) + `<circle cx="1180" cy="140" r="70" fill="#fde047"/>` + lx(380, 130, 0.9), t10 += `<rect y="470" width="1400" height="200" fill="#0ea5e9"/><path d="M0 520q60-20 120 0t120 0 120 0 120 0 120 0 120 0 120 0 120 0 120 0 120 0 120 0 120 0" fill="none" stroke="#e0f2fe" stroke-width="6"/>`, t10 += `<path d="M0 640q350-60 700 0t700 0V860H0z" fill="#fde68a"/>`, t10 += `<path d="M180 760q-10-200 40-330" stroke="#92400e" stroke-width="26" fill="none" stroke-linecap="round"/><g fill="#16a34a"><path d="M220 430q-120-30-170 40 90-40 170-40z"/><path d="M220 430q120-40 170 30-90-30-170-30z"/><path d="M220 430q-40-110 30-150-10 90-30 150z"/><path d="M220 430q-110 20-130 120 50-80 130-120z"/></g>`, t10 += `<circle cx="1000" cy="760" r="34" fill="#ef4444"/><path d="M966 760h68" stroke="#fff" stroke-width="10"/>`;
      break;
    case `space`:
      t10 = `<rect width="1400" height="860" fill="#0f172a"/>`;
      for (let e18 = 0; e18 < 70; e18++) t10 += `<circle cx="${e18 * 197 % 1400}" cy="${e18 * 113 % 560}" r="${1 + e18 % 3}" fill="#fff" opacity="${0.4 + e18 % 5 * 0.12}"/>`;
      t10 += `<circle cx="1100" cy="170" r="90" fill="#f97316"/><ellipse cx="1100" cy="170" rx="150" ry="26" fill="none" stroke="#fde68a" stroke-width="10" transform="rotate(-18 1100 170)"/><circle cx="260" cy="150" r="40" fill="#a5b4fc"/>`, t10 += `<path d="M0 640q350-50 700 0t700 0V860H0z" fill="#94a3b8"/><ellipse cx="400" cy="760" rx="70" ry="16" fill="#64748b"/><ellipse cx="1050" cy="720" rx="90" ry="18" fill="#64748b"/>`;
      break;
    case `stage`:
      t10 = `<rect width="1400" height="860" fill="#1f2937"/><path d="M200 0h1000l-140 620H340z" fill="#fef3c7" opacity=".14"/><rect y="620" width="1400" height="240" fill="#a16207"/>`;
      for (let e18 = 0; e18 < 8; e18++) t10 += `<path d="M${e18 * 180} 620V860" stroke="#854d0e" stroke-width="4"/>`;
      t10 += `<path d="M0 0V720Q120 560 260 300 300 120 330 0Z" fill="#b91c1c"/><path d="M1400 0V720Q1280 560 1140 300 1100 120 1070 0Z" fill="#b91c1c"/>`, t10 += `<path d="M60 0v700M140 0v600M220 0v420M1340 0v700M1260 0v600M1180 0v420" stroke="#991b1b" stroke-width="10"/><rect width="1400" height="70" fill="#991b1b"/><path d="M0 70q70 40 140 0t140 0 140 0 140 0 140 0 140 0 140 0 140 0 140 0 140 0" fill="#b91c1c"/>`;
      break;
    default:
      t10 = cx(`#7dd3fc`, `#e0f2fe`) + `<circle cx="1200" cy="130" r="64" fill="#fde047"/>` + lx(280, 120) + lx(800, 80, 0.8), t10 += `<path d="M0 560q300-120 700-20t700 0V860H0z" fill="#86efac"/><path d="M0 640q400-80 800 0t600 -10V860H0z" fill="#4ade80"/>`, t10 += ux(180, 560, 0.9) + ux(1240, 600, 1.05, `#22c55e`);
      for (let e18 = 0; e18 < 12; e18++) {
        let n10 = 90 + e18 * 115, r10 = 720 + e18 % 3 * 40;
        t10 += `<circle cx="${n10}" cy="${r10}" r="9" fill="${[`#f472b6`, `#facc15`, `#fff`][e18 % 3]}"/><circle cx="${n10}" cy="${r10}" r="3.5" fill="#f59e0b"/>`;
      }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 860" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">${t10}</svg>`;
}
var dx = (e17) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(Lue(e17))}`;
function fx(e17, t10, n10, r10) {
  let i10 = e17.moves[t10];
  if (!i10 || i10.length < 3) return { x: n10.x, y: n10.y };
  let a10 = r10 / 10;
  if (a10 <= i10[0]) return { x: i10[1], y: i10[2] };
  for (let e18 = 3; e18 < i10.length; e18 += 3) if (i10[e18] >= a10) {
    let t11 = i10[e18 - 3], n11 = i10[e18] === t11 ? 1 : (a10 - t11) / (i10[e18] - t11);
    return { x: i10[e18 - 2] + (i10[e18 + 1] - i10[e18 - 2]) * n11, y: i10[e18 - 1] + (i10[e18 + 2] - i10[e18 - 1]) * n11 };
  }
  return { x: i10[i10.length - 2], y: i10[i10.length - 1] };
}
var px = (e17, t10) => e17?.vis?.[t10]?.length === 0 && (e17.moves[t10]?.length ?? 0) < 3;
function mx(e17, t10, n10) {
  let r10 = e17?.vis?.[t10];
  if (!r10) return true;
  let i10 = n10 / 10, a10 = false;
  for (let e18 = 0; e18 < r10.length && r10[e18] <= i10; e18++) a10 = e18 % 2 == 0;
  return a10;
}
function hx(e17, t10) {
  let n10 = t10 / 10, r10 = -1;
  for (let t11 = 0; t11 + 1 < e17.talk.length && !(e17.talk[t11] > n10); t11 += 2) r10 = e17.talk[t11 + 1];
  return r10;
}
var gx = /* @__PURE__ */ new Map();
var _x = /* @__PURE__ */ new Map();
var vx = /* @__PURE__ */ new Map();
function yx(e17) {
  return sx(e17.th, (e18) => typeof e18 == `string` ? e18 : void 0);
}
function bx(e17) {
  let t10 = gx.get(e17.id);
  return t10?.cast ?? t10?.mem?.cast ?? yx(e17).cast;
}
function xx(e17) {
  let t10 = gx.get(e17.id), n10 = yx(e17);
  t10?.cast && t10.mode === `idle` && n10.cast.length === t10.cast.length && (t10.cast = void 0);
  let r10 = t10?.cast ?? t10?.mem?.cast ?? n10.cast;
  if (!t10 || t10.figs.length !== r10.length) {
    let i10 = t10?.mem?.take ?? n10.take, a10 = Math.min(t10?.pos ?? 0, i10?.dur ?? 0);
    t10 = { mode: `idle`, figs: r10.map((e18, t11) => {
      let n11 = i10 ? fx(i10, t11, e18, a10) : e18;
      return { x: n11.x, y: n11.y, phase: 0, walk: 0, mouth: -1, on: px(i10, t11) || mx(i10, t11, a10) };
    }), speaker: -1, t0: 0, raf: 0, pos: a10, moves: [], talk: [], vis: [], acts: [], lastSample: [], token: 0, ...t10?.mem ? { mem: t10.mem } : {}, ...t10?.cast ? { cast: t10.cast } : {} }, gx.set(e17.id, t10);
  }
  return t10;
}
var Sx = null;
function zue(e17) {
  Sx = e17;
}
var Cx = null;
function Bue(e17) {
  Cx = e17;
}
var wx = null;
function Vue(e17) {
  wx = e17;
}
var Tx = () => !!wx?.playOnly;
function Ex(e17, t10) {
  return tS(e17)?.parentElement?.querySelector(`.lh-item[data-id="${CSS.escape(t10)}"]`) ?? null;
}
var Dx = (e17) => {
  for (let t10 of wx?.pages() ?? []) for (let n10 of t10.items) if (n10.id === e17 && n10.type === `widget`) return n10;
};
var Ox = (e17) => !!e17?.say?.sound;
function Wue(e17, t10, n10) {
  let r10 = Dx(t10.id), i10 = Ex(e17, t10.id);
  if (!r10 || !i10) return;
  if (Ox(r10) && !ix(n10, t10)) {
    r10.kind === `avatar` ? jne(r10, i10) : r10.kind === `phototalk` && Du(r10, i10);
    return;
  }
  let a10 = gx.get(e17)?.env, o10 = (e18) => a10 ? a10[Math.floor((t10.t * 10 + e18) / 1e3 * 30)] ?? 0 : 0;
  r10.kind === `avatar` ? Ane(r10, i10, t10.d * 10, o10) : r10.kind === `phototalk` && Ou(r10, i10, t10.d * 10, o10);
}
var Ax = (e17, t10) => !!e17.acts?.some((n10) => t10 >= n10.t * 10 && t10 < (n10.t + n10.d) * 10 && (ix(e17, n10) || !Ox(Dx(n10.id))));
function jx(e17, t10) {
  if (!t10) return;
  let n10 = vx.get(e17), r10 = n10?.assets[t10];
  return r10 ? n10?.assetUrl ? n10.assetUrl(r10) : r10.dataUrl : wx?.src(t10);
}
function Mx(e17) {
  let t10 = gx.get(e17.id);
  if (t10?.mem) return t10.mem;
  let n10 = yx(e17), r10 = n10.take ? jx(e17.id, n10.take.sound) : void 0;
  return n10.take && r10 ? { take: n10.take, url: r10, cast: n10.cast } : null;
}
var Nx = (e17) => e17?.items.find((e18) => e18.type === `widget` && e18.kind === `theater`);
function Px(e17) {
  let t10 = wx?.pages() ?? [], n10 = t10.findIndex((t11) => t11.items.some((t12) => t12.id === e17.id));
  if (n10 < 0) return [e17];
  let r10 = (e18) => {
    let t11 = Nx(e18);
    return t11 && Mx(t11) ? t11 : void 0;
  }, i10 = n10, a10 = n10;
  for (; r10(t10[i10 - 1]); ) i10--;
  for (; r10(t10[a10 + 1]); ) a10++;
  return t10.slice(i10, a10 + 1).map((r11) => r11.id === t10[n10].id ? e17 : Nx(r11));
}
var Fx = null;
function Kue(e17) {
  let t10 = wx?.pages() ?? [], n10 = t10.findIndex((t11) => t11.items.some((t12) => t12.id === e17.id)), r10 = Nx(t10[n10 + 1]);
  n10 < 0 || !r10 || !wx || (Fx = r10.id, wx.show(n10 + 1));
}
var Ix = (e17) => {
  let t10 = Math.max(0, Math.round(e17 / 1e3));
  return `${Math.floor(t10 / 60)}:${String(t10 % 60).padStart(2, `0`)}`;
};
var Lx = (e17) => e17.mode === `rec` ? performance.now() - e17.t0 : e17.pos;
var Rx = (e17) => ax(e17 / ex * 100, 0, 100).toFixed(2);
var zx = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/"/g, `&quot;`);
var Bx = (e17) => `${Math.round(e17 * 10) / 10}px`;
function Vx(e17, t10, n10) {
  let r10 = tx * e17.s;
  return { left: t10 - r10 / 4, top: n10 - r10, w: r10 / 2, h: r10 };
}
var Hx = 150;
var Ux = 120;
function Wx(e17, t10, n10) {
  let r10 = Vx(e17, t10, n10), i10 = id(e17.av), a10 = r10.top + (i10.hy - i10.ry - 12) / 400 * r10.h;
  return { left: t10 - Hx / 2, top: Math.max(0, a10 - Ux + 6), w: Hx, h: Ux };
}
var que = (e17) => Math.min(856, 24 + tx * e17.s * 0.94);
var Gx = (e17) => tx * e17.s / 4;
var Jue = 24;
var Kx = (e17) => e17 < 700 ? Jue : 1376;
var Yue = (e17, t10) => t10 < 700 ? -(Gx(e17) + 30) : $b + Gx(e17) + 30;
var qx = (e17, t10) => !Tx() && (t10.mode === `rec` || t10.mode === `idle` && !!Mx(e17));
function Jx(e17, t10, n10) {
  return n10.on ? { x: n10.x, y: n10.y, cls: `` } : qx(e17, t10) ? { x: Kx(n10.x), y: n10.y, cls: ` is-wing` } : { x: n10.x, y: n10.y, cls: ` is-off` };
}
var Xue = `<svg viewBox="0 0 ${Hx} ${Ux}" width="100%" height="100%" aria-hidden="true"><g stroke="#0f172a" stroke-opacity=".38" stroke-width="2" stroke-linecap="round"><path d="M25 34L47 ${Ux}M125 34L103 ${Ux}M75 58V${Ux}" fill="none"/></g><rect x="13" y="14" width="124" height="22" rx="11" fill="#fff" fill-opacity=".6" stroke="#0f172a" stroke-opacity=".4" stroke-width="3"/><rect x="64" y="3" width="22" height="58" rx="11" fill="#fff" fill-opacity=".6" stroke="#0f172a" stroke-opacity=".4" stroke-width="3"/><circle cx="75" cy="25" r="7" fill="#2563eb" fill-opacity=".55"/></svg>`;
var Zue = { rec: { label: `Aufnehmen`, icon: `<circle cx="12" cy="12" r="7" fill="currentColor"/>`, cls: `is-rec` }, stop: { label: `Stopp`, icon: `<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>` }, play: { label: `Abspielen`, icon: `<path d="M8 5l11 7-11 7z" fill="currentColor"/>`, cls: `is-play` }, reset: { label: `Anfang`, icon: `<rect x="4" y="5" width="3" height="14" rx="1" fill="currentColor"/><path d="M20 5v14L9 12z" fill="currentColor"/>` }, video: { label: `Video`, icon: `<rect x="3" y="6" width="13" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M16 10l5-3v10l-5-3z" fill="currentColor"/>` } };
function Yx(e17, t10, n10) {
  if (!t10) return Tx() ? `Hier gibt es noch kein St\xFCck zum Abspielen.` : `Zieh die Figuren an den Griffen \xFCber dem Kopf \u2013 \u25CF nimmt Stimme und Bewegung auf (bis 1 Minute)`;
  let r10 = `${Ix(n10)} / ${Ix(t10)}`;
  return Tx() ? r10 : `${r10} \xB7 \u25CF ${n10 <= 0 ? `nimmt neu auf` : n10 >= t10 - 300 ? `nimmt weiter auf` : `nimmt ab hier neu auf`}`;
}
function Xx(e17, t10) {
  let n10 = yx(e17), r10 = gx.get(e17.id), i10 = r10?.mode ?? `idle`, a10 = (t10 ? Mx(e17)?.take.dur : n10.take?.dur) ?? 0, o10 = a10 > 0, s10 = Math.min(r10?.pos ?? 0, ex), c10 = (e18, t11) => {
    let n11 = Zue[e18];
    return `<button type="button" class="lh-th-btn lh-key ${n11.cls ?? ``}" data-a="${e18}"${t11 ? `` : ` disabled`}><svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">${n11.icon}</svg><span>${n11.label}</span></button>`;
  }, l10 = i10 !== `idle`, u10 = `<div class="lh-th-bar" style="top:860px;height:130px">`;
  u10 += l10 ? c10(`stop`, true) : (Tx() ? `` : c10(`rec`, bx(e17).length > 0)) + c10(`play`, o10);
  let d10 = i10 === `count` ? `Gleich geht es los \u2026` : i10 === `rec` ? `${Ix(s10)} / 1:00` : l10 ? `${Ix(s10)} / ${Ix(a10)}` : Yx(e17, a10, s10);
  return u10 += `<div class="lh-th-mid"><div class="lh-th-title">${zx(n10.title || `Puppentheater`)}</div><div class="lh-th-time" data-time>${zx(d10)}</div>`, u10 += `<div class="lh-th-prog${o10 ? ` is-seek` : ``}" data-track title="Stelle w\xE4hlen"><b data-took style="width:${Rx(a10)}%"></b><i data-prog style="width:${Rx(s10)}%"></i><span class="lh-th-knob" data-knob style="left:${Rx(s10)}%"></span></div></div>`, l10 || (u10 += (Tx() ? `` : c10(`reset`, true)) + c10(`video`, o10)), u10 + `</div>`;
}
function Que(e17) {
  if (!e17.over) return ``;
  let t10 = (e18, t11, n10 = ``) => `<button type="button" class="lh-key ${n10}" data-a="${e18}">${t11}</button>`;
  return `<div class="lh-th-over"><div class="lh-th-box"><div class="lh-th-head">Was soll ins Video?</div><div class="lh-th-asks">${t10(`v1`, `Nur diese Seite`, `lh-th-ask`)}${t10(`vall`, `Alle ${e17.over.ask} Seiten \u2013 das ganze St\xFCck`, `lh-th-ask is-main`)}</div>${t10(`close`, `Abbrechen`, `lh-th-close`)}</div></div>`;
}
function Zx(e17, t10, n10, r10) {
  n10 && r10.assets && vx.set(t10.id, { assets: r10.assets, assetUrl: r10.assetUrl });
  let i10 = r10.assets ? { assets: r10.assets, assetUrl: r10.assetUrl } : vx.get(t10.id), a10 = yx(t10), o10 = a10.img ? i10?.assets[a10.img] : void 0, s10 = o10 ? i10?.assetUrl ? i10.assetUrl(o10) : o10.dataUrl : ``, c10 = n10 ? xx(t10) : null, l10 = n10 ? bx(t10) : a10.cast, u10 = `${n10}|${JSON.stringify(a10)}|${s10.length}|${Math.round(t10.w)}x${Math.round(t10.h)}|${l10.length}`;
  if (n10 && _x.set(t10.id, t10), n10 && Fx === t10.id && (Fx = null, setTimeout(() => {
    let e18 = _x.get(t10.id);
    if (!e18 || !tS(t10.id)) return;
    let n11 = xx(e18);
    n11.mode === `idle` && (n11.pos = 0, dS(e18));
  }, 700)), e17.dataset.k === u10) return;
  e17.dataset.k = u10, e17.dataset.thId = t10.id, e17.setAttribute(`aria-label`, `${a10.title || `Puppentheater`}: ${l10.length} Figuren`);
  let d10 = t10.w / $b, f10 = t10.h / 990, p10 = `<div class="lh-th${c10 && (c10.mode === `play` || c10.mode === `video`) ? ` is-playing` : ``}" style="width:${$b}px;height:990px;transform:scale(${d10},${f10})">`;
  p10 += `<div class="lh-th-stage" style="height:860px">`, p10 += s10 ? `<img class="lh-th-back" src="${zx(s10)}" alt="" draggable="false">` : `<img class="lh-th-back" src="${dx(a10.back)}" alt="" draggable="false">`, l10.forEach((e18, r11) => {
    let i11 = c10 ? c10.figs[r11]?.on !== false : mx(a10.take, r11, 0);
    if (!c10 && !i11) return;
    let o11 = c10 && c10.figs[r11] ? Jx(t10, c10, c10.figs[r11]) : { x: e18.x, y: e18.y, cls: `` }, s11 = { x: o11.x, y: o11.y }, l11 = Vx(e18, s11.x, s11.y), u11 = o11.cls, d11 = n10 ? ld(e18.av) : `<img src="${pd(e18.av)}" alt="" draggable="false">`;
    if (p10 += `<div class="lh-th-fig${u11}" data-f="${r11}" style="left:${Bx(l11.left)};top:${Bx(l11.top)};width:${Bx(l11.w)};height:${Bx(l11.h)};z-index:${Math.round(s11.y)}">${d11}</div>`, n10 && !Tx()) {
      let t11 = Wx(e18, s11.x, s11.y);
      p10 += `<div class="lh-th-grip${u11}" data-f="${r11}" title="Hier anfassen und ziehen" style="left:${Bx(t11.left)};top:${Bx(t11.top)};width:${Bx(t11.w)};height:${Bx(t11.h)}">${Xue}</div>`;
    }
  }), p10 += `<div class="lh-th-count" hidden></div><div class="lh-th-note" hidden></div>${c10 ? Que(c10) : ``}</div>`, p10 += Xx(t10, n10), e17.innerHTML = p10 + `</div>`, n10 && ($ue(e17), Si(e17, { slide: false, silent: true, hit: (e18) => eS(t10.id, e18) }));
}
function Qx(e17) {
  let t10 = _x.get(e17), n10 = tS(e17);
  t10 && n10 && (n10.dataset.k = ``, Zx(n10, t10, true, {}));
}
function $x(e17) {
  let t10 = _x.get(e17), n10 = tS(e17);
  if (!t10 || !n10) return;
  let r10 = n10.querySelector(`.lh-th-bar`);
  if (!r10) return;
  let i10 = document.createElement(`div`);
  i10.innerHTML = Xx(t10, true), r10.replaceWith(i10.firstElementChild);
  let a10 = gx.get(e17);
  n10.querySelector(`.lh-th`)?.classList.toggle(`is-playing`, a10?.mode === `play` || a10?.mode === `video`), Si(n10, { slide: false, silent: true, hit: (t11) => eS(e17, t11) });
}
function eS(e17, t10) {
  let n10 = t10.getAttribute(`data-a`);
  if (!n10) return null;
  let r10 = false;
  return { release: () => {
    if (r10) return;
    r10 = true;
    let t11 = _x.get(e17);
    t11 && nde(t11, n10);
  } };
}
function tS(e17) {
  for (let t10 of document.querySelectorAll(`.lh-wg-theater.is-live`)) if (t10.dataset.thId === e17) return t10;
  return null;
}
function nS(e17) {
  let t10 = _x.get(e17), n10 = gx.get(e17), r10 = tS(e17);
  if (!t10 || !n10 || !r10) return;
  let i10 = bx(t10);
  r10.querySelectorAll(`.lh-th-fig`).forEach((e18) => {
    let a10 = Number(e18.dataset.f), o10 = i10[a10], s10 = n10.figs[a10];
    if (!o10 || !s10) return;
    let c10 = Jx(t10, n10, s10), l10 = Vx(o10, c10.x, c10.y);
    e18.style.left = Bx(l10.left), e18.style.top = Bx(l10.top), e18.style.zIndex = String(Math.round(c10.y)), e18.classList.toggle(`is-speaker`, n10.speaker === a10 && n10.mode !== `idle`), e18.classList.toggle(`is-off`, c10.cls === ` is-off`), e18.classList.toggle(`is-wing`, c10.cls === ` is-wing`);
    let u10 = r10.querySelector(`.lh-th-grip[data-f="${a10}"]`);
    if (u10) {
      let e19 = Wx(o10, c10.x, c10.y);
      u10.style.left = Bx(e19.left), u10.style.top = Bx(e19.top), u10.classList.toggle(`is-off`, c10.cls === ` is-off`), u10.classList.toggle(`is-wing`, c10.cls === ` is-wing`);
    }
    let d10 = e18.querySelector(`svg`);
    if (!d10) return;
    let f10 = id(o10.av), p10 = s10.phase, m10 = s10.walk, h10 = 26 * Math.sin(p10) * m10, g10 = 14 * Math.sin(p10) * m10, _10 = -Math.abs(Math.sin(p10)) * 7 * m10;
    d10.querySelector(`.av-legL`)?.setAttribute(`transform`, `rotate(${h10.toFixed(1)} ${f10.hx - f10.lx} ${f10.hip})`), d10.querySelector(`.av-legR`)?.setAttribute(`transform`, `rotate(${(-h10).toFixed(1)} ${f10.hx + f10.lx} ${f10.hip})`), d10.querySelector(`.av-armL`)?.setAttribute(`transform`, `rotate(${(7 - g10).toFixed(1)} ${f10.hx - f10.ax} ${f10.sy + 14})`), d10.querySelector(`.av-armR`)?.setAttribute(`transform`, `rotate(${(-7 - g10).toFixed(1)} ${f10.hx + f10.ax} ${f10.sy + 14})`), d10.querySelector(`.av-all`)?.setAttribute(`transform`, `translate(0 ${_10.toFixed(1)})`);
    let v10 = d10.querySelector(`.av-mouth`), y10 = s10.mouth < 0 ? -1 : Math.round(s10.mouth * 5) / 5;
    v10 && v10.dataset.q !== String(y10) && (v10.dataset.q = String(y10), v10.innerHTML = y10 < 0 ? ad(o10.av, f10) : ad(o10.av, f10, y10));
  });
}
function rS(e17, t10, n10) {
  e17.figs.forEach((e18, r10) => {
    if (!t10[r10]) return;
    let i10 = Math.hypot(e18.x - t10[r10].x, e18.y - t10[r10].y), a10 = +((n10 > 0 && i10 < 260 ? i10 / n10 : 0) > 0.06);
    e18.walk += (a10 - e18.walk) * Math.min(1, n10 / 120), e18.phase += i10 < 260 ? Math.min(0.5, i10 * 0.035) : 0, e18.walk < 0.02 && (e18.phase = 0);
  });
}
function iS(e17, t10) {
  let n10 = xx(e17), r10 = Mx(e17)?.take;
  bx(e17).forEach((e18, i10) => {
    let a10 = n10.figs[i10];
    if (a10) {
      if (r10 && i10 < r10.moves.length) {
        let n11 = fx(r10, i10, e18, t10);
        Object.assign(a10, { x: n11.x, y: n11.y, on: px(r10, i10) || mx(r10, i10, t10) });
      } else r10 || Object.assign(a10, { x: e18.x, y: e18.y });
      Object.assign(a10, { walk: 0, phase: 0, mouth: -1 });
    }
  }), r10 && (n10.speaker = hx(r10, t10)), nS(e17.id);
}
var aS = /* @__PURE__ */ new WeakSet();
function $ue(e17) {
  aS.has(e17) || (aS.add(e17), e17.addEventListener(`pointerdown`, (t10) => {
    if (t10.button > 0 || !Ti(e17)) return;
    let n10 = e17.dataset.thId ?? ``, r10 = _x.get(n10);
    if (!r10) return;
    let i10 = t10.target.closest?.(`[data-track]`);
    if (i10) {
      let e18 = xx(r10), a11 = Mx(r10)?.take.dur ?? 0;
      if (e18.mode !== `idle` || !a11) return;
      t10.stopPropagation(), t10.preventDefault();
      let o11 = (t11) => {
        let o12 = i10.getBoundingClientRect();
        e18.pos = Math.round(ax((t11 - o12.left) / Math.max(1, o12.width) * ex, 0, a11)), iS(r10, e18.pos), oS(n10, e18.pos, Yx(r10, a11, e18.pos));
      };
      o11(t10.clientX);
      let s11 = (e19) => e19.pointerId === t10.pointerId && o11(e19.clientX), c11 = (e19) => {
        e19.pointerId === t10.pointerId && (window.removeEventListener(`pointermove`, s11), window.removeEventListener(`pointerup`, c11, true), window.removeEventListener(`pointercancel`, c11, true));
      };
      window.addEventListener(`pointermove`, s11), window.addEventListener(`pointerup`, c11, true), window.addEventListener(`pointercancel`, c11, true);
      return;
    }
    let a10 = t10.target.closest?.(`.lh-th-grip, .lh-th-fig`);
    if (!a10 || a10.classList.contains(`is-off`) || Tx()) return;
    let o10 = e17.querySelector(`.lh-th-fig[data-f="${a10.dataset.f}"]`), s10 = e17.querySelector(`.lh-th-grip[data-f="${a10.dataset.f}"]`);
    if (!o10) return;
    let c10 = xx(r10);
    if (c10.mode === `play` || c10.mode === `video` || c10.mode === `count` || c10.over) return;
    t10.stopPropagation(), t10.preventDefault();
    let l10 = Number(o10.dataset.f), u10 = e17.querySelector(`.lh-th-stage`).getBoundingClientRect(), d10 = $b / u10.width, f10 = 860 / u10.height, p10 = c10.figs[l10], m10 = bx(r10)[l10];
    if (!p10.on) {
      if (!qx(r10, c10)) return;
      if (p10.x = Kx(p10.x), p10.on = true, c10.mode === `rec`) {
        let e18 = Lx(c10), t11 = Math.round(e18 / 10);
        c10.vis[l10]?.push(t11), c10.moves[l10]?.push(t11, Math.round(p10.x), Math.round(p10.y)), c10.lastSample[l10] = { x: p10.x, y: p10.y, t: e18 };
      }
      nS(n10);
    }
    let h10 = p10.x - (t10.clientX - u10.left) * d10, g10 = p10.y - (t10.clientY - u10.top) * f10;
    c10.speaker !== l10 && (c10.speaker = l10, c10.mode === `rec` && c10.talk.push(Math.round(Lx(c10) / 10), l10)), o10.classList.add(`is-held`), s10?.classList.add(`is-held`);
    let _10 = que(m10), v10 = qx(r10, c10), y10 = v10 ? Gx(m10) + 40 : -40, b10 = (e18) => {
      e18.pointerId === t10.pointerId && (p10.x = ax((e18.clientX - u10.left) * d10 + h10, -y10, $b + y10), p10.y = ax((e18.clientY - u10.top) * f10 + g10, _10, 856));
    }, x10 = (e18) => {
      e18.pointerId === t10.pointerId && (window.removeEventListener(`pointermove`, b10), window.removeEventListener(`pointerup`, x10, true), window.removeEventListener(`pointercancel`, x10, true), o10.classList.remove(`is-held`), s10?.classList.remove(`is-held`), v10 && (p10.x < 0 || p10.x > 1400) && ede(r10, c10, l10), c10.mode === `idle` && !Mx(r10) && !c10.cast && (Cx?.(n10, c10.figs.map((e19) => ({ x: Math.round(e19.x), y: Math.round(e19.y) }))), nS(n10)));
    };
    window.addEventListener(`pointermove`, b10), window.addEventListener(`pointerup`, x10, true), window.addEventListener(`pointercancel`, x10, true), c10.mode === `idle` && tde(n10);
  }, true));
}
function ede(e17, t10, n10) {
  let r10 = t10.figs[n10], i10 = bx(e17)[n10];
  if (!r10 || !i10) return;
  let a10 = r10.x, o10 = Yue(i10, r10.x), s10 = performance.now(), c10 = t10.token, l10 = (i11) => {
    if (t10.token !== c10 || !r10.on) return;
    let u10 = Math.min(1, (i11 - s10) / 250);
    if (r10.x = a10 + (o10 - a10) * u10, t10.mode !== `rec` && nS(e17.id), u10 < 1) return void requestAnimationFrame(l10);
    if (r10.on = false, t10.mode === `rec`) {
      let e18 = Lx(t10), i12 = Math.round(e18 / 10);
      t10.moves[n10]?.push(i12, Math.round(r10.x), Math.round(r10.y)), t10.lastSample[n10] = { x: r10.x, y: r10.y, t: e18 }, t10.vis[n10]?.push(i12);
    }
    t10.speaker === n10 && (t10.speaker = -1), nS(e17.id);
  };
  requestAnimationFrame(l10);
}
function tde(e17) {
  let t10 = gx.get(e17);
  if (!t10 || t10.mode !== `idle` || t10.raf) return;
  let n10 = performance.now(), r10 = t10.figs.map((e18) => ({ x: e18.x, y: e18.y })), i10 = 0, a10 = (o10) => {
    let s10 = o10 - n10;
    n10 = o10, rS(t10, r10, s10);
    let c10 = t10.figs.some((e18, t11) => e18.x !== r10[t11].x || e18.y !== r10[t11].y);
    r10 = t10.figs.map((e18) => ({ x: e18.x, y: e18.y })), nS(e17), i10 = c10 ? 0 : i10 + s10, t10.mode === `idle` && i10 < 600 ? t10.raf = requestAnimationFrame(a10) : t10.raf = 0;
  };
  t10.raf = requestAnimationFrame(a10);
}
function nde(e17, t10) {
  let n10 = xx(e17);
  if (!Tx() || [`play`, `stop`, `video`, `v1`, `vall`, `close`].includes(t10)) {
    if (t10 === `rec`) sde(e17);
    else if (t10 === `stop`) uS(e17.id);
    else if (t10 === `play`) dS(e17);
    else if (t10 === `reset`) rde(e17);
    else if (t10 === `video`) {
      let t11 = Px(e17).length;
      t11 > 1 && n10.mode === `idle` ? (n10.over = { ask: t11 }, Qx(e17.id)) : hS(e17, false);
    } else t10 === `v1` || t10 === `vall` ? (n10.over = void 0, Qx(e17.id), hS(e17, t10 === `vall`)) : t10 === `close` && (n10.over = void 0, Qx(e17.id));
  }
}
function rde(e17) {
  let t10 = xx(e17);
  if (t10.mode !== `idle`) return;
  gx.delete(e17.id);
  let n10 = xx(e17);
  t10.mem && (n10.mem = t10.mem), n10.pos = 0, iS(e17, 0), Qx(e17.id);
}
function oS(e17, t10, n10, r10) {
  let i10 = tS(e17), a10 = i10?.querySelector(`[data-time]`);
  a10 && (a10.textContent = n10 ?? `${Ix(t10)} / 1:00`);
  let o10 = r10 === void 0 ? Rx(t10) : ax(r10 * 100, 0, 100).toFixed(2), s10 = i10?.querySelector(`[data-prog]`), c10 = i10?.querySelector(`[data-knob]`);
  s10 && (s10.style.width = `${o10}%`), c10 && (c10.style.left = `${o10}%`);
}
var ide = [`audio/mp4`, `audio/webm;codecs=opus`, `audio/webm`, `audio/ogg;codecs=opus`];
async function ade(e17, t10, n10, r10) {
  let i10 = (t11) => {
    let n11 = tS(e17)?.querySelector(`.lh-th-count`);
    n11 && (n11.hidden = t11 === null, n11.textContent = t11 ?? ``);
  };
  for (let e18 of [`3`, `2`, `1`]) {
    if (n10 !== t10.token || !r10()) return i10(null), false;
    i10(e18), await new Promise((e19) => setTimeout(e19, 800));
  }
  return i10(null), n10 === t10.token && r10();
}
var sS = () => navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: true } });
function cS(e17) {
  let t10 = null;
  try {
    let e18 = window.AudioContext ?? window.webkitAudioContext;
    t10 = e18 ? new e18() : null;
  } catch {
    t10 = null;
  }
  if (!t10) return { level: () => 0, close: () => void 0 };
  let n10 = t10;
  n10.resume().catch(() => void 0);
  try {
    let t11 = n10.createMediaStreamSource(e17), r10 = n10.createAnalyser();
    r10.fftSize = 1024;
    let i10 = n10.createGain();
    i10.gain.value = 0, t11.connect(r10), r10.connect(i10), i10.connect(n10.destination);
    let a10 = new Float32Array(r10.fftSize), o10 = 0, s10 = performance.now();
    return Pr(`theater-meter`, { state: n10.state, rate: n10.sampleRate }), { level: () => {
      n10.state !== `running` && n10.resume().catch(() => void 0), r10.getFloatTimeDomainData(a10);
      let e18 = 0;
      for (let t13 of a10) e18 += t13 * t13;
      let t12 = Math.sqrt(e18 / a10.length);
      return o10 = Math.max(o10, t12), performance.now() - s10 > 2e3 && (Pr(`theater-level`, { state: n10.state, peak: +o10.toFixed(4) }), o10 = 0, s10 = performance.now()), ax((t12 - 0.012) / 0.07, 0, 1);
    }, close: () => {
      try {
        t11.disconnect(), i10.disconnect();
      } catch {
      }
      n10.close().catch(() => void 0);
    } };
  } catch (e18) {
    return Pr(`theater-meter-error`, { msg: String(e18).slice(0, 60) }), n10.close().catch(() => void 0), { level: () => 0, close: () => void 0 };
  }
}
async function ode(e17, t10, n10, r10) {
  let i10 = e17.filter((e18) => e18.chunks.length);
  if (!i10.length && !r10) return null;
  if (!r10 && i10.length === 1 && i10[0].at < 60) return new Blob(i10[0].chunks, { type: n10 });
  let a10 = zr();
  if (!a10) return i10.length ? new Blob(i10[0].chunks, { type: n10 }) : null;
  let o10 = a10.sampleRate, s10 = new Float32Array(Math.ceil(t10 / 1e3 * o10) + 1), c10 = (e18, t11, n11 = 1 / 0) => {
    let r11 = e18.numberOfChannels, i11 = Array.from({ length: r11 }, (t12, n12) => e18.getChannelData(n12)), a11 = Math.round(t11 / 1e3 * o10), c11 = Math.min(e18.length, Math.round(n11 / 1e3 * o10));
    for (let e19 = 0; e19 < c11 && a11 + e19 < s10.length; e19++) {
      let t12 = 0;
      for (let n12 of i11) t12 += n12[e19];
      s10[a11 + e19] += t12 / r11;
    }
  };
  if (r10 && r10.keep > 0) try {
    c10(await a10.decodeAudioData(await (await fetch(r10.url)).arrayBuffer()), 0, r10.keep);
  } catch {
  }
  for (let e18 of i10) try {
    c10(await a10.decodeAudioData(await new Blob(e18.chunks, { type: n10 }).arrayBuffer()), e18.at);
  } catch {
  }
  return cl([s10], o10);
}
async function sde(e17) {
  let t10 = xx(e17);
  if (t10.mode !== `idle` || Tx() || typeof MediaRecorder > `u` || !navigator.mediaDevices?.getUserMedia) {
    typeof MediaRecorder > `u` && oS(e17.id, 0, `Dieser Browser kann nicht aufnehmen.`);
    return;
  }
  let n10 = ++t10.token, r10 = Mx(e17), i10 = r10 ? Math.round(ax(t10.pos, 0, r10.take.dur)) : 0;
  t10.mode = `count`, t10.over = void 0, Qx(e17.id), oS(e17.id, i10, `Gleich geht es los \u2026`);
  let a10 = ni(), o10;
  try {
    o10 = await sS();
  } catch {
    a10(), t10.mode = `idle`, Qx(e17.id), oS(e17.id, t10.pos, `Ohne Mikrofon geht keine Aufnahme \u2013 erlaube es im Browser.`);
    return;
  }
  let s10 = { stream: o10, meter: cS(o10) }, c10 = (e18) => e18.getTracks().forEach((e19) => e19.stop()), l10 = () => {
    s10.meter.close(), c10(s10.stream), a10(), a10 = () => void 0;
  };
  if (n10 !== t10.token) return l10();
  try {
    t10.guestMic = o10.getAudioTracks()[0]?.getSettings?.().echoCancellation === false;
  } catch {
    t10.guestMic = false;
  }
  t10.guestBusy = 0, t10.micLost = false;
  let u10 = ide.find((e18) => {
    try {
      return MediaRecorder.isTypeSupported(e18);
    } catch {
      return false;
    }
  }), d10 = [], f10 = (u10 ?? `audio/webm`).split(`;`)[0], p10 = (e18, t11) => {
    let n11 = new MediaRecorder(e18, u10 ? { mimeType: u10 } : {}), r11 = [];
    n11.ondataavailable = (e19) => e19.data.size && r11.push(e19.data);
    let i11 = { rec: n11, chunks: r11, at: t11, stopped: new Promise((e19) => n11.onstop = () => e19()) };
    return d10.push(i11), n11.mimeType && (f10 = n11.mimeType.split(`;`)[0]), i11;
  }, m10 = (e18) => e18.getAudioTracks().forEach((e19) => {
    e19.onmute = e19.onended = () => {
      Pr(`theater-mic-lost`, { muted: e19.muted, state: e19.readyState }), t10.micLost = true;
      for (let e20 of t10.openActs ?? []) rx.add(e20);
    };
  });
  m10(o10);
  let h10;
  try {
    h10 = p10(o10, i10);
  } catch {
    l10(), t10.mode = `idle`, Qx(e17.id);
    return;
  }
  if (!await ade(e17.id, t10, n10, () => t10.mode === `count`)) return l10();
  h10.rec.start(1e3), t10.mode = `rec`, t10.t0 = performance.now() - i10, t10.endMs = void 0, t10.level = s10.meter.level;
  let g10 = Math.round(i10 / 10), _10 = r10?.take, v10 = _10?.moves.length ?? 0;
  t10.cast = bx(e17).map((e18) => ({ ...e18 })), t10.moves = t10.figs.map((e18, n11) => {
    let r11 = Math.round(e18.x), a11 = Math.round(e18.y);
    if (!_10 || i10 === 0 || n11 >= v10) return [g10, r11, a11];
    let o11 = [];
    for (let e19 = 0; e19 + 2 < _10.moves[n11].length && _10.moves[n11][e19] < g10; e19 += 3) o11.push(_10.moves[n11][e19], _10.moves[n11][e19 + 1], _10.moves[n11][e19 + 2]);
    let s11 = fx(_10, n11, t10.cast[n11], i10);
    return o11.push(g10, Math.round(s11.x), Math.round(s11.y)), (Math.abs(s11.x - r11) > 1.5 || Math.abs(s11.y - a11) > 1.5) && o11.push(g10, r11, a11), o11;
  }), t10.vis = t10.figs.map((e18, t11) => {
    if (!_10 || i10 === 0 || t11 >= v10) return e18.on ? [g10] : [];
    let n11 = (_10.vis?.[t11] ?? [0]).filter((e19) => e19 < g10);
    return mx(_10, t11, i10) !== e18.on && n11.push(g10), n11;
  }), t10.acts = _10 && i10 > 0 ? (_10.acts ?? []).filter((e18) => e18.t < g10).map((e18) => ({ ...e18, d: Math.min(e18.d, g10 - e18.t) })) : [], t10.openActs = /* @__PURE__ */ new Set(), t10.lastSample = t10.figs.map((e18) => ({ x: e18.x, y: e18.y, t: i10 })), t10.speaker >= 0 && !t10.figs[t10.speaker]?.on && (t10.speaker = -1);
  let y10 = t10.figs.flatMap((e18, t11) => e18.on ? [t11] : []);
  t10.speaker < 0 && y10.length === 1 && (t10.speaker = y10[0]);
  let b10 = [];
  if (_10 && i10 > 0) for (let e18 = 0; e18 + 1 < _10.talk.length; e18 += 2) _10.talk[e18] < g10 && b10.push(_10.talk[e18], _10.talk[e18 + 1]);
  t10.talk = [...b10, ...t10.speaker >= 0 ? [g10, t10.speaker] : []], Qx(e17.id);
  let x10 = false, S10 = async () => {
    if (x10) return;
    x10 = true;
    let e18 = Lx(t10);
    try {
      h10.rec.state !== `inactive` && h10.rec.stop();
    } catch {
    }
    s10.meter.close(), c10(s10.stream);
    try {
      let r11 = await sS();
      if (n10 !== t10.token || t10.mode !== `rec`) {
        c10(r11);
        return;
      }
      s10 = { stream: r11, meter: cS(r11) }, m10(r11), h10 = p10(r11, Math.max(e18, Lx(t10))), h10.rec.start(1e3), t10.level = s10.meter.level, t10.micLost = false, Pr(`theater-mic-new`, {});
    } catch {
      t10.level = () => 0;
    } finally {
      x10 = false;
    }
  };
  t10.stopRec = async () => {
    try {
      h10.rec.state !== `inactive` && h10.rec.stop();
    } catch {
    }
    await Promise.all(d10.map((e18) => e18.stopped)), E10();
  };
  let C10 = performance.now(), w10 = t10.figs.map((e18) => ({ x: e18.x, y: e18.y })), T10 = (r11) => {
    if (t10.mode !== `rec` || n10 !== t10.token) return;
    let a11 = Math.max(i10, r11 - t10.t0), o11 = r11 - C10;
    C10 = r11, rS(t10, w10, o11), w10 = t10.figs.map((e18) => ({ x: e18.x, y: e18.y })), t10.figs.forEach((e18, n11) => {
      let r12 = t10.lastSample[n11];
      e18.on && r12 && a11 - r12.t >= 80 && (Math.abs(e18.x - r12.x) > 1.5 || Math.abs(e18.y - r12.y) > 1.5) && (a11 - r12.t > 160 && t10.moves[n11].push(Math.round((a11 - 80) / 10), Math.round(r12.x), Math.round(r12.y)), t10.moves[n11].push(Math.round(a11 / 10), Math.round(e18.x), Math.round(e18.y)), t10.lastSample[n11] = { x: e18.x, y: e18.y, t: a11 });
    }), t10.micLost && !t10.guestBusy && !x10 && S10();
    let s11 = t10.level?.() ?? 0;
    t10.figs.forEach((e18, n11) => e18.mouth = n11 === t10.speaker && !t10.guestBusy ? s11 : -1), nS(e17.id), t10.pos = a11, oS(e17.id, a11), a11 >= 6e4 ? uS(e17.id) : t10.raf = requestAnimationFrame(T10);
  };
  t10.raf = requestAnimationFrame(T10);
  let E10 = () => {
    let a11 = Math.min(ex, t10.endMs ?? performance.now() - t10.t0);
    t10.figs.forEach((e18, n11) => e18.on && t10.moves[n11].push(Math.round(a11 / 10), Math.round(e18.x), Math.round(e18.y)));
    let o11 = t10.vis.every((e18) => e18.length === 1 && e18[0] === 0) ? void 0 : t10.vis.map((e18) => [...e18]), s11 = t10.acts.map((e18) => ({ ...e18, d: e18.d || Math.max(1, Math.round(a11 / 10) - e18.t) })), c11 = { dur: Math.round(a11), moves: t10.moves.map((e18) => [...e18]), talk: [...t10.talk], ...o11 ? { vis: o11 } : {}, ...s11.length ? { acts: s11 } : {} }, u11 = (t10.cast ?? bx(e17)).map((e18, n11) => ({ ...e18, x: t10.moves[n11]?.[1] ?? e18.x, y: t10.moves[n11]?.[2] ?? e18.y }));
    l10(), n10 === t10.token && ode(d10, a11, f10, r10 && i10 > 0 ? { url: r10.url, keep: i10 } : null).then((n11) => {
      n11 && (Sx ? Sx(e17.id, { blob: n11, mime: n11.type || f10 }, c11, u11) : (t10.mem && URL.revokeObjectURL(t10.mem.url), t10.mem = { take: { ...c11, sound: `` }, url: URL.createObjectURL(n11), cast: u11 }, t10.cast = void 0, Qx(e17.id)));
    });
  };
}
var lS = null;
async function uS(e17, t10 = false) {
  let n10 = gx.get(e17);
  if (!n10) return;
  cancelAnimationFrame(n10.raf), n10.raf = 0;
  let r10 = n10.mode;
  r10 === `rec` && (n10.endMs = Math.min(ex, performance.now() - n10.t0), n10.pos = n10.endMs), n10.mode = `idle`, n10.over = void 0, (r10 === `count` || r10 === `video`) && n10.token++, r10 === `rec` && await n10.stopRec?.(), r10 === `play` && (t10 || br(), lS && (lS.pause(), lS.removeAttribute(`src`), lS.load())), n10.figs.forEach((e18) => Object.assign(e18, { walk: 0, phase: 0, mouth: -1 }));
  let i10 = _x.get(e17);
  i10 && (Qx(e17), r10 === `play` && iS(i10, n10.pos), nS(e17), r10 === `play` && t10 && yx(i10).next && Kue(i10));
}
async function dS(e17) {
  let t10 = xx(e17), n10 = Mx(e17);
  if (t10.mode !== `idle` || !n10) return;
  let r10 = n10.take.dur, i10 = t10.pos >= r10 - 300 ? 0 : t10.pos, a10 = ++t10.token;
  lS ??= new Audio();
  let o10 = lS;
  o10.preload = `auto`, o10.src = n10.url;
  let s10 = () => {
    try {
      i10 > 0 && (o10.currentTime = i10 / 1e3);
    } catch {
    }
  };
  o10.readyState >= 1 ? s10() : o10.addEventListener(`loadedmetadata`, s10, { once: true }), t10.mode = `play`, t10.over = void 0, Qx(e17.id), o10.play().catch(() => void 0), t10.env = null, hu(n10.url).then((e18) => a10 === t10.token && (t10.env = e18));
  let c10 = n10.cast, l10 = [...n10.take.acts ?? []].sort((e18, t11) => e18.t - t11.t), u10 = l10.findIndex((e18) => e18.t * 10 >= i10);
  u10 < 0 && (u10 = l10.length);
  let d10 = performance.now(), f10 = d10, p10 = t10.figs.map((e18) => ({ x: e18.x, y: e18.y })), m10 = (s11) => {
    if (t10.mode !== `play` || a10 !== t10.token) return;
    let h10 = o10.currentTime * 1e3, g10 = h10 > 0 && h10 >= i10 - 50 ? h10 : i10 + Math.min(300, s11 - d10);
    c10.forEach((e18, r11) => {
      if (!t10.figs[r11]) return;
      let i11 = fx(n10.take, r11, e18, g10);
      t10.figs[r11].x = i11.x, t10.figs[r11].y = i11.y, t10.figs[r11].on = mx(n10.take, r11, g10);
    }), rS(t10, p10, s11 - f10), f10 = s11, p10 = t10.figs.map((e18) => ({ x: e18.x, y: e18.y })), t10.speaker = hx(n10.take, g10);
    let _10 = t10.env ? t10.env[Math.floor(g10 / 1e3 * 30)] ?? 0 : 0, v10 = Ax(n10.take, g10);
    for (t10.figs.forEach((e18, n11) => e18.mouth = n11 === t10.speaker && !v10 ? _10 : -1), nS(e17.id); u10 < l10.length && l10[u10].t * 10 <= g10; ) Wue(e17.id, l10[u10++], n10.take);
    t10.pos = Math.min(g10, r10), oS(e17.id, g10, `${Ix(g10)} / ${Ix(r10)}`), o10.ended || g10 >= r10 + 400 ? (t10.pos = r10, uS(e17.id, true)) : t10.raf = requestAnimationFrame(m10);
  };
  t10.raf = requestAnimationFrame(m10);
}
function cde() {
  if (typeof MediaRecorder > `u` || typeof HTMLCanvasElement.prototype.captureStream != `function`) return null;
  for (let e17 of [`video/mp4;codecs=avc1.42E01E,mp4a.40.2`, `video/mp4`, `video/webm;codecs=vp9,opus`, `video/webm;codecs=vp8,opus`, `video/webm`]) if (MediaRecorder.isTypeSupported(e17)) return { mime: e17, ext: e17.startsWith(`video/mp4`) ? `mp4` : `webm` };
  return null;
}
var fS = (e17) => new Promise((t10) => {
  let n10 = new Image();
  n10.onload = () => t10(n10), n10.onerror = () => t10(null), n10.src = e17;
});
var pS = 80;
var lde = 31;
var mS = { l: 40, t: 60, w: 280, h: 470 };
async function ude(e17, t10, n10, r10) {
  let i10 = (wx?.pages() ?? []).find((t11) => t11.items.some((t12) => t12.id === e17.id));
  if (!i10) return [];
  let a10 = i10.items.findIndex((t11) => t11.id === e17.id), o10 = e17.w / $b, s10 = e17.h / 990, c10 = [];
  for (let l10 of i10.items.slice(a10 + 1)) {
    if (l10.type !== `widget` || l10.kind !== `avatar` && l10.kind !== `phototalk`) continue;
    let i11 = (l10.x - e17.x) / o10 * r10, a11 = (l10.y - e17.y) / s10 * r10, u10 = l10.w / o10 * r10, d10 = l10.h / s10 * r10;
    if (i11 > 1400 * r10 || a11 > 860 * r10 || i11 + u10 < 0 || a11 + d10 < 0) continue;
    let f10 = l10.say?.sound ? wx?.src(l10.say.sound) ?? void 0 : void 0, p10 = !!(l10.say?.text.trim() || f10), m10 = (t10.acts ?? []).filter((e18) => e18.id === l10.id).map((e18) => ({ t: e18.t, d: e18.d, move: l10.kind === `avatar` ? _d(l10.move, p10) : ``, heard: ix(t10, e18) })), h10 = null, g10 = null;
    if (f10 && m10.some((e18) => !e18.heard)) try {
      h10 = await n10.decodeAudioData(await (await fetch(f10)).arrayBuffer()), g10 = await hu(f10);
    } catch {
      h10 = null;
    }
    let _10 = { x: i11, y: a11, w: u10, h: d10, photo: l10.kind === `phototalk`, rest: null, open: null, moves: /* @__PURE__ */ new Map(), own: !!f10, buf: h10, env: g10, acts: m10 };
    if (l10.kind === `avatar`) {
      let e18 = $u(l10.av), t11 = (t12) => fS(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(ld(e18, t12, { view: `${-mS.l} ${-mS.t} ${mS.w} ${mS.h}`, width: String(mS.w), height: String(mS.h) }))}`);
      _10.rest = await t11({});
      for (let e19 of new Set(m10.map((e20) => e20.move))) {
        let n11 = [];
        for (let r11 = 0; r11 < lde; r11++) {
          let i12 = Nu(e19, r11 * pS);
          n11.push([await t11(i12), await t11({ ...i12, mouth: 0.7 })]);
        }
        _10.moves.set(e19, n11);
      }
    } else if (l10.pt) {
      let e18 = wx?.asset?.(l10.pt.img), t11 = e18?.dataUrl ?? wx?.src(l10.pt.img);
      if (!t11) continue;
      let n11 = `width="${e18?.width ?? 800}" height="${e18?.height ?? 600}"`, r11 = (r12) => fS(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(bu(l10.pt, e18, t11, `v${l10.id}`, r12).replace(`width="100%" height="100%"`, n11))}`);
      _10.rest = await r11(-1), m10.length && (_10.open = await r11(0.7));
    }
    c10.push(_10);
  }
  return c10;
}
function dde(e17, t10, n10) {
  let r10 = t10.acts.find((e18) => n10 >= e18.t * 10 && n10 < e18.t * 10 + e18.d * 10 + 450), i10 = r10 ? n10 - r10.t * 10 : 0, a10 = !!r10 && i10 < r10.d * 10, o10 = r10 && (r10.heard || !t10.own) && t10.takeEnv ? t10.takeEnv[Math.floor(n10 / 1e3 * 30)] ?? 0 : t10.env ? t10.env[Math.floor(i10 / 1e3 * 30)] ?? 0 : null, s10 = a10 && (o10 === null ? Math.floor(i10 / 110) % 2 == 0 : o10 > 0.15), c10 = t10.rest;
  if (r10 && t10.photo) c10 = s10 ? t10.open : t10.rest;
  else if (r10) {
    let e18 = t10.moves.get(r10.move), n11 = r10.move === `bow` ? Math.min(30, Math.floor(i10 / pS)) : Math.floor(i10 % 2480 / pS);
    c10 = (a10 || r10.move === `bow` ? e18?.[n11]?.[+!!s10] : null) ?? t10.rest;
  }
  if (c10) {
    if (t10.photo) {
      let n11 = Math.min(t10.w / c10.naturalWidth, t10.h / c10.naturalHeight) || 1;
      e17.drawImage(c10, t10.x + (t10.w - c10.naturalWidth * n11) / 2, t10.y + (t10.h - c10.naturalHeight * n11) / 2, c10.naturalWidth * n11, c10.naturalHeight * n11);
    } else {
      let n11 = Math.min(t10.w / 200, t10.h / 400), r11 = t10.x + (t10.w - 200 * n11) / 2, i11 = t10.y + t10.h - 400 * n11;
      e17.drawImage(c10, r11 - mS.l * n11, i11 - mS.t * n11, mS.w * n11, mS.h * n11);
    }
  }
}
async function hS(e17, t10) {
  let n10 = xx(e17), r10 = cde(), i10 = zr(), a10 = t10 ? Px(e17) : [e17];
  if (n10.mode !== `idle` || !Mx(e17)) return;
  if (!r10 || !i10) {
    oS(e17.id, n10.pos, `Dieser Browser kann keine Videos aufnehmen.`);
    return;
  }
  pi();
  let o10 = ++n10.token;
  n10.mode = `video`, $x(e17.id);
  let s10 = [-1, 0.25, 0.5, 0.75, 1], c10 = [];
  for (let [t11, r11] of a10.entries()) {
    oS(e17.id, 0, a10.length > 1 ? `Video wird vorbereitet \u2026 (Seite ${t11 + 1} von ${a10.length})` : `Video wird vorbereitet \u2026`, t11 / a10.length);
    let l11 = Mx(r11);
    if (!l11) continue;
    let u11 = yx(r11), d11 = await fS(u11.img ? jx(r11.id, u11.img) ?? dx(u11.back) : dx(u11.back)), f11 = [];
    for (let e18 of l11.cast) {
      let t12 = [];
      for (let n11 = 0; n11 < 9; n11++) {
        let r12 = [], i11 = n11 === 0 ? 0 : (n11 - 1) / 8 * Math.PI * 2, a11 = n11 === 0 ? 0 : 1;
        for (let t13 of s10) {
          let n12 = ld(e18.av, { legL: 26 * Math.sin(i11) * a11, legR: -26 * Math.sin(i11) * a11, armL: 7 - 14 * Math.sin(i11) * a11, armR: -7 - 14 * Math.sin(i11) * a11, bob: -Math.abs(Math.sin(i11)) * 7 * a11, ...t13 < 0 ? {} : { mouth: t13 } }, { width: `200`, height: `400` });
          r12.push(await fS(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(n12)}`));
        }
        t12.push(r12);
      }
      if (f11.push(t12), o10 !== n10.token) return;
    }
    let p11;
    try {
      p11 = await i10.decodeAudioData(await (await fetch(l11.url)).arrayBuffer());
    } catch {
      n10.mode = `idle`, $x(e17.id), oS(e17.id, n10.pos, a10.length > 1 ? `Die Aufnahme von Seite ${t11 + 1} lie\xDF sich nicht lesen.` : `Die Aufnahme lie\xDF sich nicht lesen.`);
      return;
    }
    let m11 = await hu(l11.url), h11 = await ude(r11, l11.take, i10, 1280 / $b);
    for (let e18 of h11) e18.takeEnv = m11;
    if (c10.push({ t: u11, tk: l11, back: d11, poses: f11, buf: p11, env: m11, guests: h11 }), o10 !== n10.token) return;
  }
  if (!c10.length) {
    n10.mode = `idle`, $x(e17.id);
    return;
  }
  let l10 = 1280, u10 = Math.round(l10 * 860 / $b / 2) * 2, d10 = l10 / $b, f10 = document.createElement(`canvas`);
  f10.width = l10, f10.height = u10;
  let p10 = f10.getContext(`2d`), m10 = i10.createMediaStreamDestination(), h10 = new MediaStream([...f10.captureStream(30).getVideoTracks(), ...m10.stream.getAudioTracks()]), g10 = [], _10 = new MediaRecorder(h10, { mimeType: r10.mime, videoBitsPerSecond: 4e6 });
  _10.ondataavailable = (e18) => e18.data.size && g10.push(e18.data);
  let v10 = new Promise((e18) => _10.onstop = () => e18()), y10 = (e18) => {
    let { t: t11, tk: n11, back: r11, poses: i11, env: a11 } = e18, o11 = n11.cast.map(() => 0), s11 = n11.cast.map(() => 0), c11 = n11.cast.map((e19, t12) => fx(n11.take, t12, e19, 0));
    return (f11, m11) => {
      if (r11) {
        let e19 = Math.max(l10 / r11.naturalWidth, u10 / r11.naturalHeight) || 1;
        p10.drawImage(r11, (l10 - r11.naturalWidth * e19) / 2, (u10 - r11.naturalHeight * e19) / 2, r11.naturalWidth * e19, r11.naturalHeight * e19);
      } else p10.fillStyle = `#e0f2fe`, p10.fillRect(0, 0, l10, u10);
      let h11 = hx(n11.take, f11), g11 = a11 ? a11[Math.floor(f11 / 1e3 * 30)] ?? 0 : 0, _11 = n11.cast.map((e19, t12) => fx(n11.take, t12, e19, f11)), v11 = _11.map((e19, t12) => t12).sort((e19, t12) => _11[e19].y - _11[t12].y);
      for (let e19 of v11) {
        let t12 = n11.cast[e19], r12 = _11[e19], a12 = Math.hypot(r12.x - c11[e19].x, r12.y - c11[e19].y), l11 = m11 > 0 && a12 < 260 && a12 / m11 > 0.06;
        if (s11[e19] += (+!!l11 - s11[e19]) * Math.min(1, m11 / 120), o11[e19] += a12 < 260 ? Math.min(0.5, a12 * 0.035) : 0, !mx(n11.take, e19, f11)) continue;
        let u11 = s11[e19] < 0.3 ? 0 : 1 + Math.floor(o11[e19] % (Math.PI * 2) / (Math.PI * 2) * 8) % 8, v12 = e19 === h11 && !Ax(n11.take, f11) ? g11 < 0.12 ? 0 : 1 + Math.min(3, Math.floor(g11 * 4)) : 0, y11 = i11[e19][u11][v12], b11 = Vx(t12, r12.x, r12.y);
        y11 && p10.drawImage(y11, b11.left * d10, b11.top * d10, b11.w * d10, b11.h * d10);
      }
      c11 = _11;
      for (let t12 of e18.guests) dde(p10, t12, f11);
      if (t11.title) {
        p10.font = `700 ${Math.round(u10 * 0.045)}px "Nunito", system-ui, sans-serif`, p10.fillStyle = `rgba(255,255,255,.85)`;
        let e19 = p10.measureText(t11.title).width;
        p10.fillRect(16, 16, e19 + 32, u10 * 0.075), p10.fillStyle = `#1f2937`, p10.fillText(t11.title, 32, 59.23);
      }
    };
  }, b10 = c10.reduce((e18, t11) => e18 + t11.tk.take.dur + 600, 0);
  y10(c10[0])(0, 0), _10.start(1e3);
  let x10 = 0;
  for (let [t11, r11] of c10.entries()) {
    if (o10 !== n10.token) break;
    let a11 = y10(r11), s11 = i10.createBufferSource();
    s11.buffer = r11.buf, s11.connect(m10), s11.connect(i10.destination);
    let l11 = i10.currentTime + 0.25;
    s11.start(l11);
    let u11 = [];
    for (let e18 of r11.guests) for (let t12 of e18.buf ? e18.acts.filter((e19) => !e19.heard) : []) {
      let n11 = i10.createBufferSource();
      n11.buffer = e18.buf, n11.connect(m10), n11.connect(i10.destination), n11.start(l11 + t12.t / 100), u11.push(n11);
    }
    let d11 = 0;
    await new Promise((s12) => {
      let u12 = () => {
        if (o10 !== n10.token) return s12();
        let f11 = Math.max(0, (i10.currentTime - l11) * 1e3);
        if (a11(f11, f11 - d11), d11 = f11, oS(e17.id, x10 + f11, `Video${c10.length > 1 ? ` (Seite ${t11 + 1} von ${c10.length})` : ``}: ${Ix(x10 + f11)} / ${Ix(b10)}`, (x10 + f11) / b10), f11 >= r11.tk.take.dur + 600) return s12();
        requestAnimationFrame(u12);
      };
      requestAnimationFrame(u12);
    }), x10 += r11.tk.take.dur + 600;
    for (let e18 of [s11, ...u11]) {
      try {
        e18.stop();
      } catch {
      }
      e18.disconnect();
    }
  }
  _10.state !== `inactive` && _10.stop(), await v10;
  let S10 = o10 !== n10.token;
  n10.mode = `idle`, $x(e17.id);
  let C10 = c10[0].t.title.trim() || `Puppentheater`;
  !S10 && g10.length && await dl(new Blob(g10, { type: r10.mime.split(`;`)[0] }), `${C10.replace(/[\\/:*?"<>|]+/g, ` `)} (Puppentheater).${r10.ext}`);
}
function pde(e17) {
  let t10 = yx(e17);
  return `${t10.title || `Puppentheater`}: ${t10.cast.length === 1 ? `eine Figur` : `${t10.cast.length} Figuren`}`;
}
var mde = `
.lh-th{position:absolute;left:0;top:0;transform-origin:0 0;font-family:'Nunito',Nunito,system-ui,sans-serif;-webkit-user-select:none;user-select:none}
.lh-th-stage{position:absolute;left:0;top:0;width:100%;overflow:hidden;border-radius:18px 18px 0 0;background:#e0f2fe}
.lh-th-back{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}
.lh-th-fig{position:absolute;touch-action:none;cursor:grab}
.lh-th-fig svg,.lh-th-fig img{display:block;width:100%;height:100%;pointer-events:none}
.lh-th-fig.is-held{cursor:grabbing;filter:drop-shadow(0 10px 10px rgba(15,23,42,.3))}
.lh-th-grip{position:absolute;z-index:1500;touch-action:none;cursor:grab;opacity:.75;transition:opacity .15s}
.lh-th-grip svg{display:block;pointer-events:none}
.lh-th-grip.is-held{opacity:1;cursor:grabbing}
.lh-th.is-playing .lh-th-grip{display:none}
.lh-th-fig.is-off,.lh-th-grip.is-off{display:none}
.lh-th-fig.is-wing{opacity:.45}
.lh-th-grip.is-wing{opacity:.55}
.lh-th-note{position:absolute;left:50%;top:24px;transform:translateX(-50%);max-width:1100px;padding:16px 28px;border-radius:18px;background:rgba(15,23,42,.82);color:#fff;font-size:30px;font-weight:700;text-align:center;z-index:2400;pointer-events:none}
.lh-th-note[hidden]{display:none}
.lh-th-over{position:absolute;inset:0;z-index:2500;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.45)}
.lh-th-box{width:1200px;max-height:800px;overflow:auto;box-sizing:border-box;padding:32px 36px;border-radius:28px;background:#fff;color:#1f2937;display:flex;flex-direction:column;align-items:center;gap:22px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
.lh-th-head{font-size:44px;font-weight:800}
.lh-th-asks{display:flex;flex-wrap:wrap;justify-content:center;gap:20px}
.lh-th-ask{padding:26px 34px;border:0;border-radius:20px;background:#e2e8f0;font:inherit;font-size:30px;font-weight:800;color:#1f2937;cursor:pointer}
.lh-th-ask.is-main{background:#2563eb;color:#fff}
.lh-th-close{padding:14px 30px;border:0;border-radius:16px;background:#f1f5f9;font:inherit;font-size:26px;font-weight:700;color:#475569;cursor:pointer}
.lh-th-count{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:260px;font-weight:900;color:#fff;text-shadow:0 8px 30px rgba(15,23,42,.6);pointer-events:none;z-index:2000}
.lh-th-count[hidden]{display:none}
.lh-th-bar{position:absolute;left:0;width:100%;display:flex;align-items:center;gap:16px;padding:0 24px;box-sizing:border-box;background:#1f2937;border-radius:0 0 18px 18px;color:#f8fafc}
.lh-th-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;width:118px;height:104px;border:0;border-radius:20px;background:#334155;color:#f8fafc;font-family:inherit;font-size:19px;font-weight:700;line-height:1;cursor:pointer}
.lh-th-btn.is-rec{color:#f87171}
.lh-th-btn.is-play{color:#4ade80}
.lh-th-btn[disabled]{opacity:.35;cursor:default}
.lh-th-mid{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}
.lh-th-title{font-size:30px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lh-th-time{font-size:22px;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lh-th-prog{position:relative;height:12px;margin:8px 15px;border-radius:6px;background:#475569;touch-action:none}
.lh-th-prog::before{content:'';position:absolute;left:-15px;right:-15px;top:-18px;bottom:-18px}
.lh-th-prog.is-seek{cursor:pointer}
.lh-th-prog b,.lh-th-prog i{position:absolute;left:0;top:0;height:100%;border-radius:6px}
.lh-th-prog b{background:#94a3b8}
.lh-th-prog i{background:#f87171}
.lh-th-knob{position:absolute;top:50%;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:#fff;border:5px solid #f87171;box-sizing:border-box;box-shadow:0 2px 6px rgba(0,0,0,.35);pointer-events:none}`;
var kD = [{ id: `bee`, nom: `die Biene`, dat: `der Biene`, goal: `Blume`, toGoal: `zur Blume`, atGoal: `bei der Blume`, byGoal: `an der Blume` }, { id: `robot`, nom: `der Roboter`, dat: `dem Roboter`, goal: `Akku`, toGoal: `zum Akku`, atGoal: `beim Akku`, byGoal: `am Akku` }, { id: `mouse`, nom: `die Maus`, dat: `der Maus`, goal: `K\xE4se`, toGoal: `zum K\xE4se`, atGoal: `beim K\xE4se`, byGoal: `am K\xE4se` }, { id: `car`, nom: `das Auto`, dat: `dem Auto`, goal: `Garage`, toGoal: `in die Garage`, atGoal: `in der Garage`, byGoal: `an der Garage` }, { id: `rocket`, nom: `die Rakete`, dat: `der Rakete`, goal: `Planet`, toGoal: `zum Planeten`, atGoal: `beim Planeten`, byGoal: `am Planeten` }, { id: `turtle`, nom: `die Schildkr\xF6te`, dat: `der Schildkr\xF6te`, goal: `Teich`, toGoal: `zum Teich`, atGoal: `am Teich`, byGoal: `am Teich` }, { id: `dog`, nom: `der Hund`, dat: `dem Hund`, goal: `Knochen`, toGoal: `zum Knochen`, atGoal: `beim Knochen`, byGoal: `am Knochen` }, { id: `ladybug`, nom: `der Marienk\xE4fer`, dat: `dem Marienk\xE4fer`, goal: `Blatt`, toGoal: `zum Blatt`, atGoal: `beim Blatt`, byGoal: `am Blatt` }];
var AD = (e17) => kD.find((t10) => t10.id === e17) ?? kD[0];
var jD = `#1f2937`;
var MD = { bee: `<ellipse cx="-22" cy="-4" rx="20" ry="12" transform="rotate(-28 -22 -4)" fill="#e0f2fe" fill-opacity=".9" stroke="#60a5fa" stroke-width="2.5"/><ellipse cx="22" cy="-4" rx="20" ry="12" transform="rotate(28 22 -4)" fill="#e0f2fe" fill-opacity=".9" stroke="#60a5fa" stroke-width="2.5"/><ellipse cx="0" cy="8" rx="19" ry="29" fill="#facc15" stroke="${jD}" stroke-width="3"/><path d="M-18 1H18M-17 14H17M-12 26H12" stroke="${jD}" stroke-width="6.5"/><path d="M-4 36L0 45L4 36Z" fill="${jD}"/><circle cx="0" cy="-25" r="13" fill="${jD}"/><circle cx="-5" cy="-30" r="4" fill="#fff"/><circle cx="5" cy="-30" r="4" fill="#fff"/><circle cx="-5" cy="-31" r="1.8" fill="${jD}"/><circle cx="5" cy="-31" r="1.8" fill="${jD}"/><path d="M-5 -37Q-9 -46 -15 -48M5 -37Q9 -46 15 -48" stroke="${jD}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="-15" cy="-48" r="3" fill="${jD}"/><circle cx="15" cy="-48" r="3" fill="${jD}"/>`, robot: `<rect x="-42" y="-20" width="12" height="40" rx="5" fill="#334155"/><rect x="30" y="-20" width="12" height="40" rx="5" fill="#334155"/><rect x="-32" y="-30" width="64" height="62" rx="16" fill="#38bdf8" stroke="#0f172a" stroke-width="3"/><rect x="-22" y="-26" width="44" height="18" rx="9" fill="#0f172a"/><circle cx="-10" cy="-17" r="5" fill="#a7f3d0"/><circle cx="10" cy="-17" r="5" fill="#a7f3d0"/><rect x="-18" y="6" width="36" height="16" rx="5" fill="#e0f2fe" stroke="#0f172a" stroke-width="2"/><circle cx="-9" cy="14" r="3" fill="#f43f5e"/><circle cx="0" cy="14" r="3" fill="#facc15"/><circle cx="9" cy="14" r="3" fill="#22c55e"/><path d="M0 -30V-41" stroke="#0f172a" stroke-width="3"/><circle cx="0" cy="-44" r="5" fill="#f43f5e" stroke="#0f172a" stroke-width="2"/>`, mouse: `<path d="M0 34C9 40 -9 44 3 48" stroke="#f472b6" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0 -40C14 -40 26 -6 26 12C26 30 14 36 0 36C-14 36 -26 30 -26 12C-26 -6 -14 -40 0 -40Z" fill="#9ca3af" stroke="#374151" stroke-width="3"/><circle cx="-15" cy="-14" r="11" fill="#d1d5db" stroke="#374151" stroke-width="3"/><circle cx="-15" cy="-14" r="6" fill="#f9a8d4"/><circle cx="15" cy="-14" r="11" fill="#d1d5db" stroke="#374151" stroke-width="3"/><circle cx="15" cy="-14" r="6" fill="#f9a8d4"/><circle cx="-6" cy="-26" r="3" fill="#111827"/><circle cx="6" cy="-26" r="3" fill="#111827"/><path d="M-3 -36L-17 -41M-3 -34L-17 -32M3 -36L17 -41M3 -34L17 -32" stroke="#374151" stroke-width="1.6"/><circle cx="0" cy="-40" r="4.5" fill="#f472b6"/>`, car: `<rect x="-31" y="-30" width="9" height="17" rx="3" fill="#111827"/><rect x="22" y="-30" width="9" height="17" rx="3" fill="#111827"/><rect x="-31" y="14" width="9" height="17" rx="3" fill="#111827"/><rect x="22" y="14" width="9" height="17" rx="3" fill="#111827"/><rect x="-24" y="-42" width="48" height="84" rx="14" fill="#ef4444" stroke="#7f1d1d" stroke-width="3"/><path d="M-18 -18H18L14 -6H-14Z" fill="#bfdbfe" stroke="#7f1d1d" stroke-width="2"/><rect x="-15" y="-5" width="30" height="27" rx="5" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/><path d="M-14 23H14L17 31H-17Z" fill="#bfdbfe" stroke="#7f1d1d" stroke-width="2"/><circle cx="-14" cy="-37" r="4" fill="#fef08a"/><circle cx="14" cy="-37" r="4" fill="#fef08a"/>`, rocket: `<path d="M-10 33Q0 54 10 33Z" fill="#f97316"/><path d="M-5 33Q0 46 5 33Z" fill="#fde047"/><path d="M-13 12L-30 34L-13 30Z" fill="#ef4444" stroke="${jD}" stroke-width="2.5" stroke-linejoin="round"/><path d="M13 12L30 34L13 30Z" fill="#ef4444" stroke="${jD}" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 -46C16 -30 18 0 14 34H-14C-18 0 -16 -30 0 -46Z" fill="#f1f5f9" stroke="${jD}" stroke-width="3"/><path d="M0 -46C8 -38 11 -31 12 -25H-12C-11 -31 -8 -38 0 -46Z" fill="#ef4444" stroke="${jD}" stroke-width="2.5"/><circle cx="0" cy="-4" r="9" fill="#7dd3fc" stroke="${jD}" stroke-width="3"/>`, turtle: `<ellipse cx="-25" cy="-19" rx="10" ry="7" fill="#86efac" stroke="#166534" stroke-width="2.5"/><ellipse cx="25" cy="-19" rx="10" ry="7" fill="#86efac" stroke="#166534" stroke-width="2.5"/><ellipse cx="-25" cy="23" rx="10" ry="7" fill="#86efac" stroke="#166534" stroke-width="2.5"/><ellipse cx="25" cy="23" rx="10" ry="7" fill="#86efac" stroke="#166534" stroke-width="2.5"/><path d="M-4 33L0 43L4 33Z" fill="#86efac" stroke="#166534" stroke-width="2"/><ellipse cx="0" cy="-37" rx="11" ry="12" fill="#86efac" stroke="#166534" stroke-width="3"/><circle cx="-5" cy="-41" r="2.6" fill="${jD}"/><circle cx="5" cy="-41" r="2.6" fill="${jD}"/><ellipse cx="0" cy="2" rx="28" ry="32" fill="#16a34a" stroke="#14532d" stroke-width="3"/><path d="M0 -12V-29M11 -5L24 -14M11 9L24 18M0 16V33M-11 9L-24 18M-11 -5L-24 -14" stroke="#14532d" stroke-width="2"/><path d="M0 -12L11 -5V9L0 16L-11 9V-5Z" fill="#22c55e" stroke="#14532d" stroke-width="2"/>`, dog: `<path d="M0 30Q11 41 4 49" stroke="#92400e" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="-19" cy="-6" r="6" fill="#b45309"/><circle cx="19" cy="-6" r="6" fill="#b45309"/><circle cx="-19" cy="27" r="6" fill="#b45309"/><circle cx="19" cy="27" r="6" fill="#b45309"/><ellipse cx="0" cy="11" rx="20" ry="25" fill="#d97706" stroke="#78350f" stroke-width="3"/><ellipse cx="6" cy="16" rx="8" ry="10" fill="#fde68a" opacity=".75"/><circle cx="0" cy="-24" r="16" fill="#d97706" stroke="#78350f" stroke-width="3"/><ellipse cx="-16" cy="-22" rx="7" ry="13" transform="rotate(16 -16 -22)" fill="#78350f"/><ellipse cx="16" cy="-22" rx="7" ry="13" transform="rotate(-16 16 -22)" fill="#78350f"/><ellipse cx="0" cy="-37" rx="8" ry="7" fill="#fde68a" stroke="#78350f" stroke-width="2"/><circle cx="0" cy="-42" r="3.5" fill="#111827"/><circle cx="-6" cy="-27" r="3" fill="#111827"/><circle cx="6" cy="-27" r="3" fill="#111827"/>`, ladybug: `<path d="M-20 -8L-34 -15M-22 6L-36 6M-20 20L-33 28M20 -8L34 -15M22 6L36 6M20 20L33 28" stroke="#111827" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="7" r="29" fill="#ef4444" stroke="#111827" stroke-width="3"/><path d="M0 -20V36" stroke="#111827" stroke-width="3"/><circle cx="-13" cy="-3" r="6" fill="#111827"/><circle cx="13" cy="-3" r="6" fill="#111827"/><circle cx="-15" cy="18" r="5" fill="#111827"/><circle cx="15" cy="18" r="5" fill="#111827"/><circle cx="-6" cy="30" r="3.5" fill="#111827"/><circle cx="6" cy="30" r="3.5" fill="#111827"/><ellipse cx="0" cy="-26" rx="15" ry="10" fill="#111827"/><circle cx="-6" cy="-29" r="3" fill="#fff"/><circle cx="6" cy="-29" r="3" fill="#fff"/><path d="M-5 -35Q-9 -44 -14 -46M5 -35Q9 -44 14 -46" stroke="#111827" stroke-width="2.5" fill="none" stroke-linecap="round"/>` };
var Zhe = { bee: `<ellipse cx="-16" cy="26" rx="13" ry="6" transform="rotate(-30 -16 26)" fill="#4ade80" stroke="#166534" stroke-width="2"/><ellipse cx="16" cy="26" rx="13" ry="6" transform="rotate(30 16 26)" fill="#4ade80" stroke="#166534" stroke-width="2"/>` + [0, 60, 120, 180, 240, 300].map((e17) => `<circle cx="${(Math.sin(e17 * Math.PI / 180) * 17).toFixed(1)}" cy="${(-Math.cos(e17 * Math.PI / 180) * 17 - 4).toFixed(1)}" r="13" fill="#f472b6" stroke="#be185d" stroke-width="2.5"/>`).join(``) + `<circle cx="0" cy="-4" r="11" fill="#facc15" stroke="#a16207" stroke-width="2.5"/>`, robot: `<rect x="-18" y="-28" width="36" height="58" rx="7" fill="#22c55e" stroke="#14532d" stroke-width="3"/><rect x="-8" y="-36" width="16" height="8" rx="2" fill="#14532d"/><path d="M4 -19L-9 3H1L-4 21L10 -3H0Z" fill="#fef9c3" stroke="#14532d" stroke-width="2" stroke-linejoin="round"/>`, mouse: `<path d="M-32 20H32V-4L-26 -22Z" fill="#fbbf24" stroke="#92400e" stroke-width="3" stroke-linejoin="round"/><path d="M-26 -22L32 -4" stroke="#92400e" stroke-width="2"/><circle cx="-12" cy="8" r="5" fill="#f59e0b"/><circle cx="10" cy="2" r="4" fill="#f59e0b"/><circle cx="20" cy="12" r="3.5" fill="#f59e0b"/><circle cx="-2" cy="-6" r="3" fill="#f59e0b"/>`, car: `<path d="M-34 -4L0 -32L34 -4V32H-34Z" fill="#e5e7eb" stroke="#374151" stroke-width="3" stroke-linejoin="round"/><path d="M-39 -2L0 -36L39 -2" fill="none" stroke="#dc2626" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><rect x="-21" y="2" width="42" height="30" fill="#9ca3af" stroke="#374151" stroke-width="2.5"/><path d="M-21 10H21M-21 17H21M-21 24H21" stroke="#4b5563" stroke-width="2"/>`, rocket: `<circle cx="0" cy="0" r="22" fill="#a78bfa" stroke="#4c1d95" stroke-width="3"/><circle cx="-7" cy="-7" r="5" fill="#8b5cf6"/><circle cx="8" cy="6" r="3.5" fill="#8b5cf6"/><ellipse cx="0" cy="0" rx="38" ry="10" transform="rotate(-18)" fill="none" stroke="#f59e0b" stroke-width="4"/>`, turtle: `<path d="M-34 4C-36 -18 -10 -30 10 -26C32 -22 38 0 30 16C22 32 -30 30 -34 4Z" fill="#60a5fa" stroke="#1d4ed8" stroke-width="3"/><path d="M-12 2A11 11 0 1 0 -2 -8L-6 -2Z" fill="#4ade80" stroke="#166534" stroke-width="2"/><circle cx="14" cy="10" r="5" fill="#f9a8d4" stroke="#be185d" stroke-width="1.5"/><path d="M-22 -14q5 -3 10 0M10 -16q5 -3 10 0" stroke="#bfdbfe" stroke-width="2" fill="none"/>`, dog: `<g transform="rotate(-25)"><circle cx="-22" cy="-7" r="8" fill="#f8fafc" stroke="#78716c" stroke-width="2.5"/><circle cx="-22" cy="7" r="8" fill="#f8fafc" stroke="#78716c" stroke-width="2.5"/><circle cx="22" cy="-7" r="8" fill="#f8fafc" stroke="#78716c" stroke-width="2.5"/><circle cx="22" cy="7" r="8" fill="#f8fafc" stroke="#78716c" stroke-width="2.5"/><rect x="-22" y="-6" width="44" height="12" fill="#f8fafc" stroke="#78716c" stroke-width="2.5"/><rect x="-23" y="-4.5" width="46" height="9" fill="#f8fafc"/></g>`, ladybug: `<path d="M0 -34C24 -20 24 18 0 34C-24 18 -24 -20 0 -34Z" fill="#4ade80" stroke="#166534" stroke-width="3"/><path d="M0 -30V38M0 -10L12 -20M0 4L14 -6M0 18L12 10M0 -10L-12 -20M0 4L-14 -6M0 18L-12 10" stroke="#166534" stroke-width="2" fill="none"/>` };
var ND = `<path d="M0 -27L7.6 -9.4L26.6 -8.3L11.9 3.9L16.5 22.3L0 12L-16.5 22.3L-11.9 3.9L-26.6 -8.3L-7.6 -9.4Z" fill="#facc15" stroke="#a16207" stroke-width="3" stroke-linejoin="round"/>`;
var Qhe = `<path d="M-30 18C-34 0 -22 -24 -2 -26C20 -28 34 -10 30 12C28 26 -26 30 -30 18Z" fill="#9ca3af" stroke="#4b5563" stroke-width="3"/><path d="M-14 -14C-6 -20 6 -20 12 -14" stroke="#e5e7eb" stroke-width="4" fill="none" stroke-linecap="round"/>`;
var PD = [{ id: `classic`, label: `Klassisch`, page: `#f1f5f9`, a: `#ffffff`, b: `#ffffff`, line: `#334155`, frame: `#334155`, wall: `ein Stein`, wallSvg: Qhe }, { id: `garden`, label: `Garten`, page: `#ecfccb`, a: `#bbf7d0`, b: `#a7f3d0`, line: `#15803d`, frame: `#166534`, wall: `ein Busch`, wallSvg: `<circle cx="-14" cy="6" r="18" fill="#16a34a" stroke="#14532d" stroke-width="3"/><circle cx="14" cy="6" r="18" fill="#16a34a" stroke="#14532d" stroke-width="3"/><circle cx="0" cy="-12" r="20" fill="#22c55e" stroke="#14532d" stroke-width="3"/><circle cx="-8" cy="-14" r="3" fill="#ef4444"/><circle cx="10" cy="-6" r="3" fill="#ef4444"/><circle cx="-16" cy="8" r="3" fill="#ef4444"/>` }, { id: `city`, label: `Stadt`, page: `#e2e8f0`, a: `#f1f5f9`, b: `#e2e8f0`, line: `#64748b`, frame: `#334155`, wall: `eine Baustelle`, wallSvg: `<path d="M-26 30L-20 6M26 30L20 6" stroke="#475569" stroke-width="5" stroke-linecap="round"/><rect x="-34" y="-14" width="68" height="22" rx="4" fill="#ffffff" stroke="#b91c1c" stroke-width="3"/><path d="M-26 8L-12 -14M-10 8L4 -14M6 8L20 -14M22 8L32 -6" stroke="#dc2626" stroke-width="7"/><rect x="-34" y="-14" width="68" height="22" rx="4" fill="none" stroke="#b91c1c" stroke-width="3"/><circle cx="0" cy="-24" r="7" fill="#facc15" stroke="#a16207" stroke-width="2"/>` }, { id: `farm`, label: `Bauernhof`, page: `#fef3c7`, a: `#fde68a`, b: `#fcd34d`, line: `#a16207`, frame: `#78350f`, wall: `ein Heuballen`, wallSvg: `<rect x="-32" y="-22" width="64" height="44" rx="14" fill="#facc15" stroke="#a16207" stroke-width="3"/><path d="M-22 -14Q0 -8 22 -14M-24 0Q0 6 24 0M-22 14Q0 20 22 14" stroke="#ca8a04" stroke-width="2.5" fill="none"/><path d="M-8 -22V22M10 -22V22" stroke="#b91c1c" stroke-width="3"/>` }, { id: `space`, label: `Weltraum`, page: `#1e1b4b`, a: `#312e81`, b: `#2e2a6e`, line: `#818cf8`, frame: `#a5b4fc`, wall: `ein Asteroid`, wallSvg: `<path d="M-28 4C-30 -16 -12 -30 6 -26C26 -22 32 -2 26 14C20 30 -2 32 -16 26C-24 22 -27 14 -28 4Z" fill="#78716c" stroke="#292524" stroke-width="3"/><circle cx="-8" cy="-8" r="7" fill="#57534e"/><circle cx="12" cy="8" r="5" fill="#57534e"/><circle cx="-10" cy="14" r="4" fill="#57534e"/>` }, { id: `sea`, label: `Meer`, page: `#e0f2fe`, a: `#bae6fd`, b: `#a5dcf7`, line: `#0369a1`, frame: `#075985`, wall: `ein Felsen`, wallSvg: `<ellipse cx="0" cy="12" rx="34" ry="14" fill="#f0f9ff" opacity=".9"/><path d="M-26 14C-30 -6 -14 -26 2 -24C20 -22 30 -6 26 14Z" fill="#64748b" stroke="#334155" stroke-width="3"/><path d="M-10 -12C-4 -18 6 -18 10 -12" stroke="#cbd5e1" stroke-width="3" fill="none" stroke-linecap="round"/>` }, { id: `colors`, label: `Farbfelder`, page: `#faf5ff`, a: `#ffffff`, b: `#ffffff`, line: `#475569`, frame: `#475569`, wall: `ein Stein`, wallSvg: Qhe }];
var FD = (e17) => PD.find((t10) => t10.id === e17) ?? PD[0];
var $he = [`#fecaca`, `#fed7aa`, `#fef08a`, `#bbf7d0`, `#bae6fd`, `#ddd6fe`, `#fbcfe8`];
function ege(e17, t10, n10, r10, i10) {
  let a10 = (e18) => (t10 * 9301 + e18 * 49297 + 233) % 233280 / 233280, o10 = (e18) => (n10 + i10 * (0.15 + 0.7 * a10(e18))).toFixed(1), s10 = (e18) => (r10 + i10 * (0.15 + 0.7 * a10(e18 + 7))).toFixed(1), c10 = (i10 / 100).toFixed(2);
  switch (e17) {
    case `garden`:
      return `<path d="M${o10(1)} ${s10(1)}l-3 -9m3 9l0 -11m0 11l4 -9" stroke="#22c55e" stroke-width="${(2 * c10).toFixed(1)}" fill="none" stroke-linecap="round" transform=""/>`;
    case `space`:
      return `<circle cx="${o10(1)}" cy="${s10(1)}" r="${(1.6 * c10).toFixed(1)}" fill="#e0e7ff"/><circle cx="${o10(2)}" cy="${s10(2)}" r="${(1 * c10).toFixed(1)}" fill="#c7d2fe"/><circle cx="${o10(3)}" cy="${s10(3)}" r="${(1.2 * c10).toFixed(1)}" fill="#fef9c3"/>`;
    case `sea`:
      return `<path d="M${o10(1)} ${s10(1)}q${(6 * c10).toFixed(1)} -${(5 * c10).toFixed(1)} ${(12 * c10).toFixed(1)} 0t${(12 * c10).toFixed(1)} 0" stroke="#e0f2fe" stroke-width="${(2.5 * c10).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
    case `farm`:
      return `<path d="M${o10(1)} ${s10(1)}l${(10 * c10).toFixed(1)} -${(3 * c10).toFixed(1)}M${o10(2)} ${s10(2)}l${(9 * c10).toFixed(1)} ${(4 * c10).toFixed(1)}" stroke="#ca8a04" stroke-width="${(2 * c10).toFixed(1)}" stroke-linecap="round"/>`;
    case `city`:
      return `<path d="M${(n10 + i10 * 0.5).toFixed(1)} ${(r10 + i10 * 0.12).toFixed(1)}v${(i10 * 0.12).toFixed(1)}M${(n10 + i10 * 0.5).toFixed(1)} ${(r10 + i10 * 0.76).toFixed(1)}v${(i10 * 0.12).toFixed(1)}M${(n10 + i10 * 0.12).toFixed(1)} ${(r10 + i10 * 0.5).toFixed(1)}h${(i10 * 0.12).toFixed(1)}M${(n10 + i10 * 0.76).toFixed(1)} ${(r10 + i10 * 0.5).toFixed(1)}h${(i10 * 0.12).toFixed(1)}" stroke="#cbd5e1" stroke-width="${(3 * c10).toFixed(1)}" stroke-linecap="round"/>`;
    default:
      return ``;
  }
}
function tge(e17, t10, n10, r10, i10) {
  let a10 = FD(e17), o10 = i10 / t10, s10 = `<rect x="${n10 - 8}" y="${r10 - 8}" width="${i10 + 16}" height="${i10 + 16}" rx="14" fill="${a10.frame}"/>`;
  for (let i11 = 0; i11 < t10; i11++) for (let c11 = 0; c11 < t10; c11++) {
    let l10 = n10 + c11 * o10, u10 = r10 + i11 * o10, d10 = e17 === `colors` ? $he[(c11 * 3 + i11 * 5 + c11 * i11 % 3) % $he.length] : (c11 + i11) % 2 ? a10.b : a10.a;
    s10 += `<rect x="${l10.toFixed(1)}" y="${u10.toFixed(1)}" width="${o10.toFixed(1)}" height="${o10.toFixed(1)}" fill="${d10}"/>`, s10 += ege(e17, i11 * t10 + c11, l10, u10, o10);
  }
  let c10 = ``;
  for (let e18 = 1; e18 < t10; e18++) c10 += `M${(n10 + e18 * o10).toFixed(1)} ${r10}V${r10 + i10}M${n10} ${(r10 + e18 * o10).toFixed(1)}H${n10 + i10}`;
  return s10 += `<path d="${c10}" stroke="${a10.line}" stroke-width="${e17 === `classic` ? 3 : 2}" opacity="${e17 === `classic` ? 0.85 : 0.6}"/>`, s10 += `<rect x="${n10}" y="${r10}" width="${i10}" height="${i10}" fill="none" stroke="${a10.frame}" stroke-width="4"/>`, s10;
}
var ID = { F: `<path d="M0 -24L19 -2H7V24H-7V-2H-19Z" fill="#fff"/>`, B: `<path d="M0 24L19 2H7V-24H-7V2H-19Z" fill="#fff"/>`, L: `<path d="M12 24V2Q12 -12 -2 -12H-6" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-4 -26L-22 -12L-4 2Z" fill="#fff"/>`, R: `<path d="M-12 24V2Q-12 -12 2 -12H6" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M4 -26L22 -12L4 2Z" fill="#fff"/>`, P: `<rect x="-15" y="-19" width="10" height="38" rx="3" fill="#fff"/><rect x="5" y="-19" width="10" height="38" rx="3" fill="#fff"/>`, D: `<g transform="rotate(45)"><rect x="-6" y="-26" width="12" height="28" rx="2" fill="#fff"/><path d="M-6 4H6L0 15Z" fill="#fff"/></g><path d="M-22 21H22" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>`, V: `<text x="0" y="11" text-anchor="middle" font-family="Verdana, sans-serif" font-size="30" font-weight="700" fill="#fff">+1</text>`, U: `<g transform="translate(2 -9) rotate(45)"><rect x="-6" y="-26" width="12" height="28" rx="2" fill="#fff"/><path d="M-6 4H6L0 15Z" fill="#fff"/></g><path d="M-22 21H22" stroke="#fff" stroke-width="4" stroke-dasharray="5 6" stroke-linecap="round"/>` };
var nge = `<circle r="18" fill="#fff"/><circle cx="-6" cy="-5" r="6" fill="#ef4444"/><circle cx="7" cy="-5" r="6" fill="#3b82f6"/><circle cx="0" cy="7" r="6" fill="#22c55e"/>`;
var rge = `<path d="M3 -22V9" stroke="#fff" stroke-width="5" stroke-linecap="round"/><ellipse cx="-6" cy="11" rx="10" ry="7.5" transform="rotate(-20 -6 11)" fill="#fff"/><path d="M3 -22Q16 -18 17 -6Q11 -13 3 -13Z" fill="#fff"/>`;
var ige = (e17) => `<g transform="rotate(${e17})"><path d="M0 -24L19 -2H7V24H-7V-2H-19Z" fill="#fff"/></g>`;
var age = `<path d="M-30 -14L-34 -42L-12 -28Z" fill="#fb923c" stroke="#7c2d12" stroke-width="3" stroke-linejoin="round"/><path d="M30 -14L34 -42L12 -28Z" fill="#fb923c" stroke="#7c2d12" stroke-width="3" stroke-linejoin="round"/><ellipse cx="0" cy="2" rx="36" ry="32" fill="#fb923c" stroke="#7c2d12" stroke-width="3"/><path d="M-12 -30Q0 -24 12 -30M-6 -22V-12M6 -22V-12" stroke="#c2410c" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="-13" cy="-2" rx="7" ry="9" fill="#fef9c3"/><ellipse cx="13" cy="-2" rx="7" ry="9" fill="#fef9c3"/><ellipse cx="-13" cy="-1" rx="3" ry="7" fill="#1f2937"/><ellipse cx="13" cy="-1" rx="3" ry="7" fill="#1f2937"/><path d="M-5 12L5 12L0 18Z" fill="#f472b6"/><path d="M0 18Q-4 24 -9 22M0 18Q4 24 9 22" stroke="#7c2d12" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M-14 14L-38 10M-14 18L-38 22M14 14L38 10M14 18L38 22" stroke="#7c2d12" stroke-width="2" stroke-linecap="round"/>`;
var oge = `<ellipse cx="0" cy="6" rx="9" ry="8"/><circle cx="-9" cy="-6" r="4"/><circle cx="-3" cy="-11" r="4"/><circle cx="4" cy="-11" r="4"/><circle cx="10" cy="-6" r="4"/>`;
var LD = [{ c: `#1e293b`, name: `schwarz` }, { c: `#dc2626`, name: `rot` }, { c: `#2563eb`, name: `blau` }, { c: `#16a34a`, name: `gr\xFCn` }, { c: `#f59e0b`, name: `orange` }, { c: `#9333ea`, name: `lila` }, { c: `#ec4899`, name: `rosa` }];
var RD = { wall: `Wand vor mir`, free: `vorne frei`, rightFree: `rechts frei`, leftFree: `links frei`, red: `Feld rot`, blue: `Feld blau`, star: `auf Stern` };
var zD = (e17) => typeof e17 == `object` && `rep` in e17;
var BD = (e17) => typeof e17 == `object` && `on` in e17;
var VD = (e17) => typeof e17 == `object` && `col` in e17;
var HD = (e17) => typeof e17 == `object` && `cond` in e17;
var UD = (e17) => zD(e17) || BD(e17) || HD(e17) ? e17.body : null;
var sge = [`up`, `down`, `left`, `right`];
var cge = { up: 0, down: 180, left: -90, right: 90 };
var WD = { up: `Pfeil nach oben`, down: `Pfeil nach unten`, left: `Pfeil nach links`, right: `Pfeil nach rechts` };
var lge = (e17) => [...e17].filter((e18) => `FBLRPDUV?`.includes(e18));
var GD = (e17) => e17.reduce((e18, t10) => e18 + (BD(t10) ? GD(t10.body) : zD(t10) ? 1 + GD(t10.body) : 1), 0);
var uge = [5, 6, 7, 8, 10];
var dge = [10, 20, 100];
var fge = [`OMA`, `OPA`, `MAMA`, `PAPA`, `EIS`, `HUT`, `TOR`, `LAMA`, `ROSE`, `HOSE`, `NASE`, `IGEL`, `ESEL`, `SOFA`, `AUTO`, `BLUME`, `MAUS`, `HAUS`];
var pge = [{ value: `goal`, label: `Zum Ziel` }, { value: `word`, label: `W\xF6rter abfahren` }, { value: `math`, label: `Rechnen und fahren` }, { value: `numbers`, label: `Zahlen der Reihe nach` }, { value: `collect`, label: `Sterne sammeln` }, { value: `read`, label: `Programme lesen` }, { value: `loop`, label: `Schleifen` }, { value: `pen`, label: `Zeichnen mit dem Stift` }, { value: `music`, label: `Musik-Teppich` }, { value: `events`, label: `Pfeile programmieren` }, { value: `cond`, label: `Bedingungen` }, { value: `cat`, label: `Achtung, Katze!` }, { value: `count`, label: `Punkte z\xE4hlen` }];
var mge = [{ value: `predict`, label: `Wo kommt die Figur an?` }, { value: `fix`, label: `Fehler finden` }, { value: `gap`, label: `Was fehlt?` }, { value: `mix`, label: `Gemischt` }];
var KD = (e17) => e17 === `read` || e17 === `loop` || e17 === `pen` || e17 === `events` || e17 === `cond` || e17 === `count` || e17 === `cat`;
var hge = (e17) => e17 === `loop` || e17 === `pen` || e17 === `events` || e17 === `cond` || e17 === `count`;
var qD = (e17) => e17 === `goal` || e17 === `loop` || e17 === `cond` || e17 === `count` || e17 === `cat`;
var JD = (e17, t10, n10) => t10.includes(e17) ? e17 : n10;
var YD = (e17, t10, n10, r10) => {
  let i10 = Math.round(Number(e17));
  return Number.isFinite(i10) ? Math.max(t10, Math.min(n10, i10)) : r10;
};
var XD = (e17) => [...e17.trim()].filter((e18) => /\p{L}/u.test(e18)).map((e18) => e18 === `\xDF` ? e18 : e18.toUpperCase());
var ZD = (e17) => {
  let t10 = XD(e17);
  return t10.length >= 2 && t10.length <= 8 && t10.every((e18, n10) => n10 === 0 || e18 !== t10[n10 - 1]);
};
function _ge(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : null;
  if (!t10) return null;
  let n10 = YD(t10.n, 3, 10, 5), r10 = (e18) => Array.isArray(e18) && e18.length >= 2 ? [YD(e18[0], 0, n10 - 1, 0), YD(e18[1], 0, n10 - 1, 0)] : null, i10 = (e18) => {
    let t11 = e18 && typeof e18 == `object` ? e18 : null;
    return t11 ? { x: YD(t11.x, 0, n10 - 1, 0), y: YD(t11.y, 0, n10 - 1, 0), t: String(t11.t ?? ``).slice(0, 4) } : null;
  }, a10 = Array.isArray(t10.start) ? t10.start : [], o10 = { n: n10, start: [YD(a10[0], 0, n10 - 1, 0), YD(a10[1], 0, n10 - 1, n10 - 1), YD(a10[2], 0, 3, 0)], goal: r10(t10.goal), walls: (Array.isArray(t10.walls) ? t10.walls : []).map(r10).filter((e18) => !!e18).slice(0, 60), stops: (Array.isArray(t10.stops) ? t10.stops : []).map(i10).filter((e18) => !!e18 && !!e18.t).slice(0, 12), extra: (Array.isArray(t10.extra) ? t10.extra : []).map(i10).filter((e18) => !!e18 && !!e18.t).slice(0, 100), stars: (Array.isArray(t10.stars) ? t10.stars : []).map(r10).filter((e18) => !!e18).slice(0, 12) };
  return Array.isArray(t10.sums) && (o10.sums = t10.sums.map((e18) => String(e18).slice(0, 20)).slice(0, 12)), typeof t10.word == `string` && (o10.word = t10.word.slice(0, 20)), (t10.kind === `predict` || t10.kind === `fix` || t10.kind === `gap` || t10.kind === `events`) && (o10.kind = t10.kind), typeof t10.prog == `string` && (o10.prog = t10.prog.replace(/[^FBLRPDUV?]/g, ``).slice(0, 40)), Array.isArray(t10.lines) && (o10.lines = t10.lines.filter((e18) => Array.isArray(e18) && e18.length === 4).map((e18) => e18.map((e19) => YD(e19, 0, n10 - 1, 0))).slice(0, 80)), typeof t10.shape == `string` && (o10.shape = t10.shape.slice(0, 40)), typeof t10.melody == `string` && (o10.melody = t10.melody.slice(0, 60)), Array.isArray(t10.beats) && (o10.beats = t10.beats.map((e18) => Math.max(0.25, Math.min(8, Number(e18) || 1))).slice(0, 16)), Array.isArray(t10.path) && (o10.path = t10.path.map(r10).filter((e18) => !!e18).slice(0, 100)), Array.isArray(t10.colors) && (o10.colors = t10.colors.filter((e18) => Array.isArray(e18) && e18.length >= 3).map((e18) => [YD(e18[0], 0, n10 - 1, 0), YD(e18[1], 0, n10 - 1, 0), e18[2] === `b` ? `b` : `r`]).slice(0, 40)), t10.maze === true && (o10.maze = true), Array.isArray(t10.cat) && (o10.cat = t10.cat.map(r10).filter((e18) => !!e18).slice(0, 8)), t10.catK !== void 0 && (o10.catK = YD(t10.catK, 0, 99, 0)), t10.own === true && (o10.own = true), Number.isFinite(Number(t10.best)) && t10.best !== void 0 && (o10.best = YD(t10.best, 1, 99, 1)), Number.isFinite(Number(t10.limit)) && t10.limit !== void 0 && (o10.limit = YD(t10.limit, 1, 99, 9)), o10;
}
function QD(e17) {
  let t10 = e17 && typeof e17 == `object` ? e17 : {}, n10 = uge.includes(Number(t10.size)) ? Number(t10.size) : 5, r10 = (Array.isArray(t10.words) ? t10.words : []).map((e18) => XD(String(e18)).join(``)).filter(ZD).slice(0, 40), i10 = { lesson: JD(t10.lesson, [`goal`, `word`, `math`, `numbers`, `collect`, `read`, `loop`, `pen`, `music`, `events`, `cond`, `cat`, `count`], `goal`), input: JD(t10.input, [`pad`, `cards`], `cards`), pad: JD(t10.pad, [`now`, `store`], `store`), memory: t10.memory !== false, level: JD(t10.level, [`easy`, `medium`, `hard`], `easy`), walls: JD(t10.walls, [`none`, `few`, `many`], `none`), turn: t10.turn === true, size: n10, count: YD(t10.count, 1, 10, 5), costume: JD(t10.costume, kD.map((e18) => e18.id), `bee`), mat: JD(t10.mat, PD.map((e18) => e18.id), `classic`), words: r10.length ? r10 : fge.slice(), range: dge.includes(Number(t10.range)) ? Number(t10.range) : 10, ops: JD(t10.ops, [`add`, `sub`, `both`], `add`), numMat: t10.numMat === true, voice: t10.voice !== false, speed: YD(t10.speed, 1, 3, 2), peek: t10.peek === true, read: JD(t10.read, [`predict`, `fix`, `gap`, `mix`], `predict`), rate: t10.rate === true, limit: t10.limit !== false, penMode: t10.penMode === `free` ? `free` : `shapes`, tasks: [] }, a10 = (Array.isArray(t10.tasks) ? t10.tasks : []).map(_ge).filter((e18) => !!e18 && e18.n === n10);
  return i10.tasks = a10.length ? a10.slice(0, 10) : gO(i10), i10;
}
var eO = [0, 1, 0, -1];
var tO = [-1, 0, 1, 0];
var nO = (e17) => Math.floor(Math.random() * e17);
function rO(e17) {
  let t10 = e17.slice();
  for (let e18 = t10.length - 1; e18 > 0; e18--) {
    let n10 = nO(e18 + 1);
    [t10[e18], t10[n10]] = [t10[n10], t10[e18]];
  }
  return t10;
}
function iO(e17, t10, n10) {
  let r10 = new Int16Array(e17 * e17 * 4).fill(-1), i10 = [], a10 = (n10.y * e17 + n10.x) * 4 + n10.d;
  r10[a10] = 0, i10.push(a10);
  for (let n11 = 0; n11 < i10.length; n11++) {
    let a11 = i10[n11], o10 = a11 % 4, s10 = (a11 - o10) / 4, c10 = s10 % e17, l10 = (s10 - c10) / e17, u10 = [s10 * 4 + (o10 + 3) % 4, s10 * 4 + (o10 + 1) % 4];
    for (let n12 of [1, -1]) {
      let r11 = c10 + n12 * eO[o10], i11 = l10 + n12 * tO[o10];
      r11 >= 0 && i11 >= 0 && r11 < e17 && i11 < e17 && !t10.has(i11 * e17 + r11) && u10.push((i11 * e17 + r11) * 4 + o10);
    }
    for (let e18 of u10) r10[e18] < 0 && (r10[e18] = r10[a11] + 1, i10.push(e18));
  }
  return r10;
}
function aO(e17, t10, n10, r10) {
  let i10 = null;
  for (let a10 = 0; a10 < 4; a10++) {
    let o10 = e17[(r10 * t10 + n10) * 4 + a10];
    o10 >= 0 && (!i10 || o10 < i10.len) && (i10 = { len: o10, end: { x: n10, y: r10, d: a10 } });
  }
  return i10;
}
var vge = { easy: [1, 4], medium: [4, 7], hard: [7, 13] };
function oO(e17, t10) {
  return t10 === `none` ? 0 : Math.round(e17 * e17 * (t10 === `few` ? 0.12 : 0.2));
}
function sO(e17, t10) {
  let n10 = [];
  for (let r10 = 0; r10 < e17 * e17; r10++) t10.has(r10) || n10.push(r10);
  return rO(n10);
}
function cO(e17) {
  let t10 = e17.size, [n10, r10] = vge[e17.level];
  for (let i10 = 0; i10 < 400; i10++) {
    let a10 = nO(t10 * t10), o10 = { x: a10 % t10, y: Math.floor(a10 / t10), d: e17.turn ? nO(4) : 0 }, s10 = new Set(sO(t10, /* @__PURE__ */ new Set([a10])).slice(0, oO(t10, e17.walls))), c10 = iO(t10, s10, o10), l10 = e17.walls !== `none` && e17.level !== `easy` ? iO(t10, /* @__PURE__ */ new Set(), o10) : null, u10 = [], d10 = [];
    for (let e18 = 0; e18 < t10 * t10; e18++) {
      if (e18 === a10 || s10.has(e18)) continue;
      let i11 = aO(c10, t10, e18 % t10, Math.floor(e18 / t10));
      !i11 || i11.len < n10 || i11.len > r10 || (u10.push(e18), l10 && i11.len > (aO(l10, t10, e18 % t10, Math.floor(e18 / t10))?.len ?? 0) && d10.push(e18));
    }
    let f10 = d10.length && i10 < 300 ? d10 : u10;
    if (!f10.length) continue;
    let p10 = f10[nO(f10.length)], m10 = aO(c10, t10, p10 % t10, Math.floor(p10 / t10))?.len;
    return { n: t10, start: [o10.x, o10.y, o10.d], goal: [p10 % t10, Math.floor(p10 / t10)], walls: [...s10].map((e18) => [e18 % t10, Math.floor(e18 / t10)]), stops: [], extra: [], stars: [], best: m10 };
  }
  return null;
}
function yge(e17, t10, n10, r10) {
  let i10 = n10, a10 = 0, o10 = -1;
  for (let n11 of r10) {
    let r11 = aO(iO(e17, t10, i10), e17, n11 % e17, Math.floor(n11 / e17));
    if (!r11 || r11.len < 1 && n11 !== o10) return false;
    o10 = n11, a10 += r11.len, i10 = r11.end;
  }
  return a10 <= 36;
}
function lO(e17, t10, n10, r10, i10) {
  let a10 = e17.size;
  for (let o10 = 0; o10 < 300; o10++) {
    let o11 = /* @__PURE__ */ new Set(), s10 = /* @__PURE__ */ new Map(), c10 = [], l10;
    if (r10) {
      for (let e18 of t10) s10.set(e18, Number(e18) - 1);
      let n11 = new Set(s10.values()), r11 = sO(a10, n11);
      l10 = r11[0];
      for (let t11 of r11.slice(1, 1 + oO(a10, e17.walls))) o11.add(t11);
      for (let e18 = 0; e18 < a10 * a10; e18++) !n11.has(e18) && !o11.has(e18) && c10.push({ x: e18 % a10, y: Math.floor(e18 / a10), t: String(e18 + 1) });
    } else {
      let r11 = [...new Set(t10)], i11 = sO(a10, /* @__PURE__ */ new Set());
      l10 = i11[0];
      let u11 = 1;
      for (let e18 of r11) s10.set(e18, i11[u11++]);
      for (let e18 of n10) {
        if (u11 >= i11.length - 1) break;
        let t11 = i11[u11++];
        c10.push({ x: t11 % a10, y: Math.floor(t11 / a10), t: e18 });
      }
      for (let t11 of i11.slice(u11, u11 + oO(a10, e17.walls))) o11.add(t11);
    }
    let u10 = { x: l10 % a10, y: Math.floor(l10 / a10), d: e17.turn ? nO(4) : 0 }, d10 = t10.map((e18) => s10.get(e18));
    if (d10[0] !== l10 && yge(a10, o11, u10, d10)) return { n: a10, start: [u10.x, u10.y, u10.d], goal: null, walls: [...o11].map((e18) => [e18 % a10, Math.floor(e18 / a10)]), stops: t10.map((e18) => ({ x: s10.get(e18) % a10, y: Math.floor(s10.get(e18) / a10), t: e18 })), extra: c10, stars: [], ...i10 };
  }
  return null;
}
var bge = `ABCDEFGHIKLMNOPRSTUW`.split(``);
function xge(e17, t10) {
  let n10 = XD(t10);
  return lO(e17, n10, rO(bge.filter((e18) => !n10.includes(e18))).slice(0, e17.level === `easy` ? 0 : e17.level === `medium` ? 2 : 5), false, { word: n10.join(``) });
}
var Sge = (e17) => e17.numMat ? Math.min(e17.range, e17.size * e17.size) : e17.range;
function Cge(e17) {
  let t10 = Sge(e17), n10 = e17.level === `easy` ? 3 : e17.level === `medium` ? 4 : 5, r10 = rO(Array.from({ length: t10 }, (e18, t11) => t11 + 1)).slice(0, n10).sort((e18, t11) => e18 - t11), i10 = e17.numMat ? [] : rO(Array.from({ length: t10 }, (e18, t11) => t11 + 1).filter((e18) => !r10.includes(e18))).slice(0, e17.level === `easy` ? 1 : e17.level === `medium` ? 3 : 5);
  return lO(e17, r10.map(String), i10.map(String), e17.numMat, {});
}
var wge = `\u2212`;
function Tge(e17) {
  let t10 = Sge(e17), n10 = e17.level === `easy` ? 2 : e17.level === `medium` ? 3 : 4, r10 = [], i10 = [];
  for (let a11 = 0; r10.length < n10 && a11 < 400; a11++) {
    let n11 = e17.ops === `sub` || e17.ops === `both` && Math.random() < 0.5, a12 = 1 + nO(t10);
    if (!i10.includes(a12)) {
      if (n11) {
        let e18 = 1 + nO(Math.max(1, t10 - a12));
        if (a12 + e18 > t10) continue;
        r10.push(`${a12 + e18} ${wge} ${e18}`);
      } else {
        if (a12 < 2) continue;
        let e18 = 1 + nO(a12 - 1);
        r10.push(`${e18} + ${a12 - e18}`);
      }
      i10.push(a12);
    }
  }
  if (r10.length < n10) return null;
  let a10 = /* @__PURE__ */ new Set();
  for (let e18 of i10) for (let n11 of [1, -1, 2, -2, 10, -10]) e18 + n11 >= 1 && e18 + n11 <= t10 && !i10.includes(e18 + n11) && a10.add(e18 + n11);
  let o10 = e17.numMat ? [] : rO([...a10]).slice(0, e17.level === `easy` ? 1 : e17.level === `medium` ? 3 : 5);
  return lO(e17, i10.map(String), o10.map(String), e17.numMat, { sums: r10 });
}
function Ege(e17) {
  let t10 = e17.size, n10 = e17.level === `easy` ? 2 : e17.level === `medium` ? 3 : 5;
  for (let r10 = 0; r10 < 300; r10++) {
    let r11 = sO(t10, /* @__PURE__ */ new Set()), i10 = r11[0], a10 = r11.slice(1, 1 + n10), o10 = r11[1 + n10], s10 = new Set(r11.slice(2 + n10, 2 + n10 + oO(t10, e17.walls))), c10 = { x: i10 % t10, y: Math.floor(i10 / t10), d: e17.turn ? nO(4) : 0 }, l10 = c10, u10 = 0, d10 = a10.slice(), f10 = true;
    for (; d10.length && f10; ) {
      let e18 = iO(t10, s10, l10), n11 = null;
      if (d10.forEach((r12, i11) => {
        let a11 = aO(e18, t10, r12 % t10, Math.floor(r12 / t10));
        a11 && (!n11 || a11.len < n11.len) && (n11 = { i: i11, ...a11 });
      }), !n11) f10 = false;
      else {
        let e19 = n11;
        u10 += e19.len, l10 = e19.end, d10.splice(e19.i, 1);
      }
    }
    let p10 = f10 ? aO(iO(t10, s10, l10), t10, o10 % t10, Math.floor(o10 / t10)) : null;
    if (!(!p10 || u10 + p10.len > 36)) return { n: t10, start: [c10.x, c10.y, c10.d], goal: [o10 % t10, Math.floor(o10 / t10)], walls: [...s10].map((e18) => [e18 % t10, Math.floor(e18 / t10)]), stops: [], extra: [], stars: a10.map((e18) => [e18 % t10, Math.floor(e18 / t10)]) };
  }
  return null;
}
function Dge(e17, t10, n10, r10) {
  let i10 = n10, a10 = [];
  for (let n11 of r10) if (n11 !== `?` && n11 !== `P` && (i10 = Tk(i10, n11), n11 === `F` || n11 === `B`)) {
    if (i10.x < 0 || i10.y < 0 || i10.x >= e17 || i10.y >= e17 || t10.has(i10.y * e17 + i10.x)) return null;
    a10.push([i10.x, i10.y]);
  }
  return { end: i10, cells: a10 };
}
var Oge = { easy: [3, 5], medium: [5, 8], hard: [8, 12] };
function kge(e17, t10, n10, r10, i10) {
  let a10 = n10, o10 = [], s10 = /* @__PURE__ */ new Set([n10.y * e17 + n10.x]);
  for (let n11 = 0; n11 < r10; n11++) {
    let c10 = o10[o10.length - 1], l10 = (n12) => {
      let r11 = Tk(a10, n12);
      return r11.x >= 0 && r11.y >= 0 && r11.x < e17 && r11.y < e17 && !t10.has(r11.y * e17 + r11.x) && !s10.has(r11.y * e17 + r11.x);
    }, u10 = [];
    if (l10(`F`) && u10.push(`F`, `F`, `F`), i10 && l10(`B`) && u10.push(`B`), n11 < r10 - 1 && c10 !== `L` && c10 !== `R` && u10.push(`L`, `R`), !u10.length) return null;
    let d10 = n11 === r10 - 1 ? u10.includes(`F`) ? `F` : u10.includes(`B`) ? `B` : null : u10[nO(u10.length)];
    if (!d10) return null;
    o10.push(d10), a10 = Tk(a10, d10), s10.add(a10.y * e17 + a10.x);
  }
  return o10;
}
function Age(e17, t10) {
  let n10 = e17.size, [r10, i10] = Oge[e17.level];
  for (let a10 = 0; a10 < 400; a10++) {
    let a11 = nO(n10 * n10), o10 = { x: a11 % n10, y: Math.floor(a11 / n10), d: e17.turn ? nO(4) : 0 }, s10 = new Set(sO(n10, /* @__PURE__ */ new Set([a11])).slice(0, oO(n10, e17.walls))), c10 = kge(n10, s10, o10, r10 + nO(i10 - r10 + 1), e17.level === `hard`);
    if (!c10 || c10.filter((e18) => e18 === `F` || e18 === `B`).length < 2) continue;
    let l10 = Dge(n10, s10, o10, c10);
    if (!l10 || l10.end.x === o10.x && l10.end.y === o10.y || e17.level !== `easy` && !c10.some((e18) => e18 === `L` || e18 === `R`)) continue;
    let u10 = { n: n10, start: [o10.x, o10.y, o10.d], walls: [...s10].map((e18) => [e18 % n10, Math.floor(e18 / n10)]), stops: [], extra: [], stars: [] };
    if (t10 === `predict`) return { ...u10, goal: null, kind: t10, prog: c10.join(``) };
    let d10 = [l10.end.x, l10.end.y], f10 = (e18) => {
      let t11 = Dge(n10, s10, o10, e18);
      return !!t11 && t11.end.x === d10[0] && t11.end.y === d10[1];
    };
    if (t10 === `fix`) for (let e18 of rO(c10.map((e19, t11) => t11))) {
      let n11 = rO(c10[e18] === `F` ? [`L`, `R`] : c10[e18] === `L` ? [`R`, `F`] : c10[e18] === `R` ? [`L`, `F`] : [`F`]);
      for (let r11 of n11) {
        let n12 = c10.slice();
        if (n12[e18] = r11, !f10(n12)) return { ...u10, goal: d10, kind: t10, prog: n12.join(``) };
      }
    }
    else for (let e18 of rO(c10.map((e19, t11) => t11))) if ([`F`, `B`, `L`, `R`].filter((t11) => {
      let n11 = c10.slice();
      return n11[e18] = t11, f10(n11);
    }).length === 1) {
      let n11 = c10.slice();
      return n11[e18] = `?`, { ...u10, goal: d10, kind: t10, prog: n11.join(``) };
    }
  }
  return null;
}
var jge = { easy: [[`F`]], medium: [[`F`, `R`, `F`, `L`], [`F`, `L`, `F`, `R`], [`F`, `F`, `R`]], hard: [[`F`, `F`, `R`, `F`, `L`], [`F`, `L`, `F`, `F`, `R`], [`F`, `R`, `F`, `R`, `F`, `L`, `F`, `L`], [`F`, `F`, `L`, `F`, `F`, `R`]] };
function Mge(e17) {
  let t10 = e17.size;
  for (let n10 = 0; n10 < 500; n10++) {
    let n11 = jge[e17.level], r10 = n11[nO(n11.length)], i10 = 1 + r10.length, a10 = i10 + (e17.level === `hard` ? 0 : 1), o10 = Math.max(2, Math.floor(a10 / r10.length) + 1) + nO(4), s10 = nO(t10 * t10), c10 = { x: s10 % t10, y: Math.floor(s10 / t10), d: e17.turn ? nO(4) : 0 }, l10 = c10, u10 = [], d10 = /* @__PURE__ */ new Set([s10]), f10 = true;
    for (let e18 = 0; e18 < o10 && f10; e18++) {
      for (let e19 of r10) {
        if (l10 = Tk(l10, e19), l10.x < 0 || l10.y < 0 || l10.x >= t10 || l10.y >= t10) {
          f10 = false;
          break;
        }
        d10.add(l10.y * t10 + l10.x);
      }
      u10.push([l10.x, l10.y]);
    }
    if (!f10 || l10.x === c10.x && l10.y === c10.y) continue;
    let p10 = u10[u10.length - 1], m10 = r10.length > 1 ? u10.slice(0, -1) : [];
    if (new Set(m10.map(([e18, n12]) => n12 * t10 + e18)).size !== m10.length || m10.some(([e18, t11]) => e18 === p10[0] && t11 === p10[1] || e18 === c10.x && t11 === c10.y)) continue;
    let h10 = sO(t10, d10).slice(0, oO(t10, e17.walls));
    return { n: t10, start: [c10.x, c10.y, c10.d], goal: p10, walls: h10.map((e18) => [e18 % t10, Math.floor(e18 / t10)]), stops: [], extra: [], stars: m10, best: i10, ...e17.limit ? { limit: a10 } : {} };
  }
  return null;
}
var Nge = { easy: [{ name: `eine lange Linie`, prog: `DFFF` }, { name: `eine Linie nach rechts`, prog: `RDFF` }, { name: `eine Ecke`, prog: `DFFRFF` }, { name: `eine Ecke nach links`, prog: `DFFLFF` }, { name: `ein kleines Quadrat`, prog: `DFRFRFRF` }, { name: `ein kleines Rechteck`, prog: `DFFRFRFFRF` }, { name: `eine kleine Treppe`, prog: `DFRFLFRF` }, { name: `den Buchstaben L`, prog: `DFFBBRF` }, { name: `eine Br\xFCcke`, prog: `DFRFRF` }, { name: `eine Schale`, prog: `RRDFLFLF` }], medium: [{ name: `ein gro\xDFes Quadrat`, prog: `DFFRFFRFFRFF` }, { name: `ein Rechteck`, prog: `DFFFRFFRFFFRFF` }, { name: `eine Treppe`, prog: `DFRFLFRFLFRFL` }, { name: `eine Treppe nach links`, prog: `DFLFRFLFRFLF` }, { name: `den Buchstaben T`, prog: `DFFFLFBB` }, { name: `den Buchstaben U`, prog: `RRDFFLFFLFF` }, { name: `den Buchstaben C`, prog: `LDFLFFLF` }, { name: `den Buchstaben F`, prog: `DFRFBLFRFB` }, { name: `den Buchstaben P`, prog: `DFFRFRFRF` }, { name: `eine Fahne`, prog: `DFFFRFFRFRFF` }, { name: `ein Plus`, prog: `DFBBFRFBB` }], hard: [{ name: `den Buchstaben E`, prog: `DRFBLFRFBLFRFB` }, { name: `den Buchstaben H`, prog: `DFFBRFLFBB` }, { name: `den Buchstaben S`, prog: `RDFLFLFRFRF` }, { name: `eine Schlange`, prog: `DFFRFRFFLFLFF` }, { name: `eine Spirale`, prog: `DFRFRFFRFFRFFFRFFF` }, { name: `einen Berg`, prog: `DFRFLFRFRFLFRF` }, { name: `ein Fenster`, prog: `DFFRFFRFFRFFBRFFBLFBB` }] };
var uO = (e17) => {
  let [t10, n10, r10, i10] = e17;
  return t10 < r10 || t10 === r10 && n10 <= i10 ? `${t10},${n10},${r10},${i10}` : `${r10},${i10},${t10},${n10}`;
};
function Pge(e17, t10, n10) {
  let r10 = t10, i10 = false, a10 = /* @__PURE__ */ new Map();
  for (let t11 of n10) if (t11 === `D`) i10 = true;
  else if (t11 === `U`) i10 = false;
  else if (`FBLR`.includes(t11)) {
    let n11 = Tk(r10, t11);
    if (n11.x < 0 || n11.y < 0 || n11.x >= e17 || n11.y >= e17) return null;
    if (i10 && (t11 === `F` || t11 === `B`)) {
      let e18 = [r10.x, r10.y, n11.x, n11.y];
      a10.set(uO(e18), e18);
    }
    r10 = n11;
  }
  return [...a10.values()];
}
function Fge(e17, t10 = 0, n10 = []) {
  let r10 = e17.size;
  if (e17.penMode === `free`) {
    let e18 = Math.floor(r10 / 2);
    return { n: r10, start: [e18, e18, 0], goal: null, walls: [], stops: [], extra: [], stars: [], lines: [], shape: `` };
  }
  let i10 = Nge[e17.level];
  for (let e18 = 0; e18 < 300; e18++) {
    let a10 = i10[n10.length ? n10[(t10 + Math.floor(e18 / 40)) % n10.length] : nO(i10.length)], o10 = nO(r10 * r10), s10 = { x: o10 % r10, y: Math.floor(o10 / r10), d: 0 }, c10 = Pge(r10, s10, a10.prog);
    if (c10?.length) return { n: r10, start: [s10.x, s10.y, 0], goal: null, walls: [], stops: [], extra: [], stars: [], lines: c10, shape: a10.name };
  }
  return null;
}
var dO = { C: 60, D: 62, E: 64, F: 65, G: 67, A: 69, H: 71, c: 72 };
var Ige = Object.fromEntries(Object.entries(dO).map(([e17, t10]) => [t10, e17]));
var Lge = (e17) => oo[(dO[e17] ?? 60) % 12];
var Rge = (e17) => e17 === `c` ? `C` : e17;
var zge = (e17, t10, n10, r10, i10 = `#fff`) => e17 === `c` ? `<circle cx="${t10.toFixed(1)}" cy="${n10.toFixed(1)}" r="${r10.toFixed(1)}" fill="${i10}" stroke="#1e293b" stroke-width="1.5"/>` : ``;
function Bge(e17) {
  let t10 = e17 === `easy` ? 4 : e17 === `medium` ? 6 : 8;
  return kg.map((e18) => {
    let n10 = e18.notes.filter((e19) => e19[0] !== null).slice(0, t10);
    return { title: e18.title, notes: n10 };
  }).filter((e18) => e18.notes.length === t10 && e18.notes.every(([e19]) => Ige[e19]) && new Set(e18.notes.map(([e19]) => e19)).size >= Math.min(3, t10 - 1));
}
function Vge(e17, t10 = 0, n10 = []) {
  let r10 = Bge(e17.level), i10 = n10.length ? [...n10.slice(t10 % n10.length), ...n10.slice(0, t10 % n10.length)].map((e18) => r10[e18]).filter(Boolean) : rO(r10);
  for (let t11 of i10) {
    let n11 = t11.notes.map(([e18]) => Ige[e18]), r11 = lO(e17, n11, rO(Object.keys(dO).filter((e18) => !n11.includes(e18))).slice(0, e17.level === `easy` ? 0 : e17.level === `medium` ? 2 : 8), false, { melody: t11.title, beats: t11.notes.map(([, e18]) => e18) });
    if (r11) return r11;
  }
  return null;
}
function Hge(e17) {
  let t10 = Ege(e17);
  return t10 ? { ...t10, kind: `events` } : null;
}
function Uge(e17, t10, n10, r10) {
  for (let i10 = 0; i10 < 400; i10++) {
    let i11 = { x: nO(e17), y: nO(e17), d: nO(4) }, a10 = [[i11.x, i11.y]], o10 = /* @__PURE__ */ new Set([i11.y * e17 + i11.x]), s10 = [], c10 = i11, l10 = t10 === `none` ? 0 : n10 + nO(r10 - n10 + 1), u10 = true;
    for (let n11 = 0; n11 <= l10 && u10; n11++) {
      let r11 = t10 === `none` ? 3 + nO(Math.max(1, e17 - 3)) : 1 + nO(3) + +(n11 === 0);
      for (let t11 = 0; t11 < r11; t11++) {
        let t12 = Tk(c10, `F`), n12 = [0, 1, 2, 3].some((n13) => {
          let r12 = t12.x + eO[n13], i13 = t12.y + tO[n13];
          return (r12 !== c10.x || i13 !== c10.y) && o10.has(i13 * e17 + r12);
        });
        if (t12.x < 0 || t12.y < 0 || t12.x >= e17 || t12.y >= e17 || o10.has(t12.y * e17 + t12.x) || n12) {
          u10 = false;
          break;
        }
        c10 = t12, o10.add(c10.y * e17 + c10.x), a10.push([c10.x, c10.y]);
      }
      if (!u10 || n11 === l10) break;
      let i12 = t10 === `right` || Math.random() < 0.5;
      s10.push([c10.x, c10.y, i12 ? `r` : `b`]), c10 = Tk(c10, i12 ? `R` : `L`);
    }
    if (!(!u10 || a10.length < 4 || s10.length !== l10) && !s10.some(([e18, t11]) => e18 === c10.x && t11 === c10.y)) return { start: i11, cells: a10, colors: s10 };
  }
  return null;
}
function Wge(e17) {
  let t10 = e17 % 2 ? e17 : e17 - 1, n10 = /* @__PURE__ */ new Set(), r10 = [[0, t10 - 1]];
  for (n10.add((t10 - 1) * e17); r10.length; ) {
    let [i11, a10] = r10[r10.length - 1], o10 = rO([[2, 0], [-2, 0], [0, 2], [0, -2]]).map(([e18, t11]) => [i11 + e18, a10 + t11, i11 + e18 / 2, a10 + t11 / 2]).filter(([r11, i12]) => r11 >= 0 && i12 >= 0 && r11 < t10 && i12 < t10 && !n10.has(i12 * e17 + r11));
    if (!o10.length) {
      r10.pop();
      continue;
    }
    let [s10, c10, l10, u10] = o10[0];
    n10.add(u10 * e17 + l10), n10.add(c10 * e17 + s10), r10.push([s10, c10]);
  }
  let i10 = /* @__PURE__ */ new Set();
  for (let t11 = 0; t11 < e17 * e17; t11++) n10.has(t11) || i10.add(t11);
  return { walls: i10, start: { x: 0, y: t10 - 1, d: 0 }, goal: [t10 - 1, 0] };
}
function fO(e17, t10) {
  let n10 = q_e(e17, PO(e17), t10);
  return !n10.bump && !!e17.goal && n10.end.x === e17.goal[0] && n10.end.y === e17.goal[1];
}
var Gge = () => [{ rep: 2, until: true, body: [`F`, { cond: `red`, body: [`R`] }] }];
var Kge = () => [{ rep: 2, until: true, body: [`F`, { cond: `red`, body: [`R`] }, { cond: `blue`, body: [`L`] }] }];
var qge = () => [{ rep: 2, until: true, body: [{ cond: `rightFree`, body: [`R`] }, { cond: `wall`, body: [`L`] }, { cond: `wall`, body: [`L`] }, { cond: `free`, body: [`F`] }] }];
function Jge(e17) {
  let t10 = e17.size;
  if (e17.level === `hard`) {
    for (let n11 = 0; n11 < 30; n11++) {
      let n12 = Wge(t10), r10 = { n: t10, start: [n12.start.x, n12.start.y, 0], goal: n12.goal, walls: [...n12.walls].map((e18) => [e18 % t10, Math.floor(e18 / t10)]), stops: [], extra: [], stars: [], maze: true };
      if (!fO(r10, qge())) continue;
      let i10 = GD(qge());
      return { ...r10, best: i10, ...e17.limit ? { limit: i10 + 1 } : {} };
    }
    return null;
  }
  let n10 = e17.level === `easy`;
  for (let r10 = 0; r10 < 100; r10++) {
    let r11 = Uge(t10, n10 ? `right` : `both`, n10 ? 2 : 3, n10 ? 3 : 5);
    if (!r11) continue;
    let i10 = r11.cells[r11.cells.length - 1], a10 = { n: t10, start: [r11.start.x, r11.start.y, r11.start.d], goal: i10, walls: [], stops: [], extra: [], stars: [], path: r11.cells, colors: r11.colors }, o10 = n10 ? Gge() : Kge(), s10 = GD(o10);
    if (!(!fO(a10, o10) || r11.cells.length - 1 + r11.colors.length <= s10 + 1)) return { ...a10, best: s10, ...e17.limit ? { limit: s10 + 1 } : {} };
  }
  return null;
}
function Yge(e17) {
  let t10 = e17.size, n10 = e17.level === `easy` ? `none` : e17.level === `medium` ? `right` : `both`, r10 = e17.level === `easy` ? 2 : e17.level === `medium` ? 3 : 4;
  for (let i10 = 0; i10 < 200; i10++) {
    let i11 = Uge(t10, n10, 2, 3);
    if (!i11) continue;
    let a10 = i11.cells[i11.cells.length - 1], o10 = rO(i11.cells.slice(1, -1).filter(([e18, t11]) => !i11.colors.some(([n11, r11]) => n11 === e18 && r11 === t11)));
    if (o10.length < r10) continue;
    let s10 = { n: t10, start: [i11.start.x, i11.start.y, i11.start.d], goal: a10, walls: [], stops: [], extra: [], stars: o10.slice(0, r10), path: i11.cells, colors: i11.colors }, c10 = [{ rep: 2, until: true, body: [`F`, ...n10 === `none` ? [] : [{ cond: `red`, body: [`R`] }], ...n10 === `both` ? [{ cond: `blue`, body: [`L`] }] : [], { cond: `star`, body: [`V`] }] }];
    if (!fO(s10, c10)) continue;
    let l10 = GD(c10);
    return { ...s10, best: l10, ...e17.limit ? { limit: l10 + 1 } : {} };
  }
  return null;
}
function pO(e17, t10) {
  let n10 = e17.cat;
  if (!n10?.length) return null;
  if (n10.length === 1) return n10[0];
  let r10 = 2 * (n10.length - 1), i10 = (t10 + (e17.catK ?? 0)) % r10;
  return n10[i10 < n10.length ? i10 : r10 - i10];
}
var mO = (e17, t10, n10, r10) => !!t10 && (t10[0] === r10.x && t10[1] === r10.y || !!e17 && e17[0] === r10.x && e17[1] === r10.y && t10[0] === n10.x && t10[1] === n10.y);
function Xge(e17, t10 = 40, n10 = true) {
  let r10 = e17.n, i10 = Math.max(1, 2 * ((e17.cat?.length ?? 1) - 1)), a10 = new Set(e17.walls.map(([e18, t11]) => t11 * r10 + e18)), o10 = (e18, t11) => ((e18.y * r10 + e18.x) * 4 + e18.d) * i10 + t11 % i10, s10 = /* @__PURE__ */ new Set(), c10 = [{ p: PO(e17), k: 0 }];
  s10.add(o10(PO(e17), 0));
  for (let i11 = 1; i11 <= t10 && c10.length; i11++) {
    let t11 = [];
    for (let { p: l10, k: u10 } of c10) for (let c11 of n10 ? [`F`, `B`, `L`, `R`, `P`] : [`F`, `B`, `L`, `R`]) {
      let n11 = Tk(l10, c11);
      if (n11.x < 0 || n11.y < 0 || n11.x >= r10 || n11.y >= r10 || a10.has(n11.y * r10 + n11.x) || mO(pO(e17, u10), pO(e17, u10 + 1), l10, n11)) continue;
      if (e17.goal && n11.x === e17.goal[0] && n11.y === e17.goal[1]) return i11;
      let d10 = o10(n11, u10 + 1);
      s10.has(d10) || (s10.add(d10), t11.push({ p: n11, k: u10 + 1 }));
    }
    c10 = t11;
  }
  return null;
}
function hO(e17, t10 = false) {
  let n10 = e17.n, r10 = new Set(e17.walls.map(([e18, t11]) => t11 * n10 + e18)), i10 = PO(e17), a10 = /* @__PURE__ */ new Map(), o10 = (e18) => `${e18.x},${e18.y},${e18.d}`, s10 = [i10];
  for (a10.set(o10(i10), [``, `F`]); s10.length; ) {
    let c10 = s10.shift();
    if (e17.goal && c10.x === e17.goal[0] && c10.y === e17.goal[1]) {
      let e18 = [], t11 = o10(c10);
      for (; t11 !== o10(i10); ) {
        let [n11, r11] = a10.get(t11);
        e18.unshift(r11), t11 = n11;
      }
      return e18;
    }
    for (let e18 of t10 ? [`F`, `L`, `R`] : [`F`, `B`, `L`, `R`]) {
      let t11 = Tk(c10, e18);
      t11.x < 0 || t11.y < 0 || t11.x >= n10 || t11.y >= n10 || r10.has(t11.y * n10 + t11.x) || a10.has(o10(t11)) || (a10.set(o10(t11), [o10(c10), e18]), s10.push(t11));
    }
  }
  return null;
}
function Zge(e17) {
  let t10 = e17.size;
  for (let n10 = 0; n10 < 400; n10++) {
    let r10 = cO({ ...e17, level: e17.level === `easy` ? `medium` : `hard` });
    if (!r10) continue;
    let i10 = hO(r10);
    if (!i10 || i10.length < 3) continue;
    let a10 = PO(r10), o10 = [];
    for (let e18 of i10) a10 = Tk(a10, e18), (e18 === `F` || e18 === `B`) && o10.push([a10.x, a10.y]);
    let s10 = o10.slice(0, -1);
    if (!s10.length) continue;
    let [c10, l10] = s10[nO(s10.length)], u10 = e17.level === `easy` ? 3 : 4, d10 = Math.random() < 0.5, f10 = nO(u10), p10 = [];
    for (let e18 = 0; e18 < u10; e18++) p10.push(d10 ? [c10 - f10 + e18, l10] : [c10, l10 - f10 + e18]);
    let m10 = new Set(r10.walls.map(([e18, n11]) => n11 * t10 + e18));
    if (p10.some(([e18, n11]) => e18 < 0 || n11 < 0 || e18 >= t10 || n11 >= t10 || m10.has(n11 * t10 + e18) || e18 === r10.start[0] && n11 === r10.start[1] || !!r10.goal && e18 === r10.goal[0] && n11 === r10.goal[1])) continue;
    let h10 = { ...r10, cat: p10, catK: nO(2 * (u10 - 1)) }, g10 = PO(h10), _10 = false;
    if (i10.forEach((e18, t11) => {
      let n11 = Tk(g10, e18);
      mO(pO(h10, t11), pO(h10, t11 + 1), g10, n11) && (_10 = true), g10 = n11;
    }), !_10 && n10 < 350) continue;
    let v10 = Xge(h10);
    if (!v10) continue;
    let y10 = Xge(h10, v10 + 1, false);
    if (!(y10 !== null && y10 <= v10 && n10 < 380)) return { ...h10, best: v10 };
  }
  return null;
}
function gO(e17) {
  let t10 = e17, n10 = [], r10 = rO(t10.words.filter(ZD)), i10 = rO(Nge[t10.level].map((e18, t11) => t11)), a10 = rO(Bge(t10.level).map((e18, t11) => t11));
  for (let e18 = 0; e18 < t10.count; e18++) {
    let o10 = null;
    if (t10.lesson === `word`) for (let n11 = 0; n11 < r10.length && !o10; n11++) o10 = xge(t10, r10[(e18 + n11) % r10.length]);
    else o10 = t10.lesson === `math` ? Tge(t10) : t10.lesson === `numbers` ? Cge(t10) : t10.lesson === `collect` ? Ege(t10) : t10.lesson === `read` ? Age(t10, t10.read === `mix` ? [`predict`, `fix`, `gap`][e18 % 3] : t10.read) : t10.lesson === `loop` ? Mge(t10) : t10.lesson === `pen` ? Fge(t10, e18, i10) : t10.lesson === `music` ? Vge(t10, e18, a10) : t10.lesson === `events` ? Hge(t10) : t10.lesson === `cond` ? Jge(t10) : t10.lesson === `count` ? Yge(t10) : t10.lesson === `cat` ? Zge(t10) : cO(t10);
    if (t10.lesson === `pen` && t10.penMode === `free` && e18 > 0) break;
    o10 && n10.push(o10);
  }
  return n10.length || n10.push(cO({ ...t10, walls: `none`, level: `easy` })), n10;
}
var _O = (e17) => e17.charAt(0).toUpperCase() + e17.slice(1);
var vO = (e17) => e17.replace(/ \+ /g, ` plus `).replace(RegExp(` ${wge} `, `g`), ` minus `).replace(/ = /g, ` gleich `);
var yO = { F: `vorw\xE4rts`, B: `r\xFCckw\xE4rts`, L: `links drehen`, R: `rechts drehen`, P: `Pause`, D: `Stift ab`, U: `Stift hoch`, V: `Punkte plus eins` };
var Qge = { F: `vorw\xE4rts`, B: `r\xFCckw\xE4rts`, L: `links`, R: `rechts`, P: `Pause`, D: `Stift ab`, U: `Stift hoch`, V: `Punkte + 1` };
var bO = (e17, t10) => t10 === `P` && e17.lesson === `music` ? `Ton spielen` : t10 === `P` && e17.lesson === `cat` ? `warte` : t10 === `V` ? `Punkte + 1` : yO[t10];
var $ge = (e17, t10) => t10 === `P` && e17.lesson === `music` ? `spielen` : t10 === `P` && e17.lesson === `cat` ? `warte` : Qge[t10];
var xO = (e17, t10) => t10 === `P` && e17?.lesson === `music` ? rge : ID[t10];
function SO(e17, t10) {
  let n10 = AD(e17.costume);
  switch (e17.lesson) {
    case `word`:
      return `Fahre die Buchstaben von ${t10.word ?? ``} der Reihe nach ab!`;
    case `math`:
      return `Rechne und fahre zum Ergebnis!`;
    case `numbers`:
      return `Fahre die Zahlen der Reihe nach ab!`;
    case `collect`:
      return `Sammle alle Sterne \u2013 dann ${n10.toGoal}!`;
    case `read`:
      return t10.kind === `predict` ? `Wo kommt ${n10.nom} an?` : t10.kind === `gap` ? `Was fehlt? ${_O(n10.nom)} soll ${n10.toGoal}.` : `Finde den Fehler! ${_O(n10.nom)} soll ${n10.toGoal}.`;
    case `loop`:
      return t10.stars.length ? `Sammle alle Sterne \u2013 dann ${n10.toGoal}!` : `Hilf ${n10.dat} ${n10.toGoal}!`;
    case `pen`:
      return t10.lines?.length ? `Zeichne ${t10.shape ?? `die Form`}!` : `Male ein Bild!`;
    case `music`:
      return `Spiel den Anfang von \u201E${t10.melody ?? `dem Lied`}\u201C!`;
    case `events`:
      return `Programmiere die Pfeile \u2013 dann steuere ${n10.nom} zu den Sternen!`;
    case `cond`:
      return t10.maze ? `Finde den Weg durchs Labyrinth ${n10.toGoal}!` : `Folge den Farben zum Ziel!`;
    case `cat`:
      return `Hilf ${n10.dat} ${n10.toGoal} \u2013 pass auf die Katze auf!`;
    case `count`:
      return `Z\xE4hle die Sterne auf dem Weg!`;
    default:
      return `Hilf ${n10.dat} ${n10.toGoal}!`;
  }
}
function e_e(e17) {
  return e17.input === `pad` ? e17.pad === `now` ? `Tippe auf die Pfeile \u2013 ${AD(e17.costume).nom} f\xE4hrt sofort.` : `Tippe die Pfeile ein \u2013 dann auf LOS.` : `Tippe auf die Bausteine \u2013 dann auf LOS.`;
}
var CO = (e17, t10) => e17.lesson === `music` && t10 === `c` ? `das hohe C` : e17.lesson === `word` || e17.lesson === `music` ? `das ${t10}` : `die ${t10}`;
var wO = (e17, t10) => e17.lesson === `music` && t10 === `c` ? `zum hohen C` : e17.lesson === `word` || e17.lesson === `music` ? `zum ${t10}` : `zur ${t10}`;
function TO(e17, t10) {
  let n10 = e17.input === `pad` && e17.pad === `now` ? `` : e17.input === `pad` ? ` Halte dort an: Ende oder Pause.` : ` Halte dort an: Ende des Programms oder Pause-Karte.`;
  switch (e17.lesson) {
    case `word`:
      return `Fahre zu jedem Buchstaben.${n10}`;
    case `math`:
      return `Fahre zu jedem Ergebnis.${n10}`;
    case `numbers`:
      return `Fahre zu jeder Zahl.${n10}`;
    case `music`:
      return e17.input === `pad` ? `Fahre zu den T\xF6nen der Reihe nach. Pause oder das Ende spielt den Ton.` : `Fahre zu den T\xF6nen der Reihe nach. \u201ESpielen\u201C oder das Ende spielt den Ton.`;
    case `collect`:
      return `Fahre \xFCber alle Sterne und halte am Ziel an.`;
    case `read`:
      return t10?.kind === `predict` ? `Lies das Programm. Tippe auf das Feld, wo ${AD(e17.costume).nom} ankommt.` : t10?.kind === `gap` ? `Tippe auf das ? und dann auf den Baustein, der fehlt.` : `Ein Baustein ist falsch. Tippe auf ihn und dann auf den richtigen.`;
    case `loop`:
      return t10?.limit ? `H\xF6chstens ${t10.limit} Bausteine \u2013 nimm \u201Ewiederhole\u201C.` : `Mit \u201Ewiederhole\u201C wird das Programm k\xFCrzer.`;
    case `pen`:
      return t10?.lines?.length ? `Mit \u201EStift ab\u201C zieht die Figur eine Linie. Fahre die blasse Form nach.` : `Mit \u201EStift ab\u201C malt die Figur. Probiere Farben und \u201Ewiederhole\u201C.`;
    case `events`:
      return `Was soll passieren, wenn man einen Pfeil tippt? Lege Bausteine hinein.`;
    case `cond`:
      return t10?.maze ? `Nimm \u201Ewiederhole bis Ziel\u201C und \u201Efalls\u201C \u2013 zum Beispiel \u201Efalls Wand vor mir\u201C.` : t10?.colors?.some((e18) => e18[2] === `b`) ? `Rot = rechts drehen, Blau = links drehen. Nimm \u201Ebis Ziel\u201C und \u201Efalls\u201C.` : `Auf Rot: rechts drehen. Nimm \u201Ewiederhole bis Ziel\u201C und \u201Efalls\u201C.`;
    case `cat`:
      return `Die Katze l\xE4uft bei jedem Baustein ein Feld. \u201Ewarte\u201C l\xE4sst sie vorbei.`;
    case `count`:
      return `Auf einem Stern: \u201EPunkte + 1\u201C.`;
    default:
      return e_e(e17);
  }
}
var EO = 400;
var t_e = 200;
function DO(e17, t10, n10) {
  let r10 = (t10.d + n10) % 4, i10 = t10.x + eO[r10], a10 = t10.y + tO[r10];
  return i10 < 0 || a10 < 0 || i10 >= e17.n || a10 >= e17.n || Ck(e17, i10, a10);
}
var n_e = (e17, t10) => e17.colors?.find(([e18, n10]) => e18 === t10.x && n10 === t10.y)?.[2] ?? null;
function r_e(e17, t10) {
  let n10 = t10.pose(), r10 = t10.t;
  switch (e17) {
    case `wall`:
      return DO(r10, n10, 0);
    case `free`:
      return !DO(r10, n10, 0);
    case `rightFree`:
      return !DO(r10, n10, 1);
    case `leftFree`:
      return !DO(r10, n10, 3);
    case `red`:
      return n_e(r10, n10) === `r`;
    case `blue`:
      return n_e(r10, n10) === `b`;
    case `star`:
      return r10.stars.some(([e18, t11]) => e18 === n10.x && t11 === n10.y);
  }
}
function* OO(e17, t10, n10 = 0, r10 = ``, i10 = []) {
  for (let a10 = n10; a10 < e17.length; a10++) {
    if (t10.stuck) return;
    let n11 = e17[a10], o10 = r10 + a10;
    if (!BD(n11)) {
      if (VD(n11)) t10.count++, yield { cmd: `K`, col: n11.col, path: o10, loops: i10 };
      else if (HD(n11)) r_e(n11.cond, t10) && (yield* OO(n11.body, t10, 0, o10 + `.`, i10));
      else if (zD(n11)) {
        if (n11.until) for (let e18 = 1; e18 <= t_e && !(t10.t.goal && t10.t.goal[0] === t10.pose().x && t10.t.goal[1] === t10.pose().y); e18++) {
          let r11 = t10.count;
          if (yield* OO(n11.body, t10, 0, o10 + `.`, [...i10, { path: o10, k: e18, n: 0 }]), t10.count === r11) {
            t10.stuck = true;
            return;
          }
        }
        else for (let e18 = 1; e18 <= n11.rep; e18++) yield* OO(n11.body, t10, 0, o10 + `.`, [...i10, { path: o10, k: e18, n: n11.rep }]);
      } else t10.count++, yield { cmd: n11, path: o10, loops: i10 };
    }
  }
}
var i_e = (e17) => e17.some((e18) => e18 === `?` || (UD(e18) ? i_e(UD(e18)) : false));
function kO(e17, t10) {
  let n10 = t10.split(`.`).map(Number), r10 = e17, i10 = ``;
  for (let e18 of n10.slice(0, -1)) {
    let t11 = r10[e18], n11 = t11 ? UD(t11) : null;
    if (!n11) return null;
    r10 = n11, i10 += e18 + `.`;
  }
  let a10 = n10[n10.length - 1];
  return a10 >= 0 && a10 < r10.length ? { list: r10, i: a10, prefix: i10 } : null;
}
var AO = (e17, t10) => {
  let n10 = kO(e17, t10);
  return n10 ? n10.list[n10.i] : null;
};
function jO(e17) {
  let t10 = [];
  for (let n10 of e17) zD(n10) ? t10.push(`${n10.until ? `wiederhole bis zum Ziel` : `wiederhole ${n10.rep} mal`}: ${jO(n10.body).join(`, `) || `nichts`}. Ende`) : HD(n10) ? t10.push(`falls ${RD[n10.cond]} dann: ${jO(n10.body).join(`, `) || `nichts`}. Ende`) : BD(n10) ? t10.push(`Wenn ${WD[n10.on]} getippt: ${jO(n10.body).join(`, `) || `nichts`}. Ende`) : VD(n10) ? t10.push(`Farbe ${LD[n10.col]?.name ?? ``}`) : t10.push(n10 === `?` ? `L\xFCcke` : yO[n10]);
  return t10;
}
var MO = /* @__PURE__ */ new Map();
var NO = /* @__PURE__ */ new Map();
var PO = (e17) => ({ x: e17.start[0], y: e17.start[1], d: e17.start[2] });
var FO = (e17) => e17.kind === `events` ? sge.map((e18) => ({ on: e18, body: [] })) : e17.prog ? lge(e17.prog) : [];
function IO(e17, t10, n10 = null) {
  let r10 = PO(t10);
  return { ver: e17, tasks: n10, i: 0, prog: FO(t10), done: 0, sel: null, steps: [], mark: null, rating: 0, at: r10, origin: r10, got: 0, ink: [], penDown: false, penCol: 0, play: false, gen: null, env: null, tick: 0, points: 0, phase: `idle`, pc: 0, token: 0, trace: [], msg: null, bad: null, stats: [], gotRun: 0, starsRun: [], happy: false };
}
var LO = (e17, t10) => t10?.tasks ?? e17.tasks;
var RO = (e17, t10) => {
  let n10 = LO(e17, t10);
  return n10[Math.min(t10?.i ?? 0, n10.length - 1)];
};
function zO(e17) {
  let t10 = MO.get(e17);
  if (!t10) {
    let n10 = QD(NO.get(e17)?.pg);
    MO.set(e17, t10 = IO(0, n10.tasks[0]));
  }
  return t10;
}
var BO = (e17) => e17.stats[e17.i] ??= { start: Date.now(), end: 0, tries: 0, peeks: 0, stars: 0 };
var HO = 1400;
var UO = 990;
var WO = { x: 44, y: 140, s: 810 };
var GO = 900;
var KO = 456;
var qO = `Verdana, Arial, sans-serif`;
var JO = `#4c97ff`;
var YO = `#3373cc`;
var XO = `#ffab19`;
var ZO = `#cf8b17`;
var QO = (e17) => e17.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
var s_e = He(`andika`).replace(/"/g, `'`);
var $O = (e17) => WO.s / e17;
var ek = (e17, t10, n10) => [WO.x + (t10 + 0.5) * $O(e17), WO.y + (n10 + 0.5) * $O(e17)];
var tk = (e17, t10, n10, r10) => {
  let [i10, a10] = ek(e17, t10, n10);
  return `translate(${i10.toFixed(1)} ${a10.toFixed(1)}) rotate(${r10.toFixed(1)}) scale(${($O(e17) / 100 * 0.92).toFixed(3)})`;
};
var nk = (e17, t10, n10, r10) => {
  let [i10, a10] = ek(e17, t10, n10);
  return `translate(${i10.toFixed(1)} ${a10.toFixed(1)}) scale(${($O(e17) / 100 * r10).toFixed(3)})`;
};
function rk(e17, t10, n10, r10, i10, a10, o10, s10, c10 = {}) {
  let l10 = c10.rx ?? Math.min(a10 / 2, 22), u10 = e17 && !t10, d10 = c10.size ?? 22, f10 = e17 && t10 ? ` class="lh-key" data-a="${t10}"` : ``, p10 = c10.icon ? d10 * 1.25 : 0, m10 = s10 ? s10.length * d10 * 0.6 : 0, h10 = n10 + i10 / 2 - (p10 + (s10 ? 8 : 0) + m10) / 2, g10 = `<g${f10}${u10 ? ` opacity=".4"` : ``}><rect x="${n10}" y="${r10}" width="${i10}" height="${a10}" rx="${l10}" fill="${o10}"${c10.stroke ? ` stroke="${c10.stroke}" stroke-width="2.5"` : ``}/>`;
  return c10.icon && (g10 += `<g transform="translate(${(h10 + p10 / 2).toFixed(1)} ${r10 + a10 / 2}) scale(${(d10 / 34).toFixed(3)})" fill="${c10.color ?? `#fff`}" stroke="${c10.color ?? `#fff`}">${c10.icon}</g>`), s10 && (g10 += `<text x="${(c10.icon ? h10 + p10 + 8 : n10 + i10 / 2).toFixed(1)}" y="${(r10 + a10 / 2 + d10 * 0.36).toFixed(1)}"${c10.icon ? `` : ` text-anchor="middle"`} font-family="${qO}" font-size="${d10}" font-weight="700" fill="${c10.color ?? `#fff`}">${QO(s10)}</text>`), e17 && t10 && (g10 += `<rect class="lh-kdown" x="${n10}" y="${r10}" width="${i10}" height="${a10}" rx="${l10}" fill="#000" opacity="0"/>`), g10 + `<title>${QO(c10.title ?? s10)}</title></g>`;
}
var ik = `<path d="M-9 -13L13 0L-9 13Z" stroke="none"/>`;
var c_e = `<rect x="-11" y="-11" width="22" height="22" rx="3" stroke="none"/>`;
var l_e = `<path d="M-12 -12L6 0L-12 12Z" stroke="none"/><rect x="8" y="-12" width="5" height="24" rx="1.5" stroke="none"/>`;
var u_e = `<path d="M-14 0L-5 -10H14V10H-5Z" fill="none" stroke-width="3" stroke-linejoin="round"/><path d="M0 -4L7 4M7 -4L0 4" fill="none" stroke-width="3" stroke-linecap="round"/>`;
var d_e = `<path d="M-11 -8H11M-7 -8V12H7V-8M-4 -8V-12H4V-8" fill="none" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
var ak = `<path d="M-13 -5H-7L1 -12V12L-7 5H-13Z" stroke="none"/><path d="M5 -6Q9 0 5 6M9 -10Q16 0 9 10" fill="none" stroke-width="2.6" stroke-linecap="round"/>`;
var ok = `<path d="M-9 -9A12 12 0 1 1 -12 2" fill="none" stroke-width="3.2" stroke-linecap="round"/><path d="M-15 -14L-7 -5L-16 -3Z" stroke="none"/>`;
var f_e = `<path d="M-12 0H10M3 -8L11 0L3 8" fill="none" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`;
var sk = `<path d="M-16 0Q0 -14 16 0Q0 14 -16 0Z" fill="none" stroke-width="3" stroke-linejoin="round"/><circle cx="0" cy="0" r="5.5" stroke="none"/>`;
var p_e = `<path d="M-12 1L0 -11L12 1M-8 -2V12H8V-2" fill="none" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
function m_e(e17, t10, n10, r10, i10 = ``, a10) {
  if (e17 === `?`) return `<rect class="lh-pg-face" x="${t10}" y="${n10}" width="${r10}" height="${r10}" rx="${r10 * 0.16}" fill="#fff7ed" stroke="#ea580c" stroke-width="${Math.max(2.5, r10 * 0.05).toFixed(1)}" stroke-dasharray="${(r10 * 0.12).toFixed(1)} ${(r10 * 0.08).toFixed(1)}"${i10}/><text x="${(t10 + r10 / 2).toFixed(1)}" y="${(n10 + r10 * 0.68).toFixed(1)}" text-anchor="middle" font-family="${qO}" font-size="${(r10 * 0.52).toFixed(1)}" font-weight="700" fill="#ea580c">?</text>`;
  let o10 = e17 === `P` ? XO : JO, s10 = e17 === `P` ? ZO : YO, c10 = r10 * 0.16, l10 = r10 * 0.12, u10 = n10 + r10 / 2;
  return `<path class="lh-pg-face" d="${`M${t10 + c10} ${n10}H${t10 + r10 - c10}Q${t10 + r10} ${n10} ${t10 + r10} ${n10 + c10}V${u10 - l10}A${l10} ${l10} 0 0 1 ${t10 + r10} ${u10 + l10}V${n10 + r10 - c10}Q${t10 + r10} ${n10 + r10} ${t10 + r10 - c10} ${n10 + r10}H${t10 + c10}Q${t10} ${n10 + r10} ${t10} ${n10 + r10 - c10}V${n10 + c10}Q${t10} ${n10} ${t10 + c10} ${n10}Z`}" fill="${o10}" stroke="${s10}" stroke-width="${Math.max(2, r10 * 0.04).toFixed(1)}"${i10}/><g transform="translate(${(t10 + r10 / 2).toFixed(1)} ${(n10 + r10 / 2).toFixed(1)}) scale(${(r10 / 72 * 0.78).toFixed(3)})">${a10 ?? ID[e17]}</g>`;
}
function ck(e17, t10) {
  let n10 = [], r10 = ``;
  for (let i10 of e17.split(/\s+/)) r10 && (r10 + ` ` + i10).length > t10 ? (n10.push(r10), r10 = i10) : r10 = r10 ? r10 + ` ` + i10 : i10;
  return r10 && n10.push(r10), n10;
}
function h_e(e17, t10, n10 = false) {
  let r10 = t10.t, i10 = r10.n, a10 = $O(i10), o10 = FD(e17.mat), s10 = tge(e17.mat, i10, WO.x, WO.y, WO.s);
  if (r10.path?.length) {
    for (let [e18, t11] of r10.path) {
      let [n11, r11] = ek(i10, e18, t11), o11 = a10 * 0.9;
      s10 += `<rect x="${(n11 - o11 / 2).toFixed(1)}" y="${(r11 - o11 / 2).toFixed(1)}" width="${o11.toFixed(1)}" height="${o11.toFixed(1)}" rx="${(a10 * 0.12).toFixed(1)}" fill="#fef3c7" stroke="#d97706" stroke-opacity=".5" stroke-width="2"/>`;
    }
    for (let [e18, t11, n11] of r10.colors ?? []) {
      let [o11, c11] = ek(i10, e18, t11), l11 = a10 * 0.9;
      s10 += `<rect class="lh-pg-color" x="${(o11 - l11 / 2).toFixed(1)}" y="${(c11 - l11 / 2).toFixed(1)}" width="${l11.toFixed(1)}" height="${l11.toFixed(1)}" rx="${(a10 * 0.12).toFixed(1)}" fill="${n11 === `r` ? `#ef4444` : `#3b82f6`}" stroke="${n11 === `r` ? `#991b1b` : `#1e40af`}" stroke-width="3"/>`;
      let u11 = r10.path.findIndex(([n12, r11]) => n12 === e18 && r11 === t11), d11 = u11 > 0 ? r10.path[u11 - 1] : null;
      if (d11) {
        let r11 = eO.findIndex((n12, r12) => e18 - d11[0] === n12 && t11 - d11[1] === tO[r12]);
        s10 += `<g transform="translate(${o11.toFixed(1)} ${c11.toFixed(1)}) rotate(${r11 * 90}) scale(${a10 / 100 * 0.62})" opacity=".85">${ID[n11 === `r` ? `R` : `L`]}</g>`;
      }
    }
  }
  let [c10, l10] = ek(i10, r10.start[0], r10.start[1]);
  if (s10 += `<circle cx="${c10.toFixed(1)}" cy="${l10.toFixed(1)}" r="${(a10 * 0.4).toFixed(1)}" fill="none" stroke="${e17.mat === `space` ? `#c7d2fe` : `#64748b`}" stroke-width="${Math.max(2, a10 * 0.025).toFixed(1)}" stroke-dasharray="${(a10 * 0.07).toFixed(1)} ${(a10 * 0.06).toFixed(1)}"/>`, s10 += `<text x="${c10.toFixed(1)}" y="${(l10 + a10 * 0.47).toFixed(1)}" text-anchor="middle" font-family="${qO}" font-size="${(a10 * 0.11).toFixed(1)}" font-weight="700" fill="${e17.mat === `space` ? `#c7d2fe` : `#64748b`}">START</text>`, r10.maze) for (let [t11, n11] of r10.walls) s10 += `<rect class="lh-pg-wall" data-x="${t11}" data-y="${n11}" x="${(WO.x + t11 * a10).toFixed(1)}" y="${(WO.y + n11 * a10).toFixed(1)}" width="${a10.toFixed(1)}" height="${a10.toFixed(1)}" fill="${e17.mat === `garden` ? `#15803d` : e17.mat === `space` ? `#57534e` : o10.frame}" stroke="${e17.mat === `space` ? `#292524` : `#0f172a`}" stroke-opacity=".35" stroke-width="2"/>`;
  else for (let [e18, t11] of r10.walls) s10 += `<g class="lh-pg-wall" data-x="${e18}" data-y="${t11}" transform="${nk(i10, e18, t11, 0.82)}">${o10.wallSvg}</g>`;
  for (let [e18, t11] of r10.cat ?? []) s10 += `<g transform="${nk(i10, e18, t11, 0.55)}" fill="#c2410c" opacity=".45">${oge}</g>`;
  let u10 = new Set(r10.stops.slice(0, t10.got).map((e18) => `${e18.x},${e18.y}`)), d10 = /* @__PURE__ */ new Map();
  for (let e18 of [...r10.extra, ...r10.stops]) d10.set(`${e18.x},${e18.y}`, e18.t);
  let f10 = e17.numMat && e17.lesson !== `word`;
  for (let [t11, n11] of d10) {
    let [r11, o11] = t11.split(`,`).map(Number), [c11, l11] = ek(i10, r11, o11), d11 = u10.has(t11), p11 = a10 * (n11.length > 2 ? 0.34 : n11.length > 1 ? 0.42 : 0.5) * (f10 ? 0.8 : 1);
    if (f10) d11 && (s10 += `<circle cx="${c11.toFixed(1)}" cy="${l11.toFixed(1)}" r="${(a10 * 0.36).toFixed(1)}" fill="#bbf7d0" stroke="#16a34a" stroke-width="3"/>`);
    else if (e17.lesson === `music`) {
      let e18 = a10 * 0.74;
      s10 += `<rect data-cell="${t11}" x="${(c11 - e18 / 2).toFixed(1)}" y="${(l11 - e18 / 2).toFixed(1)}" width="${e18.toFixed(1)}" height="${e18.toFixed(1)}" rx="${(a10 * 0.16).toFixed(1)}" fill="${Lge(n11)}" stroke="${d11 ? `#16a34a` : `#1e293b`}" stroke-width="${d11 ? 6 : 3}"/>`;
    } else {
      let e18 = a10 * 0.74;
      s10 += `<rect data-cell="${t11}" x="${(c11 - e18 / 2).toFixed(1)}" y="${(l11 - e18 / 2).toFixed(1)}" width="${e18.toFixed(1)}" height="${e18.toFixed(1)}" rx="${(a10 * 0.12).toFixed(1)}" fill="${d11 ? `#dcfce7` : `#ffffff`}" stroke="${d11 ? `#16a34a` : `#334155`}" stroke-width="3"/>`;
    }
    s10 += `<text class="lh-pg-label" data-x="${r11}" data-y="${o11}" x="${c11.toFixed(1)}" y="${(l11 + p11 * 0.36).toFixed(1)}" text-anchor="middle" font-family="${e17.lesson === `word` ? s_e : qO}" font-size="${p11.toFixed(1)}" font-weight="700" fill="${e17.lesson === `music` ? `#ffffff` : d11 ? `#166534` : e17.mat === `space` && f10 ? `#e0e7ff` : `#1e293b`}"${e17.lesson === `music` ? ` stroke="#1e293b" stroke-width="1.5" paint-order="stroke"` : ``} data-t="${QO(n11)}">${QO(e17.lesson === `music` ? Rge(n11) : n11)}</text>`, e17.lesson === `music` && (s10 += zge(n11, c11, l11 - p11 * 0.58, p11 * 0.13));
  }
  if (r10.stars.forEach(([e18, n11], r11) => {
    s10 += `<g data-star="${r11}" class="lh-pg-star${t10.stars.includes(r11) ? ` is-got` : ``}" transform="${nk(i10, e18, n11, 0.72)}">${ND}</g>`;
  }), r10.goal && (s10 += `<g class="lh-pg-goal" data-x="${r10.goal[0]}" data-y="${r10.goal[1]}" transform="${nk(i10, r10.goal[0], r10.goal[1], 0.82)}">${Zhe[e17.costume]}</g>`), r10.lines?.length) {
    let t11 = ``;
    for (let [e18, n11, a11, o11] of r10.lines) {
      let [r11, s11] = ek(i10, e18, n11), [c11, l11] = ek(i10, a11, o11);
      t11 += `M${r11.toFixed(1)} ${s11.toFixed(1)}L${c11.toFixed(1)} ${l11.toFixed(1)}`;
    }
    s10 += `<path class="lh-pg-target" d="${t11}" fill="none" stroke="${e17.mat === `space` ? `#c7d2fe` : `#64748b`}" stroke-opacity=".45" stroke-width="${(a10 * 0.13).toFixed(1)}" stroke-linecap="round" stroke-dasharray="${(a10 * 0.04).toFixed(1)} ${(a10 * 0.16).toFixed(1)}"/>`;
  }
  let p10 = t10.trace.map(([e18, t11]) => ek(i10, e18, t11).map((e19) => e19.toFixed(1)).join(`,`)).join(` `);
  if (s10 += `<polyline class="lh-pg-trace" points="${p10}" fill="none" stroke="#2563eb" stroke-opacity=".5" stroke-width="${(a10 * 0.07).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${(a10 * 0.01).toFixed(2)} ${(a10 * 0.13).toFixed(1)}"/>`, e17.lesson === `pen`) {
    s10 += `<g class="lh-pg-ink">`;
    for (let e18 of t10.ink) {
      let [t11, n11] = ek(i10, e18[0], e18[1]), [r11, o11] = ek(i10, e18[2], e18[3]);
      s10 += `<line x1="${t11.toFixed(1)}" y1="${n11.toFixed(1)}" x2="${r11.toFixed(1)}" y2="${o11.toFixed(1)}" stroke="${LD[e18[4]]?.c ?? LD[0].c}" stroke-width="${(a10 * 0.1).toFixed(1)}" stroke-linecap="round"/>`;
    }
    s10 += `</g>`;
  }
  let m10 = pO(r10, t10.tick);
  if (m10 && (s10 += `<g class="lh-pg-cat" data-track="${(r10.cat ?? []).map((e18) => e18.join(`,`)).join(`;`)}" data-k="${r10.catK ?? 0}" transform="${nk(i10, m10[0], m10[1], 0.78)}">${age}</g>`), t10.mark) {
    let [e18, n11] = ek(i10, t10.mark[0], t10.mark[1]), r11 = t10.phase === `won`;
    s10 += `<g class="lh-pg-mark"><circle cx="${e18.toFixed(1)}" cy="${n11.toFixed(1)}" r="${(a10 * 0.42).toFixed(1)}" fill="${r11 ? `#bbf7d0` : `#ffedd5`}" stroke="${r11 ? `#16a34a` : `#ea580c`}" stroke-width="${(a10 * 0.05).toFixed(1)}"/><path d="M${(e18 - a10 * 0.08).toFixed(1)} ${(n11 + a10 * 0.24).toFixed(1)}V${(n11 - a10 * 0.26).toFixed(1)}l${(a10 * 0.26).toFixed(1)} ${(a10 * 0.1).toFixed(1)}l${(-a10 * 0.26).toFixed(1)} ${(a10 * 0.1).toFixed(1)}" fill="${r11 ? `#16a34a` : `#ea580c`}" stroke="${r11 ? `#16a34a` : `#ea580c`}" stroke-width="${(a10 * 0.035).toFixed(1)}" stroke-linejoin="round"/></g>`;
  }
  if (s10 += `<g class="lh-pg-bot" data-n="${i10}" data-x="${t10.at.x}" data-y="${t10.at.y}" data-d="${t10.at.d}" transform="${tk(i10, t10.at.x, t10.at.y, t10.ang)}"><g class="lh-pg-body${t10.happy ? ` is-happy` : ``}">${MD[e17.costume]}</g>${e17.lesson === `pen` ? `<circle class="lh-pg-pendot" r="11" fill="${LD[t10.penCol]?.c ?? LD[0].c}" stroke="#fff" stroke-width="4" opacity="${+!!t10.penDown}"/>` : ``}</g>`, n10 && t10.t.kind === `predict` && t10.phase === `idle`) for (let t11 = 0; t11 < i10; t11++) for (let n11 = 0; n11 < i10; n11++) s10 += `<rect class="lh-key" data-a="cell:${n11},${t11}" x="${(WO.x + n11 * a10).toFixed(1)}" y="${(WO.y + t11 * a10).toFixed(1)}" width="${a10.toFixed(1)}" height="${a10.toFixed(1)}" fill="#000" fill-opacity="0"><title>Hier kommt ${QO(AD(e17.costume).nom)} an</title></rect>`;
  return s10;
}
function g_e(e17, t10, n10) {
  let r10 = t10.t, i10 = 124, a10 = ``;
  return e17.lesson === `goal` || e17.lesson === `read` || e17.lesson === `loop` && !r10.stars.length ? `<text x="${i10}" y="${n10}" font-family="${qO}" font-size="23" fill="#475569">${QO(TO(e17, r10))}</text>` : e17.lesson === `collect` || e17.lesson === `loop` ? (r10.stars.forEach((e18, r11) => {
    let o10 = t10.stars.includes(r11);
    a10 += `<g transform="translate(${i10 + 20} ${n10 - 9}) scale(.7)" opacity="${o10 ? 1 : 0.3}">${ND}</g>`, i10 += 44;
  }), a10 + `<text x="${i10 + 10}" y="${n10}" font-family="${qO}" font-size="22" fill="#475569">${QO(TO(e17, r10))}</text>`) : e17.lesson === `music` ? (r10.stops.forEach((e18, r11) => {
    let o10 = r11 < t10.got, s10 = r11 === t10.got && t10.phase !== `won`;
    a10 += `<rect x="${i10}" y="${n10 - 32}" width="44" height="46" rx="10" fill="${Lge(e18.t)}" stroke="${o10 ? `#16a34a` : s10 ? `#1e293b` : `#ffffff`}" stroke-width="${o10 || s10 ? 4 : 2}" opacity="${o10 || s10 ? 1 : 0.8}"/>`, a10 += `<text x="${i10 + 22}" y="${n10}" text-anchor="middle" font-family="${qO}" font-size="24" font-weight="700" fill="#fff" stroke="#1e293b" stroke-width="1.2" paint-order="stroke">${QO(Rge(e18.t))}</text>${zge(e18.t, i10 + 22, n10 - 26, 3.5)}`, o10 && (a10 += `<path d="M${i10 + 30} ${n10 - 40}l5 5 10-11" fill="none" stroke="#16a34a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`), i10 += 50;
  }), a10) : e17.lesson === `count` ? `<rect x="${i10}" y="${n10 - 32}" width="150" height="46" rx="12" fill="#ff8c1a" stroke="#db6e00" stroke-width="2.5"/><text x="${i10 + 14}" y="${n10}" font-family="${qO}" font-size="22" font-weight="700" fill="#fff">Punkte:</text><text class="lh-pg-points" x="${i10 + 128}" y="${n10}" text-anchor="end" font-family="${qO}" font-size="26" font-weight="700" fill="#fff">${t10.points}</text><text x="${i10 + 166}" y="${n10}" font-family="${qO}" font-size="21" fill="#475569">${QO(TO(e17, r10))}</text>` : e17.lesson === `pen` || e17.lesson === `events` || e17.lesson === `cond` || e17.lesson === `cat` ? `<text x="${i10}" y="${n10}" font-family="${qO}" font-size="22" fill="#475569">${QO(TO(e17, r10))}</text>` : (r10.stops.forEach((o10, s10) => {
    let c10 = s10 < t10.got, l10 = s10 === t10.got && t10.phase !== `won`, u10 = e17.lesson === `math` ? `${r10.sums?.[s10] ?? `?`} = ${c10 ? o10.t : `?`}` : o10.t, d10 = e17.lesson === `word` ? 34 : 24, f10 = Math.max(48, u10.length * d10 * (e17.lesson === `word` ? 0.62 : 0.6) + 24);
    a10 += `<rect x="${i10}" y="${n10 - 32}" width="${f10.toFixed(1)}" height="46" rx="10" fill="${c10 ? `#dcfce7` : l10 ? `#fef9c3` : `#ffffff`}" stroke="${c10 ? `#16a34a` : l10 ? `#ca8a04` : `#94a3b8`}" stroke-width="${l10 ? 3.5 : 2.5}"/>`, a10 += `<text x="${(i10 + f10 / 2).toFixed(1)}" y="${n10 + (e17.lesson === `word` ? 3 : 0)}" text-anchor="middle" font-family="${e17.lesson === `word` ? s_e : qO}" font-size="${d10}" font-weight="700" fill="${c10 ? `#166534` : `#1e293b`}">${QO(u10)}</text>`, i10 += f10 + (e17.lesson === `word` ? 8 : 14);
  }), a10);
}
function lk(e17, t10, n10, r10, i10, a10, o10, s10 = 0) {
  let c10 = e17?.k ?? `info`, l10 = c10 === `bad` ? `#fef2f2` : c10 === `ok` ? `#f0fdf4` : c10 === `win` ? `#dcfce7` : `#f8fafc`, u10 = c10 === `bad` ? `#f87171` : c10 === `ok` || c10 === `win` ? `#22c55e` : `#cbd5e1`, d10 = c10 === `bad` ? `#b91c1c` : c10 === `ok` || c10 === `win` ? `#166534` : `#475569`, f10 = s10 ? 46 : 0, p10 = ck(e17?.t ?? t10, Math.floor((i10 - 28) / (o10 * (e17 ? 0.62 : 0.56)))).slice(0, Math.max(1, Math.floor((a10 - f10 - 12) / (o10 * 1.3)))), m10 = `<rect x="${n10}" y="${r10}" width="${i10}" height="${a10}" rx="16" fill="${l10}" stroke="${u10}" stroke-width="2.5"/>`;
  for (let e18 = 0; e18 < (s10 ? 3 : 0); e18++) m10 += `<g transform="translate(${n10 + 32 + e18 * 44} ${r10 + 30}) scale(.62)" opacity="${e18 < s10 ? 1 : 0.22}">${ND}</g>`;
  let h10 = r10 + f10 + (a10 - f10) / 2 - (p10.length - 1) * o10 * 1.3 / 2 + o10 * 0.36;
  return p10.forEach((t11, r11) => m10 += `<text x="${n10 + 16}" y="${(h10 + r11 * o10 * 1.3).toFixed(1)}" font-family="${qO}" font-size="${o10}" font-weight="${e17 ? 700 : 400}" fill="${d10}">${QO(t11)}</text>`), m10;
}
function __e(e17, t10, n10, r10, i10, a10, o10 = false, s10 = `edit`) {
  let c10 = t10.prog.length, l10 = o10 ? 4 : 8, u10 = o10 ? 34 : 72;
  for (let e18 of o10 ? [34, 28] : [72, 60, 50, 42]) if (u10 = e18, Math.floor((i10 + l10) / (e18 + l10)) * Math.floor((a10 + l10) / (e18 + l10)) >= c10 + 1) break;
  let d10 = Math.max(1, Math.floor((i10 + l10) / (u10 + l10))), f10 = Math.max(1, Math.floor((a10 + l10) / (u10 + l10))), p10 = Math.max(0, c10 - d10 * f10), m10 = ``, h10 = ``;
  for (let i11 = p10; i11 < c10; i11++) {
    let a11 = t10.prog[i11];
    if (typeof a11 == `object`) continue;
    let c11 = String(i11), f11 = i11 - p10, g10 = n10 + f11 % d10 * (u10 + l10), _10 = r10 + Math.floor(f11 / d10) * (u10 + l10), v10 = `lh-pg-card${i11 < t10.done ? ` is-done` : ``}${t10.sel === c11 ? ` is-sel` : ``}${t10.bad === c11 ? ` is-bad` : ``}`, y10 = e17 && !o10 && s10 !== `read` && i11 >= t10.done && (t10.phase === `idle` || t10.phase === `step`), b10 = y10 && s10 === `edit` ? ` data-drag="${c11}"` : ``;
    if (m10 += `<g data-node="${c11}" data-cmd="${a11}"${b10} class="${v10}${y10 ? ` lh-key` : ``}"${y10 ? ` data-a="card:${c11}"` : ``}>${m_e(a11, g10, _10, u10, ``, a11 === `?` ? void 0 : xO(t10.pg, a11))}${y10 ? `<rect class="lh-kdown" x="${g10}" y="${_10}" width="${u10}" height="${u10}" rx="${u10 * 0.16}" fill="#000" opacity="0"/><title>${QO(a11 === `?` ? `L\xFCcke` : bO(t10.pg, a11))}</title>` : ``}</g>`, t10.sel === c11 && e17 && !o10 && s10 === `edit`) {
      m10 += `<path d="M${g10 + u10 + l10 / 2} ${_10 - 4}V${_10 + u10 + 4}" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>`;
      let e18 = Math.max(17, u10 * 0.29);
      h10 = v_e(c11, g10 + u10 - 6, _10 + 6, e18, { cx: g10 + u10 - 6, cy: _10 + 6, r: e18 * 1.75 });
    }
  }
  return p10 && (m10 += `<text x="${n10 + i10}" y="${r10 - 6}" text-anchor="end" font-family="${qO}" font-size="15" fill="#64748b">\u2026 und ${p10} weitere davor</text>`), m10 + h10;
}
function v_e(e17, t10, n10, r10, i10) {
  let a10 = r10 * 0.42;
  return `<g class="lh-key" data-a="del:${e17}">${`r` in i10 ? `<circle cx="${i10.cx.toFixed(1)}" cy="${i10.cy.toFixed(1)}" r="${i10.r.toFixed(1)}" fill="#000" fill-opacity="0"/>` : `<rect x="${i10.x.toFixed(1)}" y="${i10.y.toFixed(1)}" width="${i10.w.toFixed(1)}" height="${i10.h.toFixed(1)}" fill="#000" fill-opacity="0"/>`}<circle cx="${t10.toFixed(1)}" cy="${n10.toFixed(1)}" r="${r10.toFixed(1)}" fill="#dc2626" stroke="#fff" stroke-width="3"/><path d="M${(t10 - a10).toFixed(1)} ${(n10 - a10).toFixed(1)}l${(2 * a10).toFixed(1)} ${(2 * a10).toFixed(1)}m0 ${(-2 * a10).toFixed(1)}l${(-2 * a10).toFixed(1)} ${(2 * a10).toFixed(1)}" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle class="lh-kdown" cx="${t10.toFixed(1)}" cy="${n10.toFixed(1)}" r="${r10.toFixed(1)}" fill="#000" opacity="0"/><title>Baustein entfernen</title></g>`;
}
var uk = `<path d="M-13 -1A13 13 0 0 1 9 -10" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/><path d="M4 -19L16 -9L2 -3Z" fill="#fff"/><path d="M13 1A13 13 0 0 1 -9 10" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/><path d="M-4 19L-16 9L-2 3Z" fill="#fff"/>`;
function y_e(e17, t10 = ``, n10 = 0, r10 = [], i10 = 0) {
  return e17.forEach((e18, a10) => {
    let o10 = t10 + (a10 + i10), s10 = UD(e18);
    s10 ? (r10.push({ kind: `top`, path: o10, depth: n10, node: e18 }), s10.length || r10.push({ kind: `slot`, path: o10, depth: n10 + 1 }), y_e(s10, o10 + `.`, n10 + 1, r10), r10.push({ kind: `end`, path: o10, depth: n10 })) : r10.push({ kind: `cmd`, path: o10, depth: n10, node: e18 });
  }), r10;
}
var dk = `#0fbd8c`;
var fk = `#0b9a72`;
var b_e = `#ffbf00`;
var x_e = `#cc9900`;
var S_e = `#ff8c1a`;
var C_e = `#db6e00`;
function w_e(e17, t10, n10, r10, i10, a10, o10 = t10.prog, s10 = 0, c10 = true) {
  let l10 = y_e(o10, ``, 0, [], s10), u10 = l10.filter((e18) => e18.kind === `end`).length, d10 = Math.max(22, Math.min(46, l10.length ? (a10 - (l10.length - 1) * 4) / (l10.length - u10 + u10 * 0.42) : 46)), f10 = e17 && c10 && (t10.phase === `idle` || t10.phase === `step`), p10 = r10, m10 = l10.map((e18) => {
    let t11 = e18.kind === `end` ? d10 * 0.42 : d10, n11 = { y: p10, h: t11 };
    return p10 += t11 + 4, n11;
  }), h10 = d10 * 0.42, g10 = ``, _10 = ``;
  l10.forEach((e18, t11) => {
    if (e18.kind !== `top`) return;
    let r11 = l10.findIndex((n11, r12) => r12 > t11 && n11.kind === `end` && n11.path === e18.path), a11 = n10 + e18.depth * 26, o11 = BD(e18.node), s11 = o11 ? b_e : XO;
    g10 += `<rect x="${a11}" y="${(m10[t11].y + d10 - 3).toFixed(1)}" width="18" height="${(m10[r11].y - m10[t11].y - d10 + 6).toFixed(1)}" fill="${s11}"/>`, g10 += `<rect data-end="${e18.path}" x="${a11}" y="${m10[r11].y.toFixed(1)}" width="${Math.min(150, i10 - e18.depth * 26)}" height="${m10[r11].h.toFixed(1)}" rx="${(m10[r11].h / 2).toFixed(1)}" fill="${s11}" stroke="${o11 ? x_e : ZO}" stroke-width="2"/>`;
  });
  let v10 = (e18, t11, n11, r11, i11) => `<rect class="lh-pg-face" x="${e18}" y="${t11.toFixed(1)}" width="${n11}" height="${d10.toFixed(1)}" rx="${(d10 * 0.22).toFixed(1)}" fill="${r11}" stroke="${i11}" stroke-width="2"/>`, y10 = (e18, t11, n11) => f10 ? `<rect class="lh-kdown" x="${e18}" y="${t11.toFixed(1)}" width="${n11}" height="${d10.toFixed(1)}" rx="${(d10 * 0.22).toFixed(1)}" fill="#000" opacity="0"/>` : ``, b10 = (e18, t11, n11) => `<g transform="translate(${(e18 + d10 * 0.55).toFixed(1)} ${(t11 + d10 / 2).toFixed(1)}) scale(${(d10 / 72 * 0.68).toFixed(3)})">${n11}</g>`, x10 = (e18, t11, n11, r11 = `#fff`, i11 = 0) => {
    let a11 = i11 > 0 && n11.length * h10 * 0.64 > i11 ? ` textLength="${i11.toFixed(1)}" lengthAdjust="spacingAndGlyphs"` : ``;
    return `<text x="${e18.toFixed(1)}" y="${(t11 + d10 * 0.66).toFixed(1)}" font-family="${qO}" font-size="${h10.toFixed(1)}" font-weight="700" fill="${r11}"${a11}>${QO(n11)}</text>`;
  };
  if (l10.forEach((e18, r11) => {
    if (e18.kind === `end`) return;
    let a11 = n10 + e18.depth * 26, o11 = i10 - e18.depth * 26, s11 = m10[r11].y;
    if (e18.kind === `slot`) {
      g10 += `<g data-slot="${e18.path}"${f10 ? ` class="lh-key" data-a="card:${e18.path}"` : ``}><rect x="${a11}" y="${s11.toFixed(1)}" width="${o11}" height="${d10.toFixed(1)}" rx="${(d10 * 0.22).toFixed(1)}" fill="#fffbeb" stroke="${XO}" stroke-width="2" stroke-dasharray="8 6"/><text x="${a11 + 12}" y="${(s11 + d10 * 0.64).toFixed(1)}" font-family="${qO}" font-size="${(h10 * 0.85).toFixed(1)}" fill="#b45309">${o11 < 260 ? `leer \u2013 hierher ziehen` : `leer \u2013 Bausteine hierher ziehen`}</text></g>`;
      return;
    }
    let c11 = e18.node, l11 = t10.sel === e18.path, u11 = `lh-pg-card${l11 ? ` is-sel` : ``}${t10.bad === e18.path ? ` is-bad` : ``}`;
    if (BD(c11)) {
      let t11 = a11 + 12 + 4 * h10 * 0.7 + 8 + d10 * 0.38;
      g10 += `<g data-node="${e18.path}" class="${u11} is-loop is-event${f10 ? ` lh-key" data-a="card:${e18.path}` : ``}">${v10(a11, s11, o11, b_e, x_e)}` + x10(a11 + 12, s11, `Wenn`, `#422006`) + `<g transform="translate(${t11.toFixed(1)} ${(s11 + d10 / 2).toFixed(1)})"><circle r="${(d10 * 0.38).toFixed(1)}" fill="#422006"/><g transform="scale(${(d10 / 72 * 0.6).toFixed(3)})">${ige(cge[c11.on])}</g></g>` + x10(t11 + d10 * 0.38 + 8, s11, `getippt`, `#422006`, a11 + o11 - (t11 + d10 * 0.38 + 8) - 8) + `${y10(a11, s11, o11)}<title>Wenn ${WD[c11.on]} getippt</title></g>`;
      return;
    }
    let p11 = f10 ? ` lh-key" data-drag="${e18.path}" data-a="card:${e18.path}` : ``;
    if (HD(c11)) {
      let t11 = a11 + 12, n11 = t11 + 5 * h10 * 0.64 + 8, r12 = RD[c11.cond], i11 = Math.min(o11 - (n11 - a11) - (l11 ? Math.max(90, d10 * 2) : 70), r12.length * h10 * 0.6 + 20);
      g10 += `<g data-node="${e18.path}" class="${u11} is-loop${p11}">${v10(a11, s11, o11, XO, ZO)}${x10(t11, s11, `falls`)}${i11 < o11 ? x10(n11 + i11 + 8, s11, `dann`, `#fff`, a11 + o11 - (n11 + i11 + 8) - (l11 ? Math.max(90, d10 * 2) : 8)) : ``}${y10(a11, s11, o11)}<title>falls ${QO(r12)} dann</title></g>`, g10 += `<g${f10 ? ` class="lh-key" data-a="cond:${e18.path}"` : ``}><rect x="${n11.toFixed(1)}" y="${(s11 + d10 * 0.14).toFixed(1)}" width="${i11.toFixed(1)}" height="${(d10 * 0.72).toFixed(1)}" rx="${(d10 * 0.36).toFixed(1)}" fill="#5cb1d6" stroke="#2e8eb8" stroke-width="2"/><text x="${(n11 + i11 / 2).toFixed(1)}" y="${(s11 + d10 * 0.64).toFixed(1)}" text-anchor="middle" font-family="${qO}" font-size="${(h10 * 0.92).toFixed(1)}" font-weight="700" fill="#fff"${r12.length * h10 * 0.6 > i11 - 12 ? ` textLength="${(i11 - 12).toFixed(1)}" lengthAdjust="spacingAndGlyphs"` : ``}>${QO(r12)}</text>${f10 ? `<rect class="lh-kdown" x="${n11.toFixed(1)}" y="${(s11 + d10 * 0.14).toFixed(1)}" width="${i11.toFixed(1)}" height="${(d10 * 0.72).toFixed(1)}" rx="${(d10 * 0.36).toFixed(1)}" fill="#000" opacity="0"/>` : ``}<title>andere Bedingung</title></g>`;
    } else if (zD(c11) && c11.until) g10 += `<g data-node="${e18.path}" class="${u11} is-loop${p11}">${v10(a11, s11, o11, XO, ZO)}${b10(a11, s11, uk)}${x10(a11 + d10 * 1.1, s11, `wiederhole bis Ziel`, `#fff`, o11 - d10 * 1.1 - (l11 ? Math.max(90, d10 * 2) + 40 : 50))}<text data-loopk="${e18.path}" x="${(a11 + o11 - (l11 ? Math.max(90, d10 * 2) + 8 : 12)).toFixed(1)}" y="${(s11 + d10 * 0.66).toFixed(1)}" text-anchor="end" font-family="${qO}" font-size="${h10.toFixed(1)}" font-weight="700" fill="#fff"></text>${y10(a11, s11, o11)}<title>wiederhole bis zum Ziel</title></g>`;
    else if (zD(c11)) {
      let t11 = a11 + d10 * 1.1, n11 = t11 + 10 * h10 * 0.64 + 10, r12 = d10 * 0.34, i11 = s11 + d10 / 2;
      g10 += `<g data-node="${e18.path}" class="${u11} is-loop${p11}">${v10(a11, s11, o11, XO, ZO)}${b10(a11, s11, uk)}${x10(t11, s11, `wiederhole`)}<rect x="${(n11 + r12 * 2 + 2).toFixed(1)}" y="${(i11 - d10 * 0.34).toFixed(1)}" width="${(h10 * 1.5).toFixed(1)}" height="${(d10 * 0.68).toFixed(1)}" rx="6" fill="#fff"/><text x="${(n11 + r12 * 2 + 2 + h10 * 0.75).toFixed(1)}" y="${(s11 + d10 * 0.67).toFixed(1)}" text-anchor="middle" font-family="${qO}" font-size="${(h10 * 1.05).toFixed(1)}" font-weight="700" fill="#9a3412">${c11.rep}</text>` + x10(n11 + r12 * 4 + h10 * 1.5 + 12, s11, `mal`) + `<text data-loopk="${e18.path}" x="${(a11 + o11 - (l11 ? Math.max(90, d10 * 2) + 8 : 12)).toFixed(1)}" y="${(s11 + d10 * 0.66).toFixed(1)}" text-anchor="end" font-family="${qO}" font-size="${h10.toFixed(1)}" font-weight="700" fill="#fff"></text>${y10(a11, s11, o11)}<title>wiederhole ${c11.rep} mal</title></g>`;
      let m11 = (t12, n12) => `<g${f10 ? ` class="lh-key" data-a="rep${t12}:${e18.path}"` : ``}><circle cx="${n12.toFixed(1)}" cy="${i11.toFixed(1)}" r="${r12.toFixed(1)}" fill="#fff" stroke="${ZO}" stroke-width="2"/><path d="M${(n12 - r12 * 0.5).toFixed(1)} ${i11.toFixed(1)}h${r12.toFixed(1)}${t12 === `+` ? `M${n12.toFixed(1)} ${(i11 - r12 * 0.5).toFixed(1)}v${r12.toFixed(1)}` : ``}" stroke="#9a3412" stroke-width="3" stroke-linecap="round"/>${f10 ? `<circle class="lh-kdown" cx="${n12.toFixed(1)}" cy="${i11.toFixed(1)}" r="${r12.toFixed(1)}" fill="#000" opacity="0"/>` : ``}<title>${t12 === `+` ? `einmal mehr` : `einmal weniger`}</title></g>`;
      g10 += m11(`-`, n11 + r12) + m11(`+`, n11 + r12 * 3 + h10 * 1.5 + 4);
    } else if (VD(c11)) {
      let t11 = LD[c11.col] ?? LD[0], n11 = a11 + d10 * 1.1 + 5 * h10 * 0.64 + 14 + d10 * 0.36;
      g10 += `<g data-node="${e18.path}" data-cmd="K" class="${u11}${p11}">${v10(a11, s11, o11, dk, fk)}${b10(a11, s11, nge)}${x10(a11 + d10 * 1.1, s11, `Farbe`)}${y10(a11, s11, o11)}<title>Farbe ${t11.name}</title></g>`, g10 += `<g${f10 ? ` class="lh-key" data-a="col:${e18.path}"` : ``}><circle cx="${n11.toFixed(1)}" cy="${(s11 + d10 / 2).toFixed(1)}" r="${(d10 * 0.36).toFixed(1)}" fill="${t11.c}" stroke="#fff" stroke-width="3"/>${f10 ? `<circle class="lh-kdown" cx="${n11.toFixed(1)}" cy="${(s11 + d10 / 2).toFixed(1)}" r="${(d10 * 0.36).toFixed(1)}" fill="#000" opacity="0"/>` : ``}<title>andere Farbe</title></g>`;
    } else {
      let n11 = c11, r12 = n11 === `D` || n11 === `U`, i11 = n11 === `P` ? XO : n11 === `?` ? `#fff7ed` : n11 === `V` ? S_e : r12 ? dk : JO, f11 = n11 === `P` ? ZO : n11 === `V` ? C_e : r12 ? fk : YO;
      g10 += `<g data-node="${e18.path}" data-cmd="${n11}" class="${u11}${p11}">${v10(a11, s11, o11, i11, f11)}` + (n11 === `?` ? `` : b10(a11, s11, xO(t10.pg, n11))) + x10(a11 + d10 * 1.1, s11, n11 === `?` ? `?` : bO(t10.pg, n11), n11 === `?` ? `#ea580c` : `#fff`, o11 - d10 * 1.1 - (l11 ? Math.max(90, d10 * 2) : 10)) + `${y10(a11, s11, o11)}<title>${n11 === `?` ? `L\xFCcke` : bO(t10.pg, n11)}</title></g>`;
    }
    l11 && f10 && (_10 = v_e(e18.path, a11 + o11 - d10 * 0.55, s11 + d10 / 2, d10 * 0.42, { x: a11 + o11 - Math.max(90, d10 * 2), y: s11 - 2, w: Math.max(90, d10 * 2) + 6, h: d10 + 4 }));
  }), f10 && t10.sel !== null) {
    let e18 = l10.findIndex((e19) => e19.path === t10.sel && (e19.kind === `cmd` || e19.kind === `top`));
    if (e18 >= 0) {
      let t11 = l10[e18], r11 = n10 + t11.depth * 26, a11 = m10[e18].y + m10[e18].h + 2;
      if (t11.kind === `top`) {
        let n11 = l10.findIndex((n12, r12) => r12 > e18 && n12.kind === `end` && n12.path === t11.path);
        r11 += 26, a11 = m10[n11].y - 2;
      }
      g10 += `<path d="M${r11} ${a11.toFixed(1)}H${r11 + Math.min(130, i10 - (r11 - n10))}" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>`;
    }
  }
  return g10 + _10;
}
function T_e(e17, t10, n10) {
  let r10 = n10.phase === `run` || n10.phase === `won`, i10 = t10 && !r10, a10 = 1128, o10 = `<rect x="904" y="204" width="448" height="404" rx="44" fill="#fef3c7" stroke="#f59e0b" stroke-width="3"/>`, s10 = (e18, t11, n11) => `<g${i10 ? ` class="lh-key" data-a="add:${e18}"` : ``}><rect x="${t11}" y="${n11}" width="124" height="112" rx="26" fill="${JO}" stroke="${YO}" stroke-width="3"/><g transform="translate(${t11 + 62} ${n11 + 56}) scale(1.25)">${ID[e18]}</g>${i10 ? `<rect class="lh-kdown" x="${t11}" y="${n11}" width="124" height="112" rx="26" fill="#000" opacity="0"/>` : ``}<title>${yO[e18]}</title></g>`;
  if (o10 += s10(`F`, 1066, 214) + s10(`L`, 918, 344) + s10(`R`, 1214, 344) + s10(`B`, 1066, 474), e17.pad === `now`) o10 += `<g${i10 ? ` class="lh-key" data-a="home"` : ``}><circle cx="${a10}" cy="400" r="58" fill="#ffffff" stroke="#f59e0b" stroke-width="4"/><g transform="translate(${a10} 400) scale(${($O(5) / 100 * 0.62).toFixed(3)})">${MD[e17.costume]}</g>${i10 ? `<circle class="lh-kdown" cx="${a10}" cy="400" r="58" fill="#000" opacity="0"/>` : ``}<title>Zur\xFCck zum Start</title></g>`, o10 += rk(t10, i10 ? `home` : null, 904, 626, 448, 70, `#ffffff`, `Zur\xFCck zum Start`, { color: `#334155`, stroke: `#94a3b8`, icon: p_e, size: 22 });
  else {
    let r11 = t10 && n10.phase !== `won`;
    o10 += `<g${r11 ? ` class="lh-key" data-a="go"` : ``}><circle cx="${a10}" cy="400" r="58" fill="${n10.phase === `run` ? `#dc2626` : `#16a34a`}" stroke="#14532d" stroke-width="3"/><text x="${a10}" y="${n10.phase === `run` ? 410 : 412}" text-anchor="middle" font-family="${qO}" font-size="${n10.phase === `run` ? 26 : 34}" font-weight="700" fill="#fff">${n10.phase === `run` ? `STOPP` : `LOS`}</text>${r11 ? `<circle class="lh-kdown" cx="${a10}" cy="400" r="58" fill="#000" opacity="0"/>` : ``}<title>${n10.phase === `run` ? `Anhalten` : `Los!`}</title></g>`;
    let s11 = xO(e17, `P`).replace(/fill="#fff"/g, ``).replace(/stroke="#fff"/g, ``);
    o10 += rk(t10, i10 ? `add:P` : null, 904, 626, 214, 70, XO, $ge(e17, `P`) === `spielen` ? `Spielen` : `Pause`, { stroke: ZO, icon: s11, size: 24 }), o10 += rk(t10, i10 ? `clear` : null, 1138, 626, 214, 70, `#ffffff`, `L\xF6schen`, { color: `#b91c1c`, stroke: `#f87171`, icon: `<path d="M-9 -9L9 9M9 -9L-9 9" fill="none" stroke-width="4" stroke-linecap="round"/>`, size: 24 }), !e17.memory && e17.peek && (o10 += rk(t10, i10 ? `peek` : null, 1284, 708, 68, 46, `#fff7ed`, ``, { color: `#c2410c`, stroke: `#fdba74`, icon: sk, size: 32, rx: 23, title: `Weg zeigen` })), e17.memory && (o10 += `<text x="906" y="728" font-family="${qO}" font-size="17" font-weight="700" fill="#64748b">SPEICHER${n10.prog.length ? ` \xB7 ${n10.prog.length}` : ``}</text>`, e17.peek && (o10 += rk(t10, i10 ? `peek` : null, 1292, 700, 60, 38, `#fff7ed`, ``, { color: `#c2410c`, stroke: `#fdba74`, icon: sk, size: 28, rx: 19, title: `Weg zeigen` })), o10 += __e(false, n10, 906, 740, 444, 72, true));
  }
  return o10;
}
function E_e(e17) {
  let t10 = (t11) => ({ a: t11, label: $ge(e17, t11), word: bO(e17, t11), fill: t11 === `P` ? XO : t11 === `D` || t11 === `U` ? dk : JO, stroke: t11 === `P` ? ZO : t11 === `D` || t11 === `U` ? fk : YO, icon: xO(e17, t11) }), n10 = { a: `W`, label: `wiederhole`, word: `wiederhole`, fill: XO, stroke: ZO, icon: uk }, r10 = { a: `Z`, label: `bis Ziel`, word: `wiederhole bis zum Ziel`, fill: XO, stroke: ZO, icon: uk }, i10 = { a: `I`, label: `falls`, word: `falls \u2026 dann`, fill: XO, stroke: ZO, icon: `<path d="M-14 -4L0 -18L14 -4L0 10Z" fill="none" stroke="#fff" stroke-width="4.5" stroke-linejoin="round"/><path d="M0 10V22" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>` }, a10 = [`F`, `B`, `L`, `R`].map(t10), o10 = [`F`, `L`, `R`].map(t10);
  return e17.lesson === `cond` ? [...o10, r10, i10] : e17.lesson === `count` ? [...o10, r10, i10, { a: `V`, label: `Punkte + 1`, word: `Punkte + 1`, fill: S_e, stroke: C_e, icon: ID.V }] : e17.lesson === `pen` ? [...a10, n10, t10(`D`), t10(`U`), { a: `K`, label: `Farbe`, word: `Farbe`, fill: dk, stroke: fk, icon: nge }] : e17.lesson === `loop` || e17.lesson === `events` ? [...a10, n10] : e17.lesson === `goal` || e17.lesson === `collect` || e17.lesson === `read` ? a10 : [...a10, t10(`P`)];
}
function D_e(e17, t10, n10) {
  let r10 = n10.t, i10 = r10.kind === `predict`, a10 = r10.kind === `fix` || r10.kind === `gap`, o10 = r10.kind === `events`, s10 = hge(e17.lesson), c10 = o10 && n10.play, l10 = t10 && (n10.phase === `idle` || n10.phase === `step`) && !c10, u10 = ``;
  if (i10) u10 += `<rect x="${GO}" y="206" width="${KO}" height="112" rx="16" fill="#fff7ed" stroke="#fdba74" stroke-width="2.5"/>`, ck(`Was macht das Programm? Tippe auf das Feld, wo ${AD(e17.costume).nom} ankommt \u2013 dann auf \u201EPr\xFCfen\u201C.`, 34).slice(0, 3).forEach((e18, t11) => u10 += `<text x="918" y="${240 + t11 * 29}" font-family="${qO}" font-size="19" font-weight="700" fill="#9a3412">${QO(e18)}</text>`);
  else if (c10) u10 += rk(t10, t10 && n10.phase === `idle` ? `edit` : null, GO, 206, KO, 112, `#fffbeb`, `Programm \xE4ndern`, { color: `#92400e`, stroke: `#fbbf24`, icon: `<path d="M-12 10L6 -8L12 -2L-6 16H-12Z" fill="none" stroke-width="3" stroke-linejoin="round"/><path d="M8 -10L12 -14L18 -8L14 -4" fill="none" stroke-width="3" stroke-linejoin="round"/>`, size: 24 });
  else {
    let t11 = E_e(e17), n11 = t11.length > 5, r11 = n11 ? Math.ceil(t11.length / 2) : t11.length, i11 = n11 ? (KO - (r11 - 1) * 8) / r11 : t11.length === 5 ? 84 : 100, o11 = n11 ? 52 : 112, s11 = (KO - r11 * i11) / Math.max(1, r11 - 1);
    t11.forEach((e18, t12) => {
      let c11 = GO + t12 % r11 * (i11 + s11), d11 = 206 + Math.floor(t12 / r11) * (o11 + 8), f11 = a10 ? `` : ` data-drag="new:${e18.a}"`;
      if (u10 += `<g${l10 ? ` class="lh-key" data-a="add:${e18.a}"${f11}` : ``}><rect x="${c11.toFixed(1)}" y="${d11}" width="${i11.toFixed(1)}" height="${o11}" rx="${n11 ? 12 : 16}" fill="${e18.fill}" stroke="${e18.stroke}" stroke-width="3"/>`, n11) {
        let t13 = i11 - 44, n12 = e18.label.length * 14 * 0.62;
        u10 += `<g transform="translate(${(c11 + 20).toFixed(1)} ${d11 + o11 / 2}) scale(.55)">${e18.icon}</g><text x="${(c11 + 38).toFixed(1)}" y="${d11 + o11 / 2 + 5}" font-family="${qO}" font-size="14" font-weight="700" fill="#fff"${n12 > t13 ? ` textLength="${t13.toFixed(1)}" lengthAdjust="spacingAndGlyphs"` : ``}>${QO(e18.label)}</text>`;
      } else u10 += `<g transform="translate(${(c11 + i11 / 2).toFixed(1)} ${d11 + 44}) scale(.95)">${e18.icon}</g><text x="${(c11 + i11 / 2).toFixed(1)}" y="${d11 + 100}" text-anchor="middle" font-family="${qO}" font-size="${e18.label.length > 9 ? 12.5 : i11 < 90 ? 14 : 16}" font-weight="700" fill="#fff">${QO(e18.label)}</text>`;
      u10 += `${l10 ? `<rect class="lh-kdown" x="${c11.toFixed(1)}" y="${d11}" width="${i11.toFixed(1)}" height="${o11}" rx="12" fill="#000" opacity="0"/>` : ``}<title>${QO(e18.word)}</title></g>`;
    });
  }
  let d10 = l10 && n10.sel !== null && !a10 ? ` class="lh-key" data-a="unsel"` : ``;
  u10 += `<rect${d10} x="${GO}" y="336" width="${KO}" height="356" rx="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2.5"${n10.prog.length ? `` : ` stroke-dasharray="10 8"`}/>`, u10 += `<text x="916" y="366" font-family="${qO}" font-size="18" font-weight="700" fill="#64748b">PROGRAMM</text>`;
  let f10 = e17.peek && !i10 && !o10 && n10.phase !== `won`, p10 = GD(n10.prog), m10 = !!r10.limit, h10 = m10 && r10.limit ? `${p10} von h\xF6chstens ${r10.limit}` : s10 ? `${p10} ${p10 === 1 ? `Baustein` : `Bausteine`}` : `${p10} ${p10 === 1 ? `Karte` : `Karten`}`;
  if ((n10.prog.length && !o10 || m10 && r10.limit || o10 && p10) && (u10 += `<text x="${f10 ? 1272 : 1340}" y="366" text-anchor="end" font-family="${qO}" font-size="18" fill="${m10 && r10.limit && p10 >= r10.limit ? `#c2410c` : `#64748b`}">${h10}</text>`), f10 && (u10 += rk(t10, l10 ? `peek` : null, 1286, 342, 60, 38, `#fff7ed`, ``, { color: `#c2410c`, stroke: `#fdba74`, icon: sk, size: 28, rx: 19, title: `Weg zeigen` })), n10.prog.length || (u10 += `<text x="1128" y="532" text-anchor="middle" font-family="${qO}" font-size="21" fill="#94a3b8">Tippe oben auf die Bausteine.</text>`), o10) for (let e18 = 0; e18 < 2; e18++) u10 += w_e(t10, n10, 914 + e18 * 220, 384, 208, 298, n10.prog.slice(e18 * 2, e18 * 2 + 2), e18 * 2, !c10);
  else u10 += s10 ? w_e(t10, n10, 914, 384, 428, 298) : __e(t10, n10, 914, 380, 428, 302, false, i10 ? `read` : a10 ? `swap` : `edit`);
  if (n10.phase === `won`) return u10;
  let g10 = n10.phase === `run`;
  if (c10) return [`left`, `up`, `down`, `right`].forEach((e18, n11) => {
    let r11 = GO + n11 * 117;
    u10 += `<g${t10 ? ` class="lh-key" data-a="ev:${e18}"` : ``}><rect class="lh-pg-face" x="${r11.toFixed(1)}" y="790" width="${105 .toFixed(1)}" height="160" rx="22" fill="#334155" stroke="#0f172a" stroke-width="3"/><g transform="translate(${(r11 + 105 / 2).toFixed(1)} 870) scale(1.5)">${ige(cge[e18])}</g>${t10 ? `<rect class="lh-kdown" x="${r11.toFixed(1)}" y="790" width="${105 .toFixed(1)}" height="160" rx="22" fill="#000" opacity="0"/>` : ``}<title>${WD[e18]}</title></g>`;
  }), u10;
  if (i10) return u10 += rk(t10, t10 ? `go` : null, GO, 790, 280, 82, g10 ? `#dc2626` : `#16a34a`, g10 ? `Stopp` : `Pr\xFCfen`, { icon: g10 ? c_e : ik, size: 30, title: g10 ? `Anhalten` : `Pr\xFCfen: das Programm l\xE4uft` }), u10 += rk(t10, t10 ? `readprog` : null, 1192, 790, 164, 82, `#ffffff`, `Vorlesen`, { color: `#334155`, stroke: `#94a3b8`, icon: ak, size: 21, title: `Programm vorlesen` }), u10;
  o10 ? u10 += rk(t10, t10 ? `go` : null, GO, 790, 280, 82, `#16a34a`, `Spielen`, { icon: ik, size: 30, title: `Spielen: die Pfeile steuern` }) : (u10 += rk(t10, t10 ? `go` : null, GO, 790, 280, 82, g10 ? `#dc2626` : `#16a34a`, g10 ? `Stopp` : `LOS`, { icon: g10 ? c_e : ik, size: 32, title: g10 ? `Anhalten` : `Los!` }), u10 += rk(t10, t10 && !g10 ? `step` : null, 1192, 790, 164, 82, `#eef2ff`, `Schritt`, { color: `#3730a3`, stroke: `#818cf8`, icon: l_e, size: 23, title: `Ein Baustein nach dem anderen` }));
  let _10 = t10 && !g10;
  return a10 || (u10 += rk(t10, _10 ? `back` : null, GO, 884, 144, 66, `#ffffff`, `Zur\xFCck`, { color: `#334155`, stroke: `#94a3b8`, icon: u_e, size: 19, title: `Letzten Baustein weg` }), u10 += rk(t10, _10 ? `clear` : null, 1056, 884, 144, 66, `#ffffff`, `Alle weg`, { color: `#b91c1c`, stroke: `#f87171`, icon: d_e, size: 19, title: `Alle Bausteine weg` })), u10 += rk(t10, t10 ? `readprog` : null, 1212, 884, 144, 66, `#ffffff`, `Vorlesen`, { color: `#334155`, stroke: `#94a3b8`, icon: ak, size: 19, title: `Programm vorlesen` }), u10;
}
function O_e(e17, t10) {
  let n10 = t10.stats.filter((e18) => e18.end), r10 = n10.length, i10 = n10.reduce((e18, t11) => e18 + (t11.end - t11.start), 0), a10 = n10.filter((e18) => e18.tries <= 1).length, o10 = n10.reduce((e18, t11) => e18 + t11.tries, 0), s10 = `<rect width="${HO}" height="${UO}" fill="${FD(e17.mat).page}"/>`;
  s10 += `<rect x="60" y="40" width="1280" height="910" rx="32" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>`, s10 += `<g transform="translate(300 330) scale(3.1)"><g class="lh-pg-body is-happy">${MD[e17.costume]}</g></g>`, s10 += `<g transform="translate(300 650) scale(1.6)">${e17.lesson === `collect` || e17.lesson === `pen` || e17.lesson === `music` ? ND : Zhe[e17.costume]}</g>`, s10 += `<text x="840" y="140" text-anchor="middle" font-family="${qO}" font-size="56" font-weight="700" fill="#1e293b">Super programmiert!</text>`, s10 += `<text x="840" y="190" text-anchor="middle" font-family="${qO}" font-size="26" fill="#475569">${r10 === 1 ? `Eine Aufgabe` : `${r10} Aufgaben`} geschafft</text>`;
  let c10 = (e18) => {
    let t11 = Math.max(0, Math.round(e18 / 1e3));
    return t11 < 60 ? `${t11} Sek.` : `${Math.floor(t11 / 60)}:${String(t11 % 60).padStart(2, `0`)} Min.`;
  }, l10 = [[`#2563eb`, `Zeit`, c10(i10)], [`#16a34a`, `Beim ersten Versuch`, `${a10} von ${r10}`], [`#d97706`, `Programme gestartet`, String(o10)]];
  e17.peek && l10.push([`#ea580c`, `Weg gezeigt`, `${n10.reduce((e18, t11) => e18 + (t11.peeks ?? 0), 0)} Mal`]), e17.rate && qD(e17.lesson) && l10.push([`#ca8a04`, `Sterne`, `${n10.reduce((e18, t11) => e18 + (t11.stars ?? 0), 0)} von ${r10 * 3}`]);
  let u10 = l10.length > 3 ? 54 : 62;
  l10.forEach(([e18, t11, n11], r11) => {
    let i11 = 236 + r11 * u10;
    s10 += `<rect x="560" y="${i11}" width="560" height="50" rx="14" fill="${e18}" opacity=".09"/><circle cx="590" cy="${i11 + 25}" r="10" fill="${e18}"/>`, s10 += `<text x="616" y="${i11 + 34}" font-family="${qO}" font-size="25" fill="#334155">${t11}</text><text x="1096" y="${i11 + 34}" text-anchor="end" font-family="${qO}" font-size="27" font-weight="700" fill="#1e293b">${n11}</text>`;
  });
  let d10 = 236 + l10.length * u10 + 38, f10 = Math.min(42, (818 - d10) / Math.max(1, r10)), p10 = d10;
  return s10 += `<text x="600" y="${p10}" font-family="${qO}" font-size="18" font-weight="700" fill="#94a3b8">AUFGABE</text><text x="880" y="${p10}" text-anchor="end" font-family="${qO}" font-size="18" font-weight="700" fill="#94a3b8">ZEIT</text><text x="1080" y="${p10}" text-anchor="end" font-family="${qO}" font-size="18" font-weight="700" fill="#94a3b8">VERSUCHE</text>`, s10 += `<path d="M580 ${p10 + 12}H1100" stroke="#e2e8f0" stroke-width="2"/>`, n10.forEach((e18, t11) => {
    p10 = d10 + 14 + (t11 + 1) * f10 - 8;
    let n11 = f10 < 34 ? 19 : 23;
    s10 += `<text x="600" y="${p10}" font-family="${qO}" font-size="${n11}" fill="#334155">${t11 + 1}</text><text x="880" y="${p10}" text-anchor="end" font-family="${qO}" font-size="${n11}" fill="#334155">${c10(e18.end - e18.start)}</text>`, s10 += e18.tries <= 1 ? `<path d="M1056 ${p10 - 9}l8 8 16-17" fill="none" stroke="#16a34a" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>` : `<text x="1080" y="${p10}" text-anchor="end" font-family="${qO}" font-size="${n11}" font-weight="700" fill="#d97706">${e18.tries}</text>`;
  }), s10 += rk(true, `again`, 640, 840, 400, 80, `#2563eb`, `Nochmal`, { icon: ok, size: 30, title: `Neue Aufgaben` }), s10;
}
function k_e(e17, t10, n10, r10 = HO, i10 = UO) {
  let a10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${HO} ${UO}" width="${r10}" height="${i10}">`;
  if (n10 && t10?.phase === `summary`) return a10 + O_e(e17, t10) + `</svg>`;
  let o10 = RO(e17, t10), s10 = t10?.at ?? PO(o10), c10 = { t: o10, at: s10, ang: s10.d * 90, got: t10 ? t10.phase === `run` || t10.phase === `step` ? t10.gotRun : t10.got : 0, stars: t10?.starsRun ?? [], trace: t10?.trace ?? [], prog: t10?.prog ?? FO(o10), done: t10?.done ?? 0, sel: t10?.sel ?? null, bad: t10?.bad ?? null, phase: t10?.phase ?? `idle`, msg: t10?.msg ?? null, happy: !!t10?.happy, mark: t10?.mark ?? null, rating: t10?.rating ?? 0, ink: t10?.ink ?? [], penDown: !!t10?.penDown, penCol: t10?.penCol ?? 0, play: !!t10?.play, pg: e17, tick: t10?.tick ?? 0, points: t10?.points ?? 0 }, l10 = `<rect width="${HO}" height="${UO}" fill="${FD(e17.mat).page}"/>`, u10 = e17.mat === `space`;
  l10 += rk(n10, n10 ? `say` : null, 40, 30, 68, 68, `#ffffff`, ``, { color: `#2563eb`, stroke: `#93c5fd`, icon: ak, size: 34, rx: 34, title: `Aufgabe vorlesen` }), l10 += `<text x="124" y="66" font-family="${qO}" font-size="${SO(e17, o10).length > 46 ? 30 : 34}" font-weight="700" fill="${u10 ? `#f8fafc` : `#1e293b`}">${QO(SO(e17, o10))}</text>`, l10 += g_e(e17, c10, 116).replace(/fill="#475569"/g, u10 ? `fill="#c7d2fe"` : `fill="#475569"`), l10 += h_e(e17, c10, n10);
  let d10 = LO(e17, t10);
  if (d10.length > 1 && (l10 += `<text x="${GO}" y="180" font-family="${qO}" font-size="22" font-weight="700" fill="${u10 ? `#e0e7ff` : `#475569`}">Aufgabe ${(t10?.i ?? 0) + 1} von ${d10.length}</text>`), l10 += rk(n10, n10 ? `reset` : null, 1180, 144, 176, 50, `#ffffff`, `Neu starten`, { color: `#334155`, stroke: `#94a3b8`, icon: ok, size: 18, title: `Diese Aufgabe neu starten` }), e17.input === `pad` && !KD(e17.lesson)) {
    l10 += T_e(e17, n10, c10);
    let r11 = e17.pad === `store` && e17.memory ? 826 : e17.pad === `store` && e17.peek ? 768 : 712;
    c10.phase === `won` ? l10 += A_e(e17, n10, t10, d10.length, c10.msg) : l10 += lk(c10.msg, e17.lesson === `goal` ? e17.pad === `now` ? `Jeder Pfeil bewegt sofort.` : `Erst alle Pfeile, dann LOS.` : TO(e17), GO, r11, KO, 950 - r11, 21);
  } else l10 += D_e(e17, n10, c10), c10.phase === `won` ? (l10 += lk(c10.msg, ``, GO, 704, KO, 150, c10.rating ? 20 : 22, c10.rating), l10 += j_e(n10, t10, d10.length, GO, 868, KO, 82)) : l10 += lk(c10.msg, e17.lesson === `goal` ? `Tipp: Ziehe Karten an eine andere Stelle \u2013 oder aus dem Programm hinaus.` : e17.lesson === `loop` ? `Tipp: Ziehe Bausteine in \u201Ewiederhole\u201C hinein \u2013 oder aus dem Programm hinaus.` : TO(e17, o10), GO, 704, KO, 74, 19);
  return a10 + l10 + `</svg>`;
}
function A_e(e17, t10, n10, r10, i10) {
  let a10 = `<rect x="${GO}" y="204" width="${KO}" height="404" rx="40" fill="#f0fdf4" stroke="#22c55e" stroke-width="4"/>`;
  return a10 += `<g transform="translate(1128 286) scale(1.15)"><g class="lh-pg-body is-happy">${MD[e17.costume]}</g></g>`, ck(i10?.t ?? ``, 28).slice(0, 3).forEach((e18, t11) => a10 += `<text x="1128" y="${398 + t11 * 34}" text-anchor="middle" font-family="${qO}" font-size="25" font-weight="700" fill="#166534">${QO(e18)}</text>`), a10 + j_e(t10, n10, r10, 926, 514, 404, 74);
}
function j_e(e17, t10, n10, r10, i10, a10, o10) {
  let s10 = !t10 || t10.i + 1 >= n10;
  return rk(e17, e17 ? `next` : null, r10, i10, a10, o10, s10 ? `#16a34a` : `#2563eb`, s10 ? n10 > 1 ? `Auswertung` : `Nochmal` : `N\xE4chste Aufgabe`, { icon: s10 && n10 <= 1 ? ok : f_e, size: 28 });
}
var pk = (e17) => [...document.querySelectorAll(`.lh-wg-code.is-live`)].filter((t10) => t10.dataset.pgId === e17);
function mk(e17) {
  for (let t10 of pk(e17)) {
    let n10 = NO.get(e17);
    n10 && (delete t10.dataset.k, dve(t10, n10, true));
  }
}
function hk(e17) {
  zO(e17).ver++, mk(e17);
}
function gk(e17, t10) {
  e17.voice && M(vO(t10));
}
function _k(e17, t10 = 70, n10 = 0.1) {
  let r10 = zr();
  if (!r10) return;
  let i10 = r10.currentTime, a10 = r10.createOscillator(), o10 = r10.createGain();
  a10.type = `sine`, a10.frequency.value = e17, o10.gain.setValueAtTime(1e-4, i10), o10.gain.exponentialRampToValueAtTime(n10, i10 + 0.012), o10.gain.exponentialRampToValueAtTime(1e-4, i10 + t10 / 1e3), a10.connect(o10).connect(r10.destination), a10.start(i10), a10.stop(i10 + t10 / 1e3 + 0.03);
}
var vk = (e17) => e17.speed === 1 ? 760 : e17.speed === 3 ? 300 : 500;
var yk = (e17) => new Promise((t10) => setTimeout(t10, e17));
function bk(e17, t10, n10, r10, i10, a10, o10 = false) {
  return new Promise((s10) => {
    let c10 = performance.now(), l10 = (u10) => {
      let d10 = Math.min(1, (u10 - c10) / a10), f10 = d10 < 0.5 ? 2 * d10 * d10 : 1 - (-2 * d10 + 2) ** 2 / 2, p10 = o10 ? 0.32 * Math.sin(Math.PI * d10) : f10, m10 = n10.x + (r10.x - n10.x) * p10, h10 = n10.y + (r10.y - n10.y) * p10, g10 = o10 ? i10 + Math.sin(d10 * Math.PI * 6) * 8 * (1 - d10) : i10 + (r10.ang - i10) * f10;
      for (let n11 of pk(e17)) n11.querySelector(`.lh-pg-bot`)?.setAttribute(`transform`, tk(t10, m10, h10, g10));
      d10 < 1 ? requestAnimationFrame(l10) : s10();
    };
    requestAnimationFrame(l10);
  });
}
function M_e(e17, t10, n10) {
  let r10 = n10.map(([e18, n11]) => ek(t10, e18, n11).map((e19) => e19.toFixed(1)).join(`,`)).join(` `);
  for (let t11 of pk(e17)) t11.querySelector(`.lh-pg-trace`)?.setAttribute(`points`, r10);
}
function xk(e17, t10, n10, r10) {
  for (let i10 of pk(e17)) i10.querySelectorAll(t10).forEach((e18) => e18.classList.toggle(n10, r10));
}
var N_e = (e17, t10, n10) => [...e17.stops, ...e17.extra].find((e18) => e18.x === t10 && e18.y === n10)?.t ?? null;
var Sk = (e17, t10, n10) => !!e17.path?.length && !e17.path.some(([e18, r10]) => e18 === t10 && r10 === n10);
var Ck = (e17, t10, n10) => e17.walls.some(([e18, r10]) => e18 === t10 && r10 === n10) || Sk(e17, t10, n10);
var wk = (e17, t10) => !!e17.goal && e17.goal[0] === t10.x && e17.goal[1] === t10.y;
function Tk(e17, t10) {
  if (t10 === `L`) return { ...e17, d: (e17.d + 3) % 4 };
  if (t10 === `R`) return { ...e17, d: (e17.d + 1) % 4 };
  if (t10 === `P`) return e17;
  let n10 = t10 === `F` ? 1 : -1;
  return { x: e17.x + n10 * eO[e17.d], y: e17.y + n10 * tO[e17.d], d: e17.d };
}
var Ek = (e17) => MO.get(e17.id) === e17.r && e17.r.token === e17.token;
async function P_e(e17, t10) {
  let { r: n10, t: r10, pg: i10 } = e17, a10 = n10.steps[t10];
  if (a10.cmd === `D` || a10.cmd === `U` || a10.cmd === `K`) return a10.cmd === `K` ? n10.penCol = a10.col ?? 0 : n10.penDown = a10.cmd === `D`, V_e(e17.id, n10), xk(e17.id, `[data-node="${a10.path}"]`, `is-run`, true), _k(a10.cmd === `U` ? 500 : 760, 60, 0.06), await yk(vk(i10) * 0.45), xk(e17.id, `[data-node="${a10.path}"]`, `is-run`, false), Ek(e17);
  for (let t11 of a10.loops) for (let n11 of pk(e17.id)) n11.querySelectorAll(`[data-loopk="${t11.path}"]`).forEach((e18) => e18.textContent = t11.n ? `${t11.k}/${t11.n}` : `${t11.k}`);
  if (a10.cmd === `V`) {
    n10.points++;
    for (let t11 of pk(e17.id)) t11.querySelectorAll(`.lh-pg-points`).forEach((e18) => e18.textContent = String(n10.points));
    return xk(e17.id, `[data-node="${a10.path}"]`, `is-run`, true), _k(880, 70, 0.07), setTimeout(() => _k(1175, 90, 0.07), 80), await yk(vk(i10) * (t10 >= 40 ? 0.2 : 0.5)), xk(e17.id, `[data-node="${a10.path}"]`, `is-run`, false), Ek(e17);
  }
  let o10 = a10.cmd, s10 = r10.n, c10 = n10.at, l10 = Tk(c10, o10), u10 = vk(i10) * (t10 >= 40 ? 0.3 : 1), d10 = `[data-node="${a10.path}"]`;
  xk(e17.id, d10, `is-run`, true);
  let f10 = pO(r10, n10.tick), p10 = pO(r10, n10.tick + 1);
  f10 && p10 && U_e(e17.id, s10, f10, p10, o10 === `P` ? u10 * 1.2 : u10);
  let m10 = () => (n10.tick++, !mO(f10, p10, c10, n10.at) || (Dk(e17, `Die Katze hat dich erwischt! Mit \u201Ewarte\u201C l\xE4sst du sie vorbeilaufen.`, a10.path), false));
  try {
    if (o10 === `L` || o10 === `R`) return _k(o10 === `L` ? 520 : 600, 60), await bk(e17.id, s10, c10, { x: c10.x, y: c10.y, ang: c10.d * 90 + (o10 === `L` ? -90 : 90) }, c10.d * 90, u10 * 0.8), n10.at = l10, Ek(e17) && m10();
    if (o10 === `P`) return _k(440, 90, 0.07), await yk(u10 * 1.2), Ek(e17) ? m10() && I_e(e17, t10, true) : false;
    let d11 = l10.x < 0 || l10.y < 0 || l10.x >= s10 || l10.y >= s10;
    if (d11 || Ck(r10, l10.x, l10.y)) return await bk(e17.id, s10, c10, { x: l10.x, y: l10.y, ang: c10.d * 90 }, c10.d * 90, u10 * 1.1, true), Ek(e17) && Dk(e17, d11 ? `Hier ist der Rand \u2013 da geht es nicht weiter.` : Sk(r10, l10.x, l10.y) ? `Da geht der Weg nicht weiter \u2013 bleib auf den hellen Platten.` : `Au! Da ist ${FD(i10.mat).wall} im Weg.`, a10.path), false;
    _k(660, 55);
    let f11 = n10.penDown ? [c10.x, c10.y, l10.x, l10.y, n10.penCol] : null;
    return f11 && H_e(e17.id, s10, f11, u10), await bk(e17.id, s10, c10, { x: l10.x, y: l10.y, ang: c10.d * 90 }, c10.d * 90, u10), !Ek(e17) || (n10.at = l10, f11 && n10.ink.push(f11), n10.trace.push([l10.x, l10.y]), M_e(e17.id, s10, n10.trace), !m10()) ? false : (i10.lesson !== `count` && r10.stars.forEach(([t11, r11], i11) => {
      t11 === l10.x && r11 === l10.y && !n10.starsRun.includes(i11) && (n10.starsRun.push(i11), xk(e17.id, `[data-star="${i11}"]`, `is-got`, true), _k(988, 90, 0.08), setTimeout(() => _k(1319, 110, 0.08), 90));
    }), true);
  } finally {
    xk(e17.id, d10, `is-run`, false);
  }
}
var F_e = (e17) => e17 === `goal` || e17 === `collect` || e17 === `loop` || e17 === `read` || e17 === `cond` || e17 === `cat` || e17 === `count`;
function I_e(e17, t10, n10) {
  let { r: r10, t: i10, pg: a10 } = e17;
  if (F_e(a10.lesson)) return true;
  let o10 = i10.stops[r10.gotRun];
  if (!o10) return true;
  let s10 = N_e(i10, r10.at.x, r10.at.y), c10 = r10.steps[t10]?.path ?? null;
  if (a10.lesson === `music` && s10 && kk(s10), o10.x === r10.at.x && o10.y === r10.at.y) return r10.gotRun++, a10.lesson !== `music` && (_k(784, 90, 0.08), setTimeout(() => _k(1047, 120, 0.08), 100)), xk(e17.id, `[data-cell="${o10.x},${o10.y}"]`, `is-got`, true), true;
  if (n10 && s10 === null) return true;
  let l10 = a10.lesson === `math` ? `Rechne noch einmal: ${i10.sums?.[r10.gotRun] ?? ``}.` : `Du brauchst ${CO(a10, o10.t)}.`;
  return s10 === null ? Dk(e17, a10.lesson === `word` ? `Hier ist kein Buchstabe. Fahre ${wO(a10, o10.t)}.` : a10.lesson === `music` ? `Hier ist kein Ton. Fahre ${wO(a10, o10.t)}.` : a10.lesson === `math` ? `Hier ist keine Zahl. ${l10}` : `Hier ist keine Zahl. Fahre ${wO(a10, o10.t)}.`, c10) : Dk(e17, `Hier ist ${CO(a10, s10)}. ${l10}`, c10), false;
}
function Dk(e17, t10, n10) {
  let { r: r10, id: i10, pg: a10, t: o10 } = e17;
  r10.phase = `idle`, r10.pc = 0, r10.bad = n10, r10.msg = { t: t10, k: `bad` }, r10.gotRun = r10.got, o10.kind !== `events` && (r10.starsRun = []), yi(), gk(a10, t10), hk(i10);
  let s10 = r10.token;
  setTimeout(() => {
    MO.get(i10) === r10 && r10.token === s10 && r10.phase === `idle` && (r10.at = r10.origin, r10.tick = 0, o10.kind === `predict` && (r10.trace = []), hk(i10));
  }, 1500);
}
function L_e(e17, t10, n10) {
  if (!e17.rate || !qD(e17.lesson)) return { stars: 0, best: 0 };
  let r10 = GD(n10.prog), i10 = t10.best ?? 0;
  return !i10 && t10.goal && (i10 = aO(iO(t10.n, new Set(t10.walls.map(([e18, n11]) => n11 * t10.n + e18)), PO(t10)), t10.n, t10.goal[0], t10.goal[1])?.len ?? r10), i10 = Math.min(i10 || r10, r10), { stars: r10 <= i10 ? 3 : r10 <= i10 + 2 ? 2 : 1, best: i10 };
}
function Ok(e17, t10) {
  let { r: n10, id: r10, pg: i10, t: a10 } = e17, { stars: o10, best: s10 } = L_e(i10, a10, n10), c10 = o10 ? o10 === 3 ? ` K\xFCrzer geht es nicht!` : ` Es geht noch k\xFCrzer \u2013 mit ${s10} ${s10 === 1 ? `Baustein` : `Bausteinen`}.` : ``;
  n10.phase = `won`, n10.msg = { t: t10 + c10, k: `win` }, n10.rating = o10, n10.happy = true, n10.sel = null, BO(n10).end = Date.now(), BO(n10).stars = o10, vi(), gk(i10, t10 + c10), hk(r10);
}
function R_e(e17) {
  let { r: t10, t: n10, pg: r10 } = e17, i10 = AD(r10.costume), a10 = _O(i10.nom);
  if (r10.lesson === `pen`) {
    if (!n10.lines?.length) return t10.phase = `idle`, t10.msg = t10.ink.length ? { t: `Fertig! Ein sch\xF6nes Bild.`, k: `ok` } : { t: `Es wurde nichts gemalt \u2013 nimm \u201EStift ab\u201C.`, k: `info` }, gk(r10, t10.msg.t), hk(e17.id);
    if (!t10.ink.length) return Dk(e17, `Es wurde nichts gezeichnet \u2013 nimm \u201EStift ab\u201C.`, null);
    let i11 = new Set(n10.lines.map(uO)), a11 = new Set(t10.ink.map((e18) => uO([e18[0], e18[1], e18[2], e18[3]]))), o11 = [...i11].filter((e18) => !a11.has(e18)).length, s11 = [...a11].filter((e18) => !i11.has(e18)).length;
    return !o11 && !s11 ? Ok(e17, `Super! Du hast ${n10.shape ?? `die Form`} gezeichnet.`) : Dk(e17, [s11 ? s11 === 1 ? `Eine Linie ist zu viel.` : `${s11} Linien sind zu viel.` : ``, o11 ? o11 === 1 ? `Es fehlt noch eine Linie.` : `Es fehlen noch ${o11} Linien.` : ``].filter(Boolean).join(` `), null);
  }
  if (n10.kind === `predict`) return t10.mark && t10.mark[0] === t10.at.x && t10.mark[1] === t10.at.y ? Ok(e17, `Richtig! ${a10} kommt genau dort an.`) : Dk(e17, `${a10} ist woanders angekommen. Lies das Programm noch einmal.`, null);
  if (r10.lesson === `count`) {
    let r11 = n10.stars.length;
    return wk(n10, t10.at) ? t10.points === r11 ? Ok(e17, `Super! ${r11} Sterne \u2013 ${r11} Punkte.`) : Dk(e17, t10.points ? `Du hast ${t10.points} ${t10.points === 1 ? `Punkt` : `Punkte`} \u2013 es sind aber ${r11} Sterne. Nimm \u201Efalls auf Stern: Punkte + 1\u201C.` : `Noch 0 Punkte. Nimm \u201Efalls auf Stern: Punkte + 1\u201C.`, null) : Dk(e17, `${a10} ist noch nicht ${i10.atGoal}.`, null);
  }
  if (F_e(r10.lesson)) {
    let r11 = n10.stars.length - t10.starsRun.length;
    return r11 > 0 ? Dk(e17, r11 === 1 ? `Es fehlt noch ein Stern.` : `Es fehlen noch ${r11} Sterne.`, null) : wk(n10, t10.at) ? Ok(e17, n10.stars.length ? `Super! Alle Sterne \u2013 und ${i10.nom} ist ${i10.atGoal}.` : `Super! ${a10} ist ${i10.atGoal}.`) : n10.stars.length ? Dk(e17, `Alle Sterne! Jetzt noch ${i10.toGoal}.`, null) : Dk(e17, n10.goal && t10.trace.some(([e18, t11]) => e18 === n10.goal[0] && t11 === n10.goal[1]) ? `${a10} ist ${i10.byGoal} vorbeigefahren \u2013 halte genau dort an.` : `${a10} ist noch nicht ${i10.atGoal}.`, null);
  }
  if (t10.steps[t10.steps.length - 1]?.cmd !== `P` && !I_e(e17, t10.steps.length - 1, false)) return;
  if (t10.gotRun === t10.got) return Dk(e17, `Fahre ${wO(r10, n10.stops[t10.got]?.t ?? ``)}.`, null);
  if (t10.got = t10.gotRun, t10.done = t10.prog.length, t10.origin = t10.at, t10.sel = null, t10.pc = 0, t10.got >= n10.stops.length) {
    let t11 = r10.lesson === `word` ? `Super! Du bist ${n10.word ?? ``} gefahren.` : r10.lesson === `music` ? `Super! Das war der Anfang von \u201E${n10.melody ?? ``}\u201C.` : r10.lesson === `math` ? `Super! Alle Aufgaben gel\xF6st.` : `Super! Alle Zahlen der Reihe nach.`;
    return r10.lesson === `music` && setTimeout(() => W_e(n10), 900), Ok(e17, t11);
  }
  let o10 = n10.stops[t10.got - 1], s10 = n10.stops[t10.got], c10 = s10.x === o10.x && s10.y === o10.y, l10 = r10.lesson === `math` ? `Richtig: ${n10.sums?.[t10.got - 1] ?? ``} = ${o10.t}! Jetzt rechne: ${n10.sums?.[t10.got] ?? ``}.` : r10.lesson === `music` && c10 ? `Richtig, ${CO(r10, o10.t)}! Jetzt noch einmal ${CO(r10, s10.t)} \u2013 nimm \u201Espielen\u201C.` : `Richtig, ${CO(r10, o10.t)}! Jetzt ${wO(r10, s10.t)}.`;
  t10.phase = `idle`, t10.msg = { t: l10, k: `ok` }, gk(r10, l10), hk(e17.id);
}
async function z_e(e17, t10) {
  let n10 = NO.get(e17), r10 = MO.get(e17);
  if (!n10 || !r10) return;
  let i10 = QD(n10.pg), a10 = RO(i10, r10);
  if (r10.phase === `won` || r10.phase === `summary`) return;
  if (r10.phase === `run`) return G_e(e17);
  if (r10.phase === `idle`) {
    let t11 = (t12) => {
      r10.msg = { t: t12, k: `info` }, gk(i10, t12), hk(e17);
    };
    if (a10.kind === `events`) return r10.play ? void 0 : r10.prog.some((e18) => BD(e18) && e18.body.length) ? (BO(r10).tries++, Object.assign(r10, { play: true, at: PO(a10), origin: PO(a10), trace: [[a10.start[0], a10.start[1]]], starsRun: [], sel: null, bad: null, msg: { t: `Steuere mit den Pfeilen unten!`, k: `info` } }), hk(e17)) : t11(`Lege zuerst Bausteine in die Pfeile \u2013 dann \u201ESpielen\u201C.`);
    if (a10.kind === `predict` && !r10.mark) return t11(`Tippe zuerst auf das Feld, wo ${AD(i10.costume).nom} ankommt.`);
    if (!r10.prog.slice(r10.done).length) return t11(i10.input === `pad` && !KD(i10.lesson) ? `Tippe zuerst die Pfeile \u2013 dann LOS.` : `Lege zuerst Bausteine ins Programm.`);
    if (i_e(r10.prog)) return t11(`F\xFClle zuerst die L\xFCcke: Tippe auf das ? und dann auf einen Baustein.`);
    BO(r10).tries++, Object.assign(r10, { steps: [], at: r10.origin, trace: [[r10.origin.x, r10.origin.y]], ink: [], penDown: false, penCol: 0, gotRun: r10.got, starsRun: [], bad: null, msg: null, pc: 0, tick: 0, points: 0 }), r10.env = { t: a10, pose: () => r10.at, count: 0, stuck: false }, r10.gen = OO(r10.prog, r10.env, r10.done);
  }
  r10.phase = t10 ? `step` : `run`, r10.sel = null;
  let o10 = { id: e17, pg: i10, t: a10, r: r10, token: ++r10.token };
  hk(e17), await yk(t10 ? 60 : 250);
  let s10 = () => {
    if (r10.pc < r10.steps.length) return true;
    let e18 = r10.gen?.next();
    return !e18 || e18.done ? false : (r10.steps.push(e18.value), true);
  };
  for (; Ek(o10) && s10(); ) {
    if (r10.steps.length > EO) return Dk(o10, `Nach ${EO} Schritten ist das Programm noch nicht fertig \u2013 f\xE4hrt die Figur im Kreis?`, null);
    let n11 = r10.pc;
    if (!await P_e(o10, n11) || !Ek(o10)) return;
    if (r10.pc = n11 + 1, t10) {
      if (s10()) return r10.phase = `step`, hk(e17);
      break;
    }
    await yk(r10.steps.length > 40 ? 20 : 70);
  }
  if (Ek(o10)) {
    if (r10.env?.stuck) return Dk(o10, `\u201Ewiederhole bis Ziel\u201C dreht sich im Kreis: In der Schleife bewegt sich die Figur nicht.`, null);
    Ek(o10) && R_e(o10);
  }
}
async function B_e(e17, t10) {
  let n10 = NO.get(e17), r10 = MO.get(e17);
  if (!n10 || !r10 || !r10.play || r10.phase !== `idle`) return;
  let i10 = QD(n10.pg), a10 = RO(i10, r10), o10 = r10.prog.findIndex((e18) => BD(e18) && e18.on === t10), s10 = r10.prog[o10];
  if (!s10 || !BD(s10)) return;
  if (!s10.body.length) return r10.msg = { t: `Im ${WD[t10]} liegen noch keine Bausteine.`, k: `info` }, gk(i10, r10.msg.t), hk(e17);
  BO(r10), r10.steps = [], r10.env = { t: a10, pose: () => r10.at, count: 0, stuck: false }, r10.gen = OO(s10.body, r10.env, 0, `${o10}.`), r10.origin = r10.at, r10.pc = 0, r10.bad = null, r10.msg = null, r10.phase = `run`;
  let c10 = { id: e17, pg: i10, t: a10, r: r10, token: ++r10.token };
  for (xk(e17, `[data-a="ev:${t10}"]`, `is-on`, true), hk(e17), xk(e17, `[data-a="ev:${t10}"]`, `is-on`, true); Ek(c10) && r10.steps.length <= EO; ) {
    let e18 = r10.gen.next();
    if (e18.done) break;
    r10.steps.push(e18.value);
    let t11 = r10.pc;
    if (!await P_e(c10, t11) || !Ek(c10)) return;
    r10.pc = t11 + 1;
  }
  if (!Ek(c10)) return;
  r10.phase = `idle`;
  let l10 = AD(i10.costume), u10 = a10.stars.length - r10.starsRun.length;
  if (wk(a10, r10.at)) {
    if (!u10) return Ok(c10, `Super! Alle Sterne \u2013 und ${l10.nom} ist ${l10.atGoal}.`);
    r10.msg = { t: u10 === 1 ? `Es fehlt noch ein Stern.` : `Es fehlen noch ${u10} Sterne.`, k: `info` };
  }
  hk(e17);
}
function V_e(e17, t10) {
  for (let n10 of pk(e17)) n10.querySelectorAll(`.lh-pg-pendot`).forEach((e18) => {
    e18.setAttribute(`fill`, LD[t10.penCol]?.c ?? LD[0].c), e18.setAttribute(`opacity`, t10.penDown ? `1` : `0`);
  });
}
function H_e(e17, t10, n10, r10) {
  let [i10, a10] = ek(t10, n10[0], n10[1]), [o10, s10] = ek(t10, n10[2], n10[3]);
  for (let c10 of pk(e17)) {
    let e18 = c10.querySelector(`.lh-pg-ink`);
    if (!e18) continue;
    let l10 = document.createElementNS(`http://www.w3.org/2000/svg`, `line`);
    l10.setAttribute(`x1`, i10.toFixed(1)), l10.setAttribute(`y1`, a10.toFixed(1)), l10.setAttribute(`x2`, i10.toFixed(1)), l10.setAttribute(`y2`, a10.toFixed(1)), l10.setAttribute(`stroke`, LD[n10[4]]?.c ?? LD[0].c), l10.setAttribute(`stroke-width`, ($O(t10) * 0.1).toFixed(1)), l10.setAttribute(`stroke-linecap`, `round`), e18.appendChild(l10);
    let u10 = performance.now(), d10 = (e19) => {
      let t11 = Math.min(1, (e19 - u10) / r10), n11 = t11 < 0.5 ? 2 * t11 * t11 : 1 - (-2 * t11 + 2) ** 2 / 2;
      l10.setAttribute(`x2`, (i10 + (o10 - i10) * n11).toFixed(1)), l10.setAttribute(`y2`, (a10 + (s10 - a10) * n11).toFixed(1)), t11 < 1 && requestAnimationFrame(d10);
    };
    requestAnimationFrame(d10);
  }
}
function U_e(e17, t10, n10, r10, i10) {
  let a10 = performance.now(), o10 = (s10) => {
    let c10 = Math.min(1, (s10 - a10) / i10), l10 = n10[0] + (r10[0] - n10[0]) * c10, u10 = n10[1] + (r10[1] - n10[1]) * c10;
    for (let n11 of pk(e17)) n11.querySelector(`.lh-pg-cat`)?.setAttribute(`transform`, nk(t10, l10, u10, 0.78));
    c10 < 1 && requestAnimationFrame(o10);
  };
  requestAnimationFrame(o10);
}
function kk(e17, t10) {
  let n10 = dO[e17];
  if (n10 === void 0) return;
  let r10 = eh(`xylophone`, n10, t10 === void 0 ? {} : { when: t10 });
  setTimeout(() => r10?.release(), 600);
}
function W_e(e17) {
  let t10 = zr();
  if (!t10) return;
  let n10 = t10.currentTime + 0.1;
  e17.stops.forEach((t11, r10) => {
    kk(t11.t, n10), n10 += 0.55 * (e17.beats?.[r10] ?? 1);
  });
}
function G_e(e17) {
  let t10 = MO.get(e17);
  t10 && (t10.token++, t10.phase = `idle`, t10.at = t10.origin, t10.gotRun = t10.got, t10.starsRun = [], t10.msg = { t: `Angehalten.`, k: `info` }, hk(e17));
}
async function K_e(e17, t10) {
  let n10 = NO.get(e17), r10 = MO.get(e17);
  if (!n10 || !r10 || r10.phase !== `idle`) return;
  let i10 = QD(n10.pg), a10 = RO(i10, r10);
  BO(r10), r10.trace.length || (r10.trace = [[r10.at.x, r10.at.y]]), r10.phase = `run`, r10.msg = null;
  let o10 = { id: e17, pg: i10, t: a10, r: r10, token: ++r10.token }, s10 = r10.at, c10 = Tk(s10, t10), l10 = a10.n, u10 = Math.min(vk(i10), 450);
  if (t10 === `L` || t10 === `R`) {
    if (_k(t10 === `L` ? 520 : 600, 60), await bk(e17, l10, s10, { x: s10.x, y: s10.y, ang: s10.d * 90 + (t10 === `L` ? -90 : 90) }, s10.d * 90, u10 * 0.8), !Ek(o10)) return;
    r10.at = c10;
  } else {
    let t11 = c10.x < 0 || c10.y < 0 || c10.x >= l10 || c10.y >= l10;
    if (t11 || Ck(a10, c10.x, c10.y)) return await bk(e17, l10, s10, { x: c10.x, y: c10.y, ang: s10.d * 90 }, s10.d * 90, u10, true), Ek(o10) ? (r10.phase = `idle`, r10.msg = { t: t11 ? `Hier ist der Rand.` : Sk(a10, c10.x, c10.y) ? `Da geht der Weg nicht weiter.` : `Au! Da ist ${FD(i10.mat).wall} im Weg.`, k: `bad` }, yi(), gk(i10, r10.msg.t), hk(e17)) : void 0;
    if (_k(660, 55), await bk(e17, l10, s10, { x: c10.x, y: c10.y, ang: s10.d * 90 }, s10.d * 90, u10), !Ek(o10)) return;
    if (r10.at = c10, r10.trace.push([c10.x, c10.y]), i10.lesson === `music`) {
      let e18 = N_e(a10, c10.x, c10.y);
      e18 && kk(e18);
    }
    a10.stars.forEach(([e18, t12], n12) => {
      e18 === c10.x && t12 === c10.y && !r10.starsRun.includes(n12) && (r10.starsRun.push(n12), _k(988, 90, 0.08));
    });
    let n11 = a10.stops[r10.got];
    n11 && n11.x === c10.x && n11.y === c10.y && (r10.got++, r10.gotRun = r10.got, _k(784, 90, 0.08), setTimeout(() => _k(1047, 120, 0.08), 100));
  }
  r10.phase = `idle`;
  let d10 = AD(i10.costume);
  if (i10.lesson === `goal` && wk(a10, r10.at)) return Ok(o10, `Super! ${_O(d10.nom)} ist ${d10.atGoal}.`);
  if (i10.lesson === `collect` && wk(a10, r10.at)) {
    let e18 = a10.stars.length - r10.starsRun.length;
    if (!e18) return Ok(o10, `Super! Alle Sterne \u2013 und ${d10.nom} ist ${d10.atGoal}.`);
    r10.msg = { t: e18 === 1 ? `Es fehlt noch ein Stern.` : `Es fehlen noch ${e18} Sterne.`, k: `info` };
  }
  if (a10.stops.length && r10.got >= a10.stops.length) return Ok(o10, i10.lesson === `word` ? `Super! Du bist ${a10.word ?? ``} gefahren.` : `Super! Alle geschafft.`);
  hk(e17);
}
function q_e(e17, t10, n10, r10 = 0) {
  let i10 = t10, a10 = [[i10.x, i10.y]], o10 = [], s10 = { t: e17, pose: () => i10, count: 0, stuck: false }, c10 = 0;
  for (let t11 of OO(n10, s10, r10)) {
    if (++c10 > EO) break;
    let n11 = t11.cmd;
    if (n11 === `P`) {
      o10.push([i10.x, i10.y]);
      continue;
    }
    if (n11 === `K` || n11 === `?` || n11 === `D` || n11 === `U` || n11 === `V`) continue;
    let r11 = Tk(i10, n11);
    if (n11 === `F` || n11 === `B`) {
      if (r11.x < 0 || r11.y < 0 || r11.x >= e17.n || r11.y >= e17.n || Ck(e17, r11.x, r11.y)) return { pts: a10, end: i10, bump: [r11.x, r11.y], pauses: o10 };
      a10.push([r11.x, r11.y]);
    }
    i10 = r11;
  }
  return { pts: a10, end: i10, bump: null, pauses: o10 };
}
function J_e(e17, t10, n10, r10, i10) {
  let a10 = t10.n, o10 = $O(a10), s10 = q_e(t10, n10, r10, i10), c10 = s10.pts.map(([e18, t11]) => ek(a10, e18, t11).map((e19) => e19.toFixed(1)).join(`,`)).join(` `), l10 = `<polyline points="${c10}" fill="none" stroke="#fff" stroke-width="${(o10 * 0.16).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>`;
  l10 += `<polyline points="${c10}" fill="none" stroke="#f97316" stroke-width="${(o10 * 0.09).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  for (let [e18, t11] of s10.pauses) {
    let [n11, r11] = ek(a10, e18, t11), i11 = n11 + o10 * 0.3, s11 = r11 - o10 * 0.3;
    l10 += `<circle cx="${i11.toFixed(1)}" cy="${s11.toFixed(1)}" r="${(o10 * 0.14).toFixed(1)}" fill="${XO}" stroke="#fff" stroke-width="3"/><g transform="translate(${i11.toFixed(1)} ${s11.toFixed(1)}) scale(${(o10 / 480).toFixed(3)})">${ID.P}</g>`;
  }
  if (l10 += `<g opacity=".5" transform="${tk(a10, s10.end.x, s10.end.y, s10.end.d * 90)}">${MD[e17.costume]}</g>`, s10.bump) {
    let [e18, t11] = ek(a10, s10.end.x, s10.end.y), [n11, r11] = ek(a10, s10.bump[0], s10.bump[1]), i11 = (e18 + n11) / 2, c11 = (t11 + r11) / 2, u10 = o10 * 0.16;
    l10 += `<circle cx="${i11.toFixed(1)}" cy="${c11.toFixed(1)}" r="${(u10 * 1.5).toFixed(1)}" fill="#fff" stroke="#dc2626" stroke-width="4"/>`, l10 += `<path d="M${(i11 - u10).toFixed(1)} ${(c11 - u10).toFixed(1)}L${(i11 + u10).toFixed(1)} ${(c11 + u10).toFixed(1)}M${(i11 + u10).toFixed(1)} ${(c11 - u10).toFixed(1)}L${(i11 - u10).toFixed(1)} ${(c11 + u10).toFixed(1)}" stroke="#dc2626" stroke-width="${(o10 * 0.05).toFixed(1)}" stroke-linecap="round"/>`;
  }
  return l10;
}
var Y_e = 3e3;
function X_e(e17, t10, n10) {
  let r10 = RO(t10, n10);
  if (!n10.prog.slice(n10.done).length) return n10.msg = { t: t10.input === `pad` ? `Tippe zuerst die Pfeile.` : `Das Programm ist noch leer.`, k: `info` }, hk(e17);
  BO(n10).peeks++;
  let i10 = J_e(t10, r10, n10.origin, n10.prog, n10.done);
  for (let t11 of pk(e17)) {
    t11.querySelectorAll(`.lh-pg-peek`).forEach((e19) => e19.remove());
    let e18 = t11.querySelector(`.lh-pg-trace`);
    if (!e18) continue;
    let n11 = document.createElementNS(`http://www.w3.org/2000/svg`, `g`);
    n11.setAttribute(`class`, `lh-pg-peek`), n11.setAttribute(`pointer-events`, `none`), n11.innerHTML = i10, e18.after(n11), setTimeout(() => n11.remove(), 3100);
  }
}
function Ak(e17, t10, n10) {
  let r10 = LO(t10, e17);
  e17.i = n10;
  let i10 = r10[Math.min(n10, r10.length - 1)];
  Object.assign(e17, { prog: FO(i10), done: 0, sel: null, steps: [], mark: null, rating: 0, at: PO(i10), origin: PO(i10), got: 0, ink: [], penDown: false, penCol: 0, play: false, gen: null, env: null, tick: 0, points: 0, phase: `idle`, pc: 0, trace: [], msg: null, bad: null, gotRun: 0, starsRun: [], happy: false }), e17.token++;
}
function Z_e(e17, t10) {
  return e17.lesson === `count` ? [`star`, `red`, `blue`, `wall`, `free`] : t10.maze ? [`rightFree`, `wall`, `free`, `leftFree`] : [`red`, `blue`, `wall`, `free`];
}
function Q_e(e17, t10, n10, r10) {
  return r10 === `W` ? { rep: 2, body: [] } : r10 === `Z` ? { rep: 2, until: true, body: [] } : r10 === `I` ? { cond: Z_e(e17, t10)[0], body: [] } : r10 === `K` ? { col: (n10.penCol + 1) % LD.length } : r10;
}
var $_e = (e17, t10) => t10 === `W` ? `wiederhole` : t10 === `Z` ? `wiederhole bis zum Ziel` : t10 === `I` ? `falls` : t10 === `K` ? `Farbe` : bO(e17, t10);
function jk(e17, t10) {
  let n10 = NO.get(e17);
  if (!n10) return;
  let r10 = QD(n10.pg), i10 = zO(e17);
  pi();
  let a10 = i10.phase === `idle` || i10.phase === `step`, o10 = () => {
    i10.phase === `step` && (i10.token++, i10.phase = `idle`, i10.at = i10.origin, i10.gotRun = i10.got, i10.starsRun = []);
  }, s10 = RO(r10, i10), c10 = s10.kind === `fix` || s10.kind === `gap`, l10 = s10.kind === `events`;
  if (t10.startsWith(`ev:`)) return void B_e(e17, t10.slice(3));
  if (t10.startsWith(`add:`)) {
    let n11 = t10.slice(4);
    if (r10.input === `pad` && r10.pad === `now` && !KD(r10.lesson)) return `WKZI`.includes(n11) ? void 0 : void K_e(e17, n11);
    if (!a10 || s10.kind === `predict` || i10.play) return;
    if (l10 && i10.sel === null) return i10.msg = { t: `Tippe zuerst auf einen Pfeil-Baustein (\u201EWenn \u2026 getippt\u201C) \u2013 dann auf die Bausteine.`, k: `info` }, gk(r10, i10.msg.t), hk(e17);
    if (c10) {
      let t11 = i10.sel === null ? null : kO(i10.prog, i10.sel);
      return !t11 || `WKZI`.includes(n11) ? (i10.msg = { t: s10.kind === `gap` ? `Tippe zuerst auf das ? im Programm.` : `Tippe zuerst auf die Karte, die nicht stimmt.`, k: `info` }, gk(r10, i10.msg.t), hk(e17)) : (o10(), BO(i10), _i(), t11.list[t11.i] = n11, i10.bad = null, i10.msg = null, r10.voice && M(bO(r10, n11)), hk(e17));
    }
    let u10 = s10.limit ?? 40;
    if (GD(i10.prog) >= u10) return i10.msg = { t: s10.limit ? `H\xF6chstens ${s10.limit} Bausteine \u2013 nimm \u201Ewiederhole\u201C.` : `Mehr als 40 Bausteine gehen nicht.`, k: `info` }, gk(r10, i10.msg.t), hk(e17);
    o10(), BO(i10), _i();
    let d10 = Q_e(r10, s10, i10, n11), f10 = i10.sel === null ? null : AO(i10.prog, i10.sel), p10 = f10 ? UD(f10) : null;
    if (i10.sel !== null && f10 && p10) p10.push(d10), i10.sel = `${i10.sel}.${p10.length - 1}`;
    else if (i10.sel !== null && f10) {
      let e18 = kO(i10.prog, i10.sel);
      e18.list.splice(e18.i + 1, 0, d10), i10.sel = e18.prefix + (e18.i + 1);
    } else i10.prog.push(d10), UD(d10) && (i10.sel = String(i10.prog.length - 1));
    return i10.bad = null, i10.msg?.k !== `ok` && (i10.msg = null), r10.voice && M($_e(r10, n11)), hk(e17);
  }
  if (t10.startsWith(`cond:`)) {
    if (!a10 || i10.play) return;
    let n11 = AO(i10.prog, t10.slice(5));
    if (!n11 || !HD(n11)) return;
    o10();
    let c11 = Z_e(r10, s10);
    return n11.cond = c11[(c11.indexOf(n11.cond) + 1) % c11.length], _i(), r10.voice && M(RD[n11.cond]), hk(e17);
  }
  if (t10.startsWith(`col:`)) {
    if (!a10 || i10.play) return;
    let n11 = AO(i10.prog, t10.slice(4));
    return !n11 || !VD(n11) ? void 0 : (o10(), n11.col = (n11.col + 1) % LD.length, _i(), r10.voice && M(LD[n11.col].name), hk(e17));
  }
  if (t10.startsWith(`card:`)) {
    if (!a10 || s10.kind === `predict` || i10.play) return;
    let n11 = t10.slice(5);
    if (!n11.includes(`.`) && Number(n11) < i10.done) return;
    o10(), i10.sel = i10.sel === n11 ? null : n11;
    let c11 = i10.sel === null ? null : AO(i10.prog, i10.sel);
    return c11 && r10.voice && M(jO([c11])[0]?.replace(/:.*$/, ``) ?? ``), hk(e17);
  }
  if (t10.startsWith(`del:`)) {
    if (!a10 || c10 || i10.play) return;
    let n11 = t10.slice(4), r11 = kO(i10.prog, n11);
    return !r11 || !n11.includes(`.`) && r11.i < i10.done || BD(r11.list[r11.i]) ? void 0 : (o10(), r11.list.splice(r11.i, 1), i10.sel = r11.i > 0 ? r11.prefix + (r11.i - 1) : r11.prefix ? r11.prefix.slice(0, -1) : null, i10.sel !== null && !r11.prefix && Number(i10.sel) < i10.done && (i10.sel = null), i10.bad = null, hk(e17));
  }
  if (t10.startsWith(`rep-:`) || t10.startsWith(`rep+:`)) {
    if (!a10) return;
    let n11 = AO(i10.prog, t10.slice(5));
    return !n11 || !zD(n11) ? void 0 : (o10(), n11.rep = Math.max(2, Math.min(9, n11.rep + (t10[3] === `+` ? 1 : -1))), _i(), r10.voice && M(`${n11.rep} mal`), hk(e17));
  }
  if (t10.startsWith(`cell:`)) {
    if (s10.kind !== `predict` || i10.phase !== `idle`) return;
    let [n11, r11] = t10.slice(5).split(`,`).map(Number);
    return i10.mark = i10.mark && i10.mark[0] === n11 && i10.mark[1] === r11 ? null : [n11, r11], i10.msg = null, BO(i10), _i(), hk(e17);
  }
  switch (t10) {
    case `unsel`:
      return i10.sel = null, hk(e17);
    case `back`: {
      if (!a10 || c10 || i10.play || i10.prog.length <= i10.done) return;
      o10();
      let t11 = i10.sel === null ? null : kO(i10.prog, i10.sel);
      if (t11 && BD(t11.list[t11.i])) t11.list[t11.i].body.pop();
      else if (t11 && (t11.prefix || t11.i >= i10.done)) t11.list.splice(t11.i, 1);
      else if (l10) return;
      else i10.prog.pop();
      return i10.sel = null, i10.bad = null, hk(e17);
    }
    case `clear`:
      return !a10 || c10 || i10.play ? void 0 : (o10(), l10 ? i10.prog.forEach((e18) => BD(e18) && e18.body.splice(0)) : i10.prog.splice(i10.done), i10.sel = null, i10.bad = null, i10.msg = null, i10.trace = i10.done ? i10.trace : [], hk(e17));
    case `go`:
      z_e(e17, false);
      return;
    case `edit`:
      return i10.phase === `idle` ? (Object.assign(i10, { play: false, at: PO(s10), origin: PO(s10), trace: [], starsRun: [], msg: null }), hk(e17)) : void 0;
    case `step`:
      z_e(e17, true);
      return;
    case `home`:
      return i10.phase === `run` ? void 0 : (Ak(i10, r10, i10.i), hk(e17));
    case `reset`:
      return Ak(i10, r10, i10.i), hk(e17);
    case `say`: {
      if (r10.lesson === `music`) {
        M(vO(SO(r10, s10))).then(() => W_e(s10));
        return;
      }
      let e18 = r10.lesson === `math` && s10.sums ? ` ${s10.sums[Math.min(i10.got, s10.sums.length - 1)]}.` : r10.lesson === `numbers` || r10.lesson === `word` ? ` ${s10.stops.map((e19) => e19.t).join(`, `)}.` : ``;
      M(vO(SO(r10, s10) + e18));
      return;
    }
    case `peek`:
      r10.peek && a10 && s10.kind !== `predict` && X_e(e17, r10, i10);
      return;
    case `readprog`: {
      let e18 = jO(i10.prog.slice(i10.done));
      M(e18.length ? e18.join(`, `) : `Das Programm ist noch leer.`);
      return;
    }
    case `next`: {
      let t11 = LO(r10, i10);
      return i10.i + 1 >= t11.length ? t11.length > 1 ? (i10.phase = `summary`, vi()) : (i10.tasks = Ik(r10), i10.stats = [], Ak(i10, r10, 0)) : Ak(i10, r10, i10.i + 1), hk(e17);
    }
    case `again`:
      return MO.set(e17, IO(i10.ver + 1, (i10.tasks = Ik(r10))[0], i10.tasks)), mk(e17);
  }
}
var Mk = null;
var Nk = /* @__PURE__ */ new WeakSet();
function Pk(e17, t10, n10) {
  let r10 = e17.getBoundingClientRect();
  return [(t10 - r10.left) * HO / r10.width, (n10 - r10.top) * UO / r10.height];
}
function eve(e17, t10) {
  let n10 = t10.getBoundingClientRect(), [r10, i10] = Pk(e17, n10.left, n10.top), [a10, o10] = Pk(e17, n10.right, n10.bottom);
  return { x0: r10, y0: i10, x1: a10, y1: o10 };
}
var tve = (e17) => e17.includes(`.`) ? e17.slice(0, e17.lastIndexOf(`.`)) : ``;
var nve = (e17) => Number(e17.slice(e17.lastIndexOf(`.`) + 1));
function rve(e17, t10) {
  if (t10 === ``) return e17;
  let n10 = AO(e17, t10);
  return n10 ? UD(n10) : null;
}
function ive(e17, t10, n10 = ``) {
  if (e17 === t10) return n10.replace(/\.$/, ``);
  for (let r10 = 0; r10 < e17.length; r10++) {
    let i10 = UD(e17[r10]);
    if (!i10) continue;
    let a10 = ive(i10, t10, n10 + r10 + `.`);
    if (a10 !== null) return a10;
  }
  return null;
}
function ave(e17, t10, n10) {
  let r10 = MO.get(e17.id), i10 = NO.get(e17.id);
  if (!r10 || !i10) return { target: null, out: false, line: `` };
  let a10 = t10 < 890 || t10 > 1366 || n10 < 326 || n10 > 702;
  if (a10) return { target: null, out: a10, line: `` };
  let o10 = e17.src.startsWith(`new:`) ? null : e17.src, s10 = (e18) => !!o10 && (e18 === o10 || e18.startsWith(o10 + `.`)), c10 = QD(i10.pg).lesson, l10 = hge(c10), u10 = c10 === `events`, d10 = [...e17.svg.querySelectorAll(`[data-node], [data-slot], [data-end]`)].filter((e18) => !e18.closest(`.lh-pg-ghost`)).map((t11) => ({ kind: t11.hasAttribute(`data-slot`) ? `slot` : t11.hasAttribute(`data-end`) ? `end` : t11.classList.contains(`is-loop`) ? `top` : `cmd`, path: t11.getAttribute(`data-node`) ?? t11.getAttribute(`data-slot`) ?? t11.getAttribute(`data-end`) ?? ``, ...eve(e17.svg, t11) })).filter((e18) => !(e18.kind === `cmd` || e18.kind === `top` ? s10(e18.path) : o10 && (e18.path === o10 || e18.path.startsWith(o10 + `.`)))).filter((e18) => l10 || !e18.path.includes(`.`)).filter((e18) => l10 || Number(e18.path) >= r10.done);
  if (!d10.length) return { target: { list: ``, i: r10.prog.length }, out: false, line: `` };
  if (!l10) {
    let e18 = d10.filter((e19) => n10 >= e19.y0 - 6 && n10 <= e19.y1 + 6);
    if (!e18.length) {
      let e19 = d10.reduce((e20, t12) => t12.y1 > e20.y1 || t12.y1 === e20.y1 && t12.x1 > e20.x1 ? t12 : e20);
      if (n10 > e19.y1) return { target: { list: ``, i: r10.prog.length }, out: false, line: `M${e19.x1 + 4} ${e19.y0 - 4}V${e19.y1 + 4}` };
      let t11 = d10.reduce((e20, t12) => t12.y0 < e20.y0 || t12.y0 === e20.y0 && t12.x0 < e20.x0 ? t12 : e20);
      return { target: { list: ``, i: Math.max(r10.done, Number(t11.path)) }, out: false, line: `M${t11.x0 - 4} ${t11.y0 - 4}V${t11.y1 + 4}` };
    }
    let i11 = e18.reduce((e19, n11) => Math.abs((n11.x0 + n11.x1) / 2 - t10) < Math.abs((e19.x0 + e19.x1) / 2 - t10) ? n11 : e19), a11 = t10 < (i11.x0 + i11.x1) / 2, o11 = Math.max(r10.done, Number(i11.path) + +!a11), s11 = a11 ? i11.x0 - 4 : i11.x1 + 4;
    return { target: { list: ``, i: o11 }, out: false, line: `M${s11} ${i11.y0 - 4}V${i11.y1 + 4}` };
  }
  let f10 = d10.filter((e18) => t10 >= e18.x0 - 16 && t10 <= e18.x1 + 16);
  f10.length && d10.splice(0, d10.length, ...f10), d10.sort((e18, t11) => e18.y0 - t11.y0);
  let p10 = d10.find((e18) => n10 >= e18.y0 - 2 && n10 <= e18.y1 + 2) ?? (n10 < d10[0].y0 ? d10[0] : d10[d10.length - 1]), m10 = n10 < (p10.y0 + p10.y1) / 2, h10, g10;
  if (p10.kind === `slot` ? (h10 = { list: p10.path, i: 0 }, g10 = (p10.y0 + p10.y1) / 2) : p10.kind === `end` ? (h10 = { list: tve(p10.path), i: nve(p10.path) + 1 }, g10 = p10.y1 + 2) : p10.kind === `top` && !m10 ? (h10 = { list: p10.path, i: 0 }, g10 = p10.y1 + 2) : (h10 = { list: tve(p10.path), i: nve(p10.path) + +!m10 }, g10 = m10 ? p10.y0 - 2 : p10.y1 + 2), n10 > d10[d10.length - 1].y1 + 6 && (h10 = { list: ``, i: r10.prog.length }, g10 = d10[d10.length - 1].y1 + 4), o10 && (h10.list === o10 || h10.list.startsWith(o10 + `.`)) || u10 && h10.list === ``) return { target: null, out: false, line: `` };
  let _10 = p10.x0 + (p10.kind === `slot` ? 0 : h10.list === p10.path ? 26 : 0);
  return { target: h10, out: false, line: `M${_10.toFixed(1)} ${g10.toFixed(1)}H${(_10 + 130).toFixed(1)}` };
}
function ove(e17) {
  let t10 = Mk;
  if (!t10 || e17.pointerId !== t10.pointerId) return;
  if (!t10.on) {
    if (Math.hypot(e17.clientX - t10.x0, e17.clientY - t10.y0) < 10) return;
    t10.on = true, t10.el.classList.remove(`is-down`), t10.el.classList.add(`is-dragging`);
    let n11 = t10.el.cloneNode(true);
    n11.removeAttribute(`data-node`), n11.removeAttribute(`data-drag`), n11.classList.remove(`lh-key`, `is-dragging`, `is-sel`, `is-down`);
    let r11 = document.createElementNS(`http://www.w3.org/2000/svg`, `g`);
    r11.setAttribute(`class`, `lh-pg-ghost`), r11.setAttribute(`pointer-events`, `none`), r11.appendChild(n11), t10.svg.appendChild(r11), t10.ghost = r11;
    let i11 = document.createElementNS(`http://www.w3.org/2000/svg`, `path`);
    i11.setAttribute(`class`, `lh-pg-drop`), i11.setAttribute(`stroke`, `#0f172a`), i11.setAttribute(`stroke-width`, `5`), i11.setAttribute(`stroke-linecap`, `round`), i11.setAttribute(`fill`, `none`), t10.svg.appendChild(i11), t10.mark = i11;
  }
  let [n10, r10] = Pk(t10.svg, e17.clientX, e17.clientY), [i10, a10] = Pk(t10.svg, t10.x0, t10.y0);
  t10.ghost?.setAttribute(`transform`, `translate(${(n10 - i10).toFixed(1)} ${(r10 - a10).toFixed(1)})`);
  let o10 = ave(t10, n10, r10);
  t10.target = o10.target, t10.out = o10.out && !t10.src.startsWith(`new:`), t10.ghost?.classList.toggle(`is-out`, t10.out), t10.mark?.setAttribute(`d`, o10.line);
}
function sve(e17, t10 = false) {
  let n10 = Mk;
  if (!n10 || e17.pointerId !== n10.pointerId || (Mk = null, n10.el.classList.remove(`is-down`, `is-dragging`), n10.ghost?.remove(), n10.mark?.remove(), t10)) return;
  if (!n10.on) {
    jk(n10.id, n10.src.startsWith(`new:`) ? `add:` + n10.src.slice(4) : `card:` + n10.src);
    return;
  }
  let r10 = MO.get(n10.id), i10 = NO.get(n10.id);
  if (!r10 || !i10 || r10.phase !== `idle` && r10.phase !== `step`) return;
  let a10 = QD(i10.pg);
  if (r10.phase === `step` && (r10.token++, r10.phase = `idle`, r10.at = r10.origin, r10.gotRun = r10.got, r10.starsRun = []), n10.src.startsWith(`new:`)) {
    if (!n10.target) return;
    let e18 = RO(a10, r10), t11 = e18.limit ?? 40;
    if (GD(r10.prog) >= t11) return r10.msg = { t: e18.limit ? `H\xF6chstens ${e18.limit} Bausteine \u2013 nimm \u201Ewiederhole\u201C.` : `Mehr als 40 Bausteine gehen nicht.`, k: `info` }, gk(a10, r10.msg.t), hk(n10.id);
    let i11 = n10.src.slice(4), o11 = rve(r10.prog, n10.target.list);
    if (!o11) return;
    let s11 = o11 === r10.prog ? Math.max(r10.done, Math.min(n10.target.i, o11.length)) : Math.min(n10.target.i, o11.length);
    return o11.splice(s11, 0, Q_e(a10, RO(a10, r10), r10, i11)), BO(r10), _i(), r10.sel = (n10.target.list ? n10.target.list + `.` : ``) + s11, r10.bad = null, r10.msg?.k !== `ok` && (r10.msg = null), a10.voice && M($_e(a10, i11)), hk(n10.id);
  }
  let o10 = kO(r10.prog, n10.src);
  if (!o10) return;
  if (n10.out) return o10.list.splice(o10.i, 1), r10.sel = null, r10.bad = null, _i(), hk(n10.id);
  if (!n10.target) return;
  let s10 = rve(r10.prog, n10.target.list);
  if (!s10) return;
  let c10 = o10.list[o10.i], l10 = n10.target.i;
  s10 === o10.list && o10.i < l10 && l10--, o10.list.splice(o10.i, 1), s10 === r10.prog && (l10 = Math.max(r10.done, l10)), l10 = Math.min(l10, s10.length), s10.splice(l10, 0, c10);
  let u10 = ive(r10.prog, s10);
  r10.sel = (u10 ? u10 + `.` : ``) + l10, r10.bad = null, _i(), hk(n10.id);
}
function cve(e17) {
  Nk.has(e17) || (Nk.add(e17), e17.addEventListener(`pointerdown`, (t10) => {
    if (t10.button > 0 || !Ti(e17) || Mk) return;
    let n10 = t10.target?.closest?.(`[data-drag]`), r10 = e17.querySelector(`svg`);
    if (!n10 || !r10 || !e17.contains(n10)) return;
    let i10 = e17.dataset.pgId ?? ``, a10 = MO.get(i10);
    !a10 || a10.play || a10.phase !== `idle` && a10.phase !== `step` || (t10.stopPropagation(), t10.preventDefault(), zr(), pi(), n10.classList.add(`is-down`), Mk = { id: i10, node: e17, svg: r10, el: n10, src: n10.getAttribute(`data-drag`) ?? ``, pointerId: t10.pointerId, x0: t10.clientX, y0: t10.clientY, on: false, ghost: null, mark: null, target: null, out: false });
  }, true), Nk.has(document.documentElement) || (Nk.add(document.documentElement), window.addEventListener(`pointermove`, ove, { passive: true }), window.addEventListener(`pointerup`, (e18) => sve(e18)), window.addEventListener(`pointercancel`, (e18) => sve(e18, true))));
}
var Fk = null;
var lve = false;
function uve() {
  lve || typeof window > `u` || (lve = true, window.addEventListener(`pointerdown`, (e17) => {
    let t10 = e17.target?.closest?.(`.lh-wg-code.is-live`);
    Fk = t10 && t10.classList.contains(`is-armed`) ? t10.dataset.pgId ?? null : t10 ? Fk : null;
  }, true), window.addEventListener(`keydown`, (e17) => {
    if (!Fk || e17.metaKey || e17.ctrlKey || e17.altKey) return;
    let t10 = (document.activeElement?.tagName ?? ``).toLowerCase();
    if (t10 === `input` || t10 === `textarea` || document.activeElement?.isContentEditable) return;
    let n10 = pk(Fk)[0];
    if (!n10?.isConnected || !n10.classList.contains(`is-armed`)) return;
    let r10 = MO.get(Fk)?.play ? { ArrowUp: `ev:up`, ArrowDown: `ev:down`, ArrowLeft: `ev:left`, ArrowRight: `ev:right` }[e17.key] : { ArrowUp: `add:F`, ArrowDown: `add:B`, ArrowLeft: `add:L`, ArrowRight: `add:R`, p: `add:P`, P: `add:P`, Enter: `go`, Backspace: `back` }[e17.key];
    r10 && (e17.preventDefault(), e17.stopPropagation(), e17.repeat || jk(Fk, r10));
  }, true));
}
function dve(e17, t10, n10, r10 = {}) {
  let i10 = QD(t10.pg), a10 = Math.max(1, Math.round(t10.w)), o10 = Math.max(1, Math.round(t10.h));
  n10 && NO.set(t10.id, t10);
  let s10 = n10 ? zO(t10.id) : null, c10 = `${a10}x${o10}|${n10}|${JSON.stringify(t10.pg ?? null)}|${s10 ? s10.ver : ``}`;
  if (e17.dataset.k === c10 || s10 && s10.phase === `run` && e17.dataset.k && e17.dataset.pgId === t10.id) return;
  e17.dataset.k = c10, e17.setAttribute(`aria-label`, fve(t10));
  let l10 = k_e(i10, s10, n10, a10, o10);
  if (!n10) {
    let t11 = document.createElement(`img`);
    t11.className = `lh-wg-pic`, t11.alt = ``, t11.draggable = false, t11.src = r10.stickerUrl ? r10.stickerUrl(l10) : `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(l10), t11.style.width = `${a10}px`, t11.style.height = `${o10}px`, e17.replaceChildren(t11);
    return;
  }
  e17.dataset.pgId = t10.id;
  let u10 = document.createElement(`div`);
  u10.className = `lh-wg-pic`, u10.innerHTML = l10.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e17.replaceChildren(u10), t10.locked && e17.classList.add(`is-armed`), uve(), cve(e17), Si(e17, { slide: false, hit: (t11) => (jk(e17.dataset.pgId ?? ``, t11.getAttribute(`data-a`) ?? ``), null) });
}
function fve(e17) {
  let t10 = QD(e17.pg);
  return `Programmieren: ${SO(t10, t10.tasks[0])}`;
}
function Ik(e17) {
  return gO(e17).map((t10, n10) => e17.tasks[n10]?.own && e17.tasks[n10].n === e17.size ? e17.tasks[n10] : t10);
}
var wve = `
.lh-wg-code .lh-pg-card.is-done{opacity:.42}
.lh-wg-code .lh-pg-card.is-run .lh-pg-face{stroke:#facc15;stroke-width:7}
.lh-wg-code .lh-pg-card.is-sel .lh-pg-face{stroke:#0f172a;stroke-width:5}
.lh-wg-code .lh-pg-card.is-bad .lh-pg-face{stroke:#dc2626;stroke-width:6}
.lh-wg-code .lh-pg-star{transition:opacity .35s}
.lh-wg-code .is-dragging{opacity:.3}
.lh-wg-code .is-on .lh-pg-face{fill:#0f766e}
.lh-wg-code .lh-pg-ghost{opacity:.9;filter:drop-shadow(0 6px 8px rgba(15,23,42,.3))}
.lh-wg-code .lh-pg-ghost.is-out{opacity:.35}
.lh-wg-code .lh-key.is-down .lh-pg-face{filter:brightness(.92)}
.lh-wg-code .lh-pg-star.is-got{opacity:0}
.lh-wg-code rect.is-got{fill:#dcfce7;stroke:#16a34a}
.lh-pg-body{transform-box:fill-box;transform-origin:center}
.lh-pg-body.is-happy{animation:lh-pg-happy .7s ease-in-out 4}
.lh-wg-code .lh-pg-peek{animation:lh-pg-peek ${Y_e}ms ease-in forwards}
@keyframes lh-pg-peek{0%{opacity:0}8%{opacity:1}75%{opacity:1}100%{opacity:0}}
@keyframes lh-pg-happy{30%{transform:scale(1.22) rotate(-10deg)}60%{transform:scale(1.22) rotate(10deg)}}`;
function Tve(e17) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-55 -55 110 110" width="110" height="110">${MD[e17]}</svg>`;
}
function Eve(e17) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 112 112" width="112" height="112">${tge(e17, 3, 0, 0, 100)}<g transform="translate(50 50) scale(.26)">${FD(e17).wallSvg}</g></svg>`;
}
var kZe = [{ value: `cards`, label: `Bausteine (Pfeilkarten)` }, { value: `pad`, label: `Tasten wie beim Bodenroboter` }];
var AZe = [{ value: `store`, label: `Merken, dann LOS` }, { value: `now`, label: `Sofort fahren` }];
var jZe = [{ value: `easy`, label: `Leicht` }, { value: `medium`, label: `Mittel` }, { value: `hard`, label: `Schwer` }];
var MZe = [{ value: `none`, label: `Keine` }, { value: `few`, label: `Wenige` }, { value: `many`, label: `Viele` }];
var NZe = [{ value: `add`, label: `Plus` }, { value: `sub`, label: `Minus` }, { value: `both`, label: `Plus und Minus` }];
var PZe = [{ value: 1, label: `Langsam` }, { value: 2, label: `Normal` }, { value: 3, label: `Schnell` }];
function FZe(e17) {
  switch (e17.lesson) {
    case `word`:
      return e17.level === `easy` ? `Nur die Buchstaben des Worts liegen auf dem Teppich.` : e17.level === `medium` ? `Dazu zwei andere Buchstaben.` : `Dazu f\xFCnf andere Buchstaben.`;
    case `math`:
      return e17.level === `easy` ? `Zwei Aufgaben je Teppich.` : e17.level === `medium` ? `Drei Aufgaben, dazu Zahlen in der N\xE4he der Ergebnisse.` : `Vier Aufgaben, mehr Zahlen zum Verwechseln.`;
    case `numbers`:
      return e17.level === `easy` ? `Drei Zahlen der Reihe nach.` : e17.level === `medium` ? `Vier Zahlen.` : `F\xFCnf Zahlen.`;
    case `collect`:
      return e17.level === `easy` ? `Zwei Sterne.` : e17.level === `medium` ? `Drei Sterne.` : `F\xFCnf Sterne.`;
    case `read`:
      return e17.level === `easy` ? `Programme mit 3 bis 5 Karten.` : e17.level === `medium` ? `Programme mit 5 bis 8 Karten, mit Drehungen.` : `Programme mit 8 bis 12 Karten, auch r\xFCckw\xE4rts.`;
    case `pen`:
      return e17.level === `easy` ? `10 Formen: Linien, Ecken, kleines Quadrat und Rechteck, Treppe, L, Br\xFCcke, Schale \u2013 jede einmal je Reihe.` : e17.level === `medium` ? `11 Formen: gro\xDFes Quadrat, Rechteck, Treppen, Plus, Fahne, Buchstaben T, U, C, F, P.` : `7 Formen: E, H, S, Schlange, Spirale, Berg, Fenster \u2013 mit r\xFCckw\xE4rts oder Umwegen.`;
    case `music`:
      return e17.level === `easy` ? `Die ersten 4 T\xF6ne eines Lieds, nur diese T\xF6ne liegen auf dem Teppich.` : e17.level === `medium` ? `Die ersten 6 T\xF6ne, dazu zwei andere T\xF6ne.` : `Die ersten 8 T\xF6ne, alle T\xF6ne von C bis c liegen auf dem Teppich.`;
    case `events`:
      return e17.level === `easy` ? `Zwei Sterne.` : e17.level === `medium` ? `Drei Sterne.` : `F\xFCnf Sterne.`;
    case `cond`:
      return e17.level === `easy` ? `Ein Weg mit roten Ecken (rot = rechts drehen): \u201Ewiederhole bis Ziel\u201C mit \u201Efalls Feld rot\u201C.` : e17.level === `medium` ? `Rote und blaue Ecken (blau = links drehen): zwei \u201Efalls\u201C-Bausteine.` : `Ein Labyrinth: \u201Efalls rechts frei\u201C, \u201Efalls Wand vor mir\u201C \u2013 die rechte Hand an der Wand.`;
    case `cat`:
      return e17.level === `easy` ? `Eine Katze l\xE4uft \xFCber drei Felder quer \xFCber den Weg.` : e17.level === `medium` ? `L\xE4ngere Wege, die Katze l\xE4uft \xFCber vier Felder.` : `Lange Wege mit Hindernissen.`;
    case `count`:
      return e17.level === `easy` ? `Ein gerader Weg mit zwei Sternen.` : e17.level === `medium` ? `Ein Weg mit roten Ecken und drei Sternen.` : `Rote und blaue Ecken, vier Sterne.`;
    case `loop`:
      return e17.level === `easy` ? `Gerade Strecken: \u201Ewiederhole n mal: vorw\xE4rts\u201C.` : e17.level === `medium` ? `Treppen und Haken: ein Muster aus 3 bis 4 Bausteinen.` : `L\xE4ngere Muster aus 5 bis 8 Bausteinen.`;
    default:
      return e17.level === `easy` ? `Kurze Wege: 1 bis 4 Befehle.` : e17.level === `medium` ? `Wege mit 4 bis 7 Befehlen.` : `Lange Wege mit 7 bis 13 Befehlen.`;
  }
}
var LZe = [{ value: `shapes`, label: `Formen nachzeichnen` }, { value: `free`, label: `Freies Malen` }];
var WZe = [{ label: `H\xE4nde waschen`, title: `H\xE4nde waschen`, steps: [[`Wasser an`, `Wasserhahn`], [`H\xE4nde nass machen`, `H\xE4nde waschen`], [`Seife nehmen`, `Seife`], [`H\xE4nde reiben`, `H\xE4nde`], [`Absp\xFClen`, `Wasser`], [`Wasser aus`, `Wasserhahn`], [`Abtrocknen`, `Handtuch`]] }, { label: `Z\xE4hne putzen`, title: `Z\xE4hne putzen`, steps: [[`Zahnpasta auf die B\xFCrste`, `Zahnpasta`], [`Z\xE4hne putzen`, `Z\xE4hne putzen`], [`Ausspucken`, `ausspucken`], [`Mund aussp\xFClen`, `Becher`], [`B\xFCrste auswaschen`, `Zahnb\xFCrste`]] }, { label: `Anziehen im Winter`, title: `Anziehen`, steps: [[`Unterhose`, `Unterhose`], [`Socken`, `Socken`], [`Hose`, `Hose`], [`Pullover`, `Pullover`], [`Jacke`, `Jacke`], [`M\xFCtze`, `M\xFCtze`], [`Schal`, `Schal`], [`Handschuhe`, `Handschuhe`], [`Schuhe`, `Schuhe`]] }, { label: `Toilette`, title: `Auf die Toilette gehen`, steps: [[`Hose runter`, `Hose`], [`Auf die Toilette`, `Toilette`], [`Papier nehmen`, `Toilettenpapier`], [`Sp\xFClen`, `sp\xFClen`], [`Hose hoch`, `anziehen`], [`H\xE4nde waschen`, `H\xE4nde waschen`]] }, { label: `Obstsalat`, title: `Obstsalat machen`, steps: [[`H\xE4nde waschen`, `H\xE4nde waschen`], [`Obst waschen`, `Obst`], [`Obst schneiden`, `Messer`], [`In die Sch\xFCssel`, `Sch\xFCssel`], [`Umr\xFChren`, `L\xF6ffel`], [`Guten Appetit!`, `essen`]] }, { label: `Der Schultag`, title: `Mein Schultag`, steps: [[`Ankommen`, `Schule`], [`Morgenkreis`, `Stuhlkreis`], [`Lernen`, `lernen`], [`Pause`, `Pause`], [`Mittagessen`, `Mittagessen`], [`Spielen`, `spielen`], [`Nach Hause`, `Bus`]] }, { label: `Tisch decken`, title: `Den Tisch decken`, steps: [[`Tischset hinlegen`, `Tischset`], [`Teller in die Mitte`, `Teller`], [`Gabel links`, `Gabel`], [`Messer rechts`, `Messer`], [`L\xF6ffel oben`, `L\xF6ffel`], [`Glas rechts oben`, `Glas`], [`Serviette dazu`, `Serviette`]] }, { label: `Vor dem Kochen`, title: `Bevor ich koche`, steps: [[`H\xE4nde waschen`, `H\xE4nde waschen`], [`Haare zusammenbinden`, `Haargummi`], [`Sch\xFCrze umbinden`, `Sch\xFCrze`], [`Lappen und Handtuch hinlegen`, `Lappen`], [`Rezept lesen`, `Rezept`], [`Zutaten holen`, `Zutaten`], [`Ger\xE4te hinlegen`, `Sch\xFCssel`], [`Sch\xFCssel f\xFCr Abfall`, `Abfall`]] }, { label: `Nach dem Kochen`, title: `Aufr\xE4umen nach dem Kochen`, steps: [[`Herd ausschalten`, `Herd`], [`Reste in den K\xFChlschrank`, `K\xFChlschrank`], [`Geschirr sp\xFClen`, `sp\xFClen`], [`Arbeitsfl\xE4che abwischen`, `Lappen`], [`Boden kehren`, `kehren`], [`M\xFCll trennen`, `M\xFClltrennung`], [`Licht aus`, `Lichtschalter`]] }, { label: `Von Hand sp\xFClen`, title: `Von Hand sp\xFClen`, steps: [[`Warmes Wasser einlassen`, `Sp\xFClbecken`], [`Wenig Sp\xFClmittel dazu`, `Sp\xFClmittel`], [`Gl\xE4ser zuerst`, `Glas`], [`Dann Besteck und Teller`, `Teller`], [`T\xF6pfe zum Schluss`, `Topf`], [`Mit klarem Wasser absp\xFClen`, `Wasser`], [`Abtrocknen`, `Geschirrtuch`], [`Wegr\xE4umen`, `Schrank`]] }, { label: `Sp\xFClmaschine`, title: `Sp\xFClmaschine einr\xE4umen`, steps: [[`Essensreste in den M\xFCll`, `M\xFCll`], [`Teller nach unten`, `Teller`], [`Tassen und Gl\xE4ser nach oben`, `Tasse`], [`Besteck in den Korb`, `Besteck`], [`Tab einlegen`, `Sp\xFClmaschinentab`], [`T\xFCr zu`, `Sp\xFClmaschine`], [`Programm starten`, `Knopf`]] }, { label: `W\xE4sche waschen`, title: `W\xE4sche waschen`, steps: [[`W\xE4sche sortieren`, `W\xE4sche`], [`Taschen leeren`, `Hosentasche`], [`W\xE4sche in die Maschine`, `Waschmaschine`], [`Waschmittel dosieren`, `Waschmittel`], [`Programm w\xE4hlen`, `Waschprogramm`], [`Start dr\xFCcken`, `Knopf`], [`W\xE4sche aufh\xE4ngen`, `W\xE4scheleine`]] }];
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
var yQe = (e17) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${Om(e17, 60, 60, 54)}</svg>`)}`;
var f1e = [{ value: `cards`, label: `Karten` }, { value: `list`, label: `Liste` }, { value: `tiles`, label: `Kacheln` }, { value: `buttons`, label: `Kn\xF6pfe` }];
var s2e = [{ value: `phone`, label: `Telefon` }, ...ed.filter((e17) => [`boss`, `colleague`, `cook`, `builder`, `teacher`, `man`, `woman`, `grandpa`].includes(e17.id)).map((e17) => ({ value: e17.id, label: e17.name }))];
var CODE_CHOICES = { lesson: pge, read: mge, penMode: LZe, input: kZe, ops: NZe, level: jZe, walls: MZe, speed: PZe, pad: AZe };
var FIGURE_CHOICES = { hair: Bu, hat: Gu, eyes: Vu, mouth: Hu, beard: Uu, glasses: Wu, top: Ku, pattern: qu, bottom: Ju, feel: ku };
var FIGURE_COLORS = { skin: Fu, hairColor: Iu, hatColor: Ru, eyeColor: Lu, topColor: Ru, bottomColor: Ru, shoes: zu };
var TOOLS_CSS = Eee;
var TOOL_REGISTRY = { "listen": { kind: "listen", field: "listen", draw: toe, label: eoe, config: (raw, media) => pg(raw, media, media), redraw: vg.redraw },
  "tally": { kind: "tally", field: "tally", draw: Us, label: Vs, config: (raw, media) => As(raw, media, media), redraw: Hs.redraw, register: Ps, state: ["counts"] },
  "spin": { kind: "spinner", field: "spin", draw: Lee, label: tc, config: (raw, media) => Js(raw, media, media), redraw: nc.redraw, reset: rc },
  "seek": { kind: "seek", field: "seek", draw: yc, label: _c, config: (raw, media) => sc(raw, media, media), redraw: vc.redraw, reset: bc },
  "pattern": { kind: "pattern", field: "pat", draw: Fc, label: Nc, config: (raw, media) => Tc(raw, media, media), redraw: Pc.redraw, reset: Ic },
  "body": { kind: "body", field: "bd", draw: Zre, label: Xre, config: (raw, media) => Nf(raw, media, media), redraw: Kf.redraw },
  "budget": { kind: "budget", field: "bud", draw: gre, label: af, config: (raw, media) => Wd(raw, media, media), redraw: df.redraw },
  "check": { kind: "check", field: "check", draw: Nie, label: zp, config: (raw, media) => Np(raw, media, media), redraw: Bp.redraw, register: kie, state: ["vals"] },
  "circles": { kind: "circles", field: "nd", draw: Ure, label: Hre, config: (raw, media) => Df(raw, media, media), redraw: jf.redraw, register: Lre, state: ["rings"] },
  "machine": { kind: "machine", field: "mc", draw: rre, label: nre, config: (raw, media) => kd(raw, media, media), redraw: Rd.redraw },
  "mood": { kind: "mood", field: "mood", draw: nae, label: jm, config: (raw, media) => Dm(raw, media, media), redraw: Mm.redraw, reset: Nm },
  "phone": { kind: "phone", field: "phone", draw: ol, label: il, config: (raw, media) => Rc(raw, media, media), redraw: al.redraw },
  "pieces": { kind: "pieces", field: "pc", draw: Die, label: Dp, config: (raw, media) => Cp(raw, media, media), redraw: Op.redraw, register: Sie, state: ["count"] },
  "practice": { kind: "practice", field: "gp", draw: Kne, label: Gne, config: (raw, media) => Sd(raw, media, media), redraw: Dd.redraw },
  "rating": { kind: "rating", field: "rate", draw: zie, label: Xp, config: (raw, media) => Gp(raw, media, media), redraw: Zp.redraw, register: Iie, state: ["va","vb"] },
  "sort": { kind: "sort", field: "sort", draw: aie, label: iie, config: (raw, media) => Xf(raw, media, media), redraw: tp.redraw },
  "steps": { kind: "steps", field: "steps", draw: Es, label: ws, config: (raw, media) => _s(raw, media, media), redraw: Ts.redraw },
  "stress": { kind: "stress", field: "stress", draw: yie, label: vie, config: (raw, media) => gp(raw, media, media), redraw: xp.redraw },
  "timeline": { kind: "timeline", field: "tl", draw: wre, label: Sre, config: (raw, media) => pf(raw, media, media), redraw: Cre.redraw },
  "traffic": { kind: "traffic", field: "traffic", draw: $ie, label: Cm, config: (raw, media) => $p(raw, media, media), redraw: wm.redraw },
  "vote": { kind: "vote", field: "vote", draw: Pre, label: Nre, config: (raw, media) => _f(raw, media, media), redraw: Cf.redraw, register: kre, state: ["counts"] },
  "week": { kind: "week", field: "week", draw: mie, label: pie, config: (raw, media) => sp(raw, media, media), redraw: pp.redraw } };
export { toe as renderListen, eoe as listenLabel, pg as listenConfig, yg as resetListen, noe as stopListen, lh as LISTEN_SOUNDS, dg as LISTEN_INSTRUMENTS, yae as playListenSound, Hh as listenSoundPicture, ic as SEEK_SHAPES, ac as SEEK_COLORS, aQe as seekPicture, Sc as PATTERN_RULES, tQe as SPIN_PRESETS, Os as TALLY_COLORS, Ks as SPIN_COLORS, Tm as MOOD_FEELS, yQe as moodPicture, jp as CHECK_PRESETS, WZe as STEPS_PRESETS, gs as STEPS_COLORS, Nne as PRACTICE_PRESETS, s2e as PRACTICE_PARTNERS, hp as STRESS_IDEAS, Up as RATING_PRESETS, Ef as CIRCLE_RINGS, wf as CIRCLE_COLORS, rp as WEEK_DAYS, op as weekStart, Ud as budgetStart, ore as registerBudget, qne as MACHINE_KINDS, Od as machineStart, Mue as renderBookmarks, Qb as bookmarksLabel, Hb as bookmarksConfig, Nue as tapBookmarks, Pue as BOOKMARKS_CSS, f1e as BOOKMARK_LAYOUTS, zb as BOOKMARK_COLORS, dve as renderCode, fve as codeLabel, QD as codeConfig, CODE_CHOICES, uge as CODE_SIZES, dge as CODE_RANGES, kD as CODE_COSTUMES, Tve as costumePicture, PD as CODE_CARPETS, Eve as carpetPicture, FZe as codeLevelHint, KD as codeWithoutPad, wve as CODE_CSS, One as renderFigure, $u as figureConfig, ld as figureSvg, fd as figureView, lu as FIGURE_PITCHES, FIGURE_CHOICES, FIGURE_COLORS, Mne as FIGURE_CSS, Zx as renderTheater, pde as theaterLabel, sx as theaterConfig, Vue as registerTheaterHost, zue as registerTheaterSave, Bue as registerTheaterPositions, nx as THEATER_BACKS, dx as theaterBackPicture, mde as THEATER_CSS, TOOLS_CSS, TOOL_REGISTRY };
