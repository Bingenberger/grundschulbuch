// “Einkaufen an der Kasse” – faithful port of the shop of the reference
// (Lernsachen-Heft): customers come in and order goods, the child types them
// into the till, presses “Summe”, takes the customer's money from the drawer
// and checks it; the till (or the child) gives the change.
// Amounts are whole cents.

export type Gender = 'm' | 'f' | 'n';
export type PriceLevel = 'cent' | 'euro' | 'round' | 'mixed' | 'bills' | 'high';

export type ShopItem = {
  name: string;
  price: number;
  /** Original price the dice start from. */
  base?: number;
  /** ARASAAC picture shipped with the app (`/kasse/<id>.webp`). */
  picto?: string;
  /** Own picture on the school server. */
  image?: string;
  g: Gender;
  /** What the customer says for one (“Tasse Kaffee”) … */
  sg?: string;
  /** … and for several (“Tassen Kaffee”). */
  pl?: string;
};

export type ShopConfig = {
  basket: string;
  sign: string;
  level: PriceLevel;
  items: ShopItem[];
  customers: number;
  kinds: number;
  qty: boolean;
  pics: boolean;
  give: boolean;
  read: boolean;
  /** Pictures of the coins and notes (m + value in cent → picture). */
  money: Record<string, string>;
};

export const COINS = [1, 2, 5, 10, 20, 50, 100, 200];
export const NOTES = [500, 1000, 2000, 5000, 10000, 20000];
export const MAX_ITEMS = 12;

export const LEVELS: { value: PriceLevel; label: string; hint: string }[] = [
  { value: 'cent', label: 'Nur Cent', hint: 'Alles unter 1 € (35 ct) – ein Einkauf kostet höchstens 1 €.' },
  { value: 'euro', label: 'Ganze Euro', hint: 'Preise von 1 € bis 9 €, ohne Cent.' },
  { value: 'round', label: 'Glatte Preise', hint: 'Euro und 10-Cent-Schritte (1,50 €, 2,20 €).' },
  { value: 'mixed', label: 'Euro und Cent', hint: 'Ladenpreise wie 1,49 € oder 2,85 €.' },
  { value: 'bills', label: 'Nur Scheine', hint: 'Preise in 5-Euro-Schritten (5 €, 15 €, 40 €) – bezahlt wird mit Scheinen.' },
  { value: 'high', label: 'Hohe Summen', hint: 'Teure Dinge von 20 € bis 500 € (129,99 €).' },
];

type BasketItem = { name: string; price: number; arasaac: number; g: Gender; sg?: string; pl?: string };
export type Basket = { id: string; label: string; sign: string; items: BasketItem[] };

