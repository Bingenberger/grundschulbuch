import { test, expect, type Page } from '@playwright/test';
import { randomBytes } from 'node:crypto';
const origin = { Origin: 'http://localhost:3100' };
async function login(page: Page) {
  await page.goto('/anmelden'); await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel'); await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click(); await expect(page).toHaveURL('/');
}

test('Kinder: Einfügen, Ton, Internet und Seite sind schaltbar und funktionieren; neue Kinderhefte im Querformat', async ({ page, browser }) => {
  await login(page);
  const created = await (await page.request.post('/api/werkstatt', { headers: origin, data: { action: 'create', title: 'Werkzeugprobe', orientation: 'landscape' } })).json();
  const request = async (action: string, values: object) => {
    const response = await page.request.post('/api/klassen', { headers: origin, data: { action, ...values } });
    expect(response.ok()).toBeTruthy(); return response.json();
  };
  let klass = await request('create', { title: 'Werkzeugklasse' });
  klass = await request('change', { id: klass.id, addChild: 'Lea' });
  const card = randomBytes(32).toString('hex');
  await request('change', { id: klass.id, childId: klass.children[0].id, digest: card });
  const copies = await request('distribute', { id: klass.id, bookId: created.book.id });

  // The class page offers the new switches; Ton and Internet start switched off.
  await page.goto('/klassen');
  await page.getByRole('navigation', { name: 'Klassen' }).getByRole('button', { name: 'Werkzeugklasse' }).click();
  const switches = page.getByRole('group', { name: 'Funktionen für die Klasse' });
  await expect(switches.getByRole('button', { name: 'Einfügen (Formen, Sticker, Stempel)' })).toHaveAttribute('aria-pressed', 'true');
  await expect(switches.getByRole('button', { name: 'Seite einstellen' })).toHaveAttribute('aria-pressed', 'true');
  for (const name of ['Ton aufnehmen', 'Internet (Webseiten, Videos)']) {
    const button = switches.getByRole('button', { name });
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  }

  const context = await browser.newContext();
  try {
    const child = await context.newPage();
    await child.goto('/kinder');
    expect((await child.request.post('/api/kinder', { headers: origin, data: { action: 'login', digest: card } })).ok()).toBeTruthy();
    await child.goto(`/kinder/heft/${copies[0].id}`);
    const rail = child.getByRole('navigation', { name: 'Werkzeuge' });
    for (const name of ['Ton', 'Internet', 'Einfügen', 'Seite']) await expect(rail.getByRole('button', { name, exact: true })).toBeVisible();
    const surface = child.locator('.interaction-surface');
    const status = child.locator('.save-status');

    // Einfügen: a shape and an emoji stamp (children's stamps stay movable).
    await rail.getByRole('button', { name: 'Einfügen', exact: true }).click();
    const bar = child.getByRole('region', { name: 'Einfügen' });
    await bar.getByRole('button', { name: 'Stern', exact: true }).click();
    await expect(surface.locator('.page-element')).toHaveCount(1);
    await rail.getByRole('button', { name: 'Einfügen', exact: true }).click();
    await bar.getByRole('button', { name: 'Stempel', exact: true }).click();
    await bar.getByRole('group', { name: 'Emoji-Stempel' }).getByRole('button', { name: 'Daumen hoch' }).click();
    const box = (await surface.boundingBox())!;
    await child.mouse.click(box.x + box.width * 0.7, box.y + box.height * 0.6);
    await expect(surface.locator('.page-element', { hasText: '👍' })).toHaveCount(1);
    await expect(surface.locator('.page-element.locked')).toHaveCount(0);
    await expect(status).toHaveText('✓ Gespeichert');

    // Seite: the child changes the ruling, and the server accepts it.
    await rail.getByRole('button', { name: 'Seite', exact: true }).click();
    const pageBar = child.getByRole('region', { name: 'Seite einstellen' });
    await expect(pageBar.getByRole('button', { name: 'Vorlage', exact: true })).toHaveCount(0);
    await pageBar.getByRole('button', { name: 'Lineatur 1', exact: true }).click();
    await expect(status).toHaveText('✓ Gespeichert');

    // Internet: a video, but no own HTML apps.
    await rail.getByRole('button', { name: 'Internet', exact: true }).click();
    const embed = child.getByRole('dialog', { name: 'Video, Webseite oder QR-Code' });
    await expect(embed.getByRole('button', { name: 'Eigene HTML-App' })).toHaveCount(0);
    await embed.getByLabel('Internetadresse').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await embed.getByRole('button', { name: 'Einfügen', exact: true }).click();
    await expect(embed).toHaveCount(0);
    await expect(surface.locator('.page-element')).toHaveCount(3);
    await expect(status).toHaveText('✓ Gespeichert');

    // After reloading everything is still there.
    await child.reload();
    await expect(child.locator('.interaction-surface .page-element')).toHaveCount(3);

    // Ton: the server takes the child's recording now.
    const wav = Buffer.alloc(44 + 1600);
    wav.write('RIFF', 0); wav.writeUInt32LE(36 + 1600, 4); wav.write('WAVE', 8); wav.write('fmt ', 12); wav.writeUInt32LE(16, 16);
    wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(16000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
    wav.write('data', 36); wav.writeUInt32LE(1600, 40);
    const sound = await child.request.post(`/api/ton?book=${copies[0].id}`, { headers: { ...origin, 'Content-Type': 'audio/wav' }, data: wav });
    expect(sound.ok(), await sound.text()).toBeTruthy();

    // A notebook the child starts is in landscape.
    const own = await (await child.request.post('/api/kinder', { headers: origin, data: { action: 'create', title: 'Mein Heft' } })).json();
    expect(own.pages[0].orientation).toBe('landscape');
  } finally {
    await context.close();
  }
});
