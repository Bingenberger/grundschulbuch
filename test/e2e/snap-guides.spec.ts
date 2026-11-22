import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const base = { rotation: 0, locked: false, color: '#253c42' };
const shape = (id: string, x: number, y: number) =>
  ({ id, type: 'shape', shape: 'rect', x, y, width: 40, height: 30, fill: '#bbdefb', strokeWidth: 0.4, ...base });

test('Beim Verschieben und Größe-Ändern rasten Elemente mit roten Hilfslinien ein', async ({ page }) => {
  await login(page);
  const a = '7c1d6c1e-0000-4000-8000-00000000000a', b = '7c1d6c1e-0000-4000-8000-00000000000b';
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Hilfslinien',
    pages: [{ ...newPage(), elements: [shape(a, 30, 40), shape(b, 140, 150)] }] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const surface = page.locator('.interaction-surface');
  const paper = (await surface.boundingBox())!;
  const mm = paper.width / 210; // newPage() is portrait A4
  const box = surface.locator(`[data-element-id="${a}"]`);
  await box.click();
  // Drag the centre of A to about 1 mm right of the page centre (105 mm).
  const start = { x: paper.x + 50 * mm, y: paper.y + 55 * mm };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 40 * mm, start.y + 10 * mm, { steps: 5 });
  await page.mouse.move(paper.x + 106 * mm, start.y + 20 * mm, { steps: 5 });
  await expect(surface.locator('.snap-guides line.page')).toHaveCount(1);
  await page.screenshot({ path: test.info().outputPath('hilfslinien.png') });
  await page.mouse.up();
  await expect(surface.locator('.snap-guides')).toHaveCount(0);
  await expect.poll(async () => parseFloat(await box.evaluate((el) => (el as HTMLElement).style.left))).toBeCloseTo(85, 1);

  // Its top edge catches the top edge of B (150 mm) while moving.
  const now = (await box.boundingBox())!;
  await page.mouse.move(now.x + now.width / 2, now.y + now.height / 2);
  await page.mouse.down();
  await page.mouse.move(now.x + now.width / 2 + 5, now.y + now.height / 2 + 30 * mm, { steps: 4 });
  // Grabbed 15 mm below its top edge; aim for 151 mm, away from other stops.
  await page.mouse.move(paper.x + 60 * mm, paper.y + (151 + 15) * mm, { steps: 4 });
  // (A horizontal line has no height, so count instead of checking visibility.)
  await expect(surface.locator('.snap-guides line:not(.page)[y1="150"]')).not.toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath('hilfslinien-kante.png') });
  await page.mouse.up();
  await expect.poll(async () => parseFloat(await box.evaluate((el) => (el as HTMLElement).style.top))).toBeCloseTo(150, 1);

  // Alt moves freely without guides.
  const free = (await box.boundingBox())!;
  await page.keyboard.down('Alt');
  await page.mouse.move(free.x + free.width / 2, free.y + free.height / 2);
  await page.mouse.down();
  await page.mouse.move(free.x + free.width / 2, free.y + free.height / 2 - 1 * mm, { steps: 3 });
  await expect(surface.locator('.snap-guides')).toHaveCount(0);
  await page.mouse.up();
  await page.keyboard.up('Alt');
  await expect.poll(async () => parseFloat(await box.evaluate((el) => (el as HTMLElement).style.top))).toBeCloseTo(149, 0);
});
