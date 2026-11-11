import { test, expect, type Page } from '@playwright/test';
import { unzipSync, strFromU8 } from 'fflate';
import { readFile } from 'node:fs/promises';
import { newPage, uuid, type PageElement } from '../../src/lib/notebook-model';
import { guideEdges, projectToGuideEdge, type DrawingGuide } from '../../src/lib/drawing-guide';

const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}
async function create(page: Page) {
  const stroke: PageElement = {
    id: uuid(), type: 'stroke', x: 20, y: 50, width: 160, height: 10,
    rotation: 0, locked: false, color: '#123456', penWidth: 2, opacity: 1,
    points: [{ x: 0, y: 5, pressure: 0.5 }, { x: 160, y: 5, pressure: 0.5 }],
  };
  const response = await page.request.post('/api/werkstatt', {
    headers: origin, data: { action: 'create', title: 'Radierprobe',
      pages: [{ ...newPage(), elements: [stroke] }] },
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
}
async function rub(page: Page, y = 55, elements = 1) {
  await page.getByRole('button', { name: 'Radierer', exact: true }).click();
  await page.getByRole('group', { name: 'Radierart' }).getByRole('button', { name: 'Fläche radieren' }).click();
  await page.getByRole('group', { name: 'Größe' }).getByRole('button', { name: '10 mm' }).click();
  const surface = page.locator('.interaction-surface');
  const box = (await surface.boundingBox())!;
  const x = box.x + box.width * 100 / 210;
  await page.mouse.move(x, box.y + box.height * (y - 15) / 297);
  await page.mouse.down();
  // One move crosses the entire stroke: event gaps must not leave paint behind.
  await page.mouse.move(x, box.y + box.height * (y + 15) / 297);
  await page.mouse.up();
  await expect(surface.locator('.page-element')).toHaveCount(elements);
  await expect(surface.locator('mask')).toHaveCount(1);
}

test('Flächenradieren, Undo/Redo, Neuladen und Heftdatei erhalten dieselbe Zeichnung', async ({ page }) => {
  await login(page);
  const created = await create(page);
  await page.goto(`/heft/${created.book.id}`);
  await rub(page);
  await page.getByRole('button', { name: 'Zurück', exact: true }).click();
  await expect(page.locator('.interaction-surface mask')).toHaveCount(0);
  await page.getByRole('button', { name: 'Wiederholen', exact: true }).click();
  await expect(page.locator('.interaction-surface mask')).toHaveCount(1);
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  await page.reload();
  await expect(page.locator('.interaction-surface mask')).toHaveCount(1);
  await page.getByRole('button', { name: 'Dateien', exact: true }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: /Bearbeitbare Heftdatei/ }).click();
  const download = await pending;
  const target = test.info().outputPath('radierprobe.grundschulbuch');
  await download.saveAs(target);
  const files = unzipSync(new Uint8Array(await readFile(target)));
  const exported = JSON.parse(strFromU8(files['heft.json']));
  expect(exported.pages[0].elements[0].erasures).toHaveLength(1);
  expect(exported.pages[0].elements[0].points).toEqual(created.pages[0].elements[0].points);
});

test('Kinder verwenden denselben Flächenradierer und können die Änderung wieder öffnen', async ({ page, browser }) => {
  await login(page);
  const created = await create(page);
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy();
    return response.json();
  };
  let klass = await request('create', { title: 'Radierklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Nora' });
  const digest = 'e'.repeat(64);
  await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: created.book.id });
  const context = await browser.newContext();
  try {
    const child = await context.newPage();
    await child.goto('/kinder');
    const response = await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } });
    expect(response.ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    await child.getByRole('button', { name: 'Stift', exact: true }).click();
    const box = (await child.locator('.interaction-surface').boundingBox())!;
    await child.mouse.move(box.x + box.width * 20 / 210, box.y + box.height * 100 / 297);
    await child.mouse.down();
    await child.mouse.move(box.x + box.width * 180 / 210, box.y + box.height * 100 / 297, { steps: 8 });
    await child.mouse.up();
    await rub(child, 100, 2);
    await child.getByRole('button', { name: 'Meine Hefte' }).click(); await child.waitForURL(/\/kinder$/);
    await child.goto(`/kinder/heft/${copies[0].id}`);
    await expect(child.locator('.interaction-surface mask')).toHaveCount(1);
  } finally {
    await context.close();
  }
});

