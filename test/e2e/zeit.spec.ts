import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function openBlock(page: Page, subject: string, title: string, fresh = true) {
  if (fresh) {
    const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title, pages: [newPage('blanko', 'landscape')] } })).json();
    await page.goto(`/heft/${created.book.id}`);
  }
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: new RegExp(`^${subject} · `) }).click();
  await dialog.getByRole('button', { name: title, exact: true }).click();
  return dialog;
}
const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

test('Uhr, Datum, Timer und Multi-Timer wie im Regal der Vorlage', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);

  // Uhr: digital, echte Uhrzeit.
  let dialog = await openBlock(page, 'Sachunterricht', 'Uhr');
  await dialog.getByRole('radio', { name: 'Digital', exact: true }).click();
  await expect(dialog.locator('.time-preview .lh-wg-digits')).toBeVisible();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const clock = page.locator('.interaction-surface .lh-wg-clock');
  await expect(clock.locator('.lh-wg-digits')).toContainText(String(new Date().getHours()));
  await expect(clock).toHaveAttribute('aria-label', /^Uhr: \d+:\d\d Uhr$/);

  // Datum ohne Wetter: der heutige Tag.
  dialog = await openBlock(page, 'Sachunterricht', 'Datum', false);
  const weather = dialog.getByRole('switch', { name: /Wetter anzeigen/ });
  if (await weather.isChecked()) await weather.uncheck();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-date .lh-wg-day')).toContainText(weekdays[new Date().getDay()]);

  // Timer: fest 5 Minuten, läuft gleich los.
  dialog = await openBlock(page, 'Klassenführung', 'Timer', false);
  await dialog.getByRole('radiogroup', { name: 'Schnell wählen' }).getByRole('radio', { name: '5', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const timer = page.locator('.interaction-surface .lh-wg-timer');
  await expect(timer).toHaveAttribute('aria-label', /Timer: noch (5 Min\.|\d+ Sek\.)/);
  await page.getByRole('button', { name: 'Neu starten' }).click();
  await expect(timer).toHaveAttribute('aria-label', 'Timer: noch 5 Min.');

  // Multi-Timer: eigene Phase.
  dialog = await openBlock(page, 'Klassenführung', 'Multi-Timer', false);
  await dialog.getByLabel('Name von Phase 1').fill('Lesen');
  await page.screenshot({ path: test.info().outputPath('multitimer-dialog.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-multitimer')).toHaveAttribute('aria-label', /Multi-Timer mit 3 Phasen: Lesen 10 Minuten, Pair 10 Minuten, Share 10 Minuten/);
  await page.screenshot({ path: test.info().outputPath('zeit-seite.png') });
  expect(errors).toEqual([]);
});

test('Lärmampel und Applausometer wie in der Vorlage', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  let dialog = await openBlock(page, 'Klassenführung', 'Applausometer');
  await dialog.getByLabel('Wort für Stufe 8').fill('Weltrekord!');
  await expect(dialog.locator('.applause-preview svg')).toContainText('Weltrekord!');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-applause')).toHaveAttribute('aria-label', /^Applausometer/);
  await expect(page.locator('.interaction-surface .lh-wg-applause svg')).toContainText('Weltrekord!');
  dialog = await openBlock(page, 'Klassenführung', 'Lärmampel', false);
  await dialog.getByRole('radio', { name: 'Flüstern', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-applause[aria-label^="Lärmampel"]')).toHaveCount(1);
  await page.screenshot({ path: test.info().outputPath('ampel-seite.png') });
  expect(errors).toEqual([]);
});

test('Bilder-Stundenplan: Fächer eintragen, Pause, eigene Seite, Vorlesen', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const dialog = await openBlock(page, 'Klassenführung', 'Bilder-Stundenplan');
  // Plan: Mathe in die erste Stunde am Montag, Deutsch geteilt dazu.
  await dialog.getByRole('group', { name: 'Fächer zum Eintragen' }).getByRole('button', { name: 'Mathe', exact: true }).click();
  await dialog.locator('.tt-grid .lh-tt-cell[data-d="0"][data-l="0"]').click();
  await dialog.getByText('Geteilte Stunde', { exact: true }).click();
  await expect(dialog.getByRole('switch', { name: /Geteilte Stunde/ })).toBeChecked();
  await dialog.getByRole('group', { name: 'Fächer zum Eintragen' }).getByRole('button', { name: 'Deutsch', exact: true }).click();
  await dialog.locator('.tt-grid .lh-tt-cell[data-d="0"][data-l="0"]').click();
  await expect(dialog.locator('.tt-grid .lh-tt-cell[data-d="0"][data-l="0"]')).toHaveAttribute('data-say', /Mathe oder Deutsch/);
  await dialog.getByRole('tab', { name: 'Tage & Zeiten' }).click();
  await dialog.getByRole('radio', { name: 'Montag bis Samstag', exact: true }).click();
  await expect(dialog.locator('.tt-preview-all .lh-tt-day')).toHaveCount(6);
  await dialog.getByRole('tab', { name: 'Aussehen' }).click();
  await dialog.getByLabel('Überschrift').fill('Stundenplan der 2b');
  await page.screenshot({ path: test.info().outputPath('stundenplan-dialog.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const plan = page.locator('.interaction-surface .lh-wg-timetable');
  await expect(plan).toHaveAttribute('aria-label', /Stundenplan: Stundenplan der 2b/);
  await expect(plan.locator('.lh-tt-cell[data-d="0"][data-l="0"] img')).toHaveCount(2);
  await expect(plan.locator('.lh-tt-break')).toContainText('Pause');
  await page.screenshot({ path: test.info().outputPath('stundenplan-seite.png') });
  expect(errors).toEqual([]);
});

test('Wetter nur über den Schulserver und nur angemeldet', async ({ page }) => {
  expect((await page.request.get('/api/wetter?art=ort&name=Regensburg')).status()).toBe(401);
  await login(page);
  expect((await page.request.get('/api/wetter?art=wetter&latitude=abc&longitude=12')).status()).toBe(400);
  expect((await page.request.get('/api/wetter?art=ort&name=R')).status()).toBe(400);
  expect((await page.request.get('/api/wetter?art=sonst')).status()).toBe(400);
});
