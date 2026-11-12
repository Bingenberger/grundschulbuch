import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function openBlock(page: Page, title: string) {
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title, pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Deutsch · / }).click();
  await dialog.getByRole('button', { name: title, exact: true }).click();
  return dialog;
}

test('Monsternamen lesen wie in der Vorlage: Silben hören, Gelesen!, Urkunde', async ({ page }) => {
  await login(page);
  const dialog = await openBlock(page, 'Monsternamen lesen');
  await expect(dialog.getByRole('button', { name: 'Fantasienamen lesen', exact: true })).toHaveCount(0);
  await expect(dialog.getByText('Diese Buchstaben kennen die Kinder schon')).toBeVisible();
  await expect(dialog.getByLabel('Gelernte Buchstaben')).toHaveValue('m a l o i s e r n u');
  await dialog.getByRole('group', { name: 'Wie viele Monster?' }).getByRole('button', { name: '2 Monster' }).click();
  await expect(dialog.locator('.monster-listen')).toHaveCount(2);
  await page.screenshot({ path: test.info().outputPath('monster-dialog.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const widget = page.locator('.interaction-surface .lh-wg-monster.is-live');
  await expect(widget.getByText('1 / 2')).toBeVisible();
  await widget.locator('[data-a="s1"]').click();
  await widget.locator('[data-a="word"]').click();
  await page.screenshot({ path: test.info().outputPath('monster-seite.png') });
  await widget.locator('[data-a="read"]').click();
  await expect(widget.getByText('2 / 2')).toBeVisible();
  await widget.locator('[data-a="read"]').click();
  await expect(widget.getByText('Urkunde')).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('monster-urkunde.png') });
  await widget.locator('[data-a="again"]').click();
  await expect(widget.getByText('1 / 2')).toBeVisible();
  // Saved with its names: still the same after reloading.
  await page.reload();
  await expect(page.locator('.interaction-surface .lh-wg-monster').getByText('1 / 2')).toBeVisible();
});
