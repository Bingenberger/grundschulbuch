import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page, name = 'Frau Beispiel') {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill(name); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
/** Colour of a picture at a relative position. */
async function colourAt(page: Page, src: string, x: number, y: number) {
  return page.evaluate(async ([src, x, y]) => {
    const image = new Image();
    image.src = src as string;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const d = context.getImageData(Math.floor((x as number) * canvas.width), Math.floor((y as number) * canvas.height), 1, 1).data;
    return { r: d[0], g: d[1], b: d[2], width: canvas.width, height: canvas.height };
  }, [src, x, y] as const);
}

test('Bild bearbeiten: drehen, zuschneiden, Effekt, Balken – das Ergebnis entsteht auf dem Server', async ({ page, browser }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Bildbearbeitung' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const surface = page.locator('.interaction-surface');
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Bild', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Ein Bild einfügen' });
  await dialog.getByRole('button', { name: 'Schulgalerie', exact: true }).click();
  await dialog.locator('.image-hit').filter({ hasText: 'Apfel' }).click();
  const picture = surface.locator('.page-element img');
  await expect(picture).toHaveCount(1);
  const original = (await picture.getAttribute('src'))!;

  await page.getByRole('region', { name: 'Element einstellen' }).getByRole('button', { name: 'Bild bearbeiten' }).click();
  const editor = page.getByRole('dialog', { name: 'Bild bearbeiten' });
  const tools = editor.getByRole('toolbar', { name: 'Werkzeuge' });
  const stage = editor.getByRole('img', { name: 'Vorschau des Bildes' });
  await expect(stage).toBeVisible();
  await tools.getByRole('button', { name: 'Rechts drehen' }).click();
  await tools.getByRole('button', { name: 'Zuschneiden', exact: true }).click();
  await editor.getByRole('group', { name: 'Seitenverhältnis' }).getByRole('button', { name: 'Quadrat' }).click();
  await editor.getByRole('button', { name: 'Ausschnitt übernehmen' }).click();
  await editor.getByRole('group', { name: 'Effekte – auch mehrere zusammen' }).getByRole('button', { name: 'Schwarzweiß' }).click();
  await expect(editor.getByRole('slider', { name: 'Schwarzweiß: Stärke' })).toHaveValue('100');
  await tools.getByRole('button', { name: 'Balken' }).click();
  const box = (await stage.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.05, box.y + box.height * 0.05);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3, { steps: 4 });
  await page.mouse.up();
  await expect(tools.getByRole('button', { name: 'Rückgängig' })).toBeEnabled();
  await editor.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(editor).toHaveCount(0, { timeout: 15000 });

  // New file, square like the crop, the frame follows the new proportions.
  const edited = (await picture.getAttribute('src'))!;
  expect(edited).not.toBe(original);
  const element = surface.locator('.page-element').first();
  const [w, h] = await element.evaluate((el) => [parseFloat((el as HTMLElement).style.width), parseFloat((el as HTMLElement).style.height)]);
  expect(Math.abs(w - h)).toBeLessThan(0.5);
  const black = await colourAt(page, edited, 0.15, 0.15);
  expect(black.width).toBe(black.height);
  expect(Math.max(black.r, black.g, black.b)).toBeLessThan(40);
  const gray = await colourAt(page, edited, 0.7, 0.7);
  expect(Math.abs(gray.r - gray.g)).toBeLessThan(6);
  expect(gray.r).toBeGreaterThan(60);

  // Others cannot edit this picture.
  const context = await browser.newContext();
  const other = await context.newPage();
  await login(other, 'Herr Muster');
  const response = await other.request.post('/api/medien/bearbeiten', { headers: origin, data: { src: edited, steps: [{ type: 'flip' }], effects: {} } });
  expect(response.status()).toBe(403);
  await context.close();
});
