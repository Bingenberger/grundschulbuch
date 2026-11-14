'use client';
// Settings of Uhr, Timer and Datum, with the choices of the reference's
// dialogs (“Timer einstellen”, “Datum und Wetter”, Analog/Digital) and a
// preview drawn by the widget itself.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import { TIMER_MINUTES, zeitConfig, zeitItem, type Place, type ZeitConfig } from '@/lib/learning/zeit';
import { CLASS_CSS, dateText, loadWeather, renderTime, searchPlace } from '@/lib/reference/class-runtime';
import { Chips, Slider, Toggle } from '../sheets/SheetParts';
import { Choices } from './OptionControls';

const PLACE = 'grundschulbuch-wetter-ort';
function lastPlace(): Place | undefined {
  try { const p = JSON.parse(localStorage.getItem(PLACE) ?? 'null'); return p && typeof p.name === 'string' ? p : undefined; } catch { return undefined; }
}

function Preview({ c }: { c: ZeitConfig }) {
  const box = useRef<HTMLDivElement>(null);
  const size = c.kind === 'timer' ? { w: 170, h: 200 } : c.kind === 'date' ? { w: 420, h: 140 } : c.face === 'digital' ? { w: 260, h: 117 } : { w: 200, h: 200 };
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.classList.add('lh-widget', `lh-wg-${c.kind}`);
    delete el.dataset.k;
    renderTime(el, { ...zeitItem(c, 'preview'), ...size }, false, {});
  });
  return (
    <div className="time-preview">
      <style>{CLASS_CSS}</style>
      <div ref={box} className="time-widget-face" style={{ width: size.w, height: size.h }} />
    </div>
  );
}

export default function TimeOptions({ value, onChange }: { value: unknown; onChange: (v: JsonValue) => void }) {
  const c = zeitConfig(value);
  const latest = useRef(c);
  useLayoutEffect(() => { latest.current = c; });
  const set = (next: Partial<ZeitConfig>) => onChange({ ...latest.current, ...next } as unknown as JsonValue);

  // Datum: new ones show the weather of the place chosen last time, like the reference.
  const [remembered] = useState(() => (c.kind === 'date' && !c.place ? lastPlace() : undefined));
  const [weather, setWeather] = useState(!!c.place || !!remembered);
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<{ name: string; lat: number; lon: number; detail?: string }[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(!c.place && !remembered);
  const placeKey = c.kind === 'date' && c.place ? `${c.place.lat},${c.place.lon}` : '';
  const [checked, setChecked] = useState<{ key: string; ok: boolean } | null>(null);
  const online = checked && checked.key === placeKey ? checked.ok : null;
  useEffect(() => {
    if (remembered && !latest.current.place) set({ place: remembered });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!placeKey || !latest.current.place) return;
    let live = true;
    void loadWeather(latest.current.place).then((ok: boolean) => live && setChecked({ key: placeKey, ok }));
    return () => { live = false; };
  }, [placeKey]);
  const search = async () => {
    if (query.trim().length < 2) return;
    setSearching(true); setNote('');
    try {
      const list = await searchPlace(query);
      setFound(list);
      if (!list.length) setNote('Nichts gefunden. Versuche es mit einem anderen Namen oder der Postleitzahl.');
    } catch {
      setFound(null); setNote('Keine Verbindung. Die Ortssuche und das Wetter brauchen Internet.');
    }
    setSearching(false);
  };
  const choose = (p: Place) => {
    set({ place: p }); setEditing(false); setFound(null);
    try { localStorage.setItem(PLACE, JSON.stringify(p)); } catch { /* only a convenience */ }
  };

  return (
    <div className="receipt-options">
      <Preview c={c} />
      {c.kind === 'clock' && (
        <Choices label="Uhr" value={c.face} onChange={(face) => set({ face })} options={[{ value: 'analog', label: 'Analog' }, { value: 'digital', label: 'Digital' }]}
          hint="Zeigt immer die echte Uhrzeit. Antippen sagt die Uhrzeit an." />
      )}
      {c.kind === 'timer' && (
        <>
          <Choices label="Art des Timers" value={c.timer} onChange={(timer) => set({ timer })} options={[{ value: 'fixed', label: 'Fest eingestellt' }, { value: 'flex', label: 'Flexibel' }]}
            hint={c.timer === 'fixed' ? 'Der Timer läuft los, sobald die Seite geöffnet wird – im Heft und auf der Tafel.' : 'Jedes Antippen stellt den Timer auf die nächsten 5 Minuten (aufgerundet: aus 3 Minuten werden 5, aus 6 werden 10) und er läuft gleich los. Nach 60 Minuten ist er wieder aus.'} />
          {c.timer === 'fixed' && (
            <>
              <Slider label="Zeit" value={c.minutes} min={1} max={60} format={(v) => `${v} Min.`} onChange={(minutes) => set({ minutes })} />
              <div className="receipt-option">
                <strong>Schnell wählen</strong>
                <Chips label="Schnell wählen" value={TIMER_MINUTES.includes(c.minutes) ? c.minutes : 0} options={TIMER_MINUTES.map((m) => ({ value: m, label: String(m) }))} onChange={(minutes) => set({ minutes })} />
              </div>
            </>
          )}
          <Toggle checked={!c.silent} label="Ton am Ende" hint="ein leiser Gong, wenn die Zeit um ist" onChange={(v) => set({ silent: !v })} />
        </>
      )}
      {c.kind === 'date' && (
        <>
          <p className="option-hint">Zeigt immer das heutige Datum: {dateText(new Date())}. Antippen liest Datum und Wetter vor.</p>
          <Toggle checked={weather} label="Wetter anzeigen" hint="in einem Wort mit Symbol – nur mit Internet" onChange={(v) => { setWeather(v); if (!v) set({ place: undefined }); else { const p = lastPlace(); if (p) { set({ place: p }); setEditing(false); } else setEditing(true); } }} />
          {weather && (
            <>
              {c.place && !editing && (
                <div className="time-place">
                  <strong>{c.place.name}</strong>
                  <button type="button" className="knopf compact" onClick={() => setEditing(true)}>Anderer Ort</button>
                </div>
              )}
              {c.place && !editing && online === false && <p className="option-hint" role="status">Gerade kein Wetter – vielleicht keine Internetverbindung. Mit Internet erscheint es von selbst.</p>}
              {(editing || !c.place) && (
                <>
                  <div className="time-search">
                    <input type="search" className="text-input" value={query} placeholder="Ort oder Postleitzahl, z. B. Regensburg" aria-label="Ort suchen" onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void search(); } }} />
                    <button type="button" className="knopf compact" disabled={searching || query.trim().length < 2} onClick={() => void search()}>{searching ? 'Sucht …' : 'Suchen'}</button>
                  </div>
                  {note && <p className="option-hint" role="status">{note}</p>}
                  {found && found.length > 0 && (
                    <div className="time-found" role="list">
                      {found.map((p) => (
                        <button key={`${p.lat},${p.lon}`} type="button" role="listitem" className="knopf" onClick={() => choose({ name: p.name, lat: p.lat, lon: p.lon })}>
                          <strong>{p.name}</strong>{p.detail && <small> {p.detail}</small>}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              <p className="option-hint">Das Wetter kommt von Open-Meteo.com (Daten: CC BY 4.0) über den Schulserver. Dafür gehen der gesuchte Ortsname und die Koordinaten des Orts dorthin – nichts über dich oder die Kinder.</p>
            </>
          )}
        </>
      )}
    </div>
  );
}