export const BASKETS: Basket[] = [
  { id: 'bakery', label: 'Bäckerei', sign: 'BÄCKEREI', items: [
    { name: 'Breze', price: 85, arasaac: 39058, g: 'f', pl: 'Brezen' }, { name: 'Semmel', price: 45, arasaac: 36501, g: 'f', pl: 'Semmeln' },
    { name: 'Brot', price: 349, arasaac: 2494, g: 'n', pl: 'Brote' }, { name: 'Kuchen', price: 279, arasaac: 2502, g: 'n', sg: 'Stück Kuchen', pl: 'Stück Kuchen' },
    { name: 'Muffin', price: 189, arasaac: 27903, g: 'm', pl: 'Muffins' }, { name: 'Donut', price: 149, arasaac: 2368, g: 'm', pl: 'Donuts' },
    { name: 'Kaffee', price: 249, arasaac: 2296, g: 'f', sg: 'Tasse Kaffee', pl: 'Tassen Kaffee' }, { name: 'Kakao', price: 229, arasaac: 6448, g: 'f', sg: 'Tasse Kakao', pl: 'Tassen Kakao' },
  ] },
  { id: 'school', label: 'Pausenverkauf', sign: 'PAUSENVERKAUF', items: [
    { name: 'Limonade', price: 200, arasaac: 6569, g: 'f', pl: 'Limonaden' }, { name: 'Kaffee', price: 250, arasaac: 2296, g: 'f', sg: 'Tasse Kaffee', pl: 'Tassen Kaffee' },
    { name: 'Kuchen', price: 300, arasaac: 2502, g: 'n', sg: 'Stück Kuchen', pl: 'Stück Kuchen' }, { name: 'Brot', price: 250, arasaac: 2494, g: 'n', pl: 'Brote' },
    { name: 'Wasser', price: 110, arasaac: 38420, g: 'f', sg: 'Flasche Wasser', pl: 'Flaschen Wasser' }, { name: 'Schoko-Muffin', price: 190, arasaac: 27903, g: 'm', pl: 'Schoko-Muffins' },
    { name: 'Joghurt', price: 70, arasaac: 2618, g: 'm', pl: 'Joghurts' }, { name: 'Breze', price: 80, arasaac: 39058, g: 'f', pl: 'Brezen' },
    { name: 'Apfel', price: 50, arasaac: 2462, g: 'm', pl: 'Äpfel' },
  ] },
  { id: 'kiosk', label: 'Kiosk', sign: 'KIOSK', items: [
    { name: 'Lolli', price: 50, arasaac: 2832, g: 'm', pl: 'Lollis' }, { name: 'Kaugummi', price: 80, arasaac: 8724, g: 'm', sg: 'Packung Kaugummi', pl: 'Packungen Kaugummi' },
    { name: 'Schokolade', price: 99, arasaac: 25940, g: 'f', sg: 'Tafel Schokolade', pl: 'Tafeln Schokolade' }, { name: 'Breze', price: 85, arasaac: 39058, g: 'f', pl: 'Brezen' },
    { name: 'Sandwich', price: 299, arasaac: 3383, g: 'n', pl: 'Sandwiches' }, { name: 'Wasser', price: 99, arasaac: 38420, g: 'f', sg: 'Flasche Wasser', pl: 'Flaschen Wasser' },
    { name: 'Limonade', price: 149, arasaac: 6569, g: 'f', pl: 'Limonaden' }, { name: 'Apfel', price: 50, arasaac: 2462, g: 'm', pl: 'Äpfel' },
    { name: 'Banane', price: 35, arasaac: 2530, g: 'f', pl: 'Bananen' }, { name: 'Eis am Stiel', price: 150, arasaac: 3348, g: 'n', pl: 'Eis am Stiel' },
  ] },
  { id: 'market', label: 'Obst und Gemüse', sign: 'OBST & GEMÜSE', items: [
    { name: 'Apfel', price: 45, arasaac: 2462, g: 'm', pl: 'Äpfel' }, { name: 'Banane', price: 35, arasaac: 2530, g: 'f', pl: 'Bananen' },
    { name: 'Birne', price: 55, arasaac: 2561, g: 'f', pl: 'Birnen' }, { name: 'Orange', price: 60, arasaac: 2483, g: 'f', pl: 'Orangen' },
    { name: 'Zitrone', price: 39, arasaac: 3022, g: 'f', pl: 'Zitronen' }, { name: 'Ananas', price: 199, arasaac: 2525, g: 'f', pl: 'Ananas' },
    { name: 'Erdbeeren', price: 299, arasaac: 2400, g: 'f', sg: 'Schale Erdbeeren', pl: 'Schalen Erdbeeren' }, { name: 'Trauben', price: 249, arasaac: 3247, g: 'f', sg: 'Schale Trauben', pl: 'Schalen Trauben' },
    { name: 'Tomate', price: 40, arasaac: 2594, g: 'f', pl: 'Tomaten' }, { name: 'Gurke', price: 69, arasaac: 2847, g: 'f', pl: 'Gurken' },
    { name: 'Karotte', price: 25, arasaac: 2619, g: 'f', pl: 'Karotten' }, { name: 'Paprika', price: 89, arasaac: 2839, g: 'f', pl: 'Paprika' },
  ] },
  { id: 'super', label: 'Supermarkt', sign: 'SUPERMARKT', items: [
    { name: 'Milch', price: 109, arasaac: 2445, g: 'f', sg: 'Packung Milch', pl: 'Packungen Milch' }, { name: 'Butter', price: 199, arasaac: 2461, g: 'n', sg: 'Stück Butter', pl: 'Stück Butter' },
    { name: 'Käse', price: 249, arasaac: 2541, g: 'n', sg: 'Stück Käse', pl: 'Stück Käse' }, { name: 'Nudeln', price: 129, arasaac: 8652, g: 'f', sg: 'Packung Nudeln', pl: 'Packungen Nudeln' },
    { name: 'Eier', price: 229, arasaac: 34039, g: 'f', sg: 'Packung Eier', pl: 'Packungen Eier' }, { name: 'Schokolade', price: 99, arasaac: 25940, g: 'f', sg: 'Tafel Schokolade', pl: 'Tafeln Schokolade' },
    { name: 'Saft', price: 149, arasaac: 11461, g: 'f', sg: 'Flasche Saft', pl: 'Flaschen Saft' }, { name: 'Joghurt', price: 59, arasaac: 2618, g: 'm', pl: 'Joghurts' },
    { name: 'Reis', price: 149, arasaac: 25556, g: 'f', sg: 'Packung Reis', pl: 'Packungen Reis' }, { name: 'Brot', price: 279, arasaac: 2494, g: 'n', pl: 'Brote' },
    { name: 'Wasser', price: 49, arasaac: 38420, g: 'f', sg: 'Flasche Wasser', pl: 'Flaschen Wasser' }, { name: 'Banane', price: 29, arasaac: 2530, g: 'f', pl: 'Bananen' },
  ] },
  { id: 'paper', label: 'Schreibwaren', sign: 'SCHREIBWAREN', items: [
    { name: 'Bleistift', price: 59, arasaac: 2440, g: 'm', pl: 'Bleistifte' }, { name: 'Radiergummi', price: 89, arasaac: 2409, g: 'm', pl: 'Radiergummis' },
    { name: 'Spitzer', price: 149, arasaac: 2553, g: 'm', pl: 'Spitzer' }, { name: 'Heft', price: 69, arasaac: 2359, g: 'n', pl: 'Hefte' },
    { name: 'Block', price: 199, arasaac: 27604, g: 'm', pl: 'Blöcke' }, { name: 'Lineal', price: 129, arasaac: 2815, g: 'n', pl: 'Lineale' },
    { name: 'Klebestift', price: 189, arasaac: 2510, g: 'm', pl: 'Klebestifte' }, { name: 'Schere', price: 349, arasaac: 2591, g: 'f', pl: 'Scheren' },
    { name: 'Buntstifte', price: 499, arasaac: 17016, g: 'f', sg: 'Packung Buntstifte', pl: 'Packungen Buntstifte' }, { name: 'Füller', price: 1299, arasaac: 10313, g: 'm', pl: 'Füller' },
    { name: 'Ordner', price: 299, arasaac: 10255, g: 'm', pl: 'Ordner' }, { name: 'Malkasten', price: 899, arasaac: 6881, g: 'm', pl: 'Malkästen' },
  ] },
  { id: 'toys', label: 'Spielwaren', sign: 'SPIELWAREN', items: [
    { name: 'Fußball', price: 1499, arasaac: 2269, g: 'm', pl: 'Fußbälle' }, { name: 'Puppe', price: 1999, arasaac: 26238, g: 'f', pl: 'Puppen' },
    { name: 'Spielzeugauto', price: 599, arasaac: 2340, g: 'n', pl: 'Spielzeugautos' }, { name: 'Puzzle', price: 1299, arasaac: 2540, g: 'n', pl: 'Puzzles' },
    { name: 'Teddybär', price: 1799, arasaac: 4945, g: 'm', pl: 'Teddybären' }, { name: 'Bauklötze', price: 2499, arasaac: 4930, g: 'f', sg: 'Kiste Bauklötze', pl: 'Kisten Bauklötze' },
    { name: 'Kreisel', price: 399, arasaac: 8663, g: 'm', pl: 'Kreisel' }, { name: 'Springseil', price: 499, arasaac: 3427, g: 'n', pl: 'Springseile' },
    { name: 'Brettspiel', price: 2999, arasaac: 32580, g: 'n', pl: 'Brettspiele' }, { name: 'Seifenblasen', price: 199, arasaac: 6945, g: 'f', sg: 'Dose Seifenblasen', pl: 'Dosen Seifenblasen' },
    { name: 'Drachen', price: 1499, arasaac: 2350, g: 'm', pl: 'Drachen' }, { name: 'Roller', price: 6999, arasaac: 2508, g: 'm', pl: 'Roller' },
  ] },
  { id: 'clothes', label: 'Kleidung', sign: 'MODE', items: [
    { name: 'T-Shirt', price: 1299, arasaac: 2309, g: 'n', pl: 'T-Shirts' }, { name: 'Hose', price: 2999, arasaac: 2565, g: 'f', pl: 'Hosen' },
    { name: 'Pullover', price: 3499, arasaac: 2436, g: 'm', pl: 'Pullover' }, { name: 'Schuhe', price: 4999, arasaac: 2622, g: 'n', sg: 'Paar Schuhe', pl: 'Paar Schuhe' },
    { name: 'Mütze', price: 1499, arasaac: 2412, g: 'f', pl: 'Mützen' }, { name: 'Schal', price: 1999, arasaac: 2290, g: 'm', pl: 'Schals' },
    { name: 'Jacke', price: 6999, arasaac: 2319, g: 'f', pl: 'Jacken' }, { name: 'Socken', price: 499, arasaac: 2298, g: 'n', sg: 'Paar Socken', pl: 'Paar Socken' },
    { name: 'Kleid', price: 3999, arasaac: 2613, g: 'n', pl: 'Kleider' }, { name: 'Handschuhe', price: 1299, arasaac: 2415, g: 'n', sg: 'Paar Handschuhe', pl: 'Paar Handschuhe' },
  ] },
  { id: 'tech', label: 'Elektromarkt', sign: 'ELEKTROMARKT', items: [
    { name: 'Handy', price: 19900, arasaac: 25269, g: 'n', pl: 'Handys' }, { name: 'Kopfhörer', price: 4999, arasaac: 11208, g: 'm', pl: 'Kopfhörer' },
    { name: 'Tablet', price: 29900, arasaac: 28099, g: 'n', pl: 'Tablets' }, { name: 'Fernseher', price: 49900, arasaac: 25498, g: 'm', pl: 'Fernseher' },
    { name: 'Laptop', price: 59900, arasaac: 7214, g: 'm', pl: 'Laptops' }, { name: 'Kamera', price: 24900, arasaac: 24925, g: 'f', pl: 'Kameras' },
    { name: 'Lautsprecher', price: 7999, arasaac: 37438, g: 'm', pl: 'Lautsprecher' }, { name: 'Spielkonsole', price: 29999, arasaac: 2354, g: 'f', pl: 'Spielkonsolen' },
    { name: 'Radio', price: 3999, arasaac: 11354, g: 'n', pl: 'Radios' }, { name: 'Taschenlampe', price: 1499, arasaac: 6138, g: 'f', pl: 'Taschenlampen' },
    { name: 'Batterien', price: 599, arasaac: 8320, g: 'f', sg: 'Packung Batterien', pl: 'Packungen Batterien' }, { name: 'Armbanduhr', price: 8999, arasaac: 2549, g: 'f', pl: 'Armbanduhren' },
  ] },
];

