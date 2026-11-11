import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const labelled = (text: string) => ({ ...newPage(), elements: [{ id: uuid(), type: 'text', x: 20, y: 20, width: 100, height: 20, rotation: 0,
  locked: false, color: '#253c42', text, font: 'Andika', fontSize: 18 }] });

test('Seiten lassen sich an der Miniatur löschen und wiederherstellen, ohne dass die Übersicht zittert', async ({ page }) => {
  await login(page);
  const pages = Array.from({ length: 6 }, (_, i) => labelled(`Inhalt ${i + 1}`));
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Löschprobe', pages } });
  const created = await response.json();
  await page.goto(`/heft/${created.book.id}`);
  const panel = page.getByRole('complementary', { name: 'Seitenübersicht' });
  await expect(panel.getByRole('button', { name: /^Seite \d+ öffnen$/ })).toHaveCount(6);

  await panel.getByRole('button', { name: 'Seite 2 öffnen' }).hover();
  await panel.getByRole('button', { name: 'Seite 2 löschen' }).click();
  await expect(panel.getByRole('button', { name: /^Seite \d+ öffnen$/ })).toHaveCount(5);
  await expect(page.locator('.interaction-surface').getByText('Inhalt 2')).toHaveCount(0);
  const notice = page.getByRole('status').filter({ hasText: 'Seite 2 gelöscht' });
  await expect(notice).toBeVisible();

  // The thumbnails keep their size instead of jumping back and forth.
  const sizes = await panel.locator('.page-thumbnail .scaled-page > div').first().evaluate(async (el) => {
    const seen = new Set<number>();
    for (let i = 0; i < 30; i++) {
      seen.add(Math.round(el.getBoundingClientRect().width * 10));
      await new Promise((r) => requestAnimationFrame(r));
    }
    return seen.size;
  });
  expect(sizes).toBe(1);

  await notice.getByRole('button', { name: 'Rückgängig' }).click();
  await expect(panel.getByRole('button', { name: /^Seite \d+ öffnen$/ })).toHaveCount(6);
  await expect(page.locator('.interaction-surface').getByText('Inhalt 2')).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Seite 2 öffnen' })).toHaveAttribute('aria-current', 'page');

  // Deleting the first page and restoring it puts it back in front.
  await panel.getByRole('button', { name: 'Seite 1 öffnen' }).hover();
  await panel.getByRole('button', { name: 'Seite 1 löschen' }).click();
  await expect(panel.getByRole('button', { name: /^Seite \d+ öffnen$/ })).toHaveCount(5);
  await page.getByRole('status').filter({ hasText: 'Seite 1 gelöscht' }).getByRole('button', { name: 'Rückgängig' }).click();
  await expect(panel.getByRole('button', { name: 'Seite 1 öffnen' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.interaction-surface').getByText('Inhalt 1')).toBeVisible();
  await page.reload();
  await expect(panel.getByRole('button', { name: /^Seite \d+ öffnen$/ })).toHaveCount(6);
});
