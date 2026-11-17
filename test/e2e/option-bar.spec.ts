import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
// iPad (10. Generation) im Querformat.
test.use({ viewport: { width: 1180, height: 820 }, hasTouch: true });
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Untere Leiste lässt sich einklappen, bleibt beim Werkzeugwechsel und nach dem Neuladen eingeklappt', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Leiste', pages: [newPage()] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const main = page.locator('.canvas-area');
  await page.getByRole('button', { name: 'Radierer', exact: true }).click();
  const bar = page.getByRole('region', { name: 'Radierer einstellen' });
  await expect(bar.getByRole('group', { name: 'Radierart' })).toBeVisible();
  const open = (await main.boundingBox())!.height;
  const openBar = (await bar.boundingBox())!.height;
  await page.screenshot({ path: test.info().outputPath('leiste-offen.png') });

  await bar.getByRole('button', { name: 'Einklappen' }).tap();
  await expect(bar.getByRole('group', { name: 'Radierart' })).toHaveCount(0);
  const toggle = bar.getByRole('button', { name: /Radierer einstellen/ });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const foldedBar = (await bar.boundingBox())!.height;
  expect(foldedBar).toBeLessThanOrEqual(50);
  expect(foldedBar).toBeLessThan(openBar);
  await expect.poll(async () => (await main.boundingBox())!.height).toBeGreaterThan(open + (openBar - foldedBar) - 2);
  await page.screenshot({ path: test.info().outputPath('leiste-eingeklappt.png') });

  // Another tool: the bar stays folded.
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Seite', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Seite einstellen' })).toHaveClass(/folded/);
  await expect(page.locator('.option-bar:not(.folded)')).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: 'Radierer', exact: true }).click();
  await expect(page.locator('.option-bar.folded')).toHaveCount(1);

  await page.getByRole('region', { name: 'Radierer einstellen' }).getByRole('button', { name: /ausklappen/ }).tap();
  await expect(page.getByRole('group', { name: 'Radierart' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Radierer', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Radierart' })).toBeVisible();
});
