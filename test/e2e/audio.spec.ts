import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid } from '../../src/lib/notebook-model';
import { defaultSettings } from '../../src/lib/learning/catalog';
const origin = { Origin: 'http://localhost:3100' };
// A simulated microphone, so recording really runs.
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
function wav(seconds = 1) {
  const rate = 8000, n = rate * seconds, b = Buffer.alloc(44 + n * 2);
  b.write('RIFF'); b.writeUInt32LE(b.length - 8, 4); b.write('WAVE', 8); b.write('fmt ', 12); b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(Math.sin((i / rate) * 440 * 2 * Math.PI) * 4000), 44 + i * 2);
  return { name: 'ton.wav', mimeType: 'audio/wav', buffer: b };
}

test('Ton: Aufnehmen ist vorausgewählt, Hochladen, Platzhalter und Kassettenrekorder', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Tonprobe' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const surface = page.locator('.interaction-surface');
  const open = async () => {
    await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Ton', exact: true }).click();
    return page.getByRole('dialog', { name: 'Ton hinzufügen' });
  };
  let dialog = await open();
  const tabs = dialog.getByRole('navigation', { name: 'Art des Tons' }).getByRole('button');
  await expect(tabs).toHaveText([/Aufnehmen/, /Hochladen/, /Platzhalter/, /Kassettenrekorder/]);
  await expect(tabs.first()).toHaveAttribute('aria-pressed', 'true');

  // Record with the (simulated) microphone, listen, name it, keep it.
  await dialog.getByRole('button', { name: 'Aufnahme starten' }).click();
  await expect(dialog.getByRole('timer')).toContainText('0:01', { timeout: 5000 });
  await dialog.getByRole('button', { name: 'Aufnahme beenden' }).click();
  await expect(dialog.getByLabel('Vorschau anhören')).toBeVisible();
  await dialog.getByLabel('Name').fill('Begrüßung');
  await dialog.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(surface.locator('.audio-content')).toContainText('Begrüßung');

  dialog = await open();
  await dialog.getByRole('button', { name: 'Hochladen', exact: true }).click();
  await dialog.getByLabel('Tondatei auswählen').setInputFiles(wav());
  await expect(dialog.getByLabel('Name')).toHaveValue('ton');
  await dialog.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(surface.locator('.audio-content')).toHaveCount(2);

  dialog = await open();
  await dialog.getByRole('button', { name: 'Platzhalter', exact: true }).click();
  await dialog.getByLabel('Aufgabe auf dem Knopf').fill('Lies das Wort vor.');
  await dialog.getByRole('button', { name: 'Platzhalter einfügen' }).click();
  await expect(surface.locator('.audio-placeholder')).toHaveText('Lies das Wort vor.');

  dialog = await open();
  await dialog.getByRole('button', { name: 'Kassettenrekorder', exact: true }).click();
  await dialog.getByRole('button', { name: 'Kassettenrekorder einfügen' }).click();
  const recorder = surface.locator('.cassette-recorder');
  await expect(recorder).toContainText('Noch keine Aufnahme');
  await recorder.getByRole('button', { name: /Aufnehmen/ }).click();
  const record = page.getByRole('dialog', { name: 'Aufnehmen' });
  await expect(record.getByRole('navigation', { name: 'Art des Tons' }).getByRole('button')).toHaveText([/Aufnehmen/, /Hochladen/]);
  await record.getByRole('button', { name: 'Hochladen', exact: true }).click();
  await record.getByLabel('Tondatei auswählen').setInputFiles(wav(2));
  await record.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(recorder.locator('.cassette-time')).toHaveText('0:00 / 0:02');
  await expect(recorder.getByRole('button', { name: /Abspielen/ })).toBeEnabled();
  await expect(recorder.getByRole('link', { name: /Speichern/ })).toHaveAttribute('href', /^\/api\/medien\//);
});

test('Kinder sprechen in gesperrte Ton-Platzhalter und Rekorder, auch ohne Ton-Erlaubnis', async ({ page, browser }) => {
  await login(page);
  const button = { id: uuid(), type: 'audio', x: 20, y: 30, width: 95, height: 20, rotation: 0, locked: true, color: '#253c42', placeholder: 'Lies das Wort vor.', alt: '' };
  const tape = { id: uuid(), type: 'widget', widgetKind: 'recorder', x: 20, y: 70, width: 100, height: 92, rotation: 0, locked: true, color: '#253c42', settings: defaultSettings('recorder') };
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Sprechauftrag', pages: [{ ...newPage(), elements: [button, tape] }] } })).json();
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Sprechklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Ben' });
  const card = Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
  await request('change', { id: klass.id, childId: klass.children[0].id, digest: card });
  const copies = await request('distribute', { id: klass.id, bookId: created.book.id });
  const book = copies.find((b: { ownerId: string }) => b.ownerId === klass.children[0].id).id;

  const context = await browser.newContext({ permissions: ['microphone'] });
  const child = await context.newPage();
  await child.goto('/kinder');
  expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest: card } })).ok()).toBeTruthy();
  await child.goto(`/kinder/heft/${book}`);
  // No free recording …
  expect((await child.request.post(`/api/ton?book=${book}`, { headers: { ...origin, 'Content-Type': 'audio/wav' }, data: wav().buffer })).status()).toBe(403);
  // … but the teacher's sound button takes one.
  await child.locator('.interaction-surface .audio-placeholder').click();
  const record = child.getByRole('dialog', { name: 'Aufnehmen' });
  await expect(record.getByRole('navigation', { name: 'Art des Tons' }).getByRole('button').first()).toHaveAttribute('aria-pressed', 'true');
  await record.getByRole('button', { name: 'Aufnahme starten' }).click();
  await expect(record.getByRole('timer')).toContainText('0:01', { timeout: 5000 });
  await record.getByRole('button', { name: 'Aufnahme beenden' }).click();
  await record.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(child.locator('.interaction-surface .audio-content')).toHaveCount(1);
  // So does the recorder.
  await child.locator('.interaction-surface .cassette-recorder').getByRole('button', { name: /Aufnehmen/ }).click();
  await record.getByRole('button', { name: 'Hochladen', exact: true }).click();
  await record.getByLabel('Tondatei auswählen').setInputFiles(wav());
  await record.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(child.locator('.interaction-surface .cassette-time')).toHaveText('0:00 / 0:01');
  await expect.poll(async () => {
    const data = await (await child.request.post('/api/kinder', { headers: origin, data: { action: 'open', id: book } })).json();
    const [sound, recorder] = data.pages[0].elements;
    return [!!sound.src, !!recorder.response?.recordingSrc];
  }, { timeout: 15000 }).toEqual([true, true]);
  await context.close();
});
