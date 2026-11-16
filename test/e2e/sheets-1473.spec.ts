import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function openSheet(page: Page, title: string) {
  await page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Neue Seite', exact: true }).click();
  const chooser = page.getByRole('dialog', { name: 'Neue Seite' });
  await chooser.getByRole('navigation', { name: 'Kategorien' }).getByRole('button', { name: /^Einstellbar · / }).click();
  await chooser.getByRole('button', { name: `Vorlage ${title}`, exact: true }).click();
  return page.getByRole('dialog', { name: title });
}

test('Einstellbare Arbeitsblätter aus Lernsachen-Heft 1.47.3', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Arbeitsblätter', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  for (const title of ['Rechnen im Alltag: Lohn, Fahrplan, Geld', 'Karopapier: Symmetrie, Muster, Messen', 'Programmieren: Arbeitsblatt', 'Laute hören', 'Etiketten']) {
    const dialog = await openSheet(page, title);
    await expect(dialog.locator('.paper').first()).toBeVisible();
    if (title === 'Etiketten') {
      await dialog.getByLabel('Wörter', { exact: true }).fill('Hund\nKatze\nMaus');
      await dialog.getByText('Bilder suchen (ARASAAC)').click();
      await dialog.getByText('Vorlesen beim Antippen').click();
    }
    if (title === 'Laute hören') await dialog.getByRole('radiogroup', { name: 'Laut' }).getByRole('radio').nth(2).click();
    await page.screenshot({ path: test.info().outputPath(`${title.split(':')[0].replace(/\W+/g, '-')}.png`) });
    const before = await page.locator('.page-thumbnail').count();
    await dialog.getByRole('button', { name: /einfügen/ }).click();
    await expect(dialog).toHaveCount(0, { timeout: 20000 });
    await expect.poll(() => page.locator('.page-thumbnail').count()).toBeGreaterThan(before);
  }
  // The Etiketten with “Vorlesen beim Antippen” are Sprechtasten.
  await expect(page.locator('.interaction-surface .talk-key')).toHaveCount(3);
  expect(errors).toEqual([]);
});
