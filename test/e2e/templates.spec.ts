import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const open = async (page: Page, id: string) =>
  (await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id } })).json()) as {
    pages: { orientation: string; ruling: string; template?: string; elements: { type: string; text?: string }[] }[];
  };

test('Neue Seite über „+“: Vorlagen mit echter Vorschau, standardmäßig im Querformat; Vorlage wechseln behält den Inhalt', async ({ page }) => {
  await login(page);
  const note = { id: uuid(), type: 'text', x: 20, y: 20, width: 100, height: 20, rotation: 0, locked: false, color: '#253c42', text: 'Bleibt stehen', font: 'Andika', fontSize: 18 };
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Vorlagenprobe', pages: [{ ...newPage(), elements: [note] }] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const panel = page.getByRole('complementary', { name: 'Seitenübersicht' });

  await panel.getByRole('button', { name: 'Neue Seite', exact: true }).click();
  const chooser = page.getByRole('dialog', { name: 'Neue Seite' });
  await expect(chooser.getByRole('group', { name: 'Format' }).getByRole('button', { name: 'Querformat' })).toHaveAttribute('aria-pressed', 'true');
  // Real previews: the template pages are drawn, not just named.
  const first = chooser.getByRole('button', { name: 'Vorlage Lineatur 1' });
  await expect(first.locator('.scaled-page .paper')).toBeVisible();
  await expect(first.locator('.lineatur')).toHaveCount(1);
  const comic = chooser.getByRole('button', { name: 'Vorlage Comic: vier Bilder' });
  await comic.scrollIntoViewIfNeeded();
  await expect(comic.locator('.page-element').first()).toBeAttached();
  await chooser.getByRole('searchbox', { name: 'Vorlage suchen' }).fill('Comic vier');
  await expect(chooser.locator('.template-card')).toHaveCount(1);
  await chooser.getByRole('button', { name: 'Vorlage Comic: vier Bilder' }).click();
  await expect(chooser).toHaveCount(0);
  await expect(panel.getByRole('button', { name: 'Seite 2 öffnen' })).toHaveAttribute('aria-current', 'page');

  let data = await open(page, created.book.id);
  await expect.poll(async () => (data = await open(page, created.book.id)).pages.length).toBe(2);
  expect(data.pages[1].orientation).toBe('landscape');
  expect(data.pages[1].template).toBe('bp-comic-' + data.pages[1].template!.split('-').slice(2).join('-'));
  expect(data.pages[1].elements.length).toBeGreaterThan(4);

  // Recently used templates come first next time.
  await panel.getByRole('button', { name: 'Neue Seite', exact: true }).click();
  await expect(chooser.locator('.template-group').first()).toContainText('Zuletzt benutzt');
  await chooser.getByRole('button', { name: 'Schließen' }).click();

  // Change the template of page 1: new ruling, the text stays, the format too.
  await panel.getByRole('button', { name: 'Seite 1 öffnen' }).click();
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Seite', exact: true }).click();
  const bar = page.getByRole('region', { name: 'Seite einstellen' });
  await bar.getByRole('button', { name: 'Vorlage', exact: true }).click();
  await bar.getByRole('button', { name: 'Andere Vorlage wählen' }).click();
  const change = page.getByRole('dialog', { name: 'Vorlage für diese Seite' });
  await expect(change.getByRole('group', { name: 'Format' }).getByRole('button', { name: 'Querformat' })).toBeDisabled();
  await change.getByRole('button', { name: 'Vorlage Lineatur 1' }).click();
  await expect(change).toHaveCount(0);
  await expect(page.locator('.interaction-surface').getByText('Bleibt stehen')).toBeVisible();
  await expect.poll(async () => {
    const pages = (await open(page, created.book.id)).pages;
    return [pages[0].ruling, pages[0].orientation, pages[0].template, pages[0].elements.map((e) => e.text).join()];
  }, { timeout: 10000 }).toEqual(['linie1', 'portrait', 'paper-linie1', 'Bleibt stehen']);
  // The chooser marks the current template.
  await bar.getByRole('button', { name: 'Andere Vorlage wählen' }).click();
  await expect(change.locator('.template-card.current').first()).toContainText('Lineatur 1');
});
