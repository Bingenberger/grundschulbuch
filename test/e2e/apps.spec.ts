import { test, expect } from '@playwright/test';

test('Eigene HTML-Apps laufen getrennt vom angemeldeten Editor', async ({
  page,
}) => {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
  await page.getByRole('button', { name: '＋ Neues Heft' }).click();
  await page.getByLabel('Name des Hefts').fill('HTML-App Test');
  await page.getByRole('button', { name: 'Heft anlegen', exact: true }).click();
  await expect(page).toHaveURL(/\/heft\//);
  let leaked = false;
  page.on('request', (r) => {
    if (r.url().includes('example.invalid')) leaked = true;
  });
  await page.getByRole('button', { name: '↗ Internet', exact: true }).click();
  const dialog = page.getByRole('dialog', {
    name: 'Video, Webseite oder QR-Code',
  });
  await dialog.getByRole('combobox').selectOption('app');
  await dialog.locator('input[type=file]').setInputFiles({
    name: 'zaehler.html',
    mimeType: 'text/html',
    buffer: Buffer.from(
      '<!doctype html><button id="counter">Zählen</button><output id="result">0</output><script>counter.onclick=()=>result.textContent=+result.textContent+1;try{parent.document.body.dataset.escaped="yes"}catch{document.body.dataset.isolated="yes"}fetch("https://example.invalid/forbidden").catch(()=>{});</script>',
    ),
  });
  await dialog.getByRole('button', { name: 'Einfügen', exact: true }).click();
  await page
    .locator('.interaction-surface')
    .getByRole('button', { name: 'HTML-App starten' })
    .click();
  const frame = page.frameLocator('.interaction-surface iframe');
  await frame.getByRole('button', { name: 'Zählen', exact: true }).click();
  await expect(frame.locator('output')).toHaveText('1');
  await expect(frame.locator('body')).toHaveAttribute('data-isolated', 'yes');
  expect(await page.locator('body').getAttribute('data-escaped')).toBeNull();
  expect(leaked).toBe(false);
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  const id = page.url().split('/').pop();
  const book = await (
    await page.request.post('/api/werkstatt', {
      headers: { Origin: 'http://localhost:3100' },
      data: { action: 'open', id },
    })
  ).json();
  const src = book.pages[0].elements[0].src;
  const file = await page.request.get(src);
  expect(file.headers()['content-type']).toContain('text/plain');
  expect(file.headers()['content-disposition']).toContain('attachment');
});
