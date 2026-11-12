'use client';
/* eslint-disable @next/next/no-img-element -- Small static app icon. */
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const KEY = 'grundschulbuch-installhinweis';
/** Pages where a hint would only be in the way. */
const QUIET = ['/heft/', '/kinder/heft/', '/drucken/', '/upload/'];

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

function installed() {
  return matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches || (navigator as { standalone?: boolean }).standalone === true;
}
/** iPhone and iPad (iPadOS reports itself as a Mac with touch). */
function apple() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
function dismissed() {
  try {
    return localStorage.getItem(KEY) === 'aus';
  } catch {
    return false;
  }
}

/**
 * Suggests installing the app (home screen, no browser bars). Safari on the
 * iPad has no install button, so it explains the two taps; Chrome and Edge
 * get a button that opens their own install dialog.
 */
export default function InstallHint() {
  const path = usePathname() || '/';
  const [kind, setKind] = useState<'apple' | 'prompt' | null>(null);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);

  useEffect(() => {
    if (installed() || dismissed()) return;
    const offer = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPrompt);
      setKind('prompt');
    };
    window.addEventListener('beforeinstallprompt', offer);
    const timer = apple() ? setTimeout(() => setKind('apple'), 0) : undefined;
    const done = () => setKind(null);
    window.addEventListener('appinstalled', done);
    return () => {
      window.removeEventListener('beforeinstallprompt', offer);
      window.removeEventListener('appinstalled', done);
      clearTimeout(timer);
    };
  }, []);

  if (!kind || QUIET.some((p) => path.startsWith(p))) return null;
  const close = () => {
    try {
      localStorage.setItem(KEY, 'aus');
    } catch {}
    setKind(null);
  };
  return (
    <aside className="install-hint" role="note" aria-label="Als App installieren">
      <img src="/apple-touch-icon.png" alt="" width={44} height={44} />
      <div>
        <strong>Grundschulbuch als App</strong>
        {kind === 'apple' ? (
          <p>
            Tippe oben auf <ShareGlyph /> <b>Teilen</b> und dann auf <b>„Zum Home-Bildschirm“</b>. Danach startet das
            Grundschulbuch wie eine App im Vollbild – ohne Browserleisten.
          </p>
        ) : (
          <p>Installiert startet das Grundschulbuch wie eine App im eigenen Fenster – ohne Browserleisten.</p>
        )}
      </div>
      <div className="install-hint-actions">
        {kind === 'prompt' && prompt && (
          <button
            type="button"
            className="knopf knopf-haupt"
            onClick={async () => {
              await prompt.prompt();
              const choice = await prompt.userChoice;
              if (choice.outcome === 'accepted') setKind(null);
            }}
          >
            Installieren
          </button>
        )}
        <button type="button" className="knopf" onClick={close}>
          Nicht mehr zeigen
        </button>
      </div>
    </aside>
  );
}

function ShareGlyph() {
  return (
    <svg className="share-glyph" viewBox="0 0 20 24" width="16" height="19" aria-label="Teilen-Symbol" role="img">
      <path d="M10 2v13M5.5 6.5 10 2l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10H3.5v12h13V10H14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
