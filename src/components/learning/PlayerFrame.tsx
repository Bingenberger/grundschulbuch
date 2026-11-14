'use client';
// The frame in which the players of Textsachen, Schiebesachen and Quizsachen run, built
// like the one of Lernsachen-Heft: player script, task, last state, fitting the
// exercise into the frame; changes and results come back as messages.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type PlayerKind = 'TSPlayer' | 'DnDPlayer' | 'QuizPlayer';
const STATE = 'grundschulbuch-player-state', RESULT = 'grundschulbuch-player-result';

const scripts: Partial<Record<PlayerKind, Promise<string>>> = {};
export const loadPlayer = (kind: PlayerKind) =>
  (scripts[kind] ??= kind === 'TSPlayer'
    ? import('@/lib/reference/textsachen-player').then((m) => m.TSPLAYER)
    : kind === 'QuizPlayer'
      ? import('@/lib/reference/quizsachen-player').then((m) => m.QUIZPLAYER)
      : import('@/lib/reference/schiebesachen-player').then((m) => m.DNDPLAYER));

const pictures = new Map<string, Promise<string | null>>();
/** Pictures go into the task as data addresses, as in a file saved by the apps. */
export function dataUrl(src: string) {
  if (src.startsWith('data:')) return Promise.resolve(src);
  let found = pictures.get(src);
  if (!found) {
    found = fetch(src)
      .then((r) => (r.ok ? r.blob() : null))
      .then((blob) => blob && new Promise<string>((done, fail) => { const reader = new FileReader(); reader.onload = () => done(String(reader.result)); reader.onerror = fail; reader.readAsDataURL(blob); }))
      .catch(() => null);
    pictures.set(src, found);
  }
  return found;
}

/** The page's own fonts under the names a player asks for (“TS Andika”, “DnD Nunito” …). */
export function aliasFonts(names: Record<string, string>) {
  let css = '';
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const rule of Array.from(rules)) {
        if (!(rule instanceof CSSFontFaceRule)) continue;
        const family = rule.style.getPropertyValue('font-family').replace(/["']/g, '').trim();
        for (const [alias, ours] of Object.entries(names)) if (ours === family) css += rule.cssText.replace(/font-family:[^;]+;/, `font-family: "${alias}";`) + '\n';
      }
    }
  } catch {}
  return css;
}

