import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function insert(page: Page, title: string) {
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Mathematik · / }).click();
  await dialog.getByRole('button', { name: title, exact: true }).click();
  if (await dialog.count()) await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
}

test('Mathe-Werkzeuge wie in der Vorlage: Rechenschiffchen, Rechenrahmen, Taschenrechner, Lineal in echter Größe', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Mathewerkzeuge', orientation: 'landscape' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const surface = page.locator('.interaction-surface');

  await insert(page, 'Rechenschiffchen 10');
  const boat = surface.getByRole('group', { name: /^Rechenschiffchen 10/ });
  await boat.getByRole('button', { name: 'Platz 7' }).click(); // tapping anywhere adds the next one
  await boat.getByRole('button', { name: 'Platz 2' }).click();
  await boat.getByRole('button', { name: 'Platz 2, blau' }).click(); // last one: blue → red
  await expect(boat).toHaveAttribute('aria-label', 'Rechenschiffchen 10: 1 blaue und 1 rote Plättchen.');
  await page.screenshot({ path: test.info().outputPath('rechenschiffchen.png') });
  await page.keyboard.press('Escape');

  await insert(page, 'Rechenrahmen 20');
  const frame = surface.getByRole('group', { name: /^Rechenrahmen 20/ });
  await frame.getByRole('button', { name: 'Reihe 1, Kugel 7' }).click();
  await expect(frame).toHaveAttribute('aria-label', 'Rechenrahmen 20: 7 Kugeln links.');
  await frame.getByRole('button', { name: 'Reihe 1, Kugel 3 (links)' }).click();
  await expect(frame).toHaveAttribute('aria-label', 'Rechenrahmen 20: 2 Kugeln links.');

  await insert(page, 'Taschenrechner');
  const calc = surface.getByRole('group', { name: /^Taschenrechner/ });
  for (const key of ['1', '2', '+', '3', '0', '=']) await calc.getByRole('button', { name: key, exact: true }).click();
  await expect(calc).toHaveAttribute('aria-label', 'Taschenrechner: 42.');

  await insert(page, 'Lineal 15 cm');
  const ruler = surface.locator('.page-element', { has: page.getByRole('img', { name: 'Lineal 15 cm.' }) });
  expect(await ruler.evaluate((el) => (el as HTMLElement).style.width)).toBe('166mm');

  // State is kept with the page.
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  await page.reload();
  await expect(page.locator('.interaction-surface').getByRole('group', { name: /^Rechenschiffchen 10/ })).toHaveAttribute('aria-label', 'Rechenschiffchen 10: 1 blaue und 1 rote Plättchen.');
  await page.screenshot({ path: test.info().outputPath('mathe-werkzeuge.png') });
});

test('Kassenzettel: Summe und Rückgeld eintragen, Stempel, nächster Zettel', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Kassenzettel', orientation: 'landscape' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await insert(page, 'Rechnen mit dem Taschenrechner');
  // The empty first page is filled right there.
  await expect(page.locator('.page-thumbnail')).toHaveCount(1);
  const receipt = page.locator('.interaction-surface svg.receipt-widget');
  await expect(receipt).toBeVisible();
  await expect(page.locator('.interaction-surface').getByRole('group', { name: /^Taschenrechner/ })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('kassenzettel.png') });

  // Read the prices from the receipt and add them up.
  const prices = await receipt.locator('text[text-anchor="end"]').allTextContents();
  const cents = prices.filter((t) => /^\d+,\d\d €$/.test(t)).map((t) => Math.round(Number(t.replace(' €', '').replace(',', '.')) * 100));
  expect(cents.length).toBe(5);
  const sum = cents.reduce((a, b) => a + b, 0);
  await receipt.getByRole('button', { name: 'Summe eintragen' }).click();
  const typed = `${Math.floor(sum / 100)},${String(sum % 100).padStart(2, '0')}`;
  for (const ch of typed) await receipt.getByRole('button', { name: ch === ',' ? ',' : ch, exact: true }).click();
  await receipt.getByRole('button', { name: 'Prüfen', exact: true }).click();
  // Now the change: what was handed over is shown.
  const paidText = await receipt.locator('text', { hasText: /^\d+,\d\d €$/ }).last().textContent();
  const paid = Math.round(Number(paidText!.replace(' €', '').replace(',', '.')) * 100);
  expect(paid).toBeGreaterThan(sum);
  await receipt.focus();
  const change = paid - sum;
  await page.keyboard.type(`${Math.floor(change / 100)},${String(change % 100).padStart(2, '0')}`);
  await page.keyboard.press('Enter');
  await expect(receipt.getByText('RICHTIG')).toBeVisible();
  await expect(receipt.getByText('Zettel 1 von 3')).toBeVisible();
  await receipt.getByRole('button', { name: 'Der nächste Kassenzettel' }).click();
  await expect(receipt.getByText('Zettel 2 von 3')).toBeVisible();
  await expect(receipt.getByText('RICHTIG')).toHaveCount(0);
});
