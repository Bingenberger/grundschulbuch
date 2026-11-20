'use client';
// Settings of Programmieren with the choices of the reference's dialog: lesson,
// kind of task, input (cards or keys like a floor robot), help, words or
// numbers, difficulty, obstacles, carpet, number of tasks, figure, look, speed,
// voice – and the robot itself as a playable preview. As in Lernsachen-Heft
// 1.49.0 the tasks can be gone through one by one, thrown again, deleted,
// added, and built on the carpet (figure, goal, obstacles, stars, moving).
import { useLayoutEffect, useRef, useState } from 'react';
import { codeCarpet } from '@/lib/sheets/sheets-1473';
import { applyTool, cellAt, cellBox, changeSettings, checkTask, codeTools, freshTasks, renewKeepingOwn, TOOL_HINTS, TOOL_LABELS, type Cell, type CodeTask, type CodeTool } from '@/lib/learning/code-editor';
import type { JsonValue } from '@/lib/learning/catalog';
import { CODE_CARPETS, CODE_CHOICES, CODE_COSTUMES, CODE_CSS, CODE_RANGES, CODE_SIZES, carpetPicture, codeLevelHint, codeWithoutPad, costumePicture, renderCode } from '@/lib/reference/tools-runtime';
import { fingerprint } from '@/lib/learning/werkzeuge';
import { codeSettings } from './CodeWidget';
import ToolForm, { type Draft, type Field } from './ToolForm';

