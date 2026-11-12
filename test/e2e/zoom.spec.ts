import { test, expect, type Page, type CDPSession } from '@playwright/test';
import { randomBytes } from 'node:crypto';
const origin = { Origin: 'http://localhost:3100' };
test.use({ hasTouch: true });

async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
const percent = async (page: Page) => Number((await page.locator('.zoom-float .zoom-value').textContent())!.replace(/\D/g, ''));

type Finger = { x: number; y: number; id: number };
const touch = (cdp: CDPSession, type: 'touchStart' | 'touchMove' | 'touchEnd', touchPoints: Finger[]) =>
  cdp.send('Input.dispatchTouchEvent', { type, touchPoints });

/** Two fingers from distance `from` to `to` around (x, y); the first finger lands a moment earlier. */
async function pinch(cdp: CDPSession, x: number, y: number, from: number, to: number) {
  const fingers = (d: number) => [{ x: x - d / 2, y, id: 1 }, { x: x + d / 2, y, id: 2 }];
  await touch(cdp, 'touchStart', [fingers(from)[0]]);
  await touch(cdp, 'touchMove', [{ ...fingers(from)[0], y: y + 6 }]);
  await touch(cdp, 'touchStart', fingers(from));
  for (let i = 1; i <= 8; i++) await touch(cdp, 'touchMove', fingers(from + ((to - from) * i) / 8));
  await touch(cdp, 'touchEnd', []);
}
async function twoFingerTap(cdp: CDPSession, x: number, y: number) {
  const fingers = [{ x: x - 40, y, id: 1 }, { x: x + 40, y, id: 2 }];
  await touch(cdp, 'touchStart', fingers);
  await touch(cdp, 'touchEnd', []);
}

test('Zoomen mit zwei Fingern, Strg + Mausrad und Doppeltipp – ein Zwei-Finger-Zoom zeichnet nichts', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Zoomprobe' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await expect(page.locator('.zoom-float .zoom-value')).toHaveText('100 %');
  await page.getByRole('button', { name: 'Stift', exact: true }).click();
  const surface = page.locator('.interaction-surface');
  const box = (await surface.boundingBox())!;
  const cdp = await page.context().newCDPSession(page);

  await pinch(cdp, box.x + box.width / 2, box.y + box.height / 2, 100, 200);
  await expect.poll(() => percent(page)).toBeGreaterThan(160);
  await expect(surface.locator('.page-element')).toHaveCount(0);
  const pinched = await percent(page);

  // Zooming out with two fingers.
  const area = (await page.locator('.canvas-scroll').boundingBox())!;
  await pinch(cdp, area.x + area.width / 2, area.y + area.height / 2, 200, 100);
  await expect.poll(() => percent(page)).toBeLessThan(pinched - 40);

  // Ctrl + wheel (also what a trackpad pinch sends in Chrome) zooms around the pointer.
  const before = await percent(page);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.keyboard.down('Control');
  await page.mouse.wheel(0, -100);
  await page.keyboard.up('Control');
  await expect.poll(() => percent(page)).toBeGreaterThan(before);

  // Double tap with two fingers: whole page.
  await page.getByRole('button', { name: 'Ganze Seite', exact: true }).click();
  const fit = await percent(page);
  await page.getByRole('button', { name: 'Ansicht vergrößern', exact: true }).click();
  await page.getByRole('button', { name: 'Ansicht vergrößern', exact: true }).click();
  await expect.poll(() => percent(page)).toBe(fit + 20);
  await twoFingerTap(cdp, box.x + box.width / 2, box.y + 200);
  await twoFingerTap(cdp, box.x + box.width / 2, box.y + 200);
  await expect.poll(() => percent(page)).toBe(fit);

  // One finger still draws.
  const fitted = (await surface.boundingBox())!;
  await touch(cdp, 'touchStart', [{ x: fitted.x + 100, y: fitted.y + 150, id: 1 }]);
  for (let i = 1; i <= 6; i++) await touch(cdp, 'touchMove', [{ x: fitted.x + 100 + i * 25, y: fitted.y + 150, id: 1 }]);
  await touch(cdp, 'touchEnd', []);
  await expect(surface.locator('.page-element')).toHaveCount(1);
});

test('Kinder können die Seite vergrößern – mit Knöpfen und mit zwei Fingern', async ({ page, browser }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Zoom für Kinder' } })).json();
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy();
    return response.json();
  };
  let klass = await request('create', { title: 'Zoomklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Mia' });
  const digest = randomBytes(32).toString('hex');
  await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: created.book.id });
  const context = await browser.newContext({ hasTouch: true });
  try {
    const child = await context.newPage();
    await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    const zoom = child.getByRole('group', { name: 'Seite' });
    await expect(zoom.locator('.zoom-value')).toHaveText('100 %');
    await zoom.getByRole('button', { name: 'Seite größer' }).click();
    await expect(zoom.locator('.zoom-value')).toHaveText('110 %');
    await zoom.getByRole('button', { name: 'Seite kleiner' }).click();
    await expect(zoom.locator('.zoom-value')).toHaveText('100 %');

    await child.getByRole('button', { name: 'Stift', exact: true }).click();
    const box = (await child.locator('.interaction-surface').boundingBox())!;
    const cdp = await context.newCDPSession(child);
    await pinch(cdp, box.x + box.width / 2, box.y + box.height / 2, 100, 180);
    await expect.poll(() => percent(child)).toBeGreaterThan(140);
    await expect(child.locator('.interaction-surface .page-element')).toHaveCount(0);
  } finally {
    await context.close();
  }
});
