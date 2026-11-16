import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function openBlock(page: Page, title: string, fresh = true) {
  if (fresh) {
    const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title, pages: [newPage('blanko', 'landscape')] } })).json();
    await page.goto(`/heft/${created.book.id}`);
  }
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Musik · / }).click();
  await dialog.getByRole('button', { name: title, exact: true }).click();
  return dialog;
}

test('Hör-Memory und Was hörst du? wie in Lernsachen-Heft 1.47.3', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);

  // Hör-Memory: six sounds of Alltag und Natur, twelve cards; the preview can be played.
  let dialog = await openBlock(page, 'Hör-Memory');
  const preview = dialog.locator('.listen-preview .lh-ct-listen svg');
  await expect(preview.locator('[data-a^="c:"]')).toHaveCount(12);
  await expect(dialog.getByRole('button', { name: /Regen/ })).toHaveAttribute('aria-pressed', 'true');
  // Choose another sound: tapping selects it (and plays it).
  await dialog.getByRole('button', { name: /Wind/ }).click();
  await expect(dialog.getByText('Gewählt: 7')).toBeVisible();
  await expect(preview.locator('[data-a^="c:"]')).toHaveCount(14);
  await page.screenshot({ path: test.info().outputPath('hoeren-einstellungen.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const memory = page.locator('.interaction-surface .lh-wg-listen');
  await expect(memory).toHaveAttribute('aria-label', /^Hör-Memory/);
  const cards = memory.locator('svg [data-a^="c:"]');
  await expect(cards).toHaveCount(14);
  // A tapped card stays open (yellow) until the second one.
  await cards.nth(0).click();
  await expect(memory.locator('svg [data-a="c:0"] rect').first()).toHaveAttribute('fill', '#fff3bf');
  await page.screenshot({ path: test.info().outputPath('hoeren-memory.png') });

  // Was hörst du? with instruments: the ear and four answers.
  dialog = await openBlock(page, 'Was hörst du?', false);
  await dialog.getByRole('radio', { name: 'Instrumente', exact: true }).click();
  await expect(dialog.getByText('Gewählt: 4')).toBeVisible();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const quiz = page.locator('.interaction-surface .lh-wg-listen[aria-label^="Was hörst du?"]');
  await expect(quiz).toHaveCount(1);
  await expect(quiz.locator('svg [data-a="play"]')).toHaveCount(1);
  await expect(quiz.locator('svg [data-a^="a:"]')).toHaveCount(4);
  await expect(quiz.locator('svg')).toContainText('1 von 4');
  await quiz.locator('svg [data-a="play"]').click();
  await page.screenshot({ path: test.info().outputPath('hoeren-quiz.png') });

  // Settings are saved with the page.
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const id = page.url().split('/').pop();
  const saved = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id } })).json();
  const listens = saved.pages[0].elements.filter((e: { widgetKind?: string }) => e.widgetKind === 'hoeren').map((e: { settings: { listen: unknown } }) => e.settings.listen);
  expect(listens).toEqual([
    { mode: 'memory', set: 'fx', picks: ['rain', 'thunder', 'birds', 'knock', 'bell', 'clock', 'wind'], own: [] },
    { mode: 'quiz', set: 'instruments', picks: ['piano', 'drum', 'triangle', 'flute'], own: [] },
  ]);
  expect(errors).toEqual([]);
});
