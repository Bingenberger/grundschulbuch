import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const labelled = (text: string) => ({ ...newPage(), elements: [{ id: uuid(), type: 'text', x: 20, y: 20, width: 100, height: 20, rotation: 0,
  locked: false, color: '#253c42', text, font: 'Andika', fontSize: 18 }] });

test('Kachelansicht: Seiten ziehen, mehrere verschieben, löschen mit Rückgängig, duplizieren und öffnen', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Kachelprobe',
    pages: [1, 2, 3, 4, 5].map((n) => labelled(`Inhalt ${n}`)) } })).json();
  const order = async () => {
    const data = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: created.book.id } })).json();
    return data.pages.map((p: { elements: { text: string }[] }) => p.elements[0]?.text.replace('Inhalt ', '')).join('');
  };
  await page.goto(`/heft/${created.book.id}`);

  // The page settings are grouped clearly.
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Seite', exact: true }).click();
  const sections = page.getByRole('group', { name: 'Seite einstellen: Bereiche' }).getByRole('button');
  await expect(sections).toHaveText([/Papier/, /Farben & Bild/, /Rahmen/, /Vorlage/, /Seiten/]);

  await page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Kachelansicht' }).click();
  const tiles = page.getByRole('dialog', { name: 'Alle Seiten' });
  const tile = (n: number) => tiles.getByRole('checkbox', { name: new RegExp(`^Seite ${n}\\b`) });
  await expect(tiles.getByRole('checkbox')).toHaveCount(5);
  await expect(tile(1).locator('.paper')).toBeVisible();

  // Drag page 5 in front of page 1.
  const from = (await tile(5).boundingBox())!, to = (await tile(1).boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + 30, to.y + to.height / 2, { steps: 8 });
  await page.mouse.move(to.x + 4, to.y + to.height / 2, { steps: 4 });
  await page.mouse.up();
  await expect.poll(order).toBe('51234');

  // Pick pages 2 and 3 (that is “1” and “2”), move them back, delete them, undo.
  await tile(2).click();
  await tiles.getByRole('button', { name: 'Seite 3 dazuwählen' }).click();
  await expect(tiles.getByRole('status')).toHaveText('2 Seiten gewählt');
  await tiles.getByRole('button', { name: 'Nach hinten' }).click();
  await expect.poll(order).toBe('53124');
  await tiles.getByRole('button', { name: 'Löschen' }).click();
  await expect(tiles.getByRole('checkbox')).toHaveCount(3);
  await expect.poll(order).toBe('534');
  await page.getByRole('status').filter({ hasText: '2 Seiten gelöscht' }).getByRole('button', { name: 'Rückgängig' }).click();
  await expect.poll(order).toBe('53124');
  await expect(tiles.getByRole('checkbox')).toHaveCount(5);

  // Duplicate the first page, then open the copy with a double-click.
  await tile(1).click();
  await tiles.getByRole('button', { name: 'Duplizieren' }).click();
  await expect.poll(order).toBe('553124');
  await tile(2).dblclick();
  await expect(tiles).toHaveCount(0);
  await expect(page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Seite 2 öffnen' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.interaction-surface').getByText('Inhalt 5')).toBeVisible();
});
