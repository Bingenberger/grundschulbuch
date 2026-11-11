import { test, expect, type Page, type Locator } from '@playwright/test';
import { defaultSettings, type LearningSettings } from '../../src/lib/learning/catalog';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function create(page: Page, patch: Partial<LearningSettings> = {}) {
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Geometrieprobe', pages: [{ ...newPage(), elements: [{ id: uuid(), type: 'widget', widgetKind: 'geometry', x: 15, y: 15, width: 180, height: 260, rotation: 0, locked: false, color: '#253c42', settings: { ...defaultSettings('geometry'), geometryMode: 'custom', geometryHelp: 'trace', path: [{ x: 20, y: 20 }, { x: 80, y: 20 }], ...patch } }] }] } });
  expect(response.ok()).toBeTruthy(); return response.json();
}
async function point(board: Locator, x: number, y: number) {
  return board.evaluate((element, p) => { const at = new DOMPoint(p.x, p.y).matrixTransform((element as SVGSVGElement).getScreenCTM()!); return { x: at.x, y: at.y }; }, { x, y });
}
async function draw(page: Page, board: Locator, a: [number, number], b: [number, number]) {
  const start = await point(board, ...a), end = await point(board, ...b);
  await page.mouse.move(start.x, start.y); await page.mouse.down(); await page.mouse.move(end.x, end.y, { steps: 5 }); await page.mouse.up();
}
test('Eigene Formen lassen sich zeichnen, prüfen, gezielt radieren und nach Abschluss wieder öffnen', async ({ page }) => {
  await login(page); const data = await create(page); await page.goto(`/heft/${data.book.id}`);
  await page.getByRole('button', { name: 'Ganze Seite', exact: true }).click();
  const game = page.locator('.interaction-surface .geometry-widget'), board = game.locator('.geometry-board');
  await draw(page, board, [40, 80], [160, 80]); await game.getByRole('button', { name: 'Form prüfen', exact: true }).click();
  await expect(game).toContainText('0 Strecken passen.'); await expect(game.locator('.geometry-segment')).toHaveAttribute('stroke', '#ba3c46');
  await game.getByRole('button', { name: 'Streckenradierer', exact: true }).click(); const middle = await point(board, 100, 80); await page.mouse.click(middle.x, middle.y);
  await expect(game.locator('.geometry-segment')).toHaveCount(0); await game.getByRole('button', { name: 'Stift verwenden', exact: true }).click();
  await draw(page, board, [40, 40], [160, 40]); await game.getByRole('button', { name: 'Form prüfen', exact: true }).click(); await expect(game).toContainText('★ Die Form stimmt!');
  await game.getByRole('button', { name: 'Ergebnis ansehen', exact: true }).click(); await expect(game.locator('.guess-certificate')).toContainText('1 von 1 Formen gelöst.');
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert'); await page.reload(); await expect(game.locator('.guess-certificate')).toContainText('1 von 1 Formen gelöst.');
});
test('Kurze Vorschau verschwindet; die Form lässt sich per Tastatur zeichnen und zusätzliche Hilfe wird vermerkt', async ({ page }) => {
  await login(page); const data = await create(page, { geometryHelp: 'preview', geometryPreview: 1 }); await page.goto(`/heft/${data.book.id}`);
  const game = page.locator('.interaction-surface .geometry-widget'), board = game.locator('.geometry-board');
  await expect(game.locator('.geometry-target')).toHaveCount(0); await game.getByRole('button', { name: 'Vorlage ansehen', exact: true }).click();
  await expect(game.locator('.geometry-target')).toHaveCount(1); await expect(game.locator('.geometry-target')).toHaveCount(0);
  await board.focus(); for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowLeft'); for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter'); for (let i = 0; i < 12; i++) await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter');
  await expect(game.locator('.geometry-segment')).toHaveCount(1); await expect(page.getByRole('dialog')).toHaveCount(0);
  await game.getByRole('button', { name: 'Vorschau wiederholen', exact: true }).click(); await expect(game.locator('.geometry-target')).toHaveCount(0);
  await game.getByRole('button', { name: 'Form prüfen', exact: true }).click(); await game.getByRole('button', { name: 'Ergebnis ansehen', exact: true }).click();
  await expect(game.locator('.guess-certificate')).toContainText('mit Hilfe');
});
test('Zeichenhilfen lassen sich am Körper greifen, drehen und über ihren eigenen Knopf schließen', async ({ page }) => {
  await login(page); const data = await create(page); await page.goto(`/heft/${data.book.id}`);
  const game = page.locator('.interaction-surface .geometry-widget'), board = game.locator('.geometry-board');
  await game.getByRole('button', { name: 'Lineal', exact: true }).click(); const shape = game.locator('.geometry-guide > g'); const before = await shape.getAttribute('transform');
  await draw(page, board, [70, 114], [85, 130]); await expect(shape).not.toHaveAttribute('transform', before!);
  await game.getByLabel('Winkel der Zeichenhilfe').fill('30'); await expect(shape).toHaveAttribute('transform', /rotate\(30\)/);
  await game.getByRole('button', { name: 'Lineal schließen', exact: true }).click(); await expect(game.locator('.geometry-guide')).toHaveCount(0);
  await game.getByRole('button', { name: 'Geodreieck', exact: true }).click(); await expect(game.locator('.geometry-guide')).toHaveCount(1);
  await game.getByRole('button', { name: 'Geodreieck schließen', exact: true }).focus(); await page.keyboard.press('Enter'); await expect(game.locator('.geometry-guide')).toHaveCount(0);
  await expect(game.locator('.geometry-segment')).toHaveCount(0);
});
