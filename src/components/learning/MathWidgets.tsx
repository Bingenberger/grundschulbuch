/* eslint-disable @next/next/no-img-element -- Stored school media use authenticated URLs. */
'use client';
import { useRef, useState } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import { calculate, seeded } from '@/lib/learning/algorithms';
import { useLearning } from './Runtime';
const euro = (cents: number) =>
  (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
export default function MathWidgets({ element: el }: { element: PageElement }) {
  const { state, update, interactive } = useLearning(el),
    c = el.settings || {},
    kind = el.widgetKind;
  const [notice, setNotice] = useState('');
  const drawing = useRef<{ x: number; y: number } | null>(null);
  const maximum = Math.max(10, Math.min(1000, c.maximum || 20));
  let content: React.ReactNode;
  if (kind === 'calculator') {
    const expression = String(state.expression || ''),
      rows = (c.text || 'Brot: 2,40\nApfel: 0,60')
        .split('\n')
        .map((line) => {
          const match = line.match(/^(.*?)[;:]\s*(\d+(?:[.,]\d{1,2})?)\s*$/);
          return match
            ? {
                title: match[1],
                cents: Math.round(Number(match[2].replace(',', '.')) * 100),
              }
            : null;
        })
        .filter((r): r is { title: string; cents: number } => !!r);
    content = (
      <div className="calculator-layout">
        <div>
          <output className="calculator-display">{expression || '0'}</output>
          <div className="calculator-keys">
            {[
              '7',
              '8',
              '9',
              '÷',
              '4',
              '5',
              '6',
              '×',
              '1',
              '2',
              '3',
              '−',
              '0',
              ',',
              '=',
              '+',
            ].map((key) => (
              <button
                disabled={!interactive}
                key={key}
                onClick={() => {
                  if (key === '=') {
                    try {
                      update({ expression: String(calculate(expression)) });
                      setNotice('');
                    } catch (e) {
                      setNotice((e as Error).message);
                    }
                  } else
                    update({ expression: (expression + key).slice(0, 100) });
                }}
              >
                {key}
              </button>
            ))}
          </div>
          <button
            disabled={!interactive}
            onClick={() => update({ expression: '' })}
          >
            C · Löschen
          </button>
        </div>
        <div className="receipt">
          <h4>Kassenzettel</h4>
          {rows.map((r, i) => (
            <div key={i}>
              <span>{r.title}</span>
              <span>{euro(r.cents)}</span>
            </div>
          ))}
          <hr />
          <label>
            Summe
            <input
              aria-label="Summe des Kassenzettels"
              disabled={!interactive}
              value={String(state.sum || '')}
              onChange={(e) => update({ sum: e.target.value, checked: false })}
            />
          </label>
          <button
            disabled={!interactive}
            onClick={() => {
              const correct =
                Math.round(
                  Number(String(state.sum || '').replace(',', '.')) * 100,
                ) === rows.reduce((s, r) => s + r.cents, 0);
              update({
                checked: true,
                completed: correct,
                score: correct ? 100 : 0,
              });
              setNotice(
                correct
                  ? '✓ Der Betrag stimmt.'
                  : 'Rechne die Beträge noch einmal zusammen.',
              );
            }}
          >
            Summe prüfen
          </button>
        </div>
      </div>
    );
  } else if (kind === 'mathboard') {
    const mode = c.mode || 'beads',
      count = Math.max(0, Math.min(maximum, Number(state.count) || 0));
    content = (
      <>
        <div className="learning-actions">
          <button
            disabled={!interactive || count === 0}
            onClick={() => update({ count: count - 1 })}
          >
            −
          </button>
          <strong className="number-display">{count}</strong>
          <button
            disabled={!interactive || count >= maximum}
            onClick={() => update({ count: count + 1 })}
          >
            ＋
          </button>
          <button disabled={!interactive} onClick={() => update({ count: 0 })}>
            ↺
          </button>
        </div>
        {mode === 'numberline' ? (
          <svg
            viewBox="0 0 300 75"
            className="numberline"
            onPointerDown={(e) => {
              if (!interactive) return;
              const rect = e.currentTarget.getBoundingClientRect();
              update({
                count: Math.round(
                  Math.max(
                    0,
                    Math.min(1, (e.clientX - rect.left) / rect.width),
                  ) * maximum,
                ),
              });
            }}
          >
            <line x1="10" x2="290" y1="35" y2="35" stroke="#52796f" />
            {Array.from({ length: 11 }, (_, i) => (
              <g key={i}>
                <line
                  x1={10 + i * 28}
                  x2={10 + i * 28}
                  y1="30"
                  y2="40"
                  stroke="#52796f"
                />
                <text x={10 + i * 28} y="60" textAnchor="middle" fontSize="11">
                  {Math.round((i * maximum) / 10)}
                </text>
              </g>
            ))}
            <circle
              cx={10 + (count / maximum) * 280}
              cy="35"
              r="6"
              fill="#c16560"
            />
          </svg>
        ) : mode === 'place' ? (
          <div className="place-table">
            {[1000, 100, 10, 1]
              .filter((v) => v <= maximum)
              .map((place) => (
                <div key={place}>
                  <b>
                    {place === 1000
                      ? 'T'
                      : place === 100
                        ? 'H'
                        : place === 10
                          ? 'Z'
                          : 'E'}
                  </b>
                  <strong>{Math.floor(count / place) % 10}</strong>
                  <button
                    disabled={!interactive || count + place > maximum}
                    onClick={() => update({ count: count + place })}
                  >
                    ＋ {place}
                  </button>
                  <button
                    disabled={!interactive || count < place}
                    onClick={() => update({ count: count - place })}
                  >
                    − {place}
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <div
            className="bead-grid"
            style={{ gridTemplateColumns: 'repeat(10,1fr)' }}
          >
            {Array.from({ length: Math.min(100, maximum) }, (_, i) => (
              <button
                key={i}
                aria-label={`Menge ${i + 1}`}
                disabled={!interactive}
                className={
                  i < count ? (i % 10 < 5 ? 'red-bead' : 'blue-bead') : ''
                }
                onClick={() => update({ count: i + 1 })}
              />
            ))}
          </div>
        )}
      </>
    );
  } else if (kind === 'shop') {
    const products = c.cells?.length
      ? c.cells
      : [
          { label: 'Apfel', speak: '80' },
          { label: 'Brot', speak: '240' },
          { label: 'Milch', speak: '120' },
          { label: 'Käse', speak: '290' },
          { label: 'Birne', speak: '90' },
          { label: 'Joghurt', speak: '65' },
        ];
    const cart = Array.isArray(state.cart)
        ? state.cart.map(Number)
        : products.map(() => 0),
      prices = products.map((p) =>
        Math.max(1, Math.round(Number(p.speak) || 100)),
      );
    const total = cart.reduce((sum, n, i) => sum + n * (prices[i] || 0), 0),
      customer = Number(state.customer) || 0,
      next = seeded((c.seed || 42) + customer),
      order = products.map(() => 0);
    order[next(products.length)] = 1 + next(3);
    order[next(products.length)] += 1;
    const expected = order.reduce((sum, n, i) => sum + n * prices[i], 0),
      paid = Math.ceil(expected / 500) * 500;
    content = (
      <>
        <p>
          Bestellung {customer + 1}:{' '}
          {order
            .map((n, i) => (n ? `${n} × ${products[i].label}` : ''))
            .filter(Boolean)
            .join(', ')}
        </p>
        <div className="shop-products">
          {products.map((p, i) => (
            <button
              disabled={!interactive}
              key={i}
              onClick={() => {
                const next = [...cart];
                next[i] = (next[i] || 0) + 1;
                update({ cart: next, checked: false });
              }}
            >
              {p.image && <img src={p.image} alt="" />}
              <strong>{p.label}</strong>
              <span>{euro(prices[i])}</span>
            </button>
          ))}
        </div>
        <div className="receipt">
          {cart.map((n, i) =>
            n ? (
              <div key={i}>
                <span>
                  {n} × {products[i].label}
                </span>
                <span>{euro(n * prices[i])}</span>
              </div>
            ) : null,
          )}
          <hr />
          <strong>Summe: {euro(total)}</strong>
          <p>Das Kind zahlt mit {euro(paid)}.</p>
          <label>
            Rückgeld (€)
            <input
              aria-label="Rückgeld"
              disabled={!interactive}
              value={String(state.change || '')}
              onChange={(e) =>
                update({ change: e.target.value, checked: false })
              }
            />
          </label>
        </div>
        <div className="learning-actions">
          <button
            disabled={!interactive}
            onClick={() => {
              const correct =
                order.every((n, i) => n === (cart[i] || 0)) &&
                Math.round(
                  Number(String(state.change || '').replace(',', '.')) * 100,
                ) ===
                  paid - expected;
              update({
                checked: true,
                completed: correct,
                score: correct ? 100 : 0,
              });
              setNotice(
                correct
                  ? '✓ Bestellung und Rückgeld stimmen!'
                  : 'Prüfe Bestellung und Rückgeld noch einmal.',
              );
            }}
          >
            Kasse prüfen
          </button>
          <button
            disabled={!interactive}
            onClick={() =>
              update({
                cart: [],
                change: '',
                customer: customer + 1,
                checked: false,
              })
            }
          >
            Nächste Bestellung
          </button>
          <button
            disabled={!interactive}
            onClick={() => update({ cart: [], change: '' })}
          >
            Kasse leeren
          </button>
        </div>
      </>
    );
  } else if (kind === 'geometry') {
    const target = c.path?.length
        ? c.path
        : [
            { x: 20, y: 20 },
            { x: 80, y: 20 },
            { x: 80, y: 70 },
            { x: 20, y: 70 },
            { x: 20, y: 20 },
          ],
      path = Array.isArray(state.path)
        ? (state.path as unknown as { x: number; y: number }[])
        : [];
    const at = (e: React.PointerEvent<SVGSVGElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      return {
        x:
          Math.round(
            Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)) /
              5,
          ) * 5,
        y:
          Math.round(
            Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)) /
              5,
          ) * 5,
      };
    };
    content = (
      <>
        <p>
          Zeichne die gestrichelte Form mit geraden Strecken nach. Ziehe vom
          Anfang zum Ende einer Strecke.
        </p>
        <svg
          viewBox="0 0 100 100"
          className="geometry-board"
          style={{ touchAction: 'none' }}
          onPointerDown={(e) => {
            if (!interactive) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            drawing.current = at(e);
          }}
          onPointerUp={(e) => {
            if (!interactive || !drawing.current) return;
            const end = at(e),
              start = drawing.current;
            drawing.current = null;
            update({
              path: [...path, start, end].map((p) => ({ ...p })),
              checked: false,
            });
          }}
        >
          <defs>
            <pattern
              id={`geometry-${el.id}`}
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M5 0H0V5"
                fill="none"
                stroke="#c8d9dc"
                strokeWidth=".2"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#geometry-${el.id})`} />
          <polyline
            points={target.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#8c9d8a"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
          {Array.from({ length: Math.floor(path.length / 2) }, (_, i) => (
            <line
              key={i}
              x1={path[i * 2].x}
              y1={path[i * 2].y}
              x2={path[i * 2 + 1].x}
              y2={path[i * 2 + 1].y}
              stroke="#376b9a"
              strokeWidth="1"
            />
          ))}
        </svg>
        <div className="learning-actions">
          <button
            disabled={!interactive}
            onClick={() => {
              const edges = target.slice(1).map((p, i) => [target[i], p]),
                drawn = Array.from(
                  { length: Math.floor(path.length / 2) },
                  (_, i) => [path[i * 2], path[i * 2 + 1]],
                );
              const near = (
                a: { x: number; y: number },
                b: { x: number; y: number },
              ) => Math.hypot(a.x - b.x, a.y - b.y) < 1;
              const correct =
                edges.length === drawn.length &&
                edges.every(([a, b]) =>
                  drawn.some(
                    ([p, q]) =>
                      (near(a, p) && near(b, q)) || (near(a, q) && near(b, p)),
                  ),
                );
              update({
                checked: true,
                completed: correct,
                score: correct ? 100 : 0,
              });
              setNotice(
                correct
                  ? '✓ Die Form stimmt!'
                  : 'Vergleiche die Strecken und Eckpunkte.',
              );
            }}
          >
            Form prüfen
          </button>
          <button
            disabled={!interactive}
            onClick={() => update({ path: [], checked: false })}
          >
            Neu zeichnen
          </button>
          <button
            disabled={!interactive}
            onClick={() =>
              update({ path: path.slice(0, -2).map((p) => ({ ...p })) })
            }
          >
            ↶
          </button>
        </div>
      </>
    );
  }
  return (
    <section
      className="learning-widget"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <header>
        <strong>{c.title || 'Mathematik'}</strong>
      </header>
      <div className="learning-content">{content}</div>
      {notice && <p role="status">{notice}</p>}
    </section>
  );
}
