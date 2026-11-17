import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
// A simulated microphone, so the own recordings really run.
test.use({
  permissions: ['microphone'],
  launchOptions: {
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
  },
});
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Erklärbär: Szenen, Hintergrund, eigene Aufnahme, Vorschau mit Video und Film auf der Seite', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Erklärbär', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Medien & Präsentation · / }).click();
  await dialog.getByRole('button', { name: 'Erklärbär', exact: true }).click();
  // No picture search in the tests (it would need the internet).
  await dialog.getByRole('switch', { name: /Bilder automatisch suchen/ }).uncheck();
  await expect(dialog.getByRole('radio', { name: /^Erklärbär/ })).toHaveAttribute('aria-checked', 'true');
  await expect(dialog.getByRole('group', { name: 'Lernwörter wählen' }).getByText('Bildwörter – antippen zum Wählen')).toBeVisible();
  // Kinder-Hilfen of the other exercises do not apply to a film.
  await expect(dialog.getByRole('heading', { name: 'Hilfen für die Kinder' })).toHaveCount(0);

  // Pictures for two picture words; the blank line of the example makes two scenes.
  for (const [word, file] of [['igel', '2246'], ['käfer', '2294']])
    await dialog.getByLabel(`Bild für ${word} wählen`).setInputFiles(`public/bilder/${file}.webp`);
  const scenes = dialog.getByRole('list', { name: 'Szenen des Films' });
  await expect(scenes.getByRole('listitem')).toHaveCount(2);
  await expect(dialog.getByText('Der Film hat 2 Szenen.', { exact: false })).toBeVisible();
  await expect(scenes.getByRole('listitem').first().locator('img')).toHaveCount(2);

  // Look: background and hand.
  const backs = dialog.getByRole('radiogroup', { name: 'Hintergrund', exact: true });
  await expect(backs.getByRole('radio')).toHaveCount(18);
  await backs.getByRole('radio', { name: 'Nacht' }).click();
  await expect(backs.getByRole('radio', { name: 'Nacht' })).toHaveAttribute('aria-checked', 'true');
  await expect(backs.locator('img').first()).toHaveJSProperty('complete', true);
  await dialog.getByRole('radiogroup', { name: 'Hautfarbe der Hand' }).getByRole('radio', { name: /Dunkel/ }).click();
  await scenes.scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath('erklaerbaer-szenen.png') });

  // Own recordings: one per sentence.
  await dialog.getByRole('radiogroup', { name: 'Stimme' }).getByRole('radio', { name: /Eigene Aufnahmen/ }).click();
  const recordings = dialog.locator('.ex-recordings li');
  await expect(recordings).toHaveCount(4);
  await expect(dialog.getByText('Noch 4 Sätze ohne Aufnahme', { exact: false })).toBeVisible();
  await recordings.first().getByRole('button', { name: /Aufnehmen/ }).click();
  await page.waitForTimeout(1200);
  await recordings.first().getByRole('button', { name: /Stopp/ }).click();
  await expect(recordings.first().getByRole('button', { name: /Anhören/ })).toBeVisible();
  await expect(dialog.getByText('Noch 3 Sätze ohne Aufnahme', { exact: false })).toBeVisible();

  // Music of the player itself.
  await dialog.getByRole('radiogroup', { name: 'Hintergrundmusik' }).getByRole('radio', { name: /Ruhig/ }).click();
  await expect(dialog.getByRole('slider', { name: 'Lautstärke der Musik' })).toBeVisible();

  // Preview in the dialog: the film with the recording, and the video button.
  const preview = dialog.frameLocator('.ex-preview iframe');
  await expect(preview.locator('canvas.tsp-ex-canvas')).toBeVisible();
  const task = await preview.locator('#lh-data').evaluate((el) => JSON.parse(el.textContent || '{}'));
  expect(task.mode).toBe('explain');
  expect(task.settings.explain).toMatchObject({ design: 'night', hand: 'dark', voice: 'rec', music: 'calm' });
  const voiceId = task.voice['der igel sucht im herbst viel futter'];
  expect(task.assets[voiceId].dataUrl).toMatch(/^data:audio\//);
  await dialog.getByRole('button', { name: 'Als Video speichern' }).click();
  await expect(dialog.getByText('Der Film läuft einmal durch und wird aufgenommen.', { exact: false })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('erklaerbaer-dialog.png'), fullPage: true });

  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const film = page.frameLocator('.interaction-surface .textsachen-frame.is-live iframe');
  await expect(film.locator('canvas.tsp-ex-canvas')).toBeVisible();
  await expect(film.getByRole('button', { name: /Abspielen/ })).toBeVisible();
  // On the page there is no video button (as in Lernsachen-Heft).
  await expect(page.locator('.interaction-surface').getByRole('button', { name: 'Als Video speichern' })).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath('erklaerbaer-seite.png') });

  // Saved: after reloading, the recording is still part of the film.
  await page.waitForTimeout(1500);
  await page.reload();
  const again = await page.frameLocator('.interaction-surface .textsachen-frame.is-live iframe').locator('#lh-data').evaluate((el) => JSON.parse(el.textContent || '{}'));
  expect(Object.keys(again.voice)).toEqual(['der igel sucht im herbst viel futter']);
  expect(again.title).toBe('Der Igel');
  expect(errors).toEqual([]);
});
