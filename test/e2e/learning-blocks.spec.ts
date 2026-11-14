import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Lernwerkzeuge nach Fächern, Vorlagen nur gestalterisch, einstellbare Arbeitsblätter bei den Vorlagen', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Bausteinprobe', orientation: 'landscape' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const rail = page.getByRole('navigation', { name: 'Werkzeuge' });

  await rail.getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  const subjects = dialog.getByRole('navigation', { name: 'Fächer' });
  for (const subject of ['Deutsch', 'Mathematik', 'Sachunterricht', 'Musik', 'Medien & Präsentation', 'Klassenführung', 'Unterstützte Kommunikation', 'Für alle Fächer'])
    await expect(subjects.getByRole('button', { name: new RegExp(`^${subject} · \\d+$`) })).toBeEnabled();
  await page.screenshot({ path: test.info().outputPath('lernwerkzeuge.png') });

  // Only one subject; then the search looks through all of them.
  await subjects.getByRole('button', { name: /^Musik · / }).click();
  await expect(dialog.getByRole('button', { name: 'Xylophon', exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Quiz', exact: true })).toHaveCount(0);
  await dialog.getByLabel('Lernwerkzeug suchen').fill('silben');
  await expect(dialog.getByRole('button', { name: 'Silben klatschen', exact: true })).toBeVisible();
  await dialog.getByLabel('Lernwerkzeug suchen').fill('');

  // A block with settings (Timer) opens them first; “Andere Auswahl” goes back.
  // (Music presets such as Xylophon come as finished pages, see music-reference.spec.)
  await subjects.getByRole('button', { name: /^Klassenführung · / }).click();
  await dialog.getByRole('button', { name: 'Timer', exact: true }).click();
  await expect(dialog.getByRole('heading', { name: 'Timer' })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Mit KI entwerfen' })).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Andere Auswahl' }).click();
  await expect(subjects).toBeVisible();
  await dialog.getByRole('button', { name: 'Timer', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-timer')).toHaveCount(1);

  // The communication book comes as whole pages.
  await rail.getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  await subjects.getByRole('button', { name: /^Unterstützte Kommunikation · / }).click();
  await dialog.getByRole('button', { name: 'Kommunikationsbuch mit allen Tafeln', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  // A first page with a key for each board, then the ten boards.
  await expect(page.locator('.page-thumbnail')).toHaveCount(12);

  // Templates: design only, plus the settable worksheets.
  await page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Neue Seite', exact: true }).click();
  const templates = page.getByRole('dialog', { name: 'Neue Seite' });
  const categories = templates.getByRole('navigation', { name: 'Kategorien' });
  for (const gone of ['Kommunikation', 'Interaktive Übungen', 'Mathe', 'Schule', 'Lesen & Schreiben'])
    await expect(categories.getByRole('button', { name: new RegExp(`^${gone} · [1-9]`) })).toHaveCount(0);
  await categories.getByRole('button', { name: /^Einstellbar · 7$/ }).click();
  await page.screenshot({ path: test.info().outputPath('einstellbar.png') });
  await templates.getByRole('button', { name: 'Vorlage Uhrzeiten üben' }).click();
  // The settings dialog of the reference.
  const clock = page.getByRole('dialog', { name: 'Uhrzeiten üben' });
  await expect(clock.getByRole('radio', { name: /Halbe Stunden/ })).toHaveAttribute('aria-checked', 'true');
  await expect(clock.getByRole('button', { name: /^Uhrzeit ablesen/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(clock.getByRole('button', { name: /^Zeiger einzeichnen/ })).toHaveAttribute('aria-pressed', 'true');
  await clock.getByRole('radio', { name: /Viertelstunden/ }).click();
  await clock.getByRole('button', { name: /^Uhrzeit in Worten/ }).click();
  await page.screenshot({ path: test.info().outputPath('uhrzeiten-dialog.png') });
  await clock.getByRole('button', { name: '1 Seite einfügen' }).click();
  await expect(clock).toHaveCount(0, { timeout: 20000 });
  await expect(page.locator('.page-thumbnail')).toHaveCount(13);
  await page.screenshot({ path: test.info().outputPath('uhrzeiten-seite.png') });
});
