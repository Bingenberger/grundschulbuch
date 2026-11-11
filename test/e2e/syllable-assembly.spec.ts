import { test, expect, type Page } from '@playwright/test';
import { defaultSettings, type LearningSettings } from '../../src/lib/learning/catalog';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function create(page: Page, settings: Partial<LearningSettings> = {}) {
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Silbenprobe', pages: [{ ...newPage(), elements: [{ id: uuid(), type: 'activity', activityKind: 'syllables', x: 15, y: 15, width: 180, height: 240, rotation: 0, locked: false, color: '#253c42', settings: { ...defaultSettings('syllables'), words: ['Ba-na-ne', 'Son-ne'], syllablePrompt: 'word', ...settings } }] }] } });
  expect(response.ok()).toBeTruthy(); return response.json();
}
test('Silben lassen sich ziehen, korrigieren und nach dem Speichern weiter bearbeiten', async ({ page }) => {
  await login(page); const data = await create(page); await page.goto(`/heft/${data.book.id}`);
  const game = page.locator('.interaction-surface .syllable-assembly-widget');
  const tile = await game.locator('[data-syllable-tile="2"]').boundingBox(), slot = await game.locator('[data-syllable-slot="0"]').boundingBox();
  expect(tile).toBeTruthy(); expect(slot).toBeTruthy();
  await page.mouse.move(tile!.x + tile!.width / 2, tile!.y + tile!.height / 2); await page.mouse.down();
  await page.mouse.move(slot!.x + slot!.width / 2, slot!.y + slot!.height / 2, { steps: 10 }); await page.mouse.up();
  await expect(game.locator('[data-syllable-slot="0"]')).toHaveText('ne');
  for (const [source, target] of [[1, 1], [0, 2]]) { await game.locator(`[data-syllable-tile="${source}"]`).click(); await game.locator(`[data-syllable-slot="${target}"]`).click(); }
  await game.getByRole('button', { name: 'Wort prüfen', exact: true }).click(); await expect(game).toContainText('Noch nicht richtig.');
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert'); await page.reload();
  await expect(game.locator('[data-syllable-slot="0"]')).toHaveText('ne');
  // Moving onto an occupied slot returns its previous tile to the bank.
  await game.locator('[data-syllable-slot="2"]').click(); await game.locator('[data-syllable-slot="0"]').click();
  await game.locator('[data-syllable-tile="2"]').click(); await game.locator('[data-syllable-slot="2"]').click();
  await game.getByRole('button', { name: 'Wort prüfen', exact: true }).click(); await expect(game).toContainText('Das Wort ist richtig zusammengesetzt!');
  await game.getByRole('button', { name: 'Nächstes Wort', exact: true }).click(); await game.getByRole('button', { name: 'Wort überspringen', exact: true }).click();
  await expect(game.locator('.guess-certificate')).toContainText('1 von 2 Wörtern zusammengesetzt.');
});
test('Tastaturwahl, Abbruch und gleich geschriebene Silben funktionieren ohne Ziehen', async ({ page }) => {
  await login(page); const data = await create(page, { words: ['ma-ma'] }); await page.goto(`/heft/${data.book.id}`);
  const game = page.locator('.interaction-surface .syllable-assembly-widget'), tile = game.locator('[data-syllable-tile="1"]');
  await tile.focus(); await page.keyboard.press('Enter'); await expect(tile).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape'); await expect(tile).toHaveAttribute('aria-pressed', 'false');
  for (const [source, target] of [[1, 0], [0, 1]]) {
    await game.locator(`[data-syllable-tile="${source}"]`).focus(); await page.keyboard.press('Enter');
    await game.locator(`[data-syllable-slot="${target}"]`).focus(); await page.keyboard.press('Enter');
  }
  await game.getByRole('button', { name: 'Wort prüfen', exact: true }).click(); await game.getByRole('button', { name: 'Ergebnis ansehen', exact: true }).click();
  await expect(game.locator('.guess-certificate')).toContainText('1 von 1 Wörtern zusammengesetzt.');
  await game.getByRole('button', { name: 'Nochmal', exact: true }).click(); await expect(game.locator('[data-syllable-tile]')).toHaveCount(2);
});
test('Kinder können auch in gesperrten Aufgaben Silben legen und ihren Stand wieder öffnen', async ({ page, browser }) => {
  await login(page); const data = await create(page, { words: ['Son-ne'] });
  const request = async (action: string, values: object) => { const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } }); expect(response.ok()).toBeTruthy(); return response.json(); };
  let klass = await request('create', { title: 'Silbenklasse' }); klass = await request('change', { id: klass.id, addChild: 'Nora' });
  const digest = '6'.repeat(64); await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: data.book.id }), context = await browser.newContext();
  try {
    const child = await context.newPage(); await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`); const game = child.locator('.interaction-surface .syllable-assembly-widget');
    await game.locator('[data-syllable-tile="0"]').click(); await game.locator('[data-syllable-slot="0"]').click();
    await child.getByRole('button', { name: '‹ Meine Hefte' }).click(); await child.goto(`/kinder/heft/${copies[0].id}`);
    await expect(game.locator('[data-syllable-slot="0"]')).toHaveText('Son');
    await game.locator('[data-syllable-tile="1"]').click(); await game.locator('[data-syllable-slot="1"]').click();
    await game.getByRole('button', { name: 'Wort prüfen', exact: true }).click(); await game.getByRole('button', { name: 'Ergebnis ansehen', exact: true }).click();
    await expect(game.locator('.guess-certificate')).toContainText('1 von 1 Wörtern zusammengesetzt.');
  } finally { await context.close(); }
});
