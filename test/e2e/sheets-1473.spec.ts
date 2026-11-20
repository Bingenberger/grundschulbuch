import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function openSheet(page: Page, title: string) {
  await page.getByRole('complementary', { name: 'Seitenübersicht' }).getByRole('button', { name: 'Neue Seite', exact: true }).click();
  const chooser = page.getByRole('dialog', { name: 'Neue Seite' });
  await chooser.getByRole('navigation', { name: 'Kategorien' }).getByRole('button', { name: /^Einstellbar · / }).click();
  await chooser.getByRole('button', { name: `Vorlage ${title}`, exact: true }).click();
  return page.getByRole('dialog', { name: title });
}

test('Einstellbare Arbeitsblätter aus Lernsachen-Heft 1.47.3', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Arbeitsblätter', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  for (const title of ['Rechnen im Alltag: Lohn, Fahrplan, Geld', 'Karopapier: Symmetrie, Muster, Messen', 'Programmieren: Arbeitsblatt', 'Laute hören', 'Etiketten']) {
    const dialog = await openSheet(page, title);
    await expect(dialog.locator('.paper').first()).toBeVisible();
    if (title === 'Etiketten') {
      await dialog.getByLabel('Wörter', { exact: true }).fill('Hund\nKatze\nMaus');
      await dialog.getByText('Bilder suchen (ARASAAC)').click();
      await dialog.getByText('Vorlesen beim Antippen').click();
    }
    if (title === 'Laute hören') await dialog.getByRole('radiogroup', { name: 'Laut' }).getByRole('radio').nth(2).click();
    await page.screenshot({ path: test.info().outputPath(`${title.split(':')[0].replace(/\W+/g, '-')}.png`) });
    const before = await page.locator('.page-thumbnail').count();
    await dialog.getByRole('button', { name: /einfügen/ }).click();
    await expect(dialog).toHaveCount(0, { timeout: 20000 });
    await expect.poll(() => page.locator('.page-thumbnail').count()).toBeGreaterThan(before);
  }
  // The Etiketten with “Vorlesen beim Antippen” are Sprechtasten.
  await expect(page.locator('.interaction-surface .talk-key')).toHaveCount(3);
  expect(errors).toEqual([]);
});

test('Karopapier: Lösungskontrolle, Tippen mit Stift und Lineal bereit wie in der Vorlage', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Karopapier', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const dialog = await openSheet(page, 'Karopapier: Symmetrie, Muster, Messen');
  // Only “Strecken messen”, checked at once.
  for (const name of ['Symmetrie', 'Bandornamente', 'Abzeichnen', 'Strecken messen', 'Strecken zeichnen']) {
    const card = dialog.getByRole('button', { name: new RegExp(`^${name}`) });
    if ((await card.getAttribute('aria-pressed')) !== String(name === 'Strecken messen')) await card.click();
  }
  await dialog.getByRole('radiogroup', { name: 'Lösungskontrolle' }).getByRole('radio', { name: 'Sofort ✓ ✗' }).click();
  await expect(dialog.getByText('Sobald ein Kind ein Ergebnis eingetippt hat, erscheint daneben ✓ oder ✗.')).toBeVisible();
  await dialog.getByRole('button', { name: /einfügen/ }).click();
  await expect(dialog).toHaveCount(0, { timeout: 20000 });
  // On the exercise page the ruler lies ready, the pen is on – and a tap on a box still opens it for typing.
  await page.locator('.page-thumbnail').first().click();
  const ruler = page.locator('.interaction-surface').getByRole('group', { name: 'Lineal auf der Seite' });
  await expect(ruler).toBeVisible();
  await expect(page.locator('.interaction-surface')).toHaveClass(/tool-pen/);
  const box = page.locator('.interaction-surface .answer-field').first();
  await box.click();
  await page.keyboard.type('99');
  await expect(box).toHaveValue('99');
  await expect(page.locator('.interaction-surface .answer-mark.is-bad')).toHaveCount(1);
  await expect(page.locator('.interaction-surface')).toHaveClass(/tool-pen/);
  await expect(ruler).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('karopapier-messen.png') });
  // The solution page has no ruler tasks: the ruler goes away, the pen goes off.
  await page.locator('.page-thumbnail').nth(1).click();
  await expect(ruler).toHaveCount(0);
  await expect(page.locator('.interaction-surface')).toHaveClass(/tool-select/);
});

test('Karopapier im Kinderheft: Knopf „Prüfen“ markiert die Ergebnisse', async ({ page, browser }) => {
  await login(page);
  const sheet = newPage('blanko', 'landscape');
  sheet.tool = 'ruler';
  const box = (y: number, answer: string) => ({ id: uuid(), type: 'text' as const, x: 200, y, width: 28, height: 12, rotation: 0, locked: true, color: '#1f2937', text: '', font: 'Andika' as const, fontSize: 22, bold: false, placeholder: ' ', answer, check: 'button' as const });
  sheet.elements = [
    box(40, '7'), box(70, '4,5'),
    { id: uuid(), type: 'text', x: 233, y: 7, width: 49, height: 14, rotation: 0, locked: true, color: '#ffffff', text: 'Prüfen', font: 'Nunito', fontSize: 20, bold: true, align: 'center', background: '#16a34a', action: 'check' },
  ];
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Messen', pages: [sheet] } });
  expect(response.ok(), await response.text()).toBeTruthy();
  const created = await response.json();
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Messklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Mia' });
  const digest = '8'.repeat(64);
  await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: created.book.id });
  const context = await browser.newContext();
  try {
    const child = await context.newPage(); await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    const surface = child.locator('.interaction-surface');
    await expect(surface.getByRole('group', { name: 'Lineal auf der Seite' })).toBeVisible();
    const boxes = surface.locator('.answer-field');
    await boxes.nth(0).click(); await child.keyboard.type('70 mm');
    await boxes.nth(1).click(); await child.keyboard.type('4');
    await expect(surface.locator('.answer-mark')).toHaveCount(0);
    await surface.getByRole('button', { name: 'Prüfen', exact: true }).click();
    await expect(child.getByRole('status').filter({ hasText: '1 von 2 richtig' })).toBeVisible();
    await expect(surface.locator('.answer-mark.is-ok')).toHaveCount(1);
    await expect(surface.locator('.answer-mark.is-bad')).toHaveCount(1);
    await child.screenshot({ path: test.info().outputPath('karopapier-kind.png') });
    // A new answer takes the mark away; saved with the page.
    await boxes.nth(1).fill('4,5');
    await expect(surface.locator('.answer-mark')).toHaveCount(1);
    await child.getByRole('button', { name: 'Meine Hefte' }).click(); await child.waitForURL(/\/kinder$/);
    await child.goto(`/kinder/heft/${copies[0].id}`);
    await expect(surface.locator('.answer-field').nth(1)).toHaveValue('4,5');
    await expect(surface.locator('.answer-mark.is-ok')).toHaveCount(1);
  } finally { await context.close(); }
});
