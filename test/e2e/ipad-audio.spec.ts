import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
import { musicPresets, musicSettings, musicPage } from '../../src/lib/learning/music';
// Aufnahmen, die auf dem iPad versagten: Instrumente in den Kassettenrekorder,
// Puppentheater mit Mikrofon und Wiedergabe vom Schulserver.
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

test('Kassettenrekorder nimmt Instrumente als WAV auf, ohne Mikrofon', async ({ page }) => {
  await page.addInitScript(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    (window as unknown as { micRequests: number }).micRequests = 0;
    navigator.mediaDevices.getUserMedia = async (c) => { (window as unknown as { micRequests: number }).micRequests++; return original(c); };
    // Like the iPad: MediaRecorder must not be needed for sound from the instruments.
    (window as unknown as { MediaRecorder?: unknown }).MediaRecorder = undefined;
  });
  await login(page);
  const preset = musicPresets.find((p) => p.id === 'inst-piano')!;
  const { book } = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Klavier', pages: musicPage(musicSettings(preset)) } })).json();
  await page.goto(`/heft/${book.id}`);
  const stage = page.locator('.interaction-surface .music-template');
  await stage.getByRole('button', { name: 'Aufnehmen', exact: true }).click();
  await expect(stage.getByRole('button', { name: 'Fertig', exact: true })).toBeVisible();
  await page.waitForTimeout(300);
  for (const key of [0, 2, 4]) { await stage.locator('.lh-wg-piano .lh-key').nth(key).click(); await page.waitForTimeout(250); }
  await page.waitForTimeout(500);
  await stage.getByRole('button', { name: 'Fertig', exact: true }).click();
  const saved = stage.getByRole('link', { name: 'Speichern', exact: true });
  await expect(saved).toBeVisible();
  const src = (await saved.getAttribute('href'))!;
  expect(src).toMatch(/^\/api\/medien\/[a-f0-9]{64}\.wav$/);
  const measured = await page.evaluate(async (url) => {
    const context = new AudioContext(), buffer = await context.decodeAudioData(await (await fetch(url)).arrayBuffer());
    const peak = buffer.getChannelData(0).reduce((m, n) => Math.max(m, Math.abs(n)), 0);
    await context.close();
    return { peak, seconds: buffer.duration, mic: (window as unknown as { micRequests: number }).micRequests };
  }, src);
  expect(measured.mic).toBe(0);
  expect(measured.peak).toBeGreaterThan(0.01);
  expect(measured.seconds).toBeGreaterThan(1);
});

test('Puppentheater: Aufnahme mit Mikrofon wird als WAV gespeichert und vom Server ganz abgespielt', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Theater', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Medien & Präsentation · / }).click();
  await dialog.getByRole('button', { name: 'Puppentheater', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const stage = page.locator('.interaction-surface .lh-wg-theater');
  await expect(stage.locator('.lh-th')).toBeVisible();

  const uploads: string[] = [];
  page.on('request', (r) => { if (r.url().includes('/api/ton')) uploads.push(r.headers()['content-type'] || ''); });
  await stage.locator('[data-a="rec"]').first().click();
  // Countdown 3-2-1, then about two seconds of the simulated microphone (a beep).
  await page.waitForTimeout(2400 + 2200);
  await stage.locator('[data-a="stop"]').first().click();
  await expect.poll(() => uploads.length, { timeout: 10000 }).toBe(1);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const sound = await page.evaluate(async (id) => {
    const book = await (await fetch('/api/werkstatt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'open', id }) })).json();
    const el = book.pages.flatMap((p: { elements: { widgetKind?: string; response?: { theater?: { take?: { sound?: string; dur?: number } } } }[] }) => p.elements).find((e: { widgetKind?: string }) => e.widgetKind === 'puppentheater');
    return el?.response?.theater?.take as { sound: string; dur: number };
  }, created.book.id);
  expect(sound.sound).toMatch(/\.wav$/);
  expect(sound.dur).toBeGreaterThan(1500);

  // Playing: it runs through instead of stopping at once.
  await stage.locator('[data-a="play"]').first().click();
  await expect(stage.locator('.lh-th')).toHaveClass(/is-playing/);
  await page.waitForTimeout(1200);
  await expect(stage.locator('.lh-th')).toHaveClass(/is-playing/);
  await expect(stage.locator('.lh-th')).not.toHaveClass(/is-playing/, { timeout: 5000 });
  expect(errors).toEqual([]);
});

test('Töne werden in Teilstücken geliefert, wie Safari sie anfragt', async ({ page }) => {
  await login(page);
  const wav = Buffer.alloc(44 + 8000);
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + 8000, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(16000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(8000, 40);
  const { src } = await (await page.request.post('/api/ton', { headers: { ...origin, 'Content-Type': 'audio/wav' }, data: wav })).json();
  const whole = await page.request.get(src);
  expect(whole.status()).toBe(200);
  expect(whole.headers()['accept-ranges']).toBe('bytes');
  const probe = await page.request.get(src, { headers: { Range: 'bytes=0-1' } });
  expect(probe.status()).toBe(206);
  expect(probe.headers()['content-range']).toBe(`bytes 0-1/${wav.length}`);
  expect((await probe.body()).toString()).toBe('RI');
  const tail = await page.request.get(src, { headers: { Range: 'bytes=-4' } });
  expect(tail.status()).toBe(206);
  expect((await tail.body()).length).toBe(4);
  expect((await page.request.get(src, { headers: { Range: `bytes=${wav.length}-` } })).status()).toBe(416);
});
