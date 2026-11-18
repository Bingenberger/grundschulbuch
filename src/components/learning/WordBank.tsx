'use client';
import { Picker } from '../ui/Choice';
import { themeIcons } from './pickerIcons';
import { useState } from 'react';
import { wordBanks } from '@/lib/learning/words';
import referenceLists from '@/lib/learning/reference-word-lists.json';

type ReferenceList = { id: string; name: string; hint: string; sections: { name: string; words: { w: string; arasaac?: number }[] }[] };
/** Wortlisten aus Lernsachen-Heft: Erste Wörter, Grundwortschatz Bayern 1/2, DaZ, Beruf und Haushalt. */
export const REFERENCE_WORD_LISTS = referenceLists as ReferenceList[];
const listIcons: Record<string, 'reading' | 'graduation_cap' | 'globe' | 'electronics'> = {
  erste: 'reading', gws: 'graduation_cap', daz: 'globe', beruf: 'electronics',
};

/** Wörter aus einer Liste: eigene Themen (mit Silben) oder die Listen von Lernsachen-Heft. */
export default function WordBank({
  onSelect,
}: {
  onSelect: (words: string[]) => void;
}) {
  const [source, setSource] = useState<string>('theme:Schule');
  const [section, setSection] = useState<number>(-1);
  const list = source.startsWith('list:') ? REFERENCE_WORD_LISTS.find((l) => l.id === source.slice(5)) : undefined;
  const words = list
    ? (section >= 0 ? [list.sections[section]] : list.sections).flatMap((s) => s.words.map((w) => w.w))
    : [...wordBanks[source.slice(6) as keyof typeof wordBanks]];
  return (
    <details className="word-bank-picker">
      <summary>Wörter aus einer Liste wählen</summary>
      <Picker
        label="Liste"
        name="Wortliste"
        value={source}
        onChange={(value) => {
          setSource(value);
          setSection(-1);
        }}
        options={[
          ...REFERENCE_WORD_LISTS.map((l) => ({ value: `list:${l.id}`, label: l.name, icon: listIcons[l.id] ?? 'list' })),
          ...(Object.keys(wordBanks) as (keyof typeof wordBanks)[]).map((name) => ({
            value: `theme:${name}`,
            label: name,
            icon: themeIcons[name],
          })),
        ]}
      />
      {list && (
        <>
          <p className="option-hint">{list.hint}</p>
          <Picker
            compact
            label="Abschnitt"
            name={`Abschnitt von ${list.name}`}
            value={section}
            onChange={setSection}
            options={[
              { value: -1, label: `Alle (${list.sections.reduce((n, s) => n + s.words.length, 0)} Wörter)`, icon: 'list' },
              ...list.sections.map((s, i) => ({ value: i, label: s.name, icon: 'document' as const })),
            ]}
          />
        </>
      )}
      <p>{words.join(' · ')}</p>
      <button className="knopf compact" type="button" onClick={() => onSelect(words)}>
        Wörter übernehmen
      </button>
    </details>
  );
}