test('Lineal und Geodreieck führen nur an ihrer tatsächlichen gedrehten Kante', async ({ page }) => {
  await login(page);
  const created = await create(page);
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('button', { name: 'Stift', exact: true }).click();
  let count = 1;
  await page.getByRole('button', { name: 'Hilfen', exact: true }).click();
  for (const [kind, button] of [['ruler', 'Lineal'], ['triangle', 'Geodreieck']] as const) {
    await page.getByRole('button', { name: button, exact: true }).click();
    await page.getByLabel('Winkel der Zeichenhilfe', { exact: true }).fill('30');
    const guide: DrawingGuide = { kind, x: 105, y: 76, angle: 30 };
    const physical = guideEdges(guide)[0];
    const edge = guideEdges(guide, 0.8)[0];
    // Start just outside the plastic: touching the body itself moves the guide.
    const dx = physical.b.x - physical.a.x, dy = physical.b.y - physical.a.y;
    const length = Math.hypot(dx, dy);
    const start = { x: physical.a.x * 0.75 + physical.b.x * 0.25 + dy / length, y: physical.a.y * 0.75 + physical.b.y * 0.25 - dx / length };
    const end = { x: physical.a.x * 0.25 + physical.b.x * 0.75, y: physical.a.y * 0.25 + physical.b.y * 0.75 };
    const box = (await page.locator('.interaction-surface').boundingBox())!;
    const at = (p: { x: number; y: number }) => ({ x: box.x + p.x / 210 * box.width, y: box.y + p.y / 297 * box.height });
    await page.mouse.move(at(start).x, at(start).y);
    await page.mouse.down();
    // Deliberately leave the edge during the movement. The captured edge must
    // stay fixed instead of jumping to another edge or drawing parallel elsewhere.
    await page.mouse.move(at(end).x, at(end).y + 12, { steps: 8 });
    await page.mouse.up();
    await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
    const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: created.book.id } });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    const stroke = data.pages[0].elements[count++];
    for (const point of stroke.points) {
      const world = { x: stroke.x + point.x, y: stroke.y + point.y };
      const projected = projectToGuideEdge(world, edge);
      expect(Math.hypot(world.x - projected.x, world.y - projected.y)).toBeLessThan(0.00001);
    }
  }
  const guide = page.getByRole('group', { name: 'Geodreieck auf der Seite', exact: true });
  const before = await guide.getAttribute('style');
  const body = guide.locator('polygon');
  const centre = await body.evaluate(node => {
    const polygon = node as SVGPolygonElement;
    const matrix = polygon.getScreenCTM()!;
    const point = new DOMPoint(90, 65).matrixTransform(matrix);
    return { x: point.x, y: point.y };
  });
  // An ordinary point on the body, away from every handle, moves the tool.
  await page.mouse.move(centre.x, centre.y);
  await page.mouse.down();
  await page.mouse.move(centre.x + 25, centre.y + 20, { steps: 4 });
  await page.mouse.up();
  await expect(guide).not.toHaveAttribute('style', before!);
  await expect(page.locator('.interaction-surface .page-element')).toHaveCount(3);
  await guide.getByRole('button', { name: 'Geodreieck schließen', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Geodreieck auf der Seite', exact: true })).toHaveCount(0);
});

test('Pipette übernimmt eine Seitenfarbe ohne Strich; Formerkennung wartet auf Stillhalten und bleibt rückgängig', async ({ page }) => {
  await login(page);
  const created = await create(page);
  const changed = await page.request.post('/api/werkstatt', { headers: origin,
    data: { action: 'page', id: created.book.id, page: { ...created.pages[0], paperColor: '#6aa27d' } } });
  expect(changed.ok()).toBeTruthy();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('button', { name: 'Stift', exact: true }).click();
  await page.getByRole('button', { name: 'Pipette', exact: true }).click();
  const surface = page.locator('.interaction-surface');
  const box = (await surface.boundingBox())!;
  await page.mouse.click(box.x + box.width * 0.2, box.y + box.height * 0.4);
  await expect(page.getByLabel('Stiftfarbe', { exact: true })).toHaveValue('#6aa27d');
  await expect(surface.locator('.page-element')).toHaveCount(1);
  await page.getByRole('button', { name: 'Hilfen', exact: true }).click();
  await page.getByRole('group', { name: 'Formen erkennen' }).getByRole('button', { name: 'Erkennen' }).click();
  const at = (x: number, y: number) => ({ x: box.x + x / 210 * box.width, y: box.y + y / 297 * box.height });
  const start = at(30, 110);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  for (const [x, y] of [[140, 110], [140, 180], [30, 180], [30, 110]]) {
    const target = at(x, y);
    await page.mouse.move(target.x, target.y, { steps: 16 });
  }
  await expect(page.getByText('Form erkannt – zum Übernehmen loslassen.', { exact: true })).toBeVisible();
  await page.mouse.up();
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: created.book.id } });
  const data = await response.json();
  expect(data.pages[0].elements[1].geometry).toBe('rectangle');
  await page.getByRole('button', { name: 'Zurück', exact: true }).click();
  await expect(surface.locator('.page-element')).toHaveCount(1);
  await page.getByRole('button', { name: 'Wiederholen', exact: true }).click();
  await expect(surface.locator('.page-element')).toHaveCount(2);
});

