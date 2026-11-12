/* eslint-disable */
// @ts-nocheck
// “Silben verbinden” – the widget of the reference (Lernsachen-Heft), taken
// over unchanged: pull the first letter to the second, the syllable rides away
// in a vehicle, certificate at the end. ReferenceWidget.tsx hosts it.
import { lc, dc, vi, pi, Vr, Kr, qr, Ti, Si } from './runtime';

const Ve = (s) => ({ andika: '"Andika", Verdana, sans-serif', grund: '"Playwrite DE Grund", Andika, sans-serif', druck: '"Andika", Verdana, sans-serif' })[s] ?? '"Andika", sans-serif';
var ze = [{ id: `andika`, family: `LH Andika`, label: `Andika`, hint: `f\xFCr Leseanf\xE4nger, einst\xF6ckiges a`, fallback: `Verdana, sans-serif` }, { id: `druck`, family: `LH Druckschrift`, label: `Druckschrift`, hint: `Grundschul-Druckschrift wie in Bayern (Gruschudru)`, fallback: `Andika, Verdana, sans-serif` }, { id: `grund`, family: `LH Grundschrift`, label: `Grundschrift`, hint: `wie in der Schule (Playwrite DE Grund)`, fallback: `Andika, Verdana, sans-serif` }, { id: `schreib`, family: `LH Schreibschrift`, label: `Schreibschrift VA`, hint: `verbundene Schrift (Vereinfachte Ausgangsschrift)`, fallback: `cursive` }, { id: `sas`, family: `LH Schreibschrift SAS`, label: `Schreibschrift SAS`, hint: `verbundene Schrift (Schulausgangsschrift, z. B. in Bayern)`, fallback: `cursive` }, { id: `lexend`, family: `LH Lexend`, label: `Lexend`, hint: `besonders leicht lesbar, weite Buchstaben`, fallback: `Verdana, sans-serif` }, { id: `nunito`, family: `LH Nunito`, label: `Nunito`, hint: `serifenlos, freundlich`, fallback: `system-ui, sans-serif` }, { id: `atkinson`, family: `LH Atkinson Hyperlegible`, label: `Atkinson`, hint: `barrierefrei, gut unterscheidbare Buchstaben`, fallback: `Verdana, sans-serif` }, { id: `merriweather`, family: `LH Merriweather`, label: `Merriweather`, hint: `mit Serifen, wie in B\xFCchern`, fallback: `Georgia, serif` }, { id: `caveat`, family: `LH Caveat`, label: `Handschrift`, hint: `locker wie mit dem Stift geschrieben`, fallback: `cursive` }, { id: `comic`, family: `LH Comic`, label: `Comic`, hint: `gro\xDFe Comic-Buchstaben (Bangers)`, fallback: `Impact, sans-serif` }];
function Be(e10) {
  return ze.find((t10) => t10.id === e10) ?? ze[0];
}
function referenceFamily(e10) {
  let t10 = Be(e10);
  return `"${t10.family}", ${t10.fallback}`;
}
var yp = [`andika`, `druck`, `grund`], Ite = `m a l o i s e r n u`, bp = [{ id: `lower`, label: `klein: mo la` }, { id: `upper`, label: `GROSS: MO LA` }, { id: `mixed`, label: `gemischt: Mo la` }], xp = /* @__PURE__ */ new Set([`a`, `e`, `i`, `o`, `u`, `\xE4`, `\xF6`, `\xFC`, `ei`, `au`, `eu`, `\xE4u`, `ie`]), Lte = [`sch`, `ch`, `ei`, `au`, `eu`, `\xE4u`, `ie`, `qu`, `pf`], Sp = /* @__PURE__ */ new Set([`\xDF`, `x`, `y`, `c`, `q`, `ch`]), Rte = /* @__PURE__ */ new Set([`m`, `n`, `l`, `r`, `s`, `t`, `f`, `k`, `p`, `sch`, `ch`]), Cp = new Set(`mama.papa.popo.pipi.kaka.pupu.hure.nazi.titi.fotze.pimmel.kacke.mist.sau.m\xF6se.pisse.kotze.nutte.tunte.homo.lusche.pussi.muschi.arsch.dumme.doofi.bulle`.split(`.`)), wp = /* @__PURE__ */ new Set([`fik`, `fuk`, `pis`, `kak`, `kot`, `hur`, `dum`, `fot`, `tit`, `puf`, `pup`, `sau`, `schis`, `schei`, `scheis`, `sex`, `nut`, `pim`, `m\xF6s`, `dof`]);
function Tp(e10) {
  let t10 = [];
  for (let n10 of e10.toLowerCase().split(/[^a-zäöüß]+/).filter(Boolean)) if (n10.length > 1 && Lte.includes(n10)) t10.push(n10);
  else for (let e11 of n10) t10.push(e11);
  return [...new Set(t10)];
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
var Bp = 1400, Vp = 990, qte = `#2563eb`, Jte = `#dc2626`, Hp = 116, Yte = 16, Xte = 22, Up = { k: 2, cx: 700, cy: 360 }, Wp = (e10) => e10.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`), Gp = (e10, t10) => Bp / 2 - (e10 * Hp + (e10 - 1) * Yte) / 2 + t10 * 132;
function Jp(e10) {
  let t10 = 0;
  for (let n10 of e10) `mwMW`.includes(n10) ? t10 += 0.88 : `ijlftrI`.includes(n10) ? t10 += 0.34 : n10 === n10.toUpperCase() && n10 !== n10.toLowerCase() ? t10 += 0.7 : t10 += 0.58;
  return Math.max(t10, 0.8);
}
var zh = { a: [`lang`, `kurz`], e: [`lang`, `kurz`], i: [`lang`, `kurz`], o: [`lang`, `kurz`], u: [`lang`, `kurz`], \u00E4: [`lang`, `kurz`], \u00F6: [`lang`, `kurz`], \u00FC: [`lang`, `kurz`], ch: [`wie in Buch`, `wie in Milch`], v: [`wie f`, `wie w`] }, Bh = /* @__PURE__ */ new Set([`a`, `e`, `i`, `o`, `u`, `\xE4`, `\xF6`, `\xFC`]), Vh = (e10, t10 = 1) => t10 === 2 ? `${e10}2` : e10, Hh = { a: `ah`, e: `eh`, i: `ieh`, o: `oh`, u: `uh`, \u00E4: `\xE4h`, \u00F6: `\xF6h`, \u00FC: `\xFCh`, ei: `ei`, au: `au`, eu: `oi`, \u00E4u: `oi`, ie: `ieh`, ai: `ei`, y: `\xFC`, m: `hm`, n: `n\xF6`, l: `l\xF6`, r: `r\xF6`, s: `s\xF6`, \u00DF: `s\xF6`, f: `f\xF6`, v: `f\xF6`, w: `w\xF6`, h: `h\xF6`, j: `j\xF6`, sch: `sch\xF6`, ch: `ach`, ng: `ing`, b: `b\xF6`, d: `d\xF6`, g: `g\xF6`, k: `k\xF6`, c: `k\xF6`, ck: `k\xF6`, p: `p\xF6`, t: `t\xF6`, qu: `kwoh`, x: `x\xF6`, z: `z\xF6`, tz: `z\xF6`, pf: `pf\xF6`, sp: `schp\xF6`, st: `scht\xF6` }, qne = { e: `\xE4`, ch: `ich`, v: `w\xF6` }, Uh = (e10, t10 = 1) => t10 === 2 ? qne[e10] ?? Hh[e10] ?? e10 : Hh[e10] ?? e10;
var E_ = (e10) => e10.replace(/\[([^\]\n]{1,40})\]/g, `$1`), D_ = 1400, O_ = 990, k_ = 50, Xre = 1190, A_ = { x: 1222, w: 150, top: 150, bottom: 952 }, j_ = { top: 178, bottom: 836 }, M_ = { top: 846, bottom: 962 }, N_ = 84, Zre = 100, Qre = 10, P_ = `'LH Nunito', Nunito, Verdana, sans-serif`, F_ = (e10) => e10.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/"/g, `&quot;`), I_ = (e10) => Math.round(e10 * 100) / 100, $re = { play: `<path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/>`, pause: `<rect x="6" y="5" width="4.2" height="14" rx="1.2" fill="currentColor"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2" fill="currentColor"/>`, reset: `<path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5M4.5 4v4.8h4.8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`, rec: `<circle cx="12" cy="12" r="7" fill="currentColor"/>`, stop: `<rect x="6" y="6" width="12" height="12" rx="2.2" fill="currentColor"/>`, tempo: `<path d="M8.5 21h7l-2.4-16.5h-2.2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 15.5l5.5-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="17.6" cy="7.4" r="1.6" fill="currentColor"/>`, auto: `<path d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M18.4 3v3.8h-3.8M5.6 21v-3.8h3.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 9.2v5.6l4.6-2.8z" fill="currentColor"/>`, hand: `<path d="M8.5 12V5.6a1.5 1.5 0 0 1 3 0V11M11.5 10.5V4.2a1.5 1.5 0 0 1 3 0v6.6M14.5 11V6a1.5 1.5 0 0 1 3 0v7.5c0 4.4-2.7 7.5-6.6 7.5-3.1 0-4.9-1.6-6-4.2L3.6 13a1.5 1.5 0 0 1 2.6-1.4l2.3 2.9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`, list: `<path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="4.5" cy="6" r="1.6" fill="currentColor"/><circle cx="4.5" cy="12" r="1.6" fill="currentColor"/><circle cx="4.5" cy="18" r="1.6" fill="currentColor"/>`, next: `<path d="M5 5l9.5 7L5 19z" fill="currentColor"/><rect x="16" y="5" width="3.2" height="14" rx="1.2" fill="currentColor"/>`, gap: `<path d="M4 5.5h16M4 18.5h16" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M4 12h2.5M10.75 12h2.5M17.5 12H20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>`, listen: `<path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><rect x="3" y="13.5" width="5" height="7.5" rx="1.8" fill="currentColor"/><rect x="16" y="13.5" width="5" height="7.5" rx="1.8" fill="currentColor"/>`, save: `<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`, check: `<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`, music: `<path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.6" fill="currentColor"/><circle cx="16.5" cy="16" r="2.6" fill="currentColor"/>`, close: `<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>` }, L_ = (e10, t10) => `<svg viewBox="0 0 24 24" width="${I_(t10)}" height="${I_(t10)}" aria-hidden="true">${$re[e10] ?? ``}</svg>`, R_ = null, z_ = /* @__PURE__ */ new Set();
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
@media (prefers-reduced-motion:reduce){.lh-ka-l{transition:opacity .2s,visibility 0s linear .2s}.lh-ka-l.is-cur,.lh-ka-l.is-next{transition:opacity .2s}.lh-ka-count,.lh-ka-card,.lh-ka-cd.is-beat{animation:none}.lh-ka.is-recording .lh-ka-btn.is-rec{animation:none}}`, Fv = `#1f2937`;
function Iv(e10, t10, n10, r10 = `#ced4da`) {
  let i10 = [0, 60, 120].map((r11) => {
    let i11 = Math.cos(r11 * Math.PI / 180) * (n10 - 9), a10 = Math.sin(r11 * Math.PI / 180) * (n10 - 9);
    return `<path d="M${(e10 - i11).toFixed(1)} ${(t10 - a10).toFixed(1)}L${(e10 + i11).toFixed(1)} ${(t10 + a10).toFixed(1)}" stroke="#868e96" stroke-width="3.5"/>`;
  }).join(``);
  return `<g class="lh-sy-wheel"><circle cx="${e10}" cy="${t10}" r="${n10}" fill="#343a40" stroke="${Fv}" stroke-width="4"/><circle cx="${e10}" cy="${t10}" r="${n10 - 9}" fill="${r10}" stroke="${Fv}" stroke-width="2.5"/>` + i10 + `<circle cx="${e10}" cy="${t10}" r="${Math.max(4, n10 * 0.18)}" fill="#495057" stroke="${Fv}" stroke-width="2.5"/></g>`;
}
var Lv = (e10, t10, n10) => `<path d="${e10}" fill="none" stroke="${t10}" stroke-width="${n10}" stroke-linecap="round" stroke-linejoin="round"/>`, Rv = [{ name: `Schubkarre`, gy: 150, seatW: 270, leave: `wobble`, back: `<path d="M-160 -22h320l-6 10h-308z" fill="#1b6e2c"/>` + Lv(`M-112 40L-262 -2`, `#8d5524`, 14) + Lv(`M-262 -2l-34 -8`, Fv, 18) + Lv(`M-90 46l-6 102M-60 46l-4 70`, `#495057`, 10) + Lv(`M-112 44L140 104`, `#495057`, 10), front: `<path d="M-168 -26h336l-44 74h-250z" fill="#2f9e44" stroke="${Fv}" stroke-width="5" stroke-linejoin="round"/><path d="M-150 -6h300" stroke="#8ce99a" stroke-width="6" stroke-linecap="round" opacity=".8"/>${Iv(146, 104, 46)}` }, { name: `Roller`, gy: 60, seatW: 220, leave: `drive`, back: Lv(`M182 34L152 -196`, `#adb5bd`, 13) + Lv(`M118 -198h66`, Fv, 15) + `<circle cx="118" cy="-198" r="9" fill="#e03131" stroke="${Fv}" stroke-width="3"/>`, front: `<rect x="-178" y="0" width="318" height="20" rx="10" fill="#e03131" stroke="${Fv}" stroke-width="4"/>` + Lv(`M138 12L184 34`, `#adb5bd`, 10) + Iv(-152, 37, 23, `#ffd43b`) + Iv(186, 37, 23, `#ffd43b`) }, { name: `Fahrrad`, gy: 170, seatW: 170, leave: `drive`, back: Iv(10, 110, 60) + Iv(286, 110, 60) + Lv(`M10 110L140 116L118 22M10 110L118 30M118 34L246 26L140 116M246 26L286 110`, `#1c7ed6`, 10) + Lv(`M96 12h46`, Fv, 12) + Lv(`M246 26l-8 -40l30 -6`, Fv, 9) + `<circle cx="140" cy="116" r="12" fill="#495057" stroke="${Fv}" stroke-width="3"/>` + Lv(`M140 116l18 22`, Fv, 7) + Lv(`M-84 0h170M-40 2L10 110M60 2L10 110`, `#495057`, 7), front: `` }, { name: `Schiff`, gy: 110, seatW: 320, leave: `sail`, back: Lv(`M214 -6V-270`, `#8d5524`, 10) + `<path d="M222 -262l100 160h-100z" fill="#fff" stroke="${Fv}" stroke-width="4" stroke-linejoin="round"/><path d="M214 -270l-52 14 52 16z" fill="#e03131" stroke="${Fv}" stroke-width="3" stroke-linejoin="round"/>`, front: `<path d="M-262 -14h560l-56 92h-440z" fill="#1971c2" stroke="${Fv}" stroke-width="5" stroke-linejoin="round"/><path d="M-252 4h540" stroke="#ffd43b" stroke-width="8"/>` + [-150, -50, 50, 150].map((e10) => `<circle cx="${e10}" cy="40" r="11" fill="#e7f5ff" stroke="${Fv}" stroke-width="3"/>`).join(``) + `<path d="M-340 92q30 -22 60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0v40h-720z" fill="#74c0fc" stroke="#1c7ed6" stroke-width="4" stroke-linejoin="round" opacity=".92"/>` }, { name: `Auto`, gy: 120, seatW: 300, leave: `drive`, back: `<path d="M150 60V-96q0 -14 14 -14h86q14 0 22 12l40 70h34q20 0 20 20v68z" fill="#f76707" stroke="${Fv}" stroke-width="5" stroke-linejoin="round"/><path d="M176 -92h66l34 58h-100z" fill="#d0ebff" stroke="${Fv}" stroke-width="4" stroke-linejoin="round"/><circle cx="352" cy="0" r="9" fill="#ffe066" stroke="${Fv}" stroke-width="3"/>`, front: `<path d="M-190 -24h340v84h-340z" fill="#fd7e14" stroke="${Fv}" stroke-width="5" stroke-linejoin="round"/><path d="M-176 -8h312" stroke="#ffc078" stroke-width="6" stroke-linecap="round"/><rect x="-206" y="44" width="28" height="18" rx="6" fill="#adb5bd" stroke="${Fv}" stroke-width="3"/>` + Iv(-110, 80, 40) + Iv(270, 80, 40) }, { name: `Flugzeug`, gy: 150, seatW: 260, leave: `fly`, flies: true, back: `<path d="M-290 6l-40 -104h52l70 104z" fill="#e03131" stroke="${Fv}" stroke-width="5" stroke-linejoin="round"/><path d="M10 20l70 -64h46l-30 64z" fill="#c92a2a" stroke="${Fv}" stroke-width="4" stroke-linejoin="round"/>`, front: Lv(`M-40 70v52M230 70v52`, `#495057`, 8) + Iv(-40, 130, 20) + Iv(230, 130, 20) + `<path d="M-300 6h560q70 0 70 38t-70 38h-500q-60 0 -60 -40z" fill="#f8f9fa" stroke="${Fv}" stroke-width="5" stroke-linejoin="round"/>` + [-200, -140, -80, -20, 40, 100].map((e10) => `<circle cx="${e10}" cy="34" r="10" fill="#74c0fc" stroke="${Fv}" stroke-width="3"/>`).join(``) + `<path d="M236 18h42q20 4 26 24h-68z" fill="#74c0fc" stroke="${Fv}" stroke-width="4" stroke-linejoin="round"/><path d="M-40 54h150l-90 74h-50z" fill="#e03131" stroke="${Fv}" stroke-width="5" stroke-linejoin="round"/><circle cx="332" cy="44" r="10" fill="#495057" stroke="${Fv}" stroke-width="3"/><g class="lh-sy-prop"><ellipse cx="338" cy="44" rx="7" ry="58" fill="#868e96" stroke="${Fv}" stroke-width="3" opacity=".85"/></g>` }, { name: `Rakete`, gy: 150, seatW: 240, leave: `rocket`, flies: true, back: `<g class="lh-sy-flame"><path d="M-252 14q-80 -10 -150 26q70 36 150 26z" fill="#ff922b"/><path d="M-252 26q-46 -4 -86 14q40 18 86 14z" fill="#ffe066"/></g><path d="M-200 0l-70 -64h56l70 64zM-200 80l-70 64h56l70 -64z" fill="#7048e8" stroke="${Fv}" stroke-width="5" stroke-linejoin="round"/>`, front: `<path d="M-256 0h470q90 0 130 40q-40 40 -130 40h-470z" fill="#e9ecef" stroke="${Fv}" stroke-width="5" stroke-linejoin="round"/><path d="M214 0q90 0 130 40q-40 40 -130 40z" fill="#e03131" stroke="${Fv}" stroke-width="5" stroke-linejoin="round"/><circle cx="160" cy="40" r="22" fill="#74c0fc" stroke="${Fv}" stroke-width="5"/><path d="M-256 24h460" stroke="#ced4da" stroke-width="5"/><rect x="-272" y="8" width="20" height="64" rx="6" fill="#495057" stroke="${Fv}" stroke-width="4"/>` }], zv = (e10) => Rv[(e10 % Rv.length + Rv.length) % Rv.length], Yie = `m l s f r n a o i e u`, Bv = /* @__PURE__ */ new Set([`m`, `n`, `l`, `r`, `s`, `\xDF`, `f`, `v`, `w`, `h`, `j`, `sch`, `ch`]), Vv = (e10) => {
  let t10 = e10.slice();
  for (let e11 = t10.length - 1; e11 > 0; e11--) {
    let n10 = Math.floor(Math.random() * (e11 + 1));
    [t10[e11], t10[n10]] = [t10[n10], t10[e11]];
  }
  return t10;
};
function Hv(e10) {
  let t10 = e10.filter((e11) => xp.has(e11)), n10 = e10.filter((e11) => !xp.has(e11) && !Sp.has(e11)), r10 = [];
  for (let e11 of n10) for (let n11 of t10) e11 === `qu` && n11 === `u` || wp.has(e11 + n11) || r10.push([e11, n11]);
  return r10;
}
function Uv(e10, t10) {
  let n10 = Vv(Hv(e10)), r10 = [], i10 = /* @__PURE__ */ new Set(), a10 = /* @__PURE__ */ new Set();
  for (let e11 of [0, 1, 2]) for (let o10 of n10) {
    if (r10.length >= t10) break;
    r10.includes(o10) || e11 === 0 && (i10.has(o10[0]) || a10.has(o10[1])) || e11 === 1 && i10.has(o10[0]) || (r10.push(o10), i10.add(o10[0]), a10.add(o10[1]), e11 === 1 && i10.size >= new Set(n10.map((e12) => e12[0])).size && i10.clear());
  }
  return Vv(r10);
}
function Wv(e10 = {}) {
  let t10 = e10.letters ?? `m l s f r n a o i e u`;
  return { letters: t10, case: e10.case ?? `lower`, font: e10.font ?? `andika`, syls: Uv(Tp(t10), 8), sound: e10.sound ?? false, read: e10.read ?? true };
}
var Gv = /^[a-zäöüß]{1,3}$/, Xie = /^[a-zäöüß]{2,6}$/;
function Kv(e10, t10, n10) {
  if (!e10 || typeof e10 != `object`) return;
  let r10 = {};
  for (let [i10, a10] of Object.entries(e10)) {
    let e11 = n10 ? n10(a10) : typeof a10 == `string` ? a10 : void 0;
    t10.test(i10) && e11 && (r10[i10] = e11);
  }
  return Object.keys(r10).length ? r10 : void 0;
}
function qv(e10, t10) {
  let n10 = e10 && typeof e10 == `object` ? e10 : {}, r10 = typeof n10.letters == `string` ? n10.letters.slice(0, 200) : Yie, i10 = (Array.isArray(n10.syls) ? n10.syls : []).filter((e11) => Array.isArray(e11) && e11.length === 2 && e11.every((e12) => typeof e12 == `string` && Gv.test(e12))).slice(0, 12).map((e11) => [e11[0], e11[1]]), a10 = { letters: r10, case: n10.case === `upper` || n10.case === `mixed` ? n10.case : `lower`, font: yp.includes(String(n10.font)) ? n10.font : `andika`, syls: i10.length ? i10 : Uv(Tp(r10), 8), sound: n10.sound === true, read: n10.read !== false, ...n10.tts === true ? { tts: true } : {} }, o10 = Kv(n10.sounds, Gv, t10);
  o10 && (a10.sounds = o10);
  let s10 = Kv(n10.voice, Xie, t10);
  s10 && (a10.voice = s10);
  let c10 = (Array.isArray(n10.say) ? n10.say : []).filter((e11) => Array.isArray(e11) && e11.length === 2 && typeof e11[0] == `string` && typeof e11[1] == `string` && !!e11[0].trim() && !!e11[1].trim()).slice(0, 40).map(([e11, t11]) => [e11.trim().toLowerCase().slice(0, 24), t11.trim().slice(0, 40)]);
  return c10.length && (a10.say = c10), a10;
}
var Jv = (e10) => [...Object.values(e10?.sounds ?? {}), ...Object.values(e10?.voice ?? {})];
function Zie(e10, t10) {
  for (let n10 of [e10.sounds, e10.voice]) if (n10) for (let e11 of Object.keys(n10)) n10[e11] = t10(n10[e11]);
}
var Yv = 1400, Xv = 990, Zv = `#2563eb`, Qie = `#1f2937`, Qv = 905, $v = 230, ey = 330, ty = 445, ny = 270, ry = 815, iy = 315, ay = 80, $ie = 12, eae = 26, oy = (e10) => e10.replace(/&/g, `&amp;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`), tae = (e10, t10) => Yv / 2 - (e10 * ay + (e10 - 1) * $ie) / 2 + t10 * 92;
function sy(e10) {
  let t10 = 0.6, n10 = 0.8;
  for (let [r10, i10] of e10.syls) t10 = Math.max(t10, Jp(Pp(r10, e10.case, true)), Jp(Pp(i10, e10.case, false))), n10 = Math.max(n10, Jp(Pp(r10 + i10, e10.case, true)));
  return Math.floor(Math.min(165, 186 / t10, 380 / n10));
}
function nae() {
  let e10 = `<defs><linearGradient id="lh-sy-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d0ebff"/><stop offset=".75" stop-color="#fff9db"/></linearGradient></defs>`;
  e10 += `<rect width="${Yv}" height="${Xv}" fill="url(#lh-sy-sky)"/>`;
  for (let [t10, n10, r10] of [[170, 230, 1], [1180, 250, 0.8], [980, 150, 0.6]]) e10 += `<g transform="translate(${t10} ${n10}) scale(${r10})" fill="#ffffff" opacity=".9"><ellipse cx="0" cy="0" rx="70" ry="30"/><ellipse cx="-42" cy="10" rx="44" ry="24"/><ellipse cx="46" cy="8" rx="50" ry="26"/></g>`;
  return e10 += `<path d="M0 820Q220 730 470 800T960 790T1400 770V880H0z" fill="#b2f2bb"/><path d="M0 850Q300 800 620 845T1400 830V890H0z" fill="#8ce99a"/>`, e10 += `<rect y="872" width="${Yv}" height="118" fill="#adb5bd"/><rect y="872" width="${Yv}" height="8" fill="#868e96"/>`, e10 += `<path d="M20 940H${Yv}" stroke="#ffffff" stroke-width="8" stroke-dasharray="70 50"/>`, e10;
}
function rae(e10, t10, n10, r10) {
  let i10 = e10.syls.length, a10 = ``, o10 = Math.min(46, r10 * 0.36);
  for (let r11 = 0; r11 < i10; r11++) {
    let s10 = tae(i10, r11), c10 = r11 < t10;
    if (a10 += `<rect x="${s10}" y="${eae}" width="${ay}" height="${ay}" rx="18" fill="#ffffff" fill-opacity="${c10 ? 0.95 : 0.55}" stroke="${c10 ? `#f59f00` : `#adb5bd`}" stroke-width="4"${c10 ? `` : ` stroke-dasharray="9 7"`}/>`, c10) {
      let [t11, i11] = e10.syls[r11];
      a10 += `<text x="${s10 + ay / 2}" y="${66 + o10 * 0.36}" font-size="${o10.toFixed(1)}" font-family="${n10}" font-weight="700" text-anchor="middle" fill="${Zv}">${oy(Pp(t11 + i11, e10.case, true))}</text>`;
    } else a10 += `<text x="${s10 + ay / 2}" y="81" font-size="42" font-family="Verdana, sans-serif" font-weight="700" text-anchor="middle" fill="#ced4da">?</text>`;
  }
  return a10;
}
function cy(e10, t10, n10, r10, i10, a10) {
  return `<rect x="${e10 - $v / 2}" y="${ey}" width="${$v}" height="${$v}" rx="34" fill="${n10}" stroke="${r10}" stroke-width="7"/><text x="${e10}" y="${ty + a10 * 0.36}" font-size="${a10}" font-family="${i10}" font-weight="700" text-anchor="middle" fill="${Qie}">${oy(t10)}</text>`;
}
var ly = (e10, t10, n10 = 700, r10 = 1) => {
  let i10 = zv(e10);
  return `<g transform="translate(${n10} ${Qv - i10.gy * r10})${r10 === 1 ? `` : ` scale(${r10})`}">${i10[t10]}</g>`;
};
function iae(e10, t10, n10, r10, i10, a10) {
  let [o10, s10] = e10.syls[t10], c10 = Pp(o10, e10.case, true), l10 = Pp(s10, e10.case, false), u10 = `transform:translate(-1600px,${zv(i10).flies ? -280 : 0}px)`, d10 = ``;
  return d10 += `<g class="lh-sy-hint"><text x="${Yv / 2}" y="256" font-size="46" font-family="Verdana, sans-serif" font-weight="700" text-anchor="middle" fill="#495057">Zieh das <tspan font-family="${n10}" fill="#e8590c" font-size="58">${oy(c10)}</tspan> zum <tspan font-family="${n10}" fill="#1c7ed6" font-size="58">${oy(l10)}</tspan>!</text><g class="lh-sy-arrow"><path d="M411 ${ty}H${ry - $v / 2 - 40}" stroke="#f59f00" stroke-width="10" stroke-linecap="round" stroke-dasharray="4 22"/><path d="M${ry - $v / 2 - 54} 419l30 26-30 26" fill="none" stroke="#f59f00" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g></g>`, d10 += `<g class="lh-sy-go">`, a10 && (d10 += `<g class="lh-sy-veh" style="${u10}">${ly(i10, `back`)}</g>`), d10 += `<g class="lh-sy-card"><g class="lh-sy-pair"><g class="lh-sy-trail"></g>`, d10 += `<g class="lh-sy-right">${cy(ry, l10, `#e7f5ff`, `#1c7ed6`, n10, r10)}</g>`, d10 += `<g class="lh-key lh-sy-pull" data-a="pull"><g class="lh-sy-pullin">${cy(ny, c10, `#fff3bf`, `#f59f00`, n10, r10)}<path d="M248 534h44M248 544h44" stroke="#f59f00" stroke-width="5" stroke-linecap="round"/><rect class="lh-kdown" x="${ny - $v / 2}" y="${ey}" width="${$v}" height="${$v}" rx="34" fill="#000000" opacity="0"/></g><title>${oy(`${c10} zum ${l10} ziehen`)}</title></g>`, d10 += `</g>`, d10 += `<g class="lh-sy-merged" opacity="0"><rect x="470" y="${ey}" width="460" height="${$v}" rx="38" fill="#ffffff" stroke="${Zv}" stroke-width="8"/><text x="${Yv / 2}" y="${ty + r10 * 0.36}" font-size="${r10}" font-family="${n10}" font-weight="700" text-anchor="middle" fill="${Zv}">${oy(Pp(o10 + s10, e10.case, true))}</text></g>`, d10 += `</g>`, a10 && (d10 += `<g class="lh-sy-vfront" style="${u10}">${ly(i10, `front`)}</g>`), d10 += `</g>`, d10;
}
var aae = () => (/* @__PURE__ */ new Date()).toLocaleDateString(`de-DE`, { day: `numeric`, month: `long`, year: `numeric` });
function oae(e10, t10, n10, r10) {
  let i10 = e10.syls.length, a10 = i10 <= 4 ? i10 : i10 <= 8 ? 4 : Math.ceil(i10 / 3), o10 = Math.ceil(i10 / a10), s10 = Math.min(240, 1e3 / a10), c10 = o10 === 1 ? 300 : o10 === 2 ? 220 : 160, l10 = `<rect width="${Yv}" height="${Xv}" fill="#212529" opacity="0.35"/><g class="lh-sy-cert">`;
  l10 += `<rect x="150" y="60" width="1100" height="870" rx="44" fill="#fffdf5" stroke="#f59f00" stroke-width="12"/>`, l10 += `<rect x="180" y="90" width="1040" height="810" rx="30" fill="none" stroke="#ffd43b" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round"/>`, l10 += `<text x="700" y="190" font-size="100" font-family="Verdana, sans-serif" font-weight="700" text-anchor="middle" fill="#e8590c">Urkunde</text>`;
  let u10 = `Super! Du hast ${i10 === 1 ? `die Silbe` : `alle ${i10} Silben`} verbunden.`;
  l10 += `<text x="700" y="255" font-size="${Math.min(40, Math.floor(1e3 / (0.64 * u10.length)))}" font-family="${n10}" font-weight="700" text-anchor="middle" fill="#495057">${u10}</text>`;
  let d10 = Math.min(c10 * 0.42, s10 * 0.36, 84);
  for (let r11 = 0; r11 < i10; r11++) {
    let o11 = Math.floor(r11 / a10), u11 = Math.min(a10, i10 - o11 * a10), f10 = r11 - o11 * a10, p10 = 700 - u11 * s10 / 2 + f10 * s10 + s10 / 2, m10 = 290 + o11 * c10, [h10, g10] = e10.syls[r11], _10 = zv(t10[r11] ?? r11), v10 = Math.min(s10 * 0.8 / 720, c10 * 0.42 / 330);
    l10 += `<g class="lh-sy-certitem" data-i="${r11}">`, l10 += `<text x="${p10}" y="${m10 + d10 * 0.95}" font-size="${d10.toFixed(1)}" font-family="${n10}" font-weight="700" text-anchor="middle" fill="${Zv}">${oy(Pp(h10 + g10, e10.case, true))}</text>`, l10 += `<g transform="translate(${p10} ${m10 + c10 - 18 - _10.gy * v10}) scale(${v10.toFixed(3)})">${_10.back}${_10.front}</g></g>`;
  }
  return l10 += `<text x="700" y="${r10 ? 812 : 870}" font-size="30" font-family="Verdana, sans-serif" text-anchor="middle" fill="#868e96">am ${aae()}</text>`, r10 && (l10 += `<g class="lh-key" data-a="again"><rect x="540" y="832" width="320" height="76" rx="38" fill="#1c7ed6"/><text x="700" y="883" font-size="40" font-family="Verdana, sans-serif" font-weight="700" text-anchor="middle" fill="#ffffff">Nochmal</text><rect class="lh-kdown" x="540" y="832" width="320" height="76" rx="38" fill="#000000" opacity="0"/><title>Nochmal von vorn</title></g>`), l10 + `</g>`;
}
function uy(e10, t10, n10, r10, i10 = Yv, a10 = Xv) {
  let o10 = e10.syls.length, s10 = Ve(e10.font).replace(/"/g, `'`), c10 = sy(e10), l10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Yv} ${Xv}" width="${i10}" height="${a10}">${nae()}`;
  return l10 += rae(e10, Math.min(t10, o10), s10, c10), n10 || (l10 += `<g opacity=".95">${ly(4, `back`, 1090, 0.62)}${ly(4, `front`, 1090, 0.62)}</g>`), l10 += t10 < o10 ? iae(e10, t10, s10, c10, r10[t10] ?? 0, n10) : oae(e10, r10, s10, n10), l10 + `</svg>`;
}
var dy = /* @__PURE__ */ new Map();
function fy(e10) {
  let t10 = [];
  for (; t10.length < e10; ) {
    let e11 = Vv(Rv.map((e12, t11) => t11));
    t10.length && e11[0] === t10[t10.length - 1] && (e11 = [...e11.slice(1), e11[0]]), t10.push(...e11);
  }
  return t10.slice(0, e10);
}
var py = (e10, t10) => {
  let n10 = dy.get(e10);
  return (!n10 || n10.rides.length < t10) && dy.set(e10, n10 = { at: n10?.at ?? 0, busy: false, rides: fy(t10), token: (n10?.token ?? 0) + 1 }), n10;
}, my = /* @__PURE__ */ new Map(), hy = /* @__PURE__ */ new Map(), gy = /* @__PURE__ */ new Map(), _y = /* @__PURE__ */ new Set(), vy = /* @__PURE__ */ new WeakSet();
function yy(e10) {
  let t10 = dy.get(e10);
  dy.set(e10, { at: 0, busy: false, rides: fy(my.get(e10)?.synth?.syls.length ?? 12), token: (t10?.token ?? 0) + 1 }), dc(), qr(), by(e10);
}
function sae() {
  for (let e10 of dy.values()) e10.busy && (e10.busy = false, e10.token++);
  qr();
}
function by(e10) {
  document.querySelectorAll(`.lh-wg-synth.is-live`).forEach((t10) => {
    if (t10.dataset.synthId !== e10) return;
    let n10 = my.get(e10);
    n10 && (delete t10.dataset.k, jy(t10, n10, true, {}));
  });
}
var xy = (e10) => new Promise((t10) => setTimeout(t10, e10));
function Sy(e10, t10, n10) {
  if (!e10 || typeof e10.animate != `function`) return Promise.resolve();
  try {
    return e10.animate(t10, { fill: `forwards`, ...n10 }).finished.then(() => void 0, () => void 0);
  } catch {
    return Promise.resolve();
  }
}
function Cy(e10, t10, n10, r10, i10, a10) {
  let o10 = Vr();
  if (!o10) return;
  let s10 = o10.currentTime + t10, c10 = o10.createOscillator(), l10 = o10.createGain();
  c10.type = r10, c10.frequency.setValueAtTime(e10, s10), a10 && c10.frequency.exponentialRampToValueAtTime(a10, s10 + n10), l10.gain.setValueAtTime(1e-4, s10), l10.gain.exponentialRampToValueAtTime(i10, s10 + 0.012), l10.gain.exponentialRampToValueAtTime(1e-4, s10 + n10), c10.connect(l10).connect(o10.destination), c10.start(s10), c10.stop(s10 + n10 + 0.05);
}
function cae(e10 = 0.9) {
  let t10 = Vr();
  if (!t10) return;
  let n10 = Math.floor(t10.sampleRate * e10), r10 = t10.createBuffer(1, n10, t10.sampleRate), i10 = r10.getChannelData(0);
  for (let e11 = 0; e11 < n10; e11++) i10[e11] = Math.random() * 2 - 1;
  let a10 = t10.createBufferSource();
  a10.buffer = r10;
  let o10 = t10.createBiquadFilter();
  o10.type = `bandpass`, o10.Q.value = 1.2;
  let s10 = t10.currentTime;
  o10.frequency.setValueAtTime(300, s10), o10.frequency.exponentialRampToValueAtTime(2600, s10 + e10);
  let c10 = t10.createGain();
  c10.gain.setValueAtTime(1e-4, s10), c10.gain.exponentialRampToValueAtTime(0.22, s10 + e10 * 0.4), c10.gain.exponentialRampToValueAtTime(1e-4, s10 + e10), a10.connect(o10).connect(c10).connect(t10.destination), a10.start(s10);
}
var lae = () => Cy(520, 0, 0.16, `sine`, 0.25, 1050);
function uae(e10, t10) {
  t10 === `Auto` ? (Cy(440, 0, 0.16, `square`, 0.08), Cy(440, 0.22, 0.2, `square`, 0.08)) : t10 === `Fahrrad` ? (Cy(2350, 0, 0.5, `sine`, 0.16), Cy(2350, 0.18, 0.6, `sine`, 0.14)) : e10 === `sail` ? Cy(150, 0, 0.9, `sawtooth`, 0.07) : e10 === `fly` || e10 === `rocket` ? cae(e10 === `rocket` ? 1.1 : 1.4) : Cy(300, 0, 0.12, `triangle`, 0.12, 520);
}
var dae = { drive: { frames: [{ transform: `translate(0px,0px)` }, { transform: `translate(1500px,0px)` }], ms: 1700, easing: `cubic-bezier(.45,0,.85,.55)` }, wobble: { frames: [{ transform: `translate(0px,0px) rotate(0deg)` }, { transform: `translate(320px,-8px) rotate(-2.5deg)`, offset: 0.25 }, { transform: `translate(680px,0px) rotate(2.5deg)`, offset: 0.5 }, { transform: `translate(1060px,-8px) rotate(-2.5deg)`, offset: 0.75 }, { transform: `translate(1500px,0px) rotate(0deg)` }], ms: 2100, easing: `ease-in` }, sail: { frames: [{ transform: `translate(0px,0px) rotate(0deg)` }, { transform: `translate(360px,-12px) rotate(-1.5deg)`, offset: 0.25 }, { transform: `translate(740px,4px) rotate(1.5deg)`, offset: 0.5 }, { transform: `translate(1120px,-12px) rotate(-1.5deg)`, offset: 0.75 }, { transform: `translate(1520px,0px) rotate(0deg)` }], ms: 2500, easing: `ease-in` }, fly: { frames: [{ transform: `translate(0px,0px) rotate(0deg)` }, { transform: `translate(380px,0px) rotate(0deg)`, offset: 0.35 }, { transform: `translate(700px,-70px) rotate(-9deg)`, offset: 0.55 }, { transform: `translate(1500px,-780px) rotate(-14deg)` }], ms: 2300, easing: `ease-in` }, rocket: { frames: [{ transform: `translate(0px,0px) rotate(0deg)` }, { transform: `translate(-26px,5px) rotate(0deg)`, offset: 0.12 }, { transform: `translate(-16px,-5px) rotate(-2deg)`, offset: 0.22 }, { transform: `translate(1700px,-920px) rotate(-20deg)` }], ms: 1700, easing: `cubic-bezier(.6,0,.9,.45)` } };
function wy(e10, t10, n10) {
  let r10 = t10.sounds?.[n10] ? hy.get(e10)?.[t10.sounds[n10]] : void 0, i10 = r10 ? gy.get(e10)?.(r10) ?? r10.dataUrl : void 0;
  i10 ? Ty(i10) : lc(Uh(n10));
}
var Ty = (e10) => Vr()?.state === `running` ? Kr(e10) : lc(``, e10);
function Ey(e10, t10, n10) {
  let r10 = !t10.tts && t10.voice?.[n10] ? hy.get(e10)?.[t10.voice[n10]] : void 0, i10 = r10 ? gy.get(e10)?.(r10) ?? r10.dataUrl : void 0;
  return i10 ? Ty(i10) : lc(Rp(n10, t10.say));
}
var fae = (e10, t10) => Promise.race([e10, xy(t10)]);
async function Dy(e10, t10) {
  let n10 = my.get(t10)?.synth;
  if (!n10) return;
  let r10 = py(t10, n10.syls.length);
  if (r10.busy || r10.at >= n10.syls.length) return;
  r10.busy = true;
  let i10 = r10.token, a10 = () => dy.get(t10)?.token !== i10, [o10, s10] = n10.syls[r10.at], c10 = zv(r10.rides[r10.at] ?? 0), l10 = e10.querySelector(`svg`);
  if (!l10) return;
  lae(), e10.classList.add(`is-joined`);
  let u10 = n10.read ? fae(xy(250).then(() => Ey(t10, n10, o10 + s10)), 3200) : Promise.resolve();
  if (await xy(650), a10()) return;
  e10.classList.add(`is-moving`);
  let d10 = [{ transform: `translate(-1600px,${c10.flies ? -280 : 0}px)` }, { transform: `translate(0px,0px)` }], f10 = { duration: 1150, easing: `cubic-bezier(.2,.75,.3,1)` };
  if (await Promise.all([Sy(l10.querySelector(`.lh-sy-veh`), d10, f10), Sy(l10.querySelector(`.lh-sy-vfront`), d10, f10)]), e10.classList.remove(`is-moving`), await u10, a10()) return;
  let p10 = Math.min(1, c10.seatW / 460), m10 = Qv - c10.gy - 560;
  if (await Sy(l10.querySelector(`.lh-sy-card`), [{ transform: `translate(0px,0px) scale(1)` }, { transform: `translate(0px,${m10}px) scale(${p10})` }], { duration: 480, easing: `cubic-bezier(.45,0,.6,1.35)` }), a10()) return;
  await xy(250), uae(c10.leave, c10.name), e10.classList.add(`is-moving`);
  let h10 = dae[c10.leave];
  await Sy(l10.querySelector(`.lh-sy-go`), h10.frames, { duration: h10.ms, easing: h10.easing }), e10.classList.remove(`is-moving`), a10() || (r10.busy = false, r10.at++, e10.classList.remove(`is-joined`), _y.add(t10), by(t10), r10.at >= n10.syls.length && (vi(), pae(t10, i10)));
}
async function pae(e10, t10) {
  let n10 = my.get(e10)?.synth;
  if (!n10) return;
  let r10 = () => dy.get(e10)?.token === t10;
  if (await xy(700), r10() && (await lc(n10.syls.length === 1 ? `Super! Du hast die Silbe verbunden.` : `Super! Du hast alle Silben verbunden.`), n10.read)) for (let t11 = 0; t11 < n10.syls.length; t11++) {
    if (await xy(t11 ? 300 : 500), !r10()) return;
    let i10 = (n11) => document.querySelectorAll(`.lh-wg-synth.is-live[data-synth-id="${e10}"] .lh-sy-certitem[data-i="${t11}"]`).forEach((e11) => e11.classList.toggle(`is-saying`, n11));
    i10(true), await Ey(e10, n10, n10.syls[t11][0] + n10.syls[t11][1]), i10(false);
  }
}
function Oy(e10, t10, n10, r10) {
  let i10 = e10.querySelector(`.lh-sy-trail`);
  if (!i10) return;
  let a10 = t10.syls[n10]?.[0];
  if (!a10 || !Bv.has(a10)) return;
  let o10 = sy(t10) * 0.5, s10 = Ve(t10.font).replace(/"/g, `'`), c10 = oy(Pp(a10, t10.case, true)), l10 = Math.max(46, Jp(Pp(a10, t10.case, true)) * o10 + 12), u10 = ny + r10 - $v * 0.42, d10 = Math.max(0, Math.floor((u10 - ny) / l10) + 1), f10 = ``;
  for (let e11 = 0; e11 < d10; e11++) {
    let t11 = ny + e11 * l10;
    f10 += `<text x="${t11.toFixed(1)}" y="${ty + o10 * 0.36}" font-size="${o10.toFixed(1)}" font-family="${s10}" font-weight="700" text-anchor="middle" fill="#f59f00" opacity="${(0.22 + 0.5 * (e11 + 1) / Math.max(1, d10)).toFixed(2)}">${c10}</text>`;
  }
  i10.innerHTML !== f10 && (i10.innerHTML = f10);
}
var ky = (e10, t10) => {
  let n10 = e10.querySelector(`.lh-sy-pull`);
  n10 && (n10.style.transform = t10 ? `translate(${t10.toFixed(1)}px,0px)` : ``);
};
async function mae(e10, t10, n10, r10) {
  if (!e10.querySelector(`.lh-sy-pull`)) return;
  let i10 = performance.now(), a10 = 260 + r10;
  await new Promise((o10) => {
    let s10 = () => {
      let c10 = Math.min(1, (performance.now() - i10) / a10), l10 = r10 * (1 - c10) * (1 - c10);
      ky(e10, l10), Oy(e10, t10, n10, l10), c10 < 1 ? requestAnimationFrame(s10) : o10();
    };
    requestAnimationFrame(s10);
  }), e10.closest(`.lh-wg-synth`)?.classList.remove(`is-pulling`);
}
async function hae(e10, t10) {
  let n10 = my.get(t10)?.synth, r10 = e10.querySelector(`svg`);
  if (!n10 || !r10) return;
  let i10 = py(t10, n10.syls.length);
  if (i10.busy || i10.at >= n10.syls.length) return;
  e10.classList.add(`is-pulling`), n10.sound && wy(t10, n10, n10.syls[i10.at][0]);
  let a10 = performance.now(), o10 = i10.at;
  await new Promise((e11) => {
    let t11 = () => {
      let i11 = Math.min(1, (performance.now() - a10) / 1400), s10 = iy * (i11 * i11 * (3 - 2 * i11));
      ky(r10, s10), Oy(r10, n10, o10, s10), i11 < 1 ? requestAnimationFrame(t11) : e11();
    };
    requestAnimationFrame(t11);
  }), Dy(e10, t10);
}
function gae(e10) {
  vy.has(e10) || (vy.add(e10), e10.addEventListener(`pointerdown`, (t10) => {
    if (t10.button > 0 || !t10.target.closest?.(`.lh-sy-pull`) || !Ti(e10)) return;
    let n10 = e10.dataset.synthId ?? ``, r10 = my.get(n10)?.synth, i10 = e10.querySelector(`svg`);
    if (!r10 || !i10) return;
    let a10 = py(n10, r10.syls.length);
    if (a10.busy || a10.at >= r10.syls.length) return;
    Ay = true, pi();
    let o10 = a10.at, s10 = Yv / Math.max(1, i10.getBoundingClientRect().width), c10 = t10.clientX, l10 = 0, u10 = false, d10 = false, f10 = () => {
      window.removeEventListener(`pointermove`, p10), window.removeEventListener(`pointerup`, m10, true), window.removeEventListener(`pointercancel`, m10, true);
    }, p10 = (a11) => {
      a11.pointerId !== t10.pointerId || d10 || (l10 = Math.max(0, Math.min(iy, (a11.clientX - c10) * s10)), !u10 && l10 > 10 && (u10 = true, e10.classList.add(`is-pulling`), r10.sound && wy(n10, r10, r10.syls[o10][0])), ky(i10, l10), Oy(i10, r10, o10, l10), l10 >= 313 && (d10 = true, f10(), Dy(e10, n10)));
    }, m10 = (a11) => {
      if (pi(), !(a11.pointerId !== t10.pointerId || d10)) {
        if (d10 = true, f10(), l10 >= 265) ky(i10, iy), Oy(i10, r10, o10, iy), Dy(e10, n10);
        else if (u10) mae(i10, r10, o10, l10);
        else {
          let e11 = i10.querySelector(`.lh-sy-pullin`);
          e11?.classList.remove(`is-wiggle`), e11?.getBBox?.(), e11?.classList.add(`is-wiggle`);
        }
      }
    };
    window.addEventListener(`pointermove`, p10), window.addEventListener(`pointerup`, m10, true), window.addEventListener(`pointercancel`, m10, true);
  }, true));
}
var Ay = false;
function jy(e10, t10, n10, r10) {
  let i10 = t10.synth ?? Wv(), a10 = Math.max(1, Math.round(t10.w)), o10 = Math.max(1, Math.round(t10.h));
  r10.assets && hy.set(t10.id, r10.assets), r10.assetUrl && gy.set(t10.id, r10.assetUrl);
  let s10 = n10 ? py(t10.id, i10.syls.length) : null, c10 = s10 ? Math.min(s10.at, i10.syls.length) : 0, l10 = `${a10}x${o10}|${n10}|${JSON.stringify(i10)}|${c10}|${s10?.token ?? 0}`;
  if (e10.dataset.k === l10) return;
  if (e10.dataset.k = l10, e10.setAttribute(`aria-label`, My(t10)), !n10) {
    let t11 = uy(i10, 0, false, [], a10, o10), n11 = document.createElement(`img`);
    n11.className = `lh-wg-pic`, n11.alt = ``, n11.draggable = false, n11.src = r10.stickerUrl ? r10.stickerUrl(t11) : `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(t11), n11.style.width = `${a10}px`, n11.style.height = `${o10}px`, e10.replaceChildren(n11);
    return;
  }
  my.set(t10.id, t10), e10.dataset.synthId = t10.id, e10.classList.remove(`is-joined`, `is-moving`, `is-pulling`);
  let u10 = document.createElement(`div`);
  u10.className = `lh-wg-pic`, u10.innerHTML = uy(i10, c10, true, s10?.rides ?? [], a10, o10).replace(/ width="[\d.]+" height="[\d.]+"/, ` width="100%" height="100%"`), e10.replaceChildren(u10), _y.delete(t10.id) && u10.querySelector(`.lh-sy-card`)?.classList.add(`is-new`), t10.locked && e10.classList.add(`is-armed`), gae(e10), Si(e10, { slide: false, hit: (t11) => {
    let n11 = e10.dataset.synthId ?? ``, r11 = t11.getAttribute(`data-a`);
    return r11 === `pull` ? Ay ? Ay = false : hae(e10, n11) : r11 === `again` && yy(n11), null;
  } });
}
function My(e10) {
  let t10 = e10.synth;
  if (!t10) return `Silben verbinden`;
  let n10 = t10.syls.length;
  return `Silben verbinden: ${n10 === 1 ? `eine Silbe` : `${n10} Silben`} \u2013 zieh den ersten Buchstaben zum zweiten.`;
}
var _ae = `
.lh-wg-synth .lh-sy-card{transform-box:view-box;transform-origin:${Yv / 2}px 560px}
.lh-wg-synth .lh-sy-card.is-new{animation:lh-sy-pop .5s cubic-bezier(.3,1.5,.5,1)}
.lh-wg-synth .lh-sy-go{transform-box:view-box;transform-origin:${Yv / 2}px ${Qv}px}
.lh-wg-synth .lh-sy-pull{cursor:grab}
.lh-wg-synth.is-pulling .lh-sy-pull{cursor:grabbing}
.lh-wg-synth .lh-sy-pullin{transform-box:view-box;transform-origin:${ny}px ${ty}px}
.lh-wg-synth .lh-sy-pullin.is-wiggle{animation:lh-sy-wiggle .6s ease-in-out}
.lh-wg-synth .lh-sy-merged{opacity:0;transform-box:view-box;transform-origin:${Yv / 2}px ${ty}px;pointer-events:none}
.lh-wg-synth.is-joined .lh-sy-merged{opacity:1;animation:lh-sy-pop .4s cubic-bezier(.3,1.6,.5,1)}
.lh-wg-synth .lh-sy-pair{transition:opacity .25s}
.lh-wg-synth.is-joined .lh-sy-pair{opacity:0}
.lh-wg-synth .lh-sy-hint{transition:opacity .3s}
.lh-wg-synth.is-pulling .lh-sy-hint,.lh-wg-synth.is-joined .lh-sy-hint{opacity:0}
.lh-wg-synth .lh-sy-arrow{animation:lh-sy-nudge 1.6s ease-in-out infinite}
.lh-wg-synth .lh-sy-wheel,.lh-wg-synth .lh-sy-prop{transform-box:fill-box;transform-origin:center}
.lh-wg-synth.is-moving .lh-sy-wheel{animation:lh-sy-spin .42s linear infinite}
.lh-wg-synth .lh-sy-prop{animation:lh-sy-prop .14s linear infinite alternate}
.lh-wg-synth .lh-sy-flame{transform-box:fill-box;transform-origin:right center;animation:lh-sy-flame .18s ease-in-out infinite alternate}
.lh-wg-synth .lh-sy-cert{transform-box:view-box;transform-origin:700px 495px;animation:lh-sy-pop .6s cubic-bezier(.3,1.4,.5,1)}
.lh-wg-synth .lh-sy-certitem{transform-box:fill-box;transform-origin:center;transition:transform .25s}
.lh-wg-synth .lh-sy-certitem.is-saying{transform:scale(1.15)}
@keyframes lh-sy-pop{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes lh-sy-wiggle{0%,100%{transform:translateX(0)}20%{transform:translateX(18px)}40%{transform:translateX(-8px)}60%{transform:translateX(14px)}80%{transform:translateX(-4px)}}
@keyframes lh-sy-nudge{0%,100%{transform:translateX(0);opacity:.65}50%{transform:translateX(16px);opacity:1}}
@keyframes lh-sy-spin{to{transform:rotate(360deg)}}
@keyframes lh-sy-prop{from{transform:scaleY(1)}to{transform:scaleY(.12)}}
@keyframes lh-sy-flame{from{transform:scaleX(.8)}to{transform:scaleX(1.12)}}
@media (prefers-reduced-motion:reduce){.lh-wg-synth .lh-sy-arrow,.lh-wg-synth .lh-sy-prop,.lh-wg-synth .lh-sy-flame{animation:none}}`, vae = [{ id: `none`, label: `Nur das Bild` }, { id: `dots`, label: `Punkte (einer je Silbe)` }, { id: `word`, label: `Wort in Silbenschrift` }], Ny = /^[A-Za-zÄÖÜäöüß]{1,30}$/;
export const renderSynth = jy;
export const makeSynth = Wv;
export const cleanSynth = qv;
export const pickSyllables = Uv;
export const syllablePairs = Hv;
export const stretchable = Bv;
export const splitLetters = Tp;
export const casing = Pp;
export const sayPart = Rp;
export const SYNTH_CSS = _ae;
export const stopSynth = sae;
