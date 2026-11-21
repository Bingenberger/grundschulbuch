'use client';
// Settings of the “Aufgabenpäckchen”: a ready-made script or an own one in the
// task language, how many runs, columns, Lösungskontrolle – with a preview of
// exactly the tasks that come onto the page.
import type { JsonValue } from '@/lib/learning/catalog';
import { FUNCTIONS, generate, paeckchenConfig, paeckchenSize, RECIPES, redraw, type PaeckchenSettings } from '@/lib/learning/paeckchen';
import Icon from '../Icon';
import { Chips, Slider } from '../sheets/SheetParts';
import { PaeckchenSheet } from './PaeckchenWidget';

const SHOWN_FUNCTIONS = ['einer', 'zehner', 'hunderter', 'abrunden', 'aufrunden', 'runden', 'ganz', 'rest', 'teilbar', 'uebergang_plus', 'uebergang_minus', 'vergleich'];
const umlauts = (name: string) => name.replace('uebergang', 'übergang');

export default function PaeckchenOptions({ value, onChange }: { value: JsonValue | undefined; onChange: (v: JsonValue) => void }) {
  const c = paeckchenConfig(value);
  const { errors, perRun } = generate(c.script, 1, c.seed, c.order);
  /** New script, count or order: tasks drawn again with the same seed. */
  const set = (v: Partial<PaeckchenSettings>) => {
    const next = { ...c, ...v };
    const fresh = 'script' in v || 'count' in v || 'order' in v;
    onChange((fresh ? { ...next, tasks: generate(next.script, next.count, next.seed, next.order).tasks } : next) as unknown as JsonValue);
  };
  const recipe = RECIPES.find((r) => r.script === c.script)?.id ?? '';
  const size = paeckchenSize(c);
  const scale = Math.min(1, 150 / size.width);
  return (
    <div className="receipt-options pk-options">
      <div className="receipt-option">
        <strong>Vorlage</strong>
        <Chips
          label="Vorlage"
          value={recipe}
          onChange={(id) => { const r = RECIPES.find((x) => x.id === id); if (r) set({ script: r.script, count: r.count ?? 12 }); }}
          options={[...RECIPES.map((r) => ({ value: r.id, label: r.title })), ...(recipe ? [] : [{ value: '', label: 'Eigenes Skript' }])]}
        />
        <p className="option-hint">Eine Vorlage füllt das Skript unten – du kannst es danach beliebig ändern.</p>
      </div>
      <label className="receipt-option">
        <strong>So werden die Aufgaben gebaut</strong>
        <textarea
          className="pk-script"
          aria-label="Aufgabenskript"
          aria-invalid={errors.length > 0}
          value={c.script}
          rows={Math.min(14, Math.max(5, c.script.split('\n').length + 1))}
          spellCheck={false}
          maxLength={4000}
          onChange={(e) => set({ script: e.target.value })}
        />
      </label>
      {errors.length > 0 ? (
        <ul className="pk-errors" role="alert">
          {errors.map((e, i) => <li key={i}>{e.line ? `Zeile ${e.line}: ` : ''}{e.message}</li>)}
        </ul>
      ) : (
        <p className="option-hint">{perRun > 1 ? `Jeder Durchgang gibt ${perRun} Aufgaben mit denselben Zahlen.` : 'Jeder Durchgang gibt eine Aufgabe.'}</p>
      )}
      <details className="pk-help">
        <summary><Icon name="questions" size={18} /> So schreibt man Aufgaben</summary>
        <dl>
          <dt><code>a = 11..99</code> oder <code>a = 11 bis 99</code></dt><dd>eine zufällige Zahl von 11 bis 99 (auch <code>a = 0..100 schritt 5</code>)</dd>
          <dt><code>b = 2, 5, 10</code></dt><dd>eine dieser Zahlen</dd>
          <dt><code>b = 1..100 − a</code></dt><dd>Grenzen dürfen ausgerechnet werden – so bleibt a + b höchstens 100</dd>
          <dt><code>u = abrunden(a, 10)</code></dt><dd>eine Zahl ausrechnen</dd>
          <dt><code>wenn einer(a) ≠ 0</code></dt><dd>nur Zahlen, die passen (mit <code>und</code>, <code>oder</code>, <code>nicht</code>, <code>&lt; &gt; ≤ ≥ = ≠</code>)</dd>
          <dt><code>a + [o − a] = o</code></dt><dd>eine Aufgabe: was in <code>[ ]</code> steht, ist ein Kästchen mit diesem Ergebnis; Namen werden durch ihre Zahlen ersetzt, <code>{'{2 · a}'}</code> wird ausgerechnet</dd>
          <dt><code># …</code></dt><dd>eine Notiz, die nicht mitzählt</dd>
        </dl>
        <p>Rechenzeichen: <code>+ − · :</code> (auch <code>- * /</code>). Funktionen:</p>
        <ul className="pk-functions">
          {SHOWN_FUNCTIONS.map((f) => <li key={f}><code>{umlauts(FUNCTIONS[f].help ?? `${f}(…)`)}</code></li>)}
        </ul>
        <p>Mehrere Aufgabenzeilen geben ein Päckchen mit denselben Zahlen, z. B. erst Mal, dann Geteilt. Steht zwischen zwei Aufgaben eine Zeile <code>oder</code>, kommt pro Durchgang nur eine der beiden – zufällig, z. B. abziehen oder ergänzen.</p>
      </details>
      <Slider label="Anzahl" value={c.count} min={1} max={40} format={(v) => (perRun > 1 ? `${v} × ${perRun} = ${v * perRun} Aufgaben` : v === 1 ? '1 Aufgabe' : `${v} Aufgaben`)} onChange={(count) => set({ count })} />
      <div className="receipt-option">
        <strong>Spalten</strong>
        <Chips label="Spalten" value={c.columns} onChange={(columns) => set({ columns })} options={[1, 2, 3, 4].map((n) => ({ value: n, label: String(n) }))} />
      </div>
      {perRun > 1 && (
        <div className="receipt-option">
          <strong>Reihenfolge</strong>
          <Chips label="Reihenfolge" value={c.order} onChange={(order) => set({ order })} options={[{ value: 'script', label: 'Päckchen zusammen' }, { value: 'mixed', label: 'Gemischt' }]} />
        </div>
      )}
      <div className="receipt-option">
        <strong>Lösungskontrolle</strong>
        <Chips label="Lösungskontrolle" value={c.check} onChange={(check) => set({ check })} options={[{ value: 'none', label: 'Keine' }, { value: 'each', label: 'Sofort ✓ ✗' }, { value: 'button', label: 'Knopf „Prüfen“' }]} />
        <p className="option-hint">Gedruckt wird immer ein normales Arbeitsblatt mit leeren Kästchen.</p>
      </div>
      <div className="receipt-option">
        <div className="pk-preview-head">
          <strong>Vorschau</strong>
          <button type="button" className="knopf compact" disabled={errors.length > 0} onClick={() => onChange(redraw(c) as unknown as JsonValue)}>
            <Icon name="synchronize" size={18} /> Neue Zahlen
          </button>
        </div>
        <div className="pk-preview" style={{ width: `${size.width * scale}mm`, height: `${size.height * scale}mm` }}>
          {errors.length === 0 && <PaeckchenSheet c={c} width={size.width * scale} height={size.height * scale} />}
        </div>
      </div>
    </div>
  );
}
