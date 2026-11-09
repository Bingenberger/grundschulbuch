/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { uploadImage } from '@/lib/client-api';
export default function ImageDialog({
  onImage,
  onClose,
  galleryOrigin,
}: {
  onImage: (src: string) => void;
  onClose: () => void;
  galleryOrigin: string;
}) {
  const [qr, setQr] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [images, setImages] = useState<string[]>([]);
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
      if (stopped) return;
      setQr(code);
      interval = setInterval(async () => {
        if (Date.now() > result.expires) {
          clearInterval(interval);
          setError(
            'Der Smartphone-Link ist abgelaufen. Öffne den Dialog erneut.',
          );
          return;
        }
        try {
          const response = await fetch(`/api/transfer?token=${result.token}`, {
            cache: 'no-store',
          });
          if (response.ok) {
            const data = await response.json();
            if (!stopped) setImages(data.images);
          }
        } catch {
          /* retry on next poll */
        }
      }, 2500);
    })().catch((e) => {
      if (!stopped) setError(e.message);
    });
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="modal-backdrop">
      <section
        className="modal image-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-title"
      >
        <div className="dialog-heading">
          <h2 id="image-title">Ein Bild hinzufügen</h2>
          <button className="knopf" onClick={onClose}>
            Schließen
          </button>
        </div>
        <label className="upload-area">
          <strong>
            {busy ? 'Bild wird übertragen …' : '↑ Bild vom Gerät auswählen'}
          </strong>
          <small>PNG, JPEG oder WebP · bis 12 MB</small>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              try {
                onImage(await uploadImage(file));
              } catch (error) {
                setError((error as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
        <div className="phone-upload">
          {qr && (
            <img
              src={qr}
              alt="QR-Code für den Smartphone-Upload"
              width="160"
              height="160"
            />
          )}
          <div>
            <h3>Vom Smartphone</h3>
            <p>
              Scanne den Code mit deinem Smartphone. Übertragene Bilder
              erscheinen hier.
            </p>
            {url && (
              <a href={url} target="_blank" rel="noreferrer">
                Upload-Seite öffnen ↗
              </a>
            )}
            <small>Gültig für zehn Minuten.</small>
          </div>
        </div>
        {images.length > 0 && (
          <div className="uploaded-images">
            {images.map((src) => (
              <button key={src} onClick={() => onImage(src)}>
                <img src={src} alt="Übertragenes Bild einfügen" />
              </button>
            ))}
          </div>
        )}
        {galleryOrigin && (
          <p>
            <a href={galleryOrigin} target="_blank" rel="noreferrer">
              Bildergalerie der Schule öffnen ↗
            </a>
            <small>
              Ein freigegebenes Bild herunterladen und oben auswählen.
            </small>
          </p>
        )}
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}
