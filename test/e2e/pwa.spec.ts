import { test, expect } from '@playwright/test';

test('App-Installation: Manifest startet auf der Startseite, iPad bekommt eine Anleitung, die sich ausblenden lässt', async ({ browser, page }) => {
  const manifest = await (await page.request.get('/manifest.webmanifest')).json();
  expect(manifest).toMatchObject({ start_url: '/', scope: '/', display: 'standalone' });
  // Without a session the start page leads to the sign-in.
  await page.goto('/');
  await expect(page).toHaveURL(/\/anmelden$/);

  const ipad = await browser.newContext({
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    hasTouch: true,
  });
  try {
    const tablet = await ipad.newPage();
    await tablet.goto('/anmelden');
    const hint = tablet.getByRole('note', { name: 'Als App installieren' });
    await expect(hint).toContainText('Zum Home-Bildschirm');
    await hint.getByRole('button', { name: 'Nicht mehr zeigen' }).click();
    await expect(hint).toHaveCount(0);
    await tablet.reload();
    await expect(tablet.getByRole('heading').first()).toBeVisible();
    await expect(hint).toHaveCount(0);
  } finally {
    await ipad.close();
  }
  // Ordinary desktop browsers without an install offer see nothing.
  await page.goto('/anmelden');
  await expect(page.getByRole('note', { name: 'Als App installieren' })).toHaveCount(0);
});
