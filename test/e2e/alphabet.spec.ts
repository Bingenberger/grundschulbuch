import { test, expect, type Page } from '@playwright/test';
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
async function create(page: Page, patch: Partial<LearningSettings> = {}) {
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Anlautprobe', pages: [{ ...newPage(), elements: [{
    id: uuid(), type: 'widget', widgetKind: 'alphabet', x: 10, y: 10, width: 190, height: 250, rotation: 0, locked: false, color: '#253c42',
    settings: { ...defaultSettings('alphabet'), alphabetSpeech: false, ...patch },
  }] }] } });
  expect(response.ok()).toBeTruthy(); return response.json();
}

test('Anlaut-Tastatur schreibt, löscht ganze Lautverbindungen und erklärt beim langen Drücken ohne Eingabe', async ({ page }) => {
  await login(page); const data = await create(page, { alphabetTable: 'full', alphabetLetters: 'lower' });
  await page.goto(`/heft/${data.book.id}`);
  const widget = page.locator('.interaction-surface .alphabet-widget');
  await expect(widget.locator('.alphabet-key')).toHaveCount(44);
  await widget.getByRole('button', { name: 'sch schreiben – Schule', exact: true }).click();
  const output = widget.getByRole('group', { name: 'Geschriebenes Wort', exact: true });
  await expect(output).toHaveText('sch');
  await widget.getByRole('button', { name: '⌫ Zurück', exact: true }).click();
  await expect(output).toHaveText('Hier schreiben …');
  const key = widget.getByRole('button', { name: 'm schreiben – Maus', exact: true }), box = (await key.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down(); await page.waitForTimeout(650); await page.mouse.up();
  await expect(output).toHaveText('Hier schreiben …');
  await output.focus(); await page.keyboard.type('haus');
  await expect(output).toHaveText('haus');
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  await page.reload(); await expect(page.locator('.interaction-surface').getByRole('group', { name: 'Geschriebenes Wort', exact: true })).toHaveText('haus');
});

test('Worttraining zeigt Korrektur, verrät das Diktat erst nach zwei Fehlern und wechselt richtige Wörter automatisch', async ({ page }) => {
  await login(page);
  const data = await create(page, { alphabetPractice: true, alphabetPrompt: 'audio', alphabetLetters: 'lower', words: ['maus', 'haus'] });
  await page.goto(`/heft/${data.book.id}`);
  const widget = page.locator('.interaction-surface .alphabet-widget');
  const output = widget.getByRole('group', { name: 'Geschriebenes Wort', exact: true });
  await expect(widget.locator('.alphabet-target')).toHaveCount(0);
  await output.focus(); await page.keyboard.type('mais');
  await widget.getByRole('button', { name: 'Fertig – prüfen', exact: true }).click();
  await expect(widget.locator('.alphabet-letter-wrong')).toHaveCount(1);
  await expect(widget.locator('.alphabet-target')).toHaveCount(0);
  await widget.getByRole('button', { name: 'Fertig – prüfen', exact: true }).click();
  await expect(widget.locator('.alphabet-target')).toHaveText('maus');
  await widget.getByRole('button', { name: 'Alles neu', exact: true }).click();
  await output.focus(); await page.keyboard.type('maus');
  await widget.getByRole('button', { name: 'Fertig – prüfen', exact: true }).click();
  await expect(widget.getByText('★ Richtig!', { exact: true })).toBeVisible();
  await expect(widget.locator('.alphabet-practice')).toContainText('Wort 2 von 2');
  await output.focus(); await page.keyboard.type('haus');
  await widget.getByRole('button', { name: 'Fertig – prüfen', exact: true }).click();
  await expect(widget.getByText('Geschafft! 2 von 2 Sternen.', { exact: true })).toBeVisible();
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  await page.reload();
  await expect(widget.getByText('Geschafft! 2 von 2 Sternen.', { exact: true })).toBeVisible();
  await widget.getByRole('button', { name: 'Nochmal', exact: true }).click();
  await expect(widget.locator('.alphabet-practice')).toContainText('Wort 1 von 2');
});

test('Kinder bearbeiten geschützte Anlaut-Tastaturen ohne den Entwurf zu ändern', async ({ page, browser }) => {
  await login(page); const data = await create(page, { alphabetPractice: true, alphabetLetters: 'lower', words: ['maus'] });
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Anlautklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Nora' });
  const digest = '9'.repeat(64);
  await request('change', { id: klass.id, childId: klass.children[0].id, digest });
  const copies = await request('distribute', { id: klass.id, bookId: data.book.id });
  const context = await browser.newContext();
  try {
    const child = await context.newPage(); await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    const widget = child.locator('.interaction-surface .alphabet-widget');
    await widget.getByRole('group', { name: 'Geschriebenes Wort', exact: true }).focus(); await child.keyboard.type('maus');
    await widget.getByRole('button', { name: 'Fertig – prüfen', exact: true }).click();
    await expect(widget.getByText('Geschafft! 1 von 1 Sternen.', { exact: true })).toBeVisible();
    await child.getByRole('button', { name: '‹ Meine Hefte' }).click(); await child.waitForURL(/\/kinder$/);
    await child.goto(`/kinder/heft/${copies[0].id}`);
    await expect(widget.getByText('Geschafft! 1 von 1 Sternen.', { exact: true })).toBeVisible();
  } finally { await context.close(); }
});
