// The settings dialogs of the tools of Lernsachen-Heft 1.47.3, described as
// fields for ToolForm: the same choices, texts and ready-made lists as in the
// reference's dialogs.
import { SORT_COLORS, SORT_SETS, type ToolId } from '@/lib/learning/werkzeuge';
import {
  budgetStart, CHECK_PRESETS, CIRCLE_COLORS, MACHINE_KINDS, machineStart, CIRCLE_RINGS, MOOD_FEELS, WEEK_DAYS, weekStart, moodPicture, PRACTICE_PARTNERS, PRACTICE_PRESETS, RATING_PRESETS, STEPS_PRESETS, STEPS_COLORS, STRESS_IDEAS,
  KP_SITES, KP_TOPICS, kipartnerInstruction,
} from '@/lib/reference/tools-runtime';
import type { Draft, Field } from './ToolForm';

type Row = Record<string, unknown>;
const rowsOf = (items: [string, string?][]): Row[] => items.map(([text, q]) => ({ text, ...(q ? { q } : {}) }));
const numbers = (values: number[], unit = '') => values.map((v) => ({ value: v, label: `${v}${unit}` }));

export type ToolForm = {
  fields: Field[];
  hint: string | ((d: Draft) => string);
  /** Settings → what the form edits (e.g. amounts in cent → “12,50”), and back. */
  toDraft?: (config: Draft) => Draft;
  fromDraft?: (draft: Draft) => Draft;
};

/** Cent → “12,50” and back (null if it is no amount). */
export const toEuro = (cent: unknown) => (typeof cent === 'number' ? (cent / 100).toFixed(2).replace('.', ',') : '');
export function parseEuro(text: unknown): number | null {
  const t = String(text ?? '').trim().replace(/\s|€/g, '');
  if (!t) return null;
  const m = /^(\d{1,6})(?:[,.](\d{1,2}))?$/.exec(t);
  return m ? Number(m[1]) * 100 + Number((m[2] ?? '0').padEnd(2, '0')) : null;
}
const withEuro = (rows: unknown, key = 'cent') => ((rows as Row[]) ?? []).map((r) => ({ ...r, euro: toEuro(r[key]) }));
const withCent = (rows: unknown, key = 'cent') => ((rows as Row[]) ?? []).map(({ euro, ...r }) => ({ ...r, [key]: parseEuro(euro) ?? 0 }));
const titleOf = (start: unknown) => (start as { title: string }).title;
const euro = { key: 'euro', label: 'Betrag in Euro', placeholder: '0,00', max: 10, numeric: true };

