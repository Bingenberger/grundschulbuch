import { test, expect, type Page } from '@playwright/test';
import { defaultSettings } from '../../src/lib/learning/catalog';
import { wavBlob } from '../../src/lib/learning/audio';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function create(page: Page, music = true) {
  let src: string | undefined;
  if (music) {
    const wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) } as unknown as AudioBuffer).arrayBuffer());
    const response = await page.request.post('/api/ton', { headers: { ...origin, 'Content-Type': 'audio/wav' }, data: wav }); expect(response.ok()).toBeTruthy(); src = (await response.json()).src;
  }
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Liedprobe', pages: [{ ...newPage(), elements: [{ id: uuid(), type: 'widget', widgetKind: 'karaoke', x: 15, y: 15, width: 180, height: 240, rotation: 0, locked: false, color: '#253c42', settings: { ...defaultSettings('karaoke'), text: 'Erste Zeile\nZweite Zeile\nLetzte Zeile', karaokeTimes: [2, 6, 10], tracks: src ? [{ title: 'Musik', src, volume: 1 }] : [] } }] }] } });
  expect(response.ok()).toBeTruthy(); return response.json();
}
async function fakeMedia(page: Page) {
  await page.addInitScript(() => {
    const times = new WeakMap<HTMLMediaElement, number>();
    Object.defineProperties(HTMLMediaElement.prototype, {
      currentTime: { configurable: true, get() { return times.get(this) || 0; }, set(value: number) { times.set(this, value); this.dispatchEvent(new Event('seeking')); this.dispatchEvent(new Event('seeked')); this.dispatchEvent(new Event('timeupdate')); } },
      duration: { configurable: true, get() { return 20; } },
      ended: { configurable: true, get() { return (times.get(this) || 0) >= 20; } },
      play: { configurable: true, value() { this.dispatchEvent(new Event('play')); return Promise.resolve(); } },
      pause: { configurable: true, value() { this.dispatchEvent(new Event('pause')); } },
    });
  });
}
test('Karaoke folgt der Medienzeit, pausiert gemeinsam und springt beim Vor- und Rückspulen', async ({ page }) => {
  await fakeMedia(page); await login(page); const data = await create(page); await page.goto(`/heft/${data.book.id}`);
  const game = page.locator('.interaction-surface .karaoke-widget'), sound = game.locator('.karaoke-backing');
  await expect(game.locator('.karaoke-lines .active')).toHaveCount(0);
  await game.getByRole('button', { name: '▷ Lied starten', exact: true }).click();
  await sound.evaluate((element: HTMLAudioElement) => { element.currentTime = 7; });
  await expect(game.locator('.karaoke-lines .active')).toHaveText('Zweite Zeile');
  // Wall-clock time must not advance the text while the media position stays fixed.
  await page.waitForTimeout(500); await expect(game.locator('.karaoke-lines .active')).toHaveText('Zweite Zeile');
  await game.getByRole('button', { name: 'Pause', exact: true }).click(); await expect(game.locator('.karaoke-position')).toContainText('Pausiert');
  await game.getByRole('button', { name: 'Zeile 3,', exact: false }).click(); await expect(sound).toHaveJSProperty('currentTime', 10);
  await expect(game.locator('.karaoke-lines .active')).toHaveText('Letzte Zeile');
  await sound.evaluate((element: HTMLAudioElement) => { element.currentTime = 1; }); await expect(game.locator('.karaoke-lines .active')).toHaveCount(0);
  await sound.evaluate((element: HTMLAudioElement) => { element.currentTime = 20; element.dispatchEvent(new Event('ended')); });
  await expect(game.locator('.karaoke-position')).toContainText('Lied beendet'); await expect(game.locator('.karaoke-lines .active')).toHaveCount(0);
});
test('LRC-Import zeigt eine Vorschau, ersetzt erst bei Übernahme und lässt sich wieder exportieren', async ({ page }) => {
  await login(page); const data = await create(page, false); await page.goto(`/heft/${data.book.id}`);
  // The old “Karaoke & Liedblatt” is no longer offered (see music-settings.spec for the new one);
  // existing ones are still edited with these settings: select it, Enter.
  await expect(page.locator('.interaction-surface .karaoke-widget')).toHaveCount(1);
  await page.locator('.interaction-surface').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('ControlOrMeta+a'); await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeug gestalten' });
  const text = dialog.getByLabel('Liedtext', { exact: true }), previous = await text.inputValue();
  await dialog.getByLabel('LRC-Datei laden', { exact: true }).setInputFiles({ name: 'lied.lrc', mimeType: 'text/plain', buffer: Buffer.from('[00:02.125]Hallo\n[00:04.500]\n[00:06.750]Welt') });
  await expect(dialog.locator('.karaoke-import-preview')).toBeVisible(); await expect(text).toHaveValue(previous);
  await dialog.getByRole('button', { name: 'Liedtext und Zeiten übernehmen', exact: true }).click(); await expect(text).toHaveValue('Hallo\n\nWelt');
  const downloadReady = page.waitForEvent('download'); await dialog.getByRole('button', { name: 'Als LRC speichern', exact: true }).click();
  const stream = await (await downloadReady).createReadStream(), chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  expect(Buffer.concat(chunks).toString()).toBe('[00:02.125]Hallo\n[00:04.500]\n[00:06.750]Welt');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click(); await expect(dialog).toHaveCount(0);
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert'); await page.reload(); await expect(page.locator('.interaction-surface .karaoke-widget')).toHaveCount(1);
});
test('Textbegleitung ohne Musik endet und startet nach Pause an derselben Position weiter', async ({ page }) => {
  await login(page); const data = await create(page, false); await page.goto(`/heft/${data.book.id}`);
  const game = page.locator('.interaction-surface .karaoke-widget');
  await game.getByRole('button', { name: 'Zeile 3,', exact: false }).click(); await expect(game.getByLabel('Abspielzeit')).toHaveText('00:10.000');
  await game.getByRole('button', { name: '▷ Lied starten', exact: true }).click(); await expect(game.getByLabel('Abspielzeit')).not.toHaveText('00:10.000');
  await game.getByRole('button', { name: 'Pause', exact: true }).click(); const paused = await game.getByLabel('Abspielzeit').textContent();
  await page.waitForTimeout(200); await expect(game.getByLabel('Abspielzeit')).toHaveText(paused!);
  await game.getByRole('button', { name: '▷ Lied starten', exact: true }).click(); await expect(game.locator('.karaoke-position')).toContainText('Lied beendet', { timeout: 5000 });
  await game.getByRole('button', { name: 'Zum Anfang', exact: true }).click(); await expect(game.getByLabel('Abspielzeit')).toHaveText('00:00.000');
});
