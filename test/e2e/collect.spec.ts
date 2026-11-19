import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
test('Die Lehrkraft sammelt ein ausgeteiltes Heft ein, gibt es zurück und legt ein Sammelheft an', async ({ page, browser }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Einsammelprobe' } })).json();
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Sammelklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Lea' });
  klass = await request('change', { id: klass.id, addChild: 'Tom' });
  const [lea] = klass.children;
  const card = '3'.repeat(64);
  await request('change', { id: klass.id, childId: lea.id, digest: card });
  const copies = await request('distribute', { id: klass.id, bookId: created.book.id });
  const leaBook = copies.find((b: { ownerId: string }) => b.ownerId === lea.id).id;

  await page.goto('/klassen');
  await page.getByRole('navigation', { name: 'Klassen' }).getByRole('button', { name: 'Sammelklasse' }).click();
  const entry = page.locator('.distribution').filter({ hasText: 'Einsammelprobe' });
  await expect(entry).toContainText('an 2 Kinder');
  await expect(entry).toContainText('noch bei den Kindern');
  page.once('dialog', (d) => void d.accept());
  await entry.getByRole('button', { name: 'Einsammeln' }).click();
  await expect(entry).toContainText('alle eingesammelt');

  const context = await browser.newContext();
  const child = await context.newPage();
  await child.goto('/kinder');
  expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest: card } })).ok()).toBeTruthy();
  await child.goto('/kinder');
  const cover = child.locator('.child-book').filter({ hasText: 'Einsammelprobe' });
  await expect(cover).toContainText('Eingesammelt – nur ansehen');
  await expect(cover.getByRole('button', { name: 'In den Papierkorb' })).toHaveCount(0);
  await child.goto(`/kinder/heft/${leaBook}`);
  await expect(child.getByRole('dialog', { name: 'Lesemodus' })).toBeVisible();
  await expect(child.getByRole('note')).toContainText('eingesammelt');
  await expect(child.getByRole('navigation', { name: 'Werkzeuge' })).toHaveCount(0);

  // Give it back to Lea only.
  await entry.getByRole('button', { name: 'Kinder anzeigen' }).click();
  const leaRow = entry.locator('.distribution-copies li').filter({ hasText: 'Lea' });
  await leaRow.getByRole('button', { name: 'Zurückgeben' }).click();
  await expect(leaRow).toContainText('Beim Kind');
  await expect(entry).toContainText('1 eingesammelt');
  await child.goto(`/kinder/heft/${leaBook}`);
  await expect(child.getByRole('navigation', { name: 'Werkzeuge' })).toBeVisible();
  await context.close();

  await entry.getByRole('button', { name: 'Sammelheft anlegen' }).click();
  const link = page.getByRole('link', { name: 'Jetzt öffnen' });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/heft\//);
  await expect(page.getByText('Lea', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('1 / 4')).toBeVisible();
});