type Option = { value: string | number; label: string };
const choices = CODE_CHOICES as unknown as Record<string, Option[]>;
const svg = (markup: unknown) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(String(markup))}`;
const hasPad = (d: Draft) => d.input === 'pad' && !codeWithoutPad(d.lesson);

const FIELDS: Field[] = [
  { t: 'choice', key: 'lesson', label: 'Lektion', options: choices.lesson },
  { t: 'choice', key: 'read', label: 'Art', options: choices.read, when: (d) => d.lesson === 'read' },
  { t: 'choice', key: 'penMode', label: 'Stift', options: choices.penMode, when: (d) => d.lesson === 'pen',
    hint: (d) => (d.penMode === 'free' ? 'Kein Prüfen: Die Figur malt, was das Programm sagt – mit Farben und „wiederhole“.' : 'Eine Form steht blass auf dem Teppich. Geprüft wird, ob genau ihre Linien gezeichnet wurden.') },
  { t: 'toggle', key: 'limit', label: 'Höchstzahl an Bausteinen' },
  { t: 'toggle', key: 'rate', label: 'Sterne fürs kürzeste Programm', hint: 'Nach dem Ziel: 3 Sterne, wenn es nicht kürzer geht, sonst 2 oder 1 – mit dem Hinweis, mit wie vielen Bausteinen es geht.' },
  { t: 'choice', key: 'input', label: 'Eingabe', options: choices.input,
    hint: (d) => (d.input === 'pad' ? 'Pfeiltasten, LOS, Pause und Löschen wie auf dem Rücken eines Bodenroboters.' : 'Bausteine antippen – sie kommen als Karten ins Programm.') },
  { t: 'choice', key: 'pad', label: 'Tasten', options: (d) => (d.lesson === 'music' ? choices.pad.slice(0, 1) : choices.pad), when: hasPad,
    hint: (d) => (d.pad === 'now' ? 'Jede Taste bewegt die Figur sofort – für den allerersten Einstieg.' : 'Die Befehle werden gemerkt und mit LOS ausgeführt.') },
  { t: 'toggle', key: 'memory', label: 'Gemerkte Befehle zeigen', hint: 'Unter den Tasten erscheinen die eingegebenen Befehle als kleine Karten.', when: (d) => hasPad(d) && d.pad === 'store' },
  { t: 'toggle', key: 'peek', label: 'Hilfe: Weg zeigen', hint: 'Ein Knopf mit einem Auge zeichnet den Weg des Programms kurz auf den Teppich (3 Sekunden).' },
  { t: 'lines', key: 'words', label: 'Wörter', hint: 'Ein Wort pro Zeile, 2 bis 8 Buchstaben, je Aufgabe ein Wort', max: 30, when: (d) => d.lesson === 'word' },
  { t: 'choice', key: 'range', label: 'Zahlenraum', options: (CODE_RANGES as unknown as number[]).map((n) => ({ value: n, label: `bis ${n}` })), when: (d) => d.lesson === 'math' || d.lesson === 'numbers' },
  { t: 'choice', key: 'ops', label: 'Rechenart', options: choices.ops, when: (d) => d.lesson === 'math' },
  { t: 'toggle', key: 'numMat', label: 'Zahlen-Teppich', hint: 'Auf jedem Feld steht eine Zahl (1, 2, 3 …) – mit 10 × 10 Feldern wie eine Hundertertafel.', when: (d) => d.lesson === 'math' || d.lesson === 'numbers' },
  { t: 'choice', key: 'level', label: 'Schwierigkeit', options: choices.level, hint: (d) => String(codeLevelHint(codeSettings(d)) ?? '') },
  { t: 'choice', key: 'walls', label: 'Hindernisse', options: choices.walls, when: (d) => d.lesson !== 'pen' },
  { t: 'toggle', key: 'turn', label: 'Startrichtung zufällig', hint: 'Sonst schaut die Figur am Anfang immer nach oben.', when: (d) => d.lesson !== 'pen' },
  { t: 'choice', key: 'size', label: 'Teppich', options: (CODE_SIZES as unknown as number[]).map((n) => ({ value: n, label: `${n} × ${n}` })) },
  { t: 'choice', key: 'count', label: 'Aufgaben nacheinander', options: Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: String(i + 1) })), hint: 'Danach kommt eine Auswertung: Zeit und Versuche.', when: (d) => d.lesson !== 'pen' || d.penMode !== 'free' },
  { t: 'gallery', key: 'costume', label: 'Figur', options: (CODE_COSTUMES as unknown as { id: string; nom: string }[]).map((c) => ({ id: c.id, label: c.nom.replace(/^\S+ /, ''), src: svg(costumePicture(c.id)) })) },
  { t: 'gallery', key: 'mat', label: 'Aussehen', options: (CODE_CARPETS as unknown as { id: string; label: string }[]).map((c) => ({ id: c.id, label: c.label, src: svg(carpetPicture(c.id)) })) },
  { t: 'choice', key: 'speed', label: 'Tempo der Figur', options: choices.speed },
  { t: 'toggle', key: 'voice', label: 'Sprachausgabe', hint: 'Bausteine, Hinweise und Ergebnisse werden vorgelesen.' },
];

function Preview({ pg }: { pg: Record<string, unknown> }) {
  const box = useRef<HTMLDivElement>(null);
  const id = `code-preview-${fingerprint(pg)}`;
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    el.replaceChildren();
    delete el.dataset.k;
    renderCode(el, { id, w: 1300, h: 870, locked: true, pg }, true, {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="tool-preview" style={{ aspectRatio: '1300 / 870' }}>
      <style>{CODE_CSS}</style>
      <div ref={box} className="reference-widget lh-wg-code is-live" role="group" aria-label="Vorschau zum Ausprobieren" style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}

export default function CodeOptions({ value, onChange, upload, busy }: { value: unknown; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean }) {
  const pg = codeSettings(value);
  const tasks = pg.tasks as CodeTask[];
  const [index, setIndex] = useState(0);
  const [tool, setTool] = useState<CodeTool | null>(null);
  const [pick, setPick] = useState<Cell | null>(null);
  const at = Math.min(index, tasks.length - 1), task = tasks[at];
  const tools = codeTools(pg);
  const save = (next: Record<string, unknown>) => onChange(codeSettings(next) as unknown as JsonValue);
  const setTasks = (list: CodeTask[], go = at) => { save({ ...pg, count: list.length, tasks: list }); setIndex(go); setPick(null); };
  const check = checkTask(pg, task);
  const carpet = tool ? svg(codeCarpet(pg, task)) : '';
  const tap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tool) return;
    const box = e.currentTarget.getBoundingClientRect();
    const cell = cellAt(task.n, (e.clientX - box.left) / box.width, (e.clientY - box.top) / box.height);
    if (!cell) return;
    const r = applyTool(task, tool, cell[0], cell[1], pick);
    if (r.t !== task) save({ ...pg, tasks: tasks.map((t, i) => (i === at ? r.t : t)) });
    setPick(r.pick);
  };
  const mark = pick && cellBox(task.n, pick[0], pick[1]);
  return (
    <div className="receipt-options tool-options code-options">
      <div className="code-nav">
        <button type="button" className="knopf compact" aria-label="Aufgabe davor" disabled={at <= 0} onClick={() => { setIndex(at - 1); setPick(null); }}>‹</button>
        <strong>Aufgabe {at + 1} von {tasks.length}{task.own ? ' · eigene' : ''}</strong>
        <button type="button" className="knopf compact" aria-label="Nächste Aufgabe" disabled={at >= tasks.length - 1} onClick={() => { setIndex(at + 1); setPick(null); }}>›</button>
      </div>
      {tool ? (
        <div className={`code-board${tool ? ' is-editing' : ''}`} onClick={tap}>
          {/* eslint-disable-next-line @next/next/no-img-element -- The carpet drawn by the reference. */}
          <img src={carpet} alt={`Teppich der Aufgabe ${at + 1}`} draggable={false} />
          {mark && <span className="code-pick" style={{ left: `${mark.left * 100}%`, top: `${mark.top * 100}%`, width: `${mark.w * 100}%`, height: `${mark.h * 100}%` }} />}
        </div>
      ) : (
        <>
          <Preview pg={{ ...pg, tasks: [task], count: 1 }} />
          <p className="option-hint">Probier es aus: Bausteine antippen und das Programm laufen lassen.</p>
        </>
      )}
      {tools.length > 0 && (
        <div className="code-build">
          <strong>Selbst bauen:</strong>
          <div className="sheet-chips" role="radiogroup" aria-label="Werkzeug">
            {tools.map((t) => (
              <button key={t} type="button" role="radio" aria-checked={tool === t} className={`sheet-chip${tool === t ? ' is-active' : ''}`} onClick={() => { setTool(tool === t ? null : t); setPick(null); }}>
                {TOOL_LABELS[t]}
              </button>
            ))}
          </div>
          <p className="option-hint">{tool ? TOOL_HINTS[tool] : 'Wähle ein Werkzeug und tippe in die Vorschau.'}</p>
        </div>
      )}
      <p className={`code-check${check.ok ? '' : ' is-bad'}`} role="status">{check.ok ? '✓ ' : '✗ '}{check.text || 'In Ordnung.'}</p>
      <div className="learning-actions code-taskbar">
        <button type="button" className="knopf compact" onClick={() => setTasks(tasks.map((t, i) => (i === at ? freshTasks({ ...pg, count: 1 }, codeSettings)[0] : t)))}>Diese neu</button>
        <button type="button" className="knopf compact" disabled={tasks.length <= 1} onClick={() => setTasks(tasks.filter((_, i) => i !== at), Math.max(0, at - 1))}>Löschen</button>
        <button type="button" className="knopf compact" disabled={tasks.length >= 10} onClick={() => setTasks([...tasks, freshTasks({ ...pg, count: 1 }, codeSettings)[0]], tasks.length)}>+ Aufgabe</button>
        <button type="button" className="knopf compact" onClick={() => setTasks(renewKeepingOwn(pg, codeSettings))}>Alle anderen neu</button>
      </div>
      <p className="option-hint">Jede ausgewürfelte Aufgabe ist lösbar. Selbst gebaute Aufgaben („eigene“) bleiben, wenn du Einstellungen änderst oder neue Aufgaben würfelst – außer bei einer anderen Lektion oder Teppichgröße.</p>
      <ToolForm fields={FIELDS} value={pg} onChange={(d) => { const next = changeSettings(pg, d, codeSettings); if (next.lesson !== pg.lesson) setTool(null); save(next); setIndex((i) => Math.min(i, (next.tasks as unknown[]).length - 1)); }} upload={upload} busy={busy} />
    </div>
  );
}
