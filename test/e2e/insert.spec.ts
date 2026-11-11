import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Einfügen: Formen, Sticker und Stempel (auch Emojis) direkt über die untere Leiste; Internet und Arbeitsblatt haben eigene Wege', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Einfügeprobe' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const rail = page.getByRole('navigation', { name: 'Werkzeuge' });
  for (const name of ['Internet', 'Lernwerkzeuge', 'Einfügen']) await expect(rail.getByRole('button', { name, exact: true })).toBeVisible();
  const surface = page.locator('.interaction-surface');
  const elements = surface.locator('.page-element');

  await rail.getByRole('button', { name: 'Einfügen', exact: true }).click();
  const bar = page.getByRole('region', { name: 'Einfügen' });
  await expect(bar.getByRole('group', { name: 'Einfügen: Bereiche' }).getByRole('button')).toHaveText([/Formen/, /Sticker/, /Stempel/]);
  // No more templates, worksheets or collection here.
  for (const gone of ['Vorlagen', 'Arbeitsblatt', 'Sammlung']) await expect(bar.getByRole('button', { name: gone, exact: true })).toHaveCount(0);
  await bar.getByRole('button', { name: 'Stern', exact: true }).click();
  await expect(elements).toHaveCount(1);

  await rail.getByRole('button', { name: 'Einfügen', exact: true }).click();
  await bar.getByRole('button', { name: 'Sticker', exact: true }).click();
  await bar.getByRole('group', { name: 'Thema' }).getByRole('button', { name: 'Tiere' }).click();
  await bar.getByRole('button', { name: 'Igel' }).click();
  await expect(surface.locator('.page-element', { hasText: '🦔' })).toHaveCount(1);

  // Stamps: choose one, then every tap stamps it where the page was tapped.
  await rail.getByRole('button', { name: 'Einfügen', exact: true }).click();
  await bar.getByRole('button', { name: 'Stempel', exact: true }).click();
  await bar.getByRole('group', { name: 'Emoji-Stempel' }).getByRole('button', { name: 'Daumen hoch' }).click();
  await expect(bar.getByRole('button', { name: 'Daumen hoch' })).toHaveAttribute('aria-pressed', 'true');
  const box = (await surface.boundingBox())!;
  await page.mouse.click(box.x + box.width * 0.5, box.y + 380);
  await page.mouse.click(box.x + box.width * 0.7, box.y + 500);
  await expect(surface.locator('.page-element', { hasText: '👍' })).toHaveCount(2);
  const thumb = surface.locator('.page-element', { hasText: '👍' }).first();
  const placed = (await thumb.boundingBox())!;
  expect(Math.abs(placed.x + placed.width / 2 - (box.x + box.width * 0.5))).toBeLessThan(8);
  await bar.getByRole('group', { name: 'Text-Stempel' }).getByRole('button', { name: 'Super!' }).click();
  await page.mouse.click(box.x + box.width * 0.3, box.y + 250);
  await expect(surface.getByText('Super!')).toBeVisible();
  // Escape ends stamping: the next tap does not stamp.
  await page.keyboard.press('Escape');
  await expect(bar.getByRole('button', { name: 'Super!' })).toHaveAttribute('aria-pressed', 'false');
  const count = await elements.count();
  await page.mouse.click(box.x + box.width * 0.2, box.y + 560);
  await expect(elements).toHaveCount(count);

  await rail.getByRole('button', { name: 'Internet', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Video, Webseite oder QR-Code' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog', { name: 'Video, Webseite oder QR-Code' }).getByRole('button', { name: /Schließen|Abbrechen/ }).first().click().catch(() => undefined);
  await rail.getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  await page.getByRole('button', { name: /Arbeitsblatt erzeugen/ }).click();
  await expect(page.getByRole('group', { name: 'Übungsformat' })).toBeVisible();
});
