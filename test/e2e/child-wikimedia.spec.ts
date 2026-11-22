import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const hex = () => Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');

test('Kinder durchsuchen Wikimedia Commons nur, wenn die Lehrkraft es einschaltet – mit Sperrliste', async ({ page, browser }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Bildersuche' } })).json();
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Commonsklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Ole' });
  const [ole] = klass.children;
  const card = hex();
  await request('change', { id: klass.id, childId: ole.id, digest: card });
  const copies = await request('distribute', { id: klass.id, bookId: created.book.id });
  const book = copies.find((b: { ownerId: string }) => b.ownerId === ole.id).id;

  // Off by default: the switch exists for the class, not pressed.
  await page.goto('/klassen');
  await page.getByRole('navigation', { name: 'Klassen' }).getByRole('button', { name: 'Commonsklasse' }).click();
  const switches = page.getByRole('group', { name: 'Funktionen für die Klasse' });
  const commons = switches.getByRole('button', { name: 'Wikimedia Commons', exact: true });
  await expect(commons).toHaveAttribute('aria-pressed', 'false');

  const context = await browser.newContext();
  const child = await context.newPage();
  await child.goto('/kinder');
  expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest: card } })).ok()).toBeTruthy();
  const search = (q: string) => child.request.get(`/api/bilder?${new URLSearchParams({ quelle: 'wikimedia', q })}`);
  expect((await search('Katze')).status()).toBe(403);
  await child.goto(`/kinder/heft/${book}`);
  await child.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Bild', exact: true }).click();
  let dialog = child.getByRole('dialog', { name: 'Ein Bild einfügen' });
  await expect(dialog.getByRole('navigation', { name: 'Bildquelle' }).getByRole('button', { name: 'Wikimedia Commons' })).toHaveCount(0);

  // Switched on for the class.
  await commons.click();
  await expect(commons).toHaveAttribute('aria-pressed', 'true');
  await child.reload();
  await child.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Bild', exact: true }).click();
  dialog = child.getByRole('dialog', { name: 'Ein Bild einfügen' });
  await dialog.getByRole('navigation', { name: 'Bildquelle' }).getByRole('button', { name: 'Wikimedia Commons' }).click();
  // A blocked word is refused on the server without asking Commons.
  const refused = await search('nackt');
  expect(refused.status()).toBe(200);
  expect(await refused.json()).toMatchObject({ items: [], blocked: true });
  await dialog.getByLabel('Suchbegriff für Wikimedia Commons').fill('nackt');
  await dialog.getByRole('button', { name: 'Suchen' }).click();
  await expect(dialog.getByText('Nach diesem Wort kannst du hier nicht suchen.')).toBeVisible();
  await context.close();
});
