import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function fresh(page: Page, title: string) {
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title, pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  return created.book.id as string;
}
async function openBlock(page: Page, subject: string, title: string) {
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: new RegExp(`^${subject} · `) }).click();
  await dialog.getByRole('button', { name: title, exact: true }).click();
  return dialog;
}
type Saved = { pages: { elements: { widgetKind?: string; settings?: { tool?: string; werkzeug?: Record<string, unknown> }; response?: { werkzeug?: { state: Record<string, unknown> } } }[] }[] };
const opened = async (page: Page, id: string): Promise<Saved> => (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id } })).json();

test('Strichliste: Einstellungen mit Vorschau, Striche werden gespeichert und bleiben', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const id = await fresh(page, 'Strichliste');
  const dialog = await openBlock(page, 'Mathematik', 'Strichliste und Diagramm');
  await expect(dialog.locator('.tool-preview .lh-ct-tally svg')).toContainText('Was essen wir am liebsten?');
  await dialog.getByLabel('Überschrift').fill('Unsere Haustiere');
  await dialog.getByLabel('Ding 1', { exact: true }).fill('Hund');
  await dialog.getByRole('button', { name: 'Dazu', exact: true }).click();
  await dialog.getByLabel('Ding 4', { exact: true }).fill('Katze');
  await expect(dialog.locator('.tool-preview .lh-ct-tally svg')).toContainText('Unsere Haustiere');
  await dialog.getByRole('radio', { name: 'Nur Diagramm', exact: true }).click();
  await dialog.getByRole('radio', { name: 'Striche und Diagramm', exact: true }).click();
  await page.screenshot({ path: test.info().outputPath('strichliste-einstellungen.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const tally = page.locator('.interaction-surface .lh-wg-tally');
  await expect(tally).toHaveAttribute('aria-label', /Unsere Haustiere/);
  for (let i = 0; i < 6; i++) await tally.locator('svg [data-a="p:0"]').click();
  await tally.locator('svg [data-a="p:3"]').click();
  await tally.locator('svg [data-a="m:0"]').click();
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  let saved = await opened(page, id);
  const element = saved.pages[0].elements.find((e) => e.widgetKind === 'werkzeug')!;
  expect(element.settings?.tool).toBe('tally');
  expect(element.response?.werkzeug?.state).toEqual({ counts: [5, 0, 0, 1] });
  await page.screenshot({ path: test.info().outputPath('strichliste.png') });
  // After reloading, the counts are there again (and opening the settings shows them).
  await page.reload();
  await expect(tally.locator('svg')).toContainText('Katze');
  await tally.locator('svg [data-a="p:1"]').click();
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  saved = await opened(page, id);
  expect(saved.pages[0].elements[0].response?.werkzeug?.state).toEqual({ counts: [5, 1, 0, 1] });
  expect(errors).toEqual([]);
});

test('Glücksrad und Würfel: Rad und Strichliste auf einer Seite, das Rad zählt mit', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const id = await fresh(page, 'Glücksrad');
  const dialog = await openBlock(page, 'Mathematik', 'Glücksrad und Würfel');
  await expect(dialog).toHaveCount(0);
  const surface = page.locator('.interaction-surface');
  await expect(surface.locator('.lh-wg-spin')).toHaveCount(1);
  await expect(surface.locator('.lh-wg-tally svg')).toContainText('Was kommt am häufigsten?');
  await surface.locator('.lh-wg-spin svg [data-a="go"]').first().click();
  // The wheel turns for a while; then the result gets a stroke in the Strichliste.
  await expect.poll(async () => {
    const saved = await opened(page, id);
    const counts = saved.pages.flatMap((p) => p.elements).find((e) => e.settings?.tool === 'tally')?.response?.werkzeug?.state.counts as number[] | undefined;
    return counts?.reduce((a, b) => a + b, 0) ?? 0;
  }, { timeout: 20000 }).toBe(1);
  await page.screenshot({ path: test.info().outputPath('gluecksrad.png') });
  expect(errors).toEqual([]);
});

test('Suchbild und Muster fortsetzen: einstellen und spielen', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  await fresh(page, 'Suchbild und Muster');
  let dialog = await openBlock(page, 'Mathematik', 'Suchbild');
  await dialog.getByRole('radio', { name: 'Kreise', exact: true }).click();
  await dialog.getByRole('radio', { name: 'blau', exact: true }).click();
  await dialog.getByRole('radio', { name: '4', exact: true }).click();
  await expect(dialog.locator('.tool-preview .lh-ct-seek svg')).toContainText('Finde alle blauen Kreise!');
  await expect(dialog.locator('.tool-preview .lh-ct-seek svg')).toContainText('0 von 4');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const seek = page.locator('.interaction-surface .lh-wg-seek');
  await expect(seek.locator('svg')).toContainText('Finde alle blauen Kreise!');
  // Easy: the four blue circles are the only blue circles; tapping all of them finds all.
  const targets = seek.locator('svg [data-a^="o:"]:has(circle[fill="#1c7ed6"])');
  await expect(targets).toHaveCount(4);
  for (let i = 0; i < 4; i++) await targets.nth(i).click();
  await expect(seek.locator('svg')).toContainText('Alle gefunden!');
  await seek.locator('svg [data-a="new"]').click();
  await expect(seek.locator('svg')).not.toContainText('Alle gefunden!');
  await page.screenshot({ path: test.info().outputPath('suchbild.png') });

  dialog = await openBlock(page, 'Mathematik', 'Muster fortsetzen');
  await dialog.getByRole('radio', { name: 'Formen', exact: true }).click();
  await dialog.getByRole('radio', { name: '3', exact: true }).first().click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const pattern = page.locator('.interaction-surface .lh-wg-pattern');
  await expect(pattern).toHaveCount(1);
  expect(await pattern.locator('svg [data-a^="c:"]').count()).toBeGreaterThan(1);
  await pattern.locator('svg [data-a^="c:"]').first().click();
  await page.screenshot({ path: test.info().outputPath('muster.png') });
  expect(errors).toEqual([]);
});
