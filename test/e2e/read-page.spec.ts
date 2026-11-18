import { test, expect, type Page } from '@playwright/test';
import { newPage, uuid } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}
const base = { rotation: 0, locked: false, color: '#253c42' };

test('Seite vorlesen mit leuchtendem Satz und Wort, Beschreibungen und Tontasten; Silben rot und blau', async ({ page }) => {
  // Test-Stimme: meldet jedes Wort und ihr Ende, merkt sich, was gesprochen wurde.
  await page.addInitScript(() => {
    const w = window as unknown as Record<string, unknown>;
    w.spoken = [] as string[];
    w.wordMarks = [] as string[];
    class Utterance {
      text: string; lang = ''; voice: unknown = null; rate = 1; pitch = 1;
      onend: (() => void) | null = null; onerror: (() => void) | null = null;
      onboundary: ((e: { name: string; charIndex: number; charLength: number }) => void) | null = null;
      constructor(text: string) { this.text = text; }
    }
    let current: Utterance | null = null;
    w.SpeechSynthesisUtterance = Utterance;
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        getVoices: () => [{ name: 'Test', lang: 'de-DE', localService: true }],
        cancel: () => { const u = current; current = null; u?.onerror?.(); },
        speak: (u: Utterance) => {
          current = u;
          (w.spoken as string[]).push(u.text);
          const words = [...u.text.matchAll(/\p{L}+/gu)];
          words.forEach((m, i) => setTimeout(() => {
            if (current !== u) return;
            u.onboundary?.({ name: 'word', charIndex: m.index!, charLength: m[0].length });
            const h = (CSS as unknown as { highlights: Map<string, unknown> }).highlights;
            const word = h.get('read-word') as { values(): IterableIterator<Range> } | undefined;
            if (word) (w.wordMarks as string[]).push([...word.values()][0].toString());
          }, 40 * i + 10));
          setTimeout(() => { if (current === u) { current = null; u.onend?.(); } }, 40 * words.length + 60);
        },
      },
    });
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', {
    headers: origin,
    data: {
      action: 'create', title: 'Vorleseprobe',
      pages: [{
        ...newPage(),
        elements: [
          { ...base, id: uuid(), type: 'text', x: 20, y: 20, width: 160, height: 20, text: 'Die Sonne scheint. Wir spielen.', font: 'Andika', fontSize: 18 },
          { ...base, id: uuid(), type: 'sticker', x: 20, y: 60, width: 20, height: 20, symbol: '🍎', alt: 'Ein roter Apfel', fill: '#ffffff' },
          { ...base, id: uuid(), type: 'audio', x: 20, y: 100, width: 20, height: 20, speechText: 'Hallo von der Tontaste', alt: 'Taste' },
        ],
      }],
    },
  })).json();
  await page.goto(`/heft/${created.book.id}`);
  const text = page.locator('.interaction-surface').getByText('Die Sonne scheint. Wir spielen.');
  await expect(text).toBeVisible();

  // Vorlesen: Sätze einzeln, dazu das jeweils gesprochene Wort hervorgehoben.
  const button = page.getByRole('button', { name: 'Seite vorlesen' });
  await button.click();
  await expect(page.getByRole('button', { name: 'Vorlesen anhalten' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Seite vorlesen' })).toBeVisible({ timeout: 10000 });
  expect(await page.evaluate(() => (window as unknown as { spoken: string[] }).spoken)).toEqual([
    'Die Sonne scheint.', 'Wir spielen.', 'Ein roter Apfel', 'Hallo von der Tontaste',
  ]);
  const marks = await page.evaluate(() => (window as unknown as { wordMarks: string[] }).wordMarks);
  expect(marks.slice(0, 5)).toEqual(['Die', 'Sonne', 'scheint', 'Wir', 'spielen']);
  // Danach ist nichts mehr hervorgehoben.
  expect(await page.evaluate(() => (CSS as unknown as { highlights: Map<string, unknown> }).highlights.size)).toBe(0);

  // Nochmal tippen hält an.
  await page.getByRole('button', { name: 'Seite vorlesen' }).click();
  await page.getByRole('button', { name: 'Vorlesen anhalten' }).click();
  await expect(page.getByRole('button', { name: 'Seite vorlesen' })).toBeVisible();

  // Silben rot und blau: Text antippen, Knopf in der Leiste.
  await text.click();
  await page.getByRole('button', { name: 'Silben rot und blau' }).click();
  const syllables = page.locator('.interaction-surface .syllable');
  await expect(syllables.first()).toHaveText('Die');
  expect(await syllables.allTextContents()).toEqual(['Die', 'Son', 'ne', 'scheint', 'Wir', 'spie', 'len']);
  await expect(syllables.nth(1)).toHaveCSS('color', 'rgb(21, 101, 192)');
  await expect(syllables.nth(2)).toHaveCSS('color', 'rgb(211, 47, 47)');
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  await page.reload();
  await expect(page.locator('.interaction-surface .syllable')).toHaveCount(7);
  expect(errors).toEqual([]);
});
