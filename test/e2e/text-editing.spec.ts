import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Text wird direkt im Textfeld geschrieben, mit Cursor und passend zur Lineatur', async ({ page }) => {
  await login(page);
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Schreibprobe',
    pages: [newPage('linie1')] } });
  expect(response.ok()).toBeTruthy(); const created = await response.json();
  await page.goto(`/heft/${created.book.id}`);
  const surface = page.locator('.interaction-surface');
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Text', exact: true }).click();

  // Writing happens on the page only; the bottom bar has no second text field.
  const field = surface.getByRole('textbox', { name: 'Text' });
  await expect(field).toBeFocused();
  await expect(page.getByRole('textbox', { name: 'Text' })).toHaveCount(1);
  await page.keyboard.type('Ada');
  await expect(surface.locator('.text-caret')).toBeVisible();
  await page.keyboard.press('Enter');
  await page.keyboard.type('Bob');
  await expect(field).toHaveValue('Ada\nBob');

  // Two lines take exactly two rows of Lineatur 1 (2 cm each).
  const box = surface.locator('.page-element.text-editing');
  expect(await box.evaluate((el) => el.style.height)).toBe('40mm');
  const metrics = await box.evaluate((el) => ({ top: parseFloat(el.style.top), line: getComputedStyle(el.querySelector('textarea')!).lineHeight }));
  expect(Math.abs(parseFloat(metrics.line) - (20 * 96) / 25.4)).toBeLessThan(0.5);
  expect(metrics.top).toBeGreaterThan(15);

  // Font settings live in “Gestalten”; line spacing follows the ruling.
  const bar = page.getByRole('region', { name: 'Element einstellen' });
  await expect(bar.getByRole('button', { name: /^Schrift: / })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zeilenabstand erhöhen' })).toHaveCount(0);

  await page.keyboard.press('Escape');
  await expect(field).toHaveCount(0);
  await expect(surface.getByText('Ada', { exact: false })).toBeVisible();

  // Tapping the selected text again continues writing; an emptied box disappears.
  await surface.locator('.move-area').click();
  await expect(surface.getByRole('textbox', { name: 'Text' })).toBeFocused();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  await page.keyboard.press('Escape');
  await expect(surface.locator('.page-element')).toHaveCount(0);
});

test('Textkasten: jede Form zeichnet einen eigenen Rahmen, Hintergrund und Rahmenlinie sind einstellbar', async ({ page }) => {
  await login(page);
  const element = { id: '9b1d6c1e-0000-4000-8000-000000000001', type: 'text', x: 30, y: 30, width: 80, height: 20, rotation: 0, locked: false,
    color: '#253c42', text: 'Hallo!\nWie geht es dir?', font: 'Andika', fontSize: 18 };
  const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Rahmenprobe',
    pages: [{ ...newPage(), elements: [element] }] } });
  const created = await response.json();
  await page.goto(`/heft/${created.book.id}`);
  const surface = page.locator('.interaction-surface');
  await surface.getByText('Wie geht es dir?', { exact: false }).click();
  const bar = page.getByRole('region', { name: 'Element einstellen' });
  // Italic and underline sit beside bold.
  const words = surface.locator('.page-element').first();
  await bar.getByRole('group', { name: 'Auszeichnung' }).getByRole('button', { name: /Kursiv$/ }).click();
  await bar.getByRole('group', { name: 'Auszeichnung' }).getByRole('button', { name: /Unterstrichen$/ }).click();
  await expect(bar.getByRole('button', { name: /Kursiv$/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(words.getByText('Wie geht es dir?', { exact: false })).toHaveCSS('font-style', 'italic');
  await expect(words.getByText('Wie geht es dir?', { exact: false })).toHaveCSS('text-decoration-line', 'underline');
  // Size and position live under “Anordnen” now.
  await expect(bar.getByRole('button', { name: 'Maße & Position', exact: true })).toHaveCount(0);
  await bar.getByRole('button', { name: 'Anordnen', exact: true }).click();
  await expect(bar.getByLabel('Breite', { exact: true })).toHaveValue('80');
  await bar.getByRole('button', { name: 'Textkasten', exact: true }).click();
  // Compact settings: a button shows the current choice, tapping it opens the options above.
  const choose = async (group: string, name: string) => {
    await bar.getByRole('button', { name: new RegExp(`^${group}: `) }).click();
    await page.getByRole('group', { name: group, exact: true }).getByRole('button', { name, exact: true }).click();
    await expect(page.locator('.choice-panel')).toHaveCount(0);
  };
  const shapes: string[] = [];
  for (const name of ['Kasten', 'Notizzettel', 'Sprechblase', 'Denkblase', 'Rufblase', 'Banner']) {
    await choose('Form', name);
    const frame = surface.locator('.page-element .text-frame');
    await expect(frame).toBeVisible();
    shapes.push(await frame.evaluate((svg) => svg.innerHTML));
  }
  expect(new Set(shapes).size).toBe(6);
  // Thought bubbles need more room; the box grows with them.
  await choose('Form', 'Denkblase');
  await expect(bar.getByRole('button', { name: 'Form: Denkblase', exact: true })).toBeVisible();
  await expect.poll(async () => parseFloat(await surface.locator('.page-element').first().evaluate((el) => (el as HTMLElement).style.height))).toBeGreaterThan(26);

  await choose('Hintergrund', 'Blau');
  await expect(surface.locator('.text-frame path').first()).toHaveAttribute('fill', '#bbdefb');
  await choose('Rahmenlinie', 'Dick');
  await expect(surface.locator('.text-frame path').first()).toHaveAttribute('stroke-width', '1.4');
  await choose('Rahmenfarbe', 'Rot');
  await expect(surface.locator('.text-frame path').first()).toHaveAttribute('stroke', '#e03131');

  // A plain text box can get a line and a fill too.
  await choose('Form', 'Ohne');
  await expect(surface.locator('.text-frame path').first()).toHaveAttribute('stroke', '#e03131');
  await expect(page.getByRole('status').filter({ hasText: 'Gespeichert' })).toBeVisible();
  await page.reload();
  await expect(page.locator('.interaction-surface .text-frame path').first()).toHaveAttribute('fill', '#bbdefb');
});
