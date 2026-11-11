import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid } from '../../src/lib/notebook-model';
import { defaultSettings, type LearningSettings } from '../../src/lib/learning/catalog';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function create(page: Page, settings: Partial<LearningSettings> = {}) {
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Klatschprobe', pages: [{ ...newPage(), elements: [{
    id: uuid(), type: 'widget', widgetKind: 'clapping', x: 15, y: 15, width: 180, height: 230, rotation: 0, locked: false, color: '#253c42',
    settings: { ...defaultSettings('clapping'), words: ['Son-ne', 'Blu-me'], clappingHelp: 'both', ...settings },
  }] }] } });
  expect(response.ok()).toBeTruthy(); return response.json();
}

test('Silbenklatschen prüft eine endliche Serie und erhält Ergebnis und Wortbilder beim Wiederöffnen', async ({ page }) => {
  await login(page); const data = await create(page); await page.goto(`/heft/${data.book.id}`);
  const widget = page.locator('.interaction-surface .clapping-widget');
  await expect(widget.locator('.clapping-syllable')).toHaveCount(2);
  const clap = widget.getByRole('button', { name: 'Eine Silbe klatschen', exact: true });
  await clap.click(); await widget.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(widget.locator('.clapping-feedback')).toContainText('Noch nicht passend');
  await widget.getByRole('button', { name: 'Neu klatschen', exact: true }).click();
  await clap.click(); await clap.click(); await widget.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(widget.getByText('★ Genau richtig!', { exact: true })).toBeVisible();
  await widget.getByRole('button', { name: 'Weiter', exact: true }).click();
  await expect(widget.locator('.clapping-progress')).toContainText('Wort 2 von 2');
  await clap.click(); await clap.click(); await widget.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await widget.getByRole('button', { name: 'Weiter', exact: true }).click();
  await expect(widget.getByRole('heading', { name: 'Geschafft!', exact: true })).toBeVisible();
  await expect(widget.locator('.clapping-certificate')).toContainText('2 von 2 Wörtern richtig geklatscht.');
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  await page.reload(); await expect(widget.getByRole('heading', { name: 'Geschafft!', exact: true })).toBeVisible();
  await widget.getByRole('button', { name: 'Nochmal', exact: true }).click();
  await expect(widget.locator('.clapping-count')).toHaveText('0 Klatscher');
});

test('Vorführung ist abbrechbar; eine verweigerte Mikrofonberechtigung blockiert die Klatschtaste nicht', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => [], cancel() {}, addEventListener() {}, removeEventListener() {} } });
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: async () => { throw new DOMException('denied', 'NotAllowedError'); } } });
  });
  await login(page); const data = await create(page, { words: ['Son-ne'], clappingHelp: 'none' }); await page.goto(`/heft/${data.book.id}`);
  const widget = page.locator('.interaction-surface .clapping-widget');
  await widget.getByRole('button', { name: 'Silben zeigen', exact: true }).click();
  await expect(widget.locator('.clapping-syllable.active')).toHaveCount(1);
  await widget.getByRole('button', { name: 'Vorführung stoppen', exact: true }).click();
  await expect(widget.locator('.clapping-syllable.active')).toHaveCount(0);
  await expect(widget.locator('.clapping-count')).toHaveText('0 Klatscher');
  await widget.getByRole('button', { name: 'Klatschen mit Mikrofon', exact: true }).click();
  await expect(widget.getByText(/Das Mikrofon ist nicht verfügbar/)).toBeVisible();
  const clap = widget.getByRole('button', { name: 'Eine Silbe klatschen', exact: true });
  await expect(clap).toBeEnabled(); await clap.click(); await clap.click();
  await widget.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(widget.getByText('★ Genau richtig!', { exact: true })).toBeVisible();
});

test('Kinder speichern ihre Klatschserie in einer gesperrten Übung', async ({ page, browser }) => {
  await login(page); const data = await create(page, { words: ['Son-ne'] });
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } }); expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Klatschklasse' }); klass = await request('change', { id: klass.id, addChild: 'Nora' });
  const digest = '7'.repeat(64); await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: data.book.id }), context = await browser.newContext();
  try {
    const child = await context.newPage(); await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    const widget = child.locator('.interaction-surface .clapping-widget'), clap = widget.getByRole('button', { name: 'Eine Silbe klatschen', exact: true });
    await clap.click(); await clap.click(); await widget.getByRole('button', { name: 'Prüfen', exact: true }).click();
    await widget.getByRole('button', { name: 'Weiter', exact: true }).click();
    await expect(widget.getByRole('heading', { name: 'Geschafft!', exact: true })).toBeVisible();
    await child.getByRole('button', { name: '‹ Meine Hefte' }).click(); await child.waitForURL(/\/kinder$/); await child.goto(`/kinder/heft/${copies[0].id}`);
    await expect(widget.locator('.clapping-certificate')).toContainText('1 von 1 Wörtern richtig geklatscht.');
  } finally { await context.close(); }
});
