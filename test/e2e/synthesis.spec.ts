import { test, expect, type Page, type Locator } from '@playwright/test';
import { defaultSettings, type LearningSettings } from '../../src/lib/learning/catalog';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}
async function create(page: Page, settings: Partial<LearningSettings> = {}, rotation = 0) {
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Lauteprobe', pages: [{ ...newPage(), elements: [{
    id: uuid(), type: 'widget', widgetKind: 'synthesis', x: 15, y: 35, width: 180, height: 180, rotation, locked: false, color: '#253c42',
    settings: { ...defaultSettings('synthesis'), synthesisMode: 'pairs', synthesisPairs: [{ left: 'm', right: 'a' }], synthesisSpeak: false, ...settings },
  }] }] } });
  expect(response.ok()).toBeTruthy(); return response.json();
}
async function points(svg: Locator) {
  return svg.evaluate(node => {
    const matrix = (node as SVGSVGElement).getScreenCTM()!;
    const start = new DOMPoint(18, 38).matrixTransform(matrix), partial = new DOMPoint(35, 38).matrixTransform(matrix), end = new DOMPoint(59, 38).matrixTransform(matrix);
    return { start: { x: start.x, y: start.y }, partial: { x: partial.x, y: partial.y }, end: { x: end.x, y: end.y } };
  });
}

test('Tippen und abgebrochenes Ziehen zählen nicht; gedrehte Karten verbinden sich beim tatsächlichen Kontakt', async ({ page }) => {
  await login(page); const data = await create(page, {}, 17);
  await page.goto(`/heft/${data.book.id}`);
  const widget = page.locator('.interaction-surface .synthesis-widget'), stage = widget.getByRole('button', { name: 'Laut m zu a ziehen', exact: true });
  const p = await points(stage);
  await page.mouse.click(p.start.x, p.start.y);
  await expect(widget.locator('.synthesis-collection .collected')).toHaveCount(0);
  await page.mouse.move(p.start.x, p.start.y); await page.mouse.down();
  await page.mouse.move(p.partial.x, p.partial.y, { steps: 6 }); await page.mouse.up();
  await expect(stage.locator('[data-synthesis-drag]')).toHaveAttribute('transform', 'translate(0 0)');
  await expect(widget.locator('.synthesis-collection .collected')).toHaveCount(0);
  await page.getByRole('button', { name: '✎ Stift', exact: true }).click();
  await expect(stage).toHaveAttribute('aria-disabled', 'true');
  await page.getByRole('button', { name: '↖ Auswahl', exact: true }).click();
  const next = await points(stage);
  await page.mouse.move(next.start.x, next.start.y); await page.mouse.down();
  await page.mouse.move(next.end.x, next.end.y, { steps: 12 }); await page.mouse.up();
  await expect(widget.locator('.synthesis-delivery')).toHaveAttribute('aria-label', 'Verbunden: ma');
  await expect(widget.getByRole('heading', { name: 'Geschafft!', exact: true })).toBeVisible();
  await expect(widget.locator('.synthesis-collection .collected')).toHaveText(['ma']);
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  const opened = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: data.book.id } });
  expect(opened.ok()).toBeTruthy(); const response = (await opened.json()).pages[0].elements[0].response;
  expect(response.synthesis.phase).toBe('complete'); expect(response.score).toBe(100); expect(response.completed).toBe(true);
  await page.reload(); await expect(widget.getByRole('heading', { name: 'Geschafft!', exact: true })).toBeVisible();
});

test('Tastaturbedienung führt durch die Serie und ein Neustart beendet laufenden Transport', async ({ page }) => {
  await login(page); const data = await create(page, { synthesisPairs: [{ left: 'm', right: 'a' }, { left: 'l', right: 'i' }] });
  await page.goto(`/heft/${data.book.id}`);
  const widget = page.locator('.interaction-surface .synthesis-widget');
  await widget.getByRole('button', { name: 'Laut m zu a ziehen', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(widget.locator('.synthesis-delivery')).toBeVisible();
  await widget.getByRole('button', { name: 'Von vorn', exact: true }).click();
  await expect(widget.locator('.synthesis-delivery')).toHaveCount(0);
  await expect(widget.locator('.synthesis-collection .collected')).toHaveCount(0);
  await page.waitForTimeout(1800);
  await expect(widget.getByRole('button', { name: 'Laut m zu a ziehen', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  const second = widget.getByRole('button', { name: 'Laut l zu i ziehen', exact: true });
  await expect(second).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(widget.getByRole('heading', { name: 'Geschafft!', exact: true })).toBeVisible();
  await expect(widget.getByRole('button', { name: 'Nochmal', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(widget.getByRole('button', { name: 'Laut m zu a ziehen', exact: true })).toBeFocused();
});

test('Kinder bearbeiten die gesperrte Übung und können ihre gesammelten Silben erneut öffnen', async ({ page, browser }) => {
  await login(page); const data = await create(page);
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Lauteklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Nora' });
  const digest = '8'.repeat(64);
  await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: data.book.id });
  const context = await browser.newContext();
  try {
    const child = await context.newPage(); await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    const widget = child.locator('.interaction-surface .synthesis-widget');
    await widget.getByRole('button', { name: 'Laut m zu a ziehen', exact: true }).focus();
    await child.keyboard.press('Enter');
    await expect(widget.getByRole('heading', { name: 'Geschafft!', exact: true })).toBeVisible();
    await child.getByRole('button', { name: '‹ Meine Hefte' }).click(); await child.waitForURL(/\/kinder$/);
    await child.goto(`/kinder/heft/${copies[0].id}`);
    await expect(widget.locator('.synthesis-collection .collected')).toHaveText(['ma']);
    await expect(widget.getByRole('heading', { name: 'Geschafft!', exact: true })).toBeVisible();
  } finally { await context.close(); }
});
