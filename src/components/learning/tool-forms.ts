// The settings dialogs of the tools of Lernsachen-Heft 1.47.3, described as
// fields for ToolForm: the same choices, texts and ready-made lists as in the
// reference's dialogs.
import type { ToolId } from '@/lib/learning/werkzeuge';
import {
  CHECK_PRESETS, MOOD_FEELS, moodPicture, PRACTICE_PARTNERS, PRACTICE_PRESETS, RATING_PRESETS, STEPS_PRESETS, STEPS_COLORS, STRESS_IDEAS,
} from '@/lib/reference/tools-runtime';
import type { Draft, Field } from './ToolForm';

type Row = Record<string, unknown>;
const rowsOf = (items: [string, string?][]): Row[] => items.map(([text, q]) => ({ text, ...(q ? { q } : {}) }));
const numbers = (values: number[], unit = '') => values.map((v) => ({ value: v, label: `${v}${unit}` }));

export type ToolForm = { fields: Field[]; hint: string | ((d: Draft) => string) };

export const TOOL_FORMS: Partial<Record<ToolId, ToolForm>> = {
  mood: {
    hint: 'Antippen sagt das Gefühl, z. B. „Ich bin müde.“',
    fields: [
      { t: 'text', key: 'title', label: 'Frage', placeholder: 'Wie geht es dir heute?' },
      { t: 'pick', key: 'feels', label: 'Gefühle (mindestens zwei)', min: 2, options: (MOOD_FEELS as unknown as { id: string; label: string }[]).map((f) => ({ id: f.id, label: f.label, src: moodPicture(f.id) as string })) },
      { t: 'toggle', key: 'count', label: 'Zählen', hint: 'Jeder Tipp zählt – so sieht man im Morgenkreis, wie es allen geht.' },
    ],
  },
  vote: {
    hint: (d) => (d.secret ? 'Probier es aus: „Ich wähle“, eine Möglichkeit antippen – der Bildschirm ist wieder verdeckt. „Auszählen“ zeigt das Ergebnis.' : 'Probier es aus: Jeder Tipp auf eine Möglichkeit ist eine Stimme.'),
    fields: [
      { t: 'text', key: 'title', label: 'Frage', placeholder: 'z. B. Wer wird Klassensprecher?' },
      { t: 'toggle', key: 'secret', label: 'Geheime Wahl (Wahlkabine)', hint: 'Sonst offen: jeder Tipp zählt.' },
      { t: 'list', key: 'options', label: 'Möglichkeiten', what: 'Möglichkeit', max: 8, placeholder: 'z. B. Zoo oder ein Name', textMax: 50, picture: true },
      { t: 'button', label: 'Stimmen löschen', apply: () => ({ counts: [] }), disabled: (d) => !(d.counts as number[] | undefined)?.some(Boolean) },
    ],
  },
  rating: {
    hint: 'Probier es aus: Tippe auf ein Gesicht – nochmal tippen nimmt es weg. Ein Tipp auf den Text liest die Zeile vor.',
    fields: [
      { t: 'text', key: 'title', label: 'Überschrift' },
      { t: 'choice', key: 'cols', label: 'Wer schätzt ein?', options: [{ value: 1, label: 'Nur ich' }, { value: 2, label: 'Ich und eine zweite Person' }] },
      { t: 'text', key: 'a', label: 'Erste Spalte', placeholder: 'Ich', max: 24 },
      { t: 'text', key: 'b', label: 'Zweite Spalte', placeholder: 'Betreuer/in', max: 24, when: (d) => d.cols === 2 },
      { t: 'note', text: 'Wo beide verschieden einschätzen, steht ≠ – unten die Zahl der gleichen Antworten.', when: (d) => d.cols === 2 },
      { t: 'lines', key: 'items', label: 'Was wird eingeschätzt?', hint: 'Eine Zeile pro Punkt', max: 14, rows: 8 },
      { t: 'presets', label: 'Fertige Punkte', options: (RATING_PRESETS as unknown as { label: string; items: string[] }[]).map((p) => ({ label: p.label, apply: () => ({ items: [...p.items], va: [], vb: [] }) })) },
      { t: 'button', label: 'Alle Gesichter löschen', apply: () => ({ va: [], vb: [] }), disabled: (d) => !(d.va as number[] | undefined)?.some(Boolean) && !(d.vb as number[] | undefined)?.some(Boolean) },
    ],
  },
  check: {
    hint: 'Probier es aus: Tippe auf ✓, ✗ oder ? – nochmal tippen nimmt es weg. Ein Tipp auf den Text liest ihn vor. Im Heft bleiben die Antworten gespeichert.',
    fields: [
      { t: 'presets', label: 'Fertige Liste', options: (CHECK_PRESETS as unknown as { label: string; title: string; mode: string; items: [string, string][] }[]).map((p) => ({ label: p.label, apply: () => ({ title: p.title, mode: p.mode, items: rowsOf(p.items), vals: [] }) })) },
      { t: 'text', key: 'title', label: 'Überschrift' },
      { t: 'choice', key: 'mode', label: 'Antworten', options: [{ value: 'yesno', label: '✓ ja · ✗ nein · ? weiß nicht' }, { value: 'done', label: 'Nur abhaken' }] },
      { t: 'list', key: 'items', label: 'Punkte', what: 'Punkt', max: 14, placeholder: 'z. B. Es gibt einen Aufzug.', textMax: 100, picture: true },
    ],
  },
  stress: {
    hint: 'Probier es aus: Tippe auf eine Stufe – ab „angespannt“ leuchten die Ideen „Was hilft mir?“. Ein Tipp auf eine Idee liest sie vor.',
    fields: [
      { t: 'text', key: 'title', label: 'Überschrift' },
      { t: 'presets', label: 'Was hilft mir?', options: [{ label: 'Ideen der Vorlage', apply: () => ({ helps: (STRESS_IDEAS as unknown as [string, string, string][]).map(([text, say, q]) => ({ text, say, q })) }) }] },
      { t: 'list', key: 'helps', label: 'Ideen', what: 'Idee', max: 8, placeholder: 'z. B. Musik hören', textMax: 40, picture: true },
      { t: 'note', text: 'Am besten sucht jede Person mit dir ihre eigenen Ideen aus.' },
    ],
  },
  steps: {
    hint: 'Antippen liest den Schritt vor und hakt ihn ab. Der nächste Schritt ist mit „Jetzt“ markiert.',
    fields: [
      { t: 'presets', label: 'Vorlage', options: (STEPS_PRESETS as unknown as { label: string; title: string; steps: [string, string][] }[]).map((p) => ({ label: p.label, apply: () => ({ title: p.title, steps: rowsOf(p.steps) }) })) },
      { t: 'text', key: 'title', label: 'Überschrift', placeholder: 'z. B. Hände waschen' },
      { t: 'list', key: 'steps', label: 'Schritte', what: 'Schritt', max: 12, placeholder: 'Was ist zu tun?', picture: true },
      { t: 'choice', key: 'layout', label: 'Anordnung', options: [{ value: 'cards', label: 'Karten mit Pfeilen' }, { value: 'list', label: 'Liste' }] },
      { t: 'colors', key: 'color', label: 'Farbe', colors: STEPS_COLORS as unknown as string[] },
      { t: 'toggle', key: 'numbers', label: 'Nummern' },
      { t: 'toggle', key: 'tick', label: 'Antippen hakt ab', hint: 'Sonst liest Antippen nur vor.' },
    ],
  },
  traffic: {
    hint: 'Probier es aus: den Knopf am gelben Kasten drücken, warten, bis die Autos stehen und das grüne Männchen leuchtet – dann „Los!“',
    fields: [
      { t: 'choice', key: 'green', label: 'Grün', options: numbers([5, 8, 12, 20], ' Sekunden'), hint: 'Ist das Kind noch auf der Straße, bleibt es grün, bis es drüben ist.' },
      { t: 'choice', key: 'wait', label: 'Warten', options: numbers([2, 4, 8], ' Sekunden') },
      { t: 'toggle', key: 'talk', label: 'Die Stimme sagt, was zu tun ist', hint: '„Signal kommt – warte bei Rot“, „Grün – schau auf beide Seiten, ob die Autos stehen“. „Halt!“ und das Lob kommen immer.' },
      { t: 'toggle', key: 'tick', label: 'Tickendes Signal', hint: 'Wie an echten Ampeln für blinde Menschen: langsam beim Warten, schnell bei Grün.' },
    ],
  },
  pieces: {
    hint: 'Probier es aus: „+1 fertig“ zählt ein Stück. Nach ein paar Stücken steht da, wie lange eins dauert und wie lange es noch dauert.',
    fields: [
      { t: 'text', key: 'title', label: 'Was wird gemacht?', placeholder: 'z. B. Weihnachtskarten für den Basar' },
      { t: 'text', key: 'one', label: 'Ein Stück heißt', placeholder: 'Karte', max: 24 },
      { t: 'text', key: 'many', label: 'Mehrere heißen', placeholder: 'Karten', max: 24 },
      { t: 'choice', key: 'goal', label: 'Ziel', options: numbers([5, 10, 20, 30, 40, 50, 100]) },
      { t: 'button', label: 'Zähler auf 0', apply: () => ({ count: 0 }), disabled: (d) => !d.count },
    ],
  },
  body: {
    hint: 'Probier es aus: Tippe auf eine Stelle (nochmal = weg), dann wie stark und seit wann. „Vorlesen“ sagt alles – zum Beispiel beim Arzt. Links und rechts so, wie die Person es selbst sieht.',
    fields: [
      { t: 'text', key: 'title', label: 'Überschrift' },
      { t: 'toggle', key: 'back', label: 'Auch von hinten', hint: 'Hinterkopf, Nacken, Rücken.' },
      { t: 'toggle', key: 'scale', label: 'Wie stark? (Gesichter)' },
      { t: 'toggle', key: 'since', label: 'Seit wann?' },
      { t: 'note', text: 'Nichts davon wird gespeichert – es gilt nur für den Moment.' },
    ],
  },
  timeline: {
    hint: 'Was nach „heute“ kommt, ist gestrichelt: Wünsche und Ziele. Ein Tipp auf eine Station liest sie vor.',
    fields: [
      { t: 'text', key: 'title', label: 'Überschrift', placeholder: 'z. B. Mein Leben' },
      { t: 'list', key: 'stations', label: 'Stationen (der Reihe nach)', what: 'Station', max: 10, placeholder: 'Was war da?', textMax: 80, picture: true, extra: { key: 'when', label: 'Jahr oder Alter', placeholder: '2010', max: 16 } },
      { t: 'choice', key: 'now', label: 'Heute ist bei', options: (d) => [{ value: -1, label: 'Keine Station' }, ...((d.stations as Row[]) ?? []).map((s, i) => ({ value: i, label: String(s.when || s.text || `Station ${i + 1}`) }))] },
    ],
  },
  phone: {
    hint: 'Es wird nie wirklich jemand angerufen. Probier es aus: Nummer tippen, dann grün.',
    fields: [
      { t: 'choice', key: 'mode', label: 'Was wird geübt?', options: [{ value: 'call', label: 'Ruf … an!' }, { value: 'free', label: 'Telefonbuch' }, { value: 'sos', label: 'Notruf' }] },
      { t: 'toggle', key: 'show', label: 'Nummer auf der Aufgabe zeigen', hint: 'Ohne: die Nummer auswendig wählen.', when: (d) => d.mode === 'call' },
      { t: 'choice', key: 'sos', label: 'Notruf', options: [{ value: '112', label: '112 Feuerwehr und Rettung' }, { value: '110', label: '110 Polizei' }], when: (d) => d.mode === 'sos' },
      { t: 'note', text: 'Die Stimme der Leitstelle stellt nacheinander die W-Fragen. Das Kind antwortet laut und tippt auf „Weiter“. Am Gerät steht immer „Nur zum Üben“.', when: (d) => d.mode === 'sos' },
      { t: 'list', key: 'contacts', label: 'Kontakte', what: 'Kontakt', max: 6, text: 'name', placeholder: 'Name', textMax: 30, picture: true, when: (d) => d.mode !== 'sos', fresh: () => ({ name: '', number: '' }), extra: { key: 'number', label: 'Nummer', placeholder: 'Nummer', max: 20, clean: (v) => v.replace(/[^\d *#+/-]/g, '') } },
      { t: 'note', text: 'Tipp: Eigene Nummern der Familie nur, wenn das Heft nicht weitergegeben wird – sonst ausgedachte.', when: (d) => d.mode !== 'sos' },
    ],
  },
  practice: {
    hint: 'Probier es aus: „Start“ – das Gegenüber spricht, dann bist du dran. Aufnahmen sind nur zum Anhören und werden nie gespeichert.',
    fields: [
      { t: 'presets', label: 'Fertige Gespräche', options: (PRACTICE_PRESETS as unknown as { label: string; p: Draft }[]).map((p) => ({ label: p.label, apply: (d) => ({ ...structuredClone(p.p), hint: d.hint }) })) },
      { t: 'text', key: 'title', label: 'Überschrift' },
      { t: 'choice', key: 'partner', label: 'Gegenüber', options: PRACTICE_PARTNERS as unknown as { value: string; label: string }[] },
      { t: 'text', key: 'name', label: 'Name des Gegenübers', placeholder: 'z. B. Frau Meier (Werkstatt)', max: 40 },
      { t: 'list', key: 'lines', label: 'Das Gespräch', what: 'Satz', max: 16, placeholder: 'Was gesagt wird', textMax: 200, flag: { key: 'you', on: 'Du', off: 'Gegenüber' }, fresh: (rows) => ({ you: !(rows[rows.length - 1]?.you ?? true), text: '' }) },
      { t: 'toggle', key: 'hint', label: 'Hilfe-Satz gleich zeigen', hint: 'Aus: Der Satz steht hinter „Tipp zeigen“ – die Schüler versuchen es erst selbst.' },
    ],
  },
};
