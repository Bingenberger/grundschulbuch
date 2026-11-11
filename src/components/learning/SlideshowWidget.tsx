/* eslint-disable @next/next/no-img-element -- School-owned slide media. */
'use client';
import { useEffect, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import type { LearningSettings, LearningResponse } from '@/lib/learning/catalog';
import { createSlideshowPlayback, slideshowIndex, slideshowSlides, type SlideshowSnapshot } from '@/lib/learning/slideshow-playback';
import { useLearning } from './Runtime';
export default function SlideshowWidget({ element }: { element: PageElement }) {
  const { state, update, interactive } = useLearning(element), c = element.settings || {};
  return <SlideshowPlayer key={`${JSON.stringify(c)}:${interactive}`} settings={c} response={state} update={update} interactive={interactive} />;
}
function SlideshowPlayer({ settings: c, response, update, interactive }: { settings: LearningSettings; response: LearningResponse; update: (patch: LearningResponse) => void; interactive: boolean }) {
  const slides = slideshowSlides(c), index = slideshowIndex(response.index, slides.length), completed = response.completed === true && index === slides.length - 1;
  const [view, setView] = useState<SlideshowSnapshot>({ index, status: completed ? 'ended' : 'idle', error: '' });
  const [player] = useState(() => createSlideshowPlayback({
    slides, index, completed, repeat: !!c.repeat, sound: c.slideshowSound !== false, waitAudio: c.slideshowWaitAudio !== false, volume: c.volume,
    audio: src => new Audio(src), now: () => performance.now(),
    schedule: (callback, ms) => setTimeout(callback, ms), cancel: timer => clearTimeout(timer as ReturnType<typeof setTimeout>),
    onChange: setView, onIndex: () => {}, onFinish: () => {},
  }));
  useEffect(() => { player.setResponseHandlers(next => update({ index: next, completed: false }), next => update({ index: next, completed: true })); }, [player, update]);
  useEffect(() => {
    const hide = () => { if (document.visibilityState === 'hidden') player.pause(); };
    window.addEventListener('blur', player.pause); document.addEventListener('visibilitychange', hide);
    return () => { window.removeEventListener('blur', player.pause); document.removeEventListener('visibilitychange', hide); player.stop(); };
  }, [player]);
  useEffect(() => { player.restore(index, completed); }, [player, index, completed]);
  const slide = slides[view.index], playing = view.status === 'playing';
  return <section className="learning-widget slideshow-widget" aria-label="Diaschau" onPointerDown={event => event.stopPropagation()}>
    <header><strong>{c.title || 'Diaschau'}</strong></header><div className="learning-content">
      <div key={view.index} className={`slideshow transition-${c.transition || 'fade'} slide-text-${c.mode || 'center'}${playing ? '' : ' slideshow-paused'}`} style={{ background: c.background?.startsWith('#') ? c.background : '#f4f5eb' }}>
        {slide.image && <img src={slide.image} alt={slide.title || `Folie ${view.index + 1}`} />}
        <div><h3>{slide.title}</h3><p>{slide.text}</p></div>
      </div>
      <p className="slideshow-status" role="status">Folie {view.index + 1} von {slides.length} · {view.status === 'ended' ? 'Diaschau beendet' : playing ? 'Wiedergabe läuft' : 'Pausiert'}</p>
      <div className="learning-actions">
        <button type="button" aria-label="Vorherige Folie" disabled={!interactive || view.index === 0} onClick={() => player.jump(view.index - 1)}>‹</button>
        <button type="button" disabled={!interactive} onClick={() => playing ? player.pause() : player.play()}>{playing ? 'Pause' : view.status === 'ended' ? '▷ Erneut abspielen' : '▷ Automatisch'}</button>
        <button type="button" aria-label="Nächste Folie" disabled={!interactive || view.index === slides.length - 1} onClick={() => player.jump(view.index + 1)}>›</button>
        <button type="button" disabled={!interactive} onClick={() => { player.pause(); player.jump(0); }}>Zum Anfang</button>
      </div>
      {slide.audio && c.slideshowSound !== false && <p className="slideshow-audio-hint">Folienton startet mit „Automatisch“.{c.slideshowWaitAudio !== false ? ' Der Wechsel wartet mindestens die eingestellte Dauer und das Tonende ab.' : ' Der Ton endet spätestens beim Folienwechsel.'}</p>}
      {view.error && <div role="alert"><p>{view.error}</p><button type="button" disabled={!interactive} onClick={() => player.withoutAudio()}>Ohne Ton fortsetzen</button></div>}
    </div>
  </section>;
}
