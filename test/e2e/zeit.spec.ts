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

test('Das sprechende Kalenderblatt: fragt nach dem Tag, das Kind tippt die Antwort', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Kalender', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Sachunterricht · / }).click();
  await dialog.getByRole('button', { name: 'Das sprechende Kalenderblatt', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const sheet = page.locator('.interaction-surface .lh-wg-calendar');
  await expect(sheet).toHaveAttribute('aria-label', /Welcher Tag ist heute\?/);
  await sheet.click();
  await expect(sheet).toHaveAttribute('aria-label', /Welchen Tag haben wir\?/);
  const today = weekdays[new Date().getDay()];
  await sheet.locator(`[data-cal="pick"][data-v="${today}"]`).click();
  await expect(sheet).toHaveAttribute('aria-label', /Welches Datum haben wir\?/, { timeout: 15000 });
  await page.screenshot({ path: test.info().outputPath('kalenderblatt.png') });
  expect(errors).toEqual([]);
});

test('Karte: Ort suchen, Markierung setzen, Kartenbild über den Schulserver', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  // No internet in the tests: tiles and the address search answer here.
  const green = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const asked: string[] = [];
  await page.route(/\/api\/karte\?quelle=/, (route) => { asked.push(route.request().url()); return route.fulfill({ status: 200, contentType: 'image/png', body: green }); });
  await page.route(/\/api\/karte\?suche=/, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ display_name: 'Regensburg, Bayern, Deutschland', lat: '49.0134', lon: '12.1016' }]) }));
  await login(page);
  const dialog = await openBlock(page, 'Sachunterricht', 'Karte');
  await dialog.getByLabel('Adresse suchen').fill('Regensburg');
  await dialog.getByRole('button', { name: 'Suchen', exact: true }).click();
  await dialog.getByRole('button', { name: 'Markierung setzen', exact: true }).click();
  await dialog.locator('.map-view').click({ position: { x: 200, y: 150 } });
  await dialog.getByLabel('Beschriftung der Markierung').fill('Unsere Schule');
  await dialog.getByRole('radiogroup', { name: 'Design' }).getByRole('radio', { name: /Schatzkarte/ }).click();
  await dialog.getByLabel('Titel des Lernwerkzeugs').fill('Mein Schulweg');
  await page.screenshot({ path: test.info().outputPath('karte-dialog.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0, { timeout: 15000 });
  const map = page.locator('.interaction-surface .lh-wg-map');
  await expect(map).toHaveAttribute('aria-label', 'Karte mit einer Markierung: Unsere Schule.');
  await expect(page.locator('.interaction-surface .map-title')).toHaveText('Mein Schulweg');
  expect(asked.length).toBeGreaterThan(3);
  expect(asked.every((u) => new URL(u).origin === 'http://localhost:3100')).toBe(true);
  await page.screenshot({ path: test.info().outputPath('karte-seite.png') });
  expect(errors).toEqual([]);
});

test('Karte nur über den Schulserver und nur angemeldet', async ({ page }) => {
  expect((await page.request.get('/api/karte?quelle=de&z=1&x=0&y=0')).status()).toBe(401);
  await login(page);
  expect((await page.request.get('/api/karte?quelle=de&z=2&x=4&y=0')).status()).toBe(400);
  expect((await page.request.get('/api/karte?suche=R')).status()).toBe(400);
});

test('Unterstützte Kommunikation: Tafel mit Satzleiste und Kommunikationsbuch mit Zurück-Taste', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'UK', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const open = async (title: string) => {
    await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
    await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Unterstützte Kommunikation · / }).click();
    await dialog.getByRole('button', { name: title, exact: true }).click();
    await expect(dialog).toHaveCount(0);
  };
  // Eine Themen-Tafel: Tasten mit Bild und Wort, darüber die Satzleiste.
  await open('Erste Wörter');
  const surface = page.locator('.interaction-surface');
  await expect(surface.locator('.lh-talk-card')).toHaveCount(6);
  await surface.getByRole('button', { name: 'Ja.', exact: true }).click();
  await surface.getByRole('button', { name: 'Mehr, bitte.', exact: true }).click();
  await expect(surface.locator('.lh-wg-strip')).toContainText('Ja');
  await expect(surface.locator('.lh-wg-strip')).toContainText('Mehr');
  await page.screenshot({ path: test.info().outputPath('uk-tafel.png') });
  // Das Kommunikationsbuch: Tafel öffnen und mit der Zurück-Taste zurück.
  await open('Kommunikationsbuch mit allen Tafeln');
  // The book comes after the board: its first page has a key for each board.
  await page.getByLabel('Seite 2 öffnen', { exact: true }).click();
  await expect(surface.locator('.lh-talk.is-folder')).toHaveCount(10);
  await surface.locator('.lh-talk.is-folder').filter({ hasText: 'Gefühle' }).locator('.lh-talk-card').click();
  await expect(surface.locator('.lh-talk-card').filter({ hasText: 'zurück' })).toHaveCount(1, { timeout: 10000 });
  await page.screenshot({ path: test.info().outputPath('uk-gefuehle.png') });
  await surface.locator('.lh-talk-card').filter({ hasText: 'zurück' }).click();
  await expect(surface.locator('.lh-talk.is-folder')).toHaveCount(10, { timeout: 10000 });
  expect(errors).toEqual([]);
});