test('Formerkennung toleriert laufendes Haltezittern und eine Absetzbewegung', async ({ page }) => {
  await login(page);
  const created = await create(page);
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('button', { name: 'Stift', exact: true }).click();
  await page.getByRole('button', { name: 'Hilfen', exact: true }).click();
  await page.getByRole('group', { name: 'Formen erkennen' }).getByRole('button', { name: 'Erkennen' }).click();
  const box = (await page.locator('.interaction-surface').boundingBox())!;
  const at = (x: number, y: number) => ({ x: box.x + x / 210 * box.width, y: box.y + y / 297 * box.height });
  const start = at(30, 110);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  for (const [x, y] of [[140, 110], [140, 180], [30, 180], [30, 110]]) {
    const target = at(x, y);
    await page.mouse.move(target.x, target.y, { steps: 16 });
  }
  for (let i = 0; i < 20; i++) {
    await page.mouse.move(start.x + (i % 2 ? 2 : -2), start.y + (i % 2 ? 1 : -1));
    await page.waitForTimeout(40);
  }
  // No extra stationary wait that would conceal a timer-reset regression.
  await expect(page.getByText('Form erkannt – zum Übernehmen loslassen.', { exact: true })).toBeVisible({ timeout: 150 });
  await page.mouse.move(start.x + 5, start.y);
  await page.mouse.up();
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: created.book.id } });
  expect(response.ok()).toBeTruthy();
  expect((await response.json()).pages[0].elements[1].geometry).toBe('rectangle');
});

test('Zweiteilige Pfeile zeigen eine gemeinsame Vorschau und stellen beim Rückgängigmachen die Linie wieder her', async ({ page }) => {
  await login(page);
  const created = await create(page);
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('button', { name: 'Stift', exact: true }).click();
  await page.getByRole('button', { name: 'Hilfen', exact: true }).click();
  await page.getByRole('group', { name: 'Formen erkennen' }).getByRole('button', { name: 'Erkennen' }).click();
  const surface = page.locator('.interaction-surface'), box = (await surface.boundingBox())!;
  const draw = async (vertices: number[][]) => {
    await page.mouse.move(box.x + vertices[0][0] / 210 * box.width, box.y + vertices[0][1] / 297 * box.height);
    await page.mouse.down();
    for (const [x, y] of vertices.slice(1)) await page.mouse.move(box.x + x / 210 * box.width, box.y + y / 297 * box.height, { steps: 16 });
    await expect(page.getByText('Form erkannt – zum Übernehmen loslassen.', { exact: true })).toBeVisible();
  };
  await draw([[30, 130], [150, 130]]);
  await page.mouse.up();
  await expect(surface.locator('.page-element')).toHaveCount(2);
  await draw([[120, 110], [150, 130], [120, 150]]);
  // Original shaft is hidden while the combined arrow is previewed.
  await expect(surface.locator('.page-element')).toHaveCount(2);
  await page.mouse.up();
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  const saved = async () => {
    const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: created.book.id } });
    expect(response.ok()).toBeTruthy();
    return (await response.json()).pages[0].elements;
  };
  expect((await saved()).map((el: PageElement) => el.geometry)).toEqual([undefined, 'arrow']);
  await page.getByRole('button', { name: 'Zurück', exact: true }).click();
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  expect((await saved()).map((el: PageElement) => el.geometry)).toEqual([undefined, 'line']);
  await page.getByRole('button', { name: 'Wiederholen', exact: true }).click();
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  expect((await saved()).map((el: PageElement) => el.geometry)).toEqual([undefined, 'arrow']);
});

