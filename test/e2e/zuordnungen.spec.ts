import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function openBlock(page: Page, subject: string, title: string) {
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title, pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: new RegExp(`^${subject} · `) }).click();
  await dialog.getByRole('button', { name: title, exact: true }).click();
  // No picture search in the tests (it would need the internet).
  await dialog.getByRole('switch', { name: /Bilder automatisch suchen/ }).uncheck();
  return dialog;
}
const player = (page: Page) => page.frameLocator('.interaction-surface .textsachen-frame.is-live iframe');

test('Zuordnungen aus Schiebesachen: Artikel sortieren, Karte bleibt nach dem Neuladen liegen', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const dialog = await openBlock(page, 'Für alle Fächer', 'Zuordnungen');
  await dialog.getByRole('radio', { name: /^Artikel/ }).click();
  await expect(dialog.getByLabel('Inhalt der Übung')).toHaveValue(/der Tisch/);
  await expect(dialog.getByRole('status').filter({ hasText: '3 Spalten · 6 Karten' })).toBeVisible();
  await expect(dialog.frameLocator('.dnd-preview iframe').getByText('Fenster')).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('zuordnung-dialog.png'), fullPage: true });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const frame = player(page);
  await expect(frame.getByText('der', { exact: true }).first()).toBeVisible();
  const card = frame.getByText('Tisch', { exact: true }).first();
  const from = (await card.boundingBox())!, to = (await frame.getByText('der', { exact: true }).first().boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(from.x + ((to.x - from.x) * i) / 10, from.y + ((to.y + 120 - from.y) * i) / 10);
  await page.mouse.up();
  await page.screenshot({ path: test.info().outputPath('zuordnung-seite.png') });
  const moved = (await frame.getByText('Tisch', { exact: true }).first().boundingBox())!;
  expect(moved.y).toBeLessThan(from.y - 100);
  await page.waitForTimeout(1500);
  await page.reload();
  const again = (await player(page).getByText('Tisch', { exact: true }).first().boundingBox())!;
  // The card stays in its column; the layout may shift a little while fonts load.
  expect(Math.abs(again.y - moved.y)).toBeLessThan(40);
  expect(errors).toEqual([]);
});

test('Silbenlesen: Wörter in Silben, Silben blau und rot', async ({ page }) => {
  await login(page);
  const dialog = await openBlock(page, 'Deutsch', 'Silbenlesen');
  await dialog.getByRole('radiogroup', { name: 'Was steht neben den Kästchen?' }).getByRole('radio', { name: 'Wort', exact: true }).click();
  await expect(dialog.getByRole('status').filter({ hasText: '4 Wörter' })).toBeVisible();
  await expect(dialog.frameLocator('.dnd-preview iframe').getByText('Banane', { exact: true })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('silben-dialog.png'), fullPage: true });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const frame = player(page);
  await expect(frame.getByText('Lege die Wörter aus Silben.')).toBeVisible();
  await expect(frame.getByText('Banane', { exact: true })).toBeVisible();
  await expect(frame.getByText('na', { exact: true }).first()).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('silben-seite.png') });
});
