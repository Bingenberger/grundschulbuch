import { test, expect, type Page } from '@playwright/test';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}
test('Videosuche: Schlüssel in der Verwaltung, YouTube-Video suchen, einfügen und als Webseite ändern', async ({ page }) => {
  await login(page);
  // Admin area: a wrong key is refused, the right one is checked and saved.
  await page.goto('/verwaltung?bereich=einstellungen');
  await expect(page.getByRole('heading', { name: 'YouTube-Videosuche' })).toBeVisible();
  await expect(page.getByText('Noch nicht eingerichtet.')).toBeVisible();
  const key = page.getByLabel('API-Schlüssel für YouTube');
  await key.fill('AIzaFALSCH');
  await page.getByRole('button', { name: 'Prüfen und speichern' }).click();
  await expect(page.locator('p.fehler')).toContainText('ungültig');
  await key.fill('AIzaTESTSCHLUESSEL');
  await page.getByRole('button', { name: 'Prüfen und speichern' }).click();
  await expect(page.getByText('Der Schlüssel wurde geprüft und gespeichert.')).toBeVisible();
  await expect(page.getByText('endet auf „…SSEL“')).toBeVisible();
  expect(await page.content()).not.toContain('AIzaTESTSCHLUESSEL');

  // Editor: Internet → Video suchen.
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Videoprobe' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Internet', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Video oder Webseite einfügen' });
  await dialog.getByRole('button', { name: 'Video suchen', exact: true }).click();
  await dialog.getByLabel('Suchbegriff').fill('Igel');
  await dialog.getByRole('button', { name: 'Suchen', exact: true }).click();
  const results = dialog.getByRole('list', { name: 'Videos zu „Igel“' });
  await expect(results.getByRole('listitem')).toHaveCount(2);
  await expect(results.getByRole('listitem').first()).toContainText('Der Igel im Winter & Frühling');
  await expect(results.getByRole('listitem').first()).toContainText('3:20');
  await expect(results.getByRole('listitem').nth(1)).toContainText('12:05');
  await dialog.getByRole('button', { name: 'Kurz (unter 4 Min.)' }).click();
  await expect(dialog.getByRole('button', { name: 'Kurz (unter 4 Min.)' })).toHaveAttribute('aria-pressed', 'true');
  await results.getByRole('listitem').first().getByRole('button', { name: 'Auswählen' }).click();

  await expect(dialog.getByLabel('Internetadresse')).toHaveValue('https://www.youtube.com/watch?v=igelvideo01');
  await expect(dialog.getByText('Video von YouTube')).toBeVisible();
  await expect(dialog.getByLabel('Titel (wird auch vorgelesen)')).toHaveValue('Der Igel im Winter & Frühling');
  await dialog.getByRole('button', { name: 'Einfügen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const poster = page.locator('.interaction-surface .embed-poster img');
  await expect(poster).toHaveAttribute('src', /^\/api\/medien\/[a-f0-9]{64}\.webp$/);
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');

  // „Ändern“: the same element becomes a web page shown in the notebook.
  await page.getByRole('button', { name: 'Ändern', exact: true }).click();
  const change = page.getByRole('dialog', { name: 'Video oder Webseite ändern' });
  await change.getByLabel('Internetadresse').fill('planet-schule.de');
  await expect(change.locator('.embed-kind')).toContainText('Webseite planet-schule.de');
  await change.getByRole('button', { name: 'Webseite direkt im Heft zeigen' }).click();
  await change.getByLabel('Titel (wird auch vorgelesen)').fill('Planet Schule');
  await change.getByRole('button', { name: 'Übernehmen', exact: true }).click();
  await expect(change).toHaveCount(0);
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');
  const book = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: created.book.id } })).json();
  const el = book.pages[0].elements.find((e: { type: string }) => e.type === 'embed');
  expect(el).toMatchObject({ embedKind: 'webpage', url: 'https://planet-schule.de/', alt: 'Planet Schule' });
  expect(el.poster).toBeUndefined();
});

