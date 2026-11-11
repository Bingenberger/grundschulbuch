import { test, expect, type Page } from '@playwright/test';
import { defaultSettings, type LearningSettings } from '../../src/lib/learning/catalog';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function create(page: Page, settings: Partial<LearningSettings> = {}) {
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Rateprobe', pages: [{ ...newPage(), elements: [{ id: uuid(), type: 'activity', activityKind: 'letterguess', x: 15, y: 15, width: 180, height: 240, rotation: 0, locked: false, color: '#253c42', settings: { ...defaultSettings('letterguess'), words: ['Maus', 'Haus'], letterGuessClue: 'none', ...settings } }] }] } });
  expect(response.ok()).toBeTruthy(); return response.json();
}

test('Buchstaben raten deckt Treffer auf, zählt Wiederholungen nicht und führt per Tastatur durch die Serie', async ({ page }) => {
  await login(page); const data = await create(page); await page.goto(`/heft/${data.book.id}`);
  const game = page.locator('.interaction-surface .letter-guess-widget');
  await expect(game.locator('.guess-slot.visible')).toHaveCount(0);
  await game.locator('[data-guess-letter=z]').click(); await expect(game).toBeFocused(); await expect(game.locator('.guess-feedback')).toHaveText('7 Fehlversuche übrig.');
  await game.focus(); await page.keyboard.type('Z'); await expect(game.locator('.guess-feedback')).toHaveText('7 Fehlversuche übrig.');
  await page.keyboard.type('maus'); await expect(game.getByText('★ Wort erraten!', { exact: true })).toBeVisible();
  await game.getByRole('button', { name: 'Nächstes Wort', exact: true }).click();
  await expect(game).toBeFocused(); await expect(game.locator('.guess-progress')).toHaveText('Wort 2 von 2');
  await page.keyboard.type('haus'); await game.getByRole('button', { name: 'Ergebnis ansehen', exact: true }).click();
  await expect(game.locator('.guess-certificate')).toContainText('2 von 2 Wörtern erraten.');
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  await page.reload(); await expect(game.locator('.guess-certificate')).toContainText('2 von 2 Wörtern erraten.');
  await game.getByRole('button', { name: 'Nochmal', exact: true }).click(); await expect(game.locator('.guess-slot.visible')).toHaveCount(0);
});

test('Versuchsgrenze deckt die Lösung auf; ein abgebrochenes Wort vergibt keinen Stern', async ({ page }) => {
  await login(page); const data = await create(page, { words: ['Maus'], letterGuessLives: 4 }); await page.goto(`/heft/${data.book.id}`);
  const game = page.locator('.interaction-surface .letter-guess-widget'); await game.focus(); await page.keyboard.type('bcde');
  await expect(game.locator('.guess-slot.visible')).toHaveCount(4);
  await expect(game.locator('.guess-feedback')).toContainText('Die Maus hat den Käse erreicht.');
  await expect(game.locator('[data-guess-letter=m]')).toBeDisabled();
  await game.getByRole('button', { name: 'Ergebnis ansehen', exact: true }).click();
  await expect(game.locator('.guess-certificate')).toContainText('0 von 1 Wörtern erraten.');
  await game.getByRole('button', { name: 'Nochmal', exact: true }).click();
  await game.getByRole('button', { name: 'Lösung zeigen', exact: true }).click();
  await expect(game.locator('.guess-feedback')).toContainText('Dieses Wort zählt noch nicht als erraten.');
  await game.getByRole('button', { name: 'Wort neu versuchen', exact: true }).click();
  await expect(game.locator('.guess-slot.visible')).toHaveCount(0); await expect(game).toBeFocused();
});

test('Kinder können den Ratefortschritt in einer gesperrten Aufgabe wieder öffnen', async ({ page, browser }) => {
  await login(page); const data = await create(page, { words: ['Bäume'] });
  const request = async (action: string, values: object) => { const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } }); expect(response.ok()).toBeTruthy(); return response.json(); };
  let klass = await request('create', { title: 'Rateklasse' }); klass = await request('change', { id: klass.id, addChild: 'Nora' });
  const digest = '5'.repeat(64); await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: data.book.id }), context = await browser.newContext();
  try {
    const child = await context.newPage(); await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    const game = child.locator('.interaction-surface .letter-guess-widget'); await game.locator('[data-guess-letter="ä"]').click();
    await expect(game.locator('.guess-slot.visible')).toHaveText(['Ä']);
    await child.getByRole('button', { name: '‹ Meine Hefte' }).click(); await child.waitForURL(/\/kinder$/); await child.goto(`/kinder/heft/${copies[0].id}`);
    await expect(game.locator('.guess-slot.visible')).toHaveText(['Ä']);
    await game.focus(); await child.keyboard.type('bume');
    await game.getByRole('button', { name: 'Ergebnis ansehen', exact: true }).click();
    await expect(game.locator('.guess-certificate')).toContainText('1 von 1 Wörtern erraten.');
  } finally { await context.close(); }
});
