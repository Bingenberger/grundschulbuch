import { test, expect, type Page } from '@playwright/test';
import { defaultSettings } from '../../src/lib/learning/catalog';
import { newPage, uuid } from '../../src/lib/notebook-model';
import { changeCoins } from '../../src/lib/learning/checkout';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Einkaufen an der Kasse: über Lernwerkzeuge als ganze Seite einfügen', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Kasse', pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Mathematik · / }).click();
  await expect(dialog.getByRole('button', { name: 'Einkaufen & Rückgeld', exact: true })).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Einkaufen an der Kasse', exact: true }).click();
  await dialog.getByRole('group', { name: 'Warenkorb' }).getByRole('button', { name: 'Kiosk' }).click();
  await expect(dialog.getByLabel('Name der Ware').first()).toHaveValue('Lolli');
  await dialog.getByRole('group', { name: 'Kunden bis zur Auswertung' }).getByRole('button', { name: '3', exact: true }).click();
  await page.screenshot({ path: test.info().outputPath('kasse-dialog.png') });
  await dialog.getByLabel('Name der Ware').nth(2).scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath('kasse-waren.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const shop = page.locator('.interaction-surface .ck');
  await expect(shop.getByText('Gleich kommen 3 Kunden in den Laden.')).toBeVisible();
  await expect(shop.locator('svg text', { hasText: 'KIOSK' })).toHaveCount(1);
  await expect(shop.locator('.ck-card')).toHaveCount(10);
  await page.screenshot({ path: test.info().outputPath('kasse-seite.png') });
  // Saved on the server: still there after reloading.
  await expect(page.getByText('Gespeichert')).toBeVisible({ timeout: 10000 });
  await page.reload();
  await expect(page.locator('.interaction-surface .ck').getByText('Gleich kommen 3 Kunden in den Laden.')).toBeVisible();
});

test('Einkaufen an der Kasse: Kunde bestellt, Summe, bezahlen, Wechselgeld, Auswertung', async ({ page }) => {
  test.setTimeout(60000);
  await login(page);
  const checkout = { basket: '', sign: 'TESTLADEN', level: 'euro', items: [{ name: 'Apfel', price: 100, g: 'm', pl: 'Äpfel', picto: '/kasse/2462.webp' }], customers: 1, kinds: 1, qty: false, pics: true, give: false, read: false };
  const pages = [{ ...newPage('blanko', 'landscape'), elements: [{ id: uuid(), type: 'widget', widgetKind: 'checkout', x: 0, y: 0, width: 297, height: 210, rotation: 0, locked: true, color: '#253c42', settings: { ...defaultSettings('checkout'), checkout } }] }];
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Kasse', pages } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const shop = page.locator('.interaction-surface .ck');
  await shop.getByRole('button', { name: 'Laden öffnen' }).click();
  const talk = shop.locator('.ck-talk');
  await expect(talk).toContainText('Ich möchte hier einkaufen:', { timeout: 10000 });
  await expect(talk.locator('.ck-chip')).toContainText('1');

  // A wrong order first: two apples.
  const apple = shop.getByRole('button', { name: 'Apfel', exact: true });
  await apple.click();
  await apple.click();
  await shop.getByRole('button', { name: 'Summe', exact: true }).click();
  await expect(talk).toContainText('Das stimmt aber nicht.', { timeout: 10000 });
  await expect(talk).toHaveClass(/is-sad/);
  await shop.getByRole('button', { name: 'Apfel – eins weniger' }).click();
  await shop.getByRole('button', { name: 'Summe', exact: true }).click();
  await expect(talk).toContainText('Das ist richtig.', { timeout: 10000 });
  await expect(shop.locator('.ck-total')).toContainText('1 €');
  const said = (await talk.locator('.ck-text').textContent())!;
  const paid = said.includes('passend') ? 100 : Number(said.match(/mit (\d+) €/)![1]) * 100;

  // Pay with the customer's money from the drawer.
  const name = (v: number) => (v < 100 ? `${v} Cent` : v < 500 ? `${v / 100} Euro` : `${v / 100}-Euro-Schein`);
  for (const v of changeCoins(paid)) await shop.locator('.ck-drawer').getByRole('button', { name: name(v), exact: true }).click();
  await expect(shop.locator('.ck-zone').first()).toContainText(`${paid / 100} €`);
  await page.screenshot({ path: test.info().outputPath('kasse-bezahlen.png') });
  await shop.getByRole('button', { name: 'Prüfen' }).click();
  await expect(shop.getByText('Geschafft!')).toBeVisible({ timeout: 15000 });
  await expect(shop.getByText('Der Kunde ist bedient.')).toBeVisible();
  await expect(shop.locator('.ck-tile').nth(2)).toContainText('Waren 1 · Bezahlen 0');
  await expect(shop.locator('.ck-tile', { hasText: 'Verbessert' })).toContainText('1 Mal');
  await page.screenshot({ path: test.info().outputPath('kasse-auswertung.png') });
});
