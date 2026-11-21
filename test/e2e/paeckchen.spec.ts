import { test, expect, type Page, type Locator } from '@playwright/test';
import { randomBytes } from 'node:crypto';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
/** Reads “47 − ▢ = 40” and gives the missing number. */
async function solve(task: Locator) {
  const parts = await task.locator('.pk-text').allTextContents();
  const [a, op] = parts[0].trim().split(/\s+/);
  const b = Number(parts[1].replace(/[=\s]/g, ''));
  return String(op === '−' ? Number(a) - b : b - Number(a));
}

test('Aufgabenpäckchen: Skript, Vorschau, Ausfüllen, Prüfen, Druck und Kinderheft', async ({ page, browser }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Päckchen', orientation: 'portrait' } })).json();
  await page.goto(`/heft/${created.book.id}`);

  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Mathematik · / }).click();
  await dialog.getByRole('button', { name: 'Aufgabenpäckchen', exact: true }).click();

  // The requested one is the first template: from a number to its neighbouring tens.
  await expect(dialog.getByRole('radio', { name: 'Zu den Nachbarzehnern' })).toHaveAttribute('aria-checked', 'true');
  await expect(dialog.getByText('8 × 2 = 16 Aufgaben')).toBeVisible();
  const script = dialog.getByRole('textbox', { name: 'Aufgabenskript' });
  const preview = dialog.locator('.pk-preview');
  await expect(preview.locator('.pk-task')).toHaveCount(16);

  // A mistake is shown with its line, and the tool cannot be saved like that.
  const good = await script.inputValue();
  await script.fill(good.replace('o = aufrunden(a, 10)', 'o = aufrunden(a, 10'));
  await expect(dialog.getByRole('alert')).toContainText('Zeile 6: Hier fehlt eine schließende Klammer');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog.getByText(/Das Skript hat noch einen Fehler in Zeile 6/)).toBeVisible();
  await script.fill(good);
  await expect(dialog.getByRole('alert')).toHaveCount(0);

  // New numbers change the preview.
  const before = await preview.locator('.pk-task').first().textContent();
  await dialog.getByRole('button', { name: 'Neue Zahlen' }).click();
  await expect.poll(async () => preview.locator('.pk-task').first().textContent()).not.toBe(before);
  await page.screenshot({ path: test.info().outputPath('paeckchen-einstellungen.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(dialog).toHaveCount(0);

  const sheet = page.locator('.interaction-surface .paeckchen');
  const tasks = sheet.locator('.pk-task');
  await expect(tasks).toHaveCount(16);
  // Fill in all but the last one right, the last one wrong.
  for (let i = 0; i < 16; i++) {
    const box = tasks.nth(i).getByRole('textbox');
    await box.click();
    await box.fill(i === 15 ? '99' : await solve(tasks.nth(i)));
  }
  await expect(sheet.locator('.pk-mark')).toHaveCount(0); // only after “Prüfen”
  await sheet.getByRole('button', { name: 'Prüfen' }).click();
  await expect(sheet.getByRole('status')).toHaveText('15 von 16 richtig');
  await expect(sheet.getByRole('img', { name: 'richtig' })).toHaveCount(15);
  await expect(sheet.getByRole('img', { name: 'falsch' })).toHaveCount(1);
  // Changing a box takes its mark away until the next check.
  const last = tasks.nth(15).getByRole('textbox');
  await last.fill(await solve(tasks.nth(15)));
  await expect(sheet.getByRole('img', { name: 'falsch' })).toHaveCount(0);
  await sheet.getByRole('button', { name: 'Prüfen' }).click();
  await expect(sheet.getByRole('status')).toHaveText('16 von 16 richtig – super!');
  await page.screenshot({ path: test.info().outputPath('paeckchen-geprueft.png') });

  // Printed: an ordinary worksheet without marks and button.
  await page.emulateMedia({ media: 'print' });
  await expect(sheet.locator('.pk-foot')).toBeHidden();
  await expect(sheet.locator('.pk-mark').first()).toBeHidden();
  await page.emulateMedia({ media: 'screen' });

  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  await page.reload();
  await expect(page.locator('.interaction-surface .paeckchen .pk-box').first()).not.toHaveValue('');

  // A child gets the tasks with empty boxes and works on them in the own notebook.
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Päckchenklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Ben' });
  const card = randomBytes(32).toString('hex');
  await request('change', { id: klass.id, childId: klass.children[0].id, digest: card });
  const copies = await request('distribute', { id: klass.id, bookId: created.book.id });
  const context = await browser.newContext();
  try {
    const child = await context.newPage();
    await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest: card } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    const own = child.locator('.interaction-surface .paeckchen');
    const first = own.locator('.pk-task').first();
    await expect(first.getByRole('textbox')).toHaveValue('');
    await first.getByRole('textbox').click();
    await first.getByRole('textbox').fill(await solve(first));
    await own.getByRole('button', { name: 'Prüfen' }).click();
    await expect(own.getByRole('status')).toHaveText('1 von 16 richtig');
    await expect(child.locator('.save-status')).toHaveText('✓ Gespeichert');
    await child.reload();
    await expect(child.locator('.interaction-surface .paeckchen .pk-box').first()).not.toHaveValue('');
  } finally {
    await context.close();
  }
});

test('Aufgabenpäckchen „abziehen oder ergänzen“: pro Zahl eine Aufgabe, gemischt', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Päckchen oder', orientation: 'portrait' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: /^Mathematik · / }).click();
  await dialog.getByRole('button', { name: 'Aufgabenpäckchen', exact: true }).click();
  await dialog.getByRole('radio', { name: 'Nachbarzehner: abziehen oder ergänzen' }).click();
  await expect(dialog.getByRole('textbox', { name: 'Aufgabenskript' })).toHaveValue(/\noder\n/);
  await expect(dialog.getByText('12 Aufgaben', { exact: true })).toBeVisible();
  const tasks = dialog.locator('.pk-preview .pk-task');
  await expect(tasks).toHaveCount(12);
  const texts = await tasks.allTextContents();
  expect(texts.some((t) => t.includes('−'))).toBeTruthy();
  expect(texts.some((t) => t.includes('+'))).toBeTruthy();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .paeckchen .pk-task')).toHaveCount(12);
  await page.screenshot({ path: test.info().outputPath('paeckchen-oder.png') });
});
