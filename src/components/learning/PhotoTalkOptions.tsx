'use client';
// Einstellungen des sprechenden Fotos wie im Dialog von Lernsachen-Heft: Foto
// wählen, eine Linie von einem Mundwinkel zum anderen ziehen, den Stil wählen
// und was es sagt; „Anhören“ zeigt es gleich.
import { useLayoutEffect, useRef, useState } from 'react';
import type { JsonValue, LearningSettings } from '@/lib/learning/catalog';
import { findPicture } from '@/lib/learning/picture-search';
import { FIGURE_PITCHES, PHOTO_CSS, PHOTO_STYLES, renderPhotoTalk, speakPhotoTalk } from '@/lib/reference/tools-runtime';
import { Choices } from '../ui/Choice';
import Icon from '../Icon';
import { sayOf } from './FigureWidget';
import { photoItem, photoOf, type PhotoTalk } from './PhotoTalkWidget';
import OwnRecording from './OwnRecording';

type Choice = { id: string; label: string; hint?: string };
const styles = PHOTO_STYLES as unknown as Choice[];
const pitches = FIGURE_PITCHES as unknown as Choice[];

/** Breite und Höhe eines Bilds (für die Mundlinie und das Seitenverhältnis). */
function measure(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth || 800, height: img.naturalHeight || 600 });
    img.onerror = () => resolve({ width: 800, height: 600 });
    img.src = src;
  });
}

export default function PhotoTalkOptions({ settings, onChange, upload, busy }: {
  settings: LearningSettings;
  onChange: (patch: Partial<LearningSettings>) => void;
  upload: (file: File, done: (src: string) => void) => Promise<void>;
  busy: boolean;
}) {
  const photo = photoOf(settings.photo), say = sayOf(settings.say);
  const [word, setWord] = useState('');
  const [note, setNote] = useState('');
  const [drag, setDrag] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const set = (p: Partial<PhotoTalk>) => photo && onChange({ photo: { ...photo, ...p } as unknown as JsonValue });
  const setSay = (p: Partial<{ text: string; pitch: string; audio: string | undefined }>) => {
    const next = { ...say, ...p };
    if (!next.audio) delete next.audio;
    onChange({ say: next as unknown as JsonValue });
  };
  const take = async (src: string) => {
    const size = await measure(src);
    // Neues Foto: die Mundlinie beginnt in der Mitte, etwas unterhalb.
    onChange({ photo: { src, ...size, x1: 0.4, y1: 0.68, x2: 0.6, y2: 0.68, style: photo?.style ?? 'normal' } as unknown as JsonValue });
    setNote('Zieh jetzt eine Linie von einem Mundwinkel zum anderen.');
  };
  const { item, options } = photoItem('photo-preview', photo, say);
  useLayoutEffect(() => {
    if (preview.current) renderPhotoTalk(preview.current, item, true, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify([item, say.audio])]);

  const point = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    return { x: Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)), y: Math.min(1, Math.max(0, (e.clientY - box.top) / box.height)) };
  };
  const line = drag ?? photo;

  return (
    <div className="receipt-options tool-options photo-talk-options">
      <style>{PHOTO_CSS}</style>
      {photo ? (
        <>
          <div className="photo-talk-stage" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- Foto aus dem Medienspeicher */}
            <img src={photo.src} alt="" draggable={false} />
            <svg
              viewBox="0 0 1 1"
              preserveAspectRatio="none"
              aria-label="Mundlinie ziehen"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                const p = point(e);
                setDrag({ x1: p.x, y1: p.y, x2: p.x, y2: p.y });
              }}
              onPointerMove={(e) => {
                if (!drag) return;
                const p = point(e);
                setDrag({ ...drag, x2: p.x, y2: p.y });
              }}
              onPointerUp={() => {
                if (drag && Math.hypot((drag.x2 - drag.x1) * photo.width, (drag.y2 - drag.y1) * photo.height) > 8) {
                  // Immer von links nach rechts.
                  set(drag.x2 < drag.x1 ? { x1: drag.x2, y1: drag.y2, x2: drag.x1, y2: drag.y1 } : drag);
                  setNote('');
                }
                setDrag(null);
              }}
            >
              {line && <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} vectorEffect="non-scaling-stroke" />}
            </svg>
          </div>
          <p className="option-hint">{note || 'Zieh eine Linie von einem Mundwinkel zum anderen. Darunter bewegt sich das Kinn.'}</p>
        </>
      ) : (
        <p className="option-hint">Wähle ein Foto – ein Gesicht von vorn klappt am besten.</p>
      )}
      <div className="photo-talk-pick">
        <label className="knopf compact">
          <Icon name="camera" size={20} /> {photo ? 'Anderes Foto …' : 'Foto wählen …'}
          <input className="visually-hidden" type="file" accept="image/*" aria-label="Foto wählen" disabled={busy}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f, (src) => void take(src)); e.target.value = ''; }} />
        </label>
        <input className="option-input" value={word} placeholder="oder ein Bild suchen, z. B. Hund" aria-label="Bild suchen" onChange={(e) => setWord(e.target.value)} />
        <button type="button" className="knopf compact" disabled={!word.trim() || busy}
          onClick={async () => {
            setNote(`Suche ein Bild für „${word.trim()}“ …`);
            try {
              const found = await findPicture(word.trim(), new AbortController().signal);
              if (found) await take(found);
              else setNote(`Kein Bild für „${word.trim()}“ gefunden.`);
            } catch (e) { setNote((e as Error).message); }
          }}>Suchen</button>
      </div>
      {photo && (
        <Choices
          label="Stil"
          value={photo.style}
          onChange={(style) => set({ style })}
          options={styles.map((s) => ({ value: s.id, label: s.label, icon: 'picture' as const, title: s.hint }))}
        />
      )}
      <label className="property-label">
        Das sagt das Foto beim Antippen
        <input className="option-input" value={say.text} maxLength={300} placeholder="z. B. Hallo, ich bin Bello!" onChange={(e) => setSay({ text: e.target.value })} />
      </label>
      <Choices label="Stimme" value={say.pitch} onChange={(pitch) => setSay({ pitch })} options={pitches.map((p) => ({ value: p.id, label: p.label, icon: 'speaker' as const }))} />
      <div className="receipt-option">
        <strong>Eigene Aufnahme</strong>
        <OwnRecording audio={say.audio} onChange={(audio) => setSay({ audio })}
          hint={say.audio ? 'Mit eigener Aufnahme spricht die Aufnahme – der Text ist dann nur noch die Beschreibung. Der Mund bewegt sich, solange sie läuft.' : 'Ohne eigene Aufnahme spricht die Computerstimme. Im Puppentheater spricht das Foto nur mit eigener Aufnahme.'} />
      </div>
      {photo && (
        <div className="photo-talk-preview">
          <div ref={preview} className="reference-widget lh-wg-phototalk" style={{ aspectRatio: `${photo.width} / ${photo.height}` }} />
          <button type="button" className="knopf" onClick={() => preview.current && speakPhotoTalk(item, preview.current)}>
            <Icon name="speaker" size={20} /> Anhören
          </button>
        </div>
      )}
    </div>
  );
}
