import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const style = (box: import('@playwright/test').Locator, key: 'left' | 'top' | 'width' | 'height') =>
  box.evaluate((el, k) => parseFloat((el as HTMLElement).style[k as 'left']), key);

test('Lineatur als Lernwerkzeug: nur ein Teil der Seite, alle Lineaturen, Zeilenhaus, Texte rasten ein und wandern mit', async ({ page }) => {
  await login(page);
  const textId = '7c1d6c1e-0000-4000-8000-0000000000aa';
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Lineaturprobe',
    pages: [{ ...newPage(), elements: [{ id: textId, type: 'text', x: 20, y: 20, width: 120, height: 12, rotation: 0, locked: false, color: '#253c42', text: 'Hallo', font: 'Andika', fontSize: 18 }] }] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const rail = page.getByRole('navigation', { name: 'Werkzeuge' });
  await rail.getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByLabel('Lernwerkzeug suchen').fill('Lineatur');
  for (const name of ['Lineatur 1', 'Lineatur 1 mit Zeilenhaus', 'Lineatur 2', 'Lineatur 3', 'Linien', 'Linien eng', 'Kariert · 5 mm', 'Kariert · 1 cm', 'Rechenkästchen', 'Notenlinien', 'Punktraster'])
    await expect(dialog.getByRole('button', { name, exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Lineatur 1', exact: true }).click();
  await expect(dialog).toHaveCount(0);

  const surface = page.locator('.interaction-surface');
  const lin = surface.locator('.page-element:has(svg.lineatur-block)');
  await expect(lin.locator('svg')).toHaveAttribute('aria-label', 'Lineatur 1');
  // It lies under the text that was there before, and covers only part of the page.
  const order = await surface.locator('.page-element').evaluateAll((els) => els.map((el) => el.getAttribute('data-element-id')));
  expect(order[order.length - 1]).toBe(textId);
  expect(await style(lin, 'height')).toBeLessThan(120);

  // Bottom bar: Zeilenhaus and another Lineatur.
  const bar = page.getByRole('region', { name: 'Element einstellen' });
  await bar.getByRole('button', { name: 'Zeilenhaus', exact: true }).click();
  await expect(lin.locator('svg')).toHaveAttribute('aria-label', 'Lineatur 1 mit Zeilenhaus');
  await expect(lin.locator('.zeilenhaus')).toHaveCount(3);
  await page.screenshot({ path: test.info().outputPath('zeilenhaus.png') });
  await bar.getByRole('button', { name: /^Art: / }).click();
  await page.getByRole('group', { name: 'Art' }).getByRole('button', { name: 'Kariert · 5 mm' }).click();
  await expect(lin.locator('svg')).toHaveAttribute('aria-label', 'Kariert · 5 mm');
  await expect(bar.getByRole('button', { name: 'Zeilenhaus', exact: true })).toHaveCount(0);
  await bar.getByRole('button', { name: /^Art: / }).click();
  await page.getByRole('group', { name: 'Art' }).getByRole('button', { name: 'Lineatur 2' }).click();
  await expect(lin.locator('svg')).toHaveAttribute('aria-label', 'Lineatur 2');

  // Drag the text onto the Lineatur: it takes the size of the rows and sits on a baseline.
  const linTop = await style(lin, 'top'), linLeft = await style(lin, 'left');
  const text = surface.locator(`[data-element-id="${textId}"]`);
  const paper = (await surface.boundingBox())!;
  const mm = paper.width / 210;
  const from = (await text.boundingBox())!;
  await page.mouse.move(from.x + 10, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(paper.x + (linLeft + 12) * mm, paper.y + (linTop + 30) * mm, { steps: 8 });
  await page.mouse.up();
  const band = 26 * 297 / 1400, pitch = 116 * 297 / 1400;
  // The baseline of the first line lies on a writing line of the Lineatur (0.4 mm inset + 2 bands + rows).
  const baseline = await text.evaluate((el) => {
    const probe = document.createElement('span');
    probe.style.cssText = 'display:inline-block;width:0;height:0';
    const inner = (el.querySelector('div') || el) as HTMLElement;
    inner.prepend(probe);
    const y = probe.getBoundingClientRect().top;
    probe.remove();
    return y;
  });
  const rowsBase = (baseline - paper.y) / mm - linTop - 0.4 - 2 * band;
  const row = Math.round(rowsBase / pitch);
  expect(Math.abs(rowsBase - row * pitch)).toBeLessThan(0.6);
  const fontSize = await page.evaluate((id) => {
    const el = document.querySelector(`.interaction-surface [data-element-id="${id}"] div`) as HTMLElement;
    return parseFloat(getComputedStyle(el).fontSize);
  }, textId);
  expect(fontSize).toBeGreaterThan(18 * 96 / 72);

  // Moving the Lineatur takes the text along.
  const textTop = await style(text, 'top');
  // Grab it at its left edge, away from the text and the corner handles.
  const box = (await lin.boundingBox())!;
  const grab = { x: box.x + 4 * mm, y: box.y + box.height / 2 };
  await page.mouse.click(grab.x, grab.y);
  await page.mouse.move(grab.x, grab.y);
  await page.mouse.down();
  await page.mouse.move(grab.x, grab.y + 40 * mm, { steps: 6 });
  await page.mouse.up();
  await expect.poll(async () => (await style(lin, 'top')) - linTop).toBeGreaterThan(30);
  const moved = (await style(lin, 'top')) - linTop;
  await expect.poll(async () => (await style(text, 'top')) - textTop).toBeCloseTo(moved, 0);
});