/** Pictures of the app, of the school server, or embedded in an exported book. */
const SAFE_PICTURE = /^(\/kasse\/[a-z0-9-]+\.webp|\/api\/medien\/[a-f0-9]{64}\.[a-z0-9]+|media\/[\w.-]+|data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+)$/;
export const safePicture = (v: unknown): v is string => typeof v === 'string' && SAFE_PICTURE.test(v);
export const pictoPath = (id: number) => `/kasse/${id}.webp`;
export const moneyPicture = (value: number) => `/kasse/geld-${value}.webp`;
/** Settings keys start with a letter: m1 … m20000. */
export const moneyKey = (value: number) => `m${value}`;
export const itemPicture = (item: ShopItem) => (safePicture(item.image) ? item.image : safePicture(item.picto) ? item.picto : undefined);

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const pick = <T extends string>(v: unknown, values: readonly T[], fallback: T): T => (values.includes(v as T) ? (v as T) : fallback);
const whole = (v: unknown, min: number, max: number, fallback: number) => Math.max(min, Math.min(max, Math.round(Number(v)) || fallback));

/** Reads saved settings; anything broken falls back like the reference. */
export function shopConfig(raw: unknown): ShopConfig {
  const v = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const items: ShopItem[] = [];
  for (const entry of Array.isArray(v.items) ? v.items : []) {
    if (items.length >= MAX_ITEMS) break;
    const e = (entry && typeof entry === 'object' ? entry : {}) as Record<string, unknown>;
    const name = text(e.name, 30);
    if (!name) continue;
    const item: ShopItem = { name, price: whole(e.price, 1, 1e7, 100), g: pick(e.g, ['m', 'f', 'n'] as const, 'n') };
    if (Number(e.base) > 0) item.base = whole(e.base, 1, 1e7, item.price);
    if (safePicture(e.picto)) item.picto = e.picto;
    if (safePicture(e.image)) item.image = e.image;
    const sg = text(e.sg, 40), pl = text(e.pl, 40);
    if (sg) item.sg = sg;
    if (pl) item.pl = pl;
    items.push(item);
  }
  const savedMoney = (v.money && typeof v.money === 'object' ? v.money : {}) as Record<string, unknown>;
  const money: Record<string, string> = {};
  for (const value of [...COINS, ...NOTES]) {
    const saved = savedMoney[moneyKey(value)];
    money[moneyKey(value)] = safePicture(saved) ? saved : moneyPicture(value);
  }
  return {
    basket: text(v.basket, 20),
    sign: text(v.sign, 24) || 'LADEN',
    level: pick(v.level, LEVELS.map((l) => l.value), 'mixed'),
    items: items.length ? items : [{ name: 'Apfel', price: 50, g: 'm', pl: 'Äpfel' }],
    customers: whole(v.customers, 1, 10, 5),
    kinds: whole(v.kinds, 1, 5, 2),
    qty: v.qty !== false,
    pics: v.pics !== false,
    give: v.give === true,
    read: v.read === true,
    money,
  };
}

