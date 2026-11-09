import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PageView from '../components/PageView';
import ScaledPage from '../components/ScaledPage';
import PortableRecorder from './PortableRecorder';
import { downloadBlob } from '../lib/learning/audio';
import { LearningRuntime } from '../components/learning/Runtime';
import type { BookData } from '../lib/notebook-model';
import type { LearningResponse } from '../lib/learning/catalog';
const boot = document.getElementById('grundschulbuch-data');
const data = JSON.parse(boot?.textContent || 'null') as BookData & {
  licenses?: Record<string, string>;
  sourceArchive?: string;
};
const api = (() => {
  try {
    let w: Window | null = window;
    for (let i = 0; i < 6 && w; i++) {
      const found = (
        w as unknown as { API?: Record<string, (...v: string[]) => string> }
      ).API;
      if (found) {
        found.LMSInitialize?.('');
        return found;
      }
      if (w.parent === w) break;
      w = w.parent;
    }
  } catch {}
  return null;
})();
function score(value: number) {
  api?.LMSSetValue?.('cmi.core.score.raw', String(value));
  api?.LMSSetValue?.(
    'cmi.core.lesson_status',
    value === 100 ? 'passed' : 'incomplete',
  );
  api?.LMSCommit?.('');
}
window.addEventListener('beforeunload', () => {
  api?.LMSFinish?.('');
});
function Viewer() {
  const [pages, setPages] = useState(data.pages),
    [index, setIndex] = useState(0),
    [info, setInfo] = useState(false),
    [recordTarget, setRecordTarget] = useState<string | null>(null);
  const page = pages[index];
  const response = (id: string, response: LearningResponse) =>
    setPages((pages) =>
      pages.map((p) =>
        p.id === page.id
          ? {
              ...p,
              elements: p.elements.map((el) =>
                el.id === id ? { ...el, response } : el,
              ),
            }
          : p,
      ),
    );
  return (
    <main className="standalone-viewer">
      <header>
        <strong>{data.book.title}</strong>
        <button onClick={() => setInfo(!info)}>Informationen</button>
      </header>
      <div className="standalone-page">
        <LearningRuntime
          interactive
          allowExternal
          onResponse={response}
          reportScore={score}
          onRecord={setRecordTarget}
        >
          <ScaledPage page={page} maxScale={1} />
        </LearningRuntime>
      </div>
      <nav>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)}>
          ‹ Zurück
        </button>
        <select
          aria-label="Seite"
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        >
          {pages.map((p, i) => (
            <option value={i} key={p.id}>
              Seite {i + 1}
            </option>
          ))}
        </select>
        <span>von {pages.length}</span>
        <button
          disabled={index === pages.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          Weiter ›
        </button>
        <button onClick={() => document.documentElement.requestFullscreen?.()}>
          Vollbild
        </button>
        <button onClick={() => window.print()}>Drucken</button>
        <button
          onClick={() => {
            const html = document.documentElement.cloneNode(
              true,
            ) as HTMLElement;
            html.querySelector('#grundschulbuch-viewer')!.textContent = '';
            html.querySelector('#grundschulbuch-data')!.textContent =
              JSON.stringify({ ...data, pages }).replace(/</g, '\\u003c');
            downloadBlob(
              new Blob(['<!doctype html>' + html.outerHTML], {
                type: 'text/html',
              }),
              data.book.title.replace(/[^a-zA-Z0-9äöüÄÖÜß -]/g, '') + '.html',
            );
          }}
        >
          Kopie mit Antworten speichern
        </button>
      </nav>
      <div className="standalone-print" aria-hidden="true">
        {pages.map((p) => (
          <PageView key={p.id} page={p} />
        ))}
      </div>
      {recordTarget && (
        <PortableRecorder
          onClose={() => setRecordTarget(null)}
          onSave={(src) => {
            const el = page.elements.find((el) => el.id === recordTarget);
            if (el) {
              const previous = el.response || {};
              response(
                recordTarget,
                el.widgetKind === 'soundstudio'
                  ? {
                      ...previous,
                      recordings: [
                        ...(Array.isArray(previous.recordings)
                          ? previous.recordings
                          : []),
                        { title: 'Aufnahme', src, offset: 0, volume: 1 },
                      ],
                    }
                  : { ...previous, recordingSrc: src },
              );
            }
            setRecordTarget(null);
          }}
        />
      )}
      {info && (
        <aside className="viewer-info">
          <h2>Grundschulbuch</h2>
          <p>
            Diese Datei enthält eine eigenständig verwendbare Heftkopie. Mit
            „Kopie mit Antworten speichern“ kannst du deine Bearbeitung als neue
            Datei aufbewahren.
          </p>
          <a
            href="https://github.com/Bingenberger/grundschulbuch"
            target="_blank"
            rel="noreferrer"
          >
            Quellcode (AGPL-3.0)
          </a>
          {data.sourceArchive && (
            <p>
              <a
                href={data.sourceArchive}
                download="grundschulbuch-quellcode.zip"
              >
                Quellcode dieser Version herunterladen
              </a>
            </p>
          )}
          {Object.entries(data.licenses || {}).map(([name, text]) => (
            <details key={name}>
              <summary>{name}</summary>
              <pre>{text}</pre>
            </details>
          ))}
        </aside>
      )}
    </main>
  );
}
if (data?.pages?.length)
  createRoot(document.getElementById('grundschulbuch-viewer')!).render(
    <Viewer />,
  );
