import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
// 4×4 red PNG
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAEElEQVR4nGN4amkKRwzEcQAyMhUxCReApQAAAABJRU5ErkJggg==', 'base64');
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Bilder: Quellen als Reiter, Schulgalerie, Hochladen, Platzhalter und Bildschirmfoto', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Bilderprobe' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const surface = page.locator('.interaction-surface');
  const openDialog = async () => {
    await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Bild', exact: true }).click();
    return page.getByRole('dialog', { name: 'Ein Bild einfügen' });
  };
  let dialog = await openDialog();
  const tabs = dialog.getByRole('navigation', { name: 'Bildquelle' });
  for (const name of ['Hochladen', 'Kamera', 'Platzhalter', 'Bildschirmfoto', 'ARASAAC', 'Wikimedia Commons', 'Schulgalerie'])
    await expect(tabs.getByRole('button', { name, exact: true })).toBeVisible();

  // School gallery: fetched by the server with its token, copied into the own media.
  await tabs.getByRole('button', { name: 'Schulgalerie', exact: true }).click();
  const hits = dialog.locator('.image-hit');
  await expect(hits).toHaveCount(3);
  await expect.poll(() => hits.first().locator('img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await dialog.getByRole('search').getByRole('searchbox').fill('Apfel');
  await dialog.getByRole('button', { name: 'Suchen' }).click();
  await expect(hits).toHaveCount(1);
  await hits.first().click();
  await expect(dialog).toHaveCount(0);
  const pictures = surface.locator('.page-element img');
  await expect(pictures).toHaveCount(1);
  await expect(pictures.first()).toHaveAttribute('src', /^\/api\/medien\/[a-f0-9]{64}\.webp$/);
  await expect(pictures.first()).toHaveAttribute('alt', 'Apfel (Testbild)');

  // Upload from the device.
  dialog = await openDialog();
  await dialog.getByLabel('Bilddatei auswählen').setInputFiles({ name: 'rot.png', mimeType: 'image/png', buffer: png });
  await expect(dialog).toHaveCount(0);
  await expect(pictures).toHaveCount(2);

  // Placeholder with own hint.
  dialog = await openDialog();
  await dialog.getByRole('navigation', { name: 'Bildquelle' }).getByRole('button', { name: 'Platzhalter', exact: true }).click();
  await dialog.getByLabel('Hinweis im Rahmen').fill('Male oder fotografiere dein Haustier.');
  await dialog.getByRole('group', { name: 'Form' }).getByRole('button', { name: 'Hoch', exact: true }).click();
  await dialog.getByRole('button', { name: 'Platzhalter einfügen' }).click();
  await expect(surface.locator('.image-placeholder')).toContainText('Male oder fotografiere dein Haustier.');
  // Double-click fills it; the frame keeps its size.
  const frame = surface.locator('.page-element').filter({ has: page.locator('.image-placeholder') });
  const before = await frame.evaluate((el) => [(el as HTMLElement).style.width, (el as HTMLElement).style.height]);
  await surface.locator('.move-area').dblclick();
  const fill = page.getByRole('dialog', { name: 'Bild für den Platzhalter' });
  await fill.getByLabel('Bilddatei auswählen').setInputFiles({ name: 'rot.png', mimeType: 'image/png', buffer: png });
  await expect(fill).toHaveCount(0);
  await expect(surface.locator('.image-placeholder')).toHaveCount(0);
  await expect(pictures).toHaveCount(3);
  const filled = surface.locator('.page-element').nth(2);
  expect(await filled.evaluate((el) => [(el as HTMLElement).style.width, (el as HTMLElement).style.height])).toEqual(before);

  // Screenshot of this page lands on a new page behind it.
  dialog = await openDialog();
  await dialog.getByRole('navigation', { name: 'Bildquelle' }).getByRole('button', { name: 'Bildschirmfoto', exact: true }).click();
  await dialog.getByRole('button', { name: /Diese Seite/ }).click();
  await expect(dialog).toHaveCount(0, { timeout: 15000 });
  const panel = page.getByRole('complementary', { name: 'Seitenübersicht' });
  await expect(panel.getByRole('button', { name: 'Seite 2 öffnen' })).toHaveAttribute('aria-current', 'page');
  await expect(surface.locator('.page-element img')).toHaveAttribute('alt', 'Bildschirmfoto von Seite 1');

  // The server only loads addresses its own searches hand out.
  for (const [quelle, bild] of [['galerie', 'http://127.0.0.1:3100/api/medien/x'], ['arasaac', 'https://example.org/a.png'], ['wikimedia', 'https://upload.wikimedia.org/../x']]) {
    const response = await page.request.get(`/api/bilder?${new URLSearchParams({ quelle, bild })}`);
    expect(response.status()).toBe(400);
  }
});

test('Kinder füllen einen gesperrten Foto-Platzhalter, auch ohne eigene Bilder', async ({ page, browser }) => {
  await login(page);
  const holder = { id: uuid(), type: 'image', x: 30, y: 30, width: 80, height: 55, rotation: 0, locked: true, color: '#253c42',
    placeholder: 'Fotografiere deinen Lieblingsplatz.', alt: '', fit: 'cover' };
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Fotoauftrag',
    pages: [{ ...newPage(), elements: [holder] }] } })).json();
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Fotoklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Lea' });
  const [lea] = klass.children;
  const card = Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
  await request('change', { id: klass.id, childId: lea.id, digest: card });
  // Without own pictures and searches.
  await request('change', { id: klass.id, childFeatures: ['pen', 'eraser', 'text', 'image', 'pages'] });
  const copies = await request('distribute', { id: klass.id, bookId: created.book.id });
  const book = copies.find((b: { ownerId: string }) => b.ownerId === lea.id).id;

  const context = await browser.newContext();
  const child = await context.newPage();
  await child.goto('/kinder');
  expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest: card } })).ok()).toBeTruthy();
  await child.goto(`/kinder/heft/${book}`);
  const surface = child.locator('.interaction-surface');

  // Own uploads are off …
  expect((await child.request.post('/api/medien', { headers: { ...origin, 'Content-Type': 'image/png' }, data: png })).status()).toBe(403);
  await child.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Bild', exact: true }).click();
  const dialog = child.getByRole('dialog', { name: 'Ein Bild einfügen' });
  await expect(dialog.getByRole('navigation', { name: 'Bildquelle' }).getByRole('button')).toHaveCount(1);
  await expect(dialog.getByRole('button', { name: 'Von der Lehrkraft' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Schließen' }).click();

  // … but the teacher's placeholder takes a photo.
  await surface.locator('.image-placeholder').click();
  const photo = child.getByRole('dialog', { name: 'Mach ein Foto' });
  const tabs = photo.getByRole('navigation', { name: 'Bildquelle' });
  await expect(tabs.getByRole('button')).toHaveText([/Hochladen/, /Kamera/]);
  await tabs.getByRole('button', { name: 'Hochladen', exact: true }).click();
  await photo.getByLabel('Bilddatei auswählen').setInputFiles({ name: 'platz.png', mimeType: 'image/png', buffer: png });
  await expect(photo).toHaveCount(0);
  await expect(surface.locator('.page-element img')).toHaveCount(1);
  await expect.poll(async () => {
    const data = await (await child.request.post('/api/kinder', { headers: origin, data: { action: 'open', id: book } })).json();
    return data.pages?.[0]?.elements?.[0]?.src || '';
  }, { timeout: 15000 }).toMatch(/^\/api\/medien\//);
  await child.reload();
  await expect(child.locator('.interaction-surface .page-element img')).toHaveAttribute('src', /^\/api\/medien\//);
  await context.close();
});
