'use client';
import { useRef } from 'react';
import type { PageElement } from '@/lib/notebook-model';
import type { JsonValue } from '@/lib/learning/catalog';
import {
  SHOP_NAMES,
  duration,
  money,
  newReceipt,
  nextReceipt,
  receiptConfig,
  receiptKey,
  receiptLabel,
  receiptLayout,
  solved,
  toggleField,
  unit,
  type ReceiptConfig,
  type ReceiptState,
} from '@/lib/learning/receipt';
import { tone } from '@/lib/learning/audio';
import { useLearning } from './Runtime';

const W = 820, H = 860;
const PAPER = { x: 20, w: 500 }, PAD = { x: 556, w: 240 };
const INK = '#2b2b2b', MONO = "'Courier New', Courier, monospace", SANS = 'Verdana, sans-serif';

function hash(text: string) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}
const configKey = (c: ReceiptConfig) => `${c.count}|${c.level}|${c.format}|${c.change}|${c.rounds}`;

function feedback(right: boolean) {
  try {
    if (right) {
      tone(659, 0.15, 0.25);
      setTimeout(() => tone(880, 0.3, 0.25), 130);
    } else tone(196, 0.35, 0.25);
  } catch {}
}

/** Zigzag top and bottom edge of the paper. */
function paperPath(top: number, bottom: number) {
  const { x, w } = PAPER;
  let d = `M${x} ${top}`;
  for (let i = 1; i <= 25; i++) d += `L${x + (w * (i - 0.5)) / 25} ${top - 9}L${x + (w * i) / 25} ${top}`;
  d += `L${x + w} ${bottom}`;
  for (let i = 24; i >= 0; i--) d += `L${x + (w * (i + 0.5)) / 25} ${bottom + 9}L${x + (w * i) / 25} ${bottom}`;
  return d + 'Z';
}

type Press = (action: string) => void;

