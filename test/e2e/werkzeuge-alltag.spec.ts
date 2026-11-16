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

test('Nähe und Distanz: Personen in Kreise legen bleibt gespeichert; Wochen- und Dienstplan', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const id = await fresh(page, 'Kreise und Plan');

  let dialog = await openBlock(page, 'Alltag', 'Nähe und Distanz: Kreise');
  await dialog.getByRole('button', { name: '3 Kreise', exact: true }).click();
  await expect(dialog.getByLabel(/^Kreis \d+$/)).toHaveCount(3);
  await dialog.getByRole('button', { name: '＋ Person', exact: true }).click();
  await dialog.getByLabel(/^Person \d+$/).last().fill('Oma');
  await expect(dialog.locator('.tool-preview .lh-ct-circles svg')).toContainText('Oma');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const circles = page.locator('.interaction-surface .lh-wg-circles');
  await circles.locator('svg [data-a="p:0"]').click();
  // The legend box of the inner circle (the ring itself lies under the middle).
  await circles.locator('svg [data-a="r:0"]').last().click();
  await expect.poll(async () => ((await stateOf(page, id, 'circles'))?.rings as number[] | undefined)?.[0]).toBe(0);
  // After reloading, the person is still in the inner circle (from the saved response).
  await page.reload();
  await expect(page.locator('.interaction-surface .lh-wg-circles svg')).toContainText('Oma');
  expect(((await stateOf(page, id, 'circles'))?.rings as number[])[0]).toBe(0);

  dialog = await openBlock(page, 'Alltag', 'Wochenplan');
  await dialog.getByRole('tab', { name: 'Mittwoch', exact: true }).click();
  await expect(dialog.getByLabel('Eintrag 2', { exact: true })).toHaveValue('Wäsche waschen');
  await dialog.getByRole('button', { name: '＋ Eintrag', exact: true }).click();
  await dialog.getByLabel('Eintrag 3', { exact: true }).fill('Kino');
  await dialog.getByLabel('Eintrag 3: Uhrzeit', { exact: true }).fill('19:00');
  await dialog.getByRole('radio', { name: 'Montag bis Freitag', exact: true }).click();
  await expect(dialog.getByRole('tab', { name: 'Samstag', exact: true })).toHaveCount(0);
  await dialog.getByRole('radio', { name: 'Dienstplan', exact: true }).click();
  await expect(dialog.getByLabel('Überschrift', { exact: true })).toHaveValue('Unser Dienstplan');
  await expect(dialog.getByLabel('Namen', { exact: true })).toBeVisible();
  await dialog.getByRole('radio', { name: 'Wochenplan', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-week')).toHaveCount(1);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const week = (await elements(page, id)).find((e) => e.settings?.tool === 'week')?.settings?.werkzeug as { days: number; plan: { text: string; time?: string }[][]; title: string };
  expect(week.days).toBe(5);
  expect(week.title).toBe('Mein Wochenplan');
  expect(week.plan[2]).toContainEqual({ text: 'Kino', time: '19:00' });
  expect(errors).toEqual([]);
});

test('Sortieren und Bild-Quiz: fertige Sets mit mitgelieferten Bildern', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  await fresh(page, 'Sortieren');
  let dialog = await openBlock(page, 'Alltag', 'Sortieren');
  // Starts with the Ernährungsampel of the reference, with its pictures.
  await expect(dialog.getByLabel('Überschrift', { exact: true })).toHaveValue('Wie oft essen?');
  await expect(dialog.getByRole('img', { name: 'Bild: Karte 1', exact: true })).toHaveAttribute('src', '/sortieren/2462.webp');
  await dialog.getByRole('button', { name: 'Mülltrennung', exact: true }).click();
  await expect(dialog.getByLabel(/^Kasten \d+$/)).toHaveCount(4);
  await dialog.getByRole('button', { name: 'Karte 1: Kasten Bio', exact: true }).click();
  await expect(dialog.getByRole('button', { name: 'Karte 1: Kasten Bio', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.locator('.tool-preview .lh-ct-sort svg')).toContainText('In welche Tonne?');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const sort = page.locator('.interaction-surface .lh-wg-sort');
  await expect(sort.locator('svg')).toContainText('In welche Tonne?');
  await expect(sort.locator('img.lh-ls-pic').first()).toHaveJSProperty('complete', true);
  expect(await sort.locator('img.lh-ls-pic').first().evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await sort.locator('svg [data-a^="b:"]').first().click();

  dialog = await openBlock(page, 'Beruf & Praktikum', 'Bild-Quiz: Was bedeutet das?');
  await expect(dialog.getByLabel('Frage', { exact: true })).toHaveValue('Was bedeutet das Schild?');
  await expect(dialog.getByRole('img', { name: 'Bild: Karte 1', exact: true })).toHaveAttribute('src', /^\/sortieren\/sign-[\w-]+\.svg$/);
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const quiz = page.locator('.interaction-surface .lh-wg-sort').last();
  await expect(quiz.locator('svg [data-a^="a:"]')).toHaveCount(3);
  await page.screenshot({ path: test.info().outputPath('bild-quiz.png') });
  expect(errors).toEqual([]);
});

test('Geld-Planer und Automat: Beträge in Euro', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const id = await fresh(page, 'Geld');
  let dialog = await openBlock(page, 'Alltag', 'Geld-Planer: Mein Monat');
  await dialog.getByLabel('Wunsch 1: Betrag in Euro', { exact: true }).fill('15,50');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-budget')).toHaveCount(1);
  dialog = await openBlock(page, 'Alltag', 'Fahrkartenautomat üben');
  await dialog.getByRole('radio', { name: 'Getränkeautomat', exact: true }).click();
  await expect(dialog.getByLabel('Eintrag 1', { exact: true })).toHaveValue('Wasser');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-machine')).toHaveCount(1);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const els = await elements(page, id);
  expect((els.find((e) => e.settings?.tool === 'budget')?.settings?.werkzeug?.wishes as { cent: number }[])[0].cent).toBe(1550);
  expect(els.find((e) => e.settings?.tool === 'machine')?.settings?.werkzeug).toMatchObject({ kind: 'drinks', title: 'Getränkeautomat' });
  expect(errors).toEqual([]);
});

test('Geld-Planer: auf der Heftseite eingetragene Wünsche bleiben gespeichert', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const id = await fresh(page, 'Geld ausfüllen');
  const dialog = await openBlock(page, 'Alltag', 'Geld-Planer: Mein Monat');
  await dialog.locator('label.sheet-toggle', { hasText: 'Auf der Heftseite ausfüllen' }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const budget = page.locator('.interaction-surface .lh-wg-budget');
  await budget.locator('svg [data-a="add:w"]').click();
  await page.getByLabel('Was?', { exact: true }).fill('Zoo');
  await page.getByLabel('Wie viel Euro?', { exact: true }).fill('18,50');
  await page.getByRole('button', { name: 'Fertig', exact: true }).click();
  await expect(budget.locator('svg')).toContainText('Zoo');
  await expect.poll(async () => ((await stateOf(page, id, 'budget'))?.bud as { wishes?: { text: string; cent: number }[] } | undefined)?.wishes?.find((w) => w.text === 'Zoo')?.cent).toBe(1850);
  await page.reload();
  await expect(page.locator('.interaction-surface .lh-wg-budget svg')).toContainText('Zoo');
  expect(errors).toEqual([]);
});

test('Linksammlung und Nachrichten in leichter Sprache: Links öffnen in einem neuen Fenster', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await context.route(/^https:\/\/(?!localhost)/, (route) => route.fulfill({ status: 200, body: 'ok' }));
  await login(page);
  const id = await fresh(page, 'Links');
  let dialog = await openBlock(page, 'Medien & Präsentation', 'Nachrichten in leichter Sprache');
  await expect(dialog.getByLabel('Link 1: Webadresse', { exact: true })).toHaveValue('https://www.nachrichtenleicht.de/');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-bookmarks .lh-bm-link').first()).toBeVisible();
  // The next collection is inserted on the same page; the checks below look at the last one.

  dialog = await openBlock(page, 'Medien & Präsentation', 'Linksammlung');
  await dialog.getByRole('button', { name: '＋ Link', exact: true }).click();
  await dialog.getByLabel('Link 5', { exact: true }).fill('Schulseite');
  await dialog.getByLabel('Link 5: Webadresse', { exact: true }).fill('beispiel-schule.de');
  await dialog.getByRole('radio', { name: 'Liste', exact: true }).click();
  await expect(dialog.locator('.tool-preview .lh-bm')).toContainText('Schulseite');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const links = page.locator('.interaction-surface .lh-wg-bookmarks').last().locator('.lh-bm-link');
  await expect(links).toHaveCount(5);
  const popup = page.waitForEvent('popup');
  await links.nth(4).click();
  const opened = await popup;
  await expect.poll(() => opened.url()).toBe('https://beispiel-schule.de/');
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const saved = (await elements(page, id)).filter((e) => e.widgetKind === 'linksammlung').pop()?.settings as { bm: { layout: string; links: { url: string }[] } };
  expect(saved.bm.layout).toBe('list');
  expect(saved.bm.links[4].url).toBe('https://beispiel-schule.de/');
  expect(errors).toEqual([]);
});

test('Programmieren, Figur und Gefühle-Karten', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const id = await fresh(page, 'Programmieren und Figuren');
  let dialog = await openBlock(page, 'Programmieren', 'Zum Ziel: Pfeilkarten legen');
  await expect(dialog.locator('.tool-preview .lh-wg-code svg').first()).toBeVisible();
  await dialog.getByRole('radio', { name: 'Wörter abfahren', exact: true }).click();
  await expect(dialog.getByLabel('Wörter', { exact: true })).toBeVisible();
  await dialog.getByRole('radio', { name: '7 × 7', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const code = page.locator('.interaction-surface .lh-wg-code');
  await expect(code.locator('svg').first()).toBeVisible();
  await code.locator('[data-a^="add:"]').first().click();
  await code.locator('[data-a="go"]').first().click();
  await page.screenshot({ path: test.info().outputPath('programmieren.png') });

  dialog = await openBlock(page, 'Für alle Fächer', 'Figur');
  await dialog.getByRole('radio', { name: 'Erwachsen', exact: true }).click();
  await dialog.getByLabel('Name', { exact: true }).fill('Herr Ober');
  await dialog.getByLabel('Das sagt die Figur beim Antippen', { exact: true }).fill('Guten Tag!');
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-avatar svg').first()).toBeVisible();

  dialog = await openBlock(page, 'Klassenführung', 'Gefühle-Karten');
  await expect(dialog).toHaveCount(0);
  await page.getByLabel('Seite 2 öffnen', { exact: true }).click();
  await expect(page.locator('.interaction-surface .lh-wg-avatar')).toHaveCount(6);
  await expect(page.locator('.interaction-surface')).toContainText('fröhlich');
  await page.screenshot({ path: test.info().outputPath('gefuehle.png') });
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const figure = (await elements(page, id)).find((e) => e.widgetKind === 'figur' && (e.settings as { av?: { name?: string } }).av?.name === 'Herr Ober')?.settings as { av: { child: boolean }; say: { text: string } };
  expect(figure.av.child).toBe(false);
  expect(figure.say.text).toBe('Guten Tag!');
  const coding = (await elements(page, id)).find((e) => e.widgetKind === 'programmieren')?.settings as { pg: { lesson: string; size: number } };
  expect(coding.pg).toMatchObject({ lesson: 'word', size: 7 });
  expect(errors).toEqual([]);
});

test('Puppentheater: Bühne, Figuren und Titel einstellen', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const id = await fresh(page, 'Puppentheater');
  const dialog = await openBlock(page, 'Medien & Präsentation', 'Puppentheater');
  await dialog.getByLabel('Titel', { exact: true }).fill('Der verlorene Ball');
  await dialog.getByRole('radio', { name: 'Wald', exact: true }).click();
  const before = await dialog.locator('.theater-figure').count();
  await dialog.getByRole('button', { name: '＋ Figur', exact: true }).click();
  await expect(dialog.locator('.theater-figure')).toHaveCount(before + 1);
  await dialog.getByRole('radio', { name: 'Erwachsen', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click();
  const stage = page.locator('.interaction-surface .lh-wg-theater');
  await expect(stage.locator('.lh-th')).toBeVisible();
  await expect(stage).toContainText('Der verlorene Ball');
  await page.screenshot({ path: test.info().outputPath('puppentheater.png') });
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const th = (await elements(page, id)).find((e) => e.widgetKind === 'puppentheater')?.settings as { th: { title: string; back: string; cast: { av: { child: boolean } }[] } };
  expect(th.th.title).toBe('Der verlorene Ball');
  expect(th.th.back).toBe('forest');
  expect(th.th.cast).toHaveLength(before + 1);
  expect(th.th.cast[before].av.child).toBe(false);
  expect(errors).toEqual([]);
});
