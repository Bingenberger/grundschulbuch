import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { PDFArray, PDFDict, PDFDocument, PDFName, PDFString } from 'pdf-lib';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}
const text = (t: string, y: number, link?: object) => ({
  id: uuid(), type: 'text', x: 20, y, width: 100, height: 20, rotation: 0,
  locked: false, color: '#253c42', text: t, font: 'Andika', fontSize: 18, ...(link ? { link } : {}),
});

test('Speichern und teilen: Kachelauswahl, Links im PDF und Speichern aus dem Regal', async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const last = { ...newPage(), elements: [text('Ziel', 20)] };
  const first = {
    ...newPage(),
    elements: [
      text('Zur Schule', 20, { kind: 'url', url: 'https://example.org/schule' }),
      text('Zur letzten Seite', 60, { kind: 'page', pageId: last.id }),
    ],
  };
  const created = await (await page.request.post('/api/werkstatt', {
    headers: origin,
    data: { action: 'create', title: 'Linkprobe', pages: [first, { ...newPage(), elements: [text('Mitte', 20)] }, last] },
  })).json();

  // Kachelansicht: Seite 1 und 3 wählen, „Speichern“ fragt nicht noch einmal nach Seiten.
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Kachelansicht' }).click();
  const tiles = page.getByRole('dialog', { name: 'Alle Seiten' });
  await tiles.getByRole('button', { name: 'Seite 3 dazuwählen' }).click();
  await expect(tiles.getByRole('status')).toHaveText('2 Seiten gewählt');
  await tiles.getByRole('button', { name: 'Speichern', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Welche Seiten speichern?' })).toHaveCount(0);
  const dialog = page.getByRole('dialog', { name: 'Speichern und teilen' });
  await expect(dialog.getByText('2 von 3 Seiten', { exact: true })).toBeVisible();

  // PDF: Internetlink und Sprung zur (im PDF zweiten) Seite.
  const pending = page.waitForEvent('download');
  await dialog.getByRole('button', { name: /^PDF/ }).click();
  const file = await pending;
  expect(file.suggestedFilename()).toBe('Linkprobe (2 Seiten).pdf');
  const pdf = await PDFDocument.load(await readFile((await file.path())!));
  expect(pdf.getPageCount()).toBe(2);
  const annots = pdf.getPage(0).node.lookup(PDFName.of('Annots'), PDFArray);
  expect(annots.size()).toBe(2);
  const uri = annots.lookup(0, PDFDict).lookup(PDFName.of('A'), PDFDict).lookup(PDFName.of('URI'), PDFString);
  expect(uri.decodeText()).toBe('https://example.org/schule');
  expect(annots.lookup(1, PDFDict).lookup(PDFName.of('Dest'), PDFArray).get(0)).toBe(pdf.getPage(1).ref);
  await dialog.getByRole('button', { name: 'Schließen', exact: true }).click();

  // Im Regal: „Speichern …“ am Heft, ohne es zu öffnen.
  await page.getByRole('button', { name: 'Mein Regal', exact: true }).click();
  await page.getByRole('button', { name: 'Linkprobe speichern' }).click();
  const picker = page.getByRole('dialog', { name: 'Welche Seiten speichern?' });
  await picker.getByRole('button', { name: 'Alle 3 Seiten – weiter', exact: true }).click();
  const archive = page.waitForEvent('download');
  await page.getByRole('dialog', { name: 'Speichern und teilen' }).getByRole('button', { name: /Bearbeitbare Heftdatei/ }).click();
  expect((await archive).suggestedFilename()).toBe('Linkprobe.grundschulbuch');
  // Das Titelbild mit Link-Elementen bricht die Hydration des Regals nicht (kein Link im Link).
  await page.reload();
  await expect(page.getByRole('link', { name: /Linkprobe/ }).first()).toBeVisible();
  expect(errors).toEqual([]);
});