test('Farbeimer prüft gedrehte SVG-Formen und füllt eine aus mehreren Strichen gebildete Fläche', async ({ page }) => {
  await login(page);
  const corners = [[20, 120], [170, 120], [170, 220], [20, 220], [20, 120]];
  const borders: PageElement[] = corners.slice(1).map(([x, y], i) => ({
    id: uuid(), type: 'stroke', x: 0, y: 0, width: 210, height: 297, rotation: 0,
    locked: false, color: '#000000', penWidth: 2, opacity: 1, penStyle: 'pen', brushVersion: 2,
    points: [{ x: corners[i][0], y: corners[i][1], pressure: 0.5 }, { x, y, pressure: 0.5 }],
  }));
  const ellipse: PageElement = { id: uuid(), type: 'shape', shape: 'ellipse', x: 40, y: 30, width: 80, height: 40, rotation: 45,
    locked: false, color: '#000000', fill: '#ffffff', strokeWidth: 1 };
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: {
    action: 'create', title: 'Füllprobe', pages: [{ ...newPage(), ruling: 'blanko', elements: [...borders, ellipse] }],
  } });
  expect(response.ok()).toBeTruthy(); const created = await response.json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('button', { name: 'Stift', exact: true }).click();
  await page.getByRole('button', { name: 'Farbeimer', exact: true }).click();
  await page.getByLabel('Stiftfarbe', { exact: true }).fill('#ff0000');
  await page.getByRole('button', { name: 'Geschlossene Form', exact: true }).click();
  const surface = page.locator('.interaction-surface'), box = (await surface.boundingBox())!;
  const click = async (x: number, y: number) => page.mouse.click(box.x + x / 210 * box.width, box.y + y / 297 * box.height);
  // A rotated corner is inside the element box but outside its actual ellipse.
  await click(80 + (-32 + 16) / Math.sqrt(2), 50 + (-32 - 16) / Math.sqrt(2));
  await expect(surface.locator('.page-element')).toHaveCount(5);
  const opened = async () => {
    const result = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: created.book.id } });
    expect(result.ok()).toBeTruthy(); return (await result.json()).pages[0];
  };
  expect((await opened()).elements[4].fill).toBe('#ffffff');
  await click(80, 50);
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  expect((await opened()).elements[4].fill).toBe('#ff0000');
  await page.getByRole('button', { name: 'Zusammenhängende Fläche', exact: true }).click();
  await click(80, 170);
  await expect(surface.locator('.page-element')).toHaveCount(6);
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  const saved = await opened();
  expect(saved.elements[5].fillOnly).toBe(true);
  expect(saved.elements[5].fill).toBe('#ff0000');
  expect(saved.elements[5].x).toBeGreaterThan(18);
  expect(saved.elements[5].x + saved.elements[5].width).toBeLessThan(172);
  expect(saved.paperColor).toBe(created.pages[0].paperColor);
  await page.getByRole('button', { name: 'Zurück', exact: true }).click();
  await expect(surface.locator('.page-element')).toHaveCount(5);
  await page.getByRole('button', { name: 'Wiederholen', exact: true }).click();
  await expect(surface.locator('.page-element')).toHaveCount(6);
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  await page.reload();
  await expect(surface.locator('.page-element')).toHaveCount(6);
});

test('Kinder können denselben Farbeimer verwenden und die Füllung erneut öffnen', async ({ page, browser }) => {
  await login(page);
  const created = await create(page);
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Füllklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Nora' });
  const digest = 'f'.repeat(64);
  await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: created.book.id });
  const context = await browser.newContext();
  try {
    const child = await context.newPage();
    await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    await child.getByRole('button', { name: 'Stift', exact: true }).click();
    await child.getByRole('button', { name: 'Farbeimer', exact: true }).click();
    await child.getByRole('button', { name: 'Zusammenhängende Fläche', exact: true }).click();
    const surface = child.locator('.interaction-surface'), box = (await surface.boundingBox())!;
    await child.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.4);
    await expect(surface.locator('.page-element')).toHaveCount(2);
    await child.getByRole('button', { name: 'Meine Hefte' }).click(); await child.waitForURL(/\/kinder$/);
    await child.goto(`/kinder/heft/${copies[0].id}`);
    await expect(child.locator('.interaction-surface')).toBeVisible();
    await expect(child.locator('.interaction-surface .page-element')).toHaveCount(2);
  } finally { await context.close(); }
});

