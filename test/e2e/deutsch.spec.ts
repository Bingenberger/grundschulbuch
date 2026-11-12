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

test('Silben verbinden wie in der Vorlage: Buchstaben ziehen, Silbe fährt davon', async ({ page }) => {
  test.setTimeout(60000);
  await login(page);
  const dialog = await openBlock(page, 'Silben verbinden');
  await expect(dialog.getByRole('button', { name: 'Laute verbinden', exact: true })).toHaveCount(0);
  await expect(dialog.getByLabel('Gelernte Buchstaben')).toHaveValue('m l s f r n a o i e u');
  await dialog.getByRole('group', { name: 'Wie viele Silben?' }).getByRole('button', { name: '2 Silben', exact: true }).click();
  await expect(dialog.locator('.monster-listen')).toHaveCount(2);
  await page.screenshot({ path: test.info().outputPath('silben-dialog.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const widget = page.locator('.interaction-surface .lh-wg-synth.is-live');
  const task = async () => /Zieh das (\S+) zum (\S+?)!/.exec((await widget.locator('svg').first().textContent()) || '')?.slice(1).join('+');
  const before = await task();
  expect(before).toBeTruthy();
  await page.screenshot({ path: test.info().outputPath('silben-seite.png') });
  // Pull the first letter to the second.
  const pull = widget.locator('.lh-sy-pull').first();
  const box = (await pull.boundingBox())!;
  const svg = (await widget.locator('svg').first().boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + (340 * svg.width) / 1400, box.y + box.height / 2, { steps: 15 });
  await page.mouse.up();
  // The syllable rides away, then the next pair is waiting.
  await page.waitForTimeout(500);
  await page.screenshot({ path: test.info().outputPath('silben-gezogen.png') });
  await expect.poll(task, { timeout: 20000 }).not.toBe(before);
  await expect(page.locator('.interaction-surface .selection-frame')).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath('silben-weiter.png') });
});

test('Anlaut-Tastatur wie in der Vorlage: Bildtasten schreiben, Zurück, Alles neu', async ({ page }) => {
  await login(page);
  const dialog = await openBlock(page, 'Anlaut-Tastatur');
  await expect(dialog.getByRole('tab', { name: 'Tastatur' })).toBeVisible();
  await dialog.getByRole('tab', { name: 'Bilder' }).click();
  await expect(dialog.getByLabel('Wort für M m')).toHaveValue('Maus');
  await page.screenshot({ path: test.info().outputPath('anlaut-dialog.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const widget = page.locator('.interaction-surface .lh-wg-anlaut.is-live');
  await expect(widget.locator('img').first()).toHaveAttribute('src', /^\/anlaut\//);
  for (const key of ['m', 'a', 'm', 'a']) await widget.locator(`[data-a="k:${key}:1"]`).first().click();
  await expect(widget.locator('.lh-al-top')).toContainText('mama');
  await page.screenshot({ path: test.info().outputPath('anlaut-seite.png') });
  await widget.locator('[data-a="del"]').click();
  await expect(widget.locator('.lh-al-top')).toContainText('mam');
  await expect(widget.locator('.lh-al-top')).not.toContainText('mama');
});

test('Silben klatschen wie in der Vorlage: Bild, Silben zeigen, Weiter', async ({ page }) => {
  test.setTimeout(60000);
  await login(page);
  const dialog = await openBlock(page, 'Silben klatschen');
  await expect(dialog.getByLabel('Wort, Silben mit Bindestrich')).toHaveCount(4);
  await dialog.getByRole('group', { name: 'Hilfe' }).getByRole('button', { name: 'Wort in Silbenschrift' }).click();
  await page.screenshot({ path: test.info().outputPath('klatschen-dialog.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const widget = page.locator('.interaction-surface .lh-wg-clap.is-live');
  await expect(widget.locator('img.lh-cl-pic').first()).toHaveAttribute('src', /^\/(bilder|kasse)\//);
  await widget.locator('[data-a="show"]').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: test.info().outputPath('klatschen-seite.png') });
  const before = await widget.locator('img.lh-cl-pic').first().getAttribute('src');
  await expect.poll(async () => widget.locator('[data-a="next"]').count(), { timeout: 15000 }).toBeGreaterThan(0);
  await widget.locator('[data-a="next"]').first().click();
  await expect.poll(async () => widget.locator('img.lh-cl-pic').first().getAttribute('src'), { timeout: 10000 }).not.toBe(before);
});
