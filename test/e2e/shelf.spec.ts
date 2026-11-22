import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Regal: Ordner links mit Anzahl, kleine Hefte, Aktionen im Menü, Liste und Sortierung', async ({ page }) => {
  await login(page);
  for (const title of ['Zebra-Heft', 'Apfel-Heft']) await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title } });
  await page.reload();
  const folders = page.getByRole('navigation', { name: 'Ordner' });
  // A new folder is named right in the list, without a browser dialog.
  await folders.getByRole('button', { name: 'Neuer Ordner' }).click();
  await folders.getByLabel('Name des neuen Ordners').fill('Projekt Igel');
  await folders.getByLabel('Name des neuen Ordners').press('Enter');
  const igel = folders.getByRole('button', { name: /^Projekt Igel/ });
  await expect(igel).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('In diesem Ordner liegt noch kein Heft.')).toBeVisible();

  // Put a book into the folder through its menu.
  await folders.getByRole('button', { name: /^Alle Hefte/ }).click();
  await page.getByRole('button', { name: 'Zebra-Heft: mehr' }).click();
  await page.getByRole('group', { name: 'Zebra-Heft: mehr' }).getByRole('button', { name: 'Projekt Igel' }).click();
  await expect(igel).toContainText('1');
  // The open menu lies above the neighbouring cards: its last entry is not covered.
  await page.getByRole('button', { name: 'Zebra-Heft: mehr' }).click();
  const remove = page.getByRole('button', { name: 'Zebra-Heft löschen' });
  const box = (await remove.boundingBox())!;
  expect(await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('button')?.getAttribute('aria-label'), [box.x + box.width / 2, box.y + box.height / 2])).toBe('Zebra-Heft löschen');
  await page.keyboard.press('Escape');
  await igel.click();
  const main = page.getByRole('region', { name: 'Projekt Igel' });
  await expect(main.getByRole('link', { name: 'Zebra-Heft', exact: true })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Apfel-Heft', exact: true })).toHaveCount(0);

  // Rename the folder in place.
  await folders.getByRole('button', { name: 'Ordner Projekt Igel: mehr' }).click();
  await page.getByRole('button', { name: 'Ordner Projekt Igel umbenennen' }).click();
  const rename = folders.getByLabel('Neuer Name für Projekt Igel');
  await rename.fill('Igel');
  await rename.press('Enter');
  await expect(folders.getByRole('button', { name: /^Igel/ })).toBeVisible();

  // A–Z and list view; both are remembered.
  await folders.getByRole('button', { name: /^Alle Hefte/ }).click();
  await page.getByRole('group', { name: 'Sortieren' }).getByRole('button', { name: 'A–Z' }).click();
  const titles = page.locator('.book-caption a');
  await expect.poll(async () => { const all = await titles.allTextContents(); return all.indexOf('Apfel-Heft') < all.indexOf('Zebra-Heft'); }).toBe(true);
  await page.getByRole('group', { name: 'Ansicht' }).getByRole('button', { name: 'Liste' }).click();
  await expect(page.locator('.book-list .book-card').first()).toBeVisible();
  await page.reload();
  await expect(page.locator('.book-list .book-card').first()).toBeVisible();
  await expect(page.getByRole('group', { name: 'Sortieren' }).getByRole('button', { name: 'A–Z' })).toHaveAttribute('aria-pressed', 'true');
});
