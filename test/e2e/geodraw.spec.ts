import { test, expect, type Page } from '@playwright/test';
import { defaultSettings } from '../../src/lib/learning/catalog';
import { newPage, uuid } from '../../src/lib/notebook-model';
import { PAGE_W, MM, targetSegments } from '../../src/lib/learning/geodraw';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Geometrie: Formen zeichnen – Start nimmt den Stift und legt das Lineal hin, Prüfen mit genauer Rückmeldung', async ({ page }) => {
  await login(page);
  const task = { k: 'line' as const, a: 50, d: 0 };
  const geo = { level: 'easy', count: 2, groups: [], tol: 'normal', flash: 2, tasks: [task, { k: 'square' as const, a: 30 }] };
  const pages = [{
    ...newPage('karo5', 'landscape'),
    elements: [{ id: uuid(), type: 'widget', widgetKind: 'geodraw', x: 0, y: 0, width: 297, height: 210, rotation: 0, locked: true, color: '#253c42', settings: { ...defaultSettings('geodraw'), geo } }],
  }];
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Geometrie', pages } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const widget = page.locator('.interaction-surface svg.geodraw');
  await expect(widget.getByText('GEOMETRIE · AUFGABE 1 VON 2')).toBeVisible();
  await expect(widget.getByText('Formen zeichnen', { exact: true })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('geometrie-start.png') });

  await widget.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Stift', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('group', { name: 'Lineal auf der Seite' })).toBeVisible();
  // The ruler is not needed for this test.
  await page.getByRole('button', { name: 'Lineal schließen' }).click();

  const box = (await widget.boundingBox())!;
  const screen = ([x, y]: [number, number]) => ({ x: box.x + (x * box.width) / PAGE_W, y: box.y + (y * box.height) / 990 });
  const [[from, to]] = targetSegments(task);
  const draw = async (a: [number, number], b: [number, number]) => {
    const p = screen(a), q = screen(b);
    await page.mouse.move(p.x, p.y);
    await page.mouse.down();
    await page.mouse.move(q.x, q.y, { steps: 12 });
    await page.mouse.up();
  };

  // Too short: precise feedback.
  await draw(from, [to[0] - 5 * MM, to[1]]);
  await widget.getByRole('button', { name: 'Überprüfen' }).click();
  await expect(widget.getByText('Die Strecke ist 5 mm zu kurz.')).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('geometrie-falsch.png') });

  // Draw the missing 5 mm: both strokes on one line count as one segment.
  await draw([to[0] - 5 * MM, to[1]], to);
  await widget.getByRole('button', { name: 'Überprüfen' }).click();
  await expect(widget.getByText('Richtig! Gut gezeichnet.')).toBeVisible();
  await widget.getByRole('button', { name: 'Weiter' }).click();
  await expect(widget.getByText('GEOMETRIE · AUFGABE 2 VON 2')).toBeVisible();
  await expect(page.locator('.interaction-surface .page-element')).toHaveCount(1, { timeout: 5000 });
});
