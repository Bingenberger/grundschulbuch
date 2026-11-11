import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Text wird direkt im Textfeld geschrieben, mit Cursor und passend zur Lineatur', async ({ page }) => {
  await login(page);
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Schreibprobe',
    pages: [newPage('linie1')] } });
  expect(response.ok()).toBeTruthy(); const created = await response.json();
  await page.goto(`/heft/${created.book.id}`);
  const surface = page.locator('.interaction-surface');
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Text', exact: true }).click();

  // Writing happens on the page only; the bottom bar has no second text field.
  const field = surface.getByRole('textbox', { name: 'Text' });
  await expect(field).toBeFocused();
  await expect(page.getByRole('textbox', { name: 'Text' })).toHaveCount(1);
  await page.keyboard.type('Ada');
  await expect(surface.locator('.text-caret')).toBeVisible();
  await page.keyboard.press('Enter');
  await page.keyboard.type('Bob');
  await expect(field).toHaveValue('Ada\nBob');

  // Two lines take exactly two rows of Lineatur 1 (2 cm each).
  const box = surface.locator('.page-element.text-editing');
  expect(await box.evaluate((el) => el.style.height)).toBe('40mm');
  const metrics = await box.evaluate((el) => ({ top: parseFloat(el.style.top), line: getComputedStyle(el.querySelector('textarea')!).lineHeight }));
  expect(Math.abs(parseFloat(metrics.line) - (20 * 96) / 25.4)).toBeLessThan(0.5);
  expect(metrics.top).toBeGreaterThan(15);

  // Font settings live in “Gestalten”; line spacing follows the ruling.
  const bar = page.getByRole('region', { name: 'Element einstellen' });
  await expect(bar.getByRole('group', { name: 'Schrift', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zeilenabstand erhöhen' })).toHaveCount(0);

  await page.keyboard.press('Escape');
  await expect(field).toHaveCount(0);
  await expect(surface.getByText('Ada', { exact: false })).toBeVisible();

  // Tapping the selected text again continues writing; an emptied box disappears.
  await surface.locator('.move-area').click();
  await expect(surface.getByRole('textbox', { name: 'Text' })).toBeFocused();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  await page.keyboard.press('Escape');
  await expect(surface.locator('.page-element')).toHaveCount(0);
});
