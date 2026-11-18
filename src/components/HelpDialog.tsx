'use client';
// Hilfe wie in Lernsachen-Heft: Kapitel als Kacheln, häufige Fragen, Suche,
// die Themen eines Kapitels untereinander.
import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon';
import { helpChapters, helpQuestions, helpTopics, searchHelp, type HelpTopic } from '@/lib/help';

export default function HelpDialog({
  onClose,
  onShortcuts,
  initialTopic,
}: {
  onClose: () => void;
  /** Öffnet die Liste der Tastenkürzel (nur im Editor). */
  onShortcuts?: () => void;
  initialTopic?: string;
}) {
  const start = helpTopics.find((t) => t.id === initialTopic);
  const [chapter, setChapter] = useState<string | null>(start?.chapter ?? null);
  const [focus, setFocus] = useState<string | null>(start?.id ?? null);
  const [query, setQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchHelp(query), [query]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', key, true);
    return () => window.removeEventListener('keydown', key, true);
  }, [onClose]);
  useEffect(() => {
    if (focus) document.getElementById(`help-${focus}`)?.scrollIntoView({ block: 'start' });
    else body.current?.scrollTo({ top: 0 });
  }, [chapter, focus]);

  const show = (topic: HelpTopic | string) => {
    const t = typeof topic === 'string' ? helpTopics.find((x) => x.id === topic) : topic;
    if (!t) return;
    setQuery('');
    setChapter(t.chapter);
    setFocus(t.id);
  };
  const current = helpChapters.find((c) => c.id === chapter);

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">
        <div className="dialog-heading">
          <h2 id="help-title">Hilfe</h2>
          <button type="button" className="knopf" onClick={onClose}>
            Schließen
          </button>
        </div>
        <label className="help-search">
          <Icon name="search" size={20} />
          <input
            type="search"
            aria-label="Hilfe durchsuchen"
            placeholder="Wonach suchst du? z. B. „PDF“, „Silben“, „austeilen“"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="help-body" ref={body}>
          {query.trim() ? (
            <section aria-label="Suchergebnisse">
              {results.length ? (
                <ul className="help-results">
                  {results.map((t) => (
                    <li key={t.id}>
                      <button type="button" onClick={() => show(t)}>
                        <strong>{t.title}</strong>
                        <small>
                          {helpChapters.find((c) => c.id === t.chapter)?.title} · {t.body[0].slice(0, 110)}
                          {t.body[0].length > 110 ? ' …' : ''}
                        </small>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="help-empty">Dazu gibt es noch keinen Hilfetext. Versuche ein anderes Wort.</p>
              )}
            </section>
          ) : current ? (
            <section aria-labelledby="help-chapter-title">
              <button type="button" className="knopf help-back" onClick={() => { setChapter(null); setFocus(null); }}>
                ‹ Alle Themen
              </button>
              <h3 id="help-chapter-title" className="help-chapter-title">
                <Icon name={current.icon} size={28} /> {current.title}
              </h3>
              {helpTopics
                .filter((t) => t.chapter === current.id)
                .map((t) => (
                  <article key={t.id} id={`help-${t.id}`} className={`help-topic${focus === t.id ? ' is-focus' : ''}`}>
                    <h4>{t.title}</h4>
                    {t.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    {t.id === 'tastenkuerzel' && onShortcuts && (
                      <button type="button" className="knopf" onClick={onShortcuts}>
                        <Icon name="settings" size={20} /> Tastenkürzel ansehen und ändern …
                      </button>
                    )}
                  </article>
                ))}
            </section>
          ) : (
            <>
              <div className="help-chapters">
                {helpChapters.map((c) => (
                  <button key={c.id} type="button" className="help-chapter" onClick={() => { setChapter(c.id); setFocus(null); }}>
                    <Icon name={c.icon} size={34} />
                    <strong>{c.title}</strong>
                    <small>{c.sub}</small>
                  </button>
                ))}
              </div>
              <h3 className="help-faq-title">Häufige Fragen</h3>
              <ul className="help-faq">
                {helpQuestions.map((q, i) => (
                  <li key={q.q}>
                    <button
                      type="button"
                      aria-expanded={openQuestion === i}
                      onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
                    >
                      Wie {q.q}
                    </button>
                    {openQuestion === i && (
                      <div className="help-answer">
                        <p>{q.a}</p>
                        <button type="button" className="help-more" onClick={() => show(q.topic)}>
                          Mehr dazu: {helpTopics.find((t) => t.id === q.topic)?.title} ›
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
