import { test, expect, type Page } from '@playwright/test';
import { musicPage, musicPreset, musicSettings } from '../../src/lib/learning/music';
const headers = { Origin: 'http://localhost:3100' };
async function setup(page: Page, empty = false) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
  const upload = await page.request.post('/api/medien', { headers: { ...headers, 'Content-Type': 'image/png' }, data: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jhN8AAAAASUVORK5CYII=', 'base64') });
  expect(upload.ok()).toBeTruthy(); const { src } = await upload.json();
  const queries: URL[] = [];
  await page.route('**/api/bilder**', async route => {
    if (route.request().method() === 'POST') return route.fulfill({ json: { src } });
    const url = new URL(route.request().url()); queries.push(url);
    await route.fulfill({ json: { items: [{ full: 'https://static.arasaac.org/pictograms/1/1_300.png' }], more: false, page: 1 } });
  });
  const response = await page.request.post('/api/werkstatt', { headers, data: { action: 'create', title: 'Automatische Liedbilder', ...(empty ? {} : { pages: musicPage(musicSettings(musicPreset('karaoke')!)) }) } });
  const { book } = await response.json(); await page.goto(`/heft/${book.id}`);
  const read = async () => { const r = await page.request.post('/api/werkstatt', { headers, data: { action: 'open', id: book.id } }); return (await r.json()).pages; };
  return { queries, read, src };
}
test('Liedauswahl ergänzt Bilder automatisch und respektiert entfernte Bilder beim Speichern', async ({ page }) => {
  const { queries, read, src } = await setup(page);
  await page.locator('.interaction-surface .music-settings-launch').click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeug gestalten', exact: true });
  await dialog.getByRole('button', { name: /Alle Vögel sind schon da/ }).click();
  await expect(dialog.getByText(/Bilder automatisch ergänzt\./)).toBeVisible();
  expect(queries.some(q => q.searchParams.get('q') === 'Vögel' && q.searchParams.get('begriff') === 'Vogel')).toBeTruthy();
  await dialog.getByRole('tab', { name: 'Bilder', exact: true }).click();
  await expect(dialog.getByRole('button', { name: 'Bild für Vögel', exact: true }).locator('img')).toHaveAttribute('src', src);
  await dialog.getByLabel('statt Wort: Vögel', { exact: true }).check();
  await dialog.getByRole('button', { name: 'Bild von Amsel entfernen', exact: true }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click(); await expect(dialog).toHaveCount(0);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const config = (await read())[0].elements[0].settings.musicConfig;
  expect(config.musicPictures.find((p: { word: string }) => p.word === 'vögel')).toEqual({ word: 'vögel', img: src, instead: true });
  expect(config.musicPictures.some((p: { word: string }) => p.word === 'amsel')).toBe(false); expect(config.karaoke.nopic).toContain('amsel');
});
test('Mehrere ausgewählte Lieder erhalten vor dem Einfügen ihre eigenen Wortbilder', async ({ page }) => {
  const { read } = await setup(page, true);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Lernwerkzeuge', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Lernwerkzeuge & Übungen' }); await dialog.getByRole('button', { name: 'Karaoke-Liedblatt', exact: true }).click();
  await dialog.getByRole('button', { name: /^Bruder Jakob/ }).click(); await dialog.getByRole('button', { name: /^Alle Vögel sind schon da/ }).click();
  await dialog.getByRole('button', { name: 'Auf die Seite übernehmen', exact: true }).click(); await expect(dialog).toHaveCount(0);
  await expect(page.getByText('✓ Gespeichert', { exact: true })).toBeVisible();
  const pages = await read(); expect(pages).toHaveLength(2);
  const configs = pages.map((p: { elements: { settings: { musicConfig: { musicPictures: { word: string }[] } } }[] }) => p.elements[0].settings.musicConfig);
  expect(configs[0].musicPictures.some((p: { word: string }) => p.word === 'glocken')).toBeTruthy(); expect(configs[1].musicPictures.some((p: { word: string }) => p.word === 'vögel')).toBeTruthy();
});
