import { test, expect, type Page } from '@playwright/test';
import { defaultSettings, type ActivityKind, type LearningSettings } from '../../src/lib/learning/catalog';
import { memoryDeck } from '../../src/lib/learning/media-activity';
import { wavBlob } from '../../src/lib/learning/audio';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function assets(page: Page) {
  const image = await page.request.post('/api/medien', { headers: { ...origin, 'Content-Type': 'image/png' }, data: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=', 'base64') });
  expect(image.ok()).toBeTruthy();
  const wav = Buffer.from(await wavBlob({ length: 8, numberOfChannels: 1, sampleRate: 8000, getChannelData: () => new Float32Array(8) } as unknown as AudioBuffer).arrayBuffer());
  const audio = await page.request.post('/api/ton', { headers: { ...origin, 'Content-Type': 'audio/wav' }, data: wav }); expect(audio.ok()).toBeTruthy();
  return { image: (await image.json()).src as string, audio: (await audio.json()).src as string };
}
async function create(page: Page, kind: ActivityKind, settings: Partial<LearningSettings>) {
  const config = { ...defaultSettings(kind), ...settings };
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Medienprobe', pages: [{ ...newPage(), elements: [{ id: uuid(), type: 'activity', activityKind: kind, x: 10, y: 10, width: 190, height: 260, rotation: 0, locked: false, color: '#253c42', settings: config }] }] } });
  expect(response.ok()).toBeTruthy(); return { data: await response.json(), config };
}
async function fakeAudio(page: Page, duration = 80) {
  await page.addInitScript(delay => {
    const played: string[] = [];
    Object.defineProperty(window, 'taskAudioPlayed', { value: played });
    class TestAudio {
      volume = 1; onended: (() => void) | null = null; onerror: (() => void) | null = null; timer: number | null = null;
      constructor(public src: string) {}
      play() { played.push(this.src); this.timer = window.setTimeout(() => this.onended?.(), delay); return Promise.resolve(); }
      pause() { if (this.timer !== null) clearTimeout(this.timer); }
    }
    Object.defineProperty(window, 'Audio', { configurable: true, value: TestAudio });
  }, duration);
}

test('Quiz-Tonvorschau wählt keine Antwort; Bildantwort und Prüfung bleiben nach Neuladen erhalten', async ({ page }) => {
  await fakeAudio(page); await login(page); const media = await assets(page);
  const { data } = await create(page, 'quiz', { questions: [{ text: 'Wähle das Bild', media: { audio: media.audio }, answers: ['Bild', 'Ton'], answerMedia: [{ image: media.image, hideText: true }, { audio: media.audio, hideText: true }], correct: 0 }] });
  await page.goto(`/heft/${data.book.id}`);
  const widget = page.locator('.interaction-surface .media-activity');
  await widget.getByRole('button', { name: 'Antwort B anhören', exact: true }).click();
  await expect(widget.getByRole('button', { name: 'Antwort B: Ton', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(widget.getByRole('button', { name: 'Prüfen', exact: true })).toBeDisabled();
  await widget.getByRole('button', { name: 'Antwort A: Bild', exact: true }).click();
  await widget.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(widget.getByText('✓ Richtig!', { exact: true })).toBeVisible();
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  await page.reload(); await expect(widget.getByText('✓ Richtig!', { exact: true })).toBeVisible();
});

test('Zuordnungen unterstützen Ziehen, Tastatur und das Verschieben schon zugeordneter Karten', async ({ page }) => {
  await fakeAudio(page); await login(page); const media = await assets(page);
  const { data } = await create(page, 'matching', { pairs: [{ left: 'Bild', right: 'Bildkarte', leftMedia: { image: media.image } }, { left: 'Ton', right: 'Tonkarte', rightMedia: { audio: media.audio } }] });
  await page.goto(`/heft/${data.book.id}`);
  const widget = page.locator('.interaction-surface .media-activity');
  const source = widget.getByRole('button', { name: 'Karte 1 auswählen', exact: true }), target = widget.getByRole('button', { name: 'Zuordnungsplatz 1', exact: true });
  const a = (await source.boundingBox())!, b = (await target.boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 }); await page.mouse.up();
  await expect(target).toContainText('Bildkarte'); await expect(page.locator('.matching-ghost')).toHaveCount(0);
  await widget.getByRole('button', { name: 'Karte 2 auswählen', exact: true }).focus(); await page.keyboard.press('Enter');
  const second = widget.getByRole('button', { name: 'Zuordnungsplatz 2', exact: true });
  await second.focus(); await page.keyboard.press('Enter');
  await widget.getByRole('button', { name: 'Zuordnungen prüfen', exact: true }).click();
  await expect(widget.getByText('Geschafft! Alle Paare passen.', { exact: true })).toBeVisible();
  const c = (await target.boundingBox())!, d = (await second.boundingBox())!;
  await page.mouse.move(c.x + c.width / 2, c.y + c.height / 2); await page.mouse.down(); await page.mouse.move(d.x + d.width / 2, d.y + d.height / 2, { steps: 12 }); await page.mouse.up();
  await expect(target).toHaveText('Hier ablegen'); await expect(second).toContainText('Bildkarte');
  await expect(widget.getByRole('group', { name: 'Zuordnungskarten', exact: true }).getByRole('button', { name: 'Karte 2 auswählen', exact: true })).toBeVisible();
});

test('Memory verdeckt Tonkarten erst nach Wiedergabe und Wartezeit', async ({ page }) => {
  await fakeAudio(page, 2000); await login(page); const media = await assets(page);
  const { data, config } = await create(page, 'memory', { pairs: [{ left: 'Bild A', right: 'Ton A', leftMedia: { image: media.image }, rightMedia: { audio: media.audio } }, { left: 'Bild B', right: 'Ton B', leftMedia: { image: media.image }, rightMedia: { audio: media.audio } }] });
  await page.goto(`/heft/${data.book.id}`);
  const widget = page.locator('.interaction-surface .media-activity'), deck = memoryDeck(config);
  const first = deck.findIndex(card => card.pair === 0 && card.side === 'right'), second = deck.findIndex(card => card.pair === 1 && card.side === 'right');
  await widget.getByRole('button', { name: `Karte ${first + 1} aufdecken`, exact: true }).click();
  await widget.getByRole('button', { name: `Karte ${second + 1} aufdecken`, exact: true }).click();
  await page.waitForTimeout(1100);
  await expect(widget.getByRole('button', { name: /^Aufgedeckte Karte/ })).toHaveCount(2);
  await expect(widget.getByRole('button', { name: /^Aufgedeckte Karte/ })).toHaveCount(0, { timeout: 5000 });
  await expect(widget.getByRole('status')).toContainText('1 Spielzüge');
});

test('Kinder können Medienantworten in gesperrten Quizaufgaben speichern', async ({ page, browser }) => {
  await login(page); const media = await assets(page);
  const { data } = await create(page, 'quiz', { questions: [{ text: 'Bild wählen', answers: ['Bild', 'Anders'], answerMedia: [{ image: media.image, hideText: true }], correct: 0 }] });
  const request = async (action: string, values: object) => { const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } }); expect(response.ok()).toBeTruthy(); return response.json(); };
  let klass = await request('create', { title: 'Medienklasse' }); klass = await request('change', { id: klass.id, addChild: 'Nora' });
  const digest = '6'.repeat(64); await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: data.book.id }), context = await browser.newContext();
  try {
    const child = await context.newPage(); await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    const widget = child.locator('.interaction-surface .media-activity');
    await widget.getByRole('button', { name: 'Antwort A: Bild', exact: true }).click(); await widget.getByRole('button', { name: 'Prüfen', exact: true }).click();
    await expect(widget.getByText('✓ Richtig!', { exact: true })).toBeVisible();
    await child.getByRole('button', { name: '‹ Meine Hefte' }).click(); await child.goto(`/kinder/heft/${copies[0].id}`);
    await expect(widget.getByText('✓ Richtig!', { exact: true })).toBeVisible();
  } finally { await context.close(); }
});