/** New prices for the level; the order of the original prices is kept. */
export function rollPrices(items: ShopItem[], level: PriceLevel, rnd = Math.random): number[] {
  const n = items.length, base = items.map((i) => i.base ?? i.price);
  if (level === 'mixed')
    return base.map((p) => {
      const r = Math.round((p * (0.9 + rnd() * 0.2)) / 10) * 10;
      return Math.max(5, rnd() < 0.6 ? r - 1 : r);
    });
  const range = (from: number, to: number, step: number) => {
    const all: number[] = [];
    for (let p = from; p <= to; p += step) all.push(p);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    const chosen = all.slice(0, n);
    while (chosen.length < n) chosen.push(all[chosen.length % all.length]);
    return chosen.sort((a, b) => a - b);
  };
  const prices =
    level === 'cent' ? range(10, 95, 5)
    : level === 'euro' ? range(100, 900, 100)
    : level === 'round' ? range(50, 990, 10)
    : level === 'bills' ? range(500, 10000, 500)
    : range(20, 500, 1).map((e) => e * 100 - (rnd() < 0.5 ? 1 : rnd() < 0.5 ? 50 : 0));
  const result: number[] = Array(n);
  base.map((p, i) => [p, i] as const).sort((a, b) => a[0] - b[0]).forEach(([, i], k) => (result[i] = prices[k]));
  return result;
}

