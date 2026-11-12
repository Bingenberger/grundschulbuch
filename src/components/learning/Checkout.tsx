'use client';
// “Einkaufen an der Kasse” – the shop page of the reference, drawn on a
// 1400 × 990 stage (A4 landscape) that is scaled to the element.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import type { JsonValue } from '@/lib/learning/catalog';
import {
  COINS,
  NOTES,
  SPLIT,
  addGood,
  cartRight,
  changeCoins,
  customerOrder,
  duration,
  fix,
  freshShop,
  itemPicture,
  many,
  moneyName,
  moneyKey,
  moneyPicture,
  nextCustomer,
  orderTalk,
  priceText,
  removeGood,
  shopConfig,
  shopLabel,
  spokenPrice,
  sum,
  sumTalk,
  summary,
  total,
  without,
  wrongChangeTalk,
  wrongPaymentTalk,
  type Mood,
  type ShopConfig,
  type ShopItem,
  type ShopState,
  type Talk,
} from '@/lib/learning/checkout';
import { CUSTOMERS } from '@/lib/learning/checkout-people';
import { feedback } from '@/lib/learning/feedback';
import { startGermanSpeech } from '@/lib/speech';
import { useLearning } from './Runtime';

const W = 1400, H = 990, BAND = 212, ROW = 224, PANEL_H = 530, DRAWER = 766, PANEL_W = 448;
const COLS = [16, 476, 936];
const CUST = { x: 104, y: 6, w: 156, h: 187 };
const BUBBLE = { x: 300, y: 16, w: 882, h: 144 };
const DOOR = 1230;
/** Coin diameters in mm (1 ct … 2 €). */
const COIN_MM: Record<number, number> = { 1: 16.25, 2: 18.75, 5: 21.25, 10: 19.75, 20: 22.25, 50: 24.25, 100: 23.25, 200: 25.75 };
const box = (x: number, y: number, w: number, h: number): CSSProperties => ({ left: x, top: y, width: w, height: h });

type Who = 'cust' | 'cash';
type Step = {
  do?: (s: ShopState) => ShopState;
  walk?: 'in' | 'out';
  say?: [string, Who] | ((s: ShopState) => [string, Who] | null);
  wait?: number;
};
/** Outside of render: the shop's events read the time. */
const clock = () => Date.now();
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** The example the editor and the dialog show: a customer with an order. */
export function previewState(c: ShopConfig): ShopState {
  const s: ShopState = { ...freshShop(), phase: 'order', inside: true, custs: [2] };
  s.order = c.items.slice(0, 2).map((_, i) => ({ i, n: i ? 2 : 1 }));
  s.talk = orderTalk(c, s, CUSTOMERS[2].greet, false);
  return s;
}

function Key({ action, label, press, className, style, off, children }: { action: string; label: string; press?: (a: string) => void; className?: string; style?: CSSProperties; off?: boolean; children: ReactNode }) {
  const go = () => press?.(action);
  return (
    <div
      className={`ck-key ${className || ''}${off ? ' is-off' : ''}`}
      style={style}
      role="button"
      tabIndex={press ? 0 : -1}
      aria-label={label}
      aria-disabled={off || !press ? true : undefined}
      title={label}
      onPointerDown={(e) => press && e.stopPropagation()}
      onClick={(e) => {
        if (!press) return;
        e.stopPropagation();
        go();
      }}
      onKeyDown={(e) => {
        if (press && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          e.stopPropagation();
          go();
        }
      }}
    >
      {children}
    </div>
  );
}

function Picture({ item, size }: { item: ShopItem; size: number }) {
  const src = itemPicture(item);
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" draggable={false} style={{ width: size, height: size, objectFit: 'contain' }} />
  ) : (
    <span className="ck-noimg" style={{ width: size, height: size, fontSize: size * 0.5 }}>{item.name.slice(0, 1).toUpperCase()}</span>
  );
}

function Money({ value, scale, money }: { value: number; scale: number; money: Record<string, string> }) {
  const coin = value < 500;
  const w = coin ? COIN_MM[value] * 3.6 * scale : 150 * scale, h = coin ? w : 78 * scale;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`ck-money${coin ? ' is-coin' : ''}`} src={money[moneyKey(value)] ?? moneyPicture(value)} alt={moneyName(value)} draggable={false} style={{ width: w, height: h }} />;
}

