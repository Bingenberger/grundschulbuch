/* eslint-disable @next/next/no-img-element -- previews from the own server */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { uploadImage } from '@/lib/client-api';
import type { Feature } from '@/lib/features';
import Icon, { type IconName } from './Icon';
import { ChoiceButton, Choices } from './ui/Choice';
import type { ChosenImage, PlaceholderShape } from './editor/image-elements';

export type ImageTab = 'upload' | 'camera' | 'placeholder' | 'screenshot' | 'arasaac' | 'wikimedia' | 'galerie' | 'released';
type SearchSource = 'arasaac' | 'wikimedia' | 'galerie';
type Hit = { id: string; title: string; thumb: string; full: string; credit?: string; license?: string; pageUrl?: string };

const tabInfo: Record<ImageTab, [IconName, string]> = {
  upload: ['opened_folder', 'Hochladen'],
  camera: ['camera', 'Kamera'],
  placeholder: ['add_image', 'Platzhalter'],
  screenshot: ['electronics', 'Bildschirmfoto'],
  arasaac: ['sports_mode', 'ARASAAC'],
  wikimedia: ['globe', 'Wikimedia Commons'],
  galerie: ['gallery', 'Schulgalerie'],
  released: ['businesswoman', 'Von der Lehrkraft'],
};

const errorText = (e: unknown) => (e instanceof Error ? e.message : 'Das hat nicht geklappt.');

/** Turns a canvas into a JPEG file for the upload. */
const canvasBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Das Foto konnte nicht erstellt werden.'))), 'image/jpeg', 0.9),
  );