const json = (v: unknown) => JSON.stringify(v).replace(/\x3c/g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
const script = (js: string) => js.replace(/\x3c\/(script)/gi, '\x3c\\/$1').replace(/\x3c!--/g, '\x3c\\x21--');

/** The frame page of Lernsachen-Heft: mount the player, fit it into the frame. */
export function framePage({ kind, task, state, js, fonts, font }: { kind: PlayerKind; task: unknown; state: unknown; js: string; fonts: string; font: string }) {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${fonts}
html,body{margin:0;padding:0;height:100%;background:#fff;color:#1f2937;overflow-x:hidden;overflow-y:auto}
body{font-family:"${font}",system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-text-size-adjust:100%}
*,*::before,*::after{box-sizing:border-box}
#lh-root{padding:10px 14px}
.lh-error{margin:16px;padding:16px;border-radius:10px;background:#fee2e2;color:#b91c1c;font-size:20px}
</style>
</head>
<body>
<div id="lh-root"></div>
<script type="application/json" id="lh-data">${json(task)}</script>
<script type="application/json" id="lh-state">${json(state ?? null)}</script>
<script>
${script(js)}
</script>
<script>
(function(){var r=document.getElementById('lh-root'),j=function(id){return JSON.parse(document.getElementById(id).textContent)};try{window[${JSON.stringify(kind)}].mount(r,j('lh-data'),{noFullscreen:true,autofocus:false,state:j('lh-state'),onChange:function(s){try{window.parent.postMessage({type:${JSON.stringify(STATE)},state:s},'*')}catch(x){}},onResult:function(res,s){try{window.parent.postMessage({type:${JSON.stringify(RESULT)},state:s,percent:res&&res.percent},'*')}catch(x){}}})}catch(e){r.className='lh-error';r.textContent='Die Übung konnte nicht gestartet werden: '+(e&&e.message||e)}
var grow=${kind === 'TSPlayer'},cur=1,W=0,H=0,cap=null,sh=function(k){r.style.width=k>1?(W/k).toFixed(2)+'px':'';return r.offsetHeight*Math.max(1,k)};
var fit=function(){W=window.innerWidth;H=window.innerHeight;var k=1,d=document.documentElement,p=grow?r.querySelector('.tsp-read .tsp-text,.tsp-gaps .tsp-text,.tsp-typedbox'):null,pics=!!p&&p.classList.contains('show-pics'),top=cap?cap.scrollTop:0;
if(cap){cap.style.maxHeight=cap.style.overflowX=cap.style.overflowY='';cap=null}if(pics)p.classList.remove('show-pics');
if(grow){var hc=sh(cur);if(cur>1&&hc<=H+1&&hc>=H*0.7)k=cur;else{var h1=sh(1);if(h1<H*0.97){var t=Math.min(1.5,H/h1),lo=1,hi=t;if(sh(t)<=H+1)lo=t;else for(var i=0;i<7;i++){var m=(lo+hi)/2;if(sh(m)<=H+1)lo=m;else hi=m}k=lo<1.03?1:lo}}}
if(k>1){sh(k);r.style.transformOrigin='0 0';r.style.transform='scale('+k.toFixed(4)+')';cur=k}
else{r.style.width='';cur=1;k=Math.min(1,H/Math.max(1,r.offsetHeight-(p?Math.max(0,p.offsetHeight-(p.classList.contains('tsp-text')?160:120)):0)));r.style.transformOrigin='50% 0';r.style.transform=k<0.999?'scale('+k.toFixed(4)+')':''}
if(p&&(k<=1||p.classList.contains('tsp-text'))){p.style.overflowX='hidden';p.style.overflowY='auto';p.style.maxHeight=Math.floor(p.offsetHeight+H/k-r.offsetHeight)+'px';if(pics)p.classList.add('show-pics');p.scrollTop=top;cap=p}else if(pics)p.classList.add('show-pics');
d.style.overflow=document.body.style.overflow=Math.abs(k-1)>0.001?'hidden':''};
if(window.ResizeObserver)new ResizeObserver(fit).observe(r);window.addEventListener('resize',fit);fit();
document.addEventListener('scroll',function(e){var t=e.target;if(t===document){if(window.scrollX)window.scrollTo(0,window.scrollY)}else if(t&&t.nodeType===1&&t.scrollLeft&&/hidden|clip/.test(getComputedStyle(t).overflowX))t.scrollLeft=0},{capture:true,passive:true})})();
</script>
</body>
</html>`;
}

/** Shows a frame page; `onState` gets the player's state (and the result in %, if any). */
export default function PlayerFrame({ page, title, interactive, onState, stage }: { page: string; title: string; interactive: boolean; onState?: (state: unknown, percent?: number) => void; stage?: { w: number; h: number } }) {
  const frame = useRef<HTMLIFrameElement>(null);
  // A preview runs at a fixed size and is shown smaller (like Schiebesachen does).
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = box.current;
    if (!stage || !el || typeof ResizeObserver === 'undefined') return;
    const fit = () => setScale(Math.max(0.2, el.clientWidth / stage.w));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [stage]);
  const report = useRef(onState);
  useLayoutEffect(() => { report.current = onState; });
  useEffect(() => {
    const listen = (e: MessageEvent) => {
      const d = e.data;
      if (!d || typeof d !== 'object' || e.source !== frame.current?.contentWindow || (d.type !== STATE && d.type !== RESULT)) return;
      report.current?.(d.state ?? null, d.type === RESULT && typeof d.percent === 'number' && Number.isFinite(d.percent) ? d.percent : undefined);
    };
    window.addEventListener('message', listen);
    return () => window.removeEventListener('message', listen);
  }, []);
  return (
    <div ref={box} className={`textsachen-frame${interactive ? ' is-live' : ''}`} style={stage ? { height: Math.round(stage.h * scale) } : undefined} onPointerDown={(e) => interactive && e.stopPropagation()}>
      <iframe ref={frame} title={title} srcDoc={page} allow="autoplay; microphone" style={stage ? { width: stage.w, height: stage.h, transform: `scale(${scale})`, transformOrigin: '0 0' } : undefined} />
    </div>
  );
}

/** What gets saved for a child: the state as text (its keys are the player's). */
export function statePatch(key: string, state: unknown, percent?: number) {
  const text = JSON.stringify(state ?? null);
  const patch: Record<string, string | number> = text.length <= 19000 ? { tsKey: key, tsState: text } : {};
  if (percent !== undefined) patch.score = Math.max(0, Math.min(100, Math.round(percent)));
  return patch;
}
export function savedState(state: Record<string, unknown>, key: string) {
  try { if (state.tsKey === key && typeof state.tsState === 'string') return JSON.parse(state.tsState); } catch {}
  return null;
}
