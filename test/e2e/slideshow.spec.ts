import { test, expect, type Page } from '@playwright/test';
import { defaultSettings } from '../../src/lib/learning/catalog';
import { wavBlob } from '../../src/lib/learning/audio';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function create(page: Page) {
  const wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) } as unknown as AudioBuffer).arrayBuffer());
  const audio = await page.request.post('/api/ton', { headers: { ...origin, 'Content-Type': 'audio/wav' }, data: wav }); expect(audio.ok()).toBeTruthy();
  const src = (await audio.json()).src;
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Diaschauprobe', pages: [{ ...newPage(), elements: [{ id: uuid(), type: 'widget', widgetKind: 'slideshow', x: 15, y: 15, width: 180, height: 220, rotation: 0, locked: false, color: '#253c42', settings: { ...defaultSettings('slideshow'), slides: [{ title: 'Erste Folie', text: 'Hallo', seconds: 1, audio: src }, { title: 'Zweite Folie', text: 'Ende', seconds: 1, audio: src }] } }] }] } });
  expect(response.ok()).toBeTruthy(); return response.json();
}
async function fakeAudio(page: Page) {
  await page.addInitScript(() => {
    const sounds: unknown[] = [];
    class SlideSound {
      volume = 1; onended: (() => void) | null = null; onerror: (() => void) | null = null; ontimeupdate: (() => void) | null = null;
      plays = 0; pauses = 0;
      constructor(public src: string) { sounds.push(this); }
      play() { this.plays++; return Promise.resolve(); }
      pause() { this.pauses++; }
    }
    Object.defineProperty(window, 'Audio', { configurable: true, value: SlideSound });
    Object.defineProperty(window, 'slideshowTestSounds', { value: sounds });
  });
}
async function sounds(page: Page) {
  return page.evaluate(() => (window as typeof window & { slideshowTestSounds: { plays: number; pauses: number }[] }).slideshowTestSounds.map(sound => ({ plays: sound.plays, pauses: sound.pauses })));
}
async function end(page: Page, index: number) {
  await page.evaluate(i => (window as typeof window & { slideshowTestSounds: { onended: (() => void) | null }[] }).slideshowTestSounds[i].onended?.(), index);
}
test('Automatik startet den Folienton und wartet vor dem Wechsel auf dessen Ende', async ({ page }) => {
  await fakeAudio(page); await login(page); const data = await create(page); await page.goto(`/heft/${data.book.id}`);
  const game = page.locator('.interaction-surface .slideshow-widget'); expect(await sounds(page)).toHaveLength(0);
  await game.getByRole('button', { name: '▷ Automatisch', exact: true }).click(); expect((await sounds(page))[0].plays).toBe(1);
  await page.waitForTimeout(1200); await expect(game.locator('.slideshow h3')).toHaveText('Erste Folie');
  await end(page, 0); await expect(game.locator('.slideshow h3')).toHaveText('Zweite Folie'); expect((await sounds(page))[1].plays).toBe(1);
  await end(page, 1); await expect(game.locator('.slideshow-status')).toContainText('Diaschau beendet');
  await game.getByRole('button', { name: '▷ Erneut abspielen', exact: true }).click(); await expect(game.locator('.slideshow h3')).toHaveText('Erste Folie');
  await expect.poll(async () => (await sounds(page)).length).toBe(3);
});
test('Pause hält den Ablauf an und manuelles Blättern stoppt den vorherigen Ton', async ({ page }) => {
  await fakeAudio(page); await login(page); const data = await create(page); await page.goto(`/heft/${data.book.id}`);
  const game = page.locator('.interaction-surface .slideshow-widget');
  await game.getByRole('button', { name: '▷ Automatisch', exact: true }).click(); await game.getByRole('button', { name: 'Pause', exact: true }).click();
  expect((await sounds(page))[0].pauses).toBe(1); await page.waitForTimeout(1200); await expect(game.locator('.slideshow h3')).toHaveText('Erste Folie');
  await game.getByRole('button', { name: '▷ Automatisch', exact: true }).click(); expect((await sounds(page))[0].plays).toBe(2);
  await game.getByRole('button', { name: 'Nächste Folie', exact: true }).click(); expect((await sounds(page))[0].pauses).toBe(2);
  await expect.poll(async () => (await sounds(page)).length).toBe(2);
  await game.getByRole('button', { name: 'Zum Anfang', exact: true }).click(); await expect(game.locator('.slideshow-status')).toContainText('Pausiert');
  await expect(game.locator('.slideshow h3')).toHaveText('Erste Folie'); expect(await sounds(page)).toHaveLength(2);
});
test('Kinder können in einer gesperrten Diaschau blättern und die Folienposition erneut öffnen', async ({ page, browser }) => {
  await login(page); const data = await create(page);
  const request = async (action: string, values: object) => { const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } }); expect(response.ok()).toBeTruthy(); return response.json(); };
  let klass = await request('create', { title: 'Diaschauklasse' }); klass = await request('change', { id: klass.id, addChild: 'Nora' });
  const digest = 'b'.repeat(64); await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: data.book.id }), context = await browser.newContext();
  try {
    const child = await context.newPage(); await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`); const game = child.locator('.interaction-surface .slideshow-widget');
    await game.getByRole('button', { name: 'Nächste Folie', exact: true }).click(); await expect(game.locator('.slideshow h3')).toHaveText('Zweite Folie');
    await child.getByRole('button', { name: '‹ Meine Hefte' }).click(); await child.waitForURL(/\/kinder$/); await child.goto(`/kinder/heft/${copies[0].id}`);
    await expect(game.locator('.slideshow h3')).toHaveText('Zweite Folie'); await expect(game.locator('.slideshow-status')).toContainText('Pausiert');
  } finally { await context.close(); }
});
