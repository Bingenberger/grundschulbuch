import { test, expect, type Page } from '@playwright/test';
import { newPage } from '../../src/lib/notebook-model';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
// Headless Chromium hides scrollbars; the jitter only appeared with real ones.
test.use({
  viewport: { width: 1180, height: 820 },
  launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, ignoreDefaultArgs: ['--hide-scrollbars'] },
});
test('Miniaturen bleiben ruhig, wenn die Liste gerade so in die Höhe passt', async ({ page }) => {
  await login(page);
  for (const count of [3, 4]) {
    const response = await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Zitterprobe',
      pages: Array.from({ length: count }, () => newPage()) } });
    const created = await response.json();
    await page.goto(`/heft/${created.book.id}`);
    await page.evaluate(() => localStorage.setItem('grundschulbuch-seiten-offen', '1'));
    await page.reload();
    const list = page.locator('.page-panel .page-thumbnails');
    await expect(list.locator('.page-thumbnail')).toHaveCount(count);
    const changes = await list.evaluate(async (el) => {
      let last = '', changed = 0;
      for (let i = 0; i < 40; i++) {
        const now = [...el.querySelectorAll('.scaled-page > div')].map((d) => Math.round(d.getBoundingClientRect().width * 10)).join(',');
        if (now !== last) changed++;
        last = now;
        await new Promise((r) => requestAnimationFrame(r));
      }
      return changed;
    });
    expect(changes).toBe(1);
  }
});