function frameToCanvas(video: HTMLVideoElement, max = 2000) {
  const scale = Math.min(1, max / Math.max(video.videoWidth, video.videoHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(video.videoWidth * scale);
  canvas.height = Math.round(video.videoHeight * scale);
  canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function UploadTab({ onFile, phone, busy }: { onFile: (file: Blob) => void; phone: boolean; busy: boolean }) {
  const [over, setOver] = useState(false);
  return (
    <div className="image-tab-body">
      <label
        className={`upload-area ${over ? 'drag-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith('image/'));
          if (file) onFile(file);
        }}
      >
        <Icon name="opened_folder" size={40} />
        <strong>{busy ? 'Bild wird übertragen …' : 'Bild vom Gerät auswählen'}</strong>
        <small>oder hierher ziehen · Einfügen mit Strg+V · PNG, JPEG, WebP, GIF · bis 12 MB</small>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          aria-label="Bilddatei auswählen"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
            e.target.value = '';
          }}
        />
      </label>
      {phone && <PhoneUpload onImage={onFile} />}
    </div>
  );
}

/** QR code for sending pictures from a phone (teachers). */
function PhoneUpload({ onImage }: { onImage: (file: Blob) => void }) {
  const [qr, setQr] = useState('');
  const [url, setUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let stopped = false;
    let interval: ReturnType<typeof setInterval>;
    (async () => {
      const response = await fetch('/api/transfer', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (stopped) return;
      const link = `${window.location.origin}/upload/${result.token}`;
      setUrl(link);
      const code = await QRCode.toDataURL(link, { width: 200, margin: 2 });
      if (!stopped) setQr(code);
      interval = setInterval(async () => {
        if (Date.now() > result.expires) {
          clearInterval(interval);
          setError('Der Smartphone-Link ist abgelaufen. Öffne den Dialog erneut.');
          return;
        }
        try {
          const response = await fetch(`/api/transfer?token=${result.token}`, { cache: 'no-store' });
          if (response.ok) {
            const data = await response.json();
            if (!stopped) setImages(data.images);
          }
        } catch {
          /* next poll */
        }
      }, 2500);
    })().catch((e) => {
      if (!stopped) setError(errorText(e));
    });
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="phone-upload">
      {qr && <img src={qr} alt="QR-Code für den Smartphone-Upload" width="140" height="140" />}
      <div>
        <h3>Vom Smartphone</h3>
        <p>Code scannen, Fotos senden – sie erscheinen hier. Gültig für zehn Minuten.</p>
        {url && (
          <a href={url} target="_blank" rel="noreferrer">
            Upload-Seite öffnen ↗
          </a>
        )}
        {error && <p className="fehler">{error}</p>}
        {images.length > 0 && (
          <div className="uploaded-images">
            {images.map((src) => (
              <button
                key={src}
                type="button"
                onClick={async () => onImage(await (await fetch(src)).blob())}
              >
                <img src={src} alt="Übertragenes Bild einfügen" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CameraTab({ onPhoto, busy }: { onPhoto: (photo: Blob) => void; busy: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [facing, setFacing] = useState<'environment' | 'user'>('environment');
  const [state, setState] = useState<'starting' | 'live' | 'failed'>('starting');
  const [shot, setShot] = useState<{ blob: Blob; url: string } | null>(null);
  const supported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
  useEffect(() => {
    if (!supported || shot) return;
    let stream: MediaStream | null = null;
    let stopped = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1440 } }, audio: false })
      .then((s) => {
        if (stopped) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        if (video.current) {
          video.current.srcObject = s;
          void video.current.play().catch(() => undefined);
        }
        setState('live');
      })
      .catch(() => {
        if (!stopped) setState('failed');
      });
    return () => {
      stopped = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [facing, supported, shot]);
  useEffect(() => () => {
    if (shot) URL.revokeObjectURL(shot.url);
  }, [shot]);
  // Without camera access the system camera opens through a file field.
  const fallback = (
    <label className="upload-area">
      <Icon name="camera" size={40} />
      <strong>Kamera des Geräts öffnen</strong>
      <small>
        {supported ? 'Die Kamera konnte hier nicht gestartet werden.' : 'Dieser Browser zeigt die Kamera nicht direkt an.'}
      </small>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        aria-label="Foto mit der Gerätekamera aufnehmen"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPhoto(file);
          e.target.value = '';
        }}
      />
    </label>
  );
  if (!supported || state === 'failed') return <div className="image-tab-body">{fallback}</div>;
  return (
    <div className="image-tab-body camera-tab">
      {shot ? (
        <img className="camera-view" src={shot.url} alt="Aufgenommenes Foto" />
      ) : (
        <video className="camera-view" ref={video} playsInline muted aria-label="Kamerabild" />
      )}
      <div className="camera-actions">
        {shot ? (
          <>
            <ChoiceButton icon="undo" label="Noch einmal" disabled={busy} onClick={() => setShot(null)} />
            <ChoiceButton icon="ok" label={busy ? 'Wird übernommen …' : 'Foto übernehmen'} disabled={busy} onClick={() => onPhoto(shot.blob)} />
          </>
        ) : (
          <>
            <ChoiceButton
              icon="camera"
              label="Foto aufnehmen"
              disabled={state !== 'live'}
              onClick={async () => {
                const v = video.current;
                if (!v?.videoWidth) return;
                const blob = await canvasBlob(frameToCanvas(v));
                setShot({ blob, url: URL.createObjectURL(blob) });
              }}
            />
            <ChoiceButton
              icon="switch_camera"
              label="Kamera wechseln"
              onClick={() => {
                setState('starting');
                setFacing(facing === 'environment' ? 'user' : 'environment');
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

const shapeOptions: [PlaceholderShape, string][] = [
  ['wide', 'Quer'],
  ['square', 'Quadrat'],
  ['tall', 'Hoch'],
  ['round', 'Rund'],
];
function ShapeGlyph({ shape }: { shape: PlaceholderShape }) {
  const [w, h] = { wide: [24, 16], square: [18, 18], tall: [14, 20], round: [18, 18] }[shape];
  return (
    <svg viewBox="0 0 28 24" width="28" height="24" aria-hidden="true">
      <rect x={(28 - w) / 2} y={(24 - h) / 2} width={w} height={h} rx={shape === 'round' ? 9 : 2} fill="#e3f2fd" stroke="#1e88e5" strokeWidth="1.5" strokeDasharray="3 2" />
    </svg>
  );
}

function PlaceholderTab({ onPlaceholder }: { onPlaceholder: (label: string, shape: PlaceholderShape) => void }) {
  const [label, setLabel] = useState('Tippe hier und mache ein Foto.');
  const [shape, setShape] = useState<PlaceholderShape>('wide');
  return (
    <div className="image-tab-body">
      <p className="image-tab-intro">
        Ein leerer Bildrahmen auf der Seite. Wer darauf tippt, macht ein Foto oder wählt ein Bild – auch Kinder in einem
        gesperrten Arbeitsblatt.
      </p>
      <label className="property-label">
        Hinweis im Rahmen
        <input className="option-input" value={label} maxLength={200} onChange={(e) => setLabel(e.target.value)} />
      </label>
      <Choices
        label="Form"
        value={shape}
        onChange={setShape}
        options={shapeOptions.map(([value, text]) => ({ value, label: text, icon: <ShapeGlyph shape={value} /> }))}
      />
      <button type="button" className="knopf knopf-haupt" onClick={() => onPlaceholder(label, shape)}>
        <Icon name="add_image" size={22} /> Platzhalter einfügen
      </button>
    </div>
  );
}

function ScreenshotTab({
  onPage,
  onScreen,
  busy,
}: {
  onPage?: () => void;
  onScreen: (shot: Blob) => void;
  busy: boolean;
}) {
  const [error, setError] = useState('');
  const canCapture = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getDisplayMedia;
  return (
    <div className="image-tab-body">
      <div className="screenshot-choices">
        {onPage && (
          <button type="button" className="screenshot-choice" disabled={busy} onClick={onPage}>
            <Icon name="document" size={36} />
            <strong>Diese Seite</strong>
            <small>Bild der aktuellen Heftseite, eingefügt auf einer neuen Seite dahinter.</small>
          </button>
        )}
        {canCapture && (
          <button
            type="button"
            className="screenshot-choice"
            disabled={busy}
            onClick={async () => {
              setError('');
              let stream: MediaStream | null = null;
              try {
                stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
                const video = document.createElement('video');
                video.muted = true;
                video.srcObject = stream;
                await video.play();
                await new Promise((r) => setTimeout(r, 300));
                onScreen(await canvasBlob(frameToCanvas(video, 2400)));
              } catch (e) {
                if ((e as Error).name !== 'NotAllowedError') setError(errorText(e));
              } finally {
                stream?.getTracks().forEach((t) => t.stop());
              }
            }}
          >
            <Icon name="electronics" size={36} />
            <strong>Anderes Fenster oder Bildschirm</strong>
            <small>Der Browser fragt, welches Fenster fotografiert werden soll.</small>
          </button>
        )}
      </div>
      {error && <p className="fehler" role="alert">{error}</p>}
    </div>
  );
}

const sourceNotes: Record<SearchSource, string> = {
  arasaac: 'Piktogramme von Sergio Palao (ARASAAC, CC BY-NC-SA 4.0). Der Bildnachweis wird mit eingefügt.',
  wikimedia: 'Freie Bilder mit unterschiedlichen Lizenzen. Der Bildnachweis (Urheber, Lizenz) wird mit eingefügt.',
  galerie: 'KI-erstellte Bilder der Schulgalerie, gemeinfrei (CC0).',
};

function SearchTab({ source, onChoose, busy }: { source: SearchSource; onChoose: (hit: Hit) => void; busy: boolean }) {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>(source === 'galerie' ? 'loading' : 'idle');
  const [error, setError] = useState('');
  const fetchPage = useCallback(
    async (q: string, n: number) => {
      const response = await fetch(`/api/bilder?${new URLSearchParams({ quelle: source, q, seite: String(n) })}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data as { items: Hit[]; more: boolean };
    },
    [source],
  );
  const show = (n: number, data: { items: Hit[]; more: boolean }) => {
    setHits((old) => (n === 1 ? data.items : [...old, ...data.items]));
    setPage(n);
    setMore(data.more);
    setState('done');
  };
  const fail = (e: unknown) => {
    setError(errorText(e));
    setState('done');
  };
  const run = (q: string, n: number) => {
    setState('loading');
    setError('');
    fetchPage(q, n).then((data) => show(n, data), fail);
  };
  useEffect(() => {
    // The gallery shows its newest pictures right away.
    if (source !== 'galerie') return;
    let stopped = false;
    fetchPage('', 1).then(
      (data) => {
        if (stopped) return;
        setHits(data.items);
        setMore(data.more);
        setState('done');
      },
      (e) => {
        if (stopped) return;
        setError(errorText(e));
        setState('done');
      },
    );
    return () => {
      stopped = true;
    };
  }, [source, fetchPage]);
  const preview = (url: string) => `/api/bilder?${new URLSearchParams({ quelle: source, bild: url })}`;
  return (
    <div className="image-tab-body">
      <form
        className="image-search"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim() || source === 'galerie') run(query.trim(), 1);
        }}
      >
        <input
          className="option-input"
          type="search"
          aria-label={`Suchbegriff für ${tabInfo[source][1]}`}
          placeholder={source === 'arasaac' ? 'z. B. Hund, lesen, Apfel' : 'Suchbegriff'}
          value={query}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="knopf knopf-haupt compact" disabled={state === 'loading'}>
          <Icon name="search" size={20} /> Suchen
        </button>
      </form>
      <p className="image-tab-note">{sourceNotes[source]}</p>
      {error && <p className="fehler" role="alert">{error}</p>}
      {state === 'done' && !error && !hits.length && <p className="image-tab-intro">Nichts gefunden. Versuche ein anderes Wort.</p>}
      <div className="image-hits" aria-busy={state === 'loading'}>
        {hits.map((hit) => (
          <button key={`${hit.id}-${hit.thumb}`} type="button" className="image-hit" disabled={busy} title={hit.credit || hit.title} onClick={() => onChoose(hit)}>
            <img src={preview(hit.thumb)} alt="" loading="lazy" />
            <span>{hit.title}</span>
          </button>
        ))}
      </div>
      {state === 'loading' && <p className="image-tab-intro">Wird gesucht …</p>}
      {more && state !== 'loading' && (
        <button type="button" className="knopf compact" onClick={() => run(query.trim(), page + 1)}>
          Mehr laden
        </button>
      )}
    </div>
  );
}

