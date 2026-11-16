'use client';
import { useEffect, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { startGermanSpeech } from '@/lib/speech';
import { useLearning } from './Runtime';

export function TemplateAudioPlaceholder({element}: {element: PageElement}) {
  const {onRecord,interactive}=useLearning(element),k=element.designScale||297/1400;
  return <>
    <button type="button" aria-label={`Ton aufnehmen: ${element.placeholder}`} className="template-audio-placeholder"
      style={{borderWidth:3*k+'mm'}} onPointerDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}
      onClick={e=>{e.stopPropagation();if(interactive)onRecord?.(element.id);}}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
    </button>
    <span style={{position:'absolute',top:'100%',left:'50%',transform:'translateX(-50%)',marginTop:6*k+'mm',width:'max-content',maxWidth:320*k+'mm',padding:`${3*k}mm ${10*k}mm`,borderRadius:10*k+'mm',background:'rgba(241,245,249,.92)',color:'#475569',font:`600 ${20*k}mm/1.25 Nunito,system-ui,sans-serif`,textAlign:'center',pointerEvents:'none'}}>{element.placeholder}</span>
  </>;
}

function SpeechButton({element}: {element: PageElement}) {
  const stop=useRef<(()=>void)|null>(null);
  const [playing,setPlaying]=useState(false),[notice,setNotice]=useState('');
  useEffect(()=>()=>{stop.current?.();},[element.speechText]);
  const scale=element.designScale||297/1400;
  return <div className="audio-button-box">
    <button type="button" className="page-speech-button" aria-label={`Vorlesen: ${element.alt||element.speechText}`} aria-pressed={playing}
      style={{background:element.color,borderWidth:4*scale+'mm',boxShadow:`0 ${3*scale}mm ${10*scale}mm rgba(15,23,42,.3)`}}
      onPointerDown={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}
      onClick={()=>{
        if(playing){stop.current?.();stop.current=null;setPlaying(false);return;}
        setNotice('');setPlaying(true);
        stop.current=startGermanSpeech(element.speechText||'',{onEnd:()=>{stop.current=null;setPlaying(false);},onError:()=>{stop.current=null;setPlaying(false);setNotice('Der Text konnte nicht vorgelesen werden.');}});
        if(!stop.current){setPlaying(false);setNotice('Zum Vorlesen bitte eine deutsche Stimme auf dem Gerät installieren.');}
      }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>
    </button>
    {notice&&<span className="speech-button-notice" role="status">{notice}</span>}
  </div>;
}

/**
 * Sound on the page: one big round button. Tap plays, tap again pauses; the
 * ring shows how far it has played. Works in the editor, for children and in
 * the HTML export (no icon files).
 */
export default function AudioButton({ element }: { element: PageElement }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const title = element.alt || 'Ton';
  const r = 46, circumference = 2 * Math.PI * r;
  if(element.speechText)return <SpeechButton key={element.speechText} element={element}/>;
  return (
    <div className="audio-button-box">
      <button
        type="button"
        className={`audio-button ${playing ? 'playing' : ''}`}
        aria-label={`${title} ${playing ? 'anhalten' : 'abspielen'}`}
        title={title}
        onPointerDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        onClick={() => {
          const a = audio.current;
          if (!a) return;
          if (a.paused) {
            if (a.ended) a.currentTime = 0;
            void a.play().catch(() => setPlaying(false));
          } else a.pause();
        }}
      >
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="49" className="audio-button-face" />
          <circle cx="50" cy="50" r={r} className="audio-button-track" />
          <circle
            cx="50"
            cy="50"
            r={r}
            className="audio-button-ring"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            transform="rotate(-90 50 50)"
          />
          {playing ? (
            <g className="audio-button-symbol">
              <rect x="36" y="32" width="10" height="36" rx="2.5" />
              <rect x="54" y="32" width="10" height="36" rx="2.5" />
            </g>
          ) : (
            <path className="audio-button-symbol" d="M40 30 L72 50 L40 70 Z" strokeLinejoin="round" />
          )}
        </svg>
      </button>
      <audio
        ref={audio}
        src={element.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          if (Number.isFinite(a.duration) && a.duration > 0) setProgress(a.currentTime / a.duration);
        }}
      />
    </div>
  );
}
