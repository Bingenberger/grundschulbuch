import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function open(page: Page, title: string) {
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title, orientation: 'landscape' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Mathematik · / }).click();
  for (const gone of ['Koordinaten-Spiel']) await expect(dialog.getByRole('button', { name: gone, exact: true })).toHaveCount(0);
  await dialog.getByRole('button', { name: title, exact: true }).click();
  return dialog;
}
const surface = (page: Page) => page.locator('.interaction-surface');

test('Stellenwerttafel: Montessori-Farben, Plättchen, Bündeln, Zahl', async ({ page }) => {
  await login(page);
  const dialog = await open(page, 'Stellenwerttafel');
  await dialog.getByRole('radiogroup', { name: 'Größte Stelle' }).getByRole('radio', { name: 'Tausender', exact: true }).click();
  await page.screenshot({ path: test.info().outputPath('stellenwert-dialog.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const table = surface(page).locator('svg.place-table');
  for (let k = 0; k < 10; k++) await table.getByRole('button', { name: /^Einer: ein Plättchen dazu/ }).click();
  await table.getByRole('button', { name: /^Hunderter: eins mehr/ }).click();
  await expect(table).toHaveAttribute('aria-label', 'Stellenwerttafel: 0 T 1 H 0 Z 10 E = 110');
  await page.screenshot({ path: test.info().outputPath('stellenwert-zehn.png') });
  await table.getByRole('button', { name: /^10 Einer bündeln/ }).click();
  await expect(table).toHaveAttribute('aria-label', 'Stellenwerttafel: 0 T 1 H 1 Z 0 E = 110');
  await table.getByRole('button', { name: /^1 Hunderter entbündeln/ }).click();
  await expect(table).toHaveAttribute('aria-label', 'Stellenwerttafel: 0 T 0 H 11 Z 0 E = 110');
  await page.screenshot({ path: test.info().outputPath('stellenwert-seite.png') });
});

test('Dienes-Material: Material aus der Kiste, tauschen, Aufgaben', async ({ page }) => {
  await login(page);
  const dialog = await open(page, 'Dienes-Material');
  await dialog.getByRole('slider', { name: 'Zahlen legen üben' }).fill('3');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const mat = surface(page).locator('svg.dienes');
  const goal = Number((await mat.locator('text').first().textContent())!.replace(/\D/g, ''));
  const h = Math.floor(goal / 100), z = Math.floor((goal % 100) / 10), e = goal % 10;
  for (const [name, n] of [['Hunderter', h], ['Zehner', z], ['Einer', e]] as const) for (let k = 0; k < n; k++) await mat.getByRole('button', { name: `${name} dazulegen` }).click();
  await page.screenshot({ path: test.info().outputPath('dienes-seite.png') });
  await mat.getByRole('button', { name: 'Prüfen' }).click();
  await expect(mat.getByText('✓ Richtig!')).toBeVisible();
});

test('Zahlenstrahl: Punkte und Sprünge, Zahlen finden', async ({ page }) => {
  await login(page);
  const dialog = await open(page, 'Zahlenstrahl');
  await dialog.getByRole('radiogroup', { name: 'Zahlenstrahl bis' }).getByRole('radio', { name: '20', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const line = surface(page).locator('svg.number-line');
  const box = (await line.boundingBox())!;
  const at = (n: number) => ({ x: box.x + ((70 + (n / 20) * 860) / 1000) * box.width, y: box.y + (190 / 300) * box.height });
  await line.getByRole('button', { name: 'Sprünge zeichnen' }).click();
  await page.mouse.click(at(8).x, at(8).y);
  await page.mouse.click(at(15).x, at(15).y);
  await expect(line.locator('text', { hasText: '+7' })).toBeVisible();
  await line.getByRole('button', { name: 'Punkte setzen' }).click();
  await page.mouse.click(at(12).x, at(12).y);
  await expect(line.getByRole('button', { name: 'Punkt 12 löschen' })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('zahlenstrahl-seite.png') });
});

test('Hunderterfeld: färben durch Wischen, Abdeckwinkel', async ({ page }) => {
  await login(page);
  const dialog = await open(page, 'Hunderterfeld');
  await page.screenshot({ path: test.info().outputPath('hunderterfeld-dialog.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const field = surface(page).locator('svg.hundred-field');
  const box = (await field.boundingBox())!;
  const vb = await field.evaluate((el) => (el as SVGSVGElement).viewBox.baseVal.height);
  const dot = (i: number) => {
    const row = Math.floor(i / 10), col = i % 10;
    const x = 70 + col * 62 + (col >= 5 ? 22 : 0), y = 70 + row * 62 + (row >= 5 ? 22 : 0);
    return { x: box.x + (x / 1000) * box.width, y: box.y + (y / vb) * box.height };
  };
  // Swipe along the first row: ten red dots.
  await page.mouse.move(dot(0).x, dot(0).y); await page.mouse.down();
  await page.mouse.move(dot(9).x, dot(9).y, { steps: 20 }); await page.mouse.up();
  await expect(field).toHaveAttribute('aria-label', 'Hunderterfeld: 10 rote und 0 blaue Punkte');
  await field.getByRole('button', { name: 'Farbe Blau' }).click();
  await page.mouse.click(dot(10).x, dot(10).y);
  await expect(field).toHaveAttribute('aria-label', 'Hunderterfeld: 10 rote und 1 blaue Punkte');
  await page.screenshot({ path: test.info().outputPath('hunderterfeld-seite.png') });
});
