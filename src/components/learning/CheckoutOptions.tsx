'use client';
// Settings of “Einkaufen an der Kasse”, like the dialog of the reference:
// basket, prices, customers, help, the sign and the goods on the shelf.
import { useState } from 'react';
import Icon from '../Icon';
import { ChoiceButton, Choices, OptionGroup } from '../ui/Choice';
import { TextGlyph } from '../ui/Glyphs';
import { uploadImage } from '@/lib/client-api';
import {
  BASKETS,
  LEVELS,
  MAX_ITEMS,
  basketItems,
  itemPicture,
  parsePrice,
  priceText,
  rollPrices,
  shopConfig,
  type Gender,
  type ShopConfig,
  type ShopItem,
} from '@/lib/learning/checkout';
import { CheckoutStage, Scaled, previewState } from './Checkout';

const ARTICLES: { value: Gender; label: string }[] = [
  { value: 'm', label: 'einen' },
  { value: 'f', label: 'eine' },
  { value: 'n', label: 'ein' },
];
const yesNo = [
  { value: true, label: 'Ja', icon: 'checkmark' as const },
  { value: false, label: 'Nein', icon: 'cancel' as const },
];

function PriceField({ item, level, onChange }: { item: ShopItem; level: ShopConfig['level']; onChange: (cents: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? priceText(item.price, level).replace(/ €$/, '');
  const commit = () => {
    if (draft === null) return;
    const cents = parsePrice(draft, level);
    if (cents !== null) onChange(Math.min(1e7, cents));
    setDraft(null);
  };
  return (
    <span className="ck-opt-price">
      <input value={shown} inputMode="decimal" aria-label={`Preis von ${item.name || 'der Ware'}`} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), commit())} />
      {!shown.endsWith('ct') && <span>€</span>}
    </span>
  );
}

