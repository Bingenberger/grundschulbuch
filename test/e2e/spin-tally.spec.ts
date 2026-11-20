import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid } from '../../src/lib/notebook-model';
// Glücksrad und Würfel mit „Strichliste daneben“ wie in Lernsachen-Heft 1.49.0.
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
type El = { id: string; x: number; width: number; settings?: { tool?: string; werkzeug?: { cats?: { label: string }[]; fields?: { label: string }[] } } };
const elements = async (page: Page, id: string): Promise<El[]> => (await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id } })).json()).pages[0].elements;

test('Glücksrad mit Strichliste daneben: kommt dazu, übernimmt neue Felder', async ({ page }) => {
  await login(page);
  const spin = { id: uuid(), type: 'widget', widgetKind: 'werkzeug', x: 8.5, y: 23, width: 130, height: 160, rotation: 0, locked: false, color: '#253c42',
    settings: { title: 'Glücksrad', tool: 'spin', werkzeug: { mode: 'wheel', fields: [{ label: 'Apfel', color: '#e03131' }, { label: 'Birne', color: '#1c7ed6' }] } } };
  const { book } = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Glücksrad', pages: [{ ...newPage('blanko', 'landscape'), elements: [spin] }] } })).json();
  await page.goto(`/heft/${book.id}`);
  const configure = page.getByRole('dialog', { name: 'Lernwerkzeug gestalten', exact: true });
  const open = async () => {
    await page.locator('.interaction-surface').click({ position: { x: 5, y: 5 } });
    await page.locator('.interaction-surface .page-element').first().click({ position: { x: 3, y: 3 }, force: true });
    await page.keyboard.press('Enter');
    await expect(configure).toBeVisible();
  };
  await open();
  await configure.getByLabel('Felder des Rads').fill('Anna\nBen\nCem');
  const toggle = configure.getByRole('switch', { name: /Strichliste daneben/ });
  if (!(await toggle.isChecked())) await toggle.check({ force: true });
  await expect(configure.getByText(/Eine Strichliste auf dieser Seite bekommt die neuen Felder/)).toBeVisible();
  await configure.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(configure).toHaveCount(0);
  await expect(page.locator('.interaction-surface .page-element')).toHaveCount(2);
  await page.screenshot({ path: test.info().outputPath('gluecksrad-strichliste.png') });
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  let els = await elements(page, book.id);
  const wheel = els.find((e) => e.settings?.tool === 'spin')!, tally = els.find((e) => e.settings?.tool === 'tally')!;
  expect(tally.settings!.werkzeug!.cats!.map((c) => c.label)).toEqual(['Anna', 'Ben', 'Cem']);
  expect(tally.x).toBeGreaterThan(wheel.x + wheel.width);

  // New fields: the same tally takes them, no second one.
  await open();
  await configure.getByLabel('Felder des Rads').fill('Ben\nDora');
  await configure.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(configure).toHaveCount(0);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  els = await elements(page, book.id);
  expect(els.filter((e) => e.settings?.tool === 'tally')).toHaveLength(1);
  expect(els.find((e) => e.settings?.tool === 'tally')!.settings!.werkzeug!.cats!.map((c) => c.label)).toEqual(['Ben', 'Dora']);
});