const SPEAKER = (
  <svg viewBox="0 0 24 24" width="62%" height="62%" aria-hidden="true">
    <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
    <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function Wall({ sign }: { sign: string }) {
  const text = sign.toUpperCase();
  const size = Math.min(24, 172 / (Math.max(4, text.length) * 0.74));
  const lines: ReactNode[] = [];
  for (let x = 30; x < 1190; x += 60) lines.push(<path key={x} d={`M${x} 0V${BAND}`} stroke="#e8dccb" strokeWidth="2" />);
  return (
    <svg viewBox={`0 0 ${W} ${BAND}`} width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="ck-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf6ee" />
          <stop offset="1" stopColor="#efe5d6" />
        </linearGradient>
      </defs>
      <rect width={W} height={BAND} fill="url(#ck-wall)" />
      {lines}
      {[70, 128].map((y) => (
        <g key={y}>
          <rect x="0" y={y} width="1190" height="8" fill="#d8c3a5" />
          <rect x="0" y={y + 8} width="1190" height="4" fill="#c4ab88" opacity=".5" />
        </g>
      ))}
      <rect x="1196" y="0" width="204" height={BAND} fill="#e9ecef" />
      <rect x="1214" y="52" width="160" height="160" rx="6" fill="#868e96" />
      <rect x="1226" y="64" width="136" height="148" rx="4" fill="#d0ebff" stroke="#adb5bd" strokeWidth="3" />
      <path d="M1240 84l40 -14M1244 104l70 -24" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity=".7" />
      <rect x="1338" y="130" width="10" height="44" rx="5" fill="#495057" />
      <rect x="1256" y="96" width="76" height="28" rx="6" fill="#2f9e44" />
      <text x="1294" y="116" textAnchor="middle" fontFamily="Verdana, sans-serif" fontSize="16" fontWeight="700" fill="#ffffff">OFFEN</text>
      <rect x="1200" y="8" width="188" height="38" rx="8" fill="#37474f" />
      <text x="1294" y={27 + size * 0.36} textAnchor="middle" fontFamily="Verdana, sans-serif" fontSize={size} fontWeight="700" fill="#ffffff">{text}</text>
    </svg>
  );
}

function Counter() {
  return (
    <svg viewBox="0 0 1196 54" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
      <rect x="0" y="0" width="1196" height="14" rx="4" fill="#8c5a32" />
      <rect x="0" y="14" width="1196" height="40" fill="#c08552" />
      {[200, 400, 600, 800, 1000].map((x) => <path key={x} d={`M${x} 16V54`} stroke="#a86f40" strokeWidth="3" />)}
      <rect x="0" y="2" width="1196" height="3" fill="#b07a4a" />
    </svg>
  );
}

/** Coins and notes in a field, the same ones stacked. */
function Stacks({ coins, prefix, scale, press, money }: { coins: number[]; prefix: string; scale: number; press?: (a: string) => void; money: Record<string, string> }) {
  const counts = new Map<number, number>();
  for (const c of coins) counts.set(c, (counts.get(c) ?? 0) + 1);
  return (
    <>
      {[...counts.keys()].sort((a, b) => b - a).map((v) => {
        const n = counts.get(v)!, coin = v < 500;
        const w = coin ? COIN_MM[v] * 3.6 * scale : 150 * scale, h = coin ? w : 78 * scale, dx = w * 0.2, dy = h * 0.2;
        return (
          <Key key={v} action={`${prefix}:${v}`} label={moneyName(v)} press={press} className="ck-stack" style={{ width: w + (n - 1) * dx, height: h + (n - 1) * dy, margin: '8px 16px 8px 4px' }}>
            {Array.from({ length: n }, (_, k) => (
              <span key={k} style={{ position: 'absolute', left: k * dx, top: k * dy, zIndex: k }}>
                <Money value={v} scale={scale} money={money} />
              </span>
            ))}
          </Key>
        );
      })}
    </>
  );
}

export function CheckoutStage({ c, s, press, custRef, figRef }: { c: ShopConfig; s: ShopState; press?: (a: string) => void; custRef?: React.Ref<HTMLDivElement>; figRef?: React.Ref<HTMLDivElement> }) {
  const idle = s.phase === 'idle';
  // Shelf
  const items = c.items, n = items.length > 9 ? 4 : 3, rows = Math.max(1, Math.ceil(items.length / n));
  const cw = (428 - (n - 1) * 10) / n, ch = Math.min(176, (510 - (rows - 1) * 10) / Math.max(3, rows));
  // Receipt
  const now = new Date();
  const cart = s.cart;
  const grid = { gridTemplateColumns: '40px 40px 1fr 118px 10px 96px' };
  const rowH = Math.min(44, 300 / Math.max(1, cart.length));
  const paidIn = sum(s.payIn);
  const showPay = s.sumShown && paidIn > 0 && (s.phase === 'pay' || s.phase === 'change' || s.chgShown || s.phase === 'busy');
  const back = s.chgShown ? (c.give ? sum(s.chgIn) : paidIn - total(c, cart)) : 0;
  const showBack = s.chgShown && !(c.give && s.phase === 'change');
  // Money fields
  const zoneH = s.chgShown ? 260 : PANEL_H;
  const paying = s.phase === 'pay';
  const coinScale = s.payIn.length > 8 || s.chgIn.length > 8 ? 0.62 : 0.78;
  const giving = c.give && s.phase === 'change';
  // Customer
  const cust = s.inside ? s.custs[s.round] ?? 0 : -1;
  const talk = s.talk;
  const pics = !!(talk?.order && c.pics);
  const talkText = talk ? (pics ? talk.text.split(':')[0] + ':' : talk.text) : '';
  const talkSize = pics ? 28 : talkText.length > 90 ? 26 : talkText.length > 60 ? 29 : 32;
  const drawerOn = s.phase === 'pay' || giving;

  return (
    <div className="ck" style={{ width: W, height: H }}>
      <div className="ck-band" style={box(0, 0, W, BAND)}>
        <Wall sign={c.sign} />
        <div ref={custRef} className={`ck-cust${s.inside ? '' : ' is-out'}`} style={box(CUST.x, CUST.y, CUST.w, CUST.h)}>
          <div ref={figRef} className="ck-fig" dangerouslySetInnerHTML={{ __html: cust >= 0 ? CUSTOMERS[cust].draw(s.mood) : '' }} />
        </div>
        <div className="ck-counter" style={box(0, 158, 1196, 54)}><Counter /></div>
        {idle && (
          <div className="ck-start" style={box(BUBBLE.x, 22, BUBBLE.w, 132)}>
            <div style={{ fontSize: 28 }}>Gleich kommen {c.customers === 1 ? 'ein Kunde' : `${c.customers} Kunden`} in den Laden.</div>
            <Key action="open" label="Laden öffnen" press={press} className="ck-btn is-green" style={{ fontSize: 30, padding: '12px 34px', marginTop: 14 }}>
              Laden öffnen ▸
            </Key>
          </div>
        )}
        {!idle && talk && s.inside && s.phase !== 'done' && (
          <div className={`ck-talk${s.mood === 'sad' ? ' is-sad' : ''}`} style={{ ...box(BUBBLE.x, BUBBLE.y, BUBBLE.w, BUBBLE.h), padding: '10px 70px 10px 22px' }} role="status">
            <div className="ck-text" style={{ fontSize: talkSize }}>{talkText}</div>
            {pics && (
              <div className="ck-chips">
                {talk.order!.map((line) => {
                  const item = items[line.i];
                  if (!item) return null;
                  const small = talk.order!.length > 3;
                  const name = line.n === 1 ? item.name : many(item).replace(/^(Packungen|Flaschen|Tafeln|Schalen|Tassen|Becher|Stück|Paar|Kisten|Dosen) /, '');
                  return (
                    <div key={line.i} className="ck-chip" style={{ marginRight: small ? 12 : 22 }}>
                      <b style={{ fontSize: small ? 28 : 32 }}>{line.n}</b>
                      <span className="ck-chippic">
                        <Picture item={item} size={small ? 46 : 54} />
                        <small style={{ fontSize: small ? 14 : 17 }}>{name}</small>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <Key action="say" label="Nochmal hören" press={press} className="ck-say" style={{ ...box(BUBBLE.w - 58, BUBBLE.h - 58, 46, 46), position: 'absolute' }}>
              {SPEAKER}
            </Key>
          </div>
        )}
      </div>

      <div className={`ck-goods${idle || s.phase === 'order' ? '' : ' is-off'}`} style={box(COLS[0], ROW, PANEL_W, PANEL_H)}>
        {items.map((item, i) => {
          const pic = Math.min(cw - 16, ch - 76);
          return (
            <Key key={i} action={`p:${i}`} label={item.name} press={press} className="ck-card" style={{ ...box(10 + (i % n) * (cw + 10), 10 + Math.floor(i / n) * (ch + 10), cw, ch), padding: 6 }}>
              <div className="ck-cardpic"><Picture item={item} size={pic} /></div>
              <div className="ck-cardname" style={{ fontSize: Math.max(11, Math.min(n === 4 ? 17 : 20, (cw - 10) / (item.name.length * 0.66))) }}>{item.name}</div>
              {c.read ? (
                <Key action={`pr:${i}`} label={`Preis vorlesen: ${priceText(item.price, c.level)}`} press={press} className="ck-price is-read" style={{ fontSize: n === 4 ? 18 : 20 }}>
                  {priceText(item.price, c.level)}
                  <span className="ck-ear">{SPEAKER}</span>
                </Key>
              ) : (
                <div className="ck-price" style={{ fontSize: n === 4 ? 18 : 20 }}>{priceText(item.price, c.level)}</div>
              )}
            </Key>
          );
        })}
      </div>

      <div className="ck-rc" style={box(COLS[1], ROW, PANEL_W, PANEL_H)} aria-label="Einkaufszettel">
        <div className="ck-rchead" style={{ fontSize: 21, height: 46, padding: '0 12px' }}>
          <b>Einkaufszettel</b>
          <span style={{ fontSize: 17 }}>{idle ? `${c.customers} ${c.customers === 1 ? 'Kunde' : 'Kunden'}` : `Kunde ${Math.min(s.round + 1, c.customers)} von ${c.customers}`}</span>
        </div>
        <div className="ck-meta" style={{ fontSize: 16, height: 30 }}>
          Datum: {now.toLocaleDateString('de-DE')} Zeit: {now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="ck-cols" style={{ ...grid, fontSize: 15, height: 30, padding: '0 6px' }}>
          <span style={{ textAlign: 'center' }}>Anz</span><span /><span>Bestellung</span><span style={{ textAlign: 'right' }}>Einzel</span><span /><span style={{ textAlign: 'right' }}>Summe</span>
        </div>
        <div className="ck-list">
          {!cart.length && <div className="ck-empty" style={{ fontSize: 19, paddingTop: 30 }}>{s.phase === 'order' ? 'Tippe die Waren im Regal an.' : 'Korb leer'}</div>}
          {cart.map((line, row) => {
            const item = items[line.i];
            if (!item) return null;
            return (
              <Key key={line.i} action={`r:${row}`} label={`${item.name} – eins weniger`} press={press} className="ck-row" style={{ ...grid, height: rowH, fontSize: Math.min(19, rowH * 0.5), padding: '0 6px' }}>
                <span style={{ textAlign: 'center' }}>{line.n}</span>
                <span><Picture item={item} size={Math.min(32, rowH - 8)} /></span>
                <span className="ck-name">{item.name}</span>
                <span style={{ textAlign: 'right' }}>{line.n > 1 ? `${line.n} x ${priceText(item.price, c.level)}` : ''}</span>
                <span className="ck-sep" />
                <span style={{ textAlign: 'right' }}>{priceText(item.price * line.n, c.level)}</span>
              </Key>
            );
          })}
        </div>
        <div className="ck-foot" style={{ padding: '8px 14px 10px' }}>
          {s.sumShown ? (
            <div className="ck-total" style={{ fontSize: 27, paddingTop: 6 }}>
              <span>Gesamt:</span>
              <span>{priceText(total(c, cart), c.level)}</span>
            </div>
          ) : (
            <Key action="sum" label="Summe" press={press} off={!(s.phase === 'order' && cart.length > 0)} className="ck-btn is-blue ck-sumbtn" style={{ fontSize: 26, height: 56 }}>
              Summe
            </Key>
          )}
          <div className="ck-pay" style={{ fontSize: 20, visibility: showPay ? 'visible' : 'hidden', marginTop: 8 }}>
            <span>Kunde zahlt:</span>
            <span>{priceText(paidIn, c.level)}</span>
          </div>
          <div className="ck-back" style={{ fontSize: 20, visibility: showBack ? 'visible' : 'hidden' }}>
            <span>Rückgeld:</span>
            <span>{priceText(Math.max(0, back), c.level)}</span>
          </div>
        </div>
      </div>

      <div className="ck-zones" style={box(COLS[2], ROW, PANEL_W, PANEL_H)}>
        <div className={`ck-zone${paying ? ' is-active' : ''}`} style={{ ...box(0, 0, PANEL_W, zoneH), padding: 8 }}>
          <div className="ck-zhead" style={{ fontSize: 19 }}>
            <span>👇 Kunde zahlt:</span>
            <b style={{ fontSize: 23 }}>{priceText(paidIn, c.level)}</b>
          </div>
          <div className="ck-mbox">
            {s.payIn.length ? (
              <Stacks coins={s.payIn} prefix="pz" scale={coinScale} press={press} money={c.money} />
            ) : (
              <div className="ck-empty" style={{ fontSize: 17 }}>{paying ? 'Lege das Geld des Kunden aus der Schublade hierher.' : ''}</div>
            )}
          </div>
          <Key action="check" label="Prüfen" press={press} off={!paying} className="ck-btn is-blue" style={{ fontSize: 24, height: 52 }}>
            PRÜFEN
          </Key>
        </div>
        {s.chgShown && (
          <div className={`ck-zone is-change${giving ? ' is-active' : ''}`} style={{ ...box(0, zoneH + 10, PANEL_W, zoneH), padding: 8 }}>
            <div className="ck-zhead" style={{ fontSize: 19 }}>
              <span>✋ Rückgeld:</span>
              <b style={{ fontSize: 23 }}>{priceText(sum(s.chgIn), c.level)}</b>
            </div>
            <div className="ck-mbox">
              {s.chgIn.length ? (
                <Stacks coins={s.chgIn} prefix="cz" scale={coinScale} press={press} money={c.money} />
              ) : (
                <div className="ck-empty" style={{ fontSize: 17 }}>{giving ? 'Lege das Rückgeld aus der Schublade hierher.' : 'Kein Rückgeld.'}</div>
              )}
            </div>
            {c.give && (
              <Key action="give" label="Rückgeld geben" press={press} off={!giving} className="ck-btn is-green" style={{ fontSize: 22, height: 48 }}>
                Rückgeld geben
              </Key>
            )}
          </div>
        )}
      </div>

      <div className={`ck-drawer${drawerOn ? '' : ' is-off'}`} style={box(0, DRAWER, W, 224)} aria-label="Schublade">
        {[COINS, NOTES].map((values, r) => (
          <div key={r} className="ck-drow" style={{ height: r ? 104 : 100 }}>
            {values.map((v) => (
              <Key key={v} action={`m:${v}`} label={moneyName(v)} press={press} className="ck-dm" style={{ margin: `0 ${v < 500 ? 12 : 9}px` }}>
                <Money value={v} scale={1} money={c.money} />
              </Key>
            ))}
          </div>
        ))}
      </div>

      {s.phase === 'done' && <Summary c={c} s={s} press={press} />}
    </div>
  );
}

function Summary({ c, s, press }: { c: ShopConfig; s: ShopState; press?: (a: string) => void }) {
  const r = summary(s);
  const done = s.res.filter((x) => x?.end);
  const tile = (color: string, label: string, value: string, note = '') => (
    <div className="ck-tile" style={{ borderColor: color, padding: '10px 14px' }}>
      <span style={{ fontSize: 17 }}>{label}</span>
      <b style={{ fontSize: 32, color }}>{value}</b>
      {note && <small style={{ fontSize: 14 }}>{note}</small>}
    </div>
  );
  const rowH = Math.min(62, 390 / Math.max(1, r.served));
  return (
    <>
      <div className="ck-dim" style={box(0, BAND, W, 778)} />
      <div className="ck-end" style={{ ...box(200, 230, 1000, 746), padding: '20px 32px' }} role="status">
        <div className="ck-endtitle" style={{ fontSize: 36 }}>Geschafft!</div>
        <div style={{ fontSize: 21, color: '#495057', marginBottom: 14 }}>{r.served === 1 ? 'Der Kunde ist bedient.' : `Alle ${r.served} Kunden sind bedient.`}</div>
        <div className="ck-tiles" style={{ gap: 12 }}>
          {tile('#1c7ed6', 'Zeit', duration(r.time))}
          {tile('#2f9e44', 'Ohne Fehler', `${r.perfect} von ${r.served}`)}
          {tile('#e03131', 'Fehler', String(r.errSum + r.errPay + r.errChg), `Waren ${r.errSum} · Bezahlen ${r.errPay}${c.give ? ` · Rückgeld ${r.errChg}` : ''}`)}
          {tile('#f08c00', 'Verbessert', r.fixes === 1 ? '1 Mal' : `${r.fixes} Mal`, 'Ware oder Geld zurückgelegt')}
        </div>
        <div className="ck-table" style={{ fontSize: Math.min(24, rowH * 0.42), marginTop: 14 }}>
          {done.map((x, k) => {
            const errors = x.errSum + x.errPay + x.errChg;
            return (
              <div key={k} className="ck-trow" style={{ height: rowH }}>
                <span className="ck-face" style={{ width: rowH * 0.9, height: rowH }} dangerouslySetInnerHTML={{ __html: CUSTOMERS[x.cust]?.draw('happy') ?? '' }} />
                <span>Kunde {k + 1}</span>
                <span>{duration(x.end - x.start)}</span>
                <span className={errors ? 'is-bad' : 'is-good'}>{errors ? (errors === 1 ? '1 Fehler' : `${errors} Fehler`) : '✓ ohne Fehler'}</span>
              </div>
            );
          })}
        </div>
        <Key action="again" label="Nochmal" press={press} className="ck-btn is-blue ck-again" style={{ fontSize: 26, height: 60, width: 300 }}>
          Nochmal
        </Key>
      </div>
    </>
  );
}

/** Scales the 1400 × 990 stage into the box it gets. */
export function Scaled({ children, label }: { children: ReactNode; label?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const measure = () => setK(Math.min(el.clientWidth / W, el.clientHeight / H));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={outer} className="ck-frame" role="group" aria-label={label}>
      <div className="ck-scale" style={{ transform: `scale(${k})`, left: `calc(50% - ${(W * k) / 2}px)`, top: `calc(50% - ${(H * k) / 2}px)` }}>
        {children}
      </div>
    </div>
  );
}

export default function Checkout({ element }: { element: PageElement }) {
  const { interactive, update } = useLearning(element);
  const c = shopConfig(element.settings?.checkout);
  const [state, setState] = useState<ShopState>(freshShop);
  const current = useRef(state);
  const config = useRef(c);
  useLayoutEffect(() => {
    config.current = c;
  });
  const token = useRef(0);
  const pending = useRef<Step[] | null>(null);
  const stopSpeech = useRef<(() => void) | null>(null);
  const custRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLDivElement>(null);
  const lastHint = useRef(0);

  const set = useCallback((s: ShopState) => {
    current.current = s;
    setState(s);
  }, []);
  const silence = () => {
    stopSpeech.current?.();
    stopSpeech.current = null;
  };
  /** Ends the sentence still being spoken (its step goes on at once). */
  const cutOff = useRef<(() => void) | null>(null);
  const say = (text: string, who: Who) =>
    new Promise<void>((resolve) => {
      cutOff.current?.();
      const s = current.current;
      const person = CUSTOMERS[s.custs[s.round] ?? 0];
      let finished = false;
      const end = () => {
        if (finished) return;
        finished = true;
        if (cutOff.current === end) cutOff.current = null;
        resolve();
      };
      cutOff.current = end;
      stopSpeech.current = startGermanSpeech(text, { ...(who === 'cust' ? { pitch: person.pitch, rate: person.rate } : {}), onEnd: end, onError: end });
      // Like the reference: if the voice never reports its end, go on after a generous time.
      setTimeout(end, stopSpeech.current ? 4000 + text.length * 160 : 350);
    });
  const hint = (text: string) => {
    if (clock() - lastHint.current < 3500) return;
    lastHint.current = clock();
    void say(text, 'cash');
  };
  const walk = async (way: 'in' | 'out') => {
    const el = custRef.current;
    if (!el?.isConnected || !el.animate) return sleep(way === 'in' ? 300 : 200);
    const dx = DOOR - CUST.x;
    figRef.current?.classList.add('is-walking');
    const frames =
      way === 'in'
        ? [{ transform: `translateX(${dx}px)`, opacity: 0 }, { transform: `translateX(${dx * 0.9}px)`, opacity: 1, offset: 0.1 }, { transform: 'translateX(0)', opacity: 1 }]
        : [{ transform: 'translateX(0)', opacity: 1 }, { transform: `translateX(${dx * 0.9}px)`, opacity: 1, offset: 0.9 }, { transform: `translateX(${dx}px)`, opacity: 0 }];
    try {
      await el.animate(frames, { duration: way === 'in' ? 1700 : 1400, easing: way === 'in' ? 'ease-out' : 'ease-in', fill: 'none' }).finished;
    } catch {}
    figRef.current?.classList.remove('is-walking');
    if (way === 'out') el.style.opacity = '0';
  };
  useLayoutEffect(() => {
    if (state.inside && state.phase !== 'leave' && custRef.current) custRef.current.style.opacity = '';
  }, [state]);

  /** Stops a running sequence; its remaining state changes happen at once. */
  const cancel = () => {
    const rest = pending.current;
    pending.current = null;
    token.current++;
    let s = current.current;
    rest?.forEach((step) => step.do && (s = step.do(s)));
    if (rest) set(s);
  };
  const run = async (steps: Step[]) => {
    cancel();
    const mine = token.current;
    pending.current = steps.slice();
    while (pending.current?.length && token.current === mine) {
      const step = pending.current.shift()!;
      if (step.do) set(step.do(current.current));
      if (step.walk && current.current.phase !== 'done') await walk(step.walk);
      if (token.current !== mine) return;
      const line = typeof step.say === 'function' ? step.say(current.current) : step.say;
      if (line) await say(line[0], line[1]);
      if (token.current !== mine) return;
      if (step.wait) await sleep(step.wait);
    }
    if (token.current === mine) pending.current = null;
  };
  useEffect(
    () => () => {
      pending.current = null;
      token.current++;
      stopSpeech.current?.();
    },
    [],
  );
  // New settings start the shop again.
  const key = JSON.stringify(element.settings?.checkout ?? null);
  const seenKey = useRef(key);
  useEffect(() => {
    if (seenKey.current === key) return;
    seenKey.current = key;
    pending.current = null;
    token.current++;
    stopSpeech.current?.();
    set(freshShop());
  }, [key, set]);

  const talkStep = (talk: Talk, mood: Mood, after: (s: ShopState) => ShopState = (s) => s): Step => ({
    do: (s) => after({ ...s, talk, mood }),
    say: [talk.said, 'cust'],
  });
  const enter = (): Step[] => [
    { do: (s) => (s.phase === 'done' ? s : nextCustomer(config.current, s)), walk: 'in' },
    {
      do: (s) => {
        if (s.phase === 'done') return s;
        const res = [...s.res];
        if (res[s.round]) res[s.round] = { ...res[s.round], start: Date.now() };
        return { ...s, phase: 'order', talk: orderTalk(config.current, s, CUSTOMERS[s.custs[s.round] ?? 0].greet, false), res };
      },
      say: (s) => (s.phase === 'order' && s.talk ? [s.talk.said, 'cust'] : null),
    },
  ];
  const finish = (s: ShopState) => {
    feedback(true);
    const r = summary(s);
    update({ checkout: r as unknown as JsonValue, score: r.served ? Math.round((100 * r.perfect) / r.served) : 0 });
  };
  const leave = (): Step[] => [
    {
      ...talkStep({ text: 'Vielen Dank, das stimmt. Servus!', said: 'Vielen Dank, das stimmt. Servus!' }, 'happy', (s) => {
        const res = [...s.res];
        if (res[s.round]) res[s.round] = { ...res[s.round], end: Date.now() };
        feedback(true);
        return { ...s, phase: 'busy', res };
      }),
      wait: 500,
    },
    { do: (s) => ({ ...s, talk: null, phase: 'leave' }), walk: 'out' },
    {
      do: (s) => {
        const next: ShopState = { ...s, inside: false, cart: [], sumShown: false, payIn: [], chgIn: [], chgShown: false };
        if (s.round + 1 >= s.custs.length) {
          const done = { ...next, phase: 'done' as const };
          finish(done);
          return done;
        }
        return { ...next, round: s.round + 1 };
      },
      wait: 450,
    },
    ...enter(),
  ];

  const press = (a: string) => {
    const s = current.current, cfg = config.current;
    if (a === 'open' || a === 'again') {
      cancel();
      silence();
      cutOff.current?.();
      // iPad: speech only works after a sentence started by a tap.
      try {
        window.speechSynthesis?.speak(new SpeechSynthesisUtterance(''));
      } catch {}
      set({ ...freshShop(), custs: customerOrder(cfg.customers, CUSTOMERS.length) });
      void run(enter());
      return;
    }
    if (a === 'say') {
      if (s.talk && s.inside) void say(s.talk.said, 'cust');
      return;
    }
    if (a.startsWith('pr:')) {
      const item = cfg.items[Number(a.slice(3))];
      if (item) void say(spokenPrice(item.price), 'cash');
      return;
    }
    if (a.startsWith('p:')) {
      const i = Number(a.slice(2));
      if (s.phase !== 'order') {
        if (s.phase === 'pay' || s.phase === 'change') return hint('Der Einkauf ist fertig. Jetzt wird bezahlt.');
        if (cfg.read && cfg.items[i]) void say(cfg.items[i].name, 'cash');
        return;
      }
      if (cfg.read && cfg.items[i]) void say(cfg.items[i].name, 'cash');
      set(addGood(s, i));
      return;
    }
    if (a.startsWith('r:')) {
      if (s.phase === 'order') set(removeGood(s, Number(a.slice(2))));
      return;
    }
    if (a === 'sum') {
      if (s.phase !== 'order' || !s.cart.length) return;
      const cost = total(cfg, s.cart);
      const steps: Step[] = [{ do: (x) => ({ ...x, sumShown: true, phase: 'busy' }), say: [`Das kostet ${spokenPrice(cost)}.`, 'cash'], wait: 250 }];
      if (cartRight(s)) steps.push(talkStep(sumTalk(cfg, s), 'happy', (x) => ({ ...x, phase: 'pay' })));
      else steps.push(talkStep(orderTalk(cfg, s, '', true), 'sad', (x) => fix({ ...x, phase: 'order' }, 'errSum')));
      void run(steps);
      return;
    }
    if (a.startsWith('m:')) {
      const v = Number(a.slice(2));
      if (s.phase === 'pay') set({ ...s, payIn: [...s.payIn, v] });
      else if (s.phase === 'change' && cfg.give) set({ ...s, chgIn: [...s.chgIn, v] });
      else if (s.phase === 'order') hint('Tippe zuerst die Waren ein und drücke auf „Summe“.');
      return;
    }
    if (a.startsWith('pz:')) {
      if (s.phase !== 'pay') return;
      const v = Number(a.slice(3));
      if (s.payIn.includes(v)) set(fix({ ...s, payIn: without(s.payIn, v) }));
      return;
    }
    if (a.startsWith('cz:')) {
      const v = Number(a.slice(3)), k = s.chgIn.lastIndexOf(v);
      if (k < 0) return;
      if (cfg.give && s.phase === 'change') set(fix({ ...s, chgIn: without(s.chgIn, v) }));
      else if (!cfg.give && SPLIT[v]) set({ ...s, chgIn: [...s.chgIn.slice(0, k), ...SPLIT[v], ...s.chgIn.slice(k + 1)] });
      return;
    }
    if (a === 'check') {
      if (s.phase !== 'pay') return;
      const paid = sum(s.payIn), cost = total(cfg, s.cart);
      if (!paid) return hint('Lege das Geld des Kunden aus der Schublade in das Feld „Kunde zahlt“.');
      const busy = (x: ShopState): ShopState => ({ ...x, phase: 'busy' });
      // The customer answers to the money that lies there – no change is worked out from a wrong amount.
      if (paid !== s.paid) {
        const wrong = talkStep(wrongPaymentTalk(cfg, s, paid), 'sad', (x) => fix({ ...x, phase: 'pay', chgShown: false, chgIn: [] }, 'errPay'));
        void run([{ do: busy, wait: 150 }, wrong]);
        return;
      }
      if (cfg.give) {
        if (paid === cost) void run([{ do: busy, say: ['Stimmt genau.', 'cash'], wait: 250 }, ...leave()]);
        else void run([{ do: (x) => ({ ...x, phase: 'change', chgShown: true, chgIn: [] }), say: ['Gib dem Kunden das Rückgeld.', 'cash'] }]);
        return;
      }
      const diff = paid - cost;
      const change: Step = { do: (x) => ({ ...x, phase: 'busy', chgShown: true, chgIn: changeCoins(diff) }), say: [diff ? `Das Wechselgeld beträgt ${spokenPrice(diff)}.` : 'Stimmt genau.', 'cash'], wait: 250 };
      void run([change, ...leave()]);
      return;
    }
    if (a === 'give') {
      if (s.phase !== 'change') return;
      const given = sum(s.chgIn);
      if (given === s.paid - total(cfg, s.cart)) void run(leave());
      else void run([talkStep(wrongChangeTalk(cfg, s, given), 'sad', (x) => fix(x, 'errChg'))]);
    }
  };

  const shown = interactive ? state : previewState(c);
  return (
    <Scaled label={shopLabel(c)}>
      <CheckoutStage c={c} s={shown} press={interactive ? press : undefined} custRef={custRef} figRef={figRef} />
    </Scaled>
  );
}
