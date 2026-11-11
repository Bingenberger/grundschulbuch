'use client';
import { Picker } from '../ui/Choice';
import { themeIcons } from './pickerIcons';
import { useState } from 'react';
import { wordBanks } from '@/lib/learning/words';
export default function WordBank({
  onSelect,
}: {
  onSelect: (words: string[]) => void;
}) {
  const [theme, setTheme] = useState<keyof typeof wordBanks>('Schule');
  return (
    <details className="word-bank-picker">
      <summary>Wörter aus einer Liste wählen</summary>
      <Picker
        label="Thema"
        name="Thema der Wortliste"
        value={theme}
        onChange={setTheme}
        options={(Object.keys(wordBanks) as (keyof typeof wordBanks)[]).map((name) => ({
          value: name,
          label: name,
          icon: themeIcons[name],
        }))}
      />
      <p>{wordBanks[theme].join(' · ')}</p>
      <button
        className="knopf compact"
        type="button"
        onClick={() => onSelect([...wordBanks[theme]])}
      >
        Wörter übernehmen
      </button>
    </details>
  );
}