test('Mediathek und Fehler 153: YouTube bekommt die Herkunft, ARD spielt nur mit erlaubtem Player, ZDF-Seiten öffnen die Mediathek', async ({ page }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Mediathek' } })).json();
  await page.goto(`/heft/${created.book.id}`);
  const tools = page.getByRole('navigation', { name: 'Werkzeuge' });

  // YouTube by address: the player needs the page's origin („Fehler 153“ otherwise).
  await tools.getByRole('button', { name: 'Internet', exact: true }).click();
  let dialog = page.getByRole('dialog', { name: 'Video oder Webseite einfügen' });
  await dialog.getByLabel('Internetadresse').fill('youtu.be/igelvideo02');
  await expect(dialog.getByLabel('Titel (wird auch vorgelesen)')).toHaveValue('Igel bauen ein Nest');
  await dialog.getByRole('button', { name: 'Vorschau abspielen' }).click();
  await expect(dialog.locator('.embed-preview iframe')).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  await dialog.getByRole('button', { name: 'Einfügen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.locator('.interaction-surface .embed-poster').click();
  const frame = page.locator('.interaction-surface iframe');
  await expect(frame).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/igelvideo02');
  await expect(frame).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

  // ARD, embedding allowed: the ARD player is stored.
  const ardOpen = 'Y3JpZERlcmxhdWJ0aWdlbGhlcmJzdA';
  await tools.getByRole('button', { name: 'Internet', exact: true }).click();
  dialog = page.getByRole('dialog', { name: 'Video oder Webseite einfügen' });
  await dialog.getByLabel('Internetadresse').fill(`https://www.ardmediathek.de/video/tiere/igel-im-herbst/wdr/${ardOpen}`);
  await expect(dialog.locator('.embed-kind')).toContainText('Video aus der ARD Mediathek');
  await expect(dialog.getByLabel('Titel (wird auch vorgelesen)')).toHaveValue('Igel im Herbst');
  await expect(dialog.getByText('läuft im Heft im Player der ARD Mediathek')).toBeVisible();
  await dialog.getByRole('button', { name: 'Einfügen', exact: true }).click();
  await expect(dialog).toHaveCount(0);

  // ZDF page without the ZDF player: picture with title opening the Mediathek.
  await tools.getByRole('button', { name: 'Internet', exact: true }).click();
  dialog = page.getByRole('dialog', { name: 'Video oder Webseite einfügen' });
  await dialog.getByLabel('Internetadresse').fill('www.zdf.de/video/dokus/igel-100/igel-doku-100');
  await expect(dialog.getByLabel('Titel (wird auch vorgelesen)')).toHaveValue('Igel-Doku');
  await expect(dialog.getByText('erlaubt für dieses Video nicht')).toBeVisible();
  await dialog.getByRole('button', { name: 'Einfügen', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const card = page.locator('.interaction-surface a.embed-poster');
  await expect(card).toHaveAttribute('href', 'https://www.zdf.de/video/dokus/igel-100/igel-doku-100');
  await expect(card).toContainText('ZDF-Mediathek ↗');
  await expect(card.locator('img')).toHaveAttribute('src', /^\/api\/medien\/[a-f0-9]{64}\.webp$/);
  await expect(page.locator('.save-status')).toHaveText('✓ Gespeichert');

  const book = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'open', id: created.book.id } })).json();
  const urls = book.pages[0].elements.filter((e: { type: string }) => e.type === 'embed').map((e: { url: string; poster?: string }) => [e.url, !!e.poster]);
  expect(urls).toEqual([
    ['https://youtu.be/igelvideo02', true],
    [`https://www.ardmediathek.de/embed/${ardOpen}`, true],
    ['https://www.zdf.de/video/dokus/igel-100/igel-doku-100', true],
  ]);
});
