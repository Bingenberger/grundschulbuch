import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function openQuiz(page: Page) {
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Quiz', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Für alle Fächer · / }).click();
  await dialog.getByRole('button', { name: 'Quiz', exact: true }).click();
  return dialog;
}
const player = (page: Page) => page.frameLocator('.interaction-surface .textsachen-frame.is-live iframe');

test('Quiz aus Quizsachen: Fragen als Text, Vorlage, Antwort bleibt nach dem Neuladen', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const dialog = await openQuiz(page);
  // No picture search in the tests (it would need the internet).
  await dialog.getByRole('switch', { name: /Bilder automatisch suchen/ }).uncheck();
  await expect(dialog.getByLabel('Fragen als Text')).toHaveValue(/Titel: Tiere im Wald/);
  await expect(dialog.getByRole('status').filter({ hasText: '4 Fragen' })).toBeVisible();
  await dialog.getByLabel('Fragen als Text').fill('Titel: Rechnen\n\n? Wie viel ist 2 + 3?\n( ) 4\n(x) 5\n( ) 6\n> 2 + 3 = 5\n\n? Die Sonne ist ein Stern.\n= richtig\n');
  await expect(dialog.getByRole('status').filter({ hasText: '2 Fragen: 1× Einfachauswahl, 1× Richtig oder falsch' })).toBeVisible();
  await dialog.getByRole('radiogroup', { name: 'Vorlage' }).getByRole('radio', { name: /^Leicht lesen/ }).click();
  await dialog.getByRole('switch', { name: 'Startkarte' }).uncheck();
  await dialog.getByRole('switch', { name: 'Antworten mischen' }).uncheck();
  await expect(dialog.frameLocator('.dnd-preview iframe').getByText('Wie viel ist 2 + 3?')).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('quiz-dialog.png'), fullPage: true });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);

  const frame = player(page);
  await expect(frame.getByText('Wie viel ist 2 + 3?')).toBeVisible();
  await frame.getByText('5', { exact: true }).click();
  await frame.getByRole('button', { name: 'Überprüfen' }).click();
  await expect(frame.getByText('2 + 3 = 5').first()).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('quiz-seite.png') });
  await frame.getByRole('button', { name: 'Weiter' }).click();
  await expect(frame.getByText('Die Sonne ist ein Stern.')).toBeVisible();
  await page.waitForTimeout(1500);
  await page.reload();
  // The state of the child is kept: the quiz goes on at the second question.
  await expect(player(page).getByText('Die Sonne ist ein Stern.')).toBeVisible();
  expect(errors).toEqual([]);
});
