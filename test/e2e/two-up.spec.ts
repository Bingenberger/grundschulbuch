import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const text = (t: string) => ({ id: uuid(), type: 'text', x: 20, y: 20, width: 150, height: 20, rotation: 0, locked: false, color: '#253c42', text: t, font: 'Andika', fontSize: 30 });

test('Querformat: 2 Seiten auf ein Blatt – zwei A5-Seiten untereinander auf A4 hoch, im PDF und in der Druckansicht', async ({ page }) => {
  test.setTimeout(90000);
  await login(page);
  const pages = ['Eins', 'Zwei', 'Drei'].map((t) => ({ ...newPage('blanko', 'landscape'), elements: [text(t)] }));
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Zweiseitig', pages } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('button', { name: 'Speichern', exact: true }).click();
  await page.getByRole('dialog', { name: 'Welche Seiten speichern?' }).getByRole('button', { name: 'Alle 3 Seiten – weiter', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Speichern und teilen' });
  const twoUp = dialog.getByRole('button', { name: /2 Seiten auf ein Blatt/ });
  await twoUp.click();
  await expect(twoUp).toHaveAttribute('aria-pressed', 'true');
  const pending = page.waitForEvent('download');
  await dialog.getByRole('button', { name: /^PDF/ }).click();
  const file = await pending;
  expect(file.suggestedFilename()).toBe('Zweiseitig.A5.pdf');
  const pdf = await PDFDocument.load(await readFile((await file.path())!));
  // 3 pages: one sheet with two, one with the last; each A4 upright.
  expect(pdf.getPageCount()).toBe(2);
  for (const sheet of pdf.getPages()) {
    expect(sheet.getWidth()).toBeCloseTo((210 * 72) / 25.4, 0);
    expect(sheet.getHeight()).toBeCloseTo((297 * 72) / 25.4, 0);
  }

  // Print view: sheets with two halves each, page size A4 upright.
  await page.goto(`/drucken/${created.book.id}?zwei=1`);
  await expect(page.locator('.print-sheet.landscape')).toHaveCount(2);
  await expect(page.locator('.print-sheet').first().locator('.print-half')).toHaveCount(2);
  const pageSize = () => page.evaluate(() => [...document.querySelectorAll('style')].map((s) => s.textContent || '').find((t) => t.includes('@page')) || '');
  await expect.poll(pageSize).toContain('A4 portrait');
  await page.getByLabel(/2 Seiten auf ein Blatt/).uncheck();
  await expect(page.locator('.print-sheet')).toHaveCount(0);
  await expect.poll(pageSize).toContain('A4 landscape');
});
