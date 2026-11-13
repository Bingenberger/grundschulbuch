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
  // The former exercises are replaced by the ones of Textsachen.
  for (const gone of ['Lückentext', 'Abschreiben', 'Blitzlesen', 'Buchstaben raten', 'Worträtsel']) await expect(dialog.getByRole('button', { name: gone, exact: true })).toHaveCount(0);
  await dialog.getByRole('button', { name: title, exact: true }).click();
  // No picture search in the tests (it would need the internet).
  await dialog.getByRole('switch', { name: /Bilder automatisch suchen/ }).uncheck();
  return dialog;
}
const player = (page: Page) => page.frameLocator('.interaction-surface .textsachen-frame.is-live iframe');

test('Maus & Käse aus Textsachen: Buchstaben raten, Spielstand bleibt', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const dialog = await openBlock(page, 'Maus & Käse');
  await expect(dialog.getByRole('radio', { name: /^Maus & Käse/ })).toHaveAttribute('aria-checked', 'true');
  await dialog.getByLabel('Wörter der Übung').fill('die Maus\ndas Haus');
  await dialog.getByRole('slider', { name: 'Schritte bis zum Käse' }).fill('6');
  await page.screenshot({ path: test.info().outputPath('maus-dialog.png'), fullPage: true });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(player(page).getByText('Welches Wort ist gesucht?')).toBeVisible();
  await expect(player(page).getByText('Die Maus ist noch 6 Schritte vom Käse entfernt.')).toBeVisible();
  await player(page).getByRole('button', { name: 'A', exact: true }).click();
  await player(page).getByRole('button', { name: 'X', exact: true }).click();
  await expect(player(page).getByText('Die Maus ist noch 5 Schritte vom Käse entfernt.')).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('maus-seite.png') });
  // The state is kept: after reloading the guessed letters are still there.
  await page.waitForTimeout(1500);
  await page.reload();
  await expect(player(page).getByText('Die Maus ist noch 5 Schritte vom Käse entfernt.')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Lesen & Schreiben: Lückentext mit gewählten Lernwörtern', async ({ page }) => {
  await login(page);
  const dialog = await openBlock(page, 'Lesen & Schreiben');
  await dialog.getByRole('radiogroup', { name: 'Inhalt' }).getByRole('radio', { name: 'Text', exact: true }).click();
  await dialog.getByRole('radio', { name: /^Lückentext/ }).click();
  await dialog.getByLabel('Text der Übung').fill('Die Sonne scheint. Der Hund bellt laut.');
  const learn = dialog.getByRole('group', { name: 'Lernwörter wählen' });
  await learn.getByRole('button', { name: 'Sonne', exact: true }).click();
  await learn.getByRole('button', { name: 'Hund', exact: true }).click();
  await expect(learn.getByRole('button', { name: 'Hund', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.getByText('✓ Alles bereit.')).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('lesen-dialog.png'), fullPage: true });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const frame = player(page);
  await expect(frame.getByText('scheint.')).toBeVisible();
  await expect(frame.locator('.tsp-gapin')).toHaveCount(2);
  await expect(frame.getByRole('button', { name: /Vorlesen/ }).first()).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('lesen-seite.png') });
});

test('Kreuzworträtsel braucht Bilder; mit eigenen Bildern entsteht das Rätsel', async ({ page }) => {
  await login(page);
  const dialog = await openBlock(page, 'Kreuzworträtsel');
  await dialog.getByLabel('Wörter der Übung').fill('die Sonne\ndas Haus\nder Apfel');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog.getByText(/mindestens 2 Wörter mit Bildern/).first()).toBeVisible();
  for (const [word, file] of [['die Sonne', '2246'], ['das Haus', '2294'], ['der Apfel', '2462']])
    await dialog.getByLabel(`Bild für ${word} wählen`).setInputFiles(`public/bilder/${file}.webp`);
  await expect(dialog.locator('.ts-picture img')).toHaveCount(3);
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const frame = player(page);
  await expect(frame.getByText(/Waagerecht|Senkrecht/).first()).toBeVisible();
  await expect(frame.locator('img').first()).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('kreuzwort-seite.png') });
});
