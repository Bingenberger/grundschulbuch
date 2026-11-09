'use client';
import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { qrDigest } from '@/lib/child-api';
/** The payload stays in the device. Only SHA-256 and an entropy warning leave this component. */
export default function QrScanner({
  onDigest,
  onClose,
}: {
  onDigest: (digest: string, weak: boolean) => Promise<void>;
  onClose: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');
  const [active, setActive] = useState(true);
  const callback = useRef(onDigest);
  useEffect(() => {
    callback.current = onDigest;
  }, [onDigest]);
  useEffect(() => {
    if (!active) return;
    let stopped = false;
    let stream: MediaStream | null = null;
    let frame: number;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    navigator.mediaDevices
      ?.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
        audio: false,
      })
      .then(async (source) => {
        stream = source;
        if (stopped) {
          source.getTracks().forEach((t) => t.stop());
          return;
        }
        if (!video.current) return;
        video.current.srcObject = source;
        await video.current.play();
        let previous = 0;
        const scan = async (time: number) => {
          if (stopped) return;
          const el = video.current;
          if (context && el && el.readyState >= 2 && time - previous > 180) {
            previous = time;
            canvas.width = Math.min(800, el.videoWidth);
            canvas.height = (canvas.width * el.videoHeight) / el.videoWidth;
            context.drawImage(el, 0, 0, canvas.width, canvas.height);
            const pixels = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height,
            );
            const result = jsQR(pixels.data, canvas.width, canvas.height, {
              inversionAttempts: 'dontInvert',
            });
            if (result?.data) {
              source.getTracks().forEach((t) => t.stop());
              setActive(false);
              try {
                const digest = await qrDigest(result.data);
                await callback.current(
                  digest,
                  result.data.length < 16 || /^[0-9\s]+$/.test(result.data),
                );
              } catch (e) {
                setError((e as Error).message);
              }
              return;
            }
          }
          frame = requestAnimationFrame(scan);
        };
        frame = requestAnimationFrame(scan);
      })
      .catch(() =>
        setError(
          'Die Kamera lässt sich nicht öffnen. Bitte den Kamerazugriff erlauben. Die Seite benötigt HTTPS.',
        ),
      );
    if (!navigator.mediaDevices)
      queueMicrotask(() =>
        setError(
          'Die Kamera benötigt HTTPS und einen Browser mit Kamerazugriff.',
        ),
      );
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [active]);
  return (
    <div className="modal-backdrop">
      <section
        className="modal scanner-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scanner-title"
      >
        <h2 id="scanner-title">Karte vor die Kamera halten</h2>
        <video
          ref={video}
          playsInline
          muted
          style={{
            width: '100%',
            borderRadius: 10,
            background: '#1f3229',
            minHeight: 240,
          }}
        />
        <p>Der Inhalt der Karte bleibt auf diesem Gerät.</p>
        {error && (
          <p className="fehler" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button className="knopf" onClick={onClose}>
            Schließen
          </button>
          {!active && (
            <button
              className="knopf knopf-haupt"
              onClick={() => {
                setError('');
                setActive(true);
              }}
            >
              Nächste Karte
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
