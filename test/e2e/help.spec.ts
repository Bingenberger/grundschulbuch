import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}

test('Hilfe: Kapitel, häufige Fragen, Suche und Tastenkürzel – im Regal und im Heft', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);

  // Im Regal
  await page.getByRole('button', { name: 'Hilfe', exact: true }).click();
  let help = page.getByRole('dialog', { name: 'Hilfe' });
  await expect(help.getByRole('button', { name: /Regal und Hefte/ })).toBeVisible();
  await expect(help.getByRole('button', { name: /^Wie / })).toHaveCount(19);
  await help.getByRole('button', { name: 'Wie drucke ich ein Heft aus?' }).click();
  await expect(help.getByText('„Speichern“ → „PDF“ oder „Am Drucker drucken“.')).toBeVisible();
  await help.getByRole('button', { name: /Mehr dazu: Drucken und PDF/ }).click();
  await expect(help.getByRole('heading', { level: 3, name: 'Speichern und teilen' })).toBeVisible();
  await expect(help.locator('#help-drucken')).toHaveClass(/is-focus/);
  await help.getByRole('button', { name: '‹ Alle Themen' }).click();
  await help.getByRole('searchbox', { name: 'Hilfe durchsuchen' }).fill('silben');
  await help.getByRole('button', { name: /^Silben rot und blau/ }).click();
  await expect(help.getByRole('heading', { level: 3, name: 'Im Unterricht' })).toBeVisible();
  await help.getByRole('searchbox', { name: 'Hilfe durchsuchen' }).fill('quatschwort');
  await expect(help.getByText(/noch keinen Hilfetext/)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(help).toHaveCount(0);

  // Im Heft: Knopf, F1 und der Weg zu den Tastenkürzeln
  const r = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Hilfeprobe' } });
  const { book } = await r.json();
  await page.goto(`/heft/${book.id}`);
  await page.getByRole('button', { name: 'Hilfe', exact: true }).click();
  help = page.getByRole('dialog', { name: 'Hilfe' });
  await help.getByRole('button', { name: 'Schließen', exact: true }).click();
  await expect(help).toHaveCount(0);
  await page.locator('.canvas-area').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('F1');
  await expect(help).toBeVisible();
  await help.getByRole('button', { name: /Tastatur und Geräte/ }).click();
  await help.getByRole('button', { name: 'Tastenkürzel ansehen und ändern …' }).click();
  await expect(page.getByRole('dialog', { name: 'Tastenkürzel' })).toBeVisible();
  expect(errors).toEqual([]);
});
