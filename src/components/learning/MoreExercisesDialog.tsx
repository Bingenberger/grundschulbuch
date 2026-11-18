'use client';
// „Weitere Übung“ wie in Lernsachen-Heft: aus einer Übung von Textsachen weitere
// Übungen mit demselben Text oder denselben Wörtern, jede auf einer eigenen Seite.
import { useEffect, useState } from 'react';
import Icon, { type IconName } from '../Icon';
import type { Page, PageElement } from '@/lib/notebook-model';
import type { JsonValue } from '@/lib/learning/catalog';
import { fullPageWidget } from '@/lib/learning/blocks';
import { moreExercise, moreExercises, TS_MODES, tsConfig, type MoreOption } from '@/lib/learning/textsachen';

export default function MoreExercisesDialog({
  element,
  onInsert,
  onClose,
}: {
  element: PageElement;
  onInsert: (pages: Page[]) => void;
  onClose: () => void;
}) {
  const config = tsConfig(element.settings?.ts);
  const options = moreExercises(config);
  const [chosen, setChosen] = useState<string[]>([]);
  const key = (o: MoreOption) => `${o.kind}:${o.mode}`;
  const toggle = (o: MoreOption) => setChosen((list) => (list.includes(key(o)) ? list.filter((k) => k !== key(o)) : [...list, key(o)]));
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  const tile = (o: MoreOption) => {
    const on = chosen.includes(key(o)), info = TS_MODES[o.mode];
    return (
      <button
        type="button"
        key={key(o)}
        className={`more-ex${on ? ' is-on' : ''}`}
        aria-pressed={on}
        disabled={!!o.reason}
        onClick={() => toggle(o)}
      >
        <span className="more-ex-icon"><Icon name={info.icon as IconName} size={26} /></span>
        <span className="more-ex-text">
          <strong>{info.label}</strong>
          <small>{o.reason ?? info.desc}</small>
        </span>
        <span className="more-ex-check" aria-hidden="true">{on && <Icon name="ok" size={18} />}</span>
      </button>
    );
  };
  const insert = () => {
    const all = [...options.text, ...options.words].filter((o) => chosen.includes(key(o)));
    onInsert(all.flatMap((o) => fullPageWidget('textsachen', { ...element.settings, ts: moreExercise(config, o) as unknown as JsonValue })));
  };
  const fromText = config.kind === 'text';
  const sample = options.derived.slice(0, 8).map((w) => w.text);

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal more-ex-dialog" role="dialog" aria-modal="true" aria-labelledby="more-ex-title">
        <h2 id="more-ex-title">Weitere Übung</h2>
        <p>
          Mit {fromText ? 'demselben Text' : 'denselben Wörtern'} – jede Übung kommt auf eine eigene Seite hinter dieser. Du kannst
          mehrere wählen; ändern lässt sich jede später mit „Aufgabe gestalten“.
        </p>
        {fromText && (
          <>
            <h3 className="more-ex-h">Mit dem Text</h3>
            <div className="more-ex-grid">{options.text.map(tile)}</div>
            {config.mode === 'explain' && (
              <p className="option-hint">Die leeren Zeilen des Erklärbärs (Szenen) werden für die anderen Übungen zu einem durchgehenden Text.</p>
            )}
            <h3 className="more-ex-h">Mit den Wörtern des Textes</h3>
            <p className="option-hint">
              {options.derived.length
                ? `${options.derived.length} ${options.derived.length === 1 ? 'Wort' : 'Wörter'} – die ${options.derived.some((w) => w.image) ? 'Bildwörter' : 'Lernwörter'} des Textes: ${sample.join(', ')}${options.derived.length > sample.length ? ' …' : '.'}`
                : 'Der Text hat noch keine Lernwörter.'}
            </p>
          </>
        )}
        {options.words.length > 0 && <div className="more-ex-grid">{options.words.map(tile)}</div>}
        <div className="dialog-actions">
          <button type="button" className="knopf" onClick={onClose}>Abbrechen</button>
          <button type="button" className="knopf knopf-haupt" disabled={!chosen.length} onClick={insert}>
            {chosen.length > 1 ? `${chosen.length} Übungen einfügen` : 'Übung einfügen'}
          </button>
        </div>
      </section>
    </div>
  );
}