/** The goods of a basket with fresh prices for the level. */
export function basketItems(basket: Basket, level: PriceLevel, rnd = Math.random): ShopItem[] {
  const items: ShopItem[] = basket.items.map((i) => ({
    name: i.name, price: i.price, base: i.price, picto: pictoPath(i.arasaac), g: i.g,
    ...(i.sg ? { sg: i.sg } : {}), ...(i.pl ? { pl: i.pl } : {}),
  }));
  const prices = rollPrices(items, level, rnd);
  items.forEach((item, i) => (item.price = prices[i]));
  return items;
}

/** The start of the dialog: bakery, “Euro und Cent”, 5 customers. */
export function defaultShop(rnd = Math.random): ShopConfig {
  const b = BASKETS[0];
  return shopConfig({ basket: b.id, sign: b.sign, level: 'mixed', items: basketItems(b, 'mixed', rnd), customers: 5, kinds: 2, qty: true, pics: true, give: false, read: true });
}

/** Price as written on the shelf and the receipt. */
export function priceText(cents: number, level: PriceLevel) {
  if (level === 'cent' && cents < 100) return `${cents} ct`;
  if ((level === 'euro' || level === 'bills') && cents % 100 === 0) return `${cents / 100} €`;
  return `${Math.floor(cents / 100)},${String(cents % 100).padStart(2, '0')} €`;
}
/** Price as spoken: “2 Euro 49”. */
export function spokenPrice(cents: number) {
  const e = Math.floor(cents / 100), c = cents % 100;
  return e ? (c ? `${e} Euro ${c}` : `${e} Euro`) : `${c} Cent`;
}
export const moneyName = (v: number) => (v < 100 ? `${v} Cent` : v < 500 ? `${v / 100} Euro` : `${v / 100}-Euro-Schein`);

