'use client';
// “Monsternamen lesen” – the reference widget: read the made-up name syllable
// by syllable, tap “Gelesen!”, the monster flies into its box; a certificate
// at the end. Drawing and names come unchanged from the reference.
import { useEffect, useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { MONSTER_CSS, cleanMonster, drawMonster, monsterLabel, monsterSlot, sayName, sayPart } from '@/lib/reference/monster';
import { feedback } from '@/lib/learning/feedback';
import { speakAndWait, stopSpeaking } from '@/lib/speech';
import { useLearning } from './Runtime';

type Monster = { words: string[][]; say?: [string, string][] };

export default function MonsterReader({ element }: { element: PageElement }) {
  const { interactive } = useLearning(element);
  const raw = element.settings?.monster;
  const key = JSON.stringify(raw ?? null);
  // Without saved names the reference makes new ones – once per element.
  const [m, setM] = useState<Monster>(() => cleanMonster(raw));
  const [seenKey, setSeenKey] = useState(key);
  const [at, setAt] = useState(0);
  const [going, setGoing] = useState(false);
  /** The next monster pops in after one was caught. */
  const fresh = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const run = useRef(0);
  if (seenKey !== key) {
    setSeenKey(key);
    setM(cleanMonster(raw));
    setAt(0);
  }
  useEffect(() => () => {
    run.current++;
    stopSpeaking();
  }, []);

  const n = m.words.length;
  const shown = interactive ? Math.min(at, n) : 0;
  const svg = drawMonster(m, shown, interactive, 1400, 990).replace(/ width="[\d.]+" height="[\d.]+"/, ' width="100%" height="100%"');

  useEffect(() => {
    if (!fresh.current) return;
    fresh.current = false;
    box.current?.querySelector('.lh-mo-big')?.classList.add('is-new');
  }, [shown]);

  const highlight = (selector: string | null) => {
    box.current?.querySelectorAll('.is-saying').forEach((el) => el.classList.remove('is-saying'));
    if (selector) box.current?.querySelector(selector)?.classList.add('is-saying');
  };
  const say = (text: string, selector: string | null) => {
    highlight(selector);
    void speakAndWait(text).finally(() => selector && box.current?.querySelector(selector)?.classList.remove('is-saying'));
  };
  /** The certificate reads all names aloud, one after the other. */
  const celebrate = async () => {
    const mine = ++run.current;
    await speakAndWait(n === 1 ? 'Super! Du hast das Monster gefangen.' : 'Super! Du hast alle Monster gefangen.');
    for (let i = 0; i < n; i++) {
      await new Promise((r) => setTimeout(r, i ? 350 : 600));
      if (run.current !== mine) return;
      const item = `.lh-mo-certitem[data-i="${i}"]`;
      highlight(item);
      await speakAndWait(sayName(m.words[i], m.say));
      box.current?.querySelector(item)?.classList.remove('is-saying');
    }
  };
  const press = (a: string) => {
    const word = m.words[Math.min(at, n - 1)];
    if (/^s[123]$/.test(a)) {
      const part = word?.[Number(a[1]) - 1];
      if (part) say(sayPart(part, m.say), `.lh-mo-syl[data-a="${a}"]`);
    } else if (a === 'word') say(sayName(word, m.say), null);
    else if (a === 'read') {
      if (going || at >= n) return;
      stopSpeaking();
      setGoing(true);
      const big = box.current?.querySelector<SVGGElement>('.lh-mo-big');
      if (big) {
        const slot = monsterSlot(n, at);
        big.style.transition = 'transform .85s cubic-bezier(.5,-.25,.35,1)';
        big.style.transform = `translate(${slot.x}px, ${slot.y}px) scale(${slot.scale})`;
      }
      feedback(true);
      setTimeout(() => {
        setGoing(false);
        fresh.current = true;
        setAt(at + 1);
        if (at + 1 >= n) void celebrate();
      }, 900);
    } else if (a === 'again') {
      run.current++;
      stopSpeaking();
      setAt(0);
    }
  };

  return (
    <div
      ref={box}
      className={`lh-wg-monster reference-widget${interactive ? ' is-live' : ''}${going ? ' is-going' : ''}`}
      role="group"
      aria-label={monsterLabel({ monster: m })}
      onPointerDown={(e) => {
        if (interactive && (e.target as Element).closest('.lh-key')) e.stopPropagation();
      }}
      onClick={(e) => {
        const key = (e.target as Element).closest('[data-a]');
        if (!interactive || !key) return;
        e.stopPropagation();
        press(key.getAttribute('data-a') || '');
      }}
    >
      <style>{MONSTER_CSS}</style>
      <div className="lh-wg-pic" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
