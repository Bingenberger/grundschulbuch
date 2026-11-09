import { test, expect, type Page } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { newPage, uuid } from '../../src/lib/notebook-model';

async function login(page: Page, name = 'Frau Beispiel') {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill(name);
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}
test('PDF-Import erhält Hoch- und Querformat als geschützte beschreibbare Seiten', async ({
  page,
}) => {
  await login(page);
  const pdf = await PDFDocument.create();
  pdf.addPage([595.276, 841.89]);
  pdf.addPage([841.89, 595.276]);
  await page
    .getByRole('button', { name: 'Heft, ePub oder PDF öffnen', exact: true })
    .click();
  await page
    .getByLabel('Datei auswählen', { exact: true })
    .setInputFiles({
      name: 'Zwei Formate.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from(await pdf.save()),
    });
  await expect(page).toHaveURL(/\/heft\//);
  const data = await (
    await page.request.post('/api/werkstatt', {
      headers: { Origin: 'http://localhost:3100' },
      data: { action: 'open', id: page.url().split('/').pop() },
    })
  ).json();
  expect(data.pages.map((p: { orientation: string }) => p.orientation)).toEqual(
    ['portrait', 'landscape'],
  );
  expect(
    data.pages.every(
      (p: { elements: { type: string; locked: boolean; src: string }[] }) =>
        p.elements[0].type === 'image' &&
        p.elements[0].locked &&
        p.elements[0].src.startsWith('/api/medien/'),
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'T Text', exact: true }).click();
  await page
    .getByLabel('Text', { exact: true })
    .fill('Meine Antwort auf dem PDF');
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
});

test('Regalsicherung stellt Ordner, verschachtelte Medien und Sammlungen für ein anderes Konto wieder her', async ({
  page,
  browser,
}) => {
  test.setTimeout(120000);
  await login(page);
  const api = async (action: string, values: object = {}) => {
    const r = await page.request.post('/api/werkstatt', {
      headers: { Origin: 'http://localhost:3100' },
      data: { action, ...values },
    });
    expect(r.ok()).toBeTruthy();
    return r.json();
  };
  const image = await page.request.post('/api/medien', {
    headers: { Origin: 'http://localhost:3100', 'Content-Type': 'image/png' },
    data: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=',
      'base64',
    ),
  });
  expect(image.ok()).toBeTruthy();
  const { src } = await image.json();
  const content = {
    ...newPage(),
    elements: [
      {
        id: uuid(),
        type: 'widget',
        widgetKind: 'communication',
        x: 10,
        y: 10,
        width: 180,
        height: 120,
        rotation: 0,
        locked: false,
        color: '#253c42',
        settings: {
          title: 'Meine Bildtafel',
          cells: [{ label: 'Sonne', image: src }],
        },
      },
    ],
  };
  const folder = await api('folder', { title: 'Sicherung Musterordner' }),
    book = await api('create', {
      title: 'Sicherung Bildheft',
      pages: [content],
    });
  await api('update', {
    id: book.book.id,
    revision: book.book.revision,
    folderId: folder.id,
  });
  await api('template', { title: 'Sicherung Bildvorlage', page: content });
  await api('asset', { title: 'Sicherung Bildsammlung', page: content });
  await page.reload();
  await page
    .getByRole('button', { name: 'Heft, ePub oder PDF öffnen', exact: true })
    .click();
  const pending = page.waitForEvent('download');
  await page
    .getByRole('button', { name: 'Alle Hefte und Ordner sichern', exact: true })
    .click();
  const download = await pending,
    path = test.info().outputPath('regal.sicherung.zip');
  await download.saveAs(path);
  const context = await browser.newContext(),
    other = await context.newPage();
  await login(other, 'Herr Muster');
  await other
    .getByRole('button', { name: 'Heft, ePub oder PDF öffnen', exact: true })
    .click();
  await other
    .getByLabel('Sicherung wiederherstellen', { exact: true })
    .setInputFiles(path);
  await expect(other.getByRole('dialog', { name: 'Heftdateien' })).toHaveCount(
    0,
    { timeout: 60000 },
  );
  const otherApi = async (action: string) => {
    const r = await other.request.post('/api/werkstatt', {
      headers: { Origin: 'http://localhost:3100' },
      data: { action },
    });
    expect(r.ok()).toBeTruthy();
    return r.json();
  };
  const folders = await otherApi('folders'),
    books = await otherApi('list'),
    templates = await otherApi('templates'),
    assets = await otherApi('assets');
  const restored = books.find(
    (b: { title: string }) => b.title === 'Sicherung Bildheft',
  );
  expect(restored).toBeTruthy();
  expect(
    folders.find((f: { title: string }) => f.title === 'Sicherung Musterordner')
      .id,
  ).toBe(restored.folderId);
  for (const entry of [
    templates.find(
      (t: { title: string }) => t.title === 'Sicherung Bildvorlage',
    ),
    assets.find((t: { title: string }) => t.title === 'Sicherung Bildsammlung'),
  ]) {
    expect(entry).toBeTruthy();
    expect(
      (
        await other.request.get(entry.page.elements[0].settings.cells[0].image)
      ).ok(),
    ).toBeTruthy();
  }
  await context.close();
});