const NUMBERS = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs'];
const ARTICLE: Record<Gender, string> = { m: 'einen', f: 'eine', n: 'ein' };
const one = (i: ShopItem) => i.sg || i.name;
export const many = (i: ShopItem) => i.pl || i.sg || i.name;
const written = (i: ShopItem, n: number) => `${n} ${n === 1 ? one(i) : many(i)}`;
const said = (i: ShopItem, n: number) => (n === 1 ? `${ARTICLE[i.g]} ${one(i)}` : `${NUMBERS[n] ?? n} ${many(i)}`);
const list = (parts: string[]) => (parts.length < 2 ? parts.join('') : `${parts.slice(0, -1).join(', ')} und ${parts[parts.length - 1]}`);

export type Line = { i: number; n: number };
export const total = (c: ShopConfig, lines: Line[]) => lines.reduce((s, l) => s + (c.items[l.i]?.price ?? 0) * l.n, 0);
export const sum = (coins: number[]) => coins.reduce((a, b) => a + b, 0);

/** What one customer wants; with “Nur Cent” it costs at most 1 € if possible. */
export function makeOrder(c: ShopConfig, rnd = Math.random): Line[] {
  const count = c.items.length, kinds = Math.min(count, c.kinds);
  const roll = () => {
    const lo = Math.max(1, Math.ceil(kinds / 2));
    const k = lo + Math.floor(rnd() * (kinds - lo + 1));
    const chosen = [...Array(count).keys()].map((i) => [rnd(), i] as const).sort((a, b) => a[0] - b[0]).slice(0, k).map(([, i]) => i);
    const most = c.qty ? (c.level === 'bills' || c.level === 'high' ? 2 : 3) : 1;
    return chosen.map((i) => {
      const r = rnd();
      return { i, n: Math.min(most, r < 0.55 ? 1 : r < 0.85 ? 2 : 3) };
    });
  };
  if (c.level !== 'cent') return roll();
  let best = roll();
  for (let t = 0; t < 60 && total(c, best) > 100; t++) {
    const next = roll();
    if (total(c, next) < total(c, best)) best = next;
  }
  return best;
}

/** What the customer pays with: mostly a bigger coin or note, sometimes exact. */
export function payment(cost: number, level: PriceLevel, rnd = Math.random) {
  if (rnd() < 0.12) return cost;
  const steps: Record<PriceLevel, number[]> = {
    cent: [50, 100, 200], euro: [500, 1000, 2000, 5000], round: [100, 500, 1000, 2000],
    mixed: [100, 500, 1000, 2000, 5000, 10000], bills: [1000, 2000, 5000, 10000, 20000], high: [5000, 10000, 20000, 50000, 100000],
  };
  const options: number[] = [];
  for (const s of steps[level]) {
    const up = Math.ceil(cost / s) * s;
    if (up > cost && !options.includes(up)) options.push(up);
  }
  options.sort((a, b) => a - b);
  const r = rnd();
  return options[r < 0.35 || options.length < 2 ? 0 : r < 0.8 || options.length < 3 ? 1 : 2] ?? cost;
}

