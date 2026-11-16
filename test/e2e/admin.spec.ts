import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page, name = 'Frau Beispiel', pin = '483920') {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill(name);
  await page.getByLabel('PIN', { exact: true }).fill(pin);
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}

test('Verwaltung: Lehrkraft anlegen und mit Einmalcode anmelden, Klasse mit zwei Lehrkräften und Kinderliste, Karten', async ({ page, browser }) => {
  await login(page);
  await page.getByRole('link', { name: 'Verwaltung' }).click();
  await expect(page.getByRole('heading', { name: 'Verwaltung' })).toBeVisible();

  // New teacher: the access slip shows the one-time code once.
  const name = `Frau Neu ${Date.now() % 100000}`;
  await page.getByLabel('Name der Lehrkraft').fill(name);
  await page.getByRole('button', { name: 'Konto anlegen' }).click();
  const slip = page.getByRole('dialog', { name: 'Zugang zum Grundschulbuch' });
  await expect(slip).toContainText(name);
  const code = (await slip.locator('.access-code').textContent())!.trim();
  expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  await slip.getByRole('button', { name: 'Schließen' }).click();
  await expect(page.locator('.child-row', { hasText: name })).toContainText('Einmalcode gültig bis');

  // Class for two teachers, children from a list, cards for all.
  await page.getByRole('button', { name: /Klassen und Kinder/ }).click();
  await page.getByLabel('Name der neuen Klasse').fill('4c');
  await page.getByRole('button', { name: 'Frau Beispiel' }).click();
  await page.getByRole('button', { name, exact: true }).click();
  await page.getByRole('button', { name: 'Klasse anlegen' }).click();
  await page.getByLabel('Namen der Kinder, einer pro Zeile').fill('Ada\nBen\nCem');
  await page.getByRole('button', { name: 'Kinder hinzufügen' }).click();
  await expect(page.getByRole('heading', { name: 'Kinder (3)' })).toBeVisible();
  await page.getByRole('button', { name: 'Karten für alle ohne Karte' }).click();
  const sheet = page.getByRole('dialog', { name: /Anmeldekarten/ });
  await expect(sheet.locator('.login-card')).toHaveCount(3);
  await sheet.getByRole('button', { name: 'Schließen' }).click();
  await expect(page.locator('.child-row', { hasText: 'Ada' })).toContainText('Karte zugeordnet');

  // The new teacher sets a PIN with the code and sees the class.
  const other = await browser.newPage();
  await other.goto('http://localhost:3100/anmelden');
  await other.getByRole('button', { name: 'Mit Einmalcode' }).click();
  await other.getByLabel('Name', { exact: true }).fill(name);
  await other.getByLabel('Einmalcode').fill(code);
  await other.getByLabel('Neue PIN (6 Ziffern)').fill('572918');
  await other.getByLabel('Neue PIN wiederholen').fill('572918');
  await other.getByRole('button', { name: 'PIN festlegen und anmelden' }).click();
  await expect(other).toHaveURL('http://localhost:3100/');
  await expect(other.getByRole('link', { name: 'Verwaltung' })).toHaveCount(0);
  await other.goto('http://localhost:3100/klassen');
  await expect(other.getByRole('button', { name: '4c' })).toBeVisible();
  const forbidden = await other.request.post('http://localhost:3100/api/verwaltung', { headers: origin, data: { action: 'overview' } });
  expect(forbidden.status()).toBe(403);
  const forbiddenEdit = await other.request.post('http://localhost:3100/api/verwaltung', { headers: origin, data: { action: 'saveTemplateEdit', key:'bp-cover', expectedVersion:null } });
  expect(forbiddenEdit.status()).toBe(403);
  await other.goto('http://localhost:3100/verwaltung/vorlagen/neu');
  await expect(other).toHaveURL('http://localhost:3100/');
  await other.goto('http://localhost:3100/verwaltung');
  await expect(other).toHaveURL('http://localhost:3100/');
  await other.close();
});

test('Verwaltung: eingebaute Vorlage ändern und für alle veröffentlichen, ausblenden, Original wiederherstellen', async ({ page }) => {
  await login(page);
  const shelfBefore=await(await page.request.post('/api/werkstatt',{headers:origin,data:{action:'list'}})).json();
  await page.goto('/verwaltung');
  await page.getByRole('button', { name: 'Vorlagen für alle' }).click();
  await page.getByLabel('Vorlagen durchsuchen').fill('Urkunde');
  const card = page.locator('.admin-template', { hasText: 'Urkunde' });
  await expect(card).toHaveCount(1);
  await card.getByRole('button', { name: 'Bearbeiten' }).click();
  await expect(page).toHaveURL(/\/verwaltung\/vorlagen\/bp-certificate-/);
  const key=decodeURIComponent(page.url().split('/').pop()!);
  await page.getByLabel('Vorlagenname',{exact:true}).fill('Schulurkunde');
  await page.getByRole('button',{name:'Vorlage speichern',exact:true}).click();
  await expect(page.getByText('✓ Gespeichert',{exact:true})).toBeVisible();

  // Teachers get the changed template in place of the original.
  const teacher = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'templates' } })).json();
  expect(teacher.some((t: { title: string; replaces?: string }) => t.title === 'Schulurkunde' && t.replaces === key)).toBe(true);
  const shelfAfter=await(await page.request.post('/api/werkstatt',{headers:origin,data:{action:'list'}})).json();
  expect(shelfAfter.map((b:{id:string})=>b.id)).toEqual(shelfBefore.map((b:{id:string})=>b.id));
  await page.reload();await expect(page.getByLabel('Vorlagenname',{exact:true})).toHaveValue('Schulurkunde');

  await page.goto('/verwaltung');
  await page.getByRole('button', { name: 'Vorlagen für alle' }).click();
  await page.getByLabel('Vorlagen durchsuchen').fill('Schulurkunde');
  const replaced = page.locator('.admin-template', { hasText: 'Schulurkunde' });
  await expect(replaced).toContainText('geändert');
  await replaced.getByLabel('Freigabe: Schulurkunde', { exact: true }).selectOption('false');
  await expect(replaced).toContainText('ausgeblendet');
  await replaced.getByLabel('Freigabe: Schulurkunde', { exact: true }).selectOption('true');
  page.once('dialog', (d) => d.accept());
  await replaced.getByRole('button', { name: 'Original wiederherstellen' }).click();
  await page.getByLabel('Vorlagen durchsuchen').fill('Urkunde');
  await expect(page.locator('.admin-template', { hasText: 'Urkunde' })).not.toContainText('geändert');
});
