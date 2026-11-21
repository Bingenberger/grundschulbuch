'use client';
// “Aufgabenpäckchen” on the page: the tasks drawn from the task script, each
// gap a box to type into. With a Lösungskontrolle a ✓ or ✗ appears (at once or
// after “Prüfen”). Printed, it is an ordinary worksheet: empty boxes, no marks,
// no button.
import { useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { boxEm, columnsOf, FONT_MM, gapIndex, groupOf, isRight, paeckchenConfig, paeckchenSize, score, tasksKey, type PaeckchenSettings } from '@/lib/learning/paeckchen';
import { useLearning } from './Runtime';

type Kept = { key: string; answers: string[]; checked?: string[] };

const Mark = ({ ok }: { ok: boolean }) => (
  <svg className={`pk-mark is-${ok ? 'ok' : 'bad'}`} viewBox="0 0 100 100" role="img" aria-label={ok ? 'richtig' : 'falsch'}>
    <circle cx="50" cy="50" r="47" fill={ok ? '#16a34a' : '#dc2626'} stroke="#fff" strokeWidth="6" />
    {ok ? <path d="M27 52l15 15 32-34" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M33 33l34 34M67 33L33 67" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" />}
  </svg>
);

/** The tasks as a block; `answers` and `onAnswer` make the boxes fillable. */
export function PaeckchenSheet({ c, width, height, answers = [], checked, onAnswer, onCheck, live = false }: {
  c: PaeckchenSettings; width: number; height: number; answers?: string[]; checked?: string[];
  onAnswer?: (index: number, text: string) => void; onCheck?: () => void; live?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const natural = paeckchenSize(c);
  const scale = Math.min(width / natural.width, height / natural.height);
  const { starts } = gapIndex(c.tasks);
  const box = boxEm(c.tasks);
  const shown = (i: number) => !!answers[i]?.trim() && (c.check === 'each' || (c.check === 'button' && checked?.[i] === answers[i]));
  const s = score(c.tasks, answers);
  const focusBox = (i: number) => root.current?.querySelector<HTMLInputElement>(`[data-gap="${i}"]`)?.focus();
  if (!c.tasks.length) return <div className="paeckchen is-empty">Noch keine Aufgaben – bitte unter „Aufgabe gestalten“ das Skript prüfen.</div>;
  return (
    <div ref={root} className={`paeckchen${live ? ' is-live' : ''}`} style={{ fontSize: `${FONT_MM * scale}mm` }}>
      <div className="pk-columns">
        {columnsOf(c.tasks, c.columns, groupOf(c)).map((col, ci) => (
          <div key={ci} className="pk-column">
            {col.map((group, gi) => (
              <div key={gi} className="pk-group">
                {group.map((ti) => {
                  let gap = starts[ti];
                  return (
                    <div key={ti} className="pk-task">
                      {c.tasks[ti].parts.map((p, pi) => {
                        if ('s' in p) return <span key={pi} className="pk-text">{p.s}</span>;
                        const i = gap++;
                        const numeric = /^[−-]?\d+(,\d+)?$/.test(p.a);
                        return (
                          <span key={pi} className="pk-gap" style={{ width: `${box}em` }}>
                            <input
                              data-gap={i}
                              className="pk-box"
                              aria-label={`Lücke ${i + 1}`}
                              value={answers[i] ?? ''}
                              readOnly={!onAnswer}
                              tabIndex={onAnswer ? 0 : -1}
                              inputMode={numeric ? (p.a.includes(',') ? 'decimal' : 'numeric') : 'text'}
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              maxLength={12}
                              onPointerDown={(e) => { if (onAnswer) { e.stopPropagation(); e.currentTarget.focus({ preventScroll: true }); } }}
                              onDoubleClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === 'Enter') { e.preventDefault(); focusBox(i + 1); }
                              }}
                              onChange={(e) => onAnswer?.(i, e.target.value)}
                            />
                            {shown(i) && <Mark ok={isRight(answers[i], p.a)} />}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
      {c.check === 'button' && (
        <div className="pk-foot">
          <button type="button" className="pk-check" disabled={!onCheck} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onCheck?.(); }}>
            Prüfen
          </button>
          {checked && checked.some(Boolean) && <span className="pk-score" role="status">{s.right} von {s.total} richtig{s.right === s.total ? ' – super!' : ''}</span>}
        </div>
      )}
    </div>
  );
}

export default function PaeckchenWidget({ element }: { element: PageElement }) {
  const { state, update, interactive } = useLearning(element);
  const c = paeckchenConfig(element.settings?.paeckchen);
  const key = tasksKey(c.tasks);
  const raw = (state as { pk?: Kept }).pk;
  const kept: Kept = raw && raw.key === key ? raw : { key, answers: [] };
  const save = (next: Partial<Kept>) => update({ pk: { ...kept, ...next } } as never);
  return (
    <PaeckchenSheet
      c={c}
      width={element.width}
      height={element.height}
      answers={kept.answers}
      checked={kept.checked}
      live={interactive}
      onAnswer={interactive ? (i, text) => { const answers = [...kept.answers]; answers[i] = text; for (let n = 0; n < answers.length; n++) answers[n] ??= ''; save({ answers }); } : undefined}
      onCheck={interactive ? () => {
        const s = score(c.tasks, kept.answers);
        update({ pk: { ...kept, checked: [...kept.answers] }, score: s.total ? Math.round((s.right / s.total) * 100) : 0 } as never);
      } : undefined}
    />
  );
}