/** Change with as few coins and notes as possible. */
export function changeCoins(amount: number) {
  const out: number[] = [];
  for (const v of [...NOTES, ...COINS].sort((a, b) => b - a))
    while (amount >= v) {
      out.push(v);
      amount -= v;
    }
  return out;
}
/** Tapping a coin or note in the till's change splits it (2 € → 1 € + 1 €). */
export const SPLIT: Record<number, number[]> = {
  20000: [10000, 10000], 10000: [5000, 5000], 5000: [2000, 2000, 1000], 2000: [1000, 1000], 1000: [500, 500],
  500: [200, 200, 100], 200: [100, 100], 100: [50, 50], 50: [20, 20, 10], 20: [10, 10], 10: [5, 5], 5: [2, 2, 1], 2: [1, 1],
};

export type Talk = { text: string; said: string; order?: Line[] };
export type Mood = 'happy' | 'sad';
export type Phase = 'idle' | 'enter' | 'order' | 'busy' | 'pay' | 'change' | 'leave' | 'done';
export type CustomerResult = { cust: number; start: number; end: number; errSum: number; errPay: number; errChg: number; fixes: number };
export type ShopState = {
  phase: Phase;
  round: number;
  custs: number[];
  order: Line[];
  paid: number;
  cart: Line[];
  sumShown: boolean;
  payIn: number[];
  chgIn: number[];
  chgShown: boolean;
  talk: Talk | null;
  mood: Mood;
  inside: boolean;
  res: CustomerResult[];
};

export const freshShop = (): ShopState => ({
  phase: 'idle', round: 0, custs: [], order: [], paid: 0, cart: [], sumShown: false, payIn: [], chgIn: [], chgShown: false, talk: null, mood: 'happy', inside: false, res: [],
});

/** Customers in a shuffled order, never the same one twice in a row. */
export function customerOrder(count: number, kinds: number, rnd = Math.random) {
  const out: number[] = [];
  while (out.length < count) {
    const next = [...Array(kinds).keys()].map((i) => [rnd(), i] as const).sort((a, b) => a[0] - b[0]).map(([, i]) => i);
    if (out.length && next[0] === out[out.length - 1]) next.push(next.shift()!);
    out.push(...next);
  }
  return out.slice(0, count);
}

/** The customer's order in the speech bubble; `again` after a wrong sum. */
export function orderTalk(c: ShopConfig, s: ShopState, greet: string, again: boolean): Talk {
  const w = list(s.order.map((l) => written(c.items[l.i], l.n)));
  const sp = list(s.order.map((l) => said(c.items[l.i], l.n)));
  return again
    ? { text: `Das stimmt aber nicht. Ich möchte: ${w}.`, said: `Das stimmt aber nicht. Ich möchte ${sp}.`, order: s.order }
    : { text: `${greet} Ich möchte hier einkaufen: ${w}.`, said: `${greet} Ich möchte hier einkaufen: ${sp}.`, order: s.order };
}
export function wrongMoneyTalk(c: ShopConfig, s: ShopState): Talk {
  const cost = total(c, s.order);
  return {
    text: `Das ist aber nicht richtig. Es kostet ${priceText(cost, c.level)} und ich habe dir ${priceText(s.paid, c.level)} gegeben.`,
    said: `Das ist aber nicht richtig. Es kostet ${spokenPrice(cost)} und ich habe dir ${spokenPrice(s.paid)} gegeben.`,
  };
}
export function sumTalk(c: ShopConfig, s: ShopState): Talk {
  return s.paid === total(c, s.cart)
    ? { text: `Das ist richtig. Ich habe es passend: ${priceText(s.paid, c.level)}.`, said: `Das ist richtig. Ich habe es passend: ${spokenPrice(s.paid)}.` }
    : { text: `Das ist richtig. Ich zahle mit ${priceText(s.paid, c.level)}.`, said: `Das ist richtig. Ich zahle mit ${spokenPrice(s.paid)}.` };
}
/** The cart holds exactly what the customer ordered. */
export const cartRight = (s: ShopState) =>
  s.cart.length === s.order.length && s.order.every((o) => s.cart.some((c) => c.i === o.i && c.n === o.n));

