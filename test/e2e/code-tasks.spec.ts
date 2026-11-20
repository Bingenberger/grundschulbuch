import { test, expect, type Page, type Locator } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
// Programmieren wie in Lernsachen-Heft 1.49.0: Aufgaben durchblättern, neu
// würfeln, löschen, dazunehmen und selbst auf dem Teppich bauen.
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
type El = { widgetKind?: string; settings?: { pg?: { tasks: { own?: boolean; start: number[]; goal: number[]; walls: number[][] }[] } } };
const elements = async (page: Page, id: string): Promise<El[]> => (await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id } })).json()).pages.flatMap((p: { elements: El[] }) => p.elements);
/** Taps field (x, y) of an n × n carpet in the building picture. */
async function tapCell(board: Locator, n: number, x: number, y: number) {
  const box = (await board.boundingBox())!, size = 810 / n, all = 830;
  await board.click({ position: { x: ((10 + (x + 0.5) * size) / all) * box.width, y: ((10 + (y + 0.5) * size) / all) * box.height } });
}

test('Programmieren: eigene Aufgaben bauen, prüfen und Aufgaben verwalten', async ({ page }) => {
  await login(page);
  const { book } = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Eigene Aufgaben', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Programmieren · / }).click();
  await dialog.getByRole('button', { name: 'Zum Ziel: Pfeilkarten legen', exact: true }).click();
  await dialog.getByRole('radio', { name: '5 × 5', exact: true }).click();
  const nav = dialog.locator('.code-nav strong');
  await expect(nav).toHaveText(/^Aufgabe 1 von \d+$/);
  const count = Number((await nav.textContent())!.match(/von (\d+)/)![1]);

  // Task bar: add, delete.
  await dialog.getByRole('button', { name: '+ Aufgabe', exact: true }).click();
  await expect(nav).toHaveText(`Aufgabe ${count + 1} von ${count + 1}`);
  await dialog.getByRole('button', { name: 'Löschen', exact: true }).click();
  await expect(nav).toHaveText(`Aufgabe ${count} von ${count}`);
  if (count > 1) await dialog.getByRole('button', { name: 'Aufgabe davor' }).click();

  // Build: figure in the middle, goal top left, walled in → not solvable.
  const tools = dialog.getByRole('radiogroup', { name: 'Werkzeug' });
  await expect(tools.getByRole('radio')).toHaveText(['Figur', 'Ziel', 'Hindernis']);
  await tools.getByRole('radio', { name: 'Figur' }).click();
  const board = dialog.locator('.code-board');
  await expect(board.locator('img')).toBeVisible();
  await tapCell(board, 5, 2, 2);
  await tools.getByRole('radio', { name: 'Ziel' }).click();
  await tapCell(board, 5, 0, 0);
  await tools.getByRole('radio', { name: 'Figur' }).click();
  await tapCell(board, 5, 2, 2);
  await expect(nav).toContainText('· eigene');
  await tools.getByRole('radio', { name: 'Hindernis' }).click();
  await tapCell(board, 5, 1, 0);
  await tapCell(board, 5, 0, 1);
  await expect(dialog.locator('.code-check')).toHaveText('✗ So geht es nicht: Das Ziel ist nicht zu erreichen.');
  await page.screenshot({ path: test.info().outputPath('programmieren-bauen.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog.getByText(/Aufgabe \d+ ist so nicht lösbar\./)).toBeVisible();
  await tapCell(board, 5, 1, 0); // wall away again
  await expect(dialog.locator('.code-check')).toHaveText(/^✓ Lösbar – das kürzeste Programm hat \d+ Bausteine?\.$/);

  // A harder level throws new tasks, the own one stays.
  await dialog.getByRole('radio', { name: 'Schwer', exact: true }).click();
  await expect(nav).toContainText('· eigene');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const pg = (await elements(page, book.id)).find((e) => e.widgetKind === 'programmieren')!.settings!.pg!;
  const own = pg.tasks.filter((t) => t.own);
  expect(own).toHaveLength(1);
  expect(own[0].goal).toEqual([0, 0]);
  expect(own[0].start.slice(0, 2)).toEqual([2, 2]);
  expect(own[0].walls).toEqual([[0, 1]]);
});
