import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
async function fresh(page: Page, title: string) {
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title, pages: [newPage('blanko', 'landscape')] } })).json();
  await page.goto(`/heft/${created.book.id}`);
  return created.book.id as string;
}
async function openBlock(page: Page, subject: string, title: string) {
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  await dialog.getByRole('navigation', { name: 'Fächer' }).getByRole('button', { name: new RegExp(`^${subject} · `) }).click();
  await dialog.getByRole('button', { name: title, exact: true }).click();
  return dialog;
}
type El = { widgetKind?: string; settings?: { tool?: string; werkzeug?: Record<string, unknown> }; response?: { werkzeug?: { state: Record<string, unknown> } } };
const elements = async (page: Page, id: string): Promise<El[]> => (await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id } })).json()).pages.flatMap((p: { elements: El[] }) => p.elements);
const stateOf = async (page: Page, id: string, tool: string) => (await elements(page, id)).find((e) => e.settings?.tool === tool)?.response?.werkzeug?.state;

test('Neue Fächer Alltag und Beruf & Praktikum; Klassenführung mit den Schul-Werkzeugen', async ({ page }) => {
  await login(page);
  await fresh(page, 'Fächer');
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' });
  const subjects = dialog.getByRole('navigation', { name: 'Fächer' });
  await subjects.getByRole('button', { name: /^Alltag · / }).click();
  for (const title of ['Ablaufplan', 'Checkliste', 'Stressbarometer: Was hilft mir?', 'Fußgängerampel', 'Telefonieren üben', 'Notruf üben', 'Wo tut es weh?'])
    await expect(dialog.getByRole('button', { name: title, exact: true })).toBeVisible();
  await subjects.getByRole('button', { name: /^Beruf & Praktikum · / }).click();
  for (const title of ['Selbst- und Fremdeinschätzung', 'Stückzähler (Serienfertigung)', 'Gespräche üben'])
    await expect(dialog.getByRole('button', { name: title, exact: true })).toBeVisible();
  await subjects.getByRole('button', { name: /^Klassenführung · / }).click();
  for (const title of ['Wie geht es dir heute?', 'Abstimmung und Wahl', 'Rückmeldung zu meiner Arbeit'])
    await expect(dialog.getByRole('button', { name: title, exact: true })).toBeVisible();
});

