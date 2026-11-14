'use client';
// Settings of Video, Webseite and QR-Plakat: the address, a heading and a line
// below – the page is then laid out like the reference's template.
import { useLayoutEffect, useRef } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { mediaConfig, webAddress, type MediaConfig } from '@/lib/learning/medien';
import { Choices } from './OptionControls';

export default function MediaPageOptions({ value, onChange }: { value: unknown; onChange: (v: JsonValue) => void }) {
  const c = mediaConfig(value);
  const latest = useRef(c);
  useLayoutEffect(() => { latest.current = c; });
  const set = (next: Partial<MediaConfig>) => onChange({ ...latest.current, ...next } as JsonValue);
  const ok = !c.url || !!webAddress(c.url);
  return (
    <div className="receipt-options">
      <Choices label="Was kommt auf die Seite?" value={c.art} onChange={(art) => set({ art })} options={[{ value: 'video', label: 'Video' }, { value: 'webpage', label: 'Webseite' }, { value: 'qr', label: 'QR-Plakat' }]}
        hint={c.art === 'video' ? 'Ein Video, z. B. von YouTube – mit Überschrift wie die Folie „Video mit Titel“.' : c.art === 'webpage' ? 'Eine Webseite, die man auf der Seite benutzen kann.' : 'Ein Plakat mit Überschrift, QR-Code, Bild und der Adresse. Den QR-Code kann man mit dem Tablet scannen.'} />
      <label className="receipt-option">
        <strong>{c.art === 'video' ? 'Videolink' : 'Adresse'}</strong>
        <input className="text-input" type="text" inputMode="url" autoCapitalize="none" spellCheck={false} aria-label={c.art === 'video' ? 'Videolink' : 'Adresse der Webseite'} placeholder={c.art === 'video' ? 'z. B. https://www.youtube.com/watch?v=…' : 'z. B. https://www.lernsachen.blog'} value={c.url} onChange={(e) => set({ url: e.target.value })} />
        {!ok && <small className="option-hint" role="status">Das ist keine Internetadresse (http oder https).</small>}
      </label>
      {c.art !== 'webpage' && (
        <label className="receipt-option">
          <strong>Überschrift</strong>
          <input className="text-input" aria-label="Überschrift" placeholder={c.art === 'video' ? 'leer: nur das Video, ganz groß' : 'Überschrift'} value={c.title} maxLength={120} onChange={(e) => set({ title: e.target.value })} />
        </label>
      )}
      {(c.art === 'qr' || (c.art === 'video' && c.title.trim())) && (
        <label className="receipt-option">
          <strong>{c.art === 'qr' ? 'Unten steht' : 'Darunter steht'}</strong>
          <input className="text-input" aria-label={c.art === 'qr' ? 'Text unter dem Plakat' : 'Text unter dem Video'} placeholder={c.art === 'qr' ? 'leer: die Adresse' : 'Darum geht es im Video'} value={c.caption} maxLength={200} onChange={(e) => set({ caption: e.target.value })} />
        </label>
      )}
      {c.art === 'qr' && <p className="option-hint">Das Bild rechts setzt du danach auf der Seite ein (Platzhalter antippen).</p>}
    </div>
  );
}
