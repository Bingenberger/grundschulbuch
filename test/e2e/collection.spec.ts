import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid } from '../../src/lib/notebook-model';
// „Selbst gemacht“ wie im Regal von Lernsachen-Heft 1.49.0: eigene Figuren in
// die Sammlung legen und in einem anderen Heft wieder einfügen.
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const figure = () => ({
  id: uuid(), type: 'widget', widgetKind: 'figur', x: 120, y: 40, width: 50, height: 110, rotation: 0, locked: false, color: '#253c42',
  settings: { title: 'Figur', av: { name: 'Kapitän Kurt', child: false }, say: { text: 'Ahoi!', pitch: 'low' }, move: 'wave' },
});
async function book(page: Page, title: string, elements: unknown[] = []) {
  const { book } = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title, pages: [{ ...newPage('blanko', 'landscape'), elements }] } })).json();
  return book.id as string;
}

test('Selbst gemacht: Figur in die Sammlung legen und in einem anderen Heft einfügen', async ({ page }) => {
  await login(page);
  const first = await book(page, 'Kurt erfinden', [figure()]);
  const second = await book(page, 'Kurt wiedersehen');
  await page.goto(`/heft/${first}`);
  // While editing, the first tap selects the figure (the next one would let it speak).
  await page.locator('.interaction-surface .figure-widget').click({ force: true });
  await expect(page.locator('.interaction-surface .page-element.selected')).toHaveCount(1);
  await page.getByRole('button', { name: 'Anordnen', exact: true }).click();
  await page.getByRole('button', { name: 'In Sammlung sichern', exact: true }).click();
  const shelve = page.getByRole('dialog', { name: 'In die Sammlung legen' });
  const name = shelve.getByLabel('Name in der Sammlung (unter „Selbst gemacht“)');
  await expect(name).toHaveValue('Kapitän Kurt');
  await shelve.getByRole('button', { name: 'Ablegen', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'In der Sammlung unter „Selbst gemacht“ abgelegt.' })).toBeVisible();

  // In another notebook: Lernwerkzeuge → Meine Sammlung → Selbst gemacht.
  await page.goto(`/heft/${second}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  await page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' }).getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: 'Meine Sammlung' }).click();
  const collection = page.getByRole('dialog', { name: 'Meine Sammlung' });
  const made = collection.getByRole('region', { name: 'Selbst gemacht' });
  await expect(made.getByRole('button', { name: 'Kapitän Kurt aus der Sammlung entfernen' })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('sammlung.png') });
  await made.getByRole('button', { name: /Kapitän Kurt/ }).first().click();
  await expect(collection).toHaveCount(0);
  await expect(page.locator('.interaction-surface .lh-wg-avatar')).toHaveCount(1);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const pages = (await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: second } })).json()).pages;
  const copy = pages[0].elements.find((e: { widgetKind?: string }) => e.widgetKind === 'figur');
  expect(copy.settings).toMatchObject({ av: { name: 'Kapitän Kurt' }, say: { text: 'Ahoi!' }, move: 'wave' });

  // Clean up for other tests.
  const assets = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'assets' } })).json();
  for (const a of assets) await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'removeAsset', assetId: a.id } });
});