/** `value` is the saved (raw) shop; empty names stay while editing. */
export default function CheckoutOptions({ value, onChange }: { value: unknown; onChange: (shop: ShopConfig) => void }) {
  const raw = (value && typeof value === 'object' ? value : {}) as Partial<ShopConfig>;
  // Keep goods without a name while they are typed; shopConfig drops them when shown.
  const c: ShopConfig = { ...shopConfig(raw), items: Array.isArray(raw.items) && raw.items.length ? (raw.items as ShopItem[]) : shopConfig(raw).items };
  const [error, setError] = useState('');
  const set = (values: Partial<ShopConfig>) => onChange({ ...c, ...values });
  const setItem = (i: number, values: Partial<ShopItem>) => set({ items: c.items.map((item, k) => (k === i ? { ...item, ...values } : item)) });
  const level = LEVELS.find((l) => l.value === c.level)!;
  const shown = shopConfig(c);

  return (
    <>
      <div className="ck-opt-preview" aria-hidden="true">
        <Scaled>
          <CheckoutStage c={shown} s={previewState(shown)} />
        </Scaled>
      </div>
      <Choices
        label="Warenkorb"
        value={c.basket}
        onChange={(id) => {
          const b = BASKETS.find((x) => x.id === id)!;
          set({ basket: b.id, sign: b.sign, items: basketItems(b, c.level) });
        }}
        options={BASKETS.map((b) => ({ value: b.id, label: b.label, icon: <TextGlyph text={b.label[0]} /> }))}
      />
      <Choices
        label="Preise"
        value={c.level}
        onChange={(lv) => {
          const prices = rollPrices(c.items, lv);
          set({ level: lv, items: c.items.map((item, i) => ({ ...item, price: prices[i] })) });
        }}
        options={LEVELS.map((l) => ({ value: l.value, label: l.label, icon: <TextGlyph text={l.label[0]} /> }))}
      />
      <p className="option-hint">{level.hint}</p>
      <Choices label="Kunden bis zur Auswertung" value={c.customers} onChange={(customers) => set({ customers })} options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ value: n, label: String(n), icon: <TextGlyph text={String(n)} /> }))} />
      <Choices label="Verschiedene Waren je Kunde" value={c.kinds} onChange={(kinds) => set({ kinds })} options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: `bis ${n}`, icon: <TextGlyph text={String(n)} /> }))} />
      <Choices label="Auch mehrere Stück" value={c.qty} onChange={(qty) => set({ qty })} options={yesNo} />
      <p className="option-hint">Der Kunde möchte z. B. „zwei Brezen“.</p>
      <Choices label="Bilder in der Sprechblase" value={c.pics} onChange={(pics) => set({ pics })} options={yesNo} />
      <p className="option-hint">Die Waren stehen als Bilder mit Anzahl da – hilft Kindern, die noch nicht lesen. Der Kunde spricht immer.</p>
      <Choices label="Beim Antippen vorlesen" value={c.read} onChange={(read) => set({ read })} options={yesNo} />
      <p className="option-hint">Ein Tipp auf eine Ware sagt ihren Namen (und legt sie auf den Zettel), ein Tipp auf ihren Preis sagt den Preis.</p>
      <Choices label="Rückgeld selbst herausgeben" value={c.give} onChange={(give) => set({ give })} options={yesNo} />
      <p className="option-hint">Die Kasse rechnet das Wechselgeld nicht vor: Das Kind legt es aus der Schublade in „Rückgeld“ und tippt auf „Rückgeld geben“.</p>
      <label className="property-label">
        Schild über der Tür
        <input value={raw.sign ?? c.sign} maxLength={24} onChange={(e) => onChange({ ...c, sign: e.target.value.slice(0, 24) })} />
      </label>

      <OptionGroup label={`Waren im Regal (${c.items.length} von ${MAX_ITEMS})`}>
        <ChoiceButton
          icon="synchronize"
          label="Preise neu würfeln"
          onClick={() => {
            const prices = rollPrices(c.items, c.level);
            set({ items: c.items.map((item, i) => ({ ...item, price: prices[i] })) });
          }}
        />
        <ChoiceButton
          icon="plus"
          label="Eigene Ware"
          disabled={c.items.length >= MAX_ITEMS}
          onClick={() => set({ items: [...c.items, { name: '', price: c.level === 'cent' ? 50 : c.level === 'bills' ? 1000 : c.level === 'high' ? 4999 : 200, g: 'm' }] })}
        />
      </OptionGroup>
      <div className="ck-opt-list">
        {c.items.map((item, i) => {
          const pic = itemPicture(item);
          return (
            <div key={i} className="ck-opt-row">
              <label className="ck-opt-pic" title="Bild wählen">
                {pic ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pic} alt="" />
                ) : (
                  <Icon name="picture" />
                )}
                <input
                  className="visually-hidden"
                  type="file"
                  accept="image/*"
                  aria-label={`Bild für ${item.name || 'die Ware'} wählen`}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    try {
                      setError('');
                      setItem(i, { image: await uploadImage(file), picto: undefined });
                    } catch (err) {
                      setError((err as Error).message);
                    }
                  }}
                />
              </label>
              <div className="ck-opt-fields">
                <div className="ck-opt-line">
                  <input className="ck-opt-name" value={item.name} placeholder="Name der Ware" aria-label="Name der Ware" maxLength={30} onChange={(e) => setItem(i, { name: e.target.value.slice(0, 30), sg: undefined, pl: undefined })} />
                  <PriceField item={item} level={c.level} onChange={(price) => setItem(i, { price, base: price })} />
                  <button type="button" className="knopf compact" aria-label={`${item.name || 'Ware'} entfernen`} disabled={c.items.length < 2} onClick={() => set({ items: c.items.filter((_, k) => k !== i) })}>
                    <Icon name="cancel" />
                  </button>
                </div>
                <div className="ck-opt-line ck-opt-say">
                  <span>Kunde sagt:</span>
                  <span className="ck-opt-articles" role="group" aria-label="Artikel">
                    {ARTICLES.map((a) => (
                      <button key={a.value} type="button" className="choice" aria-pressed={item.g === a.value} onClick={() => setItem(i, { g: a.value })}>
                        {a.label}
                      </button>
                    ))}
                  </span>
                  <input value={item.sg ?? ''} placeholder={item.name || 'Breze'} aria-label="Einzahl" maxLength={40} onChange={(e) => setItem(i, { sg: e.target.value.slice(0, 40) || undefined })} />
                  <span>· zwei</span>
                  <input value={item.pl ?? ''} placeholder={item.sg || item.name || 'Brezen'} aria-label="Mehrzahl" maxLength={40} onChange={(e) => setItem(i, { pl: e.target.value.slice(0, 40) || undefined })} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <p className="option-hint">Bilder: ARASAAC (Sergio Palao), CC BY-NC-SA 4.0 – eigene Bilder über das Bild-Symbol. Die Seite wird ganz von der Kasse ausgefüllt.</p>
    </>
  );
}
