import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
// Eigene Aufnahmen wie in Lernsachen-Heft 1.49.0: Figur (mit Bewegung beim
// Antippen), Sprechendes Foto und die Laute der Anlaut-Tastatur.
const origin = { Origin: 'http://localhost:3100' };
test.use({
  permissions: ['microphone'],
  launchOptions: {
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'],
  },
});
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function fresh(page: Page, title: string) {
  const { book } = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title, pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${book.id}`);
  return book.id as string;
}
async function openBlock(page: Page, subject: string, title: string) {
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: new RegExp(`^${subject} · `) }).click();
  await dialog.getByRole('button', { name: title, exact: true }).click();
  return dialog;
}
type El = { widgetKind?: string; settings?: Record<string, unknown> };
const elements = async (page: Page, id: string): Promise<El[]> => (await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id } })).json()).pages.flatMap((p: { elements: El[] }) => p.elements);
function wav(seconds = 1) {
  const rate = 8000, n = rate * seconds, b = Buffer.alloc(44 + n * 2);
  b.write('RIFF'); b.writeUInt32LE(b.length - 8, 4); b.write('WAVE', 8); b.write('fmt ', 12); b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(Math.sin((i / rate) * 440 * 2 * Math.PI) * 4000), 44 + i * 2);
  return { name: 'gruss.wav', mimeType: 'audio/wav', buffer: b };
}
/** Remembers what is played, so a tap can be checked. */
const listenToPlayback = (page: Page) => page.addInitScript(() => {
  const played: string[] = ((window as unknown as { played: string[] }).played = []);
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) { played.push(this.currentSrc || this.src); return play.call(this); };
});

test('Figur: eigene Aufnahme statt Computerstimme und Bewegung beim Antippen', async ({ page }) => {
  await listenToPlayback(page);
  await login(page);
  const id = await fresh(page, 'Figur mit Aufnahme');
  const dialog = await openBlock(page, 'Für alle Fächer', 'Figur');
  await dialog.getByLabel('Name', { exact: true }).fill('Mia');
  await expect(dialog.getByText('Ohne eigene Aufnahme spricht die Computerstimme.')).toBeVisible();
  await dialog.getByRole('button', { name: 'Eigene Aufnahme …', exact: true }).click();
  const audio = page.locator('.audio-dialog');
  await audio.getByRole('button', { name: 'Hochladen', exact: true }).click();
  await audio.getByLabel('Tondatei auswählen').setInputFiles(wav());
  await audio.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(audio).toHaveCount(0);
  await expect(dialog.getByText('Mit eigener Aufnahme spricht die Aufnahme – der Text ist dann nur noch die Beschreibung.')).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Aufnahme ändern …' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Tanzen', exact: true }).click();
  await page.screenshot({ path: test.info().outputPath('figur-aufnahme.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const figure = (await elements(page, id)).find((e) => e.widgetKind === 'figur')!.settings as { say: { audio?: string }; move?: string };
  expect(figure.say.audio).toMatch(/^\/api\/medien\/[a-f0-9]{64}\./);
  expect(figure.move).toBe('dance');
  // At the board the tap plays the recording.
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Tafelmodus' }).click();
  await page.locator('.lh-wg-avatar:visible').first().click({ force: true });
  await expect.poll(() => page.evaluate(() => (window as unknown as { played: string[] }).played.join(' '))).toContain(figure.say.audio!);
});

test('Anlaut-Tastatur: Laute selbst einsprechen, löschen bringt den mitgelieferten zurück', async ({ page }) => {
  await login(page);
  const id = await fresh(page, 'Eigene Laute');
  const dialog = await openBlock(page, 'Deutsch', 'Anlaut-Tastatur');
  await dialog.getByRole('tab', { name: 'Laute', exact: true }).click();
  await expect(dialog.getByText(/Sprich jeden Laut einmal ein/)).toBeVisible();
  const row = dialog.locator('.anlaut-sounds li').first();
  await expect(row).toContainText('Lang und deutlich sprechen');
  await expect(row).toContainText('mitgeliefert');
  await expect(row.getByRole('button', { name: /löschen/ })).toBeDisabled();
  await row.getByRole('button', { name: 'Aufnehmen', exact: true }).click();
  await expect(row.getByRole('button', { name: 'Stopp', exact: true })).toBeVisible();
  // Ends by itself after three seconds and is stored.
  await expect(row.getByRole('button', { name: 'Neu', exact: true })).toBeVisible({ timeout: 10000 });
  await expect(row).not.toContainText('mitgeliefert');
  await expect(row.getByRole('button', { name: /löschen/ })).toBeEnabled();
  await page.screenshot({ path: test.info().outputPath('anlaut-laute.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const anlaut = JSON.stringify((await elements(page, id)).find((e) => e.widgetKind === 'anlaut')!.settings);
  expect(anlaut).toMatch(/\/api\/medien\/[a-f0-9]{64}\./);
});
