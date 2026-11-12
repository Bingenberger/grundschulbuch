import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Mathe-Aufgaben: Dialog wie in der Vorlage, Seiten mit Eintippkästchen und Lösungsseiten', async ({ page }) => {
  test.setTimeout(90000);
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Mathe', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.evaluate(() => localStorage.removeItem('grundschulbuch-mathe-aufgaben'));
  await page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Neue Seite', exact: true }).click();
  const templates = page.getByRole('dialog', { name: 'Neue Seite' });
  await templates.getByRole('navigation', { name: 'Kategorien' }).getByRole('button', { name: /^Einstellbar · / }).click();
  await templates.getByRole('button', { name: 'Vorlage Mathe-Aufgaben' }).click();

  const dialog = page.getByRole('dialog', { name: 'Mathe-Aufgaben' });
  await expect(dialog.getByRole('radio', { name: 'bis 20' })).toHaveAttribute('aria-checked', 'true');
  await expect(dialog.getByRole('button', { name: /^Plus/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.getByRole('button', { name: /^Minus/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.getByRole('button', { name: /^Hunderterfeld/ })).toBeDisabled();
  await expect(dialog.getByText('Seite 1 von 1')).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('mathe-dialog.png') });
  await dialog.getByRole('button', { name: /^Rechenmauern/ }).click();
  await dialog.getByRole('button', { name: /^Zahlenstrahl/ }).click();
  await dialog.getByRole('button', { name: 'Mehr' }).click();
  await dialog.getByText('Lösungsseiten anhängen', { exact: true }).click();
  await expect(dialog.getByRole('switch', { name: /Lösungsseiten anhängen/ })).toBeChecked();
  await expect(dialog.getByText('Seite 1 von 4')).toBeVisible();
  await dialog.getByRole('button', { name: 'Nächste Seite' }).click();
  await page.screenshot({ path: test.info().outputPath('mathe-dialog-2.png') });
  await dialog.getByRole('button', { name: '4 Seiten einfügen' }).click();
  await expect(dialog).toHaveCount(0, { timeout: 20000 });
  await expect(page.locator('.page-thumbnail')).toHaveCount(4);

  // The first page: type an answer into a box, it is kept.
  await page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Seite 1 öffnen' }).click();
  const surface = page.locator('.interaction-surface');
  await expect(surface.locator('img').first()).toHaveAttribute('src', /^\/api\/medien\//);
  const box = surface.getByRole('textbox', { name: 'Antwort' }).first();
  await box.fill('17');
  await page.screenshot({ path: test.info().outputPath('mathe-seite.png') });
  await expect(page.getByText('Gespeichert')).toBeVisible({ timeout: 10000 });
  await page.reload();
  await expect(page.locator('.interaction-surface').getByRole('textbox', { name: 'Antwort' }).first()).toHaveValue('17');
  // Solutions are green.
  await page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Seite 3 öffnen' }).click();
  await expect(page.locator('.interaction-surface').getByText(/^Lösung: /)).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('mathe-loesung.png') });
});

test('Rechnen mit Geld: Dialog wie in der Vorlage, Münzen und Scheine als Bilder', async ({ page }) => {
  test.setTimeout(90000);
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Geld', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.evaluate(() => localStorage.removeItem('grundschulbuch-rechnen-mit-geld'));
  await page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Neue Seite', exact: true }).click();
  const templates = page.getByRole('dialog', { name: 'Neue Seite' });
  await templates.getByRole('navigation', { name: 'Kategorien' }).getByRole('button', { name: /^Einstellbar · / }).click();
  await templates.getByRole('button', { name: 'Vorlage Rechnen mit Geld' }).click();
  const dialog = page.getByRole('dialog', { name: 'Rechnen mit Geld' });
  await expect(dialog.getByRole('radio', { name: 'Euro und Cent' })).toHaveAttribute('aria-checked', 'true');
  await expect(dialog.getByRole('radio', { name: '20 €' })).toHaveAttribute('aria-checked', 'true');
  await expect(dialog.getByRole('button', { name: /^Beträge bestimmen/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.getByRole('button', { name: /^Wechselgeld/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.locator('.sheet-thumb img[src^="/kasse/geld-"]').first()).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('geld-dialog.png') });
  // With only euro coins there is no change to give: the exercise is set aside.
  await dialog.getByRole('radio', { name: 'Nur Euro' }).click();
  await dialog.getByRole('radio', { name: 'Nur Münzen' }).click();
  await expect(dialog.getByText(/keine Aufgaben bilden für: Wechselgeld/)).toBeVisible();
  await dialog.getByRole('radio', { name: 'Euro und Cent' }).click();
  await dialog.getByRole('radio', { name: 'Münzen und Scheine' }).click();
  await dialog.getByRole('button', { name: '1 Seite einfügen' }).click();
  await expect(dialog).toHaveCount(0, { timeout: 20000 });
  const surface = page.locator('.interaction-surface');
  await expect(surface.locator('img').first()).toHaveAttribute('src', /^\/api\/medien\//);
  await expect(surface.locator('img[src^="/kasse/"]')).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath('geld-seite.png') });
});

test('Labyrinth: Form, Schwierigkeit, Katzen und Lösung wie in der Vorlage', async ({ page }) => {
  test.setTimeout(90000);
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Labyrinth', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.evaluate(() => localStorage.removeItem('grundschulbuch-labyrinth'));
  await page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Neue Seite', exact: true }).click();
  const templates = page.getByRole('dialog', { name: 'Neue Seite' });
  await templates.getByRole('navigation', { name: 'Kategorien' }).getByRole('button', { name: /^Einstellbar · / }).click();
  await templates.getByRole('button', { name: 'Vorlage Labyrinth' }).click();
  const dialog = page.getByRole('dialog', { name: 'Labyrinth' });
  await expect(dialog.getByRole('radio', { name: /Eckig/ })).toHaveAttribute('aria-checked', 'true');
  await expect(dialog.getByRole('radio', { name: /Leicht 9 × 7 Felder/ })).toHaveAttribute('aria-checked', 'true');
  await dialog.getByRole('radio', { name: /Rund/ }).click();
  await expect(dialog.getByRole('radio', { name: /Leicht 5 Ringe/ })).toBeVisible();
  await dialog.getByText('Lösungsseiten anhängen', { exact: true }).click();
  await expect(dialog.getByText('Seite 1 von 2')).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('labyrinth-dialog.png') });
  await dialog.getByRole('button', { name: '2 Seiten einfügen' }).click();
  await expect(dialog).toHaveCount(0, { timeout: 20000 });
  await expect(page.locator('.page-thumbnail')).toHaveCount(2);
  await page.screenshot({ path: test.info().outputPath('labyrinth-seite.png') });
});
