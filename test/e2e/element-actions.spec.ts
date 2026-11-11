import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid, type PageElement } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const text = (value: string, y = 30): PageElement => ({ id: uuid(), type: 'text', x: 20, y, width: 100, height: 20, rotation: 0, locked: false,
  color: '#253c42', text: value, font: 'Andika', fontSize: 18 });

test('Aktionen in der Kopfzeile: kopieren, ausschneiden, einfügen, duplizieren, verlinken und löschen', async ({ page }) => {
  await login(page);
  const first = text('Startseite'), target = text('Zielseite');
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Aktionsprobe',
    pages: [{ ...newPage(), elements: [first] }, { ...newPage(), elements: [target] }] } });
  expect(response.ok()).toBeTruthy(); const created = await response.json();
  await page.goto(`/heft/${created.book.id}`);
  const surface = page.locator('.interaction-surface');
  const actions = page.getByRole('group', { name: 'Aktionen für die Auswahl' });
  await expect(actions).toHaveCount(0);
  await surface.getByText('Startseite', { exact: true }).click();
  for (const name of ['Kopieren', 'Ausschneiden', 'Einfügen', 'Duplizieren', 'Link', 'Löschen'])
    await expect(actions.getByRole('button', { name, exact: true })).toBeVisible();
  await expect(actions.getByRole('button', { name: 'Einfügen', exact: true })).toBeDisabled();

  await actions.getByRole('button', { name: 'Duplizieren', exact: true }).click();
  await expect(surface.locator('.page-element')).toHaveCount(2);
  await actions.getByRole('button', { name: 'Kopieren', exact: true }).click();
  await actions.getByRole('button', { name: 'Einfügen', exact: true }).click();
  await expect(surface.locator('.page-element')).toHaveCount(3);
  await actions.getByRole('button', { name: 'Ausschneiden', exact: true }).click();
  await expect(surface.locator('.page-element')).toHaveCount(2);
  // With nothing selected, only “Einfügen” stays available.
  await expect(actions.getByRole('button')).toHaveCount(1);
  await actions.getByRole('button', { name: 'Einfügen', exact: true }).click();
  await expect(surface.locator('.page-element')).toHaveCount(3);
  await actions.getByRole('button', { name: 'Löschen', exact: true }).click();
  await expect(surface.locator('.page-element')).toHaveCount(2);

  // Link to another page of the notebook.
  await surface.locator(`[data-element-id="${first.id}"]`).click({ position: { x: 4, y: 4 } });
  await actions.getByRole('button', { name: 'Link', exact: true }).click();
  const popover = page.getByRole('dialog', { name: 'Link setzen' });
  await expect(popover).toBeVisible();
  await popover.getByRole('button', { name: 'Seite im Heft', exact: true }).click();
  await popover.getByRole('button', { name: 'Seite 2', exact: true }).click();
  await expect(popover).toHaveCount(0);
  const badge = surface.getByRole('button', { name: 'Link öffnen: Seite 2' });
  await expect(badge).toBeVisible();
  await badge.click();
  await expect(page.getByRole('button', { name: 'Seite 2 öffnen' })).toHaveAttribute('aria-current', 'page');
  await expect(surface.getByText('Zielseite', { exact: true })).toBeVisible();

  // Link to a web page; the address is completed and opens in a new tab.
  await surface.getByText('Zielseite', { exact: true }).click();
  await actions.getByRole('button', { name: 'Link', exact: true }).click();
  await popover.getByLabel('Internetadresse').fill('kein link');
  await popover.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(popover.getByRole('alert')).toBeVisible();
  await popover.getByLabel('Internetadresse').fill('www.example.org/lernen');
  await popover.getByRole('button', { name: 'Übernehmen' }).click();
  const web = surface.getByRole('link', { name: 'Link öffnen: example.org' });
  await expect(web).toHaveAttribute('href', 'https://www.example.org/lernen');
  await expect(web).toHaveAttribute('target', '_blank');
  await page.keyboard.press('Escape');

  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  const saved = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: created.book.id } })).json();
  expect(saved.pages[0].elements.find((el: PageElement) => el.id === first.id).link).toEqual({ kind: 'page', pageId: saved.pages[1].id });
  expect(saved.pages[1].elements[0].link).toEqual({ kind: 'url', url: 'https://www.example.org/lernen' });

  // Removing the link again.
  await surface.getByText('Zielseite', { exact: true }).click();
  await actions.getByRole('button', { name: 'Link ändern', exact: true }).click();
  await popover.getByRole('button', { name: 'Link entfernen' }).click();
  await expect(surface.locator('.link-badge')).toHaveCount(0);
});
