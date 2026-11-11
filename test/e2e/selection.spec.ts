import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid, type PageElement } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const stroke = (y: number): PageElement => ({ id: uuid(), type: 'stroke', x: 20, y, width: 120, height: 10, rotation: 0, locked: false,
  color: '#123456', penWidth: 1, opacity: 1, points: [{ x: 0, y: 5, pressure: 0.5 }, { x: 120, y: 5, pressure: 0.5 }] });

test('Auswahl: Element antippen, Striche treffen und mit einem Rahmen mehrere wählen', async ({ page }) => {
  await login(page);
  const text: PageElement = { id: uuid(), type: 'text', x: 20, y: 150, width: 100, height: 20, rotation: 0, locked: false, color: '#253c42', text: 'Ein Satz', font: 'Andika', fontSize: 18 };
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Auswahlprobe',
    pages: [{ ...newPage(), elements: [stroke(40), stroke(70), text] }] } });
  expect(response.ok()).toBeTruthy(); const created = await response.json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('button', { name: 'Ganze Seite', exact: true }).click();
  const surface = page.locator('.interaction-surface');
  const box = (await surface.boundingBox())!;
  const at = (x: number, y: number) => ({ x: box.x + x / 210 * box.width, y: box.y + y / 297 * box.height });
  // No long element list in the bottom bar any more.
  await expect(page.getByRole('region', { name: 'Auswahl' })).not.toContainText('Elemente der Seite');

  // Tap directly on a stroke.
  const onLine = at(80, 75);
  await page.mouse.click(onLine.x, onLine.y);
  await expect(page.getByRole('region', { name: 'Element einstellen' })).toBeVisible();
  await expect(surface.locator('.selection-handles')).toHaveCount(1);

  // Tap on empty paper clears the selection.
  const empty = at(180, 250);
  await page.mouse.click(empty.x, empty.y);
  await expect(surface.locator('.selection-handles')).toHaveCount(0);

  // A frame around both strokes selects exactly those two.
  const from = at(10, 30), to = at(150, 90);
  await page.mouse.move(from.x, from.y); await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 6 });
  await expect(surface.locator('.selection-frame')).toBeVisible();
  await page.mouse.up();
  await expect(surface.locator('.selection-frame')).toHaveCount(0);
  await expect(page.getByRole('region', { name: '2 Elemente einstellen' })).toBeVisible();
  await expect(surface.locator('.selection-handles')).toHaveCount(2);

  // The selection can be moved together.
  const handle = surface.locator('.move-element-handle').first();
  const h = (await handle.boundingBox())!;
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down();
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2 + 40, { steps: 4 }); await page.mouse.up();
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  const saved = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: created.book.id } })).json();
  const ys = saved.pages[0].elements.filter((el: PageElement) => el.type === 'stroke').map((el: PageElement) => el.y);
  expect(ys[0]).toBeGreaterThan(40); expect(ys[1]).toBeGreaterThan(70);
  expect(saved.pages[0].elements.find((el: PageElement) => el.type === 'text').y).toBe(150);
});
