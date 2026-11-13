/* eslint-disable @next/next/no-img-element -- School media. */
'use client';
// Settings of a Textsachen exercise, laid out like the editor of Textsachen:
// kind of exercise, words or text, pictures, the part for the exercise, font,
// helps for the children, voice – and the checklist.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { JsonValue } from '@/lib/learning/catalog';
import {
  MEMORY_BACKS, MEMORY_COLORS, TS_FONTS, TS_GROUPS, TS_MODES, lower, modesOf, pictureOf, pictureWords, textWords, tsConfig, tsProblems, withoutArticle,
  type TsConfig, type TsKind, type TsMode, type TsSettings,
} from '@/lib/learning/textsachen';
import { findPicture } from '@/lib/learning/picture-search';
import Icon, { type IconName } from '../Icon';
import { Chips, Slider, Toggle } from '../sheets/SheetParts';

type Props = { value: unknown; onChange: (v: JsonValue) => void; upload: (file: File, done: (src: string) => void) => Promise<void>; busy: boolean };

function Part({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="ts-part">
      <h4>{title}</h4>
      {children}
    </section>
  );
}

export default function TextsachenOptions({ value, onChange, upload, busy }: Props) {
  const c = tsConfig(value);
  const latest = useRef(c);
  useLayoutEffect(() => { latest.current = c; });
  const set = (next: Partial<TsConfig>) => onChange({ ...latest.current, ...next } as unknown as JsonValue);
  const setting = <K extends keyof TsSettings>(key: K, v: TsSettings[K]) => set({ settings: { ...latest.current.settings, [key]: v } });
  const s = c.settings;

  // Pictures: set one, and look for missing ones by themselves like Textsachen.
  const setPicture = (word: string, image?: string) => {
    const now = latest.current;
    if (now.kind === 'words') set({ words: now.words.map((w) => (w.text.trim() === word ? { text: w.text, ...(image ? { image } : {}) } : w)) });
    else set({ pictures: [...now.pictures.filter((p) => p.word !== lower(word)), ...(image ? [{ word: lower(word), image }] : [])] });
  };
  const searched = useRef(new Set<string>());
  const [searching, setSearching] = useState(0);
  const [note, setNote] = useState('');
  const [auto, setAuto] = useState(true);
  const [retry, setRetry] = useState(0);
  const missing = pictureWords(c).filter((w) => !pictureOf(c, w));
  const missingKey = missing.join('\n');
  useEffect(() => {
    if (!auto) return;
    const todo = missing.filter((w) => !searched.current.has(lower(w))).slice(0, 20);
    if (!todo.length) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(todo.length);
      for (const word of todo) {
        searched.current.add(lower(word));
        try {
          const src = await findPicture(withoutArticle(word), controller.signal);
          if (src && !pictureOf(latest.current, word)) setPicture(word, src);
        } catch (e) {
          if (controller.signal.aborted) return;
          setNote((e as Error).message);
          break;
        } finally {
          setSearching((n) => Math.max(0, n - 1));
        }
      }
    }, 1200);
    return () => { window.clearTimeout(timer); controller.abort(); setSearching(0); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingKey, auto, retry]);

  const words = textWords(c.text);
  const problems = tsProblems(c);
  const setKind = (kind: TsKind) => set({ kind, mode: c.mode === 'flash' ? 'flash' : modesOf(kind)[0] });
  const modeCards = (modes: TsMode[]) => (
    <div className="ts-modes" role="radiogroup" aria-label="Übungsart">
      {modes.map((m) => (
        <button key={m} type="button" role="radio" aria-checked={c.mode === m} className={`ts-mode${c.mode === m ? ' is-active' : ''}`} onClick={() => set({ mode: m })}>
          <Icon name={TS_MODES[m].icon as IconName} size={26} />
          <strong>{TS_MODES[m].label}</strong>
          <span>{m === 'flash' && c.kind === 'text' ? 'Ein Lernwort blitzt kurz auf, dann wird das passende Bild angetippt.' : TS_MODES[m].desc}</span>
        </button>
      ))}
    </div>
  );
  const toPictures = (text: string) => <p className="option-hint">{text}</p>;

  return (
    <div className="receipt-options ts-options">
      <Part title="Inhalt">
        <Chips label="Inhalt" value={c.kind} onChange={setKind} options={[{ value: 'words', label: 'Wortliste' }, { value: 'text', label: 'Text' }]} />
        {c.kind === 'words' ? (
          <label className="property-label">
            Wörter, je eines pro Zeile – gern mit Artikel (die Sonne)
            <textarea aria-label="Wörter der Übung" rows={6} value={c.words.map((w) => w.text).join('\n')} onChange={(e) => {
              const lines = e.target.value.split('\n').slice(0, 60);
              set({ words: lines.map((text) => ({ text, ...(latest.current.words.find((w) => w.text.trim() === text.trim() && w.image) ? { image: latest.current.words.find((w) => w.text.trim() === text.trim())!.image } : {}) })) });
            }} />
          </label>
        ) : (
          <>
            <label className="property-label">
              Text
              <textarea aria-label="Text der Übung" rows={6} value={c.text} onChange={(e) => {
                const before = textWords(latest.current.text), after = textWords(e.target.value);
                // Keep the learning words where they still are.
                set({ text: e.target.value, learn: latest.current.learn.filter((i) => before[i] !== undefined && after[i] === before[i]) });
              }} />
            </label>
            <div className="ts-learn" role="group" aria-label="Lernwörter wählen">
              <strong>Lernwörter – antippen zum Wählen</strong>
              <p>
                {words.map((w, i) => (
                  <button key={i} type="button" aria-pressed={c.learn.includes(i)} className={`ts-word${c.learn.includes(i) ? ' is-learn' : ''}`} onClick={() => set({ learn: c.learn.includes(i) ? c.learn.filter((n) => n !== i) : [...c.learn, i].sort((a, b) => a - b) })}>
                    {w}
                  </button>
                ))}
              </p>
              <small>Lernwörter werden im Lückentext zu Lücken (höchstens eine pro Satz) und kommen im Bilder-Quiz und beim Blitzlesen vor.</small>
            </div>
          </>
        )}
      </Part>

      <Part title="Übungsart">
        {TS_GROUPS.filter((g) => g.kind === c.kind).map((g) => (
          <div key={g.title} className="receipt-option">
            <strong>{g.title}</strong>
            {modeCards(g.modes)}
          </div>
        ))}
      </Part>

      <Part title={c.kind === 'words' ? 'Bilder zu den Wörtern' : 'Bilder zu den Lernwörtern'}>
        <Toggle checked={auto} label="Bilder automatisch suchen" hint="Fehlende Bilder werden in den ARASAAC-Piktogrammen gesucht (Sergio Palao, CC BY-NC-SA 4.0)." onChange={setAuto} />
        {c.mode === 'picture' && toPictures('Für das Bilddiktat braucht jedes Wort ein Bild. Wörter ohne Bild werden übersprungen.')}
        {searching > 0 && <p className="option-hint" role="status">Bilder werden gesucht …</p>}
        {note && <p className="option-hint" role="status">{note}</p>}
        <div className="ts-pictures">
          {pictureWords(c).map((word, i) => {
            const image = pictureOf(c, word);
            return (
              <div key={word + i} className="ts-picture">
                {image ? <img src={image} alt={word} /> : <span className="ts-picture-empty" aria-hidden="true">?</span>}
                <strong>{word}</strong>
                <span className="ts-picture-actions">
                  <label className="knopf compact">
                    {image ? 'Ändern' : 'Bild wählen'}
                    <input className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label={`Bild für ${word} wählen`} disabled={busy} onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void upload(file, (src) => setPicture(word, src));
                      e.target.value = '';
                    }} />
                  </label>
                  {image && <button type="button" className="knopf compact" aria-label={`Bild für ${word} entfernen`} onClick={() => { searched.current.add(lower(word)); setPicture(word); }}>Ohne Bild</button>}
                  {!image && <button type="button" className="knopf compact" aria-label={`Bild für ${word} suchen`} onClick={() => { searched.current.delete(lower(word)); setAuto(true); setNote(''); setRetry((n) => n + 1); }}>Suchen</button>}
                </span>
              </div>
            );
          })}
        </div>
      </Part>

      {c.mode === 'memory' && (
        <Part title="Memory">
          <Chips label="Die Paare" value={s.memoryPairs} onChange={(v) => setting('memoryPairs', v)} options={[{ value: 'picture', label: 'Bild – Bild' }, { value: 'word', label: 'Bild – Wort' }, { value: 'sound', label: 'Bild – Ton' }]} />
          {toPictures(`${s.memoryPairs === 'picture' ? 'Zwei gleiche Bilder sind ein Paar.' : s.memoryPairs === 'word' ? 'Zu jedem Bild gehört eine Karte mit dem Wort.' : 'Zu jedem Bild gehört eine Ton-Karte: Beim Aufdecken spricht die Computerstimme das Wort.'} Bei einem Paar wird das Wort vorgelesen.`)}
          <Chips label="Spieler" value={s.memoryPlayers} onChange={(v) => setting('memoryPlayers', v)} options={[{ value: 1, label: 'Allein' }, { value: 2, label: 'Zu zweit' }]} />
          <Slider label="Paare in einem Spiel" value={s.memoryMax} min={3} max={15} format={(v) => `${v} Paare`} hint="Gibt es mehr Wörter mit Bild, kommt jedes Mal eine andere Auswahl ins Spiel." onChange={(v) => setting('memoryMax', v)} />
          <div className="receipt-option">
            <strong>Rückseite der Karten</strong>
            <Chips label="Rückseite der Karten" value={s.memoryBack} onChange={(v) => setting('memoryBack', v)} options={MEMORY_BACKS.map((b) => ({ value: b.id, label: b.label }))} />
            <div className="ts-colors" role="radiogroup" aria-label="Farbe der Rückseite">
              {MEMORY_COLORS.map((m) => (
                <button key={m.id} type="button" role="radio" aria-checked={s.memoryColor === m.id} aria-label={m.label} title={m.label} className={`ts-color${s.memoryColor === m.id ? ' is-active' : ''}`} style={{ background: `linear-gradient(135deg, ${m.bg} 50%, ${m.ink} 50%)` }} onClick={() => setting('memoryColor', m.id)} />
              ))}
            </div>
          </div>
          {toPictures('Jedes Wort braucht ein Bild – Wörter ohne Bild kommen nicht vor.')}
        </Part>
      )}
      {c.mode === 'mouse' && (
        <Part title="Maus & Käse">
          <Slider label="Schritte bis zum Käse" value={s.mouseSteps} min={5} max={12} format={(v) => `${v} Schritte`} hint="So viele falsche Buchstaben sind erlaubt. Kommt die Maus am Käse an, frisst sie ihn und das Wort wird gezeigt." onChange={(v) => setting('mouseSteps', v)} />
          <Toggle checked={s.mouseHint} label="Bild als Hilfe zeigen" hint="Hat das Wort ein Bild, steht es gleich neben den Kästchen. Sonst erscheint es erst, wenn das Wort geschafft ist – oder die Maus den Käse gefressen hat." onChange={(v) => setting('mouseHint', v)} />
          {toPictures('Der Artikel steht schon da, geraten werden nur die Buchstaben des Wortes. Mit höchstens 2 falschen Buchstaben ist ein Wort „perfekt“.')}
        </Part>
      )}
      {(c.mode === 'crossword' || c.mode === 'search') && (
        <Part title={c.mode === 'crossword' ? 'Kreuzworträtsel' : 'Suchsel'}>
          <Chips label="Lösen" value={s.solveWith} onChange={(v) => setting('solveWith', v)} options={[{ value: 'tap', label: c.mode === 'crossword' ? 'Tippen' : 'Antippen' }, { value: 'pen', label: 'Stift' }]} />
          {toPictures(s.solveWith === 'pen' ? `Mit dem Stift über das Rätsel schreiben oder ausdrucken: Es wird nichts geprüft, „Lösung zeigen“ zeigt die ${c.mode === 'crossword' ? 'Wörter' : 'versteckten Wörter'}.` : c.mode === 'crossword' ? 'Die Wörter werden in die Kästchen getippt. „Prüfen“ prüft jedes fertige Wort – wie beim Diktat mit zwei Versuchen.' : 'Die Kinder wischen über die Buchstaben eines Wortes (oder tippen den ersten und den letzten Buchstaben an).')}
          {c.mode === 'search' && <Chips label="Richtungen" value={s.searchDirections} onChange={(v) => setting('searchDirections', v)} options={[{ value: 'easy', label: '→ ↓' }, { value: 'diagonal', label: '→ ↓ ↘' }, { value: 'all', label: 'Alle, auch rückwärts' }]} />}
          {toPictures(c.mode === 'crossword' ? 'Die Bilder sind die Fragen – Wörter ohne Bild kommen nicht ins Rätsel. Groß geschrieben wird mit ß als SS. Bis zu 14 Wörter, die sich kreuzen.' : 'Die Bilder zeigen, welche Wörter gesucht werden (Wörter ohne Bild stehen als Wort da). Bis zu 16 Wörter, höchstens 14 Buchstaben lang.')}
        </Part>
      )}
      {c.mode === 'wordle' && (
        <Part title="Wordle">
          <Chips label="Buchstaben" value={s.wordleLength} onChange={(v) => setting('wordleLength', v)} options={[{ value: 4, label: '4 Buchstaben' }, { value: 5, label: '5 Buchstaben' }, { value: 6, label: '6 Buchstaben' }]} />
          <Slider label="Wörter in einem Spiel" value={s.wordleRounds} min={1} max={20} format={(v) => (v === 1 ? '1 Wort' : `${v} Wörter`)} onChange={(v) => setting('wordleRounds', v)} />
          {(() => {
            const fit = c.words.map((w) => withoutArticle(w.text)).filter((w) => w && [...w.replace(/ß/g, 'SS')].length === s.wordleLength);
            return toPictures(`${fit.length ? `Gespielt werden die ${fit.length === 1 ? 'eine Wort' : `${fit.length} Wörter`} der Liste mit ${s.wordleLength} Buchstaben (${fit.slice(0, 6).join(', ')}${fit.length > 6 ? ' …' : ''}). Bilder der Wörter sind eine Hilfe.` : `Die Liste hat keine Wörter mit ${s.wordleLength} Buchstaben – gespielt werden einfache Wörter aus einer eingebauten Liste.`} Beim Raten ist jede Buchstabenfolge erlaubt; ß zählt als SS.`);
          })()}
        </Part>
      )}
      {c.mode === 'flash' && (
        <Part title="Blitzlesen">
          <Toggle checked={s.flashDynamic} label="Anzeigedauer automatisch einstellen (empfohlen)" hint="Vorher kommen 5 einfache Aufwärmwörter – sie stellen die Anzeigedauer ein und zählen nicht. Danach passt sie sich an: schnelle richtige Antworten verkürzen sie, Fehler und Hilfen verlängern sie." onChange={(v) => setting('flashDynamic', v)} />
          {!s.flashDynamic && <Slider label="Anzeigedauer des Blitzworts" value={s.flashDuration} min={0.5} max={5} step={0.25} format={(v) => `${String(v).replace('.', ',')} s`} onChange={(v) => setting('flashDuration', v)} />}
          {toPictures(`Angeboten werden immer drei Bilder: das passende und zwei andere ${c.kind === 'words' ? 'aus der Liste' : 'aus dem Text'}. Es braucht mindestens 3 Bilder.`)}
        </Part>
      )}
      {c.mode === 'read' && (
        <Part title="Lesen">
          <Toggle checked={s.readQuiz} label="Bilder-Quiz mit den Lernwörtern" hint="Nach dem Lesen wird zu jedem Lernwort mit Bild das Bild gezeigt – das passende Wort wird im Text angetippt." onChange={(v) => setting('readQuiz', v)} />
          <Toggle checked={s.syllables} label="Silben rot und blau" hint="Die Wörter erscheinen in Sprechsilben, abwechselnd blau und rot (Silbenmethode). Die Kinder können die Farben mit „Silben“ aus- und einschalten." onChange={(v) => setting('syllables', v)} />
        </Part>
      )}
      {c.mode === 'gaps' && <Part title="Lückentext">{toPictures('Die Lernwörter werden zu Lücken – höchstens eine pro Satz.')}</Part>}
      {c.mode === 'type' && (
        <Part title="Abtippen">
          <Toggle checked={s.showSource} label="Vorlage anzeigen" hint="Der Text steht über dem Eingabefeld, das aktuelle Wort ist markiert. Ausgeschaltet tippen die Kinder nach Gehör (Vorlesen) oder mit kurzem Zeigen des Satzes." onChange={(v) => setting('showSource', v)} />
          {toPictures('Leertaste oder ein Satzzeichen bestätigt ein Wort. Die Auswertung zeigt auch die Wörter pro Minute.')}
        </Part>
      )}

      <Part title="Schrift">
        <Chips label="Schrift der Übung" value={s.font} onChange={(v) => setting('font', v)} options={TS_FONTS.map((f) => ({ value: f.id, label: <span style={{ fontFamily: f.family }}>{f.label}</span>, title: f.hint }))} />
        <Chips label="Größe" value={s.scale} onChange={(v) => setting('scale', v)} options={[{ value: 1, label: 'Normal' }, { value: 1.25, label: 'Groß' }, { value: 1.5, label: 'Sehr groß' }]} />
      </Part>
      <Part title="Hilfen für die Kinder">
        <Toggle checked={s.helpSpeak} label="Vorlesen" hint="Der Lautsprecher liest das gesuchte Wort (beim Abtippen den Satz) vor." onChange={(v) => setting('helpSpeak', v)} />
        <Toggle checked={s.helpFlash} label="Zeigen (Auge)" hint="Zeigt das gesuchte Wort (beim Abtippen den Satz) für einen Moment." onChange={(v) => setting('helpFlash', v)} />
        <Toggle checked={s.speakTask} label="Aufgabenstellung vorlesen" hint="Ein Lautsprecher an der Aufgabe (z. B. „Welches Wort passt zum Bild?“) liest sie vor." onChange={(v) => setting('speakTask', v)} />
        {c.kind === 'words' && <Toggle checked={s.shuffle} label="Reihenfolge mischen" hint="Die Wörter kommen bei jedem Durchgang in anderer Reihenfolge." onChange={(v) => setting('shuffle', v)} />}
      </Part>
      <Part title="Vorlese-Stimme">
        <Slider label="Tempo" value={s.rate} min={0.6} max={1.2} step={0.05} format={(v) => `${v < 0.8 ? 'langsam' : v > 1.05 ? 'schnell' : 'normal'} (${Math.round(v * 100)} %)`} onChange={(v) => setting('rate', v)} />
        <button type="button" className="knopf compact" onClick={() => {
          if (typeof speechSynthesis === 'undefined') return;
          const u = new SpeechSynthesisUtterance(c.kind === 'words' ? c.words[0]?.text || 'der Hund' : c.text.split(/(?<=[.!?])\s/)[0] || 'Im Herbst sucht der Igel viel Futter.');
          u.lang = 'de-DE'; u.rate = s.rate; speechSynthesis.cancel(); speechSynthesis.speak(u);
        }}>
          <Icon name="speaker" size={18} /> Probehören
        </button>
        {toPictures('Es spricht die deutsche Stimme des Geräts. Sie kann ein echtes menschliches Sprachvorbild nie ersetzen.')}
      </Part>
      <Part title="Checkliste">
        {problems.length ? <ul className="ts-checks">{problems.map((p) => <li key={p}>{p}</li>)}</ul> : <p className="ts-ok">✓ Alles bereit.</p>}
      </Part>
    </div>
  );
}