export const TOOL_FORMS: Partial<Record<ToolId, ToolForm>> = {
  kipartner: {
    hint: 'Die Kinder bauen ihren KI-Partner Schritt für Schritt (Person, Aufgabe, Ziel, Kontext, Form). „Ausprobieren“ kopiert den Text und öffnet die gewählte KI – erst nach diesem Tipp.',
    fields: [
      { t: 'text', key: 'title', label: 'Überschrift', placeholder: 'Mein KI-Partner', max: 60 },
      { t: 'text', key: 'task', label: 'Auftrag für die Kinder (freiwillig)', placeholder: 'z. B. Bau dir einen Partner zum Üben fürs Diktat.', max: 240 },
      { t: 'choice', key: 'topic', label: 'Thema', options: [{ value: 'choose', label: 'Die Kinder wählen' }, ...(KP_TOPICS as unknown as { id: string; label: string }[]).map((t) => ({ value: t.id, label: t.label }))] },
      { t: 'choice', key: 'mode', label: 'Art', options: [{ value: 'learn', label: 'Lernpartner' }, { value: 'free', label: 'Freier Helfer' }],
        hint: (d) => (d.mode === 'free' ? 'Die KI erklärt auch und schreibt Texte – dazu gibt es mehr Ideen.' : 'Die KI verrät keine Lösungen: Sie fragt, gibt kleine Tipps und lobt.') },
      { t: 'toggle', key: 'own', label: '„Selbst schreiben“ erlauben', hint: 'Die Kinder können eine Idee ändern oder eine eigene schreiben.' },
      { t: 'toggle', key: 'talk', label: 'Fragen und Ideen vorlesen' },
      { t: 'choice', key: 'site', label: 'Welche KI', options: (KP_SITES as unknown as { id: string; label: string; note: string }[]).map((s) => ({ value: s.id, label: s.label })),
        hint: (d) => (KP_SITES as unknown as { id: string; note: string }[]).find((s) => s.id === d.site)?.note ?? '' },
      { t: 'text', key: 'url', label: 'Adresse (Link des geteilten Dialogpartners bzw. der KI)', placeholder: 'https://…', max: 600, when: (d) => d.site === 'ais' || d.site === 'custom' },
      { t: 'text', key: 'code', label: 'Zugangscode', max: 40, when: (d) => d.site === 'ais' },
      { t: 'toggle', key: 'inline', label: 'Im Heft öffnen', hint: 'Der Chat erscheint an der Stelle des KI-Partners; die Kinder verlassen das Heft nicht.', when: (d) => d.site === 'ais' },
      { t: 'lines', key: 'system', label: 'Vorgabe vor dem Text der Kinder (sehen sie nicht)', max: 60, rows: 8,
        hint: 'Leer lassen für die Vorgabe der gewählten Art. Sie sagt der KI, dass sie einfaches Deutsch spricht, nicht nach persönlichen Daten fragt und bei Sorgen zu einer Lehrkraft schickt.',
        placeholder: String(kipartnerInstruction({ system: '', mode: 'learn' })) },
      { t: 'note', text: 'Bitte prüfe die Regeln der KI-Seite (Mindestalter, Konto) und eurer Schule.' },
      { t: 'button', label: 'Gebaute Teile löschen (neu anfangen)', apply: () => ({ parts: {} }) },
    ],
    // Die Vorgabe ist ein Text; das Formular bearbeitet ihn zeilenweise.
    toDraft: (c) => ({ ...c, system: String(c.system ?? '') ? String(c.system).split('\n') : [] }),
    fromDraft: (d) => ({ ...d, system: ((d.system as string[]) ?? []).join('\n').trim() ? ((d.system as string[]) ?? []).join('\n') : '' }),
  },
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
  circles: {
    hint: 'Probier es aus: Tippe einen Namen an und dann einen Kreis. Ein Tipp auf einen Kreis liest vor, was dort passt.',
    fields: [
      { t: 'text', key: 'title', label: 'Überschrift' },
      { t: 'picture', key: 'centerImg', label: 'Bild in der Mitte (z. B. ein Foto)', query: (d) => String(d.center ?? '') },
      { t: 'text', key: 'center', label: 'In der Mitte', placeholder: 'Ich', max: 20 },
      { t: 'presets', label: 'Kreise (von innen nach außen)', options: (CIRCLE_RINGS as unknown as Row[][]).map((rings) => ({ label: `${rings.length} Kreise`, apply: () => ({ rings: structuredClone(rings) }) })) },
      { t: 'list', key: 'rings', label: 'Kreise', what: 'Kreis', min: 2, max: 5, text: 'label', textMax: 40, extra: { key: 'rule', label: 'Was passt?', placeholder: 'Was passt? z. B. Hand geben', max: 80, wide: true }, color: { key: 'color', colors: CIRCLE_COLORS as unknown as string[] }, fresh: (rows) => ({ label: 'Kreis', rule: '', color: (CIRCLE_COLORS as unknown as string[])[rows.length % (CIRCLE_COLORS as unknown as string[]).length] }) },
      { t: 'list', key: 'people', label: 'Personen', what: 'Person', max: 16, text: 'name', textMax: 24, placeholder: 'z. B. Mama', picture: true, fresh: () => ({ name: '', ring: -1 }) },
      { t: 'button', label: 'Alle zurück an die Seite', apply: (d) => ({ people: ((d.people as Row[]) ?? []).map((p) => ({ ...p, ring: -1 })) }), disabled: (d) => !((d.people as Row[]) ?? []).some((p) => Number(p.ring ?? -1) >= 0) },
      { t: 'note', text: 'Echte Namen und Fotos nur, wenn das Heft nicht weitergegeben wird.' },
    ],
  },
  sort: {
    hint: (d) => (d.mode === 'quiz' ? 'Probier es aus: Tippe die richtige Antwort an. Nach zwei Fehlern wird die Lösung gezeigt.' : 'Probier es aus: Tippe auf den Kasten, in den die Karte gehört. Ein Tipp auf die Karte liest sie vor.'),
    fields: [
      { t: 'presets', label: 'Fertige Sets', options: SORT_SETS.map((set) => ({ label: set.label, apply: () => ({ title: set.title, mode: set.mode, ask: set.ask ?? 'Was ist das?', boxes: structuredClone(set.boxes), items: structuredClone(set.items) }) })) },
      { t: 'choice', key: 'mode', label: 'Art', options: [{ value: 'sort', label: 'In Kästen sortieren' }, { value: 'quiz', label: 'Quiz: Bild und drei Antworten' }],
        apply: (d, mode) => ({ mode, ...(mode === 'sort' && ((d.boxes as Row[]) ?? []).length < 2 ? { boxes: [{ label: 'Kasten 1', color: SORT_COLORS[0] }, { label: 'Kasten 2', color: SORT_COLORS[3] }] } : {}) }) },
      { t: 'text', key: 'title', label: 'Überschrift' },
      { t: 'text', key: 'ask', label: 'Frage', placeholder: 'Was bedeutet das?', when: (d) => d.mode === 'quiz' },
      { t: 'list', key: 'boxes', label: 'Kästen', what: 'Kasten', min: 2, max: 4, text: 'label', textMax: 30, color: { key: 'color', colors: SORT_COLORS }, fresh: (rows) => ({ label: `Kasten ${rows.length + 1}`, color: SORT_COLORS[(rows.length * 3) % SORT_COLORS.length] }), when: (d) => d.mode !== 'quiz' },
      { t: 'list', key: 'items', label: 'Karten', what: 'Karte', max: 24, placeholder: 'z. B. Apfel (im Quiz: die richtige Antwort)', textMax: 60, picture: true, fresh: () => ({ text: '', box: 0 }),
        choice: { key: 'box', label: 'Kasten', options: (d) => (d.mode === 'quiz' ? [] : ((d.boxes as Row[]) ?? []).map((b, i) => ({ value: i, label: String(b.label || `Kasten ${i + 1}`) }))) } },
    ],
  },
  budget: {
    hint: (d) => (d.fill ? 'Probier es aus: Mit + kommt eine Zeile dazu, mit dem Stift änderst du sie. Gerechnet wird von selbst.' : d.mode === 'cash' ? 'Jede Zeile ändert den Kassenstand. Ein Tipp auf eine Zeile liest sie vor.' : 'Probier es aus: Tippe Wünsche an – unten steht sofort, was übrig bleibt (oder fehlt).'),
    toDraft: (c) => ({ ...c, income: withEuro(c.income), spend: withEuro(c.spend), wishes: withEuro(c.wishes), book: withEuro(c.book).map((r) => ({ ...r, out: !!(r as Row).out })), startEuro: toEuro(c.start) }),
    fromDraft: ({ startEuro, ...d }) => ({ ...d, income: withCent(d.income), spend: withCent(d.spend), wishes: withCent(d.wishes), book: withCent(d.book), start: parseEuro(startEuro) ?? 0 }),
    fields: [
      { t: 'choice', key: 'mode', label: 'Art', options: [{ value: 'month', label: 'Monatsplan' }, { value: 'cash', label: 'Kassenbuch' }],
        apply: (d, mode) => ({ mode, title: d.title === titleOf(budgetStart(d.mode as string)) ? titleOf(budgetStart(mode as string)) : d.title }) },
      { t: 'text', key: 'title', label: 'Überschrift' },
      { t: 'toggle', key: 'fill', label: 'Auf der Heftseite ausfüllen', hint: 'Plus-Knöpfe auf der Seite: Name, Betrag und auf Wunsch ein Bild direkt im Heft eintragen. Gerechnet wird von selbst. Die Zeilen hier dürfen leer bleiben.' },
      { t: 'list', key: 'income', label: 'Einnahmen', what: 'Einnahme', max: 10, placeholder: 'z. B. Lohn', textMax: 50, picture: true, extra: euro, when: (d) => d.mode !== 'cash' },
      { t: 'list', key: 'spend', label: 'Feste Ausgaben', what: 'Ausgabe', max: 10, placeholder: 'z. B. Miete', textMax: 50, picture: true, extra: euro, when: (d) => d.mode !== 'cash' },
      { t: 'list', key: 'wishes', label: 'Wünsche (zum Antippen)', what: 'Wunsch', max: 10, placeholder: 'z. B. Kino', textMax: 50, picture: true, extra: euro, when: (d) => d.mode !== 'cash' },
      { t: 'note', text: 'Beispielbeträge – mit der Klasse echte Preise aus der Umgebung suchen.', when: (d) => d.mode !== 'cash' },
      { t: 'text', key: 'startEuro', label: 'Anfangsbestand (€)', placeholder: '0,00', max: 10, when: (d) => d.mode === 'cash' },
      { t: 'list', key: 'book', label: 'Buchungen', what: 'Buchung', max: 10, placeholder: 'Was?', textMax: 50, when: (d) => d.mode === 'cash',
        extras: [{ key: 'date', label: 'Datum', placeholder: '3.11.', max: 12 }, euro], fresh: () => ({ text: '', date: '', euro: '' }),
        choice: { key: 'out', label: 'Art', options: () => [{ value: false, label: 'Einnahme' }, { value: true, label: 'Ausgabe' }] } },
    ],
  },
  machine: {
    hint: (d) => (d.kind === 'atm' ? 'Probier es aus: Karte antippen, Übungs-PIN eintippen, Betrag wählen – zuerst die Karte nehmen, dann das Geld.' : 'Probier es aus: Etwas wählen, mit Münzen und Scheinen aus dem Geldbeutel bezahlen, dann alles aus der Ausgabe nehmen.'),
    toDraft: (c) => ({ ...c, items: withEuro(c.items) }),
    fromDraft: (d) => ({ ...d, items: withCent(d.items) }),
    fields: [
      { t: 'choice', key: 'kind', label: 'Welcher Automat?', options: (MACHINE_KINDS as unknown as { id: string; label: string }[]).map((k) => ({ value: k.id, label: k.label })),
        apply: (d, kind) => {
          const start = machineStart(kind as string) as Draft;
          return { kind, title: d.title === titleOf(machineStart(d.kind as string)) ? start.title : d.title, ...(kind !== 'atm' && (d.kind === 'atm' || kind !== d.kind) ? { items: withEuro(start.items) } : {}) };
        } },
      { t: 'text', key: 'title', label: 'Name am Automaten', max: 60 },
      { t: 'text', key: 'pin', label: 'Übungs-PIN (4 Ziffern)', placeholder: '1234', max: 4, when: (d) => d.kind === 'atm' },
      { t: 'note', text: 'Steht für die Übung im Geldbeutel. Nie eine echte PIN verwenden.', when: (d) => d.kind === 'atm' },
      { t: 'list', key: 'items', label: 'Angebot und Preise', what: 'Eintrag', max: 6, text: 'name', textMax: 40, placeholder: 'z. B. Tageskarte oder Wasser', extra: { ...euro, label: 'Preis in Euro' }, fresh: () => ({ name: '', euro: '' }), when: (d) => d.kind !== 'atm' },
      { t: 'note', text: 'Am besten die Preise des eigenen Verkehrsverbunds oder des Automaten in der Werkstatt nehmen.', when: (d) => d.kind !== 'atm' },
    ],
  },
  week: {
    hint: (d) => (d.mode === 'duty' ? 'Jede Woche rücken die Namen einen Dienst weiter. Mit ◀ ▶ siehst du die Wochen davor und danach.' : 'Heute ist markiert. Ein Tipp liest vor, was geplant ist.'),
    fields: [
      { t: 'choice', key: 'mode', label: 'Art', options: [{ value: 'plan', label: 'Wochenplan' }, { value: 'duty', label: 'Dienstplan' }],
        apply: (d, mode) => ({ mode, title: d.title === (weekStart(d.mode as string) as { title: string }).title ? (weekStart(mode as string) as { title: string }).title : d.title }) },
      { t: 'text', key: 'title', label: 'Überschrift' },
      { t: 'choice', key: 'days', label: 'Tage', options: [{ value: 5, label: 'Montag bis Freitag' }, { value: 7, label: 'Ganze Woche' }], when: (d) => d.mode !== 'duty' },
      { t: 'toggle', key: 'colors', label: 'Tage farbig (wie im Kalenderblatt)', when: (d) => d.mode !== 'duty' },
      { t: 'days', key: 'plan', label: 'Was ist geplant?', days: WEEK_DAYS as unknown as string[], count: (d) => Number(d.days) || 7, what: 'Eintrag', max: 6, placeholder: 'z. B. Arbeit', textMax: 60, picture: true, extra: { key: 'time', label: 'Uhrzeit', placeholder: '8:00', max: 12 }, when: (d) => d.mode !== 'duty' },
      { t: 'list', key: 'duties', label: 'Dienste', what: 'Dienst', max: 8, placeholder: 'z. B. Tisch decken', textMax: 60, picture: true, when: (d) => d.mode === 'duty' },
      { t: 'lines', key: 'names', label: 'Namen', hint: 'Einer pro Zeile; gibt es mehr Namen als Dienste, steht unten, wer frei hat', max: 16, when: (d) => d.mode === 'duty' },
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
