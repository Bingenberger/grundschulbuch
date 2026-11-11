import { test, expect, type Page } from '@playwright/test';
import QRCode from 'qrcode';
async function teacher(page: Page) {
  await page.goto('/anmelden');
  await page.getByLabel('Name', { exact: true }).fill('Frau Beispiel');
  await page.getByLabel('PIN', { exact: true }).fill('483920');
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  await expect(page).toHaveURL('/');
}
test('Heft erstellen, schreiben, zeichnen, Seiten wechseln, wiederöffnen und drucken', async ({
  page,
}) => {
  // Exercise fallbacks used by older classroom panel browsers.
  await page.addInitScript(() => {
    Object.defineProperty(crypto, 'randomUUID', { value: undefined });
    Object.defineProperty(window, 'structuredClone', { value: undefined });
    Object.defineProperty(Array.prototype, 'at', { value: undefined });
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await teacher(page);
  await page.getByRole('button', { name: 'Neues Heft' }).click();
  await page.getByLabel('Name des Hefts').fill('Unsere Buchstaben');
  await page.getByRole('button', { name: 'Heft anlegen', exact: true }).click();
  await expect(page).toHaveURL(/\/heft\//);
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Seite', exact: true }).click();
  await page.getByRole('button', { name: 'Lineatur 1', exact: true }).click();
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await page
    .getByLabel('Text', { exact: true })
    .fill('Wir lernen gemeinsam.\nAa Bb Cc');
  const surface = await page.locator('.interaction-surface').boundingBox();
  expect(surface).not.toBeNull();
  await page.getByRole('button', { name: 'Stift', exact: true }).click();
  await page.mouse.move(surface!.x + 50, surface!.y + 160);
  await page.mouse.down();
  await page.mouse.move(surface!.x + 130, surface!.y + 180, { steps: 10 });
  await page.mouse.up();
  await page.getByRole('button', { name: 'Neue Seite', exact: true }).click();
  await page.getByRole('dialog', { name: 'Neue Seite' }).getByRole('button', { name: 'Vorlage Blanko' }).click();
  await expect(page.getByLabel('Seite 2 öffnen')).toBeVisible();
  await page.getByLabel('Seite 1 öffnen').click();
  await expect(page.getByRole('status')).toHaveText('✓ Gespeichert');
  await page.reload();
  await expect(page.locator('.interaction-surface .page-element')).toHaveCount(
    2,
  );
  await page.getByRole('button', { name: 'Tafelmodus', exact: true }).click();
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.getByRole('button', { name: 'Tafelmodus beenden' }).click();
  await page
    .getByRole('button', { name: 'Drucken / PDF', exact: true })
    .click();
  await expect(page).toHaveURL(/\/drucken\//);
  await expect(page.locator('.print-pages .paper')).toHaveCount(2);
  await page.getByRole('link', { name: '‹ Zurück zum Heft' }).click();
  await page.getByRole('button', { name: 'Mein Regal', exact: true }).click();
  await expect(
    page.getByRole('link', { name: 'Unsere Buchstaben', exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: '/tmp/grundschulbuch-regal-final.png',
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test('Klasse anlegen, Kartenprüfsumme zuordnen, austeilen und als Kind arbeiten', async ({
  page,
  browser,
}) => {
  await teacher(page);
  await page.getByRole('button', { name: 'Neues Heft' }).click();
  await page.getByLabel('Name des Hefts').fill('Mein ausgeteiltes Heft');
  await page.getByRole('button', { name: 'Heft anlegen', exact: true }).click();
  await expect(page).toHaveURL(/\/heft\//);
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await page.getByLabel('Text', { exact: true }).fill('Schreibe deinen Namen.');
  await page.getByRole('button', { name: 'Mein Regal', exact: true }).click();
  await page.getByRole('link', { name: 'Meine Klassen' }).click();
  await page.getByLabel('Name der neuen Klasse').fill('1b');
  await page
    .getByRole('button', { name: 'Klasse anlegen', exact: true })
    .click();
  await page.getByLabel('Vorname oder Kürzel').fill('Ada');
  await page.getByRole('button', { name: 'Kind hinzufügen' }).click();
  await expect(page.getByText('Noch keine Karte')).toBeVisible();
  const classesResponse = await page.request.post('/api/klassen', {
    headers: { Origin: 'http://localhost:3100' },
    data: { action: 'list' },
  });
  const classes = await classesResponse.json();
  const klass = classes.find((c: { title: string }) => c.title === '1b');
  const digest = await page.evaluate(async () =>
    Array.from(
      new Uint8Array(
        await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode('test-card-very-long-entropy-abcdefghijkl'),
        ),
      ),
      (n) => n.toString(16).padStart(2, '0'),
    ).join(''),
  );
  await page.request.post('/api/klassen', {
    headers: { Origin: 'http://localhost:3100' },
    data: {
      action: 'change',
      id: klass.id,
      childId: klass.children[0].id,
      digest,
    },
  });
  await page
    .getByRole('group', { name: 'Heft zum Austeilen' })
    .getByRole('button', { name: 'Mein ausgeteiltes Heft', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Heft austeilen', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveText(
    'Das Heft wurde ausgeteilt.',
  );
  const context = await browser.newContext();
  const child = await context.newPage();
  await child.goto('/kinder');
  await child.request.post('/api/kinder', {
    headers: { Origin: 'http://localhost:3100' },
    data: { action: 'login', digest },
  });
  await child.reload();
  await expect(
    child.getByRole('heading', { name: 'Hallo Ada!' }),
  ).toBeVisible();
  await child.getByRole('link', { name: 'Mein ausgeteiltes Heft' }).click();
  await expect(child.locator('.page-element')).toHaveCount(1);
  await child.screenshot({
    path: '/tmp/grundschulbuch-kind-final.png',
    fullPage: true,
  });
  await child.getByRole('button', { name: 'Text', exact: true }).click();
  await child.getByLabel('Text', { exact: true }).fill('Ada');
  await child.getByRole('button', { name: 'Fertig', exact: true }).click();
  await expect(
    child.getByRole('heading', { name: 'Dein Heft wartet auf dich.' }),
  ).toBeVisible();
  await child.goBack();
  await expect(
    child.getByRole('heading', { name: 'Dein Heft wartet auf dich.' }),
  ).toBeVisible();
  await context.close();
});

test('Generator, Sammlung und Kollegium verwenden', async ({
  page,
  browser,
}) => {
  await teacher(page);
  await page.getByRole('button', { name: 'Neues Heft' }).click();
  await page.getByLabel('Name des Hefts').fill('Meine Arbeitsblätter');
  await page.getByRole('button', { name: 'Heft anlegen', exact: true }).click();
  await page.getByRole('navigation', { name: 'Werkzeuge' }).getByRole('button', { name: 'Einfügen', exact: true }).click();
  await page
    .getByRole('button', { name: 'Arbeitsblatt', exact: true })
    .click();
  await page
    .getByRole('group', { name: 'Übungsformat' })
    .getByRole('button', { name: 'Rechenaufgaben', exact: true })
    .click();
  await page.getByRole('button', { name: 'Seiten ins Heft einfügen' }).click();
  await expect(page.locator('.page-thumbnail')).toHaveCount(3);
  await page.screenshot({
    path: '/tmp/grundschulbuch-editor-final.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await page
    .getByLabel('Text', { exact: true })
    .fill('Eine wiederverwendbare Idee');
  page.once('dialog', (dialog) => dialog.accept('Meine Idee'));
  await page.getByRole('button', { name: 'Anordnen', exact: true }).click();
  await page
    .getByRole('button', { name: 'In Sammlung sichern', exact: true })
    .click();
  const collection = page.getByRole('dialog', { name: 'Meine Sammlung' });
  await expect(
    collection.getByText('Meine Idee', { exact: true }),
  ).toBeVisible();
  await collection.locator('.template-grid > div > button').first().click();

  await page.getByRole('button', { name: 'Weitergeben', exact: true }).click();
  await page
    .getByRole('group', { name: 'Empfangende Lehrkraft' })
    .getByRole('button', { name: 'Herr Muster', exact: true })
    .click();
  await page.getByRole('button', { name: 'Kopie weitergeben' }).click();
  await expect(page.getByRole('status').last()).toContainText('Kopie liegt');
  const colleagueContext = await browser.newContext();
  const colleague = await colleagueContext.newPage();
  await colleague.goto('/anmelden');
  await colleague.getByLabel('Name', { exact: true }).fill('Herr Muster');
  await colleague.getByLabel('PIN', { exact: true }).fill('483920');
  await colleague
    .getByRole('button', { name: 'Anmelden', exact: true })
    .click();
  await expect(
    colleague.getByRole('link', { name: 'Meine Arbeitsblätter', exact: true }),
  ).toBeVisible();
  await colleagueContext.close();
});

test('Eingebauter Scanner liest eine synthetische QR-Karte und sendet nur ihre Prüfsumme', async ({
  page,
  browser,
}) => {
  await teacher(page);
  const headers = { Origin: 'http://localhost:3100' };
  const request = async (data: object) => {
    const response = await page.request.post('/api/klassen', { headers, data });
    expect(response.ok()).toBeTruthy();
    return response.json();
  };
  let klass = await request({ action: 'create', title: 'Scanner-Test' });
  klass = await request({ action: 'change', id: klass.id, addChild: 'Mika' });
  const payload = 'synthetic-anton-card-long-random-value-1234567890';
  const digest = await page.evaluate(
    async (raw) =>
      Array.from(
        new Uint8Array(
          await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)),
        ),
        (n) => n.toString(16).padStart(2, '0'),
      ).join(''),
    payload,
  );
  await request({
    action: 'change',
    id: klass.id,
    childId: klass.children[0].id,
    digest,
  });
  const qr = await QRCode.toDataURL(payload, { width: 512, margin: 4 });
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    hasTouch: true,
  });
  await context.addInitScript((dataUrl) => {
    navigator.mediaDevices.getUserMedia = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 512;
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      canvas.getContext('2d')!.drawImage(image, 0, 0);
      return canvas.captureStream(15);
    };
  }, qr);
  const child = await context.newPage();
  const sent: string[] = [];
  child.on('request', (request) => {
    if (request.url().endsWith('/api/kinder'))
      sent.push(request.postData() || '');
  });
  await child.goto('/kinder');
  await child
    .getByRole('button', { name: /Karte scannen/ })
    .last()
    .click();
  await expect(
    child.getByRole('heading', { name: 'Hallo Mika!' }),
  ).toBeVisible();
  expect(sent.some((body) => body.includes(payload))).toBe(false);
  expect(sent.some((body) => body.includes(digest))).toBe(true);
  await context.close();
});
