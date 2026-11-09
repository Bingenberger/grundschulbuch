'use client';
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
      <label className="property-label">
        Thema
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as keyof typeof wordBanks)}
        >
          {Object.keys(wordBanks).map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </label>
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