/**
 * Inserting pictures: upload, camera, placeholder, screenshot and searches in
 * ARASAAC, Wikimedia Commons and the school gallery. Children see the sources
 * their teacher allows; `only` limits the tabs (e.g. filling a placeholder).
 */
export default function ImageDialog({
  features,
  child = false,
  only,
  released = [],
  uploadQuery = '',
  title = 'Ein Bild einfügen',
  onImage,
  onPlaceholder,
  onPageScreenshot,
  onClose,
}: {
  features: Set<Feature>;
  child?: boolean;
  only?: ImageTab[];
  /** Pictures the teacher released for children. */
  released?: string[];
  uploadQuery?: string;
  title?: string;
  onImage: (image: ChosenImage) => void;
  onPlaceholder?: (label: string, shape: PlaceholderShape) => void;
  onPageScreenshot?: () => Promise<void>;
  onClose: () => void;
}) {
  const [gallery, setGallery] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let stopped = false;
    fetch('/api/bilder?quellen')
      .then((r) => r.json())
      .then((d) => !stopped && setGallery(!!d.galerie))
      .catch(() => undefined);
    return () => {
      stopped = true;
    };
  }, []);
  const has = (f: Feature) => features.has(f);
  const own = has('imageUpload') || !!only;
  const available: ImageTab[] = (
    [
      own && 'upload',
      own && 'camera',
      onPlaceholder && has('imagePlaceholder') && 'placeholder',
      has('imageScreenshot') && 'screenshot',
      has('imageSearch') && 'arasaac',
      has('imageWeb') && 'wikimedia',
      has('imageSearch') && gallery && 'galerie',
      child && 'released',
    ] as (ImageTab | false | undefined)[]
  ).filter((t): t is ImageTab => !!t && (!only || only.includes(t)));
  const [chosen, setTab] = useState<ImageTab | null>(null);
  const tab = chosen && available.includes(chosen) ? chosen : available[0];

  async function work(task: () => Promise<void>) {
    setBusy(true);
    setError('');
    try {
      await task();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  const upload = (file: Blob, alt = '', edit = false) =>
    work(async () => onImage({ src: await uploadImage(file, uploadQuery), alt, edit }));

  // Pasting a picture works in every tab.
  useEffect(() => {
    if (!own) return;
    const paste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.files || []).find((f) => f.type.startsWith('image/'));
      if (!file) return;
      e.preventDefault();
      void upload(file);
    };
    window.addEventListener('paste', paste);
    return () => window.removeEventListener('paste', paste);
  });
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [onClose]);

  return (
    <div className="modal-backdrop">
      <section className="modal image-dialog" role="dialog" aria-modal="true" aria-labelledby="image-title">
        <div className="dialog-heading">
          <h2 id="image-title">{title}</h2>
          <button type="button" className="knopf" onClick={onClose}>
            Schließen
          </button>
        </div>
        <div className="image-dialog-layout">
          <nav className="image-tabs" aria-label="Bildquelle">
            {available.map((t) => (
              <ChoiceButton key={t} icon={tabInfo[t][0]} label={tabInfo[t][1]} pressed={tab === t} onClick={() => setTab(t)} />
            ))}
          </nav>
          <div className="image-tab-panel" aria-label={tab ? tabInfo[tab][1] : undefined} role="region">
            {!tab && <p className="image-tab-intro">Hier sind keine Bildquellen freigegeben.</p>}
            {tab === 'upload' && <UploadTab onFile={(f) => void upload(f)} phone={!child && !only} busy={busy} />}
            {tab === 'camera' && <CameraTab onPhoto={(f) => void upload(f, 'Foto')} busy={busy} />}
            {tab === 'placeholder' && onPlaceholder && <PlaceholderTab onPlaceholder={onPlaceholder} />}
            {tab === 'screenshot' && (
              <ScreenshotTab
                busy={busy}
                onPage={onPageScreenshot && (() => void work(onPageScreenshot))}
                onScreen={(shot) => void upload(shot, 'Bildschirmfoto', true)}
              />
            )}
            {(tab === 'arasaac' || tab === 'wikimedia' || tab === 'galerie') && (
              <SearchTab
                key={tab}
                source={tab}
                busy={busy}
                onChoose={(hit) =>
                  void work(async () => {
                    const response = await fetch('/api/bilder', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ quelle: tab, bild: hit.full }),
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error);
                    onImage({ src: data.src, alt: hit.title.slice(0, 300), credit: hit.credit });
                  })
                }
              />
            )}
            {tab === 'released' && (
              <div className="image-tab-body">
                {released.length ? (
                  <div className="uploaded-images">
                    {released.map((src) => (
                      <button key={src} type="button" aria-label="Bild einfügen" onClick={() => onImage({ src })}>
                        <img src={src} alt="" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="image-tab-intro">Deine Lehrkraft hat noch keine Bilder freigegeben.</p>
                )}
              </div>
            )}
            {busy && <p className="image-tab-intro" role="status">Bild wird übernommen …</p>}
            {error && <p className="fehler" role="alert">{error}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