/** Next customer comes in: new order, money and an empty till. */
export function nextCustomer(c: ShopConfig, s: ShopState, rnd = Math.random): ShopState {
  const order = makeOrder(c, rnd);
  const res = [...s.res];
  res[s.round] = { cust: s.custs[s.round], start: 0, end: 0, errSum: 0, errPay: 0, errChg: 0, fixes: 0 };
  return { ...s, order, paid: payment(total(c, order), c.level, rnd), phase: 'enter', cart: [], sumShown: false, payIn: [], chgIn: [], chgShown: false, talk: null, mood: 'happy', inside: true, res };
}

/** Taps a good on the shelf: one more on the receipt. */
export function addGood(s: ShopState, i: number): ShopState {
  const cart = s.cart.some((l) => l.i === i) ? s.cart.map((l) => (l.i === i ? { ...l, n: l.n + 1 } : l)) : [...s.cart, { i, n: 1 }];
  return { ...s, cart, sumShown: false };
}
/** Taps a receipt row: one less (counts as a correction). */
export function removeGood(s: ShopState, row: number): ShopState {
  const line = s.cart[row];
  if (!line) return s;
  const cart = line.n > 1 ? s.cart.map((l, k) => (k === row ? { ...l, n: l.n - 1 } : l)) : s.cart.filter((_, k) => k !== row);
  return fix({ ...s, cart, sumShown: false });
}
export function fix(s: ShopState, key: keyof Pick<CustomerResult, 'fixes' | 'errSum' | 'errPay' | 'errChg'> = 'fixes'): ShopState {
  const r = s.res[s.round];
  if (!r) return s;
  const res = [...s.res];
  res[s.round] = { ...r, [key]: r[key] + 1 };
  return { ...s, res };
}
/** Takes the last coin of this value out of a list. */
export function without(coins: number[], value: number) {
  const k = coins.lastIndexOf(value);
  return k < 0 ? coins : [...coins.slice(0, k), ...coins.slice(k + 1)];
}

export type Summary = { served: number; time: number; perfect: number; errSum: number; errPay: number; errChg: number; fixes: number };
export function summary(s: ShopState): Summary {
  const done = s.res.filter((r) => r?.end);
  const add = (f: (r: CustomerResult) => number) => done.reduce((a, r) => a + f(r), 0);
  return {
    served: done.length,
    time: add((r) => r.end - r.start),
    perfect: done.filter((r) => !(r.errSum + r.errPay + r.errChg)).length,
    errSum: add((r) => r.errSum), errPay: add((r) => r.errPay), errChg: add((r) => r.errChg), fixes: add((r) => r.fixes),
  };
}
export function duration(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  return s < 60 ? `${s} Sek.` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} Min.`;
}

export function shopLabel(c: ShopConfig) {
  return `Kasse: ${c.customers === 1 ? 'Ein Kunde kauft' : `${c.customers} Kunden kaufen`} ein. Tippe die Waren ein, drücke auf Summe und kassiere das Geld${c.give ? ', dann gib das Rückgeld heraus' : ''}.`;
}

/** Price typed in the dialog: “2,49”, “2.5”, “35 ct”, with “Nur Cent” also “35”. */
export function parsePrice(input: string, level: PriceLevel): number | null {
  const v = input.replace(/\s|€/g, '').replace('.', ',');
  if (/^\d+ct$/i.test(v)) return Number(v.slice(0, -2)) || null;
  if (!/^\d+(,\d{0,2})?$/.test(v)) return null;
  const [e, c = ''] = v.split(',');
  if (level === 'cent' && !v.includes(',') && Number(e) < 100) return Number(e) || null;
  return Number(e) * 100 + Number(c.padEnd(2, '0') || 0) || null;
}