test('Laser und Taschenlampe verändern weder Seiteninhalt noch Undo-Verlauf', async ({ page }) => {
  await login(page);
  const created = await create(page);
  await page.goto(`/heft/${created.book.id}`);
  // Enter presentation without depending on a browser's fullscreen permission.
  await page.keyboard.press('Alt+f');
  await expect(page.locator('.editor')).toHaveClass(/board-mode/);
  await page.getByRole('button', { name: 'Laserpointer', exact: true }).click();
  const laser = page.getByRole('region', { name: 'Laserpointer auf der Seite', exact: true });
  const box = (await laser.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.4);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.6, { steps: 12 });
  await page.mouse.up();
  await expect(laser.locator('[data-laser-dot]')).toHaveCount(1);
  await expect(page.locator('.interaction-surface .page-element')).toHaveCount(1);
  await laser.focus();
  const before = await laser.locator('[data-laser-dot] circle').first().getAttribute('cx');
  await page.keyboard.press('ArrowRight');
  expect(Number(await laser.locator('[data-laser-dot] circle').first().getAttribute('cx'))).toBeGreaterThan(Number(before));
  await page.getByRole('button', { name: 'Taschenlampe', exact: true }).click();
  const light = page.getByRole('region', { name: 'Taschenlampe auf der Seite', exact: true });
  await expect(light).toBeVisible();
  const radius = Number(await light.locator('mask circle').getAttribute('r'));
  await page.getByRole('group', { name: 'Lichtkreisgröße' }).getByRole('button', { name: 'Groß' }).click();
  expect(Number(await light.locator('mask circle').getAttribute('r'))).toBeGreaterThan(radius);
  await light.focus(); await page.keyboard.press('Escape');
  await expect(page.locator('.board-pointer')).toHaveCount(0);
  await expect(page.locator('.editor')).toHaveClass(/board-mode/);
  await page.getByRole('button', { name: 'Tafelmodus beenden', exact: true }).click();
  await expect(page.locator('.editor')).not.toHaveClass(/board-mode/);
  await expect(page.getByRole('button', { name: 'Zurück', exact: true })).toBeDisabled();
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: created.book.id } });
  expect(response.ok()).toBeTruthy();
  expect((await response.json()).pages).toEqual(created.pages);
});

test('Seitenwechsel verwirft Laserspuren; Schreiben wird nach Beenden der Zeigehilfe wieder möglich', async ({ page }) => {
  await login(page);
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Tafelprobe', pages: [newPage(), newPage()] } });
  expect(response.ok()).toBeTruthy(); const created = await response.json();
  await page.goto(`/heft/${created.book.id}`);
  await page.keyboard.press('Alt+f');
  await page.getByRole('button', { name: 'Laserpointer', exact: true }).click();
  const layer = page.locator('.board-pointer');
  const box = (await layer.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5);
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5, { steps: 8 });
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await expect(page.locator('.board-controls')).toContainText('2 / 2');
  await expect(layer.locator('[data-laser-dot]')).toHaveCount(0);
  await expect(layer.locator('.board-laser-trail line')).toHaveCount(0);
  await page.getByRole('button', { name: 'Auf der Tafel schreiben', exact: true }).click();
  await expect(layer).toHaveCount(0);
  const surface = page.locator('.interaction-surface'), next = (await surface.boundingBox())!;
  await page.mouse.move(next.x + next.width * 0.2, next.y + next.height * 0.4);
  await page.mouse.down();
  await page.mouse.move(next.x + next.width * 0.8, next.y + next.height * 0.5, { steps: 12 });
  await page.mouse.up();
  await expect(surface.locator('.page-element')).toHaveCount(1);
  await page.getByRole('button', { name: 'Laserpointer', exact: true }).click();
  await page.getByRole('button', { name: 'Zeigehilfe beenden', exact: true }).click();
  await page.getByRole('button', { name: 'Tafelmodus beenden', exact: true }).click();
  await page.getByRole('button', { name: 'Zurück', exact: true }).click();
  await expect(surface.locator('.page-element')).toHaveCount(0);
});
