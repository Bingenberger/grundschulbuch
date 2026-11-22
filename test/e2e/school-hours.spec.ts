import { test, expect } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };

test('Verwaltung: Schulschluss für Kinder einstellen und zurück zur Voreinstellung', async ({ page }) => {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
  await page.goto('/verwaltung');
  await page.getByRole('navigation', { name: 'Bereiche der Verwaltung' }).getByRole('button', { name: 'Einstellungen' }).click();
  const section = page.locator('section', { has: page.getByRole('heading', { name: 'Schulschluss für Kinder' }) });
  // The test server allows the whole day (SCHOOL_END_HOUR=24); choosing it again keeps children unaffected.
  await expect(section.getByRole('status')).toContainText('Voreinstellung des Servers');
  for (const name of ['12 Uhr', '16 Uhr', '18 Uhr', 'Ganzer Tag (bis Mitternacht)']) await expect(section.getByRole('button', { name, exact: true })).toBeVisible();
  await section.getByRole('button', { name: 'Ganzer Tag (bis Mitternacht)', exact: true }).click();
  await expect(page.getByText('Kinder können sich jetzt den ganzen Tag anmelden')).toBeVisible();
  await expect(section.getByRole('status')).toContainText('Eingestellt in der Verwaltung');
  const overview = await (await page.request.post('/api/verwaltung', { headers: origin, data: { action: 'overview' } })).json();
  expect(overview.schoolHours).toMatchObject({ endHour: 24, own: true });
  // Invalid hours are refused by the server.
  expect((await page.request.post('/api/verwaltung', { headers: origin, data: { action: 'schoolHours', endHour: 25 } })).status()).toBe(400);
  await section.getByRole('button', { name: /Zurück zur Voreinstellung des Servers/ }).click();
  await expect(section.getByRole('status')).toContainText('Voreinstellung des Servers');
});