test('Medien: Elevator Pitch, Video mit Titel und QR-Plakat als eigene Seiten', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  let dialog = await openBlock(page, 'Medien & Präsentation', 'Elevator Pitch');
  await dialog.getByRole('radio', { name: '90 Sekunden', exact: true }).click();
  await dialog.getByLabel('Text auf dem Vorhang').fill('Mein Lieblingstier');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const pitch = page.locator('.interaction-surface .lh-wg-pitch');
  await expect(pitch).toHaveAttribute('aria-label', /90 Sekunden Zeit/);
  await expect(pitch).toContainText('Mein Lieblingstier');
  await page.screenshot({ path: test.info().outputPath('pitch.png') });

  dialog = await openBlock(page, 'Medien & Präsentation', 'Video', false);
  await dialog.getByLabel('Videolink').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  await dialog.getByLabel('Überschrift').fill('Wie Bienen leben');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface').getByText('Wie Bienen leben').first()).toBeVisible();
  await expect(page.locator('.interaction-surface iframe[src*="youtube-nocookie.com/embed/dQw4w9WgXcQ"], .interaction-surface .page-element[data-type="embed"], .interaction-surface .embed-content').first()).toBeAttached();

  dialog = await openBlock(page, 'Medien & Präsentation', 'QR-Plakat', false);
  await dialog.getByLabel('Adresse der Webseite').fill('lernsachen.blog');
  await dialog.getByLabel('Überschrift').fill('Unser Projekt');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface').getByText('Unser Projekt').first()).toBeVisible();
  await expect(page.locator('.interaction-surface').getByText('lernsachen.blog', { exact: true })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('qr-plakat.png') });
  expect(errors).toEqual([]);
});

test('Diaschau: Fotos hochladen, beschriften, Design, als eigene Seite', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const dialog = await openBlock(page, 'Medien & Präsentation', 'Diaschau');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  await dialog.getByLabel('Fotos für die Diaschau').setInputFiles([{ name: 'a.png', mimeType: 'image/png', buffer: png }, { name: 'b.png', mimeType: 'image/png', buffer: png }]);
  await expect(dialog.getByText('Fotos: 2 von höchstens 30')).toBeVisible({ timeout: 15000 });
  await dialog.getByLabel('Beschriftung von Foto 1').fill('Am Strand');
  await dialog.getByRole('radiogroup', { name: 'Design' }).getByRole('radio').nth(1).click();
  await dialog.getByLabel('Titel des Lernwerkzeugs').fill('Klassenfahrt');
  await page.screenshot({ path: test.info().outputPath('diaschau-dialog.png'), fullPage: true });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const sheet = page.locator('.interaction-surface .lh-wg-slideshow');
  await expect(sheet).toHaveAttribute('aria-label', 'Diaschau „Klassenfahrt“ mit 2 Fotos');
  await expect(page.locator('.interaction-surface .map-title')).toHaveText('Klassenfahrt');
  await page.screenshot({ path: test.info().outputPath('diaschau-seite.png') });
  expect(errors).toEqual([]);
});

test('Animation: Text, zweiter Keyframe, Beispiel, als eigene Seite', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const dialog = await openBlock(page, 'Medien & Präsentation', 'Animation');
  await dialog.getByRole('button', { name: 'Text', exact: true }).first().click();
  await expect(dialog.locator('.an-row .an-name').filter({ hasText: 'Text 1' })).toBeVisible();
  await expect(dialog.locator('.an-key')).toHaveCount(1);
  // Playhead to the middle, then a second keyframe with a different size.
  const ruler = dialog.locator('.an-ruler');
  const box = (await ruler.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await dialog.getByRole('button', { name: 'Keyframe setzen', exact: true }).click();
  await expect(dialog.locator('.an-key')).toHaveCount(2);
  await page.screenshot({ path: test.info().outputPath('animation-dialog.png'), fullPage: true });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const sheet = page.locator('.interaction-surface .lh-wg-anim');
  await expect(sheet).toHaveAttribute('aria-label', /Animation/);
  await page.screenshot({ path: test.info().outputPath('animation-seite.png') });
  expect(errors).toEqual([]);
});

test('Wetter nur über den Schulserver und nur angemeldet', async ({ page }) => {
  expect((await page.request.get('/api/wetter?art=ort&name=Regensburg')).status()).toBe(401);
  await login(page);
  expect((await page.request.get('/api/wetter?art=wetter&latitude=abc&longitude=12')).status()).toBe(400);
  expect((await page.request.get('/api/wetter?art=ort&name=R')).status()).toBe(400);
  expect((await page.request.get('/api/wetter?art=sonst')).status()).toBe(400);
});