function Tap({ action, label, active, press, children, className }: { action: string; label: string; active: boolean; press: Press; children: React.ReactNode; className?: string }) {
  if (!active) return <g className={className}>{children}</g>;
  return (
    <g
      className={`mt-key ${className || ''}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        press(action);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          press(action);
        }
      }}
    >
      <title>{label}</title>
      {children}
    </g>
  );
}

function Field({ field, y, text, ok, open, c, active, press }: { field: 'sum' | 'change'; y: number; text: string; ok: boolean | null; open: boolean; c: ReceiptConfig; active: boolean; press: Press }) {
  const x = PAPER.x + PAPER.w - 236;
  const fill = ok === true ? '#ebfbee' : ok === false ? '#fff5f5' : open ? '#e7f5ff' : '#ffffff';
  const line = ok === true ? '#2f9e44' : ok === false ? '#e03131' : open ? '#1c7ed6' : '#868e96';
  return (
    <>
      <Tap action={`f:${field}`} label={field === 'sum' ? 'Summe eintragen' : 'Rückgeld eintragen'} active={active && ok !== true} press={press}>
        <rect x={x} y={y - 34} width="180" height="48" rx="6" fill={fill} stroke={line} strokeWidth={open ? 4 : 2.5} strokeDasharray={open || ok !== null ? undefined : '7 5'} />
        <text x={x + 168} y={y} textAnchor="end" fontFamily={MONO} fontWeight="700" fontSize="30" fill={INK}>
          {text}
          {open && <tspan fill="#1c7ed6">|</tspan>}
        </text>
      </Tap>
      <text x={x + 192} y={y} fontFamily={MONO} fontWeight="700" fontSize="28" fill={INK}>
        {unit(c.format)}
      </text>
      {ok === true && <path d={`M${x - 40} ${y - 12}l10 10 20-22`} fill="none" stroke="#2f9e44" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />}
      {ok === false && (
        <text x={x + 180} y={y + 40} textAnchor="end" fontFamily={SANS} fontSize="19" fontWeight="700" fill="#c92a2a">
          Stimmt noch nicht – rechne nach.
        </text>
      )}
    </>
  );
}

function Pad({ fieldY, c, press }: { fieldY: number; c: ReceiptConfig; press: Press }) {
  const keys: [string, string][] = [['7', '7'], ['8', '8'], ['9', '9'], ['4', '4'], ['5', '5'], ['6', '6'], ['1', '1'], ['2', '2'], ['3', '3'], [',', ','], ['0', '0'], ['⌫', 'del']];
  const top = Math.max(64, Math.min(500, fieldY - 150));
  const ok = top + 44 + 224;
  return (
    <g className="receipt-pad">
      <rect x={PAD.x} y={top} width={PAD.w} height="340" rx="20" fill="#f1f3f5" stroke="#ced4da" strokeWidth="2" />
      <text x={PAD.x + PAD.w / 2} y={top + 30} textAnchor="middle" fontFamily={SANS} fontSize="17" fontWeight="700" fill="#495057">
        Eintragen
      </text>
      {keys.map(([label, action], i) => {
        if (action === ',' && c.format !== 'eurocent') return null;
        const x = PAD.x + 14 + (i % 3) * 72, y = top + 44 + Math.floor(i / 3) * 56;
        return (
          <Tap key={action} action={`k:${action}`} label={action === 'del' ? 'Löschen' : label} active press={press}>
            <rect x={x} y={y} width="64" height="48" rx="10" fill={action === 'del' ? '#dee2e6' : '#ffffff'} stroke="#adb5bd" strokeWidth="1.5" />
            <text x={x + 32} y={y + 33} textAnchor="middle" fontFamily={SANS} fontSize="25" fontWeight="700" fill="#212529">
              {label}
            </text>
          </Tap>
        );
      })}
      <Tap action="k:ok" label="Prüfen" active press={press}>
        <rect x={PAD.x + 14} y={ok} width="208" height="54" rx="12" fill="#2f9e44" />
        <text x={PAD.x + PAD.w / 2} y={ok + 36} textAnchor="middle" fontFamily={SANS} fontSize="24" fontWeight="700" fill="#ffffff">
          Prüfen ✓
        </text>
      </Tap>
    </g>
  );
}

function Summary({ s, active, press }: { s: ReceiptState; active: boolean; press: Press }) {
  const done = s.stats.filter((r) => r && r.end);
  const n = done.length;
  const time = done.reduce((a, r) => a + (r.end - r.start), 0);
  const clean = done.filter((r) => !r.errors).length;
  const errors = done.reduce((a, r) => a + r.errors, 0);
  const fixes = done.reduce((a, r) => a + r.fixes, 0);
  const rowHeight = n > 6 ? 30 : 36;
  return (
    <>
      <rect x="20" y="18" width="780" height="824" rx="26" fill="#ffffff" stroke="#dee2e6" strokeWidth="2" filter="url(#receipt-shadow)" />
      <text x={W / 2} y="92" textAnchor="middle" fontFamily={SANS} fontSize="40" fontWeight="700" fill="#1f2937">
        Auswertung
      </text>
      <text x={W / 2} y="132" textAnchor="middle" fontFamily={SANS} fontSize="22" fill="#495057">
        {n === 1 ? 'Ein Kassenzettel' : `${n} Kassenzettel`} gerechnet
      </text>
      {([
        ['#1c7ed6', 'Zeit', duration(time)],
        ['#2f9e44', 'Gleich richtig', `${clean} von ${n}`],
        ['#e03131', 'Fehler beim Prüfen', String(errors)],
        ['#f08c00', 'Verbessert (gelöscht)', fixes === 1 ? '1 Mal' : `${fixes} Mal`],
      ] as const).map(([colour, label, value], i) => {
        const y = 178 + i * 52;
        return (
          <g key={label}>
            <rect x="90" y={y} width="640" height="44" rx="12" fill={colour} opacity=".09" />
            <circle cx="118" cy={y + 22} r="9" fill={colour} />
            <text x="142" y={y + 30} fontFamily={SANS} fontSize="23" fill="#343a40">{label}</text>
            <text x="710" y={y + 30} textAnchor="end" fontFamily={SANS} fontSize="25" fontWeight="700" fill="#1f2937">{value}</text>
          </g>
        );
      })}
      <text x="150" y="420" fontFamily={SANS} fontSize="18" fontWeight="700" fill="#868e96">ZETTEL</text>
      <text x="420" y="420" textAnchor="end" fontFamily={SANS} fontSize="18" fontWeight="700" fill="#868e96">ZEIT</text>
      <text x="670" y="420" textAnchor="end" fontFamily={SANS} fontSize="18" fontWeight="700" fill="#868e96">FEHLER</text>
      <path d="M130 432H690" stroke="#dee2e6" strokeWidth="2" />
      {done.map((r, i) => {
        const y = 434 + (i + 1) * rowHeight - 8, size = n > 6 ? 19 : 21;
        return (
          <g key={i}>
            <text x="150" y={y} fontFamily={SANS} fontSize={size} fill="#343a40">{i + 1}</text>
            <text x="420" y={y} textAnchor="end" fontFamily={SANS} fontSize={size} fill="#343a40">{duration(r.end - r.start)}</text>
            {r.errors ? (
              <text x="670" y={y} textAnchor="end" fontFamily={SANS} fontSize={size} fontWeight="700" fill="#e03131">{r.errors}</text>
            ) : (
              <path d={`M648 ${y - 8}l7 7 14-15`} fill="none" stroke="#2f9e44" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </g>
        );
      })}
      <Tap action="restart" label="Nochmal: neue Kassenzettel" active={active} press={press}>
        <rect x={W / 2 - 150} y="742" width="300" height="70" rx="35" fill="#1c7ed6" />
        <text x={W / 2} y="786" textAnchor="middle" fontFamily={SANS} fontSize="25" fontWeight="700" fill="#ffffff">Nochmal</text>
      </Tap>
    </>
  );
}

/** Kassenzettel: add up, type the sum (and the change), get a stamp. */
export default function Receipt({ element: el }: { element: PageElement }) {
  const { state, update, interactive } = useLearning(el);
  const svg = useRef<SVGSVGElement>(null);
  const c = receiptConfig(el.settings as Record<string, unknown>);
  const seed = hash(el.id) ^ Number(el.settings?.seed || 0);
  const stored = state.receipt as unknown as (ReceiptState & { config?: string; serial?: number }) | undefined;
  const s: ReceiptState & { serial?: number } = stored && stored.config === configKey(c) ? stored : newReceipt(c, seed);
  const serial = stored?.serial ?? 0;
  const save = (next: ReceiptState, nextSerial = serial) =>
    update({ receipt: { ...next, config: configKey(c), serial: nextSerial } as unknown as JsonValue });
  const press: Press = (action) => {
    if (action === 'f:sum' || action === 'f:change') {
      save(toggleField(s, action.slice(2) as 'sum' | 'change'));
      requestAnimationFrame(() => svg.current?.focus({ preventScroll: true }));
    } else if (action.startsWith('k:')) {
      const { state: next, result } = receiptKey(c, s, action.slice(2));
      if (result) feedback(result === 'right');
      save(next);
    } else if (action === 'again') {
      const next = nextReceipt(c, s, seed + serial + 1);
      if (next.summary) feedback(true);
      save(next, serial + 1);
    } else if (action === 'restart') save(newReceipt(c, seed + serial + 1), serial + 1);
  };
  const L = receiptLayout(s.lines.length, c.change);
  const centre = PAPER.x + PAPER.w / 2, right = PAPER.x + PAPER.w - 26, left = PAPER.x + 26;
  const now = new Date();
  const done = solved(c, s);
  const footer = L.end - 62;
  const bars: React.ReactNode[] = [];
  for (let x = centre - 110, v = 7; x < centre + 110; ) {
    v = (v * 13 + 5) % 17;
    const w = 1 + (v % 4);
    bars.push(<rect key={x} x={x} y={footer + 14} width={w} height="26" fill="#444" />);
    x += w + 2 + (v % 3);
  }
  const hintY = (s.sumOk === true && c.change ? L.changeY : L.sumY) - 10;
  return (
    <svg
      ref={svg}
      className="receipt-widget"
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      role="group"
      tabIndex={interactive && s.active ? 0 : -1}
      aria-label={receiptLabel(c, s.lines.length)}
      onKeyDown={(e) => {
        if (!interactive || !s.active || e.metaKey || e.ctrlKey || e.altKey) return;
        const key = e.key === ',' || e.key === '.' ? ',' : e.key === 'Backspace' ? 'del' : e.key === 'Enter' ? 'ok' : /^\d$/.test(e.key) ? e.key : '';
        if (e.key === 'Escape') save({ ...s, active: null });
        else if (key) press(`k:${key}`);
        else return;
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <defs>
        <filter id="receipt-shadow" x="-10%" y="-5%" width="125%" height="115%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#1f2937" floodOpacity=".22" />
        </filter>
      </defs>
      {s.summary && interactive ? (
        <Summary s={s} active={interactive} press={press} />
      ) : (
        <>
          <path d={paperPath(18, L.end)} fill="#fffdf8" stroke="#e9e4d8" strokeWidth="1.5" filter="url(#receipt-shadow)" />
          <text x={centre} y="72" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="34" letterSpacing="3" fill={INK}>{SHOP_NAMES[c.format]}</text>
          <text x={centre} y="104" textAnchor="middle" fontFamily={MONO} fontSize="19" fill="#555">Lindenweg 7 · Tel. 0123 45678</text>
          <text x={left} y="140" fontFamily={MONO} fontSize="19" fill="#555">{now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</text>
          <text x={right} y="140" textAnchor="end" fontFamily={MONO} fontSize="19" fill="#555">{now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</text>
          <path d={`M${left} 160H${right}`} stroke="#999" strokeWidth="2" strokeDasharray="6 6" />
          {s.lines.map((line, i) => {
            const y = L.first + i * L.step;
            return (
              <g key={i}>
                <text x={left} y={y} fontFamily={MONO} fontSize="25" fill={INK}>{line.name}</text>
                <text x={right} y={y} textAnchor="end" fontFamily={MONO} fontSize="25" fill={INK}>{money(line.price, c.format)}</text>
              </g>
            );
          })}
          {(() => {
            const y = L.first + (s.lines.length - 1) * L.step + 22;
            return (
              <>
                <path d={`M${left} ${y}H${right}`} stroke={INK} strokeWidth="2.5" />
                <path d={`M${left} ${y + 6}H${right}`} stroke={INK} strokeWidth="2.5" />
              </>
            );
          })()}
          <text x={left} y={L.sumY} fontFamily={MONO} fontWeight="700" fontSize="30" fill={INK}>SUMME</text>
          <Field field="sum" y={L.sumY} text={s.sum} ok={s.sumOk} open={s.active === 'sum'} c={c} active={interactive} press={press} />
          {c.change && (
            <>
              <text x={left} y={L.paidY} fontFamily={MONO} fontSize="26" fill={INK}>GEGEBEN</text>
              {s.sumOk === true ? (
                <text x={right} y={L.paidY} textAnchor="end" fontFamily={MONO} fontWeight="700" fontSize="28" fill={INK}>{money(s.paid, c.format)}</text>
              ) : (
                <text x={right} y={L.paidY} textAnchor="end" fontFamily={MONO} fontSize="26" fill="#999">…</text>
              )}
              <text x={left} y={L.changeY} fontFamily={MONO} fontWeight="700" fontSize="28" fill={INK}>RÜCKGELD</text>
              <Field field="change" y={L.changeY} text={s.change} ok={s.changeOk} open={s.active === 'change'} c={c} active={interactive && s.sumOk === true} press={press} />
            </>
          )}
          <text x={centre} y={footer} textAnchor="middle" fontFamily={MONO} fontSize="19" fill="#555">Vielen Dank für Ihren Einkauf!</text>
          {bars}
          {interactive && (
            <>
              {c.rounds > 1 && (
                <text x={PAD.x + PAD.w / 2} y="44" textAnchor="middle" fontFamily={SANS} fontSize="21" fontWeight="700" fill="#495057">
                  Zettel {s.round + 1} von {c.rounds}
                </text>
              )}
              {s.active && <Pad fieldY={s.active === 'sum' ? L.sumY : L.changeY} c={c} press={press} />}
              {done ? (
                <>
                  <g className="receipt-stamp" transform={`rotate(-12 ${centre} ${L.first + 60})`}>
                    <rect x={centre - 150} y={L.first + 14} width="300" height="92" rx="14" fill="none" stroke="#2f9e44" strokeWidth="7" opacity=".85" />
                    <text x={centre} y={L.first + 76} textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="44" letterSpacing="4" fill="#2f9e44" opacity=".85">RICHTIG</text>
                  </g>
                  {(() => {
                    const y = (c.change ? L.changeY : L.sumY) - 45, last = s.round + 1 >= c.rounds;
                    return (
                      <Tap action="again" label={last ? 'Auswertung zeigen' : 'Der nächste Kassenzettel'} active press={press}>
                        <rect x={PAD.x} y={y} width={PAD.w} height="70" rx="35" fill={last ? '#2f9e44' : '#1c7ed6'} />
                        <text x={PAD.x + PAD.w / 2} y={y + 44} textAnchor="middle" fontFamily={SANS} fontSize="24" fontWeight="700" fill="#ffffff">
                          {last ? 'Auswertung' : 'Nächster Zettel'}
                        </text>
                      </Tap>
                    );
                  })()}
                </>
              ) : (
                !s.active && (
                  <g aria-hidden="true">
                    <path d={`M${PAD.x + 18} ${hintY - 20}h-26m10-10l-10 10 10 10`} fill="none" stroke="#1c7ed6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <text x={PAD.x + 34} y={hintY - 12} fontFamily={SANS} fontSize="20" fill="#495057">Tippe auf das Feld</text>
                    <text x={PAD.x + 34} y={hintY + 14} fontFamily={SANS} fontSize="20" fill="#495057">
                      {s.sumOk === true && c.change ? '„Rückgeld“.' : 'neben „Summe“.'}
                    </text>
                  </g>
                )
              )}
            </>
          )}
        </>
      )}
    </svg>
  );
}