test('Abstimmung, Checkliste, Stückzähler und Einschätzung speichern, was angetippt wurde', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const id = await fresh(page, 'Speichern');
  const surface = page.locator('.interaction-surface');

  let dialog = await openBlock(page, 'Klassenführung', 'Abstimmung und Wahl');
  await dialog.getByLabel('Frage', { exact: true }).fill('Wohin geht der Ausflug?');
  await expect(dialog.locator('.tool-preview .lh-ct-vote svg')).toContainText('Wohin geht der Ausflug?');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const vote = surface.locator('.lh-wg-vote');
  await vote.locator('svg [data-a="v:0"]').click();
  await vote.locator('svg [data-a="v:0"]').click();
  await vote.locator('svg [data-a="v:1"]').click();
  // The preset of the reference comes with example votes; the taps add to them.
  await expect.poll(async () => {
    const el = (await elements(page, id)).find((e) => e.settings?.tool === 'vote');
    const before = (el?.settings?.werkzeug?.counts as number[] | undefined) ?? [], after = (el?.response?.werkzeug?.state.counts as number[] | undefined) ?? [];
    return [(after[0] ?? 0) - (before[0] ?? 0), (after[1] ?? 0) - (before[1] ?? 0)];
  }).toEqual([2, 1]);
  await vote.evaluate((el) => el.closest('.page-element')?.remove());

  dialog = await openBlock(page, 'Alltag', 'Checkliste');
  await dialog.getByRole('button', { name: 'Barriereanalyse', exact: true }).click();
  await expect(dialog.getByLabel('Überschrift', { exact: true })).toHaveValue('Ist der Ort barrierefrei?');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const check = surface.locator('.lh-wg-check');
  await check.locator('svg [data-a="m:0:1"]').click();
  await check.locator('svg [data-a="m:1:2"]').click();
  await expect.poll(async () => ((await stateOf(page, id, 'check'))?.vals as number[] | undefined)?.slice(0, 3)).toEqual([1, 2, 0]);

  dialog = await openBlock(page, 'Beruf & Praktikum', 'Stückzähler (Serienfertigung)');
  await dialog.getByRole('radio', { name: '10', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const pieces = surface.locator('.lh-wg-pieces');
  for (let i = 0; i < 3; i++) await pieces.locator('svg [data-a="plus"]').click();
  // Also here the preset comes with an example count.
  await expect.poll(async () => {
    const el = (await elements(page, id)).find((e) => e.settings?.tool === 'pieces');
    return Number(el?.response?.werkzeug?.state.count ?? 0) - Number(el?.settings?.werkzeug?.count ?? 0);
  }).toBe(3);

  dialog = await openBlock(page, 'Beruf & Praktikum', 'Selbst- und Fremdeinschätzung');
  await dialog.getByRole('button', { name: 'Arbeitsverhalten', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const rating = surface.locator('.lh-wg-rating');
  await rating.locator('svg [data-a^="f:"]').first().click();
  await expect.poll(async () => ((await stateOf(page, id, 'rating'))?.va as number[] | undefined)?.some(Boolean)).toBe(true);
  await page.screenshot({ path: test.info().outputPath('speichern.png') });
  expect(errors).toEqual([]);
});

test('Formulare wie in der Vorlage: Vorlagen, neue Zeilen, Gefühle, Gespräch und Ampel', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const id = await fresh(page, 'Formulare');

  // Ablaufplan: a template, then a new empty step stays until it is filled.
  let dialog = await openBlock(page, 'Alltag', 'Ablaufplan');
  await dialog.getByRole('button', { name: 'Hände waschen', exact: true }).click();
  await expect(dialog.getByLabel('Schritt 1', { exact: true })).toHaveValue('Wasser an');
  const count = await dialog.getByLabel(/^Schritt \d+$/).count();
  await dialog.getByRole('button', { name: '＋ Schritt', exact: true }).click();
  await expect(dialog.getByLabel(/^Schritt \d+$/)).toHaveCount(count + 1);
  await dialog.getByLabel(`Schritt ${count + 1}`, { exact: true }).fill('Fertig!');
  await dialog.getByRole('radio', { name: 'Liste', exact: true }).click();
  await expect(dialog.locator('.tool-preview .lh-ct-steps svg')).toContainText('Fertig!');
  await page.screenshot({ path: test.info().outputPath('ablaufplan-einstellungen.png') });
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-steps svg')).toContainText('Fertig!');

  // Wie geht es dir heute?: at least two feelings, counting on.
  dialog = await openBlock(page, 'Klassenführung', 'Wie geht es dir heute?');
  await dialog.getByLabel('Frage', { exact: true }).fill('Wie fühlst du dich?');
  await dialog.locator('label.sheet-toggle', { hasText: 'Zählen' }).click();
  await expect(dialog.getByRole('switch', { name: /^Zählen/ })).toBeChecked();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-mood svg')).toContainText('Wie fühlst du dich?');

  // Gespräche üben: a ready-made conversation, who speaks is switchable.
  dialog = await openBlock(page, 'Beruf & Praktikum', 'Gespräche üben');
  await dialog.getByRole('button', { name: 'Krank melden', exact: true }).click();
  await expect(dialog.getByLabel('Überschrift', { exact: true })).toHaveValue('Ich melde mich krank');
  await expect(dialog.getByLabel('Satz 1', { exact: true })).toHaveValue(/Werkstatt/);
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-practice')).toHaveCount(1);

  // Fußgängerampel: green for 12 seconds, without ticking.
  dialog = await openBlock(page, 'Alltag', 'Fußgängerampel');
  await dialog.getByRole('radio', { name: '12 Sekunden', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-traffic')).toHaveCount(1);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const saved = await elements(page, id);
  expect(saved.find((e) => e.settings?.tool === 'steps')?.settings?.werkzeug).toMatchObject({ layout: 'list', title: 'Hände waschen' });
  expect(saved.find((e) => e.settings?.tool === 'mood')?.settings?.werkzeug).toMatchObject({ title: 'Wie fühlst du dich?', count: true });
  expect(saved.find((e) => e.settings?.tool === 'traffic')?.settings?.werkzeug).toMatchObject({ green: 12 });
  expect(errors).toEqual([]);
});
